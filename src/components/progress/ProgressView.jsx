import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WeeklyStatsChart } from './WeeklyStatsChart';
import { CategoryBreakdownChart } from './CategoryBreakdownChart';
import { SyllabusTracker } from './SyllabusTracker';
import { AddSubjectModal } from './AddSubjectModal';
import { AddChapterModal } from './AddChapterModal';
import { StatCard } from '../common/StatCard';
import { getCurrentWeekDates } from '../../utils/dateUtils';
import {
  TrendingUp,
  GraduationCap,
  RotateCw,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

export const ProgressView = () => {
  const { tasks, courses, settings } = useApp();

  // Modal states
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [addChapterData, setAddChapterData] = useState({
    isOpen: false,
    courseId: '',
    courseName: '',
  });

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  const weekDays = getCurrentWeekDates(settings?.weekStartDay || 'monday').map((w) => w.dateStr);
  const thisWeekCompleted = tasks.filter(
    (t) => t.completed && weekDays.includes(t.date)
  ).length;

  const totalChapters = courses.reduce((acc, c) => acc + c.chapters.length, 0);
  const completedChapters = courses.reduce(
    (acc, c) => acc + c.chapters.filter((ch) => ch.status === 'Completed').length,
    0
  );
  const needsRevisionChapters = courses.reduce(
    (acc, c) => acc + c.chapters.filter((ch) => ch.needsRevision).length,
    0
  );
  const overallSyllabusRate =
    totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

  const handleOpenAddChapter = (courseId, courseName) => {
    setAddChapterData({
      isOpen: true,
      courseId,
      courseName,
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-subtle transition-colors">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Progress & Syllabus Analytics
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track weekly momentum, curriculum milestones, and chapter revision states.
          </p>
        </div>

        <button
          onClick={() => setIsAddSubjectOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all hover:shadow active:scale-95 shrink-0"
        >
          <BookOpen className="w-4 h-4 stroke-[2.5]" />
          New Subject
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Done This Week"
          value={thisWeekCompleted}
          subtitle="Tasks completed this week"
          icon={TrendingUp}
          colorScheme="blue"
        />
        <StatCard
          title="Syllabus Done"
          value={`${overallSyllabusRate}%`}
          subtitle={`${completedChapters} of ${totalChapters} Chapters`}
          icon={GraduationCap}
          colorScheme="indigo"
        />
        <StatCard
          title="Revision Flags"
          value={needsRevisionChapters}
          subtitle="Chapters to review"
          icon={RotateCw}
          colorScheme="amber"
        />
        <StatCard
          title="All-Time Done"
          value={`${completedTasks}/${totalTasks}`}
          subtitle={`${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% completion`}
          icon={CheckCircle2}
          colorScheme="emerald"
        />
      </div>

      {/* Weekly Activity Chart */}
      <WeeklyStatsChart />

      {/* Category Breakdown & Status Charts */}
      <CategoryBreakdownChart />

      {/* Full Syllabus & Chapter Tracker */}
      <SyllabusTracker
        onOpenAddSubject={() => setIsAddSubjectOpen(true)}
        onOpenAddChapter={handleOpenAddChapter}
      />

      {/* Add Subject Modal */}
      <AddSubjectModal
        isOpen={isAddSubjectOpen}
        onClose={() => setIsAddSubjectOpen(false)}
      />

      {/* Add Chapter Modal */}
      <AddChapterModal
        isOpen={addChapterData.isOpen}
        onClose={() =>
          setAddChapterData({ isOpen: false, courseId: '', courseName: '' })
        }
        courseId={addChapterData.courseId}
        courseName={addChapterData.courseName}
      />
    </div>
  );
};
