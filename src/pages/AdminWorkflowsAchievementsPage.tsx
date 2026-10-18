import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api.ts';
import { User, Team, Task, ActivityLog } from '../types/index.ts';
import { StatusBadge } from '../components/common/StatusBadge.tsx';
import { PriorityBadge } from '../components/common/PriorityBadge.tsx';
import { UserAvatar } from '../components/common/UserAvatar.tsx';
import {
  GitFork,
  BarChart3,
  Search,
  Trophy,
  Award,
  Zap,
  CheckCircle2,
  Shield,
  UserCheck,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ExternalLink,
  X,
  Crown,
  Medal,
  Download,
  PlusCircle,
  Check,
  Flame,
} from 'lucide-react';

interface AdminWorkflowsAchievementsPageProps {
  onNavigate: (page: string, params?: any) => void;
  initialViewMode?: 'tree' | 'bar';
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: 'diamond' | 'gold' | 'silver' | 'bronze';
  category: 'delivery' | 'leadership' | 'collaboration' | 'speed';
  unlocked: boolean;
  progress?: string;
}

export interface EmployeeMetrics {
  user: User;
  teamsLeading: Team[];
  teamsMemberOf: Team[];
  primaryTeam: Team | null;
  assignedTasks: Task[];
  createdTasks: Task[];
  resolvedTasks: Task[];
  inProgressTasks: Task[];
  awaitingApprovalTasks: Task[];
  newTasks: Task[];
  totalWorkload: number;
  completionRate: number;
  velocityScore: number;
  squadContributionPct: number;
  orgContributionPct: number;
  contributorTier: 'Diamond Pillar' | 'Gold Driver' | 'Silver Builder' | 'Bronze Contributor' | 'Apprentice';
  level: number;
  currentXP: number;
  nextLevelXP: number;
  streakDays: number;
  achievements: AchievementItem[];
}

