import React, { useState, useEffect } from 'react';
import { api } from '../services/api.ts';
import { Task, Comment, ActivityLog } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { StatusBadge } from '../components/common/StatusBadge.tsx';
import { PriorityBadge } from '../components/common/PriorityBadge.tsx';
import { UserAvatar } from '../components/common/UserAvatar.tsx';
import {
  ArrowLeft,
  Calendar,
  User,
  Shield,
  ArrowRight,
  MessageSquare,
  Activity,
  Send,
  ShieldCheck,
  Play,
  CheckCircle2,
  AlertCircle,
  Trash2,
} from 'lucide-react';

interface TaskDetailsPageProps {
  taskId: string;
  onNavigate: (page: string, params?: any) => void;
}

export const TaskDetailsPage: React.FC<TaskDetailsPageProps> = ({ taskId, onNavigate }) => {
  const { user } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [permissions, setPermissions] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewReason, setReviewReason] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchDetails = async () => {
    setIsLoading(true);
    setActionError(null);
    try {
      const data = await api.getTask(taskId);
      setTask(data.task);
      setComments(data.comments);
      setActivities(data.activities);
      setPermissions(data.permissions);
    } catch (err: any) {
      setActionError(err.message || 'Failed to load task details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [taskId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmittingComment(true);
    try {
      await api.addComment(taskId, newComment.trim());
      setNewComment('');
      fetchDetails();
    } catch (err: any) {
      alert(err.message || 'Failed to post comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleClaim = async () => {
    try {
      await api.claimTask(taskId);
      fetchDetails();
    } catch (err: any) {
      setActionError(err.message || 'Failed to claim task');
    }
  };

  const handleStartWork = async () => {
    try {
      await api.updateTaskStatus(taskId, 'In Progress');
      fetchDetails();
    } catch (err: any) {
      setActionError(err.message || 'Failed to start progress');
    }
  };

  const handleSubmitForReview = async () => {
    try {
      await api.submitForReview(taskId, submissionNotes.trim() || undefined);
      setShowSubmitModal(false);
      setSubmissionNotes('');
      fetchDetails();
    } catch (err: any) {
      setActionError(err.message || 'Failed to submit for review');
    }
  };

  const handleLeaderReview = async (decision: 'approve' | 'reject') => {
    try {
      await api.leaderReview(taskId, decision, reviewReason.trim() || undefined);
      setShowReviewModal(false);
      setReviewReason('');
      fetchDetails();
    } catch (err: any) {
      setActionError(err.message || 'Failed to complete review');
    }
  };

  const handleCloseTask = async () => {
    try {
      await api.updateTaskStatus(taskId, 'Closed', 'Task closed by leader.');
      fetchDetails();
    } catch (err: any) {
      setActionError(err.message || 'Failed to close task');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task permanently?')) return;
    try {
      await api.deleteTask(taskId);
      onNavigate('tasks');
    } catch (err: any) {
      setActionError(err.message || 'Failed to delete task');
    }
  };

  if (isLoading) {
    return <div className="p-16 text-center text-xs text-slate-400">Loading work item details...</div>;
  }

  if (!task) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white/70 border border-white/60">
        <AlertCircle className="h-8 w-8 text-rose-500 mx-auto mb-2" />
        <h3 className="text-base font-bold text-slate-800">Task Not Found</h3>
        <button
          onClick={() => onNavigate('tasks')}
          className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
        >
          Return to Backlog
        </button>
      </div>
    );
  }

  const isResolved = task.status === 'Resolved';

  return (
    <div className="space-y-6">
      {/* Top Navigation & Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('tasks')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white/80 hover:bg-white text-xs font-bold text-slate-700 transition-all shadow-xs cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Work Items</span>
        </button>
        {permissions.canDelete && (
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete Task</span>
          </button>
        )}
      </div>

      {actionError && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="font-bold">&times;</button>
        </div>
      )}

      {/* Main Task Header Card */}
      <div
        className={`p-6 sm:p-8 rounded-3xl backdrop-blur-2xl border shadow-md transition-all ${
          isResolved
            ? 'bg-gradient-to-br from-red-50/90 via-rose-50/80 to-white/95 border-red-300'
            : 'bg-white/90 border-white/70'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <PriorityBadge priority={task.priority} size="md" />
            <StatusBadge status={task.status} size="md" />
            {task.destinationTeam ? (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                <span>{task.sourceTeam?.name}</span>
                <ArrowRight className="h-3 w-3" />
                <span>{task.destinationTeam.name}</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {task.sourceTeam?.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            {task.dueDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>Due {task.dueDate}</span>
              </span>
            )}
            <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <h1
          className={`text-2xl font-bold tracking-tight mb-3 ${
            isResolved ? 'text-rose-950' : 'text-slate-900'
          }`}
        >
          {task.title}
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line mb-6">
          {task.description}
        </p>

        {task.reviewNotes && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs">
            <p className="font-bold uppercase tracking-wider mb-1">Review / Feedback Notes:</p>
            <p>{task.reviewNotes}</p>
          </div>
        )}

        {/* Life-cycle Stepper */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            Lifecycle Progress Flow
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
            {[
              { id: 'New', label: '1. New', sub: 'Open to Claim' },
              { id: 'Assigned', label: '2. Assigned', sub: 'Worker Claimed' },
              { id: 'In Progress', label: '3. In Progress', sub: 'Active Dev' },
              { id: 'Awaiting Approval', label: '4. Lead Review', sub: 'Pending Approval' },
              { id: 'Resolved', label: '5. Resolved', sub: 'Lead Approved' },
              { id: 'Closed', label: '6. Closed', sub: 'Archived' },
            ].map(step => {
              const statusOrder = ['New', 'Assigned', 'In Progress', 'Awaiting Approval', 'Resolved', 'Closed'];
              const currentIdx = statusOrder.indexOf(task.status);
              const stepIdx = statusOrder.indexOf(step.id);
              const isCurrent = task.status === step.id;
              const isPast = stepIdx < currentIdx;
              return (
                <div
                  key={step.id}
                  className={`p-2 rounded-xl transition-all border ${
                    isCurrent
                      ? step.id === 'Resolved'
                        ? 'bg-rose-100/90 border-rose-400 text-rose-950 font-bold shadow-xs'
                        : 'bg-emerald-100/90 border-emerald-400 text-emerald-950 font-bold shadow-xs'
                      : isPast
                      ? 'bg-slate-100 text-slate-500 border-slate-200 line-through opacity-80'
                      : 'bg-white/60 text-slate-400 border-slate-100'
                  }`}
                >
                  <p className="font-bold text-[11px] truncate">{step.label}</p>
                  <p className="text-[9px] text-slate-500 truncate mt-0.5">{step.sub}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Workflow Action Bar */}
        <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Current Workflow State:
            </span>
            <span className="text-xs font-bold text-slate-800">{task.status}</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {permissions.canClaim && (
              <button
                onClick={handleClaim}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Claim This Task</span>
              </button>
            )}

            {permissions.canStartWork && (
              <button
                onClick={handleStartWork}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <Play className="h-4 w-4" />
                <span>Start Work (In Progress)</span>
              </button>
            )}

            {permissions.canSubmitForReview && (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Submit for Lead Review</span>
              </button>
            )}

            {permissions.canReview && (
              <button
                onClick={() => setShowReviewModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <Shield className="h-4 w-4" />
                <span>Review Submission</span>
              </button>
            )}

            {task.status === 'Resolved' && (user?.role === 'admin' || task.sourceTeam?.leadId === user?.id) && (
              <button
                onClick={handleCloseTask}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <span>Close Task</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Meta Grid: Creator & Assignee */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-white/70 shadow-xs flex items-center gap-3">
          <UserAvatar
            src={task.creator?.avatar}
            name={task.creator?.name}
            role="member"
            size="md"
            showVectorBadge={true}
          />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Task Creator</span>
            <p className="text-sm font-bold text-slate-800">{task.creator?.name}</p>
            <p className="text-xs text-slate-500">{task.creator?.email}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-white/70 shadow-xs flex items-center gap-3">
          {task.assignee ? (
            <>
              <UserAvatar
                src={task.assignee.avatar}
                name={task.assignee.name}
                role="member"
                size="md"
                showVectorBadge={true}
              />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Assigned To</span>
                <p className="text-sm font-bold text-slate-800">{task.assignee.name}</p>
                <p className="text-xs text-slate-500">{task.assignee.email}</p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-slate-400 italic text-xs py-2">
              <User className="h-5 w-5" />
              <span>Unassigned (Open for eligible team members to claim)</span>
            </div>
          )}
        </div>
      </div>

      {/* Two Columns: Comments & Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <MessageSquare className="h-4 w-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Discussion & Notes ({comments.length})
              </h2>
            </div>

            <div className="mt-4 space-y-3 max-h-80 overflow-y-auto pr-1">
              {comments.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No comments yet. Start the conversation!</p>
              ) : (
                comments.map(c => (
                  <div key={c.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <UserAvatar
                          src={c.author?.avatar}
                          name={c.author?.name}
                          size="xs"
                        />
                        <span className="font-bold text-slate-800">{c.author?.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-600 pl-7 leading-relaxed">{c.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <form onSubmit={handleAddComment} className="pt-3 border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            <button
              type="submit"
              disabled={isSubmittingComment || !newComment.trim()}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Activity className="h-4 w-4 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Activity History Log ({activities.length})
            </h2>
          </div>
          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No logged activities for this task.</p>
            ) : (
              activities.map(act => (
                <div key={act.id} className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">{act.actor?.name}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(act.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-snug">{act.details}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal: Submit for Review */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={() => setShowSubmitModal(false)} />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl z-10 border border-white/80 space-y-4 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900">Submit Work for Lead Review</h3>
            <p className="text-xs text-slate-500">
              Provide summary notes or verification links for your team lead to evaluate.
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Unit tests passing, staging PR merged and smoke-tested..."
              value={submissionNotes}
              onChange={e => setSubmissionNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitForReview}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
              >
                Confirm Submission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Leader Review Decision */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={() => setShowReviewModal(false)} />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl z-10 border border-white/80 space-y-4 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900">Team Leader Review</h3>
            <p className="text-xs text-slate-500">
              Evaluate submission and approve to Resolved or send back for changes.
            </p>
            <textarea
              rows={3}
              placeholder="Feedback, comments, or required changes (required if requesting changes)..."
              value={reviewReason}
              onChange={e => setReviewReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            <div className="flex justify-between gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => handleLeaderReview('reject')}
                className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-bold"
              >
                Request Changes
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleLeaderReview('approve')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  Approve (Resolved)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
