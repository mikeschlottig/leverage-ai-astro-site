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
  const studies = await getCollection("caseStudies");
  const entry = studies.find((e) => e.id === slug);
  if (!entry) return Astro2.redirect("/404");
  const { Content } = await renderEntry(entry);
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteConfig.url}` },
      { "@type": "ListItem", position: 2, name: "Case Studies", item: `${siteConfig.url}/case-studies` },
      { "@type": "ListItem", position: 3, name: entry.data.title, item: `${siteConfig.url}/case-studies/${entry.id}` }
    ]
  };
  const caseStudySchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: entry.data.title,
    description: `${entry.data.results.primary}. ${entry.data.results.secondary ?? ""}`.trim(),
    dateCreated: entry.data.date,
    creator: {
      "@type": "Organization",
      name: "Leverage AI LLC",
      url: siteConfig.url
    },
    about: entry.data.tags?.map((t) => ({ "@type": "Thing", name: t })) ?? []
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${entry.data.title} | Case Study — Leverage AI`, "description": `${entry.data.results.primary}. A Leverage AI case study.`, "keywords": (entry.data.tags ?? []).join(", "), "canonical": `${siteConfig.url}/case-studies/${entry.id}`, "data-astro-cid-skaurlmh": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">', '<\/script> <script type="application/ld+json">', "<\/script> ", '<div style="padding-top: 4.5rem;" data-astro-cid-skaurlmh> <!-- Back nav --> <div style="background: hsl(220 40% 5%); border-bottom: 1px solid hsl(38 80% 55% / 0.12); padding: 1rem 0;" data-astro-cid-skaurlmh> <div class="container-custom" data-astro-cid-skaurlmh> <a href="/case-studies" style="font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: hsl(210 15% 50%); text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; transition: color 0.2s;" data-astro-cid-skaurlmh>\n← All Case Studies\n</a> </div> </div> <!-- Hero --> <section style="padding: 5rem 0 3rem; background: linear-gradient(180deg, hsl(220 40% 5%) 0%, var(--page-bg) 100%); border-bottom: 1px solid hsl(38 80% 55% / 0.12);" data-astro-cid-skaurlmh> <div class="container-custom" style="max-width: 860px;" data-astro-cid-skaurlmh> <!-- Tags --> <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;" data-astro-cid-skaurlmh> ', ` </div> <h1 style="font-family: var(--font-heading, 'Playfair Display', serif); font-size: clamp(2rem, 4.5vw, 3.25rem); font-weight: 700; color: hsl(45 30% 92%); margin: 0 0 2rem; line-height: 1.1;" data-astro-cid-skaurlmh> `, ' </h1> <!-- Result callouts --> <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 2.5rem;" data-astro-cid-skaurlmh> <div style="padding: 1.5rem; background: hsl(220 40% 8%); border: 1px solid hsl(38 80% 55% / 0.2); border-radius: 6px; border-top: 2px solid hsl(38 80% 55%);" data-astro-cid-skaurlmh> <p style="font-family: monospace; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: hsl(38 80% 55%); margin: 0 0 0.5rem;" data-astro-cid-skaurlmh>Primary Result</p> <p style="color: hsl(45 30% 88%); font-size: 0.95rem; line-height: 1.5; margin: 0; font-weight: 600;" data-astro-cid-skaurlmh>', "</p> </div> ", ' </div> <!-- Meta row --> <div style="display: flex; flex-wrap: wrap; gap: 2rem; font-size: 0.8rem; color: hsl(210 15% 50%); padding-top: 1.5rem; border-top: 1px solid hsl(220 40% 14%);" data-astro-cid-skaurlmh> <div data-astro-cid-skaurlmh> <span style="display: block; font-family: monospace; font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 0.25rem; color: hsl(210 15% 40%);" data-astro-cid-skaurlmh>Industry</span> ', ' </div> <div data-astro-cid-skaurlmh> <span style="display: block; font-family: monospace; font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 0.25rem; color: hsl(210 15% 40%);" data-astro-cid-skaurlmh>Client</span> ', ' </div> <div data-astro-cid-skaurlmh> <span style="display: block; font-family: monospace; font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 0.25rem; color: hsl(210 15% 40%);" data-astro-cid-skaurlmh>Services</span> ', ' </div> </div> </div> </section> <!-- Content --> <article class="container-custom cs-prose" style="max-width: 860px; padding-top: 4rem; padding-bottom: 5rem;" data-astro-cid-skaurlmh> ', ` <!-- CTA --> <div style="margin-top: 4rem; padding: 2.5rem; background: hsl(220 40% 7%); border: 1px solid hsl(38 80% 55% / 0.2); border-radius: 8px; text-align: center;" data-astro-cid-skaurlmh> <p style="font-family: monospace; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: hsl(38 80% 55%); margin-bottom: 0.75rem;" data-astro-cid-skaurlmh>Want Results Like These?</p> <h2 style="font-family: var(--font-heading, serif); font-size: 1.5rem; font-weight: 700; color: hsl(45 30% 92%); margin: 0 0 1rem;" data-astro-cid-skaurlmh>
Start with an AI Citation Audit
</h2> <p style="color: hsl(210 15% 55%); font-size: 0.9rem; margin-bottom: 1.5rem;" data-astro-cid-skaurlmh>
We'll show you exactly where you're invisible in AI search — and what it will take to change that.
</p> <a href="/contact" style="display: inline-block; background: hsl(38 80% 55%); color: hsl(220 40% 8%); padding: 0.75rem 2rem; border-radius: 4px; font-weight: 700; font-size: 0.85rem; text-decoration: none; letter-spacing: 0.08em; text-transform: uppercase;" data-astro-cid-skaurlmh>Request Your Audit</a> </div> </article> </div> `])), unescapeHTML(JSON.stringify(breadcrumb)), unescapeHTML(JSON.stringify(caseStudySchema)), maybeRenderHead(), (entry.data.tags ?? []).map((tag) => renderTemplate`<span style="font-family: monospace; font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.2rem 0.6rem; background: hsl(38 80% 55% / 0.1); border: 1px solid hsl(38 80% 55% / 0.2); border-radius: 3px; color: hsl(38 80% 55%);" data-astro-cid-skaurlmh>${tag}</span>`), entry.data.title, entry.data.results.primary, entry.data.results.secondary && renderTemplate`<div style="padding: 1.5rem; background: hsl(220 40% 8%); border: 1px solid hsl(145 60% 40% / 0.2); border-radius: 6px; border-top: 2px solid hsl(145 60% 50%);" data-astro-cid-skaurlmh> <p style="font-family: monospace; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: hsl(145 60% 50%); margin: 0 0 0.5rem;" data-astro-cid-skaurlmh>Secondary Result</p> <p style="color: hsl(45 30% 88%); font-size: 0.95rem; line-height: 1.5; margin: 0;" data-astro-cid-skaurlmh>${entry.data.results.secondary}</p> </div>`, entry.data.industry, entry.data.client, (entry.data.services ?? []).join(" · "), renderComponent($$result2, "Content", Content, { "data-astro-cid-skaurlmh": true })) })}`;
}, "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/case-studies/[slug].astro", void 0);
const $$file = "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/case-studies/[slug].astro";
const $$url = "/case-studies/[slug]";
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
