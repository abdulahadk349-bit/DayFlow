import React from 'react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString } from '../../utils/dateUtils';
import { CheckCircle2, Clock, Zap } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

export const DailyProgressCard = () => {
  const { tasks } = useApp();
  const today = getTodayDateString();

  const todayTasks = tasks.filter((t) => t.date === today);
  const completed = todayTasks.filter((t) => t.completed).length;
  const total = todayTasks.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const highPriorityLeft = todayTasks.filter(
    (t) => !t.completed && t.priority === 'High'
  ).length;

  return (
    <div className="bg-gradient-to-br from-white via-white to-blue-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900/80 rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-subtle relative overflow-hidden transition-colors">
      {/* Decorative subtle blue aura */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        {/* Left: Progress info & message */}
        <div className="space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold tracking-wide">
            <Zap className="w-3.5 h-3.5 fill-blue-500 text-blue-500" />
            DAILY TARGET
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {percentage === 100 && total > 0
                ? 'All Caught Up! 🌟 Great work!'
                : percentage >= 50
                ? 'You are making steady progress!'
                : 'Ready to flow through today’s plan?'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              You have completed <strong className="text-slate-800 dark:text-slate-200">{completed}</strong> of{' '}
              <strong className="text-slate-800 dark:text-slate-200">{total}</strong> scheduled tasks for today.
              {highPriorityLeft > 0 && (
                <span className="text-rose-600 dark:text-rose-400 font-semibold ml-1.5">
                  ({highPriorityLeft} high-priority pending)
                </span>
              )}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-600 dark:text-slate-400 uppercase tracking-wider">Completion Rate</span>
              <span className="text-blue-600 dark:text-blue-400 font-extrabold text-base">{percentage}%</span>
            </div>
            <ProgressBar progress={percentage} height="h-3" color="bg-blue-600 dark:bg-blue-500" />
          </div>
        </div>

        {/* Right: Key Mini-metrics */}
        <div className="grid grid-cols-2 gap-3 shrink-0 md:w-72">
          <div className="bg-slate-50/80 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200/70 dark:border-slate-700/70">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Completed
              </span>
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{completed}</span>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">tasks done</p>
          </div>

          <div className="bg-slate-50/80 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200/70 dark:border-slate-700/70">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Remaining
              </span>
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{total - completed}</span>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">tasks left</p>
          </div>
        </div>
      </div>
    </div>
  );
};
