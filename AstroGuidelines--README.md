AstroGuidelines

**Astro Framework Version 6: Exhaustive Research Report and Developer’s Guide**  
**Current as of April 15, 2026**

Astro is a modern, content-first web framework designed for building fast, high-performance websites and applications with a focus on developer experience, partial hydration (via the “Islands” architecture), and seamless integration of multiple UI frameworks. As of April 15, 2026, **Astro v6** is the current stable release (initially launched March 10, 2026, with patch updates such as 6.1.7).

This report synthesizes the official Astro documentation, release announcements, and upgrade resources to provide a complete overview and practical developer’s guide. All information is drawn directly from official sources and reflects the framework’s state post-v6 stable release.

### 1. Introduction to Astro and Its Core Philosophy

Astro emphasizes **zero JavaScript by default** on the client side unless explicitly needed. It ships minimal JavaScript, uses islands for interactive components, and excels at content-heavy sites (blogs, marketing pages, documentation, e-commerce, etc.). Key architectural pillars include:

- **File-based routing** from the `src/pages/` directory.
- **Component-based authoring** with `.astro` files (HTML-like syntax with scoped styles and TypeScript support).
- **Multi-framework support** (React, Vue, Svelte, Solid, etc.) via official integrations.
- **Content Layer API** for type-safe, scalable content handling.

Astro supports **static site generation (SSG)** by default, **server-side rendering (SSR)** via adapters, and hybrid rendering. It is unopinionated yet highly configurable.

### 2. Astro v6 Release Highlights (March 10, 2026)

Astro 6 represents a major evolution focused on **runtime consistency**, **developer productivity**, and **new first-class APIs**. The headline changes include:

- **Redesigned `astro dev` server** using Vite’s Environment API. The dev server now runs the *actual production runtime* (Node, Cloudflare Workers, etc.), eliminating “works in dev, breaks in prod” issues. The build pipeline was also refactored for shared code paths.
- **Improved Cloudflare support** (via official partnership): The `@astrojs/cloudflare` adapter now runs `workerd` locally in dev, prerendering, and production, with full bindings (KV, D1, R2, Durable Objects) available without workarounds.
- **Built-in Fonts API** (stable) — simplifies font optimization, preloading, and fallbacks with zero manual configuration.
- **Live Content Collections** (stable) — request-time content fetching via the unified Content Layer, perfect for dynamic/externally-hosted data.
- **Content Security Policy (CSP) API** (stable) — unified CSP handling for static and dynamic pages across all adapters.
- **Dependency upgrades**: Vite 7, Shiki 4, Zod 4; **Node.js 22+ required** (Node 18/20 dropped).
- **Experimental features**:
  - Rust Compiler (`@astrojs/compiler-rs`) — faster `.astro` compilation.
  - Queued Rendering — up to 2× faster rendering with lower memory usage.
  - Platform-agnostic Route Caching — web-standard caching for SSR responses.

Full release notes and blog post are available in the official announcement.

### 3. Getting Started and Installation

The fastest way to start a new Astro project (v6) is:

```bash
npm create astro@latest
```

This launches the interactive CLI wizard. You can also:

- Clone an existing Astro GitHub repo.
- Manually install via `npm install astro`.

Run the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the build:

```bash
npm run preview
```

Official starter themes and the introductory blog tutorial are available via the docs.

### 4. Project Structure (Standard v6 Layout)

Typical structure:

