// ============================================================
// CASE STUDY / METRICS SECTION — Data-driven results with:
//   - 4-metric grid (glass cards)
//   - Featured case study card (glass, rounded-2xl)
//   - glow-radial background accent
//   - AnimatedSection scroll-reveal wrappers
//   - Grain texture
//
// Config: metricsConfig in site-config.ts
// ============================================================
'use client';

import { ArrowRight } from 'lucide-react';
import { metricsConfig } from '../lib/site-config';
import AnimatedSection from './AnimatedSection';

export default function CaseStudySection() {
  const { eyebrow, headline, metrics, featuredCaseStudy } = metricsConfig;

  return (
    <section
      id="results"
      className="section-padding grain"
      style={{
        position: 'relative',
        backgroundColor: 'var(--surface-1)',
        overflow: 'hidden',
      }}
    >
      {/* Radial glow background */}
      <div
        className="glow-radial"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(var(--accent-rgb, 184,134,74),0.06) 0%, transparent 65%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <AnimatedSection style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>
            {eyebrow}
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              fontWeight: 300,
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            {headline}
          </h2>
        </AnimatedSection>

        {/* Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            marginBottom: '3rem',
          }}
        >
          {metrics.map((metric, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div
                className="glass"
                style={{
                  padding: '2rem 1.5rem',
                  borderRadius: 'var(--border-radius)',
                  border: '1px solid var(--border-subtle)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(2.2rem, 4vw, 3rem)',
                    fontWeight: 300,
                    color: 'var(--accent)',
                    lineHeight: 1,
                    marginBottom: '0.6rem',
                  }}
                >
                  {metric.value}
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    lineHeight: 1.4,
                  }}
                >
                  {metric.label}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Featured Case Study Card */}
        <AnimatedSection delay={0.3}>
          <div
            className="glass"
            style={{
              borderRadius: '1rem',
              border: '1px solid var(--border-subtle)',
              padding: '2.5rem',
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            <div>
              {/* Eyebrow */}
              <p
                style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                  margin: '0 0 0.75rem',
                  fontWeight: 600,
                }}
              >
                {featuredCaseStudy.eyebrow}
              </p>

              {/* Title */}
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
                  fontWeight: 300,
                  color: 'var(--text-primary)',
                  margin: '0 0 1rem',
                  lineHeight: 1.3,
                }}
              >
                {featuredCaseStudy.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.65,
                  margin: '0 0 1.5rem',
                  maxWidth: '640px',
                }}
              >
                {featuredCaseStudy.description}
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {featuredCaseStudy.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: '0.3rem 0.75rem',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '999px',
                      fontSize: '0.7rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Arrow */}
            <a
              href={featuredCaseStudy.href}
              aria-label="Read case study"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '50%',
                border: '1px solid var(--accent)',
                color: 'var(--accent)',
                flexShrink: 0,
                transition: 'background-color 0.2s, color 0.2s',
                textDecoration: 'none',
              }}
            >
              <ArrowRight size={20} />
            </a>
          </div>
        </AnimatedSection>
      </div>

      <style>{`
        @media (max-width: 767px) {
          #results .glass:last-of-type {
            grid-template-columns: 1fr !important;
          }
          #results .glass:last-of-type > a {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
