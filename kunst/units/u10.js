/* Kapitel 10 – Kunst der Griechen und Römer (Kunst 5/6, Berlin RLP: Kunst früher Kulturen, Architektur, Ornament)
   Vasenformen, schwarz- und rotfigurig, Mäander und Ornamentbänder, Säulenordnungen (Berlin), Tempelfront,
   Kontrapost, römische Mosaike, Pergamonaltar, eigene Vase. Geschrieben 2026-10-05. */
(() => {
  const UC = "#5f6f12", SOFT = "#eef2d6", INK = "#1b2740", RED = "#dc3b2a", BLUE = "#1d5bd0", GREEN = "#138a5a";
  const TERRA = "#cf6f34", BLK = "#201b18", CREAM = "#f4ead6", MARBLE = "#f3efe6", STONE = "#d9cfbd";
  const cols2 = (s, l, r, lw = 560, gap = 28) => s.h("div", { class: "cols", style: { gridTemplateColumns: lw + "px 1fr", alignItems: "center", height: "100%", gap: gap + "px" } }, l, r);
  const P = (s, html, cls = "t", later = false) => s.h("p", { class: cls + (later ? " later" : ""), html });
  const box = (s, cls, label, html, later = true) => s.h("div", { class: cls + (later ? " later" : "") }, label ? s.h("span", { class: "exlabel" }, label) : null, s.h("p", { class: "small", html }));
  const merk = (s, html, later = true) => s.h("div", { class: "merk" + (later ? " later" : ""), html });
  const stack = (s, gap, ...k) => s.h("div", { class: "stack", style: { gap: gap + "px" } }, ...k);
  const fx = (s, n = "pop") => { try { s.sfx[n](); } catch (e) {} };
  const reveal = (s, els, kind = "pop", snd = "pop", delay = 0) => { fx(s, snd); return s.show(els, kind, delay); };
  const pill = (s, text, onclick, extra = {}) => { const b = s.h("button", { style: Object.assign({ minHeight: "56px", padding: "0 14px", border: "2px solid " + UC, borderRadius: "14px", background: "#fff", color: UC, font: "700 19px var(--f-display)", cursor: "pointer" }, extra), onclick }, text); b.setOn = on => { b.style.background = on ? UC : "#fff"; b.style.color = on ? "#fff" : UC; }; return b; };
  const pillGroup = (s, items, onPick, start) => { const bs = {}; const pick = k => { Object.entries(bs).forEach(([kk, b]) => b.setOn(kk === k)); onPick(k); }; items.forEach(([k, t]) => { bs[k] = pill(s, t, () => { s.sfx.click(); pick(k); }); }); if (start) Object.entries(bs).forEach(([kk, b]) => b.setOn(kk === start)); return { btns: bs, pick }; };
  const prow = (s, label, btns, later = false) => s.h("div", { class: later ? "later" : "", style: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" } }, label ? s.h("span", { class: "t", style: { fontWeight: 700, minWidth: "96px" } }, label) : null, ...btns);
  let uid = 0;

  /* ---------- vase shapes in a 240×260 box (centre x = 120, foot on y = 250) ---------- */
  const VASES = {
    amphore: {
      body: "M95,20 L145,20 L140,30 Q134,40 136,62 Q192,80 192,130 Q190,190 142,228 L150,250 L90,250 L98,228 Q50,190 48,130 Q48,80 104,62 Q106,40 100,30 Z",
      handles: ["M137,40 C176,36 184,62 176,96", "M103,40 C64,36 56,62 64,96"], bands: [[84, 104], [192, 206]], panel: [62, 108, 116, 74],
    },
    hydria: {
      body: "M98,22 L142,22 L138,32 Q132,46 134,64 Q194,78 194,128 Q192,190 142,226 L150,250 L90,250 L98,226 Q48,190 46,128 Q46,78 106,64 Q108,46 102,32 Z",
      handles: ["M106,36 C70,34 58,58 66,82", "M48,118 C24,118 22,142 52,144", "M192,118 C216,118 218,142 188,144"], bands: [[80, 98], [196, 210]], panel: [64, 104, 112, 78],
    },
    krater: {
      body: "M40,26 L200,26 L190,40 Q166,110 166,148 Q166,176 134,186 L134,222 L164,250 L76,250 L106,222 L106,186 Q74,176 74,148 Q74,110 50,40 Z",
      handles: ["M168,150 C206,150 210,120 192,108", "M72,150 C34,150 30,120 48,108"], bands: [[40, 56], [160, 174]], panel: [72, 64, 96, 90],
    },
    kylix: {
      body: "M14,104 L226,104 Q214,150 134,162 L130,214 L168,240 L72,240 L110,214 L106,162 Q26,150 14,104 Z",
      handles: ["M218,112 C246,110 244,140 206,138", "M22,112 C-6,110 -4,140 34,138"], bands: [[108, 120]], panel: [70, 122, 100, 30],
    },
  };
  function vase(s, kind, { fill = TERRA, stroke = INK, sw = 3 } = {}) {
    const v = VASES[kind], g = s.el("g");
    const hs = v.handles.map(d => s.el("path", { d, fill: "none", stroke, "stroke-width": 13, "stroke-linecap": "round" }));
    const hi = v.handles.map(d => s.el("path", { d, fill: "none", stroke: fill, "stroke-width": 7, "stroke-linecap": "round" }));
    const body = s.el("path", { d: v.body, fill, stroke, "stroke-width": sw, "stroke-linejoin": "round" });
    g.append(...hs, ...hi, body);
    return { g, body, hi, v };
  }

  /* ---------- ornament bands: path data inside rect x..x+w, y..y+h ---------- */
  function meanderD(x, y, w, h) {
    const u = h / 4; let d = `M${x},${y + h} `;
    for (let cx = x; cx + 4 * u <= x + w + 0.1; cx += 4 * u) d += `L${cx},${y} L${cx + 3 * u},${y} L${cx + 3 * u},${y + 2 * u} L${cx + u},${y + 2 * u} L${cx + u},${y + h} L${cx + 4 * u},${y + h} `;
    return d;
  }
  function waveD(x, y, w, h) {
    const u = h; let d = `M${x},${y + h * .75} `;
    for (let cx = x; cx < x + w; cx += 1.6 * u) d += `C${cx + .2 * u},${y + h * .1} ${cx + .9 * u},${y} ${cx + .9 * u},${y + h * .45} C${cx + .9 * u},${y + h * .7} ${cx + .55 * u},${y + h * .7} ${cx + .55 * u},${y + h * .5} M${cx + .9 * u},${y + h * .45} C${cx + .9 * u},${y + h} ${cx + 1.6 * u},${y + h} ${cx + 1.6 * u},${y + h * .75} `;
    return d;
  }
  function zigD(x, y, w, h) { const u = h; let d = `M${x},${y + h} `; for (let cx = x; cx < x + w; cx += u) d += `L${cx + u / 2},${y} L${cx + u},${y + h} `; return d; }
  const BANDS = { maeander: meanderD, welle: waveD, zickzack: zigD };

  /* ---------- small motifs (owl, dolphin, wreath) in a 100×80 box; returns {shape, details} ---------- */
  const OWL = "M34,74 C24,60 24,30 36,22 L34,8 L44,18 Q50,15 56,18 L66,8 L64,22 C76,30 76,60 66,74 Z";
  const OWL_DET = ["M37,31 A6,6 0 1 0 49,31 A6,6 0 1 0 37,31", "M51,31 A6,6 0 1 0 63,31 A6,6 0 1 0 51,31", "M48,38 L50,44 L52,38", "M40,52 Q50,58 60,52", "M42,61 Q50,66 58,61", "M36,40 Q32,54 38,66", "M64,40 Q68,54 62,66"];
  function motif(s, kind, fillCol, lineCol) {
    const g = s.el("g"), st = { fill: "none", stroke: lineCol, "stroke-width": 2.6, "stroke-linecap": "round" };
    if (kind === "eule") {
      g.append(s.el("path", { d: OWL, fill: fillCol }), ...OWL_DET.map(d => s.el("path", Object.assign({ d }, st))),
        s.el("path", { d: "M14,76 L86,76", stroke: fillCol, "stroke-width": 4, "stroke-linecap": "round" }));
    } else if (kind === "delfin") {
      g.append(s.el("path", { d: "M6,52 C18,30 44,22 66,28 L74,14 L78,30 C88,34 94,42 96,50 C88,48 82,50 78,54 L86,66 L70,58 C52,62 30,60 6,52 Z", fill: fillCol }),
        s.el("circle", { cx: 76, cy: 40, r: 2.4, fill: lineCol }), s.el("path", Object.assign({ d: "M30,46 Q48,40 64,44 M88,47 L96,50" }, st)),
        s.el("path", { d: "M8,72 Q20,64 32,72 T56,72 T80,72", fill: "none", stroke: fillCol, "stroke-width": 4, "stroke-linecap": "round" }));
    } else {
      const leaf = (x, y, a) => s.el("ellipse", { cx: x, cy: y, rx: 9, ry: 4.2, fill: fillCol, transform: `rotate(${a} ${x} ${y})` });
      g.append(s.el("path", { d: "M50,74 C14,70 10,24 34,12 M50,74 C86,70 90,24 66,12", fill: "none", stroke: fillCol, "stroke-width": 3.4 }));
      [[22, 58, -60], [16, 42, -80], [20, 26, -110], [32, 16, -140], [78, 58, 60], [84, 42, 80], [80, 26, 110], [68, 16, 140]].forEach(([x, y, a]) => g.append(leaf(x, y, a)));
      g.append(s.el("path", Object.assign({ d: "M38,30 L62,30 M42,40 L58,40 M46,50 L54,50" }, st)));
    }
    return g;
  }

  /* ---------- a whole decorated vase (for the designer + demos) ---------- */
  function decoratedVase(s, { kind = "amphore", tech = "schwarz", band = "maeander", pic = "eule" } = {}) {
    const black = tech === "schwarz";
    const ground = black ? TERRA : BLK, paint = black ? BLK : TERRA, detail = black ? TERRA : BLK;
    const V = vase(s, kind, { fill: ground });
    const id = "k10clip" + (++uid);
    const clip = s.el("clipPath", { id }, s.el("path", { d: V.v.body }));
    const deco = s.el("g", { "clip-path": `url(#${id})` });
    V.v.bands.forEach(([y1, y2]) => {
      deco.append(s.el("rect", { x: 0, y: y1 - 3, width: 240, height: y2 - y1 + 6, fill: black ? TERRA : TERRA }));
      deco.append(s.el("path", { d: BANDS[band](8, y1, 232, y2 - y1), fill: "none", stroke: BLK, "stroke-width": 2.6, "stroke-linejoin": "miter" }));
      deco.append(s.el("line", { x1: 0, x2: 240, y1: y1 - 3, y2: y1 - 3, stroke: BLK, "stroke-width": 2 }), s.el("line", { x1: 0, x2: 240, y1: y2 + 3, y2: y2 + 3, stroke: BLK, "stroke-width": 2 }));
    });
    const [px, py, pw, ph] = V.v.panel;
    const m = motif(s, pic, paint, detail);
    const k = Math.min(pw / 100, ph / 80);
    m.setAttribute("transform", `translate(${px + (pw - 100 * k) / 2},${py + (ph - 80 * k) / 2}) scale(${k})`);
    const g = s.el("g"); g.append(clip, V.g, deco, m);
    return g;
  }

  /* ---------- columns (capital types) – column centred at cx, top of capital at y0, foot at y1 ---------- */
  function column(s, type, cx, y0, y1, w = 70) {
    const g = s.el("g"), st = { stroke: INK, "stroke-width": 3, "stroke-linejoin": "round" };
    const capH = type === "dorisch" ? 44 : type === "ionisch" ? 50 : 96;
    const baseH = type === "dorisch" ? 0 : 26;
    const sTop = y0 + capH, sBot = y1 - baseH;
    const shaft = s.el("path", Object.assign({ d: `M${cx - w * .42},${sTop} L${cx + w * .42},${sTop} L${cx + w / 2},${sBot} L${cx - w / 2},${sBot} Z`, fill: MARBLE }, st));
    g.append(shaft);
    for (let i = -2; i <= 2; i++) g.append(s.el("line", { x1: cx + i * w * .16, y1: sTop + 4, x2: cx + i * w * .19, y2: sBot - 4, stroke: "#b9b09d", "stroke-width": 2.5 }));
    const cap = s.el("g");
    if (type === "dorisch") {
      cap.append(s.el("path", Object.assign({ d: `M${cx - w * .42},${y0 + 44} Q${cx - w * .72},${y0 + 22} ${cx - w * .62},${y0 + 18} L${cx + w * .62},${y0 + 18} Q${cx + w * .72},${y0 + 22} ${cx + w * .42},${y0 + 44} Z`, fill: MARBLE }, st)),
        s.el("rect", Object.assign({ x: cx - w * .68, y: y0, width: w * 1.36, height: 18, fill: MARBLE }, st)));
    } else if (type === "ionisch") {
      cap.append(s.el("rect", Object.assign({ x: cx - w * .62, y: y0, width: w * 1.24, height: 12, fill: MARBLE }, st)),
        s.el("path", Object.assign({ d: `M${cx - w * .7},${y0 + 12} L${cx + w * .7},${y0 + 12} L${cx + w * .5},${y0 + 34} L${cx - w * .5},${y0 + 34} Z`, fill: MARBLE }, st)));
      [-1, 1].forEach(sg => {
        const vx = cx + sg * w * .62, vy = y0 + 30;
        cap.append(s.el("circle", Object.assign({ cx: vx, cy: vy, r: 17, fill: MARBLE }, st)),
          s.el("path", { d: `M${vx},${vy - 17} A17,17 0 1 ${sg > 0 ? 1 : 0} ${vx + sg * 0},${vy + 17} A11,11 0 1 ${sg > 0 ? 1 : 0} ${vx},${vy - 5} A6,6 0 1 ${sg > 0 ? 1 : 0} ${vx},${vy + 7}`, fill: "none", stroke: INK, "stroke-width": 2.4 }),
          s.el("circle", { cx: vx, cy: vy + 1, r: 3, fill: INK }));
      });
      cap.append(s.el("path", Object.assign({ d: `M${cx - w * .44},${y0 + 34} Q${cx},${y0 + 56} ${cx + w * .44},${y0 + 34}`, fill: MARBLE }, st)));
    } else {
      cap.append(s.el("path", Object.assign({ d: `M${cx - w * .44},${y0 + 96} L${cx - w * .58},${y0 + 16} L${cx + w * .58},${y0 + 16} L${cx + w * .44},${y0 + 96} Z`, fill: MARBLE }, st)));
      const leaf = (x, yb, hgt, col) => s.el("path", { d: `M${x - 13},${yb} C${x - 16},${yb - hgt * .6} ${x - 8},${yb - hgt} ${x},${yb - hgt} C${x + 8},${yb - hgt} ${x + 16},${yb - hgt * .6} ${x + 13},${yb} Z M${x},${yb} L${x},${yb - hgt + 6}`, fill: col, stroke: "#4d6b2a", "stroke-width": 2 });
      [-2, -1, 0, 1, 2].forEach(i => cap.append(leaf(cx + i * w * .2, y0 + 96, 36, "#a9c47f")));
      [-1.5, -.5, .5, 1.5].forEach(i => cap.append(leaf(cx + i * w * .22, y0 + 74, 34, "#c3d89d")));
      [-1, 1].forEach(sg => cap.append(s.el("path", { d: `M${cx + sg * w * .2},${y0 + 42} Q${cx + sg * w * .62},${y0 + 36} ${cx + sg * w * .62},${y0 + 18} Q${cx + sg * w * .62},${y0 + 8} ${cx + sg * w * .52},${y0 + 12}`, fill: "none", stroke: INK, "stroke-width": 3 })));
      cap.append(s.el("path", Object.assign({ d: `M${cx - w * .74},${y0} L${cx + w * .74},${y0} L${cx + w * .64},${y0 + 16} L${cx - w * .64},${y0 + 16} Z`, fill: MARBLE }, st)));
    }
    g.append(cap);
    let base = null;
    if (baseH) {
      base = s.el("g");
      base.append(s.el("path", Object.assign({ d: `M${cx - w * .56},${sBot} L${cx + w * .56},${sBot} Q${cx + w * .7},${sBot + 10} ${cx + w * .6},${sBot + 14} L${cx - w * .6},${sBot + 14} Q${cx - w * .7},${sBot + 10} ${cx - w * .56},${sBot} Z`, fill: MARBLE }, st)),
        s.el("rect", Object.assign({ x: cx - w * .72, y: sBot + 14, width: w * 1.44, height: 12, fill: MARBLE }, st)));
      g.append(base);
    }
    return { g, cap, shaft, base };
  }

  Deck.unit({
    id: "u10", num: 10, title: "Kunst der Griechen und Römer", color: UC, soft: SOFT,
    subtitle: "Vasen, Säulen, Statuen und Mosaike",
    blurb: "Vasen, Mäander, Säulen, Tempel, Kontrapost, Mosaik, Pergamon",
    goals: [
      "Griechische Vasenformen und ihre Aufgaben kennen",
      "Schwarzfigurig und rotfigurig unterscheiden",
      "Einen Mäander zeichnen und Säulenordnungen erkennen – auch in Berlin",
      "Kontrapost und Mosaik verstehen und eine eigene Vase gestalten",
    ],
    icon(svg, el) {
      svg.append(el("path", { d: "M27,8 L43,8 L41,13 Q40,17 41,21 Q60,27 60,40 Q59,55 44,63 L46,67 L24,67 L26,63 Q11,55 10,40 Q10,27 29,21 Q30,17 29,13 Z", fill: UC, opacity: .9 }),
        el("path", { d: "M14,36 L56,36 M14,46 L56,46", stroke: "#fff", "stroke-width": 2 }),
        el("path", { d: "M14,46 L14,36 L22,36 L22,42 L18,42 L18,46 L26,46 L26,36 L34,36 L34,42 L30,42 L30,46 L38,46 L38,36 L46,36 L46,42 L42,42 L42,46 L50,46 L50,36 L56,36", fill: "none", stroke: "#fff", "stroke-width": 2 }));
    },
    slides: [
      /* 1 ---- Einstieg */
      {
        title: "Kunst der Griechen und Römer",
        say: "Vor über zweitausendfünfhundert Jahren haben die Griechen Vasen bemalt, Tempel gebaut und Statuen gemeißelt. Die Römer haben vieles davon übernommen.",
        build(s) {
          const pic = s.photo("parthenon", { w: 480, h: 420, pos: "50% 55%", caption: "Der Parthenon in Athen", kb: true });
          const cards = [["Vasen", "bemalt in Schwarz und Rot"], ["Säulen", "dorisch, ionisch, korinthisch"], ["Statuen", "Menschen in lockerer Haltung"], ["Mosaike", "Bilder aus kleinen Steinchen"]].map(([a, b]) =>
            s.h("div", { class: "card later", style: { padding: "10px 16px", borderLeft: `8px solid ${UC}` } }, P(s, `<b>${a}</b>`, "t"), P(s, b, "small")));
          const head = P(s, "Die <span class='hl'>Antike</span>: Kunst, die bis heute wirkt", "big");
          const grid = s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } }, ...cards);
          const life = box(s, "life", "In Berlin", "Im <b>Alten Museum</b> stehen echte griechische Vasen und Statuen. Und viele Berliner Gebäude tragen Säulen nach griechischem Vorbild – zum Beispiel das Brandenburger Tor.");
          s.add(cols2(s, pic, stack(s, 14, head, grid, life), 480));
          s.show(pic, "zoom"); s.sound("wind", { vol: .25, dur: 3 });
          s.step(async () => { for (const c of cards) await reveal(s, c, "pop", "pop"); s.say("Vasen, Säulen, Statuen und Mosaike."); });
          s.step(async () => { await reveal(s, life, "up", "ding"); });
        },
      },
      /* 2 ---- Vasenformen */
      {
        title: "Vasen: jede Form hat eine Aufgabe",
        say: "Griechische Vasen waren Alltagsgeschirr. An der Form erkennst du, wofür man sie benutzt hat. Tippe auf eine Vase.",
        build(s) {
          const svg = s.svg(1100, 370);
          const info = {
            amphore: ["Amphore", "Zum <b>Aufbewahren und Transportieren</b> von Wein und Olivenöl. Zwei Henkel zum Tragen. Transport-Amphoren hatten unten eine Spitze – so ließen sie sich im Schiff gut stapeln.", "#7a3b9b"],
            krater: ["Krater", "Ein großes <b>Mischgefäß</b>: Beim Fest mischte man darin Wein mit Wasser. Der Name kommt vom griechischen Wort für „mischen“.", RED],
            kylix: ["Kylix", "Eine flache <b>Trinkschale</b> mit zwei Henkeln und Fuß. Innen am Boden war oft ein Bild – man sah es beim Austrinken.", "#b06a00"],
            hydria: ["Hydria", "Der <b>Wasserkrug</b> für den Brunnen. Drei Henkel: zwei waagerechte zum Heben und Tragen, einen senkrechten zum Ausgießen.", BLUE],
          };
          const order = ["amphore", "krater", "kylix", "hydria"];
          const groups = {};
          order.forEach((k, i) => {
            const cx = 140 + i * 274;
            const g = s.el("g", { class: "later", style: { cursor: "pointer" } });
            const V = vase(s, k);
            const id = "k10liq" + k;
            const clip = s.el("clipPath", { id }, s.el("path", { d: V.v.body }));
            const liq = s.el("rect", { x: 0, y: 260, width: 240, height: 0, fill: info[k][2], opacity: .55, "clip-path": `url(#${id})` });
            V.g.append(clip, liq);
            V.g.setAttribute("transform", `translate(${cx - 120 * 1.2},6) scale(1.2)`);
            const name = s.el("text", { x: cx, y: 360, "text-anchor": "middle", "font-size": 24, "font-weight": 800, fill: INK, text: info[k][0] });
            g.append(V.g, name);
            g.addEventListener("click", () => pick(k));
            svg.append(g); groups[k] = { g, liq, V };
          });
          const tName = s.h("p", { class: "h2", style: { color: UC } }, "Tippe auf eine Vase");
          const tTxt = s.h("p", { class: "t" }, "Form folgt Aufgabe: Hals, Bauch und Henkel verraten, was hinein kam.");
          const panel = s.h("div", { class: "card soft", style: { minHeight: "150px", display: "flex", flexDirection: "column", gap: "6px" } }, tName, tTxt);
          const pick = k => {
            const [n, html] = info[k]; tName.textContent = n; tTxt.innerHTML = html;
            order.forEach(o => groups[o].V.body.setAttribute("stroke-width", o === k ? 6 : 3));
            const { liq } = groups[k]; const top = k === "kylix" ? 112 : 70;
            fx(s, "pop"); s.sound("water-pour", { vol: .4, dur: 1.2 });
            s.tween({ from: 0, to: 1, dur: 900, ease: "out", update: t => { const y = 252 - (252 - top) * t; liq.setAttribute("y", y); liq.setAttribute("height", 252 - y); } });
          };
          s.add(stack(s, 18, svg, panel));
          s.step(async () => { for (const k of order) { fx(s, "pop"); await s.show(groups[k].g, "up"); } });
          order.forEach(k => s.step(async () => { pick(k); s.say(info[k][0]); await s.wait(600); }));
        },
      },
      /* 3 ---- Vasen in echt */
      {
        title: "Echte Vasen aus Athen",
        say: "So sehen echte griechische Vasen aus. Sie sind aus gebranntem Ton und viele hundert Jahre vor Christus entstanden.",
        build(s) {
          const fig = (id, cap, pos, bg = "#e9e6df") => s.h("div", { class: "later" }, s.photo(id, { w: 255, h: 370, fit: "contain", pos, caption: cap, style: { background: bg } }));
          const f1 = fig("amphore", "Amphore", "50% 50%"), f2 = fig("krater", "Krater", "50% 50%"), f3 = fig("kylix-rotfigurig", "Kylix", "50% 50%", "linear-gradient(#929292, #b6b6b6)"), f4 = fig("hydria", "Hydria", "50% 50%");
          const m = merk(s, "Die Vasen sind aus <b>Ton</b>. Die schwarze Farbe ist ein feiner <b>Glanzton</b>, der beim Brennen im Ofen schwarz wird.");
          const life = box(s, "life", "Im Alltag", "Heute: Weinflasche, Karaffe, Trinkglas und Gießkanne. Auch unser Geschirr hat Formen, die zu seiner Aufgabe passen.");
          s.add(stack(s, 16, s.h("div", { class: "cols4", style: { gap: "14px" } }, f1, f2, f3, f4), s.h("div", { class: "cols", style: { gap: "18px", alignItems: "stretch" } }, m, life)));
          s.step(async () => { for (const f of [f1, f2, f3, f4]) { fx(s, "whoosh"); await s.show(f, "zoom"); } });
          s.step(async () => { await reveal(s, m, "up", "ding"); });
          s.step(async () => { await reveal(s, life, "up", "pop"); });
        },
      },
      /* 4 ---- So wurde gemalt */
      {
        title: "Schwarzfigurig und rotfigurig",
        say: "Es gibt zwei Arten, Vasen zu bemalen. Schwarzfigurig: Die Figur ist schwarz. Rotfigurig: Der Hintergrund ist schwarz, die Figur bleibt tonrot.",
        build(s) {
          const panel = (title) => {
            const svg = s.svg(500, 330);
            svg.append(s.el("rect", { x: 0, y: 0, width: 500, height: 330, rx: 18, fill: TERRA }));
            const bg = s.el("rect", { x: 0, y: 0, width: 500, height: 330, rx: 18, fill: BLK, opacity: 0 });
            const outline = s.el("g", { class: "later" });
            const fill = s.el("g", { opacity: 0 });
            const det = s.el("g", { class: "later" });
            svg.append(bg, fill, outline, det);
            return { svg, bg, outline, fill, det, cap: s.h("p", { class: "h2", style: { textAlign: "center" } }, title) };
          };
          // the owl of Athens (own drawing, 100×80 box scaled ×3.3)
          const A = panel("schwarzfigurig"), B = panel("rotfigurig");
          const place = el => el.setAttribute("transform", "translate(85,30) scale(3.3)");
          [A, B].forEach(p => { [p.fill, p.outline, p.det].forEach(place); });
          A.fill.append(s.el("path", { d: OWL, fill: BLK }), s.el("path", { d: "M14,76 L86,76", stroke: BLK, "stroke-width": 4, "stroke-linecap": "round" }));
          A.outline.append(s.el("path", { d: OWL, fill: "none", stroke: BLK, "stroke-width": .8, "stroke-dasharray": "2 1.6" }));
          OWL_DET.forEach(d => A.det.append(s.el("path", { d, fill: "none", stroke: TERRA, "stroke-width": 1.1, "stroke-linecap": "round" })));
          B.fill.append(s.el("path", { d: OWL, fill: TERRA }), s.el("path", { d: "M14,76 L86,76", stroke: TERRA, "stroke-width": 4, "stroke-linecap": "round" }));
          B.outline.append(s.el("path", { d: OWL, fill: "none", stroke: BLK, "stroke-width": 1 }));
          OWL_DET.forEach(d => B.det.append(s.el("path", { d, fill: "none", stroke: BLK, "stroke-width": .75, "stroke-linecap": "round" })));
          const stepA = s.h("p", { class: "small later", style: { textAlign: "center", minHeight: "54px" } }, "");
          const stepB = s.h("p", { class: "small later", style: { textAlign: "center", minHeight: "54px" } }, "");
          const m = merk(s, "<b>Schwarzfigurig:</b> schwarze Figur, Linien <b>eingeritzt</b>. <b>Rotfigurig:</b> schwarzer Hintergrund, Linien mit dem <b>Pinsel</b> gemalt – viel feiner.");
          s.add(stack(s, 12, s.h("div", { class: "cols", style: { gap: "40px" } }, stack(s, 6, A.cap, A.svg, stepA), stack(s, 6, B.cap, B.svg, stepB)), m));
          s.show([A.svg, B.svg], "fade"); fx(s, "whoosh");
          s.step(async () => {
            stepA.textContent = "1. Figur mit schwarzem Glanzton malen"; stepB.textContent = "1. Umriss der Figur vorzeichnen";
            s.show([stepA, stepB], "fade"); s.sound("pinsel-strich", { vol: .6 });
            s.show(B.outline, "draw");
            await s.tween({ from: 0, to: 1, dur: 900, update: v => A.fill.setAttribute("opacity", v) });
          });
          s.step(async () => {
            stepA.textContent = "2. Details mit einer Nadel einritzen"; stepB.textContent = "2. Hintergrund schwarz malen – die Figur bleibt frei";
            s.sound("schnitzen", { vol: .6 }); s.show(A.det, "draw");
            B.fill.setAttribute("opacity", 1);
            await s.tween({ from: 0, to: 1, dur: 900, update: v => B.bg.setAttribute("opacity", v) });
            B.svg.append(B.fill, B.outline);
          });
          s.step(async () => {
            stepA.textContent = "Fertig: schwarze Figur auf rotem Ton"; stepB.textContent = "3. Details mit dem Pinsel malen";
            s.sound("pinsel-strich", { vol: .6 }); await s.show(B.det, "draw"); B.svg.append(B.det); s.say("Rotfigurig kann man viel feinere Linien malen.");
          });
          s.step(async () => { await reveal(s, m, "up", "ding"); });
        },
      },
      /* 5 ---- Zeitleiste + Vergleich */
      {
        title: "Erst schwarz, dann rot",
        say: "Die schwarzfigurige Malerei ist älter. Um fünfhundertdreißig vor Christus wurde in Athen die rotfigurige Malerei erfunden.",
        build(s) {
          const p1 = s.photo("amphore", { w: 250, h: 320, fit: "contain", caption: "schwarzfigurig", style: { background: "#e9e6df" } });
          const p2 = s.photo("kylix-innenbild", { w: 320, h: 320, fit: "cover", caption: "rotfigurig (Innenbild)" });
          const svg = s.svg(470, 210);
          const X = y => 30 + (700 - y) * 410 / 400; // 700 … 300 v. Chr.
          svg.append(s.el("line", { x1: 20, x2: 450, y1: 120, y2: 120, stroke: INK, "stroke-width": 4, "stroke-linecap": "round" }), s.el("polygon", { points: "452,112 466,120 452,128", fill: INK }));
          [700, 600, 500, 400, 300].forEach(y => svg.append(s.el("line", { x1: X(y), x2: X(y), y1: 112, y2: 128, stroke: INK, "stroke-width": 3 }), s.el("text", { x: X(y), y: 152, "text-anchor": "middle", "font-size": 19, fill: INK, text: y })));
          svg.append(s.el("text", { x: 450, y: 184, "text-anchor": "end", "font-size": 19, fill: "#5d6678", text: "Jahre v. Chr." }));
          const barA = s.el("rect", { x: X(700), y: 76, width: X(450) - X(700), height: 26, rx: 8, fill: BLK, class: "later" });
          const labA = s.el("text", { x: X(700) + 8, y: 66, "font-size": 20, "font-weight": 700, fill: INK, text: "schwarzfigurig ab 7. Jh.", class: "later" });
          const barB = s.el("rect", { x: X(530), y: 20, width: X(300) - X(530), height: 26, rx: 8, fill: TERRA, class: "later" });
          const labB = s.el("text", { x: X(530) - 6, y: 40, "text-anchor": "end", "font-size": 20, "font-weight": 700, fill: TERRA, text: "rotfigurig ab ca. 530", class: "later" });
          svg.append(barA, labA, barB, labB);
          const f1 = box(s, "ex", "Schwarzfigurig", "Zuerst in <b>Korinth</b> im 7. Jahrhundert v. Chr., dann vor allem in Athen.");
          const f2 = box(s, "ex", "Rotfigurig", "Erfunden um <b>530 v. Chr.</b> in Athen. Als Erfinder gilt der sogenannte <b>Andokides-Maler</b>.");
          const f3 = box(s, "life", "Gut zu wissen", "Die Preis-Amphoren für die Sieger der Panathenäen-Spiele in Athen – gefüllt mit Olivenöl – blieben noch lange schwarzfigurig.");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "250px 320px 1fr", gap: "20px", alignItems: "center", height: "100%" } }, p1, p2, stack(s, 10, svg, f1, f2, f3)));
          s.show([p1, p2], "zoom"); fx(s, "whoosh");
          s.step(async () => { fx(s, "swoosh"); s.show(labA, "fade"); await s.show(barA, "left"); await reveal(s, f1, "left", "pop"); });
          s.step(async () => { fx(s, "swoosh"); s.show(labB, "fade"); await s.show(barB, "left"); await reveal(s, f2, "left", "pop"); });
          s.step(async () => { await reveal(s, f3, "up", "ding"); });
        },
      },
      /* 6 ---- Mäander Schritt für Schritt */
      {
        title: "Den Mäander zeichnen",
        say: "Der Mäander ist das berühmteste griechische Muster. Mit Kästchen-Papier kannst du ihn ganz leicht zeichnen.",
        build(s) {
          const U = 26, X0 = 40, Y0 = 80, N = 6;
          const svg = s.svg(700, 300);
          for (let i = 0; i <= 26; i++) svg.append(s.el("line", { x1: X0 + i * U, x2: X0 + i * U, y1: Y0 - 2 * U, y2: Y0 + 6 * U, stroke: "#c9d8e4", "stroke-width": 1.5 }));
          for (let j = -2; j <= 6; j++) svg.append(s.el("line", { x1: X0, x2: X0 + 26 * U, y1: Y0 + j * U, y2: Y0 + j * U, stroke: "#c9d8e4", "stroke-width": 1.5 }));
          const rails = s.el("g", { class: "later" });
          rails.append(s.el("line", { x1: X0, x2: X0 + 24 * U, y1: Y0 - U, y2: Y0 - U, stroke: UC, "stroke-width": 4 }), s.el("line", { x1: X0, x2: X0 + 24 * U, y1: Y0 + 5 * U, y2: Y0 + 5 * U, stroke: UC, "stroke-width": 4 }));
          svg.append(rails);
          // one module: up 4, right 3, down 2, left 2, down 2, right 3
          const moves = [[0, -4, "4 hoch"], [3, 0, "3 nach rechts"], [0, 2, "2 runter"], [-2, 0, "2 nach links"], [0, 2, "2 runter"], [3, 0, "3 nach rechts"]];
          const segs = []; let x = X0, y = Y0 + 4 * U;
          for (let m = 0; m < N; m++) moves.forEach(([dx, dy], i) => {
            const l = s.el("line", { x1: x, y1: y, x2: x + dx * U, y2: y + dy * U, stroke: BLK, "stroke-width": 6, "stroke-linecap": "square", class: "later" });
            svg.append(l); segs.push({ l, m, i }); x += dx * U; y += dy * U;
          });
          const pen = s.el("circle", { cx: X0, cy: Y0 + 4 * U, r: 9, fill: RED });
          svg.append(pen);
          const lst = moves.map(([, , t], i) => s.h("div", { class: "card later", style: { padding: "4px 14px", display: "flex", gap: "12px", alignItems: "center" } }, s.h("b", { class: "t", style: { color: UC, width: "22px" } }, String(i + 1)), s.h("span", { class: "t" }, t)));
          const rep = P(s, "… und dann <b>wieder von vorn</b>!", "t", true);
          const nameBox = box(s, "ex", "Woher der Name?", "Der Mäander heißt nach dem Fluss <b>Maiandros</b> in der heutigen Türkei (heute: Büyük Menderes). Er schlängelt sich in vielen Schleifen.");
          const tip = box(s, "life", "Tipp", "Erst die zwei Randlinien ziehen, dann Kästchen zählen. Er läuft rings um viele Vasen und an Tempeln entlang.");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "700px 1fr", gap: "24px", alignItems: "center", height: "100%" } }, stack(s, 12, svg, nameBox, tip), stack(s, 8, ...lst, rep)));
          s.show(svg, "fade");
          const go = async (seg) => { await s.show(seg.l, "draw"); pen.setAttribute("cx", seg.l.getAttribute("x2")); pen.setAttribute("cy", seg.l.getAttribute("y2")); };
          s.step(async () => { fx(s, "scribble"); await s.show(rails, "draw"); s.say("Zuerst zwei Randlinien."); });
          s.step(async () => { for (const seg of segs.filter(q => q.m === 0)) { s.sfx.count(seg.i); s.show(lst[seg.i], "left"); await go(seg); } s.say("Hoch, rechts, runter, links, runter, rechts."); });
          s.step(async () => { await reveal(s, rep, "pop", "ding"); for (const seg of segs.filter(q => q.m > 0)) { s.sfx.tick(); s.show(seg.l, "fade"); pen.setAttribute("cx", seg.l.getAttribute("x2")); pen.setAttribute("cy", seg.l.getAttribute("y2")); await s.wait(70); } });
          s.step(async () => { await reveal(s, nameBox, "up", "pop"); });
          s.step(async () => { await reveal(s, tip, "up", "pop"); });
        },
      },
      /* 7 ---- Ornamentbänder */
      {
        title: "Ornamentbänder: Muster in Reihe",
        say: "Ein Ornamentband ist ein Muster, das sich immer wiederholt. Es läuft wie ein Gürtel rund um die Vase.",
        build(s) {
          const bandSvg = (fn, h = 44) => { const v = s.svg(560, h + 12); v.append(s.el("rect", { x: 0, y: 0, width: 560, height: h + 12, rx: 8, fill: TERRA })); const p = s.el("path", { d: fn(10, 6, 540, h), fill: "none", stroke: BLK, "stroke-width": 4 }); v.append(p); return { v, p }; };
          const palm = () => { const v = s.svg(560, 56); v.append(s.el("rect", { x: 0, y: 0, width: 560, height: 56, rx: 8, fill: TERRA })); const g = s.el("g"); for (let i = 0; i < 8; i++) { const cx = 38 + i * 69; for (let k = -2; k <= 2; k++) g.append(s.el("ellipse", { cx, cy: 26, rx: 3.6, ry: 13 - Math.abs(k) * 1.5, fill: BLK, transform: `rotate(${k * 26} ${cx} 44)` })); g.append(s.el("path", { d: `M${cx - 16},50 Q${cx},38 ${cx + 16},50`, fill: "none", stroke: BLK, "stroke-width": 3 })); if (i < 7) g.append(s.el("path", { d: `M${cx + 18},48 Q${cx + 34},20 ${cx + 51},48`, fill: "none", stroke: BLK, "stroke-width": 2.5 })); } v.append(g); return { v, p: g }; };
          const rows = [["Mäander", "rechtwinklig, wie ein Schlüssel", bandSvg(meanderD)], ["Wellenband", "rollt wie Wellen am Meer", bandSvg(waveD)], ["Zickzack", "spitz auf, spitz ab", bandSvg(zigD, 34)], ["Palmetten", "Blätter wie ein Fächer", palm()]];
          const rowEls = rows.map(([n, t, b]) => s.h("div", { class: "later", style: { display: "grid", gridTemplateColumns: "190px 560px", gap: "14px", alignItems: "center" } }, stack(s, 0, P(s, `<b>${n}</b>`, "t"), P(s, t, "small")), b.v));
          // vase with a band that can be switched
          const vs = s.svg(260, 280); let cur = null;
          const draw = k => { if (cur) cur.remove(); cur = decoratedVase(s, { kind: "amphore", tech: "schwarz", band: k, pic: "eule" }); cur.setAttribute("transform", "translate(10,10)"); vs.append(cur); };
          draw("maeander");
          const grp = pillGroup(s, [["maeander", "Mäander"], ["welle", "Welle"], ["zickzack", "Zickzack"]], k => { draw(k); s.sound("pinsel-strich", { vol: .5 }); }, "maeander");
          const right = stack(s, 10, vs, prow(s, "", Object.values(grp.btns)));
          const m = merk(s, "<b>Ornament</b> = Schmuck-Muster. Ein Teil (Rapport) wiederholt sich immer wieder – wie beim Stempeldruck.");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 270px", gap: "24px", alignItems: "center", height: "100%" } }, stack(s, 12, ...rowEls, m), right));
          s.show(vs, "zoom"); fx(s, "pop");
          rowEls.forEach((r, i) => s.step(async () => { await reveal(s, r, "left", "swoosh"); s.say(rows[i][0]); }));
          s.step(async () => { await reveal(s, m, "up", "ding"); grp.pick("welle"); await s.wait(700); grp.pick("maeander"); });
        },
      },
      /* 8 ---- Säulenordnungen */
      {
        title: "Drei Säulen-Ordnungen",
        say: "Griechische Säulen erkennst du am Kapitell, dem Kopf der Säule. Dorisch ist schlicht, ionisch hat Schnecken, korinthisch hat Blätter.",
        build(s) {
          const svg = s.svg(1100, 330);
          const defs = [["dorisch", 190], ["ionisch", 550], ["korinthisch", 910]];
          const cs = defs.map(([t, cx]) => { const c = column(s, t, cx, 10, 320, 74); c.g.classList.add("later"); svg.append(c.g); return c; });
          const txt = {
            dorisch: "<b>Dorisch:</b> schlicht und kräftig. Das Kapitell sieht aus wie ein Kissen mit einer Platte. Bei den Griechen ohne Fuß (Basis).",
            ionisch: "<b>Ionisch:</b> schlanker, mit einem Fuß. Am Kapitell rollen sich zwei <b>Schnecken</b> (Voluten) ein.",
            korinthisch: "<b>Korinthisch:</b> das Kapitell ist ein Korb aus <b>Akanthus-Blättern</b>. Die Römer bauten sehr gern so.",
          };
          const cards = defs.map(([t]) => s.h("div", { class: "card later", style: { padding: "10px 14px" } }, P(s, txt[t], "small")));
          const legend = box(s, "life", "Eine alte Geschichte", "Der Römer Vitruv erzählt: Ein Bildhauer sah einen Korb auf einem Grab, um den Akanthus wuchs – so kam er auf das korinthische Kapitell.");
          s.add(stack(s, 10, svg, s.h("div", { class: "cols3" }, ...cards), legend));
          cs.forEach((c, i) => s.step(async () => {
            fx(s, "whoosh"); await s.show(c.g, "up");
            const r = s.el("rect", { x: defs[i][1] - 70, y: 2, width: 140, height: i === 2 ? 112 : 66, rx: 12, fill: "none", stroke: RED, "stroke-width": 4, "stroke-dasharray": "9 6" });
            svg.append(r); s.show(r, "draw"); fx(s, "ding"); await reveal(s, cards[i], "up", "pop"); s.say(defs[i][0]);
          }));
          s.step(async () => { await reveal(s, legend, "up", "pop"); });
        },
      },
      /* 9 ---- Säulen in Berlin */
      {
        title: "Säulen in Berlin",
        say: "In Berlin findest du griechische Säulen an vielen Gebäuden. Das Brandenburger Tor hat dorische Säulen, das Alte Museum ionische.",
        build(s) {
          const card = (id, pos, cap, html) => s.h("div", { class: "card later", style: { padding: "10px", display: "flex", flexDirection: "column", gap: "8px" } }, s.photo(id, { w: 512, h: 300, pos, caption: cap }), P(s, html, "small"));
          const c1 = card("brandenburger-tor", "50% 55%", "Brandenburger Tor", "<b>Dorisch:</b> 12 Säulen in zwei Reihen. Gebaut 1789–1793 von Carl Gotthard Langhans. Vorbild war das Tor zur Akropolis in Athen. Anders als bei den Griechen haben die Säulen hier einen Fuß.");
          const c2 = card("altes-museum", "50% 60%", "Altes Museum am Lustgarten", "<b>Ionisch:</b> 18 Säulen an der Vorderseite. Gebaut 1825–1830 von Karl Friedrich Schinkel. Drinnen, in der runden Halle, stehen 20 <b>korinthische</b> Säulen.");
          const m = merk(s, "Achte auf das <b>Kapitell</b>: Kissen = dorisch, Schnecken = ionisch, Blätter = korinthisch.");
          s.add(stack(s, 14, s.h("div", { class: "cols", style: { gap: "24px" } }, c1, c2), m));
          s.step(async () => { await reveal(s, c1, "zoom", "whoosh"); s.say("Das Brandenburger Tor: dorisch."); });
          s.step(async () => { await reveal(s, c2, "zoom", "whoosh"); s.say("Das Alte Museum: ionisch."); });
          s.step(async () => { await reveal(s, m, "up", "ding"); });
        },
      },
      /* 10 ---- Tempel */
      {
        title: "Der Tempel: Stufen, Säulen, Giebel",
        say: "Ein griechischer Tempel ist wie aus Bausteinen gebaut: unten Stufen, dann Säulen, darauf das Gebälk und oben der Giebel.",
        build(s) {
          const svg = s.svg(600, 470);
          const parts = {};
          const mk = (k, ...els) => { const g = s.el("g", { class: "later", style: { cursor: "pointer" } }); g.append(...els); svg.append(g); parts[k] = g; g.addEventListener("click", () => hi(k)); return g; };
          const st = { stroke: INK, "stroke-width": 3, "stroke-linejoin": "round" };
          mk("stufen", ...[0, 1, 2].map(i => s.el("rect", Object.assign({ x: 20 + i * 16, y: 440 - i * 18, width: 560 - i * 32, height: 18, fill: STONE }, st))));
          const cols = []; for (let i = 0; i < 6; i++) { const cx = 92 + i * 83; cols.push(s.el("rect", Object.assign({ x: cx - 22, y: 222, width: 44, height: 182, fill: MARBLE }, st)), s.el("rect", Object.assign({ x: cx - 30, y: 208, width: 60, height: 14, fill: MARBLE }, st))); for (let f = -1; f <= 1; f++) cols.push(s.el("line", { x1: cx + f * 11, x2: cx + f * 11, y1: 226, y2: 400, stroke: "#b9b09d", "stroke-width": 2.5 })); }
          mk("saeulen", ...cols);
          const geb = [s.el("rect", Object.assign({ x: 44, y: 172, width: 512, height: 36, fill: MARBLE }, st)), s.el("rect", Object.assign({ x: 44, y: 136, width: 512, height: 36, fill: "#ece4d2" }, st))];
          for (let i = 0; i < 13; i++) { const x = 52 + i * 40; geb.push(s.el("rect", { x, y: 140, width: 14, height: 28, fill: "#4a6fa5" })); if (i < 12) geb.push(s.el("rect", { x: x + 18, y: 140, width: 18, height: 28, fill: "#c9573c", opacity: .75 })); }
          mk("gebaelk", ...geb);
          const fig = [];
          [[200, 116], [260, 98], [300, 88], [340, 98], [400, 116]].forEach(([x, y]) => fig.push(s.el("circle", { cx: x, cy: y - 8, r: 7, fill: "#c9b78f" }), s.el("rect", { x: x - 7, y: y, width: 14, height: 128 - y, rx: 5, fill: "#c9b78f" })));
          mk("giebel", s.el("polygon", Object.assign({ points: "36,136 300,40 564,136", fill: "#ece4d2" }, st)), s.el("polygon", { points: "80,128 300,56 520,128", fill: "#5b84b8", opacity: .35 }), ...fig);
          const items = [["giebel", "Giebel", "Dreieck oben. Im Giebelfeld standen oft Figuren.", "#5b84b8"], ["gebaelk", "Gebälk", "Liegt auf den Säulen: Architrav und Fries (bei dorischen Tempeln mit Triglyphen und Metopen).", "#c9573c"], ["saeulen", "Säulen", "Tragen das Dach. Hier: dorisch.", "#8a8170"], ["stufen", "Stufen", "Der Unterbau. Der Tempel steht erhöht.", "#a8977a"]];
          const lst = items.map(([k, n, t, c]) => { const r = s.h("button", { class: "card later", style: { font: "inherit", color: INK, textAlign: "left", cursor: "pointer", padding: "8px 14px", borderLeft: `10px solid ${c}`, display: "flex", flexDirection: "column", gap: "2px" }, onclick: () => hi(k) }, P(s, `<b>${n}</b>`, "t"), P(s, t, "small")); return [k, r]; });
          const L = Object.fromEntries(lst);
          const hi = k => { fx(s, "pop"); Object.entries(parts).forEach(([kk, g]) => g.style.opacity = kk === k ? 1 : .35); Object.entries(L).forEach(([kk, r]) => r.style.background = kk === k ? SOFT : "#fff"); s.wait(1400).then(() => { if (!s.alive) return; Object.values(parts).forEach(g => g.style.opacity = 1); }); };
          const ph = s.h("div", { class: "later", style: { display: "flex", gap: "12px", alignItems: "center" } }, s.photo("parthenon", { w: 190, h: 120, pos: "50% 55%" }), P(s, "Vorbild: der <b>Parthenon</b> in Athen, ab 447 v. Chr. gebaut, mit 46 dorischen Säulen außen.", "small"));
          s.add(cols2(s, svg, stack(s, 8, L.giebel, L.gebaelk, L.saeulen, L.stufen, ph), 600, 24));
          const build = async (k, snd) => { fx(s, snd); await s.show(parts[k], "up"); await s.show(L[k], "left"); };
          s.step(async () => { await build("stufen", "drum"); s.say("Zuerst die Stufen."); });
          s.step(async () => { await build("saeulen", "drum"); s.say("Dann die Säulen."); });
          s.step(async () => { await build("gebaelk", "drum"); s.say("Darauf das Gebälk."); });
          s.step(async () => { await build("giebel", "success"); s.say("Und oben der Giebel."); });
          s.step(async () => { await reveal(s, ph, "up", "pop"); });
        },
      },
      /* 11 ---- Kontrapost interaktiv */
      {
        title: "Kontrapost: Standbein, Spielbein",
        say: "Ältere Statuen stehen steif. Später haben griechische Bildhauer den Kontrapost erfunden: Ein Bein trägt, das andere ist locker. Zieh am Regler.",
        build(s) {
          const svg = s.svg(420, 500);
          svg.append(s.el("rect", { x: 90, y: 456, width: 240, height: 30, rx: 6, fill: STONE, stroke: INK, "stroke-width": 3 }));
          const limb = (c, w) => s.el("path", { fill: "none", stroke: c, "stroke-width": w, "stroke-linecap": "round", "stroke-linejoin": "round" });
          const legS = limb("#cbbfa6", 26), legP = limb("#cbbfa6", 26), body = s.el("path", { fill: "#e3d9c4", stroke: INK, "stroke-width": 3 }), armL = limb("#cbbfa6", 18), armR = limb("#cbbfa6", 18);
          const head = s.el("circle", { r: 30, fill: "#e3d9c4", stroke: INK, "stroke-width": 3 });
          const neck = s.el("line", { stroke: INK, "stroke-width": 26, "stroke-linecap": "round" }), neckIn = s.el("line", { stroke: "#e3d9c4", "stroke-width": 20, "stroke-linecap": "round" });
          const legO = [limb(INK, 32), limb(INK, 32)], armO = [limb(INK, 24), limb(INK, 24)];
          const hipL = s.el("line", { stroke: RED, "stroke-width": 4, "stroke-dasharray": "10 6" }), shL = s.el("line", { stroke: BLUE, "stroke-width": 4, "stroke-dasharray": "10 6" });
          const axes = s.el("g", { class: "later" }); axes.append(hipL, shL);
          svg.append(legO[0], legO[1], legS, legP, armO[0], armO[1], armL, armR, neck, neckIn, body, head, axes);
          const lab = s.el("g", { class: "later" });
          const tS = s.el("text", { "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: INK, text: "Standbein" }), tP = s.el("text", { "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: INK, text: "Spielbein" });
          lab.append(tS, tP); svg.append(lab);
          const draw = t => {
            const hx = 210 - 14 * t, hy = 262, a = 9 * t * Math.PI / 180, b = -7 * t * Math.PI / 180;
            const hlx = hx - 34 * Math.cos(a), hly = hy - 34 * Math.sin(a), hrx = hx + 34 * Math.cos(a), hry = hy + 34 * Math.sin(a);
            const sx = 210 - 4 * t, sy = 130, slx = sx - 58 * Math.cos(b), sly = sy - 58 * Math.sin(b), srx = sx + 58 * Math.cos(b), sry = sy + 58 * Math.sin(b);
            // Standbein (viewer's left): straight; Spielbein (right): bent knee, foot to the side and back
            const fSx = hlx + 4, fSy = 450, kSx = (hlx + fSx) / 2, kSy = (hly + fSy) / 2;
            const fPx = hrx + 22 * t, fPy = 450 - 10 * t, kPx = (hrx + fPx) / 2 + 2 + 14 * t, kPy = (hry + fPy) / 2 - 4 * t;
            const dS = `M${hlx},${hly} L${kSx},${kSy} L${fSx},${fSy} l-18,0`, dP = `M${hrx},${hry} L${kPx},${kPy} L${fPx},${fPy} l18,${-6 * t}`;
            [legS, legO[0]].forEach(e => e.setAttribute("d", dS)); [legP, legO[1]].forEach(e => e.setAttribute("d", dP));
            const wy = (sy + hy) / 2 + 10, wlx = (slx + hlx) / 2 + 12 + 4 * t, wrx = (srx + hrx) / 2 - 12 + 4 * t;
            body.setAttribute("d", `M${slx},${sly} L${srx},${sry} Q${srx - 4},${(sry + wy) / 2} ${wrx},${wy} Q${hrx - 2},${(wy + hry) / 2} ${hrx + 4},${hry + 8} L${hlx - 4},${hly + 8} Q${hlx + 2},${(wy + hly) / 2} ${wlx},${wy} Q${slx + 4},${(sly + wy) / 2} ${slx},${sly} Z`);
            neck.setAttribute("x1", sx); neck.setAttribute("y1", sy); neck.setAttribute("x2", sx - 4 * t); neck.setAttribute("y2", sy - 24);
            const dL = `M${slx + 4},${sly + 6} L${slx - 10},${sly + 78} L${slx - 6 + 4 * t},${sly + 150}`, dR = `M${srx - 4},${sry + 6} L${srx + 10},${sry + 78} L${srx + 6 - 4 * t},${sry + 150 - 6 * t}`;
            [armL, armO[0]].forEach(e => e.setAttribute("d", dL)); [armR, armO[1]].forEach(e => e.setAttribute("d", dR));
            ["x1", "y1", "x2", "y2"].forEach(k => neckIn.setAttribute(k, neck.getAttribute(k)));
            head.setAttribute("cx", sx - 6 * t); head.setAttribute("cy", sy - 46); head.setAttribute("transform", `rotate(${-8 * t} ${sx} ${sy})`);
            hipL.setAttribute("x1", hlx - 40 * Math.cos(a)); hipL.setAttribute("y1", hly - 40 * Math.sin(a)); hipL.setAttribute("x2", hrx + 40 * Math.cos(a)); hipL.setAttribute("y2", hry + 40 * Math.sin(a));
            shL.setAttribute("x1", slx - 30 * Math.cos(b)); shL.setAttribute("y1", sly - 30 * Math.sin(b)); shL.setAttribute("x2", srx + 30 * Math.cos(b)); shL.setAttribute("y2", sry + 30 * Math.sin(b));
            tS.setAttribute("x", 90); tS.setAttribute("y", 400); tP.setAttribute("x", 336); tP.setAttribute("y", 400);
            lab.setAttribute("opacity", t > .5 ? 1 : 0);
          };
          let tt = 0; draw(0);
          const sl = s.slider({ label: "Haltung", min: 0, max: 100, step: 1, value: 0, fmt: v => v < 10 ? "steif" : v > 90 ? "Kontrapost" : v + " %", onInput: v => { tt = v / 100; draw(tt); } });
          const slW = s.h("div", { class: "later" }, sl);
          const c1 = box(s, "ex", "Standbein", "trägt das ganze Gewicht. Auf dieser Seite ist die <b style='color:#dc3b2a'>Hüfte höher</b>.");
          const c2 = box(s, "ex", "Spielbein", "ist locker und leicht gebeugt, der Fuß steht etwas zur Seite.");
          const c3 = box(s, "ex", "Gegenbewegung", "Die <b style='color:#1d5bd0'>Schultern</b> kippen genau andersherum als die Hüfte. Der Körper wirkt lebendig.");
          const m = merk(s, "<b>Kontrapost</b> (italienisch „contrapposto“) = Stand- und Spielbein, Hüfte und Schultern gegeneinander geneigt.");
          s.add(cols2(s, svg, stack(s, 10, slW, c1, c2, c3, m), 420, 24));
          s.show(svg, "up"); fx(s, "pop");
          const inp = sl.querySelector("input");
          const anim = async (to) => { const from = tt; await s.tween({ from, to, dur: 1200, ease: "inOut", update: v => { tt = v; draw(v); if (inp) inp.value = Math.round(v * 100); } }); tt = to; if (inp) { inp.value = Math.round(to * 100); inp.dispatchEvent(new Event("input")); } else draw(to); };
          s.step(async () => { s.show(slW, "fade"); fx(s, "boing"); await anim(1); s.show(lab, "fade"); await reveal(s, c1, "left", "pop"); await reveal(s, c2, "left", "pop"); });
          s.step(async () => { await s.show(axes, "draw"); await reveal(s, c3, "left", "pop"); s.say("Die rote Hüftlinie und die blaue Schulterlinie kippen gegeneinander."); });
          s.step(async () => { await reveal(s, m, "up", "ding"); });
        },
      },
      /* 12 ---- Doryphoros */
      {
        title: "Der Speerträger von Polyklet",
        say: "Der berühmteste Kontrapost ist der Doryphoros, der Speerträger. Ihn hat der griechische Bildhauer Polyklet im fünften Jahrhundert vor Christus geschaffen.",
        build(s) {
          const pic = s.photo("doryphoros", { w: 300, h: 600, fit: "cover", pos: "50% 40%", kb: true });
          const fact = (big, t) => s.h("div", { class: "card later", style: { padding: "8px 16px", display: "flex", gap: "14px", alignItems: "baseline", borderLeft: `10px solid ${UC}` } }, s.h("b", { class: "h2", style: { color: UC, minWidth: "150px" }, html: big }), s.h("span", { class: "t", html: t }));
          const f1 = fact("Polyklet", "griechischer Bildhauer, 5. Jahrhundert v. Chr.");
          const f2 = fact("Bronze", "Das Original ist verloren. Erhalten sind <b>römische Kopien</b> aus Marmor.");
          const f3 = fact("Pompeji", "Diese Kopie wurde in Pompeji gefunden und steht heute in Neapel.");
          const f4 = fact("Kanon", "Polyklet berechnete die Maße des Körpers mit festen Verhältnissen.");
          const life = box(s, "life", "Probier es aus", "Stell dich hin wie der Speerträger: Gewicht auf ein Bein, das andere locker. Spürst du, wie die Hüfte kippt? Probier die Haltung auch beim nächsten Foto – sie wirkt locker und lebendig.");
          s.add(cols2(s, pic, stack(s, 10, f1, f2, f3, f4, life), 300, 30));
          s.show(pic, "zoom"); fx(s, "whoosh");
          s.step(async () => { await reveal(s, f1, "left", "pop"); await reveal(s, f2, "left", "pop"); });
          s.step(async () => { await reveal(s, f3, "left", "pop"); await reveal(s, f4, "left", "pop"); });
          s.step(async () => { await reveal(s, life, "up", "ding"); });
        },
      },
      /* 13 ---- Mosaik */
      {
        title: "Römische Mosaike",
        say: "Die Römer legten Bilder aus vielen kleinen Steinchen. Das nennt man Mosaik. Das größte Beispiel aus Pompeji hat rund eine Million Steinchen.",
        build(s) {
          const big = s.photo("alexandermosaik", { w: 640, h: 400, pos: "50% 50%", caption: "Alexandermosaik, Pompeji (heute in Neapel)" });
          const zoomFig = s.h("div", { class: "later" }, s.photo("alexandermosaik-detail", { w: 300, h: 214, pos: "30% 40%", caption: "Ausschnitt: Alexander" }));
          const f1 = box(s, "ex", "Steinchen", "Ein Steinchen heißt <b>Tessera</b> (Mehrzahl: Tesserae) – aus Stein, Glas oder Ton.");
          const f2 = box(s, "ex", "Riesig", "5,82 × 3,13 m groß und aus rund <b>1 Million</b> Steinchen, 5 bis 6 auf einem Quadratzentimeter.");
          const f3 = box(s, "ex", "Gefunden", "<b>1831</b> in Pompeji, in einem Wohnhaus, der „Casa del Fauno“. Es zeigt Alexander den Großen in einer Schlacht.");
          // zoom-in demo: pixel grid over a colour gradient
          const cv = s.svg(300, 150);
          const pal = ["#e9dcc0", "#d7b98a", "#b9875a", "#8d5a3a", "#5a3a2a", "#2d2420"];
          const tiles = [];
          for (let j = 0; j < 6; j++) for (let i = 0; i < 12; i++) { const r = s.el("rect", { x: i * 25 + 1.5, y: j * 25 + 1.5, width: 22, height: 22, rx: 3, fill: pal[Math.min(5, Math.floor((i + j * 1.3) / 3.2))], class: "later" }); cv.append(r); tiles.push(r); }
          const left = stack(s, 12, big, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "16px", alignItems: "flex-start" } }, zoomFig, s.h("div", { class: "stack", style: { gap: "4px" } }, cv, P(s, "Aus der Nähe: lauter kleine Steinchen", "small"))));
          s.add(cols2(s, left, stack(s, 12, f1, f2, f3), 640, 24));
          s.show(big, "zoom"); fx(s, "whoosh");
          s.step(async () => { await s.show(zoomFig, "zoom"); for (let k = 0; k < tiles.length; k += 6) { s.show(tiles.slice(k, k + 6), "pop"); s.sfx.tick(); await s.wait(30); } await reveal(s, f1, "left", "pop"); });
          s.step(async () => { await reveal(s, f2, "left", "pop"); });
          s.step(async () => { await reveal(s, f3, "left", "pop"); });
        },
      },
      /* 14 ---- Dein Mosaik */
      {
        title: "Dein Mosaik aus Steinchen",
        say: "Jetzt legst du ein Mosaik. Wähle eine Farbe und tippe auf die Steinchen – oder streiche mit dem Finger darüber.",
        build(s) {
          const COLS = 22, ROWS = 13, T = 30;
          const pal = [["Marmor", "#f1ece0"], ["Ocker", "#d9a54a"], ["Terrakotta", "#c0592f"], ["Schwarz", "#2a2522"], ["Meerblau", "#2f6db5"], ["Grün", "#4f8a3c"]];
          let cur = pal[4][1];
          const svg = s.svg(COLS * T + 8, ROWS * T + 8);
          svg.append(s.el("rect", { x: 0, y: 0, width: COLS * T + 8, height: ROWS * T + 8, rx: 10, fill: "#9c948a" }));
          const cells = [];
          for (let j = 0; j < ROWS; j++) for (let i = 0; i < COLS; i++) {
            const r = s.el("rect", { x: 4 + i * T + 2, y: 4 + j * T + 2, width: T - 4, height: T - 4, rx: 3, fill: pal[0][1] });
            r.dataset.i = i; r.dataset.j = j; svg.append(r); cells.push(r);
          }
          const at = (i, j) => cells[j * COLS + i];
          let down = false;
          const paint = (r, snd = true) => { if (!r || r.getAttribute("fill") === cur) return; r.setAttribute("fill", cur); if (snd) s.sfx.tick(); };
          svg.style.touchAction = "none";
          svg.addEventListener("pointerdown", e => { down = true; paint(e.target.dataset && e.target.dataset.i ? e.target : null); });
          svg.addEventListener("pointermove", e => { if (!down) return; const el = document.elementFromPoint(e.clientX, e.clientY); if (el && el.dataset && el.dataset.i !== undefined && svg.contains(el)) paint(el); });
          const up = () => { down = false; };
          window.addEventListener("pointerup", up);
          s.onLeave(() => { down = false; window.removeEventListener("pointerup", up); });
          // template: dolphin over waves inside a meander-ish border
          const DOLPHIN = [
            "......................",
            ".SSSSSSSSSSSSSSSSSSSS.",
            ".S..................S.",
            ".S...........B......S.",
            ".S..........BB......S.",
            ".S.......BBBBBBB....S.",
            ".S.B...BBBBBBBBBBW..S.",
            ".S.BB.BBBBBBBBBBBBBBS.",
            ".S..BBBLLLLLLLLBB...S.",
            ".S.BB.....BB........S.",
            ".S.GG..GG..GG..GG.GGS.",
            ".SSSSSSSSSSSSSSSSSSSS.",
            "......................",
          ];
          const map = { ".": pal[0][1], S: pal[3][1], B: pal[4][1], W: pal[0][1], L: "#a9c9ea", G: "#4fa0c8" };
          const template = async () => {
            fx(s, "whoosh");
            for (let j = 0; j < ROWS; j++) { for (let i = 0; i < COLS; i++) at(i, j).setAttribute("fill", map[DOLPHIN[j][i]] || pal[0][1]); s.sfx.tick(); if (!s.fast) await s.wait(40); if (!s.alive) return; }
          };
          const clear = () => { cells.forEach(r => r.setAttribute("fill", pal[0][1])); fx(s, "swoosh"); };
          let curBtn = null;
          const pbtn = pal.map(([n, c]) => { const b = s.h("button", { class: "btn", style: { justifyContent: "flex-start", padding: "0 10px", gap: "10px", fontSize: "19px" }, onclick: () => { cur = c; s.sfx.click(); sel(b); } }, s.h("span", { style: { width: "26px", height: "26px", borderRadius: "5px", background: c, border: "2px solid " + INK, flex: "none" } }), n); return b; });
          const sel = b => { if (curBtn) curBtn.classList.remove("solid"); curBtn = b; b.classList.add("solid"); };
          sel(pbtn[4]);
          const tools = s.h("div", { class: "row", style: { gap: "10px" } }, s.h("button", { class: "btn solid", onclick: template }, "Vorlage: Delfin"), s.h("button", { class: "btn", onclick: clear }, "Leeren"));
          const tip = box(s, "life", "Selbst machen", "Mit kleinen Papier-Quadraten aus alten Zeitschriften oder mit Bügelperlen. Zwischen den Steinchen bleibt immer eine schmale Fuge.");
          s.add(cols2(s, svg, stack(s, 10, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" } }, ...pbtn), tools, tip), COLS * T + 8, 22));
          s.show(svg, "fade"); fx(s, "pop");
          s.step(async () => { await template(); s.say("So sieht ein Delfin aus Steinchen aus. Jetzt bist du dran."); });
          s.step(async () => { await reveal(s, tip, "up", "pop"); });
        },
      },
      /* 15 ---- Pergamonaltar */
      {
        title: "Der Pergamonaltar in Berlin",
        say: "Im Pergamonmuseum auf der Museumsinsel steht ein riesiger griechischer Altar aus der Stadt Pergamon. Sein Fries ist hundertdreizehn Meter lang.",
        build(s) {
          const pic = s.photo("pergamonaltar", { w: 560, h: 330, pos: "50% 50%", caption: "Pergamonaltar im Pergamonmuseum", kb: true });
          const rel = s.h("div", { class: "later" }, s.photo("pergamon-relief", { w: 560, h: 250, pos: "50% 40%", caption: "Ausschnitt vom großen Fries" }));
          const fact = (big, t) => s.h("div", { class: "card later", style: { padding: "8px 14px", display: "flex", gap: "12px", alignItems: "baseline", borderLeft: `10px solid ${UC}` } }, s.h("b", { class: "h2", style: { color: UC, minWidth: "116px" }, html: big }), s.h("span", { class: "small", html: t }));
          const num = s.h("span", { class: "mono" }, "0");
          const f1 = fact("", "lang ist der große Fries: Götter kämpfen gegen Riesen, die Giganten.");
          f1.querySelector("b").append(num, " m");
          const f2 = fact("2. Jh.", "v. Chr. gebaut, unter König Eumenes II. in Pergamon (heute Türkei).");
          const f3 = fact("1878", "begannen Carl Humann und Alexander Conze die Ausgrabung. Die Reliefplatten kamen nach Berlin.");
          const f4 = fact("2027", "Das Museum ist seit Oktober 2023 geschlossen. Ab dem 4. Juni 2027 soll der Altar wieder zu sehen sein.");
          s.add(cols2(s, stack(s, 12, pic, rel), stack(s, 10, f1, f2, f3, f4), 560, 24));
          s.show(pic, "zoom"); fx(s, "whoosh");
          s.step(async () => { await reveal(s, f1, "left", "pop"); await s.tween({ from: 0, to: 113, dur: 1000, update: v => { num.textContent = String(Math.round(v)); } }); await s.show(rel, "up"); });
          s.step(async () => { await reveal(s, f2, "left", "pop"); await reveal(s, f3, "left", "pop"); });
          s.step(async () => { await reveal(s, f4, "left", "ding"); });
        },
      },
      /* 16 ---- Deine Vase */
      {
        title: "Gestalte deine Vase",
        say: "Jetzt bist du der Vasenmaler. Wähle Form, Technik, Ornamentband und Bild.",
        build(s) {
          const svg = s.svg(340, 420);
          const st = { kind: "amphore", tech: "schwarz", band: "maeander", pic: "eule" };
          let cur = null;
          const draw = () => { if (cur) cur.remove(); cur = decoratedVase(s, st); const sc = st.kind === "kylix" ? 1.3 : 1.55; cur.setAttribute("transform", `translate(${170 - 120 * sc},${st.kind === "kylix" ? 20 : 8}) scale(${sc})`); svg.append(cur); };
          draw();
          const set = (k, v, snd) => { st[k] = v; draw(); if (snd) s.sound(snd, { vol: .5 }); else fx(s, "pop"); };
          const gF = pillGroup(s, [["amphore", "Amphore"], ["hydria", "Hydria"], ["krater", "Krater"], ["kylix", "Kylix"]], v => set("kind", v), "amphore");
          const gT = pillGroup(s, [["schwarz", "schwarzfigurig"], ["rot", "rotfigurig"]], v => set("tech", v, "pinsel-strich"), "schwarz");
          const gB = pillGroup(s, [["maeander", "Mäander"], ["welle", "Welle"], ["zickzack", "Zickzack"]], v => set("band", v, "pinsel-strich"), "maeander");
          const gP = pillGroup(s, [["eule", "Eule"], ["delfin", "Delfin"], ["kranz", "Lorbeerkranz"]], v => set("pic", v), "eule");
          const r1 = prow(s, "Form:", Object.values(gF.btns), true), r2 = prow(s, "Technik:", Object.values(gT.btns), true), r3 = prow(s, "Band:", Object.values(gB.btns), true), r4 = prow(s, "Bild:", Object.values(gP.btns), true);
          const life = box(s, "life", "Im Alltag", "Die Eule war das Tier der Göttin Athene und das Zeichen Athens. Sie war auf alten Münzen – und ist heute auf der griechischen 1-Euro-Münze.");
          const paper = box(s, "ex", "Auf Papier", "Vasenform auf orangefarbenes Tonpapier zeichnen und ausschneiden. Mit schwarzem Filzstift oben und unten ein Mäanderband ziehen, in die Mitte dein Bild.");
          s.add(cols2(s, svg, stack(s, 10, r1, r2, r3, r4, paper, life), 340, 24));
          s.show(svg, "zoom"); fx(s, "pop");
          s.step(async () => { fx(s, "whoosh"); await s.show([r1, r2, r3, r4], "up"); s.say("Probier zuerst die Technik aus."); gT.pick("rot"); await s.wait(800); gF.pick("hydria"); await s.wait(800); gP.pick("delfin"); });
          s.step(async () => { await reveal(s, paper, "up", "pop"); });
          s.step(async () => { await reveal(s, life, "up", "success"); });
        },
      },
      /* 17 ---- Museum / Antike heute */
      {
        title: "Antike entdecken in Berlin",
        say: "Geh auf Entdeckungstour. Im Alten Museum und überall in der Stadt findest du die Kunst der Griechen und Römer.",
        build(s) {
          const tasks = ["Eine schwarzfigurige und eine rotfigurige Vase", "Ein Mäanderband", "Eine Statue im Kontrapost", "Ein dorisches, ionisches und korinthisches Kapitell", "Ein Mosaik aus kleinen Steinchen", "Eine Eule – auf einer Münze oder Vase"];
          const rows = tasks.map(t => {
            const b_ = s.h("span", { style: { width: "30px", height: "30px", border: "3px solid " + UC, borderRadius: "8px", flex: "none", display: "grid", placeItems: "center", fontWeight: 800, color: UC, fontSize: "22px" } });
            const r = s.h("div", { class: "card later", style: { padding: "16px 18px", display: "flex", gap: "14px", alignItems: "center", cursor: "pointer" }, onclick: () => { const on = !r.dataset.on; r.dataset.on = on ? "1" : ""; b_.textContent = on ? "✓" : ""; s.sfx[on ? "ding" : "click"](); } }, b_, s.h("span", { class: "t" }, t));
            return r;
          });
          const ph = s.h("div", { class: "later" }, s.photo("museumsinsel", { w: 440, h: 230, pos: "50% 60%", caption: "Museumsinsel Berlin" }));
          const tips = [["Altes Museum", "griechische Vasen und Statuen der Antikensammlung"], ["Skizzenbuch", "Zeichne eine Vasenform und ein Kapitell ab"]].map(([a, b]) => s.h("div", { class: "life later", style: { padding: "12px 18px" } }, P(s, `<b>${a}</b>`, "t"), P(s, b, "small")));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "1.1fr 440px", alignItems: "center", alignContent: "center", height: "100%", gap: "26px" } },
            stack(s, 10, P(s, "Such-Auftrag: <span class='hl'>Tippe, was du findest</span>", "h2"), ...rows),
            stack(s, 12, ph, ...tips)));
          s.step(async () => { for (const r of rows) { fx(s, "pop"); await s.show(r, "left"); } });
          s.step(async () => { await reveal(s, ph, "zoom", "whoosh"); for (const t of tips) { fx(s, "pop"); await s.show(t, "up"); } s.say("Viel Spaß beim Entdecken!"); });
        },
      },
    ],
  });
})();
