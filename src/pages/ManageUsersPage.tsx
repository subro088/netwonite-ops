import React, { useState, useEffect } from 'react';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { User, Team } from '../types/index.ts';
import { Search, Shield, UserCheck, ArrowRightLeft } from 'lucide-react';
import { UserAvatar } from '../components/common/UserAvatar.tsx';

interface EnrichedUser extends User {
  teamsLeading: Team[];
  teamsMemberOf: Team[];
  isLeader: boolean;
  totalTeams: number;
}

interface ManageUsersPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const ManageUsersPage: React.FC<ManageUsersPageProps> = ({ onNavigate: _onNavigate }) => {
  const { user: currentUser, switchPersona } = useAuth();
  const [users, setUsers] = useState<EnrichedUser[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'leader' | 'member'>('all');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await api.getUsers();
      setUsers(data.users as EnrichedUser[]);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.department && u.department.toLowerCase().includes(search.toLowerCase())) ||
      (u.title && u.title.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    if (roleFilter === 'admin') return u.role === 'admin';
    if (roleFilter === 'leader') return u.isLeader;
    if (roleFilter === 'member') return !u.isLeader && u.role === 'employee';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-teal-100 text-teal-800 border border-teal-200">
              Identity & Directory
            </span>
            <span className="text-xs text-slate-400">20 Employees + 1 Administrator</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage Users & Personas</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit team assignments, view leadership roles, and switch testing personas in real-time.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, department..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>
      </div>

      {/* Role filter pills */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <button
          onClick={() => setRoleFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            roleFilter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white/80 text-slate-600 hover:bg-white border border-slate-200'
          }`}
        >
          All Users ({users.length})
        </button>
        <button
          onClick={() => setRoleFilter('admin')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            roleFilter === 'admin'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white/80 text-slate-600 hover:bg-white border border-slate-200'
          }`}
        >
          Administrators (1)
        </button>
        <button
          onClick={() => setRoleFilter('leader')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            roleFilter === 'leader'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-white/80 text-slate-600 hover:bg-white border border-slate-200'
          }`}
        >
          Team Leaders ({users.filter(u => u.isLeader).length})
        </button>
        <button
          onClick={() => setRoleFilter('member')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            roleFilter === 'member'
              ? 'bg-cyan-700 text-white shadow-xs'
              : 'bg-white/80 text-slate-600 hover:bg-white border border-slate-200'
          }`}
        >
          Team Members ({users.filter(u => !u.isLeader && u.role === 'employee').length})
        </button>
      </div>

      {/* Users Grid */}
      {isLoading ? (
        <div className="p-16 text-center text-xs text-slate-400">Loading user directory...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map(u => {
            const isSelf = currentUser?.id === u.id;
            return (
              <div
                key={u.id}
                className={`p-5 rounded-3xl backdrop-blur-xl border transition-all flex flex-col justify-between group ${
                  isSelf
                    ? 'bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-500/20'
                    : 'bg-white/85 border-white/70 hover:border-slate-300 shadow-xs hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        src={u.avatar}
                        name={u.name}
                        role={u.role === 'admin' ? 'admin' : u.isLeader ? 'leader' : 'employee'}
                        size="md"
                        showVectorBadge={true}
                        hoverEffect={true}
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-slate-900">{u.name}</h3>
                          {isSelf && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-600 text-white">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                    {u.role === 'admin' ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
                        Admin
                      </span>
                    ) : u.isLeader ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-200">
                        Leader
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                        Member
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-slate-700 mb-1">{u.title || 'Engineer'}</p>
                  <p className="text-[11px] text-slate-400 mb-3">{u.department || 'Operations'}</p>

                  <div className="space-y-1.5 mb-3 text-xs">
                    {u.teamsLeading.length > 0 && (
                      <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50/70 p-2 rounded-xl">
                        <Shield className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        <span className="text-[11px] font-semibold truncate">
                          Leads: {u.teamsLeading.map(t => t.name).join(', ')}
                        </span>
                      </div>
                    )}
                    {u.teamsMemberOf.length > 0 && (
                      <div className="flex items-center gap-1.5 text-cyan-800 bg-cyan-50/70 p-2 rounded-xl">
                        <UserCheck className="h-3.5 w-3.5 shrink-0 text-cyan-600" />
                        <span className="text-[11px] font-semibold truncate">
                          Member: {u.teamsMemberOf.map(t => t.name).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Joined {new Date(u.createdAt).toLocaleDateString()}
                  </span>
                  {!isSelf ? (
                    <button
                      onClick={() => switchPersona(u.email)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 text-xs font-bold transition-all cursor-pointer"
                      title={`Switch active login persona to ${u.name}`}
                    >
                      <ArrowRightLeft className="h-3 w-3" />
                      <span>Switch Persona</span>
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-700">Active Persona</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
