import React, { useState, useEffect } from 'react';
import { api } from '../services/api.ts';
import { Team } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { CreateTeamModal } from '../components/teams/CreateTeamModal.tsx';
import { TeamDetailsModal } from '../components/teams/TeamDetailsModal.tsx';
import { Users2, PlusCircle, Eye, Trash2, Shield, AlertTriangle } from 'lucide-react';
import { UserAvatar } from '../components/common/UserAvatar.tsx';

interface ManageTeamsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const ManageTeamsPage: React.FC<ManageTeamsPageProps> = ({ onNavigate }) => {
  const { isAdmin } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamTasks, setTeamTasks] = useState<any[]>([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const data = await api.getTeams();
      setTeams(data.teams);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleOpenDetails = async (team: Team) => {
    try {
      const data = await api.getTeam(team.id);
      setSelectedTeam(data.team);
      setTeamTasks(data.tasks);
      setIsDetailsOpen(true);
    } catch (err: any) {
      alert(err.message || 'Failed to load team details');
    }
  };

  const handleDeleteTeam = async (id: string) => {
    try {
      await api.deleteTeam(id);
      setConfirmDeleteId(null);
      setFeedback('Team deleted successfully. Active tasks were safely resolved/closed.');
      setTimeout(() => setFeedback(null), 3500);
      fetchTeams();
    } catch (err: any) {
      alert(err.message || 'Failed to delete team');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
              Team Architecture
            </span>
            <span className="text-xs text-slate-400">Governance</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage Teams</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, audit, and configure engineering squads, assign leaders, and maintain rosters.
          </p>
        </div>
        {isAdmin ? (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-700/20 transition-all cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create Team</span>
          </button>
        ) : (
          <div className="text-xs text-slate-400 italic">
            Administrator permissions required to create or delete teams
          </div>
        )}
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-emerald-700 font-bold">&times;</button>
        </div>
      )}

      {/* Teams Grid */}
      {isLoading ? (
        <div className="p-16 text-center text-xs text-slate-400">Loading teams...</div>
      ) : teams.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white/60 border border-white/60">
          <Users2 className="h-8 w-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No teams exist</p>
          {isAdmin && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
            >
              Create the first team
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {teams.map(team => (
            <div
              key={team.id}
              className="relative rounded-3xl p-6 bg-white/85 backdrop-blur-xl border border-white/70 hover:border-emerald-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                      {team.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Created {new Date(team.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenDetails(team)}
                      className="p-2 rounded-xl text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                      title="View Team Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => setConfirmDeleteId(team.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Team"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  {team.description}
                </p>

                {/* Team Lead Card */}
                <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center gap-3 mb-4">
                  <UserAvatar
                    src={team.lead?.avatar}
                    name={team.lead?.name}
                    role="lead"
                    size="md"
                    showVectorBadge={true}
                    hoverEffect={true}
                  />
                  <div className="truncate">
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3 text-emerald-600" />
                      <span className="text-[10px] uppercase font-bold text-slate-400">Team Leader</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 truncate">{team.lead?.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{team.lead?.email}</p>
                  </div>
                </div>

                {/* Members list */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                    <span className="font-bold uppercase tracking-wider text-[10px]">
                      Team Members ({team.members?.length || 0})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {team.members?.slice(0, 6).map(m => (
                      <span
                        key={m.id}
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-xl bg-white border border-slate-200 text-[11px] font-medium text-slate-700 shadow-xs hover:border-emerald-300 transition-colors"
                      >
                        <UserAvatar src={m.avatar} name={m.name} size="xs" />
                        <span>{m.name.split(' ')[0]}</span>
                      </span>
                    ))}
                    {(team.members?.length || 0) > 6 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-100 text-[11px] text-slate-500 font-bold self-center">
                        +{team.members.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Task statistics footer */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-4 gap-1 text-center">
                <div className="p-1.5 rounded-xl bg-slate-50">
                  <div className="text-xs font-bold text-slate-800">{team.taskStats?.new || 0}</div>
                  <div className="text-[9px] uppercase font-bold text-slate-400">New</div>
                </div>
                <div className="p-1.5 rounded-xl bg-amber-50 text-amber-800">
                  <div className="text-xs font-bold">{team.taskStats?.ongoing || 0}</div>
                  <div className="text-[9px] uppercase font-bold text-amber-600">Ongoing</div>
                </div>
                <div className="p-1.5 rounded-xl bg-purple-50 text-purple-800">
                  <div className="text-xs font-bold">{team.taskStats?.awaitingApproval || 0}</div>
                  <div className="text-[9px] uppercase font-bold text-purple-600">Review</div>
                </div>
                <div className="p-1.5 rounded-xl bg-emerald-50 text-emerald-800">
                  <div className="text-xs font-bold">{team.taskStats?.resolved || 0}</div>
                  <div className="text-[9px] uppercase font-bold text-emerald-600">Resolved</div>
                </div>
              </div>

              {/* Safe Delete Confirmation Overlay */}
              {confirmDeleteId === team.id && (
                <div className="absolute inset-0 z-30 rounded-3xl bg-white/95 backdrop-blur-xl p-5 flex flex-col justify-between border border-rose-200 animate-in fade-in duration-150">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-rose-800">Confirm Safe Team Deletion</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Are you sure you want to delete <strong>{team.name}</strong>? All associated active tasks will be safely transitioned to Closed.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteTeam(team.id)}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20"
                    >
                      Confirm Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateTeamModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={fetchTeams}
      />
      <TeamDetailsModal
        isOpen={isDetailsOpen}
        team={selectedTeam}
        tasks={teamTasks}
        onClose={() => setIsDetailsOpen(false)}
        onSelectTask={taskId => {
          setIsDetailsOpen(false);
          onNavigate('task-details', { taskId });
        }}
      />
    </div>
  );
};
