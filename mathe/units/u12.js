/* Kapitel 12 – Zuordnungen und Zufall (Ausblick Klasse 6): Wertetabelle, Graph, proportional, Dreisatz,
   nicht proportionale Zuordnungen, Ergebnisse, sicher/möglich/unmöglich, Wahrscheinlichkeit als Bruch,
   Glücksrad, Beutel, relative Häufigkeit (Simulation) */
(() => {
  const U = "#4d7c0f", SOFT = "#ecf5dc";
  const P = { blue: "#1d5bd0", red: "#dc3b2a", green: "#138a5a", violet: "#7b4fd6", orange: "#ee7a1a", ink: "#1b2740", pencil: "#5d6678", yellow: "#ffd94a", line: "#c8d3de", gold: "#e0a800" };
  const LBL = { font: "700 14px/1 var(--f-display)", letterSpacing: ".08em", textTransform: "uppercase", display: "block", marginBottom: "8px", color: "var(--green)" };
  const ex = (s, label, attrs, ...kids) => s.h("div", Object.assign({ class: "ex" }, attrs || {}), s.h("span", { class: "exlabel" }, label), ...kids);
  const life = (s, attrs, ...kids) => s.h("div", Object.assign({ class: "life" }, attrs || {}), s.h("span", { style: LBL }, (attrs && attrs.label) || "Im Alltag"), ...kids);
  const T = (s, x, y, text, a) => s.el("text", Object.assign({ x, y, "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: P.ink, text }, a || {}));
  const fb = el => { el.style.transformBox = "fill-box"; el.style.transformOrigin = "center"; return el; };
  const later = el => { el.classList.add("later"); return el; };
  const root = (s, cls, style, ...kids) => s.h("div", { class: cls, style: Object.assign({ height: "100%", fontSize: "22px" }, style || {}) }, ...kids);
  const D = (v, d) => Number(v).toLocaleString("de-DE", { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });
  const EUR = v => D(v, 2) + " €";
  /* a stacked fraction */
  const frac = (s, a, b, c, size) => s.h("span", { style: { display: "inline-flex", flexDirection: "column", alignItems: "center", verticalAlign: "middle", lineHeight: 1, margin: "0 4px", color: c || "inherit", fontSize: size || "1em", fontWeight: 800 } },
    s.h("span", { style: { padding: "0 6px 4px" } }, String(a)), s.h("span", { style: { borderTop: "3px solid currentColor", padding: "4px 6px 0", alignSelf: "stretch", textAlign: "center" } }, String(b)));

  /* line chart frame. o: {W,H,xMax,yMax,xStep,yStep,xLab,yLab,fx,fy,L,B} */
  function graph(s, o) {
    const W = o.W, H = o.H, L = o.L ?? 62, B = o.B ?? (o.xLab ? 66 : 46), Tp = o.T ?? 34, R = o.R ?? 22;
    const X = v => L + (v / o.xMax) * (W - L - R), Y = v => H - B - (v / o.yMax) * (H - B - Tp);
    const svg = s.svg(W, H);
    const fx = o.fx || (v => D(v)), fy = o.fy || (v => D(v));
    for (let v = 0; v <= o.xMax + 1e-9; v += o.xStep) {
      svg.append(s.el("line", { x1: X(v), x2: X(v), y1: Y(0), y2: Y(o.yMax), stroke: "#e1e8ef", "stroke-width": 1.5 }));
      svg.append(T(s, X(v), H - B + 26, fx(v), { "font-size": 18, "font-weight": 600, fill: P.pencil }));
    }
    for (let v = 0; v <= o.yMax + 1e-9; v += o.yStep) {
      svg.append(s.el("line", { x1: X(0), x2: X(o.xMax), y1: Y(v), y2: Y(v), stroke: "#e1e8ef", "stroke-width": 1.5 }));
      if (v) svg.append(T(s, L - 8, Y(v) + 6, fy(v), { "font-size": 18, "font-weight": 600, fill: P.pencil, "text-anchor": "end" }));
    }
    svg.append(s.el("line", { x1: X(0), x2: X(o.xMax) + 12, y1: Y(0), y2: Y(0), stroke: P.ink, "stroke-width": 3 }), s.el("line", { x1: X(0), x2: X(0), y1: Y(0), y2: Y(o.yMax) - 14, stroke: P.ink, "stroke-width": 3 }));
    if (o.yLab) svg.append(T(s, X(0) + 10, Tp - 14, o.yLab, { "font-size": 19, fill: U, "text-anchor": "start" }));
    if (o.xLab) svg.append(T(s, (L + W - R) / 2, H - 6, o.xLab, { "font-size": 19, fill: U }));
    return { svg, X, Y, W, H };
  }

  /* table "ladder" for proportional reasoning / Dreisatz: rows [[l, r]], ops ["· 2", …] between rows */
  function ladder(s, headL, headR, rows, ops, o = {}) {
    const cw = o.cw || 170, ow = o.ow || 92, fs = o.fs || 30;
    const cell = (t, c) => s.h("div", { style: { height: (o.ch || 58) + "px", display: "grid", placeItems: "center", background: "#fff", border: "2px solid var(--line)", borderRadius: "10px", font: `800 ${fs}px/1 var(--f-display)`, color: c || P.ink, whiteSpace: "nowrap" } }, t);
    const head = t => s.h("div", { style: { textAlign: "center", font: "700 19px/1.2 var(--f-body)", color: P.pencil, paddingBottom: "4px", borderBottom: "3px solid var(--ink)" } }, t);
    const op = (t, side) => s.h("div", { class: "later", style: { textAlign: side, font: "800 22px/1 var(--f-display)", color: P.red, padding: "0 6px", whiteSpace: "nowrap" } }, "↓ " + t);
    const kids = [s.h("div"), head(headL), head(headR), s.h("div")];
    const vals = [], opEls = [];
    rows.forEach(([l, r], i) => {
      const a = cell(l, o.cl), b = cell(r, o.cr || U);
      if (i && !o.showAll) { a.classList.add("later"); b.classList.add("later"); }
      vals.push({ l: a, r: b }); kids.push(s.h("div"), a, b, s.h("div"));
      if (i < rows.length - 1) { const x = op(ops[i], "right"), y = op(ops[i], "left"); opEls.push([x, y]); kids.push(x, s.h("div", { style: { height: (o.gh || 34) + "px" } }), s.h("div"), y); }
    });
    const el = s.h("div", { style: { display: "grid", gridTemplateColumns: `${ow}px ${cw}px ${cw}px ${ow}px`, columnGap: "10px", alignItems: "center" } }, ...kids);
    const run = async (i, sfxI) => { const [x, y] = opEls[i]; s.sfx.whoosh(); s.show(x, "down"); await s.show(y, "down"); s.sfx.count(sfxI ?? i); s.show(vals[i + 1].l, "pop"); await s.show(vals[i + 1].r, "pop"); };
    return { el, vals, ops: opEls, run };
  }

  /* dice face (svg group) */
  const PIPS = { 1: [[2, 2]], 2: [[1, 1], [3, 3]], 3: [[1, 1], [2, 2], [3, 3]], 4: [[1, 1], [3, 1], [1, 3], [3, 3]], 5: [[1, 1], [3, 1], [2, 2], [1, 3], [3, 3]], 6: [[1, 1], [3, 1], [1, 2], [3, 2], [1, 3], [3, 3]] };
  function die(s, x, y, n, size) {
    const g = s.el("g", { transform: `translate(${x},${y})` }), k = size / 4;
    const box = s.el("rect", { x: 0, y: 0, width: size, height: size, rx: size * .18, fill: "#fff", stroke: P.ink, "stroke-width": 3 });
    g.append(box); PIPS[n].forEach(([a, b]) => g.append(s.el("circle", { cx: a * k, cy: b * k, r: size * .085, fill: P.ink })));
    g.box = box; return g;
  }
  /* glücksrad: sectors = array of colours */
  function wheel(s, cx, cy, r, cols) {
    const g = s.el("g"), n = cols.length;
    cols.forEach((c, i) => {
      const a0 = (i / n) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;
      g.append(s.el("path", { d: `M${cx},${cy} L${cx + r * Math.cos(a0)},${cy + r * Math.sin(a0)} A${r},${r} 0 0 1 ${cx + r * Math.cos(a1)},${cy + r * Math.sin(a1)} Z`, fill: c, stroke: "#fff", "stroke-width": 3 }));
    });
    g.append(s.el("circle", { cx, cy, r, fill: "none", stroke: P.ink, "stroke-width": 4 }), s.el("circle", { cx, cy, r: r * .1, fill: "#fff", stroke: P.ink, "stroke-width": 3 }));
    return g;
  }
  const COL = { rot: "#e5484d", blau: "#3b82f6", gelb: "#f5c518" };
  const WORD = { rot: "Rot", blau: "Blau", gelb: "Gelb" };

  Deck.unit({
    id: "u12", num: 12, title: "Zuordnungen und Zufall", color: U, soft: SOFT,
    subtitle: "Ausblick auf Klasse 6: Dreisatz und Wahrscheinlichkeit",
    blurb: "Doppelt so viel – doppelt so teuer, Dreisatz, Würfel und Glücksrad.",
    goals: ["Zuordnungen in Tabellen und Graphen darstellen", "Proportionale Zuordnungen erkennen", "Mit dem Dreisatz rechnen", "Sicher, möglich oder unmöglich unterscheiden", "Wahrscheinlichkeiten als Bruch angeben", "Sehen, wie viele Würfe zur Wahrscheinlichkeit führen"],
    icon(svg, el) {
      svg.append(el("line", { x1: 8, x2: 8, y1: 6, y2: 62, stroke: "#1b2740", "stroke-width": 3 }), el("line", { x1: 8, x2: 64, y1: 62, y2: 62, stroke: "#1b2740", "stroke-width": 3 }),
        el("line", { x1: 8, x2: 44, y1: 62, y2: 22, stroke: "#4d7c0f", "stroke-width": 4, "stroke-linecap": "round" }),
        el("rect", { x: 38, y: 36, width: 26, height: 26, rx: 5, fill: "#fff", stroke: "#1b2740", "stroke-width": 2.5 }),
        el("circle", { cx: 45, cy: 43, r: 2.6, fill: "#1b2740" }), el("circle", { cx: 51, cy: 49, r: 2.6, fill: "#1b2740" }), el("circle", { cx: 57, cy: 55, r: 2.6, fill: "#1b2740" }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Was ist eine Zuordnung?",
        say: "Am Marktstand gehört zu jedem Gewicht genau ein Preis. So etwas nennt man eine Zuordnung.",
        build(s) {
          const W = 500, H = 400, svg = s.svg(W, H);
          const LX = 110, RX = 390, YS = [110, 185, 260, 335];
          svg.append(s.el("rect", { x: 40, y: 70, width: 140, height: 310, rx: 60, fill: "#e6f6ee", stroke: P.green, "stroke-width": 2.5 }), s.el("rect", { x: 320, y: 70, width: 140, height: 310, rx: 60, fill: SOFT, stroke: U, "stroke-width": 2.5 }),
            T(s, LX, 40, "Gewicht", { "font-size": 22, fill: P.green }), T(s, RX, 40, "Preis", { "font-size": 22, fill: U }));
          const kg = ["1 kg", "2 kg", "3 kg", "4 kg"], eu = ["3 €", "6 €", "9 €", "12 €"];
          const arrows = [];
          YS.forEach((y, i) => {
            svg.append(T(s, LX, y + 8, kg[i], { "font-size": 26, fill: P.green }), T(s, RX, y + 8, eu[i], { "font-size": 26, fill: U }));
            const ln = later(s.el("line", { x1: 168, x2: 322, y1: y, y2: y, stroke: P.ink, "stroke-width": 3 }));
            const hd = later(s.el("polygon", { points: `${330},${y} ${316},${y - 8} ${316},${y + 8}`, fill: P.ink }));
            svg.append(ln, hd); arrows.push([ln, hd]);
          });
          const apples = s.h("div", { class: "a-pop", style: { fontSize: "40px", textAlign: "center" } }, "🍎🍎🍎");
          const c1 = ex(s, "Zeit → Strecke", { class: "ex later", style: { padding: "12px 16px" } }, s.h("p", { class: "t" }, "Fahrrad: ", s.h("b", null, "10 min → 2 km"), ", 20 min → 4 km"));
          const c2 = ex(s, "Alter → Körpergröße", { class: "ex later", style: { padding: "12px 16px" } }, s.h("p", { class: "t" }, "Jedes Kind hat in jedem Alter ", s.h("b", null, "genau eine"), " Größe."));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Eine ", s.h("b", null, "Zuordnung"), " ordnet jedem Wert einer Größe ", s.h("b", null, "genau einen"), " Wert einer anderen Größe zu. Man schreibt: 2 kg → 6 €.");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "540px 1fr", gap: "24px", alignItems: "center" },
            ex(s, "Äpfel am Marktstand", { class: "ex a-left", style: { padding: "12px 18px" } }, svg),
            s.h("div", { class: "stack", style: { gap: "16px" } }, apples, c1, c2, merk)));
          s.sfx.pop();
          s.step(async () => { for (const [l, h] of arrows) { s.sfx.swoosh(); await s.show(l, "draw"); s.show(h, "pop"); } s.say("Ein Kilo kostet drei Euro, zwei Kilo sechs Euro. Jeder Pfeil führt zu genau einem Preis."); });
          s.step(async () => { s.sound("bike-bell", { vol: .5 }); await s.show(c1, "right"); s.sfx.pop(); await s.show(c2, "right"); s.say("Auch Zeit und Strecke oder Alter und Größe sind Zuordnungen."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Die Wertetabelle",
        say: "Lena fährt mit dem Fahrrad immer gleich schnell: alle zehn Minuten zwei Kilometer. Wir schreiben das in eine Wertetabelle.",
        build(s) {
          const W = 1080, H = 190, svg = s.svg(W, H), X = km => 70 + km * 78;
          svg.append(s.el("rect", { x: 30, y: 96, width: W - 60, height: 40, rx: 10, fill: "#9aa3b2" }), s.el("line", { x1: 40, x2: W - 40, y1: 116, y2: 116, stroke: "#fff", "stroke-width": 3, "stroke-dasharray": "18 14" }));
          for (let k = 0; k <= 12; k++) svg.append(s.el("line", { x1: X(k), x2: X(k), y1: 136, y2: 150, stroke: P.ink, "stroke-width": 2.5 }), T(s, X(k), 176, k + " km", { "font-size": 18, fill: P.pencil }));
          const bike = s.el("text", { x: X(0), y: 92, "text-anchor": "middle", "font-size": 54, text: "🚲" });
          const clock = T(s, X(0), 30, "0 min", { "font-size": 24, fill: U });
          svg.append(bike, clock);
          const MIN = [0, 10, 20, 30, 40, 50, 60];
          const td = (t, c, h) => s.h(h ? "th" : "td", { style: { border: "2px solid var(--line)", padding: "10px 6px", textAlign: "center", font: h ? "700 20px/1.1 var(--f-body)" : "800 30px/1 var(--f-display)", color: c || P.ink, background: h ? SOFT : "#fff", minWidth: "100px" } }, t);
          const kmCells = MIN.map(() => td("", U));
          const table = s.h("table", { style: { borderCollapse: "collapse", margin: "0 auto" } },
            s.h("tr", null, td("Zeit (min)", P.ink, true), ...MIN.map(m => td(String(m)))),
            s.h("tr", null, td("Strecke (km)", P.ink, true), ...kmCells));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "In einer ", s.h("b", null, "Wertetabelle"), " stehen zusammengehörige Werte übereinander: 30 min → 6 km.");
          const lf = life(s, { class: "life later", style: { padding: "10px 16px" } }, s.h("p", { class: "small" }, "Preislisten beim Bäcker, Fahrpläne der BVG, Ergebnislisten beim Sportfest: alles Wertetabellen."));
          s.add(root(s, "stack", { gap: "18px", justifyContent: "center" }, s.h("div", { class: "a-fade" }, svg), table, s.h("div", { class: "cols", style: { gap: "18px", alignItems: "center" } }, merk, lf)));
          s.sfx.pop();
          s.step(async () => {
            s.sound("bike-bell", { vol: .5 });
            let last = -1;
            await s.tween({ from: 0, to: 60, dur: 4200, ease: "linear", update: m => {
              const k = m / 5; bike.setAttribute("x", X(k)); clock.setAttribute("x", X(k)); clock.textContent = Math.round(m) + " min";
              const i = Math.floor(m / 10 + 1e-6); if (i !== last) { last = i; kmCells[i].textContent = String(i * 2); kmCells[i].classList.remove("a-pop"); void kmCells[i].offsetWidth; kmCells[i].classList.add("a-pop"); s.sfx.count(i); }
            } });
            MIN.forEach((m, i) => kmCells[i].textContent = String(i * 2));
            s.say("Nach sechzig Minuten ist Lena zwölf Kilometer weit gefahren.");
          });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Vom Tisch zum Graphen",
        say: "Jedes Wertepaar aus der Tabelle wird ein Punkt im Koordinatensystem. Verbunden ergeben sie den Graphen.",
        build(s) {
          const G = graph(s, { W: 620, H: 500, xMax: 60, yMax: 12, xStep: 10, yStep: 2, xLab: "Zeit in min", yLab: "Strecke in km" });
          const pts = [0, 10, 20, 30, 40, 50, 60].map(m => { const c = later(fb(s.el("circle", { cx: G.X(m), cy: G.Y(m / 5), r: 9, fill: U, stroke: "#fff", "stroke-width": 3 }))); G.svg.append(c); return c; });
          const line = later(s.el("line", { x1: G.X(0), y1: G.Y(0), x2: G.X(60), y2: G.Y(12), stroke: U, "stroke-width": 4, opacity: .7 }));
          G.svg.insertBefore(line, pts[0]);
          const hx = s.el("line", { stroke: P.blue, "stroke-width": 2.5, "stroke-dasharray": "6 5" }), hy = s.el("line", { stroke: P.green, "stroke-width": 2.5, "stroke-dasharray": "6 5" });
          const mover = s.el("circle", { r: 12, fill: P.orange, stroke: "#fff", "stroke-width": 3 });
          const helpers = later(s.el("g")); helpers.append(hx, hy, mover); G.svg.append(helpers);
          const read = s.h("p", { class: "h2" });
          const setM = m => {
            const y = m / 5;
            hx.setAttribute("x1", G.X(m)); hx.setAttribute("x2", G.X(m)); hx.setAttribute("y1", G.Y(0)); hx.setAttribute("y2", G.Y(y));
            hy.setAttribute("x1", G.X(0)); hy.setAttribute("x2", G.X(m)); hy.setAttribute("y1", G.Y(y)); hy.setAttribute("y2", G.Y(y));
            mover.setAttribute("cx", G.X(m)); mover.setAttribute("cy", G.Y(y));
            read.innerHTML = ""; read.append("nach ", s.h("span", { class: "blue" }, m + " min"), ": ", s.h("span", { class: "green" }, D(y, y % 1 ? 1 : 0) + " km"));
          };
          setM(35);
          const sl = s.slider({ label: "Zeit", min: 0, max: 60, value: 35, fmt: v => v + " min", onInput: setM });
          const tool = s.h("div", { class: "stack later", style: { gap: "10px" } }, sl, read);
          const pairs = s.h("p", { class: "t a-up" }, "Wertepaare: (0|0), (10|2), (20|4), (30|6) …");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Der ", s.h("b", null, "Graph"), " ist ein Bild der Zuordnung. Zwischen den Punkten kannst du Werte ablesen: Nach 35 Minuten ist Lena 7 km weit.");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "620px 1fr", gap: "24px", alignItems: "center" }, s.h("div", { class: "a-fade" }, G.svg), s.h("div", { class: "stack", style: { gap: "18px" } }, pairs, tool, merk)));
          s.sfx.pop();
          s.step(async () => { for (let i = 0; i < pts.length; i++) { s.sfx.note(i * 2, .15); await s.show(pts[i], "bounce"); } s.say("Sieben Wertepaare, sieben Punkte."); });
          s.step(async () => { s.sound("pencil-write", { vol: .5, dur: 1.2 }); await s.show(line, "draw"); s.say("Lena fährt gleichmäßig, darum liegen alle Punkte auf einer Geraden."); });
          s.step(async () => { s.show(helpers, "fade"); await s.show(tool, "up"); s.sfx.pop(); s.say("Schieb den Regler und lies ab, wie weit Lena gekommen ist."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Doppelt so viel – doppelt so teuer",
        say: "Kaufst du doppelt so viele Äpfel, bezahlst du doppelt so viel. So eine Zuordnung heißt proportional.",
        build(s) {
          const LD = ladder(s, "Äpfel", "Preis", [["1 kg", "3,00 €"], ["2 kg", "6,00 €"], ["4 kg", "12,00 €"], ["8 kg", "24,00 €"]], ["· 2", "· 2", "· 2"], { ch: 56, gh: 30, ow: 80 });
          const half = s.h("div", { class: "card later", style: { display: "flex", alignItems: "center", gap: "14px", padding: "10px 16px" } }, s.h("span", { style: { fontSize: "34px" } }, "🍏"),
            s.h("p", { class: "t" }, "Und rückwärts: ", s.h("b", null, "halb so viel – halb so teuer"), ". 0,5 kg kosten 1,50 €."));
          const rule = (t, i) => s.h("p", { class: "h2 later", style: { color: [P.blue, P.violet, P.green][i] } }, t);
          const rules = ["doppelt so viel → doppelt so teuer", "dreimal so viel → dreimal so teuer", "achtmal so viel → achtmal so teuer"].map(rule);
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Eine Zuordnung heißt ", s.h("b", null, "proportional"), ", wenn zum Doppelten, Dreifachen, zur Hälfte … der einen Größe auch das Doppelte, Dreifache, die Hälfte … der anderen gehört.");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "560px 1fr", gap: "26px", alignItems: "center" },
            ex(s, "Am Marktstand: 1 kg Äpfel = 3 €", { class: "ex a-left", style: { padding: "14px 16px" } }, LD.el),
            s.h("div", { class: "stack", style: { gap: "14px" } }, ...rules, half, merk)));
          s.sfx.pop();
          s.step(async () => { await LD.run(0); await s.show(rules[0], "left"); s.say("Doppelt so viel Äpfel: doppelt so teuer. Links mal zwei, rechts mal zwei."); });
          s.step(async () => { await LD.run(1); await LD.run(2); s.say("Vier Kilo kosten zwölf Euro, acht Kilo vierundzwanzig Euro."); });
          s.step(async () => { s.sfx.pop(); await s.show(rules[1], "left"); await s.show(rules[2], "left"); await s.show(half, "up"); s.say("Und ein halbes Kilo kostet die Hälfte von drei Euro: einen Euro fünfzig."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Proportional erkennen",
        say: "Bei proportionalen Zuordnungen liegen alle Punkte auf einer Geraden, die im Nullpunkt beginnt.",
        build(s) {
          const mk = (lab, icon, yMax, yStep, per, fy, unitY, txt) => {
            const G = graph(s, { W: 310, H: 240, xMax: 5, yMax, xStep: 1, yStep, L: 58, B: 40, T: 30, fy });
            const pts = [1, 2, 3, 4, 5].map(x => { const c = later(fb(s.el("circle", { cx: G.X(x), cy: G.Y(x * per), r: 7, fill: U }))); G.svg.append(c); return c; });
            const ln = later(s.el("line", { x1: G.X(0), y1: G.Y(0), x2: G.X(5), y2: G.Y(5 * per), stroke: U, "stroke-width": 3.5 }));
            const o = later(fb(s.el("circle", { cx: G.X(0), cy: G.Y(0), r: 9, fill: "none", stroke: P.red, "stroke-width": 3 })));
            G.svg.insertBefore(ln, pts[0]); G.svg.append(o);
            const card = ex(s, lab, { class: "ex later", style: { padding: "12px 12px", display: "flex", flexDirection: "column", gap: "6px" } },
              s.h("div", { class: "row", style: { gap: "10px", flexWrap: "nowrap" } }, s.h("span", { style: { fontSize: "34px" } }, icon), s.h("p", { class: "small" }, ...txt)), G.svg);
            card.run = async () => { await s.show(card, "up"); for (const p of pts) { s.sfx.tick(); await s.show(p, "pop"); } s.sfx.swoosh(); await s.show(ln, "draw"); s.show(o, "zoom"); };
            void unitY; return card;
          };
          const c1 = mk("Brötchen", "🥖", 2.5, .5, .4, v => D(v, 2), "€", ["1 Brötchen: ", s.h("b", null, "0,40 €")]);
          const c2 = mk("Minecraft", "🪵", 20, 5, 4, v => D(v), "", ["1 Stamm: ", s.h("b", null, "4 Bretter")]);
          const c3 = mk("Duschen", "🚿", 60, 20, 12, v => D(v) + " l", "l", ["1 Minute: ", s.h("b", null, "12 Liter"), " (Beispiel)"]);
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Proportional: Alle Punkte liegen auf einer ", s.h("b", null, "Geraden"), ", die im ", s.h("b", null, "Nullpunkt (0|0)"), " beginnt. 0 Brötchen kosten 0 €.");
          s.add(root(s, "stack", { gap: "14px", justifyContent: "center" }, s.h("div", { class: "cols3", style: { gap: "16px", gridTemplateColumns: "repeat(3, minmax(0, 1fr))" } }, c1, c2, c3), merk));
          s.sfx.pop();
          s.step(async () => { await c1.run(); s.say("Ein Brötchen kostet vierzig Cent, fünf Brötchen zwei Euro."); });
          s.step(async () => { await c2.run(); s.say("In Minecraft gibt ein Holzstamm vier Bretter."); });
          s.step(async () => { s.sound("water-pour", { vol: .4, dur: 2 }); await c3.run(); s.say("Und beim Duschen fließen in jeder Minute gleich viele Liter."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Der Dreisatz",
        say: "Drei Hefte kosten vier Euro fünfzig. Was kosten sieben Hefte? Mit dem Dreisatz rechnest du zuerst auf eins.",
        build(s) {
          const LD = ladder(s, "Hefte", "Preis", [["3", "4,50 €"], ["1", "1,50 €"], ["7", "10,50 €"]], [": 3", "· 7"], { cw: 160, ow: 72, fs: 34, ch: 66, gh: 46 });
          const st = (n, t, c) => s.h("div", { class: "card later", style: { display: "flex", gap: "14px", alignItems: "center", padding: "12px 16px", borderLeft: `8px solid ${c}` } },
            s.h("b", { style: { font: "800 34px/1 var(--f-display)", color: c } }, n), s.h("p", { class: "t" }, ...t));
          const s1 = st("1.", ["Das weißt du: ", s.h("b", null, "3 Hefte → 4,50 €")], P.blue);
          const s2 = st("2.", ["Rechne auf ", s.h("b", null, "1 Heft"), ": beide Seiten : 3"], P.violet);
          const s3 = st("3.", ["Rechne auf ", s.h("b", null, "7 Hefte"), ": beide Seiten · 7"], P.green);
          s1.classList.remove("later"); s1.classList.add("a-up");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Der ", s.h("b", null, "Dreisatz"), " hat drei Zeilen: Was ich weiß → auf ", s.h("b", null, "eins"), " rechnen → auf die gesuchte Menge rechnen. Links und rechts immer dasselbe tun!");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "520px 1fr", gap: "26px", alignItems: "center" },
            ex(s, "📒 Hefte im Schreibwarenladen", { class: "ex a-left", style: { padding: "14px 16px" } }, LD.el),
            s.h("div", { class: "stack", style: { gap: "14px" } }, s1, s2, s3, merk)));
          s.sfx.pop();
          s.step(async () => { await s.show(s2, "left"); await LD.run(0); s.say("Ein Heft kostet ein Drittel: vier Euro fünfzig geteilt durch drei sind ein Euro fünfzig."); });
          s.step(async () => { await s.show(s3, "left"); await LD.run(1, 4); s.sfx.ding(); s.say("Sieben Hefte kosten siebenmal so viel: zehn Euro fünfzig."); });
          s.step(async () => { s.sound("cash-register", { vol: .4 }); await s.show(merk, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Dreisatz in der Küche",
        say: "Das Pfannkuchen-Rezept ist für vier Personen. Ihr seid aber sechs! Mit dem Dreisatz rechnest du das Rezept um.",
        build(s) {
          const LD = ladder(s, "Personen", "Mehl", [["4", "200 g"], ["1", "50 g"], ["6", "300 g"]], [": 4", "· 6"], { cw: 150, fs: 30, ch: 60, gh: 40, ow: 80 });
          const BASE = [["Mehl", 50, "g"], ["Milch", 100, "ml"], ["Eier", 1, ""], ["Zucker", 10, "g"]];
          const amt = BASE.map(() => s.h("b", { class: "mono", style: { color: U } }));
          let n = 4;
          const head = s.h("p", { class: "h2" });
          const upd = () => { head.textContent = `Pfannkuchen für ${n} ${n === 1 ? "Person" : "Personen"}`; BASE.forEach(([, v, u], i) => { amt[i].textContent = D(v * n) + (u ? " " + u : ""); }); };
          upd();
          const list = s.h("div", { class: "stack", style: { gap: "6px" } }, ...BASE.map(([name], i) => s.h("p", { class: "t", style: { display: "flex", justifyContent: "space-between", borderBottom: "2px dotted var(--line)" } }, s.h("span", null, name === "Eier" ? "Eier (Stück)" : name), amt[i])));
          const sl = s.slider({ label: "Personen", min: 1, max: 12, value: 4, onInput: v => { n = v; upd(); } });
          const recipe = s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", gap: "10px", padding: "14px 20px" } }, s.h("span", { class: "exlabel" }, "Beispielrezept 🥞"), head, list, s.h("div", { class: "later" }, sl));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Erst für ", s.h("b", null, "1 Person"), " ausrechnen, dann für so viele, wie ihr seid. Das klappt mit jeder Zutat.");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "500px 1fr", gap: "24px", alignItems: "center" },
            ex(s, "Mehl umrechnen", { class: "ex a-left", style: { padding: "14px 14px" } }, LD.el), s.h("div", { class: "stack", style: { gap: "14px" } }, recipe, merk)));
          s.sfx.pop();
          s.step(async () => { await LD.run(0); s.say("Für eine Person: zweihundert Gramm geteilt durch vier sind fünfzig Gramm Mehl."); });
          s.step(async () => {
            await LD.run(1, 5); s.sound("sizzle", { vol: .35, dur: 2 });
            await s.tween({ from: 4, to: 6, dur: 700, update: v => { const r = Math.round(v); if (r !== n) { n = r; upd(); s.sfx.tick(); } } }); sl.set(6);
            s.say("Für sechs Personen: sechsmal fünfzig Gramm, also dreihundert Gramm Mehl.");
          });
          s.step(async () => { s.show(recipe.lastChild, "up"); s.sfx.pop(); await s.show(merk, "up"); s.say("Probier den Regler: Wie viel Milch brauchen zwölf Personen?"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Dreisatz überall",
        say: "Den Dreisatz brauchst du ständig: beim Spielen, beim Duschen und bei der Klassenfahrt.",
        build(s) {
          const box = (t, c) => s.h("span", { class: "later", style: { display: "inline-block", padding: "8px 12px", borderRadius: "10px", border: `2px solid ${c || "var(--line)"}`, background: "#fff", font: "800 24px/1 var(--f-display)", whiteSpace: "nowrap", color: c || P.ink } }, t);
          const op = t => s.h("span", { class: "later", style: { font: "800 21px/1 var(--f-display)", color: P.red, whiteSpace: "nowrap" } }, t);
          const mk = (lab, icon, txt, chain, first) => {
            const els = [box(chain[0][0] + " → " + chain[0][1]), op(chain[1]), box(chain[2][0] + " → " + chain[2][1]), op(chain[3]), box(chain[4][0] + " → " + chain[4][1], U)];
            const c = life(s, { class: "life " + (first ? "a-up" : "later"), label: "Im Alltag · " + lab, style: { padding: "12px 16px" } },
              s.h("div", { class: "row", style: { gap: "14px", flexWrap: "nowrap" } }, s.h("span", { style: { fontSize: "44px", flex: "none" } }, icon),
                s.h("div", { class: "stack", style: { gap: "10px", minWidth: 0 } }, s.h("p", { class: "small" }, txt), s.h("div", { class: "row", style: { gap: "10px", flexWrap: "nowrap" } }, ...els))));
            c.run = async () => { for (let i = 0; i < els.length; i++) { i % 2 ? s.sfx.whoosh() : s.sfx.pop(); await s.show(els[i], i % 2 ? "left" : "pop"); } s.sfx.ding(); };
            return c;
          };
          const c1 = mk("Minecraft", "🪵", "Für ein Haus brauchst du 36 Bretter. Wie viele Holzstämme musst du fällen?", [["4 Bretter", "1 Stamm"], "· 9", ["36 Bretter", "9 Stämme"], "", ["", ""]], true);
          // Minecraft has only one step: fix chain manually
          const c2 = mk("Duschen", "🚿", "2 Minuten duschen: 24 Liter Wasser (Beispiel). Und 7 Minuten?", [["2 min", "24 l"], ": 2", ["1 min", "12 l"], "· 7", ["7 min", "84 l"]]);
          const c3 = mk("Klassenfahrt", "🚌", "3 Tage Jugendherberge kosten 135 €. Was kosten 5 Tage?", [["3 Tage", "135 €"], ": 3", ["1 Tag", "45 €"], "· 5", ["5 Tage", "225 €"]]);
          // trim the empty parts of card 1
          const row1 = c1.querySelectorAll(".row")[1]; [...row1.children].slice(3).forEach(e => e.remove());
          row1.children[2].style.color = U; row1.children[2].style.borderColor = U;
          const els1 = [...row1.children];
          c1.run = async () => { for (let i = 0; i < els1.length; i++) { i % 2 ? s.sfx.whoosh() : s.sound("holzblock", { vol: .6 }); await s.show(els1[i], i % 2 ? "left" : "pop"); } s.sfx.ding(); };
          s.add(root(s, "stack", { gap: "16px", justifyContent: "center" }, c1, c2, c3));
          s.step(async () => { await c1.run(); s.say("Ein Stamm gibt vier Bretter. Für sechsunddreißig Bretter brauchst du neun Stämme."); });
          s.step(async () => { s.sound("water-pour", { vol: .35, dur: 1.5 }); await s.show(c2, "up"); await c2.run(); s.say("Zwei Minuten, vierundzwanzig Liter. Eine Minute, zwölf Liter. Sieben Minuten, vierundachtzig Liter."); });
          s.step(async () => { s.sound("bus-faehrt", { vol: .4, dur: 2 }); await s.show(c3, "up"); await c3.run(); s.say("Ein Tag kostet fünfundvierzig Euro, fünf Tage zweihundertfünfundzwanzig Euro."); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Nicht proportional: das Taxi",
        say: "Beim Taxi zahlst du einen Grundpreis, auch wenn du noch keinen Meter gefahren bist. Darum ist die Zuordnung nicht proportional.",
        build(s) {
          const G = graph(s, { W: 560, H: 470, xMax: 8, yMax: 24, xStep: 1, yStep: 4, xLab: "Strecke in km", yLab: "Preis in €" });
          const taxi = later(s.el("line", { x1: G.X(0), y1: G.Y(4), x2: G.X(8), y2: G.Y(20), stroke: U, "stroke-width": 4 }));
          const prop = later(s.el("line", { x1: G.X(0), y1: G.Y(0), x2: G.X(6), y2: G.Y(24), stroke: P.pencil, "stroke-width": 3, "stroke-dasharray": "8 6" }));
          const start = later(fb(s.el("circle", { cx: G.X(0), cy: G.Y(4), r: 10, fill: P.red })));
          const sLab = later(fb(T(s, G.X(0) + 18, G.Y(4) + 28, "Grundpreis 4 €", { "font-size": 19, fill: P.red, "text-anchor": "start" })));
          const p2 = later(fb(s.el("circle", { cx: G.X(2), cy: G.Y(8), r: 8, fill: U }))), p4 = later(fb(s.el("circle", { cx: G.X(4), cy: G.Y(12), r: 8, fill: U })));
          const pLab = later(fb(T(s, G.X(4) + 14, G.Y(12) + 26, "4 km: 12 €", { "font-size": 19, fill: U, "text-anchor": "start" })));
          G.svg.append(prop, taxi, start, sLab, p2, p4, pLab);
          const LD = ladder(s, "Strecke", "Preis", [["2 km", "8 €"], ["4 km", "12 €"]], ["· 2", "· 2 ?"], { cw: 120, ow: 70, fs: 26, ch: 52, gh: 30, showAll: true });
          const no = s.h("p", { class: "t later", style: { color: P.red, fontWeight: 700 } }, "Doppelte Strecke – aber nicht der doppelte Preis! 8 € · 2 wären 16 €.");
          const tarif = s.h("div", { class: "card a-up", style: { display: "flex", gap: "14px", alignItems: "center", padding: "10px 14px" } }, s.photo("taxi-berlin", { w: 150, h: 96 }),
            s.h("p", { class: "small" }, "Beispiel-Tarif: ", s.h("b", null, "4 € Grundpreis"), " + ", s.h("b", null, "2 € pro km"), "."));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Der Graph ist zwar eine Gerade, beginnt aber ", s.h("b", null, "nicht bei 0"), ". Die Zuordnung ist ", s.h("b", null, "nicht proportional"), ".");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "560px 1fr", gap: "22px", alignItems: "center" }, s.h("div", { class: "a-fade" }, G.svg),
            s.h("div", { class: "stack", style: { gap: "12px" } }, tarif, LD.el, no, merk)));
          s.sfx.pop();
          s.step(async () => { s.sfx.ding(); await s.show(start, "pop"); await s.show(sLab, "up"); s.say("Schon beim Einsteigen kostet es vier Euro."); });
          s.step(async () => { s.sound("bus-faehrt", { vol: .3, dur: 2 }); await s.show(taxi, "draw"); s.show(p2, "pop"); s.show(p4, "pop"); await s.show(pLab, "up"); s.say("Jeder Kilometer kostet zwei Euro dazu. Zwei Kilometer: acht Euro. Vier Kilometer: zwölf Euro."); });
          s.step(async () => { LD.ops.forEach(([a, b]) => { s.show(a, "down"); s.show(b, "down"); }); s.sfx.error(); await s.show(no, "up"); s.show(prop, "fade"); s.say("Doppelt so weit, aber nicht doppelt so teuer. Die gestrichelte Linie wäre proportional."); });
          s.step(async () => { s.sfx.pop(); await s.show(merk, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Nicht proportional: Wachsen",
        say: "Jedem Alter ist eine Körpergröße zugeordnet. Aber wer doppelt so alt ist, ist nicht doppelt so groß!",
        build(s) {
          const G = graph(s, { W: 580, H: 500, xMax: 20, yMax: 300, xStep: 2, yStep: 50, xLab: "Alter in Jahren", yLab: "Größe in cm" });
          const DATA = [[0, 50], [1, 75], [2, 87], [5, 110], [10, 140], [15, 170], [20, 180]];
          const pts = DATA.map(([a, h]) => { const c = later(fb(s.el("circle", { cx: G.X(a), cy: G.Y(h), r: 8, fill: U }))); G.svg.append(c); return c; });
          const d = DATA.map(([a, h], i) => (i ? "L" : "M") + G.X(a) + "," + G.Y(h)).join(" ");
          const curve = later(s.el("path", { d, fill: "none", stroke: U, "stroke-width": 3.5, opacity: .7 }));
          G.svg.insertBefore(curve, pts[0]);
          const ghost = later(fb(s.el("g")));
          ghost.append(s.el("circle", { cx: G.X(20), cy: G.Y(280), r: 12, fill: "none", stroke: P.red, "stroke-width": 3, "stroke-dasharray": "5 4" }),
            s.el("line", { x1: G.X(20) - 9, y1: G.Y(280) - 9, x2: G.X(20) + 9, y2: G.Y(280) + 9, stroke: P.red, "stroke-width": 3 }), s.el("line", { x1: G.X(20) + 9, y1: G.Y(280) - 9, x2: G.X(20) - 9, y2: G.Y(280) + 9, stroke: P.red, "stroke-width": 3 }),
            T(s, G.X(20) - 20, G.Y(280) + 6, "280 cm?", { "font-size": 20, fill: P.red, "text-anchor": "end" }));
          G.svg.append(ghost);
          const c1 = s.h("div", { class: "card later", style: { padding: "12px 16px" } }, s.h("p", { class: "t" }, "Mit ", s.h("b", null, "10 Jahren"), ": etwa ", s.h("b", { style: { color: U } }, "140 cm"), "."));
          const c2 = s.h("div", { class: "card later", style: { padding: "12px 16px" } }, s.h("p", { class: "t" }, "Mit ", s.h("b", null, "20 Jahren"), ": nicht 280 cm, sondern etwa ", s.h("b", { style: { color: U } }, "180 cm"), "."));
          const c3 = s.h("p", { class: "small pencil later" }, "Beispielwerte für einen Jungen, gerundet. Kleine Kinder wachsen schnell, später immer langsamer – irgendwann gar nicht mehr.");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Nicht jede Zuordnung ist proportional! Prüfe immer: Gehört zum ", s.h("b", null, "Doppelten"), " auch das ", s.h("b", null, "Doppelte"), "?");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "580px 1fr", gap: "24px", alignItems: "center" }, s.h("div", { class: "a-fade" }, G.svg), s.h("div", { class: "stack", style: { gap: "14px" } }, c1, c2, c3, merk)));
          s.sfx.pop();
          s.step(async () => { for (let i = 0; i < pts.length; i++) { s.sfx.note(i * 2, .15); await s.show(pts[i], "bounce"); } s.sound("pencil-write", { vol: .4, dur: 1 }); await s.show(curve, "draw"); s.say("Die Punkte liegen nicht auf einer Geraden. Die Kurve wird immer flacher."); });
          s.step(async () => { s.sfx.pop(); await s.show(c1, "left"); s.say("Mit zehn Jahren ist ein Kind etwa einhundertvierzig Zentimeter groß."); });
          s.step(async () => { s.sfx.boing(); await s.show(ghost, "zoom"); await s.show(c2, "left"); await s.show(c3, "fade"); s.say("Wäre das proportional, wäre man mit zwanzig zwei Meter achtzig groß. Zum Glück nicht!"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Zufall: Was kann passieren?",
        say: "Beim Münzwurf, beim Würfeln oder am Glücksrad weißt du vorher nicht, was kommt. Aber du kennst alle möglichen Ergebnisse.",
        build(s) {
          const chip = (t, c) => s.h("span", { class: "chip later", style: { fontSize: "21px", background: "#fff", border: `2px solid ${c || U}`, color: c || P.ink } }, t);
          const card = (lab, vis, chips, first) => {
            const c = ex(s, lab, { class: "ex " + (first ? "a-up" : "later"), style: { padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px" } },
              s.h("div", { class: "row", style: { gap: "16px", flexWrap: "nowrap" } }, vis, s.h("div", { class: "row", style: { gap: "8px" } }, ...chips)));
            c.chips = chips; return c;
          };
          // coin
          const cs = s.svg(130, 130), coin = fb(s.el("g"));
          coin.append(s.el("circle", { cx: 65, cy: 65, r: 56, fill: "#e8c25a", stroke: "#a77d10", "stroke-width": 4 }), s.el("circle", { cx: 65, cy: 65, r: 44, fill: "none", stroke: "#a77d10", "stroke-width": 2 }));
          const ctext = T(s, 65, 73, "Zahl", { "font-size": 24, fill: "#7a5a06" }); coin.append(ctext); cs.append(coin);
          // die
          const ds = s.svg(130, 130), dg = s.el("g"); ds.append(dg);
          const face = n => { dg.innerHTML = ""; dg.append(die(s, 15, 15, n, 100)); };
          face(5);
          // wheel
          const ws = s.svg(130, 130); ws.append(wheel(s, 65, 68, 56, [COL.rot, COL.blau, COL.rot, COL.gelb, COL.rot, COL.blau]), s.el("polygon", { points: "57,2 73,2 65,18", fill: P.ink }));
          // bag
          const bs = s.svg(130, 130);
          bs.append(s.el("path", { d: "M30,40 Q20,120 65,124 Q110,120 100,40 Z", fill: "#c9a36b", stroke: "#8a6a3a", "stroke-width": 3 }), s.el("path", { d: "M34,40 Q65,26 96,40", fill: "none", stroke: "#8a6a3a", "stroke-width": 4 }));
          [[50, 70, "rot"], [78, 66, "blau"], [62, 96, "rot"], [86, 98, "gelb"], [44, 100, "blau"]].forEach(([x, y, c]) => bs.append(s.el("circle", { cx: x, cy: y, r: 11, fill: COL[c], stroke: P.ink, "stroke-width": 1.5 })));
          const k1 = card("Münze", cs, [chip("Kopf"), chip("Zahl")], true);
          const k2 = card("Würfel", ds, [1, 2, 3, 4, 5, 6].map(n => chip(String(n))));
          const k3 = card("Glücksrad", ws, [chip("Rot", COL.rot), chip("Blau", COL.blau), chip("Gelb", "#b8900a")]);
          const k4 = card("Beutel mit Kugeln", bs, [chip("Rot", COL.rot), chip("Blau", COL.blau), chip("Gelb", "#b8900a")]);
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Ein ", s.h("b", null, "Zufallsexperiment"), ": Das Ergebnis ist vorher nicht sicher. Alle ", s.h("b", null, "möglichen Ergebnisse"), " kannst du aber aufzählen.");
          s.add(root(s, "stack", { gap: "14px", justifyContent: "center" }, s.h("div", { class: "cols", style: { gap: "14px 18px" } }, k1, k2, k3, k4), merk));
          s.preload("muenzwurf", "wuerfeln", "gluecksrad");
          s.step(async () => {
            s.sound("muenzwurf", { vol: .7 });
            await s.tween({ from: 0, to: 1, dur: 1400, ease: "out", update: t => { const a = t * 6 * Math.PI; coin.style.transform = `scaleY(${Math.cos(a)})`; ctext.textContent = Math.cos(a) >= 0 ? "Zahl" : "Kopf"; } });
            coin.style.transform = ""; ctext.textContent = "Zahl";
            for (const c of k1.chips) { s.sfx.pop(); await s.show(c, "pop"); }
            s.say("Bei der Münze gibt es zwei Ergebnisse: Kopf oder Zahl.");
          });
          s.step(async () => { await s.show(k2, "up"); s.sound("wuerfeln", { vol: .7 }); for (let i = 0; i < 8; i++) { face(1 + Math.floor(Math.random() * 6)); await s.wait(80); } face(3); for (const c of k2.chips) { s.sfx.tick(); await s.show(c, "pop"); } s.say("Beim Würfel gibt es sechs Ergebnisse: eins bis sechs."); });
          s.step(async () => { await s.show(k3, "up"); s.sound("gluecksrad", { vol: .5, dur: 1.5 }); for (const c of k3.chips) { s.sfx.pop(); await s.show(c, "pop"); } s.show(k4, "up"); for (const c of k4.chips) { s.sfx.pop(); await s.show(c, "pop"); } s.say("Beim Glücksrad und beim Beutel: Rot, Blau oder Gelb."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Sicher, möglich, unmöglich",
        say: "Manche Ereignisse treten sicher ein, manche sind nur möglich, und manche sind unmöglich.",
        build(s) {
          const colS = (t, c, bg) => s.h("div", { style: { display: "flex", flexDirection: "column", gap: "10px" } },
            s.h("div", { style: { background: c, color: "#fff", font: "800 26px/1 var(--f-display)", padding: "12px", borderRadius: "12px", textAlign: "center" } }, t), s.h("div", { class: "stack", style: { gap: "10px", background: bg, borderRadius: "14px", padding: "10px", minHeight: "240px" } }));
          const cU = colS("unmöglich", P.red, "#fde9e7"), cM = colS("möglich", P.orange, "#fff1e0"), cS = colS("sicher", P.green, "#e6f6ee");
          const card = (icon, t) => s.h("div", { class: "card later", style: { display: "flex", gap: "10px", alignItems: "center", padding: "10px 12px" } }, s.h("span", { style: { fontSize: "30px", flex: "none" } }, icon), s.h("p", { class: "small" }, t));
          const EV = [
            [cU, "🎲", "Der Würfel zeigt eine 7."],
            [cM, "🎲", "Der Würfel zeigt eine 6."],
            [cS, "🎲", "Der Würfel zeigt eine Zahl von 1 bis 6."],
            [cM, "🪙", "Die Münze zeigt Kopf."],
            [cU, "🔴", "Aus einem Beutel mit nur roten Kugeln ziehst du eine blaue."],
            [cS, "📅", "Nach einem Sonntag kommt ein Montag."],
          ].map(([col, i, t]) => { const c = card(i, t); col.lastChild.append(c); return c; });
          const bar = s.h("div", { class: "later stack", style: { gap: "8px" } }, s.h("div", { style: { height: "26px", borderRadius: "13px", background: `linear-gradient(90deg, ${P.red}, ${P.orange} 50%, ${P.green})` } }),
            s.h("div", { style: { display: "flex", justifyContent: "space-between" } }, s.h("p", { class: "t", style: { color: P.red, fontWeight: 700 } }, "Wahrscheinlichkeit 0"), s.h("p", { class: "t", style: { color: P.orange, fontWeight: 700 } }, "irgendwo dazwischen"), s.h("p", { class: "t", style: { color: P.green, fontWeight: 700 } }, "Wahrscheinlichkeit 1")));
          s.add(root(s, "stack", { gap: "16px", justifyContent: "center" }, s.h("div", { class: "cols3 a-up", style: { gap: "18px" } }, cU, cM, cS), bar));
          s.sfx.pop();
          const go = async (a, b, say) => { s.sfx.pop(); await s.show(EV[a], "down"); s.sfx.pop(); await s.show(EV[b], "down"); s.say(say); };
          s.step(async () => { s.sound("wuerfeln", { vol: .6 }); await go(0, 1, "Eine Sieben gibt es auf dem Würfel nicht: unmöglich. Eine Sechs ist möglich."); });
          s.step(async () => { await go(2, 3, "Irgendeine Zahl von eins bis sechs kommt sicher. Kopf ist möglich."); });
          s.step(async () => { await go(4, 5, "Eine blaue Kugel kann man nicht ziehen, wenn keine drin ist. Und nach Sonntag kommt sicher Montag."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(bar, "left"); s.say("Unmöglich hat die Wahrscheinlichkeit null, sicher die Wahrscheinlichkeit eins. Alles Mögliche liegt dazwischen."); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Wahrscheinlichkeit als Bruch",
        say: "Wie wahrscheinlich ist eine Sechs? Wir teilen die günstigen Ergebnisse durch alle möglichen Ergebnisse.",
        build(s) {
          const W = 760, H = 140, svg = s.svg(W, H);
          const faces = [1, 2, 3, 4, 5, 6].map(n => { const g = die(s, 20 + (n - 1) * 124, 20, n, 100); svg.append(g); return g; });
          const mark = ns => faces.forEach((f, i) => { const on = ns.includes(i + 1); f.box.setAttribute("fill", on ? "#ffe9a8" : "#fff"); f.box.setAttribute("stroke", on ? U : P.ink); f.box.setAttribute("stroke-width", on ? 6 : 3); });
          const formula = s.h("div", { class: "merk a-up", style: { display: "flex", alignItems: "center", gap: "14px", fontSize: "24px", padding: "12px 20px" } },
            s.h("b", null, "Wahrscheinlichkeit = "), frac(s, "Anzahl der günstigen Ergebnisse", "Anzahl aller möglichen Ergebnisse", P.ink, "22px"));
          const row = (t, a, b, extra) => s.h("div", { class: "card later", style: { display: "flex", alignItems: "center", gap: "18px", padding: "8px 18px" } },
            s.h("p", { class: "t", style: { flex: 1 } }, t), s.h("span", { style: { font: "800 32px/1 var(--f-display)", color: U, display: "flex", alignItems: "center" } }, frac(s, a, b), extra || ""));
          const r1 = row("eine 6", 1, 6), r2 = row("eine gerade Zahl (2, 4, 6)", 3, 6, s.h("span", null, " = ", frac(s, 1, 2))), r3 = row("mehr als 4 (5, 6)", 2, 6, s.h("span", null, " = ", frac(s, 1, 3)));
          const coin = s.h("p", { class: "small later", style: { color: P.pencil } }, "Bei der Münze: Kopf hat die Wahrscheinlichkeit 1 von 2, also ½.");
          s.add(root(s, "stack", { gap: "12px", justifyContent: "center" }, formula, s.h("div", { class: "a-fade", style: { display: "flex", justifyContent: "center" } }, svg), r1, r2, r3, coin));
          s.sfx.pop();
          s.step(async () => { mark([6]); s.sfx.ding(); await s.show(r1, "up"); s.say("Eine Sechs: ein günstiges Ergebnis von sechs möglichen. Ein Sechstel."); });
          s.step(async () => { mark([2, 4, 6]); s.sfx.chord([0, 4, 7]); await s.show(r2, "up"); s.say("Gerade Zahlen: zwei, vier und sechs. Drei von sechs, das ist die Hälfte."); });
          s.step(async () => { mark([5, 6]); s.sfx.chord([0, 3, 7]); await s.show(r3, "up"); s.say("Mehr als vier: fünf und sechs. Zwei Sechstel, also ein Drittel."); });
          s.step(async () => { mark([]); s.sound("muenzwurf", { vol: .6 }); await s.show(coin, "fade"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Das Glücksrad",
        say: "Dieses Glücksrad hat acht gleich große Felder: vier rote, drei blaue und ein gelbes. Welche Farbe kommt am häufigsten?",
        build(s) {
          const CS = ["rot", "blau", "rot", "gelb", "rot", "blau", "rot", "blau"];
          const W = 440, H = 460, svg = s.svg(W, H), cx = 220, cy = 240, r = 200;
          const wg = wheel(s, cx, cy, r, CS.map(c => COL[c]));
          const rot = s.el("g"); rot.append(wg); svg.append(rot, s.el("polygon", { points: `${cx - 18},4 ${cx + 18},4 ${cx},40`, fill: P.ink, stroke: "#fff", "stroke-width": 2 }));
          let angle = 0, busy = false;
          const counts = { rot: 0, blau: 0, gelb: 0 };
          const cnt = {};
          const pRow = (c, k) => {
            cnt[c] = s.h("b", { class: "mono", style: { minWidth: "44px", textAlign: "right" } }, "0");
            return s.h("div", { class: "card later", style: { display: "flex", alignItems: "center", gap: "16px", padding: "8px 16px", borderLeft: `10px solid ${COL[c]}` } },
              s.h("span", { class: "t", style: { width: "70px" } }, WORD[c]), s.h("span", { style: { font: "800 30px/1 var(--f-display)", color: U, display: "flex", alignItems: "center" } }, frac(s, k, 8)),
              s.h("span", { class: "small pencil", style: { flex: 1, textAlign: "right" } }, "gedreht:"), cnt[c]);
          };
          const rows = [pRow("rot", 4), pRow("blau", 3), pRow("gelb", 1)];
          const res = s.h("p", { class: "h2", style: { minHeight: "38px" } }, "");
          async function spin() {
            if (busy) return; busy = true;
            const turn = 720 + Math.random() * 720; const to = angle + turn;
            s.sound("gluecksrad", { vol: .5 });
            let lastSec = -1;
            await s.tween({ from: angle, to, dur: 2600, ease: "out", update: a => { rot.setAttribute("transform", `rotate(${a} ${cx} ${cy})`); const sec = Math.floor(a / 45); if (sec !== lastSec) { lastSec = sec; } } });
            angle = to % 360; rot.setAttribute("transform", `rotate(${angle} ${cx} ${cy})`);
            const idx = Math.floor((((360 - angle) % 360) + 360) % 360 / 45);
            const c = CS[idx]; counts[c]++; cnt[c].textContent = String(counts[c]);
            res.innerHTML = ""; res.append("Ergebnis: ", s.h("span", { style: { color: c === "gelb" ? "#b8900a" : COL[c] } }, WORD[c]));
            s.sfx.ding(); busy = false;
          }
          const btn = s.h("button", { class: "btn solid later", onclick: () => { s.sfx.click(); spin(); } }, "Drehen!");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Rot hat die größte Fläche, also die größte Wahrscheinlichkeit: ", frac(s, 4, 8), " = ", frac(s, 1, 2), ". Gelb ist am seltensten: ", frac(s, 1, 8), ".");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "440px 1fr", gap: "26px", alignItems: "center" }, s.h("div", { class: "a-zoom" }, svg),
            s.h("div", { class: "stack", style: { gap: "12px" } }, ...rows, s.h("div", { class: "row", style: { gap: "18px" } }, btn, res), merk)));
          s.sfx.pop();
          s.step(async () => { for (const rw of rows) { s.sfx.pop(); await s.show(rw, "left"); } s.say("Rot: vier von acht Feldern. Blau: drei von acht. Gelb: eins von acht."); });
          s.step(async () => { await s.show(btn, "pop"); await spin(); s.say("Tippe auf Drehen und zähle mit!"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Ziehen aus dem Beutel",
        say: "Im Beutel liegen zehn Kugeln: fünf rote, drei blaue und zwei gelbe. Du ziehst eine, ohne hinzusehen.",
        build(s) {
          const W = 420, H = 440, svg = s.svg(W, H);
          svg.append(s.el("path", { d: "M80,170 Q40,420 210,428 Q380,420 340,170 Z", fill: "#c9a36b", stroke: "#8a6a3a", "stroke-width": 4 }), s.el("path", { d: "M84,170 Q210,130 336,170", fill: "none", stroke: "#8a6a3a", "stroke-width": 6 }));
          const BALLS = ["rot", "rot", "rot", "rot", "rot", "blau", "blau", "blau", "gelb", "gelb"];
          const POS = [[140, 230], [200, 220], [262, 232], [120, 300], [300, 300], [180, 290], [240, 300], [160, 360], [220, 365], [280, 360]];
          BALLS.forEach((c, i) => svg.append(s.el("circle", { cx: POS[i][0], cy: POS[i][1], r: 24, fill: COL[c], stroke: P.ink, "stroke-width": 2 })));
          const drawn = s.el("circle", { cx: 210, cy: 300, r: 30, fill: COL.rot, stroke: P.ink, "stroke-width": 3, opacity: 0 });
          const hand = s.el("text", { x: 210, y: 90, "text-anchor": "middle", "font-size": 50, text: "✋", opacity: 0 });
          svg.append(drawn, hand);
          const counts = { rot: 0, blau: 0, gelb: 0 }, cnt = {};
          const pRow = (c, k, extra) => { cnt[c] = s.h("b", { class: "mono", style: { minWidth: "44px", textAlign: "right" } }, "0"); return s.h("div", { class: "card later", style: { display: "flex", alignItems: "center", gap: "14px", padding: "6px 16px", borderLeft: `10px solid ${COL[c]}` } },
            s.h("span", { class: "t", style: { width: "70px" } }, WORD[c]), s.h("span", { style: { font: "800 28px/1 var(--f-display)", color: U, display: "flex", alignItems: "center" } }, frac(s, k, 10), extra ? s.h("span", { style: { display: "flex", alignItems: "center" } }, " = ", frac(s, extra[0], extra[1])) : ""),
            s.h("span", { class: "small pencil", style: { flex: 1, textAlign: "right" } }, "gezogen:"), cnt[c]); };
          const rows = [pRow("rot", 5, [1, 2]), pRow("blau", 3), pRow("gelb", 2, [1, 5])];
          let busy = false;
          async function pull() {
            if (busy) return; busy = true;
            const c = BALLS[Math.floor(Math.random() * 10)];
            hand.setAttribute("opacity", 1); s.sfx.whoosh();
            await s.tween({ from: 90, to: 250, dur: 450, update: y => hand.setAttribute("y", y) });
            drawn.setAttribute("fill", COL[c]); drawn.setAttribute("opacity", 1); s.sound("murmeln-rollen", { vol: .4, dur: .6 });
            await s.tween({ from: 250, to: 90, dur: 600, ease: "out", update: y => { hand.setAttribute("y", y); drawn.setAttribute("cy", y - 10); } });
            counts[c]++; cnt[c].textContent = String(counts[c]); s.sfx.ding();
            await s.wait(500);
            await s.tween({ from: 80, to: 300, dur: 450, ease: "in", update: y => drawn.setAttribute("cy", y) });
            drawn.setAttribute("opacity", 0); hand.setAttribute("opacity", 0); hand.setAttribute("y", 90); drawn.setAttribute("cy", 300);
            busy = false;
          }
          const btn = s.h("button", { class: "btn solid later", onclick: () => { s.sfx.click(); pull(); } }, "Ziehen und zurücklegen");
          const lf = life(s, { class: "life later", label: "Im Alltag · Tombola beim Schulfest", style: { padding: "10px 16px" } }, s.h("p", { class: "small" }, "200 Lose, davon 50 Gewinne. Die Wahrscheinlichkeit für einen Gewinn: ", s.h("b", null, "50 von 200"), " = ", s.h("b", null, "1 von 4"), "."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "420px 1fr", gap: "26px", alignItems: "center" }, s.h("div", { class: "a-fade" }, svg),
            s.h("div", { class: "stack", style: { gap: "12px" } }, ...rows, btn, lf)));
          s.preload("murmeln-rollen");
          s.sfx.pop();
          s.step(async () => { for (const rw of rows) { s.sfx.pop(); await s.show(rw, "left"); } s.say("Rot: fünf von zehn, also die Hälfte. Blau: drei Zehntel. Gelb: zwei Zehntel, also ein Fünftel."); });
          s.step(async () => { await s.show(btn, "pop"); await pull(); s.say("Ziehen, anschauen, zurücklegen. Tippe und zieh noch öfter!"); });
          s.step(async () => { s.sound("kids-cheer", { vol: .4, dur: 2 }); await s.show(lf, "up"); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Viele Würfe: relative Häufigkeit",
        say: "Wir würfeln ganz oft und zählen die Sechsen. Je mehr Würfe, desto näher kommt der Anteil der Sechsen an ein Sechstel.",
        build(s) {
          const CW = 640, CH = 420, { canvas, g } = s.canvas(CW, CH);
          let n = 0, k = 0; const hist = [];
          const L = 64, R = 20, Tp = 20, B = 50, YM = 0.5;
          const nEl = s.h("b", { class: "mono" }, "0"), kEl = s.h("b", { class: "mono" }, "0"), fEl = s.h("b", { class: "mono", style: { color: U } }, "–");
          function draw() {
            g.clearRect(0, 0, CW, CH);
            const xMax = Math.max(10, n), X = i => L + (i / xMax) * (CW - L - R), Y = v => CH - B - (v / YM) * (CH - B - Tp);
            g.font = "600 17px system-ui, sans-serif"; g.fillStyle = P.pencil; g.textAlign = "right";
            for (let v = 0; v <= YM + 1e-9; v += 0.1) { g.strokeStyle = "#e1e8ef"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(L, Y(v)); g.lineTo(CW - R, Y(v)); g.stroke(); g.fillText(D(v, 1), L - 8, Y(v) + 6); }
            g.strokeStyle = P.ink; g.lineWidth = 3; g.beginPath(); g.moveTo(L, Tp - 6); g.lineTo(L, CH - B); g.lineTo(CW - R, CH - B); g.stroke();
            g.textAlign = "center"; g.fillText("0", L, CH - B + 24); g.fillText(D(xMax), CW - R - 14, CH - B + 24); g.fillText("Anzahl der Würfe", (L + CW - R) / 2, CH - B + 24);
            g.setLineDash([10, 7]); g.strokeStyle = P.green; g.lineWidth = 3; g.beginPath(); g.moveTo(L, Y(1 / 6)); g.lineTo(CW - R, Y(1 / 6)); g.stroke(); g.setLineDash([]);
            g.fillStyle = P.green; g.textAlign = "right"; g.font = "700 19px system-ui, sans-serif"; g.fillText("1/6 ≈ 0,17", CW - R - 4, Y(1 / 6) - 10);
            if (hist.length) { g.strokeStyle = U; g.lineWidth = 3; g.beginPath(); hist.forEach((v, i) => { const x = X(i + 1), y = Y(Math.min(YM, v)); i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.stroke(); }
          }
          function upd() { nEl.textContent = D(n); kEl.textContent = D(k); fEl.textContent = n ? D(k / n, 3) : "–"; draw(); }
          const throwOnce = () => { n++; if (Math.random() < 1 / 6) k++; hist.push(k / n); };
          let busy = false;
          function runTo(target) {
            if (busy || n >= target) return Promise.resolve(); busy = true;
            if (s.fast) { while (n < target) throwOnce(); upd(); busy = false; return Promise.resolve(); }
            return new Promise(res => {
              s.loop(() => {
                const per = Math.max(1, Math.ceil((target - (target >= 100 ? target / 10 : 0)) / 90));
                for (let i = 0; i < per && n < target; i++) throwOnce();
                upd(); if (n % 3 === 0) s.sfx.tick();
                if (n >= target) { busy = false; s.sfx.ding(); res(); return false; }
              });
            });
          }
          upd();
          const B_ = (t, m) => s.h("button", { class: "btn", style: { width: "100%" }, onclick: () => { s.sfx.click(); runTo(n + m); } }, t);
          const reset = s.h("button", { class: "btn", style: { width: "100%" }, onclick: () => { if (busy) return; n = 0; k = 0; hist.length = 0; upd(); s.sfx.swoosh(); } }, "↺ Von vorn");
          const stat = s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", gap: "6px", padding: "12px 16px", fontSize: "23px" } },
            s.h("p", { class: "t", style: { display: "flex", justifyContent: "space-between" } }, "Würfe:", nEl), s.h("p", { class: "t", style: { display: "flex", justifyContent: "space-between" } }, "Sechsen:", kEl),
            s.h("p", { class: "t", style: { display: "flex", justifyContent: "space-between" } }, "Anteil der Sechsen:", fEl));
          const btns = s.h("div", { class: "later", style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" } }, B_("+10", 10), B_("+100", 100), B_("+1000", 1000), reset);
          const merk = s.h("div", { class: "merk later", style: { fontSize: "20px", padding: "10px 18px 12px" } }, "Der Anteil heißt ", s.h("b", null, "relative Häufigkeit"), ": Sechsen geteilt durch Würfe. Bei ", s.h("b", null, "vielen"), " Würfen kommt sie der Wahrscheinlichkeit ", frac(s, 1, 6), " immer näher.");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: `${CW}px 1fr`, gap: "22px", alignItems: "center" }, s.h("div", { class: "card a-fade", style: { padding: "6px" } }, canvas),
            s.h("div", { class: "stack", style: { gap: "12px" } }, stat, btns, merk)));
          s.sfx.pop();
          s.step(async () => { s.sound("wuerfeln", { vol: .6 }); await runTo(10); s.say("Nach zehn Würfen schwankt der Anteil noch stark."); });
          s.step(async () => { await runTo(100); s.say("Nach hundert Würfen wird die Linie ruhiger."); });
          s.step(async () => { await runTo(1000); s.sfx.fanfare(); s.say("Nach tausend Würfen liegt der Anteil ganz nah bei einem Sechstel."); });
          s.step(async () => { s.show(btns, "up"); s.sfx.ding(); await s.show(merk, "up"); s.say("Probier es selbst! Jedes Mal sieht die Linie anders aus – aber am Ende landet sie bei einem Sechstel."); });
        },
      },
      /* 17 --------------------------------------------------------------- */
      {
        title: "Im Alltag: Zufall",
        say: "Wahrscheinlichkeiten begegnen dir beim Spielen, beim Fußball, in der Wetter-App und beim Lotto.",
        build(s) {
          const big = t => s.h("div", { style: { fontSize: "52px", width: "86px", textAlign: "center", flex: "none" } }, t);
          const card = (lab, vis, txt, res, first) => life(s, { class: "life " + (first ? "a-up" : "later"), label: "Im Alltag · " + lab, style: { padding: "12px 16px", display: "flex", flexDirection: "column", justifyContent: "center" } },
            s.h("div", { class: "row", style: { gap: "14px", flexWrap: "nowrap" } }, vis, s.h("div", { class: "stack", style: { gap: "6px", minWidth: 0 } }, s.h("p", { class: "small" }, ...txt), res)));
          const res = (...k) => s.h("p", { class: "h2 later", style: { color: U, display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" } }, ...k);
          const r1 = res("Chance: ", frac(s, 1, 6)), r2 = res("Chance: ", frac(s, 1, 2)), r3 = res("3 von 10 = 30 %"), r4 = res("1 zu 13.983.816");
          const c1 = card("Brettspiel", big("🎲"), ["„Mensch ärgere dich nicht“: Nur mit einer ", s.h("b", null, "6"), " darfst du eine Figur aufs Spielfeld setzen."], r1, true);
          const c2 = card("Fußball", s.photo("fussball", { w: 86, h: 86 }), ["Vor dem Anpfiff wirft der Schiedsrichter eine ", s.h("b", null, "Münze"), ". Wer gewinnt, wählt: Tor oder Anstoß."], r2);
          const c3 = card("Wetter-App", big("🌦️"), ["„30 % Regen“ heißt: Bei so einem Wetter hat es früher an ", s.h("b", null, "3 von 10"), " Tagen geregnet."], r3);
          const c4 = card("Lotto „6 aus 49“", big("🎟️"), ["Alle 6 Zahlen richtig? Es gibt fast 14 Millionen Möglichkeiten – nur eine gewinnt."], r4);
          s.add(root(s, "cols", { gridTemplateRows: "1fr 1fr", gap: "16px 18px" }, c1, c2, c3, c4));
          s.sound("wuerfeln", { vol: .5 });
          s.step(async () => { s.sfx.ding(); await s.show(r1, "up"); s.say("Die Chance auf eine Sechs ist ein Sechstel. Darum dauert es manchmal so lange!"); });
          s.step(async () => { s.sound("muenzwurf", { vol: .6 }); await s.show(c2, "right"); await s.show(r2, "up"); s.say("Beim Münzwurf haben beide Mannschaften dieselbe Chance: ein Halb."); });
          s.step(async () => { s.sound("rain", { vol: .35, dur: 2 }); await s.show(c3, "left"); await s.show(r3, "up"); s.say("Dreißig Prozent Regen: drei von zehn. Den Schirm kannst du vielleicht zu Hause lassen."); });
          s.step(async () => { s.sfx.drum(); await s.show(c4, "right"); await s.show(r4, "up"); s.say("Sechs Richtige im Lotto: eins zu fast vierzehn Millionen. Das ist sehr, sehr unwahrscheinlich."); });
        },
      },
    ],
  });
})();
