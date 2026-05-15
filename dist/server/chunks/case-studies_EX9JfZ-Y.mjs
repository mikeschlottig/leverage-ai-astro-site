globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_P2T-B9sK.mjs";
import { c as renderComponent, r as renderTemplate, a as addAttribute, m as maybeRenderHead, u as unescapeHTML } from "./worker-entry_D9jsJv2k.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_5CMa3oI8.mjs";
import { C as CaseStudySection } from "./CaseStudySection_CXH8gwAY.mjs";
import { g as getCollection } from "./_astro_content_q8QYHCI6.mjs";
import { s as siteConfig, p as portfolioConfig, m as metricsConfig } from "./createLucideIcon_DZRUm3Z8.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$CaseStudies = createComponent(async ($$result, $$props, $$slots) => {
  const allCaseStudies = await getCollection("caseStudies");
  const caseStudies = allCaseStudies.sort((a, b) => a.data.order - b.data.order);
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Case Studies", item: `${siteConfig.url}/case-studies` }
    ]
  };
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Case Studies | Leverage AI",
    url: `${siteConfig.url}/case-studies`,
    mainEntity: caseStudies.map((s) => ({ "@type": "CreativeWork", name: s.data.title, url: `${siteConfig.url}/case-studies/${s.id}` }))
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Case Studies | Leverage AI", "description": "Explore how Leverage AI has delivered measurable AI search visibility and design results for clients across industries.", "keywords": "AI search case studies, GEO results, brand visibility, digital strategy results, Portland Oregon", "data-astro-cid-44gysecv": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">', '<\/script> <script type="application/ld+json">', "<\/script>  ", '<section style="\n      padding-top: 10rem;\n      padding-bottom: 5rem;\n      background-color: var(--page-bg);\n      position: relative;\n      overflow: hidden;\n    " data-astro-cid-44gysecv> <div style="position:absolute; top:-5%; left:-5%; width:700px; height:500px; background:radial-gradient(ellipse, rgba(212,144,15,0.05) 0%, transparent 70%); pointer-events:none;" data-astro-cid-44gysecv></div> <div class="container-custom" style="position: relative; z-index: 1; max-width: 800px;" data-astro-cid-44gysecv> <p class="eyebrow" style="margin-bottom: 1rem;" data-astro-cid-44gysecv>Our Work</p> <h1 style="\n          font-family: var(--font-heading);\n          font-size: clamp(2.8rem, 6vw, 5rem);\n          font-weight: 300;\n          line-height: 1.1;\n          color: var(--text-primary);\n          margin: 0 0 1.5rem;\n        " data-astro-cid-44gysecv>\nCase Studies\n</h1> <p style="font-size: 1.1rem; color: var(--text-secondary); line-height: 1.7; max-width: 560px; margin: 0;" data-astro-cid-44gysecv>\nEvery number represents a real brand transformation. Here is how we do it.\n</p> </div> </section>  ', ' <section id="enterprise" class="section-padding" style="background-color: var(--page-bg);" data-astro-cid-44gysecv> <div class="container-custom" data-astro-cid-44gysecv> <div class="glass fade-up" style="\n          padding: 3rem;\n          border-radius: var(--border-radius);\n          border: 1px solid var(--border-accent);\n          display: grid;\n          grid-template-columns: 1fr 1fr;\n          gap: 3rem;\n          align-items: center;\n          background: linear-gradient(135deg, var(--surface-1) 0%, var(--surface-2) 100%);\n        " data-astro-cid-44gysecv> <div data-astro-cid-44gysecv> <p style="\n              font-size: 0.65rem;\n              letter-spacing: 0.2em;\n              text-transform: uppercase;\n              color: var(--accent);\n              margin: 0 0 1rem;\n            " data-astro-cid-44gysecv> ', ' </p> <h2 style="\n              font-family: var(--font-heading);\n              font-size: clamp(1.5rem, 3vw, 2.25rem);\n              font-weight: 300;\n              color: var(--text-primary);\n              margin: 0 0 1.25rem;\n              line-height: 1.2;\n            " data-astro-cid-44gysecv> ', ' </h2> <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.75; margin: 0 0 1.75rem;" data-astro-cid-44gysecv> ', " </p> <a", ' class="btn-primary" style="font-size: 0.8rem;" data-astro-cid-44gysecv>\nRead Full Case Study\n</a> </div> <div style="display: flex; flex-direction: column; gap: 1rem;" data-astro-cid-44gysecv> ', ' </div> </div> </div> </section>  <section id="portfolio" class="section-padding" style="background-color: var(--page-bg);" data-astro-cid-44gysecv> <div class="container-custom" data-astro-cid-44gysecv> <div style="margin-bottom: 3rem;" data-astro-cid-44gysecv> <p class="eyebrow" style="margin-bottom: 0.75rem;" data-astro-cid-44gysecv>', '</p> <h2 style="\n            font-family: var(--font-heading);\n            font-size: clamp(1.8rem, 3.5vw, 2.75rem);\n            font-weight: 300;\n            color: var(--text-primary);\n            margin: 0 0 1rem;\n          " data-astro-cid-44gysecv> ', ' </h2> <p style="color: var(--text-secondary); font-size: 0.9rem; max-width: 560px; line-height: 1.7; margin: 0;" data-astro-cid-44gysecv>\nLive client work, interactive tools, and web apps — each built with AI visibility and conversion as the primary objectives.\n</p> </div> <div style="\n          display: grid;\n          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n          gap: 1.5rem;\n        " class="portfolio-grid" data-astro-cid-44gysecv> ', " </div> </div> </section>  ", " "])), unescapeHTML(JSON.stringify(breadcrumb)), unescapeHTML(JSON.stringify(collectionSchema)), maybeRenderHead(), caseStudies.length > 0 && renderTemplate`<section class="section-padding" style="background-color: var(--surface-1);" data-astro-cid-44gysecv> <div class="container-custom" data-astro-cid-44gysecv> <div style="
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 1.5rem;
          " class="case-grid" data-astro-cid-44gysecv> ${caseStudies.map((study) => renderTemplate`<article class="glass fade-up premium-hover" style="
                border-radius: var(--border-radius);
                border: 1px solid var(--border-subtle);
                overflow: hidden;
                display: flex;
                flex-direction: column;
              " data-astro-cid-44gysecv> <!-- Image placeholder --> <div style="
                  aspect-ratio: 16/9;
                  background-color: var(--surface-2);
                  overflow: hidden;
                  position: relative;
                " data-astro-cid-44gysecv> ${study.data.image ? renderTemplate`<img${addAttribute(study.data.image, "src")}${addAttribute(study.data.title, "alt")} loading="lazy" style="width: 100%; height: 100%; object-fit: cover;" data-astro-cid-44gysecv>` : renderTemplate`<div style="
                      width: 100%;
                      height: 100%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      background: linear-gradient(135deg, var(--surface-2) 0%, var(--surface-1) 100%);
                    " data-astro-cid-44gysecv> <span style="font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-muted);" data-astro-cid-44gysecv> ${study.data.industry} </span> </div>`} ${study.data.featured && renderTemplate`<div style="
                      position: absolute;
                      top: 0.75rem;
                      left: 0.75rem;
                      font-size: 0.6rem;
                      letter-spacing: 0.15em;
                      text-transform: uppercase;
                      background: var(--accent);
                      color: #0d1119;
                      padding: 0.2rem 0.6rem;
                      border-radius: 999px;
                      font-weight: 600;
                    " data-astro-cid-44gysecv>
