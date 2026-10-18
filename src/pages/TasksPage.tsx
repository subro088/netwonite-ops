import React, { useState, useEffect } from 'react';
import { api } from '../services/api.ts';
import { Task, Team } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { TaskCard } from '../components/tasks/TaskCard.tsx';
import { CreateTaskModal } from '../components/tasks/CreateTaskModal.tsx';
import { ListTodo, PlusCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface TasksPageProps {
  onNavigate: (page: string, params?: any) => void;
  initialFilter?: string;
}

export const TasksPage: React.FC<TasksPageProps> = ({ onNavigate, initialFilter = 'all' }) => {
  const { isLeader, isAdmin } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [filter, setFilter] = useState<string>(initialFilter);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    api.getTeams().then(res => setTeams(res.teams)).catch(console.error);
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const data = await api.getTasks({
        filter: filter !== 'all' ? filter : undefined,
        teamId: selectedTeam || undefined,
        priority: selectedPriority !== 'all' ? selectedPriority : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        search: search.trim() || undefined,
        page,
        limit: 9,
      });
      setTasks(data.tasks);
      setTotalPages(data.pagination.totalPages);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter, selectedTeam, selectedPriority, selectedStatus, search, page]);

  const handleClaim = async (taskId: string) => {
    try {
      await api.claimTask(taskId);
      fetchTasks();
    } catch (err: any) {
      alert(err.message || 'Failed to claim task');
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.deleteTask(taskId);
      fetchTasks();
    } catch (err: any) {
      alert(err.message || 'Failed to delete task');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-teal-100 text-teal-800 border border-teal-200">
              Backlog & Sprints
            </span>
            <span className="text-xs text-slate-400">Work Items</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Work Items / Tasks</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Browse, filter, claim, and monitor tasks across all squads and cross-team workflows.
          </p>
        </div>
        {(isLeader || isAdmin) && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-teal-700/20 transition-all cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create Task</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-white/70 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, description, team, or assignee..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedTeam}
            onChange={e => {
              setSelectedTeam(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            <option value="">All Teams</option>
            {teams.map(t => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <select
            value={selectedPriority}
            onChange={e => {
              setSelectedPriority(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            <option value="all">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
          <select
            value={selectedStatus}
            onChange={e => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            <option value="all">All Statuses</option>
            <option value="New">New (Claimable)</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Awaiting Approval">Awaiting Approval</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Task Grid */}
      {isLoading ? (
        <div className="p-16 text-center text-xs text-slate-400">Loading work items...</div>
      ) : tasks.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-white/60 border border-white/60">
          <ListTodo className="h-8 w-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No work items found</p>
          <p className="text-xs text-slate-400 mt-1">Try modifying your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onViewDetails={id => onNavigate('task-details', { taskId: id })}
              onClaim={handleClaim}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200/80">
          <span className="text-xs text-slate-500">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={fetchTasks}
      />
    </div>
  );
};
