// LocalStorage helper utilities for DayFlow
import {
  initialTasks,
  initialCourses,
  userProfile,
  defaultSettings,
  defaultTimerSettings
} from '../data/initialData';

const STORAGE_KEYS = {
  TASKS: 'dayflow_tasks_v1',
  COURSES: 'dayflow_courses_v1',
  PROFILE: 'dayflow_profile_v1',
  SETTINGS: 'dayflow_settings_v1',
  TIMER: 'dayflow_timer_settings_v1',
  CUSTOM_PRESETS: 'dayflow_timer_presets_v1',
  STREAK: 'dayflow_streak_v1',
};

export const loadStoredTasks = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(initialTasks));
      return initialTasks;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load tasks from localStorage', err);
    return initialTasks;
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
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load courses from localStorage', err);
    return initialCourses;
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
    return { ...userProfile, ...parsed };
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
  return {
    tasks: initialTasks,
    courses: initialCourses,
    profile: userProfile,
    settings: defaultSettings,
    timer: defaultTimerSettings,
    customPresets: [],
  };
};
