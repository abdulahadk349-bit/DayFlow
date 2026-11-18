// Utility functions for dates and time management in Plannix

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Calculates a date string 'YYYY-MM-DD' offset by a number of days
 * Uses local calendar math without timezone/hour drift
 */
export const getOffsetDateString = (baseDateStr, dayOffset) => {
  if (!baseDateStr) return getTodayDateString();
  const parts = baseDateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    return getTodayDateString();
  }
  const [year, month, day] = parts;
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + dayOffset);
  const resYear = d.getFullYear();
  const resMonth = String(d.getMonth() + 1).padStart(2, '0');
  const resDay = String(d.getDate()).padStart(2, '0');
  return `${resYear}-${resMonth}-${resDay}`;
};

export const getRelativeDateLabel = (dateString) => {
  if (!dateString) return '';
  const todayStr = getTodayDateString();
  const today = new Date(todayStr + 'T00:00:00');
  const target = new Date(dateString + 'T00:00:00');
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays < -1) return `${Math.abs(diffDays)}d overdue`;
  if (diffDays <= 7) return `In ${diffDays} days`;
  
  return formatDate(dateString);
};

export const formatFullHeaderDate = () => {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const formatTime12h = (time24) => {
  if (!time24) return '';
  const [h, m] = time24.split(':');
  const hours = parseInt(h, 10);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${m} ${suffix}`;
};

// Generates the 7 days of the current week based on weekStartDay ('monday' or 'sunday')
export const getCurrentWeekDates = (weekStartDay = 'monday') => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  
  // Calculate distance back to start day
  const isSundayStart = weekStartDay === 'sunday';
  const distanceToStart = isSundayStart ? dayOfWeek : (dayOfWeek + 6) % 7;
  
  const startDay = new Date(now);
  startDay.setDate(now.getDate() - distanceToStart);
  
  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDay);
    d.setDate(startDay.getDate() + i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    week.push({
      dateStr,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      isToday: dateStr === getTodayDateString(),
    });
  }
  return week;
};

/**
 * Computes active completion dates from tasks and persistent streak history.
 * An active calendar day is a day with at least one completed task.
 */
export const computeActiveDates = (tasks = [], streakHistory = [], todayStr = getTodayDateString()) => {
  const activeDates = new Set(streakHistory || []);

  // Check if any task is completed today
  const hasCompletedToday = tasks.some((t) => {
    if (!t.completed) return false;
    const completionDate = t.completedDate || t.date;
    return completionDate === todayStr;
  });

  // If no task is completed today, ensure today is not marked active
  if (!hasCompletedToday) {
    activeDates.delete(todayStr);
  } else {
    activeDates.add(todayStr);
  }

  // Include any other dates where tasks are currently completed
  tasks.forEach((t) => {
    if (t.completed) {
      const completionDate = t.completedDate || t.date;
      if (completionDate) {
        activeDates.add(completionDate);
      }
    }
  });

  return activeDates;
};

/**
 * Computes the consecutive active days streak using the user's local date.
 * - 0 days if no tasks have been completed.
 * - If today has a completed task: streak = 1 + consecutive previous days.
 * - If today has no completed task yet, but yesterday did: streak is preserved
 *   from yesterday until today's window expires.
 * - If yesterday was missed: streak is 0.
 */
export const calculateStreak = (activeDates, todayStr = getTodayDateString()) => {
  const datesSet = activeDates instanceof Set ? activeDates : new Set(activeDates || []);

  if (datesSet.size === 0) {
    return 0;
  }

  const yesterdayStr = getOffsetDateString(todayStr, -1);

  let streak = 0;
  let checkDate = null;

  if (datesSet.has(todayStr)) {
    // Active today: start count at 1, walk backward day by day
    streak = 1;
    checkDate = yesterdayStr;
    while (datesSet.has(checkDate)) {
      streak++;
      checkDate = getOffsetDateString(checkDate, -1);
    }
  } else if (datesSet.has(yesterdayStr)) {
    // Active yesterday, pending today: streak preserved from yesterday
    streak = 1;
    checkDate = getOffsetDateString(yesterdayStr, -1);
    while (datesSet.has(checkDate)) {
      streak++;
      checkDate = getOffsetDateString(checkDate, -1);
    }
  } else {
    // Neither today nor yesterday active: streak is reset to 0
    return 0;
  }

  return streak;
};
