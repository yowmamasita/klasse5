/* Unit 3 – My day (Uhrzeit, Wochentage, Tagesablauf, simple present, he/she/it -s, Häufigkeitsadverbien)
   Cast in this unit: Ruby (11, London, Year 7, dog Biscuit) and Lukas (10, Berlin, Klasse 5). */
(() => {
  "use strict";
  const U = "#7b4fd6", SOFT = "#ece5fb", INK = "#1b2740", BLUE = "#1d5bd0", RED = "#dc3b2a", GREEN = "#138a5a",
    ORANGE = "#ee7a1a", PENCIL = "#5d6678";
  const EN = { lang: "en-GB", rate: 0.85 };

  const CSS = `
.e3-hear{display:inline-flex;align-items:center;gap:10px;min-height:56px;padding:6px 16px;border-radius:14px;border:2px solid var(--unit);background:#fff;color:var(--ink);font:700 24px/1.2 var(--f-display);cursor:pointer;text-align:left}
.e3-hear svg{flex:none;color:var(--unit)}
.e3-hear.nw{white-space:nowrap}
.e3-hear.sm{font-size:21px;padding:4px 12px;gap:8px}
.e3-hear.plain{font:600 21px/1.3 var(--f-body)}
.e3-hear.ping{animation:e3ping .5s}
@keyframes e3ping{50%{transform:scale(1.05);background:var(--unit-soft)}}
.e3-s{display:inline-block;color:var(--red);font-weight:800}
.e3-dig{display:inline-block;font:700 30px/1 var(--f-display);font-variant-numeric:tabular-nums;background:#1b2740;color:#8dffc0;padding:10px 12px;border-radius:10px;min-width:104px;text-align:center;white-space:nowrap}
.e3-dig.sm{font-size:22px;padding:7px 9px;min-width:80px}
.e3-fly{position:absolute;z-index:4;font:800 54px/1 var(--f-display);color:var(--red);pointer-events:none;transform:translate(-50%,-50%);text-shadow:0 2px 0 #fff}
.e3-badge{width:84px;height:84px;border-radius:50%;background:var(--red);color:#fff;display:grid;place-items:center;font:800 60px/1 var(--f-display);flex:none;box-shadow:0 5px 0 rgba(0,0,0,.18)}
.e3-blk{display:inline-flex;align-items:center;height:52px;padding:0 14px;border-radius:10px;font:700 25px/1 var(--f-display);background:#fff;border:2px solid var(--line);white-space:nowrap}
.e3-blk.sub{background:#e4ecfb;border-color:#b8cdf3}
.e3-blk.adv{background:var(--unit);border-color:var(--unit);color:#fff}
.e3-blk.verb{background:#fde7e4;border-color:#f3a99f}
.e3-blk.be{background:#ffe9d2;border-color:#f6b878}
.e3-slot{display:inline-flex;overflow:visible}
.e3-tt{border-collapse:separate;border-spacing:4px;width:100%}
.e3-tt th{font:700 19px/1 var(--f-display);color:#fff;background:var(--unit);padding:9px 6px;border-radius:8px}
.e3-tt td{font:600 19px/1.1 var(--f-body);background:#fff;border:2px solid var(--line);border-radius:8px;padding:9px 6px;text-align:center;transition:background .3s,border-color .3s}
.e3-tt td.tm{font-weight:700;color:var(--pencil);background:transparent;border-color:transparent;white-space:nowrap}
.e3-tt td.brk{background:#f1f3f6;color:var(--pencil);font-style:italic}
.e3-tt td.hot{background:#fff1a8;border-color:#e2b500}
.e3-tv{display:flex;align-items:center;gap:14px;width:100%;min-height:58px;padding:6px 14px;border-radius:14px;border:2px solid var(--line);background:#fff;font:700 22px/1.2 var(--f-display);color:var(--ink);cursor:pointer;text-align:left}
.e3-tv.on{border-color:var(--unit);background:var(--unit-soft)}
.e3-day{display:flex;flex-direction:column;align-items:center;gap:8px;padding:20px 4px;border-radius:16px;border:2px solid var(--line);background:#fff;cursor:pointer;color:var(--ink);min-height:56px}
.e3-day svg{color:var(--unit)}
.e3-day b{font:700 23px/1.1 var(--f-display)}
.e3-day.we{background:#fff1e4;border-color:#f6b878}
.e3-chip{display:inline-block;padding:4px 12px;border-radius:999px;background:var(--unit-soft);font:700 19px/1.2 var(--f-display);color:var(--ink)}
.e3-cell{transition:fill .35s}
`;
  if (!document.getElementById("e3css")) { const st = document.createElement("style"); st.id = "e3css"; st.textContent = CSS; document.head.appendChild(st); }

  /* ---------------- helpers ---------------- */
  const SPK = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11"/></svg>';
  const pad = n => String(n).padStart(2, "0");
  /** rich text: {x} → red highlighted span (the he/she/it -s) */
  function rs(s, str) {
    const out = []; const re = /\{([^}]+)\}/g; let i = 0, m;
    while ((m = re.exec(str))) { if (m.index > i) out.push(str.slice(i, m.index)); out.push(s.h("span", { class: "e3-s" }, m[1])); i = re.lastIndex; }
    if (i < str.length) out.push(str.slice(i));
    return out;
  }
  const plain = str => str.replace(/[{}]/g, "");
  /** tap-to-hear button (British English) */
  function hear(s, text, o = {}) {
    const b = s.h("button", { class: "e3-hear " + (o.cls || ""), "aria-label": "Anhören: " + plain(text), html: o.noIcon ? "" : SPK });
    b.addEventListener("click", e => {
      e.stopPropagation(); s.sfx.click(); s.speak(plain(o.speak || text), EN);
      b.classList.remove("ping"); void b.offsetWidth; b.classList.add("ping");
      o.onTap && o.onTap();
    });
    const lab = o.label != null ? o.label : rs(s, text);
    if (lab !== "") b.append(s.h("span", null, lab));
    return b;
  }
  const ex = (s, label, ...kids) => s.h("div", { class: "ex" }, s.h("span", { class: "exlabel" }, label), ...kids);
  const life = (s, ...kids) => s.h("div", { class: "life" }, s.h("span", { class: "exlabel" }, "In real life · Im Alltag"), ...kids);
  function centerIn(s, el) {
    const r = el.getBoundingClientRect(), R = s.root.getBoundingClientRect(), k = R.width / 1100 || 1;
    return { x: (r.left + r.width / 2 - R.left) / k, y: (r.top + r.height / 2 - R.top) / k };
  }
  /** a letter flies in an arc from one element to another, then the target is revealed */
  async function fly(s, fromEl, toEl, txt = "s", color = RED) {
    if (!s.alive) return;
    const a = centerIn(s, fromEl), b = centerIn(s, toEl);
    const f = s.h("div", { class: "e3-fly", style: { left: a.x + "px", top: a.y + "px", color } }, txt);
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

  /* --- time in words (British) --- */
  const NUM = ["twelve", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven"];
  const MW = { 5: "five", 10: "ten", 15: "quarter", 20: "twenty", 25: "twenty-five", 30: "half" };
  const h12 = h => ((h % 12) + 12) % 12 === 0 ? 12 : ((h % 12) + 12) % 12;
  function timeWords(h, m) {
    const hw = x => NUM[((x % 12) + 12) % 12];
    if (m === 0) return `${hw(h)} o'clock`;
    if (m <= 30) return `${MW[m]} past ${hw(h)}`;
    return `${MW[60 - m]} to ${hw(h + 1)}`;
  }
  const dayPart = h => (h < 12 ? "in the morning" : h < 18 ? "in the afternoon" : h < 22 ? "in the evening" : "at night");
  const ampm = h => (h < 12 ? "am" : "pm");

  /* --- analogue clock --- */
  function makeClock(s, size, R = size / 2 - 10, o = {}) {
    const svg = s.svg(size, size), c = size / 2;
    const under = s.el("g");
    svg.append(s.el("circle", { cx: c, cy: c, r: R, fill: "#fff", stroke: INK, "stroke-width": Math.max(4, R * 0.04) }), under);
    for (let i = 0; i < 60; i++) {
      const a = i * 6 * Math.PI / 180, big = i % 5 === 0, r1 = R * (big ? 0.86 : 0.92), r2 = R * 0.97;
      svg.append(s.el("line", { x1: c + r1 * Math.sin(a), y1: c - r1 * Math.cos(a), x2: c + r2 * Math.sin(a), y2: c - r2 * Math.cos(a), stroke: big ? INK : "#9aa3b2", "stroke-width": big ? Math.max(2.5, R * 0.022) : 1.5 }));
    }
    if (o.numbers !== false) for (let i = 1; i <= 12; i++) {
      const a = i * 30 * Math.PI / 180, r = R * 0.7;
      svg.append(s.el("text", { x: c + r * Math.sin(a), y: c - r * Math.cos(a) + R * 0.075, "text-anchor": "middle", "font-size": Math.round(R * 0.2), "font-weight": 700, fill: INK, text: String(i) }));
    }
    const hourG = s.el("g"), minG = s.el("g");
    hourG.append(s.el("line", { x1: c, y1: c + R * 0.1, x2: c, y2: c - R * 0.48, stroke: INK, "stroke-width": Math.max(6, R * 0.07), "stroke-linecap": "round" }));
    minG.append(s.el("line", { x1: c, y1: c + R * 0.12, x2: c, y2: c - R * 0.8, stroke: U, "stroke-width": Math.max(4, R * 0.045), "stroke-linecap": "round" }));
    svg.append(hourG, minG, s.el("circle", { cx: c, cy: c, r: Math.max(6, R * 0.06), fill: INK }));
    let T = 0; // minutes since 0:00
    const draw = t => {
      const hh = Math.floor(t / 60), mm = t - hh * 60;
      hourG.setAttribute("transform", `rotate(${(((hh % 12) + 12) % 12 + mm / 60) * 30} ${c} ${c})`);
      minG.setAttribute("transform", `rotate(${mm * 6} ${c} ${c})`);
    };
    const api = {
      svg, c, R, under, hourG, minG,
      set(h, m) { T = h * 60 + m; draw(T); },
      async to(h, m, dur = 900) {
        let t1 = h * 60 + m; const t0 = T; T = t1;
        if (t1 < t0 && t0 - t1 > 6 * 60) t1 += 24 * 60;
        await s.tween({ from: t0, to: t1, dur, update: v => draw(v) });
        T = h * 60 + m; draw(T);
      },
    };
    api.set(12, 0);
    return api;
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
  const ruby = (s, size) => avatar(s, "ruby", size);
  const lukas = (s, size) => avatar(s, "lukas", size);

  const hexMix = (a, b, t) => {
    const pa = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16));
    return "#" + pa.map((v, i) => pad(Math.round(v + (pb[i] - v) * t).toString(16))).join("");
  };

  Deck.unit({
    id: "u3", num: 3, title: "My day", color: U, soft: SOFT,
    subtitle: "Uhrzeit, Tagesablauf und das he-she-it-s",
    blurb: "Uhrzeit, Wochentage, Tagesablauf – und das s bei he/she/it.",
    goals: [
      "Die Uhrzeit auf Englisch sagen (half past, quarter to …)",
      "Wochentage und deinen Tagesablauf beschreiben",
      "He, she, it – das s muss mit! (plays, goes, watches)",
      "always, often, never: Wie oft? – und wo steht das Wort?",
    ],
    icon(svg, el) {
      svg.append(el("circle", { cx: 35, cy: 35, r: 27, fill: "#fff", stroke: U, "stroke-width": 5 }),
        el("line", { x1: 35, y1: 35, x2: 35, y2: 16, stroke: U, "stroke-width": 4, "stroke-linecap": "round" }),
        el("line", { x1: 35, y1: 35, x2: 48, y2: 42, stroke: INK, "stroke-width": 5, "stroke-linecap": "round" }),
        el("circle", { cx: 35, cy: 35, r: 4, fill: INK }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "What's the time?",
        say: "So fragst du nach der Uhrzeit: What's the time? Wir lernen vier wichtige Uhrzeiten.",
        build(s) {
          const ck = makeClock(s, 440); ck.set(12, 0);
          const rows = [[3, 0, "It's three o'clock."], [3, 30, "It's half past three."], [3, 15, "It's quarter past three."], [3, 45, "It's quarter to four."]];
          const rowEls = rows.map(([h, m, t]) => s.h("div", { class: "row later", style: { flexWrap: "nowrap", gap: "14px" } },
            s.h("span", { class: "e3-dig" }, `${h}:${pad(m)}`), hear(s, t, { onTap: () => ck.to(h, m, 700) })));
          const merk = s.h("div", { class: "merk later" }, s.h("b", null, "half past three"), " = 3:30 = ", s.h("b", { class: "red" }, "halb vier"), "!", s.h("br"),
            "Englisch: eine halbe Stunde ", s.h("i", null, "nach"), " drei. Deutsch: eine halbe Stunde ", s.h("i", null, "vor"), " vier.");
          const top = s.h("div", { class: "row", style: { flexWrap: "nowrap" } }, hear(s, "What's the time?", { cls: "a-up" }), s.h("span", { class: "hand a-up", style: { "--d": "200ms" } }, "= Wie spät ist es?"));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "440px 1fr", gap: "40px", alignItems: "center", height: "100%" } },
            ck.svg, s.h("div", { class: "stack" }, top, ...rowEls, merk)));
          s.show(ck.svg, "zoom"); s.sfx.pop();
          const say = ["Der große Zeiger steht oben auf der Zwölf: o'clock.", "Der große Zeiger steht unten: half past. Das ist halb vier!", "Viertel nach drei: quarter past three.", "Viertel vor vier: quarter to four."];
          rows.forEach(([h, m], i) => s.step(async () => {
            s.sfx.whoosh(); await ck.to(h, m); s.sfx.ding(); s.show(rowEls[i], "left"); s.say(say[i]);
          }));
          s.step(async () => { s.sfx.boing(); await s.show(merk, "up"); s.say("Achtung Falle: half past three ist halb vier!"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "past oder to?",
        say: "Rechte Hälfte der Uhr: past, also nach. Linke Hälfte: to, also vor.",
        build(s) {
          const ck = makeClock(s, 560, 150); const c = ck.c, R = ck.R;
          const wR = s.el("path", { d: `M${c},${c} L${c},${c - R} A${R},${R} 0 0 1 ${c},${c + R} Z`, fill: BLUE, opacity: 0.16, class: "later" });
          const wL = s.el("path", { d: `M${c},${c} L${c},${c + R} A${R},${R} 0 0 1 ${c},${c - R} Z`, fill: RED, opacity: 0.16, class: "later" });
          ck.under.append(wR, wL);
          const words = { 0: "o'clock", 5: "five", 10: "ten", 15: "quarter", 20: "twenty", 25: "twenty-five", 30: "half", 35: "twenty-five", 40: "twenty", 45: "quarter", 50: "ten", 55: "five" };
          const lab = {};
          Object.entries(words).forEach(([m, w]) => {
            m = +m; const a = m * 6 * Math.PI / 180, L = R + 52;
            const col = m === 0 || m === 30 ? INK : m < 30 ? BLUE : RED;
            const t = s.el("text", { x: c + L * Math.sin(a), y: c - L * Math.cos(a) + 8, "text-anchor": "middle", "font-size": 22, "font-weight": 700, fill: col, text: w, class: m === 0 ? "" : "later" });
            ck.svg.append(t); lab[m] = t;
          });
          const capP = s.el("text", { x: c + 120, y: 548, "text-anchor": "middle", "font-size": 34, "font-weight": 800, fill: BLUE, text: "past →", class: "later" });
          const capT = s.el("text", { x: c - 120, y: 548, "text-anchor": "middle", "font-size": 34, "font-weight": 800, fill: RED, text: "← to", class: "later" });
          ck.svg.append(capP, capT);
          ck.set(7, 0);
          const exs = [[7, 5], [7, 20], [7, 40], [7, 55]].map(([h, m]) => hear(s, `It's ${timeWords(h, m)}.`, { cls: "sm", label: [s.h("span", { class: "e3-dig sm" }, `${h}:${pad(m)}`), "  " + timeWords(h, m)], onTap: () => ck.to(h, m, 700) }));
          exs.forEach(b => b.classList.add("later"));
          const merk = s.h("div", { class: "merk later" }, "Bis zur halben Stunde: ", s.h("b", { class: "blue" }, "past"), " (nach) + diese Stunde.", s.h("br"),
            "Ab der halben Stunde: ", s.h("b", { class: "red" }, "to"), " (vor) + ", s.h("b", null, "nächste"), " Stunde.");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "560px 1fr", gap: "30px", alignItems: "center", height: "100%" } },
            ck.svg, s.h("div", { class: "stack" }, s.h("p", { class: "t" }, "Tippe auf eine Zeit – die Uhr dreht sich mit:"), ...exs, merk)));
          s.show(ck.svg, "zoom"); s.sfx.pop();
          s.step(async () => {
            s.show(wR, "fade"); s.show(capP, "left"); s.sfx.whoosh();
            for (const m of [5, 10, 15, 20, 25, 30]) { ck.to(7, m, 260); s.sfx.count(m / 5); await s.show(lab[m], "pop"); }
            s.say("Fünf, zehn, Viertel, zwanzig, fünfundzwanzig nach – und halb.");
          });
          s.step(async () => {
            s.show(wL, "fade"); s.show(capT, "right"); s.sfx.whoosh();
            for (const m of [35, 40, 45, 50, 55]) { ck.to(7, m, 260); s.sfx.count(12 - m / 5); await s.show(lab[m], "pop"); }
            await ck.to(8, 0, 300); s.sfx.ding();
            s.say("Ab halb zählen wir rückwärts bis zur nächsten vollen Stunde: to.");
          });
          s.step(async () => { for (const b of exs) { s.sfx.pop(); await s.show(b, "left"); } });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Dreh selbst an der Uhr!",
        say: "Zieh den lila Minutenzeiger herum. Die Uhr sagt dir die Zeit auf Englisch.",
        build(s) {
          const ck = makeClock(s, 470);
          let H = 7, M = 15;
          ck.set(H, M);
          const dig = s.h("span", { class: "e3-dig", style: { fontSize: "40px", minWidth: "220px" } });
          const words = s.h("p", { class: "h2", style: { minHeight: "70px" } });
          const sentence = () => `It's ${timeWords(H, M)} ${dayPart(H)}.`;
          const say = s.h("button", { class: "e3-hear", html: SPK, "aria-label": "Zeit anhören" }, s.h("span", null, "Hör zu!"));
          say.addEventListener("click", () => { s.sfx.click(); s.speak(sentence(), EN); });
          const upd = () => {
            dig.textContent = `${h12(H)}:${pad(M)} ${ampm(H)}`;
            words.textContent = sentence();
          };
          upd();
          const setTo = (h, m) => { H = (h + 24) % 24; M = m; ck.set(H, M); upd(); };
          const face = ck.svg; face.style.touchAction = "none";
          const pick = p => {
            const ang = (Math.atan2(p.x - ck.c, -(p.y - ck.c)) * 180 / Math.PI + 360) % 360;
            const m = (Math.round(ang / 30) * 5) % 60;
            if (m === M) return;
            let h = H;
            if (M >= 45 && m <= 15) h++;
            else if (M <= 15 && m >= 45) h--;
            s.sfx.tick(); setTo(h, m);
          };
          s.drag(face, { space: face, onStart: pick, onMove: pick, onEnd: () => s.speak(sentence(), EN) });
          const hb = (lbl, d) => s.h("button", { class: "btn", onclick: () => { s.sfx.click(); setTo(H + d, M); } }, lbl);
          const merk = s.h("div", { class: "merk later" }, "Briten sagen Zeiten oft auch einfach mit Zahlen – wie die Digitaluhr:",
            s.h("div", { class: "row", style: { marginTop: "8px" } }, hear(s, "seven fifteen", { cls: "sm" }), hear(s, "eight forty", { cls: "sm" })));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "470px 1fr", gap: "40px", alignItems: "center", height: "100%" } },
            face, s.h("div", { class: "stack" },
              s.h("p", { class: "hand", style: { color: "var(--red)" } }, "Zieh am lila Zeiger – oder tippe aufs Zifferblatt!"),
              s.h("div", { class: "row" }, dig), words,
              s.h("div", { class: "row" }, say, hb("Stunde −", -1), hb("Stunde +", 1)),
              merk)));
          s.show(face, "zoom"); s.sfx.pop();
          s.step(async () => {
            for (const [h, m] of [[7, 30], [12, 45], [16, 5]]) { await ck.to(h, m, 700); H = h; M = m; upd(); s.sfx.ding(); await s.wait(500); }
          });
          s.step(async () => { s.sfx.pop(); await s.show(merk, "up"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "am, pm – und London",
        say: "am heißt vormittags, pm heißt nachmittags und abends. Und London ist eine Stunde hinter Berlin.",
        build(s) {
          const W = 1100, x = h => 40 + h * (1020 / 24);
          const svg = s.svg(W, 190);
          const defs = s.el("defs"); const gr = s.el("linearGradient", { id: "e3sky", x1: 0, x2: 1, y1: 0, y2: 0 });
          [[0, "#26305e"], [0.25, "#ffc98a"], [0.5, "#a9dcff"], [0.75, "#ffb67a"], [1, "#26305e"]].forEach(([o, c]) => gr.append(s.el("stop", { offset: o, "stop-color": c })));
          defs.append(gr); svg.append(defs);
          svg.append(s.el("rect", { x: x(0), y: 60, width: x(24) - x(0), height: 46, rx: 12, fill: "url(#e3sky)" }));
          svg.append(s.el("line", { x1: x(12), y1: 50, x2: x(12), y2: 116, stroke: INK, "stroke-width": 4 }));
          const amL = s.el("text", { x: x(6), y: 40, "text-anchor": "middle", "font-size": 26, "font-weight": 800, fill: BLUE, text: "am  ·  0 bis 12 Uhr", class: "later" });
          const pmL = s.el("text", { x: x(18), y: 40, "text-anchor": "middle", "font-size": 26, "font-weight": 800, fill: RED, text: "pm  ·  12 bis 24 Uhr", class: "later" });
          svg.append(amL, pmL);
          [0, 6, 12, 18, 24].forEach(h => svg.append(s.el("text", { x: x(h), y: 136, "text-anchor": h === 0 ? "start" : h === 24 ? "end" : "middle", "font-size": 19, "font-weight": 600, fill: PENCIL, text: `${h}:00` })));
          const pins = [[7, "7:00 = 7 am"], [13, "13:00 = 1 pm"], [20, "20:00 = 8 pm"]].map(([h, t]) => {
            const g = s.el("g", { class: "later" });
            g.append(s.el("circle", { cx: x(h), cy: 83, r: 10, fill: U, stroke: "#fff", "stroke-width": 3 }),
              s.el("text", { x: x(h), y: 176, "text-anchor": "middle", "font-size": 21, "font-weight": 700, fill: U, text: t }));
            svg.append(g); return g;
          });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Im Gespräch benutzen Briten meist die ", s.h("b", null, "12-Stunden-Uhr"), " mit am/pm. Die 24-Stunden-Uhr siehst du z. B. auf Fahrplänen.");
          const exb = ex(s, "Beispiele", s.h("div", { class: "stack", style: { gap: "8px" } },
            hear(s, "I get up at 7 am.", { cls: "sm plain", speak: "I get up at seven a.m." }),
            hear(s, "We have lunch at 1 pm.", { cls: "sm plain", speak: "We have lunch at one p.m." }),
            hear(s, "I go to bed at 8 pm.", { cls: "sm plain", speak: "I go to bed at eight p.m." })));
          exb.classList.add("later");
          // London vs Berlin
          const cB = makeClock(s, 140, 62, { numbers: false }), cL = makeClock(s, 140, 62, { numbers: false });
          const tB = s.h("p", { class: "small", style: { fontWeight: 700 } }), tL = s.h("p", { class: "small", style: { fontWeight: 700 } });
          const setB = h => { cB.set(h, 0); cL.set((h + 23) % 24, 0); const l = (h + 23) % 24; tB.textContent = `Berlin ${h}:00`; tL.textContent = `London ${l}:00 = ${h12(l)} ${ampm(l)}`; };
          setB(9);
          const sl = s.slider({ label: "Uhrzeit in Berlin", min: 0, max: 23, value: 9, fmt: v => v + ":00", onInput: setB });
          const lf = life(s,
            s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "12px", alignItems: "center" } },
              s.h("div", { class: "stack", style: { gap: "4px", alignItems: "center" } }, cB.svg, tB),
              s.h("div", { class: "stack", style: { gap: "4px", alignItems: "center" } }, cL.svg, tL)),
            sl,
            s.h("p", { class: "small" }, "London ist das ganze Jahr ", s.h("b", null, "1 Stunde hinter"), " Berlin. Big Ben ist die große Glocke im Elizabeth Tower – sie schlägt jede volle Stunde."));
          lf.classList.add("later");
          s.add(s.h("div", { class: "stack", style: { gap: "10px" } }, svg,
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1.05fr", gap: "24px", alignItems: "start" } }, s.h("div", { class: "stack", style: { gap: "12px" } }, merk, exb), lf)));
          s.sfx.whoosh();
          s.step(async () => { s.sfx.pop(); s.show(amL, "pop"); await s.wait(300); s.sfx.pop(); await s.show(pmL, "pop"); });
          s.step(async () => { for (const p of pins) { s.sfx.drum(); await s.show(p, "bounce"); } s.say("Sieben Uhr morgens ist 7 am, acht Uhr abends ist 8 pm."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.sfx.pop(); await s.show(exb, "up"); });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(lf, "up"); s.say("Schieb die Berliner Uhrzeit. In London ist es immer eine Stunde früher."); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Days of the week",
        say: "Die sieben Wochentage. Tippe auf einen Tag und hör ihn dir an.",
        build(s) {
          const D = [["Monday", "Montag", "Mon"], ["Tuesday", "Dienstag", "Tue"], ["Wednesday", "Mittwoch", "Wed"], ["Thursday", "Donnerstag", "Thu"], ["Friday", "Freitag", "Fri"], ["Saturday", "Samstag", "Sat"], ["Sunday", "Sonntag", "Sun"]];
          const cards = D.map(([en, de, ab], i) => {
            const b = s.h("button", { class: "e3-day later" + (i >= 5 ? " we" : ""), html: SPK, "aria-label": en },
              s.h("b", null, en), s.h("span", { class: "small pencil" }, de), s.h("span", { class: "e3-chip" }, ab));
            b.addEventListener("click", () => { s.sfx.click(); s.speak(en, EN); b.classList.remove("a-pop"); void b.offsetWidth; b.classList.add("a-pop"); });
            return b;
          });
          const merk = s.h("div", { class: "merk later" }, "Wochentage schreibst du im Englischen ", s.h("b", null, "immer groß"), ": ", s.h("b", null, "M"), "onday.", s.h("br"),
            s.h("b", null, "on"), " Monday = am Montag · ", s.h("b", null, "on"), " Monday", s.h("b", { class: "red" }, "s"), " = montags (jeden Montag)", s.h("br"),
            s.h("b", null, "Wednesday"), " spricht man „Wens-dei“ – das d hört man nicht.");
          const lf = life(s, s.h("div", { class: "stack", style: { gap: "8px" } },
            hear(s, "Ruby has swimming on Tuesdays.", { cls: "sm plain" }),
            hear(s, "Lukas has football on Fridays.", { cls: "sm plain" }),
            hear(s, "On Sundays we have a big breakfast.", { cls: "sm plain" })));
          lf.classList.add("later");
          const brW = s.h("div", { class: "later", style: { gridColumn: "1 / span 5", borderTop: "4px solid " + U, textAlign: "center", paddingTop: "4px", font: "700 22px/1.2 var(--f-display)", color: U } }, "weekdays · Wochentage (Mo–Fr)");
          const brE = s.h("div", { class: "later", style: { gridColumn: "6 / span 2", borderTop: "4px solid " + ORANGE, textAlign: "center", paddingTop: "4px", font: "700 22px/1.2 var(--f-display)", color: ORANGE } }, "the weekend");
          s.add(s.h("div", { class: "stack", style: { gap: "18px" } },
            s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "10px", rowGap: "8px" } }, cards, brW, brE),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "24px", alignItems: "start" } }, merk, lf)));
          (async () => { for (let i = 0; i < 7; i++) { if (!s.alive) return; s.sfx.count(i); s.show(cards[i], "bounce"); await s.wait(130); } })();
          s.step(async () => { s.sfx.whoosh(); await s.show(brW, "left"); s.sfx.whoosh(); await s.show(brE, "right"); s.say("Montag bis Freitag sind weekdays. Samstag und Sonntag sind the weekend."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(lf, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Ruby's day",
        say: "Das ist Ruby aus London. Wir begleiten sie durch ihren Tag.",
        build(s) {
          const EV = [
            ["⏰", 7, 0, "get up", "I get up at seven o'clock."],
            ["🥣", 7, 15, "have breakfast", "I have breakfast at quarter past seven."],
            ["🎒", 7, 45, "go to school", "I go to school at quarter to eight."],
            ["📚", 16, 30, "do homework", "I do my homework at half past four."],
            ["🛏️", 20, 30, "go to bed", "I go to bed at half past eight."],
          ];
          const SKY = ["#ffd3a1", "#cfe8ff", "#a9d8ff", "#ffd9a8", "#28305c"];
          const svg = s.svg(1100, 170);
          const sky = s.el("rect", { x: 0, y: 0, width: 1100, height: 130, rx: 18, fill: "#3a4378", class: "e3-cell" });
          const ground = s.el("rect", { x: 0, y: 118, width: 1100, height: 52, rx: 16, fill: "#8fd19e" });
          const stars = s.el("g", { opacity: 0 });
          [[180, 30], [320, 60], [520, 22], [760, 50], [930, 28], [1030, 80]].forEach(([a, b]) => stars.append(s.el("circle", { cx: a, cy: b, r: 3, fill: "#fff" })));
          const sun = s.el("circle", { cx: -40, cy: 100, r: 24, fill: "#ffcf3a", stroke: "#f2a516", "stroke-width": 5 });
          svg.append(sky, stars, sun, ground);
          const X = i => 110 + i * 220;
          const marks = EV.map(([em], i) => {
            const g = s.el("g", { class: "later" });
            g.append(s.el("circle", { cx: X(i), cy: 120, r: 9, fill: U, stroke: "#fff", "stroke-width": 3 }),
              s.el("text", { x: X(i), y: 162, "text-anchor": "middle", "font-size": 30, text: em }));
            svg.append(g); return g;
          });
          const cards = EV.map(([, h, m, verb, sent]) => s.h("div", { class: "card later stack", style: { padding: "12px", gap: "8px", alignItems: "flex-start" } },
            s.h("span", { class: "e3-dig sm" }, `${h12(h)}:${pad(m)} ${ampm(h)}`),
            s.h("p", { class: "t", style: { fontWeight: 700, color: U } }, verb),
            hear(s, sent, { cls: "sm plain", label: s.h("span", { style: { fontSize: "19px" } }, sent) })));
          const strip = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Ruby: „I ", s.h("b", null, "get up"), " at seven.“ → Über Ruby: „She ", s.h("b", null, "get"), s.h("b", { class: "red" }, "s"), " up at seven.“ Warum das s? Gleich!");
          s.add(s.h("div", { class: "stack", style: { gap: "14px" } },
            s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "14px" } }, ruby(s, 56), s.h("p", { class: "t" }, s.h("b", null, "Ruby, 11, London"), " – ihr ganz normaler Schultag:")),
            svg, s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "12px" } }, cards), strip));
          s.show(svg, "fade");
          let cur = { x: -40, y: 100, sky: "#3a4378" };
          EV.forEach(([, h, m], i) => s.step(async () => {
            const tx = X(i), frac = (h + m / 60 - 6) / 16, ty = 100 - 72 * Math.sin(Math.PI * frac);
            const from = { ...cur }, toSky = SKY[i];
            s.sfx.whoosh();
            await s.tween({ dur: 900, update: (v, t) => {
              sun.setAttribute("cx", from.x + (tx - from.x) * v); sun.setAttribute("cy", from.y + (ty - from.y) * v);
              sky.setAttribute("fill", hexMix(from.sky, toSky, t));
              if (i === 4) { stars.setAttribute("opacity", t); sun.setAttribute("fill", hexMix("#ffcf3a", "#f4f1d0", t)); }
            } });
            cur = { x: tx, y: ty, sky: toSky };
            s.sfx.pop(); s.show(marks[i], "bounce"); await s.show(cards[i], "up"); s.sfx.count(i * 2);
          }));
          s.step(async () => { s.sfx.boing(); await s.show(strip, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "He, she, it – das s muss mit!",
        say: "Bei I, you, we und they bleibt das Verb, wie es ist. Bei he, she und it fliegt ein s ans Verb.",
        build(s) {
          const badge = s.h("div", { class: "e3-badge a-pulse" }, "s");
          const L = ["I", "You", "We", "They"].map(p => hear(s, `${p} play.`, { label: [s.h("b", { class: "blue" }, p), " play"] }));
          const sS = [0, 1, 2].map(() => s.h("span", { class: "e3-s later" }, "s"));
          const Rb = ["He", "She", "It"].map((p, i) => hear(s, `${p} plays.`, { label: [s.h("b", { class: "red" }, p), " play", sS[i]] }));
          const left = s.h("div", { class: "card later stack", style: { gap: "10px", alignItems: "flex-start" } }, s.h("p", { class: "h2 blue" }, "I · you · we · they"), ...L, s.h("p", { class: "small pencil" }, "Grundform – kein s"));
          const right = s.h("div", { class: "card later stack", style: { gap: "10px", alignItems: "flex-start", borderColor: "#f3a99f" } }, s.h("p", { class: "h2 red" }, "he · she · it"), ...Rb, s.h("p", { class: "small pencil" }, "eine Person oder Sache → + s"));
          const merk = s.h("div", { class: "merk later" }, s.h("b", null, "he / she / it"), " = auch ", s.h("b", null, "Ruby"), " (she), ", s.h("b", null, "my dad"), " (he), ", s.h("b", null, "the cat"), " (it) → Verb + ", s.h("b", { class: "red" }, "s"), ".  Ruby play", s.h("b", { class: "red" }, "s"), " the guitar.");
          s.add(s.h("div", { class: "stack", style: { gap: "18px" } },
            s.h("div", { class: "row", style: { justifyContent: "center", flexWrap: "nowrap", gap: "22px" } }, badge, s.h("p", { class: "big" }, "He, she, it – das ", s.h("span", { class: "red" }, "s"), " muss mit!")),
            s.h("div", { class: "cols" }, left, right), merk));
          s.sfx.fanfare();
          s.step(async () => { s.sfx.pop(); await s.show(left, "left"); });
          s.step(async () => { s.sfx.pop(); await s.show(right, "right"); for (const sp of sS) { await fly(s, badge, sp); } s.say("Das s fliegt zu he, she und it."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Das s fliegt: 3 Beispiele",
        say: "Schau, wie das s zum Verb fliegt, sobald wir über eine Person oder ein Tier sprechen.",
        build(s) {
          const DATA = [
            ["Zuhause", "I get up at seven.", "Ruby", "get", " up at seven."],
            ["Sport", "We play football.", "Lukas", "play", " football."],
            ["Tiere", "Our cats sleep on the sofa.", "The cat", "sleep", " on the sofa."],
          ];
          const items = DATA.map(([lab, a, subj, verb, rest]) => {
            const sub = s.h("b", { class: "red" }, subj), sp = s.h("span", { class: "e3-s later" }, "s");
            const b = hear(s, `${subj} ${verb}s${rest}`, { label: [sub, " " + verb, sp, rest] }); b.classList.add("later");
            const box = ex(s, lab, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 46px 1.25fr", alignItems: "center", gap: "10px" } },
              hear(s, a, { cls: "plain" }), s.h("span", { class: "h2 pencil", style: { textAlign: "center" } }, "→"), b));
            return { box, sub, sp, b };
          });
          const again = s.h("button", { class: "btn later", onclick: async () => { s.sfx.click(); items.forEach(it => s.hide(it.sp)); for (const it of items) await fly(s, it.sub, it.sp); } }, "↻ nochmal fliegen");
          const merk8 = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Mehrere (", s.h("b", null, "Ruby and Lukas, our pets"), ") = ", s.h("b", { class: "blue" }, "they"), " → kein s: They play football. Nur ", s.h("b", { class: "red" }, "eine"), " Person oder Sache bekommt das s.");
          s.add(s.h("div", { class: "stack", style: { gap: "16px" } }, ...items.map(i => i.box), s.h("div", { class: "row", style: { justifyContent: "flex-end" } }, again), merk8));
          items.forEach((it, i) => it.box.classList.add("a-up"));
          items.forEach(it => it.box.style.setProperty("--d", "0ms"));
          s.sfx.whoosh();
          items.forEach(it => s.step(async () => { s.sfx.pop(); await s.show(it.b, "right"); await fly(s, it.sub, it.sp); }));
          s.step(async () => { s.show(again, "pop"); s.sfx.ding(); await s.show(merk8, "up"); s.say("Mehrere Katzen sind they – ohne s. Eine Katze ist it – mit s."); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Schreibung: goes, watches, tries",
        say: "Manchmal ist es mehr als nur ein s. Hier sind die vier Sonderfälle.",
        build(s) {
          const pair = (base, res, end) => s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "10px" } },
            s.h("span", { class: "t pencil" }, base), s.h("span", { class: "t pencil" }, "→"),
            hear(s, res.slice(0, res.length - end.length) + "{" + end + "}", { cls: "sm nw" }));
          const card = (head, note, pairs, foot) => s.h("div", { class: "card later stack", style: { gap: "10px", padding: "14px 18px" } },
            s.h("div", { class: "row", style: { gap: "12px" } }, s.h("span", { class: "e3-chip", style: { fontSize: "22px", background: SOFT } }, head), s.h("span", { class: "small pencil" }, note)),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 14px" } }, pairs),
            foot ? s.h("p", { class: "small" }, foot) : null);
          const C = [
            card("-o → -es", "Wörter auf o", [pair("go", "goes", "es"), pair("do", "does", "es")], "Ruby goes to school. She does her homework."),
            card("s, sh, ch, x → -es", "Zischlaute", [pair("watch", "watches", "es"), pair("wash", "washes", "es"), pair("fix", "fixes", "es"), pair("kiss", "kisses", "es")]),
            card("Konsonant + y → -ies", "y wird zu i", [pair("try", "tries", "ies"), pair("fly", "flies", "ies")], ["Aber: Vokal + y → nur s: pla", s.h("b", null, "y"), " → play", s.h("b", { class: "red" }, "s"), ", bu", s.h("b", null, "y"), " → buy", s.h("b", { class: "red" }, "s"), "."]),
            card("have → has", "Ausnahme", [pair("have", "has", "has")], "Lukas has a bike. I have a scooter."),
          ];
          const merk9 = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Hör genau hin: ", s.h("b", null, "does"), " klingt ungefähr wie „das“ mit summendem s – nicht „duus“. ", s.h("b", null, "says"), " klingt wie „ses“.", s.h("span", { style: { display: "inline-flex", gap: "10px", marginLeft: "12px", verticalAlign: "middle" } }, hear(s, "does", { cls: "sm nw" }), hear(s, "says", { cls: "sm nw" })));
          s.add(s.h("div", { class: "stack", style: { gap: "14px" } },
            s.h("p", { class: "t" }, "Bei ", s.h("b", { class: "red" }, "he, she, it"), " hängt man meistens nur ", s.h("b", null, "-s"), " an. Aber Achtung bei diesen Wörtern:"),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" } }, C), merk9));
          C.forEach((c, i) => s.step(async () => { s.sfx.scribble(); await s.show(c, "pop"); s.sfx.ding(); }));
          s.step(async () => { s.sfx.boing(); await s.show(merk9, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Aussprache: s, z oder iz?",
        say: "Das s klingt nicht immer gleich. Es gibt drei Varianten. Tippe auf die Wörter und hör genau hin.",
        build(s) {
          const wave = (kind, col) => {
            const svg = s.svg(280, 70); let d = "M6,35";
            if (kind === "s") for (let x = 6; x < 274; x += 7) d += ` L${x + 3.5},${x % 14 ? 14 : 56} L${x + 7},35`;
            if (kind === "z") for (let x = 6; x <= 274; x += 2) d += ` L${x},${35 + 22 * Math.sin((x - 6) / 6)}`;
            if (kind === "iz") { d = "M6,35 Q40,-5 74,35 Q108,75 142,35"; for (let x = 142; x <= 274; x += 2) d += ` L${x},${35 + 20 * Math.sin((x - 142) / 6)}`; }
            const p = s.el("path", { d, fill: "none", stroke: col, "stroke-width": 4, "stroke-linejoin": "round", "stroke-linecap": "round", class: "later" });
            svg.append(p); return { svg, p };
          };
          const COL = [
            ["/s/", "s", RED, "scharf wie eine Schlange: sss", ["gets", "likes", "stops"], "nach p, t, k, f"],
            ["/z/", "z", BLUE, "summt wie eine Biene: zzz", ["plays", "goes", "reads"], "nach Vokalen und den anderen Lauten"],
            ["/ɪz/", "iz", GREEN, "eine Silbe mehr: watch-es", ["watches", "washes", "dances"], "nach s, sh, ch, x, ge"],
          ];
          const cols = COL.map(([sym, k, col, hint, ws, when]) => {
            const w = wave(k, col);
            const words = ws.map(x => { const b = hear(s, x); b.classList.add("later"); return b; });
            const card = s.h("div", { class: "card stack later", style: { gap: "10px", alignItems: "center", borderColor: col } },
              s.h("p", { class: "big", style: { color: col } }, sym), w.svg, s.h("p", { class: "small", style: { textAlign: "center" } }, hint),
              ...words, s.h("p", { class: "small pencil", style: { textAlign: "center" } }, when));
            return { card, w, words };
          });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Trick: Leg die Hand an den Hals. Bei ", s.h("b", { class: "blue" }, "/z/"), " brummt es, bei ", s.h("b", { class: "red" }, "/s/"), " nicht. Und bei ", s.h("b", { class: "green" }, "/ɪz/"), " klatschst du eine Silbe mehr.");
          s.add(s.h("div", { class: "stack", style: { gap: "14px" } }, s.h("div", { class: "cols3" }, cols.map(c => c.card)), merk));
          cols.forEach((c, i) => s.step(async () => {
            s.sfx.pop(); await s.show(c.card, "up");
            if (i === 0) s.sfx.noise(0.5, 0.2, 4000, 6000, 0, 2); else if (i === 1) s.sfx.tone(180, 0.5, "sawtooth", 0.06); else { s.sfx.note(0, 0.15); s.sfx.tone(180, 0.4, "sawtooth", 0.05, 0.18); }
            await s.show(c.w.p, "draw");
            for (const b of c.words) { s.sfx.pop(); await s.show(b, "pop"); }
          }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "always, often, never: Wie oft?",
        say: "Mit diesen Wörtern sagst du, wie oft etwas passiert. Von hundert Prozent bis null Prozent.",
        build(s) {
          const x = p => 60 + p * 9.8;
          const svg = s.svg(1100, 180);
          const defs = s.el("defs"); const gr = s.el("linearGradient", { id: "e3freq", x1: 0, x2: 1, y1: 0, y2: 0 });
          gr.append(s.el("stop", { offset: 0, "stop-color": "#f1ecfb" }), s.el("stop", { offset: 1, "stop-color": U })); defs.append(gr); svg.append(defs);
          const bar = s.el("rect", { x: x(0), y: 92, width: x(100) - x(0), height: 30, rx: 15, fill: "url(#e3freq)", stroke: U, "stroke-width": 2 });
          svg.append(bar);
          const AD = [["never", 0, 72, "0 %", 158], ["sometimes", 50, 72, "≈ 50 %", 158], ["often", 70, 72, "≈ 70 %", 158], ["usually", 90, 34, "≈ 90 %", 158], ["always", 100, 72, "100 %", 172]];
          const ads = AD.map(([w, p, ly, pc, py]) => {
            const anchor = p === 0 ? "start" : p === 100 ? "end" : "middle";
            const g = s.el("g", { class: "later" });
            g.append(s.el("line", { x1: x(p), y1: ly + 6, x2: x(p), y2: 92, stroke: U, "stroke-width": 3 }),
              s.el("circle", { cx: x(p), cy: 107, r: 11, fill: "#fff", stroke: U, "stroke-width": 4 }),
              s.el("text", { x: x(p) + (p === 0 ? -6 : p === 100 ? 6 : 0), y: ly, "text-anchor": anchor, "font-size": 28, "font-weight": 800, fill: INK, text: w }),
              s.el("text", { x: x(p) + (p === 0 ? -6 : p === 100 ? 6 : 0), y: p === 90 ? 152 : py, "text-anchor": p === 90 ? "middle" : anchor, "font-size": 19, "font-weight": 600, fill: PENCIL, text: pc }));
            svg.append(g); return g;
          });
          // fix "usually"/"always" percent labels: usually at row 152 middle; always at row 172 end (no overlap)
          const NAMES = ["never", "sometimes", "often", "usually", "always"], DAYS = [0, 2, 4, 6, 7];
          const dots = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map(d => s.h("div", { style: { width: "54px", height: "54px", borderRadius: "50%", border: "3px solid " + U, display: "grid", placeItems: "center", font: "700 19px/1 var(--f-display)", transition: "background .3s,color .3s" } }, d));
          const word = s.h("span", { class: "e3-blk adv" }, "always");
          const sentHear = s.h("button", { class: "e3-hear", html: SPK, "aria-label": "Satz anhören" }, s.h("span", null, "Ruby ", word, " walks to school."));
          let cur = 4;
          sentHear.addEventListener("click", () => { s.sfx.click(); s.speak(`Ruby ${NAMES[cur]} walks to school.`, EN); });
          const setV = v => { cur = v; word.textContent = NAMES[v]; dots.forEach((d, i) => { const on = i < DAYS[v]; d.style.background = on ? U : "#fff"; d.style.color = on ? "#fff" : INK; }); };
          setV(4);
          const sl = s.slider({ label: "Wie oft geht Ruby zu Fuß zur Schule?", min: 0, max: 4, value: 4, fmt: v => NAMES[v], onInput: setV });
          const lf = life(s, s.h("div", { class: "stack", style: { gap: "8px" } },
            hear(s, "I always brush my teeth in the morning.", { cls: "sm plain" }),
            hear(s, "Lukas often plays football after school.", { cls: "sm plain" }),
            hear(s, "Biscuit, the dog, never takes the bus!", { cls: "sm plain" })));
          const left = s.h("div", { class: "card later stack", style: { gap: "12px" } }, sl, s.h("div", { class: "row", style: { gap: "8px", flexWrap: "nowrap" } }, dots), sentHear);
          lf.classList.add("later");
          s.add(s.h("div", { class: "stack", style: { gap: "12px" } }, svg, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "22px", alignItems: "start" } }, left, lf)));
          s.show(svg, "fade"); s.sfx.whoosh();
          s.step(async () => { for (let i = 0; i < ads.length; i++) { s.sfx.count(i * 2); await s.show(ads[i], "down"); } s.say("never ist nie, sometimes manchmal, often oft, usually meistens, always immer."); });
          s.step(async () => {
            s.sfx.pop(); await s.show(left, "up");
            for (let v = 0; v <= 4; v++) { if (!s.alive) return; sl.set(v); s.sfx.tick(); await s.wait(420); }
          });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(lf, "up"); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Wo steht always?",
        say: "Das Häufigkeitswort steht vor dem Verb. Aber bei am, is und are steht es dahinter.",
        build(s) {
          const B = (t, k) => s.h("span", { class: "e3-blk " + k }, t);
          const mk = (parts, advIdx, speak) => {
            const adv = parts[advIdx];
            const blocks = parts.map(([t, k], i) => (i === advIdx ? null : B(t, k)));
            const advB = B(adv[0], "adv");
            const slot = s.h("span", { class: "e3-slot later" }, advB);
            const row = s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "8px" } }, hear(s, speak, { label: "" }), ...blocks.slice(0, advIdx), slot, ...blocks.slice(advIdx + 1));
            return { row, slot, advB };
          };
          const A = [
            mk([["I", "sub"], ["always", "adv"], ["get up", "verb"], ["at seven.", ""]], 1, "I always get up at seven."),
            mk([["Lukas", "sub"], ["usually", "adv"], ["walks", "verb"], ["to school.", ""]], 1, "Lukas usually walks to school."),
            mk([["We", "sub"], ["never", "adv"], ["watch", "verb"], ["TV in the morning.", ""]], 1, "We never watch TV in the morning."),
          ];
          const Bx = [
            mk([["I", "sub"], ["am", "be"], ["always", "adv"], ["hungry after school.", ""]], 2, "I am always hungry after school."),
            mk([["Ruby", "sub"], ["is", "be"], ["often", "adv"], ["late.", ""]], 2, "Ruby is often late."),
            mk([["They", "sub"], ["are", "be"], ["never", "adv"], ["bored.", ""]], 2, "They are never bored."),
          ];
          const head = (t, c) => s.h("p", { class: "h2", style: { color: c } }, t);
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, s.h("b", null, "always, usually, often, sometimes, never"), " stehen ", s.h("b", { class: "red" }, "vor dem Verb"), " – aber ", s.h("b", { class: "orange" }, "nach am / is / are"), ".");
          s.add(s.h("div", { class: "stack", style: { gap: "10px" } },
            head("1 · vor dem Verb", RED), ...A.map(a => a.row),
            s.h("div", { style: { height: "4px" } }),
            head("2 · nach am / is / are", ORANGE), ...Bx.map(a => a.row), merk));
          s.sfx.whoosh();
          const insert = async it => {
            it.slot.classList.remove("later");
            const w = it.advB.offsetWidth;
            it.slot.style.overflow = "hidden"; it.slot.style.width = "0px";
            s.sfx.zap();
            await s.tween({ dur: 450, ease: "back", update: v => { it.slot.style.width = Math.max(0, w * v) + "px"; } });
            it.slot.style.width = ""; it.slot.style.overflow = "";
            s.sfx.snap(); it.advB.classList.remove("a-bounce"); void it.advB.offsetWidth; it.advB.classList.add("a-bounce");
            await s.wait(250);
          };
          s.step(async () => { for (const it of A) await insert(it); s.say("Vor dem Verb: I always get up."); });
          s.step(async () => { for (const it of Bx) await insert(it); s.say("Nach am, is, are: Ruby is often late."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "every day, on Mondays …",
        say: "Zeitangaben sagen, wann etwas passiert. Tippe darauf und schau, welche Felder im Wochenplan leuchten.",
        build(s) {
          const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], PARTS = ["morning", "afternoon", "evening"];
          const cw = 66, ch = 72, x0 = 140, y0 = 44;
          const svg = s.svg(x0 + 7 * cw + 4, y0 + 3 * ch + 4);
          DAYS.forEach((d, i) => svg.append(s.el("text", { x: x0 + i * cw + cw / 2, y: 30, "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: i >= 5 ? ORANGE : INK, text: d })));
          PARTS.forEach((p, j) => svg.append(s.el("text", { x: x0 - 12, y: y0 + j * ch + ch / 2 + 7, "text-anchor": "end", "font-size": 21, "font-weight": 600, fill: PENCIL, text: p })));
          const cells = PARTS.map((_, j) => DAYS.map((_, i) => { const r = s.el("rect", { x: x0 + i * cw + 3, y: y0 + j * ch + 3, width: cw - 6, height: ch - 6, rx: 8, fill: "#fff", stroke: "#c8d3de", "stroke-width": 2, class: "e3-cell" }); svg.append(r); return r; }));
          const EXP = [
            ["every day", () => true, "Ruby reads every day.", "jeden Tag"],
            ["on Mondays", (i, j) => i === 0, "Lukas has football on Mondays.", "montags"],
            ["in the morning", (i, j) => j === 0, "I have a shower in the morning.", "morgens"],
            ["at the weekend", (i, j) => i >= 5, "We visit Grandma at the weekend.", "am Wochenende"],
            ["every evening", (i, j) => j === 2, "Lukas reads a comic every evening.", "jeden Abend"],
          ];
          const sentBox = s.h("div", { class: "card soft stack", style: { gap: "6px", minHeight: "120px" } });
          const btns = EXP.map(([w, f, sent, de]) => {
            const b = s.h("button", { class: "btn", style: { justifyContent: "flex-start", width: "100%" } }, w, s.h("span", { class: "small", style: { marginLeft: "auto", fontWeight: 400, opacity: 0.8 } }, de));
            b.addEventListener("click", () => { s.sfx.click(); sel(EXP.findIndex(e => e[0] === w), true); });
            return b;
          });
          const sel = (k, speak) => {
            const [w, f, sent] = EXP[k];
            btns.forEach((b, i) => b.classList.toggle("solid", i === k));
            cells.forEach((row, j) => row.forEach((r, i) => r.setAttribute("fill", f(i, j) ? "#ffd94a" : "#fff")));
            sentBox.innerHTML = "";
            sentBox.append(s.h("span", { class: "exlabel" }, w), hear(s, sent, { cls: "plain" }));
            sentBox.classList.remove("a-pop"); void sentBox.offsetWidth; sentBox.classList.add("a-pop");
            s.sfx.coin();
            if (speak) s.speak(sent, EN);
          };
          sel(0, false);
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Zeitangaben stehen meist ", s.h("b", null, "am Satzende"), ".", s.h("br"), s.h("b", null, "at the weekend"), " ist britisch – Amerikaner sagen ", s.h("i", null, "on the weekend"), ".");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "640px 1fr", gap: "30px", alignItems: "start" } },
            s.h("div", { class: "stack", style: { gap: "16px" } }, s.h("div", { class: "card", style: { padding: "10px" } }, svg), sentBox),
            s.h("div", { class: "stack", style: { gap: "12px" } }, ...btns, merk)));
          s.show(svg, "zoom"); s.sfx.pop();
          [1, 2, 3, 4].forEach(k => s.step(async () => { sel(k, false); await s.wait(400); }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Ruby's school timetable",
        say: "So sieht Rubys Stundenplan in London aus. Die Schule beginnt um Viertel vor neun.",
        build(s) {
          const R = [
            ["8:45", ["Registration"]],
            ["9:00", ["Maths", "English", "Maths", "Science", "English"]],
            ["10:00", ["English", "Science", "History", "Maths", "French"]],
            ["11:00", ["Break"]],
            ["11:15", ["Science", "PE", "Geography", "English", "Music"]],
            ["12:15", ["Lunch"]],
            ["1:15", ["Art", "Maths", "PE", "Computing", "Maths"]],
            ["2:15", ["History", "Music", "English", "Art", "PE"]],
          ];
          const td = {};
          const tb = s.h("table", { class: "e3-tt" },
            s.h("tr", null, s.h("th", { style: { background: "transparent" } }, ""), ["Mon", "Tue", "Wed", "Thu", "Fri"].map(d => s.h("th", null, d))),
            R.map(([t, subs], ri) => s.h("tr", null, s.h("td", { class: "tm" }, t),
              subs.length === 1 ? (td[ri + "-0"] = s.h("td", { colspan: 5, class: subs[0] === "Registration" ? "" : "brk" }, subs[0]))
                : subs.map((x, ci) => (td[ri + "-" + ci] = s.h("td", null, x))))));
          const sents = [
            ["School starts at quarter to nine.", ["0-0"]],
            ["On Mondays Ruby has Maths at nine o'clock.", ["1-0"]],
            ["Lunch is at quarter past twelve.", ["5-0"]],
            ["On Fridays she has PE at quarter past two.", ["7-4"]],
          ];
          const sBtn = sents.map(([t]) => { const b = hear(s, t, { cls: "sm plain" }); b.classList.add("later"); b.style.width = "100%"; return b; });
          const hot = keys => { Object.values(td).forEach(c => c.classList.remove("hot")); keys.forEach(k => td[k] && td[k].classList.add("hot")); };
          sBtn.forEach((b, i) => b.addEventListener("click", () => hot(sents[i][1])));
          const fact = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Fakt"), s.h("p", { class: "small" }, "In England sollen staatliche Schulen mindestens ", s.h("b", null, "32,5 Stunden"), " pro Woche Unterricht geben – das ist 8:45 bis 3:15 pm an 5 Tagen. ", s.h("b", null, "PE"), " = Sport."));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "640px 1fr", gap: "24px", alignItems: "start" } },
            s.h("div", { class: "stack", style: { gap: "8px" } }, s.h("div", { class: "row", style: { flexWrap: "nowrap" } }, ruby(s, 48), s.h("p", { class: "t" }, s.h("b", null, "Ruby, Year 7"), " (ausgedachter Plan)")), tb),
            s.h("div", { class: "stack", style: { gap: "10px" } }, ...sBtn, fact)));
          s.show(tb, "up"); s.sfx.whoosh();
          sents.forEach(([, keys], i) => s.step(async () => { hot(keys); s.sfx.coin(); await s.show(sBtn[i], "left"); }));
          s.step(async () => { hot([]); s.sfx.ding(); await s.show(fact, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Weekend: London vs Berlin",
        say: "Was machen Ruby in London und Lukas in Berlin am Wochenende? Achte auf das rote s.",
        build(s) {
          const M = [["Sat", "On Saturdays Ruby get{s} up at nine."], ["Sat", "She play{s} football in Hyde Park."], ["Sat", "She often visit{s} her grandma."], ["Sun", "On Sundays she watch{es} a film."]];
          const J = [["Sat", "On Saturdays Lukas sleep{s} late."], ["Sat", "He ride{s} his bike to Tempelhofer Feld."], ["Sat", "He sometimes go{es} to the cinema."], ["Sun", "On Sundays he ha{s} lunch with Grandpa."]];
          const col = (av, name, city, list) => {
            const its = list.map(([d, t]) => s.h("div", { class: "row later", style: { flexWrap: "nowrap", gap: "10px" } }, s.h("span", { class: "e3-chip", style: { minWidth: "56px", textAlign: "center" } }, d), hear(s, t, { cls: "sm plain" })));
            const card = s.h("div", { class: "card stack", style: { gap: "10px" } }, s.h("div", { class: "row", style: { flexWrap: "nowrap" } }, av, s.h("p", { class: "h2" }, name, s.h("span", { class: "small pencil" }, "  · " + city))), ...its);
            return { card, its };
          };
          const a = col(ruby(s, 64), "Ruby", "London", M), b = col(lukas(s, 64), "Lukas", "Berlin", J);
          const strip = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Wenn Lukas samstags um 9 Uhr aufwacht, ist es in London erst 8 Uhr – Ruby schläft noch!");
          s.add(s.h("div", { class: "stack", style: { gap: "16px" } }, s.h("div", { class: "cols", style: { gap: "20px" } }, a.card, b.card), strip));
          s.show(a.card, "left"); s.show(b.card, "right"); s.sfx.whoosh();
          for (let i = 0; i < 4; i++) s.step(async () => { s.sfx.pop(); await s.show(a.its[i], "left"); s.sfx.pop(); await s.show(b.its[i], "right"); });
          s.step(async () => { s.sfx.ding(); await s.show(strip, "up"); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "What's on TV?",
        say: "Ein Fernsehprogramm auf Englisch. Tippe auf eine Sendung: Die Uhr springt auf die Startzeit.",
        build(s) {
          const ck = makeClock(s, 270);
          ck.set(7, 0);
          const SH = [[7, 0, "Wake Up Cartoons"], [9, 30, "Animal Rescue"], [12, 15, "Science Lab"], [16, 30, "Football Stars"], [17, 45, "The Big Quiz"], [18, 30, "Goodnight Stories"]];
          const out = s.h("div", { class: "stack", style: { gap: "10px", minHeight: "86px", justifyContent: "center" } });
          const rows = SH.map(([h, m, name], i) => {
            const b = s.h("button", { class: "e3-tv" }, s.h("span", { class: "e3-dig sm" }, `${h12(h)}:${pad(m)}`), s.h("span", { class: "small pencil", style: { width: "34px" } }, ampm(h)), name);
            b.addEventListener("click", () => pick(i, true));
            return b;
          });
          const pick = async (i, speak) => {
            const [h, m, name] = SH[i];
            rows.forEach((r, k) => r.classList.toggle("on", k === i));
            const sent = `${name} start{s} at ${timeWords(h, m)} ${dayPart(h)}.`;
            out.innerHTML = ""; const hb = hear(s, sent, { cls: "plain" }); out.append(hb);
            s.show(hb, "up"); s.sfx.click();
            if (speak) s.speak(plain(sent), EN);
            await ck.to(h, m, 700); s.sfx.ding();
          };
          const lf = life(s, s.h("p", { class: "small" }, s.h("b", null, "CBBC"), " (der Kinderkanal der BBC) sendet jeden Tag von ", s.h("b", null, "7 am bis 7 pm"), ". Die Sendungen hier sind ausgedacht."),
            hear(s, "Lukas usually watch{es} one episode after dinner.", { cls: "sm plain" }));
          lf.classList.add("later");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px", alignItems: "start" } },
            s.h("div", { class: "card stack", style: { gap: "8px" } }, s.h("p", { class: "h2" }, "Kids' TV – Saturday"), ...rows),
            s.h("div", { class: "stack", style: { gap: "12px", alignItems: "center" } }, ck.svg, out, lf)));
          s.sfx.whoosh(); s.show(ck.svg, "zoom");
          s.step(async () => { await pick(1, false); s.say("Animal Rescue beginnt um halb zehn. Starts – mit s, denn die Sendung ist it."); });
          s.step(async () => { await pick(3, false); });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(lf, "up"); });
        },
      },
    ],
  });
})();
