globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_P2T-B9sK.mjs";
import { c as renderComponent, r as renderTemplate, m as maybeRenderHead } from "./worker-entry_D9jsJv2k.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_5CMa3oI8.mjs";
const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "404 | Leverage AI", "description": "The page you are looking for does not exist.", "noIndex": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section style="
      padding-top: 10rem;
      padding-bottom: 8rem;
      background-color: var(--page-bg);
      min-height: 80vh;
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;
    "> <div style="position:absolute; inset:0; background:radial-gradient(ellipse at 50% 40%, rgba(212,144,15,0.04) 0%, transparent 65%); pointer-events:none;"></div> <div class="container-custom" style="position: relative; z-index: 1; text-align: center; max-width: 580px; margin: 0 auto;"> <!-- Large 404 --> <p style="
          font-family: var(--font-heading);
          font-size: clamp(5rem, 15vw, 10rem);
          font-weight: 300;
          color: var(--accent);
          margin: 0;
          line-height: 1;
          opacity: 0.85;
        ">
404
</p> <h1 style="
          font-family: var(--font-heading);
          font-size: clamp(1.75rem, 4vw, 2.75rem);
          font-weight: 300;
          color: var(--text-primary);
          margin: 0.5rem 0 1.25rem;
        ">
Page Not Found
</h1> <p style="font-size: 1rem; color: var(--text-secondary); line-height: 1.7; margin: 0 0 2.5rem;">
The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.
        Let&rsquo;s get you back on track.
</p> <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;"> <a href="/" class="btn-primary">Go Home</a> <a href="/case-studies" class="btn-secondary">View Our Work</a> </div> <!-- Decorative divider --> <div style="
          margin-top: 4rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-subtle);
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-muted);
        ">
LEVERAGE AI LLC &mdash; AI-First Digital Strategy
</div> </div> </section> ` })}`;
}, "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/404.astro", void 0);
const $$file = "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/404.astro";
const $$url = "/404";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
