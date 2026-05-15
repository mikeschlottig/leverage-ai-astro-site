// ============================================================
// BRAND STORY — About / Our Story section with:
//   - 3 content tabs (Philosophy, Process, Community — or customize)
//   - Horizontal scrollable timeline
//   - Tab image that transitions on switch
//   - Founder quote + photo
//   - Year badge + availability overlay on image
//
// Config: brandStoryConfig in site-config.ts
// ============================================================
import { useState, useEffect, useRef } from 'react';
import { brandStoryConfig } from '../lib/site-config';

export default function BrandStory() {
  const [activeTab, setActiveTab] = useState(0);
  const [imgVisible, setImgVisible] = useState(true);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const switchTab = (idx: number) => {
    if (idx === activeTab) return;
    setImgVisible(false);
    setTimeout(() => { setActiveTab(idx); setImgVisible(true); }, 300);
  };

  const tab = brandStoryConfig.tabs[activeTab];

  return (
    <section ref={sectionRef} id="story" className="section-padding" style={{ backgroundColor: 'var(--page-bg)' }}>
      <div className="container-custom">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'start' }}>

          {/* ─── Left: Content ──────────────────────────────── */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(-30px)',
            transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
          }}>
            <p className="eyebrow has-bar" style={{ marginBottom: '1rem' }}>{brandStoryConfig.eyebrow}</p>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 300,
              margin: '0 0 1.5rem',
            }}>
              {brandStoryConfig.headline}
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem', fontSize: '0.95rem' }}>
              {brandStoryConfig.intro}
            </p>

            {/* Tab Buttons */}
            <div style={{ display: 'flex', gap: '0', marginBottom: '2rem', borderBottom: '1px solid var(--border-subtle)' }}>
              {brandStoryConfig.tabs.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => switchTab(i)}
                  style={{
                    padding: '0.75rem 1.25rem',
                    fontSize: '0.75rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    background: 'none',
                    border: 'none',
                    borderBottom: i === activeTab ? '2px solid var(--accent)' : '2px solid transparent',
                    color: i === activeTab ? 'var(--text-primary)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    marginBottom: '-1px',
                    transition: 'color 0.2s, border-color 0.2s',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div key={activeTab} style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 300, margin: '0 0 0.75rem' }}>
                {tab.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem', fontSize: '0.9rem' }}>
                {tab.description}
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: 'var(--accent)',
                fontStyle: 'italic',
                padding: '0.75rem 1rem',
                borderLeft: '2px solid var(--accent)',
              }}>
                {tab.highlight}
              </p>
            </div>

            {/* Timeline */}
            <div style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', minWidth: 'max-content', gap: 0 }}>
                {brandStoryConfig.timeline.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center', padding: '0 1rem' }}>
                      <div style={{
                        width: '10px', height: '10px', borderRadius: '50%',
                        backgroundColor: 'var(--accent)',
                        margin: '0 auto 0.5rem',
                      }} />
                      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)', margin: '0 0 0.25rem' }}>{item.year}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, maxWidth: '80px', textAlign: 'center' }}>{item.event}</p>
                    </div>
                    {i < brandStoryConfig.timeline.length - 1 && (
                      <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--border-subtle)' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Founder Quote */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginTop: '2rem', padding: '1.5rem', backgroundColor: 'var(--surface-1)', borderRadius: 'var(--border-radius)' }}>
              {brandStoryConfig.quote.photo && (
                <img
                  src={brandStoryConfig.quote.photo}
                  alt={brandStoryConfig.quote.author}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
              )}
              <div>
                <p style={{ fontSize: '0.875rem', fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 0.5rem' }}>
                  "{brandStoryConfig.quote.text}"
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  — {brandStoryConfig.quote.author}, <em>{brandStoryConfig.quote.role}</em>
                </p>
              </div>
            </div>
          </div>

          {/* ─── Right: Image ──────────────────────────────── */}
          <div style={{
            position: 'relative',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(30px)',
            transition: 'opacity 0.7s ease-out 0.2s, transform 0.7s ease-out 0.2s',
          }}>
            {/* Main image */}
            <div style={{ borderRadius: 'var(--border-radius)', overflow: 'hidden', aspectRatio: '4/5' }}>
              <img
                src={tab.image}
                alt={tab.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: imgVisible ? 1 : 0,
                  transform: imgVisible ? 'scale(1)' : 'scale(1.03)',
                  transition: 'opacity 0.4s ease, transform 0.4s ease',
                }}
              />
            </div>

            {/* Year badge */}
            <div style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              textAlign: 'center',
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--accent)',
              color: '#fff',
              borderRadius: 'var(--border-radius)',
            }}>
              <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', fontWeight: 300, margin: 0, lineHeight: 1 }}>
                {brandStoryConfig.imageBadge.year}
              </p>
              <p style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0.25rem 0 0', opacity: 0.8 }}>
                {brandStoryConfig.imageBadge.label}
              </p>
            </div>

            {/* Availability overlay at bottom */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '1.25rem',
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              borderRadius: '0 0 var(--border-radius) var(--border-radius)',
            }}>
              <div>
                <p style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', margin: '0 0 0.25rem' }}>
                  Available
                </p>
                <p style={{ fontSize: '0.875rem', color: '#fff', margin: 0 }}>{brandStoryConfig.availability}</p>
              </div>
              <a href={brandStoryConfig.availabilityCtaHref} className="btn-primary" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}>
                {brandStoryConfig.availabilityCta}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 900px) {
          #story .container-custom > div {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>
    </section>
  );
}
