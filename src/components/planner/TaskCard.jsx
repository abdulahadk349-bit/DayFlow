import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDate, formatTime12h } from '../../utils/dateUtils';
import { CategoryBadge, PriorityBadge } from '../common/Badge';
import {
  Check,
  Clock,
  Calendar,
  MoreVertical,
  Pencil,
  Trash2,
  Bookmark,
  RotateCw
} from 'lucide-react';

export const TaskCard = ({ task, onEdit }) => {
  const {
    toggleTaskComplete,
    deleteTask,
    courses,
    repeatTaskTomorrow,
    dismissRepeatPrompt,
    dismissedRepeatIds,
  } = useApp();
  const [showMenu, setShowMenu] = useState(false);

  const matchedCourse = task.courseId
    ? courses.find((c) => c.id === task.courseId)
    : null;

  return (
    <div
      className={`group relative bg-white dark:bg-slate-800/80 rounded-2xl p-4 sm:p-5 border transition-all ${
        task.completed
          ? 'bg-slate-50/70 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800/60 opacity-60'
          : 'border-slate-200/80 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-card'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          {/* Checkbox */}
          <button
            onClick={() => toggleTaskComplete(task.id)}
            className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center transition-all shrink-0 ${
              task.completed
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-slate-300 dark:border-slate-600 hover:border-blue-500 bg-white dark:bg-slate-800'
            }`}
            aria-label="Toggle task completion"
          >
            {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>

          {/* Details */}
          <div className="min-w-0 flex-1">
            <h4
              className={`text-sm sm:text-base font-bold leading-snug transition-all ${
                task.completed
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'
              }`}
            >
              {task.title}
            </h4>

            {task.notes && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {task.notes}
              </p>
            )}

            {/* Course indicator if attached */}
            {matchedCourse && (
              <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-[11px] font-semibold text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                <Bookmark className="w-3 h-3 text-blue-500" />
                <span>{matchedCourse.code}: {matchedCourse.name}</span>
              </div>
            )}

            {/* Badges and metadata */}
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60">
              <CategoryBadge category={task.category} size="xs" />
              <PriorityBadge priority={task.priority} size="xs" />

              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 ml-auto">
                {task.time && (
                  <span className="inline-flex items-center gap-1 font-medium text-slate-500 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {formatTime12h(task.time)}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 font-medium text-slate-500 dark:text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {formatDate(task.date)}
                </span>
              </div>
            </div>

            {/* Repeat Tomorrow Option when completed */}
            {task.completed && (
              !task.repeatedTomorrow && !dismissedRepeatIds?.has(task.id) ? (
                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold text-xs">
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Repeat tomorrow?</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => repeatTaskTomorrow(task.id)}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] transition-colors shadow-xs"
                    >
                      Repeat Tomorrow
                    </button>
                    <button
                      type="button"
                      onClick={() => dismissRepeatPrompt(task.id)}
                      className="px-2 py-1 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-[11px] transition-colors"
                    >
                      No Thanks
                    </button>
                  </div>
                </div>
              ) : task.repeatedTomorrow ? (
                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Scheduled to repeat tomorrow</span>
                </div>
              ) : null
            )}
          </div>
        </div>

        {/* Dropdown Actions */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-7 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-elevated border border-slate-200 dark:border-slate-700 py-1.5 z-30 text-xs font-semibold">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEdit(task);
                  }}
                  className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <Pencil className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  Edit Task
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    deleteTask(task.id);
                  }}
                  className="w-full px-3 py-2 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
