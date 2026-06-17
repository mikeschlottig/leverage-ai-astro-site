---
title: "PRD + Dispatch Spec — Phase 3: Copywriting + Service Pages"
status: dispatch-ready
owner: Mike Schlottig
created: 2026-06-17
repo: github.com/mikeschlottig/leverage-ai-astro-site
canonical_worktree: /home/mikes/leverage-ai-astro-site
branch: feat/phase-3-copy-services
executor: Pi harness + OpenCodeGO (coding model for TS/Astro; strong model for copy)
validator: 2nd agent (Haiku/Gemini) before report-done
---

# Phase 3 — Copywriting + Service Pages

Source: `SITE_IMPROVEMENT_PLAN.md` Phase 3 + brief `leverageai-network-schema-package (1).html`
("Solo Founder Reframe" section) + Mike's pricing ladder (2026-06-17).

## Goal
Close the biggest GEO gap (thin service pages) and replace team-voice "we" with the
solo-founder positioning, with real pricing, on the highest-converting pages on the site.

## In scope
- Reframe we→I in first-party marketing copy (4 service md + `about.astro` + `services.astro`).
- Expand 4 service md to 900+ words each, H2s phrased as questions.
- 3-tier pricing ladder, public, as a reusable Packages component on service pages.
- FAQPage schema wired into `/services/[slug]` route, sourced from frontmatter `faqs[]`.

## Out of scope (do NOT touch)
- Testimonials, case-study client quotes, blog post bodies (Phase 4) — leave their "we".
- Prod deploy / GBP. Preview-version deploy only; no prod promotion until Mike approves.
- Schema `@graph` architecture beyond adding FAQPage + real Offer pricing.

---

## A. Voice reframe — "we" → "I / Mike"

Solo studio. "we" implies a team that doesn't exist and kills the real differentiator:
one person, full-stack, AI-multiplied, no account manager. Apply this BEFORE/AFTER table
(verbatim from brief) as the tone reference — rewrite all first-party team-voice copy to match:

| Current (we-based) | Reframe (solo + leverage) |
|---|---|
| "We are a team of strategists, designers, and technologists…" | "I'm Mike Schlottig — a systems architect and full-stack developer who runs this studio solo, using AI tooling to deliver what agencies charge 10× more for." |
| "We partner with forward-thinking companies…" | "I work directly with Oregon business owners who want real technical work, not agency fluff." |
| "Our team delivers measurable impact." | "I built the systems. I wrote the schema. I optimized the GBP. You're talking to the person who did the work." |
| "We architect digital experiences that dominate…" | "I architect systems that make your business findable in 2026 — in Google, in ChatGPT, in Perplexity. The tools have changed. The results still have to be real." |

Differentiator to own: "One person. Full-stack. AI-multiplied. No account manager in the
middle. You talk directly to the person building your infrastructure."

Rules:
- First-person singular ("I", "my", "me"); "Leverage AI" / "the studio" where a noun is needed.
- Keep service-process language credible — "I run a citation audit", not royal-we.
- Display name **Mike Schlottig** everywhere. Do NOT introduce "Jon" anywhere visible.
- Do NOT rewrite quotes attributed to clients/testimonials.

## B. Service-page depth (4 files, 900+ words each)

Files (current word counts):
- `src/content/services/ai-search-optimization.md` (458)
- `src/content/services/brand-architecture.md` (480)
- `src/content/services/data-analytics.md` (411)
- `src/content/services/design-strategy.md` (427)

