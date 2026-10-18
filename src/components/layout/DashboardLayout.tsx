import React, { useState } from 'react';
import { Navbar } from './Navbar.tsx';
import { Sidebar } from './Sidebar.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { Shield, Sparkles, ArrowRightLeft, UserCheck, X, Compass } from 'lucide-react';

interface DashboardLayoutProps {
  currentPage: string;
  onNavigate: (page: string, params?: any) => void;
  onOpenGuide?: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentPage,
  onNavigate,
  onOpenGuide,
  children,
}) => {
  const { user, isAdmin, teamsLeading, teamsMemberOf } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const isLeader = teamsLeading.length > 0;

  return (
    <div className="min-h-screen text-slate-800 antialiased font-sans relative selection:bg-emerald-500/20 selection:text-emerald-900 bg-slate-100">
      {/* Subtle Ambient Mesh Gradient Aura */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 ambient-liquid-mesh opacity-80" />

      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onOpenGuide={onOpenGuide}
      />

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col min-h-screen relative z-10 ${
          isCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <Navbar onNavigate={onNavigate} currentPage={currentPage} onOpenGuide={onOpenGuide} />

        {/* Role Context Banner */}
        {!bannerDismissed && user && (
          <div className="mx-6 sm:mx-8 mt-4 p-3 rounded-2xl bg-white/85 backdrop-blur-xl border border-white/70 shadow-xs hover:shadow-md flex items-center justify-between gap-3 text-xs z-20 transition-all duration-300 group relative overflow-hidden">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1.5 rounded-lg shrink-0 bg-slate-100 border border-slate-200 text-slate-700 shadow-xs">
                {isAdmin ? (
                  <Shield className="h-4 w-4 text-amber-600" />
                ) : isLeader ? (
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                ) : (
                  <UserCheck className="h-4 w-4 text-indigo-600" />
                )}
              </div>
              <div className="truncate">
                <span className="font-bold text-slate-900 mr-1.5">
                  {isAdmin
                    ? 'Administrator Mode:'
                    : isLeader
                    ? `Team Lead (${teamsLeading.map(t => t.name).join(', ')}):`
                    : `Team Member (${teamsMemberOf.map(t => t.name).join(', ') || 'General Roster'}):`}
                </span>
                <span className="text-slate-600 hidden sm:inline">
                  {isAdmin
                    ? 'Full workspace governance: manage teams, assign leaders, and audit global workflows.'
                    : isLeader
                    ? 'Cross-team delegation: create tasks, review submissions, and manage squad velocity.'
                    : 'Execution dashboard: claim open squad tasks, update progress, and submit for review.'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onOpenGuide && (
                <button
                  onClick={onOpenGuide}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 font-medium text-[11px] transition-all cursor-pointer shadow-xs hover:-translate-y-0.5 active:translate-y-0"
                  title="Open User Guide"
                >
                  <Compass className="h-3 w-3 text-slate-600" />
                  <span>Guide</span>
                </button>
              )}
              <button
                onClick={() => onNavigate('manage-users')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium text-[11px] transition-all cursor-pointer shadow-xs hover:-translate-y-0.5 active:translate-y-0"
                title="Switch persona to test other roles"
              >
                <ArrowRightLeft className="h-3 w-3 text-emerald-700" />
                <span className="hidden md:inline">Switch Role</span>
              </button>
              <button
                onClick={() => setBannerDismissed(true)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Dismiss hint"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Content Container */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
