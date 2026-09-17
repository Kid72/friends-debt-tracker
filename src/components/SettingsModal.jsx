import React, { useState } from 'react';
import { useI18n } from '../i18n';
import { Settings, X, Cloud, RefreshCw, RotateCcw, Check, AlertCircle } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  currency,
  onChangeCurrency,
  cloudConfig,
  onSaveCloudConfig,
  onManualSync,
  cloudStatus,
  onResetDemoData
}) {
  const { t } = useI18n();

  const [currSymbol, setCurrSymbol] = useState(currency || '₼');
  const [provider, setProvider] = useState(cloudConfig.provider || 'LOCAL');
  const [endpoint, setEndpoint] = useState(cloudConfig.endpoint || '');
  const [apiKey, setApiKey] = useState(cloudConfig.apiKey || '');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onChangeCurrency(currSymbol);
    onSaveCloudConfig({
      provider,
      endpoint: endpoint.trim(),
      apiKey: apiKey.trim()
    });
    setMessage('Tənzimləmələr yadda saxlanıldı!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-m3-surface-container-lowest rounded-3xl max-w-md w-full p-6 shadow-m3-3 border border-m3-outline-variant/40 animate-slide-up relative my-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full text-m3-on-surface-variant hover:bg-m3-surface-container transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-2xl bg-m3-primary-container text-m3-on-primary-container">
            <Settings className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-m3-on-surface">
            {t('settingsTitle')}
          </h2>
        </div>

        {message && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-800 text-xs rounded-2xl p-3 flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Currency Symbol */}
          <div>
            <label className="block text-xs font-semibold text-m3-on-surface-variant mb-1">
              {t('currencyLabel')}
            </label>
            <div className="flex items-center gap-2">
              {['₼', '$', '€', '₽', 'TL'].map((sym) => (
                <button
                  type="button"
                  key={sym}
                  onClick={() => setCurrSymbol(sym)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    currSymbol === sym
                      ? 'bg-m3-primary text-m3-on-primary shadow-sm'
                      : 'bg-m3-surface-container text-m3-on-surface-variant hover:text-m3-on-surface'
                  }`}
                >
                  {sym}
                </button>
              ))}
              <input
                type="text"
                maxLength={4}
                value={currSymbol}
                onChange={(e) => setCurrSymbol(e.target.value)}
                className="w-16 bg-m3-surface-container-low rounded-xl px-3 py-1.5 text-xs text-center font-bold border border-m3-outline-variant/40"
              />
            </div>
          </div>

          {/* Cloud Sync (Zero Backend) */}
          <div className="pt-2 border-t border-m3-outline-variant/20">
            <label className="block text-xs font-bold text-m3-on-surface mb-0.5">
              {t('cloudSyncTitle')}
            </label>
            <p className="text-[11px] text-m3-on-surface-variant mb-2">
              {t('cloudSyncDesc')}
            </p>

            <div className="space-y-2">
              <div>
                <label className="block text-[11px] font-semibold text-m3-on-surface-variant mb-1">
                  {t('cloudProviderLabel')}
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full bg-m3-surface-container-low rounded-2xl px-3 py-2 text-xs text-m3-on-surface border border-m3-outline-variant/40"
                >
                  <option value="LOCAL">{t('storageLocal')}</option>
                  <option value="NPOINT">{t('storageNpoint')}</option>
                  <option value="JSONBIN">{t('storageJsonbin')}</option>
                  <option value="FIREBASE">{t('storageFirebase')}</option>
                  <option value="CUSTOM">{t('storageCustom')}</option>
                </select>
              </div>

              {provider !== 'LOCAL' && (
                <>
                  <div>
                    <label className="block text-[11px] font-semibold text-m3-on-surface-variant mb-1">
                      {t('cloudEndpointLabel')}
                    </label>
                    <input
                      type="text"
                      value={endpoint}
                      onChange={(e) => setEndpoint(e.target.value)}
                      placeholder={t('cloudEndpointPlaceholder')}
                      className="w-full bg-m3-surface-container-low rounded-2xl px-3 py-2 text-xs text-m3-on-surface border border-m3-outline-variant/40 font-mono"
                    />
                  </div>

                  {(provider === 'JSONBIN' || provider === 'CUSTOM') && (
                    <div>
                      <label className="block text-[11px] font-semibold text-m3-on-surface-variant mb-1">
                        {t('cloudApiKeyLabel')}
                      </label>
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder={t('cloudApiKeyPlaceholder')}
                        className="w-full bg-m3-surface-container-low rounded-2xl px-3 py-2 text-xs text-m3-on-surface border border-m3-outline-variant/40 font-mono"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-m3-on-surface-variant font-medium">
                      Status: {cloudStatus === 'SYNCED' ? t('cloudStatusSynced') : cloudStatus === 'SYNCING' ? t('cloudStatusSyncing') : cloudStatus === 'ERROR' ? t('cloudStatusError') : t('cloudStatusLocal')}
                    </span>
                    <button
                      type="button"
                      onClick={onManualSync}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-m3-secondary-container text-m3-on-secondary-container hover:bg-m3-secondary-container/80 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      {t('syncNowBtn')}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Reset Demo Data */}
          <div className="pt-3 border-t border-m3-outline-variant/20">
            <button
              type="button"
              onClick={onResetDemoData}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t('resetDemoDataBtn')}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full text-xs font-semibold text-m3-on-surface-variant hover:bg-m3-surface-container"
            >
              {t('cancelBtn')}
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full text-xs font-semibold bg-m3-primary text-m3-on-primary hover:bg-m3-primary/90 shadow-sm"
            >
              {t('saveExpenseBtn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
