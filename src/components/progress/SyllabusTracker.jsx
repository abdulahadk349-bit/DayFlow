import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProgressBar } from '../common/ProgressBar';
import { formatDate } from '../../utils/dateUtils';
import {
  GraduationCap,
  Plus,
  Trash2,
  RotateCw,
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const SyllabusTracker = ({ onOpenAddSubject, onOpenAddChapter }) => {
  const {
    courses,
    deleteCourse,
    updateChapterStatus,
    toggleChapterRevision,
    deleteChapter,
  } = useApp();

  const [expandedCourses, setExpandedCourses] = useState(() => {
    // default expand first two courses
    const map = {};
    courses.slice(0, 2).forEach((c) => {
      map[c.id] = true;
    });
    return map;
  });

  const toggleCourseExpand = (id) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const statusOptions = ['Not Started', 'In Progress', 'Completed'];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-6 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Syllabus & Chapter Tracker
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track curriculum completion, module milestones, and revision needs
          </p>
        </div>

        <button
          onClick={onOpenAddSubject}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Add Subject
        </button>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        {courses.length === 0 ? (
          <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-800/40">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">No subjects yet</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Add your first course or curriculum to start tracking syllabus progress.
            </p>
            <button
              onClick={onOpenAddSubject}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
            >
              Add Subject
            </button>
          </div>
        ) : (
          courses.map((course) => {
            const isExpanded = Boolean(expandedCourses[course.id]);
            const totalChaps = course.chapters.length;
            const completedChaps = course.chapters.filter((c) => c.status === 'Completed').length;
            const needsRevCount = course.chapters.filter((c) => c.needsRevision).length;
            const percentage = totalChaps > 0 ? Math.round((completedChaps / totalChaps) * 100) : 0;

            return (
              <div
                key={course.id}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs"
              >
                {/* Course Header Banner */}
                <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/40 dark:from-slate-800/80 dark:via-slate-900 dark:to-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="w-3.5 h-10 rounded-full shrink-0"
                      style={{ backgroundColor: course.color || '#2563EB' }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          {course.code}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white truncate">
                          {course.name}
                        </h4>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                        {course.targetDate && (
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            Target: {formatDate(course.targetDate)}
                          </span>
                        )}
                        <span>
                          {completedChaps} of {totalChaps} Chapters Complete
                        </span>
                        {needsRevCount > 0 && (
                          <span className="text-amber-600 dark:text-amber-400 font-semibold inline-flex items-center gap-1">
                            <RotateCw className="w-3 h-3" />
                            {needsRevCount} to revise
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right side controls */}
                  <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                    {/* Progress indicator */}
                    <div className="w-28 text-right hidden sm:block">
                      <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
                        {percentage}%
                      </span>
                      <ProgressBar progress={percentage} height="h-2" color="bg-blue-600 dark:bg-blue-500" />
                    </div>

                    <button
                      onClick={() => onOpenAddChapter(course.id, course.name)}
                      className="px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Chapter
                    </button>

                    <button
                      onClick={() => deleteCourse(course.id)}
                      title="Delete course"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => toggleCourseExpand(course.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      aria-label="Toggle chapters"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Mobile progress bar when collapsed */}
                <div className="sm:hidden px-4 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    <span>Syllabus Progress</span>
                    <span className="text-blue-600 dark:text-blue-400">{percentage}%</span>
                  </div>
                  <ProgressBar progress={percentage} height="h-1.5" />
                </div>

                {/* Chapters list (Collapsible) */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 space-y-2">
                    {course.chapters.length === 0 ? (
                      <p className="text-xs text-slate-400 dark:text-slate-500 py-3 text-center">
                        No chapters added yet. Click "Add Chapter" above.
                      </p>
                    ) : (
                      course.chapters.map((chap, idx) => {
                        const statusColors = {
                          Completed: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
                          'In Progress': 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
                          'Not Started': 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
                        };

                        return (
                          <div
                            key={chap.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition-all text-xs"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold flex items-center justify-center text-[10px] shrink-0">
                                {idx + 1}
                              </span>
                              <span
                                className={`font-semibold ${
                                  chap.status === 'Completed'
                                    ? 'text-slate-700 dark:text-slate-300'
                                    : 'text-slate-900 dark:text-white'
                                }`}
                              >
                                {chap.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 flex-wrap">
                              {/* Status Dropdown */}
                              <select
                                value={chap.status}
                                onChange={(e) =>
                                  updateChapterStatus(course.id, chap.id, e.target.value)
                                }
                                className={`font-bold px-2.5 py-1 rounded-lg border text-xs cursor-pointer focus:outline-none ${
                                  statusColors[chap.status] || statusColors['Not Started']
                                }`}
                              >
                                {statusOptions.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>

                              {/* Revision Flag Button */}
                              <button
                                onClick={() => toggleChapterRevision(course.id, chap.id)}
                                className={`px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1 transition-colors ${
                                  chap.needsRevision
                                    ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                                    : 'text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                                title="Mark for revision / review before exams"
                              >
                                <RotateCw className="w-3 h-3" />
                                <span>{chap.needsRevision ? 'Revision Flagged' : 'Revise'}</span>
                              </button>

                              {/* Delete Chapter */}
                              <button
                                onClick={() => deleteChapter(course.id, chap.id)}
                                className="p-1 rounded-md text-slate-300 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                                title="Remove chapter"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
