import { useState, useEffect, useRef, useCallback } from "react";

// ─── Fonts ────────────────────────────────────────────────────────────────────
const FONT_LINK = document.createElement("link");
FONT_LINK.rel = "stylesheet";
FONT_LINK.href = "https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap";
document.head.appendChild(FONT_LINK);

// ─── Constants ────────────────────────────────────────────────────────────────
const RETRYABLE_ERRORS = ["NETWORK_ERROR", "TIMEOUT", "5XX"];
const STATUS_COLORS = { 200: "#00ff9d", 301: "#ffd166", 302: "#ffd166", 404: "#ff6b6b", 500: "#ff6b6b", 0: "#888" };
const PARTICLE_COUNT = 22;

// ─── Styles ───────────────────────────────────────────────────────────────────
const css = `
  @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes fadeSlideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(0,255,157,.35)} 50%{box-shadow:0 0 0 8px rgba(0,255,157,0)} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes barFill { from{width:0%} to{width:var(--w)} }
  @keyframes rowIn { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
  @keyframes statCount { from{opacity:0;transform:scale(.8)} to{opacity:1;transform:scale(1)} }
  @keyframes glitch {
    0%{clip-path:inset(40% 0 61% 0)} 20%{clip-path:inset(92% 0 1% 0)} 40%{clip-path:inset(43% 0 1% 0)}
    60%{clip-path:inset(25% 0 58% 0)} 80%{clip-path:inset(54% 0 7% 0)} 100%{clip-path:inset(58% 0 43% 0)}
  }
  @keyframes particleFloat {
    0%{transform:translate(0,0) scale(1);opacity:.7}
    100%{transform:translate(var(--dx),var(--dy)) scale(0);opacity:0}
  }
  .row-enter { animation: rowIn .3s ease forwards; }
  .stat-enter { animation: statCount .4s cubic-bezier(.34,1.56,.64,1) forwards; }
`;
const styleEl = document.createElement("style");
styleEl.textContent = css;
document.head.appendChild(styleEl);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const fmtMs = (ms) => ms < 1000 ? `${ms}ms` : `${(ms/1000).toFixed(2)}s`;
const fmtUrl = (url, max = 55) => url.length > max ? url.slice(0, max) + "…" : url;
const statusColor = (code) => STATUS_COLORS[code] ?? (code >= 200 && code < 300 ? "#00ff9d" : code >= 300 && code < 400 ? "#ffd166" : "#ff6b6b");

async function simulateCrawl(startUrl, config, onProgress, signal) {
  const { maxConcurrent, timeout, retries } = config;
  const parsed = (() => { try { return new URL(startUrl); } catch { return null; } })();
  if (!parsed) throw new Error("Invalid URL");
  const domain = parsed.hostname;
  const base = parsed.origin;

  // Call Anthropic API to generate realistic links
  const prompt = `You are simulating a web crawler. Given the homepage URL "${startUrl}", generate a realistic list of 18-30 internal links that would plausibly exist on this website's homepage, based on what the domain/company likely does.

Return ONLY a valid JSON array of objects, no markdown, no explanation:
[{"url":"<full absolute url>","status":<http_status_int>,"responseTimeMs":<int 50-800>,"contentType":"text/html","linksFound":<int 0-40>,"method":"httpx"}]

Rules:
- All URLs must start with ${base} and be on the ${domain} domain
- Include realistic paths like /about, /products, /services, /blog, /contact, /pricing, /docs, /careers, /team etc. but themed to the actual site
- Vary status codes: mostly 200, a couple 301, maybe one 404
- Response times vary 80-600ms, shorter for cached/simple pages
- linksFound: homepage has most links (15-40), inner pages 3-15
- method: mostly "httpx", 1-2 "playwright" for JS-heavy pages
- Make it look like a REAL site for this domain`;

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    })
  });
  if (!resp.ok) throw new Error(`API error ${resp.status}`);
  const data = await resp.json();
  let rawText = data.content?.find(b => b.type === "text")?.text ?? "[]";
  rawText = rawText.replace(/```json|```/g, "").trim();
  let links;
  try { links = JSON.parse(rawText); } catch { links = []; }

  // Simulate homepage crawl first
  onProgress({ phase: "homepage", url: startUrl, done: 0, total: links.length + 1 });
  await sleep(400 + Math.random() * 300);
  const homepageResult = {
    url: startUrl, status: 200, responseTimeMs: 180 + Math.floor(Math.random() * 200),
    contentType: "text/html", linksFound: links.length, method: "httpx", error: null,
    timestamp: new Date().toISOString()
  };
  onProgress({ phase: "depth1", result: homepageResult, done: 1, total: links.length + 1 });

  // Simulate depth-1 crawl with concurrency
  const batches = [];
  for (let i = 0; i < links.length; i += maxConcurrent) {
    batches.push(links.slice(i, i + maxConcurrent));
  }

  let done = 1;
  for (const batch of batches) {
    if (signal?.aborted) break;
    await Promise.all(batch.map(async (link, i) => {
      await sleep(50 + i * 30 + Math.random() * 200);
      if (signal?.aborted) return;
      const result = {
        url: link.url, status: link.status ?? 200,
        responseTimeMs: link.responseTimeMs ?? 200,
        contentType: link.contentType ?? "text/html",
        linksFound: link.linksFound ?? 0,
        method: link.method ?? "httpx",
        error: link.status >= 400 ? `HTTP ${link.status}` : null,
        timestamp: new Date().toISOString()
      };
      done++;
      onProgress({ phase: "depth1", result, done, total: links.length + 1 });
    }));
  }

  return { domain, totalLinks: links.length + 1, results: [homepageResult, ...links.map(l => ({
    url: l.url, status: l.status ?? 200, responseTimeMs: l.responseTimeMs ?? 200,
    contentType: l.contentType ?? "text/html", linksFound: l.linksFound ?? 0,
    method: l.method ?? "httpx", error: l.status >= 400 ? `HTTP ${l.status}` : null,
    timestamp: new Date().toISOString()
  }))]};
}

