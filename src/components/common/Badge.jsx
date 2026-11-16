import React from 'react';

export const CategoryBadge = ({ category, size = 'sm' }) => {
  const styles = {
    Study: 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-800',
    Work: 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800',
    Personal: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800',
  };

  const dots = {
    Study: 'bg-blue-500',
    Work: 'bg-indigo-500',
    Personal: 'bg-emerald-500',
  };

  const sizeClasses = size === 'xs' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  const chosenStyle = styles[category] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  const dotColor = dots[category] || 'bg-slate-400';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${chosenStyle} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {category}
    </span>
  );
};

export const PriorityBadge = ({ priority, size = 'sm' }) => {
  const styles = {
    High: 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800',
    Medium: 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800',
    Low: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700',
  };

  const icons = {
    High: '●',
    Medium: '▲',
    Low: '■',
  };

  const sizeClasses = size === 'xs' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';
  const chosenStyle = styles[priority] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border ${chosenStyle} ${sizeClasses}`}
    >
      <span className="text-[10px] opacity-75">{icons[priority] || '•'}</span>
      {priority}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const styles = {
    Completed: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800',
    'In Progress': 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-800',
    'Not Started': 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
  };

  return (
    <span
      className={`inline-flex items-center text-xs px-2.5 py-0.5 font-medium rounded-full border ${
        styles[status] || styles['Not Started']
      }`}
    >
      {status}
    </span>
  );
};
