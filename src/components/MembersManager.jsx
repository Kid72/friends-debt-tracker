import React, { useState } from 'react';
import { useI18n } from '../i18n';
import Avatar from './Common/Avatar';
import { Users, UserPlus, Trash2, CheckCircle } from 'lucide-react';

export default function MembersManager({
  members = [],
  onAddMember,
  onRemoveMember,
  activeMemberId,
  onSelectActiveMember
}) {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (members.some((m) => m.name.toLowerCase() === name.trim().toLowerCase())) {
      setError('Bu adda iştirakçı artıq mövcuddur');
      return;
    }

    onAddMember({
      id: `m_${Date.now()}`,
      name: name.trim()
    });

    setName('');
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="px-1">
        <h2 className="text-lg font-bold text-m3-on-surface flex items-center gap-2">
          <Users className="w-5 h-5 text-m3-primary" />
          {t('membersTitle')} ({members.length})
        </h2>
      </div>

      {/* Add Member Form */}
      <form onSubmit={handleAdd} className="bg-m3-surface-container-lowest rounded-3xl p-4 sm:p-5 border border-m3-outline-variant/30 shadow-m3-1 flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          placeholder={t('memberNamePlaceholder')}
          className="w-full bg-m3-surface-container-low rounded-2xl px-4 py-2.5 text-sm text-m3-on-surface border border-m3-outline-variant/50 focus:outline-none focus:border-m3-primary"
        />
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-m3-primary text-m3-on-primary hover:bg-m3-primary/90 shadow-m3-1 flex items-center justify-center gap-2 active:scale-95 transition-all flex-shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          {t('addMemberSubmit')}
        </button>
      </form>
      {error && <p className="text-xs text-red-600 px-2">{error}</p>}

      {/* Members List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {members.map((m) => {
          const isActive = m.id === activeMemberId;
          return (
            <div
              key={m.id}
              className={`rounded-3xl p-4 border transition-all flex items-center justify-between shadow-m3-1 ${
                isActive
                  ? 'bg-m3-primary-container/40 border-m3-primary/50 ring-1 ring-m3-primary'
                  : 'bg-m3-surface-container-lowest border-m3-outline-variant/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar name={m.name} color={m.color} size="md" />
                <div>
                  <h4 className="text-sm font-bold text-m3-on-surface">
                    {m.name}
                  </h4>
                  {isActive && (
                    <span className="text-[11px] font-semibold text-m3-primary flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {t('activeUser')}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {!isActive && (
                  <button
                    onClick={() => onSelectActiveMember(m.id)}
                    className="text-xs font-semibold text-m3-primary bg-m3-surface-container hover:bg-m3-primary-container px-3 py-1.5 rounded-full transition-colors"
                  >
                    {t('activeUser')}
                  </button>
                )}
                {members.length > 2 && (
                  <button
                    onClick={() => onRemoveMember(m.id)}
                    className="p-2 rounded-full text-m3-outline hover:text-m3-error hover:bg-red-50 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
