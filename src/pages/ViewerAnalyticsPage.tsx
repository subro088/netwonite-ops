import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api.ts';
import { Team, Task, ActivityLog, ApprovalRequest } from '../types/index.ts';
import { StatusBadge } from '../components/common/StatusBadge.tsx';
import { PriorityBadge } from '../components/common/PriorityBadge.tsx';
import { UserAvatar } from '../components/common/UserAvatar.tsx';
import {
  BarChart3,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Users2,
  ArrowRight,
  ShieldCheck,
  Eye,
  Download,
  Activity,
  Layers,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Calendar,
  X,
} from 'lucide-react';

interface ViewerAnalyticsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const ViewerAnalyticsPage: React.FC<ViewerAnalyticsPageProps> = ({ onNavigate }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [rejections, setRejections] = useState<any[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedClaimFilter, setSelectedClaimFilter] = useState<'all' | 'claimed' | 'unclaimed'>('all');
  const [selectedOutcomeFilter, setSelectedOutcomeFilter] = useState<'all' | 'approved' | 'rejected' | 'active'>('all');
  const [activeTab, setActiveTab] = useState<'work-items' | 'squad-breakdown' | 'approval-audit' | 'timeline'>('work-items');
  const [inspectedTask, setInspectedTask] = useState<Task | null>(null);
  const [taskActivities, setTaskActivities] = useState<ActivityLog[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [teamsRes, tasksRes, approvalsRes, rejectionsRes, activitiesRes] = await Promise.all([
        api.getTeams(),
        api.getTasks({ limit: 100 }),
        api.getApprovals(),
        api.getRejections(),
        api.getActivities(80),
      ]);
      setTeams(teamsRes.teams);
      setTasks(tasksRes.tasks);
      setApprovals(approvalsRes.approvals);
      setRejections(rejectionsRes.rejections);
      setActivities(activitiesRes.activities);
    } catch (err) {
      console.error('Failed to load analyst data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered task items
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          task.title.toLowerCase().includes(q) ||
          task.description.toLowerCase().includes(q) ||
          task.creator?.name.toLowerCase().includes(q) ||
          (task.assignee && task.assignee.name.toLowerCase().includes(q)) ||
          task.sourceTeam?.name.toLowerCase().includes(q) ||
          (task.destinationTeam && task.destinationTeam.name.toLowerCase().includes(q)) ||
          (task.reviewNotes && task.reviewNotes.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Squad filter
      if (selectedTeam !== 'all') {
        if (task.sourceTeamId !== selectedTeam && task.destinationTeamId !== selectedTeam) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus !== 'all') {
        if (task.status !== selectedStatus) return false;
      }

      // Claim filter
      if (selectedClaimFilter === 'claimed' && !task.assigneeId) return false;
      if (selectedClaimFilter === 'unclaimed' && task.assigneeId) return false;

      // Outcome filter
      if (selectedOutcomeFilter === 'approved' && task.status !== 'Resolved') return false;
      if (selectedOutcomeFilter === 'rejected') {
        const isRej = task.status === 'Closed' || (task.reviewNotes && task.reviewNotes.toLowerCase().includes('reject'));
        if (!isRej) return false;
      }
      if (selectedOutcomeFilter === 'active') {
        if (task.status === 'Resolved' || task.status === 'Closed') return false;
      }

      return true;
    });
  }, [tasks, search, selectedTeam, selectedStatus, selectedClaimFilter, selectedOutcomeFilter]);

  // Aggregate statistics
  const totalTasksCount = tasks.length;
  const claimedTasksCount = tasks.filter(t => !!t.assigneeId).length;
  const unclaimedTasksCount = tasks.filter(t => !t.assigneeId).length;
  const resolvedTasksCount = tasks.filter(t => t.status === 'Resolved').length;
  const closedTasksCount = tasks.filter(t => t.status === 'Closed').length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const awaitingApprovalCount = tasks.filter(t => t.status === 'Awaiting Approval').length;
  const totalCompleted = resolvedTasksCount + closedTasksCount;
  const claimRate = totalTasksCount > 0 ? Math.round((claimedTasksCount / totalTasksCount) * 100) : 0;
  const completionRate = totalTasksCount > 0 ? Math.round((totalCompleted / totalTasksCount) * 100) : 0;

  // Inspect task details
  const handleInspectTask = (task: Task) => {
    setInspectedTask(task);
    const relatedActivities = activities.filter(a => a.taskId === task.id);
    setTaskActivities(relatedActivities);
  };

  // Export full audit report (JSON format)
  const handleExportAuditReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      platformSummary: {
        totalTeams: teams.length,
        totalTasks: totalTasksCount,
        claimedTasks: claimedTasksCount,
        unclaimedTasks: unclaimedTasksCount,
        resolvedDeliverables: resolvedTasksCount,
        closedDeliverables: closedTasksCount,
        inProgress: inProgressCount,
        awaitingReview: awaitingApprovalCount,
        claimRate: `${claimRate}%`,
        completionRate: `${completionRate}%`,
      },
      squadAnalysis: teams.map(team => {
        const squadTasks = tasks.filter(t => t.sourceTeamId === team.id || t.destinationTeamId === team.id);
        return {
          teamName: team.name,
          leader: team.lead?.name,
          rosterCount: team.members.length,
          totalWorkload: squadTasks.length,
          resolved: squadTasks.filter(t => t.status === 'Resolved').length,
          inProgress: squadTasks.filter(t => t.status === 'In Progress').length,
          unassigned: squadTasks.filter(t => t.status === 'New').length,
        };
      }),
      taskRegistry: tasks.map(t => ({
        taskId: t.id,
        title: t.title,
        priority: t.priority,
        status: t.status,
        originSquad: t.sourceTeam?.name,
        destinationSquad: t.destinationTeam?.name || 'Same Squad',
        createdBy: t.creator?.name,
        createdDate: t.createdAt,
        claimedBy: t.assignee ? t.assignee.name : 'Unclaimed',
        outcomeNotes: t.reviewNotes || 'None',
      })),
    };

    const dataUri = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(report, null, 2))}`;
    const anchor = document.createElement('a');
    anchor.setAttribute('href', dataUri);
    anchor.setAttribute('download', `netwonite-operations-analysis-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    setToastMessage('Operations analysis report exported successfully!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 px-5 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="cursor-pointer">&times;</button>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/70 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-100 text-cyan-900 border border-cyan-300">
                Dedicated System Role • Viewer Analyst
              </span>
              <span className="text-xs text-slate-400 font-semibold">Read-Only Intelligence Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Operations & Workflow Analysis Center
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Real-time multi-squad audit terminal. Inspect which team created each task, who claimed it, progress status, whether work was approved or rejected with cause, and overall turnaround metrics.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleExportAuditReport}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
              title="Download structured JSON report"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Audit Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Radar Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-white/80 border border-white/70 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Active Squads
          </span>
          <div className="text-2xl font-black text-slate-900 tabular-nums">{teams.length}</div>
          <p className="text-[10px] text-slate-500 mt-0.5">Tracked squads</p>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 border border-white/70 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Created Tasks
          </span>
          <div className="text-2xl font-black text-slate-900 tabular-nums">{totalTasksCount}</div>
          <p className="text-[10px] text-slate-500 mt-0.5">Across all origin teams</p>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block mb-1">
            Claim Rate
          </span>
          <div className="text-2xl font-black text-indigo-950 tabular-nums">{claimRate}%</div>
          <p className="text-[10px] text-indigo-700 mt-0.5">
            {claimedTasksCount} claimed / {unclaimedTasksCount} open
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block mb-1">
            Work in Flight
          </span>
          <div className="text-2xl font-black text-amber-950 tabular-nums">{inProgressCount + awaitingApprovalCount}</div>
          <p className="text-[10px] text-amber-700 mt-0.5">
            {inProgressCount} active, {awaitingApprovalCount} review
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
            Resolved Tasks
          </span>
          <div className="text-2xl font-black text-emerald-950 tabular-nums">{resolvedTasksCount}</div>
          <p className="text-[10px] text-emerald-700 mt-0.5">Lead approved</p>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block mb-1">
            Rejections & Closed
          </span>
          <div className="text-2xl font-black text-rose-950 tabular-nums">{rejections.length}</div>
          <p className="text-[10px] text-rose-700 mt-0.5">Audited with cause</p>
        </div>
      </div>

      {/* Tab Navigation: Work Items Audit | Squad Breakdown | Approvals & Rejections | Timeline Feed */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200/70 border border-slate-300/40 backdrop-blur-xl overflow-x-auto shadow-inner">
        <button
          onClick={() => setActiveTab('work-items')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'work-items'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          Work Items Lifecycle Audit ({filteredTasks.length})
        </button>
        <button
          onClick={() => setActiveTab('squad-breakdown')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'squad-breakdown'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          Squad-by-Squad Breakdown ({teams.length} Teams)
        </button>
        <button
          onClick={() => setActiveTab('approval-audit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'approval-audit'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          Cross-Team Approvals vs Rejections ({approvals.length + rejections.length})
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'timeline'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          Live Activity History ({activities.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: WORK ITEMS LIFECYCLE AUDIT (Who created, claimed, status, outcome)   */}
      {/* ========================================================================= */}
      {activeTab === 'work-items' && (
        <div className="space-y-4">
          {/* Multi-filter Toolbar */}
          <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-white/70 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, creator, assignee, team, or notes..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>

            {/* Squad filter */}
            <select
              value={selectedTeam}
              onChange={e => setSelectedTeam(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            >
              <option value="all">All Teams</option>
              {teams.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} (Lead: {t.lead.name})
                </option>
              ))}
            </select>

            {/* Status filter */}
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            >
              <option value="all">All Statuses</option>
              <option value="New">New (Open)</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Awaiting Approval">Awaiting Approval</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            {/* Claimed filter */}
            <select
              value={selectedClaimFilter}
              onChange={e => setSelectedClaimFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            >
              <option value="all">All Claim States</option>
              <option value="claimed">Claimed by Engineer</option>
              <option value="unclaimed">Unclaimed / Open</option>
            </select>

            {/* Outcome filter */}
            <select
              value={selectedOutcomeFilter}
              onChange={e => setSelectedOutcomeFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            >
              <option value="all">All Outcomes</option>
              <option value="approved">Approved Deliverables</option>
              <option value="rejected">Rejected / Closed with Reason</option>
              <option value="active">Active Execution</option>
            </select>
          </div>

          {/* Audit Table */}
          {isLoading ? (
            <div className="p-16 text-center text-xs text-slate-400">Loading audit matrix...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-white/70 border border-white/60">
              <Layers className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No work items matching this filter</p>
              <p className="text-xs text-slate-400 mt-1">Try resetting search or dropdown filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl bg-white/90 border border-white/80 shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="p-3.5 pl-5">Task & Origin</th>
                    <th className="p-3.5">Created By</th>
                    <th className="p-3.5">Claimed By</th>
                    <th className="p-3.5">Current Status</th>
                    <th className="p-3.5">Verification / Outcome</th>
                    <th className="p-3.5 pr-5 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTasks.map(task => {
                    const isClaimed = !!task.assigneeId;
                    const isApproved = task.status === 'Resolved';
                    const isRejected = task.status === 'Closed' && task.reviewNotes?.toLowerCase().includes('reject');

                    return (
                      <tr
                        key={task.id}
                        onClick={() => handleInspectTask(task)}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      >
                        {/* Task Title & Squad */}
                        <td className="p-3.5 pl-5 max-w-xs">
                          <div className="flex items-center gap-1.5 mb-1">
                            <PriorityBadge priority={task.priority} size="sm" />
                            {task.destinationTeam ? (
                              <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 font-bold border border-teal-200">
                                <span>{task.sourceTeam?.name}</span>
                                <ArrowRight className="h-2.5 w-2.5" />
                                <span>{task.destinationTeam.name}</span>
                              </span>
                            ) : (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                                {task.sourceTeam?.name}
                              </span>
                            )}
                          </div>
                          <span className="font-bold text-slate-900 group-hover:text-cyan-800 transition-colors line-clamp-1">
                            {task.title}
                          </span>
                        </td>

                        {/* Created By */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <UserAvatar src={task.creator?.avatar} name={task.creator?.name} size="xs" />
                            <div>
                              <span className="font-semibold text-slate-800 block">{task.creator?.name}</span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(task.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Claimed By */}
                        <td className="p-3.5">
                          {isClaimed ? (
                            <div className="flex items-center gap-2">
                              <UserAvatar src={task.assignee?.avatar} name={task.assignee?.name} size="xs" />
                              <div>
                                <span className="font-semibold text-slate-800 block">{task.assignee?.name}</span>
                                <span className="text-[10px] text-emerald-700 font-bold">Claimed & Working</span>
                              </div>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                              <Clock className="h-3 w-3" />
                              <span>Unclaimed (Open)</span>
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="p-3.5">
                          <StatusBadge status={task.status} size="sm" />
                        </td>

                        {/* Outcome & Review notes */}
                        <td className="p-3.5 max-w-xs">
                          {isApproved ? (
                            <div>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                <span>Approved by Lead</span>
                              </span>
                              {task.reviewNotes && (
                                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 italic">
                                  "{task.reviewNotes}"
                                </p>
                              )}
                            </div>
                          ) : isRejected ? (
                            <div>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-200">
                                <XCircle className="h-3 w-3 text-rose-600" />
                                <span>Rejected with Cause</span>
                              </span>
                              {task.reviewNotes && (
                                <p className="text-[11px] text-rose-700 mt-1 line-clamp-1">
                                  {task.reviewNotes}
                                </p>
                              )}
                            </div>
                          ) : task.status === 'Awaiting Approval' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold border border-purple-200">
                              <Clock className="h-3 w-3 text-purple-600" />
                              <span>Pending Lead Decision</span>
                            </span>
                          ) : task.reviewNotes ? (
                            <p className="text-[11px] text-amber-800 line-clamp-1">
                              Feedback: {task.reviewNotes}
                            </p>
                          ) : (
                            <span className="text-[11px] text-slate-400">In Active Pipeline</span>
                          )}
                        </td>

                        {/* Action: Inspect */}
                        <td className="p-3.5 pr-5 text-right">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleInspectTask(task);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-800 hover:bg-cyan-50 transition-colors cursor-pointer"
                            title="Inspect full audit details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SQUAD-BY-SQUAD BREAKDOWN                                           */}
      {/* ========================================================================= */}
      {activeTab === 'squad-breakdown' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {teams.map(team => {
            const teamOriginTasks = tasks.filter(t => t.sourceTeamId === team.id);
            const teamClaimed = teamOriginTasks.filter(t => !!t.assigneeId);
            const teamResolved = teamOriginTasks.filter(t => t.status === 'Resolved');
            const teamOngoing = teamOriginTasks.filter(t => ['Assigned', 'In Progress', 'Awaiting Approval'].includes(t.status));
            const teamUnassigned = teamOriginTasks.filter(t => t.status === 'New');

            return (
              <div
                key={team.id}
                className="p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">
                      Engineering Squad
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">{team.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{team.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-800 block">
                      {team.members.length} Engineers
                    </span>
                    <span className="text-[10px] text-slate-400">Roster capacity</span>
                  </div>
                </div>

                {/* Team Lead Card */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <UserAvatar src={team.lead?.avatar} name={team.lead?.name} role="lead" size="sm" showVectorBadge={true} />
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Appointed Squad Lead</span>
                      <span className="font-bold text-slate-800">{team.lead?.name}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">{team.lead?.title || team.lead?.department}</span>
                </div>

                {/* Squad Metrics Grid */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[9px] font-bold uppercase text-slate-400 block">Created</span>
                    <span className="text-base font-extrabold text-slate-800">{teamOriginTasks.length}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100">
                    <span className="text-[9px] font-bold uppercase text-indigo-700 block">Claimed</span>
                    <span className="text-base font-extrabold text-indigo-900">{teamClaimed.length}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                    <span className="text-[9px] font-bold uppercase text-amber-700 block">In Flight</span>
                    <span className="text-base font-extrabold text-amber-900">{teamOngoing.length}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                    <span className="text-[9px] font-bold uppercase text-emerald-700 block">Resolved</span>
                    <span className="text-base font-extrabold text-emerald-900">{teamResolved.length}</span>
                  </div>
                </div>

                {/* Squad Backlog Health Bar */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-slate-600">Squad Claim & Execution Health</span>
                    <span className="font-bold text-slate-800">
                      {teamUnassigned.length > 0 ? `${teamUnassigned.length} tasks open to claim` : 'Fully assigned'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${(teamResolved.length / (teamOriginTasks.length || 1)) * 100}%` }}
                      className="bg-emerald-500 h-full"
                      title="Resolved"
                    />
                    <div
                      style={{ width: `${(teamOngoing.length / (teamOriginTasks.length || 1)) * 100}%` }}
                      className="bg-amber-500 h-full"
                      title="Ongoing"
                    />
                    <div
                      style={{ width: `${(teamUnassigned.length / (teamOriginTasks.length || 1)) * 100}%` }}
                      className="bg-sky-400 h-full"
                      title="Unassigned Open"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CROSS-TEAM APPROVALS VS REJECTIONS ANALYSIS                        */}
      {/* ========================================================================= */}
      {activeTab === 'approval-audit' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white/80 border border-white/70 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Cross-Squad Decision Pipeline
              </h3>
              <p className="text-xs text-slate-500">
                Inspect cross-team work delegations that were approved or formally rejected with technical justification.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                {approvals.filter(a => a.status === 'Approved').length} Approved
              </span>
              <span className="px-3 py-1 rounded-xl bg-purple-50 text-purple-800 font-bold border border-purple-200">
                {approvals.filter(a => a.status === 'Pending').length} Pending
              </span>
              <span className="px-3 py-1 rounded-xl bg-rose-50 text-rose-800 font-bold border border-rose-200">
                {rejections.length} Rejections Logged
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {rejections.map(item => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white/90 border border-rose-100 shadow-xs hover:border-rose-300 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800">
                        {item.type === 'cross_team' ? 'Cross-Team Delegated - Rejected' : 'Submission Review - Feedback'}
                      </span>
                      {item.destinationTeam && (
                        <span className="flex items-center gap-1 text-xs text-slate-600 font-bold">
                          <span>{item.sourceTeam}</span>
                          <ArrowRight className="h-3 w-3 text-slate-400" />
                          <span>{item.destinationTeam}</span>
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{item.taskTitle}</h4>
                  </div>
                  <div className="text-right text-[11px] text-slate-400">
                    <span>Decided by <strong className="text-slate-700">{item.rejectorName}</strong></span>
                    <span className="block text-[10px]">{new Date(item.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200 text-xs text-rose-900">
                  <span className="font-bold uppercase tracking-wider text-[10px] block mb-0.5">
                    Documented Rationale:
                  </span>
                  <p className="leading-relaxed">{item.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: LIVE ACTIVITY TIMELINE                                             */}
      {/* ========================================================================= */}
      {activeTab === 'timeline' && (
        <div className="p-6 rounded-3xl bg-white/90 border border-white/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-600" />
              <h3 className="text-sm font-bold text-slate-900">Chronological Workflow Events Stream</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-bold">
              Real-time Audit
            </span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {activities.map(act => (
              <div key={act.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-start gap-3">
                <UserAvatar src={act.actor?.avatar} name={act.actor?.name} size="xs" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-bold text-slate-900">{act.actor?.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(act.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">{act.details}</p>
                  <span className="inline-block mt-1 text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                    {act.action.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TASK AUDIT DOSSIER MODAL                                                  */}
      {/* ========================================================================= */}
      {inspectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={() => setInspectedTask(null)} />
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl z-10 border border-white/80 space-y-5 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <PriorityBadge priority={inspectedTask.priority} size="sm" />
                  <StatusBadge status={inspectedTask.status} size="sm" />
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                    ID: {inspectedTask.id}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{inspectedTask.title}</h3>
              </div>
              <button
                onClick={() => setInspectedTask(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {inspectedTask.description}
            </p>

            {/* Lifecycle Lineage Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Creation Origin</span>
                <p className="font-bold text-slate-800">{inspectedTask.creator?.name}</p>
                <p className="text-slate-500">Origin Squad: {inspectedTask.sourceTeam?.name}</p>
                <p className="text-[10px] text-slate-400">{new Date(inspectedTask.createdAt).toLocaleString()}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Claim & Execution</span>
                {inspectedTask.assignee ? (
                  <>
                    <p className="font-bold text-slate-800">{inspectedTask.assignee.name}</p>
                    <p className="text-emerald-700 font-semibold">Claimed and Assigned</p>
                    <p className="text-[10px] text-slate-400">Last Updated: {new Date(inspectedTask.updatedAt).toLocaleString()}</p>
                  </>
                ) : (
                  <p className="text-amber-800 font-semibold italic">Unclaimed (Available for squad claim)</p>
                )}
              </div>
            </div>

            {/* Verification / Review Outcome */}
            {inspectedTask.reviewNotes && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs">
                <span className="font-bold uppercase tracking-wider text-[10px] text-amber-900 block mb-1">
                  Recorded Review / Rejection Notes:
                </span>
                <p className="text-amber-950">{inspectedTask.reviewNotes}</p>
              </div>
            )}

            {/* Timeline for this Task */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-2">
                Audit Timeline for This Task ({taskActivities.length} Events)
              </span>
              {taskActivities.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">No specific activity events recorded.</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {taskActivities.map(act => (
                    <div key={act.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-800">{act.actor?.name}</span>
                        <p className="text-[11px] text-slate-500">{act.details}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setInspectedTask(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
              >
                Close Audit Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
