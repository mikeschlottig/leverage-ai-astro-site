// ============================================================
// HERO — Full-viewport hero section with:
//   - Animated entry sequence (waits for preloader:complete)
//   - Count-up stats animation
//   - Background image with slow breathe zoom
//   - Eyebrow → Headline → Sub → CTAs → Stats layout
//
// Config: heroConfig in site-config.ts
// Replace backgroundImage with your hero image (1920×1080, dark).
// ============================================================
import { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { heroConfig } from '../lib/site-config';

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active || target === 0) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

export default function Hero() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const start = () => {
      setTimeout(() => setPhase(1), 100);
      setTimeout(() => setPhase(2), 800);
      setTimeout(() => setPhase(3), 1400);
      setTimeout(() => setPhase(4), 2000);
    };
    window.addEventListener('preloader:complete', start);
    return () => window.removeEventListener('preloader:complete', start);
  }, []);

  const statsActive = phase >= 4;

  return (
    <section style={{ position: 'relative', height: '100vh', minHeight: '700px', overflow: 'hidden' }}>

      {/* ─── Background Image ──────────────────────────────── */}
      <div
        className="hero-breathe"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${heroConfig.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Dark overlay for text legibility */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.2) 100%)',
      }} />

      {/* ─── Content ──────────────────────────────────────── */}
      <div className="container-custom" style={{
        position: 'relative',
        zIndex: 10,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: '5rem',
      }}>
        <div style={{ maxWidth: '680px' }}>

          {/* Eyebrow */}
          <p
            className="eyebrow-lg has-bar"
            style={{
              opacity: phase >= 1 ? 1 : 0,
              transform: phase >= 1 ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
              marginBottom: '1.5rem',
            }}
          >
            {heroConfig.eyebrow}
          </p>

          {/* Headline */}
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.8rem, 6vw, 5rem)',
              fontWeight: 300,
              lineHeight: 1.1,
              color: 'var(--text-primary)',
              margin: '0 0 1.5rem',
              opacity: phase >= 2 ? 1 : 0,
              transform: phase >= 2 ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
            }}
          >
            {heroConfig.headline}
          </h1>

          {/* Subheadline */}
          <p
            style={{
              fontSize: '1.125rem',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              margin: '0 0 2.5rem',
              maxWidth: '520px',
              opacity: phase >= 3 ? 1 : 0,
              transform: phase >= 3 ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
            }}
          >
            {heroConfig.subheadline}
          </p>

          {/* CTAs */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              opacity: phase >= 3 ? 1 : 0,
              transform: phase >= 3 ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.6s ease-out 0.1s, transform 0.6s ease-out 0.1s',
            }}
          >
            <a href={heroConfig.ctaButtonHref} className="btn-primary">
              {heroConfig.ctaButtonText}
              <ArrowRight size={16} />
            </a>
            <a href={heroConfig.ctaSecondaryHref} className="btn-secondary">
              {heroConfig.ctaSecondaryText}
            </a>
          </div>
        </div>

        {/* ─── Stats Bar ──────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: '2rem',
            right: '2rem',
            display: 'grid',
            gridTemplateColumns: `repeat(${heroConfig.stats.length}, 1fr)`,
            gap: '1rem',
            maxWidth: 'var(--container-max)',
            opacity: statsActive ? 1 : 0,
            transition: 'opacity 0.8s ease-out',
          }}
        >
          {heroConfig.stats.map((stat, i) => {
            const count = useCountUp(stat.value, 2000 + i * 100, statsActive);
            return (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
                  fontWeight: 300,
                  color: 'var(--accent)',
                  lineHeight: 1,
                }}>
                  {count}{stat.suffix}
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginTop: '0.4rem',
                }}>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Optional: decorative vertical side text (desktop only) */}
      <div style={{
        position: 'absolute',
        right: '2rem',
        top: '50%',
        transform: 'rotate(90deg) translateX(-50%)',
        transformOrigin: 'right center',
        fontSize: '0.65rem',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        opacity: phase >= 4 ? 0.5 : 0,
        transition: 'opacity 0.8s ease-out',
        whiteSpace: 'nowrap',
      }} className="desktop-only">
        {heroConfig.decorativeText}
      </div>

      <style>{`
        @media (max-width: 767px) { .desktop-only { display: none; } }
      `}</style>
    </section>
  );
}
