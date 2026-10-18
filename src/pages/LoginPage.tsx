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
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'leaders' | 'members'>('all');

  useEffect(() => {
    api.getDemoUsers()
      .then(res => {
        const emps = res.users.filter(u => u.role === 'employee');
        setDemoEmployees(emps);
      })
      .catch(() => {
        const fallback: DemoUserItem[] = [];
        for (let i = 1; i <= 20; i++) {
          fallback.push({
            id: `usr-emp-${i}`,
            name: `Employee ${i}`,
            email: `employ${i}@gmail.com`,
            role: 'employee',
            teamsLeadingCount: [1, 6, 11, 16].includes(i) ? 1 : 0,
            teamsMemberOfCount: 1,
          });
        }
        setDemoEmployees(fallback);
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

  const filteredEmployees = demoEmployees.filter(emp => {
    if (selectedCategory === 'leaders') return emp.teamsLeadingCount > 0;
    if (selectedCategory === 'members') return emp.teamsLeadingCount === 0;
    return true;
  });

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center p-3 sm:p-6 overflow-hidden bg-gradient-to-br from-zinc-300 via-neutral-200 to-zinc-400 font-sans select-none">
      {/* Grey Canvas Frosted Ambient Glow Spheres */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/5 w-[500px] h-[500px] bg-white/40 rounded-full blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/5 w-[500px] h-[500px] bg-zinc-950/15 rounded-full blur-[140px]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/50 rounded-full blur-[100px]" />
      </div>

      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(rgba(0, 0, 0, 0.25) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Main Glass Shell */}
      <div className="relative z-10 w-full max-w-6xl max-h-[96vh] rounded-3xl bg-white/55 backdrop-blur-3xl border border-white/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] p-5 sm:p-7 flex flex-col justify-between overflow-y-auto">
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-black/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-black text-white p-0.5 shadow-lg shadow-black/20 flex items-center justify-center font-extrabold text-lg tracking-tighter">
              N
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-neutral-900">Netwonite</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-black text-white shadow-xs">
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black hover:bg-neutral-800 text-white border border-black text-xs font-bold transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                title="Open Interactive Guide"
              >
                <Sparkles className="h-3.5 w-3.5 text-white" />
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
          {/* SECTION 1: Admin Access Card */}
          <div className="liquid-sheen-sweep lg:col-span-3 rounded-2xl bg-black/90 text-white border border-white/20 p-5 flex flex-col justify-between backdrop-blur-2xl shadow-[0_15px_35px_-10px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.15)] hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),0_0_25px_rgba(255,255,255,0.2)] hover:border-white/50 transition-all duration-300 ease-out group">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div>
              <div className="flex items-center gap-2 mb-2 text-white">
                <div className="p-1.5 rounded-lg bg-white/15 border border-white/25 group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-300">
                  <Shield className="h-4 w-4 text-inherit" />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-100">
                  1. Admin Access
                </h2>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Full administrative privileges. Create & manage squads, assign leaders, oversee cross-team workflows.
              </p>
              <div className="mt-4 p-3 rounded-xl bg-neutral-900/90 border border-white/15 shadow-inner hover:border-white/30 transition-colors">
                <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Pre-Configured</p>
                <p className="text-xs font-bold text-white mt-0.5">admin@netwonite.com</p>
                <p className="text-[11px] text-neutral-300 mt-1 font-medium">Role: System Administrator</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin@netwonite.com')}
              disabled={isSubmitting || authLoading}
              className="mt-4 w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider shadow-[0_10px_20px_-5px_rgba(255,255,255,0.2)] hover:shadow-[0_15px_30px_-5px_rgba(255,255,255,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Shield className="h-3.5 w-3.5 text-black" />
              <span>Login as Admin</span>
            </button>
          </div>

          {/* SECTION 2: Employee Personas Card */}
          <div className="liquid-sheen-sweep lg:col-span-5 rounded-2xl bg-white/85 text-neutral-900 border border-white/90 p-5 flex flex-col justify-between backdrop-blur-2xl shadow-[0_15px_35px_-10px_rgba(0,0,0,0.12),0_0_0_1px_rgba(255,255,255,0.8)] hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25),0_0_30px_rgba(255,255,255,0.9)] hover:border-neutral-400 transition-all duration-300 ease-out group">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-black/10 to-transparent" />
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-black">
                  <div className="p-1.5 rounded-lg bg-black text-white group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-4 w-4" />
                  </div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-black">
                    2. Employee Personas
                  </h2>
                </div>
                <div className="flex items-center gap-1 text-[10px]">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-2 py-0.5 rounded-md cursor-pointer transition-all duration-200 hover:scale-105 ${
                      selectedCategory === 'all'
                        ? 'bg-black text-white font-bold shadow-xs'
                        : 'text-neutral-600 hover:text-black bg-neutral-100 hover:bg-neutral-200'
                    }`}
                  >
                    All (20)
                  </button>
                  <button
                    onClick={() => setSelectedCategory('leaders')}
                    className={`px-2 py-0.5 rounded-md cursor-pointer transition-all duration-200 hover:scale-105 ${
                      selectedCategory === 'leaders'
                        ? 'bg-black text-white font-bold shadow-xs'
                        : 'text-neutral-600 hover:text-black bg-neutral-100 hover:bg-neutral-200'
                    }`}
                  >
                    Leaders (4)
                  </button>
                  <button
                    onClick={() => setSelectedCategory('members')}
                    className={`px-2 py-0.5 rounded-md cursor-pointer transition-all duration-200 hover:scale-105 ${
                      selectedCategory === 'members'
                        ? 'bg-black text-white font-bold shadow-xs'
                        : 'text-neutral-600 hover:text-black bg-neutral-100 hover:bg-neutral-200'
                    }`}
                  >
                    Members (16)
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-neutral-600 mb-2 font-medium">
                Click any employee persona to sign in instantaneously (employ1 through employ20):
              </p>

              <div className="grid grid-cols-2 gap-1.5 max-h-48 sm:max-h-56 overflow-y-auto pr-1">
                {filteredEmployees.map(emp => (
                  <button
                    key={emp.id}
                    type="button"
                    onClick={() => handleQuickLogin(emp.email)}
                    disabled={isSubmitting || authLoading}
                    className="p-2 rounded-xl bg-white hover:bg-neutral-900 hover:text-white border border-neutral-200/90 hover:border-black text-left transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.02] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.25)] group/item cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-900 group-hover/item:text-white truncate">
                        {emp.name}
                      </span>
                      {emp.teamsLeadingCount > 0 ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-black text-white group-hover/item:bg-white group-hover/item:text-black uppercase transition-colors">
                          Lead
                        </span>
                      ) : (
                        <span className="text-[9px] text-neutral-400 group-hover/item:text-neutral-300">
                          Mbr
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-neutral-500 group-hover/item:text-neutral-300 truncate mt-0.5">
                      {emp.email}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 text-[10px] text-neutral-500 flex items-center justify-between border-t border-neutral-200/60">
              <span>Demo password: <strong>123456</strong></span>
              <span className="text-neutral-900 font-bold">Persists after refresh</span>
            </div>
          </div>

          {/* SECTION 3: Direct Sign In Form */}
          <div className="liquid-sheen-sweep lg:col-span-4 rounded-2xl bg-neutral-950/90 text-white border border-white/20 p-5 flex flex-col justify-between backdrop-blur-2xl shadow-[0_15px_35px_-10px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.15)] hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),0_0_25px_rgba(255,255,255,0.2)] hover:border-white/50 transition-all duration-300 ease-out group">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div>
              <div className="flex items-center gap-2 mb-2 text-white">
                <div className="p-1.5 rounded-lg bg-white/15 border border-white/25 group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-300">
                  <Lock className="h-4 w-4 text-inherit" />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-100">
                  3. Direct Sign In
                </h2>
              </div>
              <p className="text-xs text-neutral-400 mb-4">
                Enter account credentials to access your workspace.
              </p>

              {error && (
                <div className="mb-3 p-2.5 rounded-xl bg-neutral-900 border border-white/40 text-neutral-200 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-white" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="employ1@gmail.com"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/70 border border-white/20 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/40 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/70 border border-white/20 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/40 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || authLoading}
                  className="mt-4 w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider shadow-[0_10px_20px_-5px_rgba(255,255,255,0.2)] hover:shadow-[0_15px_30px_-5px_rgba(255,255,255,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Workspace'}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-black" />
                </button>
              </form>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 text-center">
              <span className="text-[11px] text-neutral-400">
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
          <div className="flex items-center gap-1.5 text-neutral-900 font-bold">
            <UserCheck className="h-3.5 w-3.5 text-black" />
            <span>20 Demo Employees + 1 Administrator Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};
