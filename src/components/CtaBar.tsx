import { useEffect, useState } from 'react';

interface Props {
  threshold?: number; // px to scroll before showing
  text?: string;
  href?: string;
  ctaText?: string;
}

export default function CtaBar({
  threshold = 800,
  text = 'Ready to dominate AI search?',
  href = '/contact',
  ctaText = 'Get Started',
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > threshold);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return (
    <div
      role="complementary"
      aria-label="Call to action"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        background: 'hsl(220 40% 6% / 0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid hsl(38 80% 55% / 0.2)',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
      }}
    >
      <span style={{ color: 'hsl(210 20% 85%)', fontSize: '0.95rem' }}>{text}</span>
      <a
        href={href}
        style={{
          background: 'hsl(38 80% 55%)',
          color: '#0d1119',
          padding: '0.5rem 1.5rem',
          borderRadius: '4px',
          fontWeight: 700,
          fontSize: '0.875rem',
          textDecoration: 'none',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        {ctaText}
      </a>
    </div>
  );
}
