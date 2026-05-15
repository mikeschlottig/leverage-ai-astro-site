import { useEffect, useRef, useState } from 'react';

interface Props {
  articleId: string; // ID of the article/content element to track
}

export default function ReadingProgress({ articleId }: Props) {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);
  const [showPercent, setShowPercent] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const updateProgress = () => {
      const article = document.getElementById(articleId);
      if (!article) return;

      const rect = article.getBoundingClientRect();
      const articleTop = article.offsetTop;
      const articleHeight = article.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Active when user has scrolled into article content
      const isActive = scrollY + viewportHeight > articleTop && scrollY < articleTop + articleHeight;
      setActive(isActive);

      if (!isActive) {
        // Before article: 0%; after article: 100%
        if (scrollY >= articleTop + articleHeight) {
          setProgress(100);
        } else {
          setProgress(0);
        }
        return;
      }

      // How far through the article are we?
      const scrolled = scrollY - articleTop;
      const scrollable = articleHeight - viewportHeight;
      const pct = scrollable > 0 ? (scrolled / scrollable) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    };

    const onScroll = () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateProgress(); // initial call

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [articleId]);

  // Don't render at all if progress is 0 and not active
  const opacity = active ? 1 : progress === 100 ? 0.4 : 0;

  return (
    <>
      {/* Progress bar */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '3px',
          width: `${progress}%`,
          background: 'var(--brand-500, hsl(38 80% 55%))',
          zIndex: 9999,
          transition: 'width 0.1s linear, opacity 0.3s ease',
          opacity,
          boxShadow: active ? '0 0 8px hsl(38 80% 55% / 0.6)' : 'none',
        }}
      />

      {/* Percentage indicator — appears on hover */}
      <div
        aria-label={`Reading progress: ${Math.round(progress)}%`}
        onMouseEnter={() => setShowPercent(true)}
        onMouseLeave={() => setShowPercent(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '12px',
          width: '100%',
          zIndex: 10000,
          cursor: 'default',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '8px',
            left: `clamp(8px, ${progress}%, calc(100% - 40px))`,
            transform: 'translateX(-50%)',
            background: 'hsl(220 40% 10%)',
            border: '1px solid hsl(38 80% 55% / 0.4)',
            borderRadius: '4px',
            padding: '2px 6px',
            fontSize: '10px',
            fontWeight: 600,
            color: 'hsl(38 80% 55%)',
            whiteSpace: 'nowrap',
            opacity: showPercent && active ? 1 : 0,
            transition: 'opacity 0.15s ease',
            pointerEvents: 'none',
            letterSpacing: '0.04em',
            fontFamily: 'var(--font-mono, monospace)',
          }}
        >
          {Math.round(progress)}%
        </span>
      </div>
    </>
  );
}
