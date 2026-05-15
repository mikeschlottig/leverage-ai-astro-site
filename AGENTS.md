# Leverage AI — Astro v6.1+ Editing Guide for AI Agents

## Quick Navigation

| Content Type | Content File | Config / Navigation | Images | Page Template |
|---|---|---|---|---|
| Blog Posts | `src/content/blog/<slug>.md` | — | `public/images/blog/` | `src/pages/blog/[slug].astro` |
| Case Studies | `src/content/case-studies/<slug>.md` | `portfolioConfig.items` in `site-config.ts` | `public/images/case-studies/` | `src/pages/case-studies/[slug].astro` |
| Services | `src/content/services/<slug>.md` | `servicesConfig.services` in `site-config.ts` | `public/images/services/` | `src/pages/services/[slug].astro` |
| Catalog Items | `src/content/items/<slug>.md` | `portfolioConfig.items` in `site-config.ts` | — | `src/pages/catalog.astro` |
| Testimonials | `src/content/testimonials/<slug>.md` | — | — | Homepage `index.astro` |
| Apps (full pages) | `src/pages/apps/<name>.astro` + `src/components/apps/<Name>.{jsx,tsx}` | `portfolioConfig.items` + `src/content/items/<name>.md` | — | See `src/pages/apps/pulse-chat.astro` |
| Research Reports | Hardcoded in `src/pages/research/index.astro` | — | — | Inline in single page |
| Media/Audio | Hardcoded in `src/pages/media.astro` | — | `public/media/` | — |

---

## Project Architecture (Must-Know)

- **Astro v6.1.7** with `output: 'server'` (SSR) + Cloudflare adapter (`@astrojs/cloudflare` v13)
- **React Islands**: Components in `src/components/` with `client:load`, `client:visible`, or `client:only` directives
- **Tailwind CSS** but with `applyBaseStyles: false` — base styles in `src/styles/global.css`
- **Content Collections** via `src/content.config.ts` — all schema validation is there
- **Single source of truth**: `src/lib/site-config.ts` controls navigation, services, portfolio, hero, metrics, footer, contact, about — NEVER hardcode these in components
- **All images** are in `public/images/` — referenced as absolute paths like `/images/blog/foo.jpg` — DO NOT use Astro's `<Image />` component or `src/assets/`
- **No `getStaticPaths()` needed** — the site is fully SSR

---

## CRITICAL: Astro v6 API Changes

```astro
---
// ✅ CORRECT (Astro v6+):
import { getCollection, render } from 'astro:content';
const entry = (await getCollection('blog')).find(p => p.id === slug);
const { Content } = await render(entry);

// ❌ WRONG (will break — this is the Astro v5 API):
// const { Content } = await entry.render();
---
```

| Do NOT use | Use instead |
|---|---|
| `entry.render()` | `render(entry)` from `astro:content` |
| `z from 'zod'` | `z from 'astro/zod'` |
| `getEntryBySlug()` | `getCollection().find()` |

---

## Content Collection Schemas (from `src/content.config.ts`)

### Blog `src/content/blog/<slug>.md`
```yaml
---
title: string
excerpt: string
date: "YYYY-MM-DD"
category: string
image: "/images/blog/<filename>.jpg"
featured: boolean          # optional — first featured post gets hero card
author: string             # optional
readingTime: string        # optional — e.g. "8 min read"
tags: [string, ...]        # optional
ogImage: string            # optional — defaults to image
tldr: [string, ...]        # optional — TL;DR bullets shown before content
---
```

### Case Studies `src/content/case-studies/<slug>.md`
```yaml
---
title: string
client: string
industry: string
services: [string, ...]    # e.g. ["AI Search Optimization", "Brand Architecture"]
image: "/images/case-studies/<filename>.svg"
featured: boolean          # optional
order: number              # sort order on listing page
results:
  primary: string          # e.g. "300% increase in AI search citations"
  secondary: string        # optional
tags: [string, ...]        # optional
date: "YYYY-MM-DD"         # optional
---
```

### Services `src/content/services/<slug>.md`
```yaml
---
title: string
slug: string               # MUST match the URL slug e.g. "ai-search-optimization"
tagline: string
description: string
icon: string               # one of: Search, Palette, Globe, BarChart3
order: number
featured: boolean           # optional
heroStat: string            # optional — e.g. "300%"
heroStatLabel: string       # optional — e.g. "average increase in AI citations"
image: "/images/services/<filename>.svg"
tags: [string, ...]        # optional
---
```

### Catalog Items `src/content/items/<slug>.md`
```yaml
---
name: string
description: string
category: string           # grouped on /catalog
image: "/images/services/<filename>.svg"
url: string                # e.g. "/apps/pulse-chat" or external URL
badge: string              # optional — e.g. "Web App", "Coming Soon"
order: number
featured: boolean           # optional
tags: [string, ...]        # optional
---
```

### Testimonials `src/content/testimonials/<slug>.md`
```yaml
---
name: string
role: string
rating: number             # 1-5
order: number
image: string              # optional
url: string                # optional
---
```

---

## Common Editing Tasks

