import React from 'react';
import { Terminal, GraduationCap, Palette, Flame, Sparkles } from 'lucide-react';

export const presetAvatars = [
  { id: 'tech', label: 'Developer', icon: Terminal, bg: 'from-blue-600 to-cyan-500' },
  { id: 'student', label: 'Student', icon: GraduationCap, bg: 'from-indigo-600 to-blue-500' },
  { id: 'creative', label: 'Creative', icon: Palette, bg: 'from-purple-600 to-pink-500' },
  { id: 'athlete', label: 'Focused', icon: Flame, bg: 'from-amber-500 to-rose-500' },
  { id: 'minimal', label: 'Achiever', icon: Sparkles, bg: 'from-slate-700 to-slate-900' },
];

export const UserAvatar = ({ profile, size = 'md', className = '', showRoleBadge = false }) => {
  const sizeMap = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
    '2xl': 'w-24 h-24 text-2xl',
  };

  const iconSizeMap = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-10 h-10',
    '2xl': 'w-12 h-12',
  };

  const initials = profile?.name
    ? profile.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'PX';

  const selectedPreset = presetAvatars.find((p) => p.id === profile?.avatarPreset) || presetAvatars[0];
  const IconComponent = selectedPreset.icon;

  const currentSizeClass = sizeMap[size] || sizeMap.md;
  const currentIconSize = iconSizeMap[size] || iconSizeMap.md;

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      {profile?.avatar ? (
        <img
          src={profile.avatar}
          alt={profile.name || 'User Avatar'}
          className={`${currentSizeClass} rounded-2xl object-cover border-2 border-white shadow-subtle`}
        />
      ) : profile?.avatarPreset ? (
        <div
          className={`${currentSizeClass} rounded-2xl bg-gradient-to-tr ${selectedPreset.bg} text-white flex items-center justify-center font-bold border-2 border-white/80 shadow-subtle`}
        >
          <IconComponent className={currentIconSize} />
        </div>
      ) : (
        <div
          className={`${currentSizeClass} rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-500 text-white flex items-center justify-center font-bold border-2 border-white/80 shadow-subtle`}
        >
          {initials}
        </div>
      )}

      {showRoleBadge && (
        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
      )}
    </div>
  );
};
