import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { getTodayDateString } from '../../utils/dateUtils';
import { BookOpen, Briefcase, User, Sparkles } from 'lucide-react';

export const TaskFormModal = ({ isOpen, onClose, initialData = null }) => {
  const { addTask, updateTask, courses, settings } = useApp();

  const isEdit = Boolean(initialData);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(settings?.defaultCategory || 'Study');
  const [date, setDate] = useState(getTodayDateString());
  const [time, setTime] = useState('10:00');
  const [priority, setPriority] = useState('Medium');
  const [notes, setNotes] = useState('');
  const [courseId, setCourseId] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setCategory(initialData.category || 'Study');
      setDate(initialData.date || getTodayDateString());
      setTime(initialData.time || '10:00');
      setPriority(initialData.priority || 'Medium');
      setNotes(initialData.notes || '');
      setCourseId(initialData.courseId || '');
    } else {
      setTitle('');
      setCategory(settings?.defaultCategory || 'Study');
      setDate(getTodayDateString());
      setTime('10:00');
      setPriority('Medium');
      setNotes('');
      setCourseId('');
    }
  }, [initialData, isOpen, settings?.defaultCategory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title: title.trim(),
      category,
      date,
      time,
      priority,
      notes: notes.trim(),
      courseId: category === 'Study' ? courseId : undefined,
    };

    if (isEdit) {
      updateTask(initialData.id, payload);
    } else {
      addTask(payload);
    }

    onClose();
  };

  const categories = [
    { id: 'Study', label: 'Study', icon: BookOpen, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/70 border-blue-200 dark:border-blue-800' },
    { id: 'Work', label: 'Work', icon: Briefcase, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/70 border-indigo-200 dark:border-indigo-800' },
    { id: 'Personal', label: 'Personal', icon: User, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800' },
  ];

  const priorities = ['Low', 'Medium', 'High'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Task' : 'Create New Task'}
    >
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
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 font-medium text-sm transition-all"
            autoFocus
          />
        </div>

        {/* Link to Syllabus course if Study */}
        {category === 'Study' && courses.length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Associated Syllabus Course (Optional)
            </label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            >
              <option value="">-- No specific subject --</option>
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
              Date
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
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Time
            </label>
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
            Notes & Details
          </label>
          <textarea
            rows={3}
            placeholder="Add relevant notes, links, or instructions..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all"
          >
            {isEdit ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
