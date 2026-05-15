// ============================================================
// CONTACT FORM — Full contact section for Leverage AI
//   - Two-column layout: left = form, right = contact info
//   - Fields: name, email, company, service (select), message
//   - Status states: idle | loading | success | error
//   - POSTs JSON to contactConfig.formEndpoint
//   - Contact info cards from contactConfig.contactItems
//   - Directory links at bottom right
//
// Config: contactConfig from lib/site-config
// ============================================================
import { useState } from 'react';
import { Mail, MapPin, Phone, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { contactConfig } from '../lib/site-config';

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string; style?: React.CSSProperties }>> = {
  Mail,
  MapPin,
  Phone,
  Clock,
};

type Status = 'idle' | 'loading' | 'success' | 'error';

interface FormValues {
  name:    string;
  email:   string;
  company: string;
  service: string;
  message: string;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.875rem 1rem',
  backgroundColor: 'var(--surface-1)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-primary, #f5f0e8)',
  fontSize: '0.9rem',
  outline: 'none',
  borderRadius: 'var(--border-radius, 4px)',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.7rem',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'var(--text-muted, #6b7280)',
  marginBottom: '0.4rem',
  fontWeight: 500,
};

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [form,   setForm]   = useState<FormValues>({
    name: '', email: '', company: '', service: '', message: '',
  });

