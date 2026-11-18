import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from './Modal';
import { getTodayDateString } from '../../utils/dateUtils';
import { BookOpen, Briefcase, User, Sparkles } from 'lucide-react';

export const QuickAddModal = ({ isOpen, onClose, defaultCategory = null }) => {
  const { addTask, courses, settings } = useApp();
  const effectiveCategory = defaultCategory || settings?.defaultCategory || 'Study';

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(effectiveCategory);
  const [date, setDate] = useState(getTodayDateString());
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [notes, setNotes] = useState('');
  const [courseId, setCourseId] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCategory(effectiveCategory);
      setDate(getTodayDateString());
      setTitle('');
      setNotes('');
      setPriority('Medium');
      setTime('');
      setCourseId('');
    }
  }, [isOpen, effectiveCategory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      category,
      date,
      time: time || '',
      priority,
      notes: notes.trim(),
      courseId: category === 'Study' ? courseId : undefined,
    });

    onClose();
  };

  const categories = [
    { id: 'Study', label: 'Study', icon: BookOpen, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/70 border-blue-200 dark:border-blue-800' },
    { id: 'Work', label: 'Work', icon: Briefcase, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/70 border-indigo-200 dark:border-indigo-800' },
    { id: 'Personal', label: 'Personal', icon: User, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800' },
  ];

  const priorities = ['Low', 'Medium', 'High'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Picker Tabs */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
            Category
          </label>
          <div className="grid grid-cols-3 gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all ${
                    isSelected
                      ? `${cat.color} ring-2 ring-blue-500/20 shadow-sm`
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Task Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Read Physics Chapter 5 or Review Q4 Budget"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 font-medium text-sm transition-all"
            autoFocus
          />
        </div>

        {/* If category is Study, allow linking to a Course */}
        {category === 'Study' && courses.length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Link to Syllabus / Course (Optional)
            </label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            >
              <option value="">-- No specific course --</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} • {course.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Date and Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Scheduled Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Scheduled Time (Optional)
              </label>
              {time && (
                <button
                  type="button"
                  onClick={() => setTime('')}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear time
                </button>
              )}
            </div>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Priority Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {priorities.map((p) => {
              const isSelected = priority === p;
              const styles = {
                High: isSelected
                  ? 'bg-rose-50 dark:bg-rose-950/70 border-rose-400 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/20'
                  : 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800',
                Medium: isSelected
                  ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-400 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/20'
                  : 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800',
                Low: isSelected
                  ? 'bg-slate-100 dark:bg-slate-800 border-slate-400 text-slate-800 dark:text-slate-200 ring-2 ring-slate-500/20'
                  : 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800',
              };

              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${styles[p]}`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Notes & Checkpoints (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="Add relevant details, formulas, checklist items, links..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm hover:shadow transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Create Task
          </button>
        </div>
      </form>
    </Modal>
  );
};
