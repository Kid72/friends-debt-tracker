import React from 'react';
import { useI18n } from '../i18n';
import { HelpCircle, X, Shield, Smartphone, ArrowRightLeft, UserCheck } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-m3-surface-container-lowest rounded-3xl max-w-lg w-full p-6 shadow-m3-3 border border-m3-outline-variant/40 animate-slide-up relative my-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full text-m3-on-surface-variant hover:bg-m3-surface-container transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 rounded-2xl bg-m3-primary-container text-m3-on-primary-container">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-m3-on-surface">
            {t('helpTitle')}
          </h2>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-m3-on-surface-variant max-h-[70vh] overflow-y-auto pr-1">
          {/* 1. How it works */}
          <div className="bg-m3-surface-container-low rounded-2xl p-4">
            <h3 className="font-bold text-m3-on-surface flex items-center gap-2 mb-1.5 text-sm">
              <UserCheck className="w-4 h-4 text-m3-primary" />
              {t('helpHowItWorksTitle')}
            </h3>
            <p className="leading-relaxed">
              {t('helpHowItWorksText')}
            </p>
          </div>

          {/* 2. Debt Simplification */}
          <div className="bg-m3-surface-container-low rounded-2xl p-4">
            <h3 className="font-bold text-m3-on-surface flex items-center gap-2 mb-1.5 text-sm">
              <ArrowRightLeft className="w-4 h-4 text-m3-primary" />
              {t('helpDebtSimplificationTitle')}
            </h3>
            <p className="leading-relaxed">
              {t('helpDebtSimplificationText')}
            </p>
          </div>

          {/* 3. PWA Installation */}
          <div className="bg-m3-surface-container-low rounded-2xl p-4">
            <h3 className="font-bold text-m3-on-surface flex items-center gap-2 mb-1.5 text-sm">
              <Smartphone className="w-4 h-4 text-m3-primary" />
              {t('helpPwaInstallTitle')}
            </h3>
            <div className="space-y-2 mt-2">
              <div className="bg-m3-surface-container rounded-xl p-2.5">
                <span className="font-semibold text-m3-on-surface block mb-0.5">iOS (Apple iPhone / iPad):</span>
                <p className="text-xs leading-relaxed">{t('helpPwaInstallTextIos')}</p>
              </div>
              <div className="bg-m3-surface-container rounded-xl p-2.5">
                <span className="font-semibold text-m3-on-surface block mb-0.5">Android:</span>
                <p className="text-xs leading-relaxed">{t('helpPwaInstallTextAndroid')}</p>
              </div>
            </div>
          </div>

          {/* 4. About & Security */}
          <div className="bg-m3-surface-container-low rounded-2xl p-4">
            <h3 className="font-bold text-m3-on-surface flex items-center gap-2 mb-1.5 text-sm">
              <Shield className="w-4 h-4 text-m3-primary" />
              {t('helpSecurityTitle')}
            </h3>
            <p className="leading-relaxed">
              {t('helpSecurityText')}
            </p>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-m3-outline-variant/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-m3-primary text-m3-on-primary hover:bg-m3-primary/90 shadow-m3-1 transition-all"
          >
            {t('closeBtn')}
          </button>
        </div>
      </div>
    </div>
  );
}
