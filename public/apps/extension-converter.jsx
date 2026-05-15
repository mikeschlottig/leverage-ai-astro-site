import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────
//  CHROME EXTENSION CONVERTER
//  Architecture: Claude generates manifest + metadata only.
//  The JSX→HTML transformation is handled programmatically
//  (deterministic, no token cost, no hallucination risk).
// ─────────────────────────────────────────────────────────

// ── JSZip loader ─────────────────────────────────────────
function useJSZip() {
  const [ready, setReady] = useState(!!window.JSZip);
  useEffect(() => {
    if (window.JSZip) return;
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    s.onload = () => setReady(true);
    document.head.appendChild(s);
  }, []);
  return ready;
}

// ── Code Transformer ─────────────────────────────────────
// Converts a React artifact's JSX into extension-ready code.
// Handles: import stripping, hook extraction, export removal.
function transformReactCode(raw) {
  let code = raw;
  const hooks = new Set();

  // Capture React hook imports
  code = code.replace(
    /import\s+\{([^}]+)\}\s+from\s+["']react["'];?\n?/g,
    (_, imports) => {
      imports.split(",").map(s => s.trim()).filter(Boolean).forEach(h => hooks.add(h));
      return "";
    }
  );

  // Remove any remaining ES module imports
  code = code.replace(/^import\s+.*?from\s+["'][^"']+["'];?\s*\n?/gm, "");

  // Remove export default (function/class/arrow)
  code = code.replace(/^export\s+default\s+/m, "");

  // Remove named exports
  code = code.replace(/^export\s+(function|const|class|let|var)\s+/gm, "$1 ");

  // Inject React destructure at top
  const hookList = [...hooks].join(", ");
  const preamble = hookList
    ? `const { ${hookList} } = React;\n\n`
    : "";

  return (preamble + code.trim()).trimStart();
}

// ── HTML Template Builder ─────────────────────────────────
function buildPopupHTML({ transformedCode, meta }) {
  const w = meta.popup_width || 960;
  const h = meta.popup_height || 640;

  // CDN scripts
  const cdnScripts = [
    "https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.5/babel.min.js",
  ]
    .map(s => `  <script src="${s}"></script>`)
    .join("\n");

  // Mount call — find the exported root component name
  const mountMatch = transformedCode.match(
    /^(?:function|class|const)\s+([A-Z][A-Za-z0-9_]*)/m
  );
  const rootComponent = mountMatch?.[1] || "App";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${meta.name}</title>
  <style>
    html, body { margin: 0; padding: 0; width: ${w}px; height: ${h}px; overflow: hidden; }
  </style>
${cdnScripts}
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-presets="react">
${transformedCode}

// ── Mount ─────────────────────────────────────────────────
ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(${rootComponent})
);
  </script>
</body>
</html>`;
}

// ── Manifest Builder ──────────────────────────────────────
function buildManifest(meta) {
  const manifest = {
    manifest_version: 3,
    name: meta.name || "My Extension",
    version: meta.version || "1.0",
    description: meta.description || "",
    action: {
      default_popup: "popup.html",
      default_title: meta.name || "My Extension",
    },
    permissions: meta.permissions || [],
    ...(meta.host_permissions?.length
      ? { host_permissions: meta.host_permissions }
      : {}),
  };

  // Build CSP
  const scriptSrc = ["'self'"];
  if (meta.needs_unsafe_eval) scriptSrc.push("'unsafe-eval'");
  scriptSrc.push("https://cdnjs.cloudflare.com");

  const connectSrc = ["'self'", "https://cdnjs.cloudflare.com"];
  if (meta.host_permissions?.length) connectSrc.push(...meta.host_permissions);
  if (meta.needs_google_fonts) {
    connectSrc.push("https://fonts.googleapis.com", "https://fonts.gstatic.com");
  }

  manifest.content_security_policy = {
    extension_pages: [
      `script-src ${scriptSrc.join(" ")}`,
      `connect-src ${connectSrc.join(" ")}`,
      `style-src 'self' 'unsafe-inline'${meta.needs_google_fonts ? " https://fonts.googleapis.com" : ""}`,
      meta.needs_google_fonts ? "font-src https://fonts.gstatic.com" : null,
      "object-src 'self'",
    ]
      .filter(Boolean)
      .join("; "),
  };

  return JSON.stringify(manifest, null, 2);
}

// ── Claude API ────────────────────────────────────────────
const SYSTEM = `You are a Chrome Extension architect. Analyze the provided app code and return ONLY a JSON object — no markdown, no explanation, just the raw JSON.

