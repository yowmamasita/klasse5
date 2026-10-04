/* Kapitel 9 – Intervalle und Musik der Welt (Berliner Rahmenlehrplan Musik, Klasse 5–6).
   Teil A: Intervalle (Prime bis Oktave, zählen, melodisch/harmonisch, Liedanfänge, große/kleine Terz,
   Konsonanz/Dissonanz). Teil B: Musik der Welt (Karte, Gamelan, Djembe, Sitar/Tabla, Didgeridoo,
   Steel Pan, Alphorn/Jodeln, Pentatonik).
   Liedanfänge nur aus gemeinfreien Melodien (Volkslieder, Traditionals, Beethoven). Echte Fotos/Töne über tools/media. */
(() => {
  "use strict";
  const C = "#a16207", SOFT = "#fdf3d7", RED = "#dc3b2a", INK = "#1b2740", PENCIL = "#5d6678", GREEN = "#138a5a", BLUE = "#1d5bd0", VIOLET = "#7b4fd6";
  const LIGHT = "#fcd77f";
  const hz = n => 523.25 * Math.pow(2, n / 12); // 0 = c'' (C5)
  const pc = n => ((n % 12) + 12) % 12;
  const isB = n => [1, 3, 6, 8, 10].includes(pc(n));
  const WN = ["c", "cis", "d", "dis", "e", "f", "fis", "g", "gis", "a", "b", "h"];
  const WD = [0, 2, 4, 5, 7, 9, 11];
  const white = d => -12 + WD[((d % 7) + 7) % 7] + 12 * Math.floor(d / 7); // diatonic step d (0 = c') -> semitone n
  const IV = ["Prime", "Sekunde", "Terz", "Quarte", "Quinte", "Sexte", "Septime", "Oktave"];

  /* ---------- sounds: recorded piano + glockenspiel, pitched (as in Kapitel 4) ---------- */
  const PS = [[36, "piano-c2"], [40, "piano-e2"], [45, "piano-a2"], [48, "piano-c3"], [52, "piano-e3"], [57, "piano-a3"], [60, "piano-c4"], [64, "piano-e4"], [69, "piano-a4"], [72, "piano-c5"], [76, "piano-e5"], [81, "piano-a5"], [84, "piano-c6"]];
  const MEDIA_IDS = PS.map(p => p[1]).concat(["glockenspiel-g4"]);
  const pno = (s, n, dur = 0.7, w = 0, v = 0.2) => {
    if (!s.alive) return;
    const m = 72 + n; let best = PS[0];
    for (const p of PS) if (Math.abs(p[0] - m) < Math.abs(best[0] - m)) best = p;
    s.sound(best[1], { rate: Math.pow(2, (m - best[0]) / 12), when: w, vol: Math.min(1, v * 3.4), dur: Math.max(.3, dur + .5) });
  };
  const bell = (s, n, dur = 1.4, w = 0, v = 0.18) => { if (s.alive) s.sound("glockenspiel-g4", { rate: Math.pow(2, (72 + n - 79) / 12), when: w, vol: Math.min(1, v * 4), dur: Math.max(.4, dur) }); };
  const mel = (s, notes, beat = 0.34, w = 0, v = 0.2) => { let t = w; for (const [n, b] of notes) { if (n != null) pno(s, n, b * beat * 0.95, t, v); t += b * beat; } return t; };
  const pan = (s, n, w = 0) => { const f = hz(n); s.sfx.tone(f, 1.5, "sine", 0.2, w); s.sfx.tone(f * 2, 0.7, "sine", 0.07, w); s.sfx.tone(f * 3, 0.25, "sine", 0.035, w); };
  const horn = (s, f, w = 0, dur = 1.1) => { s.sfx.tone(f, dur, "triangle", 0.2, w); s.sfx.tone(f * 2, dur * 0.9, "sine", 0.06, w); s.sfx.tone(f * 3, dur * 0.6, "sine", 0.025, w); };

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
    return { g, keys, hit, tint, label, labels, ww, bh, H, whites, x0, y0 };
  }
  function arc(s, K, n1, n2, y, txt, col = C, lift = 46) {
    const g = s.el("g");
    const x1 = K.x0 + K.keys[n1].cx, x2 = K.x0 + K.keys[n2].cx, mx = (x1 + x2) / 2;
    g.append(s.el("path", { d: `M${x1} ${y} Q${mx} ${y - lift} ${x2} ${y}`, fill: "none", stroke: col, "stroke-width": 4, "stroke-linecap": "round" }));
    g.append(s.el("circle", { cx: x2, cy: y, r: 6, fill: col }));
    if (txt) g.append(s.el("text", { x: mx, y: y - lift * 0.5 - 10, "text-anchor": "middle", "font-size": 22, "font-weight": 800, fill: col, text: txt }));
    return g;
  }

  /* ---------- notation drawn by hand ---------- */
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
  function nhead(s, x, y, d, gap, { color = INK, hollow = false, stem = true } = {}) {
    const g = s.el("g"), k = gap / 14;
    if (d <= 0) g.append(s.el("line", { x1: x - 17 * k, x2: x + 17 * k, y1: y, y2: y, stroke: color === INK ? INK : color, "stroke-width": 1.8 }));
    g.append(s.el("ellipse", { cx: x, cy: y, rx: 9.5 * k, ry: 7 * k, transform: `rotate(-22 ${x} ${y})`, fill: hollow ? "#fff" : color, stroke: color, "stroke-width": hollow ? 2.6 * k : 1 }));
    if (stem) { const up = d < 6, sx = up ? x + 8.6 * k : x - 8.6 * k; g.append(s.el("line", { x1: sx, x2: sx, y1: y, y2: up ? y - 46 * k : y + 46 * k, stroke: color, "stroke-width": 2.4 * k })); }
    return g;
  }
  const btn = (s, label, onclick, solid = false) => s.h("button", { class: "btn" + (solid ? " solid" : ""), onclick }, label);
  const exCard = (s, lab, emo, txt, fn, life = false) => s.h("div", { class: (life ? "life" : "ex") + " later" }, s.h("span", { class: "exlabel" }, lab),
    s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "12px" } },
      s.h("span", { style: { fontSize: "38px" } }, emo), s.h("p", { class: "small", style: { flex: 1 } }, txt), fn ? btn(s, "▶", fn) : null));
  const reveal3 = (s, cards) => s.step(async () => { for (const [i, c] of cards.entries()) { s.sfx.count(i); s.show(c, "up"); await s.wait(200); } });

  const SLIDES = [];

  /* ================================================================ TEIL A: INTERVALLE */
  /* 1 ---------------------------------------------------------------- */
  SLIDES.push({
    title: "Was ist ein Intervall?",
    say: "Ein Intervall ist der Abstand zwischen zwei Tönen. Tippe auf eine Taste und hör, wie weit sie vom c entfernt ist.",
    build(s) {
      const Q = seq(s);
      const svg = s.svg(1100, 280);
      const arcs = s.el("g");
      const now = s.h("span", { class: "big", style: { color: C } }, "…");
      const K = kb(s, 40, 90, -12, 0, 1020, 186, {
        onKey: n => {
          if (isB(n)) { pno(s, n); K.hit(n); return; }
          const t = Q.start(), d = K.whites.indexOf(n);
          arcs.replaceChildren(d > 0 ? arc(s, K, -12, n, 82, "", C, 30 + d * 8) : s.el("g"));
          now.textContent = d > 0 ? "c – " + WN[pc(n)] + ": ein " + (d < 3 ? "kleiner" : d < 6 ? "mittlerer" : "großer") + " Abstand" : "derselbe Ton";
          pno(s, -12, 0.5); K.hit(-12, LIGHT, 400);
          s.wait(450).then(() => { if (Q.ok(t)) { pno(s, n, 0.7); K.hit(n, C, 500); } });
        },
      });
      svg.append(K.g, arcs);
      K.tint(-12, LIGHT);
      K.whites.forEach(n => K.label(n, WN[pc(n)]));
      const top = s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "18px" } }, s.h("p", { class: "h2" }, "Vom c aus:"), now);
      const merk = s.h("div", { class: "merk later" }, "Ein ", s.h("b", null, "Intervall"), " ist der ", s.h("b", null, "Abstand zwischen zwei Tönen"), ". Das Wort kommt aus dem Lateinischen: intervallum = Zwischenraum.");
      const c1 = exCard(s, "Beispiel 1 · Treppe", "🪜", "Eine Stufe hoch oder gleich drei auf einmal? Das ist ein kleiner oder großer Abstand.", () => { pno(s, -12, .4); pno(s, -10, .5, .45); pno(s, -12, .4, 1.3); pno(s, -5, .6, 1.75); });
      const c2 = exCard(s, "Beispiel 2 · Hüpfspiel", "🦘", "Beim Himmel-und-Hölle-Hüpfen zählst du die Kästchen. Bei Tönen zählst du die Stufen.", () => [-12, -10, -8, -7].forEach((n, i) => pno(s, n, .3, i * .3)));
      const c3 = exCard(s, "Beispiel 3 · Aufzug", "🛗", "Vom Erdgeschoss in den 7. Stock: ein großer Sprung – wie vom tiefen zum hohen c.", () => { pno(s, -12, .5); pno(s, 0, .8, .55); }, true);
      s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%", justifyContent: "center" } }, top, svg, merk, s.h("div", { class: "cols3", style: { gap: "16px" } }, c1, c2, c3)));
      s.show(svg, "up"); s.sfx.whoosh();
      s.step(async () => {
        const t = Q.start();
        for (const n of [-10, -5, 0]) {
          if (!Q.ok(t) && !s.fast) return;
          const d = K.whites.indexOf(n);
          arcs.replaceChildren(arc(s, K, -12, n, 82, "", C, 30 + d * 8)); s.show(arcs.firstChild, "draw");
          pno(s, -12, .45); K.hit(-12, LIGHT, 350); await s.wait(420); pno(s, n, .6); K.hit(n, C, 450); await s.wait(700);
        }
        now.textContent = "klein – mittel – groß"; s.say("Kleiner Abstand, mittlerer Abstand, großer Abstand.");
      });
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
      reveal3(s, [c1, c2, c3]);
    },
  });

  /* 2 ---------------------------------------------------------------- */
  SLIDES.push({
    title: "Prime bis Oktave: Stufen zählen",
    say: "Wir zählen die Stufen vom ersten bis zum zweiten Ton. Beide Töne zählen mit. Von c bis e sind es drei Stufen: eine Terz.",
    build(s) {
      const Q = seq(s);
      const svg = s.svg(1100, 250), G = 20;
      const Y = staff(s, svg, 30, 1070, 40, G);
      svg.append(clef(s, 76, 40 + 3 * G, G));
      const X = i => 230 + i * 112;
      const NAMES = ["c", "d", "e", "f", "g", "a", "h", "c"];
      const gray = [], col = [], nums = [];
      for (let i = 0; i < 8; i++) {
        const gN = nhead(s, X(i), Y(i), i, G, { color: "#c6ccd6" }); svg.append(gN); gray.push(gN);
        const cN = nhead(s, X(i), Y(i), i, G, { color: C }); cN.setAttribute("opacity", 0); svg.append(cN); col.push(cN);
        svg.append(s.el("text", { x: X(i), y: 190, "text-anchor": "middle", "font-size": 22, "font-weight": 700, fill: PENCIL, text: NAMES[i] }));
        const b = s.el("g", { opacity: 0 });
        b.append(s.el("circle", { cx: X(i), cy: 226, r: 18, fill: C }), s.el("text", { x: X(i), y: 233, "text-anchor": "middle", "font-size": 21, "font-weight": 800, fill: "#fff", text: String(i + 1) }));
        svg.append(b); nums.push(b);
      }
      const name = s.h("span", { class: "big", style: { color: C } }, "…");
      const info = s.h("span", { class: "t" }, "Tippe auf ein Intervall:");
      const show = async k => {
        const t = Q.start();
        name.textContent = IV[k];
        info.textContent = k ? `c bis ${NAMES[k]} = ${k + 1} Stufen` : "c und c = derselbe Ton";
        for (let i = 0; i < 8; i++) { col[i].setAttribute("opacity", 0); nums[i].setAttribute("opacity", 0); }
        for (let i = 0; i <= k; i++) {
          if (!Q.ok(t) && !s.fast) return;
          nums[i].setAttribute("opacity", 1); col[i].setAttribute("opacity", i === 0 || i === k ? 1 : 0.3);
          s.sfx.count(i); await s.wait(170);
        }
        if (!Q.ok(t)) return;
        pno(s, -12, .5); pno(s, white(k), .7, .5); pno(s, -12, 1.2, 1.3, .15); pno(s, white(k), 1.2, 1.3, .15);
      };
      const btns = IV.map((n, k) => { const b = btn(s, n, () => show(k)); b.style.padding = "0 12px"; b.style.flex = "1"; return b; });
      const row = s.h("div", { class: "row later", style: { gap: "8px", flexWrap: "nowrap" } }, btns);
      const merk = s.h("div", { class: "merk later" }, "Zähle die Stufen ", s.h("b", null, "vom ersten bis zum letzten Ton – beide zählen mit"), ". Die Namen sind lateinische Zahlen: Prime = 1., Sekunde = 2., Terz = 3. … Oktave = 8.");
      s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%", justifyContent: "center" } },
        s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "20px", alignItems: "baseline" } }, name, info), svg, row, merk));
      s.show(svg, "up"); s.sfx.whoosh();
      s.step(async () => { await show(2); s.say("c, d, e: drei Stufen. Das ist eine Terz."); });
      s.step(async () => { await show(4); s.say("c bis g: fünf Stufen, eine Quinte."); });
      s.step(async () => { s.show(row, "up"); s.sfx.pop(); await show(7); s.say("Und acht Stufen: die Oktave. Da klingt das c wieder wie c, nur höher."); });
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
    },
  });

  /* 3 ---------------------------------------------------------------- */
  SLIDES.push({
    title: "Intervalle auf dem Klavier",
    say: "Auf dem Klavier zählst du die weißen Tasten. Die erste und die letzte Taste zählen mit. Das klappt von jedem Ton aus.",
    build(s) {
      const Q = seq(s);
      const svg = s.svg(1100, 300);
      const K = kb(s, 30, 92, -12, 12, 1040, 200);
      const arcs = s.el("g"), numG = s.el("g", { style: { pointerEvents: "none" } });
      svg.append(K.g, numG, arcs);
      K.whites.forEach(n => K.label(n, WN[pc(n)]));
      let start = 0, iv = 2;
      const info = s.h("p", { class: "h2" }, "Wähle einen Startton und ein Intervall.");
      const draw = async () => {
        const t = Q.start();
        K.whites.forEach(n => K.tint(n, null)); arcs.replaceChildren(); numG.replaceChildren();
        const a = K.whites[start], b = K.whites[start + iv];
        for (let i = 0; i <= iv; i++) {
          if (!Q.ok(t) && !s.fast) return;
          const k = K.keys[K.whites[start + i]];
          K.tint(k.n, i === 0 || i === iv ? LIGHT : "#fdf3d7");
          const c = s.el("circle", { cx: K.x0 + k.cx, cy: K.y0 + 150, r: 15, fill: C }), tx = s.el("text", { x: K.x0 + k.cx, y: K.y0 + 157, "text-anchor": "middle", "font-size": 19, "font-weight": 800, fill: "#fff", text: String(i + 1) });
          numG.append(c, tx); s.sfx.count(i); await s.wait(150);
        }
        if (!Q.ok(t)) return;
        const ag = arc(s, K, a, b, 84, IV[iv], C, 36 + iv * 4); arcs.append(ag); s.show(ag, "pop");
        info.textContent = `${WN[pc(a)]} bis ${WN[pc(b)]}: ${iv + 1} Stufen = ${IV[iv]}`;
        pno(s, a, .5); await s.wait(500); if (!Q.ok(t)) return; pno(s, b, .8);
      };
      const sb = ["c", "d", "e", "f", "g"].map((n, i) => { const b = btn(s, "ab " + n, () => { start = i; sb.forEach((x, j) => x.classList.toggle("solid", j === i)); draw(); }); b.style.padding = "0 14px"; return b; });
      sb[0].classList.add("solid");
      const ib = IV.slice(1).map((n, k) => { const b = btn(s, n, () => { iv = k + 1; ib.forEach((x, j) => x.classList.toggle("solid", j === k)); draw(); }); b.style.padding = "0 12px"; b.style.flex = "1"; return b; });
      ib[1].classList.add("solid");
      const ctr = s.h("div", { class: "stack later", style: { gap: "10px" } }, s.h("div", { class: "row", style: { gap: "8px", flexWrap: "nowrap" } }, s.h("p", { class: "t", style: { width: "110px" } }, "Start:"), sb),
        s.h("div", { class: "row", style: { gap: "8px", flexWrap: "nowrap" } }, s.h("p", { class: "t", style: { width: "110px" } }, "Intervall:"), ib));
      const merk = s.h("div", { class: "merk later" }, "Für den Namen zählst du die ", s.h("b", null, "weißen Tasten"), " (Stammtöne). Ob du bei c oder bei f anfängst: 4 Stufen sind immer eine ", s.h("b", null, "Quarte"), ".");
      s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%", justifyContent: "center" } }, info, svg, ctr, merk));
      s.show(svg, "up"); s.sfx.whoosh();
      const sync = () => { sb.forEach((x, j) => x.classList.toggle("solid", j === start)); ib.forEach((x, j) => x.classList.toggle("solid", j === iv - 1)); };
      s.step(async () => { start = 0; iv = 3; sync(); await draw(); s.say("c, d, e, f: vier Stufen, eine Quarte."); });
      s.step(async () => { start = 3; iv = 3; sync(); await draw(); s.say("f, g, a, h: auch vier Stufen, auch eine Quarte."); });
      s.step(async () => { s.show(ctr, "up"); s.sfx.pop(); await s.wait(200); s.sfx.ding(); await s.show(merk, "up"); });
    },
  });

  /* 4 ---------------------------------------------------------------- */
  SLIDES.push({
    title: "Melodisch und harmonisch",
    say: "Kommen die zwei Töne nacheinander, ist das Intervall melodisch. Klingen sie gleichzeitig, ist es harmonisch.",
    build(s) {
      const G = 18;
      const panel = (title, sub, stacked, colr) => {
        const svg = s.svg(500, 150); svg.style.width = "100%"; svg.style.height = "auto";
        const Y = staff(s, svg, 10, 490, 28, G);
        svg.append(clef(s, 52, 28 + 3 * G, G));
        const notes = stacked
          ? [nhead(s, 280, Y(0), 0, G, { color: colr, hollow: true, stem: false }), nhead(s, 280, Y(4), 4, G, { color: colr, hollow: true, stem: false })]
          : [nhead(s, 210, Y(0), 0, G, { color: colr }), nhead(s, 360, Y(4), 4, G, { color: colr })];
        svg.append(...notes);
        svg.append(s.el("text", { x: stacked ? 330 : 285, y: 142, "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: PENCIL, text: stacked ? "c + g zusammen" : "erst c, dann g" }));
        const b = btn(s, stacked ? "▶ zusammen" : "▶ nacheinander", () => {
          if (stacked) { pno(s, -12, 1.4); pno(s, -5, 1.4); notes.forEach(n => s.show(n, "pop")); }
          else { pno(s, -12, .5); pno(s, -5, .7, .55); s.show(notes[0], "pop"); s.show(notes[1], "pop", 550); }
        }, true);
        const card = s.h("div", { class: "card" + (stacked ? " later" : ""), style: { display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" } },
          s.h("p", { class: "h2", style: { color: colr } }, title + ": " + sub), svg, b);
        card.play = () => b.click();
        return card;
      };
      const pM = panel("melodisch", "nacheinander", false, C);
      const pH = panel("harmonisch", "gleichzeitig", true, VIOLET);
      const c1 = exCard(s, "Melodisch · Singen", "🎤", "Eine Stimme singt immer nur einen Ton auf einmal – also melodisch.", () => mel(s, [[-12, 1], [-12, 1], [-5, 1], [-5, 1]]));
      const c2 = exCard(s, "Harmonisch · Zwei Flöten", "🎶", "Zwei Blockflöten spielen gleichzeitig: harmonische Intervalle.", () => { [[-5, -12], [-3, -10], [-1, -8], [0, -8]].forEach(([a, b], i) => { pno(s, a, .5, i * .5, .14); pno(s, b, .5, i * .5, .14); }); });
      const c3 = exCard(s, "Harmonisch · Gitarre", "🎸", "Die leeren Saiten E und A zusammen: eine Quarte.", () => { pno(s, -32, 1.6, 0, .22); pno(s, -27, 1.6, 0.03, .22); }, true);
      const merk = s.h("div", { class: "merk later" }, s.h("b", null, "Melodisch"), " = nacheinander (Noten nebeneinander). ", s.h("b", null, "Harmonisch"), " = gleichzeitig (Noten übereinander).");
      s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%", justifyContent: "center" } },
        s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 1fr", gap: "20px" } }, pM, pH), merk, s.h("div", { class: "cols3", style: { gap: "16px" } }, c1, c2, c3)));
      s.sfx.whoosh();
      s.step(async () => { pM.play(); s.say("Erst c, dann g: melodisch."); });
      s.step(async () => { await s.show(pH, "up"); pH.play(); s.say("c und g zusammen: harmonisch."); });
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
      reveal3(s, [c1, c2, c3]);
    },
  });

  /* 5 ---------------------------------------------------------------- */
  SLIDES.push({
    title: "Liedanfänge als Eselsbrücken",
    say: "Viele Lieder beginnen mit einem bestimmten Intervall. Wenn du den Liedanfang kennst, erkennst du das Intervall.",
    build(s) {
      const DATA = [
        ["Prime", "=", 0, "„Jingle Bells“", [[-8, .5], [-8, .5], [-8, 1], [-8, .5], [-8, .5], [-8, 1], [-8, .5], [-5, .5], [-12, .75], [-10, .25], [-8, 2]]],
        ["kl. Sekunde", "↓", -1, "„Für Elise“ (Beethoven)", [[4, .5], [3, .5], [4, .5], [3, .5], [4, .5], [-1, .5], [2, .5], [0, .5], [-3, 1.5]]],
        ["gr. Sekunde", "↑", 2, "„Alle meine Entchen“", [[-12, 1], [-10, 1], [-8, 1], [-7, 1], [-5, 2], [-5, 2]]],
        ["kl. Terz", "↓", -3, "„Kuckuck, Kuckuck, ruft’s aus dem Wald“", [[-5, 1], [-8, 1], [-5, 1], [-8, 1]]],
        ["gr. Terz", "↑", 4, "„When the Saints Go Marching In“", [[-12, 1], [-8, 1], [-7, 1], [-5, 4]]],
        ["Quarte", "↑", 5, "„O Tannenbaum“", [[-12, 1], [-7, .75], [-7, .25], [-7, 1.5], [-5, .5], [-3, .75], [-3, .25], [-3, 1.5]]],
        ["Quinte", "↑", 7, "„Morgen kommt der Weihnachtsmann“", [[-12, 1], [-12, 1], [-5, 1], [-5, 1], [-3, 1], [-3, 1], [-5, 2]]],
        ["gr. Sexte", "↑", 9, "„My Bonnie Is Over the Ocean“", [[-17, 1], [-8, 1.5], [-10, .5], [-12, 1], [-10, 1], [-12, 1], [-15, 1], [-17, 1], [-20, 2]]],
      ];
      const Q = seq(s);
      const tiles = DATA.map(([iv, dir, st, song, notes]) => {
        const g = s.svg(200, 64);
        const y1 = st < 0 ? 18 : 52, y2 = y1 - st * 3.6;
        g.append(s.el("line", { x1: 30, x2: 170, y1: 60, y2: 60, stroke: "#e2d9c4", "stroke-width": 2 }));
        g.append(s.el("path", { d: `M50 ${y1} Q100 ${Math.min(y1, y2) - 14} 150 ${y2}`, fill: "none", stroke: C, "stroke-width": 3, "stroke-dasharray": "6 5" }));
        g.append(s.el("circle", { cx: 50, cy: y1, r: 9, fill: C }), s.el("circle", { cx: 150, cy: y2, r: 9, fill: RED }));
        const play = () => { const t = Q.start(); tiles.forEach(x => (x.style.outline = "none")); tile.style.outline = "4px solid " + LIGHT; const end = mel(s, notes, .32); s.wait(end * 1000).then(() => { if (Q.ok(t)) tile.style.outline = "none"; }); };
        const tile = s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "4px", padding: "10px 12px", alignItems: "center", textAlign: "center" } },
          s.h("p", { class: "h2", style: { fontSize: "24px", color: C } }, iv + " " + dir), g,
          s.h("p", { class: "small", style: { minHeight: "52px", lineHeight: "1.25" } }, song), btn(s, "▶ anhören", play));
        tile.play = play; return tile;
      });
      const merk = s.h("div", { class: "merk later", style: { flex: 1 } }, "Die ", s.h("b", null, "Oktave"), " erkennst du am „gleichen“ Ton, nur höher. Erfinde eigene Eselsbrücken mit Liedern, die du gut kennst!");
      const okt = btn(s, "▶ Oktave", () => { pno(s, -12, .5); pno(s, 0, .9, .55); }, true);
      s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%", justifyContent: "center" } },
        s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "12px" } }, tiles),
        s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "16px" } }, merk, okt)));
      s.sfx.whoosh();
      [[0, 1, 2, 3], [4, 5, 6, 7]].forEach((grp, gi) => s.step(async () => {
        for (const i of grp) { s.show(tiles[i], "up"); s.sfx.count(i); await s.wait(160); }
        tiles[gi ? 6 : 2].play();
        s.say(gi ? "Die Quinte: Morgen kommt der Weihnachtsmann." : "Die große Sekunde: Alle meine Entchen.");
      }));
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
    },
  });

  /* 6 ---------------------------------------------------------------- */
  SLIDES.push({
    title: "Große und kleine Terz",
    say: "Terz ist nicht gleich Terz. Die große Terz hat vier Halbtöne und klingt hell, nach Dur. Die kleine Terz hat drei Halbtöne und klingt dunkler, nach Moll.",
    build(s) {
      const Q = seq(s);
      const svg = s.svg(600, 310);
      const K = kb(s, 10, 100, -12, 0, 580, 200);
      const arcs = s.el("g"), dots = s.el("g", { style: { pointerEvents: "none" } });
      svg.append(K.g, dots, arcs);
      K.whites.forEach(n => K.label(n, WN[pc(n)]));
      const lE = K.label(-9, "es", { fs: 19, later: true });
      const face = s.svg(150, 150), mouth = s.el("path", { d: "M45 96 Q75 122 105 96", fill: "none", stroke: INK, "stroke-width": 6, "stroke-linecap": "round" });
      const sky = s.el("circle", { cx: 75, cy: 75, r: 72, fill: "#ffe9a8" });
      face.append(sky, s.el("circle", { cx: 75, cy: 75, r: 56, fill: "#fff", stroke: INK, "stroke-width": 3 }), s.el("circle", { cx: 56, cy: 64, r: 6, fill: INK }), s.el("circle", { cx: 94, cy: 64, r: 6, fill: INK }), mouth);
      let happy = true;
      const mood = h => { if (h === happy) return; happy = h; sky.setAttribute("fill", h ? "#ffe9a8" : "#d9d4f2"); s.tween({ from: h ? -1 : 1, to: h ? 1 : -1, dur: 450, ease: "out", update: k => mouth.setAttribute("d", `M45 96 Q75 ${96 + 26 * k} 105 96`) }); };
      const lab = s.h("p", { class: "h2", style: { textAlign: "center" } }, "…");
      const terz = async big => {
        const t = Q.start(), top = big ? -8 : -9, col = big ? C : VIOLET;
        arcs.replaceChildren(); dots.replaceChildren(); [-11, -10, -9, -8].forEach(n => K.tint(n, null)); K.tint(-12, LIGHT); K.tint(top, big ? LIGHT : "#d9d4f2");
        if (!big) s.show(lE, "pop");
        for (let n = -11, i = 1; n <= top; n++, i++) {
          if (!Q.ok(t) && !s.fast) return;
          const k = K.keys[n], y = K.y0 + (k.black ? K.bh - 44 : 150);
          dots.append(s.el("circle", { cx: K.x0 + k.cx, cy: y, r: 14, fill: RED }), s.el("text", { x: K.x0 + k.cx, y: y + 7, "text-anchor": "middle", "font-size": 19, "font-weight": 800, fill: "#fff", text: String(i) }));
          s.sfx.tick(); await s.wait(160);
        }
        const a = arc(s, K, -12, top, 92, big ? "große Terz" : "kleine Terz", col, 50); arcs.append(a); s.show(a, "pop");
        lab.textContent = big ? "4 Halbtöne: Dur" : "3 Halbtöne: Moll"; mood(big);
        pno(s, -12, .5); pno(s, top, .6, .5); pno(s, -12, 1.4, 1.2, .14); pno(s, top, 1.4, 1.2, .14);
      };
      const bG = btn(s, "▶ c – e", () => terz(true), true), bK = btn(s, "▶ c – es", () => terz(false));
      const right = s.h("div", { class: "stack", style: { gap: "10px", alignItems: "center" } }, face, lab, s.h("div", { class: "row", style: { gap: "10px", justifyContent: "center" } }, bG, bK));
      const merk = s.h("div", { class: "merk later" }, s.h("b", null, "Große Terz"), " = 4 Halbtöne, klingt hell (Dur). ", s.h("b", null, "Kleine Terz"), " = 3 Halbtöne, klingt dunkler (Moll). Das kennst du aus Kapitel 4: Dreiklänge!");
      const c1 = exCard(s, "Im Alltag · Türgong", "🔔", "Viele Türgongs spielen „Ding – dong“ als große Terz von oben nach unten.", () => { bell(s, 4, 1.4); bell(s, 0, 1.8, .55); }, true);
      const c2 = exCard(s, "Im Lied · Kuckuck", "🐦", "„Kuckuck, Kuckuck“ springt eine kleine Terz nach unten: g – e.", () => mel(s, [[-5, 1], [-8, 1.5], [-5, 1], [-8, 1.5]]));
      const c3 = exCard(s, "Kapitel 4 · Dreiklang", "🎹", "Unten große Terz: Dur (c-e-g). Unten kleine Terz: Moll (c-es-g).", () => { [-12, -8, -5].forEach(n => pno(s, n, 1.2, 0, .13)); [-12, -9, -5].forEach(n => pno(s, n, 1.4, 1.4, .13)); });
      s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%", justifyContent: "center" } },
        s.h("div", { class: "cols", style: { gridTemplateColumns: "600px 1fr", gap: "24px", alignItems: "center" } }, svg, right),
        merk, s.h("div", { class: "cols3", style: { gap: "16px" } }, c1, c2, c3)));
      s.show(svg, "up"); s.sfx.whoosh();
      s.step(async () => { await terz(true); s.say("c bis e: vier Halbtöne. Große Terz. Das klingt hell."); });
      s.step(async () => { await terz(false); s.say("c bis es: drei Halbtöne. Kleine Terz. Das klingt dunkler."); });
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
      reveal3(s, [c1, c2, c3]);
    },
  });

  /* 7 ---------------------------------------------------------------- */
  SLIDES.push({
    title: "Konsonanz und Dissonanz",
    say: "Manche Intervalle klingen weich und ruhig, sie verschmelzen. Das ist eine Konsonanz. Andere reiben sich und klingen spannend. Das ist eine Dissonanz.",
    build(s) {
      const LIST = [
        ["Oktave", 12, 1], ["Quinte", 7, 1], ["Quarte", 5, 1], ["gr. Terz", 4, 1], ["gr. Sekunde", 2, 0], ["kl. Sekunde", 1, 0], ["gr. Septime", 11, 0],
      ];
      const W = 1100, H = 150;
      const { canvas, g } = s.canvas(W, H);
      canvas.style.background = "#fff"; canvas.style.borderRadius = "14px"; canvas.style.border = "2px solid #e6dcc4";
      let cur = 1, phase = 0;
      const drawWave = () => {
        const semis = LIST[cur][1], r = Math.pow(2, semis / 12), f1 = 7, cons = LIST[cur][2];
        g.clearRect(0, 0, W, H);
        g.lineWidth = 3; g.strokeStyle = cons ? GREEN : RED; g.beginPath();
        for (let x = 0; x <= W; x += 2) {
          const p = x / W * Math.PI * 2;
          const y = H / 2 - 28 * (Math.sin(f1 * p + phase) + Math.sin(f1 * r * p + phase * r));
          x ? g.lineTo(x, y) : g.moveTo(x, y);
        }
        g.stroke();
      };
      drawWave();
      s.loop((t, dt) => { phase += dt * 1.6; drawWave(); });
      const name = s.h("span", { class: "big", style: { color: GREEN } }, "Quinte");
      const verdict = s.h("span", { class: "h2" }, "konsonant – verschmilzt");
      const play = i => {
        cur = i; const [n, st, cons] = LIST[i];
        name.textContent = n; name.style.color = cons ? GREEN : RED;
        verdict.textContent = cons ? "konsonant – verschmilzt" : "dissonant – reibt sich";
        bs.forEach((b, j) => { b.classList.toggle("solid", j === i); if (!LIST[j][2]) b.style.color = j === i ? "#fff" : RED; });
        pno(s, -12, 1.8, 0, .17); pno(s, -12 + st, 1.8, 0, .17);
      };
      const bs = LIST.map(([n, , cons], i) => { const b = btn(s, n, () => play(i)); b.style.padding = "0 12px"; b.style.flex = "1"; if (!cons) { b.style.borderColor = RED; b.style.color = RED; } return b; });
      bs[1].classList.add("solid");
      const merk = s.h("div", { class: "merk later" }, s.h("b", null, "Konsonanz"), " (Wohlklang): Oktave, Quinte, Quarte, Terzen, Sexten. ", s.h("b", null, "Dissonanz"), " (Reibung): Sekunden und Septimen. Die Welle zeigt es: glatt oder wackelig.");
      const c1 = exCard(s, "Im Film", "🎬", "Gruselszenen nutzen oft Dissonanzen: Die Reibung macht Spannung.", () => { [[-12, -11], [-11, -10]].forEach(([a, b], i) => { pno(s, a, 1, i * 1, .16); pno(s, b, 1, i * 1, .16); }); }, true);
      const c2 = exCard(s, "Auflösung", "➡️", "Die Septime c – h will weiter: Sie löst sich in die Oktave auf.", () => { pno(s, -12, 1, 0, .16); pno(s, -1, 1, 0, .16); pno(s, -12, 1.4, 1, .16); pno(s, 0, 1.4, 1, .16); });
      const c3 = exCard(s, "Im Chor", "👥", "Zwei Stimmen singen eine saubere Quinte: Sie verschmelzen.", () => s.sound("choir-chord", { force: true, dur: 3.5 }), true);
      s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%", justifyContent: "center" } },
        s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "20px", alignItems: "baseline" } }, name, verdict), canvas,
        s.h("div", { class: "row", style: { gap: "8px", flexWrap: "nowrap" } }, bs), merk, s.h("div", { class: "cols3", style: { gap: "16px" } }, c1, c2, c3)));
      s.show(canvas, "up"); s.sfx.whoosh();
      s.step(async () => { play(1); s.say("Die Quinte: Die Welle ist gleichmäßig. Das klingt ruhig."); });
      s.step(async () => { play(5); s.say("Die kleine Sekunde: Die Welle wackelt. Die Töne reiben sich."); });
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
      reveal3(s, [c1, c2, c3]);
    },
  });

  /* 8 ---------------------------------------------------------------- */
  SLIDES.push({
    title: "Im Alltag: Intervalle hören",
    say: "Intervalle hörst du jeden Tag: beim Martinshorn, an der Haustür, beim Gitarrestimmen und im Wald.",
    build(s) {
      const card = (emo, ttl, iv, txt, pic, btns) => s.h("div", { class: "life later", style: { display: "flex", flexDirection: "column", gap: "8px" } },
        s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "12px" } }, s.h("span", { style: { fontSize: "34px" } }, emo), s.h("p", { class: "h2", style: { fontSize: "26px" } }, ttl), s.h("span", { class: "chip", style: { background: C, color: "#fff" } }, iv)),
        s.h("p", { class: "small" }, txt), s.h("div", { class: "row", style: { flexWrap: "nowrap", justifyContent: "space-between", alignItems: "center" } }, pic, s.h("div", { class: "row", style: { gap: "10px", flexWrap: "nowrap" } }, btns)));
      // 1 Martinshorn: a' – d''
      const p1 = s.svg(170, 110), blue = s.el("circle", { cx: 85, cy: 40, r: 26, fill: "#4da3ff", opacity: .4 });
      p1.append(s.el("rect", { x: 20, y: 52, width: 130, height: 46, rx: 10, fill: "#fff", stroke: INK, "stroke-width": 3 }), s.el("rect", { x: 70, y: 30, width: 30, height: 22, rx: 6, fill: BLUE }), blue,
        s.el("rect", { x: 79, y: 59, width: 12, height: 32, fill: RED }), s.el("rect", { x: 69, y: 69, width: 32, height: 12, fill: RED }));
      const blink = () => s.tween({ from: 0, to: 1, dur: 2400, ease: "linear", update: k => blue.setAttribute("opacity", Math.sin(k * Math.PI * 8) > 0 ? .9 : .15) });
      const tatu = () => { for (let i = 0; i < 2; i++) { horn(s, hz(-3), i * 1.1, .5); horn(s, hz(2), i * 1.1 + .55, .5); } blink(); };
      const c1 = card("🚑", "Martinshorn", "Quarte", "In Deutschland ist es vorgeschrieben: Die zwei Töne müssen eine Quarte auseinander liegen, zum Beispiel a′ und d″.", p1,
        [btn(s, "▶ a′ – d″", tatu, true), s.soundBtn("martinshorn", "echt", { dur: 5 })]);
      // 2 Türgong
      const p2 = s.svg(170, 110), bellG = s.el("g");
      bellG.append(s.el("path", { d: "M85 10 C62 10 56 34 56 52 L48 68 L122 68 L114 52 C114 34 108 10 85 10 Z", fill: "#f2b705", stroke: INK, "stroke-width": 3 }), s.el("circle", { cx: 85, cy: 78, r: 8, fill: INK }));
      p2.append(bellG);
      const swing = () => s.tween({ from: 0, to: 1, dur: 1400, ease: "linear", update: k => bellG.setAttribute("transform", `rotate(${Math.sin(k * Math.PI * 4) * 18 * (1 - k)} 85 10)`) });
      const c2 = card("🚪", "Türgong", "gr. Terz", "„Ding – dong“: Viele Gongs springen eine große Terz nach unten, zum Beispiel e″ – c″.", p2,
        [btn(s, "▶ e″ – c″", () => { bell(s, 4, 1.4); bell(s, 0, 1.8, .55); swing(); }, true), s.soundBtn("doorbell", "echt")]);
      // 3 Gitarre stimmen
      const p3 = s.photo("guitar", { w: 170, h: 110, pos: "50% 50%" });
      const c3 = card("🎸", "Gitarre stimmen", "Quarte", "Die leeren Saiten E – A – d – g liegen jeweils eine Quarte auseinander. So kann man sie nach Gehör stimmen.", p3,
        [btn(s, "▶ E – A – d – g", () => [-32, -27, -22, -17].forEach((n, i) => pno(s, n, 1, i * .6, .22)), true)]);
      // 4 Kuckuck
      const p4 = s.photo("kuckuck-vogel", { w: 170, h: 110, pos: "60% 40%" });
      const c4 = card("🌲", "Kuckuck", "Terz", "Der Kuckuck ruft zwei Töne von oben nach unten. Im Kinderlied ist daraus eine kleine Terz geworden.", p4,
        [btn(s, "▶ Lied", () => mel(s, [[-5, 1], [-8, 1.5], [-5, 1], [-8, 1.5]]), true), s.soundBtn("kuckuck", "echt", { dur: 5 })]);
      s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", height: "100%", alignContent: "center" } }, c1, c2, c3, c4));
      const acts = [tatu, () => { bell(s, 4, 1.4); bell(s, 0, 1.8, .55); swing(); }, () => [-32, -27, -22, -17].forEach((n, i) => pno(s, n, 1, i * .6, .22)), () => s.sound("kuckuck", { dur: 4 })];
      [c1, c2, c3, c4].forEach((c, i) => s.step(async () => { s.show(c, "pop"); acts[i](); }));
    },
  });

  /* ================================================================ TEIL B: MUSIK DER WELT */
  /* 9 ---------------------------------------------------------------- */
  SLIDES.push({
    title: "Musik der Welt: die Karte",
    say: "Jetzt reisen wir um die Welt. Tippe auf einen Punkt auf der Karte, dann hörst du das Instrument von dort.",
    build(s) {
      const W = 1100, H = 382;
      const P = (lon, lat) => [(lon + 180) * W / 360, (75 - lat) * H / 125];
      const PLACES = [
        { k: "berlin", n: "Berlin", ll: [13.4, 52.5], lab: [660, 34], col: INK, snd: null, t: "Hier bist du! Von Berlin aus reisen wir zu den Instrumenten." },
        { k: "dudel", n: "Dudelsack", ll: [-4.2, 57], lab: [452, 38], col: VIOLET, snd: "dudelsack-melodie", t: "Schottland: Der Dudelsack hat Bordunpfeifen für den Dauerton – kennst du aus Kapitel 6." },
        { k: "alp", n: "Alphorn", ll: [8.2, 46.8], lab: [462, 112], col: RED, snd: "alphorn-ruf", t: "Schweiz: Das Alphorn ist über drei Meter lang und hat keine Klappen." },
        { k: "djembe", n: "Djembe", ll: [-8, 12.6], lab: [432, 196], col: C, snd: "djembe-groove", t: "Westafrika (Mali, Guinea): Die Djembe wird mit bloßen Händen gespielt." },
        { k: "sitar", n: "Sitar & Tabla", ll: [78, 22], lab: [770, 232], col: GREEN, snd: "sitar-raga", t: "Indien: Die Sitar hat viele Saiten, die Tabla sind zwei Trommeln." },
        { k: "gamelan", n: "Gamelan", ll: [110, -7.5], lab: [846, 322], col: "#b45309", snd: "gamelan-bali", t: "Indonesien (Java, Bali): Ein Gamelan ist ein ganzes Orchester aus Gongs und Metallplatten." },
        { k: "didge", n: "Didgeridoo", ll: [134, -12.5], lab: [1028, 214], col: "#9a3412", snd: "didgeridoo-drone", t: "Nordaustralien: Das Didgeridoo ist ein Baumstamm, den Termiten ausgehöhlt haben." },
        { k: "pan", n: "Steel Pan", ll: [-61.2, 10.5], lab: [300, 150], col: BLUE, snd: "steelpan-melodie", t: "Trinidad und Tobago (Karibik): Die Steel Pan wird aus Ölfässern gebaut." },
      ];
      const wrap = s.h("div", { style: { position: "relative", width: W + "px", height: H + "px", borderRadius: "16px", overflow: "hidden" } });
      wrap.append(s.photo("weltkarte", { w: W, h: H, style: { borderRadius: "16px" } }));
      const svg = s.svg(W, H); svg.style.position = "absolute"; svg.style.left = "0"; svg.style.top = "0";
      wrap.append(svg);
      const info = s.h("div", { class: "card", style: { display: "grid", gridTemplateColumns: "1fr auto", gap: "16px", alignItems: "center", padding: "12px 18px" } });
      const iName = s.h("p", { class: "h2", style: { color: C } }, "Tippe auf einen Punkt!"), iTxt = s.h("p", { class: "small" }, "Auf der Karte siehst du, woher die Instrumente kommen.");
      let curSnd = null, curH = null;
      const again = btn(s, "▶ anhören", () => { if (curSnd) { if (curH) curH.stop(); curH = s.sound(curSnd, { force: true, dur: 6 }); } }, true);
      info.append(s.h("div", { class: "stack", style: { gap: "4px" } }, iName, iTxt), again);
      const pins = PLACES.map(pl => {
        const [x, y] = P(...pl.ll), [lx, ly] = pl.lab;
        const tw = pl.n.length * 11.5 + 20;
        const g = s.el("g", { class: "later", style: { cursor: "pointer" } });
        g.append(s.el("line", { x1: x, y1: y, x2: lx, y2: ly, stroke: "#fff", "stroke-width": 2.5 }));
        g.append(s.el("rect", { x: lx - tw / 2, y: ly - 17, width: tw, height: 32, rx: 10, fill: "#fff", stroke: pl.col, "stroke-width": 3 }));
        g.append(s.el("text", { x: lx, y: ly + 6, "text-anchor": "middle", "font-size": 19, "font-weight": 800, fill: pl.col, text: pl.n }));
        const ring = s.el("circle", { cx: x, cy: y, r: 10, fill: "none", stroke: "#fff", "stroke-width": 3 });
        g.append(ring, s.el("circle", { cx: x, cy: y, r: 9, fill: pl.k === "berlin" ? "#ffd94a" : pl.col, stroke: "#fff", "stroke-width": 2.5 }));
        svg.append(g);
        const pick = (tap = true) => {
          iName.textContent = pl.n; iName.style.color = pl.col; iTxt.textContent = pl.t; curSnd = pl.snd;
          again.style.visibility = pl.snd ? "visible" : "hidden";
          if (curH) curH.stop();
          curH = pl.snd ? s.sound(pl.snd, { force: tap, dur: 5, vol: .9 }) : null;
          if (!pl.snd) s.sfx.ding();
          s.tween({ from: 0, to: 1, dur: 900, ease: "out", update: k => { ring.setAttribute("r", 10 + k * 22); ring.setAttribute("opacity", 1 - k); } });
        };
        g.addEventListener("pointerdown", e => { e.preventDefault(); s.sfx.unlock(); pick(true); });
        return { g, pick };
      });
      again.style.visibility = "hidden";
      s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%", justifyContent: "center" } }, wrap, info));
      s.show(wrap, "zoom"); s.sfx.whoosh();
      s.step(async () => { await s.show(pins[0].g, "pop"); pins[0].pick(false); s.say("Wir starten in Berlin."); });
      [[1, 2], [3], [4], [5, 6], [7]].forEach(grp => s.step(async () => {
        for (const i of grp) { s.show(pins[i].g, "pop"); await s.wait(200); }
        pins[grp[grp.length - 1]].pick(false); s.say(PLACES[grp[grp.length - 1]].t);
      }));
    },
  });

  /* 10 --------------------------------------------------------------- */
  SLIDES.push({
    title: "Gamelan aus Indonesien",
    say: "Ein Gamelan ist ein ganzes Orchester aus Gongs, Metallplatten und Trommeln. Die Musik läuft in Runden. Der große Gong zeigt, wann eine Runde zu Ende ist.",
    build(s) {
      const Q = seq(s);
      const ph = s.photo("gamelan", { w: 440, h: 270, pos: "50% 55%", caption: "Gamelan-Spieler auf Java" });
      const facts = s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, "Gut zu wissen"),
        s.h("p", { class: "small" }, "Gamelan kommt aus Indonesien, vor allem von Java und Bali. Die Instrumente sind aus Bronze. Seit 2021 gehört Gamelan zum Kulturerbe der UNESCO."));
      const left = s.h("div", { class: "stack", style: { gap: "10px" } }, ph, s.soundBtn("gamelan-bali", "Echtes Gamelan auf Bali", { solid: true }), facts);
      // cycle of 16 beats
      const svg = s.svg(400, 360), cx = 200, cy = 175, R = 140, N = 16;
      svg.append(s.el("circle", { cx, cy, r: R, fill: "none", stroke: "#e6dcc4", "stroke-width": 6 }));
      const beats = [];
      for (let i = 1; i <= N; i++) {
        const a = -Math.PI / 2 + i * 2 * Math.PI / N, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
        const big = i === N, mid = i % 4 === 0 && !big;
        const c = s.el("circle", { cx: x, cy: y, r: big ? 26 : mid ? 16 : 8, fill: big ? "#7c4a03" : mid ? C : "#d9c9a0", stroke: "#fff", "stroke-width": 2 });
        svg.append(c); beats.push({ c, big, mid, x, y });
      }
      svg.append(s.el("text", { x: cx, y: cy - R + 7, "text-anchor": "middle", "font-size": 19, "font-weight": 800, fill: "#fff", text: "Gong" }));
      const hand = s.el("line", { x1: cx, y1: cy, x2: cx, y2: cy - R + 34, stroke: INK, "stroke-width": 4, "stroke-linecap": "round" });
      svg.append(hand, s.el("circle", { cx, cy, r: 8, fill: INK }));
      svg.append(s.el("text", { x: cx, y: 350, "text-anchor": "middle", "font-size": 19, fill: PENCIL, text: "groß = großer Gong · mittel = kleine Gongs" }));
      const MEL = [2, 4, 7, 4, 9, 7, 4, 2, 4, 7, 9, 12, 9, 7, 4, 0];
      let playing = false;
      const round = async () => {
        const t = Q.start(); playing = true;
        for (let r = 0; r < 2; r++) for (let i = 0; i < N; i++) {
          if (!Q.ok(t)) { playing = false; return; }
          const b = beats[i], a = -Math.PI / 2 + (i + 1) * 2 * Math.PI / N;
          hand.setAttribute("x2", cx + (R - 34) * Math.cos(a)); hand.setAttribute("y2", cy + (R - 34) * Math.sin(a));
          bell(s, MEL[i], .5, 0, .14);
          if (b.big) s.sound("gong", { vol: .7, dur: 3 });
          else if (b.mid) { s.sfx.tone(hz(-17), 1.2, "sine", .2); s.sfx.tone(hz(-5), .6, "sine", .05); }
          s.tween({ from: 1.5, to: 1, dur: 260, ease: "out", update: k => b.c.setAttribute("transform", `translate(${b.x * (1 - k)} ${b.y * (1 - k)}) scale(${k})`) });
          await s.wait(330);
        }
        playing = false;
      };
      const merk = s.h("div", { class: "merk later" }, "Gamelan-Musik läuft ", s.h("b", null, "in Runden"), ". Der ", s.h("b", null, "große Gong"), " schlägt am Ende jeder Runde, kleinere Gongs teilen sie in Stücke.");
      const right = s.h("div", { class: "stack", style: { gap: "10px", alignItems: "center" } }, svg,
        s.h("div", { class: "row", style: { gap: "10px" } }, btn(s, "▶ Zwei Runden", () => { if (!playing) round(); }, true), btn(s, "Stopp", () => Q.stop())), merk);
      s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "440px 1fr", gap: "24px", alignItems: "center", height: "100%" } }, left, right));
      s.show(ph, "zoom"); s.sound("gamelan-bali", { dur: 4.5, vol: .8 });
      s.step(async () => { s.show(svg, "pop"); round(); s.say("Hör auf den großen Gong am Ende jeder Runde."); });
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
      s.step(async () => { s.sfx.pop(); await s.show(facts, "up"); });
    },
  });

  /* 11 --------------------------------------------------------------- */
  SLIDES.push({
    title: "Trommeln aus Westafrika",
    say: "Die Djembe kommt aus Westafrika. Mit der Hand spielst du drei Klänge: in der Mitte den tiefen Bass, am Rand den Ton und ganz außen den knallenden Slap.",
    build(s) {
      const Q = seq(s);
      const ph = s.photo("djembe", { w: 300, h: 300, pos: "50% 45%", caption: "Djembe" });
      const svg = s.svg(330, 330), cx = 165, cy = 165;
      const zones = [
        s.el("circle", { cx, cy, r: 150, fill: "#e9d3a6", stroke: "#7a4a1e", "stroke-width": 8 }),
        s.el("circle", { cx, cy, r: 120, fill: "#f1e0bb" }),
        s.el("circle", { cx, cy, r: 70, fill: "#f7ecd4" }),
      ];
      svg.append(...zones);
      const lab = (y, t) => s.el("text", { x: cx, y, "text-anchor": "middle", "font-size": 20, "font-weight": 800, fill: "#7a4a1e", text: t });
      svg.append(lab(cy + 7, "Bass"), lab(cy - 88, "Ton"), lab(cy + 140, "Slap"));
      const fx = s.el("g", { style: { pointerEvents: "none" } }); svg.append(fx);
      const SND = {
        bass: () => { s.sfx.tone(78, .5, "sine", .7, 0, 50); s.sfx.noise(.08, .06, 300, 150); },
        ton: () => { s.sfx.tone(230, .28, "sine", .45, 0, 205); s.sfx.tone(460, .12, "triangle", .08); },
        slap: () => { s.sfx.noise(.09, .35, 3500, 2000, 0, 1.5); s.sfx.tone(520, .07, "square", .06); },
      };
      const ripple = (x, y, col) => { const c = s.el("circle", { cx: x, cy: y, r: 6, fill: "none", stroke: col, "stroke-width": 4 }); fx.append(c); s.tween({ from: 0, to: 1, dur: 500, ease: "out", update: k => { c.setAttribute("r", 6 + k * 40); c.setAttribute("opacity", 1 - k); } }).then(() => c.remove()); };
      const hitAt = (kind, x, y) => { SND[kind](); ripple(x, y, kind === "bass" ? BLUE : kind === "ton" ? GREEN : RED); };
      const POS = { bass: [cx, cy], ton: [cx + 70, cy - 70], slap: [cx - 100, cy + 100] };
      svg.addEventListener("pointerdown", e => {
        e.preventDefault(); s.sfx.unlock();
        const r = svg.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * 330, y = (e.clientY - r.top) / r.height * 330, d = Math.hypot(x - cx, y - cy);
        if (d > 156) return; hitAt(d < 70 ? "bass" : d < 120 ? "ton" : "slap", x, y);
      });
      const CALL = [["slap", 0], ["slap", .5], ["ton", 1], ["slap", 1.5], ["slap", 1.75]], RESP = [["bass", 0], ["ton", .5], ["ton", .75], ["bass", 1], ["ton", 1.5]];
      const chipR = s.h("span", { class: "chip", style: { background: "#f3e5c4" } }, "Ruf: Vorspieler"), chipA = s.h("span", { class: "chip", style: { background: "#f3e5c4" } }, "Antwort: alle");
      const lightChip = (c, on) => { c.style.background = on ? C : "#f3e5c4"; c.style.color = on ? "#fff" : INK; };
      const callResp = async () => {
        const t = Q.start(), b = 60 / 120 * 1000;
        for (let r = 0; r < 2; r++) {
          for (const [pat, chip] of [[CALL, chipR], [RESP, chipA]]) {
            if (!Q.ok(t)) return;
            lightChip(chip, true);
            pat.forEach(([k, w]) => s.wait(w * b).then(() => { if (Q.ok(t)) hitAt(k, ...POS[k]); }));
            await s.wait(2 * b); lightChip(chip, false);
          }
        }
      };
      const rr = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Ruf und Antwort (Kapitel 6)"),
        s.h("p", { class: "small" }, "Ein Vorspieler trommelt einen Ruf, die Gruppe antwortet. So spielen und tanzen in Westafrika viele Menschen zusammen."),
        s.h("div", { class: "row", style: { gap: "10px", marginTop: "8px", flexWrap: "nowrap" } }, btn(s, "▶ Ruf – Antwort", callResp, true), chipR, chipA));
      const merk = s.h("div", { class: "merk later" }, "Die ", s.h("b", null, "Djembe"), " ist aus einem Stück Holz geschnitzt, oben ist Ziegenfell gespannt. Drei Klänge: ", s.h("b", null, "Bass, Ton, Slap"), ".");
      const right = s.h("div", { class: "stack", style: { gap: "12px" } }, s.h("p", { class: "t" }, "Tippe auf das Fell: Mitte, Rand oder ganz außen!"),
        s.soundBtn("djembe-groove", "Echte Djembe: Bass, Ton, Slap", { solid: true }), merk);
      s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%", justifyContent: "center" } },
        s.h("div", { class: "cols", style: { gridTemplateColumns: "300px 330px 1fr", gap: "20px", alignItems: "center" } }, ph, svg, right), rr));
      s.show(svg, "zoom"); s.sfx.whoosh();
      s.step(async () => { for (const k of ["bass", "ton", "slap"]) { hitAt(k, ...POS[k]); await s.wait(500); } s.say("Bass, Ton, Slap."); });
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
      s.step(async () => { await s.show(rr, "up"); callResp(); });
    },
  });

  /* 12 --------------------------------------------------------------- */
  SLIDES.push({
    title: "Indien: Sitar und Tabla",
    say: "In Indien spielen oft Sitar und Tabla zusammen. Die Sitar hat Saiten, die von allein mitklingen. Die Tabla sind zwei Trommeln: eine hohe und eine tiefe.",
    build(s) {
      const cardOf = (id, cap, snd, sndLab, txt, later) => s.h("div", { class: "card" + (later ? " later" : ""), style: { display: "flex", flexDirection: "column", gap: "8px", padding: "12px" } },
        s.photo(id, { w: "100%", h: 138, pos: "50% 50%", caption: cap }), s.h("p", { class: "small" }, txt), s.soundBtn(snd, sndLab, { solid: true }));
      const cS = cardOf("sitar", "Sitar", "sitar-raga", "Sitar anhören", "Die Sitar hat 6 oder 7 Spielsaiten – und darunter 12 oder mehr Resonanzsaiten.", false);
      const cT = cardOf("tabla", "Tabla", "tabla-rhythmus", "Tabla anhören", "Zwei Trommeln: rechts die kleine, hohe Dayan, links die große, tiefe Bayan.", true);
      // sympathetic strings demo
      const svg = s.svg(560, 116);
      const mk = (y, w, col) => { const p = s.el("path", { d: `M20 ${y} L540 ${y}`, stroke: col, "stroke-width": w, fill: "none" }); svg.append(p); return { p, y }; };
      const main = [mk(14, 3.5, INK), mk(28, 3, INK), mk(42, 2.5, INK)];
      const sym = []; for (let i = 0; i < 7; i++) sym.push(mk(62 + i * 7.5, 1.2, "#9a7b3c"));
      const vib = (st, amp, dur, delay = 0) => s.tween({ from: 0, to: 1, dur, delay, ease: "linear", update: k => { const a = amp * (1 - k) * Math.sin(k * 60); st.p.setAttribute("d", `M20 ${st.y} Q280 ${st.y + a} 540 ${st.y}`); } });
      const pluck = () => {
        vib(main[0], 14, 1600); s.sfx.tone(hz(-15), 1.6, "sawtooth", .07); s.sfx.tone(hz(-15), 1.6, "triangle", .14);
        sym.forEach((st, i) => vib(st, 4, 2400, 250 + i * 40));
        s.sfx.tone(hz(-3), 2.2, "sine", .04, .25); s.sfx.tone(hz(-8), 2.2, "sine", .03, .3);
      };
      const demo = s.h("div", { class: "ex later", style: { display: "grid", gridTemplateColumns: "560px 1fr", gap: "16px", alignItems: "center" } }, svg,
        s.h("div", { class: "stack", style: { gap: "8px" } }, s.h("span", { class: "exlabel" }, "Resonanzsaiten"),
          s.h("p", { class: "small" }, "Oben: Spielsaiten. Unten: Resonanzsaiten. Sie werden nicht gezupft – sie schwingen von allein mit."), btn(s, "▶ Saite zupfen", pluck, true)));
      const merk = s.h("div", { class: "merk later" }, "Indische Melodien folgen einem ", s.h("b", null, "Raga"), ": einer Tonleiter mit eigenen Regeln. Oft klingt ein Bordun mit (Kapitel 6).");
      s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%", justifyContent: "center" } },
        s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 1fr", gap: "18px" } }, cS, cT), demo, merk));
      s.sound("sitar-raga", { dur: 5, vol: .8 });
      s.step(async () => { s.show(cT, "up"); s.sound("tabla-rhythmus", { dur: 5 }); });
      s.step(async () => { await s.show(demo, "up"); pluck(); s.say("Die Resonanzsaiten schwingen mit."); });
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
    },
  });

  /* 13 --------------------------------------------------------------- */
  SLIDES.push({
    title: "Australien: das Didgeridoo",
    say: "Das Didgeridoo kommt von den Aborigines aus dem Norden Australiens. Es ist ein Baumstamm, den Termiten von innen ausgehöhlt haben.",
    build(s) {
      const Q = seq(s);
      const ph = s.photo("didgeridoo", { w: 440, h: 300, pos: "45% 55%", caption: "Didgeridoo in Australien" });
      const facts = s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, "So entsteht es"),
        s.h("p", { class: "small" }, "Termiten fressen das tote Holz im Inneren eines Eukalyptusbaums. Übrig bleibt ein hohles Rohr. Daraus wird das Didgeridoo."));
      const left = s.h("div", { class: "stack", style: { gap: "10px" } }, ph, s.soundBtn("didgeridoo-drone", "Didgeridoo anhören", { solid: true }), facts);
      // timeline: normal vs circular breathing
      const svg = s.svg(560, 210), X0 = 30, X1 = 540;
      const row = (y, label) => { svg.append(s.el("text", { x: X0, y: y - 12, "font-size": 20, "font-weight": 700, fill: INK, text: label }), s.el("rect", { x: X0, y, width: X1 - X0, height: 34, rx: 8, fill: "#f3ecdf" })); };
      row(40, "Normal blasen"); row(140, "Zirkularatmung");
      const segN = [[0, .3], [.4, .7], [.8, 1]], barsN = segN.map(([a, b]) => { const r = s.el("rect", { x: X0 + a * (X1 - X0), y: 40, width: 0, height: 34, rx: 8, fill: "#9a3412" }); svg.append(r); return { r, a, b }; });
      const gaps = [.3, .7].map(a => { const t = s.el("text", { x: X0 + (a + .05) * (X1 - X0), y: 100, "text-anchor": "middle", "font-size": 19, "font-weight": 700, fill: RED, text: "Luft holen!", opacity: 0 }); svg.append(t); return t; });
      const barC = s.el("rect", { x: X0, y: 140, width: 0, height: 34, rx: 8, fill: GREEN }); svg.append(barC);
      const nose = s.el("text", { x: (X0 + X1) / 2, y: 200, "text-anchor": "middle", "font-size": 19, "font-weight": 700, fill: GREEN, text: "einatmen durch die Nase – die Wangen blasen weiter", opacity: 0 }); svg.append(nose);
      const runN = async () => {
        const t = Q.start(); barsN.forEach(b => b.r.setAttribute("width", 0)); gaps.forEach(g => g.setAttribute("opacity", 0));
        for (const [i, b] of barsN.entries()) {
          if (!Q.ok(t)) return;
          s.sound("didgeridoo-drone", { from: i * 1.6, dur: 1.5, force: true });
          await s.tween({ from: 0, to: 1, dur: 1500, ease: "linear", update: k => b.r.setAttribute("width", (b.b - b.a) * (X1 - X0) * k) });
          if (i < 2) { gaps[i].setAttribute("opacity", 1); s.sfx.noise(.5, .08, 600, 1500); await s.wait(600); }
        }
      };
      const runC = async () => {
        const t = Q.start(); barC.setAttribute("width", 0);
        s.sound("didgeridoo-drone", { dur: 5.4, force: true });
        await s.tween({ from: 0, to: 1, dur: 5400, ease: "linear", update: k => { if (Q.ok(t)) { barC.setAttribute("width", k * (X1 - X0)); nose.setAttribute("opacity", Math.sin(k * Math.PI * 3) > 0 ? 1 : .35); } } });
      };
      const merk = s.h("div", { class: "merk later" }, "Mit der ", s.h("b", null, "Zirkularatmung"), " klingt der tiefe Ton ohne Pause – wie ein Bordun. Gute Spieler schaffen das minutenlang.");
      const right = s.h("div", { class: "stack", style: { gap: "10px" } }, svg, s.h("div", { class: "row", style: { gap: "10px" } }, btn(s, "▶ normal", runN), btn(s, "▶ Zirkularatmung", runC, true)), merk);
      s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "440px 1fr", gap: "24px", alignItems: "center", height: "100%" } }, left, right));
      s.show(ph, "zoom"); s.sfx.whoosh();
      s.step(async () => { await runN(); s.say("Wer normal bläst, muss Pausen zum Luftholen machen."); });
      s.step(async () => { await runC(); s.say("Mit Zirkularatmung klingt der Ton ohne Pause weiter."); });
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.show(facts, "up", 300); });
    },
  });

  /* 14 --------------------------------------------------------------- */
  SLIDES.push({
    title: "Trinidad: die Steel Pan",
    say: "Die Steel Pan kommt aus Trinidad und Tobago in der Karibik. Sie wird aus alten Ölfässern gebaut. Die Töne liegen im Kreis, und Nachbarn sind eine Quinte voneinander entfernt.",
    build(s) {
      const Q = seq(s);
      const ph = s.photo("steelpan", { w: 440, h: 280, pos: "50% 50%", caption: "Steelband beim Karneval" });
      const facts = s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, "Gut zu wissen"),
        s.h("p", { class: "small" }, "Die Steel Pan entstand in den 1930er- und 1940er-Jahren. Seit 1992 ist sie das Nationalinstrument von Trinidad und Tobago."));
      const left = s.h("div", { class: "stack", style: { gap: "10px" } }, ph, s.soundBtn("steelpan-melodie", "Echte Steel Pans", { solid: true }), facts);
      const NAMES = ["c", "g", "d", "a", "e", "h", "fis", "cis", "gis", "es", "b", "f"], SEMI = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5];
      const svg = s.svg(400, 400), cx = 200, cy = 200;
      svg.append(s.el("circle", { cx, cy, r: 192, fill: "#9aa3ad" }), s.el("circle", { cx, cy, r: 180, fill: "#d7dde3" }), s.el("circle", { cx, cy, r: 70, fill: "#c4ccd4" }));
      const arcG = s.el("g", { style: { pointerEvents: "none" } });
      const fields = NAMES.map((nm, i) => {
        const a = -Math.PI / 2 + i * 2 * Math.PI / 12, x = cx + 128 * Math.cos(a), y = cy + 128 * Math.sin(a);
        const g = s.el("g", { style: { cursor: "pointer" } });
        const e = s.el("ellipse", { cx: x, cy: y, rx: 30, ry: 38, transform: `rotate(${i * 30} ${x} ${y})`, fill: "#eef1f4", stroke: "#7d8792", "stroke-width": 2 });
        g.append(e, s.el("text", { x, y: y + 7, "text-anchor": "middle", "font-size": 21, "font-weight": 800, fill: INK, text: nm }));
        svg.append(g);
        const f = { g, e, x, y, n: SEMI[i] - 12 + (SEMI[i] < 5 ? 12 : 0) };
        g.addEventListener("pointerdown", ev => { ev.preventDefault(); s.sfx.unlock(); tap(i); });
        return f;
      });
      svg.setAttribute("width", 340); svg.setAttribute("height", 340);
      svg.append(arcG, s.el("text", { x: cx, y: cy + 7, "text-anchor": "middle", "font-size": 20, "font-weight": 800, fill: PENCIL, text: "Quinten" }));
      const flash = i => { const e = fields[i].e; e.setAttribute("fill", LIGHT); s.wait(380).then(() => { if (s.alive) e.setAttribute("fill", "#eef1f4"); }); };
      const tap = i => { pan(s, fields[i].n); flash(i); };
      const link = (i, j) => { const a = fields[i], b = fields[j]; const l = s.el("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: RED, "stroke-width": 5, "stroke-linecap": "round", opacity: .8 }); arcG.append(l); s.tween({ from: .8, to: 0, dur: 1400, delay: 300, update: v => l.setAttribute("opacity", v) }).then(() => l.remove()); };
      const tour = async () => { const t = Q.start(); for (let i = 0; i < 13; i++) { if (!Q.ok(t)) return; tap(i % 12); if (i) link((i - 1) % 12, i % 12); await s.wait(330); } };
      const pair = async () => { const t = Q.start(); for (const [a, b] of [[0, 1], [1, 2], [2, 3]]) { if (!Q.ok(t)) return; link(a, b); pan(s, fields[a].n); pan(s, fields[b].n); flash(a); flash(b); await s.wait(800); } };
      const merk = s.h("div", { class: "merk later" }, "Auf der Steel Pan liegen die Töne im ", s.h("b", null, "Quintenkreis"), ": Im Uhrzeigersinn folgt immer der Ton eine Quinte höher – c, g, d, a … Nachbarn klingen gut zusammen.");
      const right = s.h("div", { class: "stack", style: { gap: "10px", alignItems: "center" } }, svg, s.h("div", { class: "row", style: { gap: "10px" } }, btn(s, "▶ Rundgang", tour, true), btn(s, "▶ Nachbarn zusammen", pair)));
      s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "440px 1fr", gap: "20px", alignItems: "center", height: "100%" } }, left, s.h("div", { class: "stack", style: { gap: "10px" } }, right, merk)));
      s.show(ph, "zoom"); s.sound("steelpan-melodie", { dur: 4, vol: .8 });
      s.step(async () => { await tour(); s.say("c, g, d, a, e: immer eine Quinte weiter."); });
      s.step(async () => { s.sfx.ding(); s.show(merk, "up"); await pair(); });
      s.step(async () => { s.sfx.pop(); await s.show(facts, "up"); });
    },
  });

  /* 15 --------------------------------------------------------------- */
  SLIDES.push({
    title: "Alpen: Alphorn und Jodeln",
    say: "Das Alphorn hat keine Klappen und keine Ventile. Es kann nur Naturtöne spielen. Zwischen den Naturtönen liegen genau die Intervalle, die du kennst: Oktave, Quinte, Quarte, Terz.",
    build(s) {
      const Q = seq(s);
      const ph = s.photo("alphorn", { w: 440, h: 250, pos: "50% 45%", caption: "Alphorn im Wallis (Schweiz)" });
      const jod = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Jodeln"),
        s.h("p", { class: "small" }, "Beim Jodeln springt die Stimme schnell zwischen tiefer Bruststimme und hoher Kopfstimme hin und her."),
        s.h("div", { class: "row", style: { marginTop: "6px" } }, s.soundBtn("jodler", "Jodler aus der Schweiz")));
      const left = s.h("div", { class: "stack", style: { gap: "10px" } }, ph, s.soundBtn("alphorn-ruf", "Zwei Alphörner", { solid: true }), jod);
      // natural tone ladder
      const F0 = 65.41; // Grundton C (zum Vergleich mit f und fis)
      const svg = s.svg(560, 330), base = 312, u = 110; // y = base - log2(k) * u
      const yOf = k => base - Math.log2(k) * u;
      const IVS = [[1, 2, "Oktave"], [2, 3, "Quinte"], [3, 4, "Quarte"], [4, 5, "gr. Terz"], [5, 6, "kl. Terz"]];
      const rungs = [1, 2, 3, 4, 5, 6].map(k => {
        const g = s.el("g", { class: "later", style: { cursor: "pointer" } }), y = yOf(k);
        g.append(s.el("rect", { x: 40, y: y - 11, width: 240, height: 23, rx: 7, fill: C, opacity: .85 }),
          s.el("text", { x: 160, y: y + 7, "text-anchor": "middle", "font-size": 19, "font-weight": 800, fill: "#fff", text: k + ". Naturton" }));
        g.addEventListener("pointerdown", e => { e.preventDefault(); s.sfx.unlock(); horn(s, F0 * k); });
        svg.append(g); return g;
      });
      const ivl = IVS.map(([a, b, n]) => {
        const g = s.el("g", { class: "later" }), y1 = yOf(a), y2 = yOf(b);
        g.append(s.el("path", { d: `M290 ${y1} Q330 ${(y1 + y2) / 2} 290 ${y2}`, fill: "none", stroke: RED, "stroke-width": 3 }),
          s.el("text", { x: 340, y: (y1 + y2) / 2 + 7, "font-size": 20, "font-weight": 800, fill: RED, text: n }));
        svg.append(g); return g;
      });
      const climb = async () => { const t = Q.start(); for (let k = 1; k <= 6; k++) { if (!Q.ok(t) && !s.fast) return; s.show(rungs[k - 1], "left"); horn(s, F0 * k, 0, .8); if (k > 1) s.show(ivl[k - 2], "pop"); await s.wait(650); } };
      const fa = () => { const t = Q.start(); horn(s, F0 * 11, 0, 1.2); s.wait(1300).then(() => { if (Q.ok(t)) { pno(s, 5, 0.9, 0, .18); } }); s.wait(2300).then(() => { if (Q.ok(t)) pno(s, 6, 0.9, 0, .18); }); };
      const merk = s.h("div", { class: "merk later" }, "Das Alphorn ist rund ", s.h("b", null, "3,5 Meter"), " lang und hat keine Klappen. Es spielt nur ", s.h("b", null, "Naturtöne"), ". Der 11. Naturton, das „Alphorn-Fa“, liegt zwischen f und fis.");
      const right = s.h("div", { class: "stack", style: { gap: "10px" } }, svg,
        s.h("div", { class: "row", style: { gap: "10px" } }, btn(s, "▶ Naturtöne hinauf", climb, true), btn(s, "▶ Alphorn-Fa, f, fis", fa)), merk);
      s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "440px 1fr", gap: "24px", alignItems: "center", height: "100%" } }, left, right));
      s.show(ph, "zoom"); s.sound("alphorn-ruf", { dur: 5, vol: .8 });
      s.step(async () => { await climb(); s.say("Oktave, Quinte, Quarte, große Terz, kleine Terz."); });
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); fa(); });
      s.step(async () => { await s.show(jod, "up"); s.sound("jodler", { dur: 6, vol: .8 }); });
    },
  });

  /* 16 --------------------------------------------------------------- */
  SLIDES.push({
    title: "Pentatonik rund um die Welt",
    say: "Fünf Töne ohne Halbtonschritte: Die Pentatonik gibt es auf der ganzen Welt. In Schottland, in China, in Indonesien. Und auf den schwarzen Tasten!",
    build(s) {
      const Q = seq(s);
      const svg = s.svg(1100, 250);
      const K = kb(s, 40, 40, -7, 16, 1020, 206, { bwf: 0.74 });
      svg.append(K.g);
      K.whites.forEach(n => K.tint(n, "#eceff3"));
      const BN = { 6: "fis", 8: "gis", 10: "ais", 1: "cis", 3: "dis" };
      for (let n = -7; n <= 16; n++) if (isB(n)) { K.tint(n, C); K.label(n, BN[pc(n)], { fs: 19 }); }
      const playOn = (notes, beat = .36, f = pno) => { const t = Q.start(); let w = 0; for (const [n, b] of notes) { const ww = w; s.wait(ww * 1000).then(() => { if (Q.ok(t)) { f(s, n, b * beat, 0, .2); K.hit(n, "#ffd94a", Math.min(400, b * beat * 900)); } }); w += b * beat; } };
      // Auld Lang Syne (traditional, pentatonic), transposed to Fis = black keys only
      const AULD = [[-11, 1], [-6, 1.5], [-6, .5], [-6, 1], [-2, 1], [-4, 1.5], [-6, .5], [-4, 1], [-2, 1], [-6, 1.5], [-6, .5], [-2, 1], [1, 1], [3, 3]];
      const CHINA = [[3, 1], [1, .5], [-2, .5], [1, 1], [-4, 1], [-2, .5], [-4, .5], [-6, 1], [-4, 1], [-2, 2]]; // eigene Melodie
      const GAM = [[1, .5], [3, .5], [6, .5], [3, .5], [8, .5], [6, .5], [3, .5], [1, .5], [-2, .5], [1, .5], [3, 1]]; // eigene Melodie
      const c1 = exCard(s, "Schottland", "🎵", "„Auld Lang Syne“ (Robert Burns, 1788) wird auf eine alte pentatonische Volksmelodie gesungen.", () => playOn(AULD), true);
      const c2 = exCard(s, "China", "🏮", "Viele traditionelle chinesische Melodien kommen mit fünf Tönen aus. Hier eine Melodie im Stil.", () => playOn(CHINA, .4), true);
      const c3 = exCard(s, "Indonesien", "🔔", "Die Gamelan-Stimmung Slendro hat fünf Töne in der Oktave. Hier ähnlich auf dem Glockenspiel.", () => playOn(GAM, .28, (s2, n, d) => bell(s2, n, .8)), true);
      const merk = s.h("div", { class: "merk later" }, "Die ", s.h("b", null, "Pentatonik"), " hat 5 Töne und keine Halbtonschritte (Kapitel 4). Darum klingt sie überall auf der Welt sanft und ohne Reibung.");
      s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%", justifyContent: "center" } }, svg, merk, s.h("div", { class: "cols3", style: { gap: "16px" } }, c1, c2, c3)));
      s.show(svg, "up"); s.sfx.whoosh();
      s.step(async () => { playOn(AULD); s.show(c1, "up"); s.say("Auld Lang Syne aus Schottland: nur auf schwarzen Tasten."); });
      s.step(async () => { playOn(CHINA, .4); s.show(c2, "up"); });
      s.step(async () => { playOn(GAM, .28, (s2, n, d) => bell(s2, n, .8)); s.show(c3, "up"); });
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
    },
  });

  /* 17 --------------------------------------------------------------- */
  SLIDES.push({
    title: "Das hast du gelernt",
    say: "Super! Du kannst jetzt Intervalle zählen und hören, und du kennst Instrumente aus aller Welt.",
    build(s) {
      const tile = (ttl, txt, fn, i) => s.h("button", { class: "card a-pop", style: { "--d": i * 90 + "ms", textAlign: "left", font: "inherit", color: INK, cursor: "pointer", display: "flex", flexDirection: "column", gap: "6px" }, onclick: fn },
        s.h("span", { class: "h2", style: { color: C } }, "▶ " + ttl), s.h("span", { class: "small" }, txt));
      const tiles = [
        ["Intervall", "Abstand zwischen zwei Tönen. Beide Töne zählen mit.", () => { pno(s, -12, .5); pno(s, -5, .7, .5); }],
        ["Prime bis Oktave", "1 Prime, 2 Sekunde, 3 Terz, 4 Quarte, 5 Quinte, 6 Sexte, 7 Septime, 8 Oktave.", () => [-12, -10, -8, -7, -5, -3, -1, 0].forEach((n, i) => pno(s, n, .3, i * .25))],
        ["Große und kleine Terz", "4 Halbtöne klingen nach Dur, 3 Halbtöne nach Moll.", () => { pno(s, -12, .6); pno(s, -8, .6, .5); pno(s, -12, .6, 1.3); pno(s, -9, .7, 1.8); }],
        ["Konsonanz, Dissonanz", "Quinte verschmilzt, Sekunde reibt sich.", () => { pno(s, -12, 1); pno(s, -5, 1); pno(s, -12, 1, 1.2); pno(s, -11, 1, 1.2); }],
        ["Musik der Welt", "Gamelan, Djembe, Sitar, Didgeridoo, Steel Pan, Alphorn.", () => s.sound("gamelan-bali", { force: true, dur: 4 })],
        ["Pentatonik", "5 Töne ohne Halbtöne – von Schottland bis Indonesien.", () => [-6, -4, -2, 1, 3, 1, -2].forEach((n, i) => pno(s, n, .4, i * .28))],
      ].map(([a, b, f], i) => tile(a, b, f, i));
      const merk = s.h("div", { class: "merk later" }, "Hör beim nächsten Lied genau hin: ", s.h("b", null, "Mit welchem Intervall fängt es an?"), " Und aus welchem Land kommen die Instrumente?");
      s.add(s.h("div", { class: "stack", style: { gap: "18px", height: "100%", justifyContent: "center" } }, s.h("div", { class: "cols3" }, tiles), merk));
      s.sfx.success();
      s.step(async () => { s.sfx.fanfare(); await s.show(merk, "up"); s.confetti(590, 400, 80); });
    },
  });

  SLIDES.forEach(sl => { const b = sl.build; sl.build = s => { s.preload(MEDIA_IDS); b(s); }; });

  Deck.unit({
    id: "u9", num: 9, title: "Intervalle und Musik der Welt", color: C, soft: SOFT,
    subtitle: "Abstände zwischen Tönen – und Klänge aus aller Welt",
    blurb: "Prime bis Oktave – und Instrumente aus aller Welt.",
    goals: ["Intervalle von der Prime bis zur Oktave zählen", "Intervalle an Liedanfängen erkennen", "Große und kleine Terz, Konsonanz und Dissonanz hören", "Instrumente aus aller Welt kennenlernen", "Die Pentatonik rund um die Welt entdecken"],
    icon(svg, el) {
      svg.append(el("circle", { cx: 35, cy: 35, r: 30, fill: C, opacity: .14 }));
      svg.append(el("circle", { cx: 35, cy: 35, r: 22, fill: "none", stroke: C, "stroke-width": 3 }), el("path", { d: "M13 35 H57 M35 13 C25 22 25 48 35 57 C45 48 45 22 35 13", fill: "none", stroke: C, "stroke-width": 2.5 }));
      svg.append(el("circle", { cx: 18, cy: 54, r: 6, fill: RED }), el("circle", { cx: 54, cy: 18, r: 6, fill: RED }), el("path", { d: "M18 54 Q20 20 54 18", fill: "none", stroke: RED, "stroke-width": 3, "stroke-dasharray": "4 4" }));
    },
    slides: SLIDES,
  });
})();
