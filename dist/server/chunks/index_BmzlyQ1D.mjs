globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_P2T-B9sK.mjs";
import { d as reactExports, c as renderComponent, r as renderTemplate, u as unescapeHTML } from "./worker-entry_D9jsJv2k.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_5CMa3oI8.mjs";
import { b as createLucideIcon, j as jsxRuntimeExports, h as heroConfig, e as socialProofConfig, s as siteConfig } from "./createLucideIcon_DZRUm3Z8.mjs";
import { m as motion, A as AnimatedSection } from "./AnimatedSection_Cy8GFEHO.mjs";
import { A as ArrowRight, C as CaseStudySection } from "./CaseStudySection_CXH8gwAY.mjs";
import { S as ServicesSection } from "./ServicesSection_hx1sCv3n.mjs";
import { C as ContactForm } from "./ContactForm_aJdVGDtP.mjs";
import { g as getCollection } from "./_astro_content_q8QYHCI6.mjs";
const Award = createLucideIcon("Award", [
  [
    "path",
    {
      d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
      key: "1yiouv"
    }
  ],
  ["circle", { cx: "12", cy: "8", r: "6", key: "1vp47v" }]
]);
const Star = createLucideIcon("Star", [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
]);
const TrendingUp = createLucideIcon("TrendingUp", [
  ["polyline", { points: "22 7 13.5 15.5 8.5 10.5 2 17", key: "126l90" }],
  ["polyline", { points: "16 7 22 7 22 13", key: "kwv8wd" }]
]);
const VIDEO_SRC = "/images/City_Skyline_Searchlight_Video_Generation.mp4";
function HeroSection() {
  const [videoReady, setVideoReady] = reactExports.useState(false);
  const [videoLoading, setVideoLoading] = reactExports.useState(false);
  const videoRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const startLoad = () => {
      setVideoLoading(true);
      const vid = videoRef.current;
      if (!vid) return;
      vid.src = VIDEO_SRC;
      vid.load();
    };
    if (document.readyState === "complete") {
      const t = setTimeout(startLoad, 300);
      return () => clearTimeout(t);
    } else {
      window.addEventListener("load", startLoad, { once: true });
      return () => window.removeEventListener("load", startLoad);
    }
  }, []);
  const ease = [0.22, 1, 0.36, 1];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      style: {
        position: "relative",
        height: "100vh",
        minHeight: "700px",
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${heroConfig.backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: videoReady ? 0 : 1,
              transition: "opacity 1.2s ease"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "video",
          {
            ref: videoRef,
            autoPlay: true,
            muted: true,
            loop: true,
            playsInline: true,
            preload: "none",
            "aria-hidden": "true",
            onCanPlayThrough: () => {
              videoRef.current?.play().catch(() => {
              });
              setVideoReady(true);
            },
            style: {
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              opacity: videoReady ? 1 : 0,
              transition: "opacity 1.2s ease",
              pointerEvents: "none"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.18) 100%)",
              zIndex: 1
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grain",
            style: {
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: 1
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "container-custom",
            style: {
              position: "relative",
              zIndex: 10,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingTop: "5rem"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { maxWidth: "680px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.p,
                {
                  className: "eyebrow-lg has-bar",
                  initial: { opacity: 0, y: 16 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.6, ease, delay: 0.1 },
                  style: { marginBottom: "1.5rem" },
                  children: heroConfig.eyebrow
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.h1,
                {
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.7, ease, delay: 0.35 },
                  style: {
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(2.8rem, 6vw, 5rem)",
                    fontWeight: 300,
                    lineHeight: 1.1,
                    color: "var(--text-primary)",
                    margin: "0 0 0.5rem"
                  },
                  children: heroConfig.headline
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.h1,
                {
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.7, ease, delay: 0.5 },
                  style: {
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(2.8rem, 6vw, 5rem)",
                    fontWeight: 300,
                    lineHeight: 1.1,
                    margin: "0 0 1.75rem"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--accent)" }, children: heroConfig.headlineAccent })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.p,
                {
                  initial: { opacity: 0, y: 16 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.6, ease, delay: 0.7 },
                  style: {
                    fontSize: "1.125rem",
                    lineHeight: 1.6,
                    color: "var(--text-secondary)",
                    margin: "0 0 2.5rem",
                    maxWidth: "520px"
                  },
                  children: heroConfig.subheadline
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 16 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.6, ease, delay: 0.85 },
                  style: { display: "flex", gap: "1rem", flexWrap: "wrap" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: heroConfig.ctaButtonHref, className: "btn-primary", children: [
                      heroConfig.ctaButtonText,
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 16 })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: heroConfig.ctaSecondaryHref, className: "btn-secondary", children: heroConfig.ctaSecondaryText })
                  ]
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "120px",
              background: "linear-gradient(to bottom, transparent 0%, var(--page-bg) 100%)",
              zIndex: 5,
              pointerEvents: "none"
            }
          }
        )
      ]
    }
  );
}
function StarRating({ rating }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "aria-label": `${rating} out of 5 stars`,
      style: { display: "flex", gap: "3px", marginBottom: "0.75rem" },
      children: [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "svg",
        {
          width: "16",
          height: "16",
          viewBox: "0 0 24 24",
          fill: star <= rating ? "hsl(38 80% 55%)" : "none",
          stroke: star <= rating ? "hsl(38 80% 55%)" : "hsl(210 20% 40%)",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          "aria-hidden": "true",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" })
        },
        star
      ))
    }
  );
}
function TestimonialsCarousel({ testimonials }) {
  const [current, setCurrent] = reactExports.useState(0);
  const [isAnimating, setIsAnimating] = reactExports.useState(false);
  const [direction, setDirection] = reactExports.useState("next");
  const pausedRef = reactExports.useRef(false);
  const intervalRef = reactExports.useRef(null);
  const total = testimonials.length;
  const goTo = (index, dir = "next") => {
    if (isAnimating) return;
    setDirection(dir);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setIsAnimating(false);
    }, 300);
  };
  const next = () => goTo((current + 1) % total, "next");
  const prev = () => goTo((current - 1 + total) % total, "prev");
  const startAutoplay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!pausedRef.current) {
        setCurrent((c) => (c + 1) % total);
      }
    }, 5e3);
  };
  reactExports.useEffect(() => {
    startAutoplay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [total]);
  if (!testimonials || total === 0) return null;
  const t = testimonials[current];
  const slideStyle = {
    opacity: isAnimating ? 0 : 1,
    transform: isAnimating ? `translateX(${direction === "next" ? "-20px" : "20px"})` : "translateX(0)",
    transition: "opacity 0.3s ease, transform 0.3s ease"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      role: "region",
      "aria-label": "Client testimonials",
      "aria-roledescription": "carousel",
      style: { width: "100%", maxWidth: "720px", margin: "0 auto", padding: "2rem 0" },
      onMouseEnter: () => {
        pausedRef.current = true;
      },
      onMouseLeave: () => {
        pausedRef.current = false;
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "aria-live": "polite",
            "aria-atomic": "true",
            style: {
              background: "var(--glass-bg, hsl(220 40% 8% / 0.6))",
              border: "1px solid var(--glass-border, hsl(38 80% 55% / 0.15))",
              borderRadius: "12px",
              padding: "2.5rem",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              minHeight: "200px",
              position: "relative"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: slideStyle, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(StarRating, { rating: t.rating }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "blockquote",
                {
                  style: {
                    margin: 0,
                    fontSize: "1.05rem",
                    lineHeight: 1.7,
                    color: "var(--text-cream, hsl(40 30% 92%))",
                    fontStyle: "italic",
                    marginBottom: "1.5rem"
                  },
                  children: [
                    "“",
                    t.body,
                    "”"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { style: { display: "flex", alignItems: "center", gap: "0.75rem" }, children: [
                t.image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: t.image, alt: t.name, style: { width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", border: "1.5px solid hsl(38 80% 55% / 0.4)", flexShrink: 0 } }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "hsl(38 80% 55% / 0.15)",
                      border: "1.5px solid hsl(38 80% 55% / 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "var(--brand-500, hsl(38 80% 55%))",
                      flexShrink: 0
                    },
                    "aria-hidden": "true",
                    children: t.name.charAt(0)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "cite",
                    {
                      style: {
                        fontStyle: "normal",
                        fontWeight: 600,
                        color: "var(--text-cream, hsl(40 30% 92%))",
                        display: "block",
                        fontSize: "0.9rem"
                      },
                      children: t.url ? /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: t.url, target: "_blank", rel: "noopener noreferrer", style: { color: "inherit", textDecoration: "none" }, children: t.name }) : t.name
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.8rem", color: "hsl(210 20% 55%)" }, children: t.role })
                ] })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              marginTop: "1.5rem"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  "aria-label": "Previous testimonial",
                  onClick: prev,
                  style: {
                    background: "none",
                    border: "1px solid hsl(38 80% 55% / 0.3)",
                    borderRadius: "50%",
                    width: "36px",
                    height: "36px",
                    cursor: "pointer",
                    color: "hsl(38 80% 55%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    transition: "border-color 0.2s, background 0.2s"
                  },
                  onMouseEnter: (e) => {
                    e.currentTarget.style.background = "hsl(38 80% 55% / 0.1)";
                    e.currentTarget.style.borderColor = "hsl(38 80% 55% / 0.7)";
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.background = "none";
                    e.currentTarget.style.borderColor = "hsl(38 80% 55% / 0.3)";
                  },
                  children: "←"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { role: "tablist", "aria-label": "Testimonial navigation", style: { display: "flex", gap: "8px" }, children: testimonials.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  role: "tab",
                  "aria-selected": i === current,
                  "aria-label": `Go to testimonial ${i + 1}`,
                  onClick: () => goTo(i, i > current ? "next" : "prev"),
                  style: {
                    width: i === current ? "24px" : "8px",
                    height: "8px",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    background: i === current ? "var(--brand-500, hsl(38 80% 55%))" : "hsl(210 20% 30%)",
                    transition: "width 0.3s ease, background 0.3s ease"
                  }
                },
                i
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  "aria-label": "Next testimonial",
                  onClick: next,
                  style: {
                    background: "none",
                    border: "1px solid hsl(38 80% 55% / 0.3)",
                    borderRadius: "50%",
                    width: "36px",
                    height: "36px",
                    cursor: "pointer",
                    color: "hsl(38 80% 55%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    transition: "border-color 0.2s, background 0.2s"
                  },
                  onMouseEnter: (e) => {
                    e.currentTarget.style.background = "hsl(38 80% 55% / 0.1)";
                    e.currentTarget.style.borderColor = "hsl(38 80% 55% / 0.7)";
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.background = "none";
                    e.currentTarget.style.borderColor = "hsl(38 80% 55% / 0.3)";
                  },
                  children: "→"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "p",
          {
            "aria-live": "polite",
            "aria-atomic": "true",
            style: {
              textAlign: "center",
              fontSize: "0.75rem",
              color: "hsl(210 20% 45%)",
              marginTop: "0.75rem"
            },
            children: [
              current + 1,
              " / ",
              total
            ]
          }
        )
      ]
    }
  );
}
const iconMap = {
  Award,
  Star,
  TrendingUp
};
function SocialProofSection({ testimonials = [] }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      id: "recognition",
      className: "section-padding grain",
      style: {
        position: "relative",
        backgroundColor: "var(--page-bg)",
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-custom", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatedSection, { style: { textAlign: "center", marginBottom: "3.5rem" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "eyebrow", style: { marginBottom: "0.75rem" }, children: socialProofConfig.eyebrow }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h2",
              {
                style: {
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.8rem, 4vw, 3rem)",
                  fontWeight: 300,
                  color: "var(--text-primary)",
                  margin: 0
                },
                children: socialProofConfig.headline
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "1.5rem",
                marginBottom: "4rem"
              },
              children: socialProofConfig.accolades.map((accolade, i) => {
                const Icon = iconMap[accolade.icon];
                return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedSection, { delay: i * 0.12, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "glass premium-hover",
                    style: {
                      padding: "2rem",
                      borderRadius: "var(--border-radius)",
                      border: "1px solid var(--border-subtle)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      gap: "1rem"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "3.5rem",
                            height: "3.5rem",
                            borderRadius: "50%",
                            border: "1px solid var(--border-subtle)",
                            backgroundColor: "var(--surface-2)"
                          },
                          children: Icon && /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 22, color: "var(--accent)" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "h3",
                        {
                          style: {
                            fontFamily: "var(--font-heading)",
                            fontSize: "1.1rem",
                            fontWeight: 300,
                            color: "var(--text-primary)",
                            margin: 0,
                            lineHeight: 1.3
                          },
                          children: accolade.label
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          style: {
                            fontSize: "0.875rem",
                            color: "var(--text-muted)",
                            margin: 0,
                            lineHeight: 1.55
                          },
                          children: accolade.detail
                        }
                      )
                    ]
                  }
                ) }, i);
              })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedSection, { delay: 0.2, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                textAlign: "center",
                maxWidth: "700px",
                margin: "0 auto",
                padding: "2.5rem",
                borderTop: "1px solid var(--border-subtle)",
                borderBottom: "1px solid var(--border-subtle)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: {
                      fontFamily: "var(--font-heading)",
                      fontSize: "4rem",
                      color: "var(--accent)",
                      opacity: 0.35,
                      lineHeight: 0.5,
                      display: "block",
                      marginBottom: "0.75rem"
                    },
                    children: '"'
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    style: {
                      fontFamily: "var(--font-heading)",
                      fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
                      fontWeight: 300,
                      fontStyle: "italic",
                      color: "var(--text-primary)",
                      lineHeight: 1.5,
                      margin: 0
                    },
                    children: socialProofConfig.pullQuote.replace(/^"|"$/g, "")
                  }
                )
              ]
            }
          ) }),
          testimonials.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatedSection, { delay: 0.3, style: { marginTop: "4rem" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", marginBottom: "2rem" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "eyebrow", style: { marginBottom: "0.5rem" }, children: socialProofConfig.testimonialsEyebrow }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: {
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                fontWeight: 300,
                color: "var(--text-primary)",
                margin: 0
              }, children: socialProofConfig.testimonialsHeadline })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TestimonialsCarousel, { testimonials })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @media (max-width: 767px) {
          #recognition .container-custom > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
        }
      ` })
      ]
    }
  );
}
function ScrollProgressBar() {
  const [progress, setProgress] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? scrollTop / docHeight * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
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
        transition: "width 0.1s linear",
        boxShadow: "0 0 8px hsl(38 80% 55% / 0.6)"
      }
    }
  );
}
function CtaBar({
  threshold = 800,
  text = "Ready to dominate AI search?",
  href = "/contact",
  ctaText = "Get Started"
}) {
  const [visible, setVisible] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > threshold);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      role: "complementary",
      "aria-label": "Call to action",
      style: {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transform: visible ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        background: "hsl(220 40% 6% / 0.95)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid hsl(38 80% 55% / 0.2)",
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "hsl(210 20% 85%)", fontSize: "0.95rem" }, children: text }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href,
            style: {
              background: "hsl(38 80% 55%)",
              color: "#0d1119",
              padding: "0.5rem 1.5rem",
              borderRadius: "4px",
              fontWeight: 700,
              fontSize: "0.875rem",
              textDecoration: "none",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              whiteSpace: "nowrap"
            },
            children: ctaText
          }
        )
      ]
    }
  );
}
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const rawTestimonials = await getCollection("testimonials");
  const testimonials = rawTestimonials.sort((a, b) => a.data.order - b.data.order).map((t) => ({
    name: t.data.name,
    role: t.data.role,
    rating: t.data.rating,
    body: t.body?.trim() ?? "",
    image: t.data.image,
    url: t.data.url
  }));
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Leverage AI",
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/blog?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": siteConfig.title, "description": siteConfig.description, "keywords": siteConfig.keywords }, { "default": async ($$result2) => renderTemplate`   ${renderComponent($$result2, "ScrollProgressBar", ScrollProgressBar, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/mikes/Leverage-AI-Astro-Site/src/components/ScrollProgressBar", "client:component-export": "default" })}  ${renderComponent($$result2, "HeroSection", HeroSection, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/mikes/Leverage-AI-Astro-Site/src/components/HeroSection", "client:component-export": "default" })}  ${renderComponent($$result2, "ServicesSection", ServicesSection, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "C:/Users/mikes/Leverage-AI-Astro-Site/src/components/ServicesSection", "client:component-export": "default" })}  ${renderComponent($$result2, "SocialProofSection", SocialProofSection, { "client:visible": true, "testimonials": testimonials, "client:component-hydration": "visible", "client:component-path": "C:/Users/mikes/Leverage-AI-Astro-Site/src/components/SocialProofSection", "client:component-export": "default" })}  ${renderComponent($$result2, "CaseStudySection", CaseStudySection, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "C:/Users/mikes/Leverage-AI-Astro-Site/src/components/CaseStudySection", "client:component-export": "default" })}  ${renderComponent($$result2, "ContactForm", ContactForm, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "C:/Users/mikes/Leverage-AI-Astro-Site/src/components/ContactForm", "client:component-export": "default" })}  ${renderComponent($$result2, "CtaBar", CtaBar, { "client:visible": true, "threshold": 800, "text": "Ready to dominate AI search?", "href": "/contact", "ctaText": "Get Started", "client:component-hydration": "visible", "client:component-path": "C:/Users/mikes/Leverage-AI-Astro-Site/src/components/CtaBar", "client:component-export": "default" })} `, "head": async ($$result2) => renderTemplate(_a || (_a = __template(['<script type="application/ld+json">', "<\/script>"])), unescapeHTML(JSON.stringify(websiteSchema))) })}`;
}, "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/index.astro", void 0);
const $$file = "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/index.astro";
const $$url = "";
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