### 1. Adding a Blog Post

1. **Create the markdown file** at `src/content/blog/<kebab-case-slug>.md`
2. **Add the thumbnail image** to `public/images/blog/<filename>.jpg` (16:9 ratio, ~1200×675px)
3. **Add an optional OG image** to `public/images/blog/<filename>-og.svg` (1200×630px, SVG preferred)
4. That's it — the `[slug].astro` page renders it dynamically. No routing changes needed.

### 2. Adding a Case Study

**Two steps** (the case study itself + optionally linking it to the portfolio):

**Step 1 — Create the content file:**
`src/content/case-studies/<slug>.md` with the schema above.
Image goes in `public/images/case-studies/<filename>.svg`

**Step 2 — Optionally link it in the portfolio section:**
Add an entry to `portfolioConfig.items` in `src/lib/site-config.ts`:
```typescript
{
  id: '<kebab-case-id>',
  title: '<Client Name> — <Tagline>',
  type: 'website' as const,
  description: '<2-sentence description>',
  image: '/images/services/<icon>.svg',
  url: '/case-studies/<slug>',
  tags: ['<Tag1>', '<Tag2>'],
  status: 'live' as const,
  badge: 'Case Study',
},
```

To make it the **featured case study** on the homepage, update `metricsConfig.featuredCaseStudy` in `site-config.ts`.

### 3. Adding a Service Category Page

**Step 1 — Create the content file:**
`src/content/services/<slug>.md` with the schema above.
Image goes in `public/images/services/<filename>.svg`
The `slug` field must match the URL path

**Step 2 — Update `servicesConfig` in `src/lib/site-config.ts`:**
Add to `servicesConfig.services` array:
```typescript
{
  id: '<kebab-case-id>',
  icon: '<IconName>',              // Pick from: Search, Palette, Globe, BarChart3 (Lucide icons)
  title: '<Service Name>',
  description: '<2-sentence description>',
  details: ['<Detail 1>', '<Detail 2>', '<Detail 3>', '<Detail 4>'],
},
```

**Step 3 — Update navigation** if needed in `navigationConfig.navLinks` in `site-config.ts`:
```typescript
{
  label: 'Services',
  href: '/services',
  children: [
    { label: '<Service Name>', href: '/services/<slug>' },
    // ... existing services
  ],
},
```

### 4. Adding a Catalog / App Item

**Three steps:**

**Step 1 — Create the content collection entry:**
`src/content/items/<slug>.md`

**Step 2 — Create the app page (if it needs a dedicated page):**
`src/pages/apps/<slug>.astro` — follow the pattern from `pulse-chat.astro` or `crm.astro`:
- Import the React component from `src/components/apps/<Name>.{jsx,tsx}`
- Use `BaseLayout` with breadcrumb + WebApplication JSON-LD
- Render the React component with `<Component client:only="react" />`

**Step 3 — Add to `portfolioConfig.items` in `site-config.ts`**

### 5. Adding Images / Thumbnails

- **Location**: `public/images/<category>/<filename>.<ext>`
- **Categories**: `blog/`, `services/`, `case-studies/`
- **Conventions**:
  - Blog thumbnails: `public/images/blog/<post-slug>.jpg` — 16:9, ~1200×675px
  - Blog OG images (optional): `public/images/blog/<post-slug>-og.svg` — 1200×630px
  - Service icons: `public/images/services/<slug>.svg` — vector preferred
  - Case study thumbnails: `public/images/case-studies/<slug>.svg`
- **Referencing**: Always use absolute paths starting with `/images/...`
- **No import needed**: Images are served directly from `public/`, NOT imported in code
- **No optimization**: The Cloudflare adapter uses `imageService: 'compile'`, so `<img src>` is correct — do NOT use Astro's `<Image />` component

### 6. Adding Research Reports

Research reports are currently **hardcoded** in `src/pages/research/index.astro`. To add a new one:

1. **Create a new page** at `src/pages/research/<slug>.astro` following the pattern of the existing research page (ScholarlyArticle JSON-LD, sticky ToC, rich prose sections)
2. **Link to it** from the blog index (the research CTA at the bottom of `src/pages/blog/index.astro`) or from the navigation

For a simpler report, you could also create it as a content collection, but currently research lives in its own dedicated page.

### 7. Embedding Additional Apps

- **Standalone built apps** (static HTML/JS): Drop into `public/apps/<name>/` and reference via URL
- **React-powered apps**: Create `src/components/apps/<Name>.{jsx,tsx}` + `src/pages/apps/<name>.astro`
- **API-dependent apps**: Add `apiNote` to the portfolio item in `site-config.ts` to track what needs API key configuration
- Follow the three-step process from section 4 above

### 8. Adding Testimonials

Create a file at `src/content/testimonials/<name-slug>.md` with the schema above.
The `order` field controls display position. The content body is the testimonial text.
Testimonials are read in `src/pages/index.astro` and passed to the React carousel.

---

## Navigation Updates

Navigation is managed entirely in `src/lib/site-config.ts`, in the `navigationConfig` object:

