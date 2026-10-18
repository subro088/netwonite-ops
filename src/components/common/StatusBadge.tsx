import React from 'react';
import { TaskStatus } from '../../types/index.ts';

interface StatusBadgeProps {
  status: TaskStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  let config = {
    label: status as string,
    classes: 'bg-black/60 text-zinc-300 border-white/10',
    dot: 'bg-zinc-400',
  };

  switch (status) {
    case 'New':
      config = {
        label: 'New',
        classes: 'bg-sky-500/20 text-sky-800 border-sky-400/40 font-semibold shadow-inner',
        dot: 'bg-sky-500',
      };
      break;
    case 'Assigned':
      config = {
        label: 'Assigned',
        classes: 'bg-indigo-500/20 text-indigo-800 border-indigo-400/40 font-semibold shadow-inner',
        dot: 'bg-indigo-500',
      };
      break;
    case 'In Progress':
      config = {
        label: 'In Progress',
        classes: 'bg-amber-500/20 text-amber-800 border-amber-400/40 font-semibold shadow-inner',
        dot: 'bg-amber-500',
      };
      break;
    case 'Awaiting Approval':
      config = {
        label: 'Awaiting Approval',
        classes: 'bg-purple-500/20 text-purple-800 border-purple-400/40 font-semibold shadow-inner',
        dot: 'bg-purple-500',
      };
      break;
    case 'Resolved':
      config = {
        label: 'Resolved',
        classes: 'bg-rose-500/25 text-rose-800 border-rose-400/50 font-bold shadow-inner',
        dot: 'bg-rose-500',
      };
      break;
    case 'Closed':
      config = {
        label: 'Closed',
        classes: 'bg-slate-200/80 text-slate-700 border-slate-300 font-medium',
        dot: 'bg-slate-500',
      };
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border tracking-wide uppercase backdrop-blur-md ${config.classes} ${sizeClasses}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};
