import { useState, useEffect, useRef } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  :root {
    --forest: #1C3A2A;
    --forest-deep: #112218;
    --sage: #3D6B4F;
    --sage-light: #5E9470;
    --cream: #F6F1E8;
    --ivory: #FAF8F4;
    --gold: #B8933F;
    --gold-light: #D4AF5A;
    --charcoal: #252520;
    --mist: #E4DDD0;
    --warm-gray: #8C8577;
    --radius: 4px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body { font-family: 'DM Sans', sans-serif; background: var(--ivory); color: var(--charcoal); }

  .grain-overlay {
    position: fixed; inset: 0; pointer-events: none; z-index: 9999;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.4;
  }

  /* NAV */
  .nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(247,241,232,0.92);
    backdrop-filter: blur(18px) saturate(1.4);
    border-bottom: 1px solid var(--mist);
  }
  .nav-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2rem; height: 72px;
  }
  .nav-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
  .nav-logo-mark {
    width: 38px; height: 38px; border-radius: 50%;
    background: var(--forest);
    display: flex; align-items: center; justify-content: center;
  }
  .nav-logo-mark svg { width: 20px; height: 20px; }
  .nav-logo-text { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 600; color: var(--forest); letter-spacing: 0.01em; line-height: 1.1; }
  .nav-logo-sub { font-size: 0.65rem; font-weight: 400; color: var(--warm-gray); letter-spacing: 0.12em; text-transform: uppercase; }
  .nav-tabs { display: flex; gap: 2px; }
  .nav-tab {
    position: relative; padding: 8px 18px; font-size: 0.82rem; letter-spacing: 0.06em;
    text-transform: uppercase; font-weight: 500; cursor: pointer;
    color: var(--warm-gray); background: none; border: none;
    transition: color 0.25s; font-family: 'DM Sans', sans-serif;
  }
  .nav-tab:hover { color: var(--forest); }
  .nav-tab.active { color: var(--forest); }
  .nav-tab.active::after {
    content: ''; position: absolute; bottom: -1px; left: 18px; right: 18px;
    height: 2px; background: var(--gold); border-radius: 2px;
  }
  .nav-cta {
    background: var(--forest); color: var(--cream); border: none;
    padding: 10px 22px; border-radius: var(--radius); font-size: 0.8rem;
    font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase;
    cursor: pointer; transition: background 0.25s, transform 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .nav-cta:hover { background: var(--sage); transform: translateY(-1px); }

  /* PAGE */
  .page { animation: fadeUp 0.45s ease both; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

  /* HERO */
  .hero {
    min-height: 88vh; display: grid; grid-template-columns: 1fr 1fr;
    position: relative; overflow: hidden;
    background: var(--forest-deep);
  }
  .hero-content {
    display: flex; flex-direction: column; justify-content: center;
    padding: 6rem 4rem 6rem 5rem; position: relative; z-index: 2;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(184,147,63,0.15); border: 1px solid rgba(184,147,63,0.3);
    color: var(--gold-light); padding: 6px 14px; border-radius: 20px;
    font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase;
    font-weight: 500; margin-bottom: 2rem; width: fit-content;
  }
  .hero-badge span { width: 5px; height: 5px; border-radius: 50%; background: var(--gold-light); display: block; }
  .hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(3rem, 5.5vw, 5rem);
    font-weight: 300; line-height: 1.08; color: var(--cream);
    margin-bottom: 1.5rem; letter-spacing: -0.01em;
  }
  .hero-title em { font-style: italic; color: var(--gold-light); }
  .hero-subtitle {
    font-size: 1rem; color: rgba(246,241,232,0.6); line-height: 1.7;
    max-width: 440px; margin-bottom: 3rem; font-weight: 300;
  }
  .hero-actions { display: flex; gap: 14px; align-items: center; }
  .btn-primary {
    background: var(--gold); color: var(--forest-deep); border: none;
    padding: 14px 32px; border-radius: var(--radius); font-size: 0.85rem;
    font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase;
    cursor: pointer; transition: all 0.25s; font-family: 'DM Sans', sans-serif;
  }
  .btn-primary:hover { background: var(--gold-light); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(184,147,63,0.35); }
  .btn-ghost {
    background: none; color: var(--cream); border: 1px solid rgba(246,241,232,0.25);
    padding: 13px 28px; border-radius: var(--radius); font-size: 0.85rem;
    font-weight: 400; letter-spacing: 0.05em; cursor: pointer;
    transition: all 0.25s; font-family: 'DM Sans', sans-serif;
  }
  .btn-ghost:hover { border-color: rgba(246,241,232,0.55); background: rgba(246,241,232,0.05); }
  .hero-stats {
    display: flex; gap: 2.5rem; margin-top: 4rem; padding-top: 3rem;
    border-top: 1px solid rgba(246,241,232,0.1);
  }
  .hero-stat-num {
    font-family: 'Cormorant Garamond', serif; font-size: 2.2rem;
    color: var(--gold-light); font-weight: 500; line-height: 1;
  }
  .hero-stat-label { font-size: 0.73rem; color: rgba(246,241,232,0.45); letter-spacing: 0.08em; text-transform: uppercase; margin-top: 4px; }

  .hero-visual {
    position: relative; overflow: hidden;
  }
  .hero-visual-bg {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 60% 40%, rgba(62,107,79,0.4) 0%, transparent 70%),
      linear-gradient(135deg, var(--forest) 0%, var(--forest-deep) 100%);
  }
  .hero-visual-art {
    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  }
  .hero-spine-wrap { position: relative; width: 280px; height: 420px; }
  .spine-circle {
    position: absolute; border-radius: 50%; border: 1px solid rgba(184,147,63,0.2);
    animation: pulse-ring 4s ease-in-out infinite;
  }
  @keyframes pulse-ring { 0%,100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.06); opacity: 0.15; } }
  .hero-card {
    position: absolute; bottom: 3rem; left: 3rem;
    background: rgba(247,241,232,0.05); border: 1px solid rgba(246,241,232,0.12);
    backdrop-filter: blur(12px); border-radius: 8px; padding: 16px 22px;
  }
  .hero-card-label { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--gold-light); margin-bottom: 6px; }
  .hero-card-val { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; color: var(--cream); font-weight: 400; }
  .hero-card-sub { font-size: 0.72rem; color: rgba(246,241,232,0.45); margin-top: 2px; }

  /* TRUST STRIP */
  .trust-strip { background: var(--forest); padding: 1.5rem 0; }
  .trust-inner { max-width: 1200px; margin: 0 auto; padding: 0 2rem; display: flex; align-items: center; gap: 3rem; }
  .trust-item { display: flex; align-items: center; gap: 10px; color: rgba(246,241,232,0.65); font-size: 0.78rem; letter-spacing: 0.05em; text-transform: uppercase; white-space: nowrap; }
  .trust-item svg { color: var(--gold); flex-shrink: 0; }
  .trust-divider { width: 1px; height: 24px; background: rgba(246,241,232,0.12); flex-shrink: 0; }

  /* SECTION COMMONS */
  .section { padding: 7rem 0; }
  .section-inner { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
  .section-label { font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold); font-weight: 500; margin-bottom: 1rem; }
  .section-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.2rem,4vw,3.4rem); font-weight: 300; line-height: 1.15; color: var(--forest-deep); margin-bottom: 1.2rem; }
  .section-title em { font-style: italic; }
  .section-subtitle { color: var(--warm-gray); line-height: 1.7; font-size: 0.97rem; max-width: 520px; font-weight: 300; }

  /* SERVICES */
  .services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5px; margin-top: 4rem; background: var(--mist); border: 1.5px solid var(--mist); border-radius: 8px; overflow: hidden; }
  .service-card {
    background: var(--ivory); padding: 2.8rem 2.4rem;
    transition: background 0.3s; cursor: pointer; position: relative; overflow: hidden;
  }
  .service-card::before {
    content: ''; position: absolute; inset: 0; background: var(--forest);
    transform: translateY(100%); transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
  }
  .service-card:hover::before { transform: translateY(0); }
  .service-card:hover .sc-icon-wrap { background: rgba(184,147,63,0.2); }
  .service-card:hover .sc-title, .service-card:hover .sc-desc, .service-card:hover .sc-link { color: var(--cream); }
  .service-card:hover .sc-link { border-color: rgba(246,241,232,0.2); }
  .sc-icon-wrap {
    width: 52px; height: 52px; border-radius: 8px; background: rgba(28,58,42,0.07);
    display: flex; align-items: center; justify-content: center; margin-bottom: 1.6rem;
    transition: background 0.3s; position: relative; z-index: 1;
  }
  .sc-icon-wrap svg { color: var(--forest); transition: color 0.3s; }
  .service-card:hover .sc-icon-wrap svg { color: var(--gold-light); }
  .sc-title { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 500; color: var(--forest-deep); margin-bottom: 0.8rem; position: relative; z-index: 1; transition: color 0.3s; }
  .sc-desc { font-size: 0.87rem; color: var(--warm-gray); line-height: 1.65; margin-bottom: 1.6rem; position: relative; z-index: 1; transition: color 0.3s; }
  .sc-link { font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--forest); border-bottom: 1px solid var(--mist); padding-bottom: 2px; transition: color 0.3s, border-color 0.3s; display: inline-block; position: relative; z-index: 1; font-weight: 500; cursor: pointer; }

  /* ABOUT STRIP */
  .about-strip { background: var(--cream); }
  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: center; }
  .about-img-wrap {
    position: relative; aspect-ratio: 4/5; background: var(--forest);
    border-radius: 4px; overflow: hidden;
  }
  .about-img-placeholder {
    position: absolute; inset: 0;
    background: linear-gradient(160deg, var(--sage) 0%, var(--forest-deep) 100%);
    display: flex; align-items: center; justify-content: center;
  }
  .about-img-deco {
    position: absolute; bottom: -1px; right: -1px; width: 120px; height: 120px;
    background: var(--gold); opacity: 0.12; border-radius: 50%;
  }
  .about-credential {
    position: absolute; bottom: 2rem; left: 2rem; right: 2rem;
    background: rgba(247,241,232,0.95); border-radius: 4px; padding: 16px 20px;
    border-left: 3px solid var(--gold);
  }
  .ac-name { font-family: 'Cormorant Garamond', serif; font-size: 1.15rem; font-weight: 600; color: var(--forest-deep); }
  .ac-title { font-size: 0.73rem; color: var(--warm-gray); letter-spacing: 0.06em; text-transform: uppercase; margin-top: 2px; }
  .about-values { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 2.5rem; }
  .av-item { padding: 1.2rem; border: 1px solid var(--mist); border-radius: 4px; }
  .av-item-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--gold); font-weight: 500; margin-bottom: 0.4rem; }
  .av-item-text { font-size: 0.85rem; color: var(--warm-gray); line-height: 1.5; }

  /* TESTIMONIALS */
  .testimonials-section { background: var(--forest-deep); }
  .testimonials-section .section-title { color: var(--cream); }
  .testimonials-section .section-subtitle { color: rgba(246,241,232,0.5); }
  .testimonials-section .section-label { color: var(--gold-light); }
  .testi-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; margin-top: 3.5rem; }
  .testi-card {
    background: rgba(246,241,232,0.04); border: 1px solid rgba(246,241,232,0.08);
    border-radius: 8px; padding: 2rem; position: relative;
    transition: border-color 0.3s, background 0.3s;
  }
  .testi-card:hover { border-color: rgba(184,147,63,0.3); background: rgba(246,241,232,0.06); }
  .testi-stars { display: flex; gap: 3px; margin-bottom: 1.2rem; }
  .testi-star { color: var(--gold); font-size: 0.85rem; }
  .testi-quote { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-style: italic; color: rgba(246,241,232,0.85); line-height: 1.65; margin-bottom: 1.6rem; font-weight: 300; }
  .testi-author { display: flex; align-items: center; gap: 12px; }
  .testi-avatar { width: 38px; height: 38px; border-radius: 50%; background: var(--sage); display: flex; align-items: center; justify-content: center; color: var(--cream); font-size: 0.85rem; font-weight: 500; flex-shrink: 0; }
  .testi-name { font-size: 0.85rem; font-weight: 500; color: var(--cream); }
  .testi-detail { font-size: 0.72rem; color: rgba(246,241,232,0.4); margin-top: 2px; }

  /* CTA SECTION */
  .cta-section {
    background: var(--gold); padding: 5rem 0;
    position: relative; overflow: hidden;
  }
  .cta-inner { max-width: 1200px; margin: 0 auto; padding: 0 2rem; display: flex; align-items: center; justify-content: space-between; gap: 3rem; }
  .cta-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.8rem,3vw,2.8rem); color: var(--forest-deep); font-weight: 400; line-height: 1.2; }
  .cta-subtitle { font-size: 0.9rem; color: rgba(28,58,42,0.65); margin-top: 0.6rem; }
  .btn-dark { background: var(--forest-deep); color: var(--cream); border: none; padding: 15px 34px; border-radius: var(--radius); font-size: 0.85rem; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; cursor: pointer; transition: all 0.25s; font-family: 'DM Sans', sans-serif; white-space: nowrap; }
  .btn-dark:hover { background: var(--forest); transform: translateY(-2px); }

  /* SERVICES PAGE */
  .services-page-hero { background: var(--cream); padding: 5rem 0 4rem; border-bottom: 1px solid var(--mist); }
  .services-full-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 1.5rem; margin-top: 3rem; }
  .svc-full-card {
    background: var(--ivory); border: 1px solid var(--mist); border-radius: 8px;
    padding: 2.4rem; display: flex; gap: 1.8rem; align-items: flex-start;
    transition: box-shadow 0.3s, border-color 0.3s;
  }
  .svc-full-card:hover { border-color: var(--sage-light); box-shadow: 0 8px 32px rgba(28,58,42,0.08); }
  .svc-icon-lg { width: 60px; height: 60px; border-radius: 10px; background: rgba(28,58,42,0.06); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .svc-icon-lg svg { color: var(--forest); }
  .svc-price { display: inline-block; background: rgba(184,147,63,0.1); color: var(--gold); font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; margin-top: 0.8rem; font-weight: 500; }

  /* ABOUT PAGE */
  .about-page-hero { background: var(--forest-deep); padding: 6rem 0; }
  .about-page-hero .section-title { color: var(--cream); }
  .about-page-hero .section-subtitle { color: rgba(246,241,232,0.5); }
  .about-page-hero .section-label { color: var(--gold-light); }
  .team-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; margin-top: 3.5rem; }
  .team-card { background: var(--ivory); border-radius: 8px; overflow: hidden; border: 1px solid var(--mist); transition: transform 0.3s, box-shadow 0.3s; }
  .team-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(28,58,42,0.12); }
  .team-img { aspect-ratio: 3/3.5; background: linear-gradient(145deg, var(--sage) 0%, var(--forest) 100%); display: flex; align-items: center; justify-content: center; }
  .team-info { padding: 1.6rem; }
  .team-name { font-family: 'Cormorant Garamond', serif; font-size: 1.25rem; font-weight: 600; color: var(--forest-deep); }
  .team-role { font-size: 0.73rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--gold); margin: 4px 0 0.8rem; }
  .team-bio { font-size: 0.83rem; color: var(--warm-gray); line-height: 1.6; }
  .philosophy-block { background: var(--cream); border-radius: 8px; padding: 3rem; border-left: 4px solid var(--gold); margin-top: 3rem; }
  .philosophy-quote { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-style: italic; color: var(--forest-deep); line-height: 1.5; font-weight: 300; }
  .credentials-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.5rem; margin-top: 3rem; }
  .cred-item { text-align: center; padding: 2rem 1rem; background: var(--ivory); border-radius: 8px; border: 1px solid var(--mist); }
  .cred-num { font-family: 'Cormorant Garamond', serif; font-size: 2.4rem; color: var(--forest); font-weight: 500; }
  .cred-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--warm-gray); margin-top: 6px; }

  /* BLOG */
  .blog-hero { background: var(--cream); padding: 5rem 0 4rem; border-bottom: 1px solid var(--mist); }
  .blog-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 2rem; margin-top: 3.5rem; }
  .blog-card {
    background: var(--ivory); border: 1px solid var(--mist); border-radius: 8px; overflow: hidden;
    cursor: pointer; transition: transform 0.3s, box-shadow 0.3s;
    display: flex; flex-direction: column;
  }
  .blog-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(28,58,42,0.1); }
  .blog-img {
    aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;
  }
  .blog-tag {
    position: absolute; top: 14px; left: 14px;
    background: var(--gold); color: var(--forest-deep); font-size: 0.68rem;
    text-transform: uppercase; letter-spacing: 0.1em; padding: 4px 10px; border-radius: 20px; font-weight: 600;
  }
  .blog-body { padding: 1.6rem; flex: 1; display: flex; flex-direction: column; }
  .blog-meta { font-size: 0.72rem; color: var(--warm-gray); letter-spacing: 0.05em; margin-bottom: 0.7rem; }
  .blog-title { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 600; color: var(--forest-deep); line-height: 1.35; margin-bottom: 0.6rem; }
  .blog-excerpt { font-size: 0.83rem; color: var(--warm-gray); line-height: 1.6; flex: 1; }
  .blog-read { margin-top: 1.2rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--forest); font-weight: 500; border-bottom: 1px solid var(--mist); display: inline-block; padding-bottom: 2px; }

  /* MODAL */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(17,34,24,0.75);
    backdrop-filter: blur(8px); z-index: 200;
    display: flex; align-items: center; justify-content: center; padding: 2rem;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal {
    background: var(--ivory); border-radius: 8px; max-width: 760px; width: 100%;
    max-height: 90vh; overflow-y: auto; animation: slideUp 0.3s cubic-bezier(0.34,1.4,0.64,1);
    position: relative;
  }
  @keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.97); } to { opacity: 1; transform: none; } }
  .modal-header { padding: 0; position: relative; }
  .modal-hero-img { aspect-ratio: 16/7; display: flex; align-items: center; justify-content: center; border-radius: 8px 8px 0 0; overflow: hidden; }
  .modal-close {
    position: absolute; top: 1rem; right: 1rem; width: 36px; height: 36px;
    background: rgba(247,241,232,0.9); border: none; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; cursor: pointer;
    font-size: 1.1rem; color: var(--charcoal); transition: background 0.2s;
  }
  .modal-close:hover { background: var(--cream); }
  .modal-body { padding: 2.4rem; }
  .modal-tag { display: inline-block; background: rgba(184,147,63,0.12); color: var(--gold); font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.12em; padding: 4px 10px; border-radius: 20px; font-weight: 600; margin-bottom: 1rem; }
  .modal-title { font-family: 'Cormorant Garamond', serif; font-size: 1.9rem; font-weight: 500; color: var(--forest-deep); line-height: 1.25; margin-bottom: 0.8rem; }
  .modal-meta { font-size: 0.75rem; color: var(--warm-gray); margin-bottom: 1.8rem; padding-bottom: 1.8rem; border-bottom: 1px solid var(--mist); }
  .modal-content { font-size: 0.93rem; color: var(--charcoal); line-height: 1.8; }
  .modal-content p { margin-bottom: 1.2rem; }
  .modal-content h3 { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 600; color: var(--forest-deep); margin: 1.8rem 0 0.8rem; }
  .modal-content ul { padding-left: 1.4rem; margin-bottom: 1.2rem; }
  .modal-content li { margin-bottom: 0.4rem; color: var(--warm-gray); }

  /* CONTACT */
  .contact-hero { background: var(--forest-deep); padding: 5rem 0; }
  .contact-hero .section-title { color: var(--cream); }
  .contact-hero .section-label { color: var(--gold-light); }
  .contact-hero .section-subtitle { color: rgba(246,241,232,0.5); }
  .contact-grid { display: grid; grid-template-columns: 1fr 1.4fr; gap: 4rem; margin-top: 4rem; }
  .contact-info-block { padding: 2rem; background: rgba(246,241,232,0.04); border: 1px solid rgba(246,241,232,0.08); border-radius: 8px; }
  .contact-info-item { display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1.6rem; }
  .ci-icon { width: 38px; height: 38px; border-radius: 8px; background: rgba(184,147,63,0.15); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ci-icon svg { color: var(--gold-light); }
  .ci-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(246,241,232,0.4); margin-bottom: 3px; }
  .ci-val { color: rgba(246,241,232,0.85); font-size: 0.9rem; line-height: 1.5; }
  .hours-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; margin-top: 1rem; }
  .hours-row { display: flex; justify-content: space-between; font-size: 0.8rem; color: rgba(246,241,232,0.55); padding: 4px 0; border-bottom: 1px solid rgba(246,241,232,0.06); }
  .hours-row.today { color: var(--gold-light); font-weight: 500; }
  .contact-form-wrap { background: var(--ivory); border-radius: 8px; padding: 2.4rem; }
  .form-title { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; color: var(--forest-deep); margin-bottom: 0.4rem; }
  .form-subtitle { font-size: 0.83rem; color: var(--warm-gray); margin-bottom: 2rem; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .form-group { margin-bottom: 1.2rem; }
  .form-label { display: block; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--warm-gray); margin-bottom: 6px; font-weight: 500; }
  .form-input, .form-select, .form-textarea {
    width: 100%; padding: 11px 14px; border: 1px solid var(--mist); border-radius: var(--radius);
    font-size: 0.9rem; font-family: 'DM Sans', sans-serif; color: var(--charcoal);
    background: var(--cream); transition: border-color 0.2s; outline: none;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--sage); }
  .form-textarea { resize: vertical; min-height: 100px; }
  .form-submit {
    width: 100%; background: var(--forest); color: var(--cream); border: none;
    padding: 14px; border-radius: var(--radius); font-size: 0.85rem; font-weight: 500;
    letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer;
    transition: background 0.25s; font-family: 'DM Sans', sans-serif; margin-top: 0.4rem;
  }
  .form-submit:hover { background: var(--sage); }
  .map-placeholder {
    margin-top: 3rem; height: 280px; background: linear-gradient(135deg, var(--sage) 0%, var(--forest-deep) 100%);
    border-radius: 8px; display: flex; align-items: center; justify-content: center;
    color: rgba(246,241,232,0.4); font-size: 0.85rem; letter-spacing: 0.08em; text-transform: uppercase;
    position: relative; overflow: hidden;
  }
  .map-pin { position: absolute; width: 24px; height: 24px; background: var(--gold); border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
  .map-pin::after { content: ''; position: absolute; width: 10px; height: 10px; background: var(--forest-deep); border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%,-50%); }

  /* FOOTER */
  .footer { background: var(--charcoal); padding: 4rem 0 2rem; }
  .footer-inner { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
  .footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 3rem; margin-bottom: 3rem; }
  .footer-brand p { font-size: 0.83rem; color: rgba(246,241,232,0.4); line-height: 1.65; margin-top: 0.8rem; max-width: 260px; }
  .footer-col-title { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(246,241,232,0.4); margin-bottom: 1rem; font-weight: 500; }
  .footer-link { display: block; font-size: 0.85rem; color: rgba(246,241,232,0.65); text-decoration: none; margin-bottom: 0.55rem; transition: color 0.2s; cursor: pointer; }
  .footer-link:hover { color: var(--gold-light); }
  .footer-bottom { border-top: 1px solid rgba(246,241,232,0.06); padding-top: 2rem; display: flex; justify-content: space-between; align-items: center; }
  .footer-copy { font-size: 0.75rem; color: rgba(246,241,232,0.25); }
  .footer-legal { display: flex; gap: 1.5rem; }
  .footer-legal a { font-size: 0.72rem; color: rgba(246,241,232,0.25); text-decoration: none; cursor: pointer; }
