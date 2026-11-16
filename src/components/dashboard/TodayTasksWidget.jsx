import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString, formatTime12h } from '../../utils/dateUtils';
import { CategoryBadge, PriorityBadge } from '../common/Badge';
import { Check, Plus, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';

export const TodayTasksWidget = () => {
  const { tasks, toggleTaskComplete, openQuickAdd, setActiveTab } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const today = getTodayDateString();

  const todayTasks = tasks.filter((t) => t.date === today);

  const filteredTasks =
    selectedCategory === 'All'
      ? todayTasks
      : todayTasks.filter((t) => t.category === selectedCategory);

  const categories = ['All', 'Study', 'Work', 'Personal'];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-subtle flex flex-col justify-between transition-colors">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Today's Schedule
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200/60 dark:border-blue-800">
                {todayTasks.length} tasks
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Focus on today's highest leverage responsibilities
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 self-start sm:self-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all ${
                  selectedCategory === cat
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-2.5">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-10 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {selectedCategory === 'All'
                  ? 'No tasks scheduled for today!'
                  : `No ${selectedCategory} tasks for today.`}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Add a new task to organize your day.
              </p>
              <button
                onClick={() => openQuickAdd(selectedCategory === 'All' ? null : selectedCategory)}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Today's Task
              </button>
            </div>
          ) : (
            filteredTasks.map((task) => {
              return (
                <div
                  key={task.id}
                  className={`group flex items-start justify-between gap-3 p-3.5 rounded-2xl border transition-all ${
                    task.completed
                      ? 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800/60 opacity-60'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-card'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Completion checkbox */}
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center transition-all shrink-0 ${
                        task.completed
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 hover:border-blue-500 bg-white dark:bg-slate-800'
                      }`}
                      aria-label="Toggle completed"
                    >
                      {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="min-w-0">
                      <p
                        className={`text-sm font-semibold leading-snug transition-all ${
                          task.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-800 dark:text-slate-100'
                        }`}
                      >
                        {task.title}
                      </p>

                      {task.notes && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {task.notes}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <CategoryBadge category={task.category} size="xs" />
                        <PriorityBadge priority={task.priority} size="xs" />
                        {task.time && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                            <Clock className="w-3 h-3" />
                            {formatTime12h(task.time)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Widget Footer */}
      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <button
          onClick={() => openQuickAdd()}
          className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
        <button
          onClick={() => setActiveTab('planner')}
          className="font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center gap-0.5"
        >
          View all in Planner
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
