import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { Task } from '../types/index.ts';
import { TaskCard } from '../components/tasks/TaskCard.tsx';
import { UserCheck, Shield, CheckCircle2 } from 'lucide-react';
import { UserAvatar } from '../components/common/UserAvatar.tsx';

interface MyTeamMemberPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const MyTeamMemberPage: React.FC<MyTeamMemberPageProps> = ({ onNavigate }) => {
  const { user, teamsMemberOf } = useAuth();
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [teamTasks, setTeamTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (teamsMemberOf.length > 0 && !selectedTeamId) {
      setSelectedTeamId(teamsMemberOf[0].id);
    }
  }, [teamsMemberOf, selectedTeamId]);

  const loadData = async () => {
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
    loadData();
  }, [selectedTeamId]);

  const activeTeam = teamsMemberOf.find(t => t.id === selectedTeamId);

  const handleClaim = async (taskId: string) => {
    try {
      await api.claimTask(taskId);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to claim task');
    }
  };

  if (teamsMemberOf.length === 0) {
    return (
      <div className="p-16 text-center rounded-3xl bg-white/70 border border-white/60">
        <UserCheck className="h-10 w-10 text-slate-300 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-800">No Team Memberships Assigned</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          An administrator has not assigned your profile to an active team yet. Once added to a team roster, team tasks and teammates will appear here.
        </p>
      </div>
    );
  }

  const claimableTasks = teamTasks.filter(t => t.status === 'New' && !t.assigneeId && t.creatorId !== user?.id);
  const myAssignedTasks = teamTasks.filter(t => t.assigneeId === user?.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-100 text-cyan-800 border border-cyan-200">
              Squad Member Workspace
            </span>
            <span className="text-xs text-slate-400">Team Operations</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {activeTeam ? activeTeam.name : 'My Team - Member View'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Collaborate with teammates, claim available tasks, and track ongoing sprint work.
          </p>
        </div>

        {activeTeam && (
          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
            <UserAvatar
              src={activeTeam.lead?.avatar}
              name={activeTeam.lead?.name}
              role="lead"
              size="md"
              showVectorBadge={true}
            />
            <div>
              <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400">
                <Shield className="h-3 w-3 text-emerald-600" />
                <span>Team Lead</span>
              </div>
              <p className="text-xs font-bold text-slate-800">{activeTeam.lead?.name}</p>
            </div>
          </div>
        )}
      </div>

      {/* Multi-Team switcher */}
      {teamsMemberOf.length > 1 && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Squads:</span>
          {teamsMemberOf.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTeamId(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTeamId === t.id
                  ? 'bg-cyan-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}

      {/* Section: Open Tasks Ready to Claim */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Open Work Ready to Claim ({claimableTasks.length})
            </h2>
          </div>
          <span className="text-xs text-slate-400">Available to all members of {activeTeam?.name}</span>
        </div>

        {claimableTasks.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white/60 border border-slate-200/60 text-xs text-slate-500">
            No open claimable tasks currently available for this squad.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {claimableTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onViewDetails={id => onNavigate('task-details', { taskId: id })}
                onClaim={handleClaim}
              />
            ))}
          </div>
        )}
      </div>

      {/* Section: Assigned to You in this Team */}
      <div className="space-y-3 pt-4 border-t border-slate-200/60">
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-cyan-600" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Assigned to You in {activeTeam?.name} ({myAssignedTasks.length})
          </h2>
        </div>

        {myAssignedTasks.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white/60 border border-slate-200/60 text-xs text-slate-500">
            You currently have no tasks assigned in this team.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myAssignedTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onViewDetails={id => onNavigate('task-details', { taskId: id })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
