// ============================================================
// FOOTER — Full-width footer with:
//   - Brand column (logo, description, social links)
//   - Two link groups from footerConfig.linkGroups
//   - Connect section with social links (LinkedIn, Twitter/X, Instagram)
//   - Newsletter signup form
//   - Legal links + copyright
//   - No react-router-dom — plain <a href> tags throughout
//
// Config: footerConfig in site-config.ts
// ============================================================
'use client';

import { useState } from 'react';
import { Linkedin, Twitter, Instagram } from 'lucide-react';
import { footerConfig } from '../lib/site-config';

const socialIconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  Linkedin,
  Twitter,
  Instagram,
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setNewsletterStatus('success');
      setEmail('');
    } else {
      setNewsletterStatus('error');
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer
      style={{
        backgroundColor: 'var(--surface-1)',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      {/* Main Footer Grid */}
      <div
        className="container-custom"
        style={{ paddingTop: '4rem', paddingBottom: '3rem' }}
      >
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr repeat(2, 1fr) 1.5fr',
            gap: '3rem',
            alignItems: 'start',
          }}
        >

          {/* Brand Column */}
          <div>
            <a
              href="/"
              style={{
                display: 'inline-block',
                marginBottom: '1rem',
                textDecoration: 'none',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.5rem',
                  fontWeight: 300,
                  letterSpacing: '0.05em',
                  color: 'var(--text-primary)',
                }}
              >
                {footerConfig.brandName}
                <span style={{ color: 'var(--accent)' }}> {footerConfig.brandSubname}</span>
              </span>
            </a>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
                lineHeight: 1.7,
                marginBottom: '1.5rem',
              }}
            >
              {footerConfig.description}
            </p>

            {/* Social Links */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {footerConfig.socialLinks.map((link) => {
                const Icon = socialIconMap[link.icon];
                return (
                  <a
                    key={link.platform}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.platform}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '2.25rem',
                      height: '2.25rem',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '50%',
                      color: 'var(--text-muted)',
                      transition: 'border-color 0.2s, color 0.2s',
                      textDecoration: 'none',
                    }}
                  >
                    {Icon ? <Icon size={15} /> : link.platform[0]}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link Groups */}
          {footerConfig.linkGroups.map((group) => (
            <div key={group.title}>
              <h4
                style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: '1rem',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                }}
              >
                {group.title}
              </h4>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                }}
              >
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-muted)',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h4
              style={{
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: '0.5rem',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
              }}
            >
              {footerConfig.newsletter.label}
            </h4>

            {newsletterStatus === 'success' ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--accent)' }}>
                {footerConfig.newsletter.successMessage}
              </p>
            ) : (
              <form
                onSubmit={handleNewsletter}
                style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={footerConfig.newsletter.placeholder}
                  style={{
                    padding: '0.65rem 0.875rem',
                    backgroundColor: 'var(--surface-2)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem',
                    borderRadius: 'var(--border-radius)',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '0.65rem 1rem', fontSize: '0.8rem' }}
                >
                  {footerConfig.newsletter.buttonText}
                </button>
                {newsletterStatus === 'error' && (
                  <p style={{ fontSize: '0.75rem', color: '#ef4444', margin: 0 }}>
                    {footerConfig.newsletter.errorMessage}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />

      {/* Legal Bar */}
      <div
        className="container-custom"
        style={{ paddingTop: '1.25rem', paddingBottom: '1.25rem' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
            {footerConfig.copyrightText}
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {footerConfig.legalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <button
            onClick={scrollToTop}
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              background: 'none',
              border: '1px solid var(--border-subtle)',
              padding: '0.4rem 0.75rem',
              cursor: 'pointer',
              borderRadius: 'var(--border-radius)',
              transition: 'border-color 0.2s, color 0.2s',
            }}
          >
            Back to Top ↑
          </button>
        </div>

        {footerConfig.creditText && (
          <p
            style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              marginTop: '0.75rem',
              opacity: 0.5,
            }}
          >
            {footerConfig.creditText}
          </p>
        )}
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 767px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
