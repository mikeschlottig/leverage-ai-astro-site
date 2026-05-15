import { useState, useEffect, useRef, useCallback } from "react";

// ─── CONSTANTS ─────────────────────────────────────────────────────────────

const MODELS = [
  { id: "claude-haiku-4-5-20251001", label: "Haiku 4.5", badge: "Fast" },
  { id: "claude-sonnet-4-6", label: "Sonnet 4.6", badge: "Balanced" },
  { id: "claude-opus-4-6", label: "Opus 4.6", badge: "Best" },
];

const DEFAULT_SYS = `You are Muse AI — an expert prompt engineer, technical writer, and creative thinking partner embedded in a personal knowledge management app.

## Your Role
Help users create, optimize, and organize:
- **Prompts**: Optimized system prompts using role+context+format+CoT best practices  
- **PRDs**: Full product requirement docs (Overview, Goals, User Stories, Tech Requirements, Success Metrics)
- **Claude.md files**: Claude Code project configs with context, standards, tool permissions

## Multi-Document Workflow
When asked to create a full project setup (prompt + PRD + Claude.md):
1. Confirm project goal and target platforms
2. Generate the optimized system prompt
3. Generate the full PRD (include Claude.md as a section)
4. Auto-suggest relevant tags

## Action Blocks
When creating library items, embed JSON action blocks so the app can auto-save them:
\`\`\`json
{"action":"create","type":"prompt","title":"Title Here","body":"Prompt content here...","tags":["tag1","tag2"]}
\`\`\`
\`\`\`json
{"action":"create","type":"prd","title":"PRD Title","body":"# PRD Content...","claudeMd":"# Claude.md content...","tags":["tag1"]}
\`\`\`

## Tone
Direct. High-leverage. No filler. Expert-level output from first attempt.`;

const INIT_SYS_PROMPTS = [
  { id: "sp1", name: "Default — Muse AI", content: DEFAULT_SYS },
  { id: "sp2", name: "Ultra Concise", content: "You are Muse AI. Be ultra-concise. No preamble. Output JSON action blocks immediately after a 1-line summary. Expert output only." },
  { id: "sp3", name: "Socratic Mode", content: "You are Muse AI. Before creating anything, ask 3 clarifying questions. Then produce output that perfectly matches the user's mental model. Always suggest alternative approaches." },
];

const INIT_PROMPTS = [
  { id: "p1", title: "Cline Coding Agent", body: "You are Cline, an expert AI coding agent specialized in collaborative software development. Always begin with thorough analysis before writing code. Follow: Plan → Implement → Validate.\n\nNever skip the planning phase. Document decisions inline.", tags: ["code", "cline", "agent"], favorite: true, updatedAt: new Date(Date.now() - 9 * 3600000).toISOString() },
  { id: "p2", title: "Focus & Execute", body: "Take a deep breath. Think carefully. Generate a step-by-step implementation plan before touching any code. Execute systematically, validating each step.", tags: ["focus", "planning", "mindset"], favorite: false, updatedAt: new Date(Date.now() - 60 * 86400000).toISOString() },
  { id: "p3", title: "Code Analysis Mode", body: "Plan mode. DO NOT change any code until explicitly prompted.\n\nAnalyze this application: architecture, patterns, bottlenecks, security surface, improvement opportunities. Present findings ordered by priority and estimated impact.", tags: ["analyze", "code-review", "architecture"], favorite: true, updatedAt: new Date(Date.now() - 58 * 86400000).toISOString() },
  { id: "p4", title: "Cloudflare Agents Architect", body: "You are an expert Cloudflare Agents SDK architect. Build stateful, durable AI agents using Worker + Durable Objects patterns. Prioritize WebSocket-native designs and edge-first deployment strategies.", tags: ["cloudflare", "agents", "architecture"], favorite: false, updatedAt: new Date(Date.now() - 30 * 86400000).toISOString() },
];

const INIT_LINKS = [
  { id: "l1", url: "https://docs.anthropic.com", title: "Anthropic Documentation", description: "Official Claude API docs, guides, and model reference", tags: ["docs", "api", "anthropic"], image: null, favicon: "https://www.google.com/s2/favicons?domain=anthropic.com&sz=64", favorite: true, updatedAt: new Date().toISOString() },
  { id: "l2", url: "https://developers.cloudflare.com/agents", title: "Cloudflare Agents SDK", description: "Build stateful AI agents on the edge with Durable Objects", tags: ["cloudflare", "agents", "sdk"], image: null, favicon: "https://www.google.com/s2/favicons?domain=cloudflare.com&sz=64", favorite: true, updatedAt: new Date().toISOString() },
  { id: "l3", url: "https://github.com/anthropics/anthropic-sdk-python", title: "Anthropic Python SDK", description: "Official Python library for the Anthropic API with full type safety", tags: ["python", "sdk", "github"], image: null, favicon: "https://www.google.com/s2/favicons?domain=github.com&sz=64", favorite: false, updatedAt: new Date().toISOString() },
  { id: "l4", url: "https://vitejs.dev", title: "Vite", description: "Next generation frontend tooling with lightning-fast HMR", tags: ["tooling", "frontend", "build"], image: null, favicon: "https://www.google.com/s2/favicons?domain=vitejs.dev&sz=64", favorite: false, updatedAt: new Date().toISOString() },
];

