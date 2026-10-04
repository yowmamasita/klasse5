/* Kapitel 9 – Zahlsysteme und Quadratzahlen (Zehnersystem, römische Zahlen, Zweiersystem, Quadratzahlen, Potenzen) */
(() => {
  const U = "#a16207", SOFT = "#fbf1d0";
  const P = { blue: "#1d5bd0", red: "#dc3b2a", green: "#138a5a", violet: "#7b4fd6", orange: "#ee7a1a", ink: "#1b2740", pencil: "#5d6678", yellow: "#ffd94a", line: "#c8d3de", gold: U };
  const LBL = { font: "700 14px/1 var(--f-display)", letterSpacing: ".08em", textTransform: "uppercase", display: "block", marginBottom: "8px", color: "var(--green)" };
  const ROMF = "Georgia, 'Times New Roman', serif";
  const ex = (s, label, attrs, ...kids) => s.h("div", Object.assign({ class: "ex" }, attrs || {}), s.h("span", { class: "exlabel" }, label), ...kids);
  const life = (s, attrs, ...kids) => s.h("div", Object.assign({ class: "life" }, attrs || {}), s.h("span", { style: LBL }, (attrs && attrs.label) || "Im Alltag"), ...kids);
  const T = (s, x, y, text, a) => s.el("text", Object.assign({ x, y, "text-anchor": "middle", "font-size": 22, "font-weight": 700, fill: P.ink, text }, a || {}));
  const fb = el => { el.style.transformBox = "fill-box"; el.style.transformOrigin = "center"; return el; };
  const later = el => { el.classList.add("later"); return el; };
  const lifeRow = (s, cls, ph, ...txt) => s.h("div", { class: "life " + cls, style: { display: "flex", gap: "14px", alignItems: "center", padding: "10px 14px" } }, ph,
    s.h("div", { style: { minWidth: 0 } }, s.h("span", { style: LBL }, "Im Alltag"), s.h("p", { class: "small" }, ...txt)));
  const root = (s, cls, style, ...kids) => s.h("div", { class: cls, style: Object.assign({ height: "100%", fontSize: "22px" }, style || {}) }, ...kids);
  const pw = (s, b, e, col) => s.h("span", { style: { whiteSpace: "nowrap", color: col || "inherit" } }, String(b), s.h("sup", { style: { fontSize: ".6em", color: col || P.red } }, String(e)));
  /* deterministic pseudo random */
  const rnd = seed => () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };

  const RN = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  const toRoman = n => { let r = ""; for (const [v, t] of RN) while (n >= v) { r += t; n -= v; } return r; };
  const RV = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  const romTile = (s, ch, size, col) => s.h("span", { style: { display: "inline-grid", placeItems: "center", flex: "none", minWidth: size * 0.95 + "px", height: size * 1.2 + "px", padding: "0 6px", borderRadius: "10px", background: "#fff", border: `3px solid ${col || U}`, font: `700 ${size}px/1 ${ROMF}`, color: col || U, boxShadow: "0 3px 0 rgba(0,0,0,.08)" } }, ch);

  Deck.unit({
    id: "u9", num: 9, title: "Zahlsysteme und Quadratzahlen", color: U, soft: SOFT,
    subtitle: "Bündeln, römisch, binär, hoch zwei",
    blurb: "Römische Zahlen, Zweiersystem, Quadratzahlen und Potenzen.",
    goals: ["Verstehen, wie unser Zehnersystem bündelt", "Römische Zahlen lesen und schreiben", "Im Zweiersystem zählen wie ein Computer", "Quadratzahlen und Kubikzahlen kennen", "Potenzen mit Basis und Exponent rechnen"],
    icon(svg, el) {
      svg.append(el("rect", { x: 6, y: 12, width: 58, height: 46, rx: 10, fill: U, opacity: .15 }),
        el("text", { x: 33, y: 46, "text-anchor": "middle", "font-size": 26, "font-weight": 700, fill: U, "font-family": "Georgia, serif", text: "XII" }),
        el("text", { x: 60, y: 26, "text-anchor": "middle", "font-size": 15, "font-weight": 800, fill: "#dc3b2a", text: "2" }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Unser Zehnersystem: Bündeln",
        say: "Dreiundzwanzig Stäbchen liegen durcheinander. Wir bündeln immer zehn zusammen – so funktioniert unser Zehnersystem.",
        build(s) {
          const N = 23, W = 600, H = 250, svg = s.svg(W, H), R = rnd(7);
          const col = "#d98a1f";
          const sticks = [];
          for (let i = 0; i < N; i++) {
            const x = 40 + R() * 520, y = 50 + R() * 110, a = R() * 160 - 80;
            const g = later(fb(s.el("g", { transform: `translate(${x},${y}) rotate(${a})` })));
            g.append(s.el("line", { x1: 0, y1: -38, x2: 0, y2: 38, stroke: col, "stroke-width": 7, "stroke-linecap": "round" }), s.el("circle", { cx: 0, cy: -38, r: 4.5, fill: P.red }));
            g.p = { x, y, a }; svg.append(g); sticks.push(g);
          }
          const tgt = i => i < 20 ? { x: 70 + Math.floor(i / 10) * 140 + (i % 10) * 8, y: 150, a: 0 } : { x: 380 + (i - 20) * 40, y: 150, a: 0 };
          const bands = [0, 1].map(b => later(fb(s.el("rect", { x: 60 + b * 140, y: 146, width: 92, height: 12, rx: 5, fill: P.blue }))));
          const labs = [later(fb(T(s, 106, 228, "1 Zehner", { fill: P.blue }))), later(fb(T(s, 246, 228, "1 Zehner", { fill: P.blue }))), later(fb(T(s, 420, 228, "3 Einer", { fill: P.green })))];
          svg.append(...bands, ...labs);
          const cell = (t, c, big) => s.h("div", { style: { width: "86px", height: big ? "70px" : "40px", display: "grid", placeItems: "center", border: "2px solid var(--line)", background: big ? "#fff" : c, color: big ? c : "#fff", font: `800 ${big ? 46 : 22}px/1 var(--f-display)`, borderRadius: "8px" } }, t);
          const dZ = s.h("span", { class: "later" }, "2"), dE = s.h("span", { class: "later" }, "3");
          const z = cell("", P.blue, true), e = cell("", P.green, true); z.append(dZ); e.append(dE);
          const tafel = s.h("div", { style: { display: "grid", gridTemplateColumns: "86px 86px", gap: "6px" } }, cell("Z", P.blue), cell("E", P.green), z, e);
          const card = ex(s, "Bündeln", { class: "ex a-left", style: { display: "flex", flexDirection: "column", gap: "4px", padding: "12px 16px" } }, svg,
            s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "20px" } }, tafel, s.h("p", { class: "t" }, "2 Zehner und 3 Einer = ", s.h("b", { class: "red" }, "23"))));
          const lad = ["10 Einer = 1 Zehner", "10 Zehner = 1 Hunderter", "10 Hunderter = 1 Tausender"].map(t => s.h("div", { class: "card later", style: { padding: "8px 16px", fontSize: "22px", fontWeight: 700, color: U } }, t));
          const lf = lifeRow(s, "later", s.photo("eierkarton-10", { w: 150, h: 110 }), "Eier im Zehner-Karton, 10 Cent in einer Münze, 10 Zehn-Euro-Scheine = 100 €.");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "640px 1fr", gap: "22px", alignItems: "center" }, card, s.h("div", { class: "stack", style: { gap: "12px" } }, ...lad, lf)));
          s.sfx.pop();
          s.step(async () => { for (let i = 0; i < N; i++) { s.show(sticks[i], "pop"); if (i % 3 === 0) s.sfx.tick(); await s.wait(45); } s.say("Dreiundzwanzig Stäbchen. Durcheinander kann man sie schlecht zählen."); });
          s.step(async () => {
            s.sfx.whoosh();
            await Promise.all(sticks.map((g, i) => { const a = g.p, b = tgt(i); return s.tween({ from: 0, to: 1, dur: 900, delay: i * 25, ease: "inOut", update: t => g.setAttribute("transform", `translate(${a.x + (b.x - a.x) * t},${a.y + (b.y - a.y) * t}) rotate(${a.a * (1 - t)})`) }); }));
            for (const b of bands) { s.sfx.snap(); await s.show(b, "zoom"); }
            for (const l of labs) { s.show(l, "up"); await s.wait(150); }
            s.sfx.count(2); await s.show(dZ, "pop"); s.sfx.count(4); await s.show(dE, "pop");
            s.say("Zwei Bündel zu zehn und drei einzelne: zwei Zehner, drei Einer.");
          });
          s.step(async () => { for (let i = 0; i < 3; i++) { s.sfx.note(i * 4, .2); await s.show(lad[i], "left"); await s.wait(150); } s.say("Immer zehn bilden ein neues Bündel. Darum heißt es Zehnersystem."); });
          s.step(async () => { s.sound("coins", { vol: .5 }); await s.show(lf, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Warum gerade zehn?",
        say: "Wir bündeln in Zehnern. Aber es gibt auch andere Bündel – manche benutzt du jeden Tag!",
        build(s) {
          const big = (t, c) => s.h("div", { style: { font: `800 64px/1 var(--f-display)`, color: c, width: "170px", textAlign: "center", flex: "none" } }, t);
          const card = (lab, vis, txt, first) => ex(s, lab, { class: "ex " + (first ? "a-up" : "later"), style: { display: "flex", flexDirection: "column", justifyContent: "center", padding: "12px 16px" } },
            s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "16px" } }, vis, s.h("p", { class: "small", style: { fontSize: "21px" } }, ...txt)));
          const cards = [
            card("Zehn: unsere Finger", s.h("div", { style: { fontSize: "60px", width: "170px", textAlign: "center", flex: "none" } }, "🖐️🖐️"), ["Wahrscheinlich bündeln wir in Zehnern, weil wir ", s.h("b", null, "10 Finger"), " haben. Wir brauchen nur die Ziffern 0 bis 9."], true),
            card("Sechzig: die Babylonier", s.photo("bahnhofsuhr", { w: 170, h: 180 }), ["Vor rund 4.000 Jahren rechneten die Babylonier in ", s.h("b", null, "60er-Bündeln"), ". Deshalb hat 1 Stunde 60 Minuten und 1 Minute 60 Sekunden."]),
            card("Zwölf: das Dutzend", s.photo("eierkarton-6", { w: 170, h: 180 }), ["Eier oder Gläser zählt man oft im ", s.h("b", null, "Dutzend = 12"), ". Ein Sechser-Karton ist ein halbes Dutzend. Ein Jahr hat 12 Monate."]),
            card("Zwei: der Computer", big("0 1", P.violet), ["Computer bündeln in ", s.h("b", null, "Zweiern"), " und kennen nur zwei Ziffern: 0 und 1. Das schauen wir uns gleich an!"]),
          ];
          s.add(root(s, "cols", { gridTemplateRows: "1fr 1fr", gap: "18px 22px" }, ...cards));
          s.sfx.pop();
          s.step(async () => { s.sound("clock-tick", { vol: .5, dur: 2.5 }); await s.show(cards[1], "right"); s.say("Sechzig Sekunden sind eine Minute. Das kommt von den Babyloniern."); });
          s.step(async () => { s.sfx.pop(); await s.show(cards[2], "left"); s.say("Zwölf Stück sind ein Dutzend."); });
          s.step(async () => { s.sound("lichtschalter", { vol: .7 }); await s.show(cards[3], "right"); s.say("Und der Computer zählt nur mit null und eins."); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Römische Zahlen: die Zeichen",
        say: "Die alten Römer schrieben Zahlen mit Buchstaben. Sieben Zeichen reichen.",
        build(s) {
          const tiles = Object.entries(RV).map(([c, v], i) => {
            const val = s.h("div", { style: { font: "800 34px/1 var(--f-display)", color: P.ink, marginTop: "10px" } }, s.fmt(v));
            const t = s.h("div", { class: "later", style: { display: "flex", flexDirection: "column", alignItems: "center" } }, romTile(s, c, 84), val);
            return t;
          });
          const row = s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "14px", justifyItems: "center" } }, ...tiles);
          const intro = s.h("p", { class: "t a-up" }, "Statt Ziffern benutzten die Römer ", s.h("b", null, "Buchstaben"), ". Jedes Zeichen hat einen festen Wert:");
          const m1 = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Es gibt ", s.h("b", null, "keine Null"), " und keine Stellenwerttafel! Jedes Zeichen bedeutet immer dasselbe – egal, wo es steht.");
          const pair = (a, b) => s.h("p", { class: "t", style: { display: "flex", alignItems: "center", gap: "10px" } }, romTile(s, a, 30), " = 2 · ", romTile(s, b, 30));
          const tw = s.h("div", { class: "card later stack", style: { gap: "10px", padding: "12px 18px" } }, s.h("p", { class: "small pencil" }, "Immer abwechselnd · 5 und · 2:"), s.h("div", { class: "row", style: { gap: "18px" } }, pair("X", "V"), pair("C", "L"), pair("M", "D")));
          const clock = s.photo("uhr-roemisch", { w: 210, h: 230, pos: "50% 45%", caption: "Römische Uhr", cls: "later" });
          s.add(root(s, "stack", { justifyContent: "space-between" }, intro, row,
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 210px", gap: "18px", alignItems: "center" } }, m1, tw, clock)));
          s.sfx.pop();
          s.step(async () => { for (let i = 0; i < tiles.length; i++) { s.show(tiles[i], "bounce"); s.sfx.note([0, 4, 7, 12, 16, 19, 24][i], .2); await s.wait(260); } s.say("I ist eins, V fünf, X zehn, L fünfzig, C hundert, D fünfhundert und M tausend."); });
          s.step(async () => { s.sfx.ding(); await s.show(m1, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(tw, "up"); s.say("Zwei V sind ein X, zwei L ein C, zwei D ein M."); });
          s.step(async () => { s.sound("clock-tick", { vol: .5, dur: 2 }); await s.show(clock, "zoom"); s.say("Auf vielen Uhren findest du römische Zahlen."); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Regel 1: Zusammenzählen",
        say: "Steht das größere Zeichen vorne, zählen wir einfach alle Werte zusammen.",
        build(s) {
          const mk = (str, ctx, first) => {
            const parts = str.split("").map(ch => {
              const v = s.h("span", { class: "later", style: { font: "800 22px/1 var(--f-display)", color: P.blue } }, "+" + s.fmt(RV[ch]));
              return { el: s.h("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" } }, romTile(s, ch, 52), v), v };
            });
            parts[0].v.textContent = s.fmt(RV[str[0]]);
            const sum = str.split("").reduce((a, c) => a + RV[c], 0);
            const res = s.h("span", { class: "later", style: { font: "800 44px/1 var(--f-display)", color: P.red, whiteSpace: "nowrap" } }, "= " + (sum > 1500 ? String(sum) : s.fmt(sum)));
            const c = ex(s, ctx, { class: "ex " + (first ? "a-up" : "later"), style: { padding: "12px 18px" } },
              s.h("div", { class: "row", style: { gap: "14px", flexWrap: "nowrap" } }, s.h("div", { class: "row", style: { gap: "8px", flexWrap: "nowrap" } }, ...parts.map(p => p.el)), res));
            c.run = async () => { for (let i = 0; i < parts.length; i++) { s.show(parts[i].v, "up"); s.sfx.count(i); await s.wait(260); } s.sfx.ding(); await s.show(res, "pop"); };
            return c;
          };
          const rows = [mk("VIII", "Beispiel 1: Wecker klingelt um", true), mk("XXVII", "Beispiel 2: Kinder in einer Klasse"), mk("MMXXVI", "Beispiel 3: dieses Jahr")];
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Großes Zeichen ", s.h("b", null, "vor"), " kleinem: ", s.h("b", null, "zusammenzählen"), ". Höchstens ", s.h("b", null, "3 gleiche"), " Zeichen hintereinander: III, XXX, CCC.");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "1fr 330px", gap: "22px", alignItems: "center" },
            s.h("div", { class: "stack", style: { gap: "14px" } }, ...rows), merk));
          s.sfx.pop();
          s.step(async () => { s.sound("school-bell", { vol: .4, dur: 2 }); await rows[0].run(); s.say("Fünf plus eins plus eins plus eins: acht."); });
          s.step(async () => { await s.show(rows[1], "up"); await rows[1].run(); s.say("Zehn plus zehn plus fünf plus eins plus eins: siebenundzwanzig."); });
          s.step(async () => { await s.show(rows[2], "up"); await rows[2].run(); s.sfx.fanfare(); s.say("M M X X V I: zweitausendsechsundzwanzig!"); });
          s.step(async () => { s.sfx.pop(); await s.show(merk, "left"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Regel 2: IV und IX",
        say: "Steht ein kleines Zeichen vor einem größeren, wird es abgezogen. So wird aus V und I die Vier.",
        build(s) {
          const W = 480, H = 240, svg = s.svg(W, H);
          const tile = (x, ch, c) => { const g = fb(s.el("g", { transform: `translate(${x},40)` })); g.append(s.el("rect", { x: 0, y: 0, width: 90, height: 104, rx: 12, fill: "#fff", stroke: c, "stroke-width": 4 }), s.el("text", { x: 45, y: 80, "text-anchor": "middle", "font-size": 72, "font-weight": 700, "font-family": ROMF, fill: c, text: ch })); return g; };
          const V = tile(195, "V", U), I = tile(305, "I", P.red), sg = T(s, 45, -10, "+1", { "font-size": 28, fill: P.blue }); I.append(sg);
          const sign = T(s, 290, 116, "", { "font-size": 30, fill: P.ink });
          const eq = T(s, W / 2, 210, "VI = 5 + 1 = 6", { "font-size": 34, fill: P.blue });
          svg.append(V, I, sign, eq);
          const demo = ex(s, "Rechts plus – links minus", { class: "ex a-left", style: { display: "flex", flexDirection: "column", alignItems: "center" } }, svg);
          const pairs = [["IV", 4], ["IX", 9], ["XL", 40], ["XC", 90], ["CD", 400], ["CM", 900]].map(([r, v]) => s.h("div", { class: "card later", style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", gap: "8px" } },
            s.h("span", { style: { font: `700 34px/1 ${ROMF}`, color: U } }, r), s.h("span", { class: "small pencil" }, `${RV[r[1]]} − ${RV[r[0]]}`), s.h("b", { style: { fontSize: "28px", color: P.red } }, String(v))));
          const grid = s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" } }, ...pairs);
          const merk = s.h("div", { class: "merk later", style: { fontSize: "20px", padding: "10px 18px 12px" } }, "Nur ", s.h("b", null, "I, X, C"), " dürfen vorne abgezogen werden – und nur vor den zwei nächstgrößeren Zeichen: I vor V und X, X vor L und C, C vor D und M.");
          const clock = s.photo("uhr-roemisch", { w: 250, h: 290, pos: "50% 45%", caption: "Hier steht IIII!", cls: "later" });
          const cl = s.h("p", { class: "small later", style: { color: P.violet } }, "Viele Uhren zeigen IIII statt IV – eine alte Tradition der Uhrmacher.");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "1fr 250px", gap: "22px", alignItems: "center" },
            s.h("div", { class: "stack", style: { gap: "14px" } }, demo, grid, merk), s.h("div", { class: "stack", style: { gap: "10px" } }, clock, cl)));
          s.sfx.pop();
          s.step(async () => {
            s.sfx.whoosh();
            await s.tween({ from: 0, to: 1, dur: 900, ease: "inOut", update: t => I.setAttribute("transform", `translate(${305 - 220 * t},${40 - Math.sin(Math.PI * t) * 30})`) });
            s.sfx.snap(); eq.textContent = "IV = 5 − 1 = 4"; eq.setAttribute("fill", P.red); sg.textContent = "−1"; sg.setAttribute("fill", P.red);
            s.say("Jetzt steht das I links vom V. Fünf minus eins ist vier.");
          });
          s.step(async () => { for (let i = 0; i < pairs.length; i++) { s.show(pairs[i], "pop"); s.sfx.count(i); await s.wait(200); } s.say("Es gibt genau sechs solche Paare: vier, neun, vierzig, neunzig, vierhundert, neunhundert."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sound("clock-tick", { vol: .5, dur: 2 }); await s.show(clock, "zoom"); await s.show(cl, "up"); s.say("Schau mal auf die Vier dieser Uhr!"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Römische Zahlen übersetzen",
        say: "Große Zahlen übersetzen wir Stelle für Stelle: Tausender, Hunderter, Zehner, Einer.",
        build(s) {
          const names = ["Tausender", "Hunderter", "Zehner", "Einer"], cols = [P.violet, P.blue, P.green, P.orange];
          const colEls = names.map((n, i) => {
            const v = s.h("div", { style: { font: "800 34px/1 var(--f-display)", color: cols[i] } });
            const r = s.h("div", { style: { font: `700 40px/1 ${ROMF}`, color: U, minHeight: "44px" } });
            const box = s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "12px 8px", borderTop: `6px solid ${cols[i]}` } }, s.h("span", { class: "small pencil" }, n), v, s.h("span", { style: { fontSize: "26px", color: P.pencil } }, "↓"), r);
            return { box, v, r };
          });
          const num = s.h("span", { style: { font: "800 64px/1 var(--f-display)", color: P.ink } });
          const rom = s.h("span", { style: { font: `700 60px/1 ${ROMF}`, color: U, letterSpacing: ".04em" } });
          const note = s.h("p", { class: "t", style: { color: P.pencil, minHeight: "30px" } });
          let cur = 0, busy = false;
          async function show(n, txt, anim) {
            if (busy) return; busy = true; cur = n;
            num.textContent = String(n); rom.textContent = ""; note.textContent = txt || "";
            const ds = String(n).padStart(4, "0").split("").map(Number);
            colEls.forEach(c => { c.v.textContent = ""; c.r.textContent = ""; });
            let acc = "";
            for (let i = 0; i < 4 && s.alive; i++) {
              const val = ds[i] * Math.pow(10, 3 - i), r = val ? toRoman(val) : "–";
              colEls[i].v.textContent = s.fmt(val); colEls[i].r.textContent = r; acc += val ? r : "";
              if (anim) { colEls[i].r.classList.remove("a-pop"); void colEls[i].r.offsetWidth; colEls[i].r.classList.add("a-pop"); s.sfx.count(i * 2); await s.wait(420); }
            }
            rom.textContent = acc; if (anim) { s.sfx.ding(); rom.classList.remove("a-zoom"); void rom.offsetWidth; rom.classList.add("a-zoom"); }
            busy = false;
          }
          const P_ = [[1828, "Altes Museum"], [1989, "Mauerfall"], [2026, "dieses Jahr"], [3999, "die größte"]];
          const btns = P_.map(([n, t]) => s.h("button", { class: "btn", onclick: () => { s.sfx.click(); sl.set(n); show(n, t, true); } }, `${n} · ${t}`));
          const sl = s.slider({ label: "Wähle eine Zahl", min: 1, max: 3999, value: 1989, fmt: v => String(v), onInput: v => { if (!busy) show(v, "", false); } });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Zerlege die Zahl in ", s.h("b", null, "Tausender, Hunderter, Zehner, Einer"), " und übersetze jeden Teil für sich. Dann alles hintereinander schreiben.");
          show(1989, "Mauerfall", false);
          s.add(root(s, "stack", { justifyContent: "space-between", gap: "12px" },
            s.h("div", { class: "row a-up", style: { gap: "10px", flexWrap: "nowrap" } }, ...btns),
            s.h("div", { class: "row", style: { gap: "30px", justifyContent: "center", flexWrap: "nowrap" } }, num, s.h("span", { style: { fontSize: "44px", color: P.pencil } }, "="), rom),
            s.h("div", { class: "cols4", style: { gap: "14px" } }, ...colEls.map(c => c.box)),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "center" } }, sl, merk), note));
          s.sfx.pop();
          s.step(async () => { await show(1989, "1989: In Berlin fällt die Mauer.", true); s.say("Tausend ist M, neunhundert ist C M, achtzig ist L X X X, neun ist I X."); });
          s.step(async () => { sl.set(2026); await show(2026, "2026: dieses Jahr", true); s.say("Zweitausend ist M M, zwanzig ist X X, sechs ist V I."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.say("Probier selbst: Schieb den Regler oder tippe auf eine Jahreszahl."); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Römische Zahlen im Alltag",
        say: "Römische Zahlen siehst du heute noch: an Gebäuden, auf Uhren, im Sport und bei Königen.",
        build(s) {
          const reveal = (txt) => s.h("p", { class: "t later", style: { color: P.red, fontWeight: 700 } }, txt);
          const r1 = reveal("MDCCCXXVIII = 1.000 + 800 + 20 + 8 = 1828"), r2 = reveal("LX = 50 + 10 = 60"), r3 = reveal("II = 2, XIV = 14");
          const c1 = life(s, { class: "life a-up", label: "Im Alltag · Berlin, Museumsinsel", style: { display: "flex", flexDirection: "column", gap: "8px", padding: "12px 16px" } },
            s.photo("altes-museum", { w: 490, h: 198 }), s.h("p", { class: "small" }, "Altes Museum: Am Ende der Inschrift steht das Baujahr."), r1);
          const c2 = life(s, { class: "life later", label: "Im Alltag · Sport", style: { display: "flex", flexDirection: "column", gap: "10px", padding: "12px 16px" } },
            s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "16px" } }, romTile(s, "LX", 64, P.blue), s.h("p", { class: "small" }, "Der Super Bowl im American Football wird römisch gezählt. Am 8. Februar 2026 war Super Bowl LX.")), r2);
          const c3 = life(s, { class: "life later", label: "Im Alltag · Könige und Bücher", style: { display: "flex", flexDirection: "column", gap: "10px", padding: "12px 16px" } },
            s.h("p", { class: "small" }, "Friedrich II. von Preußen ließ Schloss Sanssouci bauen. Sprich: „Friedrich der Zweite“. Auch Kapitel in Büchern werden oft römisch nummeriert: Kapitel XIV."), r3);
          const c4 = lifeRow(s, "later", s.photo("uhr-roemisch", { w: 110, h: 110, pos: "50% 45%" }), "Uhren: XII steht oben, VI unten. Auf vielen Uhren steht IIII statt IV.");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "522px 1fr", gap: "20px", alignItems: "center" }, s.h("div", { class: "stack", style: { gap: "16px" } }, c1, c4), s.h("div", { class: "stack", style: { gap: "18px" } }, c2, c3)));
          s.sound("church-bells", { vol: .35, dur: 3 });
          s.step(async () => { s.sfx.scribble(); await s.show(r1, "up"); s.say("M ist tausend, D C C C achthundert, X X zwanzig, V I I I acht: achtzehnhundertachtundzwanzig."); });
          s.step(async () => { s.sound("crowd-cheer", { vol: .45, dur: 2.5 }); await s.show(c2, "right"); await s.show(r2, "up"); s.say("L X ist sechzig: der sechzigste Super Bowl."); });
          s.step(async () => { s.sound("chalk-write", { vol: .4, dur: 1.5 }); await s.show(c3, "right"); await s.show(r3, "up"); });
          s.step(async () => { s.sound("clock-tick", { vol: .5, dur: 2 }); await s.show(c4, "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Das Zweiersystem: Bündeln mit 2",
        say: "Im Zweiersystem bündeln wir nicht zehn, sondern immer nur zwei. Wir sortieren dreizehn Murmeln.",
        build(s) {
          const W = 620, H = 330, svg = s.svg(W, H), R = rnd(3), N = 13;
          const boxes = [[8, 30, 170, P.violet, "Achter"], [4, 210, 120, P.blue, "Vierer"], [2, 340, 120, P.green, "Zweier"], [1, 470, 120, P.orange, "Einer"]];
          boxes.forEach(([v, x, w, c, n]) => svg.append(s.el("rect", { x, y: 160, width: w, height: 110, rx: 14, fill: "#fff", stroke: c, "stroke-width": 3 }), T(s, x + w / 2, 150, `${n} (${v})`, { "font-size": 20, fill: c })));
          const digs = [1, 1, 0, 1].map((d, i) => later(fb(T(s, boxes[i][1] + boxes[i][2] / 2, 316, String(d), { "font-size": 40, fill: boxes[i][3] }))));
          svg.append(...digs);
          const target = i => {
            if (i < 8) return { x: 52 + (i % 4) * 42, y: 192 + Math.floor(i / 4) * 46 };
            if (i < 12) return { x: 248 + ((i - 8) % 2) * 44, y: 192 + Math.floor((i - 8) / 2) * 46 };
            return { x: 530, y: 215 };
          };
          const cols = ["#3b82f6", "#ef4444", "#22c55e", "#eab308", "#a855f7"];
          const balls = [];
          for (let i = 0; i < N; i++) {
            const x = 40 + R() * 540, y = 30 + R() * 90, c = s.el("circle", { cx: 0, cy: 0, r: 17, fill: cols[i % 5], stroke: P.ink, "stroke-width": 1.5, transform: `translate(${x},${y})` });
            const shine = s.el("circle", { cx: -5, cy: -6, r: 5, fill: "#fff", opacity: .55, transform: `translate(${x},${y})` });
            const g = later(fb(s.el("g"))); g.append(c, shine); g.p = { x, y }; g.parts = [c, shine]; svg.append(g); balls.push(g);
          }
          const res = s.h("p", { class: "h2 later" }, "13 = ", s.h("b", { style: { color: U } }, "1101"), s.h("span", { class: "small pencil" }, " (im Zweiersystem)"));
          const ladder = ["2 Einer = 1 Zweier", "2 Zweier = 1 Vierer", "2 Vierer = 1 Achter"].map(t => s.h("p", { class: "t later", style: { fontWeight: 700, color: U } }, t));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Im ", s.h("b", null, "Zweiersystem"), " (Binärsystem) gibt es nur die Ziffern ", s.h("b", null, "0 und 1"), ". Jede Stelle ist doppelt so viel wert wie ihr rechter Nachbar.");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "620px 1fr", gap: "22px", alignItems: "center" },
            ex(s, "13 Murmeln bündeln", { class: "ex a-left", style: { padding: "12px 14px" } }, svg),
            s.h("div", { class: "stack", style: { gap: "12px" } }, s.photo("murmeln", { w: 410, h: 150, cls: "a-zoom" }), ...ladder, res, merk)));
          s.sfx.pop();
          s.step(async () => { s.sound("murmeln-rollen", { vol: .5, dur: 2 }); for (const b of balls) { s.show(b, "pop"); await s.wait(60); } s.say("Dreizehn Murmeln."); });
          s.step(async () => {
            for (const l of ladder) { s.sfx.note(4, .15); await s.show(l, "left"); await s.wait(120); }
            await Promise.all(balls.map((g, i) => { const a = g.p, b = target(i); return s.tween({ from: 0, to: 1, dur: 800, delay: i * 50, ease: "inOut", update: t => g.parts.forEach(p => p.setAttribute("transform", `translate(${a.x + (b.x - a.x) * t},${a.y + (b.y - a.y) * t})`)) }); }));
            s.sfx.snap(); s.say("Ein Achter-Bündel, ein Vierer-Bündel, kein Zweier und ein Einer.");
          });
          s.step(async () => { for (let i = 0; i < 4; i++) { s.show(digs[i], "pop"); s.sfx.count(i * 2); await s.wait(250); } s.sfx.ding(); await s.show(res, "up"); s.say("Dreizehn heißt im Zweiersystem eins, eins, null, eins."); });
          s.step(async () => { s.sfx.pop(); await s.show(merk, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Binär zählen: Lampen an und aus",
        say: "Jede Lampe ist entweder an oder aus: eins oder null. Tippe auf die Lampen!",
        build(s) {
          const VAL = [16, 8, 4, 2, 1], W = 640, H = 300, svg = s.svg(W, H);
          const state = [0, 0, 0, 0, 0];
          const lamps = VAL.map((v, i) => {
            const x = 72 + i * 124, g = s.el("g", { style: { cursor: "pointer" } });
            const glow = s.el("circle", { cx: x, cy: 110, r: 56, fill: P.yellow, opacity: 0 });
            const bulb = s.el("circle", { cx: x, cy: 110, r: 40, fill: "#e5e7eb", stroke: P.ink, "stroke-width": 3 });
            g.append(T(s, x, 30, String(v), { "font-size": 26, fill: U }), glow, bulb, s.el("rect", { x: x - 18, y: 148, width: 36, height: 26, rx: 4, fill: "#9aa3b2", stroke: P.ink, "stroke-width": 2 }));
            const dg = T(s, x, 240, "0", { "font-size": 48, fill: P.pencil });
            g.append(dg); svg.append(g);
            g.addEventListener("click", () => { state[i] ^= 1; s.sound("lichtschalter", { vol: .7 }); upd(); });
            return { glow, bulb, dg };
          });
          const out = s.h("p", { class: "huge mono", style: { color: U, textAlign: "center" } }, "0");
          const sum = s.h("p", { class: "t", style: { textAlign: "center", minHeight: "32px", color: P.pencil } }, "alle aus = 0");
          function upd() {
            let n = 0;
            lamps.forEach((l, i) => { const on = state[i]; l.glow.setAttribute("opacity", on ? .45 : 0); l.bulb.setAttribute("fill", on ? P.yellow : "#e5e7eb"); l.dg.textContent = on ? "1" : "0"; l.dg.setAttribute("fill", on ? P.red : P.pencil); n += on * VAL[i]; });
            out.textContent = String(n);
            const parts = VAL.filter((v, i) => state[i]);
            sum.textContent = parts.length ? `${parts.join(" + ")} = ${n}` : "alle aus = 0";
          }
          const setN = n => { VAL.forEach((v, i) => { state[i] = n & v ? 1 : 0; }); upd(); };
          const fing = ex(s, "Mit einer Hand bis 31", { class: "ex later", style: { padding: "12px 16px" } }, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "14px" } }, s.h("div", { style: { fontSize: "54px" } }, "✋"),
            s.h("p", { class: "small" }, "Jeder Finger ist eine Lampe: Daumen = 1, Zeigefinger = 2, Mittelfinger = 4, Ringfinger = 8, kleiner Finger = 16. Alle hoch: 31!")));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Die Stellenwerte im Zweiersystem: ", s.h("b", null, "1, 2, 4, 8, 16, 32 …"), " – immer das Doppelte.");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "640px 1fr", gap: "22px", alignItems: "center" },
            ex(s, "Tippe auf die Lampen", { class: "ex a-left", style: { padding: "12px 14px" } }, svg),
            s.h("div", { class: "stack", style: { gap: "12px" } }, out, sum, fing, merk)));
          s.sfx.pop();
          s.step(async () => { s.say("Wir zählen von null bis zehn."); for (let n = 0; n <= 10 && s.alive; n++) { setN(n); s.sound("lichtschalter", { vol: .5 }); s.sfx.note(n, .1); await s.wait(650); } });
          s.step(async () => { setN(31); s.sfx.chord([0, 4, 7, 12]); await s.show(fing, "up"); s.say("Mit fünf Fingern kannst du bis einunddreißig zählen."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Computer rechnen mit 0 und 1",
        say: "In jedem Computer stecken winzige Schalter: an ist eins, aus ist null. Der erste funktionierende Computer wurde in Berlin gebaut.",
        build(s) {
          const z3 = s.photo("zuse-z3", { w: 400, h: 300, caption: "Nachbau der Z3", cls: "a-zoom" });
          const zt = s.h("p", { class: "small" }, s.h("b", null, "Konrad Zuse"), " führte am 12. Mai 1941 in Berlin-Kreuzberg die ", s.h("b", null, "Z3"), " vor – den ersten funktionierenden programmierbaren Computer. Er rechnete im Zweiersystem.");
          const VAL = [128, 64, 32, 16, 8, 4, 2, 1], bits = [0, 1, 0, 0, 0, 0, 0, 1];
          const cells = VAL.map((v, i) => {
            const d = s.h("div", { style: { width: "54px", height: "54px", borderRadius: "10px", border: "2px solid var(--line)", background: "#fff", display: "grid", placeItems: "center", font: "800 30px/1 var(--f-display)", color: P.pencil, transition: "background .2s" } }, "0");
            return { box: s.h("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" } }, s.h("span", { class: "small pencil" }, String(v)), d), d, on: bits[i] };
          });
          const A = s.h("p", { class: "h2 later" }, "64 + 1 = 65 → Buchstabe ", s.h("b", { style: { color: U, fontSize: "40px" } }, "A"));
          const byte = s.h("p", { class: "t later" }, "8 Bits = 1 ", s.h("b", null, "Byte"), ": 2 · 2 · 2 · 2 · 2 · 2 · 2 · 2 = ", s.h("b", { class: "red" }, "256"), " Möglichkeiten.");
          const lf = life(s, { class: "life later", style: { padding: "10px 16px" } }, s.h("p", { class: "small" }, "Fotos, Musik, Videos und diese Folien: Im Computer ist alles als 0 und 1 gespeichert."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "400px 1fr", gap: "24px", alignItems: "center" },
            s.h("div", { class: "stack", style: { gap: "10px" } }, z3, zt),
            s.h("div", { class: "stack", style: { gap: "14px" } }, s.h("p", { class: "t a-up" }, "Ein Schalter heißt ", s.h("b", null, "Bit"), ". Mit 8 Bits speichert der Computer einen Buchstaben:"),
              s.h("div", { class: "row", style: { gap: "8px", flexWrap: "nowrap" } }, ...cells.map(c => c.box)), A, byte, lf)));
          s.preload("lichtschalter");
          s.step(async () => {
            for (const c of cells) { s.sfx.tick(); if (c.on) { c.d.textContent = "1"; c.d.style.background = P.yellow; c.d.style.color = P.red; s.sound("lichtschalter", { vol: .6 }); } await s.wait(180); }
            await s.show(A, "up"); s.sfx.ding(); s.say("Null eins null null null null null eins: Das ist fünfundsechzig, der Buchstabe A.");
          });
          s.step(async () => { s.sfx.pop(); await s.show(byte, "up"); s.say("Acht Schalter: zweihundertsechsundfünfzig Möglichkeiten. Das ist das Zählprinzip!"); });
          s.step(async () => { s.sound("keyboard", { vol: .5, dur: 2 }); await s.show(lf, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Quadratzahlen",
        say: "Lege Punkte zu Quadraten: eins, vier, neun, sechzehn, fünfundzwanzig. Das sind Quadratzahlen.",
        build(s) {
          const W = 1060, H = 200, svg = s.svg(W, H), groups = [];
          let x = 50;
          for (let n = 1; n <= 5; n++) {
            const g = s.el("g"), dots = [], step = 28, w = n * step;
            for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) { const d = later(fb(s.el("circle", { cx: x + c * step + 12, cy: 160 - (n - 1) * step + r * step, r: 11, fill: r === n - 1 || c === n - 1 ? U : "#e9c46a" }))); dots.push(d); g.append(d); }
            const lab = later(fb(T(s, x + w / 2 - 2, 30, `${n} · ${n} = ${n * n}`, { "font-size": 22, fill: P.ink })));
            g.append(lab); svg.append(g); groups.push({ dots, lab });
            x += Math.max(w, 120) + 70;
          }
          // tile grid with slider
          const TW = 300, tsv = s.svg(TW, TW), tg = s.el("g"); tsv.append(tg);
          const out = s.h("p", { class: "h2 mono", style: { color: U } });
          const draw = n => {
            tg.innerHTML = ""; const c = (TW - 4) / n;
            for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) tg.append(s.el("rect", { x: 2 + j * c, y: 2 + i * c, width: c - 2, height: c - 2, rx: Math.min(4, c / 5), fill: (i + j) % 2 ? "#e9c46a" : "#f4dfa0", stroke: U, "stroke-width": 1 }));
            out.innerHTML = ""; out.append(`${n} · ${n} = `, pw(s, n, 2), ` = ${n * n}`);
          };
          draw(5);
          const sl = s.slider({ label: "Seitenlänge", min: 1, max: 12, value: 5, onInput: draw });
          const play = ex(s, "Quadratische Fliesen legen", { class: "ex later", style: { padding: "12px 16px" } }, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "18px" } }, tsv, s.h("div", { class: "stack", style: { gap: "12px", flex: 1 } }, sl, out)));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Eine Zahl mal sich selbst gibt eine ", s.h("b", null, "Quadratzahl"), ": 4 · 4 = ", pw(s, 4, 2), " = 16. Sprich: „vier hoch zwei“ oder „vier zum Quadrat“.");
          s.add(root(s, "stack", { justifyContent: "space-between", gap: "12px" }, svg, s.h("div", { style: { display: "grid", gridTemplateColumns: "640px 1fr", gap: "20px", alignItems: "center" } }, play, merk)));
          s.sfx.pop();
          s.step(async () => {
            for (let k = 0; k < groups.length; k++) { const g = groups[k]; g.dots.forEach((d, i) => s.show(d, "pop", i * 18)); s.sfx.note(k * 3, .2); await s.wait(g.dots.length * 18 + 200); s.show(g.lab, "up"); await s.wait(200); }
            s.say("Jedes Quadrat hat gleich viele Punkte in jeder Reihe und jeder Spalte.");
          });
          s.step(async () => { s.sfx.whoosh(); await s.show(play, "up"); s.say("Schieb den Regler: Wie viele Fliesen braucht ein Quadrat mit zwölf Fliesen Seitenlänge?"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "left"); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Quadratzahlen bis 20²",
        say: "Die Quadratzahlen bis zwanzig hoch zwei solltest du kennen. Und es gibt einen tollen Trick: ungerade Zahlen!",
        build(s) {
          const cells = [];
          for (let n = 1; n <= 20; n++) cells.push(s.h("div", { class: "card later", style: { padding: "12px 4px", textAlign: "center", fontSize: "27px", background: n <= 10 ? "#fff" : SOFT } }, pw(s, n, 2), s.h("span", { style: { color: P.pencil } }, " = "), s.h("b", { style: { color: U } }, String(n * n))));
          const grid = s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" } }, ...cells);
          const W = 250, svg = s.svg(W, W), C = 56, Ls = [];
          const LC = [U, P.blue, P.green, P.violet];
          for (let k = 0; k < 4; k++) {
            const g = later(s.el("g"));
            for (let i = 0; i <= k; i++) for (let j = 0; j <= k; j++) if (i === k || j === k) g.append(s.el("rect", { x: 8 + j * C, y: 8 + i * C, width: C - 6, height: C - 6, rx: 8, fill: LC[k] }));
            svg.append(g); Ls.push(g);
          }
          const sumT = s.h("p", { class: "h2 mono later", style: { textAlign: "center" } }, "1 + 3 + 5 + 7 = 16 = ", pw(s, 4, 2));
          const trick = ex(s, "Der Trick mit den Winkeln", { class: "ex later", style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: "12px 14px" } }, svg, sumT);
          const lf = lifeRow(s, "later", s.photo("schachbrett", { w: 110, h: 100 }), "Schachbrett: ", pw(s, 8, 2), " = 64 Felder.");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "1fr 380px", gap: "20px", alignItems: "center" }, grid, s.h("div", { class: "stack", style: { gap: "12px" } }, trick, lf)));
          s.sfx.pop();
          s.step(async () => { for (let i = 0; i < 20; i++) { s.show(cells[i], "pop"); s.sfx.count(i % 12); await s.wait(110); } s.say("Eins, vier, neun, sechzehn … bis vierhundert."); });
          s.step(async () => { await s.show(trick, "right"); for (let k = 0; k < 4; k++) { s.sound("holzblock", { vol: .6 }); await s.show(Ls[k], "fade"); await s.wait(350); } await s.show(sumT, "up"); s.say("Eins plus drei plus fünf plus sieben ist sechzehn. Jeder Winkel macht das Quadrat größer."); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Potenzen: Basis und Exponent",
        say: "Statt zwei mal zwei mal zwei mal zwei mal zwei schreiben wir kurz: zwei hoch fünf.",
        build(s) {
          const base = s.h("span", { style: { font: "800 120px/1 var(--f-display)", color: P.blue } }, "2");
          const expo = s.h("span", { style: { font: "800 64px/1 var(--f-display)", color: P.red, alignSelf: "flex-start" } }, "5");
          const anat = s.h("div", { style: { display: "flex", alignItems: "flex-start", gap: "2px" } }, base, expo);
          const lb = s.h("div", { class: "later", style: { color: P.blue, font: "700 24px/1.2 var(--f-display)" } }, "← Basis: diese Zahl wird malgenommen");
          const le = s.h("div", { class: "later", style: { color: P.red, font: "700 24px/1.2 var(--f-display)" } }, "← Exponent: so oft");
          const facs = [0, 1, 2, 3, 4].map(i => s.h("span", { class: "later", style: { font: "800 44px/1 var(--f-display)", color: P.blue } }, (i ? "· " : "") + "2"));
          const res = s.h("span", { class: "later", style: { font: "800 44px/1 var(--f-display)", color: P.ink } }, "= 32");
          const exp = s.h("div", { class: "row", style: { gap: "10px", flexWrap: "nowrap" } }, s.h("span", { style: { font: "800 44px/1 var(--f-display)" } }, "="), ...facs, res);
          const top = s.h("div", { class: "row a-zoom", style: { gap: "30px", flexWrap: "nowrap", alignItems: "center" } }, anat, s.h("div", { class: "stack", style: { gap: "18px" } }, le, lb));
          const card = (lab, b, e, chain, val, first) => ex(s, lab, { class: "ex later", style: { display: "flex", flexDirection: "column", gap: "6px", padding: "12px 16px" } },
            s.h("p", { class: "h2" }, pw(s, b, e), ` = ${chain} = `, s.h("b", { style: { color: U } }, val)));
          const cards = [card("Zehnerpotenz", 10, 3, "10 · 10 · 10", "1.000"), card("Quadratzahl", 5, 2, "5 · 5", "25"), card("Dreierpotenz", 3, 4, "3 · 3 · 3 · 3", "81")];
          const warn = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Vorsicht: ", pw(s, 2, 3), " ist ", s.h("b", null, "nicht"), " 2 · 3! ", pw(s, 2, 3), " = 2 · 2 · 2 = ", s.h("b", null, "8"), ", aber 2 · 3 = 6.");
          let bb = 3, ee = 4;
          const eo = s.h("p", { class: "h2 mono", style: { color: P.ink, minHeight: "38px", fontSize: "25px" } });
          const eupd = () => { eo.innerHTML = ""; eo.append(pw(s, bb, ee), ` = ${Array(ee).fill(bb).join(" · ")} = `, s.h("b", { style: { color: U } }, s.fmt(Math.pow(bb, ee)))); };
          eupd();
          const sb = s.slider({ label: "Basis", min: 1, max: 10, value: bb, onInput: v => { bb = v; eupd(); } });
          const se = s.slider({ label: "Exponent", min: 1, max: 5, value: ee, onInput: v => { ee = v; eupd(); } });
          const expl = ex(s, "Ausprobieren", { class: "ex later", style: { padding: "12px 18px" } }, s.h("div", { style: { display: "grid", gridTemplateColumns: "220px 220px 1fr", gap: "24px", alignItems: "center" } }, sb, se, eo));
          s.add(root(s, "stack", { justifyContent: "space-between", gap: "14px" }, s.h("div", { class: "row", style: { gap: "50px", flexWrap: "nowrap", justifyContent: "center" } }, top, exp),
            s.h("div", { class: "cols3", style: { gap: "16px" } }, ...cards), expl, warn));
          s.sfx.pop();
          s.step(async () => { s.sfx.note(0, .2); await s.show(lb, "left"); s.sfx.note(7, .2); await s.show(le, "left"); s.say("Die Zwei unten heißt Basis. Die kleine Fünf oben heißt Exponent."); });
          s.step(async () => { for (let i = 0; i < 5; i++) { s.show(facs[i], "pop"); s.sfx.count(i * 2); await s.wait(260); } s.sfx.ding(); await s.show(res, "zoom"); s.say("Fünfmal die Zwei malnehmen: zweiunddreißig."); });
          s.step(async () => { for (const c of cards) { s.sfx.pop(); await s.show(c, "up"); await s.wait(120); } s.say("Zehn hoch drei ist tausend. Fünf hoch zwei ist fünfundzwanzig. Drei hoch vier ist einundachtzig."); });
          s.step(async () => { s.sfx.boing(); await s.show(warn, "up"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(expl, "up"); s.say("Probier selbst: Stell Basis und Exponent ein."); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Immer doppelt: Zweierpotenzen",
        say: "Jedes Mal verdoppeln: eins, zwei, vier, acht, sechzehn … Zweierpotenzen wachsen unglaublich schnell!",
        build(s) {
          const G = 32, CS = 11, svg = s.svg(G * CS + 4, G * CS + 4), cells = [];
          for (let k = 0; k < 1024; k++) {
            // fill in blocks so that 2^n always forms a rectangle: interleave bits (Z-order)
            let x = 0, y = 0; for (let b = 0; b < 5; b++) { x |= ((k >> (2 * b)) & 1) << b; y |= ((k >> (2 * b + 1)) & 1) << b; }
            const r = s.el("rect", { x: 2 + x * CS, y: 2 + y * CS, width: CS - 1.5, height: CS - 1.5, rx: 2, fill: "#eef1f5" }); cells.push(r); svg.append(r);
          }
          const out = s.h("p", { class: "h2 mono", style: { color: U, minHeight: "38px" } });
          let shown = 0;
          const draw = n => { const v = Math.pow(2, n); cells.forEach((c, k) => c.setAttribute("fill", k < v ? (k < v / 2 ? "#e9c46a" : U) : "#eef1f5")); out.innerHTML = ""; out.append(pw(s, 2, n), ` = ${s.fmt(v)}`); shown = n; };
          draw(0);
          const sl = s.slider({ label: "Wie oft verdoppeln?", min: 0, max: 10, value: 0, onInput: draw }); sl.style.alignSelf = "stretch";
          const left = ex(s, "Kästchen verdoppeln", { class: "ex a-left", style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: "12px 16px" } }, svg, out, sl);
          const lc = (lab, ph, txt) => s.h("div", { class: "life later", style: { display: "flex", gap: "12px", alignItems: "center", padding: "10px 14px" } }, ph, s.h("div", null, s.h("span", { style: LBL }, lab), s.h("p", { class: "small" }, ...txt)));
          const paper = () => { const v = s.svg(120, 96); v.style.flex = "none"; for (let i = 0; i < 8; i++) v.append(s.el("rect", { x: 14 + i * 3, y: 16 + i * 7, width: 80, height: 22, rx: 3, fill: i % 2 ? "#fff" : "#f3f4f6", stroke: P.pencil, "stroke-width": 1.5 })); return v; };
          const L = [
            lc("Die Reiskorn-Legende", s.photo("schachbrett", { w: 120, h: 96 }), ["Feld 1: ein Korn, jedes Feld doppelt so viel. Auf Feld 64 lägen ", pw(s, 2, 63), " – über 9 Trillionen Körner!"]),
            lc("Papier falten", paper(), ["Jedes Falten verdoppelt die Lagen: 7-mal falten = ", pw(s, 2, 7), " = 128 Lagen."]),
            lc("Minecraft und Handy", s.h("div", { style: { fontSize: "50px", width: "120px", textAlign: "center", flex: "none" } }, "📱"), ["Ein Stapel Blöcke: 64 = ", pw(s, 2, 6), ". Handy-Speicher: 64, 128, 256 GB – alles Zweierpotenzen."]),
          ];
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "400px 1fr", gap: "22px", alignItems: "center" }, left, s.h("div", { class: "stack", style: { gap: "14px" } }, ...L)));
          s.sfx.pop();
          s.step(async () => { for (let n = 1; n <= 10 && s.alive; n++) { sl.set(n); s.sfx.note(n * 2, .12); await s.wait(500); } s.say("Zehnmal verdoppeln: tausendvierundzwanzig!"); });
          s.step(async () => { s.sound("magic-chime", { vol: .4 }); await s.show(L[0], "right"); s.say("Auf dem letzten Feld läge viel mehr Reis, als auf der ganzen Welt in einem Jahr wächst."); });
          s.step(async () => { s.sound("paper-crumple", { vol: .4, dur: 1.2 }); await s.show(L[1], "right"); });
          s.step(async () => { s.sfx.pop(); await s.show(L[2], "right"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Kubikzahlen: Würfel bauen",
        say: "Aus kleinen Würfeln bauen wir große Würfel: eins, acht, siebenundzwanzig, vierundsechzig.",
        build(s) {
          const W = 660, H = 340, svg = s.svg(W, H), a = 26, cs = Math.cos(Math.PI / 6);
          const cube = (ox, oy, i, j, k) => {
            const x = ox + (i - j) * a * cs, y = oy + (i + j) * a * 0.5 - k * a;
            const g = later(fb(s.el("g")));
            g.append(s.el("polygon", { points: `${x},${y} ${x + a * cs},${y + a / 2} ${x},${y + a} ${x - a * cs},${y + a / 2}`, fill: "#f4d58d", stroke: P.ink, "stroke-width": 1.2 }),
              s.el("polygon", { points: `${x - a * cs},${y + a / 2} ${x},${y + a} ${x},${y + 2 * a} ${x - a * cs},${y + 1.5 * a}`, fill: "#d6a43a", stroke: P.ink, "stroke-width": 1.2 }),
              s.el("polygon", { points: `${x + a * cs},${y + a / 2} ${x},${y + a} ${x},${y + 2 * a} ${x + a * cs},${y + 1.5 * a}`, fill: U, stroke: P.ink, "stroke-width": 1.2 }));
            return g;
          };
          const stacks = [];
          let ox = 40;
          [1, 2, 3, 4].forEach(n => {
            const cx = ox + n * a * cs, oy = 250 - (n + 1) * a + n * a - n * a * 0.5 - a;
            const list = [];
            for (let k = 0; k < n; k++) for (let s2 = 0; s2 <= 2 * (n - 1); s2++) for (let i = 0; i < n; i++) { const j = s2 - i; if (j >= 0 && j < n) list.push(cube(cx, oy - (n - 1) * a * 0.5 + 40, i, j, k)); }
            const lab = later(fb(T(s, cx, 318, `${n}·${n}·${n} = ${n * n * n}`, { "font-size": 21, fill: U })));
            svg.append(...list, lab); stacks.push({ list, lab });
            ox += 2 * n * a * cs + 34;
          });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Eine Zahl dreimal mit sich selbst malgenommen: ", s.h("b", null, "Kubikzahl"), ". 3 · 3 · 3 = ", pw(s, 3, 3), " = 27. Sprich: „drei hoch drei“.");
          const l1 = lifeRow(s, "later", s.photo("zauberwuerfel", { w: 150, h: 140 }), "Der Zauberwürfel sieht aus wie 3 · 3 · 3 = 27 kleine Würfel.");
          const l2 = life(s, { class: "life later", style: { padding: "10px 14px" } }, s.h("p", { class: "small" }, "In einen Würfel mit 10 cm Kantenlänge passt genau 1 Liter: ", pw(s, 10, 3), " = 1.000 Würfelchen mit 1 cm Kante."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "660px 1fr", gap: "22px", alignItems: "center" },
            s.h("div", { class: "stack", style: { gap: "12px" } }, ex(s, "Würfel aus Würfeln", { class: "ex a-left", style: { padding: "12px 10px" } }, svg), merk),
            s.h("div", { class: "stack", style: { gap: "14px" } }, l1, l2)));
          s.sfx.pop();
          s.step(async () => {
            for (const st of stacks) { for (let i = 0; i < st.list.length; i++) { s.show(st.list[i], "pop"); if (i % 4 === 0) s.sound("holzblock", { vol: .35 }); await s.wait(Math.max(25, 160 - st.list.length * 2)); } s.show(st.lab, "up"); s.sfx.ding(); await s.wait(250); }
            s.say("Vier mal vier mal vier: vierundsechzig kleine Würfel.");
          });
          s.step(async () => { s.sfx.pop(); await s.show(merk, "up"); });
          s.step(async () => { s.sound("wuerfeln", { vol: .5 }); await s.show(l1, "right"); });
          s.step(async () => { s.sound("water-pour", { vol: .4, dur: 2 }); await s.show(l2, "right"); s.say("Zehn hoch drei Würfelchen füllen einen Liter."); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Eine Zahl – viele Schreibweisen",
        say: "Zum Schluss: Die Zahl zweitausendsechsundzwanzig in drei Zahlsystemen. Und Potenzen überall im Alltag.",
        build(s) {
          const bin = (2026).toString(2);
          const row = (lab, val, font, col, sub) => s.h("div", { class: "card later", style: { display: "grid", gridTemplateColumns: "220px 1fr", alignItems: "center", gap: "14px", padding: "10px 18px" } },
            s.h("div", null, s.h("b", { style: { fontSize: "22px" } }, lab), s.h("p", { class: "small pencil" }, sub)), s.h("span", { style: { font: font, color: col, letterSpacing: ".03em", whiteSpace: "nowrap" } }, val));
          const rows = [
            row("Zehnersystem", "2026", "800 50px/1 var(--f-display)", P.ink, "Bündel zu 10"),
            row("Römisch", toRoman(2026), `700 48px/1 ${ROMF}`, U, "M, X, V, I"),
            row("Zweiersystem", bin, "800 40px/1 var(--f-display)", P.violet, "Bündel zu 2"),
          ];
          const lc = (lab, ph, txt) => s.h("div", { class: "life later", style: { display: "flex", flexDirection: "column", gap: "8px", padding: "10px 14px" } }, s.h("span", { style: LBL }, lab), ph, s.h("p", { class: "small" }, ...txt));
          const mc = s.svg(116, 116), RR = rnd(5); for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) mc.append(s.el("rect", { x: 2 + i * 7, y: 2 + j * 7, width: 6.4, height: 6.4, fill: RR() < .8 ? "#6aa84f" : RR() < .5 ? "#8a5a2b" : "#9aa3b2" }));
          const L = [
            lc("Minecraft", mc, ["Ein Chunk ist 16 · 16 = ", pw(s, 16, 2), " = 256 Blöcke groß."]),
            lc("Zahlenschloss", s.photo("zahlenschloss", { w: 220, h: 116 }), ["4 Rädchen: ", pw(s, 10, 4), " = 10.000 Codes."]),
            lc("Uhr", s.photo("uhr-roemisch", { w: 220, h: 116, pos: "50% 40%" }), ["XII Stunden, 60 Minuten: römisch und babylonisch."]),
          ];
          s.add(root(s, "stack", { justifyContent: "space-between", gap: "12px" }, s.h("p", { class: "t a-up" }, "Diese Jahreszahl in drei Zahlsystemen:"), ...rows, s.h("div", { class: "cols3", style: { gap: "16px" } }, ...L)));
          s.sfx.pop();
          rows.forEach((r, i) => s.step(async () => { s.sfx.note(i * 4, .2); await s.show(r, "left"); s.say(["Zweitausendsechsundzwanzig im Zehnersystem.", "Römisch: M M X X V I.", "Im Zweiersystem braucht man elf Stellen!"][i]); }));
          s.step(async () => { for (const c of L) { s.sfx.pop(); await s.show(c, "up"); await s.wait(150); } s.sound("kids-cheer", { vol: .4, dur: 2 }); });
        },
      },
    ],
  });
})();
