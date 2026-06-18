// ============================================================
// ASTRO CONFIG — Leverage AI LLC
// Astro v6 + @astrojs/cloudflare v13 | Node 22+ required
//
// Cloudflare Workers deployment (NOT Pages).
// `astro dev` runs workerd directly via the CF Vite plugin.
// ============================================================
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://leverageai.network',

  output: 'server',          // All pages are SSR; add prerender: true for static

  adapter: cloudflare({
    imageService: 'compile', // Pre-optimize images at build time; no CF Images binding needed
    remoteBindings: false,   // Disable remote proxy during build sync (no CF API auth in this env)
  }),

  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }), // Base styles in global.css
    sitemap(),
  ],
});
