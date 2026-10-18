import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { User, LogOut, ChevronDown, ArrowRightLeft, Users, Compass, Wand2 } from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar.tsx';

interface NavbarProps {
  onNavigate: (page: string, params?: any) => void;
  currentPage: string;
  onOpenGuide?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, onOpenGuide }) => {
  const { user, logout, switchPersona, isAdmin, teamsLeading } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [personaOpen, setPersonaOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const personaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (personaRef.current && !personaRef.current.contains(e.target as Node)) {
        setPersonaOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const quickPersonas = [
    { email: 'admin@netwonite.com', name: 'System Admin', roleDesc: 'Global Administrator', badge: 'Admin' },
    { email: 'employ1@gmail.com', name: 'Alex Chen', roleDesc: 'Lead: Team Rock', badge: 'Lead' },
    { email: 'employ6@gmail.com', name: 'David Kim', roleDesc: 'Lead: Team Paper', badge: 'Lead' },
    { email: 'employ11@gmail.com', name: 'Emily Zhao', roleDesc: 'Lead: Team Nexus', badge: 'Lead' },
    { email: 'employ16@gmail.com', name: 'Noah Becker', roleDesc: 'Lead: Team Alpha', badge: 'Lead' },
    { email: 'employ2@gmail.com', name: 'Jordan Taylor', roleDesc: 'Member: Team Rock & Nexus', badge: 'Member' },
    { email: 'employ7@gmail.com', name: 'Priya Patel', roleDesc: 'Member: Team Paper', badge: 'Member' },
  ];

  const roleLabel = isAdmin ? 'Admin' : teamsLeading.length > 0 ? 'Lead' : 'Member';

  return (
    <header className="sticky top-0 z-30 h-16 w-full backdrop-blur-xl bg-white/80 border-b border-white/60 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none"
        >
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 border border-emerald-400/30 p-0.5 shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-all duration-300 flex items-center justify-center">
            <span className="text-white font-extrabold text-sm tracking-wider">N</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                Netwonite
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold">
                Enterprise
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">Team & Task Core</p>
          </div>
        </button>
      </div>

      {/* Middle & Right: Guide Button, Persona Switcher & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* User Guide Button for New Users */}
        {onOpenGuide && (
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-semibold transition-all duration-200 cursor-pointer shadow-xs hover:-translate-y-0.5 active:translate-y-0"
            title="Open Interactive User Guide & Tour"
          >
            <Compass className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">Guide</span>
          </button>
        )}

        {/* Quick Persona Switcher */}
        <div className="relative" ref={personaRef}>
          <button
            onClick={() => setPersonaOpen(!personaOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-all duration-200 cursor-pointer shadow-xs hover:-translate-y-0.5 active:translate-y-0"
            title="Switch Testing Persona without Logging Out"
          >
            <ArrowRightLeft className="h-3.5 w-3.5 text-emerald-600" />
            <span className="hidden md:inline text-slate-500 font-normal">Role:</span>
            <span className="truncate max-w-[120px] sm:max-w-[150px] text-slate-900 font-medium">
              {user?.name.split(' ')[0]}
            </span>
            <span className="text-[10px] font-mono px-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
              {roleLabel}
            </span>
            <ChevronDown className={`h-3 w-3 text-slate-500 transition-transform duration-200 ${personaOpen ? 'rotate-180' : ''}`} />
          </button>

          {personaOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Test Personas
                </span>
                <button
                  onClick={() => {
                    setPersonaOpen(false);
                    onNavigate('manage-users');
                  }}
                  className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
                >
                  All 20 Users &rarr;
                </button>
              </div>

              <div className="py-1 max-h-72 overflow-y-auto">
                {quickPersonas.map(p => {
                  const isCurrent = user?.email === p.email;
                  return (
                    <button
                      key={p.email}
                      onClick={async () => {
                        await switchPersona(p.email);
                        setPersonaOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-emerald-50 text-emerald-900 font-medium'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate pr-2">
                        <UserAvatar name={p.name} role={p.badge.toLowerCase()} size="xs" />
                        <div className="truncate">
                          <div className="text-xs font-medium text-slate-900 truncate">{p.name}</div>
                          <div className="text-[11px] text-slate-500 truncate">{p.roleDesc}</div>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider shrink-0 ${
                          p.badge === 'Admin'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : p.badge === 'Lead'
                            ? 'bg-teal-100 text-teal-800 border border-teal-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {p.badge}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="p-2 border-t border-slate-100 bg-slate-50/80">
                <button
                  onClick={() => {
                    setPersonaOpen(false);
                    onNavigate('manage-users');
                  }}
                  className="w-full py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all text-center cursor-pointer shadow-xs"
                >
                  Switch via Full 20-User Directory
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown with Image Vector */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 pr-2.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-all focus:outline-none cursor-pointer group"
            title="Profile Photo Vector & Settings"
          >
            <UserAvatar
              src={user?.avatar}
              name={user?.name}
              role={isAdmin ? 'admin' : teamsLeading.length > 0 ? 'leader' : 'employee'}
              size="sm"
              showVectorBadge={true}
              hoverEffect={true}
              className="ring-2 ring-emerald-500/40"
            />
            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-slate-800 truncate max-w-[110px] group-hover:text-emerald-700 transition-colors">
                {user?.name}
              </p>
              <p className="text-[10px] text-slate-500 truncate capitalize flex items-center gap-1">
                <span>{roleLabel}</span>
                <span className="text-[9px] font-mono text-emerald-600 font-bold">• Vector</span>
              </p>
            </div>
            <ChevronDown className={`h-3 w-3 text-slate-500 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-emerald-50/30 flex items-center gap-3">
                <UserAvatar
                  src={user?.avatar}
                  name={user?.name}
                  role={isAdmin ? 'admin' : teamsLeading.length > 0 ? 'leader' : 'employee'}
                  size="md"
                  showVectorBadge={true}
                  className="ring-2 ring-emerald-500/30 shadow-xs"
                />
                <div className="truncate flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                        isAdmin
                          ? 'bg-amber-100 text-amber-800 border border-amber-200 font-bold'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {user?.role}
                    </span>
                    <span className="text-[9px] font-mono uppercase px-1 rounded bg-slate-100 text-slate-600">
                      SVG
                    </span>
                  </div>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onNavigate('profile');
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-emerald-50/60 hover:text-emerald-900 flex items-center gap-2.5 cursor-pointer font-medium transition-colors"
                >
                  <Wand2 className="h-4 w-4 text-emerald-600" />
                  <span>Customize Vector Profile Photo</span>
                </button>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onNavigate('profile');
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer transition-colors"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  <span>Your Profile & Performance</span>
                </button>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onNavigate('manage-users');
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer transition-colors"
                >
                  <Users className="h-4 w-4 text-slate-400" />
                  <span>Switch User Persona</span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    logout();
                    setProfileOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer font-medium"
                >
                  <LogOut className="h-4 w-4 text-red-500" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