Featured
</div>`} </div> <!-- Content --> <div style="padding: 1.5rem; flex: 1; display: flex; flex-direction: column; gap: 0.75rem;" data-astro-cid-44gysecv> <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem;" data-astro-cid-44gysecv> <span style="font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent);" data-astro-cid-44gysecv> ${study.data.industry} </span> ${study.data.date && renderTemplate`<span style="font-size: 0.65rem; color: var(--text-muted); flex-shrink: 0;" data-astro-cid-44gysecv> ${new Date(study.data.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })} </span>`} </div> <h2 style="
                    font-family: var(--font-heading);
                    font-size: 1.25rem;
                    font-weight: 300;
                    color: var(--text-primary);
                    margin: 0;
                    line-height: 1.3;
                  " data-astro-cid-44gysecv> ${study.data.title} </h2> <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;" data-astro-cid-44gysecv> ${study.data.client} </p> <!-- Results highlight --> <div style="
                    background-color: var(--surface-2);
                    border-left: 2px solid var(--accent);
                    padding: 0.75rem 1rem;
                    border-radius: 0 calc(var(--border-radius) / 2) calc(var(--border-radius) / 2) 0;
                    margin-top: 0.25rem;
                  " data-astro-cid-44gysecv> <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0; line-height: 1.5;" data-astro-cid-44gysecv> ${study.data.results.primary} </p> ${study.data.results.secondary && renderTemplate`<p style="font-size: 0.78rem; color: var(--text-muted); margin: 0.4rem 0 0; line-height: 1.5;" data-astro-cid-44gysecv> ${study.data.results.secondary} </p>`} </div> <!-- Service tags --> <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.5rem;" data-astro-cid-44gysecv> ${study.data.services.map((svc) => renderTemplate`<span style="
                        padding: 0.2rem 0.6rem;
                        font-size: 0.65rem;
                        letter-spacing: 0.08em;
                        text-transform: uppercase;
                        border: 1px solid var(--border-subtle);
                        border-radius: 999px;
                        color: var(--text-muted);
                      " data-astro-cid-44gysecv> ${svc} </span>`)} </div> </div> </article>`)} </div> </div> </section>`, metricsConfig.featuredCaseStudy.eyebrow, metricsConfig.featuredCaseStudy.title, metricsConfig.featuredCaseStudy.description, addAttribute(metricsConfig.featuredCaseStudy.href, "href"), metricsConfig.featuredCaseStudy.tags.map((tag) => renderTemplate`<div style="
                padding: 1rem 1.25rem;
                background-color: var(--surface-1);
                border: 1px solid var(--border-subtle);
                border-radius: var(--border-radius);
                font-size: 0.8rem;
                color: var(--text-secondary);
                display: flex;
                align-items: center;
                gap: 0.75rem;
              " data-astro-cid-44gysecv> <span style="color: var(--accent); font-size: 1rem;" data-astro-cid-44gysecv>&#10003;</span> ${tag} </div>`), portfolioConfig.eyebrow, portfolioConfig.headline, portfolioConfig.items.map((item) => renderTemplate`<a${addAttribute(item.url, "href")} target="_blank" rel="noopener noreferrer" class="glass fade-up portfolio-card" style="
              border-radius: var(--border-radius);
              border: 1px solid var(--border-subtle);
              overflow: hidden;
              display: flex;
              flex-direction: column;
              text-decoration: none;
              transition: border-color 0.25s ease, transform 0.25s ease;
              cursor: pointer;
            " data-astro-cid-44gysecv> <!-- Image / Thumbnail --> <div style="
                aspect-ratio: 16/9;
                background-color: var(--surface-2);
                overflow: hidden;
                position: relative;
              " data-astro-cid-44gysecv> ${item.image ? renderTemplate`<img${addAttribute(item.image, "src")}${addAttribute(item.title, "alt")} loading="lazy" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;" data-astro-cid-44gysecv>` : renderTemplate`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--surface-2),var(--surface-1));" data-astro-cid-44gysecv> <span style="font-size:0.65rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);" data-astro-cid-44gysecv>${item.type}</span> </div>`} <!-- Badge top-left --> <div style="
                  position: absolute;
                  top: 0.75rem;
                  left: 0.75rem;
                  font-size: 0.6rem;
                  letter-spacing: 0.15em;
                  text-transform: uppercase;
                  background: var(--surface-2);
                  border: 1px solid var(--border-accent);
                  color: var(--accent);
                  padding: 0.2rem 0.6rem;
                  border-radius: 999px;
                  font-weight: 600;
                " data-astro-cid-44gysecv> ${item.badge} </div> <!-- Status badge top-right --> ${item.status === "coming-soon" ? renderTemplate`<div style="
                    position: absolute;
                    top: 0.75rem;
                    right: 0.75rem;
                    font-size: 0.6rem;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    background: rgba(0,0,0,0.6);
                    color: var(--text-muted);
                    padding: 0.2rem 0.6rem;
                    border-radius: 999px;
                    backdrop-filter: blur(4px);
                  " data-astro-cid-44gysecv>
