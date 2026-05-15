globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_P2T-B9sK.mjs";
import { d as reactExports, c as renderComponent, r as renderTemplate, a as addAttribute, m as maybeRenderHead, u as unescapeHTML } from "./worker-entry_D9jsJv2k.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_5CMa3oI8.mjs";
import { g as getCollection, r as renderEntry } from "./_astro_content_q8QYHCI6.mjs";
import { j as jsxRuntimeExports, s as siteConfig } from "./createLucideIcon_DZRUm3Z8.mjs";
function ReadingProgress({ articleId }) {
  const [progress, setProgress] = reactExports.useState(0);
  const [active, setActive] = reactExports.useState(false);
  const [showPercent, setShowPercent] = reactExports.useState(false);
  const rafRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const updateProgress = () => {
      const article = document.getElementById(articleId);
      if (!article) return;
      article.getBoundingClientRect();
      const articleTop = article.offsetTop;
      const articleHeight = article.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const isActive = scrollY + viewportHeight > articleTop && scrollY < articleTop + articleHeight;
      setActive(isActive);
      if (!isActive) {
        if (scrollY >= articleTop + articleHeight) {
          setProgress(100);
        } else {
          setProgress(0);
        }
        return;
      }
      const scrolled = scrollY - articleTop;
      const scrollable = articleHeight - viewportHeight;
      const pct = scrollable > 0 ? scrolled / scrollable * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    };
    const onScroll = () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateProgress);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    updateProgress();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [articleId]);
  const opacity = active ? 1 : progress === 100 ? 0.4 : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "aria-hidden": "true",
        style: {
          position: "fixed",
          top: 0,
          left: 0,
          height: "3px",
          width: `${progress}%`,
          background: "var(--brand-500, hsl(38 80% 55%))",
          zIndex: 9999,
          transition: "width 0.1s linear, opacity 0.3s ease",
          opacity,
          boxShadow: active ? "0 0 8px hsl(38 80% 55% / 0.6)" : "none"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "aria-label": `Reading progress: ${Math.round(progress)}%`,
        onMouseEnter: () => setShowPercent(true),
        onMouseLeave: () => setShowPercent(false),
        style: {
          position: "fixed",
          top: 0,
          left: 0,
          height: "12px",
          width: "100%",
          zIndex: 1e4,
          cursor: "default"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            "aria-hidden": "true",
            style: {
              position: "absolute",
              top: "8px",
              left: `clamp(8px, ${progress}%, calc(100% - 40px))`,
              transform: "translateX(-50%)",
              background: "hsl(220 40% 10%)",
              border: "1px solid hsl(38 80% 55% / 0.4)",
              borderRadius: "4px",
              padding: "2px 6px",
              fontSize: "10px",
              fontWeight: 600,
              color: "hsl(38 80% 55%)",
              whiteSpace: "nowrap",
              opacity: showPercent && active ? 1 : 0,
              transition: "opacity 0.15s ease",
              pointerEvents: "none",
              letterSpacing: "0.04em",
              fontFamily: "var(--font-mono, monospace)"
            },
            children: [
              Math.round(progress),
              "%"
            ]
          }
        )
      }
    )
  ] });
}
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const posts = await getCollection("blog");
  const post = posts.find((p) => p.id === slug);
  if (!post) return Astro2.redirect("/404");
  const { Content } = await renderEntry(post);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.data.title,
    description: post.data.excerpt,
    datePublished: post.data.date,
    author: {
      "@type": "Person",
      name: post.data.author ?? "LEVERAGE AI"
    },
    image: post.data.ogImage ?? post.data.image,
    publisher: {
      "@type": "Organization",
      name: "Leverage AI LLC",
      url: siteConfig.url
    }
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": post.data.title, "description": post.data.excerpt, "keywords": (post.data.tags ?? []).join(", "), "ogImage": post.data.ogImage ?? post.data.image, "canonical": `${siteConfig.url}/blog/${post.id}`, "data-astro-cid-4sn4zg3r": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template(['  <script type="application/ld+json">', "<\/script>  ", " ", '<div style="padding-top: 4.5rem;" data-astro-cid-4sn4zg3r> <article id="blog-article" style="max-width: 820px; margin: 0 auto; padding: 4rem 2rem 5rem;" data-astro-cid-4sn4zg3r> <!-- ─── Back link ────────────────────────────────────── --> <a href="/blog" style="\n          display: inline-flex;\n          align-items: center;\n          gap: 0.5rem;\n          font-size: 0.75rem;\n          letter-spacing: 0.1em;\n          text-transform: uppercase;\n          color: var(--text-muted);\n          margin-bottom: 2.5rem;\n          text-decoration: none;\n          transition: color 0.2s ease;\n        " data-astro-cid-4sn4zg3r>\n&larr; Back to Blog\n</a> <!-- ─── Meta ─────────────────────────────────────────── --> <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; margin-bottom: 1.5rem;" data-astro-cid-4sn4zg3r> <span style="\n            font-size: 0.65rem;\n            letter-spacing: 0.15em;\n            text-transform: uppercase;\n            padding: 0.25rem 0.6rem;\n            background-color: var(--accent);\n            color: #0d1119;\n            border-radius: 999px;\n            font-weight: 600;\n          " data-astro-cid-4sn4zg3r> ', " </span> ", ' <span style="font-size: 0.75rem; color: var(--text-muted);" data-astro-cid-4sn4zg3r> ', " </span> ", ' </div> <!-- ─── Headline ─────────────────────────────────────── --> <h1 style="\n          font-family: var(--font-heading);\n          font-size: clamp(2rem, 5vw, 3.5rem);\n          font-weight: 300;\n          line-height: 1.15;\n          margin: 0 0 2rem;\n          color: var(--text-primary);\n        " data-astro-cid-4sn4zg3r> ', " </h1> <!-- ─── Hero Image ───────────────────────────────────── --> ", " <!-- ─── TLDR Box (before content — AI/GEO optimization) --> ", ' <!-- ─── Article Body ─────────────────────────────────── --> <div class="prose" style="color: var(--text-secondary); line-height: 1.8; font-size: 1rem;" data-astro-cid-4sn4zg3r> ', " </div> <!-- ─── Tags ─────────────────────────────────────────── --> ", ` <!-- ─── Author Bio ───────────────────────────────────── --> <div style="
          margin-top: 3rem;
          padding: 2rem;
          background-color: var(--surface-1);
          border: 1px solid var(--border-subtle);
          border-radius: var(--border-radius);
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 1.5rem;
          align-items: start;
        " data-astro-cid-4sn4zg3r> <div style="
            width: 80px;
            height: 80px;
            border-radius: 50%;
            overflow: hidden;
            border: 2px solid hsl(38 80% 55% / 0.4);
            flex-shrink: 0;
          " data-astro-cid-4sn4zg3r> <img src="/images/headshot-hat.jpg" alt="Jon 'Mike' Schlottig" width="80" height="80" style="width: 100%; height: 100%; object-fit: cover;" data-astro-cid-4sn4zg3r> </div> <div data-astro-cid-4sn4zg3r> <p style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 600; color: var(--text-primary); margin: 0 0 0.25rem;" data-astro-cid-4sn4zg3r>Jon &ldquo;Mike&rdquo; Schlottig</p> <p style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--accent); margin: 0 0 0.75rem;" data-astro-cid-4sn4zg3r>Founder &mdash; Leverage AI</p> <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.7; margin: 0;" data-astro-cid-4sn4zg3r>
