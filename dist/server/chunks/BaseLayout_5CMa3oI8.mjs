globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_P2T-B9sK.mjs";
import { t as createRenderInstruction, a as addAttribute, r as renderTemplate, d as reactExports, c as renderComponent, v as renderSlot, w as renderHead, u as unescapeHTML } from "./worker-entry_D9jsJv2k.mjs";
import { b as createLucideIcon, j as jsxRuntimeExports, n as navigationConfig, f as footerConfig, s as siteConfig, l as localBusinessConfig } from "./createLucideIcon_DZRUm3Z8.mjs";
async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}<\/script>`;
    }
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"><\/script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}
const $$ClientRouter = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ClientRouter;
  const { fallback = "animate" } = Astro2.props;
  return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>${renderScript($$result, "C:/Users/mikes/Leverage-AI-Astro-Site/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/mikes/Leverage-AI-Astro-Site/node_modules/astro/components/ClientRouter.astro", void 0);
const ArrowUp = createLucideIcon("ArrowUp", [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
]);
const ChevronDown = createLucideIcon("ChevronDown", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const Instagram = createLucideIcon("Instagram", [
  ["rect", { width: "20", height: "20", x: "2", y: "2", rx: "5", ry: "5", key: "2e1cvw" }],
  ["path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z", key: "9exkf1" }],
  ["line", { x1: "17.5", x2: "17.51", y1: "6.5", y2: "6.5", key: "r4j83e" }]
]);
const Linkedin = createLucideIcon("Linkedin", [
  [
    "path",
    {
      d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",
      key: "c2jq9f"
    }
  ],
  ["rect", { width: "4", height: "12", x: "2", y: "9", key: "mk3on5" }],
  ["circle", { cx: "4", cy: "4", r: "2", key: "bt5ra8" }]
]);
const Menu = createLucideIcon("Menu", [
  ["line", { x1: "4", x2: "20", y1: "12", y2: "12", key: "1e0a9i" }],
  ["line", { x1: "4", x2: "20", y1: "6", y2: "6", key: "1owob3" }],
  ["line", { x1: "4", x2: "20", y1: "18", y2: "18", key: "yk5zj1" }]
]);
const Twitter = createLucideIcon("Twitter", [
  [
    "path",
    {
      d: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
      key: "pff0z6"
    }
  ]
]);
const X = createLucideIcon("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]);
function Navigation() {
  const [scrolled, setScrolled] = reactExports.useState(false);
  const [mobileOpen, setMobileOpen] = reactExports.useState(false);
  const [openDropdown, setOpenDropdown] = reactExports.useState(null);
  const [openAccordion, setOpenAccordion] = reactExports.useState(null);
  const closeTimerRef = reactExports.useRef(null);
  const cancelClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setOpenDropdown(null);
      closeTimerRef.current = null;
    }, 3e3);
  };
  const openMenu = (label) => {
    cancelClose();
    setOpenDropdown(label);
  };
  reactExports.useEffect(() => () => cancelClose(), []);
  reactExports.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  reactExports.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);
  const closeAll = () => {
    setMobileOpen(false);
    setOpenAccordion(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "header",
    {
      style: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "background-color 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease",
        backgroundColor: scrolled ? "rgba(12, 12, 12, 0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px) saturate(1.4)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px) saturate(1.4)" : "none",
        borderBottom: scrolled ? "1px solid var(--border-subtle)" : "1px solid transparent"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "nav",
          {
            style: {
              maxWidth: "var(--container-max, 1280px)",
              margin: "0 auto",
              padding: "0 2rem"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  height: "4.75rem"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "a",
                    {
                      href: "/",
                      style: { textDecoration: "none", display: "flex", flexDirection: "column", gap: "2px" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "span",
                          {
                            style: {
                              fontFamily: "var(--font-heading)",
                              fontSize: "1.45rem",
                              fontWeight: 400,
                              letterSpacing: "0.06em",
                              color: "var(--text-primary, #f5f0e8)",
                              lineHeight: 1
                            },
                            children: [
                              navigationConfig.brandName,
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "var(--accent, #c9a96e)" }, children: [
                                " ",
                                navigationConfig.brandSubname
                              ] })
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            style: {
                              fontSize: "0.6rem",
                              letterSpacing: "0.22em",
                              textTransform: "uppercase",
                              color: "var(--text-muted, #6b7280)"
                            },
                            children: navigationConfig.tagline
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "ul",
                    {
                      className: "desktop-nav",
                      style: {
                        display: "none",
                        alignItems: "center",
                        gap: "2rem",
                        listStyle: "none",
                        margin: 0,
                        padding: 0
                      },
                      children: navigationConfig.navLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { style: { position: "relative" }, children: link.children ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          onMouseEnter: () => openMenu(link.label),
                          onMouseLeave: scheduleClose,
                          style: { position: "relative" },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "button",
                              {
                                style: {
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  fontSize: "0.8rem",
                                  letterSpacing: "0.1em",
                                  textTransform: "uppercase",
                                  color: "var(--text-secondary, #9ca3af)",
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  padding: 0,
                                  transition: "color 0.2s",
                                  fontFamily: "inherit"
                                },
                                children: [
                                  link.label,
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    ChevronDown,
                                    {
                                      size: 12,
                                      style: {
                                        transition: "transform 0.2s",
                                        transform: openDropdown === link.label ? "rotate(180deg)" : "rotate(0deg)"
                                      }
                                    }
                                  )
                                ]
                              }
                            ),
                            openDropdown === link.label && /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                onMouseEnter: cancelClose,
                                onMouseLeave: scheduleClose,
                                style: {
                                  position: "absolute",
                                  top: "calc(100% + 0.75rem)",
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                  minWidth: "210px",
                                  backgroundColor: "rgba(14, 14, 14, 0.97)",
                                  backdropFilter: "blur(16px)",
                                  border: "1px solid var(--border-subtle)",
                                  borderRadius: "var(--border-radius, 4px)",
                                  padding: "0.5rem 0",
                                  boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                                  animation: "navFadeDown 0.15s ease"
                                },
                                children: link.children.map((child) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "a",
                                  {
                                    href: child.href,
                                    onClick: () => {
                                      cancelClose();
                                      setOpenDropdown(null);
                                    },
                                    style: {
                                      display: "block",
                                      padding: "0.65rem 1.25rem",
                                      fontSize: "0.8rem",
                                      letterSpacing: "0.04em",
                                      color: "var(--text-secondary, #9ca3af)",
                                      textDecoration: "none",
                                      transition: "color 0.2s, background-color 0.2s",
                                      whiteSpace: "nowrap"
                                    },
                                    onMouseEnter: (e) => {
                                      e.currentTarget.style.color = "var(--text-primary, #f5f0e8)";
                                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
                                    },
                                    onMouseLeave: (e) => {
                                      e.currentTarget.style.color = "var(--text-secondary, #9ca3af)";
                                      e.currentTarget.style.backgroundColor = "transparent";
                                    },
                                    children: child.label
                                  },
                                  child.label
                                ))
                              }
                            )
                          ]
                        }
                      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "a",
                        {
                          href: link.href,
                          style: {
                            fontSize: "0.8rem",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "var(--text-secondary, #9ca3af)",
                            textDecoration: "none",
                            transition: "color 0.2s"
                          },
                          onMouseEnter: (e) => {
                            e.currentTarget.style.color = "var(--text-primary, #f5f0e8)";
                          },
                          onMouseLeave: (e) => {
                            e.currentTarget.style.color = "var(--text-secondary, #9ca3af)";
                          },
                          children: link.label
                        }
                      ) }, link.label))
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "a",
                    {
                      href: "/contact",
                      className: "btn-primary desktop-cta",
                      style: {
                        display: "none",
                        padding: "0.6rem 1.4rem",
                        fontSize: "0.75rem",
                        letterSpacing: "0.1em"
                      },
                      children: "Get Started"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => setMobileOpen(!mobileOpen),
                      className: "mobile-menu-btn",
                      "aria-label": mobileOpen ? "Close menu" : "Open menu",
                      "aria-expanded": mobileOpen,
                      style: {
                        display: "none",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-primary, #f5f0e8)",
                        padding: "4px",
                        lineHeight: 0
                      },
                      children: mobileOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { size: 24 })
                    }
                  )
                ]
              }
            )
          }
        ),
        mobileOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              backgroundColor: "var(--page-bg, #0c0c0c)",
              borderTop: "1px solid var(--border-subtle)",
              padding: "0.5rem 2rem 2rem",
              maxHeight: "calc(100vh - 4.75rem)",
              overflowY: "auto"
            },
            children: [
              navigationConfig.navLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: link.children ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => setOpenAccordion(openAccordion === link.label ? null : link.label),
                    style: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "1rem 0",
                      fontSize: "0.875rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--text-secondary, #9ca3af)",
                      background: "none",
                      border: "none",
                      borderBottom: "1px solid var(--border-subtle)",
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "inherit"
                    },
                    children: [
                      link.label,
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ChevronDown,
                        {
                          size: 14,
                          style: {
                            transition: "transform 0.2s",
                            transform: openAccordion === link.label ? "rotate(180deg)" : "rotate(0deg)"
                          }
                        }
                      )
                    ]
                  }
                ),
                openAccordion === link.label && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { paddingBottom: "0.5rem" }, children: link.children.map((child) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: child.href,
                    onClick: closeAll,
                    style: {
                      display: "block",
                      padding: "0.6rem 0 0.6rem 1rem",
                      fontSize: "0.8125rem",
                      color: "var(--text-muted, #6b7280)",
                      textDecoration: "none",
                      transition: "color 0.2s"
                    },
                    children: child.label
                  },
                  child.label
                )) })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: link.href,
                  onClick: closeAll,
                  style: {
                    display: "block",
                    padding: "1rem 0",
                    fontSize: "0.875rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--text-secondary, #9ca3af)",
                    textDecoration: "none",
                    borderBottom: "1px solid var(--border-subtle)"
                  },
                  children: link.label
                }
              ) }, link.label)),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: "/contact",
                  onClick: closeAll,
                  className: "btn-primary",
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    marginTop: "1.75rem",
                    boxSizing: "border-box"
                  },
                  children: "Get Started"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes navFadeDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0);    }
        }
        @media (min-width: 1024px) {
          .desktop-nav     { display: flex !important; }
          .desktop-cta     { display: inline-flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 1023px) {
          .desktop-nav     { display: none !important; }
          .desktop-cta     { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      ` })
      ]
    }
  );
}
const socialIconMap = {
  Linkedin,
  Twitter,
  Instagram
};
function Footer() {
  const [email, setEmail] = reactExports.useState("");
  const [newsletterStatus, setNewsletterStatus] = reactExports.useState("idle");
  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setNewsletterStatus("success");
      setEmail("");
    } else {
      setNewsletterStatus("error");
    }
  };
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "footer",
    {
      style: {
        backgroundColor: "var(--surface-1)",
        borderTop: "1px solid var(--border-subtle)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "container-custom",
            style: { paddingTop: "4rem", paddingBottom: "3rem" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "footer-grid",
                style: {
                  display: "grid",
                  gridTemplateColumns: "2fr repeat(2, 1fr) 1.5fr",
                  gap: "3rem",
                  alignItems: "start"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "a",
                      {
                        href: "/",
                        style: {
                          display: "inline-block",
                          marginBottom: "1rem",
                          textDecoration: "none"
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "span",
                          {
                            style: {
                              fontFamily: "var(--font-heading)",
                              fontSize: "1.5rem",
                              fontWeight: 300,
                              letterSpacing: "0.05em",
                              color: "var(--text-primary)"
                            },
                            children: [
                              footerConfig.brandName,
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "var(--accent)" }, children: [
                                " ",
                                footerConfig.brandSubname
                              ] })
                            ]
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        style: {
                          fontSize: "0.875rem",
                          color: "var(--text-muted)",
                          lineHeight: 1.7,
                          marginBottom: "1.5rem"
                        },
                        children: footerConfig.description
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "0.75rem" }, children: footerConfig.socialLinks.map((link) => {
                      const Icon = socialIconMap[link.icon];
                      return /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "a",
                        {
                          href: link.href,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          "aria-label": link.platform,
                          style: {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "2.25rem",
                            height: "2.25rem",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: "50%",
                            color: "var(--text-muted)",
                            transition: "border-color 0.2s, color 0.2s",
                            textDecoration: "none"
                          },
                          children: Icon ? /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 15 }) : link.platform[0]
                        },
                        link.platform
                      );
                    }) })
                  ] }),
                  footerConfig.linkGroups.map((group) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "h4",
                      {
                        style: {
                          fontSize: "0.7rem",
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: "var(--text-muted)",
                          marginBottom: "1rem",
                          fontFamily: "var(--font-body)",
                          fontWeight: 600
                        },
                        children: group.title
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "ul",
                      {
                        style: {
                          listStyle: "none",
                          padding: 0,
                          margin: 0,
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.6rem"
                        },
                        children: group.links.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "a",
                          {
                            href: link.href,
                            style: {
                              fontSize: "0.875rem",
                              color: "var(--text-muted)",
                              textDecoration: "none",
                              transition: "color 0.2s"
                            },
                            children: link.label
                          }
                        ) }, link.label))
                      }
                    )
                  ] }, group.title)),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "h4",
                      {
                        style: {
                          fontSize: "0.7rem",
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: "var(--text-muted)",
                          marginBottom: "0.5rem",
                          fontFamily: "var(--font-body)",
                          fontWeight: 600
                        },
                        children: footerConfig.newsletter.label
                      }
                    ),
                    newsletterStatus === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.875rem", color: "var(--accent)" }, children: footerConfig.newsletter.successMessage }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "form",
                      {
                        onSubmit: handleNewsletter,
                        style: { display: "flex", gap: "0.5rem", flexDirection: "column" },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              type: "email",
                              value: email,
                              onChange: (e) => setEmail(e.target.value),
                              placeholder: footerConfig.newsletter.placeholder,
                              style: {
                                padding: "0.65rem 0.875rem",
                                backgroundColor: "var(--surface-2)",
                                border: "1px solid var(--border-subtle)",
                                color: "var(--text-primary)",
                                fontSize: "0.875rem",
                                borderRadius: "var(--border-radius)",
                                outline: "none"
                              }
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "submit",
                              className: "btn-primary",
                              style: { padding: "0.65rem 1rem", fontSize: "0.8rem" },
                              children: footerConfig.newsletter.buttonText
                            }
                          ),
                          newsletterStatus === "error" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "#ef4444", margin: 0 }, children: footerConfig.newsletter.errorMessage })
                        ]
                      }
                    )
                  ] })
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "1px", backgroundColor: "var(--border-subtle)" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "container-custom",
            style: { paddingTop: "1.25rem", paddingBottom: "1.25rem" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "1rem"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }, children: footerConfig.copyrightText }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "1.5rem", flexWrap: "wrap" }, children: footerConfig.legalLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "a",
                      {
                        href: link.href,
                        style: {
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                          textDecoration: "none",
                          transition: "color 0.2s"
                        },
                        children: link.label
                      },
                      link.label
                    )) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: scrollToTop,
                        style: {
                          fontSize: "0.7rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "var(--text-muted)",
                          background: "none",
                          border: "1px solid var(--border-subtle)",
                          padding: "0.4rem 0.75rem",
                          cursor: "pointer",
                          borderRadius: "var(--border-radius)",
                          transition: "border-color 0.2s, color 0.2s"
                        },
                        children: "Back to Top ↑"
                      }
                    )
                  ]
                }
              ),
              footerConfig.creditText
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @media (max-width: 1023px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 767px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      ` })
      ]
    }
  );
}
function ScrollToTop() {
  const [visible, setVisible] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick: scrollToTop,
      "aria-label": "Scroll to top",
      style: {
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "3rem",
        height: "3rem",
        borderRadius: "50%",
        backgroundColor: "var(--accent)",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.8)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        pointerEvents: visible ? "auto" : "none"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { size: 18 })
    }
  );
}
const $$CloudflareAnalytics = createComponent(($$result, $$props, $$slots) => {
  const token = void 0;
  return renderTemplate`${token}`;
}, "C:/Users/mikes/Leverage-AI-Astro-Site/src/components/CloudflareAnalytics.astro", void 0);
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$BaseLayout;
  const {
    title = siteConfig.title,
    description = siteConfig.description,
    keywords = siteConfig.keywords,
    ogImage = siteConfig.ogImage,
    canonical = Astro2.url.href,
    noIndex = false
  } = Astro2.props;
  const fullTitle = title === siteConfig.title ? title : `${title} | Leverage AI`;
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": localBusinessConfig.type,
    name: localBusinessConfig.name,
    description: localBusinessConfig.description,
    foundingDate: localBusinessConfig.foundingDate,
    url: siteConfig.url,
    email: localBusinessConfig.email,
    telephone: localBusinessConfig.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: localBusinessConfig.streetAddress,
      addressLocality: localBusinessConfig.city,
      addressRegion: localBusinessConfig.state,
      postalCode: localBusinessConfig.postalCode,
      addressCountry: localBusinessConfig.country
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: localBusinessConfig.latitude,
      longitude: localBusinessConfig.longitude
    },
    openingHours: localBusinessConfig.openingHours,
    sameAs: localBusinessConfig.socialProfiles
  };
  return renderTemplate(_a || (_a = __template(["<html", '> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><!-- Primary Meta --><title>', '</title><meta name="description"', '><meta name="keywords"', '><link rel="canonical"', ">", '<!-- Open Graph (Facebook, LinkedIn, iMessage, Slack, Discord) --><meta property="og:type" content="website"><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:type" content="image/webp"><meta property="og:image:alt"', '><meta property="og:locale" content="en_US"><meta property="og:site_name" content="Leverage AI"><!-- Twitter / X Card --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:site" content="@leverageai"><meta name="twitter:creator" content="@leverageai"><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', '><meta name="twitter:image:alt"', '><!-- Favicon — webp primary, ico fallback, apple touch --><link rel="icon" type="image/webp" href="/images/leverageai-logo.webp"><link rel="shortcut icon" type="image/webp" href="/images/leverageai-logo.webp"><link rel="apple-touch-icon" href="/images/leverageai-logo.webp"><meta name="theme-color" content="#d4900f"><!-- Preconnect for performance --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="preconnect" href="https://static.cloudflareinsights.com"><!-- Astro View Transitions — smooth page-to-page navigation -->', '<!-- JSON-LD: ProfessionalService --><script type="application/ld+json">', "<\/script><!-- Additional head slot for page-specific JSON-LD -->", "", "</head> <body> <!-- Navigation — hydrated immediately for scroll listener + mobile menu --> ", " <!-- Page content --> <main> ", " </main> <!-- Footer — hydrated when visible for performance --> ", " <!-- Floating scroll-to-top --> ", " <!-- Cloudflare Web Analytics --> ", " </body></html>"])), addAttribute(siteConfig.language, "lang"), fullTitle, addAttribute(description, "content"), addAttribute(keywords, "content"), addAttribute(canonical, "href"), noIndex && renderTemplate`<meta name="robots" content="noindex, nofollow">`, addAttribute(canonical, "content"), addAttribute(fullTitle, "content"), addAttribute(description, "content"), addAttribute(`${siteConfig.url}${ogImage}`, "content"), addAttribute(`${fullTitle} — Leverage AI`, "content"), addAttribute(fullTitle, "content"), addAttribute(description, "content"), addAttribute(`${siteConfig.url}${ogImage}`, "content"), addAttribute(`${fullTitle} — Leverage AI`, "content"), renderComponent($$result, "ClientRouter", $$ClientRouter, {}), unescapeHTML(JSON.stringify(localBusinessSchema)), renderSlot($$result, $$slots["head"]), renderHead(), renderComponent($$result, "Navigation", Navigation, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/mikes/Leverage-AI-Astro-Site/src/components/Navigation", "client:component-export": "default" }), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Footer", Footer, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "C:/Users/mikes/Leverage-AI-Astro-Site/src/components/Footer", "client:component-export": "default" }), renderComponent($$result, "ScrollToTop", ScrollToTop, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "C:/Users/mikes/Leverage-AI-Astro-Site/src/components/ScrollToTop", "client:component-export": "default" }), renderComponent($$result, "CloudflareAnalytics", $$CloudflareAnalytics, {}));
}, "C:/Users/mikes/Leverage-AI-Astro-Site/src/layouts/BaseLayout.astro", void 0);
export {
  $$BaseLayout as $,
  renderScript as r
};
