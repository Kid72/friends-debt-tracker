import React from 'react';
import { useI18n } from '../i18n';
import Avatar from './Common/Avatar';
import { CheckCircle2, TrendingUp, TrendingDown, Users, Receipt } from 'lucide-react';

export default function HeroBalanceCard({
  activeMember,
  balance = 0,
  totalGroupExpense = 0,
  pendingTransfersCount = 0,
  currency = '₼',
  onSettleAllOrView
}) {
  const { t } = useI18n();

  const isPositive = balance > 0.01;
  const isNegative = balance < -0.01;
  const isZero = !isPositive && !isNegative;

  return (
    <div className="bg-m3-surface-container-lowest rounded-3xl p-5 sm:p-6 shadow-m3-1 border border-m3-outline-variant/30 relative overflow-hidden">
      {/* Decorative gradient blur background */}
      <div 
        className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none ${
          isPositive ? 'bg-green-500' : isNegative ? 'bg-red-500' : 'bg-blue-500'
        }`}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Active Member Status */}
        <div className="flex items-center gap-4">
          {activeMember ? (
            <Avatar name={activeMember.name} color={activeMember.color} size="xl" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-m3-secondary-container text-m3-on-secondary-container flex items-center justify-center font-bold text-xl">
              ?
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-m3-on-surface-variant">
                {activeMember ? activeMember.name : t('guestMode')}
              </span>
              <span className="text-xs bg-m3-surface-container px-2 py-0.5 rounded-full text-m3-on-surface-variant font-medium">
                {t('netBalance')}
              </span>
            </div>

            {/* Status Heading */}
            {isPositive && (
              <div className="mt-1">
                <div className="text-2xl sm:text-3xl font-bold text-m3-success flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  +{balance.toFixed(2)} {currency}
                </div>
                <p className="text-xs sm:text-sm text-m3-on-surface-variant font-medium">
                  {t('youAreOwed')}
                </p>
              </div>
            )}

            {isNegative && (
              <div className="mt-1">
                <div className="text-2xl sm:text-3xl font-bold text-m3-error flex items-center gap-2">
                  <TrendingDown className="w-6 h-6" />
                  {balance.toFixed(2)} {currency}
                </div>
                <p className="text-xs sm:text-sm text-m3-on-surface-variant font-medium">
                  {t('youOwe')}
                </p>
              </div>
            )}

            {isZero && (
              <div className="mt-1">
                <div className="text-2xl sm:text-3xl font-bold text-m3-primary flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  0.00 {currency}
                </div>
                <p className="text-xs sm:text-sm text-m3-on-surface-variant font-medium">
                  {t('allSettled')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Group Summary Chips */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 border-t md:border-t-0 md:border-l border-m3-outline-variant/40 pt-3 md:pt-0 md:pl-6">
          <div className="bg-m3-surface-container-low rounded-2xl p-3 flex-1 min-w-[130px]">
            <div className="flex items-center gap-1.5 text-xs text-m3-on-surface-variant font-medium">
              <Receipt className="w-3.5 h-3.5 text-m3-primary" />
              {t('groupTotalExpenses')}
            </div>
            <div className="text-lg font-bold text-m3-on-surface mt-0.5">
              {totalGroupExpense.toFixed(2)} {currency}
            </div>
          </div>

          <div className="bg-m3-surface-container-low rounded-2xl p-3 flex-1 min-w-[130px]">
            <div className="flex items-center gap-1.5 text-xs text-m3-on-surface-variant font-medium">
              <Users className="w-3.5 h-3.5 text-m3-primary" />
              {t('tabTransfers')}
            </div>
            <div className="text-lg font-bold text-m3-on-surface mt-0.5">
              {t('pendingTransfersCount', { count: pendingTransfersCount })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
