import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserAvatar } from './UserAvatar';
import {
  LayoutDashboard,
  CalendarCheck2,
  TrendingUp,
  Plus,
  Flame,
  RotateCcw,
  Sparkles,
  Settings,
  X
} from 'lucide-react';

export const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { activeTab, setActiveTab, openQuickAdd, profile, streak, tasks, resetAll } = useApp();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      desc: 'Overview & today',
    },
    {
      id: 'planner',
      label: 'Planner',
      icon: CalendarCheck2,
      desc: 'All tasks & schedules',
    },
    {
      id: 'progress',
      label: 'Progress & Syllabus',
      icon: TrendingUp,
      desc: 'Analytics & curriculum',
    },
    {
      id: 'profile',
      label: 'Profile & Settings',
      icon: Settings,
      desc: 'Account & preferences',
    },
  ];

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 flex flex-col justify-between transition-colors duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1">
                  Day<span className="text-blue-600 dark:text-blue-400">Flow</span>
                </span>
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  Focus • Plan • Achieve
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick-Add Action Button */}
          <div className="px-4 py-4">
            <button
              onClick={() => {
                openQuickAdd();
                if (isMobileOpen) setIsMobileOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Quick Add Task
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Menu
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (isMobileOpen) setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    />
                    <div className="text-left">
                      <div className="leading-tight">{item.label}</div>
                    </div>
                  </div>
                  {item.id === 'planner' && pendingCount > 0 && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-blue-200/80 dark:bg-blue-800 text-blue-800 dark:text-blue-100'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Study & Focus Streak Card */}
          <div className="px-4 py-3">
            <div className="bg-gradient-to-br from-blue-50/80 to-slate-50 dark:from-slate-800/80 dark:to-slate-800/40 border border-blue-100 dark:border-slate-800 rounded-2xl p-3.5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`p-1.5 rounded-lg ${
                    streak > 0 
                      ? 'bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                  }`}>
                    <Flame className={`w-4 h-4 ${streak > 0 ? 'fill-orange-500 text-orange-500' : ''}`} />
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      {streak > 0 ? `${streak} Day Streak!` : 'Start Your Streak!'}
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {streak > 0 ? 'Keep up the momentum' : 'Complete a task today'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full bg-slate-200/70 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${streak > 0 ? 'bg-orange-500' : 'bg-transparent'}`} 
                  style={{ width: streak > 0 ? `${Math.min(100, Math.max(15, streak * 20))}%` : '0%' }}
                />
              </div>
            </div>
          </div>

          {/* User Profile Section in Sidebar */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/60">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('profile');
                  if (isMobileOpen) setIsMobileOpen(false);
                }}
                className="flex items-center gap-2.5 min-w-0 text-left hover:opacity-85 transition-opacity flex-1 group"
                title="View & Edit Profile"
              >
                <UserAvatar profile={profile} size="md" showRoleBadge />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {profile.name || 'Set Up Profile'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {profile.name ? profile.role : 'Customize account'}
                  </p>
                </div>
              </button>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('profile');
                    if (isMobileOpen) setIsMobileOpen(false);
                  }}
                  title="Profile Settings"
                  className={`p-1.5 rounded-lg transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={resetAll}
                  title="Reset all data"
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
