globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_P2T-B9sK.mjs";
import { d as reactExports, c as renderComponent, r as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from "./worker-entry_D9jsJv2k.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_5CMa3oI8.mjs";
import { b as createLucideIcon, j as jsxRuntimeExports, s as siteConfig } from "./createLucideIcon_DZRUm3Z8.mjs";
const Pause = createLucideIcon("Pause", [
  ["rect", { x: "14", y: "4", width: "4", height: "16", rx: "1", key: "zuxfzm" }],
  ["rect", { x: "6", y: "4", width: "4", height: "16", rx: "1", key: "1okwgv" }]
]);
const Play = createLucideIcon("Play", [
  ["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]
]);
const Volume2 = createLucideIcon("Volume2", [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      key: "uqj9uw"
    }
  ],
  ["path", { d: "M16 9a5 5 0 0 1 0 6", key: "1q6k2b" }],
  ["path", { d: "M19.364 18.364a9 9 0 0 0 0-12.728", key: "ijwkga" }]
]);
const VolumeX = createLucideIcon("VolumeX", [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      key: "uqj9uw"
    }
  ],
  ["line", { x1: "22", x2: "16", y1: "9", y2: "15", key: "1ewh16" }],
  ["line", { x1: "16", x2: "22", y1: "9", y2: "15", key: "5ykzw1" }]
]);
function formatTime(seconds) {
  if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
function MediaPlayer({ tracks }) {
  const [currentTrack, setCurrentTrack] = reactExports.useState(0);
  const [isPlaying, setIsPlaying] = reactExports.useState(false);
  const [currentTime, setCurrentTime] = reactExports.useState(0);
  const [duration, setDuration] = reactExports.useState(0);
  const [volume, setVolume] = reactExports.useState(0.8);
  const [muted, setMuted] = reactExports.useState(false);
  const audioRef = reactExports.useRef(null);
  const track = tracks[currentTrack];
  reactExports.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : volume;
  }, [volume, muted]);
  reactExports.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    setCurrentTime(0);
    setDuration(0);
    if (isPlaying) audio.play().catch(() => {
    });
  }, [currentTrack]);
  function handleTimeUpdate() {
    const audio = audioRef.current;
    if (audio) setCurrentTime(audio.currentTime);
  }
  function handleLoadedMetadata() {
    const audio = audioRef.current;
    if (audio) setDuration(audio.duration);
  }
  function handleEnded() {
    if (currentTrack < tracks.length - 1) {
      setCurrentTrack((i) => i + 1);
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
      const audio = audioRef.current;
      if (audio) audio.currentTime = 0;
    }
  }
  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {
      });
      setIsPlaying(true);
    }
  }
  function handleSeek(e) {
    const audio = audioRef.current;
    const t = parseFloat(e.target.value);
    if (audio) audio.currentTime = t;
    setCurrentTime(t);
  }
  function handleVolumeChange(e) {
    setVolume(parseFloat(e.target.value));
    setMuted(false);
  }
  function toggleMute() {
    setMuted((m) => !m);
  }
  const progress = duration > 0 ? currentTime / duration * 100 : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        background: "var(--glass-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--border-radius)",
        padding: "2rem",
        width: "100%"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "audio",
          {
            ref: audioRef,
            src: track?.src,
            onTimeUpdate: handleTimeUpdate,
            onLoadedMetadata: handleLoadedMetadata,
            onEnded: handleEnded,
            preload: "metadata"
          }
        ),
        tracks.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }, children: tracks.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setCurrentTrack(i),
            style: {
              background: i === currentTrack ? "var(--surface-2)" : "transparent",
              border: `1px solid ${i === currentTrack ? "var(--border-accent)" : "var(--border-subtle)"}`,
              borderRadius: "calc(var(--border-radius) / 2)",
              padding: "0.6rem 1rem",
              cursor: "pointer",
              textAlign: "left",
              color: i === currentTrack ? "var(--text-primary)" : "var(--text-secondary)",
              fontSize: "0.85rem",
              transition: "all 0.2s ease"
            },
            children: t.title
          },
          i
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "1.5rem" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              style: {
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
                fontWeight: 300,
                color: "var(--text-primary)",
                margin: "0 0 0.25rem",
                lineHeight: 1.3
              },
              children: track?.title
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }, children: track?.artist })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "0.5rem", position: "relative" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                position: "relative",
                height: "4px",
                background: "var(--surface-2)",
                borderRadius: "2px",
                overflow: "visible"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: `${progress}%`,
                    background: "var(--accent)",
                    borderRadius: "2px",
                    transition: "width 0.1s linear"
                  }
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "range",
              min: 0,
              max: duration || 0,
              step: 0.1,
              value: currentTime,
              onChange: handleSeek,
              style: {
                position: "absolute",
                top: "-8px",
                left: 0,
                width: "100%",
                opacity: 0,
                cursor: "pointer",
                height: "20px",
                margin: 0
              },
              "aria-label": "Seek"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              marginBottom: "1.5rem",
              fontVariantNumeric: "tabular-nums"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatTime(currentTime) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatTime(duration) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "1.5rem" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: togglePlay,
              "aria-label": isPlaying ? "Pause" : "Play",
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "3rem",
                height: "3rem",
                borderRadius: "50%",
                background: "var(--accent)",
                border: "none",
                cursor: "pointer",
                color: "#0d1119",
                flexShrink: 0,
                transition: "background 0.2s ease"
              },
              children: isPlaying ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { size: 18 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 18 })
            }
          ),
          tracks.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "0.4rem", flex: 1 }, children: tracks.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setCurrentTrack(i),
              "aria-label": `Track ${i + 1}`,
              style: {
                width: i === currentTrack ? "1.5rem" : "0.4rem",
                height: "0.4rem",
                borderRadius: "2px",
                background: i === currentTrack ? "var(--accent)" : "var(--border-subtle)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s ease"
              }
            },
            i
          )) }),
          tracks.length === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.5rem" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: toggleMute,
                "aria-label": muted ? "Unmute" : "Mute",
                style: {
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  padding: "0.25rem"
                },
                children: muted || volume === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { size: 16 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", width: "80px", height: "4px", background: "var(--surface-2)", borderRadius: "2px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: `${muted ? 0 : volume * 100}%`,
                    background: "var(--text-muted)",
                    borderRadius: "2px"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "range",
                  min: 0,
                  max: 1,
                  step: 0.01,
                  value: muted ? 0 : volume,
                  onChange: handleVolumeChange,
                  "aria-label": "Volume",
                  style: {
                    position: "absolute",
                    top: "-8px",
                    left: 0,
                    width: "100%",
                    opacity: 0,
                    cursor: "pointer",
                    height: "20px",
                    margin: 0
                  }
                }
              )
            ] })
          ] })
        ] })
      ]
    }
  );
}
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Media = createComponent(($$result, $$props, $$slots) => {
  const tracks = [
    {
      title: "AI and the Oregon I-5 Hotel Crisis",
      artist: "LEVERAGE AI — Media Room",
      src: "/media/AI_and_the_Oregon_I-5_hotel_crisis.mp3",
      type: "audio"
    }
  ];
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Media", item: `${siteConfig.url}/media` }
    ]
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Media & Insights | Leverage AI", "description": "The LEVERAGE AI Media Room — audio insights, interviews, and analysis on AI search, digital strategy, and brand visibility.", "keywords": "AI search podcast, digital strategy audio, GEO insights, AI visibility media, Leverage AI media room", "data-astro-cid-h6iffge2": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">', "<\/script>  ", '<section style="\n      padding-top: 10rem;\n      padding-bottom: 5rem;\n      background-color: var(--page-bg);\n      position: relative;\n      overflow: hidden;\n      text-align: center;\n    " data-astro-cid-h6iffge2> <div style="position:absolute; top:-10%; left:50%; transform:translateX(-50%); width:800px; height:500px; background:radial-gradient(ellipse, rgba(212,144,15,0.06) 0%, transparent 70%); pointer-events:none;" data-astro-cid-h6iffge2></div> <div class="container-custom" style="position: relative; z-index: 1; max-width: 700px; margin: 0 auto;" data-astro-cid-h6iffge2> <p class="eyebrow" style="margin-bottom: 1rem;" data-astro-cid-h6iffge2>Media &amp; Insights</p> <h1 style="\n          font-family: var(--font-heading);\n          font-size: clamp(2.5rem, 5.5vw, 4.5rem);\n          font-weight: 300;\n          line-height: 1.1;\n          color: var(--text-primary);\n          margin: 0 0 1.5rem;\n        " data-astro-cid-h6iffge2>\nThe LEVERAGE AI<br data-astro-cid-h6iffge2> <span style="color: var(--accent);" data-astro-cid-h6iffge2>Media Room</span> </h1> <p style="font-size: 1rem; color: var(--text-secondary); line-height: 1.7; max-width: 500px; margin: 0 auto;" data-astro-cid-h6iffge2>\nAudio insights, interviews, and analysis at the intersection of AI, search visibility, and digital strategy.\n</p> </div> </section>  <section class="section-padding" style="background-color: var(--surface-1);" data-astro-cid-h6iffge2> <div class="container-custom" style="max-width: 780px; margin: 0 auto;" data-astro-cid-h6iffge2> <div style="margin-bottom: 2rem;" data-astro-cid-h6iffge2> <p style="\n            font-size: 0.65rem;\n            letter-spacing: 0.2em;\n            text-transform: uppercase;\n            color: var(--accent);\n            margin: 0 0 0.5rem;\n          " data-astro-cid-h6iffge2>\nLatest Episode\n</p> <p style="color: var(--text-muted); font-size: 0.85rem; margin: 0;" data-astro-cid-h6iffge2>\nPress play to listen in your browser. No app required.\n</p> </div> <!-- React island: MediaPlayer --> ', ' </div> </section>  <section class="section-padding" style="background-color: var(--page-bg);" data-astro-cid-h6iffge2> <div class="container-custom" style="max-width: 780px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start;" class="episode-grid" data-astro-cid-h6iffge2> <div data-astro-cid-h6iffge2> <p class="eyebrow" style="margin-bottom: 0.75rem;" data-astro-cid-h6iffge2>About This Episode</p> <h2 style="\n            font-family: var(--font-heading);\n            font-size: clamp(1.5rem, 2.5vw, 2rem);\n            font-weight: 300;\n            color: var(--text-primary);\n            margin: 0 0 1rem;\n            line-height: 1.3;\n          " data-astro-cid-h6iffge2>\nAI and the Oregon I-5 Hotel Crisis\n</h2> <p style="color: var(--text-secondary); line-height: 1.75; margin: 0 0 1rem; font-size: 0.9rem;" data-astro-cid-h6iffge2>\nAn exploration of how AI-generated search results shaped public perception and response during a high-stakes regional crisis — and what brands can learn from the event about visibility, narrative control, and AI search optimization.\n</p> <p style="color: var(--text-secondary); line-height: 1.75; margin: 0; font-size: 0.9rem;" data-astro-cid-h6iffge2>\nThis case highlights why proactive AI search strategy is no longer optional for organizations operating in high-scrutiny environments.\n</p> </div> <div data-astro-cid-h6iffge2> <p style="\n            font-size: 0.65rem;\n            letter-spacing: 0.15em;\n            text-transform: uppercase;\n            color: var(--text-muted);\n            margin: 0 0 1rem;\n          " data-astro-cid-h6iffge2>\nTopics Covered\n</p> <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.6rem;" data-astro-cid-h6iffge2> ', ' </ul> </div> </div> </section>  <section style="\n      padding: 4rem 0;\n      background-color: var(--surface-1);\n      border-top: 1px solid var(--border-subtle);\n    " data-astro-cid-h6iffge2> <div class="container-custom" style="text-align: center; max-width: 560px;" data-astro-cid-h6iffge2> <p style="color: var(--text-secondary); margin: 0 0 1.5rem; font-size: 0.95rem; line-height: 1.6;" data-astro-cid-h6iffge2>\nWant to be notified when new episodes and insights are published?\n</p> <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;" data-astro-cid-h6iffge2> <a href="/contact" class="btn-primary" data-astro-cid-h6iffge2>Stay in the Loop</a> <a href="/blog" class="btn-secondary" data-astro-cid-h6iffge2>Read Our Insights</a> </div> </div> </section> '])), unescapeHTML(JSON.stringify(breadcrumb)), maybeRenderHead(), renderComponent($$result2, "MediaPlayer", MediaPlayer, { "client:load": true, "tracks": tracks, "client:component-hydration": "load", "client:component-path": "C:/Users/mikes/Leverage-AI-Astro-Site/src/components/MediaPlayer", "client:component-export": "default", "data-astro-cid-h6iffge2": true }), [
    "AI search citation patterns during crises",
    "How AI models surface conflicting narratives",
    "Brand visibility in Perplexity and ChatGPT",
    "Structured data as a trust signal",
    "Proactive GEO strategy for high-stakes sectors"
  ].map((topic) => renderTemplate`<li style="display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.85rem; color: var(--text-secondary);" data-astro-cid-h6iffge2> <span style="color: var(--accent); flex-shrink: 0; margin-top: 2px;" data-astro-cid-h6iffge2>&#8250;</span> ${topic} </li>`)) })}`;
}, "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/media.astro", void 0);
const $$file = "C:/Users/mikes/Leverage-AI-Astro-Site/src/pages/media.astro";
const $$url = "/media";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Media,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
