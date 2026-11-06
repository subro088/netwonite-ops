import React, { useState } from 'react';
import { Sparkles, Shield, Users, Activity, Zap, Play, Pause, Gauge, Layers, CheckCircle2, ChevronRight, X } from 'lucide-react';

interface NewtoniteOrbitalCoreProps {
  onQuickLogin?: (email: string) => void;
  onOpenGuide?: () => void;
  onFocusSection?: (sectionId: string) => void;
}

export const NewtoniteOrbitalCore: React.FC<NewtoniteOrbitalCoreProps> = ({
  onQuickLogin,
  onOpenGuide,
  onFocusSection,
}) => {
  const [orbitSpeed, setOrbitSpeed] = useState<'normal' | 'fast' | 'paused'>('normal');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [selectedSphere, setSelectedSphere] = useState<'blue' | 'black' | 'silver' | 'cyan'>('blue');

  // Orbit duration multiplier
  const getDur = (base: number) => {
    if (orbitSpeed === 'paused') return '999999s';
    if (orbitSpeed === 'fast') return `${base * 0.35}s`;
    return `${base}s`;
  };

  return (
    <>
      <div className="relative flex flex-col justify-between h-full rounded-2xl p-3 text-neutral-900 overflow-hidden bg-gradient-to-b from-white/75 via-white/60 to-white/45 backdrop-blur-2xl border border-white/80 shadow-[0_12px_35px_-8px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,1)] group">
        
        {/* Specular Top Rim Reflection */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent" />

        {/* Technical Header with corner brackets */}
        <div className="flex items-center justify-between pb-1.5 border-b border-black/10 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-800">
              Newtonite / N°
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-neutral-900 text-white shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ORBIT ACTIVE
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Speed toggle control */}
            <button
              type="button"
              onClick={() => {
                if (orbitSpeed === 'normal') setOrbitSpeed('fast');
                else if (orbitSpeed === 'fast') setOrbitSpeed('paused');
                else setOrbitSpeed('normal');
              }}
              className="p-1 rounded bg-neutral-100 hover:bg-neutral-200 border border-neutral-300/80 text-[9px] text-neutral-700 font-mono transition-all hover:scale-105 active:scale-95 flex items-center gap-1 cursor-pointer"
              title={`Current Orbit: ${orbitSpeed.toUpperCase()} (Click to toggle)`}
            >
              {orbitSpeed === 'paused' ? (
                <Play className="h-2.5 w-2.5 text-neutral-700" />
              ) : orbitSpeed === 'fast' ? (
                <Zap className="h-2.5 w-2.5 text-amber-600 animate-bounce" />
              ) : (
                <Gauge className="h-2.5 w-2.5 text-neutral-700" />
              )}
              <span className="uppercase text-[8px] font-semibold">{orbitSpeed}</span>
            </button>

            {/* Diagnostics launcher */}
            <button
              type="button"
              onClick={() => setIsDiagnosticsOpen(true)}
              className="p-1 px-1.5 rounded bg-black text-white hover:bg-neutral-800 text-[9px] font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-1 shadow-xs cursor-pointer"
              title="Inspect Core Diagnostics"
            >
              <Sparkles className="h-2.5 w-2.5 text-cyan-300" />
              <span className="text-[8px]">Inspect</span>
            </button>
          </div>
        </div>

        {/* Central Kinetic Visual Chamber: The Artwork + Moving 3D Balls + Floating Popups */}
        <div className="relative my-1.5 flex-1 flex items-center justify-center min-h-[190px] overflow-visible">
          
          {/* Subtle Technical Grid Lines matching the uploaded image */}
          <div className="absolute inset-1 pointer-events-none opacity-25">
            <div className="absolute top-1/2 inset-x-0 h-px bg-neutral-900/40" />
            <div className="absolute left-1/2 inset-y-0 w-px bg-neutral-900/40" />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-blue-600" />
            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-blue-600" />
          </div>

          {/* Central Artwork Card with floating levitation */}
          <div 
            onClick={() => setIsDiagnosticsOpen(true)}
            className="relative z-10 w-[140px] h-[140px] sm:w-[155px] sm:h-[155px] rounded-2xl overflow-hidden cursor-pointer shadow-[0_12px_28px_-6px_rgba(0,0,0,0.22)] border border-neutral-300/80 bg-white group/core animate-core-levitate hover:shadow-[0_16px_36px_-4px_rgba(0,0,0,0.3),0_0_18px_rgba(59,130,246,0.25)] transition-all duration-300"
          >
            {/* The high-res uploaded artwork */}
            <img
              src="/assets/aistudio/image_e8a60734.png"
              alt="Newtonite / N° Orbital Core"
              className="w-full h-full object-contain select-none group-hover/core:scale-105 transition-transform duration-500"
            />

            {/* Specular glass reflection layer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/40 pointer-events-none" />

            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-neutral-950/20 backdrop-blur-[1px] opacity-0 group-hover/core:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <span className="px-2 py-1 rounded-full bg-black/85 text-white text-[10px] font-bold font-mono tracking-wider flex items-center gap-1 shadow-md">
                <Sparkles className="h-3 w-3 text-cyan-300" />
                TAP TO INSPECT
              </span>
            </div>
          </div>

          {/* SVG Orbital Canvas with Animated 3D Glossy Spheres revolving along ellipses */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
            viewBox="0 0 320 320"
          >
            <defs>
              {/* Radial Gradients for 3D Spheres with specular highlights */}
              <radialGradient id="sphereGradBlue" cx="35%" cy="32%" r="68%">
                <stop offset="0%" stopColor="#bfdbfe" />
                <stop offset="30%" stopColor="#60a5fa" />
                <stop offset="70%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </radialGradient>

              <radialGradient id="sphereGradBlack" cx="35%" cy="32%" r="68%">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="35%" stopColor="#334155" />
                <stop offset="75%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </radialGradient>

              <radialGradient id="sphereGradSilver" cx="35%" cy="32%" r="68%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="35%" stopColor="#e2e8f0" />
                <stop offset="75%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#475569" />
              </radialGradient>

              <radialGradient id="sphereGradCyan" cx="35%" cy="32%" r="68%">
                <stop offset="0%" stopColor="#cffafe" />
                <stop offset="35%" stopColor="#38bdf8" />
                <stop offset="75%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#075985" />
              </radialGradient>

              {/* Glowing Drop Shadows for Spheres */}
              <filter id="glowBlue" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              <filter id="glowCyan" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Orbit Path 1: Middle Inclined Ellipse (Matching the blue ball's trajectory in the artwork) */}
            <path
              id="orbitTrack1"
              d="M 30,195 C 40,110 270,80 290,145 C 310,210 50,265 30,195 Z"
              fill="none"
              stroke="rgba(100, 116, 139, 0.28)"
              strokeWidth="1.2"
              strokeDasharray="4 3"
            />

            {/* Orbit Path 2: Outer Horizontal-Tilted Ellipse (Matching the black ball's trajectory) */}
            <path
              id="orbitTrack2"
              d="M 20,135 C 30,60 280,75 300,165 C 315,255 70,225 20,135 Z"
              fill="none"
              stroke="rgba(30, 41, 59, 0.24)"
              strokeWidth="1"
              strokeDasharray="6 4"
            />

            {/* Orbit Path 3: Inner Fast Ellipse (Matching the silver ball's trajectory) */}
            <path
              id="orbitTrack3"
              d="M 75,170 C 85,120 230,105 245,155 C 255,200 95,215 75,170 Z"
              fill="none"
              stroke="rgba(148, 163, 184, 0.3)"
              strokeWidth="0.9"
            />

            {/* Moving Sphere 1: Glossy Cobalt Blue Sphere */}
            <g filter="url(#glowBlue)">
              <circle r="9" fill="url(#sphereGradBlue)">
                <animateMotion
                  dur={getDur(8)}
                  repeatCount="indefinite"
                  path="M 30,195 C 40,110 270,80 290,145 C 310,210 50,265 30,195 Z"
                  keyPoints="0;0.5;1"
                  keyTimes="0;0.5;1"
                />
              </circle>
              {/* Specular White Glint on the blue sphere */}
              <circle r="2.5" fill="#ffffff" opacity="0.85">
                <animateMotion
                  dur={getDur(8)}
                  repeatCount="indefinite"
                  path="M 28,193 C 38,108 268,78 288,143 C 308,208 48,263 28,193 Z"
                />
              </circle>
            </g>

            {/* Moving Sphere 2: Sleek Obsidian Black Sphere */}
            <g>
              <circle r="7.5" fill="url(#sphereGradBlack)">
                <animateMotion
                  dur={getDur(12)}
                  repeatCount="indefinite"
                  path="M 20,135 C 30,60 280,75 300,165 C 315,255 70,225 20,135 Z"
                />
              </circle>
              {/* White specular gleam on black ball */}
              <circle r="1.8" fill="#ffffff" opacity="0.7">
                <animateMotion
                  dur={getDur(12)}
                  repeatCount="indefinite"
                  path="M 18,133 C 28,58 278,73 298,163 C 313,253 68,223 18,133 Z"
                />
              </circle>
            </g>

            {/* Moving Sphere 3: Metallic Silver Sphere */}
            <g>
              <circle r="5.5" fill="url(#sphereGradSilver)">
                <animateMotion
                  dur={getDur(6.5)}
                  repeatCount="indefinite"
                  path="M 75,170 C 85,120 230,105 245,155 C 255,200 95,215 75,170 Z"
                />
              </circle>
            </g>

            {/* Moving Sphere 4: Radiant Cyan Energy Node */}
            <g filter="url(#glowCyan)">
              <circle r="4" fill="url(#sphereGradCyan)">
                <animateMotion
                  dur={getDur(15)}
                  repeatCount="indefinite"
                  path="M 290,145 C 270,80 40,110 30,195 C 50,265 310,210 290,145 Z"
                />
              </circle>
            </g>
          </svg>

          {/* ================================================================
              Clean Elegant Docked Badges around the Orbital Canvas
              ================================================================ */}
          
          {/* Badge 1: Top-Left "Active Gravitational Orbit" */}
          <div 
            onClick={() => setIsDiagnosticsOpen(true)}
            className="absolute top-2 left-2 z-30 glass-popup-card px-2.5 py-1.5 rounded-xl cursor-pointer hover:scale-105 transition-all shadow-sm border border-white/90"
            title="Click to view live simulation telemetry"
          >
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[10px] font-mono font-bold text-neutral-900 tracking-tight">GRAVITATIONAL ORBIT</span>
            </div>
            <p className="text-[9px] text-neutral-600 font-medium leading-tight mt-0.5">
              4 Multi-Role Nodes Active
            </p>
          </div>

          {/* Badge 2: Bottom-Right "Zero-Trust RBAC Synced" */}
          <div 
            onClick={() => setIsDiagnosticsOpen(true)}
            className="absolute bottom-2 right-2 z-30 glass-popup-card px-2.5 py-1.5 rounded-xl cursor-pointer hover:scale-105 transition-all shadow-sm border border-white/90"
            title="Click to inspect system diagnostics"
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-blue-600 shrink-0" />
              <span className="text-[10px] font-mono font-bold text-neutral-900 tracking-tight">ZERO-TRUST RBAC</span>
            </div>
            <p className="text-[9px] text-neutral-600 font-medium leading-tight mt-0.5">
              Admin · Leader · Analyst · Member
            </p>
          </div>

        </div>

        {/* Quiet Subtitle Footnote */}
        <div className="pt-2 border-t border-black/10 flex items-center justify-between text-[10px] text-neutral-600 shrink-0">
          <span className="font-mono">NEWTONITE N° CORE</span>
          <span className="font-semibold text-neutral-800">Quantum Kinetic Simulation</span>
        </div>

      </div>

      {/* ====================================================================
          Full Screen Interactive Diagnostics & Orbital Inspector Modal
          ==================================================================== */}
      {isDiagnosticsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white/90 backdrop-blur-2xl border border-white p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] text-neutral-900 overflow-hidden max-h-[90vh] flex flex-col justify-between">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-black text-white flex items-center justify-center font-black">
                  N°
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    Newtonite Orbital Core Diagnostics
                  </h3>
                  <p className="text-xs text-neutral-500 font-mono">
                    BUILD / 2026 · Gravitational Simulation & Telemetry HUD
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDiagnosticsOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-black transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-4 space-y-4 overflow-y-auto">
              
              {/* Live Status Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-neutral-100/80 border border-neutral-200">
                  <span className="text-[10px] font-mono uppercase text-neutral-500 block">Status</span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    ONLINE 99.9%
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-100/80 border border-neutral-200">
                  <span className="text-[10px] font-mono uppercase text-neutral-500 block">Workspace Nodes</span>
                  <span className="text-xs font-bold text-neutral-900 mt-0.5 block">20 Personas</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-100/80 border border-neutral-200">
                  <span className="text-[10px] font-mono uppercase text-neutral-500 block">Security Lock</span>
                  <span className="text-xs font-bold text-blue-600 mt-0.5 block">Zero-Trust RBAC</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-100/80 border border-neutral-200">
                  <span className="text-[10px] font-mono uppercase text-neutral-500 block">Session State</span>
                  <span className="text-xs font-bold text-neutral-900 mt-0.5 block">Isolated Tab</span>
                </div>
              </div>

              {/* Orbital Simulation Controls */}
              <div className="p-4 rounded-2xl bg-neutral-950 text-white border border-neutral-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-cyan-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">Orbital Motion Dynamics</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {(['normal', 'fast', 'paused'] as const).map(mode => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setOrbitSpeed(mode)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                          orbitSpeed === mode
                            ? 'bg-cyan-500 text-slate-950 shadow-sm'
                            : 'bg-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  The central polyhedron core represents the central governance nexus, while the orbiting spheres (Cobalt Blue for Team Leaders, Obsidian Black for Security Sentinels, Silver for Workflow Auditors, and Cyan for Intelligence Analysts) illustrate live concurrent workspace execution.
                </p>

                {/* Sphere selector row */}
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-neutral-800 text-[11px]">
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full sphere-ball-blue shrink-0" />
                    <span className="text-neutral-300">Cobalt: Leaders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full sphere-ball-black shrink-0" />
                    <span className="text-neutral-300">Obsidian: Sentinel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full sphere-ball-silver shrink-0" />
                    <span className="text-neutral-300">Silver: Auditors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full sphere-ball-cyan shrink-0" />
                    <span className="text-neutral-300">Cyan: Analysts</span>
                  </div>
                </div>
              </div>

              {/* 1-Click Launchers Grid */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-2">
                  Instant Demo Access from Core HUD
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDiagnosticsOpen(false);
                      onQuickLogin?.('admin@netwonite.com');
                    }}
                    className="p-2.5 rounded-xl bg-neutral-900 text-white hover:bg-black transition-all flex items-center justify-between text-left cursor-pointer group"
                  >
                    <div>
                      <div className="text-xs font-bold">Administrator</div>
                      <div className="text-[10px] text-neutral-400">admin@netwonite.com</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsDiagnosticsOpen(false);
                      onQuickLogin?.('analyst1@gmail.com');
                    }}
                    className="p-2.5 rounded-xl bg-cyan-900 text-white hover:bg-cyan-950 transition-all flex items-center justify-between text-left cursor-pointer group border border-cyan-700"
                  >
                    <div>
                      <div className="text-xs font-bold text-cyan-200">Dedicated Analyst</div>
                      <div className="text-[10px] text-cyan-300">analyst1@gmail.com</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-cyan-300 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsDiagnosticsOpen(false);
                      onQuickLogin?.('employ1@gmail.com');
                    }}
                    className="p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 transition-all flex items-center justify-between text-left cursor-pointer group border border-neutral-300"
                  >
                    <div>
                      <div className="text-xs font-bold">Team Leader 1</div>
                      <div className="text-[10px] text-neutral-600">employ1@gmail.com</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
              <span className="text-xs text-neutral-500 font-mono">
                Engine: Express 4.21 · React 19 · Vite 8
              </span>
              <button
                type="button"
                onClick={() => setIsDiagnosticsOpen(false)}
                className="py-1.5 px-4 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
              >
                Close HUD
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
