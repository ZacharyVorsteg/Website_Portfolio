'use client';
import React, { useEffect, useRef } from 'react';

type Props = {
  progress: number; // 0..1 provided by ScrollScene
  width?: number;
  height?: number;
  className?: string;
};

/**
 * Procedural "image sequence" drawn on <canvas> based on scroll progress.
 * No external assets; easy to ship anywhere.
 */
export default function ImageSequenceCanvas({
  progress,
  width = 900,
  height = 600,
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.floor(width * dpr);
    c.height = Math.floor(height * dpr);
    c.style.width = `${width}px`;
    c.style.height = `${height}px`;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    draw(ctx, width, height, progress);
  }, [progress, width, height]);

  return <canvas ref={canvasRef} className={className} />;
}

function draw(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number // 0..1
) {
  // Background gradient shifts with t
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, `hsl(${200 + 80 * t}, 70%, 12%)`);
  g.addColorStop(1, `hsl(${280 + 80 * t}, 70%, 18%)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Concentric rings expand with t
  const rings = 6;
  for (let i = 0; i < rings; i++) {
    const p = i / (rings - 1);
    const r = 40 + (Math.min(w, h) * 0.45) * (p * t);
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(${220 + p * 100}, 80%, ${60 - p * 25}%, ${0.35 - p * 0.05})`;
    ctx.lineWidth = 6 - p * 4;
    ctx.stroke();
  }

  // Moving blob
  const bx = w * (0.2 + 0.6 * t);
  const by = h * (0.6 - 0.2 * Math.sin(t * Math.PI * 2));
  ctx.beginPath();
  ctx.fillStyle = `hsla(${340 - 140 * t}, 85%, 60%, 0.85)`;
  roundedRect(ctx, bx - 90, by - 60, 180, 120, 24 + 24 * t);
  ctx.fill();

  // Title
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = '600 36px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica';
  ctx.textAlign = 'center';
  ctx.fillText('Scroll-scrubbed Canvas', w / 2, 64);
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