const INIT_PRDS = [
  {
    id: "r1",
    title: "Muse — AI Prompt Library",
    body: `# Muse — AI Prompt Library

## Overview
A personal knowledge management system for prompts, links, and PRDs with an integrated AI assistant powered by Claude.

## Goals
- Organize reusable prompts with full-text search and tagging
- AI-assisted content creation with auto-labeling
- Export-ready documentation in standard formats

## User Stories
- As a developer, I want to quickly find and copy prompts by tag/keyword
- As a builder, I want AI to generate optimized prompts from a brief description
- As a team lead, I want to export my library for sharing with my team

## Technical Requirements
- React 18 + Vite + TypeScript frontend
- Cloudflare Workers + Durable Objects backend
- Anthropic API integration (Haiku default, upgradeable)
- IndexedDB persistence with JSON export

## Success Metrics
- <200ms search response time
- AI generates usable output in >80% of first attempts
- Export/import round-trip lossless`,
    claudeMd: `# Claude.md

## Project: Muse Prompt Library

### Context
React + Cloudflare Workers application for managing prompts, PRDs, and links with AI assistance.

### Tech Stack
- React 18 + Vite + TypeScript
- Cloudflare Workers + Durable Objects + D1
- Anthropic API (\`claude-haiku-4-5-20251001\` default)
- Tailwind CSS

### Coding Standards
- Functional components with hooks only
- TypeScript strict mode throughout
- Co-locate component logic (no barrel exports)
- Single responsibility per component/hook

### Workflow
- Plan architecture before implementing features
- Write unit tests for business logic (Vitest)
- Deploy to Workers via \`wrangler deploy\`

### Tool Permissions
- File creation: yes
- Shell commands: yes (wrangler, npm, git)
- Network: Cloudflare API, Anthropic API only`,
    tags: ["react", "ai", "cloudflare", "template"],
    favorite: true,
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

// ─── UTILITIES ─────────────────────────────────────────────────────────────

const timeAgo = (iso) => {
  const s = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 2592000) return `${Math.floor(s / 86400)}d ago`;
  return `${Math.floor(s / 2592000)}mo ago`;
};

const genId = () => Math.random().toString(36).slice(2, 10);

const truncate = (str, n) => str?.length > n ? str.slice(0, n) + "…" : str;

async function fetchOGData(url) {
  try {
    const r = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
    const { data } = await r.json();
    return {
      title: data?.title || new URL(url).hostname,
      description: data?.description || "",
      image: data?.image?.url || null,
      favicon: `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`,
    };
  } catch {
    try {
      return { title: new URL(url).hostname, description: "", image: null, favicon: `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64` };
    } catch { return { title: url, description: "", image: null, favicon: null }; }
  }
}

function parseAIActions(text) {
  const actions = [];
  const re = /```json\s*([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    try { const o = JSON.parse(m[1].trim()); if (o.action) actions.push(o); } catch {}
  }
  return actions;
}

// ─── ICONS ─────────────────────────────────────────────────────────────────

const I = {
  Menu: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Star: ({ filled }) => <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? "#f59e0b" : "none"} stroke={filled ? "#f59e0b" : "currentColor"} strokeWidth="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
  Copy: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Edit: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6"/><path d="M10,11v6"/><path d="M14,11v6"/><path d="M9,6V4a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v2"/></svg>,
  Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Search: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Grid: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  List: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Download: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  X: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Send: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>,
  Chat: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Terminal: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4,17 10,11 4,5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>,
  Settings: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Book: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Link: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  FileText: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>,
  ChevronLeft: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15,18 9,12 15,6"/></svg>,
  ChevronRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,18 15,12 9,6"/></svg>,
  Sparkle: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/></svg>,
  ExternalLink: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  Save: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>,
  MoreH: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>,
};

// ─── THEME ─────────────────────────────────────────────────────────────────

const T = {
  bg: "#080808",
  s1: "#111111",
  s2: "#191919",
  s3: "#222222",
  border: "#2c2c2c",
  accent: "#f59e0b",
  accentFaint: "rgba(245,158,11,0.1)",
  accentBorder: "rgba(245,158,11,0.3)",
  text: "#e2e2e2",
  muted: "#777",
  dim: "#444",
  tag: "#1e1e1e",
  tagBorder: "#333",
};

// ─── COMPONENTS ────────────────────────────────────────────────────────────

function Tag({ label, onRemove, onClick, active }) {
  return (
    <span
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "2px 8px", borderRadius: 4,
        background: active ? T.accentFaint : T.tag,
        border: `1px solid ${active ? T.accentBorder : T.tagBorder}`,
        color: active ? T.accent : T.muted,
        fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
        cursor: onClick || onRemove ? "pointer" : "default",
        whiteSpace: "nowrap",
      }}
    >
      {label}
      {onRemove && (
        <span onClick={(e) => { e.stopPropagation(); onRemove(); }} style={{ color: T.dim, lineHeight: 1 }}>×</span>
      )}
    </span>
  );
}

function Btn({ onClick, children, variant = "ghost", style = {}, title, disabled }) {
  const styles = {
    primary: { background: T.accent, color: "#000", border: "none", fontWeight: 700 },
    ghost: { background: "transparent", color: T.muted, border: `1px solid ${T.border}` },
    danger: { background: "transparent", color: "#ef4444", border: `1px solid rgba(239,68,68,0.3)` },
  };
  return (
    <button
      title={title}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
        padding: "6px 12px", borderRadius: 7, fontSize: 13, fontFamily: "'Syne', sans-serif",
        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
        transition: "all 0.15s", whiteSpace: "nowrap",
        ...styles[variant], ...style,
      }}
    >
      {children}
    </button>
  );
}

function IconBtn({ onClick, children, title, danger, active }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 28, height: 28, borderRadius: 6, cursor: "pointer",
        background: active ? T.accentFaint : "transparent",
        border: "none", color: active ? T.accent : T.muted,
        transition: "all 0.15s",
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = danger ? "#ef4444" : T.text; e.currentTarget.style.background = danger ? "rgba(239,68,68,0.1)" : T.s3; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = active ? T.accent : T.muted; e.currentTarget.style.background = active ? T.accentFaint : "transparent"; }}
    >
      {children}
    </button>
  );
}

// ─── MODAL ─────────────────────────────────────────────────────────────────

function Modal({ modal, onClose, onSave, onDelete }) {
  const isLink = modal.section === "links";
  const isPrd = modal.section === "prds";
  const isCreate = modal.type === "create";
  const item = modal.item || {};

  const [form, setForm] = useState({
    title: item.title || "",
    body: item.body || "",
    url: item.url || "",
    description: item.description || "",
    claudeMd: item.claudeMd || "",
    tags: item.tags || [],
    tagInput: "",
  });
  const [fetching, setFetching] = useState(false);
  const [activeTab, setActiveTab] = useState("body");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addTag = () => {
    const t = form.tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (t && !form.tags.includes(t)) set("tags", [...form.tags, t]);
    set("tagInput", "");
  };

  const handleTagKey = (e) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); }
  };

  const fetchLink = async () => {
    if (!form.url) return;
    setFetching(true);
    const data = await fetchOGData(form.url);
    setForm(f => ({ ...f, title: f.title || data.title, description: f.description || data.description }));
    setFetching(false);
  };

  const save = () => {
    const now = new Date().toISOString();
    const base = { id: item.id, tags: form.tags, favorite: item.favorite || false, updatedAt: now };
    if (isLink) {
      onSave("links", { ...base, url: form.url, title: form.title || form.url, description: form.description, image: item.image || null, favicon: item.favicon || null });
    } else if (isPrd) {
      onSave("prds", { ...base, title: form.title, body: form.body, claudeMd: form.claudeMd });
    } else {
      onSave("prompts", { ...base, title: form.title, body: form.body });
    }
  };

  const inputStyle = {
    width: "100%", background: T.s1, border: `1px solid ${T.border}`,
    borderRadius: 8, padding: "10px 12px", color: T.text,
    fontSize: 13, fontFamily: isLink ? "'Syne', sans-serif" : "'JetBrains Mono', monospace",
    outline: "none", boxSizing: "border-box", resize: "none",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
      <div style={{ width: 520, height: "100vh", background: T.s1, borderLeft: `1px solid ${T.border}`, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: T.text }}>{isCreate ? "New" : "Edit"} {modal.section === "prds" ? "PRD" : modal.section.slice(0, -1).replace(/^\w/, c => c.toUpperCase())}</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>Craft a reusable entry for your library</div>
          </div>
          <IconBtn onClick={onClose}><I.X /></IconBtn>
        </div>

        <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
          {/* URL for links */}
          {isLink && (
            <div>
              <label style={{ fontSize: 12, color: T.muted, display: "block", marginBottom: 6 }}>URL</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input value={form.url} onChange={e => set("url", e.target.value)} onBlur={fetchLink} placeholder="https://..." style={{ ...inputStyle, flex: 1 }} />
                <Btn onClick={fetchLink} disabled={fetching} style={{ flexShrink: 0 }}>{fetching ? "…" : "Fetch"}</Btn>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label style={{ fontSize: 12, color: T.muted, display: "block", marginBottom: 6 }}>Title</label>
            <input value={form.title} onChange={e => set("title", e.target.value)} placeholder={isLink ? "Site name…" : "Prompt title…"} style={inputStyle} />
          </div>

          {/* Body / Description */}
          {!isLink && !isPrd && (
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: T.muted, display: "block", marginBottom: 6 }}>Prompt Body</label>
              <textarea value={form.body} onChange={e => set("body", e.target.value)} placeholder="Write your prompt here…" rows={12} style={inputStyle} />
            </div>
          )}

          {isLink && (
            <div>
              <label style={{ fontSize: 12, color: T.muted, display: "block", marginBottom: 6 }}>Description</label>
              <textarea value={form.description} onChange={e => set("description", e.target.value)} placeholder="Brief description…" rows={3} style={inputStyle} />
            </div>
          )}

          {/* PRD with tabs */}
          {isPrd && (
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                {["body", "claudeMd"].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    padding: "4px 12px", borderRadius: 6, fontSize: 12, fontFamily: "'Syne',sans-serif",
                    background: activeTab === tab ? T.accentFaint : "transparent",
                    border: `1px solid ${activeTab === tab ? T.accentBorder : T.border}`,
                    color: activeTab === tab ? T.accent : T.muted, cursor: "pointer",
                  }}>
                    {tab === "body" ? "PRD Content" : "Claude.md"}
                  </button>
                ))}
              </div>
              <textarea
                value={activeTab === "body" ? form.body : form.claudeMd}
                onChange={e => set(activeTab, e.target.value)}
                placeholder={activeTab === "body" ? "# PRD\n\n## Overview\n…" : "# Claude.md\n\n## Project\n…"}
                rows={16}
                style={{ ...inputStyle, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}
              />
            </div>
          )}

          {/* Tags */}
          <div>
            <label style={{ fontSize: 12, color: T.muted, display: "block", marginBottom: 6 }}>Tags</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
              {form.tags.map(t => <Tag key={t} label={t} onRemove={() => set("tags", form.tags.filter(x => x !== t))} />)}
            </div>
            <input
              value={form.tagInput}
              onChange={e => set("tagInput", e.target.value)}
              onKeyDown={handleTagKey}
              placeholder="Add tag — press Enter or comma"
              style={{ ...inputStyle, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between" }}>
          {!isCreate && item.id ? (
            <Btn variant="danger" onClick={() => onDelete(modal.section, item.id)}><I.Trash /> Delete</Btn>
          ) : <span />}
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={onClose}>Cancel</Btn>
            <Btn variant="primary" onClick={save}><I.Save /> Save</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SYSTEM PROMPT MODAL ───────────────────────────────────────────────────

function SystemPromptModal({ systemPrompts, activeId, onSave, onClose, model, setModel }) {
  const [prompts, setPrompts] = useState(systemPrompts);
  const [selected, setSelected] = useState(activeId);
  const [editContent, setEditContent] = useState(systemPrompts.find(s => s.id === activeId)?.content || "");
  const [editName, setEditName] = useState(systemPrompts.find(s => s.id === activeId)?.name || "");
  const [dirty, setDirty] = useState(false);

  const selectPrompt = (id) => {
    setSelected(id);
    const sp = prompts.find(s => s.id === id);
    setEditContent(sp?.content || "");
    setEditName(sp?.name || "");
    setDirty(false);
  };

  const saveEdit = () => {
    const updated = prompts.map(s => s.id === selected ? { ...s, content: editContent, name: editName } : s);
    setPrompts(updated);
    setDirty(false);
  };

  const addNew = () => {
    const id = genId();
    const sp = { id, name: "New System Prompt", content: "You are a helpful assistant." };
    setPrompts(p => [...p, sp]);
    selectPrompt(id);
    setTimeout(() => setPrompts(p => [...p.filter(x => x.id !== id), sp]), 0);
  };

  const remove = (id) => {
    if (prompts.length <= 1) return;
    const next = prompts.filter(s => s.id !== id);
    setPrompts(next);
    if (selected === id) selectPrompt(next[0].id);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 800, maxHeight: "85vh", background: T.s1, borderRadius: 14, border: `1px solid ${T.border}`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>System Prompts</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: T.muted }}>Model</span>
              <select value={model} onChange={e => setModel(e.target.value)} style={{
                background: T.s2, border: `1px solid ${T.border}`, borderRadius: 7, color: T.text,
                padding: "5px 10px", fontSize: 12, fontFamily: "'Syne',sans-serif", cursor: "pointer", outline: "none"
              }}>
                {MODELS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
              </select>
            </div>
            <IconBtn onClick={onClose}><I.X /></IconBtn>
          </div>
        </div>
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Left list */}
          <div style={{ width: 220, borderRight: `1px solid ${T.border}`, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 4 }}>
            {prompts.map(sp => (
              <div key={sp.id} onClick={() => selectPrompt(sp.id)} style={{
                padding: "9px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13,
                background: selected === sp.id ? T.accentFaint : "transparent",
                border: `1px solid ${selected === sp.id ? T.accentBorder : "transparent"}`,
                color: selected === sp.id ? T.accent : T.text,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sp.name}</span>
                {prompts.length > 1 && (
                  <button onClick={(e) => { e.stopPropagation(); remove(sp.id); }} style={{ background: "none", border: "none", color: T.dim, cursor: "pointer", padding: "0 2px" }}>×</button>
                )}
              </div>
            ))}
            <button onClick={addNew} style={{
              marginTop: 4, padding: "7px 12px", borderRadius: 8, cursor: "pointer",
              background: "transparent", border: `1px dashed ${T.border}`, color: T.muted,
              fontSize: 12, fontFamily: "'Syne',sans-serif", display: "flex", alignItems: "center", gap: 6
            }}>
              <I.Plus /> New preset
            </button>
          </div>
          {/* Right editor */}
          <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            <input
              value={editName}
              onChange={e => { setEditName(e.target.value); setDirty(true); }}
              placeholder="Preset name…"
              style={{ background: T.s2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 12px", color: T.text, fontSize: 13, fontFamily: "'Syne',sans-serif", outline: "none" }}
            />
            <textarea
              value={editContent}
              onChange={e => { setEditContent(e.target.value); setDirty(true); }}
              style={{
                flex: 1, minHeight: 300, background: T.s2, border: `1px solid ${T.border}`,
                borderRadius: 8, padding: "12px", color: T.text, fontSize: 12,
                fontFamily: "'JetBrains Mono', monospace", outline: "none", resize: "none", lineHeight: 1.7
              }}
            />
          </div>
        </div>
        <div style={{ padding: "14px 24px", borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 12, color: T.muted }}>Active: <span style={{ color: T.accent }}>{prompts.find(s => s.id === selected)?.name}</span></div>
          <div style={{ display: "flex", gap: 8 }}>
            {dirty && <Btn onClick={saveEdit}><I.Save /> Save edits</Btn>}
            <Btn variant="primary" onClick={() => onSave(prompts, selected)}>Set Active & Close</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CARDS ─────────────────────────────────────────────────────────────────

function PromptCard({ item, onEdit, onCopy, onFav, view }) {
  if (view === "list") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", background: T.s1, borderRadius: 10, border: `1px solid ${T.border}` }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</div>
          <div style={{ fontSize: 12, color: T.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>{truncate(item.body, 80)}</div>
        </div>
        <div style={{ display: "flex", gap: 4, flexShrink: 0, flexWrap: "wrap", maxWidth: 200, justifyContent: "flex-end" }}>
          {item.tags.slice(0, 3).map(t => <Tag key={t} label={t} />)}
        </div>
        <div style={{ fontSize: 11, color: T.dim, flexShrink: 0, width: 70, textAlign: "right" }}>{timeAgo(item.updatedAt)}</div>
        <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
          <IconBtn onClick={() => onFav(item.id)} title={item.favorite ? "Unfavorite" : "Favorite"}><I.Star filled={item.favorite} /></IconBtn>
          <IconBtn onClick={() => onCopy(item.body)} title="Copy prompt"><I.Copy /></IconBtn>
          <IconBtn onClick={() => onEdit(item)} title="Edit"><I.Edit /></IconBtn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: T.s1, borderRadius: 12, border: `1px solid ${T.border}`, padding: 18, display: "flex", flexDirection: "column", gap: 12, cursor: "pointer", transition: "border-color 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = T.border.replace("2c", "44")}
      onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T.text, lineHeight: 1.3 }}>{item.title}</div>
        <IconBtn onClick={() => onFav(item.id)}><I.Star filled={item.favorite} /></IconBtn>
      </div>
      <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6, flex: 1 }}>{truncate(item.body, 120)}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {item.tags.map(t => <Tag key={t} label={t} />)}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${T.border}`, paddingTop: 10 }}>
        <span style={{ fontSize: 11, color: T.dim }}>Updated {timeAgo(item.updatedAt)}</span>
        <div style={{ display: "flex", gap: 2 }}>
          <IconBtn onClick={() => onCopy(item.body)} title="Copy"><I.Copy /></IconBtn>
          <IconBtn onClick={() => onEdit(item)} title="Edit"><I.Edit /></IconBtn>
        </div>
      </div>
    </div>
  );
}

