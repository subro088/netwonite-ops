import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  Compass,
  X,
  Shield,
  Lightbulb,
  Sparkles,
  CheckSquare,
} from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string, params?: any) => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigate: _onNavigate,
}) => {
  const { switchPersona } = useAuth();
  const [activeTab, setActiveTab] = useState<'quickstart' | 'admin' | 'leader' | 'member' | 'workflow' | 'demo'>('quickstart');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Frosted Glass Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />
      {/* Modal Dialog - Light Frosted Glass */}
      <div className="relative w-full max-w-4xl rounded-3xl bg-white/95 backdrop-blur-3xl border border-white/80 shadow-2xl p-6 sm:p-7 z-10 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col justify-between overflow-hidden text-slate-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold shadow-xs">
              <Compass className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">Netwonite Platform Guide</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold">
                  Interactive Tour
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Operational walkthrough for Administrators, Team Leads, and Squad Members.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="py-3 flex items-center gap-1.5 border-b border-slate-100 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('quickstart')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'quickstart'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Quickstart
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'workflow'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Complete Workflow
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'admin'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Administrator
          </button>
          <button
            onClick={() => setActiveTab('leader')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'leader'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Team Lead
          </button>
          <button
            onClick={() => setActiveTab('member')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'member'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Team Member
          </button>
          <button
            onClick={() => setActiveTab('demo')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'demo'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            20 Demo Personas
          </button>
        </div>

        {/* Tab Body */}
        <div className="py-4 overflow-y-auto flex-1 space-y-4 pr-1 text-xs text-slate-700 leading-relaxed">
          {activeTab === 'quickstart' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <h3 className="text-sm font-bold text-emerald-950 mb-1 flex items-center gap-1.5">
                  <Lightbulb className="h-4 w-4 text-emerald-600" />
                  What is Netwonite?
                </h3>
                <p className="text-xs text-emerald-900">
                  Netwonite is a high-performance team and task orchestration platform designed around cross-squad delegation, transparent approval gates, and multi-tier organizational governance.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-800 font-bold flex items-center justify-center mb-2">
                    1
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">Select Persona</h4>
                  <p className="text-[11px] text-slate-500">
                    Use the Persona switcher in the top bar or directory to test Admin, Lead, and Member capabilities.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="h-7 w-7 rounded-lg bg-teal-100 text-teal-800 font-bold flex items-center justify-center mb-2">
                    2
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">Create or Claim</h4>
                  <p className="text-[11px] text-slate-500">
                    Leads assign tasks to target squads. Eligible squad members claim available work items.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="h-7 w-7 rounded-lg bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center mb-2">
                    3
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">Submit & Approve</h4>
                  <p className="text-[11px] text-slate-500">
                    Submit work for review. The creating lead approves or rejects with auditable feedback.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workflow' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">The 5-Stage Life of a Task</h3>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">1. New</span>
                  <p className="text-xs text-slate-600">Created by an Admin or Team Lead. Unassigned and open for claiming by eligible team members.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono text-[10px] font-bold">2. Assigned</span>
                  <p className="text-xs text-slate-600">Claimed by a squad member. The creator cannot claim their own task.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[10px] font-bold">3. In Progress</span>
                  <p className="text-xs text-slate-600">Assignee actively works on the deliverable and updates execution progress.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono text-[10px] font-bold">4. Awaiting Approval</span>
                  <p className="text-xs text-slate-600">Assignee marks task finished. Sent to creator's approval queue.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">5. Resolved</span>
                  <p className="text-xs text-slate-600">Approved by the creating lead. Stamped into audit history.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <h3 className="text-sm font-bold text-amber-950 mb-1 flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-amber-700" />
                  Administrator Powers
                </h3>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-amber-900 mt-2">
                  <li><strong>Create & Delete Squads:</strong> Provision new teams and assign team leaders.</li>
                  <li><strong>Workflows & Achievements dual view:</strong> Explore tree views and comparative bar charts of every employee.</li>
                  <li><strong>Reset Demo:</strong> Restore the pristine 20-employee dataset at any time.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'leader' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
                <h3 className="text-sm font-bold text-teal-950 mb-1 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-teal-700" />
                  Team Lead Responsibilities
                </h3>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-teal-900 mt-2">
                  <li><strong>Cross-Team Delegation:</strong> Dispatch tasks to destination teams.</li>
                  <li><strong>Approval Queue:</strong> Inspect, approve, or reject submissions.</li>
                  <li><strong>Squad Velocity:</strong> Monitor team member workloads.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'member' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
                <h3 className="text-sm font-bold text-indigo-950 mb-1 flex items-center gap-1.5">
                  <CheckSquare className="h-4 w-4 text-indigo-700" />
                  Member Capabilities
                </h3>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-indigo-900 mt-2">
                  <li><strong>Claim Tasks:</strong> Claim open tasks assigned to your squad.</li>
                  <li><strong>Submit Work:</strong> Send completed deliverables to the creating lead for verification.</li>
                  <li><strong>Personal Metrics:</strong> Monitor your completion rates and velocity.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'demo' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Pre-Configured Demo Accounts</h3>
              <p className="text-xs text-slate-500">
                Switch instantly between these accounts to evaluate role permissions:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800">admin@netwonite.com</span>
                    <p className="text-[10px] text-slate-500">Global Admin</p>
                  </div>
                  <button
                    onClick={async () => {
                      await switchPersona('admin@netwonite.com');
                      onClose();
                    }}
                    className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] cursor-pointer"
                  >
                    Switch
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800">employ1@gmail.com</span>
                    <p className="text-[10px] text-slate-500">Alex Chen (Lead: Team Rock)</p>
                  </div>
                  <button
                    onClick={async () => {
                      await switchPersona('employ1@gmail.com');
                      onClose();
                    }}
                    className="px-2 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10px] cursor-pointer"
                  >
                    Switch
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800">employ6@gmail.com</span>
                    <p className="text-[10px] text-slate-500">David Kim (Lead: Team Paper)</p>
                  </div>
                  <button
                    onClick={async () => {
                      await switchPersona('employ6@gmail.com');
                      onClose();
                    }}
                    className="px-2 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10px] cursor-pointer"
                  >
                    Switch
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800">employ2@gmail.com</span>
                    <p className="text-[10px] text-slate-500">Jordan Taylor (Member)</p>
                  </div>
                  <button
                    onClick={async () => {
                      await switchPersona('employ2@gmail.com');
                      onClose();
                    }}
                    className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] cursor-pointer"
                  >
                    Switch
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            Switch accounts anytime via top navigation
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
          >
            Got it, Let's Work
          </button>
        </div>
      </div>
    </div>
  );
};