Required fields:
{
  "name": "Short display name (2-4 words)",
  "description": "One sentence description under 100 chars",
  "version": "1.0",
  "permissions": [],
  "host_permissions": [],
  "needs_unsafe_eval": false,
  "needs_google_fonts": false,
  "popup_width": 960,
  "popup_height": 640,
  "notes": "2-3 sentences explaining key decisions"
}

Rules:
- Add "storage" to permissions if IndexedDB, localStorage, or kvSet/dbPut patterns are detected
- Add "tabs" to permissions if chrome.tabs is used
- Add host domain to host_permissions for any external fetch/API calls (e.g. "https://api.anthropic.com/*")
- Set needs_unsafe_eval: true if new Function(), eval(), or Function() constructor is used
- Set needs_google_fonts: true if Google Fonts @import or fonts.googleapis.com is referenced
- popup_width/height: estimate a reasonable size for the UI (min 400, max 1200)
- Return ONLY valid JSON. Nothing else.`;

async function callClaude(code) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: `Analyze this app and return extension metadata JSON:\n\n${code.slice(0, 6000)}`,
        },
      ],
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  const text = data.content?.[0]?.text || "";
  // Strip markdown fences if Claude adds them despite instructions
  const clean = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
  return JSON.parse(clean);
}

// ── ZIP Builder ───────────────────────────────────────────
async function buildZip(files, folderName) {
  const zip = new window.JSZip();
  const folder = zip.folder(folderName);
  files.forEach(({ name, content }) => folder.file(name, content));
  const blob = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${folderName}.zip`;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ── Styles ────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Syne:wght@400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #0b0c0a;
  --s1: #111210;
  --s2: #181917;
  --s3: #201f1d;
  --s4: #2a2927;
  --brd: rgba(255,255,255,.055);
  --brd2: rgba(255,255,255,.1);
  --brd3: rgba(255,255,255,.18);
  --txt: #e8e5db;
  --m1: #9e9a8d;
  --m2: #63615a;
  --m3: #363531;
  --acc: #d4a843;
  --acc2: #b8922d;
  --acc-dim: rgba(212,168,67,.1);
  --green: #4db87a;
  --red: #d46b6b;
  --blue: #6b9cd4;
  --mono: 'JetBrains Mono', monospace;
  --sans: 'Syne', sans-serif;
  --r: 6px;
  --r2: 10px;
  --r3: 16px;
}

html, body { height: 100%; background: var(--bg); color: var(--txt); font-family: var(--sans); font-size: 14px; line-height: 1.5; overflow: hidden; }

::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--m3); border-radius: 2px; }

.app {
  display: grid;
  grid-template-rows: 56px 1fr;
  height: 100vh;
  overflow: hidden;
}

/* ── Header ── */
.hdr {
  border-bottom: 1px solid var(--brd);
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 14px;
  background: var(--s1);
  flex-shrink: 0;
}
.hdr-mark {
  width: 32px; height: 32px;
  background: var(--acc);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; font-weight: 700; color: #0b0c0a;
  font-family: var(--mono);
  flex-shrink: 0;
}
.hdr-title { font-size: 15px; font-weight: 700; color: var(--txt); letter-spacing: -.01em; }
.hdr-sub { font-family: var(--mono); font-size: 10px; color: var(--m2); text-transform: uppercase; letter-spacing: .1em; }
.hdr-pill {
  margin-left: auto;
  font-family: var(--mono); font-size: 10px;
  padding: 4px 10px; border-radius: 20px;
  background: var(--s3); color: var(--m2);
  border: 1px solid var(--brd);
}

