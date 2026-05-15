import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   CHRONOS — AI-Powered Time & Task Manager
   ═══════════════════════════════════════════════════════════ */

// ── IndexedDB File System ──────────────────────────────────
const DB_NAME = "chronos_v1", STORE = "fs";
const openDB = () => new Promise((ok, fail) => {
  const r = indexedDB.open(DB_NAME, 1);
  r.onupgradeneeded = e => { if (!e.target.result.objectStoreNames.contains(STORE)) e.target.result.createObjectStore(STORE); };
  r.onsuccess = () => ok(r.result);
  r.onerror = () => fail(r.error);
});
const fsRead  = async k => { const d = await openDB(); return new Promise(ok => { const r = d.transaction(STORE,"readonly").objectStore(STORE).get(k); r.onsuccess = () => ok(r.result ?? null); }); };
const fsWrite = async (k,v) => { const d = await openDB(); return new Promise(ok => { const tx = d.transaction(STORE,"readwrite"); tx.objectStore(STORE).put(v,k); tx.oncomplete = ok; }); };
const fsList  = async () => { const d = await openDB(); return new Promise(ok => { const r = d.transaction(STORE,"readonly").objectStore(STORE).getAllKeys(); r.onsuccess = () => ok(r.result || []); }); };
const fsDelete = async k => { const d = await openDB(); return new Promise(ok => { const tx = d.transaction(STORE,"readwrite"); tx.objectStore(STORE).delete(k); tx.oncomplete = ok; }); };
const fsReadJSON  = async (k, def) => { const v = await fsRead(k); return v ? JSON.parse(v) : def; };
const fsWriteJSON = async (k, v) => fsWrite(k, JSON.stringify(v));

// ── Date / Slot Helpers ────────────────────────────────────
const dk = d => new Date(d).toISOString().slice(0,10);
const slotLabel = i => { const h=Math.floor(i/2),m=i%2===0?"00":"30",ap=h<12?"AM":"PM",hh=h===0?12:h>12?h-12:h; return `${hh}:${m} ${ap}`; };
const weekOf = d => { const x=new Date(d); const day=x.getDay(); x.setDate(x.getDate()+(day===0?-6:1-day)); x.setHours(0,0,0,0); return x; };
const addDays = (d,n) => { const x=new Date(d); x.setDate(x.getDate()+n); return x; };
const fmt = (d,opts) => new Date(d).toLocaleDateString("en-US",opts);
const fmtShort = d => fmt(d,{month:"short",day:"numeric"});
const fmtFull  = d => fmt(d,{weekday:"long",year:"numeric",month:"long",day:"numeric"});
const fmtDay   = d => fmt(d,{weekday:"short",month:"short",day:"numeric"});
const fmtTime  = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
const now = () => new Date();
const todayKey = () => dk(now());
const parseJSON = (s, def) => { try { return JSON.parse(s); } catch { return def; } };

// ── AI Action Parser ───────────────────────────────────────
const parseActions = txt => { const r=[],re=/```action\n([\s\S]*?)```/g; let m; while((m=re.exec(txt))!==null){try{r.push(JSON.parse(m[1]))}catch{}} return r; };
const stripActions = txt => txt.replace(/```action\n[\s\S]*?```/g,"").replace(/\n{3,}/g,"\n\n").trim();

// ── Constants ──────────────────────────────────────────────
const DEFAULT_CATS = [
  {id:"directory",label:"Directory Sites",color:"#7c6ef5"},
  {id:"company",  label:"Company Sites",  color:"#5b8af5"},
  {id:"client",   label:"Client Sites",   color:"#2dd4a7"},
  {id:"apps",     label:"Applications",   color:"#f97316"},
];
const POMO = { focus:{label:"Focus",mins:25,color:"#e4a853"}, short:{label:"Short Break",mins:5,color:"#2dd4a7"}, long:{label:"Long Break",mins:15,color:"#5b8af5"} };
const VIEWS = [
  {id:"schedule",  icon:"⊞", label:"Schedule"},
  {id:"timer",     icon:"◷", label:"Timer"},
  {id:"userNotes", icon:"✎", label:"My Notes"},
  {id:"aiNotes",   icon:"⊛", label:"AI Notes"},
  {id:"aiJournal", icon:"⌘", label:"AI Journal"},
  {id:"reminders", icon:"◉", label:"Reminders"},
  {id:"projects",  icon:"⬡", label:"Projects"},
  {id:"files",     icon:"⊟", label:"File System"},
  {id:"settings",  icon:"⚙", label:"Settings"},
];
const SLOT_SCROLL_TO = 14; // 7:00 AM

