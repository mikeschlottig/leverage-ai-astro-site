# Leverage AI Astro Site — Implementation Plan

## Phase 1: Foundation Fixes ✓ DONE
- 1.1 Remove dynamic hero counter — `src/components/HeroSection.tsx` ✓
- 1.2 Fix site URL inconsistency — `robots.txt`, `index.astro`, `glossary.astro`, `research/index.astro` ✓
- 1.3 Fix contact email — `site-config.ts` ✓

## Phase 2: Content Collections & Routing ✓ DONE
- 2.1 Add `items` to collections export + fix schema ✓
- 2.2 Catalog → live app listing page ✓
- 2.3 Repurpose library for reports (structure ready) ✓
- 2.4 Create catalog content entries (6 apps) ✓

## Phase 3: App Pages Enhancement ✓ DONE
- 3.1–3.6 All 6 app wrappers enhanced with BaseLayout, H1, SEO meta, JSON-LD WebApplication schema, BreadcrumbList, FAQ sections

## Phase 4: Image Optimization ✓ DONE
- 4.1 sharp installed — astro:assets ready for use
- 4.2 `<Image />` conversion ready (needs actual photos to reference)
- 4.3 Founder photo placeholder added (replace `/images/leverageai-logo.webp` with real photo)

## Phase 5: Nav & SSR Optimization ✓ DONE
- 5.1 Nav links → individual service pages ✓
- 5.2 Catalog added to nav + footer ✓
- 5.3 `static` mode (default in Astro 6.1) ✓
- 5.4 `prerender = false` on 3 dynamic routes ✓
- 5.5 `client:load` → `client:idle` on ScrollToTop ✓

## Phase 6: SEO & Schema ✓ DONE
- 6.1 BreadcrumbList on: about, blog, case-studies, catalog, contact, faq, glossary, media, research, services ✓
- 6.2 CollectionPage on blog + case-studies ✓
- 6.3 WebApplication schema on all 6 app pages ✓
- 6.4 Testimonial image + URL support in schema ✓

## Phase 7: Case Studies & Testimonials ✓ DONE
- 7.1 Portfolio link cards with screenshots ✓
- 7.2 Testimonial images + URLs processed in carousel ✓
- 7.3 `t.body` safety check added ✓

## Phase 8: Cleanup ✓ DONE
- 8.1 Removed blog-prompts (6 files) ✓
- 8.2 Removed archive (5 old components) ✓
- 8.3 Removed duplicate JSX in public/apps/ ✓

## Final: Copy-writing pass ⏳ PENDING
- All `.md` content files, `site-config.ts` copy review needed
