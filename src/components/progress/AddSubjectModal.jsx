import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Sparkles } from 'lucide-react';

export const AddSubjectModal = ({ isOpen, onClose }) => {
  const { addCourse } = useApp();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('Study');
  const [targetDate, setTargetDate] = useState('');
  const [color, setColor] = useState('#2563EB');

  const colorOptions = [
    { label: 'Royal Blue', value: '#2563EB' },
    { label: 'Indigo', value: '#4F46E5' },
    { label: 'Teal', value: '#0D9488' },
    { label: 'Violet', value: '#7C3AED' },
    { label: 'Amber', value: '#EA580C' },
    { label: 'Emerald', value: '#059669' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCourse({
      name: name.trim(),
      code: code.trim() || 'GEN 101',
      category,
      targetDate,
      color,
      chapters: [
        { id: `ch-${Date.now()}-1`, title: 'Chapter 1: Introduction & Fundamentals', status: 'Not Started', needsRevision: false },
        { id: `ch-${Date.now()}-2`, title: 'Chapter 2: Core Principles & Methodology', status: 'Not Started', needsRevision: false },
      ],
    });

    setName('');
    setCode('');
    setTargetDate('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Syllabus Subject / Course">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Subject / Course Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Neuroscience & Cognitive Systems or Advanced Marketing"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Course Code / Short Tag
            </label>
            <input
              type="text"
              placeholder="e.g. CS 301, BIO 102"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            >
              <option value="Study">Study (Academic / Course)</option>
              <option value="Work">Work (Professional Skill)</option>
              <option value="Personal">Personal (Self-Improvement)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Target Exam / Completion Date
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
            Theme Accent Color
          </label>
          <div className="flex items-center gap-3">
            {colorOptions.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setColor(c.value)}
                className={`w-8 h-8 rounded-full border-2 transition-transform ${
                  color === c.value ? 'scale-125 border-slate-900 dark:border-white shadow-sm' : 'border-white dark:border-slate-800'
                }`}
                style={{ backgroundColor: c.value }}
                title={c.label}
              />
            ))}
          </div>
        </div>

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
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Add Subject
          </button>
        </div>
      </form>
    </Modal>
  );
};
