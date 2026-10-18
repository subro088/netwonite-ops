import React, { useState, useEffect } from 'react';
import { api } from '../services/api.ts';
import { Task } from '../types/index.ts';
import { TaskCard } from '../components/tasks/TaskCard.tsx';
import { Flame } from 'lucide-react';

interface HighPriorityPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const HighPriorityPage: React.FC<HighPriorityPageProps> = ({ onNavigate }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const data = await api.getTasks({ filter: 'priority', limit: 30 });
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
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-rose-100 text-rose-800 border border-rose-200">
              Critical Urgency
            </span>
            <span className="text-xs text-slate-400">Escalations</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">High-Priority Tasks</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Focused view of all tasks designated with High or Urgent priority across the workspace.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="p-16 text-center text-xs text-slate-400">Loading priority tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-white/60 border border-white/60">
          <Flame className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No high-priority tasks</p>
          <p className="text-xs text-slate-400 mt-1">There are no urgent or high-priority blockers at this moment.</p>
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
    </div>
  );
};
