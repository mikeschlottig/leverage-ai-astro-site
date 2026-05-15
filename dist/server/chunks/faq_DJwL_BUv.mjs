globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_P2T-B9sK.mjs";
import { c as renderComponent, r as renderTemplate, a as addAttribute, m as maybeRenderHead, u as unescapeHTML } from "./worker-entry_D9jsJv2k.mjs";
import { $ as $$BaseLayout, r as renderScript } from "./BaseLayout_5CMa3oI8.mjs";
import { s as siteConfig } from "./createLucideIcon_DZRUm3Z8.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Faq = createComponent(($$result, $$props, $$slots) => {
  const faqs = [
    {
      question: "What is AI search optimization (GEO), and why does my brand need it?",
      answer: "AI search optimization — also called Generative Engine Optimization (GEO) — is the practice of structuring your brand's digital presence so that AI-powered search engines like ChatGPT Search, Perplexity, Google SGE, and Gemini discover, understand, and cite your brand accurately. Unlike traditional SEO which targets blue-link rankings, GEO targets the narrative-format answers AI models generate. If your brand isn't being cited in AI-generated answers, you're invisible to a fast-growing segment of your audience. LEVERAGE AI audits your current AI search presence, identifies citation gaps, and engineers a content and structure strategy to close them."
    },
    {
      question: "How long does it take to see results from AI search optimization?",
      answer: "Most clients see measurable improvement in AI citation frequency within 60 to 90 days. Initial improvements often appear faster when foundational issues — like missing structured data, weak schema markup, or poor content architecture — are addressed early. AI model training cycles and crawl frequencies vary by platform, so results are not instantaneous. We provide monthly reporting on AI search citation volume, brand mention frequency, and share-of-voice in AI-generated responses so you can track progress quantitatively."
    },
    {
      question: "What makes Leverage AI different from a traditional SEO or digital marketing agency?",
      answer: "Traditional agencies optimize for Google's PageRank algorithm — links, keywords, and domain authority. We specialize in how large language models and AI search platforms evaluate, trust, and cite sources. This requires a fundamentally different skill set: understanding how AI models parse structured data, what signals drive brand inclusion in AI training corpora, how entity recognition works in NLP systems, and how to write content that functions as an authoritative source for AI retrieval. Our work is technical and strategic, grounded in how AI systems actually work — not how search worked five years ago."
    },
    {
      question: "Do you work with businesses outside of Oregon?",
      answer: "Yes. While we are based in Grants Pass, Oregon, we work with clients across the United States and internationally. AI search optimization is inherently location-agnostic — the same strategies that make an Oregon brand visible in Perplexity work for a company in New York, London, or Singapore. All engagements are conducted remotely with structured communication rhythms and regular strategy calls. Available by appointment Mon–Sat 10am–8pm PT. Call or text 541-450-2082, or email leverage_labs_alpha@proton.me."
    },
    {
      question: "What does a typical engagement with Leverage AI look like?",
      answer: "Every engagement begins with a comprehensive AI visibility audit — we map your current presence across the major AI search platforms, identify competitive gaps, and assess your content and technical infrastructure. From there we develop a tailored strategy covering content architecture, structured data implementation, schema optimization, and ongoing monitoring. Engagements are typically scoped as 90-day initial projects with optional retainer arrangements for ongoing optimization and reporting. We do not offer one-size-fits-all packages — every scope is custom-built for your specific competitive landscape and goals."
    }
  ];
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "FAQ", item: `${siteConfig.url}/faq` }
    ]
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer }
    }))
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "FAQ | Leverage AI", "description": "Frequently asked questions about AI search optimization, GEO strategy, and working with Leverage AI LLC — the Grants Pass, Oregon AI-first digital agency.", "noIndex": false }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">', '<\/script> <script type="application/ld+json">', "<\/script> ", '<div style="padding-top: 4.5rem;"> <section class="section-padding"> <div class="container-custom" style="max-width: 720px;"> <p class="eyebrow" style="margin-bottom: 0.75rem;">FAQ</p> <h1 style="\n            font-family: var(--font-heading);\n            font-size: clamp(2rem, 4vw, 3rem);\n            font-weight: 300;\n            margin: 0 0 0.75rem;\n            color: var(--text-primary);\n            line-height: 1.2;\n          ">\nFrequently Asked Questions\n</h1> <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.7; margin: 0 0 3rem;">\nEverything you need to know about AI search optimization and working with LEVERAGE AI.\n</p> <div id="faq-list" style="display: flex; flex-direction: column; gap: 0;"> ', ' </div> <!-- Still have questions CTA --> <div style="\n            margin-top: 3rem;\n            text-align: center;\n            padding: 2rem;\n            background-color: var(--surface-1);\n            border: 1px solid var(--border-subtle);\n            border-radius: var(--border-radius);\n          "> <p style="color: var(--text-secondary); margin-bottom: 1rem; font-size: 0.95rem;">\nStill have questions? We&rsquo;re happy to walk you through anything.\n</p> <a href="/contact" class="btn-primary" style="font-size: 0.8rem;">Contact Us</a> </div> </div> </section> </div> ', " "])), unescapeHTML(JSON.stringify(breadcrumb)), unescapeHTML(JSON.stringify(faqSchema)), maybeRenderHead(), faqs.map((faq, i) => renderTemplate`<div class="faq-item" style="border-bottom: 1px solid var(--border-subtle);"${addAttribute(i, "data-index")}> <button class="faq-trigger" style="
                  width: 100%;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding: 1.5rem 0;
                  background: none;
                  border: none;
                  cursor: pointer;
                  text-align: left;
                  gap: 1rem;
                " aria-expanded="false"> <span style="
                    font-family: var(--font-heading);
                    font-size: 1.1rem;
                    font-weight: 300;
                    color: var(--text-primary);
                    line-height: 1.35;
                  "> ${faq.question} </span> <span class="faq-icon" style="
                    flex-shrink: 0;
                    color: var(--accent);
                    font-size: 1.4rem;
                    transition: transform 0.3s ease;
                    line-height: 1;
                  ">
+
</span> </button> <div class="faq-answer" style="overflow: hidden; max-height: 0; transition: max-height 0.35s ease;"> <p style="
                    color: var(--text-secondary);
                    line-height: 1.75;
                    padding-bottom: 1.5rem;
                    margin: 0;
                    font-size: 0.925rem;
                  "> ${faq.answer} </p> </div> </div>`), renderScript($$result2, "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/faq.astro?astro&type=script&index=0&lang.ts")) })}`;
}, "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/faq.astro", void 0);
const $$file = "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/faq.astro";
const $$url = "/faq";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Faq,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
