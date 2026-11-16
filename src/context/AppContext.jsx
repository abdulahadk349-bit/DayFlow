import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  loadStoredTasks,
  saveStoredTasks,
  loadStoredCourses,
  saveStoredCourses,
  loadStoredProfile,
  saveStoredProfile,
  loadStoredSettings,
  saveStoredSettings,
  resetStoredSettings,
  loadStoredTimerSettings,
  saveStoredTimerSettings,
  loadStoredCustomPresets,
  saveStoredCustomPresets,
  loadStoredStreakHistory,
  saveStoredStreakHistory,
  resetAllDataToDefault
} from '../utils/storage';
import {
  getTodayDateString,
  computeActiveDates,
  calculateStreak
} from '../utils/dateUtils';
import { defaultSettings, defaultTimerSettings } from '../data/initialData';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => loadStoredTasks());
  const [courses, setCourses] = useState(() => loadStoredCourses());
  const [profile, setProfile] = useState(() => loadStoredProfile());
  const [settings, setSettings] = useState(() => loadStoredSettings());
  const [timerSettings, setTimerSettings] = useState(() => loadStoredTimerSettings());
  const [customPresets, setCustomPresets] = useState(() => loadStoredCustomPresets());
  const [streakHistory, setStreakHistory] = useState(() => loadStoredStreakHistory());

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddCategory, setQuickAddCategory] = useState(settings?.defaultCategory || 'Study');
  const [toastMessage, setToastMessage] = useState(null);

  // Sync tasks to localStorage
  useEffect(() => {
    saveStoredTasks(tasks);
  }, [tasks]);

  // Sync courses to localStorage
  useEffect(() => {
    saveStoredCourses(courses);
  }, [courses]);

  // Sync profile to localStorage
  useEffect(() => {
    saveStoredProfile(profile);
  }, [profile]);

  // Sync settings to localStorage
  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  // Sync timer settings to localStorage
  useEffect(() => {
    saveStoredTimerSettings(timerSettings);
  }, [timerSettings]);

  // Sync custom timer presets to localStorage
  useEffect(() => {
    saveStoredCustomPresets(customPresets);
  }, [customPresets]);

  // Dynamic calendar streak calculation
  const todayStr = getTodayDateString();
  const activeDates = useMemo(() => {
    return computeActiveDates(tasks, streakHistory, todayStr);
  }, [tasks, streakHistory, todayStr]);

  const streak = useMemo(() => {
    return calculateStreak(activeDates, todayStr);
  }, [activeDates, todayStr]);

  // Sync streak history array to localStorage whenever active dates change
  useEffect(() => {
    const datesArr = Array.from(activeDates);
    saveStoredStreakHistory(datesArr);
  }, [activeDates]);

  // Provide profile augmented with dynamic streak
  const profileWithStreak = useMemo(() => {
    return { ...profile, streak };
  }, [profile, streak]);

  // Theme management (Light, Dark, System)
  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (theme) => {
      if (theme === 'dark') {
        root.classList.add('dark');
      } else if (theme === 'light') {
        root.classList.remove('dark');
      } else if (theme === 'system') {
        const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isSystemDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme(settings.theme);

    if (settings.theme === 'system' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e) => {
        if (e.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      };
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [settings.theme]);

  // Trigger toast notification
  const showToast = (message, type = 'info') => {
    setToastMessage({ id: Date.now(), text: message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Profile Actions
  const updateProfile = (updatedFields) => {
    setProfile((prev) => {
      const next = { ...prev, ...updatedFields };
      return next;
    });
    showToast('Profile updated successfully! ✨', 'success');
  };

  // Settings Actions
  const updateSettings = (updatedFields) => {
    setSettings((prev) => {
      const next = { ...prev, ...updatedFields };
      return next;
    });
    showToast('Settings saved successfully! ⚙️', 'success');
  };

  const resetSettings = () => {
    const defaults = resetStoredSettings();
    setSettings(defaults);
    showToast('Settings restored to default values', 'info');
  };

  // Timer Actions
  const updateTimerSettings = (updatedFields) => {
    setTimerSettings((prev) => {
      const next = { ...prev, ...updatedFields };
      return next;
    });
    showToast('Timer settings updated! ⏱️', 'success');
  };

  const addCustomPreset = (preset) => {
    const newPreset = {
      id: `preset-${Date.now()}`,
      name: preset.name || 'Custom Focus',
      focus: Number(preset.focus) || 25,
      shortBreak: Number(preset.shortBreak) || 5,
      longBreak: Number(preset.longBreak) || 15,
      sessions: Number(preset.sessions) || 4,
    };
    setCustomPresets((prev) => [...prev, newPreset]);
    showToast(`Preset "${newPreset.name}" saved! 💾`, 'success');
    return newPreset;
  };

  const deleteCustomPreset = (id) => {
    setCustomPresets((prev) => prev.filter((p) => p.id !== id));
    showToast('Custom preset deleted', 'neutral');
  };

  const resetTimerConfig = () => {
    setTimerSettings(defaultTimerSettings);
    showToast('Timer restored to default configuration', 'info');
  };

  // Task Actions
  const addTask = (taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      completed: false,
      date: taskData.date || getTodayDateString(),
      time: taskData.time || '10:00',
      priority: taskData.priority || 'Medium',
      category: taskData.category || settings?.defaultCategory || 'Study',
      notes: taskData.notes || '',
      ...taskData,
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast(`Task added: "${newTask.title}"`, 'success');
    return newTask;
  };

  const updateTask = (id, updatedFields) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
    );
    showToast('Task updated successfully', 'success');
  };

  const deleteTask = (id) => {
    const t = tasks.find((item) => item.id === id);
    setTasks((prev) => prev.filter((item) => item.id !== id));
    showToast(t ? `Deleted "${t.title}"` : 'Task deleted', 'neutral');
  };

  const toggleTaskComplete = (id) => {
    const currentToday = getTodayDateString();
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = !t.completed;
          if (nextStatus) {
            showToast(`Completed "${t.title}"! 🎉`, 'success');
            // If the task date is in the past (e.g. testing controlled dates), preserve task date
            const compDate = t.date && t.date < currentToday ? t.date : currentToday;
            return { ...t, completed: true, completedDate: compDate };
          }
          return { ...t, completed: false, completedDate: null };
        }
        return t;
      })
    );
  };

  // Course & Syllabus Actions
  const addCourse = (courseData) => {
    const newCourse = {
      id: `course-${Date.now()}`,
      name: courseData.name,
      code: courseData.code || 'GEN 101',
      category: courseData.category || 'Study',
      targetDate: courseData.targetDate || '',
      color: courseData.color || '#2563EB',
      chapters: courseData.chapters || [],
    };
    setCourses((prev) => [...prev, newCourse]);
    showToast(`Course added: "${newCourse.name}"`, 'success');
  };

  const updateCourse = (id, fields) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...fields } : c))
    );
    showToast('Course updated', 'success');
  };

  const deleteCourse = (id) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    showToast('Course removed', 'neutral');
  };

  const addChapter = (courseId, chapterTitle) => {
    setCourses((prev) =>
      prev.map((course) => {
        if (course.id === courseId) {
          const newChap = {
            id: `ch-${Date.now()}`,
            title: chapterTitle,
            status: 'Not Started',
            needsRevision: false,
          };
          return {
            ...course,
            chapters: [...course.chapters, newChap],
          };
        }
        return course;
      })
    );
    showToast('New chapter added', 'success');
  };

  const updateChapterStatus = (courseId, chapterId, newStatus) => {
    setCourses((prev) =>
      prev.map((course) => {
        if (course.id === courseId) {
          return {
            ...course,
            chapters: course.chapters.map((ch) =>
              ch.id === chapterId ? { ...ch, status: newStatus } : ch
            ),
          };
        }
        return course;
      })
    );
    showToast(`Chapter status updated to ${newStatus}`, 'info');
  };

  const toggleChapterRevision = (courseId, chapterId) => {
    setCourses((prev) =>
      prev.map((course) => {
        if (course.id === courseId) {
          return {
            ...course,
            chapters: course.chapters.map((ch) =>
              ch.id === chapterId ? { ...ch, needsRevision: !ch.needsRevision } : ch
            ),
          };
        }
        return course;
      })
    );
  };

  const deleteChapter = (courseId, chapterId) => {
    setCourses((prev) =>
      prev.map((course) => {
        if (course.id === courseId) {
          return {
            ...course,
            chapters: course.chapters.filter((ch) => ch.id !== chapterId),
          };
        }
        return course;
      })
    );
    showToast('Chapter removed', 'neutral');
  };

  const resetAll = () => {
    const res = resetAllDataToDefault();
    setTasks(res.tasks);
    setCourses(res.courses);
    setProfile(res.profile);
    setSettings(res.settings);
    setTimerSettings(res.timer);
    setCustomPresets(res.customPresets);
    setStreakHistory([]);
    showToast('Cleared all data to fresh start', 'info');
  };

  const openQuickAdd = (category = null) => {
    setQuickAddCategory(category || settings?.defaultCategory || 'Study');
    setIsQuickAddOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        courses,
        profile: profileWithStreak,
        setProfile,
        updateProfile,
        streak,
        activeDates,
        settings,
        setSettings,
        updateSettings,
        resetSettings,
        timerSettings,
        setTimerSettings,
        updateTimerSettings,
        customPresets,
        addCustomPreset,
        deleteCustomPreset,
        resetTimerConfig,
        activeTab,
        setActiveTab,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        addCourse,
        updateCourse,
        deleteCourse,
        addChapter,
        updateChapterStatus,
        toggleChapterRevision,
        deleteChapter,
        isQuickAddOpen,
        setIsQuickAddOpen,
        openQuickAdd,
        quickAddCategory,
        toastMessage,
        showToast,
        resetAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
