// ============================================================
// NAVIGATION — Sticky top nav for Leverage AI
//   - Desktop: logo + nav links (with dropdowns) + CTA button
//   - Mobile: hamburger + full-width accordion menu
//   - Scroll behavior: glass-strong effect after 40px
//   - Dropdown: 3s linger delay so sub-items are easy to click
//
// Config: navigationConfig from lib/site-config
// Links: plain <a href> — no react-router-dom
// ============================================================
import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { navigationConfig } from '../lib/site-config';

export default function Navigation() {
  const [scrolled,      setScrolled]      = useState(false);
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [openDropdown,  setOpenDropdown]  = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // Holds the pending close timer so we can cancel it when re-entering
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setOpenDropdown(null);
      closeTimerRef.current = null;
    }, 3000); // 3-second linger — plenty of time to click any item
  };

  const openMenu = (label: string) => {
    cancelClose();
    setOpenDropdown(label);
  };

  // Cleanup on unmount
  useEffect(() => () => cancelClose(), []);

  // Glass effect after 40px scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeAll = () => {
    setMobileOpen(false);
    setOpenAccordion(null);
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease',
        backgroundColor: scrolled ? 'rgba(12, 12, 12, 0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px) saturate(1.4)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(1.4)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
      }}
    >
      <nav
        style={{
          maxWidth: 'var(--container-max, 1280px)',
          margin: '0 auto',
          padding: '0 2rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '4.75rem',
          }}
        >

          {/* ─── Logo ─────────────────────────────────────────── */}
          <a
            href="/"
            style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '2px' }}
          >
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.45rem',
                fontWeight: 400,
                letterSpacing: '0.06em',
                color: 'var(--text-primary, #f5f0e8)',
                lineHeight: 1,
              }}
            >
              {navigationConfig.brandName}
              <span style={{ color: 'var(--accent, #c9a96e)' }}> {navigationConfig.brandSubname}</span>
            </span>
            {navigationConfig.tagline && (
              <span
                style={{
                  fontSize: '0.6rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted, #6b7280)',
                }}
              >
                {navigationConfig.tagline}
              </span>
            )}
          </a>

          {/* ─── Desktop Nav Links ────────────────────────────── */}
          <ul
            className="desktop-nav"
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '2rem',
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            {navigationConfig.navLinks.map((link) => (
              <li key={link.label} style={{ position: 'relative' }}>
                {link.children ? (
                  <div
                    onMouseEnter={() => openMenu(link.label)}
                    onMouseLeave={scheduleClose}
                    style={{ position: 'relative' }}
                  >
                    <button
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.8rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--text-secondary, #9ca3af)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'color 0.2s',
                        fontFamily: 'inherit',
                      }}
                    >
                      {link.label}
                      <ChevronDown
                        size={12}
                        style={{
                          transition: 'transform 0.2s',
                          transform: openDropdown === link.label ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                      />
                    </button>

                    {/* Dropdown panel — stays open 3s after mouse leaves */}
                    {openDropdown === link.label && (
                      <div
                        onMouseEnter={cancelClose}
                        onMouseLeave={scheduleClose}
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 0.75rem)',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          minWidth: '210px',
                          backgroundColor: 'rgba(14, 14, 14, 0.97)',
                          backdropFilter: 'blur(16px)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--border-radius, 4px)',
                          padding: '0.5rem 0',
                          boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                          animation: 'navFadeDown 0.15s ease',
                        }}
                      >
                        {link.children.map((child) => (
                          <a
                            key={child.label}
                            href={child.href}
                            onClick={() => { cancelClose(); setOpenDropdown(null); }}
                            style={{
                              display: 'block',
                              padding: '0.65rem 1.25rem',
                              fontSize: '0.8rem',
                              letterSpacing: '0.04em',
                              color: 'var(--text-secondary, #9ca3af)',
                              textDecoration: 'none',
                              transition: 'color 0.2s, background-color 0.2s',
                              whiteSpace: 'nowrap',
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary, #f5f0e8)';
                              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255,255,255,0.04)';
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary, #9ca3af)';
                              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
                            }}
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href={link.href}
                    style={{
                      fontSize: '0.8rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--text-secondary, #9ca3af)',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary, #f5f0e8)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary, #9ca3af)';
                    }}
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          {/* ─── Desktop CTA ──────────────────────────────────── */}
          <a
            href="/contact"
            className="btn-primary desktop-cta"
            style={{
              display: 'none',
              padding: '0.6rem 1.4rem',
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
            }}
          >
            Get Started
          </a>

          {/* ─── Mobile Hamburger ─────────────────────────────── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-menu-btn"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary, #f5f0e8)',
              padding: '4px',
              lineHeight: 0,
            }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* ─── Mobile Menu Panel ──────────────────────────────── */}
      {mobileOpen && (
        <div
          style={{
            backgroundColor: 'var(--page-bg, #0c0c0c)',
            borderTop: '1px solid var(--border-subtle)',
            padding: '0.5rem 2rem 2rem',
            maxHeight: 'calc(100vh - 4.75rem)',
            overflowY: 'auto',
          }}
        >
          {navigationConfig.navLinks.map((link) => (
            <div key={link.label}>
              {link.children ? (
                <>
                  <button
                    onClick={() =>
                      setOpenAccordion(openAccordion === link.label ? null : link.label)
                    }
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '1rem 0',
                      fontSize: '0.875rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--text-secondary, #9ca3af)',
                      background: 'none',
                      border: 'none',
                      borderBottom: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                    }}
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      style={{
                        transition: 'transform 0.2s',
                        transform: openAccordion === link.label ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    />
                  </button>
                  {openAccordion === link.label && (
                    <div style={{ paddingBottom: '0.5rem' }}>
                      {link.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          onClick={closeAll}
                          style={{
                            display: 'block',
                            padding: '0.6rem 0 0.6rem 1rem',
                            fontSize: '0.8125rem',
                            color: 'var(--text-muted, #6b7280)',
                            textDecoration: 'none',
                            transition: 'color 0.2s',
                          }}
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <a
                  href={link.href}
                  onClick={closeAll}
                  style={{
                    display: 'block',
                    padding: '1rem 0',
                    fontSize: '0.875rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--text-secondary, #9ca3af)',
                    textDecoration: 'none',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  {link.label}
                </a>
              )}
            </div>
          ))}

          <a
            href="/contact"
            onClick={closeAll}
            className="btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              marginTop: '1.75rem',
              boxSizing: 'border-box',
            }}
          >
            Get Started
          </a>
        </div>
      )}

      {/* ─── Responsive visibility + animations ────────────── */}
      <style>{`
        @keyframes navFadeDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0);    }
        }
        @media (min-width: 1024px) {
          .desktop-nav     { display: flex !important; }
          .desktop-cta     { display: inline-flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 1023px) {
          .desktop-nav     { display: none !important; }
          .desktop-cta     { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
}