```
my-project/
├── src/
│   ├── components/     # Reusable .astro / framework components
│   ├── content/        # Markdown, MDX, JSON, etc. (build-time)
│   ├── live.config.ts  # Live collections (v6+)
│   ├── pages/          # File-based routing
│   ├── styles/         # Global CSS
│   └── env.d.ts        # TypeScript declarations
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

### 5. Configuration (`astro.config.mjs`)

Astro configuration is highly flexible. Key v6 additions include `fonts` and `security.csp`:

```js
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  site: 'https://example.com',
  base: '/blog',
  trailingSlash: 'never',
  output: 'server',           // or 'static' (default)
  adapter: cloudflare(),      // example adapter

  // v6: Fonts API
  fonts: [
    {
      name: 'Roboto',
      cssVariable: '--font-roboto',
      provider: fontProviders.fontsource(),
    },
  ],

  // v6: CSP API
  security: {
    csp: {
      algorithm: 'SHA-512',
      directives: ["default-src 'self'", "img-src 'self' https://cdn.example.com"],
    },
  },

  integrations: [
    // see Integrations section
  ],
});
```

Other common options: `redirects`, `experimental` flags (e.g., `rustCompiler: true`, `queuedRendering`), and adapter-specific settings.

### 6. Routing

Astro uses **file-based routing** in `src/pages/`. Static files become routes automatically. Dynamic routes use bracket syntax (`[slug].astro`).

- **Static generation** (default): Use `export async function getStaticPaths()` to define paths at build time.
- **SSR / on-demand**: No `getStaticPaths()` needed; data is fetched at request time.
- Rest parameters (`[...slug]`) and nested dynamic routes are fully supported.
- Redirects and rewrites are configurable in `astro.config.mjs` or via `Astro.redirect()` / `Astro.rewrite()`.
- Route priority rules are clearly documented (static > dynamic, etc.).

### 7. Astro Components and UI Frameworks

`.astro` files are the primary authoring format: HTML-first with frontmatter for JS/TS logic, scoped CSS, and built-in support for slots, props, and client directives (`client:load`, `client:visible`, etc.).

Astro natively supports React, Vue, Svelte, Solid, Preact, Lit, and more via official integrations. You can mix frameworks in the same project with zero client-side JS overhead unless islands are used.

### 8. Content Collections (Major v6 Enhancement: Live Collections)

Content Collections remain the recommended way to manage structured content. v6 introduces **Live Content Collections** alongside the existing build-time collections.

**Build-time collections** (`src/content.config.ts`):

- Use `glob()` or `file()` loaders (or custom loaders).
- Zod schemas for validation and TypeScript types.
- `getCollection()`, `getEntry()`, `render()` APIs.

**Live collections** (`src/live.config.ts`, new in v6):

- Defined with `defineLiveCollection()`.
- Data fetched at request time (requires SSR adapter).
- Perfect for CMS, databases, real-time data.
- APIs: `getLiveCollection()`, `getLiveEntry()` (returns `{ entry, error }` tuple for robust error handling).

Both types coexist and share the same querying/rendering APIs where possible. MDX and image optimization are available only for build-time collections.

### 9. Styling, Images, and Assets

- **CSS**: Scoped by default; global styles via `is:global`; Tailwind, CSS Modules, etc., via integrations.
- **Images**: `<Image />` and `<Picture />` components with automatic optimization.
- **Fonts** (v6): Use the new `fonts` config + `<Font />` component for automatic preloading, caching, and fallbacks.

### 10. Security

v6’s **CSP API** provides a unified way to set Content Security Policy headers for both static and SSR pages. Astro automatically hashes inline scripts/styles when enabled.

### 11. Integrations and Astro DB

Integrations are installed via `npx astro add <name>` or manually in `astro.config.mjs`. Official integrations include React, Tailwind, MDX, Sitemap, Partytown, and all major hosting adapters.

**Astro DB** is a fully-managed SQL database (libSQL-compatible) built for Astro — ideal for small-to-medium data needs with zero-ops local development.

### 12. Development, Building, and Performance

- `astro dev` in v6 is production-runtime accurate.
- Experimental **Rust Compiler** and **Queued Rendering** deliver significant speedups.
- **Route Caching** (experimental) uses web-standard semantics and integrates with Live Collections.

### 13. Deployment

Astro supports static hosting (any static host) or SSR via adapters (`@astrojs/node`, `@astrojs/vercel`, `@astrojs/cloudflare`, Netlify, etc.). Many platforms support both modes out of the box.

### 14. Upgrading to Astro v6 (Developer Migration Guide)

Use the official automated tool:

```bash
npx @astrojs/upgrade
```

**Major breaking / required changes**:

- Node.js 22+ required.
- Vite 7+ (and update any Vite plugins).
- Zod 4: Import from `astro/zod`; update schema APIs (e.g., `z.email()` instead of `z.string().email()`).
- Content collections must use the Content Layer API (legacy flag available temporarily).
- Deprecated: `Astro` object inside `getStaticPaths()`, `import.meta.env.ASSETS_PREFIX`, old `astro:schema`/`astro:content` Zod exports.
- Cloudflare adapter has significant updates.

Full migration details and code examples are in the official upgrade guide.

### 15. Developer Best Practices and Tips (v6 Edition)

- Prefer **build-time collections** for performance; use **Live Collections** only when data must be fresh per request.
- Always define Zod schemas for type safety and editor IntelliSense.
- Use the new Fonts and CSP APIs for modern security and performance.
- Enable experimental features (Rust compiler, queued rendering) in staging to test performance gains.
- Leverage `Astro.rewrite()` and route caching for advanced SSR patterns.
- Keep client JavaScript minimal — islands only where interactivity is required.
- Monitor the official integrations directory and GitHub releases for community updates.
- Use `npx @astrojs/upgrade` regularly and review the changelog for patch releases.

### 16. API Reference Highlights

- **Core**: `astro:content`, `astro:zod`, `astro:config`, `Astro` global in `.astro` files.
- **Routing/Reference**: `getStaticPaths`, `Astro.params`, `Astro.url`, etc.
- Full references for configuration, content loaders, integrations API, and adapters are available in the official docs.

### Conclusion and Resources

Astro v6 solidifies the framework as one of the most performant and developer-friendly options for content-driven websites while adding powerful new primitives (Fonts, CSP, Live Collections) and a vastly improved development runtime. The redesigned dev server and experimental performance tools position Astro for continued growth into 2026 and beyond.

**Official Sources (cited throughout)**:

- Astro v6.0 Blog Post (March 10, 2026)
- Upgrade to Astro v6 Guide
- Content Collections Documentation
- Routing, Integrations, and Deployment Guides
- https://docs.astro.build/ (live v6 documentation)

For the absolute latest patches, consult the GitHub changelog (`withastro/astro`) and run `npx @astrojs/upgrade`. The framework’s documentation is excellent, regularly updated, and includes interactive examples and migration helpers.

This report serves as both a research overview and a ready-to-use developer handbook for Astro v6 projects as of April 15, 2026. Happy building!

**Live Content Collections in Astro v6: Deep Exploration and Developer Guide**  
**Current as of April 15, 2026**

Live Content Collections represent one of the most significant advancements in Astro v6 (stable since March 10, 2026). They extend Astro’s unified Content Layer API to support **runtime (request-time) data fetching** while preserving the familiar, type-safe collection metaphor used for build-time content. This enables real-time updates from CMSs, APIs, databases, or any remote source—without requiring a rebuild or redeploy.

This guide draws directly from the official Astro documentation (Content Collections guide, astro:content module reference, and Content Loader API reference) for complete accuracy.

### 1. What Are Live Content Collections?

A **live content collection** is a set of related, structurally identical data fetched **at request time** rather than build time. Each item is an **entry** with a unique `id` and shared schema.

> “Live content collections fetch their data at runtime rather than build time. This allows you to access frequently updated data from CMSs, APIs, databases, or other sources using a unified API, without needing to rebuild your site when the data changes.”

They coexist seamlessly with traditional **build-time collections** (defined in `src/content.config.ts`). You can mix both in one project—e.g., use build-time for static blog posts and live for product inventory or user-generated content.

Live collections require an **SSR adapter** (or `output: 'server'` / hybrid mode) because data is fetched dynamically. They do **not** support MDX rendering or built-in image optimization (those remain exclusive to build-time collections).

### 2. Key Differences from Build-Time Collections

The design philosophy keeps the APIs intentionally familiar while making runtime behavior explicit:

| Aspect             | Build-Time Collections (`content.config.ts`) | Live Collections (`live.config.ts`)                           |
| ------------------ | -------------------------------------------- | ------------------------------------------------------------- |
| **Data Fetching**  | Build time; stored in persistent layer       | Request time; ephemeral per request                           |
| **Config File**    | `src/content.config.ts`                      | `src/live.config.ts`                                          |
| **Definition**     | `defineCollection()` + single `load()`       | `defineLiveCollection()` + `loadCollection()` / `loadEntry()` |
| **Query APIs**     | `getCollection()`, `getEntry()`              | `getLiveCollection()`, `getLiveEntry()`                       |
| **Data Return**    | Stored & cached                              | Returned directly                                             |
| **Schema / Types** | Zod schema (full support)                    | Zod schema (optional but recommended)                         |
| **MDX / Images**   | Fully supported                              | Not supported                                                 |
| **Error Handling** | Build-time failures                          | Explicit runtime `{ error }` tuples                           |
| **Caching**        | Automatic (build)                            | Loader-provided `cacheHint` + route/HTTP caching              |
| **Performance**    | Highest (static)                             | Trade-off for freshness                                       |

> “We suggest using build-time content collections whenever possible, and using live collections when your content needs updating in real time and the performance tradeoffs are acceptable.”

### 3. Project Setup

1. Ensure your project uses Astro v6+ and an SSR adapter (e.g., `@astrojs/node`, `@astrojs/vercel`, `@astrojs/cloudflare`).
2. Create `src/live.config.ts` (TypeScript recommended).
3. Run `astro dev` or `astro build`—Astro automatically detects and types the live collections.

No additional flags or experimental options are needed in v6 (the feature is stable).

### 4. Defining Live Collections (`defineLiveCollection()`)

Import from `'astro:content'` and define collections in `src/live.config.ts`:

```ts
// src/live.config.ts
import { defineLiveCollection } from 'astro:content';
import { z } from 'astro/zod';

