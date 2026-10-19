import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { Shield, Users, Lock, Mail, ArrowRight, AlertCircle, Sparkles, UserCheck } from 'lucide-react';

interface DemoUserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  title?: string;
  teamsLeadingCount: number;
  teamsMemberOfCount: number;
}

interface LoginPageProps {
  onOpenGuide?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onOpenGuide }) => {
  const { login, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState('admin@netwonite.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoEmployees, setDemoEmployees] = useState<DemoUserItem[]>([]);
  const [demoAnalysts, setDemoAnalysts] = useState<DemoUserItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'leaders' | 'members' | 'analysts'>('all');

  useEffect(() => {
    api.getDemoUsers()
      .then(res => {
        const emps = res.users.filter(u => u.role === 'employee');
        const analysts = res.users.filter(u => u.role === 'viewer');
        setDemoEmployees(emps);
        setDemoAnalysts(analysts);
      })
      .catch(() => {
        const fallback: DemoUserItem[] = [];
        for (let i = 1; i <= 20; i++) {
          fallback.push({
            id: `usr-emp-${i}`,
            name: `Employee ${i}`,
            email: `employ${i}@gmail.com`,
            role: 'employee',
            teamsLeadingCount: [1, 6].includes(i) ? 1 : 0,
            teamsMemberOfCount: 1,
          });
        }
        setDemoEmployees(fallback);
        setDemoAnalysts([
          { id: 'usr-analyst-1', name: 'Sophia Martinez', email: 'analyst1@gmail.com', role: 'viewer', title: 'Lead Operations Analyst', department: 'Operations Intelligence', teamsLeadingCount: 0, teamsMemberOfCount: 0 },
          { id: 'usr-analyst-2', name: 'Daniel Cooper', email: 'analyst2@gmail.com', role: 'viewer', title: 'Workflow Intelligence Analyst', department: 'Workflow Audit', teamsLeadingCount: 0, teamsMemberOfCount: 0 },
          { id: 'usr-analyst-3', name: 'Fatima Al-Mansoor', email: 'analyst3@gmail.com', role: 'viewer', title: 'Compliance & Audit Analyst', department: 'Governance & Compliance', teamsLeadingCount: 0, teamsMemberOfCount: 0 },
          { id: 'usr-analyst-4', name: 'Rohan Verma', email: 'analyst4@gmail.com', role: 'viewer', title: 'Sprint Velocity Analyst', department: 'Engineering Velocity', teamsLeadingCount: 0, teamsMemberOfCount: 0 },
          { id: 'usr-analyst-5', name: 'Zoe Andersson', email: 'analyst5@gmail.com', role: 'viewer', title: 'Cross-Team Productivity Analyst', department: 'Cross-Team Intelligence', teamsLeadingCount: 0, teamsMemberOfCount: 0 },
        ]);
      });
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (userEmail: string) => {
    setEmail(userEmail);
    setPassword('123456');
    setError(null);
    setIsSubmitting(true);
    try {
      await login(userEmail, '123456');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsersToDisplay = () => {
    if (selectedCategory === 'analysts') return demoAnalysts;
    if (selectedCategory === 'leaders') return demoEmployees.filter(e => e.teamsLeadingCount > 0);
    if (selectedCategory === 'members') return demoEmployees.filter(e => e.teamsLeadingCount === 0);
    return demoEmployees;
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center p-3 sm:p-6 overflow-hidden bg-gradient-to-br from-zinc-300 via-neutral-200 to-zinc-400 font-sans select-none">
      {/* Animated Floating Grey & Light Ambient Glow Orbs for Frosted Glass Depth */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/6 left-1/6 w-[520px] h-[520px] bg-white/45 rounded-full blur-[110px] animate-float-orb-1" />
        <div className="absolute bottom-1/6 right-1/6 w-[540px] h-[540px] bg-zinc-950/20 rounded-full blur-[130px] animate-float-orb-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] bg-white/35 rounded-full blur-[120px] animate-float-orb-3" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/60 rounded-full blur-[90px]" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-zinc-800/15 rounded-full blur-[100px]" />
      </div>

      {/* Subtle Dot Grid Backdrop */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(rgba(0, 0, 0, 0.28) 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Main Glass Shell Container */}
      <div className="relative z-10 w-full max-w-6xl max-h-[96vh] rounded-3xl bg-white/45 sm:bg-white/50 backdrop-blur-2xl border border-white/70 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.22),0_10px_30px_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(255,255,255,0.95)] p-5 sm:p-7 flex flex-col justify-between overflow-y-auto transition-all duration-300 hover:shadow-[0_35px_80px_-15px_rgba(0,0,0,0.26),inset_0_1px_2px_rgba(255,255,255,1)]">
        
        {/* Specular Top Rim Reflection */}
        <div className="pointer-events-none absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

        {/* Brand Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-black/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-black text-white p-0.5 shadow-lg shadow-black/25 flex items-center justify-center font-extrabold text-lg tracking-tighter hover:rotate-6 hover:scale-110 transition-transform duration-300 cursor-pointer">
              N
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-neutral-900">Netwonite</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-black text-white shadow-xs hover:scale-105 transition-transform">
                  Enterprise
                </span>
              </div>
              <p className="text-xs text-neutral-600 font-medium">Team & Task Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {onOpenGuide && (
              <button
                type="button"
                onClick={onOpenGuide}
                className="button-glass-shine flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black hover:bg-neutral-800 text-white border border-black/80 text-xs font-bold transition-all shadow-md hover:shadow-black/30 hover:scale-105 active:scale-95 cursor-pointer"
                title="Open Interactive Guide"
              >
                <Sparkles className="h-3.5 w-3.5 text-white animate-pulse" />
                <span>Quick Guide</span>
              </button>
            )}
            <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-700 font-semibold">
              <span>Select a persona or enter credentials below</span>
            </div>
          </div>
        </div>

        {/* 3 Sections in Black and White Glass Combination */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-4 flex-1 items-stretch">
          
          {/* SECTION 1: Admin & Analyst Access Card (Dark Smoked Frosted Glass) */}
          <div className="liquid-sheen-sweep glass-dark-card lg:col-span-3 rounded-2xl p-5 flex flex-col justify-between group relative overflow-hidden text-white">
            {/* Top Specular Edge Prismatic Highlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            
            <div>
              <div className="flex items-center gap-2 mb-2 text-white">
                <div className="p-1.5 rounded-lg bg-white/10 border border-white/20 group-hover:scale-125 group-hover:rotate-12 group-hover:bg-white group-hover:text-black group-hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-300 shadow-sm">
                  <Shield className="h-4 w-4 text-inherit transition-transform duration-300" />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-100">
                  1. Governance & Analyst
                </h2>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-normal">
                Full administrative privileges or dedicated read-only intelligence and claim audit access.
              </p>
              
              {/* Administrator Glass Pill */}
              <div className="glass-tile-shine mt-3.5 p-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] backdrop-blur-xl border border-white/20 shadow-[0_6px_20px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.25)] hover:border-white/50 hover:shadow-[0_12px_28px_rgba(0,0,0,0.45),0_0_20px_rgba(255,255,255,0.18)] hover:-translate-y-1 transition-all duration-300">
                <p className="text-[10px] text-neutral-300 uppercase tracking-wider font-semibold">Administrator</p>
                <p className="text-xs font-bold text-white mt-0.5">admin@netwonite.com</p>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@netwonite.com')}
                  disabled={isSubmitting || authLoading}
                  className="button-glass-shine mt-2.5 w-full py-2 px-3 rounded-lg bg-white hover:bg-neutral-100 text-black text-[11px] font-bold uppercase tracking-wider shadow-[0_4px_14px_rgba(255,255,255,0.25)] hover:shadow-[0_8px_25px_rgba(255,255,255,0.55),0_0_15px_rgba(255,255,255,0.35)] hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 group/btn"
                >
                  <Shield className="h-3 w-3 text-black group-hover/btn:scale-125 group-hover/btn:rotate-12 transition-transform duration-200" />
                  <span>Login as Admin</span>
                </button>
              </div>

              {/* Dedicated Analyst Glass Pill */}
              <div className="glass-tile-shine mt-3 p-3 rounded-xl bg-cyan-950/30 hover:bg-cyan-950/50 backdrop-blur-xl border border-cyan-400/35 shadow-[0_6px_20px_rgba(6,182,212,0.15),inset_0_1px_1px_rgba(6,182,212,0.3)] hover:border-cyan-400/70 hover:shadow-[0_12px_28px_rgba(6,182,212,0.35),0_0_22px_rgba(6,182,212,0.3)] hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-cyan-300 uppercase tracking-wider font-semibold">Dedicated Analyst</p>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/25 text-cyan-300 font-mono border border-cyan-400/40">Immutable</span>
                </div>
                <p className="text-xs font-bold text-white mt-0.5">analyst1@gmail.com</p>
                <p className="text-[10px] text-cyan-300 font-medium truncate mt-0.5">Sophia Martinez • Lead Ops Analyst</p>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('analyst1@gmail.com')}
                  disabled={isSubmitting || authLoading}
                  className="button-glass-shine mt-2.5 w-full py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[11px] font-bold uppercase tracking-wider shadow-[0_4px_14px_rgba(6,182,212,0.35)] hover:shadow-[0_8px_25px_rgba(6,182,212,0.65),0_0_18px_rgba(6,182,212,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span>1-Click Viewer Analyst</span>
                </button>
              </div>
            </div>

            <div className="pt-2.5 text-[10px] text-neutral-300 border-t border-white/15 mt-3 flex items-center justify-between">
              <span>Password: <strong className="text-white">123456</strong></span>
              <span className="text-cyan-300 font-semibold">5 Dedicated Analysts</span>
            </div>
          </div>

          {/* SECTION 2: Employee & Analyst Personas Card (Light Frosted Crystalline Glass) */}
          <div className="liquid-sheen-sweep glass-light-card lg:col-span-5 rounded-2xl p-5 flex flex-col justify-between group relative overflow-hidden text-neutral-900">
            {/* Top Specular Edge Prismatic Highlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent" />
            
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 text-black">
                  <div className="p-1.5 rounded-lg bg-black text-white group-hover:scale-125 group-hover:-rotate-12 group-hover:shadow-[0_0_15px_rgba(0,0,0,0.4)] transition-all duration-300 shadow-sm">
                    <Users className="h-4 w-4" />
                  </div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-black">
                    2. Workspace Personas
                  </h2>
                </div>
                <div className="flex items-center gap-1 text-[10px] flex-wrap">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-2 py-0.5 rounded-md cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 ${
                      selectedCategory === 'all'
                        ? 'bg-black text-white font-bold shadow-xs'
                        : 'text-neutral-700 hover:text-black bg-white/50 hover:bg-white/80 border border-neutral-300/50 backdrop-blur-md'
                    }`}
                  >
                    All ({demoEmployees.length})
                  </button>
                  <button
                    onClick={() => setSelectedCategory('leaders')}
                    className={`px-2 py-0.5 rounded-md cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 ${
                      selectedCategory === 'leaders'
                        ? 'bg-black text-white font-bold shadow-xs'
                        : 'text-neutral-700 hover:text-black bg-white/50 hover:bg-white/80 border border-neutral-300/50 backdrop-blur-md'
                    }`}
                  >
                    Leaders ({demoEmployees.filter(e => e.teamsLeadingCount > 0).length || 2})
                  </button>
                  <button
                    onClick={() => setSelectedCategory('members')}
                    className={`px-2 py-0.5 rounded-md cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 ${
                      selectedCategory === 'members'
                        ? 'bg-black text-white font-bold shadow-xs'
                        : 'text-neutral-700 hover:text-black bg-white/50 hover:bg-white/80 border border-neutral-300/50 backdrop-blur-md'
                    }`}
                  >
                    Members ({demoEmployees.filter(e => e.teamsLeadingCount === 0).length || 18})
                  </button>
                  <button
                    onClick={() => setSelectedCategory('analysts')}
                    className={`px-2 py-0.5 rounded-md cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 ${
                      selectedCategory === 'analysts'
                        ? 'bg-cyan-600 text-white font-bold shadow-xs'
                        : 'text-cyan-800 hover:text-cyan-900 bg-cyan-100/60 hover:bg-cyan-100 font-semibold border border-cyan-300/50 backdrop-blur-md'
                    }`}
                  >
                    Analysts (5)
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-neutral-600 mb-2 font-medium">
                {selectedCategory === 'analysts'
                  ? 'Dedicated Viewer Analysts (Immutable governance role for claim & workflow audits):'
                  : 'Click any employee persona to sign in instantaneously (employ1 through employ20):'}
              </p>

              <div className="grid grid-cols-2 gap-2 max-h-48 sm:max-h-56 overflow-y-auto pr-1">
                {filteredUsersToDisplay().map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleQuickLogin(item.email)}
                    disabled={isSubmitting || authLoading}
                    className={`glass-tile-shine p-2.5 rounded-xl text-left transition-all duration-250 ease-out hover:-translate-y-1.5 hover:scale-[1.03] cursor-pointer border backdrop-blur-md ${
                      item.role === 'viewer'
                        ? 'bg-cyan-50/60 hover:bg-cyan-900 hover:text-white border-cyan-200/90 hover:border-cyan-400 shadow-[0_4px_12px_rgba(6,182,212,0.1),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:shadow-[0_12px_28px_-6px_rgba(6,182,212,0.45),0_0_16px_rgba(6,182,212,0.3)]'
                        : 'bg-white/55 hover:bg-neutral-950 hover:text-white border-white/80 hover:border-black shadow-[0_4px_12px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.38),0_0_16px_rgba(0,0,0,0.15)]'
                    } group/item`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-900 group-hover/item:text-white truncate">
                        {item.name}
                      </span>
                      {item.role === 'viewer' ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-700 text-white group-hover/item:bg-white group-hover/item:text-cyan-900 uppercase transition-all duration-200 group-hover/item:scale-110">
                          Analyst
                        </span>
                      ) : item.teamsLeadingCount > 0 ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-black text-white group-hover/item:bg-white group-hover/item:text-black uppercase transition-all duration-200 group-hover/item:scale-110">
                          Lead
                        </span>
                      ) : (
                        <span className="text-[9px] text-neutral-500 group-hover/item:text-neutral-300 font-medium">
                          Mbr
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-neutral-600 group-hover/item:text-neutral-300 truncate mt-0.5">
                      {item.email}
                    </div>
                    {item.title && (
                      <div className="text-[9px] text-neutral-500 group-hover/item:text-neutral-300 truncate mt-0.5">
                        {item.title}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 text-[10px] text-neutral-600 flex items-center justify-between border-t border-neutral-300/60 mt-2">
              <span>Demo password: <strong className="text-neutral-900">123456</strong></span>
              <span className="text-neutral-900 font-bold">Persists after refresh</span>
            </div>
          </div>

          {/* SECTION 3: Direct Sign In Form (Dark Smoked Frosted Glass) */}
          <div className="liquid-sheen-sweep glass-dark-card lg:col-span-4 rounded-2xl p-5 flex flex-col justify-between group relative overflow-hidden text-white">
            {/* Top Specular Edge Prismatic Highlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            
            <div>
              <div className="flex items-center gap-2 mb-2 text-white">
                <div className="p-1.5 rounded-lg bg-white/10 border border-white/20 group-hover:scale-125 group-hover:-rotate-12 group-hover:bg-white group-hover:text-black group-hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-300 shadow-sm">
                  <Lock className="h-4 w-4 text-inherit transition-transform duration-300" />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-100">
                  3. Direct Sign In
                </h2>
              </div>
              <p className="text-xs text-neutral-300 mb-4">
                Enter account credentials to access your workspace.
              </p>

              {error && (
                <div className="mb-3 p-2.5 rounded-xl bg-neutral-900/80 backdrop-blur-md border border-white/40 text-neutral-200 text-xs flex items-center gap-2 shadow-sm animate-shake">
                  <AlertCircle className="h-4 w-4 shrink-0 text-white" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative group/field">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400 group-hover/field:scale-110 group-focus-within/field:text-white group-focus-within/field:scale-110 transition-all duration-200" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="employ1@gmail.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/30 backdrop-blur-xl border border-white/20 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 focus:bg-black/55 hover:border-white/40 hover:shadow-[0_0_12px_rgba(255,255,255,0.12)] transition-all duration-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative group/field">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400 group-hover/field:scale-110 group-focus-within/field:text-white group-focus-within/field:scale-110 transition-all duration-200" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/30 backdrop-blur-xl border border-white/20 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 focus:bg-black/55 hover:border-white/40 hover:shadow-[0_0_12px_rgba(255,255,255,0.12)] transition-all duration-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || authLoading}
                  className="button-glass-shine mt-4 w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-100 text-black text-xs font-bold uppercase tracking-wider shadow-[0_8px_20px_-4px_rgba(255,255,255,0.25)] hover:shadow-[0_14px_35px_-4px_rgba(255,255,255,0.55),0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 group/submit"
                >
                  <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Workspace'}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-black group-hover/submit:translate-x-2 transition-transform duration-200 ease-out" />
                </button>
              </form>
            </div>

            <div className="mt-4 pt-3 border-t border-white/15 text-center">
              <span className="text-[11px] text-neutral-300">
                Connected to In-Memory & Express API backend
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-black/10 flex items-center justify-between text-[11px] text-neutral-600 font-medium shrink-0">
          <div>
            <span>Netwonite Enterprise</span> • <span className="text-black font-semibold">Black & White Frosted Glass Edition</span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-900 font-bold hover:scale-105 transition-transform duration-200 cursor-default">
            <UserCheck className="h-3.5 w-3.5 text-black" />
            <span>20 Demo Employees + 1 Administrator Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};