```typescript
navigationConfig.navLinks: [
  { label: 'Services', href: '/services', children: [...] },
  { label: 'Case Studies', href: '/case-studies', children: [...] },
  { label: 'Media', href: '/media' },                           // simple links have no children
  { label: 'Resources', href: '/blog', children: [...] },
]
```

- `children` arrays create dropdown menus
- Simple link items (no children) render as direct links
- The footer has its own `footerConfig.linkGroups` — update that separately

---

## Images Quick Reference

| Purpose | Path Pattern | Size | Format |
|---|---|---|---|
| Blog thumbnails | `public/images/blog/<slug>.jpg` | 16:9 ~1200×675 | JPG preferred |
| Blog OG images | `public/images/blog/<slug>-og.svg` | 1200×630 | SVG preferred |
| Service icons | `public/images/services/<slug>.svg` | Vector | SVG |
| Case study thumbnails | `public/images/case-studies/<slug>.svg` | 16:9 | SVG preferred |
| Hero / misc | `public/images/<name>.jpg` | Variable | JPG or SVG |
| Logo | `public/images/leverageai-logo.webp` | — | WebP |
| Author headshot | `public/images/headshot-hat.jpg` | 80×80 | JPG |

**All images are referenced as absolute paths**: `/images/blog/my-post.jpg` (not relative, not imported)

---

## Style Conventions (DO NOT BREAK)

1. **No comments in code** — the existing codebase has section headers in `---` comment blocks but zero inline code comments in components. Match this.
2. **Inline styles** — most styling is done via inline `style` props, NOT Tailwind utility classes. Some utility classes are used for layout (e.g. `container-custom`, `section-padding`, `glass`, `fade-up`, `btn-primary`). When in doubt, use inline styles.
3. **Dark theme** — all colors use CSS variables: `var(--text-primary)`, `var(--text-secondary)`, `var(--accent)`, `var(--surface-1)`, `var(--page-bg)`, `var(--border-subtle)`, `var(--border-radius)`, etc.
4. **Typography** — headings use `var(--font-heading)`, body uses system font stack.
5. **No `zod` imports** — always import `z` from `'astro/zod'`
6. **No `render()` on entry objects** — always use `render(entry)` from `'astro:content'`
7. **No `getStaticPaths()`** — not needed for SSR mode
8. **No `src/assets/`** — all images in `public/images/`

---

## File Index (Quick Scan)

### Content Files (Create these)

| Collection | Directory | Image Directory |
|---|---|---|
| Blog | `src/content/blog/` | `public/images/blog/` |
| Case Studies | `src/content/case-studies/` | `public/images/case-studies/` |
| Services | `src/content/services/` | `public/images/services/` |
| Catalog Items | `src/content/items/` | (uses service icons) |
| Testimonials | `src/content/testimonials/` | — |

### Config Files (Edit these)

| File | Purpose |
|---|---|
| `src/content.config.ts` | Content collection schema definitions |
| `src/lib/site-config.ts` | Navigation, services, portfolio, hero, metrics, footer, contact, about |
| `src/layouts/BaseLayout.astro` | Page shell, SEO meta, JSON-LD, fonts |
| `astro.config.mjs` | Astro config — don't change unless adding integrations |

### Page Templates (Read to understand patterns)

| File | Pattern |
|---|---|
| `src/pages/blog/[slug].astro` | Blog detail page — `render(entry)`, Article JSON-LD |
| `src/pages/blog/index.astro` | Blog listing — featured post + grid |
| `src/pages/case-studies/[slug].astro` | Case study detail — `render(entry)`, CreativeWork JSON-LD |
| `src/pages/case-studies.astro` | Case study listing + portfolio |
| `src/pages/services/[slug].astro` | Service detail — `render(entry)`, Service JSON-LD |
| `src/pages/services.astro` | Services listing + detail cards |
| `src/pages/apps/pulse-chat.astro` | App page — WebApplication + FAQ JSON-LD |
| `src/pages/media.astro` | Media page — audio player |
| `src/pages/research/index.astro` | Research page — hardcoded ScholarlyArticle |
| `src/pages/catalog.astro` | Catalog listing from `items` collection |

---

## Common Gotchas

- **Forgot to add both content file + config entry**: Case studies and apps need BOTH a content collection file AND an entry in `portfolioConfig.items` in `site-config.ts`.
- **Wrong image path**: Always start from `public/` root — `/images/blog/foo.jpg` (no `public` prefix)
- **Wrong `slug` matching**: Services use `entry.data.slug === slug`, not `entry.id === slug`
- **Missing `as const` on type fields**: `type: 'website' as const` is required in `portfolioConfig.items`
- **SSR means no `getStaticPaths()`**: Dynamic routes work via `Astro.params` + `getCollection().find()`

---

## Workflow Summary

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Find the right content collection directory                  │
│ 2. Create .md file with schema-compliant frontmatter            │
│ 3. Place images in public/images/<category>/                    │
│ 4. If needed, update site-config.ts (navigation, portfolio...)  │
│ 5. Verify with `npm run build` or `astro check`                │
└─────────────────────────────────────────────────────────────────┘
```
