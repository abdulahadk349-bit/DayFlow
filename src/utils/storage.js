// LocalStorage helper utilities for Plannix
import {
  initialTasks,
  initialCourses,
  userProfile,
  defaultSettings,
  defaultTimerSettings,
  DEMO_TASK_IDS,
  DEMO_TASK_TITLES,
  DEMO_COURSE_IDS,
  DEMO_COURSE_CODES,
} from '../data/initialData';

const STORAGE_KEYS = {
  TASKS: 'dayflow_tasks_v1',
  COURSES: 'dayflow_courses_v1',
  PROFILE: 'dayflow_profile_v1',
  SETTINGS: 'dayflow_settings_v1',
  TIMER: 'dayflow_timer_settings_v1',
  CUSTOM_PRESETS: 'dayflow_timer_presets_v1',
  STREAK_HISTORY: 'dayflow_streak_history_v1',
};

export const loadStoredTasks = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(initialTasks));
      return initialTasks;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Filter out identifiable demo/sample records to preserve genuine user tasks
      const cleaned = parsed.filter(
        (t) => !DEMO_TASK_IDS.has(t.id) && !DEMO_TASK_TITLES.has(t.title)
      );
      if (cleaned.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(cleaned));
      }
      return cleaned;
    }
    return [];
  } catch (err) {
    console.error('Failed to load tasks from localStorage', err);
    return [];
  }
};

export const saveStoredTasks = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks to localStorage', err);
  }
};

export const loadStoredCourses = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COURSES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(initialCourses));
      return initialCourses;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Filter out identifiable demo courses to preserve genuine user courses
      const cleaned = parsed.filter(
        (c) => !DEMO_COURSE_IDS.has(c.id) && !DEMO_COURSE_CODES.has(c.code)
      );
      if (cleaned.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(cleaned));
      }
      return cleaned;
    }
    return [];
  } catch (err) {
    console.error('Failed to load courses from localStorage', err);
    return [];
  }
};

export const saveStoredCourses = (courses) => {
  try {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  } catch (err) {
    console.error('Failed to save courses to localStorage', err);
  }
};

export const loadStoredProfile = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
      return userProfile;
    }
    const parsed = JSON.parse(raw);
    
    // Sanitize any demo values if previously stored
    const isDemoName = parsed.name === 'Alex Rivera' || parsed.name === 'Alex Rivera (Lead Builder)';
    const isDemoEmail = parsed.email === 'alex.rivera@dayflow.app' || parsed.email === 'alex.rivera@plannix.app';
    const isDemoBio = typeof parsed.bio === 'string' && parsed.bio.includes('Computer Science student & part-time developer');
    const isDemoQuote = parsed.dailyQuote === 'Consistency is the playground of mastery.';

    const cleaned = {
      ...userProfile,
      ...parsed,
      name: isDemoName ? '' : (parsed.name || ''),
      email: isDemoEmail ? '' : (parsed.email || ''),
      bio: isDemoBio ? '' : (parsed.bio || ''),
      dailyQuote: isDemoQuote ? '' : (parsed.dailyQuote || ''),
      streak: 0, // dynamic streak calculation will govern this
    };

    if (isDemoName || isDemoEmail || isDemoBio || isDemoQuote) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch (err) {
    console.error('Failed to load profile', err);
    return userProfile;
  }
};

export const saveStoredProfile = (profile) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile', err);
  }
};

export const loadStoredStreakHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STREAK_HISTORY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load streak history', err);
    return [];
  }
};

export const saveStoredStreakHistory = (history) => {
  try {
    const arr = Array.isArray(history) ? history : Array.from(history || []);
    localStorage.setItem(STORAGE_KEYS.STREAK_HISTORY, JSON.stringify(arr));
  } catch (err) {
    console.error('Failed to save streak history', err);
  }
};

export const loadStoredSettings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
      return defaultSettings;
    }
    const parsed = JSON.parse(raw);
    return { ...defaultSettings, ...parsed };
  } catch (err) {
    console.error('Failed to load settings', err);
    return defaultSettings;
  }
};

export const saveStoredSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings', err);
  }
};

export const resetStoredSettings = () => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
  return defaultSettings;
};

// Focus Flow Timer Settings & Custom Presets
export const loadStoredTimerSettings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TIMER);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TIMER, JSON.stringify(defaultTimerSettings));
      return defaultTimerSettings;
    }
    const parsed = JSON.parse(raw);
    return { ...defaultTimerSettings, ...parsed };
  } catch (err) {
    console.error('Failed to load timer settings', err);
    return defaultTimerSettings;
  }
};

export const saveStoredTimerSettings = (timerSettings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TIMER, JSON.stringify(timerSettings));
  } catch (err) {
    console.error('Failed to save timer settings', err);
  }
};

export const loadStoredCustomPresets = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_PRESETS);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load custom presets', err);
    return [];
  }
};

export const saveStoredCustomPresets = (presets) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_PRESETS, JSON.stringify(presets));
  } catch (err) {
    console.error('Failed to save custom presets', err);
  }
};

export const resetAllDataToDefault = () => {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(initialTasks));
  localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(initialCourses));
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
  localStorage.setItem(STORAGE_KEYS.TIMER, JSON.stringify(defaultTimerSettings));
  localStorage.removeItem(STORAGE_KEYS.CUSTOM_PRESETS);
  localStorage.removeItem(STORAGE_KEYS.STREAK_HISTORY);
  return {
    tasks: initialTasks,
    courses: initialCourses,
    profile: userProfile,
    settings: defaultSettings,
    timer: defaultTimerSettings,
    customPresets: [],
    streakHistory: [],
    streak: 0,
  };
};
