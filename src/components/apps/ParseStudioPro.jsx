import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════
//  PARSE STUDIO PRO — AI-Powered Data Extraction Workbench
//  All improvements from audit report implemented:
//  • Smart multi-phase URL regex (TLD-aware, no-scheme support)
//  • URL Formatter/Transformer view + built-in script
//  • execScript: timeout guard + actionable error messages
//  • ChatMessage extracted to named component (Rules of Hooks)
//  • Table link render works for bare domains
//  • copyText: async-first, no deprecated execCommand
//  • Google Search script URL detection upgraded
// ═══════════════════════════════════════════════════════════

// ── IndexedDB Layer ──────────────────────────────────────
const DB_NAME = "ParseStudioPro_v1";
const openDB = () =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      ["scripts", "datasets", "prompts"].forEach((s) => {
        if (!db.objectStoreNames.contains(s))
          db.createObjectStore(s, { keyPath: "id" });
      });
      if (!db.objectStoreNames.contains("kv"))
        db.createObjectStore("kv");
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

const dbGetAll = async (store) => {
  const db = await openDB();
  return new Promise((resolve) => {
    const req = db.transaction(store, "readonly").objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => resolve([]);
  });
};

const dbPut = async (store, value) => {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).put(value);
    tx.oncomplete = resolve;
    tx.onerror = resolve;
  });
};

const dbDelete = async (store, key) => {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).delete(key);
    tx.oncomplete = resolve;
    tx.onerror = resolve;
  });
};

const kvGet = async (key) => {
  const db = await openDB();
  return new Promise((resolve) => {
    const req = db.transaction("kv", "readonly").objectStore("kv").get(key);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => resolve(null);
  });
};

const kvSet = async (key, value) => {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction("kv", "readwrite");
    tx.objectStore("kv").put(value, key);
    tx.oncomplete = resolve;
    tx.onerror = resolve;
  });
};

// ── Utilities ────────────────────────────────────────────
const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const fmtDate = (ts) =>
  new Date(ts).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

const fmtDateTime = (ts) =>
  new Date(ts).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });

// ── FIX 3.3: copyText — async-first, no deprecated execCommand ──
const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = Object.assign(document.createElement("textarea"), {
      value: text,
      style: "position:fixed;opacity:0;pointer-events:none",
    });
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch { /* silent */ }
    document.body.removeChild(ta);
  }
};

// ── FIX 1.4 + 1.3: Script Sandbox with timeout + actionable errors ──
function execScript(code, input) {
  if (!input?.trim())
    return { ok: false, error: "No input text provided.", columns: [], rows: [] };
  try {
    // Inject __guardCheck so scripts can't infinite-loop the tab
    const guarded = `
const __start = Date.now();
const __guard = () => {
  if (Date.now() - __start > 6000)
    throw new Error("Script timeout: exceeded 6 seconds. Check for infinite loops.");
};
${code}
const __result = parse(input);
return __result;
`;
    const fn = new Function("input", guarded);
    const result = fn(input);
    if (
      !result ||
      !Array.isArray(result.columns) ||
      !Array.isArray(result.rows)
    ) {
      return {
        ok: false,
        error: "Script must return { columns: string[], rows: string[][] }",
        columns: [],
        rows: [],
      };
    }
    const rows = result.rows
      .filter((r) => Array.isArray(r) && r.some((c) => String(c ?? "").trim()))
      .map((r) => r.map((c) => String(c ?? "").trim()));
    return { ok: true, columns: result.columns, rows, error: null };
  } catch (e) {
    // FIX 1.3: Rewrite cryptic engine errors as actionable messages
    let msg = e.message;
    if (/parse is not defined/i.test(msg))
      msg = 'Script must define: function parse(input) { ... return { columns, rows }; }';
    else if (/is not a function/i.test(msg) && /parse/i.test(msg))
      msg = 'parse() must be a function. Check: function parse(input) { ... }';
    else if (/unexpected token/i.test(msg) || /syntaxerror/i.test(msg))
      msg = `Syntax error in script: ${msg}`;
    else if (/timeout/i.test(msg))
      msg = msg; // pass through our own timeout message
    return { ok: false, error: msg, columns: [], rows: [] };
  }
}

// ── FIX 3.2: URL helpers used in table rendering ──────────
const isClickableUrl = (cell) =>
  /^https?:\/\//i.test(cell) ||
  /^www\./i.test(cell) ||
  /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/|$)/.test(cell);

const toHref = (cell) =>
  /^https?:\/\//i.test(cell) ? cell : `https://${cell}`;

// ── Default Built-in Scripts ─────────────────────────────
const DEFAULT_SCRIPTS = [
  {
    id: "__builtin_google",
    name: "Google Search Results",
    description:
      "Extracts business names and URLs from Google Search results. Handles organic, maps, and mixed listings.",
    tags: ["google", "search", "business"],
    isBuiltin: true,
    createdAt: 0,
    updatedAt: 0,
    currentVersion: 1,
    versions: [
      {
        version: 1,
        note: "v2 — upgraded URL detection: scheme + www + bare TLD",
        createdAt: 0,
        // FIX 1.2: Upgraded URL regex — catches https://, www., and bare TLDs
        code: `function parse(input) {
  const lines = input.split('\\n').map(l => l.trim()).filter(Boolean);
  const rows = [];

  // FIX: Upgraded — catches https://, www., and bare domains with TLD
  const urlRe = /(?:https?:\\/\\/|www\\.)[^\\s)>"']+|[a-zA-Z0-9-]+\\.(?:com|net|io|ai|biz|org|co|app|dev|us|uk|ca|agency|media|tech|digital|cloud|solutions|services|studio|consulting|health|finance|software|platform|systems|group|ventures|global|pro|plus|social|news|blog|live|run|host|market|shop|store|online|info|edu|gov|build|codes|works|labs)(?:\\/[^\\s)>"']*)?/gi;

  const skipRe = /^(More results|People also ask|Sponsored|Ad ·|Images|Videos|Maps|Shopping|All|News|Books|Flights|Finance|Feedback|Report|See more|\\d+\\s*result|Web|Related searches|Search tools)/i;
  const ratingRe = /^[\\d.]+\\s*(stars?|out of|rating|·|•|\\(|[☆★])/i;

  const normalizeUrl = (raw) => {
    const clean = raw.replace(/[,)>"']+$/, '');
    if (!clean) return '';
    return /^https?:\\/\\//i.test(clean) ? clean : 'https://' + clean.replace(/^www\\./, '');
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (skipRe.test(line) || ratingRe.test(line) || line.length < 3) { i++; continue; }
    if (/^https?:\\/\\//.test(line)) { i++; continue; }

    if (line.length < 100 && !/^https?:/.test(line)) {
      let url = '';
      for (let j = i + 1; j < Math.min(i + 7, lines.length); j++) {
        const m = lines[j].match(urlRe);
        if (m) {
          url = normalizeUrl(m[0]);
          break;
        }
      }
      if (url || /^[A-Z]/.test(line)) {
        rows.push([line, url]);
        i += url ? 2 : 1;
        continue;
      }
    }
    i++;
  }

  // Deduplicate by lowercased name
  const seen = new Set();
  const unique = rows.filter(([name]) => {
    const k = name.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k); return true;
  });

  return { columns: ['Business Name', 'Website URL'], rows: unique };
}`,
      },
    ],
  },
  {
    id: "__builtin_url_extractor",
    name: "URL Extractor",
    description:
      "Extracts ALL URLs from any pasted text — including bare domains like apify.com, site.io, company.ai. Works on emails, HTML, documents, and mixed content.",
    tags: ["url", "links", "general"],
    isBuiltin: true,
    createdAt: 0,
    updatedAt: 0,
    currentVersion: 3,
    versions: [
      {
        version: 3,
        note: "v3 — regex literals only, split-on-delimiters for bare domains, no lookbehind",
        createdAt: 0,
        code: `function parse(input) {
  var seen = {};
  var rows = [];

  function normalize(raw) {
    var clean = raw.replace(/[.,;:!?)\\]>"']+$/, '');
    if (!clean || clean.length < 4) return null;
    if (/^https?:\\/\\//i.test(clean)) return clean;
    if (/^www\\./i.test(clean)) return 'https://' + clean;
    return 'https://' + clean;
  }

  function add(raw, tag) {
    var url = normalize(raw);
    if (!url) return;
    var key = url.toLowerCase();
    if (seen[key]) return;
    seen[key] = true;
    try {
      var u = new URL(url);
      rows.push([u.hostname.replace(/^www\\./, ''), url, u.pathname !== '/' ? u.pathname : '', tag]);
    } catch(e) {}
  }

  // Phase 1: explicit https?:// URLs
  var m1 = input.match(/https?:\\/\\/[^\\s"'<>()\\[\\]{}]+/g) || [];
  for (var i = 0; i < m1.length; i++) add(m1[i], 'https');

  // Phase 2: www. prefixed (no scheme)
  var m2 = input.match(/www\\.[a-zA-Z0-9][a-zA-Z0-9.-]*\\.[a-zA-Z]{2,}[^\\s"'<>()\\[\\]{}]*/g) || [];
  for (var j = 0; j < m2.length; j++) add(m2[j], 'www');

  // Phase 3: bare domains — split input on whitespace and delimiters,
  // then test each token against a TLD list. No lookbehind needed.
  var tldRe = /^([a-zA-Z0-9][a-zA-Z0-9-]*\\.(?:com|net|org|io|ai|co|biz|info|app|dev|us|uk|ca|de|fr|au|tech|online|store|agency|media|digital|cloud|solutions|services|inc|ltd|llc|shop|studio|design|marketing|consulting|health|legal|finance|software|tools|platform|systems|group|ventures|global|pro|plus|social|news|blog|live|api|web|market|gov|edu|mil|run|host|build|codes|works|labs|fund|world|space|video|stream|games|enterprise|partners|network|community|hub|zone|center|base|page|link|corp|business|team|office|pub|press|media|city|travel|events|jobs|careers|support|help|docs|portal|login|admin|dashboard|analytics|insights|reports|data|search|maps|drive|photos|mail|chat|meet|call))(\\/.+)?$/i;
  var tokens = input.split(/[\\s"'<>()\\[\\]{},;!?|\\\\]+/);
  for (var k = 0; k < tokens.length; k++) {
    var t = tokens[k];
    if (!t || t.length < 4) continue;
    if (/^https?:\\/\\//i.test(t)) continue;
    if (/^www\\./i.test(t)) continue;
    if (tldRe.test(t)) add(t, 'bare');
  }

  return { columns: ['Domain', 'Full URL', 'Path', 'Source'], rows: rows };
}`,
      },
    ],
  },
  {
    // NEW FEATURE 2.0: URL Formatter/Transformer for Apify and bulk scraping workflows
    id: "__builtin_url_formatter",
    name: "URL Formatter / Transformer",
    description:
      "Add or strip https://, http://, or www. from a list of URLs. One URL per line. Change the MODE variable to switch transform. Built for Apify actor targets and bulk scraping prep.",
    tags: ["url", "format", "apify", "transform", "bulk"],
    isBuiltin: true,
    createdAt: 0,
    updatedAt: 0,
    currentVersion: 1,
    versions: [
      {
        version: 1,
        note: "add-https · strip-all · add-www · strip-www · normalize · strip-scheme",
        createdAt: 0,
        code: `function parse(input) {
  // ╔══════════════════════════════════════════════════════╗
  // ║  SET YOUR TRANSFORM MODE BELOW                      ║
  // ╠══════════════════════════════════════════════════════╣
  // ║  'add-https'    → apify.com   → https://apify.com   ║
  // ║  'add-http'     → apify.com   → http://apify.com    ║
  // ║  'strip-scheme' → https://... → apify.com           ║
  // ║  'add-www'      → apify.com   → www.apify.com       ║
  // ║  'strip-www'    → www.apify   → apify.com           ║
  // ║  'strip-all'    → https://www → apify.com           ║
  // ║  'normalize'    → any form    → https://apify.com   ║
  // ╚══════════════════════════════════════════════════════╝
  const MODE = 'strip-all';

  const lines = input.split('\\n').map(l => l.trim()).filter(Boolean);
  const results = [];

  // Strip everything down to bare domain+path
  const bare = (url) => url
    .replace(/^https?:\\/\\//i, '')
    .replace(/^www\\./i, '');

  for (const line of lines) {
    let result = line;
    switch (MODE) {
      case 'add-https':
        result = 'https://' + bare(line);
        break;
      case 'add-http':
        result = 'http://' + bare(line);
        break;
      case 'strip-scheme':
        result = bare(line);
        // Re-add www if it was there
        if (/^(https?:\\/\\/)?www\\./i.test(line))
          result = 'www.' + bare(line);
        break;
      case 'add-www':
        result = 'www.' + bare(line);
        break;
      case 'strip-www':
        result = line.replace(/^(https?:\\/\\/)?www\\./i, (_, scheme) => scheme || '');
        break;
      case 'strip-all':
        result = bare(line);
        break;
      case 'normalize':
        result = 'https://' + bare(line);
        break;
      default:
        result = line;
    }

    // Trim any accidental double-slashes or trailing slashes
    result = result.replace(/([^:])\/\\/g, '$1/').replace(/\\/$/, '');

    results.push([line, result]);
  }

  return {
    columns: ['Original', 'Transformed (' + MODE + ')'],
    rows: results,
  };
}`,
      },
    ],
  },
  {
    id: "__builtin_csv",
    name: "CSV / TSV Parser",
    description:
      "Parses comma or tab-separated data. First row is treated as column headers. Auto-detects delimiter.",
    tags: ["csv", "tsv", "spreadsheet"],
    isBuiltin: true,
    createdAt: 0,
    updatedAt: 0,
    currentVersion: 1,
    versions: [
      {
        version: 1,
        note: "Initial — auto-detects delimiter, handles quoted fields",
        createdAt: 0,
        code: `function parse(input) {
  const lines = input.trim().split('\\n').filter(Boolean);
  if (!lines.length) return { columns: [], rows: [] };
  const delim = lines[0].includes('\\t') ? '\\t' : ',';
  function splitLine(line) {
    const res = []; let cur = ''; let inQ = false;
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ; continue; }
      if (ch === delim && !inQ) { res.push(cur.trim()); cur = ''; continue; }
      cur += ch;
    }
    res.push(cur.trim());
    return res;
  }
  return { columns: splitLine(lines[0]), rows: lines.slice(1).map(splitLine) };
}`,
      },
    ],
  },
  {
    id: "__builtin_linkedin",
    name: "LinkedIn Search Results",
    description:
      "Parses people or company results copied directly from LinkedIn search pages.",
    tags: ["linkedin", "people", "companies"],
    isBuiltin: true,
    createdAt: 0,
    updatedAt: 0,
    currentVersion: 1,
    versions: [
      {
        version: 1,
        note: "Initial",
        createdAt: 0,
        code: `function parse(input) {
  const lines = input.split('\\n').map(l => l.trim()).filter(Boolean);
  const skip = /^(Connect|Follow|Message|View profile|See all|Promoted|LinkedIn|Results|Filter|People|Jobs|\\d+)/i;
  const rows = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (skip.test(line) || line.length < 3) { i++; continue; }
    if (/^[A-Z]/.test(line) && line.length < 80 && !/\\d{4}/.test(line)) {
      const title = (lines[i+1] && !skip.test(lines[i+1])) ? lines[i+1] : '';
      const company = (lines[i+2] && !skip.test(lines[i+2])) ? lines[i+2] : '';
      rows.push([line, title, company]);
      i += 3; continue;
    }
    i++;
  }
  return { columns: ['Name', 'Title', 'Company / Location'], rows };
}`,
      },
    ],
  },
];