Each must, after rewrite:
1. Be **900+ words** of body content (the route already renders title/tagline/TL;DR from frontmatter — don't duplicate those).
2. Use **H2 headings phrased as questions** the buyer/AI would ask, e.g.
   `## What is AI Search Optimization?`, `## How long until I see results?`,
   `## What's included?`, `## Why does this work?`, `## What does it cost?`.
3. Be specific and accurate — real GEO mechanics (entity clarity, JSON-LD schema,
   direct-answer architecture, third-party corroboration, AI-crawler accessibility,
   citation monitoring). No invented stats beyond the existing `heroStat` framing. No slop.
4. Move FAQ out of the markdown body into frontmatter (see D). The body may keep a short
   "What does it cost?" H2 that points readers to the Packages block the route renders.

## C. Pricing ladder (public) — Packages component

Three tiers (exact):

**Tier 1 — AI Search Diagnostic** · **$500 one-time**
Foot-in-the-door. Deep-dive AI visibility audit (how ChatGPT/Perplexity/Gemini see the brand),
the Blueprint (step-by-step roadmap to restructure site data for LLM comprehension),
competitor snapshot (top 3 local competitors stealing AI citations).
Hook: full $500 credit toward either execution package within 14 days.

**Tier 2 — AI Foundation & Growth** · **$1,500 setup + $500/mo** (core MRR)
Architecture overhaul (custom JSON-LD schema, direct-answer architecture, UI/UX optimization);
AI Content Engine — 2× entity-optimized assets/mo; Proprietary Network Injection — schema-optimized
placement in the 9,700-node Oregon SMB Directory for priority indexing; Active Entity Signals —
automated review outreach + AI responses ("algorithmic heartbeat").

**Tier 3 — Market Dominance Protocol** · **$2,500 setup + $1,500/mo**
Everything in 1 & 2, plus Semantic Location Clustering (10 geo-targeted service pages),
Competitor Threat Dashboard (real-time vs top 5 local), Gap-Targeting Strategy (steal
competitors' top keywords), Conversion Analytics (AI traffic → booked leads).

Implementation:
- New component `src/components/Packages.astro` (static, no client JS — match existing
  inline-style design language: `hsl(38 80% 55%)` accent, `var(--font-heading)`, dark surfaces).
- 3 cards, Tier 2 visually highlighted as recommended. Each: name, price line, one-line pitch, bullet list, CTA → `/contact`.
- Render it in `src/pages/services/[slug].astro` after `<Content />`, before/replacing the
  existing generic CTA grid, with a per-page intro line (frontmatter-driven or a simple prop).
- Positioning frame above the cards: "Custom-scoped, solo + AI delivery — roughly 1/10th
  agency pricing for equivalent technical work."

## D. FAQPage schema (route + frontmatter)

1. `src/content.config.ts` — add to the `services` schema:
   ```ts
   faqs: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
   ```
2. Each service md frontmatter gets `faqs:` (4–6 Q&As; migrate existing body FAQ + add depth).
3. `src/pages/services/[slug].astro`:
   - `import { ..., faqNode } from '../../lib/schema'` (already imports graph/serviceNode/webPageNode/breadcrumbNode).
   - Build `faqNode(\`${siteConfig.url}${servicePath}#faq\`, entry.data.faqs ?? [])` and add to the `graph(...)` ONLY when `entry.data.faqs?.length`.
   - Render a visible FAQ `<section>` from `entry.data.faqs` (questions as `<h3>`, answers in
     `.faq-answer` for Speakable consistency). Visible content MUST match schema text.
4. `src/lib/schema.ts` `serviceNode` — replace the generic empty `priceSpecification` with a
   real low-price anchor reflecting Tier 1 entry: `price: '500'`, `priceCurrency: 'USD'`,
   and keep `availability: InStock`. Add an `offers` array only if clean; otherwise minimal valid Offer with the $500 anchor + description noting tiered project/retainer pricing. Keep it valid per validator.schema.org.

## Right / wrong

WRONG (team voice, thin, no schema source):
```md
## What We Do
We run your brand through ChatGPT... Our team builds a strategy.
```
RIGHT (solo voice, question H2, specific):
```md
## How do I get your brand cited by AI?
I start every engagement with a citation audit — I run your brand, your competitors,
and your target queries through ChatGPT, Perplexity, and Gemini and document exactly
what each system says, omits, and gets wrong. From there I rebuild entity signals,
JSON-LD schema, and direct-answer architecture so the models can parse and trust you.
```

## Constraints
- Branch `feat/phase-3-copy-services` off `main`. No force-push. No direct main merge.
- `astro build` must pass clean. TypeScript strict.
- No `.orig` files created. No `any`, no TODOs, no stubs.
- Visible FAQ text must byte-match the schema `faqs` text (Rich Results requires it).

## Report-back contract (executor → CLAUDE_DIGEST.md + MANIFEST.json)
- Files changed (full absolute paths) + word count per service md (prove ≥900).
- Confirmation: `astro build` exit 0; no `.orig`; no "Jon" in visible output.
- The rendered `@graph` for one service page (so validation can run).
- Anything skipped or uncertain, stated explicitly.
