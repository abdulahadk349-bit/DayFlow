import React from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, ChevronRight } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

export const SyllabusSnapshotWidget = () => {
  const { courses, setActiveTab } = useApp();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-subtle flex flex-col justify-between transition-colors">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Syllabus Progress
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Active subjects & chapter goals</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('progress')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-0.5"
          >
            Manage
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-4">
          {courses.slice(0, 3).map((course) => {
            const total = course.chapters.length;
            const completed = course.chapters.filter((c) => c.status === 'Completed').length;
            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

            // find the first chapter in progress or not started
            const currentChapter =
              course.chapters.find((c) => c.status === 'In Progress') ||
              course.chapters.find((c) => c.status === 'Not Started');

            return (
              <div
                key={course.id}
                className="p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {course.code}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {course.name}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 shrink-0 ml-2">
                    {percentage}%
                  </span>
                </div>

                <ProgressBar progress={percentage} height="h-2" color="bg-blue-600 dark:bg-blue-500" />

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  <span>
                    {completed}/{total} chapters done
                  </span>
                  {currentChapter && (
                    <span className="text-slate-600 dark:text-slate-300 font-medium truncate max-w-[170px]">
                      Next: {currentChapter.title.split(':')[0]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-400 dark:text-slate-500 font-medium">
          Tracking {courses.length} subjects
        </span>
        <button
          onClick={() => setActiveTab('progress')}
          className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700"
        >
          View Full Curriculum →
        </button>
      </div>
    </div>
  );
};
