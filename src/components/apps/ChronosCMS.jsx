import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════
   CHRONOS CMS — AI-Powered Content Management System
   Custom code editor · IndexedDB · Anthropic + Groq support
   ═══════════════════════════════════════════════════════════ */

// ── IndexedDB ──────────────────────────────────────────────
const DB_NAME = "chronos_cms_v1", STORE = "cms";
const openDB = () => new Promise((ok, fail) => {
  const r = indexedDB.open(DB_NAME, 1);
  r.onupgradeneeded = e => { if (!e.target.result.objectStoreNames.contains(STORE)) e.target.result.createObjectStore(STORE); };
  r.onsuccess = () => ok(r.result); r.onerror = () => fail(r.error);
});
const dbGet  = async k => { const d = await openDB(); return new Promise(ok => { const r = d.transaction(STORE,"readonly").objectStore(STORE).get(k); r.onsuccess = () => ok(r.result ?? null); }); };
const dbSet  = async (k,v) => { const d = await openDB(); return new Promise(ok => { const tx = d.transaction(STORE,"readwrite"); tx.objectStore(STORE).put(v,k); tx.oncomplete = ok; }); };
const dbDel  = async k => { const d = await openDB(); return new Promise(ok => { const tx = d.transaction(STORE,"readwrite"); tx.objectStore(STORE).delete(k); tx.oncomplete = ok; }); };
const dbKeys = async () => { const d = await openDB(); return new Promise(ok => { const r = d.transaction(STORE,"readonly").objectStore(STORE).getAllKeys(); r.onsuccess = () => ok(r.result || []); }); };
const dbGetJSON = async (k, def) => { try { const v = await dbGet(k); return v ? JSON.parse(v) : def; } catch { return def; } };
const dbSetJSON = async (k, v) => dbSet(k, JSON.stringify(v));

// ── Provider Config ────────────────────────────────────────
const IS_CLAUDE = typeof window !== "undefined" &&
  (window.location?.hostname?.includes("claude.ai") || window.location?.hostname?.includes("claudeusercontent.com"));

const PROVIDERS = {
  anthropic: {
    label:"Anthropic", keyPrefix:"sk-ant-", keyPlaceholder:"sk-ant-api03-...",
    models:[{ id:"claude-haiku-4-5-20251001", label:"Claude Haiku 4.5", note:"Fast · Cheap" }],
    defaultModel:"claude-haiku-4-5-20251001",
  },
  groq: {
    label:"Groq", keyPrefix:"gsk_", keyPlaceholder:"gsk_...",
    models:[
      { id:"llama-3.3-70b-versatile",                      label:"Llama 3.3 70B",   note:"131K ctx" },
      { id:"moonshotai/kimi-k2-instruct-0905",              label:"Kimi K2",         note:"262K ctx" },
      { id:"meta-llama/llama-4-maverick-17b-128e-instruct", label:"Llama 4 Maverick",note:"Preview" },
    ],
    defaultModel:"llama-3.3-70b-versatile",
  },
};

const callAI = async (system, messages, provider, model, apiKey) => {
  if (provider === "groq" && IS_CLAUDE) throw new Error("Groq is blocked by Claude.ai CSP. Switch to Anthropic in Settings.");
  if (provider === "anthropic") {
    const hdrs = { "Content-Type":"application/json","anthropic-version":"2023-06-01" };
    if (apiKey) hdrs["x-api-key"] = apiKey;
    const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:hdrs,
      body:JSON.stringify({model,max_tokens:1200,system,messages:messages.slice(-20).map(m=>({role:m.role,content:m.content}))})});
    if (!res.ok){const e=await res.json();throw new Error(e.error?.message||`HTTP ${res.status}`);}
    return (await res.json()).content?.[0]?.text||"";
  }
  if (provider === "groq") {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",
      headers:{"Content-Type":"application/json","Authorization":`Bearer ${apiKey}`},
      body:JSON.stringify({model,max_tokens:1200,messages:[{role:"system",content:system},...messages.slice(-20).map(m=>({role:m.role,content:m.content}))]})});
    if (!res.ok){const e=await res.json();throw new Error(e.error?.message||`HTTP ${res.status}`);}
    return (await res.json()).choices?.[0]?.message?.content||"";
  }
  throw new Error("Unknown provider");
};

const parseActions = txt => { const r=[],re=/```action\n([\s\S]*?)```/g; let m; while((m=re.exec(txt))!==null){try{r.push(JSON.parse(m[1]))}catch{}} return r; };
const stripActions = txt => txt.replace(/```action\n[\s\S]*?```/g,"").replace(/\n{3,}/g,"\n\n").trim();

// ── Syntax Highlighter ─────────────────────────────────────
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const sp  = (color,s,extra="") => `<span style="color:${color}${extra}">${s}</span>`;
const C = { comment:"#4d5a78",kw:"#e4a853",str:"#f97316",num:"#2dd4a7",fn:"#7c6ef5",tag:"#5b8af5",attr:"#2dd4a7",prop:"#5b8af5",sel:"#e4a853",unit:"#ff8c69",punct:"#6e7f9e",type:"#c792ea",bool:"#e4a853" };

function hlRange(code, rules) {
  const hits = [];
  rules.forEach(([pri,color,re,style]) => {
    const g = new RegExp(re.source, re.flags.replace(/g/,"")+"g");
    let m; while((m=g.exec(code))!==null) hits.push({s:m.index,e:m.index+m[0].length,color,style:style||""});
  });
  hits.sort((a,b)=>a.s-b.s||a.e-b.e);
  const acc=[]; let cur=0;
  for(const h of hits){ if(h.s>=cur){acc.push(h);cur=h.e;} }
  let out="",pos=0;
  for(const {s,e,color,style} of acc){ out+=esc(code.slice(pos,s)); out+=sp(color,esc(code.slice(s,e)),style?";"+style:""); pos=e; }
  return out+esc(code.slice(pos));
}

const JS_RULES = [
  [0,C.comment,/\/\*[\s\S]*?\*\//,"font-style:italic"],
  [0,C.comment,/\/\/[^\n]*/,"font-style:italic"],
  [1,C.str,/`(?:[^`\\]|\\.)*`/],
  [1,C.str,/"(?:[^"\\]|\\.)*"/],
  [1,C.str,/'(?:[^'\\]|\\.)*'/],
  [2,C.kw,/\b(?:const|let|var|function|class|return|if|else|for|while|do|switch|case|break|continue|new|this|typeof|instanceof|import|export|default|async|await|try|catch|finally|throw|of|in|from|void|delete|yield|super|extends|static|get|set)\b/],
  [2,C.bool,/\b(?:true|false|null|undefined|NaN|Infinity)\b/],
  [3,C.type,/\b([A-Z][a-zA-Z0-9]*)\b/],
  [4,C.num,/\b0x[0-9a-fA-F]+|\b\d+\.?\d*(?:[eE][+-]?\d+)?\b/],
  [5,C.fn,/\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*\()/],
  [6,C.punct,/[{}[\]().,;:!?|&^~]/],
];
const CSS_RULES = [
  [0,C.comment,/\/\*[\s\S]*?\*\//,"font-style:italic"],
  [1,C.str,/"[^"]*"|'[^']*'/],
  [2,C.sel,/@[a-zA-Z-]+/],
  [3,C.num,/#[0-9a-fA-F]{3,8}\b/],
  [4,C.num,/\b\d+\.?\d*/],
  [4,C.unit,/(?<=\d)(px|em|rem|%|vh|vw|vmin|vmax|s|ms|fr|ch|ex|cm|mm|in|pt)\b/],
  [5,C.fn,/\b(?:var|calc|rgba?|hsla?|linear-gradient|radial-gradient|conic-gradient|min|max|clamp|env|url)\b/],
  [6,C.kw,/\b(?:inherit|initial|unset|revert|auto|none|normal|bold|italic|underline|solid|dashed|dotted|flex|grid|block|inline|absolute|relative|fixed|sticky)\b/],
  [7,C.punct,/[{}:;,()]/],
];
const JSON_RULES = [
  [0,C.comment,/\/\/[^\n]*/],
  [1,C.prop,/"(?:[^"\\]|\\.)*"(?=\s*:)/],
  [2,C.str,/"(?:[^"\\]|\\.)*"/],
  [3,C.num,/-?\b\d+\.?\d*(?:[eE][+-]?\d+)?\b/],
  [4,C.kw,/\b(?:true|false|null)\b/],
  [5,C.punct,/[{}[\],]/],
];
const MD_RULES = [
  [0,C.kw,/^#{1,6}\s+.+$/m],
  [1,C.str,/\*\*[^*]+\*\*|__[^_]+__/],
  [2,C.fn,/\*[^*]+\*|_[^_]+_/],
  [3,C.comment,/`[^`]+`/],
  [4,C.attr,/\[[^\]]+\]\([^)]+\)/],
  [5,C.num,/^[-*+]\s/m],
  [6,C.comment,/^>\s.+$/m,"font-style:italic"],
];

function hlHTML(code) {
  let out="",i=0,n=code.length;
  while(i<n){
    if(code.startsWith("<!--",i)){
      const j=code.indexOf("-->",i+4); const e2=j===-1?n:j+3;
      out+=sp(C.comment,esc(code.slice(i,e2)),"font-style:italic"); i=e2;
    } else if(code.startsWith("<![",i)||code.startsWith("<!D",i)){
      const j=code.indexOf(">",i)+1||n;
      out+=sp(C.kw,esc(code.slice(i,j))); i=j;
    } else if(code[i]==="<"&&(code[i+1]==="/"||/[a-zA-Z]/.test(code[i+1]||""))){
      let j=i+1,inQ="";
      while(j<n){if(inQ){if(code[j]===inQ)inQ="";}else if(code[j]==='"'||code[j]==="'")inQ=code[j];else if(code[j]===">"){j++;break;}j++;}
      out+=colorTag(code.slice(i,j)); i=j;
    } else {
      let j=i+1; while(j<n&&code[j]!=="<")j++;
      out+=esc(code.slice(i,j)); i=j;
    }
  }
  return out;
}
function colorTag(tag){
  let r="",i=0;
  r+=esc("<"); i++;
  if(tag[i]==="/"){r+=esc("/");i++;}
  const ns=i; while(i<tag.length-1&&/[a-zA-Z0-9-]/.test(tag[i]))i++;
  r+=sp(C.tag,esc(tag.slice(ns,i)));
  while(i<tag.length){
    if(/\s/.test(tag[i])){r+=tag[i];i++;continue;}
    if(tag[i]==="/"||tag[i]===">"){r+=esc(tag[i]);i++;continue;}
    const as=i; while(i<tag.length&&/[a-zA-Z0-9_:.-]/.test(tag[i]))i++;
    const aName=tag.slice(as,i);
    if(!aName){r+=esc(tag[i]||"");i++;continue;}
    r+=sp(C.attr,esc(aName));
    if(tag[i]==="="){
      r+="="; i++;
      const q=tag[i];
      if(q==='"'||q==="'"){
        const vs=i; let j=i+1; while(j<tag.length&&tag[j]!==q)j++; j++;
        r+=sp(C.str,esc(tag.slice(vs,j))); i=j;
      }
    }
  }
  return r;
}

