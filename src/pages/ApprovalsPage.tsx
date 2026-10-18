import React, { useState, useEffect } from 'react';
import { api } from '../services/api.ts';
import { ApprovalRequest } from '../types/index.ts';
import { PriorityBadge } from '../components/common/PriorityBadge.tsx';
import { UserAvatar } from '../components/common/UserAvatar.tsx';
import {
  CheckSquare,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Eye,
} from 'lucide-react';

interface ApprovalsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const ApprovalsPage: React.FC<ApprovalsPageProps> = ({ onNavigate }) => {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rejectingApprovalId, setRejectingApprovalId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchApprovals = async () => {
    setIsLoading(true);
    try {
      const data = await api.getApprovals();
      setApprovals(data.approvals);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleApprove = async (id: string, teamName: string) => {
    try {
      await api.approveAndDistribute(id);
      setFeedback(`Cross-team task approved and distributed to members of "${teamName}".`);
      setTimeout(() => setFeedback(null), 4000);
      fetchApprovals();
    } catch (err: any) {
      alert(err.message || 'Failed to approve task');
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingApprovalId || !rejectReason.trim()) return;
    try {
      await api.rejectApproval(rejectingApprovalId, rejectReason.trim());
      setRejectingApprovalId(null);
      setRejectReason('');
      setFeedback('Cross-team request rejected and archived in Rejections log.');
      setTimeout(() => setFeedback(null), 4000);
      fetchApprovals();
    } catch (err: any) {
      alert(err.message || 'Failed to reject request');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-purple-100 text-purple-800 border border-purple-200">
              Cross-Team Workflow
            </span>
            <span className="text-xs text-slate-400">Incoming Requests</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Approvals</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review incoming cross-team assignment requests, approve for distribution, or reject with cause.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="font-bold cursor-pointer">&times;</button>
        </div>
      )}

      {/* Approvals List */}
      {isLoading ? (
        <div className="p-16 text-center text-xs text-slate-400">Loading incoming requests...</div>
      ) : approvals.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-white/60 border border-white/60">
          <CheckSquare className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">All clear! No pending approvals</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            When another team leader dispatches work to your squad, cross-team authorization requests will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {approvals.map(req => (
            <div
              key={req.id}
              className="p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/70 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 text-purple-900 border border-purple-200/80 text-xs font-bold">
                    <span>{req.sourceTeam?.name}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-purple-500" />
                    <span>{req.destinationTeam?.name}</span>
                  </div>
                  <PriorityBadge priority={req.task.priority} size="sm" />
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-900 transition-colors">
                  {req.task.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 mt-2 leading-relaxed">
                  {req.task.description}
                </p>

                <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <UserAvatar
                      src={req.requestor?.avatar}
                      name={req.requestor?.name}
                      size="xs"
                    />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Initiated By</span>
                      <p className="font-bold text-slate-800">{req.requestor?.name}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onNavigate('task-details', { taskId: req.taskId })}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Inspect</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setRejectingApprovalId(req.id);
                      setRejectReason('');
                    }}
                    className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => handleApprove(req.id, req.destinationTeam?.name || 'your team')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Approve & Distribute</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectingApprovalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl"
            onClick={() => setRejectingApprovalId(null)}
          />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl z-10 border border-white/80 space-y-4 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900">Reject Cross-Team Assignment</h3>
            <p className="text-xs text-slate-500">
              Please specify the technical or policy reason for rejecting this incoming request.
            </p>
            <form onSubmit={handleReject} className="space-y-4">
              <textarea
                required
                rows={3}
                placeholder="Reason for rejection (e.g. Squad capacity exceeded, missing architecture spec)..."
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/30 resize-none"
              />
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRejectingApprovalId(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
