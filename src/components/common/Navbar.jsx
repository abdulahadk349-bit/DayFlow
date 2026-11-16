import React from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, Plus, Calendar } from 'lucide-react';
import { formatFullHeaderDate } from '../../utils/dateUtils';
import { UserAvatar } from './UserAvatar';

export const Navbar = ({ onOpenMobileMenu }) => {
  const { openQuickAdd, profile, activeTab, setActiveTab, tasks } = useApp();

  const getSectionTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Today’s Dashboard';
      case 'planner':
        return 'Task Planner & Schedule';
      case 'progress':
        return 'Analytics & Syllabus Tracker';
      case 'profile':
        return 'Profile & Settings';
      default:
        return 'Dashboard';
    }
  };

  const todayTasks = tasks.filter((t) => {
    const today = new Date().toISOString().split('T')[0];
    return t.date === today;
  });
  const completedToday = todayTasks.filter((t) => t.completed).length;

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {getSectionTitle()}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            <span>{formatFullHeaderDate()}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick status pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            {completedToday}/{todayTasks.length} Completed Today
          </span>
        </div>

        {/* Quick-add button */}
        <button
          onClick={() => openQuickAdd()}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">Add Task</span>
        </button>

        {/* User avatar shortcut in header */}
        <button
          onClick={() => setActiveTab('profile')}
          className="p-0.5 rounded-2xl hover:ring-2 hover:ring-blue-500/40 transition-all ml-1"
          title={`${profile.name} - Profile & Settings`}
        >
          <UserAvatar profile={profile} size="sm" />
        </button>
      </div>
    </header>
  );
};
