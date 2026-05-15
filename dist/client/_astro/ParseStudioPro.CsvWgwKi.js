import{j as e}from"./jsx-runtime.DXco-PnT.js";import{r as m}from"./index.CVyHE0nN.js";globalThis.process??={};globalThis.process.env??={};const at="ParseStudioPro_v1",F=()=>new Promise((a,l)=>{const i=indexedDB.open(at,1);i.onupgradeneeded=s=>{const o=s.target.result;["scripts","datasets","prompts"].forEach(c=>{o.objectStoreNames.contains(c)||o.createObjectStore(c,{keyPath:"id"})}),o.objectStoreNames.contains("kv")||o.createObjectStore("kv")},i.onsuccess=()=>a(i.result),i.onerror=()=>l(i.error)}),ne=async a=>{const l=await F();return new Promise(i=>{const s=l.transaction(a,"readonly").objectStore(a).getAll();s.onsuccess=()=>i(s.result||[]),s.onerror=()=>i([])})},_=async(a,l)=>{const i=await F();return new Promise(s=>{const o=i.transaction(a,"readwrite");o.objectStore(a).put(l),o.oncomplete=s,o.onerror=s})},U=async(a,l)=>{const i=await F();return new Promise(s=>{const o=i.transaction(a,"readwrite");o.objectStore(a).delete(l),o.oncomplete=s,o.onerror=s})},q=async a=>{const l=await F();return new Promise(i=>{const s=l.transaction("kv","readonly").objectStore("kv").get(a);s.onsuccess=()=>i(s.result??null),s.onerror=()=>i(null)})},I=async(a,l)=>{const i=await F();return new Promise(s=>{const o=i.transaction("kv","readwrite");o.objectStore("kv").put(l,a),o.oncomplete=s,o.onerror=s})},B=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6),oe=a=>new Date(a).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),nt=a=>new Date(a).toLocaleString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}),M=async a=>{try{await navigator.clipboard.writeText(a)}catch{const l=Object.assign(document.createElement("textarea"),{value:a,style:"position:fixed;opacity:0;pointer-events:none"});document.body.appendChild(l),l.select();try{document.execCommand("copy")}catch{}document.body.removeChild(l)}};function xe(a,l){if(!l?.trim())return{ok:!1,error:"No input text provided.",columns:[],rows:[]};try{const i=`
const __start = Date.now();
const __guard = () => {
  if (Date.now() - __start > 6000)
    throw new Error("Script timeout: exceeded 6 seconds. Check for infinite loops.");
};
${a}
const __result = parse(input);
return __result;
`,o=new Function("input",i)(l);if(!o||!Array.isArray(o.columns)||!Array.isArray(o.rows))return{ok:!1,error:"Script must return { columns: string[], rows: string[][] }",columns:[],rows:[]};const c=o.rows.filter(d=>Array.isArray(d)&&d.some(f=>String(f??"").trim())).map(d=>d.map(f=>String(f??"").trim()));return{ok:!0,columns:o.columns,rows:c,error:null}}catch(i){let s=i.message;return/parse is not defined/i.test(s)?s="Script must define: function parse(input) { ... return { columns, rows }; }":/is not a function/i.test(s)&&/parse/i.test(s)?s="parse() must be a function. Check: function parse(input) { ... }":/unexpected token/i.test(s)||/syntaxerror/i.test(s)?s=`Syntax error in script: ${s}`:/timeout/i.test(s)&&(s=s),{ok:!1,error:s,columns:[],rows:[]}}}const ot=a=>/^https?:\/\//i.test(a)||/^www\./i.test(a)||/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/|$)/.test(a),it=a=>/^https?:\/\//i.test(a)?a:`https://${a}`,ve=[{id:"__builtin_google",name:"Google Search Results",description:"Extracts business names and URLs from Google Search results. Handles organic, maps, and mixed listings.",tags:["google","search","business"],isBuiltin:!0,createdAt:0,updatedAt:0,currentVersion:1,versions:[{version:1,note:"v2 — upgraded URL detection: scheme + www + bare TLD",createdAt:0,code:`function parse(input) {
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
}`}]},{id:"__builtin_url_extractor",name:"URL Extractor",description:"Extracts ALL URLs from any pasted text — including bare domains like apify.com, site.io, company.ai. Works on emails, HTML, documents, and mixed content.",tags:["url","links","general"],isBuiltin:!0,createdAt:0,updatedAt:0,currentVersion:3,versions:[{version:3,note:"v3 — regex literals only, split-on-delimiters for bare domains, no lookbehind",createdAt:0,code:`function parse(input) {
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
}`}]},{id:"__builtin_url_formatter",name:"URL Formatter / Transformer",description:"Add or strip https://, http://, or www. from a list of URLs. One URL per line. Change the MODE variable to switch transform. Built for Apify actor targets and bulk scraping prep.",tags:["url","format","apify","transform","bulk"],isBuiltin:!0,createdAt:0,updatedAt:0,currentVersion:1,versions:[{version:1,note:"add-https · strip-all · add-www · strip-www · normalize · strip-scheme",createdAt:0,code:`function parse(input) {
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
    result = result.replace(/([^:])/\\/g, '$1/').replace(/\\/$/, '');

    results.push([line, result]);
  }

  return {
    columns: ['Original', 'Transformed (' + MODE + ')'],
    rows: results,
  };
}`}]},{id:"__builtin_csv",name:"CSV / TSV Parser",description:"Parses comma or tab-separated data. First row is treated as column headers. Auto-detects delimiter.",tags:["csv","tsv","spreadsheet"],isBuiltin:!0,createdAt:0,updatedAt:0,currentVersion:1,versions:[{version:1,note:"Initial — auto-detects delimiter, handles quoted fields",createdAt:0,code:`function parse(input) {
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
}`}]},{id:"__builtin_linkedin",name:"LinkedIn Search Results",description:"Parses people or company results copied directly from LinkedIn search pages.",tags:["linkedin","people","companies"],isBuiltin:!0,createdAt:0,updatedAt:0,currentVersion:1,versions:[{version:1,note:"Initial",createdAt:0,code:`function parse(input) {
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
}`}]}],Y=new Set(ve.map(a=>a.id)),ge=a=>{const l=new Set(a.map(i=>i.id));return[...ve.filter(i=>!l.has(i.id)),...a].sort((i,s)=>i.name.localeCompare(s.name))},we=async(a,l,i,s)=>{const o=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true",...i?{"x-api-key":i}:{}},body:JSON.stringify({model:s,max_tokens:2048,system:a,messages:l.slice(-20).map(d=>({role:d.role,content:d.content}))})});if(!o.ok){const d=await o.json().catch(()=>({}));throw new Error(d.error?.message||`HTTP ${o.status}`)}return(await o.json()).content?.[0]?.text||""},lt=a=>{const l=[],i=/<SCRIPT name="([^"]*)">([\s\S]*?)<\/SCRIPT>/g;let s;for(;(s=i.exec(a))!==null;)l.push({name:s[1],code:s[2].trim()});const o=/<AINOTE>([\s\S]*?)<\/AINOTE>/g,c=[];for(;(s=o.exec(a))!==null;)c.push(s[1].trim());return{clean:a.replace(/<SCRIPT name="[^"]*">[\s\S]*?<\/SCRIPT>/g,"").replace(/<AINOTE>[\s\S]*?<\/AINOTE>/g,"").replace(/\n{3,}/g,`

