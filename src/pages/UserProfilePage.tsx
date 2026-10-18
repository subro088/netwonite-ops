import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Shield, UserCheck, Mail, Briefcase, Sparkles, Wand2 } from 'lucide-react';
import { UserAvatar } from '../components/common/UserAvatar.tsx';
import { VectorAvatarPickerModal } from '../components/profile/VectorAvatarPickerModal.tsx';
import { VECTOR_AVATAR_PRESETS } from '../utils/vectorAvatars.ts';

interface UserProfilePageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ onNavigate }) => {
  const { user, teamsLeading, teamsMemberOf, isAdmin, updateAvatar } = useAuth();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const roleType = isAdmin ? 'admin' : teamsLeading.length > 0 ? 'leader' : 'employee';

  const handleSaveAvatar = async (newAvatar: string) => {
    await updateAvatar(newAvatar);
    setToastMessage('Vector profile photo updated successfully!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 px-4 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/80 hover:text-white text-xs cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="p-8 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/70 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-100/40 via-teal-100/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
          <div className="relative group cursor-pointer" onClick={() => setIsPickerOpen(true)}>
            <div className="relative p-1 rounded-3xl bg-gradient-to-tr from-emerald-500/30 via-teal-500/20 to-cyan-500/30 shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-emerald-500/20">
              <UserAvatar
                src={user?.avatar}
                name={user?.name}
                role={roleType}
                size="2xl"
                showVectorBadge={true}
                className="ring-4 ring-white shadow-md rounded-2xl"
              />
            </div>
            <div className="absolute inset-0 bg-slate-900/60 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white p-2">
              <Wand2 className="h-6 w-6 mb-1 text-emerald-300 animate-pulse" />
              <span className="text-[11px] font-bold text-center leading-tight">
                Change Vector
              </span>
            </div>
            <div className="absolute -bottom-2 inset-x-0 flex justify-center">
              <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[9px] font-mono uppercase tracking-wider font-bold shadow-md border border-white/40 flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5 text-emerald-400" />
                Image Vector
              </span>
            </div>
          </div>

          <div className="space-y-3 flex-1 pt-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
              {isAdmin ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
                  Global Administrator
                </span>
              ) : teamsLeading.length > 0 ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-200 shadow-xs">
                  Team Leader
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 shadow-xs">
                  Team Member
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                SVG Vector Active
              </span>
            </div>

            <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-2">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              <span>{user?.email}</span>
            </p>
            <p className="text-xs font-medium text-slate-700 flex items-center justify-center sm:justify-start gap-2">
              <Briefcase className="h-3.5 w-3.5 text-slate-400" />
              <span>
                {user?.title || 'Engineer'} - {user?.department || 'Engineering'}
              </span>
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <button
                onClick={() => setIsPickerOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Customize Vector Avatar
              </button>
            </div>
          </div>
        </div>

        {/* Quick Vector Persona Selector Carousel */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
              <Wand2 className="h-3.5 w-3.5 text-emerald-600" />
              Quick Vector Persona Selector
            </span>
            <button
              onClick={() => setIsPickerOpen(true)}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
            >
              Browse All 21 Vectors &rarr;
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {VECTOR_AVATAR_PRESETS.slice(0, 6).map(preset => {
              const isCurrent = user?.avatar === preset.svgDataUri || user?.avatar === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSaveAvatar(preset.svgDataUri)}
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer group flex flex-col items-center ${
                    isCurrent
                      ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50/80 hover:bg-white border-slate-200/80 hover:border-emerald-200 hover:-translate-y-0.5'
                  }`}
                  title={`Switch to ${preset.name}`}
                >
                  <UserAvatar
                    src={preset.svgDataUri}
                    name={preset.name}
                    size="sm"
                    className="shadow-xs mb-1 group-hover:scale-105 transition-transform"
                  />
                  <span className="text-[10px] font-bold text-slate-800 truncate w-full">
                    {preset.name.split(' ')[0]}
                  </span>
                  {isCurrent && (
                    <span className="text-[9px] font-mono text-emerald-700 font-bold mt-0.5">
                      Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid: Leadership & Memberships */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-white/70 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Shield className="h-4 w-4 text-emerald-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Teams You Lead ({teamsLeading.length})
            </h2>
          </div>
          {teamsLeading.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">You are not currently assigned as a team lead.</p>
          ) : (
            <div className="space-y-2">
              {teamsLeading.map(t => (
                <div
                  key={t.id}
                  onClick={() => onNavigate('my-team-leader')}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">{t.name}</h3>
                    <p className="text-[10px] text-slate-400">{t.members?.length || 0} members</p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700">Open Dashboard &rarr;</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-white/70 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <UserCheck className="h-4 w-4 text-cyan-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Teams You Belong To ({teamsMemberOf.length})
            </h2>
          </div>
          {teamsMemberOf.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">You have no squad memberships assigned.</p>
          ) : (
            <div className="space-y-2">
              {teamsMemberOf.map(t => (
                <div
                  key={t.id}
                  onClick={() => onNavigate('my-team-member')}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-cyan-50 border border-slate-100 hover:border-cyan-200 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">{t.name}</h3>
                    <p className="text-[10px] text-slate-400">Lead: {t.lead?.name}</p>
                  </div>
                  <span className="text-[11px] font-bold text-cyan-700">View Board &rarr;</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Vector Avatar Picker Modal */}
      <VectorAvatarPickerModal
        currentAvatar={user?.avatar}
        userName={user?.name}
        userRole={roleType}
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSave={handleSaveAvatar}
      />
    </div>
  );
};
