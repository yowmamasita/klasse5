/* Unit 7 – Food, shopping and festivals (Englisch Klasse 5).
   Cast: Ruby (11, London, Year 7) and Lukas (10, Berlin, Klasse 5). */
(() => {
  const EN = { lang: "en-GB", rate: 0.85 };
  const SPK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11"/></svg>';
  const CSS = `
.ek-spk{width:56px;min-width:56px;height:56px;padding:0;border-radius:50%;flex:none}
.ek-spk svg,.ek-hear svg{width:26px;height:26px;flex:none}
.ek-hear{padding:0 18px}
.ek-line{display:flex;align-items:center;gap:12px}
.ek-en{font-family:var(--f-body);font-weight:700;color:var(--ink);margin:0}
.ek-tile{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:#fff;border:3px solid var(--line);border-radius:18px;cursor:pointer;color:var(--ink);padding:6px;font-family:var(--f-body)}
.ek-bub{background:#fff;border:2px solid var(--line);border-radius:18px;padding:8px 14px;font-size:22px;line-height:1.3;font-weight:700;margin:0;flex:1;min-width:0}
.ek-av{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;font:800 22px/1 var(--f-display);color:#fff;flex:none}
.ek-ping{animation:ekping .45s ease}
@keyframes ekping{50%{transform:scale(1.14)}}
.ek-tag{font:700 19px/1.2 var(--f-display);color:var(--pencil);margin:0}
.ek-g{transform-box:fill-box;transform-origin:50% 100%}
`;
  if (!document.getElementById("ek78css")) { const st = document.createElement("style"); st.id = "ek78css"; st.textContent = CSS; document.head.appendChild(st); }

  /* ---------- the cast, drawn in SVG (origin = between the feet, height 200 at scale 1) ---------- */
  const CAST = {
    lukas: { skin: "#f2c9a5", hair: "#7a4b25", style: "short", shirt: "#ee7a1a", h: 150 },
    julia: { skin: "#f4cfae", hair: "#e2b649", style: "pony", shirt: "#138a5a", h: 126 },
    ruby: { skin: "#a8724a", hair: "#2a1a12", style: "curly", shirt: "#1e3a6e", tie: "#c0392b", skirt: "#2c3e50", glasses: true, h: 160 },
  };
  function person(s, o) {
    const E = s.el, sc = (o.h || 200) / 200;
    const outer = E("g", { class: "ek-g" });
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

  function hear(s, text, label) {
    const b = s.h("button", { class: label ? "btn ek-hear" : "btn ek-spk", "aria-label": "Anhören: " + text, onclick: () => { s.sfx.click(); s.speak(text, EN); b.classList.remove("ek-ping"); void b.offsetWidth; b.classList.add("ek-ping"); } });
    b.insertAdjacentHTML("afterbegin", SPK);
    if (label) b.append(s.h("span", null, label));
    return b;
  }
  /* a row: speaker button + English text (show = nodes to display instead of plain text) */
  function line(s, text, o = {}) {
    const p = s.h("p", { class: "ek-en", style: { fontSize: (o.size || 22) + "px", lineHeight: "1.3", flex: "1", minWidth: "0", color: o.color || null } }, o.show || text);
    return s.h("div", { class: "ek-line" + (o.later ? " later" : ""), style: o.style || null }, hear(s, o.speak || text), p);
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
  const HL = (s, t) => s.h("span", { class: "hl" }, t);

  /* ---------- British coins (drawn simply) ---------- */
  const COINS = [
    { v: 1, t: "1p", w: "1 penny", r: 32, k: "cu" }, { v: 2, t: "2p", w: "2 pence", r: 41, k: "cu" },
    { v: 5, t: "5p", w: "5 pence", r: 29, k: "ag" }, { v: 10, t: "10p", w: "10 pence", r: 39, k: "ag" },
    { v: 20, t: "20p", w: "20 pence", r: 34, k: "hept" }, { v: 50, t: "50p", w: "50 pence", r: 44, k: "hept" },
    { v: 100, t: "£1", w: "1 pound", r: 37, k: "p1" }, { v: 200, t: "£2", w: "2 pounds", r: 45, k: "p2" },
  ];
  function coin(s, c, cx, cy, sc = 1, label = true) {
    const r = c.r * sc, g = s.el("g");
    const col = { cu: ["#cd8549", "#8d5226"], ag: ["#dfe3e8", "#8f99a5"], hept: ["#dfe3e8", "#8f99a5"], p1: ["#e7c25a", "#a8811c"], p2: ["#e7c25a", "#a8811c"] }[c.k];
    if (c.k === "hept") {
      const R = r, d = 2 * R * Math.sin(3 * Math.PI / 7);
      const v = [...Array(7)].map((_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / 7; return [cx + R * Math.cos(a), cy + R * Math.sin(a)]; });
      let path = `M${v[0][0].toFixed(1)} ${v[0][1].toFixed(1)}`;
      for (let i = 1; i <= 7; i++) { const p = v[i % 7]; path += ` A${d.toFixed(1)} ${d.toFixed(1)} 0 0 1 ${p[0].toFixed(1)} ${p[1].toFixed(1)}`; }
      g.append(s.el("path", { d: path + "Z", fill: col[0], stroke: col[1], "stroke-width": 3 }));
    } else if (c.k === "p1") {
      const pts = [...Array(12)].map((_, i) => { const a = -Math.PI / 2 + (i + .5) * Math.PI / 6; return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`; }).join(" ");
      g.append(s.el("polygon", { points: pts, fill: col[0], stroke: col[1], "stroke-width": 3 }), s.el("circle", { cx, cy, r: r * .62, fill: "#dfe3e8", stroke: "#8f99a5", "stroke-width": 2 }));
    } else if (c.k === "p2") {
      g.append(s.el("circle", { cx, cy, r, fill: col[0], stroke: col[1], "stroke-width": 3 }), s.el("circle", { cx, cy, r: r * .68, fill: "#dfe3e8", stroke: "#8f99a5", "stroke-width": 2 }));
    } else {
      g.append(s.el("circle", { cx, cy, r, fill: col[0], stroke: col[1], "stroke-width": 3 }), s.el("circle", { cx, cy, r: r * .8, fill: "none", stroke: col[1], "stroke-width": 1.5, opacity: .6 }));
    }
    if (label) g.append(s.el("text", { x: cx, y: cy + 7, "text-anchor": "middle", "font-size": Math.max(19, Math.round(r * .6)), "font-weight": 800, fill: "#1b2740", text: c.t }));
    return g;
  }
  const priceTxt = p => (p >= 100 ? "£" + (p / 100).toFixed(2) : p + "p");
  const priceSay = p => { const L = Math.floor(p / 100), c = p % 100; if (!L) return c + "p"; return L + (L > 1 ? " pounds" : " pound") + (c ? " " + c : ""); };

  /* ---------- dates ---------- */
  const ORD = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth", "twentieth", "twenty-first", "twenty-second", "twenty-third", "twenty-fourth", "twenty-fifth", "twenty-sixth", "twenty-seventh", "twenty-eighth", "twenty-ninth", "thirtieth", "thirty-first"];
  const suf = d => (d % 10 === 1 && d !== 11 ? "st" : d % 10 === 2 && d !== 12 ? "nd" : d % 10 === 3 && d !== 13 ? "rd" : "th");
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const MDAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  Deck.unit({
    id: "u7", num: 7, title: "Food, shopping and festivals", color: "#a21caf", soft: "#f7e3f9",
    subtitle: "Essen, Einkaufen und Feste – in London und Berlin",
    blurb: "Food, British money, have to – und Feste von Halloween bis Pancake Day.",
    goals: ["Essen und Trinken auf Englisch benennen", "a/an oder some? How much oder How many?", "Im Laden mit Pfund und Pence einkaufen", "have to / don't have to für Regeln", "Feste und Daten: on the 5th of November"],
    icon(svg, el) {
      svg.append(el("circle", { cx: 35, cy: 35, r: 28, fill: "#a21caf", opacity: .14 }),
        el("ellipse", { cx: 35, cy: 44, rx: 22, ry: 7, fill: "#a21caf", opacity: .35 }),
        el("ellipse", { cx: 35, cy: 38, rx: 19, ry: 6, fill: "#f2c879", stroke: "#a21caf", "stroke-width": 2 }),
        el("ellipse", { cx: 35, cy: 32, rx: 17, ry: 5.5, fill: "#f2c879", stroke: "#a21caf", "stroke-width": 2 }),
        el("ellipse", { cx: 35, cy: 26, rx: 15, ry: 5, fill: "#f2c879", stroke: "#a21caf", "stroke-width": 2 }),
        el("rect", { x: 30, y: 17, width: 10, height: 8, rx: 2, fill: "#ffd94a" }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Food and drink",
        say: "Hier lernst du Wörter für Essen und Trinken. Tippe auf ein Bild, dann hörst du das englische Wort.",
        build(s) {
          const items = [
            ["🍎", "an apple", "ein Apfel", 0], ["🍌", "a banana", "eine Banane", 0], ["🍅", "a tomato", "eine Tomate", 0], ["🥕", "a carrot", "eine Karotte", 0],
            ["🍞", "bread", "Brot", 1], ["🧀", "cheese", "Käse", 1], ["🥚", "an egg", "ein Ei", 1], ["🐟", "fish", "Fisch", 1],
            ["🍟", "chips", "Pommes", 1], ["🥛", "milk", "Milch", 2], ["☕", "tea", "Tee", 2], ["🧃", "orange juice", "Orangensaft", 2]];
          const cols = ["var(--green)", "var(--orange)", "var(--blue)"];
          const tiles = items.map(([e, en, de, gi]) => {
            const b = s.h("button", { class: "ek-tile later", style: { borderColor: cols[gi], height: "150px" }, onclick: () => { s.sfx.pop(); s.speak(en, EN); b.classList.remove("ek-ping"); void b.offsetWidth; b.classList.add("ek-ping"); } },
              s.h("span", { style: { fontSize: "54px", lineHeight: "1" } }, e),
              s.h("span", { class: "ek-en", style: { fontSize: "23px" } }, en),
              s.h("span", { class: "small pencil" }, de));
            return b;
          });
          const leg = ["fruit and vegetables – Obst und Gemüse", "food – Essen", "drinks – Getränke"].map((t, i) => s.h("span", { class: "chip later", style: { background: "#fff", border: "3px solid " + cols[i] } }, t));
          const merk = s.h("div", { class: "merk later" },
            s.h("div", { class: "ek-line" },
              s.h("p", { style: { margin: 0, flex: 1 } }, "Falscher Freund! ", B(s, "chips"), " = Pommes frites, ", B(s, "crisps"), " = Kartoffelchips. Ein britischer Klassiker: ", B(s, "fish and chips"), "."),
              hear(s, "fish and chips", "fish and chips")));
          s.add(s.h("div", { class: "stack", style: { height: "100%" } },
            s.h("div", { class: "row" }, leg),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "14px" } }, tiles),
            merk));
          s.sfx.whoosh(); s.show(leg[0], "left");
          seq(s, tiles.slice(0, 4));
          s.step(async () => { s.show(leg[1], "left"); await seq(s, tiles.slice(4, 9)); s.say("Brot, Käse, Ei, Fisch und Pommes."); });
          s.step(async () => { s.show(leg[2], "left"); await seq(s, tiles.slice(9)); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.say("Achtung: chips sind Pommes, crisps sind Chips."); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Breakfast: UK and Germany",
        say: "So sieht ein großes englisches Frühstück aus, das Full English. Und was isst man in Deutschland?",
        build(s) {
          const svg = s.svg(620, 450);
          svg.append(s.el("circle", { cx: 300, cy: 220, r: 175, fill: "#fff", stroke: "#c8d3de", "stroke-width": 6 }), s.el("circle", { cx: 300, cy: 220, r: 140, fill: "none", stroke: "#e6edf3", "stroke-width": 3 }));
          const part = (word, draw, lab) => {
            const g = s.el("g", { class: "later", style: { cursor: "pointer" }, onclick: () => { s.sfx.pop(); s.speak(word, EN); } });
            draw(g);
            if (lab.line) g.append(s.el("line", { x1: lab.line[0], y1: lab.line[1], x2: lab.line[2], y2: lab.line[3], stroke: "#5d6678", "stroke-width": 2, "stroke-dasharray": "5 4" }));
            g.append(s.el("text", { x: lab.x, y: lab.y, "text-anchor": lab.a, "font-size": 22, "font-weight": 700, fill: "#a21caf", text: word }));
            svg.append(g); return g;
          };
          const egg = (g, x, y) => g.append(s.el("ellipse", { cx: x, cy: y, rx: 40, ry: 30, fill: "#fff", stroke: "#e2d9c6", "stroke-width": 3 }), s.el("circle", { cx: x + 4, cy: y - 2, r: 13, fill: "#f4b51e" }));
          const parts = [
            part("fried eggs", g => { egg(g, 235, 135); egg(g, 315, 118); }, { x: 130, y: 136, a: "end", line: [136, 130, 194, 134] }),
            part("bacon", g => { [150, 178].forEach(y => { const d = `M350 ${y} q15 -12 30 0 t30 0 t28 0`; g.append(s.el("path", { d, fill: "none", stroke: "#b8473a", "stroke-width": 18, "stroke-linecap": "round" }), s.el("path", { d, fill: "none", stroke: "#f2b8a8", "stroke-width": 5, "stroke-linecap": "round" })); }); }, { x: 486, y: 150, a: "start", line: [480, 144, 448, 152] }),
            part("sausages", g => { g.append(s.el("rect", { x: 165, y: 205, width: 95, height: 26, rx: 13, fill: "#8a4b2a" }), s.el("rect", { x: 175, y: 240, width: 95, height: 26, rx: 13, fill: "#7a4024" })); }, { x: 130, y: 236, a: "end", line: [136, 230, 165, 224] }),
            part("baked beans", g => { g.append(s.el("circle", { cx: 300, cy: 298, r: 42, fill: "#d9622b" })); [[-18, -14], [6, -20], [22, -4], [-24, 6], [-2, 2], [18, 18], [-10, 22], [4, -6]].forEach(([dx, dy]) => g.append(s.el("ellipse", { cx: 300 + dx, cy: 298 + dy, rx: 7, ry: 5, fill: "#f39a5f" }))); }, { x: 486, y: 312, a: "start", line: [480, 305, 342, 300] }),
            part("tomato", g => { g.append(s.el("circle", { cx: 395, cy: 245, r: 28, fill: "#e0412f" }), s.el("circle", { cx: 395, cy: 245, r: 18, fill: "#f26b57" }), s.el("circle", { cx: 389, cy: 241, r: 3, fill: "#ffe1a8" }), s.el("circle", { cx: 401, cy: 249, r: 3, fill: "#ffe1a8" })); }, { x: 486, y: 238, a: "start", line: [480, 232, 423, 240] }),
            part("mushrooms", g => { [200, 245].forEach(x => g.append(s.el("rect", { x: x - 6, y: 318, width: 12, height: 16, rx: 3, fill: "#e6d3b8" }), s.el("path", { d: `M${x - 22} 322 a22 18 0 0 1 44 0 z`, fill: "#9b7653" }))); }, { x: 132, y: 332, a: "end", line: [138, 326, 178, 322] }),
            part("toast", g => { g.append(s.el("rect", { x: 420, y: 338, width: 82, height: 74, rx: 16, fill: "#e8b56a", stroke: "#b7803a", "stroke-width": 4 }), s.el("rect", { x: 432, y: 352, width: 58, height: 48, rx: 10, fill: "#f6d9a0" })); }, { x: 516, y: 392, a: "start" }),
          ];
          const ger = s.h("div", { class: "card later", style: { padding: "12px 18px" } },
            s.h("span", { class: "exlabel" }, "In Germany"),
            s.h("p", { class: "small", style: { marginBottom: "8px" } }, "Bei uns gibt es oft Brötchen mit Butter, Marmelade, Käse oder Wurst – oder Müsli."),
            line(s, "We often have bread rolls with jam or cheese."));
          const life = s.h("div", { class: "life later", style: { padding: "12px 18px" } },
            s.h("span", { class: "exlabel" }, "Ruby und Lukas"),
            s.h("div", { class: "stack", style: { gap: "8px" } },
              line(s, "Ruby: For breakfast I have toast and tea.", { speak: "For breakfast I have toast and tea." }),
              line(s, "Lukas: I have muesli and a glass of milk.", { speak: "I have muesli and a glass of milk." })));
          const right = s.h("div", { class: "stack", style: { gap: "14px" } },
            s.h("div", { class: "ek-line" }, hear(s, "a full English breakfast"), s.h("p", { class: "h2", style: { flex: 1 } }, "A full English breakfast")),
            s.h("p", { class: "small" }, "Warm, gebraten und groß! Die meisten Briten essen das nicht jeden Tag, sondern eher am Wochenende oder im Café."),
            ger, life);
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "620px 1fr", gap: "24px", alignItems: "center", height: "100%" } }, svg, right));
          s.show(svg, "zoom"); s.sound("sizzle", { vol: .45, dur: 3, fade: .8 });
          s.step(async () => { await seq(s, parts.slice(0, 3), "pop", 350, () => s.sfx.pop()); s.say("Spiegeleier, Speck und Würstchen."); });
          s.step(async () => { await seq(s, parts.slice(3), "pop", 350, () => s.sfx.pop()); s.say("Dazu Bohnen in Tomatensoße, Tomate, Pilze und Toast."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(ger, "left"); });
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 2b --------------------------------------------------------------- */
      {
        title: "British food – in echt",
        say: "So sieht typisch britisches Essen in echt aus: ein Full English Breakfast, Fish and Chips am Meer und ein Cream Tea mit Scones.",
        build(s) {
          const items = [
            ["full-english", "a full English breakfast", "Eggs, bacon, sausages, beans …", "Eier, Speck, Würstchen, Bohnen …", "sizzle", "Brutzeln"],
            ["fish-and-chips", "fish and chips", "Fish and chips at the seaside!", "Fisch mit Pommes am Meer!", "waves", "Am Meer"],
            ["cream-tea", "a cream tea", "Tea with scones, jam and cream.", "Tee mit Scones, Marmelade und Sahne.", "water-pour", "Tee eingießen"],
          ];
          const cols = items.map(([img, cap, en, de, snd, lab]) => s.h("div", { class: "stack later", style: { gap: "10px", alignItems: "stretch" } },
            s.photo(img, { w: 346, h: 300, caption: cap }), line(s, en, { size: 21 }), s.h("p", { class: "small pencil", style: { margin: "-4px 0 0 66px" } }, de), s.soundBtn(snd, lab, { vol: .6, dur: 4 })));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, B(s, "scones"), " = kleine süße Brötchen. ", B(s, "clotted cream"), " = sehr dicke Sahne. Ein ", B(s, "cream tea"), " ist Tee mit Scones, Marmelade und clotted cream.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "14px" } }, s.h("div", { class: "cols3", style: { gap: "20px" } }, cols), merk));
          s.step(async () => { s.sound("sizzle", { vol: .5, dur: 3, fade: .8 }); await s.show(cols[0], "up"); s.speak("a full English breakfast", EN); });
          s.step(async () => { s.sound("waves", { vol: .4, dur: 3, fade: .8 }); await s.show(cols[1], "up"); s.speak("fish and chips", EN); });
          s.step(async () => { s.sound("water-pour", { vol: .6 }); await s.show(cols[2], "up"); s.speak("a cream tea", EN); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "School dinner or packed lunch?",
        say: "Mittagessen in der Schule: Entweder ein warmes school dinner oder ein packed lunch, also eine Brotdose von zu Hause.",
        build(s) {
          const tray = s.svg(470, 170);
          tray.append(s.el("rect", { x: 10, y: 10, width: 450, height: 150, rx: 20, fill: "#cdd6e0", stroke: "#9aa6b4", "stroke-width": 3 }),
            s.el("rect", { x: 25, y: 25, width: 200, height: 120, rx: 12, fill: "#eef2f6" }),
            s.el("rect", { x: 240, y: 25, width: 205, height: 55, rx: 12, fill: "#eef2f6" }),
            s.el("rect", { x: 240, y: 90, width: 205, height: 55, rx: 12, fill: "#eef2f6" }));
          const fish = s.el("g", { class: "later" }); [38, 64, 90, 116].forEach(y => fish.append(s.el("rect", { x: 45, y, width: 160, height: 18, rx: 6, fill: "#e39a3b", stroke: "#b56e1c", "stroke-width": 2 })));
          const peas = s.el("g", { class: "later" }); for (let i = 0; i < 12; i++) peas.append(s.el("circle", { cx: 262 + (i % 6) * 32, cy: 42 + Math.floor(i / 6) * 22, r: 8, fill: "#4fa83d" }));
          const pots = s.el("g", { class: "later" }); for (let i = 0; i < 5; i++) pots.append(s.el("circle", { cx: 270 + i * 38, cy: 118, r: 16, fill: "#f2d27a", stroke: "#c9a24a", "stroke-width": 2 }));
          tray.append(fish, peas, pots);
          const box = s.svg(470, 170);
          const items = s.el("g");
          const sw = s.el("polygon", { class: "later", points: "80,140 190,140 80,80", fill: "#f4e1b0", stroke: "#c79a4a", "stroke-width": 4 });
          const ap = s.el("g", { class: "later" }); ap.append(s.el("circle", { cx: 235, cy: 118, r: 24, fill: "#d9342b" }), s.el("path", { d: "M235 94 q6 -10 14 -10", stroke: "#6b3d1d", "stroke-width": 4, fill: "none" }));
          const crisps = s.el("g", { class: "later" }); crisps.append(s.el("rect", { x: 280, y: 84, width: 52, height: 62, rx: 6, fill: "#ffd94a", stroke: "#c9a400", "stroke-width": 3 }), s.el("circle", { cx: 306, cy: 115, r: 12, fill: "#f5b041" }));
          const bottle = s.el("g", { class: "later" }); bottle.append(s.el("rect", { x: 392, y: 50, width: 40, height: 108, rx: 12, fill: "#7cc4f0", stroke: "#2b7dc0", "stroke-width": 3 }), s.el("rect", { x: 402, y: 34, width: 20, height: 18, rx: 4, fill: "#2b7dc0" }));
          items.append(sw, ap, crisps);
          const lid = s.el("rect", { x: 50, y: 58, width: 310, height: 26, rx: 10, fill: "#7b3fa0" });
          box.append(s.el("rect", { x: 50, y: 70, width: 310, height: 90, rx: 16, fill: "#c992e6", stroke: "#7b3fa0", "stroke-width": 4 }), items, lid, bottle);
          const life = s.h("div", { class: "life later", style: { gridColumn: "1 / span 2", padding: "12px 18px" } },
            s.h("span", { class: "exlabel" }, "Im Alltag"),
            s.h("div", { class: "ek-line" },
              s.h("p", { class: "small", style: { flex: 1 } }, "In England bekommen alle Kinder in Reception, Year 1 und Year 2 an staatlichen Schulen ein kostenloses Mittagessen (free school meals). Lukas isst in der Mensa: "),
              hear(s, "I have lunch in the canteen.", "I have lunch in the canteen.")));
          const card = (lab, svg, sent, food, de) => s.h("div", { class: "card", style: { padding: "14px 18px", display: "flex", flexDirection: "column", gap: "10px" } },
            s.h("span", { class: "exlabel", style: { margin: 0 } }, lab), svg, line(s, sent, { size: 24 }), food, s.h("p", { class: "small pencil" }, de));
          const f1 = line(s, "fish fingers, peas and potatoes", { later: true, color: "var(--unit)" });
          const f2 = line(s, "a sandwich, an apple, crisps and water", { later: true, color: "var(--unit)" });
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignContent: "start", height: "100%" } },
            card("School dinner – warmes Schulessen", tray, "I have school dinners.", f1, "Man isst in der dining hall (Speisesaal) der Schule."),
            card("Packed lunch – Essen von zu Hause", box, "I bring a packed lunch.", f2, "Eine Brotdose (lunchbox) mit Pausenbrot und Obst."),
            life));
          s.sfx.whoosh();
          s.step(async () => { await seq(s, [fish, peas, pots], "pop", 300, () => s.sfx.pop()); s.show(f1, "up"); s.say("Fischstäbchen, Erbsen und Kartoffeln."); });
          s.step(async () => {
            s.sfx.boing();
            await s.tween({ from: 0, to: 1, dur: 600, ease: "back", update: v => { lid.setAttribute("transform", `translate(0 ${-48 * v})`); lid.setAttribute("opacity", 1 - .85 * v); } });
            await seq(s, [sw, ap, crisps, bottle], "pop", 250, i => (i === 2 ? s.sound("crisps", { vol: .7 }) : s.sfx.pop())); s.show(f2, "up");
          });
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "an apple – some bread",
        say: "Manche Sachen kann man zählen, zum Beispiel Äpfel. Andere nicht, zum Beispiel Brot oder Milch. Dann sagt man some.",
        build(s) {
          const row = (emo, n, text, later = true) => {
            const pics = [...Array(n)].map(() => s.h("span", { class: "later", style: { fontSize: "38px", lineHeight: "1", display: "inline-block" } }, emo));
            const r = s.h("div", { class: "ek-line" + (later ? " later" : "") }, hear(s, text), s.h("div", { style: { width: "130px", display: "flex", gap: "2px" } }, pics), s.h("p", { class: "ek-en", style: { fontSize: "26px" } }, text));
            r.pics = pics; return r;
          };
          const L = [row("🍎", 1, "an apple"), row("🍎", 3, "three apples"), row("🥚", 2, "two eggs"), row("🍌", 3, "three bananas")];
          const R = [row("🍞", 1, "some bread"), row("🥛", 1, "some milk"), row("🧀", 1, "some cheese")];
          const wrong = s.h("div", { class: "ek-line later", style: { minHeight: "56px" } }, s.h("span", { class: "big red", style: { width: "56px", textAlign: "center" } }, "✗"), s.h("p", { class: "ek-en", style: { fontSize: "26px", textDecoration: "line-through", textDecorationColor: "var(--red)", textDecorationThickness: "3px", color: "var(--pencil)" } }, "two breads"));
          const right = row("🍞", 2, "two slices of bread");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Zählbar: ", B(s, "a/an"), " + Einzahl, Mehrzahl mit ", B(s, "-s"), " (two apples). Nicht zählbar: kein a/an, kein -s – man sagt ", B(s, "some"), ": some bread, some milk. Zählen geht mit Hilfe: ", B(s, "a slice of bread"), " (eine Scheibe Brot).");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "14px" } },
            s.h("div", { class: "cols", style: { gap: "20px" } },
              s.h("div", { class: "card", style: { padding: "12px 18px" } }, s.h("span", { class: "exlabel" }, "countable – zählbar"), s.h("div", { class: "stack", style: { gap: "8px" } }, L)),
              s.h("div", { class: "card", style: { padding: "12px 18px" } }, s.h("span", { class: "exlabel" }, "uncountable – nicht zählbar"), s.h("div", { class: "stack", style: { gap: "8px" } }, R, wrong, right))),
            merk));
          const showRow = async r => { s.show(r, "left"); await seq(s, r.pics, "pop", 200); };
          s.sfx.whoosh(); showRow(L[0]);
          s.step(async () => { for (const r of L.slice(1)) await showRow(r); s.say("Zählbar: a, an, oder eine Zahl mit s."); });
          s.step(async () => { for (const r of R) await showRow(r); s.say("Nicht zählbar: some bread, some milk, some cheese."); });
          s.step(async () => { s.sfx.error(); await s.show(wrong, "left"); s.sfx.success(); await showRow(right); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "How much? How many?",
        say: "How many fragt nach Dingen, die man zählen kann. How much fragt nach einer Menge oder nach dem Preis.",
        build(s) {
          const mk = (lab, svg, q, a, sayA) => {
            const c = s.h("div", { class: "card later", style: { padding: "12px 16px", display: "flex", flexDirection: "column", gap: "10px" } },
              s.h("span", { class: "exlabel", style: { margin: 0 } }, lab), svg,
              line(s, q, { size: 22 }), s.h("div", { class: "ek-line" }, hear(s, sayA), s.h("p", { class: "ek-en blue", style: { fontSize: "26px" } }, a)));
            return c;
          };
          const s1 = s.svg(300, 120); const eggs = [0, 1].map(i => { const g = s.el("g", { class: "later" }); g.append(s.el("ellipse", { cx: 110 + i * 80, cy: 64, rx: 30, ry: 40, fill: "#fbf3e4", stroke: "#cdb48a", "stroke-width": 3 })); s1.append(g); return g; });
          const s2 = s.svg(300, 120);
          const fill = s.el("rect", { x: 112, y: 110, width: 76, height: 0, fill: "#f4f7fb" });
          s2.append(s.el("rect", { x: 108, y: 10, width: 84, height: 104, rx: 8, fill: "#dceaf6", stroke: "#5d6678", "stroke-width": 3 }), fill, s.el("path", { d: "M192 30 q30 6 0 50", fill: "none", stroke: "#5d6678", "stroke-width": 5 }));
          const ml = s.el("text", { x: 60, y: 70, "text-anchor": "middle", "font-size": 24, "font-weight": 800, fill: "#a21caf", text: "0 ml" }); s2.append(ml);
          const s3 = s.svg(300, 120);
          s3.append(s.el("rect", { x: 60, y: 60, width: 120, height: 50, rx: 8, fill: "#f7c6d9", stroke: "#b04a7a", "stroke-width": 3 }), s.el("rect", { x: 60, y: 46, width: 120, height: 20, rx: 8, fill: "#fff", stroke: "#b04a7a", "stroke-width": 3 }), s.el("circle", { cx: 120, cy: 38, r: 9, fill: "#dc3b2a" }));
          const tag = s.el("g", { class: "later" }); tag.append(s.el("rect", { x: 196, y: 30, width: 90, height: 44, rx: 8, fill: "#ffd94a", stroke: "#c9a400", "stroke-width": 3 }), s.el("text", { x: 241, y: 60, "text-anchor": "middle", "font-size": 24, "font-weight": 800, fill: "#1b2740", text: "£2.50" })); s3.append(tag);
          const c1 = mk("Pancakes backen", s1, "How many eggs do we need?", "Two eggs.", "Two eggs.");
          const c2 = mk("Pancakes backen", s2, "How much milk do we need?", "300 ml.", "Three hundred millilitres.");
          const c3 = mk("Im Laden", s3, "How much is the cake?", "It's £2.50.", "It's two pounds fifty.");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, B(s, "How many"), " + Mehrzahl (zählbar): How many eggs? · ", B(s, "How much"), " + nicht zählbar: How much milk? · ", B(s, "How much is …?"), " = Was kostet …?");
          const life5 = s.h("div", { class: "life later", style: { padding: "10px 18px" } }, s.h("span", { class: "exlabel" }, "Im Alltag"),
            s.h("div", { class: "cols", style: { gap: "16px" } }, line(s, "How many children are in your class?", { size: 21 }), line(s, "How much time do we have?", { size: 21 })));
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "16px" } }, s.h("div", { class: "cols3", style: { gap: "18px" } }, c1, c2, c3), merk, life5));
          s.sfx.whoosh(); s.show(c1, "up").then(() => seq(s, eggs, "bounce", 300));
          s.step(async () => {
            await s.show(c2, "up"); s.sound("water-pour", { vol: .6 });
            await s.tween({ from: 0, to: 300, dur: 1200, update: v => { fill.setAttribute("height", v * .3); fill.setAttribute("y", 110 - v * .3); fill.setAttribute("fill", "#ffffff"); ml.textContent = Math.round(v) + " ml"; } });
            s.sfx.ding();
          });
          s.step(async () => { await s.show(c3, "up"); s.sound("cash-register", { vol: .5 }); await s.show(tag, "zoom"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(life5, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "British money",
        say: "In Großbritannien bezahlt man mit Pfund und Pence. Ein Pfund hat hundert Pence, so wie ein Euro hundert Cent hat.",
        build(s) {
          const svg = s.svg(1100, 160);
          const gap = (1100 - COINS.reduce((a, c) => a + 2 * c.r, 0)) / 9;
          let x = gap; const coinEls = COINS.map(c => {
            const cx = x + c.r; x += 2 * c.r + gap;
            const g = s.el("g", { class: "later", style: { cursor: "pointer" }, onclick: () => { s.sfx.coin(); s.speak(c.w.replace(/^1 /, "one ").replace(/^2 /, "two "), EN); } });
            g.append(coin(s, c, cx, 62), s.el("text", { x: cx, y: 145, "text-anchor": "middle", "font-size": 19, fill: "#5d6678", text: c.w }));
            svg.append(g); return g;
          });
          const cnt = s.svg(500, 160);
          const minis = [];
          for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) { const e = s.el("ellipse", { cx: 26 + i * 34, cy: 140 - j * 9, rx: 14, ry: 6, fill: "#cd8549", stroke: "#8d5226", "stroke-width": 1.5, visibility: "hidden" }); cnt.append(e); minis.push(e); }
          const num = s.el("text", { x: 490, y: 70, "text-anchor": "end", "font-size": 44, "font-weight": 800, fill: "#a21caf", text: "0p" });
          const eq = s.el("text", { class: "later", x: 490, y: 135, "text-anchor": "end", "font-size": 44, "font-weight": 800, fill: "#138a5a", text: "= £1" });
          cnt.append(num, eq);
          const prices = [[250, "two pounds fifty"], [75, "seventy-five p"], [120, "one pound twenty"]].map(([p, w]) =>
            s.h("div", { class: "ek-line later" }, hear(s, w), s.h("p", { class: "big mono", style: { width: "120px", fontSize: "32px" } }, priceTxt(p)), s.h("p", { class: "ek-en", style: { fontSize: "24px" } }, "→ " + w)));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, B(s, "£"), " = pound (Pfund), ", B(s, "p"), " = penny / pence. Seit 1971 gilt: ", B(s, "£1 = 100p"), " – wie 1 € = 100 Cent. Man schreibt £2.50 mit Punkt und sagt „two pounds fifty“.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "14px" } }, svg,
            s.h("div", { class: "cols", style: { gap: "18px" } },
              s.h("div", { class: "card", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, "100 pennies = 1 pound"), cnt),
              s.h("div", { class: "card", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, "Preise sagen"), s.h("div", { class: "stack", style: { gap: "8px" } }, prices))),
            merk));
          s.sound("coins", { vol: .6 }); seq(s, coinEls, "pop", 140, () => {});
          s.step(async () => {
            let last = 0;
            await s.tween({ from: 0, to: 100, dur: 2200, ease: "linear", update: v => { const n = Math.round(v); for (let k = last; k < n; k++) minis[k].setAttribute("visibility", "visible"); if (n > last && n % 10 === 0) s.sfx.tick(); last = Math.max(last, n); num.textContent = n + "p"; } });
            s.sfx.success(); await s.show(eq, "zoom");
          });
          s.step(async () => { await seq(s, prices, "left", 400, () => s.sfx.coin()); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Pay with pounds and pence",
        say: "Tippe auf die Münzen und bezahle. Unten siehst du, wie viel Geld es zusammen ist.",
        build(s) {
          const shop = [["💧", "a bottle of water", 85, "eighty-five p"], ["🥐", "a croissant", 130, "one pound thirty"], ["📖", "a comic", 299, "two pounds ninety-nine"]].map(([e, item, p, w]) =>
            s.h("div", { class: "card later", style: { padding: "10px 14px", display: "flex", alignItems: "center", gap: "12px" } },
              s.h("span", { style: { fontSize: "44px", lineHeight: "1" } }, e),
              s.h("div", { style: { flex: 1, minWidth: 0 } }, s.h("p", { class: "ek-en", style: { fontSize: "22px" } }, item), s.h("p", { class: "big mono", style: { fontSize: "30px", color: "var(--unit)" } }, priceTxt(p))),
              hear(s, `${item}: ${w}`)));
          let total = 0, n = 0;
          const tray = s.h("div", { style: { flex: 1, minWidth: 0, height: "112px", display: "flex", flexWrap: "wrap", alignContent: "flex-start", gap: "4px", overflow: "hidden" } });
          const tot = s.h("p", { class: "huge mono", style: { fontSize: "60px", width: "220px", textAlign: "right" } }, "0p");
          const speakTot = hear(s, "zero");
          speakTot.onclick = () => { s.sfx.click(); s.speak(total ? priceSay(total) : "nothing", EN); };
          const reset = s.h("button", { class: "btn", onclick: () => { s.sfx.swoosh(); total = 0; n = 0; tray.innerHTML = ""; tot.textContent = "0p"; } }, "Leeren");
          const addCoin = c => {
            if (n >= 14) { total = 0; n = 0; tray.innerHTML = ""; }
            s.sfx.coin(); n++; total += c.v; tot.textContent = priceTxt(total);
            const m = s.svg(52, 52); m.append(coin(s, c, 26, 26, 24 / c.r * (c.r / 45 * .45 + .55), false)); m.classList.add("a-bounce"); tray.append(m);
          };
          const demo = async p => {
            total = 0; n = 0; tray.innerHTML = ""; tot.textContent = "0p"; let rest = p;
            for (const c of [...COINS].reverse()) while (rest >= c.v) { rest -= c.v; addCoin(c); await s.wait(350); if (!s.alive) return; }
            s.sound("cash-register", { vol: .45 }); s.speak(priceSay(p), EN);
          };
          const demos = s.h("div", { class: "life later", style: { padding: "10px 18px", display: "flex", alignItems: "center", gap: "12px" } },
            s.h("p", { class: "small", style: { flex: 1 } }, "Wie bezahlt man genau? Tippe – das Portemonnaie zeigt die Münzen:"),
            [85, 130, 299].map(p => s.h("button", { class: "btn", onclick: () => demo(p) }, priceTxt(p))));
          const btns = COINS.map(c => {
            const sv = s.svg(96, 96); sv.append(coin(s, c, 48, 48, 44 / c.r * (c.r / 45 * .45 + .55)));
            const b = s.h("button", { class: "btn", "aria-label": c.w, style: { height: "104px", padding: "4px", flex: 1, borderWidth: "2px" }, onclick: () => addCoin(c) }, sv);
            return b;
          });
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "16px" } },
            s.h("p", { class: "t" }, "Im Laden in London: Tippe Münzen an – das Portemonnaie rechnet mit."),
            s.h("div", { class: "cols3", style: { gap: "16px" } }, shop),
            s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "10px" } }, btns),
            s.h("div", { class: "card soft", style: { display: "flex", alignItems: "center", gap: "16px", padding: "12px 18px" } },
              s.h("span", { class: "exlabel", style: { margin: 0, width: "120px" } }, "Mein Geld"), tray, tot, speakTot, reset), demos));
          s.sfx.whoosh();
          s.step(async () => { await seq(s, shop, "up", 300, () => s.sfx.pop()); s.say("Wasser kostet 85 Pence, ein Croissant ein Pfund dreißig."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(demos, "up"); await demo(85); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "At the shop",
        say: "Ruby kauft beim Bäcker ein. Hör dir das Gespräch an. Tippe auf die Lautsprecher.",
        build(s) {
          const svg = s.svg(360, 290);
          svg.append(
            s.el("rect", { x: 10, y: 20, width: 340, height: 120, rx: 8, fill: "#f3e6d2", stroke: "#b48a5a", "stroke-width": 3 }),
            s.el("line", { x1: 10, y1: 80, x2: 350, y2: 80, stroke: "#b48a5a", "stroke-width": 4 }),
            ...[40, 100, 160, 220, 280].map(x => s.el("ellipse", { cx: x + 20, cy: 64, rx: 24, ry: 14, fill: "#d9a35b" })),
            ...[40, 110, 180, 250].map(x => s.el("circle", { cx: x + 25, cy: 120, r: 14, fill: "#e8bf74" })),
            // shop assistant
            s.el("circle", { cx: 250, cy: 150, r: 24, fill: "#f1c9a5" }), s.el("rect", { x: 222, y: 172, width: 56, height: 60, rx: 14, fill: "#a21caf" }),
            s.el("rect", { x: 140, y: 205, width: 220, height: 80, rx: 6, fill: "#8b5a2b" }),
            // Ruby
            cast(s, "ruby", 80, 286, { h: 132 }));
          const coins = s.el("g", { class: "later" }); coins.append(coin(s, COINS[7], 250, 250, .5, false), coin(s, COINS[5], 285, 252, .5, false), coin(s, COINS[4], 315, 254, .5, false));
          svg.append(coins);
          const tagS = s.h("span", { class: "ek-av", style: { background: "var(--unit)" } }, "S"), tagA = s.h("span", { class: "ek-av", style: { background: "var(--blue)" } }, "R");
          const L = [
            ["S", "Hello! Can I help you?"],
            ["R", "Yes, please. I'd like two bread rolls and a bottle of water."],
            ["S", "Here you are. Anything else?"],
            ["R", "No, thank you. How much is it?"],
            ["S", "That's £2.40, please.", "That's two pounds forty, please."],
            ["R", "Here you are. Thank you. Bye!"]].map(([who, t, sp]) => s.h("div", { class: "ek-line later", style: { flexDirection: who === "S" ? "row" : "row-reverse" } },
              s.h("span", { class: "ek-av", style: { background: who === "S" ? "var(--unit)" : "var(--blue)" } }, who),
              s.h("p", { class: "ek-bub", style: { borderColor: who === "S" ? "var(--unit)" : "var(--blue)" } }, t), hear(s, sp || t)));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, B(s, "I'd like …"), " = Ich hätte gern … (höflich!). ", B(s, "Here you are."), " = Bitte schön (beim Geben). ", B(s, "How much is it?"), " = Was kostet das?");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "360px 1fr", gap: "24px", height: "100%" } },
            s.h("div", { class: "stack", style: { gap: "12px" } }, svg, merk),
            s.h("div", { class: "stack", style: { gap: "10px" } },
              s.h("div", { class: "row", style: { gap: "10px" } }, tagS, s.h("span", { class: "small pencil" }, "shop assistant (Verkäuferin)"), tagA, s.h("span", { class: "small pencil" }, "Ruby")),
              L)));
          void tagA;
          s.show(svg, "zoom"); s.sound("shop-bell", { vol: .6 }); s.show(L[0], "right");
          s.step(async () => { s.sfx.pop(); await s.show(L[1], "left"); });
          s.step(async () => { s.sfx.pop(); await s.show(L[2], "right"); s.sfx.pop(); await s.show(L[3], "left"); });
          s.step(async () => { s.sfx.pop(); await s.show(L[4], "right"); s.sound("coins", { vol: .6 }); s.show(coins, "bounce"); await s.show(L[5], "left"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Im Alltag: a shopping list",
        say: "Ruby hat einen Einkaufszettel geschrieben. Wir haken ab und packen alles in den Korb.",
        build(s) {
          const list = [["🍞", "a loaf of bread"], ["🥚", "six eggs"], ["🥛", "a carton of milk"], ["🍎", "a bag of apples"], ["🧀", "some cheese"], ["🥔", "a packet of crisps"]];
          const ticks = [], rows = list.map(([, t]) => {
            const tk = s.h("span", { class: "later", style: { color: "var(--green)", font: "800 30px/1 var(--f-display)" } }, "✓");
            ticks.push(tk);
            return s.h("div", { class: "ek-line" }, s.h("span", { style: { width: "34px", height: "34px", border: "3px solid var(--pencil)", borderRadius: "6px", display: "grid", placeItems: "center", flex: "none" } }, tk),
              s.h("span", { class: "hand", style: { flex: 1, fontSize: "34px", color: "var(--blue)" } }, t), hear(s, t));
          });
          const paper = s.h("div", { class: "card", style: { padding: "14px 20px", background: "repeating-linear-gradient(#fff 0 59px, #dbe6f3 59px 61px)", borderColor: "#c8d3de" } },
            s.h("span", { class: "exlabel" }, "Ruby's shopping list"), s.h("div", { class: "stack", style: { gap: "5px" } }, rows));
          const bask = s.svg(480, 230);
          bask.append(s.el("path", { d: "M120 90 q120 -100 240 0", fill: "none", stroke: "#a0703c", "stroke-width": 10 }));
          const goods = list.map(([e], i) => { const t = s.el("text", { class: "later", x: 105 + i * 54, y: 112 + (i % 2) * 10, "font-size": 44, "text-anchor": "middle", text: e }); bask.append(t); return t; });
          bask.append(s.el("path", { d: "M70 120 h340 l-34 100 h-272 z", fill: "#d9a35b", stroke: "#a0703c", "stroke-width": 5 }),
            ...[150, 210, 270, 330].map(x => s.el("line", { x1: x, y1: 124, x2: x - 8 * (x < 240 ? -1 : 1), y2: 216, stroke: "#a0703c", "stroke-width": 3 })));
          const pk = [["a loaf of", "a loaf of bread"], ["a carton of", "a carton of milk"], ["a bottle of", "a bottle of water"], ["a packet of", "a packet of crisps"], ["a bag of", "a bag of apples"], ["a box of", "a box of eggs"]].map(([w, full]) =>
            s.h("button", { class: "btn", style: { fontSize: "20px", padding: "0 10px" }, onclick: () => { s.sfx.click(); s.speak(full, EN); } }, full));
          const pack = s.h("div", { class: "card later", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, "Packungen – so zählt man Brot, Milch …"),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" } }, pk));
          s.add(s.h("div", { class: "cols", style: { gap: "22px", height: "100%", alignItems: "start" } }, paper, s.h("div", { class: "stack", style: { gap: "12px" } }, bask, pack)));
          s.sound("pencil-write", { vol: .7 });
          const put = async (a, b) => { for (let i = a; i < b; i++) { s.sfx.snap(); s.show(ticks[i], "pop"); await s.wait(200); s.sfx.pop(); await s.show(goods[i], "down"); } };
          s.step(async () => { await put(0, 3); s.say("Brot, Eier und Milch sind im Korb."); });
          s.step(async () => { await put(3, 6); s.sfx.success(); });
          s.step(async () => { s.sfx.whoosh(); await s.show(pack, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "have to – don't have to",
        say: "Mit have to sagst du, was man tun muss. Mit don't have to sagst du, was man nicht tun muss.",
        build(s) {
          const icon = kind => {
            const v = s.svg(300, 84);
            if (kind === "home") v.append(s.el("path", { d: "M110 44 l40 -34 l40 34 v36 h-80z", fill: "#f7e3f9", stroke: "#a21caf", "stroke-width": 4 }), s.el("rect", { x: 140, y: 52, width: 20, height: 28, fill: "#a21caf" }));
            if (kind === "school") v.append(s.el("rect", { x: 80, y: 30, width: 140, height: 50, fill: "#e4ecfb", stroke: "#1d5bd0", "stroke-width": 4 }), s.el("path", { d: "M70 32 l80 -26 l80 26z", fill: "#1d5bd0" }), s.el("rect", { x: 140, y: 52, width: 20, height: 28, fill: "#1d5bd0" }), ...[95, 185].map(x => s.el("rect", { x, y: 42, width: 20, height: 16, fill: "#fff", stroke: "#1d5bd0", "stroke-width": 2 })));
            if (kind === "pool") { v.append(s.el("rect", { x: 60, y: 30, width: 180, height: 50, rx: 10, fill: "#9fd7f5", stroke: "#2b7dc0", "stroke-width": 4 })); [0, 1].forEach(k => v.append(s.el("path", { d: `M70 ${48 + k * 16} q20 -10 40 0 t40 0 t40 0 t40 0`, fill: "none", stroke: "#fff", "stroke-width": 4 }))); }
            return v;
          };
          const mark = ok => s.h("span", { style: { font: "800 30px/1 var(--f-display)", color: ok ? "var(--green)" : "var(--red)", width: "26px", flex: "none" } }, ok ? "✓" : "✗");
          const sent = (ok, t) => { const r = line(s, t, { size: 21, later: true }); r.prepend(mark(ok)); return r; };
          const data = [
            ["At home – Lukas", "home", "I have to tidy my room.", "I don't have to cook dinner."],
            ["At school – Ruby", "school", "We have to wear a school uniform.", "We don't have to go to school on Saturdays."],
            ["At the swimming pool", "pool", "You have to have a shower first.", "You don't have to swim fast."]];
          const cards = data.map(([lab, k, a, b]) => {
            const c = s.h("div", { class: "card later", style: { padding: "12px 14px", display: "flex", flexDirection: "column", gap: "8px" } }, s.h("span", { class: "exlabel", style: { margin: 0 } }, lab), icon(k), sent(true, a), sent(false, b));
            c.rows = [...c.querySelectorAll(".ek-line")]; return c;
          });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, B(s, "have to"), " = müssen · ", B(s, "don't have to"), " = nicht müssen. Bei he/she/it: Ruby ", B(s, "has to"), " wear a uniform. Lukas ", B(s, "doesn't have to"), ".");
          const warn = s.h("div", { class: "life later", style: { padding: "10px 18px" } }, s.h("span", { class: "exlabel" }, "Vorsicht: mustn't = nicht dürfen!"),
            s.h("div", { class: "ek-line" }, s.h("div", { style: { flex: 1 } }, line(s, "You mustn't run at the pool!", { size: 22 })), s.h("p", { class: "small", style: { flex: 1 } }, "= Du darfst nicht rennen. Aber: You don't have to swim fast. = Du musst nicht schnell schwimmen.")));
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "14px" } }, s.h("div", { class: "cols3", style: { gap: "16px" } }, cards), merk, warn));
          const snd = { home: "door-creak", school: "school-bell", pool: "splash" };
          const go = async c => { const k = data[cards.indexOf(c)][1]; s.sound(snd[k], { vol: .5, dur: 2, fade: .5 }); await s.show(c, "up"); s.sfx.success(); await s.show(c.rows[0], "left"); s.sfx.error(); await s.show(c.rows[1], "left"); };
          go(cards[0]);
          s.step(async () => { await go(cards[1]); s.say("Ruby muss eine Schuluniform tragen."); });
          s.step(async () => { await go(cards[2]); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.error(); await s.show(warn, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Dates: on the 5th of November",
        say: "So sagst du ein Datum auf Englisch: on the fifth of November. Wähle einen Monat und schiebe den Regler.",
        build(s) {
          let m = 10, d = 5;
          const big = s.h("p", { class: "big mono", style: { color: "var(--unit)" } }, "");
          const spoken = s.h("p", { class: "ek-en", style: { fontSize: "26px" } }, "");
          const upd = () => { d = Math.min(d, MDAYS[m]); big.textContent = `${d}${suf(d)} ${MONTHS[m]}`; spoken.textContent = `on the ${ORD[d - 1]} of ${MONTHS[m]}`; };
          const mb = MONTHS.map((name, i) => s.h("button", { class: "btn later" + (i === m ? " solid" : ""), style: { fontSize: "20px", padding: "0 6px" }, onclick: () => { m = i; mb.forEach((b, k) => b.classList.toggle("solid", k === i)); s.sfx.click(); s.speak(name, EN); upd(); } }, name));
          const sl = s.slider({ label: "Tag", min: 1, max: 31, value: d, onInput: v => { d = v; upd(); } });
          const speakDate = hear(s, "date"); speakDate.onclick = () => { s.sfx.click(); s.speak(spoken.textContent, EN); };
          upd();
          const maker = s.h("div", { class: "card later", style: { padding: "12px 18px", display: "flex", flexDirection: "column", gap: "8px" } },
            s.h("span", { class: "exlabel", style: { margin: 0 } }, "Datumsmaschine"), sl, big, s.h("div", { class: "ek-line" }, speakDate, spoken));
          const ex = s.h("div", { class: "card later", style: { padding: "12px 18px" } }, s.h("span", { class: "exlabel" }, "Beispiele"),
            s.h("div", { class: "stack", style: { gap: "8px" } },
              line(s, "My birthday is on the 3rd of May.", { size: 21, speak: "My birthday is on the third of May." }),
              line(s, "Halloween is on the 31st of October.", { size: 21, speak: "Halloween is on the thirty-first of October." }),
              line(s, "Christmas Day is on the 25th of December.", { size: 21, speak: "Christmas Day is on the twenty-fifth of December." })));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Datum: ", B(s, "on"), " the 5th of November · Monat: ", B(s, "in"), " November · 1st, 2nd, 3rd, 4th … 21st, 22nd, 23rd. Man schreibt „5th November“ und sagt „the fifth of November“.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "14px" } },
            s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "10px" } }, mb),
            s.h("div", { class: "cols", style: { gap: "18px" } }, maker, ex), merk));
          seq(s, mb, "pop", 70);
          s.step(async () => { s.sfx.whoosh(); await s.show(maker, "up"); s.say("The fifth of November."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(ex, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "The year in the UK",
        say: "Das ist ein Festkalender für Großbritannien. Tippe auf ein Fest, dann hörst du das Datum.",
        build(s) {
          const svg = s.svg(1100, 390);
          const X = (mi, day, len) => 40 + 85 * (mi + (day - 1) / len);
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const band = s.el("g");
          months.forEach((t, i) => band.append(s.el("rect", { x: 40 + 85 * i, y: 184, width: 85, height: 46, fill: i % 2 ? "#f7e3f9" : "#ecc8f1" }), s.el("text", { x: 82 + 85 * i, y: 224, "text-anchor": "middle", "font-size": 19, "font-weight": 700, fill: "#5d6678", text: t })));
          svg.append(band);
          const info = s.h("p", { class: "ek-en", style: { fontSize: "26px" } }, "Tap a festival!");
          const infoDe = s.h("p", { class: "small" }, "Tippe oben auf ein Fest.");
          let infoSay = "Tap a festival!";
          const fest = [
            { n: "🥞 Pancake Day", dt: "Feb or Mar", x: X(1, 9, 28), up: true, ly: 70, a: "middle", en: "Pancake Day is on a Tuesday in February or March.", de: "Shrove Tuesday – der Tag vor Aschermittwoch. 2027 ist er am 9. Februar." },
            { n: "🐣 Easter", dt: "Mar or Apr", x: X(2, 28, 31), up: false, ly: 272, a: "middle", en: "Easter is in March or April.", de: "Ostern 2027: 28. März. Der Ostermontag ist in England ein Feiertag (bank holiday)." },
            { n: "🎃 Halloween", dt: "31st October", x: X(9, 31, 31), up: true, ly: 40, a: "middle", en: "Halloween is on the thirty-first of October.", de: "Kostüme, „Trick or treat!“ und Kürbislaternen." },
            { n: "🎆 Bonfire Night", dt: "5th November", x: X(10, 5, 30), up: false, ly: 272, a: "middle", en: "Bonfire Night is on the fifth of November.", de: "Feuerwerk und Lagerfeuer – zur Erinnerung an das Jahr 1605." },
            { n: "🎄 Christmas Day", dt: "25th December", x: X(11, 25, 31), up: true, ly: 120, a: "end", en: "Christmas Day is on the twenty-fifth of December.", de: "In Großbritannien gibt es die Geschenke am Morgen des 25. Dezember." },
            { n: "🎁 Boxing Day", dt: "26th December", x: X(11, 26, 31), up: false, ly: 340, a: "end", en: "Boxing Day is on the twenty-sixth of December.", de: "Auch ein Feiertag – wie bei uns der 2. Weihnachtstag." },
          ];
          const marks = fest.map(f => {
            const g = s.el("g", { class: "later", style: { cursor: "pointer" }, onclick: () => { s.sfx.pop(); info.textContent = f.en; infoDe.textContent = f.de; infoSay = f.en; s.speak(f.en, EN); s.show(infoCard, "pop"); } });
            const lx = f.a === "end" ? 1090 : f.x;
            const stemEnd = f.up ? f.ly + 34 : f.ly - 22;
            g.append(s.el("line", { x1: f.x, y1: 194, x2: f.x, y2: stemEnd, stroke: "#a21caf", "stroke-width": 3 }),
              s.el("circle", { cx: f.x, cy: 194, r: 9, fill: "#a21caf", stroke: "#fff", "stroke-width": 3 }),
              s.el("text", { x: lx, y: f.ly, "text-anchor": f.a, "font-size": 22, "font-weight": 800, fill: "#1b2740", text: f.n }),
              s.el("text", { x: lx, y: f.ly + 24, "text-anchor": f.a, "font-size": 19, fill: "#a21caf", text: f.dt }));
            if (f.a === "end") g.append(s.el("line", { x1: f.x, y1: stemEnd, x2: 1090, y2: stemEnd, stroke: "#a21caf", "stroke-width": 3 }));
            svg.append(g); return g;
          });
          const sp = hear(s, "x"); sp.onclick = () => { s.sfx.click(); s.speak(infoSay, EN); };
          const infoCard = s.h("div", { class: "card soft", style: { display: "flex", alignItems: "center", gap: "16px", padding: "14px 20px", minHeight: "150px" } }, sp, s.h("div", { class: "stack", style: { gap: "4px", flex: 1 } }, info, infoDe));
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "14px" } }, svg, infoCard));
          s.sfx.whoosh();
          const two = async (a, b) => { s.sfx.pop(); await s.show(marks[a], "pop"); s.sfx.pop(); await s.show(marks[b], "pop"); };
          s.step(async () => { await two(0, 1); s.say("Im Frühling: Pancake Day und Ostern."); });
          s.step(async () => { await two(2, 3); s.say("Im Herbst: Halloween und Bonfire Night."); });
          s.step(async () => { await two(4, 5); s.sfx.fanfare(); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Halloween and Bonfire Night",
        say: "Zwei Herbstfeste in Großbritannien: Halloween am 31. Oktober und Bonfire Night am 5. November.",
        build(s) {
          const pk = s.svg(460, 150);
          pk.append(s.el("ellipse", { cx: 230, cy: 86, rx: 86, ry: 60, fill: "#ee7a1a" }), s.el("ellipse", { cx: 230, cy: 86, rx: 40, ry: 60, fill: "none", stroke: "#c45f0c", "stroke-width": 4 }), s.el("rect", { x: 222, y: 14, width: 14, height: 22, rx: 4, fill: "#5b7a2a" }));
          const face = [s.el("path", { d: "M188 74 l16 -22 l16 22z", fill: "#3b2410" }), s.el("path", { d: "M240 74 l16 -22 l16 22z", fill: "#3b2410" }), s.el("path", { d: "M180 100 q50 40 100 0 l-14 6 l-10 -8 l-12 10 l-14 -10 l-12 10 l-12 -8 l-12 6z", fill: "#3b2410" })];
          face.forEach(f => { f.classList.add("later"); pk.append(f); });
          const turnip = s.el("g", { class: "later" }); turnip.append(s.el("circle", { cx: 390, cy: 104, r: 32, fill: "#efe1f0", stroke: "#9b6aa8", "stroke-width": 3 }), s.el("path", { d: "M380 72 l-8 -22 M390 72 v-26 M400 72 l8 -22", stroke: "#4f8a2b", "stroke-width": 5 }), s.el("circle", { cx: 380, cy: 100, r: 5, fill: "#3b2410" }), s.el("circle", { cx: 400, cy: 100, r: 5, fill: "#3b2410" }));
          pk.append(turnip);
          const { canvas, g } = s.canvas(460, 150);
          let running = false; const parts = [];
          const draw = t => {
            g.fillStyle = "#1b2740"; g.fillRect(0, 0, 460, 150);
            for (let i = 0; i < 40; i++) { g.fillStyle = "rgba(255,255,255,.5)"; g.fillRect((i * 97) % 460, (i * 53) % 90, 2, 2); }
            const fl = 1 + .15 * Math.sin(t * 12);
            g.fillStyle = "#ee7a1a"; g.beginPath(); g.moveTo(200, 146); g.quadraticCurveTo(230, 146 - 70 * fl, 260, 146); g.fill();
            g.fillStyle = "#ffd94a"; g.beginPath(); g.moveTo(215, 146); g.quadraticCurveTo(230, 146 - 40 * fl, 245, 146); g.fill();
            if (running && Math.random() < .05) { const x = 60 + Math.random() * 340, y = 30 + Math.random() * 50, c = ["#ffd94a", "#dc3b2a", "#7b4fd6", "#3fd18a", "#ffffff"][Math.floor(Math.random() * 5)]; for (let k = 0; k < 28; k++) { const a = k / 28 * Math.PI * 2; parts.push({ x, y, vx: Math.cos(a) * 70, vy: Math.sin(a) * 70, l: 1, c }); } }
            for (const p of parts) { p.x += p.vx * .016; p.y += p.vy * .016; p.vy += 1.2; p.l -= .014; g.globalAlpha = Math.max(0, p.l); g.fillStyle = p.c; g.fillRect(p.x, p.y, 3, 3); }
            g.globalAlpha = 1; for (let i = parts.length - 1; i >= 0; i--) if (parts[i].l <= 0) parts.splice(i, 1);
          };
          draw(0); s.loop(t => { draw(t); });
          const h1 = [line(s, "Trick or treat!", { later: true }), line(s, "We carve a pumpkin lantern.", { later: true })];
          const deH = s.h("p", { class: "small later" }, "Kinder gehen verkleidet von Tür zu Tür. Früher schnitzte man in Irland, Schottland und Nordengland Rüben (turnips) statt Kürbisse.");
          const b1 = [line(s, "Remember, remember, the fifth of November!", { later: true }), line(s, "We watch the fireworks.", { later: true })];
          const deB = s.h("p", { class: "small later" }, "Am 5. November 1605 wurde Guy Fawkes mit Schießpulver unter dem Parlament erwischt. Er und andere wollten König James I. töten. Heute gibt es Feuerwerk und Lagerfeuer.");
          const life = s.h("div", { class: "life later", style: { padding: "10px 18px" } }, s.h("span", { class: "exlabel" }, "Und in Berlin? St. Martin, 11. November"),
            line(s, "On St Martin's Day, children walk with lanterns and sing songs."));
          const card = (lab, pic, rows, de) => s.h("div", { class: "card", style: { padding: "10px 16px", display: "flex", flexDirection: "column", gap: "8px" } }, s.h("span", { class: "exlabel", style: { margin: 0 } }, lab), pic, rows, de);
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "12px" } },
            s.h("div", { class: "cols", style: { gap: "18px" } }, card("31st October – Halloween", pk, h1, deH), card("5th November – Bonfire Night", canvas, b1, deB)), life));
          s.sfx.whoosh();
          s.step(async () => { s.sound("owl", { vol: .6 }); for (const f of face) await s.show(f, "pop", 0); await seq(s, h1, "left", 300, () => s.sfx.pop()); s.show(turnip, "bounce"); await s.show(deH, "fade"); });
          s.step(async () => { running = true; s.sound("fireworks-snd", { vol: .5 }); await seq(s, b1, "left", 300, () => s.sfx.pop()); await s.show(deB, "fade"); s.say("Remember, remember, the fifth of November."); });
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 13b -------------------------------------------------------------- */
      {
        title: "Herbstfeste – in echt",
        say: "So sehen Halloween und Bonfire Night in echt aus. Früher schnitzte man Laternen aus Rüben, heute aus Kürbissen. Und am fünften November brennen Lagerfeuer.",
        build(s) {
          const items = [
            ["pumpkin-lantern", "a pumpkin lantern", "a pumpkin lantern"],
            ["turnip-lantern", "a turnip lantern (Irland)", "a turnip lantern"],
            ["bonfire", "a bonfire with a guy", "a bonfire"],
            ["fireworks", "fireworks", "fireworks"],
          ];
          const figs = items.map(([img, cap, en]) => { const f = s.photo(img, { w: 255, h: 390, caption: cap, cls: "later", pos: img === "bonfire" ? "88% 40%" : "50% 50%" }); f.addEventListener("click", () => { s.sfx.click(); s.speak(en, EN); }); return f; });
          const deH = s.h("div", { class: "card later", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, "31st October"), s.h("p", { class: "small" }, "Die alte Rübenlaterne steht heute im Museum in Irland. Kürbisse kamen später aus Amerika dazu."), s.soundBtn("owl", "Eule in der Nacht", { vol: .6 }));
          const deB = s.h("div", { class: "card later", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, "5th November"), s.h("p", { class: "small" }, "Oben auf dem Feuer sitzt eine Puppe aus alten Kleidern: der ", B(s, "guy"), ". Er steht für Guy Fawkes."), s.h("div", { class: "row", style: { gap: "10px" } }, s.soundBtn("fire", "Feuer", { vol: .5, dur: 5 }), s.soundBtn("fireworks-snd", "Feuerwerk", { vol: .5 })));
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "14px" } }, s.h("div", { class: "cols4", style: { gap: "14px" } }, figs), s.h("div", { class: "cols", style: { gap: "16px" } }, deH, deB)));
          s.step(async () => { s.sound("owl", { vol: .5 }); await s.show(figs[0], "zoom"); await s.show(figs[1], "zoom"); s.show(deH, "up"); s.speak("a pumpkin lantern and a turnip lantern", EN); });
          s.step(async () => { s.sound("fire", { vol: .45, dur: 4, fade: 1 }); await s.show(figs[2], "zoom"); s.sound("fireworks-snd", { vol: .45, when: 1.5 }); await s.show(figs[3], "zoom"); s.show(deB, "up"); s.speak("a bonfire and fireworks", EN); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Christmas: UK and Germany",
        say: "Weihnachten ist in Großbritannien ein bisschen anders als bei uns. Zieh am Christmas cracker!",
        build(s) {
          const svg = s.svg(470, 170);
          const L = s.el("g"), R = s.el("g");
          L.append(s.el("path", { d: "M60 55 l50 30 l-50 30z", fill: "#dc3b2a" }), s.el("rect", { x: 110, y: 62, width: 105, height: 46, fill: "#dc3b2a" }), s.el("rect", { x: 140, y: 62, width: 14, height: 46, fill: "#ffd94a" }));
          R.append(s.el("rect", { x: 215, y: 62, width: 145, height: 46, fill: "#dc3b2a" }), s.el("rect", { x: 300, y: 62, width: 14, height: 46, fill: "#ffd94a" }), s.el("path", { d: "M410 55 l-50 30 l50 30z", fill: "#dc3b2a" }));
          const bang = s.el("text", { class: "later", x: 235, y: 40, "text-anchor": "middle", "font-size": 34, "font-weight": 800, fill: "#ee7a1a", text: "BANG!" });
          const prize = s.el("g", { class: "later" });
          prize.append(s.el("polygon", { points: "190,160 190,128 207,142 225,122 243,142 260,128 260,160", fill: "#ffd94a", stroke: "#c9a400", "stroke-width": 3 }),
            s.el("rect", { x: 270, y: 130, width: 60, height: 30, rx: 4, fill: "#fff", stroke: "#5d6678", "stroke-width": 2 }), s.el("line", { x1: 278, y1: 140, x2: 322, y2: 140, stroke: "#5d6678", "stroke-width": 2 }), s.el("line", { x1: 278, y1: 150, x2: 312, y2: 150, stroke: "#5d6678", "stroke-width": 2 }),
            s.el("circle", { cx: 160, cy: 145, r: 14, fill: "#7b4fd6" }));
          svg.append(L, R, bang, prize);
          const pull = async () => {
            await s.tween({ from: 0, to: 1, dur: 500, ease: "back", update: v => { L.setAttribute("transform", `translate(${-40 * v} 0)`); R.setAttribute("transform", `translate(${40 * v} 0)`); } });
            s.sound("cracker-bang"); s.show(bang, "zoom"); await s.show(prize, "bounce");
          };
          const btn = s.h("button", { class: "btn solid later", onclick: async () => { s.hide([bang, prize]); L.removeAttribute("transform"); R.removeAttribute("transform"); await s.wait(150); pull(); } }, "Pull again!");
          const deC = s.h("p", { class: "small later" }, "Tom Smith aus London hat den Christmas cracker 1847 erfunden. Drin: eine Papierkrone (paper crown), ein Witz (joke) und ein kleines Spielzeug.");
          const pud = s.h("p", { class: "small later" }, "Zum Nachtisch: Christmas pudding mit Trockenfrüchten – oft mit Brandy übergossen und angezündet!");
          const rowsData = [["1st–24th Dec", "Advent calendar (comes from Germany!)", "Advent calendar too"], ["6th Dec", "Nikolaus fills your boots with sweets.", "–"], ["24th Dec", "Presents in the evening", "Christmas Eve"], ["25th Dec", "1. Weihnachtstag", "Presents in the morning (stockings)"], ["26th Dec", "2. Weihnachtstag", "Boxing Day"]];
          const cell = (t, st) => s.h("div", { style: Object.assign({ fontSize: "19px", lineHeight: "1.25", padding: "6px 8px", background: "#fff", borderRadius: "8px" }, st || {}) }, t);
          const head = s.h("div", { style: { display: "grid", gridTemplateColumns: "110px 1fr 1fr", gap: "6px" } }, cell("", { background: "transparent" }), cell("Germany", { fontWeight: 800, background: "#fff6c9" }), cell("the UK", { fontWeight: 800, background: "#e4ecfb" }));
          const trs = rowsData.map(r => s.h("div", { class: "later", style: { display: "grid", gridTemplateColumns: "110px 1fr 1fr", gap: "6px" } }, cell(r[0], { fontWeight: 800, color: "var(--unit)", background: "transparent" }), cell(r[1]), cell(r[2])));
          const sent = line(s, "In the UK, children open their presents on Christmas morning.", { later: true, size: 21 });
          const sent2 = line(s, "Merry Christmas and a happy New Year!", { later: true, size: 21 });
          const lc = [line(s, "Let's pull a cracker!", { later: true }), line(s, "I've got a paper crown!", { later: true })];
          s.add(s.h("div", { class: "cols", style: { gap: "20px", height: "100%", gridTemplateColumns: "1fr 1.05fr" } },
            s.h("div", { class: "card", style: { padding: "12px 18px", display: "flex", flexDirection: "column", gap: "10px" } }, s.h("span", { class: "exlabel", style: { margin: 0 } }, "Christmas crackers"), svg, btn, deC, lc, pud),
            s.h("div", { class: "card soft", style: { padding: "12px 16px", display: "flex", flexDirection: "column", gap: "6px" } }, s.h("span", { class: "exlabel", style: { margin: 0 } }, "Germany – the UK"), head, trs, sent, sent2)));
          s.sfx.whoosh();
          s.step(async () => { await pull(); s.show(btn, "pop"); await s.show(deC, "fade"); await seq(s, lc, "left", 250, () => s.sfx.pop()); s.say("Peng! Drin sind eine Krone, ein Witz und ein kleines Spielzeug."); });
          s.step(async () => { await seq(s, trs, "left", 250, () => s.sfx.pop()); s.show(pud, "fade"); });
          s.step(async () => { s.sfx.ding(); await s.show(sent, "up"); s.sfx.ding(); await s.show(sent2, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Pancake Day: a recipe",
        say: "Am Pancake Day backt man in Großbritannien dünne Pfannkuchen. Ein Rezept benutzt den Imperativ: Mix! Pour! Flip!",
        build(s) {
          const svg = s.svg(470, 300);
          // bowl + whisk
          const whisk = s.el("g"); whisk.append(s.el("line", { x1: 95, y1: 70, x2: 120, y2: 20, stroke: "#5d6678", "stroke-width": 6, "stroke-linecap": "round" }), s.el("ellipse", { cx: 92, cy: 88, rx: 10, ry: 22, fill: "none", stroke: "#5d6678", "stroke-width": 3 }));
          const batter = s.el("ellipse", { cx: 95, cy: 118, rx: 66, ry: 12, fill: "#f6e3a8" });
          svg.append(batter, whisk, s.el("path", { d: "M20 110 h150 q-10 70 -75 70 q-65 0 -75 -70z", fill: "#e4ecfb", stroke: "#1d5bd0", "stroke-width": 4 }));
          // pan
          const heat = s.el("g", { class: "later" }); [270, 310, 350].forEach(x => heat.append(s.el("path", { d: `M${x} 290 q-8 -12 0 -24 q8 -12 0 -24`, fill: "none", stroke: "#dc3b2a", "stroke-width": 4 })));
          svg.append(heat, s.el("ellipse", { cx: 310, cy: 222, rx: 110, ry: 22, fill: "#3b3f4a" }), s.el("rect", { x: 420, y: 214, width: 48, height: 14, rx: 6, fill: "#3b3f4a" }));
          const drop = s.el("ellipse", { class: "later", cx: 310, cy: 150, rx: 10, ry: 14, fill: "#f6e3a8" });
          const pan = s.el("g", { class: "later" });
          const cake = s.el("ellipse", { cx: 310, cy: 218, rx: 90, ry: 15, fill: "#f2c26b", stroke: "#c98c2a", "stroke-width": 3 });
          pan.append(cake); svg.append(drop, pan);
          const lemon = s.el("g", { class: "later" }); lemon.append(s.el("ellipse", { cx: 360, cy: 80, rx: 34, ry: 24, fill: "#ffe14d", stroke: "#c9a400", "stroke-width": 3 }), ...[0, 1, 2].map(i => s.el("circle", { cx: 290 + i * 22, cy: 200 - (i % 2) * 6, r: 4, fill: "#fff" })));
          svg.append(lemon);
          const steps = [["Mix", " the flour, the eggs and the milk."], ["Heat", " a little oil in a pan."], ["Pour", " some batter into the pan."], ["Flip", " the pancake!"], ["Add", " lemon juice and sugar."]].map(([v, rest], i) =>
            s.h("div", { class: "ek-line later" }, s.h("span", { class: "ek-av", style: { background: "var(--unit)", width: "40px", height: "40px", fontSize: "20px" } }, String(i + 1)),
              s.h("p", { class: "ek-en", style: { fontSize: "22px", flex: 1 } }, HL(s, v), rest), hear(s, v + rest)));
          const flipAgain = s.h("button", { class: "btn later", onclick: () => flip() }, "Flip!");
          const flip = async () => {
            s.sfx.boing();
            await s.tween({ from: 0, to: 1, dur: 900, ease: "linear", update: v => { const y = -150 * 4 * v * (1 - v), k = Math.cos(v * Math.PI * 2); cake.setAttribute("transform", `translate(0 ${y}) translate(310 218) scale(1 ${k.toFixed(3)}) translate(-310 -218)`); cake.setAttribute("fill", v > .5 ? "#e0a54a" : "#f2c26b"); } });
            cake.removeAttribute("transform"); s.sfx.snap();
          };
          const life = s.h("div", { class: "life", style: { padding: "10px 16px", display: "grid", gridTemplateColumns: "1fr 190px", gap: "12px", alignItems: "center" } }, s.h("div", null, s.h("span", { class: "exlabel" }, "Pancake Day = Shrove Tuesday"),
            s.h("p", { class: "small" }, "Der Dienstag vor Aschermittwoch – 2027 ist es der 9. Februar. In Olney (England) gibt es ein Wettrennen: Man rennt mit der Pfanne und wirft den Pancake hoch.")),
            s.photo("pancake-race", { w: 190, h: 260, caption: "Olney", pos: "45% 50%" }));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Imperativ = Grundform: ", B(s, "Mix! Pour! Flip!"), " Verneint: ", B(s, "Don't"), " + Grundform: Don't burn the pancake!");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "470px 1fr", gap: "22px", height: "100%" } },
            s.h("div", { class: "stack", style: { gap: "12px" } }, svg, life),
            s.h("div", { class: "stack", style: { gap: "10px" } },
              s.h("div", { class: "card", style: { padding: "10px 16px" } },
                s.h("div", { class: "ek-line", style: { justifyContent: "space-between" } }, s.h("span", { class: "exlabel", style: { margin: 0 } }, "Recipe: pancakes"), flipAgain),
                s.h("p", { class: "small", style: { margin: "4px 0 8px" } }, s.h("b", null, "You need: "), "100 g plain flour · 2 eggs · 300 ml milk · a little oil"),
                s.h("div", { class: "stack", style: { gap: "6px" } }, steps)),
              merk)));
          s.sfx.whoosh();
          s.step(async () => { s.sfx.pop(); s.show(steps[0], "left"); s.sfx.scribble(); await s.tween({ from: 0, to: 1, dur: 1200, ease: "linear", update: v => whisk.setAttribute("transform", `translate(${Math.sin(v * Math.PI * 8) * 22} 0)`) }); });
          s.step(async () => { s.sfx.pop(); s.show(steps[1], "left"); await s.show(heat, "up"); s.sfx.pop(); s.show(steps[2], "left"); await s.show(drop, "down"); s.sound("sizzle", { vol: .5, dur: 3, fade: .8 }); s.hide(drop); await s.show(pan, "zoom"); });
          s.step(async () => { s.sfx.pop(); s.show(steps[3], "left"); await flip(); s.show(flipAgain, "pop"); });
          s.step(async () => { s.sfx.pop(); s.show(steps[4], "left"); await s.show(lemon, "bounce"); s.sfx.success(); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Im Alltag: a party invitation",
        say: "Ruby lädt Lukas zu ihrer Geburtstagsparty ein. So sieht eine Einladung auf Englisch aus.",
        build(s) {
          const balloons = s.svg(520, 70);
          [["#dc3b2a", 40], ["#ffd94a", 100], ["#1d5bd0", 420], ["#a21caf", 480]].forEach(([c, x], i) => balloons.append(s.el("ellipse", { cx: x, cy: 28, rx: 20, ry: 25, fill: c, class: "a-wiggle", style: { animationDelay: i * 200 + "ms" } }), s.el("path", { d: `M${x} 53 q6 8 0 16`, stroke: "#5d6678", fill: "none", "stroke-width": 2 })));
          const lbl = t => s.h("b", { style: { color: "var(--unit)", width: "90px", display: "inline-block", flex: "none" } }, t);
          const r = (a, b) => s.h("p", { class: "ek-en later", style: { fontSize: "23px", display: "flex", gap: "6px" } }, lbl(a), s.h("span", null, b));
          const rows = [r("When:", "Saturday, 14th November, 3–6 pm"), r("Where:", "72 Rose Street, London"), r("What:", "pizza, games and a big cake!"), r("Reply:", "Please tell me by 7th November.")];
          const all = "You're invited! Come to Ruby's 12th birthday party! When: Saturday, the fourteenth of November, from three to six p m. Where: 72 Rose Street, London. What: pizza, games and a big cake! Please tell me by the seventh of November.";
          const inv = s.h("div", { class: "card", style: { border: "4px dashed var(--unit)", padding: "12px 22px", display: "flex", flexDirection: "column", gap: "8px", alignItems: "stretch" } },
            balloons, s.h("p", { class: "big", style: { color: "var(--unit)", textAlign: "center" } }, "You're invited!"),
            s.h("p", { class: "ek-en", style: { fontSize: "24px", textAlign: "center" } }, "Come to Ruby's 12th birthday party!"), rows,
            s.h("div", { style: { display: "flex", justifyContent: "center", marginTop: "4px" } }, hear(s, all, "Ganze Einladung anhören")));
          const ph = [["Happy birthday, Ruby!"], ["Thank you for the invitation."], ["I'd love to come!"], ["Sorry, I can't come."], ["How old are you? – I'm twelve.", "How old are you? I'm twelve."]].map(([t, sp]) => line(s, t, { speak: sp, later: true, size: 21 }));
          const right = s.h("div", { class: "card soft", style: { padding: "12px 18px" } }, s.h("span", { class: "exlabel" }, "Useful phrases – nützliche Sätze"), s.h("div", { class: "stack", style: { gap: "10px" } }, ph));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "22px", height: "100%", alignItems: "center" } }, inv, right));
          s.sound("cracker-bang", { vol: .7 }); s.sfx.fanfare(); s.show(inv, "zoom");
          s.step(async () => { await seq(s, rows.slice(0, 2), "left", 350, () => s.sfx.pop()); s.say("Wann und wo ist die Party?"); });
          s.step(async () => { await seq(s, rows.slice(2), "left", 350, () => s.sfx.pop()); });
          s.step(async () => { await seq(s, ph, "up", 250, () => s.sfx.pop()); s.confetti(590, 300, 80); s.sound("kids-cheer", { vol: .5, dur: 3, fade: .6 }); });
        },
      },
    ],
  });
})();