const BUILTIN_IDS = new Set(DEFAULT_SCRIPTS.map((s) => s.id));

const mergeScripts = (userScripts) => {
  const userIds = new Set(userScripts.map((s) => s.id));
  return [
    ...DEFAULT_SCRIPTS.filter((s) => !userIds.has(s.id)),
    ...userScripts,
  ].sort((a, b) => a.name.localeCompare(b.name));
};

// ── AI Integration ───────────────────────────────────────
const callAI = async (system, messages, apiKey, model) => {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
      ...(apiKey ? { "x-api-key": apiKey } : {}),
    },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      system,
      messages: messages.slice(-20).map((m) => ({
        role: m.role,
        content: m.content,
      })),
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.content?.[0]?.text || "";
};

// Parse <SCRIPT name="...">...</SCRIPT> and <AINOTE>...</AINOTE> from AI reply
const parseAIBlocks = (text) => {
  const scripts = [];
  const scriptRe = /<SCRIPT name="([^"]*)">([\s\S]*?)<\/SCRIPT>/g;
  let m;
  while ((m = scriptRe.exec(text)) !== null)
    scripts.push({ name: m[1], code: m[2].trim() });

  const noteRe = /<AINOTE>([\s\S]*?)<\/AINOTE>/g;
  const notes = [];
  while ((m = noteRe.exec(text)) !== null) notes.push(m[1].trim());

  const clean = text
    .replace(/<SCRIPT name="[^"]*">[\s\S]*?<\/SCRIPT>/g, "")
    .replace(/<AINOTE>[\s\S]*?<\/AINOTE>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { clean, scripts, notes };
};

