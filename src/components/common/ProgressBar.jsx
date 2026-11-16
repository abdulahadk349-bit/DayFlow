import React from 'react';

export const ProgressBar = ({
  progress = 0,
  height = 'h-2.5',
  color = 'bg-blue-600',
  trackColor = 'bg-slate-100 dark:bg-slate-800',
  showLabel = false,
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          <span>Progress</span>
          <span className="text-blue-600 dark:text-blue-400">{clamped}%</span>
        </div>
      )}
      <div className={`w-full ${trackColor} rounded-full overflow-hidden ${height} p-0.5`}>
        <div
          className={`${height} rounded-full transition-all duration-500 ease-out ${color}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
