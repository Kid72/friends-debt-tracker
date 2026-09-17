import React from 'react';
import { useI18n } from '../i18n';
import Avatar from './Common/Avatar';
import { 
  Users, 
  HelpCircle, 
  Settings, 
  Bell, 
  BellOff, 
  Cloud, 
  CloudCheck, 
  CloudAlert, 
  RefreshCw,
  Sparkles
} from 'lucide-react';

export default function Header({
  members,
  activeMemberId,
  onSelectActiveMember,
  onOpenHelp,
  onOpenSettings,
  cloudStatus,
  onManualSync,
  notificationsEnabled,
  onRequestNotifications
}) {
  const { lang, setLang, t } = useI18n();

  const activeMember = members.find((m) => m.id === activeMemberId);

  return (
    <header className="sticky top-0 z-40 bg-m3-surface-container/95 backdrop-blur-md border-b border-m3-outline-variant/30 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Logo & App Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-m3-primary flex items-center justify-center text-white shadow-m3-1 flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-m3-on-surface leading-tight tracking-tight">
              {t('appShortName')}
            </h1>
            <p className="text-xs text-m3-on-surface-variant hidden sm:block">
              {t('tagline')}
            </p>
          </div>
        </div>

        {/* Header Controls: Profile, Language, Cloud, Notifications, Help */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Active Profile Picker */}
          <div className="relative">
            <select
              value={activeMemberId || ''}
              onChange={(e) => onSelectActiveMember(e.target.value)}
              className="appearance-none bg-m3-primary-container text-m3-on-primary-container text-xs sm:text-sm font-medium rounded-full pl-3 pr-7 py-1.5 border-none focus:outline-none focus:ring-2 focus:ring-m3-primary cursor-pointer shadow-sm transition-all"
              title={t('changeProfile')}
            >
              <option value="">{t('guestMode')}</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {t('activeUser')}: {m.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-m3-on-primary-container text-xs">
              ▼
            </div>
          </div>

          {/* Language Switcher (AZ | RU | EN) */}
          <div className="flex items-center bg-m3-surface-container-high rounded-full p-0.5 border border-m3-outline-variant/40 text-xs font-semibold">
            {['az', 'ru', 'en'].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-1 rounded-full uppercase transition-all ${
                  lang === l
                    ? 'bg-m3-primary text-m3-on-primary shadow-sm'
                    : 'text-m3-on-surface-variant hover:text-m3-on-surface'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Notification Button */}
          <button
            onClick={onRequestNotifications}
            className={`p-2 rounded-full transition-colors ${
              notificationsEnabled
                ? 'bg-m3-success-container text-m3-on-success-container'
                : 'text-m3-on-surface-variant hover:bg-m3-surface-container-high'
            }`}
            title={notificationsEnabled ? t('notificationsEnabled') : t('requestNotificationsBtn')}
          >
            {notificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </button>

          {/* Help Modal Button */}
          <button
            onClick={onOpenHelp}
            className="p-2 rounded-full text-m3-on-surface-variant hover:bg-m3-surface-container-high hover:text-m3-primary transition-colors"
            title={t('helpTitle')}
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Settings Button with Cloud Indicator */}
          <button
            onClick={onOpenSettings}
            className="relative p-2 rounded-full text-m3-on-surface-variant hover:bg-m3-surface-container-high hover:text-m3-primary transition-colors"
            title={t('settingsTitle')}
          >
            <Settings className="w-5 h-5" />
            {cloudStatus === 'SYNCED' && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-500 ring-2 ring-white"></span>
            )}
            {cloudStatus === 'ERROR' && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
