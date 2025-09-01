'use client';
import React from 'react';
import ScrollScene from '@/components/scroll/ScrollScene';
import Parallax from '@/components/scroll/Parallax';
import ImageSequenceCanvas from '@/components/scroll/ImageSequenceCanvas';
import SVGDraw from '@/components/scroll/SVGDraw';
import ProgressBar from '@/components/scroll/ProgressBar';

export default function Page() {
  return (
    <main className="scroll-demo">
      <ProgressBar />

      {/* 1) Pinned hero with scrubbed zoom + text mask */}
      <ScrollScene heightVh={240}>
        {(p) => (
          <section className="hero">
            <div
              className="hero-bg"
              style={{ transform: `scale(${1 + p * 0.4})` }}
            />
            <div className="hero-inner">
              <h1
                style={{
                  letterSpacing: `${p * 8}px`,
                  transform: `translateY(${(0.5 - p) * 40}px)`,
                  opacity: 0.6 + p * 0.4,
                  WebkitMaskImage: `linear-gradient(to bottom,
                      rgba(0,0,0,${0.15 + p * 0.85}) 30%,
                      rgba(0,0,0,1) 70%)`,
                  maskImage: `linear-gradient(to bottom,
                      rgba(0,0,0,${0.15 + p * 0.85}) 30%,
                      rgba(0,0,0,1) 70%)`,
                }}
              >
                Scrollytelling, Upgraded
              </h1>
              <p style={{ opacity: 0.2 + p * 0.8 }}>
                Pinned. Scrubbed. Smooth. Accessible.
              </p>
            </div>
          </section>
        )}
      </ScrollScene>

      {/* 2) Parallax cards */}
      <section className="section dark">
        <div className="container">
          <Parallax speed={0.18}>
            <h2 className="title">Parallax Grid</h2>
          </Parallax>
          <div className="grid">
            {[...Array(6)].map((_, i) => (
              <Parallax key={i} speed={0.25 + (i % 3) * 0.1}>
                <div className="card">
                  <h3>Card {i + 1}</h3>
                  <p>Content drifts at different speeds for depth.</p>
                </div>
              </Parallax>
            ))}
          </div>
        </div>
      </section>

      {/* 3) Pinned canvas image-sequence (procedural) */}
      <ScrollScene heightVh={220}>
        {(p) => (
          <section className="section">
            <ImageSequenceCanvas progress={p} />
          </section>
        )}
      </ScrollScene>

      {/* 4) SVG path draw on scroll */}
      <section className="section pale">
        <div className="container">
          <h2 className="title">SVG Line Drawing</h2>
          <SVGDraw />
        </div>
      </section>

      {/* 5) Outro */}
      <section className="section">
        <div className="container center">
          <h2 className="title">That "wow, it moves" feeling</h2>
          <p className="muted">
            All effects respect reduced motion and use transform/opacity for 60fps.
          </p>
        </div>
      </section>
    </main>
  );
}