// Example custom loader (see section 5)
import { productsLoader } from '../loaders/products-loader';

const products = defineLiveCollection({
  loader: productsLoader({
    apiKey: process.env.STORE_API_KEY!,
    endpoint: 'https://api.example.com/v1/products',
  }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    category: z.string(),
    inStock: z.boolean(),
    lastUpdated: z.coerce.date(),
  }).transform((data) => ({
    ...data,
    formattedPrice: `$${(data.price / 100).toFixed(2)}`,
  })),
});

export const collections = { products };
```

- **`loader`** (required): A `LiveLoader` instance.
- **`schema`** (optional but strongly recommended): Zod schema for runtime validation + full TypeScript inference.

### 5. Creating Custom Live Loaders (The Core of Live Collections)

Unlike build-time collections, **no built-in live loaders** ship with Astro. You must create (or install third-party) loaders using the **Live Loader API**.

A live loader is a function that returns a `LiveLoader` object:

```ts
import type { LiveLoader } from 'astro/loaders';

export function myLoader(config: { apiKey: string; endpoint: string }): LiveLoader<
  MyDataType,           // TData
  EntryFilterType,      // TEntryFilter
  CollectionFilterType, // TCollectionFilter
  MyCustomError         // TError (optional)
> {
  return {
    name: 'my-loader',   // Unique name for logging

    loadCollection: async ({ filter }) => {
      // filter is typed by CollectionFilterType
      try {
        const data = await fetch(`${config.endpoint}?${new URLSearchParams(filter)}`, {
          headers: { Authorization: `Bearer ${config.apiKey}` },
        }).then(r => r.json());

        return {
          entries: data.map((item: any) => ({
            id: item.id,
            data: item,
            // Optional per-entry cache hint
            cacheHint: { lastModified: new Date(item.updatedAt) },
          })),
          cacheHint: { tags: ['products', `category-${filter?.category}`] },
        };
      } catch (err) {
        return { error: new Error('Failed to load collection', { cause: err }) };
      }
    },

    loadEntry: async ({ filter }) => {
      // filter can be string ID or object (typed by EntryFilterType)
      try {
        const item = await fetchSingleItem(config, filter);
        if (!item) return { error: new Error('Entry not found') };
        return {
          id: item.id,
          data: item,
          rendered: item.htmlContent ? { html: item.htmlContent } : undefined,
          cacheHint: { lastModified: new Date(item.updatedAt) },
        };
      } catch (err) {
        return { error: new Error('Failed to load entry', { cause: err }) };
      }
    },
  };
}
```

**Key Methods** (from official Live Loader API):

- **`loadCollection(context: LoadCollectionContext<TCollectionFilter>)`** → `Promise<LiveDataCollection<TData> | { error: TError }>`
- **`loadEntry(context: LoadEntryContext<TEntryFilter>)`** → `Promise<LiveDataEntry<TData> | undefined | { error: TError }>`

**Cache Hints** (`CacheHint`):

- `tags?: string[]` (for fine-grained invalidation)
- `lastModified?: Date`

Custom error classes and typed filters are fully supported for IDE IntelliSense.

### 6. Querying Live Data

Use the dedicated runtime APIs (imported from `'astro:content'`):

```ts
// src/pages/products/[id].astro
---
import { getLiveCollection, getLiveEntry } from 'astro:content';

