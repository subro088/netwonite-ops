import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  Compass,
  X,
  Shield,
  Lightbulb,
  Sparkles,
  CheckSquare,
  BarChart3,
  Layers,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Flame,
  Users2,
  Lock,
  ArrowRightLeft,
  ChevronRight,
  HelpCircle,
  FileText,
  Workflow,
  Eye,
  GitPullRequest,
  Check,
  AlertCircle,
  Send,
  Sliders,
  TrendingUp,
} from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string, params?: any) => void;
}

type GuideTab = 'quickstart' | 'admin' | 'leader' | 'member' | 'viewer' | 'workflow' | 'demo';

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { switchPersona, isAdmin, isViewer, teamsLeading } = useAuth();
  const [activeTab, setActiveTab] = useState<GuideTab>('quickstart');

  if (!isOpen) return null;

  const handleAction = async (personaEmail?: string, targetPage?: string, navParams?: any) => {
    if (personaEmail) {
      await switchPersona(personaEmail);
    }
    if (targetPage) {
      onNavigate(targetPage, navParams);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Frosted Glass Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-5xl rounded-3xl bg-white/95 backdrop-blur-3xl border border-white/80 shadow-2xl p-5 sm:p-7 z-10 animate-in zoom-in-95 duration-200 max-h-[94vh] flex flex-col justify-between overflow-hidden text-slate-800">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 border border-emerald-400/40 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-700/20">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Netwonite Operations Guide & Visual Tour
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
                  English Reference Guide
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Visual step-by-step walkthrough for Administrators, Team Leads, Squad Members, and Viewer Analysts.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close Guide"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="py-2.5 flex items-center gap-1.5 border-b border-slate-100 overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('quickstart')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'quickstart'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
            <span>Dashboard Tour</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'admin'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Admin Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('leader')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'leader'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Team Lead Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('member')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'member'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CheckSquare className="h-3.5 w-3.5" />
            <span>Member Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('viewer')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'viewer'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-purple-700 hover:text-purple-900 hover:bg-purple-50 border border-purple-200'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Viewer Analyst Guide</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-200 text-purple-900 font-bold">5 Analysts</span>
          </button>

          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'workflow'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Task Lifecycle</span>
          </button>

          <button
            onClick={() => setActiveTab('demo')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'demo'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users2 className="h-3.5 w-3.5" />
            <span>25 Demo Accounts</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="py-4 overflow-y-auto flex-1 space-y-5 pr-1 text-xs text-slate-700 leading-relaxed">
          
          {/* TAB 1: QUICKSTART & DASHBOARD TOUR */}
          {activeTab === 'quickstart' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200">
                <h3 className="text-sm font-bold text-emerald-950 mb-1.5 flex items-center gap-2">
                  <Compass className="h-4 w-4 text-emerald-600" />
                  How to Use the Netwonite Dashboard (New User Overview)
                </h3>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Netwonite is an enterprise operations platform that segregates roles so teams can delegate work across squads, claim tasks transparently, enforce quality review gates, and analyze complete operational velocity.
                </p>
              </div>

              {/* Visual Architecture Diagram */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md">
                <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Sliders className="h-3.5 w-3.5" />
                    Interactive Workspace Layout Architecture
                  </span>
                  <span className="text-[10px] text-slate-400">All key controls at a glance</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  {/* Left Column: Sidebar Representation */}
                  <div className="md:col-span-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold mb-1.5">
                        1. Left Sidebar
                      </div>
                      <div className="space-y-1 text-[11px] text-slate-300">
                        <div className="p-1 rounded bg-slate-700/60 font-semibold text-slate-200">Governance Links:</div>
                        <div className="pl-2 text-slate-400">&bull; Dashboard Home</div>
                        <div className="pl-2 text-slate-400">&bull; Squad Registry</div>
                        <div className="pl-2 text-slate-400">&bull; User Directory</div>
                        <div className="pl-2 text-slate-400">&bull; Workflows Tree</div>
                        <div className="p-1 rounded bg-slate-700/60 font-semibold text-slate-200 mt-2">Work Execution:</div>
                        <div className="pl-2 text-slate-400">&bull; Work Items / Tasks</div>
                        <div className="pl-2 text-slate-400">&bull; Ongoing Work</div>
                        <div className="pl-2 text-slate-400">&bull; Approvals Queue</div>
                        <div className="pl-2 text-slate-400">&bull; Rejections Review</div>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-700 text-[10px] text-slate-400">
                      Collapsible sidebar to expand your view.
                    </div>
                  </div>

                  {/* Middle Column: Top Navigation Bar & Action Metric Cards */}
                  <div className="md:col-span-9 space-y-3">
                    {/* Top Navbar Representation */}
                    <div className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="text-[10px] font-mono uppercase text-teal-300 font-bold">
                          2. Top Navbar
                        </div>
                        <span className="text-[11px] text-slate-300">Netwonite Ops</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                          Live Persona Switcher
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                          Quick Guide
                        </span>
                      </div>
                    </div>

                    {/* Metric Cards Representation */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50">
                        <div className="text-[9px] font-mono text-emerald-400 uppercase font-semibold">Active Work</div>
                        <div className="text-base font-bold text-white mt-0.5">Live Queue</div>
                        <div className="text-[9px] text-slate-400 mt-0.5">Click to view tasks</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-teal-950/40 border border-teal-800/50">
                        <div className="text-[9px] font-mono text-teal-400 uppercase font-semibold">Approvals</div>
                        <div className="text-base font-bold text-white mt-0.5">Review Gate</div>
                        <div className="text-[9px] text-slate-400 mt-0.5">Lead verification</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/50">
                        <div className="text-[9px] font-mono text-rose-400 uppercase font-semibold">Rejections</div>
                        <div className="text-base font-bold text-white mt-0.5">Feedback Hub</div>
                        <div className="text-[9px] text-slate-400 mt-0.5">Notes for revisions</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/50">
                        <div className="text-[9px] font-mono text-purple-400 uppercase font-semibold">Analytics</div>
                        <div className="text-base font-bold text-white mt-0.5">360° Audit</div>
                        <div className="text-[9px] text-slate-400 mt-0.5">Dedicated analysts</div>
                      </div>
                    </div>

                    {/* Main Stage Workspace Representation */}
                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 text-[11px] text-slate-300 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white">3. Main Workspace Stage:</span> Dynamically adapts to your role &ndash; showing Admin trees, Leader approval queues, Member task boards, or Viewer audit reports.
                      </div>
                      <span className="text-[10px] px-2 py-1 rounded bg-slate-700 text-slate-300 font-mono shrink-0">
                        Responsive Stage
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Permissions Matrix Table */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-slate-700" />
                    Quick Role Comparison Matrix
                  </h4>
                  <span className="text-[10px] text-slate-400">Governance & capability breakdown</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-mono uppercase text-[10px]">
                        <th className="pb-2 font-semibold">Capability</th>
                        <th className="pb-2 font-semibold text-amber-700">Admin</th>
                        <th className="pb-2 font-semibold text-teal-700">Team Lead</th>
                        <th className="pb-2 font-semibold text-indigo-700">Member</th>
                        <th className="pb-2 font-semibold text-purple-700">Viewer Analyst</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr>
                        <td className="py-2 font-medium">Create & Delete Squads</td>
                        <td className="py-2 text-emerald-600 font-bold">Yes (Full Authority)</td>
                        <td className="py-2 text-slate-400">No</td>
                        <td className="py-2 text-slate-400">No</td>
                        <td className="py-2 text-slate-400">Read-Only</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">Create & Delegate Tasks</td>
                        <td className="py-2 text-emerald-600 font-bold">Yes</td>
                        <td className="py-2 text-emerald-600 font-bold">Yes (To Squads)</td>
                        <td className="py-2 text-slate-400">No</td>
                        <td className="py-2 text-slate-400">Read-Only</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">Claim Tasks for Work</td>
                        <td className="py-2 text-slate-400">No</td>
                        <td className="py-2 text-slate-400">No (Cannot self-claim)</td>
                        <td className="py-2 text-emerald-600 font-bold">Yes (Squad work)</td>
                        <td className="py-2 text-slate-400">Read-Only</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">Approve or Reject Submissions</td>
                        <td className="py-2 text-emerald-600 font-bold">Yes</td>
                        <td className="py-2 text-emerald-600 font-bold">Yes (Own created)</td>
                        <td className="py-2 text-slate-400">No</td>
                        <td className="py-2 text-slate-400">Read-Only</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">Full Operations Analytics & Claims Audit</td>
                        <td className="py-2 text-emerald-600 font-bold">Yes</td>
                        <td className="py-2 text-slate-600">Squad Only</td>
                        <td className="py-2 text-slate-600">Personal Only</td>
                        <td className="py-2 text-purple-700 font-bold">Yes (Full 360° Audit)</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">Admin Modification Protection</td>
                        <td className="py-2 text-slate-400">N/A</td>
                        <td className="py-2 text-slate-400">Editable by Admin</td>
                        <td className="py-2 text-slate-400">Editable by Admin</td>
                        <td className="py-2 text-purple-700 font-bold">Tamper-Proof (Immune)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADMINISTRATOR GUIDE */}
          {activeTab === 'admin' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <h3 className="text-sm font-bold text-amber-950 mb-1 flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-amber-700" />
                  Administrator Operations Guide
                </h3>
                <p className="text-xs text-amber-900 leading-relaxed">
                  As an Administrator, you govern the entire company structure: provisioning squads, managing user accounts, auditing company-wide achievements, and overseeing global operations.
                </p>
              </div>

              {/* Visual Flow Pipeline for Admin */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Admin Operational Workflow Sequence:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex flex-col items-center">
                    <span className="font-bold text-amber-950 text-xs">1. Squad Registry</span>
                    <span className="text-[10px] text-amber-800 mt-1">Create teams & assign leaders</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex flex-col items-center">
                    <span className="font-bold text-amber-950 text-xs">2. User Directory</span>
                    <span className="text-[10px] text-amber-800 mt-1">Manage 20 employees & roles</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex flex-col items-center">
                    <span className="font-bold text-amber-950 text-xs">3. Workflows Dual-View</span>
                    <span className="text-[10px] text-amber-800 mt-1">Org Tree & Velocity charts</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex flex-col items-center">
                    <span className="font-bold text-amber-950 text-xs">4. Global Oversight</span>
                    <span className="text-[10px] text-amber-800 mt-1">Audit company achievements</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">
                  Where to Go & What to Do (Step-by-Step):
                </h4>

                {/* Step 1: Admin Dashboard */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-[10px] font-bold">
                        Screen 1
                      </span>
                      Admin Dashboard (Home)
                    </span>
                    <button
                      onClick={() => handleAction('admin@netwonite.com', 'dashboard')}
                      className="px-2 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[10px] cursor-pointer"
                    >
                      Open Dashboard &rarr;
                    </button>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-700 flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                      Navigation Path:
                    </span>
                    Click <strong>"Dashboard"</strong> at the top of the left sidebar.
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 pl-1">
                    <li>View global company metrics: Total Teams, Active Employees, Overall Task Velocity, and Pending Approvals.</li>
                    <li>Inspect the recent activity feed across all squads in real time.</li>
                  </ul>
                </div>

                {/* Step 2: Manage Teams */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-[10px] font-bold">
                        Screen 2
                      </span>
                      Squad Registry (Manage Teams)
                    </span>
                    <button
                      onClick={() => handleAction('admin@netwonite.com', 'manage-teams')}
                      className="px-2 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[10px] cursor-pointer"
                    >
                      Open Squads &rarr;
                    </button>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-700 flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                      Navigation Path:
                    </span>
                    Click <strong>"Squad Registry"</strong> in the left sidebar.
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 pl-1">
                    <li><strong>Create a New Squad:</strong> Click "+ Create Squad", enter squad name (e.g. "Team Phoenix"), set department, and select a Team Leader.</li>
                    <li><strong>Assign or Change Team Leader:</strong> Select any team to change its assigned leader anytime.</li>
                    <li><strong>Squad Rosters:</strong> View all members currently belonging to each squad.</li>
                  </ul>
                </div>

                {/* Step 3: Manage Users */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-[10px] font-bold">
                        Screen 3
                      </span>
                      User Directory & Persona Governance
                    </span>
                    <button
                      onClick={() => handleAction('admin@netwonite.com', 'manage-users')}
                      className="px-2 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[10px] cursor-pointer"
                    >
                      Open Directory &rarr;
                    </button>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-700 flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                      Navigation Path:
                    </span>
                    Click <strong>"Directory & Personas"</strong> in the left sidebar.
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 pl-1">
                    <li>Browse the complete 20-employee roster and view user status, assigned squads, and roles.</li>
                    <li><strong>Viewer Protection Rule:</strong> The 5 Viewer Analyst accounts (<code>analyst1</code> to <code>analyst5</code>) are protected system roles. Even the Admin cannot delete or downgrade them, ensuring immutable auditing.</li>
                    <li>Click "Switch" next to any employee to test what they see immediately.</li>
                  </ul>
                </div>

                {/* Step 4: Workflows & Achievements */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-[10px] font-bold">
                        Screen 4
                      </span>
                      Workflows & Achievements Dual View
                    </span>
                    <button
                      onClick={() => handleAction('admin@netwonite.com', 'admin-workflows-achievements')}
                      className="px-2 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[10px] cursor-pointer"
                    >
                      Open Dual View &rarr;
                    </button>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-700 flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                      Navigation Path:
                    </span>
                    Click <strong>"Workflows & Achievements"</strong> in the left sidebar.
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 pl-1">
                    <li><strong>Tree Hierarchy View:</strong> Interactive visual tree of teams, leaders, members, and their assigned tasks.</li>
                    <li><strong>Performance Bar Chart View:</strong> Comparative velocity graphs showing completion rates, resolved tasks, and quality scores for all employees.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TEAM LEAD GUIDE */}
          {activeTab === 'leader' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
                <h3 className="text-sm font-bold text-teal-950 mb-1 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-teal-700" />
                  Team Lead ("Leader") Operations Guide
                </h3>
                <p className="text-xs text-teal-900 leading-relaxed">
                  Team Leads drive cross-squad delegation and maintain operational quality. Leads create work for destination squads and act as the approval authority for completed deliverables.
                </p>
              </div>

              {/* Visual Flow Pipeline for Team Lead */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Team Lead Operational Workflow Sequence:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 flex flex-col items-center">
                    <span className="font-bold text-teal-950 text-xs">1. Create Task</span>
                    <span className="text-[10px] text-teal-800 mt-1">Specify target squad & urgency</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 flex flex-col items-center">
                    <span className="font-bold text-teal-950 text-xs">2. Member Claims</span>
                    <span className="text-[10px] text-teal-800 mt-1">Anti-self-claim enforced</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 flex flex-col items-center">
                    <span className="font-bold text-teal-950 text-xs">3. Review Submission</span>
                    <span className="text-[10px] text-teal-800 mt-1">Inspect URL and proofs</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 flex flex-col items-center">
                    <span className="font-bold text-teal-950 text-xs">4. Approve / Reject</span>
                    <span className="text-[10px] text-teal-800 mt-1">Mandatory feedback on rejection</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">
                  Where to Go & What to Do (Step-by-Step):
                </h4>

                {/* Step 1: Delegating Tasks */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-mono text-[10px] font-bold">
                        Step 1
                      </span>
                      Cross-Squad Task Creation & Delegation
                    </span>
                    <button
                      onClick={() => handleAction('employ1@gmail.com', 'tasks')}
                      className="px-2 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-[10px] cursor-pointer"
                    >
                      Go to Tasks &rarr;
                    </button>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-700 flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold uppercase text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                      Navigation Path:
                    </span>
                    Go to <strong>"Work Items / Tasks"</strong> &rarr; Click the <strong>"+ Create Task"</strong> button (top right).
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 pl-1">
                    <li>Enter task title, detailed deliverable instructions, and due date.</li>
                    <li><strong>Choose Destination Squad:</strong> Assign the task to a specific team (e.g. Team Paper or Team Alpha).</li>
                    <li><strong>Priority Setting:</strong> Choose Low, Medium, High, or Urgent.</li>
                    <li><strong>Anti-Self-Claim Rule:</strong> The system ensures you cannot claim tasks you created. Eligible members of the target squad must claim them.</li>
                  </ul>
                </div>

                {/* Step 2: Approvals Queue */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-mono text-[10px] font-bold">
                        Step 2
                      </span>
                      Reviewing Submissions in Approvals Queue
                    </span>
                    <button
                      onClick={() => handleAction('employ1@gmail.com', 'approvals')}
                      className="px-2 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-[10px] cursor-pointer"
                    >
                      Open Approvals &rarr;
                    </button>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-700 flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold uppercase text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                      Navigation Path:
                    </span>
                    Click <strong>"Approvals"</strong> in the left sidebar.
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 pl-1">
                    <li>When a team member finishes a task and clicks "Submit for Review", it lands here.</li>
                    <li>Click on the task card to inspect the deliverable URL, summary, and timestamp.</li>
                    <li><strong>To Approve:</strong> Click the green <strong>"Approve Deliverable"</strong> button. Task status instantly transitions to <strong>Resolved</strong> and points are credited.</li>
                    <li><strong>To Reject:</strong> Click the red <strong>"Reject"</strong> button. You MUST enter a clear rejection explanation. The task transitions to <strong>Rejected</strong> and alerts the assignee to revise it.</li>
                  </ul>
                </div>

                {/* Step 3: Squad Leadership Dashboard */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-mono text-[10px] font-bold">
                        Step 3
                      </span>
                      Squad Leadership Dashboard
                    </span>
                    <button
                      onClick={() => handleAction('employ1@gmail.com', 'my-team-leader')}
                      className="px-2 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-[10px] cursor-pointer"
                    >
                      Open Lead View &rarr;
                    </button>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-700 flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold uppercase text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                      Navigation Path:
                    </span>
                    Click <strong>"Team Leadership"</strong> in the left sidebar.
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 pl-1">
                    <li>Track team member workload, identify idle members or overloaded individuals.</li>
                    <li>Monitor squad velocity and completion percentage.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SQUAD MEMBER GUIDE */}
          {activeTab === 'member' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
                <h3 className="text-sm font-bold text-indigo-950 mb-1 flex items-center gap-1.5">
                  <CheckSquare className="h-4 w-4 text-indigo-700" />
                  Squad Member Operations Guide
                </h3>
                <p className="text-xs text-indigo-900 leading-relaxed">
                  As a Squad Member, your role is to execute tasks assigned to your squad, deliver quality deliverables, and submit them for team lead verification.
                </p>
              </div>

              {/* Visual Flow Pipeline for Squad Member */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Squad Member Execution Workflow:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 flex flex-col items-center">
                    <span className="font-bold text-indigo-950 text-xs">1. Browse Pool</span>
                    <span className="text-[10px] text-indigo-800 mt-1">View available squad tasks</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 flex flex-col items-center">
                    <span className="font-bold text-indigo-950 text-xs">2. Claim Task</span>
                    <span className="text-[10px] text-indigo-800 mt-1">Locks task to your name</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 flex flex-col items-center">
                    <span className="font-bold text-indigo-950 text-xs">3. In Progress</span>
                    <span className="text-[10px] text-indigo-800 mt-1">Produce work & code</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 flex flex-col items-center">
                    <span className="font-bold text-indigo-950 text-xs">4. Submit Deliverable</span>
                    <span className="text-[10px] text-indigo-800 mt-1">Attach PR link & notes</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">
                  Where to Go & What to Do (Step-by-Step):
                </h4>

                {/* Step 1: Claiming Work */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-mono text-[10px] font-bold">
                        Step 1
                      </span>
                      Finding & Claiming Open Squad Tasks
                    </span>
                    <button
                      onClick={() => handleAction('employ2@gmail.com', 'tasks', { filter: 'available' })}
                      className="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[10px] cursor-pointer"
                    >
                      Find Tasks &rarr;
                    </button>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-700 flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold uppercase text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                      Navigation Path:
                    </span>
                    Click <strong>"Work Items / Tasks"</strong> in the left sidebar.
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 pl-1">
                    <li>Filter by "Available to Claim" or look for tasks with status <strong>"New"</strong> assigned to your squad.</li>
                    <li>Click the <strong>"Claim Task"</strong> button. The task is now officially assigned to you, and your name appears as the assignee.</li>
                  </ul>
                </div>

                {/* Step 2: Working & Updating Progress */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-mono text-[10px] font-bold">
                        Step 2
                      </span>
                      Managing Ongoing Work
                    </span>
                    <button
                      onClick={() => handleAction('employ2@gmail.com', 'ongoing-work')}
                      className="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[10px] cursor-pointer"
                    >
                      Ongoing Work &rarr;
                    </button>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-700 flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold uppercase text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                      Navigation Path:
                    </span>
                    Click <strong>"Ongoing Work"</strong> in the left sidebar.
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 pl-1">
                    <li>Click on your claimed task to open the details view.</li>
                    <li>Update the status from "Assigned" to <strong>"In Progress"</strong> as you begin active work.</li>
                    <li>Check due dates and high-priority tags to maintain your on-time score.</li>
                  </ul>
                </div>

                {/* Step 3: Submitting Work */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-mono text-[10px] font-bold">
                        Step 3
                      </span>
                      Submitting Deliverables for Approval
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-700 flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold uppercase text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                      Navigation Path:
                    </span>
                    Located inside the task details view when work is completed.
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 pl-1">
                    <li>Click <strong>"Submit for Approval"</strong>.</li>
                    <li>Provide deliverable links, PR URLs, or summary notes.</li>
                    <li>The status changes to <strong>"Awaiting Approval"</strong> and alerts the creating Team Lead.</li>
                  </ul>
                </div>

                {/* Step 4: Rejections & Resubmissions */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-mono text-[10px] font-bold">
                        Step 4
                      </span>
                      Handling Rejections & Fixes
                    </span>
                    <button
                      onClick={() => handleAction('employ2@gmail.com', 'rejections')}
                      className="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[10px] cursor-pointer"
                    >
                      Rejections Page &rarr;
                    </button>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-700 flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold uppercase text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                      Navigation Path:
                    </span>
                    Click <strong>"Rejections"</strong> in the left sidebar.
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 pl-1">
                    <li>If a lead rejects your submission, check the Rejections tab to read their feedback notes.</li>
                    <li>Revise your deliverable based on the lead's critique, update notes, and resubmit for approval.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: VIEWER ANALYST GUIDE */}
          {activeTab === 'viewer' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-fuchsia-50 to-pink-50 border border-purple-200">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-sm font-bold text-purple-950 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-purple-700" />
                    Dedicated Viewer Analyst Operations & Intelligence Guide
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-200 text-purple-900 font-bold">
                    System Protected Role
                  </span>
                </div>
                <p className="text-xs text-purple-900 leading-relaxed">
                  Viewer Analysts are 5 pre-configured, tamper-proof system accounts dedicated to independent auditing and operations governance. Admins cannot edit, delete, or demote these accounts.
                </p>
              </div>

              {/* Visual Flow Pipeline for Viewer Analyst */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Analyst 360° Operational Audit Workflow:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 flex flex-col items-center">
                    <span className="font-bold text-purple-950 text-xs">1. Creation Audit</span>
                    <span className="text-[10px] text-purple-800 mt-1">Track which squad created what</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 flex flex-col items-center">
                    <span className="font-bold text-purple-950 text-xs">2. Claiming Audit</span>
                    <span className="text-[10px] text-purple-800 mt-1">Identify unclaimed bottlenecks</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 flex flex-col items-center">
                    <span className="font-bold text-purple-950 text-xs">3. Live Lifecycle</span>
                    <span className="text-[10px] text-purple-800 mt-1">Track pipeline progression</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 flex flex-col items-center">
                    <span className="font-bold text-purple-950 text-xs">4. Approval vs Rejection</span>
                    <span className="text-[10px] text-purple-800 mt-1">Inspect rejection rate %</span>
                  </div>
                </div>
              </div>

              {/* The 5 Dedicated Analyst Accounts */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <h4 className="font-bold text-slate-900 text-xs mb-2 flex items-center justify-between">
                  <span>The 5 Pre-Configured Dedicated Viewer Analysts</span>
                  <span className="text-[10px] text-slate-500 font-normal">Click switch to test any account</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {[
                    { email: 'analyst1@gmail.com', name: 'Sophia Martinez', title: 'Lead Operations Analyst', dept: 'Operations Intelligence' },
                    { email: 'analyst2@gmail.com', name: 'Daniel Cooper', title: 'Workflow Intelligence Analyst', dept: 'Workflow Audit' },
                    { email: 'analyst3@gmail.com', name: 'Fatima Al-Mansoor', title: 'Compliance & Audit Analyst', dept: 'Governance & Compliance' },
                    { email: 'analyst4@gmail.com', name: 'Rohan Verma', title: 'Sprint Velocity Analyst', dept: 'Engineering Velocity' },
                    { email: 'analyst5@gmail.com', name: 'Zoe Andersson', title: 'Cross-Team Productivity Analyst', dept: 'Cross-Team Intelligence' },
                  ].map((analyst, idx) => (
                    <div key={analyst.email} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="truncate pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 text-xs truncate">{analyst.name}</span>
                          <span className="text-[9px] px-1 rounded bg-purple-100 text-purple-800 font-mono font-bold">
                            #{idx + 1}
                          </span>
                        </div>
                        <div className="text-[10px] text-purple-700 font-medium truncate">{analyst.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">{analyst.email}</div>
                      </div>
                      <button
                        onClick={() => handleAction(analyst.email, 'viewer-analytics')}
                        className="px-2 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] cursor-pointer shrink-0"
                      >
                        Switch
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* What Viewer Analysts See & Can Do */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">
                  What Can the Viewer Analyst Analyze? (4 Core Capabilities):
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="h-6 w-6 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                        1
                      </div>
                      <h5 className="font-bold text-slate-900 text-xs">Work Creation Analysis</h5>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      See exactly which squad and which lead created each task, when it was initiated, and the distribution of tasks dispatched across squads.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="h-6 w-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                        2
                      </div>
                      <h5 className="font-bold text-slate-900 text-xs">Task Claiming & Ownership Audit</h5>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Filter specifically for <strong>Claimed</strong> vs <strong>Unclaimed</strong> work. Identify who claimed each deliverable and discover squad bottlenecks where tasks sit unclaimed.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="h-6 w-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                        3
                      </div>
                      <h5 className="font-bold text-slate-900 text-xs">Execution Lifecycle Tracking</h5>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Live status breakdown across all squads: New &rarr; Assigned &rarr; In Progress &rarr; Awaiting Review &rarr; Resolved &rarr; Rejected.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="h-6 w-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                        4
                      </div>
                      <h5 className="font-bold text-slate-900 text-xs">Approvals vs Rejections Analytics</h5>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Detailed review breakdown: Approval rates %, rejection rate %, lead audit notes, and reasons why work was rejected or approved.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-purple-950 text-xs">Ready to inspect the live analytics dashboard?</h5>
                    <p className="text-[11px] text-purple-800">
                      Log in as Sophia Martinez (Analyst 1) and open the 360° Operations Analytics view now.
                    </p>
                  </div>
                  <button
                    onClick={() => handleAction('analyst1@gmail.com', 'viewer-analytics')}
                    className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    Open Viewer Dashboard &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: TASK LIFECYCLE & GOVERNANCE */}
          {activeTab === 'workflow' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <h3 className="text-sm font-bold text-emerald-950 mb-1 flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-emerald-600" />
                  The 5-Stage Task Lifecycle & Governance Rules
                </h3>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Every work item travels through a rigorous 5-stage pipeline designed to eliminate ambiguity, ensure separation of duties, and preserve immutable audit logs.
                </p>
              </div>

              {/* Visual Lifecycle Pipeline Diagram */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-3">
                  Visual Task State Flow & Decision Gate:
                </span>
                
                <div className="space-y-3">
                  {/* Pipeline Horizontal Flow */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-900">Stage 1</span>
                        <span className="text-[10px] text-blue-700 font-semibold">Created</span>
                      </div>
                      <h5 className="font-bold text-slate-900 text-xs">NEW</h5>
                      <p className="text-[10px] text-slate-500 mt-1">Dispatched to squad pool</p>
                    </div>

                    <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-900">Stage 2</span>
                        <span className="text-[10px] text-indigo-700 font-semibold">Claimed</span>
                      </div>
                      <h5 className="font-bold text-slate-900 text-xs">ASSIGNED</h5>
                      <p className="text-[10px] text-slate-500 mt-1">Member clicks claim task</p>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">Stage 3</span>
                        <span className="text-[10px] text-amber-700 font-semibold">Active</span>
                      </div>
                      <h5 className="font-bold text-slate-900 text-xs">IN PROGRESS</h5>
                      <p className="text-[10px] text-slate-500 mt-1">Executing & building work</p>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-purple-100 text-purple-900">Stage 4</span>
                        <span className="text-[10px] text-purple-700 font-semibold">Submitted</span>
                      </div>
                      <h5 className="font-bold text-slate-900 text-xs">AWAITING REVIEW</h5>
                      <p className="text-[10px] text-slate-500 mt-1">Lands in lead approval queue</p>
                    </div>
                  </div>

                  {/* Stage 5 Branching Decision Gate */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <GitPullRequest className="h-3.5 w-3.5 text-slate-600" />
                        Stage 5 Decision Gate: Lead Verification Outcome
                      </span>
                      <span className="text-[10px] text-slate-500">Dual branching flow</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <h6 className="font-bold text-emerald-950 text-xs">Branch A: APPROVED (RESOLVED)</h6>
                        </div>
                        <p className="text-[11px] text-emerald-800">
                          Lead clicks <strong>"Approve Deliverable"</strong>. Status permanently becomes <strong>Resolved</strong>. Assignee earns full achievement points and sprint velocity increases.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-300">
                        <div className="flex items-center gap-2 mb-1">
                          <XCircle className="h-4 w-4 text-rose-600" />
                          <h6 className="font-bold text-rose-950 text-xs">Branch B: REJECTED (REVISE)</h6>
                        </div>
                        <p className="text-[11px] text-rose-800">
                          Lead clicks <strong>"Reject"</strong> and enters mandatory feedback notes. Status switches to <strong>Rejected</strong>. Task moves to assignee's Rejections queue for revision and resubmission.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Strict Governance Policy Rules */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">
                  Core Operational Governance Rules:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900 text-xs block mb-1">1. Anti-Self-Claim</span>
                    <p className="text-[11px] text-slate-600">
                      A task creator cannot claim their own task. Only eligible destination squad members can claim and execute work.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900 text-xs block mb-1">2. Mandatory Feedback</span>
                    <p className="text-[11px] text-slate-600">
                      Rejections require explicit critique explaining what needs fixing before a lead can submit the rejection.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900 text-xs block mb-1">3. Immutable Auditing</span>
                    <p className="text-[11px] text-slate-600">
                      Viewer analysts preserve independent observation logs that cannot be altered, ensuring full operational accountability.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: 25 DEMO PERSONAS */}
          {activeTab === 'demo' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Instant Persona Switcher</h4>
                  <p className="text-[11px] text-slate-500">
                    Switch to any account with 1 click to experience their specific dashboard and permissions.
                  </p>
                </div>
                <span className="text-[11px] font-mono bg-white px-2 py-1 rounded-lg border border-slate-200 font-bold text-slate-700">
                  Total: 25 Personas
                </span>
              </div>

              {/* Group 1: Global Admin */}
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800">
                  Global Administrator (1 Account)
                </span>
                <div className="mt-1.5 p-3 rounded-xl bg-amber-50/50 border border-amber-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-xs">admin@netwonite.com</span>
                    <p className="text-[10px] text-slate-500">Global System Administrator (Full Workspace Governance)</p>
                  </div>
                  <button
                    onClick={() => handleAction('admin@netwonite.com', 'dashboard')}
                    className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] cursor-pointer"
                  >
                    Switch as Admin
                  </button>
                </div>
              </div>

              {/* Group 2: Viewer Analysts */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-800">
                    Dedicated Viewer Analysts (5 Protected Accounts)
                  </span>
                  <span className="text-[10px] text-purple-700 font-semibold">Non-editable by Admin</span>
                </div>
                <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { email: 'analyst1@gmail.com', name: 'Sophia Martinez', title: 'Lead Operations Analyst' },
                    { email: 'analyst2@gmail.com', name: 'Daniel Cooper', title: 'Workflow Intelligence' },
                    { email: 'analyst3@gmail.com', name: 'Fatima Al-Mansoor', title: 'Compliance & Audit' },
                    { email: 'analyst4@gmail.com', name: 'Rohan Verma', title: 'Sprint Velocity' },
                    { email: 'analyst5@gmail.com', name: 'Zoe Andersson', title: 'Cross-Team Productivity' },
                  ].map(a => (
                    <div key={a.email} className="p-2.5 rounded-xl bg-purple-50/40 border border-purple-200 flex items-center justify-between">
                      <div className="truncate pr-2">
                        <span className="font-bold text-slate-900 text-xs block truncate">{a.name}</span>
                        <span className="text-[10px] text-purple-700 truncate block">{a.title}</span>
                        <span className="text-[9px] text-slate-400 font-mono truncate block">{a.email}</span>
                      </div>
                      <button
                        onClick={() => handleAction(a.email, 'viewer-analytics')}
                        className="px-2 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] cursor-pointer shrink-0"
                      >
                        Switch
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Group 3: Team Leads */}
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-800">
                  Team Leaders (2 Accounts)
                </span>
                <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-teal-50/50 border border-teal-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">Alex Chen (employ1@gmail.com)</span>
                      <span className="text-[10px] text-teal-700 block">Lead: Team Rock & Team Nexus</span>
                    </div>
                    <button
                      onClick={() => handleAction('employ1@gmail.com', 'my-team-leader')}
                      className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10px] cursor-pointer"
                    >
                      Switch
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-teal-50/50 border border-teal-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">David Kim (employ6@gmail.com)</span>
                      <span className="text-[10px] text-teal-700 block">Lead: Team Paper & Team Alpha</span>
                    </div>
                    <button
                      onClick={() => handleAction('employ6@gmail.com', 'my-team-leader')}
                      className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10px] cursor-pointer"
                    >
                      Switch
                    </button>
                  </div>
                </div>
              </div>

              {/* Group 4: Squad Members */}
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-800">
                  Squad Members Sample (18 Members Roster)
                </span>
                <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">Jordan Taylor (employ2@gmail.com)</span>
                      <span className="text-[10px] text-indigo-700 block">Member: Team Rock & Nexus</span>
                    </div>
                    <button
                      onClick={() => handleAction('employ2@gmail.com', 'tasks')}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] cursor-pointer"
                    >
                      Switch
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">Priya Patel (employ7@gmail.com)</span>
                      <span className="text-[10px] text-indigo-700 block">Member: Team Paper</span>
                    </div>
                    <button
                      onClick={() => handleAction('employ7@gmail.com', 'tasks')}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] cursor-pointer"
                    >
                      Switch
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">Emily Zhao (employ11@gmail.com)</span>
                      <span className="text-[10px] text-indigo-700 block">Member: Team Nexus</span>
                    </div>
                    <button
                      onClick={() => handleAction('employ11@gmail.com', 'tasks')}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] cursor-pointer"
                    >
                      Switch
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">Noah Becker (employ16@gmail.com)</span>
                      <span className="text-[10px] text-indigo-700 block">Member: Team Alpha</span>
                    </div>
                    <button
                      onClick={() => handleAction('employ16@gmail.com', 'tasks')}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] cursor-pointer"
                    >
                      Switch
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Need to test other roles? Use the Live Role Switcher in the top navigation anytime!</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAction('analyst1@gmail.com', 'viewer-analytics')}
              className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-semibold text-xs cursor-pointer transition-colors"
            >
              Test Viewer Analyst &rarr;
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
            >
              Close & Start Working
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
