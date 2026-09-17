import React from 'react';
import { Plus } from 'lucide-react';
import { useI18n } from '../i18n';

export default function FloatingActionButton({ onClick }) {
  const { t } = useI18n();

  return (
    <button
      onClick={onClick}
      className="fixed right-5 bottom-5 z-30 flex items-center gap-2 bg-m3-primary hover:bg-m3-primary/90 text-m3-on-primary p-4 sm:px-5 sm:py-4 rounded-3xl sm:rounded-full shadow-m3-3 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-m3-primary/30 group"
      title={t('addExpenseTitle')}
    >
      <Plus className="w-6 h-6 transition-transform group-hover:rotate-90 duration-200" />
      <span className="hidden sm:inline text-sm font-semibold tracking-wide">
        {t('addExpenseTitle')}
      </span>
    </button>
  );
}
