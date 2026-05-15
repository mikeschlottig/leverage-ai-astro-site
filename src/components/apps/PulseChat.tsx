import { useState, useRef, useEffect, useCallback } from "react";

// ─── Fonts & global styles ────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #04080f;
      --surface: #080f1a;
      --surface2: #0c1525;
      --border: #111e30;
      --border2: #162034;
      --text: #dde6f0;
      --muted: #3d5470;
      --dim: #1a2d44;
      --accent: #0ea5e9;
      --accent2: #6366f1;
      --green: #10b981;
      --amber: #f59e0b;
      --red: #ef4444;
    }

    html, body, #root { height: 100%; background: var(--bg); color: var(--text); }
    body { font-family: 'DM Sans', sans-serif; overflow: hidden; }

    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 99px; }

    textarea { font-family: inherit; }
    textarea:focus, input:focus { outline: none; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes blink {
      0%,100% { opacity: 1; } 50% { opacity: 0; }
    }
    @keyframes ping {
      0%   { transform: scale(1);   opacity: 0.8; }
      100% { transform: scale(2.2); opacity: 0;   }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    .msg-enter { animation: fadeUp 0.22s ease forwards; }
    .typing-dot {
      display: inline-block; width: 5px; height: 5px; border-radius: 50%;
      background: var(--accent); margin: 0 2px;
      animation: blink 1.1s ease infinite;
    }
    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  `}</style>
);

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 8);
const ago = (ms) => {
  const d = Date.now() - ms, m = Math.floor(d / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
};

// ─── Ring ─────────────────────────────────────────────────────────────────────
function Ring({ pct }) {
  const r = 13, c = 2 * Math.PI * r;
  const color = pct === 100 ? "var(--green)" : pct >= 60 ? "var(--accent)" : "var(--amber)";
  return (
    <svg width="34" height="34" style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx="17" cy="17" r={r} fill="none" stroke="var(--dim)" strokeWidth="2.5" />
      <circle cx="17" cy="17" r={r} fill="none" stroke={color} strokeWidth="2.5"
        strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c}
        strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.5s ease" }} />
    </svg>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 5000); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 100,
      background: "var(--surface2)", border: "1px solid var(--accent)",
      borderRadius: 12, padding: "13px 16px", maxWidth: 300,
      boxShadow: "0 0 40px rgba(14,165,233,0.15)",
      animation: "fadeUp 0.25s ease",
      display: "flex", gap: 10, alignItems: "flex-start",
    }}>
      <span style={{ fontSize: 16 }}>⏰</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: "var(--accent)", fontFamily: "'DM Mono', monospace", marginBottom: 3 }}>REMINDER</div>
        <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>{msg}</div>
      </div>
      <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 14, padding: 0 }}>✕</button>
    </div>
  );
}

// ─── Tool execution (in-browser, no server needed) ───────────────────────────
function executeTools(toolCalls, state, setState, scheduleToast) {
  const results = [];
  let newState = { ...state };

  for (const call of toolCalls) {
    const { name, input } = call;

    if (name === "add_note") {
      const note = { id: uid(), content: input.content, tags: input.tags ?? [], pinned: input.pinned ?? false, createdAt: Date.now() };
      newState = { ...newState, notes: [...newState.notes, note] };
      results.push({ id: call.id, result: `Note saved [${note.id}]` });
    }
    else if (name === "delete_note") {
      newState = { ...newState, notes: newState.notes.filter(n => !n.id.startsWith(input.id_prefix)) };
      results.push({ id: call.id, result: "Note deleted" });
    }
    else if (name === "toggle_pin") {
      newState = { ...newState, notes: newState.notes.map(n => n.id.startsWith(input.id_prefix) ? { ...n, pinned: !n.pinned } : n) };
      results.push({ id: call.id, result: "Toggled" });
    }
    else if (name === "upsert_goal") {
      if (input.existing_id) {
        newState = { ...newState, goals: newState.goals.map(g => g.id.startsWith(input.existing_id) ? { ...g, text: input.text, progress: input.progress, completedAt: input.progress === 100 ? Date.now() : g.completedAt } : g) };
      } else {
        const goal = { id: uid(), text: input.text, progress: input.progress ?? 0, createdAt: Date.now() };
        newState = { ...newState, goals: [...newState.goals, goal] };
      }
      results.push({ id: call.id, result: "Goal saved" });
    }
    else if (name === "delete_goal") {
      newState = { ...newState, goals: newState.goals.filter(g => !g.id.startsWith(input.id_prefix)) };
      results.push({ id: call.id, result: "Goal deleted" });
    }
    else if (name === "schedule_reminder") {
      const ms = input.delay_minutes * 60 * 1000;
      setTimeout(() => scheduleToast(input.message), ms);
      const fireAt = new Date(Date.now() + ms).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      results.push({ id: call.id, result: `Reminder set for ${fireAt}` });
    }

    setState(newState);
  }

  return results;
}

// ─── Claude API call ──────────────────────────────────────────────────────────
const TOOLS = [
  { name: "add_note", description: "Save a note the user wants captured", input_schema: { type: "object", required: ["content"], properties: { content: { type: "string" }, tags: { type: "array", items: { type: "string" } }, pinned: { type: "boolean" } } } },
  { name: "delete_note", description: "Delete a note", input_schema: { type: "object", required: ["id_prefix"], properties: { id_prefix: { type: "string", description: "First 6 chars of note ID" } } } },
  { name: "toggle_pin", description: "Pin or unpin a note", input_schema: { type: "object", required: ["id_prefix"], properties: { id_prefix: { type: "string" } } } },
  { name: "upsert_goal", description: "Create or update a goal", input_schema: { type: "object", required: ["text", "progress"], properties: { text: { type: "string" }, progress: { type: "number", minimum: 0, maximum: 100 }, existing_id: { type: "string", description: "ID prefix of goal to update" } } } },
  { name: "delete_goal", description: "Delete a goal", input_schema: { type: "object", required: ["id_prefix"], properties: { id_prefix: { type: "string" } } } },
  { name: "schedule_reminder", description: "Schedule a reminder toast after a delay", input_schema: { type: "object", required: ["message", "delay_minutes"], properties: { message: { type: "string" }, delay_minutes: { type: "number", minimum: 0.1 } } } },
];

async function callClaude(messages, state) {
  const { notes, goals } = state;
  const system = `You are Pulse, a sharp personal productivity assistant.
You help users capture notes, set goals, and schedule reminders.

=== Current data ===
Goals (${goals.length}): ${goals.length === 0 ? "none" : goals.map(g => `[${g.id}] "${g.text}" ${g.progress}%`).join(", ")}
Notes (${notes.length}, latest 6): ${notes.length === 0 ? "none" : notes.slice(-6).map(n => `[${n.id}]${n.pinned ? "📌" : ""} ${n.content.slice(0, 60)}`).join(" | ")}
====================

Rules:
- Be concise and direct. Never verbose.
- ALWAYS call the right tool when the user wants something captured, tracked, or scheduled.
- Reference their data naturally in conversation.
- For reminders, ask for timeframe if not given.`;

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system, messages, tools: TOOLS }),
  });
  return resp.json();
}

// ─── Sidebar cards ────────────────────────────────────────────────────────────
function GoalCard({ goal }) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", display: "flex", gap: 10, alignItems: "center", animation: "fadeUp 0.2s ease" }}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <Ring pct={goal.progress} />
        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontFamily: "'DM Mono',monospace", color: "var(--muted)" }}>{goal.progress}</span>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, color: goal.progress === 100 ? "var(--muted)" : "var(--text)", textDecoration: goal.progress === 100 ? "line-through" : "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{goal.text}</div>
        <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2, fontFamily: "'DM Mono',monospace" }}>{ago(goal.createdAt)} · {goal.id}</div>
      </div>
    </div>
  );
}

function NoteCard({ note }) {
  return (
    <div style={{ background: note.pinned ? "#081422" : "var(--surface)", border: `1px solid ${note.pinned ? "#0d2d4a" : "var(--border)"}`, borderRadius: 10, padding: "10px 12px", animation: "fadeUp 0.2s ease" }}>
      <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.55, margin: 0 }}>
        {note.pinned && <span style={{ marginRight: 5, fontSize: 11 }}>📌</span>}{note.content}
      </p>
      <div style={{ display: "flex", gap: 5, marginTop: 7, flexWrap: "wrap", alignItems: "center" }}>
        {note.tags.map(t => <span key={t} style={{ background: "var(--dim)", color: "var(--muted)", fontSize: 10, padding: "2px 7px", borderRadius: 99, fontFamily: "'DM Mono',monospace" }}>{t}</span>)}
        <span style={{ fontSize: 10, color: "var(--muted)", marginLeft: "auto", fontFamily: "'DM Mono',monospace" }}>{ago(note.createdAt)} · {note.id}</span>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Pulse() {
  const [state, setState] = useState({ notes: [], goals: [] });
  const [messages, setMessages] = useState([]); // Anthropic API format
  const [display, setDisplay] = useState([]);   // {role, content} for UI
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("goals");
  const [toast, setToast] = useState(null);
  const bottomRef = useRef(null);
  const taRef = useRef(null);

  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [display, loading]);

  const updateState = useCallback((s) => { setState(s); stateRef.current = s; }, []);
  const scheduleToast = useCallback((msg) => setToast(msg), []);

  const send = async (text) => {
    if (!text.trim() || loading) return;
    setInput("");
    setLoading(true);

    const userMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setDisplay(d => [...d, { role: "user", content: text }]);

    let apiMessages = newMessages;

    // Agentic loop — handle tool use
    for (let step = 0; step < 5; step++) {
      const data = await callClaude(apiMessages, stateRef.current);

      if (data.stop_reason === "end_turn" || !data.content) {
        const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("") ?? "";
        if (text) setDisplay(d => [...d, { role: "assistant", content: text }]);
        setMessages([...apiMessages, { role: "assistant", content: data.content }]);
        break;
      }

      if (data.stop_reason === "tool_use") {
        const toolCalls = data.content.filter(b => b.type === "tool_use");
        const textBlocks = data.content.filter(b => b.type === "text");
        if (textBlocks.length) setDisplay(d => [...d, { role: "assistant", content: textBlocks.map(b => b.text).join("") }]);

        // Execute tools in-browser
        const results = executeTools(toolCalls, stateRef.current, updateState, scheduleToast);

        // Build tool result messages
        const assistantMsg = { role: "assistant", content: data.content };
        const toolResultMsg = {
          role: "user",
          content: results.map(r => ({ type: "tool_result", tool_use_id: r.id, content: r.result })),
        };

        apiMessages = [...apiMessages, assistantMsg, toolResultMsg];
        continue;
      }

      break;
    }

    setLoading(false);
  };

  const goals = state.goals;
  const notes = state.notes;
  const active = goals.filter(g => g.progress < 100);
  const done = goals.filter(g => g.progress === 100);
  const pinned = notes.filter(n => n.pinned);
  const unpinned = notes.filter(n => !n.pinned);

  const suggestions = [
    "I want to launch the beta by end of month",
    "Note: call dentist Thursday 2pm 📌",
    "Remind me in 30 minutes to drink water",
    "What am I working on?",
  ];

  return (
    <>
      <GlobalStyle />
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

        {/* ── Sidebar ── */}
        <aside style={{ width: 270, flexShrink: 0, borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", background: "var(--surface)" }}>

          {/* Logo */}
          <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, var(--accent), var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>⚡</div>
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: -0.5 }}>PULSE</div>
                <div style={{ fontSize: 10, color: "var(--muted)", fontFamily: "'DM Mono',monospace", letterSpacing: 0.5 }}>personal agent</div>
              </div>
              {/* Live indicator */}
              <div style={{ marginLeft: "auto", position: "relative", width: 8, height: 8 }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "var(--green)", animation: "ping 1.8s ease-out infinite", opacity: 0.6 }} />
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)" }} />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, padding: "10px 12px", borderBottom: "1px solid var(--border)" }}>
            {[["goals", goals.length, "var(--accent)"], ["done", done.length, "var(--green)"], ["notes", notes.length, "var(--accent2)"]].map(([l, v, c]) => (
              <div key={l} style={{ background: "var(--bg)", borderRadius: 8, padding: "8px 0", textAlign: "center" }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: c, fontFamily: "'Syne',sans-serif" }}>{v}</div>
                <div style={{ fontSize: 9, color: "var(--muted)", fontFamily: "'DM Mono',monospace", letterSpacing: 0.5, textTransform: "uppercase" }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
            {["goals", "notes"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: "9px 0", background: "none", border: "none",
                borderBottom: `2px solid ${tab === t ? "var(--accent)" : "transparent"}`,
                color: tab === t ? "var(--accent)" : "var(--muted)",
                cursor: "pointer", fontSize: 11, fontFamily: "'DM Mono',monospace",
                letterSpacing: 0.5, textTransform: "uppercase", transition: "all 0.15s",
              }}>{t}</button>
            ))}
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "10px 10px" }}>
            {tab === "goals" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {goals.length === 0
                  ? <Empty icon="🎯" text='Tell me a goal — "I want to ship by Friday"' />
                  : <>
                    {active.map(g => <GoalCard key={g.id} goal={g} />)}
                    {done.length > 0 && <>
                      <div style={{ fontSize: 9, color: "var(--muted)", fontFamily: "'DM Mono',monospace", letterSpacing: 1, textTransform: "uppercase", padding: "6px 4px 2px" }}>completed</div>
                      {done.map(g => <GoalCard key={g.id} goal={g} />)}
                    </>}
                  </>}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {notes.length === 0
                  ? <Empty icon="📝" text='Capture anything — "Note: meeting at 3pm"' />
                  : <>
                    {pinned.map(n => <NoteCard key={n.id} note={n} />)}
                    {[...unpinned].reverse().map(n => <NoteCard key={n.id} note={n} />)}
                  </>}
              </div>
            )}
          </div>
        </aside>

        {/* ── Chat ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

          {/* Header */}
          <div style={{ padding: "14px 22px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'DM Mono',monospace" }}>
              claude-sonnet · tool use enabled · state persists in-session
            </span>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 24px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
            {display.length === 0 && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, color: "var(--muted)", paddingBottom: 40 }}>
                <div style={{ fontSize: 44 }}>⚡</div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>Ready.</div>
                  <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7, maxWidth: 340 }}>Capture notes, track goals, set reminders.<br />Everything lives in this session.</div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center", maxWidth: 440 }}>
                  {suggestions.map(s => (
                    <button key={s} onClick={() => { setInput(s); taRef.current?.focus(); }}
                      style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 99, padding: "6px 13px", fontSize: 12, color: "var(--muted)", cursor: "pointer", transition: "all 0.15s", fontFamily: "'DM Sans',sans-serif" }}
                      onMouseEnter={e => { e.target.style.borderColor = "var(--accent)"; e.target.style.color = "var(--text)"; }}
                      onMouseLeave={e => { e.target.style.borderColor = "var(--border2)"; e.target.style.color = "var(--muted)"; }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {display.map((msg, i) => (
              <div key={i} className="msg-enter" style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "72%",
                  background: msg.role === "user" ? "linear-gradient(135deg, #0369a1, #1d4ed8)" : "var(--surface)",
                  border: msg.role === "user" ? "none" : "1px solid var(--border)",
                  borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  padding: "11px 15px",
                }}>
                  <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: msg.role === "user" ? "#fff" : "var(--text)", whiteSpace: "pre-wrap" }}>{msg.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex" }}>
                <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px 16px 16px 4px", padding: "13px 16px", display: "flex", alignItems: "center", gap: 3 }}>
                  <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "12px 20px 16px", borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "flex", gap: 8, background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 14, padding: "10px 12px", alignItems: "flex-end",
              transition: "border-color 0.15s" }}
              onFocusCapture={e => e.currentTarget.style.borderColor = "var(--accent)"}
              onBlurCapture={e => e.currentTarget.style.borderColor = "var(--border2)"}>
              <textarea ref={taRef} value={input} onChange={e => setInput(e.target.value)}
                placeholder="Tell Pulse something to remember, track, or schedule…"
                rows={1}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
                style={{ flex: 1, background: "transparent", border: "none", color: "var(--text)", fontSize: 13.5, resize: "none", lineHeight: 1.6, maxHeight: 110, overflowY: "auto", fontFamily: "'DM Sans',sans-serif" }} />
              <button onClick={() => send(input)} disabled={!input.trim() || loading}
                style={{ width: 34, height: 34, borderRadius: 9, background: input.trim() && !loading ? "var(--accent)" : "var(--dim)", border: "none", color: "#fff", cursor: input.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0, transition: "background 0.15s" }}>↑</button>
            </div>
            <div style={{ textAlign: "center", fontSize: 11, color: "var(--border2)", marginTop: 7, fontFamily: "'DM Mono',monospace" }}>
              enter to send · shift+enter for newline
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </>
  );
}

function Empty({ icon, text }) {
  return (
    <div style={{ textAlign: "center", padding: "28px 8px", color: "var(--muted)" }}>
      <div style={{ fontSize: 26, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 11, lineHeight: 1.6, fontFamily: "'DM Mono',monospace" }}>{text}</div>
    </div>
  );
}
