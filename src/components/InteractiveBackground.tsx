import React, { useEffect, useRef } from 'react';

interface ConstellationNode {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  alpha: number;
  baseAlpha: number;
  color: string;
  glowColor: string;
  twinklePhase: number;
  twinkleSpeed: number;
  isSpecialNode: boolean;
}

interface CosmicEmber {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
  decay: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
}

export const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Pointer state
    const pointer = {
      x: -1000,
      y: -1000,
      active: false,
      vx: 0,
      vy: 0,
      lastX: -1000,
      lastY: -1000,
    };

    // Scroll impulse
    let scrollImpulseY = 0;
    let lastScrollY = window.scrollY;

    // Palette matching the reference image: deep dark noir with red/coral/amber cosmic nodes
    const nodePalette = [
      { color: '#ffffff', glow: 'rgba(255, 255, 255, 0.6)' },
      { color: '#ef4444', glow: 'rgba(239, 68, 68, 0.8)' },   // Primary red
      { color: '#f87171', glow: 'rgba(248, 113, 113, 0.7)' }, // Coral
      { color: '#f97316', glow: 'rgba(249, 115, 22, 0.7)' },  // Warm amber
      { color: '#fda4af', glow: 'rgba(253, 164, 175, 0.5)' }, // Soft rose
    ];

    // Create constellation nodes
    const nodeCount = Math.min(Math.floor((width * height) / 11000), 120);
    const nodes: ConstellationNode[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const paletteItem = nodePalette[Math.floor(Math.random() * nodePalette.length)];
      const isSpecial = Math.random() < 0.25;
      const baseRadius = isSpecial ? Math.random() * 1.8 + 1.4 : Math.random() * 1.2 + 0.6;
      const baseAlpha = Math.random() * 0.5 + 0.35;
      const x = Math.random() * width;
      const y = Math.random() * height;

      nodes.push({
        x,
        y,
        originX: x,
        originY: y,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: baseRadius,
        baseRadius,
        alpha: baseAlpha,
        baseAlpha,
        color: paletteItem.color,
        glowColor: paletteItem.glow,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.025 + 0.01,
        isSpecialNode: isSpecial,
      });
    }

    // Drifting embers
    const embers: CosmicEmber[] = [];
    const maxEmbers = 40;

    const spawnEmber = () => {
      if (embers.length >= maxEmbers) return;
      embers.push({
        x: Math.random() * width,
        y: height + 10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(Math.random() * 1.0 + 0.4),
        radius: Math.random() * 1.6 + 0.8,
        alpha: Math.random() * 0.6 + 0.3,
        color: Math.random() < 0.7 ? '#ef4444' : '#f97316',
        decay: Math.random() * 0.003 + 0.0015,
      });
    };

    // Ripples triggered on tap / click
    const ripples: Ripple[] = [];

    // Connection distance for constellation lines
    const maxDist = Math.min(width * 0.12, 130);

    // Handle resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    // Handle scroll inertia
    const handleScroll = () => {
      const deltaY = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      scrollImpulseY += deltaY * 0.08;
    };

    // Pointer move
    const handlePointerMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      if (pointer.lastX > -500) {
        pointer.vx = (x - pointer.lastX) * 0.3;
        pointer.vy = (y - pointer.lastY) * 0.3;
      }
      pointer.x = x;
      pointer.y = y;
      pointer.lastX = x;
      pointer.lastY = y;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
      pointer.x = -1000;
      pointer.y = -1000;
    };

    // Touch handlers for mobile fingers scrolling
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const x = touch.clientX;
        const y = touch.clientY;
        if (pointer.lastX > -500) {
          pointer.vx = (x - pointer.lastX) * 0.4;
          pointer.vy = (y - pointer.lastY) * 0.4;
        }
        pointer.x = x;
        pointer.y = y;
        pointer.lastX = x;
        pointer.lastY = y;
        pointer.active = true;
      }
    };

    const handleTouchEnd = () => {
      pointer.active = false;
      pointer.x = -1000;
      pointer.y = -1000;
    };

    const handleClick = (e: MouseEvent) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: Math.min(width * 0.35, 240),
        alpha: 0.7,
        speed: 5.5,
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('click', handleClick);

    // Main render loop
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 16.6, 2.0);
      lastTime = time;

      // Deep dark canvas clearing
      ctx.fillStyle = '#0a0b12';
      ctx.fillRect(0, 0, width, height);

      // Subtle ambient cosmic gradient
      const grad = ctx.createRadialGradient(
        width * 0.75,
        height * 0.3,
        10,
        width * 0.75,
        height * 0.3,
        Math.max(width, height) * 0.65
      );
      grad.addColorStop(0, 'rgba(239, 68, 68, 0.05)');
      grad.addColorStop(0.5, 'rgba(249, 115, 22, 0.02)');
      grad.addColorStop(1, 'rgba(10, 11, 18, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Decay scroll impulse
      scrollImpulseY *= 0.92;

      // Spawn drifting embers
      if (Math.random() < 0.15) {
        spawnEmber();
      }

      // 1. Update and draw ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed * dt;
        r.alpha -= 0.015 * dt;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(239, 68, 68, ${r.alpha * 0.45})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      // 2. Update and draw embers
      for (let i = embers.length - 1; i >= 0; i--) {
        const emb = embers[i];
        emb.x += emb.vx * dt;
        emb.y += emb.vy * dt - scrollImpulseY * 0.3;
        emb.alpha -= emb.decay * dt;

        if (emb.alpha <= 0 || emb.y < -20) {
          embers.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(emb.x, emb.y, emb.radius, 0, Math.PI * 2);
        ctx.fillStyle = emb.color;
        ctx.globalAlpha = Math.max(0, emb.alpha);
        ctx.shadowColor = emb.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      // 3. Update nodes
      const repelDist = 120;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // Base drift
        n.x += n.vx * dt;
        n.y += n.vy * dt - scrollImpulseY * 0.4;

        // Wrap around screen edges
        if (n.x < -10) n.x = width + 10;
        if (n.x > width + 10) n.x = -10;
        if (n.y < -10) n.y = height + 10;
        if (n.y > height + 10) n.y = -10;

        // Cursor / Touch repulsion
        if (pointer.active && pointer.x > -500) {
          const dx = n.x - pointer.x;
          const dy = n.y - pointer.y;
          const dist = Math.hypot(dx, dy);

          if (dist < repelDist && dist > 1) {
            const force = (1 - dist / repelDist) * 3.5;
            n.vx += (dx / dist) * force * 0.2;
            n.vy += (dy / dist) * force * 0.2;
            n.alpha = Math.min(1, n.baseAlpha + 0.4);
          }
        }

        // Ripple reaction
        for (let r = 0; r < ripples.length; r++) {
          const rip = ripples[r];
          const rdx = n.x - rip.x;
          const rdy = n.y - rip.y;
          const rdist = Math.hypot(rdx, rdy);
          if (Math.abs(rdist - rip.radius) < 20 && rdist > 1) {
            const ripForce = rip.alpha * 1.5;
            n.vx += (rdx / rdist) * ripForce;
            n.vy += (rdy / rdist) * ripForce;
          }
        }

        // Friction damping
        n.vx *= 0.96;
        n.vy *= 0.96;

        // Twinkle
        n.twinklePhase += n.twinkleSpeed;
        n.radius = n.baseRadius + Math.sin(n.twinklePhase) * 0.3;
        n.alpha += (n.baseAlpha - n.alpha) * 0.05;
      }

      // 4. Draw constellation lines between nearby nodes
      ctx.lineWidth = 0.6;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.28 * Math.min(a.alpha, b.alpha);
            ctx.strokeStyle = `rgba(239, 68, 68, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // 5. Draw the constellation nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        ctx.beginPath();
        ctx.arc(n.x, n.y, Math.max(0.4, n.radius), 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, n.alpha));

        if (n.isSpecialNode) {
          ctx.shadowColor = n.glowColor;
          ctx.shadowBlur = 8;
        }

        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
};
