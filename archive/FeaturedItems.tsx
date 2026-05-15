// ============================================================
// FEATURED ITEMS SHOWCASE
//
// Tab-driven showcase of 3 featured items/products/services.
// Layout: [Left: info + CTA] [Center: image + glow] [Right: features + quote]
//
// Features:
//   - Tab switching between items (active state)
//   - Animated image transitions (scale + opacity)
//   - Per-item configurable glow color behind image
//   - Scroll-triggered fade-in via IntersectionObserver
//   - Founder/expert quote panel
//
// Config: featuredItemsConfig in site-config.ts
// ============================================================
import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Star, Leaf, Shield, Award } from 'lucide-react';
import { featuredItemsConfig } from '../lib/site-config';

const iconMap: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  Star, Leaf, Shield, Award,
};

export default function FeaturedItems() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [imgVisible, setImgVisible] = useState(true);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const switchItem = (idx: number) => {
    if (idx === activeIdx) return;
    setImgVisible(false);
    setTimeout(() => { setActiveIdx(idx); setImgVisible(true); }, 300);
  };

  const active = featuredItemsConfig.items[activeIdx];

  return (
    <section
      ref={sectionRef}
      id="featured"
      className="section-padding"
      style={{ backgroundColor: 'var(--page-bg)' }}
    >
      <div className="container-custom">

        {/* ─── Section Header ───────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>{featuredItemsConfig.eyebrow}</p>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 300,
            margin: '0 0 1rem',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
          }}>
            {featuredItemsConfig.headline}
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto' }}>
            {featuredItemsConfig.subheadline}
          </p>
        </div>

        {/* ─── Tab Selectors ────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          {featuredItemsConfig.items.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => switchItem(idx)}
              style={{
                padding: '0.5rem 1.25rem',
                fontSize: '0.8rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: idx === activeIdx ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                backgroundColor: idx === activeIdx ? 'var(--accent)' : 'transparent',
                color: idx === activeIdx ? '#fff' : 'var(--text-muted)',
                borderRadius: 'var(--border-radius)',
              }}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* ─── Main 3-Column Layout ─────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1fr', gap: '3rem', alignItems: 'center' }}>

          {/* Left: Item Info */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(-30px)',
            transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
          }}>
            {active.badge && (
              <span style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                backgroundColor: 'var(--accent)',
                color: '#fff',
                borderRadius: 'var(--border-radius)',
                marginBottom: '1rem',
              }}>
                {active.badge}
              </span>
            )}
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 300, margin: '0 0 0.5rem' }}>
              {active.name}
            </h3>
            <p style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1rem' }}>
              {active.tagline}
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              {active.description}
            </p>
            {active.price && (
              <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', color: 'var(--accent)', marginBottom: '1.5rem' }}>
                {active.price}
              </p>
            )}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a href={active.ctaHref} className="btn-primary" style={{ fontSize: '0.8rem' }}>
                {active.ctaLabel} <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* Center: Product Image */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '420px' }}>
            {/* Glow background */}
            <div
              className={active.glowColor}
              style={{
                position: 'absolute',
                inset: '10%',
                borderRadius: '50%',
                filter: 'blur(60px)',
                transition: 'opacity 0.4s ease',
              }}
            />
            {/* Image */}
            <img
              src={active.image}
              alt={active.name}
              style={{
                position: 'relative',
                zIndex: 1,
                maxHeight: '400px',
                maxWidth: '100%',
                objectFit: 'contain',
                opacity: imgVisible ? 1 : 0,
                transform: imgVisible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
                transition: 'opacity 0.4s ease, transform 0.4s ease',
              }}
            />
          </div>

          {/* Right: Features + Quote */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(30px)',
            transition: 'opacity 0.7s ease-out 0.1s, transform 0.7s ease-out 0.1s',
          }}>
            {/* Features list */}
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Key Features
              </p>
              {active.features.map((feature, i) => {
                const Icon = iconMap[feature.icon] || Star;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <Icon size={16} color="var(--accent)" />
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{feature.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Quote */}
            <div style={{
              padding: '1.25rem',
              borderLeft: '2px solid var(--accent)',
              backgroundColor: 'var(--surface-1)',
              borderRadius: '0 var(--border-radius) var(--border-radius) 0',
            }}>
              <p style={{ fontSize: '0.875rem', fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 0.75rem' }}>
                "{featuredItemsConfig.quote.text}"
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                — {featuredItemsConfig.quote.author}, <em>{featuredItemsConfig.quote.role}</em>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 900px) {
          #featured .container-custom > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
