import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Task } from '../../types/index.ts';
import {
  CheckCircle2,
  Clock,
  Activity,
  Layers,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
} from 'lucide-react';

interface TaskCompletionDonutWidgetProps {
  tasks: Task[];
  counts: {
    all?: number;
    assignedToMe: number;
    priority: number;
    awaitingApproval: number;
    ongoing?: number;
    completed?: number;
  };
  currentUserId?: string;
  onNavigate?: (page: string, params?: any) => void;
  onFilterTab?: (tab: 'assigned' | 'priority' | 'approvals' | 'ongoing' | 'completed' | 'all') => void;
}

interface ChartSegment {
  name: string;
  key: 'completed' | 'in_progress' | 'awaiting_approval' | 'pending';
  value: number;
  color: string;
  filterTab?: 'completed' | 'ongoing' | 'approvals' | 'assigned';
}

export const TaskCompletionDonutWidget: React.FC<TaskCompletionDonutWidgetProps> = ({
  tasks,
  counts,
  currentUserId,
  onNavigate,
  onFilterTab,
}) => {
  // Scope switcher: 'my' (tasks assigned to me) vs 'workspace' (all accessible tasks)
  const [scope, setScope] = useState<'my' | 'workspace'>('my');

  // Compute tasks according to active scope
  const scopedData = useMemo(() => {
    const relevantTasks = scope === 'my' && currentUserId
      ? tasks.filter(t => t.assigneeId === currentUserId)
      : tasks;

    let completed = 0;
    let inProgress = 0;
    let awaitingApproval = 0;
    let pending = 0;

    relevantTasks.forEach(t => {
      if (t.status === 'Resolved' || t.status === 'Closed') {
        completed += 1;
      } else if (t.status === 'In Progress') {
        inProgress += 1;
      } else if (t.status === 'Awaiting Approval') {
        awaitingApproval += 1;
      } else {
        pending += 1; // 'New' or 'Assigned'
      }
    });

    const total = relevantTasks.length;
    // Fallback to API counts if tasks array happens to be currently filtered or empty
    const resolvedTotal = total > 0 ? completed : (scope === 'my' ? (counts.completed || 0) : (counts.completed || 0));
    const effectiveTotal = total > 0 ? total : Math.max(1, (counts.all || (counts.completed || 0) + (counts.ongoing || 0)));

    const rate = effectiveTotal > 0 ? Math.round((resolvedTotal / effectiveTotal) * 100) : 0;

    const segments: ChartSegment[] = [
      {
        name: 'Completed',
        key: 'completed',
        value: completed,
        color: '#10b981', // Emerald 500
        filterTab: 'completed',
      },
      {
        name: 'In Progress',
        key: 'in_progress',
        value: inProgress,
        color: '#3b82f6', // Blue 500
        filterTab: 'ongoing',
      },
      {
        name: 'In Review',
        key: 'awaiting_approval',
        value: awaitingApproval,
        color: '#8b5cf6', // Violet 500
        filterTab: 'approvals',
      },
      {
        name: 'To Do / Pending',
        key: 'pending',
        value: pending,
        color: '#94a3b8', // Slate 400
        filterTab: 'assigned',
      },
    ];

    // Filter out zero-value segments for clean pie rendering, but keep at least 1 placeholder if all 0
    const activeSegments = segments.filter(s => s.value > 0);
    const displaySegments = activeSegments.length > 0 ? activeSegments : [
      { name: 'Pending Tasks', key: 'pending' as const, value: 1, color: '#e2e8f0' }
    ];

    return {
      total,
      completed,
      inProgress,
      awaitingApproval,
      pending,
      rate,
      segments,
      displaySegments,
      hasRealData: activeSegments.length > 0,
    };
  }, [tasks, scope, currentUserId, counts]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ChartSegment;
      const pct = scopedData.total > 0 ? Math.round((data.value / scopedData.total) * 100) : 0;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-2.5 rounded-xl border border-white/20 shadow-xl text-xs z-50 pointer-events-none">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span className="font-bold">{data.name}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-slate-300">
            <span>{data.value} {data.value === 1 ? 'task' : 'tasks'}</span>
            <span className="font-mono text-emerald-400 font-bold">{pct}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="liquid-glass-card liquid-sheen-sweep p-5 sm:p-6 bg-gradient-to-br from-white/95 via-slate-50/80 to-emerald-50/30 border border-slate-200/90 shadow-md">
      
      {/* Widget Header & Scope Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-sm">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Task Completion Velocity</h3>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200/70 uppercase tracking-wider">
                Analytics
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Live breakdown of sprint deliverables and resolution rates
            </p>
          </div>
        </div>

        {/* Scope Toggle Control */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 self-start sm:self-auto shadow-inner text-xs">
          <button
            type="button"
            onClick={() => setScope('my')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              scope === 'my'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Assigned to Me
          </button>
          <button
            type="button"
            onClick={() => setScope('workspace')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              scope === 'workspace'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Team Workspace
          </button>
        </div>
      </div>

      {/* Main Body: Donut Chart on Left, Metric Breakdown on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-5">
        
        {/* DONUT CHART CONTAINER (md:col-span-5) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-full max-w-[210px] h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={scopedData.displaySegments}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={56}
                  outerRadius={78}
                  paddingAngle={scopedData.hasRealData ? 4 : 0}
                  cornerRadius={scopedData.hasRealData ? 6 : 0}
                  stroke="rgba(255,255,255,0.85)"
                  strokeWidth={2}
                >
                  {scopedData.displaySegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Central Badge inside Donut Hole */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-3xl font-black text-slate-900 tracking-tight tabular-nums font-mono leading-none">
                {scopedData.rate}%
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">
                Completed
              </span>
            </div>
          </div>

          {/* Quick velocity status caption */}
          <div className="mt-2 text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
              <Sparkles className="h-3 w-3 text-emerald-600" />
              <span>
                {scopedData.rate >= 75
                  ? 'High Sprint Velocity'
                  : scopedData.rate >= 40
                  ? 'Active Sprint Execution'
                  : 'Cycle In Progress'}
              </span>
            </span>
          </div>
        </div>

        {/* METRIC BREAKDOWN & INTERACTIVE TILES (md:col-span-7) */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-4">
          
          {/* Key KPI Strip */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">Total In Scope</span>
              <span className="text-xl font-black text-slate-900 tabular-nums block mt-0.5">
                {scopedData.total}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 shadow-xs">
              <span className="text-[10px] font-semibold text-emerald-700 uppercase block">Resolved</span>
              <span className="text-xl font-black text-emerald-800 tabular-nums block mt-0.5">
                {scopedData.completed}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200/80 shadow-xs">
              <span className="text-[10px] font-semibold text-blue-700 uppercase block">In Flight</span>
              <span className="text-xl font-black text-blue-800 tabular-nums block mt-0.5">
                {scopedData.inProgress + scopedData.awaitingApproval}
              </span>
            </div>
          </div>

          {/* Detailed Category Bars with interactive click-through */}
          <div className="space-y-2 pt-1">
            {scopedData.segments.map(seg => {
              const pct = scopedData.total > 0 ? Math.round((seg.value / scopedData.total) * 100) : 0;
              return (
                <div
                  key={seg.key}
                  onClick={() => {
                    if (seg.filterTab && onFilterTab) {
                      onFilterTab(seg.filterTab);
                    }
                  }}
                  className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/70 hover:bg-white border border-slate-100 hover:border-slate-300 transition-all cursor-pointer group flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-[130px]">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: seg.color }}
                    />
                    <span className="text-xs font-bold text-slate-800 group-hover:text-slate-950 truncate">
                      {seg.name}
                    </span>
                  </div>

                  {/* Progress bar fill */}
                  <div className="flex-1 hidden sm:block h-2 rounded-full bg-slate-100 overflow-hidden mx-2">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: seg.color,
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-right">
                    <span className="text-xs font-mono font-bold text-slate-900 tabular-nums">
                      {seg.value}
                    </span>
                    <span className="text-[11px] font-mono font-medium text-slate-500 tabular-nums w-10">
                      {pct}%
                    </span>
                    <ArrowRight className="h-3 w-3 text-slate-300 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Action Footer Link */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <span>Click any category row to filter matching sprint tasks</span>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('completed-work')}
                className="font-bold text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Completed Ledger</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
