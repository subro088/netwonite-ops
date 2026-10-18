import React from 'react';
import { TaskPriority } from '../../types/index.ts';

interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs';
  let config = {
    classes: 'bg-black/60 text-zinc-300 border-white/10',
  };

  switch (priority) {
    case 'Low':
      config = { classes: 'bg-slate-200 text-slate-700 border-slate-300 font-medium' };
      break;
    case 'Medium':
      config = { classes: 'bg-blue-500/20 text-blue-800 border-blue-400/40 font-medium' };
      break;
    case 'High':
      config = { classes: 'bg-amber-500/20 text-amber-800 border-amber-400/40 font-semibold' };
      break;
    case 'Urgent':
      config = { classes: 'bg-rose-500/25 text-rose-800 border-rose-400/50 font-bold' };
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border tracking-wide uppercase backdrop-blur-md ${config.classes} ${sizeClasses}`}
    >
      {priority === 'Urgent' && <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />}
      <span>{priority}</span>
    </span>
  );
};