const getLang = f => { const x=(f||"").split(".").pop().toLowerCase(); return {html:"html",htm:"html",css:"css",scss:"css",js:"js",jsx:"js",ts:"js",tsx:"js",mjs:"js",json:"json",md:"md",markdown:"md"}[x]||"plain"; };

function highlight(code, lang) {
  if(!code) return "";
  try {
    if(lang==="html") return hlHTML(code);
    if(lang==="css")  return hlRange(code,CSS_RULES);
    if(lang==="js")   return hlRange(code,JS_RULES);
    if(lang==="json") return hlRange(code,JSON_RULES);
    if(lang==="md")   return hlRange(code,MD_RULES);
    return esc(code);
  } catch{ return esc(code); }
}

// ── SyntaxEditor Component ─────────────────────────────────
function SyntaxEditor({ value="", onChange, language="plain", readOnly=false, style={} }) {
  const taRef  = useRef(null);
  const preRef = useRef(null);
  const lnRef  = useRef(null);
  const [hlHTML2, setHlHTML] = useState("");
  const hlTimer = useRef(null);

  useEffect(() => {
    clearTimeout(hlTimer.current);
    hlTimer.current = setTimeout(() => setHlHTML(highlight(value, language)), 60);
    return () => clearTimeout(hlTimer.current);
  }, [value, language]);

  const syncScroll = () => {
    if (!taRef.current || !preRef.current) return;
    preRef.current.scrollTop  = taRef.current.scrollTop;
    preRef.current.scrollLeft = taRef.current.scrollLeft;
    if (lnRef.current) lnRef.current.scrollTop = taRef.current.scrollTop;
  };

  const handleKey = e => {
    const ta = taRef.current;
    const { selectionStart: s, selectionEnd: end } = ta;
    const v = value;

    if (e.key === "Tab") {
      e.preventDefault();
      const indent = "  ";
      if (e.shiftKey) {
        // un-indent: remove up to 2 spaces before cursor
        const lineStart = v.lastIndexOf("\n", s - 1) + 1;
        if (v.slice(lineStart, lineStart + 2) === "  ") {
          const nv = v.slice(0, lineStart) + v.slice(lineStart + 2);
          onChange(nv);
          requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s - 2; });
        }
      } else {
        const nv = v.slice(0, s) + indent + v.slice(end);
        onChange(nv);
        requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + 2; });
      }
      return;
    }

    // Auto-close pairs
    const pairs = { "{":"}","(":")", "[":"]","\"":"\"","'":"'" };
    if (pairs[e.key] && s === end) {
      e.preventDefault();
      const close = pairs[e.key];
      const nv = v.slice(0,s) + e.key + close + v.slice(end);
      onChange(nv);
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + 1; });
      return;
    }

    // Skip closing char if already there
    const closers = new Set(["}", ")", "]", "\"", "'"]);
    if (closers.has(e.key) && v[s] === e.key) {
      e.preventDefault();
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + 1; });
      return;
    }

    // Enter: auto-indent
    if (e.key === "Enter") {
      const lineStart = v.lastIndexOf("\n", s - 1) + 1;
      const line = v.slice(lineStart, s);
      const indent = line.match(/^(\s*)/)[1];
      const extraIndent = v[s - 1] === "{" || v[s - 1] === "(" || v[s - 1] === "[" ? "  " : "";
      const nv = v.slice(0, s) + "\n" + indent + extraIndent + v.slice(end);
      e.preventDefault();
      onChange(nv);
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + 1 + indent.length + extraIndent.length; });
    }
  };

  const lineCount = (value.match(/\n/g)||[]).length + 1;
  const lineNums = Array.from({length:lineCount},(_,i)=>i+1);

  const sharedStyle = {
    fontFamily:"'IBM Plex Mono',monospace", fontSize:13, lineHeight:"1.65",
    padding:"12px 16px", margin:0, tabSize:2,
  };

  return (
    <div style={{display:"flex",height:"100%",background:"var(--bg)",overflow:"hidden",...style}}>
      {/* Line numbers */}
      <div ref={lnRef} style={{width:52,background:"var(--surf)",borderRight:"1px solid var(--brd)",overflow:"hidden",flexShrink:0,paddingTop:12,paddingBottom:12,userSelect:"none"}}>
        {lineNums.map(n=>(
          <div key={n} style={{textAlign:"right",paddingRight:12,fontSize:12,lineHeight:"1.65",fontFamily:"'IBM Plex Mono',monospace",color:"var(--muted)",opacity:.5}}>{n}</div>
        ))}
      </div>
      {/* Editor area */}
      <div style={{flex:1,position:"relative",overflow:"hidden"}}>
        <pre ref={preRef} aria-hidden="true"
          dangerouslySetInnerHTML={{__html:hlHTML2+"\n"}}
          style={{...sharedStyle,position:"absolute",inset:0,pointerEvents:"none",overflow:"auto",color:"var(--txt)",whiteSpace:"pre-wrap",wordBreak:"break-word",margin:0,borderRadius:0}} />
        <textarea ref={taRef} value={value} readOnly={readOnly}
          onChange={e=>onChange(e.target.value)}
          onKeyDown={readOnly?undefined:handleKey}
          onScroll={syncScroll}
          spellCheck={false} autoCorrect="off" autoCapitalize="off"
          style={{...sharedStyle,position:"absolute",inset:0,background:"transparent",color:"transparent",caretColor:"var(--txt)",resize:"none",border:"none",outline:"none",overflow:"auto",whiteSpace:"pre-wrap",wordBreak:"break-word"}} />
      </div>
    </div>
  );
}

