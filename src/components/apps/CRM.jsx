import {
  useState, useReducer, useEffect, useRef, useCallback, useMemo,
  memo, createContext, useContext
} from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

// ─────────────────────────────────────────────────────────────────────────────
// FONTS & GLOBAL STYLES (injected once, module-level guard)
// ─────────────────────────────────────────────────────────────────────────────
if (!document.getElementById("crm-styles")) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";
  document.head.appendChild(link);

  const s = document.createElement("style");
  s.id = "crm-styles";
  s.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --font-display: 'Cormorant Garamond', serif;
      --font-body: 'DM Sans', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
      /* Dark theme */
      --d-bg: #0d0d11;
      --d-sidebar: #131318;
      --d-card: #1a1a22;
      --d-card-hover: #20202a;
      --d-border: #2a2a38;
      --d-text: #e8e6f0;
      --d-text-muted: #7a7890;
      --d-text-dim: #4a4860;
      --d-accent: #e07050;
      --d-accent-hover: #ea8060;
      --d-accent2: #4ecdc4;
      --d-accent3: #7c6fff;
      /* Light theme */
      --l-bg: #f5f4f0;
      --l-sidebar: #eceae4;
      --l-card: #ffffff;
      --l-card-hover: #f9f8f5;
      --l-border: #e0ddd6;
      --l-text: #1a1820;
      --l-text-muted: #7a7060;
      --l-text-dim: #bbb8b0;
      --l-accent: #c8472a;
      --l-accent-hover: #d0522e;
      --l-accent2: #299e96;
      --l-accent3: #5d4ef0;
    }
    body, #root { height: 100%; }
    .crm-root {
      display: flex; height: 100vh; overflow: hidden;
      font-family: var(--font-body);
      font-size: 14px; line-height: 1.5;
      transition: background 0.2s, color 0.2s;
    }
    .crm-root.dark {
      background: var(--d-bg); color: var(--d-text);
      --bg: var(--d-bg); --sidebar-bg: var(--d-sidebar);
      --card: var(--d-card); --card-hover: var(--d-card-hover);
      --border: var(--d-border); --text: var(--d-text);
      --muted: var(--d-text-muted); --dim: var(--d-text-dim);
      --accent: var(--d-accent); --accent-h: var(--d-accent-hover);
      --accent2: var(--d-accent2); --accent3: var(--d-accent3);
    }
    .crm-root.light {
      background: var(--l-bg); color: var(--l-text);
      --bg: var(--l-bg); --sidebar-bg: var(--l-sidebar);
      --card: var(--l-card); --card-hover: var(--l-card-hover);
      --border: var(--l-border); --text: var(--l-text);
      --muted: var(--l-text-muted); --dim: var(--l-text-dim);
      --accent: var(--l-accent); --accent-h: var(--l-accent-hover);
      --accent2: var(--l-accent2); --accent3: var(--l-accent3);
    }
    /* SIDEBAR */
    .sidebar {
      width: 240px; min-width: 240px;
      background: var(--sidebar-bg);
      border-right: 1px solid var(--border);
      display: flex; flex-direction: column;
      transition: width 0.25s cubic-bezier(.4,0,.2,1), min-width 0.25s;
      overflow: hidden; z-index: 10;
    }
    .sidebar.collapsed { width: 52px; min-width: 52px; }
    .sidebar-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 12px 12px;
      border-bottom: 1px solid var(--border);
      min-height: 56px;
    }
    .sidebar-logo {
      font-family: var(--font-display); font-size: 18px; font-weight: 700;
      color: var(--accent); letter-spacing: -0.02em; white-space: nowrap;
      overflow: hidden; transition: opacity 0.2s;
    }
    .sidebar.collapsed .sidebar-logo { opacity: 0; pointer-events: none; }
    .sidebar-toggle {
      background: none; border: none; cursor: pointer;
      color: var(--muted); padding: 4px; border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      transition: color 0.15s, background 0.15s; flex-shrink: 0;
    }
    .sidebar-toggle:hover { color: var(--text); background: var(--border); }
    .sidebar-nav { flex: 1; overflow-y: auto; padding: 8px 0; }
    .sidebar-nav::-webkit-scrollbar { width: 4px; }
    .sidebar-nav::-webkit-scrollbar-track { background: transparent; }
    .sidebar-nav::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
    .nav-item {
      display: flex; align-items: center; gap: 10px;
      padding: 8px 12px; cursor: pointer; border-radius: 0;
      transition: background 0.15s; white-space: nowrap; overflow: hidden;
      color: var(--muted); font-size: 13.5px; font-weight: 400;
      position: relative; user-select: none;
    }
    .nav-item:hover { background: rgba(128,128,160,0.08); color: var(--text); }
    .nav-item.active { color: var(--accent); background: rgba(224,112,80,0.08); }
    .crm-root.light .nav-item.active { background: rgba(200,71,42,0.08); }
    .nav-icon {
      width: 20px; height: 20px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 15px;
    }
    .nav-label { transition: opacity 0.2s; }
    .sidebar.collapsed .nav-label { opacity: 0; pointer-events: none; }
    .nav-item.active .nav-icon { filter: none; }
    /* MAIN */
    .main-content {
      flex: 1; display: flex; flex-direction: column; overflow: hidden;
    }
    .topbar {
      height: 52px; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 20px; background: var(--bg); flex-shrink: 0;
    }
    .topbar-title {
      font-family: var(--font-display); font-size: 20px; font-weight: 600;
      letter-spacing: -0.02em;
    }
    .topbar-actions { display: flex; align-items: center; gap: 10px; }
    .page-area {
      flex: 1; overflow-y: auto; padding: 24px;
      scroll-behavior: smooth;
    }
    .page-area::-webkit-scrollbar { width: 6px; }
    .page-area::-webkit-scrollbar-track { background: transparent; }
    .page-area::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
    /* LAYOUT WRAPPER (main + AI) */
    .app-body { display: flex; flex: 1; overflow: hidden; }
    /* CARDS */
    .card {
      background: var(--card); border: 1px solid var(--border);
      border-radius: 10px; padding: 16px;
    }
    .card-sm { padding: 12px; border-radius: 8px; }
    /* BUTTONS */
    .btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 7px 14px; border-radius: 7px; border: none; cursor: pointer;
      font-family: var(--font-body); font-size: 13px; font-weight: 500;
      transition: all 0.15s; white-space: nowrap;
    }
    .btn-primary {
      background: var(--accent); color: #fff;
    }
    .btn-primary:hover { background: var(--accent-h); transform: translateY(-1px); }
    .btn-ghost {
      background: transparent; color: var(--muted);
      border: 1px solid var(--border);
    }
    .btn-ghost:hover { background: var(--card-hover); color: var(--text); }
    .btn-danger { background: #dc3545; color: #fff; }
    .btn-danger:hover { background: #c82333; }
    .btn-sm { padding: 5px 10px; font-size: 12px; }
    /* INPUTS */
    .input, .textarea, .select {
      width: 100%; padding: 8px 12px;
      background: var(--bg); border: 1px solid var(--border);
      border-radius: 7px; color: var(--text); font-family: var(--font-body);
      font-size: 13.5px; outline: none; transition: border-color 0.15s;
    }
    .input:focus, .textarea:focus, .select:focus { border-color: var(--accent); }
    .textarea { resize: vertical; min-height: 80px; }
    .select { cursor: pointer; }
    .label {
      display: block; font-size: 11.5px; font-weight: 500;
      color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em;
      margin-bottom: 5px;
    }
    .field { margin-bottom: 14px; }
    /* GRID */
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
    /* BADGE */
    .badge {
      display: inline-flex; align-items: center;
      padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 500;
    }
    .badge-orange { background: rgba(224,112,80,0.15); color: var(--accent); }
    .badge-teal { background: rgba(78,205,196,0.15); color: var(--accent2); }
    .badge-purple { background: rgba(124,111,255,0.15); color: var(--accent3); }
    .badge-green { background: rgba(52,211,153,0.15); color: #34d399; }
    .badge-red { background: rgba(248,113,113,0.15); color: #f87171; }
    .badge-gray { background: rgba(128,128,160,0.12); color: var(--muted); }
    /* TABLE */
    .table-wrap { overflow-x: auto; border-radius: 10px; border: 1px solid var(--border); }
    table { width: 100%; border-collapse: collapse; }
    th { padding: 10px 14px; text-align: left; font-size: 11.5px; font-weight: 600;
      color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em;
      border-bottom: 1px solid var(--border); background: var(--card); }
    td { padding: 11px 14px; border-bottom: 1px solid var(--border);
      font-size: 13.5px; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: rgba(128,128,160,0.04); }
    /* MODAL */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.6);
      backdrop-filter: blur(4px); z-index: 100;
      display: flex; align-items: center; justify-content: center;
    }
    .modal {
      background: var(--card); border: 1px solid var(--border);
      border-radius: 14px; padding: 24px; width: 520px; max-width: 95vw;
      max-height: 90vh; overflow-y: auto;
    }
    .modal-title {
      font-family: var(--font-display); font-size: 20px; font-weight: 600;
      margin-bottom: 18px;
    }
    /* KANBAN */
    .kanban-board { display: flex; gap: 14px; overflow-x: auto; padding-bottom: 8px; min-height: 600px; }
    .kanban-col {
      min-width: 220px; width: 220px; flex-shrink: 0;
      background: var(--card); border: 1px solid var(--border);
      border-radius: 10px; padding: 12px;
      display: flex; flex-direction: column; gap: 0;
    }
    .kanban-col-title {
      font-size: 12px; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.07em; color: var(--muted); margin-bottom: 10px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .kanban-card {
      background: var(--bg); border: 1px solid var(--border);
      border-radius: 8px; padding: 10px 12px; margin-bottom: 8px;
      cursor: grab; transition: box-shadow 0.15s, transform 0.15s;
    }
    .kanban-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.2); transform: translateY(-2px); }
    .kanban-card.dragging { opacity: 0.5; cursor: grabbing; }
    .kanban-drop-zone { min-height: 40px; border-radius: 8px; transition: background 0.15s; }
    .kanban-drop-zone.drag-over { background: rgba(224,112,80,0.08); border: 1px dashed var(--accent); }
    /* AI PANEL */
    .ai-panel {
      width: 340px; min-width: 340px; max-width: 340px;
      border-left: 1px solid var(--border);
      background: var(--sidebar-bg);
      display: flex; flex-direction: column; overflow: hidden;
      transition: width 0.25s, min-width 0.25s;
    }
    .ai-panel.collapsed { width: 0; min-width: 0; overflow: hidden; border: none; }
    .ai-header {
      padding: 12px 14px; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; gap: 8px; flex-shrink: 0;
    }
    .ai-messages {
      flex: 1; overflow-y: auto; padding: 12px;
      display: flex; flex-direction: column; gap: 10px;
    }
    .ai-messages::-webkit-scrollbar { width: 4px; }
    .ai-messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
    .msg { padding: 10px 12px; border-radius: 10px; font-size: 13px; line-height: 1.55; max-width: 95%; }
    .msg-user { background: var(--accent); color: #fff; align-self: flex-end; border-radius: 10px 10px 2px 10px; }
    .msg-ai { background: var(--card); border: 1px solid var(--border); align-self: flex-start; border-radius: 10px 10px 10px 2px; }
    .msg-system { background: rgba(124,111,255,0.1); color: var(--accent3); font-size: 11.5px; align-self: center; border-radius: 20px; padding: 4px 12px; }
    .ai-input-area {
      padding: 10px 12px; border-top: 1px solid var(--border); flex-shrink: 0;
    }
    .ai-input-row { display: flex; gap: 8px; align-items: flex-end; }
    .ai-textarea {
      flex: 1; resize: none; min-height: 38px; max-height: 120px;
      padding: 8px 10px; background: var(--bg);
      border: 1px solid var(--border); border-radius: 8px;
      color: var(--text); font-family: var(--font-body); font-size: 13px;
      outline: none; transition: border-color 0.15s;
    }
    .ai-textarea:focus { border-color: var(--accent); }
    .ai-send {
      background: var(--accent); color: #fff; border: none;
      border-radius: 8px; padding: 8px 12px; cursor: pointer;
      font-size: 14px; transition: all 0.15s; flex-shrink: 0; height: 38px;
    }
    .ai-send:hover { background: var(--accent-h); }
    .ai-send:disabled { opacity: 0.5; cursor: not-allowed; }
    /* MISC */
    .section-title {
      font-family: var(--font-display); font-size: 22px; font-weight: 600;
      letter-spacing: -0.02em; margin-bottom: 18px;
    }
    .sub-title {
      font-size: 12px; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.07em; color: var(--muted); margin-bottom: 10px;
    }
    .stat-card {
      background: var(--card); border: 1px solid var(--border);
      border-radius: 10px; padding: 18px;
    }
    .stat-value {
      font-family: var(--font-display); font-size: 32px; font-weight: 700;
      line-height: 1; margin-bottom: 4px;
    }
    .stat-label { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .stat-delta { font-size: 12px; margin-top: 6px; }
    .delta-up { color: #34d399; }
    .delta-down { color: #f87171; }
    .divider { border: none; border-top: 1px solid var(--border); margin: 16px 0; }
    .empty-state {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 60px 20px; color: var(--muted); text-align: center; gap: 12px;
    }
    .empty-icon { font-size: 40px; opacity: 0.4; }
    .search-bar {
      display: flex; align-items: center; gap: 8px;
      background: var(--card); border: 1px solid var(--border);
      border-radius: 8px; padding: 7px 12px; width: 240px;
    }
    .search-bar input {
      background: none; border: none; outline: none; color: var(--text);
      font-family: var(--font-body); font-size: 13px; width: 100%;
    }
    .search-bar input::placeholder { color: var(--dim); }
    .tag {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 2px 8px; border-radius: 20px; font-size: 11px;
      background: rgba(128,128,160,0.12); color: var(--muted);
    }
    /* TOGGLE SWITCH */
    .toggle-wrap { display: flex; align-items: center; gap: 8px; cursor: pointer; }
    .toggle {
      width: 38px; height: 20px; background: var(--border);
      border-radius: 20px; position: relative; transition: background 0.2s;
    }
    .toggle.on { background: var(--accent); }
    .toggle::after {
      content: ''; position: absolute; top: 2px; left: 2px;
      width: 16px; height: 16px; background: #fff; border-radius: 50%;
      transition: left 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.3);
    }
    .toggle.on::after { left: 20px; }
    /* CALENDAR */
    .cal-grid { display: grid; grid-template-columns: repeat(7,1fr); gap: 1px; }
    .cal-day {
      aspect-ratio: 1; display: flex; flex-direction: column;
      align-items: flex-start; padding: 6px; border-radius: 8px;
      cursor: pointer; transition: background 0.15s; font-size: 13px;
      position: relative;
    }
    .cal-day:hover { background: var(--card-hover); }
    .cal-day.today { background: rgba(224,112,80,0.1); }
    .cal-day.today .day-num { color: var(--accent); font-weight: 700; }
    .cal-day.other-month .day-num { color: var(--dim); }
    .cal-day.selected { background: rgba(224,112,80,0.15); outline: 1px solid var(--accent); }
    .day-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); margin-top: 2px; }
    /* PIPELINE VIZ */
    .pipeline-funnel { display: flex; flex-direction: column; align-items: center; gap: 3px; }
    .funnel-stage {
      display: flex; align-items: center; justify-content: space-between;
      border-radius: 4px; padding: 8px 16px; color: #fff; font-size: 12px;
      font-weight: 500; transition: transform 0.15s;
    }
    .funnel-stage:hover { transform: scaleX(1.01); }
    /* TOOLTIP */
    [data-tooltip] { position: relative; }
    [data-tooltip]:hover::after {
      content: attr(data-tooltip);
      position: absolute; bottom: calc(100% + 6px); left: 50%;
      transform: translateX(-50%);
      background: var(--card); color: var(--text); border: 1px solid var(--border);
      padding: 4px 8px; border-radius: 6px; font-size: 11.5px;
      white-space: nowrap; z-index: 200; pointer-events: none;
    }
    /* LOADING */
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    .loading { animation: pulse 1.2s ease-in-out infinite; }
    @keyframes spin { to{transform:rotate(360deg)} }
    .spin { animation: spin 0.8s linear infinite; display: inline-block; }
    /* SCROLLBAR */
    .page-area::-webkit-scrollbar-track,
    .ai-messages::-webkit-scrollbar-track { background: transparent; }
    /* STRATEGY */
    .pitch-block {
      background: var(--card); border: 1px solid var(--border);
      border-radius: 10px; padding: 16px; margin-bottom: 12px;
    }
    .pitch-block-title {
      font-size: 11px; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.08em; color: var(--accent); margin-bottom: 8px;
    }
    /* Responsive */
    @media (max-width: 900px) {
      .ai-panel { display: none; }
      .grid-4 { grid-template-columns: 1fr 1fr; }
      .grid-3 { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 600px) {
      .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
    }
  `;
  document.head.appendChild(s);
}

// ─────────────────────────────────────────────────────────────────────────────
// INDEXEDDB LAYER
// ─────────────────────────────────────────────────────────────────────────────
const DB_NAME = "VistacrDB";
const DB_VER = 2;
const STORES = ["contacts","leads","deals","proposals","events","notes","strategies","chats","journal"];

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      STORES.forEach(s => {
        if (!db.objectStoreNames.contains(s)) {
          db.createObjectStore(s, { keyPath: "id" });
        }
      });
    };
    req.onsuccess = e => resolve(e.target.result);
    req.onerror = e => reject(e.target.error);
  });
}

async function dbGetAll(store) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(store, "readonly");
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}

async function dbPut(store, item) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(store, "readwrite");
    const req = tx.objectStore(store).put(item);
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}

async function dbDelete(store, id) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(store, "readwrite");
    const req = tx.objectStore(store).delete(id);
    req.onsuccess = () => res();
    req.onerror = () => rej(req.error);
  });
}

async function dbClear(store) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(store, "readwrite");
    const req = tx.objectStore(store).clear();
    req.onsuccess = () => res();
    req.onerror = () => rej(req.error);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// ID GENERATION
// ─────────────────────────────────────────────────────────────────────────────
let idCounter = 1000;
const genId = (prefix = "item") => `${prefix}_${++idCounter}_${Math.random().toString(36).slice(2,7)}`;

// ─────────────────────────────────────────────────────────────────────────────
// INITIAL DATA
// ─────────────────────────────────────────────────────────────────────────────
const PIPELINE_STAGES = ["Prospect","Qualified","Proposal","Negotiation","Closed Won","Closed Lost"];
const STAGE_COLORS = {
  "Prospect":"#6366f1","Qualified":"#8b5cf6","Proposal":"#e07050",
  "Negotiation":"#f59e0b","Closed Won":"#10b981","Closed Lost":"#6b7280"
};

const SEED_CONTACTS = [
  { id:"c1", name:"Sarah Chen", email:"sarah@techwave.io", phone:"415-555-0142", company:"TechWave", title:"VP Engineering", tags:["hot","enterprise"], notes:"Met at SaaStr 2024", createdAt:"2025-01-10" },
  { id:"c2", name:"Marcus Rivera", email:"m.rivera@growthlabs.com", phone:"628-555-0287", company:"GrowthLabs", title:"CEO", tags:["warm"], notes:"Intro via LinkedIn", createdAt:"2025-01-15" },
  { id:"c3", name:"Priya Patel", email:"priya@scalestartup.co", phone:"310-555-0394", company:"ScaleStartup", title:"Head of Growth", tags:["warm","series-b"], notes:"Webinar attendee", createdAt:"2025-01-22" },
  { id:"c4", name:"Jordan Walsh", email:"jordan@nextsys.io", phone:"512-555-0451", company:"NextSys", title:"CTO", tags:["cold"], notes:"Cold outreach", createdAt:"2025-02-03" },
];

const SEED_LEADS = [
  { id:"l1", name:"DataForge Inc", email:"sales@dataforge.io", phone:"415-555-0101", company:"DataForge", website:"https://dataforge.io", source:"Inbound", status:"New", score:85, notes:"Requested demo", createdAt:"2025-02-01" },
  { id:"l2", name:"Cloudera Systems", email:"ops@cloudera.sys", phone:"650-555-0202", company:"Cloudera Systems", website:"", source:"Referral", status:"Contacted", score:72, notes:"Referred by Sarah Chen", createdAt:"2025-02-05" },
  { id:"l3", name:"Orbit Analytics", email:"hello@orbitanalytics.com", phone:"310-555-0303", company:"Orbit Analytics", website:"https://orbitanalytics.com", source:"Cold Outreach", status:"Qualified", score:91, notes:"Strong budget signals", createdAt:"2025-02-08" },
];

const SEED_DEALS = [
  { id:"d1", title:"TechWave – Enterprise Suite", contactId:"c1", value:85000, stage:"Proposal", probability:70, expectedClose:"2025-04-30", notes:"Waiting on legal review" },
  { id:"d2", title:"GrowthLabs – Starter Plan", contactId:"c2", value:12000, stage:"Negotiation", probability:85, expectedClose:"2025-03-31", notes:"Pricing discussion ongoing" },
  { id:"d3", title:"ScaleStartup – Growth Tier", contactId:"c3", value:36000, stage:"Qualified", probability:55, expectedClose:"2025-05-15", notes:"Technical eval in progress" },
  { id:"d4", title:"NextSys – Pilot Project", contactId:"c4", value:8500, stage:"Prospect", probability:30, expectedClose:"2025-06-01", notes:"Initial contact made" },
  { id:"d5", title:"DataForge – API Integration", contactId:"c1", value:24000, stage:"Closed Won", probability:100, expectedClose:"2025-02-15", notes:"Contract signed!" },
];

const SEED_PROPOSALS = [
  { id:"p1", title:"TechWave Enterprise Proposal", contactId:"c1", dealId:"d1", status:"Sent", value:85000, content:"## Executive Summary\n\nWe propose a comprehensive enterprise solution...\n\n## Scope of Work\n- Platform setup and configuration\n- Team onboarding (up to 50 seats)\n- Priority support SLA\n\n## Investment\n$85,000/year\n\n## Next Steps\n1. Legal review\n2. Security questionnaire\n3. Contract signing", createdAt:"2025-02-20" },
];

const SEED_STRATEGIES = [
  { id:"s1", title:"Q2 2025 Enterprise Push", targetSegment:"Series B+ SaaS companies", icp:"VP/C-suite engineering leaders at 50-500 person SaaS companies", painPoints:"Scaling infrastructure, reducing engineering overhead, improving deployment velocity", valueProps:"20% faster deployments, 40% cost reduction on infrastructure", objections:"Price concerns → ROI calculator, Security → SOC2 compliance, Integration → API-first approach", talkingPoints:"Lead with cost savings, follow with velocity metrics, close with success stories", createdAt:"2025-01-15" },
];

// ─────────────────────────────────────────────────────────────────────────────
// APP STATE / REDUCER
// ─────────────────────────────────────────────────────────────────────────────
const initialState = {
  theme: "dark",
  sidebarCollapsed: false,
  aiPanelOpen: true,
  activePage: "overview",
  contacts: [],
  leads: [],
  deals: [],
  proposals: [],
  events: [],
  notes: [],          // calendar notepad notes
  strategies: [],
  chats: [],          // [{id, name, messages:[]}]
  activeChatId: null,
  journal: [],        // AI journal entries
  settings: {
    apiKey: "",
    userName: "Sales Pro",
    companyName: "Vistacr",
    currency: "USD",
  },
  seeded: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "LOAD_ALL": return { ...state, ...action.payload };
    case "SET_THEME": return { ...state, theme: action.payload };
    case "SET_PAGE": return { ...state, activePage: action.payload };
    case "TOGGLE_SIDEBAR": return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case "TOGGLE_AI": return { ...state, aiPanelOpen: !state.aiPanelOpen };
    // CONTACTS
    case "ADD_CONTACT": return { ...state, contacts: [...state.contacts, action.payload] };
    case "UPDATE_CONTACT": return { ...state, contacts: state.contacts.map(c => c.id === action.payload.id ? action.payload : c) };
    case "DELETE_CONTACT": return { ...state, contacts: state.contacts.filter(c => c.id !== action.payload) };
    // LEADS
    case "ADD_LEAD": return { ...state, leads: [...state.leads, action.payload] };
    case "UPDATE_LEAD": return { ...state, leads: state.leads.map(l => l.id === action.payload.id ? action.payload : l) };
    case "DELETE_LEAD": return { ...state, leads: state.leads.filter(l => l.id !== action.payload) };
    case "ADD_LEADS_BULK": return { ...state, leads: [...state.leads, ...action.payload] };
    // DEALS
    case "ADD_DEAL": return { ...state, deals: [...state.deals, action.payload] };
    case "UPDATE_DEAL": return { ...state, deals: state.deals.map(d => d.id === action.payload.id ? action.payload : d) };
    case "DELETE_DEAL": return { ...state, deals: state.deals.filter(d => d.id !== action.payload) };
    case "MOVE_DEAL": {
      const deal = state.deals.find(d => d.id === action.payload.id);
      if (!deal) return state;
      const updated = { ...deal, stage: action.payload.stage };
      return { ...state, deals: state.deals.map(d => d.id === updated.id ? updated : d) };
    }
    // PROPOSALS
    case "ADD_PROPOSAL": return { ...state, proposals: [...state.proposals, action.payload] };
    case "UPDATE_PROPOSAL": return { ...state, proposals: state.proposals.map(p => p.id === action.payload.id ? action.payload : p) };
    case "DELETE_PROPOSAL": return { ...state, proposals: state.proposals.filter(p => p.id !== action.payload) };
    // EVENTS
    case "ADD_EVENT": return { ...state, events: [...state.events, action.payload] };
    case "UPDATE_EVENT": return { ...state, events: state.events.map(e => e.id === action.payload.id ? action.payload : e) };
    case "DELETE_EVENT": return { ...state, events: state.events.filter(e => e.id !== action.payload) };
    // NOTES
    case "ADD_NOTE": return { ...state, notes: [...state.notes, action.payload] };
    case "UPDATE_NOTE": return { ...state, notes: state.notes.map(n => n.id === action.payload.id ? action.payload : n) };
    case "DELETE_NOTE": return { ...state, notes: state.notes.filter(n => n.id !== action.payload) };
    // STRATEGIES
    case "ADD_STRATEGY": return { ...state, strategies: [...state.strategies, action.payload] };
    case "UPDATE_STRATEGY": return { ...state, strategies: state.strategies.map(s => s.id === action.payload.id ? action.payload : s) };
    case "DELETE_STRATEGY": return { ...state, strategies: state.strategies.filter(s => s.id !== action.payload) };
    // CHATS
    case "NEW_CHAT": {
      const chat = { id: genId("chat"), name: "New Chat", messages: [] };
      return { ...state, chats: [chat, ...state.chats], activeChatId: chat.id };
    }
    case "NEW_CHAT_WITH_ID": {
      const chat = action.payload;
      return { ...state, chats: [chat, ...state.chats], activeChatId: chat.id };
    }
    case "SET_ACTIVE_CHAT": return { ...state, activeChatId: action.payload };
    case "ADD_MESSAGE": {
      const chats = state.chats.map(c =>
        c.id === action.payload.chatId
          ? { ...c, messages: [...c.messages, action.payload.message],
              name: c.messages.length === 0 ? action.payload.message.content.slice(0, 40) : c.name }
          : c
      );
      return { ...state, chats };
    }
    case "RENAME_CHAT": {
      return { ...state, chats: state.chats.map(c => c.id === action.payload.id ? { ...c, name: action.payload.name } : c) };
    }
    case "DELETE_CHAT": {
      const chats = state.chats.filter(c => c.id !== action.payload);
      return { ...state, chats, activeChatId: chats[0]?.id || null };
    }
    // JOURNAL
    case "ADD_JOURNAL": return { ...state, journal: [...state.journal, action.payload] };
    case "UPDATE_JOURNAL": return { ...state, journal: state.journal.map(j => j.id === action.payload.id ? action.payload : j) };
    case "DELETE_JOURNAL": return { ...state, journal: state.journal.filter(j => j.id !== action.payload) };
    // SETTINGS
    case "UPDATE_SETTINGS": return { ...state, settings: { ...state.settings, ...action.payload } };
    default: return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// APP CONTEXT
// ─────────────────────────────────────────────────────────────────────────────
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

// ─────────────────────────────────────────────────────────────────────────────
// ICONS (inline SVG)
// ─────────────────────────────────────────────────────────────────────────────
const Icon = memo(({ name, size = 16 }) => {
  const paths = {
    overview: ["M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"],
    contacts: ["M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"],
    leads: ["M13 10V3L4 14h7v7l9-11h-7z"],
    pipeline: ["M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"],
    proposals: ["M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"],
    reports: ["M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"],
    calendar: ["M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"],
    journal: ["M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"],
    strategy: ["M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"],
    settings: ["M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z", "M15 12a3 3 0 11-6 0 3 3 0 016 0z"],
    ai: ["M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-1"],
    plus: ["M12 4v16m8-8H4"],
    edit: ["M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"],
    trash: ["M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"],
    sun: ["M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"],
    moon: ["M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"],
    menu: ["M4 6h16M4 12h16M4 18h16"],
    close: ["M6 18L18 6M6 6l12 12"],
    chevRight: ["M9 5l7 7-7 7"],
    chevLeft: ["M15 19l-7-7 7-7"],
    chevDown: ["M19 9l-7 7-7-7"],
    search: ["M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"],
    send: ["M12 19l9 2-9-18-9 18 9-2zm0 0v-8"],
    download: ["M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"],
    upload: ["M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"],
    chat: ["M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"],
    star: ["M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"],
    copy: ["M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"],
    refresh: ["M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"],
  };
  const dArr = paths[name] || paths.overview;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {dArr.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const Btn = memo(({ children, variant = "ghost", size = "", onClick, style, disabled, title }) => (
  <button
    className={`btn btn-${variant}${size ? " btn-" + size : ""}`}
    onClick={onClick} disabled={disabled} style={style} title={title}
  >{children}</button>
));

const Modal = memo(({ title, onClose, children }) => (
  <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="modal">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div className="modal-title">{title}</div>
        <Btn onClick={onClose}><Icon name="close" size={16} /></Btn>
      </div>
      {children}
    </div>
  </div>
));

const Fld = memo(({ label, children }) => (
  <div className="field">
    {label && <label className="label">{label}</label>}
    {children}
  </div>
));

const EmptyState = memo(({ icon, text, sub }) => (
  <div className="empty-state">
    <div className="empty-icon">{icon}</div>
    <div style={{ fontSize: 15, fontWeight: 500 }}>{text}</div>
    {sub && <div style={{ fontSize: 13, maxWidth: 280 }}>{sub}</div>}
  </div>
));

function fmt$(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n || 0);
}
function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "overview",   label: "Overview",   icon: "overview" },
  { id: "contacts",   label: "Contacts",   icon: "contacts" },
  { id: "leads",      label: "Leads",      icon: "leads" },
  { id: "pipeline",   label: "Pipeline",   icon: "pipeline" },
  { id: "proposals",  label: "Proposals",  icon: "proposals" },
  { id: "reports",    label: "Reports",    icon: "reports" },
  { id: "calendar",   label: "Calendar",   icon: "calendar" },
  { id: "journal",    label: "AI Journal", icon: "journal" },
  { id: "strategy",   label: "Strategy",   icon: "strategy" },
  { id: "settings",   label: "Settings",   icon: "settings" },
];

const Sidebar = memo(function Sidebar() {
  const { state, dispatch } = useApp();
  const { sidebarCollapsed, activePage } = state;
  return (
    <aside className={`sidebar${sidebarCollapsed ? " collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">✦ Vistacr</div>
        <button className="sidebar-toggle" onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}
          data-tooltip={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
          <Icon name={sidebarCollapsed ? "chevRight" : "chevLeft"} size={15} />
        </button>
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <div key={item.id}
            className={`nav-item${activePage === item.id ? " active" : ""}`}
            onClick={() => dispatch({ type: "SET_PAGE", payload: item.id })}
            data-tooltip={sidebarCollapsed ? item.label : undefined}>
            <span className="nav-icon"><Icon name={item.icon} size={16} /></span>
            <span className="nav-label">{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// TOPBAR
// ─────────────────────────────────────────────────────────────────────────────
const Topbar = memo(function Topbar({ onExport, onImport, fileInputRef }) {
  const { state, dispatch } = useApp();
  const pageLabel = NAV_ITEMS.find(n => n.id === state.activePage)?.label || "";
  const isDark = state.theme === "dark";
  return (
    <div className="topbar">
      <div className="topbar-title">{pageLabel}</div>
      <div className="topbar-actions">
        <Btn onClick={onExport} title="Export data"><Icon name="download" size={14} /> Export</Btn>
        <label style={{ cursor: "pointer" }}>
          <span className="btn btn-ghost" title="Import data" style={{ cursor:"pointer" }}><Icon name="upload" size={14} /> Import</span>
          <input ref={fileInputRef} type="file" accept=".json,.md" style={{ display: "none" }} onChange={onImport} />
        </label>
        <div className="toggle-wrap" onClick={() => dispatch({ type: "SET_THEME", payload: isDark ? "light" : "dark" })}
          data-tooltip={isDark ? "Light mode" : "Dark mode"}>
          <Icon name={isDark ? "moon" : "sun"} size={15} />
          <div className={`toggle${isDark ? "" : " on"}`} />
        </div>
        <Btn onClick={() => dispatch({ type: "TOGGLE_AI" })} title="Toggle AI assistant">
          <Icon name="ai" size={14} /> AI
        </Btn>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// OVERVIEW PAGE
// ─────────────────────────────────────────────────────────────────────────────
const Overview = memo(function Overview() {
  const { state } = useApp();
  const { deals, contacts, leads, proposals } = state;

  const totalPipelineValue = useMemo(() =>
    deals.filter(d => !["Closed Won","Closed Lost"].includes(d.stage)).reduce((s, d) => s + (d.value || 0), 0),
    [deals]
  );
  const wonValue = useMemo(() => deals.filter(d => d.stage === "Closed Won").reduce((s, d) => s + d.value, 0), [deals]);
  const winRate = useMemo(() => {
    const closed = deals.filter(d => ["Closed Won","Closed Lost"].includes(d.stage));
    return closed.length ? Math.round(deals.filter(d => d.stage === "Closed Won").length / closed.length * 100) : 0;
  }, [deals]);

  const stageData = useMemo(() => PIPELINE_STAGES.map(stage => ({
    stage, count: deals.filter(d => d.stage === stage).length,
    value: deals.filter(d => d.stage === stage).reduce((s, d) => s + d.value, 0)
  })), [deals]);

  const funnelData = useMemo(() => {
    const stages = ["Prospect","Qualified","Proposal","Negotiation","Closed Won"];
    const max = Math.max(...stages.map(s => deals.filter(d => d.stage === s).length), 1);
    return stages.map(s => ({
      stage: s, count: deals.filter(d => d.stage === s).length,
      width: Math.max(20, Math.round(deals.filter(d => d.stage === s).length / max * 100)),
      color: STAGE_COLORS[s]
    }));
  }, [deals]);

  const recentDeals = useMemo(() => [...deals].sort((a,b) => b.value - a.value).slice(0,5), [deals]);

  return (
    <div>
      <div className="section-title">Sales Overview</div>
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: "Pipeline Value", value: fmt$(totalPipelineValue), delta: "+12%", up: true },
          { label: "Closed Won", value: fmt$(wonValue), delta: "+8%", up: true },
          { label: "Win Rate", value: `${winRate}%`, delta: winRate > 50 ? "+5%" : "-3%", up: winRate > 50 },
          { label: "Active Leads", value: leads.length, delta: `+${leads.filter(l=>l.status==="New").length} new`, up: true },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className={`stat-delta ${s.up ? "delta-up" : "delta-down"}`}>{s.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="sub-title">Pipeline by Stage</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stageData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <XAxis dataKey="stage" tick={{ fontSize: 10, fill: "var(--muted)" }} />
              <YAxis tick={{ fontSize: 10, fill: "var(--muted)" }} />
              <Tooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                formatter={(v, n) => n === "value" ? fmt$(v) : v}
              />
              <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} name="Deals" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="sub-title">Pipeline Funnel</div>
          <div className="pipeline-funnel" style={{ padding: "8px 0" }}>
            {funnelData.map((f, i) => (
              <div key={f.stage} className="funnel-stage"
                style={{ width: `${f.width}%`, background: f.color, marginBottom: 4, fontSize: 11 }}>
                <span>{f.stage}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{f.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="sub-title" style={{ marginBottom: 12 }}>Top Deals</div>
          {recentDeals.length === 0 ? <EmptyState icon="📋" text="No deals yet" /> :
            recentDeals.map(d => (
              <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>{d.title}</div>
                  <span className={`badge badge-${d.stage === "Closed Won" ? "green" : d.stage === "Closed Lost" ? "red" : "orange"}`}>{d.stage}</span>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600 }}>{fmt$(d.value)}</div>
              </div>
            ))
          }
        </div>

        <div className="card">
          <div className="sub-title" style={{ marginBottom: 12 }}>Stage Distribution</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={stageData.filter(s => s.count > 0)} cx="50%" cy="50%" outerRadius={75}
                dataKey="count" nameKey="stage" label={({ name, value }) => value > 0 ? `${name.slice(0,3)}: ${value}` : ""} labelLine={false}
                fontSize={11}>
                {stageData.map((s, i) => (
                  <Cell key={s.stage} fill={STAGE_COLORS[s.stage]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// CONTACTS PAGE
// ─────────────────────────────────────────────────────────────────────────────
const EMPTY_CONTACT = { name: "", email: "", phone: "", company: "", title: "", tags: "", notes: "" };

const Contacts = memo(function Contacts() {
  const { state, dispatch, persist } = useApp();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // null | { mode: 'add'|'edit', data }
  const [form, setForm] = useState(EMPTY_CONTACT);

  const filtered = useMemo(() =>
    state.contacts.filter(c =>
      !search || [c.name, c.email, c.company, c.title].some(f => f?.toLowerCase().includes(search.toLowerCase()))
    ), [state.contacts, search]);

  const openAdd = useCallback(() => { setForm(EMPTY_CONTACT); setModal({ mode: "add" }); }, []);
  const openEdit = useCallback(c => {
    setForm({ ...c, tags: Array.isArray(c.tags) ? c.tags.join(", ") : c.tags || "" });
    setModal({ mode: "edit", id: c.id });
  }, []);
  const closeModal = useCallback(() => setModal(null), []);

  const handleSave = useCallback(() => {
    const item = { ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) };
    if (modal.mode === "add") {
      const c = { ...item, id: genId("c"), createdAt: new Date().toISOString().slice(0,10) };
      dispatch({ type: "ADD_CONTACT", payload: c });
      persist("contacts", c);
    } else {
      const c = { ...item, id: modal.id };
      dispatch({ type: "UPDATE_CONTACT", payload: c });
      persist("contacts", c);
    }
    closeModal();
  }, [form, modal, dispatch, persist, closeModal]);

  const handleDelete = useCallback(c => {
    if (!confirm(`Delete ${c.name}?`)) return;
    dispatch({ type: "DELETE_CONTACT", payload: c.id });
    dbDelete("contacts", c.id);
  }, [dispatch]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 0 }}>Contacts <span style={{ fontSize: 14, color: "var(--muted)", fontFamily: "var(--font-body)" }}>({filtered.length})</span></div>
        <div style={{ display: "flex", gap: 10 }}>
          <div className="search-bar">
            <Icon name="search" size={14} color="var(--muted)" />
            <input placeholder="Search contacts..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Btn variant="primary" onClick={openAdd}><Icon name="plus" size={14} /> Add Contact</Btn>
        </div>
      </div>
      {filtered.length === 0 ? <EmptyState icon="👥" text="No contacts yet" sub="Add your first contact to get started" /> : (
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>Name</th><th>Company</th><th>Title</th><th>Email</th><th>Phone</th><th>Tags</th><th>Added</th><th style={{ width: 80 }}></th>
            </tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td><div style={{ fontWeight: 500 }}>{c.name}</div></td>
                  <td>{c.company}</td><td style={{ color: "var(--muted)", fontSize: 13 }}>{c.title}</td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{c.email}</td>
                  <td style={{ fontSize: 13 }}>{c.phone}</td>
                  <td>{(c.tags || []).map(t => <span key={t} className="tag" style={{ marginRight: 4 }}>{t}</span>)}</td>
                  <td style={{ color: "var(--muted)", fontSize: 12 }}>{fmtDate(c.createdAt)}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn size="sm" onClick={() => openEdit(c)}><Icon name="edit" size={12} /></Btn>
                      <Btn size="sm" variant="danger" onClick={() => handleDelete(c)}><Icon name="trash" size={12} /></Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal && (
        <Modal title={modal.mode === "add" ? "Add Contact" : "Edit Contact"} onClose={closeModal}>
          <div className="grid-2">
            <Fld label="Full Name"><input className="input" value={form.name} onChange={e => setForm(p => ({...p,name:e.target.value}))} placeholder="Jane Smith" /></Fld>
            <Fld label="Company"><input className="input" value={form.company} onChange={e => setForm(p => ({...p,company:e.target.value}))} placeholder="Acme Corp" /></Fld>
            <Fld label="Title"><input className="input" value={form.title} onChange={e => setForm(p => ({...p,title:e.target.value}))} placeholder="VP Sales" /></Fld>
            <Fld label="Email"><input className="input" type="email" value={form.email} onChange={e => setForm(p => ({...p,email:e.target.value}))} placeholder="jane@acme.com" /></Fld>
            <Fld label="Phone"><input className="input" value={form.phone} onChange={e => setForm(p => ({...p,phone:e.target.value}))} placeholder="555-0100" /></Fld>
            <Fld label="Tags (comma-separated)"><input className="input" value={form.tags} onChange={e => setForm(p => ({...p,tags:e.target.value}))} placeholder="hot, enterprise, follow-up" /></Fld>
          </div>
          <Fld label="Notes"><textarea className="textarea" value={form.notes} onChange={e => setForm(p => ({...p,notes:e.target.value}))} placeholder="Notes about this contact..." /></Fld>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn onClick={closeModal}>Cancel</Btn>
            <Btn variant="primary" onClick={handleSave}>{modal.mode === "add" ? "Add Contact" : "Save Changes"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// LEADS PAGE
// ─────────────────────────────────────────────────────────────────────────────
const LEAD_STATUSES = ["New","Contacted","Qualified","Proposal Sent","Converted","Lost"];
const LEAD_SOURCES = ["Inbound","Outbound","Referral","Cold Outreach","Event","Social","Other"];

// Generates ranked fallback search URLs when no website is known
function getWebPresenceLinks(companyName) {
  const q = encodeURIComponent(companyName);
  return [
    { label: "Google Business", url: `https://www.google.com/search?q=${q}+business+site` },
    { label: "Bing Places",     url: `https://www.bing.com/maps?q=${q}` },
    { label: "Yelp",            url: `https://www.yelp.com/search?find_desc=${q}` },
  ];
}

const WebLink = memo(function WebLink({ url, company }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (url) {
    const display = url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
    return (
      <a href={url} target="_blank" rel="noopener noreferrer"
        style={{ color:"var(--accent2)", fontFamily:"var(--font-mono)", fontSize:11.5, textDecoration:"none", display:"flex", alignItems:"center", gap:4 }}
        title={url}>
        <span style={{ maxWidth:140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"inline-block" }}>{display}</span>
        <span style={{ fontSize:10, opacity:0.7 }}>↗</span>
      </a>
    );
  }

  const fallbacks = getWebPresenceLinks(company);
  return (
    <div style={{ position:"relative" }} ref={ref}>
      <button onClick={() => setOpen(v => !v)}
        style={{ background:"none", border:"1px dashed var(--border)", borderRadius:5, padding:"3px 8px", cursor:"pointer", color:"var(--muted)", fontSize:11.5, display:"flex", alignItems:"center", gap:4 }}>
        🔍 Find listing
        <span style={{ fontSize:9 }}>▾</span>
      </button>
      {open && (
        <div style={{ position:"absolute", top:"100%", left:0, marginTop:4, background:"var(--card)", border:"1px solid var(--border)", borderRadius:8, zIndex:30, minWidth:160, boxShadow:"0 8px 24px rgba(0,0,0,0.25)", overflow:"hidden" }}>
          {fallbacks.map(f => (
            <a key={f.label} href={f.url} target="_blank" rel="noopener noreferrer"
              style={{ display:"block", padding:"8px 12px", fontSize:12.5, color:"var(--text)", textDecoration:"none", borderBottom:"1px solid var(--border)" }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--card-hover)"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
              onClick={() => setOpen(false)}>
              {f.label} ↗
            </a>
          ))}
        </div>
      )}
    </div>
  );
});

const Leads = memo(function Leads() {
  const { state, dispatch, persist } = useApp();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name:"",email:"",phone:"",company:"",website:"",source:"Inbound",status:"New",score:50,notes:"" });

  const filtered = useMemo(() =>
    state.leads.filter(l =>
      !search || [l.name, l.email, l.company, l.website].some(f => f?.toLowerCase().includes(search.toLowerCase()))
    ), [state.leads, search]);

  const save = useCallback(() => {
    if (modal.mode === "add") {
      const l = { ...form, id: genId("l"), createdAt: new Date().toISOString().slice(0,10) };
      dispatch({ type: "ADD_LEAD", payload: l });
      persist("leads", l);
    } else {
      const l = { ...form, id: modal.id };
      dispatch({ type: "UPDATE_LEAD", payload: l });
      persist("leads", l);
    }
    setModal(null);
  }, [form, modal, dispatch, persist]);

  const del = useCallback(l => {
    if (!confirm(`Delete lead ${l.name}?`)) return;
    dispatch({ type: "DELETE_LEAD", payload: l.id });
    dbDelete("leads", l.id);
  }, [dispatch]);

  const scoreColor = s => s >= 80 ? "#10b981" : s >= 60 ? "#f59e0b" : "#f87171";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 0 }}>Leads <span style={{ fontSize: 14, color: "var(--muted)", fontFamily: "var(--font-body)" }}>({filtered.length})</span></div>
        <div style={{ display: "flex", gap: 10 }}>
          <div className="search-bar">
            <Icon name="search" size={14} color="var(--muted)" />
            <input placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Btn variant="primary" onClick={() => { setForm({ name:"",email:"",phone:"",company:"",website:"",source:"Inbound",status:"New",score:50,notes:"" }); setModal({ mode:"add" }); }}>
            <Icon name="plus" size={14} /> Add Lead
          </Btn>
        </div>
      </div>

      {filtered.length === 0 ? <EmptyState icon="⚡" text="No leads yet" sub="Add leads manually or ask the AI assistant to parse bulk lead data" /> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Company</th><th>Website / Listing</th><th>Source</th><th>Status</th><th>Score</th><th>Email</th><th>Created</th><th style={{ width: 80 }}></th></tr></thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id}>
                  <td><div style={{ fontWeight: 500 }}>{l.name}</div></td>
                  <td>{l.company}</td>
                  <td><WebLink url={l.website} company={l.company} /></td>
                  <td><span className="badge badge-purple">{l.source}</span></td>
                  <td><span className={`badge badge-${l.status === "Converted" ? "green" : l.status === "Lost" ? "red" : l.status === "New" ? "orange" : "teal"}`}>{l.status}</span></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 50, height: 5, background: "var(--border)", borderRadius: 3 }}>
                        <div style={{ width: `${l.score}%`, height: "100%", background: scoreColor(l.score), borderRadius: 3 }} />
                      </div>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: scoreColor(l.score) }}>{l.score}</span>
                    </div>
                  </td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{l.email}</td>
                  <td style={{ color: "var(--muted)", fontSize: 12 }}>{fmtDate(l.createdAt)}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn size="sm" onClick={() => { setForm({ ...l, score: l.score || 50, website: l.website || "" }); setModal({ mode: "edit", id: l.id }); }}>
                        <Icon name="edit" size={12} />
                      </Btn>
                      <Btn size="sm" variant="danger" onClick={() => del(l)}><Icon name="trash" size={12} /></Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal && (
        <Modal title={modal.mode === "add" ? "Add Lead" : "Edit Lead"} onClose={() => setModal(null)}>
          <div className="grid-2">
            <Fld label="Name"><input className="input" value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} placeholder="Company / Person name" /></Fld>
            <Fld label="Company"><input className="input" value={form.company} onChange={e => setForm(p=>({...p,company:e.target.value}))} /></Fld>
            <Fld label="Email"><input className="input" value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))} /></Fld>
            <Fld label="Phone"><input className="input" value={form.phone} onChange={e => setForm(p=>({...p,phone:e.target.value}))} /></Fld>
            <Fld label="Source">
              <select className="select" value={form.source} onChange={e => setForm(p=>({...p,source:e.target.value}))}>
                {LEAD_SOURCES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Fld>
            <Fld label="Status">
              <select className="select" value={form.status} onChange={e => setForm(p=>({...p,status:e.target.value}))}>
                {LEAD_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Fld>
          </div>
          <Fld label="Website URL">
            <input className="input" value={form.website} onChange={e => setForm(p=>({...p,website:e.target.value}))} placeholder="https://company.com (leave blank to use Find Listing)" />
          </Fld>
          <Fld label={`Lead Score: ${form.score}`}>
            <input type="range" min="0" max="100" value={form.score} onChange={e => setForm(p=>({...p,score:+e.target.value}))} style={{ width: "100%", accentColor: "var(--accent)" }} />
          </Fld>
          <Fld label="Notes"><textarea className="textarea" value={form.notes} onChange={e => setForm(p=>({...p,notes:e.target.value}))} placeholder="Lead context, how they found you..." /></Fld>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn onClick={() => setModal(null)}>Cancel</Btn>
            <Btn variant="primary" onClick={save}>{modal.mode === "add" ? "Add Lead" : "Save"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// PIPELINE (KANBAN)
// ─────────────────────────────────────────────────────────────────────────────
const KanbanCard = memo(function KanbanCard({ deal, contacts, onEdit, onDragStart }) {
  const contact = contacts.find(c => c.id === deal.contactId);
  return (
    <div className="kanban-card" draggable
      onDragStart={e => { e.dataTransfer.setData("dealId", deal.id); onDragStart(deal.id); }}>
      <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 6 }}>{deal.title}</div>
      {contact && <div style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 6 }}>{contact.name} · {contact.company}</div>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: "var(--accent)" }}>{fmt$(deal.value)}</span>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ fontSize: 11, color: "var(--muted)" }}>{deal.probability}%</span>
          <Btn size="sm" onClick={e => { e.stopPropagation(); onEdit(deal); }}><Icon name="edit" size={11} /></Btn>
        </div>
      </div>
      {deal.expectedClose && <div style={{ fontSize: 11, color: "var(--dim)", marginTop: 4 }}>Close: {fmtDate(deal.expectedClose)}</div>}
    </div>
  );
});

const Pipeline = memo(function Pipeline() {
  const { state, dispatch, persist } = useApp();
  const [dragOver, setDragOver] = useState(null);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ title:"", contactId:"", value:0, stage:"Prospect", probability:30, expectedClose:"", notes:"" });

  const handleDrop = useCallback((e, stage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData("dealId");
    const deal = state.deals.find(d => d.id === dealId);
    if (deal) {
      const updated = { ...deal, stage };
      dispatch({ type: "MOVE_DEAL", payload: { id: dealId, stage } });
      persist("deals", updated);
    }
    setDragOver(null);
  }, [state.deals, dispatch, persist]);

  const save = useCallback(() => {
    if (modal.mode === "add") {
      const d = { ...form, id: genId("d"), value: +form.value, probability: +form.probability };
      dispatch({ type: "ADD_DEAL", payload: d });
      persist("deals", d);
    } else {
      const d = { ...form, id: modal.id, value: +form.value, probability: +form.probability };
      dispatch({ type: "UPDATE_DEAL", payload: d });
      persist("deals", d);
    }
    setModal(null);
  }, [form, modal, dispatch, persist]);

  const del = useCallback(id => {
    if (!confirm("Delete this deal?")) return;
    dispatch({ type: "DELETE_DEAL", payload: id });
    dbDelete("deals", id);
    setModal(null);
  }, [dispatch]);

  const stageTotal = useCallback(stage =>
    state.deals.filter(d => d.stage === stage).reduce((s, d) => s + d.value, 0)
  , [state.deals]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 0 }}>Pipeline</div>
        <Btn variant="primary" onClick={() => { setForm({ title:"",contactId:"",value:0,stage:"Prospect",probability:30,expectedClose:"",notes:"" }); setModal({ mode:"add" }); }}>
          <Icon name="plus" size={14} /> Add Deal
        </Btn>
      </div>
      <div className="kanban-board">
        {PIPELINE_STAGES.map(stage => {
          const stageDeals = state.deals.filter(d => d.stage === stage);
          return (
            <div key={stage} className="kanban-col"
              onDragOver={e => { e.preventDefault(); setDragOver(stage); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={e => handleDrop(e, stage)}>
              <div className="kanban-col-title">
                <span style={{ color: STAGE_COLORS[stage] }}>{stage}</span>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--muted)", fontSize: 11 }}>{stageDeals.length}</span>
              </div>
              {stageDeals.length > 0 && (
                <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--muted)", marginBottom: 8 }}>{fmt$(stageTotal(stage))}</div>
              )}
              <div className={`kanban-drop-zone${dragOver === stage ? " drag-over" : ""}`}>
                {stageDeals.map(d => (
                  <KanbanCard key={d.id} deal={d} contacts={state.contacts}
                    onEdit={d => { setForm({ ...d, value: d.value || 0, probability: d.probability || 30 }); setModal({ mode:"edit", id: d.id }); }}
                    onDragStart={() => {}} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {modal && (
        <Modal title={modal.mode === "add" ? "Add Deal" : "Edit Deal"} onClose={() => setModal(null)}>
          <Fld label="Deal Title"><input className="input" value={form.title} onChange={e => setForm(p=>({...p,title:e.target.value}))} placeholder="Company – Plan/Product" /></Fld>
          <div className="grid-2">
            <Fld label="Contact">
              <select className="select" value={form.contactId} onChange={e => setForm(p=>({...p,contactId:e.target.value}))}>
                <option value="">— Select contact —</option>
                {state.contacts.map(c => <option key={c.id} value={c.id}>{c.name} ({c.company})</option>)}
              </select>
            </Fld>
            <Fld label="Stage">
              <select className="select" value={form.stage} onChange={e => setForm(p=>({...p,stage:e.target.value}))}>
                {PIPELINE_STAGES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Fld>
            <Fld label="Deal Value ($)"><input className="input" type="number" value={form.value} onChange={e => setForm(p=>({...p,value:e.target.value}))} /></Fld>
            <Fld label={`Win Probability: ${form.probability}%`}>
              <input type="range" min="0" max="100" value={form.probability} onChange={e => setForm(p=>({...p,probability:e.target.value}))} style={{ width: "100%", accentColor: "var(--accent)" }} />
            </Fld>
            <Fld label="Expected Close"><input className="input" type="date" value={form.expectedClose} onChange={e => setForm(p=>({...p,expectedClose:e.target.value}))} /></Fld>
          </div>
          <Fld label="Notes"><textarea className="textarea" value={form.notes} onChange={e => setForm(p=>({...p,notes:e.target.value}))} /></Fld>
          <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
            {modal.mode === "edit" && <Btn variant="danger" onClick={() => del(modal.id)}><Icon name="trash" size={13} /> Delete</Btn>}
            <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
              <Btn onClick={() => setModal(null)}>Cancel</Btn>
              <Btn variant="primary" onClick={save}>{modal.mode === "add" ? "Add Deal" : "Save"}</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// PROPOSALS PAGE
// ─────────────────────────────────────────────────────────────────────────────
const PROPOSAL_STATUSES = ["Draft","Sent","Viewed","Accepted","Declined"];

const Proposals = memo(function Proposals() {
  const { state, dispatch, persist } = useApp();
  const [modal, setModal] = useState(null);
  const [view, setView] = useState(null);
  const [form, setForm] = useState({ title:"", contactId:"", dealId:"", status:"Draft", value:0, content:"" });

  const save = useCallback(() => {
    if (modal.mode === "add") {
      const p = { ...form, id: genId("p"), createdAt: new Date().toISOString().slice(0,10), value: +form.value };
      dispatch({ type: "ADD_PROPOSAL", payload: p });
      persist("proposals", p);
    } else {
      const p = { ...form, id: modal.id, value: +form.value };
      dispatch({ type: "UPDATE_PROPOSAL", payload: p });
      persist("proposals", p);
    }
    setModal(null);
  }, [form, modal, dispatch, persist]);

  const del = useCallback(id => {
    if (!confirm("Delete this proposal?")) return;
    dispatch({ type: "DELETE_PROPOSAL", payload: id });
    dbDelete("proposals", id);
  }, [dispatch]);

  const statusBadge = s => ({Draft:"gray",Sent:"orange",Viewed:"teal",Accepted:"green",Declined:"red"})[s] || "gray";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 0 }}>Proposals</div>
        <Btn variant="primary" onClick={() => { setForm({ title:"",contactId:"",dealId:"",status:"Draft",value:0,content:"## Executive Summary\n\n## Scope of Work\n\n## Investment\n\n## Next Steps" }); setModal({ mode:"add" }); }}>
          <Icon name="plus" size={14} /> New Proposal
        </Btn>
      </div>
      {state.proposals.length === 0 ? <EmptyState icon="📄" text="No proposals yet" sub="Create proposals and track their status" /> : (
        <div className="grid-2">
          {state.proposals.map(p => {
            const contact = state.contacts.find(c => c.id === p.contactId);
            return (
              <div key={p.id} className="card" style={{ cursor: "pointer", transition: "transform 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span className={`badge badge-${statusBadge(p.status)}`}>{p.status}</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Btn size="sm" onClick={() => setView(p)}><Icon name="copy" size={11} /></Btn>
                    <Btn size="sm" onClick={() => { setForm({ ...p, value: p.value || 0 }); setModal({ mode:"edit", id: p.id }); }}><Icon name="edit" size={11} /></Btn>
                    <Btn size="sm" variant="danger" onClick={() => del(p.id)}><Icon name="trash" size={11} /></Btn>
                  </div>
                </div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{p.title}</div>
                {contact && <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{contact.name} · {contact.company}</div>}
                <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>{fmt$(p.value)}</span>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{fmtDate(p.createdAt)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {modal && (
        <Modal title={modal.mode === "add" ? "New Proposal" : "Edit Proposal"} onClose={() => setModal(null)}>
          <div className="grid-2">
            <Fld label="Title" style={{ gridColumn: "span 2" }}>
              <input className="input" value={form.title} onChange={e => setForm(p=>({...p,title:e.target.value}))} placeholder="Proposal title..." />
            </Fld>
            <Fld label="Contact">
              <select className="select" value={form.contactId} onChange={e => setForm(p=>({...p,contactId:e.target.value}))}>
                <option value="">— Select —</option>
                {state.contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Fld>
            <Fld label="Status">
              <select className="select" value={form.status} onChange={e => setForm(p=>({...p,status:e.target.value}))}>
                {PROPOSAL_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Fld>
            <Fld label="Value ($)"><input className="input" type="number" value={form.value} onChange={e => setForm(p=>({...p,value:e.target.value}))} /></Fld>
          </div>
          <Fld label="Content (Markdown)">
            <textarea className="textarea" style={{ minHeight: 200, fontFamily: "var(--font-mono)", fontSize: 12 }}
              value={form.content} onChange={e => setForm(p=>({...p,content:e.target.value}))} />
          </Fld>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn onClick={() => setModal(null)}>Cancel</Btn>
            <Btn variant="primary" onClick={save}>{modal.mode === "add" ? "Create" : "Save"}</Btn>
          </div>
        </Modal>
      )}
      {view && (
        <Modal title={view.title} onClose={() => setView(null)}>
          <pre style={{ fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.7, whiteSpace: "pre-wrap", color: "var(--text)", background: "var(--bg)", padding: 16, borderRadius: 8, border: "1px solid var(--border)" }}>
            {view.content}
          </pre>
        </Modal>
      )}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// REPORTS PAGE
// ─────────────────────────────────────────────────────────────────────────────
const Reports = memo(function Reports() {
  const { state } = useApp();
  const { deals, contacts, leads } = state;

  const byStage = useMemo(() => PIPELINE_STAGES.map(s => ({
    stage: s, count: deals.filter(d => d.stage === s).length,
    value: deals.filter(d => d.stage === s).reduce((a, d) => a + d.value, 0)
  })), [deals]);

  const bySource = useMemo(() => {
    const map = {};
    leads.forEach(l => { map[l.source] = (map[l.source] || 0) + 1; });
    return Object.entries(map).map(([source, count]) => ({ source, count }));
  }, [leads]);

  const pipeline = useMemo(() => {
    const active = deals.filter(d => !["Closed Won","Closed Lost"].includes(d.stage));
    const weighted = active.reduce((s, d) => s + d.value * (d.probability / 100), 0);
    const total = active.reduce((s, d) => s + d.value, 0);
    return { active: active.length, total, weighted };
  }, [deals]);

  return (
    <div>
      <div className="section-title">Reports & Analytics</div>
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: "Total Contacts", value: contacts.length },
          { label: "Total Leads", value: leads.length },
          { label: "Active Deals", value: pipeline.active },
          { label: "Weighted Pipeline", value: fmt$(pipeline.weighted) },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="sub-title">Pipeline Value by Stage</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={byStage} margin={{ left: -10, bottom: 10 }}>
              <XAxis dataKey="stage" tick={{ fontSize: 10, fill: "var(--muted)" }} angle={-20} textAnchor="end" />
              <YAxis tick={{ fontSize: 10, fill: "var(--muted)" }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:8, fontSize:12 }}
                formatter={v => fmt$(v)} />
              <Bar dataKey="value" fill="var(--accent3)" radius={[4,4,0,0]} name="Value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="sub-title">Leads by Source</div>
          {bySource.length === 0 ? <EmptyState icon="📊" text="No data yet" /> : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={bySource} cx="50%" cy="50%" outerRadius={80}
                  dataKey="count" nameKey="source" label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={11}>
                  {bySource.map((s, i) => (
                    <Cell key={s.source} fill={["#6366f1","#e07050","#4ecdc4","#f59e0b","#10b981","#f87171"][i % 6]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:8, fontSize:12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="card">
        <div className="sub-title" style={{ marginBottom: 14 }}>Deal Summary by Stage</div>
        <div className="table-wrap" style={{ border: "none" }}>
          <table>
            <thead><tr><th>Stage</th><th>Deals</th><th>Total Value</th><th>Avg Deal Size</th><th>Share</th></tr></thead>
            <tbody>
              {byStage.map(s => {
                const totalVal = byStage.reduce((a, r) => a + r.value, 0);
                return (
                  <tr key={s.stage}>
                    <td><span style={{ display:"inline-block", width:10, height:10, borderRadius:2, background:STAGE_COLORS[s.stage], marginRight:8 }} />{s.stage}</td>
                    <td>{s.count}</td>
                    <td style={{ fontFamily:"var(--font-mono)", fontWeight:600 }}>{fmt$(s.value)}</td>
                    <td style={{ fontFamily:"var(--font-mono)" }}>{s.count ? fmt$(s.value/s.count) : "—"}</td>
                    <td>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:60, height:5, background:"var(--border)", borderRadius:3 }}>
                          <div style={{ width:`${totalVal ? s.value/totalVal*100 : 0}%`, height:"100%", background:STAGE_COLORS[s.stage], borderRadius:3 }} />
                        </div>
                        <span style={{ fontSize:12, color:"var(--muted)" }}>{totalVal ? Math.round(s.value/totalVal*100) : 0}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// CALENDAR PAGE
// ─────────────────────────────────────────────────────────────────────────────
const EVENT_TYPES = ["Meeting","Call","Demo","Follow-up","Deadline","Other"];

const Calendar = memo(function Calendar() {
  const { state, dispatch, persist } = useApp();
  const today = new Date();
  const [viewDate, setViewDate] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selected, setSelected] = useState(today.toISOString().slice(0,10));
  const [eventModal, setEventModal] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [eForm, setEForm] = useState({ title:"", time:"", type:"Meeting", description:"" });

  const daysInMonth = (y, m) => new Date(y, m+1, 0).getDate();
  const firstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const { year, month } = viewDate;
  const days = daysInMonth(year, month);
  const offset = firstDayOfMonth(year, month);
  const prevDays = daysInMonth(year, month - 1);

  const eventsForDay = useCallback(dateStr =>
    state.events.filter(e => e.date === dateStr), [state.events]);

  const notesForDay = useMemo(() =>
    state.notes.filter(n => n.date === selected), [state.notes, selected]);

  const selectedDateEvents = useMemo(() =>
    eventsForDay(selected), [eventsForDay, selected]);

  const saveNote = useCallback(() => {
    if (!noteText.trim()) return;
    const n = { id: genId("n"), date: selected, content: noteText, createdAt: new Date().toISOString() };
    dispatch({ type: "ADD_NOTE", payload: n });
    persist("notes", n);
    setNoteText("");
  }, [noteText, selected, dispatch, persist]);

  const saveEvent = useCallback(() => {
    if (!eForm.title) return;
    const ev = { ...eForm, id: genId("ev"), date: selected };
    if (eventModal?.id) {
      dispatch({ type: "UPDATE_EVENT", payload: { ...ev, id: eventModal.id } });
      persist("events", { ...ev, id: eventModal.id });
    } else {
      dispatch({ type: "ADD_EVENT", payload: ev });
      persist("events", ev);
    }
    setEventModal(null);
    setEForm({ title:"", time:"", type:"Meeting", description:"" });
  }, [eForm, selected, eventModal, dispatch, persist]);

  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const fmtDay = (y, m, d) => `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const todayStr = today.toISOString().slice(0,10);

  const calCells = useMemo(() => {
    const cells = [];
    for (let i = 0; i < offset; i++) cells.push({ day: prevDays - offset + 1 + i, current: false, dateStr: fmtDay(year, month-1, prevDays - offset + 1 + i) });
    for (let i = 1; i <= days; i++) cells.push({ day: i, current: true, dateStr: fmtDay(year, month, i) });
    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) cells.push({ day: i, current: false, dateStr: fmtDay(year, month+1, i) });
    return cells;
  }, [year, month, days, offset, prevDays]);

  return (
    <div>
      <div className="section-title">Calendar</div>
      <div style={{ display: "flex", gap: 20 }}>
        {/* Calendar grid */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => {
              setViewDate(v => {
                if (v.month === 0) return { year: v.year-1, month: 11 };
                return { year: v.year, month: v.month-1 };
              });
            }}><Icon name="chevLeft" size={14} /></button>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600 }}>{MONTHS[month]} {year}</div>
            <button className="btn btn-ghost btn-sm" onClick={() => {
              setViewDate(v => {
                if (v.month === 11) return { year: v.year+1, month: 0 };
                return { year: v.year, month: v.month+1 };
              });
            }}><Icon name="chevRight" size={14} /></button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 8 }}>
            {DAYS.map(d => <div key={d} style={{ textAlign:"center", fontSize:11, fontWeight:600, color:"var(--muted)", padding:"4px 0", textTransform:"uppercase", letterSpacing:"0.05em" }}>{d}</div>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
            {calCells.map((cell, i) => {
              const evs = eventsForDay(cell.dateStr);
              return (
                <div key={i}
                  className={`cal-day${cell.dateStr === todayStr ? " today" : ""}${cell.dateStr === selected ? " selected" : ""}${!cell.current ? " other-month" : ""}`}
                  onClick={() => setSelected(cell.dateStr)}>
                  <span className="day-num" style={{ fontSize: 12 }}>{cell.day}</span>
                  {evs.length > 0 && <div className="day-dot" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right panel: events + notepad */}
        <div style={{ width: 280, display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{fmtDate(selected)}</div>
              <Btn size="sm" variant="primary" onClick={() => { setEForm({ title:"", time:"", type:"Meeting", description:"" }); setEventModal({ mode:"add" }); }}>
                <Icon name="plus" size={12} /> Event
              </Btn>
            </div>
            {selectedDateEvents.length === 0 ? (
              <div style={{ fontSize: 12.5, color: "var(--muted)", textAlign: "center", padding: "12px 0" }}>No events</div>
            ) : selectedDateEvents.map(ev => (
              <div key={ev.id} style={{ padding: "8px 0", borderBottom: "1px solid var(--border)", display:"flex", justifyContent:"space-between" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{ev.title}</div>
                  <div style={{ fontSize: 11.5, color:"var(--muted)" }}>{ev.type}{ev.time ? ` · ${ev.time}` : ""}</div>
                </div>
                <Btn size="sm" variant="danger" onClick={() => { dispatch({ type:"DELETE_EVENT", payload:ev.id }); dbDelete("events", ev.id); }}>
                  <Icon name="trash" size={11} />
                </Btn>
              </div>
            ))}
          </div>

          <div className="card" style={{ flex: 1 }}>
            <div className="sub-title" style={{ marginBottom: 10 }}>📝 Day Notes</div>
            {notesForDay.map(n => (
              <div key={n.id} style={{ fontSize: 13, padding: "6px 0", borderBottom: "1px solid var(--border)", display:"flex", justifyContent:"space-between", gap:8 }}>
                <span style={{ flex: 1 }}>{n.content}</span>
                <Btn size="sm" variant="danger" onClick={() => { dispatch({ type:"DELETE_NOTE", payload:n.id }); dbDelete("notes", n.id); }}>
                  <Icon name="trash" size={11} />
                </Btn>
              </div>
            ))}
            <div style={{ marginTop: 10, display:"flex", gap:6 }}>
              <input className="input" style={{ flex:1 }} placeholder="Add note..." value={noteText} onChange={e => setNoteText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && saveNote()} />
              <Btn variant="primary" size="sm" onClick={saveNote}>Add</Btn>
            </div>
          </div>
        </div>
      </div>

      {eventModal && (
        <Modal title="Add Event" onClose={() => setEventModal(null)}>
          <Fld label="Title"><input className="input" value={eForm.title} onChange={e => setEForm(p=>({...p,title:e.target.value}))} placeholder="Event title" autoFocus /></Fld>
          <div className="grid-2">
            <Fld label="Time"><input className="input" type="time" value={eForm.time} onChange={e => setEForm(p=>({...p,time:e.target.value}))} /></Fld>
            <Fld label="Type">
              <select className="select" value={eForm.type} onChange={e => setEForm(p=>({...p,type:e.target.value}))}>
                {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </Fld>
          </div>
          <Fld label="Description"><textarea className="textarea" value={eForm.description} onChange={e => setEForm(p=>({...p,description:e.target.value}))} /></Fld>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <Btn onClick={() => setEventModal(null)}>Cancel</Btn>
            <Btn variant="primary" onClick={saveEvent}>Save Event</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// AI JOURNAL PAGE
// ─────────────────────────────────────────────────────────────────────────────
const AIJournal = memo(function AIJournal() {
  const { state, dispatch, persist } = useApp();
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title:"", content:"", tags:"", mood:"" });

  const MOODS = [{ label:"💡 Insight", value:"insight" },{ label:"📈 Progress", value:"progress" },{ label:"⚠️ Concern", value:"concern" },{ label:"✅ Win", value:"win" }];

  const addEntry = useCallback(() => {
    const j = { ...form, id: genId("j"), createdAt: new Date().toISOString(), tags: form.tags.split(",").map(t=>t.trim()).filter(Boolean) };
    dispatch({ type: "ADD_JOURNAL", payload: j });
    persist("journal", j);
    setForm({ title:"", content:"", tags:"", mood:"" });
    setEditing(false);
    setSelected(j);
  }, [form, dispatch, persist]);

  const del = useCallback(id => {
    dispatch({ type: "DELETE_JOURNAL", payload: id });
    dbDelete("journal", id);
    setSelected(null);
  }, [dispatch]);

  const moodIcon = m => ({ insight:"💡", progress:"📈", concern:"⚠️", win:"✅" })[m] || "📓";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 0 }}>AI Journal & Notes</div>
        <Btn variant="primary" onClick={() => setEditing(true)}><Icon name="plus" size={14} /> New Entry</Btn>
      </div>
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ width: 260, display:"flex", flexDirection:"column", gap:8 }}>
          {state.journal.length === 0 ? (
            <div className="card" style={{ textAlign:"center", padding:24 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📓</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>No journal entries yet</div>
              <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 4 }}>Ask the AI assistant to create entries or add them manually</div>
            </div>
          ) : [...state.journal].reverse().map(j => (
            <div key={j.id} className="card card-sm" style={{ cursor:"pointer", background: selected?.id === j.id ? "var(--card-hover)" : "var(--card)" }}
              onClick={() => setSelected(j)}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <span style={{ fontSize: 11, color: "var(--muted)" }}>{new Date(j.createdAt).toLocaleDateString()}</span>
                <span>{moodIcon(j.mood)}</span>
              </div>
              <div style={{ fontWeight: 500, fontSize: 13, marginTop: 4 }}>{j.title || "Untitled"}</div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          {editing ? (
            <div className="card">
              <Fld label="Entry Title"><input className="input" value={form.title} onChange={e => setForm(p=>({...p,title:e.target.value}))} placeholder="What's on your mind?" autoFocus /></Fld>
              <Fld label="Mood / Type">
                <div style={{ display:"flex", gap:8 }}>
                  {MOODS.map(m => (
                    <button key={m.value} onClick={() => setForm(p=>({...p,mood:m.value}))}
                      style={{ padding:"5px 10px", borderRadius:20, border:"1px solid var(--border)", background: form.mood === m.value ? "var(--accent)" : "var(--card)", color: form.mood === m.value ? "#fff" : "var(--text)", cursor:"pointer", fontSize:12 }}>
                      {m.label}
                    </button>
                  ))}
                </div>
              </Fld>
              <Fld label="Content">
                <textarea className="textarea" style={{ minHeight: 200 }} value={form.content}
                  onChange={e => setForm(p=>({...p,content:e.target.value}))} placeholder="Write your thoughts, observations, strategy notes..." />
              </Fld>
              <Fld label="Tags"><input className="input" value={form.tags} onChange={e => setForm(p=>({...p,tags:e.target.value}))} placeholder="strategy, q2, follow-up" /></Fld>
              <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
                <Btn onClick={() => setEditing(false)}>Cancel</Btn>
                <Btn variant="primary" onClick={addEntry}>Save Entry</Btn>
              </div>
            </div>
          ) : selected ? (
            <div className="card">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <div>
                  <div style={{ fontFamily:"var(--font-display)", fontSize:22, fontWeight:600 }}>{selected.title}</div>
                  <div style={{ fontSize:12, color:"var(--muted)", marginTop:2 }}>{new Date(selected.createdAt).toLocaleString()} · {moodIcon(selected.mood)}</div>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <Btn variant="danger" size="sm" onClick={() => del(selected.id)}><Icon name="trash" size={13} /></Btn>
                </div>
              </div>
              <div style={{ fontSize:14, lineHeight:1.7, whiteSpace:"pre-wrap" }}>{selected.content}</div>
              {selected.tags?.length > 0 && (
                <div style={{ marginTop:16, display:"flex", gap:6, flexWrap:"wrap" }}>
                  {selected.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              )}
            </div>
          ) : (
            <div className="card" style={{ minHeight:300 }}>
              <EmptyState icon="📓" text="Select an entry" sub="Or create a new one. The AI assistant can also create journal entries automatically." />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// STRATEGY PAGE
// ─────────────────────────────────────────────────────────────────────────────
const Strategy = memo(function Strategy() {
  const { state, dispatch, persist } = useApp();
  const [selected, setSelected] = useState(state.strategies[0] || null);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ title:"", targetSegment:"", icp:"", painPoints:"", valueProps:"", objections:"", talkingPoints:"" });

  const save = useCallback(() => {
    if (modal.mode === "add") {
      const s = { ...form, id: genId("s"), createdAt: new Date().toISOString().slice(0,10) };
      dispatch({ type: "ADD_STRATEGY", payload: s });
      persist("strategies", s);
      setSelected(s);
    } else {
      const s = { ...form, id: modal.id };
      dispatch({ type: "UPDATE_STRATEGY", payload: s });
      persist("strategies", s);
      setSelected(s);
    }
    setModal(null);
  }, [form, modal, dispatch, persist]);

  const del = useCallback(id => {
    if (!confirm("Delete this strategy?")) return;
    dispatch({ type: "DELETE_STRATEGY", payload: id });
    dbDelete("strategies", id);
    setSelected(null);
  }, [dispatch]);

  const SECTIONS = [
    { key:"targetSegment", label:"🎯 Target Segment" },
    { key:"icp", label:"👤 Ideal Customer Profile (ICP)" },
    { key:"painPoints", label:"🩹 Pain Points to Address" },
    { key:"valueProps", label:"💎 Value Propositions" },
    { key:"objections", label:"🛡️ Objection Handlers" },
    { key:"talkingPoints", label:"💬 Key Talking Points" },
  ];

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div className="section-title" style={{ marginBottom:0 }}>Sales Strategy & Pitch Builder</div>
        <Btn variant="primary" onClick={() => { setForm({ title:"",targetSegment:"",icp:"",painPoints:"",valueProps:"",objections:"",talkingPoints:"" }); setModal({ mode:"add" }); }}>
          <Icon name="plus" size={14} /> New Strategy
        </Btn>
      </div>
      <div style={{ display:"flex", gap:20 }}>
        <div style={{ width:240, display:"flex", flexDirection:"column", gap:8 }}>
          {state.strategies.length === 0 ? (
            <div className="card" style={{ textAlign:"center", padding:24 }}>
              <div style={{ fontSize:32, marginBottom:8 }}>🎯</div>
              <div style={{ fontSize:13, color:"var(--muted)" }}>No strategies yet</div>
            </div>
          ) : state.strategies.map(s => (
            <div key={s.id} className="card card-sm" style={{ cursor:"pointer", background: selected?.id === s.id ? "var(--card-hover)" : undefined }}
              onClick={() => setSelected(s)}>
              <div style={{ fontWeight:500, fontSize:13 }}>{s.title}</div>
              <div style={{ fontSize:11.5, color:"var(--muted)", marginTop:2 }}>{fmtDate(s.createdAt)}</div>
            </div>
          ))}
        </div>
        <div style={{ flex:1 }}>
          {selected ? (
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <div style={{ fontFamily:"var(--font-display)", fontSize:22, fontWeight:600 }}>{selected.title}</div>
                <div style={{ display:"flex", gap:8 }}>
                  <Btn size="sm" onClick={() => { setForm({ ...selected }); setModal({ mode:"edit", id:selected.id }); }}><Icon name="edit" size={13} /></Btn>
                  <Btn size="sm" variant="danger" onClick={() => del(selected.id)}><Icon name="trash" size={13} /></Btn>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {SECTIONS.map(sec => (
                  <div key={sec.key} className="pitch-block">
                    <div className="pitch-block-title">{sec.label}</div>
                    <div style={{ fontSize:13.5, lineHeight:1.65, whiteSpace:"pre-wrap", color:"var(--text)" }}>
                      {selected[sec.key] || <span style={{ color:"var(--dim)" }}>Not set</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card" style={{ minHeight:300 }}>
              <EmptyState icon="🎯" text="Select a strategy" sub="Create and manage your sales strategies, pitch frameworks, and objection handlers" />
            </div>
          )}
        </div>
      </div>
      {modal && (
        <Modal title={modal.mode === "add" ? "New Strategy" : "Edit Strategy"} onClose={() => setModal(null)}>
          <Fld label="Strategy Title"><input className="input" value={form.title} onChange={e => setForm(p=>({...p,title:e.target.value}))} placeholder="Q2 Enterprise Push" autoFocus /></Fld>
          {SECTIONS.map(sec => (
            <Fld key={sec.key} label={sec.label}>
              <textarea className="textarea" value={form[sec.key]} onChange={e => setForm(p=>({...p,[sec.key]:e.target.value}))} style={{ minHeight:70 }} />
            </Fld>
          ))}
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <Btn onClick={() => setModal(null)}>Cancel</Btn>
            <Btn variant="primary" onClick={save}>{modal.mode === "add" ? "Create" : "Save"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS PAGE
// ─────────────────────────────────────────────────────────────────────────────
const Settings = memo(function Settings() {
  const { state, dispatch, persist } = useApp();
  const [form, setForm] = useState({ ...state.settings });
  const [saved, setSaved] = useState(false);

  const save = useCallback(() => {
    dispatch({ type: "UPDATE_SETTINGS", payload: form });
    dbPut("journal", { id: "__settings__", ...form }); // store settings in a dedicated DB entry
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [form, dispatch]);

  const clearAll = useCallback(async () => {
    if (!confirm("⚠️ This will clear ALL app data. Are you sure?")) return;
    for (const store of STORES) await dbClear(store);
    window.location.reload();
  }, []);

  return (
    <div style={{ maxWidth: 600 }}>
      <div className="section-title">Settings</div>
      <div className="card" style={{ marginBottom:16 }}>
        <div className="sub-title" style={{ marginBottom:14 }}>Account</div>
        <div className="grid-2">
          <Fld label="Your Name"><input className="input" value={form.userName} onChange={e => setForm(p=>({...p,userName:e.target.value}))} /></Fld>
          <Fld label="Company Name"><input className="input" value={form.companyName} onChange={e => setForm(p=>({...p,companyName:e.target.value}))} /></Fld>
          <Fld label="Currency">
            <select className="select" value={form.currency} onChange={e => setForm(p=>({...p,currency:e.target.value}))}>
              {["USD","EUR","GBP","CAD","AUD","JPY"].map(c => <option key={c}>{c}</option>)}
            </select>
          </Fld>
        </div>
      </div>
      <div className="card" style={{ marginBottom:16 }}>
        <div className="sub-title" style={{ marginBottom:14 }}>AI Assistant (Claude API)</div>
        <Fld label="Anthropic API Key">
          <input className="input" type="password" value={form.apiKey} onChange={e => setForm(p=>({...p,apiKey:e.target.value}))} placeholder="sk-ant-api03-..." />
        </Fld>
        <div style={{ fontSize: 12, color:"var(--muted)", marginTop:4 }}>
          Your API key is stored locally in IndexedDB and never leaves your browser. Get your key at{" "}
          <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" style={{ color:"var(--accent)" }}>console.anthropic.com</a>
        </div>
      </div>
      <div style={{ display:"flex", gap:12 }}>
        <Btn variant="primary" onClick={save}>{saved ? "✓ Saved!" : "Save Settings"}</Btn>
        <Btn variant="danger" onClick={clearAll}><Icon name="trash" size={13} /> Clear All Data</Btn>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// AI ASSISTANT PANEL
// ─────────────────────────────────────────────────────────────────────────────
function buildSystemPrompt(state) {
  const { contacts, leads, deals, proposals, strategies, journal, events } = state;
  return `You are Vera, an expert AI sales assistant embedded in Vistacr CRM. You have full visibility into and CRUD access to all CRM data.

CURRENT CRM DATA SNAPSHOT:
- Contacts: ${contacts.length} records. Recent: ${contacts.slice(0,3).map(c=>c.name+" ("+c.company+")").join(", ")||"none"}
- Leads: ${leads.length} records. Statuses: ${[...new Set(leads.map(l=>l.status))].join(", ")||"none"}
- Deals: ${deals.length} total. Pipeline value: $${deals.filter(d=>!["Closed Won","Closed Lost"].includes(d.stage)).reduce((s,d)=>s+d.value,0).toLocaleString()}
- Proposals: ${proposals.length}
- Strategies: ${strategies.length}
- Journal entries: ${journal.length}
- Calendar events: ${events.length}

CRUD CAPABILITIES: When the user asks you to create, update, or delete records, respond with your helpful message AND include a JSON action block at the end in this exact format:
<action>{"type":"ACTION_TYPE","payload":{...}}</action>

Available action types:
- ADD_CONTACT: payload = {name, email, phone, company, title, tags:[], notes}
- ADD_LEAD: payload = {name, email, phone, company, source, status, score, notes}
- ADD_LEADS_BULK: payload = [{...lead1}, {...lead2}] (array of leads)
- ADD_DEAL: payload = {title, contactId, value, stage, probability, expectedClose, notes}
- ADD_JOURNAL: payload = {title, content, mood, tags:[]}
- ADD_EVENT: payload = {title, date, time, type, description}

BULK LEAD PARSING: If the user pastes raw lead data (emails, lists, CSV-like text), parse it intelligently and respond with ADD_LEADS_BULK action containing all extracted leads.

PERSONALITY: You are sharp, concise, and strategically-minded. Give actionable sales advice. Reference specific data from the CRM when relevant. Be direct and confident. Never pad responses.`;
}

function parseActions(text) {
  const actions = [];
  const regex = /<action>([\s\S]*?)<\/action>/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    try {
      actions.push(JSON.parse(match[1]));
    } catch(e) {}
  }
  return actions;
}

function cleanResponse(text) {
  return text.replace(/<action>[\s\S]*?<\/action>/g, "").trim();
}

const AIPanel = memo(function AIPanel() {
  const { state, dispatch, persist } = useApp();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHistoryDD, setShowHistoryDD] = useState(false);
  const messagesEndRef = useRef(null);
  const abortRef = useRef(null);
  const textareaRef = useRef(null);

  const activeChat = useMemo(() =>
    state.chats.find(c => c.id === state.activeChatId), [state.chats, state.activeChatId]);

  const messages = activeChat?.messages || [];

  useEffect(() => {
    if (!state.activeChatId && state.chats.length === 0) {
      dispatch({ type: "NEW_CHAT" });
    } else if (!state.activeChatId && state.chats.length > 0) {
      dispatch({ type: "SET_ACTIVE_CHAT", payload: state.chats[0].id });
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    if (!state.settings.apiKey) {
      alert("Please add your Anthropic API key in Settings first.\n\nGo to Settings → Anthropic API Key.");
      return;
    }

    // Ensure we always have a chatId we can use immediately (never return early)
    let chatId = state.activeChatId;
    if (!chatId) {
      const newChatId = genId("chat");
      const newChat = { id: newChatId, name: text.slice(0, 40), messages: [] };
      dispatch({ type: "NEW_CHAT_WITH_ID", payload: newChat });
      chatId = newChatId;
    }

    const userMsg = { id: genId("msg"), role: "user", content: text, ts: Date.now() };
    dispatch({ type: "ADD_MESSAGE", payload: { chatId, message: userMsg } });
    setInput("");
    if (textareaRef.current) { textareaRef.current.style.height = "auto"; }
    setLoading(true);

    const allMessages = [...messages, userMsg];

    abortRef.current = new AbortController();
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": state.settings.apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1500,
          system: buildSystemPrompt(state),
          messages: allMessages
            .filter(m => m.role === "user" || m.role === "assistant")
            .map(m => ({ role: m.role, content: m.content })),
        }),
        signal: abortRef.current.signal,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "API error");

      const rawText = data.content?.[0]?.text || "";
      const actions = parseActions(rawText);
      const displayText = cleanResponse(rawText);

      const aiMsg = { id: genId("msg"), role: "assistant", content: displayText, ts: Date.now() };
      dispatch({ type: "ADD_MESSAGE", payload: { chatId, message: aiMsg } });

      // Execute any CRUD actions
      for (const action of actions) {
        if (action.type === "ADD_LEADS_BULK") {
          const newLeads = action.payload.map(l => ({
            ...l, id: genId("l"), createdAt: new Date().toISOString().slice(0,10),
            score: l.score || 50, status: l.status || "New", source: l.source || "AI Parsed"
          }));
          dispatch({ type: "ADD_LEADS_BULK", payload: newLeads });
          for (const lead of newLeads) await persist("leads", lead);
        } else {
          let item = { ...action.payload, id: genId(action.type.split("_")[1]?.toLowerCase() || "item") };
          if (action.type === "ADD_LEAD") {
            item = { ...item, createdAt: new Date().toISOString().slice(0,10), score: item.score || 50 };
          }
          if (action.type === "ADD_CONTACT") {
            item = { ...item, createdAt: new Date().toISOString().slice(0,10), tags: item.tags || [] };
          }
          if (action.type === "ADD_JOURNAL") {
            item = { ...item, createdAt: new Date().toISOString(), tags: item.tags || [] };
          }
          dispatch({ type: action.type, payload: item });
          const storeMap = {
            ADD_CONTACT: "contacts", ADD_LEAD: "leads", ADD_DEAL: "deals",
            ADD_JOURNAL: "journal", ADD_EVENT: "events"
          };
          if (storeMap[action.type]) await persist(storeMap[action.type], item);
        }
      }

      // Persist the chat
      const updatedChat = state.chats.find(c => c.id === chatId);
      if (updatedChat) await persist("chats", { ...updatedChat, messages: [...(updatedChat.messages || []), userMsg, aiMsg] });

    } catch (err) {
      if (err.name !== "AbortError") {
        const errMsg = { id: genId("msg"), role: "system", content: `Error: ${err.message}`, ts: Date.now() };
        dispatch({ type: "ADD_MESSAGE", payload: { chatId, message: errMsg } });
      }
    } finally {
      setLoading(false);
    }
  }, [input, loading, state, messages, dispatch, persist]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const handleKeyDown = useCallback(e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }, [sendMessage]);

  if (!state.aiPanelOpen) return null;

  return (
    <div className="ai-panel">
      {/* Header with chat history dropdown */}
      <div className="ai-header">
        <Icon name="ai" size={16} color="var(--accent)" />
        <div style={{ flex:1, position:"relative" }}>
          <button onClick={() => setShowHistoryDD(v => !v)}
            style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text)", fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:4, width:"100%" }}>
            <span style={{ flex:1, textAlign:"left", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {activeChat?.name || "New Chat"}
            </span>
            <Icon name="chevDown" size={12} />
          </button>
          {showHistoryDD && (
            <div style={{ position:"absolute", top:"100%", left:0, right:0, background:"var(--card)", border:"1px solid var(--border)", borderRadius:8, zIndex:50, maxHeight:200, overflowY:"auto", boxShadow:"0 8px 24px rgba(0,0,0,0.3)", marginTop:4 }}
              onMouseLeave={() => setShowHistoryDD(false)}>
              {state.chats.length === 0 ? (
                <div style={{ padding:"10px 12px", fontSize:12, color:"var(--muted)" }}>No history yet</div>
              ) : state.chats.map(c => (
                <div key={c.id} style={{ padding:"8px 12px", cursor:"pointer", fontSize:13, display:"flex", justifyContent:"space-between", alignItems:"center", background: c.id === state.activeChatId ? "rgba(224,112,80,0.1)" : "none" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--card-hover)"}
                  onMouseLeave={e => e.currentTarget.style.background = c.id === state.activeChatId ? "rgba(224,112,80,0.1)" : "none"}>
                  <span style={{ flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}
                    onClick={() => { dispatch({ type:"SET_ACTIVE_CHAT", payload:c.id }); setShowHistoryDD(false); }}>
                    {c.name}
                  </span>
                  <button onClick={e => { e.stopPropagation(); dispatch({ type:"DELETE_CHAT", payload:c.id }); dbDelete("chats", c.id); }}
                    style={{ background:"none", border:"none", cursor:"pointer", color:"var(--dim)", padding:"0 4px", fontSize:12 }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => dispatch({ type:"NEW_CHAT" })} title="New chat"
          style={{ background:"none", border:"none", cursor:"pointer", color:"var(--muted)", padding:4 }}>
          <Icon name="plus" size={15} />
        </button>
      </div>

      {/* Messages */}
      <div className="ai-messages">
        {messages.length === 0 && (
          <div className="msg msg-system">👋 Hi! I'm Vera, your AI sales assistant. I can see all your CRM data and help you manage leads, contacts, deals, and strategy. Paste bulk lead data and I'll parse it automatically!</div>
        )}
        {messages.map(m => (
          <div key={m.id} className={`msg msg-${m.role}`} style={{ whiteSpace:"pre-wrap", wordBreak:"break-word" }}>
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="msg msg-ai loading" style={{ minWidth:60 }}>
            <span>● ● ●</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="ai-input-area">
        <div className="ai-input-row">
          <textarea ref={textareaRef} className="ai-textarea" placeholder="Ask Vera anything... or paste bulk lead data to import"
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown} rows={1}
            style={{ overflow:"hidden", resize:"none" }}
            onInput={e => { e.target.style.height="auto"; e.target.style.height=Math.min(e.target.scrollHeight,120)+"px"; }} />
          <button className="ai-send" onClick={sendMessage} disabled={loading || !input.trim()}>
            {loading ? <span className="spin">↻</span> : <Icon name="send" size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT / IMPORT
// ─────────────────────────────────────────────────────────────────────────────
function exportToJson(state) {
  const data = { contacts: state.contacts, leads: state.leads, deals: state.deals, proposals: state.proposals, events: state.events, notes: state.notes, strategies: state.strategies, journal: state.journal };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `vistacr-export-${new Date().toISOString().slice(0,10)}.json`; a.click();
  URL.revokeObjectURL(url);
}

function exportToMarkdown(state) {
  let md = `# Vistacr CRM Export — ${new Date().toLocaleDateString()}\n\n`;
  md += `## Contacts (${state.contacts.length})\n\n`;
  state.contacts.forEach(c => { md += `### ${c.name}\n- **Company**: ${c.company}\n- **Email**: ${c.email}\n- **Phone**: ${c.phone}\n- **Tags**: ${(c.tags||[]).join(", ")}\n\n`; });
  md += `## Leads (${state.leads.length})\n\n`;
  state.leads.forEach(l => { md += `### ${l.name} (${l.company})\n- **Status**: ${l.status}\n- **Source**: ${l.source}\n- **Score**: ${l.score}\n- **Email**: ${l.email}\n\n`; });
  md += `## Pipeline Deals (${state.deals.length})\n\n`;
  state.deals.forEach(d => { md += `### ${d.title}\n- **Stage**: ${d.stage}\n- **Value**: $${d.value?.toLocaleString()}\n- **Probability**: ${d.probability}%\n\n`; });
  const blob = new Blob([md], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `vistacr-export-${new Date().toISOString().slice(0,10)}.md`; a.click();
  URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const fileInputRef = useRef(null);
  const isMounted = useRef(true);

  // persist helper: write to IndexedDB
  const persist = useCallback(async (store, item) => {
    try { await dbPut(store, item); } catch(e) { console.error("DB write error:", e); }
  }, []);

  // Load all data from IndexedDB on mount
  useEffect(() => {
    async function loadAll() {
      try {
        const [contacts, leads, deals, proposals, events, notes, strategies, chats, journal] = await Promise.all(
          ["contacts","leads","deals","proposals","events","notes","strategies","chats","journal"].map(s => dbGetAll(s))
        );

        // Check if we need seed data
        const needsSeed = contacts.length === 0 && leads.length === 0;

        if (needsSeed) {
          // Seed the DB
          for (const c of SEED_CONTACTS) await dbPut("contacts", c);
          for (const l of SEED_LEADS) await dbPut("leads", l);
          for (const d of SEED_DEALS) await dbPut("deals", d);
          for (const p of SEED_PROPOSALS) await dbPut("proposals", p);
          for (const s of SEED_STRATEGIES) await dbPut("strategies", s);

          if (isMounted.current) {
            dispatch({ type:"LOAD_ALL", payload:{
              contacts: SEED_CONTACTS, leads: SEED_LEADS, deals: SEED_DEALS,
              proposals: SEED_PROPOSALS, strategies: SEED_STRATEGIES,
              events: [], notes: [], journal: [], chats: [],
            }});
          }
        } else {
          // Load settings from journal store
          const settingsEntry = journal.find(j => j.id === "__settings__");
          const settings = settingsEntry ? { apiKey: settingsEntry.apiKey||"", userName: settingsEntry.userName||"Sales Pro", companyName: settingsEntry.companyName||"Vistacr", currency: settingsEntry.currency||"USD" } : initialState.settings;

          if (isMounted.current) {
            dispatch({ type:"LOAD_ALL", payload:{
              contacts, leads, deals, proposals,
              events, notes,
              strategies,
              chats,
              journal: journal.filter(j => j.id !== "__settings__"),
              settings,
              activeChatId: chats[0]?.id || null,
            }});
          }
        }
      } catch(e) {
        console.error("DB load error:", e);
      }
    }
    loadAll();
    return () => { isMounted.current = false; };
  }, []);

  const handleExport = useCallback(() => {
    const choice = confirm("Export as JSON? (Cancel for Markdown)");
    if (choice) exportToJson(state);
    else exportToMarkdown(state);
  }, [state]);

  const handleImport = useCallback(async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const data = JSON.parse(text);
      const stores = ["contacts","leads","deals","proposals","events","notes","strategies","journal"];
      for (const store of stores) {
        if (Array.isArray(data[store])) {
          for (const item of data[store]) await dbPut(store, item);
        }
      }
      dispatch({ type:"LOAD_ALL", payload:{
        contacts: data.contacts || state.contacts,
        leads: data.leads || state.leads,
        deals: data.deals || state.deals,
        proposals: data.proposals || state.proposals,
        events: data.events || state.events,
        notes: data.notes || state.notes,
        strategies: data.strategies || state.strategies,
        journal: data.journal || state.journal,
      }});
      alert("Import successful!");
    } catch(e) {
      alert("Import failed: invalid JSON file");
    }
    e.target.value = "";
  }, [state, dispatch]);

  const ctx = useMemo(() => ({ state, dispatch, persist }), [state, dispatch, persist]);

  const PageComponent = useMemo(() => ({
    overview: Overview, contacts: Contacts, leads: Leads, pipeline: Pipeline,
    proposals: Proposals, reports: Reports, calendar: Calendar,
    journal: AIJournal, strategy: Strategy, settings: Settings
  })[state.activePage] || Overview, [state.activePage]);

  return (
    <AppCtx.Provider value={ctx}>
      <div className={`crm-root ${state.theme}`}>
        <Sidebar />
        <div className="main-content">
          <Topbar onExport={handleExport} onImport={handleImport} fileInputRef={fileInputRef} />
          <div className="app-body">
            <div className="page-area">
              <PageComponent />
            </div>
            <AIPanel />
          </div>
        </div>
      </div>
    </AppCtx.Provider>
  );
}
