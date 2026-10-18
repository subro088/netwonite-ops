import React from 'react';
import { Team, Task } from '../../types/index.ts';
import { X, Shield, Users, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge.tsx';
import { PriorityBadge } from '../common/PriorityBadge.tsx';
import { UserAvatar } from '../common/UserAvatar.tsx';

interface TeamDetailsModalProps {
  team: Team | null;
  tasks: Task[];
  isOpen: boolean;
  onClose: () => void;
  onSelectTask?: (taskId: string) => void;
}

export const TeamDetailsModal: React.FC<TeamDetailsModalProps> = ({
  team,
  tasks,
  isOpen,
  onClose,
  onSelectTask,
}) => {
  if (!isOpen || !team) return null;

  const stats = team.taskStats || {
    total: tasks.length,
    new: tasks.filter(t => t.status === 'New').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    awaitingApproval: tasks.filter(t => t.status === 'Awaiting Approval').length,
    resolved: tasks.filter(t => t.status === 'Resolved').length,
    closed: tasks.filter(t => t.status === 'Closed').length,
    ongoing: tasks.filter(t => ['New', 'Assigned', 'In Progress', 'Awaiting Approval'].includes(t.status)).length,
    incomplete: tasks.filter(t => !['Resolved', 'Closed'].includes(t.status)).length,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="relative w-full max-w-3xl rounded-3xl bg-white/95 backdrop-blur-2xl border border-white/70 shadow-2xl p-6 sm:p-8 z-10 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                Team Workspace
              </span>
              <h2 className="text-xl font-bold text-slate-800">{team.name}</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">{team.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Task Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
          <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80">
            <div className="flex items-center justify-between text-emerald-700 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Completed</span>
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold text-emerald-900">{stats.resolved + stats.closed}</div>
            <p className="text-[10px] text-emerald-600/90 mt-0.5">
              {stats.resolved} resolved, {stats.closed} closed
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80">
            <div className="flex items-center justify-between text-amber-700 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Ongoing</span>
              <Clock className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold text-amber-900">{stats.ongoing}</div>
            <p className="text-[10px] text-amber-600/90 mt-0.5">Active progress</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200/80">
            <div className="flex items-center justify-between text-indigo-700 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Incomplete</span>
              <AlertCircle className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold text-indigo-900">{stats.incomplete}</div>
            <p className="text-[10px] text-indigo-600/90 mt-0.5">Pending completion</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200">
            <div className="flex items-center justify-between text-slate-700 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Tasks</span>
              <Users className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Assigned to team</p>
          </div>
        </div>

        {/* Team Leadership & Members */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
          {/* Team Leader */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Team Leader</h3>
            </div>
            <div className="flex items-center gap-3">
              <UserAvatar
                src={team.lead?.avatar}
                name={team.lead?.name}
                role="lead"
                size="md"
                showVectorBadge={true}
              />
              <div>
                <p className="text-sm font-bold text-slate-800">{team.lead?.name}</p>
                <p className="text-xs text-slate-500">{team.lead?.email}</p>
                <p className="text-[11px] text-emerald-700 font-medium">{team.lead?.title || team.lead?.department}</p>
              </div>
            </div>
          </div>
          {/* Team Members */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-teal-600" />
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Members ({team.members.length})
                </h3>
              </div>
            </div>
            <div className="max-h-32 overflow-y-auto space-y-2 pr-1">
              {team.members.map(member => (
                <div key={member.id} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-white border border-slate-100">
                  <div className="flex items-center gap-2">
                    <UserAvatar src={member.avatar} name={member.name} size="xs" />
                    <span className="font-medium text-slate-700">{member.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{member.title || member.department}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Tasks Preview */}
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Team Work Items ({tasks.length})
          </h3>
          {tasks.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No tasks assigned to this team yet.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {tasks.map(t => (
                <div
                  key={t.id}
                  onClick={() => onSelectTask?.(t.id)}
                  className="p-3 rounded-xl bg-white border border-slate-200/80 hover:border-emerald-400 transition-colors flex items-center justify-between cursor-pointer group"
                >
                  <div className="truncate pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <PriorityBadge priority={t.priority} size="sm" />
                      <StatusBadge status={t.status} size="sm" />
                    </div>
                    <p className="text-xs font-semibold text-slate-800 group-hover:text-emerald-700 truncate">
                      {t.title}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-slate-400">
                      {t.assignee ? t.assignee.name : 'Unassigned'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
