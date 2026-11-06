import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';

interface NewtonsCradlePendulumProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const NewtonsCradlePendulum: React.FC<NewtonsCradlePendulumProps> = ({
  className = '',
  size = 'sm',
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedSide, setDraggedSide] = useState<'left' | 'right' | null>(null);

  // SVG Refs for native 60fps/120fps direct DOM updates
  const svgRef = useRef<SVGSVGElement>(null);
  const ball1Ref = useRef<SVGGElement>(null);
  const ball2Ref = useRef<SVGGElement>(null);
  const ball3Ref = useRef<SVGGElement>(null);
  const ball4Ref = useRef<SVGGElement>(null);
  const ball5Ref = useRef<SVGGElement>(null);
  const impactFlashRef = useRef<SVGCircleElement>(null);

  // High-precision physics state
  const physicsRef = useRef({
    // 'left': Ball 1 is swinging; 'right': Ball 5 is swinging
    activeBall: 'left' as 'left' | 'right',
    phaseStartTime: 0,
    halfCycleDuration: 460, // ms for one swing out and back down to strike
    maxAngle: 35, // degrees
    dragAngle: 0,
  });

  // Web Audio Context for crisp metallic steel sphere impact click
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playImpactSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(3800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.03);

      filter.type = 'bandpass';
      filter.frequency.value = 3400;
      filter.Q.value = 6.0;

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.038);
    } catch {
      // Audio fallback
    }
  }, [soundEnabled]);

  // Main 60fps / 120fps physics loop
  useEffect(() => {
    let animId: number;

    const tick = (now: number) => {
      const p = physicsRef.current;

      // Handle interactive manual drag
      if (isDragging) {
        if (draggedSide === 'left' && ball1Ref.current) {
          ball1Ref.current.setAttribute('transform', `rotate(${p.dragAngle}, 37, 12)`);
        } else if (draggedSide === 'right' && ball5Ref.current) {
          ball5Ref.current.setAttribute('transform', `rotate(${p.dragAngle}, 113, 12)`);
        }
        animId = requestAnimationFrame(tick);
        return;
      }

      if (!isPlaying) {
        animId = requestAnimationFrame(tick);
        return;
      }

      if (p.phaseStartTime === 0) {
        p.phaseStartTime = now;
      }

      const elapsed = now - p.phaseStartTime;
      const progress = elapsed / p.halfCycleDuration;

      if (progress >= 1.0) {
        // ====================================================================
        // MOMENT OF COLLISION & MOMENTUM CONSERVATION TRANSFER:
        // When Left strikes Middle -> Right immediately swings out!
        // When Right strikes Middle -> Left immediately swings out!
        // ====================================================================
        playImpactSound();

        // Contact shockwave visual ping
        if (impactFlashRef.current) {
          const contactX = p.activeBall === 'left' ? 46.5 : 103.5;
          impactFlashRef.current.setAttribute('cx', String(contactX));
          impactFlashRef.current.setAttribute('r', '2.5');
          impactFlashRef.current.setAttribute('opacity', '0.8');
          setTimeout(() => {
            if (impactFlashRef.current) {
              impactFlashRef.current.setAttribute('opacity', '0');
            }
          }, 50);
        }

        // Sub-pixel elastic impulse wave through middle stationary spheres (2, 3, 4)
        if (ball3Ref.current) {
          ball3Ref.current.setAttribute('transform', 'scale(0.985, 1.015)');
          setTimeout(() => {
            if (ball3Ref.current) ball3Ref.current.setAttribute('transform', 'scale(1, 1)');
          }, 35);
        }

        // Instantly clamp incoming ball to 0 and switch active swinging ball
        if (p.activeBall === 'left') {
          if (ball1Ref.current) ball1Ref.current.setAttribute('transform', 'rotate(0, 37, 12)');
          p.activeBall = 'right';
        } else {
          if (ball5Ref.current) ball5Ref.current.setAttribute('transform', 'rotate(0, 113, 12)');
          p.activeBall = 'left';
        }

        p.phaseStartTime = now;
      } else {
        // ====================================================================
        // EXACT SIMPLE HARMONIC MOTION UNDER GRAVITY:
        // theta(progress) = theta_max * sin(pi * progress)
        // - At progress = 0: angle = 0, speed = maximum
        // - At progress = 0.5: angle = theta_max (apex, momentarily stationary)
        // - At progress = 1.0: angle = 0, speed = maximum (strikes the cluster!)
        // ====================================================================
        const angle = p.maxAngle * Math.sin(Math.PI * progress);

        if (p.activeBall === 'left') {
          // Ball 1 swings out to the left (negative angle) and returns to strike
          if (ball1Ref.current) {
            ball1Ref.current.setAttribute('transform', `rotate(${-angle}, 37, 12)`);
          }
          // Balls 2, 3, 4, 5 are strictly stationary
          if (ball5Ref.current) ball5Ref.current.setAttribute('transform', 'rotate(0, 113, 12)');
        } else {
          // Ball 5 swings out to the right (positive angle) and returns to strike
          if (ball5Ref.current) {
            ball5Ref.current.setAttribute('transform', `rotate(${angle}, 113, 12)`);
          }
          // Balls 1, 2, 3, 4 are strictly stationary
          if (ball1Ref.current) ball1Ref.current.setAttribute('transform', 'rotate(0, 37, 12)');
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isDragging, draggedSide, playImpactSound]);

  // Pointer drag & release physics handlers
  const handlePointerDown = (side: 'left' | 'right') => (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDraggedSide(side);
    physicsRef.current.dragAngle = side === 'left' ? -35 : 35;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !svgRef.current || !draggedSide) return;
    const rect = svgRef.current.getBoundingClientRect();
    const pivotX =
      draggedSide === 'left'
        ? rect.left + (37 / 150) * rect.width
        : rect.left + (113 / 150) * rect.width;
    const pivotY = rect.top + (12 / 92) * rect.height;

    const dx = e.clientX - pivotX;
    const dy = e.clientY - pivotY;
    const angleRad = Math.atan2(dx, dy);
    let deg = (angleRad * 180) / Math.PI;

    if (draggedSide === 'left') {
      deg = Math.max(-50, Math.min(0, deg));
      physicsRef.current.dragAngle = deg;
    } else {
      deg = Math.min(50, Math.max(0, deg));
      physicsRef.current.dragAngle = deg;
    }
  };

  const handlePointerUp = () => {
    if (isDragging) {
      setIsDragging(false);
      const angle = Math.abs(physicsRef.current.dragAngle);
      physicsRef.current.maxAngle = Math.max(16, Math.min(50, angle || 35));
      physicsRef.current.activeBall = draggedSide === 'left' ? 'left' : 'right';
      physicsRef.current.phaseStartTime = performance.now();
      setDraggedSide(null);
    }
  };

  const resetSimulation = () => {
    physicsRef.current.maxAngle = 35;
    physicsRef.current.activeBall = 'left';
    physicsRef.current.phaseStartTime = performance.now();
    setIsPlaying(true);
    if (ball1Ref.current) ball1Ref.current.setAttribute('transform', 'rotate(0, 37, 12)');
    if (ball5Ref.current) ball5Ref.current.setAttribute('transform', 'rotate(0, 113, 12)');
  };

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none group/cradle ${className}`}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      title="Newton's Cradle · Drag left or right ball to pull and release!"
    >
      {/* SVG Canvas for 5-Ball Newton's Cradle */}
      <div className="relative">
        <svg
          ref={svgRef}
          viewBox="0 0 150 92"
          className={
            size === 'sm'
              ? 'w-[130px] h-[78px]'
              : size === 'md'
              ? 'w-[155px] h-[94px]'
              : 'w-[185px] h-[112px]'
          }
          style={{ overflow: 'visible', touchAction: 'none' }}
        >
          <defs>
            {/* Mirror Chrome metallic 3D gradient matching image_da5c54b4.png */}
            <radialGradient id="chromeCradleBall" cx="30%" cy="28%" r="72%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="22%" stopColor="#f8fafc" />
              <stop offset="46%" stopColor="#e2e8f0" />
              <stop offset="70%" stopColor="#64748b" />
              <stop offset="88%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>

            {/* Specular Glint Highlight */}
            <radialGradient id="specularCradleGlint" cx="28%" cy="25%" r="35%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>

            {/* Soft Contact Drop Shadow on Stand */}
            <filter id="cradleContactShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1.6" />
              <feOffset dx="0" dy="2.2" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.32" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ==========================================================
              STATIONARY FRAME STRUCTURE (Matching reference photo)
              ========================================================== */}
          
          {/* Base Platform Stand */}
          <rect
            x="6"
            y="80"
            width="138"
            height="8"
            rx="3"
            fill="#f8fafc"
            stroke="#cbd5e1"
            strokeWidth="0.9"
            className="shadow-xs"
          />
          <rect
            x="9"
            y="85.5"
            width="132"
            height="2"
            fill="#64748b"
            opacity="0.25"
          />

          {/* Left Vertical Frame Post */}
          <rect
            x="14"
            y="12"
            width="3"
            height="68"
            rx="1.2"
            fill="#e2e8f0"
            stroke="#94a3b8"
            strokeWidth="0.7"
          />

          {/* Right Vertical Frame Post */}
          <rect
            x="133"
            y="12"
            width="3"
            height="68"
            rx="1.2"
            fill="#e2e8f0"
            stroke="#94a3b8"
            strokeWidth="0.7"
          />

          {/* Top Crossbar with Metallic Highlight */}
          <rect
            x="12"
            y="10"
            width="126"
            height="3.5"
            rx="1.5"
            fill="#f1f5f9"
            stroke="#94a3b8"
            strokeWidth="0.7"
          />
          <line x1="14" y1="11" x2="136" y2="11" stroke="#ffffff" strokeWidth="0.6" />

          {/* ==========================================================
              BALL 1 (Leftmost Ball):
              Swings out to the left and strikes Ball 2 at (46.5, 65)
              Pivot: (37, 12), Resting Center: (37, 65), Radius: 9.5
              ========================================================== */}
          <g
            ref={ball1Ref}
            className="cursor-grab active:cursor-grabbing"
            onPointerDown={handlePointerDown('left')}
          >
            {/* V-shaped suspension strings */}
            <line x1="35" y1="12" x2="37" y2="65" stroke="#64748b" strokeWidth="0.8" opacity="0.85" />
            <line x1="39" y1="12" x2="37" y2="65" stroke="#94a3b8" strokeWidth="0.6" opacity="0.85" />
            {/* Chrome Steel Sphere */}
            <g filter="url(#cradleContactShadow)">
              <circle cx="37" cy="65" r="9.5" fill="url(#chromeCradleBall)" stroke="#334155" strokeWidth="0.6" />
              <circle cx="34" cy="62" r="4.2" fill="url(#specularCradleGlint)" />
            </g>
          </g>

          {/* ==========================================================
              BALL 2 (Stationary Middle Ball):
              Pivot: (56, 12), Resting Center: (56, 65), Radius: 9.5
              ========================================================== */}
          <g ref={ball2Ref}>
            <line x1="54" y1="12" x2="56" y2="65" stroke="#64748b" strokeWidth="0.8" opacity="0.85" />
            <line x1="58" y1="12" x2="56" y2="65" stroke="#94a3b8" strokeWidth="0.6" opacity="0.85" />
            <g filter="url(#cradleContactShadow)">
              <circle cx="56" cy="65" r="9.5" fill="url(#chromeCradleBall)" stroke="#334155" strokeWidth="0.6" />
              <circle cx="53" cy="62" r="4.2" fill="url(#specularCradleGlint)" />
            </g>
          </g>

          {/* ==========================================================
              BALL 3 (Center Stationary Ball):
              Pivot: (75, 12), Resting Center: (75, 65), Radius: 9.5
              ========================================================== */}
          <g ref={ball3Ref} style={{ transformOrigin: '75px 65px' }}>
            <line x1="73" y1="12" x2="75" y2="65" stroke="#64748b" strokeWidth="0.8" opacity="0.85" />
            <line x1="77" y1="12" x2="75" y2="65" stroke="#94a3b8" strokeWidth="0.6" opacity="0.85" />
            <g filter="url(#cradleContactShadow)">
              <circle cx="75" cy="65" r="9.5" fill="url(#chromeCradleBall)" stroke="#334155" strokeWidth="0.6" />
              <circle cx="72" cy="62" r="4.2" fill="url(#specularCradleGlint)" />
            </g>
          </g>

          {/* ==========================================================
              BALL 4 (Stationary Middle Ball):
              Pivot: (94, 12), Resting Center: (94, 65), Radius: 9.5
              ========================================================== */}
          <g ref={ball4Ref}>
            <line x1="92" y1="12" x2="94" y2="65" stroke="#64748b" strokeWidth="0.8" opacity="0.85" />
            <line x1="96" y1="12" x2="94" y2="65" stroke="#94a3b8" strokeWidth="0.6" opacity="0.85" />
            <g filter="url(#cradleContactShadow)">
              <circle cx="94" cy="65" r="9.5" fill="url(#chromeCradleBall)" stroke="#334155" strokeWidth="0.6" />
              <circle cx="91" cy="62" r="4.2" fill="url(#specularCradleGlint)" />
            </g>
          </g>

          {/* ==========================================================
              BALL 5 (Rightmost Ball):
              Swings out to the right upon collision transfer from Ball 4
              Pivot: (113, 12), Resting Center: (113, 65), Radius: 9.5
              ========================================================== */}
          <g
            ref={ball5Ref}
            className="cursor-grab active:cursor-grabbing"
            onPointerDown={handlePointerDown('right')}
          >
            <line x1="111" y1="12" x2="113" y2="65" stroke="#64748b" strokeWidth="0.8" opacity="0.85" />
            <line x1="115" y1="12" x2="113" y2="65" stroke="#94a3b8" strokeWidth="0.6" opacity="0.85" />
            <g filter="url(#cradleContactShadow)">
              <circle cx="113" cy="65" r="9.5" fill="url(#chromeCradleBall)" stroke="#334155" strokeWidth="0.6" />
              <circle cx="110" cy="62" r="4.2" fill="url(#specularCradleGlint)" />
            </g>
          </g>

          {/* Collision Impact Flash Ripple */}
          <circle
            ref={impactFlashRef}
            cx="46.5"
            cy="65"
            r="0"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.2"
            opacity="0"
            className="pointer-events-none transition-all duration-75"
          />
        </svg>

        {/* Hover Mini Utility Controls */}
        <div className="absolute -bottom-1.5 right-0 flex items-center gap-1 opacity-0 group-hover/cradle:opacity-100 transition-opacity bg-white/95 backdrop-blur-md px-1.5 py-0.5 rounded-lg border border-slate-300 shadow-xs z-30">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-0.5 text-slate-700 hover:text-black cursor-pointer"
            title={isPlaying ? 'Pause Motion' : 'Play Motion'}
          >
            {isPlaying ? <Pause className="h-2.5 w-2.5" /> : <Play className="h-2.5 w-2.5" />}
          </button>
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-0.5 text-slate-700 hover:text-black cursor-pointer"
            title={soundEnabled ? 'Mute Metallic Impact' : 'Enable Metallic Impact Click'}
          >
            {soundEnabled ? (
              <Volume2 className="h-2.5 w-2.5 text-blue-600" />
            ) : (
              <VolumeX className="h-2.5 w-2.5 text-slate-400" />
            )}
          </button>
          <button
            type="button"
            onClick={resetSimulation}
            className="p-0.5 text-slate-700 hover:text-black cursor-pointer"
            title="Reset Momentum"
          >
            <RotateCcw className="h-2.5 w-2.5" />
          </button>
        </div>
      </div>

      {/* Caption Matching User's Image */}
      <span className="text-[7.5px] font-mono tracking-wider uppercase text-neutral-500 font-semibold mt-1 text-center">
        Newton&apos;s Cradle · Conservation of Momentum
      </span>
    </div>
  );
};