// ─── Components ───────────────────────────────────────────────────────────────

function Particle({ x, y, active }) {
  const particles = useRef([]);
  if (particles.current.length === 0) {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      const dist = 40 + Math.random() * 80;
      particles.current.push({
        dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist,
        size: 2 + Math.random() * 3, delay: Math.random() * 0.4
      });
    }
  }
  if (!active) return null;
  return (
    <div style={{ position: "fixed", left: x, top: y, pointerEvents: "none", zIndex: 9999 }}>
      {particles.current.map((p, i) => (
        <div key={i} style={{
          position: "absolute", width: p.size, height: p.size,
          borderRadius: "50%", background: "#00ff9d",
          "--dx": `${p.dx}px`, "--dy": `${p.dy}px`,
          animation: `particleFloat .8s ${p.delay}s ease-out forwards`,
          transform: "translate(-50%,-50%)"
        }} />
      ))}
    </div>
  );
}

function Scanline() {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, height: "2px",
      background: "linear-gradient(transparent, rgba(0,255,157,.06), transparent)",
      animation: "scanline 8s linear infinite", pointerEvents: "none", zIndex: 10
    }} />
  );
}

function ConfigPanel({ config, setConfig, disabled }) {
  const fields = [
    { key: "maxConcurrent", label: "CONCURRENCY", min: 1, max: 200, unit: "threads" },
    { key: "timeout", label: "TIMEOUT", min: 1, max: 60, unit: "sec" },
    { key: "retries", label: "MAX RETRIES", min: 0, max: 10, unit: "attempts" },
  ];
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {fields.map(f => (
        <div key={f.key} style={{ flex: "1 1 120px" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#555", letterSpacing: "0.15em", marginBottom: 6 }}>{f.label}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#0d0e12", border: "1px solid #1e2028", borderRadius: 6, padding: "6px 10px" }}>
            <input
              type="number" min={f.min} max={f.max} value={config[f.key]}
              disabled={disabled}
              onChange={e => setConfig(c => ({ ...c, [f.key]: +e.target.value }))}
              style={{
                background: "transparent", border: "none", outline: "none", color: "#00ff9d",
                fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700,
                width: 50, MozAppearance: "textfield"
              }}
            />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#444" }}>{f.unit}</span>
          </div>
        </div>
      ))}
      <div style={{ flex: "1 1 140px" }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#555", letterSpacing: "0.15em", marginBottom: 6 }}>PLAYWRIGHT FALLBACK</div>
        <button
          onClick={() => !disabled && setConfig(c => ({ ...c, playwright: !c.playwright }))}
          style={{
            background: config.playwright ? "rgba(0,255,157,.12)" : "#0d0e12",
            border: `1px solid ${config.playwright ? "#00ff9d44" : "#1e2028"}`,
            borderRadius: 6, padding: "7px 14px", cursor: disabled ? "default" : "pointer",
            color: config.playwright ? "#00ff9d" : "#444",
            fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700,
            display: "flex", alignItems: "center", gap: 8, transition: "all .2s"
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: config.playwright ? "#00ff9d" : "#333", animation: config.playwright ? "pulse 2s infinite" : "none" }} />
          {config.playwright ? "ENABLED" : "DISABLED"}
        </button>
      </div>
    </div>
  );
}

function ProgressBar({ done, total, phase }) {
  const pct = total > 0 ? (done / total) * 100 : 0;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#555", letterSpacing: "0.1em" }}>
          {phase === "homepage" ? "FETCHING HOMEPAGE" : `CRAWLING DEPTH-1 — ${done}/${total}`}
        </span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#00ff9d" }}>
          {pct.toFixed(0)}%
        </span>
      </div>
      <div style={{ height: 3, background: "#111", borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 2, transition: "width .3s ease",
          width: `${pct}%`,
          background: "linear-gradient(90deg, #00ff9d, #00d4ff)",
          boxShadow: "0 0 12px rgba(0,255,157,.6)"
        }} />
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: "#0d0e12", border: `1px solid ${accent}22`,
      borderRadius: 10, padding: "14px 18px", flex: "1 1 100px",
      animation: "fadeSlideUp .4s ease forwards"
    }}>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#555", letterSpacing: "0.15em", marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 24, fontWeight: 700, color: accent, lineHeight: 1 }} className="stat-enter">{value}</div>
      {sub && <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#444", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function ResultRow({ result, index }) {
  const [expanded, setExpanded] = useState(false);
  const sc = statusColor(result.status);
  const delay = Math.min(index * 0.04, 1.5);
  return (
    <div
      className="row-enter"
      style={{ animationDelay: `${delay}s`, opacity: 0 }}
    >
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          display: "grid", gridTemplateColumns: "56px 1fr 72px 80px 72px 64px",
          gap: 12, alignItems: "center", padding: "10px 16px",
          borderBottom: "1px solid #111", cursor: "pointer",
          transition: "background .15s",
          background: expanded ? "#0d0e14" : "transparent",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "#0d0e14"}
        onMouseLeave={e => { if (!expanded) e.currentTarget.style.background = "transparent"; }}
      >
        <span style={{
          fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700,
          color: sc, background: `${sc}18`, padding: "2px 6px", borderRadius: 4, textAlign: "center"
        }}>{result.status || "ERR"}</span>
        <span style={{
          fontFamily: "'Space Mono', monospace", fontSize: 11, color: result.error ? "#ff6b6b88" : "#8899aa",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
        }}>{fmtUrl(result.url)}</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#556", textAlign: "right" }}>{fmtMs(result.responseTimeMs)}</span>
        <span style={{
          fontFamily: "'Space Mono', monospace", fontSize: 10,
          color: result.linksFound > 0 ? "#00d4ff88" : "#333", textAlign: "right"
        }}>{result.linksFound} links</span>
        <span style={{
          fontFamily: "'Space Mono', monospace", fontSize: 9,
          color: result.method === "playwright" ? "#ffd16688" : "#33ff9966",
          background: result.method === "playwright" ? "#ffd16611" : "#00ff9d11",
          padding: "2px 6px", borderRadius: 4, textAlign: "center"
        }}>{result.method === "playwright" ? "PW" : "HTTP"}</span>
        <span style={{ color: "#333", textAlign: "right", fontSize: 10 }}>{expanded ? "▲" : "▼"}</span>
      </div>
      {expanded && (
        <div style={{
          padding: "12px 16px 14px 72px", background: "#0a0b0d",
          borderBottom: "1px solid #111", animation: "fadeSlideUp .2s ease forwards"
        }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#00ff9d88", wordBreak: "break-all", marginBottom: 6 }}>{result.url}</div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[
              ["Content-Type", result.contentType],
              ["Response Time", fmtMs(result.responseTimeMs)],
              ["Links Found", result.linksFound],
              ["Method", result.method],
              ["Timestamp", new Date(result.timestamp).toLocaleTimeString()],
              result.error && ["Error", result.error],
            ].filter(Boolean).map(([k, v]) => (
              <div key={k}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#444", letterSpacing: "0.12em", marginBottom: 3 }}>{k.toUpperCase()}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: k === "Error" ? "#ff6b6b" : "#778899" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MethodBadge({ results }) {
  const httpx = results.filter(r => r.method === "httpx").length;
  const pw = results.filter(r => r.method === "playwright").length;
  const total = results.length || 1;
  return (
    <div style={{ display: "flex", gap: 3, height: 6, borderRadius: 3, overflow: "hidden", width: 120 }}>
      <div style={{ width: `${(httpx/total)*100}%`, background: "#00ff9d", transition: "width .5s" }} />
      <div style={{ width: `${(pw/total)*100}%`, background: "#ffd166", transition: "width .5s" }} />
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function CrawlerUI() {
  const [url, setUrl] = useState("https://");
  const [config, setConfig] = useState({ maxConcurrent: 50, timeout: 10, retries: 3, playwright: true });
  const [status, setStatus] = useState("idle"); // idle | crawling | done | error
  const [results, setResults] = useState([]);
  const [progress, setProgress] = useState({ done: 0, total: 0, phase: "homepage" });
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all | ok | error | playwright
  const [particle, setParticle] = useState({ x: 0, y: 0, active: false });
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const abortRef = useRef(null);
  const resultsRef = useRef(null);
  const timerRef = useRef(null);

  // Elapsed timer
  useEffect(() => {
    if (status === "crawling") {
      timerRef.current = setInterval(() => setElapsed(Date.now() - startTime), 100);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [status, startTime]);

  const handleStart = useCallback(async (e) => {
    if (status === "crawling") {
      abortRef.current?.abort();
      setStatus("idle");
      return;
    }
    // Particle burst at button
    const btn = e.currentTarget.getBoundingClientRect();
    setParticle({ x: btn.left + btn.width / 2, y: btn.top + btn.height / 2, active: true });
    setTimeout(() => setParticle(p => ({ ...p, active: false })), 1000);

    setResults([]);
    setError(null);
    setProgress({ done: 0, total: 0, phase: "homepage" });
    setStatus("crawling");
    setStartTime(Date.now());
    setElapsed(0);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const final = await simulateCrawl(url, config, (prog) => {
        setProgress({ done: prog.done, total: prog.total, phase: prog.phase });
        if (prog.result) {
          setResults(prev => [...prev, prog.result]);
          // Auto-scroll
          setTimeout(() => {
            if (resultsRef.current) {
              resultsRef.current.scrollTop = resultsRef.current.scrollHeight;
            }
          }, 50);
        }
      }, controller.signal);
      setStatus("done");
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message);
        setStatus("error");
      } else {
        setStatus("idle");
      }
    }
  }, [url, config, status]);

  const handleExport = useCallback(() => {
    const data = {
      meta: { crawledAt: new Date().toISOString(), startUrl: url, config, totalUrls: results.length },
      results
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `crawl-${new URL(url).hostname}-${Date.now()}.json`;
    a.click();
  }, [url, config, results]);

  const filtered = results.filter(r => {
    if (filter === "ok") return !r.error && r.status < 400;
    if (filter === "error") return r.error || r.status >= 400;
    if (filter === "playwright") return r.method === "playwright";
    return true;
  });

  const stats = {
    total: results.length,
    ok: results.filter(r => r.status >= 200 && r.status < 400).length,
    errors: results.filter(r => r.error || r.status >= 400).length,
    avgMs: results.length ? Math.round(results.reduce((s, r) => s + r.responseTimeMs, 0) / results.length) : 0,
    totalLinks: results.reduce((s, r) => s + r.linksFound, 0),
    pw: results.filter(r => r.method === "playwright").length
  };

  const isCrawling = status === "crawling";
  const isDone = status === "done";

  return (
    <div style={{
      minHeight: "100vh", background: "#080910",
      fontFamily: "'DM Sans', sans-serif",
      color: "#ccd6f6",
      padding: "0 0 80px 0"
    }}>
      <Scanline />
      <Particle x={particle.x} y={particle.y} active={particle.active} />

      {/* Grid bg */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "linear-gradient(rgba(0,255,157,.015) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,157,.015) 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }} />

      {/* Header */}
      <div style={{
        position: "relative", zIndex: 1,
        borderBottom: "1px solid #141518",
        padding: "20px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: "linear-gradient(135deg, #00ff9d22, #00d4ff22)",
            border: "1px solid #00ff9d33",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px rgba(0,255,157,.15)"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#00ff9d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, color: "#e8eaf6", letterSpacing: "0.05em" }}>CRAWLR</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#445", letterSpacing: "0.18em" }}>DEPTH-1 DOMAIN INTELLIGENCE</div>
          </div>
        </div>
        <div style={{ display: "flex", align: "center", gap: 20 }}>
          {isCrawling && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff9d", animation: "pulse 1s infinite" }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#00ff9d" }}>
                ACTIVE — {fmtMs(elapsed)}
              </span>
            </div>
          )}
          {isDone && results.length > 0 && (
            <button onClick={handleExport} style={{
              background: "transparent", border: "1px solid #1e2028", borderRadius: 6,
              color: "#667", fontFamily: "'Space Mono', monospace", fontSize: 10,
              padding: "6px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
              transition: "all .2s"
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#00ff9d44"; e.currentTarget.style.color = "#00ff9d"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e2028"; e.currentTarget.style.color = "#667"; }}
            >
              ↓ EXPORT JSON
            </button>
          )}
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "32px 24px 0" }}>

        {/* URL Input */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#445", letterSpacing: "0.18em", marginBottom: 8 }}>TARGET URL</div>
          <div style={{ display: "flex", gap: 0, background: "#0d0e12", border: `1px solid ${isCrawling ? "#00ff9d44" : "#1a1b1f"}`, borderRadius: 10, overflow: "hidden", transition: "border-color .3s", boxShadow: isCrawling ? "0 0 30px rgba(0,255,157,.08)" : "none" }}>
            <div style={{ padding: "0 16px", display: "flex", alignItems: "center", borderRight: "1px solid #1a1b1f" }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#334", userSelect: "none" }}>GET</span>
            </div>
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !isCrawling && handleStart(e)}
              disabled={isCrawling}
              placeholder="https://example.com"
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                color: "#9aaccc", fontFamily: "'Space Mono', monospace", fontSize: 13,
                padding: "16px 20px"
              }}
            />
            <button
              onClick={handleStart}
              style={{
                padding: "0 28px",
                background: isCrawling
                  ? "rgba(255,107,107,.12)"
                  : "linear-gradient(135deg, rgba(0,255,157,.15), rgba(0,212,255,.1))",
                border: "none", borderLeft: "1px solid #1a1b1f",
                color: isCrawling ? "#ff6b6b" : "#00ff9d",
                fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700,
                cursor: "pointer", letterSpacing: "0.12em",
                display: "flex", alignItems: "center", gap: 10,
                transition: "all .2s"
              }}
            >
              {isCrawling ? (
                <>
                  <div style={{ width: 12, height: 12, border: "2px solid #ff6b6b44", borderTopColor: "#ff6b6b", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
                  ABORT
                </>
              ) : "▶ CRAWL"}
            </button>
          </div>
        </div>

        {/* Config */}
        <div style={{ background: "#0d0e12", border: "1px solid #141518", borderRadius: 10, padding: "18px 20px", marginBottom: 20 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#334", letterSpacing: "0.18em", marginBottom: 14 }}>CONFIGURATION</div>
          <ConfigPanel config={config} setConfig={setConfig} disabled={isCrawling} />
        </div>

        {/* Progress */}
        {(isCrawling || isDone) && progress.total > 0 && (
          <div style={{ background: "#0d0e12", border: "1px solid #141518", borderRadius: 10, padding: "18px 20px", marginBottom: 20, animation: "fadeSlideUp .4s ease" }}>
            <ProgressBar done={progress.done} total={progress.total} phase={progress.phase} />
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: "#ff6b6b0d", border: "1px solid #ff6b6b22", borderRadius: 10, padding: "16px 20px", marginBottom: 20, fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#ff6b6b", animation: "fadeSlideUp .3s ease" }}>
            ✗ {error}
          </div>
        )}

        {/* Stats */}
        {results.length > 0 && (
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <StatCard label="URLS CRAWLED" value={stats.total} sub="depth-0 + depth-1" accent="#00ff9d" />
            <StatCard label="SUCCESSFUL" value={stats.ok} sub={`${((stats.ok/stats.total)*100).toFixed(0)}% success rate`} accent="#00d4ff" />
            <StatCard label="ERRORS" value={stats.errors} sub="4xx / 5xx / network" accent="#ff6b6b" />
            <StatCard label="AVG LATENCY" value={fmtMs(stats.avgMs)} sub="mean response time" accent="#ffd166" />
            <StatCard label="LINKS FOUND" value={stats.totalLinks} sub="unique internal hrefs" accent="#b8a4ff" />
          </div>
        )}

        {/* Method breakdown */}
        {results.length > 0 && stats.pw > 0 && (
          <div style={{ background: "#0d0e12", border: "1px solid #141518", borderRadius: 10, padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 20 }}>
            <div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#334", letterSpacing: "0.15em", marginBottom: 8 }}>REQUEST METHOD BREAKDOWN</div>
              <MethodBadge results={results} />
            </div>
            <div style={{ display: "flex", gap: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: "#00ff9d" }} />
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#556" }}>HTTPX ({results.filter(r => r.method === "httpx").length})</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: "#ffd166" }} />
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#556" }}>PLAYWRIGHT ({stats.pw})</span>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div style={{ background: "#0d0e12", border: "1px solid #141518", borderRadius: 10, overflow: "hidden", animation: "fadeSlideUp .4s ease" }}>
            {/* Table header */}
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #141518", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 2 }}>
                {[
                  { id: "all", label: `ALL (${results.length})` },
                  { id: "ok", label: `OK (${stats.ok})` },
                  { id: "error", label: `ERR (${stats.errors})` },
                  { id: "playwright", label: `PW (${stats.pw})` },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setFilter(tab.id)} style={{
                    background: filter === tab.id ? "rgba(0,255,157,.1)" : "transparent",
                    border: filter === tab.id ? "1px solid #00ff9d33" : "1px solid transparent",
                    borderRadius: 5, padding: "4px 10px", cursor: "pointer",
                    color: filter === tab.id ? "#00ff9d" : "#445",
                    fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.1em",
                    transition: "all .15s"
                  }}>{tab.label}</button>
                ))}
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#334" }}>
                {filtered.length} RECORDS
              </div>
            </div>

            {/* Column headers */}
            <div style={{
              display: "grid", gridTemplateColumns: "56px 1fr 72px 80px 72px 64px",
              gap: 12, padding: "8px 16px", borderBottom: "1px solid #0e0f13"
            }}>
              {["STATUS", "URL", "TIME", "LINKS", "ENGINE", ""].map(h => (
                <div key={h} style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#334", letterSpacing: "0.15em" }}>{h}</div>
              ))}
            </div>

            {/* Rows */}
            <div ref={resultsRef} style={{ maxHeight: 480, overflowY: "auto" }}>
              {filtered.map((r, i) => <ResultRow key={r.url + i} result={r} index={i} />)}
              {filtered.length === 0 && (
                <div style={{ padding: "40px 16px", textAlign: "center", fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#334" }}>
                  NO RESULTS MATCH FILTER
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: "10px 16px", borderTop: "1px solid #0e0f13", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#334" }}>
                CRAWL COMPLETE — {fmtMs(elapsed)} ELAPSED
              </span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#334" }}>
                CONCURRENCY: {config.maxConcurrent} · RETRIES: {config.retries} · TIMEOUT: {config.timeout}s
              </span>
            </div>
          </div>
        )}

        {/* Idle state */}
        {status === "idle" && results.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", animation: "fadeSlideUp .6s ease" }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#223", letterSpacing: "0.2em", marginBottom: 12 }}>
              ▸ ENTER A URL AND PRESS CRAWL TO BEGIN
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#334", maxWidth: 420, margin: "0 auto", lineHeight: 1.6 }}>
              Performs async depth-1 domain crawling with HTTP/2, intelligent retries, Playwright fallback for JS-heavy pages, and structured output.
            </div>
            <div style={{ marginTop: 32, display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
              {[
                ["HTTPX + HTTP/2", "Primary transport"],
                ["lxml Parsing", "10× faster than BS4"],
                ["Tenacity Retries", "Exponential backoff"],
                ["Bulkhead Pattern", "Concurrency control"],
              ].map(([title, sub]) => (
                <div key={title} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#00ff9d44", marginBottom: 4 }}>{title}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#334" }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
