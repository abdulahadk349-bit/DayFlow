import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getCurrentWeekDates } from '../../utils/dateUtils';
import { BarChart3, TrendingUp } from 'lucide-react';

export const WeeklyStatsChart = () => {
  const { tasks, settings } = useApp();
  const weekDays = useMemo(
    () => getCurrentWeekDates(settings?.weekStartDay || 'monday'),
    [settings?.weekStartDay]
  );

  // Compute stats per day of current week
  const dailyStats = useMemo(() => {
    return weekDays.map((day) => {
      const dayTasks = tasks.filter((t) => t.date === day.dateStr);
      const completed = dayTasks.filter((t) => t.completed).length;
      const total = dayTasks.length;
      return {
        ...day,
        completed,
        total,
        ratio: total > 0 ? completed / total : 0,
      };
    });
  }, [tasks, weekDays]);

  const totalWeekTasks = dailyStats.reduce((sum, d) => sum + d.total, 0);
  const totalWeekCompleted = dailyStats.reduce((sum, d) => sum + d.completed, 0);
  const weeklyRate =
    totalWeekTasks > 0 ? Math.round((totalWeekCompleted / totalWeekTasks) * 100) : 0;

  // Max count for scaling chart bars
  const maxDayCount = Math.max(1, ...dailyStats.map((d) => Math.max(d.total, d.completed)));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-6 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Weekly Activity & Completion
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Task output ({settings?.weekStartDay === 'sunday' ? 'Sunday through Saturday' : 'Monday through Sunday'})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" />
            <span>{weeklyRate}% Weekly Goal Rate</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="pt-4 pb-2">
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 sm:h-56 px-2 border-b border-slate-100 dark:border-slate-800">
          {dailyStats.map((item) => {
            const totalHeight = (item.total / maxDayCount) * 100;

            return (
              <div
                key={item.dateStr}
                className="flex flex-col items-center justify-end h-full gap-2 group relative"
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg whitespace-nowrap pointer-events-none z-20 shadow-md">
                  {item.completed} / {item.total} completed
                </div>

                {/* Bars */}
                <div className="w-full max-w-[40px] flex items-end justify-center h-full relative">
                  {/* Background Track */}
                  <div
                    className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl relative overflow-hidden flex items-end transition-all duration-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                    style={{ height: `${Math.max(14, totalHeight)}%` }}
                  >
                    {/* Filled Completed bar */}
                    <div
                      className={`w-full rounded-xl transition-all duration-500 ${
                        item.isToday ? 'bg-blue-600' : 'bg-blue-500'
                      }`}
                      style={{
                        height: item.total > 0 ? `${(item.completed / item.total) * 100}%` : '0%',
                      }}
                    />
                  </div>
                </div>

                {/* Day label */}
                <div className="text-center pt-2">
                  <span
                    className={`block text-xs font-bold ${
                      item.isToday ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {item.dayName}
                  </span>
                  <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    {item.dayNumber}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend & quick recap */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4 pt-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-blue-600" />
            <span className="font-medium text-slate-600 dark:text-slate-300">Completed Tasks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-slate-200 dark:bg-slate-700" />
            <span className="font-medium text-slate-600 dark:text-slate-300">Total Planned</span>
          </div>
        </div>

        <span className="font-semibold text-slate-700 dark:text-slate-300">
          Total this week: <strong className="text-slate-900 dark:text-white">{totalWeekCompleted} done</strong> of {totalWeekTasks}
        </span>
      </div>
    </div>
  );
};
