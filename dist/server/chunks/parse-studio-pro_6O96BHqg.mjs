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
const $$ParseStudioPro = createComponent(($$result, $$props, $$slots) => {
  const appName = "Parse Studio Pro";
  const appDescription = "AI-powered data extraction workbench with smart URL parsing, multi-phase regex, built-in scripting, and Google Search integration for powerful data mining.";
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Catalog", item: `${siteConfig.url}/catalog` },
      { "@type": "ListItem", position: 3, name: appName, item: `${siteConfig.url}/apps/parse-studio-pro` }
    ]
  };
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: appName,
    description: appDescription,
    applicationCategory: "DeveloperApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@type": "Organization", name: "Leverage AI LLC", url: siteConfig.url }
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "What is Parse Studio Pro?", acceptedAnswer: { "@type": "Answer", text: "Parse Studio Pro is a web-based data extraction tool that combines URL parsing, multi-phase regex patterns, built-in scripting, and Google Search integration to extract structured data from web content." } },
      { "@type": "Question", name: "Do I need programming experience?", acceptedAnswer: { "@type": "Answer", text: "Basic regex knowledge helps but is not required. The built-in scripting and pre-built extraction patterns make it accessible to users of all skill levels." } }
    ]
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${appName} | Web App — Leverage AI`, "description": appDescription }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">', '<\/script> <script type="application/ld+json">', '<\/script> <script type="application/ld+json">', "<\/script> ", '<section style="padding: 6rem 0 3rem; background: linear-gradient(180deg, hsl(220 40% 5%) 0%, var(--page-bg) 100%); border-bottom: 1px solid hsl(38 80% 55% / 0.12);"> <div class="container-custom" style="max-width: 800px;"> <a href="/catalog" style="font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: hsl(210 15% 50%); text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">&larr; All Apps</a> <h1 style="font-family: var(--font-heading); font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 700; color: hsl(45 30% 92%); margin: 0 0 1rem; line-height: 1.1;">', '</h1> <p style="color: hsl(210 15% 60%); font-size: 1.05rem; line-height: 1.7; max-width: 600px; margin: 0;">', '</p> </div> </section> <section style="padding: 0; background: var(--page-bg);">', '</section> <section class="section-padding" style="background-color: var(--surface-1); border-top: 1px solid var(--border-subtle);"> <div class="container-custom" style="max-width: 720px;"> <h2 style="font-family: var(--font-heading); font-size: 1.75rem; font-weight: 300; color: var(--text-primary); margin: 0 0 2rem;">Frequently Asked Questions</h2> <div style="display: flex; flex-direction: column; gap: 1.5rem;"> <div style="padding: 1.25rem; background: var(--surface-2); border-radius: var(--border-radius); border: 1px solid var(--border-subtle);"> <h3 style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 400; color: var(--text-primary); margin: 0 0 0.5rem;">What is Parse Studio Pro?</h3> <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.65; margin: 0;">Parse Studio Pro is a web-based data extraction tool that combines URL parsing, multi-phase regex patterns, built-in scripting, and Google Search integration to extract structured data from web content.</p> </div> <div style="padding: 1.25rem; background: var(--surface-2); border-radius: var(--border-radius); border: 1px solid var(--border-subtle);"> <h3 style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 400; color: var(--text-primary); margin: 0 0 0.5rem;">Do I need programming experience?</h3> <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.65; margin: 0;">Basic regex knowledge helps but is not required. The built-in scripting and pre-built extraction patterns make it accessible to users of all skill levels.</p> </div> </div> </div> </section> '])), unescapeHTML(JSON.stringify(breadcrumb)), unescapeHTML(JSON.stringify(appSchema)), unescapeHTML(JSON.stringify(faqSchema)), maybeRenderHead(), appName, appDescription, renderComponent($$result2, "ParseStudioPro", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/mikes/Leverage-AI-Astro-Site/src/components/apps/ParseStudioPro.jsx", "client:component-export": "default" })) })}`;
}, "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/apps/parse-studio-pro.astro", void 0);
const $$file = "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/apps/parse-studio-pro.astro";
const $$url = "/apps/parse-studio-pro";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$ParseStudioPro,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
