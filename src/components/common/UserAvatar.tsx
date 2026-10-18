import React, { useState } from 'react';
import { resolveVectorAvatar, getDeterministicHumanPhoto } from '../../utils/vectorAvatars.ts';
import { Shield, Sparkles, Terminal, CheckCircle2 } from 'lucide-react';

export interface UserAvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
  className?: string;
  showVectorBadge?: boolean;
  role?: 'admin' | 'leader' | 'employee' | string;
  status?: 'online' | 'busy' | 'away';
  hoverEffect?: boolean;
  onClick?: () => void;
  alt?: string;
}

const SIZE_MAP = {
  xs: 'h-6 w-6 rounded-lg text-[10px]',
  sm: 'h-8 w-8 rounded-xl text-xs',
  md: 'h-10 w-10 rounded-2xl text-sm',
  lg: 'h-14 w-14 rounded-2xl text-base',
  xl: 'h-20 w-20 rounded-3xl text-xl',
  '2xl': 'h-28 w-28 rounded-3xl text-2xl',
  custom: '',
};

const BADGE_SIZE_MAP = {
  xs: 'h-2.5 w-2.5 p-0.5 -bottom-0.5 -right-0.5',
  sm: 'h-3.5 w-3.5 p-0.5 -bottom-1 -right-1',
  md: 'h-4 w-4 p-0.5 -bottom-1 -right-1',
  lg: 'h-5 w-5 p-1 -bottom-1.5 -right-1.5',
  xl: 'h-6 w-6 p-1 -bottom-2 -right-2',
  '2xl': 'h-8 w-8 p-1.5 -bottom-2 -right-2',
  custom: 'h-4 w-4 p-0.5 -bottom-1 -right-1',
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name = 'User',
  size = 'md',
  className = '',
  showVectorBadge = false,
  role,
  status,
  hoverEffect = false,
  onClick,
  alt,
}) => {
  const [hasError, setHasError] = useState(false);

  // Resolve real human photo or vector
  const resolvedSrc = hasError
    ? getDeterministicHumanPhoto(name || 'fallback')
    : resolveVectorAvatar(src, name);

  const sizeClasses = SIZE_MAP[size] || SIZE_MAP.md;
  const badgeClasses = BADGE_SIZE_MAP[size] || BADGE_SIZE_MAP.md;

  const getRoleBadge = () => {
    const normalizedRole = role?.toLowerCase();
    if (normalizedRole === 'admin') {
      return (
        <span
          className={`absolute ${badgeClasses} rounded-full bg-amber-500 text-slate-950 ring-2 ring-white shadow-md flex items-center justify-center font-bold`}
          title="Admin Vector Badge"
        >
          <Shield className="w-full h-full" />
        </span>
      );
    }
    if (normalizedRole === 'lead' || normalizedRole === 'leader') {
      return (
        <span
          className={`absolute ${badgeClasses} rounded-full bg-teal-500 text-white ring-2 ring-white shadow-md flex items-center justify-center font-bold`}
          title="Team Leader Vector Badge"
        >
          <Sparkles className="w-full h-full" />
        </span>
      );
    }
    if (normalizedRole === 'employee' || normalizedRole === 'member') {
      return (
        <span
          className={`absolute ${badgeClasses} rounded-full bg-emerald-500 text-white ring-2 ring-white shadow-md flex items-center justify-center font-bold`}
          title="Engineering Vector Badge"
        >
          <Terminal className="w-full h-full" />
        </span>
      );
    }
    if (normalizedRole === 'viewer' || normalizedRole === 'analyst') {
      return (
        <span
          className={`absolute ${badgeClasses} rounded-full bg-cyan-500 text-white ring-2 ring-white shadow-md flex items-center justify-center font-bold`}
          title="Viewer Analyst Badge"
        >
          <Sparkles className="w-full h-full" />
        </span>
      );
    }
    return (
      <span
        className={`absolute ${badgeClasses} rounded-full bg-slate-700 text-white ring-2 ring-white shadow-md flex items-center justify-center`}
      >
        <CheckCircle2 className="w-full h-full" />
      </span>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-block shrink-0 select-none ${
        hoverEffect
          ? 'cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 group'
          : ''
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div
        className={`relative overflow-hidden ring-1 ring-slate-200/80 shadow-xs bg-gradient-to-tr from-slate-100 to-slate-200 ${sizeClasses} ${className}`}
      >
        <img
          src={resolvedSrc}
          alt={alt || name}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/30 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />
      </div>
      {showVectorBadge && role && getRoleBadge()}
      {status && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white shadow-xs ${
            status === 'online'
              ? 'bg-emerald-500'
              : status === 'busy'
              ? 'bg-rose-500'
              : 'bg-amber-400'
          }`}
          title={`Status: ${status}`}
        />
      )}
    </div>
  );
};
