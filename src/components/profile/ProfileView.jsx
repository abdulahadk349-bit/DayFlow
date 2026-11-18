import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserAvatar, presetAvatars } from '../common/UserAvatar';
import {
  User,
  Settings,
  Camera,
  Upload,
  Trash2,
  Sun,
  Moon,
  Laptop,
  Calendar,
  Check,
  RotateCcw,
  Sparkles,
  BookOpen,
  Briefcase,
  Target,
  Flame,
  Clock,
  Bell,
  HelpCircle
} from 'lucide-react';

export const ProfileView = () => {
  const {
    profile,
    updateProfile,
    settings,
    updateSettings,
    resetSettings,
    tasks,
    courses,
    showToast,
  } = useApp();

  // Local state for profile form
  const [name, setName] = useState(profile.name || '');
  const [email, setEmail] = useState(profile.email || '');
  const [role, setRole] = useState(profile.role || 'Student');
  const [bio, setBio] = useState(profile.bio || '');
  const [avatar, setAvatar] = useState(profile.avatar || '');
  const [avatarPreset, setAvatarPreset] = useState(profile.avatarPreset || 'tech');
  const [dailyQuote, setDailyQuote] = useState(profile.dailyQuote || '');

  // Local state for settings form
  const [theme, setTheme] = useState(settings.theme || 'light');
  const [weekStartDay, setWeekStartDay] = useState(settings.weekStartDay || 'monday');
  const [defaultCategory, setDefaultCategory] = useState(settings.defaultCategory || 'Study');
  const [dailyGoal, setDailyGoal] = useState(settings.dailyGoal || 6);
  const [focusDuration, setFocusDuration] = useState(settings.focusDuration || 25);
  const [soundCelebration, setSoundCelebration] = useState(settings.soundCelebration ?? true);

  const fileInputRef = useRef(null);

  // Synchronize when context updates
  useEffect(() => {
    setName(profile.name || '');
    setEmail(profile.email || '');
    setRole(profile.role || 'Student');
    setBio(profile.bio || '');
    setAvatar(profile.avatar || '');
    setAvatarPreset(profile.avatarPreset || 'tech');
    setDailyQuote(profile.dailyQuote || '');
  }, [profile]);

  useEffect(() => {
    setTheme(settings.theme || 'light');
    setWeekStartDay(settings.weekStartDay || 'monday');
    setDefaultCategory(settings.defaultCategory || 'Study');
    setDailyGoal(settings.dailyGoal || 6);
    setFocusDuration(settings.focusDuration || 25);
    setSoundCelebration(settings.soundCelebration ?? true);
  }, [settings]);

  // Handle image upload with Base64 conversion
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP)', 'warning');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast('Image is larger than 2MB. Please choose a smaller photo.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result;
      if (typeof base64Url === 'string') {
        setAvatar(base64Url);
        showToast('Profile image uploaded! Click Save to apply.', 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatar('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('Custom image removed. Preset avatar will be used.', 'info');
  };

  // Save profile and settings
  const handleSaveAll = (e) => {
    e?.preventDefault();

    updateProfile({
      name: name.trim(),
      email: email.trim(),
      role,
      bio: bio.trim(),
      avatar,
      avatarPreset,
      dailyQuote: dailyQuote.trim(),
      dailyGoal: Number(dailyGoal) || 6,
    });

    updateSettings({
      theme,
      weekStartDay,
      defaultCategory,
      dailyGoal: Number(dailyGoal) || 6,
      focusDuration: Number(focusDuration) || 25,
      soundCelebration,
    });
  };

  // Reset to default settings
  const handleResetSettings = () => {
    resetSettings();
    setTheme('light');
    setWeekStartDay('monday');
    setDefaultCategory('Study');
    setDailyGoal(6);
    setFocusDuration(25);
    setSoundCelebration(true);
  };

  // Stats for the hero summary
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalChapters = courses.reduce((acc, c) => acc + c.chapters.length, 0);
  const completedChapters = courses.reduce(
    (acc, c) => acc + c.chapters.filter((ch) => ch.status === 'Completed').length,
    0
  );

  const roleOptions = [
    { id: 'Student', label: 'Student', icon: BookOpen },
    { id: 'Employee', label: 'Employee', icon: Briefcase },
    { id: 'Freelancer', label: 'Freelancer', icon: Sparkles },
    { id: 'Other', label: 'Other', icon: User },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-14">
      {/* Profile Header Hero Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-subtle relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Avatar display */}
            <div className="relative group self-start sm:self-center">
              <UserAvatar
                profile={{ ...profile, name, avatar, avatarPreset }}
                size="2xl"
                className="ring-4 ring-blue-50 dark:ring-blue-900/30 shadow-md"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-transform active:scale-90"
                title="Change Photo"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {name || 'Your Name'}
                </h2>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {role}
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {email || 'user@plannix.app'}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-lg leading-relaxed">
                {bio || 'Set your personal bio in the form below.'}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 shrink-0 md:w-64 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Tasks Done
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                {completedTasks}/{totalTasks}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Streak
              </span>
              <span className="text-2xl font-black text-amber-500 mt-1 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 fill-amber-500" />
                {profile.streak}d
              </span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* SECTION 1: Personal Profile Details */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-6 transition-colors">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Profile Information
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personal identity and visual representation across Plannix
              </p>
            </div>
          </div>

          {/* Avatar & Photo Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Profile Avatar
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
                >
                  <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Upload Custom Photo
                </button>

                {avatar && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-semibold transition-colors"
                    title="Remove custom photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Or Choose from Preset Avatars */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-400 font-medium">Or choose avatar:</span>
                <div className="flex items-center gap-2">
                  {presetAvatars.map((preset) => {
                    const isSelected = !avatar && avatarPreset === preset.id;
                    const Icon = preset.icon;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setAvatar('');
                          setAvatarPreset(preset.id);
                        }}
                        className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${preset.bg} text-white flex items-center justify-center transition-all ${
                          isSelected
                            ? 'ring-2 ring-offset-2 ring-blue-600 scale-110 shadow-sm'
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        title={preset.label}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields: Name, Email, Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Display Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. alex@university.edu"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Role selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              User Role
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {roleOptions.map((r) => {
                const Icon = r.icon;
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-500 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Personal Bio */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Personal Bio
              </label>
              <span className="text-[11px] text-slate-400 font-medium">
                {bio.length}/180 characters
              </span>
            </div>
            <textarea
              rows={2}
              maxLength={180}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell Plannix about your focus goals, studies, or daily rhythm..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            />
          </div>
        </div>

        {/* SECTION 2: Profile Settings */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-6 transition-colors">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Application & Productivity Settings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Appearance, calendar week structure, and default task behavior
              </p>
            </div>
          </div>

          {/* 1. Theme Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Appearance Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'light', label: 'Light', icon: Sun, desc: 'Clean slate & blue accents' },
                { id: 'dark', label: 'Dark', icon: Moon, desc: 'Midnight slate navy' },
                { id: 'system', label: 'System', icon: Laptop, desc: 'Sync with OS setting' },
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-extrabold">{t.label}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:block mt-0.5">
                      {t.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Week Preferences & Default Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Week Preferences */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Week Start Day
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'monday', label: 'Monday (Mon–Sun)' },
                  { id: 'sunday', label: 'Sunday (Sun–Sat)' },
                ].map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setWeekStartDay(w.id)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                      weekStartDay === w.id
                        ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-600 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Controls the weekly completion chart and planner week range.
              </p>
            </div>

            {/* Default Task Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Default Task Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Study', 'Work', 'Personal'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setDefaultCategory(cat)}
                    className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-all ${
                      defaultCategory === cat
                        ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-600 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Pre-selected when opening Quick-Add and Task creation dialogs.
              </p>
            </div>
          </div>

          {/* 3. Personalization Preferences */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Personalization & Focus Preferences
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Daily Target Goal */}
              <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Daily Task Goal
                    </span>
                  </div>
                  <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                    {dailyGoal} tasks / day
                  </span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={12}
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Focus Session Duration */}
              <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Focus Flow Session
                    </span>
                  </div>
                  <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                    {focusDuration} minutes
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 mt-2">
                  {[15, 25, 45, 60].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setFocusDuration(dur)}
                      className={`py-1 rounded-lg text-xs font-bold transition-all ${
                        focusDuration === dur
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      {dur}m
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Motivational Quote Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Dashboard Focus Quote / Status
              </label>
              <input
                type="text"
                value={dailyQuote}
                onChange={(e) => setDailyQuote(e.target.value)}
                placeholder="e.g. Consistency is the playground of mastery."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Action Controls: Save & Reset */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={handleResetSettings}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold text-xs sm:text-sm transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Settings to Default
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            Save Profile & Settings
          </button>
        </div>
      </form>
    </div>
  );
};
