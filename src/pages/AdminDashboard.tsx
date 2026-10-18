import React, { useState, useEffect } from 'react';
import { api } from '../services/api.ts';
import { Team, ActivityLog } from '../types/index.ts';
import { CreateTeamModal } from '../components/teams/CreateTeamModal.tsx';
import { TeamDetailsModal } from '../components/teams/TeamDetailsModal.tsx';
import { UserAvatar } from '../components/common/UserAvatar.tsx';
import {
  Users2,
  UserCheck,
  Clock,
  CheckCircle2,
  PlusCircle,
  Eye,
  Trash2,
  RotateCcw,
  Activity,
  ArrowRight,
  GitFork,
  BarChart3,
  Trophy,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: string, params?: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamTasks, setTeamTasks] = useState<any[]>([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [teamsRes, actRes] = await Promise.all([
        api.getTeams(),
        api.getActivities(8),
      ]);
      setTeams(teamsRes.teams);
      setActivities(actRes.activities);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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
      setNotification('Team deleted safely.');
      setTimeout(() => setNotification(null), 3000);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete team');
    }
  };

  const handleResetWorkspace = async () => {
    if (!window.confirm('Reset demo database to pristine state with 20 demo employees and default teams?')) return;
    setIsResetting(true);
    try {
      await api.resetDemo();
      setNotification('Demo workspace reset to clean state.');
      setTimeout(() => setNotification(null), 3000);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to reset workspace');
    } finally {
      setIsResetting(false);
    }
  };

  const totalOngoingTasks = teams.reduce((acc, t) => acc + (t.taskStats?.ongoing || 0), 0);
  const totalCompletedTasks = teams.reduce((acc, t) => acc + (t.taskStats?.resolved || 0) + (t.taskStats?.closed || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & Header - Light Frosted Glass */}
      <div className="liquid-glass-card liquid-sheen-sweep p-6 sm:p-7 relative overflow-hidden group">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-100 text-amber-900 border border-amber-300">
                Admin Executive Console
              </span>
              <span className="text-xs text-slate-400 font-semibold">Governance & Workflows</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Admin Control Center
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
              Oversee squads, monitor employee workflow hierarchies, manage rosters, and audit cross-team velocity.
            </p>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleResetWorkspace}
              disabled={isResetting}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-200 transition-all cursor-pointer shadow-xs hover:-translate-y-0.5 active:translate-y-0"
              title="Reset demo data to initial state"
            >
              <RotateCcw className={`h-3.5 w-3.5 ${isResetting ? 'animate-spin' : ''}`} />
              <span>Reset Demo Data</span>
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-emerald-700/20 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Team</span>
            </button>
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-emerald-700 font-bold cursor-pointer">
            &times;
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('manage-teams')}
          className="liquid-glass-card liquid-sheen-sweep p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Teams</span>
            <Users2 className="h-4 w-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-black text-slate-900 tabular-nums">{teams.length}</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1 group-hover:text-emerald-700 transition-colors">
            <span>Manage rosters & leads</span>
            <ArrowRight className="h-3 w-3" />
          </p>
        </div>

        <div
          onClick={() => onNavigate('manage-users')}
          className="liquid-glass-card liquid-sheen-sweep p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Employees</span>
            <UserCheck className="h-4 w-4 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-black text-slate-900 tabular-nums">20</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1 group-hover:text-indigo-700 transition-colors">
            <span>employ1 - employ20 demo pool</span>
            <ArrowRight className="h-3 w-3" />
          </p>
        </div>

        <div
          onClick={() => onNavigate('ongoing-work')}
          className="liquid-glass-card liquid-sheen-sweep p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Ongoing Work</span>
            <Clock className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-black text-slate-900 tabular-nums">{totalOngoingTasks}</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1 group-hover:text-blue-700 transition-colors">
            <span>Tasks in progress or review</span>
            <ArrowRight className="h-3 w-3" />
          </p>
        </div>

        <div
          onClick={() => onNavigate('completed-work')}
          className="liquid-glass-card liquid-sheen-sweep p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Completed Work</span>
            <CheckCircle2 className="h-4 w-4 text-teal-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-black text-slate-900 tabular-nums">{totalCompletedTasks}</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1 group-hover:text-teal-700 transition-colors">
            <span>Resolved & closed items</span>
            <ArrowRight className="h-3 w-3" />
          </p>
        </div>
      </div>

      {/* Featured Executive Section: Employee Workflows & Achievements (Tree & Bar Views) */}
      <div className="relative overflow-hidden p-7 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white shadow-xl border border-white/20 group transition-all duration-300">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white border border-white/30 backdrop-blur-md">
                Admin Exclusive
              </span>
              <span className="text-xs text-emerald-200 flex items-center gap-1">
                <Trophy className="h-3.5 w-3.5 text-amber-300" />
                Live Squad Intelligence
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Employee Workflows & Achievements
            </h2>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Explore the complete hierarchy and live operational workflow of every employee across all squads. View organizational trees or comparative achievement bar charts with custom metrics and velocity rankings.
            </p>
            <div className="flex items-center gap-4 pt-1 text-xs text-emerald-200/90">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>20 Employees Tracked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                <span>Tree & Bar Dual View</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span>Gamified XP & Badges</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onNavigate('admin-workflows-achievements', { view: 'tree', viewMode: 'tree' })}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-emerald-50 text-slate-900 font-bold text-xs shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <GitFork className="h-4 w-4 text-emerald-700" />
              <span>Open Tree View</span>
            </button>
            <button
              onClick={() => onNavigate('admin-workflows-achievements', { view: 'bar', viewMode: 'bar' })}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-xs backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <BarChart3 className="h-4 w-4 text-cyan-300" />
              <span>Open Bar Chart View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Teams & Live Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teams List (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Active Engineering Squads</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700 font-bold">
                {teams.length}
              </span>
            </div>
            <button
              onClick={() => onNavigate('manage-teams')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Manage all squads</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading squads...</div>
          ) : teams.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-white/60 border border-white/60">
              <Users2 className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No teams registered</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                Create your first squad
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teams.map(team => (
                <div
                  key={team.id}
                  className="liquid-glass-card liquid-sheen-sweep p-5 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {team.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenDetails(team)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Inspect squad details and tasks"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(team.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete squad"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-3 line-clamp-1">
                      Lead: <span className="font-semibold text-slate-800">{team.lead?.name || 'Unassigned'}</span>
                    </p>
                    <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-slate-50/80 border border-slate-100 text-center text-xs">
                      <div>
                        <span className="block text-[10px] text-slate-400 font-bold uppercase">Members</span>
                        <span className="font-bold text-slate-800">{team.memberIds?.length || 0}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 font-bold uppercase">Ongoing</span>
                        <span className="font-bold text-blue-700">{team.taskStats?.ongoing || 0}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 font-bold uppercase">Resolved</span>
                        <span className="font-bold text-emerald-700">{team.taskStats?.resolved || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">
                      Created {new Date(team.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleOpenDetails(team)}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Roster & Tasks</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Activity Feed (1 column) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">Live Audit Feed</h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              Real-time
            </span>
          </div>

          <div className="liquid-glass-card p-5 space-y-4">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading activity...</div>
            ) : activities.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">No actions recorded yet.</div>
            ) : (
              <div className="space-y-3.5">
                {activities.map(act => (
                  <div key={act.id} className="flex items-start gap-3 text-xs pb-3 border-b border-slate-100 last:border-b-0 last:pb-0">
                    <UserAvatar src={act.actor?.avatar} name={act.actor?.name} size="xs" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-bold text-slate-900 truncate">
                          {act.actor?.name || 'Workspace User'}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                          {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5 line-clamp-2">
                        {act.details}
                      </p>
                      <span className="inline-block mt-1 text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {act.action.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateTeamModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={loadData}
        />
      )}

      {isDetailsOpen && selectedTeam && (
        <TeamDetailsModal
          isOpen={isDetailsOpen}
          team={selectedTeam}
          tasks={teamTasks}
          onClose={() => setIsDetailsOpen(false)}
          onSelectTask={(taskId) => onNavigate('task-details', { taskId })}
        />
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900">Delete Engineering Squad?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              This action safely deletes the team roster. Any ongoing tasks assigned to this team will be archived or marked resolved.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTeam(confirmDeleteId)}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
