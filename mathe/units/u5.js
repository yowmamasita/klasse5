/* Kapitel 5 – Brüche */
(() => {
  const UC = "#dc2626", SOFT = "#fde6e3";
  const INK = "#1b2740", PEN = "#5d6678", BLUE = "#1d5bd0", RED = "#dc3b2a", GREEN = "#138a5a",
    VIOLET = "#7b4fd6", ORANGE = "#ee7a1a", YEL = "#ffd94a", LINE = "#c8d3de";
  if (!document.getElementById("u5css")) {
    const st = document.createElement("style"); st.id = "u5css";
    st.textContent = `.fb5{transform-box:fill-box;transform-origin:center}
.u5f{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;line-height:1.02;margin:0 .08em;font-variant-numeric:tabular-nums}
.u5f>span:first-child{border-bottom:.075em solid currentColor;padding:0 .14em .05em}
.u5f>span:last-child{padding:.05em .14em 0}
.u5m{white-space:nowrap;display:inline-flex;align-items:center;gap:.04em;vertical-align:middle}
.u5row{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.content svg.u5ns{flex-shrink:0}
.u5eq{font:700 44px/1 var(--f-display);display:flex;align-items:center;gap:14px;flex-wrap:nowrap}`;
    document.head.appendChild(st);
  }
  const lerp = (a, b, t) => a + (b - a) * t;
  const rad = d => (d * Math.PI) / 180;
  const L = el => { el.classList.add("later", "fb5"); return el; };
  const T = (s, x, y, text, o = {}) => s.el("text", Object.assign({
    x, y, "text-anchor": o.a || "middle", "dominant-baseline": "central", "font-size": o.size || 22,
    "font-weight": o.w || 700, fill: o.fill || INK, text: String(text),
  }, o.font ? { style: { fontFamily: "var(--f-display)" } } : {}));
  const nb = t => String(t).replace(/ ([=:·+−×→<>]) /g, "\u00a0$1 ").replace(/(\d) (cm|m|mm|€|ct|g|kg|min|l|h|km)(?=[\s.,)!–]|$)/g, "$1 $2");
  const isF = k => k && typeof k === "object" && k.classList && (k.classList.contains("u5f") || k.classList.contains("u5m"));
  /* keeps fractions glued to the words/operators right next to them (no line break between "3/4" and "kg") */
  const glue = (s, kids) => {
    const out = []; let run = null;
    const open = () => (run = s.h("span", { style: { whiteSpace: "nowrap" } }));
    const flush = () => { if (run) { out.push(run); run = null; } };
    kids.forEach((k, i) => {
      if (k == null || k === false) return;
      if (typeof k !== "string") { if (isF(k)) { if (!run) open(); run.append(k); } else { flush(); out.push(k); } return; }
      let t = nb(k);
      if (run) {
        t = t.replace(/^ /, "\u00a0");
        const j = t.indexOf(" ");
        if (j < 0) { run.append(t); if (!isF(kids[i + 1])) flush(); return; }
        run.append(t.slice(0, j)); flush(); t = t.slice(j);
      }
      if (isF(kids[i + 1])) {
        t = t.replace(/ $/, "\u00a0");
        const j = t.lastIndexOf(" ");
        const tail = j >= 0 ? t.slice(j + 1) : t; t = j >= 0 ? t.slice(0, j + 1) : "";
        if (t) out.push(t);
        if (tail) { open(); run.append(tail); }
      } else out.push(t);
    });
    flush();
    return out;
  };
  const P = (s, cls, ...kids) => s.h("p", { class: cls, style: kids.some(isF) ? { lineHeight: "2.4" } : null }, ...glue(s, kids));
  const F = (s, z, n, style) => s.h("span", { class: "u5f", style: style || null }, s.h("span", null, String(z)), s.h("span", null, String(n)));
  const M = (s, w, z, n) => s.h("span", { class: "u5m" }, String(w), F(s, z, n));
  const life = (s, ...kids) => s.h("div", { class: "life" }, s.h("span", { class: "exlabel" }, "Im Alltag"), ...kids);
  const merk = (s, ...kids) => s.h("div", { class: "merk later" }, ...glue(s, kids));
  /* svg fraction centred on (x,y) = the fraction bar */
  const SF = (s, x, y, z, n, size = 26, fill = INK) => {
    const g = s.el("g"), w = Math.max(String(z).length, String(n).length) * size * 0.62 + 8;
    g.append(T(s, x, y - size * 0.6, z, { size, fill }), s.el("line", { x1: x - w / 2, y1: y, x2: x + w / 2, y2: y, stroke: fill, "stroke-width": Math.max(2, size / 10), "stroke-linecap": "round" }), T(s, x, y + size * 0.64, n, { size, fill }));
    return g;
  };
  const SM = (s, x, y, w, z, n, size = 22, fill = INK) => { const g = s.el("g"); g.append(T(s, x - size * 0.55, y, w, { size: size * 1.35, fill }), SF(s, x + size * 0.5, y, z, n, size, fill)); return g; };
  const wedge = (cx, cy, r, a0, a1) => {
    const x0 = cx + r * Math.cos(rad(a0)), y0 = cy + r * Math.sin(rad(a0)), x1 = cx + r * Math.cos(rad(a1)), y1 = cy + r * Math.sin(rad(a1));
    return `M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1} Z`;
  };
  /* pie split in n, first k coloured */
  const pie = (s, cx, cy, r, n, k, col, o = {}) => {
    const g = s.el("g");
    if (n === 1) g.append(s.el("circle", { cx, cy, r, fill: k ? col : "#fff", stroke: INK, "stroke-width": 2.5 }));
    else for (let i = 0; i < n; i++) g.append(s.el("path", { d: wedge(cx, cy, r, -90 + (360 / n) * i, -90 + (360 / n) * (i + 1)), fill: i < k ? col : (o.empty || "#fff"), stroke: INK, "stroke-width": 2.5, "stroke-linejoin": "round" }));
    return g;
  };
  /* chocolate bar 4×4 at (30,30), 100 px squares */
  const choco = (s, svg) => {
    svg.append(s.el("rect", { x: 20, y: 20, width: 420, height: 420, rx: 20, fill: "#4a2c1c" }));
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) svg.append(s.el("rect", { x: 36 + c * 100, y: 36 + r * 100, width: 88, height: 88, rx: 12, fill: "#7b4a32", stroke: "#5e3523", "stroke-width": 3 }));
  };
  const cut = (s, x1, y1, x2, y2) => s.el("line", { x1, y1, x2, y2, stroke: "#fbfcf7", "stroke-width": 8, "stroke-linecap": "round" });

  Deck.unit({
    id: "u5", num: 5, title: "Brüche", color: UC, soft: SOFT,
    subtitle: "Pizza, Schokolade, Uhr und Noten in Stücken",
    blurb: "Brüche verstehen, vergleichen, erweitern, kürzen, addieren.",
    goals: ["Brüche erkennen und zeichnen (Zähler, Nenner)", "Bruchteile von Geld, Zeit und Gewicht ausrechnen", "Brüche vergleichen, erweitern und kürzen", "Brüche addieren und subtrahieren", "Brüche im Alltag finden: Uhr, Noten, BVG"],
    icon(svg, el) {
      svg.append(el("path", { d: wedge(35, 35, 27, -90, 180), fill: "#dc2626" }), el("path", { d: wedge(35, 35, 27, 180, 270), fill: "#fde6e3" }), el("circle", { cx: 35, cy: 35, r: 27, fill: "none", stroke: "#1b2740", "stroke-width": 3 }),
        el("line", { x1: 8, y1: 35, x2: 62, y2: 35, stroke: "#1b2740", "stroke-width": 2.5 }), el("line", { x1: 35, y1: 8, x2: 35, y2: 62, stroke: "#1b2740", "stroke-width": 2.5 }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Was ist ein Bruch?",
        say: "Eine Pizza wird in acht gleich große Stücke geschnitten. Du nimmst drei davon. Das sind drei Achtel.",
        build(s) {
          const svg = s.svg(500, 530), cx = 250, cy = 255, R = 200;
          svg.append(s.el("circle", { cx, cy, r: R + 6, fill: "#f1e3c8" }));
          const slices = [];
          for (let i = 0; i < 8; i++) {
            const a0 = -90 + i * 45, a1 = a0 + 45, mid = a0 + 22.5, g = s.el("g");
            g.append(s.el("path", { d: wedge(cx, cy, R, a0, a1), fill: "#f6c35b" }),
              s.el("path", { d: `M${cx + (R - 8) * Math.cos(rad(a0))} ${cy + (R - 8) * Math.sin(rad(a0))} A${R - 8} ${R - 8} 0 0 1 ${cx + (R - 8) * Math.cos(rad(a1))} ${cy + (R - 8) * Math.sin(rad(a1))}`, fill: "none", stroke: "#d9963a", "stroke-width": 16 }));
            [[130, 0], [80, 9]].forEach(([d, off]) => g.append(s.el("circle", { cx: cx + d * Math.cos(rad(mid + off)), cy: cy + d * Math.sin(rad(mid + off)), r: 17, fill: "#c0392b", stroke: "#962d22", "stroke-width": 2 })));
            g.append(s.el("circle", { cx: cx + 160 * Math.cos(rad(mid - 12)), cy: cy + 160 * Math.sin(rad(mid - 12)), r: 6, fill: "#4c7a34" }));
            svg.append(g); slices.push({ g, mid });
          }
          const cuts = [0, 45, 90, 135].map(a => s.el("line", { x1: cx + R * Math.cos(rad(a)), y1: cy + R * Math.sin(rad(a)), x2: cx - R * Math.cos(rad(a)), y2: cy - R * Math.sin(rad(a)), stroke: "#8a4b12", "stroke-width": 5, "stroke-linecap": "round", class: "later" }));
          svg.append(...cuts);
          const cap = L(T(s, 250, 508, "3 von 8 gleichen Stücken", { size: 26, fill: UC }));
          svg.append(cap);
          const fs = s.svg(560, 290);
          const zN = L(T(s, 110, 62, "3", { size: 84, fill: UC, font: 1 })), bar = s.el("line", { x1: 55, y1: 135, x2: 165, y2: 135, stroke: INK, "stroke-width": 8, "stroke-linecap": "round", class: "later" }),
            nN = L(T(s, 110, 212, "8", { size: 84, fill: BLUE, font: 1 }));
          const lab = (y, t, sub, col) => { const g = L(s.el("g")); g.append(s.el("path", { d: `M222 ${y} H180 m10 -9 l-10 9 l10 9`, fill: "none", stroke: col, "stroke-width": 3.5, "stroke-linecap": "round", "stroke-linejoin": "round" }), T(s, 234, y, t, { size: 32, fill: col, a: "start", font: 1 })); if (sub) g.append(T(s, 234, y + 36, sub, { size: 20, fill: PEN, a: "start" })); return g; };
          const lZ = lab(54, "Zähler", "zählt die Stücke, die du nimmst", UC), lB = lab(135, "Bruchstrich", null, INK), lN = lab(204, "Nenner", "nennt, in wie viele Teile geteilt ist", BLUE);
          fs.append(zN, bar, nN, lZ, lB, lN);
          const mk = merk(s, "Alle Stücke müssen ", s.h("b", null, "gleich groß"), " sein! ", s.h("b", null, "Der Nenner nennt, der Zähler zählt."));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "500px 1fr", alignItems: "center", height: "100%" } }, svg,
            s.h("div", { class: "stack" }, P(s, "big", "Drei Achtel"), fs, mk)));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.sound("pizza-schneiden", { vol: .7 }); for (const c of cuts) await s.show(c, "draw"); });
          s.step(async () => {
            for (let i = 0; i < 3; i++) {
              const { g, mid } = slices[i]; s.sfx.pop();
              await s.tween({ dur: 380, ease: "back", update: v => g.setAttribute("transform", `translate(${v * 26 * Math.cos(rad(mid))} ${v * 26 * Math.sin(rad(mid))})`) });
            }
            s.sfx.ding(); await s.show(cap, "up");
          });
          s.step(async () => { s.sfx.count(2); await s.show([zN, lZ], "pop"); s.sfx.count(4); await s.show([bar, lB], "fade"); s.sfx.count(7); await s.show([nN, lN], "pop"); s.say("Oben steht der Zähler, unten der Nenner."); });
          s.step(async () => { s.sfx.ding(); await s.show(mk, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Kreis, Rechteck, Strecke",
        say: "Denselben Bruch kann man als Kreis, als Rechteck oder als Strecke zeichnen. Probiere die Regler aus.",
        build(s) {
          let z = 3, n = 4;
          const mkCard = (title, sv) => s.h("div", { class: "card stack later", style: { gap: "6px", alignItems: "center", padding: "14px 16px" } }, P(s, "t", s.h("b", null, title)), sv);
          const sc = s.svg(300, 210), sr = s.svg(300, 210), ss = s.svg(300, 210);
          const gc = s.el("g"), gr = s.el("g"), gs = s.el("g"); sc.append(gc); sr.append(gr); ss.append(gs);
          const draw = () => {
            gc.innerHTML = ""; gc.append(pie(s, 150, 105, 98, n, z, UC));
            gr.innerHTML = "";
            const w = 280 / n;
            for (let i = 0; i < n; i++) gr.append(s.el("rect", { x: 10 + i * w, y: 30, width: w, height: 150, fill: i < z ? "#8b4a2b" : "#f3e5da", stroke: "#4a2c1c", "stroke-width": 3 }));
            gs.innerHTML = "";
            gs.append(s.el("line", { x1: 20, y1: 120, x2: 280, y2: 120, stroke: LINE, "stroke-width": 10, "stroke-linecap": "round" }),
              s.el("line", { x1: 20, y1: 120, x2: 20 + (260 * z) / n, y2: 120, stroke: UC, "stroke-width": 10, "stroke-linecap": "round" }));
            for (let i = 0; i <= n; i++) gs.append(s.el("line", { x1: 20 + (260 * i) / n, y1: 106, x2: 20 + (260 * i) / n, y2: 134, stroke: INK, "stroke-width": 3 }));
            gs.append(s.el("path", { d: "M8 70 l18 -18 l18 18 v26 h-36z", fill: "#fde68a", stroke: INK, "stroke-width": 2.5 }),
              s.el("path", { d: "M258 96 v-34 h32 v34z M270 62 v-22 l16 6 l-16 6", fill: "#bfdbfe", stroke: INK, "stroke-width": 2.5 }),
              s.el("circle", { cx: 20 + (260 * z) / n, cy: 120, r: 11, fill: "#fff", stroke: UC, "stroke-width": 4 }));
            big.innerHTML = ""; big.append(F(s, z, n));
          };
          const big = s.h("div", { style: { font: "800 76px/1 var(--f-display)", color: UC } });
          const cards = [mkCard("Pizza (Kreis)", sc), mkCard("Schokolade (Rechteck)", sr), mkCard("Schulweg (Strecke)", ss)];
          draw();
          const slZ = s.slider({ label: "Zähler", min: 0, max: 4, value: 3, onInput: v => { z = v; draw(); s.sfx.pop(); } });
          const slN = s.slider({ label: "Nenner", min: 2, max: 12, value: 4, onInput: v => { n = v; slZ.input.max = n; if (z > n) slZ.set(n); draw(); s.sfx.snap(); } });
          const ctrl = s.h("div", { class: "card soft later", style: { display: "grid", gridTemplateColumns: "180px 1fr 1fr", gap: "28px", alignItems: "center", padding: "14px 24px" } },
            s.h("div", { class: "center" }, big), slZ, slN);
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "22px" } }, s.h("div", { class: "cols3" }, cards), ctrl));
          s.sfx.pop();
          s.step(async () => { s.sfx.pop(); await s.show(cards[0], "up"); s.say("Drei Viertel der Pizza."); });
          s.step(async () => { s.sfx.pop(); await s.show(cards[1], "up"); s.say("Drei Viertel der Schokolade."); });
          s.step(async () => { s.sfx.pop(); await s.show(cards[2], "up"); s.say("Drei Viertel des Schulwegs."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(ctrl, "up"); });
        },
      },
      /* 2b --------------------------------------------------------------- */
      {
        title: "Brüche zum Anfassen",
        say: "Brüche gibt es nicht nur im Heft. Pizza, Schokolade, Messbecher und Uhr sind in gleiche Teile geteilt.",
        build(s) {
          const ph = (caption, pos = "50% 50%") => ({ w: 258, h: 400, pos, caption, cls: "later" });
          const figs = [
            s.photo("pizza-8", ph("Pizza: 8 gleiche Stücke, jedes ist ein Achtel")),
            s.photo("schokolade-16", Object.assign(ph("Schokolade: 4 · 4 = 16 Stücke"), { fit: "contain", style: { background: "#f2f2f4" } })),
            s.photo("messbecher-cups", ph("Messbecher: Striche für Drittel, Halbe und Viertel", "40% 50%")),
            s.photo("bahnhofsuhr", ph("Bahnhofsuhr: 60 Minuten rundherum")),
          ];
          const mk = merk(s, "Ein Ganzes wird in ", s.h("b", null, "gleich große"), " Teile geteilt – beim Essen, beim Messen und auf der Uhr.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "22px" } },
            s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "22px", justifyContent: "center" } }, figs), mk));
          s.step(async () => { s.sound("pizza-schneiden", { vol: .6 }); await s.show(figs[0], "zoom"); });
          s.step(async () => { s.sound("schoko-knack"); await s.show(figs[1], "zoom"); });
          s.step(async () => { s.sound("water-pour", { vol: .5, dur: 1.2 }); await s.show(figs[2], "zoom"); });
          s.step(async () => { s.sound("clock-tick", { vol: .5, dur: 1.5 }); await s.show(figs[3], "zoom"); });
          s.step(async () => { s.sfx.ding(); await s.show(mk, "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Brüche am Zahlenstrahl",
        say: "Wir teilen die Strecke von null bis eins in gleiche Teile und hüpfen Stück für Stück weiter.",
        build(s) {
          const svg = s.svg(1100, 236), X = v => 80 + v * 470, Y = 150;
          svg.append(s.el("line", { x1: 60, y1: Y, x2: 1060, y2: Y, stroke: INK, "stroke-width": 3 }));
          [0, 1, 2].forEach(v => svg.append(s.el("line", { x1: X(v), y1: Y - 16, x2: X(v), y2: Y + 16, stroke: INK, "stroke-width": 4 }), T(s, X(v), 196, v, { size: 32, font: 1 })));
          const g = s.el("g"); svg.append(g);
          let arcs = [], labs = [], n = 4;
          const build = nn => {
            n = nn; g.innerHTML = ""; arcs = []; labs = [];
            for (let i = 1; i <= 2 * n; i++) {
              const x0 = X((i - 1) / n), x1 = X(i / n);
              if (i % n) g.append(s.el("line", { x1, y1: Y - 9, x2: x1, y2: Y + 9, stroke: INK, "stroke-width": 2.5 }));
              const a = s.el("path", { d: `M${x0} ${Y - 4} Q${(x0 + x1) / 2} ${Y - 36} ${x1} ${Y - 4}`, fill: "none", stroke: UC, "stroke-width": 3, class: "later" });
              const l = L(SF(s, x1, 82, i, n, n > 6 ? 19 : 22, i % n ? UC : GREEN));
              g.append(a, l); arcs.push(a); labs.push(l);
            }
          };
          const hop = async (from, to) => { for (let i = from; i < to; i++) { if (!s.alive) return; s.show(arcs[i], "draw"); s.sfx.count(i % 15); s.show(labs[i], "pop"); await s.wait(n > 6 ? 110 : 240); } };
          build(4);
          const note = P(s, "t", "");
          const btns = [2, 3, 4, 5, 6, 8, 10].map(v => s.h("button", { class: "btn", onclick: async () => { s.sfx.click(); build(v); note.innerHTML = ""; note.append("Nenner ", s.h("b", null, String(v)), `: jedes Stück ist ein ${v}tel lang.`.replace("2tel", "Halb").replace("3tel", "Drittel").replace("4tel", "Viertel").replace("5tel", "Fünftel").replace("6tel", "Sechstel").replace("8tel", "Achtel").replace("10tel", "Zehntel")); await hop(0, 2 * v); s.sfx.ding(); } }, String(v)));
          const brow = s.h("div", { class: "row later", style: { flexWrap: "nowrap" } }, P(s, "t", s.h("b", null, "Nenner:")), btns, note);
          const card = (title, ...kids) => { const c = life(s, P(s, "t", s.h("b", null, title)), P(s, "small", ...kids)); c.classList.add("later"); return c; };
          const cards = [card("Laufbahn", "1 Runde = 400 m. ", F(s, 1, 4), " Runde = 100 m, ", F(s, 3, 4), " Runde = 300 m."),
            card("Lineal", "1 cm hat 10 kleine Teile: ", F(s, 1, 10), " cm = 1 mm."),
            card("Messbecher", "Striche bei ", F(s, 1, 4), " l, ", F(s, 1, 2), " l und ", F(s, 3, 4), " l – ein Zahlenstrahl nach oben!")];
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "18px" } }, svg, brow, s.h("div", { class: "cols3" }, cards)));
          s.sfx.pop();
          s.step(async () => { await hop(0, 4); s.sfx.ding(); s.say("Vier Viertel sind ein Ganzes."); });
          s.step(async () => { await hop(4, 8); s.sfx.ding(); s.say("Acht Viertel sind zwei Ganze."); });
          s.step(async () => { s.sfx.pop(); await s.show(cards, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(brow, "up"); s.say("Wähle einen anderen Nenner."); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Bruchteile von Größen",
        say: "Drei Viertel von zwanzig Euro: erst durch vier teilen, dann mal drei nehmen.",
        build(s) {
          const svg = s.svg(520, 300);
          const rows = [];
          for (let r = 0; r < 4; r++) {
            const rg = s.el("g");
            for (let c = 0; c < 5; c++) {
              const x = 50 + c * 62, y = 40 + r * 72;
              rg.append(s.el("circle", { cx: x, cy: y, r: 27, fill: "#f4c542", stroke: "#b8860b", "stroke-width": 3 }), s.el("circle", { cx: x, cy: y, r: 20, fill: "none", stroke: "#d4a017", "stroke-width": 2 }), T(s, x, y + 1, "1 €", { size: 19, fill: "#7a5a00" }));
            }
            const band = s.el("rect", { x: 14, y: 40 + r * 72 - 33, width: 320, height: 66, rx: 33, fill: [UC, BLUE, GREEN, VIOLET][r], opacity: 0 });
            svg.append(band, rg); rows.push({ rg, band });
          }
          const brs = [0, 1, 2, 3].map(r => { const g = L(s.el("g")); g.append(s.el("path", { d: `M346 ${40 + r * 72 - 28} q10 0 10 10 v12 l8 6 l-8 6 v12 q0 10 -10 10`, fill: "none", stroke: [UC, BLUE, GREEN, VIOLET][r], "stroke-width": 3 }), T(s, 400, 40 + r * 72, "5 €", { size: 24, fill: [UC, BLUE, GREEN, VIOLET][r], font: 1 })); svg.append(g); return g; });
          const big3 = L(s.el("g")); big3.append(s.el("path", { d: "M436 12 q12 0 12 14 v80 l10 10 l-10 10 v80 q0 14 -12 14", fill: "none", stroke: INK, "stroke-width": 3.5 }), T(s, 490, 126, "15 €", { size: 26, fill: UC, font: 1 }));
          svg.append(big3);
          const l1 = P(s, "t later", s.h("b", null, "1. "), "durch den Nenner: 20 € : 4 = 5 €");
          const l2 = P(s, "t later", s.h("b", null, "2. "), "mal den Zähler: 3 · 5 € = 15 €");
          const mk = merk(s, "Bruchteil einer Größe: ", s.h("b", null, "erst durch den Nenner teilen, dann mit dem Zähler malnehmen."));
          const card = (title, ...kids) => { const c = life(s, P(s, "t", s.h("b", null, ...title)), P(s, "small", ...kids)); c.classList.add("later"); return c; };
          const cards = [card([F(s, 3, 4), " kg Mehl"], "1 kg = 1000 g. 1000 g : 4 = 250 g, 3 · 250 g = 750 g."),
            card([F(s, 2, 3), " fahren BVG"], "Von 24 Kindern fahren ", F(s, 2, 3), " mit U-Bahn oder Bus: 24 : 3 = 8, 2 · 8 = 16 Kinder."),
            card([F(s, 1, 5), " Geschenkband"], "1 m = 100 cm. 100 cm : 5 = 20 cm. Also 20 cm Band.")];
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center" } },
            s.h("div", { class: "cols", style: { gridTemplateColumns: "520px 1fr", alignItems: "center" } }, svg,
              s.h("div", { class: "stack", style: { gap: "12px" } }, s.h("p", { class: "big" }, F(s, 3, 4, { color: UC }), " von 20 €"), l1, l2, mk)),
            s.h("div", { class: "cols3" }, cards)));
          s.sfx.coin();
          s.step(async () => { s.sound("coins", { vol: .7 }); for (let r = 0; r < 4; r++) { rows[r].band.setAttribute("opacity", .22); s.show(brs[r], "left"); await s.wait(260); } await s.show(l1, "up"); });
          s.step(async () => { s.sfx.whoosh(); rows[3].rg.style.opacity = .3; rows[3].band.setAttribute("opacity", .06); brs[3].style.opacity = .35; await s.show(big3, "left"); s.sfx.success(); await s.show(l2, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(mk, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(cards, "up"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Brüche auf der Uhr",
        say: "Eine Stunde hat sechzig Minuten. Eine Viertelstunde sind fünfzehn Minuten.",
        build(s) {
          const svg = s.svg(430, 430), cx = 215, cy = 215, R = 190;
          svg.append(s.el("circle", { cx, cy, r: R, fill: "#fff", stroke: INK, "stroke-width": 7 }));
          const sector = s.el("path", { d: "", fill: UC, opacity: .28 }), full = s.el("circle", { cx, cy, r: R - 4, fill: UC, opacity: 0 });
          svg.append(sector, full);
          for (let i = 0; i < 60; i++) { const a = rad(i * 6 - 90), big = i % 5 === 0; svg.append(s.el("line", { x1: cx + (R - (big ? 22 : 12)) * Math.cos(a), y1: cy + (R - (big ? 22 : 12)) * Math.sin(a), x2: cx + (R - 5) * Math.cos(a), y2: cy + (R - 5) * Math.sin(a), stroke: INK, "stroke-width": big ? 4 : 1.5 })); }
          for (let h = 1; h <= 12; h++) { const a = rad(h * 30 - 90); svg.append(T(s, cx + 140 * Math.cos(a), cy + 140 * Math.sin(a), h, { size: 28, font: 1 })); }
          const hand = s.el("line", { x1: cx, y1: cy, x2: cx, y2: cy - 160, stroke: UC, "stroke-width": 8, "stroke-linecap": "round" });
          svg.append(hand, s.el("circle", { cx, cy, r: 11, fill: INK }));
          const line = s.h("p", { class: "h2", style: { minHeight: "64px", display: "flex", alignItems: "center", flexWrap: "wrap", gap: "6px" } });
          let m = 0, lastTick = 0, quiet = false;
          const gcd = (a, b) => (b ? gcd(b, a % b) : a);
          const setM = mm => {
            m = mm;
            if (mm >= 60) { sector.setAttribute("d", ""); full.setAttribute("opacity", .28); } else { full.setAttribute("opacity", 0); sector.setAttribute("d", mm > 0.01 ? wedge(cx, cy, R - 4, -90, -90 + mm * 6) : ""); }
            const a = rad(mm * 6 - 90); hand.setAttribute("x2", cx + 160 * Math.cos(a)); hand.setAttribute("y2", cy + 160 * Math.sin(a));
            if (Math.floor(mm) !== lastTick) { lastTick = Math.floor(mm); if (!quiet) s.sfx.tick(); }
          };
          const label = mm => {
            line.innerHTML = "";
            const g = gcd(mm, 60) || 60;
            if (mm === 0) line.append("0 min = 0 h");
            else if (mm === 60) line.append(nb("60 min = "), F(s, 60, 60), nb(" h = 1 h"));
            else { line.append(nb(`${mm} min = `), F(s, mm, 60), " h"); if (g > 1) line.append(" = ", F(s, mm / g, 60 / g, { color: UC }), " h"); }
          };
          const sweep = async to => { const f = m; quiet = true; s.sound("clock-tick", { vol: .5, dur: 1 }); await s.tween({ dur: 900, update: v => setM(lerp(f, to, v)) }); setM(to); quiet = false; label(to); s.sfx.ding(); };
          setM(0); label(0);
          const chip = (...k) => s.h("div", { class: "chip later", style: { fontSize: "22px", padding: "8px 16px" } }, ...k);
          const chips = [chip("Viertelstunde: ", F(s, 1, 4), nb(" h = 15 min")), chip("halbe Stunde: ", F(s, 1, 2), nb(" h = 30 min")), chip("Dreiviertelstunde: ", F(s, 3, 4), nb(" h = 45 min"))];
          const sl = s.slider({ label: "Minuten", min: 0, max: 60, step: 5, value: 45, fmt: v => v + " min", onInput: v => { setM(v); label(v); } });
          sl.classList.add("later");
          const lf = life(s, P(s, "small", s.h("b", null, "Fußball: "), "90 min Spielzeit, jede Halbzeit ist ", F(s, 1, 2), " des Spiels = 45 min. ", s.h("b", null, "Schulstunde: "), "45 min = ", F(s, 3, 4), " h."));
          lf.classList.add("later");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "430px 1fr", alignItems: "center", height: "100%" } }, svg,
            s.h("div", { class: "stack", style: { gap: "14px" } }, line, s.h("div", { class: "stack", style: { gap: "8px", alignItems: "flex-start" } }, chips), sl, lf)));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { await sweep(15); await s.show(chips[0], "left"); });
          s.step(async () => { await sweep(30); await s.show(chips[1], "left"); });
          s.step(async () => { await sweep(45); await s.show(chips[2], "left"); });
          s.step(async () => { s.sfx.pop(); await s.show(sl, "up"); s.sound("whistle", { vol: .6 }); await s.show(lf, "up"); s.say("Schiebe den Regler: Wie viel von einer Stunde ist das?"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Noten sind Brüche",
        say: "Ein Vier-Viertel-Takt ist ein Ganzes. Er passt eine ganze Note, zwei halbe, vier Viertel oder acht Achtel.",
        build(s) {
          const svg = s.svg(1100, 240);
          for (let i = 0; i < 5; i++) svg.append(s.el("line", { x1: 30, y1: 50 + i * 20, x2: 1070, y2: 50 + i * 20, stroke: INK, "stroke-width": 2 }));
          const ts = s.el("g", { "data-overlap-ok": "" }); ts.append(T(s, 75, 70, "4", { size: 44, font: 1 }), T(s, 75, 110, "4", { size: 44, font: 1 }));
          svg.append(ts,
            s.el("line", { x1: 112, y1: 50, x2: 112, y2: 130, stroke: INK, "stroke-width": 3 }), s.el("line", { x1: 1056, y1: 50, x2: 1056, y2: 130, stroke: INK, "stroke-width": 3 }), s.el("line", { x1: 1066, y1: 50, x2: 1066, y2: 130, stroke: INK, "stroke-width": 7 }));
          svg.append(s.el("rect", { x: 130, y: 178, width: 910, height: 50, rx: 10, fill: "#fff", stroke: LINE, "stroke-width": 2 }));
          const notesG = s.el("g"), fillG = s.el("g"); svg.append(fillG, notesG);
          const FREQ = [329.63, 349.23, 392, 440, 493.88, 523.25, 587.33, 659.25];
          const COL = { w: VIOLET, h: BLUE, q: GREEN, e: ORANGE }, LAB = { w: "1", h: "1/2", q: "1/4", e: "1/8" };
          const drawNote = (x, st, k) => {
            const y = 130 - st * 10, g = s.el("g", { class: "fb5" }), up = st < 4;
            const hollow = k === "w" || k === "h";
            g.append(s.el("ellipse", { cx: x, cy: y, rx: k === "w" ? 15 : 13, ry: 9.5, transform: `rotate(-20 ${x} ${y})`, fill: hollow ? "#fff" : INK, stroke: INK, "stroke-width": hollow ? 3.5 : 1 }));
            if (k !== "w") {
              const sx = up ? x + 12 : x - 12, ey = up ? y - 62 : y + 62;
              g.append(s.el("line", { x1: sx, y1: y, x2: sx, y2: ey, stroke: INK, "stroke-width": 3 }));
              if (k === "e") g.append(s.el("path", { d: up ? `M${sx} ${ey} q4 18 18 26 q6 6 2 18` : `M${sx} ${ey} q4 -18 18 -26 q6 -6 2 -18`, fill: "none", stroke: INK, "stroke-width": 3.5, "stroke-linecap": "round" }));
            }
            return g;
          };
          const PAT = {
            w: [{ d: 1, k: "w", st: 5 }],
            h: [{ d: .5, k: "h", st: 2 }, { d: .5, k: "h", st: 5 }],
            q: [0, 1, 2, 3].map(st => ({ d: .25, k: "q", st })),
            e: [0, 1, 2, 3, 4, 5, 6, 7].map(st => ({ d: .125, k: "e", st })),
            m: [{ d: .5, k: "h", st: 5 }, { d: .25, k: "q", st: 3 }, { d: .125, k: "e", st: 2 }, { d: .125, k: "e", st: 0 }],
          };
          let tok = 0;
          const play = async key => {
            const my = ++tok; notesG.innerHTML = ""; fillG.innerHTML = "";
            const pat = PAT[key]; let start = 0;
            for (let b = 0; b < 4; b++) s.sfx.tone(1900, 0.03, "square", 0.05, b * 0.5);
            for (const nt of pat) {
              if (!s.alive || my !== tok) return;
              const x0 = 130 + start * 910, w = nt.d * 910;
              const nn = drawNote(x0 + Math.min(w / 2, 60), nt.st, nt.k); notesG.append(nn); s.show(nn, "pop");
              const seg = s.el("rect", { x: x0 + 2, y: 181, width: 0, height: 44, rx: 8, fill: COL[nt.k], stroke: "#fff", "stroke-width": 3 });
              fillG.append(seg);
              s.sfx.tone(FREQ[nt.st], nt.d * 2 * 0.92, "triangle", 0.22);
              await s.tween({ dur: nt.d * 2000, ease: "linear", update: v => seg.setAttribute("width", Math.max(0, (w - 4) * v)) });
              if (my !== tok) return;
              fillG.append(T(s, x0 + w / 2, 203, LAB[nt.k], { size: 20, fill: "#fff" }));
              start += nt.d;
            }
          };
          const names = [["Ganze", "w"], ["Halbe", "h"], ["Viertel", "q"], ["Achtel", "e"], ["gemischt", "m"]];
          const btnRow = s.h("div", { class: "row later" }, P(s, "t", s.h("b", null, "Anhören:")), names.map(([t, k]) => s.h("button", { class: "btn", onclick: () => { s.sfx.click(); play(k); } }, "▶ " + t)));
          const py = s.svg(470, 206), pyRows = [];
          ["1", "1/2", "1/4", "1/8"].forEach((lab, r) => {
            const g = L(s.el("g")), cnt = 2 ** r, w = 440 / cnt;
            for (let i = 0; i < cnt; i++) g.append(s.el("rect", { x: 15 + i * w + 2, y: 4 + r * 50, width: w - 4, height: 44, rx: 8, fill: [VIOLET, BLUE, GREEN, ORANGE][r] }), T(s, 15 + i * w + w / 2, 26 + r * 50, lab, { size: 20, fill: "#fff" }));
            py.append(g); pyRows.push(g);
          });
          const mk = merk(s, "1 Ganze = 2 Halbe = 4 Viertel = 8 Achtel. Ein ", F(s, 4, 4), "-Takt ist genau ", s.h("b", null, "1 Ganzes"), ". Zählen wie in der Instrumentalklasse: 1 – 2 – 3 – 4!");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center" } }, svg, btnRow,
            s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 470px", gap: "24px", alignItems: "center" } }, mk, py)));
          s.sfx.pop();
          s.step(async () => { s.show(pyRows[0], "left"); await play("w"); s.say("Eine ganze Note dauert vier Schläge."); });
          s.step(async () => { s.show(pyRows[1], "left"); await play("h"); s.say("Zwei halbe Noten."); });
          s.step(async () => { s.show(pyRows[2], "left"); await play("q"); s.say("Vier Viertel."); });
          s.step(async () => { s.show(pyRows[3], "left"); await play("e"); s.say("Acht Achtel."); });
          s.step(async () => { await play("m"); s.sfx.ding(); await s.show(mk, "up"); await s.show(btnRow, "up"); s.say("Ein Halbe, ein Viertel und zwei Achtel ergeben zusammen auch ein Ganzes."); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Echte und unechte Brüche",
        say: "Ist der Zähler kleiner als der Nenner, ist es weniger als ein Ganzes. Ist er größer, ist es mehr als ein Ganzes.",
        build(s) {
          const card = (sv, frac, txt, col) => s.h("div", { class: "card stack later", style: { gap: "8px", alignItems: "center", padding: "12px 16px" } }, sv,
            s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "14px" } }, s.h("span", { style: { font: "800 48px/1 var(--f-display)", color: col } }, frac), P(s, "t", txt)));
          const s1 = s.svg(300, 150); s1.append(pie(s, 150, 75, 70, 4, 3, UC));
          const s2 = s.svg(300, 150); s2.append(pie(s, 150, 75, 70, 4, 4, GREEN));
          const s3 = s.svg(300, 150); s3.append(pie(s, 76, 75, 68, 4, 4, ORANGE), pie(s, 224, 75, 68, 4, 1, ORANGE));
          const cards = [card(s1, F(s, 3, 4), "weniger als 1: echter Bruch", UC), card(s2, F(s, 4, 4), "genau 1 Ganzes", GREEN),
            card(s3, F(s, 5, 4), s.h("span", null, "mehr als 1: unechter Bruch = ", M(s, 1, 1, 4)), ORANGE)];
          const nl = s.svg(1100, 130), X = v => 90 + v * 460, Y = 70;
          const zone1 = L(s.el("rect", { x: X(0), y: Y - 12, width: 460, height: 24, rx: 12, fill: "#fecaca" })), zone2 = L(s.el("rect", { x: X(1), y: Y - 12, width: 460, height: 24, rx: 12, fill: "#fed7aa" }));
          nl.append(zone1, zone2, s.el("line", { x1: 70, y1: Y, x2: 1040, y2: Y, stroke: INK, "stroke-width": 3 }));
          for (let i = 0; i <= 8; i++) nl.append(s.el("line", { x1: X(i / 4), y1: Y - (i % 4 ? 8 : 16), x2: X(i / 4), y2: Y + (i % 4 ? 8 : 16), stroke: INK, "stroke-width": i % 4 ? 2 : 4 }));
          [0, 1, 2].forEach(v => nl.append(T(s, X(v), 108, v, { size: 28, font: 1 })));
          const zl1 = L(T(s, X(0.5), 108, "echte Brüche", { size: 21, fill: UC })), zl2 = L(T(s, X(1.5), 108, "unechte Brüche", { size: 21, fill: ORANGE }));
          const mks = [[3, UC], [4, GREEN], [5, ORANGE]].map(([z, col]) => { const g = L(s.el("g")); g.append(s.el("circle", { cx: X(z / 4), cy: Y, r: 9, fill: col }), SF(s, X(z / 4), 26, z, 4, 20, col)); return g; });
          nl.append(zl1, zl2, ...mks);
          const mk = merk(s, s.h("b", null, "Echter Bruch:"), " Zähler kleiner als Nenner. ", s.h("b", null, "Unechter Bruch:"), " Zähler größer als Nenner – das ist mehr als ein Ganzes und lässt sich als gemischte Zahl schreiben.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center" } }, s.h("div", { class: "cols3" }, cards), nl, mk));
          s.sfx.pop();
          s.step(async () => { s.sfx.pop(); await s.show(cards[0], "up"); s.show(mks[0], "pop"); });
          s.step(async () => { s.sfx.ding(); await s.show(cards[1], "up"); s.show(mks[1], "pop"); });
          s.step(async () => { s.sfx.boing(); await s.show(cards[2], "up"); s.show(mks[2], "pop"); });
          s.step(async () => { s.sfx.whoosh(); await s.show([zone1, zone2], "fade"); await s.show([zl1, zl2], "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(mk, "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Gemischte Zahlen",
        say: "Sieben Drittel Kuchen: Je drei Drittel ergeben einen ganzen Kuchen. Es bleiben zwei Ganze und ein Drittel.",
        build(s) {
          const svg = s.svg(1100, 330), R = 70;
          const centers = [[230, 245], [550, 245], [870, 245]];
          const plates = centers.map(([x, y]) => L(s.el("circle", { cx: x, cy: y, r: R + 8, fill: "#f3f4f6", stroke: LINE, "stroke-width": 3, "stroke-dasharray": "8 6" })));
          svg.append(...plates);
          const labs = [["1", 0], ["1", 1]].map(([t, i]) => L(T(s, centers[i][0], 150, "1 Ganzes", { size: 24, fill: GREEN, font: 1 })));
          const lab3 = L(SF(s, centers[2][0], 140, 1, 3, 24, UC));
          svg.append(...labs, lab3);
          const pieces = [];
          for (let i = 0; i < 7; i++) {
            const g = s.el("g"), x = 95 + i * 152, y = 95, a = -90;
            g.append(s.el("path", { d: wedge(0, 0, R, -60, 60), fill: "#f6b8c6", stroke: "#c2185b", "stroke-width": 3, "stroke-linejoin": "round" }), s.el("circle", { cx: 46, cy: 0, r: 9, fill: "#e11d48" }));
            g.setAttribute("transform", `translate(${x} ${y}) rotate(${a})`);
            svg.append(g); pieces.push({ g, x, y, a });
          }
          const move = (p, x, y, a) => { const f = { ...p }; p.x = x; p.y = y; p.a = a; return s.tween({ dur: 650, ease: "inOut", update: v => p.g.setAttribute("transform", `translate(${lerp(f.x, x, v)} ${lerp(f.y, y, v) - Math.sin(Math.PI * v) * 40}) rotate(${lerp(f.a, a, v)})`) }); };
          const fill = async (cake, idx) => { for (let j = 0; j < idx.length; j++) { s.sfx.pop(); await move(pieces[idx[j]], centers[cake][0], centers[cake][1], -30 + j * 120); } };
          const big = s.h("div", { class: "u5eq", style: { color: UC } }, F(s, 7, 3), "=", M(s, 2, 1, 3));
          big.classList.add("later");
          const how = P(s, "t later", "7 : 3 = 2 Rest 1 → 2 Ganze und 1 Drittel.");
          const back = s.h("div", { class: "u5eq later", style: { fontSize: "34px" } }, M(s, 2, 1, 3), "=", F(s, "2 · 3 + 1", 3), "=", F(s, 7, 3));
          const lf = life(s, P(s, "small", M(s, 2, 1, 2), " Pizzen für die Party, ", M(s, 1, 1, 2), " Liter Wasser in der Flasche, ", M(s, 1, 1, 4), " Tassen Milch im Rezept."));
          lf.classList.add("later");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center" } }, svg,
            s.h("div", { class: "cols", style: { gridTemplateColumns: "1.15fr 1fr", gap: "20px", alignItems: "center" } }, s.h("div", { class: "card stack", style: { gap: "10px", padding: "12px 20px" } }, big, how, back), lf)));
          s.sfx.pop();
          s.step(async () => { await s.show(plates[0], "pop"); await fill(0, [0, 1, 2]); s.sfx.ding(); await s.show(labs[0], "pop"); });
          s.step(async () => { await s.show(plates[1], "pop"); await fill(1, [3, 4, 5]); s.sfx.ding(); await s.show(labs[1], "pop"); });
          s.step(async () => { await s.show(plates[2], "pop"); await fill(2, [6]); s.sfx.ding(); await s.show(lab3, "pop"); s.sfx.success(); await s.show(big, "zoom"); await s.show(how, "up"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(back, "up"); s.say("Rückwärts: zwei mal drei plus eins sind sieben Drittel."); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Brüche vergleichen",
        say: "Bei gleichem Nenner gewinnt der größere Zähler. Bei gleichem Zähler gewinnt der kleinere Nenner, denn die Stücke sind größer.",
        build(s) {
          const left = s.svg(470, 230);
          const bar = (y, k) => { const g = s.el("g"); for (let i = 0; i < 8; i++) g.append(s.el("rect", { x: 120 + (i % 4) * 46, y: y + Math.floor(i / 4) * 46, width: 42, height: 42, rx: 7, fill: i < k ? "#7b4a32" : "#f3e5da", stroke: "#4a2c1c", "stroke-width": 2.5 })); return g; };
          const bA = L(s.el("g")), bB = L(s.el("g"));
          bA.append(SF(s, 55, 64, 3, 8, 28, UC), bar(20, 3), T(s, 400, 64, "3 Stücke", { size: 22 }));
          bB.append(SF(s, 55, 176, 5, 8, 28, UC), bar(132, 5), T(s, 400, 176, "5 Stücke", { size: 22 }));
          left.append(bA, bB);
          const right = s.svg(470, 230);
          const pA = L(s.el("g")), pB = L(s.el("g"));
          pA.append(pie(s, 120, 90, 80, 3, 1, BLUE), SF(s, 120, 200, 1, 3, 22, BLUE));
          pB.append(pie(s, 350, 90, 80, 5, 1, BLUE), SF(s, 350, 200, 1, 5, 22, BLUE));
          right.append(pA, pB);
          const cA = s.h("div", { class: "u5eq later", style: { fontSize: "36px" } }, F(s, 5, 8), ">", F(s, 3, 8), P(s, "small", "mehr gleich große Stücke"));
          const cB = s.h("div", { class: "u5eq later", style: { fontSize: "36px" } }, F(s, 1, 3), ">", F(s, 1, 5), P(s, "small", "weniger Gäste, größere Stücke!"));
          const card = (t, sv, c) => s.h("div", { class: "card stack", style: { gap: "6px", padding: "12px 18px" } }, P(s, "t", s.h("b", null, t)), sv, c);
          const mk = merk(s, s.h("b", null, "Gleicher Nenner:"), " der größere Zähler ist mehr. ", s.h("b", null, "Gleicher Zähler:"), " der kleinere Nenner ist mehr. Also auch: ", F(s, 2, 3), " > ", F(s, 2, 5), ".");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center" } },
            s.h("div", { class: "cols", style: { gap: "20px" } }, card("Gleicher Nenner – Schokolade", left, cA), card("Gleicher Zähler – Geburtstagstorte", right, cB)), mk));
          s.sfx.pop();
          s.step(async () => { s.sfx.pop(); await s.show(bA, "left"); s.sfx.pop(); await s.show(bB, "left"); });
          s.step(async () => { s.sfx.ding(); await s.show(cA, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(pA, "zoom"); s.sfx.pop(); await s.show(pB, "zoom"); s.say("Ein Drittel oder ein Fünftel der Torte?"); });
          s.step(async () => { s.sfx.ding(); await s.show(cB, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(mk, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Erweitern: feiner schneiden",
        say: "Wir schneiden die Schokolade immer feiner. Es werden mehr Stücke, aber die Hälfte bleibt die Hälfte.",
        build(s) {
          const svg = s.svg(460, 460); choco(s, svg);
          svg.append(s.el("rect", { x: 26, y: 26, width: 204, height: 408, rx: 16, fill: YEL, opacity: .4, stroke: "#e0b400", "stroke-width": 7 }));
          const c1 = cut(s, 230, 20, 230, 440);
          const c2 = [cut(s, 20, 230, 440, 230)], c3 = [cut(s, 130, 20, 130, 440), cut(s, 330, 20, 330, 440)], c4 = [cut(s, 20, 130, 440, 130), cut(s, 20, 330, 440, 330)];
          [...c2, ...c3, ...c4].forEach(c => c.classList.add("later"));
          svg.append(c1, ...c2, ...c3, ...c4);
          const parts = [F(s, 1, 2), F(s, 2, 4), F(s, 4, 8), F(s, 8, 16)];
          const eqs = [0, 1, 2].map(() => s.h("span", { class: "later" }, "="));
          parts.slice(1).forEach(p => p.classList.add("later"));
          const chain = s.h("div", { class: "u5eq", style: { fontSize: "52px", color: UC } }, parts[0], eqs[0], parts[1], eqs[1], parts[2], eqs[2], parts[3]);
          const how = P(s, "t", "Deine Hälfte: 1 von 2 Stücken.");
          const mk = merk(s, s.h("b", null, "Erweitern:"), " Zähler und Nenner mit derselben Zahl malnehmen. Der Wert bleibt gleich – die Stücke werden nur kleiner.");
          const lf = life(s, s.h("div", { class: "cols3", style: { gap: "10px" } }, P(s, "small", s.h("b", null, "Pizza: "), F(s, 1, 2), " = ", F(s, 4, 8)), P(s, "small", s.h("b", null, "Geld: "), F(s, 1, 2), " € = ", F(s, 50, 100), " €"), P(s, "small", s.h("b", null, "Saft: "), F(s, 1, 2), " l = ", F(s, 2, 4), " l")));
          lf.classList.add("later");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "460px 1fr", alignItems: "center", height: "100%" } }, svg, s.h("div", { class: "stack", style: { gap: "18px" } }, chain, how, mk, lf)));
          s.show(svg, "zoom"); s.sfx.pop();
          const stepCut = async (cs, i, txt) => { for (const c of cs) { s.sound("schoko-knack"); await s.show(c, "draw"); } s.sfx.count(i * 2); s.show(eqs[i - 1], "fade"); await s.show(parts[i], "pop"); how.textContent = nb(txt); };
          s.step(async () => { await stepCut(c2, 1, "Zähler · 2, Nenner · 2: 2 von 4 Stücken."); });
          s.step(async () => { await stepCut(c3, 2, "Nochmal · 2: 4 von 8 Stücken."); });
          s.step(async () => { await stepCut(c4, 3, "Rittersport-Größe: 8 von 16 Stücken – immer noch die Hälfte!"); s.sfx.success(); });
          s.step(async () => { s.sfx.ding(); await s.show(mk, "up"); s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Kürzen: Stücke zusammenlegen",
        say: "Beim Kürzen legen wir Stücke zusammen. Es werden weniger, größere Stücke. Der Wert bleibt gleich.",
        build(s) {
          const svg = s.svg(460, 460); choco(s, svg);
          svg.append(s.el("rect", { x: 26, y: 26, width: 304, height: 408, rx: 16, fill: YEL, opacity: .4, stroke: "#e0b400", "stroke-width": 7 }));
          const v = [130, 230, 330].map(x => cut(s, x, 20, x, 440)), hMid = cut(s, 20, 230, 440, 230), hOut = [cut(s, 20, 130, 440, 130), cut(s, 20, 330, 440, 330)];
          svg.append(...v, hMid, ...hOut);
          const fadeOut = els => s.tween({ dur: 600, update: x => els.forEach(e => e.setAttribute("opacity", 1 - x)) });
          const parts = [F(s, 12, 16), F(s, 6, 8), F(s, 3, 4)], eqs = [0, 1].map(() => s.h("span", { class: "later" }, "="));
          parts.slice(1).forEach(p => p.classList.add("later"));
          const chain = s.h("div", { class: "u5eq", style: { fontSize: "50px", color: UC } }, parts[0], eqs[0], parts[1], eqs[1], parts[2]);
          const mk = merk(s, s.h("b", null, "Kürzen:"), " Zähler und Nenner durch dieselbe Zahl teilen. Der Wert bleibt gleich – die Stücke werden größer.");
          const tip = P(s, "t later", "Abkürzung: gleich durch den ggT(12, 16) = 4 teilen: ", F(s, 12, 16), " = ", F(s, 3, 4), ". Fertig gekürzt!");
          /* explorer: 3/4 erweitert mit k */
          let k = 1;
          const ex = s.svg(250, 130), exG = s.el("g"); ex.append(exG);
          const exF = s.h("div", { style: { font: "800 48px/1 var(--f-display)", color: UC, minWidth: "90px", textAlign: "center" } });
          const bt = {};
          const drawEx = () => {
            exG.innerHTML = "";
            exG.append(s.el("rect", { x: 8, y: 8, width: 180, height: 114, rx: 8, fill: "#fecaca" }), s.el("rect", { x: 188, y: 8, width: 54, height: 114, rx: 8, fill: "#fff" }));
            for (let i = 1; i < k; i++) exG.append(s.el("line", { x1: 8, y1: 8 + (114 * i) / k, x2: 242, y2: 8 + (114 * i) / k, stroke: INK, "stroke-width": 1.5 }));
            for (let i = 1; i < 4; i++) exG.append(s.el("line", { x1: 8 + 58.5 * i, y1: 8, x2: 8 + 58.5 * i, y2: 122, stroke: INK, "stroke-width": 3 }));
            exG.append(s.el("rect", { x: 8, y: 8, width: 234, height: 114, rx: 8, fill: "none", stroke: INK, "stroke-width": 3 }));
            exF.innerHTML = ""; exF.append(F(s, 3 * k, 4 * k));
            bt.m2.disabled = k * 2 > 6; bt.m3.disabled = k * 3 > 6; bt.d2.disabled = k % 2 !== 0; bt.d3.disabled = k % 3 !== 0;
            Object.values(bt).forEach(b => (b.style.opacity = b.disabled ? .35 : 1));
          };
          const mkB = (key, txt, f) => (bt[key] = s.h("button", { class: "btn", style: { padding: "0 12px", minWidth: "70px" }, onclick: () => { k = f(k); s.sfx[key[0] === "m" ? "snap" : "pop"](); drawEx(); } }, txt));
          const bgrid = s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" } }, mkB("m2", "· 2", x => x * 2), mkB("m3", "· 3", x => x * 3), mkB("d2", ": 2", x => x / 2), mkB("d3", ": 3", x => x / 3));
          drawEx();
          const exCard = s.h("div", { class: "card later", style: { display: "flex", gap: "16px", alignItems: "center", padding: "12px 16px" } }, ex, exF, bgrid);
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "460px 1fr", alignItems: "center", height: "100%" } }, svg, s.h("div", { class: "stack", style: { gap: "16px" } }, chain, mk, tip, exCard)));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.swoosh(); await fadeOut(hOut); s.sfx.count(3); s.show(eqs[0], "fade"); await s.show(parts[1], "pop"); s.say("Je zwei Stücke zusammen: sechs Achtel."); });
          s.step(async () => { s.sfx.swoosh(); await fadeOut([hMid]); s.sfx.count(6); s.show(eqs[1], "fade"); await s.show(parts[2], "pop"); s.sfx.success(); s.say("Und nochmal: drei Viertel."); });
          s.step(async () => { s.sfx.ding(); await s.show(mk, "up"); await s.show(tip, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(exCard, "up"); s.say("Probiere: Erweitere und kürze drei Viertel."); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Wer hat mehr Saft?",
        say: "Julian hat zwei Drittel Glas, Louisa drei Viertel. Mit dem Hauptnenner zwölf sehen wir: Louisa hat mehr.",
        build(s) {
          const svg = s.svg(520, 440);
          const H = 320, B = 360;
          const glass = (x0, name, z, n) => {
            const id = "u5g" + x0;
            const path = `M${x0} 40 V${B - 20} Q${x0} ${B} ${x0 + 20} ${B} H${x0 + 140} Q${x0 + 160} ${B} ${x0 + 160} ${B - 20} V40`;
            const cp = s.el("clipPath", { id }); cp.append(s.el("path", { d: path + "Z" }));
            const juice = s.el("rect", { x: x0, y: B, width: 160, height: 0, fill: "#fb923c", "clip-path": `url(#${id})` });
            const marks = s.el("g");
            for (let i = 1; i < n; i++) marks.append(s.el("line", { x1: x0, y1: B - (H * i) / n, x2: x0 + 34, y2: B - (H * i) / n, stroke: INK, "stroke-width": 3.5 }));
            const fine = L(s.el("g"));
            for (let i = 1; i < 12; i++) fine.append(s.el("line", { x1: x0 + 2, y1: B - (H * i) / 12, x2: x0 + 158, y2: B - (H * i) / 12, stroke: INK, "stroke-width": 1.5, "stroke-dasharray": "5 4", opacity: .6 }));
            const lbl = SF(s, x0 + 40, 400, z, n, 24, INK);
            const eq = L(s.el("g")); eq.append(T(s, x0 + 82, 400, "=", { size: 28 }), SF(s, x0 + 124, 400, (z * 12) / n, 12, 24, UC));
            svg.append(cp, juice, fine, marks, s.el("path", { d: path, fill: "none", stroke: INK, "stroke-width": 4.5, "stroke-linejoin": "round" }), T(s, x0 + 80, 18, name, { size: 22 }), lbl, eq);
            return { juice, fine, eq, h: (H * z) / n };
          };
          const G1 = glass(60, "Julian", 2, 3), G2 = glass(300, "Louisa", 3, 4);
          const pour = async G => { s.sound("water-pour", { vol: .6, dur: 1.1 }); await s.tween({ dur: 900, ease: "out", update: v => { G.juice.setAttribute("y", B - G.h * v); G.juice.setAttribute("height", G.h * v); } }); };
          const hn = P(s, "t later", s.h("b", null, "Hauptnenner"), " = kgV(3, 4) = 12");
          const eq = s.h("div", { class: "u5eq later", style: { fontSize: "34px" } }, F(s, 2, 3), "=", F(s, 8, 12, { color: UC }), "<", F(s, 9, 12, { color: UC }), "=", F(s, 3, 4));
          const concl = P(s, "h2 later", s.h("span", { style: { color: GREEN } }, "→ Louisa hat mehr Saft!"));
          const mk = merk(s, "Erst auf den ", s.h("b", null, "Hauptnenner"), " erweitern, dann die Zähler vergleichen.");
          const wall = s.svg(540, 202), wrows = [];
          [[1, 2], [2, 3], [3, 4], [5, 6]].forEach(([z, n], r) => {
            const g = L(s.el("g")), y = 4 + r * 50, v = z / n;
            g.append(SF(s, 24, y + 18, z, n, 19, INK), s.el("rect", { x: 56, y, width: 390, height: 36, rx: 8, fill: "#fff", stroke: LINE, "stroke-width": 2 }), s.el("rect", { x: 56, y, width: 390 * v, height: 36, rx: 8, fill: "#fb923c" }),
              T(s, 466, y + 18, "=", { size: 22 }), SF(s, 500, y + 18, z * 12 / n, 12, 19, UC));
            wall.append(g); wrows.push(g);
          });
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "520px 1fr", alignItems: "center", height: "100%" } }, svg,
            s.h("div", { class: "stack", style: { gap: "12px" } }, P(s, "t", "Julian: ", F(s, 2, 3), " Glas, Louisa: ", F(s, 3, 4), " Glas. Wer hat mehr?"), hn, eq, concl, mk, wall)));
          s.sfx.pop();
          s.step(async () => { await pour(G1); await pour(G2); s.sfx.ding(); });
          s.step(async () => { s.sound("pencil-write"); await s.show([G1.fine, G2.fine], "fade"); await s.show(hn, "up"); s.show([G1.eq, G2.eq], "pop"); s.sfx.count(4); await s.show(eq, "up"); });
          s.step(async () => { s.sfx.success(); await s.show(concl, "up"); await s.show(mk, "up"); });
          s.step(async () => { for (const r of wrows) { s.sfx.count(wrows.indexOf(r) * 2); await s.show(r, "left"); } s.say("Ein Halb, zwei Drittel, drei Viertel, fünf Sechstel – der Größe nach geordnet."); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Addieren mit gleichem Nenner",
        say: "Zwei Achtel plus drei Achtel sind fünf Achtel. Der Nenner bleibt gleich, nur die Zähler werden addiert.",
        build(s) {
          const svg = s.svg(1100, 284), R = 95, C = [[180, 112], [550, 112], [920, 112]];
          C.forEach(([x, y]) => { svg.append(s.el("circle", { cx: x, cy: y, r: R + 6, fill: "#f3f4f6", stroke: LINE, "stroke-width": 3 })); for (let j = 0; j < 8; j++) { const a = rad(-90 + j * 45); svg.append(s.el("line", { x1: x, y1: y, x2: x + R * Math.cos(a), y2: y + R * Math.sin(a), stroke: LINE, "stroke-width": 2 })); } });
          svg.append(T(s, 365, 112, "+", { size: 56, fill: PEN }), T(s, 735, 112, "=", { size: 56, fill: PEN }));
          const slice = (plate, j) => {
            const g = s.el("g"), inner = L(s.el("g")), a = -90 + 22.5 + j * 45;
            g.append(inner);
            inner.append(s.el("path", { d: wedge(0, 0, R, -22.5, 22.5), fill: "#f6c35b", stroke: "#b7791f", "stroke-width": 3, "stroke-linejoin": "round" }), s.el("circle", { cx: 58, cy: 0, r: 12, fill: "#c0392b" }));
            g.setAttribute("transform", `translate(${C[plate][0]} ${C[plate][1]}) rotate(${a})`);
            svg.append(g); return { g, inner, x: C[plate][0], y: C[plate][1], a };
          };
          const A = [0, 1].map(j => slice(0, j)), Bs = [0, 1, 2].map(j => slice(1, j));
          const lA = L(SF(s, 180, 250, 2, 8, 22)), lB = L(SF(s, 550, 250, 3, 8, 22)), lC = L(SF(s, 920, 250, 5, 8, 22, UC));
          svg.append(lA, lB, lC);
          const move = (p, x, y, a) => { const f = { ...p }; p.x = x; p.y = y; p.a = a; return s.tween({ dur: 600, update: v => p.g.setAttribute("transform", `translate(${lerp(f.x, x, v)} ${lerp(f.y, y, v) - Math.sin(Math.PI * v) * 50}) rotate(${lerp(f.a, a, v)})`) }); };
          const mk = merk(s, s.h("b", null, "Gleicher Nenner:"), " Zähler addieren (oder subtrahieren), ", s.h("b", null, "der Nenner bleibt!"), " Nicht ", F(s, 5, 16), " – die Stücke werden ja nicht kleiner.");
          const cup = s.svg(110, 150), cupFill = s.el("rect", { x: 14, y: 140, width: 82, height: 0, fill: "#fb923c" });
          cup.append(cupFill, s.el("path", { d: "M12 10 V140 H98 V10", fill: "none", stroke: INK, "stroke-width": 4 }));
          [1, 2, 3].forEach(i => cup.append(s.el("line", { x1: 12, y1: 140 - i * 32.5, x2: 34, y2: 140 - i * 32.5, stroke: INK, "stroke-width": 3 })));
          const lf = life(s, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 110px", gap: "12px", alignItems: "center" } },
            s.h("div", { class: "stack", style: { gap: "10px" } }, P(s, "small", s.h("b", null, "Saft: "), F(s, 1, 4), " l + ", F(s, 2, 4), " l = ", F(s, 3, 4), " l"),
              P(s, "small", s.h("b", null, "Kuchen: "), F(s, 7, 8), " sind da, ", F(s, 3, 8), " werden gegessen: ", F(s, 7, 8), " − ", F(s, 3, 8), " = ", F(s, 4, 8), " = ", F(s, 1, 2), " Kuchen")), cup));
          lf.classList.add("later");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center" } }, svg, s.h("div", { class: "cols", style: { gap: "20px", alignItems: "center" } }, mk, lf)));
          s.sfx.pop();
          s.step(async () => { for (const p of [...A, ...Bs]) { s.sfx.pop(); await s.show(p.inner, "pop"); } s.show([lA, lB], "up"); });
          s.step(async () => { const all = [...A, ...Bs]; for (let j = 0; j < 5; j++) { s.sfx.count(j); await move(all[j], C[2][0], C[2][1], -90 + 22.5 + j * 45); } s.sfx.success(); await s.show(lC, "pop"); });
          s.step(async () => { s.sfx.ding(); await s.show(mk, "up"); });
          s.step(async () => {
            s.sfx.pop(); await s.show(lf, "up");
            const lvl = h => s.tween({ dur: 700, update: v => { const cur = +cupFill.getAttribute("height"); const nh = lerp(cur, h, v); cupFill.setAttribute("y", 140 - nh); cupFill.setAttribute("height", nh); } });
            s.sound("water-pour", { vol: .55, dur: .8 }); await lvl(32.5); s.sound("water-pour", { vol: .55, dur: .8 }); await lvl(97.5); cupFill.setAttribute("y", 42.5); cupFill.setAttribute("height", 97.5); s.sfx.ding();
          });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Ungleiche Nenner addieren",
        say: "Ein Halb plus ein Drittel: Erst schneiden wir beide in Sechstel. Dann sind es drei Sechstel plus zwei Sechstel, also fünf Sechstel.",
        build(s) {
          const svg = s.svg(600, 330), X0 = 90, BW = 480, BH = 58, Ys = [20, 120, 250];
          const barBase = (y, n) => { svg.append(s.el("rect", { x: X0, y, width: BW, height: BH, rx: 8, fill: "#fff", stroke: INK, "stroke-width": 3 })); for (let i = 1; i < n; i++) svg.append(s.el("line", { x1: X0 + (BW * i) / n, y1: y, x2: X0 + (BW * i) / n, y2: y + BH, stroke: INK, "stroke-width": 3 })); };
          barBase(Ys[0], 2); barBase(Ys[1], 3);
          svg.append(s.el("rect", { x: X0 + 2, y: Ys[0] + 2, width: BW / 2 - 3, height: BH - 4, rx: 6, fill: UC, opacity: .85 }), s.el("rect", { x: X0 + 2, y: Ys[1] + 2, width: BW / 3 - 3, height: BH - 4, rx: 6, fill: BLUE, opacity: .85 }));
          svg.append(SF(s, 42, Ys[0] + 29, 1, 2, 22, UC), SF(s, 42, Ys[1] + 29, 1, 3, 22, BLUE));
          const fine = L(s.el("g"));
          [0, 1].forEach(r => { for (let i = 1; i < 6; i++) fine.append(s.el("line", { x1: X0 + (BW * i) / 6, y1: Ys[r], x2: X0 + (BW * i) / 6, y2: Ys[r] + BH, stroke: INK, "stroke-width": 1.5, "stroke-dasharray": "6 4" })); });
          const t36 = L(T(s, X0 + BW / 4, Ys[0] + 29, "3 Sechstel", { size: 21, fill: "#fff" })), t26 = L(T(s, X0 + BW / 6, Ys[1] + 29, "2 Sechstel", { size: 19, fill: "#fff" }));
          fine.append(t36, t26); svg.append(fine);
          const sumBar = L(s.el("g"));
          sumBar.append(s.el("rect", { x: X0, y: Ys[2], width: BW, height: BH, rx: 8, fill: "#fff", stroke: INK, "stroke-width": 3 }));
          for (let i = 1; i < 6; i++) sumBar.append(s.el("line", { x1: X0 + (BW * i) / 6, y1: Ys[2], x2: X0 + (BW * i) / 6, y2: Ys[2] + BH, stroke: INK, "stroke-width": 2 }));
          const qm = T(s, 42, Ys[2] + 29, "?", { size: 30 }); sumBar.append(qm);
          svg.append(sumBar);
          const sumLbl = L(s.el("g")); sumLbl.append(s.el("rect", { x: 14, y: Ys[2] + 2, width: 60, height: 54, fill: "#fbfcf7" }), SF(s, 42, Ys[2] + 29, 5, 6, 22, GREEN)); svg.append(sumLbl);
          const fly = [];
          for (let i = 0; i < 5; i++) {
            const fromRow = i < 3 ? 0 : 1, fi = i < 3 ? i : i - 3;
            const r = s.el("rect", { x: X0 + fi * 80 + 3, y: Ys[fromRow] + 3, width: 74, height: BH - 6, rx: 6, fill: i < 3 ? UC : BLUE, class: "later" });
            svg.append(r); fly.push({ r, fx: X0 + fi * 80 + 3, fy: Ys[fromRow] + 3, tx: X0 + i * 80 + 3, ty: Ys[2] + 3 });
          }
          const e1 = s.h("div", { class: "u5eq", style: { fontSize: "38px" } }, F(s, 1, 2, { color: UC }), "+", F(s, 1, 3, { color: BLUE }));
          const e2 = s.h("div", { class: "u5eq later", style: { fontSize: "38px" } }, "=", F(s, 3, 6, { color: UC }), "+", F(s, 2, 6, { color: BLUE }));
          const e3 = s.h("div", { class: "u5eq later", style: { fontSize: "38px" } }, "=", F(s, 5, 6, { color: GREEN }));
          const mk = merk(s, "Erst auf den ", s.h("b", null, "Hauptnenner"), " bringen (kgV von 2 und 3 = 6), dann addieren.");
          const c1 = life(s, P(s, "small", s.h("b", null, "Backen: "), F(s, 1, 2), " Tasse Milch + ", F(s, 1, 3), " Tasse Wasser = ", F(s, 3, 6), " + ", F(s, 2, 6), " = ", F(s, 5, 6), " Tasse. Passt in eine Tasse!"));
          const c2 = life(s, P(s, "small", s.h("b", null, "Zeit: "), "Du hast ", F(s, 3, 4), " h, davon ", F(s, 1, 3), " h Hausaufgaben. Übrig: ", F(s, 9, 12), " − ", F(s, 4, 12), " = ", F(s, 5, 12), " h = 25 min zum Spielen."));
          [c1, c2].forEach(c => c.classList.add("later"));
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center" } },
            s.h("div", { class: "cols", style: { gridTemplateColumns: "600px 1fr", alignItems: "center" } }, svg, s.h("div", { class: "stack", style: { gap: "10px" } }, e1, e2, e3, mk)),
            s.h("div", { class: "cols", style: { gap: "20px" } }, c1, c2)));
          s.sfx.pop();
          s.step(async () => { s.sound("pencil-write"); await s.show(fine, "fade"); s.sfx.count(3); await s.show(e2, "up"); s.say("Ein Halb sind drei Sechstel, ein Drittel sind zwei Sechstel."); });
          s.step(async () => {
            await s.show(sumBar, "fade");
            for (const f of fly) { f.r.classList.remove("later"); s.sfx.count(fly.indexOf(f)); await s.tween({ dur: 420, update: v => { f.r.setAttribute("x", lerp(f.fx, f.tx, v)); f.r.setAttribute("y", lerp(f.fy, f.ty, v)); } }); }
            s.sfx.success(); qm.style.visibility = "hidden"; await s.show(sumLbl, "pop"); await s.show(e3, "up");
          });
          s.step(async () => { s.sfx.ding(); await s.show(mk, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(c1, "up"); s.sfx.pop(); await s.show(c2, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Mit gemischten Zahlen rechnen",
        say: "Beim Wandertag gehen wir zwei ein Viertel Kilometer und dann noch eineinhalb Kilometer. Ganze zu Ganzen, Brüche zu Brüchen.",
        build(s) {
          const svg = s.svg(1100, 186), X = v => 70 + v * 240, Y = 128;
          svg.style.flexShrink = "0";
          svg.append(s.el("line", { x1: 50, y1: Y, x2: 1060, y2: Y, stroke: INK, "stroke-width": 3 }));
          for (let i = 0; i <= 16; i++) svg.append(s.el("line", { x1: X(i / 4), y1: Y - (i % 4 ? 7 : 14), x2: X(i / 4), y2: Y + (i % 4 ? 7 : 14), stroke: INK, "stroke-width": i % 4 ? 2 : 4 }));
          [0, 1, 2, 3, 4].forEach(v => svg.append(T(s, X(v), 166, v + " km", { size: 22 })));
          const arc = (a, b, col) => s.el("path", { d: `M${X(a)} ${Y - 6} Q${(X(a) + X(b)) / 2} ${Y - 90} ${X(b)} ${Y - 6}`, fill: "none", stroke: col, "stroke-width": 5, "stroke-linecap": "round", class: "later" });
          const a1 = arc(0, 2.25, UC), a2 = arc(2.25, 3.75, BLUE);
          const l1 = L(SM(s, X(1.125), 38, 2, 1, 4, 20, UC)), l2 = L(SM(s, X(3), 38, 1, 1, 2, 20, BLUE));
          const flag = L(s.el("g")); flag.append(s.el("line", { x1: X(3.75), y1: Y, x2: X(3.75), y2: Y - 58, stroke: GREEN, "stroke-width": 4 }), s.el("path", { d: `M${X(3.75)} ${Y - 58} l34 10 l-34 10z`, fill: GREEN }));
          svg.append(a1, a2, l1, l2, flag);
          const eq = s.h("div", { class: "u5eq later", style: { fontSize: "34px" } }, M(s, 2, 1, 4), "+", M(s, 1, 1, 2), s.h("span", null, "="), s.h("span", null, "3"), s.h("span", null, "+"), F(s, 1, 4), "+", F(s, 2, 4), "=", s.h("span", { style: { color: GREEN } }, M(s, 3, 3, 4)), s.h("span", { style: { fontSize: "26px" } }, "km"));
          const cs = s.svg(440, 170), R = 64;
          const cake = (cx, cy, k, ofs = 0) => { const g = s.el("g"); const ws = []; for (let i = 0; i < k; i++) { const w = s.el("path", { d: wedge(cx, cy, R, -90 + (i + ofs) * 90, -90 + (i + ofs + 1) * 90), fill: "#f6b8c6", stroke: "#f6b8c6", "stroke-width": 1 }); g.append(w); ws.push(w); } return { g, ws }; };
          cs.append(...[[74, 85], [220, 85], [366, 85]].map(([x, y]) => s.el("circle", { cx: x, cy: y, r: R + 6, fill: "none", stroke: LINE, "stroke-width": 3, "stroke-dasharray": "7 5" })));
          const k1 = cake(74, 85, 4), k2 = cake(220, 85, 4), k3 = cake(366, 85, 1);
          cs.append(k1.g, k2.g, k3.g);
          const outline = (cx, cy) => s.el("circle", { cx, cy, r: R, fill: "none", stroke: "#c2185b", "stroke-width": 3 });
          cs.append(outline(74, 85));
          const o2 = outline(220, 85); cs.append(o2);
          k3.ws[0].setAttribute("stroke", "#c2185b"); k3.ws[0].setAttribute("stroke-width", 3);
          const cuts = [s.el("line", { x1: 220 - R, y1: 85, x2: 220 + R, y2: 85, stroke: "#c2185b", "stroke-width": 3, class: "later" }), s.el("line", { x1: 220, y1: 85 - R, x2: 220, y2: 85 + R, stroke: "#c2185b", "stroke-width": 3, class: "later" })];
          cs.append(...cuts);
          const pS = [s.h("span", { class: "later" }, "="), s.h("span", { class: "later" }, M(s, 1, 5, 4)), s.h("span", { class: "later" }, "−"), s.h("span", { class: "later" }, F(s, 3, 4)),
            s.h("span", { class: "later", style: { color: GREEN } }, "="), s.h("span", { class: "later", style: { color: GREEN } }, M(s, 1, 2, 4)), s.h("span", { class: "later", style: { color: GREEN } }, "="), s.h("span", { class: "later", style: { color: GREEN } }, M(s, 1, 1, 2))];
          const sEq = s.h("div", { class: "u5eq", style: { fontSize: "32px", gap: "10px" } }, M(s, 2, 1, 4), "−", F(s, 3, 4), ...pS);
          const hint = P(s, "small later", "Trick: ein Ganzes in 4 Viertel tauschen, dann 3 Viertel wegnehmen.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "14px" } },
            P(s, "t", s.h("b", null, "Wandertag: "), "erst ", M(s, 2, 1, 4), " km bis zum Picknick, dann ", M(s, 1, 1, 2), " km zum See."), svg, eq,
            s.h("div", { class: "cols", style: { gridTemplateColumns: "440px 1fr", alignItems: "center", gap: "20px" } }, cs,
              s.h("div", { class: "card stack", style: { gap: "10px", padding: "12px 18px" } }, P(s, "t", s.h("b", null, "Kuchenbasar: "), "Es sind ", M(s, 2, 1, 4), " Kuchen da, ", F(s, 3, 4), " werden verkauft."), sEq, hint))));
          s.sfx.pop();
          s.step(async () => { s.sound("footsteps", { vol: .6, dur: 1.6 }); await s.show(a1, "draw"); s.sfx.ding(); await s.show(l1, "pop"); });
          s.step(async () => { s.sound("footsteps", { vol: .6, dur: 1.2 }); await s.show(a2, "draw"); s.sfx.ding(); await s.show(l2, "pop"); await s.show(flag, "pop"); });
          s.step(async () => { s.sfx.success(); await s.show(eq, "up"); s.say("Zwei plus eins sind drei. Ein Viertel plus zwei Viertel sind drei Viertel."); });
          s.step(async () => { for (const c of cuts) { s.sfx.snap(); await s.show(c, "draw"); } k2.ws.forEach(w => { w.setAttribute("stroke", "#c2185b"); w.setAttribute("stroke-width", 3); }); s.sfx.count(4); await s.show(pS.slice(0, 4), "pop"); await s.show(hint, "fade"); });
          s.step(async () => {
            const gone = [k3.ws[0], k2.ws[2], k2.ws[3]];
            for (const w of gone) { s.sfx.swoosh(); await s.tween({ dur: 450, update: v => { w.setAttribute("opacity", 1 - v); w.setAttribute("transform", `translate(${v * 30} ${-v * 30})`); } }); }
            s.sfx.success(); await s.show(pS.slice(4), "pop"); s.say("Es bleiben ein ganzer Kuchen und zwei Viertel, also eineinhalb Kuchen.");
          });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Brüche im Alltag",
        say: "Drei echte Aufgaben aus dem Alltag. Wir rechnen sie Schritt für Schritt.",
        build(s) {
          const card = (title, q, sv, sol) => { const so = s.h("div", { class: "stack later", style: { gap: "6px" } }, sol); const c = life(s, P(s, "t", s.h("b", null, title)), P(s, "small", ...q), sv, so); c.style.display = "flex"; c.style.flexDirection = "column"; c.style.gap = "8px"; return { c, so }; };
          const t1 = s.svg(300, 86), tk = [];
          for (let i = 0; i < 4; i++) { const r = s.el("rect", { x: 6 + i * 74, y: 8, width: 66, height: 70, rx: 9, fill: "#fff", stroke: INK, "stroke-width": 2.5, "stroke-dasharray": i ? "0" : "0" }); t1.append(r, T(s, 39 + i * 74, 43, i + 1, { size: 24 })); tk.push(r); }
          const t2 = s.svg(300, 86), sq = [];
          for (let i = 0; i < 12; i++) { const r = s.el("rect", { x: 6 + (i % 6) * 48, y: 4 + Math.floor(i / 6) * 41, width: 44, height: 37, rx: 6, fill: "#fde7c7", stroke: "#b7791f", "stroke-width": 2 }); t2.append(r); sq.push(r); }
          const t3 = s.svg(300, 86), cells = [];
          for (let i = 0; i < 20; i++) { const r = s.el("rect", { x: 6 + i * 14.4, y: 8, width: 12.4, height: 40, rx: 3, fill: "#fff", stroke: INK, "stroke-width": 1.5 }); t3.append(r); cells.push(r); }
          const tb = L(T(s, 42, 70, "Buch", { size: 19, fill: UC })), tkino = L(T(s, 107, 70, "Kino", { size: 19, fill: BLUE }));
          t3.append(tb, tkino);
          const A = card("BVG: 4-Fahrten-Karte", ["Julian fährt 1 Fahrt, Louisa 2 Fahrten. Wie viel der Karte ist verbraucht, wie viel übrig?"], t1,
            [P(s, "small", F(s, 1, 4), " + ", F(s, 2, 4), " = ", F(s, 3, 4), " verbraucht."), P(s, "small", "Übrig: 1 − ", F(s, 3, 4), " = ", F(s, 1, 4), " – noch 1 Fahrt.")]);
          const B = card("Kuchenbasar", ["Ein Blech hat 12 Stücke. Vormittags wird ", F(s, 5, 12), " verkauft, nachmittags ", F(s, 1, 3), "."], t2,
            [P(s, "small", F(s, 5, 12), " + ", F(s, 4, 12), " = ", F(s, 9, 12), " = ", F(s, 3, 4), " verkauft."), P(s, "small", "Übrig: ", F(s, 1, 4), " = 3 Stücke.")]);
          const C = card("Taschengeld", ["Julian hat 20 €. Er gibt ", F(s, 1, 4), " für ein Buch und ", F(s, 1, 5), " fürs Kino aus."], t3,
            [P(s, "small", F(s, 1, 4), " von 20 € = 5 €, ", F(s, 1, 5), " von 20 € = 4 €."), P(s, "small", "Zusammen 9 € = ", F(s, 9, 20), ". Übrig: 11 €.")]);
          const mk = merk(s, "Brüche sind überall: Pizza, Schokolade, Uhr, Noten, Saft, Fahrkarten und Geld!");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center" } }, s.h("div", { class: "cols3", style: { alignItems: "stretch" } }, A.c, B.c, C.c), mk));
          s.sfx.pop();
          s.step(async () => {
            tk[0].setAttribute("fill", "#fecaca"); s.sfx.coin(); await s.wait(200); tk[1].setAttribute("fill", "#bfdbfe"); tk[2].setAttribute("fill", "#bfdbfe"); s.sfx.coin();
            await s.show(A.so, "up"); s.sfx.ding();
          });
          s.step(async () => {
            for (let i = 0; i < 9; i++) { sq[i].setAttribute("fill", i < 5 ? "#fb923c" : "#4ade80"); s.sfx.count(i); await s.wait(70); }
            await s.show(B.so, "up"); s.sfx.ding();
          });
          s.step(async () => {
            s.sound("cash-register", { vol: .6 }); for (let i = 0; i < 9; i++) { cells[i].setAttribute("fill", i < 5 ? "#fca5a5" : "#93c5fd"); await s.wait(60); }
            s.show([tb, tkino], "pop"); await s.show(C.so, "up"); s.sfx.ding();
          });
          s.step(async () => { s.sound("kids-cheer", { vol: .6 }); s.confetti(590, 400, 120); await s.show(mk, "up"); });
        },
      },
    ],
  });
})();
