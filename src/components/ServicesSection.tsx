// ============================================================
// SERVICES SECTION — Grid of 4 service cards with:
//   - AnimatedSection scroll-reveal wrapper
//   - Glass + premium-hover cards
//   - Lucide icons (Search, Palette, BarChart3, Globe)
//   - Detail list per service
//   - glow-gold background accent div
//   - Grain texture overlay
//
// Config: servicesConfig in site-config.ts
// ============================================================
'use client';

import { Search, Palette, BarChart3, Globe } from 'lucide-react';
import { servicesConfig } from '../lib/site-config';
import AnimatedSection from './AnimatedSection';

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Search,
  Palette,
  BarChart3,
  Globe,
};

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="section-padding grain"
      style={{ position: 'relative', backgroundColor: 'var(--surface-1)', overflow: 'hidden' }}
    >
      {/* Gold glow background accent */}
      <div
        className="glow-gold"
        style={{
          position: 'absolute',
          top: '20%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(var(--accent-rgb, 184,134,74),0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <AnimatedSection style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>
            {servicesConfig.eyebrow}
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              fontWeight: 300,
              color: 'var(--text-primary)',
              margin: '0 0 1rem',
            }}
          >
            {servicesConfig.headline}
          </h2>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              maxWidth: '540px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {servicesConfig.subheadline}
          </p>
        </AnimatedSection>

        {/* Services Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {servicesConfig.services.map((service, i) => {
            const Icon = iconMap[service.icon];
            return (
              <AnimatedSection key={service.id} delay={i * 0.1}>
                <div
                  className="glass premium-hover"
                  style={{
                    padding: '2rem',
                    borderRadius: 'var(--border-radius)',
                    border: '1px solid var(--border-subtle)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '50%',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--surface-2)',
                      flexShrink: 0,
                    }}
                  >
                    {Icon && <Icon size={20} color="var(--accent)" />}
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.35rem',
                      fontWeight: 300,
                      color: 'var(--text-primary)',
                      margin: 0,
                    }}
                  >
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {service.description}
                  </p>

                  {/* Details list */}
                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: '0.5rem 0 0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    {service.details.map((detail, j) => (
                      <li
                        key={j}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.6rem',
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.5,
                        }}
                      >
                        <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }}>
                          ›
                        </span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          #services .container-custom > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
