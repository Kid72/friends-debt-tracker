import React, { useState, useEffect } from 'react';
import { useI18n } from '../i18n';
import Avatar from './Common/Avatar';
import { X, Receipt, Check, AlertCircle } from 'lucide-react';

export default function ExpenseModal({
  isOpen,
  onClose,
  onSave,
  members = [],
  activeMemberId,
  currency = '₼',
  editingExpense = null
}) {
  const { t } = useI18n();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [splitType, setSplitType] = useState('EQUAL'); // 'EQUAL' | 'EXACT'
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [exactAmounts, setExactAmounts] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title || '');
      setAmount(editingExpense.amount ? String(editingExpense.amount) : '');
      setPaidBy(editingExpense.paidBy || (members[0] ? members[0].id : ''));
      setDate(editingExpense.date || new Date().toISOString().split('T')[0]);
      setSplitType(editingExpense.splitType || 'EQUAL');

      const initialSelected = (editingExpense.splits || []).map((s) => s.memberId);
      setSelectedMembers(initialSelected);

      const exacts = {};
      (editingExpense.splits || []).forEach((s) => {
        exacts[s.memberId] = String(s.amount);
      });
      setExactAmounts(exacts);
    } else {
      setTitle('');
      setAmount('');
      setPaidBy(activeMemberId || (members[0] ? members[0].id : ''));
      setDate(new Date().toISOString().split('T')[0]);
      setSplitType('EQUAL');
      setSelectedMembers(members.map((m) => m.id));
      setExactAmounts({});
    }
    setError('');
  }, [isOpen, editingExpense, members, activeMemberId]);

  if (!isOpen) return null;

  const handleToggleMember = (mId) => {
    if (selectedMembers.includes(mId)) {
      if (selectedMembers.length === 1) return; // Keep at least one
      setSelectedMembers(selectedMembers.filter((id) => id !== mId));
    } else {
      setSelectedMembers([...selectedMembers, mId]);
    }
  };

  const handleExactChange = (mId, val) => {
    setExactAmounts({
      ...exactAmounts,
      [mId]: val
    });
  };

  const numAmount = parseFloat(amount) || 0;
  const equalPerPerson = selectedMembers.length > 0 ? (numAmount / selectedMembers.length) : 0;

  // Validate exact sum
  let exactSum = 0;
  if (splitType === 'EXACT') {
    selectedMembers.forEach((mId) => {
      exactSum += parseFloat(exactAmounts[mId]) || 0;
    });
  }

  const handleSave = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError(t('expensePlaceLabel'));
      return;
    }

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Məbləğ müsbət ədəd olmalıdır');
      return;
    }

    if (!paidBy) {
      setError(t('paidByLabel'));
      return;
    }

    if (selectedMembers.length === 0) {
      setError('Ən azı bir iştirakçı seçilməlidir');
      return;
    }

    let splits = [];
    if (splitType === 'EQUAL') {
      const share = Math.round((numAmount / selectedMembers.length) * 100) / 100;
      let totalAssigned = 0;
      splits = selectedMembers.map((mId, idx) => {
        if (idx === selectedMembers.length - 1) {
          const lastShare = Math.round((numAmount - totalAssigned) * 100) / 100;
          return { memberId: mId, amount: lastShare };
        }
        totalAssigned += share;
        return { memberId: mId, amount: share };
      });
    } else {
      // EXACT
      const diff = Math.abs(exactSum - numAmount);
      if (diff > 0.05) {
        setError(`Fərdi məbləğlərin cəmi (${exactSum.toFixed(2)}) ümumi hesabla (${numAmount.toFixed(2)}) uyğun gəlmir`);
        return;
      }
      splits = selectedMembers.map((mId) => ({
        memberId: mId,
        amount: parseFloat(exactAmounts[mId]) || 0
      }));
    }

    onSave({
      id: editingExpense ? editingExpense.id : `exp_${Date.now()}`,
      title: title.trim(),
      amount: numAmount,
      paidBy,
      date,
      splitType,
      splits
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-m3-surface-container-lowest rounded-3xl max-w-lg w-full p-6 shadow-m3-3 border border-m3-outline-variant/40 animate-slide-up relative my-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full text-m3-on-surface-variant hover:bg-m3-surface-container transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-2xl bg-m3-primary-container text-m3-on-primary-container">
            <Receipt className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-m3-on-surface">
            {editingExpense ? t('editExpenseTitle') : t('addExpenseTitle')}
          </h2>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl p-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Title / Place */}
          <div>
            <label className="block text-xs font-semibold text-m3-on-surface-variant mb-1">
              {t('expensePlaceLabel')} *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('expensePlacePlaceholder')}
              className="w-full bg-m3-surface-container-low rounded-2xl px-4 py-2.5 text-sm text-m3-on-surface border border-m3-outline-variant/50 focus:outline-none focus:border-m3-primary"
              required
            />
          </div>

          {/* Amount & Paid By */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-m3-on-surface-variant mb-1">
                {t('amountLabel')} ({currency}) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-m3-surface-container-low rounded-2xl px-4 py-2.5 text-sm font-semibold text-m3-on-surface border border-m3-outline-variant/50 focus:outline-none focus:border-m3-primary"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-m3-on-surface-variant mb-1">
                {t('paidByLabel')} *
              </label>
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="w-full bg-m3-surface-container-low rounded-2xl px-4 py-2.5 text-sm text-m3-on-surface border border-m3-outline-variant/50 focus:outline-none focus:border-m3-primary"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-m3-on-surface-variant mb-1">
              {t('dateLabel')}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-m3-surface-container-low rounded-2xl px-4 py-2 text-sm text-m3-on-surface border border-m3-outline-variant/50 focus:outline-none focus:border-m3-primary"
            />
          </div>

          {/* Split Mode Toggle: Equal vs Flexible */}
          <div>
            <label className="block text-xs font-semibold text-m3-on-surface-variant mb-1.5">
              {t('splitTypeLabel')}
            </label>
            <div className="grid grid-cols-2 gap-2 bg-m3-surface-container-low p-1 rounded-2xl border border-m3-outline-variant/40">
              <button
                type="button"
                onClick={() => setSplitType('EQUAL')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                  splitType === 'EQUAL'
                    ? 'bg-m3-primary text-m3-on-primary shadow-sm'
                    : 'text-m3-on-surface-variant hover:text-m3-on-surface'
                }`}
              >
                {t('splitEqual')}
              </button>
              <button
                type="button"
                onClick={() => setSplitType('EXACT')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                  splitType === 'EXACT'
                    ? 'bg-m3-primary text-m3-on-primary shadow-sm'
                    : 'text-m3-on-surface-variant hover:text-m3-on-surface'
                }`}
              >
                {t('splitFlexible')}
              </button>
            </div>
          </div>

          {/* Participants Selection & Splits */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-m3-on-surface-variant">
                {t('participantsIncluded')} ({selectedMembers.length})
              </label>
              {splitType === 'EQUAL' && numAmount > 0 && selectedMembers.length > 0 && (
                <span className="text-xs text-m3-primary font-bold">
                  ~{equalPerPerson.toFixed(2)} {currency} {t('perPerson')}
                </span>
              )}
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {members.map((m) => {
                const isSelected = selectedMembers.includes(m.id);
                return (
                  <div
                    key={m.id}
                    className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-m3-surface-container-low border-m3-primary/30'
                        : 'bg-m3-surface-container-lowest border-m3-outline-variant/20 opacity-60'
                    }`}
                  >
                    <label className="flex items-center gap-2.5 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleMember(m.id)}
                        className="w-4 h-4 rounded text-m3-primary focus:ring-m3-primary cursor-pointer"
                      />
                      <Avatar name={m.name} color={m.color} size="sm" />
                      <span className="text-xs font-semibold text-m3-on-surface">
                        {m.name}
                      </span>
                    </label>

                    {splitType === 'EXACT' && isSelected && (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.01"
                          value={exactAmounts[m.id] || ''}
                          onChange={(e) => handleExactChange(m.id, e.target.value)}
                          placeholder="0.00"
                          className="w-20 bg-m3-surface-container rounded-xl px-2 py-1 text-xs text-right font-semibold text-m3-on-surface border border-m3-outline-variant/40"
                        />
                        <span className="text-xs text-m3-on-surface-variant">{currency}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-m3-outline-variant/20">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-m3-on-surface-variant hover:bg-m3-surface-container transition-colors"
            >
              {t('cancelBtn')}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-m3-primary text-m3-on-primary hover:bg-m3-primary/90 shadow-m3-1 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              {t('saveExpenseBtn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
