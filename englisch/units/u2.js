/* Unit 2 – Family, friends and pets.
   Cast (used again in Unit 2): Lukas (10, Berlin), his sister Julia (8) and her cat Mo,
   Lukas' pen pal Ruby (11, London, Year 7) and her dog Biscuit.
   Slides 6a/6b: possessive 's in depth (girl's / girls', animals, two owners) and the three meanings of 's. */
(() => {
  "use strict";
  const CSS = `
.e2spk{display:inline-flex;align-items:center;gap:10px;min-height:56px;padding:6px 16px 6px 10px;border-radius:14px;border:2px solid var(--unit);background:#fff;color:var(--ink);font:700 23px/1.2 var(--f-display);cursor:pointer;text-align:left}
.e2spk .ic{flex:none;width:32px;height:32px;border-radius:50%;background:var(--unit);color:#fff;display:grid;place-items:center}
.e2spk .ic svg{width:19px;height:19px}
.e2spk .tx{display:flex;flex-direction:column;gap:2px;min-width:0}
.e2spk small{font:400 19px/1.2 var(--f-body);color:var(--pencil)}
.e2spk.on{background:var(--unit-soft)}
.e2spk.sm{font-size:21px}
.e2spk.big{font-size:34px;padding:10px 24px 10px 14px}
.e2spk.big .ic{width:42px;height:42px}
.e2spk.big .ic svg{width:24px;height:24px}
.e2spk.bub{border-color:var(--line);border-radius:22px 22px 22px 6px;align-self:flex-start;max-width:100%}
.e2spk.bub.r{align-self:flex-end;border-radius:22px 22px 6px 22px;background:#eef3fd;border-color:#b9cdf3}
.e2spk.full{width:100%}
.e2who{font:700 19px/1 var(--f-display);color:var(--pencil)}
.e2key{width:100%;height:76px;border-radius:14px;border:2px solid var(--line);background:#fff;font:800 34px/1 var(--f-display);color:var(--ink);cursor:pointer;padding:0}
.e2key.tr{border-color:var(--red);color:var(--red);background:#fdecea}
.e2tile{display:inline-grid;place-items:center;min-width:70px;height:84px;padding:0 12px;border-radius:14px;background:var(--unit);color:#fff;font:800 44px/1 var(--f-display)}
.e2tile.dbl{background:var(--red)}
.e2hl{color:var(--red)}
.e2var{background:#fff3b8;border-radius:8px;padding:0 6px;display:inline-block}
.e2x{text-decoration:line-through;text-decoration-thickness:3px;color:var(--red)}
.e2tabs{display:flex;gap:12px;flex-wrap:wrap}
.e2tab{min-height:56px;padding:0 20px;border-radius:14px;border:2px solid var(--unit);background:#fff;color:var(--unit);font:700 22px/1 var(--f-display);cursor:pointer}
.e2tab.on{background:var(--unit);color:#fff}
.e2g{transform-box:fill-box;transform-origin:50% 100%}
.e2av{display:flex;align-items:center;gap:12px;padding:6px 14px 6px 6px;border-radius:16px;border:2px solid var(--line);background:#fff;cursor:pointer;font:700 24px/1.1 var(--f-display);color:var(--ink);min-height:56px}
.e2av.on{border-color:var(--unit);background:var(--unit-soft)}
.e2pair{display:flex;flex-direction:column;gap:8px}
.e2num{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;min-height:56px;padding:12px 4px;border-radius:14px;border:2px solid var(--line);background:#fff;cursor:pointer;color:var(--ink)}
.e2num b{font:800 32px/1 var(--f-display)}
.e2num span{font:400 19px/1.1 var(--f-body)}
.e2num.teen{border-color:var(--unit)}
.e2num.ty{border-color:var(--orange)}
.e2st{color:var(--red);font-weight:700}
.e2art{display:inline-block;min-width:46px;text-align:center;border-radius:10px;padding:2px 8px;color:#fff;font-weight:800}
.e2art.a{background:var(--blue)} .e2art.an{background:var(--violet)}
.e2row{display:grid;align-items:center;gap:10px}
.e2time{font:700 22px/1 var(--f-display);color:var(--pencil);font-variant-numeric:tabular-nums}
.e2pron{display:inline-block;color:#fff;border-radius:10px;padding:3px 10px;font:800 24px/1.15 var(--f-display);min-width:62px;text-align:center}
.e2mail{background:#fff;border:2px solid var(--line);border-radius:18px;padding:14px 20px;display:flex;flex-direction:column;gap:8px}
.e2mail .hd{font:400 19px/1.3 var(--f-body);color:var(--pencil);border-bottom:2px solid var(--line);padding-bottom:8px}
`;
  if (!document.getElementById("e2css")) { const st = document.createElement("style"); st.id = "e2css"; st.textContent = CSS; document.head.appendChild(st); }

  const SPK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16.5 9a4 4 0 010 6"/><path d="M19 6.5a8 8 0 010 11"/></svg>';
  const EN = (s, t) => s.speak(t, { lang: "en-GB", rate: 0.85 });

  /* ---------- motion helpers ---------- */
  const noAnim = el => { [...el.classList].forEach(c => { if (/^a-/.test(c)) el.classList.remove(c); }); };
  function bump(s, el, k = 0.12) {
    noAnim(el);
    return s.tween({ dur: 380, ease: "out", update: (v, t) => { el.style.transform = `scale(${1 + k * Math.sin(Math.PI * t)})`; } }).then(() => { el.style.transform = ""; });
  }
  async function flip(s, el, content) {
    const set = () => { el.textContent = ""; if (typeof content === "string") el.textContent = content; else el.append(content); };
    if (s.fast || !s.alive) { set(); return; }
    noAnim(el);
    await s.tween({ dur: 140, ease: "in", update: v => { el.style.transform = `scaleY(${1 - v})`; } });
    set();
    await s.tween({ dur: 240, ease: "back", update: v => { el.style.transform = `scaleY(${v})`; } });
    el.style.transform = "";
  }

  /** tap-to-hear button. label may be a node/array; o: {say, de, who, cls, later, on} */
  function spk(s, text, o = {}) {
    const ic = s.h("span", { class: "ic" }); ic.innerHTML = SPK_ICON;
    const tx = s.h("span", { class: "tx" });
    if (o.who) tx.append(s.h("span", { class: "e2who" }, o.who));
    tx.append(s.h("span", { class: "lb" }, o.label || text));
    if (o.de) tx.append(s.h("small", null, o.de));
    const b = s.h("button", { class: `e2spk ${o.cls || ""} ${o.later ? "later" : ""}` }, ic, tx);
    b.addEventListener("click", () => { EN(s, typeof o.say === "function" ? o.say() : (o.say || text)); s.sfx.pop(); bump(s, b, 0.06); if (o.on) o.on(b); });
    return b;
  }
  /** play several speak-buttons in order (estimated speaking time) */
  async function playSeq(s, items) {
    for (const [el, text] of items) {
      if (!s.alive) return;
      el.classList.add("on"); EN(s, text); s.sfx.tick();
      await s.wait(900 + text.length * 75);
      el.classList.remove("on");
    }
  }
  const life = (s, label, ...kids) => s.h("div", { class: "life" }, s.h("span", { class: "exlabel" }, label), ...kids);
  const ex = (s, label, ...kids) => s.h("div", { class: "ex" }, s.h("span", { class: "exlabel" }, label), ...kids);

  /* ---------- the cast, drawn in SVG (origin = between the feet, height 200 at scale 1) ---------- */
  const CAST = {
    lukas: { skin: "#f2c9a5", hair: "#7a4b25", style: "short", shirt: "#ee7a1a", h: 150 },
    julia: { skin: "#f4cfae", hair: "#e2b649", style: "pony", shirt: "#138a5a", h: 126 },
    ruby: { skin: "#a8724a", hair: "#2a1a12", style: "curly", shirt: "#1e3a6e", tie: "#c0392b", skirt: "#2c3e50", glasses: true, h: 160 },
  };
  function person(s, o) {
    const E = s.el, sc = (o.h || 200) / 200;
    const outer = E("g", { class: "e2g" });
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
    const E = s.el, outer = E("g", { class: "e2g" }), g = E("g", { transform: `translate(${x} ${y}) scale(${sc})` });
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
  function cat(s, { x, y, sc = 1, c = "#8d96a3" }) {
    const E = s.el, outer = E("g", { class: "e2g" }), g = E("g", { transform: `translate(${x} ${y}) scale(${sc})` });
    outer.append(g);
    g.append(E("path", { d: "M-34 -40 Q-62 -50 -52 -96", stroke: c, "stroke-width": 9, "stroke-linecap": "round", fill: "none" }));
    [-26, -12, 14, 26].forEach(lx => g.append(E("rect", { x: lx, y: -30, width: 10, height: 30, rx: 4, fill: c })));
    g.append(E("ellipse", { cx: 0, cy: -40, rx: 38, ry: 19, fill: c }));
    g.append(E("path", { d: "M26 -82 L28 -106 L42 -90 Z M50 -90 L62 -106 L62 -80 Z", fill: c }));
    g.append(E("circle", { cx: 44, cy: -70, r: 21, fill: c }));
    g.append(E("circle", { cx: 37, cy: -74, r: 3.4, fill: "#1b2740" }), E("circle", { cx: 52, cy: -74, r: 3.4, fill: "#1b2740" }), E("path", { d: "M42 -66 L46 -66 L44 -63 Z", fill: "#e88a9a" }));
    g.append(E("path", { d: "M30 -64 L16 -66 M30 -61 L16 -58 M58 -64 L72 -66 M58 -61 L72 -58", stroke: "#4b5262", "stroke-width": 1.6 }));
    return outer;
  }

  /* ---------- extra CSS for unit 2 ---------- */
  const CSS2 = `
.e2tok{display:inline-block;white-space:nowrap;padding:6px 12px;border-radius:12px;background:#fff;border:3px solid var(--line);font:700 30px/1.15 var(--f-display);position:relative}
.e2tok.v{border-color:var(--red);color:var(--red)}
.e2tok.p{border-color:var(--blue);color:var(--blue)}
.e2tok.q{border:0;background:none;padding:6px 2px}
.e2emo{font-size:34px;line-height:1;letter-spacing:2px;white-space:nowrap}
.e2chk{flex:none;width:34px;height:34px;border-radius:8px;border:3px solid var(--unit);display:grid;place-items:center;background:#fff}
.e2poss{display:inline-block;color:#fff;border-radius:10px;padding:3px 10px;font:800 24px/1.15 var(--f-display);min-width:70px;text-align:center}
.e2field{display:grid;grid-template-columns:150px 1fr;gap:12px;align-items:center}
.e2field > span{font:700 19px/1.2 var(--f-display);color:var(--pencil)}
.e2month{min-height:74px;border-radius:14px;border:2px solid transparent;font:700 22px/1 var(--f-display);cursor:pointer;color:var(--ink)}
.e2month.hot{outline:4px solid var(--ink);outline-offset:-4px}
.e2lyr{font:700 24px/1.4 var(--f-display);color:var(--pencil);transition:color .2s}
.e2lyr.on{color:var(--red)}
.e2sb{display:grid}
`;
  if (!document.getElementById("e2css2")) { const st = document.createElement("style"); st.id = "e2css2"; st.textContent = CSS2; document.head.appendChild(st); }

  const SC = () => { const st = document.getElementById("stage"); return st ? st.getBoundingClientRect().width / 1180 || 1 : 1; };
  /** move children of row into a new order with a FLIP animation */
  async function reorder(s, row, els, arc = 50) {
    const sc = SC();
    const first = new Map(els.map(e => [e, e.getBoundingClientRect()]));
    els.forEach(e => row.appendChild(e));
    if (s.fast || !s.alive) return;
    const d = els.map(e => { const l = e.getBoundingClientRect(), f = first.get(e); return { e, dx: (f.left - l.left) / sc, dy: (f.top - l.top) / sc }; });
    d.forEach(x => { noAnim(x.e); x.e.style.transform = `translate(${x.dx}px,${x.dy}px)`; });
    await s.tween({ dur: 800, ease: "inOut", update: (v, t) => d.forEach(x => { const lift = Math.abs(x.dx) > 4 ? (x.dx > 0 ? arc : -arc) * Math.sin(Math.PI * t) : 0; x.e.style.transform = `translate(${x.dx * (1 - v)}px,${x.dy * (1 - v) + lift}px)`; }) });
    d.forEach(x => (x.e.style.transform = ""));
  }

  /* pronoun colours – same as Unit 1 */
  const PC = { I: "#1d5bd0", you: "#138a5a", he: "#ee7a1a", she: "#dc3b2a", it: "#8a5a2b", we: "#7b4fd6", they: "#0e7c8c" };

  /* Ruby's family */
  const FAM = {
    pat: { name: "Pat", x: 300, y: 150, o: { skin: "#f4d3b8", hair: "#d4d4d4", style: "bun", shirt: "#7b4fd6", skirt: "#5d6678", glasses: true, h: 138 } },
    ken: { name: "Ken", x: 400, y: 150, o: { skin: "#f2c9a5", hair: "#cfcfcf", style: "bald", shirt: "#2f6f4f", h: 144 } },
    sarah: { name: "Sarah", x: 160, y: 345, o: { skin: "#a8724a", hair: "#2a1a12", style: "long", shirt: "#dc3b2a", h: 142 } },
    tom: { name: "Tom", x: 260, y: 345, o: { skin: "#f0c8a0", hair: "#b5532a", style: "short", shirt: "#1d5bd0", beard: true, h: 152 } },
    lucy: { name: "Lucy", x: 480, y: 345, o: { skin: "#f0c8a0", hair: "#b5532a", style: "long", shirt: "#ee7a1a", skirt: "#3a4560", h: 140 } },
    dev: { name: "Dev", x: 580, y: 345, o: { skin: "#8a5a3a", hair: "#1b1b1b", style: "short", shirt: "#138a5a", beard: true, h: 150 } },
    ruby: { name: "Ruby", x: 115, y: 540, o: Object.assign({}, CAST.ruby, { h: 118 }) },
    sam: { name: "Sam", x: 205, y: 540, o: { skin: "#b07a50", hair: "#2a1a12", style: "short", shirt: "#e8b923", h: 94 } },
    leo: { name: "Leo", x: 280, y: 540, o: { skin: "#b07a50", hair: "#2a1a12", style: "short", shirt: "#2f9e44", h: 94 } },
    maya: { name: "Maya", x: 530, y: 540, o: { skin: "#b98055", hair: "#1b1b1b", style: "pony", shirt: "#f06fa5", h: 110 } },
  };
  function buildTree(s) {
    const svg = s.svg(700, 590), E = s.el;
    const ln = (d, dash) => E("path", { d, stroke: "#8a94a6", "stroke-width": 4, fill: "none", "stroke-linecap": "round", "stroke-dasharray": dash || null });
    const lines = {
      g1: [ln("M322 96 L378 96 M350 96 L350 186 M260 186 L480 186 M260 186 L260 196 M480 186 L480 196")],
      g2: [ln("M182 292 L238 292 M210 292 L210 382 M115 382 L280 382 M115 382 L115 418 M205 382 L205 444 M280 382 L280 444")],
      g3: [ln("M502 292 L558 292 M530 292 L530 428")],
    };
    Object.values(lines).flat().forEach(l => { l.classList.add("later"); svg.append(l); });
    const figs = {}, labels = {};
    Object.entries(FAM).forEach(([k, f]) => {
      figs[k] = person(s, Object.assign({}, f.o, { x: f.x, y: f.y }));
      figs[k].classList.add("later");
      labels[k] = E("text", { x: f.x, y: f.y + 24, "text-anchor": "middle", class: "lbl later", style: { fontWeight: 700 }, text: f.name });
      svg.append(figs[k], labels[k]);
    });
    figs.biscuit = dog(s, { x: 352, y: 540, sc: 0.62 }); figs.biscuit.classList.add("later");
    labels.biscuit = E("text", { x: 365, y: 564, "text-anchor": "middle", class: "lbl later", style: { fontWeight: 700 }, text: "Biscuit" });
    svg.append(figs.biscuit, labels.biscuit);
    return { svg, figs, labels, lines };
  }

  const ORD = ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth"];
  const ordWord = n => (n < 20 ? ORD[n] : n === 20 ? "twentieth" : n === 30 ? "thirtieth" : (n < 30 ? "twenty-" : "thirty-") + ORD[n % 10]);
  const suf = n => (n % 100 >= 11 && n % 100 <= 13 ? "th" : n % 10 === 1 ? "st" : n % 10 === 2 ? "nd" : n % 10 === 3 ? "rd" : "th");
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  Deck.unit({
    id: "u2", num: 2, title: "Family, friends and pets", color: "#0f766e", soft: "#dcf3ef",
    subtitle: "This is my family!",
    blurb: "Familie, have got, my/your, 's, Plural, Haustiere, Geburtstage.",
    goals: [
      "Rubys Familie kennenlernen: mum, dad, cousin …",
      "Sagen, was du hast: I've got a sister.",
      "my, your, his … – und 's: Julia's cat, the girls' room, he's",
      "Plural: dogs, boxes, babies – und children, feet, mice",
      "Leute und Haustiere beschreiben, Geburtstage feiern",
    ],
    icon(svg, el) {
      svg.append(el("circle", { cx: 22, cy: 24, r: 11, fill: "#0f766e", opacity: 0.85 }), el("circle", { cx: 48, cy: 24, r: 11, fill: "#0f766e", opacity: 0.55 }),
        el("rect", { x: 10, y: 38, width: 24, height: 24, rx: 10, fill: "#0f766e", opacity: 0.85 }), el("rect", { x: 36, y: 38, width: 24, height: 24, rx: 10, fill: "#0f766e", opacity: 0.55 }));
    },
    slides: [
      /* 1 ------------------------------------------------------------ */
      {
        title: "Ruby's family tree",
        say: "Das ist Rubys Familie. Wir bauen den Stammbaum Schritt für Schritt – von Ruby aus.",
        build(s) {
          const T = buildTree(s);
          const W = [
            ["ruby", "This is me, Ruby!", "Ich – Ruby", null],
            ["sarah", "my mum, Sarah", "Mama", null], ["tom", "my dad, Tom", "Papa", null],
            ["sam", "my brothers, Sam and Leo", "Brüder (Zwillinge = twins)", null],
            ["pat", "my grandma, Pat", "Oma", null], ["ken", "my grandpa, Ken", "Opa", null],
            ["lucy", "my aunt, Lucy", "Tante", null], ["dev", "my uncle, Dev", "Onkel", null], ["maya", "my cousin, Maya", "Cousine", null],
          ];
          const btn = {};
          W.forEach(([k, t, d]) => { btn[k] = spk(s, t, { label: s.h("span", null, t, " ", s.h("span", { class: "small pencil", style: { fontWeight: 400 } }, "· " + d)), cls: "sm full later", on: () => bump(s, T.figs[k], 0.12) }); });
          Object.entries(T.figs).forEach(([k, g]) => { g.style.cursor = "pointer"; g.addEventListener("click", () => { const w = W.find(x => x[0] === k); EN(s, w ? w[1] : "This is our dog, Biscuit."); s.sfx.pop(); bump(s, g, 0.12); }); });
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "700px 1fr", gap: "16px", height: "100%" } }, T.svg,
            s.h("div", { class: "stack", style: { gap: "8px" } }, ...W.map(w => btn[w[0]]))));
          const show = async (keys, lines) => {
            if (lines) { s.sfx.scribble(); await s.show(lines, "draw"); }
            keys.forEach((k, i) => setTimeout(() => s.alive && s.sfx.pop(), i * 140));
            await s.show(keys.map(k => T.figs[k]), "pop");
            s.show(keys.map(k => T.labels[k]), "fade");
            const bs = keys.map(k => btn[k]).filter(Boolean);
            if (bs.length) await s.show(bs, "right");
          };
          show(["ruby"]);
          s.step(() => show(["sarah", "tom"], T.lines.g2).then(() => s.say("Rubys Eltern heißen Sarah und Tom.")));
          s.step(() => { s.sound("dog-bark", { vol: 0.5, when: 0.5 }); return show(["sam", "leo", "biscuit"]).then(() => s.say("Sam und Leo sind Zwillinge – twins. Sie sind sechs.")); });
          s.step(() => show(["pat", "ken"], T.lines.g1));
          s.step(() => show(["lucy", "dev", "maya"], T.lines.g3).then(() => s.say("Lucy ist Toms Schwester. Ihre Tochter Maya ist Rubys Cousine.")));
        },
      },
      /* 2 ------------------------------------------------------------ */
      {
        title: "Who's who?",
        say: "Wer jemand ist, hängt davon ab, von wem aus du schaust. Für Ruby ist Lucy die Tante – für Maya ist Lucy die Mama!",
        build(s) {
          const T = buildTree(s);
          Object.values(T.figs).forEach(g => g.classList.remove("later"));
          Object.values(T.labels).forEach(g => g.classList.remove("later"));
          Object.values(T.lines).flat().forEach(g => g.classList.remove("later"));
          const VIEW = {
            ruby: { pat: "grandma", ken: "grandpa", sarah: "mum", tom: "dad", lucy: "aunt", dev: "uncle", ruby: "me", sam: "brother", leo: "brother", maya: "cousin", biscuit: "my dog" },
            maya: { pat: "grandma", ken: "grandpa", sarah: "aunt", tom: "uncle", lucy: "mum", dev: "dad", ruby: "cousin", sam: "cousin", leo: "cousin", maya: "me", biscuit: "dog" },
            sam: { pat: "grandma", ken: "grandpa", sarah: "mum", tom: "dad", lucy: "aunt", dev: "uncle", ruby: "sister", sam: "me", leo: "brother", maya: "cousin", biscuit: "my dog" },
          };
          let view = "ruby";
          const setView = async (v, quiet) => {
            view = v; Object.entries(vb).forEach(([k, b]) => b.classList.toggle("on", k === v));
            if (!quiet) s.sfx.whoosh();
            Object.entries(T.labels).forEach(([k, t]) => { t.textContent = VIEW[v][k]; t.style.fill = VIEW[v][k] === "me" ? "var(--red)" : "var(--unit)"; });
            if (!quiet) await s.show(Object.values(T.labels), "pop");
            bump(s, T.figs[v], 0.2);
          };
          Object.entries(T.figs).forEach(([k, g]) => { g.style.cursor = "pointer"; g.addEventListener("click", () => {
            const r = VIEW[view][k]; const nm = k === "biscuit" ? "Biscuit" : FAM[k].name;
            EN(s, r === "me" ? `This is me, ${nm}!` : r.startsWith("my") || r === "dog" ? `This is ${view === "maya" ? "my cousin's dog" : "our dog"}, Biscuit.` : `This is my ${r}, ${nm}.`);
            s.sfx.pop(); bump(s, g, 0.12);
          }); });
          const vb = {};
          ["ruby", "maya", "sam"].forEach(k => { vb[k] = s.h("button", { class: "e2tab" }, FAM[k].name); vb[k].addEventListener("click", () => setView(k)); });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, s.h("b", null, "cousin"), " = Cousin ", s.h("b", null, "und"), " Cousine.", s.h("br"), s.h("b", null, "parents"), " = Eltern – nicht Verwandte! Verwandte = ", s.h("b", null, "relatives"), ".");
          const pairs = s.h("div", { class: "stack later", style: { gap: "8px" } },
            spk(s, "mum and dad = parents", { cls: "sm full", de: "Mama + Papa = Eltern" }),
            spk(s, "grandma and grandpa = grandparents", { cls: "sm full", de: "Großeltern" }),
            spk(s, "Sam and Leo are twins.", { cls: "sm full", de: "Zwillinge" }));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "700px 1fr", gap: "16px", height: "100%" } }, T.svg,
            s.h("div", { class: "stack", style: { gap: "10px" } }, s.h("p", { class: "t pencil" }, "Von wem aus schauen wir?"), s.h("div", { class: "e2tabs" }, Object.values(vb)), pairs, merk)));
          setView("ruby", true); s.show(T.svg, "fade"); s.sfx.whoosh();
          s.step(async () => { await setView("maya"); s.say("Aus Mayas Sicht: Lucy ist ihre Mama, Ruby ist ihre Cousine."); });
          s.step(async () => { await setView("sam"); s.say("Aus Sams Sicht ist Ruby seine Schwester."); });
          s.step(async () => { s.sfx.pop(); await s.show(pairs, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.say("Achtung: parents heißt Eltern, nicht Verwandte."); });
        },
      },
      /* 3 ------------------------------------------------------------ */
      {
        title: "I've got a sister",
        say: "Mit have got sagst du, was du hast: Geschwister, Haustiere, Sachen. Bei he, she und it heißt es has got.",
        build(s) {
          const R = [["I", "have", "'ve"], ["you", "have", "'ve"], ["he", "has", "'s"], ["she", "has", "'s"], ["it", "has", "'s"], ["we", "have", "'ve"], ["they", "have", "'ve"]];
          const shorts = [], hasEls = [];
          const rows = R.map(([p, v, sh]) => {
            const vEl = s.h("span", { style: { fontSize: "26px", fontWeight: 700, color: v === "has" ? "var(--red)" : "var(--ink)" } }, v + " got");
            const shEl = s.h("span", { class: "later", style: { font: "800 28px/1.1 var(--f-display)", color: PC[p] } }, (p === "I" ? "I" : p) + sh + " got");
            shorts.push(shEl); if (v === "has") hasEls.push(vEl);
            const b = s.h("button", { class: "e2spk sm", style: { width: "100%", display: "grid", gridTemplateColumns: "86px 130px 30px 1fr", alignItems: "center", gap: "8px", padding: "7px 12px 7px 6px" } },
              s.h("span", { class: "e2pron", style: { background: PC[p] } }, p), vEl, s.h("span", { class: "pencil" }, "→"), shEl);
            b.addEventListener("click", () => { EN(s, `${p} ${v} got. ${p}${sh} got.`); s.sfx.pop(); bump(s, b, 0.05); });
            return b;
          });
          const EX = [
            ["Lukas", "I've got a sister. Her name is Julia.", "Ich habe eine Schwester."],
            ["Ruby", "I've got two brothers and a dog.", "Ich habe zwei Brüder und einen Hund."],
            ["", "Julia has got a cat. → She's got a cat.", "Julia hat eine Katze."],
            ["", "Sam and Leo have got a big room. → They've got a big room.", "Sie haben ein großes Zimmer."],
          ].map(([who, t, d]) => spk(s, t, { who: who || null, de: d, cls: "sm full later", say: t.replace("→", ".") }));
          const hLife = life(s, "Im Alltag", s.h("p", { class: "small" }, "Beim Kennenlernen: „I've got a brother.“ · Im Laden: „I've got five pounds.“ · Beim Arzt: „I've got a headache.“ (Kopfweh)"));
          hLife.classList.add("later");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px" } }, s.h("b", null, "he / she / it"), " → ", s.h("b", { class: "red" }, "has"), " got. Alle anderen: ", s.h("b", null, "have"), " got.", s.h("br"), "Achtung: ", s.h("b", null, "She's got"), " = she ", s.h("b", null, "has"), " got  ·  ", s.h("b", null, "She's 8"), " = she ", s.h("b", null, "is"), " 8.");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "470px 1fr", gap: "22px", height: "100%" } },
            s.h("div", { class: "stack", style: { gap: "10px" } }, ...rows),
            s.h("div", { class: "stack", style: { gap: "10px" } }, ...EX, merk, hLife)));
          s.show(rows, "left"); s.sfx.whoosh();
          s.step(async () => { hasEls.forEach(e => bump(s, e, 0.3)); s.sfx.zap(); await s.wait(500); s.say("Bei he, she und it: has."); });
          s.step(async () => { for (const [i, e] of shorts.entries()) { s.sfx.snap(); s.show(e, "zoom"); await s.wait(160); } await s.wait(400); s.say("Kurz: I've got, she's got."); });
          s.step(async () => { s.sfx.pop(); await s.show(EX.slice(0, 2), "right"); });
          s.step(async () => { s.sfx.pop(); await s.show(EX.slice(2), "right"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.show(hLife, "up"); });
        },
      },
      /* 4 ------------------------------------------------------------ */
      {
        title: "Have you got a pet?",
        say: "So fragst du mit have got: have kommt nach vorne! Und die Kurzantwort hat kein got.",
        build(s) {
          const tk = (t, c = "") => s.h("span", { class: "e2tok " + c }, t);
          const T = { you: tk("You", "p"), have: tk("have", "v"), got: tk("got"), pet: tk("a pet"), end: tk(".", "q") };
          const row = s.h("div", { class: "row", style: { gap: "10px", justifyContent: "center", minHeight: "70px", flexWrap: "nowrap" } }, T.you, T.have, T.got, T.pet, T.end);
          const demo = s.h("div", { class: "card stack", style: { alignItems: "center", gap: "10px", padding: "14px" } }, s.h("p", { class: "small pencil" }, "Aussage → Frage"), row);
          const hear = s.h("button", { class: "btn" }, "🔊 Anhören");
          let isQ = false;
          hear.addEventListener("click", () => { EN(s, isQ ? "Have you got a pet?" : "You have got a pet."); s.sfx.pop(); });
          demo.append(hear);
          const flipQ = async () => {
            s.sfx.whoosh();
            await reorder(s, row, [T.have, T.you, T.got, T.pet, T.end], 60);
            T.have.textContent = "Have"; T.you.textContent = "you"; T.end.textContent = "?"; isQ = true;
            bump(s, T.end, 0.5); s.sfx.ding();
          };
          const qa = [
            ["Ruby", "Have you got a pet, Lukas?", "r"],
            ["Lukas", "No, I haven't. But my sister has got a cat.", ""],
            ["Ruby", "Has she got a dog, too?", "r"],
            ["Lukas", "No, she hasn't. Have you got a cat?", ""],
            ["Ruby", "No, I haven't. I've got a dog – Biscuit!", "r"],
          ].map(([who, t, side]) => spk(s, t, { who, cls: "bub sm later " + side }));
          const qLife = life(s, "Im Alltag", s.h("div", { class: "cols3", style: { gap: "8px" } },
            spk(s, "Have you got a pen?", { cls: "sm full", de: "in der Schule" }), spk(s, "Have you got this in blue?", { cls: "sm full", de: "im Laden" }), spk(s, "Have you got Wi-Fi?", { cls: "sm full", de: "im Hotel", say: "Have you got wifi?" })));
          qLife.classList.add("later");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Kurzantwort ohne got: ", s.h("b", null, "Yes, I have. / No, I haven't."), s.h("br"), s.h("b", null, "Yes, she has. / No, she hasn't."), "  ", s.h("span", { class: "e2x" }, "Yes, I have got."));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "470px 1fr", gap: "22px", height: "100%" } },
            s.h("div", { class: "stack", style: { gap: "14px" } }, demo, merk),
            s.h("div", { class: "stack", style: { gap: "10px" } }, ...qa, qLife)));
          s.show(demo, "zoom"); s.sfx.pop();
          s.step(flipQ);
          s.step(async () => { s.sfx.pop(); await s.show(qa.slice(0, 2), "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(qa.slice(2), "up"); s.sound("dog-bark", { vol: 0.6 }); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.show(qLife, "up"); s.say("Yes, I have. No, I haven't. Ohne got!"); });
        },
      },
      /* 5 ------------------------------------------------------------ */
      {
        title: "my, your, his, her …",
        say: "Zu jedem Pronomen gehört ein Besitzwort: I wird zu my, she zu her. Gleiche Farbe, gleiche Person!",
        build(s) {
          const P = [["I", "my", "mein"], ["you", "your", "dein"], ["he", "his", "sein"], ["she", "her", "ihr"], ["it", "its", "sein / ihr"], ["we", "our", "unser"], ["they", "their", "ihr (Mz.)"]];
          const poss = [];
          const rows = P.map(([p, m, d]) => {
            const pe = s.h("span", { class: "e2poss later", style: { background: PC[p] } }, m);
            poss.push(pe);
            const b = s.h("button", { class: "e2spk sm", style: { width: "100%", display: "grid", gridTemplateColumns: "80px 34px 90px 1fr", alignItems: "center", gap: "8px", padding: "10px 12px 10px 6px" } },
              s.h("span", { class: "e2pron", style: { background: PC[p] } }, p), s.h("span", { class: "pencil" }, "→"), pe, s.h("span", { class: "small pencil" }, d));
            b.addEventListener("click", () => { EN(s, `${p}. ${m}.`); s.sfx.pop(); bump(s, b, 0.05); });
            return b;
          });
          const col = (w, p) => s.h("b", { style: { color: PC[p] } }, w);
          const EX = [
            [["This is Ruby. ", col("Her", "she"), " dog is Biscuit."], "This is Ruby. Her dog is Biscuit."],
            [["This is Lukas. ", col("His", "he"), " sister is Julia."], "This is Lukas. His sister is Julia."],
            [["Biscuit loves ", col("its", "it"), " ball."], "Biscuit loves its ball."],
            [["Sam and Leo: ", col("Their", "they"), " room is blue."], "Sam and Leo: Their room is blue."],
            [["We love ", col("our", "we"), " school!"], "We love our school!"],
          ].map(([lb, t]) => spk(s, t, { label: s.h("span", null, ...lb), cls: "sm full later" }));
          const pLife = life(s, "Im Alltag", s.h("div", { class: "cols", style: { gap: "8px" } },
            spk(s, "Is this your pen?", { cls: "sm full", de: "Ist das dein Stift?" }), spk(s, "What's your name?", { cls: "sm full", de: "Wie heißt du?" })));
          pLife.classList.add("later");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Junge/Mann → ", s.h("b", null, "his"), ", Mädchen/Frau → ", s.h("b", null, "her"), ".", s.h("br"), s.h("b", null, "its"), " (sein) ≠ ", s.h("b", null, "it's"), " (= it is)!");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "470px 1fr", gap: "22px", height: "100%" } },
            s.h("div", { class: "stack", style: { gap: "10px" } }, ...rows),
            s.h("div", { class: "stack", style: { gap: "10px" } }, ...EX, merk, pLife)));
          s.show(rows, "left"); s.sfx.whoosh();
          s.step(async () => { for (const [i, e] of poss.entries()) { s.sfx.count(i); s.show(e, "right"); await s.wait(170); } await s.wait(400); });
          s.step(async () => { s.sfx.pop(); await s.show(EX.slice(0, 2), "up"); s.say("Ruby ist ein Mädchen: her dog. Lukas ist ein Junge: his sister."); });
          s.step(async () => { s.sfx.pop(); await s.show(EX.slice(2), "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.show(pLife, "up"); });
        },
      },
      /* 5a ----------------------------------------------------------- */
      {
        title: "me, you, him, her …",
        say: "Steht ein Pronomen hinter dem Verb, ändert es oft seine Form: Aus he wird him, aus they wird them. Gleiche Farbe, gleiche Person!",
        build(s) {
          const P = [["I", "me", "mich / mir"], ["you", "you", "dich / dir"], ["he", "him", "ihn / ihm"], ["she", "her", "sie / ihr"], ["it", "it", "es / ihm"], ["we", "us", "uns"], ["they", "them", "sie / ihnen"]];
          const objs = [];
          const rows = P.map(([p, o, d]) => {
            const oe = s.h("span", { class: "e2poss later", style: { background: PC[p] } }, o);
            objs.push(oe);
            const b = s.h("button", { class: "e2spk sm", style: { width: "100%", display: "grid", gridTemplateColumns: "80px 34px 90px 1fr", alignItems: "center", gap: "8px", padding: "18px 12px 18px 6px" } },
              s.h("span", { class: "e2pron", style: { background: PC[p] } }, p), s.h("span", { class: "pencil" }, "→"), oe, s.h("span", { class: "small pencil" }, d));
            b.addEventListener("click", () => { EN(s, `${p}. ${o}.`); s.sfx.pop(); bump(s, b, 0.05); });
            return b;
          });
          /* the swap demo: She loves Biscuit. <-> Biscuit loves her. */
          const tk = (t, c, st) => s.h("span", { class: "e2tok " + (c || ""), style: st || null }, t);
          const A = tk("She", "", { background: PC.she, color: "#fff", borderColor: PC.she });
          const V = tk("loves", "v"), Bt = tk("Biscuit", "p"), end = tk(".", "q");
          const row = s.h("div", { class: "row", style: { gap: "10px", justifyContent: "center", flexWrap: "nowrap", minHeight: "64px" } }, A, V, Bt, end);
          const cap = s.h("p", { class: "small pencil", style: { textAlign: "center" } }, "Ruby tut etwas: Sie steht vor dem Verb – she.");
          let swapped = false;
          const swap = async () => {
            s.sfx.whoosh();
            if (!swapped) { await reorder(s, row, [Bt, V, A, end], 60); s.sfx.snap(); await flip(s, A, "her"); }
            else { await reorder(s, row, [A, V, Bt, end], 60); s.sfx.snap(); await flip(s, A, "She"); }
            swapped = !swapped; bump(s, A, 0.25);
            cap.textContent = swapped ? "Jetzt tut Biscuit etwas. Ruby steht hinter dem Verb – her." : "Ruby tut etwas: Sie steht vor dem Verb – she.";
            EN(s, swapped ? "Biscuit loves her." : "She loves Biscuit.");
          };
          const swapBtn = s.h("button", { class: "btn later" }, "⇄ Tauschen");
          swapBtn.addEventListener("click", swap);
          cap.style.flex = "1"; cap.style.textAlign = "left";
          const demo = s.h("div", { class: "card stack", style: { alignItems: "stretch", gap: "8px", padding: "10px 14px" } }, row, s.h("div", { class: "row", style: { gap: "12px", flexWrap: "nowrap" } }, cap, swapBtn));
          const col = (w, p) => s.h("b", { style: { color: PC[p] } }, w);
          const EX = [
            [["Biscuit is hungry. Can you feed ", col("him", "he"), ", please?"], "Biscuit is hungry. Can you feed him, please?", "Haustier: Kannst du ihn füttern?"],
            [["That's my grandma. I visit ", col("her", "she"), " on Sundays."], "That's my grandma. I visit her on Sundays.", "Familienfoto: Ich besuche sie sonntags."],
            [["Sam and Leo? I play football with ", col("them", "they"), "."], "Sam and Leo? I play football with them.", "nach with: mit ihnen"],
            [["Text ", col("me", "I"), " after school!"], "Text me after school!", "Chat: Schreib mir nach der Schule!"],
          ].map(([lb, t, d]) => spk(s, t, { label: s.h("span", null, ...lb), de: d, cls: "sm full later" }));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Nach dem Verb oder nach ", s.h("b", null, "with, for, to"), ": ", s.h("b", null, "me, him, her, us, them"), ".", s.h("br"), s.h("b", null, "you"), " und ", s.h("b", null, "it"), " bleiben gleich.");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "470px 1fr", gap: "22px", height: "100%" } },
            s.h("div", { class: "stack", style: { gap: "10px" } }, ...rows),
            s.h("div", { class: "stack", style: { gap: "10px" } }, demo, ...EX, merk)));
          s.show(rows, "left"); s.sfx.whoosh();
          s.step(async () => { for (const [i, e] of objs.entries()) { s.sfx.count(i); s.show(e, "right"); await s.wait(170); } await s.wait(400); s.say("I wird zu me, he zu him, we zu us, they zu them."); });
          s.step(async () => { s.sound("dog-bark", { vol: 0.5 }); await swap(); s.show(swapBtn, "pop"); });
          s.step(async () => { s.sfx.pop(); await s.show(EX.slice(0, 2), "up"); s.say("Biscuit ist ein Junge: him. Die Oma: her."); });
          s.step(async () => { s.sfx.pop(); await s.show(EX.slice(2), "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 5b ----------------------------------------------------------- */
      {
        title: "Im Alltag: me, him, them",
        say: "Objektpronomen hörst du überall: wenn jemand auf ein Haustier aufpasst, Familienfotos zeigt oder im Chat schreibt.",
        build(s) {
          const col = (w, p) => s.h("b", { style: { color: PC[p] } }, w);
          const bub = (who, parts, side) => { const t = parts.map(x => (typeof x === "string" ? x : x[0])).join(""); return spk(s, t, { who, label: s.h("span", null, ...parts.map(x => (typeof x === "string" ? x : col(x[0], x[1])))), cls: "bub sm later " + (side || "") }); };
          const card = (label, vis, bubs) => s.h("div", { class: "card stack later", style: { gap: "8px", padding: "10px 14px" } }, s.h("span", { class: "exlabel", style: { marginBottom: 0 } }, label), vis, ...bubs);
          // 1 pet care
          const b1 = [
            bub("Julia", ["Mo is hungry. Can you feed ", ["her", "she"], ", Lukas?"]),
            bub("Lukas", ["OK! I can give ", ["her", "she"], " some fish."], "r"),
            bub("Julia", ["Thanks! Look – she likes ", ["you", "you"], "!"]),
          ];
          const c1 = card("Pet care", s.photo("cat", { w: 316, h: 126, pos: "50% 40%", caption: "Mo" }), b1);
          // 2 family photo
          const fv = s.svg(316, 140); fv.style.height = "126px";
          fv.append(s.el("rect", { x: 3, y: 3, width: 310, height: 134, rx: 8, fill: "#fff", stroke: "#8a5a2b", "stroke-width": 6 }), s.el("rect", { x: 12, y: 12, width: 292, height: 116, fill: "#e8f6ff" }), s.el("rect", { x: 12, y: 104, width: 292, height: 24, fill: "#b9e3b0" }));
          [["pat", 60, 128, 108], ["ken", 120, 128, 114], ["sam", 200, 128, 78], ["leo", 255, 128, 78]].forEach(([k, x, y, h]) => fv.append(person(s, Object.assign({}, FAM[k].o, { x, y, h }))));
          const b2 = [
            bub("Ruby", ["That's my grandma, Pat. I visit ", ["her", "she"], " every Sunday."]),
            bub("Ruby", ["Grandpa Ken plays chess with ", ["me", "I"], "."]),
            bub("Ruby", ["Sam and Leo? I walk to school with ", ["them", "they"], "."]),
          ];
          const c2 = card("Family photos", fv, b2);
          // 3 chat
          const b3 = [
            bub("Lukas", ["Can you send ", ["me", "I"], " a photo of Biscuit?"], "r"),
            bub("Ruby", ["Here he is! Do you like ", ["him", "he"], "?"]),
            bub("Lukas", ["I love ", ["him", "he"], "! Say hi to ", ["him", "he"], " from ", ["us", "we"], "!"], "r"),
          ];
          const c3 = card("Chat", s.photo("dog", { w: 316, h: 126, pos: "50% 35%", caption: "Biscuit" }), b3);
          const short = life(s, "Ganz kurz – nur das Objektpronomen", s.h("div", { class: "cols3", style: { gap: "10px" } },
            spk(s, "Who wants ice cream? – Me!", { cls: "sm full", de: "Wer will Eis? – Ich!" }), spk(s, "Who broke the cup? – Not me!", { cls: "sm full", de: "Ich nicht!" }), spk(s, "Who's at the door? – It's him!", { cls: "sm full", de: "Er ist es!" })));
          short.classList.add("later");
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%" } }, s.h("div", { class: "cols3", style: { gap: "16px", alignItems: "start" } }, c1, c2, c3), short));
          const run = async (c, bs, snd) => { if (snd) s.sound(snd, { vol: 0.6 }); else s.sfx.whoosh(); await s.show(c, "up"); for (const b of bs) { s.sfx.pop(); await s.show(b, "up"); await s.wait(120); } };
          run(c1, b1, "cat-meow");
          s.step(async () => { s.sound("camera-shutter", { vol: 0.5 }); await run(c2, b2); s.say("Ich besuche sie – her. Mit ihnen – with them."); });
          s.step(async () => { await run(c3, b3, "dog-bark"); s.say("Schick mir – send me. Ich liebe ihn – I love him."); });
          s.step(async () => { s.sfx.ding(); await s.show(short, "up"); s.say("In kurzen Antworten sagst du: Me! Not me! – nicht I."); });
        },
      },
      /* 6 ------------------------------------------------------------ */
      {
        title: "Julia's cat",
        say: "Wem gehört etwas? Im Englischen hängst du Apostroph und s an den Namen: Julia's cat.",
        build(s) {
          const v = s.svg(240, 190); v.append(cast(s, "julia", 75, 186, { h: 168 }), cat(s, { x: 160, y: 186, sc: 1.0 }));
          const name = s.h("span", { class: "e2tok p" }, "Julia");
          const tag = s.h("span", { class: "e2tok v later", style: { marginLeft: "-14px", zIndex: 1 } }, "'s");
          const obj = s.h("span", { class: "e2tok later" }, "cat");
          const de = s.h("p", { class: "t pencil" }, "Deutsch: Julias Katze – ohne Apostroph");
          const hear = spk(s, "Julia's cat", { cls: "later" });
          const demo = s.h("div", { class: "row", style: { gap: "28px", flexWrap: "nowrap" } }, v,
            s.h("div", { class: "stack", style: { gap: "14px" } }, s.h("div", { class: "row", style: { gap: "12px", flexWrap: "nowrap" } }, name, tag, obj), de, s.h("div", { class: "row" }, hear)));
          const red = t => s.h("span", { class: "e2hl" }, t);
          const EX = [
            [["Ruby", red("'s"), " dog"], "Ruby's dog", "Rubys Hund"],
            [["my mum", red("'s"), " car"], "my mum's car", "das Auto meiner Mama"],
            [["the twin", red("s'"), " room"], "the twins' room", "das Zimmer der Zwillinge"],
            [["my parent", red("s'"), " bikes"], "my parents' bikes", "die Fahrräder meiner Eltern"],
            [["the children", red("'s"), " books"], "the children's books", "die Bücher der Kinder"],
          ].map(([lb, t, d]) => spk(s, t, { label: s.h("span", null, ...lb), de: d, cls: "sm full later" }));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Eine Person: ", s.h("b", null, "'s"), " – Julia's cat.", s.h("br"), "Plural mit -s: nur ", s.h("b", null, "'"), " – the twins' room.", s.h("br"), "Plural ohne -s: ", s.h("b", null, "'s"), " – the children's books.");
          const aLife = life(s, "Im Alltag", s.h("div", { class: "cols3", style: { gap: "8px" } },
            spk(s, "Mother's Day", { cls: "sm full", de: "Muttertag" }), spk(s, "children's menu", { cls: "sm full", de: "Kinderkarte im Restaurant" }), spk(s, "Ruby's Café", { cls: "sm full", de: "Ladenschild", say: "Ruby's Cafe" })));
          aLife.classList.add("later");
          s.add(s.h("div", { class: "stack", style: { gap: "12px" } }, demo,
            s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 1fr", gap: "16px" } }, s.h("div", { class: "stack", style: { gap: "8px" } }, ...EX.slice(0, 3)), s.h("div", { class: "stack", style: { gap: "8px" } }, ...EX.slice(3), merk)), aLife));
          s.show(v, "zoom"); s.sound("cat-meow", { vol: 0.7 });
          s.step(async () => { s.sfx.boing(); await s.show(tag, "bounce"); s.sfx.pop(); await s.show(obj, "right"); s.show(hear, "pop"); });
          s.step(async () => { s.sfx.pop(); await s.show(EX.slice(0, 2), "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(EX.slice(2), "up"); s.say("Bei den twins steht der Apostroph hinter dem s."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.show(aLife, "up"); });
        },
      },
      /* 6a ----------------------------------------------------------- */
      {
        title: "girl's oder girls'?",
        say: "Hör mal genau hin: the girl's room und the girls' room klingen gleich. Nur der Apostroph zeigt dir, ob es ein Mädchen ist oder mehrere.",
        build(s) {
          /* scene: one girl or two girls in front of their door */
          const E = s.el, v = s.svg(420, 250);
          v.append(E("rect", { x: 0, y: 236, width: 420, height: 14, rx: 4, fill: "#d9c3a0" }));
          v.append(E("rect", { x: 290, y: 46, width: 110, height: 190, rx: 6, fill: "#f06fa5", stroke: "#b84a7c", "stroke-width": 4 }));
          v.append(E("rect", { x: 304, y: 64, width: 82, height: 70, rx: 4, fill: "none", stroke: "#b84a7c", "stroke-width": 3 }), E("rect", { x: 304, y: 150, width: 82, height: 70, rx: 4, fill: "none", stroke: "#b84a7c", "stroke-width": 3 }));
          v.append(E("circle", { cx: 386, cy: 146, r: 6, fill: "#e8b923" }));
          v.append(E("path", { d: "M345 92 l6 12 13 2 -9 9 2 13 -12 -6 -12 6 2 -13 -9 -9 13 -2 z", fill: "#fff" }));
          const g1 = person(s, Object.assign({}, FAM.ruby.o, { x: 90, y: 236, h: 196 }));
          const g2 = person(s, Object.assign({}, FAM.maya.o, { x: 200, y: 236, h: 180 }));
          g2.classList.add("later");
          v.append(g1, g2);
          /* the words: the girl ' s room – apostrophe and s swap places */
          const ap = s.h("span", { class: "e2hl", style: { display: "inline-block" } }, "'");
          const sS = s.h("span", { style: { display: "inline-block" } }, "s");
          const word = s.h("span", { class: "e2tok p", style: { display: "inline-flex", alignItems: "baseline" } }, s.h("span", null, "girl"), ap, sS);
          const sent = s.h("div", { class: "row", style: { gap: "10px", justifyContent: "center", flexWrap: "nowrap" } }, s.h("span", { class: "e2tok" }, "the"), word, s.h("span", { class: "e2tok" }, "room"));
          const how = s.h("p", { class: "t", style: { textAlign: "center", margin: 0 } }, "ein Mädchen: Apostroph ", s.h("b", { class: "red" }, "vor"), " dem s");
          let two = false;
          const tabs = {};
          const setTwo = async (t, quiet) => {
            if (t === two && !quiet) return;
            two = t; Object.entries(tabs).forEach(([k, b]) => b.classList.toggle("on", (k === "two") === t));
            if (!quiet) { s.sfx.whoosh(); if (t) { s.show(g2, "pop"); s.sfx.pop(); } else s.hide(g2); }
            await reorder(s, word, t ? [word.firstChild, sS, ap] : [word.firstChild, ap, sS], 40);
            bump(s, ap, 0.6); if (!quiet) s.sfx.boing();
            how.textContent = "";
            how.append(t ? "zwei Mädchen: Apostroph " : "ein Mädchen: Apostroph ", s.h("b", { class: "red" }, t ? "hinter" : "vor"), " dem s");
            if (!quiet) EN(s, t ? "the girls' room" : "the girl's room");
          };
          tabs.one = s.h("button", { class: "e2tab on", style: { whiteSpace: "nowrap" } }, "one girl"); tabs.two = s.h("button", { class: "e2tab", style: { whiteSpace: "nowrap" } }, "two girls");
          tabs.one.addEventListener("click", () => setTwo(false)); tabs.two.addEventListener("click", () => setTwo(true));
          const hear = spk(s, "the girl's room", { label: "Klingt gleich!", say: () => (two ? "the girls' room" : "the girl's room") });
          const left = s.h("div", { class: "stack", style: { gap: "10px", alignItems: "center" } },
            s.h("div", { class: "row", style: { gap: "12px", flexWrap: "nowrap" } }, tabs.one, tabs.two), v, sent, how, hear);
          /* right: four little rule cards, three examples each */
          const red = t => s.h("span", { class: "e2hl" }, t);
          const card = (title, rule, items) => {
            const bs = items.map(([lb, t]) => spk(s, t, { label: s.h("span", null, ...lb), cls: "sm full" }));
            return s.h("div", { class: "card stack later", style: { gap: "6px", padding: "8px 12px 10px" } },
              s.h("p", { style: { margin: 0, font: "700 22px/1.15 var(--f-display)", color: "var(--unit)" } }, title), s.h("p", { class: "small pencil", style: { margin: 0 } }, rule), ...bs);
          };
          const C = [
            card("Tiere", "auch bei Tieren: 's", [[["the dog", red("'s"), " bone"], "the dog's bone"], [["the cat", red("'s"), " bowl"], "the cat's bowl"], [["Biscuit", red("'s"), " ball"], "Biscuit's ball"]]),
            card("Zwei Besitzer", "'s nur beim letzten Namen", [[["Sam and Leo", red("'s"), " room"], "Sam and Leo's room"], [["Tom and Sarah", red("'s"), " car"], "Tom and Sarah's car"], [["Ruby and Maya", red("'s"), " grandma"], "Ruby and Maya's grandma"]]),
            card("Plural mit -s", "nur ein Apostroph dahinter", [[["the girl", red("s'"), " room"], "the girls' room"], [["the boy", red("s'"), " toilets"], "the boys' toilets"], [["my parent", red("s'"), " car"], "my parents' car"]]),
            card("Plural ohne -s", "ganz normal: 's", [[["the children", red("'s"), " toys"], "the children's toys"], [["the men", red("'s"), " shoes"], "the men's shoes"], [["the women", red("'s"), " team"], "the women's team"]]),
          ];
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "8px 16px 10px" } }, "Man ", s.h("b", null, "hört"), " keinen Unterschied – man ", s.h("b", null, "sieht"), " ihn nur beim Schreiben.");
          left.append(merk);
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "430px 1fr", gap: "18px", height: "100%" } }, left,
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", alignContent: "start" } }, C)));
          setTwo(false, true); s.show(v, "zoom"); s.sfx.pop();
          s.step(async () => { await setTwo(true); s.say("Zwei Mädchen: Das s ist schon da, also kommt der Apostroph dahinter."); });
          s.step(async () => { s.sound("dog-bark", { vol: 0.5 }); await s.show(C[0], "up"); s.say("Auch Tiere können etwas besitzen: the dog's bone."); });
          s.step(async () => { s.sfx.pop(); await s.show(C[1], "up"); s.say("Gehört etwas zwei Leuten zusammen, bekommt nur der letzte Name das 's."); });
          s.step(async () => { s.sfx.pop(); await s.show(C[2], "up"); s.sfx.pop(); await s.show(C[3], "up"); s.say("Endet der Plural auf s: nur Apostroph. Children, men und women: ganz normal 's."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 6b ----------------------------------------------------------- */
      {
        title: "'s – drei Bedeutungen",
        say: "Das kleine 's kann drei verschiedene Dinge bedeuten: Etwas gehört jemandem. Oder es ist die Kurzform von is. Oder die Kurzform von has.",
        build(s) {
          const COL = { pos: "var(--unit)", is: "var(--blue)", has: "var(--red)" };
          const mark = (k, t) => s.h("b", { style: { color: COL[k] } }, t);
          /* parts: strings, or [kind, text] for coloured bits */
          const lab = parts => s.h("span", null, ...parts.map(p => (typeof p === "string" ? p : mark(p[0], p[1]))));
          const col = (k, head, sub, items) => {
            const rows = items.map(([parts, t, long]) => {
              const b = spk(s, t, { label: lab(parts), cls: "sm full" });
              const l = s.h("p", { class: "small later", style: { margin: "0 0 0 8px" } }, long);
              return { b, l, el: s.h("div", { class: "stack", style: { gap: "2px" } }, b, l) };
            });
            const el = s.h("div", { class: "card stack later", style: { gap: "8px", padding: "10px 12px", borderTop: `6px solid ${COL[k]}` } },
              s.h("p", { style: { margin: 0, font: "800 26px/1.1 var(--f-display)", color: COL[k] } }, head), s.h("p", { class: "small pencil", style: { margin: 0 } }, sub), ...rows.map(r => r.el));
            return { el, longs: rows.map(r => r.l) };
          };
          const C = [
            col("pos", "'s = gehört", "Wem gehört es?", [
              [["Ruby", ["pos", "'s"], " dog"], "Ruby's dog", "der Hund von Ruby"],
              [["Maya", ["pos", "'s"], " mum"], "Maya's mum", "die Mama von Maya"],
              [["Grandma", ["pos", "'s"], " house"], "Grandma's house", "das Haus von Oma"]]),
            col("is", "'s = is", "Kurzform von is", [
              [["She", ["is", "'s"], " my cousin."], "She's my cousin.", "= She is my cousin."],
              [["He", ["is", "'s"], " ten."], "He's ten.", "= He is ten."],
              [["It", ["is", "'s"], " Monday."], "It's Monday.", "= It is Monday."]]),
            col("has", "'s = has", "Kurzform von has – mit got", [
              [["She", ["has", "'s"], " got a cat."], "She's got a cat.", "= She has got a cat."],
              [["He", ["has", "'s"], " got a bike."], "He's got a bike.", "= He has got a bike."],
              [["It", ["has", "'s"], " got four legs."], "It's got four legs.", "= It has got four legs."]]),
          ];
          /* one sentence, two different 's */
          const S2 = [
            [[["is", "He's"], " ", ["pos", "Ruby's"], " brother."], "He's Ruby's brother.", [["is", "He's"], " = He is", "  ·  ", ["pos", "Ruby's"], " = gehört zu Ruby"]],
            [[["is", "It's"], " ", ["pos", "Biscuit's"], " ball."], "It's Biscuit's ball.", [["is", "It's"], " = It is", "  ·  ", ["pos", "Biscuit's"], " = gehört Biscuit"]],
          ].map(([parts, t, ex]) => { const b = spk(s, t, { label: lab(parts), cls: "sm full" }); const l = s.h("p", { class: "small later", style: { margin: "0 0 0 8px" } }, lab(ex)); return { b, l, el: s.h("div", { class: "stack", style: { gap: "2px" } }, b, l) }; });
          const both = s.h("div", { class: "ex stack later", style: { gap: "6px" } }, s.h("span", { class: "exlabel" }, "Ein Satz – zweimal 's"), ...S2.map(x => x.el));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "8px 16px 10px" } },
            s.h("b", null, "Trick:"), " Passt ", mark("is", "is"), " oder ", mark("has", "has"), "? Dann ist es eine Kurzform – sonst ", mark("pos", "Besitz"), ".", s.h("br"),
            s.h("b", null, "its"), " = sein/ihr (Biscuit loves ", s.h("b", null, "its"), " ball)  ·  ", s.h("b", null, "it's"), " = it is");
          s.add(s.h("div", { class: "stack", style: { gap: "12px" } },
            s.h("div", { class: "cols3", style: { gap: "12px", alignItems: "start" } }, C.map(c => c.el)),
            s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 1.15fr", gap: "14px", alignItems: "start" } }, both, merk)));
          s.sfx.whoosh(); s.show(C[0].el, "up"); s.show(C[0].longs, "fade", 300);
          s.step(async () => { s.sfx.pop(); await s.show(C[1].el, "up"); s.sfx.snap(); await s.show(C[1].longs, "left"); s.say("Hier steht 's für is: She is my cousin."); });
          s.step(async () => { s.sfx.pop(); await s.show(C[2].el, "up"); s.sfx.snap(); await s.show(C[2].longs, "left"); s.say("Und hier für has. Steht got dahinter, ist es fast immer has."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(both, "up"); for (const x of S2) { s.sfx.zap(); await s.show(x.l, "left"); } s.say("He's heißt he is. Ruby's heißt: gehört zu Ruby."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.say("Und its ohne Apostroph heißt sein oder ihr – it's mit Apostroph heißt it is."); });
        },
      },
      /* 7 ------------------------------------------------------------ */
      {
        title: "One dog, two dogs",
        say: "Plural heißt Mehrzahl. Meistens hängst du einfach s an. Aber es gibt zwei Sonderfälle.",
        build(s) {
          const card = (title, rule, items, col) => {
            const rows = items.map(([sg, pl, e]) => {
              const em = s.h("span", { class: "e2emo" }, e);
              const b = spk(s, `${sg} → ${pl}`, { cls: "sm", say: `one ${sg.replace(/^an? /, "")}, two ${pl}`, label: s.h("span", null, sg, " → ", s.h("b", { style: { color: col } }, pl)) });
              b.style.flex = "1";
              return { el: s.h("div", { class: "row", style: { gap: "8px", flexWrap: "nowrap" } }, s.h("div", { style: { width: "118px", flex: "none" } }, em), b), em, e };
            });
            const el = s.h("div", { class: "card stack later", style: { gap: "10px", padding: "12px 14px" } }, s.h("p", { class: "h2", style: { color: col } }, title), s.h("p", { class: "small pencil" }, rule), ...rows.map(r => r.el));
            return { el, rows };
          };
          const C = [
            card("+ s", "die meisten Wörter", [["a dog", "dogs", "🐕"], ["a cat", "cats", "🐈"], ["a book", "books", "📕"]], "var(--unit)"),
            card("+ es", "nach s, x, sh, ch", [["a bus", "buses", "🚌"], ["a box", "boxes", "📦"], ["a watch", "watches", "⌚"]], "var(--orange)"),
            card("y → ies", "Konsonant + y", [["a baby", "babies", "👶"], ["a party", "parties", "🎉"], ["a family", "families", "👪"]], "var(--violet)"),
          ];
          const many = async c => { for (const r of c.rows) { s.sfx.pop(); await flip(s, r.em, r.e + r.e + r.e); s.sfx.count(2); } };
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Aber Vokal + y bleibt: a boy → ", s.h("b", null, "boys"), ", a day → ", s.h("b", null, "days"), ".  -es spricht man wie „is“: bus", s.h("b", null, "es"), ".");
          const lf = life(s, "Im Alltag", s.h("p", { class: "small" }, "Im Laden: „Two boxes of cereal, please.“ · Auf der Party: „Lots of babies and dogs!“ · An der Haltestelle: „Two buses are late.“"));
          lf.classList.add("later");
          s.add(s.h("div", { class: "stack", style: { gap: "14px" } }, s.h("div", { class: "cols3", style: { gap: "14px" } }, C.map(c => c.el)), merk, lf));
          s.sfx.whoosh(); s.show(C[0].el, "up");
          s.step(() => { s.sound("dog-bark", { vol: 0.5 }); return many(C[0]); });
          s.step(async () => { s.sound("london-bus-street", { vol: 0.4, dur: 3 }); await s.show(C[1].el, "up"); await many(C[1]); s.say("Nach s, x, sh und ch hängst du es an."); });
          s.step(async () => { s.sound("kids-cheer", { vol: 0.4 }); await s.show(C[2].el, "up"); await many(C[2]); s.say("Aus y wird ies."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.show(lf, "up"); });
        },
      },
      /* 8 ------------------------------------------------------------ */
      {
        title: "children, feet, mice",
        say: "Diese Wörter machen ihren eigenen Plural – ganz ohne s. Tippe sie an und hör genau hin.",
        build(s) {
          const IR = [["a child", "children", "🧒", "Kind"], ["a man", "men", "👨", "Mann"], ["a woman", "women", "👩", "Frau"], ["a foot", "feet", "🦶", "Fuß"], ["a tooth", "teeth", "🦷", "Zahn"], ["a mouse", "mice", "🐁", "Maus"], ["a person", "people", "🧑", "Person"], ["a sheep", "sheep", "🐑", "Schaf"], ["a fish", "fish", "🐟", "Fisch"]];
          const cards = IR.map(([sg, pl, e, d]) => {
            const em = s.h("span", { class: "e2emo" }, e);
            const plEl = s.h("b", { class: "later", style: { color: "var(--red)" } }, pl);
            const b = spk(s, "", { label: s.h("span", null, sg, " → ", plEl), de: d, cls: "sm full", say: `one ${sg.replace(/^an? /, "")}, two ${pl}` });
            const c = s.h("div", { class: "card stack", style: { gap: "6px", padding: "8px 12px" } }, s.h("div", { style: { height: "36px", display: "flex", alignItems: "center" } }, em), b);
            return { c, em, e, plEl };
          });
          const go = async grp => { for (const k of grp) { s.sfx.zap(); s.show(k.plEl, "zoom"); await flip(s, k.em, k.e + k.e + k.e); await s.wait(120); } };
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Unregelmäßig = auswendig lernen! Achtung: wo", s.h("b", null, "men"), " spricht man „wimin“. ", s.h("b", null, "sheep"), " und ", s.h("b", null, "fish"), " bleiben gleich.");
          const iLife = life(s, "Im Alltag", s.h("div", { class: "cols3", style: { gap: "8px" } },
            spk(s, "Brush your teeth!", { cls: "sm full", de: "Putz dir die Zähne!" }), spk(s, "Wipe your feet, please.", { cls: "sm full", de: "Bitte Füße abtreten." }), spk(s, "Lots of people!", { cls: "sm full", de: "Viele Leute!" })));
          iLife.classList.add("later");
          s.add(s.h("div", { class: "stack", style: { gap: "8px" } }, s.h("div", { class: "cols3", style: { gap: "8px" } }, cards.map(k => k.c)), merk, iLife));
          s.sfx.whoosh(); s.show(cards.map(k => k.c), "pop");
          s.step(() => go(cards.slice(0, 3)));
          s.step(() => { s.sound("mouse-squeak", { vol: 0.6, dur: 1.6, when: 0.7 }); return go(cards.slice(3, 6)).then(() => s.say("Ein Fuß, zwei feet. Eine Maus, zwei mice.")); });
          s.step(() => { s.sound("sheep-baa", { vol: 0.6, when: 0.4 }); return go(cards.slice(6)); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.show(iLife, "up"); });
        },
      },
      /* 9 ------------------------------------------------------------ */
      {
        title: "Describing people",
        say: "Wie sieht jemand aus? Stell dir eine Person zusammen. Der englische Satz baut sich mit.",
        build(s) {
          const st = { sex: "she", tall: true, hair: "long", col: "dark", glasses: false };
          const HC = { dark: "#2a1a12", blond: "#e2b649", red: "#b5532a", grey: "#cfcfcf" };
          const svg = s.svg(330, 470);
          svg.append(s.el("rect", { x: 10, y: 450, width: 310, height: 10, rx: 5, fill: "#c8d3de" }));
          const ruler = s.el("g", null, ...[0, 1, 2, 3, 4].map(i => s.el("line", { x1: 300, x2: 318, y1: 455 - i * 100, y2: 455 - i * 100, stroke: "#8a94a6", "stroke-width": 3 })), s.el("line", { x1: 318, x2: 318, y1: 55, y2: 455, stroke: "#8a94a6", "stroke-width": 3 }));
          svg.append(ruler);
          let fig = null;
          const sentence = () => {
            const P = st.sex === "she" ? "She" : "He";
            return `${P}'s ${st.tall ? "tall" : "short"}. ${P}'s got ${st.hair}, ${st.col} hair${st.glasses ? " and glasses" : ""}.`;
          };
          const sBtn = spk(s, "", { label: s.h("span", { class: "sx" }), cls: "full", say: () => sentence() });
          const render = async quiet => {
            const nf = person(s, { x: 150, y: 455, h: st.tall ? 410 : 290, skin: st.sex === "she" ? "#e6b48f" : "#f2c9a5", hair: HC[st.col], style: st.hair === "long" ? "long" : "short", shirt: st.sex === "she" ? "#0f766e" : "#ee7a1a", glasses: st.glasses });
            if (fig) fig.remove(); fig = nf; svg.insertBefore(nf, ruler);
            if (!quiet) { s.sfx.pop(); bump(s, nf, 0.06); }
            const lb = sBtn.querySelector(".sx");
            if (quiet) lb.textContent = sentence(); else await flip(s, lb, sentence());
          };
          const grp = (opts, key) => {
            const bs = opts.map(([v, l]) => { const b = s.h("button", { class: "e2tab" }, l); b.addEventListener("click", () => { st[key] = v; sync(); render(); }); b._v = v; return b; });
            return { key, bs, el: s.h("div", { class: "e2tabs", style: { gap: "8px" } }, bs) };
          };
          const G = [grp([["she", "girl"], ["he", "boy"]], "sex"), grp([[true, "tall"], [false, "short"]], "tall"), grp([["long", "long hair"], ["short", "short hair"]], "hair"), grp([["dark", "dark"], ["blond", "blond"], ["red", "red"], ["grey", "grey"]], "col"), grp([[true, "glasses"], [false, "no glasses"]], "glasses")];
          const sync = () => G.forEach(g => g.bs.forEach(b => b.classList.toggle("on", b._v === st[g.key])));
          const dLife = life(s, "Im Alltag", spk(s, "My grandma is short. She's got grey hair and glasses.", { cls: "sm full", de: "Am Flughafen: So erkennt man Oma Pat." }));
          dLife.classList.add("later");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px" } }, s.h("b", null, "hair"), " ist Einzahl: long hair – ", s.h("span", { class: "e2x" }, "long hairs"), ".", s.h("br"), "Erst Länge, dann Farbe: ", s.h("b", null, "long, dark hair"), ".");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "330px 1fr", gap: "24px", height: "100%" } }, svg,
            s.h("div", { class: "stack", style: { gap: "14px" } }, s.h("div", { class: "row", style: { gap: "28px" } }, G[0].el, G[1].el), s.h("div", { class: "row", style: { gap: "28px" } }, G[2].el, G[4].el), G[3].el, sBtn, merk, dLife)));
          sync(); render(true); s.show(svg, "fade"); s.sfx.whoosh();
          const preset = async (o, say) => { Object.assign(st, o); sync(); await render(); s.say(say); };
          s.step(() => preset({ sex: "he", tall: true, hair: "short", col: "red", glasses: false }, "So sieht Rubys Papa Tom aus: groß, mit kurzen roten Haaren."));
          s.step(() => preset({ sex: "she", tall: false, hair: "short", col: "grey", glasses: true }, "Und Oma Pat: klein, kurze graue Haare und eine Brille."));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.show(dLife, "up"); });
        },
      },
      /* 10 ----------------------------------------------------------- */
      {
        title: "At the pet shop",
        say: "Willkommen im Zoogeschäft! Tippe auf die Wörter und hör dir die Namen an. Tippe auf ein Foto – manche Tiere kannst du hören!",
        build(s) {
          const o = { w: "100%", h: 122 };
          const A = [
            [s.photo("dog", Object.assign({ pos: "50% 35%" }, o)), "dog", "Hund", "dog-bark"],
            [s.photo("cat", Object.assign({ pos: "35% 40%" }, o)), "cat", "Katze", "cat-meow"],
            [s.photo("rabbit", Object.assign({ pos: "50% 45%" }, o)), "rabbit", "Kaninchen", null],
            [s.photo("hamster", Object.assign({ pos: "45% 55%" }, o)), "hamster", "Hamster", null],
            [s.photo("budgie", Object.assign({ pos: "50% 40%" }, o)), "budgie", "Wellensittich", "budgie-chirp"],
            [s.photo("goldfish", Object.assign({ pos: "45% 50%" }, o)), "goldfish", "Goldfisch", "bubbles"],
            [s.photo("tortoise", Object.assign({ pos: "50% 55%" }, o)), "tortoise", "Landschildkröte", null],
            [s.photo("mice", Object.assign({ pos: "50% 50%" }, o)), "mouse", "Maus", "mouse-squeak"],
          ];
          const SND = { "dog-bark": () => s.sound("dog-bark"), "cat-meow": () => s.sound("cat-meow"), "budgie-chirp": () => s.sound("budgie-chirp", { dur: 2.5 }), bubbles: () => s.sound("bubbles"), "mouse-squeak": () => s.sound("mouse-squeak", { dur: 1.6 }) };
          const cards = A.map(([ph, w, d, snd]) => {
            if (snd) { ph.style.cursor = "pointer"; ph.addEventListener("click", () => { SND[snd](); bump(s, ph, 0.04); }); }
            const b = spk(s, w, { de: d, cls: "sm full", say: (/^[aeiou]/.test(w) ? "an " : "a ") + w, on: () => bump(s, ph, 0.05) });
            return s.h("div", { class: "card stack later", style: { gap: "8px", padding: "8px 8px 10px" } }, ph, b);
          });
          const psMerk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px" } }, s.h("b", null, "tortoise"), " = Landschildkröte, ", s.h("b", null, "turtle"), " = Wasserschildkröte.  ", s.h("b", null, "a"), " rabbit, aber ", s.h("b", null, "an"), " animal!");
          const dlg = [
            ["Shop assistant", "Hello! Can I help you?", "r"],
            ["Julia", "Yes, please. Have you got a rabbit?", ""],
            ["Shop assistant", "Yes, we have. Here it is!", "r"],
          ].map(([who, t, side]) => spk(s, t, { who, cls: "bub sm later " + side }));
          s.add(s.h("div", { class: "stack", style: { gap: "12px" } },
            s.h("div", { class: "cols4", style: { gap: "12px" } }, cards),
            s.h("div", { class: "row", style: { gap: "12px", flexWrap: "nowrap", alignItems: "flex-end" } }, ...dlg), psMerk));
          s.show(cards.slice(0, 4), "pop"); s.sound("dog-bark", { vol: 0.6 });
          s.step(async () => { s.sound("budgie-chirp", { vol: 0.5, dur: 2.5 }); await s.show(cards.slice(4), "pop"); });
          s.step(async () => { for (const d of dlg) { s.sfx.pop(); await s.show(d, "up"); } s.say("Julia fragt mit have got: Have you got a rabbit?"); });
          s.step(async () => { s.sfx.ding(); await s.show(psMerk, "up"); });
        },
      },
      /* 11 ----------------------------------------------------------- */
      {
        title: "Looking after a pet",
        say: "Ein Haustier braucht jeden Tag Pflege. Ruby hat eine Liste für Biscuit geschrieben.",
        build(s) {
          const svg = s.svg(360, 330), E = s.el;
          svg.append(E("rect", { x: 0, y: 290, width: 360, height: 12, rx: 6, fill: "#c8d3de" }));
          const bowl = E("g", { class: "e2g later" }, E("path", { d: "M40 292 L52 262 L128 262 L140 292 Z", fill: "#1d5bd0" }), E("ellipse", { cx: 90, cy: 262, rx: 38, ry: 8, fill: "#9fd3f5" }));
          const ball = E("circle", { cx: 310, cy: 274, r: 16, fill: "#ee7a1a", class: "later" });
          const lead = E("path", { d: "M262 206 Q352 240 345 110", stroke: "#dc3b2a", "stroke-width": 6, fill: "none", "stroke-linecap": "round", class: "later" });
          const bis = dog(s, { x: 190, y: 292, sc: 1.55 });
          const tagC = E("circle", { cx: 248, cy: 206, r: 9, fill: "#ffd94a", stroke: "#b88900", "stroke-width": 2, class: "later" });
          svg.append(bowl, ball, bis, lead, tagC);
          const L = [
            ["Feed him twice a day.", "Füttere ihn zweimal am Tag.", bowl],
            ["Give him fresh water.", "Gib ihm frisches Wasser.", null],
            ["Take him for a walk.", "Geh mit ihm Gassi.", lead],
            ["Play with him.", "Spiel mit ihm.", ball],
            ["Don't give him chocolate!", "Keine Schokolade – die ist giftig für Hunde!", null],
          ];
          const SN = [null, "water-pour", "dog-bark", "ball-kick", null];
          const items = L.map(([t, d, g], i) => {
            const box = s.h("span", { class: "e2chk" });
            const b = spk(s, t, { de: d, cls: "sm" }); b.style.flex = "1";
            return { el: s.h("div", { class: "row later", style: { gap: "10px", flexWrap: "nowrap" } }, box, b), box, g, snd: SN[i] };
          });
          const tick = box => { const v = s.svg(26, 26); const p = s.el("path", { d: "M4 14 L11 21 L23 5", stroke: "#138a5a", "stroke-width": 4, fill: "none", "stroke-linecap": "round" }); v.append(p); box.append(v); return s.show(p, "draw"); };
          const fact = life(s, "In real life", s.h("p", { class: "small" }, "In Großbritannien braucht jeder Hund mit 8 Wochen einen Mikrochip. Draußen trägt er ein Halsband mit Namen und Adresse des Besitzers."));
          fact.classList.add("later");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Haustiere mit Namen: ", s.h("b", null, "he / him"), " oder ", s.h("b", null, "she / her"), ". Tiere allgemein: ", s.h("b", null, "it"), ".");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "360px 1fr", gap: "24px", height: "100%" } },
            s.h("div", { class: "stack", style: { gap: "12px" } }, svg, merk),
            s.h("div", { class: "stack", style: { gap: "10px" } }, s.h("p", { class: "h2" }, "Ruby's list for Biscuit"), ...items.map(i => i.el), fact)));
          s.show(svg, "zoom"); s.sound("dog-bark", { vol: 0.5 });
          const doItem = async it => { if (it.snd) s.sound(it.snd, { vol: 0.6, dur: 2 }); else s.sfx.pop(); await s.show(it.el, "right"); if (it.g) s.show(it.g, it.g === lead ? "draw" : "pop"); s.sfx.snap(); await tick(it.box); };
          s.step(async () => { await doItem(items[0]); await doItem(items[1]); });
          s.step(async () => { await doItem(items[2]); await doItem(items[3]); });
          s.step(async () => { s.sfx.error(); await doItem(items[4]); s.say("Schokolade ist für Hunde giftig."); });
          s.step(async () => { s.sfx.ding(); s.show(tagC, "pop"); await s.show(fact, "up"); s.show(merk, "up"); });
        },
      },
      /* 12 ----------------------------------------------------------- */
      {
        title: "The months of the year",
        say: "Die zwölf Monate auf Englisch, sortiert nach Jahreszeiten. Tippe drauf und hör genau hin – besonders bei January und July.",
        build(s) {
          const SEA = [["winter", "Winter", "#d6e6fb", [11, 0, 1]], ["spring", "Frühling", "#d9f2d0", [2, 3, 4]], ["summer", "Sommer", "#fff1b8", [5, 6, 7]], ["autumn", "Herbst", "#fde0c2", [8, 9, 10]]];
          const mb = {};
          const rows = SEA.map(([w, d, c, ms]) => {
            const lab = spk(s, w, { de: d, cls: "sm full" });
            const bs = ms.map(m => { const b = s.h("button", { class: "e2month", style: { background: c } }, MONTHS[m]); b.addEventListener("click", () => { EN(s, MONTHS[m]); s.sfx.note(m, 0.18); bump(s, b, 0.1); }); mb[m] = b; return b; });
            return s.h("div", { class: "later", style: { display: "grid", gridTemplateColumns: "190px repeat(3, 1fr)", gap: "10px", alignItems: "center" } }, lab, ...bs);
          });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Monate schreibt man groß – und im Englischen auch die Wochentage: ", s.h("b", null, "Monday, January"), ".", s.h("br"), s.h("b", null, "autumn"), " (britisch) = fall (amerikanisch)");
          const trick = s.h("div", { class: "cols later", style: { gap: "12px" } },
            spk(s, "January", { label: s.h("span", null, "January ", s.h("small", { style: { display: "inline" } }, "„dschänjuari“")), cls: "sm full" }),
            spk(s, "July", { label: s.h("span", null, "July ", s.h("small", { style: { display: "inline" } }, "„dschulai“")), cls: "sm full" }));
          s.add(s.h("div", { class: "stack", style: { gap: "14px" } }, ...rows, trick, merk));
          s.sfx.whoosh(); rows.forEach((r, i) => setTimeout(() => s.alive && s.sfx.count(i * 2), i * 150)); s.show(rows, "left");
          s.step(async () => {
            for (let m = 0; m < 12; m++) { mb[m].classList.add("hot"); s.sfx.note(m, 0.12); await s.wait(170); mb[m].classList.remove("hot"); }
            s.say("Von January bis December.");
          });
          s.step(async () => { s.sfx.pop(); await s.show(trick, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 13 ----------------------------------------------------------- */
      {
        title: "When's your birthday?",
        say: "Für das Datum brauchst du Ordnungszahlen: first, second, third. Schiebe den Regler!",
        build(s) {
          let day = 1, month = 2;
          const cal = s.svg(300, 270), E = s.el;
          const mText = E("text", { x: 150, y: 52, "text-anchor": "middle", "font-size": 32, "font-weight": 800, fill: "#fff", text: "March" });
          const dNum = E("tspan", { text: "1" }), dSuf = E("tspan", { fill: "#dc3b2a", "font-size": 50, dy: -38, text: "st" });
          const dText = E("text", { x: 150, y: 196, "text-anchor": "middle", "font-size": 110, "font-weight": 800, fill: "#1b2740" }, dNum, dSuf);
          cal.append(E("rect", { x: 10, y: 10, width: 280, height: 250, rx: 22, fill: "#fff", stroke: "#0f766e", "stroke-width": 5 }), E("rect", { x: 10, y: 10, width: 280, height: 64, rx: 22, fill: "#0f766e" }), E("rect", { x: 10, y: 50, width: 280, height: 24, fill: "#0f766e" }), E("circle", { cx: 80, cy: 14, r: 8, fill: "#1b2740" }), E("circle", { cx: 220, cy: 14, r: 8, fill: "#1b2740" }), mText, dText);
          const word = s.h("p", { class: "h2", style: { color: "var(--unit)", textAlign: "center", minHeight: "36px" } }, "first");
          const say = () => `It's on the ${ordWord(day)} of ${MONTHS[month]}.`;
          const sBtn = spk(s, "", { label: s.h("span", { class: "sx" }), cls: "full", say: () => say() });
          const render = () => {
            dNum.textContent = String(day); dSuf.textContent = suf(day); mText.textContent = MONTHS[month];
            word.textContent = ordWord(day);
            sBtn.querySelector(".sx").textContent = `It's on the ${day}${suf(day)} of ${MONTHS[month]}.`;
          };
          const sl = s.slider({ label: "Tag", min: 1, max: 31, value: 1, onInput: v => { day = v; render(); } });
          render();
          const go = async (d, m) => { if (m !== month) { month = m; s.sfx.whoosh(); } await s.tween({ from: day, to: d, dur: 600, update: x => { day = Math.round(x); sl.input.value = day; render(); } }); sl.set(d); s.sfx.ding(); };
          const RULE = s.h("div", { class: "card later", style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", padding: "12px" } },
            ...[[1, "first"], [2, "second"], [3, "third"], [4, "fourth"], [5, "fifth"], [12, "twelfth"], [21, "twenty-first"], [22, "twenty-second"], [23, "twenty-third"]].map(([n, w]) => {
              const b = s.h("button", { class: "e2num", style: { padding: "6px 4px" } }, s.h("b", null, String(n), s.h("span", { class: "e2hl", style: { font: "inherit" } }, suf(n))), s.h("span", null, w));
              b.addEventListener("click", () => { EN(s, w); s.sfx.pop(); go(n, month); });
              return b;
            }));
          const oLife = life(s, "Im Alltag", s.h("p", { class: "small" }, "Geschrieben: 14th March oder 14 March. Gesprochen: the fourteenth of March."));
          oLife.classList.add("later");
          const BD = [["Lukas", 14, 2], ["Ruby", 2, 5], ["Julia", 23, 9], ["Grandpa Ken", 1, 7]];
          const bds = s.h("div", { class: "stack later", style: { gap: "8px" } }, s.h("p", { class: "t" }, s.h("b", null, "When's your birthday?"), " – tippe:"),
            s.h("div", { class: "row", style: { gap: "8px" } }, BD.map(([n, d, m]) => { const b = s.h("button", { class: "btn" }, n); b.addEventListener("click", async () => { s.sfx.click(); await go(d, m); EN(s, say()); }); return b; })));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Meist ", s.h("b", null, "-th"), ". Aber: 1", s.h("b", null, "st"), ", 2", s.h("b", null, "nd"), ", 3", s.h("b", null, "rd"), ", 21", s.h("b", null, "st"), " … und 11", s.h("b", null, "th"), ", 12", s.h("b", null, "th"), ", 13", s.h("b", null, "th"), "!");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "330px 1fr", gap: "24px", height: "100%" } },
            s.h("div", { class: "stack", style: { gap: "10px" } }, cal, word, sl, oLife),
            s.h("div", { class: "stack", style: { gap: "12px" } }, sBtn, RULE, bds, merk)));
          s.show(cal, "zoom"); s.sfx.pop();
          s.step(async () => { for (const d of [2, 3, 4, 5]) { await go(d, month); await s.wait(250); } s.say("first, second, third, fourth, fifth"); });
          s.step(async () => { s.sfx.pop(); await s.show(RULE, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(bds, "up"); await go(14, 2); s.say("Lukas hat am vierzehnten März Geburtstag."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.show(oLife, "up"); });
        },
      },
      /* 14 ----------------------------------------------------------- */
      {
        title: "Happy birthday!",
        say: "Heute ist Lukas' Geburtstag – er wird elf! Puste die Kerzen aus und sing mit.",
        build(s) {
          const svg = s.svg(470, 250), E = s.el;
          svg.append(E("ellipse", { cx: 235, cy: 232, rx: 200, ry: 14, fill: "#c8d3de" }),
            E("rect", { x: 70, y: 150, width: 330, height: 80, rx: 14, fill: "#f6b3a8" }), E("rect", { x: 100, y: 96, width: 270, height: 62, rx: 12, fill: "#fff1b8" }),
            E("path", { d: "M70 170 q20 14 41 0 t41 0 t41 0 t41 0 t41 0 t41 0 t41 0 t41 0", stroke: "#fff", "stroke-width": 7, fill: "none" }),
            E("path", { d: "M100 112 q17 12 34 0 t34 0 t34 0 t34 0 t34 0 t34 0 t34 0 t34 0", stroke: "#f06fa5", "stroke-width": 6, fill: "none" }));
          const flames = [];
          for (let i = 0; i < 11; i++) {
            const x = 116 + i * 24;
            svg.append(E("rect", { x: x - 4, y: 60, width: 8, height: 38, rx: 3, fill: ["#1d5bd0", "#dc3b2a", "#138a5a", "#ffd94a"][i % 4] }));
            const f = E("path", { d: `M${x} 34 Q${x + 9} 48 ${x} 58 Q${x - 9} 48 ${x} 34 Z`, fill: "#ffb020", stroke: "#ee7a1a", "stroke-width": 2, class: "e2g" });
            flames.push(f); svg.append(f);
          }
          s.loop(t => { flames.forEach((f, i) => { if (f.style.opacity !== "0") f.style.transform = `scaleX(${1 + 0.12 * Math.sin(t * 9 + i)})`; }); });
          const blow = s.h("button", { class: "btn solid" }, "💨 Blow out the candles!");
          blow.addEventListener("click", async () => { s.sfx.whoosh(); for (const f of flames) { f.style.opacity = "0"; await s.wait(40); } s.sound("kids-cheer", { vol: 0.6, force: true }); s.confetti(300, 300, 80); });
          const relight = s.h("button", { class: "btn" }, "🕯️ Neu anzünden");
          relight.addEventListener("click", () => { flames.forEach(f => (f.style.opacity = "")); s.sound("match-strike", { force: true }); });
          const LY = ["Happy birthday to you,", "Happy birthday to you,", "Happy birthday, dear Lukas,", "Happy birthday to you!"];
          const lyr = LY.map(l => s.h("p", { class: "e2lyr", style: { margin: 0 } }, l));
          const MEL = [[[-5, .3], [-5, .15], [-3, .45], [-5, .45], [0, .45], [-1, .9]], [[-5, .3], [-5, .15], [-3, .45], [-5, .45], [2, .45], [0, .9]], [[-5, .3], [-5, .15], [7, .45], [4, .45], [0, .45], [-1, .45], [-3, .9]], [[5, .3], [5, .15], [4, .45], [0, .45], [2, .45], [0, .9]]];
          const sing = s.h("button", { class: "btn solid" }, "🎵 Mitsingen");
          let singing = false;
          sing.addEventListener("click", async () => {
            if (singing) return; singing = true;
            for (const [li, line] of MEL.entries()) { lyr.forEach((l, j) => l.classList.toggle("on", j === li)); for (const [n, d] of line) { if (!s.alive) return; s.sfx.note(n, d * 0.9); await s.wait(d * 1000 * 0.9); } }
            lyr.forEach(l => l.classList.remove("on")); singing = false;
          });
          const lyrBox = s.h("div", { class: "card stack later", style: { gap: "0", padding: "10px 18px" } }, ...lyr);
          const PH = [["Happy birthday, Lukas!", "Alles Gute zum Geburtstag!"], ["Thank you!", "Danke!"], ["How old are you today?", "Wie alt wirst du heute?"], ["I'm eleven today!", "Ich werde heute elf!"]].map(([t, d]) => spk(s, t, { de: d, cls: "sm full later" }));
          const facts = [
            ["Birthday cards", "Briten verschicken viele Karten: im Schnitt etwa 55 Grußkarten pro Person im Jahr (Schätzung)."],
            ["Das Lied", "„Happy Birthday to You“ ist laut Guinness-Buch (1998) das bekannteste Lied auf Englisch."],
            ["100 Jahre", "Zum 100. Geburtstag schickt der König eine Glückwunschkarte – auch zum 105. und dann jedes Jahr."],
          ].map(([h, t]) => s.h("div", { class: "life later", style: { padding: "10px 14px" } }, s.h("span", { class: "exlabel" }, "In real life · " + h), s.h("p", { class: "small" }, t)));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "470px 1fr", gap: "22px", height: "100%" } },
            s.h("div", { class: "stack", style: { gap: "10px" } }, svg, s.h("div", { class: "row", style: { gap: "10px" } }, blow, relight, sing), lyrBox),
            s.h("div", { class: "stack", style: { gap: "7px" } }, ...PH, ...facts)));
          s.show(svg, "bounce"); s.sfx.boing();
          s.step(async () => { s.sfx.pop(); await s.show(PH, "right"); });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(lyrBox, "up"); s.say("Das Lied Happy Birthday to You kennt fast jeder auf der Welt."); });
          s.step(async () => { s.sound("applause", { vol: 0.45, dur: 3 }); await s.show(facts, "up"); });
        },
      },
      /* 15 ----------------------------------------------------------- */
      {
        title: "In real life: family & pets",
        say: "Jetzt wird es echt: ein Familienfoto beschreiben, einen Steckbrief schreiben und eine Notiz für den Hundesitter.",
        build(s) {
          const tabs = {}, panels = {};
          // panel 1: family photo
          const ph = s.svg(400, 330);
          ph.append(s.el("rect", { x: 6, y: 6, width: 388, height: 318, rx: 10, fill: "#fff", stroke: "#8a5a2b", "stroke-width": 10 }), s.el("rect", { x: 20, y: 20, width: 360, height: 290, fill: "#e8f6ff" }), s.el("rect", { x: 20, y: 250, width: 360, height: 60, fill: "#b9e3b0" }));
          [["sarah", 95, 290, 190], ["tom", 185, 290, 210], ["ruby", 270, 290, 150], ["sam", 330, 290, 112]].forEach(([k, x, y, h]) => ph.append(person(s, Object.assign({}, FAM[k].o, { x, y, h }))));
          ph.append(person(s, Object.assign({}, FAM.leo.o, { x: 140, y: 296, h: 112 })), dog(s, { x: 220, y: 300, sc: 0.6 }));
          const FL = ["This is my family.", "This is my mum. Her name is Sarah. She's got long, dark hair.", "My dad, Tom, is tall. He's got short, red hair and a beard.", "Sam and Leo are my brothers. They're twins.", "And this is our dog, Biscuit. He's three."];
          const fb = FL.map(t => spk(s, t, { cls: "sm full" }));
          const fPlay = s.h("button", { class: "btn solid" }, "▶ Alles vorlesen");
          fPlay.addEventListener("click", () => { s.sfx.click(); playSeq(s, fb.map((b, i) => [b, FL[i]])); });
          panels.photo = s.h("div", { class: "cols", style: { gridTemplateColumns: "400px 1fr", gap: "20px" } }, ph, s.h("div", { class: "stack", style: { gap: "8px" } }, s.h("p", { class: "small pencil" }, "Ruby zeigt Lukas ein Foto:"), ...fb, s.h("div", { class: "row" }, fPlay),
            life(s, "Im Alltag", s.h("p", { class: "small" }, "Ein Familienfoto beschreibst du im Video-Call mit deinem pen pal oder in einer kleinen presentation im Englischunterricht."))));
          // panel 2: Steckbrief
          const SB = [["Name", "My name is Lukas Schulz."], ["Age", "I'm 10."], ["Birthday", "My birthday is on the 14th of March."], ["Family", "I've got a sister. Her name is Julia."], ["Pets", "We've got a cat. Her name is Mo."], ["Favourite colour", "My favourite colour is green."]];
          const sbRows = SB.map(([k, t]) => s.h("div", { class: "e2field" }, s.h("span", null, k), spk(s, t, { cls: "sm full", say: t.replace("14th", "fourteenth") })));
          const pv = s.svg(150, 170); pv.append(s.el("rect", { x: 5, y: 5, width: 140, height: 160, rx: 10, fill: "#e4ecfb", stroke: "#8a94a6", "stroke-width": 3 }), cast(s, "lukas", 75, 160, { h: 145 }));
          panels.sb = s.h("div", { class: "card e2sb", style: { gridTemplateColumns: "170px 1fr", gap: "18px", padding: "14px 18px" } },
            s.h("div", { class: "stack", style: { gap: "8px", alignItems: "center" } }, s.h("p", { class: "h2", style: { color: "var(--unit)" } }, "All about me"), pv, s.h("p", { class: "small pencil", style: { textAlign: "center" } }, "Steckbrief = profile")),
            s.h("div", { class: "stack", style: { gap: "8px" } }, ...sbRows));
          // panel 3: pet-sitting note
          const NL = ["Dear Lukas,", "thank you for looking after Biscuit on Saturday!", "Feed him at 8 am and at 6 pm.", "Take him for a walk after lunch. His lead is in the kitchen.", "Please don't give him chocolate!", "Love, Ruby"];
          const nb = NL.map((t, i) => spk(s, i === 1 ? "Thank you for looking after Biscuit on Saturday!" : t, { label: i === 1 ? "Thank you for looking after Biscuit on Saturday!" : t, cls: "sm full", say: t.replace("8 am", "eight a.m.").replace("6 pm", "six p.m.") }));
          const nPlay = s.h("button", { class: "btn solid" }, "▶ Notiz vorlesen");
          nPlay.addEventListener("click", () => { s.sfx.click(); playSeq(s, nb.map((b, i) => [b, NL[i].replace("8 am", "eight a.m.").replace("6 pm", "six p.m.")])); });
          const nd = s.svg(300, 130); nd.append(dog(s, { x: 120, y: 124, sc: 1.05 }));
          const note = s.h("div", { class: "stack", style: { gap: "8px", background: "#fff9c4", border: "2px solid #e8d77a", borderRadius: "6px", padding: "14px 18px" } }, ...nb);
          panels.note = s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 300px", gap: "20px" } }, s.h("div", { class: "stack", style: { gap: "12px" } }, note, s.h("div", { class: "row" }, nPlay)),
            s.h("div", { class: "stack", style: { gap: "12px" } }, nd, s.h("div", { class: "merk", style: { fontSize: "21px" } }, s.h("b", null, "am"), " = vormittags (8 am = 8 Uhr)", s.h("br"), s.h("b", null, "pm"), " = nachmittags/abends (6 pm = 18 Uhr)"),
              life(s, "Im Alltag", s.h("p", { class: "small" }, "So eine Notiz schreibst du für Nachbarn, Oma oder Freunde, wenn sie auf dein Haustier aufpassen."))));
          const order = [["photo", "📷 Family photo"], ["sb", "📝 Steckbrief"], ["note", "🐾 Pet-sitting note"]];
          const area = s.h("div", { style: { flex: "1", minHeight: 0 } });
          const showTab = async (k, anim = true) => {
            Object.entries(tabs).forEach(([kk, t]) => t.classList.toggle("on", kk === k));
            Object.entries(panels).forEach(([kk, p]) => { p.style.display = kk === k ? "" : "none"; });
            if (anim) { s.sfx.whoosh(); await s.show(panels[k], "right"); }
          };
          order.forEach(([k, l]) => { tabs[k] = s.h("button", { class: "e2tab" }, l); tabs[k].addEventListener("click", () => showTab(k)); });
          Object.values(panels).forEach(p => area.append(p));
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%" } }, s.h("div", { class: "e2tabs" }, order.map(([k]) => tabs[k])), area));
          showTab("photo", false); s.show(panels.photo, "up"); s.sound("camera-shutter", { vol: 0.6 });
          s.step(async () => { await showTab("sb"); });
          s.step(async () => { await showTab("note"); s.sound("dog-bark", { vol: 0.6 }); s.confetti(700, 300, 60); });
        },
      },
    ],
  });
})();