`).trim(),scripts:l,notes:c}},fe=(a,l,i="parse-studio-pro")=>{let s,o,c;const d=b=>`"${String(b).replace(/"/g,'""')}"`;if(l==="csv")s=[a.columns,...a.rows].map(b=>b.map(d).join(",")).join(`
`),o="text/csv",c="csv";else if(l==="json"){const b=a.rows.map(N=>Object.fromEntries(a.columns.map((j,y)=>[j,N[y]||""])));s=JSON.stringify(b,null,2),o="application/json",c="json"}else if(l==="md"){const b=a.columns.map(v=>v.length);a.rows.forEach(v=>v.forEach((k,h)=>{(k||"").length>b[h]&&(b[h]=k.length)}));const N=(v,k)=>String(v).padEnd(k),j="| "+a.columns.map((v,k)=>N(v,b[k])).join(" | ")+" |",y="| "+b.map(v=>"-".repeat(v)).join(" | ")+" |",p=a.rows.map(v=>"| "+v.map((k,h)=>N(k||"",b[h])).join(" | ")+" |");s=[j,y,...p].join(`
`),o="text/markdown",c="md"}else s=[a.columns.join("	"),...a.rows.map(b=>b.join("	"))].join(`
`),o="text/plain",c="txt";const f=new Blob([s],{type:o}),g=document.createElement("a");g.href=URL.createObjectURL(f),g.download=`${i}.${c}`,g.click(),URL.revokeObjectURL(g.href)},ct=`
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
`,dt=()=>{if(document.getElementById("psp-css"))return;const a=document.createElement("style");a.id="psp-css",a.textContent=ct,document.head.appendChild(a)};function pt({toasts:a}){return e.jsx("div",{className:"toast-stack",children:a.map(l=>e.jsxs("div",{className:`toast ${l.type}`,children:[e.jsx("span",{children:l.type==="ok"?"✓":l.type==="err"?"⚠":"ℹ"}),l.msg]},l.id))})}function mt({onClose:a,onSave:l,onNewVersion:i,initial:s}){const[o,c]=m.useState(s.name),[d,f]=m.useState(s.description||""),[g,b]=m.useState((s.tags||[]).join(", ")),[N,j]=m.useState(()=>s.versions.find(L=>L.version===s.currentVersion)?.code||""),[y,p]=m.useState(()=>s.versions.find(L=>L.version===s.currentVersion)?.note||""),[v,k]=m.useState(s.currentVersion),h=u=>{k(u.version),j(u.code),p(u.note||"")},E=()=>{o.trim()&&l({...s,name:o.trim(),description:d.trim(),tags:g.split(",").map(u=>u.trim()).filter(Boolean),currentVersion:v,updatedAt:Date.now(),versions:s.versions.map(u=>u.version===v?{...u,code:N,note:y.trim()}:u)})},W=()=>{o.trim()&&i({...s,name:o.trim(),description:d.trim(),tags:g.split(",").map(u=>u.trim()).filter(Boolean),updatedAt:Date.now(),versions:s.versions.map(u=>u.version===v?{...u,code:N,note:y.trim()}:u)},N,y.trim()||"Updated")};return e.jsx("div",{className:"modal-overlay",onClick:a,children:e.jsxs("div",{className:"modal",style:{maxWidth:680},onClick:u=>u.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("div",{className:"modal-title",children:s.isBuiltin&&Y.has(s.id)?"View Built-in Script":s.id.startsWith("__new")?"New Script":"Edit Script"}),s.isBuiltin&&e.jsx("span",{className:"tag tag-acc",style:{fontSize:9},children:"Built-in"}),e.jsx("button",{className:"btn btn-ghost btn-icon",onClick:a,style:{marginLeft:"auto"},children:"✕"})]}),e.jsxs("div",{className:"field",children:[e.jsx("span",{className:"lbl",children:"Name"}),e.jsx("input",{className:"ipt",value:o,onChange:u=>c(u.target.value),placeholder:"Script name"})]}),e.jsxs("div",{className:"field",children:[e.jsx("span",{className:"lbl",children:"Description"}),e.jsx("input",{className:"ipt",value:d,onChange:u=>f(u.target.value),placeholder:"What does this script parse?"})]}),e.jsxs("div",{className:"field",children:[e.jsx("span",{className:"lbl",children:"Tags (comma separated)"}),e.jsx("input",{className:"ipt",value:g,onChange:u=>b(u.target.value),placeholder:"google, search, business"})]}),e.jsxs("div",{className:"field",children:[e.jsx("span",{className:"lbl",children:"Version Note"}),e.jsx("input",{className:"ipt",value:y,onChange:u=>p(u.target.value),placeholder:"What does this version do?"})]}),e.jsxs("div",{className:"field",children:[e.jsxs("span",{className:"lbl",children:["Script Code —"," ",e.jsxs("span",{style:{color:"var(--m2)",textTransform:"none",letterSpacing:0},children:["define ",e.jsx("code",{style:{background:"var(--s3)",padding:"0 4px",borderRadius:3},children:"function parse(input)"})," ","returning ",e.jsx("code",{style:{background:"var(--s3)",padding:"0 4px",borderRadius:3},children:"{ columns, rows }"})]})]}),e.jsx("textarea",{className:"ipt-code",value:N,onChange:u=>j(u.target.value),style:{minHeight:280}})]}),s.versions.length>1&&e.jsxs("div",{className:"field",children:[e.jsx("span",{className:"lbl",children:"Version History"}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:4},children:[...s.versions].reverse().map(u=>e.jsxs("div",{className:`ver-item${u.version===v?" active":""}`,onClick:()=>h(u),children:[e.jsxs("span",{className:"ver-num",children:["v",u.version]}),e.jsx("span",{style:{flex:1},children:u.note||"No note"}),e.jsx("span",{style:{fontSize:10,color:"var(--m2)"},children:oe(u.createdAt)})]},u.version))})]}),e.jsxs("div",{className:"modal-footer",children:[e.jsx("button",{className:"btn btn-ghost",onClick:a,children:"Cancel"}),!s.isBuiltin&&e.jsx("button",{className:"btn",onClick:W,children:"+ New Version"}),e.jsx("button",{className:"btn btn-primary",onClick:E,children:"Save Script"})]})]})})}function ut({onClose:a,onSave:l,onNewVersion:i,initial:s}){const[o,c]=m.useState(s.name),[d,f]=m.useState((s.tags||[]).join(", ")),[g,b]=m.useState(()=>s.versions.find(v=>v.version===s.currentVersion)?.text||""),[N,j]=m.useState(s.currentVersion),y=p=>{j(p.version),b(p.text||"")};return e.jsx("div",{className:"modal-overlay",onClick:a,children:e.jsxs("div",{className:"modal",onClick:p=>p.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("div",{className:"modal-title",children:s.id.startsWith("__new")?"New Prompt":"Edit Prompt"}),e.jsx("button",{className:"btn btn-ghost btn-icon",onClick:a,children:"✕"})]}),e.jsxs("div",{className:"field",children:[e.jsx("span",{className:"lbl",children:"Name"}),e.jsx("input",{className:"ipt",value:o,onChange:p=>c(p.target.value),placeholder:"Prompt name"})]}),e.jsxs("div",{className:"field",children:[e.jsx("span",{className:"lbl",children:"Tags"}),e.jsx("input",{className:"ipt",value:d,onChange:p=>f(p.target.value),placeholder:"parsing, scripts, general"})]}),e.jsxs("div",{className:"field",children:[e.jsx("span",{className:"lbl",children:"Prompt Text"}),e.jsx("textarea",{className:"ipt",value:g,onChange:p=>b(p.target.value),style:{minHeight:200,lineHeight:1.7,resize:"vertical",fontFamily:"var(--mono)",fontSize:12},placeholder:"Write your reusable prompt here..."})]}),s.versions.length>1&&e.jsxs("div",{className:"field",children:[e.jsx("span",{className:"lbl",children:"Version History"}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:4},children:[...s.versions].reverse().map(p=>e.jsxs("div",{className:`ver-item${p.version===N?" active":""}`,onClick:()=>y(p),children:[e.jsxs("span",{className:"ver-num",children:["v",p.version]}),e.jsx("span",{style:{flex:1},children:oe(p.createdAt)})]},p.version))})]}),e.jsxs("div",{className:"modal-footer",children:[e.jsx("button",{className:"btn btn-ghost",onClick:a,children:"Cancel"}),e.jsx("button",{className:"btn",onClick:()=>i({...s,name:o.trim(),tags:d.split(",").map(p=>p.trim()).filter(Boolean)},g),children:"+ New Version"}),e.jsx("button",{className:"btn btn-primary",onClick:()=>{o.trim()&&l({...s,name:o.trim(),tags:d.split(",").map(p=>p.trim()).filter(Boolean),currentVersion:N,versions:s.versions.map(p=>p.version===N?{...p,text:g}:p)})},children:"Save Prompt"})]})]})})}function ht({suggestion:a,onInstall:l,onTestRun:i}){return e.jsxs("div",{className:"ai-suggestion",children:[e.jsxs("div",{className:"ai-suggestion-label",children:['⚙ Script: "',a.name,'"']}),e.jsx("pre",{children:a.code}),e.jsxs("div",{style:{display:"flex",gap:6},children:[e.jsx("button",{className:"btn btn-primary btn-sm",onClick:l,children:"Save Script"}),e.jsx("button",{className:"btn btn-sm",onClick:i,children:"▶ Test Run"})]})]})}function xt({msg:a,suggestedRef:l,onInstall:i,onTestRun:s}){const o=c=>c.split(/(```[\s\S]*?```|`[^`]+`|\*\*[^*]+\*\*)/g).map((f,g)=>f.startsWith("```")&&f.endsWith("```")?e.jsx("pre",{children:f.slice(3,-3).replace(/^\w+\n/,"")},g):f.startsWith("`")&&f.endsWith("`")?e.jsx("code",{children:f.slice(1,-1)},g):f.startsWith("**")&&f.endsWith("**")?e.jsx("strong",{children:f.slice(2,-2)},g):f.split(`
`).map((b,N)=>N===0?b:[e.jsx("br",{},N),b]));return e.jsxs("div",{children:[e.jsx("div",{className:`chat-msg ${a.role}`,children:a.role==="assistant"?o(a.content):a.content}),a.suggestions?.map(c=>l.current[c.key]?e.jsx(ht,{suggestion:l.current[c.key],onInstall:()=>i(c.key),onTestRun:()=>s(c.key)},c.key):null)]})}function gt({trigger:a,items:l}){const[i,s]=m.useState(!1),o=m.useRef(null);return m.useEffect(()=>{if(!i)return;const c=d=>{o.current&&!o.current.contains(d.target)&&s(!1)};return document.addEventListener("mousedown",c),()=>document.removeEventListener("mousedown",c)},[i]),e.jsxs("div",{className:"dropdown",ref:o,children:[e.jsx("div",{onClick:()=>s(c=>!c),children:a}),e.jsx("div",{className:`dropdown-menu${i?"":" hidden"}`,children:l.map((c,d)=>e.jsxs("div",{className:"dd-item",onClick:()=>{c.onClick(),s(!1)},children:[c.icon&&e.jsx("span",{children:c.icon}),c.label]},d))})]})}function ft({settings:a,onSave:l,onClearAll:i,onBackup:s,toast:o}){const[c,d]=m.useState({...a});m.useEffect(()=>{d({...a})},[a.apiKey,a.model]);const f=async()=>{if(!c.apiKey){o("Enter an API key first","err");return}try{await we("Reply with exactly: OK",[{role:"user",content:"ping"}],c.apiKey,c.model),o("API key works ✓","ok")}catch(g){o(`Error: ${g.message}`,"err")}};return e.jsx("div",{className:"scroll-page",children:e.jsxs("div",{style:{maxWidth:600,margin:"0 auto"},children:[e.jsxs("div",{className:"card",style:{marginBottom:14},children:[e.jsx("div",{style:{fontFamily:"var(--font)",fontWeight:500,fontSize:14,marginBottom:16},children:"⚙ AI Configuration"}),e.jsxs("div",{className:"setting-row",children:[e.jsxs("div",{children:[e.jsx("div",{className:"setting-label",children:"API Key"}),e.jsx("div",{className:"setting-desc",children:"Anthropic API key · Stored in IndexedDB · Never leaves your browser"})]}),e.jsx("div",{className:"setting-ctl",children:e.jsx("input",{type:"password",className:"ipt",value:c.apiKey,placeholder:"sk-ant-api03-...",onChange:g=>d(b=>({...b,apiKey:g.target.value}))})})]}),e.jsxs("div",{className:"setting-row",children:[e.jsxs("div",{children:[e.jsx("div",{className:"setting-label",children:"Model"}),e.jsx("div",{className:"setting-desc",children:"AI model used for script generation and chat"})]}),e.jsx("div",{className:"setting-ctl",children:e.jsxs("select",{className:"sel",value:c.model,onChange:g=>d(b=>({...b,model:g.target.value})),children:[e.jsx("option",{value:"claude-haiku-4-5-20251001",children:"Claude Haiku 4.5 — Fast"}),e.jsx("option",{value:"claude-sonnet-4-5",children:"Claude Sonnet 4.5 — Smarter"})]})})]}),e.jsxs("div",{style:{marginTop:14,display:"flex",gap:8},children:[e.jsx("button",{className:"btn btn-primary",onClick:()=>l(c),children:"Save Settings"}),e.jsx("button",{className:"btn",onClick:f,children:"Test Connection"})]})]}),e.jsxs("div",{className:"card",style:{marginBottom:14},children:[e.jsx("div",{style:{fontFamily:"var(--font)",fontWeight:500,fontSize:14,marginBottom:16},children:"📦 Data"}),e.jsxs("div",{className:"setting-row",children:[e.jsxs("div",{children:[e.jsx("div",{className:"setting-label",children:"Export Backup"}),e.jsx("div",{className:"setting-desc",children:"Download all scripts, datasets, prompts, and notes as JSON"})]}),e.jsx("div",{className:"setting-ctl",children:e.jsx("button",{className:"btn",onClick:s,children:"Export Backup"})})]}),e.jsxs("div",{className:"setting-row",children:[e.jsxs("div",{children:[e.jsx("div",{className:"setting-label",children:"Clear All Data"}),e.jsx("div",{className:"setting-desc",children:"Remove all user scripts, datasets, prompts, and notes"})]}),e.jsx("div",{className:"setting-ctl",children:e.jsx("button",{className:"btn btn-danger",onClick:i,children:"Clear All Data"})})]})]}),e.jsxs("div",{className:"card",children:[e.jsx("div",{style:{fontFamily:"var(--font)",fontWeight:500,fontSize:14,marginBottom:10},children:"ℹ About"}),e.jsxs("div",{style:{fontFamily:"var(--mono)",fontSize:12,color:"var(--m1)",lineHeight:1.7},children:[e.jsx("strong",{style:{color:"var(--txt)"},children:"Parse Studio Pro"})," — AI-powered data extraction workbench",e.jsx("br",{}),"Smart URL extraction · URL Formatter for Apify bulk targets",e.jsx("br",{}),"All data stored locally in IndexedDB · No server · No login required"]})]})]})})}const be=[{id:"strip-all",label:"Strip All",desc:"apify.com/actor",help:"Remove https:// and www. → bare domain. Best for Apify actors that break with scheme."},{id:"add-https",label:"Add https://",desc:"https://apify.com/actor",help:"Ensure every URL has https:// prefix. Use for actors that require full URLs."},{id:"add-http",label:"Add http://",desc:"http://apify.com/actor",help:"Force http:// prefix. Rarely needed but available."},{id:"normalize",label:"Normalize",desc:"https://apify.com/actor",help:"Strip scheme+www then add https://. Canonical form."},{id:"strip-scheme",label:"Strip Scheme",desc:"apify.com/actor",help:"Remove https:// or http:// but keep www. if present."},{id:"add-www",label:"Add www.",desc:"www.apify.com/actor",help:"Add www. prefix (no scheme)."},{id:"strip-www",label:"Strip www.",desc:"https://apify.com/actor",help:"Remove www. while keeping scheme."}];function bt({toast:a}){const[l,i]=m.useState(""),[s,o]=m.useState("strip-all"),d=m.useCallback(()=>{const j=l.split(`
`).map(p=>p.trim()).filter(Boolean);if(!j.length)return[];const y=p=>p.replace(/^https?:\/\//i,"").replace(/^www\./i,"");return j.map(p=>{let v=p;switch(s){case"add-https":v="https://"+y(p);break;case"add-http":v="http://"+y(p);break;case"strip-scheme":{v=(/^(https?:\/\/)?www\./i.test(p)?"www.":"")+y(p);break}case"add-www":v="www."+y(p);break;case"strip-www":v=p.replace(/^(https?:\/\/)?www\./i,(k,h)=>h||"");break;case"strip-all":v=y(p);break;case"normalize":v="https://"+y(p);break;default:v=p}return v=v.replace(/([^:])\/\//g,"$1/").replace(/\/$/,""),v})},[l,s])(),f=d.join(`
`),g=be.find(j=>j.id===s),b=async()=>{if(!f){a("Nothing to copy","err");return}await M(f),a(`Copied ${d.length} URLs`,"ok")},N=()=>{if(!f){a("Nothing to export","err");return}const j=new Blob([f],{type:"text/plain"}),y=document.createElement("a");y.href=URL.createObjectURL(j),y.download=`urls-${s}-${Date.now()}.txt`,y.click(),URL.revokeObjectURL(y.href),a("Downloaded")};return e.jsxs("div",{className:"fmt-shell",children:[e.jsxs("div",{className:"fmt-left",children:[e.jsxs("div",{className:"pane-header",children:[e.jsx("span",{className:"pane-label",children:"URL Input"}),e.jsx("button",{className:"btn btn-ghost btn-sm btn-icon",onClick:()=>i(""),title:"Clear",children:"✕"})]}),e.jsx("div",{className:"fmt-modes",children:be.map(j=>e.jsx("button",{className:`btn-mode${s===j.id?" active":""}`,onClick:()=>o(j.id),title:j.help,children:j.label},j.id))}),g&&e.jsx("div",{style:{padding:"8px 14px 0",flexShrink:0},children:e.jsxs("div",{className:"info-box accent",style:{fontSize:10.5,lineHeight:1.65},children:[e.jsx("strong",{style:{color:"var(--acc)"},children:g.label})," · ",g.help,e.jsxs("div",{style:{marginTop:4,color:"var(--m2)"},children:["e.g. → ",e.jsx("span",{style:{color:"var(--txt)",fontFamily:"var(--mono)"},children:g.desc})]})]})}),e.jsx("textarea",{className:"raw-textarea",value:l,onChange:j=>i(j.target.value),placeholder:`Paste URLs here — one per line

https://apify.com/apify/web-scraper
www.example.com/page
example.io/api
https://www.site.co/path

Transform updates instantly as you type.`,style:{flex:1}})]}),e.jsxs("div",{className:"fmt-right",children:[e.jsxs("div",{className:"fmt-output-header",children:[e.jsx("span",{className:"pane-label",children:"Transformed Output"}),d.length>0&&e.jsxs("span",{className:"tag tag-green",children:[d.length," URLs"]}),e.jsx("span",{className:"tag tag-orange",style:{marginLeft:2},children:g?.label}),e.jsxs("div",{style:{marginLeft:"auto",display:"flex",gap:6},children:[e.jsx("button",{className:"btn btn-ghost btn-sm",onClick:b,children:"📋 Copy All"}),e.jsx("button",{className:"btn btn-ghost btn-sm",onClick:N,children:"↓ Download"})]})]}),d.length===0?e.jsxs("div",{className:"empty",children:[e.jsx("div",{className:"empty-icon",children:"🔗"}),e.jsx("div",{className:"empty-title",children:"No URLs yet"}),e.jsxs("div",{className:"empty-desc",children:["Paste URLs on the left.",e.jsx("br",{}),"Select a transform mode.",e.jsx("br",{}),"Output appears instantly."]})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"fmt-count",children:[d.length," URLs · mode: ",s]}),e.jsx("div",{className:"fmt-output-body",children:d.map((j,y)=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10,padding:"2px 0",borderBottom:"1px solid var(--brd)",marginBottom:2},children:[e.jsx("span",{style:{color:"var(--m3)",fontSize:10,minWidth:24,textAlign:"right",userSelect:"none"},children:y+1}),e.jsx("span",{style:{flex:1,color:"var(--txt)",cursor:"pointer",wordBreak:"break-all"},title:"Click to copy this URL",onClick:async()=>{await M(j),a("Copied","ok")},children:j})]},y))})]})]})]})}function yt(){const[a,l]=m.useState("extractor"),[i,s]=m.useState([]),[o,c]=m.useState([]),[d,f]=m.useState([]),[g,b]=m.useState({user:"",ai:""}),[N,j]=m.useState({apiKey:"",model:"claude-haiku-4-5-20251001"}),[y,p]=m.useState(""),[v,k]=m.useState(null),[h,E]=m.useState(null),[W,u]=m.useState(!1),[L,T]=m.useState([]),[Q,X]=m.useState(""),[ee,ie]=m.useState(!1),[le,P]=m.useState(null),[ce,O]=m.useState(null),[ye,de]=m.useState([]),w=m.useCallback((t,r="ok")=>{const n=B();de(x=>[...x,{id:n,msg:t,type:r}]),setTimeout(()=>de(x=>x.filter(S=>S.id!==n)),2600)},[]),H=m.useRef({}),pe=m.useRef(null),J=m.useRef(null),te=m.useRef(""),D=ge(i),A=D.find(t=>t.id===v)||D[0]||null;m.useEffect(()=>{dt(),je()},[]);const je=async()=>{const[t,r,n,x,S,C,R]=await Promise.all([ne("scripts"),ne("datasets"),ne("prompts"),q("notes:user"),q("notes:ai"),q("settings"),q("chat:history")]);s(t),c(r),f(n),b({user:x||"",ai:S||""}),C&&j(C),R&&T(R);const V=ge(t);V.length>0&&k(V[0].id)},Ne=D.length,ke=o.length,Se=d.length,me=async t=>{const r=!i.find(x=>x.id===t.id),n=r?[...i,t]:i.map(x=>x.id===t.id?t:x);s(n),await _("scripts",t),P(null),w(r?"Script saved":"Script updated")},Ce=async(t,r,n)=>{const x={version:t.currentVersion+1,note:n||"Updated",createdAt:Date.now(),code:r},S=t.versions.map(z=>z.version===t.currentVersion?{...z,code:r,note:t.versions.find(Z=>Z.version===t.currentVersion)?.note||""}:z),C={...t,isBuiltin:!1,versions:[...S,x],currentVersion:x.version,updatedAt:Date.now()},V=i.find(z=>z.id===C.id)?i.map(z=>z.id===C.id?C:z):[...i,C];s(V),await _("scripts",C),P(null),w(`Version ${x.version} saved`)},Ae=async t=>{if(!confirm("Delete this script?"))return;const r=i.filter(n=>n.id!==t);s(r),await U("scripts",t),w("Script deleted")},Re=()=>{P({id:B(),name:"New Script",description:"",tags:[],isBuiltin:!1,createdAt:Date.now(),updatedAt:Date.now(),currentVersion:1,versions:[{version:1,note:"Initial",createdAt:Date.now(),code:`function parse(input) {
  const lines = input.split('\\n').map(l => l.trim()).filter(Boolean);
  const rows = [];
  for (const line of lines) {
    rows.push([line]);
  }
  return { columns: ['Value'], rows };
}`}]})},ze=t=>{t.isBuiltin&&Y.has(t.id)?P({...JSON.parse(JSON.stringify(t)),isBuiltin:!1,createdAt:Date.now(),updatedAt:Date.now()}):P(JSON.parse(JSON.stringify(t)))},Ie=async()=>{if(!h?.ok||!h.rows.length){w("No data to save","err");return}const t={id:B(),name:`${A?.name||"Unnamed"} — ${new Date().toLocaleString()}`,scriptId:A?.id,scriptName:A?.name||"",columns:h.columns,rows:h.rows,rowCount:h.rows.length,createdAt:Date.now()};c(r=>[...r,t]),await _("datasets",t),w(`Dataset saved (${t.rowCount} rows)`)},De=async t=>{confirm("Delete this dataset?")&&(c(r=>r.filter(n=>n.id!==t)),await U("datasets",t),w("Deleted"))},Le=async t=>{const r=!d.find(x=>x.id===t.id),n=r?[...d,t]:d.map(x=>x.id===t.id?t:x);f(n),await _("prompts",t),O(null),w(r?"Prompt saved":"Prompt updated")},Ee=async(t,r)=>{const n={version:t.currentVersion+1,text:r,createdAt:Date.now()},x={...t,versions:[...t.versions,n],currentVersion:n.version},C=d.find(R=>R.id===x.id)?d.map(R=>R.id===x.id?x:R):[...d,x];f(C),await _("prompts",x),O(null),w(`Prompt v${n.version} saved`)},Te=async t=>{confirm("Delete this prompt?")&&(f(r=>r.filter(n=>n.id!==t)),await U("prompts",t),w("Deleted"))},Pe=()=>O({id:B(),name:"New Prompt",tags:[],currentVersion:1,versions:[{version:1,text:"",createdAt:Date.now()}]}),Ve=t=>{const r=t.versions.find(n=>n.version===t.currentVersion);X(r?.text||""),u(!0),setTimeout(()=>document.getElementById("psp-chat-input")?.focus(),100)},Ue=t=>{b(r=>({...r,user:t})),clearTimeout(J.current),J.current=setTimeout(()=>I("notes:user",t),700)},Be=t=>{b(r=>({...r,ai:t})),clearTimeout(J.current),J.current=setTimeout(()=>I("notes:ai",t),700)},Oe=()=>{if(!A){w("No script selected","err");return}const t=xe(A.versions.find(r=>r.version===A.currentVersion)?.code||"",y);E(t),t.ok?w(`${t.rows.length} rows extracted`):w(`Script error: ${t.error}`,"err")},ue=async t=>{if(!h?.ok){w("No data","err");return}const n={urls:/url|link|website|http|domain/i,names:/name|business|company|title/i}[t]||new RegExp(t,"i");let x=h.columns.findIndex(C=>n.test(C));x<0&&(x=0);const S=h.rows.map(C=>C[x]||"").filter(Boolean).join(`
`);await M(S),w(`Copied ${h.rows.length} ${t}`,"ok")},$e=async()=>{if(!h?.ok){w("No data","err");return}const t=h.columns.join("	"),r=h.rows.map(n=>n.join("	")).join(`
`);await M(t+`
`+r),w(`Copied all (${h.rows.length} rows)`,"ok")},_e=async t=>{h?.ok&&(await M(h.rows[t].join("	")),w("Row copied"))},K=(t,r,n)=>{if(!r?.ok||!r.rows.length){w("No data to export","err");return}fe(r,t,n),w(`Exported as ${t.toUpperCase()}`)},G=(t,r)=>{fe({columns:t.columns,rows:t.rows},r,t.name.replace(/[^a-z0-9]/gi,"-").toLowerCase()),w(`Exported as ${r.toUpperCase()}`)},Me=m.useCallback(()=>{const t=D.map(n=>`${n.name} (id: ${n.id})`).join(", "),r=A?.versions.find(n=>n.version===A?.currentVersion);return`You are Parse AI, the embedded assistant in Parse Studio Pro — a personal browser-based tool for extracting structured data from pasted text (Google search results, LinkedIn, CSV, emails, bulk URL lists, etc.).

TODAY: ${new Date().toLocaleString()}
CURRENT VIEW: ${a}
ACTIVE SCRIPT: ${A?`"${A.name}" v${A.currentVersion}`:"none"}
ALL SCRIPTS: ${t}
DATASETS SAVED: ${o.length}
INPUT TEXT (first 800 chars): ${te.current.slice(0,800)||"(empty)"}
${r?`
ACTIVE SCRIPT CODE:
${r.code}`:""}
AI NOTES SO FAR:
${g.ai||"(empty)"}

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
<\/SCRIPT>

When you learn something useful, append to AI notes:
<AINOTE>Your observation here</AINOTE>

Scripts MUST define function parse(input) returning { columns: string[], rows: string[][] }.
Be concise and direct.`},[a,A,D,o.length,g.ai]),he=async()=>{if(!Q.trim()||ee)return;if(!N.apiKey){w("Add your API key in Settings","err"),l("settings");return}te.current=y;const t={role:"user",content:Q.trim(),ts:Date.now()},r=[...L,t];T(r),X(""),ie(!0);try{const n=Me(),x=await we(n,r,N.apiKey,N.model),{clean:S,scripts:C,notes:R}=lt(x);if(R.length>0){const re=R.map(ae=>`

— ${new Date().toLocaleString()}
${ae}`).join(""),$=g.ai+re;b(ae=>({...ae,ai:$})),await I("notes:ai",$)}const V=C.map(re=>{const $=`sg_${B()}`;return H.current[$]=re,{type:"suggestion",key:$}}),z={role:"assistant",content:S,ts:Date.now(),suggestions:V},Z=[...r,z];T(Z),await I("chat:history",Z)}catch(n){const x={role:"assistant",content:`⚠ ${n.message}`,ts:Date.now()},S=[...r,x];T(S),await I("chat:history",S)}ie(!1),setTimeout(()=>pe.current?.scrollIntoView({behavior:"smooth"}),80)},Fe=async t=>{const r=H.current[t];if(!r){w("Script reference expired — ask AI again","err");return}const n={id:B(),name:r.name,description:"Generated by AI",tags:["ai-generated"],isBuiltin:!1,createdAt:Date.now(),updatedAt:Date.now(),currentVersion:1,versions:[{version:1,note:"AI generated",createdAt:Date.now(),code:r.code}]};await me(n),k(n.id),w(`Script "${r.name}" saved`)},We=t=>{const r=H.current[t];if(!r){w("Script reference expired","err");return}const n=xe(r.code,y);E(n),l("extractor"),w(n.ok?`Test run: ${n.rows.length} rows`:`Error: ${n.error}`,n.ok?"ok":"err")},He=async t=>{j(t),await I("settings",t),w("Settings saved")},Je=()=>{const t=r=>/url|link|website|http|domain/i.test(r);return e.jsxs("div",{className:"extractor-shell",children:[e.jsxs("div",{className:"ext-left",children:[e.jsxs("div",{className:"pane-header",children:[e.jsx("span",{className:"pane-label",children:"Raw Input"}),e.jsx("button",{className:"btn btn-ghost btn-sm btn-icon",onClick:()=>{p(""),E(null)},title:"Clear",children:"✕"})]}),e.jsxs("div",{className:"script-bar",children:[e.jsx("select",{className:"sel",style:{flex:1},value:v||"",onChange:r=>{k(r.target.value),E(null)},children:D.map(r=>e.jsxs("option",{value:r.id,children:[r.name,r.isBuiltin?" ✦":"",r.currentVersion>1?` v${r.currentVersion}`:""]},r.id))}),e.jsx("button",{className:"btn btn-primary btn-sm",onClick:Oe,children:"▶ Run"})]}),e.jsx("textarea",{className:"raw-textarea",value:y,onChange:r=>{p(r.target.value),te.current=r.target.value},placeholder:`Paste text here…

• Google search results
• Business listings
• LinkedIn results
• CSV / TSV data
• Raw URL lists (bare or https://)
• Any structured text

Select a script above, then click ▶ Run.`})]}),e.jsxs("div",{className:"ext-right",children:[e.jsxs("div",{className:"results-header",children:[e.jsx("span",{className:"pane-label",children:"Parsed Results"}),h?.ok&&h.rows.length>0&&e.jsxs("span",{className:"tag tag-green",children:[h.rows.length," rows"]}),e.jsxs("div",{className:"copy-bar",children:[e.jsx("button",{className:"btn btn-ghost btn-sm",onClick:()=>ue("names"),children:"📋 Names"}),e.jsx("button",{className:"btn btn-ghost btn-sm",onClick:()=>ue("urls"),children:"🔗 URLs"}),e.jsx("button",{className:"btn btn-ghost btn-sm",onClick:$e,children:"⧉ All"})]}),e.jsx(gt,{trigger:e.jsx("button",{className:"btn btn-sm",children:"↓ Export"}),items:[{icon:"📊",label:"CSV",onClick:()=>K("csv",h,"parsed-data")},{icon:"{}",label:"JSON",onClick:()=>K("json",h,"parsed-data")},{icon:"M↓",label:"Markdown",onClick:()=>K("md",h,"parsed-data")},{icon:"📄",label:"Plain Text",onClick:()=>K("txt",h,"parsed-data")}]}),e.jsx("button",{className:"btn btn-sm",onClick:Ie,children:"💾 Save"})]}),e.jsx("div",{className:"results-body",children:h?h.ok?h.rows.length===0?e.jsxs("div",{className:"empty",children:[e.jsx("div",{className:"empty-icon",children:"🔍"}),e.jsx("div",{className:"empty-title",children:"No data extracted"}),e.jsxs("div",{className:"empty-desc",children:["Try a different script or check the input format.",e.jsx("br",{}),"Ask the AI to generate a custom script for your data."]})]}):e.jsx("div",{className:"tbl-wrap",style:{border:"none",borderRadius:0,height:"100%"},children:e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"td-num",children:"#"}),h.columns.map(r=>e.jsx("th",{children:r},r)),e.jsx("th",{className:"td-act"})]})}),e.jsx("tbody",{children:h.rows.map((r,n)=>e.jsxs("tr",{children:[e.jsx("td",{className:"td-num",children:n+1}),r.map((x,S)=>t(h.columns[S])&&ot(x)?e.jsx("td",{className:"td-url",children:e.jsx("a",{href:it(x),target:"_blank",rel:"noreferrer",children:x})},S):e.jsx("td",{children:x},S)),e.jsx("td",{className:"td-act",children:e.jsx("button",{className:"btn btn-ghost btn-icon btn-sm",onClick:()=>_e(n),title:"Copy row",children:"⧉"})})]},n))})]})}):e.jsxs("div",{className:"err-banner",children:[e.jsx("strong",{children:"Script Error"}),e.jsx("br",{}),h.error]}):e.jsxs("div",{className:"empty",children:[e.jsx("div",{className:"empty-icon",children:"⚡"}),e.jsx("div",{className:"empty-title",children:"No results yet"}),e.jsx("div",{className:"empty-desc",children:"Paste text on the left and click ▶ Run"})]})})]})]})},Ke=()=>o.length===0?e.jsxs("div",{className:"empty",style:{height:"100%"},children:[e.jsx("div",{className:"empty-icon",children:"🗂"}),e.jsx("div",{className:"empty-title",children:"No datasets yet"}),e.jsx("div",{className:"empty-desc",children:'Run a script and click "Save" to create a dataset'})]}):e.jsx("div",{className:"scroll-page",children:e.jsx("div",{className:"cards-grid",children:[...o].reverse().map(t=>e.jsxs("div",{className:"card",children:[e.jsx("div",{style:{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10},children:e.jsxs("div",{children:[e.jsx("div",{className:"card-title",children:t.name}),e.jsxs("div",{className:"card-meta",children:[t.rowCount," rows · ",t.columns.length," cols · ",nt(t.createdAt)]})]})}),t.scriptName&&e.jsx("div",{className:"tags",children:e.jsx("span",{className:"tag tag-blue",children:t.scriptName})}),e.jsx("div",{className:"divider"}),e.jsxs("div",{style:{display:"flex",gap:6,flexWrap:"wrap"},children:[e.jsx("button",{className:"btn btn-sm",onClick:()=>G(t,"csv"),children:"CSV"}),e.jsx("button",{className:"btn btn-sm",onClick:()=>G(t,"json"),children:"JSON"}),e.jsx("button",{className:"btn btn-sm",onClick:()=>G(t,"md"),children:"MD"}),e.jsx("button",{className:"btn btn-sm",onClick:()=>G(t,"txt"),children:"TXT"}),e.jsx("button",{className:"btn btn-danger btn-sm",style:{marginLeft:"auto"},onClick:()=>De(t.id),children:"Delete"})]})]},t.id))})}),Ge=()=>e.jsx("div",{className:"scroll-page",children:e.jsx("div",{className:"cards-grid",children:D.map(t=>e.jsxs("div",{className:"card",style:{cursor:"pointer"},onClick:()=>ze(t),children:[e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8},children:[e.jsxs("div",{style:{flex:1},children:[e.jsxs("div",{className:"card-title",children:[t.name,t.isBuiltin&&Y.has(t.id)&&e.jsx("span",{className:"tag tag-acc",style:{marginLeft:8,fontSize:9},children:"Built-in"})]}),e.jsxs("div",{className:"card-meta",children:["v",t.currentVersion," · ",t.versions.length," version",t.versions.length>1?"s":""," · ",t.updatedAt?oe(t.updatedAt):"Default"]})]}),!Y.has(t.id)&&e.jsx("button",{className:"btn btn-danger btn-icon btn-sm",onClick:r=>{r.stopPropagation(),Ae(t.id)},title:"Delete",children:"🗑"})]}),e.jsx("div",{className:"card-desc",children:t.description}),e.jsx("div",{className:"tags",children:(t.tags||[]).map(r=>e.jsx("span",{className:"tag",children:r},r))}),e.jsx("div",{className:"divider"}),e.jsx("button",{className:"btn btn-sm",onClick:r=>{r.stopPropagation(),k(t.id),l("extractor"),w(`Using: ${t.name}`)},children:"⚡ Use in Extractor"})]},t.id))})}),Ze=()=>d.length===0?e.jsxs("div",{className:"empty",style:{height:"100%"},children:[e.jsx("div",{className:"empty-icon",children:"💬"}),e.jsx("div",{className:"empty-title",children:"No prompts saved"}),e.jsx("div",{className:"empty-desc",children:"Save reusable AI prompts for common parsing tasks"})]}):e.jsx("div",{className:"scroll-page",children:e.jsx("div",{className:"cards-grid",children:[...d].reverse().map(t=>{const r=t.versions.find(n=>n.version===t.currentVersion);return e.jsxs("div",{className:"card",style:{cursor:"pointer"},onClick:()=>O(JSON.parse(JSON.stringify(t))),children:[e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8},children:[e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{className:"card-title",children:t.name}),e.jsxs("div",{className:"card-meta",children:["v",t.currentVersion," · ",t.versions.length," version",t.versions.length>1?"s":""]})]}),e.jsx("button",{className:"btn btn-ghost btn-icon btn-sm",onClick:n=>{n.stopPropagation(),Ve(t)},title:"Send to chat",children:"↗"}),e.jsx("button",{className:"btn btn-danger btn-icon btn-sm",onClick:n=>{n.stopPropagation(),Te(t.id)},title:"Delete",children:"🗑"})]}),e.jsx("div",{className:"card-desc",style:{whiteSpace:"pre-wrap",maxHeight:80,overflow:"hidden",fontFamily:"var(--mono)",fontSize:11,lineHeight:1.6},children:r?.text||""}),e.jsx("div",{className:"tags",children:(t.tags||[]).map(n=>e.jsx("span",{className:"tag",children:n},n))})]},t.id)})})}),qe=()=>e.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column"},children:[e.jsx("div",{style:{padding:"6px 16px",borderBottom:"1px solid var(--brd)",fontFamily:"var(--mono)",fontSize:10,color:"var(--m2)"},children:"Plain text · Auto-saves as you type · Use for research notes, observations, to-dos"}),e.jsx("div",{style:{flex:1,padding:"20px 28px",maxWidth:820,width:"100%",margin:"0 auto",overflow:"auto"},children:e.jsx("textarea",{className:"notes-editor",value:g.user,onChange:t=>Ue(t.target.value),style:{height:"100%",minHeight:400},placeholder:`Start writing…

→ Research notes about your data sources
→ What scripts worked for which sources
→ Patterns you noticed in the data
→ Apify actor URL format requirements
→ To-do lists and follow-ups`})})]}),Ye=()=>e.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column"},children:[e.jsx("div",{style:{padding:"6px 16px",borderBottom:"1px solid var(--brd)",fontFamily:"var(--mono)",fontSize:10,color:"var(--m2)"},children:"AI-maintained memory · Auto-populated when AI learns patterns, wins, and issues · Editable"}),e.jsx("div",{style:{flex:1,padding:"20px 28px",maxWidth:820,width:"100%",margin:"0 auto",overflow:"auto"},children:e.jsx("textarea",{className:"notes-editor",value:g.ai,onChange:t=>Be(t.target.value),style:{height:"100%",minHeight:400},placeholder:`The AI will write here automatically as it learns…

Observations about your data sources, parsing patterns, and what works vs what doesn't.`})})]}),Qe=()=>e.jsx(ft,{settings:N,onSave:He,onClearAll:async()=>{if(confirm("Delete all user data? Built-in scripts are preserved.")){for(const t of i)await U("scripts",t.id);for(const t of o)await U("datasets",t.id);for(const t of d)await U("prompts",t.id);await I("notes:user",""),await I("notes:ai",""),await I("chat:history",[]),s([]),c([]),f([]),b({user:"",ai:""}),T([]),w("All data cleared")}},onBackup:()=>{const t={exportedAt:new Date().toISOString(),userScripts:i,datasets:o,prompts:d,notes:g},r=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),n=document.createElement("a");n.href=URL.createObjectURL(r),n.download=`parsestudiopro-backup-${Date.now()}.json`,n.click(),w("Backup exported")},toast:w}),Xe=()=>e.jsx(bt,{toast:w}),et=[{group:"Workspace",items:[{id:"extractor",icon:"⚡",label:"Extractor"},{id:"urlformatter",icon:"🔗",label:"URL Formatter"},{id:"datasets",icon:"🗂",label:"Data Sets",badge:ke}]},{group:"Library",items:[{id:"scripts",icon:"⚙",label:"Scripts",badge:Ne},{id:"prompts",icon:"💬",label:"Prompts",badge:Se}]},{group:"Notes",items:[{id:"notes",icon:"✎",label:"My Notes"},{id:"ainotes",icon:"🤖",label:"AI Notes"}]},{group:"System",items:[{id:"settings",icon:"⚙️",label:"Settings"}]}],tt={extractor:"Extractor",urlformatter:"URL Formatter",datasets:"Data Sets",scripts:"Scripts",prompts:"Prompts",notes:"My Notes",ainotes:"AI Notes",settings:"Settings"},st={extractor:null,urlformatter:null,datasets:null,scripts:e.jsx("button",{className:"btn btn-primary",onClick:Re,children:"+ New Script"}),prompts:e.jsx("button",{className:"btn btn-primary",onClick:Pe,children:"+ New Prompt"}),notes:e.jsx("button",{className:"btn",onClick:()=>{const t=new Blob([g.user],{type:"text/plain"}),r=document.createElement("a");r.href=URL.createObjectURL(t),r.download="my-notes.txt",r.click(),w("Notes exported")},children:"↓ Export"}),ainotes:e.jsx("button",{className:"btn",onClick:()=>{const t=new Blob([g.ai],{type:"text/plain"}),r=document.createElement("a");r.href=URL.createObjectURL(t),r.download="ai-notes.txt",r.click(),w("AI notes exported")},children:"↓ Export"}),settings:null},rt={extractor:Je,urlformatter:Xe,datasets:Ke,scripts:Ge,prompts:Ze,notes:qe,ainotes:Ye,settings:Qe},se=!!N.apiKey;return e.jsxs("div",{className:"app",children:[e.jsxs("nav",{className:"sidebar",children:[e.jsxs("div",{className:"sidebar-logo",children:[e.jsx("div",{className:"logo-mark",children:"P"}),e.jsxs("div",{children:[e.jsx("div",{className:"logo-name",children:"Parse Studio"}),e.jsx("div",{className:"logo-sub",children:"Pro · Data Extractor"})]})]}),e.jsx("div",{className:"sidebar-nav",children:et.map(({group:t,items:r})=>e.jsxs("div",{children:[e.jsx("div",{className:"nav-group-label",children:t}),r.map(n=>e.jsxs("div",{className:`nav-item${a===n.id?" active":""}`,onClick:()=>l(n.id),children:[e.jsx("span",{className:"nav-icon",children:n.icon}),e.jsx("span",{children:n.label}),n.badge!==void 0&&n.badge>0&&e.jsx("span",{className:"nav-badge",children:n.badge})]},n.id))]},t))}),e.jsxs("div",{className:"sidebar-footer",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:7,padding:"4px 10px"},children:[e.jsx("div",{className:"status-dot",style:{background:se?"var(--green)":"var(--red)"}}),e.jsx("span",{style:{fontFamily:"var(--mono)",fontSize:11,color:se?"var(--green)":"var(--red)"},children:se?"API Connected":"No API Key"})]}),e.jsxs("div",{style:{fontFamily:"var(--mono)",fontSize:10,color:"var(--m2)",padding:"2px 10px 4px"},children:[N.model.split("-").slice(1,3).join(" ")," · ",D.length," scripts"]})]})]}),e.jsxs("div",{className:"workspace",children:[e.jsxs("div",{className:"topbar",children:[e.jsx("span",{className:"topbar-title",children:tt[a]}),e.jsx("div",{className:"topbar-actions",children:st[a]})]}),e.jsx("div",{className:"page-content",style:{height:"calc(100% - 52px)"},children:rt[a]?.()})]}),le&&e.jsx(mt,{initial:le,onClose:()=>P(null),onSave:me,onNewVersion:Ce}),ce&&e.jsx(ut,{initial:ce,onClose:()=>O(null),onSave:Le,onNewVersion:Ee}),e.jsxs("div",{className:"chat-fab-wrap",children:[W&&e.jsxs("div",{className:"chat-panel",children:[e.jsxs("div",{className:"chat-header",children:[e.jsx("div",{style:{width:8,height:8,borderRadius:"50%",background:"var(--green)"}}),e.jsx("span",{className:"chat-ai-name",children:"Parse AI"}),e.jsx("span",{style:{fontFamily:"var(--mono)",fontSize:10,color:"var(--m2)"},children:N.model.includes("haiku")?"Haiku 4.5":"Sonnet 4.5"}),e.jsxs("div",{style:{marginLeft:"auto",display:"flex",gap:4},children:[e.jsx("button",{className:"btn btn-ghost btn-icon btn-sm",title:"Clear chat",onClick:async()=>{confirm("Clear chat history?")&&(T([]),await I("chat:history",[]))},children:"↺"}),e.jsx("button",{className:"btn btn-ghost btn-icon btn-sm",onClick:()=>u(!1),children:"✕"})]})]}),e.jsxs("div",{className:"chat-msgs",children:[L.length===0&&e.jsxs("div",{style:{textAlign:"center",padding:"24px 12px"},children:[e.jsx("div",{style:{fontSize:24,marginBottom:10,opacity:.4},children:"✦"}),e.jsxs("div",{style:{fontFamily:"var(--mono)",fontSize:12,color:"var(--m2)",lineHeight:1.7},children:["Hi! I can generate scripts,",e.jsx("br",{}),"fix parsing issues, format URLs",e.jsx("br",{}),"for Apify, and learn your patterns."]})]}),L.map((t,r)=>e.jsx(xt,{msg:t,suggestedRef:H,onInstall:Fe,onTestRun:We},r)),ee&&e.jsx("div",{className:"chat-msg ai",children:e.jsxs("div",{className:"chat-typing",children:[e.jsx("div",{className:"typing-dot"}),e.jsx("div",{className:"typing-dot"}),e.jsx("div",{className:"typing-dot"})]})}),e.jsx("div",{ref:pe})]}),e.jsxs("div",{className:"chat-input-row",children:[e.jsx("textarea",{id:"psp-chat-input",className:"chat-ipt",value:Q,onChange:t=>X(t.target.value),placeholder:"Ask AI to parse your data, fix a script, explain results…",onKeyDown:t=>{t.key==="Enter"&&!t.shiftKey&&(t.preventDefault(),he())}}),e.jsx("button",{className:"btn btn-primary btn-icon",onClick:he,disabled:ee,style:{alignSelf:"flex-end"},children:"↑"})]})]}),e.jsx("button",{className:"chat-fab",onClick:()=>u(t=>!t),title:"AI Assistant",children:W?"✕":"✦"})]}),e.jsx(pt,{toasts:ye})]})}export{yt as default};
