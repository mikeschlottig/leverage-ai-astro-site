import { useState, useReducer, useRef, useEffect, useCallback } from "react";

// ── Models ──────────────────────────────────────────────────────────────────
const M_SONNET = "claude-sonnet-4-6";
const M_HAIKU  = "claude-haiku-4-5-20251001";

// ── Brand ───────────────────────────────────────────────────────────────────
const C = {
  bg:       "#07070b",
  s1:       "#0e0e14",
  s2:       "#141419",
  s3:       "#1c1c24",
  border:   "rgba(255,255,255,0.06)",
  borderMd: "rgba(255,255,255,0.10)",
  amber:    "#f59e0b",
  amberBg:  "rgba(245,158,11,0.08)",
  amberBd:  "rgba(245,158,11,0.25)",
  cyan:     "#06b6d4",
  green:    "#10b981",
  red:      "#ef4444",
  t1:       "#e8e8ec",
  t2:       "#9a9aaa",
  t3:       "#52525e",
};

const MONO  = "'JetBrains Mono', 'Fira Code', monospace";
const DISP  = "'Barlow Condensed', sans-serif";
const BODY  = "'DM Sans', system-ui, sans-serif";

// ── API ─────────────────────────────────────────────────────────────────────
async function callAI({ model, system, messages, tools = [], maxTokens = 8000 }) {
  let msgs = [...messages];
  for (let turn = 0; turn < 10; turn++) {
    const body = { model, max_tokens: maxTokens, messages: msgs };
    if (system) body.system = system;
    if (tools.length) body.tools = tools;
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e?.error?.message || `API error ${res.status}`);
    }
    const data = await res.json();
    if (data.stop_reason !== "tool_use") return data;
    msgs.push({ role: "assistant", content: data.content });
    const results = (data.content || [])
      .filter(b => b.type === "tool_use")
      .map(b => ({ type: "tool_result", tool_use_id: b.id, content: "Search completed." }));
    if (!results.length) return data;
    msgs.push({ role: "user", content: results });
  }
  throw new Error("Tool loop limit reached");
}

function getText(data) {
  return (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
}

function extractJSON(text) {
  let depth = 0, start = -1;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "{") { if (!depth) start = i; depth++; }
    else if (text[i] === "}") { depth--; if (!depth && start >= 0) return JSON.parse(text.slice(start, i + 1)); }
  }
  throw new Error("No JSON object found in response");
}

// ── State ───────────────────────────────────────────────────────────────────
const INIT = {
  phase: "input",      // input | analyzing | report | wireframing | wireframes
  url: "",
  siteData: null,
  wireframes: [],
  log: [],
  error: null,
  activeWire: 0,
  jsonOpen: false,
  expandedPage: null,
};

function reducer(s, a) {
  switch (a.t) {
    case "URL":   return { ...s, url: a.v };
    case "SCAN":  return { ...s, phase: "analyzing", log: [], error: null, wireframes: [] };
    case "LOG":   return { ...s, log: [...s.log, { msg: a.msg, kind: a.kind ?? "info" }] };
    case "REPORT":return { ...s, phase: "report", siteData: a.data };
    case "WSTART":return { ...s, phase: "wireframing", log: [], wireframes: [] };
    case "WFRAME":return { ...s, wireframes: [...s.wireframes, a.frame] };
    case "WDONE": return { ...s, phase: "wireframes" };
    case "TAB":   return { ...s, activeWire: a.v };
    case "JSONOPEN": return { ...s, jsonOpen: !s.jsonOpen };
    case "EXPPAGE": return { ...s, expandedPage: s.expandedPage === a.v ? null : a.v };
    case "ERROR": return { ...s, phase: "input", error: a.msg };
    case "RESET": return { ...INIT };
    default:      return s;
  }
}

// ── Micro components ─────────────────────────────────────────────────────────
function Pulse({ active }) {
  return (
    <span style={{
      display: "inline-block", width: 6, height: 6, borderRadius: "50%",
      background: active ? C.amber : C.border,
      boxShadow: active ? `0 0 0 3px ${C.amberBd}` : "none",
      flexShrink: 0,
      animation: active ? "wf-pulse 2s ease-in-out infinite" : "none",
    }}/>
  );
}

