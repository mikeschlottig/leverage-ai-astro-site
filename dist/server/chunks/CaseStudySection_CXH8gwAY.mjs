globalThis.process ??= {};
globalThis.process.env ??= {};
import { b as createLucideIcon, j as jsxRuntimeExports, m as metricsConfig } from "./createLucideIcon_DZRUm3Z8.mjs";
import { A as AnimatedSection } from "./AnimatedSection_Cy8GFEHO.mjs";
const ArrowRight = createLucideIcon("ArrowRight", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
]);
function CaseStudySection() {
  const { eyebrow, headline, metrics, featuredCaseStudy } = metricsConfig;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      id: "results",
      className: "section-padding grain",
      style: {
        position: "relative",
        backgroundColor: "var(--surface-1)",
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "glow-radial",
            style: {
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "700px",
              height: "700px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(var(--accent-rgb, 184,134,74),0.06) 0%, transparent 65%)",
              pointerEvents: "none",
              zIndex: 0
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-custom", style: { position: "relative", zIndex: 1 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatedSection, { style: { textAlign: "center", marginBottom: "4rem" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "eyebrow", style: { marginBottom: "0.75rem" }, children: eyebrow }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h2",
              {
                style: {
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2rem, 4vw, 3.25rem)",
                  fontWeight: 300,
                  color: "var(--text-primary)",
                  margin: 0
                },
                children: headline
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.25rem",
                marginBottom: "3rem"
              },
              children: metrics.map((metric, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedSection, { delay: i * 0.1, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "glass",
                  style: {
                    padding: "2rem 1.5rem",
                    borderRadius: "var(--border-radius)",
                    border: "1px solid var(--border-subtle)",
                    textAlign: "center"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          fontFamily: "var(--font-heading)",
                          fontSize: "clamp(2.2rem, 4vw, 3rem)",
                          fontWeight: 300,
                          color: "var(--accent)",
                          lineHeight: 1,
                          marginBottom: "0.6rem"
                        },
                        children: metric.value
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          fontSize: "0.75rem",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "var(--text-muted)",
                          lineHeight: 1.4
                        },
                        children: metric.label
                      }
                    )
                  ]
                }
              ) }, i))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedSection, { delay: 0.3, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "glass",
              style: {
                borderRadius: "1rem",
                border: "1px solid var(--border-subtle)",
                padding: "2.5rem",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "2rem",
                alignItems: "center"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      style: {
                        fontSize: "0.7rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "var(--accent)",
                        margin: "0 0 0.75rem",
                        fontWeight: 600
                      },
                      children: featuredCaseStudy.eyebrow
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "h3",
                    {
                      style: {
                        fontFamily: "var(--font-heading)",
                        fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
                        fontWeight: 300,
                        color: "var(--text-primary)",
                        margin: "0 0 1rem",
                        lineHeight: 1.3
                      },
                      children: featuredCaseStudy.title
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      style: {
                        fontSize: "0.9rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.65,
                        margin: "0 0 1.5rem",
                        maxWidth: "640px"
                      },
                      children: featuredCaseStudy.description
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: "0.5rem" }, children: featuredCaseStudy.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      style: {
                        padding: "0.3rem 0.75rem",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "999px",
                        fontSize: "0.7rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--text-muted)"
                      },
                      children: tag
                    },
                    tag
                  )) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: featuredCaseStudy.href,
                    "aria-label": "Read case study",
                    style: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "3.5rem",
                      height: "3.5rem",
                      borderRadius: "50%",
                      border: "1px solid var(--accent)",
                      color: "var(--accent)",
                      flexShrink: 0,
                      transition: "background-color 0.2s, color 0.2s",
                      textDecoration: "none"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 20 })
                  }
                )
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @media (max-width: 767px) {
          #results .glass:last-of-type {
            grid-template-columns: 1fr !important;
          }
          #results .glass:last-of-type > a {
            display: none !important;
          }
        }
      ` })
      ]
    }
  );
}
export {
  ArrowRight as A,
  CaseStudySection as C
};