`;

// ─── DATA ────────────────────────────────────────────────────────────────────

const SERVICES = [
  { icon: "spine", title: "Spinal Adjustment", desc: "Precision manual therapy to restore proper vertebral alignment, relieve nerve compression, and optimize spinal function for lasting relief.", price: "From $85" },
  { icon: "body", title: "Sports Rehabilitation", desc: "Performance-focused treatment plans for athletes recovering from injury or seeking to optimize biomechanical function and prevent re-injury.", price: "From $95" },
  { icon: "massage", title: "Deep Tissue Therapy", desc: "Targeted soft tissue work that releases chronic tension patterns, improves circulation, and restores healthy muscle function.", price: "From $90" },
  { icon: "posture", title: "Postural Correction", desc: "Comprehensive assessment and corrective programs addressing modern lifestyle posture dysfunction through movement re-education.", price: "From $75" },
  { icon: "neuro", title: "Neurological Care", desc: "Specialized protocols for conditions involving the nervous system, including sciatica, radiculopathy, and peripheral nerve syndromes.", price: "From $100" },
  { icon: "wellness", title: "Wellness Maintenance", desc: "Proactive care plans designed to sustain optimal spinal health, prevent injury, and support your body's natural healing capacity.", price: "From $70" },
];

const TESTIMONIALS = [
  { name: "Sarah M.", detail: "Patient for 3 years · Sciatica Relief", quote: "After years of debilitating lower back pain, Dr. Harrington's systematic approach gave me my life back. Within 8 weeks I was completely pain-free.", initials: "SM" },
  { name: "James T.", detail: "Patient for 2 years · Sports Recovery", quote: "As a competitive runner, I was skeptical about chiropractic care. The sports rehabilitation program here is genuinely world-class. I'm running faster than ever.", initials: "JT" },
  { name: "Linda K.", detail: "Patient for 5 years · Wellness Plan", quote: "The team here treats the whole person, not just symptoms. My monthly maintenance visits are now something I genuinely look forward to.", initials: "LK" },
];

const BLOG_POSTS = [
  {
    id: 1, tag: "Spine Health", gradient: ["#2D5A3D","#1C3A2A"],
    date: "March 3, 2026", readTime: "5 min read",
    title: "The Modern Spine Crisis: Why Sitting Is the New Smoking",
    excerpt: "Prolonged sitting is reshaping our spinal anatomy in ways that create cascading health problems. Here's what's happening and how to reverse the damage.",
    content: `<p>The average American now spends over 10 hours per day sitting — in cars, at desks, on sofas. This sedentary pattern is creating what researchers are calling a "postural epidemic" with consequences far beyond simple back pain.</p>
    <h3>What Happens to Your Spine When You Sit</h3>
    <p>When seated, the lumbar spine loses its natural lordotic curve. The discs between vertebrae experience uneven compressive forces — up to 40% more pressure than when standing. Over years, this contributes to disc degeneration, facet joint arthritis, and chronically shortened hip flexors that alter your entire movement pattern.</p>
    <p>The thoracic spine develops a compensatory kyphosis — the characteristic "hunch" that becomes structural over time. This forward head posture adds approximately 10 pounds of effective load for every inch the head moves forward of center. By 2.5 inches forward, your neck is managing 42 pounds of force rather than 12.</p>
    <h3>The Neural Consequences</h3>
    <p>Spinal compression doesn't just hurt — it interferes with nerve signaling. The autonomic nervous system pathways that regulate everything from digestion to immune function run through the spine. Chronic compression and misalignment creates low-grade neurological interference that affects whole-body function.</p>
    <h3>Practical Reversal Strategies</h3>
    <ul>
      <li>Implement the 20-20-20 rule: every 20 minutes, take a 2-minute movement break</li>
      <li>Invest in a sit-stand desk and alternate every 30-45 minutes</li>
      <li>Strengthen the posterior chain — glutes, hamstrings, and spinal extensors</li>
      <li>Regular chiropractic adjustments to address accumulated mechanical dysfunction</li>
      <li>Daily hip flexor stretching to restore pelvic alignment</li>
    </ul>
    <p>The good news: structural changes are reversible with consistent intervention. Most patients see measurable postural improvement within 12 weeks of a comprehensive correction program.</p>`
  },
  {
    id: 2, tag: "Wellness", gradient: ["#4A7C59","#2D5A3D"],
    date: "February 18, 2026", readTime: "4 min read",
    title: "Chiropractic & Immunity: The Nervous System Connection",
    excerpt: "Emerging research illuminates the profound relationship between spinal health, nervous system function, and immune response — explaining why many patients report fewer illnesses.",
    content: `<p>Patients regularly report an unexpected benefit of consistent chiropractic care: they simply get sick less often. For years this was dismissed as anecdotal. Emerging research in psychoneuroimmunology is now providing the mechanistic explanation.</p>
    <h3>The Nervous-Immune Interface</h3>
    <p>The immune and nervous systems are deeply integrated. The autonomic nervous system — which is profoundly influenced by spinal health — directly innervates immune organs including the thymus, spleen, and lymph nodes. Spinal subluxations that create neurological interference can dysregulate this communication pathway.</p>
    <p>A 1992 study published in the Journal of Manipulative and Physiological Therapeutics found that chiropractic patients had 200% greater immune competence than non-chiropractic patients, and 400% greater than patients with serious disease.</p>
    <h3>Stress Hormones and Spinal Tension</h3>
    <p>Chronic musculoskeletal tension maintains elevated cortisol levels. Cortisol is acutely immunosuppressive — it's why chronic stress reliably increases infection susceptibility. By resolving mechanical tension patterns, chiropractic care contributes to normalizing cortisol signaling and restoring immune competence.</p>
    <h3>What This Means for Your Care</h3>
    <p>Viewing chiropractic through a wellness lens — rather than purely pain management — changes the calculus of preventive care. Regular spinal maintenance isn't just about avoiding back pain; it's foundational support for whole-body physiological function.</p>`
  },
  {
    id: 3, tag: "Nutrition", gradient: ["#1C3A2A","#3D6B4F"],
    date: "February 4, 2026", readTime: "6 min read",
    title: "Anti-Inflammatory Eating for Spinal Health",
    excerpt: "Your diet directly influences the inflammatory environment in your spinal tissues. These evidence-based nutritional strategies support healing and reduce chronic pain.",
    content: `<p>Inflammation is the common denominator in virtually all spinal conditions — from disc herniation to facet arthritis to muscle spasm. While chiropractic care addresses the mechanical component, dietary choices profoundly influence the underlying inflammatory biology.</p>
    <h3>Foods That Drive Inflammation</h3>
    <p>Ultra-processed foods, refined carbohydrates, and industrial seed oils (corn, canola, soybean) generate the prostaglandins and cytokines that amplify pain signaling and inhibit healing. Sugar is particularly problematic — it triggers advanced glycation end products (AGEs) that stiffen connective tissue including spinal ligaments and discs.</p>
    <h3>The Anti-Inflammatory Plate</h3>
    <ul>
      <li><strong>Fatty fish:</strong> Salmon, sardines, and mackerel provide EPA/DHA omega-3s that directly compete with pro-inflammatory arachidonic acid</li>
      <li><strong>Colorful vegetables:</strong> Polyphenols from diverse plant foods modulate NF-κB inflammatory pathways</li>
      <li><strong>Turmeric & ginger:</strong> Curcumin and gingerols have demonstrated analgesic effects comparable to NSAIDs in some studies</li>
      <li><strong>Extra-virgin olive oil:</strong> Oleocanthal inhibits the same enzymes as ibuprofen</li>
      <li><strong>Bone broth:</strong> Provides collagen precursors for disc and ligament matrix repair</li>
    </ul>
    <h3>Hydration and Disc Health</h3>
    <p>Intervertebral discs are approximately 80% water in youth, declining with age and dehydration. Adequate hydration — a minimum of 64oz daily, more with activity — is one of the simplest interventions for disc health. Even mild chronic dehydration accelerates disc degeneration.</p>`
  },
  {
    id: 4, tag: "Sleep", gradient: ["#2A3A1C","#1C2A3A"],
    date: "January 22, 2026", readTime: "4 min read",
    title: "Sleep Position & Spinal Alignment: The Complete Guide",
    excerpt: "How you sleep can either support recovery or create cumulative damage. Expert guidance on optimizing your sleep setup for spinal health.",
    content: `<p>The average person spends approximately 26 years sleeping. The position your spine is in for those cumulative hours profoundly affects its structural integrity over time. A poor sleep setup doesn't just give you a stiff neck — it creates patterns of misalignment that contribute to chronic conditions.</p>
    <h3>The Best Sleep Positions</h3>
    <p>Side sleeping with proper pillow support is generally optimal for most people. Place a pillow between your knees to keep the pelvis level and prevent lumbar rotation. The pillow height should be sufficient to keep your head neutral — neither tilted toward nor away from the mattress.</p>
    <p>Back sleeping is excellent when supported correctly. A pillow under the knees reduces lumbar extension and removes strain from the lower back. The cervical pillow should fill the neck curve without pushing the head forward.</p>
    <h3>What to Avoid</h3>
    <p>Stomach sleeping is genuinely problematic. It requires rotation of the cervical spine for breathing, creates sustained lumbar hyperextension, and compresses the facet joints. If you're a committed stomach sleeper, transitioning to side sleeping often requires 4-6 weeks of deliberate practice with strategic pillow placement.</p>
    <h3>Pillow and Mattress Selection</h3>
    <p>A mattress that is too soft allows spinal sag; too firm creates pressure point discomfort and loss of natural curve support. A medium-firm mattress typically balances both. Memory foam excels for pressure relief; innerspring with pillow top often provides good combination support. Replace pillows every 18 months.</p>`
  },
  {
    id: 5, tag: "Exercise", gradient: ["#3A1C2A","#2A3A1C"],
    date: "January 8, 2026", readTime: "5 min read",
    title: "Core Stability vs. Core Strength: A Critical Distinction",
    excerpt: "Most people train core strength when they need core stability — and the difference explains why gym-goers still suffer back pain despite strong abs.",
    content: `<p>The fitness industry has long promoted core strength as the solution to back pain. The clinical reality is more nuanced — and more important. Core stability, not raw strength, is the primary determinant of spinal protection and healthy movement patterns.</p>
    <h3>Understanding the Distinction</h3>
    <p>Core strength refers to the contractile capacity of abdominal and paraspinal muscles — how much force they can generate. Core stability refers to their ability to maintain spinal position under load, particularly through the middle ranges where most real-world injury occurs.</p>
    <p>Many people with excellent abdominal strength develop back pain because they've trained their superficial "mover" muscles (rectus abdominis, obliques) at the expense of the deep "stabilizer" muscles (transversus abdominis, multifidus, pelvic floor). The stabilizers don't generate power — they create the rigid base from which power safely transfers.</p>
    <h3>Training for Stability</h3>
    <ul>
      <li><strong>Dead bugs:</strong> The gold standard for transversus abdominis activation without spinal compression</li>
      <li><strong>Pallof press:</strong> Anti-rotation training that develops stability through reactive control</li>
      <li><strong>Bird-dog:</strong> Quadruped extension challenges stability through contralateral loading</li>
      <li><strong>McGill Big 3:</strong> Modified curl-up, side bridge, and bird-dog sequence developed specifically for spine rehabilitation</li>
    </ul>
    <h3>Integrating with Chiropractic Care</h3>
    <p>Chiropractic adjustments restore proper joint mechanics; stability training teaches muscles to maintain the corrected position. The combination is profoundly more effective than either intervention alone — which is why we integrate exercise prescription into comprehensive care plans.</p>`
  },
  {
    id: 6, tag: "Pediatric", gradient: ["#1C2A3A","#2D5A3D"],
    date: "December 18, 2025", readTime: "4 min read",
    title: "Children & Chiropractic: Safety, Evidence, and Appropriate Care",
    excerpt: "Pediatric chiropractic care is safe, gentle, and evidence-supported. Understanding when and how it benefits children at different developmental stages.",
    content: `<p>Parents are often surprised to learn that chiropractic care is both safe and beneficial for children. From birth through adolescence, the spine undergoes significant growth and mechanical stress that can create patterns of dysfunction that — when left unaddressed — become the adult spine problems of tomorrow.</p>
    <h3>Why Children Benefit from Spinal Care</h3>
    <p>The birth process itself can introduce cervical strain. As children develop — learning to walk, carrying heavy backpacks, participating in sports, spending hours on devices — the spine accumulates mechanical stresses. Pediatric chiropractic care addresses these early, when correction is most efficient.</p>
    <h3>How Pediatric Adjustments Differ</h3>
    <p>Adjustments for children are dramatically different from adult care. The force applied is gentle — often no more than light fingertip pressure — and the techniques are specifically adapted for developing spinal structures. Pediatric chiropractic is not scaled-down adult care; it's a distinct specialty approach.</p>
    <h3>Evidence-Based Applications</h3>
    <p>Research supports pediatric chiropractic for musculoskeletal conditions including sports injuries, growing pains, and postural dysfunction from device use. Parents also report improvements in sleep and general wellness in children receiving care, consistent with the nervous system regulation mechanisms we understand from adult care.</p>
    <p>Our practice maintains specific training in pediatric assessment and technique. We welcome families at every stage of life — and love watching patients we've cared for since childhood grow into adults with healthy, resilient spines.</p>`
  },
];

