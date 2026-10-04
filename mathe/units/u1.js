/* Kapitel 1 – Natürliche Zahlen (große Zahlen, Runden, Rechnen, Rechengesetze, Größen, Gleichungen) */
(() => {
  const P = { blue: "#1d5bd0", red: "#dc3b2a", green: "#138a5a", violet: "#7b4fd6", orange: "#ee7a1a", ink: "#1b2740", pencil: "#5d6678", yellow: "#ffd94a", line: "#c8d3de", soft: "#e4ecfb" };
  const LBL = { font: "700 14px/1 var(--f-display)", letterSpacing: ".08em", textTransform: "uppercase", display: "block", marginBottom: "8px", color: "var(--green)" };
  const ex = (s, label, attrs, ...kids) => s.h("div", Object.assign({ class: "ex" }, attrs || {}), s.h("span", { class: "exlabel" }, label), ...kids);
  const life = (s, attrs, ...kids) => s.h("div", Object.assign({ class: "life" }, attrs || {}), s.h("span", { style: LBL }, "Im Alltag"), ...kids);
  const T = (s, x, y, text, a) => s.el("text", Object.assign({ x, y, "text-anchor": "middle", "font-size": 22, "font-weight": 700, fill: P.ink, text }, a || {}));
  const fb = el => { el.style.transformBox = "fill-box"; el.style.transformOrigin = "center"; return el; };
  const later = el => { el.classList.add("later"); return el; };
  const sp = (s, text, color, extra) => s.h("span", { style: Object.assign({ color }, extra || {}) }, text);
  const root = (s, cls, style, ...kids) => s.h("div", { class: cls, style: Object.assign({ height: "100%", fontSize: "22px" }, style || {}) }, ...kids);

  /* coloured thousands groups: Einer green, Tausender blue, Millionen violet, Milliarden red */
  const GC = [P.green, P.blue, P.violet, P.red];
  function colorNum(s, str, cls) {
    const parts = str.split(".");
    const el = s.h("span", { class: cls || "" });
    parts.forEach((p, i) => { el.append(sp(s, p, GC[parts.length - 1 - i])); if (i < parts.length - 1) el.append(sp(s, ".", P.ink)); });
    return el;
  }

  /* Rechenkästchen-Rechnung (schriftlich) */
  function calcBox(s, cfg) {
    const C = 52, W = cfg.cols * C + 20, H = 262, O = 30;
    const svg = s.svg(W, H);
    const cx = i => 10 + C * i + C / 2;
    const hl = s.el("rect", { x: cx(0) - C / 2 + 3, y: 6, width: C - 6, height: 252, rx: 10, fill: "#fff1a8", opacity: 0 });
    svg.append(hl);
    ["", "T", "H", "Z", "E"].forEach((t, i) => t && svg.append(T(s, cx(i), 26, t, { "font-size": 19, fill: P.pencil })));
    for (let i = 1; i < cfg.cols; i++) svg.append(s.el("line", { x1: 10 + C * i, x2: 10 + C * i, y1: 8, y2: 256, stroke: "#dfe8f0", "stroke-width": 1.5 }));
    cfg.rows.forEach((row, r) => row.forEach((d, i) => { if (d != null) svg.append(T(s, cx(i), O + 56 + r * 56, String(d), { "font-size": 44, fill: r === 1 && i === 0 ? P.red : P.ink })); }));
    svg.append(s.el("line", { x1: 6, x2: W - 6, y1: O + 160, y2: O + 160, stroke: P.ink, "stroke-width": 3, "stroke-linecap": "round" }));
    const res = cfg.res.map((d, i) => d == null ? null : later(fb(T(s, cx(i), O + 212, String(d), { "font-size": 44, fill: P.blue }))));
    res.forEach(r => r && svg.append(r));
    const carries = {};
    cfg.steps.forEach(st => { if (st.carry) { const c = later(fb(T(s, cx(st.carry[0]) + 10, O + 148, String(st.carry[1]), { "font-size": 22, fill: P.red }))); carries[st.c] = c; svg.append(c); } });
    let running = false;
    async function run(expl) {
      if (running) return; running = true;
      res.forEach(r => r && later(r)); Object.values(carries).forEach(later);
      for (const st of cfg.steps) {
        if (!s.alive) break;
        const x0 = Number(hl.getAttribute("x")), x1 = cx(st.c) - C / 2 + 3;
        hl.setAttribute("opacity", 1);
        await s.tween({ from: x0, to: x1, dur: 300, update: v => hl.setAttribute("x", v) });
        expl.textContent = st.t; s.sfx.pop();
        await s.wait(500);
        s.show(res[st.c], "pop"); s.sfx.count(cfg.steps.indexOf(st) + 2);
        if (carries[st.c]) { await s.wait(250); s.show(carries[st.c], "down"); s.sfx.tick(); }
        await s.wait(900);
      }
      hl.setAttribute("opacity", 0);
      if (s.alive) s.sfx.success();
      running = false;
    }
    return { svg, run };
  }

  Deck.unit({
    id: "u1", num: 1, title: "Natürliche Zahlen", color: "#1d5bd0", soft: "#e4ecfb",
    subtitle: "Große Zahlen, schlaues Rechnen, Größen",
    blurb: "Millionen lesen, runden, schriftlich rechnen, Größen umrechnen.",
    goals: ["Große Zahlen bis zur Million lesen und ordnen", "Runden und klug schätzen", "Schriftlich rechnen und Rechengesetze nutzen", "Längen, Gewichte und Zeiten umrechnen", "Gleichungen wie eine Waage lösen"],
    icon(svg, el) {
      svg.append(el("rect", { x: 6, y: 20, width: 58, height: 30, rx: 8, fill: "#1d5bd0", opacity: .15 }),
        el("text", { x: 35, y: 44, "text-anchor": "middle", "font-size": 22, "font-weight": 800, fill: "#1d5bd0", text: "1.000" }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Die Stellenwerttafel",
        say: "Wie viele Menschen wohnen in Berlin? Wir sortieren die Zahl in die Stellenwerttafel.",
        build(s) {
          const digits = "3897145".split("");
          const heads = ["M", "HT", "ZT", "T", "H", "Z", "E"];
          const names = ["Millionen", "Hunderttausender", "Zehntausender", "Tausender", "Hunderter", "Zehner", "Einer"];
          const vals = [1e6, 1e5, 1e4, 1e3, 100, 10, 1];
          const gcol = i => (i === 0 ? P.violet : i < 4 ? P.blue : P.green);
          const q = s.h("p", { class: "h2 a-up" }, "Wie viele Menschen wohnen in Berlin? ", s.h("span", { class: "pencil", style: { font: "400 21px var(--f-body)" } }, "(Melderegister, Ende 2024)"));
          const grid = s.h("div", { class: "a-zoom", style: { display: "grid", gridTemplateColumns: "repeat(7, 108px)", gap: "6px", justifyContent: "center" } });
          [["Millionen", 1, P.violet], ["Tausender", 3, P.blue], ["Einer", 3, P.green]].forEach(([t, n, c]) =>
            grid.append(s.h("div", { style: { gridColumn: `span ${n}`, background: c, color: "#fff", font: "700 19px/1 var(--f-display)", padding: "8px 0", textAlign: "center", borderRadius: "10px 10px 0 0" } }, t)));
          heads.forEach((hd, i) => grid.append(s.h("div", { style: { textAlign: "center", font: "700 22px/1 var(--f-display)", color: gcol(i), padding: "6px 0", borderBottom: `3px solid ${gcol(i)}` } }, hd)));
          const cells = digits.map((d, i) => {
            const c = s.h("div", { style: { height: "84px", background: "#fff", border: "2px solid var(--line)", borderRadius: "10px", display: "grid", placeItems: "center", cursor: "pointer" } });
            c.dg = s.h("span", { class: "later", style: { font: "800 54px/1 var(--f-display)", color: gcol(i) } }, d);
            c.append(c.dg); grid.append(c); return c;
          });
          const bigNum = s.h("p", { class: "huge mono later", style: { textAlign: "center" } }, colorNum(s, "3.897.145"));
          const words = s.h("p", { class: "t later", style: { textAlign: "center", fontSize: "26px" } },
            sp(s, "drei Millionen ", P.violet), s.h("wbr"), sp(s, "achthundertsiebenundneunzigtausend", P.blue), s.h("wbr"), sp(s, "einhundertfünfundvierzig", P.green));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Von rechts in ", s.h("b", null, "Dreierpäckchen"), " gliedern: Einer, Tausender, Millionen. Jede Stelle ist ", s.h("b", null, "10-mal"), " so viel wert wie ihr rechter Nachbar.");
          const tapName = s.h("p", { class: "small pencil" }, "Tippe auf eine Ziffer in der Tafel!");
          const tapOut = s.h("p", { class: "mono", style: { font: "700 26px/1.2 var(--f-display)", margin: 0, color: P.blue } }, "8 HT = 8 · 100.000 = 800.000");
          const tap = s.h("div", { class: "card soft later stack", style: { gap: "8px", justifyContent: "center" } }, tapName, tapOut);
          cells.forEach((c, i) => c.addEventListener("click", () => {
            if (c.dg.classList.contains("later")) return;
            const d = +digits[i];
            tapOut.textContent = `${d} ${heads[i]} = ${d} · ${s.fmt(vals[i])} = ${s.fmt(d * vals[i])}`;
            tapName.textContent = `${heads[i]} heißt ${names[i]}`;
            s.sfx.note(i, 0.25); tapOut.classList.remove("a-pop"); void tapOut.offsetWidth; tapOut.classList.add("a-pop");
            cells.forEach(x => (x.style.background = "#fff")); c.style.background = "#fff6c9";
          }));
          s.add(root(s, "stack", { justifyContent: "space-between" }, q, grid, bigNum, words, s.h("div", { class: "cols", style: { alignItems: "stretch" } }, merk, tap)));
          s.sfx.whoosh();
          s.step(async () => {
            s.say("Drei Millionen achthundertsiebenundneunzigtausend einhundertfünfundvierzig.");
            for (let i = 0; i < 7; i++) { s.show(cells[i].dg, "bounce"); s.sfx.count(i); await s.wait(230); }
            await s.wait(200); s.sfx.ding(); await s.show(bigNum, "zoom");
          });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(words, "up"); s.say("Wir lesen in Dreierpäckchen: drei Millionen, achthundertsiebenundneunzigtausend, einhundertfünfundvierzig."); });
          s.step(async () => { s.sfx.ding(); s.show(merk, "up"); await s.show(tap, "up", 150); s.say("Tippe auf eine Ziffer und sieh, wie viel sie wert ist."); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Große Zahlen im Alltag",
        say: "Große Zahlen findest du überall. Wir lesen sie immer in Dreierpäckchen.",
        build(s) {
          const data = [
            { e: "🏟️", t: "Plätze im Olympiastadion Berlin", n: "73.877", w: [["dreiundsiebzigtausend", P.blue], ["achthundertsiebenundsiebzig", P.green]] },
            { e: "❤️", t: "So oft schlägt ein Erwachsenen-Herz an einem Tag – ungefähr", n: "100.000", w: [["hunderttausend", P.blue]] },
            { e: "⏱️", t: "Sekunden in einem Jahr mit 365 Tagen", n: "31.536.000", w: [["einunddreißig Millionen ", P.violet], ["fünfhundertsechsunddreißigtausend", P.blue]] },
            { e: "🚇", t: "Fahrgäste der BVG in einem Jahr – rund", n: "1.000.000.000", w: [["eine Milliarde", P.red]] },
          ];
          const cards = data.map((d, i) => {
            const words = s.h("p", { class: "t", style: { fontSize: "22px" } });
            d.w.forEach(([w, c], k) => { if (k) words.append(s.h("wbr")); words.append(sp(s, w, c)); });
            return ex(s, "Beispiel " + (i + 1), { class: "ex" + (i ? " later" : " a-up"), style: { display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center" } },
              s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "12px" } }, s.h("span", { style: { fontSize: "38px", lineHeight: 1 } }, d.e), s.h("p", { class: "small" }, d.t)),
              colorNum(s, d.n, "big mono"), words, s.h("p", { class: "small pencil" }, `${d.n.replace(/\./g, "").length} Stellen · ${d.n.split(".").length} Päckchen`));
          });
          const chip = (n, w) => s.h("div", { class: "chip", style: { fontSize: "21px", padding: "8px 16px" } }, s.h("b", null, n), " " + w);
          const arrow = () => s.h("span", { class: "hand red", style: { fontSize: "30px" } }, "· 1.000 →");
          const ladder = s.h("div", { class: "row later", style: { justifyContent: "center", flexWrap: "nowrap", gap: "12px" } }, chip("1.000", "Tausend"), arrow(), chip("1.000.000", "Million"), arrow(), chip("1.000.000.000", "Milliarde"));
          s.add(root(s, "stack", { justifyContent: "space-between" }, s.h("div", { class: "cols", style: { gridTemplateRows: "1fr 1fr", gap: "16px 22px", flex: 1 } }, ...cards), ladder));
          s.sfx.pop();
          [1, 2, 3].forEach(i => s.step(async () => { s.sfx.pop(); await s.show(cards[i], i % 2 ? "right" : "left"); s.sfx.count(i + 2); }));
          s.step(async () => { s.sfx.whoosh(); await s.show(ladder, "up"); s.sfx.success(); s.say("Tausend mal tausend ist eine Million. Tausend Millionen sind eine Milliarde."); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Zehnerpotenzen",
        say: "Zehn Einer sind ein Zehner, zehn Zehner ein Hunderter, zehn Hunderter ein Tausender. Immer mal zehn!",
        build(s) {
          const svg = s.svg(520, 600);
          function block(x, y, w, h, d, nx, ny, nz, cols) {
            const g = fb(s.el("g"));
            const dx = d, dy = -d;
            const st = { stroke: cols[3], "stroke-width": 1, fill: "none" };
            g.append(s.el("polygon", { points: `${x},${y} ${x + dx},${y + dy} ${x + w + dx},${y + dy} ${x + w},${y}`, fill: cols[1], stroke: cols[3], "stroke-width": 1.5 }));
            g.append(s.el("polygon", { points: `${x + w},${y} ${x + w + dx},${y + dy} ${x + w + dx},${y + h + dy} ${x + w},${y + h}`, fill: cols[2], stroke: cols[3], "stroke-width": 1.5 }));
            g.append(s.el("rect", { x, y, width: w, height: h, fill: cols[0], stroke: cols[3], "stroke-width": 1.5 }));
            for (let i = 1; i < nx; i++) { const xx = x + (i * w) / nx; g.append(s.el("line", Object.assign({ x1: xx, y1: y, x2: xx, y2: y + h }, st)), s.el("line", Object.assign({ x1: xx, y1: y, x2: xx + dx, y2: y + dy }, st))); }
            for (let j = 1; j < ny; j++) { const yy = y + (j * h) / ny; g.append(s.el("line", Object.assign({ x1: x, y1: yy, x2: x + w, y2: yy }, st)), s.el("line", Object.assign({ x1: x + w, y1: yy, x2: x + w + dx, y2: yy + dy }, st))); }
            for (let k = 1; k < nz; k++) { const ox = (k * dx) / nz, oy = (k * dy) / nz; g.append(s.el("line", Object.assign({ x1: x + ox, y1: y + oy, x2: x + w + ox, y2: y + oy }, st)), s.el("line", Object.assign({ x1: x + w + ox, y1: y + oy, x2: x + w + ox, y2: y + h + oy }, st))); }
            return g;
          }
          const BL = ["#9db8ee", "#c9d8f6", "#6f93dc", "#1d5bd0"], OR = ["#f8b26a", "#fbd0a0", "#d9772a", "#a84f0c"];
          const items = [
            [block(20, 239, 11, 11, 6, 1, 1, 1, BL), "1", "Einer", 28],
            [block(95, 140, 11, 110, 6, 1, 10, 1, BL), "10", "Zehner", 103],
            [block(150, 140, 110, 110, 6, 10, 10, 1, BL), "100", "Hunderter", 208],
            [block(330, 140, 110, 110, 55, 10, 10, 10, BL), "1.000", "Tausender", 412],
          ];
          const groups = items.map(([b, n, name, x], i) => {
            const g = fb(s.el("g", { class: i ? "later" : "" }));
            g.append(b, T(s, x, 288, n, { "font-size": 26 }), T(s, x, 314, name, { "font-size": 19, "font-weight": 600, fill: P.pencil }));
            svg.append(g); return g;
          });
          const mil = fb(s.el("g", { class: "later" }));
          mil.append(block(150, 395, 170, 170, 70, 10, 10, 10, ["#dbe6fb", "#eef3fd", "#bfd0f3", "#1d5bd0"]));
          mil.append(block(150, 548, 17, 17, 7, 1, 1, 1, OR));
          mil.append(T(s, 235, 594, "1 m", { "font-size": 22, fill: P.red }), T(s, 140, 486, "1 m", { "font-size": 22, fill: P.red, "text-anchor": "end" }));
          mil.append(T(s, 400, 424, "1 Million", { "font-size": 24, "text-anchor": "start", fill: P.blue }), T(s, 400, 452, "Zentimeter-", { "font-size": 19, "font-weight": 600, "text-anchor": "start" }), T(s, 400, 476, "würfel", { "font-size": 19, "font-weight": 600, "text-anchor": "start" }));
          mil.append(T(s, 400, 530, "orange =", { "font-size": 19, "font-weight": 600, "text-anchor": "start", fill: OR[3] }), T(s, 400, 554, "1 Tausender", { "font-size": 19, "font-weight": 600, "text-anchor": "start", fill: OR[3] }));
          svg.append(mil);
          const pw = (b, e) => s.h("span", null, b, s.h("sup", { style: { fontSize: "60%" } }, e));
          const row = (kids, lab, first) => s.h("div", { class: "row" + (first ? " a-left" : " later"), style: { gap: "14px", flexWrap: "nowrap" } }, s.h("span", { class: "chip", style: { minWidth: "126px", justifyContent: "center" } }, lab), s.h("p", { class: "h2 mono" }, ...kids));
          const rows = [
            row(["1"], "Einer", true),
            row([pw("10", "1"), " = 10"], "Zehner"),
            row([pw("10", "2"), " = 10 · 10 = 100"], "Hunderter"),
            row([pw("10", "3"), " = 10 · 10 · 10 = ", s.h("b", { class: "blue" }, "1.000")], "Tausender"),
            row([pw("10", "6"), " = ", s.h("b", { class: "red" }, "1.000.000")], "Million"),
          ];
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Die kleine ", s.h("b", null, "Hochzahl"), " sagt, wie oft man 10 malnimmt – und wie viele ", s.h("b", null, "Nullen"), " die Zahl hat: 10", s.h("sup", null, "6"), " hat 6 Nullen.");
          const lf = life(s, { class: "life later" }, s.h("p", { class: "small" }, s.h("b", null, "kilo"), " heißt 1.000: 1 km = 1.000 m, 1 kg = 1.000 g. Ein Würfel mit 1 m Kante passt in eure Klasse – und fasst 1 Million Zentimeterwürfel!"));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "520px 1fr", gap: "28px", alignItems: "center" }, svg, s.h("div", { class: "stack", style: { gap: "14px" } }, ...rows, merk, lf)));
          s.sfx.pop();
          for (let i = 1; i <= 4; i++) s.step(async () => {
            s.sfx.whoosh();
            if (i < 4) s.show(groups[i], "pop"); else s.show(mil, "zoom");
            await s.show(rows[i], "left", 150); s.sfx.count(i * 2);
            s.say(["Zehn Einer sind ein Zehner.", "Zehn Zehner sind ein Hunderter.", "Zehn Hunderter sind ein Tausender.", "Und tausend Tausender sind eine Million!"][i - 1]);
          });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.show(lf, "up"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Zahlenstrahl mit Zoom",
        say: "Auf dem Zahlenstrahl hat jede Zahl ihren Platz. Wir zoomen hinein wie bei einer Karte.",
        build(s) {
          const CW = 1100, CH = 262, pad = 55, AY = 196;
          const { canvas, g } = s.canvas(CW, CH);
          const target = 73877;
          const pins = [{ v: 22012, n: "Alte Försterei", row: 0 }, { v: 73877, n: "Olympiastadion", row: 1, hot: true }, { v: 81365, n: "Signal Iduna Park", row: 0 }];
          const levels = [[0, 1e6], [0, 1e5], [7e4, 8e4], [73000, 74000], [73800, 73900]];
          let view = { lo: 0, hi: 1e6 }, lev = 0;
          const info = s.h("p", { class: "t mono", style: { textAlign: "center", flex: 1 } }, "");
          const FONT = "700 19px 'Atkinson Hyperlegible', sans-serif", FONT2 = "400 19px 'Atkinson Hyperlegible', sans-serif";
          function draw() {
            const { lo, hi } = view;
            const ppu = (CW - 2 * pad) / (hi - lo), X = v => pad + (v - lo) * ppu;
            const major = Math.pow(10, Math.ceil(Math.log10(95 / ppu) - 1e-9)), minor = major / 10;
            g.clearRect(0, 0, CW, CH);
            g.strokeStyle = P.ink; g.fillStyle = P.ink; g.lineCap = "round"; g.lineWidth = 3;
            g.beginPath(); g.moveTo(pad - 30, AY); g.lineTo(CW - pad + 30, AY); g.stroke();
            g.beginPath(); g.moveTo(CW - pad + 38, AY); g.lineTo(CW - pad + 24, AY - 8); g.lineTo(CW - pad + 24, AY + 8); g.fill();
            const i0 = Math.ceil(lo / minor - 1e-9), i1 = Math.floor(hi / minor + 1e-9);
            g.textAlign = "center"; g.font = FONT;
            for (let i = i0; i <= i1; i++) {
              const isMaj = i % 10 === 0, isMid = i % 5 === 0;
              if (!isMaj && !isMid && minor * ppu < 5) continue;
              const x = X(i * minor), len = isMaj ? 24 : isMid ? 15 : 8;
              g.lineWidth = isMaj ? 3 : 2; g.strokeStyle = isMaj ? P.ink : P.pencil;
              g.beginPath(); g.moveTo(x, AY - len / 2); g.lineTo(x, AY + len / 2); g.stroke();
              if (isMaj) { g.fillStyle = P.ink; g.fillText(s.fmt(i * minor), x, AY + 42); }
            }
            const vis = pins.map(p => ({ p, x: X(p.v) })).filter(o => o.x > pad - 20 && o.x < CW - pad + 20);
            vis.forEach(o => {
              const crowd = vis.some(q => q !== o && q.p.row === o.p.row && Math.abs(q.x - o.x) < 175);
              const top = o.p.row ? AY - 92 : AY - 34, col = o.p.hot ? P.red : P.blue;
              g.strokeStyle = col; g.lineWidth = 2.5; g.beginPath(); g.moveTo(o.x, AY); g.lineTo(o.x, crowd ? AY - 20 : top); g.stroke();
              g.fillStyle = col; g.beginPath(); g.arc(o.x, AY, 7, 0, Math.PI * 2); g.fill();
              if (crowd) return;
              g.font = FONT; const w = Math.max(g.measureText(o.p.n).width, 70);
              const lx = Math.max(w / 2 + 4, Math.min(CW - w / 2 - 4, o.x));
              g.fillText(o.p.n, lx, top - 26); g.font = FONT2; g.fillText(s.fmt(o.p.v) + " Plätze", lx, top - 5);
            });
            info.textContent = `${s.fmt(Math.round(lo))} bis ${s.fmt(Math.round(hi))} · großer Strich: ${s.fmt(major)}`;
          }
          function zoomTo(i) {
            lev = Math.max(0, Math.min(levels.length - 1, i));
            const [lo1, hi1] = levels[lev], w0 = view.hi - view.lo, w1 = hi1 - lo1;
            const f0 = (target - view.lo) / w0, f1 = (target - lo1) / w1;
            s.sfx.whoosh();
            return s.tween({ from: 0, to: 1, dur: 1100, update: t => { const w = Math.exp(Math.log(w0) + (Math.log(w1) - Math.log(w0)) * t), f = f0 + (f1 - f0) * t; view.lo = target - f * w; view.hi = view.lo + w; draw(); } })
              .then(() => { view.lo = lo1; view.hi = hi1; draw(); });
          }
          draw();
          const bOut = s.h("button", { class: "btn", onclick: () => zoomTo(lev - 1) }, "− Herauszoomen");
          const bIn = s.h("button", { class: "btn solid", onclick: () => zoomTo(lev + 1) }, "+ Hineinzoomen");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Links die kleineren, rechts die größeren Zahlen. Zwischen zwei Strichen ist immer ", s.h("b", null, "gleich viel"), ".");
          const lf = life(s, { class: "life later" }, s.h("p", { class: "small" }, "Wie bei einer Karten-App: erst ganz Berlin, dann dein Kiez, dann deine Straße. Je näher, desto feiner die Striche."));
          s.add(root(s, "stack", { justifyContent: "space-between" }, s.h("p", { class: "h2 a-up" }, "Wo liegen die Stadien? ", s.h("span", { class: "pencil", style: { font: "400 22px var(--f-body)" } }, "Zahl der Plätze auf dem Zahlenstrahl")), s.h("div", { class: "a-fade" }, canvas), s.h("div", { class: "row", style: { flexWrap: "nowrap" } }, bOut, info, bIn), s.h("div", { class: "cols" }, merk, lf)));
          s.sfx.pop();
          s.step(async () => { await zoomTo(1); s.sfx.ding(); s.say("Von null bis hunderttausend. Jetzt sieht man drei Stadien."); });
          s.step(async () => { await zoomTo(3); s.sfx.ding(); s.say("Von dreiundsiebzigtausend bis vierundsiebzigtausend. Ein Strich ist hundert."); });
          s.step(async () => { await zoomTo(4); s.sfx.ding(); s.show(merk, "up"); await s.show(lf, "up", 150); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Vergleichen und Ordnen",
        say: "Welche Zahl ist größer? Wir vergleichen Stelle für Stelle von links.",
        build(s) {
          const svg = s.svg(480, 262);
          const heads = ["ZT", "T", "H", "Z", "E"], A = "73877", B = "75024";
          const X = i => 190 + i * 60;
          const hl = s.el("rect", { x: X(0) - 27, y: 42, width: 54, height: 160, rx: 10, fill: "#fff1a8", opacity: 0 });
          svg.append(hl);
          heads.forEach((h, i) => svg.append(T(s, X(i), 30, h, { "font-size": 19, fill: P.pencil })));
          svg.append(T(s, 8, 86, "Olympiastadion", { "font-size": 19, "text-anchor": "start", "font-weight": 600 }), T(s, 8, 184, "Allianz Arena", { "font-size": 19, "text-anchor": "start", "font-weight": 600 }));
          A.split("").forEach((d, i) => svg.append(T(s, X(i), 86, d, { "font-size": 40 })));
          B.split("").forEach((d, i) => svg.append(T(s, X(i), 184, d, { "font-size": 40 })));
          const sym = [later(fb(T(s, X(0), 128, "=", { "font-size": 22, fill: P.green }))), later(fb(T(s, X(1), 128, "<", { "font-size": 22, fill: P.red })))];
          svg.append(...sym);
          const result = later(fb(T(s, 240, 248, "73.877 < 75.024", { "font-size": 32, fill: P.red })));
          svg.append(result);
          const ex2 = s.h("p", { class: "t later" }, "Fernsehturm ", s.h("b", null, "368 m"), " < Zugspitze ", s.h("b", null, "2.962 m"), " – weniger Stellen, kleinere Zahl.");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Erst die Stellen zählen. Gleich viele? Dann von links Ziffer für Ziffer vergleichen. Die Spitze von ", s.h("b", null, "<"), " zeigt zur kleineren Zahl.");
          const left = ex(s, "Beispiel: Stadien", { class: "ex a-left", style: { display: "flex", flexDirection: "column", gap: "10px" } }, svg, ex2);
          // towers
          const tw = s.svg(480, 430);
          const towers = [{ n: "Fernsehturm", h: 368, c: P.red }, { n: "Berliner Dom", h: 98, c: P.violet }, { n: "Eiffelturm", h: 330, c: P.orange }, { n: "Kölner Dom", h: 157, c: P.green }];
          const slot = i => 60 + i * 120, BASE = 376, K = 0.86;
          tw.append(s.el("line", { x1: 4, x2: 476, y1: BASE, y2: BASE, stroke: P.ink, "stroke-width": 3 }));
          towers.forEach((t, i) => {
            const outer = s.el("g", { transform: `translate(${slot(i)},0)` });
            const inner = s.el("g", { class: "a-up", style: { "--d": i * 120 + "ms" } });
            const hgt = t.h * K;
            inner.append(s.el("rect", { x: -26, y: BASE - hgt, width: 52, height: hgt, rx: 6, fill: t.c, opacity: .85 }));
            if (t.n === "Fernsehturm") inner.append(s.el("circle", { cx: 0, cy: BASE - hgt * 0.62, r: 22, fill: t.c }));
            inner.append(T(s, 0, BASE - hgt - 10, t.h + " m", { "font-size": 21 }), T(s, 0, BASE + 30, t.n, { "font-size": 19, "font-weight": 600 }));
            outer.append(inner); tw.append(outer); t.g = outer; t.pos = i;
          });
          const order = s.h("p", { class: "h2 mono later", style: { textAlign: "center" } }, "98 < 157 < 330 < 368");
          const right = ex(s, "Beispiel: Türme ordnen", { class: "ex a-right", style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" } }, tw, order);
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }, s.h("div", { class: "stack" }, left, merk), right));
          s.sfx.pop();
          s.step(async () => {
            hl.setAttribute("opacity", 1); s.sfx.tick(); await s.wait(500);
            s.show(sym[0], "pop"); s.sfx.note(0); await s.wait(700);
            await s.tween({ from: X(0) - 27, to: X(1) - 27, dur: 400, update: v => hl.setAttribute("x", v) });
            s.show(sym[1], "pop"); s.sfx.note(4); await s.wait(600);
            s.sfx.ding(); await s.show(result, "zoom"); s.say("Die Tausender-Ziffer entscheidet: vier ist kleiner als fünf.");
          });
          s.step(async () => { s.sfx.pop(); await s.show(ex2, "up"); s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => {
            const sorted = [...towers].sort((a, b) => a.h - b.h);
            s.sfx.whoosh();
            await Promise.all(sorted.map((t, ni) => { const x0 = slot(t.pos), x1 = slot(ni); t.pos = ni; return s.tween({ from: 0, to: 1, dur: 900, update: k => t.g.setAttribute("transform", `translate(${x0 + (x1 - x0) * k},${-40 * Math.sin(Math.PI * k)})`) }); }));
            s.sfx.success(); await s.show(order, "up"); s.say("Der Größe nach geordnet: hundertsechzehn, hundertsiebenundfünfzig, dreihundertdreißig, dreihundertachtundsechzig Meter.");
          });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Runden",
        say: "Beim Runden schauen wir auf die Ziffer rechts neben der Rundungsstelle.",
        build(s) {
          let v = 73877, unit = 1000;
          const numEl = s.h("p", { class: "huge mono", style: { minWidth: "330px", lineHeight: "1.25" } });
          const modes = [[10, "Zehner"], [100, "Hunderter"], [1000, "Tausender"]];
          const btns = modes.map(([u, n]) => s.h("button", { class: "btn", onclick: () => { setMode(u); s.sfx.click(); } }, "auf " + n));
          const svg = s.svg(1100, 168);
          const L = 80, R = 1020, AY = 100;
          const regL = s.el("rect", { x: L, y: 18, width: (R - L) / 2, height: AY - 18, fill: "#dbe6fb", rx: 6 });
          const regR = s.el("rect", { x: (L + R) / 2, y: 18, width: (R - L) / 2, height: AY - 18, fill: "#fde4cc", rx: 6 });
          svg.append(regL, regR, T(s, (3 * L + R) / 4, 44, "← abrunden", { "font-size": 21, fill: P.blue }), T(s, (L + 3 * R) / 4, 44, "aufrunden →", { "font-size": 21, fill: P.orange }));
          svg.append(s.el("line", { x1: L - 20, x2: R + 20, y1: AY, y2: AY, stroke: P.ink, "stroke-width": 3 }));
          for (let i = 0; i <= 10; i++) svg.append(s.el("line", { x1: L + (i * (R - L)) / 10, x2: L + (i * (R - L)) / 10, y1: AY - (i % 5 ? 7 : 14), y2: AY + (i % 5 ? 7 : 14), stroke: i === 5 ? P.red : P.ink, "stroke-width": i % 5 ? 2 : 3 }));
          const lab = [T(s, L, 152, ""), T(s, (L + R) / 2, 152, "", { fill: P.red }), T(s, R, 152, "")];
          svg.append(...lab);
          const endDot = s.el("circle", { cx: L, cy: AY, r: 15, fill: "none", stroke: P.green, "stroke-width": 5 });
          const arrow = s.el("g", { class: "later" });
          const arLine = s.el("line", { x1: 0, x2: 0, y1: AY + 22, y2: AY + 22, stroke: P.green, "stroke-width": 5, "stroke-linecap": "round" });
          const arHead = s.el("polygon", { points: "", fill: P.green });
          arrow.append(arLine, arHead, endDot);
          const marker = s.el("polygon", { points: "", fill: P.red });
          const mLab = T(s, 0, 80, "", { "font-size": 22, fill: P.red });
          svg.append(arrow, marker, mLab);
          const result = s.h("p", { class: "h2 mono later", style: { minWidth: "430px", textAlign: "right" } });
          function update() {
            const lo = Math.floor(v / unit) * unit, hi = lo + unit, r = v - lo >= unit / 2 ? hi : lo;
            const X = x => L + ((x - lo) / unit) * (R - L);
            lab[0].textContent = s.fmt(lo); lab[1].textContent = s.fmt(lo + unit / 2); lab[2].textContent = s.fmt(hi);
            const mx = X(v);
            marker.setAttribute("points", `${mx - 11},${AY - 26} ${mx + 11},${AY - 26} ${mx},${AY - 6}`);
            mLab.setAttribute("x", Math.max(L + 10, Math.min(R - 10, mx))); mLab.textContent = s.fmt(v);
            const ex2 = X(r);
            endDot.setAttribute("cx", ex2);
            arLine.setAttribute("x1", mx); arLine.setAttribute("x2", ex2 + (ex2 > mx ? -14 : 14));
            const dir = ex2 >= mx ? 1 : -1;
            arHead.setAttribute("points", Math.abs(ex2 - mx) < 2 ? "" : `${ex2 - dir * 4},${AY + 22} ${ex2 - dir * 18},${AY + 13} ${ex2 - dir * 18},${AY + 31}`);
            // number with deciding digit marked
            const str = s.fmt(v); numEl.innerHTML = "";
            const k = Math.round(Math.log10(unit)); let pos = 0;
            const chars = str.split("").reverse().map(ch => { if (ch === ".") return { ch }; return { ch, p: pos++ }; }).reverse();
            chars.forEach(c => {
              const st = c.p === k - 1 ? { color: P.red, background: "#fff1a8", borderRadius: "8px" } : c.p === k ? { color: P.blue, textDecoration: "underline", textDecorationThickness: "5px" } : c.p != null && c.p < k - 1 ? { color: "#9aa3b2" } : {};
              numEl.append(sp(s, c.ch, st.color || P.ink, st));
            });
            const d = Math.floor(v / (unit / 10)) % 10;
            result.innerHTML = "";
            result.append(s.fmt(v) + " ≈ ", s.h("span", { class: "blue" }, s.fmt(r)), s.h("span", { class: "pencil", style: { font: "400 22px var(--f-body)" } }, d >= 5 ? `  (${d} → auf)` : `  (${d} → ab)`));
            btns.forEach((b, i) => b.classList.toggle("solid", modes[i][0] === unit));
          }
          function setMode(u) { unit = u; update(); s.sfx.whoosh(); }
          const sl = s.slider({ label: "Zahl verschieben", min: 73000, max: 74000, step: 1, value: v, onInput: x => { v = x; update(); } });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Ziffer rechts neben der Rundungsstelle: ", s.h("b", { class: "blue" }, "0, 1, 2, 3, 4 → abrunden"), ", ", s.h("b", { class: "orange" }, "5, 6, 7, 8, 9 → aufrunden"), ". Zeichen ≈ heißt „ungefähr“.");
          const lf = life(s, { class: "life later" }, s.h("p", { class: "small" }, "Berlin: 3.897.145 ≈ 3.900.000 Einwohner · Fernsehturm: 368 m ≈ 370 m · Fahrrad für 289 € ≈ 300 €"));
          update();
          s.add(root(s, "stack", { justifyContent: "space-between", gap: "10px" },
            s.h("div", { class: "row", style: { flexWrap: "nowrap", justifyContent: "space-between" } }, numEl, s.h("div", { class: "row", style: { gap: "10px" } }, ...btns)),
            s.h("div", { class: "a-fade" }, svg),
            s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "28px" } }, s.h("div", { style: { flex: 1 } }, sl), result),
            s.h("div", { class: "cols", style: { gap: "20px" } }, merk, lf)));
          s.sfx.pop();
          s.step(async () => { s.sfx.zap(); s.show(arrow, "fade"); await s.show(result, "up"); s.say("Die Hunderter-Ziffer ist vier. Also abrunden: vierundsiebzigtausend."); });
          s.step(async () => { setMode(100); s.sfx.ding(); s.say("Auf Hunderter gerundet: die Zehner-Ziffer ist sieben, also aufrunden auf vierundsiebzigtausendfünfhundert."); });
          s.step(async () => { s.sfx.ding(); s.show(merk, "up"); await s.show(lf, "up", 150); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Klug schätzen",
        say: "Wie viele Menschen passen ins Olympiastadion? Zählen dauert zu lange. Wir schätzen!",
        build(s) {
          const SW = 500, SH = 470, cx = 250, cy = 235;
          const { canvas, g } = s.canvas(SW, SH);
          const rings = [{ n: 34, a: [138, 90], b: [180, 128] }, { n: 40, a: [186, 134], b: [240, 186] }];
          let lit = 0; const picked = 34 + 30;
          function draw() {
            g.clearRect(0, 0, SW, SH);
            g.fillStyle = "#e8ecef"; g.beginPath(); g.ellipse(cx, cy, 246, 192, 0, 0, Math.PI * 2); g.fill();
            let k = 0;
            rings.forEach(r => {
              for (let i = 0; i < r.n; i++, k++) {
                const a0 = (i / r.n) * Math.PI * 2 + 0.012, a1 = ((i + 1) / r.n) * Math.PI * 2 - 0.012;
                g.beginPath(); g.ellipse(cx, cy, r.b[0], r.b[1], 0, a0, a1); g.ellipse(cx, cy, r.a[0], r.a[1], 0, a1, a0, true); g.closePath();
                g.fillStyle = k === picked && lit === 0 ? P.orange : k < lit ? (k === picked ? P.orange : "#6f93dc") : "#c4ccd8"; g.fill();
              }
            });
            g.fillStyle = "#3f9a5c"; g.beginPath(); g.ellipse(cx, cy, 128, 80, 0, 0, Math.PI * 2); g.fill();
            g.strokeStyle = "#e9f6ec"; g.lineWidth = 2.5; g.strokeRect(cx - 95, cy - 55, 190, 110);
            g.beginPath(); g.moveTo(cx, cy - 55); g.lineTo(cx, cy + 55); g.stroke(); g.beginPath(); g.arc(cx, cy, 20, 0, Math.PI * 2); g.stroke();
          }
          draw();
          const dots = s.canvas(400, 120);
          (function () { let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280; const cs = ["#1d5bd0", "#dc3b2a", "#ee7a1a", "#138a5a", "#7b4fd6", "#5d6678"]; for (let r = 0; r < 20; r++) for (let c = 0; c < 50; c++) { dots.g.fillStyle = cs[Math.floor(rnd() * cs.length)]; dots.g.beginPath(); dots.g.arc(4 + c * 8, 3 + r * 6, 2.3, 0, Math.PI * 2); dots.g.fill(); } })();
          const intro = s.h("p", { class: "t a-up" }, "Alle Plätze einzeln zählen? Viel zu lang! Wir zählen einen kleinen Teil und rechnen hoch.");
          const c1 = ex(s, "1. Einen Block anschauen", { class: "ex later" }, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "14px" } }, dots.canvas, s.h("p", { class: "t" }, s.h("b", { class: "orange" }, "1 Block"), " ≈ 1.000 Plätze")));
          const cnt = s.h("b", { class: "blue mono" }, "0");
          const c2 = s.h("p", { class: "h2 later" }, "2. Blöcke zählen: ", cnt);
          const c3 = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, s.h("b", null, "74 · 1.000 = 74.000"), " Plätze geschätzt. Echt sind es 73.877 – super nah dran!");
          const lf = life(s, { class: "life later" }, s.h("p", { class: "small" }, "🍬 Gummibärchen im Glas: eine Schicht zählen · Schichten. 📚 Bücher im Regal: ein Brett zählen · Bretter. 🌳 Bäume im Park: ein Feld zählen."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "500px 1fr", gap: "26px", alignItems: "center" }, s.h("div", { class: "a-zoom" }, canvas), s.h("div", { class: "stack", style: { gap: "14px" } }, intro, c1, c2, c3, lf)));
          s.sfx.whoosh();
          s.step(async () => { s.sfx.pop(); await s.show(c1, "left"); s.say("In einem Block sitzen ungefähr tausend Menschen."); });
          s.step(async () => {
            await s.show(c2, "up");
            let last = -1;
            await s.tween({ from: 0, to: 74, dur: 2600, ease: "inOut", update: x => { lit = Math.round(x); if (lit !== last) { last = lit; cnt.textContent = lit; draw(); if (lit % 2 === 0) s.sfx.tick(); } } });
            lit = 74; cnt.textContent = "74"; draw(); s.sfx.ding();
          });
          s.step(async () => { s.sfx.success(); await s.show(c3, "zoom"); s.say("Vierundsiebzig mal tausend ist vierundsiebzigtausend. Fast genau richtig!"); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Die vier Rechenarten",
        say: "Jede Rechenart hat eigene Namen für ihre Zahlen. Die lernen wir jetzt.",
        build(s) {
          const col = (num, lab, c, labs) => { const l = s.h("span", { class: "later", style: { font: "700 19px/1.1 var(--f-body)", color: c } }, lab); labs.push(l); return s.h("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" } }, s.h("span", { style: { font: "700 36px/1 var(--f-display)", color: c } }, num), l); };
          const op = o => s.h("span", { style: { font: "700 36px/1 var(--f-display)", color: P.pencil } }, o);
          const mk = (label, ctx, vis, eq, first) => {
            const labs = [];
            const row = s.h("div", { class: "row", style: { justifyContent: "center", alignItems: "flex-start", gap: "12px", flexWrap: "nowrap" } }, ...eq(labs));
            const c = ex(s, label, { class: "ex" + (first ? " a-up" : " later"), style: { display: "flex", flexDirection: "column", gap: "8px" } }, s.h("p", { class: "small" }, ctx), vis, row);
            c.labs = labs; return c;
          };
          // visuals
          const vAdd = s.svg(470, 90);
          vAdd.append(s.el("rect", { x: 3, y: 6, width: 300, height: 36, rx: 6, fill: P.blue }), T(s, 153, 32, "15 €", { fill: "#fff", "font-size": 20 }),
            s.el("rect", { x: 307, y: 6, width: 160, height: 36, rx: 6, fill: P.green }), T(s, 387, 32, "8 €", { fill: "#fff", "font-size": 20 }),
            s.el("path", { d: "M3,50 v8 h464 v-8", fill: "none", stroke: P.ink, "stroke-width": 2.5 }), T(s, 235, 82, "23 €", { "font-size": 20, fill: P.red }));
          const vSub = s.svg(470, 90);
          vSub.append(s.el("rect", { x: 3, y: 6, width: 244, height: 36, rx: 6, fill: "#9aa3b2" }), T(s, 125, 32, "203 m", { fill: "#fff", "font-size": 20 }),
            s.el("rect", { x: 249, y: 6, width: 198, height: 36, rx: 6, fill: P.red }), T(s, 348, 32, "165 m", { fill: "#fff", "font-size": 20 }),
            s.el("path", { d: "M3,50 v8 h444 v-8", fill: "none", stroke: P.ink, "stroke-width": 2.5 }), T(s, 225, 82, "368 m ganzer Turm", { "font-size": 19, fill: P.ink }));
          const vMul = s.svg(470, 82);
          for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) vMul.append(s.el("rect", { x: 140 + c * 27, y: 4 + r * 19, width: 20, height: 15, rx: 4, fill: r % 2 ? P.violet : "#a98ce6" }));
          const vDiv = s.svg(470, 82);
          const gc = [P.blue, P.red, P.green, P.orange];
          for (let gI = 0; gI < 4; gI++) { const x0 = 6 + gI * 116; vDiv.append(s.el("rect", { x: x0, y: 6, width: 108, height: 34, rx: 10, fill: "none", stroke: gc[gI], "stroke-width": 2.5 })); for (let i = 0; i < 7; i++) vDiv.append(s.el("circle", { cx: x0 + 9 + i * 15, cy: 23, r: 6, fill: gc[gI] })); vDiv.append(T(s, x0 + 54, 72, "7 Kinder", { "font-size": 19, fill: gc[gI] })); }
          const cards = [
            mk("Addition · plus", "Taschengeld: 15 € gespart, Oma schenkt 8 € dazu.", vAdd, l => [col("15", "Summand", P.blue, l), op("+"), col("8", "Summand", P.green, l), op("="), col("23", "Summe", P.red, l)], true),
            mk("Subtraktion · minus", "Fernsehturm 368 m. Die Aussichtsetage ist auf 203 m. Was ist darüber?", vSub, l => [col("368", "Minuend", P.ink, l), op("−"), col("203", "Subtrahend", P.pencil, l), op("="), col("165", "Differenz", P.red, l)]),
            mk("Multiplikation · mal", "Orchesterprobe: 4 Reihen mit je 7 Stühlen.", vMul, l => [col("4", "Faktor", P.violet, l), op("·"), col("7", "Faktor", P.violet, l), op("="), col("28", "Produkt", P.red, l)]),
            mk("Division · geteilt", "28 Kinder der 5a bilden 4 gleich große Gruppen.", vDiv, l => [col("28", "Dividend", P.ink, l), op(":"), col("4", "Divisor", P.blue, l), op("="), col("7", "Quotient", P.red, l)]),
          ];
          s.add(root(s, "cols", { gridTemplateRows: "1fr 1fr", gap: "16px 22px" }, ...cards));
          s.sfx.pop();
          cards.forEach((c, i) => s.step(async () => {
            if (i) { s.sfx.pop(); await s.show(c, i % 2 ? "right" : "left"); }
            for (let k = 0; k < c.labs.length; k++) { s.show(c.labs[k], "up"); s.sfx.count(k * 2 + i); await s.wait(260); }
            s.say(["Summand plus Summand gleich Summe.", "Minuend minus Subtrahend gleich Differenz.", "Faktor mal Faktor gleich Produkt.", "Dividend geteilt durch Divisor gleich Quotient."][i]);
          }));
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Schriftlich plus und minus",
        say: "Schriftlich rechnen wir von rechts nach links, Stelle für Stelle, mit Übertrag.",
        build(s) {
          const add = calcBox(s, { cols: 5, rows: [[null, 4, 5, 8, 7], ["+", 2, 7, 4, 9]], res: [null, 7, 3, 3, 6], steps: [
            { c: 4, t: "Einer: 7 + 9 = 16 → schreibe 6, merke 1", carry: [3, 1] },
            { c: 3, t: "Zehner: 8 + 4 + 1 = 13 → schreibe 3, merke 1", carry: [2, 1] },
            { c: 2, t: "Hunderter: 5 + 7 + 1 = 13 → schreibe 3, merke 1", carry: [1, 1] },
            { c: 1, t: "Tausender: 4 + 2 + 1 = 7 → Ergebnis 7.336" }] });
          const sub = calcBox(s, { cols: 5, rows: [[null, 5, 0, 3, 2], ["−", 1, 8, 4, 7]], res: [null, 3, 1, 8, 5], steps: [
            { c: 4, t: "Einer: 7 + ? = 12 → 7 + 5 = 12. Schreibe 5, Übertrag 1", carry: [3, 1] },
            { c: 3, t: "Zehner: 4 + 1 = 5, 5 + 8 = 13. Schreibe 8, Übertrag 1", carry: [2, 1] },
            { c: 2, t: "Hunderter: 8 + 1 = 9, 9 + 1 = 10. Schreibe 1, Übertrag 1", carry: [1, 1] },
            { c: 1, t: "Tausender: 1 + 1 = 2, 2 + 3 = 5 → Ergebnis 3.185" }] });
          const mkCard = (label, ctx, calc, first) => {
            const expl = s.h("p", { class: "t", style: { minHeight: "68px", fontSize: "22px", color: P.blue } }, "Drücke „Weiter“ – wir rechnen von rechts.");
            const btn = s.h("button", { class: "btn", onclick: () => { s.sfx.click(); calc.run(expl); } }, "↻ nochmal");
            const c = ex(s, label, { class: "ex " + (first ? "a-left" : "a-right"), style: { display: "flex", flexDirection: "column", gap: "8px" } },
              s.h("p", { class: "small" }, ctx), s.h("div", { class: "row", style: { flexWrap: "nowrap", justifyContent: "space-between", alignItems: "flex-end" } }, calc.svg, btn), expl);
            c.expl = expl; return c;
          };
          const cA = mkCard("Schriftlich addieren", "Fußballturnier: Samstag 4.587 Zuschauer, Sonntag 2.749. Wie viele zusammen?", add, true);
          const cS = mkCard("Schriftlich subtrahieren (Ergänzen)", "Ziel: 5.032 Schritte am Tag. Geschafft: 1.847. Wie viele fehlen noch?", sub);
          const lf = life(s, { class: "life later" }, s.h("p", { class: "small" }, "Kassenzettel zusammenzählen · Kilometer der Klassenfahrt: 1.250 km − 487 km · Punkte im Spiel addieren. Wichtig: Stellen genau untereinander!"));
          s.add(root(s, "stack", { justifyContent: "space-between" }, s.h("div", { class: "cols", style: { gap: "22px" } }, cA, cS), lf));
          s.sfx.pop();
          s.step(async () => { s.say("Wir addieren von rechts nach links."); await add.run(cA.expl); });
          s.step(async () => { s.say("Beim Minus ergänzen wir von unten nach oben."); await sub.run(cS.expl); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Schriftlich malnehmen",
        say: "Der Fernsehturm hat 986 Stufen. Ein Hausmeister läuft sie zwölfmal hoch. Wie viele Stufen sind das?",
        build(s) {
          const C = 54, svg = s.svg(6 * C + 24, 300), cx = i => 12 + C * i + C / 2;
          svg.setAttribute("width", (6 * C + 24) * 1.08); svg.setAttribute("height", 300 * 1.08);
          const hl = s.el("rect", { x: cx(4) - C / 2 + 3, y: 18, width: C - 6, height: 50, rx: 10, fill: "#fff1a8", opacity: 0 });
          svg.append(hl);
          "986·12".split("").forEach((d, i) => svg.append(T(s, cx(i), 56, d, { "font-size": 44, fill: d === "·" ? P.red : P.ink })));
          svg.append(s.el("line", { x1: 6, x2: 6 * C + 18, y1: 72, y2: 72, stroke: P.ink, "stroke-width": 3 }));
          const D = (i, y, d, c) => later(fb(T(s, cx(i), y, String(d), { "font-size": 44, fill: c || P.blue })));
          const p1 = [[4, 6], [3, 8], [2, 9]].map(([i, d]) => D(i, 124, d, P.violet));
          const p2 = [[5, 2], [4, 7], [3, 9], [2, 1]].map(([i, d]) => D(i, 180, d, P.orange));
          const carries = [[3, 1], [2, 1], [1, 1]].map(([i, d]) => later(fb(T(s, cx(i) + 10, 214, String(d), { "font-size": 22, fill: P.red }))));
          const line2 = later(s.el("line", { x1: 6, x2: 6 * C + 18, y1: 228, y2: 228, stroke: P.ink, "stroke-width": 3 }));
          const rs = [[5, 2], [4, 3], [3, 8], [2, 1], [1, 1]].map(([i, d]) => D(i, 282, d, P.blue));
          svg.append(...p1, ...p2, ...carries, line2, ...rs);
          const exp = (n, txt, c) => s.h("div", { class: "row later", style: { flexWrap: "nowrap", gap: "14px", alignItems: "flex-start" } }, s.h("span", { style: { flex: "none", width: "40px", height: "40px", borderRadius: "50%", background: c, color: "#fff", display: "grid", placeItems: "center", font: "700 22px/1 var(--f-display)" } }, n), s.h("p", { class: "t" }, ...txt));
          const e1 = exp("1", ["986 · ", s.h("b", null, "1"), " Zehner = 9.860. Die 0 lassen wir weg – das Ergebnis rutscht eine Stelle nach links."], P.violet);
          const e2 = exp("2", ["986 · ", s.h("b", null, "2"), " = 1.972 (6 · 2 = 12, schreibe 2, merke 1 …)"], P.orange);
          const e3 = exp("3", ["Beide Zeilen zusammenzählen: ", s.h("b", { class: "blue" }, "11.832 Stufen"), "!"], P.blue);
          const e4 = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, s.h("b", null, "Überschlag:"), " 1.000 · 12 = 12.000. Unser Ergebnis 11.832 liegt nah dran – passt!");
          const lf = life(s, { class: "life later" }, s.h("p", { class: "small" }, "Klassenfahrt: 28 Kinder · 245 € = 6.860 €. Ein Jahr: 365 Tage · 24 Stunden = 8.760 Stunden."));
          const left = ex(s, "Beispiel: Fernsehturm-Treppe", { class: "ex a-left", style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" } }, s.h("p", { class: "small" }, "986 Stufen, 12-mal hoch"), svg);
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "400px 1fr", gap: "26px", alignItems: "center" }, left, s.h("div", { class: "stack", style: { gap: "14px" } }, e1, e2, e3, e4, lf)));
          s.sfx.pop();
          const hlTo = async i => { hl.setAttribute("opacity", 1); await s.tween({ from: Number(hl.getAttribute("x")), to: cx(i) - C / 2 + 3, dur: 300, update: v => hl.setAttribute("x", v) }); };
          s.step(async () => { await hlTo(4); s.show(e1, "left"); for (const d of p1) { await s.wait(400); s.show(d, "pop"); s.sfx.count(2); } s.say("Erst mal eins, das ist ein Zehner. Das Ergebnis endet unter der Eins."); });
          s.step(async () => { await hlTo(5); s.show(e2, "left"); for (let i = 0; i < p2.length; i++) { await s.wait(420); s.show(p2[i], "pop"); s.sfx.count(i + 3); } s.say("Dann mal zwei. Das Ergebnis endet unter der Zwei."); });
          s.step(async () => {
            hl.setAttribute("opacity", 0); s.show(line2, "draw"); s.show(e3, "left");
            for (let i = 0; i < rs.length; i++) { await s.wait(450); s.show(rs[i], "pop"); s.sfx.count(i + 5); if (i >= 1 && i <= 3) s.show(carries[i - 1], "down"); }
            s.sfx.success(); s.say("Elftausendachthundertzweiunddreißig Stufen!");
          });
          s.step(async () => { s.sfx.ding(); await s.show(e4, "up"); s.show(lf, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Punkt vor Strich",
        say: "Erst die Klammern, dann Punkt-Rechnung, dann Strich-Rechnung.",
        build(s) {
          const rule = (n, sym, txt, c, d) => s.h("div", { class: "card a-up", style: { "--d": d + "ms", display: "flex", alignItems: "center", gap: "16px", padding: "12px 18px" } },
            s.h("span", { style: { width: "46px", height: "46px", flex: "none", borderRadius: "50%", background: c, color: "#fff", display: "grid", placeItems: "center", font: "800 26px/1 var(--f-display)" } }, n),
            s.h("span", { style: { font: "800 34px/1 var(--f-display)", color: c } }, sym), s.h("span", { class: "t" }, txt));
          const rules = s.h("div", { class: "cols3", style: { gap: "18px" } }, rule("1", "( )", "Klammern", P.violet, 0), rule("2", "· :", "Punkt", P.red, 150), rule("3", "+ −", "Strich", P.blue, 300));
          const mk = (label, ctx, parts, l1, l2) => {
            const first = s.h("span", { style: { borderRadius: "6px", padding: "0 3px" } }, parts[1]);
            const L0 = s.h("p", { class: "h2 mono" }, parts[0], first, parts[2]);
            const L1 = s.h("p", { class: "h2 mono later" }, ...l1);
            const L2 = s.h("p", { class: "h2 mono later red" }, l2);
            const c = ex(s, label, { class: "ex later", style: { display: "flex", flexDirection: "column", gap: "10px" } }, s.h("p", { class: "small", style: { minHeight: "80px" } }, ctx), L0, L1, L2);
            c.run = async () => {
              await s.show(c, "up"); s.sfx.pop(); await s.wait(300);
              first.style.background = "var(--yellow)"; s.sfx.scribble(); await s.wait(500);
              await s.show(L1, "left"); s.sfx.count(3); await s.wait(300);
              await s.show(L2, "pop"); s.sfx.ding();
            };
            return c;
          };
          const cards = [
            mk("Beispiel 1: Kino", "Eine Erwachsenen-Karte 7 € und 4 Kinder-Karten zu je 5 €.", ["7 + ", "4 · 5", ""], ["= 7 + ", s.h("b", null, "20")], "= 27 €"),
            mk("Beispiel 2: Schulweg", "3 Tage lang: hin 12 min und zurück 8 min.", ["", "(12 + 8)", " · 3"], ["= ", s.h("b", null, "20"), " · 3"], "= 60 min"),
            mk("Beispiel 3: Taschengeld", "Du hast 20 € und kaufst 2 Hefte zu je 3 €.", ["20 − ", "2 · 3", ""], ["= 20 − ", s.h("b", null, "6")], "= 14 €"),
          ];
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Ohne Klammern wäre 12 + 8 · 3 = 12 + 24 = 36 – das passt nicht zur Geschichte! Klammern sagen: ", s.h("b", null, "Das zuerst!"));
          s.add(root(s, "stack", { justifyContent: "center", gap: "26px" }, rules, s.h("div", { class: "cols3", style: { gap: "18px" } }, ...cards), merk));
          s.sfx.whoosh(); [0, 1, 2].forEach(i => setTimeout(() => s.alive && s.sfx.count(i * 2), 150 * i));
          cards.forEach((c, i) => s.step(async () => { await c.run(); s.say(["Punkt vor Strich: erst vier mal fünf.", "Klammern zuerst: zwölf plus acht.", "Erst zwei mal drei, dann minus."][i]); }));
          s.step(async () => { s.sfx.boing(); await s.show(merk, "up"); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Tauschen und Verbinden",
        say: "Bei Plus und Mal darf man tauschen und Klammern verschieben. Das macht Rechnen leichter.",
        build(s) {
          const svg = s.svg(400, 420);
          const rot = s.el("g", { transform: "rotate(0 200 190)" });
          const seats = s.el("g", { class: "a-zoom", style: { transformBox: "fill-box", transformOrigin: "center" } });
          for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) {
            const x = 200 - 140 + c * 56 + 6, y = 190 - 84 + r * 56 + 6;
            seats.append(s.el("rect", { x, y, width: 44, height: 44, rx: 9, fill: ["#1d5bd0", "#7b4fd6", "#138a5a"][r] }), s.el("rect", { x: x + 5, y: y + 4, width: 34, height: 9, rx: 4, fill: "#fff", opacity: .55 }));
          }
          rot.append(seats); svg.append(rot);
          const cap = T(s, 200, 400, "3 Reihen · 5 Stühle = 15", { "font-size": 24 });
          svg.append(cap);
          let ang = 0, turning = false;
          async function turn() {
            if (turning) return; turning = true; s.sfx.whoosh();
            const a0 = ang, a1 = ang === 0 ? 90 : 0;
            await s.tween({ from: a0, to: a1, dur: 900, ease: "back", update: a => rot.setAttribute("transform", `rotate(${a} 200 190)`) });
            ang = a1; cap.textContent = ang ? "5 Reihen · 3 Stühle = 15" : "3 Reihen · 5 Stühle = 15"; s.sfx.ding(); turning = false;
          }
          const tbtn = s.h("button", { class: "btn later", onclick: () => { s.sfx.click(); turn(); } }, "↻ Drehen");
          const card = (label, ...kids) => ex(s, label, { class: "ex later", style: { padding: "12px 18px" } }, ...kids);
          const c1 = card("Tauschgesetz (Kommutativgesetz)", s.h("p", { class: "t" }, s.h("b", null, "a + b = b + a"), " und ", s.h("b", null, "a · b = b · a")), s.h("p", { class: "t blue mono" }, "18 + 37 + 2 = 18 + 2 + 37 = 20 + 37 = 57"));
          const c2 = card("Verbindungsgesetz (Assoziativgesetz)", s.h("p", { class: "t" }, s.h("b", null, "(a + b) + c = a + (b + c)")), s.h("p", { class: "t blue mono" }, "(17 + 25) + 75 = 17 + (25 + 75) = 117"));
          const tk = (t, c) => s.h("span", { style: { display: "inline-block", color: c || P.ink } }, t);
          const a17 = tk("17", P.red), a4 = tk("4", P.green);
          const dot = () => s.h("span", { style: { display: "inline-block", margin: "0 10px", color: P.pencil } }, "·");
          const swapRow = s.h("p", { class: "h2 mono" }, tk("25"), dot(), a17, dot(), a4);
          const res = s.h("p", { class: "t mono later" }, "= ", s.h("b", null, "(25 · 4)"), " · 17 = 100 · 17 = ", s.h("b", { class: "red" }, "1.700"));
          const res2 = s.h("p", { class: "small mono later" }, "Genauso: 5 · 19 · 2 = (5 · 2) · 19 = 10 · 19 = 190");
          const c3 = card("Rechenvorteil", s.h("div", { class: "row", style: { flexWrap: "nowrap" } }, swapRow, s.h("span", { class: "small pencil" }, "→ tauschen, damit 100 entsteht")), res, res2);
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Nur bei ", s.h("b", null, "+"), " und ", s.h("b", null, "·"), "! Bei Minus geht es nicht: 8 − 3 = 5, aber 3 − 8 geht nicht.");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "400px 1fr", gap: "24px" },
            s.h("div", { class: "stack", style: { alignItems: "center", gap: "8px" } }, svg, tbtn),
            s.h("div", { class: "stack", style: { gap: "12px" } }, c1, c2, c3, merk)));
          s.sfx.pop();
          s.step(async () => { s.show(tbtn, "pop"); await turn(); s.say("Drei mal fünf ist dasselbe wie fünf mal drei. Gedreht – gleich viele Stühle."); });
          s.step(async () => { s.sfx.pop(); await s.show(c1, "left"); s.say("Tauschgesetz: Zahlen tauschen, damit es leichter wird."); });
          s.step(async () => { s.sfx.pop(); await s.show(c2, "left"); s.say("Verbindungsgesetz: Klammern dorthin, wo es leicht ist."); });
          s.step(async () => {
            await s.show(c3, "left"); await s.wait(300);
            const dx = a4.offsetLeft - a17.offsetLeft; s.sfx.swoosh();
            await s.tween({ from: 0, to: 1, dur: 800, update: k => { a17.style.transform = `translate(${dx * k}px, ${-18 * Math.sin(Math.PI * k)}px)`; a4.style.transform = `translate(${-dx * k}px, ${18 * Math.sin(Math.PI * k)}px)`; } });
            a17.style.transform = a4.style.transform = ""; a17.textContent = "4"; a17.style.color = P.green; a4.textContent = "17"; a4.style.color = P.red;
            s.sfx.snap(); await s.show(res, "up"); s.show(res2, "up"); s.sfx.success(); s.say("Fünfundzwanzig mal vier ist hundert. Hundert mal siebzehn ist tausendsiebenhundert.");
          });
          s.step(async () => { s.sfx.boing(); await s.show(merk, "up"); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Das Verteilungsgesetz",
        say: "Eine schwere Malaufgabe kann man in zwei leichte zerlegen.",
        build(s) {
          const CELL = 24, X0 = 26, Y0 = 44;
          const svg = s.svg(600, 250);
          let a = 20;
          const rects = [];
          for (let r = 0; r < 7; r++) for (let c = 0; c < 23; c++) { const rc = s.el("rect", { x: X0 + c * CELL + 2, y: Y0 + r * CELL + 2, width: CELL - 4, height: CELL - 4, rx: 4, fill: "#9db8ee" }); rects.push([rc, c]); svg.append(rc); }
          svg.append(T(s, 10, Y0 + 3.5 * CELL + 8, "7", { "font-size": 24, "text-anchor": "middle" }));
          const topA = T(s, 0, 32, "", { "font-size": 22, fill: P.blue }), topB = T(s, 0, 32, "", { "font-size": 22, fill: P.orange });
          const botA = T(s, 0, 238, "", { "font-size": 22, fill: P.blue }), botB = T(s, 0, 238, "", { "font-size": 22, fill: P.orange });
          const cut = s.el("line", { x1: 0, x2: 0, y1: Y0 - 4, y2: Y0 + 7 * CELL + 4, stroke: P.red, "stroke-width": 4, "stroke-dasharray": "8 6" });
          const splitG = s.el("g", { class: "later" }); splitG.append(cut, topA, topB, botA, botB); svg.append(splitG);
          const eq1 = s.h("p", { class: "h2 mono later" }), eq2 = s.h("p", { class: "h2 mono later" });
          let split = false;
          function update() {
            const b = 23 - a;
            rects.forEach(([rc, c]) => rc.setAttribute("fill", !split ? "#9db8ee" : c < a ? P.blue : P.orange));
            const xa = X0 + (a * CELL) / 2, xb = X0 + a * CELL + (b * CELL) / 2;
            cut.setAttribute("x1", X0 + a * CELL); cut.setAttribute("x2", X0 + a * CELL);
            topA.setAttribute("x", xa); topA.textContent = a; topB.setAttribute("x", xb); topB.textContent = b;
            botA.setAttribute("x", Math.max(62, xa)); botA.textContent = `7 · ${a} = ${7 * a}`;
            botB.setAttribute("x", Math.min(545, xb)); botB.textContent = `7 · ${b} = ${7 * b}`;
            eq1.innerHTML = ""; eq1.append("7 · 23 = ", sp(s, `7 · ${a}`, P.blue), " + ", sp(s, `7 · ${b}`, P.orange));
            eq2.innerHTML = ""; eq2.append("= ", sp(s, String(7 * a), P.blue), " + ", sp(s, String(7 * b), P.orange), " = ", s.h("b", { class: "red" }, "161"));
          }
          const sl = s.slider({ label: "So teile ich die 23 auf", min: 1, max: 22, value: 20, onInput: v => { a = v; update(); } });
          sl.classList.add("later");
          update();
          const left = ex(s, "Konzert in der Aula", { class: "ex a-left", style: { display: "flex", flexDirection: "column", gap: "6px" } }, s.h("p", { class: "small" }, "7 Reihen mit je 23 Stühlen. Wie viele Plätze?"), svg, sl, eq1, eq2);
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, s.h("b", null, "a · (b + c) = a · b + a · c"), s.h("br"), "Erst aufteilen, dann malnehmen, dann zusammenzählen.");
          const e2 = ex(s, "Beispiel 2: Hefte für 98 Cent", { class: "ex later" }, s.h("p", { class: "t mono" }, "6 · 98 = 6 · 100 − 6 · 2", s.h("br"), "= 600 − 12 = ", s.h("b", { class: "red" }, "588 Cent")));
          const e3 = ex(s, "Beispiel 3: Getränkekisten", { class: "ex later" }, s.h("p", { class: "small" }, "4 Kisten und 6 Kisten mit je 15 Flaschen:"), s.h("p", { class: "t mono" }, "4 · 15 + 6 · 15 = 10 · 15 = ", s.h("b", { class: "red" }, "150")));
          const lf13 = life(s, { class: "life later" }, s.h("p", { class: "small" }, "Beim Einkaufen im Kopf: 3 T-Shirts zu 19 € = 3 · 20 € − 3 · 1 € = 57 €."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "640px 1fr", gap: "22px", alignItems: "start" }, left, s.h("div", { class: "stack", style: { gap: "14px" } }, merk, e2, e3, lf13)));
          s.sfx.pop();
          s.step(async () => { split = true; update(); s.sfx.snap(); await s.show(splitG, "fade"); s.show(eq1, "up"); await s.show(eq2, "up", 200); s.show(sl, "up"); s.sfx.success(); s.say("Sieben mal zwanzig plus sieben mal drei. Hundertvierzig plus einundzwanzig ist hunderteinundsechzig."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(e2, "right"); s.say("Achtundneunzig ist fast hundert. Sechs mal hundert minus sechs mal zwei."); });
          s.step(async () => { s.sfx.pop(); await s.show(e3, "right"); s.show(lf13, "up"); s.say("Andersherum geht es auch: vier Kisten plus sechs Kisten sind zehn Kisten."); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Größen umrechnen",
        say: "Längen, Gewichte und Zeiten kann man umrechnen. Wie auf einer Treppe: runter heißt mal, rauf heißt geteilt.",
        build(s) {
          const SETS = {
            "Länge": { u: ["km", "m", "dm", "cm", "mm"], n: ["Kilometer", "Meter", "Dezimeter", "Zentimeter", "Millimeter"], f: [1000, 10, 10, 10], ex: { ctx: "Fernsehturm Berlin:", from: 1, to: 3, v: 368 } },
            "Masse": { u: ["t", "kg", "g", "mg"], n: ["Tonne", "Kilogramm", "Gramm", "Milligramm"], f: [1000, 1000, 1000], ex: { ctx: "Ein Elefant wiegt etwa", from: 0, to: 2, v: 5 } },
            "Zeit": { u: ["d", "h", "min", "s"], n: ["Tag", "Stunde", "Minute", "Sekunde"], f: [24, 60, 60], ex: { ctx: "Ein ganzer Tag:", from: 0, to: 3, v: 1 } },
          };
          const svg = s.svg(1100, 310);
          const stairs = s.el("g"); svg.append(stairs);
          const token = s.el("circle", { r: 14, cx: -50, cy: -50, fill: P.orange, stroke: "#fff", "stroke-width": 4 });
          svg.append(token);
          const chips = s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "12px", minHeight: "48px" } });
          const tabs = Object.keys(SETS).map(k => s.h("button", { class: "btn", onclick: () => { s.sfx.click(); select(k, true); } }, k));
          let cur = null, pos = [], busy = false;
          function drawStairs(key) {
            const S = SETS[key], n = S.u.length, spc = (1100 - 40 - 120) / (n - 1);
            stairs.innerHTML = ""; pos = [];
            for (let i = 0; i < n; i++) {
              const x = 20 + i * spc, y = 20 + i * 50; pos.push([x + 60, y]);
              const g = s.el("g", { class: "a-pop", style: { "--d": i * 90 + "ms", transformBox: "fill-box", transformOrigin: "center" } });
              g.append(s.el("rect", { x, y, width: 120, height: 82, rx: 14, fill: "#fff", stroke: P.blue, "stroke-width": 3 }), T(s, x + 60, y + 40, S.u[i], { "font-size": 34, fill: P.blue }), T(s, x + 60, y + 68, S.n[i], { "font-size": 19, "font-weight": 600, fill: P.pencil }));
              stairs.append(g);
              if (i < n - 1) {
                const gx0 = x + 124, gx1 = x + spc - 4, gw = gx1 - gx0;
                const a = s.el("g", { class: "a-fade", style: { "--d": 300 + i * 90 + "ms" } });
                a.append(s.el("line", { x1: gx0 + 4, y1: y + 46, x2: gx1 - 6, y2: y + 80, stroke: P.ink, "stroke-width": 2.5, "stroke-dasharray": "5 5" }),
                  T(s, gx0 + gw * 0.42, y + 34, "↘ · " + s.fmt(S.f[i]), { "font-size": 21, fill: P.red }),
                  T(s, gx0 + gw * 0.6, y + 112, "↖ : " + s.fmt(S.f[i]), { "font-size": 21, fill: P.blue }));
                stairs.append(a);
              }
            }
            token.setAttribute("cx", -50);
          }
          async function select(key, run) {
            if (busy) return; busy = true; cur = key;
            tabs.forEach(b => b.classList.toggle("solid", b.textContent === key));
            drawStairs(key); s.sfx.whoosh(); chips.innerHTML = "";
            const S = SETS[key], E = S.ex;
            chips.append(s.h("span", { class: "t" }, E.ctx));
            let val = E.v;
            const chip = (t, c) => { const el = s.h("span", { class: "chip a-pop", style: { fontSize: "24px", padding: "8px 16px", background: c } }, t); chips.append(el); return el; };
            chip(`${s.fmt(val)} ${S.u[E.from]}`, "#fff1a8");
            if (run) {
              token.setAttribute("cx", pos[E.from][0]); token.setAttribute("cy", pos[E.from][1]);
              await s.wait(500);
              for (let i = E.from; i < E.to; i++) {
                const [x0, y0] = pos[i], [x1, y1] = pos[i + 1];
                s.sfx.boing();
                await s.tween({ from: 0, to: 1, dur: 650, update: k => { token.setAttribute("cx", x0 + (x1 - x0) * k); token.setAttribute("cy", y0 + (y1 - y0) * k - 70 * Math.sin(Math.PI * k)); } });
                val *= S.f[i]; s.sfx.coin();
                chips.append(s.h("span", { class: "h2 pencil a-fade" }, "="));
                chip(`${s.fmt(val)} ${S.u[i + 1]}`, i + 1 === E.to ? "#cdeedd" : undefined);
                await s.wait(300);
              }
            }
            busy = false;
          }
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "In die ", s.h("b", null, "kleinere"), " Einheit (Treppe runter): ", s.h("b", { class: "red" }, "mal"), " Umrechnungszahl. In die ", s.h("b", null, "größere"), " Einheit (rauf): ", s.h("b", { class: "blue" }, "geteilt"), ". Bei der Zeit: 24 und 60 statt 10!");
          s.add(root(s, "stack", { justifyContent: "space-between", gap: "12px" }, s.h("div", { class: "row", style: { gap: "12px" } }, ...tabs, s.h("span", { class: "small pencil", style: { marginLeft: "8px" } }, "Tippe auf eine Größe")), svg, chips, merk));
          select("Länge", false);
          s.step(async () => { await select("Länge", true); s.say("Dreihundertachtundsechzig Meter sind sechsunddreißigtausendachthundert Zentimeter."); });
          s.step(async () => { await select("Masse", true); s.say("Fünf Tonnen sind fünftausend Kilogramm, das sind fünf Millionen Gramm!"); });
          s.step(async () => { await select("Zeit", true); s.say("Ein Tag hat vierundzwanzig Stunden, tausendvierhundertvierzig Minuten, sechsundachtzigtausendvierhundert Sekunden."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Größen im Alltag",
        say: "Größen begegnen dir jeden Tag: auf dem Schulweg, im Ranzen und am Fernsehturm.",
        build(s) {
          const mk = (label, txt, svg, res, first) => {
            const r = s.h("p", { class: "t", style: { fontWeight: 700, color: P.green } }, res);
            const c = s.h("div", { class: "life" + (first ? " a-up" : " later"), style: { display: "flex", flexDirection: "column", gap: "12px", padding: "12px 18px", justifyContent: "center" } }, s.h("span", { style: LBL }, "Im Alltag · " + label), s.h("p", { class: "small" }, txt), svg, r);
            return c;
          };
          // Fernsehturm
          const v1 = s.svg(480, 96), K = 0.39;
          const tw = [0, 1, 2].map(i => { const g = s.el("g"); g.append(s.el("rect", { x: 4 + i * 368 * K, y: 10, width: 368 * K - 3, height: 30, rx: 6, fill: [P.red, "#e86a5c", "#f29b90"][i] }), T(s, 4 + i * 368 * K + (368 * K) / 2, 32, "368 m", { fill: "#fff", "font-size": 19 })); v1.append(g); return g; });
          const ruler = s.el("line", { x1: 4, x2: 4 + 1000 * K, y1: 58, y2: 58, stroke: P.ink, "stroke-width": 5, "stroke-linecap": "round" });
          v1.append(ruler, s.el("line", { x1: 4 + 1000 * K, x2: 4 + 1000 * K, y1: 46, y2: 70, stroke: P.ink, "stroke-width": 3 }), T(s, 2 + 500 * K, 88, "1 km = 1.000 m", { "font-size": 19 }));
          // Ranzen
          const v2 = s.svg(480, 96), parts = [["Ranzen", 1200, P.blue], ["Bücher", 1600, P.violet], ["Flasche", 700, P.green], ["Brotdose", 500, P.orange]], K2 = 0.117;
          let x = 4; const segs = [];
          parts.forEach(([n, g, c], i) => { const w = g * K2; const rr = s.el("rect", { x, y: 6, width: 0, height: 34, rx: 5, fill: c }); segs.push([rr, w]); v2.append(rr, T(s, x + w / 2, 30, s.fmt(g), { fill: "#fff", "font-size": 19 }), T(s, i === 3 ? x + w : x + w / 2, i % 2 ? 90 : 64, n, { "font-size": 19, fill: c, "text-anchor": i === 3 ? "end" : "middle" })); x += w + 2; });
          // Schultag
          const v3 = s.svg(480, 96), H0 = 8, PX = 80;
          const day = s.el("rect", { x: 20, y: 12, width: 0, height: 30, rx: 6, fill: P.violet });
          v3.append(day);
          for (let h = 8; h <= 14; h++) v3.append(s.el("line", { x1: 20 + (h - H0) * PX * 0.9, x2: 20 + (h - H0) * PX * 0.9, y1: 46, y2: 58, stroke: P.ink, "stroke-width": 2 }), T(s, 20 + (h - H0) * PX * 0.9, 82, h + ":00", { "font-size": 19, "font-weight": 600 }));
          // U-Bahn Takt
          const v4 = s.svg(480, 96);
          v4.append(s.el("line", { x1: 20, x2: 460, y1: 40, y2: 40, stroke: P.ink, "stroke-width": 3 }));
          const trains = [];
          for (let i = 0; i <= 12; i++) { const tx = 20 + i * (440 / 12); v4.append(s.el("line", { x1: tx, x2: tx, y1: 34, y2: 46, stroke: P.ink, "stroke-width": 2 })); if (i < 12) { const tr = later(fb(s.el("rect", { x: tx + 4, y: 18, width: 28, height: 16, rx: 5, fill: "#224f86" }))); trains.push(tr); v4.append(tr); } }
          v4.append(T(s, 20, 76, "0 min", { "font-size": 19, "text-anchor": "start" }), T(s, 460, 76, "60 min", { "font-size": 19, "text-anchor": "end" }), T(s, 240, 76, "alle 5 min ein Zug", { "font-size": 19, fill: "#224f86" }));
          const cards = [
            mk("Länge", "Drei Fernsehtürme hintereinander gelegt:", v1, "3 · 368 m = 1.104 m – etwas mehr als 1 km", true),
            mk("Masse", "Was wiegt dein Schulranzen? (in Gramm)", v2, "4.000 g = 4 kg"),
            mk("Zeit", "Schultag von 8:00 bis 13:30 Uhr:", v3, "5 h 30 min = 330 min"),
            mk("Zeit · U-Bahn", "Die U8 fährt tagsüber etwa alle 5 Minuten.", v4, "60 min : 5 min = 12 Züge pro Stunde"),
          ];
          s.add(root(s, "cols", { gridTemplateRows: "1fr 1fr", gap: "16px 22px" }, ...cards));
          const anims = [
            async () => { for (const g of tw) { s.show(g, "left"); s.sfx.pop(); await s.wait(300); } await s.show(ruler, "draw"); s.sfx.ding(); },
            async () => { for (const [rr, w] of segs) { s.sfx.drum(); await s.tween({ from: 0, to: w, dur: 350, update: v => rr.setAttribute("width", v) }); } s.sfx.ding(); },
            async () => { s.sfx.whoosh(); await s.tween({ from: 0, to: 5.5 * PX * 0.9, dur: 1200, update: v => day.setAttribute("width", v) }); s.sfx.ding(); },
            async () => { for (let i = 0; i < trains.length; i++) { s.show(trains[i], "left"); s.sfx.count(i); await s.wait(130); } s.sfx.success(); },
          ];
          s.sfx.pop();
          anims[0]();
          [1, 2, 3].forEach(i => s.step(async () => { s.sfx.pop(); await s.show(cards[i], i % 2 ? "right" : "left"); await anims[i](); }));
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Gleichungen und die Waage",
        say: "Eine Gleichung ist wie eine Waage im Gleichgewicht. Was links und rechts liegt, ist gleich viel.",
        build(s) {
          const svg = s.svg(480, 440);
          const PX = 240, PY = 120, HALF = 150;
          svg.append(s.el("rect", { x: 170, y: 404, width: 140, height: 16, rx: 6, fill: P.pencil }), s.el("rect", { x: 234, y: PY, width: 12, height: 288, fill: "#8a93a5" }));
          const beam = s.el("g"); beam.append(s.el("rect", { x: PX - HALF - 8, y: PY - 6, width: 2 * HALF + 16, height: 12, rx: 6, fill: P.ink }));
          svg.append(beam, s.el("circle", { cx: PX, cy: PY, r: 11, fill: P.yellow, stroke: P.ink, "stroke-width": 3 }));
          const mkPan = () => { const g = s.el("g"); g.append(s.el("line", { x1: 0, y1: 0, x2: -82, y2: 150, stroke: P.pencil, "stroke-width": 2 }), s.el("line", { x1: 0, y1: 0, x2: 82, y2: 150, stroke: P.pencil, "stroke-width": 2 }), s.el("rect", { x: -88, y: 150, width: 176, height: 11, rx: 5, fill: P.pencil })); svg.append(g); return g; };
          const panL = mkPan(), panR = mkPan();
          const marble = (x, y) => s.el("circle", { cx: x, cy: y, r: 10, fill: P.blue, stroke: "#123c8c", "stroke-width": 2 });
          const box = s.el("g"); box.append(s.el("rect", { x: -76, y: 96, width: 52, height: 52, rx: 8, fill: P.orange }), T(s, -50, 132, "x", { fill: "#fff", "font-size": 32 })); panL.append(box);
          const mL = [], mR = [];
          for (let i = 0; i < 7; i++) { const m = marble(-6 + (i % 3) * 23, 139 - Math.floor(i / 3) * 22); mL.push(m); panL.append(m); }
          for (let i = 0; i < 15; i++) { const m = marble(-46 + (i % 5) * 23, 139 - Math.floor(i / 5) * 22); mR.push(m); panR.append(m); }
          const labL = T(s, PX - HALF, 330, "x + 7", { "font-size": 30, fill: P.orange }), labR = T(s, PX + HALF, 330, "15", { "font-size": 30, fill: P.blue });
          svg.append(labL, labR);
          function setAngle(a) {
            beam.setAttribute("transform", `rotate(${a} ${PX} ${PY})`);
            const r = (a * Math.PI) / 180, c = Math.cos(r) * HALF, sn = Math.sin(r) * HALF;
            panL.setAttribute("transform", `translate(${PX - c},${PY - sn})`); panR.setAttribute("transform", `translate(${PX + c},${PY + sn})`);
          }
          setAngle(0);
          const story = ex(s, "Die Geschichte", { class: "ex a-right", style: { padding: "12px 18px" } }, s.h("p", { class: "t" }, "Julian hat ein paar Sticker. Er bekommt ", s.h("b", null, "7"), " neue dazu. Jetzt hat er ", s.h("b", null, "15"), ". Wie viele hatte er vorher?"));
          const eq0 = s.h("p", { class: "big mono" }, sp(s, "x", P.orange), " + 7 = 15");
          const eqNote = s.h("p", { class: "small" }, sp(s, "x", P.orange, { fontWeight: 700 }), " ist ein ", s.h("b", null, "Platzhalter"), " (Variable) für die Zahl, die wir suchen.");
          const eq1 = s.h("p", { class: "h2 mono later" }, "x + 7 − 7 = 15 − 7  →  ", s.h("b", { class: "red" }, "x = 8"));
          const eqCard = ex(s, "Die Gleichung", { class: "ex later", style: { display: "flex", flexDirection: "column", gap: "6px", padding: "12px 18px" } }, eq0, eqNote, eq1);
          const nums = Array.from({ length: 10 }, (_, i) => s.h("span", { style: { width: "42px", height: "42px", borderRadius: "10px", display: "grid", placeItems: "center", font: "700 22px/1 var(--f-display)", background: "#fff", border: "2px solid var(--line)" } }, String(i)));
          const ung = ex(s, "Ungleichung", { class: "ex later", style: { padding: "12px 18px" } }, s.h("p", { class: "small", style: { marginBottom: "8px" } }, s.h("b", null, "7 + x < 10"), " – 10 € dabei, Popcorn kostet 7 €. Das Getränk muss weniger als 3 € kosten. Viele Lösungen:"), s.h("div", { class: "row", style: { gap: "6px", flexWrap: "nowrap" } }, ...nums));
          const lf = life(s, { class: "life later", style: { padding: "10px 18px" } }, s.h("p", { class: "small" }, "Fernsehturm: 203 m + x = 368 m → x = 165 m · Ein ", s.h("b", null, "Term"), " ist eine Rechnung ohne „=“, z. B. 4 · 5 + 7."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "480px 1fr", gap: "24px", alignItems: "center" }, s.h("div", { class: "a-fade" }, svg), s.h("div", { class: "stack", style: { gap: "12px" } }, story, eqCard, ung, lf)));
          s.sfx.pop();
          s.tween({ from: -12, to: 0, dur: 1600, ease: "elastic", update: setAngle });
          s.step(async () => { s.sfx.pop(); await s.show(eqCard, "up"); s.say("x plus sieben gleich fünfzehn. x ist der Platzhalter."); });
          s.step(async () => {
            for (let i = 0; i < 7; i++) {
              s.sfx.pop();
              const a = mL[i], b = mR[14 - i], ya = Number(a.getAttribute("cy")), yb = Number(b.getAttribute("cy"));
              await s.tween({ from: 0, to: 1, dur: 260, update: k => { a.setAttribute("cy", ya - 120 * k); b.setAttribute("cy", yb - 120 * k); a.setAttribute("opacity", 1 - k); b.setAttribute("opacity", 1 - k); } });
              later(a); later(b);
            }
            labL.textContent = "x"; labR.textContent = "8";
            s.sfx.ding(); await s.show(eq1, "left"); s.sfx.success();
            s.say("Auf beiden Seiten sieben wegnehmen. Die Waage bleibt im Gleichgewicht: x ist acht.");
          });
          s.step(async () => {
            await s.show(ung, "up");
            for (let i = 0; i < 3; i++) { await s.wait(300); nums[i].style.background = "#cdeedd"; nums[i].style.borderColor = P.green; s.sfx.count(i); }
            s.say("Null, eins oder zwei Euro: Bei einer Ungleichung passen oft mehrere Zahlen.");
          });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
    ],
  });
})();
