/* Unit 9 – Right now: weather, clothes and what are you doing? (Englisch Klasse 5).
   Cast: Ruby (11, London, Year 7, dog Biscuit), Lukas (10, Berlin, Klasse 5), his sister Julia (8) and her cat Mo,
   Ellie (11, Brighton). */
(() => {
  const EN = { lang: "en-GB", rate: 0.85 };
  const SPK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11"/></svg>';
  const CSS = `
.k9-spk{width:56px;min-width:56px;height:56px;padding:0;border-radius:50%;flex:none}
.k9-spk svg,.k9-hear svg{width:26px;height:26px;flex:none}
.k9-hear{padding:0 18px}
.k9-line{display:flex;align-items:center;gap:12px}
.k9-en{font-family:var(--f-body);font-weight:700;color:var(--ink);margin:0}
.k9-tag{font:700 19px/1.2 var(--f-display);color:var(--pencil);margin:0}
.k9-ping{animation:k9ping .45s ease}
@keyframes k9ping{50%{transform:scale(1.14)}}
.k9-g{transform-box:fill-box;transform-origin:50% 100%}
.k9-w{display:grid;grid-template-columns:52px 1fr auto;align-items:center;gap:12px;min-height:60px;padding:4px 14px 4px 8px;border-radius:14px;border:2px solid var(--line);background:#fff;cursor:pointer;color:var(--ink);text-align:left;width:100%}
.k9-w.on{border-color:var(--unit);background:var(--unit-soft)}
.k9-w b{font:700 24px/1.1 var(--f-body)}
.k9-w small{font:400 19px/1.1 var(--f-body);color:var(--pencil)}
.k9-w .em{font-size:34px;line-height:1;text-align:center}
.k9-tok{display:inline-block;white-space:nowrap;padding:6px 12px;border-radius:12px;background:#fff;border:3px solid var(--line);font:700 32px/1.15 var(--f-display)}
.k9-tok.be{border-color:var(--unit);color:var(--unit)}
.k9-tok.ing{border-color:var(--red);color:var(--red);margin-left:-15px}
.k9-tok.no{border-color:var(--red);background:#fdecea;color:var(--red)}
.k9-tok.q{border:0;background:none;padding:6px 2px}
.k9-pron{display:inline-block;color:#fff;border-radius:10px;padding:3px 10px;font:800 23px/1.15 var(--f-display);text-align:center}
.k9-let{display:inline-block;font:800 40px/1.1 var(--f-display);color:var(--ink);padding:0 1px}
.k9-let.new{color:var(--red)}
.k9-let.gone{color:var(--pencil);text-decoration:line-through;text-decoration-thickness:4px}
.k9-tile{display:flex;flex-direction:column;align-items:flex-start;gap:6px;background:#fff;border:2px solid var(--line);border-radius:16px;padding:10px 14px;cursor:pointer;color:var(--ink);text-align:left}
.k9-tile.on{border-color:var(--unit);background:var(--unit-soft)}
.k9-live{display:inline-flex;align-items:center;gap:8px;background:var(--red);color:#fff;border-radius:10px;padding:4px 12px;font:800 20px/1 var(--f-display)}
.k9-live i{width:12px;height:12px;border-radius:50%;background:#fff;animation:k9blink 1s infinite}
@keyframes k9blink{50%{opacity:.2}}
.k9-cl{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:56px;border-radius:14px;border:2px solid var(--line);background:#fff;cursor:pointer;color:var(--ink);padding:6px 4px;font:700 21px/1.1 var(--f-body)}
.k9-cl.on{border-color:var(--unit);background:var(--unit-soft)}
.k9-cl small{font:400 19px/1.1 var(--f-body);color:var(--pencil)}
.k9-bub{background:#fff;border:2px solid var(--line);border-radius:18px;padding:7px 14px;font-size:21px;line-height:1.3;font-weight:700;margin:0;flex:1;min-width:0}
.k9-av{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;font:800 21px/1 var(--f-display);color:#fff;flex:none}
.k9-day{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;border-radius:14px;border:2px solid var(--line);background:#fff;height:84px;font:700 20px/1 var(--f-display);color:var(--pencil)}
.k9-day .em{font-size:34px;line-height:1}
.k9-day.lit{border-color:#7b4fd6;background:#efe8fc;color:#7b4fd6}
.k9-day.now{border-color:var(--red);background:#fdecea;color:var(--red)}
`;
  if (!document.getElementById("k9css")) { const st = document.createElement("style"); st.id = "k9css"; st.textContent = CSS; document.head.appendChild(st); }

  function hear(s, text, label) {
    const b = s.h("button", { class: label ? "btn k9-hear" : "btn k9-spk", "aria-label": "Anhören: " + text, onclick: () => { s.sfx.click(); s.speak(typeof text === "function" ? text() : text, EN); ping(b); } });
    b.insertAdjacentHTML("afterbegin", SPK);
    if (label) b.append(s.h("span", null, label));
    return b;
  }
  function ping(el) { el.classList.remove("k9-ping"); void (el.getBBox ? el.getBBox() : el.offsetWidth); el.classList.add("k9-ping"); }
  /* a row: speaker button + English text (show = nodes to display instead of plain text) */
  function line(s, text, o = {}) {
    const p = s.h("p", { class: "k9-en", style: { fontSize: (o.size || 22) + "px", lineHeight: "1.3", flex: "1", minWidth: "0", color: o.color || null } }, o.show || text);
    if (o.de) p.append(s.h("span", { style: { display: "block", font: "400 19px/1.25 var(--f-body)", color: "var(--pencil)" } }, o.de));
    return s.h("div", { class: "k9-line" + (o.later ? " later" : ""), style: o.style || null }, hear(s, o.speak || text), p);
  }
  async function seq(s, els, kind = "pop", gap = 160, snd) {
    for (let i = 0; i < els.length; i++) {
      if (!s.alive) return;
      (snd || (j => s.sfx.count(j)))(i);
      s.show(els[i], kind);
      await s.wait(gap);
    }
  }
  const B = (s, t) => s.h("b", null, t);
  const RED = (s, t) => s.h("b", { style: { color: "var(--red)" } }, t);
  const U = (s, t) => s.h("b", { style: { color: "var(--unit)" } }, t);
  const PC = { I: "#1d5bd0", you: "#138a5a", he: "#ee7a1a", she: "#dc3b2a", it: "#8a5a2b", we: "#7b4fd6", they: "#0e7c8c" };
  const life = (s, label, ...kids) => s.h("div", { class: "life later", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, label), ...kids);
  const merk = (s, ...kids) => s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px" } }, ...kids);

  const SC = () => { const st = document.getElementById("stage"); return st ? st.getBoundingClientRect().width / 1180 || 1 : 1; };
  /** move children of row into a new order with a FLIP animation */
  async function reorder(s, row, els, arc = 50) {
    const sc = SC();
    const first = new Map(els.map(e => [e, e.getBoundingClientRect()]));
    els.forEach(e => row.appendChild(e));
    if (s.fast || !s.alive) return;
    const d = els.map(e => { const l = e.getBoundingClientRect(), f = first.get(e); return { e, dx: (f.left - l.left) / sc, dy: (f.top - l.top) / sc }; });
    d.forEach(x => { x.e.classList.remove("a-pop", "a-up", "a-zoom", "a-bounce", "a-fade"); x.e.style.transform = `translate(${x.dx}px,${x.dy}px)`; });
    await s.tween({ dur: 800, ease: "inOut", update: (v, t) => d.forEach(x => { const lift = Math.abs(x.dx) > 4 ? (x.dx > 0 ? arc : -arc) * Math.sin(Math.PI * t) : 0; x.e.style.transform = `translate(${x.dx * (1 - v)}px,${x.dy * (1 - v) + lift}px)`; }) });
    d.forEach(x => (x.e.style.transform = ""));
  }
  async function flipText(s, el, text) {
    if (s.fast || !s.alive) { el.textContent = text; return; }
    await s.tween({ dur: 140, ease: "in", update: v => { el.style.transform = `scaleY(${1 - v})`; } });
    el.textContent = text;
    await s.tween({ dur: 240, ease: "back", update: v => { el.style.transform = `scaleY(${v})`; } });
    el.style.transform = "";
  }

  /* ---------- the cast, drawn in SVG (origin = between the feet, height 200 at scale 1) ---------- */
  const CAST = {
    lukas: { skin: "#f2c9a5", hair: "#7a4b25", style: "short", shirt: "#ee7a1a", h: 150 },
    julia: { skin: "#f4cfae", hair: "#e2b649", style: "pony", shirt: "#138a5a", h: 126 },
    ruby: { skin: "#a8724a", hair: "#2a1a12", style: "curly", shirt: "#1e3a6e", tie: "#c0392b", skirt: "#2c3e50", glasses: true, h: 160 },
  };
  function person(s, o) {
    const E = s.el, sc = (o.h || 200) / 200;
    const outer = E("g", { class: "k9-g" });
    const g = E("g", { transform: `translate(${o.x} ${o.y}) scale(${sc})` });
    outer.append(g);
    const skin = o.skin || "#f2c9a5", hair = o.hair || "#5a3a22", shirt = o.shirt || "#1d5bd0", pants = o.pants || "#39435a";
    const st = o.style || "short";
    if (st === "long" || st === "curly") g.append(E("path", { d: "M-36 -170 C-46 -130 -44 -104 -26 -98 L26 -98 C44 -104 46 -130 36 -170 Z", fill: hair }));
    if (st === "curly") [-38, 38].forEach(x => [-150, -126, -104].forEach(y => g.append(E("circle", { cx: x, cy: y, r: 11, fill: hair }))));
    g.append(E("rect", { x: -19, y: -64, width: 15, height: 60, rx: 6, fill: o.skirt ? skin : pants }), E("rect", { x: 4, y: -64, width: 15, height: 60, rx: 6, fill: o.skirt ? skin : pants }));
    g.append(E("ellipse", { cx: -12, cy: -4, rx: 13, ry: 6, fill: "#262b36" }), E("ellipse", { cx: 12, cy: -4, rx: 13, ry: 6, fill: "#262b36" }));
    if (o.skirt) g.append(E("path", { d: "M-30 -74 L30 -74 L38 -38 L-38 -38 Z", fill: o.skirt }));
    g.append(E("rect", { x: -31, y: -132, width: 62, height: 74, rx: 20, fill: shirt }));
    g.append(E("path", { d: "M-26 -118 L-42 -72", stroke: shirt, "stroke-width": 15, "stroke-linecap": "round", fill: "none" }), E("circle", { cx: -43, cy: -66, r: 8, fill: skin }));
    if (o.wave) g.append(E("path", { d: "M26 -118 L48 -160", stroke: shirt, "stroke-width": 15, "stroke-linecap": "round", fill: "none" }), E("circle", { cx: 51, cy: -166, r: 8, fill: skin }));
    else if (o.reach) g.append(E("path", { d: "M26 -118 L62 -100", stroke: shirt, "stroke-width": 15, "stroke-linecap": "round", fill: "none" }), E("circle", { cx: 68, cy: -98, r: 8, fill: skin }));
    else g.append(E("path", { d: "M26 -118 L42 -72", stroke: shirt, "stroke-width": 15, "stroke-linecap": "round", fill: "none" }), E("circle", { cx: 43, cy: -66, r: 8, fill: skin }));
    if (o.tie) g.append(E("path", { d: "M-13 -132 L0 -114 L13 -132 Z", fill: "#fff" }), E("path", { d: "M-4 -120 L4 -120 L6 -96 L0 -89 L-6 -96 Z", fill: o.tie }));
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
    const E = s.el, outer = E("g", { class: "k9-g" }), g = E("g", { transform: `translate(${x} ${y}) scale(${sc})` });
    outer.append(g);
    [-34, -20, 18, 32].forEach(lx => g.append(E("rect", { x: lx, y: -36, width: 11, height: 36, rx: 4, fill: c })));
    g.append(E("path", { d: "M40 -52 Q64 -66 60 -90", stroke: c, "stroke-width": 9, "stroke-linecap": "round", fill: "none", transform: "scale(-1 1)" }));
    g.append(E("ellipse", { cx: 0, cy: -46, rx: 46, ry: 22, fill: c }));
    g.append(E("circle", { cx: 46, cy: -76, r: 23, fill: c }));
    g.append(E("path", { d: "M30 -62 Q44 -54 60 -58", stroke: "#dc3b2a", "stroke-width": 6, fill: "none", "stroke-linecap": "round" }));
    g.append(E("ellipse", { cx: 64, cy: -70, rx: 14, ry: 10, fill: "#e8cba0" }), E("circle", { cx: 76, cy: -73, r: 5, fill: "#1b2740" }), E("circle", { cx: 52, cy: -83, r: 3.6, fill: "#1b2740" }));
    g.append(E("ellipse", { cx: 33, cy: -76, rx: 9, ry: 18, fill: "#7a4b25", transform: "rotate(12 33 -76)" }));
    return outer;
  }
  function cat(s, { x, y, sc = 1, c = "#8d96a3" }) {
    const E = s.el, outer = E("g", { class: "k9-g" }), g = E("g", { transform: `translate(${x} ${y}) scale(${sc})` });
    outer.append(g);
    g.append(E("path", { d: "M-34 -40 Q-62 -50 -52 -96", stroke: c, "stroke-width": 9, "stroke-linecap": "round", fill: "none" }));
    [-26, -12, 14, 26].forEach(lx => g.append(E("rect", { x: lx, y: -30, width: 10, height: 30, rx: 4, fill: c })));
    g.append(E("ellipse", { cx: 0, cy: -40, rx: 38, ry: 19, fill: c }));
    g.append(E("path", { d: "M26 -82 L28 -106 L42 -90 Z M50 -90 L62 -106 L62 -80 Z", fill: c }));
    g.append(E("circle", { cx: 44, cy: -70, r: 21, fill: c }));
    g.append(E("circle", { cx: 37, cy: -74, r: 3.4, fill: "#1b2740" }), E("circle", { cx: 52, cy: -74, r: 3.4, fill: "#1b2740" }), E("path", { d: "M42 -66 L46 -66 L44 -63 Z", fill: "#e88a9a" }));
    return outer;
  }

  /* ---------- animated weather window (canvas) ---------- */
  const WX = {
    sunny: { t: "It's sunny.", de: "sonnig", em: "☀️", snd: "birds" },
    cloudy: { t: "It's cloudy.", de: "bewölkt", em: "☁️" },
    windy: { t: "It's windy.", de: "windig", em: "🌬️", snd: "wind" },
    foggy: { t: "It's foggy.", de: "neblig", em: "🌫️" },
    raining: { t: "It's raining.", de: "es regnet", em: "🌧️", snd: "rain" },
    snowing: { t: "It's snowing.", de: "es schneit", em: "❄️", snd: "magic-chime" },
    stormy: { t: "It's stormy.", de: "stürmisch, Gewitter", em: "⛈️", snd: "thunder" },
  };
  function weatherScene(s, W, H, init = "sunny", o = {}) {
    const { canvas, g } = s.canvas(W, H);
    canvas.style.borderRadius = "18px"; canvas.style.display = "block";
    let kind = init, flash = 0;
    const rnd = (a, b) => a + Math.random() * (b - a);
    const drops = Array.from({ length: 120 }, () => ({ x: rnd(0, W), y: rnd(0, H), v: rnd(380, 520) }));
    const flakes = Array.from({ length: 80 }, () => ({ x: rnd(0, W), y: rnd(0, H), v: rnd(30, 60), r: rnd(2, 4.5), p: rnd(0, 6) }));
    const leaves = Array.from({ length: 14 }, () => ({ x: rnd(0, W), y: rnd(0, H * 0.7), v: rnd(160, 260), p: rnd(0, 6) }));
    const SKY = { sunny: ["#5fb8f0", "#cdeeff"], cloudy: ["#9fb0c2", "#dde4ea"], raining: ["#6f8091", "#b5c1cc"], snowing: ["#aebccb", "#e9eef3"], windy: ["#7cc3ee", "#d8f0ff"], foggy: ["#c5cbd2", "#e6e8eb"], stormy: ["#2f3a4a", "#6b7686"] };
    const sc = H / 400;
    const cloud = (x, y, k, col) => { g.fillStyle = col; g.beginPath(); [[0, 0, 30], [28, -14, 34], [60, 0, 30], [30, 8, 30]].forEach(([dx, dy, r]) => { g.moveTo(x + dx * k + r * k, y + dy * k); g.arc(x + dx * k, y + dy * k, r * k, 0, 7); }); g.fill(); };
    const draw = (t, dt) => {
      dt = Math.min(dt || 0, 0.05);
      const k = kind, [a, b] = SKY[k];
      const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      if (k === "sunny" || k === "windy") {
        const sx = W * 0.8, sy = H * 0.2; g.save(); g.translate(sx, sy); g.rotate(t * 0.4); g.strokeStyle = "#ffb703"; g.lineWidth = 6 * sc; g.lineCap = "round";
        for (let i = 0; i < 12; i++) { g.rotate(Math.PI / 6); g.beginPath(); g.moveTo(0, 48 * sc); g.lineTo(0, 64 * sc); g.stroke(); }
        g.restore(); g.fillStyle = "#ffd23f"; g.beginPath(); g.arc(sx, sy, 38 * sc, 0, 7); g.fill();
      }
      const cc = { sunny: 1, windy: 2, cloudy: 4, raining: 4, snowing: 3, foggy: 2, stormy: 5 }[k];
      const col = k === "stormy" ? "#4a5566" : k === "raining" ? "#8795a3" : "#ffffff";
      const spd = k === "windy" ? 70 : k === "stormy" ? 34 : 12;
      for (let i = 0; i < cc; i++) { const x = ((i * W / cc * 1.3 + t * spd * (1 + i * 0.2)) % (W + 200)) - 120; cloud(x, (50 + (i % 2) * 40) * sc, (1 + (i % 3) * 0.25) * sc, col); }
      g.fillStyle = k === "snowing" ? "#f4f7fb" : "#6dbb5a"; g.beginPath(); g.ellipse(W * 0.5, H + 60 * sc, W * 0.8, 140 * sc, 0, 0, 7); g.fill();
      const hx = W * 0.1, hy = H - 118 * sc, q = sc;
      g.fillStyle = "#e8d2b0"; g.fillRect(hx, hy, 90 * q, 70 * q); g.fillStyle = "#b5532a"; g.beginPath(); g.moveTo(hx - 10 * q, hy); g.lineTo(hx + 45 * q, hy - 40 * q); g.lineTo(hx + 100 * q, hy); g.fill();
      g.fillStyle = "#5b8fd1"; g.fillRect(hx + 14 * q, hy + 16 * q, 22 * q, 22 * q); g.fillStyle = "#7a4b25"; g.fillRect(hx + 54 * q, hy + 30 * q, 22 * q, 40 * q);
      if (k === "snowing") { g.fillStyle = "#fff"; g.beginPath(); g.moveTo(hx - 10 * q, hy); g.lineTo(hx + 45 * q, hy - 40 * q); g.lineTo(hx + 100 * q, hy); g.lineTo(hx + 90 * q, hy + 6 * q); g.lineTo(hx + 45 * q, hy - 28 * q); g.lineTo(hx, hy + 6 * q); g.fill(); }
      const sway = (k === "windy" || k === "stormy") ? Math.sin(t * 4) * 0.12 : Math.sin(t * 1.2) * 0.02;
      g.save(); g.translate(W * 0.68, H - 52 * sc); g.rotate(sway); g.scale(sc, sc); g.fillStyle = "#7a4b25"; g.fillRect(-8, -90, 16, 90);
      g.fillStyle = k === "snowing" ? "#dfe8f0" : "#2f8a3a"; g.beginPath(); g.arc(0, -110, 46, 0, 7); g.arc(-30, -90, 30, 0, 7); g.arc(30, -90, 30, 0, 7); g.fill(); g.restore();
      if (k === "raining" || k === "stormy") {
        g.strokeStyle = "rgba(30,70,150,.65)"; g.lineWidth = 2; g.beginPath();
        drops.forEach(d => { d.y += d.v * dt; d.x -= (k === "stormy" ? 120 : 30) * dt; if (d.y > H) { d.y = -10; d.x = rnd(0, W + 60); } if (d.x < -10) d.x = W; g.moveTo(d.x, d.y); g.lineTo(d.x - (k === "stormy" ? 5 : 2), d.y + 14); });
        g.stroke();
      }
      if (k === "snowing") { g.fillStyle = "#fff"; flakes.forEach(f => { f.y += f.v * dt; f.x += Math.sin(t * 1.5 + f.p) * 0.4; if (f.y > H) { f.y = -6; f.x = rnd(0, W); } g.beginPath(); g.arc(f.x, f.y, f.r, 0, 7); g.fill(); }); }
      if (k === "windy") {
        g.fillStyle = "#e07b1a";
        leaves.forEach(l => { l.x += l.v * dt; l.y += Math.sin(t * 3 + l.p) * 1.2; if (l.x > W + 10) { l.x = -10; l.y = rnd(20, H * 0.7); } g.save(); g.translate(l.x, l.y); g.rotate(t * 5 + l.p); g.beginPath(); g.ellipse(0, 0, 8, 4, 0, 0, 7); g.fill(); g.restore(); });
        g.strokeStyle = "rgba(255,255,255,.85)"; g.lineWidth = 3; g.lineCap = "round";
        for (let i = 0; i < 4; i++) { const x = ((t * 300 + i * 170) % (W + 200)) - 100, y = (80 + i * 45) * sc; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 40, y - 12, x + 80, y); g.stroke(); }
      }
      if (k === "foggy") for (let i = 0; i < 6; i++) { g.fillStyle = "rgba(255,255,255,.55)"; const x = ((t * 20 * (i % 2 ? 1 : -1) + i * 90) % W + W) % W; [x, x - W].forEach(xx => { g.beginPath(); g.ellipse(xx, H * 0.3 + i * 42 * sc, W * 0.6, 26 * sc, 0, 0, 7); g.fill(); }); }
      if (k === "stormy") {
        if (flash > 0) { g.fillStyle = `rgba(255,255,255,${flash * 0.6})`; g.fillRect(0, 0, W, H); g.strokeStyle = "#ffe14a"; g.lineWidth = 6; g.beginPath(); g.moveTo(W * 0.48, 50 * sc); g.lineTo(W * 0.43, 130 * sc); g.lineTo(W * 0.5, 130 * sc); g.lineTo(W * 0.42, 220 * sc); g.stroke(); flash -= dt * 1.5; }
        else if (Math.random() < dt * 0.4) flash = 0.8;
      }
      if (o.label) { g.font = `700 ${Math.round(20)}px "Atkinson Hyperlegible", sans-serif`; const tw = g.measureText(o.label).width; g.fillStyle = "rgba(27,39,64,.75)"; g.beginPath(); g.roundRect ? g.roundRect(10, 10, tw + 20, 32, 8) : g.rect(10, 10, tw + 20, 32); g.fill(); g.fillStyle = "#fff"; g.fillText(o.label, 20, 33); }
    };
    draw(0, 0); s.loop(draw);
    return { el: canvas, set(k) { kind = k; if (k === "stormy") flash = 0.9; }, get kind() { return kind; } };
  }

  /* ---------- dress-up kid (viewBox 260 × 430) ---------- */
  const OUTFIT_SLOTS = { tshirt: "top", jumper: "top", shorts: "legs", jeans: "legs", jacket: "outer", raincoat: "outer", hat: "head", cap: "head", scarf: "neck", gloves: "hands", trainers: "feet", wellies: "feet" };
  function kid(s) {
    const E = s.el, svg = s.svg(260, 430);
    const skin = "#f2c9a5", hair = "#7a4b25";
    const grp = (...k) => { const g = E("g", { class: "k9-g" }); k.forEach(x => g.append(x)); return g; };
    const it = {};
    // body
    svg.append(E("ellipse", { cx: 130, cy: 404, rx: 80, ry: 10, fill: "#000", opacity: .08 }));
    svg.append(E("rect", { x: 102, y: 222, width: 24, height: 168, rx: 10, fill: skin }), E("rect", { x: 134, y: 222, width: 24, height: 168, rx: 10, fill: skin }));
    it.shorts = grp(E("path", { d: "M94 214 H166 V282 H134 L130 250 L126 282 H94 Z", fill: "#c9a46a" }));
    it.jeans = grp(E("path", { d: "M94 214 H166 L162 386 H134 L130 260 L126 386 H98 Z", fill: "#3b63a8" }), E("path", { d: "M130 222 V250", stroke: "#2a4a80", "stroke-width": 3 }));
    it.trainers = grp(E("path", { d: "M92 382 h36 v10 a6 6 0 0 1 -6 6 h-36 a8 8 0 0 1 6 -16z", fill: "#fff", stroke: "#8a94a6", "stroke-width": 3 }), E("path", { d: "M132 382 h36 a8 8 0 0 1 6 16 h-36 a6 6 0 0 1 -6 -6z", fill: "#fff", stroke: "#8a94a6", "stroke-width": 3 }), E("path", { d: "M84 394 h44 M132 394 h44", stroke: "#dc3b2a", "stroke-width": 3 }));
    it.wellies = grp(E("path", { d: "M98 318 h32 v80 h-44 a8 8 0 0 1 8 -14 h4z", fill: "#2f8a3a" }), E("path", { d: "M130 318 h32 v66 h4 a8 8 0 0 1 8 14 h-44z", fill: "#2f8a3a" }), E("path", { d: "M98 326 h32 M130 326 h32", stroke: "#1f6a2a", "stroke-width": 4 }));
    // arms (skin) behind sleeves
    const armL = E("path", { d: "M100 136 L72 232", stroke: skin, "stroke-width": 18, "stroke-linecap": "round" }), armR = E("path", { d: "M160 136 L188 232", stroke: skin, "stroke-width": 18, "stroke-linecap": "round" });
    svg.append(it.shorts, it.jeans, it.trainers, it.wellies, armL, armR);
    const torso = c => E("rect", { x: 92, y: 122, width: 76, height: 108, rx: 18, fill: c });
    it.tshirt = grp(torso("#dc3b2a"), E("path", { d: "M100 136 L88 176 M160 136 L172 176", stroke: "#dc3b2a", "stroke-width": 24, "stroke-linecap": "round" }));
    it.jumper = grp(torso("#138a5a"), E("path", { d: "M100 136 L74 226 M160 136 L186 226", stroke: "#138a5a", "stroke-width": 24, "stroke-linecap": "round" }), E("path", { d: "M94 222 H166", stroke: "#0d6a44", "stroke-width": 8 }), E("path", { d: "M112 142 h36 M112 160 h36 M112 178 h36", stroke: "#fff", "stroke-width": 4, opacity: .5 }));
    it.jacket = grp(E("path", { d: "M90 126 H128 V244 H88 Z M132 126 H170 L172 244 H132 Z", fill: "#1d5bd0" }), E("path", { d: "M100 136 L72 228 M160 136 L188 228", stroke: "#1d5bd0", "stroke-width": 26, "stroke-linecap": "round" }), E("path", { d: "M130 128 V244", stroke: "#a9bde6", "stroke-width": 4, "stroke-dasharray": "6 6" }));
    it.raincoat = grp(E("path", { d: "M100 76 C100 30 160 30 160 76 L156 96 C150 60 110 60 104 96 Z", fill: "#f2c200" }), E("path", { d: "M88 124 H172 L180 300 H80 Z", fill: "#f2c200" }), E("path", { d: "M100 136 L72 228 M160 136 L188 228", stroke: "#f2c200", "stroke-width": 26, "stroke-linecap": "round" }), E("path", { d: "M130 126 V300", stroke: "#b88f00", "stroke-width": 3 }), ...[150, 190, 230, 270].map(y => E("circle", { cx: 138, cy: y, r: 4, fill: "#b88f00" })));
    svg.append(it.tshirt, it.jumper, it.jacket, it.raincoat);
    svg.append(E("circle", { cx: 70, cy: 238, r: 10, fill: skin }), E("circle", { cx: 190, cy: 238, r: 10, fill: skin }));
    it.gloves = grp(E("circle", { cx: 70, cy: 238, r: 14, fill: "#7b4fd6" }), E("circle", { cx: 190, cy: 238, r: 14, fill: "#7b4fd6" }));
    svg.append(it.gloves);
    svg.append(E("rect", { x: 120, y: 106, width: 20, height: 20, fill: skin }), E("circle", { cx: 130, cy: 74, r: 38, fill: skin }), E("circle", { cx: 92, cy: 78, r: 7, fill: skin }), E("circle", { cx: 168, cy: 78, r: 7, fill: skin }));
    svg.append(E("path", { d: "M92 70 C88 26 172 26 168 70 C160 52 140 46 128 54 C114 46 98 54 92 70 Z", fill: hair }));
    svg.append(E("circle", { cx: 117, cy: 76, r: 4.5, fill: "#1b2740" }), E("circle", { cx: 143, cy: 76, r: 4.5, fill: "#1b2740" }), E("path", { d: "M116 94 Q130 104 144 94", stroke: "#1b2740", "stroke-width": 3.5, fill: "none", "stroke-linecap": "round" }));
    it.scarf = grp(E("rect", { x: 106, y: 108, width: 48, height: 20, rx: 9, fill: "#dc3b2a" }), E("rect", { x: 136, y: 116, width: 18, height: 58, rx: 6, fill: "#dc3b2a" }), E("path", { d: "M140 140 h14 M140 156 h14", stroke: "#fff", "stroke-width": 4 }));
    it.hat = grp(E("path", { d: "M90 66 C90 10 170 10 170 66 Z", fill: "#7b4fd6" }), E("rect", { x: 86, y: 56, width: 88, height: 16, rx: 7, fill: "#5b34b0" }), E("circle", { cx: 130, cy: 18, r: 12, fill: "#f2c200" }));
    it.cap = grp(E("path", { d: "M92 60 C92 22 168 22 168 60 Z", fill: "#dc3b2a" }), E("path", { d: "M160 56 h38 a6 6 0 0 1 0 12 h-40 z", fill: "#a8281b" }));
    svg.append(it.scarf, it.hat, it.cap);
    const on = {};
    const set = (item, show) => { const g = it[item]; if (show) { g.style.display = ""; on[item] = true; } else { g.style.display = "none"; delete on[item]; } };
    Object.keys(it).forEach(k => set(k, false));
    const api = {
      svg, on,
      /* put an item on (replaces the item in the same slot); returns the group */
      wear(item, animate = true) {
        const slot = OUTFIT_SLOTS[item];
        Object.keys(OUTFIT_SLOTS).forEach(k => { if (k !== item && OUTFIT_SLOTS[k] === slot) set(k, false); });
        set(item, true);
        if (animate) { it[item].classList.remove("a-pop"); void it[item].getBBox(); it[item].classList.add("a-pop"); }
        return it[item];
      },
      off(item) { set(item, false); },
      outfit(list, animate) { Object.keys(it).forEach(k => set(k, false)); list.forEach(k => api.wear(k, animate)); },
    };
    return api;
  }

  /* ---------- small vignette helpers ---------- */
  const book = (s, x, y) => s.el("g", null, s.el("path", { d: `M${x} ${y} l22 -6 v26 l-22 6z`, fill: "#1d5bd0" }), s.el("path", { d: `M${x} ${y} l-22 -6 v26 l22 6z`, fill: "#3a78e0" }));

  Deck.unit({
    id: "u9", num: 9, title: "Right now: weather and clothes", color: "#a16207", soft: "#fdf3d1",
    subtitle: "What are you doing? – Wetter, Kleidung und das present progressive",
    blurb: "Wetter, Kleidung, I'm wearing … – und was passiert gerade?",
    goals: ["Das Wetter beschreiben: It's sunny. It's raining.", "Jahreszeiten – in London und Berlin", "Kleidung: Was ziehst du heute an? I'm wearing …", "Present progressive: I'm reading. Are you …? – Yes, I am.", "every day oder right now? – simple present oder -ing"],
    icon(svg, el) {
      svg.append(el("circle", { cx: 35, cy: 35, r: 28, fill: "#a16207", opacity: .14 }),
        el("circle", { cx: 26, cy: 26, r: 11, fill: "#f2c200" }),
        el("path", { d: "M22 50 a12 12 0 0 1 4 -23 a15 15 0 0 1 28 5 a9 9 0 0 1 2 18 z", fill: "#fff", stroke: "#a16207", "stroke-width": 3 }),
        el("path", { d: "M28 56 l-3 7 M38 56 l-3 7 M48 56 l-3 7", stroke: "#1d5bd0", "stroke-width": 3, "stroke-linecap": "round" }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "What's the weather like?",
        say: "Wie ist das Wetter? Tippe auf ein Wetter – das Fenster zeigt es dir, und du hörst den Satz.",
        build(s) {
          const sc = weatherScene(s, 560, 400, "sunny");
          const ans = s.h("p", { class: "k9-en", style: { fontSize: "34px", color: "var(--unit)" } }, WX.sunny.t);
          const ansHear = hear(s, () => ans.textContent);
          const keys = Object.keys(WX);
          const btn = {};
          const pick = (k, quiet) => {
            sc.set(k); Object.entries(btn).forEach(([kk, b]) => b.classList.toggle("on", kk === k));
            ans.textContent = WX[k].t; ping(ans);
            if (quiet) return;
            if (WX[k].snd) s.sound(WX[k].snd, { vol: .45, dur: 3, fade: .6 }); else s.sfx.whoosh();
            s.speak(WX[k].t, EN);
          };
          keys.forEach(k => { btn[k] = s.h("button", { class: "k9-w later", style: { minHeight: "76px" }, onclick: () => pick(k) }, s.h("span", { class: "em" }, WX[k].em), s.h("span", null, s.h("b", null, WX[k].t)), s.h("small", null, WX[k].de)); });
          const q = s.h("div", { class: "card", style: { padding: "10px 16px", display: "flex", flexDirection: "column", gap: "4px" } },
            line(s, "What's the weather like today?", { size: 22, de: "Wie ist das Wetter heute?" }),
            s.h("div", { class: "k9-line" }, ansHear, ans));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "560px 1fr", gap: "22px", height: "100%" } },
            s.h("div", { class: "stack", style: { gap: "14px" } }, sc.el, q), s.h("div", { class: "stack", style: { gap: "8px" } }, keys.map(k => btn[k]))));
          s.preload("rain", "wind", "thunder", "magic-chime");
          pick("sunny", true); s.show(btn.sunny, "left"); s.sound("birds", { vol: .4, dur: 3, fade: .6 });
          s.step(async () => { for (const k of ["cloudy", "windy", "foggy"]) { s.show(btn[k], "left"); pick(k); await s.wait(1400); } s.say("Bewölkt, windig, neblig."); });
          s.step(async () => { for (const k of ["raining", "snowing", "stormy"]) { s.show(btn[k], "left"); pick(k); await s.wait(1600); } s.say("Es regnet, es schneit, Gewitter."); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "sunny, windy – raining, snowing",
        say: "Aus sun wird sunny, aus wind wird windy. Aber Regen und Schnee sind Verben: It's raining, it's snowing.",
        build(s) {
          const mk = (base, add, word, de, extra) => {
            const a = s.h("span", { class: "k9-en", style: { fontSize: "28px" } }, base);
            const plus = s.h("span", { class: "k9-en later", style: { fontSize: "28px", color: "var(--red)" } }, add);
            const res = s.h("span", { class: "k9-en later", style: { fontSize: "24px", color: "var(--unit)" } }, word);
            const r = s.h("div", { style: { display: "grid", gridTemplateColumns: "56px 160px 1fr", alignItems: "center", gap: "10px", minHeight: "58px", borderBottom: "2px solid var(--line)" } },
              hear(s, `${base}. ${word}`), s.h("span", { style: { whiteSpace: "nowrap" } }, a, plus), s.h("span", null, res, s.h("span", { class: "small pencil" }, "  " + de)));
            r.run = async () => { s.sfx.snap(); await s.show(plus, "bounce"); s.sfx.pop(); await s.show(res, "left"); if (extra) extra(); };
            return r;
          };
          const ADJ = [mk("sun", "ny", "It's sunny.", "sonnig"), mk("cloud", "y", "It's cloudy.", "bewölkt"), mk("wind", "y", "It's windy.", "windig"), mk("fog", "gy", "It's foggy.", "neblig"), mk("storm", "y", "It's stormy.", "stürmisch")];
          const VB = [mk("rain", "ing", "It's raining.", "es regnet (gerade)", () => s.sound("rain", { vol: .4, dur: 2.5, fade: .5 })), mk("snow", "ing", "It's snowing.", "es schneit (gerade)")];
          const left = s.h("div", { class: "card", style: { padding: "10px 18px" } },
            s.h("span", { class: "exlabel" }, "Nomen + y → It's …y"), ADJ,
            s.h("span", { class: "exlabel", style: { marginTop: "14px" } }, "Verb + ing → It's …ing"), VB);
          /* thermometer */
          const tv = s.svg(130, 330), E = s.el;
          const yOf = c => 280 - (c + 10) * 5.6;
          tv.append(E("rect", { x: 40, y: 20, width: 30, height: 270, rx: 15, fill: "#fff", stroke: "#8a94a6", "stroke-width": 3 }), E("circle", { cx: 55, cy: 295, r: 24, fill: "#dc3b2a", stroke: "#8a94a6", "stroke-width": 3 }));
          [-10, 0, 10, 20, 30].forEach(c => tv.append(E("line", { x1: 72, x2: 84, y1: yOf(c), y2: yOf(c), stroke: "#5d6678", "stroke-width": 2 }), E("text", { x: 90, y: yOf(c) + 7, "font-size": 19, fill: "#5d6678", text: String(c) })));
          const merc = E("rect", { x: 47, y: yOf(20), width: 16, height: 290 - yOf(20), rx: 8, fill: "#dc3b2a" });
          tv.append(merc);
          const word = c => (c <= 0 ? ["It's freezing!", "eiskalt"] : c < 10 ? ["It's cold.", "kalt"] : c < 17 ? ["It's cool.", "kühl"] : c < 25 ? ["It's warm.", "warm"] : ["It's hot!", "heiß"]);
          const tSay = s.h("p", { class: "k9-en", style: { fontSize: "28px", color: "var(--unit)", whiteSpace: "nowrap" } });
          const tDe = s.h("p", { class: "small pencil" });
          let cur = 20;
          const deg = c => (c < 0 ? "minus " + -c : String(c)) + (Math.abs(c) === 1 ? " degree" : " degrees");
          const render = c => { cur = c; merc.setAttribute("y", yOf(c)); merc.setAttribute("height", 290 - yOf(c)); const [w, d] = word(c); tSay.textContent = ""; tSay.append(`It's ${c} degree${Math.abs(c) === 1 ? "" : "s"}.`, s.h("br"), w); tDe.textContent = `${s.fmt(c)} Grad – ${d}`; };
          render(20);
          const sl = s.slider({ label: "Temperatur", min: -10, max: 35, value: 20, fmt: v => s.fmt(v) + " °C", onInput: render });
          const tHear = hear(s, () => `It's ${deg(cur)}. ${word(cur)[0]}`);
          const thermo = s.h("div", { class: "card", style: { padding: "10px 16px", display: "grid", gridTemplateColumns: "130px 1fr", gap: "14px", alignItems: "center" } }, tv,
            s.h("div", { class: "stack", style: { gap: "10px" } }, s.h("div", { class: "k9-line" }, tHear, tSay), tDe, sl));
          const ex = life(s, "Im Alltag", s.h("div", { class: "stack", style: { gap: "6px" } },
            line(s, "It's raining – take an umbrella!", { size: 21 }), line(s, "It's windy – let's fly a kite!", { size: 21 }), line(s, "It's hot – let's go to the lido!", { size: 21 })));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 470px", gap: "22px", height: "100%", alignItems: "start" } }, left, s.h("div", { class: "stack", style: { gap: "12px" } }, thermo, ex)));
          s.sfx.whoosh();
          s.step(async () => { for (const r of ADJ) await r.run(); s.say("Sun wird zu sunny – mit doppeltem n! Fog wird zu foggy."); });
          s.step(async () => { for (const r of VB) await r.run(); s.say("Rain und snow: Hier steht ing, denn es regnet gerade."); });
          s.step(async () => { s.sfx.whoosh(); await s.tween({ from: 20, to: -5, dur: 900, update: v => render(Math.round(v)) }); sl.set(-5); s.sfx.chord([0, 3, 7]); await s.wait(500); await s.tween({ from: -5, to: 28, dur: 1200, update: v => render(Math.round(v)) }); sl.set(28); s.speak("It's twenty-eight degrees. It's hot!", EN); });
          s.step(async () => { s.sfx.pop(); await s.show(ex, "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "British weather – Berlin weather",
        say: "Regnet es in London wirklich ständig? Schauen wir uns echte Fotos und echte Zahlen an.",
        build(s) {
          const P = [
            ["rain-oxford-street", "It's raining in London.", "Oxford Street, London", "rain"],
            ["tower-bridge-fog", "It's foggy in London.", "Tower Bridge im Nebel", null],
            ["kite-park", "It's sunny and windy.", "Regent's Park, London", "wind"],
            ["berlin-snow", "It's snowing in Berlin.", "Brandenburger Tor", null],
          ].map(([id, t, cap, snd]) => {
            const f = s.photo(id, { w: 255, h: 170, caption: cap });
            const c = s.h("div", { class: "stack later", style: { gap: "6px" } }, f, line(s, t, { size: 20 }));
            c.snd = snd; return c;
          });
          const bars = [["London", 557, "#1d5bd0"], ["Berlin", 571, "#a16207"], ["Rom", 799, "#5d6678"]];
          const bv = s.svg(470, 220), E = s.el;
          const bEls = bars.map(([n, mm, c], i) => {
            const y = 20 + i * 66;
            bv.append(E("text", { x: 0, y: y + 32, "font-size": 22, "font-weight": 700, fill: "#1b2740", text: n }));
            const r = E("rect", { x: 90, y: y + 6, width: 0, height: 40, rx: 8, fill: c });
            const t = E("text", { x: 100, y: y + 34, "text-anchor": "end", "font-size": 21, "font-weight": 700, fill: "#fff", text: "", class: "later" });
            bv.append(r, t); return { r, t, mm };
          });
          const chart = s.h("div", { class: "card later", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, "Regen pro Jahr (Mittelwert)"), bv,
            s.h("p", { class: "small", style: { marginTop: "4px" } }, "London und Berlin: fast gleich viel Regen – rund 110 Regentage im Jahr. In Rom fällt sogar mehr!"));
          const talk = s.h("div", { class: "life later", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, "Small talk – very British!"),
            s.h("div", { class: "stack", style: { gap: "6px" } }, line(s, "Lovely day, isn't it?", { size: 21, de: "Schöner Tag, oder?" }), line(s, "Terrible weather today!", { size: 21, de: "Schreckliches Wetter heute!" })),
            s.h("p", { class: "small", style: { marginTop: "6px" } }, "Für 60 % der Menschen in Großbritannien ist das Wetter das liebste Small-Talk-Thema. Im Schnitt reden sie über 56 Stunden im Jahr übers Wetter!"));
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%" } }, s.h("div", { class: "cols4", style: { gap: "14px" } }, P),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", alignItems: "start" } }, chart, talk)));
          const showP = async (i) => { if (P[i].snd) s.sound(P[i].snd, { vol: .4, dur: 2.5, fade: .5 }); else s.sfx.pop(); await s.show(P[i], "up"); };
          showP(0); s.wait(300).then(() => showP(1));
          s.step(async () => { await showP(2); await showP(3); s.say("Sonnig und windig im Park – und Schnee in Berlin."); });
          s.step(async () => {
            s.sfx.whoosh(); await s.show(chart, "up");
            for (const b of bEls) { s.sfx.count(bEls.indexOf(b)); await s.tween({ from: 0, to: b.mm * 0.42, dur: 700, ease: "out", update: v => b.r.setAttribute("width", v) }); b.t.setAttribute("x", 90 + b.mm * 0.42 - 12); b.t.textContent = "≈ " + (Math.round(b.mm / 10) * 10) + " mm"; s.show(b.t, "fade"); }
            s.say("London und Berlin bekommen fast gleich viel Regen.");
          });
          s.step(async () => { s.sfx.ding(); await s.show(talk, "up"); s.speak("Lovely day, isn't it?", EN); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Spring, summer, autumn, winter",
        say: "Die vier Jahreszeiten. Tippe auf eine Jahreszeit – der Baum verändert sich.",
        build(s) {
          const W = 440, H = 600;
          const { canvas, g } = s.canvas(W, H); canvas.style.borderRadius = "18px";
          const SEA = {
            spring: { de: "Frühling", m: "March, April, May", t: "In spring it's often sunny and warm. The trees are green again.", sky: ["#8fd0f5", "#e6f6ff"], leaf: "#7cc95a", p: "#f7a8c4" },
            summer: { de: "Sommer", m: "June, July, August", t: "In summer it's hot. We go to the lido.", sky: ["#4fb0f0", "#c9ecff"], leaf: "#2f8a3a", p: null },
            autumn: { de: "Herbst", m: "September, October, November", t: "In autumn it's windy and it often rains.", sky: ["#a8b8c6", "#e8e2d6"], leaf: "#e07b1a", p: "#d9531e" },
            winter: { de: "Winter", m: "December, January, February", t: "In winter it's cold. Sometimes it snows.", sky: ["#b8c6d4", "#eef2f6"], leaf: null, p: "#ffffff" },
          };
          let sea = "spring";
          const rnd = (a, b) => a + Math.random() * (b - a);
          const parts = Array.from({ length: 50 }, () => ({ x: rnd(0, W), y: rnd(0, H), v: rnd(30, 70), p: rnd(0, 6) }));
          const draw = (t, dt) => {
            dt = Math.min(dt || 0, .05); const S = SEA[sea];
            const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, S.sky[0]); gr.addColorStop(1, S.sky[1]); g.fillStyle = gr; g.fillRect(0, 0, W, H);
            if (sea === "summer") { g.fillStyle = "#ffd23f"; g.beginPath(); g.arc(360, 70, 40 + Math.sin(t * 2) * 3, 0, 7); g.fill(); }
            g.save(); g.translate(0, H - 420);
            g.fillStyle = sea === "winter" ? "#f4f7fb" : sea === "autumn" ? "#8fae5a" : "#6dbb5a"; g.beginPath(); g.ellipse(W / 2, 460, W * .8, 110, 0, 0, 7); g.fill();
            g.fillStyle = "#6b4423"; g.beginPath(); g.moveTo(205, 360); g.lineTo(212, 210); g.lineTo(228, 210); g.lineTo(235, 360); g.fill();
            g.strokeStyle = "#6b4423"; g.lineWidth = 9; g.lineCap = "round"; [[220, 240, 160, 170], [220, 230, 290, 160], [220, 215, 220, 130]].forEach(([a, b, c, d]) => { g.beginPath(); g.moveTo(a, b); g.lineTo(c, d); g.stroke(); });
            if (S.leaf) { g.fillStyle = S.leaf; [[220, 150, 80], [150, 180, 55], [290, 175, 58], [190, 120, 50], [255, 120, 50]].forEach(([x, y, r]) => { g.beginPath(); g.arc(x, y + Math.sin(t * 1.5 + x) * 2, r, 0, 7); g.fill(); }); }
            if (sea === "spring") { g.fillStyle = "#fff"; for (let i = 0; i < 26; i++) { const a = i * 2.4, r = 30 + (i * 13) % 70; g.beginPath(); g.arc(220 + Math.cos(a) * r * 1.2, 160 + Math.sin(a) * r * .8, 6, 0, 7); g.fill(); } }
            if (sea === "winter") { g.fillStyle = "#fff"; [[160, 168], [290, 162], [222, 128]].forEach(([x, y]) => { g.beginPath(); g.ellipse(x, y, 22, 7, 0, 0, 7); g.fill(); }); }
            g.restore();
            if (S.p) { g.fillStyle = S.p; parts.forEach(q => { q.y += q.v * dt; q.x += Math.sin(t * 2 + q.p) * (sea === "autumn" ? 1.2 : .4); if (q.y > H) { q.y = -8; q.x = rnd(0, W); } g.save(); g.translate(q.x, q.y); g.rotate(t * 2 + q.p); g.beginPath(); if (sea === "winter") g.arc(0, 0, 3.5, 0, 7); else g.ellipse(0, 0, 7, 4, 0, 0, 7); g.fill(); g.restore(); }); }
            g.font = '800 30px "Bricolage Grotesque", sans-serif'; g.fillStyle = "#1b2740"; g.fillText(sea, 20, 44);
          };
          draw(0, 0); s.loop(draw);
          const card = {};
          const pick = (k, quiet) => {
            sea = k; Object.entries(card).forEach(([kk, c]) => c.classList.toggle("on", kk === k));
            if (quiet) return;
            const snd = { spring: "birds", summer: "splash", autumn: "wind", winter: "magic-chime" }[k];
            s.sound(snd, { vol: .4, dur: 2.5, fade: .5 }); s.speak(`${k}. ${SEA[k].t}`, EN);
          };
          Object.entries(SEA).forEach(([k, S]) => {
            card[k] = s.h("div", { class: "k9-tile later", onclick: e => { if (!e.target.closest("button")) pick(k); } },
              s.h("div", { class: "row", style: { gap: "10px", flexWrap: "nowrap", width: "100%" } }, s.h("b", { style: { font: "800 28px/1 var(--f-display)", color: "var(--unit)" } }, k), s.h("span", { class: "k9-tag" }, S.de + " · " + S.m)),
              line(s, S.t, { size: 20 }));
          });
          const m = merk(s, "Britisches Englisch: ", B(s, "autumn"), " – amerikanisch: ", B(s, "fall"), ".", s.h("br"), "Mit ", B(s, "in"), ": in spring, in summer, in winter.");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "440px 1fr", gap: "22px", height: "100%" } }, canvas,
            s.h("div", { class: "stack", style: { gap: "10px" } }, ...Object.values(card), m)));
          s.preload("splash", "wind", "magic-chime");
          pick("spring", true); s.show(card.spring, "left"); s.sound("birds", { vol: .4, dur: 2.5, fade: .5 });
          ["summer", "autumn", "winter"].forEach(k => s.step(async () => { await s.show(card[k], "left"); pick(k); }));
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.say("Herbst heißt im britischen Englisch autumn."); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Clothes",
        say: "Kleidung auf Englisch. Tippe auf ein Kleidungsstück – Lukas zieht es an.",
        build(s) {
          const K = kid(s); K.outfit(["tshirt", "shorts", "trainers"], false);
          const I = [
            ["tshirt", "a T-shirt", "ein T-Shirt"], ["jumper", "a jumper", "ein Pulli"], ["shorts", "shorts", "kurze Hose"], ["jeans", "jeans", "Jeans"],
            ["jacket", "a jacket", "eine Jacke"], ["raincoat", "a raincoat", "eine Regenjacke"], ["hat", "a woolly hat", "eine Mütze"], ["cap", "a cap", "eine Kappe"],
            ["scarf", "a scarf", "ein Schal"], ["gloves", "gloves", "Handschuhe"], ["trainers", "trainers", "Turnschuhe"], ["wellies", "wellies", "Gummistiefel"],
          ];
          const tiles = {};
          const put = (k, label) => {
            const opt = ["jacket", "raincoat", "hat", "cap", "scarf", "gloves"].includes(k);
            if (opt && K.on[k]) { K.off(k); s.sfx.swoosh(); } else { K.wear(k); if (["jacket", "raincoat"].includes(k)) s.sound("zipper", { vol: .5, dur: 1.2 }); else s.sfx.pop(); }
            Object.entries(tiles).forEach(([kk, t]) => t.classList.toggle("on", !!K.on[kk]));
            s.speak(label, EN);
          };
          I.forEach(([k, en, de]) => { tiles[k] = s.h("button", { class: "k9-cl later", onclick: () => put(k, en) }, s.h("span", null, en), s.h("small", null, de)); });
          Object.entries(tiles).forEach(([kk, t]) => t.classList.toggle("on", !!K.on[kk]));
          const grid = s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" } }, I.map(([k]) => tiles[k]));
          const m = merk(s, B(s, "jeans, shorts, trousers"), " sind immer Plural: My jeans ", B(s, "are"), " new. – a pair of jeans.");
          const be = s.h("div", { class: "card soft later", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, "British English – American English"),
            s.h("div", { class: "stack", style: { gap: "4px" } },
              s.h("p", { class: "t", style: { fontSize: "21px" } }, B(s, "jumper"), " – sweater · ", B(s, "trainers"), " – sneakers"),
              s.h("p", { class: "t", style: { fontSize: "21px" } }, B(s, "trousers"), " – pants. Achtung: ", RED(s, "pants"), " heißt in Großbritannien Unterhose!")));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "280px 1fr", gap: "22px", height: "100%", alignItems: "center" } },
            s.h("div", { class: "card", style: { padding: "8px", display: "grid", placeItems: "center" } }, K.svg),
            s.h("div", { class: "stack", style: { gap: "12px" } }, grid, m, be)));
          s.show(K.svg, "zoom"); s.sfx.pop();
          const demo = async (ks) => { for (const k of ks) { s.show(tiles[k], "pop"); await s.wait(150); } for (const k of ks.filter(x => !["tshirt", "shorts", "trainers"].includes(x))) { put(k, I.find(x => x[0] === k)[1]); await s.wait(900); } };
          s.step(async () => { await demo(["tshirt", "jumper", "shorts", "jeans"]); s.say("Ein Pulli heißt auf Britisch jumper."); });
          s.step(async () => { await demo(["jacket", "raincoat", "hat", "cap"]); });
          s.step(async () => { await demo(["scarf", "gloves", "trainers", "wellies"]); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sfx.pop(); await s.show(be, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "What are you wearing today?",
        say: "Das Wetter bestimmt, was du anziehst. Wähle ein Wetter – Lukas zieht sich passend an.",
        build(s) {
          const sc = weatherScene(s, 380, 230, "sunny");
          const K = kid(s); K.svg.style.height = "440px";
          const L = {
            sunny: ["It's hot and sunny.", "I'm wearing a T-shirt, shorts and a cap.", ["tshirt", "shorts", "cap", "trainers"]],
            raining: ["It's raining.", "I'm wearing a raincoat, jeans and wellies.", ["tshirt", "jeans", "raincoat", "wellies"]],
            snowing: ["It's snowing. Brrr!", "I'm wearing a jumper, a scarf, gloves and a woolly hat.", ["jumper", "jeans", "jacket", "scarf", "gloves", "hat", "trainers"]],
          };
          const w1 = s.h("p", { class: "k9-en", style: { fontSize: "26px" } }), w2 = s.h("p", { class: "k9-en", style: { fontSize: "26px", color: "var(--unit)" } });
          let cur = "sunny";
          const box = s.h("div", { class: "card", style: { padding: "12px 16px", display: "flex", alignItems: "center", gap: "14px" } }, hear(s, () => L[cur][0] + " " + L[cur][1]), s.h("div", { class: "stack", style: { gap: "4px", flex: 1 } }, w1, w2));
          const bt = {};
          const pick = (k, quiet) => {
            cur = k; sc.set(k); K.outfit(L[k][2], !quiet); w1.textContent = L[k][0]; w2.textContent = L[k][1];
            Object.entries(bt).forEach(([kk, b]) => b.classList.toggle("on", kk === k));
            if (quiet) return;
            s.sound(WX[k].snd, { vol: .4, dur: 2.5, fade: .5 }); s.sound("zipper", { vol: .4, dur: 1, when: .4 }); ping(box); s.speak(L[k][0] + " " + L[k][1], EN);
          };
          ["sunny", "raining", "snowing"].forEach(k => { bt[k] = s.h("button", { class: "k9-w", style: { gridTemplateColumns: "48px 1fr" }, onclick: () => pick(k) }, s.h("span", { class: "em" }, WX[k].em), s.h("b", null, WX[k].t)); });
          const fact = s.h("div", { class: "life later", style: { padding: "10px 14px", display: "grid", gridTemplateColumns: "170px 1fr", gap: "14px", alignItems: "center" } },
            s.photo("wellies", { w: 170, h: 128, pos: "50% 60%" }),
            s.h("p", { class: "small" }, B(s, "wellies"), " = Wellington boots. Sie heißen nach dem Duke of Wellington, der Napoleon 1815 bei Waterloo besiegte. Seine Lederstiefel waren das Vorbild."));
          const pack = s.h("div", { class: "card soft later", style: { padding: "10px 14px" } }, s.h("span", { class: "exlabel" }, "Im Alltag – Packliste für London"),
            line(s, "Don't forget your umbrella and a jumper!", { size: 21 }));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "380px 290px 1fr", gap: "18px", height: "100%" } },
            s.h("div", { class: "stack", style: { gap: "10px" } }, sc.el, ...Object.values(bt)),
            s.h("div", { class: "card", style: { padding: "6px", display: "grid", placeItems: "center" } }, K.svg),
            s.h("div", { class: "stack", style: { gap: "12px" } }, box, fact, pack)));
          s.preload("rain", "magic-chime", "zipper");
          pick("sunny", true); s.sound("birds", { vol: .4, dur: 2.5, fade: .5 });
          s.step(async () => { pick("raining"); await s.wait(600); s.say("Es regnet: Regenjacke und Gummistiefel."); });
          s.step(async () => { pick("snowing"); await s.wait(600); });
          s.step(async () => { s.sfx.pop(); await s.show(fact, "up"); s.sfx.pop(); await s.show(pack, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "What are you doing? – I'm reading.",
        say: "Was passiert gerade, genau jetzt? Dafür gibt es im Englischen eine eigene Zeitform: das present progressive. Am, is oder are plus Verb mit ing.",
        build(s) {
          const tok = (t, c) => s.h("span", { class: "k9-tok " + (c || "") }, t);
          const T = { I: tok("I"), am: tok("am", "be later"), read: tok("read"), ing: tok("ing", "ing later"), end: tok(".", "q") };
          T.I.style.cssText = `background:${PC.I};color:#fff;border-color:${PC.I}`;
          const row = s.h("div", { class: "row", style: { gap: "10px", justifyContent: "center", flexWrap: "nowrap", minHeight: "66px" } }, T.I, T.am, T.read, T.ing, T.end);
          const formula = s.h("p", { class: "t later", style: { textAlign: "center" } }, U(s, "am / is / are"), " + Verb + ", RED(s, "-ing"));
          const fcard = s.h("div", { class: "card stack", style: { alignItems: "center", gap: "10px", padding: "14px" } }, s.h("div", { class: "row", style: { gap: "10px" } }, s.h("span", { class: "k9-live" }, s.h("i"), "LIVE"), s.h("span", { class: "k9-tag" }, "Samstag, 10:15 Uhr – genau jetzt")), row, formula);
          const R = [["I", "am", "I'm", "reading"], ["you", "are", "you're", "reading"], ["he", "is", "he's", "reading"], ["she", "is", "she's", "reading"], ["it", "is", "it's", "raining"], ["we", "are", "we're", "reading"], ["they", "are", "they're", "reading"]];
          const rows = R.map(([p, be, sh, v]) => s.h("button", { class: "k9-line later", style: { gap: "10px", background: "none", border: 0, padding: "7px 0", cursor: "pointer", width: "100%" }, onclick: () => { s.sfx.click(); s.speak(`${p} ${be} ${v}. ${sh} ${v}.`, EN); } },
            s.h("span", { class: "k9-pron", style: { background: PC[p], width: "72px" } }, p), s.h("span", { class: "k9-en", style: { fontSize: "22px", width: "50px", color: "var(--unit)" } }, be), s.h("span", { class: "pencil", style: { fontSize: "22px" } }, "→"),
            s.h("span", { class: "k9-en", style: { fontSize: "22px" } }, s.h("span", { style: { color: PC[p] } }, sh), " " + v)));
          const table = s.h("div", { class: "card", style: { padding: "8px 16px", display: "flex", flexDirection: "column", gap: "4px" } }, rows);
          /* vignettes */
          const E = s.el;
          const v1 = s.svg(150, 110); v1.append(E("rect", { x: 10, y: 80, width: 130, height: 24, rx: 6, fill: "#c98a5a" }), cast(s, "lukas", 70, 108, { h: 100, reach: true }), book(s, 116, 72));
          const v2 = s.svg(150, 110); v2.append(cast(s, "julia", 45, 106, { h: 92, reach: true }), cat(s, { x: 110, y: 106, sc: .62 }), E("circle", { cx: 84, cy: 98, r: 7, fill: "#dc3b2a" }));
          const v3 = s.svg(150, 110); v3.append(E("rect", { x: 0, y: 92, width: 150, height: 16, rx: 4, fill: "#8a94a6" }), cast(s, "ruby", 50, 108, { h: 100 }), dog(s, { x: 110, y: 104, sc: .55 }), ...[30, 60, 90, 120].map(x => E("path", { d: `M${x} 6 l-4 12`, stroke: "#1d5bd0", "stroke-width": 3, "stroke-linecap": "round" })));
          const vig = [[v1, "Lukas is reading a book.", "Lukas liest gerade ein Buch."], [v2, "Julia is playing with Mo.", "Julia spielt gerade mit Mo."], [v3, "It's raining in London. Ruby and Biscuit are waiting for the bus.", "Ruby und Biscuit warten auf den Bus."]].map(([v, t, d]) => { v.style.width = "190px"; v.style.height = "140px"; return s.h("div", { class: "ex later", style: { padding: "8px 12px", display: "grid", gridTemplateColumns: "190px 1fr", gap: "12px", alignItems: "center" } }, v, line(s, t, { size: 20, de: d })); });
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", height: "100%", alignItems: "start" } },
            s.h("div", { class: "stack", style: { gap: "12px" } }, fcard, table), s.h("div", { class: "stack", style: { gap: "12px" } }, vig)));
          s.sound("clock-tick", { vol: .4, dur: 1.5 });
          s.step(async () => { s.sfx.boing(); await s.show(T.am, "down"); await s.wait(200); s.sfx.snap(); await s.show(T.ing, "bounce"); s.speak("I am reading.", EN); s.show(formula, "fade"); });
          s.step(async () => {
            s.sfx.zap(); await flipText(s, T.I, "I'm"); T.am.style.display = "none"; s.speak("I'm reading.", EN);
            await seq(s, rows, "left", 140); s.say("Kurzformen: I'm, you're, he's, she's, we're, they're.");
          });
          s.step(async () => { s.sfx.pop(); await s.show(vig[0], "left"); s.sfx.pop(); await s.show(vig[1], "left"); s.sound("cat-meow", { vol: .5 }); });
          s.step(async () => { s.sound("rain", { vol: .4, dur: 2.5, fade: .5 }); await s.show(vig[2], "left"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Spelling: making, swimming, lying",
        say: "So schreibst du die ing-Form. Drei Regeln kennst du schon aus Kapitel fünf – dazu kommt eine neue: aus ie wird y.",
        build(s) {
          const R = [
            { word: "read", rule: "einfach -ing dran", ex: "play → playing · wear → wearing", res: "reading" },
            { word: "make", rule: "stummes e fällt weg", ex: "ride → riding · write → writing", res: "making", drop: [3] },
            { word: "swim", rule: "kurzes Wort: letzter Buchstabe doppelt", ex: "run → running · sit → sitting", res: "swimming", dbl: "m" },
            { word: "lie", rule: "ie wird zu y", ex: "die → dying · tie → tying", res: "lying", ie: true },
          ];
          const cards = R.map((r, i) => {
            const letters = [...r.word].map(ch => s.h("span", { class: "k9-let" }, ch));
            const dbl = r.dbl ? s.h("span", { class: "k9-let new later" }, r.dbl) : null;
            const y = r.ie ? s.h("span", { class: "k9-let new later" }, "y") : null;
            const ing = [..."ing"].map(ch => s.h("span", { class: "k9-let new later" }, ch));
            const tile = s.h("button", { class: "k9-tile", style: { flexDirection: "row", gap: 0, alignItems: "center", minHeight: "76px", padding: "4px 16px" }, onclick: () => { s.sfx.click(); s.speak(r.word + ". " + r.res, EN); } }, letters, dbl, y, ing);
            const exP = s.h("p", { class: "t later", style: { fontSize: "21px" } }, r.ex);
            const c = s.h("div", { class: "card later", style: { display: "grid", gridTemplateColumns: "230px 300px 1fr", gap: "16px", alignItems: "center", padding: "8px 16px" } },
              s.h("div", null, s.h("span", { class: "exlabel" }, "Regel " + (i + 1)), s.h("p", { class: "t", style: { fontWeight: 700, fontSize: "21px" } }, r.rule)), tile, exP);
            c.run = async () => {
              s.sfx.pop(); await s.show(c, "left");
              if (r.drop) { s.sfx.error(); r.drop.forEach(k => letters[k].classList.add("gone", "a-shake")); await s.wait(700); r.drop.forEach(k => (letters[k].style.display = "none")); }
              if (dbl) { s.sfx.snap(); await s.show(dbl, "pop"); }
              if (r.ie) { s.sfx.error(); letters[1].classList.add("gone", "a-shake"); letters[2].classList.add("gone", "a-shake"); await s.wait(700); letters[1].style.display = "none"; letters[2].style.display = "none"; s.sfx.snap(); await s.show(y, "pop"); }
              ing.forEach((x, k) => setTimeout(() => s.alive && s.sfx.count(k + 3), k * 120)); await s.show(ing, "bounce");
              s.speak(r.res, EN); s.sfx.coin(); s.show(exP, "fade");
            };
            return c;
          });
          const lf = life(s, "Im Alltag – Status im Chat", s.h("div", { class: "cols3", style: { gap: "8px" } },
            line(s, "Swimming at the lido!", { size: 20 }), line(s, "Making pancakes with Dad.", { size: 20 }), line(s, "Lying on the sofa …", { size: 20 })));
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "12px", justifyContent: "center" } }, cards, lf));
          cards[0].run();
          cards.slice(1).forEach(c => s.step(() => c.run()));
          s.step(async () => { s.sound("splash", { vol: .4, dur: 1.5 }); await s.show(lf, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "No! Mo isn't sleeping.",
        say: "Verneinen ist einfach: not kommt direkt nach am, is oder are. Kurz: isn't und aren't.",
        build(s) {
          const tok = (t, c) => s.h("span", { class: "k9-tok " + (c || "") }, t);
          const T = { mo: tok("Mo"), is: tok("is", "be"), not: tok("not", "no later"), v: tok("sleeping"), end: tok(".", "q") };
          const row = s.h("div", { class: "row", style: { gap: "10px", justifyContent: "center", flexWrap: "nowrap", minHeight: "66px" } }, T.mo, T.is, T.not, T.v, T.end);
          const cv = s.svg(300, 150), E = s.el;
          cv.append(E("rect", { x: 20, y: 110, width: 260, height: 30, rx: 12, fill: "#c98a5a" }));
          const sleepy = E("g", null, cat(s, { x: 120, y: 118, sc: 1 }), E("text", { x: 190, y: 40, "font-size": 30, "font-weight": 800, fill: "#7b4fd6", text: "z z z" }));
          const awake = E("g", { class: "later" }, cat(s, { x: 150, y: 118, sc: 1 }), E("circle", { cx: 240, cy: 100, r: 14, fill: "#dc3b2a" }), E("path", { d: "M228 96 q12 8 24 0", stroke: "#fff", "stroke-width": 2, fill: "none" }));
          cv.append(sleepy, awake);
          const top = s.h("div", { class: "card", style: { display: "grid", gridTemplateColumns: "300px 1fr", gap: "16px", alignItems: "center", padding: "10px 18px" } }, cv,
            s.h("div", { class: "stack", style: { gap: "10px" } }, row, s.h("p", { class: "k9-en later", style: { fontSize: "26px", color: "var(--unit)", textAlign: "center" } }, "She's playing with a ball!")));
          const ans = top.querySelector("p.later");
          const tbl = [["I", "I'm not reading."], ["you", "You aren't listening!"], ["he", "He isn't running."], ["we", "We aren't watching TV."], ["they", "They aren't wearing jackets."]].map(([p, t]) =>
            s.h("div", { class: "k9-line later" }, hear(s, t), s.h("span", { class: "k9-pron", style: { background: PC[p], width: "64px" } }, p), s.h("span", { class: "k9-en", style: { fontSize: "22px" } }, t)));
          const ex = [
            ["We aren't watching TV. We're doing our homework.", "Wir schauen gerade nicht fern."],
            ["I'm not wearing a jacket – it's hot!", "Ich trage gerade keine Jacke."],
            ["Biscuit isn't barking. He's sleeping.", "Biscuit bellt gerade nicht."],
          ].map(([t, d]) => s.h("div", { class: "ex later", style: { padding: "8px 14px" } }, line(s, t, { size: 21, de: d })));
          const m = merk(s, B(s, "is not → isn't"), " · ", B(s, "are not → aren't"), " · ", B(s, "I am not → I'm not"), s.h("br"), "Achtung: „I amn't“ gibt es nicht!");
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%" } }, top,
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", alignItems: "start" } },
              s.h("div", { class: "card", style: { padding: "8px 14px", display: "flex", flexDirection: "column", gap: "6px" } }, tbl), s.h("div", { class: "stack", style: { gap: "10px" } }, ex, m))));
          s.sound("cat-meow", { vol: .4 });
          s.step(async () => {
            s.sfx.error(); await s.show(T.not, "bounce"); s.speak("Mo is not sleeping.", EN); await s.wait(700);
            s.sfx.zap(); T.not.style.display = "none"; await flipText(s, T.is, "isn't"); s.speak("Mo isn't sleeping.", EN);
            s.hide(sleepy); s.show(awake, "bounce"); s.sound("cat-meow", { vol: .6 }); await s.show(ans, "up");
          });
          s.step(async () => { await seq(s, tbl, "left", 160); });
          s.step(async () => { await seq(s, ex, "up", 300, () => s.sfx.pop()); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Are you …? – Yes, I am.",
        say: "Für die Frage tauschen Person und am, is, are den Platz. Die Kurzantwort: Yes, I am. No, I'm not.",
        build(s) {
          const tok = (t, c) => s.h("span", { class: "k9-tok " + (c || "") }, t);
          const T = { you: tok("You"), are: tok("are", "be"), v: tok("reading"), end: tok(".", "q") };
          T.you.style.cssText = `background:${PC.you};color:#fff;border-color:${PC.you}`;
          const row = s.h("div", { class: "row", style: { gap: "10px", justifyContent: "center", flexWrap: "nowrap", minHeight: "66px" } }, T.you, T.are, T.v, T.end);
          let isQ = false;
          const demo = s.h("div", { class: "card stack", style: { alignItems: "center", gap: "10px", padding: "12px" } }, s.h("p", { class: "small pencil" }, "Aussage → Frage"), row, hear(s, () => (isQ ? "Are you reading?" : "You are reading."), "Anhören"));
          const sa = [["Are you reading?", "Yes, I am.", "No, I'm not."], ["Is Ruby wearing her wellies?", "Yes, she is.", "No, she isn't."], ["Are they playing football?", "Yes, they are.", "No, they aren't."]].map(([q, y, n]) =>
            s.h("div", { class: "card later", style: { padding: "8px 14px" } }, line(s, q, { size: 22 }),
              s.h("div", { class: "row", style: { gap: "10px", marginTop: "6px" } }, hear(s, y, y), hear(s, n, n))));
          const wq = life(s, "W-Fragen – im Alltag", s.h("div", { class: "stack", style: { gap: "6px" } },
            line(s, "What are you doing? – I'm making a cake.", { size: 21 }), line(s, "Where are you going? – To the park.", { size: 21 }), line(s, "Why are you laughing? – Look at Biscuit!", { size: 21 })));
          const m = merk(s, "Kurzantwort ohne -ing: ", B(s, "Yes, I am."), " – nicht ", s.h("span", { style: { textDecoration: "line-through", color: "var(--red)" } }, "Yes, I am reading."), s.h("br"), "Bei ", B(s, "Yes"), " keine Kurzform: Yes, she ", B(s, "is"), ".");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "470px 1fr", gap: "22px", height: "100%", alignItems: "start" } },
            s.h("div", { class: "stack", style: { gap: "12px" } }, demo, m, wq), s.h("div", { class: "stack", style: { gap: "12px" } }, sa)));
          s.show(demo, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); await reorder(s, row, [T.are, T.you, T.v, T.end], 60); await flipText(s, T.are, "Are"); T.you.textContent = "you"; T.end.textContent = "?"; isQ = true; s.sfx.ding(); s.speak("Are you reading?", EN); });
          s.step(async () => { await seq(s, sa, "up", 300, () => s.sfx.pop()); s.say("Yes, I am. No, I'm not."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(wq, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Look! Listen! – Signalwörter",
        say: "Diese Wörter zeigen dir: Es passiert gerade jetzt! Tippe auf eine Karte und hör genau hin.",
        build(s) {
          const C = [
            ["Listen!", "Listen! The birds are singing.", "Hör mal! Die Vögel singen.", "birds"],
            ["Look!", "Look! It's snowing!", "Schau! Es schneit!", "magic-chime"],
            ["Shh!", "Shh! Mo is sleeping.", "Pst! Mo schläft gerade.", "clock-tick"],
            ["now", "Ruby is doing her homework now.", "jetzt", "pencil-write"],
            ["right now", "I can't talk right now – I'm cooking!", "genau jetzt", "sizzle"],
            ["at the moment", "We're sitting on the U-Bahn at the moment.", "im Moment", "ubahn-train"],
          ].map(([w, t, d, snd]) => {
            const c = s.h("div", { class: "k9-tile later", style: { minHeight: "200px", justifyContent: "space-between" }, onclick: e => { if (e.target.closest("button")) return; s.sound(snd, { vol: .5, dur: 2.5, fade: .5 }); s.speak(t, EN); ping(c); } },
              s.h("div", { class: "row", style: { gap: "10px", width: "100%", justifyContent: "space-between", flexWrap: "nowrap" } }, s.h("b", { style: { font: "800 34px/1 var(--f-display)", color: "var(--unit)" } }, w), s.h("span", { class: "k9-tag", style: { whiteSpace: "nowrap" } }, "Tippen!")),
              s.h("p", { class: "k9-en", style: { fontSize: "21px" } }, t), s.h("p", { class: "small pencil" }, d));
            c.snd = snd; c.t = t; return c;
          });
          const m = merk(s, "Signalwörter für das present progressive: ", B(s, "now, right now, at the moment, today, Look!, Listen!"), s.h("br"), "Sie sagen: Das passiert ", B(s, "genau jetzt"), " – nicht jeden Tag.");
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%" } }, s.h("div", { class: "cols3", style: { gap: "14px" } }, C), m));
          const play = async c => { s.sound(c.snd, { vol: .5, dur: 2.5, fade: .5 }); await s.show(c, "up"); s.speak(c.t, EN); await s.wait(900); };
          s.preload(C.map(c => c.snd));
          play(C[0]);
          s.step(async () => { await play(C[1]); await play(C[2]); });
          s.step(async () => { await play(C[3]); await play(C[4]); });
          s.step(async () => { await play(C[5]); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Every day – or right now?",
        say: "Was jemand immer wieder tut, steht im simple present. Was gerade jetzt passiert, steht im present progressive. Schau, was heute bei Ruby anders ist.",
        build(s) {
          const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
          const days = DAYS.map(d => { const em = s.h("span", { class: "em" }, "🚶"); const b = s.h("div", { class: "k9-day" }, em, s.h("span", null, d)); b.em = em; return b; });
          const s1 = s.h("p", { class: "k9-en", style: { fontSize: "26px" } }, "Ruby ", s.h("span", { style: { color: "#7b4fd6" } }, "walks"), " to school ", s.h("span", { class: "hl" }, "every day"), ".");
          const s2 = s.h("p", { class: "k9-en later", style: { fontSize: "26px" } }, s.h("span", { class: "hl" }, "Today"), " it's raining, so she ", s.h("span", { style: { color: "var(--red)" } }, "is taking"), " the bus.");
          const live = s.h("span", { class: "k9-live later" }, s.h("i"), "NOW");
          const top = s.h("div", { class: "card", style: { padding: "12px 18px", display: "flex", flexDirection: "column", gap: "10px" } },
            s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" } }, days),
            s.h("div", { class: "k9-line" }, hear(s, "Ruby walks to school every day."), s1),
            s.h("div", { class: "k9-line" }, hear(s, "Today it's raining, so she is taking the bus."), s2, live));
          const PAIRS = [
            ["Lukas usually wears jeans.", "Today he's wearing his football kit."],
            ["Dad cooks on Sundays.", "Look! Mum is cooking today."],
            ["It often rains in London.", "Listen! It's raining right now."],
          ];
          const hd = s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" } },
            s.h("p", { class: "k9-tag", style: { color: "#7b4fd6" } }, "simple present – immer wieder"), s.h("p", { class: "k9-tag", style: { color: "var(--red)" } }, "present progressive – genau jetzt"));
          const prs = PAIRS.map(([a, b]) => s.h("div", { class: "later", style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" } },
            s.h("div", { class: "card", style: { padding: "6px 12px", borderColor: "#c9b6f2" } }, line(s, a, { size: 20 })), s.h("div", { class: "card", style: { padding: "6px 12px", borderColor: "#f3b3ab" } }, line(s, b, { size: 20 }))));
          const m = merk(s, s.h("span", null, B(s, "every day, usually, often"), " → she walks · ", B(s, "now, today, Look!"), " → she is walking", s.h("br"), B(s, "like, love, know, want"), " ohne -ing: I like pizza."));
          m.style.cssText += ";display:grid;grid-template-columns:auto 1fr;column-gap:18px;align-items:center";
          s.add(s.h("div", { class: "stack", style: { gap: "10px", height: "100%" } }, top, hd, prs, m));
          const pulse = async () => { for (let r = 0; r < 2; r++) for (const d of days) { if (!s.alive) return; d.classList.add("lit"); s.sound("footsteps", { vol: .25, dur: .4 }); await s.wait(260); d.classList.remove("lit"); } };
          s.wait(300).then(pulse);
          s.step(async () => {
            const d = days[0]; s.sound("rain", { vol: .4, dur: 2.5, fade: .5 }); s.sfx.whoosh();
            await s.tween({ dur: 160, update: v => { d.style.transform = `scaleY(${1 - v})`; } }); d.em.textContent = "🚌"; d.classList.add("now"); d.lastChild.textContent = "today"; await s.tween({ dur: 260, ease: "back", update: v => { d.style.transform = `scaleY(${v})`; } }); d.style.transform = "";
            s.show(live, "pop"); await s.show(s2, "left"); s.say("Heute ist es anders – genau jetzt nimmt sie den Bus.");
          });
          s.step(async () => { s.show(hd, "fade"); await seq(s, prs, "up", 350, () => s.sfx.pop()); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Im Alltag: a video call",
        say: "Lukas und Ruby machen einen Video-Call: Berlin und London. Was machen sie gerade – und wie ist das Wetter?",
        build(s) {
          const frame = (sceneKind, who, label) => {
            const sc = weatherScene(s, 460, 240, sceneKind, { label });
            const ov = s.svg(460, 240); ov.style.cssText = "position:absolute;left:0;top:0";
            ov.append(who);
            return s.h("div", { style: { position: "relative", width: "460px", height: "240px", borderRadius: "18px", boxShadow: "0 0 0 6px #1b2740" } }, sc.el, ov);
          };
          const fL = frame("sunny", cast(s, "lukas", 340, 236, { h: 180, wave: true }), "Berlin · 16:00");
          const fR = frame("raining", cast(s, "ruby", 340, 236, { h: 186, wave: true }), "London · 15:00");
          const L = [
            ["R", "Hi Lukas! What are you doing?"],
            ["L", "I'm sitting in the garden. It's sunny in Berlin! What's the weather like in London?"],
            ["R", "It's raining – again! I'm wearing my wellies."],
            ["L", "Where's Biscuit?"],
            ["R", "He's sleeping under the table. And what's Julia doing?"],
            ["L", "She's playing with Mo. Look!"],
          ].map(([w, t]) => s.h("div", { class: "k9-line later", style: { flexDirection: w === "L" ? "row" : "row-reverse" } },
            s.h("span", { class: "k9-av", style: { background: w === "L" ? CAST.lukas.shirt : CAST.ruby.shirt } }, w),
            s.h("p", { class: "k9-bub", style: { borderColor: w === "L" ? CAST.lukas.shirt : CAST.ruby.shirt } }, t), hear(s, t)));
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%" } },
            s.h("div", { class: "row", style: { gap: "24px", justifyContent: "center", flexWrap: "nowrap", padding: "6px 0" } }, fL, fR),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 18px" } }, L)));
          s.sound("phone-ring", { vol: .5, dur: 2.5 });
          s.step(async () => { s.sfx.pop(); await s.show(L[0], "left"); s.sound("birds", { vol: .35, dur: 2, fade: .5 }); await s.show(L[1], "right"); });
          s.step(async () => { s.sound("rain", { vol: .35, dur: 2, fade: .5 }); await s.show(L[2], "left"); s.sfx.pop(); await s.show(L[3], "right"); });
          s.step(async () => { s.sfx.pop(); await s.show(L[4], "left"); s.sound("cat-meow", { vol: .5 }); await s.show(L[5], "right"); s.say("Im Video-Call erzählst du mit ing, was gerade passiert."); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Im Alltag: in the park",
        say: "Ein Bild beschreiben: Was machen die Leute im Park gerade? Tippe auf die Nummern.",
        build(s) {
          const E = s.el, svg = s.svg(640, 400);
          svg.append(E("rect", { x: 0, y: 0, width: 640, height: 400, rx: 18, fill: "#cdeeff" }), E("path", { d: "M0 150 Q160 120 320 150 T640 140 V400 H0 Z", fill: "#86c96a" }),
            E("ellipse", { cx: 470, cy: 182, rx: 150, ry: 30, fill: "#5aa9dd" }), E("path", { d: "M0 330 Q320 280 640 340 V372 Q320 312 0 362 Z", fill: "#e8d9b5" }),
            ...[[60, 130], [130, 118], [600, 120]].map(([x, y]) => E("g", null, E("rect", { x: x - 5, y: y - 10, width: 10, height: 34, fill: "#6b4423" }), E("circle", { cx: x, cy: y - 26, r: 26, fill: "#2f8a3a" }))));
          const G = {};
          // 1 jogger (left, on the path)
          G.jog = E("g", { class: "k9-g" }); G.jog.append(person(s, { x: 0, y: 0, h: 120, shirt: "#ee7a1a", hair: "#3a2a1a", style: "short", wave: true }));
          const jogWrap = E("g", { transform: "translate(80 350)" }); jogWrap.append(G.jog); svg.append(jogWrap);
          // 2 kids playing football (middle)
          G.foot = E("g", { class: "k9-g" }); G.foot.append(person(s, { x: 230, y: 300, h: 92, shirt: "#1d5bd0", style: "short", skin: "#b07a50", hair: "#1b1b1b" }), person(s, { x: 330, y: 300, h: 92, shirt: "#dc3b2a", style: "pony", hair: "#e2b649" }));
          const ball = E("circle", { cx: 260, cy: 294, r: 8, fill: "#fff", stroke: "#1b2740", "stroke-width": 2 }); G.foot.append(ball); svg.append(G.foot);
          // 3 woman feeding ducks (background, at the lake)
          G.duck = E("g", { class: "k9-g" }); G.duck.append(person(s, { x: 370, y: 200, h: 80, shirt: "#7b4fd6", style: "bun", hair: "#d4d4d4", reach: true }));
          const ducks = [[430, 186], [462, 192], [494, 184]].map(([x, y]) => { const d = E("g", null, E("ellipse", { cx: x, cy: y, rx: 12, ry: 7, fill: "#f2c200" }), E("circle", { cx: x + 9, cy: y - 7, r: 5, fill: "#f2c200" }), E("path", { d: `M${x + 13} ${y - 7} l6 1 l-6 2z`, fill: "#ee7a1a" })); G.duck.append(d); return d; });
          svg.append(G.duck);
          // 4 girl flying a kite (right)
          G.kite = E("g", { class: "k9-g" }); G.kite.append(person(s, { x: 560, y: 300, h: 100, shirt: "#138a5a", style: "long", hair: "#7a4b25", wave: true }));
          const kiteLine = E("path", { d: "M586 216 Q570 120 520 60", stroke: "#1b2740", "stroke-width": 2, fill: "none" });
          const kite = E("path", { d: "M520 30 l18 30 l-18 30 l-18 -30 z", fill: "#dc3b2a", stroke: "#8f1d12", "stroke-width": 2 });
          G.kite.append(kiteLine, kite); svg.append(G.kite);
          // 5 dog running after a ball (middle front)
          G.dog = E("g", { class: "k9-g" }); const dg = dog(s, { x: 0, y: 0, sc: .6 }); const dogWrap = E("g", { transform: "translate(420 386)" }); dogWrap.append(dg); G.dog.append(dogWrap);
          const ball2 = E("circle", { cx: 520, cy: 378, r: 8, fill: "#ee7a1a" }); G.dog.append(ball2); svg.append(G.dog);
          // 6 boy on a bench eating ice cream (left middle)
          G.ice = E("g", { class: "k9-g" }); G.ice.append(E("rect", { x: 100, y: 236, width: 90, height: 8, rx: 3, fill: "#8b5a2b" }), E("rect", { x: 104, y: 244, width: 6, height: 28, fill: "#8b5a2b" }), E("rect", { x: 180, y: 244, width: 6, height: 28, fill: "#8b5a2b" }),
            person(s, { x: 145, y: 272, h: 84, shirt: "#e8b923", style: "short", hair: "#2a1a12", reach: true }), E("path", { d: "M176 216 l6 20 l6 -20 z", fill: "#d9a35b" }), E("circle", { cx: 182, cy: 212, r: 8, fill: "#f7a8c4" }));
          svg.append(G.ice);
          const NUM = [["jog", 60, 210], ["foot", 280, 196], ["duck", 400, 120], ["kite", 618, 268], ["dog", 470, 316], ["ice", 140, 160]];
          const S = [
            ["jog", "On the left, a man is jogging.", "jogging"],
            ["foot", "In the middle, two children are playing football.", "ball-kick"],
            ["duck", "In the background, a woman is feeding the ducks.", "duck-quack"],
            ["kite", "On the right, a girl is flying a kite.", "wind"],
            ["dog", "A dog is running after a ball.", "dog-bark"],
            ["ice", "A boy is sitting on a bench. He's eating an ice cream.", null],
          ];
          const badges = NUM.map(([k, x, y], i) => { const b = E("g", { class: "later", style: { cursor: "pointer" } }, E("circle", { cx: x, cy: y, r: 17, fill: "#a16207", stroke: "#fff", "stroke-width": 3 }), E("text", { x, y: y + 7, "text-anchor": "middle", "font-size": 20, "font-weight": 800, fill: "#fff", text: String(i + 1) })); svg.append(b); return b; });
          const act = i => { const [k, t, snd] = S[i]; if (snd && snd !== "jogging") s.sound(snd, { vol: .5, dur: 2, fade: .4 }); else s.sound("footsteps", { vol: .4, dur: 1.2 }); s.speak(t, EN); ping(G[k]); rows.forEach((r, j) => r.classList.toggle("on", j === i)); };
          badges.forEach((b, i) => b.addEventListener("click", () => act(i)));
          const rows = S.map(([k, t], i) => { const r = s.h("div", { class: "k9-line later", style: { gap: "8px", borderRadius: "12px", padding: "2px 6px" } }, s.h("span", { class: "k9-av", style: { background: "var(--unit)", width: "34px", height: "34px", fontSize: "19px" } }, String(i + 1)), hear(s, t), s.h("p", { class: "k9-en", style: { fontSize: "20px", flex: 1 } }, t)); return r; });
          const phr = s.h("div", { class: "card soft", style: { padding: "8px 14px" } }, s.h("span", { class: "exlabel" }, "So beschreibst du ein Bild"),
            s.h("p", { class: "t", style: { fontSize: "20px" } }, "In the picture I can see … · on the left · in the middle · on the right · in the background"));
          const ph = s.h("div", { class: "row later", style: { gap: "14px", flexWrap: "nowrap", alignItems: "center" } }, s.photo("regents-boating", { w: 300, h: 196, caption: "Regent's Park, London" }),
            s.h("p", { class: "small" }, "So sieht es in echt aus: Ruderboote auf dem See im Regent's Park. Beschreibe das Foto genauso!"));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "640px 1fr", gap: "20px", height: "100%" } },
            s.h("div", { class: "stack", style: { gap: "12px" } }, svg, ph), s.h("div", { class: "stack", style: { gap: "8px" } }, phr, rows)));
          // living park
          s.loop(t => {
            jogWrap.setAttribute("transform", `translate(${60 + ((t * 40) % 140)} ${352 + Math.abs(Math.sin(t * 8)) * -4})`);
            const b = (Math.sin(t * 2) + 1) / 2; ball.setAttribute("cx", 252 + b * 56); ball.setAttribute("cy", 294 - Math.sin(b * Math.PI) * 26);
            ducks.forEach((d, i) => d.setAttribute("transform", `translate(${Math.sin(t + i) * 6} 0)`));
            kite.setAttribute("transform", `rotate(${Math.sin(t * 1.4) * 10} 520 60)`);
            const dx = (t * 30) % 80; dogWrap.setAttribute("transform", `translate(${400 + dx} 386)`); ball2.setAttribute("cx", 500 + dx);
          });
          s.preload("ball-kick", "duck-quack", "wind", "dog-bark", "footsteps");
          s.sound("birds", { vol: .35, dur: 3, fade: .6 });
          s.step(async () => { await seq(s, badges, "pop", 120); for (let i = 0; i < 2; i++) { s.show(rows[i], "left"); act(i); await s.wait(1600); } });
          s.step(async () => { for (let i = 2; i < 4; i++) { s.show(rows[i], "left"); act(i); await s.wait(1700); } });
          s.step(async () => { for (let i = 4; i < 6; i++) { s.show(rows[i], "left"); act(i); await s.wait(1700); } });
          s.step(async () => { s.sfx.whoosh(); await s.show(ph, "up"); s.say("Jetzt du: Beschreibe das echte Foto aus dem Regent's Park."); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Im Alltag: live football",
        say: "Live-Reporter erzählen im present progressive, was genau jetzt auf dem Platz passiert. Hör zu!",
        build(s) {
          const E = s.el, svg = s.svg(640, 360);
          svg.append(E("rect", { x: 0, y: 0, width: 640, height: 360, rx: 18, fill: "#3f9b4a" }),
            ...[0, 1, 2, 3, 4, 5, 6, 7].map(i => E("rect", { x: i * 80, y: 0, width: 40, height: 360, fill: "#46a852" })),
            E("rect", { x: 20, y: 20, width: 600, height: 320, fill: "none", stroke: "#fff", "stroke-width": 4 }), E("line", { x1: 320, y1: 20, x2: 320, y2: 340, stroke: "#fff", "stroke-width": 4 }),
            E("circle", { cx: 320, cy: 180, r: 50, fill: "none", stroke: "#fff", "stroke-width": 4 }), E("rect", { x: 520, y: 100, width: 100, height: 160, fill: "none", stroke: "#fff", "stroke-width": 4 }),
            E("rect", { x: 20, y: 100, width: 100, height: 160, fill: "none", stroke: "#fff", "stroke-width": 4 }), E("rect", { x: 620, y: 145, width: 14, height: 70, fill: "#fff" }));
          const pl = (x, y, c, t) => { const g = E("g", { transform: `translate(${x} ${y})` }, E("circle", { r: 20, fill: c, stroke: "#fff", "stroke-width": 3 }), E("text", { y: 7, "text-anchor": "middle", "font-size": 19, "font-weight": 800, fill: "#fff", text: t })); g.p = [x, y]; svg.append(g); return g; };
          const opp = [[420, 90], [430, 270], [470, 180]].map(([x, y]) => pl(x, y, "#dc3b2a", ""));
          const ellie = pl(596, 180, "#dc3b2a", "E");
          const ruby = pl(200, 70, "#1d5bd0", "R"), maya = pl(330, 230, "#1d5bd0", "M");
          const ball = E("circle", { cx: 222, cy: 82, r: 9, fill: "#fff", stroke: "#1b2740", "stroke-width": 2 }); svg.append(ball);
          const mv = (g, x, y, dur = 900) => { const [x0, y0] = g.p; g.p = [x, y]; return s.tween({ dur, update: v => g.setAttribute("transform", `translate(${x0 + (x - x0) * v} ${y0 + (y - y0) * v})`) }); };
          const bp = [222, 82];
          const mvBall = (x, y, dur = 700) => { const [x0, y0] = bp; bp[0] = x; bp[1] = y; return s.tween({ dur, update: v => { ball.setAttribute("cx", x0 + (x - x0) * v); ball.setAttribute("cy", y0 + (y - y0) * v - Math.sin(Math.PI * v) * 10); } }); };
          const score = s.h("span", { class: "k9-en", style: { fontSize: "30px" } }, "0 : 0");
          const board = s.h("div", { class: "card", style: { padding: "8px 14px", display: "flex", alignItems: "center", gap: "12px", justifyContent: "space-between" } },
            s.h("span", { class: "k9-live" }, s.h("i"), "LIVE"), s.h("span", { class: "k9-en", style: { fontSize: "21px", color: "#1d5bd0" } }, "London"), score, s.h("span", { class: "k9-en", style: { fontSize: "21px", color: "#dc3b2a" } }, "Brighton"));
          const C = [
            "Welcome to the big match: London against Brighton!",
            "Ruby is running down the left …",
            "She's passing the ball to Maya!",
            "Maya is shooting … Ellie is diving …",
            "GOAL! The fans are going wild!",
          ].map(t => line(s, t, { size: 21, later: true }));
          const m = merk(s, "Reporter benutzen das ", B(s, "present progressive"), ": Sie erzählen, was ", B(s, "genau jetzt"), " passiert.");
          const ph = s.h("div", { class: "row later", style: { gap: "14px", flexWrap: "nowrap" } }, s.photo("football-park", { w: 300, h: 200, caption: "Sonntagsliga, London" }),
            s.h("div", { class: "stack", style: { gap: "10px" } }, s.h("p", { class: "small" }, "In echt: ein Spiel der Sonntagsliga auf den Hackney Marshes in London. Hör dir die Fans an:"), s.h("div", { class: "row" }, s.soundBtn("crowd-cheer", "Fans jubeln"))));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "640px 1fr", gap: "20px", height: "100%" } },
            s.h("div", { class: "stack", style: { gap: "12px" } }, svg, ph), s.h("div", { class: "stack", style: { gap: "10px" } }, board, C, m)));
          s.sound("whistle", { vol: .5 }); s.show(C[0], "left"); s.speak("Welcome to the big match: London against Brighton!", EN);
          s.step(async () => { s.show(C[1], "left"); s.speak("Ruby is running down the left!", EN); await Promise.all([mv(ruby, 360, 70, 1400), mvBall(382, 82, 1400), mv(opp[0], 400, 110, 1400)]); });
          s.step(async () => { s.show(C[2], "left"); s.sound("ball-kick", { vol: .6 }); s.speak("She's passing the ball to Maya!", EN); await Promise.all([mvBall(455, 232, 800), mv(maya, 440, 220, 800)]); });
          s.step(async () => {
            s.show(C[3], "left"); s.speak("Maya is shooting. Ellie is diving!", EN); s.sound("ball-kick", { vol: .6 });
            await Promise.all([mvBall(626, 160, 700), mv(ellie, 596, 220, 700)]);
            s.sound("crowd-cheer", { vol: .55, dur: 4, fade: .8 }); s.show(C[4], "left"); score.textContent = "1 : 0"; ping(score); s.confetti(620, 300, 70); s.speak("Goal!", EN);
          });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sfx.whoosh(); await s.show(ph, "up"); });
        },
      },
    ],
  });
})();
