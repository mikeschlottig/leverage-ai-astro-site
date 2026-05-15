# Design Tokens Guide

How to theme this template — from token fundamentals to complete ready-to-use themes.

---

## Table of Contents

1. [How the Token System Works](#1-how-the-token-system-works)
2. [Token Taxonomy](#2-token-taxonomy)
3. [Swapping a Theme (5 Minutes)](#3-swapping-a-theme-5-minutes)
4. [Synthesized Theme from Daley Organics](#4-synthesized-theme-from-daley-organics)
5. [6 Premium Ready-to-Use Themes](#5-6-premium-ready-to-use-themes)
6. [Building a Custom Theme](#6-building-a-custom-theme)
7. [Typography Pairings](#7-typography-pairings)
8. [Dark vs. Light Mode](#8-dark-vs-light-mode)
9. [Creating a Brand-Specific Color Scale](#9-creating-a-brand-specific-color-scale)
10. [Design System Checklist](#10-design-system-checklist)

---

## 1. How the Token System Works

The template uses a **three-layer token architecture**:

```
Primitive Tokens → Semantic Tokens → Component Tokens
```

### Layer 1: Primitive Tokens (Raw Values)
```css
--brand-500: #967347;   /* A specific color value */
--neutral-800: #1a1a1a; /* A specific neutral */
```

### Layer 2: Semantic Tokens (Intent-Based)
```css
--accent: var(--brand-500);      /* "What it means" — primary accent */
--page-bg: #0f0f0f;             /* "What it means" — page background */
--text-secondary: var(--neutral-300); /* "What it means" — secondary text */
```

### Layer 3: Component Usage
Tailwind classes in components reference semantic tokens via CSS vars:
```tsx
// In Navigation.tsx
color: 'var(--accent)'      // → --accent → --brand-500 → #967347
backgroundColor: 'var(--page-bg)'  // → #0f0f0f
```

**Result:** Changing a primitive (e.g. `--brand-500`) propagates everywhere automatically.

---

## 2. Token Taxonomy

All tokens are defined in `src/styles/global.css` under `:root`.

### Brand Colors (Primary Accent Scale)
| Token | Role |
|-------|------|
| `--brand-500` | Primary CTA color, badges, highlights |
| `--brand-400` | Hover states, light accents |
| `--brand-600` | Pressed states, darker accents |
| `--brand-300` | Text accents in dark contexts |
| `--brand-700` | Border accents, dark fills |
| `--brand-900` | Subtle tinted backgrounds |

### Neutral Colors (Background/Text Scale)
| Token | Role |
|-------|------|
| `--neutral-900` | Deepest background (close to page-bg) |
| `--neutral-800` | `--surface-1` — card backgrounds |
| `--neutral-700` | `--surface-2` — elevated surfaces |
| `--neutral-500` | `--text-muted` — placeholder text |
| `--neutral-300` | `--text-secondary` — body text |
| `--neutral-100` | Light borders, subtle dividers |
| `--neutral-50`  | Near-white accents |

### Semantic Tokens
| Token | Maps To | Used For |
|-------|---------|---------|
| `--page-bg` | `#0f0f0f` | `<body>` background |
| `--surface-1` | `--neutral-800` | Section backgrounds, cards |
| `--surface-2` | `--neutral-700` | Nested cards, inputs |
| `--border-subtle` | `--neutral-700` | Dividers, card borders |
| `--border-accent` | `--brand-700` | Highlighted borders |
| `--text-primary` | `#ffffff` | Headlines, important text |
| `--text-secondary` | `--neutral-300` | Body copy |
| `--text-muted` | `--neutral-500` | Labels, captions |
| `--text-accent` | `--brand-400` | Links, accent text |
| `--accent` | `--brand-500` | CTA buttons, icons |

### Typography Tokens
| Token | Role |
|-------|------|
| `--font-heading` | Serif font for H1–H6 |
| `--font-body` | Sans-serif for body text |
| `--font-accent` | Script/decorative for callouts |

---

## 3. Swapping a Theme (5 Minutes)

To change the entire look of the site:

1. Open `src/styles/global.css`
2. Replace the brand color scale values in `:root`
3. Replace the `@import` font URL
4. Update `--font-heading` and `--font-body` names

That's it. Every component inherits the new values automatically.

---

## 4. Synthesized Theme from Daley Organics

This is the exact palette used in the reference site — documented here as a named theme.

**Theme name:** Artisan Dark Gold
**Character:** Luxury organic, warm, earthy, premium

```css
/* === ARTISAN DARK GOLD === */
/* Based on Daley Organics website */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Poppins:wght@300;400;500;600&family=Qwitcher+Grypen:wght@400;700&display=swap');

:root {
  /* Primitive: Brand (Gold) */
  --brand-50:  #f6eedd;
  --brand-100: #ead8b8;
  --brand-200: #d9be90;
  --brand-300: #c4a068;
  --brand-400: #ad8346;
  --brand-500: #96682d;   /* ← gold-500: primary CTA */
  --brand-600: #7a5220;
  --brand-700: #5e3e17;
  --brand-800: #422b0e;
  --brand-900: #2a1a07;

  /* Primitive: Neutral (Wine/Charcoal) */
  --neutral-50:  #d3d3d3;
  --neutral-100: #b8b8b8;
  --neutral-200: #9a9a9a;
  --neutral-300: #7d7d7d;
  --neutral-400: #5e5e5e;
  --neutral-500: #444444;
  --neutral-600: #2e2e2e;
  --neutral-700: #1e1e1e;
  --neutral-800: #141414;
  --neutral-900: #070707;

  /* Semantic */
  --page-bg:       #141414;
  --surface-1:     #1c1c1c;
  --surface-2:     #222222;
  --border-subtle: #2a2a2a;
  --border-accent: var(--brand-800);
  --text-primary:  #f0e9d8;
  --text-secondary:#b8b0a0;
  --text-muted:    #6e6558;
  --text-accent:   var(--brand-300);
  --accent:        var(--brand-500);

  /* Typography */
  --font-heading: 'Cormorant Garamond';
  --font-body:    'Poppins';
  --font-accent:  'Qwitcher Grypen';

  /* Layout */
  --page-bg:       #141414;
  --section-y:     7.5rem;
  --container-max: 1216px;
  --border-radius: 0.375rem;
}
```

---

## 5. Six Premium Ready-to-Use Themes

Copy any theme's `:root` block into `global.css` and update the `@import` line.

---

### Theme 1: Forest Dark (Nature / Sustainability)
**Character:** Deep forest greens, mossy, grounded, eco-premium

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Source+Sans+3:wght@300;400;600&display=swap');

:root {
  --brand-50:  #f0f5ee;
  --brand-100: #d8e8d3;
  --brand-200: #b5d1aa;
  --brand-300: #89b47e;
  --brand-400: #639754;
  --brand-500: #467a38;   /* Forest green */
  --brand-600: #336128;
  --brand-700: #22491a;
  --brand-800: #14310e;
  --brand-900: #081b05;

  --neutral-50:  #f4f2ef;
  --neutral-100: #e0ddd8;
  --neutral-200: #c4c0b9;
  --neutral-300: #a09b92;
  --neutral-400: #7a746a;
  --neutral-500: #575148;
  --neutral-600: #3a3530;
  --neutral-700: #27231e;
  --neutral-800: #181512;
  --neutral-900: #0b0908;

  --page-bg:       #111009;
  --surface-1:     #1a1810;
  --surface-2:     #222018;
  --border-subtle: #2e2b22;
  --border-accent: var(--brand-800);
  --text-primary:  #f0ede6;
  --text-secondary:#b8b4a8;
  --text-muted:    #6e6a5e;
  --text-accent:   var(--brand-300);
  --accent:        var(--brand-500);

  --font-heading: 'Playfair Display';
  --font-body:    'Source Sans 3';
  --font-accent:  'cursive';

  --section-y:     7.5rem;
  --container-max: 1216px;
  --border-radius: 0.25rem;
}
```

---

### Theme 2: Coastal Light (Service / Lifestyle)
**Character:** Clean whites, ocean blues, airy, professional, approachable

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

:root {
  --brand-50:  #eff6ff;
  --brand-100: #dbeafe;
  --brand-200: #bfdbfe;
  --brand-300: #93c5fd;
  --brand-400: #60a5fa;
  --brand-500: #3b82f6;   /* Ocean blue */
  --brand-600: #2563eb;
  --brand-700: #1d4ed8;
  --brand-800: #1e40af;
  --brand-900: #1e3a8a;

  --neutral-50:  #f8fafc;
  --neutral-100: #f1f5f9;
  --neutral-200: #e2e8f0;
  --neutral-300: #cbd5e1;
  --neutral-400: #94a3b8;
  --neutral-500: #64748b;
  --neutral-600: #475569;
  --neutral-700: #334155;
  --neutral-800: #1e293b;
  --neutral-900: #0f172a;

  /* LIGHT mode — inverted from dark defaults */
  --page-bg:       #f8fafc;
  --surface-1:     #ffffff;
  --surface-2:     #f1f5f9;
  --border-subtle: #e2e8f0;
  --border-accent: var(--brand-200);
  --text-primary:  #0f172a;
  --text-secondary:#475569;
  --text-muted:    #94a3b8;
  --text-accent:   var(--brand-600);
  --accent:        var(--brand-500);

  --font-heading: 'DM Serif Display';
  --font-body:    'DM Sans';
  --font-accent:  'cursive';

  --section-y:     6rem;
  --container-max: 1200px;
  --border-radius: 0.75rem;
}
```

> **Note:** For light-mode themes, also update `body` background and text colors in `global.css` base layer to match.

---

### Theme 3: Studio Minimal (Agency / Creative)
**Character:** Pure black and white, crisp, editorial, sophisticated

```css
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Jost:wght@200;300;400;500&display=swap');

:root {
  --brand-50:  #fafafa;
  --brand-100: #f5f5f5;
  --brand-200: #e5e5e5;
  --brand-300: #d4d4d4;
  --brand-400: #a3a3a3;
  --brand-500: #737373;   /* Mid gray as "accent" */
  --brand-600: #525252;
  --brand-700: #404040;
  --brand-800: #262626;
  --brand-900: #171717;

  --neutral-50:  #fafafa;
  --neutral-100: #f5f5f5;
  --neutral-200: #e5e5e5;
  --neutral-300: #d4d4d4;
  --neutral-400: #a3a3a3;
  --neutral-500: #737373;
  --neutral-600: #525252;
  --neutral-700: #404040;
  --neutral-800: #262626;
  --neutral-900: #171717;

  --page-bg:       #0a0a0a;
  --surface-1:     #141414;
  --surface-2:     #1f1f1f;
  --border-subtle: #292929;
  --border-accent: #404040;
  --text-primary:  #fafafa;
  --text-secondary:#a3a3a3;
  --text-muted:    #525252;
  --text-accent:   #d4d4d4;
  --accent:        #ffffff;   /* Pure white as the accent in Studio Minimal */

  --font-heading: 'Libre Baskerville';
  --font-body:    'Jost';
  --font-accent:  'cursive';

  --section-y:     8rem;
  --container-max: 1100px;
  --border-radius: 0;  /* Sharp corners for editorial feel */
}
```

---

### Theme 4: Luxury Warm (Premium / Hospitality)
**Character:** Deep burgundy, champagne, velvet, exclusive

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;1,300&family=Raleway:wght@300;400;500&display=swap');

:root {
  --brand-50:  #fdf8f3;
  --brand-100: #f7ecdf;
  --brand-200: #edd6be;
  --brand-300: #dfba95;
  --brand-400: #ce9a6a;
  --brand-500: #b87d47;   /* Champagne gold */
  --brand-600: #9a6230;
  --brand-700: #7a4a21;
  --brand-800: #5c3314;
  --brand-900: #3e1f08;

  --neutral-50:  #fdf7f7;
  --neutral-100: #f5e8e8;
  --neutral-200: #e8cccc;
  --neutral-300: #d4a8a8;
  --neutral-400: #b87e7e;
  --neutral-500: #9a5858;
  --neutral-600: #7a3838;
  --neutral-700: #5c2020;
  --neutral-800: #3e1010;
  --neutral-900: #220505;

  --page-bg:       #160808;
  --surface-1:     #1e0e0e;
  --surface-2:     #281414;
  --border-subtle: #3a1e1e;
  --border-accent: var(--brand-800);
  --text-primary:  #fdf7f0;
  --text-secondary:#c8b8a8;
  --text-muted:    #7a6858;
  --text-accent:   var(--brand-300);
  --accent:        var(--brand-500);

  --font-heading: 'Cormorant';
  --font-body:    'Raleway';
  --font-accent:  'cursive';

  --section-y:     8rem;
  --container-max: 1200px;
  --border-radius: 0.25rem;
}
```

---

### Theme 5: Tech Blue (SaaS / Technology)
**Character:** Electric blue, dark UI, modern, sharp, data-driven

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

:root {
  --brand-50:  #eff8ff;
  --brand-100: #d8edff;
  --brand-200: #b9dffe;
  --brand-300: #7bc9fd;
  --brand-400: #36aef9;
  --brand-500: #0c94ea;   /* Electric blue */
  --brand-600: #0075c8;
  --brand-700: #015da3;
  --brand-800: #064e86;
  --brand-900: #0b4270;

  --neutral-50:  #f0f4f8;
  --neutral-100: #d9e2ec;
  --neutral-200: #bcccdc;
  --neutral-300: #9fb3c8;
  --neutral-400: #829ab1;
  --neutral-500: #627d98;
  --neutral-600: #486581;
  --neutral-700: #334e68;
  --neutral-800: #243b53;
  --neutral-900: #102a43;

  --page-bg:       #080f1a;
  --surface-1:     #0e1b2d;
  --surface-2:     #162438;
  --border-subtle: #1e3048;
  --border-accent: var(--brand-800);
  --text-primary:  #e8f4fd;
  --text-secondary:#9fb3c8;
  --text-muted:    #627d98;
  --text-accent:   var(--brand-300);
  --accent:        var(--brand-500);

  --font-heading: 'Space Grotesk';
  --font-body:    'Space Grotesk';
  --font-accent:  'Space Mono';

  --section-y:     6rem;
  --container-max: 1280px;
  --border-radius: 0.5rem;
}
```

---

### Theme 6: Terracotta Bold (Food / Craft / Local)
**Character:** Warm terracotta, desert sand, rustic yet modern, inviting

```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=Nunito+Sans:wght@300;400;600&display=swap');

:root {
  --brand-50:  #fdf4f0;
  --brand-100: #fce5da;
  --brand-200: #f8c9b0;
  --brand-300: #f2a57f;
  --brand-400: #ea7d4c;
  --brand-500: #e05a22;   /* Terracotta */
  --brand-600: #bf4515;
  --brand-700: #9a330d;
  --brand-800: #7a2308;
  --brand-900: #5a1504;

  --neutral-50:  #faf8f5;
  --neutral-100: #f2ede6;
  --neutral-200: #e4dacc;
  --neutral-300: #cfc2ad;
  --neutral-400: #b5a48c;
  --neutral-500: #9a8870;
  --neutral-600: #7a6c58;
  --neutral-700: #5c5040;
  --neutral-800: #40362a;
  --neutral-900: #251f17;

  --page-bg:       #1a1208;
  --surface-1:     #241a0e;
  --surface-2:     #2e2214;
  --border-subtle: #3e2e1e;
  --border-accent: var(--brand-800);
  --text-primary:  #faf0e6;
  --text-secondary:#cfc2ad;
  --text-muted:    #7a6c58;
  --text-accent:   var(--brand-300);
  --accent:        var(--brand-500);

  --font-heading: 'Fraunces';
  --font-body:    'Nunito Sans';
  --font-accent:  'cursive';

  --section-y:     7rem;
  --container-max: 1200px;
  --border-radius: 0.5rem;
}
```

---

## 6. Building a Custom Theme

Follow this process to synthesize a theme from a brand identity or brief.

### Step 1: Define Your Brand Character
Write 3–5 adjectives. These drive every decision.
- Artisan Dark Gold: *warm, premium, organic, rooted, trustworthy*
- Tech Blue: *precise, modern, data-driven, efficient, scalable*

### Step 2: Choose a Primary Hue
Pick your primary brand color (this becomes `--brand-500`):
- Use your existing brand color if available
- Or choose from the color wheel based on character:
  - Trust/Professional → Blue (205–240°)
  - Nature/Growth → Green (100–160°)
  - Energy/Bold → Red/Orange (0–30°)
  - Luxury/Premium → Gold/Purple (40–60° or 260–290°)
  - Minimal/Sophisticated → Desaturated neutrals

### Step 3: Generate the Full Scale
Use one of these tools to generate a 10-step scale from your primary color:
- [Tailwind Shades](https://www.tailwindshades.com/) — paste in your hex
- [Palette Generator](https://palettte.app/) — fine-grained control
- [RadixUI Colors](https://www.radix-ui.com/colors) — mathematically balanced

Rules for the scale:
- `500` = your primary brand color at full vibrancy
- `400`, `300` = lighter, less saturated (used for hover, text accents)
- `600`, `700` = darker, deeper (used for pressed states, borders)
- `900` = very dark tint of the brand color (glow backgrounds, deep fills)
- `100`, `50` = very light tints (used in light-mode surfaces)

### Step 4: Choose a Dark Background
For dark-mode sites:
- Avoid pure `#000000` — use a very dark tint of your brand hue instead
- Daley Organics uses `#141414` (slightly warm black)
- Forest uses `#111009` (slightly warm/green tinted black)
- Tech Blue uses `#080f1a` (deep navy black)

Formula: Take your brand hue, reduce saturation to ~5%, set lightness to 5–8%.

### Step 5: Set Surface Colors
Space surfaces 3–8 lightness points apart for layering:
```
page-bg (darkest) < surface-1 < surface-2 (lightest)
```

### Step 6: Set Text Colors
- `text-primary`: `#ffffff` or a very light warm/cool tint of your brand
- `text-secondary`: 40–60% the brightness of `text-primary`
- `text-muted`: 25–35% the brightness of `text-primary`

### Step 7: Choose Typography
See Section 7 below for curated pairings.

---

## 7. Typography Pairings

Curated Google Font pairs with usage guidance.

| Heading Font | Body Font | Character | Best For |
|-------------|-----------|-----------|---------|
| Cormorant Garamond | Poppins | Luxury, editorial, warm serif | Premium products, craft, nature brands |
| Playfair Display | Source Sans 3 | Classic, readable, trustworthy | Restaurants, boutiques, local services |
| DM Serif Display | DM Sans | Modern editorial, clean | Agencies, tech-adjacent, design studios |
| Libre Baskerville | Jost | Sophisticated, precise | Law, consulting, professional services |
| Fraunces | Nunito Sans | Friendly premium, warm | Food, beverage, lifestyle brands |
| Space Grotesk | Space Grotesk | Technical, modern | SaaS, developer tools, fintech |

### Implementation

```css
/* In global.css @import line */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Source+Sans+3:wght@300;400;600&display=swap');

/* In :root */
--font-heading: 'Playfair Display';
--font-body:    'Source Sans 3';
```

### Font Weight Guidelines
- Headings: weight 300–400 for elegant, editorial feel; 600–700 for bold, impactful
- Body: weight 300 for luxury/spacious; 400 for standard readability; keep consistent
- For Cormorant/Fraunces: weight 300 looks ultra-refined, especially at large sizes

---

## 8. Dark vs. Light Mode

The template defaults to **dark mode** (dark backgrounds, white text). This is ideal for premium, luxury, and nature brands.

### For Light-Mode Sites

In `global.css`, invert the semantic token mappings:

```css
:root {
  /* Swap these values for light mode */
  --page-bg:       #f8f8f6;   /* Was dark, now light */
  --surface-1:     #ffffff;
  --surface-2:     #f2f2ef;
  --border-subtle: #e4e4e0;
  --text-primary:  #111111;   /* Was white, now dark */
  --text-secondary:#4a4a44;
  --text-muted:    #9a9a90;
}
```

Also update the `body` base style in the `@layer base` block:
```css
body {
  background-color: var(--page-bg);  /* Still references the token — just update the token */
  color: var(--text-primary);
}
```

### Coastal Light theme (Section 5, Theme 2) is a complete light-mode example.

---

## 9. Creating a Brand-Specific Color Scale

If you have a single brand hex (e.g., from a logo), this process generates a full 10-step scale.

Given: `#e05a22` (Terracotta)

1. Open [Tailwind Shades](https://www.tailwindshades.com/)
2. Paste `#e05a22` as the base color
3. Set the base to step `500`
4. Copy the generated 50–900 values
5. Paste into the `:root` block replacing `--brand-50` through `--brand-900`

**Manual adjustments:**
- `900` should be very dark (L < 10 in HSL)
- `50` should be barely tinted (L > 95 in HSL)
- Adjust `500` to match your exact brand hex if the tool shifts it

**Checking contrast ratios:**
Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) to verify:
- `brand-500` on `page-bg` should pass AA (4.5:1 for text, 3:1 for large text)
- `text-primary` on `page-bg` should pass AAA (7:1)
- `text-secondary` on `surface-1` should pass AA (4.5:1)

---

## 10. Design System Checklist

Before considering the design token system complete, verify:

- [ ] Primary brand color (`--brand-500`) passes contrast on dark background
- [ ] Body text (`--text-secondary`) passes AA contrast on surfaces
- [ ] Heading font loads correctly from Google Fonts
- [ ] Body font renders at weight 300 or 400 (check `font-weight` in base layer)
- [ ] CTA buttons (`.btn-primary`) are visually distinct from backgrounds
- [ ] Border colors (`--border-subtle`) are visible but not harsh
- [ ] Surface hierarchy is clear: page-bg < surface-1 < surface-2 (progressively lighter)
- [ ] Accent color (`--accent`) is used consistently for highlights, not mixed with neutrals
- [ ] Animation timing matches brand feel (faster = modern/tech, slower = luxury/organic)
- [ ] Mobile: text remains legible, buttons are tap-target sized (min 44px height)
- [ ] All images have good contrast with overlaid text

### Border Radius Personality Guide
| Value | Feel | Best For |
|-------|------|---------|
| `0` (none) | Sharp, editorial | Minimal, Studio, Architecture |
| `0.25rem` | Slightly soft | Premium, Luxury, Default |
| `0.5rem` | Friendly-professional | SaaS, Service, Tech |
| `0.75rem` | Approachable | Consumer, Food, Lifestyle |
| `1rem+` | Very friendly | Children, Wellness, Casual |

### Section Spacing Personality Guide
| `--section-y` | Feel |
|---------------|------|
| `5rem` | Compact, content-dense |
| `6rem` | Standard professional |
| `7.5rem` | Airy, premium (default) |
| `9rem` | Ultra spacious, luxury |
