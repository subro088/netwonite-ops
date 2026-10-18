import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { Task } from '../types/index.ts';
import { TaskCard } from '../components/tasks/TaskCard.tsx';
import { CreateTaskModal } from '../components/tasks/CreateTaskModal.tsx';
import { Shield, PlusCircle, AlertCircle } from 'lucide-react';
import { UserAvatar } from '../components/common/UserAvatar.tsx';

interface MyTeamLeaderPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const MyTeamLeaderPage: React.FC<MyTeamLeaderPageProps> = ({ onNavigate }) => {
  const { teamsLeading } = useAuth();
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [teamTasks, setTeamTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    if (teamsLeading.length > 0 && !selectedTeamId) {
      setSelectedTeamId(teamsLeading[0].id);
    }
  }, [teamsLeading, selectedTeamId]);

  const loadTeamData = async () => {
    if (!selectedTeamId) return;
    setIsLoading(true);
    try {
      const data = await api.getTeam(selectedTeamId);
      setTeamTasks(data.tasks);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeamData();
  }, [selectedTeamId]);

  const activeTeam = teamsLeading.find(t => t.id === selectedTeamId);
  const awaitingReviewTasks = teamTasks.filter(t => t.status === 'Awaiting Approval');
  const ongoingTasks = teamTasks.filter(t => ['Assigned', 'In Progress'].includes(t.status));
  const completedTasks = teamTasks.filter(t => ['Resolved', 'Closed'].includes(t.status));

  if (teamsLeading.length === 0) {
    return (
      <div className="p-16 text-center rounded-3xl bg-white/70 border border-white/60">
        <Shield className="h-10 w-10 text-slate-300 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-800">You Are Not Appointed As A Team Leader</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          When an administrator establishes a team and appoints you as its leader, leadership tools and delegation controls will be activated here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
              Leader Directives
            </span>
            <span className="text-xs text-slate-400">Team Leadership View</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {activeTeam ? activeTeam.name : 'My Team - Leader View'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage team assignments, dispatch cross-team work, and conduct review on submissions.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-700/20 transition-all cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Team Task</span>
        </button>
      </div>

      {/* Team Switcher */}
      {teamsLeading.length > 1 && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Switch Squad:</span>
          {teamsLeading.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTeamId(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTeamId === t.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}

      {/* Roster & Metrics */}
      {activeTeam && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-white/70">
            <span className="text-[10px] uppercase font-bold text-slate-400">Active Roster</span>
            <div className="text-2xl font-bold text-slate-800 mt-1">{activeTeam.members?.length || 0} Members</div>
            <div className="flex -space-x-1.5 overflow-hidden mt-2">
              {activeTeam.members?.slice(0, 5).map(m => (
                <UserAvatar
                  key={m.id}
                  src={m.avatar}
                  name={m.name}
                  size="xs"
                  className="ring-2 ring-white"
                />
              ))}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200/80">
            <span className="text-[10px] uppercase font-bold text-purple-700">Waiting For Review</span>
            <div className="text-2xl font-bold text-purple-900 mt-1">{awaitingReviewTasks.length}</div>
            <p className="text-[11px] text-purple-700 mt-1">Requires your evaluation</p>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80">
            <span className="text-[10px] uppercase font-bold text-amber-700">Ongoing Work</span>
            <div className="text-2xl font-bold text-amber-900 mt-1">{ongoingTasks.length}</div>
            <p className="text-[11px] text-amber-700 mt-1">In progress across squad</p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80">
            <span className="text-[10px] uppercase font-bold text-emerald-700">Resolved / Closed</span>
            <div className="text-2xl font-bold text-emerald-900 mt-1">{completedTasks.length}</div>
            <p className="text-[11px] text-emerald-700 mt-1">Successfully verified</p>
          </div>
        </div>
      )}

      {/* Submissions Waiting for Review */}
      {awaitingReviewTasks.length > 0 && (
        <div className="space-y-3 p-5 rounded-3xl bg-purple-50/50 border border-purple-200 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-purple-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-900">
              Submissions Waiting For Your Review ({awaitingReviewTasks.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {awaitingReviewTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onViewDetails={id => onNavigate('task-details', { taskId: id })}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Team Tasks */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
          All Tasks in {activeTeam?.name} ({teamTasks.length})
        </h2>
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading squad tasks...</div>
        ) : teamTasks.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white/60 border border-white/60">
            <p className="text-sm font-bold text-slate-700">No tasks created for this team yet</p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
            >
              Create first task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onViewDetails={id => onNavigate('task-details', { taskId: id })}
              />
            ))}
          </div>
        )}
      </div>

      <CreateTaskModal
        isOpen={isCreateOpen}
        initialSourceTeamId={selectedTeamId}
        onClose={() => setIsCreateOpen(false)}
        onCreated={loadTeamData}
      />
    </div>
  );
};
