import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, Minimize2, Sparkles, Gauge } from 'lucide-react';

interface NewtonsCradle3DProps {
  className?: string;
  width?: number;
  height?: number;
  compact?: boolean;
}

export const NewtonsCradle3D: React.FC<NewtonsCradle3DProps> = ({
  className = '',
  compact = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // UI Interactive States
  const [isPlaying, setIsPlaying] = useState(true);
  const [continuousMode, setContinuousMode] = useState(true);
  const [speedScale, setSpeedScale] = useState(1.0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDraggingBall, setIsDraggingBall] = useState(false);

  // Web Audio Context for crisp metallic steel sphere impact click
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playImpactSound = useCallback((volumeMultiplier = 1.0) => {
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
      osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.028);

      filter.type = 'bandpass';
      filter.frequency.value = 3400;
      filter.Q.value = 6.0;

      const vol = Math.min(0.2, 0.12 * Math.max(0.2, volumeMultiplier));
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.032);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch {
      // Audio fallback
    }
  }, [soundEnabled]);

  // Simulation physics parameters
  // Ball radius: 0.43. Spacing: 0.86. (2 * radius = 0.86).
  // Zero gap: at rest, balls kiss each other flush with 0 space between them.
  const physicsParams = useRef({
    isPlaying: true,
    continuousMode: true,
    speedScale: 1.0,
    numBalls: 5,
    radius: 0.43,
    stringLength: 2.8,
    gravity: 9.81,
    // Angles in radians: ball 0 starts pulled by ~35 degrees (-0.61 rad)
    angles: [-0.61, 0, 0, 0, 0],
    velocities: [0, 0, 0, 0, 0],
    // Spacing between suspension pivots = exactly 2 * radius (0.86)
    pivotsX: [-1.72, -0.86, 0, 0.86, 1.72],
    frameY: 1.8,
    railZFront: 0.65,
    railZBack: -0.65,
    damping: 0.9995,
    restitution: 0.995,
    draggedIndex: -1,
    dragAngle: 0,
    lastSoundTime: 0,
  });

  // Keep ref in sync with state
  useEffect(() => {
    physicsParams.current.isPlaying = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    physicsParams.current.continuousMode = continuousMode;
  }, [continuousMode]);

  useEffect(() => {
    physicsParams.current.speedScale = speedScale;
  }, [speedScale]);

  // Pull Ball 1 (leftmost) by 35°
  const pullLeftBall = (angle = -0.61) => {
    const p = physicsParams.current;
    p.angles = [angle, 0, 0, 0, 0];
    p.velocities = [0, 0, 0, 0, 0];
    setIsPlaying(true);
  };

  // Pull Ball 5 (rightmost) by 35°
  const pullRightBall = (angle = 0.61) => {
    const p = physicsParams.current;
    p.angles = [0, 0, 0, 0, angle];
    p.velocities = [0, 0, 0, 0, 0];
    setIsPlaying(true);
  };

  // Pull two balls on left
  const pullTwoBalls = () => {
    const p = physicsParams.current;
    p.angles = [-0.61, -0.61, 0, 0, 0];
    p.velocities = [0, 0, 0, 0, 0];
    setIsPlaying(true);
  };

  // Reset all balls to rest
  const resetToRest = () => {
    const p = physicsParams.current;
    p.angles = [0, 0, 0, 0, 0];
    p.velocities = [0, 0, 0, 0, 0];
  };

  // Main Three.js Scene Setup & Animation Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas').getContext('webgl2');
        if (!probe) return true;
        const ext = probe.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
        const gpu = String(probe.getParameter(param));
        probe.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // 1. Scene & Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc); // Clean light backdrop

    const width = container.clientWidth || (compact ? 240 : 320);
    const height = container.clientHeight || (compact ? 115 : 200);

    const camera = new THREE.PerspectiveCamera(compact ? 36 : 40, width / height, 0.1, 100);
    // Position camera head-on with slight vertical elevation to eliminate parallax gap illusions
    camera.position.set(0, 0.25, compact ? 5.6 : 5.8);
    camera.lookAt(0, 0.08, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 2. Procedural Studio Environment for realistic mirror chrome reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 3. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 512;
      keyLight.shadow.mapSize.height = 512;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 14;
    }
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 0.6);
    fillLight.position.set(-4, 3, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.45);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // 4. Materials
    // Mirror Chrome Spheres (matching user reference image)
    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.98,
      roughness: 0.06,
      envMapIntensity: 1.3,
    });

    // White Frame Posts and Horizontal Rails
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.85,
      roughness: 0.16,
    });

    // Base Stand Platform
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.25,
    });

    // Thin Suspension Strings (Semi-translucent silvery nylon)
    const stringMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.4,
      roughness: 0.35,
      transparent: true,
      opacity: 0.85,
    });

    // 5. Construct 3D Newton's Cradle Structure
    const cradleGroup = new THREE.Group();
    scene.add(cradleGroup);

    // Base Stand Platform
    const baseGeo = new THREE.BoxGeometry(4.4, 0.18, 1.9);
    const baseMesh = new THREE.Mesh(baseGeo, baseMaterial);
    baseMesh.position.set(0, -1.5, 0);
    baseMesh.receiveShadow = !isSoftwareGl;
    cradleGroup.add(baseMesh);

    // Soft Contact Shadow Plane directly on base
    const shadowGeo = new THREE.PlaneGeometry(4.0, 1.5);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x0f172a,
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, -1.4, 0);
    cradleGroup.add(shadowMesh);

    // Vertical Frame Posts (4 corner columns)
    const postGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.2, 16);
    const postPositions = [
      [-2.1, 0.15, 0.68],
      [2.1, 0.15, 0.68],
      [-2.1, 0.15, -0.68],
      [2.1, 0.15, -0.68],
    ];
    postPositions.forEach(([x, y, z]) => {
      const post = new THREE.Mesh(postGeo, frameMaterial);
      post.position.set(x, y, z);
      post.castShadow = !isSoftwareGl;
      cradleGroup.add(post);
    });

    // Horizontal Rails (Front and Back Top Bars)
    const railGeo = new THREE.CylinderGeometry(0.045, 0.045, 4.25, 16);
    // Front top rail
    const railFront = new THREE.Mesh(railGeo, frameMaterial);
    railFront.rotation.z = Math.PI / 2;
    railFront.position.set(0, 1.75, 0.68);
    railFront.castShadow = !isSoftwareGl;
    cradleGroup.add(railFront);

    // Back top rail
    const railBack = new THREE.Mesh(railGeo, frameMaterial);
    railBack.rotation.z = Math.PI / 2;
    railBack.position.set(0, 1.75, -0.68);
    railBack.castShadow = !isSoftwareGl;
    cradleGroup.add(railBack);

    // Top Cross Connectors (Left and Right linking rails)
    const connectorGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.36, 16);
    const connLeft = new THREE.Mesh(connectorGeo, frameMaterial);
    connLeft.rotation.x = Math.PI / 2;
    connLeft.position.set(-2.1, 1.75, 0);
    cradleGroup.add(connLeft);

    const connRight = new THREE.Mesh(connectorGeo, frameMaterial);
    connRight.rotation.x = Math.PI / 2;
    connRight.position.set(2.1, 1.75, 0);
    cradleGroup.add(connRight);

    // 6. The 5 Metallic Spheres and Strings
    const ballMeshes: THREE.Mesh[] = [];
    const stringFrontMeshes: THREE.Mesh[] = [];
    const stringBackMeshes: THREE.Mesh[] = [];

    // Zero-gap radius: 0.431 with pivot spacing 0.86 ensures flush kissing contact without gaps
    const sphereGeo = new THREE.SphereGeometry(physicsParams.current.radius, 32, 32);
    const stringGeo = new THREE.CylinderGeometry(0.01, 0.01, 1, 8);

    for (let i = 0; i < 5; i++) {
      // Chrome Ball
      const ball = new THREE.Mesh(sphereGeo, chromeMaterial);
      ball.castShadow = !isSoftwareGl;
      ball.receiveShadow = !isSoftwareGl;
      ball.userData = { ballIndex: i };
      cradleGroup.add(ball);
      ballMeshes.push(ball);

      // Front String
      const strFront = new THREE.Mesh(stringGeo, stringMaterial);
      cradleGroup.add(strFront);
      stringFrontMeshes.push(strFront);

      // Back String
      const strBack = new THREE.Mesh(stringGeo, stringMaterial);
      cradleGroup.add(strBack);
      stringBackMeshes.push(strBack);
    }

    // Helper to position string cylinder between two 3D points
    const updateStringBetweenPoints = (mesh: THREE.Mesh, p1: THREE.Vector3, p2: THREE.Vector3) => {
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const dist = p1.distanceTo(p2);
      mesh.position.copy(mid);
      mesh.scale.set(1, dist, 1);
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3().subVectors(p2, p1).normalize());
    };

    // 7. Interactive Raycasting for Ball Dragging
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // Z=0 plane
    const planeIntersect = new THREE.Vector3();

    const onPointerDown = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(ballMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const index = hit.userData.ballIndex;
        if (typeof index === 'number') {
          physicsParams.current.draggedIndex = index;
          physicsParams.current.velocities[index] = 0;
          setIsDraggingBall(true);
        }
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (physicsParams.current.draggedIndex === -1) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      if (raycaster.ray.intersectPlane(dragPlane, planeIntersect)) {
        const p = physicsParams.current;
        const idx = p.draggedIndex;
        const pivotX = p.pivotsX[idx];
        const pivotY = p.frameY;
        const dx = planeIntersect.x - pivotX;
        const dy = pivotY - planeIntersect.y;
        let angle = Math.atan2(dx, dy);
        angle = Math.max(-0.85, Math.min(0.85, angle));
        p.angles[idx] = angle;
        p.velocities[idx] = 0;
      }
    };

    const onPointerUp = () => {
      if (physicsParams.current.draggedIndex !== -1) {
        physicsParams.current.draggedIndex = -1;
        setIsDraggingBall(false);
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // 8. Authentic Physics Integration Loop (Zero Gap + 100% Momentum Conservation)
    let lastTime = performance.now();
    let frameId = 0;

    const tick = () => {
      frameId = requestAnimationFrame(tick);

      const now = performance.now();
      let dt = (now - lastTime) / 1000;
      lastTime = now;

      // Cap delta time to avoid large jumps on tab switch
      if (dt > 0.05) dt = 0.05;

      const p = physicsParams.current;
      const subSteps = 12; // High-precision sub-stepping for crisp collision resolution
      const subDt = (dt * p.speedScale) / subSteps;
      const e = p.continuousMode ? 1.0 : p.restitution;

      if (p.isPlaying) {
        for (let step = 0; step < subSteps; step++) {
          // A. Gravity integration for each pendulum
          for (let i = 0; i < p.numBalls; i++) {
            if (i === p.draggedIndex) continue; // Driven by pointer if dragged

            const angularAccel = -(p.gravity / p.stringLength) * Math.sin(p.angles[i]);
            p.velocities[i] += angularAccel * subDt;

            // Apply slight air damping if continuous mode is disabled
            if (!p.continuousMode) {
              p.velocities[i] *= Math.pow(p.damping, subDt * 60);
            }

            p.angles[i] += p.velocities[i] * subDt;
          }

          // B. Pairwise Collision & Conservation of Momentum
          // Balls are arranged from 0 (left) to 4 (right).
          // Non-penetration constraint: angles[0] <= angles[1] <= angles[2] <= angles[3] <= angles[4]
          let hadCollision = false;
          let maxImpactVel = 0;

          // Left-to-Right pass: transfer momentum rightwards (Left ball hits cluster)
          for (let i = 0; i < p.numBalls - 1; i++) {
            if (p.angles[i] > p.angles[i + 1]) {
              const relVel = p.velocities[i] - p.velocities[i + 1];
              if (relVel > 0) {
                hadCollision = true;
                if (relVel > maxImpactVel) maxImpactVel = relVel;

                // Elastic collision between equal mass spheres
                const v1 = p.velocities[i];
                const v2 = p.velocities[i + 1];
                p.velocities[i] = v2;
                p.velocities[i + 1] = v1 * e;
              }
              // Prevent spatial overlap
              const avg = (p.angles[i] + p.angles[i + 1]) * 0.5;
              p.angles[i] = avg;
              p.angles[i + 1] = avg;
            }
          }

          // Right-to-Left pass: transfer momentum leftwards (Right ball hits cluster)
          for (let i = p.numBalls - 1; i > 0; i--) {
            if (p.angles[i] < p.angles[i - 1]) {
              const relVel = p.velocities[i - 1] - p.velocities[i];
              if (relVel > 0) {
                hadCollision = true;
                if (relVel > maxImpactVel) maxImpactVel = relVel;

                const v1 = p.velocities[i - 1];
                const v2 = p.velocities[i];
                p.velocities[i - 1] = v2 * e;
                p.velocities[i] = v1;
              }
              const avg = (p.angles[i] + p.angles[i - 1]) * 0.5;
              p.angles[i - 1] = avg;
              p.angles[i] = avg;
            }
          }

          // Order constraint enforcement: spheres cannot pass through each other
          for (let i = 0; i < p.numBalls - 1; i++) {
            if (p.angles[i] > p.angles[i + 1]) {
              p.angles[i] = p.angles[i + 1];
            }
          }

          // Stable Zero-Gap clamping for middle resting balls:
          // In a classic cradle, middle balls 1, 2, 3 remain firmly vertical at angle 0
          for (let i = 1; i < 4; i++) {
            if (Math.abs(p.angles[i]) < 0.003 && Math.abs(p.velocities[i]) < 0.03) {
              p.angles[i] = 0;
              p.velocities[i] = 0;
            }
          }

          // Continuous perpetual motion boost
          if (p.continuousMode && p.draggedIndex === -1) {
            const currentMax = Math.max(...p.angles.map(a => Math.abs(a)));
            const currentMaxVel = Math.max(...p.velocities.map(v => Math.abs(v)));
            // If energy dissipated, restart ball 0 smoothly
            if (currentMax < 0.03 && currentMaxVel < 0.05) {
              p.angles[0] = -0.61;
              p.velocities[0] = 0;
            }
          }

          // Play crisp metallic click sound on collision
          if (hadCollision && now - p.lastSoundTime > 65) {
            p.lastSoundTime = now;
            playImpactSound(maxImpactVel / 2.2);
          }
        }
      }

      // 9. Synchronize 3D Meshes with Physics State
      const p1Front = new THREE.Vector3();
      const p1Back = new THREE.Vector3();
      const ballCenter = new THREE.Vector3();

      for (let i = 0; i < p.numBalls; i++) {
        const angle = p.angles[i];
        const pivotX = p.pivotsX[i];
        const pivotY = p.frameY;

        const bx = pivotX + p.stringLength * Math.sin(angle);
        const by = pivotY - p.stringLength * Math.cos(angle);
        const bz = 0;

        ballCenter.set(bx, by, bz);
        ballMeshes[i].position.copy(ballCenter);

        // Suspension string anchors on top rails
        p1Front.set(pivotX, pivotY, p.railZFront);
        p1Back.set(pivotX, pivotY, p.railZBack);

        // String attachment point on sphere top
        const topOfBall = new THREE.Vector3(bx, by + p.radius * 0.98, bz);

        updateStringBetweenPoints(stringFrontMeshes[i], p1Front, topOfBall);
        updateStringBetweenPoints(stringBackMeshes[i], p1Back, topOfBall);
      }

      renderer.render(scene, camera);
    };

    tick();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(frameId);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);

      renderer.dispose();
      baseGeo.dispose();
      postGeo.dispose();
      railGeo.dispose();
      connectorGeo.dispose();
      sphereGeo.dispose();
      stringGeo.dispose();
      shadowGeo.dispose();
      chromeMaterial.dispose();
      frameMaterial.dispose();
      baseMaterial.dispose();
      stringMaterial.dispose();
      shadowMat.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [compact, playImpactSound]);

  return (
    <>
      <div
        className={`relative rounded-2xl overflow-hidden bg-gradient-to-b from-white/95 to-slate-100/90 border border-slate-200/90 shadow-sm flex flex-col justify-between group/cradle3d ${
          compact ? 'p-1.5' : 'p-2'
        } ${className}`}
      >
        {/* Specular Rim */}
        <div className="pointer-events-none absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent" />

        {/* 3D WebGL Canvas Container */}
        <div
          ref={mountRef}
          className={`w-full relative cursor-grab active:cursor-grabbing flex-1 min-h-0`}
          title="Interactive 3D Newton's Cradle · Drag any ball to lift and release!"
        />

        {/* Floating Interactive HUD Dock (Minimalist & Compact) */}
        <div className="w-full pt-1 px-1 flex items-center justify-between gap-1 text-[9px] text-slate-700 shrink-0 border-t border-slate-200/60">
          
          {/* Controls: Play/Pause, Reset & Sound */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer flex items-center justify-center"
              title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
            >
              {isPlaying ? <Pause className="h-2.5 w-2.5" /> : <Play className="h-2.5 w-2.5" />}
            </button>

            <button
              type="button"
              onClick={() => pullLeftBall(-0.61)}
              className="px-1.5 py-0.5 rounded bg-neutral-900 text-white font-bold text-[8px] hover:bg-black transition-all cursor-pointer flex items-center gap-1 shadow-xs"
              title="Pull leftmost ball by 35° and release"
            >
              <RotateCcw className="h-2 w-2" />
              <span>Pull 35°</span>
            </button>

            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title={soundEnabled ? 'Mute Collision Click' : 'Enable Metallic Collision Sound'}
            >
              {soundEnabled ? (
                <Volume2 className="h-2.5 w-2.5 text-blue-600" />
              ) : (
                <VolumeX className="h-2.5 w-2.5 text-slate-400" />
              )}
            </button>
          </div>

          {/* Right: Expand to Full Laboratory */}
          <div className="flex items-center gap-1">
            <span className="hidden xl:inline text-[8px] font-mono text-slate-400">
              Zero-Gap Contact
            </span>
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-black transition-colors cursor-pointer"
              title="Expand into full 3D Physics Laboratory"
            >
              <Maximize2 className="h-2.5 w-2.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Fullscreen Interactive Physics Modal when Expanded */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-slate-200 p-5 shadow-2xl flex flex-col justify-between max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-sm">
                  <Sparkles className="h-4 w-4 text-cyan-300" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    3D Newton&apos;s Cradle · Physics & Conservation of Momentum
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    5 Polished chrome spheres · Zero gap kiss contact · Elastic momentum transfer
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-black transition-colors cursor-pointer"
              >
                <Minimize2 className="h-5 w-5" />
              </button>
            </div>

            {/* Presets & Actions Toolbar */}
            <div className="py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Presets:</span>
                <button
                  type="button"
                  onClick={() => pullLeftBall(-0.61)}
                  className="px-2.5 py-1 rounded-lg bg-black text-white font-semibold text-xs hover:bg-neutral-800 transition-all cursor-pointer"
                >
                  Pull Left (1 Ball)
                </button>
                <button
                  type="button"
                  onClick={pullTwoBalls}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-all cursor-pointer"
                >
                  Pull 2 Balls
                </button>
                <button
                  type="button"
                  onClick={() => pullRightBall(0.61)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-all cursor-pointer"
                >
                  Pull Right (1 Ball)
                </button>
                <button
                  type="button"
                  onClick={resetToRest}
                  className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition-all cursor-pointer"
                >
                  Rest All
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setContinuousMode(!continuousMode)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    continuousMode
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {continuousMode ? 'Perpetual Mode ON' : 'Realistic Damping ON'}
                </button>

                <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg text-xs font-mono">
                  <Gauge className="h-3 w-3 text-slate-500" />
                  <button
                    type="button"
                    onClick={() => {
                      if (speedScale === 1.0) setSpeedScale(1.5);
                      else if (speedScale === 1.5) setSpeedScale(0.6);
                      else setSpeedScale(1.0);
                    }}
                    className="font-bold text-slate-800 hover:underline cursor-pointer"
                  >
                    Speed: {speedScale}x
                  </button>
                </div>
              </div>
            </div>

            {/* Instruction Tip */}
            <div className="pt-2 text-center text-xs text-slate-500">
              Drag any ball manually with your pointer to lift it, then release to watch momentum conservation!
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Interactive Three.js WebGL Simulation</span>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="py-1 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold cursor-pointer"
              >
                Close Fullscreen
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
