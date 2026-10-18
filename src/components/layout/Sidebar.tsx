import React from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  Users2,
  UserCog,
  Clock,
  CheckCircle2,
  Flame,
  CheckSquare,
  XCircle,
  LayoutDashboard,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Trophy,
  BarChart3,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar.tsx';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string, params?: any) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenGuide?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  onOpenGuide,
}) => {
  const { user, isAdmin, isViewer, teamsLeading } = useAuth();
  const isLeader = teamsLeading.length > 0;

  // Base navigation items
  const navItems = [
    {
      id: 'tasks',
      label: 'Work Items / Tasks',
      icon: CheckSquare,
      badge: 'All',
    },
    {
      id: 'my-team-member',
      label: 'My Team (Member)',
      icon: Users2,
      hidden: isViewer || (isAdmin && !isLeader),
    },
    {
      id: 'my-team-leader',
      label: 'Team Leadership',
      icon: UserCog,
      hidden: isViewer || (!isLeader && !isAdmin),
      badge: 'Lead',
    },
    {
      id: 'ongoing-work',
      label: 'Ongoing Work',
      icon: Clock,
    },
    {
      id: 'completed-work',
      label: 'Completed Work',
      icon: CheckCircle2,
    },
    {
      id: 'high-priority',
      label: 'High Priority',
      icon: Flame,
    },
    {
      id: 'approvals',
      label: 'Approvals',
      icon: CheckSquare,
      badge: isLeader ? 'Lead' : undefined,
    },
    {
      id: 'rejections',
      label: 'Rejections',
      icon: XCircle,
    },
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none border-r border-slate-700/50 backdrop-blur-2xl shadow-xl ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      style={{
        background: 'linear-gradient(180deg, rgba(51, 65, 85, 0.95) 0%, rgba(30, 41, 59, 0.97) 35%, rgba(15, 23, 42, 0.98) 75%, rgba(11, 15, 25, 1) 100%)',
      }}
    >
      {/* Top Header & Brand in Sidebar */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 bg-white/[0.02]">
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5 truncate">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 border border-white/20 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                N
              </div>
              <div>
                <span className="font-bold text-sm text-white tracking-wider block">NETWONITE</span>
                <span className="block text-[10px] text-emerald-400 font-semibold tracking-wider">ENTERPRISE</span>
              </div>
            </div>
          ) : (
            <div className="mx-auto h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 border border-white/20 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
              N
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 focus:outline-none cursor-pointer shadow-xs hover:scale-105 active:scale-95"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {/* Quick Dashboard */}
          <button
            onClick={() => onNavigate('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all duration-200 group cursor-pointer relative overflow-hidden ${
              currentPage === 'dashboard'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-700/30'
                : 'text-slate-300 hover:text-white hover:bg-white/10 hover:translate-x-1'
            }`}
            title="Dashboard"
          >
            <LayoutDashboard
              className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                currentPage === 'dashboard' ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
              }`}
            />
            {!isCollapsed && <span>{isViewer ? 'Operations Console' : 'Dashboard Overview'}</span>}
          </button>

          {/* DEDICATED VIEWER ANALYST CONSOLE */}
          {isViewer && (
            <button
              onClick={() => onNavigate('viewer-analytics')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all duration-200 group cursor-pointer border relative overflow-hidden ${
                currentPage === 'viewer-analytics' || currentPage === 'analytics'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30 border-cyan-400'
                  : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20 hover:bg-cyan-500/20 hover:text-cyan-200 hover:translate-x-1'
              }`}
              title="Operations, Squads & Claims Analysis"
            >
              <BarChart3
                className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  currentPage === 'viewer-analytics' || currentPage === 'analytics' ? 'text-white' : 'text-cyan-400'
                }`}
              />
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between truncate">
                  <span className="truncate">Operations & Claims</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase bg-cyan-400/20 text-cyan-200">
                    Audit
                  </span>
                </div>
              )}
            </button>
          )}

          {/* Workflows & Achievements Dual View (Admin & Viewer) */}
          {(isAdmin || isViewer) && (
            <button
              onClick={() => onNavigate('admin-workflows-achievements')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all duration-200 group cursor-pointer border relative overflow-hidden ${
                currentPage === 'admin-workflows-achievements'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-600/30 border-amber-400'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/20 hover:bg-amber-500/20 hover:text-amber-200 hover:translate-x-1'
              }`}
              title="Employee Workflows & Achievements (Tree & Bar Views)"
            >
              <Trophy
                className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  currentPage === 'admin-workflows-achievements' ? 'text-white' : 'text-amber-400'
                }`}
              />
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between truncate">
                  <span className="truncate">Workflows & Achievements</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase bg-amber-400/20 text-amber-200">
                    Dual
                  </span>
                </div>
              )}
            </button>
          )}

          {/* Admin & Analyst Governance Section */}
          {(isAdmin || isViewer) && (
            <div className="pt-2">
              {!isCollapsed && (
                <div className="px-3 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  {isViewer ? 'Intelligence & Directory' : 'Governance'}
                </div>
              )}
              <button
                onClick={() => onNavigate('manage-teams')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium tracking-tight transition-all duration-200 group cursor-pointer ${
                  currentPage === 'manage-teams'
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/10 hover:translate-x-1'
                }`}
                title="Squad Registry"
              >
                <Users2 className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-emerald-400" />
                {!isCollapsed && <span>Squad Registry</span>}
              </button>
              <button
                onClick={() => onNavigate('manage-users')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium tracking-tight transition-all duration-200 group cursor-pointer ${
                  currentPage === 'manage-users'
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/10 hover:translate-x-1'
                }`}
                title="User Directory & Switch Persona"
              >
                <UserCheck className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-emerald-400" />
                {!isCollapsed && <span>Directory & Personas</span>}
              </button>
            </div>
          )}

          {/* Regular / Leader Section */}
          <div className="pt-2">
            {!isCollapsed && (
              <div className="px-3 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Workflows
              </div>
            )}
            {navItems.map(item => {
              if (item.hidden) return null;
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium tracking-tight transition-all duration-200 group cursor-pointer ${
                    isActive
                      ? 'bg-white/20 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-white/10 hover:translate-x-1'
                  }`}
                  title={item.label}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  {!isCollapsed && (
                    <div className="flex-1 flex items-center justify-between truncate">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-mono uppercase bg-white/10 text-slate-300">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Guide & Help Launcher */}
      {onOpenGuide && (
        <div className="px-3 pb-2">
          <button
            onClick={onOpenGuide}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-tight transition-all duration-200 cursor-pointer bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-emerald-300 hover:text-white shadow-xs group ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Open Interactive User Guide & Tour"
          >
            <Compass className="h-4 w-4 shrink-0 text-emerald-400 group-hover:rotate-45 transition-transform duration-300" />
            {!isCollapsed && (
              <span className="truncate flex-1 text-left">Quick Guide & Tour</span>
            )}
          </button>
        </div>
      )}

      {/* Bottom Profile Info */}
      <div className="p-3 border-t border-white/10 bg-black/20">
        <button
          onClick={() => onNavigate('profile')}
          className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 transition-colors text-left cursor-pointer group"
          title="View profile and achievements"
        >
          <UserAvatar
            src={user?.avatar}
            name={user?.name}
            role={isAdmin ? 'admin' : isLeader ? 'leader' : 'employee'}
            size="sm"
            showVectorBadge={true}
            hoverEffect={true}
            className="ring-1 ring-white/30"
          />
          {!isCollapsed && (
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                {user?.name}
              </p>
              <p className="text-[10px] text-slate-400 truncate capitalize">
                {isAdmin ? 'System Admin' : isLeader ? 'Team Lead' : 'Team Member'}
              </p>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