  const update = (field: keyof FormValues, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // Resolve Formspree endpoint: prefer PUBLIC_FORMSPREE_ID env var, fall back to config
  const formEndpoint = (() => {
    const envId = (typeof import.meta !== 'undefined' && (import.meta as Record<string, unknown>).env)
      ? ((import.meta as { env: Record<string, string> }).env.PUBLIC_FORMSPREE_ID ?? '')
      : '';
    return envId
      ? `https://formspree.io/f/${envId}`
      : contactConfig.formEndpoint;
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(formEndpoint, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify(form),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section
      id="contact"
      className="section-padding grain"
      style={{ backgroundColor: 'var(--surface-1)' }}
    >
      <div className="container-custom">
        <div className="contact-grid">

          {/* ─── Left column: Form ──────────────────────────── */}
          <div>
            <p
              className="eyebrow"
              style={{ marginBottom: '0.75rem' }}
            >
              {contactConfig.eyebrow}
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 300,
                margin: '0 0 1rem',
                color: 'var(--text-primary, #f5f0e8)',
                lineHeight: 1.15,
              }}
            >
              {contactConfig.headline}
            </h2>
            <p
              style={{
                color: 'var(--text-secondary, #9ca3af)',
                marginBottom: '2.5rem',
                lineHeight: 1.7,
              }}
            >
              {contactConfig.subtext}
            </p>

            {/* ── Success State ──────────────────────────────── */}
            {status === 'success' ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  padding: '1.5rem',
                  backgroundColor: 'rgba(34, 197, 94, 0.08)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: 'var(--border-radius, 4px)',
                }}
              >
                <CheckCircle size={24} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p style={{ color: '#22c55e', margin: '0 0 0.25rem', fontWeight: 500 }}>
                    Message Sent
                  </p>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
                    {contactConfig.successMessage}
                  </p>
                </div>
              </div>
            ) : (
              /* ── Form ───────────────────────────────────────── */
              <form
                onSubmit={handleSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
              >
                {/* Name + Email */}
                <div className="form-row-2">
                  <div>
                    <label style={labelStyle}>{contactConfig.fields.name.label}</label>
                    <input
                      type="text"
                      required
                      placeholder={contactConfig.fields.name.placeholder}
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>{contactConfig.fields.email.label}</label>
                    <input
                      type="email"
                      required
                      placeholder={contactConfig.fields.email.placeholder}
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Company */}
                <div>
                  <label style={labelStyle}>{contactConfig.fields.company.label}</label>
                  <input
                    type="text"
                    placeholder={contactConfig.fields.company.placeholder}
                    value={form.company}
                    onChange={(e) => update('company', e.target.value)}
                    style={inputStyle}
                  />
                </div>

                {/* Service select */}
                <div>
                  <label style={labelStyle}>{contactConfig.fields.service.label}</label>
                  <select
                    value={form.service}
                    onChange={(e) => update('service', e.target.value)}
                    style={{
                      ...inputStyle,
                      cursor: 'pointer',
                      appearance: 'none',
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      paddingRight: '2.5rem',
                    }}
                  >
                    <option value="">Select a service…</option>
                    {contactConfig.fields.service.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label style={labelStyle}>{contactConfig.fields.message.label}</label>
                  <textarea
                    rows={5}
                    placeholder={contactConfig.fields.message.placeholder}
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                  />
                </div>

                {/* Error state */}
                {status === 'error' && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: '#ef4444',
                    }}
                  >
                    <AlertCircle size={16} />
                    <span style={{ fontSize: '0.875rem' }}>{contactConfig.errorMessage}</span>
                  </div>
                )}

                {/* Submit */}
                <div className="form-submit-row">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary"
                    style={{
                      opacity: status === 'loading' ? 0.7 : 1,
                      cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {status === 'loading' ? 'Sending…' : contactConfig.submitText}
                  </button>
                </div>

                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
                  {contactConfig.privacyNotice}
                </p>
              </form>
            )}
          </div>

          {/* ─── Right column: Info + Directory ─────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Contact info cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: '1rem',
              }}
            >
              {contactConfig.contactItems.map((item) => {
                const Icon = iconMap[item.icon];
                return (
                  <div
                    key={item.label}
                    style={{
                      padding: '1.25rem',
                      backgroundColor: 'var(--surface-2, rgba(255,255,255,0.03))',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--border-radius, 4px)',
                    }}
                  >
                    {Icon && (
                      <Icon
                        size={18}
                        color="var(--accent, #c9a96e)"
                        style={{ marginBottom: '0.625rem' }}
                      />
                    )}
                    <p
                      style={{
                        fontSize: '0.65rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.14em',
                        color: 'var(--text-muted, #6b7280)',
                        margin: '0 0 0.3rem',
                      }}
                    >
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        style={{
                          fontSize: '0.875rem',
                          color: 'var(--text-secondary, #9ca3af)',
                          textDecoration: 'none',
                          transition: 'color 0.2s',
                        }}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p
                        style={{
                          fontSize: '0.875rem',
                          color: 'var(--text-secondary, #9ca3af)',
                          margin: 0,
                        }}
                      >
                        {item.value}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Google Maps — conditionally rendered when embed URL is set */}
            {contactConfig.googleMapsEmbed &&
              contactConfig.googleMapsEmbed !== '' &&
              contactConfig.googleMapsEmbed !== '[YOUR_GOOGLE_MAPS_EMBED_URL]' && (
                <div
                  style={{
                    borderRadius: 'var(--border-radius, 4px)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <iframe
                    src={contactConfig.googleMapsEmbed}
                    width="100%"
                    height="280"
                    style={{ border: 0, display: 'block' }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Leverage AI location map"
                  />
                </div>
              )}

            {/* Directory / social links */}
            {contactConfig.directoryLinks.length > 0 && (
              <div>
                <p
                  style={{
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.18em',
                    color: 'var(--text-muted, #6b7280)',
                    marginBottom: '0.875rem',
                  }}
                >
                  Find Us Online
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {contactConfig.directoryLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.45rem 0.875rem',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--border-radius, 4px)',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted, #6b7280)',
                        textDecoration: 'none',
                        transition: 'border-color 0.2s, color 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary, #f5f0e8)';
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--accent, #c9a96e)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted, #6b7280)';
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border-subtle)';
                      }}
                    >
                      {link.name}
                      {link.badge && (
                        <span
                          style={{
                            fontSize: '0.65rem',
                            color: 'var(--accent, #c9a96e)',
                            fontWeight: 600,
                          }}
                        >
                          {link.badge}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Responsive layout ─────────────────────────────── */}
      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .form-submit-row .btn-primary {
          width: auto;
          min-width: 160px;
        }
        @media (max-width: 767px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .form-row-2 {
            grid-template-columns: 1fr !important;
          }
          .form-submit-row .btn-primary {
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}
