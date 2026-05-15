'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { heroConfig } from '../lib/site-config';

const VIDEO_SRC = '/images/City_Skyline_Searchlight_Video_Generation.mp4';

export default function HeroSection() {
  const [videoReady, setVideoReady]     = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startLoad = () => {
      setVideoLoading(true);
      const vid = videoRef.current;
      if (!vid) return;
      vid.src = VIDEO_SRC;
      vid.load();
    };

    if (document.readyState === 'complete') {
      const t = setTimeout(startLoad, 300);
      return () => clearTimeout(t);
    } else {
      window.addEventListener('load', startLoad, { once: true });
      return () => window.removeEventListener('load', startLoad);
    }
  }, []);

  const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

  return (
    <section
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: '700px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${heroConfig.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: videoReady ? 0 : 1,
          transition: 'opacity 1.2s ease',
        }}
      />

      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        onCanPlayThrough={() => {
          videoRef.current?.play().catch(() => {});
          setVideoReady(true);
        }}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          opacity: videoReady ? 1 : 0,
          transition: 'opacity 1.2s ease',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.18) 100%)',
          zIndex: 1,
        }}
      />

      <div
        className="grain"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <div
        className="container-custom"
        style={{
          position: 'relative',
          zIndex: 10,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: '5rem',
        }}
      >
        <div style={{ maxWidth: '680px' }}>

          <motion.p
            className="eyebrow-lg has-bar"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
            style={{ marginBottom: '1.5rem' }}
          >
            {heroConfig.eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.35 }}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.8rem, 6vw, 5rem)',
              fontWeight: 300,
              lineHeight: 1.1,
              color: 'var(--text-primary)',
              margin: '0 0 0.5rem',
            }}
          >
            {heroConfig.headline}
          </motion.h1>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.5 }}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.8rem, 6vw, 5rem)',
              fontWeight: 300,
              lineHeight: 1.1,
              margin: '0 0 1.75rem',
            }}
          >
            <span style={{ color: 'var(--accent)' }}>{heroConfig.headlineAccent}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.7 }}
            style={{
              fontSize: '1.125rem',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              margin: '0 0 2.5rem',
              maxWidth: '520px',
            }}
          >
            {heroConfig.subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.85 }}
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
          >
            <a href={heroConfig.ctaButtonHref} className="btn-primary">
              {heroConfig.ctaButtonText}
              <ArrowRight size={16} />
            </a>
            <a href={heroConfig.ctaSecondaryHref} className="btn-secondary">
              {heroConfig.ctaSecondaryText}
            </a>
          </motion.div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(to bottom, transparent 0%, var(--page-bg) 100%)',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      />
    </section>
  );
}
