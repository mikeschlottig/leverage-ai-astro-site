# ContentStudioClaude

<!DOCTYPE html>

<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>LeverageContent Studio — AI Content Intelligence</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=JetBrains+Mono:wght@300;400;500;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #080a0f;
  --bg-card: #0d1019;
  --bg-sidebar: #090b12;
  --bg-input: #111520;
  --bg-hover: #141826;
  --border: #1c2233;
  --border-hi: #263044;
  --gold: #f0b429;
  --gold-dim: #7a5a0d;
  --gold-bg: rgba(240,180,41,0.07);
  --gold-bg-hi: rgba(240,180,41,0.13);
  --teal: #00cca3;
  --teal-dim: #005e4b;
  --teal-bg: rgba(0,204,163,0.08);
  --blue: #5ba4f5;
  --blue-bg: rgba(91,164,245,0.08);
  --purple: #a78bfa;
  --red: #f87171;
  --red-bg: rgba(248,113,113,0.08);
  --green: #34d399;
  --green-bg: rgba(52,211,153,0.08);
  --text: #e2e8f0;
  --text-muted: #7c8ca1;
  --text-faint: #3a4558;
  --font-display: 'Playfair Display', serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-sans: 'DM Sans', sans-serif;
  --sidebar-w: 252px;
  --header-h: 58px;
  --radius: 6px;
  --shadow: 0 4px 24px rgba(0,0,0,0.4);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{background:var(--bg);color:var(--text);font-family:var(--font-sans);font-size:14px;line-height:1.7;-webkit-font-smoothing:antialiased;overflow-x:hidden;}
::selection{background:var(--gold-bg-hi);color:var(--gold);}
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:var(--bg);}
::-webkit-scrollbar-thumb{background:var(--border-hi);border-radius:3px;}
::-webkit-scrollbar-thumb:hover{background:var(--gold-dim);}

/* ─── HEADER ──────────────────────────────── */
#header{position:fixed;top:0;left:0;right:0;height:var(--header-h);background:var(--bg-card);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px;padding:0 20px;z-index:200;}
#header .logo{font-family:var(--font-display);font-size:17px;font-weight:700;color:var(--text);white-space:nowrap;display:flex;align-items:center;gap:8px;text-decoration:none;}
#header .logo-mark{font-family:var(--font-mono);font-size:9px;font-weight:700;color:var(--gold);letter-spacing:0.15em;text-transform:uppercase;background:var(--gold-bg);border:1px solid var(--gold-dim);border-radius:3px;padding:2px 6px;}
.sidebar-toggle{background:none;border:1px solid var(--border);border-radius:var(--radius);padding:5px 9px;color:var(--text-muted);cursor:pointer;font-size:14px;transition:all .2s;display:flex;align-items:center;}
.sidebar-toggle:hover{border-color:var(--gold-dim);color:var(--gold);}
#header .hspacer{flex:1;}
.header-selects{display:flex;align-items:center;gap:8px;}
.hsel-group{display:flex;align-items:center;gap:6px;background:var(--bg-input);border:1px solid var(--border);border-radius:var(--radius);padding:5px 10px;}
.hsel-label{font-family:var(--font-mono);font-size:9px;font-weight:600;color:var(--text-faint);text-transform:uppercase;letter-spacing:0.1em;white-space:nowrap;}
.hsel{background:none;border:none;color:var(--text);font-family:var(--font-sans);font-size:12px;cursor:pointer;outline:none;max-width:170px;}
.hsel option{background:#1a2030;}
.header-btn{font-family:var(--font-sans);font-size:12px;font-weight:600;padding:7px 16px;border-radius:var(--radius);cursor:pointer;border:none;transition:all .2s;white-space:nowrap;}
.btn-primary{background:var(--gold);color:#0a0a0a;}
.btn-primary:hover{background:#f5c040;transform:translateY(-1px);box-shadow:0 4px 12px rgba(240,180,41,0.3);}
.btn-primary:disabled{opacity:0.5;cursor:not-allowed;transform:none;box-shadow:none;}
.btn-secondary{background:var(--bg-input);border:1px solid var(--border);color:var(--text-muted);}
.btn-secondary:hover{border-color:var(--gold-dim);color:var(--text);}
.btn-sm{font-size:11px;padding:5px 10px;}
.btn-teal{background:var(--teal);color:#0a0f0d;}
.btn-teal:hover{filter:brightness(1.1);}
.btn-danger{background:var(--red-bg);border:1px solid rgba(248,113,113,0.25);color:var(--red);}
.btn-danger:hover{background:rgba(248,113,113,0.15);}

/* ─── SIDEBAR ─────────────────────────────── */
#sidebar{position:fixed;top:var(--header-h);left:0;width:var(--sidebar-w);height:calc(100vh - var(--header-h));background:var(--bg-sidebar);border-right:1px solid var(--border);overflow-y:auto;overflow-x:hidden;z-index:100;transition:width .25s cubic-bezier(.4,0,.2,1),transform .25s cubic-bezier(.4,0,.2,1);}
#sidebar.collapsed{width:0;border-right-color:transparent;}
.nav-section{padding:18px 0 4px;font-family:var(--font-mono);font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--text-faint);padding-left:20px;white-space:nowrap;}
.nav-item{display:flex;align-items:center;gap:10px;padding:8px 20px;color:var(--text-muted);cursor:pointer;font-size:13px;font-weight:500;white-space:nowrap;transition:all .15s;border-left:2px solid transparent;user-select:none;}
.nav-item:hover{color:var(--text);background:var(--bg-hover);}
.nav-item.active{color:var(--gold);background:var(--gold-bg);border-left-color:var(--gold);}
.nav-icon{width:18px;text-align:center;font-size:14px;flex-shrink:0;}

/* ─── MAIN ────────────────────────────────── */
#main{margin-top:var(--header-h);margin-left:var(--sidebar-w);min-height:calc(100vh - var(--header-h));transition:margin-left .25s cubic-bezier(.4,0,.2,1);}
#main.sidebar-collapsed{margin-left:0;}
.page{display:none;min-height:calc(100vh - var(--header-h));}
.page.active{display:block;}
.page-inner{max-width:900px;margin:0 auto;padding:36px 40px 80px;}
.page-header{margin-bottom:32px;padding-bottom:24px;border-bottom:1px solid var(--border);}
.page-title{font-family:var(--font-display);font-size:28px;font-weight:700;color:var(--text);line-height:1.2;margin-bottom:6px;}
.page-sub{font-size:13px;color:var(--text-muted);}

/* ─── FORMS ───────────────────────────────── */
.form-group{margin-bottom:18px;}
.form-label{display:block;font-family:var(--font-mono);font-size:10px;font-weight:600;color:var(--gold);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:7px;}
.form-input,.form-select,.form-textarea{width:100%;background:var(--bg-input);border:1px solid var(--border);border-radius:var(--radius);color:var(--text);font-family:var(--font-sans);font-size:13px;padding:9px 12px;outline:none;transition:border-color .15s;}
.form-input:focus,.form-select:focus,.form-textarea:focus{border-color:var(--gold-dim);box-shadow:0 0 0 2px var(--gold-bg);}
.form-select{cursor:pointer;-webkit-appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%237c8ca1' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;padding-right:30px;}
.form-select option{background:#1a2030;}
.form-textarea{resize:vertical;min-height:100px;line-height:1.6;}
.form-hint{font-size:11px;color:var(--text-faint);margin-top:5px;}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.form-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;}
.input-group{display:flex;gap:8px;}
.input-group .form-input{flex:1;}

/* ─── CARDS & PANELS ──────────────────────── */
.card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:20px 24px;margin-bottom:14px;}
.card-title{font-size:14px;font-weight:600;color:var(--text);margin-bottom:8px;display:flex;align-items:center;gap:8px;}
.card-meta{font-family:var(--font-mono);font-size:10px;color:var(--text-faint);letter-spacing:0.08em;}
.panel{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;}
.panel-header{padding:14px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;}
.panel-title{font-family:var(--font-mono);font-size:11px;font-weight:600;color:var(--text-muted);letter-spacing:0.1em;text-transform:uppercase;}
.panel-body{padding:20px;}

/* ─── CHIPS / TAGS ────────────────────────── */
.chip{display:inline-flex;align-items:center;gap:5px;font-family:var(--font-mono);font-size:9px;font-weight:600;padding:3px 8px;border-radius:3px;text-transform:uppercase;letter-spacing:0.08em;}
.chip-gold{background:var(--gold-bg);color:var(--gold);border:1px solid rgba(240,180,41,0.2);}
.chip-teal{background:var(--teal-bg);color:var(--teal);border:1px solid rgba(0,204,163,0.2);}
.chip-blue{background:var(--blue-bg);color:var(--blue);border:1px solid rgba(91,164,245,0.2);}
.chip-red{background:var(--red-bg);color:var(--red);border:1px solid rgba(248,113,113,0.2);}
.chip-purple{background:rgba(167,139,250,0.1);color:var(--purple);border:1px solid rgba(167,139,250,0.2);}

/* ─── CALLOUTS ────────────────────────────── */
.callout{border-left:3px solid;padding:14px 18px;border-radius:0 var(--radius) var(--radius) 0;margin:16px 0;font-size:13px;}
.callout-label{font-family:var(--font-mono);font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:5px;}
.callout-gold{border-color:var(--gold);background:var(--gold-bg);}
.callout-gold .callout-label{color:var(--gold);}
.callout-teal{border-color:var(--teal);background:var(--teal-bg);}
.callout-teal .callout-label{color:var(--teal);}
.callout-red{border-color:var(--red);background:var(--red-bg);}
.callout-red .callout-label{color:var(--red);}
.callout-blue{border-color:var(--blue);background:var(--blue-bg);}
.callout-blue .callout-label{color:var(--blue);}

/* ─── CONTENT OUTPUT ──────────────────────── */
#output-area{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);min-height:300px;position:relative;}
.output-toolbar{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--border);}
.output-toolbar-left{display:flex;align-items:center;gap:8px;}
.output-toolbar-right{display:flex;align-items:center;gap:6px;}
#output-content{padding:28px 32px;min-height:260px;font-size:14px;line-height:1.8;color:var(--text-muted);}
#output-content.has-content{color:var(--text);}
#output-content h1,#output-content h2,#output-content h3,#output-content h4{font-family:var(--font-display);color:var(--text);margin:24px 0 12px;line-height:1.3;}
#output-content h1{font-size:26px;}
#output-content h2{font-size:21px;padding-bottom:6px;border-bottom:1px solid var(--border);}
#output-content h3{font-size:17px;color:var(--gold);}
#output-content h4{font-family:var(--font-mono);font-size:11px;color:var(--teal);letter-spacing:0.1em;text-transform:uppercase;}
#output-content p{margin-bottom:14px;}
#output-content ul,#output-content ol{padding-left:20px;margin-bottom:14px;}
#output-content li{margin-bottom:5px;}
#output-content strong{color:var(--text);font-weight:600;}
#output-content em{color:var(--gold);font-style:italic;}
#output-content blockquote{border-left:3px solid var(--gold);padding:12px 18px;margin:16px 0;background:var(--gold-bg);border-radius:0 var(--radius) var(--radius) 0;font-style:italic;color:var(--text);}
#output-content code{font-family:var(--font-mono);font-size:12px;background:var(--bg-input);padding:1px 5px;border-radius:3px;color:var(--teal);}
#output-content hr{border:none;border-top:1px solid var(--border);margin:20px 0;}
#output-content table{width:100%;border-collapse:collapse;margin:16px 0;font-size:13px;}
#output-content th{background:var(--gold-bg);color:var(--gold);font-family:var(--font-mono);font-size:10px;text-transform:uppercase;letter-spacing:0.08em;padding:8px 12px;text-align:left;border-bottom:1px solid var(--border-hi);}
#output-content td{padding:8px 12px;border-bottom:1px solid var(--border);color:var(--text-muted);}
#output-content tr:hover td{background:var(--bg-hover);}

/* ─── WIZARD LAYOUT ───────────────────────── */
.wizard-layout{display:grid;grid-template-columns:320px 1fr;gap:20px;align-items:start;}
.wizard-controls{position:sticky;top:24px;}
.wizard-section{margin-bottom:20px;}
.wizard-section-title{font-family:var(--font-mono);font-size:9px;font-weight:700;color:var(--text-faint);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:10px;}
.style-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;}
.style-chip{padding:7px 10px;border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;transition:all .15s;background:var(--bg-input);text-align:center;}
.style-chip:hover{border-color:var(--gold-dim);background:var(--gold-bg);}
.style-chip.selected{border-color:var(--gold);background:var(--gold-bg);color:var(--gold);}
.style-chip-name{font-size:11px;font-weight:600;color:var(--text);display:block;}
.style-chip-sub{font-size:9px;color:var(--text-faint);display:block;margin-top:1px;}
.style-chip.selected .style-chip-name{color:var(--gold);}
.mode-options{display:flex;flex-direction:column;gap:6px;}
.mode-option{display:flex;align-items:center;gap:10px;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;transition:all .15s;background:var(--bg-input);}
.mode-option:hover{border-color:var(--border-hi);background:var(--bg-hover);}
.mode-option.selected{border-color:var(--teal);background:var(--teal-bg);}
.mode-option input[type="radio"]{accent-color:var(--teal);}
.mode-option-label{font-size:12px;font-weight:500;}
.mode-option-hint{font-size:10px;color:var(--text-faint);}
.content-type-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px;}
.ctype-btn{padding:6px 8px;border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;font-size:11px;font-weight:500;background:var(--bg-input);color:var(--text-muted);text-align:center;transition:all .15s;}
.ctype-btn:hover{border-color:var(--border-hi);color:var(--text);}
.ctype-btn.selected{border-color:var(--teal);background:var(--teal-bg);color:var(--teal);}
.length-opts{display:flex;gap:5px;}
.length-btn{flex:1;padding:6px 8px;border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;font-size:11px;font-weight:500;background:var(--bg-input);color:var(--text-muted);text-align:center;transition:all .15s;}
.length-btn:hover{border-color:var(--border-hi);color:var(--text);}
.length-btn.selected{border-color:var(--gold);background:var(--gold-bg);color:var(--gold);}
.search-api-row{display:flex;gap:6px;}
.search-api-btn{flex:1;padding:6px;border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;font-size:10px;font-weight:600;background:var(--bg-input);color:var(--text-faint);text-align:center;transition:all .15s;font-family:var(--font-mono);text-transform:uppercase;letter-spacing:0.06em;}
.search-api-btn:hover{border-color:var(--border-hi);color:var(--text);}
.search-api-btn.selected{border-color:var(--blue);background:var(--blue-bg);color:var(--blue);}
.search-api-btn:disabled{opacity:0.35;cursor:not-allowed;}

