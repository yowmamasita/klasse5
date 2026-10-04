/* Kapitel 8 – Daten und Diagramme (Urliste, Strichliste, Häufigkeitstabelle, Säulen-/Balkendiagramm) */
(() => {
  const P = { blue: "#1d5bd0", red: "#dc3b2a", green: "#138a5a", violet: "#7b4fd6", orange: "#ee7a1a", ink: "#1b2740", pencil: "#5d6678", yellow: "#ffd94a", line: "#c8d3de", teal: "#0e7490" };
  const LBL = { font: "700 14px/1 var(--f-display)", letterSpacing: ".08em", textTransform: "uppercase", display: "block", marginBottom: "8px", color: "var(--green)" };
  const ex = (s, label, attrs, ...kids) => s.h("div", Object.assign({ class: "ex" }, attrs || {}), s.h("span", { class: "exlabel" }, label), ...kids);
  const life = (s, attrs, ...kids) => s.h("div", Object.assign({ class: "life" }, attrs || {}), s.h("span", { style: LBL }, (attrs && attrs.label) || "Im Alltag"), ...kids);
  const T = (s, x, y, text, a) => s.el("text", Object.assign({ x, y, "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: P.ink, text }, a || {}));
  const fb = el => { el.style.transformBox = "fill-box"; el.style.transformOrigin = "center"; return el; };
  const later = el => { el.classList.add("later"); return el; };
  const root = (s, cls, style, ...kids) => s.h("div", { class: cls, style: Object.assign({ height: "100%", fontSize: "22px" }, style || {}) }, ...kids);

  /* Instrumente der 5a (Beispieldaten) */
  const INST = { G: ["Geige", P.blue], T: ["Trompete", P.red], Q: ["Querflöte", P.green], C: ["Cello", P.violet], K: ["Klarinette", P.orange], S: ["Schlagzeug", P.teal] };
  const ORDER = ["G", "T", "Q", "C", "K", "S"];
  const URL_ = "GTQGCTGKQSGTCQGTKGQCTGSQCKTG".split("");
  const COUNT = ORDER.map(k => URL_.filter(x => x === k).length); // 8 6 5 4 3 2

  /* tally marks: returns svg with marks (all "later"), and the list of marks */
  function tally(s, n, color, w = 200, h = 44) {
    const svg = s.svg(w, h); const marks = [];
    for (let k = 0; k < n; k++) {
      const gI = Math.floor(k / 5), idx = k % 5, x0 = 12 + gI * 84;
      const m = idx < 4 ? s.el("line", { x1: x0 + idx * 15, x2: x0 + idx * 15, y1: 6, y2: h - 6, stroke: color, "stroke-width": 4, "stroke-linecap": "round" })
        : s.el("line", { x1: x0 - 8, x2: x0 + 3 * 15 + 8, y1: h - 10, y2: 10, stroke: color, "stroke-width": 4, "stroke-linecap": "round" });
      marks.push(m); svg.append(m);
    }
    return { svg, marks };
  }

  /* column chart: o = {w,h,data:[{l,v,c}],yMax,yStep,L,B,Tp,R,bw,unit,labSize} */
  function colChart(s, o) {
    const svg = s.svg(o.w, o.h);
    const L = o.L ?? 56, B = o.h - (o.bottom ?? 46), Tp = o.Tp ?? 36, R = o.w - (o.right ?? 8);
    let yMax = o.yMax, yStep = o.yStep;
    const Y = v => B - (v / yMax) * (B - Tp);
    const grid = s.el("g"); svg.append(grid);
    function drawGrid() {
      grid.innerHTML = "";
      for (let v = 0; v <= yMax + 1e-9; v += yStep) {
        grid.append(s.el("line", { x1: L, x2: R, y1: Y(v), y2: Y(v), stroke: "#e1e8ef", "stroke-width": 2 }));
        grid.append(T(s, L - 8, Y(v) + 7, String(v), { "font-size": 19, "font-weight": 600, fill: P.pencil, "text-anchor": "end" }));
      }
    }
    drawGrid();
    svg.append(s.el("line", { x1: L, x2: L, y1: Tp - 14, y2: B, stroke: P.ink, "stroke-width": 3 }), s.el("line", { x1: L, x2: R, y1: B, y2: B, stroke: P.ink, "stroke-width": 3 }));
    const n = o.data.length, slot = (R - L) / n, bw = slot * (o.bw ?? 0.62);
    const bars = o.data.map((d, i) => {
      const cx = L + slot * i + slot / 2;
      const rect = s.el("rect", { x: cx - bw / 2, y: B, width: bw, height: 0, rx: 5, fill: d.c || P.teal });
      const val = T(s, cx, B - 8, "", { "font-size": o.valSize || 20 });
      const lab = T(s, cx, B + 28, d.l, { "font-size": o.labSize || 19, "font-weight": 600 });
      svg.append(rect, val, lab);
      return { rect, val, lab, cx, v: 0, d };
    });
    function set(i, v) {
      const b = bars[i]; b.v = v; const y = Y(v);
      b.rect.setAttribute("y", y); b.rect.setAttribute("height", Math.max(0, B - y));
      b.val.setAttribute("y", y - 8); b.val.textContent = v > 0 || o.showZero ? (o.fmtV ? o.fmtV(v) : String(Math.round(v))) : "";
    }
    async function grow(i, to, dur = 600) { const from = bars[i].v; await s.tween({ from, to, dur, ease: "out", update: v => set(i, v) }); set(i, to); }
    function rescale(m, st) { yMax = m; yStep = st; drawGrid(); bars.forEach((b, i) => set(i, b.v)); }
    return { svg, bars, set, grow, Y, B, L, R, Tp, slot, rescale, get yMax() { return yMax; } };
  }

  Deck.unit({
    id: "u8", num: 8, title: "Daten und Diagramme", color: "#0e7490", soft: "#dff3f7",
    subtitle: "Zählen, ordnen, zeichnen, lesen",
    blurb: "Umfragen auswerten: Strichliste, Tabelle, Säulen und Balken.",
    goals: ["Daten sammeln: Umfrage, Zählen, Experiment", "Urliste → Strichliste → Häufigkeitstabelle", "Säulen- und Balkendiagramme zeichnen und lesen", "Häufigsten und seltensten Wert finden", "Tricks mit Diagrammen durchschauen"],
    icon(svg, el) {
      [[10, 30, "#0e7490"], [26, 14, "#dc3b2a"], [42, 38, "#ffd94a"]].forEach(([x, y, c]) => svg.append(el("rect", { x, y, width: 13, height: 60 - y, rx: 3, fill: c })));
      svg.append(el("line", { x1: 6, x2: 62, y1: 60, y2: 60, stroke: "#1b2740", "stroke-width": 3 }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Daten sammeln",
        say: "Bevor wir ein Diagramm zeichnen, brauchen wir Daten. Die kann man auf verschiedene Arten sammeln.",
        build(s) {
          const icon = kind => {
            if (kind === 1) return s.photo("bvg-bus", { w: 230, h: 150, pos: "60% 55%" });
            if (kind === 2) return s.photo("wuerfel", { w: 230, h: 150 });
            const v = s.svg(150, 104);
            if (kind === 0) {
              v.append(s.el("rect", { x: 40, y: 6, width: 72, height: 94, rx: 8, fill: "#b07a45" }), s.el("rect", { x: 47, y: 16, width: 58, height: 78, rx: 4, fill: "#fff" }), s.el("rect", { x: 62, y: 2, width: 28, height: 12, rx: 4, fill: P.pencil }));
              for (let i = 0; i < 4; i++) { v.append(s.el("rect", { x: 53, y: 25 + i * 17, width: 11, height: 11, rx: 2, fill: "none", stroke: P.ink, "stroke-width": 2 }), s.el("line", { x1: 70, x2: 98, y1: 31 + i * 17, y2: 31 + i * 17, stroke: P.line, "stroke-width": 3 })); if (i % 2 === 0) v.append(s.el("path", { d: `M54,${30 + i * 17} l4,4 l8,-10`, fill: "none", stroke: P.red, "stroke-width": 3, "stroke-linecap": "round" })); }
            } else if (kind === 1) {
              v.append(s.el("rect", { x: 14, y: 22, width: 104, height: 54, rx: 10, fill: "#f0d722" }), s.el("rect", { x: 14, y: 62, width: 104, height: 8, fill: "#c9b30f" }));
              for (let i = 0; i < 4; i++) v.append(s.el("rect", { x: 22 + i * 24, y: 30, width: 18, height: 20, rx: 3, fill: "#cfe8f5" }));
              v.append(s.el("circle", { cx: 38, cy: 78, r: 10, fill: P.ink }), s.el("circle", { cx: 96, cy: 78, r: 10, fill: P.ink }));
              for (let i = 0; i < 3; i++) v.append(s.el("line", { x1: 126 + i * 7, x2: 126 + i * 7, y1: 30, y2: 62, stroke: P.red, "stroke-width": 3.5, "stroke-linecap": "round" }));
            } else if (kind === 2) {
              const die = (x, y, r, pips) => { v.append(s.el("rect", { x, y, width: 56, height: 56, rx: 12, fill: "#fff", stroke: P.ink, "stroke-width": 3, transform: `rotate(${r} ${x + 28} ${y + 28})` })); pips.forEach(([a, b]) => v.append(s.el("circle", { cx: x + a, cy: y + b, r: 5.5, fill: P.ink, transform: `rotate(${r} ${x + 28} ${y + 28})` }))); };
              die(14, 30, -12, [[14, 14], [42, 14], [28, 28], [14, 42], [42, 42]]); die(80, 20, 10, [[16, 16], [40, 40]]);
            } else {
              v.append(s.el("circle", { cx: 40, cy: 36, r: 18, fill: P.yellow }));
              for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4; v.append(s.el("line", { x1: 40 + 24 * Math.cos(a), y1: 36 + 24 * Math.sin(a), x2: 40 + 32 * Math.cos(a), y2: 36 + 32 * Math.sin(a), stroke: "#f0b400", "stroke-width": 3.5, "stroke-linecap": "round" })); }
              v.append(s.el("rect", { x: 96, y: 8, width: 18, height: 74, rx: 9, fill: "#fff", stroke: P.ink, "stroke-width": 3 }), s.el("rect", { x: 101, y: 34, width: 8, height: 50, fill: P.red }), s.el("circle", { cx: 105, cy: 88, r: 13, fill: P.red, stroke: P.ink, "stroke-width": 3 }));
            }
            return v;
          };
          const info = [
            ["Umfrage", "Alle in der 5a fragen: „Welches Instrument spielst du?“"],
            ["Beobachten und zählen", "Wie viele Busse fahren in 10 Minuten am Hermannplatz vorbei?"],
            ["Experiment", "30-mal würfeln und notieren, welche Zahl kommt."],
            ["Messen", "Jeden Mittag die Temperatur auf dem Schulhof ablesen."],
          ];
          const cards = info.map(([t, d], i) => s.h("div", { class: "card" + (i ? " later" : " a-up"), style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", textAlign: "center" } }, icon(i), s.h("p", { class: "h2", style: { fontSize: "25px", color: P.teal } }, t), s.h("p", { class: "small" }, d)));
          const merk = s.h("div", { class: "merk later" }, s.h("b", null, "Daten"), " sind gesammelte Antworten, Zählungen oder Messwerte. Vorher überlegen: ", s.h("b", null, "Was will ich wissen? Wen frage ich?"));
          s.add(root(s, "stack", { justifyContent: "center", gap: "28px" }, s.h("div", { class: "cols4" }, ...cards), merk));
          s.sfx.pop();
          const SND = [null, () => s.sound("bus-faehrt", { vol: .5, dur: 3 }), () => s.sound("wuerfeln", { vol: .7 }), () => s.sfx.count(6)];
          [1, 2, 3].forEach(i => s.step(async () => { SND[i](); await s.show(cards[i], "up"); s.say(info[i][0] + ": " + info[i][1]); }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Die Urliste",
        say: "Die 5a ist eine Instrumentalklasse. Wir fragen alle 28 Kinder: Welches Instrument spielst du?",
        build(s) {
          const svg = s.svg(470, 420);
          const kids = URL_.map((k, i) => {
            const c = i % 7, r = Math.floor(i / 7), x = 40 + c * 65, y = 62 + r * 98;
            const skin = ["#f3c9a5", "#d9a37a", "#8d5a3b", "#f6d8bd"][(i * 3) % 4], hair = ["#3b2a1e", "#d8a94c", "#1b1b1b", "#8a4b12"][(i * 5) % 4];
            const g = s.el("g");
            const ring = s.el("circle", { cx: x, cy: y + 12, r: 31, fill: "none", stroke: INST[k][1], "stroke-width": 5, class: "later" });
            g.append(ring, s.el("path", { d: `M${x - 22},${y + 44} q22,-30 44,0 z`, fill: INST[k][1], opacity: .3 }), s.el("circle", { cx: x, cy: y, r: 18, fill: skin }), s.el("path", { d: `M${x - 18},${y - 2} a18,18 0 0 1 36,0 q-18,-10 -36,0 z`, fill: hair }));
            g.append(s.el("circle", { cx: x - 6, cy: y + 2, r: 2.2, fill: P.ink }), s.el("circle", { cx: x + 6, cy: y + 2, r: 2.2, fill: P.ink }), s.el("path", { d: `M${x - 5},${y + 9} q5,4 10,0`, fill: "none", stroke: P.ink, "stroke-width": 2 }));
            svg.append(g); return ring;
          });
          const chips = URL_.map(k => s.h("span", { class: "later", style: { font: "600 19px/1 var(--f-body)", padding: "7px 10px", borderRadius: "8px", background: "#fff", border: "2px solid var(--line)", borderLeft: `6px solid ${INST[k][1]}` } }, INST[k][0]));
          const box = ex(s, "Urliste (so wie die Antworten kamen)", { class: "ex a-right", style: { minHeight: "330px" } }, s.h("div", { style: { display: "flex", flexWrap: "wrap", gap: "7px" } }, ...chips));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, s.h("b", null, "Urliste"), ": alle Daten in der Reihenfolge, wie sie gesammelt wurden. Vollständig – aber ", s.h("b", null, "unübersichtlich"), "!");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "470px 1fr", gap: "26px", alignItems: "center" }, s.h("div", { class: "a-zoom" }, svg), s.h("div", { class: "stack" }, box, merk)));
          s.sfx.whoosh();
          s.step(async () => {
            s.say("Jedes Kind sagt sein Instrument. Wir schreiben alles der Reihe nach auf.");
            for (let i = 0; i < URL_.length; i++) { s.show(kids[i], "pop"); s.show(chips[i], "pop"); s.sfx.note(ORDER.indexOf(URL_[i]) * 2, 0.12); await s.wait(170); }
            s.sfx.ding();
          });
          s.step(async () => { s.sfx.boing(); await s.show(merk, "up"); s.say("Welches Instrument ist am beliebtesten? Das sieht man hier noch nicht auf einen Blick."); });
        },
      },
      /* 2b --------------------------------------------------------------- */
      {
        title: "So klingen die Instrumente",
        say: "Das sind die Instrumente aus der Umfrage. Tippe auf einen Knopf und hör sie dir an!",
        build(s) {
          const cell = (fig, btn) => s.h("div", { class: "stack later", style: { gap: "8px", alignItems: "center" } }, fig, btn);
          const o = (caption, extra) => Object.assign({ w: 340, h: 170, caption }, extra || {});
          const white = { fit: "contain", style: { background: "#fff" } };
          const cells = [
            cell(s.photo("inst-geige", o("Geige", white)), s.soundBtn("klang-geige", "Geige anhören")),
            cell(s.photo("inst-trompete", o("Trompete", white)), s.soundBtn("klang-trompete", "Trompete anhören")),
            cell(s.photo("inst-querfloete", o("Querflöte", { pos: "40% 45%" })), s.soundBtn("klang-querfloete", "Querflöte anhören")),
            cell(s.photo("inst-cello", o("Cello", { pos: "50% 45%" })), s.soundBtn("klang-cello", "Cello anhören")),
            cell(s.photo("inst-klarinette", o("Klarinette", white)), s.soundBtn("klang-klarinette", "Klarinette anhören")),
            cell(s.photo("inst-schlagzeug", o("Schlagzeug", { pos: "50% 55%" })), s.soundBtn("klang-schlagzeug", "Schlagzeug anhören")),
          ];
          s.add(root(s, "stack", { justifyContent: "center", gap: "20px" },
            s.h("div", { class: "cols3", style: { gap: "22px 24px" } }, ...cells)));
          s.step(async () => { s.sound("klang-geige", { vol: .6, dur: 1.5 }); await s.show(cells.slice(0, 3), "up"); });
          s.step(async () => { s.sound("klang-schlagzeug", { vol: .5, dur: 1.5 }); await s.show(cells.slice(3), "up"); s.say("Welches Instrument gefällt dir am besten?"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Die Strichliste",
        say: "Mit einer Strichliste zählen wir die Urliste aus. Für jede Antwort ein Strich.",
        build(s) {
          const chips = URL_.map(k => s.h("span", { style: { font: "600 19px/1 var(--f-body)", padding: "6px 8px", borderRadius: "8px", background: "#fff", border: "2px solid var(--line)", borderLeft: `6px solid ${INST[k][1]}`, transition: "opacity .3s" } }, INST[k][0]));
          const left = ex(s, "Urliste", { class: "ex a-left" }, s.h("div", { style: { display: "flex", flexWrap: "wrap", gap: "6px" } }, ...chips));
          const rows = ORDER.map((k, i) => {
            const t = tally(s, COUNT[i], INST[k][1], 190, 50);
            t.marks.forEach(later);
            const row = s.h("div", { style: { display: "grid", gridTemplateColumns: "140px 1fr", alignItems: "center", borderBottom: "2px solid var(--line)", padding: "12px 0" } }, s.h("span", { style: { font: "700 21px/1 var(--f-display)", color: INST[k][1] } }, INST[k][0]), t.svg);
            return { row, t, k, n: 0 };
          });
          const ring = later(s.el("ellipse", { cx: 35, cy: 25, rx: 42, ry: 24, fill: "none", stroke: P.red, "stroke-width": 3 }));
          rows[0].t.svg.append(ring);
          const table = ex(s, "Strichliste", { class: "ex a-right" }, s.h("div", { class: "stack", style: { gap: "0" } }, ...rows.map(r => r.row)));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Immer 4 Striche, der 5. geht quer: ", s.h("b", null, "ein Fünferbündel"), ". So zählt man schnell in Fünferschritten.");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "480px 1fr", gap: "24px", alignItems: "start" }, s.h("div", { class: "stack" }, left, merk), table));
          s.sfx.pop();
          s.step(async () => {
            s.say("Wir gehen die Urliste durch und machen für jede Antwort einen Strich.");
            s.sound("chalk-write", { vol: .5, dur: 5.2 });
            for (let i = 0; i < URL_.length; i++) {
              const r = rows.find(x => x.k === URL_[i]);
              chips[i].style.opacity = ".3"; chips[i].style.textDecoration = "line-through";
              s.show(r.t.marks[r.n++], "draw");
              await s.wait(190);
            }
            s.sfx.ding();
          });
          s.step(async () => { s.show(ring, "draw"); s.sfx.zap(); await s.show(merk, "up"); s.say("Vier Striche und ein Querstrich sind fünf."); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Die Häufigkeitstabelle",
        say: "Jetzt zählen wir die Striche und schreiben die Zahl daneben. Das ist die Häufigkeit.",
        build(s) {
          const cell = (kids, st) => s.h("td", { style: Object.assign({ padding: "6px 14px", borderBottom: "2px solid var(--line)" }, st || {}) }, kids);
          const nums = [];
          const trs = ORDER.map((k, i) => {
            const t = tally(s, COUNT[i], INST[k][1], 190, 40);
            const n = s.h("span", { class: "later", style: { font: "800 30px/1 var(--f-display)", color: INST[k][1] } }, "0"); nums.push(n);
            return s.h("tr", null, cell(s.h("span", { style: { font: "700 22px/1 var(--f-display)", color: INST[k][1] } }, INST[k][0])), cell(t.svg), cell(n, { textAlign: "center" }));
          });
          const sumN = s.h("span", { style: { font: "800 30px/1 var(--f-display)", color: P.red } }, "28");
          const sumRow = s.h("tr", { class: "later" }, cell(s.h("b", { style: { fontSize: "22px" } }, "Zusammen"), { borderBottom: "none" }), cell(s.h("span", { class: "small pencil" }, "= alle Kinder der 5a"), { borderBottom: "none" }), cell(sumN, { textAlign: "center", borderBottom: "none" }));
          const th = t => s.h("th", { style: { font: "700 19px/1 var(--f-body)", color: P.pencil, textAlign: "left", padding: "8px 14px", borderBottom: "3px solid var(--ink)" } }, t);
          const table = s.h("table", { class: "a-left", style: { borderCollapse: "collapse", background: "#fff", borderRadius: "14px", width: "100%" } }, s.h("tr", null, th("Instrument"), th("Strichliste"), th("Häufigkeit")), ...trs, sumRow);
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, s.h("b", null, "Häufigkeit"), " = wie oft ein Wert vorkommt. Alle Häufigkeiten zusammen = Anzahl aller Antworten.");
          const lf = life(s, { class: "life later" }, s.h("p", { class: "small" }, "Tabellen siehst du überall: Bundesliga-Tabelle, BVG-Fahrplan, euer Stundenplan, die Nährwerte auf der Müslipackung."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "600px 1fr", gap: "26px", alignItems: "center" }, s.h("div", { class: "card", style: { padding: "10px 8px" } }, table), s.h("div", { class: "stack", style: { gap: "18px" } }, merk, lf)));
          s.sfx.pop();
          s.step(async () => {
            for (let i = 0; i < 6; i++) { s.show(nums[i], "pop"); await s.tween({ from: 0, to: COUNT[i], dur: 450, update: v => (nums[i].textContent = Math.round(v)) }); s.sfx.count(COUNT[i]); await s.wait(150); }
            s.say("Geige achtmal, Trompete sechsmal, Querflöte fünfmal, Cello viermal, Klarinette dreimal, Schlagzeug zweimal.");
          });
          s.step(async () => { s.sfx.success(); await s.show(sumRow, "up"); s.say("Acht plus sechs plus fünf plus vier plus drei plus zwei sind achtundzwanzig. Passt: Die 5a hat achtundzwanzig Kinder."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.show(lf, "up"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Das Säulendiagramm",
        say: "Aus der Tabelle wird ein Säulendiagramm. Je höher die Säule, desto häufiger.",
        build(s) {
          const ch = colChart(s, { w: 760, h: 520, data: ORDER.map((k, i) => ({ l: INST[k][0], v: COUNT[i], c: INST[k][1] })), yMax: 10, yStep: 2, L: 56, Tp: 52, bottom: 64 });
          const yT = later(T(s, 20, 26, "Anzahl der Kinder", { "font-size": 20, "text-anchor": "start", fill: P.teal }));
          const xT = later(T(s, 752, 514, "Instrument", { "font-size": 20, "text-anchor": "end", fill: P.teal }));
          ch.svg.append(yT, xT);
          const hl = s.el("rect", { x: 0, y: 40, width: ch.slot, height: ch.B - 40, rx: 10, fill: "#fff1a8", opacity: 0 });
          ch.svg.insertBefore(hl, ch.svg.firstChild);
          const rows = ORDER.map((k, i) => s.h("div", { style: { display: "flex", justifyContent: "space-between", padding: "6px 12px", borderRadius: "8px", font: "700 21px/1.2 var(--f-display)", color: INST[k][1] } }, s.h("span", null, INST[k][0]), s.h("span", null, String(COUNT[i]))));
          const info = s.h("p", { class: "small pencil" }, "Tippe auf eine Säule!");
          const pick = i => {
            rows.forEach((r, j) => (r.style.background = j === i ? "#fff1a8" : "transparent"));
            hl.setAttribute("x", ch.L + ch.slot * i); hl.setAttribute("opacity", 1);
            info.textContent = `${INST[ORDER[i]][0]}: ${COUNT[i]} Kinder`; s.sfx.note(COUNT[i]);
          };
          ch.bars.forEach((b, i) => { b.rect.style.cursor = "pointer"; b.rect.addEventListener("click", () => pick(i)); });
          const title = s.h("p", { class: "h2 later", style: { textAlign: "center", fontSize: "26px" } }, "Instrumente in der 5a");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "20px" } }, "Überschrift und beide Achsen ", s.h("b", null, "beschriften"), "! Alle Säulen gleich breit.");
          const tbl = s.h("div", { class: "card a-left", style: { padding: "8px" } }, ...rows);
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "1fr 760px", gap: "22px", alignItems: "center" }, s.h("div", { class: "stack", style: { gap: "12px" } }, tbl, info, merk), s.h("div", { class: "stack", style: { gap: "4px" } }, title, s.h("div", { class: "a-fade" }, ch.svg))));
          s.sfx.pop();
          s.step(async () => { s.say("Jede Zahl aus der Tabelle wird eine Säule."); for (let i = 0; i < 6; i++) { s.sfx.note(i * 2); ch.grow(i, COUNT[i], 700); await s.wait(260); } await s.wait(500); s.sfx.ding(); });
          s.step(async () => { s.sfx.scribble(); s.show(title, "down"); s.show(yT, "fade"); await s.show(xT, "fade"); await s.show(merk, "up"); pick(0); s.say("Geige hat die höchste Säule. Tippe auf eine Säule!"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Säulen oder Balken?",
        say: "Säulen stehen, Balken liegen. Wir drehen das Diagramm einfach um!",
        build(s) {
          const data = [["Fußball", 9, P.green], ["Schwimmen", 6, P.blue], ["Basketball", 5, P.orange], ["Tischtennis", 4, P.red], ["Reiten", 2, P.violet], ["Turnen", 2, P.teal]];
          const W = 700, H = 500, svg = s.svg(W, H);
          // column geometry
          const cL = 50, cB = 430, cT = 50, cR = 694, cSlot = (cR - cL) / 6, cBW = 62, cY = v => cB - v * ((cB - cT) / 10);
          // bar geometry
          const bL = 172, bR = 652, bT = 26, bPitch = 66, bH = 44, bAx = 418, bX = v => bL + v * ((bR - bL) / 10);
          const colAx = s.el("g"), barAx = s.el("g", { opacity: 0 });
          for (let v = 0; v <= 10; v += 2) {
            colAx.append(s.el("line", { x1: cL, x2: cR, y1: cY(v), y2: cY(v), stroke: "#e1e8ef", "stroke-width": 2 }), T(s, cL - 8, cY(v) + 7, String(v), { "font-size": 19, fill: P.pencil, "text-anchor": "end" }));
            barAx.append(s.el("line", { x1: bX(v), x2: bX(v), y1: bT - 10, y2: bAx, stroke: "#e1e8ef", "stroke-width": 2 }), T(s, bX(v), bAx + 28, String(v), { "font-size": 19, fill: P.pencil }));
          }
          colAx.append(s.el("line", { x1: cL, x2: cL, y1: cT - 16, y2: cB, stroke: P.ink, "stroke-width": 3 }), s.el("line", { x1: cL, x2: cR, y1: cB, y2: cB, stroke: P.ink, "stroke-width": 3 }), T(s, cL - 40, 22, "Anzahl Kinder", { "font-size": 19, "text-anchor": "start", fill: P.teal }));
          barAx.append(s.el("line", { x1: bL, x2: bL, y1: bT - 14, y2: bAx, stroke: P.ink, "stroke-width": 3 }), s.el("line", { x1: bL, x2: bR + 20, y1: bAx, y2: bAx, stroke: P.ink, "stroke-width": 3 }), T(s, bR + 40, bAx + 60, "Anzahl Kinder", { "font-size": 19, "text-anchor": "end", fill: P.teal }));
          svg.append(colAx, barAx);
          const items = data.map(([n, v, c], i) => {
            const rect = s.el("rect", { rx: 5, fill: c }), val = T(s, 0, 0, String(v)), lab = T(s, 0, 0, n, { "font-size": 19, "font-weight": 600 });
            svg.append(rect, val, lab); return { n, v, rect, val, lab, i, g: 0 };
          });
          let t = 0;
          function place() {
            items.forEach(it => {
              const g = it.g; // growth 0..1
              const cx = cL + cSlot * it.i + cSlot / 2, ch = (cB - cY(it.v)) * g;
              const C = { x: cx - cBW / 2, y: cB - ch, w: cBW, h: ch, vx: cx, vy: cB - ch - 8, lx: cx, ly: cB + 30 };
              const by = bT + it.i * bPitch, bw = (bX(it.v) - bL) * g, lw = it.lw || 90;
              const Bq = { x: bL, y: by, w: bw, h: bH, vx: bL + bw + 18, vy: by + bH / 2 + 7, lx: bL - 12 - lw / 2, ly: by + bH / 2 + 7 };
              const L = k => C[k] + (Bq[k] - C[k]) * t;
              it.rect.setAttribute("x", L("x")); it.rect.setAttribute("y", L("y")); it.rect.setAttribute("width", Math.max(0, L("w"))); it.rect.setAttribute("height", Math.max(0, L("h")));
              it.val.setAttribute("x", L("vx")); it.val.setAttribute("y", L("vy")); it.val.style.opacity = g > 0.05 ? 1 : 0;
              it.lab.setAttribute("x", L("lx")); it.lab.setAttribute("y", L("ly"));
            });
            colAx.setAttribute("opacity", 1 - t); barAx.setAttribute("opacity", t);
            colAx.style.visibility = t > 0.98 ? "hidden" : "visible"; barAx.style.visibility = t < 0.02 ? "hidden" : "visible";
          }
          place();
          let busy = false;
          async function morph(to) {
            if (busy) return; busy = true;
            items.forEach(it => { try { it.lw = it.lab.getComputedTextLength(); } catch (e) {} });
            s.sfx.whoosh();
            await s.tween({ from: t, to, dur: 1200, ease: "inOut", update: v => { t = v; place(); } });
            t = to; place(); s.sfx.snap(); busy = false;
            btn.textContent = t ? "↻ Zurück zu Säulen" : "↻ Zu Balken drehen";
          }
          const btn = s.h("button", { class: "btn solid later", onclick: () => { s.sfx.click(); morph(t ? 0 : 1); } }, "↻ Zu Balken drehen");
          const intro = s.h("p", { class: "t a-up" }, s.h("b", null, "Umfrage in der 5a:"), " Was ist dein Lieblingssport? (28 Kinder)");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, s.h("b", null, "Säulendiagramm:"), " Säulen stehen. ", s.h("b", null, "Balkendiagramm:"), " Balken liegen – praktisch bei langen Namen oder vielen Werten.");
          const lf = life(s, { class: "life later" }, s.h("p", { class: "small" }, "Balken findest du oft bei Ranglisten: Tore pro Spieler, beliebteste Apps, Medaillen-Spiegel."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "700px 1fr", gap: "24px", alignItems: "center" }, s.h("div", { class: "a-fade" }, svg), s.h("div", { class: "stack", style: { gap: "16px" } }, intro, btn, merk, lf)));
          s.sfx.pop();
          s.step(async () => { for (const it of items) { s.sfx.note(it.v); s.tween({ from: 0, to: 1, dur: 600, ease: "out", update: g => { it.g = g; place(); } }); await s.wait(180); } await s.wait(600); items.forEach(it => (it.g = 1)); place(); });
          s.step(async () => { s.show(btn, "pop"); await morph(1); s.say("Gedreht! Jetzt liegen die Balken, und die Namen haben viel Platz."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.show(lf, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Experiment: Würfeln",
        say: "Wir würfeln und zählen, wie oft jede Augenzahl kommt. Probier es selbst!",
        build(s) {
          const die = s.svg(190, 190);
          const dieG = s.el("g"); die.append(dieG);
          const PIPS = { 1: [[2, 2]], 2: [[1, 1], [3, 3]], 3: [[1, 1], [2, 2], [3, 3]], 4: [[1, 1], [3, 1], [1, 3], [3, 3]], 5: [[1, 1], [3, 1], [2, 2], [1, 3], [3, 3]], 6: [[1, 1], [3, 1], [1, 2], [3, 2], [1, 3], [3, 3]] };
          function face(n, rot = 0) {
            dieG.innerHTML = "";
            dieG.setAttribute("transform", `rotate(${rot} 95 95)`);
            dieG.append(s.el("rect", { x: 25, y: 25, width: 140, height: 140, rx: 28, fill: "#fff", stroke: P.ink, "stroke-width": 5 }));
            PIPS[n].forEach(([a, b]) => dieG.append(s.el("circle", { cx: 25 + a * 35, cy: 25 + b * 35, r: 13, fill: n === 1 ? P.red : P.ink })));
          }
          face(6);
          const counts = [0, 0, 0, 0, 0, 0];
          const ch = colChart(s, { w: 660, h: 420, data: [1, 2, 3, 4, 5, 6].map(n => ({ l: String(n), v: 0, c: P.teal })), yMax: 5, yStep: 1, L: 56, Tp: 44, bottom: 64, labSize: 24 });
          ch.svg.append(T(s, 16, 24, "Anzahl", { "font-size": 19, "text-anchor": "start", fill: P.teal }), T(s, 652, 414, "Augenzahl", { "font-size": 19, "text-anchor": "end", fill: P.teal }));
          const total = s.h("p", { class: "h2 mono", style: { textAlign: "center" } }, "Würfe: 0");
          function nice(m) { for (const st of [1, 2, 5, 10, 20, 50, 100]) if (st * 5 >= m) return st; return 200; }
          function refresh() {
            const m = Math.max(5, ...counts), st = nice(m);
            if (st * 5 !== ch.yMax) ch.rescale(st * 5, st);
            counts.forEach((c, i) => ch.set(i, c));
            total.textContent = "Würfe: " + counts.reduce((a, b) => a + b, 0);
          }
          let busy = false;
          async function roll(n) {
            if (busy) return; busy = true;
            if (n === 1) {
              s.sound("wuerfeln", { vol: .7 });
              for (let k = 0; k < 8; k++) { face(1 + Math.floor(Math.random() * 6), (Math.random() - .5) * 40); await s.wait(70); }
              const r = 1 + Math.floor(Math.random() * 6); face(r); counts[r - 1]++; s.sfx.pop(); refresh();
            } else {
              const per = Math.max(1, Math.round(n / 25));
              for (let k = 0; k < n; k += per) {
                let r = 1;
                for (let j = 0; j < per && k + j < n; j++) { r = 1 + Math.floor(Math.random() * 6); counts[r - 1]++; }
                face(r, (Math.random() - .5) * 30); refresh(); s.sfx.tick(); await s.wait(45);
              }
              face(1 + Math.floor(Math.random() * 6)); s.sfx.ding();
            }
            busy = false;
          }
          const B = (t, n, solid) => s.h("button", { class: "btn" + (solid ? " solid" : ""), style: { width: "100%" }, onclick: () => { s.sfx.click(); roll(n); } }, t);
          const reset = s.h("button", { class: "btn", style: { width: "100%" }, onclick: () => { if (busy) return; counts.fill(0); refresh(); s.sfx.swoosh(); } }, "↺ Von vorn");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Jede Augenzahl hat die gleiche Chance. Bei wenigen Würfen sind die Säulen sehr verschieden – bei ", s.h("b", null, "vielen"), " Würfen werden sie fast gleich hoch.");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "330px 1fr", gap: "24px", alignItems: "center" },
            s.h("div", { class: "stack", style: { alignItems: "center", gap: "12px" } }, s.h("div", { class: "a-bounce" }, die), total, B("1× würfeln", 1, true), B("10× würfeln", 10), B("100× würfeln", 100), reset),
            s.h("div", { class: "stack", style: { gap: "10px" } }, s.h("div", { class: "a-fade" }, ch.svg), merk)));
          s.sfx.pop();
          s.step(async () => { await roll(1); s.say("Einmal gewürfelt. Eine Säule ist jetzt eins hoch."); });
          s.step(async () => { await roll(30); s.say("Dreißigmal gewürfelt. Die Säulen sind noch ziemlich unterschiedlich."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.say("Würfle hundertmal und sieh, was passiert!"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Diagramme lesen: Berlin-Wetter",
        say: "Dieses Säulendiagramm zeigt, wie warm es in Berlin im Durchschnitt in jedem Monat ist.",
        build(s) {
          const M = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"], LONG = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
          const V = [1, 2, 5, 10, 14, 18, 20, 19, 15, 10, 5, 2];
          const col = v => { const t = v / 20; const a = [29, 91, 208], b = [238, 122, 26], c = [220, 59, 42]; const m = t < .6 ? a.map((x, i) => x + (b[i] - x) * (t / .6)) : b.map((x, i) => x + (c[i] - x) * ((t - .6) / .4)); return `rgb(${m.map(Math.round).join(",")})`; };
          const ch = colChart(s, { w: 680, h: 510, data: M.map((m, i) => ({ l: m, v: V[i], c: col(V[i]) })), yMax: 25, yStep: 5, L: 52, Tp: 56, bottom: 46, bw: 0.66, valSize: 19 });
          ch.svg.append(T(s, 12, 26, "°C (Grad Celsius)", { "font-size": 19, "text-anchor": "start", fill: P.teal }));
          const X = i => ch.L + ch.slot * i + ch.slot / 2;
          const sun = later(fb(s.el("g"))); sun.append(s.el("circle", { cx: X(6), cy: ch.Y(20) - 54, r: 13, fill: P.yellow, stroke: "#f0b400", "stroke-width": 3 })); for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; sun.append(s.el("line", { x1: X(6) + 17 * Math.cos(a), y1: ch.Y(20) - 54 + 17 * Math.sin(a), x2: X(6) + 22 * Math.cos(a), y2: ch.Y(20) - 54 + 22 * Math.sin(a), stroke: "#f0b400", "stroke-width": 3, "stroke-linecap": "round" })); }
          const snow = later(fb(T(s, X(0), ch.Y(1) - 34, "❄", { "font-size": 26, fill: P.blue })));
          const diff = later(s.el("g"));
          diff.append(s.el("line", { x1: X(0) - 18, x2: X(6) + 22, y1: ch.Y(20), y2: ch.Y(20), stroke: P.red, "stroke-width": 2.5, "stroke-dasharray": "6 6" }), s.el("line", { x1: X(0) - 18, x2: X(0) + 40, y1: ch.Y(1), y2: ch.Y(1), stroke: P.red, "stroke-width": 2.5, "stroke-dasharray": "6 6" }),
            s.el("line", { x1: X(0) + 30, x2: X(0) + 30, y1: ch.Y(20) + 4, y2: ch.Y(1) - 4, stroke: P.red, "stroke-width": 3.5, "marker-start": "", "stroke-linecap": "round" }),
            s.el("polygon", { points: `${X(0) + 30},${ch.Y(20) + 2} ${X(0) + 23},${ch.Y(20) + 16} ${X(0) + 37},${ch.Y(20) + 16}`, fill: P.red }), s.el("polygon", { points: `${X(0) + 30},${ch.Y(1) - 2} ${X(0) + 23},${ch.Y(1) - 16} ${X(0) + 37},${ch.Y(1) - 16}`, fill: P.red }),
            T(s, X(0) + 40, ch.Y(13), "19 °C", { "font-size": 22, fill: P.red, "text-anchor": "start" }));
          ch.svg.append(diff, sun, snow);
          const info = s.h("p", { class: "h2", style: { color: P.teal, minHeight: "38px" } }, "Tippe auf einen Monat!");
          ch.bars.forEach((b, i) => { b.rect.style.cursor = "pointer"; b.rect.addEventListener("click", () => { info.textContent = `${LONG[i]}: etwa ${V[i]} °C`; s.sfx.note(V[i] - 8); ch.bars.forEach((x, j) => x.rect.setAttribute("opacity", j === i ? 1 : .55)); }); });
          const r1 = s.h("p", { class: "t later" }, "☀️ Am wärmsten: ", s.h("b", null, "Juli (20 °C)"), ". ❄️ Am kältesten: ", s.h("b", null, "Januar (1 °C)"), ".");
          const r2 = s.h("p", { class: "t later" }, "Unterschied: 20 °C − 1 °C = ", s.h("b", { class: "red" }, "19 °C"), ".");
          const r3 = s.h("p", { class: "t later" }, "April und Oktober sind gleich warm: je 10 °C.");
          const lf = life(s, { class: "life later" }, s.h("p", { class: "small" }, "Wetter-App, Klimadiagramm im GeWi-Buch, Urlaub planen: Wann ist es am Meer schön warm?"));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "680px 1fr", gap: "22px", alignItems: "center" },
            s.h("div", { class: "stack", style: { gap: "0" } }, s.h("p", { class: "small pencil" }, "Durchschnitt 1991–2020, gerundet"), ch.svg),
            s.h("div", { class: "stack", style: { gap: "14px" } }, info, r1, r2, r3, lf)));
          s.sfx.pop();
          s.step(async () => { for (let i = 0; i < 12; i++) { ch.grow(i, V[i], 500); s.sfx.note(V[i] - 6, 0.12); await s.wait(110); } await s.wait(500); });
          s.step(async () => { s.show(sun, "pop"); s.sfx.chord([0, 4, 7]); await s.show(snow, "pop", 200); await s.show(r1, "up"); s.say("Am wärmsten ist der Juli, am kältesten der Januar."); });
          s.step(async () => { s.sfx.zap(); await s.show(diff, "fade"); await s.show(r2, "up"); s.say("Der Juli ist neunzehn Grad wärmer als der Januar."); });
          s.step(async () => { s.sfx.pop(); await s.show(r3, "up"); await s.show(lf, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Häufigster und seltenster Wert",
        say: "Der häufigste Wert hat die höchste Säule. Der seltenste Wert hat die niedrigste.",
        build(s) {
          const sets = [
            { t: "Schulweg der 5a", d: [["🚇", 9], ["🚲", 7], ["🚌", 5], ["🚶", 4], ["🚗", 3]], names: ["U-Bahn", "Fahrrad", "Bus", "zu Fuß", "Auto"], ls: 26 },
            { t: "30-mal gewürfelt", d: [["1", 4], ["2", 6], ["3", 5], ["4", 3], ["5", 7], ["6", 5]], names: ["die 1", "die 2", "die 3", "die 4", "die 5", "die 6"], ls: 22 },
            { t: "Schuhgrößen in der 5a", d: [["34", 3], ["35", 5], ["36", 8], ["37", 6], ["38", 4], ["39", 2]], names: ["Größe 34", "Größe 35", "Größe 36", "Größe 37", "Größe 38", "Größe 39"], ls: 20 },
          ];
          const cards = sets.map((st, k) => {
            const ch = colChart(s, { w: 300, h: 330, data: st.d.map(([l]) => ({ l, v: 0, c: "#8fb8c4" })), yMax: 10, yStep: 2, L: 36, Tp: 54, bottom: 42, labSize: st.ls, valSize: 19 });
            const vals = st.d.map(x => x[1]), mx = vals.indexOf(Math.max(...vals)), mn = vals.indexOf(Math.min(...vals));
            const cx = i => ch.L + ch.slot * i + ch.slot / 2;
            const crown = later(fb(s.el("polygon", { points: [[-14, 0], [-14, -16], [-7, -8], [0, -20], [7, -8], [14, -16], [14, 0]].map(([a, b]) => `${cx(mx) + a},${ch.Y(vals[mx]) - 32 + b}`).join(" "), fill: P.yellow, stroke: "#c99a00", "stroke-width": 2 })));
            const snail = later(fb(s.el("circle", { cx: cx(mn), cy: ch.Y(vals[mn]) - 40, r: 8, fill: "none", stroke: P.red, "stroke-width": 3 })));
            ch.svg.append(crown, snail);
            const l1 = s.h("p", { class: "small later", style: { color: P.green } }, "häufigster: ", s.h("b", null, `${st.names[mx]} (${vals[mx]}×)`));
            const l2 = s.h("p", { class: "small later", style: { color: P.red } }, "seltenster: ", s.h("b", null, `${st.names[mn]} (${vals[mn]}×)`));
            const c = ex(s, st.t, { class: "ex " + (k ? "later" : "a-up"), style: { display: "flex", flexDirection: "column", gap: "4px", alignItems: "center" } }, ch.svg, l1, l2);
            c.run = async () => {
              for (let i = 0; i < vals.length; i++) { ch.grow(i, vals[i], 450); s.sfx.note(vals[i], 0.1); await s.wait(110); }
              await s.wait(500);
              ch.bars[mx].rect.setAttribute("fill", P.green); s.show(crown, "bounce"); s.sfx.chord([0, 4, 7, 12]); await s.show(l1, "up");
              ch.bars[mn].rect.setAttribute("fill", P.red); s.show(snail, "pop"); s.sfx.boing(); await s.show(l2, "up");
            };
            return c;
          });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Der ", s.h("b", null, "häufigste Wert"), " kommt am öftesten vor – höchste Säule, größte Zahl in der Tabelle. Der ", s.h("b", null, "seltenste Wert"), " kommt am wenigsten vor.");
          s.add(root(s, "stack", { justifyContent: "space-between" }, s.h("div", { class: "cols3", style: { gap: "18px" } }, ...cards), merk));
          s.sfx.pop();
          s.step(async () => { await cards[0].run(); s.say("Die meisten Kinder fahren mit der U-Bahn. Mit dem Auto kommen die wenigsten."); });
          s.step(async () => { await s.show(cards[1], "up"); await cards[1].run(); s.say("Beim Würfeln kam die Fünf am häufigsten, die Vier am seltensten."); });
          s.step(async () => { await s.show(cards[2], "up"); await cards[2].run(); s.say("Die häufigste Schuhgröße ist sechsunddreißig."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Daten ordnen",
        say: "Wie viele Bahnhöfe hat jede U-Bahn-Linie in Berlin? Geordnet sieht man es sofort.",
        build(s) {
          const lines = [["U1", 13, "#7DAD4C"], ["U2", 29, "#DA421E"], ["U3", 24, "#16683D"], ["U4", 5, "#F0D722"], ["U5", 26, "#7E5330"], ["U6", 29, "#8C6DAB"], ["U7", 40, "#528DBA"], ["U8", 24, "#224F86"], ["U9", 18, "#F3791D"]];
          const svg = s.svg(620, 560), PITCH = 61, K = 12;
          svg.append(s.el("line", { x1: 76, x2: 76, y1: 0, y2: 560, stroke: P.ink, "stroke-width": 3 }));
          const rows = lines.map(([n, v, c], i) => {
            const outer = s.el("g", { transform: `translate(0,${8 + i * PITCH})` });
            const inner = s.el("g", { class: "a-left", style: { "--d": i * 70 + "ms" } });
            inner.append(s.el("rect", { x: 4, y: 4, width: 60, height: 42, rx: 8, fill: c }), T(s, 34, 33, n, { "font-size": 22, fill: n === "U4" ? P.ink : "#fff" }),
              s.el("rect", { x: 78, y: 8, width: v * K, height: 34, rx: 5, fill: c, opacity: .85 }), T(s, 78 + v * K + 10, 33, String(v), { "font-size": 22, "text-anchor": "start" }));
            outer.append(inner); svg.append(outer);
            return { n, v, outer, pos: i };
          });
          let mode = "linie", busy = false;
          async function sortBy(m, train) {
            if (busy || m === mode) return; busy = true; mode = m;
            const sorted = m === "linie" ? [...rows].sort((a, b) => a.n.localeCompare(b.n)) : [...rows].sort((a, b) => b.v - a.v);
            if (train) s.sound("ubahn-train", { vol: .45, dur: 2.5 }); else s.sfx.whoosh();
            await Promise.all(sorted.map((r, ni) => { const y0 = 8 + r.pos * PITCH, y1 = 8 + ni * PITCH; r.pos = ni; return s.tween({ from: 0, to: 1, dur: 900, update: k => r.outer.setAttribute("transform", `translate(${18 * Math.sin(Math.PI * k)},${y0 + (y1 - y0) * k})`) }); }));
            s.sfx.snap(); b1.classList.toggle("solid", m === "linie"); b2.classList.toggle("solid", m === "groesse"); busy = false;
          }
          const b1 = s.h("button", { class: "btn solid", onclick: () => { s.sfx.click(); sortBy("linie"); } }, "nach Linie");
          const b2 = s.h("button", { class: "btn", onclick: () => { s.sfx.click(); sortBy("groesse"); } }, "nach Anzahl");
          const res = s.h("p", { class: "t later" }, "Am meisten: ", s.h("b", null, "U7 mit 40"), ". Am wenigsten: ", s.h("b", null, "U4 mit 5"), " Bahnhöfen.");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, s.h("b", null, "Ordnen"), " nach einem Merkmal (Größe, ABC, Datum) macht Daten übersichtlich.");
          const lf = life(s, { class: "life later" }, s.h("p", { class: "small" }, "Bundesliga-Tabelle: nach Punkten. Klassenliste: nach ABC. Geburtstagskalender: nach Datum."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "620px 1fr", gap: "24px", alignItems: "center" }, svg,
            s.h("div", { class: "stack", style: { gap: "16px" } }, s.h("p", { class: "t a-up" }, s.h("b", null, "Bahnhöfe pro U-Bahn-Linie"), " in Berlin"), s.h("p", { class: "small pencil" }, "Ordnen:"), s.h("div", { class: "row" }, b1, b2), res, merk, lf)));
          s.sfx.pop();
          s.step(async () => { await sortBy("groesse", true); s.show(res, "up"); s.sfx.ding(); s.say("Der Größe nach: Die U7 hat die meisten Bahnhöfe, die U4 die wenigsten."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.show(lf, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Darstellungen wechseln",
        say: "Dieselben Daten kann man als Tabelle, als Diagramm oder als Text zeigen. Jede Darstellung kann etwas besonders gut.",
        build(s) {
          const D = [["Mo", 30], ["Di", 45], ["Mi", 30], ["Do", 60], ["Fr", 90], ["Sa", 120], ["So", 75]];
          const td = (t, st) => s.h("td", { style: Object.assign({ padding: "4px 14px", borderBottom: "2px solid var(--line)", fontSize: "21px" }, st || {}) }, t);
          const tbl = s.h("table", { style: { borderCollapse: "collapse", width: "100%" } }, s.h("tr", null, td(s.h("b", null, "Tag"), { borderBottom: "3px solid var(--ink)" }), td(s.h("b", null, "Minuten"), { borderBottom: "3px solid var(--ink)", textAlign: "right" })), ...D.map(([d, v]) => s.h("tr", null, td(d), td(String(v), { textAlign: "right", fontWeight: 700 }))));
          const ch = colChart(s, { w: 300, h: 300, data: D.map(([d]) => ({ l: d, v: 0, c: P.teal })), yMax: 120, yStep: 30, L: 44, Tp: 40, bottom: 40, bw: 0.7, valSize: 19 });
          ch.svg.append(T(s, 4, 22, "Minuten", { "font-size": 19, "text-anchor": "start", fill: P.teal }));
          const txt = s.h("p", { class: "t" }, "Unter der Woche meist 30 bis 60 Minuten. Am Freitag mehr. Am ", s.h("b", null, "Samstag am meisten: 120 Minuten = 2 Stunden"), ".");
          const good = t => s.h("p", { class: "small later", style: { marginTop: "auto", color: P.green, fontWeight: 700 } }, "Gut für: " + t);
          const g1 = good("genaue Werte nachschauen"), g2 = good("auf einen Blick vergleichen"), g3 = good("eine wichtige Aussage");
          const card = (lab, body, g, first) => ex(s, lab, { class: "ex " + (first ? "a-up" : "later"), style: { display: "flex", flexDirection: "column", gap: "10px" } }, body, g);
          const c1 = card("1 · Tabelle", tbl, g1, true), c2 = card("2 · Säulendiagramm", ch.svg, g2), c3 = card("3 · Text", txt, g3);
          const head = s.h("p", { class: "t a-up" }, s.h("b", null, "Julians Bildschirmzeit"), " in einer Woche (Beispiel)");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 20px 12px" } }, "Gleiche Daten – drei Darstellungen. Nimm die, die deine Frage am schnellsten beantwortet.");
          s.add(root(s, "stack", { gap: "12px" }, head, s.h("div", { class: "cols3", style: { gap: "18px", flex: 1 } }, c1, c2, c3), merk));
          s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); await s.show(c2, "right"); for (let i = 0; i < 7; i++) { ch.grow(i, D[i][1], 500); s.sfx.note(i * 2, 0.1); await s.wait(120); } await s.wait(400); s.say("Im Diagramm sieht man sofort: Samstag ist die höchste Säule."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(c3, "right"); s.sound("pencil-write"); s.say("Im Text steht nur das Wichtigste."); });
          s.step(async () => { for (const g of [g1, g2, g3]) { s.show(g, "up"); s.sfx.pop(); await s.wait(250); } s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Vorsicht: Diagramm-Tricks!",
        say: "Achtung! Mit einer abgeschnittenen Achse sieht ein kleiner Unterschied riesig aus.",
        build(s) {
          const A = 52, Bv = 48;
          function chart(yMinInit) {
            const W = 470, H = 244, L = 56, Bt = 206, Tp = 24, svg = s.svg(W, H);
            const grid = s.el("g"), bars = s.el("g"); svg.append(grid, bars);
            const axisY = s.el("line", { x1: L, x2: L, y1: Tp - 12, y2: Bt, stroke: P.ink, "stroke-width": 3 }), axisX = s.el("line", { x1: L, x2: W - 10, y1: Bt, y2: Bt, stroke: P.ink, "stroke-width": 3 });
            const zig = s.el("path", { d: `M${L - 9},${Bt - 18} l18,-6 l-18,-6 l18,-6`, fill: "none", stroke: P.red, "stroke-width": 3 });
            const ring = later(s.el("ellipse", { cx: L - 24, cy: Bt + 2, rx: 30, ry: 20, fill: "none", stroke: P.red, "stroke-width": 3 }));
            svg.append(axisY, axisX, zig, ring);
            const rA = s.el("rect", { rx: 6, fill: P.teal }), rB = s.el("rect", { rx: 6, fill: P.orange });
            const tA = T(s, 0, 0, "52 Becher", { "font-size": 19 }), tB = T(s, 0, 0, "48 Becher", { "font-size": 19 });
            const lA = T(s, 170, Bt + 28, "5a", { "font-size": 22 }), lB = T(s, 350, Bt + 28, "5b", { "font-size": 22 });
            bars.append(rA, rB, tA, tB, lA, lB);
            function set(yMin) {
              const yMax = yMin === 0 ? 60 : 54, range = yMax - yMin, st = range <= 12 ? 2 : range <= 30 ? 5 : 10;
              const Y = v => Bt - ((v - yMin) / range) * (Bt - Tp);
              grid.innerHTML = "";
              for (let v = Math.ceil(yMin / st) * st; v <= yMax; v += st) grid.append(s.el("line", { x1: L, x2: W - 10, y1: Y(v), y2: Y(v), stroke: "#e1e8ef", "stroke-width": 2 }), T(s, L - 8, Y(v) + 7, String(v), { "font-size": 19, fill: v === yMin ? P.red : P.pencil, "text-anchor": "end" }));
              if (yMin % st) grid.append(T(s, L - 8, Bt + 7, String(yMin), { "font-size": 19, fill: P.red, "text-anchor": "end" }));
              [[rA, tA, 170, A], [rB, tB, 350, Bv]].forEach(([r, t, x, v]) => { r.setAttribute("x", x - 50); r.setAttribute("width", 100); r.setAttribute("y", Y(v)); r.setAttribute("height", Bt - Y(v)); t.setAttribute("x", x); t.setAttribute("y", Y(v) - 8); });
              zig.style.visibility = yMin > 0 ? "visible" : "hidden";
              return (A - yMin) / (Bv - yMin);
            }
            set(yMinInit);
            return { svg, set, ring };
          }
          const honest = chart(0), trick = chart(46);
          const ratio = s.h("p", { class: "t", style: { color: P.red, minHeight: "34px" } });
          const upd = v => { const r = trick.set(v); ratio.innerHTML = ""; ratio.append("Säule 5a ist hier ", s.h("b", null, s.fmt(r, 1) + "-mal"), " so hoch wie 5b."); };
          upd(46);
          const sl = s.slider({ label: "Hochachse beginnt bei", min: 0, max: 46, value: 46, onInput: upd });
          const c1 = ex(s, "Ehrlich: Achse beginnt bei 0", { class: "ex a-left", style: { display: "flex", flexDirection: "column", gap: "6px" } }, honest.svg, s.h("p", { class: "t", style: { color: P.green } }, "Fast gleich hoch: nur ", s.h("b", null, "4 Becher"), " Unterschied."));
          const c2 = ex(s, "Trick: Achse abgeschnitten!", { class: "ex later", style: { display: "flex", flexDirection: "column", gap: "6px", borderColor: P.red } }, trick.svg, ratio, sl);
          const merk = s.h("div", { class: "merk later", style: { fontSize: "20px", padding: "10px 18px 12px" } }, "Immer prüfen: ", s.h("b", null, "Wo beginnt die Hochachse?"), " Ein Zickzack-Zeichen heißt: Hier fehlt ein Stück.");
          const lf = life(s, { class: "life later", style: { padding: "10px 18px" } }, s.h("p", { class: "small" }, "Werbung und Videos im Netz: Wer etwas verkaufen will, schneidet gern die Achse ab."));
          s.add(root(s, "stack", { justifyContent: "space-between" }, s.h("p", { class: "t a-up" }, s.h("b", null, "Saftverkauf beim Schulfest:"), " 5a verkauft 52 Becher, 5b verkauft 48."), s.h("div", { class: "cols", style: { gap: "22px" } }, c1, c2), s.h("div", { class: "cols", style: { gap: "22px" } }, merk, lf)));
          s.sfx.pop();
          s.step(async () => { s.sfx.boing(); await s.show(c2, "right"); s.say("Rechts sieht es aus, als hätte die 5a dreimal so viel verkauft!"); });
          s.step(async () => { s.sfx.zap(); await s.show(trick.ring, "draw"); s.say("Der Trick: Die Achse beginnt erst bei sechsundvierzig. Schieb den Regler auf null!"); });
          s.step(async () => { s.sfx.ding(); s.show(merk, "up"); await s.show(lf, "up", 150); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Daten im Alltag",
        say: "Tabellen, Strichlisten und Diagramme begegnen dir jeden Tag.",
        build(s) {
          const card = (lab, txt, vis, first) => s.h("div", { class: "life" + (first ? " a-up" : " later"), style: { display: "flex", flexDirection: "column", gap: "12px", padding: "12px 18px", justifyContent: "center" } }, s.h("span", { style: LBL }, lab), vis, s.h("p", { class: "small" }, txt));
          // Tabelle
          const td = (t, st) => s.h("td", { style: Object.assign({ padding: "4px 12px", borderBottom: "1px solid var(--line)", fontSize: "20px" }, st || {}) }, t);
          const liga = s.h("table", { style: { borderCollapse: "collapse", background: "#fff", borderRadius: "8px", width: "100%" } }, s.h("tr", null, td(s.h("b", null, "Pl.")), td(s.h("b", null, "Verein")), td(s.h("b", null, "Punkte"))),
            ...[["1.", "SV Kreuzberg", 34], ["2.", "FC Spree", 31], ["3.", "Tegel United", 29], ["4.", "Neukölln 04", 27]].map(([a, b, c]) => s.h("tr", null, td(a), td(b), td(String(c), { textAlign: "right", fontWeight: 700 }))));
          // Wetter
          const w = s.svg(470, 150), WD = [["Mo", 14, "☀️"], ["Di", 16, "☀️"], ["Mi", 11, "🌧️"], ["Do", 9, "🌧️"], ["Fr", 12, "⛅"]];
          const wBars = WD.map(([d, v, e], i) => { const x = 24 + i * 85, r = s.el("rect", { x, y: 120, width: 56, height: 0, rx: 5, fill: v > 12 ? P.orange : P.blue }), tv = T(s, x + 28, 0, v + "°", { "font-size": 19 }); tv.style.opacity = 0; w.append(r, tv, T(s, x + 28, 145, d, { "font-size": 19, "font-weight": 600 }), T(s, x + 84, 28, e, { "font-size": 22, "text-anchor": "end" })); return [r, tv, v]; });
          // Klassensprecherwahl
          const vote = s.h("div", { class: "stack", style: { gap: "2px" } }, ...[["Mia", 11, P.violet], ["Jonte", 9, P.blue], ["Maggie", 8, P.green]].map(([n, k, c]) => { const t = tally(s, k, c, 250, 42); return s.h("div", { style: { display: "grid", gridTemplateColumns: "90px 1fr", alignItems: "center" } }, s.h("b", { style: { color: c, fontSize: "20px" } }, n), t.svg); }));
          // Bildschirmzeit
          const bz = s.svg(470, 150), BZ = [["Spiele", 45, P.red], ["Musik", 30, P.violet], ["Lernen", 20, P.green]];
          const bzBars = BZ.map(([n, v, c], i) => { const y = 6 + i * 48, r = s.el("rect", { x: 96, y, width: 0, height: 36, rx: 5, fill: c }), tv = T(s, 0, y + 25, v + " min", { "font-size": 19, "text-anchor": "start" }); tv.style.opacity = 0; bz.append(T(s, 86, y + 25, n, { "font-size": 19, "text-anchor": "end", "font-weight": 600 }), r, tv); return [r, tv, v]; });
          const cards = [
            card("Im Alltag · Tabelle", "Die Bundesliga-Tabelle ist nach Punkten geordnet. (Beispiel-Vereine)", liga, true),
            card("Im Alltag · Säulendiagramm", "Die Wetter-App zeigt die Temperaturen der nächsten Tage.", w),
            card("Im Alltag · Strichliste", "Klassensprecher-Wahl: Jede Stimme ein Strich an der Tafel.", vote),
            card("Im Alltag · Balkendiagramm", "Das Handy zeigt, wofür du es heute benutzt hast.", bz),
          ];
          s.add(root(s, "cols", { gridTemplateRows: "1fr 1fr", gap: "16px 22px" }, ...cards));
          s.sfx.pop();
          s.step(async () => { await s.show(cards[1], "right"); for (const [r, tv, v] of wBars) { s.sfx.note(v - 8, 0.1); await s.tween({ from: 0, to: v * 5.2, dur: 260, update: hh => { r.setAttribute("y", 120 - hh); r.setAttribute("height", hh); tv.setAttribute("y", 120 - hh - 6); } }); tv.style.opacity = 1; } });
          s.step(async () => { s.sound("chalk-write", { vol: .5, dur: 2.5 }); await s.show(cards[2], "left"); s.say("Mia hat die meisten Stimmen."); });
          s.step(async () => { await s.show(cards[3], "right"); for (const [r, tv, v] of bzBars) { s.sfx.pop(); await s.tween({ from: 0, to: v * 6, dur: 400, update: ww => { r.setAttribute("width", ww); tv.setAttribute("x", 104 + ww); } }); tv.style.opacity = 1; } s.sfx.success(); });
        },
      },
    ],
  });
})();
