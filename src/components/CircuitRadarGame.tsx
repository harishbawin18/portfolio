import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Shield, Zap, Crosshair } from 'lucide-react';

interface Packet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: 'packet' | 'glitch' | 'powerup';
  label: string;
  color: string;
  scoreVal: number;
  health: number;
  angle: number;
  distance: number;
  rotation: number;
}

interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  vy: number;
}

export const CircuitRadarGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Game UI state
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('embedded_radar_highscore') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [coreHp, setCoreHp] = useState<number>(100);
  const [clockMhz, setClockMhz] = useState<number>(16);
  const [combo, setCombo] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Audio Context (Synthesizer)
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playSfx = useCallback((type: 'shoot' | 'hit' | 'glitch' | 'damage' | 'overclock' | 'gameover') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx || ctx.state !== 'running') return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'shoot') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.1);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'hit') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(1040, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'glitch') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.setValueAtTime(150, now + 0.05);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'damage') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.linearRampToValueAtTime(60, now + 0.25);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'overclock') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.3);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'gameover') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.5);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch {
      // Audio fallback silent
    }
  }, [soundEnabled]);

  // Game internal mutable state
  const stateRef = useRef({
    gameState: 'idle' as 'idle' | 'playing' | 'gameover',
    score: 0,
    coreHp: 100,
    clockMhz: 16,
    combo: 1,
    comboTimer: 0,
    aimAngle: -Math.PI / 2,
    radarAngle: 0,
    mousePos: { x: 0, y: 0 },
    isFiring: false,
    lastFireTime: 0,
    spawnTimer: 0,
    packets: [] as Packet[],
    bullets: [] as Bullet[],
    particles: [] as Particle[],
    floatingTexts: [] as FloatingText[],
    corePulse: 0,
    nextId: 1,
  });

  // Keep ref synchronized
  useEffect(() => {
    stateRef.current.gameState = gameState;
  }, [gameState]);

  // Start game handler
  const startGame = () => {
    initAudio();
    const st = stateRef.current;
    st.gameState = 'playing';
    st.score = 0;
    st.coreHp = 100;
    st.clockMhz = 16;
    st.combo = 1;
    st.comboTimer = 0;
    st.packets = [];
    st.bullets = [];
    st.particles = [];
    st.floatingTexts = [];
    st.spawnTimer = 0;
    st.lastFireTime = 0;

    setGameState('playing');
    setScore(0);
    setCoreHp(100);
    setClockMhz(16);
    setCombo(1);
    playSfx('overclock');
  };

  // Shoot bullet from center
  const fireBullet = useCallback(() => {
    const st = stateRef.current;
    if (st.gameState !== 'playing') return;

    const now = performance.now();
    if (now - st.lastFireTime < 130) return; // Fire rate limit
    st.lastFireTime = now;

    const speed = 7.5;
    const angle = st.aimAngle;
    const coreRadius = 26;
    const bx = Math.cos(angle) * coreRadius;
    const by = Math.sin(angle) * coreRadius;

    st.bullets.push({
      x: bx,
      y: by,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: 45,
      color: '#ef4444',
    });

    // Recoil / core pulse
    st.corePulse = 8;

    // Small muzzle flash particles
    for (let i = 0; i < 4; i++) {
      const spread = (Math.random() - 0.5) * 0.4;
      st.particles.push({
        x: bx,
        y: by,
        vx: Math.cos(angle + spread) * (Math.random() * 2 + 1),
        vy: Math.sin(angle + spread) * (Math.random() * 2 + 1),
        alpha: 1,
        size: Math.random() * 2.5 + 1.5,
        color: '#f97316',
      });
    }

    playSfx('shoot');
  }, [playSfx]);

  // Aim handler
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    stateRef.current.mousePos = { x, y };
    stateRef.current.aimAngle = Math.atan2(y, x);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    initAudio();
    if (gameState === 'idle' || gameState === 'gameover') {
      startGame();
      return;
    }
    stateRef.current.isFiring = true;
    handlePointerMove(e);
    fireBullet();
  };

  const handlePointerUp = () => {
    stateRef.current.isFiring = false;
  };

  // Keyboard controls (Space to fire)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (stateRef.current.gameState === 'playing') {
          fireBullet();
        } else if (stateRef.current.gameState === 'idle' || stateRef.current.gameState === 'gameover') {
          startGame();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fireBullet]);

  // Main Canvas Render & Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const packetPrototypes = [
      { label: 'SPI', color: '#06b6d4', score: 120, type: 'packet' as const },
      { label: 'I2C', color: '#10b981', score: 100, type: 'packet' as const },
      { label: 'UART', color: '#eab308', score: 90, type: 'packet' as const },
      { label: 'CAN', color: '#3b82f6', score: 150, type: 'packet' as const },
      { label: 'DMA', color: '#8b5cf6', score: 200, type: 'powerup' as const },
      { label: 'JITTER', color: '#ef4444', score: 50, type: 'glitch' as const },
      { label: 'EMI', color: '#f97316', score: 60, type: 'glitch' as const },
      { label: 'SURGE', color: '#dc2626', score: 70, type: 'glitch' as const },
    ];

    const render = () => {
      const st = stateRef.current;
      const width = canvas.width;
      const height = canvas.height;
      const radius = Math.min(width, height) / 2;
      const centerX = width / 2;
      const centerY = height / 2;

      // Clear with dark cybernetic gradient
      ctx.clearRect(0, 0, width, height);

      // Save center coordinate system
      ctx.save();
      ctx.translate(centerX, centerY);

      // Radar rotation
      st.radarAngle = (st.radarAngle + 0.02) % (Math.PI * 2);

      // 1. Radar background grid & circles
      ctx.save();
      // Outer circular boundary clip
      ctx.beginPath();
      ctx.arc(0, 0, radius - 4, 0, Math.PI * 2);
      ctx.fillStyle = '#0b0d13';
      ctx.fill();
      ctx.clip();

      // Deep radial glow
      const radialGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, radius);
      radialGrad.addColorStop(0, 'rgba(239, 68, 68, 0.22)');
      radialGrad.addColorStop(0.5, 'rgba(185, 28, 28, 0.08)');
      radialGrad.addColorStop(1, 'rgba(11, 13, 19, 0.95)');
      ctx.fillStyle = radialGrad;
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

      // Concentric Radar Range Rings
      const ringSteps = [0.28, 0.52, 0.76, 0.96];
      ringSteps.forEach((step, idx) => {
        ctx.beginPath();
        ctx.arc(0, 0, radius * step, 0, Math.PI * 2);
        ctx.strokeStyle = idx === ringSteps.length - 1 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(239, 68, 68, 0.15)';
        ctx.lineWidth = 1;
        if (idx % 2 === 1) {
          ctx.setLineDash([4, 4]);
        } else {
          ctx.setLineDash([]);
        }
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Crosshairs & Diagonal Grid
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-radius, 0);
      ctx.lineTo(radius, 0);
      ctx.moveTo(0, -radius);
      ctx.lineTo(0, radius);
      ctx.stroke();

      // Diagonal tech ticks
      const angles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
      angles.forEach((ang) => {
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * radius * 0.4, Math.sin(ang) * radius * 0.4);
        ctx.lineTo(Math.cos(ang) * radius * 0.96, Math.sin(ang) * radius * 0.96);
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.08)';
        ctx.stroke();
      });

      // Radar Sweep Fan
      ctx.save();
      const sweepAngle = st.radarAngle;
      const sweepGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      sweepGrad.addColorStop(0, 'rgba(239, 68, 68, 0.25)');
      sweepGrad.addColorStop(1, 'rgba(239, 68, 68, 0.0)');

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, sweepAngle - 0.5, sweepAngle);
      ctx.closePath();
      ctx.fillStyle = sweepGrad;
      ctx.fill();

      // Radar sweep leading edge line
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(sweepAngle) * radius, Math.sin(sweepAngle) * radius);
      ctx.strokeStyle = 'rgba(255, 100, 100, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // ================= IN-GAME LOGIC & RENDERING =================
      if (st.gameState === 'playing') {
        // Continuous fire if pointer held down
        if (st.isFiring) {
          const now = performance.now();
          if (now - st.lastFireTime >= 140) {
            fireBullet();
          }
        }

        // Spawn timer
        st.spawnTimer++;
        const spawnInterval = Math.max(35, 80 - Math.floor(st.score / 600) * 5);
        if (st.spawnTimer >= spawnInterval) {
          st.spawnTimer = 0;
          const proto = packetPrototypes[Math.floor(Math.random() * packetPrototypes.length)];
          const spawnAng = Math.random() * Math.PI * 2;
          const spawnDist = radius * 0.95;
          const speed = (Math.random() * 0.6 + 0.6) * (1 + st.clockMhz / 800);

          st.packets.push({
            id: st.nextId++,
            x: Math.cos(spawnAng) * spawnDist,
            y: Math.sin(spawnAng) * spawnDist,
            vx: -Math.cos(spawnAng) * speed,
            vy: -Math.sin(spawnAng) * speed,
            radius: proto.type === 'glitch' ? 14 : 16,
            type: proto.type,
            label: proto.label,
            color: proto.color,
            scoreVal: proto.score,
            health: proto.type === 'glitch' ? 1 : 1,
            angle: spawnAng,
            distance: spawnDist,
            rotation: 0,
          });
        }

        // Combo decay
        if (st.combo > 1) {
          st.comboTimer--;
          if (st.comboTimer <= 0) {
            st.combo = 1;
            setCombo(1);
          }
        }

        // Update Bullets
        for (let i = st.bullets.length - 1; i >= 0; i--) {
          const b = st.bullets[i];
          b.x += b.vx;
          b.y += b.vy;
          b.life++;

          // Bullet glow trail
          ctx.beginPath();
          ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Bullet trail segment
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(b.x - b.vx * 1.5, b.y - b.vy * 1.5);
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Out of bounds / life expired
          const distFromCenter = Math.hypot(b.x, b.y);
          if (distFromCenter > radius || b.life > b.maxLife) {
            st.bullets.splice(i, 1);
            continue;
          }

          // Collision with packets
          for (let j = st.packets.length - 1; j >= 0; j--) {
            const p = st.packets[j];
            const dist = Math.hypot(b.x - p.x, b.y - p.y);

            if (dist < p.radius + 4) {
              // Hit!
              st.bullets.splice(i, 1);
              p.health--;

              if (p.health <= 0) {
                // Destroyed / Captured!
                st.packets.splice(j, 1);

                // Score & combo
                const earned = p.scoreVal * st.combo;
                st.score += earned;
                st.combo = Math.min(8, st.combo + 1);
                st.comboTimer = 180; // 3 seconds at 60fps

                // Clock overclock boost
                if (p.type === 'packet') {
                  st.clockMhz = Math.min(1024, st.clockMhz + 4);
                  playSfx('hit');
                } else if (p.type === 'powerup') {
                  st.clockMhz = Math.min(1024, st.clockMhz + 16);
                  st.coreHp = Math.min(100, st.coreHp + 15);
                  setCoreHp(st.coreHp);
                  playSfx('overclock');
                } else {
                  playSfx('glitch');
                }

                setScore(st.score);
                setCombo(st.combo);
                setClockMhz(st.clockMhz);

                // High score update
                if (st.score > highScore) {
                  setHighScore(st.score);
                  try {
                    localStorage.setItem('embedded_radar_highscore', st.score.toString());
                  } catch {
                    // ignore
                  }
                }

                // Floating points text
                st.floatingTexts.push({
                  id: st.nextId++,
                  x: p.x,
                  y: p.y,
                  text: `+${earned}`,
                  color: p.color,
                  alpha: 1,
                  vy: -1.2,
                });

                // Particle explosion
                for (let k = 0; k < 12; k++) {
                  const spd = Math.random() * 3 + 1;
                  const partAng = Math.random() * Math.PI * 2;
                  st.particles.push({
                    x: p.x,
                    y: p.y,
                    vx: Math.cos(partAng) * spd,
                    vy: Math.sin(partAng) * spd,
                    alpha: 1,
                    size: Math.random() * 3 + 1.5,
                    color: p.color,
                  });
                }
              }
              break;
            }
          }
        }

        // Update Packets / Entities
        const coreCollisionRadius = 30;
        for (let i = st.packets.length - 1; i >= 0; i--) {
          const p = st.packets[i];
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += 0.03;

          const distToCenter = Math.hypot(p.x, p.y);

          // Impact with Silicon Core
          if (distToCenter <= coreCollisionRadius) {
            st.packets.splice(i, 1);

            if (p.type === 'glitch') {
              // Glitch damage!
              st.coreHp = Math.max(0, st.coreHp - 25);
              st.combo = 1;
              setCombo(1);
              setCoreHp(st.coreHp);
              playSfx('damage');

              st.floatingTexts.push({
                id: st.nextId++,
                x: 0,
                y: -15,
                text: '-25% EMI',
                color: '#ef4444',
                alpha: 1,
                vy: -1.5,
              });

              // Shockwave screen shake particles
              for (let k = 0; k < 18; k++) {
                const spd = Math.random() * 4 + 1.5;
                const ang = Math.random() * Math.PI * 2;
                st.particles.push({
                  x: 0,
                  y: 0,
                  vx: Math.cos(ang) * spd,
                  vy: Math.sin(ang) * spd,
                  alpha: 1,
                  size: Math.random() * 4 + 2,
                  color: '#ef4444',
                });
              }

              if (st.coreHp <= 0) {
                // Game Over!
                st.gameState = 'gameover';
                setGameState('gameover');
                playSfx('gameover');
              }
            } else {
              // Harmless packet absorption
              st.score += 20;
              setScore(st.score);
              st.floatingTexts.push({
                id: st.nextId++,
                x: 0,
                y: -15,
                text: `+20 ${p.label}`,
                color: p.color,
                alpha: 1,
                vy: -1,
              });
            }
            continue;
          }

          // Draw Entity (Hex badge or Glitch spike)
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);

          if (p.type === 'glitch') {
            // Jagged Glitch Asteroid / Spike
            ctx.beginPath();
            const spikes = 6;
            for (let s = 0; s < spikes * 2; s++) {
              const r = s % 2 === 0 ? p.radius : p.radius * 0.55;
              const a = (s * Math.PI) / spikes;
              if (s === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
              else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
            }
            ctx.closePath();
            ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
            ctx.fill();
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Label
            ctx.rotate(-p.rotation);
            ctx.fillStyle = '#ff6b6b';
            ctx.font = 'bold 8.5px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.label, 0, 0);
          } else {
            // Hexagonal Protocol Packet
            ctx.beginPath();
            for (let s = 0; s < 6; s++) {
              const a = (s * Math.PI) / 3;
              const hx = Math.cos(a) * p.radius;
              const hy = Math.sin(a) * p.radius;
              if (s === 0) ctx.moveTo(hx, hy);
              else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.fill();
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 1.8;
            ctx.stroke();

            // Glow ring around powerup
            if (p.type === 'powerup') {
              ctx.beginPath();
              ctx.arc(0, 0, p.radius + 3, 0, Math.PI * 2);
              ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
              ctx.lineWidth = 1;
              ctx.stroke();
            }

            // Packet Text
            ctx.rotate(-p.rotation);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 8.5px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.label, 0, 0);
          }
          ctx.restore();
        }
      }

      // 2. Draw Central Core & Turret Probe
      const corePulseVal = Math.sin(Date.now() * 0.005) * 2;
      const baseRadius = 24 + corePulseVal + (st.corePulse > 0 ? st.corePulse : 0);
      if (st.corePulse > 0) st.corePulse -= 0.5;

      // Silicon Core Outer Shield Ring
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius + 4, 0, Math.PI * 2);
      ctx.strokeStyle = st.coreHp > 50 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(239, 68, 68, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Core Background Circle
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#14141d';
      ctx.fill();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Aiming Beam / Crosshair line toward cursor
      ctx.save();
      ctx.rotate(st.aimAngle);

      // Probe cannon
      ctx.beginPath();
      ctx.rect(baseRadius - 2, -3.5, 14, 7);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.strokeStyle = '#fca5a5';
      ctx.lineWidth = 1;
      ctx.stroke();

      // High-precision laser pointer dot
      ctx.beginPath();
      ctx.arc(baseRadius + 22, 0, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#f87171';
      ctx.fill();
      ctx.restore();

      // Central chip micro-circuitry icon
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('MCU', 0, -1);

      // 3. Update & Draw Particles
      for (let i = st.particles.length - 1; i >= 0; i--) {
        const pt = st.particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.alpha -= 0.025;

        if (pt.alpha <= 0) {
          st.particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // 4. Update & Draw Floating Texts
      for (let i = st.floatingTexts.length - 1; i >= 0; i--) {
        const ft = st.floatingTexts[i];
        ft.y += ft.vy;
        ft.alpha -= 0.02;

        if (ft.alpha <= 0) {
          st.floatingTexts.splice(i, 1);
          continue;
        }

        ctx.fillStyle = ft.color;
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.globalAlpha = 1;
      }

      ctx.restore(); // Restore clip
      ctx.restore(); // Restore center translate

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [highScore, fireBullet, playSfx]);

  // Adjust canvas size to match display size
  useEffect(() => {
    const updateCanvasSize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const size = Math.floor(Math.min(rect.width, rect.height));
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square max-w-[420px] mx-auto flex items-center justify-center select-none"
    >
      {/* Outer Glow Halo */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(239,68,68,0.25)_0%,rgba(249,115,22,0.12)_45%,transparent_72%)] blur-xl pointer-events-none" />

      {/* Outer HUD Rings with Cardinal Degrees */}
      <div className="absolute inset-0 rounded-full border border-red-500/30 pointer-events-none flex items-center justify-center">
        {/* Cardinal tech node dots */}
        <div className="absolute top-0 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
        <div className="absolute bottom-0 translate-y-1/2 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
        <div className="absolute left-0 -translate-x-1/2 w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_8px_#f97316]" />
        <div className="absolute right-0 translate-x-1/2 w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_8px_#f97316]" />

        {/* High-tech degree markers */}
        <span className="absolute top-1 text-[8.5px] font-mono text-red-400/80">000°</span>
        <span className="absolute right-2 text-[8.5px] font-mono text-red-400/80">090°</span>
        <span className="absolute bottom-1 text-[8.5px] font-mono text-red-400/80">180°</span>
        <span className="absolute left-2 text-[8.5px] font-mono text-red-400/80">270°</span>
      </div>

      {/* Intermediate Orbit Dashed Ring */}
      <div className="absolute inset-4 rounded-full border border-dashed border-red-500/20 pointer-events-none" />

      {/* The Interactive Game Canvas */}
      <canvas
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="relative z-10 rounded-full cursor-crosshair touch-none shadow-[0_0_35px_rgba(239,68,68,0.25)]"
      />

      {/* TOP HUD TELEMETRY BAR (Active during gameplay) */}
      {gameState === 'playing' && (
        <div className="absolute top-7 inset-x-8 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs border border-red-500/30 text-[10px] font-mono text-neutral-300">
            <Zap className="w-3 h-3 text-red-400 animate-pulse" />
            <span>{clockMhz} MHz</span>
          </div>

          {combo > 1 && (
            <div className="px-2 py-0.5 rounded bg-red-500/20 border border-red-500/60 text-[10px] font-mono font-bold text-red-300 animate-bounce">
              COMBO x{combo}
            </div>
          )}

          <div className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs border border-red-500/30 text-[10px] font-mono text-neutral-300">
            SCORE <span className="text-white font-bold">{score}</span>
          </div>
        </div>
      )}

      {/* BOTTOM HUD STATUS & AUDIO TOGGLE (Active during gameplay) */}
      {gameState === 'playing' && (
        <div className="absolute bottom-6 inset-x-8 z-20 flex items-center justify-between pointer-events-auto">
          {/* Core Integrity Bar */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/70 backdrop-blur-xs border border-red-500/30">
            <Shield className="w-3 h-3 text-red-400" />
            <div className="w-16 sm:w-20 h-2 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
              <div
                className={`h-full transition-all duration-300 ${
                  coreHp > 50 ? 'bg-red-500' : coreHp > 25 ? 'bg-amber-500' : 'bg-red-600 animate-pulse'
                }`}
                style={{ width: `${coreHp}%` }}
              />
            </div>
            <span className="text-[9px] font-mono text-neutral-400">{coreHp}%</span>
          </div>

          {/* Sound & Restart Mini Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSoundEnabled((v) => !v)}
              className="p-1 rounded bg-black/70 border border-red-500/30 text-neutral-300 hover:text-white hover:border-red-500 transition-colors cursor-pointer"
              title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
              aria-label="Toggle Sound"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-neutral-500" />}
            </button>
            <button
              onClick={startGame}
              className="p-1 rounded bg-black/70 border border-red-500/30 text-neutral-300 hover:text-white hover:border-red-500 transition-colors cursor-pointer"
              title="Restart"
              aria-label="Restart Game"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* IDLE OVERLAY: Start Game Screen */}
      {gameState === 'idle' && (
        <div className="absolute inset-8 z-20 rounded-full flex flex-col items-center justify-center p-4 text-center pointer-events-auto bg-black/45 backdrop-blur-[2px]">
          <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400 mb-2 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse">
            <Crosshair className="w-5 h-5" />
          </div>

          <h3 className="text-white font-mono font-bold text-sm tracking-wider uppercase mb-1">
            RADAR DEFENDER
          </h3>
          <p className="text-[10px] font-mono text-neutral-300 max-w-[200px] leading-tight mb-3">
            Aim & tap to intercept data packets (SPI, I2C, CAN) & blast EMI noise
          </p>

          <button
            onClick={startGame}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-600 to-orange-600 text-white font-mono text-xs font-semibold shadow-[0_0_20px_rgba(239,68,68,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>PLAY NOW</span>
          </button>

          {highScore > 0 && (
            <div className="mt-2 text-[9.5px] font-mono text-neutral-400">
              BEST RECORD: <span className="text-red-400 font-bold">{highScore}</span>
            </div>
          )}
        </div>
      )}

      {/* GAME OVER OVERLAY */}
      {gameState === 'gameover' && (
        <div className="absolute inset-8 z-20 rounded-full flex flex-col items-center justify-center p-4 text-center pointer-events-auto bg-black/80 backdrop-blur-xs border border-red-500/30">
          <div className="text-red-500 font-mono font-extrabold text-base tracking-widest uppercase mb-1">
            CORE OVERLOAD
          </div>
          <div className="text-[11px] font-mono text-neutral-300 mb-1">
            FINAL SCORE: <span className="text-white font-bold">{score}</span>
          </div>
          <div className="text-[9.5px] font-mono text-neutral-400 mb-3">
            CLOCK PEAK: <span className="text-amber-400">{clockMhz} MHz</span>
          </div>

          <button
            onClick={startGame}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-600 text-white font-mono text-xs font-semibold shadow-[0_0_20px_rgba(239,68,68,0.6)] hover:bg-red-500 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>REBOOT CORE</span>
          </button>
        </div>
      )}
    </div>
  );
};
