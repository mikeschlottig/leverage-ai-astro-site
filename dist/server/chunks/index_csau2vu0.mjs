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
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const allPosts = await getCollection("blog");
  const posts = allPosts.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
  const featured = posts.find((p) => p.data.featured) ?? posts[0];
  const rest = posts.filter((p) => p.id !== featured?.id);
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/blog` }
    ]
  };
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Blog | Leverage AI",
    description: "Insights and analysis on AI search optimization, GEO strategy, brand visibility, and design intelligence.",
    url: `${siteConfig.url}/blog`,
    mainEntity: posts.map((p) => ({ "@type": "BlogPosting", headline: p.data.title, url: `${siteConfig.url}/blog/${p.id}` }))
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Blog | Leverage AI", "description": "Insights and analysis on AI search optimization, GEO strategy, brand visibility, and design intelligence — from the LEVERAGE AI team.", "keywords": "AI search blog, GEO strategy, generative engine optimization insights, AI visibility tips, brand strategy blog", "data-astro-cid-5tznm7mj": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">', '<\/script> <script type="application/ld+json">', "<\/script> ", '<div style="padding-top: 4.5rem;" data-astro-cid-5tznm7mj> <!-- ─── Featured Post ──────────────────────────────────── --> ', ' <!-- ─── All Posts Grid ─────────────────────────────────── --> <section class="section-padding" style="background-color: var(--page-bg);" data-astro-cid-5tznm7mj> <div class="container-custom" data-astro-cid-5tznm7mj> <h2 style="\n            font-family: var(--font-heading);\n            font-size: clamp(1.5rem, 3vw, 2rem);\n            font-weight: 300;\n            margin: 0 0 2.5rem;\n            color: var(--text-primary);\n          " data-astro-cid-5tznm7mj> ', " </h2> ", ' <!-- Research CTA --> <div style="\n            margin-top: 3rem;\n            padding: 2.5rem;\n            background-color: var(--surface-1);\n            border: 1px solid var(--border-accent);\n            border-radius: var(--border-radius);\n            display: grid;\n            grid-template-columns: 1fr auto;\n            gap: 2rem;\n            align-items: center;\n          " class="research-cta" data-astro-cid-5tznm7mj> <div data-astro-cid-5tznm7mj> <p class="eyebrow" style="margin-bottom: 0.5rem;" data-astro-cid-5tznm7mj>Deep Dive</p> <h3 style="\n                font-family: var(--font-heading);\n                font-size: 1.5rem;\n                font-weight: 300;\n                margin: 0 0 0.5rem;\n                color: var(--text-primary);\n              " data-astro-cid-5tznm7mj>\nAI Search Visibility Report 2025\n</h3> <p style="color: var(--text-secondary); font-size: 0.875rem; margin: 0;" data-astro-cid-5tznm7mj>\nOur in-depth analysis of how AI models discover, rank, and cite brands in generative search.\n</p> </div> <a href="/research" class="btn-primary" style="white-space: nowrap; font-size: 0.8rem;" data-astro-cid-5tznm7mj>\nView Report\n</a> </div> </div> </section> </div> '])), unescapeHTML(JSON.stringify(breadcrumb)), unescapeHTML(JSON.stringify(collectionSchema)), maybeRenderHead(), featured && renderTemplate`<section style="
          padding: 5rem 0 3rem;
          background-color: var(--surface-1);
          position: relative;
          overflow: hidden;
        " data-astro-cid-5tznm7mj> <div style="position:absolute; inset:0; background:radial-gradient(ellipse at 30% 50%, rgba(212,144,15,0.04) 0%, transparent 65%); pointer-events:none;" data-astro-cid-5tznm7mj></div> <div class="container-custom" style="position: relative; z-index: 1;" data-astro-cid-5tznm7mj> <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 2rem;" data-astro-cid-5tznm7mj> <p class="eyebrow" style="margin: 0;" data-astro-cid-5tznm7mj>Featured Post</p> </div> <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;" class="featured-grid" data-astro-cid-5tznm7mj> <!-- Image --> <div style="border-radius: var(--border-radius); overflow: hidden; aspect-ratio: 4/3; background-color: var(--surface-2);" data-astro-cid-5tznm7mj> ${featured.data.image ? renderTemplate`<img${addAttribute(featured.data.image, "src")}${addAttribute(featured.data.title, "alt")} style="width: 100%; height: 100%; object-fit: cover;" loading="eager" data-astro-cid-5tznm7mj>` : renderTemplate`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--surface-2);" data-astro-cid-5tznm7mj> <span style="font-size:0.65rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);" data-astro-cid-5tznm7mj>${featured.data.category}</span> </div>`} </div> <!-- Content --> <div data-astro-cid-5tznm7mj> <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; margin-bottom: 1rem;" data-astro-cid-5tznm7mj> <span style="font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--accent);" data-astro-cid-5tznm7mj> ${featured.data.category} </span> ${featured.data.readingTime && renderTemplate`<span style="font-size: 0.7rem; color: var(--text-muted);" data-astro-cid-5tznm7mj>${featured.data.readingTime}</span>`} <span style="font-size: 0.7rem; color: var(--text-muted);" data-astro-cid-5tznm7mj> ${new Date(featured.data.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })} </span> </div> <h1 style="
                  font-family: var(--font-heading);
                  font-size: clamp(1.8rem, 3.5vw, 3rem);
                  font-weight: 300;
                  margin: 0 0 1rem;
                  line-height: 1.2;
                  color: var(--text-primary);
                " data-astro-cid-5tznm7mj> ${featured.data.title} </h1> ${featured.data.tldr && featured.data.tldr.length > 0 && renderTemplate`<div style="
                    background-color: var(--surface-2);
                    border-left: 3px solid var(--accent);
                    padding: 1rem 1.25rem;
                    margin-bottom: 1.25rem;
                    border-radius: 0 var(--border-radius) var(--border-radius) 0;
                  " data-astro-cid-5tznm7mj> <p style="font-size: 0.8rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--accent); margin: 0 0 0.5rem;" data-astro-cid-5tznm7mj>