Jon &ldquo;Mike&rdquo; Schlottig moved to Grants Pass via the Bay Area back in 2001. He graduated from Grants Pass High School in 2005 near the top of his class and earned a Dean Scholarship to the University of Oregon. After nearly a decade of managing sales and operations in the commercial agriculture industry, and working as an in-home design consultant for the largest home remodeling company in the U.S., Mike recognized the opportunity in the quickly shifting tech industry and founded LEVERAGE AI LLC.
</p> </div> </div> <!-- ─── CTA ──────────────────────────────────────────── --> <div style="
          margin-top: 3.5rem;
          padding: 2.5rem;
          background-color: var(--surface-1);
          border: 1px solid var(--border-accent);
          border-radius: var(--border-radius);
          text-align: center;
        " data-astro-cid-4sn4zg3r> <p style="
            font-family: var(--font-heading);
            font-size: 1.35rem;
            color: var(--text-primary);
            margin: 0 0 0.75rem;
            font-weight: 300;
          " data-astro-cid-4sn4zg3r>
Ready to dominate AI search results?
</p> <p style="color: var(--text-secondary); font-size: 0.875rem; margin: 0 0 1.5rem;" data-astro-cid-4sn4zg3r>
Let&rsquo;s build your AI visibility strategy from the ground up.
</p> <a href="/contact" class="btn-primary" style="font-size: 0.8rem;" data-astro-cid-4sn4zg3r>Start a Conversation</a> </div> </article> </div> `])), unescapeHTML(JSON.stringify(articleSchema)), renderComponent($$result2, "ReadingProgress", ReadingProgress, { "client:load": true, "articleId": "blog-article", "client:component-hydration": "load", "client:component-path": "C:/Users/mikes/Leverage-AI-Astro-Site/src/components/ReadingProgress", "client:component-export": "default", "data-astro-cid-4sn4zg3r": true }), maybeRenderHead(), post.data.category, post.data.readingTime && renderTemplate`<span style="font-size: 0.75rem; color: var(--text-muted);" data-astro-cid-4sn4zg3r>${post.data.readingTime}</span>`, new Date(post.data.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), post.data.author && renderTemplate`<span style="font-size: 0.75rem; color: var(--text-muted);" data-astro-cid-4sn4zg3r>By ${post.data.author}</span>`, post.data.title, post.data.image && renderTemplate`<div style="border-radius: var(--border-radius); overflow: hidden; margin-bottom: 2.5rem; aspect-ratio: 16/9;" data-astro-cid-4sn4zg3r> <img${addAttribute(post.data.image, "src")}${addAttribute(post.data.title, "alt")} style="width: 100%; height: 100%; object-fit: cover;" data-astro-cid-4sn4zg3r> </div>`, post.data.tldr && post.data.tldr.length > 0 && renderTemplate`<div style="
            background-color: var(--surface-1);
            border-left: 3px solid var(--accent);
            padding: 1.5rem;
            margin-bottom: 2.5rem;
            border-radius: 0 var(--border-radius) var(--border-radius) 0;
          " data-astro-cid-4sn4zg3r> <p style="
              font-size: 0.8rem;
              letter-spacing: 0.2em;
              text-transform: uppercase;
              color: var(--accent);
              font-weight: 600;
              margin: 0 0 0.75rem;
            " data-astro-cid-4sn4zg3r>
TL;DR
</p> <ul style="margin: 0; padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.4rem;" data-astro-cid-4sn4zg3r> ${post.data.tldr.map((point) => renderTemplate`<li style="color: var(--text-secondary); font-size: 1.125rem; line-height: 1.6;" data-astro-cid-4sn4zg3r>${point}</li>`)} </ul> </div>`, renderComponent($$result2, "Content", Content, { "data-astro-cid-4sn4zg3r": true }), post.data.tags && post.data.tags.length > 0 && renderTemplate`<div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--border-subtle);" data-astro-cid-4sn4zg3r> <p style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.75rem;" data-astro-cid-4sn4zg3r>
Tags
</p> <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;" data-astro-cid-4sn4zg3r> ${post.data.tags.map((tag) => renderTemplate`<span style="
                  padding: 0.25rem 0.75rem;
                  font-size: 0.75rem;
                  border: 1px solid var(--border-subtle);
                  border-radius: 999px;
                  color: var(--text-muted);
                " data-astro-cid-4sn4zg3r> ${tag} </span>`)} </div> </div>`) })}`;
}, "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/blog/[slug].astro", void 0);
const $$file = "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/blog/[slug].astro";
const $$url = "/blog/[slug]";
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
