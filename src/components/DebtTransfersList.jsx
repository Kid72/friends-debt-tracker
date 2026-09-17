import React from 'react';
import { useI18n } from '../i18n';
import Avatar from './Common/Avatar';
import { ArrowRight, Share2, Check, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

export default function DebtTransfersList({
  transfers = [],
  currency = '₼',
  onSettleUp,
  onShareWhatsApp,
  activeMemberId
}) {
  const { t } = useI18n();

  if (transfers.length === 0) {
    return (
      <div className="bg-m3-surface-container-lowest rounded-3xl p-8 text-center border border-m3-outline-variant/30 shadow-m3-1">
        <div className="w-16 h-16 rounded-full bg-m3-success-container text-m3-on-success-container flex items-center justify-center mx-auto mb-3 text-2xl">
          🎉
        </div>
        <h3 className="text-lg font-bold text-m3-on-surface">
          {t('noTransfersNeeded')}
        </h3>
        <p className="text-sm text-m3-on-surface-variant mt-1 max-w-sm mx-auto">
          {t('allSettledSubtitle')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with WhatsApp Report Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <h2 className="text-lg font-bold text-m3-on-surface flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-m3-primary" />
            {t('optimizedTransfersTitle')}
          </h2>
          <p className="text-xs text-m3-on-surface-variant">
            {t('optimizedTransfersSubtitle')}
          </p>
        </div>

        <button
          onClick={onShareWhatsApp}
          className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs sm:text-sm font-semibold rounded-full px-4 py-2 shadow-sm transition-transform active:scale-95 flex-shrink-0"
        >
          <Share2 className="w-4 h-4" />
          {t('shareWhatsAppBtn')}
        </button>
      </div>

      {/* Cards List */}
      <div className="grid gap-3 sm:gap-4">
        {transfers.map((item) => {
          const isMyDebt = activeMemberId && item.fromMember.id === activeMemberId;
          const isMyCredit = activeMemberId && item.toMember.id === activeMemberId;

          return (
            <div
              key={item.id}
              className={`rounded-3xl p-4 sm:p-5 border transition-all shadow-m3-1 ${
                isMyDebt
                  ? 'bg-red-50/60 border-red-200 ring-1 ring-red-300'
                  : isMyCredit
                  ? 'bg-green-50/60 border-green-200 ring-1 ring-green-300'
                  : 'bg-m3-surface-container-lowest border-m3-outline-variant/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Visual Flow: Debtor -> Creditor */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Avatar name={item.fromMember.name} color={item.fromMember.color} size="md" />
                    <div>
                      <div className="text-sm font-bold text-m3-on-surface">
                        {item.fromMember.name}
                      </div>
                      <div className="text-[11px] text-m3-error font-medium">
                        {t('owes')}
                      </div>
                    </div>
                  </div>

                  <div className="p-1.5 bg-m3-surface-container rounded-full text-m3-on-surface-variant">
                    <ArrowRight className="w-4 h-4" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Avatar name={item.toMember.name} color={item.toMember.color} size="md" />
                    <div>
                      <div className="text-sm font-bold text-m3-on-surface">
                        {item.toMember.name}
                      </div>
                      <div className="text-[11px] text-m3-success font-medium">
                        {t('to')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amount & Action Button */}
                <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-m3-outline-variant/20">
                  <div className="text-right">
                    <div className="text-xl sm:text-2xl font-bold text-m3-on-surface">
                      {item.amount.toFixed(2)} {currency}
                    </div>
                  </div>

                  <button
                    onClick={() => onSettleUp(item)}
                    className="inline-flex items-center gap-1.5 bg-m3-primary hover:bg-m3-primary/90 text-m3-on-primary text-xs sm:text-sm font-semibold rounded-full px-4 py-2 shadow-m3-1 active:scale-95 transition-all flex-shrink-0"
                  >
                    <Check className="w-4 h-4" />
                    {t('settleUpBtn')}
                  </button>
                </div>
              </div>

              {/* Debt Redirection Explanation */}
              {item.isRedirected ? (
                <div className="mt-3 bg-amber-50 border border-amber-200/80 rounded-2xl p-2.5 flex items-start gap-2 text-xs text-amber-900">
                  <RefreshCw className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">
                    {item.explanation}
                  </span>
                </div>
              ) : (
                <div className="mt-2 text-[11px] text-m3-on-surface-variant/80 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-m3-outline"></span>
                  {t('directTransferExplanation')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
