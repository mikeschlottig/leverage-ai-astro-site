globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_P2T-B9sK.mjs";
import { c as renderComponent, r as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from "./worker-entry_D9jsJv2k.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_5CMa3oI8.mjs";
import { g as getCollection, r as renderEntry } from "./_astro_content_q8QYHCI6.mjs";
import { s as siteConfig } from "./createLucideIcon_DZRUm3Z8.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const services = await getCollection("services");
  const entry = services.find((e) => e.data.slug === slug);
  if (!entry) return Astro2.redirect("/404");
  const { Content } = await renderEntry(entry);
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Services", item: `${siteConfig.url}/services` },
      { "@type": "ListItem", position: 3, name: entry.data.title, item: `${siteConfig.url}/services/${entry.data.slug}` }
    ]
  };
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: entry.data.title,
    description: entry.data.description,
    provider: {
      "@type": "Organization",
      name: "Leverage AI LLC",
      url: siteConfig.url
    },
    areaServed: "US",
    url: `${siteConfig.url}/services/${entry.data.slug}`
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${entry.data.title} | Services — Leverage AI`, "description": entry.data.description, "keywords": (entry.data.tags ?? []).join(", "), "canonical": `${siteConfig.url}/services/${entry.data.slug}`, "data-astro-cid-tcy35dad": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">', '<\/script> <script type="application/ld+json">', "<\/script> ", `<div style="padding-top: 4.5rem;" data-astro-cid-tcy35dad> <!-- Back nav --> <div style="background: hsl(220 40% 5%); border-bottom: 1px solid hsl(38 80% 55% / 0.12); padding: 1rem 0;" data-astro-cid-tcy35dad> <div class="container-custom" data-astro-cid-tcy35dad> <a href="/services" style="font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: hsl(210 15% 50%); text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem;" data-astro-cid-tcy35dad>
← All Services
</a> </div> </div> <!-- Hero --> <section style="padding: 5rem 0 4rem; background: linear-gradient(180deg, hsl(220 40% 5%) 0%, var(--page-bg) 100%); border-bottom: 1px solid hsl(38 80% 55% / 0.12); position: relative; overflow: hidden;" data-astro-cid-tcy35dad> <div style="position: absolute; inset: 0; background: radial-gradient(ellipse 70% 60% at 50% 0%, hsl(38 80% 55% / 0.05), transparent); pointer-events: none;" data-astro-cid-tcy35dad></div> <div class="container-custom" style="max-width: 860px; position: relative;" data-astro-cid-tcy35dad> <p style="font-family: monospace; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: hsl(38 80% 55%); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.75rem;" data-astro-cid-tcy35dad> <span style="display: block; width: 2rem; height: 1px; background: hsl(38 80% 55%);" data-astro-cid-tcy35dad></span>
Service
</p> <h1 style="font-family: var(--font-heading, 'Playfair Display', serif); font-size: clamp(2.25rem, 5vw, 3.5rem); font-weight: 700; color: hsl(45 30% 92%); margin: 0 0 1rem; line-height: 1.1;" data-astro-cid-tcy35dad> `, ' </h1> <p style="font-size: 1.15rem; color: hsl(38 80% 55%); font-style: italic; margin: 0 0 1.5rem;" data-astro-cid-tcy35dad> ', ' </p> <p style="color: hsl(210 15% 60%); font-size: 1rem; line-height: 1.75; margin: 0 0 2.5rem; max-width: 600px;" data-astro-cid-tcy35dad> ', ' </p> <!-- Stat + CTA row --> <div style="display: flex; flex-wrap: wrap; gap: 2rem; align-items: center;" data-astro-cid-tcy35dad> ', ' <a href="/contact" style="display: inline-block; background: hsl(38 80% 55%); color: hsl(220 40% 8%); padding: 0.875rem 2rem; border-radius: 4px; font-weight: 700; font-size: 0.875rem; text-decoration: none; letter-spacing: 0.08em; text-transform: uppercase;" data-astro-cid-tcy35dad>\nStart a Conversation\n</a> <a href="/case-studies" style="display: inline-block; border: 1px solid hsl(38 80% 55% / 0.4); color: hsl(38 80% 55%); padding: 0.875rem 2rem; border-radius: 4px; font-size: 0.875rem; text-decoration: none; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600;" data-astro-cid-tcy35dad>\nView Case Studies\n</a> </div> </div> </section> <!-- Service Content --> <article class="container-custom svc-prose" style="max-width: 780px; padding-top: 4rem; padding-bottom: 5rem;" data-astro-cid-tcy35dad> <!-- TL;DR --> <div style="\n          background-color: var(--surface-1);\n          border-left: 3px solid var(--accent);\n          padding: 1.5rem;\n          margin-bottom: 2.5rem;\n          border-radius: 0 var(--border-radius) var(--border-radius) 0;\n        " data-astro-cid-tcy35dad> <p style="\n            font-size: 0.8rem;\n            letter-spacing: 0.2em;\n            text-transform: uppercase;\n            color: var(--accent);\n            font-weight: 600;\n            margin: 0 0 0.75rem;\n          " data-astro-cid-tcy35dad>\nTL;DR\n</p> <ul style="margin: 0; padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem;" data-astro-cid-tcy35dad> <li style="color: var(--text-secondary); font-size: 1.125rem; line-height: 1.6;" data-astro-cid-tcy35dad>', '</li> <li style="color: var(--text-secondary); font-size: 1.125rem; line-height: 1.6;" data-astro-cid-tcy35dad>', "</li> ", " </ul> </div> ", ' <!-- CTA --> <div style="margin-top: 4rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;" data-astro-cid-tcy35dad> <div style="padding: 2rem; background: hsl(220 40% 7%); border: 1px solid hsl(38 80% 55% / 0.2); border-radius: 8px;" data-astro-cid-tcy35dad> <p style="font-family: monospace; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: hsl(38 80% 55%); margin-bottom: 0.75rem;" data-astro-cid-tcy35dad>Get Started</p> <h3 style="font-family: var(--font-heading, serif); font-size: 1.2rem; font-weight: 700; color: hsl(45 30% 92%); margin: 0 0 1rem;" data-astro-cid-tcy35dad>Ready to Engage?</h3> <a href="/contact" style="display: inline-block; background: hsl(38 80% 55%); color: hsl(220 40% 8%); padding: 0.625rem 1.5rem; border-radius: 4px; font-weight: 700; font-size: 0.8rem; text-decoration: none; letter-spacing: 0.06em; text-transform: uppercase;" data-astro-cid-tcy35dad>Contact Us</a> </div> <div style="padding: 2rem; background: hsl(220 40% 7%); border: 1px solid hsl(220 40% 14%); border-radius: 8px;" data-astro-cid-tcy35dad> <p style="font-family: monospace; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: hsl(210 15% 40%); margin-bottom: 0.75rem;" data-astro-cid-tcy35dad>See the Work</p> <h3 style="font-family: var(--font-heading, serif); font-size: 1.2rem; font-weight: 700; color: hsl(45 30% 92%); margin: 0 0 1rem;" data-astro-cid-tcy35dad>Case Studies</h3> <a href="/case-studies" style="display: inline-block; border: 1px solid hsl(210 15% 30%); color: hsl(210 15% 65%); padding: 0.625rem 1.5rem; border-radius: 4px; font-size: 0.8rem; text-decoration: none; letter-spacing: 0.06em; text-transform: uppercase;" data-astro-cid-tcy35dad>View Results</a> </div> </div> </article> </div> '])), unescapeHTML(JSON.stringify(breadcrumb)), unescapeHTML(JSON.stringify(serviceSchema)), maybeRenderHead(), entry.data.title, entry.data.tagline, entry.data.description, entry.data.heroStat && renderTemplate`<div style="padding: 1.25rem 2rem; background: hsl(220 40% 8%); border: 1px solid hsl(38 80% 55% / 0.2); border-radius: 6px; text-align: center;" data-astro-cid-tcy35dad> <div style="font-family: var(--font-heading, serif); font-size: 2.5rem; font-weight: 700; color: hsl(38 80% 55%); line-height: 1;" data-astro-cid-tcy35dad>${entry.data.heroStat}</div> <div style="font-size: 0.75rem; color: hsl(210 15% 55%); margin-top: 0.25rem;" data-astro-cid-tcy35dad>${entry.data.heroStatLabel}</div> </div>`, entry.data.tagline, entry.data.tags?.length > 0 ? `Key areas: ${entry.data.tags?.slice(0, 4).join(", ")}` : "", entry.data.heroStat && renderTemplate`<li style="color: var(--text-secondary); font-size: 1.125rem; line-height: 1.6;" data-astro-cid-tcy35dad>Average client impact: ${entry.data.heroStat} ${entry.data.heroStatLabel}</li>`, renderComponent($$result2, "Content", Content, { "data-astro-cid-tcy35dad": true })) })}`;
}, "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/services/[slug].astro", void 0);
const $$file = "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/services/[slug].astro";
const $$url = "/services/[slug]";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
