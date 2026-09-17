/**
 * Gamification Service: "Şərəf Lövhəsi" / "Зал славы" / "Hall of Fame"
 * Evaluates dynamic titles and statistics for each member:
 * 1. ⚡ "Gecənin sponsoru" (Night's Sponsor): Highest total amount of bills paid
 * 2. ⚡ "İldırım ödəyici" (Lightning Payer): Fastest / most debts settled
 * 3. 🐢 ""Sabah ataram" bəy" (Mr. "I'll send tomorrow"): Member with highest unpaid debt / longest waiting
 * 4. 🍕 "Məclisin canı" (Life of the Party): Attended the most hangouts
 */

export function calculateGamificationBadges(members, expenses, settlements, balances) {
  const stats = {};

  members.forEach((m) => {
    stats[m.id] = {
      member: m,
      totalPaid: 0,
      eventsAttended: 0,
      settledCount: 0,
      currentBalance: balances[m.id] || 0,
      currentDebt: (balances[m.id] || 0) < -0.01 ? Math.abs(balances[m.id]) : 0,
      badges: []
    };
  });

  // Calculate total paid & events attended
  expenses.forEach((exp) => {
    const payerId = exp.paidBy;
    const amount = Number(exp.amount) || 0;
    if (stats[payerId]) {
      stats[payerId].totalPaid += amount;
    }

    if (Array.isArray(exp.splits)) {
      exp.splits.forEach((s) => {
        if (stats[s.memberId]) {
          stats[s.memberId].eventsAttended += 1;
        }
      });
    }
  });

  // Calculate settled count
  settlements.forEach((s) => {
    const fromId = s.fromMemberId;
    if (stats[fromId]) {
      stats[fromId].settledCount += 1;
    }
  });

  const memberList = Object.values(stats);

  // 1. Sponsor of the night: highest totalPaid > 0
  let topSponsor = null;
  let maxPaid = 0;
  memberList.forEach((st) => {
    if (st.totalPaid > maxPaid) {
      maxPaid = st.totalPaid;
      topSponsor = st.member.id;
    }
  });
  if (topSponsor && maxPaid > 0) {
    stats[topSponsor].badges.push({
      key: 'sponsor',
      icon: '⚡',
      type: 'gold'
    });
  }

  // 2. Lightning Payer: highest settledCount > 0
  let topSettler = null;
  let maxSettled = 0;
  memberList.forEach((st) => {
    if (st.settledCount > maxSettled) {
      maxSettled = st.settledCount;
      topSettler = st.member.id;
    }
  });
  if (topSettler && maxSettled > 0) {
    stats[topSettler].badges.push({
      key: 'lightning',
      icon: '⚡',
      type: 'blue'
    });
  }

  // 3. Mr. "I'll send tomorrow": highest currentDebt > 0
  let topDebtor = null;
  let maxDebt = 0;
  memberList.forEach((st) => {
    if (st.currentDebt > maxDebt) {
      maxDebt = st.currentDebt;
      topDebtor = st.member.id;
    }
  });
  if (topDebtor && maxDebt > 0.01) {
    stats[topDebtor].badges.push({
      key: 'tomorrow',
      icon: '🐢',
      type: 'orange'
    });
  }

  // 4. Life of the Party: highest eventsAttended > 0
  let topParty = null;
  let maxEvents = 0;
  memberList.forEach((st) => {
    if (st.eventsAttended > maxEvents) {
      maxEvents = st.eventsAttended;
      topParty = st.member.id;
    }
  });
  if (topParty && maxEvents > 0) {
    stats[topParty].badges.push({
      key: 'partyLife',
      icon: '🍕',
      type: 'green'
    });
  }

  return {
    memberStats: stats,
    topSponsorId: topSponsor,
    topSettlerId: topSettler,
    topDebtorId: topDebtor,
    topPartyId: topParty
  };
}
