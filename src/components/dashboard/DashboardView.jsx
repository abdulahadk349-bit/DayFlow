import React from 'react';
import { useApp } from '../../context/AppContext';
import { DailyProgressCard } from './DailyProgressCard';
import { TodayTasksWidget } from './TodayTasksWidget';
import { UpcomingDeadlinesWidget } from './UpcomingDeadlinesWidget';
import { SyllabusSnapshotWidget } from './SyllabusSnapshotWidget';
import { FocusTimerWidget } from './FocusTimerWidget';
import { StatCard } from '../common/StatCard';
import { UserAvatar } from '../common/UserAvatar';
import { getTodayDateString, getGreeting } from '../../utils/dateUtils';
import {
  CheckCircle2,
  Clock,
  Flame,
  BookOpen,
  Plus
} from 'lucide-react';

export const DashboardView = () => {
  const { tasks, courses, profile, streak, openQuickAdd, setActiveTab } = useApp();
  const today = getTodayDateString();

  const todayTasks = tasks.filter((t) => t.date === today);
  const completedToday = todayTasks.filter((t) => t.completed).length;
  const pendingTotal = tasks.filter((t) => !t.completed).length;

  // Total chapters across all syllabus courses
  const totalChapters = courses.reduce((acc, c) => acc + c.chapters.length, 0);
  const completedChapters = courses.reduce(
    (acc, c) => acc + c.chapters.filter((ch) => ch.status === 'Completed').length,
    0
  );
  const syllabusPercentage = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-subtle transition-colors">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className="hover:scale-105 transition-transform"
            title="Edit Profile"
          >
            <UserAvatar profile={profile} size="xl" showRoleBadge />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {profile?.name ? (
                  <>
                    {getGreeting()},{' '}
                    <span className="text-blue-600 dark:text-blue-400">{profile.name}</span>
                  </>
                ) : (
                  <>
                    {getGreeting()}! Welcome to{' '}
                    <span className="text-blue-600 dark:text-blue-400">Plannix</span>
                  </>
                )}
              </h2>
              <span className="text-2xl">👋</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium italic">
              "{profile?.dailyQuote || 'Plan your day, build daily momentum, and achieve your goals.'}"
            </p>
          </div>
        </div>

        <button
          onClick={() => openQuickAdd()}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all hover:shadow active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          {tasks.length === 0 ? 'Create your first task' : 'Quick Add Task'}
        </button>
      </div>

      {/* Top 4 Quick Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Done Today"
          value={`${completedToday}/${todayTasks.length}`}
          subtitle="Tasks completed"
          icon={CheckCircle2}
          colorScheme="emerald"
        />
        <StatCard
          title="Pending Total"
          value={pendingTotal}
          subtitle="All active tasks"
          icon={Clock}
          colorScheme="blue"
        />
        <StatCard
          title="Active Streak"
          value={`${streak} ${streak === 1 ? 'Day' : 'Days'}`}
          subtitle={streak === 0 ? 'Start your streak today' : 'Consecutive productivity'}
          icon={Flame}
          colorScheme="amber"
        />
        <StatCard
          title="Syllabus Done"
          value={`${syllabusPercentage}%`}
          subtitle={`${completedChapters}/${totalChapters} Chapters`}
          icon={BookOpen}
          colorScheme="indigo"
        />
      </div>

      {/* Daily Progress Overview Banner */}
      <DailyProgressCard />

      {/* Main Grid: Today's Tasks & Side Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Tasks (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <TodayTasksWidget />
          <FocusTimerWidget />
        </div>

        {/* Right Column: Deadlines & Syllabus (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <UpcomingDeadlinesWidget />
          <SyllabusSnapshotWidget />
        </div>
      </div>
    </div>
  );
};
