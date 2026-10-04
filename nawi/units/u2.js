/* Kapitel 2 – Sinne und Messen (Sinnesorgane, Reizweg, Täuschungen, Messgrößen, Thermometer, Waage, Messzylinder, Reaktionszeit, Mittelwert) */
(() => {
  const P = { unit: "#7b4fd6", soft: "#ece5fb", blue: "#1d5bd0", red: "#dc3b2a", green: "#138a5a", violet: "#7b4fd6", orange: "#ee7a1a", ink: "#1b2740", pencil: "#5d6678", yellow: "#ffd94a", line: "#c8d3de", skin: "#f6d2b0", skinD: "#c98d60" };
  const later = el => { el.classList.add("later"); return el; };
  const fb = el => { el.style.transformBox = "fill-box"; el.style.transformOrigin = "center"; return el; };
  const T = (s, x, y, text, a) => s.el("text", Object.assign({ x, y, "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: P.ink, text }, a || {}));
  const root = (s, cls, style, ...kids) => s.h("div", { class: cls, style: Object.assign({ height: "100%" }, style || {}) }, ...kids);
  const life = (s, attrs, ...kids) => s.h("div", Object.assign({ class: "life" }, attrs || {}), s.h("span", { class: "exlabel" }, "Im Alltag"), ...kids);
  const ex = (s, label, attrs, ...kids) => s.h("div", Object.assign({ class: "ex" }, attrs || {}), s.h("span", { class: "exlabel" }, label), ...kids);
  const b = (s, t) => s.h("b", null, t);
  const p = (s, t, style, ...kids) => s.h("p", { class: "t", style: Object.assign({ fontSize: "22px" }, style || {}) }, t, ...kids);
  const SENSES = [
    { k: "auge", sinn: "Sehen", organ: "Auge", reiz: "Licht", col: "#1d5bd0", nerv: "Sehnerv", emoji: "💡", ding: "Lampe", wahr: "Ich sehe: Die Lampe leuchtet!" },
    { k: "ohr", sinn: "Hören", organ: "Ohr", reiz: "Schall", col: "#7b4fd6", nerv: "Hörnerv", emoji: "🥁", ding: "Trommel", wahr: "Ich höre: Da trommelt jemand!" },
    { k: "nase", sinn: "Riechen", organ: "Nase", reiz: "Duftstoffe", col: "#ee7a1a", nerv: "Riechnerv", emoji: "🍕", ding: "Pizza", wahr: "Ich rieche: Pizza ist fertig!" },
    { k: "zunge", sinn: "Schmecken", organ: "Zunge", reiz: "Geschmacksstoffe", col: "#dc3b2a", nerv: "Nerven", emoji: "🍋", ding: "Zitrone", wahr: "Ich schmecke: Das ist sauer!" },
    { k: "haut", sinn: "Fühlen (Tasten)", organ: "Haut", reiz: "Druck, Wärme, Kälte, Schmerz", col: "#138a5a", nerv: "Nerven", emoji: "☕", ding: "heiße Tasse", wahr: "Ich fühle: Vorsicht, heiß!" },
  ];

  /* organ pictures, centred on 0,0, about ±70 */
  function organ(s, k) {
    const g = s.el("g");
    const sk = { fill: P.skin, stroke: P.skinD, "stroke-width": 4, "stroke-linejoin": "round", "stroke-linecap": "round" };
    if (k === "auge") {
      g.append(s.el("path", { d: "M-72 0 Q0 -58 72 0 Q0 58 -72 0 Z", fill: "#fff", stroke: P.ink, "stroke-width": 4 }), s.el("circle", { r: 28, fill: "#3f7fd6" }), s.el("circle", { r: 12, fill: "#111" }), s.el("circle", { cx: 8, cy: -9, r: 5, fill: "#fff" }));
    } else if (k === "ohr") {
      g.append(s.el("path", Object.assign({ d: "M-26 -62 C34 -78 64 -20 34 18 C18 38 22 56 -2 64 C-22 70 -36 56 -32 44 C-40 20 -56 -40 -26 -62 Z" }, sk)), s.el("path", { d: "M-12 -38 C20 -46 36 -14 18 8 C6 22 -6 18 -4 4", fill: "none", stroke: P.skinD, "stroke-width": 4, "stroke-linecap": "round" }));
    } else if (k === "nase") {
      g.append(s.el("path", Object.assign({ d: "M-30 -66 C-24 -20 6 12 34 32 C30 46 10 52 -6 48 C-18 56 -36 50 -40 40" }, sk)), s.el("ellipse", { cx: 4, cy: 38, rx: 9, ry: 5, fill: P.skinD }));
    } else if (k === "zunge") {
      g.append(s.el("path", { d: "M-66 -18 Q0 -54 66 -18 Q50 50 0 56 Q-50 50 -66 -18 Z", fill: "#7a2230" }), s.el("path", { d: "M-40 -8 C-40 50 40 50 40 -8 Z", fill: "#ef7b8a", stroke: "#c4485c", "stroke-width": 3 }), s.el("line", { x1: 0, y1: 0, x2: 0, y2: 30, stroke: "#c4485c", "stroke-width": 3 }));
    } else if (k === "haut") {
      g.append(s.el("path", Object.assign({ d: "M-44 66 L-44 -6 C-44 -16 -30 -16 -30 -6 L-30 -50 C-30 -60 -16 -60 -16 -50 L-16 -62 C-16 -72 -2 -72 -2 -62 L-2 -56 C-2 -66 12 -66 12 -56 L12 -44 C12 -54 26 -54 26 -44 L26 20 C26 44 14 66 -10 66 Z" }, sk)), s.el("path", { d: "M40 -2 C50 -20 54 -36 48 -54 M56 0 C66 -18 70 -34 64 -52", fill: "none", stroke: P.red, "stroke-width": 4, "stroke-linecap": "round" }));
    }
    return g;
  }
  function brain(s) {
    const g = s.el("g");
    g.append(s.el("path", { d: "M-84 10 C-94 -40 -44 -74 0 -62 C44 -78 94 -46 86 0 C98 32 62 64 20 54 C-10 68 -62 62 -72 36 C-90 32 -90 18 -84 10 Z", fill: "#f4a7b9", stroke: "#c25b7a", "stroke-width": 4 }));
    ["M-50 -30 C-30 -40 -20 -20 -40 -10", "M-10 -50 C10 -30 -10 -10 10 0", "M30 -40 C50 -30 40 -10 60 -6", "M-60 20 C-40 10 -30 30 -10 24", "M10 20 C30 10 40 34 60 26"].forEach(d => g.append(s.el("path", { d, fill: "none", stroke: "#c25b7a", "stroke-width": 3, "stroke-linecap": "round" })));
    return g;
  }
  const hand = (s, col = P.skin) => s.el("g", null, s.el("path", { d: "M-26 -70 L-26 10 C-26 30 26 30 26 10 L26 -70 Z", fill: col, stroke: P.skinD, "stroke-width": 3 }),
    ...[-18, -6, 6, 18].map(x => s.el("rect", { x: x - 5, y: 6, width: 10, height: 34, rx: 5, fill: col, stroke: P.skinD, "stroke-width": 3 })));

  Deck.unit({
    id: "u2", num: 2, title: "Sinne und Messen", color: P.unit, soft: P.soft,
    subtitle: "Was unsere Sinne können – und warum wir messen",
    blurb: "5 Sinne, Täuschungen, Thermometer, Waage, Messzylinder.",
    goals: ["Die fünf Sinne und ihre Sinnesorgane kennen", "Den Weg vom Reiz zum Gehirn verstehen", "Sehen, wie leicht Sinne getäuscht werden", "Richtig messen: Zahl und Einheit", "Thermometer, Waage und Messzylinder ablesen", "Mehrmals messen und den Mittelwert bilden"],
    icon(svg, el) {
      svg.append(el("path", { d: "M8 35 Q35 8 62 35 Q35 62 8 35 Z", fill: "#fff", stroke: P.unit, "stroke-width": 4 }), el("circle", { cx: 35, cy: 35, r: 11, fill: P.unit }), el("circle", { cx: 35, cy: 35, r: 5, fill: "#1b2740" }),
        el("path", { d: "M10 62 L60 62 M20 62 L20 56 M30 62 L30 58 M40 62 L40 56 M50 62 L50 58", stroke: P.unit, "stroke-width": 3 }));
    },
    slides: [
      /* 1 ------------------------------------------------------------ */
      {
        title: "Unsere fünf Sinne",
        say: "Wir haben fünf Sinne: Sehen, Hören, Riechen, Schmecken und Fühlen. Für jeden gibt es ein Sinnesorgan.",
        build(s) {
          const svg = s.svg(470, 580);
          svg.append(s.el("ellipse", { cx: 220, cy: 250, rx: 150, ry: 180, fill: P.skin, stroke: P.skinD, "stroke-width": 4 }));
          svg.append(s.el("path", { d: "M74 210 C70 90 150 60 220 64 C300 60 372 100 366 210 C340 140 300 120 220 118 C150 118 100 140 74 210 Z", fill: "#7a4a24" }));
          svg.append(s.el("ellipse", { cx: 70, cy: 260, rx: 18, ry: 34, fill: P.skin, stroke: P.skinD, "stroke-width": 4 }), s.el("ellipse", { cx: 370, cy: 260, rx: 18, ry: 34, fill: P.skin, stroke: P.skinD, "stroke-width": 4 }));
          [165, 275].forEach(x => svg.append(s.el("ellipse", { cx: x, cy: 222, rx: 30, ry: 18, fill: "#fff", stroke: P.ink, "stroke-width": 3 }), s.el("circle", { cx: x, cy: 222, r: 11, fill: "#3f7fd6" }), s.el("circle", { cx: x, cy: 222, r: 5, fill: "#111" })));
          svg.append(s.el("path", { d: "M220 236 C214 262 206 282 212 292 C218 298 228 296 232 290", fill: "none", stroke: P.skinD, "stroke-width": 4, "stroke-linecap": "round" }));
          svg.append(s.el("path", { d: "M170 336 Q220 384 270 336 Z", fill: "#7a2230" }), s.el("path", { d: "M196 352 Q220 384 244 352 Z", fill: "#ef7b8a" }));
          const hd = s.el("g", { transform: "translate(384 500) rotate(160)" }); hd.append(hand(s)); svg.append(hd);
          const spots = { auge: [220, 222, 112, 34], ohr: [370, 260, 30, 46], nase: [220, 270, 30, 38], zunge: [220, 356, 58, 30], haut: [384, 492, 56, 70] };
          const rings = SENSES.map(se => { const [x, y, rx, ry] = spots[se.k]; const r = later(fb(s.el("ellipse", { cx: x, cy: y, rx, ry, fill: "none", stroke: se.col, "stroke-width": 6, "stroke-dasharray": "10 6" }))); svg.append(r); return r; });
          const rows = SENSES.map((se, i) => later(s.h("button", { class: "nosw", style: { display: "grid", gridTemplateColumns: "1fr", textAlign: "left", background: "#fff", border: "2px solid var(--line)", borderLeft: "10px solid " + se.col, borderRadius: "14px", padding: "8px 16px", cursor: "pointer", font: "inherit", color: "inherit" }, onclick: () => pick(i) },
            s.h("span", { style: { font: "700 25px/1.2 var(--f-display)", color: se.col } }, se.sinn + " · " + se.organ),
            s.h("span", { class: "small" }, "Reiz: " + se.reiz))));
          const pick = i => { rows.forEach((r, k) => (r.style.background = k === i ? P.soft : "#fff")); rings.forEach((r, k) => { r.classList.toggle("a-pulse", k === i); }); s.sfx.note([0, 4, 7, 9, 12][i], 0.3); s.say(SENSES[i].sinn + " mit " + (i === 4 ? "der Haut" : i === 3 ? "der Zunge" : i === 2 ? "der Nase" : i === 1 ? "dem Ohr" : "dem Auge")); };
          const merk = later(s.h("div", { class: "merk", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Ein ", b(s, "Sinnesorgan"), " nimmt einen ", b(s, "Reiz"), " aus der Umwelt auf."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "470px 1fr", gap: "30px", alignItems: "center" }, svg, s.h("div", { class: "stack", style: { gap: "10px" } }, ...rows, merk)));
          s.sfx.whoosh();
          const rev = idx => s.step(async () => { for (const i of idx) { s.sfx.note([0, 4, 7, 9, 12][i], 0.25); s.show(rings[i], "zoom"); await s.show(rows[i], "left"); } });
          rev([0, 1]); rev([2, 3]); rev([4]);
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.say("Tippe auf einen Sinn!"); });
        },
      },
      /* 2 ------------------------------------------------------------ */
      {
        title: "Vom Reiz zum Gehirn",
        say: "Ein Reiz trifft auf ein Sinnesorgan. Über einen Nerv läuft ein Signal zum Gehirn. Erst das Gehirn sagt uns, was los ist.",
        build(s) {
          const svg = s.svg(1100, 300);
          const reizT = s.el("text", { x: 110, y: 185, "text-anchor": "middle", "font-size": 92, text: SENSES[0].emoji });
          const ar = (x1, x2, col) => s.el("path", { d: `M${x1} 150 L${x2} 150 M${x2 - 14} 138 L${x2} 150 L${x2 - 14} 162`, stroke: col || P.pencil, "stroke-width": 5, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" });
          const orgG = s.el("g", { transform: "translate(330 150)" });
          const nerve = s.el("path", { d: "M430 150 C490 90 550 210 610 150 S 710 100 760 150", fill: "none", stroke: "#f2c14e", "stroke-width": 9, "stroke-linecap": "round" });
          const br = s.el("g", { transform: "translate(880 150)" }); br.append(brain(s));
          const glow = s.el("circle", { cx: 880, cy: 150, r: 104, fill: P.yellow, opacity: 0 });
          svg.append(glow, reizT, ar(190, 236), orgG, nerve, br);
          const lbl = (x, top, sub, col) => { const g = s.el("g"); const a = T(s, x, 290, top, { fill: col, "font-size": 22 }); const c = T(s, x, 262, sub, { "font-size": 20, fill: P.pencil, "font-weight": 600 }); g.append(c, a); g.sub = c; svg.append(g); return g; };
          const L = [lbl(110, "Reiz", "Licht", P.orange), lbl(330, "Sinnesorgan", "Auge", P.blue), lbl(595, "Nerv", "Sehnerv", "#b8860b"), lbl(880, "Gehirn", "", P.red)];
          const pulses = [0, 1, 2].map(() => { const c = s.el("circle", { r: 10, fill: "#fff", stroke: P.red, "stroke-width": 4, opacity: 0 }); svg.append(c); return c; });
          const wahr = s.h("p", { class: "h2", style: { color: P.unit, textAlign: "center", minHeight: "36px" } }, "");
          const wcard = s.h("div", { class: "card soft", style: { padding: "12px 18px" } }, wahr);
          let cur = 0, busy = false;
          const setSense = i => { cur = i; const se = SENSES[i]; reizT.textContent = se.emoji; orgG.innerHTML = ""; orgG.append(organ(s, se.k)); L[0].sub.textContent = se.reiz.length > 16 ? "Wärme" : se.reiz; L[1].sub.textContent = se.organ; L[2].sub.textContent = se.nerv; };
          setSense(0);
          const run = async () => {
            if (busy) return; busy = true; wahr.textContent = "";
            const len = nerve.getTotalLength();
            if (cur === 1) s.sound("trommel", { vol: .6 }); else s.sfx.pop(); reizT.classList.remove("a-pop"); void reizT.getBoundingClientRect(); fb(reizT); reizT.classList.add("a-pop");
            await s.wait(400); s.sfx.zap();
            pulses.forEach(c => c.setAttribute("opacity", 1));
            await s.tween({ from: 0, to: 1, dur: 1300, ease: "linear", update: v => pulses.forEach((c, i) => { const q = Math.max(0, Math.min(1, v * 1.3 - i * 0.15)); const pt = nerve.getPointAtLength(q * len); c.setAttribute("cx", pt.x); c.setAttribute("cy", pt.y); }) });
            pulses.forEach(c => c.setAttribute("opacity", 0));
            s.sfx.chord([0, 4, 7]);
            await s.tween({ from: 0, to: 1, dur: 500, update: v => glow.setAttribute("opacity", 0.5 * Math.sin(v * Math.PI)) });
            wahr.textContent = SENSES[cur].wahr; wahr.classList.remove("a-pop"); void wahr.offsetWidth; wahr.classList.add("a-pop");
            busy = false;
          };
          const btns = SENSES.map((se, i) => s.h("button", { class: "btn", style: { borderColor: se.col, color: se.col, flex: 1 }, onclick: () => { setSense(i); btns.forEach((x, k) => x.classList.toggle("solid", k === i)); btns.forEach((x, k) => (x.style.background = k === i ? se.col : "#fff")); btns[i].style.color = "#fff"; btns.forEach((x, k) => k !== i && (x.style.color = SENSES[k].col)); run(); } }, se.sinn.split(" ")[0]));
          const brow = later(s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "12px" } }, ...btns));
          const merk = later(s.h("div", { class: "merk", style: { fontSize: "21px", padding: "10px 18px 12px" } }, b(s, "Reiz → Sinnesorgan → Nerv → Gehirn."), " Erst das Gehirn macht daraus eine ", b(s, "Wahrnehmung"), "."));
          s.add(root(s, "stack", { gap: "14px", justifyContent: "center" }, svg, wcard, brow, merk));
          s.sfx.whoosh();
          s.step(async () => { s.say("Licht trifft aufs Auge. Der Sehnerv leitet das Signal zum Gehirn."); await run(); });
          s.step(async () => { s.sfx.pop(); await s.show(brow, "up"); s.say("Probiere die anderen Sinne aus!"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          if (s.fast) wahr.textContent = SENSES[0].wahr;
        },
      },
      /* 3 ------------------------------------------------------------ */
      {
        title: "Auge und Ohr",
        say: "Die Pupille regelt, wie viel Licht ins Auge fällt. Und unsere Ohren hören nur bestimmte Töne – Hunde hören viel höhere.",
        build(s) {
          // eye
          const esv = s.svg(470, 230);
          const bg = s.el("rect", { x: 0, y: 0, width: 470, height: 230, rx: 16, fill: "#2a3550" });
          const pupil = s.el("circle", { cx: 235, cy: 115, r: 30, fill: "#111" });
          esv.append(bg, s.el("path", { d: "M85 115 Q235 10 385 115 Q235 220 85 115 Z", fill: "#fff", stroke: P.ink, "stroke-width": 4 }), s.el("circle", { cx: 235, cy: 115, r: 52, fill: "#4f8fe0" }), pupil, s.el("circle", { cx: 252, cy: 96, r: 8, fill: "#fff", opacity: .9 }));
          const lP = T(s, 60, 40, "Pupille", { "font-size": 20, fill: "#fff", "text-anchor": "start" });
          esv.append(s.el("line", { x1: 120, y1: 46, x2: 222, y2: 108, stroke: "#fff", "stroke-width": 2 }), lP);
          const lI = T(s, 450, 210, "Iris", { "font-size": 20, fill: "#fff", "text-anchor": "end" });
          esv.append(s.el("line", { x1: 412, y1: 196, x2: 274, y2: 140, stroke: "#fff", "stroke-width": 2 }), lI);
          let light = 0;
          const setLight = v => { light = v; const c0 = [42, 53, 80], c1 = [255, 246, 200]; bg.setAttribute("fill", `rgb(${c0.map((c, i) => Math.round(c + (c1[i] - c) * v)).join(",")})`); pupil.setAttribute("r", 34 - 24 * v); [lP, lI].forEach(t => t.setAttribute("fill", v > 0.5 ? P.ink : "#fff")); esv.querySelectorAll("line").forEach(l => l.setAttribute("stroke", v > 0.5 ? P.ink : "#fff")); };
          setLight(0);
          const esl = s.slider({ label: "Licht", min: 0, max: 10, value: 0, fmt: v => (v < 4 ? "dunkel" : v > 6 ? "hell" : "mittel"), onInput: v => setLight(v / 10) });
          const eyeCard = s.h("div", { class: "card stack", style: { gap: "8px" } }, s.h("span", { class: "exlabel", style: { marginBottom: 0 } }, "Auge"), esv, esl,
            p(s, "Hell → Pupille ", null, b(s, "eng"), ". Dunkel → Pupille ", b(s, "weit"), "."));
          // ear: hearing range bar (log scale 10 Hz … 100 000 Hz)
          const W = 470, x0 = 20, x1 = 450;
          const lx = f => x0 + (Math.log10(f) - 1) / 4 * (x1 - x0);
          const hsv = s.svg(W, 230);
          hsv.append(s.el("line", { x1: x0, y1: 190, x2: x1, y2: 190, stroke: P.ink, "stroke-width": 3 }));
          [[10, "10"], [100, "100"], [1000, "1.000"], [10000, "10.000"], [100000, "100.000"]].forEach(([f, t], i) => { hsv.append(s.el("line", { x1: lx(f), y1: 184, x2: lx(f), y2: 196, stroke: P.ink, "stroke-width": 3 })); hsv.append(T(s, Math.min(Math.max(lx(f), 22), 428), 220, t, { "font-size": 19, "font-weight": 600, fill: P.pencil })); });
          const bar = (f0, f1, y, col, label) => { const g = later(s.el("g")); const w = lx(f1) - lx(f0); const r = s.el("rect", { x: lx(f0), y, width: w, height: 40, rx: 10, fill: col, opacity: .9 }); g.append(r, T(s, lx(f0) + w / 2, y + 27, label, { fill: "#fff", "font-size": 20 })); hsv.append(g); return g; };
          const human = bar(20, 20000, 30, P.unit, "Mensch: 20 – 20.000 Hz");
          const dog = bar(67, 45000, 100, P.orange, "Hund: bis etwa 45.000 Hz");
          const mark = later(s.el("path", { d: "M0 160 L-9 176 L9 176 Z", fill: P.red })); hsv.append(mark);
          let lastF = 0;
          const fsl = later(s.slider({ label: "Ton spielen (Tonhöhe)", min: 0, max: 30, value: 10, fmt: v => s.fmt(Math.round(100 * Math.pow(10, v / 15) / 10) * 10) + " Hz", onInput: v => { const f = 100 * Math.pow(10, v / 15); mark.setAttribute("transform", `translate(${lx(f)} 0)`); const now = performance.now(); if (now - lastF > 120) { lastF = now; s.sfx.tone(f, 0.25, "sine", 0.1); } } }));
          mark.setAttribute("transform", `translate(${lx(1000)} 0)`);
          const earNote = later(p(s, "Hertz (Hz) zählt Schwingungen pro Sekunde. ", null, b(s, "Hundepfeifen"), " sind so hoch, dass nur Hunde sie hören."));
          const earCard = s.h("div", { class: "card stack", style: { gap: "8px" } }, s.h("span", { class: "exlabel", style: { marginBottom: 0 } }, "Ohr: Hörbereich"), hsv, fsl, earNote);
          s.add(root(s, "cols", { alignItems: "center", gap: "22px" }, eyeCard, earCard));
          s.sfx.whoosh();
          s.step(async () => { s.sfx.whoosh(); await s.tween({ from: 0, to: 1, dur: 1400, update: setLight }); s.sfx.pop(); await s.tween({ from: 1, to: 0.2, dur: 1400, update: setLight }); esl.input.value = 2; esl.querySelector(".mono").textContent = "dunkel"; s.say("Im Hellen wird die Pupille eng, im Dunkeln weit."); });
          s.step(async () => { s.sfx.pop(); await s.show(human, "fade"); s.sfx.pop(); await s.show(dog, "fade"); s.say("Wir hören bis etwa zwanzigtausend Hertz. Hunde hören viel höhere Töne."); });
          s.step(async () => { s.show(mark, "pop"); await s.show(fsl, "up"); s.sfx.tone(1000, 0.3, "sine", 0.1); await s.show(earNote, "up"); });
        },
      },
      /* 3b ----------------------------------------------------------- */
      {
        title: "Augen und Ohren der Tiere",
        say: "Tiere haben ganz besondere Sinnesorgane. Jedes passt zu ihrem Leben.",
        build(s) {
          const card = (fig, txt) => later(s.h("div", { class: "stack", style: { gap: "6px", alignItems: "center" } }, fig, s.h("p", { class: "small", style: { textAlign: "center" } }, txt)));
          const cards = [
            card(s.photo("katzenauge", { w: 340, h: 190, pos: "45% 50%", caption: "Katze: Schlitzpupille" }), "ganz schmal im Hellen, ganz weit im Dunkeln"),
            card(s.photo("ziegenauge", { w: 340, h: 190, pos: "50% 50%", caption: "Ziege: waagerechte Pupille" }), "Rundumblick – Feinde früh sehen"),
            card(s.photo("eule", { w: 340, h: 190, pos: "50% 40%", caption: "Eule: riesige Augen" }), "Augen bewegen geht nicht – sie dreht den Kopf"),
            card(s.photo("fennek", { w: 340, h: 190, pos: "50% 35%", caption: "Fennek: riesige Ohren" }), "hört Beute unter dem Sand, gibt Wärme ab"),
            card(s.photo("fledermaus", { w: 340, h: 190, pos: "50% 45%", caption: "Fledermaus: Echo-Ohren" }), "ruft im Ultraschall und hört das Echo"),
            card(s.photo("hundenase", { w: 340, h: 190, pos: "60% 30%", caption: "Hund: Super-Nase" }), "etwa 220 Millionen Riechzellen"),
          ];
          const btns = later(s.h("div", { class: "row", style: { justifyContent: "center", gap: "16px" } }, s.soundBtn("eule-ruft", "Eule ruft"), s.soundBtn("schnueffeln", "Hund schnüffelt", { vol: .8 })));
          s.add(root(s, "stack", { justifyContent: "center", gap: "14px" }, s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 340px)", gap: "12px 24px", justifyContent: "center" } }, ...cards), btns));
          s.step(async () => { s.sfx.swoosh(); for (const i of [0, 1, 2]) { s.show(cards[i], "up"); await s.wait(220); } s.say("Augen: Die Katze hat Schlitze, die Ziege waagerechte Pupillen. Die Eule kann ihre Augen nicht bewegen und dreht dafür den Kopf."); });
          s.step(async () => { s.sfx.swoosh(); for (const i of [3, 4, 5]) { s.show(cards[i], "up"); await s.wait(220); } s.say("Der Fennek hört Beute unter dem Sand. Die Fledermaus findet ihren Weg mit Echos. Und der Hund riecht viel besser als wir."); });
          s.step(async () => { s.sound("eule-ruft", { vol: .7 }); await s.show(btns, "up"); });
        },
      },
      /* 4 ------------------------------------------------------------ */
      {
        title: "Nase, Zunge und Haut",
        say: "Hunde haben viel mehr Riechzellen als wir. Die Zunge schmeckt fünf Geschmacksrichtungen. Und die Haut ist unser größtes Organ.",
        build(s) {
          // nose: dots, 1 dot = 5 million cells
          const nsv = s.svg(310, 250);
          nsv.append(T(s, 70, 26, "Mensch", { fill: P.blue }), T(s, 210, 26, "Hund", { fill: P.orange }));
          const human = later(s.el("circle", { cx: 70, cy: 62, r: 10, fill: P.blue })); nsv.append(human);
          const dogDots = [];
          for (let i = 0; i < 44; i++) { const c = later(s.el("circle", { cx: 150 + (i % 6) * 24, cy: 50 + Math.floor(i / 6) * 24, r: 10, fill: P.orange })); dogDots.push(c); nsv.append(c); }
          const nH = T(s, 70, 110, "5 Mio.", { fill: P.blue, "font-size": 21 }), nD = T(s, 210, 244, "220 Mio.", { fill: P.orange, "font-size": 21 });
          later(nH); later(nD); nsv.append(nH, nD);
          const nose = s.h("div", { class: "card stack", style: { gap: "6px" } }, s.h("span", { class: "exlabel", style: { marginBottom: 0 } }, "Nase: Riechzellen"), nsv,
            s.h("p", { class: "small" }, "1 Punkt = 5 Millionen Riechzellen. Darum finden Spürhunde so viel!"));
          // tongue
          const tastes = [["süß", "Honig", "#e0a100"], ["sauer", "Zitrone", "#7bb321"], ["salzig", "Brezel", "#5d6678"], ["bitter", "Grapefruit", "#b5523b"], ["umami", "Tomate, Parmesan", "#7b4fd6"]];
          const chips = tastes.map(([t, e, c]) => later(s.h("div", { style: { display: "flex", alignItems: "baseline", gap: "10px", background: "#fff", border: "2px solid " + c, borderRadius: "12px", padding: "6px 12px" } },
            s.h("b", { style: { font: "700 23px/1.1 var(--f-display)", color: c } }, t), s.h("span", { class: "small" }, e))));
          const myth = later(s.h("p", { class: "small", style: { background: "#fff1f1", borderRadius: "10px", padding: "6px 10px" } }, b(s, "Zungenkarte? Stimmt nicht!"), " Jeder Geschmack wird überall auf der Zunge geschmeckt."));
          const tongue = s.h("div", { class: "card stack", style: { gap: "8px" } }, s.h("span", { class: "exlabel", style: { marginBottom: 0 } }, "Zunge: 5 Geschmäcker"), ...chips, myth);
          // skin
          const ssv = s.svg(310, 150);
          const sq = later(s.el("rect", { x: 80, y: 10, width: 150, height: 120, rx: 6, fill: "#f6d2b0", stroke: P.skinD, "stroke-width": 4 }));
          ssv.append(sq, T(s, 155, 78, "1,5 – 2 m²", { "font-size": 26, fill: "#8a4f22" }));
          const feel = ["Druck", "Berührung", "Wärme", "Kälte", "Schmerz"].map(t => later(s.h("span", { class: "chip", style: { background: "#e6f6ee", fontSize: "20px" } }, t)));
          const skin = s.h("div", { class: "card stack", style: { gap: "8px" } }, s.h("span", { class: "exlabel", style: { marginBottom: 0 } }, "Haut: größtes Organ"), ssv,
            s.h("p", { class: "small" }, "So viel Fläche hat die Haut eines Erwachsenen. Sie fühlt:"), s.h("div", { class: "row", style: { gap: "8px" } }, ...feel));
          s.add(root(s, "cols3", { alignItems: "center", gap: "18px" }, nose, tongue, skin));
          s.sfx.whoosh();
          s.step(async () => { s.sound("schnueffeln", { vol: .7, dur: 3 }); s.show([human, nH], "pop"); await s.wait(300); for (let i = 0; i < 44; i++) { s.show(dogDots[i], "pop"); if (i % 4 === 0) s.sfx.count(i / 4); await s.wait(30); } s.show(nD, "pop"); s.sfx.ding(); s.say("Mensch: etwa 5 Millionen Riechzellen. Hund: etwa 220 Millionen."); });
          s.step(async () => { for (let i = 0; i < 5; i++) { s.sfx.note([0, 2, 4, 7, 9][i], 0.2); s.show(chips[i], "left"); await s.wait(180); } s.sfx.boing(); await s.show(myth, "up"); s.say("Süß, sauer, salzig, bitter und umami."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(sq, "zoom"); for (let i = 0; i < 5; i++) { s.sfx.pop(); s.show(feel[i], "pop"); await s.wait(150); } s.say("Die Haut fühlt Druck, Berührung, Wärme, Kälte und Schmerz."); });
        },
      },
      /* 5 ------------------------------------------------------------ */
      {
        title: "Wie laut ist das?",
        say: "Lautstärke misst man in Dezibel. Ab etwa 130 Dezibel tut Lärm weh.",
        build(s) {
          const svg = s.svg(560, 600);
          const Y = db => 570 - db * 3.8;
          const defs = s.el("defs", null, s.el("linearGradient", { id: "u2db", x1: 0, y1: 1, x2: 0, y2: 0 }, s.el("stop", { offset: 0, "stop-color": "#46b37a" }), s.el("stop", { offset: .55, "stop-color": "#f2c14e" }), s.el("stop", { offset: 1, "stop-color": "#dc3b2a" })));
          svg.append(defs, s.el("rect", { x: 80, y: Y(140), width: 36, height: Y(0) - Y(140), rx: 10, fill: "url(#u2db)" }));
          for (let d = 0; d <= 140; d += 10) { svg.append(s.el("line", { x1: 70, y1: Y(d), x2: 80, y2: Y(d), stroke: P.ink, "stroke-width": 2 })); if (d % 20 === 0) svg.append(T(s, 40, Y(d) + 7, String(d), { "font-size": 19, "font-weight": 600, fill: P.pencil })); }
          svg.append(T(s, 98, Y(140) - 10, "dB", { "font-size": 20, fill: P.unit }));
          const items = [[10, "gerade noch hörbar"], [20, "Blätterrauschen, Ticken einer Uhr"], [40, "leises Gespräch"], [60, "normales Gespräch"], [90, "Straßenverkehr"], [110, "Rockkonzert"], [130, "Düsentriebwerk – Schmerzgrenze"]];
          const its = items.map(([d, t]) => { const g = later(s.el("g")); g.append(s.el("line", { x1: 118, y1: Y(d), x2: 150, y2: Y(d), stroke: P.pencil, "stroke-width": 2 }), s.el("circle", { cx: 98, cy: Y(d), r: 5, fill: "#fff" }), s.el("text", { x: 158, y: Y(d) + 7, "font-size": 20, "font-weight": 700, fill: d >= 110 ? P.red : P.ink, text: `${d} dB: ${t}` })); svg.append(g); return g; });
          const marker = s.el("path", { d: "M0 0 L-22 -12 L-22 12 Z", fill: P.unit });
          svg.append(marker);
          const out = s.h("p", { class: "big", style: { color: P.unit } }, "60 dB");
          const outT = s.h("p", { class: "t" }, "normales Gespräch");
          let lastT = 0;
          const setDb = (d, sound) => { marker.setAttribute("transform", `translate(78 ${Y(d)})`); out.textContent = d + " dB"; const near = items.reduce((a, c) => (Math.abs(c[0] - d) < Math.abs(a[0] - d) ? c : a)); outT.textContent = Math.abs(near[0] - d) <= 10 ? "etwa: " + near[1] : "";
            if (sound) { const now = performance.now(); if (now - lastT > 150) { lastT = now; s.sfx.noise(0.25, 0.01 + 0.2 * Math.pow(d / 130, 2), 400, 2400, 0, 0.8); } } };
          setDb(60);
          const sl = s.slider({ label: "Lautstärke", min: 0, max: 130, step: 10, value: 60, fmt: v => v + " dB", onInput: v => setDb(v, true) });
          const card = s.h("div", { class: "card", style: { display: "flex", gap: "16px", alignItems: "baseline", padding: "8px 16px" } }, out, outT);
          const note = s.h("p", { class: "small pencil" }, "Alle Töne hier bleiben leise – die Skala zeigt die echte Lautstärke.");
          const sbs = s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" } },
            s.soundBtn("clock-tick", "Uhr: 20 dB", { vol: .8 }), s.soundBtn("gespraech", "Gespräch: 60 dB", { vol: .6 }),
            s.soundBtn("traffic", "Verkehr: 90 dB", { vol: .5, dur: 5 }), s.soundBtn("duesenjet", "Düsenjet: 130 dB", { vol: .5 }));
          const merk = later(s.h("div", { class: "merk", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Lärm ab ", b(s, "85 dB"), " schadet den Ohren, wenn er lange dauert. Dann: Gehörschutz!"));
          const lf = later(life(s, { style: { padding: "12px 18px" } }, p(s, "Konzert, Feuerwerk: ", { fontSize: "21px" }, b(s, "Ohrstöpsel"), " schützen dein Gehör.")));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "560px 1fr", gap: "26px", alignItems: "center" }, svg, s.h("div", { class: "stack", style: { gap: "12px" } }, card, sl, sbs, note, merk, lf)));
          s.sfx.whoosh();
          s.step(async () => { for (let i = 0; i < items.length; i++) { s.sfx.count(i); s.show(its[i], "left"); await s.wait(170); } s.say("Flüstern ist leise, ein Düsentriebwerk extrem laut."); });
          s.step(async () => { await s.tween({ from: 0, to: 130, dur: 1800, update: v => setDb(Math.round(v / 10) * 10, true) }); await s.tween({ from: 130, to: 60, dur: 700, update: v => setDb(Math.round(v / 10) * 10) }); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 6 ------------------------------------------------------------ */
      {
        title: "Augen lassen sich täuschen",
        say: "Welche Linie ist länger? Zieh den Punkt, bis beide gleich lang aussehen. Dann messen wir nach.",
        build(s) {
          const svg = s.svg(640, 440);
          const X0 = 170, LA = 300, YA = 120, YB = 300;
          const fin = (x, y, dir) => s.el("path", { d: `M${x + dir * 44} ${y - 34} L${x} ${y} L${x + dir * 44} ${y + 34}`, fill: "none", stroke: P.ink, "stroke-width": 6, "stroke-linecap": "round", "stroke-linejoin": "round" });
          svg.append(s.el("line", { x1: X0, y1: YA, x2: X0 + LA, y2: YA, stroke: P.blue, "stroke-width": 7, "stroke-linecap": "round" }), fin(X0, YA, -1), fin(X0 + LA, YA, 1));
          const lineB = s.el("line", { x1: X0, y1: YB, x2: X0 + LA, y2: YB, stroke: P.red, "stroke-width": 7, "stroke-linecap": "round" });
          const fL = fin(X0, YB, 1), fR = s.el("path", { fill: "none", stroke: P.ink, "stroke-width": 6, "stroke-linecap": "round", "stroke-linejoin": "round" });
          const handle = s.el("circle", { cx: X0 + LA, cy: YB, r: 22, fill: P.unit, opacity: .85, style: { cursor: "grab" } });
          svg.append(lineB, fL, fR, handle);
          svg.append(T(s, 70, YA + 8, "A", { "font-size": 30, fill: P.blue }), T(s, 70, YB + 8, "B", { "font-size": 30, fill: P.red }));
          const guides = later(s.el("g")); svg.append(guides);
          const ruler = later(s.el("g")); svg.append(ruler);
          let LB = LA;
          const setB = l => { LB = Math.max(160, Math.min(440, l)); const x = X0 + LB; lineB.setAttribute("x2", x); fR.setAttribute("d", `M${x - 44} ${YB - 34} L${x} ${YB} L${x - 44} ${YB + 34}`); handle.setAttribute("cx", x); };
          setB(LA);
          let lt = 0;
          s.drag(handle, { space: svg, onMove: q => { setB(q.x - X0); const n = Math.round(LB / 10); if (n !== lt) { lt = n; s.sfx.tick(); } } });
          const drawGuides = () => {
            guides.innerHTML = "";
            [X0, X0 + LA].forEach(x => guides.append(s.el("line", { x1: x, y1: 60, x2: x, y2: 360, stroke: P.green, "stroke-width": 3, "stroke-dasharray": "10 8" })));
            ruler.innerHTML = "";
            ruler.append(s.el("rect", { x: X0, y: 380, width: LA, height: 40, rx: 4, fill: "#fff3c4", stroke: "#b8962e", "stroke-width": 2 }));
            for (let i = 0; i <= 10; i++) { const x = X0 + i * 30; ruler.append(s.el("line", { x1: x, y1: 380, x2: x, y2: i % 5 === 0 ? 400 : 392, stroke: P.ink, "stroke-width": 2 })); }
            ruler.append(T(s, X0 + 15, 414, "0", { "font-size": 19 }), T(s, X0 + LA - 18, 414, "10", { "font-size": 19 }));
          };
          drawGuides();
          const hint = later(s.h("div", { class: "card", style: { padding: "12px 18px" } }, p(s, "Sieht ", null, s.h("b", { class: "red" }, "B"), " kürzer aus als ", s.h("b", { class: "blue" }, "A"), "? Zieh den lila Punkt, bis beide ", b(s, "gleich lang aussehen"), ".")));
          const res = s.h("p", { class: "h2", style: { color: P.green } }, "");
          const btn = later(s.h("button", { class: "btn solid", onclick: () => reveal() }, "📏 Nachmessen"));
          const resCard = later(s.h("div", { class: "card stack", style: { gap: "6px", borderColor: P.green } }, res, s.h("p", { class: "small" }, "Die Pfeilspitzen täuschen unser Gehirn.")));
          const reveal = async () => {
            s.sfx.whoosh(); await s.tween({ from: LB, to: LA, dur: 800, update: setB });
            s.show(guides, "fade"); s.sfx.snap(); await s.show(ruler, "left");
            res.textContent = "A und B sind beide 10 cm lang!"; s.sfx.success(); s.show(resCard, "pop");
          };
          const merk = later(s.h("div", { class: "merk", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Diese ", b(s, "Müller-Lyer-Täuschung"), " beschrieb Franz Carl Müller-Lyer 1889. Darum gilt: ", b(s, "messen statt schätzen!")));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "640px 1fr", gap: "24px", alignItems: "center" }, svg, s.h("div", { class: "stack", style: { gap: "14px" } }, hint, btn, resCard, merk)));
          s.sfx.whoosh();
          s.step(async () => { s.sfx.pop(); await s.show(hint, "left"); s.show(btn, "pop"); s.say("Zieh den lila Punkt."); if (!s.fast) await s.tween({ from: LA, to: LA - 50, dur: 900, ease: "out", update: setB }); });
          s.step(async () => { await reveal(); s.say("Beide sind gleich lang!"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 7 ------------------------------------------------------------ */
      {
        title: "Kreise im Kreis",
        say: "Welcher orange Kreis ist größer? Verändere den rechten Kreis. Dann blenden wir die Ringe aus.",
        build(s) {
          const svg = s.svg(1100, 360);
          const LC = [300, 180], RC = [800, 180], R0 = 38;
          const bigs = [], smalls = [];
          for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; const c = s.el("circle", { cx: LC[0] + Math.cos(a) * 118, cy: LC[1] + Math.sin(a) * 118, r: 52, fill: "#9aa7b5" }); bigs.push(c); svg.append(c); }
          for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; const c = s.el("circle", { cx: RC[0] + Math.cos(a) * 66, cy: RC[1] + Math.sin(a) * 66, r: 14, fill: "#9aa7b5" }); smalls.push(c); svg.append(c); }
          const cl = s.el("circle", { cx: LC[0], cy: LC[1], r: R0, fill: P.orange }), cr = s.el("circle", { cx: RC[0], cy: RC[1], r: R0, fill: P.orange });
          svg.append(cl, cr);
          let rR = R0, rings = 1;
          const setR = r => { rR = r; cr.setAttribute("r", r); };
          const setRings = v => { rings = v; [...bigs, ...smalls].forEach(c => c.setAttribute("opacity", v)); cl.setAttribute("cx", LC[0] + (500 - LC[0]) * (1 - v)); cr.setAttribute("cx", RC[0] + (600 - RC[0]) * (1 - v)); };
          const sl = later(s.slider({ label: "Größe des rechten Kreises", min: 24, max: 52, step: 1, value: R0, fmt: v => (v === R0 ? "wie links" : v < R0 ? "kleiner" : "größer"), onInput: v => setR(v) }));
          const btn = later(s.h("button", { class: "btn solid", onclick: () => toggle() }, "Ringe aus / an"));
          const res = later(s.h("p", { class: "h2", style: { color: P.green, textAlign: "center" } }, "Ohne Ringe sieht man es: Beide sind gleich groß!"));
          const toggle = async () => { s.sfx.whoosh(); if (rR !== R0) await s.tween({ from: rR, to: R0, dur: 500, update: setR }); sl.input.value = R0; sl.querySelector(".mono").textContent = "wie links"; await s.tween({ from: rings, to: rings > 0.5 ? 0 : 1, dur: 900, update: setRings }); if (rings < 0.5) { s.sfx.success(); s.show(res, "pop"); } };
          const merk = later(s.h("div", { class: "merk", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Die ", b(s, "Ebbinghaus-Täuschung"), ": Unser Gehirn vergleicht mit der Umgebung. Zwischen großen Kreisen wirkt ein Kreis kleiner."));
          s.add(root(s, "stack", { gap: "12px", justifyContent: "center" }, svg, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 260px", gap: "24px", alignItems: "end" } }, sl, btn), res, merk));
          s.sfx.whoosh();
          s.step(async () => { s.sfx.pop(); s.show(sl, "up"); s.show(btn, "pop"); s.say("Welcher Kreis sieht größer aus? Probier den Regler."); });
          s.step(async () => { await toggle(); s.say("Ohne Ringe sieht man: Beide sind gleich groß."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 8 ------------------------------------------------------------ */
      {
        title: "Die Hände schummeln",
        say: "Eine Hand ins warme Wasser, eine ins kalte. Dann beide ins lauwarme. Die Hände fühlen ganz verschiedene Dinge!",
        build(s) {
          const svg = s.svg(1100, 400);
          const bx = [220, 550, 880], col = ["#f28b6b", "#c9a6f2", "#7fb7e6"], names = ["warm", "lauwarm", "kalt"];
          bx.forEach((x, i) => {
            svg.append(s.el("path", { d: `M${x - 120} 250 L${x - 100} 340 L${x + 100} 340 L${x + 120} 250 Z`, fill: "#eef2f6", stroke: "#8a99aa", "stroke-width": 4 }));
            svg.append(s.el("path", { d: `M${x - 112} 264 L${x - 98} 330 L${x + 98} 330 L${x + 112} 264 Z`, fill: col[i], opacity: .7 }));
            svg.append(T(s, x, 382, names[i], { "font-size": 24, fill: [P.red, P.unit, P.blue][i] }));
          });
          const steam = [0, 1, 2].map(k => s.el("path", { d: `M${180 + k * 40} 240 C${170 + k * 40} 220 ${195 + k * 40} 210 ${185 + k * 40} 190`, fill: "none", stroke: "#e07a5f", "stroke-width": 4, "stroke-linecap": "round", opacity: .7 }));
          svg.append(...steam);
          [[840, 278], [900, 286]].forEach(([x, y]) => svg.append(s.el("rect", { x, y, width: 28, height: 26, rx: 5, fill: "#e8f6ff", stroke: "#7fb7e6", "stroke-width": 3 })));
          s.loop(t => steam.forEach((p2, k) => p2.setAttribute("transform", `translate(0 ${-((t * 18 + k * 9) % 20)})`)));
          const hL = s.el("g"), hR = s.el("g"); hL.append(hand(s)); hR.append(hand(s));
          svg.append(hL, hR);
          const pos = { L: [430, 90], R: [670, 90] };
          const place = () => { hL.setAttribute("transform", `translate(${pos.L[0]} ${pos.L[1]})`); hR.setAttribute("transform", `translate(${pos.R[0]} ${pos.R[1]})`); };
          place();
          const move = (k, x, y, dur = 900) => { const [x0, y0] = pos[k]; return s.tween({ from: 0, to: 1, dur, update: v => { pos[k] = [x0 + (x - x0) * v, y0 + (y - y0) * v]; place(); } }); };
          const bubble = (x, text, c) => { const g = later(fb(s.el("g"))); g.append(s.el("rect", { x: x - 80, y: 8, width: 160, height: 54, rx: 18, fill: "#fff", stroke: c, "stroke-width": 4 }), T(s, x, 45, text, { "font-size": 28, fill: c })); svg.append(g); return g; };
          const bubL = bubble(330, "Kalt!", P.blue), bubR = bubble(770, "Warm!", P.red);
          const therm = later(s.el("g")); therm.append(s.el("rect", { x: 541, y: 120, width: 18, height: 190, rx: 9, fill: "#fff", stroke: P.ink, "stroke-width": 3 }), s.el("circle", { cx: 550, cy: 312, r: 14, fill: P.red }), s.el("rect", { x: 546, y: 220, width: 8, height: 92, fill: P.red }));
          svg.append(therm);
          const txt = s.h("p", { class: "t", style: { textAlign: "center", minHeight: "34px" } }, "Drei Schüsseln: warm, lauwarm und kalt.");
          const merk = later(s.h("div", { class: "merk", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Die Haut ", b(s, "vergleicht"), " nur mit vorher. Ein ", b(s, "Thermometer"), " misst die echte Temperatur. Darum messen Forscher! ", s.h("span", { class: "small" }, "(Nur warmes, nie heißes Wasser nehmen.)")));
          s.add(root(s, "stack", { gap: "10px", justifyContent: "center" }, svg, txt, merk));
          s.sfx.whoosh();
          s.step(async () => { txt.textContent = "Links in warmes, rechts in kaltes Wasser. Eine Minute warten …"; s.sound("splash", { vol: .5 }); await Promise.all([move("L", 220, 250), move("R", 880, 250)]); for (let i = 0; i < 4; i++) { s.sfx.tick(); await s.wait(300); } });
          s.step(async () => { txt.textContent = "Jetzt beide Hände ins lauwarme Wasser!"; s.sfx.swoosh(); await Promise.all([move("L", 200, 90, 500), move("R", 900, 90, 500)]); s.sound("splash", { vol: .4 }); await Promise.all([move("L", 505, 250), move("R", 595, 250)]); s.sfx.boing(); s.show(bubL, "pop"); await s.wait(250); s.sfx.boing(); await s.show(bubR, "pop"); s.say("Die linke Hand meldet kalt, die rechte warm. Dabei ist es dasselbe Wasser!"); });
          s.step(async () => { txt.textContent = "Dasselbe Wasser – aber zwei verschiedene Gefühle."; s.sfx.zap(); await s.show(therm, "down"); s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 9 ------------------------------------------------------------ */
      {
        title: "Messen: Zahl und Einheit",
        say: "Jede Messung hat eine Messgröße, einen Zahlenwert und eine Einheit. Ohne Einheit weiß niemand, was gemeint ist.",
        build(s) {
          const part = (txt, lab, col) => { const lb = later(s.h("span", { style: { font: "700 20px/1.1 var(--f-display)", color: col, borderTop: "4px solid " + col, paddingTop: "6px", marginTop: "4px", textAlign: "center", whiteSpace: "nowrap" } }, lab)); const el = s.h("div", { style: { display: "flex", flexDirection: "column", alignItems: "center" } }, s.h("span", { class: "huge", style: { color: col, fontSize: "64px" } }, txt), lb); el.lb = lb; return el; };
          const parts = [part("Länge", "Messgröße", P.blue), s.h("span", { class: "huge", style: { fontSize: "64px", alignSelf: "flex-start" } }, "="), part("1,42", "Zahlenwert", P.green), part("m", "Einheit", P.red)];
          const formula = s.h("div", { class: "a-zoom", style: { display: "flex", gap: "22px", justifyContent: "center", alignItems: "flex-start" } }, ...parts);
          const rows = [
            ["Länge", "Meter (m)", "Lineal, Maßband", "Fernsehturm: 368 m"],
            ["Masse", "Kilogramm (kg)", "Waage", "1 l Wasser: etwa 1 kg"],
            ["Zeit", "Sekunde (s)", "Stoppuhr", "100-m-Weltrekord: 9,58 s"],
            ["Temperatur", "Grad Celsius (°C)", "Thermometer", "Wasser kocht: 100 °C"],
            ["Volumen", "Liter (l), Milliliter (ml)", "Messzylinder", "1 Teelöffel: etwa 5 ml"],
          ];
          const th = t => s.h("th", { style: { textAlign: "left", font: "700 19px/1 var(--f-display)", color: P.pencil, padding: "6px 10px", borderBottom: "3px solid var(--ink)" } }, t);
          const trs = rows.map(r => later(s.h("tr", null, ...r.map((c, i) => s.h("td", { style: { padding: "7px 10px", fontSize: "21px", fontWeight: i === 0 ? 700 : 400, color: i === 0 ? P.unit : P.ink, borderBottom: "2px solid var(--line)" } }, c)))));
          const table = s.h("table", { style: { borderCollapse: "collapse", width: "100%", background: "#fff", borderRadius: "14px" } }, s.h("thead", null, s.h("tr", null, th("Messgröße"), th("Einheit"), th("Messgerät"), th("Beispiel"))), s.h("tbody", null, ...trs));
          const merk = later(s.h("div", { class: "merk", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "„Der Turm ist 368 hoch.“ – 368 was? Zentimeter? Meter? ", b(s, "Ohne Einheit ist eine Messung nichts wert.")));
          s.add(root(s, "stack", { gap: "16px", justifyContent: "center" }, formula, table, merk));
          s.sfx.whoosh();
          s.step(async () => { const lbs = [parts[0].lb, parts[2].lb, parts[3].lb]; for (let i = 0; i < 3; i++) { s.sfx.count(i * 2); s.show(lbs[i], "up"); await s.wait(300); } s.say("Länge gleich eins Komma vier zwei Meter."); });
          s.step(async () => { for (let i = 0; i < 5; i++) { s.sfx.pop(); s.show(trs[i], "left"); await s.wait(200); } s.say("Länge, Masse, Zeit, Temperatur und Volumen."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 10 ----------------------------------------------------------- */
      {
        title: "Das Thermometer",
        say: "Wird es wärmer, dehnt sich die Flüssigkeit im Thermometer aus und steigt im dünnen Röhrchen nach oben.",
        build(s) {
          const svg = s.svg(330, 600);
          const Y = t => 500 - (t + 20) * (430 / 130);
          svg.append(s.el("rect", { x: 140, y: 40, width: 44, height: 480, rx: 22, fill: "#fff", stroke: P.ink, "stroke-width": 4 }), s.el("circle", { cx: 162, cy: 548, r: 40, fill: P.red, stroke: P.ink, "stroke-width": 4 }));
          const col = s.el("rect", { x: 153, y: Y(20), width: 18, height: 548 - Y(20), fill: P.red });
          svg.append(col, s.el("rect", { x: 153, y: 520, width: 18, height: 30, fill: P.red }));
          for (let t = -20; t <= 110; t += 5) { const y = Y(t); svg.append(s.el("line", { x1: 184, y1: y, x2: t % 10 === 0 ? 204 : 196, y2: y, stroke: P.ink, "stroke-width": 2 })); if (t % 20 === 0) svg.append(s.el("text", { x: 212, y: y + 7, "font-size": 19, "font-weight": 600, fill: P.ink, text: String(t) })); }
          svg.append(T(s, 290, 30, "°C", { "font-size": 22, fill: P.unit }));
          const fp0 = later(s.el("g", null, s.el("line", { x1: 60, y1: Y(0), x2: 140, y2: Y(0), stroke: P.blue, "stroke-width": 4 }), s.el("text", { x: 40, y: Y(0) + 12, "text-anchor": "middle", "font-size": 34, text: "🧊" })));
          const fp100 = later(s.el("g", null, s.el("line", { x1: 60, y1: Y(100), x2: 140, y2: Y(100), stroke: P.red, "stroke-width": 4 }), s.el("text", { x: 40, y: Y(100) + 12, "text-anchor": "middle", "font-size": 34, text: "♨️" })));
          svg.append(fp0, fp100);
          let T0 = 20;
          const read = s.h("p", { class: "huge", style: { color: P.red, fontSize: "64px" } }, "20 °C");
          const setT = t => { T0 = t; col.setAttribute("y", Y(t)); col.setAttribute("height", 548 - Y(t)); read.textContent = s.fmt(Math.round(t)) + " °C"; };
          setT(20);
          let lastT = 20;
          const sl = s.slider({ label: "Temperatur", min: -20, max: 110, step: 1, value: 20, fmt: v => v + " °C", onInput: v => { s.tween({ from: T0, to: v, dur: 250, update: setT }); if (Math.abs(v - lastT) >= 5) { lastT = v; s.sfx.count(Math.max(0, Math.round((v + 20) / 10))); } } });
          const how = s.h("div", { class: "card", style: { padding: "12px 18px" } }, p(s, "Die Flüssigkeit (meist gefärbter Alkohol) ", null, b(s, "dehnt sich beim Erwärmen aus"), " und steigt im Röhrchen."));
          const fix = later(s.h("div", { class: "card stack", style: { gap: "6px", padding: "12px 18px" } }, s.h("span", { class: "exlabel", style: { marginBottom: 0 } }, "Die zwei Fixpunkte"),
            p(s, "🧊 ", null, s.h("b", { class: "blue" }, "0 °C"), ": Eis schmilzt, Wasser gefriert."), p(s, "♨️ ", null, s.h("b", { class: "red" }, "100 °C"), ": Wasser siedet (bei normalem Luftdruck)."), s.h("p", { class: "small pencil" }, "Dazwischen: 100 gleiche Schritte = 100 Grad.")));
          const fun = later(s.h("div", { class: "life" }, s.h("span", { class: "exlabel" }, "Wusstest du?"), p(s, "Anders Celsius schlug 1742 seine Skala vor – zuerst ", null, b(s, "andersherum"), ": 0 war kochendes Wasser, 100 war Eis!")));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "330px 1fr", gap: "28px", alignItems: "center" }, svg, s.h("div", { class: "stack", style: { gap: "12px" } }, s.h("div", { class: "row", style: { flexWrap: "nowrap", justifyContent: "space-between" } }, read), sl, how, fix, fun)));
          s.sfx.whoosh();
          s.step(async () => { s.say("Wir erwärmen. Die Säule steigt."); s.sfx.whoosh(); await s.tween({ from: 20, to: 95, dur: 2000, update: setT }); await s.tween({ from: 95, to: 0, dur: 1500, update: setT }); setT(0); sl.input.value = 0; sl.querySelector(".mono").textContent = "0 °C"; });
          s.step(async () => { s.sfx.pop(); s.show(fp0, "left"); await s.wait(250); s.sound("kochen", { vol: .5, dur: 3 }); s.show(fp100, "left"); await s.show(fix, "up"); s.say("Null Grad: Eis schmilzt. Hundert Grad: Wasser siedet."); });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(fun, "up"); });
        },
      },
      /* 11 ----------------------------------------------------------- */
      {
        title: "Im Alltag: Temperaturen",
        say: "Temperaturen begegnen dir überall: im Gefrierfach, im Kühlschrank, in deinem Körper und im Kochtopf.",
        build(s) {
          const svg = s.svg(1100, 240);
          const X = t => 60 + (t + 20) * (980 / 130);
          const defs = s.el("defs", null, s.el("linearGradient", { id: "u2tg", x1: 0, y1: 0, x2: 1, y2: 0 }, s.el("stop", { offset: 0, "stop-color": "#5aa9e6" }), s.el("stop", { offset: .3, "stop-color": "#c9e4f7" }), s.el("stop", { offset: .5, "stop-color": "#ffe08a" }), s.el("stop", { offset: 1, "stop-color": "#e5533a" })));
          svg.append(defs, s.el("rect", { x: 60, y: 122, width: 980, height: 18, rx: 9, fill: "url(#u2tg)" }));
          for (let t = -20; t <= 110; t += 10) { svg.append(s.el("line", { x1: X(t), y1: 140, x2: X(t), y2: 150, stroke: P.ink, "stroke-width": 2 })); }
          [0, 20, 40, 60, 80, 100].forEach(t => svg.append(T(s, X(t), 116, String(t), { "font-size": 19, "font-weight": 600, fill: P.pencil })));
          const it = [[-18, "Gefrierfach", "−18 °C", 0], [0, "Eis ↔ Wasser", "0 °C", 1], [7, "Kühlschrank", "7 °C", 0], [37, "Körper", "36,5–37,5 °C", 0], [38.5, "Fieber (Kind)", "ab 38,5 °C", 1], [100, "Wasser kocht", "100 °C", 0]];
          const tags = it.map(([t, a, c, below]) => {
            const g = later(s.el("g")); const x = X(t);
            if (below) { g.append(s.el("line", { x1: x, y1: 150, x2: x, y2: 176, stroke: P.ink, "stroke-width": 2 }), T(s, x, 200, a, { "font-size": 20 }), T(s, x, 226, c, { "font-size": 21, fill: P.red })); }
            else { g.append(s.el("line", { x1: x, y1: 70, x2: x, y2: 122, stroke: P.ink, "stroke-width": 2 }), T(s, x, 26, a, { "font-size": 20 }), T(s, x, 52, c, { "font-size": 21, fill: P.red })); }
            g.append(s.el("circle", { cx: x, cy: 131, r: 7, fill: "#fff", stroke: P.ink, "stroke-width": 3 }));
            svg.append(g); return g;
          });
          // fever thermometer zoom 35..42
          const fsv = s.svg(1060, 160);
          const F = t => 60 + (t - 35) * (940 / 7);
          const zones = [[35, 36.5, "#9cc8f0", "niedrig"], [36.5, 37.5, "#7fd1a2", "normal"], [37.5, 38.5, "#ffe08a", "erhöht"], [38.5, 42, "#f39a87", "Fieber"]];
          zones.forEach(([a, c, colr, n]) => fsv.append(s.el("rect", { x: F(a), y: 40, width: F(c) - F(a), height: 44, fill: colr }), T(s, (F(a) + F(c)) / 2, 70, n, { "font-size": 21 })));
          fsv.append(s.el("rect", { x: 60, y: 40, width: 940, height: 44, rx: 6, fill: "none", stroke: P.ink, "stroke-width": 3 }));
          for (let t = 35; t <= 42; t++) { fsv.append(s.el("line", { x1: F(t), y1: 84, x2: F(t), y2: 96, stroke: P.ink, "stroke-width": 2 }), T(s, F(t), 118, t + " °C", { "font-size": 19, "font-weight": 600, fill: P.pencil })); }
          const mk = s.el("path", { d: "M0 36 L-12 14 L12 14 Z", fill: P.unit }); fsv.append(mk);
          const mkT = T(s, 0, 152, "", { "font-size": 22, fill: P.unit }); fsv.append(mkT);
          const setF = t => { mk.setAttribute("transform", `translate(${F(t)} 0)`); mkT.setAttribute("x", Math.max(60, Math.min(1000, F(t)))); mkT.textContent = s.fmt(t, 1) + " °C"; };
          setF(36.8);
          const fsl = later(s.slider({ label: "Fieberthermometer", min: 350, max: 420, step: 1, value: 368, fmt: v => s.fmt(v / 10, 1) + " °C", onInput: v => setF(v / 10) }));
          const box = later(s.h("div", { class: "card stack", style: { gap: "4px", padding: "10px 16px" } }, s.h("span", { class: "exlabel", style: { marginBottom: 0 } }, "Ganz genau: Körpertemperatur bei Kindern"), fsv));
          s.add(root(s, "stack", { gap: "10px", justifyContent: "center" }, svg, box, fsl));
          s.sfx.whoosh();
          s.step(async () => { for (let i = 0; i < it.length; i++) { s.sfx.count(i * 2); s.show(tags[i], "pop"); await s.wait(220); } s.say("Gefrierfach minus achtzehn Grad, Kühlschrank sieben Grad, Körper etwa siebenunddreißig Grad."); });
          s.step(async () => { s.sfx.whoosh(); s.show(box, "up"); s.show(fsl, "up"); await s.tween({ from: 36.8, to: 39.2, dur: 1600, update: v => setF(Math.round(v * 10) / 10) }); s.sfx.error(); await s.wait(400); await s.tween({ from: 39.2, to: 36.8, dur: 900, update: v => setF(Math.round(v * 10) / 10) }); s.sfx.success(); s.say("Normal sind etwa sechsunddreißig Komma fünf bis siebenunddreißig Komma fünf Grad. Ab achtunddreißig Komma fünf haben Kinder Fieber."); });
        },
      },
      /* 12 ----------------------------------------------------------- */
      {
        title: "Masse: die Waage",
        say: "Mit der Waage vergleichen wir Massen. Leg Gewichtsstücke auf, bis die Waage im Gleichgewicht ist.",
        build(s) {
          const svg = s.svg(600, 430);
          const M = 170;
          svg.append(s.el("path", { d: "M300 120 L270 400 L330 400 Z", fill: "#9aa7b5", stroke: P.ink, "stroke-width": 3 }), s.el("rect", { x: 200, y: 396, width: 200, height: 18, rx: 6, fill: "#5d6678" }));
          const beam = s.el("g");
          beam.append(s.el("rect", { x: 100, y: 114, width: 400, height: 12, rx: 6, fill: "#5d6678" }), s.el("circle", { cx: 300, cy: 120, r: 10, fill: P.yellow, stroke: P.ink, "stroke-width": 3 }));
          const needle = s.el("line", { x1: 300, y1: 120, x2: 300, y2: 60, stroke: P.red, "stroke-width": 4 });
          beam.append(needle);
          svg.append(beam);
          const pan = x => { const g = s.el("g"); g.append(s.el("line", { x1: x, y1: 0, x2: x - 70, y2: 140, stroke: P.ink, "stroke-width": 2 }), s.el("line", { x1: x, y1: 0, x2: x + 70, y2: 140, stroke: P.ink, "stroke-width": 2 }), s.el("path", { d: `M${x - 80} 140 Q${x} 176 ${x + 80} 140 Z`, fill: "#c8d3de", stroke: P.ink, "stroke-width": 3 })); svg.append(g); return g; };
          const pL = pan(120), pR = pan(480);
          pL.append(s.el("text", { x: 120, y: 140, "text-anchor": "middle", "font-size": 76, text: "🍎" }));
          const wG = s.el("g"); pR.append(wG);
          let W = 0, ang = 0;
          const weights = [];
          const geo = () => { const a = ang * Math.PI / 180; beam.setAttribute("transform", `rotate(${ang} 300 120)`); const lY = 120 - Math.sin(a) * 180 + 0, rY = 120 + Math.sin(a) * 180; pL.setAttribute("transform", `translate(${180 * (1 - Math.cos(a))} ${lY})`); pR.setAttribute("transform", `translate(${-180 * (1 - Math.cos(a))} ${rY})`); };
          const drawW = () => { wG.innerHTML = ""; let x = 430; weights.forEach(w => { const h = w >= 100 ? 40 : w >= 50 ? 32 : w >= 20 ? 26 : 22, wd = w >= 100 ? 34 : w >= 50 ? 30 : 24; wG.append(s.el("rect", { x, y: 140 - h, width: wd, height: h, rx: 4, fill: "#b08d57", stroke: "#6b4a2b", "stroke-width": 2 })); x += wd + 4; }); };
          const target = () => Math.max(-14, Math.min(14, (M - W) / 6)) * -1;
          const settle = () => s.tween({ from: ang, to: target(), dur: 700, ease: "elastic", update: v => { ang = v; geo(); } });
          const readout = s.h("p", { class: "h2", style: { color: P.unit } }, "Rechts: 0 g");
          const state = s.h("p", { class: "t" }, "Der Apfel ist schwerer.");
          const upd = () => { readout.textContent = "Rechts: " + W + " g"; state.textContent = W < M ? "Der Apfel ist schwerer." : W > M ? "Die Gewichte sind schwerer." : "Gleichgewicht! Der Apfel hat 170 g."; state.style.color = W === M ? P.green : P.ink; };
          const add = async w => { if (weights.length >= 6) return; weights.push(w); W += w; drawW(); upd(); s.sfx.coin(); await settle(); if (W === M) { s.sfx.success(); } };
          const reset = async () => { weights.length = 0; W = 0; drawW(); upd(); s.sfx.swoosh(); await settle(); };
          ang = -14; geo();
          const wbtns = later(s.h("div", { class: "row", style: { gap: "10px", flexWrap: "nowrap" } }, ...[100, 50, 20, 10].map(w => s.h("button", { class: "btn", onclick: () => add(w) }, "+" + w + " g")), s.h("button", { class: "btn", onclick: () => reset() }, "↺")));
          const info = s.h("div", { class: "card stack", style: { gap: "4px", padding: "12px 18px" } }, readout, state);
          const units = later(s.h("div", { class: "merk", style: { fontSize: "22px", padding: "10px 18px 12px" } }, b(s, "1 kg = 1000 g"), ". Die Einheit der Masse ist das Kilogramm."));
          const lf = later(life(s, { style: { padding: "12px 18px" } }, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 190px", gap: "14px", alignItems: "center" } },
            p(s, "Die ", { fontSize: "21px" }, b(s, "Küchenwaage"), " hat eine ", b(s, "Tara-Taste"), ": Schüssel drauf, Taste drücken – die Anzeige springt auf 0. So wiegst du nur das Mehl."),
            s.photo("kuechenwaage", { w: 190, h: 230, pos: "50% 55%" }))));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "600px 1fr", gap: "24px", alignItems: "center" }, s.h("div", { class: "stack", style: { gap: "10px" } }, svg, wbtns), s.h("div", { class: "stack", style: { gap: "14px" } }, info, units, lf)));
          s.sfx.whoosh();
          s.step(async () => { s.sfx.pop(); await s.show(wbtns, "up"); s.say("Wir legen Gewichtsstücke auf."); for (const w of [100, 50, 20]) { await add(w); await s.wait(350); } });
          s.step(async () => { s.sfx.ding(); await s.show(units, "up"); });
          s.step(async () => { s.sfx.swoosh(); await s.show(lf, "up"); });
        },
      },
      /* 13 ----------------------------------------------------------- */
      {
        title: "Der Messzylinder",
        say: "Beim Messzylinder liest du am tiefsten Punkt der Wölbung ab – mit den Augen genau auf derselben Höhe.",
        build(s) {
          const svg = s.svg(620, 600);
          const Y = v => 540 - v * 4.6, TRUE = 60, LY = Y(TRUE);
          svg.append(s.el("rect", { x: 200, y: 560, width: 180, height: 16, rx: 6, fill: "#9aa7b5" }));
          svg.append(s.el("path", { d: `M232 ${LY} Q290 ${LY + 16} 348 ${LY} L348 552 L232 552 Z`, fill: "#7fb7e6", opacity: .8 }));
          svg.append(s.el("path", { d: `M232 ${LY - 9} Q236 ${LY} 246 ${LY + 4} M348 ${LY - 9} Q344 ${LY} 334 ${LY + 4}`, stroke: "#3b78c4", "stroke-width": 3, fill: "none" }));
          svg.append(s.el("rect", { x: 230, y: 40, width: 120, height: 514, rx: 10, fill: "rgba(255,255,255,.25)", stroke: P.ink, "stroke-width": 4 }));
          for (let v = 0; v <= 100; v += 5) { const y = Y(v); svg.append(s.el("line", { x1: 230, y1: y, x2: v % 10 === 0 ? 262 : 250, y2: y, stroke: P.ink, "stroke-width": 2 })); if (v % 10 === 0 && v > 0) svg.append(s.el("text", { x: 188, y: y + 7, "text-anchor": "end", "font-size": 19, "font-weight": 600, fill: P.ink, text: String(v) })); }
          svg.append(T(s, 160, 30, "ml", { "font-size": 22, fill: P.unit }));
          const eye = s.el("g", { style: { cursor: "grab" } });
          eye.append(s.el("rect", { x: -40, y: -40, width: 80, height: 80, fill: "transparent" }), s.el("path", { d: "M-30 0 Q0 -22 30 0 Q0 22 -30 0 Z", fill: "#fff", stroke: P.ink, "stroke-width": 3 }), s.el("circle", { r: 9, fill: "#3f7fd6" }), s.el("circle", { r: 4, fill: "#111" }));
          const sight = s.el("line", { x1: 0, y1: 0, x2: 290, y2: LY + 8, stroke: P.red, "stroke-width": 3, "stroke-dasharray": "8 6" });
          const readMark = s.el("path", { d: "M0 0 L-16 -9 L-16 9 Z", fill: P.red });
          svg.append(sight, readMark, eye);
          const out = s.h("p", { class: "big" }, "");
          const verdict = s.h("p", { class: "t" }, "");
          let EY = LY;
          const setEye = y => {
            EY = Math.max(70, Math.min(520, y)); eye.setAttribute("transform", `translate(540 ${EY})`);
            sight.setAttribute("x1", 510); sight.setAttribute("y1", EY);
            const val = TRUE + (LY - EY) * 0.045, r = Math.round(val);
            readMark.setAttribute("transform", `translate(228 ${Y(val)})`);
            out.textContent = "Du liest: " + r + " ml";
            const ok = Math.abs(r - TRUE) <= 0;
            out.style.color = ok ? P.green : P.red;
            verdict.textContent = ok ? "Richtig! Augen auf Höhe der Flüssigkeit." : r > TRUE ? "Zu viel – die Augen sind zu hoch." : "Zu wenig – die Augen sind zu tief.";
          };
          setEye(LY);
          let lt = 0;
          s.drag(eye, { space: svg, onMove: q => { setEye(q.y); const n = Math.round(EY / 15); if (n !== lt) { lt = n; s.sfx.tick(); } } });
          // zoom
          const zsv = s.svg(330, 170);
          zsv.append(s.el("rect", { x: 10, y: 10, width: 310, height: 150, rx: 16, fill: "#fff", stroke: P.line, "stroke-width": 2 }));
          zsv.append(s.el("path", { d: "M40 40 Q165 120 290 40 L290 150 L40 150 Z", fill: "#7fb7e6", opacity: .8 }), s.el("line", { x1: 40, y1: 20, x2: 40, y2: 150, stroke: P.ink, "stroke-width": 4 }), s.el("line", { x1: 290, y1: 20, x2: 290, y2: 150, stroke: P.ink, "stroke-width": 4 }));
          const zl = later(s.el("g", null, s.el("line", { x1: 60, y1: 80, x2: 270, y2: 80, stroke: P.red, "stroke-width": 3, "stroke-dasharray": "8 6" }), s.el("circle", { cx: 165, cy: 80, r: 7, fill: P.red }), T(s, 165, 118, "hier ablesen", { "font-size": 21, fill: P.red })));
          zsv.append(zl);
          const zcard = later(s.h("div", { class: "card stack", style: { gap: "4px", padding: "10px 14px", alignItems: "center" } }, s.h("span", { class: "exlabel", style: { alignSelf: "flex-start", marginBottom: 0 } }, "Lupe: der Meniskus"), zsv));
          const res = later(s.h("div", { class: "card stack", style: { gap: "2px", padding: "10px 16px" } }, out, verdict));
          const merk = later(s.h("div", { class: "merk", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Am ", b(s, "tiefsten Punkt"), " der Wölbung ablesen – Augen ", b(s, "auf gleicher Höhe"), ". Sonst gibt es einen ", b(s, "Ablesefehler"), "."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "620px 1fr", gap: "20px", alignItems: "center" }, svg, s.h("div", { class: "stack", style: { gap: "12px" } }, zcard, res, merk)));
          s.sfx.whoosh();
          s.step(async () => { s.sound("water-pour", { vol: .5 }); await s.show(zcard, "up"); s.sfx.snap(); await s.show(zl, "fade"); s.say("Wasser wölbt sich am Rand nach oben. Abgelesen wird unten in der Mitte."); });
          s.step(async () => { s.show(res, "pop"); s.say("Zieh das Auge hoch und runter."); await s.tween({ from: LY, to: 120, dur: 1200, update: setEye }); s.sfx.error(); await s.wait(500); await s.tween({ from: 120, to: 480, dur: 1500, update: setEye }); s.sfx.error(); await s.wait(500); await s.tween({ from: 480, to: LY, dur: 1000, update: setEye }); s.sfx.success(); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 13b ---------------------------------------------------------- */
      {
        title: "Messgeräte in echt",
        say: "So sehen echte Messgeräte aus. Viele davon findest du im NaWi-Raum – und manche bei dir zu Hause.",
        build(s) {
          const cards = [
            s.photo("thermometer", { w: 340, h: 240, pos: "50% 40%", caption: "Thermometer: links die °C-Skala", cls: "later" }),
            s.photo("fieberthermometer", { w: 340, h: 240, pos: "50% 50%", caption: "Fieberthermometer: 35,8 °C", cls: "later" }),
            s.photo("balkenwaage", { w: 340, h: 240, pos: "50% 55%", caption: "Balkenwaage mit Gewichtsstücken", cls: "later" }),
            s.photo("meniskus", { w: 340, h: 240, pos: "50% 6%", caption: "Messzylinder: Wölbung (Meniskus)", cls: "later" }),
            s.photo("stoppuhr", { w: 340, h: 240, pos: "50% 45%", caption: "Stoppuhr: Zeit in Sekunden", cls: "later" }),
            s.photo("zollstock", { w: 340, h: 240, pos: "50% 50%", caption: "Zollstock: Länge in cm", cls: "later" }),
          ];
          const merk = later(s.h("div", { class: "merk", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Jedes Messgerät hat eine ", b(s, "Skala"), " mit einer ", b(s, "Einheit"), ". Schau beim Ablesen genau hin!"));
          s.add(root(s, "stack", { justifyContent: "center", gap: "18px" }, s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 340px)", gap: "18px 24px", justifyContent: "center" } }, ...cards), merk));
          s.step(async () => { s.sound("camera-shutter", { vol: .6 }); for (const i of [0, 1, 2]) { s.show(cards[i], "zoom"); await s.wait(200); } s.say("Thermometer, Fieberthermometer und Waage."); });
          s.step(async () => { s.sound("stopwatch", { vol: .5, dur: 2 }); for (const i of [3, 4, 5]) { s.show(cards[i], "zoom"); await s.wait(200); } s.say("Messzylinder, Stoppuhr und Zollstock."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 14 ----------------------------------------------------------- */
      {
        title: "Reaktionszeit: Lineal-Test",
        say: "Wie schnell reagierst du? Tippe auf Start. Wenn das Lineal fällt, tippe so schnell du kannst auf Fangen.",
        build(s) {
          const CW = 440, CH = 600, PX = 16; // 16 px per cm
          const { canvas, g } = s.canvas(CW, CH);
          canvas.style.background = "#fff"; canvas.style.borderRadius = "16px"; canvas.style.border = "2px solid var(--line)";
          const FY = 500; // finger line
          let off = 0, state = "idle", tStart = 0, caught = null;
          const draw = () => {
            g.clearRect(0, 0, CW, CH);
            const top = FY - 2 + off - 30 * PX;
            g.save(); g.beginPath(); g.rect(0, 0, CW, CH); g.clip();
            g.fillStyle = "#fff3c4"; g.strokeStyle = "#b8962e"; g.lineWidth = 2;
            g.fillRect(160, top, 70, 30 * PX + 8); g.strokeRect(160, top, 70, 30 * PX + 8);
            g.fillStyle = P.ink; g.font = "600 19px Atkinson Hyperlegible, sans-serif"; g.textAlign = "right";
            for (let c = 0; c <= 30; c++) { const y = top + (30 - c) * PX + 4; g.beginPath(); g.moveTo(230, y); g.lineTo(c % 5 === 0 ? 206 : 218, y); g.stroke(); if (c % 5 === 0) g.fillText(String(c), 202, y + 7); }
            g.restore();
            // fingers
            const closed = caught != null;
            g.fillStyle = P.skin; g.strokeStyle = P.skinD; g.lineWidth = 3;
            g.beginPath(); g.ellipse(closed ? 146 : 120, FY, 34, 14, 0, 0, 7); g.fill(); g.stroke();
            g.beginPath(); g.ellipse(closed ? 244 : 270, FY, 34, 14, 0, 0, 7); g.fill(); g.stroke();
            g.fillRect(40, FY - 12, closed ? 76 : 50, 24); g.fillRect(closed ? 274 : 300, FY - 12, 120, 24);
            if (closed) { g.strokeStyle = P.red; g.lineWidth = 3; g.setLineDash([8, 6]); g.beginPath(); g.moveTo(130, FY); g.lineTo(260, FY); g.stroke(); g.setLineDash([]); }
          };
          draw();
          const out = s.h("p", { class: "big", style: { color: P.unit } }, "–");
          const outT = s.h("p", { class: "t" }, "Tippe auf Start.");
          const list = s.h("div", { class: "row", style: { gap: "8px" } });
          const tries = [];
          const avg = s.h("p", { class: "t", style: { fontWeight: 700 } }, "");
          const tOf = cm => Math.sqrt(2 * (cm / 100) / 9.81);
          const record = cm => {
            caught = cm; state = "idle"; draw();
            if (cm == null || cm > 30) { out.textContent = "Daneben!"; outT.textContent = "Das Lineal ist durchgefallen. Nochmal!"; s.sfx.error(); caught = null; off = 0; draw(); return; }
            out.textContent = s.fmt(cm, 1) + " cm → " + s.fmt(tOf(cm), 2) + " s"; outT.textContent = "So lange hast du gebraucht.";
            s.sfx.snap(); s.sfx.ding();
            tries.push(cm); if (tries.length > 5) tries.shift();
            list.innerHTML = ""; tries.forEach(c => list.append(s.h("span", { class: "chip", style: { fontSize: "20px" } }, s.fmt(c, 1) + " cm")));
            const m = tries.reduce((a, c) => a + c, 0) / tries.length;
            avg.textContent = tries.length > 1 ? "Mittelwert: " + s.fmt(m, 1) + " cm ≈ " + s.fmt(tOf(m), 2) + " s" : "";
          };
          const start = async () => {
            if (state !== "idle") return;
            caught = null; off = 0; draw(); state = "wait"; out.textContent = "Achtung …"; outT.textContent = "Gleich fällt es!"; s.sfx.click();
            await s.wait(1000 + Math.random() * 2000);
            if (!s.alive || state !== "wait") return;
            state = "fall"; tStart = performance.now(); s.sfx.whoosh();
            s.loop(() => { if (state !== "fall") return false; const t = (performance.now() - tStart) / 1000; off = 0.5 * 981 * t * t * PX; draw(); if (off > 34 * PX) { record(null); return false; } });
          };
          const catchIt = () => { if (state === "wait") { state = "idle"; out.textContent = "Zu früh!"; outT.textContent = "Erst fangen, wenn es fällt."; s.sfx.boing(); return; } if (state !== "fall") return; state = "idle"; record(Math.round(off / PX * 10) / 10); };
          canvas.addEventListener("pointerdown", e => { e.preventDefault(); catchIt(); });
          const bStart = s.h("button", { class: "btn", style: { flex: 1 }, onclick: () => start() }, "▶ Start");
          const bCatch = s.h("button", { class: "btn solid", style: { flex: 2, minHeight: "76px", fontSize: "28px" }, onclick: () => catchIt() }, "✋ Fangen!");
          const how = later(ex(s, "Mit einem Partner", { style: { padding: "10px 16px" } }, p(s, "Einer hält ein echtes Lineal, du hältst die Finger offen bei 0 cm. Er lässt los – du fängst. Die Zahl an deinen Fingern ist die Fallstrecke.", { fontSize: "21px" })));
          const fact = later(s.h("p", { class: "small pencil" }, "Physik dahinter: Fällt das Lineal 20 cm, sind etwa 0,2 Sekunden vergangen."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: CW + "px 1fr", gap: "26px", alignItems: "center" }, canvas,
            s.h("div", { class: "stack", style: { gap: "12px" } }, s.h("div", { class: "card stack", style: { gap: "2px", padding: "10px 16px" } }, out, outT), s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "12px" } }, bStart, bCatch), list, avg, how, fact)));
          s.sfx.pop();
          s.step(async () => {
            s.say("Ein Beispiel: Das Lineal fällt, und schnell gefangen!");
            if (s.fast) { off = 18.5 * PX; record(18.5); return; }
            state = "fall"; tStart = performance.now(); s.sfx.whoosh();
            await new Promise(res => s.loop(() => { const t = (performance.now() - tStart) / 1000; off = 0.5 * 981 * t * t * PX; draw(); if (off >= 18.5 * PX) { state = "idle"; record(18.5); res(); return false; } }));
          });
          s.step(async () => { s.sfx.pop(); await s.show(how, "up"); s.show(fact, "fade"); s.say("Jetzt du! Tippe auf Start."); });
        },
      },
      /* 15 ----------------------------------------------------------- */
      {
        title: "Messfehler und Mittelwert",
        say: "Jede Messung ist ein bisschen anders. Darum misst man mehrmals und rechnet den Mittelwert aus.",
        build(s) {
          const vals = [19, 22, 17, 21, 16], mean = 19;
          const svg = s.svg(1100, 290);
          const BY = 250, K = 9;
          svg.append(s.el("line", { x1: 120, y1: BY, x2: 1000, y2: BY, stroke: P.ink, "stroke-width": 3 }));
          const bars = vals.map((v, i) => {
            const x = 170 + i * 160;
            const r = s.el("rect", { x, y: BY, width: 100, height: 0, rx: 8, fill: P.unit, opacity: .85 });
            const t = later(T(s, x + 50, BY - v * K - 12, v + " cm", { "font-size": 22, fill: P.unit }));
            svg.append(r, t, T(s, x + 50, BY + 28, "Versuch " + (i + 1), { "font-size": 19, "font-weight": 600, fill: P.pencil }));
            return { r, t, v, x };
          });
          const ml = later(s.el("g", null, s.el("line", { x1: 120, y1: BY - mean * K, x2: 1000, y2: BY - mean * K, stroke: P.red, "stroke-width": 4, "stroke-dasharray": "12 8" }), s.el("text", { x: 1004, y: BY - mean * K - 8, "text-anchor": "end", "font-size": 21, "font-weight": 800, fill: P.red, text: "Mittelwert" })));
          svg.append(ml);
          const setH = (bar, v) => { bar.r.setAttribute("y", BY - v * K); bar.r.setAttribute("height", v * K); bar.t.setAttribute("y", BY - v * K - 12); bar.t.textContent = s.fmt(v, 0) + " cm"; };
          const why = later(s.h("div", { class: "card stack", style: { gap: "6px", padding: "12px 18px" } }, s.h("span", { class: "exlabel", style: { marginBottom: 0 } }, "Warum ist jede Messung anders?"),
            s.h("p", { class: "small" }, "• Mal bist du schneller, mal langsamer (Zufall)"), s.h("p", { class: "small" }, "• Ablesefehler: schräg draufgeschaut"), s.h("p", { class: "small" }, "• Das Messgerät ist nicht ganz genau")));
          const calc = later(s.h("div", { class: "card stack", style: { gap: "6px", padding: "12px 18px", borderColor: P.red } }, s.h("span", { class: "exlabel", style: { marginBottom: 0, color: P.red } }, "So rechnest du"),
            s.h("p", { class: "t mono", style: { fontSize: "22px" } }, "(19 + 22 + 17 + 21 + 16) : 5"), s.h("p", { class: "t mono", style: { fontSize: "22px" } }, "= 95 : 5 = ", s.h("b", { class: "red" }, "19 cm"))));
          const merk = later(s.h("div", { class: "merk", style: { fontSize: "21px", padding: "10px 18px 12px" } }, b(s, "Mittelwert = Summe aller Werte : Anzahl der Werte."), " Er ist genauer als eine einzelne Messung."));
          s.add(root(s, "stack", { gap: "12px", justifyContent: "center" }, s.h("p", { class: "t a-up", style: { textAlign: "center" } }, "Julian macht den Lineal-Test fünfmal (Beispielwerte):"), svg, s.h("div", { class: "cols", style: { gap: "18px" } }, why, calc), merk));
          s.sfx.whoosh();
          s.step(async () => { for (let i = 0; i < 5; i++) { const bar = bars[i]; s.sfx.count(i * 2); s.show(bar.t, "fade"); await s.tween({ from: 0, to: bar.v, dur: 350, ease: "out", update: v => setH(bar, v) }); } s.say("Fünf Versuche, fünf verschiedene Werte."); });
          s.step(async () => { s.sfx.pop(); await s.show(why, "up"); });
          s.step(async () => { s.sfx.whoosh(); s.show(calc, "up"); await Promise.all(bars.map(bar => s.tween({ from: bar.v, to: mean, dur: 1300, ease: "inOut", update: v => setH(bar, v) }))); s.sfx.ding(); await s.show(ml, "fade"); s.say("Die Summe ist fünfundneunzig. Geteilt durch fünf ergibt neunzehn Zentimeter."); });
          s.step(async () => { s.sfx.success(); await s.show(merk, "up"); });
        },
      },
      /* 16 ----------------------------------------------------------- */
      {
        title: "Im Alltag: Messen überall",
        say: "Gemessen wird überall: beim Sport, beim Wetter, in der Küche und beim Arzt.",
        build(s) {
          const sw = s.h("span", { class: "mono", style: { font: "800 40px/1 var(--f-display)", color: P.red } }, "0,00 s");
          const cards = [
            ["Sport", "🏃", [sw, s.h("p", { class: "small" }, "Weltrekord über 100 m: Usain Bolt, 16. August 2009 im Berliner Olympiastadion. Gemessen auf Hundertstelsekunden.")]],
            ["Wetterstation", "🌧️", [s.h("p", { class: "t", style: { fontSize: "21px" } }, b(s, "1 mm"), " Regen = ", b(s, "1 Liter"), " Wasser auf ", b(s, "1 m²"), "."), s.h("p", { class: "small" }, "Dazu Thermometer für die Lufttemperatur.")]],
            ["Küche", "🥄", [s.h("p", { class: "t", style: { fontSize: "21px" } }, "1 Teelöffel ≈ ", b(s, "5 ml")), s.h("p", { class: "t", style: { fontSize: "21px" } }, "1 Esslöffel ≈ ", b(s, "15 ml")), s.h("p", { class: "small" }, "Waage mit Tara-Taste")]],
            ["Arzt und Zuhause", "🌡️", [s.h("p", { class: "t", style: { fontSize: "21px" } }, "Normal: ", b(s, "36,5–37,5 °C")), s.h("p", { class: "small" }, "Bei Kindern ab 38,5 °C: Fieber")]],
            ["Berlin", "📏", [s.h("p", { class: "t", style: { fontSize: "21px" } }, "Fernsehturm: ", b(s, "368 m")), s.h("p", { class: "small" }, "das höchste Bauwerk Deutschlands")]],
            ["Ohren", "🎵", [s.h("p", { class: "t", style: { fontSize: "21px" } }, "Ab ", b(s, "85 dB"), " auf Dauer schädlich"), s.h("p", { class: "small" }, "Bei lauter Musik: Gehörschutz!")]],
          ].map(([lab, e, kids]) => later(s.h("div", { class: "card stack", style: { gap: "6px", padding: "12px 16px" } },
            s.h("div", { class: "row", style: { justifyContent: "space-between", flexWrap: "nowrap" } }, s.h("span", { class: "exlabel", style: { marginBottom: 0 } }, lab), s.h("span", { style: { fontSize: "34px", lineHeight: 1 } }, e)), ...kids)));
          const merk = later(s.h("div", { class: "merk", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Forscher, Sportler, Köche und Ärzte: Alle ", b(s, "messen"), " – mit Zahl ", b(s, "und"), " Einheit."));
          s.add(root(s, "stack", { gap: "16px", justifyContent: "center" }, s.h("div", { class: "cols3", style: { gap: "16px", gridAutoRows: "1fr" } }, ...cards), merk));
          s.sfx.whoosh();
          s.step(async () => { s.sfx.pop(); await s.show(cards[0], "pop"); s.sound("stopwatch", { vol: .6, dur: 2.2 }); await s.tween({ from: 0, to: 9.58, dur: 2200, ease: "linear", update: v => { sw.textContent = s.fmt(v, 2) + " s"; } }); sw.textContent = "9,58 s"; s.sound("crowd-cheer", { vol: .5, dur: 3 }); s.say("Neun Komma fünf acht Sekunden für hundert Meter!"); });
          s.step(async () => { s.sound("rain", { vol: .4, dur: 3 }); for (let i = 1; i < 3; i++) { s.show(cards[i], "pop"); await s.wait(250); } });
          s.step(async () => { for (let i = 3; i < 6; i++) { s.sfx.pop(); s.show(cards[i], "pop"); await s.wait(250); } });
          s.step(async () => { s.sfx.success(); await s.show(merk, "up"); s.confetti(590, 420, 80); });
          if (s.fast) sw.textContent = "9,58 s";
        },
      },
    ],
  });
})();
