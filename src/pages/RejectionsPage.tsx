import React, { useState, useEffect } from 'react';
import { api } from '../services/api.ts';
import { XCircle, ArrowRight, ShieldAlert } from 'lucide-react';

interface RejectionItem {
  id: string;
  type: string;
  taskId: string;
  taskTitle: string;
  sourceTeam: string;
  destinationTeam: string;
  requestorName: string;
  rejectorName: string;
  reason: string;
  timestamp: string;
}

interface RejectionsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const RejectionsPage: React.FC<RejectionsPageProps> = ({ onNavigate }) => {
  const [rejections, setRejections] = useState<RejectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getRejections()
      .then(res => setRejections(res.rejections))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-rose-100 text-rose-800 border border-rose-200">
              Audit & Compliance
            </span>
            <span className="text-xs text-slate-400">Rejection Logs</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Rejections</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit history of rejected cross-team requests and review feedback notes.
          </p>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="p-16 text-center text-xs text-slate-400">Loading rejections log...</div>
      ) : rejections.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-white/60 border border-white/60">
          <XCircle className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No rejections recorded</p>
          <p className="text-xs text-slate-400 mt-1">
            When an incoming request or submission is rejected with cause, details are cataloged here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {rejections.map(item => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white/85 backdrop-blur-md border border-rose-100/80 shadow-xs hover:border-rose-300 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800">
                      {item.type === 'cross_team' ? 'Cross-Team Rejected' : 'Review Feedback'}
                    </span>
                    {item.destinationTeam && (
                      <span className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                        <span>{item.sourceTeam}</span>
                        <ArrowRight className="h-3 w-3" />
                        <span>{item.destinationTeam}</span>
                      </span>
                    )}
                  </div>
                  <h3
                    onClick={() => item.taskId && onNavigate('task-details', { taskId: item.taskId })}
                    className="text-sm font-bold text-slate-900 hover:text-rose-700 cursor-pointer transition-colors"
                  >
                    {item.taskTitle}
                  </h3>
                </div>
                <div className="text-right text-[11px] text-slate-400 shrink-0">
                  <p>Rejected by <strong className="text-slate-700">{item.rejectorName}</strong></p>
                  <p>{new Date(item.timestamp).toLocaleString()}</p>
                </div>
              </div>

              {/* Reason Box */}
              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/60 text-xs text-rose-900 flex items-start gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
                <div>
                  <span className="font-bold uppercase tracking-wider text-[10px] block mb-0.5">
                    Reason / Technical Justification:
                  </span>
                  <p className="leading-relaxed">{item.reason}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
