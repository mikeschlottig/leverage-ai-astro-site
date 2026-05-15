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
const $$Crm = createComponent(($$result, $$props, $$slots) => {
  const appName = "CRM";
  const appDescription = "Full-featured AI-enhanced CRM with pipeline management, analytics dashboards, and contact intelligence built on Recharts for data-driven sales management.";
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Catalog", item: `${siteConfig.url}/catalog` },
      { "@type": "ListItem", position: 3, name: appName, item: `${siteConfig.url}/apps/crm` }
    ]
  };
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: appName,
    description: appDescription,
    applicationCategory: "BusinessApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@type": "Organization", name: "Leverage AI LLC", url: siteConfig.url }
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${appName} | Web App — Leverage AI`, "description": appDescription }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">', '<\/script> <script type="application/ld+json">', "<\/script> ", '<section style="padding: 6rem 0 3rem; background: linear-gradient(180deg, hsl(220 40% 5%) 0%, var(--page-bg) 100%); border-bottom: 1px solid hsl(38 80% 55% / 0.12);"> <div class="container-custom" style="max-width: 800px;"> <a href="/catalog" style="font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: hsl(210 15% 50%); text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">&larr; All Apps</a> <h1 style="font-family: var(--font-heading); font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 700; color: hsl(45 30% 92%); margin: 0 0 1rem; line-height: 1.1;">', '</h1> <p style="color: hsl(210 15% 60%); font-size: 1.05rem; line-height: 1.7; max-width: 600px; margin: 0;">', '</p> </div> </section> <section style="padding: 0; background: var(--page-bg);">', "</section> "])), unescapeHTML(JSON.stringify(breadcrumb)), unescapeHTML(JSON.stringify(appSchema)), maybeRenderHead(), appName, appDescription, renderComponent($$result2, "CRM", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/mikes/Leverage-AI-Astro-Site/src/components/apps/CRM.jsx", "client:component-export": "default" })) })}`;
}, "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/apps/crm.astro", void 0);
const $$file = "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/apps/crm.astro";
const $$url = "/apps/crm";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Crm,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