// ── CSS ────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0b0d12;--surf:#12151e;--card:#181c28;--card2:#1e2235;
  --brd:rgba(255,255,255,.07);--brd2:rgba(255,255,255,.11);
  --txt:#dde3f0;--muted:#5a6480;--faint:#2d3350;
  --acc:#e4a853;--acc2:#5b8af5;--green:#2dd4a7;--red:#ff6b6b;--orange:#f97316;--groq:#f55036;--purple:#7c6ef5;
  --font:'Syne',sans-serif;--mono:'IBM Plex Mono',monospace;
  --r:8px;--r2:12px;
}
body{background:var(--bg);color:var(--txt);font-family:var(--font);font-size:14px;line-height:1.5}
::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--faint);border-radius:2px}
input,textarea,button,select{font-family:var(--font);outline:none}
textarea{resize:vertical}
.app{display:grid;grid-template-columns:228px 1fr;height:100vh;overflow:hidden}
.sidebar{background:var(--surf);border-right:1px solid var(--brd);display:flex;flex-direction:column;overflow:hidden}
.logo{padding:18px 16px 14px;border-bottom:1px solid var(--brd)}
.logo h1{font-size:17px;font-weight:800;letter-spacing:-.5px;color:var(--acc)}
.logo span{font-size:10px;color:var(--muted);font-family:var(--mono);letter-spacing:.04em}
.nav{flex:1;padding:8px 6px;overflow-y:auto}
.nav-section{font-size:9.5px;font-family:var(--mono);color:var(--faint);letter-spacing:.1em;text-transform:uppercase;padding:12px 10px 5px;margin-top:2px}
.nav-item{display:flex;align-items:center;gap:9px;padding:8px 11px;border-radius:var(--r);cursor:pointer;transition:all .1s;color:var(--muted);font-size:13px;font-weight:500;user-select:none}
.nav-item:hover{background:var(--card);color:var(--txt)}
.nav-item.active{background:var(--card2);color:var(--acc)}
.nav-item .ni{font-size:14px;width:18px;text-align:center;flex-shrink:0}
.workspace{background:var(--bg);overflow:hidden;display:flex;flex-direction:column}
.toolbar{display:flex;align-items:center;gap:10px;padding:0 20px;border-bottom:1px solid var(--brd);flex-shrink:0;height:54px}
.toolbar h2{font-size:15px;font-weight:700;letter-spacing:-.3px;margin-right:auto;display:flex;align-items:center;gap:8px}
.content{flex:1;overflow:hidden;position:relative}
.btn{padding:7px 13px;border-radius:var(--r);border:1px solid var(--brd2);background:var(--card);color:var(--txt);cursor:pointer;font-size:12.5px;font-weight:500;transition:all .1s;white-space:nowrap;display:inline-flex;align-items:center;gap:6px}
.btn:hover{background:var(--card2);border-color:var(--brd2)}
.btn.primary{background:var(--acc);border-color:var(--acc);color:#0b0d12;font-weight:700}
.btn.primary:hover{filter:brightness(1.08)}
.btn.ghost{background:transparent;border-color:transparent;color:var(--muted)}
.btn.ghost:hover{background:var(--card);color:var(--txt)}
.btn.sm{padding:5px 10px;font-size:11.5px}
.btn.danger{color:var(--red);border-color:rgba(255,107,107,.3)}
.btn.danger:hover{background:rgba(255,107,107,.08)}
.btn.success{color:var(--green);border-color:rgba(45,212,167,.3)}
.btn:disabled{opacity:.45;cursor:not-allowed}
.input{background:var(--card);border:1px solid var(--brd2);color:var(--txt);padding:8px 11px;border-radius:var(--r);font-size:13px;width:100%;transition:border .1s}
.input:focus{border-color:var(--acc)}
.input::placeholder{color:var(--muted)}
.select{background:var(--card);border:1px solid var(--brd2);color:var(--txt);padding:7px 10px;border-radius:var(--r);font-size:13px;cursor:pointer;width:100%}
.select:focus{border-color:var(--acc)}
.textarea{background:var(--card);border:1px solid var(--brd2);color:var(--txt);padding:10px 11px;border-radius:var(--r);font-size:13px;width:100%;min-height:100px;line-height:1.6}
.textarea:focus{border-color:var(--acc)}
.card{background:var(--card);border:1px solid var(--brd);border-radius:var(--r2);padding:16px}
.field{display:flex;flex-direction:column;gap:5px;margin-bottom:13px}
.field label{font-size:10.5px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;font-family:var(--mono)}
.badge{font-family:var(--mono);font-size:10px;padding:2px 7px;border-radius:20px;font-weight:600;display:inline-flex;align-items:center}
.tag{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)}
.modal{background:var(--surf);border:1px solid var(--brd2);border-radius:var(--r2);padding:22px;width:100%;max-width:520px;max-height:94vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.8)}
.modal h3{font-size:16px;font-weight:700;margin-bottom:16px}
.scroll-area{overflow-y:auto;height:100%;padding:20px}
.empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;height:100%;color:var(--muted);font-size:13px;text-align:center;padding:40px}
.empty-state .ei{font-size:34px;opacity:.25}
/* Status badges */
.s-published{background:rgba(45,212,167,.12);color:var(--green)}
.s-draft{background:rgba(228,168,83,.12);color:var(--acc)}
.s-archived{background:rgba(90,100,128,.12);color:var(--muted)}
/* Content list */
.content-row{display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:var(--r);border:1px solid var(--brd);background:var(--card);cursor:pointer;transition:border .1s;margin-bottom:6px}
.content-row:hover{border-color:var(--brd2)}
.content-row .title{font-weight:600;font-size:13.5px;flex:1;min-width:0}
.content-row .slug{font-family:var(--mono);font-size:11px;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
/* Dashboard stat cards */
.stat-card{background:var(--card);border:1px solid var(--brd);border-radius:var(--r2);padding:18px;display:flex;flex-direction:column;gap:6px}
.stat-num{font-size:32px;font-weight:800;letter-spacing:-1px;color:var(--txt)}
.stat-lbl{font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.06em;font-family:var(--mono)}
.stat-sub{font-size:11px;color:var(--muted)}
/* Editor file tree */
.file-item{display:flex;align-items:center;gap:7px;padding:5px 9px;border-radius:5px;cursor:pointer;font-family:var(--mono);font-size:11.5px;color:var(--muted);transition:all .08s;user-select:none}
.file-item:hover{background:var(--card);color:var(--txt)}
.file-item.active{background:var(--card2);color:var(--acc)}
/* Tabs */
.tab{padding:0 14px;height:38px;display:inline-flex;align-items:center;gap:7px;cursor:pointer;font-size:12px;border-right:1px solid var(--brd);color:var(--muted);transition:all .1s;white-space:nowrap;flex-shrink:0;font-family:var(--mono)}
.tab:hover{background:var(--card);color:var(--txt)}
.tab.active-tab{background:var(--bg);color:var(--txt);border-bottom:2px solid var(--acc);margin-bottom:-1px}
.tab-close{opacity:0;font-size:10px;padding:1px 3px;border-radius:3px;line-height:1;background:none;border:none;cursor:pointer;color:var(--muted)}
.tab:hover .tab-close{opacity:.7}
.tab-close:hover{opacity:1!important;background:rgba(255,107,107,.15);color:var(--red)}
/* Media grid */
.media-item{border-radius:var(--r);border:1px solid var(--brd);overflow:hidden;cursor:pointer;transition:border .1s;aspect-ratio:1;display:flex;flex-direction:column;background:var(--card)}
.media-item:hover{border-color:var(--brd2)}
/* Setup */
.provider-btn{padding:13px 15px;border-radius:var(--r);border:2px solid var(--brd2);background:var(--card);cursor:pointer;transition:all .12s;text-align:left;width:100%}
.provider-btn:hover{background:var(--card2)}
.provider-btn.ant{border-color:var(--acc)!important;background:rgba(228,168,83,.06)!important}
.provider-btn.grq{border-color:var(--groq)!important;background:rgba(245,80,54,.06)!important}
/* Chat */
.chat-bubble{position:fixed;bottom:20px;right:20px;z-index:100}
.chat-fab{width:46px;height:46px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 4px 20px rgba(0,0,0,.5);transition:all .12s}
.chat-fab:hover{transform:scale(1.07)}
.chat-panel{position:absolute;bottom:58px;right:0;width:370px;height:500px;background:var(--surf);border:1px solid var(--brd2);border-radius:var(--r2);display:flex;flex-direction:column;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,.7);animation:slideUp .15s ease}
@keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.chat-hdr{padding:11px 13px;border-bottom:1px solid var(--brd);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.chat-msgs{flex:1;overflow-y:auto;padding:11px;display:flex;flex-direction:column;gap:9px}
.chat-msg{padding:9px 11px;border-radius:var(--r);font-size:13px;line-height:1.55;max-width:90%}
.chat-msg.user{background:var(--acc2);color:#fff;margin-left:auto;border-radius:var(--r) var(--r) 2px var(--r)}
.chat-msg.ai{background:var(--card2);color:var(--txt);border-radius:var(--r) var(--r) var(--r) 2px}
.chat-input-row{padding:9px;border-top:1px solid var(--brd);display:flex;gap:7px;flex-shrink:0}
.dot{width:5px;height:5px;border-radius:50%;background:var(--muted);animation:blink 1.4s infinite}
.dot:nth-child(2){animation-delay:.2s}.dot:nth-child(3){animation-delay:.4s}
@keyframes blink{0%,80%,100%{opacity:.25}40%{opacity:1}}
.prose{font-size:13px;line-height:1.7;color:var(--txt);white-space:pre-wrap;font-family:var(--mono)}
.divider{height:1px;background:var(--brd);margin:14px 0}
`;

// ── Setup Modal ────────────────────────────────────────────
function SetupModal({ onComplete }) {
  const [step, setStep] = useState(1);
  const [provider, setProvider] = useState(IS_CLAUDE ? "anthropic" : "groq");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState(PROVIDERS[IS_CLAUDE?"anthropic":"groq"].defaultModel);
  const [error, setError] = useState("");
  const [testing, setTesting] = useState(false);

  const prov = PROVIDERS[provider];
  const pick = p => { setProvider(p); setModel(PROVIDERS[p].defaultModel); setError(""); };

  const connect = async () => {
    if (!apiKey.trim()) { setError("API key required."); return; }
    setTesting(true); setError("");
    try {
      await callAI("Reply with exactly: OK", [{role:"user",content:"ping"}], provider, model, apiKey.trim());
      onComplete({provider, model, apiKey: apiKey.trim()});
    } catch(e) { setError(`Connection failed: ${e.message}`); }
    setTesting(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{maxWidth:460}}>
        <div style={{textAlign:"center",marginBottom:22}}>
          <div style={{fontSize:28,marginBottom:8}}>⬡</div>
          <h2 style={{fontSize:20,fontWeight:800,letterSpacing:"-.5px",color:"var(--acc)"}}>Chronos CMS</h2>
          <p style={{fontSize:12.5,color:"var(--muted)",marginTop:5}}>Connect your AI provider to begin</p>
        </div>

        {step === 1 && (<>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
            <button className={`provider-btn${provider==="groq"?" grq":""}`} onClick={()=>pick("groq")}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span>⚡</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:13}}>Groq</div>
                  <div style={{fontSize:11,color:"var(--muted)"}}>Free tier · 300K tokens/day
                    {IS_CLAUDE && <span style={{color:"var(--orange)"}}> · CSP blocked inside Claude.ai</span>}
                  </div>
                </div>
                <span className="badge" style={{background:"rgba(245,80,54,.15)",color:"var(--groq)"}}>FREE</span>
              </div>
            </button>
            <button className={`provider-btn${provider==="anthropic"?" ant":""}`} onClick={()=>pick("anthropic")}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span>◆</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:13}}>Anthropic</div>
                  <div style={{fontSize:11,color:"var(--muted)"}}>Claude Haiku 4.5 · Pay per token</div>
                </div>
                <span className="badge" style={{background:"rgba(228,168,83,.15)",color:"var(--acc)"}}>API</span>
              </div>
            </button>
          </div>
          <button className="btn primary" style={{width:"100%"}} onClick={()=>setStep(2)}>Continue →</button>
          <p style={{fontSize:11,color:"var(--muted)",textAlign:"center",marginTop:10,lineHeight:1.6}}>
            Groq keys at <strong style={{color:"var(--txt)"}}>console.groq.com</strong> &nbsp;·&nbsp; Anthropic at <strong style={{color:"var(--txt)"}}>console.anthropic.com</strong>
          </p>
        </>)}

        {step === 2 && (<>
          <button className="btn ghost sm" style={{marginBottom:14}} onClick={()=>setStep(1)}>← Back</button>
          <div className="field">
            <label>{prov.label} API Key</label>
            <input className="input" type="password" value={apiKey} placeholder={prov.keyPlaceholder}
              onChange={e=>{setApiKey(e.target.value);setError("");}} onKeyDown={e=>e.key==="Enter"&&connect()} autoFocus/>
            {error && <span style={{fontSize:11.5,color:"var(--red)"}}>{error}</span>}
          </div>
          <div className="field">
            <label>Model</label>
            <select className="select" value={model} onChange={e=>setModel(e.target.value)}>
              {prov.models.map(m=><option key={m.id} value={m.id}>{m.label} — {m.note}</option>)}
            </select>
          </div>
          <button className="btn primary" style={{width:"100%",marginTop:4}} onClick={connect} disabled={testing}>
            {testing ? "Testing..." : "Connect & Launch →"}
          </button>
          <p style={{fontSize:11,color:"var(--muted)",textAlign:"center",marginTop:10}}>Keys stored only in your browser — never sent to our servers.</p>
        </>)}
      </div>
    </div>
  );
}

// ── Media Preview Modal (standalone component to allow hooks) ─
function MediaPreviewModal({ data, onDelete, onClose }) {
  const [url, setUrl] = useState(null);
  useEffect(() => { dbGet(`media/data/${data.id}`).then(setUrl); }, [data.id]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{maxWidth:600}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <h3 style={{margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{data.name}</h3>
          <button className="btn ghost sm" onClick={onClose} style={{marginLeft:8}}>✕</button>
        </div>
        {url&&data.type?.startsWith("image/")&&<img src={url} alt={data.name} style={{width:"100%",borderRadius:"var(--r)",marginBottom:14}}/>}
        <div style={{fontSize:12,fontFamily:"var(--mono)",color:"var(--muted)",lineHeight:1.8}}>
          <div>Type: {data.type}</div>
          <div>Size: {(data.size/1024).toFixed(1)} KB</div>
          <div>Uploaded: {fmtDate(data.created)}</div>
          {url&&<div style={{marginTop:8,wordBreak:"break-all",fontSize:10,color:"var(--faint)"}}>Data URL: {url.slice(0,60)}…</div>}
        </div>
        <div style={{display:"flex",gap:8,marginTop:14,justifyContent:"space-between"}}>
          <button className="btn danger" onClick={()=>{onDelete(data.id);onClose();}}>Delete</button>
          {url&&<a href={url} download={data.name}><button className="btn">↓ Download</button></a>}
        </div>
      </div>
    </div>
  );
}


const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,7);
const now = () => new Date().toISOString();
const fmtDate = d => new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const wordCount = s => (s.match(/\b\w+\b/g)||[]).length;

const VIEWS = [
  {id:"dashboard", icon:"⊟",  label:"Dashboard",   sec:"Content"},
  {id:"pages",     icon:"⊞",  label:"Pages",        sec:"Content"},
  {id:"posts",     icon:"✎",  label:"Posts",        sec:"Content"},
  {id:"media",     icon:"⊛",  label:"Media",        sec:"Content"},
  {id:"editor",    icon:"◈",  label:"Code Editor",  sec:"Code"},
  {id:"templates", icon:"⊠",  label:"Templates",    sec:"Code"},
  {id:"aiNotes",   icon:"⊛",  label:"AI Notes",     sec:"AI Memory"},
  {id:"aiJournal", icon:"⌘",  label:"AI Journal",   sec:"AI Memory"},
  {id:"settings",  icon:"⚙",  label:"Settings",     sec:"System"},
];

const TEMPLATE_STARTER = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}}</title>
  <style>
    /* Add your styles here */
    body { font-family: system-ui, sans-serif; margin: 0; }
  </style>
</head>
<body>
  {{content}}
</body>
</html>`;

const PAGE_STARTER = `<section>
  <h1>Page Title</h1>
  <p>Start writing your content here.</p>
</section>`;

// ══════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════
export default function App() {
  const [booting, setBooting]     = useState(true);
  const [setupDone, setSetupDone] = useState(false);
  const [provider, setProvider]   = useState("groq");
  const [apiKey, setApiKey]       = useState("");
  const [aiModel, setAiModel]     = useState(PROVIDERS.groq.defaultModel);
  const [view, setView]           = useState("dashboard");

  // CMS Data
  const [pages, setPages]           = useState([]);
  const [posts, setPosts]           = useState([]);
  const [templates, setTemplates]   = useState([]);
  const [media, setMedia]           = useState([]);
  const [site, setSite]             = useState({ name:"My Site", tagline:"", url:"", description:"" });
  const [aiNotes, setAiNotes]       = useState("");
  const [aiJournal, setAiJournal]   = useState([]);
  const [chatHistory, setChatHistory] = useState([]);

  // Editor state
  const [editorFiles, setEditorFiles] = useState({});  // path -> content
  const [openTabs, setOpenTabs]       = useState([]);
  const [activeTab, setActiveTab]     = useState(null);
  const [editorDirty, setEditorDirty] = useState({}); // path -> bool

  // UI state
  const [chatOpen, setChatOpen]     = useState(false);
  const [chatInput, setChatInput]   = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [modal, setModal]           = useState(null); // { type, data }
  const [mediaUploading, setMediaUploading] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [showNewFile, setShowNewFile] = useState(false);
  const [previewPage, setPreviewPage] = useState(null);

  const chatEndRef  = useRef(null);
  const saveTimers  = useRef({});
  const mediaInputRef = useRef(null);

  // ── Boot ─────────────────────────────────────────────────
  useEffect(() => {
    const s = document.createElement("style");
    s.id = "cms-css"; s.textContent = CSS;
    if (!document.getElementById("cms-css")) document.head.appendChild(s);
    initApp();
  }, []);

  const initApp = async () => {
    try {
      const [k, p, m] = await Promise.all([
        dbGet("auth/key"), dbGet("auth/provider"), dbGet("auth/model")
      ]);
      if (k) {
        setApiKey(k); setProvider(p||"groq"); setAiModel(m||PROVIDERS[p||"groq"].defaultModel);
        setSetupDone(true);
        await loadAll();
      }
    } catch {}
    setBooting(false);
  };

  const loadAll = async () => {
    const [pg,po,tpl,md,st,an,aj,ch,eFiles] = await Promise.all([
      dbGetJSON("pages",[]), dbGetJSON("posts",[]), dbGetJSON("templates",[]),
      dbGetJSON("media/index",[]), dbGetJSON("site",{name:"My Site",tagline:"",url:"",description:""}),
      dbGet("ai/notes"), dbGetJSON("ai/journal",[]), dbGetJSON("chat/history",[]),
      dbGetJSON("editor/files",[]),
    ]);
    setPages(pg); setPosts(po); setTemplates(tpl); setMedia(md);
    setSite(st); if(an) setAiNotes(an); setAiJournal(aj); setChatHistory(ch);

    // Load editor file contents
    const fileContents = {};
    for (const path of eFiles) {
      const content = await dbGet(`editor/content/${path}`);
      if (content !== null) fileContents[path] = content;
    }
    setEditorFiles(fileContents);
  };

  const handleSetupComplete = async ({provider:p,model:m,apiKey:k}) => {
    await Promise.all([dbSet("auth/key",k),dbSet("auth/provider",p),dbSet("auth/model",m)]);
    setApiKey(k); setProvider(p); setAiModel(m);
    setSetupDone(true);
    await loadAll();
  };

  // ── Save helpers ──────────────────────────────────────────
  const savePages     = async p  => { setPages(p);     await dbSetJSON("pages",p); };
  const savePosts     = async p  => { setPosts(p);     await dbSetJSON("posts",p); };
  const saveTemplates = async t  => { setTemplates(t); await dbSetJSON("templates",t); };
  const saveMedia     = async m  => { setMedia(m);     await dbSetJSON("media/index",m); };
  const saveSite      = async s  => { setSite(s);      await dbSetJSON("site",s); };
  const saveAiNotes   = async n  => { setAiNotes(n);   await dbSet("ai/notes",n); };
  const saveAiJournal = async j  => { setAiJournal(j); await dbSetJSON("ai/journal",j); };
  const saveChatHist  = async h  => { setChatHistory(h); await dbSetJSON("chat/history",h); };

  const saveEditorFile = async (path, content) => {
    const nf = {...editorFiles, [path]: content};
    setEditorFiles(nf);
    await dbSet(`editor/content/${path}`, content);
    await dbSetJSON("editor/files", Object.keys(nf));
  };

  const deleteEditorFile = async (path) => {
    const nf = {...editorFiles}; delete nf[path];
    setEditorFiles(nf);
    await dbDel(`editor/content/${path}`);
    await dbSetJSON("editor/files", Object.keys(nf));
    setOpenTabs(t=>t.filter(x=>x!==path));
    if (activeTab===path) setActiveTab(openTabs.find(x=>x!==path)||null);
  };

  // ── Editor tab management ─────────────────────────────────
  const openFile = (path) => {
    if (!openTabs.includes(path)) setOpenTabs(t=>[...t,path]);
    setActiveTab(path);
    setView("editor");
  };

  const closeTab = (path, e) => {
    e?.stopPropagation();
    const idx = openTabs.indexOf(path);
    const newTabs = openTabs.filter(x=>x!==path);
    setOpenTabs(newTabs);
    if (activeTab===path) setActiveTab(newTabs[Math.max(0,idx-1)]||null);
  };

  const handleEditorChange = (path, content) => {
    setEditorFiles(f=>({...f,[path]:content}));
    setEditorDirty(d=>({...d,[path]:true}));
    clearTimeout(saveTimers.current[path]);
    saveTimers.current[path] = setTimeout(async () => {
      await saveEditorFile(path, content);
      setEditorDirty(d=>({...d,[path]:false}));
    }, 800);
  };

  // ── Media upload ──────────────────────────────────────────
  const handleMediaUpload = async (files) => {
    setMediaUploading(true);
    const newMedia = [];
    for (const file of files) {
      const reader = new FileReader();
      await new Promise(res => {
        reader.onload = async (e) => {
          const id = uid();
          const item = { id, name:file.name, type:file.type, size:file.size, created:now() };
          await dbSet(`media/data/${id}`, e.target.result);
          newMedia.push(item);
          res();
        };
        reader.readAsDataURL(file);
      });
    }
    await saveMedia([...media, ...newMedia]);
    setMediaUploading(false);
  };

  const deleteMedia = async (id) => {
    await dbDel(`media/data/${id}`);
    await saveMedia(media.filter(m=>m.id!==id));
  };

  // ── AI System Prompt ──────────────────────────────────────
  const buildSystem = async () => {
    const [an, aj, ch] = await Promise.all([
      dbGet("ai/notes"), dbGetJSON("ai/journal",[]), dbGetJSON("chat/history",[])
    ]);

    const recentPages = pages.slice(-10).map(p=>`  - [${p.status}] "${p.title}" /${p.slug}`).join("\n");
    const recentPosts = posts.slice(-10).map(p=>`  - [${p.status}] "${p.title}" /${p.slug}`).join("\n");
    const tplList = templates.map(t=>`  - "${t.name}" (id:${t.id})`).join("\n");
    const editorFileList = Object.keys(editorFiles).join(", ");

    return `You are the AI assistant embedded in Chronos CMS — a professional content management system.
Current time: ${new Date().toLocaleString()}
Site: "${site.name}" ${site.url ? `(${site.url})` : ""}

## CMS STATE
Pages (${pages.length} total):
${recentPages || "  (none)"}

Posts (${posts.length} total):
${recentPosts || "  (none)"}

Templates:
${tplList || "  (none)"}

Editor files: ${editorFileList || "(none)"}
Media files: ${media.length}

## YOUR MEMORY
Notes:
${an || "(empty)"}

Recent journal (last 3):
${aj.slice(-3).map(e=>`[${new Date(e.ts).toLocaleDateString()}] ${e.content.slice(0,120)}`).join("\n")||"(none)"}

## ACTIONS
You can modify the CMS by emitting action blocks. Always emit these when creating or modifying content.

Create a page:
\`\`\`action
{"action":"CREATE_PAGE","title":"About Us","slug":"about-us","content":"<h1>About</h1><p>...</p>","template":"","status":"draft","meta":{"title":"","description":""}}
\`\`\`

Update a page (use exact id from the pages list above):
\`\`\`action
{"action":"UPDATE_PAGE","id":"page-id","title":"...","content":"...","status":"published"}
\`\`\`

Create a post:
\`\`\`action
{"action":"CREATE_POST","title":"My Post","slug":"my-post","content":"<p>...</p>","excerpt":"Short summary","category":"General","tags":["tag1"],"status":"draft","featured":false}
\`\`\`

Update a post:
\`\`\`action
{"action":"UPDATE_POST","id":"post-id","title":"...","content":"...","status":"published"}
\`\`\`

Create a template:
\`\`\`action
{"action":"CREATE_TEMPLATE","name":"Landing Page","description":"...","content":"<!DOCTYPE html>..."}
\`\`\`

Write to your notepad (replaces entire content):
\`\`\`action
{"action":"WRITE_AI_NOTES","content":"..."}
\`\`\`

Add a journal entry:
\`\`\`action
{"action":"WRITE_AI_JOURNAL","entry":"..."}
\`\`\`

Update site config:
\`\`\`action
{"action":"UPDATE_SITE","name":"...","tagline":"...","url":"...","description":"..."}
\`\`\`

## GUIDELINES
- Write clean, semantic HTML for page/post content
- Generate complete, production-ready code when asked
- Help with SEO: meta descriptions, structured slugs, semantic markup
- Keep responses concise and actionable
- Always emit action blocks when modifying content — do not just describe what to do`;
  };

  // ── Execute AI Actions ────────────────────────────────────
  const execActions = async (actions) => {
    let newPages = [...pages], newPosts = [...posts], newTemplates = [...templates], newSite = {...site};
    let changed = { pages:false, posts:false, templates:false, site:false };

    for (const a of actions) {
      if (a.action === "CREATE_PAGE") {
        newPages.push({ id:uid(), title:a.title||"Untitled", slug:a.slug||slugify(a.title||"untitled"), content:a.content||PAGE_STARTER, template:a.template||"", status:a.status||"draft", meta:a.meta||{}, created:now(), updated:now() });
        changed.pages = true;
      } else if (a.action === "UPDATE_PAGE") {
        newPages = newPages.map(p=>p.id===a.id?{...p,...a,updated:now()}:p);
        changed.pages = true;
      } else if (a.action === "DELETE_PAGE") {
        newPages = newPages.filter(p=>p.id!==a.id);
        changed.pages = true;
      } else if (a.action === "CREATE_POST") {
        newPosts.push({ id:uid(), title:a.title||"Untitled", slug:a.slug||slugify(a.title||"untitled"), content:a.content||"<p></p>", excerpt:a.excerpt||"", category:a.category||"General", tags:a.tags||[], status:a.status||"draft", featured:a.featured||false, created:now(), updated:now() });
        changed.posts = true;
      } else if (a.action === "UPDATE_POST") {
        newPosts = newPosts.map(p=>p.id===a.id?{...p,...a,updated:now()}:p);
        changed.posts = true;
      } else if (a.action === "DELETE_POST") {
        newPosts = newPosts.filter(p=>p.id!==a.id);
        changed.posts = true;
      } else if (a.action === "CREATE_TEMPLATE") {
        newTemplates.push({ id:uid(), name:a.name||"New Template", description:a.description||"", content:a.content||TEMPLATE_STARTER, created:now() });
        changed.templates = true;
      } else if (a.action === "UPDATE_TEMPLATE") {
        newTemplates = newTemplates.map(t=>t.id===a.id?{...t,...a}:t);
        changed.templates = true;
      } else if (a.action === "WRITE_AI_NOTES") {
        await saveAiNotes(a.content||"");
      } else if (a.action === "WRITE_AI_JOURNAL") {
        await saveAiJournal([...aiJournal, {id:uid(),content:a.entry,ts:now()}]);
      } else if (a.action === "UPDATE_SITE") {
        newSite = {...newSite,...a}; delete newSite.action;
        changed.site = true;
      }
    }

    if (changed.pages)     await savePages(newPages);
    if (changed.posts)     await savePosts(newPosts);
    if (changed.templates) await saveTemplates(newTemplates);
    if (changed.site)      await saveSite(newSite);
  };

  // ── Send Chat ─────────────────────────────────────────────
  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = {role:"user",content:chatInput.trim(),ts:Date.now()};
    const msgs = [...chatHistory, userMsg];
    setChatHistory(msgs); setChatInput(""); setChatLoading(true);
    try {
      const system = await buildSystem();
      const raw = await callAI(system, msgs, provider, aiModel, apiKey);
      await execActions(parseActions(raw));
      const aiMsg = {role:"assistant",content:stripActions(raw),ts:Date.now()};
      await saveChatHist([...msgs,aiMsg]);
    } catch(err) {
      await saveChatHist([...msgs,{role:"assistant",content:`⚠️ ${err.message}`,ts:Date.now()}]);
    }
    setChatLoading(false);
    setTimeout(()=>chatEndRef.current?.scrollIntoView({behavior:"smooth"}),80);
  };

  // ═══════════════════════════════════════════════════════
  // VIEWS
  // ═══════════════════════════════════════════════════════

  // ── Dashboard ─────────────────────────────────────────────
  const renderDashboard = () => {
    const pub = pages.filter(p=>p.status==="published").length;
    const draftPages = pages.filter(p=>p.status==="draft").length;
    const pubPosts = posts.filter(p=>p.status==="published").length;
    const draftPosts = posts.filter(p=>p.status==="draft").length;
    const recent = [...pages.map(p=>({...p,kind:"page"})),...posts.map(p=>({...p,kind:"post"}))].sort((a,b)=>b.updated>a.updated?1:-1).slice(0,8);

    return (
      <div className="scroll-area" style={{padding:20}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          {/* Stats */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
            {[
              {num:pages.length, lbl:"Total Pages", sub:`${pub} published · ${draftPages} draft`, color:"var(--acc2)"},
              {num:posts.length, lbl:"Total Posts",  sub:`${pubPosts} published · ${draftPosts} draft`, color:"var(--green)"},
              {num:templates.length, lbl:"Templates", sub:"HTML templates", color:"var(--purple)"},
              {num:media.length, lbl:"Media Files", sub:"Images & assets", color:"var(--orange)"},
            ].map(({num,lbl,sub,color})=>(
              <div key={lbl} className="stat-card" style={{borderTop:`3px solid ${color}`}}>
                <div className="stat-num" style={{color}}>{num}</div>
                <div className="stat-lbl">{lbl}</div>
                <div className="stat-sub">{sub}</div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div style={{display:"flex",gap:8,marginBottom:22,flexWrap:"wrap"}}>
            <button className="btn primary" onClick={()=>{setModal({type:"page",data:{id:uid(),title:"",slug:"",content:PAGE_STARTER,template:"",status:"draft",meta:{},created:now(),updated:now()},isNew:true});}}> + New Page</button>
            <button className="btn" onClick={()=>{setModal({type:"post",data:{id:uid(),title:"",slug:"",content:"<p></p>",excerpt:"",category:"General",tags:[],status:"draft",featured:false,created:now(),updated:now()},isNew:true});}}> + New Post</button>
            <button className="btn" onClick={()=>setView("editor")}> ◈ Code Editor</button>
            <button className="btn" onClick={()=>mediaInputRef.current?.click()}> ⊛ Upload Media</button>
          </div>

          {/* Recent content */}
          <div style={{marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontSize:11,fontFamily:"var(--mono)",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".08em"}}>Recent Content</span>
          </div>
          {recent.length === 0 ? (
            <div className="empty-state" style={{height:180}}><div className="ei">⊟</div><p>No content yet. Create your first page or post!</p></div>
          ) : recent.map(item=>(
            <div key={item.id} className="content-row" onClick={()=>setModal({type:item.kind,data:item,isNew:false})}>
              <span className="badge" style={{background:item.kind==="page"?"rgba(91,138,245,.12)":"rgba(45,212,167,.12)",color:item.kind==="page"?"var(--acc2)":"var(--green)",minWidth:40,justifyContent:"center"}}>{item.kind==="page"?"PG":"POST"}</span>
              <div style={{flex:1,minWidth:0}}>
                <div className="title">{item.title||"Untitled"}</div>
                <div className="slug">/{item.slug||"—"}</div>
              </div>
              <span className={`badge s-${item.status}`}>{item.status}</span>
              <span style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)",flexShrink:0}}>{fmtDate(item.updated)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── Pages ─────────────────────────────────────────────────
  const renderPages = () => (
    <div className="scroll-area" style={{padding:20}}>
      <div style={{maxWidth:860,margin:"0 auto"}}>
        <div style={{display:"flex",gap:8,marginBottom:18}}>
          <button className="btn primary" onClick={()=>setModal({type:"page",data:{id:uid(),title:"",slug:"",content:PAGE_STARTER,template:"",status:"draft",meta:{},created:now(),updated:now()},isNew:true})}>+ New Page</button>
          <span style={{fontSize:12,color:"var(--muted)",display:"flex",alignItems:"center",marginLeft:"auto",fontFamily:"var(--mono)"}}>{pages.length} pages</span>
        </div>
        {pages.length===0?(
          <div className="empty-state"><div className="ei">⊞</div><p>No pages yet.<br/>Create your first page or ask the AI.</p></div>
        ):pages.map(p=>(
          <div key={p.id} className="content-row" onClick={()=>setModal({type:"page",data:p,isNew:false})}>
            <div style={{flex:1,minWidth:0}}>
              <div className="title">{p.title||"Untitled"}</div>
              <div className="slug">/{p.slug} {p.template&&<span style={{color:"var(--purple)",marginLeft:6}}>· {templates.find(t=>t.id===p.template)?.name}</span>}</div>
            </div>
            <span style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)"}}>{wordCount(p.content)} words</span>
            <span className={`badge s-${p.status}`}>{p.status}</span>
            <span style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)"}}>{fmtDate(p.updated)}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Posts ─────────────────────────────────────────────────
  const [postFilter, setPostFilter] = useState("all");
  const renderPosts = () => {
    const filtered = postFilter==="all" ? posts : posts.filter(p=>p.status===postFilter);
    return (
      <div className="scroll-area" style={{padding:20}}>
        <div style={{maxWidth:860,margin:"0 auto"}}>
          <div style={{display:"flex",gap:8,marginBottom:18,alignItems:"center"}}>
            <button className="btn primary" onClick={()=>setModal({type:"post",data:{id:uid(),title:"",slug:"",content:"<p></p>",excerpt:"",category:"General",tags:[],status:"draft",featured:false,created:now(),updated:now()},isNew:true})}>+ New Post</button>
            <div style={{display:"flex",gap:3,background:"var(--card)",padding:3,borderRadius:"var(--r)",marginLeft:"auto"}}>
              {["all","published","draft","archived"].map(s=>(
                <button key={s} className="btn sm" style={{background:postFilter===s?"var(--card2)":"transparent",border:"none",color:postFilter===s?"var(--txt)":"var(--muted)",textTransform:"capitalize",padding:"4px 10px"}} onClick={()=>setPostFilter(s)}>{s}</button>
              ))}
            </div>
          </div>
          {filtered.length===0?(
            <div className="empty-state"><div className="ei">✎</div><p>No {postFilter==="all"?"":""+postFilter+" "}posts yet.</p></div>
          ):filtered.map(p=>(
            <div key={p.id} className="content-row" onClick={()=>setModal({type:"post",data:p,isNew:false})}>
              {p.featured&&<span title="Featured" style={{color:"var(--acc)",fontSize:14}}>★</span>}
              <div style={{flex:1,minWidth:0}}>
                <div className="title">{p.title||"Untitled"}</div>
                <div className="slug">/{p.slug} · {p.category||"Uncategorized"} {p.tags?.length?`· ${p.tags.slice(0,3).join(", ")}`:""}</div>
              </div>
              <span style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)"}}>{wordCount(p.content)} words</span>
              <span className={`badge s-${p.status}`}>{p.status}</span>
              <span style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)"}}>{fmtDate(p.updated)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── Media ─────────────────────────────────────────────────
  const [mediaURLs, setMediaURLs] = useState({});
  const loadMediaURL = async (id) => {
    if (mediaURLs[id]) return;
    const data = await dbGet(`media/data/${id}`);
    if (data) setMediaURLs(u=>({...u,[id]:data}));
  };

  const renderMedia = () => {
    const images = media.filter(m=>m.type?.startsWith("image/"));
    const others = media.filter(m=>!m.type?.startsWith("image/"));
    return (
      <div className="scroll-area" style={{padding:20}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{display:"flex",gap:8,marginBottom:18,alignItems:"center"}}>
            <button className="btn primary" onClick={()=>mediaInputRef.current?.click()}>
              {mediaUploading?"Uploading...":"+ Upload Files"}
            </button>
            <span style={{fontSize:12,color:"var(--muted)",marginLeft:"auto",fontFamily:"var(--mono)"}}>{media.length} files</span>
          </div>

          {/* Drop zone */}
          <div style={{border:"2px dashed var(--brd2)",borderRadius:"var(--r2)",padding:24,textAlign:"center",marginBottom:20,color:"var(--muted)",fontSize:13,cursor:"pointer"}}
            onDragOver={e=>e.preventDefault()}
            onDrop={e=>{e.preventDefault();e.dataTransfer.files?.length&&handleMediaUpload([...e.dataTransfer.files]);}}
            onClick={()=>mediaInputRef.current?.click()}>
            Drag & drop files here, or click to browse
          </div>

          {images.length>0&&(<>
            <div style={{fontSize:10,fontFamily:"var(--mono)",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Images ({images.length})</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10,marginBottom:20}}>
              {images.map(m=>{
                if (!mediaURLs[m.id]) loadMediaURL(m.id);
                return (
                  <div key={m.id} className="media-item" onClick={()=>setModal({type:"media-preview",data:m})}>
                    {mediaURLs[m.id]
                      ? <img src={mediaURLs[m.id]} alt={m.name} style={{width:"100%",height:120,objectFit:"cover"}}/>
                      : <div style={{height:120,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--muted)"}}>⊛</div>}
                    <div style={{padding:"6px 8px",fontSize:10,fontFamily:"var(--mono)",color:"var(--muted)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.name}</div>
                  </div>
                );
              })}
            </div>
          </>)}

          {others.length>0&&(<>
            <div style={{fontSize:10,fontFamily:"var(--mono)",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Other Files ({others.length})</div>
            {others.map(m=>(
              <div key={m.id} className="content-row" style={{cursor:"default"}}>
                <span style={{fontSize:18}}>⊟</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:13}}>{m.name}</div>
                  <div style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)"}}>{m.type} · {(m.size/1024).toFixed(1)}KB · {fmtDate(m.created)}</div>
                </div>
                <button className="btn ghost sm danger" onClick={()=>deleteMedia(m.id)}>Delete</button>
              </div>
            ))}
          </>)}

          {media.length===0&&<div className="empty-state"><div className="ei">⊛</div><p>No media files yet.<br/>Upload images, PDFs, or other assets.</p></div>}
        </div>
      </div>
    );
  };

  // ── Code Editor ───────────────────────────────────────────
  const renderEditor = () => {
    const files = Object.keys(editorFiles).sort();
    const currentContent = activeTab ? editorFiles[activeTab] ?? "" : "";
    const currentLang = getLang(activeTab||"");

    return (
      <div style={{display:"flex",height:"100%"}}>
        {/* File tree */}
        <div style={{width:200,background:"var(--surf)",borderRight:"1px solid var(--brd)",display:"flex",flexDirection:"column",flexShrink:0,overflow:"hidden"}}>
          <div style={{padding:"10px 8px 6px",borderBottom:"1px solid var(--brd)"}}>
            <div style={{fontSize:9.5,fontFamily:"var(--mono)",color:"var(--faint)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>Explorer</div>
            {showNewFile ? (
              <form onSubmit={e=>{e.preventDefault();if(newFileName.trim()){const p=newFileName.trim();saveEditorFile(p,"");setNewFileName("");setShowNewFile(false);openFile(p);}}}>
                <input className="input" autoFocus value={newFileName} onChange={e=>setNewFileName(e.target.value)}
                  onBlur={()=>setShowNewFile(false)}
                  style={{fontSize:11,padding:"4px 8px",fontFamily:"var(--mono)"}} placeholder="filename.html"/>
              </form>
            ) : (
              <button className="btn ghost sm" style={{width:"100%",fontSize:11,justifyContent:"flex-start",gap:5}} onClick={()=>setShowNewFile(true)}>+ New File</button>
            )}
          </div>
          <div style={{flex:1,overflow:"auto",padding:4}}>
            {files.length===0 ? (
              <div style={{padding:"12px 8px",fontSize:11,color:"var(--faint)",fontFamily:"var(--mono)"}}>No files yet</div>
            ):files.map(f=>(
              <div key={f} className={`file-item${activeTab===f?" active":""}`} onClick={()=>openFile(f)}>
                <span style={{opacity:.4,fontSize:10}}>{getLang(f)==="html"?"⬡":getLang(f)==="css"?"◎":getLang(f)==="js"?"◆":"▪"}</span>
                <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f}</span>
                {editorDirty[f]&&<span style={{width:6,height:6,borderRadius:"50%",background:"var(--acc)",flexShrink:0}}/>}
              </div>
            ))}
          </div>
        </div>

        {/* Editor area */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {/* Tabs */}
          {openTabs.length>0&&(
            <div style={{display:"flex",borderBottom:"1px solid var(--brd)",background:"var(--surf)",overflow:"auto",flexShrink:0,height:38}}>
              {openTabs.map(t=>(
                <div key={t} className={`tab${activeTab===t?" active-tab":""}`} onClick={()=>setActiveTab(t)}>
                  <span>{t.split("/").pop()}</span>
                  {editorDirty[t]&&<span style={{width:6,height:6,borderRadius:"50%",background:"var(--acc)"}}/>}
                  <button className="tab-close" onClick={e=>closeTab(t,e)}>✕</button>
                </div>
              ))}
            </div>
          )}

          {activeTab ? (
            <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
              {/* Editor toolbar */}
              <div style={{display:"flex",alignItems:"center",gap:8,padding:"0 12px",height:36,background:"var(--surf)",borderBottom:"1px solid var(--brd)",flexShrink:0}}>
                <span style={{fontSize:10,fontFamily:"var(--mono)",color:"var(--muted)",flex:1}}>{activeTab}</span>
                <span className="badge" style={{background:"var(--card2)",color:"var(--muted)",fontSize:9}}>{currentLang.toUpperCase()}</span>
                <button className="btn ghost sm" style={{fontSize:11}} onClick={()=>{
                  const blob = new Blob([currentContent],{type:"text/plain"});
                  const a = document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=activeTab.split("/").pop(); a.click();
                }}>↓ Download</button>
                <button className="btn ghost sm danger" style={{fontSize:11}} onClick={()=>{if(confirm(`Delete ${activeTab}?`))deleteEditorFile(activeTab);}}>Delete</button>
              </div>
              <div style={{flex:1,overflow:"hidden"}}>
                <SyntaxEditor value={currentContent} language={currentLang}
                  onChange={v=>handleEditorChange(activeTab,v)} />
              </div>
              <div style={{height:24,background:"var(--surf)",borderTop:"1px solid var(--brd)",display:"flex",alignItems:"center",padding:"0 12px",gap:16,flexShrink:0}}>
                <span style={{fontSize:10,fontFamily:"var(--mono)",color:"var(--muted)"}}>{currentContent.split("\n").length} lines · {currentContent.length} chars</span>
                {editorDirty[activeTab]&&<span style={{fontSize:10,fontFamily:"var(--mono)",color:"var(--acc)"}}>● Saving…</span>}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="ei">◈</div>
              <p>Select a file from the tree<br/>or create a new one.</p>
              <button className="btn primary sm" onClick={()=>setShowNewFile(true)}>+ New File</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── Templates ─────────────────────────────────────────────
  const renderTemplates = () => (
    <div className="scroll-area" style={{padding:20}}>
      <div style={{maxWidth:860,margin:"0 auto"}}>
        <div style={{display:"flex",gap:8,marginBottom:18}}>
          <button className="btn primary" onClick={()=>setModal({type:"template",data:{id:uid(),name:"",description:"",content:TEMPLATE_STARTER,created:now()},isNew:true})}>+ New Template</button>
        </div>
        {templates.length===0?(
          <div className="empty-state"><div className="ei">⊠</div><p>No templates yet.<br/>Templates are reusable HTML structures for your pages.</p></div>
        ):templates.map(t=>(
          <div key={t.id} className="content-row" onClick={()=>setModal({type:"template",data:t,isNew:false})}>
            <div style={{flex:1}}>
              <div className="title">{t.name}</div>
              {t.description&&<div style={{fontSize:12,color:"var(--muted)"}}>{t.description}</div>}
            </div>
            <span style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)"}}>{t.content.split("\n").length} lines</span>
            <span style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)"}}>{fmtDate(t.created)}</span>
            <span style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)"}}>{pages.filter(p=>p.template===t.id).length} pages</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── AI Notes ──────────────────────────────────────────────
  const [notesAnnot, setNotesAnnot] = useState("");
  const annotTimer = useRef(null);
  useEffect(()=>{ dbGet("ai/annotation").then(v=>v&&setNotesAnnot(v)); },[]);

  const renderAiNotes = () => (
    <div className="scroll-area" style={{padding:20}}>
      <div style={{maxWidth:820,margin:"0 auto",display:"flex",flexDirection:"column",gap:16}}>
        <div className="card">
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <span>⊛</span><span style={{fontWeight:700}}>AI Notepad</span>
            <span className="badge" style={{background:"var(--card2)",color:"var(--muted)",marginLeft:"auto"}}>read-only · AI writes here</span>
          </div>
          <div className="prose" style={{minHeight:160}}>
            {aiNotes||<span style={{color:"var(--muted)"}}>The AI hasn't made notes yet. Start a conversation!</span>}
          </div>
        </div>
        <div className="card">
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <span>✎</span><span style={{fontWeight:700}}>Your Annotations</span>
          </div>
          <textarea className="textarea" style={{width:"100%",minHeight:120,fontFamily:"var(--mono)",fontSize:12}}
            value={notesAnnot} placeholder="Add notes about the AI's observations..."
            onChange={e=>{setNotesAnnot(e.target.value);clearTimeout(annotTimer.current);annotTimer.current=setTimeout(()=>dbSet("ai/annotation",e.target.value),600);}}/>
        </div>
      </div>
    </div>
  );

  // ── AI Journal ────────────────────────────────────────────
  const renderAiJournal = () => (
    <div className="scroll-area" style={{padding:20}}>
      <div style={{maxWidth:820,margin:"0 auto"}}>
        {aiJournal.length===0?(
          <div className="empty-state"><div className="ei">⌘</div><p>No journal entries yet.<br/>The AI writes here as it works with your content.</p></div>
        ):[...aiJournal].reverse().map(e=>(
          <div key={e.id} className="card" style={{marginBottom:14}}>
            <div style={{fontSize:10,color:"var(--muted)",fontFamily:"var(--mono)",marginBottom:8}}>{new Date(e.ts).toLocaleString()}</div>
            <div className="prose">{e.content}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Settings ──────────────────────────────────────────────
  const [settingsSite, setSettingsSite] = useState(null);
  useEffect(()=>setSettingsSite({...site}),[site]);

  const renderSettings = () => {
    const prov = PROVIDERS[provider];
    return (
      <div className="scroll-area" style={{padding:20}}>
        <div style={{maxWidth:640,margin:"0 auto",display:"flex",flexDirection:"column",gap:16}}>

          {/* Site Config */}
          <div className="card">
            <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>⬡ Site Configuration</div>
            {settingsSite && (<>
              {[["name","Site Name"],["tagline","Tagline"],["url","Site URL"],["description","Description"]].map(([k,lbl])=>(
                <div key={k} className="field">
                  <label>{lbl}</label>
                  <input className="input" value={settingsSite[k]||""} onChange={e=>setSettingsSite(s=>({...s,[k]:e.target.value}))}/>
                </div>
              ))}
              <button className="btn primary" onClick={()=>saveSite(settingsSite)}>Save Site Config</button>
            </>)}
          </div>

          {/* AI Provider */}
          <div className="card">
            <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>⊛ AI Provider</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
              {Object.entries(PROVIDERS).map(([pid,p])=>(
                <button key={pid} className={`provider-btn${provider===pid?(pid==="groq"?" grq":" ant"):""}`}
                  onClick={()=>{setProvider(pid);setAiModel(p.defaultModel);dbSet("auth/provider",pid);dbSet("auth/model",p.defaultModel);}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span>{pid==="groq"?"⚡":"◆"}</span>
                    <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13}}>{p.label}</div></div>
                    {provider===pid&&<span style={{fontSize:11,color:pid==="groq"?"var(--groq)":"var(--acc)"}}>● Active</span>}
                  </div>
                </button>
              ))}
            </div>
            <div className="field">
              <label>API Key</label>
              <input className="input" type="password" value={apiKey} placeholder={prov.keyPlaceholder}
                onChange={e=>{setApiKey(e.target.value);dbSet("auth/key",e.target.value);}}/>
            </div>
            <div className="field">
              <label>Model</label>
              <select className="select" value={aiModel} onChange={e=>{setAiModel(e.target.value);dbSet("auth/model",e.target.value);}}>
                {prov.models.map(m=><option key={m.id} value={m.id}>{m.label} — {m.note}</option>)}
              </select>
            </div>
            {IS_CLAUDE&&provider==="groq"&&<p style={{fontSize:11,color:"var(--orange)"}}>⚠ Groq is blocked by Claude.ai CSP. Switch to Anthropic to use AI here.</p>}
          </div>

          {/* Danger Zone */}
          <div className="card">
            <div style={{fontWeight:700,fontSize:15,marginBottom:12}}>⚠ Danger Zone</div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn danger" onClick={()=>{if(confirm("Reset auth? You'll need to re-enter your API key.")){Promise.all([dbDel("auth/key"),dbDel("auth/provider"),dbDel("auth/model")]).then(()=>{setSetupDone(false);setApiKey("");});}}}>Reset Auth</button>
              <button className="btn danger" onClick={async()=>{if(confirm("Delete ALL CMS data? This cannot be undone.")){const keys=await dbKeys();await Promise.all(keys.map(k=>dbDel(k)));await loadAll();}}}>Wipe All Data</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════
  // MODALS
  // ═══════════════════════════════════════════════════════

  const renderPageModal = () => {
    if (!modal || modal.type !== "page") return null;
    const { data, isNew } = modal;
    const up = (k,v) => setModal(m=>({...m,data:{...m.data,[k]:v}}));
    const upMeta = (k,v) => setModal(m=>({...m,data:{...m.data,meta:{...m.data.meta,[k]:v}}}));

    return (
      <div className="modal-overlay" onClick={()=>setModal(null)}>
        <div className="modal" style={{maxWidth:860,width:"calc(100vw - 40px)",height:"90vh",display:"flex",flexDirection:"column",padding:0}} onClick={e=>e.stopPropagation()}>
          {/* Modal header */}
          <div style={{display:"flex",alignItems:"center",padding:"14px 18px",borderBottom:"1px solid var(--brd)",flexShrink:0,gap:10}}>
            <h3 style={{margin:0,flex:1,fontSize:15}}>{isNew?"New Page":"Edit Page"}</h3>
            <select className="select" style={{width:"auto"}} value={data.status} onChange={e=>up("status",e.target.value)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            {!isNew&&<button className="btn danger sm" onClick={async()=>{if(confirm("Delete page?")){await savePages(pages.filter(p=>p.id!==data.id));setModal(null);}}}>Delete</button>}
            <button className="btn ghost sm" onClick={()=>setModal(null)}>✕</button>
          </div>

          {/* Two-pane layout */}
          <div style={{display:"flex",flex:1,overflow:"hidden"}}>
            {/* Left: meta */}
            <div style={{width:240,borderRight:"1px solid var(--brd)",padding:14,overflow:"auto",flexShrink:0}}>
              <div className="field">
                <label>Title</label>
                <input className="input" value={data.title} autoFocus onChange={e=>{up("title",e.target.value);if(!data.slug||data.slug===slugify(data.title))up("slug",slugify(e.target.value));}}/>
              </div>
              <div className="field">
                <label>Slug</label>
                <input className="input" value={data.slug} onChange={e=>up("slug",e.target.value)} style={{fontFamily:"var(--mono)",fontSize:11}}/>
              </div>
              <div className="field">
                <label>Template</label>
                <select className="select" value={data.template||""} onChange={e=>up("template",e.target.value)}>
                  <option value="">None</option>
                  {templates.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="divider"/>
              <div style={{fontSize:10,fontFamily:"var(--mono)",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>SEO Meta</div>
              <div className="field">
                <label>Meta Title</label>
                <input className="input" value={data.meta?.title||""} onChange={e=>upMeta("title",e.target.value)} placeholder={data.title}/>
              </div>
              <div className="field">
                <label>Meta Description</label>
                <textarea className="textarea" style={{minHeight:80}} value={data.meta?.description||""} onChange={e=>upMeta("description",e.target.value)} placeholder="Brief description for search engines..."/>
              </div>
              <div className="divider"/>
              <div style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)"}}>{wordCount(data.content)} words · {fmtDate(data.updated)}</div>
            </div>

            {/* Right: code editor */}
            <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
              <div style={{padding:"6px 12px",borderBottom:"1px solid var(--brd)",display:"flex",alignItems:"center",gap:8,flexShrink:0,background:"var(--surf)"}}>
                <span style={{fontSize:10,fontFamily:"var(--mono)",color:"var(--muted)"}}>HTML Content</span>
                <span className="badge" style={{background:"var(--card2)",color:"var(--muted)",fontSize:9,marginLeft:"auto"}}>HTML</span>
              </div>
              <div style={{flex:1,overflow:"hidden"}}>
                <SyntaxEditor value={data.content} language="html" onChange={v=>up("content",v)}/>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{padding:"10px 18px",borderTop:"1px solid var(--brd)",display:"flex",gap:8,justifyContent:"flex-end",flexShrink:0}}>
            <button className="btn ghost" onClick={()=>setModal(null)}>Cancel</button>
            <button className="btn primary" onClick={async()=>{
              if (!data.title.trim()) return;
              const np = isNew ? [...pages,{...data,updated:now()}] : pages.map(p=>p.id===data.id?{...data,updated:now()}:p);
              await savePages(np); setModal(null);
            }}>Save Page</button>
          </div>
        </div>
      </div>
    );
  };

  const renderPostModal = () => {
    if (!modal || modal.type !== "post") return null;
    const {data,isNew} = modal;
    const up = (k,v) => setModal(m=>({...m,data:{...m.data,[k]:v}}));

    return (
      <div className="modal-overlay" onClick={()=>setModal(null)}>
        <div className="modal" style={{maxWidth:860,width:"calc(100vw - 40px)",height:"90vh",display:"flex",flexDirection:"column",padding:0}} onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",alignItems:"center",padding:"14px 18px",borderBottom:"1px solid var(--brd)",flexShrink:0,gap:10}}>
            <h3 style={{margin:0,flex:1,fontSize:15}}>{isNew?"New Post":"Edit Post"}</h3>
            <select className="select" style={{width:"auto"}} value={data.status} onChange={e=>up("status",e.target.value)}>
              <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
            </select>
            {!isNew&&<button className="btn danger sm" onClick={async()=>{if(confirm("Delete post?")){await savePosts(posts.filter(p=>p.id!==data.id));setModal(null);}}}>Delete</button>}
            <button className="btn ghost sm" onClick={()=>setModal(null)}>✕</button>
          </div>

          <div style={{display:"flex",flex:1,overflow:"hidden"}}>
            <div style={{width:240,borderRight:"1px solid var(--brd)",padding:14,overflow:"auto",flexShrink:0}}>
              <div className="field">
                <label>Title</label>
                <input className="input" value={data.title} autoFocus onChange={e=>{up("title",e.target.value);if(!data.slug||data.slug===slugify(data.title))up("slug",slugify(e.target.value));}}/>
              </div>
              <div className="field">
                <label>Slug</label>
                <input className="input" value={data.slug} onChange={e=>up("slug",e.target.value)} style={{fontFamily:"var(--mono)",fontSize:11}}/>
              </div>
              <div className="field">
                <label>Excerpt</label>
                <textarea className="textarea" style={{minHeight:80}} value={data.excerpt} onChange={e=>up("excerpt",e.target.value)} placeholder="Brief summary..."/>
              </div>
              <div className="field">
                <label>Category</label>
                <input className="input" value={data.category} onChange={e=>up("category",e.target.value)}/>
              </div>
              <div className="field">
                <label>Tags (comma-separated)</label>
                <input className="input" value={(data.tags||[]).join(",")} onChange={e=>up("tags",e.target.value.split(",").map(t=>t.trim()).filter(Boolean))}/>
              </div>
              <div className="field" style={{flexDirection:"row",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>up("featured",!data.featured)}>
                <div style={{width:18,height:18,borderRadius:4,border:`1.5px solid var(--brd2)`,background:data.featured?"var(--acc)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {data.featured&&<span style={{color:"#0b0d12",fontSize:11}}>★</span>}
                </div>
                <span style={{fontSize:13}}>Featured Post</span>
              </div>
              <div className="divider"/>
              <div style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)"}}>{wordCount(data.content)} words · {fmtDate(data.updated)}</div>
            </div>

            <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
              <div style={{padding:"6px 12px",borderBottom:"1px solid var(--brd)",display:"flex",alignItems:"center",gap:8,flexShrink:0,background:"var(--surf)"}}>
                <span style={{fontSize:10,fontFamily:"var(--mono)",color:"var(--muted)"}}>Post Content (HTML)</span>
                <span className="badge" style={{background:"var(--card2)",color:"var(--muted)",fontSize:9,marginLeft:"auto"}}>HTML</span>
              </div>
              <div style={{flex:1,overflow:"hidden"}}>
                <SyntaxEditor value={data.content} language="html" onChange={v=>up("content",v)}/>
              </div>
            </div>
          </div>

          <div style={{padding:"10px 18px",borderTop:"1px solid var(--brd)",display:"flex",gap:8,justifyContent:"flex-end",flexShrink:0}}>
            <button className="btn ghost" onClick={()=>setModal(null)}>Cancel</button>
            <button className="btn primary" onClick={async()=>{
              if(!data.title.trim()) return;
              const np = isNew ? [...posts,{...data,updated:now()}] : posts.map(p=>p.id===data.id?{...data,updated:now()}:p);
              await savePosts(np); setModal(null);
            }}>Save Post</button>
          </div>
        </div>
      </div>
    );
  };

  const renderTemplateModal = () => {
    if (!modal || modal.type !== "template") return null;
    const {data,isNew} = modal;
    const up = (k,v) => setModal(m=>({...m,data:{...m.data,[k]:v}}));

    return (
      <div className="modal-overlay" onClick={()=>setModal(null)}>
        <div className="modal" style={{maxWidth:900,width:"calc(100vw - 40px)",height:"90vh",display:"flex",flexDirection:"column",padding:0}} onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",alignItems:"center",padding:"14px 18px",borderBottom:"1px solid var(--brd)",flexShrink:0,gap:10}}>
            <h3 style={{margin:0,flex:1,fontSize:15}}>{isNew?"New Template":"Edit Template"}</h3>
            {!isNew&&<button className="btn danger sm" onClick={async()=>{if(confirm("Delete template? Pages using it will lose the association.")){await saveTemplates(templates.filter(t=>t.id!==data.id));setModal(null);}}}>Delete</button>}
            <button className="btn ghost sm" onClick={()=>setModal(null)}>✕</button>
          </div>

          <div style={{display:"flex",flex:1,overflow:"hidden"}}>
            <div style={{width:220,borderRight:"1px solid var(--brd)",padding:14,flexShrink:0}}>
              <div className="field">
                <label>Name</label>
                <input className="input" value={data.name} autoFocus onChange={e=>up("name",e.target.value)}/>
              </div>
              <div className="field">
                <label>Description</label>
                <textarea className="textarea" style={{minHeight:80}} value={data.description} onChange={e=>up("description",e.target.value)}/>
              </div>
              <div className="divider"/>
              <div style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)",lineHeight:1.7}}>
                Use <code style={{background:"var(--card2)",padding:"1px 4px",borderRadius:3}}>{"{{title}}"}</code> and <code style={{background:"var(--card2)",padding:"1px 4px",borderRadius:3}}>{"{{content}}"}</code> as slot markers.
              </div>
              <div style={{marginTop:12,fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)"}}>{pages.filter(p=>p.template===data.id).length} pages use this template</div>
            </div>
            <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
              <div style={{padding:"6px 12px",borderBottom:"1px solid var(--brd)",background:"var(--surf)",flexShrink:0}}>
                <span style={{fontSize:10,fontFamily:"var(--mono)",color:"var(--muted)"}}>Template HTML</span>
              </div>
              <div style={{flex:1,overflow:"hidden"}}>
                <SyntaxEditor value={data.content} language="html" onChange={v=>up("content",v)}/>
              </div>
            </div>
          </div>

          <div style={{padding:"10px 18px",borderTop:"1px solid var(--brd)",display:"flex",gap:8,justifyContent:"flex-end",flexShrink:0}}>
            <button className="btn ghost" onClick={()=>setModal(null)}>Cancel</button>
            <button className="btn primary" onClick={async()=>{
              if(!data.name.trim()) return;
              const nt = isNew ? [...templates,data] : templates.map(t=>t.id===data.id?data:t);
              await saveTemplates(nt); setModal(null);
            }}>Save Template</button>
          </div>
        </div>
      </div>
    );
  };

  const renderMediaPreviewModal = () => {
    if (!modal || modal.type !== "media-preview") return null;
    return <MediaPreviewModal data={modal.data} onDelete={deleteMedia} onClose={()=>setModal(null)}/>;
  };

  // ── Chat Bubble ───────────────────────────────────────────
  const provColor = provider==="groq"?"var(--groq)":"var(--acc)";
  const modelLabel = PROVIDERS[provider]?.models.find(m=>m.id===aiModel)?.label || aiModel.split("/").pop();

  const renderChat = () => (
    <div className="chat-bubble">
      {chatOpen&&(
        <div className="chat-panel">
          <div className="chat-hdr">
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:"var(--green)",boxShadow:"0 0 6px var(--green)"}}/>
              <span style={{fontWeight:700,fontSize:13}}>Chronos CMS AI</span>
              <span className="badge" style={{background:`${provColor}18`,color:provColor,fontSize:9}}>{provider==="groq"?"⚡":"◆"} {modelLabel}</span>
            </div>
            <div style={{display:"flex",gap:5}}>
              <button className="btn ghost sm" title="Clear chat" onClick={async()=>{if(confirm("Clear chat history?")){await saveChatHist([]);}}} style={{fontSize:11}}>↺</button>
              <button className="btn ghost sm" onClick={()=>setChatOpen(false)} style={{fontSize:11}}>✕</button>
            </div>
          </div>
          <div className="chat-msgs">
            {chatHistory.length===0&&(
              <div style={{textAlign:"center",padding:"18px 10px"}}>
                <div style={{fontSize:22,marginBottom:8}}>⬡</div>
                <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.65}}>Hi! I'm your CMS assistant.<br/>Ask me to create pages, write posts,<br/>build templates, or review your content.</div>
              </div>
            )}
            {chatHistory.map((m,i)=>(
              <div key={i} className={`chat-msg ${m.role==="user"?"user":"ai"}`}>{m.content}</div>
            ))}
            {chatLoading&&<div className="chat-msg ai"><div style={{display:"flex",gap:4,alignItems:"center",padding:2}}><div className="dot"/><div className="dot"/><div className="dot"/></div></div>}
            <div ref={chatEndRef}/>
          </div>
          <div className="chat-input-row">
            <input className="input" style={{flex:1,fontSize:12.5}} placeholder="Ask me anything about your content..."
              value={chatInput} onChange={e=>setChatInput(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();}}}/>
            <button className="btn primary" style={{padding:"7px 12px"}} onClick={sendChat} disabled={chatLoading}>↑</button>
          </div>
        </div>
      )}
      <button className="chat-fab" style={{background:provColor,boxShadow:`0 4px 20px ${provColor}44`}} onClick={()=>setChatOpen(o=>!o)}>
        {chatOpen?"✕":"⬡"}
      </button>
    </div>
  );

  // ── Main Render ───────────────────────────────────────────
  if (booting) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#0b0d12",color:"#e4a853",fontFamily:"'Syne',sans-serif",flexDirection:"column",gap:12}}>
      <div style={{fontSize:28}}>⬡</div>
      <div style={{fontSize:13,color:"#5a6480",fontFamily:"'IBM Plex Mono',monospace"}}>Loading Chronos CMS…</div>
    </div>
  );

  if (!setupDone) return <SetupModal onComplete={handleSetupComplete}/>;

  const VIEW_MAP = {
    dashboard:renderDashboard, pages:renderPages, posts:renderPosts,
    media:renderMedia, editor:renderEditor, templates:renderTemplates,
    aiNotes:renderAiNotes, aiJournal:renderAiJournal, settings:renderSettings,
  };

  const sections = [...new Set(VIEWS.map(v=>v.sec))];
  const viewMeta = VIEWS.find(v=>v.id===view);
  const pendingPosts = posts.filter(p=>p.status==="draft").length;

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <h1>Chronos CMS</h1>
          <span>v1 · {site.name||"Unnamed Site"}</span>
        </div>
        <nav className="nav">
          {sections.map(sec=>(
            <div key={sec}>
              <div className="nav-section">{sec}</div>
              {VIEWS.filter(v=>v.sec===sec).map(v=>(
                <div key={v.id} className={`nav-item${view===v.id?" active":""}`} onClick={()=>setView(v.id)}>
                  <span className="ni">{v.icon}</span>
                  <span>{v.label}</span>
                  {v.id==="posts"&&pendingPosts>0&&<span className="badge" style={{background:"rgba(228,168,83,.18)",color:"var(--acc)",marginLeft:"auto",fontSize:10}}>{pendingPosts}</span>}
                </div>
              ))}
            </div>
          ))}
        </nav>
        <div style={{padding:"10px 12px",borderTop:"1px solid var(--brd)",fontSize:11,fontFamily:"var(--mono)"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,color:apiKey?"var(--green)":"var(--red)"}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:apiKey?"var(--green)":"var(--red)"}}/>
            {apiKey ? (provider==="groq"?"Groq":"Anthropic") : "No Key"}
          </div>
          <div style={{marginTop:2,color:"var(--faint)",fontSize:10,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{modelLabel}</div>
        </div>
      </div>

      {/* Main workspace */}
      <div className="workspace">
        {view !== "editor" && (
          <div className="toolbar">
            <h2><span style={{opacity:.5}}>{viewMeta?.icon}</span> {viewMeta?.label}</h2>
            <span style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)"}}>{new Date().toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",year:"numeric"})}</span>
          </div>
        )}
        <div className="content" style={view==="editor"?{height:"100%"}:{}}>
          {VIEW_MAP[view]?.()}
        </div>
      </div>

      {/* Modals */}
      {renderPageModal()}
      {renderPostModal()}
      {renderTemplateModal()}
      {modal?.type==="media-preview"&&renderMediaPreviewModal()}

      {/* Chat */}
      {renderChat()}

      {/* Hidden media input */}
      <input ref={mediaInputRef} type="file" multiple accept="image/*,video/*,.pdf,.svg,.txt,.json,.html,.css,.js" style={{display:"none"}}
        onChange={e=>e.target.files?.length&&handleMediaUpload([...e.target.files])}/>
    </div>
  );
}