function LinkCard({ item, onEdit, onFav, view }) {
  const [imgErr, setImgErr] = useState(false);
  const domain = (() => { try { return new URL(item.url).hostname; } catch { return item.url; } })();

  if (view === "list") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", background: T.s1, borderRadius: 10, border: `1px solid ${T.border}` }}>
        {item.favicon && <img src={item.favicon} width={20} height={20} style={{ borderRadius: 4, flexShrink: 0 }} onError={e => e.target.style.display = "none"} />}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</div>
          <div style={{ fontSize: 11, color: T.muted }}>{domain}</div>
        </div>
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          {item.tags.slice(0, 3).map(t => <Tag key={t} label={t} />)}
        </div>
        <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
          <IconBtn onClick={() => onFav(item.id)}><I.Star filled={item.favorite} /></IconBtn>
          <a href={item.url} target="_blank" rel="noreferrer">
            <IconBtn><I.ExternalLink /></IconBtn>
          </a>
          <IconBtn onClick={() => onEdit(item)}><I.Edit /></IconBtn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: T.s1, borderRadius: 12, border: `1px solid ${T.border}`, overflow: "hidden", display: "flex", flexDirection: "column", transition: "border-color 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#3a3a3a"}
      onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
    >
      {/* OG Image */}
      <div style={{ height: 130, background: T.s2, overflow: "hidden", position: "relative", flexShrink: 0 }}>
        {item.image && !imgErr ? (
          <img src={item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={() => setImgErr(true)} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, background: `linear-gradient(135deg, ${T.s2} 0%, ${T.s3} 100%)` }}>
            {item.favicon ? (
              <img src={item.favicon} width={36} height={36} style={{ borderRadius: 8, opacity: 0.8 }} onError={e => e.target.style.display = "none"} />
            ) : <I.Link />}
            <span style={{ fontSize: 11, color: T.dim }}>{domain}</span>
          </div>
        )}
        <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 4 }}>
          <IconBtn onClick={() => onFav(item.id)}><I.Star filled={item.favorite} /></IconBtn>
        </div>
      </div>
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {item.favicon && <img src={item.favicon} width={14} height={14} style={{ borderRadius: 3 }} onError={e => e.target.style.display = "none"} />}
          <span style={{ fontSize: 11, color: T.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{domain}</span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.text, lineHeight: 1.3 }}>{item.title}</div>
        {item.description && <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{truncate(item.description, 80)}</div>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{item.tags.map(t => <Tag key={t} label={t} />)}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 8 }}>
          <span style={{ fontSize: 11, color: T.dim }}>{timeAgo(item.updatedAt)}</span>
          <div style={{ display: "flex", gap: 2 }}>
            <a href={item.url} target="_blank" rel="noreferrer">
              <IconBtn title="Open"><I.ExternalLink /></IconBtn>
            </a>
            <IconBtn onClick={() => onEdit(item)} title="Edit"><I.Edit /></IconBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrdCard({ item, onEdit, onCopy, onFav, view }) {
  if (view === "list") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", background: T.s1, borderRadius: 10, border: `1px solid ${T.border}` }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</div>
          <div style={{ fontSize: 12, color: T.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{truncate(item.body?.replace(/#+\s/g, ""), 80)}</div>
        </div>
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          {item.tags.slice(0, 3).map(t => <Tag key={t} label={t} />)}
        </div>
        <div style={{ fontSize: 11, color: T.dim, flexShrink: 0 }}>{timeAgo(item.updatedAt)}</div>
        <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
          <IconBtn onClick={() => onFav(item.id)}><I.Star filled={item.favorite} /></IconBtn>
          <IconBtn onClick={() => onCopy(item.body)} title="Copy PRD"><I.Copy /></IconBtn>
          {item.claudeMd && <IconBtn onClick={() => onCopy(item.claudeMd)} title="Copy Claude.md"><span style={{ fontSize: 10, fontFamily: "monospace", color: T.muted }}>⚙</span></IconBtn>}
          <IconBtn onClick={() => onEdit(item)}><I.Edit /></IconBtn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: T.s1, borderRadius: 12, border: `1px solid ${T.border}`, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{item.title}</div>
        <IconBtn onClick={() => onFav(item.id)}><I.Star filled={item.favorite} /></IconBtn>
      </div>
      <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>{truncate(item.body?.replace(/#+\s/g, ""), 140)}</div>
      {item.claudeMd && (
        <div style={{ background: T.s2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: T.muted, fontFamily: "'JetBrains Mono', monospace" }}>Claude.md included</span>
          <IconBtn onClick={() => onCopy(item.claudeMd)} title="Copy Claude.md"><I.Copy /></IconBtn>
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{item.tags.map(t => <Tag key={t} label={t} />)}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${T.border}`, paddingTop: 10 }}>
        <span style={{ fontSize: 11, color: T.dim }}>Updated {timeAgo(item.updatedAt)}</span>
        <div style={{ display: "flex", gap: 2 }}>
          <IconBtn onClick={() => onCopy(item.body)} title="Copy PRD"><I.Copy /></IconBtn>
          <IconBtn onClick={() => onEdit(item)} title="Edit"><I.Edit /></IconBtn>
        </div>
      </div>
    </div>
  );
}

// ─── CHAT PANEL ────────────────────────────────────────────────────────────

function ChatPanel({ messages, input, loading, model, systemPrompts, activeSystemPromptId, onInput, onSend, onClose, onOpenSettings }) {
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const activeModel = MODELS.find(m => m.id === model);

  return (
    <div style={{
      position: "fixed", bottom: 88, right: 24, width: 380, height: 520,
      background: T.s1, border: `1px solid ${T.border}`, borderRadius: 16,
      boxShadow: "0 24px 80px rgba(0,0,0,0.6)", display: "flex", flexDirection: "column",
      zIndex: 90, overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <I.Sparkle />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Muse AI</div>
            <div style={{ fontSize: 10, color: T.muted }}>{activeModel?.label}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <IconBtn onClick={onOpenSettings} title="Settings"><I.Settings /></IconBtn>
          <IconBtn onClick={onClose}><I.X /></IconBtn>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "88%", padding: "10px 13px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
              background: m.role === "user" ? T.accent : T.s2,
              color: m.role === "user" ? "#000" : T.text,
              fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap",
              fontWeight: m.role === "user" ? 600 : 400,
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 4, padding: "8px 12px" }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent, opacity: 0.6, animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "10px 12px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 8, flexShrink: 0 }}>
        <input
          value={input}
          onChange={e => onInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), onSend())}
          placeholder="Ask Muse to create or improve…"
          style={{ flex: 1, background: T.s2, border: `1px solid ${T.border}`, borderRadius: 9, padding: "8px 12px", color: T.text, fontSize: 13, fontFamily: "'Syne',sans-serif", outline: "none" }}
        />
        <button onClick={onSend} disabled={loading || !input.trim()} style={{
          width: 36, height: 36, borderRadius: 9, background: T.accent, border: "none",
          color: "#000", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          opacity: loading || !input.trim() ? 0.4 : 1,
        }}>
          <I.Send />
        </button>
      </div>
    </div>
  );
}

// ─── CLI OVERLAY ───────────────────────────────────────────────────────────

function CLIOverlay({ input, history, onInput, onRun, onClose, inputRef }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 600, background: T.s1, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", boxShadow: "0 32px 100px rgba(0,0,0,0.8)" }}>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: T.accent }}>
            <I.Terminal />
            <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono',monospace" }}>Muse CLI — ⌘K to toggle</span>
          </div>
          <IconBtn onClick={onClose}><I.X /></IconBtn>
        </div>
        {history.length > 0 && (
          <div style={{ padding: "10px 16px", maxHeight: 200, overflowY: "auto" }}>
            {history.map((h, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 12, color: T.accent, fontFamily: "'JetBrains Mono',monospace" }}>› {h.cmd}</div>
                <div style={{ fontSize: 12, color: T.muted, fontFamily: "'JetBrains Mono',monospace", whiteSpace: "pre", paddingLeft: 12 }}>{h.output}</div>
              </div>
            ))}
          </div>
        )}
        <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 8, borderTop: history.length > 0 ? `1px solid ${T.border}` : "none" }}>
          <span style={{ color: T.accent, fontFamily: "'JetBrains Mono',monospace", fontSize: 14 }}>›</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => onInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") { e.preventDefault(); onRun(input); }
              if (e.key === "Escape") onClose();
            }}
            placeholder="/help for commands…"
            style={{ flex: 1, background: "transparent", border: "none", color: T.text, fontSize: 14, fontFamily: "'JetBrains Mono',monospace", outline: "none" }}
          />
        </div>
        <div style={{ padding: "8px 16px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 12, flexWrap: "wrap" }}>
          {["/new prompt", "/new prd", "/new link", "/goto prompts", "/export", "/ai [msg]", "/help"].map(cmd => (
            <button key={cmd} onClick={() => onInput(cmd + " ")} style={{
              background: T.s2, border: `1px solid ${T.border}`, borderRadius: 5,
              color: T.muted, fontSize: 11, fontFamily: "'JetBrains Mono',monospace",
              padding: "3px 8px", cursor: "pointer"
            }}>{cmd}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── EXPORT MODAL ──────────────────────────────────────────────────────────

function ExportModal({ data, onClose }) {
  const json = JSON.stringify(data, null, 2);
  const [copied, setCopied] = useState(false);

  const doCopy = () => {
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback: select the textarea
      const ta = document.getElementById("muse-export-ta");
      if (ta) { ta.select(); document.execCommand("copy"); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 640, maxHeight: "80vh", background: T.s1, borderRadius: 14, border: `1px solid ${T.border}`, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ padding: "18px 22px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>Export Library</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
              {data.prompts.length} prompts · {data.links.length} links · {data.prds.length} PRDs
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Btn variant="primary" onClick={doCopy}>
              {copied ? "✓ Copied!" : <><I.Copy /> Copy JSON</>}
            </Btn>
            <IconBtn onClick={onClose}><I.X /></IconBtn>
          </div>
        </div>
        <textarea
          id="muse-export-ta"
          readOnly
          value={json}
          style={{
            flex: 1, minHeight: 400, background: T.bg, border: "none", color: "#6ee7b7",
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, lineHeight: 1.7,
            padding: 20, outline: "none", resize: "none",
          }}
        />
        <div style={{ padding: "12px 22px", borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: T.dim, fontFamily: "'JetBrains Mono',monospace" }}>
            muse-export-{new Date().toISOString().slice(0, 10)}.json
          </span>
          <span style={{ fontSize: 11, color: T.dim }}>Copy and save as .json to import later</span>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────

export default function MuseApp() {
  useEffect(() => {
    const el = document.createElement("link");
    el.rel = "stylesheet";
    el.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap";
    document.head.appendChild(el);
    const style = document.createElement("style");
    style.textContent = `@keyframes pulse { 0%,80%,100% { transform: scale(0); opacity:0.3 } 40% { transform: scale(1); opacity:1 } } * { box-sizing: border-box; } ::-webkit-scrollbar { width: 5px; height: 5px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; } ::-webkit-scrollbar-thumb:hover { background: #444; }`;
    document.head.appendChild(style);
  }, []);

  // ── PERSISTENCE: load from storage on mount ──────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const [p, l, r, sp, spId] = await Promise.all([
          window.storage.get("muse_prompts"),
          window.storage.get("muse_links"),
          window.storage.get("muse_prds"),
          window.storage.get("muse_sysprompts"),
          window.storage.get("muse_active_sp"),
        ]);
        if (p?.value)    setPrompts(JSON.parse(p.value));
        if (l?.value)    setLinks(JSON.parse(l.value));
        if (r?.value)    setPrds(JSON.parse(r.value));
        if (sp?.value)   setSystemPrompts(JSON.parse(sp.value));
        if (spId?.value) setActiveSPId(spId.value);
      } catch (e) {
        console.warn("Muse: storage load failed", e);
      } finally {
        storageLoaded.current = true;
      }
    };
    load();
  }, []);

  // ── PERSISTENCE: write-through on every change ───────────────────────────
  useEffect(() => {
    if (!storageLoaded.current) return;
    window.storage.set("muse_prompts", JSON.stringify(prompts)).catch(() => {});
  }, [prompts]);

  useEffect(() => {
    if (!storageLoaded.current) return;
    window.storage.set("muse_links", JSON.stringify(links)).catch(() => {});
  }, [links]);

  useEffect(() => {
    if (!storageLoaded.current) return;
    window.storage.set("muse_prds", JSON.stringify(prds)).catch(() => {});
  }, [prds]);

  useEffect(() => {
    if (!storageLoaded.current) return;
    window.storage.set("muse_sysprompts", JSON.stringify(systemPrompts)).catch(() => {});
  }, [systemPrompts]);

  useEffect(() => {
    if (!storageLoaded.current) return;
    window.storage.set("muse_active_sp", activeSPId).catch(() => {});
  }, [activeSPId]);

  const [section, setSection] = useState("prompts");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState({ prompts: "card", links: "card", prds: "card" });
  const [prompts, setPrompts] = useState(INIT_PROMPTS);
  const [links, setLinks] = useState(INIT_LINKS);
  const [prds, setPrds] = useState(INIT_PRDS);
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState(null);
  const [modal, setModal] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([{
    role: "assistant",
    content: "Hi! I'm Muse AI ✦\n\nAsk me to create prompts, PRDs, or full project setups.\n\nTry: \"Create an optimized prompt and PRD for a task manager app on React + Cloudflare\"",
  }]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [model, setModel] = useState(MODELS[0].id);
  const [systemPrompts, setSystemPrompts] = useState(INIT_SYS_PROMPTS);
  const [activeSPId, setActiveSPId] = useState("sp1");
  const [showSPModal, setShowSPModal] = useState(false);
  const [cliOpen, setCliOpen] = useState(false);
  const [cliInput, setCliInput] = useState("");
  const [cliHistory, setCliHistory] = useState([]);
  const [toast, setToast] = useState(null);
  const [showFavs, setShowFavs] = useState(false);
  const [exportModal, setExportModal] = useState(false);

  const cliInputRef = useRef(null);
  const storageLoaded = useRef(false);
  const activeSP = systemPrompts.find(s => s.id === activeSPId)?.content || DEFAULT_SYS;

  const allTags = {
    prompts: [...new Set(prompts.flatMap(p => p.tags))],
    links: [...new Set(links.flatMap(l => l.tags))],
    prds: [...new Set(prds.flatMap(r => r.tags))],
  };

  const getItems = () => {
    const src = section === "prompts" ? prompts : section === "links" ? links : prds;
    return src.filter(item => {
      const matchSearch = !search || [item.title, item.body || item.url || "", item.description || ""].some(s => s?.toLowerCase().includes(search.toLowerCase()));
      const matchTag = !filterTag || item.tags.includes(filterTag);
      const matchFav = !showFavs || item.favorite;
      return matchSearch && matchTag && matchFav;
    });
  };

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const saveItem = useCallback((type, item) => {
    const now = new Date().toISOString();
    const setter = type === "prompts" ? setPrompts : type === "links" ? setLinks : setPrds;
    if (item.id) {
      setter(prev => prev.map(p => p.id === item.id ? { ...item, updatedAt: now } : p));
    } else {
      setter(prev => [{ ...item, id: genId(), updatedAt: now }, ...prev]);
    }
    showToast("Saved ✓");
    setModal(null);
  }, []);

  const deleteItem = useCallback((type, id) => {
    const setter = type === "prompts" ? setPrompts : type === "links" ? setLinks : setPrds;
    setter(prev => prev.filter(p => p.id !== id));
    showToast("Deleted");
    setModal(null);
  }, []);

  const toggleFav = useCallback((type, id) => {
    const setter = type === "prompts" ? setPrompts : type === "links" ? setLinks : setPrds;
    setter(prev => prev.map(item => item.id === id ? { ...item, favorite: !item.favorite } : item));
  }, []);

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard");
  };

  const exportAll = () => {
    setExportModal(true);
  };

  const sendChat = useCallback(async (override) => {
    const txt = (override || chatInput).trim();
    if (!txt || chatLoading) return;
    const msgs = [...chatMessages, { role: "user", content: txt }];
    setChatMessages(msgs);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          max_tokens: 1000,
          system: activeSP + `\n\nContext: Library has ${prompts.length} prompts, ${links.length} links, ${prds.length} PRDs. Current section: ${section}.`,
          messages: msgs.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const content = data.content?.[0]?.text || "API error — check connection.";
      setChatMessages(prev => [...prev, { role: "assistant", content }]);

      // Process action blocks
      const actions = parseAIActions(content);
      for (const action of actions) {
        if (action.action === "create") {
          const now = new Date().toISOString();
          const base = { id: genId(), tags: action.tags || [], favorite: false, updatedAt: now };
          if (action.type === "prompt") {
            setPrompts(prev => [{ ...base, title: action.title || "AI Prompt", body: action.body || "" }, ...prev]);
            showToast("AI created a prompt →");
          } else if (action.type === "prd") {
            setPrds(prev => [{ ...base, title: action.title || "AI PRD", body: action.body || "", claudeMd: action.claudeMd || "" }, ...prev]);
            showToast("AI created a PRD →");
          } else if (action.type === "link") {
            setLinks(prev => [{ ...base, url: action.url || "", title: action.title || action.url, description: action.description || "", image: null, favicon: null }, ...prev]);
            showToast("AI added a link →");
          }
        }
      }
    } catch {
      setChatMessages(prev => [...prev, { role: "assistant", content: "Error connecting to Anthropic API. Check your connection." }]);
    } finally {
      setChatLoading(false);
    }
  }, [chatInput, chatMessages, chatLoading, model, activeSP, prompts.length, links.length, prds.length, section]);

  // CLI handler
  const handleCLI = (cmd) => {
    const parts = cmd.trim().split(/\s+/);
    const c = parts[0]?.toLowerCase();
    const args = parts.slice(1).join(" ");
    let out = "";

    if (c === "/new" || c === ":new") {
      const t = parts[1]?.toLowerCase();
      if (["prompt", "link", "prd"].includes(t)) {
        const sec = t === "prd" ? "prds" : t + "s";
        setModal({ type: "create", section: sec });
        setSection(sec);
        out = `Opening new ${t} form…`;
        setCliOpen(false);
      } else { out = "Usage: /new [prompt|link|prd]"; }
    } else if (c === "/search" || c === ":search") {
      setSearch(args); out = `Searching: "${args}"`;
    } else if (c === "/export" || c === ":export") {
      exportAll(); out = "Exporting…"; setCliOpen(false);
    } else if (c === "/goto" || c === ":goto" || c === "/section") {
      if (["prompts", "links", "prds"].includes(parts[1])) { setSection(parts[1]); out = `→ ${parts[1]}`; setCliOpen(false); }
      else out = "Usage: /goto [prompts|links|prds]";
    } else if (c === "/view" || c === ":view") {
      if (["card", "list"].includes(parts[1])) { setViewMode(prev => ({ ...prev, [section]: parts[1] })); out = `View: ${parts[1]}`; setCliOpen(false); }
      else out = "Usage: /view [card|list]";
    } else if (c === "/ai" || c === ":ai") {
      setChatOpen(true); sendChat(args); out = "Sending to AI…"; setCliOpen(false);
    } else if (c === "/favs" || c === ":favs") {
      setShowFavs(f => !f); out = "Toggled favorites filter";
    } else if (c === "/clear") {
      setCliHistory([]); setCliInput(""); return;
    } else if (c === "/help") {
      out = "/new [prompt|link|prd]  /goto [section]  /search [q]  /view [card|list]  /export  /ai [msg]  /favs  /clear";
    } else {
      out = c ? `Unknown: ${c}. Try /help.` : "";
    }
    if (out) setCliHistory(prev => [...prev, { cmd, output: out }]);
    setCliInput("");
  };

  useEffect(() => {
    const fn = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCliOpen(v => !v); }
      if (e.key === "Escape") { setCliOpen(false); setModal(null); }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  useEffect(() => {
    if (cliOpen) setTimeout(() => cliInputRef.current?.focus(), 60);
  }, [cliOpen]);

  useEffect(() => { setFilterTag(null); }, [section]);

  const items = getItems();
  const vm = viewMode[section];
  const currentTags = allTags[section] || [];

  const sectionConfig = {
    prompts: { label: "Prompts", icon: <I.Book />, color: "#f59e0b" },
    links: { label: "Links", icon: <I.Link />, color: "#3b82f6" },
    prds: { label: "PRDs", icon: <I.FileText />, color: "#a855f7" },
  };

  return (
    <div style={{ background: T.bg, color: T.text, fontFamily: "'Syne', sans-serif", height: "100vh", display: "flex", overflow: "hidden", position: "relative" }}>

      {/* ── SIDEBAR ── */}
      <div style={{
        width: sidebarOpen ? 220 : 56, transition: "width 0.2s ease",
        background: T.s1, borderRight: `1px solid ${T.border}`,
        display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{ padding: sidebarOpen ? "18px 20px" : "18px 0", display: "flex", alignItems: "center", gap: 10, justifyContent: sidebarOpen ? "flex-start" : "center", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ width: 30, height: 30, background: T.accent, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5"><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" /></svg>
          </div>
          {sidebarOpen && <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em" }}>Muse</span>}
        </div>

        {/* Nav */}
        <div style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
          {Object.entries(sectionConfig).map(([key, cfg]) => {
            const active = section === key;
            const count = key === "prompts" ? prompts.length : key === "links" ? links.length : prds.length;
            return (
              <button key={key} onClick={() => setSection(key)} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: sidebarOpen ? "8px 12px" : "8px 0", justifyContent: sidebarOpen ? "flex-start" : "center",
                borderRadius: 8, cursor: "pointer", border: "none",
                background: active ? T.accentFaint : "transparent",
                color: active ? T.accent : T.muted,
                width: "100%", transition: "all 0.15s", fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: active ? 600 : 400,
              }}>
                <span style={{ flexShrink: 0 }}>{cfg.icon}</span>
                {sidebarOpen && (
                  <span style={{ flex: 1, textAlign: "left" }}>{cfg.label}</span>
                )}
                {sidebarOpen && (
                  <span style={{ fontSize: 11, background: active ? T.accentFaint : T.s3, border: `1px solid ${active ? T.accentBorder : T.border}`, color: active ? T.accent : T.dim, borderRadius: 4, padding: "1px 5px" }}>{count}</span>
                )}
              </button>
            );
          })}

          <div style={{ height: 1, background: T.border, margin: "8px 4px" }} />

          <button onClick={() => setShowFavs(f => !f)} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: sidebarOpen ? "8px 12px" : "8px 0", justifyContent: sidebarOpen ? "flex-start" : "center",
            borderRadius: 8, cursor: "pointer", border: "none",
            background: showFavs ? "rgba(245,158,11,0.08)" : "transparent",
            color: showFavs ? T.accent : T.muted,
            width: "100%", fontSize: 14, fontFamily: "'Syne',sans-serif",
          }}>
            <I.Star filled={showFavs} />
            {sidebarOpen && <span>Favorites</span>}
          </button>

          <button onClick={() => setShowSPModal(true)} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: sidebarOpen ? "8px 12px" : "8px 0", justifyContent: sidebarOpen ? "flex-start" : "center",
            borderRadius: 8, cursor: "pointer", border: "none",
            background: "transparent", color: T.muted,
            width: "100%", fontSize: 14, fontFamily: "'Syne',sans-serif",
          }}>
            <I.Settings />
            {sidebarOpen && <span>Settings</span>}
          </button>
        </div>

        {/* CLI hint */}
        {sidebarOpen && (
          <div style={{ padding: "12px 16px", borderTop: `1px solid ${T.border}` }}>
            <button onClick={() => setCliOpen(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: T.s2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "7px 10px", cursor: "pointer", width: "100%", color: T.muted, fontSize: 12, fontFamily: "'JetBrains Mono',monospace" }}>
              <I.Terminal />
              <span style={{ flex: 1 }}>CLI</span>
              <kbd style={{ fontSize: 10, background: T.s3, border: `1px solid ${T.border}`, borderRadius: 4, padding: "1px 5px", color: T.dim }}>⌘K</kbd>
            </button>
          </div>
        )}

        {/* Toggle */}
        <button onClick={() => setSidebarOpen(v => !v)} style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "12px", borderTop: `1px solid ${T.border}`, cursor: "pointer",
          background: "transparent", border: "none", color: T.muted,
        }}>
          {sidebarOpen ? <I.ChevronLeft /> : <I.ChevronRight />}
        </button>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ padding: "14px 24px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
              <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: T.dim }}><I.Search /></span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={`Search ${sectionConfig[section].label.toLowerCase()}…`}
                style={{ width: "100%", background: T.s1, border: `1px solid ${T.border}`, borderRadius: 9, padding: "8px 12px 8px 34px", color: T.text, fontSize: 13, fontFamily: "'Syne',sans-serif", outline: "none" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {/* Tag filter pills */}
            {currentTags.slice(0, 5).map(tag => (
              <Tag key={tag} label={tag} active={filterTag === tag} onClick={() => setFilterTag(filterTag === tag ? null : tag)} />
            ))}

            <div style={{ width: 1, height: 24, background: T.border, margin: "0 4px" }} />

            {/* View toggle */}
            <div style={{ display: "flex", background: T.s1, border: `1px solid ${T.border}`, borderRadius: 8, padding: 3, gap: 2 }}>
              {["card", "list"].map(v => (
                <button key={v} onClick={() => setViewMode(prev => ({ ...prev, [section]: v }))} style={{
                  padding: "4px 8px", borderRadius: 6, cursor: "pointer", border: "none",
                  background: vm === v ? T.accent : "transparent",
                  color: vm === v ? "#000" : T.muted,
                  display: "flex", alignItems: "center",
                }}>
                  {v === "card" ? <I.Grid /> : <I.List />}
                </button>
              ))}
            </div>

            <Btn onClick={exportAll} title="Export all as JSON"><I.Download /> Export</Btn>

            <Btn variant="primary" onClick={() => setModal({ type: "create", section })}>
              <I.Plus /> New {sectionConfig[section].label.slice(0, -1)}
            </Btn>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {items.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, color: T.dim }}>
              <div style={{ fontSize: 40 }}>∅</div>
              <div style={{ fontSize: 14 }}>No {sectionConfig[section].label.toLowerCase()} found</div>
              <Btn variant="primary" onClick={() => setModal({ type: "create", section })}><I.Plus /> Create one</Btn>
            </div>
          ) : vm === "card" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {items.map(item => {
                if (section === "prompts") return <PromptCard key={item.id} item={item} view="card" onEdit={item => setModal({ type: "edit", section, item })} onCopy={copy} onFav={id => toggleFav(section, id)} />;
                if (section === "links") return <LinkCard key={item.id} item={item} view="card" onEdit={item => setModal({ type: "edit", section, item })} onFav={id => toggleFav(section, id)} />;
                return <PrdCard key={item.id} item={item} view="card" onEdit={item => setModal({ type: "edit", section, item })} onCopy={copy} onFav={id => toggleFav(section, id)} />;
              })}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {items.map(item => {
                if (section === "prompts") return <PromptCard key={item.id} item={item} view="list" onEdit={item => setModal({ type: "edit", section, item })} onCopy={copy} onFav={id => toggleFav(section, id)} />;
                if (section === "links") return <LinkCard key={item.id} item={item} view="list" onEdit={item => setModal({ type: "edit", section, item })} onFav={id => toggleFav(section, id)} />;
                return <PrdCard key={item.id} item={item} view="list" onEdit={item => setModal({ type: "edit", section, item })} onCopy={copy} onFav={id => toggleFav(section, id)} />;
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── MODALS ── */}
      {modal && <Modal modal={modal} onClose={() => setModal(null)} onSave={saveItem} onDelete={deleteItem} />}
      {exportModal && (
        <ExportModal
          data={{ prompts, links, prds, meta: { exportedAt: new Date().toISOString(), version: "1.0" } }}
          onClose={() => setExportModal(false)}
        />
      )}
      {showSPModal && (
        <SystemPromptModal
          systemPrompts={systemPrompts}
          activeId={activeSPId}
          model={model}
          setModel={setModel}
          onClose={() => setShowSPModal(false)}
          onSave={(sps, id) => { setSystemPrompts(sps); setActiveSPId(id); setShowSPModal(false); showToast("System prompt saved"); }}
        />
      )}

      {/* ── CHAT ── */}
      {chatOpen && (
        <ChatPanel
          messages={chatMessages}
          input={chatInput}
          loading={chatLoading}
          model={model}
          systemPrompts={systemPrompts}
          activeSystemPromptId={activeSPId}
          onInput={setChatInput}
          onSend={sendChat}
          onClose={() => setChatOpen(false)}
          onOpenSettings={() => { setChatOpen(false); setShowSPModal(true); }}
        />
      )}

      {/* Chat FAB */}
      <button
        onClick={() => setChatOpen(v => !v)}
        style={{
          position: "fixed", bottom: 24, right: 24, width: 52, height: 52, borderRadius: "50%",
          background: T.accent, border: "none", color: "#000", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 32px rgba(245,158,11,0.4)", zIndex: 80,
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(245,158,11,0.5)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(245,158,11,0.4)"; }}
        title="Muse AI Assistant"
      >
        {chatOpen ? <I.X /> : <I.Chat />}
      </button>

      {/* ── CLI ── */}
      {cliOpen && (
        <CLIOverlay
          input={cliInput}
          history={cliHistory}
          onInput={setCliInput}
          onRun={handleCLI}
          onClose={() => setCliOpen(false)}
          inputRef={cliInputRef}
        />
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)",
          background: T.s2, border: `1px solid ${T.border}`, borderRadius: 10,
          padding: "10px 20px", fontSize: 13, color: T.text, zIndex: 500,
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)", whiteSpace: "nowrap",
          animation: "toastIn 0.2s ease",
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