/* ── Layout ── */
.body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
}

/* ── Panel ── */
.panel { display: flex; flex-direction: column; overflow: hidden; }
.panel + .panel { border-left: 1px solid var(--brd); }
.panel-hdr {
  padding: 10px 16px;
  border-bottom: 1px solid var(--brd);
  display: flex; align-items: center; gap: 8px;
  flex-shrink: 0;
  background: var(--s1);
}
.panel-label {
  font-family: var(--mono); font-size: 10px;
  text-transform: uppercase; letter-spacing: .09em;
  color: var(--m2); font-weight: 500;
}
.panel-actions { margin-left: auto; display: flex; gap: 6px; }

/* ── Drop Zone ── */
.drop-zone {
  flex: 1; display: flex; flex-direction: column; position: relative;
  transition: background .15s;
}
.drop-zone.dragging { background: rgba(212,168,67,.04); }
.code-input {
  flex: 1; width: 100%; background: transparent;
  border: none; outline: none;
  color: var(--txt); font-family: var(--mono);
  font-size: 11.5px; line-height: 1.75; resize: none;
  padding: 16px; tab-size: 2;
}
.code-input::placeholder { color: var(--m3); }
.drop-overlay {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 8px; pointer-events: none;
  opacity: 0; transition: opacity .15s;
}
.drop-zone.dragging .drop-overlay { opacity: 1; }
.drop-overlay-icon { font-size: 36px; opacity: .5; }
.drop-overlay-text {
  font-family: var(--mono); font-size: 12px; color: var(--acc);
}

/* ── Empty State ── */
.empty {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 10px; padding: 32px; text-align: center;
}
.empty-glyph { font-size: 40px; opacity: .15; margin-bottom: 4px; }
.empty-title { font-size: 14px; font-weight: 600; color: var(--m1); }
.empty-desc { font-family: var(--mono); font-size: 11px; color: var(--m2); line-height: 1.65; }

/* ── Status ── */
.status-bar {
  padding: 10px 16px;
  border-top: 1px solid var(--brd);
  display: flex; align-items: center; gap: 8px;
  font-family: var(--mono); font-size: 11px;
  flex-shrink: 0; background: var(--s1);
}
.dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.dot-idle { background: var(--m3); }
.dot-working { background: var(--acc); animation: pulse 1s infinite; }
.dot-done { background: var(--green); }
.dot-err { background: var(--red); }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .3; } }

