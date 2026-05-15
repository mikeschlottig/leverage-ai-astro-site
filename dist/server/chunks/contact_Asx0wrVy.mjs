globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_P2T-B9sK.mjs";
import { c as renderComponent, r as renderTemplate, a as addAttribute, m as maybeRenderHead, u as unescapeHTML } from "./worker-entry_D9jsJv2k.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_5CMa3oI8.mjs";
import { C as ContactForm } from "./ContactForm_aJdVGDtP.mjs";
import { c as contactConfig, s as siteConfig } from "./createLucideIcon_DZRUm3Z8.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Contact = createComponent(($$result, $$props, $$slots) => {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Contact", item: `${siteConfig.url}/contact` }
    ]
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Contact | Leverage AI", "description": "Get in touch with Leverage AI LLC. Start your AI search optimization or design strategy project today — based in Grants Pass, Oregon.", "keywords": "contact Leverage AI, AI search agency contact, Grants Pass Oregon digital agency, start AI strategy project" }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">', "<\/script>  ", '<section style="\n      padding-top: 10rem;\n      padding-bottom: 5rem;\n      background-color: var(--page-bg);\n      position: relative;\n      overflow: hidden;\n    "> <div style="position:absolute; top:-5%; right:-5%; width:600px; height:600px; background:radial-gradient(ellipse, rgba(212,144,15,0.05) 0%, transparent 70%); pointer-events:none;"></div> <div class="container-custom" style="position: relative; z-index: 1; max-width: 700px;"> <p class="eyebrow" style="margin-bottom: 1rem;">', '</p> <h1 style="\n          font-family: var(--font-heading);\n          font-size: clamp(2.5rem, 5.5vw, 4.5rem);\n          font-weight: 300;\n          line-height: 1.1;\n          color: var(--text-primary);\n          margin: 0 0 1.5rem;\n        "> ', ' </h1> <p style="font-size: 1.05rem; color: var(--text-secondary); line-height: 1.7; max-width: 520px; margin: 0;"> ', ' </p> <!-- Contact items quick reference --> <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; margin-top: 2.5rem;"> ', ` </div> </div> </section>  <section style="
      background: hsl(220 40% 5%);
      border-top: 1px solid hsl(38 80% 55% / 0.12);
      border-bottom: 1px solid hsl(38 80% 55% / 0.12);
      padding: 3.5rem 0;
    "> <div class="container-custom" style="max-width: 700px; text-align: center;"> <p style="
          font-family: monospace;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: hsl(38 80% 55%);
          margin-bottom: 0.75rem;
        ">
Schedule a Call
</p> <h2 style="
          font-family: var(--font-heading, 'Playfair Display', serif);
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 700;
          color: hsl(45 30% 92%);
          margin: 0 0 1rem;
        "> `, ` </h2> <p style="color: hsl(210 15% 55%); font-size: 0.9rem; margin-bottom: 2rem; max-width: 480px; margin-left: auto; margin-right: auto;">
30 minutes. No fluff. We'll assess your AI search visibility, show you where the gaps are, and tell you exactly what it would take to close them.
</p> <!-- Cal.com inline embed --> <div id="cal-booking-embed" style="
          background: hsl(220 40% 7%);
          border: 1px solid hsl(38 80% 55% / 0.2);
          border-radius: 8px;
          overflow: hidden;
          min-height: 500px;
          position: relative;
        "> <!-- Inline Cal.com embed via iframe fallback --> <iframe`, ' style="width: 100%; min-height: 500px; border: none; display: block;" loading="lazy" title="Book a Free Discovery Call with Leverage AI" allow="camera; microphone; payment"></iframe> </div> <p style="color: hsl(210 15% 40%); font-size: 0.75rem; margin-top: 1rem;">\nPrefer email? Reach us at <a href="mailto:leverage_labs_alpha@proton.me" style="color: hsl(38 80% 55%);">leverage_labs_alpha@proton.me</a> </p> </div> </section>  ', " "])), unescapeHTML(JSON.stringify(breadcrumb)), maybeRenderHead(), contactConfig.eyebrow, contactConfig.headline, contactConfig.subtext, contactConfig.contactItems.map((item) => renderTemplate`<div style="display: flex; align-items: center; gap: 0.6rem;"> <span style="font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-muted);"> ${item.label} </span> <span style="color: var(--border-subtle);">|</span> ${item.href ? renderTemplate`<a${addAttribute(item.href, "href")} style="font-size: 0.9rem; color: var(--accent); text-decoration: none;"> ${item.value} </a>` : renderTemplate`<span style="font-size: 0.9rem; color: var(--text-secondary);">${item.value}</span>`} </div>`), contactConfig.calCtaText, addAttribute(`${contactConfig.calLink}?embed=true&theme=dark&layout=month_view`, "src"), renderComponent($$result2, "ContactForm", ContactForm, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "C:/Users/mikes/Leverage-AI-Astro-Site/src/components/ContactForm", "client:component-export": "default" })) })}`;
}, "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/contact.astro", void 0);
const $$file = "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/contact.astro";
const $$url = "/contact";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Contact,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
