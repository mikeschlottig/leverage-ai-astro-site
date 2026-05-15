globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_P2T-B9sK.mjs";
import { c as renderComponent, r as renderTemplate, a as addAttribute, m as maybeRenderHead, u as unescapeHTML } from "./worker-entry_D9jsJv2k.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_5CMa3oI8.mjs";
import { g as getCollection } from "./_astro_content_q8QYHCI6.mjs";
import { s as siteConfig } from "./createLucideIcon_DZRUm3Z8.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Catalog = createComponent(async ($$result, $$props, $$slots) => {
  const allItems = await getCollection("items");
  const items = allItems.sort((a, b) => a.data.order - b.data.order);
  const categories = [...new Set(items.map((i) => i.data.category))];
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Catalog", item: `${siteConfig.url}/catalog` }
    ]
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Web Apps & Tools | Leverage AI", "description": "Explore the complete catalog of AI-powered web applications and tools built by Leverage AI — from content management to data extraction and analytics.", "keywords": "AI web apps, tools, CMS, CRM, data extraction, AI chat, productivity tools, Leverage AI catalog" }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">', "<\/script> ", '<div style="padding-top: 4.5rem;"> <section style="padding: 5rem 0 3rem; background-color: var(--surface-1); border-bottom: 1px solid var(--border-subtle);"> <div class="container-custom"> <p class="eyebrow" style="margin-bottom: 0.75rem;">Applications</p> <h1 style="font-family: var(--font-heading); font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 300; margin: 0 0 1.5rem;">\nWeb Apps &amp; Tools\n</h1> <p style="color: var(--text-secondary); max-width: 540px; margin-bottom: 2.5rem; font-size: 1.05rem; line-height: 1.6;">\nAI-powered applications engineered for visibility, performance, and real-world impact. Each tool reflects our commitment to edge-native architecture and intelligent design.\n</p> <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;"> ', ' <a href="/contact" class="btn-primary" style="font-size: 0.75rem; padding: 0.5rem 1rem;">\nRequest Custom Tool\n</a> </div> </div> </section> ', ' <section class="section-padding" style="background-color: var(--surface-1); text-align: center;"> <div class="container-custom" style="max-width: 600px;"> <p class="eyebrow" style="margin-bottom: 0.75rem;">Custom Development</p> <h2 style="font-family: var(--font-heading); font-size: clamp(1.8rem, 3vw, 2.5rem); font-weight: 300; margin: 0 0 1rem;">\nNeed a Custom Tool?\n</h2> <p style="color: var(--text-secondary); margin-bottom: 2rem;">\nWe build tailored AI-powered applications for your specific business needs. From internal dashboards to client-facing platforms.\n</p> <a href="/contact" class="btn-primary">Start a Conversation</a> </div> </section> </div> '])), unescapeHTML(JSON.stringify(breadcrumb)), maybeRenderHead(), categories.map((cat) => renderTemplate`<a${addAttribute(`#${cat.toLowerCase().replace(/\s+/g, "-")}`, "href")} class="btn-secondary" style="font-size: 0.75rem; padding: 0.5rem 1rem;"> ${cat} </a>`), categories.map((cat) => {
    const catItems = items.filter((i) => i.data.category === cat);
    const catId = cat.toLowerCase().replace(/\s+/g, "-");
    return renderTemplate`<section${addAttribute(catId, "id")} class="section-padding"${addAttribute(`background-color: ${categories.indexOf(cat) % 2 === 0 ? "var(--page-bg)" : "var(--surface-1)"};`, "style")}> <div class="container-custom"> <h2 style="font-family: var(--font-heading); font-size: 2rem; font-weight: 300; margin: 0 0 2.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-subtle);"> ${cat} </h2> <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;"> ${catItems.map((item) => renderTemplate`<a${addAttribute(item.data.url, "href")} class="fade-up" style="text-decoration: none; background-color: var(--surface-2); border: 1px solid var(--border-subtle); border-radius: var(--border-radius); overflow: hidden; display: flex; flex-direction: column; transition: border-color 0.25s ease, transform 0.25s ease;"> <div style="aspect-ratio: 16/9; overflow: hidden; background-color: var(--surface-1);"> <img${addAttribute(item.data.image, "src")}${addAttribute(item.data.name, "alt")} loading="lazy" style="width:100%; height:100%; object-fit:cover; transition: transform 0.4s ease;"> </div> <div style="padding: 1.5rem; flex: 1; display: flex; flex-direction: column;"> ${item.data.badge && renderTemplate`<span style="display:inline-block; padding:0.2rem 0.6rem; font-size:0.65rem; letter-spacing:0.1em; text-transform:uppercase; background-color:var(--accent); color:var(--page-bg); border-radius:var(--border-radius); margin-bottom:0.75rem; align-self:flex-start; font-weight:600;"> ${item.data.badge} </span>`} <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 300; margin: 0 0 0.5rem; color: var(--text-primary);"> ${item.data.name} </h3> <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.65; margin: 0 0 1rem; flex: 1;"> ${item.data.description} </p> ${item.data.tags && renderTemplate`<div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: auto;"> ${item.data.tags.map((tag) => renderTemplate`<span style="font-size:0.65rem; padding:0.15rem 0.5rem; border:1px solid var(--border-subtle); border-radius:999px; color:var(--text-muted); letter-spacing:0.05em;"> ${tag} </span>`)} </div>`} </div> </a>`)} </div> </div> </section>`;
  })) })}`;
}, "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/catalog.astro", void 0);
const $$file = "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/catalog.astro";
const $$url = "/catalog";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Catalog,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
