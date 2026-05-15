// ============================================================
// GALLERY CAROUSEL
//
// Auto-advancing carousel (6s interval) with:
//   - Direction-aware slide transitions (left/right)
//   - Left: Large image with Ken Burns zoom on active slide
//   - Right: Content panel (tag, title, metric, description, CTA)
//   - Navigation: Prev/Next buttons + dot indicators
//
// Use for: portfolio, use cases, locations, community, gallery
// Config: galleryCarouselConfig in site-config.ts
// ============================================================
import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryCarouselConfig } from '../lib/site-config';

const INTERVAL = 6000;

export default function GalleryCarousel() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState<'left' | 'right'>('left');
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const slides = galleryCarouselConfig.slides;

  const go = useCallback((next: number, direction: 'left' | 'right') => {
    if (animating) return;
    setDir(direction);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(next);
      setAnimating(false);
    }, 400);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => go((next + 1) % slides.length, 'left'), INTERVAL);
  }, [animating, slides.length]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, INTERVAL);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [slides.length]);

  const prev = () => go((current - 1 + slides.length) % slides.length, 'right');
  const next = () => go((current + 1) % slides.length, 'left');

  const slide = slides[current];

  return (
    <section id="gallery" style={{ backgroundColor: 'var(--surface-1)', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', minHeight: '600px' }}>

        {/* ─── Left: Image Panel ──────────────────────────── */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          {slides.map((s, i) => (
            <div
              key={s.id}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: i === current ? 1 : 0,
                transition: 'opacity 0.6s ease',
              }}
            >
              <div
                className={i === current ? 'kenburns' : ''}
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${s.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              {/* Gradient overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, transparent 70%, var(--surface-1) 100%)',
              }} />
            </div>
          ))}

          {/* Slide counter */}
          <div style={{
            position: 'absolute',
            bottom: '2rem',
            right: '2rem',
            display: 'flex',
            gap: '0.5rem',
            zIndex: 10,
          }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i, i > current ? 'left' : 'right')}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: i === current ? '2rem' : '0.5rem',
                  height: '0.5rem',
                  borderRadius: '0.25rem',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: i === current ? 'var(--accent)' : 'rgba(255,255,255,0.3)',
                  transition: 'width 0.3s ease, background-color 0.3s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>

          {/* Counter text */}
          <div style={{
            position: 'absolute',
            bottom: '2rem',
            left: '2rem',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            color: 'rgba(255,255,255,0.5)',
          }}>
            {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </div>
        </div>

        {/* ─── Right: Content Panel ───────────────────────── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '4rem 3rem',
          position: 'relative',
        }}>
          <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>{galleryCarouselConfig.eyebrow}</p>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            {slide.tag}
          </p>

          <h2
            key={current}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
              fontWeight: 300,
              lineHeight: 1.2,
              margin: '0 0 1.5rem',
              opacity: animating ? 0 : 1,
              transform: animating
                ? `translateX(${dir === 'left' ? '20px' : '-20px'})`
                : 'translateX(0)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            {slide.title}
          </h2>

          {/* Metric */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--accent)', fontWeight: 300 }}>
              {slide.metric}
            </span>
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
              {slide.metricLabel}
            </span>
          </div>

          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem', fontSize: '0.9rem' }}>
            {slide.description}
          </p>

          <a href={slide.ctaHref} className="btn-primary" style={{ alignSelf: 'flex-start', fontSize: '0.8rem' }}>
            {slide.ctaLabel} <ChevronRight size={14} />
          </a>

          {/* Prev / Next */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2.5rem' }}>
            <button
              onClick={prev}
              aria-label="Previous slide"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '2.5rem', height: '2.5rem',
                border: '1px solid var(--border-subtle)',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'border-color 0.2s, color 0.2s',
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '2.5rem', height: '2.5rem',
                border: '1px solid var(--accent)',
                borderRadius: '50%',
                backgroundColor: 'var(--accent)',
                color: '#fff',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 767px) {
          #gallery > div {
            grid-template-columns: 1fr !important;
          }
          #gallery > div > div:first-child {
            min-height: 300px;
            position: relative !important;
          }
        }
      `}</style>
    </section>
  );
}