/* ─── LOADING ─────────────────────────────── */
.spinner{width:18px;height:18px;border:2px solid var(--border);border-top-color:var(--gold);border-radius:50%;animation:spin .7s linear infinite;display:inline-block;vertical-align:middle;}
@keyframes spin{to{transform:rotate(360deg);}}
.generating-indicator{display:flex;align-items:center;gap:10px;color:var(--text-muted);font-size:13px;padding:12px 0;}
.gen-dots span{animation:blink 1.4s ease-in-out infinite;opacity:0;}
.gen-dots span:nth-child(1){animation-delay:0s;}
.gen-dots span:nth-child(2){animation-delay:.2s;}
.gen-dots span:nth-child(3){animation-delay:.4s;}
@keyframes blink{0%,80%,100%{opacity:0;}40%{opacity:1;}}
.pulse-bar{height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent);border-radius:1px;animation:pulse-slide 1.5s ease-in-out infinite;}
@keyframes pulse-slide{0%{background-position:-200% center;}100%{background-position:200% center;}background-size:200%;}

/* ─── CONTENT LIBRARY ─────────────────────── */
.library-grid{display:flex;flex-direction:column;gap:10px;}
.lib-item{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:16px 20px;cursor:pointer;transition:all .15s;}
.lib-item:hover{border-color:var(--border-hi);background:var(--bg-hover);}
.lib-item-title{font-size:14px;font-weight:600;color:var(--text);margin-bottom:4px;}
.lib-item-meta{display:flex;align-items:center;gap:10px;font-size:11px;color:var(--text-faint);}
.lib-item-preview{font-size:12px;color:var(--text-muted);margin-top:6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.lib-empty{text-align:center;padding:60px 20px;color:var(--text-faint);}
.lib-empty-icon{font-size:40px;margin-bottom:14px;opacity:0.4;}

/* ─── STYLE PROFILE ───────────────────────── */
.style-profile-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:24px 28px;margin-bottom:16px;}
.style-profile-num{font-family:var(--font-mono);font-size:10px;font-weight:600;color:var(--gold);letter-spacing:0.12em;margin-bottom:4px;}
.style-profile-title{font-family:var(--font-display);font-size:22px;font-weight:700;color:var(--text);margin-bottom:2px;}
.style-profile-sub{font-size:11px;color:var(--text-faint);font-family:var(--font-mono);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:14px;}
.style-principle{border-left:3px solid var(--gold);background:var(--gold-bg);padding:12px 16px;border-radius:0 var(--radius) var(--radius) 0;margin-bottom:16px;font-size:13px;color:var(--text-muted);font-style:italic;line-height:1.6;}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:14px;}
.prompt-block{background:#0a0f1a;border:1px solid var(--border-hi);border-radius:var(--radius);padding:16px 18px;margin-top:12px;font-family:var(--font-mono);font-size:11.5px;color:#cdd6f4;line-height:1.7;position:relative;}
.prompt-label{font-size:9px;font-weight:700;color:var(--purple);letter-spacing:0.14em;text-transform:uppercase;margin-bottom:10px;}
.use-prompt-btn{position:absolute;top:10px;right:10px;}

/* ─── NOTES ───────────────────────────────── */
#notes-editor{width:100%;background:var(--bg-input);border:1px solid var(--border);border-radius:var(--radius);color:var(--text);font-family:var(--font-sans);font-size:14px;line-height:1.8;padding:20px;min-height:500px;resize:none;outline:none;transition:border-color .15s;}
#notes-editor:focus{border-color:var(--gold-dim);}

/* ─── ROADMAP ─────────────────────────────── */
.roadmap-item{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:14px 18px;margin-bottom:10px;display:flex;align-items:flex-start;gap:12px;}
.roadmap-item-check{flex-shrink:0;width:18px;height:18px;border:1.5px solid var(--border-hi);border-radius:3px;cursor:pointer;display:flex;align-items:center;justify-content:center;margin-top:2px;transition:all .15s;}
.roadmap-item-check:hover{border-color:var(--gold-dim);}
.roadmap-item-check.done{background:var(--gold);border-color:var(--gold);}
.roadmap-item-check.done::after{content:'✓';color:#000;font-size:11px;font-weight:700;}
.roadmap-item-body{flex:1;}
.roadmap-item-title{font-size:13px;font-weight:600;color:var(--text);}
.roadmap-item-title.done{text-decoration:line-through;color:var(--text-faint);}
.roadmap-item-meta{font-size:11px;color:var(--text-faint);margin-top:3px;display:flex;align-items:center;gap:8px;}
.roadmap-item-del{color:var(--text-faint);cursor:pointer;font-size:16px;padding:2px 6px;border-radius:3px;line-height:1;}
.roadmap-item-del:hover{color:var(--red);background:var(--red-bg);}

/* ─── SETTINGS ────────────────────────────── */
.settings-section{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:24px 28px;margin-bottom:20px;}
.settings-section-title{font-family:var(--font-mono);font-size:10px;font-weight:700;color:var(--gold);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:16px;padding-bottom:10px;border-bottom:1px solid var(--border);}
.key-status{display:inline-flex;align-items:center;gap:5px;font-size:10px;padding:2px 7px;border-radius:2px;}
.key-set{background:var(--green-bg);color:var(--green);}
.key-missing{background:var(--red-bg);color:var(--red);}

/* ─── GEO/SEO REFERENCE ───────────────────── */
.ref-section{margin-bottom:32px;}
.ref-section h3{font-family:var(--font-display);font-size:19px;font-weight:700;color:var(--text);margin-bottom:10px;}
.ref-section p{font-size:13px;color:var(--text-muted);line-height:1.75;}
.ref-list{list-style:none;padding:0;margin:10px 0;display:flex;flex-direction:column;gap:7px;}
.ref-list li{display:flex;align-items:flex-start;gap:10px;font-size:13px;color:var(--text-muted);}
.ref-list li::before{content:'→';color:var(--gold);flex-shrink:0;font-family:var(--font-mono);font-size:11px;margin-top:2px;}
.ref-table{width:100%;border-collapse:collapse;font-size:12px;margin:12px 0;}
.ref-table th{background:var(--gold-bg);color:var(--gold);font-family:var(--font-mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;padding:8px 12px;text-align:left;border-bottom:1px solid var(--border-hi);}
.ref-table td{padding:8px 12px;border-bottom:1px solid var(--border);color:var(--text-muted);vertical-align:top;}
.ref-table td:first-child{color:var(--text);font-weight:500;}

/* ─── MODAL ───────────────────────────────── */
.modal-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:500;align-items:center;justify-content:center;}
.modal-overlay.open{display:flex;}
.modal{background:var(--bg-card);border:1px solid var(--border-hi);border-radius:var(--radius);padding:28px 32px;max-width:580px;width:90%;max-height:80vh;overflow-y:auto;position:relative;}
.modal-title{font-family:var(--font-display);font-size:20px;font-weight:700;color:var(--text);margin-bottom:4px;}
.modal-sub{font-size:12px;color:var(--text-muted);margin-bottom:20px;}
.modal-close{position:absolute;top:16px;right:16px;background:none;border:none;color:var(--text-faint);font-size:18px;cursor:pointer;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:3px;}
.modal-close:hover{color:var(--text);background:var(--bg-hover);}
.modal-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:20px;padding-top:16px;border-top:1px solid var(--border);}

/* ─── ALERTS ──────────────────────────────── */
.alert{position:fixed;bottom:24px;right:24px;padding:12px 18px;border-radius:var(--radius);font-size:13px;z-index:600;display:flex;align-items:center;gap:10px;max-width:380px;animation:slide-in .3s ease;box-shadow:var(--shadow);}
@keyframes slide-in{from{transform:translateX(100%);opacity:0;}to{transform:translateX(0);opacity:1;}}
.alert-success{background:#0d2a1e;border:1px solid rgba(52,211,153,0.3);color:var(--green);}
.alert-error{background:#2a0d0d;border:1px solid rgba(248,113,113,0.3);color:var(--red);}
.alert-info{background:#0d1a2a;border:1px solid rgba(91,164,245,0.3);color:var(--blue);}

/* ─── MISC ────────────────────────────────── */
.divider{border:none;border-top:1px solid var(--border);margin:24px 0;}
.text-gold{color:var(--gold);}
.text-teal{color:var(--teal);}
.text-muted{color:var(--text-muted);}
.text-faint{color:var(--text-faint);}
.mono{font-family:var(--font-mono);}
.flex{display:flex;align-items:center;}
.flex-between{display:flex;align-items:center;justify-content:space-between;}
.gap-8{gap:8px;}
.gap-12{gap:12px;}
.mb-4{margin-bottom:4px;}
.mb-8{margin-bottom:8px;}
.mb-12{margin-bottom:12px;}
.mb-20{margin-bottom:20px;}
.mt-12{margin-top:12px;}
.w-full{width:100%;}
.flex-wrap{flex-wrap:wrap;}
.select-none{user-select:none;}

/* ─── RESPONSIVE ──────────────────────────── */
@media(max-width:900px){
  #sidebar{transform:translateX(-100%);}
  #sidebar.mobile-open{transform:translateX(0);}
  #main{margin-left:0 !important;}
  .wizard-layout{grid-template-columns:1fr;}
  .form-row,.form-row-3{grid-template-columns:1fr;}
  .two-col{grid-template-columns:1fr;}
  .page-inner{padding:24px 20px 60px;}
}
</style>

</head>
<body>

<!-- HEADER -->

<header id="header">
  <button class="sidebar-toggle" onclick="toggleSidebar()" title="Toggle sidebar">☰</button>
  <a class="logo" href="#" onclick="return false;">
    <span class="logo-mark">Leverage</span>
    Content Studio
  </a>
  <div class="hspacer"></div>
  <div class="header-selects">
    <div class="hsel-group">
      <span class="hsel-label">Provider</span>
      <select class="hsel" id="hdr-provider" onchange="onProviderChange()">
        <option value="anthropic">Anthropic</option>
        <option value="groq">Groq</option>
      </select>
    </div>
    <div class="hsel-group">
      <span class="hsel-label">Model</span>
      <select class="hsel" id="hdr-model"></select>
    </div>
    <button class="header-btn btn-primary" id="hdr-generate" onclick="triggerGenerate()">⚡ Generate</button>
  </div>
</header>

<!-- SIDEBAR -->

<aside id="sidebar">
  <div class="nav-section">Workspace</div>
  <div class="nav-item active" onclick="nav('wizard')" data-page="wizard"><span class="nav-icon">✦</span>Content Wizard</div>
  <div class="nav-item" onclick="nav('content')" data-page="content"><span class="nav-icon">📚</span>Created Content</div>
  <div class="nav-section">Library</div>
  <div class="nav-item" onclick="nav('system-prompts')" data-page="system-prompts"><span class="nav-icon">⚙</span>System Prompts</div>
  <div class="nav-item" onclick="nav('custom-patterns')" data-page="custom-patterns"><span class="nav-icon">✏</span>Custom Patterns</div>
  <div class="nav-section">Planning</div>
  <div class="nav-item" onclick="nav('notes')" data-page="notes"><span class="nav-icon">📝</span>Notes</div>
  <div class="nav-item" onclick="nav('roadmap')" data-page="roadmap"><span class="nav-icon">🗺</span>Content Roadmap</div>
  <div class="nav-section">Reference</div>
  <div class="nav-item" onclick="nav('geo-seo')" data-page="geo-seo"><span class="nav-icon">🎯</span>GEO/SEO Guidelines</div>
  <div class="nav-item" onclick="nav('tools')" data-page="tools"><span class="nav-icon">🔧</span>Tools & Definitions</div>
  <div class="nav-section">Config</div>
  <div class="nav-item" onclick="nav('settings')" data-page="settings"><span class="nav-icon">⚙</span>Settings</div>
</aside>

<!-- MAIN -->

<main id="main">

<!-- ══ PAGE: CONTENT WIZARD ══ -->

<div id="page-wizard" class="page active">
    <div class="page-inner" style="max-width:1100px;">
      <div class="page-header">
        <div class="flex flex-between">
          <div>
            <div class="page-title">Content Wizard</div>
            <div class="page-sub">Select a writing engine, define your topic, and generate optimized content.</div>
          </div>
          <div class="flex gap-8">
            <button class="header-btn btn-secondary btn-sm" onclick="wizardRandom()" title="Surprise Me — random style + topic">🎲 Surprise Me</button>
          </div>
        </div>
      </div>
      <div class="wizard-layout">
        <!-- CONTROLS -->
        <div class="wizard-controls">
          <div class="wizard-section">
            <div class="wizard-section-title">Writing Style Engine</div>
            <div class="style-grid" id="style-grid"></div>
          </div>
          <div class="wizard-section">
            <div class="wizard-section-title">Secondary Style (Combo)</div>
            <select class="form-select" id="secondary-style" style="font-size:12px;">
              <option value="">None (Pure single style)</option>
            </select>
          </div>
          <div class="wizard-section">
            <div class="wizard-section-title">Content Type</div>
            <div class="content-type-grid" id="ctype-grid"></div>
          </div>
          <div class="wizard-section">
            <div class="wizard-section-title">Target Length</div>
            <div class="length-opts" id="length-opts"></div>
          </div>
          <div class="wizard-section">
            <div class="wizard-section-title">Topic / Brief</div>
            <textarea class="form-textarea" id="topic-input" rows="3" placeholder="Enter your topic, headline idea, or full brief..." style="min-height:80px;font-size:13px;"></textarea>
          </div>
          <div class="wizard-section">
            <div class="wizard-section-title">Research Mode</div>
            <div class="mode-options" id="mode-options"></div>
          </div>
          <div id="search-api-section" style="display:none;">
            <div class="wizard-section-title" style="margin-bottom:8px;">Search API</div>
            <div class="search-api-row" id="search-api-row"></div>
          </div>
          <div style="margin-top:16px;">
            <button class="header-btn btn-primary w-full" id="wiz-generate" onclick="triggerGenerate()" style="padding:10px;font-size:13px;">⚡ Generate Content</button>
          </div>
        </div>
        <!-- OUTPUT -->
        <div>
          <div id="output-area">
            <div class="output-toolbar">
              <div class="output-toolbar-left" id="output-status">
                <span class="chip chip-teal" id="output-style-chip">Select a style</span>
                <span class="chip chip-gold" id="output-type-chip"></span>
              </div>
              <div class="output-toolbar-right">
                <button class="header-btn btn-secondary btn-sm" onclick="copyOutput()" id="btn-copy" style="display:none;">Copy</button>
                <button class="header-btn btn-secondary btn-sm" onclick="saveContent()" id="btn-save" style="display:none;">Save</button>
                <div class="hsel-group" id="export-group" style="display:none;">
                  <span class="hsel-label">Export</span>
                  <select class="hsel" id="export-format" onchange="exportContent(this.value)">
                    <option value="">Choose format…</option>
                    <option value="md">Markdown</option>
                    <option value="html">HTML</option>
                    <option value="json">JSON</option>
                  </select>
                </div>
              </div>
            </div>
            <div id="output-content" class="text-muted" style="padding:40px 32px;text-align:center;">
              <div style="font-size:36px;margin-bottom:16px;opacity:0.3;">✦</div>
              <div style="font-family:var(--font-display);font-size:18px;color:var(--text-faint);margin-bottom:8px;">Ready to create</div>
              <div style="font-size:13px;color:var(--text-faint);">Select a writing style, enter your topic, and click Generate.</div>
            </div>
          </div>
          <div id="word-count-bar" style="display:none;font-family:var(--font-mono);font-size:10px;color:var(--text-faint);padding:8px 4px;text-align:right;"></div>
        </div>
      </div>
    </div>
  </div>

<!-- ══ PAGE: CREATED CONTENT ══ -->

<div id="page-content" class="page">
    <div class="page-inner">
      <div class="page-header">
        <div class="flex flex-between">
          <div>
            <div class="page-title">Created Content</div>
            <div class="page-sub">Your saved articles, posts, and drafts.</div>
          </div>
          <div class="flex gap-8">
            <input class="form-input" type="text" id="content-search" placeholder="Search content…" oninput="renderContentLibrary()" style="width:200px;font-size:12px;padding:6px 10px;">
            <button class="header-btn btn-danger btn-sm" onclick="clearAllContent()" id="btn-clear-all">Clear All</button>
          </div>
        </div>
      </div>
      <div id="content-library"></div>
    </div>
  </div>

<!-- ══ PAGE: SYSTEM PROMPTS ══ -->

<div id="page-system-prompts" class="page">
    <div class="page-inner">
      <div class="page-header">
        <div class="page-title">System Prompts</div>
        <div class="page-sub">All 10 built-in writing style engines with full activation prompts. Use these as-is or fork them into Custom Patterns.</div>
      </div>
      <div id="system-prompts-list"></div>
    </div>
  </div>

<!-- ══ PAGE: CUSTOM PATTERNS ══ -->

<div id="page-custom-patterns" class="page">
    <div class="page-inner">
      <div class="page-header">
        <div class="flex flex-between">
          <div>
            <div class="page-title">Custom Patterns</div>
            <div class="page-sub">Create and manage your own writing styles and system prompts.</div>
          </div>
          <button class="header-btn btn-primary btn-sm" onclick="openCustomPatternModal()">+ New Pattern</button>
        </div>
      </div>
      <div id="custom-patterns-list"></div>
    </div>
  </div>

<!-- ══ PAGE: NOTES ══ -->

<div id="page-notes" class="page">
    <div class="page-inner">
      <div class="page-header">
        <div class="flex flex-between">
          <div>
            <div class="page-title">Notes</div>
            <div class="page-sub">Freeform workspace for ideas, research, and drafts. Auto-saved.</div>
          </div>
          <div class="flex gap-8">
            <span class="mono" style="font-size:10px;color:var(--text-faint);" id="notes-saved">Saved</span>
            <button class="header-btn btn-danger btn-sm" onclick="clearNotes()">Clear</button>
          </div>
        </div>
      </div>
      <textarea id="notes-editor" placeholder="Start typing… Notes are automatically saved to your browser."></textarea>
    </div>
  </div>

<!-- ══ PAGE: CONTENT ROADMAP ══ -->

<div id="page-roadmap" class="page">
    <div class="page-inner">
      <div class="page-header">
        <div class="flex flex-between">
          <div>
            <div class="page-title">Content Roadmap</div>
            <div class="page-sub">Track your content ideas and publishing pipeline.</div>
          </div>
        </div>
      </div>
      <div class="card" style="margin-bottom:20px;">
        <div class="card-title">Add Content Idea</div>
        <div class="form-row" style="gap:10px;align-items:flex-end;">
          <div>
            <label class="form-label">Title / Topic</label>
            <input class="form-input" id="rm-title" placeholder="Article title or topic…">
          </div>
          <div>
            <label class="form-label">Type</label>
            <select class="form-select" id="rm-type">
              <option>Blog Post</option><option>Article</option><option>Social Post</option>
              <option>Email</option><option>Video Script</option><option>White Paper</option>
            </select>
          </div>
          <div>
            <label class="form-label">Priority</label>
            <select class="form-select" id="rm-priority">
              <option value="high">🔴 High</option>
              <option value="med" selected>🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>
          <button class="header-btn btn-primary" style="margin-bottom:0;white-space:nowrap;" onclick="addRoadmapItem()">Add</button>
        </div>
      </div>
      <div id="roadmap-list"></div>
    </div>
  </div>

<!-- ══ PAGE: GEO/SEO GUIDELINES ══ -->

<div id="page-geo-seo" class="page">
    <div class="page-inner">
      <div class="page-header">
        <div class="page-title">GEO / SEO Optimization Guidelines</div>
        <div class="page-sub">Built-in AI-search and SEO principles applied to every generated piece.</div>
      </div>
      <div id="geo-seo-content"></div>
    </div>
  </div>

<!-- ══ PAGE: TOOLS & DEFINITIONS ══ -->

<div id="page-tools" class="page">
    <div class="page-inner">
      <div class="page-header">
        <div class="page-title">Tools & Definitions</div>
        <div class="page-sub">Web search integrations and key terminology for GEO/SEO content creation.</div>
      </div>
      <div id="tools-content"></div>
    </div>
  </div>

<!-- ══ PAGE: SETTINGS ══ -->

<div id="page-settings" class="page">
    <div class="page-inner">
      <div class="page-header">
        <div class="page-title">Settings</div>
        <div class="page-sub">Configure API keys, defaults, and preferences. All data stays in your browser.</div>
      </div>
      <div id="settings-content"></div>
    </div>
  </div>

</main>

<!-- MODAL: Custom Pattern -->

<div class="modal-overlay" id="custom-pattern-modal">
  <div class="modal">
    <button class="modal-close" onclick="closeModal('custom-pattern-modal')">✕</button>
    <div class="modal-title" id="cpm-title">New Custom Pattern</div>
    <div class="modal-sub">Create a reusable writing style and system prompt.</div>
    <div class="form-group">
      <label class="form-label">Pattern Name</label>
      <input class="form-input" id="cpm-name" placeholder="e.g. Brand Voice — Formal">
    </div>
    <div class="form-group">
      <label class="form-label">Subtitle / Description</label>
      <input class="form-input" id="cpm-sub" placeholder="e.g. Corporate tone for executive communications">
    </div>
    <div class="form-group">
      <label class="form-label">System Prompt / Instructions</label>
      <textarea class="form-textarea" id="cpm-prompt" rows="8" placeholder="Enter the full system prompt for this writing pattern..."></textarea>
    </div>
    <div class="form-group">
      <label class="form-label">Best For</label>
      <input class="form-input" id="cpm-bestfor" placeholder="e.g. LinkedIn posts, executive reports">
    </div>
    <div class="modal-actions">
      <button class="header-btn btn-secondary" onclick="closeModal('custom-pattern-modal')">Cancel</button>
      <button class="header-btn btn-primary" onclick="saveCustomPattern()">Save Pattern</button>
    </div>
  </div>
</div>

<!-- MODAL: View Content -->

<div class="modal-overlay" id="view-content-modal">
  <div class="modal" style="max-width:760px;">
    <button class="modal-close" onclick="closeModal('view-content-modal')">✕</button>
    <div class="modal-title" id="vcm-title">Content Preview</div>
    <div class="modal-sub" id="vcm-meta"></div>
    <div id="vcm-body" style="border-top:1px solid var(--border);padding-top:16px;max-height:50vh;overflow-y:auto;"></div>
    <div class="modal-actions">
      <button class="header-btn btn-danger btn-sm" onclick="deleteContent(currentViewId)">Delete</button>
      <div style="flex:1"></div>
      <button class="header-btn btn-secondary" onclick="exportSingle('md')">Export MD</button>
      <button class="header-btn btn-secondary" onclick="exportSingle('html')">Export HTML</button>
      <button class="header-btn btn-teal" onclick="loadToWizard()">Load to Wizard</button>
    </div>
  </div>
</div>

<script>
// ═══════════════════════════════════════════════════════════════════════
// DATA: WRITING STYLES
// ═══════════════════════════════════════════════════════════════════════
const WRITING_STYLES = [
  {
    id:'narrative-economist',name:'Narrative Economist',subtitle:'Character-driven systems journalism',
    tone:'Wry, assured',idealLength:'1,500–4,000 words',readerFeeling:'"I never knew this was so fascinating"',
    bestFor:['Tech industry explainers','Industry disruption pieces','Business narrative'],
    principle:'Every complex system has a human standing at its weakest seam. Find that person. Tell their story. The system explains itself.',
    activationPrompt:`You are writing a character-driven systems piece using the Narrative Economist voice engine.

KEY PRINCIPLE: Every complex system has a human standing at its weakest seam. Find that person. Tell their story. The system explains itself.

STRUCTURE (follow exactly):
1. Cold open — A person. A moment. Something that doesn't add up. No context, no explanation.
2. Context drop — Pull back just enough to show the world this person operates in.
3. The problem — Revealed through what the character does or says, never through direct exposition.
4. Rising action — Stakes escalate. Other characters enter. The system's flaws surface through events.
5. The turn — The moment the reader sees what the character saw before anyone else did.
6. Resolution as image — End on a concrete scene that crystallizes the theme without stating it.

PATTERNS (apply throughout):
- Open with a specific person doing something specific and slightly strange
- Use dialogue — even reconstructed — to reveal character and stakes
- Let the reader feel smarter as the piece progresses; teach without teaching
- Deploy humor through observation — state absurd facts plainly, never construct jokes
- Build to a "wait, what?" moment where the reader's assumption flips
- Use concrete numbers and specific details to ground every abstract concept
- Short declarative sentences signal importance — use sparingly and deliberately

HARD PROHIBITIONS:
- Never open with a thesis statement or topic sentence
- Never explain the system before establishing the character
- Never editorialize or tell the reader what to think
- Never write "in conclusion," "to summarize," or "in this article"
- Never use jargon without a human moment to decode it first
- Never make the protagonist a hero; make them interesting`
  },
  {
    id:'extreme-correspondent',name:'Extreme Correspondent',subtitle:'Immersive high-stakes narrative',
    tone:'Tense, visceral',idealLength:'2,000–5,000 words',readerFeeling:'"My palms are sweating"',
    bestFor:['Founder/startup origin stories','Case studies','High-stakes transformations'],
    principle:'Put the reader\'s body in the scene. If they can feel the cold, the altitude, the fear — they\'ll follow you anywhere, including into the argument.',
    activationPrompt:`You are writing an immersive, high-stakes narrative using the Extreme Correspondent voice engine.

KEY PRINCIPLE: Put the reader's body in the scene. If they can feel the cold, the altitude, the fear — they'll follow you anywhere, including into the argument.

STRUCTURE (follow exactly):
1. Flash-forward — The outcome, stated starkly. A failure, a crisis, a pivot. The reader knows what.
2. Rewind to origin — How did we get here? Introduce the person before the crisis.
3. The descent into commitment — Small decisions compound. The point of no return arrives quietly.
4. Immersive crisis — Tight, sensory, compressed. The reader is in it.
5. Aftermath — Pull back. What changed? What didn't? What does it mean?
6. Final image — A single haunting detail. Something the reader carries out of the piece.

PATTERNS (apply throughout):
- Ground every scene in physical detail — what the body feels, not just what the mind thinks
- Use timeline shifts to create tension (reader knows the ending; suspense is in how)
- Build dread through accumulation of small, factual details
- Compress sentences during high-stakes moments; expand during reflection
- Use geography and environment as characters in their own right

HARD PROHIBITIONS:
- Never sensationalize — the facts are dramatic enough
- Never over-explain motivation; show the decision and let the reader infer
- Never drop research in blocks — weave through scene and action
- Never soften consequences; power comes from unflinching honesty
- Never rush the setup — payoff depends on the reader being fully immersed`
  },
  {
    id:'pattern-detective',name:'Pattern Detective',subtitle:'Counterintuitive insight journalism',
    tone:'Curious, surprising',idealLength:'1,500–3,500 words',readerFeeling:'"I never thought of it that way"',
    bestFor:['Industry trend analysis','"Why X is actually about Y" articles','Counterintuitive takes'],
    principle:'The most interesting thing about any topic is the thing everyone assumed was obvious — until you show them it isn\'t.',
    activationPrompt:`You are writing a counterintuitive insight piece using the Pattern Detective voice engine.

KEY PRINCIPLE: The most interesting thing about any topic is the thing everyone assumed was obvious — until you show them it isn't.

STRUCTURE (follow exactly):
1. The unexpected anecdote — A specific story that seems like a complete tangent.
2. The question — "But what if this isn't really about [obvious thing]?"
3. The research — Introduce a study or expert, told as narrative (who, where, under what circumstances).
4. The pattern — Connect the anecdote and the research. Name the phenomenon — give it a label.
5. The second example — A different domain, same pattern. The insight solidifies.
6. The return — Come back to the opening story. Now the reader sees it with new eyes.

PATTERNS (apply throughout):
- Start with a story that seems to have nothing to do with the actual topic
- Connect two seemingly unrelated domains — the surprise connection IS the insight
- Cite research by telling the story of the researcher, not just the findings
- Create a memorable name for the phenomenon you're describing
- Ask rhetorical questions that genuinely shift perspective

HARD PROHIBITIONS:
- Never explain the central connection before section 4
- Never cherry-pick data without acknowledging complexity
- Never let cleverness overwhelm substance — insight must be earned
- Never be smug — the tone is curious and generous, never superior
- Never stack more than 2-3 studies without a narrative break`
  },
  {
    id:'essayist-witness',name:'Essayist-Witness',subtitle:'Cool, precise observational prose',
    tone:'Cool, precise',idealLength:'800–2,500 words',readerFeeling:'"Something is off and I can\'t look away"',
    bestFor:['Company culture pieces','Institutional critique','Personal essays with professional relevance'],
    principle:'Pay attention to what\'s actually there — not what should be there. The gap between the story people tell themselves and the reality in front of them is where all the interesting writing lives.',
    activationPrompt:`You are writing a cool, precise observational essay using the Essayist-Witness voice engine.

KEY PRINCIPLE: Pay attention to what's actually there — not what should be there. The gap between the story people tell themselves and the reality in front of them is where all the interesting writing lives.

STRUCTURE (follow exactly):
1. The image — A single, vivid scene. No context yet. Just precise observation.
2. The context — Pull back slowly. Where are we? When? Why does it matter?
3. The fracture — Something doesn't match. The official narrative and the observed reality diverge.
4. The investigation — Follow the fracture. What does it reveal?
5. The personal thread — Brief, controlled. Why this matters. Why it should matter to you.
6. The final image — Return to observation. The same world, seen differently now.

PATTERNS (apply throughout):
- Open with a concrete, specific image that sets mood before meaning
- Use short, declarative sentences to establish authority
- Notice what's missing from a scene and name it
- Include yourself only as a lens, not as a subject
- Every paragraph should contain at least one detail so specific it could not apply to any other situation

HARD PROHIBITIONS:
- Never explain an emotion — describe the object or scene that caused it
- Never use the word "feel" or "feelings"
- Never resolve tension neatly — leave the reader with something
- Never generalize; this style works through radical specificity
- Never be warm or encouraging; this voice is cool, not cold`
  },
  {
    id:'structural-geologist',name:'Structural Geologist',subtitle:'Obsessive depth, patient revelation',
    tone:'Patient, reverent',idealLength:'3,000–8,000 words',readerFeeling:'"I had no idea this went so deep"',
    bestFor:['"How it\'s made" content','Long-form reports & white papers','Technical deep dives'],
    principle:'Structure is not decoration. The shape of the piece should mirror the shape of the subject. And any topic — absolutely any — becomes fascinating when you go deep enough.',
    activationPrompt:`You are writing a deep, process-oriented piece using the Structural Geologist voice engine.

KEY PRINCIPLE: Structure is not decoration. The shape of the piece should mirror the shape of the subject. Any topic becomes fascinating when you go deep enough.

STRUCTURE (follow exactly):
1. The entry point — Meet the person or place. Something specific and vivid. Unhurried.
2. The first layer — Surface knowledge. What most people know about this subject.
3. Going deeper — Technical detail introduced through action and process, not explanation.
4. The digression — A related story, history, or parallel that enriches understanding.
5. The convergence — Everything connects. The digression was the point all along.
6. The deepest layer — The insight that only comes from sustained attention.

PATTERNS (apply throughout):
- Layer in technical depth gradually, always through action and process
- Use exact technical vocabulary — never paraphrase when precision exists
- Let apparent digressions develop fully before revealing their connection
- Allow sentences to run long when describing process — the length is the point
- Treat expertise with genuine reverence; let experts speak at length

HARD PROHIBITIONS:
- Never simplify to the point of losing what makes the subject interesting
- Never rush — this style needs room to breathe
- Never define terms in parentheses — earn them through context
- Never impose drama artificially; find the inherent drama in mastery
- Never condescend to readers; they are as intelligent as you`
  },
  {
    id:'curious-empiricist',name:'Curious Empiricist',subtitle:'Humor-driven science & tech accessibility',
    tone:'Funny, honest',idealLength:'1,200–3,000 words',readerFeeling:'"I\'m laughing AND learning"',
    bestFor:['Product/engineering deep-dives','"How does X actually work?" articles','Accessible tech explainers'],
    principle:'The best way to explain something complicated is to be genuinely curious about it yourself, and honest about how confusing it is at first.',
    activationPrompt:`You are writing an accessible, humor-driven explainer using the Curious Empiricist voice engine.

KEY PRINCIPLE: The best way to explain something complicated is to be genuinely curious about it yourself, and honest about how confusing it is at first.

STRUCTURE (follow exactly):
1. The question nobody asks — Start with something surprising, weird, or slightly taboo about the topic.
2. The visit — Go somewhere metaphorically. Meet someone. Describe the scene with humor and honesty.
3. The science/substance — Delivered through conversation and demonstration, not lecture.
4. The tangent — A delightful related fact that deepens the picture unexpectedly.
5. The deeper question — Beneath the funny surface, something genuinely important.
6. The satisfying answer — Wrap with clarity, wonder, and maybe one last observation.

PATTERNS (apply throughout):
- Ask the dumb question on the page; the reader is grateful you did
- Use humor to lower defenses before delivering real information
- Let scientists and experts be characters, not just citation sources
- Include the weird, tangential fact — it's often the most memorable part
- Use analogies that connect technical concepts to everyday experience

HARD PROHIBITIONS:
- Never sacrifice accuracy for a laugh — humor must coexist with rigor
- Never make fun of subjects or experts; laugh with, never at
- Never front-load too much context before the fun starts
- Never skip the counterintuitive or awkward details — they're where engagement lives
- Never write from pure distance; this style requires genuine curiosity`
  },
  {
    id:'footnote-maximalist',name:'Footnote Maximalist',subtitle:'Hyper-aware, encyclopedic immersion',
    tone:'Hyper-aware, sincere',idealLength:'2,500–6,000 words',readerFeeling:'"This is what it actually feels like to think"',
    bestFor:['Tech culture commentary','"What is it like to…" pieces','Complex event documentation'],
    principle:'The thing and the experience of the thing are both the subject. Consciousness is not a distraction from the story — it IS the story.',
    activationPrompt:`You are writing a hyper-aware, encyclopedic immersion piece using the Footnote Maximalist voice engine.

KEY PRINCIPLE: The thing and the experience of the thing are both the subject. Consciousness is not a distraction from the story — it IS the story.

STRUCTURE (follow exactly):
1. The overwhelming scene — Arrive somewhere with too much happening. Describe all of it.
2. The zoom-in — Pick one thread from the chaos. Follow it.
3. The digression — A seemingly unrelated observation that will matter later.
4. The technical deep-dive — Go full-nerd on something specific. The detail is the pleasure.
5. The sincere moment — Drop the irony. Say something real. Then recover.
6. The pull-back — Return to the overwhelming scene. Now the reader sees the pattern in the chaos.

PATTERNS (apply throughout):
- Use parentheticals to create a running second track of commentary
- Mix academic vocabulary and colloquial language deliberately in the same paragraph
- Be exhaustive when exhaustiveness IS the point
- Allow vulnerability to surface through layers of cleverness
- Use lists and catalogs for rhythm and immersion, not just information

HARD PROHIBITIONS:
- Never mistake length for depth — every digression must earn its space
- Never be clever for cleverness's sake; sincerity is the engine, irony is the paint
- Never lose the reader in nested structures without a clear return path
- Never hide behind irony permanently — one genuine moment must land cleanly
- Never use this voice at half-commitment; it requires full engagement`
  },
  {
    id:'conversational-philosopher',name:'Conversational Philosopher',subtitle:'Warm, direct, intimately persuasive',
    tone:'Warm, sharp',idealLength:'600–1,800 words',readerFeeling:'"This person gets it"',
    bestFor:['Opinion & commentary','Email marketing & newsletters','Brand voice content'],
    principle:'Everything is personal. And the personal, stated with enough precision and humor, becomes universal.',
    activationPrompt:`You are writing a conversational, intimately persuasive piece using the Conversational Philosopher voice engine.

KEY PRINCIPLE: Everything is personal. And the personal, stated with enough precision and humor, becomes universal.

STRUCTURE (follow exactly):
1. The small thing — A specific, relatable, slightly ridiculous observation to open.
2. The expansion — Why this small thing is actually about a bigger thing.
3. The list — Enumerate. Be funny. Be specific. Let the third item surprise.
4. The confession — Something personal that earns trust and creates connection.
5. The pivot to insight — Now that the reader is charmed, deliver the real point.
6. The exit line — Short. Perfect. The sentence they'll remember.

PATTERNS (apply throughout):
- Write like you're telling someone at dinner — direct, warm, slightly wicked
- Start with something specific and small; let it expand into something meaningful
- Use lists for rhythm: three items where the third one twists
- Be opinionated; hedging kills this voice
- Keep paragraphs short — if it goes past 4 sentences, break it

HARD PROHIBITIONS:
- Never confuse casual with careless — every "casual" sentence is precisely constructed
- Never overshare; selectivity is what makes the personal universal
- Never bury the insight — this style is direct, not subtle
- Never write long paragraphs
- Never be mean-spirited; the humor is affectionate, even when sharp`
  },
  {
    id:'moral-cartographer',name:'Moral Cartographer',subtitle:'Direct, lyrical moral clarity',
    tone:'Direct, lyrical',idealLength:'1,000–3,000 words',readerFeeling:'"I need to sit with this"',
    bestFor:['Values & culture writing','Leadership communications','DEI and institutional pieces'],
    principle:'Clarity is courage. The sentence that says exactly what it means — with no escape hatch, no ambiguity — is the most powerful tool a writer has.',
    activationPrompt:`You are writing a direct, lyrical, morally clear piece using the Moral Cartographer voice engine.

KEY PRINCIPLE: Clarity is courage. The sentence that says exactly what it means — with no escape hatch, no ambiguity, no comfortable distance — is the most powerful tool a writer has.

STRUCTURE (follow exactly):
1. The personal ground — Start in a specific memory or experience. Be precise.
2. The widening lens — Pull from the personal to the cultural or systemic.
3. The direct statement — Say the thing. No metaphor. No softening.
4. The evidence — Historical, personal, observed. The case builds.
5. The challenge — Address the reader. What does this demand of them?
6. The closing image — Something that lingers. Beauty and truth in the same breath.

PATTERNS (apply throughout):
- Say the thing directly — then say it more beautifully — then say it with consequences
- Use long, clause-heavy sentences when building; short ones when landing the point
- Ground abstract ideas in sensory, physical experience
- Address the reader directly ("you") when the stakes demand it
- Write sentences you'd be proud to see quoted alone

HARD PROHIBITIONS:
- Never preach — show moral reality, do not lecture about it
- Never use anger without precision; emotion without craft is noise
- Never let lyricism obscure meaning — beauty serves clarity, not the reverse
- Never shy from saying something uncomfortable; hedging destroys this voice
- Never write about systems without people inside them`
  },
  {
    id:'gonzo-correspondent',name:'Gonzo Correspondent',subtitle:'First-person immersive chaos journalism',
    tone:'Chaotic, electric',idealLength:'1,500–4,000 words',readerFeeling:'"What did I just read and why can\'t I stop"',
    bestFor:['Industry rants & hot takes','Newsletters with cult personality','Satirical commentary'],
    principle:'Objectivity is a myth. The honest thing is to put yourself in the story, admit your biases, and let the chaos of real experience be the narrative.',
    activationPrompt:`You are writing a first-person, chaotic, electric piece using the Gonzo Correspondent voice engine.

KEY PRINCIPLE: Objectivity is a myth. The honest thing is to put yourself in the story, admit your biases, and let the chaos of real experience be the narrative.

STRUCTURE (follow exactly):
1. In medias res — You're already there. It's already happening. No preamble.
2. The mission — Why are you here? What were you supposed to be doing? (Spoiler: it goes sideways.)
3. The escalation — Things get weirder, faster, more absurd. Lean into it.
4. The observation — In the middle of chaos, a moment of startling clarity about what this means.
5. The dark turn — Beneath the humor, something real and uncomfortable.
6. The exit — Leave before the reader expects it. The ending is abrupt, like waking up.

PATTERNS (apply throughout):
- Put yourself in the scene — your confusion, your frustration, your disbelief
- Use momentum: if the reader can stop, you've lost
- Exaggerate for emotional truth, not for deception
- Mix registers wildly — precision next to slang, poetry next to profanity
- Attack systems and absurdity, not vulnerable people

HARD PROHIBITIONS:
- Never mistake chaos for laziness — the disorder is designed
- Never be cruel to the powerless; always aim up
- Never lose the actual story in stylistic excess
- Never try this voice at half-speed; it requires full commitment
- Never forget that underneath the chaos is a deeply moral perspective`
  }
];

// ═══════════════════════════════════════════════════════════════════════
// DATA: GEO/SEO OPTIMIZATION LAYER
// ═══════════════════════════════════════════════════════════════════════
const GEO_SEO_LAYER = `

GEO & SEO OPTIMIZATION REQUIREMENTS — apply to ALL content:

SEMANTIC STRUCTURE:
- Use H2 headers for major sections, H3 for sub-sections
- Every header must be a complete thought addressable as a standalone question
- Headers should incorporate primary and secondary keywords naturally

OPENING PARAGRAPH (first 100 words are critical for AI citation):
- Answer the core question or deliver core value within the first 100 words
- Include the primary keyword in the first sentence
- Write one "featured snippet" sentence: a direct, complete answer in under 50 words

NAMED FRAMEWORKS:
- Coin at least one memorable concept or framework name per piece
- Bold key terms on first occurrence
- Create vocabulary readers will search for and AI models will cite

QUOTABLE CONTENT:
- Every major section must contain at least one sentence quotable in isolation
- Write pull-quote worthy statements that AI models will excerpt as answers
- All assertions must be specific and verifiable, not vague

SCANNABLE STRUCTURE:
- Use bullet points or numbered lists for any series of 3+ items
- Include at least one comparison or contrast element per piece
- Bold key takeaways throughout to aid skimming

CLOSING ELEMENTS (required in every piece):
- End with a "Key Takeaways" section containing 3-5 bullet points
- Include 2-3 FAQ-style questions with direct answers (under 50 words each)
- Final paragraph should invite action, continued reading, or reflection

META INTENT:
- Write content a language model would excerpt when answering a user's question
- Structure information as if anticipating follow-up questions
- Every paragraph must earn its place by answering something the reader wants to know
`;

// ═══════════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════════
let STATE = {
  page:'wizard',
  sidebarCollapsed:false,
  selectedStyle:'narrative-economist',
  secondaryStyle:'',
  contentType:'Blog Post',
  length:'medium',
  researchMode:'knowledge',
  searchApi:'exa',
  isGenerating:false,
  generatedContent:'',
  generatedTopic:'',
  generatedStyleId:'',
  currentViewId:null,
};
let currentViewId = null;
let customPatternEditId = null;
let editingPattern = null;

// ═══════════════════════════════════════════════════════════════════════
// STORAGE HELPERS
// ═══════════════════════════════════════════════════════════════════════
function getSettings(){try{return JSON.parse(localStorage.getItem('lcs_settings')||'{}')}catch{return{}}}
function saveSettings(s){localStorage.setItem('lcs_settings',JSON.stringify(s))}
function getSavedContent(){try{return JSON.parse(localStorage.getItem('lcs_content')||'[]')}catch{return[]}}
function saveSavedContent(arr){localStorage.setItem('lcs_content',JSON.stringify(arr))}
function getCustomPatterns(){try{return JSON.parse(localStorage.getItem('lcs_custom')||'[]')}catch{return[]}}
function saveCustomPatterns(arr){localStorage.setItem('lcs_custom',JSON.stringify(arr))}
function getNotes(){return localStorage.getItem('lcs_notes')||''}
function saveNotes(txt){localStorage.setItem('lcs_notes',txt)}
function getRoadmap(){try{return JSON.parse(localStorage.getItem('lcs_roadmap')||'[]')}catch{return[]}}
function saveRoadmap(arr){localStorage.setItem('lcs_roadmap',JSON.stringify(arr))}

// ═══════════════════════════════════════════════════════════════════════
// MODELS CONFIG
// ═══════════════════════════════════════════════════════════════════════
const MODELS = {
  anthropic:[
    {label:'Claude Sonnet 4.6',id:'claude-sonnet-4-20250514'},
    {label:'Claude Haiku 4.5',id:'claude-haiku-4-5-20251001'},
  ],
  groq:[
    {label:'Llama 3.1 70B',id:'llama-3.1-70b-versatile'},
    {label:'GPT OSS 120B',id:'llama-3.3-70b-versatile'},
    {label:'Compound Beta',id:'compound-beta'},
  ]
};

const CONTENT_TYPES = ['Blog Post','Article','LinkedIn Post','Twitter Thread','Email','White Paper','Product Description','Press Release'];
const LENGTH_OPTS = [{label:'Short',val:'short',hint:'~500-900 words'},{label:'Medium',val:'medium',hint:'~1000-2000 words'},{label:'Long',val:'long',hint:'~2500-4000 words'}];
const SURPRISE_TOPICS = [
  'The hidden economics of attention in the creator economy',
  'Why your organization\'s biggest bottleneck isn\'t what you think',
  'The counterintuitive truth about productivity in remote teams',
  'What the rise of AI agents means for knowledge workers in 2025',
  'The supply chain lesson hiding in plain sight',
  'Why "best practices" might be holding your industry back',
  'The silent shift happening in how businesses build trust',
  'What three declining industries can teach us about adaptation',
  'The overlooked leverage point in content marketing',
  'Why the most successful companies obsess over boring things',
];

// ═══════════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════════
function nav(page){
  STATE.page = page;
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const pg = document.getElementById(`page-${page}`);
  if(pg) pg.classList.add('active');
  const ni = document.querySelector(`.nav-item[data-page="${page}"]`);
  if(ni) ni.classList.add('active');
  // Render dynamic pages
  if(page==='content') renderContentLibrary();
  if(page==='system-prompts') renderSystemPrompts();
  if(page==='custom-patterns') renderCustomPatterns();
  if(page==='notes') initNotes();
  if(page==='roadmap') renderRoadmap();
  if(page==='geo-seo') renderGeoSeo();
  if(page==='tools') renderTools();
  if(page==='settings') renderSettings();
}

function toggleSidebar(){
  STATE.sidebarCollapsed = !STATE.sidebarCollapsed;
  const sb = document.getElementById('sidebar');
  const mn = document.getElementById('main');
  if(STATE.sidebarCollapsed){
    sb.classList.add('collapsed');
    mn.classList.add('sidebar-collapsed');
  } else {
    sb.classList.remove('collapsed');
    mn.classList.remove('sidebar-collapsed');
  }
}

// ═══════════════════════════════════════════════════════════════════════
// HEADER: PROVIDER / MODEL SELECTS
// ═══════════════════════════════════════════════════════════════════════
function onProviderChange(){
  const provider = document.getElementById('hdr-provider').value;
  const modelSel = document.getElementById('hdr-model');
  modelSel.innerHTML = '';
  (MODELS[provider]||[]).forEach(m=>{
    const o = document.createElement('option');
    o.value=m.id; o.textContent=m.label;
    modelSel.appendChild(o);
  });
}

// ═══════════════════════════════════════════════════════════════════════
// WIZARD: RENDER CONTROLS
// ═══════════════════════════════════════════════════════════════════════
function renderWizard(){
  // Style grid
  const grid = document.getElementById('style-grid');
  grid.innerHTML = '';
  const allStyles = [...WRITING_STYLES, ...getCustomPatterns().map(c=>({...c,isCustom:true}))];
  allStyles.forEach(s=>{
    const div = document.createElement('div');
    div.className = 'style-chip' + (s.id===STATE.selectedStyle?' selected':'');
    div.onclick = ()=>selectStyle(s.id);
    div.innerHTML = `<span class="style-chip-name">${s.name}</span><span class="style-chip-sub">${s.subtitle||''}</span>`;
    grid.appendChild(div);
  });

  // Secondary style select
  const sec = document.getElementById('secondary-style');
  sec.innerHTML = '<option value="">None (Pure single style)</option>';
  allStyles.forEach(s=>{
    const o = document.createElement('option');
    o.value=s.id; o.textContent=s.name;
    if(s.id===STATE.secondaryStyle) o.selected=true;
    sec.appendChild(o);
  });
  sec.onchange = ()=>{STATE.secondaryStyle=sec.value;};

  // Content types
  const cg = document.getElementById('ctype-grid');
  cg.innerHTML = '';
  CONTENT_TYPES.forEach(t=>{
    const b = document.createElement('div');
    b.className = 'ctype-btn' + (t===STATE.contentType?' selected':'');
    b.textContent = t;
    b.onclick = ()=>{ STATE.contentType=t; document.querySelectorAll('.ctype-btn').forEach(x=>x.classList.remove('selected')); b.classList.add('selected'); updateOutputChips(); };
    cg.appendChild(b);
  });

  // Lengths
  const lo = document.getElementById('length-opts');
  lo.innerHTML = '';
  LENGTH_OPTS.forEach(l=>{
    const b = document.createElement('div');
    b.className = 'length-btn' + (l.val===STATE.length?' selected':'');
    b.innerHTML = `<div style="font-weight:600">${l.label}</div><div style="font-size:9px;color:var(--text-faint)">${l.hint}</div>`;
    b.onclick = ()=>{ STATE.length=l.val; document.querySelectorAll('.length-btn').forEach(x=>x.classList.remove('selected')); b.classList.add('selected'); };
    lo.appendChild(b);
  });

  // Research mode
  const modes = [
    {val:'knowledge',label:'AI Knowledge Base',hint:'Generate from AI training data'},
    {val:'web',label:'Web Search',hint:'Search for current information first'},
    {val:'surprise',label:'Surprise Me ✨',hint:'AI picks topic variation & style'},
  ];
  const mo = document.getElementById('mode-options');
  mo.innerHTML = '';
  modes.forEach(m=>{
    const div = document.createElement('div');
    div.className = 'mode-option' + (m.val===STATE.researchMode?' selected':'');
    div.onclick = ()=>{
      STATE.researchMode=m.val;
      document.querySelectorAll('.mode-option').forEach(x=>x.classList.remove('selected'));
      div.classList.add('selected');
      document.getElementById('search-api-section').style.display = m.val==='web'?'block':'none';
    };
    div.innerHTML = `<div>
      <div class="mode-option-label">${m.label}</div>
      <div class="mode-option-hint">${m.hint}</div>
    </div>`;
    mo.appendChild(div);
  });

  // Search APIs
  renderSearchApis();
  updateOutputChips();
}

function renderSearchApis(){
  const s = getSettings();
  const apis = [
    {key:'exa',label:'Exa',hasKey:!!(s.apiKeys?.exa)},
    {key:'tavily',label:'Tavily',hasKey:!!(s.apiKeys?.tavily)},
    {key:'serp',label:'SERP',hasKey:!!(s.apiKeys?.serp)},
  ];
  const row = document.getElementById('search-api-row');
  row.innerHTML = '';
  apis.forEach(a=>{
    const b = document.createElement('div');
    b.className = 'search-api-btn' + (a.key===STATE.searchApi?' selected':'') + (a.hasKey?'':' disabled');
    if(!a.hasKey) b.title='No API key set — add in Settings';
    b.textContent = a.label + (a.hasKey?' ✓':' ✕');
    if(a.hasKey) b.onclick = ()=>{
      STATE.searchApi=a.key;
      document.querySelectorAll('.search-api-btn').forEach(x=>x.classList.remove('selected'));
      b.classList.add('selected');
    };
    row.appendChild(b);
  });
}

function selectStyle(id){
  STATE.selectedStyle = id;
  document.querySelectorAll('.style-chip').forEach(c=>c.classList.remove('selected'));
  const chips = document.querySelectorAll('.style-chip');
  const allStyles = [...WRITING_STYLES, ...getCustomPatterns()];
  const idx = allStyles.findIndex(s=>s.id===id);
  if(chips[idx]) chips[idx].classList.add('selected');
  updateOutputChips();
}

function updateOutputChips(){
  const allStyles = [...WRITING_STYLES,...getCustomPatterns()];
  const s = allStyles.find(x=>x.id===STATE.selectedStyle);
  const sc = document.getElementById('output-style-chip');
  const tc = document.getElementById('output-type-chip');
  if(sc && s) sc.textContent = s.name;
  if(tc) tc.textContent = STATE.contentType;
}

// ═══════════════════════════════════════════════════════════════════════
// GENERATE
// ═══════════════════════════════════════════════════════════════════════
async function triggerGenerate(){
  if(STATE.isGenerating) return;
  const topic = document.getElementById('topic-input')?.value?.trim() || '';
  if(!topic && STATE.researchMode !== 'surprise'){
    showAlert('Enter a topic or brief, or use Surprise Me mode.','error'); return;
  }

  const provider = document.getElementById('hdr-provider').value;
  const model = document.getElementById('hdr-model').value;
  const allStyles = [...WRITING_STYLES,...getCustomPatterns()];
  let styleId = STATE.selectedStyle;
  let usedTopic = topic;

  if(STATE.researchMode==='surprise'||!topic){
    styleId = WRITING_STYLES[Math.floor(Math.random()*WRITING_STYLES.length)].id;
    usedTopic = SURPRISE_TOPICS[Math.floor(Math.random()*SURPRISE_TOPICS.length)];
    document.getElementById('topic-input').value = usedTopic;
  }

  const style = allStyles.find(s=>s.id===styleId)||WRITING_STYLES[0];
  const secondaryStyle = STATE.secondaryStyle ? allStyles.find(s=>s.id===STATE.secondaryStyle) : null;

  setGenerating(true);
  STATE.generatedTopic = usedTopic;
  STATE.generatedStyleId = styleId;

  try {
    let researchContext = '';
    if(STATE.researchMode==='web'){
      try {
        researchContext = await doWebSearch(usedTopic);
      } catch(e){
        console.warn('Web search failed:',e);
        researchContext = '';
      }
    }

    const systemPrompt = buildSystemPrompt(style, secondaryStyle);
    const userMessage = buildUserMessage(usedTopic, researchContext);
    const content = await callAPI(provider, model, systemPrompt, userMessage);

    STATE.generatedContent = content;
    displayOutput(content);
    showAlert('Content generated successfully!','success');
  } catch(e){
    console.error(e);
    showAlert('Generation failed: ' + e.message,'error');
    setGenerating(false);
  }
}

function buildSystemPrompt(style, secondaryStyle){
  let prompt = style.activationPrompt + '\n' + GEO_SEO_LAYER;

  const lengthMap = {short:'approximately 600-900 words',medium:'approximately 1,200-2,000 words',long:'approximately 2,500-4,000 words'};
  const lengthInstruction = `\n\nTARGET LENGTH: Write ${lengthMap[STATE.length]}.`;
  const typeInstruction = `\nCONTENT TYPE: This is a ${STATE.contentType}. Format and tone accordingly.`;

  prompt += lengthInstruction + typeInstruction;

  if(secondaryStyle){
    prompt += `\n\nSECONDARY STYLE MODIFIER: ${secondaryStyle.name}\nLayer these tonal characteristics over the primary structure (do not override the primary structure):\n${secondaryStyle.activationPrompt?.split('STRUCTURE')[0]||''}`;
    prompt += `\n\nCONFLICT RESOLUTION: When primary and secondary styles create tension, defer to the primary engine's structural rules. Use the secondary to influence tone and sentence-level decisions only.`;
  }

  prompt += `\n\nUNIVERSAL PROHIBITIONS:\n- Never reference source authors by name\n- Never open with a thesis statement\n- Never use "in conclusion" or "to summarize"\n- Never write a paragraph longer than 6 sentences without strong reason\n- Never tell the reader what to think; show the situation that produces the thought\n\nOutput the complete piece now. Begin writing immediately — no preamble or commentary about what you're about to write.`;

  return prompt;
}

function buildUserMessage(topic, researchContext){
  let msg = `Topic / Brief: ${topic}`;
  if(researchContext){
    msg += `\n\nResearch Context (use this current information to inform the piece):\n${researchContext}`;
  }
  msg += `\n\nWrite the complete ${STATE.contentType} now.`;
  return msg;
}

// ═══════════════════════════════════════════════════════════════════════
// API CALLS
// ═══════════════════════════════════════════════════════════════════════
async function callAPI(provider, model, systemPrompt, userMessage){
  if(provider==='anthropic'){
    return await callAnthropic(model, systemPrompt, userMessage);
  } else if(provider==='groq'){
    return await callGroq(model, systemPrompt, userMessage);
  }
  throw new Error('Unknown provider: ' + provider);
}

async function callAnthropic(model, systemPrompt, userMessage){
  const res = await fetch('https://api.anthropic.com/v1/messages',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      model,
      max_tokens:4096,
      system:systemPrompt,
      messages:[{role:'user',content:userMessage}]
    })
  });
  if(!res.ok){
    const err = await res.json().catch(()=>({}));
    throw new Error(err.error?.message || `Anthropic API error ${res.status}`);
  }
  const data = await res.json();
  return data.content?.[0]?.text || '';
}

async function callGroq(model, systemPrompt, userMessage){
  const s = getSettings();
  const apiKey = s.apiKeys?.groq;
  if(!apiKey) throw new Error('Groq API key not set. Go to Settings to add it.');

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions',{
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},
    body:JSON.stringify({
      model,
      messages:[
        {role:'system',content:systemPrompt},
        {role:'user',content:userMessage}
      ],
      max_tokens:4096,
      temperature:0.8,
    })
  });
  if(!res.ok){
    const err = await res.json().catch(()=>({}));
    throw new Error(err.error?.message || `Groq API error ${res.status}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

async function doWebSearch(query){
  const s = getSettings();
  const api = STATE.searchApi;

  if(api==='exa' && s.apiKeys?.exa){
    return await searchExa(query, s.apiKeys.exa);
  } else if(api==='tavily' && s.apiKeys?.tavily){
    return await searchTavily(query, s.apiKeys.tavily);
  } else if(api==='serp' && s.apiKeys?.serp){
    return await searchSerp(query, s.apiKeys.serp);
  }
  throw new Error('No search API key configured. Add one in Settings.');
}

async function searchExa(query, apiKey){
  const res = await fetch('https://api.exa.ai/search',{
    method:'POST',
    headers:{'Content-Type':'application/json','x-api-key':apiKey},
    body:JSON.stringify({query,num_results:5,use_autoprompt:true,contents:{text:{max_characters:800}}})
  });
  const data = await res.json();
  return (data.results||[]).map((r,i)=>`[${i+1}] ${r.title}\n${r.url}\n${r.text||''}`).join('\n\n');
}

async function searchTavily(query, apiKey){
  const res = await fetch('https://api.tavily.com/search',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({api_key:apiKey,query,search_depth:'advanced',max_results:5,include_answer:true})
  });
  const data = await res.json();
  const results = (data.results||[]).map((r,i)=>`[${i+1}] ${r.title}\n${r.url}\n${r.content||''}`).join('\n\n');
  return (data.answer ? `Summary: ${data.answer}\n\n` : '') + results;
}

async function searchSerp(query, apiKey){
  const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${apiKey}&num=5`;
  const res = await fetch(url);
  const data = await res.json();
  return (data.organic_results||[]).map((r,i)=>`[${i+1}] ${r.title}\n${r.link}\n${r.snippet||''}`).join('\n\n');
}

// ═══════════════════════════════════════════════════════════════════════
// OUTPUT DISPLAY
// ═══════════════════════════════════════════════════════════════════════
function setGenerating(val){
  STATE.isGenerating = val;
  const btn = document.getElementById('hdr-generate');
  const wbtn = document.getElementById('wiz-generate');
  const outContent = document.getElementById('output-content');

  if(val){
    if(btn){btn.disabled=true;btn.textContent='Generating…';}
    if(wbtn){wbtn.disabled=true;wbtn.textContent='⏳ Generating…';}
    if(outContent){
      outContent.innerHTML = `<div style="padding:40px 32px;text-align:center;">
        <div class="spinner" style="width:28px;height:28px;margin:0 auto 16px;border-width:3px;"></div>
        <div style="font-family:var(--font-display);font-size:17px;color:var(--text-faint);margin-bottom:8px;">Crafting your content…</div>
        <div style="font-size:12px;color:var(--text-faint);" class="generating-indicator">
          Applying style engine and GEO optimization
          <span class="gen-dots"><span>.</span><span>.</span><span>.</span></span>
        </div>
        <div style="width:200px;margin:20px auto 0;" class="pulse-bar"></div>
      </div>`;
      outContent.classList.remove('has-content');
    }
    document.getElementById('btn-copy').style.display='none';
    document.getElementById('btn-save').style.display='none';
    document.getElementById('export-group').style.display='none';
    document.getElementById('word-count-bar').style.display='none';
  } else {
    if(btn){btn.disabled=false;btn.textContent='⚡ Generate';}
    if(wbtn){wbtn.disabled=false;wbtn.textContent='⚡ Generate Content';}
  }
}

function displayOutput(markdown){
  setGenerating(false);
  const outContent = document.getElementById('output-content');
  outContent.innerHTML = markdownToHtml(markdown);
  outContent.classList.add('has-content');
  outContent.style.padding='28px 32px';
  document.getElementById('btn-copy').style.display='';
  document.getElementById('btn-save').style.display='';
  document.getElementById('export-group').style.display='';

  const wc = markdown.split(/\s+/).filter(Boolean).length;
  const wbar = document.getElementById('word-count-bar');
  wbar.style.display='';
  wbar.textContent = `${wc.toLocaleString()} words · ${STATE.contentType} · ${STATE.selectedStyle}`;
}

function markdownToHtml(md){
  if(!md) return '';
  let html = md
    .replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>')
    .replace(/^#### (.+)$/gm,'<h4>$1</h4>')
    .replace(/^### (.+)$/gm,'<h3>$1</h3>')
    .replace(/^## (.+)$/gm,'<h2>$1</h2>')
    .replace(/^# (.+)$/gm,'<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/`(.+?)`/g,'<code>$1</code>')
    .replace(/^---+$/gm,'<hr>')
    .replace(/^\> (.+)$/gm,'<blockquote>$1</blockquote>')
    .replace(/^\s*[-*+] (.+)$/gm,'<li>$1</li>')
    .replace(/^\s*\d+\. (.+)$/gm,'<li>$1</li>');

  html = html.replace(/<\/li>\n<li>/g,'</li><li>');
  html = html.replace(/(<li>.*?<\/li>(\n<li>.*?<\/li>)*)/gs, m=>`<ul>${m}</ul>`);

  const blocks = html.split(/\n\n+/);
  return blocks.map(b=>{
    b = b.trim();
    if(!b) return '';
    if(/^<(h[1-4]|ul|ol|blockquote|hr|pre)/.test(b)) return b;
    return `<p>${b.replace(/\n/g,'<br>')}</p>`;
  }).filter(Boolean).join('\n');
}

// ═══════════════════════════════════════════════════════════════════════
// COPY / SAVE / EXPORT
// ═══════════════════════════════════════════════════════════════════════
function copyOutput(){
  navigator.clipboard.writeText(STATE.generatedContent).then(()=>showAlert('Copied to clipboard!','success'));
}

function saveContent(){
  if(!STATE.generatedContent){showAlert('Nothing to save yet.','error');return;}
  const arr = getSavedContent();
  const title = STATE.generatedTopic.slice(0,80) || 'Untitled';
  const id = 'c_'+Date.now();
  arr.unshift({id,title,style:STATE.generatedStyleId,contentType:STATE.contentType,content:STATE.generatedContent,saved:new Date().toISOString()});
  saveSavedContent(arr);
  showAlert('Content saved!','success');
}

function exportContent(fmt){
  if(!fmt||!STATE.generatedContent) return;
  downloadContent(fmt, STATE.generatedContent, STATE.generatedTopic||'content');
  document.getElementById('export-format').value='';
}

function downloadContent(fmt, markdown, title){
  let text='', mime='', ext='';
  const safe = title.replace(/[^a-z0-9]/gi,'-').toLowerCase().slice(0,50);

  if(fmt==='md'){
    text=markdown; mime='text/markdown'; ext='md';
  } else if(fmt==='html'){
    text=`<!DOCTYPE html>\n<html lang="en">\n<head><meta charset="UTF-8"><title>${title}</title>\n<style>body{max-width:800px;margin:40px auto;font-family:Georgia,serif;line-height:1.8;color:#1a1a1a;padding:0 20px;}h1,h2,h3{font-family:Georgia,serif;}h2{border-bottom:1px solid #eee;padding-bottom:8px;}blockquote{border-left:3px solid #ccc;padding:10px 20px;color:#555;margin:20px 0;background:#f9f9f9;}code{background:#f4f4f4;padding:2px 6px;border-radius:3px;}</style>\n</head>\n<body>\n${markdownToHtml(markdown)}\n</body>\n</html>`;
    mime='text/html'; ext='html';
  } else if(fmt==='json'){
    text=JSON.stringify({title,style:STATE.generatedStyleId,contentType:STATE.contentType,content:markdown,exported:new Date().toISOString()},null,2);
    mime='application/json'; ext='json';
  }

  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([text],{type:mime}));
  a.download=`${safe||'content'}.${ext}`;
  a.click();
}

function exportSingle(fmt){
  if(!currentViewId) return;
  const arr = getSavedContent();
  const item = arr.find(x=>x.id===currentViewId);
  if(!item) return;
  STATE.generatedStyleId=item.style;
  STATE.contentType=item.contentType;
  downloadContent(fmt,item.content,item.title);
}

// ═══════════════════════════════════════════════════════════════════════
// CONTENT LIBRARY
// ═══════════════════════════════════════════════════════════════════════
function renderContentLibrary(){
  const q = document.getElementById('content-search')?.value?.toLowerCase()||'';
  const arr = getSavedContent().filter(c=>!q||c.title.toLowerCase().includes(q)||c.content.toLowerCase().includes(q));
  const el = document.getElementById('content-library');

  document.getElementById('btn-clear-all').style.display = arr.length?'':'none';

  if(!arr.length){
    el.innerHTML=`<div class="lib-empty"><div class="lib-empty-icon">📭</div><div style="font-family:var(--font-display);font-size:18px;color:var(--text-faint);margin-bottom:8px;">No content yet</div><div style="font-size:13px;color:var(--text-faint);">Generate and save content from the Content Wizard.</div></div>`;
    return;
  }

  el.innerHTML = arr.map(c=>{
    const date = new Date(c.saved).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
    const style = WRITING_STYLES.find(s=>s.id===c.style);
    const wc = c.content.split(/\s+/).length;
    const preview = c.content.replace(/[#*`]/g,'').slice(0,160);
    return `<div class="lib-item" onclick="viewContent('${c.id}')">
      <div class="flex-between mb-4">
        <div class="lib-item-title">${escHtml(c.title)}</div>
        <div style="display:flex;gap:6px;flex-shrink:0;">
          <span class="chip chip-teal">${escHtml(c.contentType||'')}</span>
          ${style?`<span class="chip chip-gold">${escHtml(style.name)}</span>`:''}
        </div>
      </div>
      <div class="lib-item-meta">${date} · ${wc} words</div>
      <div class="lib-item-preview">${escHtml(preview)}…</div>
    </div>`;
  }).join('');
}

function viewContent(id){
  currentViewId = id;
  const arr = getSavedContent();
  const item = arr.find(x=>x.id===id);
  if(!item) return;
  document.getElementById('vcm-title').textContent = item.title;
  const date = new Date(item.saved).toLocaleDateString();
  const style = WRITING_STYLES.find(s=>s.id===item.style);
  document.getElementById('vcm-meta').textContent = `${date} · ${item.contentType||''} · ${style?.name||item.style}`;
  document.getElementById('vcm-body').innerHTML = markdownToHtml(item.content);
  openModal('view-content-modal');
}

function deleteContent(id){
  if(!id) return;
  const arr = getSavedContent().filter(x=>x.id!==id);
  saveSavedContent(arr);
  closeModal('view-content-modal');
  renderContentLibrary();
  showAlert('Content deleted.','info');
}

function clearAllContent(){
  if(!confirm('Delete all saved content? This cannot be undone.')) return;
  saveSavedContent([]);
  renderContentLibrary();
}

function loadToWizard(){
  if(!currentViewId) return;
  const arr = getSavedContent();
  const item = arr.find(x=>x.id===currentViewId);
  if(!item) return;
  closeModal('view-content-modal');
  nav('wizard');
  document.getElementById('topic-input').value = item.title;
  STATE.generatedContent = item.content;
  STATE.generatedTopic = item.title;
  STATE.generatedStyleId = item.style;
  selectStyle(item.style);
  displayOutput(item.content);
}

// ═══════════════════════════════════════════════════════════════════════
// SYSTEM PROMPTS
// ═══════════════════════════════════════════════════════════════════════
function renderSystemPrompts(){
  const el = document.getElementById('system-prompts-list');
  el.innerHTML = WRITING_STYLES.map((s,i)=>`
    <div class="style-profile-card">
      <div class="style-profile-num">${String(i+1).padStart(2,'0')} / 10</div>
      <div class="style-profile-title">${s.name}</div>
      <div class="style-profile-sub">${s.subtitle}</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px;">
        <span class="chip chip-gold">${s.tone}</span>
        <span class="chip chip-teal">${s.idealLength}</span>
        <span class="chip chip-blue">${s.readerFeeling}</span>
      </div>
      <div class="style-principle">${s.principle}</div>
      <div style="font-family:var(--font-mono);font-size:10px;font-weight:600;color:var(--teal);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:8px;">Full Activation Prompt</div>
      <div class="prompt-block" style="font-size:11px;white-space:pre-wrap;line-height:1.65;max-height:200px;overflow-y:auto;">${escHtml(s.activationPrompt)}
      </div>
      <div style="margin-top:10px;display:flex;gap:8px;">
        <button class="header-btn btn-secondary btn-sm" onclick="copyPrompt('${s.id}')">Copy Prompt</button>
        <button class="header-btn btn-teal btn-sm" onclick="useStyle('${s.id}')">Use This Style</button>
        <button class="header-btn btn-secondary btn-sm" onclick="forkStyle('${s.id}')">Fork to Custom</button>
      </div>
    </div>
  `).join('');
}

function copyPrompt(id){
  const s = WRITING_STYLES.find(x=>x.id===id);
  if(s) navigator.clipboard.writeText(s.activationPrompt+'\n'+GEO_SEO_LAYER).then(()=>showAlert('Prompt copied!','success'));
}

function useStyle(id){
  selectStyle(id);
  nav('wizard');
  showAlert('Style loaded in Content Wizard.','success');
}

function forkStyle(id){
  const s = WRITING_STYLES.find(x=>x.id===id);
  if(!s) return;
  openCustomPatternModal();
  setTimeout(()=>{
    document.getElementById('cpm-name').value = s.name + ' (Custom)';
    document.getElementById('cpm-sub').value = s.subtitle;
    document.getElementById('cpm-prompt').value = s.activationPrompt;
    document.getElementById('cpm-bestfor').value = (s.bestFor||[]).join(', ');
  },50);
}

// ═══════════════════════════════════════════════════════════════════════
// CUSTOM PATTERNS
// ═══════════════════════════════════════════════════════════════════════
function renderCustomPatterns(){
  const arr = getCustomPatterns();
  const el = document.getElementById('custom-patterns-list');
  if(!arr.length){
    el.innerHTML=`<div class="lib-empty"><div class="lib-empty-icon">✏</div><div style="font-family:var(--font-display);font-size:18px;color:var(--text-faint);margin-bottom:8px;">No custom patterns yet</div><div style="font-size:13px;color:var(--text-faint);">Create your own writing styles or fork built-in ones.</div></div>`;
    return;
  }
  el.innerHTML = arr.map((p,i)=>`
    <div class="card" style="position:relative;">
      <div class="flex-between mb-8">
        <div>
          <div class="card-title">${escHtml(p.name)}</div>
          <div class="card-meta">${escHtml(p.subtitle||'')}</div>
        </div>
        <div style="display:flex;gap:6px;">
          <button class="header-btn btn-secondary btn-sm" onclick="editCustomPattern(${i})">Edit</button>
          <button class="header-btn btn-teal btn-sm" onclick="useCustomStyle('${p.id}')">Use</button>
          <button class="header-btn btn-danger btn-sm" onclick="deleteCustomPattern(${i})">Delete</button>
        </div>
      </div>
      ${p.bestFor?`<div style="font-size:12px;color:var(--text-faint);">Best for: ${escHtml(p.bestFor)}</div>`:''}
      <div class="prompt-block" style="margin-top:12px;font-size:11px;max-height:120px;overflow-y:auto;white-space:pre-wrap;">${escHtml((p.activationPrompt||'').slice(0,400))}${(p.activationPrompt||'').length>400?'…':''}</div>
    </div>
  `).join('');
}

function openCustomPatternModal(edit=false){
  if(!edit){
    customPatternEditId=null;
    document.getElementById('cpm-title').textContent='New Custom Pattern';
    document.getElementById('cpm-name').value='';
    document.getElementById('cpm-sub').value='';
    document.getElementById('cpm-prompt').value='';
    document.getElementById('cpm-bestfor').value='';
  }
  openModal('custom-pattern-modal');
}

function editCustomPattern(idx){
  const arr = getCustomPatterns();
  const p = arr[idx];
  if(!p) return;
  customPatternEditId=idx;
  document.getElementById('cpm-title').textContent='Edit Custom Pattern';
  document.getElementById('cpm-name').value=p.name||'';
  document.getElementById('cpm-sub').value=p.subtitle||'';
  document.getElementById('cpm-prompt').value=p.activationPrompt||'';
  document.getElementById('cpm-bestfor').value=p.bestFor||'';
  openModal('custom-pattern-modal');
}

function saveCustomPattern(){
  const name = document.getElementById('cpm-name').value.trim();
  const sub = document.getElementById('cpm-sub').value.trim();
  const prompt = document.getElementById('cpm-prompt').value.trim();
  const bestFor = document.getElementById('cpm-bestfor').value.trim();
  if(!name||!prompt){showAlert('Name and prompt are required.','error');return;}

  const arr = getCustomPatterns();
  const pattern = {id:'custom_'+Date.now(),name,subtitle:sub,activationPrompt:prompt,bestFor,isCustom:true};

  if(customPatternEditId!==null){
    pattern.id = arr[customPatternEditId].id;
    arr[customPatternEditId]=pattern;
  } else {
    arr.push(pattern);
  }

  saveCustomPatterns(arr);
  closeModal('custom-pattern-modal');
  renderCustomPatterns();
  // Re-render wizard style grid
  renderWizard();
  showAlert('Pattern saved!','success');
}

function deleteCustomPattern(idx){
  if(!confirm('Delete this custom pattern?')) return;
  const arr = getCustomPatterns();
  arr.splice(idx,1);
  saveCustomPatterns(arr);
  renderCustomPatterns();
}

function useCustomStyle(id){
  STATE.selectedStyle=id;
  nav('wizard');
  renderWizard();
  selectStyle(id);
}

// ═══════════════════════════════════════════════════════════════════════
// NOTES
// ═══════════════════════════════════════════════════════════════════════
function initNotes(){
  const ed = document.getElementById('notes-editor');
  ed.value = getNotes();
  let timer;
  ed.oninput = ()=>{
    clearTimeout(timer);
    document.getElementById('notes-saved').textContent='Saving…';
    timer=setTimeout(()=>{saveNotes(ed.value);document.getElementById('notes-saved').textContent='Saved';},600);
  };
}

function clearNotes(){
  if(!confirm('Clear all notes?')) return;
  document.getElementById('notes-editor').value='';
  saveNotes('');
}

// ═══════════════════════════════════════════════════════════════════════
// ROADMAP
// ═══════════════════════════════════════════════════════════════════════
function renderRoadmap(){
  const arr = getRoadmap();
  const el = document.getElementById('roadmap-list');
  if(!arr.length){
    el.innerHTML=`<div class="lib-empty"><div class="lib-empty-icon">🗺</div><div style="font-family:var(--font-display);font-size:18px;color:var(--text-faint);margin-bottom:8px;">Your roadmap is empty</div><div style="font-size:13px;color:var(--text-faint);">Add content ideas above to start building your pipeline.</div></div>`;
    return;
  }
  const priorMap={high:'🔴',med:'🟡',low:'🟢'};
  el.innerHTML = arr.map((item,i)=>`
    <div class="roadmap-item">
      <div class="roadmap-item-check ${item.done?'done':''}" onclick="toggleRoadmapItem(${i})"></div>
      <div class="roadmap-item-body">
        <div class="roadmap-item-title ${item.done?'done':''}">${escHtml(item.title)}</div>
        <div class="roadmap-item-meta">
          <span class="chip chip-blue">${escHtml(item.type)}</span>
          <span>${priorMap[item.priority]||'🟡'} ${item.priority||'med'}</span>
          <span>${new Date(item.created).toLocaleDateString()}</span>
        </div>
      </div>
      <div class="roadmap-item-del" onclick="deleteRoadmapItem(${i})" title="Delete">✕</div>
    </div>
  `).join('');
}

function addRoadmapItem(){
  const title = document.getElementById('rm-title').value.trim();
  if(!title){showAlert('Enter a title first.','error');return;}
  const arr = getRoadmap();
  arr.unshift({title,type:document.getElementById('rm-type').value,priority:document.getElementById('rm-priority').value,done:false,created:new Date().toISOString()});
  saveRoadmap(arr);
  document.getElementById('rm-title').value='';
  renderRoadmap();
}

function toggleRoadmapItem(i){
  const arr = getRoadmap();
  if(arr[i]) arr[i].done=!arr[i].done;
  saveRoadmap(arr); renderRoadmap();
}

function deleteRoadmapItem(i){
  const arr = getRoadmap();
  arr.splice(i,1);
  saveRoadmap(arr); renderRoadmap();
}

// ═══════════════════════════════════════════════════════════════════════
// GEO/SEO GUIDELINES (rendered reference page)
// ═══════════════════════════════════════════════════════════════════════
function renderGeoSeo(){
  document.getElementById('geo-seo-content').innerHTML = `
    <div class="callout callout-gold">
      <div class="callout-label">Core Principle</div>
      GEO (Generative Engine Optimization) and SEO work on the same foundation: <strong>structured, authoritative, quotable content that directly answers questions.</strong> Every piece generated by LeverageContent Studio has this layer built in.
    </div>

    <div class="ref-section">
      <h3>The 7 Pillars of AI-Optimized Content</h3>
      <ul class="ref-list">
        <li><strong>Semantic Structure:</strong> H2/H3 headers that function as standalone questions. AI models index by section intent, not just keywords.</li>
        <li><strong>First-100-Word Authority:</strong> The opening paragraph delivers the core answer before anything else. AI models excerpt this for featured answers.</li>
        <li><strong>Named Frameworks:</strong> Coined concepts and named methodologies get cited. "The Leverage Method" outperforms "a method for…" every time.</li>
        <li><strong>Quotable Sentences:</strong> Every major section contains at least one sentence that stands alone as a complete, citable answer.</li>
        <li><strong>Scannable Structure:</strong> Bullet points, numbered lists, and bold terms for readers scanning — and models parsing.</li>
        <li><strong>FAQ Architecture:</strong> 2-3 explicit Q&A pairs per piece. These become featured snippets and AI answer candidates.</li>
        <li><strong>Key Takeaways:</strong> A closing summary section with 3-5 bullets. Models reference summaries disproportionately.</li>
      </ul>
    </div>

    <div class="ref-section">
      <h3>Style Selection Matrix</h3>
      <table class="ref-table">
        <thead><tr><th>Style</th><th>Tone</th><th>Ideal Length</th><th>Reader Feeling</th><th>Use When…</th></tr></thead>
        <tbody>
          ${WRITING_STYLES.map(s=>`<tr>
            <td><strong>${s.name}</strong></td><td>${s.tone}</td><td>${s.idealLength}</td>
            <td><em>${s.readerFeeling}</em></td>
            <td>${(s.bestFor||[]).join(', ')}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>

    <div class="ref-section">
      <h3>The Synthesis Workflow (6 Steps)</h3>
      <ol class="ref-list" style="list-style:decimal;padding-left:20px;">
        <li style="display:list-item;"><strong>Select the Engine.</strong> Match content type, desired reader emotion, and target length to the right style profile.</li>
        <li style="display:list-item;"><strong>Load the Structural Template.</strong> The architecture goes in first, before any content brief.</li>
        <li style="display:list-item;"><strong>Inject Patterns as Direct Instructions.</strong> Rewrite each pattern as an imperative.</li>
        <li style="display:list-item;"><strong>Feed Do's as a Self-Check Routine.</strong> After each section, verify against the checklist.</li>
        <li style="display:list-item;"><strong>Encode Don'ts as Hard Constraints.</strong> Frame prohibitions absolutely — "never" not "try to avoid."</li>
        <li style="display:list-item;"><strong>Edit with the Key Principle as Your Lens.</strong> Every paragraph serves the principle or gets cut.</li>
      </ol>
    </div>

    <div class="callout callout-teal">
      <div class="callout-label">The Final Test</div>
      Read the output aloud. If it sounds like an impression of a known author, revise against the Don'ts list. If it sounds like a voice you'd want to read more of — without being able to name the source — you've synthesized successfully.
    </div>

    <div class="ref-section">
      <h3>Style Combination Pairs</h3>
      <p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">Advanced technique — blend styles in the wizard using the Secondary Style selector:</p>
      <ul class="ref-list">
        <li><strong>Narrative Economist + Pattern Detective</strong> → Business storytelling with counterintuitive insight</li>
        <li><strong>Curious Empiricist + Conversational Philosopher</strong> → Accessible tech with warmth and personality</li>
        <li><strong>Extreme Correspondent + Moral Cartographer</strong> → High-stakes reporting with moral clarity</li>
        <li><strong>Structural Geologist + Footnote Maximalist</strong> → Obsessive deep-dives with self-aware commentary</li>
        <li><strong>Essayist-Witness + Gonzo Correspondent</strong> → Cool observation that erupts into chaos</li>
      </ul>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════════════════
// TOOLS & DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════
function renderTools(){
  document.getElementById('tools-content').innerHTML = `
    <div class="ref-section">
      <h3>Web Search Integrations</h3>
      <p style="font-size:13px;color:var(--text-muted);">Enable real-time research by adding API keys in Settings. Select your preferred search API in the Content Wizard when "Web Search" mode is active.</p>
      <table class="ref-table">
        <thead><tr><th>API</th><th>Best For</th><th>Pricing</th><th>Get Key</th></tr></thead>
        <tbody>
          <tr><td><strong>Exa</strong></td><td>Semantic search, research-quality results, neural retrieval</td><td>Free tier available</td><td><a href="https://exa.ai" target="_blank" style="color:var(--gold)">exa.ai</a></td></tr>
          <tr><td><strong>Tavily</strong></td><td>AI-optimized search with built-in answer synthesis</td><td>Free tier available</td><td><a href="https://tavily.com" target="_blank" style="color:var(--gold)">tavily.com</a></td></tr>
          <tr><td><strong>SERP API</strong></td><td>Google search results, news, shopping, local</td><td>Pay-per-search</td><td><a href="https://serpapi.com" target="_blank" style="color:var(--gold)">serpapi.com</a></td></tr>
        </tbody>
      </table>
    </div>

    <div class="ref-section">
      <h3>AI Model Reference</h3>
      <table class="ref-table">
        <thead><tr><th>Provider</th><th>Model</th><th>Best For</th><th>Speed</th></tr></thead>
        <tbody>
          <tr><td><strong>Anthropic</strong></td><td>Claude Sonnet 4.6</td><td>Premium long-form, complex reasoning, nuanced style adherence</td><td>Medium</td></tr>
          <tr><td><strong>Anthropic</strong></td><td>Claude Haiku 4.5</td><td>Fast drafts, short-form, iteration</td><td>Fast</td></tr>
          <tr><td><strong>Groq</strong></td><td>Llama 3.1 70B</td><td>Open source, fast, reliable long-form</td><td>Very Fast</td></tr>
          <tr><td><strong>Groq</strong></td><td>GPT OSS 120B</td><td>Highest capability OSS model for nuanced writing</td><td>Fast</td></tr>
          <tr><td><strong>Groq</strong></td><td>Compound Beta</td><td>Experimental, tool-use and research tasks</td><td>Fast</td></tr>
        </tbody>
      </table>
    </div>

    <div class="ref-section">
      <h3>Key Terminology</h3>
      <ul class="ref-list">
        <li><strong>GEO (Generative Engine Optimization):</strong> Structuring content to be cited and excerpted by AI systems like ChatGPT, Perplexity, and Claude when answering user queries.</li>
        <li><strong>Voice Engine:</strong> The LeverageContent term for a complete writing style system — structural template + patterns + do's/don'ts + activation prompt.</li>
        <li><strong>Activation Prompt:</strong> The full system-level instructions that unlock a specific writing style in the AI. Paste into any AI's system prompt.</li>
        <li><strong>Featured Snippet:</strong> The boxed answer at the top of Google results; writing for featured snippets also optimizes for AI citations.</li>
        <li><strong>Semantic Structure:</strong> Using headers, lists, and clear section boundaries so that both search engines and AI models can parse the content's hierarchy.</li>
        <li><strong>Style Synthesis:</strong> Using the structural machinery of a writing tradition without directly imitating any specific author — the engine, not the brand.</li>
        <li><strong>Content Wizard:</strong> The main generation workflow in LeverageContent Studio combining provider, model, style, topic, and research mode selections.</li>
        <li><strong>Dual-Style Combination:</strong> Loading a primary style engine for structure + a secondary style for tonal modification. The primary always wins on architecture.</li>
      </ul>
    </div>

    <div class="callout callout-blue">
      <div class="callout-label">Pro Tip</div>
      For multi-session content pipelines, save your complete system prompt (style engine + GEO layer + content brief) as a Custom Pattern. AI models have no memory between sessions — the voice engine must be reloaded each time. Treat your activation prompt as part of the deliverable.
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════════════════
function renderSettings(){
  const s = getSettings();
  const keys = s.apiKeys||{};

  document.getElementById('settings-content').innerHTML = `
    <div class="settings-section">
      <div class="settings-section-title">Anthropic API</div>
      <div class="callout callout-teal" style="margin-bottom:16px;"><div class="callout-label">Note</div>When using LeverageContent Studio on claude.ai, Anthropic API calls work automatically — no key needed. An API key is only required for direct API access outside this platform.</div>
      <div class="form-group">
        <label class="form-label">Anthropic API Key (optional on claude.ai)</label>
        <div class="input-group">
          <input class="form-input" id="key-anthropic" type="password" placeholder="sk-ant-…" value="${keys.anthropic||''}">
          <button class="header-btn btn-secondary" onclick="saveKey('anthropic')">Save</button>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">Groq API <span class="key-status ${keys.groq?'key-set':'key-missing'}">${keys.groq?'✓ Set':'✕ Not set'}</span></div>
      <div class="callout callout-gold" style="margin-bottom:16px;"><div class="callout-label">Required for Groq</div>Groq models require your API key. Get one free at <a href="https://console.groq.com" target="_blank">console.groq.com</a>. Groq models only function after the artifact is published.</div>
      <div class="form-group">
        <label class="form-label">Groq API Key</label>
        <div class="input-group">
          <input class="form-input" id="key-groq" type="password" placeholder="gsk_…" value="${keys.groq||''}">
          <button class="header-btn btn-secondary" onclick="saveKey('groq')">Save</button>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">Web Search APIs</div>
      <p style="font-size:12px;color:var(--text-faint);margin-bottom:14px;">Add at least one search API key to enable the Web Search research mode in the Content Wizard.</p>

      <div class="form-group">
        <label class="form-label">Exa API Key <span class="key-status ${keys.exa?'key-set':'key-missing'}">${keys.exa?'✓ Set':'✕ Not set'}</span></label>
        <div class="input-group">
          <input class="form-input" id="key-exa" type="password" placeholder="Exa API key" value="${keys.exa||''}">
          <button class="header-btn btn-secondary" onclick="saveKey('exa')">Save</button>
        </div>
        <div class="form-hint">Get at <a href="https://exa.ai" target="_blank" style="color:var(--gold)">exa.ai</a></div>
      </div>

      <div class="form-group">
        <label class="form-label">Tavily API Key <span class="key-status ${keys.tavily?'key-set':'key-missing'}">${keys.tavily?'✓ Set':'✕ Not set'}</span></label>
        <div class="input-group">
          <input class="form-input" id="key-tavily" type="password" placeholder="tvly-…" value="${keys.tavily||''}">
          <button class="header-btn btn-secondary" onclick="saveKey('tavily')">Save</button>
        </div>
        <div class="form-hint">Get at <a href="https://tavily.com" target="_blank" style="color:var(--gold)">tavily.com</a></div>
      </div>

      <div class="form-group">
        <label class="form-label">SERP API Key <span class="key-status ${keys.serp?'key-set':'key-missing'}">${keys.serp?'✓ Set':'✕ Not set'}</span></label>
        <div class="input-group">
          <input class="form-input" id="key-serp" type="password" placeholder="SERP API key" value="${keys.serp||''}">
          <button class="header-btn btn-secondary" onclick="saveKey('serp')">Save</button>
        </div>
        <div class="form-hint">Get at <a href="https://serpapi.com" target="_blank" style="color:var(--gold)">serpapi.com</a></div>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">Groq Model IDs</div>
      <p style="font-size:12px;color:var(--text-faint);margin-bottom:14px;">Update if Groq model IDs change. Find current IDs at <a href="https://console.groq.com/docs/models" target="_blank" style="color:var(--gold)">console.groq.com/docs/models</a></p>
      ${MODELS.groq.map(m=>`
        <div class="form-group">
          <label class="form-label">${m.label}</label>
          <input class="form-input" id="mid-${m.id}" value="${m.id}" onblur="updateModelId('groq','${m.label}',this.value)" style="font-family:var(--font-mono);font-size:12px;">
        </div>
      `).join('')}
    </div>

    <div class="settings-section">
      <div class="settings-section-title">Data & Privacy</div>
      <p style="font-size:13px;color:var(--text-muted);margin-bottom:14px;">All data (API keys, content, notes, settings) is stored exclusively in your browser's localStorage. Nothing is sent to any server except the AI APIs you use directly.</p>
      <button class="header-btn btn-danger" onclick="clearAllData()">⚠ Clear All Local Data</button>
    </div>
  `;
}

function saveKey(service){
  const val = document.getElementById(`key-${service}`)?.value?.trim();
  const s = getSettings();
  if(!s.apiKeys) s.apiKeys={};
  if(val) s.apiKeys[service]=val;
  else delete s.apiKeys[service];
  saveSettings(s);
  showAlert(`${service.charAt(0).toUpperCase()+service.slice(1)} key ${val?'saved':'removed'}.`,'success');
  setTimeout(()=>renderSettings(),300);
}

function clearAllData(){
  if(!confirm('This will delete ALL saved content, notes, roadmap items, custom patterns, and API keys. Are you sure?')) return;
  localStorage.clear();
  showAlert('All data cleared.','info');
  setTimeout(()=>location.reload(),800);
}

// ═══════════════════════════════════════════════════════════════════════
// WIZARD SURPRISE ME
// ═══════════════════════════════════════════════════════════════════════
function wizardRandom(){
  const s = WRITING_STYLES[Math.floor(Math.random()*WRITING_STYLES.length)];
  const t = SURPRISE_TOPICS[Math.floor(Math.random()*SURPRISE_TOPICS.length)];
  selectStyle(s.id);
  document.getElementById('topic-input').value=t;
  STATE.researchMode='knowledge';
  document.querySelectorAll('.mode-option').forEach((el,i)=>i===0?el.classList.add('selected'):el.classList.remove('selected'));
  showAlert(`Style: ${s.name} · Topic randomized 🎲`,'info');
}

// ═══════════════════════════════════════════════════════════════════════
// MODAL HELPERS
// ═══════════════════════════════════════════════════════════════════════
function openModal(id){document.getElementById(id)?.classList.add('open');}
function closeModal(id){document.getElementById(id)?.classList.remove('open');}

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(el=>{
  el.addEventListener('click',e=>{if(e.target===el) el.classList.remove('open');});
});

// ═══════════════════════════════════════════════════════════════════════
// ALERT
// ═══════════════════════════════════════════════════════════════════════
let alertTimer;
function showAlert(msg, type='info'){
  clearTimeout(alertTimer);
  let el = document.getElementById('global-alert');
  if(!el){el=document.createElement('div');el.id='global-alert';document.body.appendChild(el);}
  el.className=`alert alert-${type}`;
  el.innerHTML=`<span>${type==='success'?'✓':type==='error'?'✕':'ℹ'}</span> ${escHtml(msg)}`;
  el.style.display='flex';
  alertTimer=setTimeout(()=>{el.style.display='none';},3500);
}

// ═══════════════════════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════════════════════
function escHtml(str){return String(str||'').replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>').replace(/"/g,'"');}

// ═══════════════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════════════
function init(){
  // Populate provider/model dropdowns
  onProviderChange();
  // Render wizard
  renderWizard();
  // Handle Escape key for modals
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape') document.querySelectorAll('.modal-overlay.open').forEach(m=>m.classList.remove('open'));
  });
}

document.addEventListener('DOMContentLoaded', init);
</script>

</body>
</html>
