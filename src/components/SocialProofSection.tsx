// ============================================================
// SOCIAL PROOF SECTION — Accolades + pull quote with:
//   - Three accolade cards (glass, premium-hover)
//   - Award, Star, TrendingUp icons from lucide-react
//   - Centered pull quote
//   - AnimatedSection scroll-reveal wrappers
//   - Grain texture background
//
// Config: socialProofConfig in site-config.ts
// ============================================================
'use client';

import { Award, Star, TrendingUp } from 'lucide-react';
import { socialProofConfig } from '../lib/site-config';
import AnimatedSection from './AnimatedSection';
import TestimonialsCarousel from './TestimonialsCarousel';

export interface TestimonialData {
  name:   string;
  role:   string;
  rating: number;
  body:   string;
  image?: string;
  url?:   string;
}

interface Props {
  testimonials?: TestimonialData[];
}

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Award,
  Star,
  TrendingUp,
};

export default function SocialProofSection({ testimonials = [] }: Props) {
  return (
    <section
      id="recognition"
      className="section-padding grain"
      style={{
        position: 'relative',
        backgroundColor: 'var(--page-bg)',
        overflow: 'hidden',
      }}
    >
      <div className="container-custom">

        {/* Header */}
        <AnimatedSection style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>
            {socialProofConfig.eyebrow}
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 300,
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            {socialProofConfig.headline}
          </h2>
        </AnimatedSection>

        {/* Accolade Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            marginBottom: '4rem',
          }}
        >
          {socialProofConfig.accolades.map((accolade, i) => {
            const Icon = iconMap[accolade.icon];
            return (
              <AnimatedSection key={i} delay={i * 0.12}>
                <div
                  className="glass premium-hover"
                  style={{
                    padding: '2rem',
                    borderRadius: 'var(--border-radius)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '1rem',
                  }}
                >
                  {/* Icon circle */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '3.5rem',
                      height: '3.5rem',
                      borderRadius: '50%',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--surface-2)',
                    }}
                  >
                    {Icon && <Icon size={22} color="var(--accent)" />}
                  </div>

                  {/* Label */}
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.1rem',
                      fontWeight: 300,
                      color: 'var(--text-primary)',
                      margin: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    {accolade.label}
                  </h3>

                  {/* Detail */}
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-muted)',
                      margin: 0,
                      lineHeight: 1.55,
                    }}
                  >
                    {accolade.detail}
                  </p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        {/* Pull Quote */}
        <AnimatedSection delay={0.2}>
          <div
            style={{
              textAlign: 'center',
              maxWidth: '700px',
              margin: '0 auto',
              padding: '2.5rem',
              borderTop: '1px solid var(--border-subtle)',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '4rem',
                color: 'var(--accent)',
                opacity: 0.35,
                lineHeight: 0.5,
                display: 'block',
                marginBottom: '0.75rem',
              }}
            >
              "
            </span>
            <p
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                color: 'var(--text-primary)',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {socialProofConfig.pullQuote.replace(/^"|"$/g, '')}
            </p>
          </div>
        </AnimatedSection>

        {/* Testimonials Carousel — only rendered when testimonials are passed */}
        {testimonials.length > 0 && (
          <AnimatedSection delay={0.3} style={{ marginTop: '4rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>
                {socialProofConfig.testimonialsEyebrow}
              </p>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                fontWeight: 300,
                color: 'var(--text-primary)',
                margin: 0,
              }}>
                {socialProofConfig.testimonialsHeadline}
              </h2>
            </div>
            <TestimonialsCarousel testimonials={testimonials} />
          </AnimatedSection>
        )}
      </div>

      <style>{`
        @media (max-width: 767px) {
          #recognition .container-custom > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
