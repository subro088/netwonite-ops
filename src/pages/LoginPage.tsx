import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import {
  Shield,
  Users,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Sparkles,
  UserCheck,
  CheckCircle2,
  ChevronRight,
  Search,
  X,
  Layers,
  Activity,
  Workflow,
  BarChart3,
  Crown,
  Briefcase,
  Eye,
} from 'lucide-react';
import { NewtoniteOrbitalCore } from '../components/auth/NewtoniteOrbitalCore.tsx';
import { NewtonsCradle3D } from '../components/common/NewtonsCradle3D.tsx';

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
  const [selectedRoleKey, setSelectedRoleKey] = useState<'admin' | 'leader' | 'analyst' | 'member'>('admin');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoEmployees, setDemoEmployees] = useState<DemoUserItem[]>([]);
  const [demoAnalysts, setDemoAnalysts] = useState<DemoUserItem[]>([]);
  const [isAllPersonasModalOpen, setIsAllPersonasModalOpen] = useState(false);
  const [personaSearch, setPersonaSearch] = useState('');
  const [modalCategory, setModalCategory] = useState<'all' | 'leaders' | 'members' | 'analysts'>('all');

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
            department: i <= 5 ? 'Core Platform' : i <= 10 ? 'Frontend UI' : i <= 15 ? 'Quality Engineering' : 'Product Operations',
            title: [1, 6].includes(i) ? 'Engineering Team Lead' : 'Senior Software Engineer',
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

  const handleRoleSelect = (roleKey: 'admin' | 'leader' | 'analyst' | 'member', userEmail: string) => {
    setSelectedRoleKey(roleKey);
    setEmail(userEmail);
    setPassword('123456');
    setError(null);
  };

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

  const handleDirectLaunch = async (targetEmail: string) => {
    setEmail(targetEmail);
    setPassword('123456');
    setError(null);
    setIsSubmitting(true);
    try {
      await login(targetEmail, '123456');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered list for the modal
  const filteredModalUsers = () => {
    let pool: DemoUserItem[] = [];
    if (modalCategory === 'analysts') {
      pool = demoAnalysts;
    } else if (modalCategory === 'leaders') {
      pool = demoEmployees.filter(e => e.teamsLeadingCount > 0);
    } else if (modalCategory === 'members') {
      pool = demoEmployees.filter(e => e.teamsLeadingCount === 0);
    } else {
      pool = [...demoEmployees, ...demoAnalysts];
    }

    if (!personaSearch.trim()) return pool;
    const q = personaSearch.toLowerCase();
    return pool.filter(
      u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.department && u.department.toLowerCase().includes(q)) ||
        (u.title && u.title.toLowerCase().includes(q))
    );
  };

  const keyRoles = [
    {
      key: 'admin' as const,
      title: 'Administrator',
      email: 'admin@netwonite.com',
      badge: 'Full Governance',
      desc: 'Team creation, approval gates, achievement workflows & system settings',
      icon: Crown,
      accentColor: 'border-neutral-900 bg-neutral-900 text-white',
      badgeBg: 'bg-white/20 text-white',
    },
    {
      key: 'leader' as const,
      title: 'Team Leader',
      email: 'employ1@gmail.com',
      badge: 'Sprint Lead',
      desc: 'Sprint tasks, approval queue, rejections audit & member delegation',
      icon: Briefcase,
      accentColor: 'border-blue-600 bg-blue-50/70 text-blue-900',
      badgeBg: 'bg-blue-600 text-white',
    },
    {
      key: 'analyst' as const,
      title: 'Dedicated Analyst',
      email: 'analyst1@gmail.com',
      badge: 'Read-Only Audit',
      desc: 'Cross-team velocity graphs, ongoing work intelligence & SLA audits',
      icon: Eye,
      accentColor: 'border-cyan-600 bg-cyan-50/70 text-cyan-950',
      badgeBg: 'bg-cyan-700 text-white',
    },
    {
      key: 'member' as const,
      title: 'Team Member',
      email: 'employ2@gmail.com',
      badge: 'Execution',
      desc: 'Active sprint execution, deliverable submissions & progress tracking',
      icon: Users,
      accentColor: 'border-neutral-400 bg-white/70 text-neutral-900',
      badgeBg: 'bg-neutral-800 text-white',
    },
  ];

  return (
    <div className="relative h-screen w-screen overflow-hidden flex flex-col justify-center items-center p-2 sm:p-5 bg-gradient-to-br from-zinc-300 via-neutral-100 to-zinc-400 font-sans select-none">
      
      {/* Ambient Depth Blurs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-[650px] h-[650px] bg-white/50 rounded-full blur-[120px] animate-float-orb-1" />
        <div className="absolute -bottom-1/4 -right-1/4 w-[700px] h-[700px] bg-zinc-950/15 rounded-full blur-[140px] animate-float-orb-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-white/35 rounded-full blur-[130px] animate-float-orb-3" />
      </div>

      {/* Subtle Dot Grid Backdrop */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.28) 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Main Glass Showcase Container (Strictly single viewport frame, zero outer scroll) */}
      <div className="relative z-10 w-full max-w-[1240px] h-[92vh] max-h-[760px] rounded-3xl bg-white/55 backdrop-blur-3xl border border-white/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.22),inset_0_1.5px_2px_rgba(255,255,255,0.95)] p-4 sm:p-6 flex flex-col justify-between overflow-hidden">
        
        {/* Specular Top Rim Reflection */}
        <div className="pointer-events-none absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent" />

        {/* Clean Top Navigation Bar (Zone 1: Wordmark — Zone 2: Navigation — Zone 3: CTA Action) */}
        <header className="flex items-center justify-between pb-3 border-b border-black/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-black text-white p-0.5 shadow-md flex items-center justify-center font-black text-base hover:scale-105 transition-transform duration-200">
              N
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight text-neutral-900 leading-none">Netwonite</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-black text-white shadow-xs">
                  Enterprise
                </span>
                <span className="text-[11px] text-neutral-500 font-medium hidden md:inline">
                  · Quantum Agile Workspace
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsAllPersonasModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-neutral-800 border border-neutral-300/80 text-xs font-semibold shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Browse all 20 demo employees and 5 analysts"
            >
              <Users className="h-3.5 w-3.5 text-neutral-600" />
              <span className="hidden sm:inline">Browse</span>
              <span>20 Personas</span>
            </button>

            {onOpenGuide && (
              <button
                type="button"
                onClick={onOpenGuide}
                className="button-glass-shine flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                title="Launch Interactive System Tour"
              >
                <Sparkles className="h-3.5 w-3.5 text-white animate-pulse" />
                <span>Feature Tour</span>
              </button>
            )}
          </div>
        </header>

        {/* 2-Column Balanced Executive Layout (Hero Presentation on Left / Sleek Auth Card on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 my-auto flex-1 min-h-0 items-center py-2">
          
          {/* LEFT COLUMN (lg:col-span-7): The Hero Visual & Orbital Simulation */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full min-h-0 pr-0 lg:pr-2">
            
            {/* Top Heading Area: Quote on Left + Compact 3D Newton's Cradle Right Beside Heading */}
            <div className="shrink-0 mb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/45 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-white/70 shadow-xs">
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-600 uppercase">
                    Netwonite Enterprise
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-bold uppercase tracking-wider bg-neutral-900 text-white shadow-xs">
                    Physics Engine
                  </span>
                </div>
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-neutral-900 leading-snug">
                  There will always be another problem worth solving well.
                </h1>
                <p className="text-[11px] text-neutral-600 font-normal mt-0.5 leading-relaxed line-clamp-2">
                  Newtonite will continue building focused solutions where technology can remove meaningful friction and create durable utility.
                </p>
              </div>

              {/* Compact 3D Newton's Cradle placed directly near heading */}
              <div className="shrink-0 w-full sm:w-[220px] md:w-[235px]">
                <NewtonsCradle3D compact={true} className="w-full h-[105px]" />
              </div>
            </div>

            {/* Central Visual Chamber: Kinetic Orbital Core */}
            <div className="flex-1 min-h-[220px] max-h-[340px] my-1">
              <NewtoniteOrbitalCore
                onQuickLogin={handleDirectLaunch}
                onOpenGuide={onOpenGuide}
              />
            </div>

            {/* 3 Core Architecture Pillars */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-black/10 shrink-0">
              <div className="p-2 rounded-xl bg-white/40 border border-white/60">
                <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold block">Security</span>
                <span className="text-xs font-bold text-neutral-900 block mt-0.5 truncate">Zero-Trust RBAC</span>
              </div>
              <div className="p-2 rounded-xl bg-white/40 border border-white/60">
                <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold block">Execution</span>
                <span className="text-xs font-bold text-neutral-900 block mt-0.5 truncate">Tree & Matrix Sprints</span>
              </div>
              <div className="p-2 rounded-xl bg-white/40 border border-white/60">
                <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold block">Intelligence</span>
                <span className="text-xs font-bold text-neutral-900 block mt-0.5 truncate">Real-Time Audits</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (lg:col-span-5): The Sleek Frosted Glass Authentication Hub */}
          <div className="liquid-sheen-sweep glass-light-card lg:col-span-5 rounded-2xl p-4 sm:p-5 flex flex-col justify-between group relative overflow-hidden text-neutral-900 shadow-xl h-full min-h-0 border border-white/80">
            {/* Top Specular Edge Highlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent" />

            <div className="flex-1 flex flex-col justify-between min-h-0">
              
              {/* Header */}
              <div className="shrink-0 mb-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                    Recruiter Evaluation
                  </h2>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300/60">
                    Live Demo Ready
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600 mt-0.5">
                  Select a persona below to evaluate its role-specific capabilities:
                </p>
              </div>

              {/* 4 Interactive Evaluation Role Cards */}
              <div className="grid grid-cols-2 gap-2 my-1 shrink-0">
                {keyRoles.map(role => {
                  const Icon = role.icon;
                  const isSelected = selectedRoleKey === role.key;
                  return (
                    <button
                      key={role.key}
                      type="button"
                      onClick={() => handleRoleSelect(role.key, role.email)}
                      className={`p-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer border relative overflow-hidden ${
                        isSelected
                          ? 'bg-neutral-950 text-white border-neutral-950 shadow-md ring-2 ring-neutral-950/20 scale-[1.01]'
                          : 'bg-white/70 hover:bg-white text-neutral-800 border-neutral-200/90 hover:border-neutral-400 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-neutral-700'}`} />
                          <span className="text-xs font-bold truncate">{role.title}</span>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        )}
                      </div>
                      <p className={`text-[10px] truncate ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        {role.email}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Direct Credentials Form */}
              <form onSubmit={handleFormSubmit} className="space-y-2 mt-2 shrink-0">
                {error && (
                  <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-shake">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span className="text-[10px]">{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-neutral-700 uppercase tracking-wider mb-0.5">
                    Email Address
                  </label>
                  <div className="relative group/field">
                    <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-neutral-400 group-focus-within/field:text-neutral-900 transition-colors" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="admin@netwonite.com"
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/90 border border-neutral-300 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-700 uppercase tracking-wider mb-0.5">
                    Password
                  </label>
                  <div className="relative group/field">
                    <Lock className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-neutral-400 group-focus-within/field:text-neutral-900 transition-colors" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/90 border border-neutral-300 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || authLoading}
                  className="button-glass-shine w-full py-2.5 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 group/submit mt-2"
                >
                  <span>
                    {isSubmitting
                      ? 'Authenticating...'
                      : `Launch as ${
                          selectedRoleKey === 'admin'
                            ? 'Administrator'
                            : selectedRoleKey === 'leader'
                            ? 'Team Leader'
                            : selectedRoleKey === 'analyst'
                            ? 'Analyst'
                            : 'Team Member'
                        }`}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-white group-hover/submit:translate-x-1 transition-transform" />
                </button>
              </form>

            </div>

            {/* Bottom Utility Link & Metadata */}
            <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-[10px] text-neutral-500 shrink-0 mt-2">
              <button
                type="button"
                onClick={() => setIsAllPersonasModalOpen(true)}
                className="text-neutral-800 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View all 20 demo accounts</span>
                <ChevronRight className="h-3 w-3" />
              </button>
              <span>Demo Pass: <strong className="text-neutral-900">123456</strong></span>
            </div>

          </div>

        </div>

        {/* Clean Footer Bar */}
        <footer className="pt-2.5 border-t border-black/10 flex items-center justify-between text-[11px] text-neutral-600 font-medium shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900">Netwonite Enterprise</span>
            <span>·</span>
            <span>Production RBAC System</span>
            <span>·</span>
            <span className="hidden sm:inline">Express 4.21 + React 19 + Vite 8</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-800 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>20 Personas + 5 Dedicated Analysts Active</span>
          </div>
        </footer>

      </div>

      {/* ====================================================================
          All 20 Personas Directory Modal (Clean, Non-Cluttered Access)
          ==================================================================== */}
      {isAllPersonasModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white/95 backdrop-blur-2xl border border-white p-5 sm:p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] text-neutral-900 flex flex-col justify-between max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-sm">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    Workspace Personas Directory
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Select any pre-configured persona to sign in instantly with 1-click
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAllPersonasModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-black transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="py-3 space-y-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-neutral-400" />
                  <input
                    type="text"
                    value={personaSearch}
                    onChange={e => setPersonaSearch(e.target.value)}
                    placeholder="Search by name, email, or department..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-black transition-all"
                  />
                </div>

                {/* Categories */}
                <div className="flex items-center gap-1 text-[11px] shrink-0">
                  <button
                    type="button"
                    onClick={() => setModalCategory('all')}
                    className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                      modalCategory === 'all'
                        ? 'bg-black text-white font-bold'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    All ({demoEmployees.length + demoAnalysts.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalCategory('leaders')}
                    className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                      modalCategory === 'leaders'
                        ? 'bg-black text-white font-bold'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    Leaders (2)
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalCategory('members')}
                    className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                      modalCategory === 'members'
                        ? 'bg-black text-white font-bold'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    Members (18)
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalCategory('analysts')}
                    className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                      modalCategory === 'analysts'
                        ? 'bg-cyan-700 text-white font-bold'
                        : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-800'
                    }`}
                  >
                    Analysts (5)
                  </button>
                </div>
              </div>

              {/* Scrollable Personas List */}
              <div className="max-h-[360px] overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredModalUsers().map(user => (
                  <div
                    key={user.id}
                    className="p-2.5 rounded-xl bg-white border border-neutral-200 hover:border-black transition-all flex items-center justify-between group shadow-xs hover:shadow-sm"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-neutral-900 truncate">
                          {user.name}
                        </span>
                        {user.role === 'viewer' ? (
                          <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-cyan-100 text-cyan-800 uppercase">
                            Analyst
                          </span>
                        ) : user.teamsLeadingCount > 0 ? (
                          <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 uppercase">
                            Team Lead
                          </span>
                        ) : (
                          <span className="text-[8px] text-neutral-500 font-medium">
                            Member
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-neutral-500 truncate mt-0.5">
                        {user.email}
                      </p>
                      {user.department && (
                        <p className="text-[9px] text-neutral-400 truncate">
                          {user.department}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsAllPersonasModalOpen(false);
                        handleDirectLaunch(user.email);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-black text-white text-[10px] font-bold transition-all shadow-xs cursor-pointer shrink-0 hover:scale-105 active:scale-95"
                    >
                      Sign In
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
              <span>Demo password: <strong className="text-neutral-900">123456</strong></span>
              <button
                type="button"
                onClick={() => setIsAllPersonasModalOpen(false)}
                className="py-1 px-3 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold cursor-pointer transition-colors"
              >
                Close Directory
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
