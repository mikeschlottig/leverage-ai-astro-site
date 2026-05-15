globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_P2T-B9sK.mjs";
import { c as renderComponent, r as renderTemplate, m as maybeRenderHead, a as addAttribute } from "./worker-entry_D9jsJv2k.mjs";
import { $ as $$BaseLayout, r as renderScript } from "./BaseLayout_5CMa3oI8.mjs";
const $$Library = createComponent(($$result, $$props, $$slots) => {
  const groups = [
    {
      id: "group-a",
      title: "[GROUP_A_TITLE]",
      // e.g. "Core Ingredients", "Tier 1 Services"
      description: "[GROUP_A_DESCRIPTION]",
      entries: [
        {
          id: "entry-1",
          name: "[ENTRY_1_NAME]",
          function: "[ENTRY_1_FUNCTION]",
          // Short descriptor, e.g. "Primary Medium"
          description: "[ENTRY_1_DESCRIPTION — 2–3 sentences explaining what this is and why it matters.]",
          foundIn: ["[ITEM_1]", "[ITEM_2]"],
          // Cross-reference to catalog items
          tags: ["[TAG_1]", "[TAG_2]"]
        },
        {
          id: "entry-2",
          name: "[ENTRY_2_NAME]",
          function: "[ENTRY_2_FUNCTION]",
          description: "[ENTRY_2_DESCRIPTION]",
          foundIn: ["[ITEM_1]"],
          tags: ["[TAG_1]"]
        }
      ]
    },
    {
      id: "group-b",
      title: "[GROUP_B_TITLE]",
      description: "[GROUP_B_DESCRIPTION]",
      entries: [
        {
          id: "entry-3",
          name: "[ENTRY_3_NAME]",
          function: "[ENTRY_3_FUNCTION]",
          description: "[ENTRY_3_DESCRIPTION]",
          foundIn: ["[ITEM_2]"],
          tags: ["[TAG_2]", "[TAG_3]"]
        }
      ]
    }
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "[LIBRARY_TITLE] | [YOUR_BRAND_NAME]", "description": "[LIBRARY_META_DESCRIPTION]", "keywords": "[library keywords, specific entry names, technical terms]" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div style="padding-top: 4.5rem;"> <!-- ─── Page Hero ──────────────────────────────────────── --> <section style="padding: 5rem 0 3rem; background-color: var(--surface-1); border-bottom: 1px solid var(--border-subtle);"> <div class="container-custom"> <p class="eyebrow" style="margin-bottom: 0.75rem;">[LIBRARY_EYEBROW]</p> <h1 style="font-family: var(--font-heading); font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 300; margin: 0 0 1rem;">
[LIBRARY_HEADLINE]
</h1> <p style="color: var(--text-secondary); max-width: 580px; line-height: 1.7; margin-bottom: 2rem;">
[LIBRARY_DESCRIPTION]
</p> <!-- Group anchor links --> <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;"> ${groups.map((g) => renderTemplate`<a${addAttribute(`#${g.id}`, "href")} class="btn-secondary" style="font-size: 0.7rem; padding: 0.4rem 0.875rem;"> ${g.title} </a>`)} </div> </div> </section> <!-- ─── Library Groups ─────────────────────────────────── --> ${groups.map((group, gi) => renderTemplate`<section${addAttribute(group.id, "id")} class="section-padding"${addAttribute(`background-color: ${gi % 2 === 0 ? "var(--page-bg)" : "var(--surface-1)"};`, "style")}> <div class="container-custom"> <!-- Group header --> <div style="margin-bottom: 3rem;"> <h2 style="font-family: var(--font-heading); font-size: 2rem; font-weight: 300; margin: 0 0 0.75rem;">${group.title}</h2> <p style="color: var(--text-secondary); max-width: 500px;">${group.description}</p> </div> <!-- Entry grid --> <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;"> ${group.entries.map((entry) => renderTemplate`<div${addAttribute(entry.id, "id")} class="fade-up" style="padding: 1.75rem; background-color: var(--surface-2); border: 1px solid var(--border-subtle); border-radius: var(--border-radius);"> <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;"> <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 300; margin: 0;">${entry.name}</h3> <span style="font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); padding: 0.2rem 0.5rem; border: 1px solid var(--accent); border-radius: var(--border-radius);"> ${entry.function} </span> </div> <p style="color: var(--text-secondary); font-size: 0.875rem; line-height: 1.7; margin-bottom: 1rem;">${entry.description}</p> ${entry.foundIn.length > 0 && renderTemplate`<div style="margin-bottom: 0.75rem;"> <p style="font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">Found In</p> <div style="display: flex; flex-wrap: wrap; gap: 0.375rem;"> ${entry.foundIn.map((item) => renderTemplate`<span style="font-size: 0.7rem; padding: 0.2rem 0.5rem; background-color: var(--surface-1); border: 1px solid var(--border-subtle); border-radius: var(--border-radius); color: var(--text-muted);"> ${item} </span>`)} </div> </div>`} ${entry.tags.length > 0 && renderTemplate`<div style="display: flex; flex-wrap: wrap; gap: 0.375rem;"> ${entry.tags.map((tag) => renderTemplate`<span style="font-size: 0.65rem; color: var(--accent);">#${tag}</span>`)} </div>`} </div>`)} </div> </div> </section>`)} <!-- ─── CTA Block ──────────────────────────────────────── --> <section class="section-padding" style="background-color: var(--surface-1); text-align: center;"> <div class="container-custom" style="max-width: 560px;"> <p class="eyebrow" style="margin-bottom: 0.75rem;">[CTA_EYEBROW]</p> <h2 style="font-family: var(--font-heading); font-size: clamp(1.8rem, 3vw, 2.5rem); font-weight: 300; margin: 0 0 1rem;">
[CTA_HEADLINE]
</h2> <p style="color: var(--text-secondary); margin-bottom: 2rem;">[CTA_SUBTEXT]</p> <a href="/catalog" class="btn-primary" style="margin-right: 0.75rem;">[CTA_PRIMARY]</a> <a href="/#contact" class="btn-secondary">[CTA_SECONDARY]</a> </div> </section> </div> ` })} ${renderScript($$result, "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/library.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/library.astro", void 0);
const $$file = "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/library.astro";
const $$url = "/library";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Library,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