// ─── SVG ICONS ───────────────────────────────────────────────────────────────

const Icon = ({ name, size = 24 }) => {
  const icons = {
    spine: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M8 6h8M8 10h8M8 14h8M8 18h8"/></svg>,
    body: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="5" r="2"/><path d="M12 7v8l-3 4m3-4 3 4M9 13H7m10 0h-2"/></svg>,
    massage: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
    posture: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    neuro: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="12" r="10"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    wellness: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    clock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    phone: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 9.81 19.79 19.79 0 0 1 1 1.18 2 2 0 0 1 3 0h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 7.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 14z"/></svg>,
    map: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    mail: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    close: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    logo: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"><path d="M12 2v20M8 6h8M9 10h6M10 14h4M10 18h4"/></svg>,
    star: "★",
    award: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
    leaf: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 8C8 10 5.9 16.17 3.82 19.5 6.04 21.26 8.77 22 11.5 22c3.22 0 7.27-1.34 9.5-5C23 13 21 3 21 3c-2.44 1.64-2.56 2.63-4 5z"/></svg>,
  };
  return icons[name] || null;
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

const BlogModal = ({ post, onClose }) => {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-hero-img" style={{ background: `linear-gradient(145deg, ${post.gradient[0]}, ${post.gradient[1]})` }}>
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <Icon name="leaf" size={48} />
              <div style={{ color: "rgba(246,241,232,0.4)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "1rem" }}>Harrington Chiropractic</div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}><Icon name="close" size={16} /></button>
        </div>
        <div className="modal-body">
          <div className="modal-tag">{post.tag}</div>
          <h2 className="modal-title">{post.title}</h2>
          <div className="modal-meta">{post.date} · {post.readTime} · Dr. Jonathan Harrington, DC</div>
          <div className="modal-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
    </div>
  );
};

// ─── PAGE COMPONENTS ─────────────────────────────────────────────────────────

const HomePage = ({ setTab }) => (
  <div className="page">
    {/* Hero */}
    <div className="hero">
      <div className="hero-content">
        <div className="hero-badge"><span />Accepting New Patients</div>
        <h1 className="hero-title">Restore Your Body's <em>Natural Balance</em></h1>
        <p className="hero-subtitle">Evidence-based chiropractic care for those who demand more than symptom management — we address root causes and restore lasting function.</p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => setTab("contact")}>Book Consultation</button>
          <button className="btn-ghost" onClick={() => setTab("services")}>View Services</button>
        </div>
        <div className="hero-stats">
          <div><div className="hero-stat-num">14+</div><div className="hero-stat-label">Years Experience</div></div>
          <div><div className="hero-stat-num">4,800+</div><div className="hero-stat-label">Patients Served</div></div>
          <div><div className="hero-stat-num">98%</div><div className="hero-stat-label">Satisfaction Rate</div></div>
        </div>
      </div>
      <div className="hero-visual">
        <div className="hero-visual-bg" />
        <div className="hero-visual-art">
          <div style={{ position: "relative", width: 260, height: 380 }}>
            {[280,220,160,100].map((s,i) => (
              <div key={i} className="spine-circle" style={{ width: s, height: s, top: "50%", left: "50%", transform: `translate(-50%,-50%)`, animationDelay: `${i*0.8}s` }} />
            ))}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(184,147,63,0.15)", border: "1px solid rgba(184,147,63,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                  <Icon name="spine" size={36} />
                </div>
                <div style={{ color: "rgba(246,241,232,0.5)", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Precision Care</div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-card">
          <div className="hero-card-label">Next Available</div>
          <div className="hero-card-val">Tomorrow</div>
          <div className="hero-card-sub">8:00 AM · New Patient Consult</div>
        </div>
      </div>
    </div>

    {/* Trust strip */}
    <div className="trust-strip">
      <div className="trust-inner">
        {[["check","Licensed & Insured"],["award","Board Certified DC"],["check","Same-Day Appointments"],["check","Insurance Accepted"],["check","Family Friendly"]].map(([icon,label],i) => (
          <div key={i} className="trust-item">
            <Icon name={icon} size={15} />{label}
            {i < 4 && <div className="trust-divider" style={{ marginLeft: "3rem" }} />}
          </div>
        ))}
      </div>
    </div>

    {/* Featured Services */}
    <div className="section" style={{ background: "var(--ivory)" }}>
      <div className="section-inner">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "0" }}>
          <div>
            <div className="section-label">What We Offer</div>
            <h2 className="section-title">Comprehensive <em>Spinal Care</em></h2>
            <p className="section-subtitle">Every treatment plan is individually designed around your specific condition, lifestyle, and goals — not a template.</p>
          </div>
          <button className="btn-primary" style={{ flexShrink: 0 }} onClick={() => setTab("services")}>All Services</button>
        </div>
        <div className="services-grid">
          {SERVICES.map((s, i) => (
            <div key={i} className="service-card">
              <div className="sc-icon-wrap"><Icon name={s.icon} size={22} /></div>
              <div className="sc-title">{s.title}</div>
              <div className="sc-desc">{s.desc}</div>
              <div className="sc-link">Learn more →</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* About teaser */}
    <div className="section about-strip">
      <div className="section-inner">
        <div className="about-grid">
          <div className="about-img-wrap">
            <div className="about-img-placeholder">
              <div style={{ textAlign: "center", color: "rgba(246,241,232,0.35)" }}>
                <Icon name="award" size={64} />
                <div style={{ marginTop: "1rem", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Dr. Harrington</div>
              </div>
            </div>
            <div className="about-img-deco" />
            <div className="about-credential">
              <div className="ac-name">Dr. Jonathan Harrington, DC</div>
              <div className="ac-title">Doctor of Chiropractic · Board Certified</div>
            </div>
          </div>
          <div>
            <div className="section-label">Our Philosophy</div>
            <h2 className="section-title">Healing Through <em>Understanding</em></h2>
            <p className="section-subtitle">We believe that lasting health comes from understanding your body's interconnected systems — not from chasing symptoms. Every case is a puzzle worth solving completely.</p>
            <div className="about-values">
              {[["Root Cause","We identify and address the underlying source of dysfunction, not just the symptom presentation."],["Evidence-Based","Every protocol we employ is supported by current research and clinical evidence."],["Personalized","Your anatomy, history, and goals shape a care plan built specifically for you."],["Whole-Person","We consider lifestyle, nutrition, movement, and stress as part of your complete picture."]].map(([label,text],i) => (
                <div key={i} className="av-item">
                  <div className="av-item-label">{label}</div>
                  <div className="av-item-text">{text}</div>
                </div>
              ))}
            </div>
            <button className="btn-primary" style={{ marginTop: "2rem" }} onClick={() => setTab("about")}>Meet Our Team</button>
          </div>
        </div>
      </div>
    </div>

    {/* Testimonials */}
    <div className="section testimonials-section">
      <div className="section-inner">
        <div className="section-label">Patient Stories</div>
        <h2 className="section-title">Real Results, <em>Real Lives</em></h2>
        <div className="testi-grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testi-card">
              <div className="testi-stars">{[...Array(5)].map((_,j) => <span key={j} className="testi-star">★</span>)}</div>
              <div className="testi-quote">"{t.quote}"</div>
              <div className="testi-author">
                <div className="testi-avatar">{t.initials}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-detail">{t.detail}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* CTA */}
    <div className="cta-section">
      <div className="cta-inner">
        <div>
          <div className="cta-title">Ready to Start Your Recovery?</div>
          <div className="cta-subtitle">Most patients see meaningful improvement within 3 visits. Your first consultation includes a full assessment at no charge.</div>
        </div>
        <button className="btn-dark" onClick={() => setTab("contact")}>Schedule Free Consultation</button>
      </div>
    </div>
  </div>
);

const ServicesPage = () => (
  <div className="page">
    <div className="services-page-hero">
      <div className="section-inner">
        <div className="section-label">What We Offer</div>
        <h1 className="section-title">Our <em>Services</em></h1>
        <p className="section-subtitle">Every service is delivered with precision, care, and a treatment philosophy grounded in achieving measurable outcomes — not indefinite treatment dependency.</p>
      </div>
    </div>
    <div className="section" style={{ background: "var(--ivory)", paddingTop: "4rem" }}>
      <div className="section-inner">
        <div className="services-full-grid">
          {SERVICES.map((s, i) => (
            <div key={i} className="svc-full-card">
              <div className="svc-icon-lg"><Icon name={s.icon} size={28} /></div>
              <div>
                <div className="sc-title" style={{ fontSize: "1.3rem" }}>{s.title}</div>
                <div className="sc-desc" style={{ fontSize: "0.88rem" }}>{s.desc}</div>
                <div style={{ marginTop: "0.8rem" }}>
                  <p style={{ fontSize: "0.83rem", color: "var(--warm-gray)", lineHeight: 1.6 }}>
                    {i===0 && "Manual adjustments targeting vertebral subluxations restore joint mechanics and relieve nerve root pressure. Sessions typically 20–30 minutes."}
                    {i===1 && "We work with recreational and elite athletes to accelerate recovery and optimize movement patterns. Includes performance assessment and return-to-sport protocols."}
                    {i===2 && "Targeting myofascial restrictions and adhesions in the deeper muscle layers that contribute to chronic pain and movement limitations."}
                    {i===3 && "Addresses the biomechanical consequences of modern work and lifestyle. Combines manual therapy with corrective exercise prescription."}
                    {i===4 && "Specialized assessment and treatment for conditions involving spinal nerve pathways. We work collaboratively with neurologists when indicated."}
                    {i===5 && "Proactive monthly or bi-monthly care to maintain optimal spinal function and prevent the accumulation of mechanical stress."}
                  </p>
                </div>
                <div className="svc-price">{s.price}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "var(--forest)", borderRadius: 8, padding: "3rem", marginTop: "3rem", display: "flex", gap: "3rem", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", color: "var(--cream)", fontWeight: 300, lineHeight: 1.2 }}>Not sure which service is right for you?</div>
            <div style={{ color: "rgba(246,241,232,0.5)", fontSize: "0.9rem", marginTop: "0.5rem" }}>Book a complimentary 15-minute discovery call.</div>
          </div>
          <button className="nav-cta" style={{ whiteSpace: "nowrap", padding: "14px 28px" }}>Book Free Call</button>
        </div>
      </div>
    </div>
  </div>
);

const AboutPage = () => (
  <div className="page">
    <div className="about-page-hero">
      <div className="section-inner">
        <div className="section-label">Our Story</div>
        <h1 className="section-title">Dedicated to the <em>Art & Science</em> of Healing</h1>
        <p className="section-subtitle">Founded on the belief that exceptional chiropractic care combines deep technical mastery with genuine human connection.</p>
        <div className="credentials-grid" style={{ marginTop: "3.5rem" }}>
          {[["14+","Years in Practice"],["4,800+","Patients Served"],["98%","Patient Satisfaction"],["6","Specialized Certifications"]].map(([num,label]) => (
            <div key={label} className="cred-item" style={{ background: "rgba(246,241,232,0.05)", border: "1px solid rgba(246,241,232,0.08)" }}>
              <div className="cred-num" style={{ color: "var(--gold-light)" }}>{num}</div>
              <div className="cred-label" style={{ color: "rgba(246,241,232,0.4)" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="section" style={{ background: "var(--cream)" }}>
      <div className="section-inner">
        <div className="section-label">Our Philosophy</div>
        <h2 className="section-title">How We <em>Think</em> About Care</h2>
        <div className="philosophy-block">
          <div className="philosophy-quote">"The body is not a machine to be fixed — it is a living system to be understood. Our job is to remove the obstacles to its innate healing intelligence and then trust the process."</div>
          <div style={{ marginTop: "1.2rem", fontSize: "0.8rem", color: "var(--warm-gray)", letterSpacing: "0.06em", textTransform: "uppercase" }}>— Dr. Jonathan Harrington, DC</div>
        </div>
        <div style={{ marginTop: "3rem", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>
          {[["Root Cause Resolution","We trace symptoms back to their structural source. Treating the area that hurts and treating the cause of the pain are often two different things."],["Outcome Measurement","We track your progress with objective functional assessments — not just subjective pain scores — so we both know care is working."],["Education Partnership","An informed patient heals faster. We invest significant time ensuring you understand your condition and your recovery pathway."]].map(([title,text]) => (
            <div key={title} style={{ padding: "1.8rem", background: "var(--ivory)", borderRadius: 8, border: "1px solid var(--mist)" }}>
              <div style={{ width: 32, height: 3, background: "var(--gold)", borderRadius: 2, marginBottom: "1rem" }} />
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", fontWeight: 600, color: "var(--forest-deep)", marginBottom: "0.7rem" }}>{title}</div>
              <div style={{ fontSize: "0.84rem", color: "var(--warm-gray)", lineHeight: 1.65 }}>{text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="section" style={{ background: "var(--ivory)", paddingTop: "0" }}>
      <div className="section-inner">
        <div className="section-label">The Team</div>
        <h2 className="section-title">Meet Your <em>Practitioners</em></h2>
        <div className="team-grid">
          {[
            { name: "Dr. Jonathan Harrington", role: "Lead Chiropractor, DC", bio: "Palmer College graduate with advanced certifications in sports chiropractic and neurodiagnostics. 14 years clinical experience. Active researcher in spinal biomechanics.", gradient: ["#2D5A3D","#1C3A2A"] },
            { name: "Dr. Priya Mehta", role: "Associate Chiropractor, DC", bio: "Specialist in pediatric and prenatal chiropractic care. Certified Webster Technique practitioner. Particular expertise in headache and cervicogenic conditions.", gradient: ["#4A7C59","#2D5A3D"] },
            { name: "Marcus Chen", role: "Rehabilitation Therapist", bio: "NASM-certified personal trainer with specialization in corrective exercise. Designs and supervises the active care and home exercise components of each patient's plan.", gradient: ["#3D6B4F","#1C3A2A"] },
          ].map(t => (
            <div key={t.name} className="team-card">
              <div className="team-img" style={{ background: `linear-gradient(145deg, ${t.gradient[0]}, ${t.gradient[1]})` }}>
                <Icon name="award" size={52} />
              </div>
              <div className="team-info">
                <div className="team-name">{t.name}</div>
                <div className="team-role">{t.role}</div>
                <div className="team-bio">{t.bio}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const BlogPage = ({ onPostClick }) => (
  <div className="page">
    <div className="blog-hero">
      <div className="section-inner">
        <div className="section-label">Knowledge Center</div>
        <h1 className="section-title">Insights for a <em>Healthier Spine</em></h1>
        <p className="section-subtitle">Evidence-based articles on spinal health, movement, nutrition, and the science behind chiropractic care — written for patients, not practitioners.</p>
      </div>
    </div>
    <div className="section" style={{ background: "var(--ivory)", paddingTop: "4rem" }}>
      <div className="section-inner">
        <div className="blog-grid">
          {BLOG_POSTS.map(post => (
            <div key={post.id} className="blog-card" onClick={() => onPostClick(post)}>
              <div className="blog-img" style={{ background: `linear-gradient(145deg, ${post.gradient[0]}, ${post.gradient[1]})` }}>
                <div style={{ color: "rgba(246,241,232,0.25)" }}><Icon name="leaf" size={40} /></div>
                <div className="blog-tag">{post.tag}</div>
              </div>
              <div className="blog-body">
                <div className="blog-meta">{post.date} · {post.readTime}</div>
                <div className="blog-title">{post.title}</div>
                <div className="blog-excerpt">{post.excerpt}</div>
                <div className="blog-read">Read article →</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const today = new Date().getDay();
  const hours = [
    { day: "Monday", hours: "8:00 AM – 6:00 PM", dayNum: 1 },
    { day: "Tuesday", hours: "8:00 AM – 6:00 PM", dayNum: 2 },
    { day: "Wednesday", hours: "10:00 AM – 7:00 PM", dayNum: 3 },
    { day: "Thursday", hours: "8:00 AM – 6:00 PM", dayNum: 4 },
    { day: "Friday", hours: "8:00 AM – 4:00 PM", dayNum: 5 },
    { day: "Saturday", hours: "9:00 AM – 1:00 PM", dayNum: 6 },
    { day: "Sunday", hours: "Closed", dayNum: 0 },
  ];
  return (
    <div className="page">
      <div className="contact-hero">
        <div className="section-inner">
          <div className="section-label">Get In Touch</div>
          <h1 className="section-title">Begin Your <em>Recovery</em></h1>
          <p className="section-subtitle">Book an appointment, ask a question, or schedule a complimentary 15-minute discovery call.</p>
          <div className="contact-grid">
            <div>
              <div className="contact-info-block">
                {[
                  { icon: "map", label: "Location", val: "842 Willow Creek Drive\nGrantsPass, OR 97526" },
                  { icon: "phone", label: "Phone", val: "(541) 555-0192" },
                  { icon: "mail", label: "Email", val: "hello@harringtonchiro.com" },
                ].map(item => (
                  <div key={item.label} className="contact-info-item">
                    <div className="ci-icon"><Icon name={item.icon} size={18} /></div>
                    <div>
                      <div className="ci-label">{item.label}</div>
                      <div className="ci-val" style={{ whiteSpace: "pre-line" }}>{item.val}</div>
                    </div>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid rgba(246,241,232,0.08)", paddingTop: "1.5rem", marginTop: "0.5rem" }}>
                  <div className="ci-label" style={{ marginBottom: "0.8rem" }}>Office Hours</div>
                  {hours.map(h => (
                    <div key={h.day} className={`hours-row ${h.dayNum === today ? "today" : ""}`}>
                      <span>{h.day}</span><span>{h.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="contact-form-wrap">
              {submitted ? (
                <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                  <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(28,58,42,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.2rem" }}><Icon name="check" size={28} /></div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", color: "var(--forest-deep)", marginBottom: "0.6rem" }}>Request Received!</div>
                  <div style={{ fontSize: "0.88rem", color: "var(--warm-gray)", lineHeight: 1.6 }}>We'll reach out within one business day to confirm your appointment. Check your email for a confirmation.</div>
                </div>
              ) : (
                <>
                  <div className="form-title">Request an Appointment</div>
                  <div className="form-subtitle">We'll confirm within one business day.</div>
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">First Name</label><input className="form-input" placeholder="Jonathan" /></div>
                    <div className="form-group"><label className="form-label">Last Name</label><input className="form-input" placeholder="Smith" /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">Email</label><input className="form-input" placeholder="you@example.com" type="email" /></div>
                    <div className="form-group"><label className="form-label">Phone</label><input className="form-input" placeholder="(541) 555-0000" type="tel" /></div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Service Interested In</label>
                    <select className="form-select">
                      <option>New Patient Consultation</option>
                      <option>Spinal Adjustment</option>
                      <option>Sports Rehabilitation</option>
                      <option>Deep Tissue Therapy</option>
                      <option>Postural Correction</option>
                      <option>Wellness Maintenance</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tell Us About Your Condition</label>
                    <textarea className="form-textarea" placeholder="Describe your primary concern, how long you've had it, and any previous treatment..." />
                  </div>
                  <button className="form-submit" onClick={() => setSubmitted(true)}>Request Appointment →</button>
                  <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.72rem", color: "var(--warm-gray)" }}>Your information is private and never shared.</div>
                </>
              )}
            </div>
          </div>
          <div className="map-placeholder">
            <div className="map-pin" />
            <div style={{ position: "relative", zIndex: 1 }}>Map · 842 Willow Creek Drive, Grants Pass, OR</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("home");
  const [activePost, setActivePost] = useState(null);

  const tabs = [
    { id: "home", label: "Home" },
    { id: "services", label: "Services" },
    { id: "about", label: "About" },
    { id: "blog", label: "Blog" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="grain-overlay" />

      {/* Sticky Nav */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="nav-logo">
            <div className="nav-logo-mark"><Icon name="logo" /></div>
            <div>
              <div className="nav-logo-text">Harrington Chiropractic</div>
              <div className="nav-logo-sub">Grants Pass, Oregon</div>
            </div>
          </div>
          <div className="nav-tabs">
            {tabs.map(t => (
              <button key={t.id} className={`nav-tab${tab === t.id ? " active" : ""}`} onClick={() => setTab(t.id)}>{t.label}</button>
            ))}
          </div>
          <button className="nav-cta" onClick={() => setTab("contact")}>Book Now</button>
        </div>
      </nav>

      {/* Pages */}
      <main key={tab}>
        {tab === "home" && <HomePage setTab={setTab} />}
        {tab === "services" && <ServicesPage />}
        {tab === "about" && <AboutPage />}
        {tab === "blog" && <BlogPage onPostClick={setActivePost} />}
        {tab === "contact" && <ContactPage />}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-brand">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="nav-logo-mark"><Icon name="logo" /></div>
                <div className="nav-logo-text" style={{ color: "rgba(246,241,232,0.8)" }}>Harrington Chiropractic</div>
              </div>
              <p>Evidence-based chiropractic care for the whole family. Serving Grants Pass and Southern Oregon since 2011.</p>
            </div>
            <div>
              <div className="footer-col-title">Services</div>
              {["Spinal Adjustment","Sports Rehab","Deep Tissue Therapy","Postural Correction","Neurological Care","Wellness Plans"].map(l => <div key={l} className="footer-link">{l}</div>)}
            </div>
            <div>
              <div className="footer-col-title">Practice</div>
              {[["About Us","about"],["Meet the Team","about"],["Our Blog","blog"],["Patient Resources","contact"],["Insurance & Fees","contact"]].map(([l,t]) => <div key={l} className="footer-link" onClick={() => setTab(t)}>{l}</div>)}
            </div>
            <div>
              <div className="footer-col-title">Contact</div>
              <div className="footer-link">842 Willow Creek Drive</div>
              <div className="footer-link">Grants Pass, OR 97526</div>
              <div style={{ height: 10 }} />
              <div className="footer-link">(541) 555-0192</div>
              <div className="footer-link">hello@harringtonchiro.com</div>
              <div style={{ height: 10 }} />
              <button className="nav-cta" style={{ width: "100%", marginTop: 4 }} onClick={() => setTab("contact")}>Book Appointment</button>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copy">© 2026 Harrington Chiropractic. All rights reserved.</div>
            <div className="footer-legal">
              <a>Privacy Policy</a>
              <a>Terms of Service</a>
              <a>Accessibility</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Blog Modal */}
      {activePost && <BlogModal post={activePost} onClose={() => setActivePost(null)} />}
    </>
  );
}
