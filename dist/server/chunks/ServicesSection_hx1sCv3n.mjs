globalThis.process ??= {};
globalThis.process.env ??= {};
import { b as createLucideIcon, j as jsxRuntimeExports, d as servicesConfig } from "./createLucideIcon_DZRUm3Z8.mjs";
import { A as AnimatedSection } from "./AnimatedSection_Cy8GFEHO.mjs";
const ChartColumn = createLucideIcon("ChartColumn", [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
]);
const Globe = createLucideIcon("Globe", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
  ["path", { d: "M2 12h20", key: "9i4pu4" }]
]);
const Palette = createLucideIcon("Palette", [
  ["circle", { cx: "13.5", cy: "6.5", r: ".5", fill: "currentColor", key: "1okk4w" }],
  ["circle", { cx: "17.5", cy: "10.5", r: ".5", fill: "currentColor", key: "f64h9f" }],
  ["circle", { cx: "8.5", cy: "7.5", r: ".5", fill: "currentColor", key: "fotxhn" }],
  ["circle", { cx: "6.5", cy: "12.5", r: ".5", fill: "currentColor", key: "qy21gx" }],
  [
    "path",
    {
      d: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z",
      key: "12rzf8"
    }
  ]
]);
const Search = createLucideIcon("Search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
]);
const iconMap = {
  Search,
  Palette,
  BarChart3: ChartColumn,
  Globe
};
function ServicesSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      id: "services",
      className: "section-padding grain",
      style: { position: "relative", backgroundColor: "var(--surface-1)", overflow: "hidden" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "glow-gold",
            style: {
              position: "absolute",
              top: "20%",
              right: "-10%",
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(var(--accent-rgb, 184,134,74),0.08) 0%, transparent 70%)",
              pointerEvents: "none",
              zIndex: 0
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-custom", style: { position: "relative", zIndex: 1 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatedSection, { style: { textAlign: "center", marginBottom: "4rem" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "eyebrow", style: { marginBottom: "0.75rem" }, children: servicesConfig.eyebrow }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h2",
              {
                style: {
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2rem, 4vw, 3.25rem)",
                  fontWeight: 300,
                  color: "var(--text-primary)",
                  margin: "0 0 1rem"
                },
                children: servicesConfig.headline
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                style: {
                  fontSize: "1rem",
                  color: "var(--text-secondary)",
                  maxWidth: "540px",
                  margin: "0 auto",
                  lineHeight: 1.6
                },
                children: servicesConfig.subheadline
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1.5rem"
              },
              children: servicesConfig.services.map((service, i) => {
                const Icon = iconMap[service.icon];
                return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedSection, { delay: i * 0.1, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "glass premium-hover",
                    style: {
                      padding: "2rem",
                      borderRadius: "var(--border-radius)",
                      border: "1px solid var(--border-subtle)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "3rem",
                            height: "3rem",
                            borderRadius: "50%",
                            border: "1px solid var(--border-subtle)",
                            backgroundColor: "var(--surface-2)",
                            flexShrink: 0
                          },
                          children: Icon && /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 20, color: "var(--accent)" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "h3",
                        {
                          style: {
                            fontFamily: "var(--font-heading)",
                            fontSize: "1.35rem",
                            fontWeight: 300,
                            color: "var(--text-primary)",
                            margin: 0
                          },
                          children: service.title
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          style: {
                            fontSize: "0.9rem",
                            color: "var(--text-secondary)",
                            lineHeight: 1.65,
                            margin: 0
                          },
                          children: service.description
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "ul",
                        {
                          style: {
                            listStyle: "none",
                            padding: 0,
                            margin: "0.5rem 0 0",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem"
                          },
                          children: service.details.map((detail, j) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "li",
                            {
                              style: {
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "0.6rem",
                                fontSize: "0.8rem",
                                color: "var(--text-muted)",
                                lineHeight: 1.5
                              },
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--accent)", flexShrink: 0, marginTop: "2px" }, children: "›" }),
                                detail
                              ]
                            },
                            j
                          ))
                        }
                      )
                    ]
                  }
                ) }, service.id);
              })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @media (max-width: 767px) {
          #services .container-custom > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      ` })
      ]
    }
  );
}
export {
  ServicesSection as S
};
