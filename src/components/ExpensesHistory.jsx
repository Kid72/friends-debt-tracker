import React, { useState } from 'react';
import { useI18n } from '../i18n';
import Avatar from './Common/Avatar';
import { Receipt, Trash2, Edit2, CheckCircle2, Calendar, User, Filter } from 'lucide-react';

export default function ExpensesHistory({
  expenses = [],
  settlements = [],
  members = [],
  currency = '₼',
  onEditExpense,
  onDeleteExpense
}) {
  const { t } = useI18n();
  const [filterMemberId, setFilterMemberId] = useState('');

  const memberMap = new Map();
  members.forEach((m) => memberMap.set(m.id, m));

  // Combine and sort chronologically descending
  const historyItems = [
    ...expenses.map((e) => ({ ...e, recordType: 'EXPENSE' })),
    ...settlements.map((s) => ({ ...s, recordType: 'SETTLEMENT' }))
  ].sort((a, b) => new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp));

  const filteredItems = filterMemberId
    ? historyItems.filter((item) => {
        if (item.recordType === 'EXPENSE') {
          return item.paidBy === filterMemberId || (item.splits || []).some((s) => s.memberId === filterMemberId);
        } else {
          return item.fromMemberId === filterMemberId || item.toMemberId === filterMemberId;
        }
      })
    : historyItems;

  return (
    <div className="space-y-4">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <h2 className="text-lg font-bold text-m3-on-surface flex items-center gap-2">
            <Receipt className="w-5 h-5 text-m3-primary" />
            {t('historyTitle')}
          </h2>
        </div>

        {/* Filter by Member */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-m3-on-surface-variant" />
          <select
            value={filterMemberId}
            onChange={(e) => setFilterMemberId(e.target.value)}
            className="bg-m3-surface-container-low text-m3-on-surface text-xs font-semibold rounded-full px-3 py-1.5 border border-m3-outline-variant/50 focus:outline-none"
          >
            <option value="">{t('filterAll')}</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* History Items */}
      {filteredItems.length === 0 ? (
        <div className="bg-m3-surface-container-lowest rounded-3xl p-8 text-center border border-m3-outline-variant/30 shadow-m3-1">
          <p className="text-sm text-m3-on-surface-variant">
            {t('noExpensesYet')}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            if (item.recordType === 'EXPENSE') {
              const payer = memberMap.get(item.paidBy) || { name: 'Naməlum' };
              return (
                <div
                  key={item.id}
                  className="bg-m3-surface-container-lowest rounded-3xl p-4 sm:p-5 border border-m3-outline-variant/30 shadow-m3-1 hover:border-m3-primary/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <Avatar name={payer.name} color={payer.color} size="md" />
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-m3-on-surface">
                          {item.title}
                        </h4>
                        <div className="text-xs text-m3-on-surface-variant flex flex-wrap items-center gap-2 mt-1">
                          <span className="font-semibold text-m3-primary">
                            {payer.name} {t('paidByLabel').toLowerCase()}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {item.date}
                          </span>
                          <span>•</span>
                          <span className="bg-m3-surface-container px-2 py-0.5 rounded-full text-[11px] font-medium">
                            {item.splitType === 'EXACT' ? t('splitFlexible') : t('splitEqual')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-base sm:text-lg font-bold text-m3-on-surface">
                        {item.amount.toFixed(2)} {currency}
                      </div>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <button
                          onClick={() => onEditExpense(item)}
                          className="p-1.5 rounded-full text-m3-on-surface-variant hover:bg-m3-surface-container transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteExpense(item.id)}
                          className="p-1.5 rounded-full text-m3-error hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Split participant avatars */}
                  <div className="mt-3 pt-3 border-t border-m3-outline-variant/20 flex items-center justify-between text-xs text-m3-on-surface-variant">
                    <span>{t('participantsIncluded')}:</span>
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {(item.splits || []).map((s) => {
                        const m = memberMap.get(s.memberId);
                        if (!m) return null;
                        return (
                          <div key={s.memberId} title={`${m.name}: ${s.amount} ${currency}`}>
                            <Avatar name={m.name} color={m.color} size="xs" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            } else {
              // Settlement
              const fromM = memberMap.get(item.fromMemberId) || { name: 'Naməlum' };
              const toM = memberMap.get(item.toMemberId) || { name: 'Naməlum' };
              return (
                <div
                  key={item.id}
                  className="bg-green-50/50 rounded-3xl p-4 border border-green-200/80 shadow-m3-1 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-green-900">
                        {t('settlementRecord')}
                      </div>
                      <div className="text-xs text-green-800">
                        {fromM.name} ➡️ {toM.name}
                      </div>
                      <div className="text-[10px] text-green-700/80 mt-0.5">
                        {item.date}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-bold text-green-800 text-sm sm:text-base">
                    {item.amount.toFixed(2)} {currency}
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
}