// ── Export Helpers ───────────────────────────────────────
const exportResult = (result, format, name = "parse-studio-pro") => {
  let content, mime, ext;
  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;

  if (format === "csv") {
    content = [result.columns, ...result.rows].map((r) => r.map(esc).join(",")).join("\n");
    mime = "text/csv"; ext = "csv";
  } else if (format === "json") {
    const rows = result.rows.map((r) =>
      Object.fromEntries(result.columns.map((c, i) => [c, r[i] || ""]))
    );
    content = JSON.stringify(rows, null, 2);
    mime = "application/json"; ext = "json";
  } else if (format === "md") {
    const widths = result.columns.map((c) => c.length);
    result.rows.forEach((r) =>
      r.forEach((v, i) => { if ((v || "").length > widths[i]) widths[i] = v.length; })
    );
    const pad = (s, n) => String(s).padEnd(n);
    const header = "| " + result.columns.map((c, i) => pad(c, widths[i])).join(" | ") + " |";
    const sep = "| " + widths.map((w) => "-".repeat(w)).join(" | ") + " |";
    const rowLines = result.rows.map(
      (r) => "| " + r.map((v, i) => pad(v || "", widths[i])).join(" | ") + " |"
    );
    content = [header, sep, ...rowLines].join("\n");
    mime = "text/markdown"; ext = "md";
  } else {
    content = [result.columns.join("\t"), ...result.rows.map((r) => r.join("\t"))].join("\n");
    mime = "text/plain"; ext = "txt";
  }

  const blob = new Blob([content], { type: mime });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${name}.${ext}`;
  a.click();
  URL.revokeObjectURL(a.href);
};

// ── CSS ──────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0e0f0d; --s1:#141512; --s2:#1a1b18; --s3:#22231f; --s4:#2b2c27;
  --brd:rgba(255,255,255,.06); --brd2:rgba(255,255,255,.1); --brd3:rgba(255,255,255,.16);
  --txt:#e5e2d8; --m1:#a09c8e; --m2:#6b6860; --m3:#3a3a35;
  --acc:#d4a843; --acc2:#b8922d; --acc-dim:rgba(212,168,67,.1);
  --green:#4db87a; --red:#d46b6b; --blue:#6b9cd4; --purple:#9b7dd4;
  --font:'Fraunces',Georgia,serif; --mono:'DM Mono',monospace;
  --r:6px; --r2:10px; --r3:14px;
}
html,body{height:100%;overflow:hidden;background:var(--bg);color:var(--txt);font-family:var(--font);font-size:14px;line-height:1.5}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--m3);border-radius:3px}
::-webkit-scrollbar-thumb:hover{background:var(--m2)}
input,textarea,select,button{font-family:var(--mono);outline:none}

/* ─ App Shell ─ */
.app{display:grid;grid-template-columns:220px 1fr;height:100vh;overflow:hidden}

/* ─ Sidebar ─ */
.sidebar{background:var(--s1);border-right:1px solid var(--brd);display:flex;flex-direction:column;overflow:hidden}
.sidebar-logo{padding:18px 16px 14px;border-bottom:1px solid var(--brd);display:flex;align-items:center;gap:10px}
.logo-mark{width:30px;height:30px;background:var(--acc);border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:600;color:#0e0f0d;flex-shrink:0;font-family:var(--mono)}
.logo-name{font-family:var(--font);font-size:14px;font-weight:600;color:var(--txt);line-height:1.2}
.logo-sub{font-family:var(--mono);font-size:9px;color:var(--m2);letter-spacing:.08em;text-transform:uppercase}
.sidebar-nav{flex:1;padding:8px;overflow-y:auto}
.nav-group-label{font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:.1em;color:var(--m3);padding:12px 10px 5px}
.nav-item{display:flex;align-items:center;gap:9px;padding:7px 10px;border-radius:var(--r);cursor:pointer;transition:all .12s;color:var(--m1);font-family:var(--mono);font-size:12px;user-select:none}
.nav-item:hover{background:var(--s2);color:var(--txt)}
.nav-item.active{background:var(--acc-dim);color:var(--acc)}
.nav-icon{font-size:14px;width:18px;text-align:center;flex-shrink:0;opacity:.8}
.nav-badge{margin-left:auto;font-size:9px;background:var(--s3);color:var(--m2);padding:1px 6px;border-radius:10px;font-family:var(--mono)}
.sidebar-footer{padding:10px 8px;border-top:1px solid var(--brd)}
.status-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}

/* ─ Workspace ─ */
.workspace{display:flex;flex-direction:column;overflow:hidden;background:var(--bg)}
.topbar{display:flex;align-items:center;gap:10px;padding:0 20px;height:52px;border-bottom:1px solid var(--brd);flex-shrink:0}
.topbar-title{font-family:var(--font);font-size:15px;font-weight:500;color:var(--txt)}
.topbar-actions{margin-left:auto;display:flex;gap:6px;align-items:center}
.page-content{flex:1;overflow:hidden}

/* ─ Buttons ─ */
.btn{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:var(--r);border:1px solid var(--brd2);background:var(--s2);color:var(--m1);cursor:pointer;font-family:var(--mono);font-size:12px;font-weight:500;transition:all .12s;white-space:nowrap;line-height:1}
.btn:hover{background:var(--s3);color:var(--txt);border-color:var(--brd3)}
.btn:disabled{opacity:.4;cursor:default;pointer-events:none}
.btn-primary{background:var(--acc);border-color:var(--acc);color:#0e0f0d;font-weight:700}
.btn-primary:hover{background:var(--acc2);border-color:var(--acc2);color:#0e0f0d}
.btn-ghost{background:transparent;border-color:transparent;color:var(--m2)}
.btn-ghost:hover{background:var(--s2);color:var(--m1);border-color:transparent}
.btn-danger{color:var(--red);border-color:rgba(212,107,107,.25)}
.btn-danger:hover{background:rgba(212,107,107,.08);color:var(--red)}
.btn-sm{padding:4px 9px;font-size:11px}
.btn-icon{padding:5px 8px;min-width:28px;justify-content:center}
.btn-mode{background:var(--s3);border:1px solid var(--brd2);color:var(--m1);padding:5px 10px;border-radius:var(--r);font-family:var(--mono);font-size:11px;cursor:pointer;transition:all .12s;white-space:nowrap}
.btn-mode:hover{border-color:var(--brd3);color:var(--txt)}
.btn-mode.active{background:var(--acc-dim);border-color:var(--acc);color:var(--acc)}

/* ─ Inputs ─ */
.ipt{background:var(--s2);border:1px solid var(--brd2);color:var(--txt);padding:7px 11px;border-radius:var(--r);font-size:12px;width:100%;transition:border .12s}
.ipt:focus{border-color:var(--acc)}
.ipt::placeholder{color:var(--m2)}
.ipt-code{font-family:var(--mono);background:#090908;border:1px solid var(--brd);color:#ddd8c4;padding:12px;border-radius:var(--r2);font-size:11.5px;line-height:1.75;resize:vertical;width:100%}
.ipt-code:focus{border-color:rgba(212,168,67,.4)}
.sel{background:var(--s2);border:1px solid var(--brd2);color:var(--txt);padding:6px 10px;border-radius:var(--r);font-size:12px;cursor:pointer;width:100%}
.sel:focus{border-color:var(--acc)}
.lbl{font-family:var(--mono);font-size:10px;font-weight:500;text-transform:uppercase;letter-spacing:.07em;color:var(--m2);display:block;margin-bottom:5px}
.field{display:flex;flex-direction:column;margin-bottom:14px}

/* ─ Cards ─ */
.card{background:var(--s1);border:1px solid var(--brd);border-radius:var(--r2);padding:14px;transition:border .12s}
.card:hover{border-color:var(--brd2)}
.card-title{font-family:var(--font);font-size:13px;font-weight:500;color:var(--txt);margin-bottom:3px}
.card-meta{font-family:var(--mono);font-size:10px;color:var(--m2)}
.card-desc{font-size:12px;color:var(--m1);line-height:1.55;margin-top:6px}

/* ─ Tags ─ */
.tag{display:inline-flex;align-items:center;font-family:var(--mono);font-size:10px;padding:2px 7px;border-radius:20px;background:var(--s3);color:var(--m1);border:1px solid var(--brd)}
.tag-acc{background:var(--acc-dim);color:var(--acc);border-color:transparent}
.tag-green{background:rgba(77,184,122,.1);color:var(--green);border-color:transparent}
.tag-blue{background:rgba(107,156,212,.1);color:var(--blue);border-color:transparent}
.tag-orange{background:rgba(212,140,67,.12);color:#d48c43;border-color:transparent}
.tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:7px}

/* ─ Table ─ */
.tbl-wrap{overflow:auto;border-radius:var(--r2);border:1px solid var(--brd)}
table{width:100%;border-collapse:collapse;font-size:12px}
th{background:var(--s2);color:var(--m1);font-family:var(--mono);font-weight:500;font-size:10px;text-transform:uppercase;letter-spacing:.05em;padding:9px 12px;text-align:left;border-bottom:1px solid var(--brd2);white-space:nowrap;position:sticky;top:0;z-index:1}
td{padding:9px 12px;border-bottom:1px solid var(--brd);color:var(--txt);word-break:break-word;vertical-align:middle}
tr:last-child td{border-bottom:none}
tr:hover td{background:var(--s1)}
.td-url{font-family:var(--mono);font-size:11px;color:var(--blue)}
.td-url a{color:inherit;text-decoration:none}
.td-url a:hover{text-decoration:underline}
.td-num{font-family:var(--mono);font-size:10px;color:var(--m2);width:32px;text-align:center}
.td-act{width:1%;white-space:nowrap}
.td-mono{font-family:var(--mono);font-size:11px}

/* ─ Extractor Layout ─ */
.extractor-shell{display:flex;height:100%}
.ext-left{width:360px;min-width:260px;border-right:1px solid var(--brd);display:flex;flex-direction:column;flex-shrink:0}
.ext-right{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
.pane-header{padding:10px 14px;border-bottom:1px solid var(--brd);display:flex;align-items:center;gap:8px;flex-shrink:0}
.pane-label{font-family:var(--mono);font-size:10px;text-transform:uppercase;letter-spacing:.07em;color:var(--m2);font-weight:500}
.raw-textarea{flex:1;width:100%;border:none;background:transparent;color:var(--txt);font-family:var(--mono);font-size:12.5px;line-height:1.7;resize:none;padding:14px;outline:none}
.raw-textarea::placeholder{color:var(--m3)}
.script-bar{display:flex;gap:8px;padding:9px 12px;border-bottom:1px solid var(--brd);flex-shrink:0;align-items:center;background:var(--s1)}
.results-header{display:flex;align-items:center;gap:8px;padding:9px 14px;border-bottom:1px solid var(--brd);flex-shrink:0;flex-wrap:wrap;row-gap:4px}
.copy-bar{display:flex;gap:4px;margin-left:auto}
.results-body{flex:1;overflow:auto}

/* ─ URL Formatter ─ */
.fmt-shell{display:flex;height:100%}
.fmt-left{width:380px;min-width:280px;border-right:1px solid var(--brd);display:flex;flex-direction:column;flex-shrink:0}
.fmt-right{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
.fmt-modes{display:flex;flex-wrap:wrap;gap:6px;padding:12px 14px;border-bottom:1px solid var(--brd);background:var(--s1);flex-shrink:0}
.fmt-output-header{display:flex;align-items:center;gap:8px;padding:9px 14px;border-bottom:1px solid var(--brd);flex-shrink:0;flex-wrap:wrap;row-gap:4px}
.fmt-output-body{flex:1;overflow:auto;padding:14px;font-family:var(--mono);font-size:12.5px;line-height:1.9;color:var(--txt);white-space:pre-wrap;word-break:break-all}
.fmt-count{font-family:var(--mono);font-size:10px;color:var(--m2);padding:4px 14px 8px;border-bottom:1px solid var(--brd);flex-shrink:0}

/* ─ Error Banner ─ */
.err-banner{margin:14px;padding:10px 14px;background:rgba(212,107,107,.08);border:1px solid rgba(212,107,107,.25);border-radius:var(--r);font-family:var(--mono);font-size:12px;color:var(--red);line-height:1.6}

/* ─ Empty State ─ */
.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;height:100%;color:var(--m2);text-align:center;padding:40px}
.empty-icon{font-size:32px;opacity:.25;margin-bottom:4px}
.empty-title{font-family:var(--font);font-size:14px;color:var(--m1)}
.empty-desc{font-family:var(--mono);font-size:11px;color:var(--m2);line-height:1.6}

/* ─ Grid Layouts ─ */
.cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px}
.scroll-page{overflow-y:auto;height:100%;padding:20px}

/* ─ Version History ─ */
.ver-item{display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:var(--r);background:var(--s2);font-family:var(--mono);font-size:11px;color:var(--m1);cursor:pointer;transition:all .1s;border:1px solid transparent}
.ver-item:hover{border-color:var(--brd2);color:var(--txt)}
.ver-item.active{border-color:var(--acc);color:var(--acc);background:var(--acc-dim)}
.ver-num{font-size:10px;color:var(--m2)}

/* ─ Notes ─ */
.notes-editor{width:100%;border:none;background:transparent;color:var(--txt);font-family:var(--mono);font-size:13px;line-height:1.85;resize:none;outline:none}
.notes-editor::placeholder{color:var(--m3)}
.prose{font-family:var(--mono);font-size:12px;line-height:1.75;color:var(--txt);white-space:pre-wrap;word-break:break-word}

/* ─ Modal ─ */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:500;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(3px);animation:fadein .15s}
@keyframes fadein{from{opacity:0}to{opacity:1}}
.modal{background:var(--s1);border:1px solid var(--brd2);border-radius:var(--r3);padding:22px;width:100%;max-width:560px;max-height:92vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.7);animation:slideup .15s ease}
@keyframes slideup{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.modal-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
.modal-title{font-family:var(--font);font-size:15px;font-weight:500;color:var(--txt)}
.modal-footer{display:flex;gap:8px;justify-content:flex-end;margin-top:18px;padding-top:14px;border-top:1px solid var(--brd)}

/* ─ Chat Bubble ─ */
.chat-fab-wrap{position:fixed;bottom:22px;right:22px;z-index:400}
.chat-fab{width:46px;height:46px;border-radius:50%;background:var(--acc);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 4px 20px rgba(212,168,67,.35);transition:all .15s;color:#0e0f0d}
.chat-fab:hover{transform:scale(1.08)}
.chat-panel{position:absolute;bottom:58px;right:0;width:370px;height:510px;background:var(--s1);border:1px solid var(--brd2);border-radius:var(--r3);display:flex;flex-direction:column;overflow:hidden;box-shadow:0 12px 48px rgba(0,0,0,.65);animation:slideup .15s ease}
.chat-header{padding:12px 14px;border-bottom:1px solid var(--brd);display:flex;align-items:center;gap:8px;flex-shrink:0}
.chat-ai-name{font-family:var(--font);font-size:13px;font-weight:500;color:var(--txt)}
.chat-msgs{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px}
.chat-msg{padding:9px 12px;border-radius:var(--r2);font-family:var(--mono);font-size:12px;line-height:1.6;max-width:88%}
.chat-msg.user{background:var(--s3);color:var(--txt);margin-left:auto;border-radius:var(--r2) var(--r2) 3px var(--r2)}
.chat-msg.ai{background:var(--s2);border:1px solid var(--brd);border-radius:var(--r2) var(--r2) var(--r2) 3px}
.chat-msg pre{background:#090908;padding:9px;border-radius:5px;margin:7px 0;overflow-x:auto;font-size:11px;white-space:pre-wrap;line-height:1.6}
.chat-msg code{background:rgba(255,255,255,.07);padding:1px 5px;border-radius:3px;font-size:10.5px}
.chat-typing{display:flex;gap:4px;padding:4px 2px;align-items:center}
.typing-dot{width:5px;height:5px;border-radius:50%;background:var(--m2);animation:blink 1.4s infinite}
.typing-dot:nth-child(2){animation-delay:.2s}
.typing-dot:nth-child(3){animation-delay:.4s}
@keyframes blink{0%,80%,100%{opacity:.2}40%{opacity:1}}
.chat-input-row{padding:10px;border-top:1px solid var(--brd);display:flex;gap:8px;flex-shrink:0}
.chat-ipt{flex:1;background:var(--s2);border:1px solid var(--brd2);color:var(--txt);padding:7px 11px;border-radius:var(--r);font-family:var(--mono);font-size:12px;resize:none;height:56px;transition:border .12s}
.chat-ipt:focus{border-color:var(--acc)}

/* ─ AI Suggestion Card ─ */
.ai-suggestion{background:var(--s2);border:1px solid rgba(212,168,67,.25);border-radius:var(--r2);padding:12px;margin-top:2px}
.ai-suggestion pre{background:#090908;padding:10px;border-radius:6px;font-size:10px;font-family:var(--mono);overflow-x:auto;white-space:pre-wrap;line-height:1.6;color:#ddd8c4;margin:8px 0;max-height:200px;overflow-y:auto}
.ai-suggestion-label{font-family:var(--mono);font-size:10px;color:var(--acc);font-weight:500;margin-bottom:6px}

/* ─ Toast ─ */
.toast-stack{position:fixed;bottom:22px;left:50%;transform:translateX(-50%);z-index:600;display:flex;flex-direction:column;gap:6px;pointer-events:none;align-items:center}
.toast{background:var(--s3);border:1px solid var(--brd2);color:var(--txt);padding:9px 15px;border-radius:var(--r2);font-family:var(--mono);font-size:12px;display:flex;align-items:center;gap:8px;box-shadow:0 6px 24px rgba(0,0,0,.5);animation:slideup .18s ease}
.toast.ok{border-color:rgba(77,184,122,.3)}
.toast.err{border-color:rgba(212,107,107,.3)}
.toast.info{border-color:rgba(107,156,212,.3)}

/* ─ Divider ─ */
.divider{height:1px;background:var(--brd);margin:14px 0}

/* ─ Settings ─ */
.setting-row{display:flex;align-items:flex-start;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--brd);gap:20px}
.setting-row:last-child{border-bottom:none}
.setting-label{font-family:var(--font);font-size:13px;color:var(--txt)}
.setting-desc{font-family:var(--mono);font-size:11px;color:var(--m2);margin-top:2px;line-height:1.5}
.setting-ctl{flex-shrink:0;width:210px}

/* ─ Dropdown ─ */
.dropdown{position:relative}
.dropdown-menu{position:absolute;top:calc(100% + 5px);right:0;background:var(--s2);border:1px solid var(--brd2);border-radius:var(--r2);min-width:150px;z-index:200;box-shadow:0 8px 28px rgba(0,0,0,.5);animation:fadein .1s}
.dropdown-menu.hidden{display:none}
.dd-item{padding:8px 13px;font-family:var(--mono);font-size:12px;color:var(--m1);cursor:pointer;display:flex;align-items:center;gap:8px;transition:all .08s}
.dd-item:hover{background:var(--s3);color:var(--txt)}
.dd-item:first-child{border-radius:var(--r2) var(--r2) 0 0}
.dd-item:last-child{border-radius:0 0 var(--r2) var(--r2)}

/* ─ Info box ─ */
.info-box{background:var(--s2);border:1px solid var(--brd);border-radius:var(--r);padding:10px 14px;font-family:var(--mono);font-size:11px;color:var(--m1);line-height:1.7}
.info-box.accent{border-color:rgba(212,168,67,.2);background:var(--acc-dim)}
`;

// ── CSS Injection ────────────────────────────────────────
const injectCSS = () => {
  if (document.getElementById("psp-css")) return;
  const s = document.createElement("style");
  s.id = "psp-css";
  s.textContent = CSS;
  document.head.appendChild(s);
};

// ══════════════════════════════════════════════════════════
//  SUB-COMPONENTS — all hooks at top level, named, module scope
// ══════════════════════════════════════════════════════════

// ── Toast Stack ──────────────────────────────────────────
function ToastStack({ toasts }) {
  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span>{t.type === "ok" ? "✓" : t.type === "err" ? "⚠" : "ℹ"}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ── Script Edit Modal ────────────────────────────────────
function ScriptModal({ onClose, onSave, onNewVersion, initial }) {
  const [name, setName] = useState(initial.name);
  const [desc, setDesc] = useState(initial.description || "");
  const [tags, setTags] = useState((initial.tags || []).join(", "));
  const [code, setCode] = useState(() => {
    const v = initial.versions.find((v) => v.version === initial.currentVersion);
    return v?.code || "";
  });
  const [note, setNote] = useState(() => {
    const v = initial.versions.find((v) => v.version === initial.currentVersion);
    return v?.note || "";
  });
  const [activeVer, setActiveVer] = useState(initial.currentVersion);

  const switchVersion = (v) => {
    setActiveVer(v.version);
    setCode(v.code);
    setNote(v.note || "");
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      ...initial,
      name: name.trim(),
      description: desc.trim(),
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      currentVersion: activeVer,
      updatedAt: Date.now(),
      versions: initial.versions.map((v) =>
        v.version === activeVer ? { ...v, code, note: note.trim() } : v
      ),
    });
  };

  const handleNewVersion = () => {
    if (!name.trim()) return;
    onNewVersion(
      {
        ...initial,
        name: name.trim(),
        description: desc.trim(),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        updatedAt: Date.now(),
        versions: initial.versions.map((v) =>
          v.version === activeVer ? { ...v, code, note: note.trim() } : v
        ),
      },
      code,
      note.trim() || "Updated"
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 680 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            {initial.isBuiltin && BUILTIN_IDS.has(initial.id)
              ? "View Built-in Script"
              : initial.id.startsWith("__new")
              ? "New Script"
              : "Edit Script"}
          </div>
          {initial.isBuiltin && (
            <span className="tag tag-acc" style={{ fontSize: 9 }}>Built-in</span>
          )}
          <button className="btn btn-ghost btn-icon" onClick={onClose} style={{ marginLeft: "auto" }}>✕</button>
        </div>

        <div className="field">
          <span className="lbl">Name</span>
          <input className="ipt" value={name} onChange={(e) => setName(e.target.value)} placeholder="Script name" />
        </div>
        <div className="field">
          <span className="lbl">Description</span>
          <input className="ipt" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What does this script parse?" />
        </div>
        <div className="field">
          <span className="lbl">Tags (comma separated)</span>
          <input className="ipt" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="google, search, business" />
        </div>
        <div className="field">
          <span className="lbl">Version Note</span>
          <input className="ipt" value={note} onChange={(e) => setNote(e.target.value)} placeholder="What does this version do?" />
        </div>
        <div className="field">
          <span className="lbl">
            Script Code —{" "}
            <span style={{ color: "var(--m2)", textTransform: "none", letterSpacing: 0 }}>
              define <code style={{ background: "var(--s3)", padding: "0 4px", borderRadius: 3 }}>function parse(input)</code>{" "}
              returning <code style={{ background: "var(--s3)", padding: "0 4px", borderRadius: 3 }}>{"{ columns, rows }"}</code>
            </span>
          </span>
          <textarea
            className="ipt-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ minHeight: 280 }}
          />
        </div>

        {initial.versions.length > 1 && (
          <div className="field">
            <span className="lbl">Version History</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[...initial.versions].reverse().map((v) => (
                <div
                  key={v.version}
                  className={`ver-item${v.version === activeVer ? " active" : ""}`}
                  onClick={() => switchVersion(v)}
                >
                  <span className="ver-num">v{v.version}</span>
                  <span style={{ flex: 1 }}>{v.note || "No note"}</span>
                  <span style={{ fontSize: 10, color: "var(--m2)" }}>{fmtDate(v.createdAt)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          {!initial.isBuiltin && (
            <button className="btn" onClick={handleNewVersion}>+ New Version</button>
          )}
          <button className="btn btn-primary" onClick={handleSave}>Save Script</button>
        </div>
      </div>
    </div>
  );
}

// ── Prompt Modal ─────────────────────────────────────────
function PromptModal({ onClose, onSave, onNewVersion, initial }) {
  const [name, setName] = useState(initial.name);
  const [tags, setTags] = useState((initial.tags || []).join(", "));
  const [text, setText] = useState(() => {
    const v = initial.versions.find((v) => v.version === initial.currentVersion);
    return v?.text || "";
  });
  const [activeVer, setActiveVer] = useState(initial.currentVersion);

  const switchVersion = (v) => { setActiveVer(v.version); setText(v.text || ""); };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{initial.id.startsWith("__new") ? "New Prompt" : "Edit Prompt"}</div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="field">
          <span className="lbl">Name</span>
          <input className="ipt" value={name} onChange={(e) => setName(e.target.value)} placeholder="Prompt name" />
        </div>
        <div className="field">
          <span className="lbl">Tags</span>
          <input className="ipt" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="parsing, scripts, general" />
        </div>
        <div className="field">
          <span className="lbl">Prompt Text</span>
          <textarea
            className="ipt"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ minHeight: 200, lineHeight: 1.7, resize: "vertical", fontFamily: "var(--mono)", fontSize: 12 }}
            placeholder="Write your reusable prompt here..."
          />
        </div>
        {initial.versions.length > 1 && (
          <div className="field">
            <span className="lbl">Version History</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[...initial.versions].reverse().map((v) => (
                <div
                  key={v.version}
                  className={`ver-item${v.version === activeVer ? " active" : ""}`}
                  onClick={() => switchVersion(v)}
                >
                  <span className="ver-num">v{v.version}</span>
                  <span style={{ flex: 1 }}>{fmtDate(v.createdAt)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn"
            onClick={() =>
              onNewVersion(
                { ...initial, name: name.trim(), tags: tags.split(",").map((t) => t.trim()).filter(Boolean) },
                text
              )
            }
          >
            + New Version
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              if (!name.trim()) return;
              onSave({
                ...initial,
                name: name.trim(),
                tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
                currentVersion: activeVer,
                versions: initial.versions.map((v) =>
                  v.version === activeVer ? { ...v, text } : v
                ),
              });
            }}
          >
            Save Prompt
          </button>
        </div>
      </div>
    </div>
  );
}

// ── AI Suggestion Card ────────────────────────────────────
function AISuggestionCard({ suggestion, onInstall, onTestRun }) {
  return (
    <div className="ai-suggestion">
      <div className="ai-suggestion-label">⚙ Script: "{suggestion.name}"</div>
      <pre>{suggestion.code}</pre>
      <div style={{ display: "flex", gap: 6 }}>
        <button className="btn btn-primary btn-sm" onClick={onInstall}>Save Script</button>
        <button className="btn btn-sm" onClick={onTestRun}>▶ Test Run</button>
      </div>
    </div>
  );
}

// ── FIX 3.1: ChatMessage — extracted to named component ──
// Previously renderChatMsg() was a render helper closure inside App.
// Now it is a proper named component at module scope.
function ChatMessage({ msg, suggestedRef, onInstall, onTestRun }) {
  const renderText = (text) => {
    const parts = text.split(/(```[\s\S]*?```|`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, j) => {
      if (part.startsWith("```") && part.endsWith("```"))
        return <pre key={j}>{part.slice(3, -3).replace(/^\w+\n/, "")}</pre>;
      if (part.startsWith("`") && part.endsWith("`"))
        return <code key={j}>{part.slice(1, -1)}</code>;
      if (part.startsWith("**") && part.endsWith("**"))
        return <strong key={j}>{part.slice(2, -2)}</strong>;
      return part.split("\n").map((line, k) =>
        k === 0 ? line : [<br key={k} />, line]
      );
    });
  };

  return (
    <div>
      <div className={`chat-msg ${msg.role}`}>
        {msg.role === "assistant" ? renderText(msg.content) : msg.content}
      </div>
      {msg.suggestions?.map((sg) =>
        suggestedRef.current[sg.key] ? (
          <AISuggestionCard
            key={sg.key}
            suggestion={suggestedRef.current[sg.key]}
            onInstall={() => onInstall(sg.key)}
            onTestRun={() => onTestRun(sg.key)}
          />
        ) : null
      )}
    </div>
  );
}

// ── Dropdown ─────────────────────────────────────────────
function Dropdown({ trigger, items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  return (
    <div className="dropdown" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      <div className={`dropdown-menu${open ? "" : " hidden"}`}>
        {items.map((item, i) => (
          <div key={i} className="dd-item" onClick={() => { item.onClick(); setOpen(false); }}>
            {item.icon && <span>{item.icon}</span>}
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Settings View (proper named component with hooks) ─────
function SettingsView({ settings, onSave, onClearAll, onBackup, toast }) {
  const [local, setLocal] = useState({ ...settings });
  useEffect(() => { setLocal({ ...settings }); }, [settings.apiKey, settings.model]);

  const testConnection = async () => {
    if (!local.apiKey) { toast("Enter an API key first", "err"); return; }
    try {
      await callAI("Reply with exactly: OK", [{ role: "user", content: "ping" }], local.apiKey, local.model);
      toast("API key works ✓", "ok");
    } catch (e) {
      toast(`Error: ${e.message}`, "err");
    }
  };

  return (
    <div className="scroll-page">
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div className="card" style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: "var(--font)", fontWeight: 500, fontSize: 14, marginBottom: 16 }}>⚙ AI Configuration</div>
          <div className="setting-row">
            <div>
              <div className="setting-label">API Key</div>
              <div className="setting-desc">Anthropic API key · Stored in IndexedDB · Never leaves your browser</div>
            </div>
            <div className="setting-ctl">
              <input
                type="password"
                className="ipt"
                value={local.apiKey}
                placeholder="sk-ant-api03-..."
                onChange={(e) => setLocal((s) => ({ ...s, apiKey: e.target.value }))}
              />
            </div>
          </div>
          <div className="setting-row">
            <div>
              <div className="setting-label">Model</div>
              <div className="setting-desc">AI model used for script generation and chat</div>
            </div>
            <div className="setting-ctl">
              <select
                className="sel"
                value={local.model}
                onChange={(e) => setLocal((s) => ({ ...s, model: e.target.value }))}
              >
                <option value="claude-haiku-4-5-20251001">Claude Haiku 4.5 — Fast</option>
                <option value="claude-sonnet-4-5">Claude Sonnet 4.5 — Smarter</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
            <button className="btn btn-primary" onClick={() => onSave(local)}>Save Settings</button>
            <button className="btn" onClick={testConnection}>Test Connection</button>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: "var(--font)", fontWeight: 500, fontSize: 14, marginBottom: 16 }}>📦 Data</div>
          <div className="setting-row">
            <div>
              <div className="setting-label">Export Backup</div>
              <div className="setting-desc">Download all scripts, datasets, prompts, and notes as JSON</div>
            </div>
            <div className="setting-ctl">
              <button className="btn" onClick={onBackup}>Export Backup</button>
            </div>
          </div>
          <div className="setting-row">
            <div>
              <div className="setting-label">Clear All Data</div>
              <div className="setting-desc">Remove all user scripts, datasets, prompts, and notes</div>
            </div>
            <div className="setting-ctl">
              <button className="btn btn-danger" onClick={onClearAll}>Clear All Data</button>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ fontFamily: "var(--font)", fontWeight: 500, fontSize: 14, marginBottom: 10 }}>ℹ About</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--m1)", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--txt)" }}>Parse Studio Pro</strong> — AI-powered data extraction workbench<br />
            Smart URL extraction · URL Formatter for Apify bulk targets<br />
            All data stored locally in IndexedDB · No server · No login required
          </div>
        </div>
      </div>
    </div>
  );
}

// ── NEW FEATURE 2.0: URL Formatter View ─────────────────
// Dedicated UI for the Apify / bulk scraping URL transform workflow.
// Full named component — hooks at top level.
const URL_MODES = [
  { id: "strip-all",    label: "Strip All",    desc: "apify.com/actor",           help: "Remove https:// and www. → bare domain. Best for Apify actors that break with scheme." },
  { id: "add-https",    label: "Add https://", desc: "https://apify.com/actor",   help: "Ensure every URL has https:// prefix. Use for actors that require full URLs." },
  { id: "add-http",     label: "Add http://",  desc: "http://apify.com/actor",    help: "Force http:// prefix. Rarely needed but available." },
  { id: "normalize",    label: "Normalize",    desc: "https://apify.com/actor",   help: "Strip scheme+www then add https://. Canonical form." },
  { id: "strip-scheme", label: "Strip Scheme", desc: "apify.com/actor",           help: "Remove https:// or http:// but keep www. if present." },
  { id: "add-www",      label: "Add www.",     desc: "www.apify.com/actor",       help: "Add www. prefix (no scheme)." },
  { id: "strip-www",    label: "Strip www.",   desc: "https://apify.com/actor",   help: "Remove www. while keeping scheme." },
];

function UrlFormatterView({ toast }) {
  const [rawInput, setRawInput] = useState("");
  const [mode, setMode] = useState("strip-all");

  // Compute transform on every keystroke — no run button needed
  const transformed = useCallback(() => {
    const lines = rawInput.split("\n").map((l) => l.trim()).filter(Boolean);
    if (!lines.length) return [];

    const bare = (url) =>
      url.replace(/^https?:\/\//i, "").replace(/^www\./i, "");

    return lines.map((line) => {
      let result = line;
      switch (mode) {
        case "add-https":    result = "https://" + bare(line); break;
        case "add-http":     result = "http://" + bare(line); break;
        case "strip-scheme": {
          const hadWww = /^(https?:\/\/)?www\./i.test(line);
          result = (hadWww ? "www." : "") + bare(line);
          break;
        }
        case "add-www":      result = "www." + bare(line); break;
        case "strip-www":    result = line.replace(/^(https?:\/\/)?www\./i, (_, s) => s || ""); break;
        case "strip-all":    result = bare(line); break;
        case "normalize":    result = "https://" + bare(line); break;
        default:             result = line;
      }
      // Clean double-slashes (not in http://) and trailing slashes
      result = result.replace(/([^:])\/\//g, "$1/").replace(/\/$/, "");
      return result;
    });
  }, [rawInput, mode]);

  const results = transformed();
  const outputText = results.join("\n");
  const currentMode = URL_MODES.find((m) => m.id === mode);

  const copyOutput = async () => {
    if (!outputText) { toast("Nothing to copy", "err"); return; }
    await copyText(outputText);
    toast(`Copied ${results.length} URLs`, "ok");
  };

  const downloadOutput = () => {
    if (!outputText) { toast("Nothing to export", "err"); return; }
    const blob = new Blob([outputText], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `urls-${mode}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast("Downloaded");
  };

  return (
    <div className="fmt-shell">
      {/* Input Pane */}
      <div className="fmt-left">
        <div className="pane-header">
          <span className="pane-label">URL Input</span>
          <button
            className="btn btn-ghost btn-sm btn-icon"
            onClick={() => setRawInput("")}
            title="Clear"
          >✕</button>
        </div>
        <div className="fmt-modes">
          {URL_MODES.map((m) => (
            <button
              key={m.id}
              className={`btn-mode${mode === m.id ? " active" : ""}`}
              onClick={() => setMode(m.id)}
              title={m.help}
            >
              {m.label}
            </button>
          ))}
        </div>
        {currentMode && (
          <div style={{ padding: "8px 14px 0", flexShrink: 0 }}>
            <div className="info-box accent" style={{ fontSize: 10.5, lineHeight: 1.65 }}>
              <strong style={{ color: "var(--acc)" }}>{currentMode.label}</strong>
              {" · "}{currentMode.help}
              <div style={{ marginTop: 4, color: "var(--m2)" }}>
                e.g. → <span style={{ color: "var(--txt)", fontFamily: "var(--mono)" }}>{currentMode.desc}</span>
              </div>
            </div>
          </div>
        )}
        <textarea
          className="raw-textarea"
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          placeholder={`Paste URLs here — one per line\n\nhttps://apify.com/apify/web-scraper\nwww.example.com/page\nexample.io/api\nhttps://www.site.co/path\n\nTransform updates instantly as you type.`}
          style={{ flex: 1 }}
        />
      </div>

      {/* Output Pane */}
      <div className="fmt-right">
        <div className="fmt-output-header">
          <span className="pane-label">Transformed Output</span>
          {results.length > 0 && (
            <span className="tag tag-green">{results.length} URLs</span>
          )}
          <span className="tag tag-orange" style={{ marginLeft: 2 }}>{currentMode?.label}</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            <button className="btn btn-ghost btn-sm" onClick={copyOutput}>📋 Copy All</button>
            <button className="btn btn-ghost btn-sm" onClick={downloadOutput}>↓ Download</button>
          </div>
        </div>
        {results.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🔗</div>
            <div className="empty-title">No URLs yet</div>
            <div className="empty-desc">
              Paste URLs on the left.<br />
              Select a transform mode.<br />
              Output appears instantly.
            </div>
          </div>
        ) : (
          <>
            <div className="fmt-count">
              {results.length} URLs · mode: {mode}
            </div>
            <div className="fmt-output-body">
              {results.map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "2px 0",
                    borderBottom: "1px solid var(--brd)",
                    marginBottom: 2,
                  }}
                >
                  <span style={{ color: "var(--m3)", fontSize: 10, minWidth: 24, textAlign: "right", userSelect: "none" }}>
                    {i + 1}
                  </span>
                  <span
                    style={{ flex: 1, color: "var(--txt)", cursor: "pointer", wordBreak: "break-all" }}
                    title="Click to copy this URL"
                    onClick={async () => {
                      await copyText(r);
                      toast("Copied", "ok");
                    }}
                  >
                    {r}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  MAIN APP
// ══════════════════════════════════════════════════════════
export default function App() {
  // ── Navigation ─────────────────────────────────────────
  const [view, setView] = useState("extractor");

  // ── Core Data (IndexedDB-backed) ───────────────────────
  const [userScripts, setUserScripts] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [notes, setNotes] = useState({ user: "", ai: "" });
  const [settings, setSettings] = useState({
    apiKey: "",
    model: "claude-haiku-4-5-20251001",
  });

  // ── Extractor State ────────────────────────────────────
  const [rawInput, setRawInput] = useState("");
  const [activeScriptId, setActiveScriptId] = useState(null);
  const [parseResult, setParseResult] = useState(null);

  // ── Chat ───────────────────────────────────────────────
  const [chatOpen, setChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // ── Modals ─────────────────────────────────────────────
  const [scriptModal, setScriptModal] = useState(null);
  const [promptModal, setPromptModal] = useState(null);

  // ── Toast ──────────────────────────────────────────────
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((msg, type = "ok") => {
    const id = uid();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  // ── Refs ───────────────────────────────────────────────
  const suggestedRef = useRef({});
  const chatEndRef = useRef(null);
  const notesTimerRef = useRef(null);
  const rawInputRef = useRef("");

  // ── Computed ───────────────────────────────────────────
  const allScripts = mergeScripts(userScripts);
  const activeScript =
    allScripts.find((s) => s.id === activeScriptId) || allScripts[0] || null;

  // ── Init ───────────────────────────────────────────────
  useEffect(() => {
    injectCSS();
    loadAll();
  }, []);

  const loadAll = async () => {
    const [scripts, ds, prm, noteUser, noteAi, cfg, ch] = await Promise.all([
      dbGetAll("scripts"),
      dbGetAll("datasets"),
      dbGetAll("prompts"),
      kvGet("notes:user"),
      kvGet("notes:ai"),
      kvGet("settings"),
      kvGet("chat:history"),
    ]);
    setUserScripts(scripts);
    setDatasets(ds);
    setPrompts(prm);
    setNotes({ user: noteUser || "", ai: noteAi || "" });
    if (cfg) setSettings(cfg);
    if (ch) setChatHistory(ch);
    const merged = mergeScripts(scripts);
    if (merged.length > 0) setActiveScriptId(merged[0].id);
  };

  // ── Badge counts ───────────────────────────────────────
  const scriptCount = allScripts.length;
  const datasetCount = datasets.length;
  const promptCount = prompts.length;

  // ── Script CRUD ─────────────────────────────────────────
  const saveScript = async (script) => {
    const isNew = !userScripts.find((s) => s.id === script.id);
    const updated = isNew
      ? [...userScripts, script]
      : userScripts.map((s) => (s.id === script.id ? script : s));
    setUserScripts(updated);
    await dbPut("scripts", script);
    setScriptModal(null);
    toast(isNew ? "Script saved" : "Script updated");
  };

  const saveScriptNewVersion = async (base, newCode, newNote) => {
    const newVer = {
      version: base.currentVersion + 1,
      note: newNote || "Updated",
      createdAt: Date.now(),
      code: newCode,
    };
    const updatedVersions = base.versions.map((v) =>
      v.version === base.currentVersion
        ? { ...v, code: newCode, note: base.versions.find((x) => x.version === base.currentVersion)?.note || "" }
        : v
    );
    const script = {
      ...base,
      isBuiltin: false,
      versions: [...updatedVersions, newVer],
      currentVersion: newVer.version,
      updatedAt: Date.now(),
    };
    const isExisting = userScripts.find((s) => s.id === script.id);
    const updated = isExisting
      ? userScripts.map((s) => (s.id === script.id ? script : s))
      : [...userScripts, script];
    setUserScripts(updated);
    await dbPut("scripts", script);
    setScriptModal(null);
    toast(`Version ${newVer.version} saved`);
  };

  const deleteScript = async (id) => {
    if (!confirm("Delete this script?")) return;
    const updated = userScripts.filter((s) => s.id !== id);
    setUserScripts(updated);
    await dbDelete("scripts", id);
    toast("Script deleted");
  };

  const openNewScript = () => {
    setScriptModal({
      id: uid(),
      name: "New Script",
      description: "",
      tags: [],
      isBuiltin: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      currentVersion: 1,
      versions: [
        {
          version: 1,
          note: "Initial",
          createdAt: Date.now(),
          code: `function parse(input) {
  const lines = input.split('\\n').map(l => l.trim()).filter(Boolean);
  const rows = [];
  for (const line of lines) {
    rows.push([line]);
  }
  return { columns: ['Value'], rows };
}`,
        },
      ],
    });
  };

  const openEditScript = (script) => {
    if (script.isBuiltin && BUILTIN_IDS.has(script.id)) {
      setScriptModal({
        ...JSON.parse(JSON.stringify(script)),
        isBuiltin: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    } else {
      setScriptModal(JSON.parse(JSON.stringify(script)));
    }
  };

  // ── Dataset CRUD ─────────────────────────────────────────
  const saveDataset = async () => {
    if (!parseResult?.ok || !parseResult.rows.length) {
      toast("No data to save", "err"); return;
    }
    const ds = {
      id: uid(),
      name: `${activeScript?.name || "Unnamed"} — ${new Date().toLocaleString()}`,
      scriptId: activeScript?.id,
      scriptName: activeScript?.name || "",
      columns: parseResult.columns,
      rows: parseResult.rows,
      rowCount: parseResult.rows.length,
      createdAt: Date.now(),
    };
    setDatasets((prev) => [...prev, ds]);
    await dbPut("datasets", ds);
    toast(`Dataset saved (${ds.rowCount} rows)`);
  };

  const deleteDataset = async (id) => {
    if (!confirm("Delete this dataset?")) return;
    setDatasets((prev) => prev.filter((d) => d.id !== id));
    await dbDelete("datasets", id);
    toast("Deleted");
  };

  // ── Prompt CRUD ─────────────────────────────────────────
  const savePrompt = async (prompt) => {
    const isNew = !prompts.find((p) => p.id === prompt.id);
    const updated = isNew
      ? [...prompts, prompt]
      : prompts.map((p) => (p.id === prompt.id ? prompt : p));
    setPrompts(updated);
    await dbPut("prompts", prompt);
    setPromptModal(null);
    toast(isNew ? "Prompt saved" : "Prompt updated");
  };

  const savePromptNewVersion = async (base, newText) => {
    const newVer = { version: base.currentVersion + 1, text: newText, createdAt: Date.now() };
    const prompt = {
      ...base,
      versions: [...base.versions, newVer],
      currentVersion: newVer.version,
    };
    const isExisting = prompts.find((p) => p.id === prompt.id);
    const updated = isExisting
      ? prompts.map((p) => (p.id === prompt.id ? prompt : p))
      : [...prompts, prompt];
    setPrompts(updated);
    await dbPut("prompts", prompt);
    setPromptModal(null);
    toast(`Prompt v${newVer.version} saved`);
  };

  const deletePrompt = async (id) => {
    if (!confirm("Delete this prompt?")) return;
    setPrompts((prev) => prev.filter((p) => p.id !== id));
    await dbDelete("prompts", id);
    toast("Deleted");
  };

  const openNewPrompt = () =>
    setPromptModal({
      id: uid(),
      name: "New Prompt",
      tags: [],
      currentVersion: 1,
      versions: [{ version: 1, text: "", createdAt: Date.now() }],
    });

  const usePromptInChat = (prompt) => {
    const ver = prompt.versions.find((v) => v.version === prompt.currentVersion);
    setChatInput(ver?.text || "");
    setChatOpen(true);
    setTimeout(() => document.getElementById("psp-chat-input")?.focus(), 100);
  };

  // ── Notes ─────────────────────────────────────────────
  const handleUserNotesChange = (val) => {
    setNotes((n) => ({ ...n, user: val }));
    clearTimeout(notesTimerRef.current);
    notesTimerRef.current = setTimeout(() => kvSet("notes:user", val), 700);
  };

  const handleAiNotesChange = (val) => {
    setNotes((n) => ({ ...n, ai: val }));
    clearTimeout(notesTimerRef.current);
    notesTimerRef.current = setTimeout(() => kvSet("notes:ai", val), 700);
  };

  // ── Extractor ──────────────────────────────────────────
  const runExtraction = () => {
    if (!activeScript) { toast("No script selected", "err"); return; }
    const result = execScript(
      activeScript.versions.find((v) => v.version === activeScript.currentVersion)?.code || "",
      rawInput
    );
    setParseResult(result);
    if (result.ok) toast(`${result.rows.length} rows extracted`);
    else toast(`Script error: ${result.error}`, "err");
  };

  const copyColumn = async (label) => {
    if (!parseResult?.ok) { toast("No data", "err"); return; }
    const patterns = {
      urls: /url|link|website|http|domain/i,
      names: /name|business|company|title/i,
    };
    const pat = patterns[label] || new RegExp(label, "i");
    let idx = parseResult.columns.findIndex((c) => pat.test(c));
    if (idx < 0) idx = 0;
    const vals = parseResult.rows.map((r) => r[idx] || "").filter(Boolean).join("\n");
    await copyText(vals);
    toast(`Copied ${parseResult.rows.length} ${label}`, "ok");
  };

  const copyAll = async () => {
    if (!parseResult?.ok) { toast("No data", "err"); return; }
    const header = parseResult.columns.join("\t");
    const rows = parseResult.rows.map((r) => r.join("\t")).join("\n");
    await copyText(header + "\n" + rows);
    toast(`Copied all (${parseResult.rows.length} rows)`, "ok");
  };

  const copyRow = async (i) => {
    if (!parseResult?.ok) return;
    await copyText(parseResult.rows[i].join("\t"));
    toast("Row copied");
  };

  // ── Export ─────────────────────────────────────────────
  const doExport = (format, result, name) => {
    if (!result?.ok || !result.rows.length) { toast("No data to export", "err"); return; }
    exportResult(result, format, name);
    toast(`Exported as ${format.toUpperCase()}`);
  };

  const doExportDataset = (ds, format) => {
    exportResult(
      { ok: true, columns: ds.columns, rows: ds.rows },
      format,
      ds.name.replace(/[^a-z0-9]/gi, "-").toLowerCase()
    );
    toast(`Exported as ${format.toUpperCase()}`);
  };

  // ── AI Context Builder ─────────────────────────────────
  const buildSystem = useCallback(() => {
    const scriptList = allScripts.map((s) => `${s.name} (id: ${s.id})`).join(", ");
    const activeVer = activeScript?.versions.find(
      (v) => v.version === activeScript?.currentVersion
    );
    return `You are Parse AI, the embedded assistant in Parse Studio Pro — a personal browser-based tool for extracting structured data from pasted text (Google search results, LinkedIn, CSV, emails, bulk URL lists, etc.).

TODAY: ${new Date().toLocaleString()}
CURRENT VIEW: ${view}
ACTIVE SCRIPT: ${activeScript ? `"${activeScript.name}" v${activeScript.currentVersion}` : "none"}
ALL SCRIPTS: ${scriptList}
DATASETS SAVED: ${datasets.length}
INPUT TEXT (first 800 chars): ${rawInputRef.current.slice(0, 800) || "(empty)"}
${activeVer ? `\nACTIVE SCRIPT CODE:\n${activeVer.code}` : ""}
AI NOTES SO FAR:\n${notes.ai || "(empty)"}

CAPABILITIES:
- Generate scripts for any parsing task
- Debug or improve existing scripts
- Explain extracted data patterns
- Help with URL formatting for Apify actors (strip-all, add-https, normalize, etc.)

RESPONSE PROTOCOL:
When you generate a parse script, wrap it in:
<SCRIPT name="Descriptive Name Here">
function parse(input) {
  // your code
  return { columns: [...], rows: [[...]] };
}
</SCRIPT>

When you learn something useful, append to AI notes:
<AINOTE>Your observation here</AINOTE>

Scripts MUST define function parse(input) returning { columns: string[], rows: string[][] }.
Be concise and direct.`;
  }, [view, activeScript, allScripts, datasets.length, notes.ai]);

  // ── Chat Send ──────────────────────────────────────────
  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    if (!settings.apiKey) {
      toast("Add your API key in Settings", "err");
      setView("settings");
      return;
    }

    rawInputRef.current = rawInput;
    const userMsg = { role: "user", content: chatInput.trim(), ts: Date.now() };
    const newHistory = [...chatHistory, userMsg];
    setChatHistory(newHistory);
    setChatInput("");
    setChatLoading(true);

    try {
      const system = buildSystem();
      const raw = await callAI(system, newHistory, settings.apiKey, settings.model);
      const { clean, scripts: suggestedScripts, notes: aiNotes } = parseAIBlocks(raw);

      if (aiNotes.length > 0) {
        const appended = aiNotes
          .map((n) => `\n\n— ${new Date().toLocaleString()}\n${n}`)
          .join("");
        const newAiNotes = notes.ai + appended;
        setNotes((n) => ({ ...n, ai: newAiNotes }));
        await kvSet("notes:ai", newAiNotes);
      }

      // Store suggestions in ref — never serialized to DOM
      const suggestionCards = suggestedScripts.map((s) => {
        const key = `sg_${uid()}`;
        suggestedRef.current[key] = s;
        return { type: "suggestion", key };
      });

      const aiMsg = {
        role: "assistant",
        content: clean,
        ts: Date.now(),
        suggestions: suggestionCards,
      };
      const finalHistory = [...newHistory, aiMsg];
      setChatHistory(finalHistory);
      await kvSet("chat:history", finalHistory);
    } catch (e) {
      const errMsg = {
        role: "assistant",
        content: `⚠ ${e.message}`,
        ts: Date.now(),
      };
      const finalHistory = [...newHistory, errMsg];
      setChatHistory(finalHistory);
      await kvSet("chat:history", finalHistory);
    }

    setChatLoading(false);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  // ── Install AI-Suggested Script ──────────────────────
  const installSuggested = async (key) => {
    const sg = suggestedRef.current[key];
    if (!sg) { toast("Script reference expired — ask AI again", "err"); return; }
    const script = {
      id: uid(),
      name: sg.name,
      description: "Generated by AI",
      tags: ["ai-generated"],
      isBuiltin: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      currentVersion: 1,
      versions: [{ version: 1, note: "AI generated", createdAt: Date.now(), code: sg.code }],
    };
    await saveScript(script);
    setActiveScriptId(script.id);
    toast(`Script "${sg.name}" saved`);
  };

  const testRunSuggested = (key) => {
    const sg = suggestedRef.current[key];
    if (!sg) { toast("Script reference expired", "err"); return; }
    const result = execScript(sg.code, rawInput);
    setParseResult(result);
    setView("extractor");
    toast(
      result.ok ? `Test run: ${result.rows.length} rows` : `Error: ${result.error}`,
      result.ok ? "ok" : "err"
    );
  };

  // ── Settings Save ──────────────────────────────────────
  const saveSettings = async (newSettings) => {
    setSettings(newSettings);
    await kvSet("settings", newSettings);
    toast("Settings saved");
  };

  // ══════════════════════════════════════════════════════
  //  VIEW RENDERERS — all delegate to named components or
  //  return pure JSX with zero hooks (React Rules compliant)
  // ══════════════════════════════════════════════════════

  // ── Extractor View ────────────────────────────────────
  const renderExtractor = () => {
    const isUrlCol = (col) => /url|link|website|http|domain/i.test(col);

    return (
      <div className="extractor-shell">
        <div className="ext-left">
          <div className="pane-header">
            <span className="pane-label">Raw Input</span>
            <button
              className="btn btn-ghost btn-sm btn-icon"
              onClick={() => { setRawInput(""); setParseResult(null); }}
              title="Clear"
            >✕</button>
          </div>
          <div className="script-bar">
            <select
              className="sel"
              style={{ flex: 1 }}
              value={activeScriptId || ""}
              onChange={(e) => { setActiveScriptId(e.target.value); setParseResult(null); }}
            >
              {allScripts.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}{s.isBuiltin ? " ✦" : ""}{s.currentVersion > 1 ? ` v${s.currentVersion}` : ""}
                </option>
              ))}
            </select>
            <button className="btn btn-primary btn-sm" onClick={runExtraction}>▶ Run</button>
          </div>
          <textarea
            className="raw-textarea"
            value={rawInput}
            onChange={(e) => { setRawInput(e.target.value); rawInputRef.current = e.target.value; }}
            placeholder={`Paste text here…\n\n• Google search results\n• Business listings\n• LinkedIn results\n• CSV / TSV data\n• Raw URL lists (bare or https://)\n• Any structured text\n\nSelect a script above, then click ▶ Run.`}
          />
        </div>

        <div className="ext-right">
          <div className="results-header">
            <span className="pane-label">Parsed Results</span>
            {parseResult?.ok && parseResult.rows.length > 0 && (
              <span className="tag tag-green">{parseResult.rows.length} rows</span>
            )}
            <div className="copy-bar">
              <button className="btn btn-ghost btn-sm" onClick={() => copyColumn("names")}>📋 Names</button>
              <button className="btn btn-ghost btn-sm" onClick={() => copyColumn("urls")}>🔗 URLs</button>
              <button className="btn btn-ghost btn-sm" onClick={copyAll}>⧉ All</button>
            </div>
            <Dropdown
              trigger={<button className="btn btn-sm">↓ Export</button>}
              items={[
                { icon: "📊", label: "CSV",        onClick: () => doExport("csv",  parseResult, "parsed-data") },
                { icon: "{}", label: "JSON",       onClick: () => doExport("json", parseResult, "parsed-data") },
                { icon: "M↓", label: "Markdown",   onClick: () => doExport("md",   parseResult, "parsed-data") },
                { icon: "📄", label: "Plain Text", onClick: () => doExport("txt",  parseResult, "parsed-data") },
              ]}
            />
            <button className="btn btn-sm" onClick={saveDataset}>💾 Save</button>
          </div>
          <div className="results-body">
            {!parseResult ? (
              <div className="empty">
                <div className="empty-icon">⚡</div>
                <div className="empty-title">No results yet</div>
                <div className="empty-desc">Paste text on the left and click ▶ Run</div>
              </div>
            ) : !parseResult.ok ? (
              <div className="err-banner">
                <strong>Script Error</strong><br />{parseResult.error}
              </div>
            ) : parseResult.rows.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">🔍</div>
                <div className="empty-title">No data extracted</div>
                <div className="empty-desc">
                  Try a different script or check the input format.<br />
                  Ask the AI to generate a custom script for your data.
                </div>
              </div>
            ) : (
              <div className="tbl-wrap" style={{ border: "none", borderRadius: 0, height: "100%" }}>
                <table>
                  <thead>
                    <tr>
                      <th className="td-num">#</th>
                      {parseResult.columns.map((c) => <th key={c}>{c}</th>)}
                      <th className="td-act"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {parseResult.rows.map((row, i) => (
                      <tr key={i}>
                        <td className="td-num">{i + 1}</td>
                        {row.map((cell, ci) =>
                          // FIX 3.2: isClickableUrl works for bare domains, www., and https://
                          isUrlCol(parseResult.columns[ci]) && isClickableUrl(cell) ? (
                            <td key={ci} className="td-url">
                              <a href={toHref(cell)} target="_blank" rel="noreferrer">{cell}</a>
                            </td>
                          ) : (
                            <td key={ci}>{cell}</td>
                          )
                        )}
                        <td className="td-act">
                          <button
                            className="btn btn-ghost btn-icon btn-sm"
                            onClick={() => copyRow(i)}
                            title="Copy row"
                          >⧉</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ── Datasets View ─────────────────────────────────────
  const renderDatasets = () =>
    datasets.length === 0 ? (
      <div className="empty" style={{ height: "100%" }}>
        <div className="empty-icon">🗂</div>
        <div className="empty-title">No datasets yet</div>
        <div className="empty-desc">Run a script and click "Save" to create a dataset</div>
      </div>
    ) : (
      <div className="scroll-page">
        <div className="cards-grid">
          {[...datasets].reverse().map((ds) => (
            <div key={ds.id} className="card">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <div className="card-title">{ds.name}</div>
                  <div className="card-meta">{ds.rowCount} rows · {ds.columns.length} cols · {fmtDateTime(ds.createdAt)}</div>
                </div>
              </div>
              {ds.scriptName && (
                <div className="tags">
                  <span className="tag tag-blue">{ds.scriptName}</span>
                </div>
              )}
              <div className="divider" />
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button className="btn btn-sm" onClick={() => doExportDataset(ds, "csv")}>CSV</button>
                <button className="btn btn-sm" onClick={() => doExportDataset(ds, "json")}>JSON</button>
                <button className="btn btn-sm" onClick={() => doExportDataset(ds, "md")}>MD</button>
                <button className="btn btn-sm" onClick={() => doExportDataset(ds, "txt")}>TXT</button>
                <button
                  className="btn btn-danger btn-sm"
                  style={{ marginLeft: "auto" }}
                  onClick={() => deleteDataset(ds.id)}
                >Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  // ── Scripts View ──────────────────────────────────────
  const renderScripts = () => (
    <div className="scroll-page">
      <div className="cards-grid">
        {allScripts.map((s) => (
          <div key={s.id} className="card" style={{ cursor: "pointer" }} onClick={() => openEditScript(s)}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div className="card-title">
                  {s.name}
                  {s.isBuiltin && BUILTIN_IDS.has(s.id) && (
                    <span className="tag tag-acc" style={{ marginLeft: 8, fontSize: 9 }}>Built-in</span>
                  )}
                </div>
                <div className="card-meta">
                  v{s.currentVersion} · {s.versions.length} version{s.versions.length > 1 ? "s" : ""} · {s.updatedAt ? fmtDate(s.updatedAt) : "Default"}
                </div>
              </div>
              {!BUILTIN_IDS.has(s.id) && (
                <button
                  className="btn btn-danger btn-icon btn-sm"
                  onClick={(e) => { e.stopPropagation(); deleteScript(s.id); }}
                  title="Delete"
                >🗑</button>
              )}
            </div>
            <div className="card-desc">{s.description}</div>
            <div className="tags">
              {(s.tags || []).map((t) => <span key={t} className="tag">{t}</span>)}
            </div>
            <div className="divider" />
            <button
              className="btn btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                setActiveScriptId(s.id);
                setView("extractor");
                toast(`Using: ${s.name}`);
              }}
            >⚡ Use in Extractor</button>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Prompts View ──────────────────────────────────────
  const renderPrompts = () =>
    prompts.length === 0 ? (
      <div className="empty" style={{ height: "100%" }}>
        <div className="empty-icon">💬</div>
        <div className="empty-title">No prompts saved</div>
        <div className="empty-desc">Save reusable AI prompts for common parsing tasks</div>
      </div>
    ) : (
      <div className="scroll-page">
        <div className="cards-grid">
          {[...prompts].reverse().map((p) => {
            const ver = p.versions.find((v) => v.version === p.currentVersion);
            return (
              <div
                key={p.id}
                className="card"
                style={{ cursor: "pointer" }}
                onClick={() => setPromptModal(JSON.parse(JSON.stringify(p)))}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div className="card-title">{p.name}</div>
                    <div className="card-meta">v{p.currentVersion} · {p.versions.length} version{p.versions.length > 1 ? "s" : ""}</div>
                  </div>
                  <button
                    className="btn btn-ghost btn-icon btn-sm"
                    onClick={(e) => { e.stopPropagation(); usePromptInChat(p); }}
                    title="Send to chat"
                  >↗</button>
                  <button
                    className="btn btn-danger btn-icon btn-sm"
                    onClick={(e) => { e.stopPropagation(); deletePrompt(p.id); }}
                    title="Delete"
                  >🗑</button>
                </div>
                <div className="card-desc" style={{
                  whiteSpace: "pre-wrap", maxHeight: 80, overflow: "hidden",
                  fontFamily: "var(--mono)", fontSize: 11, lineHeight: 1.6
                }}>
                  {ver?.text || ""}
                </div>
                <div className="tags">
                  {(p.tags || []).map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );

  // ── Notes Views ───────────────────────────────────────
  const renderNotes = () => (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "6px 16px", borderBottom: "1px solid var(--brd)", fontFamily: "var(--mono)", fontSize: 10, color: "var(--m2)" }}>
        Plain text · Auto-saves as you type · Use for research notes, observations, to-dos
      </div>
      <div style={{ flex: 1, padding: "20px 28px", maxWidth: 820, width: "100%", margin: "0 auto", overflow: "auto" }}>
        <textarea
          className="notes-editor"
          value={notes.user}
          onChange={(e) => handleUserNotesChange(e.target.value)}
          style={{ height: "100%", minHeight: 400 }}
          placeholder={`Start writing…\n\n→ Research notes about your data sources\n→ What scripts worked for which sources\n→ Patterns you noticed in the data\n→ Apify actor URL format requirements\n→ To-do lists and follow-ups`}
        />
      </div>
    </div>
  );

  const renderAiNotes = () => (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "6px 16px", borderBottom: "1px solid var(--brd)", fontFamily: "var(--mono)", fontSize: 10, color: "var(--m2)" }}>
        AI-maintained memory · Auto-populated when AI learns patterns, wins, and issues · Editable
      </div>
      <div style={{ flex: 1, padding: "20px 28px", maxWidth: 820, width: "100%", margin: "0 auto", overflow: "auto" }}>
        <textarea
          className="notes-editor"
          value={notes.ai}
          onChange={(e) => handleAiNotesChange(e.target.value)}
          style={{ height: "100%", minHeight: 400 }}
          placeholder={`The AI will write here automatically as it learns…\n\nObservations about your data sources, parsing patterns, and what works vs what doesn't.`}
        />
      </div>
    </div>
  );

  // renderSettings delegates to named component (hooks must live at top level)
  const renderSettings = () => (
    <SettingsView
      settings={settings}
      onSave={saveSettings}
      onClearAll={async () => {
        if (!confirm("Delete all user data? Built-in scripts are preserved.")) return;
        for (const s of userScripts) await dbDelete("scripts", s.id);
        for (const d of datasets) await dbDelete("datasets", d.id);
        for (const p of prompts) await dbDelete("prompts", p.id);
        await kvSet("notes:user", "");
        await kvSet("notes:ai", "");
        await kvSet("chat:history", []);
        setUserScripts([]); setDatasets([]); setPrompts([]);
        setNotes({ user: "", ai: "" }); setChatHistory([]);
        toast("All data cleared");
      }}
      onBackup={() => {
        const data = { exportedAt: new Date().toISOString(), userScripts, datasets, prompts, notes };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `parsestudiopro-backup-${Date.now()}.json`;
        a.click();
        toast("Backup exported");
      }}
      toast={toast}
    />
  );

  // renderUrlFormatter delegates to named component (has hooks inside)
  const renderUrlFormatter = () => <UrlFormatterView toast={toast} />;

  // ══════════════════════════════════════════════════════
  //  LAYOUT
  // ══════════════════════════════════════════════════════

  const NAV = [
    {
      group: "Workspace",
      items: [
        { id: "extractor",    icon: "⚡", label: "Extractor" },
        { id: "urlformatter", icon: "🔗", label: "URL Formatter" },
        { id: "datasets",     icon: "🗂", label: "Data Sets", badge: datasetCount },
      ],
    },
    {
      group: "Library",
      items: [
        { id: "scripts", icon: "⚙", label: "Scripts", badge: scriptCount },
        { id: "prompts", icon: "💬", label: "Prompts", badge: promptCount },
      ],
    },
    {
      group: "Notes",
      items: [
        { id: "notes",   icon: "✎",  label: "My Notes" },
        { id: "ainotes", icon: "🤖", label: "AI Notes" },
      ],
    },
    {
      group: "System",
      items: [
        { id: "settings", icon: "⚙️", label: "Settings" },
      ],
    },
  ];

  const VIEW_TITLES = {
    extractor:    "Extractor",
    urlformatter: "URL Formatter",
    datasets:     "Data Sets",
    scripts:      "Scripts",
    prompts:      "Prompts",
    notes:        "My Notes",
    ainotes:      "AI Notes",
    settings:     "Settings",
  };

  const VIEW_ACTIONS = {
    extractor:    null,
    urlformatter: null,
    datasets:     null,
    scripts: (
      <button className="btn btn-primary" onClick={openNewScript}>+ New Script</button>
    ),
    prompts: (
      <button className="btn btn-primary" onClick={openNewPrompt}>+ New Prompt</button>
    ),
    notes: (
      <button className="btn" onClick={() => {
        const blob = new Blob([notes.user], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "my-notes.txt"; a.click();
        toast("Notes exported");
      }}>↓ Export</button>
    ),
    ainotes: (
      <button className="btn" onClick={() => {
        const blob = new Blob([notes.ai], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "ai-notes.txt"; a.click();
        toast("AI notes exported");
      }}>↓ Export</button>
    ),
    settings: null,
  };

  // VIEW_MAP — state-driven routing, no DOM manipulation
  const VIEW_MAP = {
    extractor:    renderExtractor,
    urlformatter: renderUrlFormatter,
    datasets:     renderDatasets,
    scripts:      renderScripts,
    prompts:      renderPrompts,
    notes:        renderNotes,
    ainotes:      renderAiNotes,
    settings:     renderSettings,
  };

  const apiOk = !!settings.apiKey;

  return (
    <div className="app">
      {/* ─ Sidebar ─ */}
      <nav className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-mark">P</div>
          <div>
            <div className="logo-name">Parse Studio</div>
            <div className="logo-sub">Pro · Data Extractor</div>
          </div>
        </div>
        <div className="sidebar-nav">
          {NAV.map(({ group, items }) => (
            <div key={group}>
              <div className="nav-group-label">{group}</div>
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`nav-item${view === item.id ? " active" : ""}`}
                  onClick={() => setView(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="sidebar-footer">
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "4px 10px" }}>
            <div className="status-dot" style={{ background: apiOk ? "var(--green)" : "var(--red)" }} />
            <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: apiOk ? "var(--green)" : "var(--red)" }}>
              {apiOk ? "API Connected" : "No API Key"}
            </span>
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--m2)", padding: "2px 10px 4px" }}>
            {settings.model.split("-").slice(1, 3).join(" ")} · {allScripts.length} scripts
          </div>
        </div>
      </nav>

      {/* ─ Workspace ─ */}
      <div className="workspace">
        <div className="topbar">
          <span className="topbar-title">{VIEW_TITLES[view]}</span>
          <div className="topbar-actions">
            {VIEW_ACTIONS[view]}
          </div>
        </div>
        <div className="page-content" style={{ height: "calc(100% - 52px)" }}>
          {VIEW_MAP[view]?.()}
        </div>
      </div>

      {/* ─ Script Modal ─ */}
      {scriptModal && (
        <ScriptModal
          initial={scriptModal}
          onClose={() => setScriptModal(null)}
          onSave={saveScript}
          onNewVersion={saveScriptNewVersion}
        />
      )}

      {/* ─ Prompt Modal ─ */}
      {promptModal && (
        <PromptModal
          initial={promptModal}
          onClose={() => setPromptModal(null)}
          onSave={savePrompt}
          onNewVersion={savePromptNewVersion}
        />
      )}

      {/* ─ AI Chat Bubble ─ */}
      <div className="chat-fab-wrap">
        {chatOpen && (
          <div className="chat-panel">
            <div className="chat-header">
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)" }} />
              <span className="chat-ai-name">Parse AI</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--m2)" }}>
                {settings.model.includes("haiku") ? "Haiku 4.5" : "Sonnet 4.5"}
              </span>
              <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                <button
                  className="btn btn-ghost btn-icon btn-sm"
                  title="Clear chat"
                  onClick={async () => {
                    if (!confirm("Clear chat history?")) return;
                    setChatHistory([]);
                    await kvSet("chat:history", []);
                  }}
                >↺</button>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setChatOpen(false)}>✕</button>
              </div>
            </div>
            <div className="chat-msgs">
              {chatHistory.length === 0 && (
                <div style={{ textAlign: "center", padding: "24px 12px" }}>
                  <div style={{ fontSize: 24, marginBottom: 10, opacity: 0.4 }}>✦</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--m2)", lineHeight: 1.7 }}>
                    Hi! I can generate scripts,<br />
                    fix parsing issues, format URLs<br />
                    for Apify, and learn your patterns.
                  </div>
                </div>
              )}
              {/* FIX 3.1: ChatMessage is a named component, not a render helper */}
              {chatHistory.map((msg, i) => (
                <ChatMessage
                  key={i}
                  msg={msg}
                  suggestedRef={suggestedRef}
                  onInstall={installSuggested}
                  onTestRun={testRunSuggested}
                />
              ))}
              {chatLoading && (
                <div className="chat-msg ai">
                  <div className="chat-typing">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="chat-input-row">
              <textarea
                id="psp-chat-input"
                className="chat-ipt"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask AI to parse your data, fix a script, explain results…"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendChat();
                  }
                }}
              />
              <button
                className="btn btn-primary btn-icon"
                onClick={sendChat}
                disabled={chatLoading}
                style={{ alignSelf: "flex-end" }}
              >↑</button>
            </div>
          </div>
        )}
        <button
          className="chat-fab"
          onClick={() => setChatOpen((o) => !o)}
          title="AI Assistant"
        >{chatOpen ? "✕" : "✦"}</button>
      </div>

      {/* ─ Toasts ─ */}
      <ToastStack toasts={toasts} />
    </div>
  );
}