/* ── Output Panel ── */
.file-tree {
  width: 180px; border-right: 1px solid var(--brd);
  display: flex; flex-direction: column; flex-shrink: 0;
  background: var(--s1); overflow-y: auto;
}
.file-tree-hdr {
  padding: 8px 12px;
  font-family: var(--mono); font-size: 9px;
  text-transform: uppercase; letter-spacing: .1em;
  color: var(--m3); border-bottom: 1px solid var(--brd);
}
.file-item {
  display: flex; align-items: center; gap: 7px;
  padding: 7px 12px; cursor: pointer;
  font-family: var(--mono); font-size: 11px;
  color: var(--m1); transition: all .1s;
  border-left: 2px solid transparent;
}
.file-item:hover { background: var(--s2); color: var(--txt); }
.file-item.active {
  background: var(--acc-dim); color: var(--acc);
  border-left-color: var(--acc);
}
.file-icon { font-size: 12px; opacity: .7; flex-shrink: 0; }
.file-name { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.file-size { font-size: 9px; color: var(--m3); }

.code-preview-wrap { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.output-body { flex: 1; display: flex; overflow: hidden; }
.code-preview {
  flex: 1; padding: 16px; overflow: auto;
  font-family: var(--mono); font-size: 11px; line-height: 1.75;
  color: #cdc9be; white-space: pre; background: #090a08;
}

/* ── Notes Banner ── */
.notes-banner {
  margin: 12px 16px; padding: 10px 14px;
  background: var(--s3); border: 1px solid var(--brd2);
  border-left: 3px solid var(--acc);
  border-radius: var(--r); font-family: var(--mono);
  font-size: 11px; color: var(--m1); line-height: 1.65;
}

/* ── Buttons ── */
.btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 12px; border-radius: var(--r);
  border: 1px solid var(--brd2); background: var(--s2);
  color: var(--m1); cursor: pointer;
  font-family: var(--mono); font-size: 11px; font-weight: 500;
  transition: all .1s; white-space: nowrap; line-height: 1;
}
.btn:hover { background: var(--s3); color: var(--txt); border-color: var(--brd3); }
.btn:disabled { opacity: .35; cursor: default; pointer-events: none; }
.btn-primary {
  background: var(--acc); border-color: var(--acc);
  color: #0b0c0a; font-weight: 700;
}
.btn-primary:hover { background: var(--acc2); border-color: var(--acc2); color: #0b0c0a; }
.btn-ghost { background: transparent; border-color: transparent; color: var(--m2); }
.btn-ghost:hover { background: var(--s2); color: var(--m1); border-color: transparent; }
.btn-green { background: rgba(77,184,122,.12); border-color: rgba(77,184,122,.3); color: var(--green); }
.btn-green:hover { background: rgba(77,184,122,.2); color: var(--green); }

/* ── Instructions ── */
.instructions {
  padding: 16px; font-family: var(--mono); font-size: 11px;
  color: var(--m1); line-height: 1.8; border-top: 1px solid var(--brd);
  flex-shrink: 0; background: var(--s1);
  max-height: 180px; overflow-y: auto;
}
.step {
  display: flex; gap: 10px; margin-bottom: 6px;
}
.step-num {
  width: 18px; height: 18px; border-radius: 50%;
  background: var(--s4); color: var(--m1);
  display: flex; align-items: center; justify-content: center;
  font-size: 9px; flex-shrink: 0; margin-top: 1px;
}
.step-num.done { background: rgba(77,184,122,.2); color: var(--green); }
code { background: var(--s3); padding: 1px 5px; border-radius: 3px; font-size: 10px; }
`;

function injectCSS() {
  if (document.getElementById("ec-css")) return;
  const s = document.createElement("style");
  s.id = "ec-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

// ─────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────────
export default function ExtensionConverter() {
  const zipReady = useJSZip();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("idle"); // idle | analyzing | done | error
  const [meta, setMeta] = useState(null);
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => { injectCSS(); }, []);

  // ── Drag & Drop ──────────────────────────────────────────
  const onDragOver = useCallback((e) => { e.preventDefault(); setDragging(true); }, []);
  const onDragLeave = useCallback(() => setDragging(false), []);
  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCode(ev.target.result);
    reader.readAsText(file);
  }, []);

  // ── Convert ──────────────────────────────────────────────
  const convert = async () => {
    if (!code.trim()) { setErrorMsg("Paste or upload your app code first."); setStatus("error"); return; }

    setStatus("analyzing");
    setErrorMsg("");
    setMeta(null);
    setFiles([]);
    setActiveFile(null);

    try {
      // Step 1: Ask Claude for metadata only
      const metadata = await callClaude(code);
      setMeta(metadata);

      // Step 2: Transform code programmatically
      const transformed = transformReactCode(code);

      // Step 3: Build extension files
      const popupHTML = buildPopupHTML({ transformedCode: transformed, meta: metadata });
      const manifestJSON = buildManifest(metadata);

      const generatedFiles = [
        { name: "manifest.json", content: manifestJSON, icon: "📋" },
        { name: "popup.html", content: popupHTML, icon: "🌐" },
      ];

      setFiles(generatedFiles);
      setActiveFile("manifest.json");
      setStatus("done");
    } catch (e) {
      setErrorMsg(e.message);
      setStatus("error");
    }
  };

  // ── Download ZIP ─────────────────────────────────────────
  const download = async () => {
    if (!zipReady || !files.length) return;
    const folderName = (meta?.name || "extension").replace(/\s+/g, "-").toLowerCase();
    await buildZip(files, folderName);
  };

  // ── File size helper ─────────────────────────────────────
  const fmtSize = (str) => {
    const b = new Blob([str]).size;
    return b > 1024 ? `${(b / 1024).toFixed(1)}k` : `${b}b`;
  };

  const activeContent = files.find(f => f.name === activeFile)?.content || "";

  const statusColor = { idle: "dot-idle", analyzing: "dot-working", done: "dot-done", error: "dot-err" };
  const statusText = {
    idle: "Ready — paste or drop your app code",
    analyzing: "Analyzing code with Claude · generating manifest · transforming JSX…",
    done: `Done — ${files.length} files generated · ready to load unpacked`,
    error: `Error: ${errorMsg}`,
  };

  return (
    <div className="app">
      {/* ─ Header ─ */}
      <header className="hdr">
        <div className="hdr-mark">⚡</div>
        <div>
          <div className="hdr-title">Extension Converter</div>
          <div className="hdr-sub">React Artifact → Chrome MV3 Extension</div>
        </div>
        <div className="hdr-pill">Manifest V3 · JSX Transform · Auto-CSP</div>
      </header>

      {/* ─ Body ─ */}
      <div className="body">
        {/* ══ Left Panel: Input ══ */}
        <div className="panel">
          <div className="panel-hdr">
            <span className="panel-label">App Code</span>
            <div className="panel-actions">
              <input
                ref={fileInputRef}
                type="file"
                accept=".jsx,.js,.tsx,.ts,.txt"
                style={{ display: "none" }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const r = new FileReader();
                  r.onload = ev => setCode(ev.target.result);
                  r.readAsText(f);
                  e.target.value = "";
                }}
              />
              <button className="btn btn-ghost" onClick={() => fileInputRef.current?.click()}>
                ↑ Upload
              </button>
              {code && (
                <button className="btn btn-ghost" onClick={() => { setCode(""); setStatus("idle"); setFiles([]); setMeta(null); }}>
                  ✕ Clear
                </button>
              )}
              <button
                className="btn btn-primary"
                onClick={convert}
                disabled={status === "analyzing" || !code.trim()}
              >
                {status === "analyzing" ? "⟳ Analyzing…" : "⚡ Convert"}
              </button>
            </div>
          </div>

          <div
            className={`drop-zone${dragging ? " dragging" : ""}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <textarea
              className="code-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`// Paste your React artifact code here…\n// Or drag & drop a .jsx / .js file\n\nimport { useState, useEffect } from "react";\n\nexport default function App() {\n  // …your app code…\n}`}
              spellCheck={false}
            />
            <div className="drop-overlay">
              <div className="drop-overlay-icon">⬇</div>
              <div className="drop-overlay-text">Drop file to load</div>
            </div>
          </div>

          {/* Instructions */}
          <div className="instructions">
            <div className="step">
              <div className={`step-num${code ? " done" : ""}`}>{code ? "✓" : "1"}</div>
              <div>Paste your React artifact code above, or <strong style={{color:"var(--txt)"}}>drag & drop</strong> a .jsx file. Works with any Claude artifact.</div>
            </div>
            <div className="step">
              <div className={`step-num${status === "done" ? " done" : ""}`}>{status === "done" ? "✓" : "2"}</div>
              <div>Click <code>⚡ Convert</code>. Claude analyzes your code for permissions, APIs, and CSP requirements. The JSX transform runs locally.</div>
            </div>
            <div className="step">
              <div className={`step-num${status === "done" ? " done" : ""}`}>{status === "done" ? "✓" : "3"}</div>
              <div>Download the ZIP → unzip → open <code>chrome://extensions</code> → enable <strong style={{color:"var(--txt)"}}>Developer Mode</strong> → click <code>Load unpacked</code> → select the folder.</div>
            </div>
          </div>

          <div className="status-bar">
            <div className={`dot ${statusColor[status]}`} />
            <span style={{ color: status === "error" ? "var(--red)" : "var(--m1)" }}>
              {statusText[status]}
            </span>
          </div>
        </div>

        {/* ══ Right Panel: Output ══ */}
        <div className="panel">
          <div className="panel-hdr">
            <span className="panel-label">
              {status === "done" ? `Extension Files — ${meta?.name || ""}` : "Generated Extension"}
            </span>
            <div className="panel-actions">
              {status === "done" && (
                <>
                  <button
                    className="btn btn-green"
                    onClick={download}
                    disabled={!zipReady}
                    title={zipReady ? "Download ZIP" : "Loading JSZip…"}
                  >
                    ↓ Download ZIP
                  </button>
                </>
              )}
            </div>
          </div>

          {status !== "done" ? (
            <div className="empty">
              <div className="empty-glyph">🧩</div>
              <div className="empty-title">
                {status === "analyzing" ? "Analyzing…" : "No Output Yet"}
              </div>
              <div className="empty-desc">
                {status === "analyzing"
                  ? "Claude is reading your code.\nGenerating manifest, auto-detecting CSP requirements,\ntransforming JSX for browser-UMD React…"
                  : "Paste your React artifact code on the left\nand click Convert to generate\na ready-to-load Chrome extension."}
              </div>
            </div>
          ) : (
            <div className="code-preview-wrap">
              {meta?.notes && (
                <div className="notes-banner">
                  <strong style={{ color: "var(--acc)" }}>AI Analysis: </strong>{meta.notes}
                </div>
              )}
              <div className="output-body">
                {/* File tree */}
                <div className="file-tree">
                  <div className="file-tree-hdr">📁 {(meta?.name || "extension").replace(/\s+/g, "-").toLowerCase()}/</div>
                  {files.map(f => (
                    <div
                      key={f.name}
                      className={`file-item${activeFile === f.name ? " active" : ""}`}
                      onClick={() => setActiveFile(f.name)}
                    >
                      <span className="file-icon">{f.icon}</span>
                      <span className="file-name">{f.name}</span>
                      <span className="file-size">{fmtSize(f.content)}</span>
                    </div>
                  ))}
                </div>

                {/* Code preview */}
                <div className="code-preview">
                  {activeContent}
                </div>
              </div>
            </div>
          )}

          {/* Loading instructions panel at bottom when done */}
          {status === "done" && (
            <div className="instructions" style={{ borderTop: "1px solid var(--brd)" }}>
              <div className="step">
                <div className="step-num done">↓</div>
                <div>Click <code>↓ Download ZIP</code> above. Unzip it — you'll have a folder named <code>{(meta?.name || "extension").replace(/\s+/g, "-").toLowerCase()}/</code></div>
              </div>
              <div className="step">
                <div className="step-num done">⚙</div>
                <div>Open <code>chrome://extensions</code> in Chrome. Toggle <strong style={{color:"var(--txt)"}}>Developer mode</strong> ON (top right). Click <code>Load unpacked</code>.</div>
              </div>
              <div className="step">
                <div className="step-num done">🧩</div>
                <div>Select the unzipped folder. Your extension appears in the toolbar. Pin it via the puzzle piece icon. <strong style={{color:"var(--acc)"}}>Done.</strong></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
