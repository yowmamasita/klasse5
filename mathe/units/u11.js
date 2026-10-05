/* Kapitel 11 – Negative Zahlen (Ausblick Klasse 6): Thermometer, Meeresspiegel, Stockwerke, Konto,
   Zahlengerade, Ordnen, Betrag, Gegenzahl, Temperaturänderungen, Koordinatensystem mit vier Quadranten */
(() => {
  const U = "#4338ca", SOFT = "#e8e7fb";
  const P = { blue: "#1d5bd0", red: "#dc3b2a", green: "#138a5a", violet: "#7b4fd6", orange: "#ee7a1a", ink: "#1b2740", pencil: "#5d6678", yellow: "#ffd94a", line: "#c8d3de", cold: "#1d6fd0", warm: "#dc3b2a" };
  const LBL = { font: "700 14px/1 var(--f-display)", letterSpacing: ".08em", textTransform: "uppercase", display: "block", marginBottom: "8px", color: "var(--green)" };
  const ex = (s, label, attrs, ...kids) => s.h("div", Object.assign({ class: "ex" }, attrs || {}), s.h("span", { class: "exlabel" }, label), ...kids);
  const life = (s, attrs, ...kids) => s.h("div", Object.assign({ class: "life" }, attrs || {}), s.h("span", { style: LBL }, (attrs && attrs.label) || "Im Alltag"), ...kids);
  const T = (s, x, y, text, a) => s.el("text", Object.assign({ x, y, "text-anchor": "middle", "font-size": 22, "font-weight": 700, fill: P.ink, text }, a || {}));
  const fb = el => { el.style.transformBox = "fill-box"; el.style.transformOrigin = "center"; return el; };
  const later = el => { el.classList.add("later"); return el; };
  const root = (s, cls, style, ...kids) => s.h("div", { class: cls, style: Object.assign({ height: "100%", fontSize: "22px" }, style || {}) }, ...kids);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  /* German number with a real minus sign */
  const N = (v, d = 0) => (v < 0 ? "−" : "") + Math.abs(v).toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });
  const Ns = (v, d = 0) => (v > 0 ? "+" : "") + N(v, d);
  const colOf = v => (v < 0 ? P.cold : v > 0 ? P.warm : P.ink);
  /* bracket a negative number when it follows an operator: 3 − (−2) */
  const NB = v => (v < 0 ? "(" + N(v) + ")" : N(v));

  /* vertical thermometer. o: {H, min, max, step, W} */
  function thermo(s, o = {}) {
    const H = o.H || 560, W = o.W || 190, min = o.min ?? -30, max = o.max ?? 40, step = o.step || 10, cx = W - 70;
    const top = 30, bot = H - 96;
    const y = v => top + ((max - v) / (max - min)) * (bot - top);
    const svg = s.svg(W, H);
    svg.append(s.el("rect", { x: cx - 20, y: top - 18, width: 40, height: bot - top + 60, rx: 20, fill: "#fff", stroke: P.ink, "stroke-width": 3 }));
    for (let v = min; v <= max; v += 2) {
      const major = v % step === 0;
      svg.append(s.el("line", { x1: cx - 34, x2: cx - (major ? 22 : 27), y1: y(v), y2: y(v), stroke: v === 0 ? P.red : P.pencil, "stroke-width": v === 0 ? 3 : major ? 2.5 : 1.5 }));
      if (major) svg.append(T(s, cx - 42, y(v) + 7, N(v), { "text-anchor": "end", "font-size": 20, fill: v === 0 ? P.red : v < 0 ? P.cold : P.ink }));
    }
    const liq = s.el("rect", { x: cx - 9, y: y(0), width: 18, height: bot + 20 - y(0), rx: 4, fill: P.warm });
    const bulb = s.el("circle", { cx, cy: H - 48, r: 32, fill: P.warm, stroke: P.ink, "stroke-width": 3 });
    svg.append(liq, bulb, s.el("text", { x: cx, y: H - 40, "text-anchor": "middle", "font-size": 22, "font-weight": 800, fill: "#fff", text: "°C" }));
    let cur = 0;
    const set = v => {
      cur = v; const yy = y(v), c = v < 0 ? P.cold : P.warm;
      liq.setAttribute("y", yy); liq.setAttribute("height", Math.max(0, H - 60 - yy)); liq.setAttribute("fill", c); bulb.setAttribute("fill", c);
    };
    set(o.value ?? 0);
    const go = (to, dur = 900, onV) => s.tween({ from: cur, to, dur, ease: "inOut", update: v => { set(v); onV && onV(v); } });
    return { svg, set, go, y, cx, get v() { return cur; } };
  }

  /* horizontal number line. o: {W, H, min, max, y, pad, labelEvery} */
  function numLine(s, o = {}) {
    const W = o.W || 1060, H = o.H || 120, min = o.min ?? -10, max = o.max ?? 10, pad = o.pad ?? 34, yy = o.y ?? 60, every = o.every || 1;
    const X = v => pad + ((v - min) / (max - min)) * (W - 2 * pad);
    const svg = s.svg(W, H);
    const axis = s.el("g");
    axis.append(s.el("line", { x1: pad - 22, x2: W - pad + 22, y1: yy, y2: yy, stroke: P.ink, "stroke-width": 3 }),
      s.el("polygon", { points: `${W - pad + 30},${yy} ${W - pad + 16},${yy - 8} ${W - pad + 16},${yy + 8}`, fill: P.ink }),
      s.el("polygon", { points: `${pad - 30},${yy} ${pad - 16},${yy - 8} ${pad - 16},${yy + 8}`, fill: P.ink }));
    const ticks = s.el("g"), nums = s.el("g");
    for (let v = min; v <= max; v++) {
      ticks.append(s.el("line", { x1: X(v), x2: X(v), y1: yy - (v === 0 ? 14 : 9), y2: yy + (v === 0 ? 14 : 9), stroke: v === 0 ? P.ink : P.pencil, "stroke-width": v === 0 ? 4 : 2 }));
      if (v % every === 0) nums.append(T(s, X(v), yy + 38, N(v), { "font-size": o.fs || 20, fill: colOf(v) }));
    }
    svg.append(axis, ticks, nums);
    return { svg, X, y: yy, W, H, axis, ticks, nums, min, max };
  }
  const arrowHead = (s, x, y, dir, c) => s.el("polygon", { points: dir > 0 ? `${x},${y} ${x - 14},${y - 8} ${x - 14},${y + 8}` : `${x},${y} ${x + 14},${y - 8} ${x + 14},${y + 8}`, fill: c });

  /* coordinate system with four quadrants. o: {W, min, max, u} */
  function kosy4(s, o = {}) {
    const min = o.min ?? -6, max = o.max ?? 6, u = o.u || 44, pad = 30;
    const W = (max - min) * u + 2 * pad, H = W;
    const ox = pad - min * u, oy = pad + max * u;
    const X = v => ox + v * u, Y = v => oy - v * u;
    const svg = s.svg(W, H);
    const quads = s.el("g");
    const qc = ["#fde9e7", "#e6eefc", "#e8f6ee", "#fff3c9"];
    const QR = [[X(0), Y(max), X(max), Y(0)], [X(min), Y(max), X(0), Y(0)], [X(min), Y(0), X(0), Y(min)], [X(0), Y(0), X(max), Y(min)]];
    const qrects = QR.map(([x1, y1, x2, y2], i) => { const r = s.el("rect", { x: x1, y: y1, width: x2 - x1, height: y2 - y1, fill: qc[i] }); quads.append(r); return r; });
    const grid = s.el("g");
    for (let v = min; v <= max; v++) {
      grid.append(s.el("line", { x1: X(v), x2: X(v), y1: Y(max), y2: Y(min), stroke: "#cfdbe6", "stroke-width": 1.2 }));
      grid.append(s.el("line", { x1: X(min), x2: X(max), y1: Y(v), y2: Y(v), stroke: "#cfdbe6", "stroke-width": 1.2 }));
    }
    const ax = (x1, y1, x2, y2) => s.el("line", { x1, y1, x2, y2, stroke: P.ink, "stroke-width": 3, "stroke-linecap": "round" });
    const posAxes = s.el("g"), negAxes = s.el("g");
    posAxes.append(ax(X(0), Y(0), X(max) + 18, Y(0)), ax(X(0), Y(0), X(0), Y(max) - 18),
      s.el("polygon", { points: `${X(max) + 26},${Y(0)} ${X(max) + 12},${Y(0) - 8} ${X(max) + 12},${Y(0) + 8}`, fill: P.ink }),
      s.el("polygon", { points: `${X(0)},${Y(max) - 26} ${X(0) - 8},${Y(max) - 12} ${X(0) + 8},${Y(max) - 12}`, fill: P.ink }));
    const nx = ax(X(0), Y(0), X(min) - 10, Y(0)), ny = ax(X(0), Y(0), X(0), Y(min) + 10);
    negAxes.append(nx, ny);
    const posNums = s.el("g"), negNums = s.el("g");
    for (let v = min; v <= max; v++) {
      if (!v || v % 2) continue;
      const g = v > 0 ? posNums : negNums;
      g.append(T(s, X(v), Y(0) + 24, N(v), { "font-size": 17, fill: colOf(v) }), T(s, X(0) - 8, Y(v) + 6, N(v), { "font-size": 17, fill: colOf(v), "text-anchor": "end" }));
    }
    const zero = T(s, X(0) - 10, Y(0) + 22, "0", { "font-size": 17, "text-anchor": "end" });
    const names = s.el("g");
    names.append(T(s, X(max) + 4, Y(0) - 14, "x", { "font-size": 22, fill: P.blue, "font-style": "italic" }), T(s, X(0) + 18, Y(max) - 6, "y", { "font-size": 22, fill: P.red, "font-style": "italic" }));
    svg.append(quads, grid, negAxes, posAxes, negNums, posNums, zero, names);
    return { svg, X, Y, u, ox, oy, min, max, quads, qrects, grid, posAxes, negAxes, nx, ny, posNums, negNums, names, W, H };
  }
  const quadOf = (x, y) => (x > 0 && y > 0 ? 0 : x < 0 && y > 0 ? 1 : x < 0 && y < 0 ? 2 : x > 0 && y < 0 ? 3 : -1);
  const QN = ["I", "II", "III", "IV"];

  Deck.unit({
    id: "u11", num: 11, title: "Negative Zahlen", color: U, soft: SOFT,
    subtitle: "Ausblick auf Klasse 6: unter null",
    blurb: "Minusgrade, Meeresspiegel, Keller und Konto: Zahlen unter null.",
    goals: ["Negative Zahlen im Alltag entdecken", "Die Zahlengerade nach links verlängern", "Ganze Zahlen ordnen und vergleichen", "Betrag und Gegenzahl kennen", "Temperaturänderungen als Wandern rechnen", "Punkte in allen vier Quadranten eintragen"],
    icon(svg, el) {
      svg.append(el("line", { x1: 4, x2: 66, y1: 38, y2: 38, stroke: "#1b2740", "stroke-width": 3 }));
      [[12, "#1d6fd0"], [35, "#1b2740"], [58, "#dc3b2a"]].forEach(([x, c]) => svg.append(el("line", { x1: x, x2: x, y1: 31, y2: 45, stroke: c, "stroke-width": 3 })));
      svg.append(el("text", { x: 14, y: 24, "text-anchor": "middle", "font-size": 20, "font-weight": 800, fill: "#1d6fd0", text: "−3" }),
        el("text", { x: 57, y: 24, "text-anchor": "middle", "font-size": 20, "font-weight": 800, fill: "#dc3b2a", text: "+3" }),
        el("text", { x: 35, y: 64, "text-anchor": "middle", "font-size": 18, "font-weight": 800, fill: "#4338ca", text: "0" }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Kälter als null Grad",
        say: "Im Winter wird es in Berlin oft kälter als null Grad. Dann brauchen wir Zahlen unter null: negative Zahlen.",
        build(s) {
          const th = thermo(s, { H: 600, W: 200, min: -30, max: 40, value: 20 });
          const read = s.h("p", { class: "huge mono", style: { color: P.warm, minWidth: "290px" } }, "20 °C");
          const setRead = v => { const r = Math.round(v); read.textContent = N(r) + " °C"; read.style.color = colOf(r); };
          const PRE = [[30, "Heißer Sommertag in Berlin"], [0, "Wasser gefriert"], [-5, "Frost im Winter"], [-18, "Gefrierschrank"], [-26, "Kälterekord Berlin (1929)"]];
          let busy = false;
          const go = async (v, i) => {
            if (busy) return; busy = true;
            btns.forEach((b, j) => { b.classList.toggle("solid", j === i); b.lastChild.style.color = j === i ? "#fff" : colOf(PRE[j][0]); });
            s.sfx.whoosh(); await th.go(v, 900, setRead); setRead(v); s.sfx.note(Math.round(v / 3), .2);
            busy = false;
          };
          const btns = PRE.map(([v, t], i) => s.h("button", { class: "btn", style: { justifyContent: "space-between", width: "100%", gap: "12px" }, onclick: () => { s.sfx.click(); go(v, i); } },
            s.h("span", null, t), s.h("b", { style: { color: colOf(v) } }, N(v) + " °C")));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Temperaturen ", s.h("b", null, "unter null"), " bekommen ein ", s.h("b", { style: { color: P.cold } }, "Minus"), ": −5 °C. Sprich: „minus fünf Grad“. Das sind ", s.h("b", null, "negative Zahlen"), ".");
          const photo = s.photo("thermometer-frost", { w: 150, h: 230, pos: "50% 40%", cls: "later" });
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "200px 1fr", gap: "30px", alignItems: "center" },
            s.h("div", { class: "a-up" }, th.svg),
            s.h("div", { class: "stack", style: { gap: "14px" } },
              s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "24px", justifyContent: "space-between" } }, s.h("div", { class: "stack", style: { gap: "6px" } }, read, s.h("p", { class: "small pencil" }, "Tippe auf ein Beispiel!")), photo),
              s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" } }, ...btns), merk)));
          s.sfx.pop();
          s.step(async () => { busy = false; await go(30, 0); s.say("An einem heißen Sommertag zeigt das Thermometer dreißig Grad."); });
          s.step(async () => { await go(0, 1); s.say("Bei null Grad gefriert Wasser zu Eis."); });
          s.step(async () => { s.show(photo, "zoom"); await go(-5, 2); s.say("Noch kälter: minus fünf Grad. Die Flüssigkeit sinkt unter die Null."); });
          s.step(async () => { await go(-18, 3); await go(-26, 4); s.sound("wind", { vol: .4, dur: 2.5 }); s.say("Im Gefrierschrank sind es minus achtzehn Grad. Am elften Februar neunzehnhundertneunundzwanzig wurden in Berlin sogar minus sechsundzwanzig Grad gemessen."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Über und unter dem Meeresspiegel",
        say: "Berge messen wir vom Meeresspiegel aus. Manche Orte liegen sogar tiefer als das Meer!",
        build(s) {
          const W = 1100, H = 300, svg = s.svg(W, H), SL = 150;
          svg.append(s.el("rect", { x: 0, y: 0, width: W, height: H, fill: "#eef6fd", rx: 14 }));
          // sea (left)
          svg.append(s.el("rect", { x: 0, y: SL, width: 128, height: H - SL, fill: "#7fb6ea" }));
          // land path: dike, polder, mountain, dead sea basin
          const land = s.el("path", { d: `M128,${H} L128,${SL} L138,${SL - 22} L152,${SL - 22} L166,${SL + 26} L330,${SL + 26} L350,${SL - 6} L420,${SL - 20} L520,22 L600,${SL - 30} L700,${SL - 8} L760,${SL - 4} L800,${SL + 104} L960,${SL + 104} L1010,${SL - 10} L1100,${SL - 16} L1100,${H} Z`, fill: "#c9a36b", stroke: "#8a6a3a", "stroke-width": 2 });
          const snow = s.el("path", { d: "M520,22 L488,62 L506,56 L520,66 L536,54 L552,62 Z", fill: "#fff" });
          const dsea = s.el("rect", { x: 806, y: SL + 92, width: 150, height: 12, fill: "#5aa0dd" });
          svg.append(land, snow, dsea);
          // polder houses + windmill
          const houses = s.el("g");
          [[190, "#dc3b2a"], [228, "#ee7a1a"]].forEach(([x, c]) => houses.append(s.el("rect", { x, y: SL + 8, width: 22, height: 18, fill: c }), s.el("polygon", { points: `${x - 3},${SL + 8} ${x + 11},${SL - 4} ${x + 25},${SL + 8}`, fill: "#7c2d12" })));
          houses.append(s.el("rect", { x: 284, y: SL - 12, width: 10, height: 38, fill: "#5d6678" }));
          const blades = s.el("g", { transform: `translate(289,${SL - 14})` });
          [0, 90, 180, 270].forEach(a => blades.append(s.el("rect", { x: -3, y: -26, width: 6, height: 26, fill: "#fff", stroke: P.ink, "stroke-width": 1.2, transform: `rotate(${a})` })));
          houses.append(blades); svg.append(houses);
          const seaLine = later(s.el("line", { x1: 0, x2: W, y1: SL, y2: SL, stroke: P.blue, "stroke-width": 3, "stroke-dasharray": "10 8" }));
          const seaLab = later(fb(T(s, 64, SL - 40, "0 m", { "font-size": 26, fill: P.blue })));
          const seaLab2 = later(fb(T(s, 64, SL - 14, "Meer", { "font-size": 19, fill: P.blue })));
          const lEv = later(fb(T(s, 560, 36, "+8.849 m", { "font-size": 26, fill: P.warm, "text-anchor": "start" })));
          const lNl = later(fb(T(s, 248, SL + 70, "−6,76 m", { "font-size": 26, fill: "#fff" })));
          const lDs = later(fb(T(s, 880, SL + 70, "−440 m", { "font-size": 26, fill: P.cold })));
          const note = T(s, W - 14, 30, "nicht maßstabsgetreu", { "font-size": 19, fill: P.pencil, "font-weight": 600, "text-anchor": "end" });
          svg.append(seaLine, seaLab, seaLab2, lEv, lNl, lDs, note);
          const card = (id, lab, txt, pos) => ex(s, lab, { class: "ex later", style: { padding: "12px 14px" } },
            s.h("div", { style: { display: "flex", gap: "12px", alignItems: "center" } }, s.photo(id, { w: 130, h: 200, pos: pos || "50% 50%" }), s.h("p", { class: "small", style: { minWidth: 0 } }, ...txt)));
          const c1 = card("everest", "Mount Everest", ["Der höchste Berg der Erde: ", s.h("b", { style: { color: P.warm } }, "8.849 m"), " über dem Meeresspiegel."], "45% 50%");
          const c2 = card("nap-monument", "Niederlande", ["Der tiefste Punkt liegt ", s.h("b", { style: { color: P.cold } }, "6,76 m unter"), " dem Meeresspiegel. Deiche halten das Wasser fern."]);
          const c3 = card("totes-meer", "Totes Meer", ["Sein Ufer ist die tiefste Stelle an Land: etwa ", s.h("b", { style: { color: P.cold } }, "440 m unter"), " dem Meeresspiegel (2025)."], "30% 50%");
          s.add(root(s, "stack", { gap: "14px" }, s.h("div", { class: "a-fade" }, svg), s.h("div", { class: "cols3", style: { gap: "14px", gridTemplateColumns: "repeat(3, minmax(0, 1fr))" } }, c1, c2, c3)));
          s.loop(t => { blades.setAttribute("transform", `translate(289,${SL - 14}) rotate(${t * 60})`); });
          s.sfx.pop();
          s.step(async () => { s.sound("waves", { vol: .4, dur: 2.5 }); await s.show(seaLine, "draw"); s.show(seaLab, "pop"); await s.show(seaLab2, "pop"); s.say("Die gestrichelte Linie ist der Meeresspiegel. Er ist die Null."); });
          s.step(async () => { s.sfx.chord([0, 4, 7, 12]); s.show(lEv, "up"); await s.show(c1, "up"); s.say("Der Mount Everest ist achttausendachthundertneunundvierzig Meter hoch: plus achttausendachthundertneunundvierzig."); });
          s.step(async () => { s.sfx.boing(); s.show(lNl, "down"); await s.show(c2, "up"); s.say("Ein Teil der Niederlande liegt unter dem Meeresspiegel: minus sechs Komma sieben sechs Meter."); });
          s.step(async () => { s.sfx.whoosh(); s.show(lDs, "down"); await s.show(c3, "up"); s.say("Das Ufer des Toten Meeres liegt etwa vierhundertvierzig Meter unter dem Meeresspiegel."); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Stockwerke unter der Erde",
        say: "Im Aufzug siehst du oft negative Zahlen: minus eins ist der Keller, minus zwei liegt noch tiefer.",
        build(s) {
          const W = 560, H = 540, svg = s.svg(W, H), FH = 82, G = 340; // ground line y
          const FL = [3, 2, 1, 0, -1, -2];
          const fy = f => G - (f + 1) * FH; // top of floor f
          svg.append(s.el("rect", { x: 0, y: 0, width: W, height: G, fill: "#eef6fd" }), s.el("rect", { x: 0, y: G, width: W, height: H - G, fill: "#d9c3a0" }));
          // building
          svg.append(s.el("rect", { x: 90, y: fy(3), width: 400, height: G + 2 * FH - fy(3), fill: "#fff", stroke: P.ink, "stroke-width": 3 }));
          FL.forEach(f => {
            svg.append(s.el("line", { x1: 90, x2: 490, y1: fy(f) + FH, y2: fy(f) + FH, stroke: P.ink, "stroke-width": f === 0 ? 0 : 2 }));
            svg.append(T(s, 46, fy(f) + FH / 2 + 9, N(f), { "font-size": 28, fill: colOf(f) }));
          });
          svg.append(s.el("line", { x1: 0, x2: W, y1: G, y2: G, stroke: "#5b4426", "stroke-width": 5 }));
          // windows upstairs
          [3, 2, 1].forEach(f => [120, 190, 260].forEach(x => svg.append(s.el("rect", { x, y: fy(f) + 22, width: 44, height: 38, fill: "#bfdcf5", stroke: P.ink, "stroke-width": 1.5 }))));
          svg.append(s.el("rect", { x: 160, y: fy(0) + 26, width: 46, height: 56, fill: "#8a6a3a" }), T(s, 270, fy(0) + 54, "Eingang", { "font-size": 19, fill: P.pencil }));
          // tiefgarage car
          const car = s.el("g", { transform: `translate(120,${fy(-1) + 34})` });
          car.append(s.el("rect", { x: 0, y: 12, width: 110, height: 26, rx: 8, fill: P.orange }), s.el("rect", { x: 22, y: 0, width: 62, height: 20, rx: 6, fill: "#fbbf77" }), s.el("circle", { cx: 24, cy: 40, r: 8, fill: P.ink }), s.el("circle", { cx: 86, cy: 40, r: 8, fill: P.ink }));
          svg.append(car, T(s, 300, fy(-1) + 50, "Tiefgarage", { "font-size": 19, fill: P.pencil }));
          // u-bahn train
          const train = s.el("g", { transform: `translate(-260,${fy(-2) + 22})` });
          train.append(s.el("rect", { x: 0, y: 0, width: 240, height: 46, rx: 10, fill: "#f7d117", stroke: P.ink, "stroke-width": 2 }));
          [16, 66, 116, 166].forEach(x => train.append(s.el("rect", { x, y: 8, width: 36, height: 18, rx: 3, fill: "#2b3a55" })));
          svg.append(s.el("line", { x1: 90, x2: 490, y1: fy(-2) + 72, y2: fy(-2) + 72, stroke: P.ink, "stroke-width": 3 }), train);
          const ub = later(fb(s.el("g"))); ub.append(s.el("rect", { x: 380, y: fy(-2) + 6, width: 30, height: 30, rx: 4, fill: P.blue }), T(s, 395, fy(-2) + 29, "U", { "font-size": 22, fill: "#fff" }));
          svg.append(ub);
          // elevator
          svg.append(s.el("rect", { x: 420, y: fy(3), width: 70, height: G + 2 * FH - fy(3), fill: "#eef1f5", stroke: P.pencil, "stroke-width": 2 }));
          const cab = s.el("g"); cab.append(s.el("rect", { x: 426, y: 0, width: 58, height: FH - 10, rx: 6, fill: U }), s.el("circle", { cx: 455, cy: 22, r: 9, fill: "#fff" }), s.el("rect", { x: 445, y: 34, width: 20, height: 30, rx: 6, fill: "#fff" }));
          svg.append(cab);
          let floor = 0;
          const putCab = yy => cab.setAttribute("transform", `translate(0,${yy})`);
          putCab(fy(0) + 5);
          const disp = s.h("div", { style: { font: "800 72px/1 var(--f-display)", color: P.ink, background: "#1b2740", borderRadius: "14px", padding: "14px 24px", textAlign: "center", minWidth: "170px" } }, s.h("span", { style: { color: "#7cf0a0" } }, "0"));
          const lab = s.h("p", { class: "t", style: { minHeight: "34px", fontWeight: 700 } }, "Erdgeschoss");
          const NAMES = { 3: "3. Stock", 2: "2. Stock", 1: "1. Stock", 0: "Erdgeschoss", "-1": "Untergeschoss: Tiefgarage", "-2": "2. Untergeschoss: U-Bahn" };
          let busy = false;
          async function ride(to) {
            if (busy || to === floor) return; busy = true;
            const from = floor; s.sfx.whoosh();
            await s.tween({ from: fy(from) + 5, to: fy(to) + 5, dur: 350 * Math.abs(to - from), ease: "inOut", update: v => { putCab(v); const f = Math.round(-(v - 5 - G) / FH - 1); disp.firstChild.textContent = N(f); } });
            floor = to; disp.firstChild.textContent = N(to); lab.textContent = NAMES[to]; lab.style.color = colOf(to); s.sfx.ding();
            busy = false;
          }
          const keys = FL.map(f => s.h("button", { class: "btn", style: { minWidth: "84px", fontSize: "26px", color: colOf(f), borderColor: colOf(f) }, onclick: () => { s.sfx.click(); ride(f); } }, N(f)));
          const panel = s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 84px)", gap: "10px" } }, ...keys);
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Das Erdgeschoss ist die ", s.h("b", null, "0"), ". Nach oben zählen wir ", s.h("b", { style: { color: P.warm } }, "1, 2, 3"), ", nach unten ", s.h("b", { style: { color: P.cold } }, "−1, −2"), ".");
          const lf = life(s, { class: "life later", style: { padding: "10px 16px" } }, s.h("p", { class: "small" }, "Kaufhaus, Tiefgarage, U-Bahnhof: Viele Berliner U-Bahnhöfe liegen unter der Straße. Im Aufzug drückst du dann auf −1 oder −2."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "560px 1fr", gap: "26px", alignItems: "center" }, s.h("div", { class: "a-fade" }, svg),
            s.h("div", { class: "stack", style: { gap: "14px" } }, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "20px" } }, disp, panel), lab, merk, lf)));
          s.sfx.pop();
          s.step(async () => { await ride(3); s.say("Mit dem Aufzug hoch in den dritten Stock."); });
          s.step(async () => { await ride(-1); s.say("Jetzt nach unten: am Erdgeschoss vorbei bis minus eins, in die Tiefgarage."); });
          s.step(async () => {
            await ride(-2); s.show(ub, "pop"); s.sound("ubahn-train", { vol: .5, dur: 3 });
            await s.tween({ from: -260, to: 130, dur: 2000, ease: "out", update: v => train.setAttribute("transform", `translate(${v},${fy(-2) + 22})`) });
            s.say("Minus zwei: Hier fährt die U-Bahn.");
          });
          s.step(async () => { s.sfx.pop(); await s.show(merk, "up"); });
          s.step(async () => { s.sound("ubahn-announce", { vol: .4, dur: 3 }); await s.show(lf, "up"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Im Minus: Konto und Tore",
        say: "Auch Geld und Fußball kennen negative Zahlen: Schulden auf dem Konto und eine Tordifferenz unter null.",
        build(s) {
          const W = 460, H = 380, svg = s.svg(W, H), Z = 230, K = 4.4; // zero line y, px per euro
          for (let v = -40; v <= 40; v += 10) {
            svg.append(s.el("line", { x1: 70, x2: W - 10, y1: Z - v * K, y2: Z - v * K, stroke: v === 0 ? P.ink : "#e1e8ef", "stroke-width": v === 0 ? 3 : 2 }));
            if (Z - v * K > 12 && Z - v * K < H - 6) svg.append(T(s, 62, Z - v * K + 7, N(v) + " €", { "font-size": 19, fill: colOf(v), "text-anchor": "end" }));
          }
          const bar = s.el("rect", { x: 170, y: Z, width: 150, height: 0, rx: 6, fill: P.green });
          const val = T(s, 245, Z - 12, "", { "font-size": 28 });
          svg.append(bar, val);
          let cur = 0;
          const setB = v => { cur = v; const h = Math.abs(v) * K; bar.setAttribute("y", v >= 0 ? Z - h : Z); bar.setAttribute("height", h); bar.setAttribute("fill", v >= 0 ? P.green : P.red); val.textContent = v ? N(Math.round(v)) + " €" : ""; val.setAttribute("y", v >= 0 ? Z - h - 12 : Z + h + 30); val.setAttribute("fill", v >= 0 ? P.green : P.red); };
          const goB = to => s.tween({ from: cur, to, dur: 1000, ease: "inOut", update: setB });
          const l1 = s.h("p", { class: "t later" }, "Auf dem Konto: ", s.h("b", { class: "green" }, "20 €"), " Guthaben.");
          const l2 = s.h("p", { class: "t later" }, "Ein Spiel kostet 35 € – du zahlst mit der Karte.");
          const l3 = s.h("p", { class: "t later" }, "Jetzt: ", s.h("b", { class: "red" }, "−15 €"), ". Du hast 15 € Schulden.");
          const konto = ex(s, "Beispiel 1: das Konto", { class: "ex a-left", style: { padding: "12px 16px" } }, svg, s.h("div", { class: "stack", style: { gap: "4px" } }, l1, l2, l3));
          const TEAMS = [["FC Spree", "14 : 6", 8], ["SV Havel", "9 : 9", 0], ["TSV Wannsee", "5 : 12", -7]];
          const tdS = { padding: "10px 12px", borderBottom: "2px solid var(--line)", fontSize: "22px" };
          const rows = TEAMS.map(([n, t, d]) => s.h("tr", { class: "later" }, s.h("td", { style: tdS }, n), s.h("td", { style: Object.assign({ textAlign: "center" }, tdS) }, t), s.h("td", { style: Object.assign({ textAlign: "center", fontWeight: 800, color: colOf(d) }, tdS) }, Ns(d))));
          const th = t => s.h("th", { style: { font: "700 19px/1 var(--f-body)", color: P.pencil, padding: "8px 12px", textAlign: "left", borderBottom: "3px solid var(--ink)" } }, t);
          const table = s.h("table", { style: { borderCollapse: "collapse", width: "100%", background: "#fff" } }, s.h("tr", null, th("Mannschaft"), th("Tore"), th("Differenz")), ...rows);
          const tore = ex(s, "Beispiel 2: die Fußball-Tabelle", { class: "ex later", style: { padding: "12px 16px" } }, table, s.h("p", { class: "small", style: { marginTop: "8px" } }, "5 Tore geschossen, 12 kassiert: 7 Tore zu wenig, also ", s.h("b", { class: "blue" }, "−7"), "."));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, s.h("b", { style: { color: P.warm } }, "Positiv"), " (+): über null, Guthaben. ", s.h("b", { style: { color: P.cold } }, "Negativ"), " (−): unter null, Schulden. Die ", s.h("b", null, "0"), " ist weder positiv noch negativ.");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "500px 1fr", gap: "22px", alignItems: "center" }, konto, s.h("div", { class: "stack", style: { gap: "16px" } }, tore, merk)));
          s.sfx.pop();
          s.step(async () => { s.sound("coins", { vol: .5 }); s.show(l1, "up"); await goB(20); s.say("Du hast zwanzig Euro auf dem Konto."); });
          s.step(async () => { s.sound("cash-register", { vol: .5 }); s.show(l2, "up"); await goB(-15); s.sfx.boing(); await s.show(l3, "up"); s.say("Nach dem Kauf: minus fünfzehn Euro. Der Balken rutscht unter die Null."); });
          s.step(async () => { s.sound("ball-kick", { vol: .6 }); await s.show(tore, "right"); for (const r of rows) { s.sfx.pop(); await s.show(r, "left"); } s.say("Fünf Tore geschossen, zwölf kassiert: Die Tordifferenz ist minus sieben."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Die Zahlengerade",
        say: "Der Zahlenstrahl hört bei null auf. Spiegeln wir ihn nach links, entsteht die Zahlengerade mit den negativen Zahlen.",
        build(s) {
          const L = numLine(s, { W: 1080, H: 150, min: -10, max: 10, y: 70, fs: 22 });
          L.axis.style.opacity = 0; [...L.ticks.children].forEach((t, i) => { if (i < 10) t.style.opacity = 0; }); [...L.nums.children].forEach((t, i) => { if (i < 10) t.style.opacity = 0; });
          const leftPart = [...L.axis.children];
          const strahl = s.el("g"); strahl.append(s.el("line", { x1: L.X(0), x2: L.X(10) + 22, y1: 70, y2: 70, stroke: P.ink, "stroke-width": 3 }), s.el("polygon", { points: `${L.X(10) + 30},70 ${L.X(10) + 16},62 ${L.X(10) + 16},78`, fill: P.ink }));
          L.svg.insertBefore(strahl, L.svg.firstChild);
          const mirror = later(s.el("line", { x1: L.X(0), x2: L.X(0), y1: 6, y2: 86, stroke: U, "stroke-width": 3, "stroke-dasharray": "6 6" }));
          L.svg.append(mirror);
          const bNeg = s.h("div", { class: "card later", style: { borderTop: `6px solid ${P.cold}` } }, s.h("p", { class: "h2", style: { color: P.cold } }, "negative Zahlen"), s.h("p", { class: "t" }, "−1, −2, −3 … liegen ", s.h("b", null, "links"), " von der 0."));
          const bZero = s.h("div", { class: "card later", style: { borderTop: `6px solid ${P.ink}` } }, s.h("p", { class: "h2" }, "die Null"), s.h("p", { class: "t" }, "ist weder positiv noch negativ. Sie ist die Mitte."));
          const bPos = s.h("div", { class: "card later", style: { borderTop: `6px solid ${P.warm}` } }, s.h("p", { class: "h2", style: { color: P.warm } }, "positive Zahlen"), s.h("p", { class: "t" }, "+1, +2, +3 … liegen ", s.h("b", null, "rechts"), " von der 0. Das + darf man weglassen."));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Alle zusammen heißen ", s.h("b", null, "ganze Zahlen"), ": … −3, −2, −1, 0, 1, 2, 3 … Die Zahlengerade geht nach links und nach rechts ", s.h("b", null, "unendlich"), " weiter.");
          s.add(root(s, "stack", { justifyContent: "center", gap: "22px" }, s.h("div", { class: "a-fade" }, L.svg), s.h("div", { class: "cols3", style: { gap: "18px" } }, bNeg, bZero, bPos), merk));
          s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); await s.show(mirror, "draw"); s.say("Wir stellen einen Spiegel an die Null."); });
          s.step(async () => {
            strahl.style.opacity = 0; L.axis.style.opacity = 1; s.sfx.swoosh();
            const negT = [...L.ticks.children].slice(0, 10), negN = [...L.nums.children].slice(0, 10);
            for (let k = 0; k < 10; k++) {
              const v = -(k + 1), i = 10 + v + 0; // index in arrays: value v -> index v+10
              const tk = negT[v + 10], nm = negN[v + 10];
              tk.style.opacity = 1; nm.style.opacity = 1;
              const tx = L.X(-v) - L.X(v);
              await s.tween({ from: tx, to: 0, dur: 160, ease: "out", update: d => { tk.setAttribute("transform", `translate(${d},0)`); nm.setAttribute("transform", `translate(${d},0)`); } });
              s.sfx.note(-k, .08);
              void i;
            }
            leftPart.forEach(e => e.style.opacity = 1);
            s.say("Jede Zahl bekommt ein Spiegelbild links von der Null: minus eins, minus zwei, minus drei.");
          });
          s.step(async () => { s.sfx.pop(); s.show(bNeg, "left"); s.show(bZero, "up", 150); await s.show(bPos, "right", 300); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.say("Das sind die ganzen Zahlen."); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Zahlen auf der Zahlengeraden",
        say: "Jede ganze Zahl hat ihren Platz auf der Zahlengeraden. Zieh den Punkt und lies die Zahl ab.",
        build(s) {
          const L = numLine(s, { W: 1080, H: 210, min: -10, max: 10, y: 130, fs: 21 });
          const pins = [["A", -7], ["B", -2.5], ["C", 4], ["D", -9]].map(([n, v]) => {
            const g = later(fb(s.el("g")));
            g.append(s.el("line", { x1: L.X(v), x2: L.X(v), y1: 64, y2: 122, stroke: U, "stroke-width": 3 }), s.el("circle", { cx: L.X(v), cy: 130, r: 8, fill: U }), T(s, L.X(v), 52, `${n} = ${N(v, v % 1 ? 1 : 0)}`, { "font-size": 21, fill: U }));
            L.svg.append(g); return g;
          });
          let pv = 3;
          const knob = s.el("g", { style: { cursor: "grab" } });
          const kc = s.el("circle", { cx: 0, cy: 0, r: 17, fill: P.orange, stroke: "#fff", "stroke-width": 4 });
          knob.append(s.el("circle", { cx: 0, cy: 0, r: 34, fill: "transparent" }), kc);
          const kLab = T(s, 0, -26, "", { "font-size": 24, fill: P.orange });
          const kg = later(s.el("g")); kg.append(kLab, knob); L.svg.append(kg);
          const read = s.h("p", { class: "huge mono", style: { textAlign: "center", color: P.warm } }, "3");
          const where = s.h("p", { class: "t", style: { textAlign: "center", minHeight: "34px" } }, "");
          const place = v => {
            pv = v; kc.setAttribute("cx", L.X(v)); knob.firstChild.setAttribute("cx", L.X(v)); kc.setAttribute("cy", L.y); knob.firstChild.setAttribute("cy", L.y);
            kLab.setAttribute("x", L.X(v)); kLab.setAttribute("y", L.y - 26); kLab.textContent = "";
            read.textContent = N(v, v % 1 ? 1 : 0); read.style.color = colOf(v);
            where.textContent = v === 0 ? "genau in der Mitte" : `${N(Math.abs(v), v % 1 ? 1 : 0)} Schritte ${v < 0 ? "links" : "rechts"} von der 0`;
          };
          place(3);
          s.drag(knob, { space: L.svg, onMove: p => { const v = clamp(Math.round(((p.x - 34) / (1080 - 68)) * 20 * 2) / 2 - 10, -10, 10); if (v !== pv) { place(v); s.sfx.tick(); } } });
          const tip = s.h("p", { class: "small pencil later", style: { textAlign: "center" } }, "Zieh den orangen Punkt hin und her!");
          const lf = life(s, { class: "life later", style: { padding: "10px 16px" } }, s.h("p", { class: "small" }, "Ein Thermometer ist eine ", s.h("b", null, "senkrechte Zahlengerade"), ". Auch −2,5 °C hat einen Platz: genau zwischen −2 und −3."));
          s.add(root(s, "stack", { justifyContent: "center", gap: "18px" }, s.h("div", { class: "a-fade" }, L.svg),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "center" } }, s.h("div", { class: "stack", style: { gap: "6px" } }, read, where, tip), lf)));
          s.sfx.pop();
          s.step(async () => { for (const p of pins) { s.sfx.drum(); await s.show(p, "down"); await s.wait(150); } s.say("A ist minus sieben, B minus zwei Komma fünf, C plus vier und D minus neun."); });
          s.step(async () => { s.sfx.pop(); await s.show(kg, "pop"); await s.show(tip, "fade"); for (const v of [1, -1, -3, -5]) { await s.tween({ from: pv, to: v, dur: 450, update: x => place(Math.round(x * 2) / 2) }); s.sfx.tick(); } s.say("Je weiter links, desto weiter ist die Zahl von der Null weg ins Minus."); });
          s.step(async () => { s.sound("wind", { vol: .3, dur: 2 }); await s.show(lf, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Größer oder kleiner?",
        say: "Auf der Zahlengeraden gilt: Je weiter rechts eine Zahl liegt, desto größer ist sie.",
        build(s) {
          const L = numLine(s, { W: 1080, H: 150, min: -20, max: 5, y: 80, every: 5, fs: 21 });
          const mA = s.el("g"), mB = s.el("g");
          const mk = (g, c) => { const ci = s.el("circle", { cx: 0, cy: L.y, r: 12, fill: c, stroke: "#fff", "stroke-width": 3 }); const t = T(s, 0, L.y - 22, "", { "font-size": 22, fill: c }); g.append(ci, t); g.ci = ci; g.t = t; g.style.opacity = 0; L.svg.append(g); };
          mk(mA, P.violet); mk(mB, P.orange);
          const put = (g, v) => { g.ci.setAttribute("cx", L.X(v)); g.t.setAttribute("x", L.X(v)); g.t.textContent = N(v); g.style.opacity = 1; };
          const PAIRS = [[-8, -3, "−8 °C ist kälter als −3 °C."], [-1, 1, "Jede negative Zahl ist kleiner als jede positive."], [0, -5, "Die 0 ist größer als jede negative Zahl."], [-20, -12, "−20 sieht groß aus – liegt aber weiter links!"]];
          const rows = PAIRS.map(([a, b, why]) => {
            const sign = s.h("b", { class: "later", style: { color: P.red, display: "inline-block", width: "40px", textAlign: "center" } }, a < b ? "<" : ">");
            const r = s.h("div", { class: "card later", style: { display: "flex", alignItems: "center", gap: "14px", padding: "10px 16px" } },
              s.h("span", { style: { font: "800 34px/1 var(--f-display)", whiteSpace: "nowrap" } }, s.h("span", { style: { color: P.violet } }, N(a)), " ", sign, " ", s.h("span", { style: { color: P.orange } }, N(b))),
              s.h("span", { class: "small" }, why));
            r.sign = sign; r.a = a; r.b = b; return r;
          });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Weiter ", s.h("b", null, "rechts"), " = ", s.h("b", null, "größer"), ". Weiter ", s.h("b", null, "links"), " = ", s.h("b", null, "kleiner"), ". Lies „<“ als „ist kleiner als“.");
          const lf7 = life(s, { class: "life later", style: { padding: "10px 16px" } }, s.h("p", { class: "small" }, "Bei −8\u00a0°C brauchst du die dickere Jacke als bei −3\u00a0°C. Und eine Tordifferenz von −2 ist besser als −5."));
          s.add(root(s, "stack", { gap: "16px", justifyContent: "center" }, s.h("div", { class: "a-fade" }, L.svg), s.h("div", { class: "cols", style: { gap: "12px 18px" } }, ...rows), s.h("div", { class: "cols", style: { gap: "18px", alignItems: "center" } }, merk, lf7)));
          s.sfx.pop();
          const run = async i => { const r = rows[i]; s.sfx.pop(); await s.show(r, "up"); put(mA, r.a); put(mB, r.b); s.sfx.note(r.a, .15); await s.wait(250); s.sfx.note(r.b, .15); await s.wait(250); s.sfx.snap(); await s.show(r.sign, "zoom"); };
          s.step(async () => { await run(0); s.say("Minus acht liegt links von minus drei. Also ist minus acht kleiner."); });
          s.step(async () => { await run(1); s.say("Minus eins ist kleiner als plus eins."); });
          s.step(async () => { await run(2); s.say("Null ist größer als minus fünf."); });
          s.step(async () => { await run(3); s.say("Vorsicht: Minus zwanzig ist kleiner als minus zwölf. Es ist viel kälter!"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.sound("wind", { vol: .3, dur: 1.5 }); await s.show(lf7, "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Ordnen: ein kalter Morgen",
        say: "An einem Januarmorgen ist es in Europa sehr unterschiedlich kalt. Wir ordnen die Temperaturen.",
        build(s) {
          const CITY = [["Berlin", -4], ["Rom", 6], ["Moskau", -15], ["Paris", 2], ["Oslo", -9], ["Madrid", 0]];
          const W = 1080, H = 300, svg = s.svg(W, H);
          const L = { X: v => 60 + ((v + 20) / 30) * (W - 120), y: 250 };
          svg.append(s.el("line", { x1: 30, x2: W - 30, y1: L.y, y2: L.y, stroke: P.ink, "stroke-width": 3 }));
          for (let v = -20; v <= 10; v++) {
            svg.append(s.el("line", { x1: L.X(v), x2: L.X(v), y1: L.y - (v % 5 ? 6 : 11), y2: L.y + (v % 5 ? 6 : 11), stroke: v ? P.pencil : P.ink, "stroke-width": v ? 2 : 4 }));
            if (!(v % 5)) svg.append(T(s, L.X(v), L.y + 38, N(v) + " °C", { "font-size": 19, fill: colOf(v) }));
          }
          const cards = CITY.map(([n, v], i) => {
            const g = later(s.el("g"));
            const w = 132;
            g.append(s.el("rect", { x: -w / 2, y: -30, width: w, height: 60, rx: 12, fill: "#fff", stroke: colOf(v), "stroke-width": 3 }), T(s, 0, -5, n, { "font-size": 19 }), T(s, 0, 22, N(v) + " °C", { "font-size": 20, fill: colOf(v) }));
            const pin = s.el("line", { x1: 0, x2: 0, y1: 30, y2: 30, stroke: colOf(v), "stroke-width": 3, "stroke-dasharray": "5 4" });
            g.insertBefore(pin, g.firstChild);
            g.pos = { x: 100 + i * 176, y: 46 }; g.v = v; g.pin = pin;
            g.setAttribute("transform", `translate(${g.pos.x},${g.pos.y})`);
            svg.append(g); return g;
          });
          // target: sorted order; alternate heights to avoid overlap
          const sorted = cards.slice().sort((a, b) => a.v - b.v);
          sorted.forEach((g, k) => { g.tgt = { x: L.X(g.v), y: k % 2 ? 140 : 54 }; });
          const chain = s.h("p", { class: "h2 mono later", style: { textAlign: "center" } }, ...sorted.flatMap((g, k) => [s.h("span", { style: { color: colOf(g.v) } }, N(g.v)), k < sorted.length - 1 ? " < " : ""]));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Zum Ordnen trägst du alle Zahlen auf der Zahlengeraden ein und liest sie ", s.h("b", null, "von links nach rechts"), " ab. Am kältesten: Moskau. Am wärmsten: Rom.");
          s.add(root(s, "stack", { gap: "14px", justifyContent: "center" }, s.h("p", { class: "small pencil" }, "Beispielwerte an einem Morgen im Januar"), svg, chain, merk));
          s.sfx.pop();
          s.step(async () => { for (const c of cards) { s.sfx.pop(); s.show(c, "pop"); await s.wait(140); } s.say("Sechs Städte, sechs Temperaturen. Welche ist am kältesten?"); });
          s.step(async () => {
            s.sfx.whoosh();
            await Promise.all(sorted.map((g, k) => s.tween({ from: 0, to: 1, dur: 900, delay: k * 140, ease: "inOut", update: t => {
              const x = g.pos.x + (g.tgt.x - g.pos.x) * t, y = g.pos.y + (g.tgt.y - g.pos.y) * t;
              g.setAttribute("transform", `translate(${x},${y})`); g.pin.setAttribute("y2", 30 + (L.y - y - 30) * t);
            } })));
            s.sfx.snap(); s.say("Jede Karte rutscht an ihren Platz auf der Zahlengeraden.");
          });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(chain, "up"); s.say("Von kalt nach warm: minus fünfzehn, minus neun, minus vier, null, zwei, sechs."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Der Betrag: Abstand zur Null",
        say: "Der Betrag einer Zahl ist ihr Abstand zur Null. Er ist nie negativ.",
        build(s) {
          const L = numLine(s, { W: 1080, H: 190, min: -10, max: 10, y: 120, fs: 21 });
          const arL = s.el("g"), arR = s.el("g");
          const mkArrow = (g, c) => { const ln = s.el("line", { x1: L.X(0), x2: L.X(0), y1: 70, y2: 70, stroke: c, "stroke-width": 5, "stroke-linecap": "round" }); const head = s.el("polygon", { points: "", fill: c }); const t = T(s, L.X(0), 52, "", { "font-size": 22, fill: c }); g.append(ln, head, t); g.ln = ln; g.head = head; g.t = t; L.svg.append(g); };
          mkArrow(arL, P.cold); mkArrow(arR, P.warm);
          const setArrow = (g, v) => {
            const x = L.X(v), dir = v < 0 ? -1 : 1;
            g.ln.setAttribute("x2", x - dir * 10); g.head.setAttribute("points", v ? `${x},70 ${x - dir * 14},62 ${x - dir * 14},78` : "");
            g.t.setAttribute("x", (L.X(0) + x) / 2); g.t.textContent = v ? `${N(Math.abs(v))} Schritte` : "";
          };
          let a = 4;
          const out = s.h("p", { class: "h2 mono", style: { textAlign: "center" } });
          const upd = () => {
            setArrow(arL, -a); setArrow(arR, a);
            out.innerHTML = ""; out.append("|", s.h("span", { style: { color: P.cold } }, N(-a)), "| = " + a + "   und   |", s.h("span", { style: { color: P.warm } }, N(a)), "| = " + a);
          };
          setArrow(arL, 0); setArrow(arR, 0);
          const sl = s.slider({ label: "Abstand", min: 0, max: 10, value: 4, onInput: v => { a = v; upd(); } });
          const play = s.h("div", { class: "later", style: { display: "grid", gridTemplateColumns: "330px 1fr", gap: "24px", alignItems: "center" } }, sl, out);
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Der ", s.h("b", null, "Betrag"), " sagt nur, ", s.h("b", null, "wie weit"), " eine Zahl von der 0 weg ist – nicht, in welche Richtung. Man schreibt ihn mit Strichen: |−4| = 4.");
          const lf = life(s, { class: "life later", style: { padding: "10px 16px" } }, s.h("p", { class: "small" }, "Das Tote Meer liegt bei −440 m. Sein Ufer ist |−440| = ", s.h("b", { style: { whiteSpace: "nowrap" } }, "440 m"), " vom Meeresspiegel entfernt – nur eben nach unten."));
          s.add(root(s, "stack", { gap: "16px", justifyContent: "center" }, s.h("div", { class: "a-fade" }, L.svg), play, s.h("div", { class: "cols", style: { gap: "18px", alignItems: "center" } }, merk, lf)));
          s.sfx.pop();
          s.step(async () => {
            s.sfx.whoosh();
            await s.tween({ from: 0, to: 4, dur: 900, update: v => { setArrow(arL, -v); setArrow(arR, v); } });
            setArrow(arL, -4); setArrow(arR, 4); s.sfx.ding(); s.say("Minus vier und plus vier sind beide vier Schritte von der Null entfernt.");
          });
          s.step(async () => { upd(); s.sfx.pop(); await s.show(play, "up"); s.say("Der Betrag von minus vier ist vier. Der Betrag von vier ist auch vier."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sound("waves", { vol: .35, dur: 2 }); await s.show(lf, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Die Gegenzahl: an der 0 spiegeln",
        say: "Spiegelst du eine Zahl an der Null, bekommst du ihre Gegenzahl. Aus drei wird minus drei.",
        build(s) {
          const L = numLine(s, { W: 1080, H: 230, min: -10, max: 10, y: 170, fs: 21 });
          L.svg.append(s.el("line", { x1: L.X(0), x2: L.X(0), y1: 16, y2: 196, stroke: U, "stroke-width": 3, "stroke-dasharray": "6 6" }), T(s, L.X(0), 14 + 0, "", {}));
          const src = s.el("circle", { cx: L.X(3), cy: L.y, r: 13, fill: P.warm, stroke: "#fff", "stroke-width": 3 });
          const dst = s.el("circle", { cx: L.X(3), cy: L.y, r: 13, fill: P.cold, stroke: "#fff", "stroke-width": 3 });
          const arc = s.el("path", { d: "", fill: "none", stroke: U, "stroke-width": 3, "stroke-dasharray": "8 6" });
          const ts = T(s, L.X(3), L.y - 24, "3", { "font-size": 24, fill: P.warm }), td = T(s, L.X(-3), L.y - 24, "", { "font-size": 24, fill: P.cold });
          L.svg.append(arc, src, dst, ts, td);
          let a = 3, busy = false;
          const pr = s.h("p", { class: "h2 mono", style: { textAlign: "center", minHeight: "38px" } });
          async function jump(v, anim = true) {
            if (busy) return; busy = true; a = v;
            const x0 = L.X(v), x1 = L.X(-v), top = L.y - 40 - Math.abs(x1 - x0) / 5;
            src.setAttribute("cx", x0); ts.setAttribute("x", x0); ts.textContent = N(v); ts.setAttribute("fill", colOf(v)); src.setAttribute("fill", colOf(v) === P.ink ? U : colOf(v));
            td.textContent = ""; arc.setAttribute("d", `M${x0},${L.y} Q${(x0 + x1) / 2},${top} ${x1},${L.y}`);
            if (anim) { s.sfx.boing(); await s.tween({ from: 0, to: 1, dur: 800, ease: "inOut", update: t => { const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * (x0 + x1) / 2 + t * t * x1, y = (1 - t) * (1 - t) * L.y + 2 * (1 - t) * t * top + t * t * L.y; dst.setAttribute("cx", x); dst.setAttribute("cy", y); } }); }
            dst.setAttribute("cx", x1); dst.setAttribute("cy", L.y); dst.setAttribute("fill", colOf(-v) === P.ink ? U : colOf(-v));
            td.setAttribute("x", x1); td.textContent = v ? N(-v) : ""; td.setAttribute("fill", colOf(-v));
            pr.innerHTML = ""; pr.append("Gegenzahl von ", s.h("span", { style: { color: colOf(v) } }, N(v)), " ist ", s.h("span", { style: { color: colOf(-v) } }, N(-v === 0 ? 0 : -v)));
            busy = false;
          }
          jump(3, false);
          const sl = s.slider({ label: "Zahl", min: -10, max: 10, value: 3, fmt: v => N(v), onInput: v => { busy = false; jump(v, false); } });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Zahl und ", s.h("b", null, "Gegenzahl"), " haben denselben Betrag, aber ein anderes Vorzeichen: 7 und −7. Die Gegenzahl von 0 ist 0.");
          const lf = life(s, { class: "life later", style: { padding: "10px 16px" } }, s.h("p", { class: "small" }, "3 Stockwerke hoch – 3 Stockwerke runter. 10 € Guthaben – 10 € Schulden. 5 Grad wärmer – 5 Grad kälter."));
          s.add(root(s, "stack", { gap: "14px", justifyContent: "center" }, s.h("div", { class: "a-fade" }, L.svg),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "330px 1fr", gap: "24px", alignItems: "center" } }, sl, pr), s.h("div", { class: "cols", style: { gap: "18px", alignItems: "center" } }, merk, lf)));
          s.sfx.pop();
          s.step(async () => { await jump(3); s.say("Drei springt über die Null und landet bei minus drei."); });
          s.step(async () => { sl.input.value = -7; sl.querySelector(".mono").textContent = N(-7); await jump(-7); s.say("Und rückwärts: Die Gegenzahl von minus sieben ist sieben."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Die Temperatur steigt und fällt",
        say: "Wenn es wärmer wird, steigt die Temperatur. Wenn es kälter wird, fällt sie. Das können wir auf dem Thermometer verfolgen.",
        build(s) {
          const th = thermo(s, { H: 600, W: 190, min: -12, max: 12, step: 2, value: -3 });
          const arr = s.el("g"); th.svg.append(arr);
          const showArrow = (a, b) => {
            arr.innerHTML = ""; const x = th.cx + 34, c = b > a ? P.warm : P.cold;
            arr.append(s.el("line", { x1: x, x2: x, y1: th.y(a), y2: th.y(b) + (b > a ? 12 : -12), stroke: c, "stroke-width": 5, "stroke-linecap": "round" }),
              s.el("polygon", { points: b > a ? `${x},${th.y(b)} ${x - 9},${th.y(b) + 16} ${x + 9},${th.y(b) + 16}` : `${x},${th.y(b)} ${x - 9},${th.y(b) - 16} ${x + 9},${th.y(b) - 16}`, fill: c }));
          };
          const read = s.h("p", { class: "huge mono", style: { color: P.cold, textAlign: "center" } }, "−3 °C");
          const setR = v => { const r = Math.round(v); read.textContent = N(r) + " °C"; read.style.color = colOf(r); };
          const SC = [
            { a: -3, d: 5, lab: "Nachts −3 °C. Bis mittags wird es 5 Grad wärmer.", eq: ["−3 + 5 = ", 2] },
            { a: 4, d: -6, lab: "Abends 4 °C. Bis nachts wird es 6 Grad kälter.", eq: ["4 − 6 = ", -2] },
            { a: -2, d: -7, lab: "Morgens −2 °C. Ein Schneesturm: 7 Grad kälter!", eq: ["−2 − 7 = ", -9] },
          ];
          const cards = SC.map((c, i) => s.h("div", { class: "ex later", style: { padding: "12px 18px" } }, s.h("span", { class: "exlabel" }, "Beispiel " + (i + 1)), s.h("p", { class: "t" }, c.lab),
            s.h("p", { class: "h2 mono later", style: { marginTop: "6px" } }, c.eq[0], s.h("span", { style: { color: colOf(c.eq[1]) } }, N(c.eq[1]) + " °C"))));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, s.h("b", { style: { color: P.warm } }, "wärmer"), " = plus = nach oben. ", s.h("b", { style: { color: P.cold } }, "kälter"), " = minus = nach unten. Zähle die Striche auf dem Thermometer!");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "190px 1fr", gap: "30px", alignItems: "center" }, s.h("div", { class: "a-up" }, th.svg),
            s.h("div", { class: "stack", style: { gap: "12px" } }, read, ...cards, merk)));
          s.sfx.pop();
          const run = async i => {
            const c = SC[i]; await s.show(cards[i], "left");
            th.set(c.a); setR(c.a); arr.innerHTML = ""; await s.wait(400);
            showArrow(c.a, c.a + c.d); c.d > 0 ? s.sfx.chord([0, 4, 7]) : s.sound("wind", { vol: .35, dur: 1.5 });
            const steps = Math.abs(c.d);
            for (let k = 1; k <= steps; k++) { await th.go(c.a + Math.sign(c.d) * k, 260, setR); s.sfx.count(c.d > 0 ? k : steps - k); }
            await s.show(cards[i].lastChild, "pop");
          };
          s.step(async () => { await run(0); s.say("Minus drei plus fünf: Wir zählen fünf Striche nach oben und landen bei plus zwei Grad."); });
          s.step(async () => { await run(1); s.say("Vier minus sechs: sechs Striche nach unten. Ergebnis: minus zwei Grad."); });
          s.step(async () => { await run(2); s.say("Minus zwei minus sieben: noch weiter nach unten, bis minus neun Grad."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Rechnen heißt Wandern",
        say: "Auf der Zahlengeraden ist Rechnen wie Wandern: Bei plus gehst du nach rechts, bei minus nach links.",
        build(s) {
          const L = numLine(s, { W: 1080, H: 220, min: -15, max: 15, y: 160, every: 5, fs: 21 });
          const path = s.el("path", { d: "", fill: "none", stroke: U, "stroke-width": 5, "stroke-linecap": "round" });
          const head = s.el("polygon", { points: "", fill: U });
          const ptA = s.el("circle", { cx: L.X(0), cy: L.y, r: 11, fill: P.violet, stroke: "#fff", "stroke-width": 3 });
          const ptB = s.el("circle", { cx: L.X(0), cy: L.y, r: 13, fill: P.orange, stroke: "#fff", "stroke-width": 3 });
          const tA = T(s, 0, L.y - 22, "", { "font-size": 22, fill: P.violet }), tB = T(s, 0, L.y - 22, "", { "font-size": 22, fill: P.orange }), tD = T(s, 0, 30, "", { "font-size": 22, fill: U });
          L.svg.append(path, head, ptA, ptB, tA, tB, tD);
          let A = 2, D = -5;
          const eq = s.h("p", { class: "huge mono", style: { textAlign: "center", fontSize: "60px" } });
          const draw = (a, d, t = 1) => {
            const x0 = L.X(a), xe = L.X(a + d * t), top = L.y - 50 - Math.abs(d) * 4;
            const mid = (x0 + xe) / 2;
            path.setAttribute("d", d ? `M${x0},${L.y - 4} Q${mid},${top} ${xe},${L.y - 4}` : "");
            const dir = d > 0 ? 1 : -1;
            if (d && t > .05) { const ang = Math.atan2(L.y - 4 - top, xe - mid), c = Math.cos(ang), sn = Math.sin(ang); const bx = xe - 18 * c, by = L.y - 4 - 18 * sn; head.setAttribute("points", `${xe},${L.y - 4} ${bx - 9 * sn},${by + 9 * c} ${bx + 9 * sn},${by - 9 * c}`); } else head.setAttribute("points", "");
            void dir;
            ptA.setAttribute("cx", x0); tA.setAttribute("x", x0); tA.textContent = N(a);
            ptB.setAttribute("cx", xe); tB.setAttribute("x", xe); tB.textContent = t >= 1 ? N(a + d) : "";
            ptB.style.opacity = t >= 1 ? 1 : 0;
            tD.setAttribute("x", mid); tD.setAttribute("y", Math.max(24, (L.y + top) / 2 - 18)); tD.textContent = d ? (d > 0 ? `+${d} → rechts` : `−${-d} ← links`) : "";
            if (t >= 1 && a + d === a) tB.textContent = "";
            eq.innerHTML = ""; eq.append(s.h("span", { style: { color: P.violet } }, N(a)), d < 0 ? " − " : " + ", s.h("span", { style: { color: U } }, String(Math.abs(d))), " = ", s.h("span", { style: { color: P.orange } }, t >= 1 ? N(a + d) : "?"));
          };
          draw(A, D, 0);
          const walk = async (a, d) => { A = a; D = d; slA.input.value = a; slA.querySelector(".mono").textContent = N(a); slD.input.value = d; slD.querySelector(".mono").textContent = (d > 0 ? "+" : "") + N(d); s.sfx.whoosh(); await s.tween({ from: 0, to: 1, dur: 300 + Math.abs(d) * 160, ease: "inOut", update: t => draw(a, d, t) }); draw(a, d, 1); s.sfx.ding(); };
          const slA = s.slider({ label: "Start", min: -8, max: 8, value: A, fmt: v => N(v), onInput: v => { A = v; draw(A, D); } });
          const slD = s.slider({ label: "Schritte (+ rechts, − links)", min: -7, max: 7, value: D, fmt: v => (v > 0 ? "+" : "") + N(v), onInput: v => { D = v; draw(A, D); } });
          const ctrls = s.h("div", { class: "later", style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" } }, slA, slD);
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Starte bei der ersten Zahl. ", s.h("b", null, "+ 5"), ": 5 Schritte nach ", s.h("b", null, "rechts"), ". ", s.h("b", null, "− 5"), ": 5 Schritte nach ", s.h("b", null, "links"), ". Wo du ankommst, ist das Ergebnis.");
          s.add(root(s, "stack", { gap: "12px", justifyContent: "center" }, s.h("div", { class: "a-fade" }, L.svg), eq, ctrls, merk));
          s.sfx.pop();
          s.step(async () => { await walk(2, -5); s.say("Zwei minus fünf: Von zwei gehen wir fünf Schritte nach links. Wir landen bei minus drei."); });
          s.step(async () => { await walk(-4, 6); s.say("Minus vier plus sechs: sechs Schritte nach rechts. Ergebnis: zwei."); });
          s.step(async () => { await walk(-1, -6); s.say("Minus eins minus sechs: noch weiter nach links, bis minus sieben."); });
          s.step(async () => { s.sfx.pop(); await s.show(ctrls, "up"); await s.show(merk, "up"); s.say("Jetzt du: Stell Start und Schritte ein."); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Im Alltag: Rechnen mit Minus",
        say: "Mit negativen Zahlen rechnest du öfter, als du denkst: im Aufzug, mit Geld, in der Küche und auf Reisen.",
        build(s) {
          const res = (t, c) => s.h("p", { class: "h2 mono later", style: { color: c || U, marginTop: "6px" } }, t);
          const r1 = res("−2 + 6 = 4"), r2 = res("−15 + 25 = 10 €", P.green), r3 = res("18 + 21 = 39 Grad", P.warm), r4 = res("440 + 8.849 = 9.289 m");
          const card = (lab, ph, txt, r, first) => life(s, { class: "life " + (first ? "a-up" : "later"), label: "Im Alltag · " + lab, style: { padding: "12px 14px", display: "flex", flexDirection: "column", justifyContent: "center" } },
            s.h("div", { style: { display: "flex", gap: "14px", alignItems: "center" } }, ph, s.h("div", { style: { minWidth: 0 } }, s.h("p", { class: "small" }, ...txt), r)));
          const c1 = card("U-Bahn", s.photo("ubahn-u5", { w: 150, h: 170 }), ["Vom U-Bahnsteig (−2) fährst du mit dem Aufzug 6 Stockwerke hoch. Wo kommst du an?"], r1, true);
          const c2 = card("Taschengeld", s.h("div", { style: { fontSize: "64px", width: "150px", textAlign: "center", flex: "none" } }, "💶"), ["Dein Konto steht bei −15 €. Zum Geburtstag bekommst du 25 €."], r2);
          const c3 = card("Küche", s.h("div", { style: { fontSize: "64px", width: "150px", textAlign: "center", flex: "none" } }, "🍦"), ["Eis aus dem Gefrierschrank (−18 °C) steht im Zimmer (21 °C). Bis 0 °C sind es 18 Grad, dann noch 21 Grad."], r3);
          const c4 = card("Reisen", s.photo("everest", { w: 150, h: 170, pos: "45% 50%" }), ["Vom Ufer des Toten Meeres (−440 m) bis zum Gipfel des Mount Everest (8.849 m):"], r4);
          s.add(root(s, "cols", { gridTemplateRows: "1fr 1fr", gap: "16px 18px" }, c1, c2, c3, c4));
          s.sfx.pop();
          s.step(async () => { s.sfx.ding(); await s.show(r1, "up"); s.say("Minus zwei plus sechs ist vier. Du bist im vierten Stock."); });
          s.step(async () => { s.sound("coins", { vol: .5 }); await s.show(c2, "right"); await s.show(r2, "up"); s.say("Minus fünfzehn plus fünfundzwanzig: Jetzt hast du zehn Euro Guthaben."); });
          s.step(async () => { s.sfx.pop(); await s.show(c3, "left"); await s.show(r3, "up"); s.say("Von minus achtzehn bis null sind es achtzehn Grad, dann noch einundzwanzig. Zusammen neununddreißig Grad."); });
          s.step(async () => { s.sfx.fanfare(); await s.show(c4, "right"); await s.show(r4, "up"); s.say("Vierhundertvierzig Meter bis zum Meeresspiegel, dann achttausendachthundertneunundvierzig Meter hoch: neuntausendzweihundertneunundachtzig Meter!"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Das Koordinatensystem wächst",
        say: "In Kapitel zwei hatte das Koordinatensystem nur positive Zahlen. Jetzt verlängern wir die Achsen nach links und nach unten.",
        build(s) {
          const K = kosy4(s, { min: -6, max: 6, u: 45 });
          K.qrects.forEach((r, i) => { if (i) r.classList.add("later"); });
          [K.negAxes, K.negNums].forEach(later);
          const qlab = [[3, 3], [-3, 3], [-3, -3], [3, -3]].map(([x, y], i) => { const g = later(fb(s.el("g"))); g.append(s.el("circle", { cx: K.X(x), cy: K.Y(y), r: 30, fill: "#fff", opacity: .85 }), T(s, K.X(x), K.Y(y) + 10, QN[i], { "font-size": 30, fill: U, "font-family": "Georgia, serif" })); K.svg.append(g); return g; });
          const SIG = [["I", "(+|+)", "rechts oben"], ["II", "(−|+)", "links oben"], ["III", "(−|−)", "links unten"], ["IV", "(+|−)", "rechts unten"]];
          const rows = SIG.map(([q, sg, w], i) => s.h("div", { class: "card later", style: { display: "flex", gap: "16px", alignItems: "center", padding: "10px 16px", background: ["#fde9e7", "#e6eefc", "#e8f6ee", "#fff3c9"][i], borderColor: "transparent" } },
            s.h("b", { style: { font: "700 30px/1 Georgia, serif", color: U, width: "50px" } }, q), s.h("span", { class: "h2 mono" }, sg), s.h("span", { class: "small" }, w)));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Die Achsen teilen die Ebene in ", s.h("b", null, "vier Quadranten"), ". Man zählt sie ", s.h("b", null, "gegen den Uhrzeigersinn"), ": I, II, III, IV.");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: `${K.W}px 1fr`, gap: "26px", alignItems: "center" }, s.h("div", { class: "a-fade" }, K.svg), s.h("div", { class: "stack", style: { gap: "12px" } }, ...rows, merk)));
          s.sfx.pop();
          s.step(async () => {
            K.negAxes.classList.remove("later"); s.sfx.zap();
            await Promise.all([s.show(K.nx, "draw"), s.show(K.ny, "draw")]); await s.show(K.negNums, "fade");
            s.say("Die x-Achse geht jetzt auch nach links, die y-Achse auch nach unten. Dort stehen die negativen Zahlen.");
          });
          s.step(async () => { for (let i = 1; i < 4; i++) { s.show(K.qrects[i], "fade"); s.sfx.note(i * 3, .2); await s.wait(250); } for (let i = 0; i < 4; i++) { s.sfx.pop(); await s.show(qlab[i], "pop"); } s.say("So entstehen vier Viertel: die Quadranten eins bis vier."); });
          s.step(async () => { for (const r of rows) { s.sfx.tick(); await s.show(r, "left"); } s.say("Im zweiten Quadranten ist x negativ und y positiv."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Punkte in allen vier Quadranten",
        say: "Auch mit negativen Zahlen gilt: erst x, dann y. Minus bei x heißt nach links, minus bei y heißt nach unten.",
        build(s) {
          const K = kosy4(s, { min: -6, max: 6, u: 45 });
          const hx = s.el("line", { x1: K.X(0), y1: K.Y(0), x2: K.X(0), y2: K.Y(0), stroke: P.blue, "stroke-width": 6, "stroke-linecap": "round" });
          const hy = s.el("line", { x1: K.X(0), y1: K.Y(0), x2: K.X(0), y2: K.Y(0), stroke: P.red, "stroke-width": 6, "stroke-linecap": "round" });
          const dot = s.el("circle", { cx: K.X(0), cy: K.Y(0), r: 12, fill: U, stroke: "#fff", "stroke-width": 3 });
          const hit = s.el("circle", { cx: K.X(0), cy: K.Y(0), r: 32, fill: "transparent" });
          const lab = T(s, 0, 0, "", { "font-size": 22, fill: U });
          const marks = s.el("g");
          K.svg.append(marks, hx, hy, dot, lab, hit);
          let px = 0, py = 0;
          const big = s.h("p", { class: "huge mono", style: { fontSize: "64px" } });
          const quad = s.h("p", { class: "h2", style: { color: U, minHeight: "38px" } });
          const place = (x, y) => {
            px = x; py = y;
            dot.setAttribute("cx", K.X(x)); dot.setAttribute("cy", K.Y(y)); hit.setAttribute("cx", K.X(x)); hit.setAttribute("cy", K.Y(y));
            hx.setAttribute("x2", K.X(x)); hy.setAttribute("x1", K.X(x)); hy.setAttribute("x2", K.X(x)); hy.setAttribute("y1", K.Y(0)); hy.setAttribute("y2", K.Y(y));
            lab.setAttribute("x", K.X(x) + (x < 0 ? -14 : 14)); lab.setAttribute("text-anchor", x < 0 ? "end" : "start"); lab.setAttribute("y", K.Y(y) + (y < 0 ? 30 : -14));
            lab.textContent = `(${N(x)}|${N(y)})`;
            big.innerHTML = ""; big.append("P(", s.h("span", { class: "blue" }, N(x)), "|", s.h("span", { class: "red" }, N(y)), ")");
            const q = quadOf(x, y); quad.textContent = q < 0 ? "auf einer Achse" : `Quadrant ${QN[q]}`;
            K.qrects.forEach((r, i) => r.setAttribute("opacity", q < 0 || i === q ? 1 : .35));
          };
          place(0, 0);
          s.drag(hit, { space: K.svg, onMove: p => { const nx = clamp(Math.round((p.x - K.ox) / K.u), -6, 6), ny = clamp(Math.round((K.oy - p.y) / K.u), -6, 6); if (nx !== px || ny !== py) { place(nx, ny); s.sfx.tick(); } } });
          const walk = async (x, y, name) => {
            place(0, 0); s.say(`${name}: ${x < 0 ? "minus " + -x : x} nach ${x < 0 ? "links" : "rechts"}, ${y < 0 ? "minus " + -y : y} nach ${y < 0 ? "unten" : "oben"}.`);
            const sx = Math.sign(x), sy = Math.sign(y);
            for (let i = 1; i <= Math.abs(x); i++) { await s.tween({ from: (i - 1) * sx, to: i * sx, dur: 200, update: v => { dot.setAttribute("cx", K.X(v)); hx.setAttribute("x2", K.X(v)); } }); s.sfx.count(i - 1); }
            hy.setAttribute("x1", K.X(x)); hy.setAttribute("x2", K.X(x));
            for (let j = 1; j <= Math.abs(y); j++) { await s.tween({ from: (j - 1) * sy, to: j * sy, dur: 200, update: v => { dot.setAttribute("cy", K.Y(v)); hy.setAttribute("y2", K.Y(v)); } }); s.sfx.count(Math.abs(x) + j - 1); }
            place(x, y); s.sfx.ding();
            const m = s.el("g"); m.append(s.el("circle", { cx: K.X(x), cy: K.Y(y), r: 8, fill: P.pencil }), T(s, K.X(x) + (x < 0 ? -12 : 12), K.Y(y) + (y < 0 ? -12 : 26), name, { "font-size": 20, fill: P.pencil, "text-anchor": x < 0 ? "end" : "start" }));
            marks.append(m);
          };
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Erst ", s.h("b", { class: "blue" }, "x"), ": + nach rechts, − nach links. Dann ", s.h("b", { class: "red" }, "y"), ": + nach oben, − nach unten.");
          const tip = s.h("p", { class: "small pencil later" }, "Zieh den Punkt in alle vier Quadranten!");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: `${K.W}px 1fr`, gap: "26px", alignItems: "center" }, s.h("div", { class: "a-fade" }, K.svg), s.h("div", { class: "stack", style: { gap: "14px" } }, big, quad, merk, tip)));
          s.sfx.pop();
          s.step(async () => { await walk(-4, 3, "A"); });
          s.step(async () => { await walk(-2, -5, "B"); });
          s.step(async () => { await walk(5, -3, "C"); });
          s.step(async () => { s.sfx.pop(); await s.show(merk, "up"); await s.show(tip, "fade"); s.say("Jetzt du: Zieh den Punkt herum."); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Figuren spiegeln mit Minus",
        say: "Ein Segelboot in Quadrant eins. Wenn wir die x-Werte durch ihre Gegenzahlen ersetzen, wird das Boot an der y-Achse gespiegelt.",
        build(s) {
          const K = kosy4(s, { min: -6, max: 6, u: 45 });
          const BOAT = [[1, 1], [5, 1], [6, 2], [3, 2], [3, 6], [1, 2], [3, 2], [0.5, 2]];
          const HULL = [[1.6, 1], [5, 1], [6, 2], [1, 2]], SAIL = [[3, 2.4], [3, 6], [1.3, 2.4]];
          const mk = (fx, fy, c, cls) => {
            const g = s.el("g", cls ? { class: cls } : {});
            const pts = arr => arr.map(([x, y]) => `${K.X(x * fx)},${K.Y(y * fy)}`).join(" ");
            g.append(s.el("polygon", { points: pts(HULL), fill: c, "fill-opacity": .35, stroke: c, "stroke-width": 3.5, "stroke-linejoin": "round" }),
              s.el("polygon", { points: pts(SAIL), fill: "#fff", stroke: c, "stroke-width": 3.5, "stroke-linejoin": "round" }));
            return g;
          };
          void BOAT;
          const b1 = mk(1, 1, P.warm), b2 = later(mk(-1, 1, P.blue)), b3 = later(mk(-1, -1, P.green)), b4 = later(mk(1, -1, P.orange));
          const mirY = later(s.el("line", { x1: K.X(0), x2: K.X(0), y1: K.Y(6), y2: K.Y(-6), stroke: U, "stroke-width": 5, opacity: .6 }));
          const mirX = later(s.el("line", { x1: K.X(-6), x2: K.X(6), y1: K.Y(0), y2: K.Y(0), stroke: U, "stroke-width": 5, opacity: .6 }));
          K.svg.append(mirY, mirX, b1, b2, b3, b4);
          const chip = (t, c) => s.h("span", { class: "chip", style: { fontSize: "21px", color: c, background: "#fff", border: `2px solid ${c}` } }, t);
          const line = (name, pts, c, cls) => s.h("div", { class: "stack " + cls, style: { gap: "6px" } }, s.h("p", { class: "small", style: { fontWeight: 700, color: c } }, name), s.h("div", { class: "row", style: { gap: "8px" } }, ...pts.map(p => chip(p, c))));
          const l1 = line("Original (Quadrant I): Segelspitze und Rumpf", ["(3|6)", "(5|1)", "(6|2)"], P.warm, "a-up");
          const l2 = line("an der y-Achse gespiegelt: x wird zur Gegenzahl", ["(−3|6)", "(−5|1)", "(−6|2)"], P.blue, "later");
          const l3 = line("an der x-Achse gespiegelt: y wird zur Gegenzahl", ["(3|−6)", "(5|−1)", "(6|−2)"], P.orange, "later");
          const l4 = line("beides: x und y werden zur Gegenzahl", ["(−3|−6)", "(−5|−1)", "(−6|−2)"], P.green, "later");
          const lf = life(s, { class: "life later", style: { padding: "10px 16px" } }, s.h("p", { class: "small" }, "So spiegeln auch Grafikprogramme und Spiele ihre Figuren: Sie ändern nur die Vorzeichen der Koordinaten."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: `${K.W}px 1fr`, gap: "24px", alignItems: "center" }, s.h("div", { class: "a-fade" }, K.svg), s.h("div", { class: "stack", style: { gap: "12px" } }, l1, l2, l4, l3, lf)));
          s.sound("waves", { vol: .3, dur: 2 });
          const flip = async (g, ln, mir, axis) => {
            if (mir) { s.sfx.zap(); await s.show(mir, "draw"); }
            g.classList.remove("later"); s.sfx.whoosh();
            await s.tween({ from: 0, to: 1, dur: 800, ease: "out", update: t => { const k = Math.max(.02, t); g.setAttribute("transform", axis === "y" ? `translate(${K.X(0) * (1 - k)},0) scale(${k},1)` : `translate(0,${K.Y(0) * (1 - k)}) scale(1,${k})`); } });
            g.removeAttribute("transform"); s.sfx.snap(); await s.show(ln, "up");
          };
          s.step(async () => { await flip(b2, l2, mirY, "y"); s.say("Aus drei, sechs wird minus drei, sechs. Das Boot fährt jetzt nach links."); });
          s.step(async () => { await flip(b3, l4, mirX, "x"); s.say("Jetzt spiegeln wir an der x-Achse: Auch y bekommt ein Minus."); });
          s.step(async () => { await flip(b4, l3, null, "y"); s.say("Und das vierte Boot: x positiv, y negativ, im Quadranten vier."); });
          s.step(async () => { s.sfx.success(); await s.show(lf, "up"); });
        },
      },
    ],
  });
})();
