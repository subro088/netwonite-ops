import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Team, TaskPriority, AssignmentMethod } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { X, PlusCircle, AlertCircle, Send, Users, ArrowRightLeft, UserCheck } from 'lucide-react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  initialSourceTeamId?: string;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onCreated,
  initialSourceTeamId,
}) => {
  const { user, teamsLeading, isAdmin } = useAuth();
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [sourceTeamId, setSourceTeamId] = useState(initialSourceTeamId || '');
  const [assignmentMethod, setAssignmentMethod] = useState<AssignmentMethod>('my_team');
  const [destinationTeamId, setDestinationTeamId] = useState('');
  const [assignedMemberId, setAssignedMemberId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eligibleSourceTeams = isAdmin ? allTeams : teamsLeading;

  useEffect(() => {
    if (isOpen) {
      api.getTeams().then(data => {
        setAllTeams(data.teams);
        if (!sourceTeamId && eligibleSourceTeams.length > 0) {
          setSourceTeamId(eligibleSourceTeams[0].id);
        } else if (!sourceTeamId && data.teams.length > 0) {
          setSourceTeamId(data.teams[0].id);
        }
      });
    }
  }, [isOpen, eligibleSourceTeams.length, sourceTeamId]);

  useEffect(() => {
    if (initialSourceTeamId) {
      setSourceTeamId(initialSourceTeamId);
    }
  }, [initialSourceTeamId]);

  if (!isOpen) return null;

  const currentSourceTeam = allTeams.find(t => t.id === sourceTeamId);
  const destinationTeams = allTeams.filter(t => t.id !== sourceTeamId);
  const currentTeamMembers = currentSourceTeam
    ? currentSourceTeam.members.filter(m => m.id !== user?.id)
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }
    if (!description.trim()) {
      setError('Task description is required.');
      return;
    }
    if (!sourceTeamId) {
      setError('Please select a source team.');
      return;
    }
    if (assignmentMethod === 'another_team' && !destinationTeamId) {
      setError('Please select an eligible destination team for cross-team assignment.');
      return;
    }
    if (assignmentMethod === 'specific_member' && !assignedMemberId) {
      setError('Please select a specific team member.');
      return;
    }

    setIsLoading(true);
    try {
      await api.createTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate || undefined,
        sourceTeamId,
        assignmentMethod,
        destinationTeamId: assignmentMethod === 'another_team' ? destinationTeamId : undefined,
        assignedMemberId: assignmentMethod === 'specific_member' ? assignedMemberId : undefined,
      });
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDueDate('');
      setAssignmentMethod('my_team');
      setDestinationTeamId('');
      setAssignedMemberId('');
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create task.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl rounded-3xl bg-white/95 backdrop-blur-2xl border border-white/60 shadow-2xl p-6 sm:p-8 z-10 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Create Work Item</h2>
              <p className="text-xs text-slate-500">Authorize and dispatch work across team channels</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Source Team (Origin) *
            </label>
            <select
              value={sourceTeamId}
              onChange={e => {
                setSourceTeamId(e.target.value);
                setDestinationTeamId('');
                setAssignedMemberId('');
              }}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              {eligibleSourceTeams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name} {team.leadId === user?.id ? '(You Lead)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Implement zero-trust mutual TLS between microservices"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Detailed instructions, scope, acceptance criteria..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TaskPriority)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Assignment Method *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAssignmentMethod('my_team')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  assignmentMethod === 'my_team'
                    ? 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-semibold ring-2 ring-emerald-400/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs mb-1">
                  <Users className="h-3.5 w-3.5 text-emerald-600" />
                  <span>A. My Team</span>
                </div>
                <p className="text-[10px] text-slate-500">Open for team members to claim</p>
              </button>
              <button
                type="button"
                onClick={() => setAssignmentMethod('another_team')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  assignmentMethod === 'another_team'
                    ? 'border-teal-500 bg-teal-50/80 text-teal-950 font-semibold ring-2 ring-teal-400/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs mb-1">
                  <ArrowRightLeft className="h-3.5 w-3.5 text-teal-600" />
                  <span>B. Another Team</span>
                </div>
                <p className="text-[10px] text-slate-500">Cross-team approval request</p>
              </button>
              <button
                type="button"
                onClick={() => setAssignmentMethod('specific_member')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  assignmentMethod === 'specific_member'
                    ? 'border-cyan-500 bg-cyan-50/80 text-cyan-950 font-semibold ring-2 ring-cyan-400/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs mb-1">
                  <UserCheck className="h-3.5 w-3.5 text-cyan-600" />
                  <span>C. Specific Member</span>
                </div>
                <p className="text-[10px] text-slate-500">Assign directly to team member</p>
              </button>
            </div>
          </div>

          {assignmentMethod === 'another_team' && (
            <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200 animate-in fade-in duration-150">
              <label className="block text-xs font-bold text-teal-900 uppercase tracking-wider mb-1">
                Choose Destination Team *
              </label>
              <select
                required
                value={destinationTeamId}
                onChange={e => setDestinationTeamId(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-teal-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              >
                <option value="">-- Select Destination Team --</option>
                {destinationTeams.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} (Lead: {t.lead.name})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-teal-800/80 mt-1.5">
                This will submit a cross-team assignment request to the receiving team's leader for approval before distribution.
              </p>
            </div>
          )}

          {assignmentMethod === 'specific_member' && (
            <div className="p-3.5 rounded-2xl bg-cyan-50/70 border border-cyan-200 animate-in fade-in duration-150">
              <label className="block text-xs font-bold text-cyan-900 uppercase tracking-wider mb-1">
                Choose Member of {currentSourceTeam?.name} *
              </label>
              <select
                required
                value={assignedMemberId}
                onChange={e => setAssignedMemberId(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-cyan-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              >
                <option value="">-- Select Eligible Team Member --</option>
                {currentTeamMembers.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.title || m.department || m.email})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-cyan-800/80 mt-1.5">
                Task creator cannot assign tasks to themselves. Assignee must be an active member of this team.
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-teal-700/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isLoading ? 'Creating...' : 'Create & Dispatch'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