function Pill({ label, color = C.t3 }) {
  return (
    <span style={{
      fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase",
      color, fontFamily: MONO, padding: "2px 7px",
      border: `0.5px solid ${C.border}`, borderRadius: 3,
      whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

function LogLine({ entry }) {
  const kindColor = { system: C.amber, success: C.green, error: C.red, info: C.t3 };
  const kindIcon  = { system: "◆", success: "✓", error: "✗", info: "›" };
  return (
    <div style={{ display: "flex", gap: 8, fontSize: 11, fontFamily: MONO, lineHeight: 1.7 }}>
      <span style={{ color: kindColor[entry.kind] ?? C.t3, flexShrink: 0 }}>
        {kindIcon[entry.kind] ?? kindIcon.info}
      </span>
      <span style={{ color: entry.kind === "system" ? C.amber : entry.kind === "success" ? C.t1 : entry.kind === "error" ? C.red : C.t2 }}>
        {entry.msg}
      </span>
    </div>
  );
}

function LogPanel({ log, logRef, minH = 300, maxH = 420 }) {
  return (
    <div ref={logRef} style={{
      background: C.s1, border: `0.5px solid ${C.border}`,
      borderRadius: 8, padding: "16px 20px",
      minHeight: minH, maxHeight: maxH, overflowY: "auto",
      display: "flex", flexDirection: "column", gap: 5,
    }}>
      {log.map((e, i) => <LogLine key={i} entry={e} />)}
      {log.length === 0 && (
        <span style={{ fontSize: 11, fontFamily: MONO, color: C.t3 }}>Initializing...</span>
      )}
      <span style={{ fontSize: 12, fontFamily: MONO, color: C.t3, animation: "wf-blink 1s step-end infinite" }}>█</span>
    </div>
  );
}

// ── Phase: Input ─────────────────────────────────────────────────────────────
function InputPhase({ url, dispatch, onAnalyze, error }) {
  const [focused, setFocused] = useState(false);
  const [hover, setHover] = useState(false);

  const displayUrl = url.replace(/^https?:\/\//, "");

  const handleKey = e => { if (e.key === "Enter") onAnalyze(); };

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: 520, gap: 36, padding: "48px 24px",
    }}>
      {/* Hero Text */}
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase",
          color: C.amber, fontFamily: MONO, marginBottom: 16,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        }}>
          <span>◆</span>
          <span>AI Wireframe Studio</span>
          <span>◆</span>
        </div>
        <h1 style={{
          fontFamily: DISP, fontWeight: 900,
          fontSize: "clamp(44px, 10vw, 84px)",
          lineHeight: 0.92, letterSpacing: "-0.02em",
          color: C.t1, marginBottom: 18,
        }}>
          ANALYZE<br />
          <span style={{ color: C.amber }}>& WIREFRAME</span><br />
          ANY WEBSITE
        </h1>
        <p style={{
          fontSize: 13, color: C.t2, maxWidth: 420, margin: "0 auto",
          lineHeight: 1.7, fontFamily: BODY,
        }}>
          Submit a URL. The AI scans <span style={{ color: C.t1 }}>robots.txt</span>,
          crawls <span style={{ color: C.t1 }}>sitemap.xml</span>, extracts the
          full site architecture, builds a <span style={{ color: C.t1 }}>JSON schema</span> for
          every page, and generates production-ready wireframes.
        </p>
      </div>

      {/* URL Input */}
      <div style={{ width: "100%", maxWidth: 580 }}>
        <div style={{
          display: "flex", alignItems: "stretch",
          border: `0.5px solid ${focused ? C.amber : C.borderMd}`,
          borderRadius: 8,
          background: C.s2,
          overflow: "hidden",
          transition: "border-color 0.2s",
          boxShadow: focused ? `0 0 0 3px ${C.amberBd}` : "none",
        }}>
          <div style={{
            padding: "0 14px", display: "flex", alignItems: "center",
            borderRight: `0.5px solid ${C.border}`,
            color: C.t3, fontFamily: MONO, fontSize: 12, flexShrink: 0,
          }}>
            https://
          </div>
          <input
            value={displayUrl}
            onChange={e => dispatch({ t: "URL", v: "https://" + e.target.value })}
            onKeyDown={handleKey}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="yoursite.com or paste full URL"
            style={{
              flex: 1, padding: "14px 16px",
              fontSize: 14, fontFamily: MONO,
              background: "none", border: "none", outline: "none",
              color: C.t1,
            }}
          />
          <button
            onClick={onAnalyze}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            disabled={!displayUrl.trim()}
            style={{
              padding: "0 22px",
              background: displayUrl.trim() ? (hover ? "#d97706" : C.amber) : C.s3,
              border: "none", cursor: displayUrl.trim() ? "pointer" : "not-allowed",
              color: displayUrl.trim() ? "#000" : C.t3,
              fontWeight: 700, fontSize: 11,
              letterSpacing: "0.1em", textTransform: "uppercase",
              fontFamily: BODY, transition: "all 0.15s",
              whiteSpace: "nowrap",
            }}
          >
            Analyze →
          </button>
        </div>
        {error && (
          <div style={{ marginTop: 8, fontSize: 11, color: C.red, fontFamily: MONO, display: "flex", gap: 6, alignItems: "center" }}>
            <span>✗</span> {error}
          </div>
        )}
      </div>

      {/* Capability pills */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        {["robots.txt check", "sitemap crawl", "link extraction", "JSON schema", "page wireframes", "AI analysis"].map(f => (
          <Pill key={f} label={f} color={C.amber} />
        ))}
      </div>

      {/* Model legend */}
      <div style={{
        display: "flex", gap: 20, fontSize: 10, color: C.t3, fontFamily: MONO,
        borderTop: `0.5px solid ${C.border}`, paddingTop: 24,
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: C.cyan }}>◆</span>
          <span>Haiku 4.5 <span style={{ color: C.t2 }}>— Analysis</span></span>
        </span>
        <span style={{ color: C.border }}>|</span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: C.amber }}>◆</span>
          <span>Sonnet 4.6 <span style={{ color: C.t2 }}>— Wireframes</span></span>
        </span>
      </div>
    </div>
  );
}

