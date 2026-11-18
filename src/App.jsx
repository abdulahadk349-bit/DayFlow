import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { Navbar } from './components/common/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { PlannerView } from './components/planner/PlannerView';
import { ProgressView } from './components/progress/ProgressView';
import { ProfileView } from './components/profile/ProfileView';
import { QuickAddModal } from './components/common/QuickAddModal';
import { CheckCircle2, Info, AlertTriangle, RotateCw } from 'lucide-react';

export function App() {
  const {
    activeTab,
    isQuickAddOpen,
    setIsQuickAddOpen,
    quickAddCategory,
    toastMessage,
    repeatPrompt,
    repeatTaskTomorrow,
    dismissRepeatPrompt,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-100 selection:text-blue-900 transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <Navbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Dynamic View Sections */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'planner' && <PlannerView />}
          {activeTab === 'progress' && <ProgressView />}
          {activeTab === 'profile' && <ProfileView />}
        </main>
      </div>

      {/* Global Quick Add Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        defaultCategory={quickAddCategory}
      />

      {/* Floating Repeat Tomorrow Prompt */}
      {repeatPrompt && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl shadow-elevated border border-blue-200 dark:border-slate-700 animate-slide-up max-w-[92vw]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="p-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
              <RotateCw className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-semibold truncate">
              Repeat <strong className="text-blue-600 dark:text-blue-400">"{repeatPrompt.title}"</strong> tomorrow?
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => repeatTaskTomorrow(repeatPrompt.taskId)}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors whitespace-nowrap"
            >
              Repeat Tomorrow
            </button>
            <button
              onClick={() => dismissRepeatPrompt(repeatPrompt.taskId)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs transition-colors whitespace-nowrap"
            >
              No Thanks
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification Pill */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold rounded-2xl shadow-elevated border border-slate-700/60 dark:border-slate-200 animate-bounce duration-300">
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          ) : toastMessage.type === 'warning' ? (
            <AlertTriangle className="w-4 h-4 text-amber-400 dark:text-amber-600 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-blue-400 dark:text-blue-600 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
}

export default App;
