/**
 * Debt Simplification (Greedy Cash Flow Algorithm)
 * with origin tracking for human-readable chain redirection explanations.
 */

export function calculateBalancesAndSimplifiedTransfers(members, expenses, settlements, currency = '₼', lang = 'az') {
  const memberMap = new Map();
  members.forEach((m) => memberMap.set(m.id, m));

  // Initialize net balance for each member
  const balances = {};
  members.forEach((m) => {
    balances[m.id] = 0;
  });

  // Track raw direct debts before simplification: debtorId -> { creditorId -> amount }
  const rawDirectDebts = {};
  members.forEach((m1) => {
    rawDirectDebts[m1.id] = {};
    members.forEach((m2) => {
      if (m1.id !== m2.id) rawDirectDebts[m1.id][m2.id] = 0;
    });
  });

  // 1. Process Expenses
  expenses.forEach((exp) => {
    const payerId = exp.paidBy;
    const amount = Number(exp.amount) || 0;
    if (!balances.hasOwnProperty(payerId)) balances[payerId] = 0;
    balances[payerId] += amount;

    if (Array.isArray(exp.splits)) {
      exp.splits.forEach((split) => {
        const consumerId = split.memberId;
        const share = Number(split.amount) || 0;
        if (!balances.hasOwnProperty(consumerId)) balances[consumerId] = 0;
        balances[consumerId] -= share;

        if (consumerId !== payerId) {
          if (!rawDirectDebts[consumerId]) rawDirectDebts[consumerId] = {};
          rawDirectDebts[consumerId][payerId] = (rawDirectDebts[consumerId][payerId] || 0) + share;
        }
      });
    }
  });

  // 2. Process Settlements (debt payments)
  settlements.forEach((s) => {
    const fromId = s.fromMemberId;
    const toId = s.toMemberId;
    const amt = Number(s.amount) || 0;

    if (balances.hasOwnProperty(fromId)) balances[fromId] += amt;
    if (balances.hasOwnProperty(toId)) balances[toId] -= amt;

    if (rawDirectDebts[fromId] && rawDirectDebts[fromId][toId]) {
      rawDirectDebts[fromId][toId] = Math.max(0, rawDirectDebts[fromId][toId] - amt);
    }
  });

  // 3. Separate Debtors (balance < 0) and Creditors (balance > 0)
  const debtors = [];
  const creditors = [];

  Object.entries(balances).forEach(([mId, bal]) => {
    const rounded = Math.round(bal * 100) / 100;
    if (rounded < -0.01) {
      debtors.push({ id: mId, amount: Math.abs(rounded) });
    } else if (rounded > 0.01) {
      creditors.push({ id: mId, amount: rounded });
    }
  });

  // Sort descending by amount for greedy matching
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  // 4. Greedy Match
  const transfers = [];
  let dIdx = 0;
  let cIdx = 0;

  // Make copies of amounts
  const dWork = debtors.map((d) => ({ ...d }));
  const cWork = creditors.map((c) => ({ ...c }));

  while (dIdx < dWork.length && cIdx < cWork.length) {
    const debtor = dWork[dIdx];
    const creditor = cWork[cIdx];

    const transferAmount = Math.min(debtor.amount, creditor.amount);
    const roundedAmount = Math.round(transferAmount * 100) / 100;

    if (roundedAmount > 0) {
      // Trace original direct debts to see if this transfer is redirected
      const debtorDirectCreditors = Object.entries(rawDirectDebts[debtor.id] || {})
        .filter(([_, amt]) => amt > 0.01)
        .sort((a, b) => b[1] - a[1]);

      let redirectedFromMember = null;
      // If creditor is not in direct debts or there was an intermediate debt
      if (debtorDirectCreditors.length > 0 && !debtorDirectCreditors.some(([cId]) => cId === creditor.id)) {
        const topOrigCreditorId = debtorDirectCreditors[0][0];
        redirectedFromMember = memberMap.get(topOrigCreditorId) || null;
      }

      const debtorMember = memberMap.get(debtor.id) || { id: debtor.id, name: 'Naməlum' };
      const creditorMember = memberMap.get(creditor.id) || { id: creditor.id, name: 'Naməlum' };

      // Build explanation string
      let explanation = '';
      let isRedirected = false;

      if (redirectedFromMember && redirectedFromMember.id !== creditor.id) {
        isRedirected = true;
        const dName = debtorMember.name;
        const origName = redirectedFromMember.name;
        const cName = creditorMember.name;

        if (lang === 'az') {
          explanation = `Əməliyyatların sayını azaltmaq üçün ${dName}-in ${origName}-a olan ${roundedAmount.toFixed(2)} ${currency} borcu ${cName}-ə yönləndirildi`;
        } else if (lang === 'ru') {
          explanation = `Долг ${dName} перед ${origName} на ${roundedAmount.toFixed(2)} ${currency} перенаправлен ${cName} для сокращения числа переводов`;
        } else {
          explanation = `${dName}'s ${roundedAmount.toFixed(2)} ${currency} debt to ${origName} was redirected to ${cName} to optimize transfers`;
        }
      } else {
        if (lang === 'az') {
          explanation = 'Birbaşa borc hesabı';
        } else if (lang === 'ru') {
          explanation = 'Прямой расчет';
        } else {
          explanation = 'Direct transfer';
        }
      }

      transfers.push({
        id: `${debtor.id}_to_${creditor.id}_${Math.round(roundedAmount * 100)}`,
        fromMember: debtorMember,
        toMember: creditorMember,
        amount: roundedAmount,
        isRedirected,
        explanation,
        redirectedFrom: redirectedFromMember
      });
    }

    debtor.amount = Math.round((debtor.amount - transferAmount) * 100) / 100;
    creditor.amount = Math.round((creditor.amount - transferAmount) * 100) / 100;

    if (debtor.amount < 0.01) dIdx++;
    if (creditor.amount < 0.01) cIdx++;
  }

  return {
    balances,
    transfers
  };
}