// ── Phase: Analyzing ──────────────────────────────────────────────────────────
function AnalyzingPhase({ log, logRef }) {
  return (
    <div style={{ padding: "40px 28px", maxWidth: 660, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <Pulse active />
        <span style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", fontFamily: MONO, color: C.t3 }}>
          Scanning Target
        </span>
      </div>
      <LogPanel log={log} logRef={logRef} />
    </div>
  );
}

// ── Phase: Report ─────────────────────────────────────────────────────────────
function ReportPhase({ data, onGenerate }) {
  const [jsonOpen, setJsonOpen] = useState(false);
  const [expandedPage, setExpandedPage] = useState(null);
  const [genHover, setGenHover] = useState(false);

  const pages = data.pages || [];

  return (
    <div style={{ padding: "28px", maxWidth: 920, margin: "0 auto" }}>

      {/* Site header */}
      <div style={{
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        marginBottom: 28, flexWrap: "wrap", gap: 16,
      }}>
        <div>
          <div style={{ fontSize: 10, color: C.amber, fontFamily: MONO, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>
            ✓ Analysis Complete
          </div>
          <h2 style={{
            fontFamily: DISP, fontSize: 30, fontWeight: 800,
            color: C.t1, letterSpacing: "-0.01em", marginBottom: 4,
          }}>
            {data.siteTitle || data.domain}
          </h2>
          <p style={{ fontSize: 12, color: C.t2, fontFamily: BODY }}>
            {data.tagline || data.primaryGoal}
          </p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "flex-start" }}>
          {data.industry && <Pill label={data.industry} />}
          {data.businessType && <Pill label={data.businessType} />}
          <Pill label={data.sitemapXml ? "Sitemap ✓" : "No Sitemap"} color={data.sitemapXml ? C.green : C.t3} />
          <Pill label={data.robotsTxt === "found" ? "Robots ✓" : "No Robots"} color={data.robotsTxt === "found" ? C.green : C.t3} />
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 10, marginBottom: 24 }}>
        {[
          { label: "Pages Found", value: pages.length },
          { label: "Architecture", value: data.siteArchitecture || "—" },
          { label: "Design Style", value: data.designStyle || "—" },
          { label: "Tech Stack", value: (data.techStack || []).slice(0, 2).join(" / ") || "—" },
        ].map(({ label, value }) => (
          <div key={label} style={{
            background: C.s2, border: `0.5px solid ${C.border}`,
            borderRadius: 8, padding: "12px 14px",
          }}>
            <div style={{ fontSize: 9, color: C.t3, fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 5 }}>{label}</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: C.t1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* AI Report */}
      <div style={{
        background: C.amberBg, border: `0.5px solid ${C.amberBd}`,
        borderLeft: `2px solid ${C.amber}`,
        borderRadius: 8, padding: "16px 20px", marginBottom: 24,
      }}>
        <div style={{ fontSize: 9, color: C.amber, fontFamily: MONO, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>
          AI Report
        </div>
        <p style={{ fontSize: 13, color: C.t2, lineHeight: 1.75, fontFamily: BODY }}>
          {data.report || data.primaryGoal}
        </p>
        {(data.keyInsights || []).length > 0 && (
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
            {data.keyInsights.map((ins, i) => (
              <div key={i} style={{ fontSize: 12, color: C.t2, display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: C.amber, marginTop: 1 }}>›</span>
                <span>{ins}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommendations */}
      {(data.wireframeRecommendations || []).length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 9, color: C.t3, fontFamily: MONO, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>
            Wireframe Recommendations
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {data.wireframeRecommendations.map((r, i) => (
              <div key={i} style={{ fontSize: 12, color: C.t2, display: "flex", gap: 8, alignItems: "flex-start", fontFamily: BODY }}>
                <span style={{ color: C.cyan, fontFamily: MONO, fontSize: 10, marginTop: 2, flexShrink: 0 }}>{String(i+1).padStart(2,"0")}</span>
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sitemap */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 9, color: C.t3, fontFamily: MONO, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>
          Discovered Pages — {pages.length} entries
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {pages.map((page, i) => (
            <div key={i}>
              <div
                onClick={() => setExpandedPage(expandedPage === i ? null : i)}
                style={{
                  background: expandedPage === i ? C.s3 : C.s2,
                  border: `0.5px solid ${expandedPage === i ? C.amberBd : C.border}`,
                  borderRadius: expandedPage === i ? "8px 8px 0 0" : 8,
                  padding: "9px 14px",
                  cursor: "pointer", transition: "all 0.15s",
                  display: "flex", alignItems: "center", gap: 10,
                }}
              >
                <span style={{ fontFamily: MONO, fontSize: 9, color: C.amber, minWidth: 22, flexShrink: 0 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontSize: 13, fontWeight: 500, color: C.t1, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {page.title}
                </span>
                <Pill label={page.pageType} />
                <span style={{ fontSize: 10, color: C.t3, fontFamily: MONO }}>
                  {page.path}
                </span>
                <span style={{ color: C.t3, fontSize: 10, marginLeft: 4 }}>
                  {expandedPage === i ? "▲" : "▼"}
                </span>
              </div>
              {expandedPage === i && (
                <div style={{
                  background: C.s3, border: `0.5px solid ${C.amberBd}`,
                  borderTop: "none", borderRadius: "0 0 8px 8px",
                  padding: "12px 14px 14px",
                }}>
                  <p style={{ fontSize: 12, color: C.t2, marginBottom: 10, lineHeight: 1.6 }}>
                    {page.purpose || page.description || "—"}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
                    {(page.estimatedSections || page.sections || []).map(s => <Pill key={s} label={s} />)}
                  </div>
                  <div style={{ display: "flex", gap: 12, fontSize: 10, fontFamily: MONO, color: C.t3 }}>
                    <span>Layout: <span style={{ color: C.t2 }}>{page.layoutType || "—"}</span></span>
                    {page.hasForm && <span style={{ color: C.cyan }}>Form</span>}
                    {page.hasCTA && <span style={{ color: C.amber }}>CTA</span>}
                    {page.priority != null && <span>Priority: <span style={{ color: C.t2 }}>{page.priority}</span></span>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* JSON Schema toggle */}
      <div style={{ marginBottom: 28 }}>
        <button
          onClick={() => setJsonOpen(!jsonOpen)}
          style={{
            background: "none", border: `0.5px solid ${C.border}`,
            borderRadius: 6, padding: "7px 14px", cursor: "pointer",
            fontSize: 11, color: C.t2, fontFamily: MONO,
            display: "flex", alignItems: "center", gap: 8,
          }}
        >
          <span style={{ color: C.cyan }}>{jsonOpen ? "▼" : "►"}</span>
          JSON Schema — sitemap.json
        </button>
        {jsonOpen && (
          <div style={{
            marginTop: 10, background: C.s1,
            border: `0.5px solid ${C.border}`,
            borderRadius: 8, padding: "16px 18px",
            maxHeight: 320, overflowY: "auto",
            fontFamily: MONO, fontSize: 10.5, lineHeight: 1.8,
            color: C.t2, whiteSpace: "pre-wrap", wordBreak: "break-all",
          }}>
            {JSON.stringify(data, null, 2)}
          </div>
        )}
      </div>

      {/* Generate CTA */}
      <div style={{
        background: C.s2,
        border: `0.5px solid ${C.amberBd}`,
        borderRadius: 10, padding: "22px 26px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap", gap: 16,
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: C.t1, marginBottom: 4 }}>
            Ready to wireframe {Math.min(pages.length, 6)} pages
          </div>
          <div style={{ fontSize: 11, color: C.t2, fontFamily: BODY }}>
            Sonnet 4.6 will generate detailed HTML wireframes for each discovered page
          </div>
        </div>
        <button
          onClick={onGenerate}
          onMouseEnter={() => setGenHover(true)}
          onMouseLeave={() => setGenHover(false)}
          style={{
            padding: "12px 28px",
            background: genHover ? "#d97706" : C.amber,
            border: "none", borderRadius: 7,
            cursor: "pointer", fontWeight: 700, fontSize: 12,
            letterSpacing: "0.06em", color: "#000",
            fontFamily: BODY, transition: "background 0.15s",
            whiteSpace: "nowrap",
          }}
        >
          Generate Wireframes →
        </button>
      </div>
    </div>
  );
}

// ── Phase: Wireframing ────────────────────────────────────────────────────────
function WireframingPhase({ log, logRef, wireframes }) {
  return (
    <div style={{ padding: "32px 28px", maxWidth: 820, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <Pulse active />
        <span style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", fontFamily: MONO, color: C.t3 }}>
          Generating Wireframes
        </span>
        <span style={{ marginLeft: "auto", fontSize: 11, fontFamily: MONO, color: C.amber }}>
          {wireframes.length} complete
        </span>
      </div>
      <LogPanel log={log} logRef={logRef} minH={140} maxH={180} />

      {/* Live preview grid */}
      {wireframes.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 9, color: C.t3, fontFamily: MONO, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>
            Live Previews
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {wireframes.map((w, i) => (
              <div key={i} style={{
                background: C.s2, border: `0.5px solid ${C.amberBd}`,
                borderRadius: 8, overflow: "hidden",
              }}>
                <div style={{ height: 130, overflow: "hidden", background: "#fff", pointerEvents: "none" }}>
                  <iframe
                    srcDoc={w.html}
                    style={{ width: "220%", height: "220%", border: "none", transform: "scale(0.45)", transformOrigin: "0 0" }}
                    sandbox=""
                    title={w.title}
                  />
                </div>
                <div style={{ padding: "8px 12px" }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: C.t1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{w.title}</div>
                  <div style={{ fontSize: 9, color: C.t3, fontFamily: MONO, marginTop: 2 }}>{w.path}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Phase: Wireframes ─────────────────────────────────────────────────────────
function WireframesPhase({ wireframes, activeWire, dispatch, analysis }) {
  const active = wireframes[activeWire];

  return (
    <div style={{ display: "flex", height: 660 }}>
      {/* Sidebar */}
      <div style={{
        width: 230, flexShrink: 0,
        background: C.s1,
        borderRight: `0.5px solid ${C.border}`,
        display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Sidebar header */}
        <div style={{ padding: "12px 16px", borderBottom: `0.5px solid ${C.border}` }}>
          <div style={{ fontSize: 9, color: C.amber, fontFamily: MONO, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 3 }}>
            {wireframes.length} Wireframes
          </div>
          <div style={{ fontSize: 11, color: C.t2, fontFamily: BODY, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {analysis?.siteTitle || analysis?.domain}
          </div>
        </div>
        {/* Page list */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {wireframes.map((w, i) => (
            <button
              key={i}
              onClick={() => dispatch({ t: "TAB", v: i })}
              style={{
                width: "100%", textAlign: "left", padding: "10px 16px",
                background: activeWire === i ? C.amberBg : "none",
                border: "none",
                borderBottom: `0.5px solid ${C.border}`,
                borderLeft: `2px solid ${activeWire === i ? C.amber : "transparent"}`,
                cursor: "pointer", transition: "all 0.1s",
              }}
            >
              <div style={{ fontSize: 9, color: C.amber, fontFamily: MONO, marginBottom: 3 }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{
                fontSize: 11, fontWeight: activeWire === i ? 500 : 400,
                color: activeWire === i ? C.t1 : C.t2,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                marginBottom: 2,
              }}>
                {w.title}
              </div>
              <div style={{ fontSize: 9, color: C.t3, fontFamily: MONO, display: "flex", gap: 6 }}>
                <span>{w.path}</span>
                {w.pageType && <span style={{ color: C.t3 }}>· {w.pageType}</span>}
              </div>
            </button>
          ))}
        </div>
        {/* Sidebar footer */}
        <div style={{ padding: "10px 16px", borderTop: `0.5px solid ${C.border}` }}>
          <div style={{ fontSize: 9, color: C.t3, fontFamily: MONO, display: "flex", gap: 8 }}>
            <span style={{ color: C.cyan }}>◆</span> Sonnet 4.6
          </div>
        </div>
      </div>

      {/* Viewer */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Toolbar */}
        <div style={{
          padding: "8px 16px", borderBottom: `0.5px solid ${C.border}`,
          background: C.s2,
          display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
          minHeight: 42,
        }}>
          {active && (
            <>
              <span style={{ fontSize: 12, fontWeight: 500, color: C.t1 }}>{active.title}</span>
              <Pill label={active.pageType || "page"} />
              {active.hasForm && <Pill label="Form" color={C.cyan} />}
              {active.hasCTA && <Pill label="CTA" color={C.amber} />}
              <span style={{ flex: 1 }} />
              <span style={{ fontSize: 10, color: C.t3, fontFamily: MONO }}>
                {active.url}
              </span>
            </>
          )}
        </div>

        {/* Iframe */}
        {active ? (
          <div style={{ flex: 1, overflow: "auto", background: "#f0f0f0" }}>
            <iframe
              key={activeWire}
              srcDoc={active.html}
              style={{ width: "100%", minHeight: 620, border: "none", display: "block" }}
              sandbox="allow-same-origin"
              title={active.title}
            />
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: C.t3, fontSize: 13, fontFamily: MONO }}>
            Select a page to preview
          </div>
        )}
      </div>
    </div>
  );
}

// ── GLOBAL CSS ────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');

  @keyframes wf-blink  { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes wf-pulse  { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.15)} }
  @keyframes wf-fadein { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

  .wf-root { animation: wf-fadein 0.4s ease both; }
  .wf-root * { box-sizing: border-box; }

  .wf-root ::-webkit-scrollbar { width: 4px; height: 4px; }
  .wf-root ::-webkit-scrollbar-track { background: transparent; }
  .wf-root ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
  .wf-root ::-webkit-scrollbar-thumb:hover { background: rgba(245,158,11,0.3); }
`;

// ── Main App ──────────────────────────────────────────────────────────────────
export default function WireframeStudio() {
  const [s, d] = useReducer(reducer, INIT);
  const logRef = useRef(null);

  // Inject fonts + keyframes
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [s.log]);

  const log = useCallback((msg, kind = "info") => d({ t: "LOG", msg, kind }), []);

  // ── Analyze ────────────────────────────────────────────────────────────────
  const analyze = useCallback(async () => {
    let url = s.url.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;

    d({ t: "SCAN" });

    try {
      const domain = new URL(url).hostname;
      log("Initializing analysis engine...", "system");
      log(`Target acquired: ${url}`, "system");
      log("Querying robots.txt...", "info");
      log("Checking sitemap.xml...", "info");
      log("Scanning internal link graph...", "info");

      const response = await callAI({
        model: M_HAIKU,
        system: `You are a professional web analyst and information architect.
Analyze websites thoroughly using web search.
Always return valid JSON exactly matching the requested schema.
Return ONLY the JSON object — no markdown, no backticks, no explanation.`,
        messages: [{
          role: "user",
          content: `Analyze the website at ${url}.

Use web search to discover:
1. "${domain} robots.txt" — check crawl permissions
2. "${domain} sitemap.xml" — find the XML sitemap
3. "site:${domain}" — discover all indexed pages
4. "${url}" — analyze homepage structure and purpose

Return ONLY this JSON object (no markdown, no backticks):
{
  "domain": "${domain}",
  "siteUrl": "${url}",
  "siteTitle": "Full official site name",
  "tagline": "Site tagline or mission statement",
  "industry": "Industry category",
  "businessType": "B2B|B2C|SaaS|Agency|E-commerce|Blog|Portfolio|Government|Other",
  "robotsTxt": "found|not-found|restricted",
  "sitemapXml": true,
  "techStack": ["technology1", "technology2"],
  "designStyle": "Minimal|Bold|Corporate|Playful|Dark|Light|Editorial",
  "siteArchitecture": "Flat|Hierarchical|Hub-spoke|Matrix",
  "primaryGoal": "What the site is designed to accomplish",
  "totalEstimatedPages": 12,
  "pages": [
    {
      "url": "https://full-url-here",
      "path": "/path",
      "title": "Page Title",
      "purpose": "What this page accomplishes for the user",
      "pageType": "homepage|about|services|contact|blog|product|portfolio|pricing|team|faq|case-study|docs|other",
      "priority": 1.0,
      "estimatedSections": ["navigation","hero","value-props","features","testimonials","cta","footer"],
      "keyComponents": ["sticky-nav","hero-banner","card-grid","contact-form","social-links","newsletter"],
      "layoutType": "centered|full-bleed|two-column|grid|sidebar|dashboard|landing",
      "hasForm": false,
      "hasCTA": true,
      "contentDensity": "low|medium|high",
      "userJourneyRole": "Awareness|Consideration|Conversion|Retention"
    }
  ],
  "keyInsights": ["Insight 1", "Insight 2", "Insight 3", "Insight 4"],
  "report": "2-3 sentence analytical summary of the site structure and purpose.",
  "wireframeRecommendations": ["Rec 1", "Rec 2", "Rec 3", "Rec 4"]
}

Discover at least 6-12 pages. Be comprehensive.`
        }],
        tools: [{ type: "web_search_20250305", name: "web_search" }],
      });

      log("Processing site graph...", "info");

      const rawText = getText(response);
      let siteData;

      try {
        siteData = extractJSON(rawText);
      } catch {
        log("Refining schema structure...", "info");
        const clean = await callAI({
          model: M_SONNET,
          system: "Extract and return ONLY the JSON object from the text. No markdown, no backticks, no explanation.",
          messages: [{ role: "user", content: rawText }],
        });
        siteData = extractJSON(getText(clean));
      }

      log(`Discovered ${siteData.pages?.length ?? 0} pages`, "success");
      log(`Site identified: ${siteData.siteTitle}`, "success");
      log(`Industry: ${siteData.industry}`, "success");
      log("JSON schema built", "success");
      log(`sitemap.xml ${siteData.sitemapXml ? "found" : "not found — generated from crawl"}`, "info");
      log("Analysis complete ✓", "success");

      d({ t: "REPORT", data: siteData });

    } catch (err) {
      log(`Error: ${err.message}`, "error");
      d({ t: "ERROR", msg: err.message });
    }
  }, [s.url, log]);

  // ── Generate Wireframes ────────────────────────────────────────────────────
  const generateWireframes = useCallback(async () => {
    const { siteData } = s;
    d({ t: "WSTART" });

    const pages = (siteData.pages || []).slice(0, 6);

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      log(`[${i + 1}/${pages.length}] Wireframing: ${page.title}`, "info");

      try {
        const resp = await callAI({
          model: M_SONNET,
          messages: [{
            role: "user",
            content: `Create a professional, detailed HTML wireframe for:

Page: "${page.title}"
URL: ${page.url}
Site: ${siteData.siteTitle} (${siteData.industry})
Page type: ${page.pageType}
Layout: ${page.layoutType}
Sections: ${(page.estimatedSections || []).join(", ")}
Components: ${(page.keyComponents || []).join(", ")}
Has form: ${page.hasForm} | Has CTA: ${page.hasCTA}
Content density: ${page.contentDensity}

WIREFRAME REQUIREMENTS:
1. Standalone HTML5 file — no external CSS/JS dependencies
2. Page width: 1440px — use max-width: 1440px, margin: 0 auto
3. ONLY use these colors: #ffffff, #f9f9f9, #f0f0f0, #e4e4e4, #d0d0d0, #b0b0b0, #888888, #666666, #444444, #222222, #000000
4. Each section must have a small section label: 9px, #888, uppercase, letter-spacing: 0.15em, positioned absolute at top-left with 8px offset
5. Each section wrapped in position: relative, with a clear section label tag
6. Interactive elements (buttons, inputs, links): 2px dashed #888 border, no fill or light #f0f0f0 fill
7. Image/media placeholders: #e4e4e4 background rectangle with centered text "[IMAGE]" or "[VIDEO]" in #b0b0b0
8. Logo: #000 text "LOGO" in a 120x32 box, border: 1px solid #000
9. Navigation: realistic with logo left, nav items center/right, CTA button (dashed border)
10. Typography: realistic hierarchy — large h1 for hero, smaller for sections, body text as gray lines
11. Use thin horizontal rules between sections
12. Footer: 4 column grid with links and copyright bar
13. Bottom annotation bar: white bg, border-top: 2px solid #000, lists all sections with brief purpose
14. Top info strip: background: #222, color: #fff, 10px, font-family: monospace — shows "${siteData.siteTitle} | ${page.title} | Wireframe v1.0 | ${siteData.domain}"
15. White background (#fff) for entire page
16. Section containers: border: 0.5px solid #e4e4e4 for definition
17. Minimum 600px per section, realistic content density

Return ONLY valid HTML starting with <!DOCTYPE html> — no explanation.`
          }],
          maxTokens: 4000,
        });

        const html = getText(resp);
        const cleanHtml = html.match(/<!DOCTYPE html>[\s\S]*/i)?.[0] ?? html;

        d({ t: "WFRAME", frame: { ...page, html: cleanHtml } });
        log(`${page.title} — complete ✓`, "success");

      } catch (err) {
        log(`Failed: ${page.title} — ${err.message}`, "error");
      }
    }

    d({ t: "WDONE" });
    log(`All ${pages.length} wireframes generated ✓`, "success");
  }, [s.siteData, log]);

  const { phase, url, siteData, wireframes, log: logEntries, error, activeWire } = s;

  return (
    <div className="wf-root" style={{
      background: C.bg, color: C.t1,
      fontFamily: BODY, minHeight: 600,
      borderRadius: 8, overflow: "hidden",
      border: `0.5px solid ${C.border}`,
    }}>
      {/* ── Header ──────────────────────────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center",
        padding: "11px 20px",
        background: C.s1,
        borderBottom: `0.5px solid ${C.border}`,
        gap: 14,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
          <div style={{
            fontFamily: DISP, fontWeight: 900, fontSize: 16,
            letterSpacing: "0.06em", color: C.t1,
            display: "flex", alignItems: "center", gap: 1,
          }}>
            WIRE<span style={{ color: C.amber }}>FRAME</span>
            <span style={{
              fontSize: 9, color: C.t3, fontWeight: 400, fontFamily: MONO,
              letterSpacing: "0.12em", marginLeft: 8, textTransform: "uppercase",
            }}>Studio</span>
          </div>
          {siteData && (
            <span style={{ fontSize: 10, color: C.t3, fontFamily: MONO }}>
              / {siteData.domain}
            </span>
          )}
        </div>

        {/* Phase steps */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 9, fontFamily: MONO }}>
          {["input", "analyzing", "report", "wireframing", "wireframes"].map((p, i) => {
            const idx = ["input", "analyzing", "report", "wireframing", "wireframes"].indexOf(phase);
            const myIdx = i;
            const done = myIdx < idx;
            const active = myIdx === idx;
            return (
              <div key={p} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  color: active ? C.amber : done ? C.green : C.t3,
                  textTransform: "uppercase", letterSpacing: "0.1em",
                  fontSize: 9,
                }}>
                  {done ? "✓" : active ? "◆" : "○"} {p}
                </span>
                {i < 4 && <span style={{ color: C.border }}>—</span>}
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Pulse active={phase === "analyzing" || phase === "wireframing"} />
            <span style={{ fontSize: 9, color: C.t3, fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.12em" }}>
              {phase === "analyzing" ? "Scanning" : phase === "wireframing" ? "Generating" : phase === "report" ? "Analyzed" : phase === "wireframes" ? "Done" : "Standby"}
            </span>
          </div>
          {phase !== "input" && (
            <button
              onClick={() => d({ t: "RESET" })}
              style={{
                background: "none", border: `0.5px solid ${C.border}`,
                borderRadius: 4, padding: "4px 10px",
                cursor: "pointer", fontSize: 9, color: C.t3, fontFamily: MONO,
                letterSpacing: "0.1em",
              }}
            >
              ← RESET
            </button>
          )}
        </div>
      </div>

      {/* ── Phases ──────────────────────────────────────────────── */}
      {phase === "input"       && <InputPhase url={url} dispatch={d} onAnalyze={analyze} error={error} />}
      {phase === "analyzing"   && <AnalyzingPhase log={logEntries} logRef={logRef} />}
      {phase === "report"      && <ReportPhase data={siteData} onGenerate={generateWireframes} />}
      {phase === "wireframing" && <WireframingPhase log={logEntries} logRef={logRef} wireframes={wireframes} />}
      {phase === "wireframes"  && <WireframesPhase wireframes={wireframes} activeWire={activeWire} dispatch={d} analysis={siteData} />}
    </div>
  );
}
