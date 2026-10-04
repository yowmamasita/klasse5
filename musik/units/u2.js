/* Kapitel 2 – Noten lesen (Musik Klasse 5) */
(() => {
  const COL = "#0f766e";
  const INK = "#1b2740";
  const DIA = [0, 2, 4, 5, 7, 9, 11], NAMES = "cdefgah";
  const pc = d => ((d % 7) + 7) % 7;
  /** d = diatonic index, 0 = c′ ; returns semitones relative to c″ (C5) */
  const semi = d => Math.floor(d / 7) * 12 + DIA[pc(d)] - 12;
  const hz = n => 523.25 * Math.pow(2, n / 12);
  const nname = d => d >= 0 ? NAMES[pc(d)] + (d < 7 ? "′" : d < 14 ? "″" : "‴") : NAMES[pc(d)];
  const fmtHz = (s, d) => s.fmt(hz(semi(d)), 2) + " Hz";

  /* ---------- audio ---------- */
  function play(s, freq, dur = 1, o = {}) {
    if (!s.sfx.on || s.fast || !s.alive) return;
    const ac = s.sfx.unlock(); if (!ac) return;
    const t = ac.currentTime + (o.when || 0);
    const osc = ac.createOscillator();
    const harm = o.harm || [1, .5, .3, .16, .09, .05];
    const re = new Float32Array(harm.length + 1), im = new Float32Array(harm.length + 1);
    harm.forEach((a, i) => { im[i + 1] = a; });
    osc.setPeriodicWave(ac.createPeriodicWave(re, im));
    osc.frequency.setValueAtTime(freq, t);
    const g = ac.createGain(), v = (o.vol || .3) * .55;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + .008);
    if (o.hold) { g.gain.setValueAtTime(v, t + dur - .08); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); }
    else g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(ac.destination);
    osc.start(t); osc.stop(t + dur + .05);
    s.onLeave(() => { try { osc.stop(); } catch (e) {} });
  }
  const piano = (s, n, dur = 1.1, when = 0, vol = .3) => play(s, hz(n), dur, { when, vol });
  const pianoD = (s, d, dur, when) => piano(s, semi(d), dur, when);

  /* ---------- notation drawing ---------- */
  function clefPath(xc, yG, u) {
    const P = (x, y) => `${(xc + x * u).toFixed(1)} ${(yG + y * u).toFixed(1)}`;
    return `M${P(-.55, 2.05)} C${P(-.6, 2.75)} ${P(.55, 2.8)} ${P(.45, 1.9)} L${P(.05, -3.3)} C${P(-.05, -4.3)} ${P(.95, -4.7)} ${P(.95, -3.6)} C${P(.95, -2.6)} ${P(-1.05, -1.9)} ${P(-1.05, -.2)} C${P(-1.05, 1.05)} ${P(1.1, 1.1)} ${P(1.1, .05)} C${P(1.1, -.75)} ${P(-.15, -.85)} ${P(-.2, .05)}`;
  }
  function bassClef(s, g, xc, yF, u) {
    g.append(s.el("path", { d: `M${xc} ${yF} C${xc} ${yF - 1.3 * u} ${xc + 2.1 * u} ${yF - 1.3 * u} ${xc + 2.1 * u} ${yF + .2 * u} C${xc + 2.1 * u} ${yF + 1.7 * u} ${xc + .9 * u} ${yF + 2.8 * u} ${xc - .3 * u} ${yF + 3.4 * u}`, fill: "none", stroke: INK, "stroke-width": u * .26, "stroke-linecap": "round" }),
      s.el("circle", { cx: xc + .1 * u, cy: yF, r: u * .36, fill: INK }), s.el("circle", { cx: xc + 2.75 * u, cy: yF - .5 * u, r: u * .18, fill: INK }), s.el("circle", { cx: xc + 2.75 * u, cy: yF + .5 * u, r: u * .18, fill: INK }));
  }
  /** staff: lines from x0..x1, top line at y=top, spacing gap. clef "g" | "f" | null. off: p = d + off */
  function staff(s, svg, { x0, x1, top, gap, clef = "g", lineColor = INK }) {
    const g = s.el("g"); svg.append(g);
    const bottom = top + 4 * gap;
    const off = clef === "f" ? 10 : -2;
    const lines = [0, 1, 2, 3, 4].map(i => s.el("line", { x1: x0, y1: bottom - i * gap, x2: x1, y2: bottom - i * gap, stroke: lineColor, "stroke-width": Math.max(2, gap * .08) }));
    g.append(...lines);
    let clefEl = null;
    if (clef === "g") { clefEl = s.el("path", { d: clefPath(x0 + 1.6 * gap, bottom - gap, gap), fill: "none", stroke: INK, "stroke-width": gap * .24, "stroke-linecap": "round", "stroke-linejoin": "round" }); g.append(clefEl); }
    if (clef === "f") { clefEl = s.el("g"); bassClef(s, clefEl, x0 + .9 * gap, bottom - 3 * gap, gap); g.append(clefEl); }
    const Y = p => bottom - p * gap / 2;
    const yd = d => Y(d + off);
    /** note: kind "q" quarter, "h" half, "w" whole; returns group */
    function note(x, d, { kind = "q", color = INK, parent = g, stem = null } = {}) {
      const p = d + off, y = Y(p), ng = s.el("g");
      if (p <= -2) for (let q = -2; q >= p; q -= 2) ng.append(s.el("line", { x1: x - 1.1 * gap, y1: Y(q), x2: x + 1.1 * gap, y2: Y(q), stroke: INK, "stroke-width": Math.max(2, gap * .08) }));
      if (p >= 10) for (let q = 10; q <= p; q += 2) ng.append(s.el("line", { x1: x - 1.1 * gap, y1: Y(q), x2: x + 1.1 * gap, y2: Y(q), stroke: INK, "stroke-width": Math.max(2, gap * .08) }));
      const head = s.el("ellipse", { cx: x, cy: y, rx: gap * .66, ry: gap * .46, transform: `rotate(-20 ${x} ${y})`, fill: kind === "q" ? color : "#fff", stroke: color, "stroke-width": kind === "q" ? 1 : gap * .17 });
      ng.append(head);
      let st = null;
      if (kind !== "w") {
        const up = stem == null ? p < 4 : stem;
        st = up ? s.el("line", { x1: x + gap * .6, y1: y - 2, x2: x + gap * .6, y2: y - 3.4 * gap, stroke: color, "stroke-width": Math.max(2, gap * .1) })
          : s.el("line", { x1: x - gap * .6, y1: y + 2, x2: x - gap * .6, y2: y + 3.4 * gap, stroke: color, "stroke-width": Math.max(2, gap * .1) });
        ng.append(st);
      }
      ng.head = head; ng.stemEl = st; ng.y = y; ng.x = x;
      ng.setColor = c => { head.setAttribute(kind === "q" ? "fill" : "stroke", c); if (kind === "q") head.setAttribute("stroke", c); if (st) st.setAttribute("stroke", c); };
      parent.append(ng);
      return ng;
    }
    return { g, lines, clefEl, Y, yd, note, bottom, top, gap, x0, x1, off };
  }

  /* ---------- keyboard ---------- */
  function keyboard(s, { w = 1100, h = 200, from = 0, n = 15, labels = true, onKey } = {}) {
    const svg = s.svg(w, h);
    const kw = w / n;
    const whites = [], blacks = [];
    for (let i = 0; i < n; i++) {
      const d = from + i;
      const r = s.el("rect", { x: i * kw + 1, y: 1, width: kw - 2, height: h - 2, rx: 8, fill: "#fff", stroke: "#5d6678", "stroke-width": 2, style: { cursor: "pointer" } });
      const lb = s.el("text", { x: i * kw + kw / 2, y: h - 16, "text-anchor": "middle", class: "lbl" + (labels ? "" : " later"), style: { pointerEvents: "none" }, text: nname(d) });
      const key = { d, black: false, n: semi(d), r, lb, base: "#fff" };
      r.addEventListener("pointerdown", e => { e.preventDefault(); onKey && onKey(key); });
      whites.push(key); svg.append(r, lb);
    }
    for (let i = 0; i < n - 1; i++) {
      const d = from + i, k = pc(d);
      if (k === 2 || k === 6) continue;
      const r = s.el("rect", { x: (i + 1) * kw - kw * .3, y: 1, width: kw * .6, height: h * .6, rx: 6, fill: INK, style: { cursor: "pointer" } });
      const key = { d, black: true, n: semi(d) + 1, r, base: INK };
      r.addEventListener("pointerdown", e => { e.preventDefault(); onKey && onKey(key); });
      blacks.push(key); svg.append(r);
    }
    const light = (key, color = "#ffd94a", ms = 450) => {
      key.r.setAttribute("fill", color);
      if (ms) s.wait(ms).then(() => { if (key.r.getAttribute("fill") === color) key.r.setAttribute("fill", key.base); });
    };
    const find = d => whites.find(k => k.d === d);
    return { svg, whites, blacks, light, find, kw };
  }

  const wig = (s, el) => { el.classList.remove("a-pop"); void el.getBoundingClientRect(); el.classList.add("a-pop"); };
  const box = (s, cls, label, ...kids) => s.h("div", { class: cls }, label ? s.h("span", { class: "exlabel" }, label) : null, ...kids);
  const txt = (s, x, y, t, o = {}) => s.el("text", Object.assign({ x, y, "text-anchor": "middle", class: "lbl", text: t }, o));

  /* Alle meine Entchen (traditionell): Notenwerte verdoppelt (Viertel/Halbe/Ganze) */
  const ENTCHEN = [
    [0, "q", "Al-"], [1, "q", "le"], [2, "q", "mei-"], [3, "q", "ne"], [4, "h", "Ent-"], [4, "h", "chen"],
    [5, "q", "schwim-"], [5, "q", "men"], [5, "q", "auf"], [5, "q", "dem"], [4, "w", "See,"],
    [5, "q", "schwim-"], [5, "q", "men"], [5, "q", "auf"], [5, "q", "dem"], [4, "w", "See,"],
    [3, "q", "Köpf-"], [3, "q", "chen"], [3, "q", "in"], [3, "q", "das"], [2, "h", "Was-"], [2, "h", "ser,"],
    [1, "q", "Schwänz-"], [1, "q", "chen"], [1, "q", "in"], [1, "q", "die"], [0, "w", "Höh."],
  ];
  const BEATS = { q: 1, h: 2, w: 4 };

  const slides = [];

  /* 1 ---------------------------------------------------------------- */
  slides.push({
    title: "Das Notensystem",
    say: "Noten stehen auf fünf Linien. Dazwischen sind vier Zwischenräume. Gezählt wird immer von unten.",
    build(s) {
      const v = s.svg(1100, 330);
      const top = 40, gap = 56, x0 = 150, x1 = 930, bottom = top + 4 * gap;
      const spaces = [0, 1, 2, 3].map(i => { const y = bottom - (i + 1) * gap; const gEl = s.el("g", { class: "later" }); gEl.append(s.el("rect", { x: x0, y: y + 5, width: x1 - x0, height: gap - 10, rx: 8, fill: "#ffd94a", opacity: .45 }), txt(s, 112, y + gap / 2 + 8, String(i + 1), { style: { fill: "#ee7a1a", fontWeight: 800, fontSize: "26px" } })); return gEl; });
      v.append(...spaces);
      const lines = [0, 1, 2, 3, 4].map(i => s.el("line", { x1: x0, y1: bottom - i * gap, x2: x1, y2: bottom - i * gap, stroke: INK, "stroke-width": 4, class: "later" }));
      const llabels = [0, 1, 2, 3, 4].map(i => s.el("text", { x: 950, y: bottom - i * gap + 8, class: "lbl later", style: { fill: COL, fontWeight: 700 }, text: (i + 1) + ". Linie" }));
      v.append(...lines, ...llabels);
      const nA = s.el("g", { class: "later" }), nB = s.el("g", { class: "later" });
      const head = (gEl, x, y, c) => gEl.append(s.el("ellipse", { cx: x, cy: y, rx: gap * .62, ry: gap * .44, transform: `rotate(-20 ${x} ${y})`, fill: c }));
      head(nA, 420, bottom - gap, "#1d5bd0"); head(nB, 660, bottom - 2.5 * gap, "#dc3b2a");
      v.append(nA, nB);
      const chipA = s.h("span", { class: "chip later", style: { background: "#dde7fb" } }, "blau: Note ", s.h("b", null, "auf"), " der Linie – die Linie geht mitten durch");
      const chipB = s.h("span", { class: "chip later", style: { background: "#fbe0dc" } }, "rot: Note ", s.h("b", null, "im"), " Zwischenraum");
      const merk = s.h("div", { class: "merk later" }, "Das ", s.h("b", null, "Notensystem"), " hat ", s.h("b", null, "5 Linien"), " und ", s.h("b", null, "4 Zwischenräume"), ". Gezählt wird immer ", s.h("b", null, "von unten"), ".");
      s.add(s.h("div", { class: "stack", style: { gap: "10px" } }, v, s.h("div", { class: "row" }, chipA, chipB), merk));
      s.step(async () => { for (let i = 0; i < 5; i++) { s.show(lines[i], "draw"); s.show(llabels[i], "left"); pianoD(s, [2, 4, 6, 8, 10][i], .5); await s.wait(380); } });
      s.step(async () => { for (let i = 0; i < 4; i++) { s.show(spaces[i], "fade"); pianoD(s, [3, 5, 7, 9][i], .5); await s.wait(380); } });
      s.step(async () => { pianoD(s, 4); s.show(nA, "pop"); s.show(chipA, "up"); await s.wait(500); pianoD(s, 7); s.show(nB, "pop"); await s.show(chipB, "up"); });
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
    },
  });

  /* 2 ---------------------------------------------------------------- */
  slides.push({
    title: "Oben hoch, unten tief",
    say: "Je höher eine Note im Notensystem steht, desto höher klingt sie.",
    build(s) {
      const v = s.svg(680, 360);
      const st = staff(s, v, { x0: 20, x1: 660, top: 90, gap: 34 });
      const trail = s.el("g"); v.append(trail);
      let d = 0, cur = null;
      const name = s.h("p", { class: "huge", style: { color: COL } }, "c′");
      const draw = (anim = true) => {
        if (cur) cur.remove();
        trail.querySelectorAll("g").forEach(x => x.setAttribute("opacity", .25));
        const x = 200 + d * 55;
        const ghost = st.note(x, d, { parent: trail, color: "#5d6678" }); ghost.setAttribute("opacity", 0);
        cur = st.note(x, d, { color: COL });
        name.textContent = nname(d);
        if (anim) { wig(s, cur); pianoD(s, d, .8); }
      };
      const move = k => { const nd = Math.max(0, Math.min(7, d + k)); if (nd === d) { s.sfx.boing(); return; } d = nd; draw(); };
      draw(false);
      const scale = async (up) => { for (let i = 0; i < 8; i++) { if (!s.alive) return; d = up ? i : 7 - i; draw(); trail.lastChild && trail.lastChild.setAttribute("opacity", .25); await s.wait(330); } };
      const bUp = s.h("button", { class: "btn solid", onclick: () => move(1) }, "▲ höher");
      const bDn = s.h("button", { class: "btn solid", onclick: () => move(-1) }, "▼ tiefer");
      const bSc = s.h("button", { class: "btn", onclick: () => scale(true) }, "▶ Tonleiter");
      const merk = s.h("div", { class: "merk later" }, "Weiter ", s.h("b", null, "oben"), " = ", s.h("b", null, "höher"), ". Weiter ", s.h("b", null, "unten"), " = ", s.h("b", null, "tiefer"), ".");
      const life = box(s, "life later", "Im Alltag", s.h("p", { class: "small" }, "Wie eine Treppe: Jede Linie und jeder Zwischenraum ist eine Stufe. In der Klavier-App rutschen die Noten genauso nach oben, wenn du nach rechts spielst."));
      s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "680px 1fr", alignItems: "start", gap: "24px" } }, v,
        s.h("div", { class: "stack", style: { gap: "12px" } }, name, s.h("div", { class: "row" }, bUp, bDn), bSc, merk, life)));
      s.step(async () => { await scale(true); });
      s.step(async () => { await scale(false); });
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
      s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
    },
  });

  /* 3 ---------------------------------------------------------------- */
  slides.push({
    title: "Der Violinschlüssel",
    say: "Am Anfang jeder Notenzeile steht ein Schlüssel. Der Violinschlüssel wickelt sich um die zweite Linie. Dort steht das g.",
    build(s) {
      const v = s.svg(1100, 300);
      const st = staff(s, v, { x0: 30, x1: 1070, top: 60, gap: 40 });
      st.clefEl.classList.add("later");
      const yG = st.bottom - st.gap;
      const hiLine = s.el("line", { x1: 30, y1: yG, x2: 1070, y2: yG, stroke: "#dc3b2a", "stroke-width": 7, opacity: .85, class: "later" });
      v.insertBefore(hiLine, st.g.nextSibling);
      const gNote = st.note(420, 4, { color: "#dc3b2a" }); gNote.classList.add("later");
      const gLbl = txt(s, 420, st.bottom + 60, "g′ – auf der 2. Linie", { class: "lbl later", style: { fill: "#dc3b2a", fontWeight: 700 } });
      const letter = s.el("text", { x: 820, y: st.bottom - 22, "text-anchor": "middle", class: "later", style: { font: "italic 700 150px Georgia, serif", fill: "#1d5bd0", opacity: .7 }, text: "G" });
      const letterL = txt(s, 820, st.bottom + 60, "aus dem Buchstaben G", { class: "lbl later", style: { fill: "#1d5bd0" } });
      v.append(gLbl, letter, letterL);
      const merk = s.h("div", { class: "merk later" }, "Der ", s.h("b", null, "Violinschlüssel"), " heißt auch ", s.h("b", null, "G-Schlüssel"), ". Er legt fest: Auf der 2. Linie steht das ", s.h("b", null, "g′"), ".");
      const life = box(s, "life later", "Wer liest ihn?", s.h("p", { class: "small" }, "Geige, Flöte, Klarinette, Oboe, Trompete, hohe Singstimmen – und die rechte Hand am Klavier."));
      s.add(s.h("div", { class: "stack", style: { gap: "14px" } }, v, s.h("div", { class: "cols" }, merk, life)));
      s.step(async () => { s.sfx.scribble(); await s.show(st.clefEl, "draw"); });
      s.step(async () => { s.sfx.zap(); s.show(hiLine, "fade"); await s.show(gNote, "pop"); pianoD(s, 4, 1.4); s.show(gLbl, "fade"); });
      s.step(async () => { s.sfx.whoosh(); s.show(letter, "zoom"); await s.show(letterL, "fade"); s.say("Der Schlüssel war früher ein geschriebenes G."); });
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
      s.step(async () => { [4, 6, 8, 11].forEach((d, i) => pianoD(s, d, .5, i * .18)); await s.show(life, "up"); });
    },
  });

  /* 4 ---------------------------------------------------------------- */
  slides.push({
    title: "Die Noten von c′ bis c″",
    say: "Das sind die Noten von c bis zum nächsten c. Das tiefe c steht auf einer kleinen Hilfslinie.",
    build(s) {
      const v = s.svg(1100, 330);
      const st = staff(s, v, { x0: 20, x1: 1080, top: 58, gap: 36 });
      const notes = [], lbls = [];
      for (let d = 0; d <= 7; d++) {
        const x = 230 + d * 112;
        const n = st.note(x, d, { color: d === 0 ? "#dc3b2a" : INK });
        const hit = s.el("rect", { x: x - 50, y: 0, width: 100, height: 330, fill: "transparent", style: { cursor: "pointer" }, onclick: () => { pianoD(s, d, 1); wig(s, n); } });
        n.classList.add("later"); v.append(hit);
        const l = txt(s, x, st.bottom + 92, nname(d), { class: "lbl later", style: { fontSize: "30px", fontWeight: 800, fill: COL } });
        v.append(l); notes.push(n); lbls.push(l);
      }
      const merk = s.h("div", { class: "merk later" }, "Das ", s.h("b", null, "c′"), " steht unter dem Notensystem auf einer eigenen kleinen Linie: der ", s.h("b", null, "Hilfslinie"), ".");
      const tip = s.h("p", { class: "small pencil" }, "Tippe auf eine Note, dann hörst du sie.");
      const life4 = box(s, "life later", "Im Alltag", s.h("p", { class: "small" }, "Viele Kinderlieder bleiben in diesem Bereich. „Alle meine Entchen“ braucht sogar nur die Töne von c′ bis a′."));
      s.add(s.h("div", { class: "stack", style: { gap: "10px" } }, v, tip, merk, life4));
      const reveal = async (a, b) => { for (let d = a; d <= b; d++) { s.show(notes[d], "pop"); s.show(lbls[d], "up"); pianoD(s, d, .7); await s.wait(420); } };
      s.step(async () => { await reveal(0, 3); });
      s.step(async () => { await reveal(4, 7); });
      s.step(async () => { s.sfx.ding(); wig(s, notes[0]); pianoD(s, 0, 1.2); await s.show(merk, "up"); });
      s.step(async () => { [0, 1, 2, 3, 4, 4].forEach((d, i) => pianoD(s, d, .4, i * .28)); await s.show(life4, "up"); });
    },
  });

  /* 5 ---------------------------------------------------------------- */
  slides.push({
    title: "Eine Eselsbrücke",
    say: "Mit einer Eselsbrücke merkst du dir die Noten auf den Linien und in den Zwischenräumen.",
    build(s) {
      const v = s.svg(1100, 300);
      const st = staff(s, v, { x0: 20, x1: 1080, top: 58, gap: 36 });
      const lineD = [2, 4, 6, 8, 10], spaceD = [3, 5, 7, 9];
      const mk = (arr, x0, color) => arr.map((d, i) => {
        const x = x0 + i * 92;
        const n = st.note(x, d, { kind: "w", color }); n.classList.add("later");
        const l = txt(s, x, st.bottom + 70, nname(d), { class: "lbl later", style: { fontSize: "28px", fontWeight: 800, fill: color } });
        v.append(l, s.el("rect", { x: x - 40, y: 0, width: 80, height: 290, fill: "transparent", style: { cursor: "pointer" }, onclick: () => { pianoD(s, d, 1); wig(s, n); } }));
        return [n, l];
      });
      const A = mk(lineD, 200, "#1d5bd0"), B = mk(spaceD, 720, "#dc3b2a");
      const run = async (arr, ds) => { for (let i = 0; i < arr.length; i++) { s.show(arr[i][0], "pop"); s.show(arr[i][1], "up"); pianoD(s, ds[i], .7); await s.wait(380); } };
      const cA = box(s, "card later", "Eselsbrücke · Linien", s.h("p", { class: "h2 blue" }, "E – G – H – D – F"), s.h("p", { class: "t" }, s.h("b", null, "E"), "ine ", s.h("b", null, "G"), "iraffe ", s.h("b", null, "h"), "at ", s.h("b", null, "d"), "icke ", s.h("b", null, "F"), "üße."));
      const cB = box(s, "card later", "Eselsbrücke · Zwischenräume", s.h("p", { class: "h2 red" }, "F – A – C – E"), s.h("p", { class: "t" }, "Das ist das englische Wort ", s.h("b", null, "face"), " – Gesicht."));
      const tip5 = box(s, "life later", "Tipp", s.h("p", { class: "small" }, "Erfinde deine eigene Eselsbrücke! Je lustiger der Satz, desto besser merkst du ihn – zum Beispiel mit Namen aus deiner Klasse."));
      s.add(s.h("div", { class: "stack", style: { gap: "12px" } }, v, s.h("div", { class: "cols" }, cA, cB), tip5));
      s.step(async () => { await run(A, lineD); s.show(cA, "up"); s.sfx.ding(); });
      s.step(async () => { await run(B, spaceD); s.show(cB, "up"); s.sfx.ding(); });
      s.step(async () => { s.sfx.pop(); await s.show(tip5, "up"); });
    },
  });

  /* 6 ---------------------------------------------------------------- */
  slides.push({
    title: "Die Klaviatur",
    say: "Die Tasten am Klavier heißen c, d, e, f, g, a, h. Danach beginnt alles wieder mit c.",
    build(s) {
      const name = s.h("p", { class: "big", style: { color: COL, minWidth: "90px" } }, "");
      const kb = keyboard(s, { h: 240, labels: false, onKey: k => { kb.light(k); piano(s, k.n, 1); name.textContent = k.black ? "schwarze Taste" : nname(k.d); } });
      const intro = s.h("p", { class: "t" }, "Schau auf die schwarzen Tasten: Sie kommen immer in Gruppen – ", s.h("b", { class: "blue" }, "zwei"), " und ", s.h("b", { class: "orange" }, "drei"), ".");
      const merk = s.h("div", { class: "merk later" }, "Die weißen Tasten heißen ", s.h("b", null, "c d e f g a h"), ". Das ", s.h("b", null, "c"), " liegt immer links neben den ", s.h("b", null, "zwei"), " schwarzen Tasten.");
      const life6 = box(s, "life later", "Im Alltag", s.h("p", { class: "small" }, "Auf dem Klavier, dem Keyboard und in jeder Klavier-App sind die Tasten genau so angeordnet. Wenn du die zwei schwarzen Tasten findest, findest du das c."));
      s.add(s.h("div", { class: "stack", style: { gap: "12px" } }, intro, kb.svg, s.h("div", { class: "row", style: { flexWrap: "nowrap", alignItems: "center" } }, s.h("p", { class: "t pencil" }, "Getippt:"), name), merk, life6));
      s.step(async () => {
        for (const k of kb.blacks) { const two = [0, 1].includes(pc(k.d)); kb.light(k, two ? "#1d5bd0" : "#ee7a1a", 0); piano(s, k.n, .25); await s.wait(110); }
      });
      s.step(async () => {
        for (const k of kb.whites.filter(k => pc(k.d) === 0)) { kb.light(k, "#9fe0d4", 0); k.lb.classList.remove("later"); s.show(k.lb, "pop"); piano(s, k.n, .9); await s.wait(450); }
      });
      s.step(async () => {
        for (const k of kb.whites) { if (pc(k.d) !== 0) { kb.light(k, "#ffd94a", 300); s.show(k.lb, "pop"); } piano(s, k.n, .4); await s.wait(170); }
      });
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
      s.step(async () => { s.sfx.pop(); await s.show(life6, "up"); });
    },
  });

  /* 7 ---------------------------------------------------------------- */
  slides.push({
    title: "H statt B",
    say: "Im Deutschen heißt der siebte Ton h. Im Englischen heißt er B.",
    build(s) {
      const row = (letters, hi) => s.h("div", { class: "row", style: { gap: "10px", flexWrap: "nowrap" } }, letters.map((l, i) => s.h("button", { class: "btn" + (i === 6 ? " solid" : ""), style: { minWidth: "56px", fontSize: "28px", padding: "0 10px", background: i === 6 ? hi : "" , borderColor: i === 6 ? hi : "" }, onclick: () => pianoD(s, i, .9) }, l)));
      const de = box(s, "card", "Deutsch", row("c d e f g a h".split(" "), COL));
      const en = box(s, "card later", "Englisch", row("C D E F G A B".split(" "), "#dc3b2a"));
      const why = box(s, "ex later", "Warum?", s.h("p", { class: "t" }, "Früher gab es zwei Sorten b: ein ", s.h("b", null, "rundes"), " und ein ", s.h("b", null, "eckiges"), ". Das eckige sah im Druck aus wie ein ", s.h("b", null, "h"), " – so wurde daraus der Ton H."),
        s.h("p", { class: "small" }, "Das deutsche ", s.h("b", null, "b"), " ist heute die schwarze Taste links neben dem h."));
      const bach = s.h("button", { class: "life later", style: { textAlign: "left", font: "inherit", color: "inherit", cursor: "pointer" }, onclick: () => playBach() },
        s.h("span", { class: "exlabel" }, "Im Alltag ▶ antippen"), s.h("p", { class: "t" }, "Der Komponist ", s.h("b", null, "Bach"), " konnte seinen Namen spielen: ", s.h("b", null, "b – a – c – h"), "."));
      const playBach = () => [-2, -3, 0, -1].forEach((n, i) => piano(s, n, .7, i * .45));
      const mk = keyboard(s, { w: 520, h: 150, n: 8, onKey: k => { mk.light(k); piano(s, k.n, .9); } });
      const kbH = mk.find(6), kbB = mk.blacks.find(k => pc(k.d) === 5);
      const showHB = () => { mk.light(kbH, "#9fe0d4", 0); mk.light(kbB, "#dc3b2a", 0); };
      const kbBox = s.h("div", { class: "later", style: { display: "flex", flexDirection: "column", gap: "6px" } }, mk.svg, s.h("p", { class: "small pencil" }, "türkis = h, rot = b (schwarze Taste)"));
      s.add(s.h("div", { class: "stack", style: { gap: "16px" } }, s.h("div", { class: "cols" }, de, en), why, s.h("div", { class: "cols", style: { gridTemplateColumns: "520px 1fr", alignItems: "center" } }, kbBox, bach)));
      s.step(async () => { pianoD(s, 6, 1); await s.show(en, "left"); });
      s.step(async () => { s.sfx.pop(); await s.show(why, "up"); });
      s.step(async () => { showHB(); s.show(kbBox, "up"); pianoD(s, 6, .8); piano(s, -2, .8, .9); await s.wait(400); });
      s.step(async () => { playBach(); await s.show(bach, "up"); });
    },
  });

  /* 8 ---------------------------------------------------------------- */
  slides.push({
    title: "Taste trifft Note",
    say: "Tippe auf eine Taste: Die Note erscheint im Notensystem. Tippe auf eine Stelle im Notensystem: Die Taste leuchtet.",
    build(s) {
      const v = s.svg(1100, 300);
      const st = staff(s, v, { x0: 20, x1: 1080, top: 80, gap: 30 });
      const layer = s.el("g"); v.append(layer);
      let slot = 0;
      const slots = 8, sx = i => 200 + i * 110;
      const items = [];
      const put = d => {
        if (items[slot]) items[slot].forEach(e => e.remove());
        const x = sx(slot);
        const n = st.note(x, d, { color: COL, parent: layer });
        const l = txt(s, x, 290, nname(d), { style: { fontSize: "24px", fontWeight: 800, fill: COL } }); layer.append(l);
        items[slot] = [n, l]; wig(s, n);
        slot = (slot + 1) % slots;
      };
      const kb = keyboard(s, { h: 210, onKey: k => { kb.light(k); piano(s, k.n, 1); if (!k.black) put(k.d); } });
      for (let d = 0; d <= 14; d++) {
        const y = st.yd(d);
        v.append(s.el("rect", { x: 140, y: y - st.gap / 4, width: 940, height: st.gap / 2, fill: "transparent", style: { cursor: "pointer" }, onclick: () => { put(d); const k = kb.find(d); kb.light(k, "#ffd94a", 600); pianoD(s, d, 1); } }));
      }
      const hint = s.h("p", { class: "small pencil" }, "Tippe auf eine Taste – oder direkt auf eine Linie oder einen Zwischenraum.");
      s.add(s.h("div", { class: "stack", style: { gap: "8px" } }, v, kb.svg, hint));
      s.step(async () => { for (const d of [0, 2, 4, 7, 9, 11, 14]) { if (!s.alive) return; put(d); kb.light(kb.find(d), "#ffd94a", 380); pianoD(s, d, .8); await s.wait(420); } });
    },
  });

  /* 9 ---------------------------------------------------------------- */
  slides.push({
    title: "Oktaven",
    say: "Nach sieben Tönen kommt wieder ein c. Es klingt gleich, nur höher. Das nennt man eine Oktave.",
    build(s) {
      const v = s.svg(1100, 290);
      const st = staff(s, v, { x0: 20, x1: 1080, top: 70, gap: 26 });
      const ds = [0, 7, 14], xs = [300, 580, 860];
      const words = ["eingestrichenes c", "zweigestrichenes c", "dreigestrichenes c"];
      const kb = keyboard(s, { h: 136, onKey: k => { kb.light(k); piano(s, k.n, 1); } });
      const parts = ds.map((d, i) => {
        const n = st.note(xs[i], d, { kind: "w", color: ["#1d5bd0", COL, "#dc3b2a"][i] }); n.classList.add("later");
        const l1 = txt(s, xs[i], 244, nname(d) + " · " + fmtHz(s, d), { class: "lbl later", style: { fontWeight: 800 } });
        const l2 = txt(s, xs[i], 276, words[i], { class: "lbl later", style: { fill: "#5d6678" } });
        v.append(l1, l2, s.el("rect", { x: xs[i] - 110, y: 0, width: 220, height: 300, fill: "transparent", style: { cursor: "pointer" }, onclick: () => { pianoD(s, d, 1.2); kb.light(kb.find(d), "#ffd94a", 600); wig(s, n); } }));
        return [n, l1, l2];
      });
      const merk = s.h("div", { class: "merk later" }, "Eine ", s.h("b", null, "Oktave"), " höher = ", s.h("b", null, "doppelt so viele"), " Schwingungen. Der Ton heißt gleich – er bekommt nur einen Strich mehr.");
      const life = box(s, "life later", "Im Alltag", s.h("p", { class: "small" }, "Das c′ heißt auch ", s.h("b", null, "Schloss-C"), ": Es liegt beim Schloss vom Klavierdeckel. Ein Klavier hat meist 88 Tasten – über 7 Oktaven."));
      s.add(s.h("div", { class: "stack", style: { gap: "10px" } }, v, kb.svg, s.h("div", { class: "cols", style: { gridTemplateColumns: "1.15fr 1fr" } }, merk, life)));
      parts.forEach((p, i) => s.step(async () => { s.show(p[0], "pop"); s.show(p[1], "up"); s.show(p[2], "up"); pianoD(s, ds[i], 1.2); kb.light(kb.find(ds[i]), ["#9fc1f5", "#9fe0d4", "#f5b0a6"][i], 0); await s.wait(500); }));
      s.step(async () => { ds.forEach(d => pianoD(s, d, 1.6)); s.sfx.ding(); await s.show(merk, "up"); });
      s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
    },
  });

  /* 10 --------------------------------------------------------------- */
  slides.push({
    title: "Kurz: der Bassschlüssel",
    say: "Für tiefe Töne gibt es den Bassschlüssel. Seine zwei Punkte umrahmen die vierte Linie. Dort steht das f.",
    build(s) {
      const v = s.svg(1100, 300);
      const st = staff(s, v, { x0: 20, x1: 1080, top: 70, gap: 38, clef: "f" });
      st.clefEl.classList.add("later");
      const yF = st.bottom - 3 * st.gap;
      const hi = s.el("line", { x1: 20, y1: yF, x2: 1080, y2: yF, stroke: "#dc3b2a", "stroke-width": 7, opacity: .85, class: "later" });
      v.insertBefore(hi, st.g.nextSibling);
      const notes = [[-4, 360, "f", "#dc3b2a"], [-7, 600, "c", INK], [0, 840, "c′", INK]].map(([d, x, nm, c]) => {
        const n = st.note(x, d, { kind: "w", color: c }); n.classList.add("later");
        const l = txt(s, x, st.bottom + 64, nm, { class: "lbl later", style: { fontSize: "28px", fontWeight: 800, fill: c } });
        v.append(l, s.el("rect", { x: x - 60, y: 0, width: 120, height: 300, fill: "transparent", style: { cursor: "pointer" }, onclick: () => { pianoD(s, d, 1.3); wig(s, n); } }));
        return [n, l, d];
      });
      const merk = s.h("div", { class: "merk later" }, "Der ", s.h("b", null, "Bassschlüssel"), " ist ein ", s.h("b", null, "F-Schlüssel"), ": Auf der 4. Linie steht das f. Er ist für ", s.h("b", null, "tiefe Töne"), ".");
      const life = box(s, "life later", "Wer liest ihn?", s.h("p", { class: "small" }, "Cello, Kontrabass, Fagott, Posaune, Tuba, tiefe Männerstimmen – und die linke Hand am Klavier."));
      s.add(s.h("div", { class: "stack", style: { gap: "12px" } }, v, s.h("div", { class: "cols" }, merk, life)));
      s.step(async () => { s.sfx.scribble(); await s.show(st.clefEl, "pop"); });
      s.step(async () => { s.sfx.zap(); s.show(hi, "fade"); s.show(notes[0][0], "pop"); s.show(notes[0][1], "up"); pianoD(s, -4, 1.4); await s.wait(500); });
      s.step(async () => { for (const [n, l, d] of notes.slice(1)) { s.show(n, "pop"); s.show(l, "up"); pianoD(s, d, 1.2); await s.wait(600); } });
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
      s.step(async () => { [-14, -10, -7, -4].forEach((d, i) => pianoD(s, d, .6, i * .2)); await s.show(life, "up"); });
    },
  });

  /* 11 --------------------------------------------------------------- */
  slides.push({
    title: "Alle meine Entchen",
    say: "Dieses alte Kinderlied kennst du. Drück auf Abspielen und lies mit.",
    build(s) {
      const v = s.svg(1100, 520);
      const sys = [{ top: 40, from: 0, to: 11 }, { top: 210, from: 11, to: 22 }, { top: 380, from: 22, to: 27 }];
      const els = [];
      const head = s.el("line", { x1: 0, y1: 0, x2: 0, y2: 0, stroke: "#dc3b2a", "stroke-width": 4, opacity: 0 });
      sys.forEach((sy, k) => {
        const x0p = k ? 90 : 116;
        const advP = ENTCHEN.slice(sy.from, sy.to).map(([d, kind, syl]) => Math.max(BEATS[kind] * 58, syl.length * 11 + 22));
        const totP = advP.reduce((a, b) => a + b, 0), endX = x0p + totP * Math.min(1, (1080 - x0p) / totP) - 4;
        const st = staff(s, v, { x0: 10, x1: k === 2 ? endX : 1090, top: sy.top, gap: 18 });
        sy.st = st;
        if (k === 0) { v.append(txt(s, 88, sy.top + 30, "4", { style: { font: "800 27px var(--f-display)" } }), txt(s, 88, sy.top + 66, "4", { style: { font: "800 27px var(--f-display)" } })); }
        const x0 = k ? 90 : 116, avail = 1080 - x0, perBeat = 58;
        const adv = ENTCHEN.slice(sy.from, sy.to).map(([d, kind, syl]) => Math.max(BEATS[kind] * perBeat, syl.length * 11 + 22));
        const tot = adv.reduce((a, b) => a + b, 0), sc = Math.min(1, avail / tot);
        let cur = x0, b = 0;
        for (let i = sy.from; i < sy.to; i++) {
          const [d, kind, syl] = ENTCHEN[i];
          const x = cur + 22;
          const n = st.note(x, d, { kind });
          const l = txt(s, x, st.bottom + 52, syl, { style: { fontSize: "19px" } });
          v.append(l);
          els[i] = { n, l, x, st, kind };
          cur += adv[i - sy.from] * sc; b += BEATS[kind];
          if (b % 4 === 0) v.append(s.el("line", { x1: cur - 4, y1: st.top, x2: cur - 4, y2: st.bottom, stroke: INK, "stroke-width": i === ENTCHEN.length - 1 ? 7 : 2 }));
        }
      });
      v.append(head);
      let playing = false, tempo = .42;
      const run = async () => {
        if (playing) return; playing = true;
        head.setAttribute("opacity", 1);
        for (let i = 0; i < ENTCHEN.length; i++) {
          if (!s.alive) return;
          const e = els[i], [d, kind] = ENTCHEN[i], dur = BEATS[kind] * tempo;
          head.setAttribute("x1", e.x - 18); head.setAttribute("x2", e.x - 18); head.setAttribute("y1", e.st.top - 20); head.setAttribute("y2", e.st.bottom + 60);
          e.n.setColor("#dc3b2a"); e.l.style.fill = "#dc3b2a"; e.l.style.fontWeight = 800;
          pianoD(s, d, Math.max(.5, dur * 1.1));
          await s.wait(dur * 1000);
          e.n.setColor(INK); e.l.style.fill = ""; e.l.style.fontWeight = "";
        }
        head.setAttribute("opacity", 0); playing = false;
      };
      const btn = s.h("button", { class: "btn solid", onclick: () => { tempo = .42; run(); } }, "▶ Abspielen");
      const slow = s.h("button", { class: "btn", onclick: () => { tempo = .7; run(); } }, "▶ langsam");
      const info = s.h("p", { class: "small pencil" }, "Volkslied, Melodie vermutlich aus dem 18. Jahrhundert.");
      s.add(s.h("div", { class: "stack", style: { gap: "4px" } }, v, s.h("div", { class: "row", style: { flexWrap: "nowrap" } }, btn, slow, info)));
      s.step(async () => { tempo = .42; run(); });
    },
  });

  /* 12 --------------------------------------------------------------- */
  slides.push({
    title: "Tonschritte und Tonsprünge",
    say: "Geht die Melodie zum Nachbarton, ist das ein Tonschritt. Werden Töne übersprungen, ist es ein Tonsprung.",
    build(s) {
      const panel = (mel, color, label) => {
        const v = s.svg(660, 200);
        const st = staff(s, v, { x0: 10, x1: 650, top: 50, gap: 20 });
        const pts = mel.map((d, i) => [130 + i * (500 / (mel.length - 1)), st.yd(d)]);
        const ns = mel.map((d, i) => st.note(pts[i][0], d));
        const path = s.el("polyline", { points: pts.map(p => p.join(",")).join(" "), fill: "none", stroke: color, "stroke-width": 6, "stroke-linejoin": "round", "stroke-linecap": "round", opacity: .8, class: "later" });
        v.append(path);
        const run = async () => { for (let i = 0; i < mel.length; i++) { if (!s.alive) return; ns[i].setColor(color); pianoD(s, mel[i], .5); await s.wait(320); ns[i].setColor(INK); } };
        return { v, path, run };
      };
      const A = panel([0, 1, 2, 3, 4, 4, 5, 5, 5, 5, 4], "#138a5a");
      const B = panel([5, 8, 5, 8, 5, 8], "#ee7a1a");
      const sideA = s.h("div", { class: "stack", style: { gap: "8px" } }, s.h("p", { class: "h2 green" }, "Tonschritt"), s.h("p", { class: "small" }, "„Alle meine Entchen“ geht wie eine Treppe: immer zum Nachbarton – oder der Ton bleibt gleich."), s.h("button", { class: "btn", onclick: () => A.run() }, "▶ anhören"));
      const sideB = s.h("div", { class: "stack later", style: { gap: "8px" } }, s.h("p", { class: "h2 orange" }, "Tonsprung"), s.h("p", { class: "small" }, "Das Martinshorn springt hin und her, zum Beispiel a′ – d″. Dazwischen liegen Töne, die übersprungen werden."), s.h("button", { class: "btn", onclick: () => B.run() }, "▶ anhören"));
      B.v.classList.add("later");
      const merk = s.h("div", { class: "merk later" }, s.h("b", { class: "green" }, "Tonschritt"), ": Linie → Zwischenraum, zum Nachbarton. ", s.h("b", { class: "orange" }, "Tonsprung"), ": mindestens ein Ton dazwischen.");
      s.add(s.h("div", { class: "stack", style: { gap: "10px" } },
        s.h("div", { class: "cols", style: { gridTemplateColumns: "660px 1fr", alignItems: "center", gap: "24px" } }, A.v, sideA, B.v, sideB), merk));
      s.step(async () => { s.show(A.path, "draw"); await A.run(); });
      s.step(async () => { s.show(B.v, "fade"); s.show(sideB, "up"); s.show(B.path, "draw"); await B.run(); });
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
    },
  });

  /* 13 --------------------------------------------------------------- */
  slides.push({
    title: "Im Alltag: Noten überall",
    say: "Noten findest du an vielen Stellen. Tippe auf eine Karte, dann spielt die Melodie.",
    build(s) {
      const mini = (mel) => {
        const v = s.svg(470, 140);
        const st = staff(s, v, { x0: 4, x1: 466, top: 34, gap: 16 });
        const ns = mel.map((d, i) => st.note(80 + i * (370 / Math.max(1, mel.length - 1)), d));
        return { v, ns };
      };
      const tiles = [
        ["📖", "Liederbuch", "Kinderlieder wie „Alle meine Entchen“ stehen in Noten im Liederbuch.", [0, 1, 2, 3, 4, 4]],
        ["🎹", "Klavier-App", "Sie zeigt oft C D E F G A B – das englische B ist unser h.", [0, 1, 2, 3, 4, 5, 6, 7]],
        ["🎻", "Instrumentalklasse", "Auf dem Notenständer liegt deine Stimme. Ab Klasse 6 spielst du daraus.", [4, 7, 6, 5, 4, 2, 4]],
        ["📱", "Klingelton", "Auch ein Klingelton ist eine kleine Melodie – man kann ihn aufschreiben.", [7, 9, 11, 9, 7, 4, 7]],
      ];
      const cards = tiles.map(([em, n, d, mel]) => {
        const m = mini(mel);
        const play1 = async () => { for (let i = 0; i < mel.length; i++) { if (!s.alive) return; m.ns[i].setColor("#dc3b2a"); pianoD(s, mel[i], .45); await s.wait(260); m.ns[i].setColor(INK); } };
        return s.h("button", { class: "card later", style: { font: "inherit", color: "inherit", cursor: "pointer", textAlign: "left", display: "flex", flexDirection: "column", gap: "4px", padding: "12px 18px" }, onclick: play1 },
          s.h("div", { class: "row", style: { gap: "12px", flexWrap: "nowrap" } }, s.h("span", { style: { fontSize: "40px", lineHeight: "1" } }, em), s.h("p", { class: "h2" }, n), s.h("span", { class: "chip", style: { marginLeft: "auto" } }, "▶")),
          s.h("p", { class: "small" }, d), m.v);
      });
      s.add(s.h("div", { class: "cols", style: { gap: "18px" } }, cards));
      cards.forEach((c, i) => s.step(async () => { s.sfx.pop(); await s.show(c, "up"); c.click(); }));
    },
  });

  /* 14 --------------------------------------------------------------- */
  slides.push({
    title: "Lies selbst: eine Melodie",
    say: "Hier ist eine kleine Klingelton-Melodie. Hör sie dir an, lies die Notennamen und finde Schritte und Sprünge.",
    build(s) {
      const mel = [7, 8, 9, 11, 9, 8, 7, 4];
      const v = s.svg(1100, 330);
      const st = staff(s, v, { x0: 20, x1: 1080, top: 80, gap: 30 });
      const xs = mel.map((d, i) => 210 + i * 116);
      const arcs = s.el("g", { class: "later" });
      v.append(arcs);
      for (let i = 1; i < mel.length; i++) {
        const step = Math.abs(mel[i] - mel[i - 1]) === 1;
        const x1 = xs[i - 1], x2 = xs[i], y = Math.min(st.yd(mel[i]), st.yd(mel[i - 1])) - 52;
        arcs.append(s.el("path", { d: `M${x1 + 10} ${y + 20} Q${(x1 + x2) / 2} ${y - 6} ${x2 - 10} ${y + 20}`, fill: "none", stroke: step ? "#138a5a" : "#ee7a1a", "stroke-width": 5, "stroke-linecap": "round" }));
      }
      const ns = mel.map((d, i) => { const n = st.note(xs[i], d, { kind: i === mel.length - 1 ? "h" : "q" }); v.append(s.el("rect", { x: xs[i] - 50, y: 0, width: 100, height: 330, fill: "transparent", style: { cursor: "pointer" }, onclick: () => { pianoD(s, d, .8); wig(s, n); } })); return n; });
      const lbls = mel.map((d, i) => { const l = txt(s, xs[i], 316, nname(d), { class: "lbl later", style: { fontSize: "28px", fontWeight: 800, fill: COL } }); v.append(l); return l; });
      const run = async () => { for (let i = 0; i < mel.length; i++) { if (!s.alive) return; ns[i].setColor("#dc3b2a"); pianoD(s, mel[i], i === mel.length - 1 ? 1 : .4); await s.wait(i === mel.length - 1 ? 600 : 300); ns[i].setColor(INK); } };
      const btn = s.h("button", { class: "btn solid", onclick: run }, "▶ Melodie hören");
      const key = s.h("div", { class: "row later" }, s.h("span", { class: "chip", style: { background: "#d6f0e3" } }, "grün = Tonschritt"), s.h("span", { class: "chip", style: { background: "#fde5cf" } }, "orange = Tonsprung"));
      const life = box(s, "life later", "Für die Instrumentalklasse", s.h("p", { class: "small" }, "Genau so liest du später deine Stimme: erst den Notennamen finden, dann den Ton auf dem Instrument spielen."));
      s.add(s.h("div", { class: "stack", style: { gap: "10px" } }, v, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "20px" } }, btn, key), life));
      s.step(async () => { await run(); });
      s.step(async () => { for (let i = 0; i < lbls.length; i++) { s.show(lbls[i], "up"); pianoD(s, mel[i], .3); await s.wait(200); } });
      s.step(async () => { s.sfx.whoosh(); s.show(arcs, "fade"); await s.show(key, "up"); });
      s.step(async () => { s.sfx.success(); await s.show(life, "up"); });
    },
  });

  Deck.unit({
    id: "u2", num: 2, title: "Noten lesen", color: COL, soft: "#dcf3ef",
    subtitle: "Vom Notensystem zur ersten Melodie",
    blurb: "Linien, Violinschlüssel, Notennamen, Klaviatur und Melodien.",
    goals: ["das Notensystem mit Linien und Zwischenräumen kennen", "den Violinschlüssel und die Noten von c′ bis c‴ lesen", "Noten und Klaviertasten verbinden – mit h statt B", "eine Melodie mitlesen und Schritte und Sprünge erkennen"],
    icon(svg, el) {
      svg.append(el("circle", { cx: 35, cy: 35, r: 30, fill: COL, opacity: .12 }));
      [0, 1, 2, 3, 4].forEach(i => svg.append(el("line", { x1: 10, y1: 21 + i * 7, x2: 60, y2: 21 + i * 7, stroke: COL, "stroke-width": 2 })));
      svg.append(el("ellipse", { cx: 30, cy: 42, rx: 6, ry: 4.5, fill: COL, transform: "rotate(-20 30 42)" }), el("line", { x1: 35.5, y1: 41, x2: 35.5, y2: 18, stroke: COL, "stroke-width": 2.5 }),
        el("ellipse", { cx: 46, cy: 35, rx: 6, ry: 4.5, fill: COL, transform: "rotate(-20 46 35)" }), el("line", { x1: 51.5, y1: 34, x2: 51.5, y2: 11, stroke: COL, "stroke-width": 2.5 }));
    },
    slides,
  });
})();
