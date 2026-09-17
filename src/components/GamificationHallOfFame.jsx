import React from 'react';
import { useI18n } from '../i18n';
import Avatar from './Common/Avatar';
import { Trophy, Award, Zap, Clock, HeartHandshake, ShieldCheck } from 'lucide-react';

export default function GamificationHallOfFame({
  members = [],
  gamificationData,
  currency = '₼'
}) {
  const { t } = useI18n();

  const {
    memberStats = {},
    topSponsorId,
    topSettlerId,
    topDebtorId,
    topPartyId
  } = gamificationData || {};

  const topSponsor = topSponsorId ? memberStats[topSponsorId] : null;
  const topSettler = topSettlerId ? memberStats[topSettlerId] : null;
  const topDebtor = topDebtorId ? memberStats[topDebtorId] : null;
  const topParty = topPartyId ? memberStats[topPartyId] : null;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="px-1">
        <h2 className="text-lg font-bold text-m3-on-surface flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          {t('hallOfFameTitle')}
        </h2>
        <p className="text-xs text-m3-on-surface-variant">
          {t('hallOfFameSubtitle')}
        </p>
      </div>

      {/* 4 Honorary Cards (Expressive M3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* 1. Sponsor of the Night */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-5 shadow-m3-1 flex items-start gap-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
            ⚡
          </div>
          <div className="flex-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              {t('sponsorTitle')}
            </span>
            <div className="text-base font-bold text-m3-on-surface mt-0.5">
              {topSponsor ? topSponsor.member.name : '—'}
            </div>
            <p className="text-xs text-m3-on-surface-variant mt-1">
              {t('sponsorDesc')}
            </p>
            {topSponsor && (
              <div className="mt-2 inline-block bg-amber-100/90 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {t('totalPaidStat')} {topSponsor.totalPaid.toFixed(2)} {currency}
              </div>
            )}
          </div>
        </div>

        {/* 2. Lightning Payer */}
        <div className="bg-blue-50/70 border border-blue-200/80 rounded-3xl p-5 shadow-m3-1 flex items-start gap-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
            ⚡
          </div>
          <div className="flex-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
              {t('lightningTitle')}
            </span>
            <div className="text-base font-bold text-m3-on-surface mt-0.5">
              {topSettler ? topSettler.member.name : '—'}
            </div>
            <p className="text-xs text-m3-on-surface-variant mt-1">
              {t('lightningDesc')}
            </p>
            {topSettler && (
              <div className="mt-2 inline-block bg-blue-100/90 text-blue-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {t('settledCountStat')} {topSettler.settledCount}
              </div>
            )}
          </div>
        </div>

        {/* 3. Mr. "I'll send tomorrow" */}
        <div className="bg-orange-50/70 border border-orange-200/80 rounded-3xl p-5 shadow-m3-1 flex items-start gap-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
            🐢
          </div>
          <div className="flex-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-800">
              {t('tomorrowTitle')}
            </span>
            <div className="text-base font-bold text-m3-on-surface mt-0.5">
              {topDebtor ? topDebtor.member.name : '—'}
            </div>
            <p className="text-xs text-m3-on-surface-variant mt-1">
              {t('tomorrowDesc')}
            </p>
            {topDebtor && (
              <div className="mt-2 inline-block bg-orange-100/90 text-orange-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {t('unsettledDebtStat')} {topDebtor.currentDebt.toFixed(2)} {currency}
              </div>
            )}
          </div>
        </div>

        {/* 4. Life of the Party */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-5 shadow-m3-1 flex items-start gap-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
            🍕
          </div>
          <div className="flex-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              {t('partyLifeTitle')}
            </span>
            <div className="text-base font-bold text-m3-on-surface mt-0.5">
              {topParty ? topParty.member.name : '—'}
            </div>
            <p className="text-xs text-m3-on-surface-variant mt-1">
              {t('partyLifeDesc')}
            </p>
            {topParty && (
              <div className="mt-2 inline-block bg-emerald-100/90 text-emerald-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {t('eventsAttendedStat')} {topParty.eventsAttended}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Leaderboard Table / Cards */}
      <div className="bg-m3-surface-container-lowest rounded-3xl p-5 border border-m3-outline-variant/30 shadow-m3-1">
        <h3 className="text-sm font-bold text-m3-on-surface mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-m3-primary" />
          {t('tabMembers')}
        </h3>

        <div className="divide-y divide-m3-outline-variant/20">
          {members.map((m) => {
            const st = memberStats[m.id] || {
              totalPaid: 0,
              eventsAttended: 0,
              settledCount: 0,
              currentBalance: 0
            };

            return (
              <div key={m.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar name={m.name} color={m.color} size="md" />
                  <div>
                    <div className="text-sm font-bold text-m3-on-surface flex items-center gap-1.5">
                      {m.name}
                      {topSponsorId === m.id && <span title={t('sponsorTitle')}>⚡</span>}
                      {topSettlerId === m.id && <span title={t('lightningTitle')}>⚡</span>}
                      {topDebtorId === m.id && <span title={t('tomorrowTitle')}>🐢</span>}
                      {topPartyId === m.id && <span title={t('partyLifeTitle')}>🍕</span>}
                    </div>
                    <div className="text-xs text-m3-on-surface-variant flex items-center gap-2 mt-0.5">
                      <span>{t('totalPaidStat')} {st.totalPaid.toFixed(2)} {currency}</span>
                      <span>•</span>
                      <span>{t('eventsAttendedStat')} {st.eventsAttended}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-sm font-bold ${
                    st.currentBalance > 0.01 
                      ? 'text-m3-success' 
                      : st.currentBalance < -0.01 
                      ? 'text-m3-error' 
                      : 'text-m3-on-surface-variant'
                  }`}>
                    {st.currentBalance > 0 ? '+' : ''}{st.currentBalance.toFixed(2)} {currency}
                  </div>
                  <div className="text-[11px] text-m3-on-surface-variant">
                    {st.settledCount} {t('settledCountStat')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
