import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Timer,
  Settings,
  SkipForward,
  Coffee,
  Sparkles,
  Zap,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TimerSettingsModal } from './TimerSettingsModal';
import { playTimerChime } from '../../utils/soundUtils';
import { standardPresets } from '../../data/initialData';

export const FocusTimerWidget = () => {
  const { showToast, timerSettings, updateTimerSettings } = useApp();

  const focusDuration = timerSettings?.focusDuration || 25;
  const shortBreakDuration = timerSettings?.shortBreakDuration || 5;
  const longBreakDuration = timerSettings?.longBreakDuration || 15;
  const sessionsBeforeLongBreak = timerSettings?.sessionsBeforeLongBreak || 4;
  const autoStartBreaks = timerSettings?.autoStartBreaks || false;
  const autoStartFocus = timerSettings?.autoStartFocus || false;
  const soundEnabled = timerSettings?.soundEnabled ?? true;

  // Active mode: 'focus' | 'shortBreak' | 'longBreak'
  const [mode, setMode] = useState('focus');
  const [sessionCount, setSessionCount] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Time remaining in seconds
  const [timeLeft, setTimeLeft] = useState(focusDuration * 60);

  // Precise end timestamp for drift-free background countdown
  const targetEndTimeRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Get total duration for current mode in seconds
  const getTotalSecondsForMode = useCallback(
    (m = mode, settingsObj = timerSettings) => {
      const f = settingsObj?.focusDuration || 25;
      const s = settingsObj?.shortBreakDuration || 5;
      const l = settingsObj?.longBreakDuration || 15;
      if (m === 'focus') return f * 60;
      if (m === 'shortBreak') return s * 60;
      if (m === 'longBreak') return l * 60;
      return f * 60;
    },
    [mode, timerSettings]
  );

  // Handle session completion and transitions
  const handleSessionComplete = useCallback(() => {
    if (soundEnabled) {
      playTimerChime();
    }

    if (mode === 'focus') {
      const isLongBreakNext = sessionCount % sessionsBeforeLongBreak === 0;
      const nextMode = isLongBreakNext ? 'longBreak' : 'shortBreak';
      const nextDuration = isLongBreakNext ? longBreakDuration : shortBreakDuration;

      showToast(
        isLongBreakNext
          ? `4 focus sessions complete! 🎉 Enjoy a ${longBreakDuration}m long break.`
          : `Focus complete! ☕ Take a ${shortBreakDuration}m short break.`,
        'success'
      );

      setMode(nextMode);
      setTimeLeft(nextDuration * 60);

      if (autoStartBreaks) {
        targetEndTimeRef.current = Date.now() + nextDuration * 60 * 1000;
        setIsActive(true);
      } else {
        setIsActive(false);
        targetEndTimeRef.current = null;
      }
    } else {
      // Break finished -> Next focus session
      const nextSession = sessionCount + 1;
      setSessionCount(nextSession);
      setMode('focus');
      setTimeLeft(focusDuration * 60);

      showToast(`Break finished! Ready for Focus session #${nextSession}? 🚀`, 'info');

      if (autoStartFocus) {
        targetEndTimeRef.current = Date.now() + focusDuration * 60 * 1000;
        setIsActive(true);
      } else {
        setIsActive(false);
        targetEndTimeRef.current = null;
      }
    }
  }, [
    mode,
    sessionCount,
    sessionsBeforeLongBreak,
    shortBreakDuration,
    longBreakDuration,
    focusDuration,
    autoStartBreaks,
    autoStartFocus,
    soundEnabled,
    showToast,
  ]);

  // Main countdown loop with drift prevention & background tab accuracy
  useEffect(() => {
    let interval = null;

    if (isActive) {
      if (!targetEndTimeRef.current) {
        targetEndTimeRef.current = Date.now() + timeLeft * 1000;
      }

      interval = setInterval(() => {
        const remaining = Math.max(
          0,
          Math.ceil((targetEndTimeRef.current - Date.now()) / 1000)
        );
        setTimeLeft(remaining);

        if (remaining <= 0) {
          clearInterval(interval);
          targetEndTimeRef.current = null;
          handleSessionComplete();
        }
      }, 250);
    } else {
      targetEndTimeRef.current = null;
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, handleSessionComplete]);

  // Listen to visibilitychange to immediately correct time when user returns to tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isActive && targetEndTimeRef.current) {
        const remaining = Math.max(
          0,
          Math.ceil((targetEndTimeRef.current - Date.now()) / 1000)
        );
        setTimeLeft(remaining);
        if (remaining <= 0) {
          handleSessionComplete();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isActive, handleSessionComplete]);

  // Toggle Start / Pause
  const toggleTimer = () => {
    if (isActive) {
      // Pause
      setIsActive(false);
      targetEndTimeRef.current = null;
    } else {
      // Start / Resume
      if (timeLeft <= 0) {
        const dur = getTotalSecondsForMode(mode);
        setTimeLeft(dur);
        targetEndTimeRef.current = Date.now() + dur * 1000;
      } else {
        targetEndTimeRef.current = Date.now() + timeLeft * 1000;
      }
      setIsActive(true);
    }
  };

  // Reset timer to current mode's initial duration
  const resetTimer = (targetMode = mode) => {
    setIsActive(false);
    targetEndTimeRef.current = null;
    setMode(targetMode);
    const dur = getTotalSecondsForMode(targetMode);
    setTimeLeft(dur);
  };

  // Switch mode directly
  const switchMode = (newMode) => {
    if (mode === newMode) return;
    setIsActive(false);
    targetEndTimeRef.current = null;
    setMode(newMode);
    const dur = getTotalSecondsForMode(newMode);
    setTimeLeft(dur);
  };

  // Skip to next session
  const skipSession = () => {
    handleSessionComplete();
  };

  // Quick preset apply
  const applyPreset = (preset) => {
    updateTimerSettings({
      focusDuration: preset.focus,
      shortBreakDuration: preset.shortBreak,
      longBreakDuration: preset.longBreak,
      sessionsBeforeLongBreak: preset.sessions,
      activePreset: preset.id,
    });

    setIsActive(false);
    targetEndTimeRef.current = null;
    const dur =
      mode === 'focus'
        ? preset.focus * 60
        : mode === 'shortBreak'
        ? preset.shortBreak * 60
        : preset.longBreak * 60;
    setTimeLeft(dur);
  };

  // Format time (HH:MM:SS if >= 3600 seconds, else MM:SS)
  const formatDisplayTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n) => String(n).padStart(2, '0');
    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  // Calculate percentage of progress
  const totalModeSeconds = getTotalSecondsForMode(mode);
  const elapsedSeconds = Math.max(0, totalModeSeconds - timeLeft);
  const progressPercent =
    totalModeSeconds > 0
      ? Math.min(100, Math.max(0, Math.round((elapsedSeconds / totalModeSeconds) * 100)))
      : 0;

  return (
    <>
      <div className="bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 text-white rounded-3xl p-6 shadow-card flex flex-col justify-between relative overflow-hidden transition-all">
        {/* Decorative background aura */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-blue-200" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
                Focus Flow
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/15 text-white font-extrabold ml-1">
                {mode === 'focus' ? `Cycle #${sessionCount}` : 'Break'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Sound status indicator */}
              <button
                type="button"
                onClick={() => updateTimerSettings({ soundEnabled: !soundEnabled })}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-blue-100 transition-colors"
                title={soundEnabled ? 'Chime sound enabled' : 'Chime sound muted'}
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4 opacity-75" />
                )}
              </button>

              {/* Timer Settings Button */}
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Timer Settings & Custom Presets"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-black/15 p-1 rounded-2xl text-xs font-bold mb-4">
            <button
              onClick={() => switchMode('focus')}
              className={`py-2 px-1 rounded-xl transition-all ${
                mode === 'focus'
                  ? 'bg-white text-blue-800 shadow-sm'
                  : 'text-blue-100 hover:text-white hover:bg-white/5'
              }`}
            >
              Focus ({focusDuration}m)
            </button>
            <button
              onClick={() => switchMode('shortBreak')}
              className={`py-2 px-1 rounded-xl transition-all ${
                mode === 'shortBreak'
                  ? 'bg-white text-blue-800 shadow-sm'
                  : 'text-blue-100 hover:text-white hover:bg-white/5'
              }`}
            >
              Short ({shortBreakDuration}m)
            </button>
            <button
              onClick={() => switchMode('longBreak')}
              className={`py-2 px-1 rounded-xl transition-all ${
                mode === 'longBreak'
                  ? 'bg-white text-blue-800 shadow-sm'
                  : 'text-blue-100 hover:text-white hover:bg-white/5'
              }`}
            >
              Long ({longBreakDuration}m)
            </button>
          </div>

          {/* Time Display & Progress Indicator */}
          <div className="text-center py-2 relative">
            <div className="text-5xl sm:text-6xl font-black tracking-tight font-mono select-none">
              {formatDisplayTime(timeLeft)}
            </div>
            <p className="text-xs text-blue-100/90 mt-1.5 font-medium flex items-center justify-center gap-1.5">
              {isActive ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    {mode === 'focus'
                      ? 'Deep focus in progress...'
                      : 'Resting & recharging...'}
                  </span>
                </>
              ) : (
                <span>Paused • Ready when you are</span>
              )}
            </p>

            {/* Progress bar */}
            <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden mt-4 p-0.5">
              <div
                className="bg-white/90 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="pt-3 flex items-center justify-center gap-1.5 text-[11px] font-bold text-blue-100 flex-wrap">
          <span className="text-[10px] uppercase tracking-wider opacity-75 mr-1 hidden sm:inline">
            Presets:
          </span>
          {standardPresets.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p)}
              className={`px-2 py-0.5 rounded-lg border transition-all ${
                timerSettings?.activePreset === p.id
                  ? 'bg-white text-blue-800 border-white'
                  : 'border-white/20 hover:bg-white/10 text-white'
              }`}
            >
              {p.id}
            </button>
          ))}
        </div>

        {/* Primary Controls */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            onClick={toggleTimer}
            className="flex items-center justify-center gap-2 px-7 py-3 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-md transition-all active:scale-95"
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4 fill-blue-700" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-blue-700" /> Start
              </>
            )}
          </button>

          <button
            onClick={() => resetTimer(mode)}
            title="Reset session to full duration"
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={skipSession}
            title="Skip to next session"
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Timer Settings Modal */}
      <TimerSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onApplyDurations={(newSettings) => {
          setIsActive(false);
          targetEndTimeRef.current = null;
          const dur =
            mode === 'focus'
              ? newSettings.focusDuration * 60
              : mode === 'shortBreak'
              ? newSettings.shortBreakDuration * 60
              : newSettings.longBreakDuration * 60;
          setTimeLeft(dur);
        }}
      />
    </>
  );
};
