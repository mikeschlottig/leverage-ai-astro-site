// ============================================================
// PRELOADER — Full-screen loading animation.
//
// Sequence:
//   0ms       — visible, body scroll locked
//   2200ms    — begins fade out
//   2800ms    — removed from DOM, dispatches 'preloader:complete'
//
// Hero and other animated sections listen for 'preloader:complete'
// before starting their own entry animations.
//
// Config: preloaderConfig in site-config.ts
// ============================================================
import { useEffect, useState } from 'react';
import { preloaderConfig } from '../lib/site-config';

export default function Preloader() {
  const [phase, setPhase] = useState<'visible' | 'fading' | 'done'>('visible');

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const fadeTimer = setTimeout(() => setPhase('fading'), 2200);
    const doneTimer = setTimeout(() => {
      setPhase('done');
      document.body.style.overflow = '';
      window.dispatchEvent(new CustomEvent('preloader:complete'));
    }, 2800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = '';
    };
  }, []);

  if (phase === 'done') return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--page-bg)',
        opacity: phase === 'fading' ? 0 : 1,
        transition: 'opacity 0.6s ease-out',
      }}
    >
      {/* Brand wordmark */}
      <div className="preloader-text" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '3rem',
          fontWeight: 300,
          letterSpacing: '0.15em',
          color: 'var(--text-primary)',
          margin: 0,
        }}>
          {preloaderConfig.brandName}
          <span style={{ color: 'var(--accent)' }}> {preloaderConfig.brandSubname}</span>
        </h1>
        <p style={{
          fontSize: '0.75rem',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          margin: '0.5rem 0 0',
        }}>
          {preloaderConfig.tagline}
        </p>
      </div>

      {/* Loading bar */}
      <div
        className="preloader-line"
        style={{
          width: '60px',
          height: '1px',
          backgroundColor: 'var(--accent)',
        }}
      />
    </div>
  );
}
