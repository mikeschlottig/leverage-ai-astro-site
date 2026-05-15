globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_P2T-B9sK.mjs";
import { c as renderComponent, r as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from "./worker-entry_D9jsJv2k.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_5CMa3oI8.mjs";
import { a as aboutConfig, s as siteConfig } from "./createLucideIcon_DZRUm3Z8.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$About = createComponent(($$result, $$props, $$slots) => {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "About", item: `${siteConfig.url}/about` }
    ]
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "About Us | Leverage AI", "description": "Learn about Leverage AI LLC — a Grants Pass, Oregon agency pioneering AI search visibility and design strategy for forward-thinking brands.", "data-astro-cid-kh7btl4r": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">', "<\/script>  ", '<section style="padding-top: 10rem; padding-bottom: 5rem; background-color: var(--page-bg); position: relative; overflow: hidden;" data-astro-cid-kh7btl4r> <!-- Subtle radial accent --> <div style="position:absolute; top:-10%; left:50%; transform:translateX(-50%); width:800px; height:600px; background:radial-gradient(ellipse, rgba(212,144,15,0.06) 0%, transparent 70%); pointer-events:none;" data-astro-cid-kh7btl4r></div> <div class="container-custom" style="position:relative; z-index:1; max-width: 800px;" data-astro-cid-kh7btl4r> <p class="eyebrow" style="margin-bottom: 1rem;" data-astro-cid-kh7btl4r>', '</p> <h1 style="\n          font-family: var(--font-heading);\n          font-size: clamp(2.8rem, 6vw, 5rem);\n          font-weight: 300;\n          line-height: 1.1;\n          color: var(--text-primary);\n          margin: 0 0 2rem;\n        " data-astro-cid-kh7btl4r> ', ' </h1> <div style="display: flex; flex-direction: column; gap: 1.25rem; max-width: 640px;" data-astro-cid-kh7btl4r> ', ' </div> </div> </section>  <section class="section-padding" style="background-color: var(--surface-1);" data-astro-cid-kh7btl4r> <div class="container-custom" data-astro-cid-kh7btl4r> <p class="eyebrow" style="margin-bottom: 0.75rem; text-align: center;" data-astro-cid-kh7btl4r>Our Principles</p> <h2 style="\n          font-family: var(--font-heading);\n          font-size: clamp(1.8rem, 3.5vw, 2.75rem);\n          font-weight: 300;\n          color: var(--text-primary);\n          margin: 0 0 3rem;\n          text-align: center;\n        " data-astro-cid-kh7btl4r>\nWhat We Stand For\n</h2> <div style="\n          display: grid;\n          grid-template-columns: repeat(2, 1fr);\n          gap: 1.5rem;\n        " class="values-grid" data-astro-cid-kh7btl4r> ', ' </div> </div> </section>  <section style="\n      padding: 5rem 0;\n      background-color: var(--page-bg);\n      border-top: 1px solid var(--border-subtle);\n      border-bottom: 1px solid var(--border-subtle);\n    " data-astro-cid-kh7btl4r> <div class="container-custom founder-grid" style="max-width: 860px; display: grid; grid-template-columns: 1fr 2fr; gap: 4rem; align-items: center;" data-astro-cid-kh7btl4r> <!-- Left: identity --> <div style="text-align: center;" data-astro-cid-kh7btl4r> <div style="width: 120px; height: 120px; border-radius: 50%; background: hsl(220 40% 10%); border: 2px solid hsl(38 80% 55% / 0.4); margin: 0 auto 1.25rem; overflow: hidden; display: flex; align-items: center; justify-content: center;" data-astro-cid-kh7btl4r> <img src="/images/headshot-hat.jpg" alt="Jon Schlottig — Founder, Leverage AI" width="120" height="120" style="width: 100%; height: 100%; object-fit: cover;" data-astro-cid-kh7btl4r> </div> <p style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 600; color: var(--text-primary); margin: 0 0 0.25rem;" data-astro-cid-kh7btl4r>Jon Schlottig</p> <p style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: hsl(38 80% 55%); margin: 0;" data-astro-cid-kh7btl4r>Founder &mdash; Leverage AI</p> </div> <!-- Right: quote --> <div data-astro-cid-kh7btl4r> <p style="\n            font-family: var(--font-heading);\n            font-size: clamp(1.1rem, 2.5vw, 1.5rem);\n            font-weight: 300;\n            color: var(--text-primary);\n            font-style: italic;\n            line-height: 1.6;\n            margin: 0 0 1.25rem;\n            border-left: 3px solid hsl(38 80% 55%);\n            padding-left: 1.5rem;\n          " data-astro-cid-kh7btl4r>\n&ldquo;Observe. Analyze. Identify. Dissect. Execute with Maximum Leverage. Repeat.&rdquo;\n</p> <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.7; padding-left: 1.5rem; margin: 0;" data-astro-cid-kh7btl4r>\nFounder of Leverage AI. Washed athlete that can still rip a powder day.\n</p> </div> </div> </section>  <section class="section-padding" style="background-color: var(--surface-1);" data-astro-cid-kh7btl4r> <div class="container-custom" style="text-align: center; max-width: 600px;" data-astro-cid-kh7btl4r> <p class="eyebrow" style="margin-bottom: 0.75rem;" data-astro-cid-kh7btl4r>Work With Us</p> <h2 style="\n          font-family: var(--font-heading);\n          font-size: clamp(1.8rem, 3.5vw, 2.75rem);\n          font-weight: 300;\n          color: var(--text-primary);\n          margin: 0 0 1rem;\n        " data-astro-cid-kh7btl4r>\nReady to Own Your Digital Future?\n</h2> <p style="color: var(--text-secondary); margin: 0 0 2rem; line-height: 1.7;" data-astro-cid-kh7btl4r>\nPartner with LEVERAGE AI to make your brand undeniably visible in the AI-first world.\n</p> <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;" data-astro-cid-kh7btl4r> <a href="/contact" class="btn-primary" data-astro-cid-kh7btl4r>Start a Conversation</a> <a href="/case-studies" class="btn-secondary" data-astro-cid-kh7btl4r>See Our Work</a> </div> </div> </section> '])), unescapeHTML(JSON.stringify(breadcrumb)), maybeRenderHead(), aboutConfig.eyebrow, aboutConfig.headline, aboutConfig.paragraphs.map((para) => renderTemplate`<p style="font-size: 1.05rem; color: var(--text-secondary); line-height: 1.8; margin: 0;" data-astro-cid-kh7btl4r> ${para} </p>`), aboutConfig.values.map((value, i) => renderTemplate`<div class="glass fade-up" style="
              padding: 2rem;
              border-radius: var(--border-radius);
              border: 1px solid var(--border-subtle);
              display: flex;
              flex-direction: column;
              gap: 0.75rem;
            " data-astro-cid-kh7btl4r> <div style="
                width: 2.5rem;
                height: 2.5rem;
                border-radius: 50%;
                background: var(--surface-2);
                border: 1px solid var(--border-accent);
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: var(--font-heading);
                font-size: 1rem;
                font-weight: 300;
                color: var(--accent);
              " data-astro-cid-kh7btl4r> ${String(i + 1).padStart(2, "0")} </div> <h3 style="
                font-family: var(--font-heading);
                font-size: 1.35rem;
                font-weight: 300;
                color: var(--text-primary);
                margin: 0;
              " data-astro-cid-kh7btl4r> ${value.title} </h3> <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.65; margin: 0;" data-astro-cid-kh7btl4r> ${value.description} </p> </div>`)) })}`;
}, "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/about.astro", void 0);
const $$file = "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/about.astro";
const $$url = "/about";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$About,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
