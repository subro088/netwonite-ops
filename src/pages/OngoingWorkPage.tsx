import React, { useState, useEffect } from 'react';
import { api } from '../services/api.ts';
import { Task } from '../types/index.ts';
import { TaskCard } from '../components/tasks/TaskCard.tsx';
import { Clock, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { CreateTaskModal } from '../components/tasks/CreateTaskModal.tsx';

interface OngoingWorkPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const OngoingWorkPage: React.FC<OngoingWorkPageProps> = ({ onNavigate }) => {
  const { isLeader, isAdmin } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const data = await api.getTasks({ filter: 'ongoing', limit: 30 });
      setTasks(data.tasks);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleClaim = async (taskId: string) => {
    try {
      await api.claimTask(taskId);
      fetchTasks();
    } catch (err: any) {
      alert(err.message || 'Failed to claim task');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-100 text-amber-800 border border-amber-200">
              Active Sprints
            </span>
            <span className="text-xs text-slate-400">Execution in Flight</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Ongoing Work</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time feed of tasks in progress, assigned work, and submissions awaiting approval.
          </p>
        </div>
        {(isLeader || isAdmin) && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-700/20 transition-all cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create Task</span>
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="p-16 text-center text-xs text-slate-400">Loading active work...</div>
      ) : tasks.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-white/60 border border-white/60">
          <Clock className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No ongoing work right now</p>
          <p className="text-xs text-slate-400 mt-1">All current work items are either new or completed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onViewDetails={id => onNavigate('task-details', { taskId: id })}
              onClaim={handleClaim}
            />
          ))}
        </div>
      )}

      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={fetchTasks}
      />
    </div>
  );
};
