import React from 'react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString, getRelativeDateLabel, formatDate } from '../../utils/dateUtils';
import { CategoryBadge, PriorityBadge } from '../common/Badge';
import { Calendar, ChevronRight, Plus } from 'lucide-react';

export const UpcomingDeadlinesWidget = () => {
  const { tasks, setActiveTab, openQuickAdd } = useApp();
  const today = getTodayDateString();

  // Tasks that are in the future or not yet completed
  const upcomingTasks = tasks
    .filter((t) => !t.completed && t.date > today)
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-subtle flex flex-col justify-between transition-colors">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Upcoming Deadlines
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Next 7 days roadmap</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {upcomingTasks.length} queued
          </span>
        </div>

        {/* List */}
        <div className="space-y-3">
          {upcomingTasks.length === 0 ? (
            <div className="text-center py-8 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <Calendar className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                No upcoming deadlines in the near term.
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Schedule future milestones or tasks to track them here.
              </p>
              <button
                onClick={() => openQuickAdd()}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Schedule Task
              </button>
            </div>
          ) : (
            upcomingTasks.map((task) => {
              const relLabel = getRelativeDateLabel(task.date);
              const isUrgent = relLabel === 'Tomorrow';

              return (
                <div
                  key={task.id}
                  className="p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-xs transition-all bg-slate-50/40 dark:bg-slate-800/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                      {task.title}
                    </p>
                    <span
                      className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md whitespace-nowrap shrink-0 ${
                        isUrgent
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                          : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900'
                      }`}
                    >
                      {relLabel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100/80 dark:border-slate-700/60 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <CategoryBadge category={task.category} size="xs" />
                      <PriorityBadge priority={task.priority} size="xs" />
                    </div>
                    <span className="text-slate-400 dark:text-slate-500 font-medium">
                      {formatDate(task.date)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
        <button
          onClick={() => setActiveTab('planner')}
          className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-0.5 transition-colors"
        >
          Open Planner
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
