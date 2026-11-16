import React from 'react';
import { useApp } from '../../context/AppContext';
import { PieChart, CheckCircle2, Clock, Layers } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

export const CategoryBreakdownChart = () => {
  const { tasks } = useApp();

  const total = tasks.length;
  const completedTotal = tasks.filter((t) => t.completed).length;
  const pendingTotal = total - completedTotal;

  const categories = ['Study', 'Work', 'Personal'];

  const categoryStats = categories.map((cat) => {
    const catTasks = tasks.filter((t) => t.category === cat);
    const catCompleted = catTasks.filter((t) => t.completed).length;
    const catTotal = catTasks.length;
    const rate = catTotal > 0 ? Math.round((catCompleted / catTotal) * 100) : 0;
    const share = total > 0 ? Math.round((catTotal / total) * 100) : 0;

    return {
      name: cat,
      total: catTotal,
      completed: catCompleted,
      rate,
      share,
    };
  });

  const priorities = ['High', 'Medium', 'Low'];
  const priorityStats = priorities.map((p) => {
    const pTasks = tasks.filter((t) => t.priority === p);
    const pCompleted = pTasks.filter((t) => t.completed).length;
    return {
      priority: p,
      total: pTasks.length,
      completed: pCompleted,
    };
  });

  const catColors = {
    Study: 'bg-blue-600',
    Work: 'bg-indigo-600',
    Personal: 'bg-emerald-600',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Category Distribution Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-5 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Category Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Allocation across responsibilities</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {total} Total Tasks
          </span>
        </div>

        {/* Segmented multi-color bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden flex p-0.5">
          {categoryStats.map((cat) => (
            <div
              key={cat.name}
              className={`${catColors[cat.name]} h-full first:rounded-l-full last:rounded-r-full transition-all duration-500`}
              style={{ width: `${cat.share}%` }}
              title={`${cat.name}: ${cat.share}%`}
            />
          ))}
        </div>

        {/* Detailed Category Rows */}
        <div className="space-y-3 pt-1">
          {categoryStats.map((cat) => (
            <div
              key={cat.name}
              className="p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${catColors[cat.name]}`} />
                  <span className="font-bold text-slate-800 dark:text-slate-200">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <span className="text-slate-500 dark:text-slate-400">
                    {cat.completed}/{cat.total} done
                  </span>
                  <span className="text-slate-900 dark:text-white font-extrabold">{cat.rate}%</span>
                </div>
              </div>
              <ProgressBar progress={cat.rate} height="h-1.5" color={catColors[cat.name]} />
            </div>
          ))}
        </div>
      </div>

      {/* Status & Priority Overview Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-5 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Status & Urgency Overview
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Execution velocity & priorities</p>
            </div>
          </div>
        </div>

        {/* Status Split (Completed vs Pending) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900">
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>COMPLETED</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{completedTotal}</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {total > 0 ? Math.round((completedTotal / total) * 100) : 0}% of all tasks
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900">
            <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 text-xs font-bold mb-1">
              <Clock className="w-4 h-4" />
              <span>PENDING</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{pendingTotal}</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {total > 0 ? Math.round((pendingTotal / total) * 100) : 0}% remaining
            </p>
          </div>
        </div>

        {/* Priority breakdown */}
        <div className="pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
            Priority Breakdown
          </h4>
          <div className="space-y-2">
            {priorityStats.map((p) => {
              const colors = {
                High: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-100 dark:border-rose-900',
                Medium: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-100 dark:border-amber-900',
                Low: 'text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700',
              };
              return (
                <div
                  key={p.priority}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 text-xs"
                >
                  <span className={`font-bold px-2 py-0.5 rounded-md border ${colors[p.priority]}`}>
                    {p.priority}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 dark:text-slate-400">
                      {p.completed} completed
                    </span>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {p.total} total
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
