globalThis.process ??= {};
globalThis.process.env ??= {};
import { b as createLucideIcon, c as contactConfig, j as jsxRuntimeExports } from "./createLucideIcon_DZRUm3Z8.mjs";
import { d as reactExports } from "./worker-entry_D9jsJv2k.mjs";
const CircleAlert = createLucideIcon("CircleAlert", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
]);
const CircleCheckBig = createLucideIcon("CircleCheckBig", [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
]);
const Clock = createLucideIcon("Clock", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
]);
const Mail = createLucideIcon("Mail", [
  ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2", key: "18n3k1" }],
  ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7", key: "1ocrg3" }]
]);
const MapPin = createLucideIcon("MapPin", [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
]);
const Phone = createLucideIcon("Phone", [
  [
    "path",
    {
      d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
      key: "foiqr5"
    }
  ]
]);
const __vite_import_meta_env__ = { "ASSETS_PREFIX": void 0, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://leverageai.network", "SSR": true };
const iconMap = {
  Mail,
  MapPin,
  Phone,
  Clock
};
const inputStyle = {
  width: "100%",
  padding: "0.875rem 1rem",
  backgroundColor: "var(--surface-1)",
  border: "1px solid var(--border-subtle)",
  color: "var(--text-primary, #f5f0e8)",
  fontSize: "0.9rem",
  outline: "none",
  borderRadius: "var(--border-radius, 4px)",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
  fontFamily: "inherit"
};
const labelStyle = {
  display: "block",
  fontSize: "0.7rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--text-muted, #6b7280)",
  marginBottom: "0.4rem",
  fontWeight: 500
};
function ContactForm() {
  const [status, setStatus] = reactExports.useState("idle");
  const [form, setForm] = reactExports.useState({
    name: "",
    email: "",
    company: "",
    service: "",
    message: ""
  });
  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const formEndpoint = (() => {
    const envId = typeof import.meta !== "undefined" && Object.assign(__vite_import_meta_env__, { OS: "Windows_NT", PUBLIC: "C:\\Users\\Public" }) ? Object.assign(__vite_import_meta_env__, { OS: "Windows_NT", PUBLIC: "C:\\Users\\Public" }).PUBLIC_FORMSPREE_ID ?? "" : "";
    return envId ? `https://formspree.io/f/${envId}` : contactConfig.formEndpoint;
  })();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form)
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      id: "contact",
      className: "section-padding grain",
      style: { backgroundColor: "var(--surface-1)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-custom", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "contact-grid", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "eyebrow",
                style: { marginBottom: "0.75rem" },
                children: contactConfig.eyebrow
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h2",
              {
                style: {
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 300,
                  margin: "0 0 1rem",
                  color: "var(--text-primary, #f5f0e8)",
                  lineHeight: 1.15
                },
                children: contactConfig.headline
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                style: {
                  color: "var(--text-secondary, #9ca3af)",
                  marginBottom: "2.5rem",
                  lineHeight: 1.7
                },
                children: contactConfig.subtext
              }
            ),
            status === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                  padding: "1.5rem",
                  backgroundColor: "rgba(34, 197, 94, 0.08)",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  borderRadius: "var(--border-radius, 4px)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 24, color: "#22c55e", style: { flexShrink: 0, marginTop: "2px" } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#22c55e", margin: "0 0 0.25rem", fontWeight: 500 }, children: "Message Sent" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--text-secondary)", margin: 0, fontSize: "0.9rem" }, children: contactConfig.successMessage })
                  ] })
                ]
              }
            ) : (
              /* ── Form ───────────────────────────────────────── */
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "form",
                {
                  onSubmit: handleSubmit,
                  style: { display: "flex", flexDirection: "column", gap: "1.25rem" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-row-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: labelStyle, children: contactConfig.fields.name.label }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "text",
                            required: true,
                            placeholder: contactConfig.fields.name.placeholder,
                            value: form.name,
                            onChange: (e) => update("name", e.target.value),
                            style: inputStyle
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: labelStyle, children: contactConfig.fields.email.label }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "email",
                            required: true,
                            placeholder: contactConfig.fields.email.placeholder,
                            value: form.email,
                            onChange: (e) => update("email", e.target.value),
                            style: inputStyle
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: labelStyle, children: contactConfig.fields.company.label }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "text",
                          placeholder: contactConfig.fields.company.placeholder,
                          value: form.company,
                          onChange: (e) => update("company", e.target.value),
                          style: inputStyle
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: labelStyle, children: contactConfig.fields.service.label }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "select",
                        {
                          value: form.service,
                          onChange: (e) => update("service", e.target.value),
                          style: {
                            ...inputStyle,
                            cursor: "pointer",
                            appearance: "none",
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 1rem center",
                            paddingRight: "2.5rem"
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select a service…" }),
                            contactConfig.fields.service.options.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt, children: opt }, opt))
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: labelStyle, children: contactConfig.fields.message.label }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "textarea",
                        {
                          rows: 5,
                          placeholder: contactConfig.fields.message.placeholder,
                          value: form.message,
                          onChange: (e) => update("message", e.target.value),
                          style: { ...inputStyle, resize: "vertical", lineHeight: 1.6 }
                        }
                      )
                    ] }),
                    status === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          color: "#ef4444"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 16 }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.875rem" }, children: contactConfig.errorMessage })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "form-submit-row", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "submit",
                        disabled: status === "loading",
                        className: "btn-primary",
                        style: {
                          opacity: status === "loading" ? 0.7 : 1,
                          cursor: status === "loading" ? "not-allowed" : "pointer"
                        },
                        children: status === "loading" ? "Sending…" : contactConfig.submitText
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.72rem", color: "var(--text-muted)", margin: 0 }, children: contactConfig.privacyNotice })
                  ]
                }
              )
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "2rem" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                  gap: "1rem"
                },
                children: contactConfig.contactItems.map((item) => {
                  const Icon = iconMap[item.icon];
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      style: {
                        padding: "1.25rem",
                        backgroundColor: "var(--surface-2, rgba(255,255,255,0.03))",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--border-radius, 4px)"
                      },
                      children: [
                        Icon && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Icon,
                          {
                            size: 18,
                            color: "var(--accent, #c9a96e)",
                            style: { marginBottom: "0.625rem" }
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            style: {
                              fontSize: "0.65rem",
                              textTransform: "uppercase",
                              letterSpacing: "0.14em",
                              color: "var(--text-muted, #6b7280)",
                              margin: "0 0 0.3rem"
                            },
                            children: item.label
                          }
                        ),
                        item.href ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "a",
                          {
                            href: item.href,
                            style: {
                              fontSize: "0.875rem",
                              color: "var(--text-secondary, #9ca3af)",
                              textDecoration: "none",
                              transition: "color 0.2s"
                            },
                            children: item.value
                          }
                        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            style: {
                              fontSize: "0.875rem",
                              color: "var(--text-secondary, #9ca3af)",
                              margin: 0
                            },
                            children: item.value
                          }
                        )
                      ]
                    },
                    item.label
                  );
                })
              }
            ),
            contactConfig.googleMapsEmbed,
            contactConfig.directoryLinks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  style: {
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    color: "var(--text-muted, #6b7280)",
                    marginBottom: "0.875rem"
                  },
                  children: "Find Us Online"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: "0.5rem" }, children: contactConfig.directoryLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: link.href,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  style: {
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.45rem 0.875rem",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--border-radius, 4px)",
                    fontSize: "0.75rem",
                    color: "var(--text-muted, #6b7280)",
                    textDecoration: "none",
                    transition: "border-color 0.2s, color 0.2s"
                  },
                  onMouseEnter: (e) => {
                    e.currentTarget.style.color = "var(--text-primary, #f5f0e8)";
                    e.currentTarget.style.borderColor = "var(--accent, #c9a96e)";
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.color = "var(--text-muted, #6b7280)";
                    e.currentTarget.style.borderColor = "var(--border-subtle)";
                  },
                  children: [
                    link.name,
                    link.badge && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        style: {
                          fontSize: "0.65rem",
                          color: "var(--accent, #c9a96e)",
                          fontWeight: 600
                        },
                        children: link.badge
                      }
                    )
                  ]
                },
                link.name
              )) })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .form-submit-row .btn-primary {
          width: auto;
          min-width: 160px;
        }
        @media (max-width: 767px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .form-row-2 {
            grid-template-columns: 1fr !important;
          }
          .form-submit-row .btn-primary {
            width: 100% !important;
          }
        }
      ` })
      ]
    }
  );
}
export {
  ContactForm as C
};
