import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useI18n } from './i18n';
import { StorageService, INITIAL_DEMO_DATA } from './services/storageService';
import { calculateBalancesAndSimplifiedTransfers } from './services/debtAlgorithm';
import { calculateGamificationBadges } from './services/gamificationService';
import { NotificationService } from './services/notificationService';

// Components
import Header from './components/Header';
import HeroBalanceCard from './components/HeroBalanceCard';
import DebtTransfersList from './components/DebtTransfersList';
import ExpenseModal from './components/ExpenseModal';
import SettleUpModal from './components/SettleUpModal';
import GamificationHallOfFame from './components/GamificationHallOfFame';
import ExpensesHistory from './components/ExpensesHistory';
import MembersManager from './components/MembersManager';
import HelpModal from './components/HelpModal';
import SettingsModal from './components/SettingsModal';
import FloatingActionButton from './components/FloatingActionButton';

// Icons
import { ArrowRightLeft, Receipt, Trophy, Users, Sparkles } from 'lucide-react';

export default function App() {
  const { lang, t } = useI18n();

  // Primary State
  const [state, setState] = useState(() => StorageService.loadLocalState());
  const [cloudConfig, setCloudConfig] = useState(() => StorageService.loadCloudConfig());
  const [cloudStatus, setCloudStatus] = useState('LOCAL'); // 'LOCAL' | 'SYNCED' | 'SYNCING' | 'ERROR'

  // User session
  const [activeMemberId, setActiveMemberId] = useState(() => {
    return localStorage.getItem('friends_debt_active_user') || 'm_rauf';
  });

  // Navigation tab: 'transfers' | 'expenses' | 'gamification' | 'members'
  const [activeTab, setActiveTab] = useState('transfers');

  // Modals state
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [selectedTransferForSettle, setSelectedTransferForSettle] = useState(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Notification status
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    () => NotificationService.getPermission() === 'granted'
  );

  // Persist active user in local storage
  const handleSelectActiveMember = (mId) => {
    setActiveMemberId(mId);
    if (mId) {
      localStorage.setItem('friends_debt_active_user', mId);
    } else {
      localStorage.removeItem('friends_debt_active_user');
    }
  };

  // Sync to Cloud helper
  const syncToCloud = useCallback(async (newState, cfg = cloudConfig) => {
    if (!cfg || cfg.provider === 'LOCAL' || !cfg.endpoint) {
      setCloudStatus('LOCAL');
      return;
    }
    setCloudStatus('SYNCING');
    try {
      await StorageService.pushRemoteState(newState, cfg);
      setCloudStatus('SYNCED');
    } catch (e) {
      console.warn('Cloud sync error:', e);
      setCloudStatus('ERROR');
    }
  }, [cloudConfig]);

  // Update State Wrapper
  const updateState = (updater) => {
    setState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      const saved = StorageService.saveLocalState(next);
      syncToCloud(saved);
      return saved;
    });
  };

  // Manual fetch from cloud on load or refresh
  const handleManualCloudSync = async () => {
    if (cloudConfig.provider === 'LOCAL' || !cloudConfig.endpoint) {
      setCloudStatus('LOCAL');
      return;
    }
    setCloudStatus('SYNCING');
    try {
      const remoteData = await StorageService.fetchRemoteState(cloudConfig);
      if (remoteData) {
        setState(remoteData);
        StorageService.saveLocalState(remoteData);
        setCloudStatus('SYNCED');
      }
    } catch (e) {
      console.error(e);
      setCloudStatus('ERROR');
    }
  };

  useEffect(() => {
    if (cloudConfig.provider !== 'LOCAL' && cloudConfig.endpoint) {
      handleManualCloudSync();
    }
  }, []);

  // Notifications request
  const handleRequestNotifications = async () => {
    const res = await NotificationService.requestPermission();
    setNotificationsEnabled(res === 'granted');
  };

  // Recalculate Balances and Greedy Simplified Debt Transfers
  const { balances, transfers } = useMemo(() => {
    return calculateBalancesAndSimplifiedTransfers(
      state.members,
      state.expenses,
      state.settlements,
      state.currency,
      lang
    );
  }, [state.members, state.expenses, state.settlements, state.currency, lang]);

  // Gamification badges & leaderboard
  const gamificationData = useMemo(() => {
    return calculateGamificationBadges(
      state.members,
      state.expenses,
      state.settlements,
      balances
    );
  }, [state.members, state.expenses, state.settlements, balances]);

  // Active Member Net Balance
  const activeMember = state.members.find((m) => m.id === activeMemberId) || null;
  const activeUserBalance = activeMemberId ? (balances[activeMemberId] || 0) : 0;

  // Group Total Expenses
  const totalGroupExpense = useMemo(() => {
    return state.expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, [state.expenses]);

  // Action: Add / Update Expense
  const handleSaveExpense = (expenseData) => {
    updateState((prev) => {
      const exists = prev.expenses.some((e) => e.id === expenseData.id);
      const newExpenses = exists
        ? prev.expenses.map((e) => (e.id === expenseData.id ? expenseData : e))
        : [expenseData, ...prev.expenses];

      return {
        ...prev,
        expenses: newExpenses
      };
    });

    // Notify if high amount
    if (expenseData.amount >= 100 && notificationsEnabled) {
      NotificationService.sendNotification(t('appName'), {
        body: `Yeni böyük hesab: ${expenseData.title} (${expenseData.amount} ${state.currency})`
      });
    }
  };

  // Action: Delete Expense
  const handleDeleteExpense = (expId) => {
    if (window.confirm(t('deleteExpenseConfirm'))) {
      updateState((prev) => ({
        ...prev,
        expenses: prev.expenses.filter((e) => e.id !== expId)
      }));
    }
  };

  // Action: Settle Up Debt
  const handleInitiateSettle = (transfer) => {
    setSelectedTransferForSettle(transfer);
    setIsSettleModalOpen(true);
  };

  const handleConfirmSettle = (transfer) => {
    const settlementRecord = {
      id: `setl_${Date.now()}`,
      fromMemberId: transfer.fromMember.id,
      toMemberId: transfer.toMember.id,
      amount: transfer.amount,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };

    updateState((prev) => ({
      ...prev,
      settlements: [settlementRecord, ...prev.settlements]
    }));

    // Trigger Canvas Confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Web Notification
    if (notificationsEnabled) {
      NotificationService.sendNotification(t('settleNotificationTitle'), {
        body: t('settleNotificationBody', {
          debtor: transfer.fromMember.name,
          amount: transfer.amount.toFixed(2),
          currency: state.currency,
          receiver: transfer.toMember.name
        })
      });
    }
  };

  // Action: WhatsApp Group Summary Report
  const handleShareGroupReportToWhatsApp = () => {
    const latestExp = state.expenses[0] || { title: 'Dostlarla görüş', amount: totalGroupExpense, paidBy: 'm_rauf' };
    const payer = state.members.find((m) => m.id === latestExp.paidBy)?.name || 'Dostlar';
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    let text = `${t('waGroupReportTitle', { title: latestExp.title })}\n`;
    text += `${t('waGroupReportTotal', { amount: latestExp.amount.toFixed(2), currency: state.currency, payer })}\n\n`;
    text += `${t('waGroupReportListHeader')}\n`;

    if (transfers.length === 0) {
      text += `✨ ${t('allSettled')}\n`;
    } else {
      transfers.forEach((tr) => {
        text += `• ${tr.fromMember.name} ➡️ ${tr.amount.toFixed(2)} ${state.currency} ➡️ ${tr.toMember.name}\n`;
      });
    }

    text += `\n${t('waGroupReportFooter', { link: currentUrl })}`;

    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  // Member Management Actions
  const handleAddMember = (newMember) => {
    updateState((prev) => ({
      ...prev,
      members: [...prev.members, newMember]
    }));
  };

  const handleRemoveMember = (mId) => {
    const hasExpenses = state.expenses.some(
      (e) => e.paidBy === mId || (e.splits || []).some((s) => s.memberId === mId)
    );
    if (hasExpenses) {
      alert(t('cannotRemoveMemberWithDebts'));
      return;
    }
    updateState((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== mId)
    }));
    if (activeMemberId === mId) {
      handleSelectActiveMember('');
    }
  };

  // Settings Actions
  const handleChangeCurrency = (newCurr) => {
    updateState((prev) => ({ ...prev, currency: newCurr }));
  };

  const handleSaveCloudConfig = (newConfig) => {
    setCloudConfig(newConfig);
    StorageService.saveCloudConfig(newConfig);
    syncToCloud(state, newConfig);
  };

  const handleResetDemoData = () => {
    if (window.confirm(t('resetDemoConfirm'))) {
      updateState(INITIAL_DEMO_DATA);
      setIsSettingsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-m3-surface text-m3-on-surface flex flex-col selection:bg-m3-primary-container selection:text-m3-on-primary-container pb-24">
      {/* MD3 Expressive Top App Bar */}
      <Header
        members={state.members}
        activeMemberId={activeMemberId}
        onSelectActiveMember={handleSelectActiveMember}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        cloudStatus={cloudStatus}
        onManualSync={handleManualCloudSync}
        notificationsEnabled={notificationsEnabled}
        onRequestNotifications={handleRequestNotifications}
      />

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto px-4 py-4 sm:py-6 space-y-6 flex-1">
        {/* Hero Personal Balance Card */}
        <HeroBalanceCard
          activeMember={activeMember}
          balance={activeUserBalance}
          totalGroupExpense={totalGroupExpense}
          pendingTransfersCount={transfers.length}
          currency={state.currency}
        />

        {/* MD3 Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-m3-outline-variant/30 overflow-x-auto no-scrollbar gap-1 py-1">
          <button
            onClick={() => setActiveTab('transfers')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'transfers'
                ? 'bg-m3-primary text-m3-on-primary shadow-sm'
                : 'text-m3-on-surface-variant hover:bg-m3-surface-container'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>{t('tabTransfers')}</span>
            {transfers.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === 'transfers' ? 'bg-white text-m3-primary' : 'bg-m3-surface-container-high'
              }`}>
                {transfers.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'expenses'
                ? 'bg-m3-primary text-m3-on-primary shadow-sm'
                : 'text-m3-on-surface-variant hover:bg-m3-surface-container'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>{t('tabExpenses')}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeTab === 'expenses' ? 'bg-white text-m3-primary' : 'bg-m3-surface-container-high'
            }`}>
              {state.expenses.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('gamification')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'gamification'
                ? 'bg-m3-primary text-m3-on-primary shadow-sm'
                : 'text-m3-on-surface-variant hover:bg-m3-surface-container'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>{t('tabGamification')}</span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'members'
                ? 'bg-m3-primary text-m3-on-primary shadow-sm'
                : 'text-m3-on-surface-variant hover:bg-m3-surface-container'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t('tabMembers')}</span>
          </button>
        </div>

        {/* Tab Content Rendering */}
        <div className="animate-fade-in">
          {activeTab === 'transfers' && (
            <DebtTransfersList
              transfers={transfers}
              currency={state.currency}
              onSettleUp={handleInitiateSettle}
              onShareWhatsApp={handleShareGroupReportToWhatsApp}
              activeMemberId={activeMemberId}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpensesHistory
              expenses={state.expenses}
              settlements={state.settlements}
              members={state.members}
              currency={state.currency}
              onEditExpense={(exp) => {
                setEditingExpense(exp);
                setIsExpenseModalOpen(true);
              }}
              onDeleteExpense={handleDeleteExpense}
            />
          )}

          {activeTab === 'gamification' && (
            <GamificationHallOfFame
              members={state.members}
              gamificationData={gamificationData}
              currency={state.currency}
            />
          )}

          {activeTab === 'members' && (
            <MembersManager
              members={state.members}
              onAddMember={handleAddMember}
              onRemoveMember={handleRemoveMember}
              activeMemberId={activeMemberId}
              onSelectActiveMember={handleSelectActiveMember}
            />
          )}
        </div>
      </main>

      {/* Floating Action Button (FAB) */}
      <FloatingActionButton
        onClick={() => {
          setEditingExpense(null);
          setIsExpenseModalOpen(true);
        }}
      />

      {/* Modals */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setEditingExpense(null);
        }}
        onSave={handleSaveExpense}
        members={state.members}
        activeMemberId={activeMemberId}
        currency={state.currency}
        editingExpense={editingExpense}
      />

      <SettleUpModal
        isOpen={isSettleModalOpen}
        onClose={() => {
          setIsSettleModalOpen(false);
          setSelectedTransferForSettle(null);
        }}
        transfer={selectedTransferForSettle}
        currency={state.currency}
        onConfirm={handleConfirmSettle}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currency={state.currency}
        onChangeCurrency={handleChangeCurrency}
        cloudConfig={cloudConfig}
        onSaveCloudConfig={handleSaveCloudConfig}
        onManualSync={handleManualCloudSync}
        cloudStatus={cloudStatus}
        onResetDemoData={handleResetDemoData}
      />
    </div>
  );
}