// ══════════════════════════════════════════════════════════
// CSS
// ══════════════════════════════════════════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0b0d12; --surf:#12151e; --card:#181c28; --card2:#1e2235;
  --brd:rgba(255,255,255,.07); --brd2:rgba(255,255,255,.11);
  --txt:#dde3f0; --muted:#5a6480; --faint:#2d3350;
  --acc:#e4a853; --acc2:#5b8af5; --green:#2dd4a7; --red:#ff6b6b; --orange:#f97316;
  --font:'Syne',sans-serif; --mono:'IBM Plex Mono',monospace;
  --r:8px; --r2:12px;
}
body{background:var(--bg);color:var(--txt);font-family:var(--font);font-size:14px;line-height:1.5}
::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--faint);border-radius:2px}
input,textarea,button,select{font-family:var(--font);outline:none}
textarea{resize:vertical}
.app{display:grid;grid-template-columns:220px 1fr;height:100vh;overflow:hidden}
.sidebar{background:var(--surf);border-right:1px solid var(--brd);display:flex;flex-direction:column;overflow:hidden}
.logo{padding:20px 18px 16px;border-bottom:1px solid var(--brd)}
.logo h1{font-size:18px;font-weight:800;letter-spacing:-.5px;color:var(--acc)}
.logo span{font-size:11px;color:var(--muted);font-family:var(--mono)}
.nav{flex:1;padding:10px 8px;overflow-y:auto}
.nav-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:var(--r);cursor:pointer;transition:all .12s;color:var(--muted);font-size:13px;font-weight:500;user-select:none}
.nav-item:hover{background:var(--card);color:var(--txt)}
.nav-item.active{background:var(--card2);color:var(--acc)}
.nav-item .icon{font-size:15px;width:20px;text-align:center}
.nav-section{font-size:10px;font-family:var(--mono);color:var(--faint);letter-spacing:.1em;text-transform:uppercase;padding:14px 12px 6px;margin-top:4px}
.workspace{background:var(--bg);overflow:hidden;display:flex;flex-direction:column}
.toolbar{display:flex;align-items:center;gap:10px;padding:14px 20px;border-bottom:1px solid var(--brd);flex-shrink:0;min-height:58px}
.toolbar h2{font-size:16px;font-weight:700;letter-spacing:-.3px;margin-right:auto}
.content{flex:1;overflow:hidden;position:relative}
/* Buttons */
.btn{padding:7px 14px;border-radius:var(--r);border:1px solid var(--brd2);background:var(--card);color:var(--txt);cursor:pointer;font-size:13px;font-weight:500;transition:all .12s;white-space:nowrap}
.btn:hover{background:var(--card2);border-color:var(--brd2)}
.btn.primary{background:var(--acc);border-color:var(--acc);color:#0b0d12;font-weight:700}
.btn.primary:hover{filter:brightness(1.1)}
.btn.ghost{background:transparent;border-color:transparent;color:var(--muted)}
.btn.ghost:hover{background:var(--card);color:var(--txt)}
.btn.sm{padding:5px 10px;font-size:12px}
.btn.icon-btn{padding:6px 10px;min-width:32px;display:flex;align-items:center;justify-content:center}
/* Inputs */
.input{background:var(--card);border:1px solid var(--brd2);color:var(--txt);padding:8px 12px;border-radius:var(--r);font-size:13px;width:100%;transition:border .12s}
.input:focus{border-color:var(--acc)}
.input::placeholder{color:var(--muted)}
.select{background:var(--card);border:1px solid var(--brd2);color:var(--txt);padding:7px 10px;border-radius:var(--r);font-size:13px;cursor:pointer}
.textarea{background:var(--card);border:1px solid var(--brd2);color:var(--txt);padding:10px 12px;border-radius:var(--r);font-size:13px;width:100%;min-height:100px;transition:border .12s;line-height:1.6}
.textarea:focus{border-color:var(--acc)}
/* Cards */
.card{background:var(--card);border:1px solid var(--brd);border-radius:var(--r2);padding:16px}
.card2{background:var(--card2);border:1px solid var(--brd2);border-radius:var(--r);padding:12px}
/* Schedule */
.schedule-grid{display:grid;overflow:auto;flex:1}
.time-label{font-family:var(--mono);font-size:10px;color:var(--muted);padding:0 8px;display:flex;align-items:flex-start;padding-top:4px;border-right:1px solid var(--brd)}
.slot-cell{border-bottom:1px solid var(--brd);border-right:1px solid var(--brd);min-height:38px;cursor:pointer;position:relative;transition:background .08s}
.slot-cell:hover{background:rgba(228,168,83,.04)}
.slot-cell.drag-over{background:rgba(228,168,83,.12)!important;outline:1px dashed var(--acc)}
.block-pill{position:absolute;inset:2px;border-radius:5px;padding:3px 7px;font-size:11px;font-weight:600;cursor:grab;overflow:hidden;display:flex;flex-direction:column;justify-content:center;line-height:1.3;transition:filter .12s}
.block-pill:hover{filter:brightness(1.15)}
.block-pill:active{cursor:grabbing}
.block-pill .b-title{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.block-pill .b-notes{font-size:10px;font-weight:400;opacity:.75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.day-header{font-size:12px;font-weight:700;padding:8px 6px;text-align:center;border-bottom:1px solid var(--brd2);position:sticky;top:0;background:var(--surf);z-index:2}
.day-header.today{color:var(--acc)}
/* Timer */
.timer-wrap{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:28px}
.timer-ring{transform:rotate(-90deg)}
.timer-ring-circle{transition:stroke-dashoffset .5s linear}
.timer-label{font-family:var(--mono);font-size:52px;font-weight:500;letter-spacing:.02em}
.timer-sub{font-size:12px;color:var(--muted);font-family:var(--mono);margin-top:-16px}
/* Chat */
.chat-bubble{position:fixed;bottom:20px;right:20px;z-index:100}
.chat-fab{width:48px;height:48px;border-radius:50%;background:var(--acc);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 4px 20px rgba(228,168,83,.4);transition:all .15s}
.chat-fab:hover{transform:scale(1.08);filter:brightness(1.1)}
.chat-panel{position:absolute;bottom:60px;right:0;width:360px;height:500px;background:var(--surf);border:1px solid var(--brd2);border-radius:var(--r2);display:flex;flex-direction:column;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.6);animation:slideUp .18s ease}
@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.chat-header{padding:12px 14px;border-bottom:1px solid var(--brd);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.chat-messages{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px}
.chat-msg{padding:9px 12px;border-radius:var(--r);font-size:13px;line-height:1.55;max-width:90%}
.chat-msg.user{background:var(--acc2);color:#fff;margin-left:auto;border-radius:var(--r) var(--r) 2px var(--r)}
.chat-msg.ai{background:var(--card2);color:var(--txt);border-radius:var(--r) var(--r) var(--r) 2px}
.chat-input-row{padding:10px;border-top:1px solid var(--brd);display:flex;gap:8px;flex-shrink:0}
.chat-typing{display:flex;gap:4px;align-items:center;padding:4px}
.dot{width:6px;height:6px;border-radius:50%;background:var(--muted);animation:blink 1.4s infinite}
.dot:nth-child(2){animation-delay:.2s}.dot:nth-child(3){animation-delay:.4s}
@keyframes blink{0%,80%,100%{opacity:.25}40%{opacity:1}}
/* Reminders */
.reminder-item{display:flex;align-items:flex-start;gap:10px;padding:12px;border-radius:var(--r);border:1px solid var(--brd);background:var(--card);transition:border .12s}
.reminder-item:hover{border-color:var(--brd2)}
.reminder-item.done{opacity:.5}
.check{width:18px;height:18px;border-radius:4px;border:1.5px solid var(--brd2);cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .12s;margin-top:1px}
.check.checked{background:var(--green);border-color:var(--green)}
/* Projects */
.proj-card{padding:14px;border-radius:var(--r);border:1px solid var(--brd);background:var(--card);cursor:pointer;transition:border .12s}
.proj-card:hover{border-color:var(--brd2)}
.proj-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
/* File tree */
.file-item{display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:6px;cursor:pointer;font-family:var(--mono);font-size:12px;color:var(--muted);transition:all .1s}
.file-item:hover{background:var(--card);color:var(--txt)}
.file-item.active{background:var(--card2);color:var(--acc)}
/* Modal */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px}
.modal{background:var(--surf);border:1px solid var(--brd2);border-radius:var(--r2);padding:24px;width:100%;max-width:440px;max-height:90vh;overflow-y:auto}
.modal h3{font-size:16px;font-weight:700;margin-bottom:18px}
.field{display:flex;flex-direction:column;gap:6px;margin-bottom:14px}
.field label{font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;font-family:var(--mono)}
/* Misc */
.tag{display:inline-flex;align-items:center;gap:5px;padding:3px 8px;border-radius:20px;font-size:11px;font-weight:600}
.divider{height:1px;background:var(--brd);margin:12px 0}
.prose{font-size:13px;line-height:1.7;color:var(--txt);white-space:pre-wrap;font-family:var(--mono)}
.badge{font-family:var(--mono);font-size:10px;padding:2px 7px;border-radius:20px;font-weight:500}
.empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;height:100%;color:var(--muted);font-size:13px;text-align:center;padding:40px}
.empty-state .icon{font-size:36px;opacity:.3}
.week-col-header{padding:6px 4px;text-align:center;border-bottom:2px solid var(--brd);border-right:1px solid var(--brd);font-size:11px;font-weight:700;position:sticky;top:0;background:var(--surf);z-index:2}
.week-col-header.today-h{border-bottom-color:var(--acc);color:var(--acc)}
.scroll-area{overflow-y:auto;height:100%}
`;

// ══════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════
export default function App() {
  const [view, setView] = useState("schedule");
  // Schedule
  const [schedule, setScheduleState] = useState({});
  const [viewMode, setViewMode] = useState("day");
  const [selDate, setSelDate] = useState(() => { const d=new Date(); d.setHours(0,0,0,0); return d; });
  const [weekStart, setWeekStartState] = useState(() => weekOf(new Date()));
  // Notes
  const [userNotes, setUserNotes] = useState("");
  const [aiNotes, setAiNotes] = useState("");
  const [aiAnnotation, setAiAnnotation] = useState("");
  // Other data
  const [reminders, setRemindersState] = useState([]);
  const [projects, setProjectsState] = useState([]);
  const [aiJournal, setAiJournalState] = useState([]);
  const [categories, setCategoriesState] = useState(DEFAULT_CATS);
  const [chatHistory, setChatHistory] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [fileView, setFileView] = useState(null);
  const [fileContent, setFileContent] = useState("");
  // Settings
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("chronos_key") || "");
  const [contextMode, setContextMode] = useState("full");
  const [contextProject, setContextProject] = useState(null);
  // UI
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [editBlock, setEditBlock] = useState(null);
  const [dragSrc, setDragSrc] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [editProject, setEditProject] = useState(null);
  const [newCat, setNewCat] = useState({label:"",color:"#7c6ef5"});
  const [showAddCat, setShowAddCat] = useState(false);
  const [reminderInput, setReminderInput] = useState("");
  // Timer
  const [timerMode, setTimerMode] = useState("focus");
  const [timeLeft, setTimeLeft] = useState(POMO.focus.mins*60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const timerRef = useRef(null);
  const schedRef = useRef(null);
  const chatEndRef = useRef(null);
  const notesTimer = useRef(null);

  // ── Init ────────────────────────────────────────────────
  useEffect(() => { injectCSS(); loadAll(); }, []);
  const injectCSS = () => { if (document.getElementById("chronos-css")) return; const s=document.createElement("style"); s.id="chronos-css"; s.textContent=CSS; document.head.appendChild(s); };

  const loadAll = async () => {
    const [sched,un,an,ann,rem,proj,jour,cats,chat,ctxM] = await Promise.all([
      fsReadJSON("schedule.json",{}), fsRead("notes/user.md"), fsRead("notes/ai.md"),
      fsRead("notes/ai_annotation.md"), fsReadJSON("reminders.json",[]),
      fsReadJSON("projects.json",[]), fsReadJSON("ai_journal.json",[]),
      fsReadJSON("categories.json", DEFAULT_CATS), fsReadJSON("chat_history.json",[]),
      fsRead("settings/context_mode"),
    ]);
    setScheduleState(sched);
    if (un) setUserNotes(un);
    if (an) setAiNotes(an);
    if (ann) setAiAnnotation(ann);
    setRemindersState(rem);
    setProjectsState(proj);
    setAiJournalState(jour);
    setCategoriesState(cats);
    setChatHistory(chat);
    if (ctxM) setContextMode(ctxM);
    refreshFileList();
    setTimeout(() => schedRef.current?.scrollTo(0, SLOT_SCROLL_TO * 38), 200);
  };
  const refreshFileList = async () => setFileList(await fsList());

  // ── Save helpers ─────────────────────────────────────────
  const saveSched   = async s => { setScheduleState(s); await fsWriteJSON("schedule.json", s); refreshFileList(); };
  const saveRem     = async r => { setRemindersState(r); await fsWriteJSON("reminders.json", r); };
  const saveProj    = async p => { setProjectsState(p); await fsWriteJSON("projects.json", p); };
  const saveAiNotes = async n => { setAiNotes(n); await fsWrite("notes/ai.md", n); };
  const saveAiJourn = async j => { setAiJournalState(j); await fsWriteJSON("ai_journal.json", j); };
  const saveCats    = async c => { setCategoriesState(c); await fsWriteJSON("categories.json", c); };
  const saveChat    = async h => { setChatHistory(h); await fsWriteJSON("chat_history.json", h); };
  const saveAnnot   = async a => { setAiAnnotation(a); await fsWrite("notes/ai_annotation.md", a); };

  const handleUserNotesChange = v => {
    setUserNotes(v);
    clearTimeout(notesTimer.current);
    notesTimer.current = setTimeout(() => fsWrite("notes/user.md", v), 600);
  };

  // ── Timer ────────────────────────────────────────────────
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current); setTimerRunning(false);
            const ns = sessions + 1; setSessions(ns);
            const next = timerMode==="focus" ? (ns%4===0?"long":"short") : "focus";
            setTimerMode(next); setTimeLeft(POMO[next].mins*60);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  const switchTimer = m => { setTimerMode(m); setTimeLeft(POMO[m].mins*60); setTimerRunning(false); };

  // ── Schedule ─────────────────────────────────────────────
  const getBlock = (date, slot) => (schedule[dk(date)] || {})[slot];
  const openEdit = (date, slot) => setEditBlock({ date, slot, data: getBlock(date,slot) || {title:"",notes:"",category:categories[0]?.id||"",color:"",projectId:null} });

  const saveBlock = async (date, slot, data) => {
    const key = dk(date);
    const ns = { ...schedule, [key]: { ...(schedule[key]||{}), [slot]: data } };
    await saveSched(ns);
    setEditBlock(null);
  };

  const deleteBlock = async (date, slot) => {
    const key = dk(date);
    const ns = JSON.parse(JSON.stringify(schedule));
    if (ns[key]) { delete ns[key][slot]; if (!Object.keys(ns[key]).length) delete ns[key]; }
    await saveSched(ns);
    setEditBlock(null);
  };

  const moveBlock = async (from, to) => {
    const data = getBlock(from.date, from.slot);
    if (!data) return;
    const ns = JSON.parse(JSON.stringify(schedule));
    const fk=dk(from.date), tk=dk(to.date);
    if (ns[fk]) { delete ns[fk][from.slot]; if (!Object.keys(ns[fk]).length) delete ns[fk]; }
    if (!ns[tk]) ns[tk]={};
    ns[tk][to.slot] = data;
    await saveSched(ns);
  };

  // ── AI System Prompt ─────────────────────────────────────
  const buildSystem = async () => {
    const cur = now();
    let sys = `You are Chronos, an embedded AI assistant in a personal time and task management app.
Current date/time: ${cur.toLocaleString()}
Today: ${dk(cur)}, Week: ${fmtShort(weekStart)}–${fmtShort(addDays(weekStart,6))}

You can read and write the user's file system. Perform actions by including JSON blocks:

\`\`\`action
{"action":"WRITE_SCHEDULE","date":"YYYY-MM-DD","blocks":[{"slot":0,"title":"...","notes":"...","category":"directory","color":"#hex","projectId":null}]}
\`\`\`
\`\`\`action
{"action":"CLEAR_SCHEDULE","date":"YYYY-MM-DD","slots":[12,13,14]}
\`\`\`
\`\`\`action
{"action":"WRITE_AI_NOTES","content":"your full notepad content"}
\`\`\`
\`\`\`action
{"action":"WRITE_AI_JOURNAL","entry":"journal entry text"}
\`\`\`
\`\`\`action
{"action":"WRITE_REMINDER","title":"...","date":"YYYY-MM-DD","time":"HH:MM","notes":"..."}
\`\`\`
\`\`\`action
{"action":"COMPLETE_REMINDER","id":"reminder-id"}
\`\`\`

Slot mapping: 0=12:00AM,1=12:30AM,...,12=6:00AM,14=7:00AM,16=8:00AM,18=9:00AM,20=10:00AM,22=11:00AM,24=12:00PM,26=1:00PM,28=2:00PM,30=3:00PM,32=4:00PM,34=5:00PM,36=6:00PM,38=7:00PM,40=8:00PM
Categories: ${categories.map(c=>c.id).join(", ")}

## FILE SYSTEM CONTEXT\n`;

    if (contextMode === "full") {
      const [sched,un,an,rem,proj,jour] = await Promise.all([
        fsRead("schedule.json"), fsRead("notes/user.md"), fsRead("notes/ai.md"),
        fsRead("reminders.json"), fsRead("projects.json"), fsRead("ai_journal.json"),
      ]);
      sys += `### schedule.json\n${sched||"{}"}\n\n### notes/user.md\n${un||"(empty)"}\n\n### notes/ai.md (your notepad)\n${an||"(empty)"}\n\n### reminders.json\n${rem||"[]"}\n\n### projects.json\n${proj||"[]"}\n\n### ai_journal.json (last 5 entries)\n${jour ? JSON.stringify(JSON.parse(jour).slice(-5)) : "[]"}\n`;
    } else if (contextMode === "project" && contextProject) {
      const proj = projects.find(p=>p.id===contextProject);
      sys += `[Scoped to project: ${proj?.name||contextProject}]\n`;
      const filtSched = Object.fromEntries(Object.entries(schedule).map(([k,v]) => [k, Object.fromEntries(Object.entries(v).filter(([,b])=>b.projectId===contextProject))]));
      sys += `### schedule (project-filtered)\n${JSON.stringify(filtSched)}\n### reminders (project-filtered)\n${JSON.stringify(reminders.filter(r=>r.projectId===contextProject))}\n`;
    }

    sys += `\nBe concise and practical. When scheduling, always emit action blocks. Update your AI notepad with key observations. Keep journal entries reflective and useful.`;
    return sys;
  };

  // ── AI Actions ────────────────────────────────────────────
  const execActions = async (actions) => {
    for (const a of actions) {
      if (a.action === "WRITE_SCHEDULE") {
        const key = a.date;
        const ns = JSON.parse(JSON.stringify(schedule));
        if (!ns[key]) ns[key]={};
        for (const b of a.blocks||[]) {
          const cat = categories.find(c=>c.id===b.category);
          ns[key][b.slot] = { title:b.title||"", notes:b.notes||"", category:b.category||"", color: b.color || cat?.color || "#5b8af5", projectId:b.projectId||null };
        }
        await saveSched(ns);
      } else if (a.action === "CLEAR_SCHEDULE") {
        const ns = JSON.parse(JSON.stringify(schedule));
        if (ns[a.date]) { (a.slots||[]).forEach(s=>delete ns[a.date][s]); if (!Object.keys(ns[a.date]).length) delete ns[a.date]; }
        await saveSched(ns);
      } else if (a.action === "WRITE_AI_NOTES") {
        await saveAiNotes(a.content||"");
      } else if (a.action === "WRITE_AI_JOURNAL") {
        const entry = { id: Date.now().toString(), content: a.entry, ts: new Date().toISOString() };
        const nj = [...aiJournal, entry];
        await saveAiJourn(nj);
      } else if (a.action === "WRITE_REMINDER") {
        const rem = { id: Date.now().toString(), title:a.title||"", notes:a.notes||"", date:a.date||"", time:a.time||"", done:false, projectId:a.projectId||null };
        await saveRem([...reminders, rem]);
      } else if (a.action === "COMPLETE_REMINDER") {
        await saveRem(reminders.map(r => r.id===a.id ? {...r,done:true} : r));
      }
    }
  };

  // ── Send Chat ─────────────────────────────────────────────
  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = { role:"user", content:chatInput.trim(), ts: Date.now() };
    const msgs = [...chatHistory, userMsg];
    setChatHistory(msgs);
    setChatInput("");
    setChatLoading(true);
    try {
      const system = await buildSystem();
      const key = apiKey || localStorage.getItem("chronos_key") || "";
      const hdrs = { "Content-Type":"application/json" };
      if (key) { hdrs["x-api-key"]=key; hdrs["anthropic-version"]="2023-06-01"; }
      const apiMsgs = msgs.slice(-20).map(m=>({role:m.role,content:m.content}));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:hdrs,
        body: JSON.stringify({ model:"claude-haiku-4-5-20251001", max_tokens:1000, system, messages:apiMsgs })
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "I couldn't process that request.";
      await execActions(parseActions(raw));
      const aiMsg = { role:"assistant", content: stripActions(raw), ts: Date.now() };
      const final = [...msgs, aiMsg];
      await saveChat(final);
    } catch (err) {
      const errMsg = { role:"assistant", content:`⚠️ ${err.message}${!apiKey?" — Add your API key in Settings.":""}`, ts: Date.now() };
      const final = [...msgs, errMsg];
      await saveChat(final);
    }
    setChatLoading(false);
    setTimeout(()=>chatEndRef.current?.scrollIntoView({behavior:"smooth"}),80);
  };

  // ── VIEW RENDERERS ────────────────────────────────────────
  const weekDays = Array.from({length:7}, (_,i) => addDays(weekStart, i));
  const allSlots = Array.from({length:48}, (_,i)=>i);
  const visibleSlots = allSlots.filter(i => i >= 8 && i <= 46); // 4AM to 11PM
  const todayStr = dk(now());
  const getCatColor = id => categories.find(c=>c.id===id)?.color || "#5b8af5";
  const getCatLabel = id => categories.find(c=>c.id===id)?.label || id;

  // ── SCHEDULE VIEW ─────────────────────────────────────────
  const renderSchedule = () => {
    const days = viewMode === "day" ? [selDate] : weekDays;
    const colTemplate = `64px repeat(${days.length}, 1fr)`;
    return (
      <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
        {/* Toolbar */}
        <div className="toolbar" style={{gap:8}}>
          <h2 style={{fontSize:14}}>{viewMode==="day" ? fmtFull(selDate) : `Week of ${fmtShort(weekStart)}`}</h2>
          <button className="btn sm ghost icon-btn" onClick={()=>{ viewMode==="day" ? setSelDate(addDays(selDate,-1)) : setWeekStartState(addDays(weekStart,-7)); }}>←</button>
          <button className="btn sm ghost" onClick={()=>{ const d=new Date(); d.setHours(0,0,0,0); setSelDate(d); setWeekStartState(weekOf(d)); }}>Today</button>
          <button className="btn sm ghost icon-btn" onClick={()=>{ viewMode==="day" ? setSelDate(addDays(selDate,1)) : setWeekStartState(addDays(weekStart,7)); }}>→</button>
          <div style={{display:"flex",gap:4,background:"var(--card)",padding:3,borderRadius:"var(--r)",marginLeft:4}}>
            {["day","week"].map(m=>(
              <button key={m} className="btn sm" style={{background:viewMode===m?"var(--acc)":"transparent",border:"none",color:viewMode===m?"#0b0d12":"var(--muted)",textTransform:"capitalize",padding:"4px 12px"}} onClick={()=>setViewMode(m)}>{m}</button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div ref={schedRef} style={{flex:1,overflow:"auto"}}>
          <div style={{display:"grid",gridTemplateColumns:colTemplate,minWidth:viewMode==="week"?"700px":"auto"}}>
            {/* Header row */}
            <div style={{borderRight:"1px solid var(--brd)",borderBottom:"2px solid var(--brd)",position:"sticky",top:0,background:"var(--surf)",zIndex:3}} />
            {days.map(d=>(
              <div key={dk(d)} className={`week-col-header${dk(d)===todayStr?" today-h":""}`}
                style={{cursor:"pointer"}} onClick={()=>{ setSelDate(d); setViewMode("day"); }}>
                {viewMode==="week" ? fmtDay(d) : fmtFull(d)}
                {dk(d)===todayStr && <span style={{marginLeft:6,fontSize:9,background:"var(--acc)",color:"#0b0d12",padding:"1px 5px",borderRadius:20}}>TODAY</span>}
              </div>
            ))}
            {/* Time rows */}
            {visibleSlots.map(slot=>(
              <>
                <div key={`lbl-${slot}`} className="time-label" style={{height:38}}>
                  {slot%2===0 ? slotLabel(slot) : ""}
                </div>
                {days.map(date=>{
                  const blk = getBlock(date, slot);
                  const isDragOver = dragOver?.date===dk(date) && dragOver?.slot===slot;
                  return (
                    <div key={`${dk(date)}-${slot}`} className={`slot-cell${isDragOver?" drag-over":""}`}
                      style={{height:38, background: blk ? "transparent" : undefined}}
                      onClick={()=>!blk && openEdit(date,slot)}
                      onDragOver={e=>{e.preventDefault(); setDragOver({date:dk(date),slot});}}
                      onDragLeave={()=>setDragOver(null)}
                      onDrop={e=>{e.preventDefault(); if(dragSrc) moveBlock(dragSrc,{date,slot}); setDragSrc(null); setDragOver(null);}}>
                      {blk && (
                        <div className="block-pill"
                          style={{background: blk.color||getCatColor(blk.category), color:"#fff", boxShadow:`0 1px 4px rgba(0,0,0,.3)`}}
                          draggable onDragStart={e=>{e.stopPropagation();setDragSrc({date,slot});}}
                          onClick={e=>{e.stopPropagation(); openEdit(date,slot);}}>
                          <span className="b-title">{blk.title}</span>
                          {blk.notes && <span className="b-notes">{blk.notes}</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ── TIMER VIEW ────────────────────────────────────────────
  const renderTimer = () => {
    const total = POMO[timerMode].mins * 60;
    const pct = timeLeft / total;
    const r = 90, C = 2*Math.PI*r;
    const color = POMO[timerMode].color;
    return (
      <div className="scroll-area">
        <div className="timer-wrap">
          <div style={{display:"flex",gap:8}}>
            {Object.entries(POMO).map(([k,v])=>(
              <button key={k} className="btn sm" style={{background:timerMode===k?color:"var(--card)",color:timerMode===k?"#0b0d12":"var(--muted)",border:`1px solid ${timerMode===k?color:"var(--brd2)"}`,fontWeight:timerMode===k?700:400}} onClick={()=>switchTimer(k)}>{v.label}</button>
            ))}
          </div>
          <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width={220} height={220} className="timer-ring">
              <circle cx={110} cy={110} r={r} fill="none" stroke="var(--card2)" strokeWidth={8}/>
              <circle cx={110} cy={110} r={r} fill="none" stroke={color} strokeWidth={8}
                strokeDasharray={C} strokeDashoffset={C*(1-pct)} strokeLinecap="round" className="timer-ring-circle"/>
            </svg>
            <div style={{position:"absolute",textAlign:"center"}}>
              <div className="timer-label" style={{color}}>{fmtTime(timeLeft)}</div>
              <div className="timer-sub">{POMO[timerMode].label}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <button className="btn" style={{minWidth:90}} onClick={()=>setTimerRunning(r=>!r)}>
              {timerRunning ? "⏸ Pause" : "▶ Start"}
            </button>
            <button className="btn ghost" onClick={()=>{ setTimerRunning(false); setTimeLeft(POMO[timerMode].mins*60); }}>↺ Reset</button>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {Array.from({length:4}).map((_,i)=>(
              <div key={i} style={{width:10,height:10,borderRadius:"50%",background:i<(sessions%4)?color:"var(--faint)"}}/>
            ))}
            <span style={{fontSize:12,color:"var(--muted)",fontFamily:"var(--mono)",marginLeft:4}}>{sessions} sessions</span>
          </div>
        </div>
      </div>
    );
  };

  // ── USER NOTES ────────────────────────────────────────────
  const renderUserNotes = () => (
    <div className="scroll-area" style={{padding:20}}>
      <div style={{maxWidth:800,margin:"0 auto"}}>
        <p style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)",marginBottom:12}}>✎ Personal notepad — auto-saves as you type</p>
        <textarea className="textarea" style={{width:"100%",minHeight:"calc(100vh - 140px)",background:"var(--card)",fontFamily:"var(--mono)",fontSize:13,lineHeight:1.8}}
          value={userNotes} onChange={e=>handleUserNotesChange(e.target.value)} placeholder="Your thoughts, ideas, anything..."/>
      </div>
    </div>
  );

  // ── AI NOTES ──────────────────────────────────────────────
  const renderAiNotes = () => (
    <div className="scroll-area" style={{padding:20}}>
      <div style={{maxWidth:800,margin:"0 auto",display:"flex",flexDirection:"column",gap:16}}>
        <div className="card">
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <span style={{fontSize:14}}>⊛</span>
            <span style={{fontSize:13,fontWeight:700}}>AI Notepad</span>
            <span className="badge" style={{background:"var(--card2)",color:"var(--muted)",marginLeft:"auto"}}>read-only</span>
          </div>
          <div className="prose" style={{minHeight:180}}>{aiNotes || <span style={{color:"var(--muted)"}}>The AI hasn't written anything yet. Start chatting!</span>}</div>
        </div>
        <div className="card">
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <span style={{fontSize:14}}>✎</span>
            <span style={{fontSize:13,fontWeight:700}}>Your Annotations</span>
            <span style={{fontSize:11,color:"var(--muted)",marginLeft:4}}>—&nbsp;notes on the AI's thoughts</span>
          </div>
          <textarea className="textarea" style={{width:"100%",minHeight:140,fontFamily:"var(--mono)",fontSize:12,lineHeight:1.7}}
            value={aiAnnotation} onChange={e=>{ setAiAnnotation(e.target.value); clearTimeout(notesTimer.current); notesTimer.current=setTimeout(()=>saveAnnot(e.target.value),600); }}
            placeholder="Add your annotations, corrections, or comments on the AI's notes..."/>
        </div>
      </div>
    </div>
  );

  // ── AI JOURNAL ────────────────────────────────────────────
  const renderAiJournal = () => (
    <div className="scroll-area" style={{padding:20}}>
      <div style={{maxWidth:800,margin:"0 auto"}}>
        {aiJournal.length===0 ? (
          <div className="empty-state"><div className="icon">⌘</div><p>No journal entries yet.<br/>The AI writes here as it learns about your work.</p></div>
        ) : (
          [...aiJournal].reverse().map(e=>(
            <div key={e.id} className="card" style={{marginBottom:14}}>
              <div style={{fontSize:10,color:"var(--muted)",fontFamily:"var(--mono)",marginBottom:8}}>{new Date(e.ts).toLocaleString()}</div>
              <div className="prose" style={{fontSize:13}}>{e.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // ── REMINDERS ─────────────────────────────────────────────
  const renderReminders = () => {
    const pending = reminders.filter(r=>!r.done);
    const done = reminders.filter(r=>r.done);
    return (
      <div className="scroll-area" style={{padding:20}}>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          <div style={{display:"flex",gap:8,marginBottom:20}}>
            <input className="input" style={{flex:1}} placeholder="Brain dump — type anything, hit Enter..." value={reminderInput}
              onChange={e=>setReminderInput(e.target.value)}
              onKeyDown={async e=>{ if(e.key==="Enter"&&reminderInput.trim()){
                const rem={id:Date.now().toString(),title:reminderInput.trim(),notes:"",date:"",time:"",done:false};
                await saveRem([...reminders,rem]); setReminderInput("");
              }}}/>
            <button className="btn primary" onClick={async()=>{ if(!reminderInput.trim()) return; const rem={id:Date.now().toString(),title:reminderInput.trim(),notes:"",date:"",time:"",done:false}; await saveRem([...reminders,rem]); setReminderInput(""); }}>Add</button>
          </div>
          {pending.length>0 && (<>
            <p style={{fontSize:10,fontFamily:"var(--mono)",color:"var(--muted)",marginBottom:10,textTransform:"uppercase",letterSpacing:".08em"}}>Pending ({pending.length})</p>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
              {pending.map(r=>(
                <div key={r.id} className="reminder-item">
                  <div className="check" onClick={async()=>await saveRem(reminders.map(x=>x.id===r.id?{...x,done:true}:x))}>✓</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600}}>{r.title}</div>
                    {r.date && <div style={{fontSize:11,color:"var(--acc)",fontFamily:"var(--mono)",marginTop:2}}>{r.date} {r.time}</div>}
                    {r.notes && <div style={{fontSize:12,color:"var(--muted)",marginTop:3}}>{r.notes}</div>}
                  </div>
                  <button className="btn ghost sm icon-btn" style={{fontSize:12}} onClick={async()=>await saveRem(reminders.filter(x=>x.id!==r.id))}>✕</button>
                </div>
              ))}
            </div>
          </>)}
          {done.length>0 && (<>
            <p style={{fontSize:10,fontFamily:"var(--mono)",color:"var(--muted)",marginBottom:10,textTransform:"uppercase",letterSpacing:".08em"}}>Done ({done.length})</p>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {done.map(r=>(
                <div key={r.id} className="reminder-item done">
                  <div className="check checked" style={{cursor:"default"}}>✓</div>
                  <div style={{flex:1,textDecoration:"line-through",color:"var(--muted)",fontSize:13}}>{r.title}</div>
                  <button className="btn ghost sm icon-btn" style={{fontSize:12}} onClick={async()=>await saveRem(reminders.filter(x=>x.id!==r.id))}>✕</button>
                </div>
              ))}
            </div>
          </>)}
          {reminders.length===0 && <div className="empty-state"><div className="icon">◉</div><p>Brain dump anything — tasks, ideas, thoughts.<br/>The AI can help schedule them.</p></div>}
        </div>
      </div>
    );
  };

  // ── PROJECTS ──────────────────────────────────────────────
  const renderProjects = () => (
    <div className="scroll-area" style={{padding:20}}>
      <div style={{maxWidth:800,margin:"0 auto"}}>
        <div style={{display:"flex",gap:10,marginBottom:20}}>
          <button className="btn primary" onClick={()=>setEditProject({id:Date.now().toString(),name:"",color:"#7c6ef5",category:categories[0]?.id||"",notes:""})}>+ New Project</button>
        </div>
        {projects.length===0 ? (
          <div className="empty-state"><div className="icon">⬡</div><p>No projects yet. Create your first one.</p></div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
            {projects.map(p=>{
              const taskCount = Object.values(schedule).reduce((acc,day)=>acc+Object.values(day).filter(b=>b.projectId===p.id).length, 0);
              const remCount = reminders.filter(r=>r.projectId===p.id&&!r.done).length;
              return (
                <div key={p.id} className="proj-card" onClick={()=>setEditProject({...p})}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                    <div className="proj-dot" style={{background:p.color||"#5b8af5"}}/>
                    <div style={{fontWeight:700,fontSize:14,flex:1}}>{p.name}</div>
                  </div>
                  {p.category && <div className="tag" style={{background:`${getCatColor(p.category)}22`,color:getCatColor(p.category),marginBottom:8,fontSize:10}}>{getCatLabel(p.category)}</div>}
                  {p.notes && <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.5,marginBottom:10,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{p.notes}</div>}
                  <div style={{display:"flex",gap:12,fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)"}}>
                    <span>⊞ {taskCount} blocks</span>
                    <span>◉ {remCount} tasks</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* Categories */}
        <div style={{marginTop:32}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <p style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)",textTransform:"uppercase",letterSpacing:".08em"}}>Categories</p>
            <button className="btn ghost sm" onClick={()=>setShowAddCat(true)}>+ Add</button>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {categories.map(c=>(
              <div key={c.id} className="tag" style={{background:`${c.color}22`,color:c.color,fontSize:12,padding:"5px 12px"}}>
                {c.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ── FILE SYSTEM ───────────────────────────────────────────
  const renderFiles = () => (
    <div style={{display:"flex",height:"100%"}}>
      <div style={{width:220,borderRight:"1px solid var(--brd)",padding:10,overflow:"auto",flexShrink:0}}>
        <p style={{fontSize:10,fontFamily:"var(--mono)",color:"var(--muted)",padding:"6px 10px 10px",textTransform:"uppercase",letterSpacing:".08em"}}>/ chronos_v1</p>
        {fileList.length===0 ? <div style={{fontSize:12,color:"var(--muted)",padding:10}}>No files yet</div> :
          fileList.sort().map(f=>(
            <div key={f} className={`file-item${fileView===f?" active":""}`} onClick={async()=>{ setFileView(f); const v=await fsRead(f); setFileContent(v||""); }}>
              <span style={{opacity:.5}}>{f.includes("/")?"└":"◼"}</span>
              <span>{f.split("/").pop()}</span>
            </div>
          ))
        }
      </div>
      <div style={{flex:1,padding:16,overflow:"auto"}}>
        {fileView ? (<>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <code style={{fontSize:12,color:"var(--acc)",fontFamily:"var(--mono)"}}>{fileView}</code>
            <button className="btn ghost sm" style={{marginLeft:"auto"}} onClick={async()=>{ if(confirm(`Delete ${fileView}?`)){await fsDelete(fileView); setFileView(null); setFileContent(""); refreshFileList();}}}> 🗑</button>
          </div>
          <pre style={{fontFamily:"var(--mono)",fontSize:12,color:"var(--txt)",lineHeight:1.7,whiteSpace:"pre-wrap",wordBreak:"break-all"}}>{fileContent}</pre>
        </>) : (
          <div className="empty-state"><div className="icon">⊟</div><p>Select a file to view its contents</p></div>
        )}
      </div>
    </div>
  );

  // ── SETTINGS ──────────────────────────────────────────────
  const renderSettings = () => (
    <div className="scroll-area" style={{padding:20}}>
      <div style={{maxWidth:600,margin:"0 auto",display:"flex",flexDirection:"column",gap:16}}>
        <div className="card">
          <h3 style={{fontSize:15,fontWeight:700,marginBottom:16}}>⚙ API Configuration</h3>
          <div className="field">
            <label>Anthropic API Key</label>
            <input className="input" type="password" value={apiKey} placeholder="sk-ant-..."
              onChange={e=>{setApiKey(e.target.value); localStorage.setItem("chronos_key",e.target.value);}}/>
            <span style={{fontSize:11,color:"var(--muted)"}}>Required to use AI features. Stored locally in your browser.</span>
          </div>
        </div>
        <div className="card">
          <h3 style={{fontSize:15,fontWeight:700,marginBottom:16}}>⊛ AI Context Mode</h3>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {[["full","Full Filesystem","AI receives all files as context (recommended for small context)"],
              ["project","Project Scoped","AI only receives context for a specific project"]].map(([val,label,desc])=>(
              <div key={val} className="card2" style={{cursor:"pointer",border:`1px solid ${contextMode===val?"var(--acc)":"var(--brd2)"}`}} onClick={()=>{ setContextMode(val); fsWrite("settings/context_mode",val); }}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:14,height:14,borderRadius:"50%",border:"2px solid var(--brd2)",background:contextMode===val?"var(--acc)":"transparent",boxSizing:"border-box"}}/>
                  <div>
                    <div style={{fontWeight:600,fontSize:13}}>{label}</div>
                    <div style={{fontSize:11,color:"var(--muted)"}}>{desc}</div>
                  </div>
                </div>
              </div>
            ))}
            {contextMode==="project" && (
              <div className="field" style={{marginTop:6}}>
                <label>Active Project for Context</label>
                <select className="select input" value={contextProject||""} onChange={e=>setContextProject(e.target.value||null)}>
                  <option value="">— Select project —</option>
                  {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>
        <div className="card">
          <h3 style={{fontSize:15,fontWeight:700,marginBottom:16}}>⬡ Custom Categories</h3>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>
            {categories.map(c=>(
              <div key={c.id} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 10px 5px 10px",borderRadius:20,background:`${c.color}22`,border:`1px solid ${c.color}44`}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:c.color}}/>
                <span style={{fontSize:12,color:c.color,fontWeight:600}}>{c.label}</span>
                {!DEFAULT_CATS.find(d=>d.id===c.id) && (
                  <button style={{background:"none",border:"none",color:c.color,cursor:"pointer",fontSize:12,opacity:.7,padding:"0 2px"}} onClick={async()=>{ const nc=categories.filter(x=>x.id!==c.id); await saveCats(nc); }}>✕</button>
                )}
              </div>
            ))}
          </div>
          {showAddCat ? (
            <div style={{display:"flex",gap:8,alignItems:"center",marginTop:8}}>
              <input className="input" style={{flex:1}} placeholder="Category name" value={newCat.label} onChange={e=>setNewCat(n=>({...n,label:e.target.value}))}/>
              <input type="color" value={newCat.color} onChange={e=>setNewCat(n=>({...n,color:e.target.value}))} style={{width:36,height:36,border:"1px solid var(--brd2)",borderRadius:"var(--r)",cursor:"pointer",background:"none",padding:2}}/>
              <button className="btn primary sm" onClick={async()=>{ if(!newCat.label.trim()) return; const nc=[...categories,{id:newCat.label.toLowerCase().replace(/\s+/g,"-"),label:newCat.label.trim(),color:newCat.color}]; await saveCats(nc); setNewCat({label:"",color:"#7c6ef5"}); setShowAddCat(false); }}>Add</button>
              <button className="btn ghost sm" onClick={()=>setShowAddCat(false)}>Cancel</button>
            </div>
          ) : <button className="btn sm" onClick={()=>setShowAddCat(true)}>+ Add Category</button>}
        </div>
        <div className="card">
          <h3 style={{fontSize:15,fontWeight:700,marginBottom:12}}>⚠ Danger Zone</h3>
          <button className="btn" style={{color:"var(--red)",borderColor:"var(--red)"}} onClick={async()=>{ if(confirm("Clear ALL data? This cannot be undone.")){const keys=await fsList(); for(const k of keys) await fsDelete(k); await loadAll();}}}>Clear All Data</button>
        </div>
      </div>
    </div>
  );

  // ── BLOCK EDIT MODAL ──────────────────────────────────────
  const renderEditModal = () => {
    if (!editBlock) return null;
    const {date, slot, data} = editBlock;
    const update = (k,v) => setEditBlock(b=>({...b, data:{...b.data,[k]:v}}));
    const catColor = data.color || getCatColor(data.category) || "#5b8af5";
    return (
      <div className="modal-overlay" onClick={()=>setEditBlock(null)}>
        <div className="modal" onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
            <h3 style={{margin:0}}>{slotLabel(slot)} — {fmtShort(date)}</h3>
            {getBlock(date,slot) && <button className="btn sm ghost" style={{color:"var(--red)"}} onClick={()=>deleteBlock(date,slot)}>Delete</button>}
          </div>
          <div className="field">
            <label>Title</label>
            <input className="input" value={data.title} onChange={e=>update("title",e.target.value)} placeholder="What are you working on?" autoFocus/>
          </div>
          <div className="field">
            <label>Notes</label>
            <textarea className="textarea" style={{minHeight:70}} value={data.notes} onChange={e=>update("notes",e.target.value)} placeholder="Details, links, context..."/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div className="field">
              <label>Category</label>
              <select className="select input" value={data.category} onChange={e=>update("category",e.target.value)}>
                {categories.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Project</label>
              <select className="select input" value={data.projectId||""} onChange={e=>update("projectId",e.target.value||null)}>
                <option value="">None</option>
                {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div className="field">
            <label>Color Override</label>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <input type="color" value={catColor} onChange={e=>update("color",e.target.value)} style={{width:40,height:36,border:"1px solid var(--brd2)",borderRadius:"var(--r)",cursor:"pointer",background:"none",padding:2}}/>
              <div style={{flex:1,height:36,borderRadius:"var(--r)",background:catColor,opacity:.85}}/>
              <button className="btn ghost sm" onClick={()=>update("color","")}>Reset</button>
            </div>
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:6}}>
            <button className="btn ghost" onClick={()=>setEditBlock(null)}>Cancel</button>
            <button className="btn primary" onClick={()=>saveBlock(date,slot,{...data,color:data.color||getCatColor(data.category)})}>Save Block</button>
          </div>
        </div>
      </div>
    );
  };

  // ── PROJECT MODAL ─────────────────────────────────────────
  const renderProjectModal = () => {
    if (!editProject) return null;
    const up = (k,v) => setEditProject(p=>({...p,[k]:v}));
    const isNew = !projects.find(p=>p.id===editProject.id);
    return (
      <div className="modal-overlay" onClick={()=>setEditProject(null)}>
        <div className="modal" onClick={e=>e.stopPropagation()}>
          <h3>{isNew ? "New Project" : "Edit Project"}</h3>
          <div className="field"><label>Name</label><input className="input" value={editProject.name} onChange={e=>up("name",e.target.value)} placeholder="Project name" autoFocus/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div className="field">
              <label>Category</label>
              <select className="select input" value={editProject.category} onChange={e=>up("category",e.target.value)}>
                {categories.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Color</label>
              <input type="color" value={editProject.color||"#7c6ef5"} onChange={e=>up("color",e.target.value)} style={{width:"100%",height:40,border:"1px solid var(--brd2)",borderRadius:"var(--r)",cursor:"pointer",background:"none",padding:3}}/>
            </div>
          </div>
          <div className="field"><label>Notes</label><textarea className="textarea" value={editProject.notes} onChange={e=>up("notes",e.target.value)} placeholder="Project description, goals, links..."/></div>
          <div style={{display:"flex",gap:8,justifyContent:"space-between"}}>
            <div>{!isNew && <button className="btn sm ghost" style={{color:"var(--red)"}} onClick={async()=>{ if(confirm("Delete project?")){ await saveProj(projects.filter(p=>p.id!==editProject.id)); setEditProject(null); }}}> Delete</button>}</div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn ghost" onClick={()=>setEditProject(null)}>Cancel</button>
              <button className="btn primary" onClick={async()=>{ if(!editProject.name.trim()) return; const np = isNew ? [...projects,editProject] : projects.map(p=>p.id===editProject.id?editProject:p); await saveProj(np); setEditProject(null); }}>Save</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── CHAT BUBBLE ───────────────────────────────────────────
  const renderChat = () => (
    <div className="chat-bubble">
      {chatOpen && (
        <div className="chat-panel">
          <div className="chat-header">
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:"var(--green)",boxShadow:"0 0 6px var(--green)"}}/>
              <span style={{fontWeight:700,fontSize:13}}>Chronos AI</span>
              <span style={{fontSize:10,color:"var(--muted)",fontFamily:"var(--mono)"}}>haiku 4.5</span>
            </div>
            <div style={{display:"flex",gap:6}}>
              <button className="btn ghost sm icon-btn" style={{fontSize:10}} title="Clear history" onClick={async()=>{ if(confirm("Clear chat history?")){ await saveChat([]); }}}>↺</button>
              <button className="btn ghost sm icon-btn" onClick={()=>setChatOpen(false)}>✕</button>
            </div>
          </div>
          <div className="chat-messages">
            {chatHistory.length===0 && (
              <div style={{textAlign:"center",padding:"20px 10px"}}>
                <div style={{fontSize:24,marginBottom:8}}>⊛</div>
                <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.6}}>Hey! I'm Chronos.<br/>Ask me to schedule time, set reminders,<br/>or help manage your work.</div>
              </div>
            )}
            {chatHistory.map((m,i)=>(
              <div key={i} className={`chat-msg ${m.role}`}>{m.content}</div>
            ))}
            {chatLoading && (
              <div className="chat-msg ai"><div className="chat-typing"><div className="dot"/><div className="dot"/><div className="dot"/></div></div>
            )}
            <div ref={chatEndRef}/>
          </div>
          <div className="chat-input-row">
            <input className="input" style={{flex:1}} placeholder="Message Chronos..." value={chatInput}
              onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();}}}/>
            <button className="btn primary icon-btn" onClick={sendChat} disabled={chatLoading}>↑</button>
          </div>
        </div>
      )}
      <button className="chat-fab" onClick={()=>setChatOpen(o=>!o)} title="Open AI Chat">
        {chatOpen ? "✕" : "⊛"}
      </button>
    </div>
  );

  // ── MAIN RENDER ───────────────────────────────────────────
  const VIEW_MAP = {
    schedule: renderSchedule, timer: renderTimer, userNotes: renderUserNotes,
    aiNotes: renderAiNotes, aiJournal: renderAiJournal, reminders: renderReminders,
    projects: renderProjects, files: renderFiles, settings: renderSettings,
  };
  const activeView = VIEW_MAP[view];
  const viewMeta = VIEWS.find(v=>v.id===view);
  const pendingCount = reminders.filter(r=>!r.done).length;

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <h1>Chronos</h1>
          <span>AI Time Manager</span>
        </div>
        <nav className="nav">
          <div className="nav-section">Workspace</div>
          {VIEWS.slice(0,3).map(v=>(
            <div key={v.id} className={`nav-item${view===v.id?" active":""}`} onClick={()=>setView(v.id)}>
              <span className="icon">{v.icon}</span>
              <span>{v.label}</span>
            </div>
          ))}
          <div className="nav-section">AI Memory</div>
          {VIEWS.slice(3,7).map(v=>(
            <div key={v.id} className={`nav-item${view===v.id?" active":""}`} onClick={()=>setView(v.id)}>
              <span className="icon">{v.icon}</span>
              <span>{v.label}</span>
              {v.id==="reminders" && pendingCount>0 && <span className="badge" style={{background:"var(--acc)",color:"#0b0d12",marginLeft:"auto"}}>{pendingCount}</span>}
            </div>
          ))}
          <div className="nav-section">System</div>
          {VIEWS.slice(7).map(v=>(
            <div key={v.id} className={`nav-item${view===v.id?" active":""}`} onClick={()=>setView(v.id)}>
              <span className="icon">{v.icon}</span>
              <span>{v.label}</span>
            </div>
          ))}
        </nav>
        {/* Sidebar footer */}
        <div style={{padding:"10px 14px",borderTop:"1px solid var(--brd)",fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)"}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:6,height:6,borderRadius:"50%",background: apiKey ? "var(--green)" : "var(--red)"}}/>
            {apiKey ? "API Connected" : "No API Key"}
          </div>
          <div style={{marginTop:3,fontSize:10}}>ctx: {contextMode}{contextMode==="project"&&contextProject?` · ${projects.find(p=>p.id===contextProject)?.name||"..."}`:""}</div>
        </div>
      </div>

      {/* Main workspace */}
      <div className="workspace">
        <div className="toolbar" style={{borderBottom:"1px solid var(--brd)",padding:"0 20px",minHeight:0,height:56}}>
          <h2>{viewMeta?.icon} {viewMeta?.label}</h2>
          <span style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)"}}>{new Date().toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",year:"numeric"})}</span>
        </div>
        <div className="content">
          {activeView?.()}
        </div>
      </div>

      {/* Overlays */}
      {renderEditModal()}
      {renderProjectModal()}
      {renderChat()}
    </div>
  );
}
