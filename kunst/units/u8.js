/* Kapitel 8 – Bilder betrachten und Kunst entdecken (Kunst 5/6, Berlin RLP) */
(() => {
  const UC = "#0e7490", INK = "#1b2740", RED = "#dc3b2a", BLUE = "#1d5bd0", GREEN = "#138a5a", OCK = "#d9a21b";
  const cols2 = (s, l, r, lw = 560, gap = 28) => s.h("div", { class: "cols", style: { gridTemplateColumns: lw + "px 1fr", alignItems: "center", height: "100%", gap: gap + "px" } }, l, r);
  const P = (s, html, cls = "t", later = false) => s.h("p", { class: cls + (later ? " later" : ""), html });
  const box = (s, cls, label, html, later = true) => s.h("div", { class: cls + (later ? " later" : "") }, label ? s.h("span", { class: "exlabel" }, label) : null, s.h("p", { class: "small", html }));
  const merk = (s, html, later = true) => s.h("div", { class: "merk" + (later ? " later" : ""), html });
  const stack = (s, gap, ...k) => s.h("div", { class: "stack", style: { gap: gap + "px" } }, ...k);
  const fx = (s, n = "pop") => { try { s.sfx[n](); } catch (e) {} };
  const reveal = (s, els, kind = "pop", snd = "pop", delay = 0) => { fx(s, snd); return s.show(els, kind, delay); };
  const rng = seed => () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  let UID = 0;
  const pill = (s, text, onclick, extra = {}) => { const b = s.h("button", { style: Object.assign({ minHeight: "52px", padding: "0 18px", border: "2px solid " + UC, borderRadius: "14px", background: "#fff", color: UC, font: "700 19px var(--f-display)", cursor: "pointer" }, extra), onclick }, text); b.setOn = on => { b.style.background = on ? UC : "#fff"; b.style.color = on ? "#fff" : UC; }; return b; };

  /* ---------- own homages (all drawn by me, 480x340) ---------- */
  const spiral = (cx, cy, turns, rmax, a0 = 0) => { let d = ""; const n = 60 * turns; for (let i = 0; i <= n; i++) { const t = i / n, a = a0 + t * turns * 6.283, r = rmax * t; d += (i ? " L" : "M") + (cx + Math.cos(a) * r * 1.25).toFixed(1) + "," + (cy + Math.sin(a) * r * .8).toFixed(1); } return d; };
  function skyPic(s, hide) {
    const E = (t, a) => s.el(t, Object.assign(hide ? { class: "later" } : {}, a));
    const svg = s.svg(480, 340); const L = {};
    L.bg = E("rect", { x: 0, y: 0, width: 480, height: 340, fill: "#1a2c63" });
    L.swirls = [[170, 120, 2.2, 70, 0, "#6fa8e0", 8], [330, 90, 1.8, 60, 2, "#9cc7f0", 6], [250, 190, 2, 55, 4, "#4c7fc4", 8], [90, 60, 1.2, 40, 1, "#7fb2e5", 5]].map(([x, y, tu, r, a, c, w]) => E("path", { d: spiral(x, y, tu, r, a), fill: "none", stroke: c, "stroke-width": w, "stroke-linecap": "round", opacity: .9 }));
    L.stars = [[90, 100], [175, 50], [265, 110], [345, 55], [415, 130], [215, 175]].map(([x, y]) => { const g = E("g", {}); g.append(s.el("circle", { cx: x, cy: y, r: 22, fill: "none", stroke: "#f5c542", "stroke-width": 3, opacity: .45 }), s.el("circle", { cx: x, cy: y, r: 14, fill: "none", stroke: "#ffe15a", "stroke-width": 3, opacity: .7 }), s.el("circle", { cx: x, cy: y, r: 8, fill: "#ffe15a" })); return g; });
    L.moon = E("g", {}); L.moon.append(s.el("circle", { cx: 440, cy: 50, r: 28, fill: "#ffe98a" }), s.el("circle", { cx: 450, cy: 42, r: 24, fill: "#1a2c63" }));
    L.tree = E("g", {}); L.tree.append(s.el("path", { d: "M70,340 C26,262 44,160 70,64 C96,160 112,262 90,340 Z", fill: "#0d2b25", stroke: "#08140f", "stroke-width": 3 }), s.el("path", { d: "M70,320 C56,250 62,170 70,100 M80,330 C88,250 84,180 74,120", fill: "none", stroke: "#2f7a5c", "stroke-width": 4, "stroke-linecap": "round" }));
    L.town = E("g", {}); L.town.append(s.el("path", { d: "M0,300 Q120,262 240,290 T480,282 L480,340 L0,340 Z", fill: "#15284f" }));
    [[160, 300, 34, 28], [208, 306, 28, 24], [250, 296, 36, 32], [300, 304, 30, 26], [350, 292, 34, 30], [398, 298, 30, 28]].forEach(([x, y, w, h]) => L.town.append(s.el("rect", { x, y, width: w, height: h, fill: "#0e1c3d" }), s.el("rect", { x: x + w / 2 - 4, y: y + 8, width: 8, height: 9, fill: "#ffd54a" })));
    L.town.append(s.el("path", { d: "M272,296 L282,246 L292,296 Z", fill: "#0e1c3d" }));
    svg.append(L.bg, ...L.swirls, ...L.stars, L.moon, L.tree, L.town);
    return { svg, L };
  }
  function liliesPic(s, hide) {
    const E = (t, a) => s.el(t, Object.assign(hide ? { class: "later" } : {}, a));
    const svg = s.svg(480, 340); const L = {}; const r = rng(7);
    L.bg = E("rect", { x: 0, y: 0, width: 480, height: 340, fill: "#78b0c4" });
    const pal = ["#4f86b8", "#8fb9d8", "#6aa38c", "#a9c9a0", "#b79ad0", "#d8ecf0"];
    L.dabs = E("g", {}); for (let i = 0; i < 150; i++) { const x = r() * 470, y = r() * 330, w = 18 + r() * 34; L.dabs.append(s.el("line", { x1: x, y1: y, x2: x + w, y2: y + (r() - .5) * 4, stroke: pal[Math.floor(r() * pal.length)], "stroke-width": 6 + r() * 4, "stroke-linecap": "round", opacity: .8 })); }
    L.pads = [[110, 230], [220, 170], [340, 250], [400, 140], [170, 290], [300, 100], [60, 120]].map(([x, y]) => { const g = E("g", {}); g.append(s.el("ellipse", { cx: x, cy: y, rx: 42, ry: 17, fill: "#3f7d52", stroke: "#2c5c3b", "stroke-width": 3 }), s.el("ellipse", { cx: x + 6, cy: y - 3, rx: 24, ry: 8, fill: "#5aa26b", opacity: .7 })); return g; });
    L.flowers = [[130, 222], [350, 244], [225, 163], [410, 134], [180, 284]].map(([x, y]) => { const g = E("g", {}); for (let k = 0; k < 6; k++) g.append(s.el("ellipse", { cx: x + Math.cos(k) * 9, cy: y + Math.sin(k) * 5, rx: 9, ry: 5, fill: "#f3a3c4", stroke: "#d4739d", "stroke-width": 1.5 })); g.append(s.el("circle", { cx: x, cy: y, r: 4, fill: "#ffe15a" })); return g; });
    svg.append(L.bg, L.dabs, ...L.pads, ...L.flowers);
    return { svg, L };
  }
  function harePic(s, hide) {
    const E = (t, a) => s.el(t, Object.assign(hide ? { class: "later" } : {}, a));
    const svg = s.svg(480, 340); const L = {}; const r = rng(11); const id = "hc" + (++UID);
    L.bg = E("rect", { x: 0, y: 0, width: 480, height: 340, fill: "#f2e8d0" });
    L.shadow = E("ellipse", { cx: 235, cy: 300, rx: 170, ry: 14, fill: "rgba(90,70,40,.28)" });
    const fur = "#a98353";
    L.body = E("g", {}); L.body.append(s.el("ellipse", { cx: 215, cy: 215, rx: 115, ry: 78, fill: fur, stroke: "#5e4326", "stroke-width": 3 }), s.el("ellipse", { cx: 165, cy: 232, rx: 58, ry: 56, fill: "#b58e5c", stroke: "#5e4326", "stroke-width": 3 }), s.el("ellipse", { cx: 310, cy: 268, rx: 15, ry: 36, fill: "#a98353", stroke: "#5e4326", "stroke-width": 3 }), s.el("circle", { cx: 100, cy: 205, r: 15, fill: "#f4efe4", stroke: "#5e4326", "stroke-width": 3 }));
    L.ears = E("g", {}); L.ears.append(s.el("ellipse", { cx: 330, cy: 92, rx: 15, ry: 58, fill: "#a98353", stroke: "#5e4326", "stroke-width": 3, transform: "rotate(-12 330 92)" }), s.el("ellipse", { cx: 366, cy: 98, rx: 14, ry: 54, fill: "#a98353", stroke: "#5e4326", "stroke-width": 3, transform: "rotate(10 366 98)" }), s.el("ellipse", { cx: 331, cy: 96, rx: 6, ry: 40, fill: "#d9a89a", transform: "rotate(-12 331 96)" }));
    L.head = E("g", {}); L.head.append(s.el("ellipse", { cx: 340, cy: 172, rx: 54, ry: 44, fill: "#b58e5c", stroke: "#5e4326", "stroke-width": 3 }), s.el("ellipse", { cx: 388, cy: 184, rx: 10, ry: 7, fill: "#d98a93", stroke: "#5e4326", "stroke-width": 2 }));
    L.fur = E("g", {}); const cp = s.el("clipPath", { id }, s.el("ellipse", { cx: 215, cy: 215, rx: 114, ry: 77 }), s.el("ellipse", { cx: 340, cy: 172, rx: 53, ry: 43 }), s.el("ellipse", { cx: 165, cy: 232, rx: 57, ry: 55 }));
    svg.append(s.el("defs", {}, cp)); L.fur.setAttribute("clip-path", `url(#${id})`);
    const fc = ["#7a5a34", "#9b7a4b", "#5e4326", "#c8a672", "#d6b98a"];
    for (let i = 0; i < 300; i++) { const x = 80 + r() * 330, y = 100 + r() * 190, l = 8 + r() * 10; L.fur.append(s.el("line", { x1: x, y1: y, x2: x - l, y2: y + l * .4, stroke: fc[Math.floor(r() * fc.length)], "stroke-width": 1.6, "stroke-linecap": "round", opacity: .75 })); }
    L.eye = E("g", {}); L.eye.append(s.el("circle", { cx: 358, cy: 160, r: 9, fill: "#3b2a1a", stroke: "#1a120a", "stroke-width": 2 }), s.el("circle", { cx: 361, cy: 157, r: 3, fill: "#fff" }));
    L.whisk = E("g", {}); [[-6, -2], [0, 6], [6, 14]].forEach(([a, b]) => L.whisk.append(s.el("path", { d: `M388,${184 + a} Q430,${176 + b} 462,${172 + b * 1.6}`, fill: "none", stroke: "#5e4326", "stroke-width": 1.8 })));
    svg.append(L.bg, L.shadow, L.body, L.ears, L.head, L.fur, L.eye, L.whisk);
    return { svg, L };
  }
  const sized = (v, w) => { v.style.width = w + "px"; v.style.height = Math.round(w * 340 / 480) + "px"; v.style.display = "block"; v.style.borderRadius = "12px"; v.style.border = "3px solid " + INK; return v; };
  const pin = (s, svg, n, x, y) => { const g = s.el("g", { class: "later" }); g.append(s.el("circle", { cx: x, cy: y, r: 17, fill: RED, stroke: "#fff", "stroke-width": 3 }), s.el("text", { x, y: y + 8, "text-anchor": "middle", "font-size": 22, "font-weight": 800, fill: "#fff", text: String(n) })); svg.append(g); return g; };

  /* ---------- own landscape scene (640x440) ---------- */
  function landscape(s) {
    const E = (tag, a) => s.el(tag, a); const svg = s.svg(640, 440);
    svg.append(E("rect", { x: 0, y: 0, width: 640, height: 440, fill: "#bfe4f5" }), E("circle", { cx: 95, cy: 75, r: 34, fill: "#ffd54a" }),
      E("path", { d: "M520,82 q13,-16 26,0 q13,-16 26,0", fill: "none", stroke: INK, "stroke-width": 4, "stroke-linecap": "round" }),
      E("path", { d: "M0,235 L90,130 L170,200 L270,110 L380,210 L470,140 L560,205 L640,160 L640,235 Z", fill: "#7f98b5" }),
      E("path", { d: "M270,110 L248,136 L262,130 L270,142 L282,130 L292,138 Z M90,130 L74,152 L90,146 L104,154 Z", fill: "#fff" }),
      E("rect", { x: 0, y: 225, width: 640, height: 120, fill: "#8fd085" }), E("rect", { x: 70, y: 248, width: 500, height: 90, rx: 30, fill: "#6ab7e0" }),
      E("path", { d: "M262,292 Q320,322 378,292 L366,282 L274,282 Z", fill: "#8a5a2b", stroke: INK, "stroke-width": 3, "stroke-linejoin": "round" }), E("path", { d: "M320,280 L320,236 L362,280 Z", fill: "#fff", stroke: INK, "stroke-width": 3, "stroke-linejoin": "round" }),
      E("rect", { x: 480, y: 225, width: 56, height: 40, fill: "#e8c9a0", stroke: INK, "stroke-width": 3 }), E("path", { d: "M472,225 L508,192 L544,225 Z", fill: "#c0523a", stroke: INK, "stroke-width": 3, "stroke-linejoin": "round" }),
      E("rect", { x: 0, y: 340, width: 640, height: 100, fill: "#4fa35a" }), E("rect", { x: 104, y: 250, width: 32, height: 124, fill: "#7a4f2a", stroke: INK, "stroke-width": 3 }), E("circle", { cx: 120, cy: 232, r: 70, fill: "#2f8f4a", stroke: INK, "stroke-width": 3 }));
    [[470, 395, "#f3a3c4"], [520, 415, "#ffd54a"], [570, 390, "#fff"], [545, 372, "#f3a3c4"], [495, 365, "#ffd54a"]].forEach(([x, y, c]) => svg.append(E("line", { x1: x, y1: y, x2: x, y2: y + 24, stroke: "#2f7a3f", "stroke-width": 4 }), E("circle", { cx: x, cy: y, r: 11, fill: c, stroke: INK, "stroke-width": 2.5 })));
    return svg;
  }
  /* ---------- tiny drawings for cards (150x100) ---------- */
  function mini(s, kind, bg) {
    const E = (tag, a) => s.el(tag, a); const v = s.svg(150, 100); v.append(E("rect", { x: 0, y: 0, width: 150, height: 100, fill: bg }));
    const st = { stroke: INK, "stroke-width": 2.5, "stroke-linejoin": "round" };
    if (kind === "face") v.append(E("path", Object.assign({ d: "M30,100 Q75,60 120,100 Z", fill: "#4c7fc4" }, st)), E("circle", Object.assign({ cx: 75, cy: 48, r: 28, fill: "#f2c9a0" }, st)), E("path", Object.assign({ d: "M46,44 Q50,16 76,18 Q102,16 104,44 Q90,30 76,32 Q60,30 46,44 Z", fill: "#5a3a22" }, st)), E("circle", { cx: 65, cy: 50, r: 3.5, fill: INK }), E("circle", { cx: 86, cy: 50, r: 3.5, fill: INK }), E("path", { d: "M64,62 Q75,72 87,62", fill: "none", stroke: INK, "stroke-width": 2.5, "stroke-linecap": "round" }));
    if (kind === "land" || kind === "lake") v.append(E("circle", { cx: 120, cy: 22, r: 12, fill: "#ffd54a" }), E("path", Object.assign({ d: "M0,70 L40,32 L70,58 L100,30 L150,70 Z", fill: "#7f98b5" }, st)), E("rect", { x: 0, y: 66, width: 150, height: 34, fill: kind === "lake" ? "#6ab7e0" : "#7cc27a" }), E("path", { d: "M0,82 Q40,72 80,84 T150,80", fill: "none", stroke: "#fff", "stroke-width": 2.5, opacity: .7 }));
    if (kind === "beach") v.append(E("circle", { cx: 30, cy: 24, r: 13, fill: "#ffd54a" }), E("rect", { x: 0, y: 40, width: 150, height: 30, fill: "#6ab7e0" }), E("path", { d: "M0,56 Q20,48 40,56 T80,56 T120,56 T150,54", fill: "none", stroke: "#fff", "stroke-width": 2.5 }), E("path", { d: "M0,70 Q75,60 150,72 L150,100 L0,100 Z", fill: "#f0d49b" }), E("path", Object.assign({ d: "M112,86 L112,56 M112,56 q-22,-4 -26,10 M112,56 q22,-4 26,10 M112,56 q-6,-16 -22,-14 M112,56 q6,-16 22,-14", fill: "none" }, st)));
    if (kind === "still" || kind === "pears") v.append(E("rect", { x: 0, y: 70, width: 150, height: 30, fill: "#b9855a" }), E("circle", Object.assign({ cx: 48, cy: 62, r: 20, fill: "#d6332a" }, st)), E("path", { d: "M48,42 q2,-10 8,-12", fill: "none", stroke: "#4b2e12", "stroke-width": 3 }), E("path", Object.assign({ d: "M96,34 C116,34 124,64 128,80 C118,92 78,92 70,80 C76,64 86,34 96,34 Z", fill: "#a9c94a" }, st)));
    if (kind === "vase") v.append(E("rect", { x: 0, y: 78, width: 150, height: 22, fill: "#b9855a" }), E("path", Object.assign({ d: "M60,48 L90,48 L96,80 L54,80 Z", fill: "#7aa6d6" }, st)), ...[[75, 16, "#ee5b8c"], [52, 28, "#ffd54a"], [98, 26, "#ee5b8c"]].flatMap(([x, y, c]) => [E("line", { x1: 75, y1: 50, x2: x, y2: y, stroke: "#2f7a3f", "stroke-width": 3 }), E("circle", Object.assign({ cx: x, cy: y, r: 10, fill: c }, st))]));
    if (kind === "abs") v.append(E("circle", Object.assign({ cx: 40, cy: 36, r: 24, fill: "#f2c800" }, st)), E("rect", Object.assign({ x: 70, y: 46, width: 56, height: 36, fill: "#1d4aa8" }, st)), E("path", Object.assign({ d: "M96,10 L124,40 L68,40 Z", fill: "#d4202a" }, st)), E("path", { d: "M10,86 Q50,60 90,92 T146,70", fill: "none", stroke: INK, "stroke-width": 4, "stroke-linecap": "round" }));
    return v;
  }

  Deck.unit({
    id: "u8", num: 8, title: "Bilder betrachten und Kunst entdecken", color: UC, soft: "#dff3f7",
    subtitle: "Genau hinschauen, Wörter finden, selbst ausstellen",
    blurb: "Bildbetrachtung, Bildsprache, Gattungen, Berliner Kunst, Galerie",
    goals: ["Ein Bild in 5 Schritten betrachten", "Bildsprache-Wörter benutzen: Vordergrund, Bildmitte, links oben", "Porträt, Landschaft, Stillleben und Abstrakt unterscheiden", "Kunst in Berlin entdecken und eigene Bilder ausstellen"],
    icon(svg, el) {
      svg.append(el("rect", { x: 10, y: 14, width: 50, height: 40, rx: 4, fill: "#fff", stroke: UC, "stroke-width": 4 }), el("circle", { cx: 26, cy: 30, r: 6, fill: UC, opacity: .5 }), el("path", { d: "M14,50 L30,34 L42,44 L50,36 L58,48", fill: "none", stroke: UC, "stroke-width": 3, "stroke-linejoin": "round" }));
    },
    slides: [
      /* 1 ---- Fünf Schritte */
      {
        title: "Ein Bild in 5 Schritten",
        say: "Wenn du ein Bild genau anschauen willst, hilft dir diese Treppe mit fünf Schritten.",
        build(s) {
          const names = ["Erster Eindruck", "Beschreiben", "Untersuchen", "Deuten", "Bewerten"];
          const qs = ["Was fühle ich beim ersten Blick?", "Was sehe ich genau?", "Wie ist das Bild gemacht?", "Was könnte es bedeuten?", "Was gefällt mir, und warum?"];
          const cs = ["#0e7490", "#1d5bd0", "#7b4fd6", "#ee7a1a", "#138a5a"];
          const svg = s.svg(440, 430);
          const blocks = names.map((n, i) => { const h = 70 + i * 70, x = 6 + i * 85; const g = s.el("g", { class: "later" }); g.append(s.el("rect", { x, y: 420 - h, width: 82, height: h, rx: 8, fill: cs[i], stroke: INK, "stroke-width": 3 }), s.el("text", { x: x + 41, y: 420 - h + 44, "text-anchor": "middle", "font-size": 34, "font-weight": 800, fill: "#fff", text: String(i + 1) })); return g; });
          svg.append(s.el("line", { x1: 0, y1: 421, x2: 440, y2: 421, stroke: "#9a8a6a", "stroke-width": 4 }), ...blocks);
          const cards = names.map((n, i) => s.h("div", { class: "card later", style: { padding: "8px 16px", borderLeft: `10px solid ${cs[i]}` } }, s.h("p", { class: "t", html: `<b>${i + 1}. ${n}</b>` }), s.h("p", { class: "small", html: qs[i] })));
          const life = box(s, "life", "Im Alltag", "Im Museum, bei einem Plakat an der Haltestelle oder bei einem Buchcover: Du kannst überall die 5 Schritte nutzen.");
          s.add(cols2(s, svg, stack(s, 9, ...cards, life), 440));
          names.forEach((n, i) => s.step(async () => { s.sfx.note(i * 2, .25); s.show(blocks[i], "up"); await s.show(cards[i], "left"); if (i === 0) s.say("Zuerst der erste Eindruck. Dann beschreiben, untersuchen, deuten und bewerten."); }));
          s.step(async () => { await reveal(s, life, "up", "success"); });
        },
      },
      /* 2 ---- drei Bilder */
      {
        title: "Drei Bilder zum Üben",
        say: "Diese drei Bilder habe ich selbst gezeichnet, im Stil von berühmten Künstlern. Damit üben wir.",
        build(s) {
          const a = skyPic(s, true), b = liliesPic(s, true), c = harePic(s, true);
          const mk = (p, title, sub) => s.h("div", { class: "card", style: { padding: "10px", display: "flex", flexDirection: "column", gap: "6px" } }, sized(p.svg, 322), P(s, `<b>${title}</b>`, "t"), P(s, sub, "small"));
          const k1 = mk(a, "Nachthimmel", "Eigene Zeichnung im Stil von Vincent van Gogh (1853–1890)"), k2 = mk(b, "Seerosen", "Eigene Zeichnung im Stil von Claude Monet (gestorben 1926)"), k3 = mk(c, "Feldhase", "Eigene Zeichnung im Stil von Albrecht Dürer (gestorben 1528)");
          const m = merk(s, "Das sind <b>meine eigenen Zeichnungen</b>, eine Verbeugung vor den Künstlern. Die Originale hängen in Museen, zum Beispiel van Goghs „Sternennacht“ (1889) in New York und Dürers „Feldhase“ (1502) in Wien.");
          s.add(stack(s, 14, s.h("div", { class: "cols3" }, k1, k2, k3), m));
          s.step(async () => { s.sfx.whoosh(); s.show(a.L.bg, "fade"); await s.show(a.L.swirls, "draw"); s.show(a.L.stars, "pop"); s.show([a.L.moon, a.L.tree, a.L.town], "up"); await s.wait(600); });
          s.step(async () => { s.sfx.scribble(); s.show([b.L.bg, b.L.dabs], "fade"); await s.show(b.L.pads, "pop"); await s.show(b.L.flowers, "pop"); });
          s.step(async () => { s.sfx.scribble(); s.show([c.L.bg, c.L.shadow, c.L.body, c.L.ears, c.L.head], "up"); await s.show([c.L.fur, c.L.eye, c.L.whisk], "fade", 400); s.sfx.ding(); });
          s.step(async () => { await reveal(s, m, "up", "success"); });
        },
      },
      /* 3 ---- Erster Eindruck + Beschreiben */
      {
        title: "Erster Eindruck und Beschreiben",
        say: "Schau das Bild an. Was fühlst du? Und danach: Was siehst du genau?",
        build(s) {
          const p = skyPic(s, false); const svg = p.svg; sized(svg, 560);
          const wrap = s.h("div", { style: { position: "relative", width: "560px" } }, svg);
          const pins = [[1, 440, 50], [2, 175, 50], [3, 70, 150], [4, 300, 300], [5, 150, 120]].map(([n, x, y]) => pin(s, svg, n, x, y));
          const feel = ["geheimnisvoll", "unruhig", "kalt", "friedlich", "schön"];
          const chips = feel.map(f => { const b = pill(s, f, () => { b.on = !b.on; b.setOn(b.on); fx(s, "pop"); }); return b; });
          const row = s.h("div", { class: "later", style: { display: "flex", flexWrap: "wrap", gap: "10px" } }, ...chips);
          const t1 = s.h("div", { class: "later" }, P(s, "<b>1. Erster Eindruck:</b> Wie wirkt das Bild auf dich? Tippe die Wörter, die passen.", "t"));
          const items = ["der Mond", "viele Sterne mit Strahlenringen", "ein dunkler, hoher Baum", "kleine Häuser mit gelben Fenstern", "blaue Wirbel am Himmel"];
          const list = items.map((t, i) => s.h("div", { class: "later row", style: { gap: "10px", flexWrap: "nowrap" } }, s.h("span", { style: { width: "30px", height: "30px", borderRadius: "50%", background: RED, color: "#fff", fontWeight: 800, display: "grid", placeItems: "center", flex: "none", fontSize: "19px" } }, String(i + 1)), s.h("span", { class: "t", style: { fontSize: "21px" } }, t)));
          const t2 = s.h("div", { class: "later" }, P(s, "<b>2. Beschreiben:</b> Ich sehe …", "t"));
          s.add(cols2(s, s.h("div", { class: "stack", style: { gap: "6px", alignItems: "center" } }, wrap, P(s, "Eigene Zeichnung im Stil von Vincent van Gogh", "small")), stack(s, 10, t1, row, t2, ...list), 560));
          s.step(async () => { s.show(t1, "up"); s.sfx.whoosh(); await s.show(row, "up", 200); s.say("Tippe auf Wörter, die zu deinem ersten Eindruck passen."); });
          s.step(async () => { s.show(t2, "up"); s.sfx.whoosh(); for (let i = 0; i < 5; i++) { s.sfx.note(i * 2, .15); s.show(list[i], "left"); await s.show(pins[[0, 1, 2, 3, 4][i]], "pop"); } });
        },
      },
      /* 4 ---- Untersuchen */
      {
        title: "Untersuchen: Wie ist es gemacht?",
        say: "Jetzt gehen wir ins Detail. Farben, Pinselstriche und Aufbau verraten viel.",
        build(s) {
          const p = liliesPic(s, false); const svg = p.svg; sized(svg, 560);
          const ring = s.el("ellipse", { cx: 150, cy: 250, rx: 70, ry: 48, fill: "none", stroke: RED, "stroke-width": 5, "stroke-dasharray": "10 8", class: "later" });
          const frame = s.el("rect", { x: 280, y: 80, width: 170, height: 190, rx: 10, fill: "none", stroke: UC, "stroke-width": 5, "stroke-dasharray": "10 8", class: "later" });
          svg.append(ring, frame);
          const sw = [["#4f86b8", "Blau"], ["#b79ad0", "Violett"], ["#6aa38c", "Grün"], ["#f3a3c4", "Rosa"]].map(([c, n]) => s.h("div", { class: "later row", style: { gap: "8px", flexWrap: "nowrap" } }, s.h("span", { style: { width: "34px", height: "34px", borderRadius: "50%", background: c, border: "2px solid " + INK, flex: "none" } }), s.h("span", { class: "t", style: { fontSize: "21px" } }, n)));
          const c1 = s.h("div", { class: "card later", style: { padding: "10px 16px" } }, P(s, "<b>Farben:</b> kühle, helle Töne. Kaum Schwarz.", "t"), s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 18px", marginTop: "8px" } }, ...sw));
          const c2 = s.h("div", { class: "card later", style: { padding: "10px 16px" } }, P(s, "<b>Pinselstriche:</b> kurz und tupfig. Aus der Nähe siehst du Striche, aus der Ferne Wasser.", "t"));
          const c3 = s.h("div", { class: "card later", style: { padding: "10px 16px" } }, P(s, "<b>Aufbau:</b> kein Horizont. Wir schauen von oben auf den Teich. Die Blätter verteilen sich über das ganze Bild.", "t"));
          const m = merk(s, "Monet malte seine Seerosen in seinem Garten in Giverny. Mit der Zeit löste er das Motiv immer mehr in Farbflecken auf.");
          s.add(cols2(s, s.h("div", { class: "stack", style: { gap: "6px", alignItems: "center" } }, svg, P(s, "Eigene Zeichnung im Stil von Claude Monet", "small")), stack(s, 10, P(s, "<b>3. Untersuchen:</b>", "t"), c1, c2, c3, m), 560));
          s.step(async () => { await reveal(s, c1, "left", "pop"); await reveal(s, sw, "pop", "tick"); });
          s.step(async () => { s.show(c2, "left"); s.sfx.scribble(); await s.show(ring, "draw"); });
          s.step(async () => { s.show(c3, "left"); s.sfx.swoosh(); await s.show(frame, "draw"); });
          s.step(async () => { await reveal(s, m, "up", "success"); });
        },
      },
      /* 5 ---- Deuten und Bewerten */
      {
        title: "Deuten und Bewerten",
        say: "Jetzt darfst du deine Gedanken sagen. Baue dir Sätze aus den Bausteinen.",
        build(s) {
          const p = harePic(s, false); sized(p.svg, 430);
          const mkBuilder = (head, pre, mid, optsA, optsB) => {
            let a = "…", b = "…";
            const sent = s.h("p", { class: "t", style: { fontWeight: 700, fontSize: "22px", minHeight: "34px" } });
            const upd = () => { sent.innerHTML = `${pre} <span class="hl">${a}</span>${mid} <span class="hl">${b}</span>.`; };
            const rowOf = (opts, set) => { const bs = opts.map(o => { const bt = pill(s, o, () => { bs.forEach(x => x.setOn(false)); bt.setOn(true); set(o); upd(); fx(s, "pop"); }, { minHeight: "48px", padding: "0 12px", font: "700 19px var(--f-display)" }); return bt; }); return s.h("div", { style: { display: "flex", flexWrap: "wrap", gap: "8px" } }, ...bs); };
            upd();
            return s.h("div", { class: "card later", style: { padding: "10px 16px", display: "flex", flexDirection: "column", gap: "8px" } }, P(s, `<b>${head}</b>`, "t"), sent, rowOf(optsA, v => { a = v; }), rowOf(optsB, v => { b = v; }));
          };
          const b1 = mkBuilder("4. Deuten", "Der Hase wirkt", ", weil", ["wachsam", "scheu", "ruhig"], ["er die Ohren aufstellt", "sein Auge glänzt", "er still sitzt"]);
          const b2 = mkBuilder("5. Bewerten", "Mir gefällt", ", weil", ["das Fell", "das Auge", "die Haltung"], ["es so echt aussieht", "es viele Details hat", "es ruhig wirkt"]);
          const m = merk(s, "Deuten: „Ich denke, …“. Bewerten: „Mir gefällt …, weil …“. Hier gibt es kein Richtig oder Falsch.");
          s.add(cols2(s, s.h("div", { class: "stack", style: { gap: "6px", alignItems: "center" } }, p.svg, P(s, "Eigene Zeichnung im Stil von Albrecht Dürer", "small")), stack(s, 10, b1, b2, m), 440));
          s.step(async () => { await reveal(s, b1, "left", "pop"); s.say("Tippe die Bausteine und lies den Satz."); });
          s.step(async () => { await reveal(s, b2, "left", "pop"); });
          s.step(async () => { await reveal(s, m, "up", "success"); });
        },
      },
      /* 6 ---- Bildsprache */
      {
        title: "Bildsprache: Wo ist was?",
        say: "Mit diesen Wörtern kannst du genau sagen, wo etwas im Bild ist. Tippe ein Wort, der Zeiger zeigt die Stelle.",
        build(s) {
          const svg = landscape(s); const view = s.h("div", { style: { width: "620px" } }, svg); svg.style.width = "620px"; svg.style.height = "426px"; svg.style.borderRadius = "12px"; svg.style.border = "3px solid " + INK; svg.style.display = "block";
          const zone = s.el("rect", { x: 0, y: 340, width: 640, height: 100, fill: UC, opacity: 0, stroke: UC, "stroke-width": 4, "stroke-dasharray": "10 8" });
          const ptr = s.el("g", { opacity: 0 }); ptr.append(s.el("circle", { r: 24, fill: "none", stroke: RED, "stroke-width": 6 }), s.el("circle", { r: 6, fill: RED }), s.el("path", { d: "M-34,0 L-16,0 M16,0 L34,0 M0,-34 L0,-16 M0,16 L0,34", stroke: RED, "stroke-width": 5, "stroke-linecap": "round" }));
          svg.append(zone, ptr);
          const Z = { "Vordergrund": [0, 340, 640, 100, "Im <b>Vordergrund</b> stehen der große Baum und die Blumen. Er ist dir am nächsten."], "Mittelgrund": [0, 235, 640, 105, "Im <b>Mittelgrund</b> liegen der See und das Haus."], "Hintergrund": [0, 100, 640, 135, "Im <b>Hintergrund</b> sieht man die Berge. Sie sind weit weg."], "Bildmitte": [250, 235, 140, 100, "In der <b>Bildmitte</b> schwimmt ein Boot."], "links oben": [0, 0, 213, 147, "<b>Links oben</b> scheint die Sonne."], "rechts oben": [427, 0, 213, 147, "<b>Rechts oben</b> fliegt ein Vogel."], "links unten": [0, 293, 213, 147, "<b>Links unten</b> steht der Baum."], "rechts unten": [427, 293, 213, 147, "<b>Rechts unten</b> blühen Blumen."] };
          const cap = s.h("div", { class: "card soft", style: { minHeight: "110px" } }, P(s, "Tippe ein Wort.", "t"));
          let cur = [320, 220, 20, 20], busy = false, curBtn = null;
          const go = async (name, btn) => {
            const z = Z[name]; if (curBtn) curBtn.setOn(false); curBtn = btn; btn.setOn(true);
            cap.innerHTML = ""; cap.append(P(s, z[4], "t")); s.sfx.swoosh();
            const from = cur.slice(), to = [z[0], z[1], z[2], z[3]]; cur = to;
            zone.setAttribute("opacity", .28); ptr.setAttribute("opacity", 1);
            await s.tween({ from: 0, to: 1, dur: 700, ease: "inOut", update: t => { const v = from.map((a, i) => a + (to[i] - a) * t); zone.setAttribute("x", v[0]); zone.setAttribute("y", v[1]); zone.setAttribute("width", v[2]); zone.setAttribute("height", v[3]); ptr.setAttribute("transform", `translate(${v[0] + v[2] / 2} ${v[1] + v[3] / 2})`); } });
            s.sfx.ding();
          };
          const btns = Object.keys(Z).map(k => { const b = pill(s, k, () => go(k, b), { width: "100%" }); b.k = k; return b; });
          const grid = s.h("div", { class: "later", style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" } }, ...btns);
          s.add(cols2(s, view, stack(s, 12, P(s, "Wörter für <span class='hl'>Orte im Bild</span>", "big"), grid, cap), 620, 24));
          s.step(async () => { await reveal(s, grid, "up", "ding"); s.say("Tippe zum Beispiel auf Vordergrund."); });
          s.step(async () => { for (const k of ["Vordergrund", "Mittelgrund", "Hintergrund"]) { await go(k, btns.find(b => b.k === k)); await s.wait(350); } });
          s.step(async () => { await go("Bildmitte", btns.find(b => b.k === "Bildmitte")); });
        },
      },
      /* 7 ---- Gattungen */
      {
        title: "Porträt, Landschaft, Stillleben, Abstrakt",
        say: "Bilder gehören oft zu einer Gattung. Das hilft beim Sprechen über Kunst.",
        build(s) {
          const items = [["Porträt", "Ein Mensch steht im Mittelpunkt, meist das Gesicht.", "Handy: Selfie", "face", "#f9e3d3"], ["Landschaft", "Natur oder Gegend: Berge, Felder, Meer.", "Handy: Urlaubsfoto", "land", "#d6ecf8"], ["Stillleben", "Dinge, die still stehen: Obst, Blumen, Geschirr.", "Handy: Foto vom Essen", "still", "#f3ecd2"], ["Abstrakt", "Keine echten Dinge, nur Farben, Formen und Linien.", "Handy: Hintergrundbild", "abs", "#fff"]];
          const cards = items.map(([n, d, e, k, bg]) => { const v = mini(s, k, bg); v.style.width = "100%"; v.style.height = "auto"; v.style.borderRadius = "10px"; v.style.border = "3px solid " + INK; return s.h("div", { class: "card later", style: { padding: "10px", display: "flex", flexDirection: "column", gap: "8px" } }, v, P(s, `<b>${n}</b>`, "h2"), P(s, d, "small"), s.h("span", { class: "chip", style: { alignSelf: "flex-start", fontSize: "19px" } }, e)); });
          const m = merk(s, "Eine Gattung sagt, <b>was</b> auf dem Bild im Mittelpunkt steht. Ein Bild kann auch zwischen zwei Gattungen liegen.");
          s.add(stack(s, 16, s.h("div", { class: "cols4" }, ...cards), m));
          cards.forEach((c, i) => s.step(async () => { s.sfx.note(i * 3, .25); await s.show(c, "up"); }));
          s.step(async () => { await reveal(s, m, "up", "success"); });
        },
      },
      /* 8 ---- Sortierkarten */
      {
        title: "Sortierkarten zum Ausprobieren",
        say: "Zieh die Bilder in ein Fach. Es gibt keine Punkte. Probiere einfach aus.",
        build(s) {
          const genres = ["Porträt", "Landschaft", "Stillleben", "Abstrakt"], gcol = ["#d4739d", "#2f8f5b", "#d99a1b", "#7b4fd6"];
          const defs = [["face", 0], ["beach", 1], ["pears", 2], ["abs", 3], ["vase", 2], ["lake", 1]];
          const arena = s.h("div", { style: { position: "relative", width: "1100px", height: "520px" } });
          const BW = 262, BX = i => i * 279, BY = 150, BH = 370;
          const bins = genres.map((g, i) => { const b = s.h("div", { style: { position: "absolute", left: BX(i) + "px", top: BY + "px", width: BW + "px", height: BH + "px", border: `4px dashed ${gcol[i]}`, borderRadius: "18px", background: "rgba(255,255,255,.7)" } }, s.h("p", { class: "h2", style: { margin: "6px 12px", color: gcol[i] } }, g)); arena.append(b); return { el: b, cards: [] }; });
          const home = i => [8 + i * 180, 0];
          const cards = defs.map(([k, gi], i) => {
            const v = mini(s, k, "#fff"); v.style.width = "150px"; v.style.height = "100px"; v.style.display = "block"; v.style.border = "3px solid " + INK; v.style.borderRadius = "10px"; v.style.boxSizing = "border-box";
            const tag = s.h("p", { class: "small later", style: { textAlign: "center", margin: "2px 0 0", fontWeight: 700, color: gcol[gi] } }, genres[gi]);
            const c = s.h("div", { class: "later", style: { position: "absolute", width: "150px", left: home(i)[0] + "px", top: "0px", touchAction: "none", transformOrigin: "0 0" } }, v, tag);
            c.gi = gi; c.tag = tag; c.bin = -1; c.i = i; arena.append(c); return c;
          });
          const slotXY = (bi, n) => [BX(bi) + 6 + (n % 2) * 127, BY + 46 + Math.floor(n / 2) * 108];
          const moveTo = (c, x, y, sc) => { const x0 = parseFloat(c.style.left), y0 = parseFloat(c.style.top); const s0 = c.sc || 1; c.sc = sc; return s.tween({ from: 0, to: 1, dur: 450, ease: "out", update: t => { c.style.left = (x0 + (x - x0) * t) + "px"; c.style.top = (y0 + (y - y0) * t) + "px"; c.style.transform = `scale(${s0 + (sc - s0) * t})`; } }); };
          const relayout = () => bins.forEach((b, bi) => b.cards.forEach((c, n) => { const [x, y] = slotXY(bi, n); moveTo(c, x, y, .8); }));
          const put = (c, bi) => { if (c.bin >= 0) bins[c.bin].cards = bins[c.bin].cards.filter(x => x !== c); c.bin = bi; bins[bi].cards.push(c); relayout(); s.show(c.tag, "pop"); s.sfx.snap(); };
          const sendHome = c => { if (c.bin >= 0) { bins[c.bin].cards = bins[c.bin].cards.filter(x => x !== c); c.bin = -1; relayout(); } c.tag.classList.add("later"); moveTo(c, home(c.i)[0], 0, 1); };
          cards.forEach(c => { let off = [0, 0]; s.drag(c, { space: arena,
            onStart: p => { off = [p.x - parseFloat(c.style.left), p.y - parseFloat(c.style.top)]; c.style.zIndex = 9; c.style.transform = "scale(1)"; c.sc = 1; s.sfx.pop(); },
            onMove: p => { c.style.left = (p.x - off[0]) + "px"; c.style.top = (p.y - off[1]) + "px"; },
            onEnd: p => { c.style.zIndex = 1; const cx = p.x, cy = p.y; const bi = bins.findIndex((b, i) => cx >= BX(i) && cx <= BX(i) + BW && cy >= BY && cy <= BY + BH); if (bi >= 0) put(c, bi); else sendHome(c); } }); });
          const top = P(s, "Zieh jedes Bild in ein Fach. Es gibt <span class='hl'>keine Punkte</span>, nur Ausprobieren.", "t");
          s.add(stack(s, 6, top, arena));
          s.step(async () => { s.sfx.whoosh(); for (const c of cards) { s.show(c, "down"); await s.wait(120); } await s.wait(400); });
          s.step(async () => { s.say("Hier siehst du, wie ich sortieren würde."); s.sfx.swoosh(); const pending = cards.filter(c => c.bin < 0); for (const c of pending) { put(c, c.gi); await s.wait(350); } });
        },
      },
      /* 9 ---- gegenständlich vs abstrakt */
      {
        title: "Gegenständlich oder abstrakt?",
        say: "Schiebe den Regler. Ein Baum wird Schritt für Schritt immer einfacher, bis nur noch Linien und Farben übrig sind.",
        build(s) {
          const W = 480, H = 440; const cv = s.canvas(W, H); const g = cv.g; const r = rng(5);
          const leaves = Array.from({ length: 110 }, () => { const a = r() * 6.283, d = Math.sqrt(r()) * 1; return [240 + Math.cos(a) * d * 150, 170 + Math.sin(a) * d * 110, 10 + r() * 12, r()]; });
          const A = al => { g.save(); g.globalAlpha = al; g.fillStyle = "#6d4a2a"; g.beginPath(); g.moveTo(215, 410); g.bezierCurveTo(222, 340, 225, 300, 218, 250); g.lineTo(262, 250); g.bezierCurveTo(255, 300, 262, 340, 270, 410); g.closePath(); g.fill(); g.strokeStyle = "#6d4a2a"; g.lineWidth = 12; g.lineCap = "round"; [[240, 270, 170, 200], [240, 270, 320, 190], [240, 250, 240, 150]].forEach(([a, b, c, d]) => { g.beginPath(); g.moveTo(a, b); g.lineTo(c, d); g.stroke(); });
            leaves.forEach(([x, y, rr, k]) => { g.fillStyle = k < .5 ? "#3f9a4a" : k < .8 ? "#5bb85d" : "#2f7e3c"; g.beginPath(); g.arc(x, y, rr, 0, 7); g.fill(); }); g.fillStyle = "#8ecf6a"; g.fillRect(0, 408, W, 32); g.restore(); };
          const B = al => { g.save(); g.globalAlpha = al; g.strokeStyle = INK; g.lineWidth = 8; g.lineCap = "round"; [[240, 420, 240, 250], [240, 330, 170, 260], [240, 300, 320, 240], [240, 250, 240, 140]].forEach(([a, b, c, d]) => { g.beginPath(); g.moveTo(a, b); g.lineTo(c, d); g.stroke(); }); g.lineWidth = 6; g.fillStyle = "rgba(91,184,93,.5)"; [[160, 220, 70, 50], [240, 130, 80, 56], [330, 215, 70, 48]].forEach(([x, y, rx, ry]) => { g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); g.fill(); g.stroke(); }); g.restore(); };
          const C = al => { g.save(); g.globalAlpha = al; g.fillStyle = "#fff"; g.fillRect(40, 40, 400, 380); g.fillStyle = "#d4202a"; g.fillRect(180, 120, 120, 90); g.fillStyle = "#1d4aa8"; g.fillRect(300, 300, 100, 80); g.fillStyle = "#f2c800"; g.fillRect(80, 210, 100, 90); g.fillStyle = "#6bb061"; g.fillRect(300, 210, 100, 90); g.strokeStyle = "#111"; g.lineWidth = 9; [180, 300, 80, 400].forEach(x => { g.beginPath(); g.moveTo(x, 40); g.lineTo(x, 420); g.stroke(); }); [120, 210, 300, 380].forEach(y => { g.beginPath(); g.moveTo(40, y); g.lineTo(440, y); g.stroke(); }); g.strokeRect(40, 40, 400, 380); g.restore(); };
          const draw = v => { g.clearRect(0, 0, W, H); g.fillStyle = "#e8f4fa"; g.fillRect(0, 0, W, H); const a = clamp(1 - v / 45, 0, 1), c = clamp((v - 55) / 45, 0, 1), b = clamp(1 - Math.abs(v - 50) / 40, 0, 1); if (a > 0) A(a); if (b > 0) B(b); if (c > 0) C(c); };
          draw(0);
          const stage = v => v < 25 ? "gegenständlich" : v < 70 ? "vereinfacht" : "abstrakt";
          const sl = s.slider({ label: "Vom Baum zum Bild aus Linien", min: 0, max: 100, step: 1, value: 0, fmt: stage, onInput: draw });
          const slw = s.h("div", { class: "later" }, sl);
          const m = merk(s, "<b>Gegenständlich</b>: Man erkennt echte Dinge. <b>Abstrakt</b>: Nur Farben, Formen und Linien. Piet Mondrian (gestorben 1944 in New York) malte zwischen 1908 und 1912 Bäume, die immer einfacher wurden.");
          const life = box(s, "life", "Im Alltag", "<b>Foto</b> eines Baums: gegenständlich. <b>Emoji</b> 🌳: vereinfacht. <b>Park-Symbol</b> auf einem Stadtplan: fast abstrakt.");
          s.add(cols2(s, s.h("div", { style: { border: "3px solid " + INK, borderRadius: "12px", overflow: "hidden", lineHeight: 0 } }, cv.canvas), stack(s, 14, slw, m, life), 486));
          s.step(async () => { await reveal(s, slw, "up", "ding"); s.say("Schiebe den Regler nach rechts."); await s.tween({ from: 0, to: 100, dur: 3000, ease: "inOut", update: v => sl.set(Math.round(v)) }); });
          s.step(async () => { await reveal(s, m, "up", "success"); });
          s.step(async () => { await reveal(s, life, "up", "pop"); });
        },
      },
      /* 10 ---- Kunst in Berlin: Museen */
      {
        title: "Kunst in Berlin: Museen",
        say: "Berlin ist voll mit Kunst. Drei Orte stellen wir dir vor.",
        build(s) {
          const svg = s.svg(520, 440);
          svg.append(s.el("rect", { x: 0, y: 0, width: 520, height: 440, rx: 16, fill: "#f1efe6" }), s.el("path", { d: "M0,250 C110,200 200,300 300,240 S440,200 520,262", fill: "none", stroke: "#8cc4ea", "stroke-width": 34, "stroke-linecap": "round" }));
          const isl = s.el("g", {}); isl.append(s.el("ellipse", { cx: 280, cy: 242, rx: 74, ry: 28, fill: "#c9d9a8", stroke: INK, "stroke-width": 3 })); [0, 1, 2, 3, 4].forEach(i => isl.append(s.el("rect", { x: 228 + i * 22, y: 222 + (i % 2) * 10, width: 18, height: 18, fill: "#b9a07a", stroke: INK, "stroke-width": 2 })));
          svg.append(s.el("ellipse", { cx: 140, cy: 385, rx: 120, ry: 44, fill: "#b8dba0" }), s.el("text", { x: 140, y: 420, "text-anchor": "middle", class: "lbl", text: "Tiergarten" }),
            s.el("rect", { x: 70, y: 112, width: 100, height: 30, fill: "#b9a07a", stroke: INK, "stroke-width": 3 }), s.el("line", { x1: 0, y1: 150, x2: 250, y2: 150, stroke: INK, "stroke-width": 3, "stroke-dasharray": "14 8" }),
            isl, s.el("text", { x: 400, y: 330, class: "lbl", text: "Spree" }));
          const pins = [[1, 280, 176], [2, 140, 335], [3, 120, 78]].map(([n, x, y]) => pin(s, svg, n, x, y));
          const mkc = (n, title, txt, col) => s.h("div", { class: "card later", style: { padding: "10px 16px", borderLeft: `10px solid ${col}` } }, s.h("p", { class: "t", html: `<b>${n}. ${title}</b>` }), s.h("p", { class: "small", html: txt }));
          const c = [mkc(1, "Museumsinsel", "Fünf Museen auf einer Insel in der Spree, zum Beispiel das Neue Museum mit der Nofretete. UNESCO-Welterbe seit 1999.", UC), mkc(2, "Gemäldegalerie", "Am Kulturforum im Tiergarten. Alte europäische Malerei vom 13. bis zum 18. Jahrhundert.", "#7b4fd6"), mkc(3, "Hamburger Bahnhof", "Ein alter Bahnhof (gebaut 1846–1847) ist heute ein Museum für zeitgenössische Kunst.", "#ee7a1a")];
          s.add(cols2(s, s.h("div", { class: "stack", style: { gap: "4px", alignItems: "center" } }, svg, P(s, "Skizze, nicht maßstabsgetreu", "small")), stack(s, 12, ...c), 520));
          c.forEach((cc, i) => s.step(async () => { s.show(pins[i], "bounce"); s.sfx.note(i * 4, .25); await s.show(cc, "left"); }));
        },
      },
      /* 11 ---- East Side Gallery */
      {
        title: "East Side Gallery",
        say: "In Berlin gibt es eine lange Wand voller Bilder. Sie heißt East Side Gallery.",
        build(s) {
          const r = rng(21); const pal = ["#d4202a", "#1d4aa8", "#f2c800", "#2f8f5b", "#ee7a1a", "#7b4fd6", "#ffffff", "#111111"];
          const bgs = ["#bfe4f5", "#ffe9a8", "#f6c9d8", "#d3efd0", "#e6dcf5"];
          const cc = Array.from({ length: 12 }, () => Array.from({ length: 6 }, () => pal[Math.floor(r() * pal.length)]));
          const MW = 1092, MH = 170; const mv = s.canvas(MW, MH); const gm = mv.g;
          const panel = (i, x) => { const c = cc[i], k = i % 5; gm.save(); gm.translate(x, 0); gm.beginPath(); gm.rect(0, 0, 200, 170); gm.clip(); gm.fillStyle = bgs[k]; gm.fillRect(0, 0, 200, 170); gm.strokeStyle = INK; gm.lineWidth = 3; gm.lineJoin = "round";
            if (k === 0) for (let j = 0; j < 5; j++) { gm.fillStyle = c[j]; gm.fillRect(10, 14 + j * 30, 180, 18); }
            if (k === 1) { gm.fillStyle = c[0]; gm.beginPath(); gm.arc(100, 85, 56, 0, 7); gm.fill(); gm.stroke(); gm.fillStyle = c[1]; gm.beginPath(); gm.arc(100, 85, 24, 0, 7); gm.fill(); gm.stroke(); }
            if (k === 2) for (let j = 0; j < 6; j++) { gm.fillStyle = c[j]; gm.beginPath(); gm.moveTo(20 + j * 30, 150); gm.lineTo(35 + j * 30, 40); gm.lineTo(50 + j * 30, 150); gm.closePath(); gm.fill(); gm.stroke(); }
            if (k === 3) { gm.lineWidth = 14; [100, 140].forEach((y, j) => { gm.strokeStyle = c[j]; gm.beginPath(); gm.moveTo(0, y); gm.quadraticCurveTo(50, y - 60, 100, y); gm.quadraticCurveTo(150, y + 60, 200, y); gm.stroke(); }); gm.fillStyle = c[2]; gm.beginPath(); gm.arc(150, 40, 20, 0, 7); gm.fill(); }
            if (k === 4) for (let j = 0; j < 12; j++) { gm.fillStyle = c[j % 6]; gm.fillRect(14 + (j % 4) * 44, 14 + Math.floor(j / 4) * 50, 38, 44); gm.strokeRect(14 + (j % 4) * 44, 14 + Math.floor(j / 4) * 50, 38, 44); }
            gm.restore(); gm.strokeStyle = INK; gm.lineWidth = 4; gm.strokeRect(x, 0, 200, 170); };
          let off = 0; const paint = () => { gm.clearRect(0, 0, MW, MH); gm.fillStyle = "#888"; gm.fillRect(0, 0, MW, MH); const f = Math.floor(off / 210); for (let j = 0; j < 7; j++) panel((f + j) % 12, j * 210 - (off - f * 210)); }; paint();
          const win = s.h("div", { class: "later", style: { width: "1100px", height: "178px", border: "4px solid " + INK, borderRadius: "10px", lineHeight: 0, background: "#888" } }, mv.canvas);
          s.loop((t, dt) => { off = (off + dt * 70) % (12 * 210); paint(); });
          const num = s.h("span", { class: "huge mono", style: { color: UC } }, "0");
          const bar = s.h("div", { style: { flex: 1, height: "22px", borderRadius: "11px", background: "#e3eef0", overflow: "hidden", border: "2px solid " + INK } }); const bf = s.h("div", { style: { height: "100%", width: "0%", background: UC } }); bar.append(bf);
          const ruler = s.h("div", { class: "row later", style: { flexWrap: "nowrap", gap: "18px" } }, num, s.h("span", { class: "big" }, "m"), bar, P(s, "an der Mühlenstraße in Friedrichshain, zwischen Ostbahnhof und Oberbaumbrücke", "small"));
          ruler.lastChild.style.maxWidth = "380px";
          const fact = (t, col) => s.h("div", { class: "card later", style: { padding: "10px 16px", borderLeft: `10px solid ${col}` } }, P(s, t, "small"));
          const f = [fact("<b>Frühjahr 1990:</b> 118 Künstler aus 21 Ländern malten rund 100 Bilder auf die Mauer.", UC), fact("<b>Seit November 1991:</b> Die Wand steht unter Denkmalschutz.", "#7b4fd6"), fact("<b>Ein bekanntes Wandbild:</b> Zwei Männer küssen sich. Es heißt „Bruderkuss“ und ist von Dmitri Wrubel.", "#ee7a1a")];
          const m = merk(s, "Aus einem Stück Mauer wurde eine <b>Galerie unter freiem Himmel</b>.");
          s.add(stack(s, 12, win, ruler, s.h("div", { class: "cols3" }, ...f), m));
          s.step(async () => { await reveal(s, win, "up", "whoosh"); });
          s.step(async () => { s.show(ruler, "up"); s.say("Die Wand ist eintausenddreihundertsechzehn Meter lang."); let last = -1; await s.tween({ from: 0, to: 1316, dur: 2200, ease: "out", update: v => { num.textContent = s.fmt(Math.round(v)); bf.style.width = (v / 1316 * 100) + "%"; const i = Math.floor(v / 130); if (i !== last) { last = i; s.sfx.count(i); } } }); s.sfx.ding(); });
          s.step(async () => { for (const c of f) { s.sfx.pop(); await s.show(c, "up"); } });
          s.step(async () => { await reveal(s, m, "up", "success"); });
        },
      },
      /* 12 ---- Street Art */
      {
        title: "Street Art: Schablone sprühen",
        say: "Street Art ist Kunst in der Stadt. Mit einer Schablone geht die Farbe nur durch das Loch.",
        build(s) {
          const W = 520, H = 400;
          const wrap = s.h("div", { style: { position: "relative", width: W + "px", height: H + "px", borderRadius: "12px", border: "3px solid " + INK, background: "repeating-linear-gradient(0deg, #b9b5ae 0 3px, #cfcac2 3px 38px), #cfcac2" } });
          const cv = s.canvas(W, H); const g = cv.g; cv.canvas.style.cssText += ";position:absolute;left:0;top:0";
          const star = new Path2D(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 52 : 125; const x = 260 + Math.cos(a) * rr, y = 205 + Math.sin(a) * rr; i ? star.lineTo(x, y) : star.moveTo(x, y); } star.closePath();
          const stSvg = s.svg(W, H); stSvg.style.cssText = "position:absolute;left:0;top:0;pointer-events:none;transition:none";
          let sd = ""; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 52 : 125; sd += (i ? "L" : "M") + (260 + Math.cos(a) * rr).toFixed(1) + "," + (205 + Math.sin(a) * rr).toFixed(1); } sd += "Z";
          const card = s.el("path", { d: `M70,20 L450,20 L450,390 L70,390 Z ${sd}`, "fill-rule": "evenodd", fill: "#c8a373", stroke: "#8a6a3d", "stroke-width": 4 }); stSvg.append(card);
          wrap.append(cv.canvas, stSvg);
          let on = false, col = RED, X = 60; const setX = x => { X = x; stSvg.style.transform = `translateX(${x}px)`; stSvg.style.opacity = String(1 - x / 60); }; setX(60);
          const slide = async (to) => { s.sfx.swoosh(); const f = X; await s.tween({ from: f, to, dur: 700, ease: "inOut", update: setX }); };
          const spray = async () => { if (!on) { on = true; await slide(0); } s.sfx.scribble(); g.save(); g.clip(star); g.fillStyle = col; const n = 90; const dots = () => { g.globalAlpha = .55; for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, d = Math.sqrt(Math.random()) * 135; g.beginPath(); g.arc(260 + Math.cos(a) * d, 205 + Math.sin(a) * d, 1.5 + Math.random() * 2.5, 0, 7); g.fill(); } }; await s.tween({ from: 0, to: 1, dur: 1500, ease: "linear", update: () => { if (s.fast) for (let k = 0; k < 70; k++) dots(); else dots(); } }); g.restore(); s.sfx.ding(); };
          const off = async () => { if (on) { on = false; await slide(60); } };
          const cs = [["Rot", RED], ["Blau", BLUE], ["Gelb", OCK], ["Schwarz", "#25252e"]].map(([n, c]) => { const b = s.h("button", { class: "btn", "aria-label": n, style: { width: "64px", padding: 0 }, onclick: () => { col = c; s.sfx.click(); cs.forEach(x => x.style.outline = "none"); b.style.outline = "4px solid " + UC; } }, s.h("span", { style: { width: "32px", height: "32px", borderRadius: "50%", background: c, border: "2px solid " + INK } })); return b; }); cs[0].style.outline = "4px solid " + UC;
          const bSpray = s.h("button", { class: "btn solid", onclick: spray }, "Sprühen"); const bOff = s.h("button", { class: "btn", onclick: () => off() }, "Schablone abnehmen");
          const ctr = s.h("div", { class: "stack later", style: { gap: "10px" } }, s.h("div", { class: "row", style: { gap: "8px" } }, ...cs), s.h("div", { class: "row" }, bSpray, bOff));
          const types = ["Wandbild", "Schablone", "Sticker", "Plakat"].map(t => s.h("span", { class: "chip", style: { fontSize: "19px" } }, t));
          const m = merk(s, "Street Art ist Kunst in der Stadt. Frag immer, <b>wo</b> du malen darfst: Auf fremde Wände zu sprühen ist verboten.");
          s.add(cols2(s, wrap, stack(s, 12, P(s, "Kunst auf <span class='hl'>der Straße</span>", "big"), P(s, "Eine <b>Schablone</b> (englisch: Stencil) ist ein Blatt mit einem ausgeschnittenen Bild. Die Farbe geht nur durchs Loch.", "t"), s.h("div", { class: "row", style: { gap: "8px" } }, ...types), ctr, m), W, 28));
          s.step(async () => { await reveal(s, ctr, "up", "ding"); await slide(0); on = true; });
          s.step(async () => { s.say("Jetzt sprühen wir."); await spray(); });
          s.step(async () => { await off(); });
          s.step(async () => { await reveal(s, m, "up", "success"); });
        },
      },
      /* 13 ---- Skizzenbuch */
      {
        title: "Das Skizzenbuch",
        say: "Ein Skizzenbuch ist dein Übungsplatz. Zeichne jeden Tag ein bisschen.",
        build(s) {
          const W = 520, H = 380; const cv = s.canvas(W, H); const g = cv.g; const cvEl = cv.canvas;
          const paper = s.h("div", { style: { width: (W + 6) + "px", height: (H + 6) + "px", background: "#fffdf4", border: "3px solid " + INK, borderRadius: "6px", boxShadow: "6px 6px 0 rgba(0,0,0,.15)", lineHeight: 0, transformOrigin: "0 50%" } }, cvEl);
          let tool = "pencil", last = null; const T = { pencil: ["#555b66", 2.5, 1], pen: ["#1d5bd0", 7, 1], eraser: ["#fffdf4", 22, 1] };
          const seg = (a, b) => { const [c, w, al] = T[tool]; g.strokeStyle = c; g.lineWidth = w; g.globalAlpha = al; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); };
          s.drag(cvEl, { space: cvEl, onStart: p => { last = p; seg(p, { x: p.x + .1, y: p.y + .1 }); }, onMove: p => { if (last) { seg(last, p); last = p; } }, onEnd: () => { last = null; } });
          g.fillStyle = "#fffdf4"; g.fillRect(0, 0, W, H);
          const tools = [["Bleistift", "pencil"], ["Filzstift", "pen"], ["Radierer", "eraser"]].map(([n, k]) => { const b = pill(s, n, () => { tool = k; tools.forEach(x => x.setOn(x === b)); s.sfx.click(); }); return b; }); tools[0].setOn(true);
          const flip = pill(s, "Neue Seite", async () => { s.sfx.swoosh(); await s.tween({ from: 1, to: 0, dur: 250, update: v => { paper.style.transform = `scaleX(${v})`; } }); g.globalAlpha = 1; g.fillStyle = "#fffdf4"; g.fillRect(0, 0, W, H); updDate(); await s.tween({ from: 0, to: 1, dur: 250, update: v => { paper.style.transform = `scaleX(${v})`; } }); }, { background: UC, color: "#fff" });
          const date = P(s, "", "hand"); const updDate = () => { date.textContent = "Skizze vom " + new Date().toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" }); }; updDate();
          const left = s.h("div", { class: "stack", style: { gap: "8px" } }, date, paper, s.h("div", { class: "row later", style: { gap: "10px" } }, ...tools, flip));
          const tipsData = [["5 Minuten am Tag", "Wenig, aber oft. So wird deine Hand sicher."], ["Datum aufschreiben", "Dann siehst du später, wie du besser wirst."], ["Nichts ist falsch", "Ein Skizzenbuch ist zum Üben da, nicht zum Vorzeigen."], ["Alles ist ein Motiv", "Ein Schuh, deine Tasse, ein Hund, die U-Bahn."]];
          const tips = tipsData.map(([a, b]) => s.h("div", { class: "card later", style: { padding: "10px 16px", borderLeft: `10px solid ${UC}` } }, P(s, `<b>${a}</b>`, "t"), P(s, b, "small")));
          const life = box(s, "life", "Im Alltag", "Wie ein Fotoalbum, nur selbst gezeichnet. Und es passt in jede Schultasche.");
          s.add(cols2(s, left, stack(s, 10, ...tips, life), W + 6, 28));
          const stroke = async pts => { for (let i = 1; i < pts.length; i++) { await s.tween({ from: 0, to: 1, dur: 140, ease: "linear", update: t => { const a = { x: pts[i - 1][0], y: pts[i - 1][1] }, b = { x: pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, y: pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t }; seg(a, b); } }); } };
          s.step(async () => { s.show(left.children[2], "up"); s.sfx.scribble(); await stroke([[200, 150], [200, 280], [320, 280], [320, 150], [200, 150]]); await stroke([[320, 180], [360, 180], [372, 220], [345, 250], [320, 250]]); await stroke([[235, 125], [245, 95], [235, 65]]); });
          s.step(async () => { await reveal(s, [tips[0], tips[1]], "left", "pop"); });
          s.step(async () => { await reveal(s, [tips[2], tips[3]], "left", "pop"); });
          s.step(async () => { await reveal(s, life, "up", "ding"); });
        },
      },
      /* 14 ---- Foto-Filter */
      {
        title: "Foto-Filter sind Entscheidungen",
        say: "Wenn du ein Foto veränderst, entscheidest du über Farbe und Bildausschnitt. Das ist Bildsprache.",
        build(s) {
          const svg = landscape(s); svg.style.cssText = "width:560px;height:385px;display:block"; svg.setAttribute("width", 560); svg.setAttribute("height", 385);
          const win = s.h("div", { style: { width: "566px", height: "391px", border: "3px solid " + INK, borderRadius: "12px", lineHeight: 0 } }, svg);
          const st = { sat: 100, br: 100, sep: 0, zoom: 100 };
          const apply = () => { svg.style.filter = `saturate(${st.sat}%) brightness(${st.br}%) sepia(${st.sep}%)`; const z = st.zoom / 100, w = 640 / z, h = 440 / z; svg.setAttribute("viewBox", `${320 - w / 2} ${262 - h / 2} ${w} ${h}`); };
          const mk = (label, k, min, max, val, unit) => s.slider({ label, min, max, step: 1, value: val, fmt: v => v + unit, onInput: v => { st[k] = v; apply(); } });
          const sls = [mk("Farbstärke", "sat", 0, 200, 100, " %"), mk("Helligkeit", "br", 50, 150, 100, " %"), mk("Sepia (altes Foto)", "sep", 0, 100, 0, " %"), mk("Ausschnitt (Zoom)", "zoom", 100, 250, 100, " %")];
          const slw = s.h("div", { class: "stack later", style: { gap: "4px" } }, ...sls);
          const life = box(s, "life", "Im Alltag", "<b>Foto-App:</b> Mit Filtern stellst du die Stimmung ein.<br><b>Profilbild:</b> Du schneidest den Ausschnitt zu.<br><b>Schwarzweiß-Foto:</b> wirkt oft ernst oder alt.");
          s.add(cols2(s, s.h("div", { class: "stack", style: { gap: "6px", alignItems: "center" } }, win, P(s, "Eigene Zeichnung, nur zum Verändern", "small")), stack(s, 10, P(s, "Du bist der <span class='hl'>Bild-Regisseur</span>", "h2"), slw, life), 566, 24));
          s.step(async () => { await reveal(s, slw, "up", "ding"); s.say("Probiere die Regler aus."); });
          s.step(async () => { s.sfx.whoosh(); await s.tween({ from: 100, to: 0, dur: 900, update: v => sls[0].set(Math.round(v)) }); await s.wait(300); await s.tween({ from: 0, to: 100, dur: 700, update: v => sls[0].set(Math.round(v)) }); await s.tween({ from: 100, to: 170, dur: 800, update: v => sls[3].set(Math.round(v)) }); });
          s.step(async () => { await reveal(s, life, "up", "pop"); });
        },
      },
      /* 15 ---- Im Alltag */
      {
        title: "Im Alltag: Kunst zeigen",
        say: "Kunst begegnet dir im Museum, in der Schule und im eigenen Zimmer.",
        build(s) {
          const E = (t, a) => s.el(t, a), st = { stroke: INK, "stroke-width": 3, "stroke-linejoin": "round" };
          const v1 = s.svg(300, 170); v1.append(E("rect", { x: 0, y: 0, width: 300, height: 170, rx: 10, fill: "#e8e3d8" }), E("rect", Object.assign({ x: 90, y: 14, width: 120, height: 90, fill: "#f6e6a8" }, st)), E("rect", { x: 100, y: 24, width: 100, height: 70, fill: "#6ab7e0" }), E("path", { d: "M100,94 L130,58 L152,78 L170,60 L200,94 Z", fill: "#4fa35a" }), E("rect", Object.assign({ x: 112, y: 122, width: 76, height: 32, fill: "#fff" }, st)), E("line", { x1: 120, y1: 134, x2: 180, y2: 134, stroke: INK, "stroke-width": 3 }), E("line", { x1: 120, y1: 144, x2: 164, y2: 144, stroke: INK, "stroke-width": 3 }));
          const v2 = s.svg(300, 170); v2.append(E("rect", { x: 0, y: 0, width: 300, height: 170, rx: 10, fill: "#cfe3c4" })); for (let i = 0; i < 6; i++) { const x = 24 + (i % 3) * 90, y = 18 + Math.floor(i / 3) * 78; v2.append(E("rect", Object.assign({ x, y, width: 72, height: 56, fill: ["#f2c800", "#6ab7e0", "#ee7a9c", "#4fa35a", "#ee7a1a", "#b79ad0"][i] }, st)), E("rect", { x: x + 18, y: y + 60, width: 36, height: 8, fill: "#fff", stroke: INK, "stroke-width": 2 })); }
          const v3 = s.svg(300, 170); v3.append(E("rect", { x: 0, y: 0, width: 300, height: 170, rx: 10, fill: "#e6dcf5" }), E("rect", { x: 0, y: 130, width: 300, height: 40, fill: "#b9855a" }), E("rect", Object.assign({ x: 50, y: 98, width: 130, height: 40, rx: 6, fill: "#7aa6d6" }, st)), E("rect", Object.assign({ x: 195, y: 16, width: 78, height: 100, fill: "#fff" }, st)), E("circle", { cx: 220, cy: 46, r: 14, fill: "#f2c800" }), E("rect", { x: 232, y: 66, width: 30, height: 34, fill: "#d4202a" }), E("path", { d: "M204,100 Q226,70 246,100", fill: "none", stroke: "#1d4aa8", "stroke-width": 5 }));
          const mkc = (title, v, txt) => s.h("div", { class: "card later", style: { padding: "12px", display: "flex", flexDirection: "column", gap: "8px" } }, v, P(s, `<b>${title}</b>`, "h2"), P(s, txt, "t"));
          const c = [mkc("Museum", v1, "Schau erst 30 Sekunden still. Dann lies das Schild."), mkc("Schulausstellung", v2, "Jedes Bild bekommt ein Schildchen: Titel, Name und Technik."), mkc("Poster im Zimmer", v3, "Wähle ein Motiv, das dich froh macht. Hänge es so, dass du es gut siehst.")];
          [v1, v2, v3].forEach(v => { v.style.width = "100%"; v.style.height = "auto"; });
          const mm = merk(s, "Frag in deiner Klasse nach einer <b>Ausstellung</b>. Deine Bilder aus der Galerie kannst du auch ausdrucken und ins Zimmer hängen.");
          s.add(stack(s, 18, s.h("div", { class: "cols3", style: { alignItems: "start" } }, ...c), mm));
          c.forEach((cc, i) => s.step(async () => { s.sfx.note(i * 4, .25); await s.show(cc, "up"); }));
          s.step(async () => { await reveal(s, mm, "up", "success"); });
        },
      },
      /* 16 ---- Galerie */
      {
        title: "Deine Galerie",
        say: "Male ein Bild, gib ihm einen Titel und hänge es in deine eigene Galerie.",
        build(s) {
          const W = 500, H = 320; const cv = s.canvas(W, H); const g = cv.g; const cvEl = cv.canvas;
          g.fillStyle = "#fffdf4"; g.fillRect(0, 0, W, H);
          let col = BLUE, tech = "Filzstift", last = null;
          const seg = (a, b) => { g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = col; if (tech === "Filzstift") { g.globalAlpha = 1; g.lineWidth = 7; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); } else if (tech === "Pinsel") { g.globalAlpha = .55; g.lineWidth = 20; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); } else { g.fillStyle = col; g.globalAlpha = .6; const n = Math.max(1, Math.round(Math.hypot(b.x - a.x, b.y - a.y) / 2)); for (let i = 0; i < n * 3; i++) { const t = Math.random(); g.fillRect(a.x + (b.x - a.x) * t + (Math.random() - .5) * 16, a.y + (b.y - a.y) * t + (Math.random() - .5) * 16, 2, 2); } } g.globalAlpha = 1; };
          s.drag(cvEl, { space: cvEl, onStart: p => { last = p; seg(p, { x: p.x + .1, y: p.y + .1 }); }, onMove: p => { if (last) { seg(last, p); last = p; } }, onEnd: () => { last = null; } });
          const paper = s.h("div", { style: { width: (W + 6) + "px", height: (H + 6) + "px", border: "3px solid " + INK, borderRadius: "6px", lineHeight: 0 } }, cvEl);
          const colors = [["Blau", BLUE], ["Rot", RED], ["Gelb", OCK], ["Grün", GREEN], ["Schwarz", "#25252e"], ["Orange", "#ee7a1a"]];
          const cbs = colors.map(([n, c]) => { const b = s.h("button", { class: "btn", "aria-label": n, style: { width: "58px", padding: 0 }, onclick: () => { col = c; s.sfx.click(); cbs.forEach(x => x.style.outline = "none"); b.style.outline = "4px solid " + UC; } }, s.h("span", { style: { width: "30px", height: "30px", borderRadius: "50%", background: c, border: "2px solid " + INK } })); return b; }); cbs[0].style.outline = "4px solid " + UC;
          const tbs = ["Filzstift", "Pinsel", "Kreide"].map(n => { const b = pill(s, n, () => { tech = n; tbs.forEach(x => x.setOn(x === b)); s.sfx.click(); }); return b; }); tbs[0].setOn(true);
          const clr = pill(s, "Löschen", () => { g.fillStyle = "#fffdf4"; g.globalAlpha = 1; g.fillRect(0, 0, W, H); s.sfx.swoosh(); });
          const left = s.h("div", { class: "stack later", style: { gap: "10px" } }, paper, s.h("div", { class: "row", style: { gap: "8px" } }, ...cbs), s.h("div", { class: "row", style: { gap: "8px" } }, ...tbs, clr));
          // wall
          let title = "Mein Bild";
          const titles = ["Mein Baum", "Nachthimmel", "Fantasie-Tier", "Meine Stadt", "Ohne Titel"];
          const tcs = titles.map((n, i) => { const b = pill(s, n, () => { title = n; tcs.forEach(x => x.setOn(x === b)); s.sfx.click(); if (hung) hang(false); }, { minHeight: "46px", padding: "0 12px" }); return b; }); tcs[0].setOn(true); title = titles[0];
          const FW = 240, FH = 160; const disp = s.canvas(FW, FH);
          const frame = s.h("div", { style: { border: "14px solid #c9a227", borderRadius: "4px", boxShadow: "0 8px 0 rgba(0,0,0,.18), inset 0 0 0 3px #8a6d12", lineHeight: 0, background: "#fff" } }, disp.canvas);
          const plaque = s.h("div", { style: { background: "#fff", border: "2px solid #8d8d8d", borderRadius: "6px", padding: "6px 14px", minWidth: "250px" } }, s.h("p", { class: "t", style: { fontWeight: 800, margin: 0 } }, "…"), s.h("p", { class: "small", style: { margin: 0 } }, "…"), s.h("p", { class: "small", style: { margin: 0 } }, "…"));
          const wall = s.h("div", { style: { height: "330px", borderRadius: "14px", background: "radial-gradient(ellipse at 50% 20%, #fffaf0 0, #ece6d8 70%)", border: "3px solid " + INK, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px" } }, s.h("div", { class: "later", id: "fr" }, frame), s.h("div", { class: "later", id: "pl" }, plaque));
          const frWrap = wall.children[0], plWrap = wall.children[1]; let hung = false;
          const hang = async (anim = true) => { disp.g.clearRect(0, 0, FW, FH); disp.g.drawImage(cvEl, 0, 0, FW, FH); const yr = new Date().getFullYear(); plaque.children[0].textContent = title; plaque.children[1].textContent = "Julian, Klasse 5a, " + yr; plaque.children[2].textContent = tech + ", digital"; if (!hung || anim) { hung = true; s.sfx.boing(); await s.show(frWrap, "bounce"); await s.show(plWrap, "up"); s.sfx.ding(); } };
          const bHang = pill(s, "Aufhängen", () => hang(true), { background: UC, color: "#fff", width: "100%" });
          const right = s.h("div", { class: "stack later", style: { gap: "10px" } }, P(s, "<b>Titel wählen</b>", "t"), s.h("div", { style: { display: "flex", flexWrap: "wrap", gap: "8px" } }, ...tcs), bHang, wall);
          s.add(cols2(s, left, right, W + 6, 22));
          const stroke = async pts => { for (let i = 1; i < pts.length; i++) { await s.tween({ from: 0, to: 1, dur: 160, ease: "linear", update: t => { seg({ x: pts[i - 1][0], y: pts[i - 1][1] }, { x: pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, y: pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t }); } }); } };
          s.step(async () => { await reveal(s, left, "left", "whoosh"); s.say("Male mit dem Finger. Wähle Farbe und Technik."); });
          s.step(async () => { await reveal(s, right, "right", "ding"); });
          s.step(async () => { s.say("Hier ist ein Beispiel. Ich hänge es auf."); col = "#6d4a2a"; tech = "Filzstift"; s.sfx.scribble(); await stroke([[250, 300], [250, 180]]); col = GREEN; tech = "Pinsel"; await stroke([[200, 120], [250, 90], [310, 120], [290, 170], [210, 170], [200, 120]]); col = BLUE; tech = "Filzstift"; await stroke([[60, 60], [90, 40], [120, 60]]); col = OCK; await stroke([[400, 50], [430, 50]]); col = BLUE; await hang(true); });
        },
      },
      /*__SLIDES__*/
    ],
  });
})();
