import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { standardPresets } from '../../data/initialData';
import { playTimerChime } from '../../utils/soundUtils';
import {
  Timer,
  Sparkles,
  Volume2,
  Bookmark,
  Trash2,
  Check,
  RotateCcw,
  Plus,
  Play
} from 'lucide-react';

export const TimerSettingsModal = ({ isOpen, onClose, onApplyDurations }) => {
  const {
    timerSettings,
    updateTimerSettings,
    customPresets,
    addCustomPreset,
    deleteCustomPreset,
    resetTimerConfig,
    showToast,
  } = useApp();

  // Durations form state
  const [focusDuration, setFocusDuration] = useState(timerSettings?.focusDuration || 25);
  const [shortBreakDuration, setShortBreakDuration] = useState(timerSettings?.shortBreakDuration || 5);
  const [longBreakDuration, setLongBreakDuration] = useState(timerSettings?.longBreakDuration || 15);
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(timerSettings?.sessionsBeforeLongBreak || 4);

  // Transitions & Sound
  const [autoStartBreaks, setAutoStartBreaks] = useState(timerSettings?.autoStartBreaks || false);
  const [autoStartFocus, setAutoStartFocus] = useState(timerSettings?.autoStartFocus || false);
  const [soundEnabled, setSoundEnabled] = useState(timerSettings?.soundEnabled ?? true);
  const [activePreset, setActivePreset] = useState(timerSettings?.activePreset || '25/5');

  // Custom preset creation state
  const [newPresetName, setNewPresetName] = useState('');
  const [showSavePreset, setShowSavePreset] = useState(false);

  useEffect(() => {
    if (timerSettings) {
      setFocusDuration(timerSettings.focusDuration || 25);
      setShortBreakDuration(timerSettings.shortBreakDuration || 5);
      setLongBreakDuration(timerSettings.longBreakDuration || 15);
      setSessionsBeforeLongBreak(timerSettings.sessionsBeforeLongBreak || 4);
      setAutoStartBreaks(timerSettings.autoStartBreaks || false);
      setAutoStartFocus(timerSettings.autoStartFocus || false);
      setSoundEnabled(timerSettings.soundEnabled ?? true);
      setActivePreset(timerSettings.activePreset || '25/5');
    }
  }, [timerSettings, isOpen]);

  const handleSelectStandardPreset = (preset) => {
    setFocusDuration(preset.focus);
    setShortBreakDuration(preset.shortBreak);
    setLongBreakDuration(preset.longBreak);
    setSessionsBeforeLongBreak(preset.sessions);
    setActivePreset(preset.id);
  };

  const handleSelectCustomPreset = (preset) => {
    setFocusDuration(preset.focus);
    setShortBreakDuration(preset.shortBreak);
    setLongBreakDuration(preset.longBreak);
    setSessionsBeforeLongBreak(preset.sessions);
    setActivePreset(preset.id);
    showToast(`Loaded preset "${preset.name}"`, 'info');
  };

  const handleSaveCustomPreset = (e) => {
    e.preventDefault();
    if (!newPresetName.trim()) {
      showToast('Please enter a name for the custom preset', 'warning');
      return;
    }

    const created = addCustomPreset({
      name: newPresetName.trim(),
      focus: focusDuration,
      shortBreak: shortBreakDuration,
      longBreak: longBreakDuration,
      sessions: sessionsBeforeLongBreak,
    });

    setActivePreset(created.id);
    setNewPresetName('');
    setShowSavePreset(false);
  };

  const handleSaveAll = (e) => {
    e?.preventDefault();

    // Validate bounds
    const safeFocus = Math.min(180, Math.max(1, Number(focusDuration) || 25));
    const safeShort = Math.min(60, Math.max(1, Number(shortBreakDuration) || 5));
    const safeLong = Math.min(120, Math.max(1, Number(longBreakDuration) || 15));
    const safeSessions = Math.min(12, Math.max(1, Number(sessionsBeforeLongBreak) || 4));

    const updated = {
      focusDuration: safeFocus,
      shortBreakDuration: safeShort,
      longBreakDuration: safeLong,
      sessionsBeforeLongBreak: safeSessions,
      autoStartBreaks,
      autoStartFocus,
      soundEnabled,
      activePreset,
    };

    updateTimerSettings(updated);
    if (onApplyDurations) {
      onApplyDurations(updated);
    }
    onClose();
  };

  const handleResetToDefaults = () => {
    resetTimerConfig();
    setFocusDuration(25);
    setShortBreakDuration(5);
    setLongBreakDuration(15);
    setSessionsBeforeLongBreak(4);
    setAutoStartBreaks(false);
    setAutoStartFocus(false);
    setSoundEnabled(true);
    setActivePreset('25/5');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Focus Timer Customization" maxWidth="max-w-xl">
      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* Quick Presets */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Standard Presets
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {standardPresets.map((p) => {
              const isSelected = activePreset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectStandardPreset(p)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="text-xs font-extrabold">{p.id}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {p.name.split(' ')[1] || 'Flow'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Presets saved by user */}
        {customPresets.length > 0 && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              My Saved Presets
            </label>
            <div className="space-y-2">
              {customPresets.map((preset) => {
                const isSelected = activePreset === preset.id;
                return (
                  <div
                    key={preset.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all text-xs ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-1 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Bookmark className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span className="font-bold truncate">{preset.name}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        ({preset.focus}m / {preset.shortBreak}m / {preset.longBreak}m)
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSelectCustomPreset(preset)}
                        className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-colors"
                      >
                        Load
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCustomPreset(preset.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                        title="Delete custom preset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Custom Durations Section */}
        <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Session Durations
            </span>
            <span className="text-[11px] text-slate-400">Min to Max limits enforced</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Focus Duration (1-180 min) */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Focus Duration</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{focusDuration} min</span>
              </div>
              <input
                type="number"
                min="1"
                max="180"
                value={focusDuration}
                onChange={(e) => {
                  setFocusDuration(Math.min(180, Math.max(1, Number(e.target.value) || 1)));
                  setActivePreset('custom');
                }}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">1 – 180 minutes</span>
            </div>

            {/* Short Break Duration (1-60 min) */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Short Break</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{shortBreakDuration} min</span>
              </div>
              <input
                type="number"
                min="1"
                max="60"
                value={shortBreakDuration}
                onChange={(e) => {
                  setShortBreakDuration(Math.min(60, Math.max(1, Number(e.target.value) || 1)));
                  setActivePreset('custom');
                }}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">1 – 60 minutes</span>
            </div>

            {/* Long Break Duration (1-120 min) */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Long Break</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{longBreakDuration} min</span>
              </div>
              <input
                type="number"
                min="1"
                max="120"
                value={longBreakDuration}
                onChange={(e) => {
                  setLongBreakDuration(Math.min(120, Math.max(1, Number(e.target.value) || 1)));
                  setActivePreset('custom');
                }}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">1 – 120 minutes</span>
            </div>

            {/* Sessions before Long Break (1-12) */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Sessions for Long Break</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{sessionsBeforeLongBreak} cycles</span>
              </div>
              <input
                type="number"
                min="1"
                max="12"
                value={sessionsBeforeLongBreak}
                onChange={(e) => {
                  setSessionsBeforeLongBreak(Math.min(12, Math.max(1, Number(e.target.value) || 1)));
                  setActivePreset('custom');
                }}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">1 – 12 focus cycles</span>
            </div>
          </div>

          {/* Save as Custom Preset Button */}
          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700">
            {!showSavePreset ? (
              <button
                type="button"
                onClick={() => setShowSavePreset(true)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Save current configuration as a custom preset
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Custom preset name (e.g. 90m Thesis Flow)"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleSaveCustomPreset}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors"
                >
                  Save Preset
                </button>
                <button
                  type="button"
                  onClick={() => setShowSavePreset(false)}
                  className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 rounded-xl text-xs shrink-0"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Automation & Sound Behavior */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Transitions & Notification
          </label>

          <div className="space-y-2.5">
            {/* Auto Start Breaks */}
            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors">
              <input
                type="checkbox"
                checked={autoStartBreaks}
                onChange={(e) => setAutoStartBreaks(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Auto-start breaks
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  Automatically start break timer when a focus session finishes
                </span>
              </div>
            </label>

            {/* Auto Start Focus */}
            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors">
              <input
                type="checkbox"
                checked={autoStartFocus}
                onChange={(e) => setAutoStartFocus(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Auto-start focus sessions
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  Automatically start focus timer when a break finishes
                </span>
              </div>
            </label>

            {/* Sound Chime */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    Play completion chime sound
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    Gentle two-tone bell notification when timer reaches 00:00
                  </span>
                </div>
              </label>

              <button
                type="button"
                onClick={() => {
                  playTimerChime();
                  showToast('Playing chime preview 🔔', 'info');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
                title="Preview sound chime"
              >
                <Volume2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Test Chime
              </button>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 gap-3">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              Apply & Save
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
