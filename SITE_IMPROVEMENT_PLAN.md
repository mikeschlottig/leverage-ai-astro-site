---
title: Leverage AI Site Improvement Plan
status: proposed
owner: Mike Schlottig
created: 2026-06-16
repo: github.com/mikeschlottig/leverage-ai-astro-site
canonical_worktree: /home/mikes/leverage-ai-astro-site
---

# Leverage AI — Site Improvement Plan

Source inputs: `leverageai-network-schema-package (1).html` (schema/GBP/roadmap brief)
+ live codebase recon (2026-06-16). Where the brief and the code disagree, **the code
wins** and the discrepancy is noted below.

## Ground-truth corrections to the brief

| Brief assumed | Reality in code | Impact on plan |
|---|---|---|
| About page says "Jon Schlottig" (1 spot) | "Jon" / "Jon 'Mike'" in **5+ spots**: `about.astro`, `blog/[slug].astro` (display + bio + alt), `site-config.ts` caption, image `alt` attrs | Name fix is broader; centralize the display name |
| "© 1970" is a `getFullYear()` bug in source | Source is **correct**: `site-config.ts:569` uses `© ${new Date().getFullYear()}` | "© 1970" is a **runtime/stale-deploy** symptom — must reproduce on live URL to diagnose |
| Service page needs a template (thin) | `services/[slug].astro` dynamic route **exists** (content collection) | Enhance existing route, don't scaffold |
| Blog needs author bio added | `blog/[slug].astro` **already has** an author-bio block | Fix the name + add Article `author` `@id`, don't build from scratch |
| Paste raw `<script type="application/ld+json">` blocks | BaseLayout already injects via `set:html={JSON.stringify()}` + `<slot name="head" />` | Use typed builders, not pasted strings |

Other findings: schema is currently **flat (no `@graph`), duplicated** across BaseLayout +
~8 pages, with **no Person node** and **no `@id` cross-references**. `.orig` files litter
`src/`. A **stale duplicate worktree** exists at `/home/mikes/Leverage-AI-Astro-Site`
(capitalized) on the initial commit — should be retired to avoid edit confusion.

---

## Phase 1 — Schema foundation (START HERE)

Astro v6 + schema.org best practice. Single source of truth, one `@graph` per page,
stable `@id`s, no duplication.

1. **`src/lib/schema.ts`** — typed node builders pulling NAP/socials from
   `localBusinessConfig` (NAP consistency becomes structural, not copy-paste):
   - Stable `@id`s: `#organization`, `#localbusiness`, `#website`, `/about/#person`
   - Builders: `organizationNode`, `localBusinessNode` (`["LocalBusiness","ProfessionalService"]`,
     `geo`, `openingHoursSpecification`, `areaServed`, `hasOfferCatalog`), `websiteNode`
     (+ `SearchAction`), `personNode`, `webPageNode`, `serviceNode`, `articleNode`
     (+ `SpeakableSpecification`), `faqNode`, `breadcrumbNode`, and `graph(...nodes)`.
   - **Person node**: `name: "Mike Schlottig"`, `alternateName: "Jon Schlottig"`,
     `sameAs` → LinkedIn `/in/schlottig/`, GitHub, Instagram, Medium. (Resolves the
     entity-unification problem per the earlier guidance — one display name + alternateName bridge.)
2. **BaseLayout** — inject global nodes once (Organization + LocalBusiness + WebSite) as a
   single `@graph`; keep the `head` slot for page-specific nodes.
3. **Per-page nodes via `head` slot**, all referencing global `@id`s:
   - Homepage: + WebPage + FAQPage (5 Q&As from brief)
   - `/about`: + Person + WebPage (E-E-A-T anchor)
   - `/services/[slug]`: + Service + WebPage + FAQPage (per content-collection entry)
   - `/blog/[slug]`: + Article (author `@id` → Person) + WebPage + FAQPage + Speakable
   - Case studies: + Article/`CollectionPage`
4. **Remove duplicate inline JSON-LD** from individual pages now covered centrally.
5. **Validate**: every template's rendered JSON through Rich Results Test + `validator.schema.org`
   before merge. No deploy with schema errors.

**P0 blockers folded into Phase 1** (brief says fix before any Person schema ships):
- **Name unification** → "Mike Schlottig" display everywhere (`about.astro`,
  `blog/[slug].astro` ×3, `site-config.ts` caption, `alt` attrs); `alternateName` in schema only.
- **"© 1970"** → reproduce on live/preview; if stale deploy, a fresh deploy fixes it; if a
  hydration/serialization issue in `Footer.tsx`, compute the year server-side and pass as prop.

---

## Phase 2 — Google Business Profile + NAP (Mike action, dashboard)

- **Primary category:** `Internet marketing service`
- **Secondaries:** `Marketing agency`, `Web designer`, `Search engine optimization service`,
  `Software company`, `Business to business service`
- Paste-ready GBP description (from brief).
- NAP audit: `Leverage AI LLC · 744 NW Bellevue Place · Grants Pass, OR 97526 · (541) 450-2082`
  must match byte-for-byte across site, schema, GBP, directories.
- Decision needed: public-facing email (Proton vs new branded `mike@leverageai.network`).
- Upload 5+ GBP photos (headshot, workspace, work-in-progress, Oregon exterior).

## Phase 3 — Copywriting + Service pages

- Solo-founder reframe: "we" → "I / Mike". Before/after table in brief.
- Service pages: 900+ words each, TL;DR block, H2s as questions, FAQPage schema, pricing
  indication. Biggest GEO gap on the site.

## Phase 4 — Case studies + Blog author bios

- Case studies: client/industry, before→after metrics, timeline, methods; `Article` schema
  with `datePublished`. Daley Organics: add measurable claim + evidence.
- Blog: name fix (Phase 1) + ensure every post renders visible bio **and** Article `author` `@id`.

## Phase 5 — Fix podcast/audio component

- `src/components/MediaPlayer.tsx` + `media.astro`: diagnose, fix or remove. Broken player
  hurts E-E-A-T + CWV. If kept, add `PodcastEpisode`/`AudioObject` schema.

## Phase 6 — Knowledge Base section

- Route `/knowledge-base/` (content collection), `TechArticle` schema, one AI-searchable
  question per article. Seed: "What is GEO?", "Optimizing for Google AI Overviews",
  "Which schema types matter for local business".

## Phase 7 — Industry Research section

- Route `/research/`, `Dataset`/`Report` schema. Original small studies build domain
  authority + AI citation probability.

## Cross-cutting

- Remove `.orig` cruft (archive, don't delete, per house rules).
- Retire stale capitalized worktree `/home/mikes/Leverage-AI-Astro-Site`.
- Validation gate on every phase; preview-version deploy (no prod promotion) until approved.
- Branch-per-phase; no force-push; no direct main merges without review.

## Sequencing rationale

Schema first (with P0 folded in) because: (a) it's the requested starting point, (b) it's the
foundation other phases reference (Person `@id`, Service nodes, Article author), and (c) the
brief gates Person schema on the name fix. GBP can run in parallel (dashboard, no code).
