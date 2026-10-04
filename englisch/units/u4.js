/* Unit 4 – Questions and answers (don't/doesn't, do/does-Fragen, Kurzantworten, Fragewörter, be/can-Fragen,
   höfliche Sprache). Cast: Ruby (11, London, dog Biscuit), Lukas (10, Berlin), Ellie (11, exchange student from Brighton). */
(() => {
  "use strict";
  const U = "#c2410c", SOFT = "#fde9dc", INK = "#1b2740", BLUE = "#1d5bd0", RED = "#dc3b2a", GREEN = "#138a5a",
    VIOLET = "#7b4fd6", PENCIL = "#5d6678";
  const EN = { lang: "en-GB", rate: 0.85 };

  const CSS = `
.e4-hear{display:inline-flex;align-items:center;gap:10px;min-height:56px;padding:6px 16px;border-radius:14px;border:2px solid var(--unit);background:#fff;color:var(--ink);font:700 24px/1.2 var(--f-display);cursor:pointer;text-align:left}
.e4-hear svg{flex:none;color:var(--unit)}
.e4-hear.nw{white-space:nowrap}
.e4-hear.sm{font-size:21px;padding:4px 12px;gap:8px}
.e4-hear.plain{font:600 21px/1.3 var(--f-body)}
.e4-hear.icon{padding:0;width:56px;justify-content:center}
.e4-hear.ping{animation:e4ping .5s}
@keyframes e4ping{50%{transform:scale(1.05);background:var(--unit-soft)}}
.e4-s{display:inline-block;color:var(--red);font-weight:800}
.e4-fly{position:absolute;z-index:4;font:800 54px/1 var(--f-display);color:var(--red);pointer-events:none;transform:translate(-50%,-50%);text-shadow:0 2px 0 #fff}
.e4-blk{display:inline-flex;align-items:center;height:52px;padding:0 14px;border-radius:10px;font:700 25px/1 var(--f-display);background:#fff;border:2px solid var(--line);white-space:nowrap}
.e4-blk.sub{background:#e4ecfb;border-color:#b8cdf3}
.e4-blk.aux{background:var(--unit);border-color:var(--unit);color:#fff}
.e4-blk.aux .e4-s{color:#ffe36b}
.e4-blk.verb{background:#fde7e4;border-color:#f3a99f}
.e4-blk.be{background:#efe7fd;border-color:#c5aef3}
.e4-blk.qw{background:#dff3e8;border-color:#8fd0ad;color:#0d6b45}
.e4-slot{display:inline-flex}
.e4-ans{display:inline-flex;align-items:center;gap:8px;min-height:56px;padding:4px 14px;border-radius:999px;background:#e6f6ee;border:2px solid #9fd8bd;font:700 21px/1.2 var(--f-display);color:var(--ink);cursor:pointer;white-space:nowrap}
.e4-ans svg{color:var(--green)}
.e4-ans.no{background:#fdeceb;border-color:#f3a99f}
.e4-ans.no svg{color:var(--red)}
.e4-chip{display:inline-block;padding:4px 12px;border-radius:999px;background:var(--unit-soft);font:700 19px/1.2 var(--f-display);color:var(--ink);white-space:nowrap}
.e4-wrong{color:var(--red);text-decoration:line-through;text-decoration-thickness:3px;font-weight:700}
.e4-qw{display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 8px;text-align:center}
.e4-board{background:#23392f;border:8px solid #8a5a2b;border-radius:16px;padding:14px 18px;color:#f4f1e6}
.e4-item{display:flex;align-items:center;gap:12px;width:100%;min-height:56px;padding:4px 10px;border-radius:10px;border:2px dashed rgba(255,255,255,.25);background:transparent;color:#f4f1e6;font:700 23px/1.1 var(--f-display);cursor:pointer;text-align:left}
.e4-item:active{background:rgba(255,255,255,.12)}
.e4-item .pr{margin-left:auto;font-family:var(--f-hand);font-size:30px;color:#ffe08a}
.e4-bub{display:inline-flex;align-items:center;gap:8px;min-height:56px;padding:6px 14px;border-radius:18px;font:600 21px/1.25 var(--f-body);cursor:pointer;border:2px solid transparent;text-align:left;color:var(--ink)}
.e4-bub svg{flex:none}
.e4-bub.q{background:#e4ecfb;border-color:#b8cdf3;border-bottom-left-radius:4px}
.e4-bub.q svg{color:var(--blue)}
.e4-bub.a{background:#fde9dc;border-color:#f3b48c;border-bottom-right-radius:4px}
.e4-bub.a svg{color:var(--unit)}
`;
  if (!document.getElementById("e4css")) { const st = document.createElement("style"); st.id = "e4css"; st.textContent = CSS; document.head.appendChild(st); }

  /* ---------------- helpers ---------------- */
  const SPK = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11"/></svg>';
  function rs(s, str) {
    const out = []; const re = /\{([^}]+)\}/g; let i = 0, m;
    while ((m = re.exec(str))) { if (m.index > i) out.push(str.slice(i, m.index)); out.push(s.h("span", { class: "e4-s" }, m[1])); i = re.lastIndex; }
    if (i < str.length) out.push(str.slice(i));
    return out;
  }
  const plain = str => String(str).replace(/[{}]/g, "");
  function tapSpeak(s, b, text) {
    b.addEventListener("click", e => {
      e.stopPropagation(); s.sfx.click(); s.speak(plain(typeof text === "function" ? text() : text), EN);
      b.classList.remove("ping"); void b.offsetWidth; b.classList.add("ping");
    });
    return b;
  }
  /** tap-to-hear button (British English). o.speak may be a string or a function */
  function hear(s, text, o = {}) {
    const b = s.h("button", { class: "e4-hear " + (o.cls || ""), "aria-label": "Anhören", html: SPK });
    tapSpeak(s, b, o.speak || text);
    const lab = o.label != null ? o.label : rs(s, text);
    if (lab !== "") b.append(s.h("span", null, lab));
    return b;
  }
  const ans = (s, text, no) => tapSpeak(s, s.h("button", { class: "e4-ans" + (no ? " no" : ""), html: SPK }, s.h("span", null, text)), text);
  const bub = (s, text, kind) => tapSpeak(s, s.h("button", { class: "e4-bub " + kind, html: SPK }, s.h("span", null, text)), text);
  const ex = (s, label, ...kids) => s.h("div", { class: "ex" }, s.h("span", { class: "exlabel" }, label), ...kids);
  const life = (s, ...kids) => s.h("div", { class: "life" }, s.h("span", { class: "exlabel" }, "In real life · Im Alltag"), ...kids);
  const K = s => (s.root.getBoundingClientRect().width / 1100) || 1;
  function centerIn(s, el) {
    const r = el.getBoundingClientRect(), R = s.root.getBoundingClientRect(), k = K(s);
    return { x: (r.left + r.width / 2 - R.left) / k, y: (r.top + r.height / 2 - R.top) / k };
  }
  async function fly(s, fromEl, toEl, txt = "s") {
    if (!s.alive) return;
    const a = centerIn(s, fromEl), b = centerIn(s, toEl);
    const f = s.h("div", { class: "e4-fly", style: { left: a.x + "px", top: a.y + "px" } }, txt);
    s.root.append(f); s.sfx.whoosh();
    await s.tween({ dur: 750, ease: "inOut", update: v => {
      f.style.left = (a.x + (b.x - a.x) * v) + "px";
      f.style.top = (a.y + (b.y - a.y) * v - Math.sin(v * Math.PI) * 90) + "px";
      f.style.transform = `translate(-50%,-50%) rotate(${v * 360}deg) scale(${1 + Math.sin(v * Math.PI) * 0.4})`;
    } });
    f.remove();
    if (!s.alive) return;
    s.sfx.snap(); await s.show(toEl, "pop");
  }
  const B = (s, t, k = "") => s.h("span", { class: "e4-blk " + k }, t);
  /** a block that slides open inside a sentence row */
  function slot(s, blk) { return s.h("span", { class: "e4-slot later" }, blk); }
  async function openSlot(s, sl) {
    sl.classList.remove("later");
    const inner = sl.firstChild, w = inner.offsetWidth;
    sl.style.overflow = "hidden"; sl.style.width = "0px";
    s.sfx.zap();
    await s.tween({ dur: 450, ease: "back", update: v => { sl.style.width = Math.max(0, w * v) + "px"; } });
    sl.style.width = ""; sl.style.overflow = "";
    s.sfx.snap(); inner.classList.remove("a-bounce"); void inner.offsetWidth; inner.classList.add("a-bounce");
    await s.wait(200);
  }
  /** two neighbouring blocks swap places (a before b → b before a) */
  async function swap(s, a, b) {
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(), k = K(s);
    const dxB = (ra.left - rb.left) / k, dxA = (rb.right - ra.right) / k;
    s.sfx.whoosh();
    await s.tween({ dur: 650, update: v => {
      b.style.transform = `translate(${dxB * v}px, ${-Math.sin(v * Math.PI) * 34}px)`;
      a.style.transform = `translate(${dxA * v}px, ${Math.sin(v * Math.PI) * 22}px)`;
    } });
    a.style.transform = ""; b.style.transform = "";
    a.parentNode.insertBefore(b, a);
    s.sfx.snap();
  }
  const retext = (s, el, t) => { el.textContent = t; el.classList.remove("a-pop"); void el.offsetWidth; el.classList.add("a-pop"); };

  function kid(s, size, hair, o = {}) {
    const svg = s.svg(size, size), c = size / 2, r = size * 0.34;
    if (o.long) svg.append(s.el("rect", { x: c - r * 1.08, y: c - r * 0.2, width: r * 2.16, height: r * 1.35, rx: r * 0.4, fill: hair }));
    svg.append(
      s.el("circle", { cx: c, cy: c + size * 0.04, r, fill: o.skin || "#f3c9a5" }),
      s.el("path", { d: `M${c - r * 1.02},${c + size * 0.02} A${r * 1.02},${r * 1.05} 0 0 1 ${c + r * 1.02},${c + size * 0.02} Q${c + r * 0.2},${c - r * 0.45} ${c - r * 1.02},${c + size * 0.02}Z`, fill: hair }),
      s.el("circle", { cx: c - r * 0.36, cy: c + size * 0.07, r: size * 0.03, fill: INK }),
      s.el("circle", { cx: c + r * 0.36, cy: c + size * 0.07, r: size * 0.03, fill: INK }),
      s.el("path", { d: `M${c - r * 0.35},${c + r * 0.5} Q${c},${c + r * 0.85} ${c + r * 0.35},${c + r * 0.5}`, fill: "none", stroke: INK, "stroke-width": size * 0.03, "stroke-linecap": "round" }),
    );
    return svg;
  }
  /* --- canonical cast (same look as Units 1–2): person() origin = between the feet, height 200 at scale 1 --- */
  const CAST = {
    lukas: { skin: "#f2c9a5", hair: "#7a4b25", style: "short", shirt: "#ee7a1a", h: 150 },
    julia: { skin: "#f4cfae", hair: "#e2b649", style: "pony", shirt: "#138a5a", h: 126 },
    ruby: { skin: "#a8724a", hair: "#2a1a12", style: "curly", shirt: "#1e3a6e", tie: "#c0392b", skirt: "#2c3e50", glasses: true, h: 160 },
  };
  function person(s, o) {
    const E = s.el, sc = (o.h || 200) / 200;
    const outer = E("g", { style: "transform-box:fill-box;transform-origin:50% 100%" });
    const g = E("g", { transform: `translate(${o.x} ${o.y}) scale(${sc})` });
    outer.append(g);
    const skin = o.skin || "#f2c9a5", hair = o.hair || "#5a3a22", shirt = o.shirt || "#1d5bd0", pants = o.pants || "#39435a";
    const st = o.style || "short";
    if (st === "long" || st === "curly") g.append(E("path", { d: "M-36 -170 C-46 -130 -44 -104 -26 -98 L26 -98 C44 -104 46 -130 36 -170 Z", fill: hair }));
    if (st === "curly") [-38, 38].forEach(x => [-150, -126, -104].forEach(y => g.append(E("circle", { cx: x, cy: y, r: 11, fill: hair }))));
    g.append(E("rect", { x: -19, y: -64, width: 15, height: 60, rx: 6, fill: o.skirt ? skin : pants }), E("rect", { x: 4, y: -64, width: 15, height: 60, rx: 6, fill: o.skirt ? skin : pants }));
    if (o.skirt) g.append(E("rect", { x: -19, y: -40, width: 38, height: 8, fill: "#8a94a6", opacity: 0.0 }));
    g.append(E("ellipse", { cx: -12, cy: -4, rx: 13, ry: 6, fill: "#262b36" }), E("ellipse", { cx: 12, cy: -4, rx: 13, ry: 6, fill: "#262b36" }));
    if (o.skirt) g.append(E("path", { d: "M-30 -74 L30 -74 L38 -38 L-38 -38 Z", fill: o.skirt }));
    g.append(E("rect", { x: -31, y: -132, width: 62, height: 74, rx: 20, fill: shirt }));
    g.append(E("path", { d: "M-26 -118 L-42 -72", stroke: shirt, "stroke-width": 15, "stroke-linecap": "round", fill: "none" }), E("circle", { cx: -43, cy: -66, r: 8, fill: skin }));
    if (o.wave) g.append(E("path", { d: "M26 -118 L48 -160", stroke: shirt, "stroke-width": 15, "stroke-linecap": "round", fill: "none" }), E("circle", { cx: 51, cy: -166, r: 8, fill: skin }));
    else g.append(E("path", { d: "M26 -118 L42 -72", stroke: shirt, "stroke-width": 15, "stroke-linecap": "round", fill: "none" }), E("circle", { cx: 43, cy: -66, r: 8, fill: skin }));
    if (o.tie) g.append(E("path", { d: "M-13 -132 L0 -114 L13 -132 Z", fill: "#fff" }), E("path", { d: "M-4 -120 L4 -120 L6 -96 L0 -89 L-6 -96 Z", fill: o.tie }));
    if (o.badge) g.append(E("rect", { x: -26, y: -112, width: 26, height: 16, rx: 3, fill: "#fff", stroke: "#dc3b2a", "stroke-width": 2 }));
    g.append(E("rect", { x: -8, y: -140, width: 16, height: 12, fill: skin }));
    g.append(E("circle", { cx: -30, cy: -160, r: 6, fill: skin }), E("circle", { cx: 30, cy: -160, r: 6, fill: skin }));
    g.append(E("circle", { cx: 0, cy: -163, r: 30, fill: skin }));
    if (st === "short") g.append(E("path", { d: "M-31 -166 C-34 -199 34 -199 31 -166 C25 -180 10 -186 -2 -180 C-14 -186 -27 -178 -31 -166 Z", fill: hair }));
    if (st === "long" || st === "pony" || st === "bun") g.append(E("path", { d: "M-32 -160 C-37 -200 37 -200 32 -160 C28 -178 14 -187 0 -183 C-14 -187 -28 -178 -32 -160 Z", fill: hair }));
    if (st === "pony") g.append(E("ellipse", { cx: 36, cy: -158, rx: 9, ry: 22, fill: hair, transform: "rotate(-15 36 -158)" }), E("circle", { cx: 31, cy: -178, r: 5, fill: "#dc3b2a" }));
    if (st === "bun") g.append(E("circle", { cx: 0, cy: -197, r: 13, fill: hair }));
    if (st === "curly") [-160, -135, -110, -90, -70, -45, -20].forEach(a => { const r = a * Math.PI / 180; g.append(E("circle", { cx: 29 * Math.cos(r), cy: -165 + 29 * Math.sin(r), r: 12, fill: hair })); });
    if (st === "bald") g.append(E("path", { d: "M-31 -150 C-34 -170 -28 -178 -24 -176 L-26 -150 Z M31 -150 C34 -170 28 -178 24 -176 L26 -150 Z", fill: hair }));
    g.append(E("circle", { cx: -11, cy: -164, r: 3.6, fill: "#1b2740" }), E("circle", { cx: 11, cy: -164, r: 3.6, fill: "#1b2740" }));
    g.append(E("path", { d: "M-11 -149 Q0 -140 11 -149", stroke: "#1b2740", "stroke-width": 3, fill: "none", "stroke-linecap": "round" }));
    g.append(E("circle", { cx: -19, cy: -153, r: 4.5, fill: "#ef8f8f", opacity: 0.45 }), E("circle", { cx: 19, cy: -153, r: 4.5, fill: "#ef8f8f", opacity: 0.45 }));
    if (o.glasses) g.append(E("circle", { cx: -11, cy: -164, r: 9, fill: "none", stroke: "#1b2740", "stroke-width": 2.6 }), E("circle", { cx: 11, cy: -164, r: 9, fill: "none", stroke: "#1b2740", "stroke-width": 2.6 }), E("path", { d: "M-2 -165 L2 -165", stroke: "#1b2740", "stroke-width": 2.6 }));
    if (o.beard) g.append(E("path", { d: "M-26 -160 C-26 -126 26 -126 26 -160 C18 -144 -18 -144 -26 -160 Z", fill: hair }));
    return outer;
  }
  const cast = (s, who, x, y, extra = {}) => person(s, Object.assign({}, CAST[who], { x, y }, extra));
  function dog(s, { x, y, sc = 1, c = "#b07a45" }) {
    const E = s.el, outer = E("g", { style: "transform-box:fill-box;transform-origin:50% 100%" }), g = E("g", { transform: `translate(${x} ${y}) scale(${sc})` });
    outer.append(g);
    [-34, -20, 18, 32].forEach(lx => g.append(E("rect", { x: lx, y: -36, width: 11, height: 36, rx: 4, fill: c })));
    g.append(E("path", { d: "M40 -52 Q64 -66 60 -90", stroke: c, "stroke-width": 9, "stroke-linecap": "round", fill: "none" }));
    g.append(E("ellipse", { cx: 0, cy: -46, rx: 46, ry: 22, fill: c }));
    g.append(E("ellipse", { cx: -6, cy: -50, rx: 16, ry: 10, fill: "#8a5a2b", opacity: 0.5 }));
    g.append(E("circle", { cx: 46, cy: -76, r: 23, fill: c }));
    g.append(E("path", { d: "M30 -62 Q44 -54 60 -58", stroke: "#dc3b2a", "stroke-width": 6, fill: "none", "stroke-linecap": "round" }));
    g.append(E("ellipse", { cx: 64, cy: -70, rx: 14, ry: 10, fill: "#e8cba0" }), E("circle", { cx: 76, cy: -73, r: 5, fill: "#1b2740" }), E("circle", { cx: 52, cy: -83, r: 3.6, fill: "#1b2740" }));
    g.append(E("ellipse", { cx: 33, cy: -76, rx: 9, ry: 18, fill: "#7a4b25", transform: "rotate(12 33 -76)" }));
    return outer;
  }
  /* head-and-shoulders avatar of a cast member, size × size px */
  const avatar = (s, who, size) => { const svg = s.svg(size, size, { viewBox: "-60 -212 120 120" }); svg.append(cast(s, who, 0, 0)); return svg; };
  const ruby = (s, n) => avatar(s, "ruby", n);
  const lukas = (s, n) => avatar(s, "lukas", n);
  const ellie = (s, n) => kid(s, n, "#c4532a", { long: true });

  const lifeRow = (s, ...ts) => { const l = life(s, s.h("div", { class: "row", style: { gap: "8px" } }, ts.map(x => hear(s, x, { cls: "sm plain" })))); l.classList.add("later"); return l; };
  /* rows that turn a statement into a question / negative */
  const rowWrap = (s, ...kids) => s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "8px" } }, ...kids);

  Deck.unit({
    id: "u4", num: 4, title: "Questions and answers", color: U, soft: SOFT,
    subtitle: "Fragen stellen, verneinen, höflich sein",
    blurb: "don't/doesn't, Fragen mit do/does, be und can – und please!",
    goals: [
      "Verneinen mit don't und doesn't",
      "Fragen mit do und does bauen – und kurz antworten",
      "Fragewörter: who, what, where, when, why, how …",
      "Fragen mit am/is/are und can – ohne do!",
      "Höflich fragen: please, thank you, Could you …?",
    ],
    icon(svg, el) {
      svg.append(el("path", { d: "M10 14h50a6 6 0 016 6v26a6 6 0 01-6 6H30l-12 10v-10h-8a6 6 0 01-6-6V20a6 6 0 016-6z", fill: U, opacity: .18, stroke: U, "stroke-width": 3 }),
        el("text", { x: 35, y: 45, "text-anchor": "middle", "font-size": 30, "font-weight": 800, fill: U, text: "?" }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "I don't like spinach",
        say: "So sagst du, dass etwas nicht stimmt: Du stellst don't vor das Verb.",
        build(s) {
          const mk = (subj, verb, rest, speak) => {
            const sl = slot(s, B(s, "don't", "aux"));
            const row = rowWrap(s, hear(s, speak, { cls: "icon", label: "", speak: () => (sl.classList.contains("later") ? `${subj} ${verb} ${rest}` : speak) }), B(s, subj, "sub"), sl, B(s, verb, "verb"), B(s, rest));
            return { row, sl };
          };
          const R = [
            ["Essen", mk("I", "like", "spinach.", "I don't like spinach.")],
            ["Sport", mk("We", "play", "tennis.", "We don't play tennis.")],
            ["Wohnen", mk("They", "live", "in London.", "They don't live in London.")],
          ];
          const rows = R.map(([lab, r]) => s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "14px" } }, s.h("span", { class: "e4-chip", style: { minWidth: "96px", textAlign: "center" } }, lab), r.row));
          const o = s.h("span", { style: { display: "inline-block", color: RED } }, "o"), sp = s.h("span", null, " ");
          const contr = s.h("div", { class: "card later stack", style: { alignItems: "center", gap: "8px" } },
            s.h("p", { class: "small pencil" }, "Aus zwei Wörtern wird eins:"),
            s.h("p", { class: "huge", style: { fontSize: "64px" } }, "do", sp, "n", o, "t"));
          const merk = s.h("div", { class: "merk later" }, s.h("b", null, "I / you / we / they"), " + ", s.h("b", { style: { color: U } }, "don't"), " + Grundform", s.h("br"), "I don't like spinach. = Ich mag keinen Spinat.");
          const lf1 = lifeRow(s, "We don't have school on Saturdays.", "I don't eat meat.", "My parents don't speak English.");
          s.add(s.h("div", { class: "stack", style: { gap: "18px" } },
            s.h("p", { class: "t" }, "Erst ein normaler Satz – dann schiebt sich ", s.h("b", { style: { color: U } }, "don't"), " vor das Verb:"),
            ...rows,
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "24px", alignItems: "stretch" } }, contr, merk), lf1));
          rows.forEach((r, i) => { r.classList.add("a-left"); r.style.setProperty("--d", i * 120 + "ms"); });
          s.sfx.whoosh();
          R.forEach(([, r]) => s.step(async () => { await openSlot(s, r.sl); }));
          s.step(async () => {
            s.sfx.pop(); await s.show(contr, "up");
            s.sfx.boing();
            await s.tween({ dur: 600, update: v => { o.style.transform = `translateY(${-30 * Math.sin(v * Math.PI)}px) rotate(${v * 180}deg)`; o.style.opacity = 1 - v * 0.6; } });
            o.textContent = "’"; o.style.transform = ""; o.style.opacity = 1; sp.textContent = ""; s.sfx.snap();
            o.classList.remove("a-pop"); void o.offsetWidth; o.classList.add("a-pop");
          });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(lf1, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "doesn't: Das s springt über",
        say: "Bei he, she und it heißt es doesn't. Das s springt vom Verb hinüber zu does.",
        build(s) {
          const mk = (subj, verb, rest) => {
            const vS = s.h("span", { class: "e4-s" }, "s"), dS = s.h("span", { class: "e4-s later" }, "s");
            const verbB = s.h("span", { class: "e4-blk verb" }, verb, vS);
            const sl = slot(s, s.h("span", { class: "e4-blk aux" }, "doe", dS, "n't"));
            const neg = `${subj} doesn't ${verb} ${rest}`, pos = `${subj} ${verb}s ${rest}`;
            const row = rowWrap(s, hear(s, neg, { cls: "icon", label: "", speak: () => (dS.classList.contains("later") ? pos : neg) }), B(s, subj, "sub"), sl, verbB, B(s, rest));
            return { row, sl, vS, dS };
          };
          const R = [["Ruby", "play", "football."], ["Lukas", "like", "fish."], ["Biscuit", "eat", "carrots."]].map(a => mk(...a));
          const lf2 = lifeRow(s, "Ruby doesn't like rain.", "Lukas doesn't get up early on Sundays.", "The bus doesn't stop here.");
          const merk = s.h("div", { class: "merk later" }, s.h("b", null, "he / she / it"), " + ", s.h("b", { style: { color: U } }, "doe", s.h("span", { class: "red" }, "s"), "n't"), " + Grundform ", s.h("b", null, "ohne s"), ".",
            s.h("br"), "Falsch: ", s.h("span", { class: "e4-wrong" }, "She doesn't plays."), "  Richtig: She doesn't play.");
          s.add(s.h("div", { class: "stack", style: { gap: "18px" } },
            s.h("p", { class: "t" }, "Das ", s.h("b", { class: "red" }, "s"), " darf nur einmal im Satz vorkommen. Pass auf, wohin es springt!"),
            ...R.map(r => r.row), merk, lf2));
          R.forEach((r, i) => { r.row.classList.add("a-left"); r.row.style.setProperty("--d", i * 120 + "ms"); });
          s.sfx.whoosh();
          R.forEach(r => s.step(async () => {
            await openSlot(s, r.sl);
            await fly(s, r.vS, r.dS);
            s.sfx.boing();
            await s.tween({ dur: 250, update: v => { r.vS.style.opacity = 1 - v; } });
            r.vS.style.display = "none";
          }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.say("Das s ist schon in doesn't. Das Verb bleibt ohne s."); });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(lf2, "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Do you like pizza?",
        say: "Fragen mit do: Do kommt ganz nach vorn. Am Ende steht ein Fragezeichen.",
        build(s) {
          const mk = (subj, verb, rest, yes, no) => {
            const subB = B(s, subj, "sub"), last = B(s, rest + ".");
            const sl = slot(s, B(s, "Do", "aux"));
            const q = `Do ${subj.toLowerCase()} ${verb} ${rest}?`;
            const row = rowWrap(s, hear(s, q, { cls: "icon", label: "", speak: () => (sl.classList.contains("later") ? `${subj} ${verb} ${rest}.` : q) }), sl, subB, B(s, verb, "verb"), last);
            const a1 = ans(s, yes), a2 = ans(s, no, true);
            const answers = s.h("div", { class: "row later", style: { flexWrap: "nowrap", gap: "8px", marginLeft: "auto" } }, a1, a2);
            return { line: s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "12px" } }, row, answers), sl, subB, last, subj, rest, answers };
          };
          const R = [mk("You", "like", "pizza", "Yes, I do.", "No, I don't."), mk("They", "live", "in London", "Yes, they do.", "No, they don't."), mk("We", "have", "Maths today", "Yes, we do.", "No, we don't.")];
          const merk = s.h("div", { class: "merk later" }, s.h("b", { style: { color: U } }, "Do"), " + I / you / we / they + Grundform … ", s.h("b", null, "?"), s.h("br"), "Kurz antworten: ", s.h("b", null, "Yes, I do."), " / ", s.h("b", null, "No, I don't."));
          const lf3 = lifeRow(s, "Do you want some cake? – Yes, please!", "Do you speak English? – Yes, I do.", "Do your grandparents live in Berlin? – No, they don't.");
          s.add(s.h("div", { class: "stack", style: { gap: "20px" } },
            s.h("p", { class: "t" }, "Aus dem Satz wird eine Frage – ", s.h("b", { style: { color: U } }, "Do"), " springt nach vorn:"),
            ...R.map(r => r.line), merk, lf3));
          R.forEach((r, i) => { r.line.classList.add("a-left"); r.line.style.setProperty("--d", i * 120 + "ms"); });
          s.sfx.whoosh();
          R.forEach(r => s.step(async () => {
            await openSlot(s, r.sl);
            retext(s, r.subB, r.subj.toLowerCase()); s.sfx.pop();
            await s.wait(200); retext(s, r.last, r.rest + "?"); s.sfx.boing();
            await s.wait(250); s.sfx.ding(); await s.show(r.answers, "right");
          }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(lf3, "up"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Does she play …?",
        say: "Bei he, she und it fragst du mit Does. Und wieder springt das s nach vorn.",
        build(s) {
          const mk = (subj, verb, rest, yes, no) => {
            const vS = s.h("span", { class: "e4-s" }, "s"), dS = s.h("span", { class: "e4-s later" }, "s");
            const subB = B(s, subj, "sub"), last = B(s, rest + "."), verbB = s.h("span", { class: "e4-blk verb" }, verb, vS);
            const sl = slot(s, s.h("span", { class: "e4-blk aux" }, "Doe", dS));
            const low = /^(The|He|She|It)\b/.test(subj) ? subj[0].toLowerCase() + subj.slice(1) : subj;
            const q = `Does ${low} ${verb} ${rest}?`;
            const row = rowWrap(s, hear(s, q, { cls: "icon", label: "", speak: () => (sl.classList.contains("later") ? `${subj} ${verb}s ${rest}.` : q) }), sl, subB, verbB, last);
            const answers = s.h("div", { class: "row later", style: { flexWrap: "nowrap", gap: "8px", marginLeft: "auto" } }, ans(s, yes), ans(s, no, true));
            return { line: s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "12px" } }, row, answers), sl, subB, last, low, rest, answers, vS, dS };
          };
          const R = [mk("Ruby", "play", "the guitar", "Yes, she does.", "No, she doesn't."), mk("Lukas", "like", "fish", "Yes, he does.", "No, he doesn't."), mk("The cat", "sleep", "a lot", "Yes, it does.", "No, it doesn't.")];
          const lf4 = lifeRow(s, "Does this bus go to the station? – Yes, it does.", "Does your brother play football? – No, he doesn't.");
          const merk = s.h("div", { class: "merk later" }, s.h("b", { style: { color: U } }, "Doe", s.h("span", { class: "red" }, "s")), " + he / she / it + Grundform ", s.h("b", null, "ohne s"), " … ?", s.h("br"), "Falsch: ", s.h("span", { class: "e4-wrong" }, "Does Ruby plays …?"), "  Richtig: Does Ruby play …?");
          s.add(s.h("div", { class: "stack", style: { gap: "20px" } },
            s.h("p", { class: "t" }, "he / she / it: ", s.h("b", { style: { color: U } }, "Does"), " springt nach vorn – und holt sich das ", s.h("b", { class: "red" }, "s"), ":"),
            ...R.map(r => r.line), merk, lf4));
          R.forEach((r, i) => { r.line.classList.add("a-left"); r.line.style.setProperty("--d", i * 120 + "ms"); });
          s.sfx.whoosh();
          R.forEach(r => s.step(async () => {
            await openSlot(s, r.sl);
            await fly(s, r.vS, r.dS);
            await s.tween({ dur: 250, update: v => { r.vS.style.opacity = 1 - v; } }); r.vS.style.display = "none";
            if (r.low !== r.subB.textContent) retext(s, r.subB, r.low);
            retext(s, r.last, r.rest + "?"); s.sfx.boing();
            await s.wait(250); s.sfx.ding(); await s.show(r.answers, "right");
          }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(lf4, "up"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Kurzantworten: Yes, I do!",
        say: "Auf Englisch antwortest du nicht nur mit Yes oder No. Du wiederholst das kleine Wort do oder does.",
        build(s) {
          const R = [["Do you …?", "Yes, I do.", "No, I don't."], ["Does he …?", "Yes, he does.", "No, he doesn't."], ["Does she …?", "Yes, she does.", "No, she doesn't."], ["Does it …?", "Yes, it does.", "No, it doesn't."], ["Do they …?", "Yes, they do.", "No, they don't."]];
          const rows = R.map(([q, y, n]) => s.h("div", { class: "later", style: { display: "grid", gridTemplateColumns: "260px 1fr 1fr", gap: "16px", alignItems: "center" } },
            s.h("p", { class: "h2", style: { color: U } }, q), s.h("div", null, ans(s, y)), s.h("div", null, ans(s, n, true))));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Nur „Yes.“ klingt auf Englisch unhöflich kurz. Die Kurzantwort wiederholt ", s.h("b", null, "do / does"), " – nicht das Verb: ", s.h("span", { class: "e4-wrong" }, "Yes, I like."));
          const lf = life(s, s.h("div", { class: "stack", style: { gap: "8px" } },
            hear(s, "Do you like football? – Yes, I do!", { cls: "sm plain" }),
            hear(s, "Does your dad speak English? – Yes, he does.", { cls: "sm plain" }),
            hear(s, "Do your friends live near you? – No, they don't.", { cls: "sm plain" })));
          lf.classList.add("later");
          s.add(s.h("div", { class: "stack", style: { gap: "10px" } },
            s.h("div", { style: { display: "grid", gridTemplateColumns: "260px 1fr 1fr", gap: "16px" } }, s.h("span"), s.h("p", { class: "h2 green" }, "Yes …"), s.h("p", { class: "h2 red" }, "No …")),
            ...rows,
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1.25fr", gap: "20px", marginTop: "8px", alignItems: "start" } }, merk, lf)));
          s.sfx.whoosh();
          s.step(async () => { for (let i = 0; i < rows.length; i++) { s.sfx.count(i * 2); await s.show(rows[i], "left"); } });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(lf, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Question words",
        say: "Mit Fragewörtern fragst du nach Personen, Dingen, Orten und Zeiten. Tippe auf ein Wort oder eine Frage.",
        build(s) {
          const I = {
            who: g => g.append(s.el("circle", { cx: 25, cy: 16, r: 9, fill: U }), s.el("path", { d: "M8 46c0-10 8-17 17-17s17 7 17 17z", fill: U })),
            what: g => g.append(s.el("rect", { x: 8, y: 12, width: 34, height: 30, rx: 5, fill: "none", stroke: U, "stroke-width": 4 }), s.el("text", { x: 25, y: 36, "text-anchor": "middle", "font-size": 22, "font-weight": 800, fill: U, text: "?" })),
            where: g => g.append(s.el("path", { d: "M25 46s-14-15-14-25a14 14 0 0128 0c0 10-14 25-14 25z", fill: U }), s.el("circle", { cx: 25, cy: 21, r: 5, fill: "#fff" })),
            when: g => g.append(s.el("circle", { cx: 25, cy: 25, r: 18, fill: "none", stroke: U, "stroke-width": 4 }), s.el("path", { d: "M25 14v11l8 5", fill: "none", stroke: U, "stroke-width": 4, "stroke-linecap": "round" })),
            why: g => g.append(s.el("path", { d: "M25 6a13 13 0 00-8 23c2 2 3 4 3 7h10c0-3 1-5 3-7a13 13 0 00-8-23z", fill: "#ffd94a", stroke: U, "stroke-width": 3 }), s.el("rect", { x: 19, y: 39, width: 12, height: 6, rx: 2, fill: U })),
            how: g => g.append(s.el("circle", { cx: 25, cy: 25, r: 18, fill: "#ffd94a", stroke: U, "stroke-width": 3 }), s.el("circle", { cx: 19, cy: 21, r: 2.5, fill: INK }), s.el("circle", { cx: 31, cy: 21, r: 2.5, fill: INK }), s.el("path", { d: "M17 29q8 8 16 0", fill: "none", stroke: INK, "stroke-width": 3, "stroke-linecap": "round" })),
            howold: g => g.append(s.el("rect", { x: 9, y: 26, width: 32, height: 18, rx: 4, fill: U }), ...[17, 25, 33].map(x => s.el("rect", { x: x - 2, y: 14, width: 4, height: 12, fill: "#f5b25a" })), ...[17, 25, 33].map(x => s.el("circle", { cx: x, cy: 10, r: 3, fill: RED }))),
            howmany: g => g.append(...[[13, 33], [25, 33], [37, 33], [19, 19], [31, 19]].map(([x, y]) => s.el("circle", { cx: x, cy: y, r: 6, fill: U }))),
            which: g => g.append(s.el("path", { d: "M25 46V26M25 26L12 10M25 26l13-16", fill: "none", stroke: U, "stroke-width": 4, "stroke-linecap": "round" }), s.el("path", { d: "M8 14l4-6 5 5zM42 14l-4-6-5 5z", fill: U })),
            whose: g => g.append(s.el("rect", { x: 9, y: 18, width: 32, height: 26, rx: 5, fill: U }), s.el("path", { d: "M18 18v-5a7 7 0 0114 0v5", fill: "none", stroke: U, "stroke-width": 4 }), s.el("circle", { cx: 25, cy: 31, r: 4, fill: "#fff" })),
          };
          const W = [
            ["who", "wer?", "Who is your teacher?", "who"], ["what", "was?", "What's your name?", "what"], ["where", "wo? wohin?", "Where do you live?", "where"],
            ["when", "wann?", "When is your birthday?", "when"], ["why", "warum?", "Why are you sad?", "why"],
            ["how", "wie?", "How are you?", "how"], ["how old", "wie alt?", "How old are you?", "howold"], ["how many", "wie viele?", "How many pets do you have?", "howmany"],
            ["which", "welche(r)?", "Which colour do you like?", "which"], ["whose", "wessen?", "Whose bag is this?", "whose"],
          ];
          const cards = W.map(([w, de, q, ic]) => {
            const svg = s.svg(50, 50); I[ic](svg);
            return s.h("div", { class: "card e4-qw later" }, svg, hear(s, w, { cls: "sm nw" }), s.h("p", { class: "small pencil" }, de), hear(s, q, { cls: "sm plain", label: s.h("span", { style: { fontSize: "19px" } }, q) }));
          });
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "12px" } }, cards));
          s.sfx.whoosh();
          s.step(async () => { for (let i = 0; i < 5; i++) { s.sfx.count(i * 2); await s.show(cards[i], "pop"); } });
          s.step(async () => { for (let i = 5; i < 10; i++) { s.sfx.count(i + 2); await s.show(cards[i], "pop"); } s.say("Alle Fragewörter beginnen mit w oder h – wie im Deutschen fast alle mit w."); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "W-Fragen mit do und does",
        say: "Bei W-Fragen steht das Fragewort ganz vorn. Danach kommt do oder does, dann die Person und das Verb.",
        build(s) {
          const COLS = "56px 170px 120px 150px 160px 1fr";
          const head = s.h("div", { style: { display: "grid", gridTemplateColumns: COLS, gap: "8px", alignItems: "end" } },
            s.h("span"), ...[["Fragewort", GREEN], ["do / does", U], ["Person", BLUE], ["Verb", RED], ["Rest", PENCIL]].map(([t, c]) => s.h("p", { class: "small", style: { fontWeight: 700, color: c, borderBottom: "3px solid " + c } }, t)));
          const D = [
            ["Where", "do", "you", "live", "?", "I live in Berlin."],
            ["What", "does", "Lukas", "eat", "for breakfast?", "He eats cereal."],
            ["When", "does", "the film", "start", "?", "It starts at six."],
            ["What time", "do", "you", "get up", "?", "I get up at seven."],
          ];
          const rows = D.map(([w, d, p, v, r, a]) => {
            const q = `${w} ${d} ${p} ${v}${r === "?" ? "" : " "}${r}`;
            const bl = [B(s, w, "qw"), B(s, d, "aux"), B(s, p, "sub"), B(s, v, "verb"), B(s, r)].map(b => { b.classList.add("later"); return s.h("div", null, b); });
            const line = s.h("div", { style: { display: "grid", gridTemplateColumns: COLS, gap: "8px", alignItems: "center" } }, hear(s, q, { cls: "icon", label: "" }), ...bl);
            return { line, bl: bl.map(x => x.firstChild), a, q };
          });
          const answers = ex(s, "Antworten – hier gibt es kein Yes/No:", s.h("div", { class: "row", style: { gap: "10px" } }, rows.map(r => ans(s, r.a))));
          answers.classList.add("later");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, s.h("b", { class: "green" }, "Fragewort"), " + ", s.h("b", { style: { color: U } }, "do / does"), " + ", s.h("b", { class: "blue" }, "Person"), " + ", s.h("b", { class: "red" }, "Verb (Grundform)"), " + Rest ?  – immer diese Reihenfolge!");
          s.add(s.h("div", { class: "stack", style: { gap: "12px" } }, head, ...rows.map(r => r.line), answers, merk));
          s.sfx.whoosh();
          rows.forEach(r => s.step(async () => { for (let i = 0; i < r.bl.length; i++) { s.sfx.count(i * 2); await s.show(r.bl[i], "down"); } }));
          s.step(async () => { s.sfx.pop(); await s.show(answers, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Fragen mit be – ohne do!",
        say: "Bei am, is und are brauchst du kein do. Das Verb tauscht einfach den Platz mit der Person.",
        build(s) {
          const mk = (subj, be, rest, low, A1, A2) => {
            const sB = B(s, subj, "sub"), vB = B(s, be, "be"), last = B(s, rest + ".");
            const blocks = s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "8px" } }, sB, vB, last);
            const q = `${be[0].toUpperCase() + be.slice(1)} ${low} ${rest}?`;
            let done = false;
            const line = s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "12px" } },
              hear(s, q, { cls: "icon", label: "", speak: () => (done ? q : `${subj} ${be} ${rest}.`) }), blocks);
            const answers = s.h("div", { class: "row later", style: { flexWrap: "nowrap", gap: "8px", marginLeft: "auto" } }, ans(s, A1), ans(s, A2, true));
            line.append(answers);
            return { line, answers, run: async () => { await swap(s, sB, vB); retext(s, vB, be[0].toUpperCase() + be.slice(1)); retext(s, sB, low); retext(s, last, rest + "?"); done = true; s.sfx.boing(); await s.wait(250); s.sfx.ding(); await s.show(answers, "right"); } };
          };
          const R = [mk("You", "are", "ten", "you", "Yes, I am.", "No, I'm not."), mk("Ruby", "is", "from London", "Ruby", "Yes, she is.", "No, she isn't."), mk("The cat", "is", "hungry", "the cat", "Yes, it is.", "No, it isn't.")];
          const merk = s.h("div", { class: "merk later" }, s.h("b", null, "am / is / are"), " springt einfach vor die Person – ", s.h("b", null, "kein do!"), " ", s.h("span", { class: "e4-wrong" }, "Do you are ten?"),
            s.h("br"), "Mit Fragewort: ", s.h("b", null, "Where is"), " the cat? ", s.h("b", null, "How old are"), " you?");
          const wq = s.h("div", { class: "row later", style: { gap: "10px" } }, hear(s, "Where is the cat?", { cls: "sm" }), hear(s, "How old are you?", { cls: "sm" }), hear(s, "Who is your best friend?", { cls: "sm" }));
          s.add(s.h("div", { class: "stack", style: { gap: "20px" } },
            s.h("p", { class: "t" }, "Schau zu: ", s.h("b", { style: { color: VIOLET } }, "is / are"), " und die Person tauschen die Plätze."),
            ...R.map(r => r.line), merk, wq));
          R.forEach((r, i) => { r.line.classList.add("a-left"); r.line.style.setProperty("--d", i * 120 + "ms"); });
          s.sfx.whoosh();
          R.forEach(r => s.step(() => r.run()));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.sfx.pop(); await s.show(wq, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Fragen mit can – ohne do!",
        say: "Mit can ist es genauso: can springt nach vorn. Kein do!",
        build(s) {
          const mk = (subj, verb, rest, low, A1, A2) => {
            const sB = B(s, subj, "sub"), cB = B(s, "can", "be"), last = B(s, rest + ".");
            const blocks = s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "8px" } }, sB, cB, B(s, verb, "verb"), last);
            const q = `Can ${low} ${verb} ${rest}?`; let done = false;
            const line = s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "12px" } },
              hear(s, q, { cls: "icon", label: "", speak: () => (done ? q : `${subj} can ${verb} ${rest}.`) }), blocks);
            const answers = s.h("div", { class: "row later", style: { flexWrap: "nowrap", gap: "8px", marginLeft: "auto" } }, ans(s, A1), ans(s, A2, true));
            line.append(answers);
            return { line, answers, run: async () => { await swap(s, sB, cB); retext(s, cB, "Can"); retext(s, sB, low); retext(s, last, rest + "?"); done = true; s.sfx.boing(); await s.wait(250); s.sfx.ding(); await s.show(answers, "right"); } };
          };
          const R = [mk("You", "swim", "fast", "you", "Yes, I can.", "No, I can't."), mk("Ruby", "ride", "a horse", "Ruby", "Yes, she can.", "No, she can't."), mk("Biscuit", "climb", "trees", "Biscuit", "Yes, it can.", "No, it can't.")];
          const merk = s.h("div", { class: "merk later" }, s.h("b", null, "can"), " springt vor die Person – ", s.h("b", null, "kein do!"), " ", s.h("span", { class: "e4-wrong" }, "Do you can swim?"), s.h("br"),
            "Nach can kommt immer die Grundform – auch bei he/she/it: She can ", s.h("b", null, "swim"), " (nicht swims).");
          const wq = s.h("div", { class: "row later", style: { gap: "10px" } }, hear(s, "What can you play?", { cls: "sm" }), hear(s, "Where can I buy a ticket?", { cls: "sm" }), hear(s, "Can I go to the toilet, please?", { cls: "sm" }));
          s.add(s.h("div", { class: "stack", style: { gap: "20px" } },
            s.h("p", { class: "t" }, s.h("b", { style: { color: VIOLET } }, "can"), " tauscht mit der Person die Plätze:"),
            ...R.map(r => r.line), merk, wq));
          R.forEach((r, i) => { r.line.classList.add("a-left"); r.line.style.setProperty("--d", i * 120 + "ms"); });
          s.sfx.whoosh();
          const SNc = [["splash", { vol: 0.6 }], ["horse", { vol: 0.6 }], ["dog-bark", { vol: 0.6 }]];
          R.forEach((r, i) => s.step(() => { s.sound(SNc[i][0], SNc[i][1]); return r.run(); }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.sfx.pop(); await s.show(wq, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Welche Frage? Der Fahrplan",
        say: "Dieser Fahrplan zeigt dir, wie du jede Frage baust. Tippe rechts auf einen Satz und schau, welchen Weg er nimmt.",
        build(s) {
          const svg = s.svg(680, 584);
          const T = (x, y, t, o = {}) => s.el("text", Object.assign({ x, y, "text-anchor": "middle", "font-size": 22, "font-weight": 700, fill: INK, text: t }, o));
          const arrow = (x1, y1, x2, y2) => { const g = s.el("g"); const a = Math.atan2(y2 - y1, x2 - x1); g.append(s.el("line", { x1, y1, x2: x2 - 10 * Math.cos(a), y2: y2 - 10 * Math.sin(a), stroke: PENCIL, "stroke-width": 4 }), s.el("polygon", { points: `${x2},${y2} ${x2 - 14 * Math.cos(a) + 8 * Math.sin(a)},${y2 - 14 * Math.sin(a) - 8 * Math.cos(a)} ${x2 - 14 * Math.cos(a) - 8 * Math.sin(a)},${y2 - 14 * Math.sin(a) + 8 * Math.cos(a)}`, fill: PENCIL })); return g; };
          const dia = (cx, cy, t) => { const g = s.el("g"); g.append(s.el("polygon", { points: `${cx},${cy - 52} ${cx + 135},${cy} ${cx},${cy + 52} ${cx - 135},${cy}`, fill: "#fff8d6", stroke: "#e2b500", "stroke-width": 3 }), T(cx, cy + 8, t)); return g; };
          const box = (cx, cy, w, h, l1, l2, col) => { const g = s.el("g"); g.append(s.el("rect", { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: 14, fill: "#fff", stroke: col, "stroke-width": 4 }), T(cx, l2 ? cy - 6 : cy + 8, l1, { fill: col }), l2 ? T(cx, cy + 22, l2, { "font-size": 19, "font-weight": 600, fill: PENCIL }) : null); return g; };
          const g = s.el("g");
          g.append(
            s.el("rect", { x: 70, y: 6, width: 200, height: 44, rx: 22, fill: INK }), T(170, 36, "Dein Satz", { fill: "#fff" }),
            arrow(170, 50, 170, 88), dia(170, 140, "am / is / are?"), arrow(170, 192, 170, 238), dia(170, 290, "can?"), arrow(170, 342, 170, 388), dia(170, 440, "he / she / it?"), arrow(170, 492, 170, 530),
            arrow(305, 140, 355, 140), arrow(305, 290, 355, 290), arrow(305, 440, 355, 440),
            T(330, 126, "ja", { fill: GREEN, "font-size": 19 }), T(330, 276, "ja", { fill: GREEN, "font-size": 19 }), T(330, 426, "ja", { fill: GREEN, "font-size": 19 }),
            T(208, 220, "nein", { fill: RED, "font-size": 19 }), T(208, 370, "nein", { fill: RED, "font-size": 19 }), T(208, 518, "nein", { fill: RED, "font-size": 19 }),
            box(510, 140, 300, 72, "Is she …?", "am/is/are nach vorn", VIOLET), box(510, 290, 300, 72, "Can he …?", "can nach vorn", VIOLET),
            box(510, 440, 300, 72, "Does she …?", "Does + Grundform", U), box(170, 554, 300, 56, "Do you …?", null, U),
          );
          svg.append(g);
          const dot = s.el("circle", { cx: 170, cy: 28, r: 13, fill: RED, stroke: "#fff", "stroke-width": 3, opacity: 0 });
          svg.append(dot);
          const P = { start: [170, 28], d1: [170, 140], d2: [170, 290], d3: [170, 440], b1: [364, 140], b2: [364, 290], b3: [364, 440], b4: [170, 522] };
          const SENT = [
            ["She is happy.", ["start", "d1", "b1"], "Is she happy?", "Yes, she is."],
            ["He can dance.", ["start", "d1", "d2", "b2"], "Can he dance?", "Yes, he can."],
            ["Ruby likes dogs.", ["start", "d1", "d2", "d3", "b3"], "Does Ruby like dogs?", "Yes, she does."],
            ["You live in Berlin.", ["start", "d1", "d2", "d3", "b4"], "Do you live in Berlin?", "Yes, I do."],
          ];
          const res = s.h("div", { class: "card soft stack", style: { gap: "8px", minHeight: "170px" } });
          let busy = 0;
          const run = async (k, speak) => {
            const my = ++busy;
            const [st, path, q, a] = SENT[k];
            btns.forEach((b, i) => b.classList.toggle("solid", i === k));
            res.innerHTML = ""; res.append(s.h("p", { class: "small pencil" }, "Satz: " + st));
            dot.setAttribute("opacity", 1);
            for (let i = 0; i < path.length - 1; i++) {
              const [x1, y1] = P[path[i]], [x2, y2] = P[path[i + 1]];
              s.sfx.tick();
              await s.tween({ dur: 380, update: v => { dot.setAttribute("cx", x1 + (x2 - x1) * v); dot.setAttribute("cy", y1 + (y2 - y1) * v); } });
              if (my !== busy || !s.alive) return;
            }
            s.sfx.ding();
            const qb = hear(s, q), ab = ans(s, a);
            res.append(qb, s.h("div", null, ab)); s.show(qb, "pop"); s.show(ab, "pop", 150);
            if (speak) s.speak(q, EN);
          };
          const btns = SENT.map((x, i) => s.h("button", { class: "btn", style: { justifyContent: "flex-start", width: "100%" }, onclick: () => { s.sfx.click(); run(i, true); } }, x[0]));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "680px 1fr", gap: "24px", alignItems: "start" } },
            svg, s.h("div", { class: "stack", style: { gap: "10px" } }, s.h("p", { class: "hand", style: { color: "var(--red)" } }, "Tippe auf einen Satz:"), ...btns, res)));
          s.show(svg, "fade"); s.sfx.whoosh();
          [0, 1, 2, 3].forEach(k => s.step(() => run(k, false)));
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Please und thank you",
        say: "Höflichkeit ist in England sehr wichtig. Mit please und Could you klingst du gleich viel freundlicher.",
        build(s) {
          const svg = s.svg(330, 186), cx = 165, cy = 150, r = 124;
          const arc = (a0, a1, col) => { const p = a => [cx + r * Math.cos(Math.PI - a * Math.PI), cy - r * Math.sin(Math.PI - a * Math.PI)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return s.el("path", { d: `M${x0},${y0} A${r},${r} 0 0 1 ${x1},${y1}`, fill: "none", stroke: col, "stroke-width": 26 }); };
          svg.append(arc(0, 0.33, "#f3a99f"), arc(0.33, 0.66, "#ffe08a"), arc(0.66, 1, "#9fd8bd"),
            s.el("text", { x: 4, y: 180, "font-size": 19, "font-weight": 700, fill: RED, text: "unhöflich" }),
            s.el("text", { x: 326, y: 180, "text-anchor": "end", "font-size": 19, "font-weight": 700, fill: GREEN, text: "sehr höflich" }));
          const needle = s.el("g"); needle.append(s.el("line", { x1: cx, y1: cy, x2: cx, y2: cy - 98, stroke: INK, "stroke-width": 7, "stroke-linecap": "round" }), s.el("circle", { cx, cy, r: 13, fill: INK }));
          svg.append(needle);
          let ang = -80; const setN = a => needle.setAttribute("transform", `rotate(${a} ${cx} ${cy})`); setN(ang);
          const V = [["Water!", -75], ["Can I have some water, please?", 15], ["Could I have some water, please?", 70]];
          const vb = V.map(([t, a]) => { const b = hear(s, t, { cls: "sm plain" }); b.classList.add("later"); b.style.width = "100%"; b.addEventListener("click", () => point(a)); return b; });
          const point = async a => { const from = ang; ang = a; await s.tween({ dur: 700, ease: "elastic", update: v => setN(from + (a - from) * v) }); };
          const PH = [["please", "bitte (beim Bitten)"], ["thank you / thanks", "danke"], ["Here you are.", "bitte schön (beim Geben)"], ["You're welcome.", "gern geschehen"], ["Excuse me", "Entschuldigung (ansprechen)"], ["Sorry!", "Entschuldigung (Fehler)"]];
          const ph = PH.map(([e, d]) => s.h("div", { class: "row later", style: { flexWrap: "nowrap", gap: "10px" } }, hear(s, e, { cls: "sm nw" }), s.h("span", { class: "small pencil" }, d)));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Deutsch „bitte“ hat im Englischen ", s.h("b", null, "drei"), " Partner: ", s.h("b", null, "please"), " · ", s.h("b", null, "Here you are"), " · ", s.h("b", null, "You're welcome"), ".");
          const lf = life(s, s.h("div", { class: "stack", style: { gap: "8px" } },
            hear(s, "Could you pass the salt, please?", { cls: "sm plain" }),
            hear(s, "Could you say that again, please?", { cls: "sm plain" }),
            hear(s, "Excuse me, can I have a bag, please?", { cls: "sm plain" })));
          lf.classList.add("later");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: "26px", alignItems: "start" } },
            s.h("div", { class: "stack", style: { gap: "8px", alignItems: "center" } }, svg, ...vb, lf),
            s.h("div", { class: "stack", style: { gap: "8px" } }, ...ph, merk)));
          s.show(svg, "zoom"); s.sfx.pop();
          V.forEach(([, a], i) => s.step(async () => { s.sfx.pop(); s.show(vb[i], "left"); await point(a); if (i === 2) s.sfx.success(); }));
          s.step(async () => { for (const p of ph) { s.sfx.pop(); await s.show(p, "right"); } });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(lf, "up"); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Interview: Ellie aus Brighton",
        say: "Ellie ist Austauschschülerin aus Brighton und besucht Lukas' Klasse in Berlin. Lukas interviewt sie.",
        build(s) {
          const D = [
            ["be", "What's your name?", "My name's Ellie."],
            ["do", "Where do you live?", "I live in Brighton, by the sea."],
            ["be", "How old are you?", "I'm eleven."],
            ["do", "Do you have any pets?", "Yes, I do. I've got a dog called Max."],
            ["can", "Can you speak German?", "Yes, I can – a little!"],
            ["does", "Does your school have a uniform?", "Yes, it does. It's blue."],
          ];
          const rows = D.map(([k, q, a]) => {
            const qb = bub(s, q, "q"), ab = bub(s, a, "a");
            qb.classList.add("later"); ab.classList.add("later");
            return { qb, ab, line: s.h("div", { style: { display: "grid", gridTemplateColumns: "64px 1fr 1.15fr", gap: "12px", alignItems: "center" } }, s.h("span", { class: "e4-chip", style: { textAlign: "center" } }, k), s.h("div", null, qb), s.h("div", { style: { textAlign: "right" } }, ab)) };
          });
          const fact = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Fakt"), s.h("p", { class: "small" }, s.h("b", null, "Brighton"), " ist ein Badeort an der Südküste Englands, 76 km südlich von London."));
          s.add(s.h("div", { class: "stack", style: { gap: "10px" } },
            s.h("div", { style: { display: "grid", gridTemplateColumns: "64px 1fr 1.15fr", gap: "12px", alignItems: "center" } }, s.h("span"),
              s.h("div", { class: "row", style: { flexWrap: "nowrap" } }, lukas(s, 54), s.h("p", { class: "h2" }, "Lukas ", s.h("span", { class: "small pencil" }, "fragt"))),
              s.h("div", { class: "row", style: { flexWrap: "nowrap", justifyContent: "flex-end" } }, s.h("p", { class: "h2" }, s.h("span", { class: "small pencil" }, "antwortet "), "Ellie"), ellie(s, 54))),
            ...rows.map(r => r.line), fact));
          s.sfx.whoosh();
          rows.forEach(r => s.step(async () => { s.sfx.pop(); await s.show(r.qb, "left"); s.sfx.note(7, 0.15); await s.show(r.ab, "right"); }));
          s.step(async () => { s.sound("seaside", { vol: 0.45, dur: 4 }); await s.show(fact, "up"); s.say("Schau auf die Etiketten links: Mal fragt Lukas mit be, mal mit do, can oder does."); });
        },
      },
      /* 12b -------------------------------------------------------------- */
      {
        title: "Brighton: by the sea",
        say: "So sieht es bei Ellie zu Hause aus: Brighton am Meer. Hör mal, wie es am Strand klingt!",
        build(s) {
          const ph = s.photo("brighton-pier", { w: 560, h: 420, pos: "50% 50%", caption: "Brighton Palace Pier und Strand" });
          const QA = [
            ["Where does Ellie live?", "She lives in Brighton."],
            ["Is Brighton by the sea?", "Yes, it is."],
            ["Can you swim in the sea there?", "Yes, you can – in summer!"],
          ];
          const lines = QA.map(([q, a]) => s.h("div", { class: "stack later", style: { gap: "6px" } }, s.h("div", null, bub(s, q, "q")), s.h("div", { style: { textAlign: "right" } }, bub(s, a, "a"))));
          const fact = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Fakt"),
            s.h("p", { class: "small" }, "Der ", s.h("b", null, "Palace Pier"), " ist eine 525 m lange Seebrücke. Sie wurde 1899 eröffnet. Am Strand liegen Kiesel statt Sand."));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "560px 1fr", gap: "26px", alignItems: "center", height: "100%" } },
            s.h("div", { class: "stack", style: { gap: "12px" } }, ph, s.h("div", { class: "row" }, s.soundBtn("seaside", "Am Strand in Brighton"))),
            s.h("div", { class: "stack", style: { gap: "12px" } }, ...lines, fact)));
          s.show(ph, "zoom"); s.sound("seaside", { vol: 0.4, dur: 5 });
          lines.forEach(l => s.step(async () => { s.sfx.pop(); await s.show(l, "up"); }));
          s.step(async () => { s.sfx.ding(); await s.show(fact, "up"); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Excuse me, where's …?",
        say: "So fragst du nach dem Weg. Der rote Punkt zeigt den Weg, den die Antwort beschreibt.",
        build(s) {
          const svg = s.svg(560, 560);
          const road = (x1, y1, x2, y2) => [s.el("line", { x1, y1, x2, y2, stroke: "#c9ced8", "stroke-width": 40, "stroke-linecap": "square" }), s.el("line", { x1, y1, x2, y2, stroke: "#fff", "stroke-width": 3, "stroke-dasharray": "14 12" })];
          svg.append(s.el("rect", { x: 0, y: 0, width: 560, height: 560, rx: 18, fill: "#eef3e8" }));
          [[40, 150, 520, 150], [40, 320, 520, 320], [100, 20, 100, 540], [280, 20, 280, 540], [460, 20, 460, 540]].forEach(r => svg.append(...road(...r)));
          const place = (x, y, w, h, fill, em, name) => { const g = s.el("g"); g.append(s.el("rect", { x, y, width: w, height: h, rx: 12, fill, stroke: "#fff", "stroke-width": 3 }), s.el("text", { x: x + w / 2, y: y + h / 2 - 6, "text-anchor": "middle", "font-size": 34, text: em }), s.el("text", { x: x + w / 2, y: y + h / 2 + 30, "text-anchor": "middle", "font-size": 21, "font-weight": 700, fill: INK, text: name })); return g; };
          svg.append(place(126, 344, 128, 170, "#9fd8bd", "🌳", "park"), place(304, 174, 132, 122, "#c9d9f7", "🚉", "station"), place(124, 26, 132, 100, "#f6d7b8", "☕", "café"), place(304, 26, 132, 100, "#e6dcf7", "🏫", "school"), place(304, 344, 132, 170, "#f3e6c4", "🏠", "houses"));
          const you = s.el("g"); const dot = s.el("circle", { cx: 280, cy: 530, r: 14, fill: RED, stroke: "#fff", "stroke-width": 4 });
          const youT = s.el("text", { x: 322, y: 538, "font-size": 21, "font-weight": 800, fill: RED, text: "You" });
          you.append(dot); svg.append(you, youT);
          const trail = s.el("polyline", { points: "", fill: "none", stroke: RED, "stroke-width": 6, "stroke-dasharray": "4 10", "stroke-linecap": "round" });
          svg.insertBefore(trail, you);
          const RT = [
            ["park", [[280, 530], [280, 420]], "Excuse me, where's the park, please?", ["Go straight on.", "The park is on the left."]],
            ["station", [[280, 530], [280, 320], [400, 320]], "Excuse me, where's the station, please?", ["Go straight on.", "Turn right at the first street.", "The station is on the left."]],
            ["café", [[280, 530], [280, 150], [190, 150]], "Excuse me, where's the café, please?", ["Go straight on.", "Turn left at the second street.", "The café is on the right."]],
          ];
          const out = s.h("div", { class: "stack", style: { gap: "8px" } });
          let token = 0;
          const run = async (k, speak) => {
            const my = ++token; const [, pts, q, aa] = RT[k];
            btns.forEach((b, i) => b.classList.toggle("solid", i === k));
            out.innerHTML = "";
            const qb = bub(s, q, "q"); out.append(qb); s.show(qb, "left"); if (speak) s.speak(q, EN); else s.sound("footsteps", { vol: 0.5, dur: 2.5, when: 0.3 });
            dot.setAttribute("cx", pts[0][0]); dot.setAttribute("cy", pts[0][1]); trail.setAttribute("points", `${pts[0][0]},${pts[0][1]}`);
            let done = [pts[0]];
            for (let i = 1; i < pts.length; i++) {
              const [x1, y1] = pts[i - 1], [x2, y2] = pts[i];
              const ab = bub(s, aa[Math.min(i - 1, aa.length - 2)], "a");
              out.append(ab); s.show(ab, "right"); s.sfx.pop();
              await s.tween({ dur: 900, update: v => { const x = x1 + (x2 - x1) * v, y = y1 + (y2 - y1) * v; dot.setAttribute("cx", x); dot.setAttribute("cy", y); trail.setAttribute("points", [...done, [x, y]].map(p => p.join(",")).join(" ")); } });
              if (my !== token || !s.alive) return;
              done.push(pts[i]);
            }
            const last = bub(s, aa[aa.length - 1], "a"); out.append(last); s.show(last, "right"); s.sfx.ding();
            const ty = bub(s, "Thank you!", "q"); out.append(ty); s.show(ty, "left", 200);
          };
          const btns = RT.map((r, i) => s.h("button", { class: "btn", onclick: () => { s.sfx.click(); run(i, true); } }, r[0]));
          const legend = s.h("div", { class: "row", style: { gap: "8px" } }, hear(s, "go straight on ↑", { cls: "sm nw", speak: "go straight on" }), hear(s, "turn left ↰", { cls: "sm nw", speak: "turn left" }), hear(s, "turn right ↱", { cls: "sm nw", speak: "turn right" }));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "560px 1fr", gap: "24px", alignItems: "start" } },
            svg, s.h("div", { class: "stack", style: { gap: "12px" } }, legend, s.h("div", { class: "row", style: { gap: "10px" } }, s.h("span", { class: "small pencil" }, "Wohin?"), ...btns), out)));
          s.show(svg, "fade"); s.sfx.whoosh();
          [0, 1, 2].forEach(k => s.step(() => run(k, false)));
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "At a café in London",
        say: "Ruby bestellt in einem Café in London. Tippe auf die Tafel und stell dir dein eigenes Essen zusammen.",
        build(s) {
          const M = [["cheese sandwich", 350], ["jacket potato", 420], ["scone with jam", 250], ["crisps", 100], ["orange juice", 180], ["hot chocolate", 260]];
          const money = p => "£" + (p / 100).toFixed(2);
          let total = 0, shown = 0, count = 0;
          const tot = s.h("span", { class: "pr", style: { marginLeft: "auto", fontFamily: "var(--f-hand)", fontSize: "34px", color: "#ffe08a" } }, money(0));
          const setTotal = t => { const from = shown; total = t; s.tween({ dur: 500, update: v => { shown = Math.round(from + (t - from) * v); tot.textContent = money(shown); } }); };
          const items = M.map(([n, p]) => {
            const b = s.h("button", { class: "e4-item" }, n, s.h("span", { class: "pr" }, money(p)));
            b.addEventListener("click", () => { s.sfx.coin(); count++; setTotal(total + p); s.speak(`Can I have ${/^[aeiou]/.test(n) ? "an" : n === "crisps" ? "some" : "a"} ${n}, please?`, EN); });
            return b;
          });
          const reset = s.h("button", { class: "btn", style: { minHeight: "56px", borderColor: "#ffe08a", color: "#ffe08a", background: "transparent" }, onclick: () => { s.sfx.click(); setTotal(0); } }, "↺ neu");
          const board = s.h("div", { class: "e4-board stack", style: { gap: "6px" } },
            s.h("p", { style: { margin: 0, font: "700 34px/1 var(--f-hand)", color: "#fff" } }, "Today's menu"),
            ...items,
            s.h("div", { class: "row", style: { flexWrap: "nowrap", marginTop: "4px" } }, s.h("span", { style: { font: "700 23px/1 var(--f-display)" } }, "Total"), reset, tot));
          const DL = [
            ["a", "Hi! What would you like?", null],
            ["q", "Can I have a jacket potato, please?", 420],
            ["a", "Sure. Anything else?", null],
            ["q", "A hot chocolate, please. How much is that?", 260],
            ["a", "That's £6.80, please.", null],
            ["q", "Here you are. Thank you!", null],
          ];
          const lines = DL.map(([k, t]) => { const b = bub(s, t, k); b.classList.add("later"); return s.h("div", { style: { textAlign: k === "q" ? "left" : "right" } }, b); });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "20px" } }, s.h("b", null, "crisps"), " = Kartoffelchips · ", s.h("b", null, "chips"), " = Pommes!  £1 = 100 ", s.h("b", null, "p"), " (pence). Preise ausgedacht.");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "470px 1fr", gap: "24px", alignItems: "start" } },
            board,
            s.h("div", { class: "stack", style: { gap: "8px" } }, s.h("div", { class: "row", style: { flexWrap: "nowrap" } }, ruby(s, 44), s.h("p", { class: "t" }, s.h("b", null, "Ruby"), " bestellt:")), ...lines, merk)));
          s.show(board, "left"); s.sound("shop-bell", { vol: 0.5 });
          for (let i = 0; i < DL.length; i += 2) s.step(async () => {
            if (i === 4) s.sound("cash-register", { vol: 0.5 });
            for (const j of [i, i + 1]) { s.sfx.pop(); await s.show(lines[j].firstChild, DL[j][0] === "q" ? "left" : "right"); if (DL[j][2]) { s.sfx.coin(); setTotal(total + DL[j][2]); } }
            if (i === 4) s.sound("coins", { vol: 0.6 });
          });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.say("Achtung: crisps sind Kartoffelchips, chips sind Pommes."); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Eine Umfrage in der Klasse",
        say: "Klasse 5a macht eine Umfrage auf Englisch. Die Balken zeigen die Antworten von 28 Kindern.",
        build(s) {
          const N = 28;
          const Q = [
            ["Do you have a pet?", 12, "Twelve pupils have a pet. Sixteen pupils don't."],
            ["Can you swim?", 26, "Twenty-six pupils can swim. Two can't."],
            ["Do you play an instrument?", 20, "Twenty pupils play an instrument. Eight don't."],
          ];
          const rows = Q.map(([q, y, rep]) => {
            const yesB = s.h("div", { style: { width: "0%", background: GREEN, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", font: "700 22px/1 var(--f-display)", overflow: "hidden", whiteSpace: "nowrap" } }, "");
            const noB = s.h("div", { style: { width: "0%", background: RED, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", font: "700 22px/1 var(--f-display)", overflow: "hidden", whiteSpace: "nowrap" } }, "");
            const bar = s.h("div", { style: { display: "flex", height: "52px", borderRadius: "12px", overflow: "hidden", background: "#eef0f3", border: "2px solid var(--line)" } }, yesB, noB);
            const r = hear(s, rep, { cls: "sm plain" }); r.classList.add("later");
            const wrap = s.h("div", { class: "card stack later", style: { gap: "6px", padding: "8px 16px" } },
              s.h("div", { style: { display: "grid", gridTemplateColumns: "380px 1fr", gap: "16px", alignItems: "center" } }, hear(s, q, { cls: "sm" }), bar), r);
            return { wrap, yesB, noB, y, r };
          });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Viele: ", s.h("b", null, "Twelve pupils have"), " a pet. Ein Kind: ", s.h("b", null, "Lukas has"), " a pet. Frage: ", s.h("b", null, "Does Ruby have"), " a pet? (Zahlen ausgedacht)");
          s.add(s.h("div", { class: "stack", style: { gap: "12px" } },
            s.h("div", { class: "row", style: { gap: "14px" } }, s.h("span", { class: "e4-chip", style: { background: GREEN, color: "#fff" } }, "yes"), s.h("span", { class: "e4-chip", style: { background: RED, color: "#fff" } }, "no"), s.h("span", { class: "small pencil" }, "28 Kinder · jede Frage an alle")),
            ...rows.map(r => r.wrap), merk));
          s.sound("classroom", { vol: 0.35, dur: 4 });
          const SNs = [["dog-bark", { vol: 0.5 }], ["splash", { vol: 0.6 }], ["piano", { vol: 0.5, dur: 2.5 }]];
          rows.forEach((r, i) => s.step(async () => {
            s.sound(SNs[i][0], SNs[i][1]); await s.show(r.wrap, "up");
            let last = -1;
            await s.tween({ dur: 1100, ease: "out", update: v => {
              const yy = Math.round(r.y * v), nn = Math.round((N - r.y) * v);
              r.yesB.style.width = (r.y / N * 100 * v) + "%"; r.noB.style.width = ((N - r.y) / N * 100 * v) + "%";
              r.yesB.textContent = r.y * v > 3 ? String(yy) : ""; r.noB.textContent = (N - r.y) * v > 3 ? String(nn) : "";
              if (yy !== last && yy % 3 === 0) { s.sfx.tick(); last = yy; }
            } });
            r.yesB.textContent = r.y > 3 ? String(r.y) : ""; r.noB.textContent = N - r.y > 3 ? String(N - r.y) : "";
            s.sfx.ding(); await s.show(r.r, "left");
          }));
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(merk, "up"); });
        },
      },
    ],
  });
})();
