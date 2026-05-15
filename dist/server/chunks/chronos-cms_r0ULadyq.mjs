globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_P2T-B9sK.mjs";
import { c as renderComponent, r as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from "./worker-entry_D9jsJv2k.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_5CMa3oI8.mjs";
import { s as siteConfig } from "./createLucideIcon_DZRUm3Z8.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$ChronosCms = createComponent(($$result, $$props, $$slots) => {
  const appName = "Chronos CMS";
  const appDescription = "AI-powered content management system with a custom code editor, IndexedDB persistence, and Anthropic + Groq API support for intelligent content creation.";
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Catalog", item: `${siteConfig.url}/catalog` },
      { "@type": "ListItem", position: 3, name: appName, item: `${siteConfig.url}/apps/chronos-cms` }
    ]
  };
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: appName,
    description: appDescription,
    applicationCategory: "CMSApplication",
    operatingSystem: "Web",
    browserRequirements: "Modern browser with JavaScript enabled",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@type": "Organization", name: "Leverage AI LLC", url: siteConfig.url }
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "What is Chronos CMS?", acceptedAnswer: { "@type": "Answer", text: "Chronos CMS is an AI-powered content management system featuring a custom code editor, browser-based persistence via IndexedDB, and integration with Anthropic and Groq APIs for intelligent content generation and editing." } },
      { "@type": "Question", name: "Is Chronos CMS free to use?", acceptedAnswer: { "@type": "Answer", text: "Yes, Chronos CMS is a free-to-use web application. You can access all features directly in your browser with no account required." } },
      { "@type": "Question", name: "Do I need an API key?", acceptedAnswer: { "@type": "Answer", text: "To use the AI writing features powered by Anthropic and Groq, you will need your own API keys from those providers. The core CMS functionality works without any API keys." } }
    ]
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${appName} | Web App — Leverage AI`, "description": appDescription }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">', '<\/script> <script type="application/ld+json">', '<\/script> <script type="application/ld+json">', "<\/script> ", '<section style="padding: 6rem 0 3rem; background: linear-gradient(180deg, hsl(220 40% 5%) 0%, var(--page-bg) 100%); border-bottom: 1px solid hsl(38 80% 55% / 0.12);"> <div class="container-custom" style="max-width: 800px;"> <a href="/catalog" style="font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: hsl(210 15% 50%); text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">\n&larr; All Apps &amp; Tools\n</a> <h1 style="font-family: var(--font-heading); font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 700; color: hsl(45 30% 92%); margin: 0 0 1rem; line-height: 1.1;"> ', ' </h1> <p style="color: hsl(210 15% 60%); font-size: 1.05rem; line-height: 1.7; max-width: 600px; margin: 0;"> ', ' </p> </div> </section> <section style="padding: 0; background: var(--page-bg);"> ', ' </section> <section class="section-padding" style="background-color: var(--surface-1); border-top: 1px solid var(--border-subtle);"> <div class="container-custom" style="max-width: 720px;"> <h2 style="font-family: var(--font-heading); font-size: 1.75rem; font-weight: 300; color: var(--text-primary); margin: 0 0 2rem;">\nFrequently Asked Questions\n</h2> <div style="display: flex; flex-direction: column; gap: 1.5rem;"> <div style="padding: 1.25rem; background: var(--surface-2); border-radius: var(--border-radius); border: 1px solid var(--border-subtle);"> <h3 style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 400; color: var(--text-primary); margin: 0 0 0.5rem;">What is Chronos CMS?</h3> <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.65; margin: 0;">Chronos CMS is an AI-powered content management system featuring a custom code editor, browser-based persistence via IndexedDB, and integration with Anthropic and Groq APIs for intelligent content generation and editing.</p> </div> <div style="padding: 1.25rem; background: var(--surface-2); border-radius: var(--border-radius); border: 1px solid var(--border-subtle);"> <h3 style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 400; color: var(--text-primary); margin: 0 0 0.5rem;">Is Chronos CMS free to use?</h3> <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.65; margin: 0;">Yes, Chronos CMS is a free-to-use web application. You can access all features directly in your browser with no account required.</p> </div> <div style="padding: 1.25rem; background: var(--surface-2); border-radius: var(--border-radius); border: 1px solid var(--border-subtle);"> <h3 style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 400; color: var(--text-primary); margin: 0 0 0.5rem;">Do I need an API key?</h3> <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.65; margin: 0;">To use the AI writing features powered by Anthropic and Groq, you will need your own API keys from those providers. The core CMS functionality works without any API keys.</p> </div> </div> </div> </section> '])), unescapeHTML(JSON.stringify(breadcrumb)), unescapeHTML(JSON.stringify(appSchema)), unescapeHTML(JSON.stringify(faqSchema)), maybeRenderHead(), appName, appDescription, renderComponent($$result2, "ChronosCMS", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/mikes/Leverage-AI-Astro-Site/src/components/apps/ChronosCMS.jsx", "client:component-export": "default" })) })}`;
}, "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/apps/chronos-cms.astro", void 0);
const $$file = "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/apps/chronos-cms.astro";
const $$url = "/apps/chronos-cms";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$ChronosCms,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
