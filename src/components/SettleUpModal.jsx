import React, { useState } from 'react';
import { useI18n } from '../i18n';
import Avatar from './Common/Avatar';
import { ArrowRight, Check, X, Share2, Sparkles } from 'lucide-react';

export default function SettleUpModal({
  transfer,
  currency = '₼',
  isOpen,
  onClose,
  onConfirm
}) {
  const { t } = useI18n();
  const [justSettled, setJustSettled] = useState(false);
  const [settleData, setSettleData] = useState(null);

  if (!isOpen || !transfer) return null;

  const handleConfirm = () => {
    onConfirm(transfer);
    setSettleData(transfer);
    setJustSettled(true);
  };

  const handleShareWhatsApp = () => {
    if (!settleData) return;
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const text = `${t('waSettleMessageHeader')}\n${t('waSettleMessageBody', {
      debtor: settleData.fromMember.name,
      amount: settleData.amount.toFixed(2),
      currency,
      receiver: settleData.toMember.name
    })}\n🔗 ${currentUrl}`;

    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-m3-surface-container-lowest rounded-3xl max-w-md w-full p-6 shadow-m3-3 border border-m3-outline-variant/40 animate-slide-up relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full text-m3-on-surface-variant hover:bg-m3-surface-container transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!justSettled ? (
          <div>
            <div className="flex items-center gap-2 text-m3-primary mb-2">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-lg font-bold text-m3-on-surface">
                {t('settleModalTitle')}
              </h3>
            </div>
            
            <p className="text-sm text-m3-on-surface-variant mb-5">
              {t('settleConfirmQuestion')}
            </p>

            {/* Transfer Visual */}
            <div className="bg-m3-surface-container-low rounded-2xl p-4 flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                <Avatar name={transfer.fromMember.name} color={transfer.fromMember.color} size="md" />
                <span className="text-sm font-semibold text-m3-on-surface">
                  {transfer.fromMember.name}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-base font-bold text-m3-primary">
                  {transfer.amount.toFixed(2)} {currency}
                </span>
                <ArrowRight className="w-4 h-4 text-m3-outline" />
              </div>

              <div className="flex items-center gap-2">
                <Avatar name={transfer.toMember.name} color={transfer.toMember.color} size="md" />
                <span className="text-sm font-semibold text-m3-on-surface">
                  {transfer.toMember.name}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-m3-on-surface-variant hover:bg-m3-surface-container transition-colors"
              >
                {t('cancelBtn')}
              </button>
              <button
                onClick={handleConfirm}
                className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-m3-primary text-m3-on-primary hover:bg-m3-primary/90 shadow-m3-1 flex items-center gap-2 transition-all active:scale-95"
              >
                <Check className="w-4 h-4" />
                {t('settleUpBtn')}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-3">
            <div className="w-16 h-16 rounded-full bg-m3-success-container text-m3-on-success-container flex items-center justify-center mx-auto mb-3 text-2xl animate-bounce">
              🎉
            </div>
            <h3 className="text-lg font-bold text-m3-on-surface mb-1">
              {t('settleRecordedSuccess')}
            </h3>
            <p className="text-sm text-m3-on-surface-variant mb-6">
              {settleData.fromMember.name} ➡️ {settleData.amount.toFixed(2)} {currency} ➡️ {settleData.toMember.name}
            </p>

            <div className="space-y-2">
              <button
                onClick={handleShareWhatsApp}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold rounded-full px-5 py-3 shadow-sm transition-transform active:scale-95 text-sm"
              >
                <Share2 className="w-4 h-4" />
                {t('sendWhatsAppProof')}
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-full text-sm font-semibold text-m3-on-surface-variant hover:bg-m3-surface-container transition-colors"
              >
                {t('closeBtn')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