export const AdminWorkflowsAchievementsPage: React.FC<AdminWorkflowsAchievementsPageProps> = ({
  onNavigate,
  initialViewMode = 'tree',
}) => {
  const [viewMode, setViewMode] = useState<'tree' | 'bar'>(initialViewMode);
  const [barSubMode, setBarSubMode] = useState<'comparison' | 'podium' | 'squad-share'>('comparison');
  const [treeDensity, setTreeDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Controls
  const [search, setSearch] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'contribution' | 'velocity' | 'resolved' | 'workload' | 'name'>('contribution');
  const [tierFilter, setTierFilter] = useState<'all' | 'diamond' | 'gold' | 'silver' | 'bronze'>('all');
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({});
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeMetrics | null>(null);

  // Feature: Grant Custom Badge Modal state
  const [isGrantBadgeOpen, setIsGrantBadgeOpen] = useState(false);
  const [badgeTargetUserId, setBadgeTargetUserId] = useState<string>('');
  const [badgeTitle, setBadgeTitle] = useState('Sprint MVP');
  const [badgeIcon, setBadgeIcon] = useState('🏆');
  const [badgeReason, setBadgeReason] = useState('Outstanding architectural velocity and leadership');
  const [isGranting, setIsGranting] = useState(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  useEffect(() => {
    if (initialViewMode) {
      setViewMode(initialViewMode);
    }
  }, [initialViewMode]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [teamsRes, usersRes, tasksRes, actRes] = await Promise.all([
        api.getTeams(),
        api.getUsers(),
        api.getTasks({ limit: 100 }),
        api.getActivities(100),
      ]);
      setTeams(teamsRes.teams);
      setUsers(usersRes.users);
      setTasks(tasksRes.tasks);
      setActivities(actRes.activities);

      const initialExpanded: Record<string, boolean> = {};
      teamsRes.teams.forEach(t => {
        initialExpanded[t.id] = true;
      });
      setExpandedTeams(initialExpanded);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute comprehensive metrics, contribution share %, XP levels, and dynamic achievements
  const employeeMetricsList = useMemo<EmployeeMetrics[]>(() => {
    const employees = users.filter(u => u.role === 'employee');
    const totalOrgResolved = tasks.filter(t => t.status === 'Resolved' || t.status === 'Closed').length || 1;

    return employees.map((emp, index) => {
      const empTeamsLeading = teams.filter(t => t.leadId === emp.id);
      const empTeamsMember = teams.filter(t => t.memberIds.includes(emp.id));
      const primaryTeam = empTeamsLeading[0] || empTeamsMember[0] || null;
      const assigned = tasks.filter(t => t.assigneeId === emp.id);
      const created = tasks.filter(t => t.creatorId === emp.id);
      const resolved = assigned.filter(t => t.status === 'Resolved' || t.status === 'Closed');
      const inProgress = assigned.filter(t => t.status === 'In Progress');
      const awaitingApproval = assigned.filter(t => t.status === 'Awaiting Approval');
      const newClaimed = assigned.filter(t => t.status === 'Assigned');
      const totalWorkload = assigned.length;
      const completionRate = totalWorkload > 0 ? Math.round((resolved.length / totalWorkload) * 100) : (created.length > 0 ? 100 : 0);

      // Squad contribution %
      let squadContributionPct = 0;
      if (primaryTeam) {
        const squadTasks = tasks.filter(
          t =>
            t.sourceTeamId === primaryTeam.id ||
            t.destinationTeamId === primaryTeam.id ||
            primaryTeam.memberIds.includes(t.assigneeId || '')
        );
        const squadTotal = squadTasks.length || 1;
        squadContributionPct = Math.round((assigned.length / squadTotal) * 100);
      }

      // Org-wide contribution
      const orgContributionPct = Math.round((resolved.length / totalOrgResolved) * 100);

      // XP & Velocity Calculation (with custom badges contributing +50 XP each!)
      const customBadgeBonus = (emp.customBadges?.length || 0) * 50;
      const currentXP = (resolved.length * 35) +
        (inProgress.length * 15) +
        (awaitingApproval.length * 20) +
        (empTeamsLeading.length * 40) +
        (created.length * 10) +
        customBadgeBonus;

      const velocityScore = currentXP;

      // Level determination
      let level = 1;
      let nextLevelXP = 50;
      let contributorTier: EmployeeMetrics['contributorTier'] = 'Apprentice';
      if (currentXP >= 120) {
        level = 5;
        nextLevelXP = 200;
        contributorTier = 'Diamond Pillar';
      } else if (currentXP >= 80) {
        level = 4;
        nextLevelXP = 120;
        contributorTier = 'Gold Driver';
      } else if (currentXP >= 45) {
        level = 3;
        nextLevelXP = 80;
        contributorTier = 'Silver Builder';
      } else if (currentXP >= 20) {
        level = 2;
        nextLevelXP = 45;
        contributorTier = 'Bronze Contributor';
      }

      const streakDays = Math.max(1, (index * 3 + 2) % 9);

      // Dynamic Gamified Achievements
      const achievements: AchievementItem[] = [
        {
          id: 'velocity-titan',
          title: 'Velocity Titan',
          description: 'Resolved 2 or more sprint work items with spotless audit validation.',
          icon: '⚡',
          tier: 'diamond',
          category: 'delivery',
          unlocked: resolved.length >= 2,
          progress: `${resolved.length}/2 tasks resolved`,
        },
        {
          id: 'flawless-execution',
          title: 'Flawless Execution',
          description: 'Achieved 80%+ deliverable completion efficiency on assigned tasks.',
          icon: '🎯',
          tier: 'gold',
          category: 'delivery',
          unlocked: completionRate >= 80 && totalWorkload > 0,
          progress: `${completionRate}% efficiency`,
        },
        {
          id: 'squad-cornerstone',
          title: 'Squad Cornerstone',
          description: 'Handled 25%+ of all work dispatched across their primary engineering squad.',
          icon: '💎',
          tier: 'gold',
          category: 'collaboration',
          unlocked: squadContributionPct >= 25,
          progress: `${squadContributionPct}% squad share`,
        },
        {
          id: 'squad-captain',
          title: 'Squad Captain',
          description: 'Designated squad leader managing cross-team architecture and review approvals.',
          icon: '👑',
          tier: 'gold',
          category: 'leadership',
          unlocked: empTeamsLeading.length > 0,
          progress: empTeamsLeading.length > 0 ? 'Leading squad' : 'Lead appointment required',
        },
        {
          id: 'cross-squad-mvp',
          title: 'Cross-Squad MVP',
          description: 'Active contributor serving across multiple distinct engineering squads.',
          icon: '🌐',
          tier: 'silver',
          category: 'collaboration',
          unlocked: empTeamsMember.length > 1,
          progress: `${empTeamsMember.length} squads active`,
        },
        {
          id: 'sprint-champion',
          title: 'Sprint Champion',
          description: 'Currently advancing active in-progress deliverables in active sprint.',
          icon: '🔥',
          tier: 'bronze',
          category: 'speed',
          unlocked: inProgress.length > 0,
          progress: `${inProgress.length} active tasks`,
        },
        {
          id: 'certified-specialist',
          title: 'Squad Specialist',
          description: 'Verified engineering specialist ready to claim and resolve backlog work.',
          icon: '🛡️',
          tier: 'bronze',
          category: 'delivery',
          unlocked: true,
          progress: 'Verified engineer',
        },
      ];

      // Append any custom badges awarded by Admin
      if (emp.customBadges && emp.customBadges.length > 0) {
        emp.customBadges.forEach(b => {
          achievements.unshift({
            id: b.id,
            title: b.title,
            description: `${b.reason} (Awarded by ${b.grantedBy})`,
            icon: b.icon || '🎖️',
            tier: 'diamond',
            category: 'leadership',
            unlocked: true,
            progress: 'Admin Commendation',
          });
        });
      }

      return {
        user: emp,
        teamsLeading: empTeamsLeading,
        teamsMemberOf: empTeamsMember,
        primaryTeam,
        assignedTasks: assigned,
        createdTasks: created,
        resolvedTasks: resolved,
        inProgressTasks: inProgress,
        awaitingApprovalTasks: awaitingApproval,
        newTasks: newClaimed,
        totalWorkload,
        completionRate,
        velocityScore,
        squadContributionPct,
        orgContributionPct,
        contributorTier,
        level,
        currentXP,
        nextLevelXP,
        streakDays,
        achievements,
      };
    });
  }, [users, teams, tasks]);

  // Filtered and sorted employee metrics
  const filteredMetrics = useMemo(() => {
    let list = employeeMetricsList;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        m =>
          m.user.name.toLowerCase().includes(q) ||
          m.user.email.toLowerCase().includes(q) ||
          (m.user.title && m.user.title.toLowerCase().includes(q)) ||
          (m.user.department && m.user.department.toLowerCase().includes(q))
      );
    }
    if (selectedTeamId !== 'all') {
      list = list.filter(
        m =>
          m.teamsLeading.some(t => t.id === selectedTeamId) ||
          m.teamsMemberOf.some(t => t.id === selectedTeamId)
      );
    }
    if (tierFilter !== 'all') {
      list = list.filter(m => m.achievements.some(a => a.tier === tierFilter && a.unlocked));
    }
    // Sort
    return [...list].sort((a, b) => {
      if (sortBy === 'contribution') return b.squadContributionPct - a.squadContributionPct;
      if (sortBy === 'velocity') return b.velocityScore - a.velocityScore;
      if (sortBy === 'resolved') return b.resolvedTasks.length - a.resolvedTasks.length;
      if (sortBy === 'workload') return b.totalWorkload - a.totalWorkload;
      return a.user.name.localeCompare(b.user.name);
    });
  }, [employeeMetricsList, search, selectedTeamId, sortBy, tierFilter]);

  // Top 3 Podium Leaders for Bar View Gamification
  const podiumWinners = useMemo(() => {
    return [...employeeMetricsList]
      .sort((a, b) => b.velocityScore - a.velocityScore)
      .slice(0, 3);
  }, [employeeMetricsList]);

  // Squads with aggregated member contributions
  const squadAggregates = useMemo(() => {
    return teams.map(team => {
      const members = employeeMetricsList.filter(
        m => team.memberIds.includes(m.user.id) || team.leadId === m.user.id
      );
      const totalTeamTasks = members.reduce((acc, m) => acc + m.totalWorkload, 0) || 1;
      const totalTeamResolved = members.reduce((acc, m) => acc + m.resolvedTasks.length, 0);
      const topSquadContributor = [...members].sort(
        (a, b) => (b.resolvedTasks.length * 2 + b.totalWorkload) - (a.resolvedTasks.length * 2 + a.totalWorkload)
      )[0];
      return {
        team,
        members,
        totalTeamTasks,
        totalTeamResolved,
        topSquadContributor,
      };
    });
  }, [teams, employeeMetricsList]);

  const toggleTeam = (teamId: string) => {
    setExpandedTeams(prev => ({
      ...prev,
      [teamId]: !prev[teamId],
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    teams.forEach(t => (all[t.id] = true));
    setExpandedTeams(all);
  };

  const collapseAll = () => {
    setExpandedTeams({});
  };

  // Feature: Export Workflow Report to JSON or CSV
  const handleExportReport = () => {
    const reportData = employeeMetricsList.map(m => ({
      Name: m.user.name,
      Email: m.user.email,
      Title: m.user.title || 'Engineer',
      Squad: m.primaryTeam?.name || 'Unassigned',
      TotalTasks: m.totalWorkload,
      Resolved: m.resolvedTasks.length,
      CompletionRate: `${m.completionRate}%`,
      SquadContribution: `${m.squadContributionPct}%`,
      XP: m.velocityScore,
      Tier: m.contributorTier,
      Level: m.level,
      UnlockedAchievements: m.achievements.filter(a => a.unlocked).map(a => a.title).join('; '),
    }));

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(reportData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `netwonite-workflow-achievements-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setToastNotification('Workflow & achievements report exported successfully!');
    setTimeout(() => setToastNotification(null), 3500);
  };

  // Feature: Grant Badge Handler
  const handleGrantBadgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!badgeTargetUserId || !badgeTitle.trim() || !badgeReason.trim()) return;
    setIsGranting(true);
    try {
      await api.grantBadge(badgeTargetUserId, {
        title: badgeTitle.trim(),
        icon: badgeIcon,
        reason: badgeReason.trim(),
      });
      setIsGrantBadgeOpen(false);
      setBadgeReason('');
      setToastNotification(`Granted "${badgeTitle}" badge and +50 XP bonus!`);
      setTimeout(() => setToastNotification(null), 4000);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to grant badge');
    } finally {
      setIsGranting(false);
    }
  };

  // Stats summary for the top bar
  const totalEmployeesCount = employeeMetricsList.length;
  const avgCompletionRate = Math.round(
    employeeMetricsList.reduce((acc, m) => acc + m.completionRate, 0) / (totalEmployeesCount || 1)
  );
  const totalResolvedWork = tasks.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
  const topOverallPerformer = [...employeeMetricsList].sort((a, b) => b.velocityScore - a.velocityScore)[0];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastNotification && (
        <div className="p-3.5 px-5 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>{toastNotification}</span>
          </div>
          <button
            onClick={() => setToastNotification(null)}
            className="text-white/80 hover:text-white font-bold cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="relative overflow-hidden p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-100 text-amber-900 border border-amber-300">
                Admin Executive Console
              </span>
              <span className="text-xs text-slate-400 font-semibold">Real-Time Member Contribution & Achievements</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Interactive Member Workflow & Contribution Hub
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
              Monitor exactly who contributes how much to each squad in <strong>Tree Graph</strong> and <strong>Bar Graph</strong> views. Track XP velocity, milestone deliverables, and gamified achievement medals.
            </p>
          </div>

          {/* Action Tools: Grant Badge, Export Report & View Switcher */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setBadgeTargetUserId(employeeMetricsList[0]?.user.id || '');
                setIsGrantBadgeOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
              title="Grant Recognition Badge & XP to Any Employee"
            >
              <Award className="h-3.5 w-3.5" />
              <span>Grant Badge</span>
            </button>

            <button
              onClick={handleExportReport}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-bold text-xs border border-slate-200 shadow-xs transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
              title="Export report in JSON audit format"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Export Report</span>
            </button>

            {/* View Switcher: Tree View vs Bar View */}
            <div className="flex items-center p-1 rounded-2xl bg-slate-100/90 border border-slate-200 shadow-inner">
              <button
                onClick={() => setViewMode('tree')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'tree'
                    ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <GitFork className="h-4 w-4 text-emerald-400" />
                <span>Tree Graph View</span>
              </button>
              <button
                onClick={() => setViewMode('bar')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'bar'
                    ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <BarChart3 className="h-4 w-4 text-teal-400" />
                <span>Bar Graph View</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Overview Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-white/70 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Tracked Engineers</span>
            <UserCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalEmployeesCount}</div>
          <p className="text-[10px] text-slate-500 mt-0.5">Active across {teams.length} distinct squads</p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 shadow-xs">
          <div className="flex items-center justify-between text-emerald-700 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider">Avg Squad Delivery</span>
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="text-2xl font-bold text-emerald-900">{avgCompletionRate}%</div>
          <p className="text-[10px] text-emerald-700 mt-0.5">Overall deliverable success rate</p>
        </div>

        <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200/80 shadow-xs">
          <div className="flex items-center justify-between text-purple-700 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider">Completed Deliverables</span>
            <Trophy className="h-4 w-4" />
          </div>
          <div className="text-2xl font-bold text-purple-900">{totalResolvedWork}</div>
          <p className="text-[10px] text-purple-700 mt-0.5">Verified sprint milestones</p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 shadow-xs">
          <div className="flex items-center justify-between text-amber-700 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider">Top Org Contributor</span>
            <Crown className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-base font-bold text-amber-950 truncate">{topOverallPerformer?.user.name || 'None'}</div>
          <p className="text-[10px] text-amber-700 mt-0.5 font-medium">
            {topOverallPerformer?.velocityScore} XP • {topOverallPerformer?.contributorTier}
          </p>
        </div>
      </div>

      {/* Control Filter & Sub-mode Toolbar */}
      <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-white/70 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search member name, job title, department..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>

        {/* Squad Filter Dropdown */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <select
            value={selectedTeamId}
            onChange={e => setSelectedTeamId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            <option value="all">All Squads ({teams.length})</option>
            {teams.map(t => (
              <option key={t.id} value={t.id}>
                {t.name} (Lead: {t.lead.name})
              </option>
            ))}
          </select>

          {/* Sort By Dropdown */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            <option value="contribution">Sort by Squad Contribution %</option>
            <option value="velocity">Sort by Velocity XP Points</option>
            <option value="resolved">Sort by Tasks Completed</option>
            <option value="workload">Sort by Total Workload</option>
            <option value="name">Sort by Member Name</option>
          </select>

          {/* Achievement Tier Filter */}
          <select
            value={tierFilter}
            onChange={e => setTierFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            <option value="all">All Achievement Tiers</option>
            <option value="diamond">💎 Diamond Tier</option>
            <option value="gold">🥇 Gold Tier</option>
            <option value="silver">🥈 Silver Tier</option>
            <option value="bronze">🥉 Bronze Tier</option>
          </select>

          {/* Tree Mode Controls */}
          {viewMode === 'tree' && (
            <div className="flex items-center gap-1">
              <button
                onClick={expandAll}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
              >
                Collapse All
              </button>
              <button
                onClick={() => setTreeDensity(prev => (prev === 'comfortable' ? 'compact' : 'comfortable'))}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] transition-colors cursor-pointer"
              >
                {treeDensity === 'comfortable' ? 'Compact Cards' : 'Detailed Cards'}
              </button>
            </div>
          )}

          {/* Bar Mode Sub-views Selector */}
          {viewMode === 'bar' && (
            <div className="flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200">
              <button
                onClick={() => setBarSubMode('comparison')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  barSubMode === 'comparison'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Member Bar Chart
              </button>
              <button
                onClick={() => setBarSubMode('squad-share')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  barSubMode === 'squad-share'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Squad Share %
              </button>
              <button
                onClick={() => setBarSubMode('podium')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  barSubMode === 'podium'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🏆 Podium & XP
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: INTERACTIVE VISUAL TREE GRAPH VIEW                                */}
      {/* ========================================================================= */}
      {viewMode === 'tree' && (
        <div className="space-y-8">
          {/* Tree Apex Root Node */}
          <div className="flex flex-col items-center">
            <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 text-white shadow-2xl border border-slate-800 flex items-center gap-4 max-w-lg w-full justify-between backdrop-blur-xl relative group">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-emerald-500/20">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold tracking-tight">Netwonite Apex Architecture</h3>
                    <span className="px-2 py-0.5 rounded-full text-[9px] bg-emerald-500/20 text-emerald-300 font-bold uppercase border border-emerald-500/30">
                      Root Hub
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Central Command • {teams.length} Squads • {totalEmployeesCount} Engineers Monitored
                  </p>
                </div>
              </div>
              <div className="text-right pl-3 border-l border-slate-800">
                <span className="text-xs font-extrabold text-emerald-400 block">{totalResolvedWork} Done</span>
                <span className="text-[10px] text-slate-400">Total Outputs</span>
              </div>
            </div>

            {/* Tree Branch Visual Connector Path down to squads */}
            <div className="flex flex-col items-center my-1">
              <div className="w-0.5 h-6 bg-gradient-to-b from-slate-900 to-emerald-500"></div>
              <div className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-200 animate-pulse"></div>
            </div>
          </div>

          {/* Squad Subtrees */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {squadAggregates
              .filter(s => selectedTeamId === 'all' || s.team.id === selectedTeamId)
              .map(({ team, members, totalTeamTasks, totalTeamResolved, topSquadContributor }) => {
                const isExpanded = expandedTeams[team.id];
                const teamLeaderMetric = employeeMetricsList.find(m => m.user.id === team.leadId);
                const squadMemberMetrics = members.filter(m => m.user.id !== team.leadId);

                return (
                  <div
                    key={team.id}
                    className="p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-5 relative"
                  >
                    {/* Top Tree Node: Squad Level */}
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleTeam(team.id)}
                          className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                          title={isExpanded ? 'Collapse squad tree' : 'Expand squad tree'}
                        >
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-900">{team.name}</h3>
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                              {members.length} Engineers
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{team.description}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold text-slate-800 block">
                          {totalTeamTasks} Tasks Tracked
                        </span>
                        <span className="text-[10px] text-emerald-700 font-bold">
                          {totalTeamResolved} Resolved Deliverables
                        </span>
                      </div>
                    </div>

                    {/* Top Squad Contributor Highlight Pill */}
                    {topSquadContributor && (
                      <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 via-amber-100/60 to-emerald-50 border border-amber-200 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Crown className="h-4 w-4 text-amber-600 shrink-0" />
                          <div>
                            <span className="text-[10px] uppercase font-bold text-amber-900 block">
                              Top Squad Contributor
                            </span>
                            <span className="text-xs font-bold text-slate-900">
                              {topSquadContributor.user.name} ({topSquadContributor.user.title || 'Specialist'})
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-extrabold text-amber-900 block">
                            {topSquadContributor.squadContributionPct}% of Squad Output
                          </span>
                          <span className="text-[10px] text-emerald-700 font-bold">
                            {topSquadContributor.resolvedTasks.length} tasks resolved
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Expandable Hierarchy Nodes with Tree Connectors */}
                    {isExpanded && (
                      <div className="space-y-5 pt-2">
                        {/* Branch Level 1: Squad Leader Node */}
                        {teamLeaderMetric && (
                          <div className="pl-4 border-l-2 border-emerald-400 space-y-2">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                              <Shield className="h-3 w-3 text-emerald-600" />
                              <span>Squad Leader Branch (Architecture & Review)</span>
                            </div>
                            <div
                              onClick={() => setSelectedEmployee(teamLeaderMetric)}
                              className="p-4 rounded-2xl bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-3">
                                <UserAvatar
                                  src={teamLeaderMetric.user.avatar}
                                  name={teamLeaderMetric.user.name}
                                  role="lead"
                                  size="md"
                                  showVectorBadge={true}
                                />
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-xs text-slate-900 group-hover:text-emerald-950">
                                      {teamLeaderMetric.user.name}
                                    </span>
                                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-700 text-white uppercase">
                                      Leader
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-500">{teamLeaderMetric.user.title}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/60 px-1.5 py-0.2 rounded">
                                      Level {teamLeaderMetric.level} • {teamLeaderMetric.currentXP} XP
                                    </span>
                                    <span className="text-[10px] text-slate-500">
                                      Contributes {teamLeaderMetric.squadContributionPct}% of squad tasks
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <div className="flex items-center gap-1 justify-end">
                                    <Trophy className="h-3.5 w-3.5 text-amber-500" />
                                    <span className="text-xs font-bold text-slate-900">
                                      {teamLeaderMetric.resolvedTasks.length} Done
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-emerald-700 font-semibold">
                                    {teamLeaderMetric.completionRate}% completion
                                  </span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Branch Level 2: Squad Members Leaf Nodes */}
                        <div className="pl-4 border-l-2 border-slate-300 space-y-3">
                          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            <div className="flex items-center gap-1.5">
                              <UserCheck className="h-3 w-3 text-slate-400" />
                              <span>Squad Engineers & Contributors ({squadMemberMetrics.length})</span>
                            </div>
                            <span className="text-slate-400 font-normal">Click card to inspect dossier</span>
                          </div>

                          <div className="space-y-2">
                            {squadMemberMetrics.map(memberMetric => (
                              <div
                                key={memberMetric.user.id}
                                onClick={() => setSelectedEmployee(memberMetric)}
                                className={`p-3 rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all cursor-pointer group ${
                                  treeDensity === 'compact' ? 'py-2' : 'py-3'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-3">
                                    <UserAvatar
                                      src={memberMetric.user.avatar}
                                      name={memberMetric.user.name}
                                      size="sm"
                                    />
                                    <div>
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                                          {memberMetric.user.name}
                                        </span>
                                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                                          Lvl {memberMetric.level}
                                        </span>
                                      </div>
                                      <p className="text-[10px] text-slate-400">
                                        {memberMetric.user.title || memberMetric.user.department}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4">
                                    <div className="hidden sm:block text-right">
                                      <div className="flex items-center gap-1 justify-end text-[11px] font-bold text-slate-800">
                                        <span>{memberMetric.squadContributionPct}%</span>
                                        <span className="text-[10px] text-slate-400 font-normal">of squad</span>
                                      </div>
                                      <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-0.5">
                                        <div
                                          className="h-full bg-emerald-500 rounded-full"
                                          style={{ width: `${Math.min(100, memberMetric.squadContributionPct)}%` }}
                                        />
                                      </div>
                                    </div>

                                    <div className="text-right">
                                      <span className="text-xs font-extrabold text-slate-800 block">
                                        {memberMetric.resolvedTasks.length} resolved
                                      </span>
                                      <span className="text-[10px] text-slate-400">
                                        {memberMetric.inProgressTasks.length} in progress
                                      </span>
                                    </div>

                                    <div className="hidden md:flex items-center gap-0.5">
                                      {memberMetric.achievements.filter(a => a.unlocked).slice(0, 3).map(a => (
                                        <span key={a.id} title={a.title} className="text-sm">
                                          {a.icon}
                                        </span>
                                      ))}
                                    </div>

                                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: INTERACTIVE BAR GRAPH VIEW                                        */}
      {/* ========================================================================= */}
      {viewMode === 'bar' && (
        <div className="space-y-6">
          {/* SUB-MODE 1: COMPARATIVE MEMBER WORKLOAD & CONTRIBUTION BAR CHART */}
          {barSubMode === 'comparison' && (
            <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Comparative Member Contribution Bar Graph ({filteredMetrics.length} Members)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Direct comparison of completed work, active sprint tasks, and individual contribution percentage.
                  </p>
                </div>
                {/* Graph Legend */}
                <div className="flex items-center gap-3 text-[11px] font-semibold flex-wrap">
                  <span className="flex items-center gap-1.5 text-emerald-800">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Resolved Tasks
                  </span>
                  <span className="flex items-center gap-1.5 text-purple-800">
                    <span className="h-2.5 w-2.5 rounded-full bg-purple-500" /> Awaiting Review
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-800">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> In Progress
                  </span>
                  <span className="flex items-center gap-1.5 text-indigo-800">
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" /> Claimed / Assigned
                  </span>
                </div>
              </div>

              {/* Stacked Comparative Bars List */}
              <div className="space-y-4">
                {filteredMetrics.map(metric => {
                  const total = metric.totalWorkload || 1;
                  const resolvedPct = Math.round((metric.resolvedTasks.length / total) * 100);
                  const reviewPct = Math.round((metric.awaitingApprovalTasks.length / total) * 100);
                  const progressPct = Math.round((metric.inProgressTasks.length / total) * 100);
                  const assignedPct = Math.max(0, 100 - (resolvedPct + reviewPct + progressPct));

                  return (
                    <div
                      key={metric.user.id}
                      onClick={() => setSelectedEmployee(metric)}
                      className="p-4 rounded-2xl bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
                    >
                      {/* Top Header of Card */}
                      <div className="flex items-center justify-between gap-4 mb-2.5">
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            src={metric.user.avatar}
                            name={metric.user.name}
                            size="sm"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-slate-900 group-hover:text-emerald-900">
                                {metric.user.name}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                                {metric.contributorTier}
                              </span>
                              {metric.teamsLeading.length > 0 && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-white uppercase">
                                  Lead
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500">
                              {metric.user.title || metric.user.department} • {metric.primaryTeam ? metric.primaryTeam.name : 'Unassigned'}
                            </p>
                          </div>
                        </div>

                        {/* Contribution Score Chips */}
                        <div className="flex items-center gap-4 text-right">
                          <div>
                            <div className="flex items-center gap-1 justify-end">
                              <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                              <span className="text-xs font-extrabold text-slate-900">
                                {metric.currentXP} XP
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-700">
                              {metric.squadContributionPct}% Squad Contribution
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            {metric.achievements.filter(a => a.unlocked).slice(0, 3).map(a => (
                              <span key={a.id} title={a.title} className="text-sm">
                                {a.icon}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Visual Stacked Bar Graph Bar */}
                      <div className="h-4 w-full rounded-full bg-slate-200 overflow-hidden flex shadow-inner">
                        {metric.resolvedTasks.length > 0 && (
                          <div
                            style={{ width: `${resolvedPct}%` }}
                            className="bg-emerald-500 hover:bg-emerald-400 h-full transition-all duration-500 flex items-center justify-center text-[9px] font-bold text-white"
                            title={`Resolved: ${metric.resolvedTasks.length} tasks (${resolvedPct}%)`}
                          >
                            {resolvedPct > 15 && `${resolvedPct}%`}
                          </div>
                        )}
                        {metric.awaitingApprovalTasks.length > 0 && (
                          <div
                            style={{ width: `${reviewPct}%` }}
                            className="bg-purple-500 hover:bg-purple-400 h-full transition-all duration-500 flex items-center justify-center text-[9px] font-bold text-white"
                            title={`Awaiting Review: ${metric.awaitingApprovalTasks.length} tasks (${reviewPct}%)`}
                          >
                            {reviewPct > 15 && `${reviewPct}%`}
                          </div>
                        )}
                        {metric.inProgressTasks.length > 0 && (
                          <div
                            style={{ width: `${progressPct}%` }}
                            className="bg-amber-500 hover:bg-amber-400 h-full transition-all duration-500 flex items-center justify-center text-[9px] font-bold text-white"
                            title={`In Progress: ${metric.inProgressTasks.length} tasks (${progressPct}%)`}
                          >
                            {progressPct > 15 && `${progressPct}%`}
                          </div>
                        )}
                        {metric.newTasks.length > 0 && (
                          <div
                            style={{ width: `${assignedPct}%` }}
                            className="bg-indigo-500 hover:bg-indigo-400 h-full transition-all duration-500 flex items-center justify-center text-[9px] font-bold text-white"
                            title={`Assigned: ${metric.newTasks.length} tasks (${assignedPct}%)`}
                          >
                            {assignedPct > 15 && `${assignedPct}%`}
                          </div>
                        )}
                      </div>

                      {/* Bar Micro Labels Below */}
                      <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500">
                        <div className="flex items-center gap-3">
                          <span>Resolved: <strong className="text-emerald-700">{metric.resolvedTasks.length}</strong></span>
                          <span>In Review: <strong className="text-purple-700">{metric.awaitingApprovalTasks.length}</strong></span>
                          <span>In Progress: <strong className="text-amber-700">{metric.inProgressTasks.length}</strong></span>
                          <span>Total: <strong>{metric.totalWorkload}</strong></span>
                        </div>
                        <span className="group-hover:text-emerald-800 font-semibold flex items-center gap-0.5">
                          <span>Inspect achievements & work history</span>
                          <ChevronRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SUB-MODE 2: SQUAD SHARE % BAR CHART */}
          {barSubMode === 'squad-share' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 shadow-xs">
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Squad Output Share Bar Charts
                </h3>
                <p className="text-xs text-slate-500 mb-5">
                  See how output is distributed among squad members. Directly identifies who carries the largest deliverable volume.
                </p>

                <div className="space-y-6">
                  {squadAggregates.map(({ team, members, totalTeamTasks }) => {
                    return (
                      <div key={team.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900">{team.name}</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                              {totalTeamTasks} total workload
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 font-medium">Lead: {team.lead.name}</span>
                        </div>

                        {/* Segmented Team Output Bar */}
                        <div className="h-6 w-full rounded-xl bg-slate-200 overflow-hidden flex shadow-inner">
                          {members.map((member, idx) => {
                            const colors = [
                              'bg-emerald-500',
                              'bg-teal-500',
                              'bg-cyan-500',
                              'bg-indigo-500',
                              'bg-purple-500',
                              'bg-amber-500',
                              'bg-rose-500',
                            ];
                            const color = colors[idx % colors.length];
                            const memberPct = Math.round((member.totalWorkload / totalTeamTasks) * 100);
                            if (memberPct === 0) return null;
                            return (
                              <div
                                key={member.user.id}
                                style={{ width: `${memberPct}%` }}
                                className={`${color} h-full flex items-center justify-center text-[10px] font-bold text-white transition-all hover:opacity-90 cursor-pointer`}
                                title={`${member.user.name}: ${member.totalWorkload} tasks (${memberPct}%)`}
                                onClick={() => setSelectedEmployee(member)}
                              >
                                {memberPct > 10 && `${member.user.name.split(' ')[0]} ${memberPct}%`}
                              </div>
                            );
                          })}
                        </div>

                        {/* Member Contribution Chips */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {members.map(member => (
                            <div
                              key={member.user.id}
                              onClick={() => setSelectedEmployee(member)}
                              className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 flex items-center gap-2 cursor-pointer transition-colors"
                            >
                              <UserAvatar
                                src={member.user.avatar}
                                name={member.user.name}
                                size="xs"
                              />
                              <span className="text-xs font-semibold text-slate-800">{member.user.name}</span>
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                                {member.squadContributionPct}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SUB-MODE 3: GAMIFIED LEADERBOARD PODIUM & VELOCITY RACE */}
          {barSubMode === 'podium' && (
            <div className="space-y-6">
              {/* Podium Visual Top 3 */}
              <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-850 text-white shadow-xl border border-slate-800 backdrop-blur-xl">
                <div className="text-center mb-8">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Netwonite Engineering Champions
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-1">Velocity & Achievement Podium</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Top contributors ranked by sprint output and earned achievements</p>
                </div>

                <div className="flex items-end justify-center gap-3 sm:gap-6 pt-6 pb-2 max-w-2xl mx-auto">
                  {/* 2nd Place */}
                  {podiumWinners[1] && (
                    <div
                      onClick={() => setSelectedEmployee(podiumWinners[1])}
                      className="flex flex-col items-center cursor-pointer group w-28 sm:w-36"
                    >
                      <div className="text-center mb-2">
                        <span className="text-xl">🥈</span>
                        <div className="flex justify-center my-1">
                          <UserAvatar
                            src={podiumWinners[1].user.avatar}
                            name={podiumWinners[1].user.name}
                            size="lg"
                            className="ring-2 ring-slate-300 shadow-lg mx-auto"
                          />
                        </div>
                        <span className="text-xs font-bold text-white mt-1 block truncate">
                          {podiumWinners[1].user.name}
                        </span>
                        <span className="text-[10px] text-slate-300 font-semibold">
                          {podiumWinners[1].currentXP} XP
                        </span>
                      </div>
                      <div className="w-full h-24 bg-gradient-to-t from-slate-700 to-slate-600 rounded-t-2xl flex items-center justify-center font-extrabold text-2xl text-slate-300 shadow-md border-t border-slate-400">
                        2
                      </div>
                    </div>
                  )}

                  {/* 1st Place */}
                  {podiumWinners[0] && (
                    <div
                      onClick={() => setSelectedEmployee(podiumWinners[0])}
                      className="flex flex-col items-center cursor-pointer group w-32 sm:w-44"
                    >
                      <div className="text-center mb-2">
                        <Crown className="h-6 w-6 text-amber-400 mx-auto animate-bounce" />
                        <div className="flex justify-center my-1">
                          <UserAvatar
                            src={podiumWinners[0].user.avatar}
                            name={podiumWinners[0].user.name}
                            size="xl"
                            showVectorBadge={true}
                            role="lead"
                            className="ring-4 ring-amber-400 shadow-xl shadow-amber-500/20 mx-auto"
                          />
                        </div>
                        <span className="text-sm font-extrabold text-amber-200 mt-1 block truncate">
                          {podiumWinners[0].user.name}
                        </span>
                        <span className="text-xs text-amber-400 font-bold">
                          {podiumWinners[0].currentXP} XP • Rank 1
                        </span>
                      </div>
                      <div className="w-full h-32 bg-gradient-to-t from-amber-600 to-amber-500 rounded-t-2xl flex items-center justify-center font-extrabold text-3xl text-slate-950 shadow-xl border-t border-amber-300">
                        1
                      </div>
                    </div>
                  )}

                  {/* 3rd Place */}
                  {podiumWinners[2] && (
                    <div
                      onClick={() => setSelectedEmployee(podiumWinners[2])}
                      className="flex flex-col items-center cursor-pointer group w-28 sm:w-36"
                    >
                      <div className="text-center mb-2">
                        <span className="text-xl">🥉</span>
                        <div className="flex justify-center my-1">
                          <UserAvatar
                            src={podiumWinners[2].user.avatar}
                            name={podiumWinners[2].user.name}
                            size="lg"
                            className="ring-2 ring-amber-700 shadow-lg mx-auto"
                          />
                        </div>
                        <span className="text-xs font-bold text-white mt-1 block truncate">
                          {podiumWinners[2].user.name}
                        </span>
                        <span className="text-[10px] text-slate-300 font-semibold">
                          {podiumWinners[2].currentXP} XP
                        </span>
                      </div>
                      <div className="w-full h-16 bg-gradient-to-t from-amber-800 to-amber-700 rounded-t-2xl flex items-center justify-center font-extrabold text-xl text-amber-200 shadow-md border-t border-amber-600">
                        3
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Leaderboard Table */}
              <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 shadow-xs">
                <h4 className="font-bold text-sm text-slate-900 mb-4">Complete Employee Velocity Standings</h4>
                <div className="space-y-2">
                  {[...employeeMetricsList]
                    .sort((a, b) => b.velocityScore - a.velocityScore)
                    .map((metric, rank) => (
                      <div
                        key={metric.user.id}
                        onClick={() => setSelectedEmployee(metric)}
                        className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`h-7 w-7 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 ${
                              rank === 0
                                ? 'bg-amber-400 text-slate-900 ring-2 ring-amber-300'
                                : rank === 1
                                ? 'bg-slate-300 text-slate-900'
                                : rank === 2
                                ? 'bg-amber-700 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {rank + 1}
                          </span>
                          <UserAvatar
                            src={metric.user.avatar}
                            name={metric.user.name}
                            size="sm"
                          />
                          <div>
                            <span className="font-bold text-xs text-slate-900 group-hover:text-emerald-800">
                              {metric.user.name}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {metric.user.title || metric.user.department}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-xs font-extrabold text-slate-900 block">
                              {metric.currentXP} XP
                            </span>
                            <span className="text-[10px] text-emerald-700 font-bold">
                              {metric.resolvedTasks.length} tasks resolved
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {metric.achievements.filter(a => a.unlocked).map(a => (
                              <span key={a.id} title={a.title} className="text-sm">
                                {a.icon}
                              </span>
                            ))}
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* DETAILED EMPLOYEE CONTRIBUTION & ACHIEVEMENTS DOSSIER MODAL               */}
      {/* ========================================================================= */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl transition-opacity animate-in fade-in"
            onClick={() => setSelectedEmployee(null)}
          />
          <div className="relative w-full max-w-3xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl z-10 border border-white/80 space-y-6 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <UserAvatar
                    src={selectedEmployee.user.avatar}
                    name={selectedEmployee.user.name}
                    size="xl"
                    showVectorBadge={true}
                    role={selectedEmployee.teamsLeading.length > 0 ? 'lead' : 'member'}
                    className="ring-2 ring-emerald-500 shadow-md"
                  />
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-slate-900 text-white text-[9px] font-bold">
                    Lvl {selectedEmployee.level}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold text-slate-900">{selectedEmployee.user.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      {selectedEmployee.contributorTier}
                    </span>
                    {selectedEmployee.teamsLeading.length > 0 && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                        Squad Leader
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedEmployee.user.email} • {selectedEmployee.user.title || selectedEmployee.user.department}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setBadgeTargetUserId(selectedEmployee.user.id);
                    setIsGrantBadgeOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Award className="h-3.5 w-3.5" />
                  <span>Award Badge</span>
                </button>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Contribution Breakdown Grid */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2.5">
                Real-Time Contribution Breakdown
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] font-bold uppercase text-amber-800">Squad Share %</span>
                  <div className="text-2xl font-extrabold text-amber-950 mt-0.5">
                    {selectedEmployee.squadContributionPct}%
                  </div>
                  <span className="text-[9px] text-amber-700">of squad deliverables</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] font-bold uppercase text-emerald-800">Tasks Resolved</span>
                  <div className="text-2xl font-extrabold text-emerald-950 mt-0.5">
                    {selectedEmployee.resolvedTasks.length}
                  </div>
                  <span className="text-[9px] text-emerald-700">{selectedEmployee.completionRate}% completion rate</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200">
                  <span className="text-[10px] font-bold uppercase text-teal-800">Velocity XP</span>
                  <div className="text-2xl font-extrabold text-teal-950 mt-0.5">
                    {selectedEmployee.currentXP}
                  </div>
                  <span className="text-[9px] text-teal-700">Level {selectedEmployee.level} Contributor</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200">
                  <span className="text-[10px] font-bold uppercase text-purple-800">Sprint Backlog</span>
                  <div className="text-2xl font-extrabold text-purple-950 mt-0.5">
                    {selectedEmployee.inProgressTasks.length + selectedEmployee.awaitingApprovalTasks.length}
                  </div>
                  <span className="text-[9px] text-purple-700">Active tasks in flight</span>
                </div>
              </div>
            </div>

            {/* Achievements & Badges Showcase */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <span>Earned Achievements & Badges ({selectedEmployee.achievements.filter(a => a.unlocked).length}/{selectedEmployee.achievements.length})</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-bold">
                  {selectedEmployee.contributorTier}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedEmployee.achievements.map(ach => (
                  <div
                    key={ach.id}
                    className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
                      ach.unlocked
                        ? 'bg-gradient-to-r from-white to-amber-50/40 border-amber-200/90 shadow-2xs'
                        : 'bg-slate-50/60 border-slate-200 opacity-60'
                    }`}
                  >
                    <span className="text-2xl shrink-0 mt-0.5">{ach.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-xs text-slate-900">{ach.title}</h5>
                        {ach.unlocked ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 uppercase">
                            Unlocked
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-600 uppercase">
                            Locked
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug mt-0.5">{ach.description}</p>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                        Criteria: {ach.progress}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Items History */}
            <div>
              <div className="flex items-center justify-between mb-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <span>Assigned Tasks & Sprint Milestones ({selectedEmployee.assignedTasks.length})</span>
              </div>
              {selectedEmployee.assignedTasks.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">No tasks assigned to this employee yet.</p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {selectedEmployee.assignedTasks.map(t => (
                    <div
                      key={t.id}
                      onClick={() => {
                        setSelectedEmployee(null);
                        onNavigate('task-details', { taskId: t.id });
                      }}
                      className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div className="truncate pr-2">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <PriorityBadge priority={t.priority} size="sm" />
                          <StatusBadge status={t.status} size="sm" />
                        </div>
                        <p className="text-xs font-semibold text-slate-800 group-hover:text-emerald-800 truncate">
                          {t.title}
                        </p>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-700 shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FEATURE MODAL: GRANT CUSTOM RECOGNITION BADGE                             */}
      {/* ========================================================================= */}
      {isGrantBadgeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl"
            onClick={() => setIsGrantBadgeOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl z-10 border border-white/80 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Award Employee Recognition</h3>
                  <p className="text-xs text-slate-500">Grant an official badge with +50 XP bonus</p>
                </div>
              </div>
              <button
                onClick={() => setIsGrantBadgeOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleGrantBadgeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Recipient Employee *
                </label>
                <select
                  value={badgeTargetUserId}
                  onChange={e => setBadgeTargetUserId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                >
                  {employeeMetricsList.map(emp => (
                    <option key={emp.user.id} value={emp.user.id}>
                      {emp.user.name} ({emp.primaryTeam?.name || 'Engineer'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Select Badge Icon *
                </label>
                <div className="flex items-center gap-2">
                  {['🏆', '🌟', '🛡️', '🚀', '⚡', '💎', '👑', '🔥'].map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setBadgeIcon(emoji)}
                      className={`h-9 w-9 rounded-xl border text-lg flex items-center justify-center transition-all cursor-pointer ${
                        badgeIcon === emoji
                          ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-400/30 scale-110'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Badge Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Velocity Vanguard, Reliability Titan..."
                  value={badgeTitle}
                  onChange={e => setBadgeTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Commendation Reason *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Outstanding delivery on zero-downtime microservice migration..."
                  value={badgeReason}
                  onChange={e => setBadgeReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsGrantBadgeOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGranting}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" />
                  <span>{isGranting ? 'Awarding...' : 'Award Badge & +50 XP'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
