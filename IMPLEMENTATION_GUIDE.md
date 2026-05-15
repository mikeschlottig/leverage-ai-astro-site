# Astro Production Template — Implementation Guide

A step-by-step guide to going from this template to a production-ready site.
Estimated setup time: **2–4 hours** for a complete site with your content ready.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Project Initialization](#2-project-initialization)
3. [Step 1 — Configure Site Identity](#step-1--configure-site-identity)
4. [Step 2 — Choose & Apply a Theme](#step-2--choose--apply-a-theme)
5. [Step 3 — Upload Image Assets](#step-3--upload-image-assets)
6. [Step 4 — Configure Navigation](#step-4--configure-navigation)
7. [Step 5 — Fill the Hero Section](#step-5--fill-the-hero-section)
8. [Step 6 — Configure Featured Items Showcase](#step-6--configure-featured-items-showcase)
9. [Step 7 — Configure Gallery Carousel](#step-7--configure-gallery-carousel)
10. [Step 8 — Write Brand Story Content](#step-8--write-brand-story-content)
11. [Step 9 — Add Blog Posts](#step-9--add-blog-posts)
12. [Step 10 — Add Items/Products to Catalog](#step-10--add-itemsproducts-to-catalog)
13. [Step 11 — Add Testimonials](#step-11--add-testimonials)
14. [Step 12 — Configure Contact Form](#step-12--configure-contact-form)
15. [Step 13 — Configure Footer](#step-13--configure-footer)
16. [Step 14 — Configure SEO & Local Business Schema](#step-14--configure-seo--local-business-schema)
17. [Step 15 — Fill Secondary Pages](#step-15--fill-secondary-pages)
18. [Step 16 — Build & Deploy](#step-16--build--deploy)
19. [Component Reference](#component-reference)
20. [Content Collection Reference](#content-collection-reference)
21. [Routing Reference](#routing-reference)
22. [Adding New Pages](#adding-new-pages)
23. [Common Customizations](#common-customizations)

---

## 1. Prerequisites

- Node.js 18+ (managed via Volta recommended: `volta install node@22`)
- npm or pnpm
- A domain name
- Cloudflare account (for deployment) or Netlify/Vercel

---

## 2. Project Initialization

```bash
# Copy the Template/ directory to a new project
cp -r Template/ my-new-site/
cd my-new-site/

# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:4321
```

The site will load with placeholder content. You'll fill it in step by step below.

---

## Step 1 — Configure Site Identity

**File:** `src/lib/site-config.ts`

This is the **single source of truth** for all site content. Every section below maps to a config object in this file.

Start here — update `siteConfig`:

```typescript
export const siteConfig: SiteConfig = {
  title:       'Your Brand | Your Tagline',
  description: 'Your 150-character meta description...',
  url:         'https://yourdomain.com',
  language:    'en',
  keywords:    'keyword 1, keyword 2, city, state',
  ogImage:     '/images/og-image.jpg',
  canonical:   'https://yourdomain.com',
};
```

**Also update** `astro.config.mjs`:

```js
site: 'https://yourdomain.com',
```

---

## Step 2 — Choose & Apply a Theme

**File:** `src/styles/global.css`

See `DESIGN_TOKENS_GUIDE.md` for 6 ready-to-use premium themes with copy-paste color values.

Quick swap — replace the `:root` brand variables:

```css
:root {
  --brand-500: #your-primary-color;
  --brand-400: #lighter-variant;
  --brand-600: #darker-variant;
  /* ... fill the full scale ... */

  --font-heading: 'Your Heading Font';
  --font-body:    'Your Body Font';
}
```

Also update the `@import` line with your Google Fonts URL.

---

## Step 3 — Upload Image Assets

Place all images in `public/images/`. The template expects:

| Image                     | Size                            | Path                          |
| ------------------------- | ------------------------------- | ----------------------------- |
| OG image (social sharing) | 1200×630px                      | `/images/og-image.jpg`        |
| Hero background           | 1920×1080px, dark               | `/images/hero-bg.jpg`         |
| Featured item images (3)  | 800×800px, transparent bg ideal | `/images/item-1.jpg`          |
| Gallery carousel (3)      | 1200×900px                      | `/images/gallery-1.jpg`       |
| Brand story tabs (3)      | 800×1000px                      | `/images/story-tab-1.jpg`     |
| Founder photo             | 200×200px                       | `/images/founder.jpg`         |
| About snapshot            | 1200×900px                      | `/images/story-about.jpg`     |
| Blog post images          | 1200×675px                      | `/images/blog/post-slug.jpg`  |
| Item/product images       | 800×800px                       | `/images/items/item-slug.jpg` |

**Tips:**

- Use dark, atmospheric images for backgrounds — they let text stay legible
- Compress images with [Squoosh](https://squoosh.app) before uploading
- Keep file sizes under 200KB for page speed

---

## Step 4 — Configure Navigation

**Config key:** `navigationConfig` in `site-config.ts`

```typescript
export const navigationConfig = {
  brandName:    'Your',       // First part of logo
  brandSubname: 'Brand',      // Second part (accent color)
  tagline:      'Your Tagline',

  navLinks: [
    { label: 'Home',     href: '/' },
    { label: 'Products', href: '/catalog' },
    { label: 'Blog',     href: '/blog' },
    { label: 'Contact',  href: '/#contact' },
    // Dropdown example:
    {
      label: 'Products',
      href: '/catalog',
      children: [
        { label: 'Category A', href: '/catalog#category-a' },
        { label: 'Category B', href: '/catalog#category-b' },
      ]
    },
  ],

  ctaButtonText: 'Get a Quote',
  ctaButtonHref: '/#contact',
};
```

**Smart link behavior:**

- Links starting with `/` navigate to that route
- Links starting with `#` smooth-scroll to that section ID on the current page
- Links like `'/#contact'` navigate to home then scroll to #contact

---

## Step 5 — Fill the Hero Section

**Config key:** `heroConfig` in `site-config.ts`

```typescript
export const heroConfig = {
  eyebrow:         'Est. 2018',
  headline:        'Your 6-Word Headline',
  subheadline:     'One compelling sentence that elaborates on the headline.',
  ctaButtonText:   'Get Started',
  ctaButtonHref:   '/#contact',
  ctaSecondaryText:'View Products',
  ctaSecondaryHref:'/catalog',
  backgroundImage: '/images/hero-bg.jpg',
  decorativeText:  'Your vertical side text',

  stats: [
    { value: 500, suffix: '+', label: 'Happy Customers' },
    { value: 10,  suffix: '+', label: 'Years Experience' },
    { value: 98,  suffix: '%', label: 'Satisfaction Rate' },
    { value: 50,  suffix: '+', label: 'Products' },
  ],
};
```

**Stat count-up animation:** Values animate from 0 to `value` after the preloader completes. Set `value: 0` to disable for a specific stat.

---

## Step 6 — Configure Featured Items Showcase

**Config key:** `featuredItemsConfig` in `site-config.ts`

The showcase displays 3 items in a tab layout. Update all 3 item objects:

```typescript
items: [
  {
    id:          'my-item-slug',
    badge:       'Best Seller',
    name:        'Item Name',
    tagline:     'Short descriptive phrase',
    description: '2-3 sentences about this item.',
    price:       '$XX per unit',
    image:       '/images/items/item-1.jpg',
    glowColor:   'bg-brand-900/20',  // Tailwind class — creates glow behind image
    ctaLabel:    'Learn More',
    ctaHref:     '/catalog#item-slug',
    features: [
      { label: 'Feature One', icon: 'Star' },
      { label: 'Feature Two', icon: 'Leaf' },
      { label: 'Feature Three', icon: 'Shield' },
      { label: 'Feature Four', icon: 'Award' },
    ],
  },
  // ... 2 more items
],
```

**Available icons:** `Star`, `Leaf`, `Shield`, `Award` — from lucide-react. Add more by importing in `FeaturedItems.tsx` and adding to `iconMap`.

---

## Step 7 — Configure Gallery Carousel

**Config key:** `galleryCarouselConfig` in `site-config.ts`

3 slides for portfolio, use cases, locations, or community examples:

```typescript
slides: [
  {
    id:          'slide-1',
    tag:         'Portland, OR',
    title:       'Residential Gardens',
    metric:      '500+',
    metricLabel: 'Projects Completed',
    description: 'Brief description of this slide context.',
    ctaLabel:    'View Our Work',
    ctaHref:     '/catalog',
    image:       '/images/gallery-1.jpg',
  },
  // ... 2 more slides
],
```

---

## Step 8 — Write Brand Story Content

**Config key:** `brandStoryConfig` in `site-config.ts`

Fill in the 3 tabs (rename labels to match your brand language):

- Tab 1: Your philosophy / mission
- Tab 2: Your process / methodology  
- Tab 3: Your community / impact

Fill the timeline with your actual milestones (founding year, key achievements, expansions).

Write the founder/expert quote — should be personal and authentic, not marketing copy.

---

## Step 9 — Add Blog Posts

**Directory:** `src/content/blog/`

1. Copy `example-post.md` to a new file: `your-post-slug.md`
2. Filename = URL slug → `/blog/your-post-slug`
3. Fill in all frontmatter fields
4. Write the article body in Markdown below the frontmatter

**GEO/AI optimization (important):**

The `tldr` array is rendered BEFORE the article body on the post page. AI search engines (Perplexity, ChatGPT Search, Google SGE) read this first when indexing your content. Write 3–5 specific, factual bullet points that directly answer the questions your target readers are asking.

```yaml
tldr:
  - "Worm castings contain 5x more nitrogen than regular compost."
  - "Apply at 25% by volume for optimal results in potting mixes."
  - "Worm castings alone won't burn roots, unlike chemical fertilizers."
```

**Make posts featured:**

```yaml
featured: true  # Only one post should be featured at a time
```

---

## Step 10 — Add Items/Products to Catalog

**Directory:** `src/content/items/`

1. Copy `example-item.md` to `your-item-slug.md`
2. Set `category` to one of your enum values from `content.config.ts`
3. Set `order` (1 = first in category)
4. Update `catalog.astro` category labels to match your actual categories

**Renaming categories:**

In `content.config.ts`, update the enum:

```typescript
category: z.enum(['premium', 'standard', 'seasonal', 'accessories']),
```

In `catalog.astro`, update the `byCategory()` calls and section IDs.

---

## Step 11 — Add Testimonials

**Directory:** `src/content/testimonials/`

1. Copy `example-testimonial.md` to `customer-name.md`
2. Fill frontmatter (name, role, rating, order)
3. Write the testimonial text in the body

**Writing effective testimonials:**

- Specific beats generic ("My tomatoes grew 40% larger" beats "Great product!")
- Include the customer's role/context for credibility
- 2–4 sentences is optimal length

---

## Step 12 — Configure Contact Form

**Config key:** `contactFormConfig` in `site-config.ts`

1. **Form endpoint:** Replace with your Formspree ID or API endpoint:
   
   ```
   https://formspree.io/f/YOUR_FORM_ID
   ```
   
   Sign up at formspree.io — free tier allows 50 submissions/month.

2. **Remove unused fields:** If you don't need `visitDate` or `partySize`, remove them from the config fields object and from the form JSX in `ContactForm.tsx`.

3. **Google Maps embed:**
   
   - Go to Google Maps → find your location → Share → Embed a map → Copy iframe src URL
   - Paste into `contactFormConfig.googleMapsEmbed`

4. **Directory links:** Add your verified business listings for trust signals and local SEO.

---

## Step 13 — Configure Footer

**Config key:** `footerConfig` in `site-config.ts`

- Update `socialLinks` with your actual social profile URLs
- Update `linkGroups` to match your navigation structure
- Wire up `newsletter` to your email provider (Mailchimp, ConvertKit, etc.) — replace the `handleNewsletter` function in `Footer.tsx`
- Update `copyrightText` with your legal business name

---

## Step 14 — Configure SEO & Local Business Schema

**Config key:** `localBusinessConfig` in `site-config.ts`

If you're a local/physical business, fill in all fields:

```typescript
export const localBusinessConfig = {
  type:            'LocalBusiness',  // or 'Restaurant', 'Store', 'MedicalBusiness', etc.
  name:            'Your Business Name',
  description:     'One sentence about your business.',
  foundingDate:    '2018',
  streetAddress:   '123 Main St',
  city:            'Your City',
  state:           'OR',
  postalCode:      '97401',
  country:         'US',
  phone:           '+1-541-555-0100',
  email:           'info@yourdomain.com',
  latitude:        '42.5432',   // Right-click on Google Maps to get coords
  longitude:       '-123.3884',
  openingHours:    ['Mo-Fr 09:00-17:00', 'Sa 09:00-14:00'],
  serviceRadius:   80467,       // meters (80467 = ~50 miles)
  socialProfiles:  ['https://facebook.com/your-page', ...],
};
```

**If NOT a local business:** Remove the geo meta tags block and LocalBusiness JSON-LD from `BaseLayout.astro`. Replace with an Organization schema instead.

**Geo meta tags** power local search signals:

```html
<meta name="geo.region"    content="US-OR" />
<meta name="geo.placename" content="Your City, State" />
```

---

## Step 15 — Fill Secondary Pages

### Catalog (`src/pages/catalog.astro`)

- Replace `[CATALOG_HEADLINE]`, `[CATALOG_SUBTEXT]`, etc.
- Update category section headings
- Add more categories by duplicating category sections and updating `byCategory()` filter

### Research (`src/pages/research/index.astro`)

- Fill in your research report content section by section
- Update the `sections` array for the table of contents
- Replace `[RESEARCH_TITLE]` in the ScholarlyArticle schema

### Library (`src/pages/library.astro`)

- Define your `groups` array with actual entries
- Great for: ingredient libraries, service breakdowns, feature matrices, glossaries

### FAQ (`src/pages/faq.astro`)

- Fill the `faqs` array — aim for 8–15 questions
- The FAQPage JSON-LD schema auto-generates from your data

### Privacy & Terms

- Replace placeholder text with your actual legal content
- Consult a lawyer for production use

---

## Step 16 — Build & Deploy

### Development

```bash
npm run dev          # http://localhost:4321
```

### Build

```bash
npm run build        # Outputs to /dist
npm run preview      # Preview the built site locally
```

### Deploy to Cloudflare Pages

```bash
# Install Wrangler globally if not already
npm install -g wrangler

# Login
wrangler login

# Deploy
npx wrangler pages deploy dist --project-name=your-project-name
```

For future deploys, set up GitHub Actions or Cloudflare Pages CI in the dashboard.

### Deploy to Netlify

```bash
# Drag & drop the /dist folder to netlify.com/drop
# Or connect your GitHub repo in the Netlify dashboard
# Build command: npm run build
# Publish directory: dist
```

---

## Component Reference

| Component         | Hydration        | Config Key                        | Purpose                 |
| ----------------- | ---------------- | --------------------------------- | ----------------------- |
| `Navigation`      | `client:load`    | `navigationConfig`                | Sticky nav, mobile menu |
| `Preloader`       | `client:load`    | `preloaderConfig`                 | Loading screen          |
| `Hero`            | `client:load`    | `heroConfig`                      | Full-viewport hero      |
| `FeaturedItems`   | `client:visible` | `featuredItemsConfig`             | Tab item showcase       |
| `GalleryCarousel` | `client:visible` | `galleryCarouselConfig`           | Auto-advancing gallery  |
| `BrandStory`      | `client:visible` | `brandStoryConfig`                | Story tabs + timeline   |
| `SocialProof`     | Static (Astro)   | `socialProofConfig` + collections | Blog + testimonials     |
| `ContactForm`     | `client:visible` | `contactFormConfig`               | Form + map + directory  |
| `Footer`          | `client:visible` | `footerConfig`                    | Full footer             |
| `ScrollToTop`     | `client:load`    | N/A                               | Floating scroll button  |

**Hydration strategy:**

- `client:load` — Hydrates immediately (used for components that need to respond before scroll)
- `client:visible` — Hydrates only when entering the viewport (better performance)
- Static (`.astro`) — Zero JS, rendered at build time

---

## Content Collection Reference

### Blog posts (`src/content/blog/`)

```
Required: title, excerpt, date, category, image
Optional: featured, author, readingTime, tags, relatedItems, tldr, ogImage
```

### Items (`src/content/items/`)

```
Required: name, image, category, order
Optional: subtitle, badge, glowColor, featured, price
Custom:   Add any fields — update content.config.ts schema to match
```

### Testimonials (`src/content/testimonials/`)

```
Required: name, role, rating, order
Body:     The testimonial text (below frontmatter)
```

---

## Routing Reference

| URL                   | File                         | Purpose                    |
| --------------------- | ---------------------------- | -------------------------- |
| `/`                   | `pages/index.astro`          | Homepage                   |
| `/catalog`            | `pages/catalog.astro`        | Items/products page        |
| `/catalog#category-a` | Same file                    | Anchor to category section |
| `/blog`               | `pages/blog/index.astro`     | Blog listing               |
| `/blog/[slug]`        | `pages/blog/[slug].astro`    | Individual post            |
| `/research`           | `pages/research/index.astro` | Research report            |
| `/library`            | `pages/library.astro`        | Content library            |
| `/faq`                | `pages/faq.astro`            | FAQ                        |
| `/privacy`            | `pages/privacy.astro`        | Privacy policy             |
| `/terms`              | `pages/terms.astro`          | Terms of service           |

---

## Adding New Pages

1. Create `src/pages/your-page.astro`
2. Wrap content in `<BaseLayout>` with your title/description props
3. Add `style="padding-top: 4.5rem;"` on the outer div (clears fixed nav)
4. Add a link to the new page in `navigationConfig.navLinks`

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Page Title | Brand" description="Page description">
  <div style="padding-top: 4.5rem;">
    <section class="section-padding">
      <div class="container-custom">
        <h1 style="font-family: var(--font-heading);">Your Content</h1>
      </div>
    </section>
  </div>
</BaseLayout>
```

---

## Common Customizations

### Removing a homepage section

In `src/pages/index.astro`, comment out the component you don't need:

```astro
<!-- <GalleryCarousel client:visible /> -->
```

### Changing section order

Reorder the component lines in `index.astro`. The sections stack in the order they appear.

### Adding a new homepage section

1. Create a component in `src/components/`
2. Import it in `index.astro`
3. Add a config object to `site-config.ts`

### Customizing blog post body styles

Edit the `.prose` styles in `src/pages/blog/[slug].astro`:

```css
.prose h2 { font-size: 2rem; color: var(--text-primary); }
```

### Adding more content collection fields

1. Add the field to the schema in `src/content.config.ts`
2. Add the field to your `.md` frontmatter
3. Access via `entry.data.yourField` in page templates

### Disabling the preloader

Remove `<Preloader client:load />` from `index.astro`.
In `Hero.tsx`, trigger animations immediately instead of waiting for `preloader:complete`:

```tsx
useEffect(() => {
  // Start immediately
  setTimeout(() => setPhase(1), 100);
  // ...
}, []);
```

### Using TypeScript in Astro template expressions

**CRITICAL:** Never use TypeScript type annotations inside `{}` template expressions in `.astro` files. Move typed logic to the frontmatter `---` block instead.

```astro
<!-- WRONG — causes silent 500 errors -->
{items.map((item: string) => <p>{item}</p>)}

<!-- RIGHT — type annotation in frontmatter, clean expression in template -->
---
const typedItems: string[] = items;
---
{typedItems.map((item) => <p>{item}</p>)}
```
