import React from 'react';
import { Task } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { StatusBadge } from '../common/StatusBadge.tsx';
import { PriorityBadge } from '../common/PriorityBadge.tsx';
import { Calendar, User, ArrowRight, ShieldCheck, Trash2, ArrowUpRight } from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar.tsx';

interface TaskCardProps {
  task: Task;
  onViewDetails: (taskId: string) => void;
  onClaim?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onViewDetails,
  onClaim,
  onDelete,
}) => {
  const { user, isAdmin } = useAuth();
  const isResolved = task.status === 'Resolved';
  const isCreator = task.creatorId === user?.id;
  const isAssignee = task.assigneeId === user?.id;

  const isEligibleMember =
    task.destinationTeam?.memberIds?.includes(user?.id || '') ||
    task.sourceTeam?.memberIds?.includes(user?.id || '') ||
    isAdmin;
  const canClaim = !isCreator && !task.assigneeId && task.status === 'New' && isEligibleMember;
  const canDelete = isCreator || isAdmin;

  const cardStyling = isResolved
    ? 'border-rose-300/80 bg-rose-50/70 shadow-xs hover:border-rose-400 hover:shadow-lg'
    : 'border-white/70 bg-white/85 shadow-xs hover:border-emerald-300 hover:shadow-lg';

  return (
    <div
      onClick={() => onViewDetails(task.id)}
      className={`liquid-glass-card liquid-sheen-sweep p-5 backdrop-blur-xl transition-all duration-300 cursor-pointer flex flex-col justify-between group hover:-translate-y-1.5 ${cardStyling}`}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <PriorityBadge priority={task.priority} size="sm" />
            <StatusBadge status={task.status} size="sm" />
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
            {task.destinationTeam ? (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                <span>{task.sourceTeam?.name}</span>
                <ArrowRight className="h-3 w-3 text-slate-400" />
                <span>{task.destinationTeam.name}</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                {task.sourceTeam?.name || 'Team'}
              </span>
            )}
          </div>
        </div>

        <h3
          className={`text-sm font-bold tracking-tight mb-1.5 line-clamp-2 transition-colors ${
            isResolved ? 'text-rose-900 group-hover:text-rose-700' : 'text-slate-900 group-hover:text-emerald-800'
          }`}
        >
          {task.title}
        </h3>

        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
          {task.description}
        </p>
      </div>

      <div className="relative z-10 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 truncate">
          {task.assignee ? (
            <div className="flex items-center gap-1.5 truncate">
              <UserAvatar
                src={task.assignee.avatar}
                name={task.assignee.name}
                size="xs"
              />
              <span className="text-xs font-medium text-slate-700 truncate">
                {isAssignee ? 'Assigned to You' : task.assignee.name}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs text-slate-400 italic">
              <User className="h-3.5 w-3.5" />
              <span>Unassigned</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
          {task.dueDate && (
            <span className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 mr-1 tabular-nums">
              <Calendar className="h-3 w-3" />
              <span>{task.dueDate}</span>
            </span>
          )}
          {canClaim && onClaim && (
            <button
              onClick={() => onClaim(task.id)}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer hover:scale-105 active:scale-95"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Claim</span>
            </button>
          )}
          {canDelete && onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              title="Delete task (creator only)"
              className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={() => onViewDetails(task.id)}
            className="p-1 text-slate-400 group-hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title="View Details"
          >
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