Coming Soon
</div>` : renderTemplate`<div style="
                    position: absolute;
                    top: 0.75rem;
                    right: 0.75rem;
                    font-size: 0.6rem;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    background: rgba(16, 140, 64, 0.85);
                    color: #fff;
                    padding: 0.2rem 0.6rem;
                    border-radius: 999px;
                    backdrop-filter: blur(4px);
                  " data-astro-cid-44gysecv>
Live ↗
</div>`} </div> <!-- Content --> <div style="padding: 1.5rem; flex: 1; display: flex; flex-direction: column; gap: 0.6rem;" data-astro-cid-44gysecv> <h3 style="
                  font-family: var(--font-heading);
                  font-size: 1.15rem;
                  font-weight: 300;
                  color: var(--text-primary);
                  margin: 0;
                  line-height: 1.3;
                " data-astro-cid-44gysecv> ${item.title} </h3> <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.65; margin: 0; flex: 1;" data-astro-cid-44gysecv> ${item.description} </p> <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.25rem;" data-astro-cid-44gysecv> ${item.tags.map((tag) => renderTemplate`<span style="
                      padding: 0.18rem 0.55rem;
                      font-size: 0.62rem;
                      letter-spacing: 0.08em;
                      text-transform: uppercase;
                      border: 1px solid var(--border-subtle);
                      border-radius: 999px;
                      color: var(--text-muted);
                    " data-astro-cid-44gysecv> ${tag} </span>`)} </div> </div> </a>`), renderComponent($$result2, "CaseStudySection", CaseStudySection, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "C:/Users/mikes/Leverage-AI-Astro-Site/src/components/CaseStudySection", "client:component-export": "default", "data-astro-cid-44gysecv": true })) })}`;
}, "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/case-studies.astro", void 0);
const $$file = "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/case-studies.astro";
const $$url = "/case-studies";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$CaseStudies,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
