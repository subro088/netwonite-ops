import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { Task } from '../types/index.ts';
import { TaskCard } from '../components/tasks/TaskCard.tsx';
import { CreateTaskModal } from '../components/tasks/CreateTaskModal.tsx';
import { UserAvatar } from '../components/common/UserAvatar.tsx';
import {
  Users2,
  Clock,
  PlusCircle,
  Search,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface EmployeeDashboardProps {
  onNavigate: (page: string, params?: any) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ onNavigate }) => {
  const { user, teamsLeading, teamsMemberOf } = useAuth();
  const [activeTab, setActiveTab] = useState<'assigned' | 'priority' | 'approvals' | 'ongoing' | 'completed' | 'all'>('assigned');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [counts, setCounts] = useState<{
    assignedToMe: number;
    priority: number;
    awaitingApproval: number;
    all?: number;
    ongoing?: number;
    completed?: number;
  }>({
    assignedToMe: 0,
    priority: 0,
    awaitingApproval: 0,
    all: 0,
    ongoing: 0,
    completed: 0,
  });

  const isLeader = teamsLeading.length > 0;

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const data = await api.getTasks({
        filter: activeTab === 'all' ? undefined : activeTab,
        limit: 60,
      });
      setCounts(data.counts);
      setTasks(data.tasks);
    } catch (err: any) {
      console.error('Error fetching employee dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const filteredTasks = tasks.filter(t => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return (
      t.title.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      (t.sourceTeam && t.sourceTeam.name.toLowerCase().includes(query)) ||
      (t.destinationTeam && t.destinationTeam.name.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6">
      {/* Welcome Header Banner */}
      <div className="liquid-glass-card liquid-sheen-sweep p-6 sm:p-7 relative overflow-hidden group">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <UserAvatar
              src={user?.avatar}
              name={user?.name}
              role={isLeader ? 'leader' : 'employee'}
              size="xl"
              showVectorBadge={true}
              hoverEffect={true}
              onClick={() => onNavigate('profile')}
              className="ring-4 ring-emerald-500/20 shadow-lg cursor-pointer"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Workspace
                </span>
                <span className="text-xs text-slate-400 font-semibold">Active Vector Session</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Welcome back, {user?.name.split(' ')[0]} 👋
              </h1>
              <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
                Track team velocity, claim unassigned squad tasks, resolve ongoing work, and initiate cross-team approvals.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => onNavigate('tasks')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-200/80 transition-all cursor-pointer shadow-xs hover:-translate-y-0.5 active:translate-y-0"
            >
              <Layers className="h-3.5 w-3.5 text-slate-500" />
              <span>Browse All Tasks</span>
            </button>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 hover:from-emerald-500 hover:to-cyan-600 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Leader Summary */}
        <div
          onClick={() => isLeader ? onNavigate('my-team-leader') : onNavigate('tasks')}
          className="liquid-glass-card liquid-sheen-sweep p-5 cursor-pointer group bg-gradient-to-br from-emerald-50/80 via-white/90 to-teal-50/60 border border-emerald-200/70"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">I Am a Leader</h3>
                <p className="text-[11px] text-slate-500">
                  {isLeader
                    ? `${teamsLeading.map(t => t.name).join(', ')} Squad`
                    : 'Not leading any squad currently'}
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-emerald-100">
            <div>
              <span className="text-[11px] text-slate-500 font-medium">Pending Approvals</span>
              <div className="text-2xl font-black text-slate-900 tabular-nums">
                {counts.awaitingApproval}
              </div>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium">Squads Led</span>
              <div className="text-2xl font-black text-slate-900 tabular-nums">
                {teamsLeading.length}
              </div>
            </div>
          </div>
        </div>

        {/* Member Summary */}
        <div
          onClick={() => onNavigate('my-team-member')}
          className="liquid-glass-card liquid-sheen-sweep p-5 cursor-pointer group bg-gradient-to-br from-blue-50/80 via-white/90 to-indigo-50/60 border border-blue-200/70"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
                <Users2 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">I Am a Member</h3>
                <p className="text-[11px] text-slate-500">
                  {teamsMemberOf.length > 0
                    ? teamsMemberOf.map(t => t.name).join(', ')
                    : 'General Roster'}
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-blue-100">
            <div>
              <span className="text-[11px] text-slate-500 font-medium">Assigned to Me</span>
              <div className="text-2xl font-black text-slate-900 tabular-nums">
                {counts.assignedToMe}
              </div>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium">High Priority</span>
              <div className="text-2xl font-black text-amber-600 tabular-nums">
                {counts.priority}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Segmented Controls & Search Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
        <div className="p-1 rounded-2xl bg-slate-200/70 border border-slate-300/40 backdrop-blur-xl flex items-center gap-1 overflow-x-auto shadow-inner">
          <button
            onClick={() => setActiveTab('assigned')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all duration-200 whitespace-nowrap cursor-pointer ${
              activeTab === 'assigned'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            Assigned to Me ({counts.assignedToMe})
          </button>
          <button
            onClick={() => setActiveTab('priority')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all duration-200 whitespace-nowrap cursor-pointer ${
              activeTab === 'priority'
                ? 'bg-white text-amber-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            Priority Tasks ({counts.priority})
          </button>
          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all duration-200 whitespace-nowrap cursor-pointer ${
              activeTab === 'approvals'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            Awaiting Approval ({counts.awaitingApproval})
          </button>
          <button
            onClick={() => setActiveTab('ongoing')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all duration-200 whitespace-nowrap cursor-pointer ${
              activeTab === 'ongoing'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            Ongoing Work
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all duration-200 whitespace-nowrap cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            Completed Work
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all duration-200 whitespace-nowrap cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            All Items
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Task Grid & State */}
      {isLoading ? (
        <div className="p-16 text-center text-xs text-slate-400">Loading task items...</div>
      ) : filteredTasks.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white/70 border border-white/80 shadow-xs">
          <Clock className="h-8 w-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No tasks in this category</p>
          <p className="text-xs text-slate-400 mt-1">
            Browse other tabs or create a new task to assign to team members.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onViewDetails={(taskId) => onNavigate('task-details', { taskId })}
              onClaim={async (taskId) => {
                try {
                  await api.claimTask(taskId);
                  fetchDashboardData();
                } catch (err: any) {
                  alert(err.message || 'Failed to claim task');
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      {isCreateOpen && (
        <CreateTaskModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onCreated={fetchDashboardData}
        />
      )}
    </div>
  );
};
