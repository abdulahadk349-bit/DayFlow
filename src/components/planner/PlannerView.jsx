import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskFilters } from './TaskFilters';
import { TaskCard } from './TaskCard';
import { TaskFormModal } from './TaskFormModal';
import { getTodayDateString, getCurrentWeekDates } from '../../utils/dateUtils';
import { Plus, Inbox, Clock } from 'lucide-react';

export const PlannerView = () => {
  const { tasks, settings } = useApp();

  const [category, setCategory] = useState('All');
  const [priority, setPriority] = useState('All');
  const [status, setStatus] = useState('All');
  const [dateRange, setDateRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'schedule' | 'columns'

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const todayStr = getTodayDateString();

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Category filter
      if (category !== 'All' && task.category !== category) return false;

      // Priority filter
      if (priority !== 'All' && task.priority !== priority) return false;

      // Status filter
      if (status === 'Pending' && task.completed) return false;
      if (status === 'Completed' && !task.completed) return false;

      // Date Range filter
      if (dateRange === 'today' && task.date !== todayStr) return false;
      if (dateRange === 'tomorrow') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        if (task.date !== tomorrowStr) return false;
      }
      if (dateRange === 'week') {
        const weekDates = getCurrentWeekDates(settings?.weekStartDay || 'monday').map((w) => w.dateStr);
        if (!weekDates.includes(task.date)) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(q);
        const matchesNotes = task.notes ? task.notes.toLowerCase().includes(q) : false;
        if (!matchesTitle && !matchesNotes) return false;
      }

      return true;
    });
  }, [tasks, category, priority, status, dateRange, searchQuery, todayStr, settings?.weekStartDay]);

  // Sort tasks chronologically by date then time
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      return (a.time || '').localeCompare(b.time || '');
    });
  }, [filteredTasks]);

  const handleOpenAdd = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Planner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-subtle transition-colors">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Task Planner
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize study schedules, project deadlines, and personal milestones.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all hover:shadow active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Create Task
        </button>
      </div>

      {/* Filter Component */}
      <TaskFilters
        category={category}
        setCategory={setCategory}
        priority={priority}
        setPriority={setPriority}
        status={status}
        setStatus={setStatus}
        dateRange={dateRange}
        setDateRange={setDateRange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* View Modes */}
      {sortedTasks.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 shadow-subtle transition-colors">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No tasks found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
            There are no tasks matching your current filter criteria. Try adjusting your filters or create a new task.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Task
          </button>
        </div>
      ) : viewMode === 'list' ? (
        /* List View */
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            <span>Showing {sortedTasks.length} tasks</span>
            <span>Sorted by date & time</span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {sortedTasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={handleOpenEdit} />
            ))}
          </div>
        </div>
      ) : viewMode === 'schedule' ? (
        /* Schedule / Time Blocking View */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-6 transition-colors">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Chronological Time Block View
            </h3>
          </div>

          <div className="relative border-l-2 border-blue-100 dark:border-slate-700 ml-4 pl-6 space-y-6">
            {sortedTasks.map((task) => (
              <div key={task.id} className="relative group">
                {/* Dot on line */}
                <span
                  className={`absolute -left-[31px] top-4 w-4 h-4 rounded-full border-2 bg-white dark:bg-slate-900 transition-all ${
                    task.completed
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60'
                      : 'border-blue-600 dark:border-blue-400 group-hover:scale-125'
                  }`}
                />
                <TaskCard task={task} onEdit={handleOpenEdit} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Columns View: Study, Work, Personal */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Study', 'Work', 'Personal'].map((col) => {
            const colTasks = sortedTasks.filter((t) => t.category === col);
            return (
              <div
                key={col}
                className="bg-slate-100/70 dark:bg-slate-800/40 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 flex flex-col space-y-4"
              >
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        col === 'Study'
                          ? 'bg-blue-600'
                          : col === 'Work'
                          ? 'bg-indigo-600'
                          : 'bg-emerald-600'
                      }`}
                    />
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {col}
                    </h3>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-xs">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh]">
                  {colTasks.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                      No {col} tasks
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <TaskCard key={task.id} task={task} onEdit={handleOpenEdit} />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Form Modal for Add or Edit */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        initialData={editingTask}
      />
    </div>
  );
};
