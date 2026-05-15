import { useEffect, useRef, useState } from 'react';

interface Testimonial {
  name: string;
  role: string;
  rating: number;
  body: string;
  image?: string;
  url?: string;
}

interface Props {
  testimonials: Testimonial[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      aria-label={`${rating} out of 5 stars`}
      style={{ display: 'flex', gap: '3px', marginBottom: '0.75rem' }}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={star <= rating ? 'hsl(38 80% 55%)' : 'none'}
          stroke={star <= rating ? 'hsl(38 80% 55%)' : 'hsl(210 20% 40%)'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsCarousel({ testimonials }: Props) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const pausedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = testimonials.length;

  const goTo = (index: number, dir: 'next' | 'prev' = 'next') => {
    if (isAnimating) return;
    setDirection(dir);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setIsAnimating(false);
    }, 300);
  };

  const next = () => goTo((current + 1) % total, 'next');
  const prev = () => goTo((current - 1 + total) % total, 'prev');

  const startAutoplay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!pausedRef.current) {
        setCurrent((c) => (c + 1) % total);
      }
    }, 5000);
  };

  useEffect(() => {
    startAutoplay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [total]);

  if (!testimonials || total === 0) return null;

  const t = testimonials[current];

  const slideStyle: React.CSSProperties = {
    opacity: isAnimating ? 0 : 1,
    transform: isAnimating
      ? `translateX(${direction === 'next' ? '-20px' : '20px'})`
      : 'translateX(0)',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
  };

  return (
    <section
      role="region"
      aria-label="Client testimonials"
      aria-roledescription="carousel"
      style={{ width: '100%', maxWidth: '720px', margin: '0 auto', padding: '2rem 0' }}
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      {/* Testimonial card */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          background: 'var(--glass-bg, hsl(220 40% 8% / 0.6))',
          border: '1px solid var(--glass-border, hsl(38 80% 55% / 0.15))',
          borderRadius: '12px',
          padding: '2.5rem',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          minHeight: '200px',
          position: 'relative',
        }}
      >
        <div style={slideStyle}>
          <StarRating rating={t.rating} />
          <blockquote
            style={{
              margin: 0,
              fontSize: '1.05rem',
              lineHeight: 1.7,
              color: 'var(--text-cream, hsl(40 30% 92%))',
              fontStyle: 'italic',
              marginBottom: '1.5rem',
            }}
          >
            &ldquo;{t.body}&rdquo;
          </blockquote>
          <footer style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {t.image ? (
              <img src={t.image} alt={t.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid hsl(38 80% 55% / 0.4)', flexShrink: 0 }} />
            ) : (
              <div
                style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'hsl(38 80% 55% / 0.15)',
                  border: '1.5px solid hsl(38 80% 55% / 0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', fontWeight: 700,
                  color: 'var(--brand-500, hsl(38 80% 55%))', flexShrink: 0,
                }}
                aria-hidden="true"
              >
                {t.name.charAt(0)}
              </div>
            )}
            <div>
              <cite
                style={{
                  fontStyle: 'normal', fontWeight: 600,
                  color: 'var(--text-cream, hsl(40 30% 92%))',
                  display: 'block', fontSize: '0.9rem',
                }}
              >
                {t.url ? <a href={t.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{t.name}</a> : t.name}
              </cite>
              <span style={{ fontSize: '0.8rem', color: 'hsl(210 20% 55%)' }}>{t.role}</span>
            </div>
          </footer>
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '1.5rem',
        }}
      >
        <button
          aria-label="Previous testimonial"
          onClick={prev}
          style={{
            background: 'none',
            border: '1px solid hsl(38 80% 55% / 0.3)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            color: 'hsl(38 80% 55%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            transition: 'border-color 0.2s, background 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'hsl(38 80% 55% / 0.1)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'hsl(38 80% 55% / 0.7)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'none';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'hsl(38 80% 55% / 0.3)';
          }}
        >
          &#8592;
        </button>

        {/* Dot indicators */}
        <div role="tablist" aria-label="Testimonial navigation" style={{ display: 'flex', gap: '8px' }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => goTo(i, i > current ? 'next' : 'prev')}
              style={{
                width: i === current ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                background:
                  i === current
                    ? 'var(--brand-500, hsl(38 80% 55%))'
                    : 'hsl(210 20% 30%)',
                transition: 'width 0.3s ease, background 0.3s ease',
              }}
            />
          ))}
        </div>

        <button
          aria-label="Next testimonial"
          onClick={next}
          style={{
            background: 'none',
            border: '1px solid hsl(38 80% 55% / 0.3)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            color: 'hsl(38 80% 55%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            transition: 'border-color 0.2s, background 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'hsl(38 80% 55% / 0.1)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'hsl(38 80% 55% / 0.7)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'none';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'hsl(38 80% 55% / 0.3)';
          }}
        >
          &#8594;
        </button>
      </div>

      {/* Progress indicator */}
      <p
        aria-live="polite"
        aria-atomic="true"
        style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'hsl(210 20% 45%)',
          marginTop: '0.75rem',
        }}
      >
        {current + 1} / {total}
      </p>
    </section>
  );
}
