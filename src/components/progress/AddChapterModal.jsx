import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Plus } from 'lucide-react';

export const AddChapterModal = ({ isOpen, onClose, courseId, courseName }) => {
  const { addChapter } = useApp();
  const [chapterTitle, setChapterTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!chapterTitle.trim() || !courseId) return;

    addChapter(courseId, chapterTitle.trim());
    setChapterTitle('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add Chapter to ${courseName || 'Subject'}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Chapter / Module Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Chapter 8: Fourier Transforms & Spectral Analysis"
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            autoFocus
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Chapter
          </button>
        </div>
      </form>
    </Modal>
  );
};