const { entries: allProducts, error: collectionError } = await getLiveCollection('products', {
  category: 'electronics',   // typed filter
});

const { entry: singleProduct, error: entryError } = await getLiveEntry('products', Astro.params.id);
// OR object filter: await getLiveEntry('products', { sku: 'ABC-123' });
---
```

Return shapes:

- `getLiveCollection()` → `LiveDataCollectionResult` → `{ entries?, error?, cacheHint? }`
- `getLiveEntry()` → `LiveDataEntryResult` → `{ entry?, error?, cacheHint? }`

### 7. Error Handling

Errors are **always explicit**—never thrown by default. Check the `error` property:

```ts
const { entry, error } = await getLiveEntry('products', id);

if (error) {
  if (error instanceof LiveEntryNotFoundError) {
    Astro.response.status = 404;
    return; // or Astro.rewrite('/404')
  }
  // Handle LiveCollectionValidationError, custom loader errors, etc.
  Astro.redirect('/error');
}
```

Built-in error types include `LiveEntryNotFoundError`, `LiveCollectionValidationError`, and generic `LiveCollectionError`.

### 8. Rendering Live Content

If your loader returns a `rendered: { html: string }` property:

```ts
const { entry } = await getLiveEntry('articles', id);
const { Content } = await render(entry);   // from 'astro:content'
```

```astro
<Content />
```

### 9. Caching & Performance

- Loaders can return `cacheHint` → integrate with Astro’s route caching, HTTP headers (`Cache-Control`), or platform-specific caches (e.g., Cloudflare).
- Use `Astro.cache` APIs or adapter features to respect hints.
- **Recommendation**: Prefer build-time collections for static/frequently-read data. Use live collections only where freshness is required. Combine with route caching for hybrid wins.

### 10. Best Practices & When to Use

**Use Live Collections when**:

- Data changes frequently (inventory, pricing, news, user content).
- Real-time accuracy matters.
- You want the unified collection API + type safety instead of raw `fetch()` calls.
- Personalization or dynamic filtering per request is needed.

**Avoid when**:

- Data is static or changes infrequently (use build-time instead).
- You need MDX or `<Image />` optimization.
- Performance is ultra-critical and you can’t afford per-request latency.

**Tips**:

- Keep loaders lightweight—use connection pooling / caching inside the loader where possible.
- Define reusable loader packages (publishable NPM modules).
- Combine with Astro DB or external DBs for hybrid patterns.
- Test thoroughly in `astro dev` (now production-accurate runtime).

### 11. Limitations (as of v6)

- Requires SSR/hybrid output.
- No built-in loaders (custom only).
- No MDX/image support.
- Data is not persisted across requests (intentional).
- Schema validation happens at runtime (small overhead).

### 12. Full Working Example (Products + CMS)

See official examples in the docs for complete end-to-end patterns (CMS, e-commerce API, etc.).

Live Content Collections unify Astro’s content story: **static speed where possible, live freshness where needed**—all with one consistent, type-safe API. They eliminate the “rebuild to update content” pain point while keeping developer experience first-class.

**Official Sources** (cited above):

- [Content Collections Guide](https://docs.astro.build/en/guides/content-collections/)
- [astro:content API Reference](https://docs.astro.build/en/reference/modules/astro-content/)
- [Content Loader API Reference](https://docs.astro.build/en/reference/content-loader-reference/)

For the absolute latest details, always consult `docs.astro.build` or run `npx @astrojs/upgrade`. This feature is ready for production use in Astro v6. Happy building with live data!