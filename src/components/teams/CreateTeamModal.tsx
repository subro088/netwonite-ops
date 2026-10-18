import React, { useState, useEffect } from 'react';
import { User } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { X, Users, AlertCircle, Check } from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar.tsx';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [leadId, setLeadId] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      api.getUsers()
        .then(data => {
          const employees = data.users.filter(u => u.role === 'employee');
          setAvailableUsers(employees);
          if (employees.length > 0 && !leadId) {
            setLeadId(employees[0].id);
          }
        })
        .catch(err => {
          setError(err.message || 'Failed to load employees');
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleMember = (userId: string) => {
    if (selectedMemberIds.includes(userId)) {
      setSelectedMemberIds(selectedMemberIds.filter(id => id !== userId));
    } else {
      setSelectedMemberIds([...selectedMemberIds, userId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError('Please provide a team name.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a team description.');
      return;
    }
    if (!leadId) {
      setError('Please choose a team lead.');
      return;
    }

    setIsLoading(true);
    try {
      await api.createTeam({
        name: name.trim(),
        description: description.trim(),
        leadId,
        memberIds: selectedMemberIds.filter(id => id !== leadId),
      });
      setName('');
      setDescription('');
      setSelectedMemberIds([]);
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to publish team.');
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
      <div className="relative w-full max-w-xl rounded-3xl bg-white/95 backdrop-blur-2xl border border-white/60 shadow-2xl p-6 sm:p-8 z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Create New Team</h2>
              <p className="text-xs text-slate-500">Configure team roster, leader, and responsibilities</p>
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
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Team Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Team Rock, Team Quantum, Team Phoenix"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Team Description *
            </label>
            <textarea
              required
              rows={2}
              placeholder="Mission, domain, or engineering responsibilities..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Choose Team Lead *
            </label>
            <select
              value={leadId}
              onChange={e => {
                const newLead = e.target.value;
                setLeadId(newLead);
                setSelectedMemberIds(selectedMemberIds.filter(id => id !== newLead));
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
            >
              {availableUsers.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.email}) - {emp.title || emp.department}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              The assigned leader will immediately see this team under their Leader dashboard section.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Team Members ({selectedMemberIds.length} selected)
              </label>
              <span className="text-[11px] text-slate-400">Click to toggle</span>
            </div>
            <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/70 p-2 space-y-1">
              {availableUsers
                .filter(u => u.id !== leadId)
                .map(emp => {
                  const isSelected = selectedMemberIds.includes(emp.id);
                  return (
                    <div
                      key={emp.id}
                      onClick={() => toggleMember(emp.id)}
                      className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-emerald-100 text-emerald-900 font-semibold border border-emerald-300'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <UserAvatar src={emp.avatar} name={emp.name} size="xs" />
                        <span className="truncate">{emp.name}</span>
                        <span className="text-[10px] text-slate-400 truncate hidden sm:inline">({emp.email})</span>
                      </div>
                      <div
                        className={`h-4 w-4 rounded flex items-center justify-center border transition-colors ${
                          isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 stroke-3" />}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-700/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Publishing...' : 'Publish Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
