globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_P2T-B9sK.mjs";
import { m as maybeRenderHead, c as renderComponent, a as addAttribute, r as renderTemplate } from "./worker-entry_D9jsJv2k.mjs";
import { S as ServicesSection } from "./ServicesSection_hx1sCv3n.mjs";
import { d as servicesConfig } from "./createLucideIcon_DZRUm3Z8.mjs";
const $$Services = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section style="
      padding-top: 10rem;
      padding-bottom: 5rem;
      background-color: var(--page-bg);
      position: relative;
      overflow: hidden;
    " data-astro-cid-ucd2ps2b> <div style="position:absolute; top:-10%; right:-5%; width:600px; height:600px; background:radial-gradient(ellipse, rgba(212,144,15,0.05) 0%, transparent 70%); pointer-events:none;" data-astro-cid-ucd2ps2b></div> <div class="container-custom" style="position: relative; z-index: 1; max-width: 800px;" data-astro-cid-ucd2ps2b> <p class="eyebrow" style="margin-bottom: 1rem;" data-astro-cid-ucd2ps2b>${servicesConfig.eyebrow}</p> <h1 style="
          font-family: var(--font-heading);
          font-size: clamp(2.8rem, 6vw, 5rem);
          font-weight: 300;
          line-height: 1.1;
          color: var(--text-primary);
          margin: 0 0 1.5rem;
        " data-astro-cid-ucd2ps2b> ${servicesConfig.headline} </h1> <p style="
          font-size: 1.1rem;
          color: var(--text-secondary);
          line-height: 1.7;
          max-width: 560px;
          margin: 0;
        " data-astro-cid-ucd2ps2b> ${servicesConfig.subheadline} </p> </div> </section> <!-- ─── Services Section (React island) ───────────────────── --> ${renderComponent($$result, "ServicesSection", ServicesSection, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "C:/Users/mikes/Leverage-AI-Astro-Site/src/components/ServicesSection", "client:component-export": "default", "data-astro-cid-ucd2ps2b": true })} <!-- ─── Detailed Service Cards ────────────────────────────── --> <section class="section-padding" style="background-color: var(--page-bg);" data-astro-cid-ucd2ps2b> <div class="container-custom" data-astro-cid-ucd2ps2b> <p class="eyebrow" style="margin-bottom: 0.75rem; text-align: center;" data-astro-cid-ucd2ps2b>Deep Dive</p> <h2 style="
          font-family: var(--font-heading);
          font-size: clamp(1.8rem, 3.5vw, 2.75rem);
          font-weight: 300;
          color: var(--text-primary);
          margin: 0 0 3rem;
          text-align: center;
        " data-astro-cid-ucd2ps2b>
Service Details
</h2> <div style="display: flex; flex-direction: column; gap: 2rem;" data-astro-cid-ucd2ps2b> ${servicesConfig.services.map((service) => renderTemplate`<div${addAttribute(service.id, "id")} class="glass fade-up" style="
              padding: 2.5rem;
              border-radius: var(--border-radius);
              border: 1px solid var(--border-subtle);
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 3rem;
              align-items: start;
            " data-astro-cid-ucd2ps2b> <!-- Left: title + description --> <div data-astro-cid-ucd2ps2b> <div style="
                  display: inline-flex;
                  align-items: center;
                  gap: 0.5rem;
                  font-size: 0.65rem;
                  letter-spacing: 0.15em;
                  text-transform: uppercase;
                  color: var(--accent);
                  margin-bottom: 1rem;
                  padding: 0.3rem 0.75rem;
                  border: 1px solid var(--border-accent);
                  border-radius: 999px;
                " data-astro-cid-ucd2ps2b> ${service.icon} </div> <h3 style="
                  font-family: var(--font-heading);
                  font-size: clamp(1.4rem, 2.5vw, 2rem);
                  font-weight: 300;
                  color: var(--text-primary);
                  margin: 0 0 1rem;
                " data-astro-cid-ucd2ps2b> ${service.title} </h3> <p style="color: var(--text-secondary); line-height: 1.7; margin: 0; font-size: 0.95rem;" data-astro-cid-ucd2ps2b> ${service.description} </p> </div> <!-- Right: details list --> <div data-astro-cid-ucd2ps2b> <p style="
                  font-size: 0.7rem;
                  letter-spacing: 0.15em;
                  text-transform: uppercase;
                  color: var(--text-muted);
                  margin: 0 0 1rem;
                " data-astro-cid-ucd2ps2b>
What's Included
</p> <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem;" data-astro-cid-ucd2ps2b> ${service.details.map((detail) => renderTemplate`<li style="
                      display: flex;
                      align-items: flex-start;
                      gap: 0.75rem;
                      font-size: 0.9rem;
                      color: var(--text-secondary);
                      line-height: 1.5;
                      padding-bottom: 0.75rem;
                      border-bottom: 1px solid var(--border-subtle);
                    " data-astro-cid-ucd2ps2b> <span style="color: var(--accent); flex-shrink: 0; font-size: 1rem; margin-top: 1px;" data-astro-cid-ucd2ps2b>&#8250;</span> ${detail} </li>`)} </ul> </div> </div>`)} </div> </div> </section> <!-- ─── CTA ────────────────────────────────────────────────── --> <section style="
      padding: 5rem 0;
      background-color: var(--surface-1);
      border-top: 1px solid var(--border-subtle);
    " data-astro-cid-ucd2ps2b> <div class="container-custom" style="text-align: center; max-width: 600px;" data-astro-cid-ucd2ps2b> <p class="eyebrow" style="margin-bottom: 0.75rem;" data-astro-cid-ucd2ps2b>Get Started</p> <h2 style="
          font-family: var(--font-heading);
          font-size: clamp(1.8rem, 3.5vw, 2.75rem);
          font-weight: 300;
          color: var(--text-primary);
          margin: 0 0 1rem;
        " data-astro-cid-ucd2ps2b>
Ready to Build Your AI Advantage?
</h2> <p style="color: var(--text-secondary); margin: 0 0 2rem; line-height: 1.7;" data-astro-cid-ucd2ps2b>
Every engagement is custom-scoped. Let's talk about where your brand stands today and where it needs to be.
</p> <a href="/contact" class="btn-primary" data-astro-cid-ucd2ps2b>Request a Strategy Call</a> </div> </section> `;
}, "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/services.astro", void 0);
const $$file = "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/services.astro";
const $$url = "/services";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Services,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