TL;DR
</p> <ul style="margin: 0; padding-left: 1.25rem; color: var(--text-secondary); font-size: 1.125rem; line-height: 1.6;" data-astro-cid-5tznm7mj> ${featured.data.tldr.map((point) => renderTemplate`<li data-astro-cid-5tznm7mj>${point}</li>`)} </ul> </div>`} <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 1.5rem; font-size: 0.95rem;" data-astro-cid-5tznm7mj> ${featured.data.excerpt} </p> <a${addAttribute(`/blog/${featured.id}`, "href")} class="btn-primary" style="font-size: 0.8rem;" data-astro-cid-5tznm7mj>
Read Article
</a> </div> </div> </div> </section>`, rest.length > 0 ? "All Posts" : "More Coming Soon", rest.length > 0 && renderTemplate`<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;" class="posts-grid" data-astro-cid-5tznm7mj> ${rest.map((post) => renderTemplate`<article class="fade-up" style="
                  background-color: var(--surface-1);
                  border: 1px solid var(--border-subtle);
                  border-radius: var(--border-radius);
                  overflow: hidden;
                  display: flex;
                  flex-direction: column;
                  transition: border-color 0.25s ease;
                " data-astro-cid-5tznm7mj> <div style="aspect-ratio: 16/9; overflow: hidden; background-color: var(--surface-2);" data-astro-cid-5tznm7mj> ${post.data.image ? renderTemplate`<img${addAttribute(post.data.image, "src")}${addAttribute(post.data.title, "alt")} loading="lazy" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;" data-astro-cid-5tznm7mj>` : renderTemplate`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--surface-2);" data-astro-cid-5tznm7mj> <span style="font-size:0.6rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);" data-astro-cid-5tznm7mj>${post.data.category}</span> </div>`} </div> <div style="padding: 1.25rem; flex: 1; display: flex; flex-direction: column; gap: 0.5rem;" data-astro-cid-5tznm7mj> <div style="display: flex; justify-content: space-between; align-items: center;" data-astro-cid-5tznm7mj> <span style="font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent);" data-astro-cid-5tznm7mj> ${post.data.category} </span> ${post.data.readingTime && renderTemplate`<span style="font-size: 0.7rem; color: var(--text-muted);" data-astro-cid-5tznm7mj>${post.data.readingTime}</span>`} </div> <h3 style="
                      font-family: var(--font-heading);
                      font-size: 1.2rem;
                      font-weight: 300;
                      margin: 0;
                      line-height: 1.3;
                      color: var(--text-primary);
                    " data-astro-cid-5tznm7mj> ${post.data.title} </h3> <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; flex: 1; margin: 0;" data-astro-cid-5tznm7mj> ${post.data.excerpt} </p> <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;" data-astro-cid-5tznm7mj> <a${addAttribute(`/blog/${post.id}`, "href")} style="font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent);" data-astro-cid-5tznm7mj>
Read More &rarr;
</a> <span style="font-size: 0.65rem; color: var(--text-muted);" data-astro-cid-5tznm7mj> ${new Date(post.data.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })} </span> </div> </div> </article>`)} </div>`) })}`;
}, "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/blog/index.astro", void 0);
const $$file = "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/blog/index.astro";
const $$url = "/blog";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
