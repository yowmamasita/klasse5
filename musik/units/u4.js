/* Kapitel 4 – Tonleitern (Berliner Rahmenlehrplan Musik, Klasse 5–6) */
(() => {
  "use strict";
  const C = "#c2410c", SOFT = "#fde9dc", RED = "#dc3b2a", INK = "#1b2740", PENCIL = "#5d6678", GREEN = "#138a5a", BLUE = "#1d5bd0", VIOLET = "#7b4fd6";
  const LIGHT = "#fdba8c";
  const hz = n => 523.25 * Math.pow(2, n / 12); // 0 = c'' (C5)
  const pc = n => ((n % 12) + 12) % 12;
  const isB = n => [1, 3, 6, 8, 10].includes(pc(n));
  const WN = ["c", "cis", "d", "dis", "e", "f", "fis", "g", "gis", "a", "b", "h"];

  /* ---------- sounds (all through the engine's Sfx) ---------- */
  const pno = (s, n, dur = 0.7, w = 0, v = 0.2) => { const f = hz(n); s.sfx.tone(f, dur, "triangle", v, w); s.sfx.tone(f * 2, dur * 0.5, "sine", v * 0.22, w); };
  const bell = (s, n, dur = 1.4, w = 0, v = 0.18) => { const f = hz(n); s.sfx.tone(f, dur, "sine", v, w); s.sfx.tone(f * 2.76, dur * 0.4, "sine", v * 0.18, w); };
  const box = (s, n, w = 0) => { const f = hz(n); s.sfx.tone(f, 0.9, "sine", 0.16, w); s.sfx.tone(f * 4, 0.25, "sine", 0.04, w); };
  const chord = (s, ns, dur = 1.2, w = 0, v = 0.12) => ns.forEach(n => pno(s, n, dur, w, v));

  /* cancellable sequences: a new start() invalidates the running one */
  function seq(s) { let tok = 0; return { start() { return ++tok; }, ok(t) { return s.alive && t === tok; }, stop() { tok++; } }; }

  /* ---------- playable keyboard (SVG group) ---------- */
  function kb(s, x0, y0, lo, hi, W, H, o = {}) {
    const g = s.el("g", { transform: `translate(${x0} ${y0})` });
    const whites = []; for (let n = lo; n <= hi; n++) if (!isB(n)) whites.push(n);
    const ww = W / whites.length, bw = ww * (o.bwf || 0.6), bh = H * 0.6;
    const keys = {};
    const hit = (n, col = C, ms = 380) => { const k = keys[n]; if (!k) return; k.el.setAttribute("fill", col); s.wait(ms).then(() => { if (s.alive) k.el.setAttribute("fill", k.base); }); };
    const mk = (n, x, w, h, black) => {
      const r = s.el("rect", { x: x + 1, y: 0, width: w - 2, height: h, rx: black ? 4 : 7, fill: black ? "#23272f" : "#fff", stroke: "#3a3f4a", "stroke-width": black ? 1 : 1.6, style: { cursor: "pointer" } });
      keys[n] = { n, el: r, black, cx: x + w / 2, x, w, h, base: black ? "#23272f" : "#fff" };
      r.addEventListener("pointerdown", e => { e.preventDefault(); s.sfx.unlock(); if (o.onKey) o.onKey(n); else { pno(s, n); hit(n); } });
      return r;
    };
    whites.forEach((n, i) => g.append(mk(n, i * ww, ww, H, false)));
    for (let n = lo; n <= hi; n++) if (isB(n)) g.append(mk(n, whites.indexOf(n + 1) * ww - bw / 2, bw, bh, true));
    const labels = s.el("g", { style: { pointerEvents: "none" } });
    g.append(labels);
    const tint = (n, col) => { const k = keys[n]; if (!k) return; k.base = col || (k.black ? "#23272f" : "#fff"); k.el.setAttribute("fill", k.base); };
    const label = (n, txt, op = {}) => {
      const k = keys[n];
      const t = s.el("text", { x: k.cx, y: k.black ? bh - 12 : H - 14, "text-anchor": "middle", "font-size": op.fs || 22, "font-weight": 700, fill: k.black ? "#fff" : (op.color || INK), text: txt, class: op.later ? "later" : null });
      labels.append(t); return t;
    };
    return { g, keys, hit, tint, label, ww, bh, H, whites, x0, y0 };
  }
  /* arc between two key centres (in the svg that holds the keyboard) */
  function arc(s, K, n1, n2, y, txt, col = C) {
    const g = s.el("g");
    const x1 = K.x0 + K.keys[n1].cx, x2 = K.x0 + K.keys[n2].cx, mx = (x1 + x2) / 2;
    g.append(s.el("path", { d: `M${x1} ${y} Q${mx} ${y - 46} ${x2} ${y}`, fill: "none", stroke: col, "stroke-width": 4, "stroke-linecap": "round" }));
    g.append(s.el("circle", { cx: x2, cy: y, r: 6, fill: col }));
    if (txt) g.append(s.el("text", { x: mx, y: y - 32, "text-anchor": "middle", "font-size": 22, "font-weight": 800, fill: col, text: txt }));
    return g;
  }

  /* ---------- notation drawn by hand ---------- */
  // diatonic index d: c' = 0, d' = 1, … c'' = 7. Staff: bottom line = e' (d = 2)
  function staff(s, svg, x1, x2, yTop, gap) {
    for (let i = 0; i < 5; i++) svg.append(s.el("line", { x1, x2, y1: yTop + i * gap, y2: yTop + i * gap, stroke: INK, "stroke-width": 1.6 }));
    return d => yTop + 4 * gap - (d - 2) * gap / 2;
  }
  function clef(s, x, yG, gap) {
    const q = gap / 12, P = (dx, dy) => `${x + dx * q} ${yG + dy * q}`;
    return s.el("path", {
      d: `M${P(4, 40)} C${P(-6, 44)} ${P(-10, 32)} ${P(-1, 30)} C${P(6, 30)} ${P(7, 38)} ${P(3, 40)} M${P(2, 40)} L${P(6, -40)} C${P(8, -58)} ${P(22, -52)} ${P(14, -34)} C${P(8, -20)} ${P(-14, -10)} ${P(-14, 6)} C${P(-14, 22)} ${P(14, 24)} ${P(16, 8)} C${P(17, -6)} ${P(0, -10)} ${P(-2, 2)} C${P(-3, 10)} ${P(6, 13)} ${P(8, 8)}`,
      fill: "none", stroke: INK, "stroke-width": 3 * q, "stroke-linecap": "round", "stroke-linejoin": "round",
    });
  }
  // note head with stem (quarter if filled) + ledger line for c'
  function nhead(s, x, y, d, gap, { color = INK, hollow = false, stem = true } = {}) {
    const g = s.el("g"), k = gap / 14;
    if (d <= 0) g.append(s.el("line", { x1: x - 17 * k, x2: x + 17 * k, y1: y, y2: y, stroke: INK, "stroke-width": 1.8 }));
    g.append(s.el("ellipse", { cx: x, cy: y, rx: 9.5 * k, ry: 7 * k, transform: `rotate(-22 ${x} ${y})`, fill: hollow ? "#fff" : color, stroke: color, "stroke-width": hollow ? 2.6 * k : 1 }));
    if (stem) { const up = d < 6, sx = up ? x + 8.6 * k : x - 8.6 * k; g.append(s.el("line", { x1: sx, x2: sx, y1: y, y2: up ? y - 46 * k : y + 46 * k, stroke: color, "stroke-width": 2.4 * k })); }
    return g;
  }
  // accidentals drawn as paths: "#" Kreuz, "b" b, "n" Auflösungszeichen; centred at (x, y)
  function acc(s, x, y, type, gap, color = INK) {
    const q = gap / 12, g = s.el("g");
    const L = (a, b, c, d, w) => g.append(s.el("line", { x1: x + a * q, y1: y + b * q, x2: x + c * q, y2: y + d * q, stroke: color, "stroke-width": w * q, "stroke-linecap": "round" }));
    if (type === "#") { L(-3, -15, -3, 17, 2.2); L(4, -17, 4, 15, 2.2); L(-8, -3, 9, -8, 4.2); L(-8, 8, 9, 3, 4.2); }
    else if (type === "n") { L(-4, -16, -4, 8, 2.2); L(4, -8, 4, 16, 2.2); L(-4, -3, 4, -6, 4); L(-4, 7, 4, 4, 4); }
    else { L(-4, -22, -4, 9, 2.4); g.append(s.el("path", { d: `M${x - 4 * q} ${y + 9 * q} C${x + 10 * q} ${y + 1 * q} ${x + 9 * q} ${y - 9 * q} ${x - 4 * q} ${y - 2 * q}`, fill: "none", stroke: color, "stroke-width": 2.8 * q })); }
    return g;
  }
  const btn = (s, label, onclick, solid = false) => s.h("button", { class: "btn" + (solid ? " solid" : ""), onclick }, label);
  const exCard = (s, lab, emo, txt, fn, life = false) => s.h("div", { class: (life ? "life" : "ex") + " later" }, s.h("span", { class: "exlabel" }, lab),
    s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "12px" } },
      s.h("span", { style: { fontSize: "38px" } }, emo), s.h("p", { class: "small", style: { flex: 1 } }, txt), fn ? btn(s, "▶", fn) : null));

  const SLIDES = [];
  /* 1 ---------------------------------------------------------------- */
  SLIDES.push({
    title: "Die Stammtöne",
    say: "Die weißen Tasten heißen c, d, e, f, g, a, h. Danach geht es wieder mit c los.",
    build(s) {
      const Q = seq(s);
      const svg = s.svg(1100, 230);
      const now = s.h("span", { class: "big", style: { color: C } }, "…");
      const K = kb(s, 40, 6, -12, 11, 1020, 218, { onKey: n => { pno(s, n); K.hit(n); now.textContent = isB(n) ? "schwarze Taste" : WN[pc(n)]; } });
      svg.append(K.g);
      const labs = K.whites.map(n => K.label(n, WN[pc(n)], { color: pc(n) === 0 ? C : INK, later: true }));
      const top = s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "18px" } }, s.h("p", { class: "h2" }, "Tippe auf eine Taste! Du spielst:"), now);
      const scale = () => { const t = Q.start(); [-12, -10, -8, -7, -5, -3, -1, 0].forEach((n, i) => s.wait(i * 320).then(() => { if (Q.ok(t)) { pno(s, n, 0.5); K.hit(n, LIGHT, 300); } })); };
      const c1 = exCard(s, "Beispiel 1 · Klavier", "🎹", "Die weißen Tasten sind die Stammtöne. Das Muster wiederholt sich immer wieder.", scale);
      const c2 = exCard(s, "Beispiel 2 · Glockenspiel", "🔔", "Auf vielen Schul-Glockenspielen stehen die Namen direkt auf den Plättchen.", () => [7, 9, 11, 12].forEach((n, i) => bell(s, n, 1, i * 0.3)));
      const c3 = exCard(s, "Beispiel 3 · Gitarre", "🎸", "Die sechs Saiten heißen von tief nach hoch: E, A, d, g, h, e.", () => [-32, -27, -22, -17, -13, -8].forEach((n, i) => pno(s, n, 1.2, i * 0.28, 0.24)));
      const merk = s.h("div", { class: "merk later" }, "Die 7 ", s.h("b", null, "Stammtöne"), " heißen c, d, e, f, g, a, h. Achtung: Nach a kommt im Deutschen ", s.h("b", null, "h"), " – nicht b!");
      s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%", justifyContent: "center" } }, top, svg, s.h("div", { class: "cols3", style: { gap: "16px" } }, c1, c2, c3), merk));
      s.show(svg, "up"); s.sfx.whoosh();
      s.step(async () => {
        for (let i = 0; i < 7; i++) { s.show([labs[i], labs[i + 7]], "pop"); pno(s, K.whites[i], 0.45); K.hit(K.whites[i], LIGHT, 280); now.textContent = WN[pc(K.whites[i])]; await s.wait(330); }
        pno(s, 0, 0.6); K.hit(0, LIGHT, 300); s.say("c, d, e, f, g, a, h, und wieder c.");
      });
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.say("Nach a kommt h."); });
      s.step(async () => { for (const [i, c] of [c1, c2, c3].entries()) { s.sfx.count(i); s.show(c, "up"); await s.wait(200); } });
    },
  });

  /* 2 ---------------------------------------------------------------- */
  SLIDES.push({
    title: "Halbton und Ganzton",
    say: "Der kleinste Schritt auf dem Klavier ist der Halbton. Zwei Halbtöne zusammen sind ein Ganzton.",
    build(s) {
      const Q = seq(s);
      const svg = s.svg(1100, 270);
      let start = -12;
      const arcs = s.el("g");
      const K = kb(s, 40, 74, -12, 12, 1020, 192, { onKey: n => { K.tint(start, null); start = Math.min(n, 10); K.tint(start, LIGHT); pno(s, n); K.hit(n); arcs.replaceChildren(); } });
      svg.append(K.g, arcs);
      K.tint(start, LIGHT);
      const stepTo = async (d, col) => {
        const t = Q.start(), a = start, b = start + d;
        arcs.replaceChildren(arc(s, K, a, b, 66, d === 1 ? "Halbton" : "Ganzton", col));
        pno(s, a, 0.5); K.hit(a, col, 400); await s.wait(450); if (!Q.ok(t)) return;
        pno(s, b, 0.7); K.hit(b, col, 500);
      };
      const bH = btn(s, "▶ Halbton (+1)", () => stepTo(1, C), true);
      const bG = btn(s, "▶ Ganzton (+2)", () => stepTo(2, BLUE), true);
      const merk = s.h("div", { class: "merk later", style: { flex: 1 } }, s.h("b", null, "Halbton"), " = direkt zur nächsten Taste. ", s.h("b", null, "Ganzton"), " = 2 Halbtöne.");
      const ctrl = s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "16px", alignItems: "center" } }, s.h("div", { class: "stack", style: { gap: "10px" } }, bH, bG), merk);
      const c1 = exCard(s, "Beispiel 1 · Treppe", "🪜", "Halbton = kleine Stufe. Ganzton = zwei Stufen auf einmal.", () => { [-12, -11, -10].forEach((n, i) => pno(s, n, 0.4, i * 0.35)); [-12, -10, -8].forEach((n, i) => pno(s, n, 0.4, 1.3 + i * 0.35)); });
      const c2 = exCard(s, "Beispiel 2 · Gitarre", "🎸", "Einen Bund weiter auf derselben Saite: einen Halbton höher.", () => [-8, -7, -6, -5, -4].forEach((n, i) => pno(s, n, 0.4, i * 0.3, 0.22)));
      const c3 = exCard(s, "Beispiel 3 · Klavier", "🎹", "e und f sind beide weiß – und trotzdem nur ein Halbton!", () => { pno(s, -8, 0.5); pno(s, -7, 0.7, 0.5); });
      s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%", justifyContent: "center" } }, svg, ctrl, s.h("div", { class: "cols3", style: { gap: "16px" } }, c1, c2, c3)));
      s.show(svg, "up"); s.sfx.whoosh();
      s.step(async () => { K.tint(start, null); start = -12; K.tint(start, LIGHT); await stepTo(1, C); s.say("Von c nach cis: ein Halbton."); });
      s.step(async () => { await s.wait(200); await stepTo(2, BLUE); s.say("Von c nach d: ein Ganzton. Dazwischen liegt eine Taste."); });
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
      s.step(async () => { for (const [i, c] of [c1, c2, c3].entries()) { s.sfx.count(i); s.show(c, "up"); await s.wait(200); } });
    },
  });

  /* 3 ---------------------------------------------------------------- */
  SLIDES.push({
    title: "Halbtöne ohne schwarze Taste",
    say: "Zwischen e und f und zwischen h und c gibt es keine schwarze Taste. Dort liegen nur Halbtöne.",
    build(s) {
      const Q = seq(s);
      const svg = s.svg(620, 380);
      const K = kb(s, 10, 120, -12, 0, 600, 250);
      svg.append(K.g);
      K.whites.forEach(n => K.label(n, WN[pc(n)], { fs: 26 }));
      const W = K.whites, arcsEl = [];
      for (let i = 0; i < 7; i++) {
        const half = W[i + 1] - W[i] === 1;
        const a = arc(s, K, W[i], W[i + 1], 110, half ? "halb" : "ganz", half ? RED : BLUE);
        a.setAttribute("class", "later"); svg.append(a); arcsEl.push(a);
      }
      const pair = async (a, b) => { const t = Q.start(); pno(s, a, 0.5); K.hit(a, RED, 420); await s.wait(450); if (!Q.ok(t)) return; pno(s, b, 0.7); K.hit(b, RED, 520); };
      const b1 = btn(s, "▶ e – f", () => pair(-8, -7), true), b2 = btn(s, "▶ h – c", () => pair(-1, 0), true);
      const merk = s.h("div", { class: "merk later" }, "Von ", s.h("b", null, "e nach f"), " und von ", s.h("b", null, "h nach c"), " ist es nur ein Halbton. Alle anderen weißen Nachbarn: Ganzton.");
      const l1 = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"),
        s.h("p", { class: "small" }, "Auf dem Glockenspiel fehlt zwischen e und f und zwischen h und c das obere Plättchen. Auf der Gitarre liegen e und f nur einen Bund auseinander."));
      const right = s.h("div", { class: "stack", style: { gap: "14px" } }, s.h("p", { class: "h2" }, "Wo fehlt die schwarze Taste?"), s.h("div", { class: "row" }, b1, b2), merk, l1);
      s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "620px 1fr", gap: "24px", alignItems: "center", height: "100%" } }, svg, right));
      s.show(svg, "up"); s.sfx.whoosh();
      s.step(async () => {
        const t = Q.start();
        for (let i = 0; i < 7; i++) { if (!Q.ok(t) && !s.fast) return; s.show(arcsEl[i], "pop"); pno(s, W[i], 0.35); await s.wait(260); pno(s, W[i + 1], 0.35); await s.wait(300); }
        s.say("Ganz, ganz, halb, ganz, ganz, ganz, halb.");
      });
      s.step(async () => { [-8, -7, -1, 0].forEach(n => K.tint(n, "#fbd0c9")); s.sfx.ding(); await pair(-8, -7); await s.wait(500); await pair(-1, 0); });
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
      s.step(async () => { s.sfx.pop(); await s.show(l1, "up"); });
    },
  });

  /* 4 ---------------------------------------------------------------- */
  SLIDES.push({
    title: "Das Kreuz ♯ – einen Halbton höher",
    say: "Ein Kreuz vor der Note macht sie einen Halbton höher. An den Namen hängen wir is an.",
    build(s) {
      const Q = seq(s);
      const svg = s.svg(520, 430), G = 18;
      const Y = staff(s, svg, 20, 500, 50, G);
      svg.append(clef(s, 60, 50 + 3 * G, G));
      const noteG = s.el("g"), arcG = s.el("g");
      svg.append(noteG);
      const K = kb(s, 20, 260, -12, 0, 480, 160);
      svg.append(K.g, arcG);
      K.whites.forEach(n => K.label(n, WN[pc(n)]));
      const DIA = { 0: 0, 2: 1, 4: 2, 5: 3, 7: 4, 9: 5, 11: 6 };
      const draw = (base, sharp) => {
        const d = DIA[pc(base)], y = Y(d);
        noteG.replaceChildren(nhead(s, 300, y, d, G));
        if (sharp) { const a = acc(s, 262, y, "#", G, C); noteG.append(a); s.show(a, "pop"); }
      };
      const demo = async (base, nm) => {
        const t = Q.start(); arcG.replaceChildren(); draw(base - 12, false); cap.textContent = WN[pc(base)];
        pno(s, base - 12, 0.5); K.hit(base - 12, LIGHT, 450); await s.wait(600); if (!Q.ok(t)) return;
        draw(base - 12, true); s.sfx.snap(); arcG.append(arc(s, K, base - 12, base - 11, 252, "+½", C));
        pno(s, base - 11, 0.8); K.hit(base - 11, C, 700); cap.textContent = WN[pc(base)] + " → " + nm;
      };
      draw(-7, false);
      const cap = s.h("span", { class: "big", style: { color: C } }, "f");
      const rule = s.h("p", { class: "t later" }, "Name + ", s.h("b", { class: "hl" }, "is"), " – tippe und hör den Unterschied:");
      const pairs = [[0, "cis"], [2, "dis"], [5, "fis"], [7, "gis"], [9, "ais"]];
      const grid = s.h("div", { class: "row later", style: { gap: "10px" } }, pairs.map(([b, nm]) => btn(s, WN[b] + " → " + nm, () => demo(b, nm))));
      const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"),
        s.h("p", { class: "small" }, "Die Sängerin sagt: „Einen halben Ton höher, bitte!“ Dann rutscht jede Note eine Taste nach rechts – oft auf eine schwarze."));
      const right = s.h("div", { class: "stack", style: { gap: "14px" } },
        s.h("div", { class: "row", style: { flexWrap: "nowrap", alignItems: "baseline" } }, s.h("p", { class: "h2" }, "Du hörst:"), cap), rule, grid,
        s.h("div", { class: "merk later" }, "Das ", s.h("b", null, "Kreuz ♯"), " erhöht einen Ton um einen Halbton: f wird zu ", s.h("b", null, "fis"), "."), life);
      s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "520px 1fr", gap: "30px", alignItems: "center", height: "100%" } }, svg, right));
      s.show(svg, "up"); s.sfx.whoosh();
      s.step(async () => { await demo(5, "fis"); s.say("Aus f wird fis."); });
      s.step(async () => { s.show(rule, "up"); await s.show(grid, "up"); s.sfx.pop(); });
      s.step(async () => { s.sfx.ding(); await s.show(right.children[3], "up"); });
      s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
    },
  });

  /* 5 ---------------------------------------------------------------- */
  SLIDES.push({
    title: "Das b ♭ – einen Halbton tiefer",
    say: "Ein b vor der Note macht sie einen Halbton tiefer. An den Namen hängen wir es an.",
    build(s) {
      const Q = seq(s);
      const svg = s.svg(520, 430), G = 18;
      const Y = staff(s, svg, 20, 500, 50, G);
      svg.append(clef(s, 60, 50 + 3 * G, G));
      const noteG = s.el("g"), arcG = s.el("g");
      svg.append(noteG);
      const K = kb(s, 20, 260, -12, 0, 480, 160);
      svg.append(K.g, arcG);
      K.whites.forEach(n => K.label(n, WN[pc(n)]));
      const DIA = { 0: 0, 2: 1, 4: 2, 5: 3, 7: 4, 9: 5, 11: 6 };
      const draw = (base, flat) => {
        const d = DIA[pc(base)], y = Y(d);
        noteG.replaceChildren(nhead(s, 300, y, d, G));
        if (flat) { const a = acc(s, 266, y, "b", G, C); noteG.append(a); s.show(a, "pop"); }
      };
      const cap = s.h("span", { class: "big", style: { color: C } }, "e");
      const demo = async (base, nm) => {
        const t = Q.start(), n = base - 12; arcG.replaceChildren(); draw(n, false); cap.textContent = WN[pc(base)];
        pno(s, n, 0.5); K.hit(n, LIGHT, 450); await s.wait(600); if (!Q.ok(t)) return;
        draw(n, true); s.sfx.snap(); arcG.append(arc(s, K, n, n - 1, 252, "−½", C));
        pno(s, n - 1, 0.8); K.hit(n - 1, C, 700); cap.textContent = WN[pc(base)] + " → " + nm;
      };
      draw(-8, false);
      const rule = s.h("p", { class: "t later" }, "Name + ", s.h("b", { class: "hl" }, "es"), ". Ausnahmen in Rot:");
      const pairs = [[2, "des"], [7, "ges"], [4, "es"], [9, "as"], [11, "b"]];
      const grid = s.h("div", { class: "row later", style: { gap: "10px" } }, pairs.map(([b, nm], i) => {
        const x = btn(s, WN[b] + " → " + nm, () => demo(b, nm)); if (i > 1) { x.style.borderColor = RED; x.style.color = RED; } return x;
      }));
      const merk = s.h("div", { class: "merk later" }, "Das ", s.h("b", null, "b ♭"), " erniedrigt einen Ton um einen Halbton: e wird zu ", s.h("b", null, "es"), ", h wird zu ", s.h("b", null, "b"), ".");
      const say = (txt, lang) => s.speak(txt, { lang });
      const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag · Englisch"),
        s.h("p", { class: "small" }, "Stimmgeräte und Apps zeigen oft englische Namen: unser ", s.h("b", null, "h"), " heißt dort ", s.h("b", null, "B"), ", unser ", s.h("b", null, "b"), " heißt ", s.h("b", null, "B♭"), " („B flat“)."),
        s.h("div", { class: "row", style: { gap: "10px", marginTop: "8px" } }, btn(s, "🔊 h = B", () => { pno(s, -1); say("B", "en-GB"); }), btn(s, "🔊 b = B flat", () => { pno(s, -2); say("B flat", "en-GB"); })));
      const right = s.h("div", { class: "stack", style: { gap: "12px" } },
        s.h("div", { class: "row", style: { flexWrap: "nowrap", alignItems: "baseline" } }, s.h("p", { class: "h2" }, "Du hörst:"), cap), rule, grid, merk, life);
      s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "520px 1fr", gap: "30px", alignItems: "center", height: "100%" } }, svg, right));
      s.show(svg, "up"); s.sfx.whoosh();
      s.step(async () => { await demo(4, "es"); s.say("Aus e wird es."); });
      s.step(async () => { s.show(rule, "up"); await s.show(grid, "up"); s.sfx.pop(); s.say("Achtung: es, as und b sind Ausnahmen."); });
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
      s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
    },
  });

  /* 6 ---------------------------------------------------------------- */
  SLIDES.push({
    title: "Das Auflösungszeichen ♮",
    say: "Ein Vorzeichen gilt bis zum Taktstrich. Das Auflösungszeichen hebt es vorher schon auf.",
    build(s) {
      const Q = seq(s);
      const svg = s.svg(1100, 250), G = 20;
      const Y = staff(s, svg, 30, 1070, 50, G);
      svg.append(clef(s, 76, 50 + 3 * G, G));
      svg.append(s.el("line", { x1: 720, x2: 720, y1: 50, y2: 130, stroke: INK, "stroke-width": 2.4 }));
      svg.append(s.el("line", { x1: 1056, x2: 1056, y1: 50, y2: 130, stroke: INK, "stroke-width": 2 }), s.el("rect", { x: 1062, y: 50, width: 8, height: 80, fill: INK }));
      const y = Y(3);
      const spec = [[260, "#", "fis", -7, "Kreuz: fis"], [420, null, "fis", -7, "gilt noch!"], [580, "n", "f", -8, "aufgelöst: f"], [880, null, "f", -8, "neuer Takt: f"]];
      const items = spec.map(([x, a, nm, n, why]) => {
        const g = s.el("g", { class: "later" });
        if (a) g.append(acc(s, x - 36, y, a, G, a === "n" ? GREEN : C));
        g.append(nhead(s, x, y, 3, G));
        g.append(s.el("text", { x, y: 190, "text-anchor": "middle", "font-size": 30, "font-weight": 800, fill: nm === "fis" ? C : GREEN, text: nm }));
        g.append(s.el("text", { x, y: 230, "text-anchor": "middle", "font-size": 20, fill: PENCIL, text: why }));
        svg.append(g); return { g, n };
      });
      const playAll = async () => { const t = Q.start(); for (const it of items) { if (!Q.ok(t)) return; pno(s, it.n, 0.5); flashG(it.g); await s.wait(520); } };
      const flashG = g => s.tween({ from: 0.25, to: 1, dur: 450, ease: "out", update: v => g.setAttribute("opacity", v) });
      const play = btn(s, "▶ Alle vier Noten", playAll, true);
      const merk = s.h("div", { class: "merk later", style: { flex: 1 } }, "Ein Vorzeichen gilt ", s.h("b", null, "bis zum Taktstrich"), ". Das ", s.h("b", null, "Auflösungszeichen ♮"), " macht den Ton wieder zum Stammton.");
      const c1 = exCard(s, "Beispiel 1 · ♮ nach ♯", "♮", "fis wird wieder zu f: einen Halbton zurück nach unten.", () => { pno(s, -6, 0.5); pno(s, -7, 0.7, 0.55); });
      const c2 = exCard(s, "Beispiel 2 · ♮ nach ♭", "♮", "b wird wieder zu h: einen Halbton zurück nach oben.", () => { pno(s, -2, 0.5); pno(s, -1, 0.7, 0.55); });
      const c3 = exCard(s, "Im Alltag", "🧽", "Wie ein Schwamm an der Tafel: ♮ wischt das Vorzeichen weg.", () => s.sfx.swoosh(), true);
      s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%", justifyContent: "center" } }, svg,
        s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "18px" } }, play, merk), s.h("div", { class: "cols3", style: { gap: "16px" } }, c1, c2, c3)));
      s.show(svg, "up"); s.sfx.whoosh();
      items.forEach((it, i) => s.step(async () => { pno(s, it.n, 0.6); await s.show(it.g, "pop"); s.say(["Mit Kreuz: fis.", "Im selben Takt bleibt es fis.", "Das Auflösungszeichen macht wieder f daraus.", "Nach dem Taktstrich ist es sowieso wieder f."][i]); }));
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
      s.step(async () => { for (const [i, c] of [c1, c2, c3].entries()) { s.sfx.count(i); s.show(c, "up"); await s.wait(200); } });
    },
  });

  /* staircase of a scale: S = semitones above the start, names, colours for "halb" steps */
  function stairs(s, svg, S, names, { x0 = 60, sw = 122, base = 390, u = 24, col = C } = {}) {
    const st = [], iv = [];
    S.forEach((v, i) => {
      const x = x0 + i * (sw + 6), top = base - 40 - v * u;
      const g = s.el("g", { class: "later", style: { cursor: "pointer" } });
      const r = s.el("rect", { x, y: top, width: sw, height: base - top, rx: 8, fill: col, opacity: 0.88 });
      g.append(r, s.el("text", { x: x + sw / 2, y: top + 36, "text-anchor": "middle", "font-size": 30, "font-weight": 800, fill: "#fff", text: names[i] }));
      svg.append(g); st.push({ g, r, x, top, cx: x + sw / 2 });
      if (i) {
        const half = v - S[i - 1] === 1;
        const t = s.el("text", { x: x + sw / 2, y: top - 12, "text-anchor": "middle", "font-size": 22, "font-weight": 800, fill: half ? RED : BLUE, text: half ? "halb" : "ganz", class: "later" });
        svg.append(t); iv.push({ t, half, i });
      }
    });
    const ball = s.el("circle", { cx: st[0].cx, cy: st[0].top - 50, r: 15, fill: "#ffd94a", stroke: INK, "stroke-width": 2.5, class: "later" });
    svg.append(ball);
    const hop = async (i, ms = 260) => {
      const b = st[i], fx = +ball.getAttribute("cx"), fy = +ball.getAttribute("cy"), ty = b.top - 50;
      await s.tween({ from: 0, to: 1, dur: ms, ease: "linear", update: k => { ball.setAttribute("cx", fx + (b.cx - fx) * k); ball.setAttribute("cy", fy + (ty - fy) * k - Math.sin(Math.PI * k) * 40); } });
    };
    return { st, iv, ball, hop };
  }

  /* 7 ---------------------------------------------------------------- */
  SLIDES.push({
    title: "Die Dur-Treppe",
    say: "Eine Dur-Tonleiter ist wie eine Treppe: ganz, ganz, halb, ganz, ganz, ganz, halb.",
    build(s) {
      const Q = seq(s);
      const svg = s.svg(1100, 400);
      const S = [0, 2, 4, 5, 7, 9, 11, 12];
      const T = stairs(s, svg, S, ["c", "d", "e", "f", "g", "a", "h", "c"]);
      T.st.forEach((b, i) => b.g.addEventListener("pointerdown", e => { e.preventDefault(); s.sfx.unlock(); pno(s, S[i] - 12); s.tween({ from: .55, to: .88, dur: 350, update: v => b.r.setAttribute("opacity", v) }); }));
      const run = async dir => {
        const t = Q.start(); s.show(T.ball, "fade");
        const order = dir > 0 ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0];
        for (const i of order) { if (!Q.ok(t)) return; pno(s, S[i] - 12, 0.45); await T.hop(i); await s.wait(120); }
      };
      const pat = ["G", "G", "H", "G", "G", "G", "H"].map(x => s.h("span", { class: "chip later", style: { fontSize: "26px", padding: "8px 16px", background: x === "H" ? "#fbd0c9" : "#dfe8fb", color: x === "H" ? RED : BLUE } }, x));
      const row = s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "12px" } }, btn(s, "▶ hinauf", () => run(1), true), btn(s, "▶ hinab", () => run(-1)),
        s.h("div", { class: "row", style: { gap: "8px", marginLeft: "18px", flexWrap: "nowrap" } }, pat));
      const merk = s.h("div", { class: "merk later" }, "Dur-Tonleiter: ", s.h("b", null, "Ganz – Ganz – Halb – Ganz – Ganz – Ganz – Halb"), ". Die Halbtöne liegen zwischen der 3. und 4. und zwischen der 7. und 8. Stufe.");
      s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%", justifyContent: "center" } }, svg, row, merk));
      s.step(async () => {
        s.show(T.ball, "fade");
        for (let i = 0; i < 8; i++) { s.show(T.st[i].g, "up"); pno(s, S[i] - 12, 0.45); await T.hop(i, 200); await s.wait(140); }
        s.say("Acht Stufen von c bis c.");
      });
      s.step(async () => { for (const v of T.iv) { s.show(v.t, "pop"); v.half ? s.sfx.note(v.i, 0.2) : s.sfx.tick(); await s.wait(220); } s.say("Zwei Stufen sind nur halb so hoch."); });
      s.step(async () => { for (const [i, p] of pat.entries()) { s.show(p, "pop"); s.sfx.count(i); await s.wait(130); } await s.show(merk, "up"); s.sfx.ding(); });
    },
  });

  /* 8 ---------------------------------------------------------------- */
  SLIDES.push({
    title: "C-Dur im Notensystem",
    say: "So sieht die C-Dur-Tonleiter in Noten aus. Tippe auf eine Note, dann hörst du sie.",
    build(s) {
      const Q = seq(s);
      const svg = s.svg(1100, 262), G = 18;
      const Y = staff(s, svg, 30, 1070, 50, G);
      svg.append(clef(s, 74, 50 + 3 * G, G));
      const NN = [-12, -10, -8, -7, -5, -3, -1, 0], names = ["c", "d", "e", "f", "g", "a", "h", "c"];
      const X = i => 210 + i * 112;
      const notes = NN.map((n, i) => {
        const g = s.el("g", { class: "later", style: { cursor: "pointer" } });
        g.append(s.el("rect", { x: X(i) - 40, y: 20, width: 80, height: 196, fill: "transparent" }), nhead(s, X(i), Y(i), i, G));
        g.append(s.el("text", { x: X(i), y: 200, "text-anchor": "middle", "font-size": 28, "font-weight": 800, fill: C, text: names[i] }));
        g.addEventListener("pointerdown", e => { e.preventDefault(); s.sfx.unlock(); pno(s, n); glow(i); });
        svg.append(g); return g;
      });
      const hi = s.el("rect", { x: 0, y: 24, width: 70, height: 192, rx: 12, fill: "#ffd94a", opacity: 0 });
      svg.insertBefore(hi, svg.firstChild);
      const glow = i => { hi.setAttribute("x", X(i) - 35); s.tween({ from: .7, to: 0, dur: 500, update: v => hi.setAttribute("opacity", v) }); };
      const halves = [[2, 3], [6, 7]].map(([a, b]) => {
        const g = s.el("g", { class: "later" }), m = (X(a) + X(b)) / 2;
        g.append(s.el("path", { d: `M${X(a)} 214 L${m} 230 L${X(b)} 214`, fill: "none", stroke: RED, "stroke-width": 4, "stroke-linejoin": "round" }));
        g.append(s.el("text", { x: m, y: 248, "text-anchor": "middle", "font-size": 19, "font-weight": 800, fill: RED, text: "halb" }));
        svg.append(g); return g;
      });
      const playUp = async () => { const t = Q.start(); for (let i = 0; i < 8; i++) { if (!Q.ok(t)) return; pno(s, NN[i], 0.45); glow(i); await s.wait(380); } };
      const c1 = exCard(s, "Beispiel 1 · Klavier", "🎹", "C-Dur spielst du nur mit weißen Tasten – von c bis c.", playUp);
      const c2 = exCard(s, "Beispiel 2 · Singen", "🎤", "Singe langsam hinauf: Jeder Ton liegt eine Stufe höher.", () => NN.forEach((n, i) => s.sfx.tone(hz(n - 12), 0.6, "sine", 0.22, i * 0.6)));
      const c3 = exCard(s, "Im Alltag", "⚽", "Musiker spielen Tonleitern zum Aufwärmen – wie Fußballer vor dem Spiel.", () => NN.concat(NN.slice(0, 7).reverse()).forEach((n, i) => pno(s, n, 0.25, i * 0.16, 0.16)), true);
      const merk = s.h("div", { class: "merk later" }, "Jede Note steht eine Stufe höher: abwechselnd ", s.h("b", null, "auf einer Linie"), " und ", s.h("b", null, "in einem Zwischenraum"), ". Das tiefe c bekommt eine Hilfslinie.");
      s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%", justifyContent: "center" } }, svg, merk, s.h("div", { class: "cols3", style: { gap: "16px" } }, c1, c2, c3)));
      s.sfx.whoosh();
      s.step(async () => { for (let i = 0; i < 8; i++) { s.show(notes[i], "pop"); pno(s, NN[i], 0.4); await s.wait(260); } s.say("Linie, Zwischenraum, Linie und so weiter."); });
      s.step(async () => { s.show(halves, "pop"); s.sfx.ding(); pno(s, -8, 0.4); pno(s, -7, 0.4, 0.4); pno(s, -1, 0.4, 1); pno(s, 0, 0.5, 1.4); await s.show(merk, "up"); });
      s.step(async () => { for (const [i, c] of [c1, c2, c3].entries()) { s.sfx.count(i); s.show(c, "up"); await s.wait(200); } });
    },
  });

  /* 9 ---------------------------------------------------------------- */
  SLIDES.push({
    title: "G-Dur braucht ein fis",
    say: "Wir bauen die Dur-Treppe ab g. Ganz, ganz, halb, ganz, ganz – und dann brauchen wir einen Ganzton. Mit f klappt das nicht!",
    build(s) {
      const Q = seq(s);
      const svg = s.svg(1100, 272);
      const K = kb(s, 40, 82, -5, 7, 1020, 186);
      const arcs = s.el("g");
      svg.append(K.g, arcs);
      K.whites.forEach(n => K.label(n, WN[pc(n)]));
      const lf = K.label(6, "fis", { later: true, fs: 20 });
      const first = [[-5, -3, "ganz"], [-3, -1, "ganz"], [-1, 0, "halb"], [0, 2, "ganz"], [2, 4, "ganz"]];
      const addArc = (a, b, txt, col) => { const g = arc(s, K, a, b, 74, txt, col); arcs.append(g); s.show(g, "pop"); return g; };
      let wrong = [];
      const playScale = async (ns, col) => { const t = Q.start(); for (const n of ns) { if (!Q.ok(t)) return; pno(s, n, 0.45); K.hit(n, col, 360); await s.wait(400); } };
      const withF = [-5, -3, -1, 0, 2, 4, 5, 7], withFis = [-5, -3, -1, 0, 2, 4, 6, 7];
      const b1 = btn(s, "▶ mit f (schief)", () => playScale(withF, RED));
      const b2 = btn(s, "▶ mit fis (richtig)", () => playScale(withFis, GREEN), true);
      const mini = s.svg(250, 136), G = 14;
      const Y = staff(s, mini, 6, 244, 34, G);
      mini.append(clef(s, 36, 34 + 3 * G, G));
      const ks = acc(s, 80, Y(10), "#", G, C); ks.setAttribute("class", "later"); mini.append(ks);
      mini.append(s.el("text", { x: 170, y: 22, "text-anchor": "middle", "font-size": 19, "font-weight": 700, fill: C, text: "G-Dur" }));
      const miniBox = s.h("div", { class: "card later", style: { padding: "6px 8px" } }, mini);
      const merk = s.h("div", { class: "merk later", style: { flex: 1 } }, "Das Muster erzwingt das ", s.h("b", null, "fis"), ". Das Kreuz steht deshalb gleich am Anfang jeder Zeile und gilt für ", s.h("b", null, "jedes f"), ".");
      const c1 = exCard(s, "Beispiel 1 · G-Dur", "♯", "1 Kreuz: fis", () => withFis.forEach((n, i) => pno(s, n, 0.35, i * 0.3)));
      const c2 = exCard(s, "Beispiel 2 · D-Dur", "♯♯", "2 Kreuze: fis und cis", () => [-10, -8, -6, -5, -3, -1, 1, 2].forEach((n, i) => pno(s, n, 0.35, i * 0.3)));
      const c3 = exCard(s, "Beispiel 3 · F-Dur", "♭", "1 b: aus h wird b", () => [-7, -5, -3, -2, 0, 2, 4, 5].forEach((n, i) => pno(s, n, 0.35, i * 0.3)));
      s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%", justifyContent: "center" } }, svg,
        s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "16px" } }, s.h("div", { class: "stack", style: { gap: "10px" } }, b1, b2), miniBox, merk),
        s.h("div", { class: "cols3", style: { gap: "16px" } }, c1, c2, c3)));
      s.show(svg, "up"); s.sfx.whoosh();
      s.step(async () => {
        for (const [a, b, t] of first) { addArc(a, b, t, t === "halb" ? RED : BLUE); pno(s, a, 0.3); await s.wait(230); pno(s, b, 0.3); await s.wait(260); }
        s.say("Ganz, ganz, halb, ganz, ganz.");
      });
      s.step(async () => {
        wrong = [addArc(4, 5, "nur halb!", RED), addArc(5, 7, "ganz", BLUE)];
        K.tint(5, "#fbd0c9"); s.sfx.error(); await s.wait(400); await playScale(withF, RED);
        s.say("Von e nach f ist nur ein Halbton. Das klingt schief.");
      });
      s.step(async () => {
        wrong.forEach(g => g.remove()); K.tint(5, null); K.tint(6, GREEN); s.show(lf, "pop");
        addArc(4, 6, "ganz", BLUE); addArc(6, 7, "halb", RED); s.sfx.success(); await s.wait(500); await playScale(withFis, GREEN);
        s.say("Mit fis passt das Muster. Das ist G-Dur.");
      });
      s.step(async () => { s.show(miniBox, "pop"); await s.show(ks, "pop"); s.sfx.snap(); s.show(merk, "up"); s.sfx.ding(); });
      s.step(async () => { for (const [i, c] of [c1, c2, c3].entries()) { s.sfx.count(i); s.show(c, "up"); await s.wait(200); } });
    },
  });

  /* 10 --------------------------------------------------------------- */
  SLIDES.push({
    title: "Moll: die andere Treppe",
    say: "Die a-Moll-Tonleiter benutzt dieselben weißen Tasten wie C-Dur. Aber sie beginnt bei a, und die Halbtöne liegen an anderen Stellen.",
    build(s) {
      const Q = seq(s);
      const svg = s.svg(1100, 400);
      const S = [0, 2, 3, 5, 7, 8, 10, 12], N = S.map(v => v - 3);
      const T = stairs(s, svg, S, ["a", "h", "c", "d", "e", "f", "g", "a"], { col: VIOLET });
      T.st.forEach((b, i) => b.g.addEventListener("pointerdown", e => { e.preventDefault(); s.sfx.unlock(); pno(s, N[i] - 12); s.tween({ from: .55, to: .88, dur: 350, update: v => b.r.setAttribute("opacity", v) }); }));
      const runMoll = async () => { const t = Q.start(); s.show(T.ball, "fade"); for (let i = 0; i < 8; i++) { if (!Q.ok(t)) return; pno(s, N[i] - 12, 0.45); await T.hop(i); await s.wait(120); } };
      const runDur = async () => { const t = Q.start(); for (const [i, n] of [0, 2, 4, 5, 7, 9, 11, 12].entries()) { if (!Q.ok(t)) return; pno(s, n - 12, 0.45); await s.wait(380); } };
      const pat = ["G", "H", "G", "G", "H", "G", "G"].map(x => s.h("span", { class: "chip later", style: { fontSize: "26px", padding: "8px 16px", background: x === "H" ? "#fbd0c9" : "#dfe8fb", color: x === "H" ? RED : BLUE } }, x));
      const row = s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "12px" } }, btn(s, "▶ a-Moll", runMoll, true), btn(s, "▶ C-Dur", runDur),
        s.h("div", { class: "row", style: { gap: "8px", marginLeft: "18px", flexWrap: "nowrap" } }, pat));
      const merk = s.h("div", { class: "merk later" }, "Moll-Tonleiter: ", s.h("b", null, "Ganz – Halb – Ganz – Ganz – Halb – Ganz – Ganz"), ". Moll klingt oft ernster, dunkler oder trauriger als Dur.");
      s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%", justifyContent: "center" } }, svg, row, merk));
      s.step(async () => {
        s.show(T.ball, "fade");
        for (let i = 0; i < 8; i++) { s.show(T.st[i].g, "up"); pno(s, N[i] - 12, 0.45); await T.hop(i, 200); await s.wait(140); }
        s.say("Acht Stufen von a bis a.");
      });
      s.step(async () => { for (const v of T.iv) { s.show(v.t, "pop"); v.half ? s.sfx.note(v.i, 0.2) : s.sfx.tick(); await s.wait(220); } s.say("Die Halbtöne liegen jetzt zwischen der zweiten und dritten und der fünften und sechsten Stufe."); });
      s.step(async () => { for (const [i, p] of pat.entries()) { s.show(p, "pop"); s.sfx.count(i); await s.wait(130); } await s.show(merk, "up"); s.sfx.ding(); });
    },
  });

  /* 11 --------------------------------------------------------------- */
  SLIDES.push({
    title: "Eine Melodie – Dur und Moll",
    say: "Hier ist eine kleine Melodie. Hör sie zuerst in Dur, dann in Moll. Nur drei Töne werden tiefer.",
    build(s) {
      const Q = seq(s);
      const DUR = [0, 2, 4, 5, 7, 9, 11, 12], MOLL = [0, 2, 3, 5, 7, 8, 10, 12];
      // own melody: [scale degree 1–8, beats]
      const MEL = [[1, 1], [3, 1], [5, 1], [3, 1], [4, .5], [3, .5], [2, 1], [5, 2], [6, 1], [5, .5], [4, .5], [3, 1], [2, 1], [1, 2]];
      const BARS = [[0, 4, 7], [7, 11, 14], [5, 9, 12], [0, 4, 7]], BARSM = [[0, 3, 7], [7, 10, 14], [5, 8, 12], [0, 3, 7]];
      const roll = s.svg(690, 330), bx = 56, pb = 44, rowH = 34, yOf = d => 300 - (d - 1) * rowH;
      for (let d = 1; d <= 7; d++) roll.append(s.el("line", { x1: bx - 6, x2: 680, y1: yOf(d), y2: yOf(d), stroke: "#e2d6cc", "stroke-width": 1.5 }));
      [4, 8, 12].forEach(b => roll.append(s.el("line", { x1: bx + b * pb, x2: bx + b * pb, y1: 70, y2: 316, stroke: "#c8b8aa", "stroke-width": 2, "stroke-dasharray": "5 5" })));
      const nameT = [];
      for (let d = 1; d <= 7; d++) { const t = s.el("text", { x: 34, y: yOf(d) + 7, "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: PENCIL, text: "cdefgah"[d - 1] }); roll.append(t); nameT.push(t); }
      let b = 0;
      const bars = MEL.map(([d, l]) => { const r = s.el("rect", { x: bx + b * pb + 2, y: yOf(d) - 13, width: l * pb - 4, height: 26, rx: 8, fill: C }); roll.append(r); const o = { r, d, l, b }; b += l; return o; });
      const head = s.el("line", { x1: bx, x2: bx, y1: 60, y2: 318, stroke: INK, "stroke-width": 3, opacity: 0 });
      roll.append(head);
      let mode = "dur";
      const setMode = m => {
        mode = m; const minor = m === "moll";
        bars.forEach(o => o.r.setAttribute("fill", minor ? ([3, 6, 7].includes(o.d) ? RED : VIOLET) : C));
        nameT.forEach((t, i) => { t.textContent = minor ? ["c", "d", "es", "f", "g", "as", "b"][i] : "cdefgah"[i]; t.setAttribute("fill", minor && [2, 5, 6].includes(i) ? RED : PENCIL); });
        s.tween({ from: minor ? 1 : -1, to: minor ? -1 : 1, dur: 500, ease: "out", update: k => mouth.setAttribute("d", `M70 146 Q110 ${146 + 34 * k} 150 146`) });
        sky.setAttribute("fill", minor ? "#d9d4f2" : "#ffe9a8"); lab.textContent = minor ? "c-Moll" : "C-Dur";
      };
      const play = async m => {
        setMode(m); const t = Q.start(), sc = m === "moll" ? MOLL : DUR, ch = m === "moll" ? BARSM : BARS, spb = 0.42;
        ch.forEach((c, i) => { chord(s, c.map(x => x - 24), spb * 4 * 0.95, i * 4 * spb, 0.07); pno(s, c[0] - 36, spb * 4, i * 4 * spb, 0.16); });
        MEL.forEach(([d, l], i) => pno(s, sc[d - 1] - 12, l * spb * 0.95, bars[i].b * spb, 0.22));
        head.setAttribute("opacity", 1);
        await s.tween({ from: 0, to: 14, dur: 14 * spb * 1000, ease: "linear", update: v => { if (Q.ok(t)) head.setAttribute("x1", bx + v * pb), head.setAttribute("x2", bx + v * pb); } });
        if (Q.ok(t)) head.setAttribute("opacity", 0);
      };
      const face = s.svg(220, 220);
      const sky = s.el("circle", { cx: 110, cy: 110, r: 104, fill: "#ffe9a8" });
      const mouth = s.el("path", { d: "M70 146 Q110 180 150 146", fill: "none", stroke: INK, "stroke-width": 7, "stroke-linecap": "round" });
      face.append(sky, s.el("circle", { cx: 110, cy: 110, r: 80, fill: "#fff", stroke: INK, "stroke-width": 4 }), s.el("circle", { cx: 82, cy: 96, r: 9, fill: INK }), s.el("circle", { cx: 138, cy: 96, r: 9, fill: INK }), mouth);
      const lab = s.h("p", { class: "h2", style: { textAlign: "center" } }, "C-Dur");
      const bD = btn(s, "▶ Dur", () => play("dur"), true), bM = btn(s, "▶ Moll", () => play("moll"));
      const right = s.h("div", { class: "stack", style: { alignItems: "center", gap: "10px" } }, face, lab, s.h("div", { class: "row", style: { justifyContent: "center" } }, bD, bM));
      const film = (lab2, emo, txt, m, ch) => exCard(s, lab2, emo, txt, () => ch.forEach((c, i) => chord(s, c.map(x => x - 12), 0.8, i * 0.75, 0.1)), true);
      const c1 = film("Im Film · Geburtstag", "🎂", "Fröhliche Szenen klingen meistens nach Dur.", "dur", [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]]);
      const c2 = film("Im Film · Abschied", "👋", "Traurige Szenen klingen oft nach Moll.", "moll", [[0, 3, 7], [5, 8, 12], [-2, 2, 5], [0, 3, 7]]);
      const c3 = film("Im Film · Gruselig", "🕯️", "Spannung im Dunkeln: auch hier oft Moll.", "moll", [[0, 3, 7], [1, 5, 8], [0, 3, 7], [-1, 2, 5]]);
      s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%", justifyContent: "center" } },
        s.h("div", { class: "cols", style: { gridTemplateColumns: "690px 1fr", gap: "20px", alignItems: "center" } }, roll, right),
        s.h("div", { class: "cols3", style: { gap: "16px" } }, c1, c2, c3)));
      s.show(roll, "up"); s.sfx.whoosh();
      s.step(async () => { play("dur"); s.say("In Dur klingt sie fröhlich."); });
      s.step(async () => { play("moll"); s.say("In Moll klingt dieselbe Melodie traurig. Nur e, a und h sind jetzt tiefer: es, as und b."); });
      s.step(async () => { for (const [i, c] of [c1, c2, c3].entries()) { s.sfx.count(i); s.show(c, "up"); await s.wait(200); } });
    },
  });

  /* 12 --------------------------------------------------------------- */
  SLIDES.push({
    title: "Pentatonik: nur schwarze Tasten",
    say: "Spiel nur auf den schwarzen Tasten. Das sind fünf Töne, und egal was du tippst, es klingt schön.",
    build(s) {
      const Q = seq(s);
      const svg = s.svg(1100, 272);
      const fx = s.el("g", { style: { pointerEvents: "none" } });
      const COL = { 6: "#e8590c", 8: "#d6336c", 10: "#7b4fd6", 1: "#1d5bd0", 3: "#138a5a" };
      const spark = n => {
        const k = K.keys[n]; if (!k) return;
        const c = s.el("circle", { cx: K.x0 + k.cx, cy: 72, r: 12, fill: COL[pc(n)] }); fx.append(c);
        s.tween({ from: 0, to: 1, dur: 900, ease: "out", update: v => { c.setAttribute("cy", 72 - v * 62); c.setAttribute("opacity", 1 - v); c.setAttribute("r", 12 + v * 8); } }).then(() => c.remove());
      };
      const hint = s.el("text", { x: 550, y: 34, "text-anchor": "middle", "font-size": 24, "font-weight": 800, fill: RED, opacity: 0, text: "Nur die schwarzen Tasten!" });
      const tap = n => { if (!isB(n)) { s.sfx.tick(); s.tween({ from: 1, to: 0, dur: 1200, ease: "in", update: v => hint.setAttribute("opacity", v) }); return; } pno(s, n, 0.9); K.hit(n, "#ffd94a", 300); spark(n); };
      const K = kb(s, 40, 62, -7, 16, 1020, 206, { bwf: 0.74, onKey: tap });
      svg.append(K.g, fx, hint);
      const PEN = []; for (let n = -7; n <= 16; n++) if (isB(n)) PEN.push(n);
      K.whites.forEach(n => K.tint(n, "#eceff3"));
      PEN.forEach(n => { K.tint(n, COL[pc(n)]); K.label(n, { 6: "fis", 8: "gis", 10: "ais", 1: "cis", 3: "dis" }[pc(n)], { fs: 19 }); });
      let drone = false, nextT = 0, flip = 0;
      s.loop(t => { if (!drone || t < nextT) return; nextT = t + 0.75; pno(s, flip++ % 2 ? -23 : -30, 0.9, 0, 0.14); });
      const bDrone = btn(s, "Begleitung an", () => { drone = !drone; bDrone.textContent = drone ? "Begleitung aus" : "Begleitung an"; s.sfx.click(); });
      const improv = async () => {
        const t = Q.start(); let i = 4;
        for (let k = 0; k < 16; k++) {
          if (!Q.ok(t)) return;
          i = Math.max(0, Math.min(PEN.length - 1, i + [-2, -1, -1, 1, 1, 2][Math.floor(Math.random() * 6)]));
          tap(PEN[i]); await s.wait([250, 250, 500, 500, 750][Math.floor(Math.random() * 5)]);
        }
      };
      const bRand = btn(s, "▶ Zufallsmelodie", improv, true);
      const merk = s.h("div", { class: "merk later", style: { flex: 1 } }, s.h("b", null, "Pentatonik"), " (griechisch „penta“ = fünf): eine Tonleiter aus 5 Tönen ", s.h("b", null, "ohne Halbtonschritte"), ". Darum passt fast alles zusammen.");
      const c1 = exCard(s, "Im Alltag · Volksmusik", "🌏", "Viele alte Volkslieder aus aller Welt kommen mit fünf Tönen aus.", () => [-6, -4, -2, 1, -2, -4, -6].forEach((n, i) => pno(s, n, 0.4, i * 0.3)), true);
      const c2 = exCard(s, "Im Alltag · Klassenzimmer", "🎶", "Am Xylofon nimmt man oft f und h heraus. Mit c, d, e, g, a klingt alles gut.", () => [0, 2, 4, 7, 9, 7, 4, 2, 0].forEach((n, i) => bell(s, n, 0.6, i * 0.22)), true);
      const c3 = exCard(s, "Im Alltag · Windspiel", "🎐", "Viele Windspiele sind auf fünf Töne gestimmt – im Wind klingen sie nie schief.", () => { for (let i = 0; i < 7; i++) bell(s, [0, 2, 4, 7, 9][Math.floor(Math.random() * 5)] + 12, 1.6, i * 0.3 + Math.random() * 0.15, 0.1); }, true);
      s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%", justifyContent: "center" } }, svg,
        s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "16px" } }, s.h("div", { class: "stack", style: { gap: "10px" } }, bRand, bDrone), merk),
        s.h("div", { class: "cols3", style: { gap: "16px" } }, c1, c2, c3)));
      s.show(svg, "up"); s.sfx.whoosh();
      s.step(async () => { for (const n of PEN.slice(0, 5)) { tap(n); await s.wait(260); } s.say("fis, gis, ais, cis, dis."); });
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); improv(); });
      s.step(async () => { for (const [i, c] of [c1, c2, c3].entries()) { s.sfx.count(i); s.show(c, "up"); await s.wait(200); } });
    },
  });

  /* 13 --------------------------------------------------------------- */
  SLIDES.push({
    title: "Der Dreiklang C – E – G",
    say: "Nimm von der Tonleiter jeden zweiten Ton: c, e, g. Zusammen klingen sie als Dreiklang.",
    build(s) {
      const Q = seq(s);
      const svg = s.svg(600, 272);
      const K = kb(s, 10, 70, -12, 4, 580, 200);
      svg.append(K.g);
      K.whites.forEach(n => K.label(n, WN[pc(n)]));
      const jumps = [[-12, -8, "ohne d"], [-8, -5, "ohne f"]].map(([a, b, tx]) => { const g = arc(s, K, a, b, 62, tx, GREEN); g.setAttribute("class", "later"); svg.append(g); return g; });
      const st = s.svg(460, 238), G = 20;
      const Y = staff(s, st, 10, 450, 40, G);
      st.append(clef(s, 52, 40 + 3 * G, G));
      const snow = (x, ds, nm, col) => {
        const g = s.el("g", { class: "later" });
        ds.forEach(d => g.append(nhead(s, x, Y(d), d, G, { hollow: true, stem: false, color: col })));
        g.append(s.el("text", { x, y: 196, "text-anchor": "middle", "font-size": 24, "font-weight": 800, fill: col, text: nm }));
        st.append(g); return g;
      };
      const sC = snow(190, [0, 2, 4], "C-Dur", C), sA = snow(350, [5, 7, 9], "a-Moll", VIOLET);
      const cap = s.el("text", { x: 250, y: 228, "text-anchor": "middle", "font-size": 20, fill: PENCIL, text: "3 Noten übereinander – wie ein Schneemann", class: "later" });
      st.append(cap);
      const arp = async (ns, col) => { const t = Q.start(); for (const n of ns) { if (!Q.ok(t)) return; pno(s, n, 1.4, 0, 0.16); K.hit(n, col, 900); await s.wait(330); } };
      const all = (ns, col) => { Q.stop(); chord(s, ns, 1.6, 0, 0.13); ns.forEach(n => K.hit(n, col, 1100)); };
      const b1 = btn(s, "▶ nacheinander", () => arp([-12, -8, -5], C)), b2 = btn(s, "▶ zusammen", () => all([-12, -8, -5], C), true);
      const b3 = btn(s, "▶ a-Moll: a – c – e", () => all([-3, 0, 4], VIOLET)); b3.style.whiteSpace = "nowrap"; b3.style.flex = "none";
      const c1 = exCard(s, "Beispiel 1 · Gitarre", "🎸", "Ein Gitarren-Akkord: Dreiklangstöne auf mehreren Saiten zugleich.", () => [-24, -20, -17, -12, -8].forEach((n, i) => pno(s, n, 1.6, i * 0.04, 0.12)));
      const c2 = exCard(s, "Beispiel 2 · Chor", "👥", "Drei Gruppen singen c, e und g gleichzeitig.", () => [-12, -8, -5].forEach(n => s.sfx.tone(hz(n), 1.6, "sine", 0.12)));
      const c3 = exCard(s, "Im Alltag · Spieluhr", "🎁", "Viele Spieluhr-Melodien springen über die Töne eines Dreiklangs.", () => [0, 4, 7, 12, 7, 4, 0].forEach((n, i) => box(s, n + 12, i * 0.28)), true);
      const merk = s.h("div", { class: "merk later" }, "Ein ", s.h("b", null, "Dreiklang"), ": drei Töne, zwischen denen immer ein Ton übersprungen wird – ", s.h("b", null, "c (d) e (f) g"), ".");
      s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%", justifyContent: "center" } },
        s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "20px", alignItems: "center" } }, svg, s.h("div", { class: "stack", style: { gap: "8px" } }, st, s.h("div", { class: "row", style: { gap: "10px" } }, b1, b2))),
        s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "16px" } }, b3, merk),
        s.h("div", { class: "cols3", style: { gap: "16px" } }, c1, c2, c3)));
      s.show(svg, "up"); s.sfx.whoosh();
      s.step(async () => { s.show(jumps[0], "pop"); await arp([-12, -8, -5], C); s.show(jumps[1], "pop"); s.say("c, e, g: Wir springen immer über einen Ton."); });
      s.step(async () => { all([-12, -8, -5], C); s.show(sC, "pop"); await s.show(cap, "fade"); });
      s.step(async () => { all([-3, 0, 4], VIOLET); await s.show(sA, "pop"); s.sfx.ding(); await s.show(merk, "up"); s.say("a, c, e ist ein Moll-Dreiklang."); });
      s.step(async () => { for (const [i, c] of [c1, c2, c3].entries()) { s.sfx.count(i); s.show(c, "up"); await s.wait(200); } });
    },
  });

  /* 14 --------------------------------------------------------------- */
  SLIDES.push({
    title: "Im Alltag: Tonleitern überall",
    say: "Tonleitern und Töne begegnen dir jeden Tag. Tippe auf die Karten und hör genau hin.",
    build(s) {
      const card = (emo, ttl, txt, pic, btns) => s.h("div", { class: "life later", style: { display: "flex", flexDirection: "column", gap: "8px" } },
        s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "12px" } }, s.h("span", { style: { fontSize: "36px" } }, emo), s.h("p", { class: "h2" }, ttl)),
        s.h("p", { class: "small" }, txt), s.h("div", { class: "row", style: { flexWrap: "nowrap", justifyContent: "space-between" } }, pic, s.h("div", { class: "row", style: { gap: "10px", flexWrap: "nowrap" } }, btns)));
      // 1 doorbell
      const p1 = s.svg(150, 84), bellG = s.el("g");
      bellG.append(s.el("path", { d: "M75 8 C52 8 46 30 46 48 L38 62 L112 62 L104 48 C104 30 98 8 75 8 Z", fill: "#f2b705", stroke: INK, "stroke-width": 3 }), s.el("circle", { cx: 75, cy: 70, r: 8, fill: INK }));
      p1.append(bellG);
      const swing = () => s.tween({ from: 0, to: 1, dur: 1400, ease: "linear", update: k => bellG.setAttribute("transform", `rotate(${Math.sin(k * Math.PI * 4) * 18 * (1 - k)} 75 8)`) });
      const ding2 = () => { bell(s, 4, 1.4, 0, 0.2); bell(s, 0, 1.8, 0.6, 0.2); swing(); };
      const ding3 = () => { bell(s, 7, 1.2, 0, 0.18); bell(s, 4, 1.2, 0.45, 0.18); bell(s, 0, 1.8, 0.9, 0.18); swing(); };
      const c1 = card("🚪", "Türklingel", "Ding – dong: Ein Gong spielt zwei oder drei Töne aus einer Tonleiter, von hoch nach tief.", p1, [btn(s, "▶ 2 Töne", ding2, true), btn(s, "▶ 3 Töne", ding3)]);
      // 2 tuning
      const p2 = s.svg(150, 84), needle = s.el("line", { x1: 75, y1: 78, x2: 75, y2: 18, stroke: RED, "stroke-width": 4, "stroke-linecap": "round", transform: "rotate(-40 75 78)" });
      p2.append(s.el("path", { d: "M17 70 A60 60 0 0 1 133 70", fill: "none", stroke: "#9aa3b2", "stroke-width": 6, "stroke-linecap": "round" }), s.el("rect", { x: 71, y: 8, width: 8, height: 14, rx: 2, fill: GREEN }), needle, s.el("circle", { cx: 75, cy: 78, r: 6, fill: INK }));
      const tune = async () => {
        s.sfx.tone(410, 1.6, "triangle", 0.2, 0, 440); s.sfx.tone(440, 1.4, "triangle", 0.2, 1.6);
        await s.tween({ from: -40, to: 0, dur: 1600, ease: "out", update: a => needle.setAttribute("transform", `rotate(${a} 75 78)`) });
        s.sfx.ding();
      };
      const c2 = card("🎻", "Instrument stimmen", "Vor dem Spielen stimmen alle nach dem Ton a′. Er schwingt 440-mal pro Sekunde (440 Hz).", p2, [btn(s, "▶ stimmen", tune, true)]);
      // 3 music box
      const p3 = s.svg(150, 84), pins = s.el("g");
      p3.append(s.el("rect", { x: 10, y: 14, width: 130, height: 58, rx: 14, fill: "#d9b26f", stroke: "#8a5a2b", "stroke-width": 3 }), pins);
      const PX = []; for (let i = 0; i < 14; i++) { const c = s.el("circle", { cx: 14 + i * 10, cy: 24 + ((i * 7) % 5) * 10, r: 3.2, fill: "#5b3a1a" }); pins.append(c); PX.push(c); }
      for (let i = 0; i < 6; i++) p3.append(s.el("line", { x1: 140, x2: 148, y1: 20 + i * 9, y2: 20 + i * 9, stroke: "#9aa3b2", "stroke-width": 3 }));
      const BOX = [[7, 2], [12, 1], [11, 1], [9, 2], [7, 2], [5, 1], [4, 1], [5, 1], [7, 1], [4, 4], [2, 1], [4, 1], [5, 1], [9, 1], [7, 2], [5, 2], [4, 1], [2, 1], [4, 1], [2, 1], [0, 4]];
      let spin = 0, spinning = false;
      const playBox = () => {
        let b = 0; BOX.forEach(([n, l]) => { box(s, n + 12, b * 0.22); b += l; });
        spin = performance.now() + b * 220;
        if (spinning) return; spinning = true;
        s.loop(() => { const on = performance.now() < spin; PX.forEach(c => { let x = +c.getAttribute("cx") - 0.6; if (x < 14) x += 140; c.setAttribute("cx", x); }); if (!on) spinning = false; return on; });
      };
      const c3 = card("🎁", "Spieluhr", "Kleine Metallzungen werden von Stiften gezupft. Die Melodien sind oft in Dur – hell und fröhlich.", p3, [btn(s, "▶ aufziehen", playBox, true)]);
      // 4 film
      const p4 = s.svg(150, 84), mouth = s.el("path", { d: "M55 56 Q75 72 95 56", fill: "none", stroke: INK, "stroke-width": 5, "stroke-linecap": "round" });
      p4.append(s.el("circle", { cx: 75, cy: 44, r: 38, fill: "#fff", stroke: INK, "stroke-width": 3 }), s.el("circle", { cx: 62, cy: 36, r: 5, fill: INK }), s.el("circle", { cx: 88, cy: 36, r: 5, fill: INK }), mouth);
      const mood = minor => {
        const pr = minor ? [[0, 3, 7], [5, 8, 12], [-2, 2, 5], [0, 3, 7]] : [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]];
        pr.forEach((c, i) => { chord(s, c.map(x => x - 12), 0.8, i * 0.7, 0.1); pno(s, c[minor ? 1 : 2], 0.6, i * 0.7, 0.14); });
        s.tween({ from: minor ? 1 : -1, to: minor ? -1 : 1, dur: 500, update: k => mouth.setAttribute("d", `M55 56 Q75 ${56 + 16 * k} 95 56`) });
      };
      const c4 = card("🎬", "Filmmusik", "Dieselbe Szene wirkt ganz anders – je nachdem, ob die Musik in Dur oder Moll spielt.", p4, [btn(s, "▶ Dur", () => mood(false), true), btn(s, "▶ Moll", () => mood(true))]);
      s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", height: "100%", alignContent: "center" } }, c1, c2, c3, c4));
      [c1, c2, c3, c4].forEach((c, i) => s.step(async () => { s.sfx.count(i); await s.show(c, "pop"); }));
    },
  });

  /* 15 --------------------------------------------------------------- */
  SLIDES.push({
    title: "Das hast du gelernt",
    say: "Super! Du kennst jetzt Halbtöne, Ganztöne, Vorzeichen, Dur, Moll, Pentatonik und den Dreiklang.",
    build(s) {
      const run = ns => ns.forEach((n, i) => pno(s, n, 0.4, i * 0.28));
      const tile = (ttl, txt, fn, i) => s.h("button", { class: "card a-pop", style: { "--d": i * 90 + "ms", textAlign: "left", font: "inherit", color: INK, cursor: "pointer", display: "flex", flexDirection: "column", gap: "6px" }, onclick: fn },
        s.h("span", { class: "h2", style: { color: C } }, "▶ " + ttl), s.h("span", { class: "small" }, txt));
      const tiles = [
        ["Halb- und Ganzton", "Halbton = nächste Taste, Ganzton = zwei Halbtöne.", () => run([-12, -11, -9])],
        ["Vorzeichen", "♯ höher (fis), ♭ tiefer (es), ♮ hebt auf.", () => run([-7, -6, -7, -8, -9, -8])],
        ["Dur-Treppe", "Ganz – Ganz – Halb – Ganz – Ganz – Ganz – Halb.", () => run([-12, -10, -8, -7, -5, -3, -1, 0])],
        ["Moll", "Ganz – Halb – Ganz – Ganz – Halb – Ganz – Ganz.", () => run([-15, -13, -12, -10, -8, -7, -5, -3])],
        ["Pentatonik", "5 Töne ohne Halbtonschritte – klingt immer gut.", () => run([-6, -4, -2, 1, 3, 1, -2])],
        ["Dreiklang", "c – e – g: jeden zweiten Ton nehmen.", () => { run([-12, -8, -5]); chord(s, [-12, -8, -5], 1.4, 0.9); }],
      ].map(([a, b, f], i) => tile(a, b, f, i));
      const merk = s.h("div", { class: "merk later" }, "In der Instrumentalklasse spielst du bald selbst Tonleitern: ", s.h("b", null, "Erst langsam die Treppe hinauf und hinab"), " – dann klingen Lieder in Dur und Moll ganz sauber.");
      s.add(s.h("div", { class: "stack", style: { gap: "18px", height: "100%", justifyContent: "center" } }, s.h("div", { class: "cols3" }, tiles), merk));
      s.sfx.success();
      s.step(async () => { s.sfx.fanfare(); await s.show(merk, "up"); s.confetti(590, 400, 80); });
    },
  });

  Deck.unit({
    id: "u4", num: 4, title: "Tonleitern", color: C, soft: SOFT,
    subtitle: "Treppen aus Tönen",
    blurb: "Ganzton, Halbton, Dur, Moll – und Töne ohne Fehler.",
    goals: ["Ganztöne und Halbtöne auf dem Klavier finden", "Stammtöne und Vorzeichen (♯, ♭, ♮) kennen", "Die Dur-Tonleiter als Treppe bauen", "Dur und Moll hören und unterscheiden", "Mit der Pentatonik frei spielen"],
    icon(svg, el) {
      svg.append(el("circle", { cx: 35, cy: 35, r: 30, fill: C, opacity: .14 }));
      [0, 1, 2, 3, 4].forEach(i => svg.append(el("rect", { x: 10 + i * 10, y: 50 - i * 9, width: 10, height: 8 + i * 9, fill: i === 4 ? RED : C })));
    },
    slides: SLIDES,
  });
})();
