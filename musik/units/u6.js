/* Kapitel 6 – Musikalische Formen.
   All melodies are either traditional (public domain: "Bruder Jakob", "Morgen kommt der Weihnachtsmann",
   Westminster chime, Beethoven's 5th motif) or composed for this deck. All sounds are synthesised. */
(() => {
  "use strict";

  /* ---------------- synth ---------------- */
  const mf = m => 440 * Math.pow(2, (m - 69) / 12);
  let OUT = null, NB = null;
  function ac(s) {
    if (s.fast || !s.alive || !s.sfx.on) return null;
    const a = s.sfx.unlock(); if (!a) return null;
    if (!OUT || OUT.context !== a) { const c = a.createDynamicsCompressor(); OUT = a.createGain(); OUT.gain.value = 0.7; OUT.connect(c); c.connect(a.destination); }
    return a;
  }
  function noiseBuf(a) {
    if (NB && NB.sampleRate === a.sampleRate) return NB;
    NB = a.createBuffer(1, a.sampleRate * 3, a.sampleRate);
    const d = NB.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return NB;
  }
  function nz(a, t, dur, type, freq, q, peak) {
    const src = a.createBufferSource(); src.buffer = noiseBuf(a);
    const f = a.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = a.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(OUT); src.start(t); src.stop(t + dur + 0.05);
  }
  function ping(a, t, freq, dur, type, peak, slideTo) {
    const o = a.createOscillator(), g = a.createGain(); o.type = type;
    o.frequency.setValueAtTime(freq, t); if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur * 0.5);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(OUT); o.start(t); o.stop(t + dur + 0.05);
  }
  const VOICES = {
    floete: { w: "sine", h2: 0.18, a: 0.06, r: 0.12, vib: [5, 0.006], breath: 0.04, vol: 0.22 },
    streicher: { w: "sawtooth", det: 8, ft: "lowpass", fc: f => Math.min(5000, f * 5), q: 1, a: 0.1, r: 0.25, vib: [5.4, 0.006], vol: 0.14 },
    trompete: { w: "sawtooth", ft: "lowpass", fenv: [1.5, 9, 0.08], q: 1, a: 0.03, r: 0.08, vib: [5.5, 0.003], vol: 0.15 },
    stimme: { w: "sawtooth", det: 10, ft: "bandpass", fc: () => 900, q: 1.1, a: 0.08, r: 0.2, vib: [5, 0.008], vol: 0.36 },
    dudel: { w: "sawtooth", ft: "bandpass", fc: () => 1700, q: 1.3, a: 0.02, r: 0.05, vol: 0.4 },
    chip: { w: "square", a: 0.005, r: 0.03, vol: 0.07 },
    bass: { w: "sawtooth", ft: "lowpass", fc: f => f * 3, q: 2, a: 0.01, r: 0.08, vol: 0.3 },
  };
  const PERC = {
    klavier(a, m, dur, t, vol) {
      const f = mf(m), d = Math.max(0.5, dur) + 0.5;
      ping(a, t, f, d, "triangle", 0.32 * vol); ping(a, t, f * 2, d * 0.6, "sine", 0.08 * vol); ping(a, t, f * 3, d * 0.3, "sine", 0.03 * vol);
    },
    pizz(a, m, dur, t, vol) {
      const f = mf(m), fl = a.createBiquadFilter(), g = a.createGain();
      fl.type = "lowpass"; fl.frequency.setValueAtTime(f * 10, t); fl.frequency.exponentialRampToValueAtTime(f * 1.5, t + 0.3);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.4 * vol, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
      ["triangle", "sawtooth"].forEach((w, i) => { const o = a.createOscillator(); o.type = w; o.frequency.value = f; const og = a.createGain(); og.gain.value = i ? 0.35 : 1; o.connect(og); og.connect(fl); o.start(t); o.stop(t + 0.65); });
      fl.connect(g); g.connect(OUT);
    },
    marimba(a, m, dur, t, vol) { const f = mf(m); ping(a, t, f, 0.45, "sine", 0.35 * vol); ping(a, t, f * 4, 0.08, "sine", 0.08 * vol); },
    glocke(a, m, dur, t, vol) { const f = mf(m); [[1, 0.22], [2, 0.08], [2.76, 0.06], [5.4, 0.03]].forEach(([k, v]) => ping(a, t, f * k, 2.6 / Math.sqrt(k), "sine", v * vol)); },
    kick(a, m, dur, t, vol) { ping(a, t, 130, 0.35, "sine", 0.8 * vol, 45); },
    snare(a, m, dur, t, vol) { nz(a, t, 0.18, "bandpass", 2800, 0.7, 0.45 * vol); ping(a, t, 200, 0.1, "triangle", 0.25 * vol, 170); },
    hat(a, m, dur, t, vol) { nz(a, t, 0.05, "highpass", 7000, 0.5, 0.25 * vol); },
    klatsch(a, m, dur, t, vol) { [0, 0.012, 0.024].forEach(w => nz(a, t + w, 0.09, "bandpass", 1500, 1.2, 0.35 * vol)); },
  };
  function play(s, name, m, dur = 0.4, when = 0, vol = 1) {
    const a = ac(s); if (!a) return;
    const t = a.currentTime + 0.03 + when;
    if (PERC[name]) return PERC[name](a, m, dur, t, vol);
    const v = VOICES[name]; if (!v) return;
    const f = mf(m), hold = Math.max(v.a, dur), end = t + hold + v.r + 0.06;
    const g = a.createGain(), peak = (v.vol || 0.2) * vol;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + v.a);
    g.gain.setValueAtTime(peak, t + hold); g.gain.linearRampToValueAtTime(0, t + hold + v.r);
    g.connect(OUT);
    let dest = g;
    if (v.ft) {
      const fl = a.createBiquadFilter(); fl.type = v.ft; fl.Q.value = v.q || 1;
      if (v.fenv) { fl.frequency.setValueAtTime(f * v.fenv[0], t); fl.frequency.exponentialRampToValueAtTime(Math.min(12000, f * v.fenv[1]), t + v.fenv[2]); }
      else fl.frequency.value = v.fc(f);
      fl.connect(g); dest = fl;
    }
    const oscs = [];
    const mk = (type, mult, det, lvl) => { const o = a.createOscillator(); o.type = type; o.frequency.value = f * mult; o.detune.value = det; const og = a.createGain(); og.gain.value = lvl; o.connect(og); og.connect(dest); o.start(t); o.stop(end); oscs.push(o); };
    mk(v.w, 1, 0, 1);
    if (v.det) mk(v.w, 1, v.det, 0.7);
    if (v.h2) mk("sine", 2, 0, v.h2);
    if (v.vib) { const l = a.createOscillator(), lg = a.createGain(); l.frequency.value = v.vib[0]; lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(f * v.vib[1], t + 0.3); l.connect(lg); oscs.forEach(o => lg.connect(o.frequency)); l.start(t); l.stop(end); }
    if (v.breath) { const src = a.createBufferSource(); src.buffer = noiseBuf(a); const bf = a.createBiquadFilter(); bf.type = "bandpass"; bf.frequency.value = Math.min(8000, f * 2); bf.Q.value = 1.5; const bg = a.createGain(); bg.gain.value = v.breath / (v.vol || 0.2); src.connect(bf); bf.connect(bg); bg.connect(g); src.start(t); src.stop(end); }
  }
  /** play [midi|null, beats] list; returns seconds */
  function seq(s, name, notes, bpm = 120, when = 0, vol = 1) {
    const b = 60 / bpm; let t = when;
    for (const [m, beats] of notes) { if (m != null) play(s, name, m, beats * b * 0.88, t, vol); t += beats * b; }
    return t - when;
  }
  const beatsOf = notes => notes.reduce((a, n) => a + n[1], 0);

  /* ---------------- music material ---------------- */
  const COL = { A: "#2f7d32", B: "#1d5bd0", C: "#ee7a1a", D: "#7b4fd6" };
  const BPM = 132;
  /* composed for this deck */
  const SEC = {
    A: { v: "klavier", mel: [[60, 0.5], [64, 0.5], [67, 1], [64, 0.5], [67, 0.5], [72, 1], [71, 0.5], [69, 0.5], [67, 1], [64, 0.5], [62, 0.5], [60, 1]], bass: [48, 48, 43, 48] },
    B: { v: "floete", mel: [[69, 1.5], [67, 0.5], [65, 1], [64, 1], [62, 1.5], [64, 0.5], [65, 1], [67, 1]], bass: [45, 41, 38, 43] },
    C: { v: "trompete", mel: [[72, 0.5], [72, 0.5], [74, 0.5], [76, 0.5], [77, 1], [76, 1], [74, 0.5], [72, 0.5], [71, 0.5], [72, 0.5], [74, 2]], bass: [41, 48, 43, 43] },
  };
  function section(s, L, bpm = BPM, when = 0) {
    const S = SEC[L];
    seq(s, S.v, S.mel, bpm, when);
    S.bass.forEach((m, i) => play(s, "pizz", m, 0.5, when + i * 2 * 60 / bpm));
    return beatsOf(S.mel) * 60 / bpm;
  }

  /* ---------------- form strip (coloured blocks + playhead) ---------------- */
  function strip(s, parts, w = 1100, h = 120, opts = {}) {
    // parts: [{L, label, beats, color, sub}]
    const svg = s.svg(w, h + (opts.sub ? 34 : 0));
    const total = parts.reduce((a, p) => a + (p.beats || 8), 0), gap = 8;
    const unit = (w - gap * (parts.length - 1)) / total;
    let x = 0;
    const blocks = parts.map(p => {
      const bw = (p.beats || 8) * unit, g = s.el("g", { class: opts.later ? "later" : "" });
      const r = s.el("rect", { x, y: 0, width: bw, height: h, rx: 14, fill: p.color || COL[p.L], opacity: 0.85 });
      const tx = s.el("text", { x: x + bw / 2, y: h / 2 + (p.label ? 8 : 16), "text-anchor": "middle", "font-size": p.label ? (opts.fs || 22) : 48, "font-weight": 800, fill: "#fff", text: p.label || p.L });
      g.append(r, tx);
      if (opts.sub && p.sub) g.append(s.el("text", { x: x + bw / 2, y: h + 26, "text-anchor": "middle", "font-size": 19, fill: "#5d6678", text: p.sub }));
      svg.append(g);
      const b = { g, r, x, w: bw }; x += bw + gap; return b;
    });
    const head = s.el("rect", { x: 0, y: -2, width: 6, height: h + 4, rx: 3, fill: "#1b2740", opacity: 0 });
    svg.append(head);
    return {
      svg, blocks,
      at(i, p) { const b = blocks[i]; head.setAttribute("opacity", 1); head.setAttribute("x", b.x + Math.min(b.w - 6, p * b.w)); blocks.forEach((B, j) => B.r.setAttribute("opacity", j === i ? 1 : 0.45)); },
      done() { head.setAttribute("opacity", 0); blocks.forEach(B => B.r.setAttribute("opacity", 0.85)); },
    };
  }
  /** play a list of letters on a strip; fn(L, i) plays one part and returns seconds */
  async function playParts(s, st, n, fn, state) {
    for (let i = 0; i < n; i++) {
      if (!s.alive || (state && state.stop)) break;
      const sec = fn(i);
      await s.tween({ from: 0, to: 1, dur: sec * 1000, ease: "linear", update: p => st.at(i, p) });
    }
    st.done();
  }

  /* ---------------- piano roll (notes as coloured bars) ---------------- */
  function roll(s, w, h, notes, opts = {}) {
    const svg = s.svg(w, h);
    const lo = opts.lo != null ? opts.lo : Math.min(...notes.filter(n => n[0] != null).map(n => n[0])) - 2;
    const hi = opts.hi != null ? opts.hi : Math.max(...notes.filter(n => n[0] != null).map(n => n[0])) + 2;
    const total = opts.beats || beatsOf(notes), bx = w / total, ny = m => h - 8 - (m - lo) / (hi - lo) * (h - 26);
    for (let i = 0; i <= total; i++) svg.append(s.el("line", { x1: i * bx, y1: 0, x2: i * bx, y2: h, stroke: "#e4ebf2", "stroke-width": i % 4 ? 1 : 2 }));
    const bars = [];
    let t = 0;
    notes.forEach(([m, b], i) => {
      if (m != null) {
        const r = s.el("rect", { x: t * bx + 2, y: ny(m) - 9, width: Math.max(6, b * bx - 4), height: 18, rx: 9, fill: (opts.color && opts.color(i)) || "#2f7d32" });
        svg.append(r); bars.push({ r, t, b, m, i });
      }
      t += b;
    });
    return {
      svg, bars, bx, ny, total,
      /** light up bars over time (seconds per beat) */
      async light(bpm) {
        for (const B of bars) { B.r.setAttribute("opacity", 0.35); }
        let last = 0;
        for (const B of bars) {
          await s.wait((B.t - last) * 60000 / bpm); last = B.t; if (!s.alive) return;
          B.r.setAttribute("opacity", 1);
        }
      },
      morph(newNotes, dur = 500) {
        let tt = 0; const targets = [];
        newNotes.forEach(([m, b]) => { if (m != null) targets.push({ x: tt * bx + 2, y: ny(m) - 9, w: Math.max(6, b * bx - 4) }); tt += b; });
        bars.forEach((B, i) => {
          const T = targets[i] || { x: B.r.getAttribute("x") * 1, y: B.r.getAttribute("y") * 1, w: 0 };
          const fx = +B.r.getAttribute("x"), fy = +B.r.getAttribute("y"), fw = +B.r.getAttribute("width");
          s.tween({ from: 0, to: 1, dur, ease: "out", update: p => { B.r.setAttribute("x", fx + (T.x - fx) * p); B.r.setAttribute("y", fy + (T.y - fy) * p); B.r.setAttribute("width", Math.max(0, fw + (T.w - fw) * p)); } });
        });
      },
    };
  }
  const txt = (s, x, y, t, o = {}) => s.el("text", Object.assign({ x, y, "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: "#1b2740", text: t }, o));
  const lifeBox = (s, text, cls = "life later") => s.h("div", { class: cls }, s.h("span", { class: "exlabel" }, "Im Alltag"), s.h("p", { class: "small" }, text));

  /* traditional / public-domain melodies */
  const WEIHN = { // "Morgen kommt der Weihnachtsmann" = "Ah ! vous dirai-je, maman" (18th c.)
    A: [[60, 1], [60, 1], [67, 1], [67, 1], [69, 1], [69, 1], [67, 2], [65, 1], [65, 1], [64, 1], [64, 1], [62, 1], [62, 1], [60, 2]],
    B: [[67, 1], [67, 1], [65, 1], [65, 1], [64, 1], [64, 1], [62, 2], [67, 1], [67, 1], [65, 1], [65, 1], [64, 1], [64, 1], [62, 2]],
  };
  const JAKOB = [[60, 1], [62, 1], [64, 1], [60, 1], [60, 1], [62, 1], [64, 1], [60, 1], [64, 1], [65, 1], [67, 2], [64, 1], [65, 1], [67, 2],
    [67, 0.5], [69, 0.5], [67, 0.5], [65, 0.5], [64, 1], [60, 1], [67, 0.5], [69, 0.5], [67, 0.5], [65, 0.5], [64, 1], [60, 1], [60, 1], [55, 1], [60, 2], [60, 1], [55, 1], [60, 2]];

  /* ================================================================== */
  Deck.unit({
    id: "u6", num: 6, title: "Musikalische Formen", color: "#2f7d32", soft: "#e3f2e4",
    subtitle: "Wie Musik gebaut ist – mit Bausteinen und Buchstaben",
    blurb: "Motiv, Wiederholung, ABA, Rondo, Kanon, Refrain und mehr.",
    goals: ["Motiv und Phrase: die kleinsten Bausteine", "Wiederholung, Variation und Kontrast", "Formen mit Buchstaben: AB, ABA, Rondo", "Kanon, Ostinato, Bordun, Ruf und Antwort", "Strophe, Refrain und Bridge im Popsong"],
    icon(svg, el) {
      [["#2f7d32", 4, "A"], ["#1d5bd0", 25, "B"], ["#2f7d32", 46, "A"]].forEach(([c, x, l]) => svg.append(el("rect", { x, y: 18, width: 19, height: 34, rx: 5, fill: c }), el("text", { x: x + 9.5, y: 41, "text-anchor": "middle", "font-size": 16, "font-weight": 800, fill: "#fff", text: l })));
    },
    slides: [
      /* ---------- 1 ---------- */
      {
        title: "Das Motiv",
        say: "Ein Motiv ist der kleinste Baustein einer Melodie. Es ist kurz, und man erkennt es sofort wieder.",
        build(s) {
          const M = [
            { h: "Beethoven, 5. Sinfonie", t: "kurz – kurz – kurz – lang. Uraufführung 1808 in Wien.", notes: [[null, 0.5], [67, 0.5], [67, 0.5], [67, 0.5], [63, 3]], v: "streicher", bpm: 200, lo: 58, hi: 72, pic: "beethoven", pos: "50% 30%", cap: "Ludwig van Beethoven", rec: "beethoven5-anfang", dur: 5 },
            { h: "Kuckucksruf", t: "Zwei Töne, von oben nach unten. Wie der Vogel im Wald.", notes: [[79, 1], [76, 2], [79, 1], [76, 2]], v: "floete", bpm: 150, lo: 72, hi: 83, pic: "kuckuck-vogel", pos: "60% 40%", cap: "Kuckuck", rec: "kuckuck", dur: 6 },
            { h: "Big-Ben-Gong", t: "Vier Töne vom Uhrturm in London. Auch Türklingeln und Schulgongs spielen sie.", notes: [[68, 1], [66, 1], [64, 1], [59, 2]], v: "glocke", bpm: 80, lo: 56, hi: 71, pic: "big-ben", pos: "50% 45%", cap: "Big Ben, London", rec: "westminster-gong", dur: 10 },
            { h: "Jagdsignal", t: "Ein Sprung nach oben: kurz, laut, wie ein Ruf.", notes: [[60, 1], [65, 2], [60, 1], [65, 2]], v: "trompete", bpm: 150, lo: 56, hi: 69, pic: "jagdhoerner", pos: "50% 80%", cap: "Jagdhörner", rec: "jagdsignal", dur: 8 },
          ];
          const tiles = M.map((d, i) => {
            const real = s.soundBtn(d.rec, "Echt hören", { dur: d.dur });
            real.style.alignSelf = "flex-start"; real.style.marginTop = "auto";
            real.addEventListener("click", e => e.stopPropagation());
            const R = roll(s, 210, 64, d.notes, { lo: d.lo, hi: d.hi, color: () => ["#2f7d32", "#1d5bd0", "#ee7a1a", "#7b4fd6"][i] });
            const go = () => { seq(s, d.v, d.notes, d.bpm); R.light(d.bpm); };
            const tile = s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "8px", padding: "14px 16px", cursor: "pointer" }, onclick: go },
              s.photo(d.pic, { w: "100%", h: 104, pos: d.pos, caption: d.cap }), R.svg, s.h("p", { class: "h2", style: { fontSize: "22px" } }, d.h), s.h("p", { class: "small" }, d.t), real);
            tile.go = go; return tile;
          });
          const merk = s.h("div", { class: "merk later" }, "Ein ", s.h("b", null, "Motiv"), " ist der kleinste Baustein einer Melodie – wie ein Wort im Satz. Man erkennt es sofort wieder.");
          s.add(s.h("div", { class: "stack", style: { gap: "14px" } },
            s.h("p", { class: "t a-up" }, "Tippe eine Karte an: Die Balken zeigen die Töne. „Echt hören“ = echte Aufnahme."),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "14px" } }, tiles), merk));
          tiles.forEach((tl, i) => s.step(async () => { s.show(tl, "up"); tl.go(); s.say(M[i].h); }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* ---------- 2 ---------- */
      {
        title: "Die Phrase",
        say: "Mehrere Motive ergeben eine Phrase, so wie Wörter einen Satz ergeben. Am Ende einer Phrase holt man Luft.",
        build(s) {
          const Q = [[60, 0.5], [64, 0.5], [67, 1], [64, 0.5], [67, 0.5], [72, 1], [71, 0.5], [69, 0.5], [67, 1], [65, 0.5], [64, 0.5], [62, 1]];
          const A = [[60, 0.5], [64, 0.5], [67, 1], [64, 0.5], [67, 0.5], [72, 1], [71, 0.5], [69, 0.5], [67, 1], [64, 0.5], [62, 0.5], [60, 1]];
          const cols = ["#2f7d32", "#1d5bd0", "#ee7a1a", "#7b4fd6"];
          const motifOf = i => (i < 3 ? 0 : i < 6 ? 1 : i < 9 ? 2 : 3);
          const R1 = roll(s, 1040, 150, Q, { lo: 58, hi: 79, color: i => cols[motifOf(i)] });
          const R2 = roll(s, 1040, 150, A, { lo: 58, hi: 79, color: i => cols[motifOf(i)] });
          const arc1 = s.el("path", { d: "M10,30 Q520,-26 1030,30", stroke: "#dc3b2a", "stroke-width": 4, fill: "none", class: "later" });
          const br1 = txt(s, 1022, 44, "’", { "font-size": 44, fill: "#dc3b2a", class: "later" });
          R1.svg.prepend(arc1); R1.svg.append(br1);
          const lab = (t, c) => s.h("span", { class: "chip", style: { background: c, color: "#fff" } }, t);
          const labels = s.h("div", { class: "row later", style: { gap: "10px" } }, lab("Motiv 1", cols[0]), lab("Motiv 2", cols[1]), lab("Motiv 3", cols[2]), lab("Motiv 4", cols[3]));
          const r2wrap = s.h("div", { class: "later" }, s.h("p", { class: "small", style: { marginBottom: "4px" } }, s.h("b", null, "Phrase 2 – die Antwort:"), " endet unten auf dem Grundton. Fertig!"), R2.svg);
          const r1title = s.h("p", { class: "small", style: { marginBottom: "4px" } }, s.h("b", null, "Phrase 1 – die Frage:"), " endet offen, sie will weitergehen.");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Motive ergeben eine ", s.h("b", null, "Phrase"), " – wie Wörter einen Satz. Frage-Phrase + Antwort-Phrase klingen zusammen fertig, wie „Kommst du mit?“ – „Ja, ich komme mit.“");
          s.add(s.h("div", { class: "stack", style: { gap: "10px" } }, labels, s.h("div", null, r1title, R1.svg), r2wrap, merk));
          const playMotif = k => { const ns = Q.filter((_, i) => motifOf(i) === k); seq(s, "klavier", ns, 132); };
          s.step(async () => { s.show(labels, "up"); for (let k = 0; k < 4; k++) { if (!s.alive) return; playMotif(k); await s.wait(1000); } });
          s.step(async () => { s.show(arc1, "draw"); s.show(br1, "pop", 900); seq(s, "klavier", Q, 132); R1.light(132); s.say("Eine Phrase. Am Ende: Luft holen."); });
          s.step(async () => { s.show(r2wrap, "up"); seq(s, "klavier", A, 132); R2.light(132); });
          s.step(async () => { s.show(merk, "up"); seq(s, "klavier", Q.concat(A), 132); s.sfx.ding(); });
        },
      },
      /* ---------- 3 ---------- */
      {
        title: "Wiederholung: ‖: … :‖",
        say: "Die Wiederholungszeichen sagen: Alles dazwischen wird noch einmal gespielt.",
        build(s) {
          const svg = s.svg(1100, 250);
          const A = SEC.A.mel, B = SEC.B.mel;
          const lo = 58, hi = 76, ny = m => 200 - (m - lo) / (hi - lo) * 160;
          const ax0 = 110, ax1 = 530, bx0 = 640, bx1 = 1040, ab = (ax1 - ax0) / 8, bb = (bx1 - bx0) / 8;
          const bars = (notes, x0, w, col) => { let t = 0; const out = []; notes.forEach(([m, b]) => { const r = s.el("rect", { x: x0 + t * w + 2, y: ny(m) - 9, width: b * w - 4, height: 18, rx: 9, fill: col }); out.push(r); svg.append(r); t += b; }); return out; };
          svg.append(s.el("rect", { x: 60, y: 30, width: 1000, height: 190, rx: 12, fill: "#fff", stroke: "#c8d3de", "stroke-width": 2 }));
          const ba = bars(A, ax0, ab, COL.A), bbs = bars(B, bx0, bb, COL.B);
          svg.append(txt(s, (ax0 + ax1) / 2, 236, "Teil A", { fill: COL.A, "font-size": 19 }), txt(s, (bx0 + bx1) / 2, 236, "Teil B", { fill: COL.B, "font-size": 19 }));
          const sign = (x, end) => { const g = s.el("g", { class: "later" }); const d = end ? -1 : 1;
            g.append(s.el("rect", { x: end ? x - 8 : x, y: 40, width: 8, height: 170, fill: "#1b2740" }), s.el("rect", { x: x + d * 14 - (end ? 3 : 0), y: 40, width: 3, height: 170, fill: "#1b2740" }),
              s.el("circle", { cx: x + d * 28, cy: 105, r: 7, fill: "#1b2740" }), s.el("circle", { cx: x + d * 28, cy: 145, r: 7, fill: "#1b2740" })); svg.append(g); return g; };
          const s1 = sign(70, false), s2 = sign(580, true);
          svg.append(s.el("rect", { x: 1050, y: 40, width: 3, height: 170, fill: "#1b2740" }));
          const back = s.el("path", { d: "M560,26 C460,-4 200,-4 100,26", stroke: "#dc3b2a", "stroke-width": 4, fill: "none", "marker-end": "", class: "later" });
          const backHead = s.el("path", { d: "M100,26 L116,14 L118,30 Z", fill: "#dc3b2a", class: "later" });
          svg.append(back, backHead);
          const head = s.el("rect", { x: 100, y: 34, width: 6, height: 182, rx: 3, fill: "#dc3b2a", opacity: 0 });
          const count = txt(s, 300, 70, "", { "font-size": 26, fill: "#dc3b2a" });
          svg.append(head, count);
          const sec = 60 / BPM;
          const run = async (x0, x1, beats, label, play) => {
            count.textContent = label; play();
            head.setAttribute("opacity", 1);
            await s.tween({ from: x0, to: x1, dur: beats * sec * 1000, ease: "linear", update: x => head.setAttribute("x", x) });
          };
          const playAll = async () => {
            await run(ax0, ax1, 8, "1. Mal", () => section(s, "A"));
            if (!s.alive) return; s.show([back, backHead], "fade"); s.sfx.swoosh();
            await run(ax0, ax1, 8, "2. Mal", () => section(s, "A"));
            if (!s.alive) return;
            await run(bx0, bx1, 8, "", () => section(s, "B"));
            head.setAttribute("opacity", 0);
          };
          const btn = s.h("button", { class: "btn solid", onclick: playAll }, "Abspielen");
          const merk = s.h("div", { class: "merk later" }, s.h("b", null, "‖:  :‖"), " heißt: Alles zwischen den Zeichen wird ", s.h("b", null, "noch einmal"), " gespielt. Das spart Platz – und Wiederholtes kann man sich gut merken.");
          const life = lifeBox(s, "Der Refrain im Lied kommt immer wieder. Klatschspiele auf dem Schulhof wiederholen ihr Muster. Abzählreime wiederholen ihre Zeilen.");
          s.add(s.h("div", { class: "stack", style: { gap: "14px" } }, svg, s.h("div", { class: "row" }, btn, s.h("p", { class: "small pencil" }, "Der rote Strich zeigt, wo die Musik gerade ist.")),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "16px" } }, merk, life)));
          s.step(async () => { s.show(s1, "left"); s.sfx.snap(); await s.wait(300); s.show(s2, "right"); s.sfx.snap(); s.say("Anfang und Ende der Wiederholung."); });
          s.step(async () => { await playAll(); });
          s.step(async () => { s.show(merk, "up"); s.sfx.ding(); await s.wait(300); s.show(life, "up"); });
        },
      },
      /* ---------- 4 ---------- */
      {
        title: "Variation: gleich und doch anders",
        say: "Bei einer Variation bleibt die Melodie erkennbar, aber etwas wird verändert: Tonart, Rhythmus, Verzierungen oder Tempo.",
        build(s) {
          const T = WEIHN.A;
          const VAR = {
            thema: { n: "Thema", v: "klavier", bpm: 150, notes: T, t: "Das Original." },
            moll: { n: "Moll", v: "streicher", bpm: 120, notes: T.map(([m, b]) => [m === 64 ? 63 : m === 69 ? 68 : m, b]), t: "Zwei Töne rutschen tiefer: Es klingt traurig." },
            rhythmus: { n: "Neuer Rhythmus", v: "marimba", bpm: 150, notes: (() => { let c = 0; return T.map(([m, b]) => [m, b === 1 ? (c++ % 2 ? 0.5 : 1.5) : b]); })(), t: "Lang – kurz, lang – kurz: Es hüpft." },
            verziert: { n: "Verziert", v: "floete", bpm: 130, notes: T.flatMap(([m, b]) => (b === 1 ? [[m, 0.5], [m + 2, 0.25], [m, 0.25]] : [[m, b]])), t: "Kleine Extra-Töne schmücken die Melodie." },
            tief: { n: "Tief und langsam", v: "streicher", bpm: 80, notes: T.map(([m, b]) => [m - 12, b]), t: "Eine Oktave tiefer und viel langsamer." },
          };
          const holder = s.h("div", { style: { height: "170px" } });
          const desc = s.h("p", { class: "t" }, "");
          let R = null;
          const keys = Object.keys(VAR);
          const btns = {};
          function pick(k) {
            const d = VAR[k];
            keys.forEach(x => btns[x].classList.toggle("solid", x === k));
            R = roll(s, 1100, 170, d.notes, { lo: 46, hi: 74, beats: 16, color: () => (k === "thema" ? COL.A : k === "moll" ? COL.B : k === "rhythmus" ? COL.C : k === "verziert" ? COL.D : "#5d6678") });
            holder.replaceChildren(R.svg); s.show(R.svg, "fade");
            desc.replaceChildren(s.h("b", null, d.n + ": "), d.t);
            seq(s, d.v, d.notes, d.bpm); R.light(d.bpm);
          }
          keys.forEach(k => { btns[k] = s.h("button", { class: "btn", onclick: () => pick(k) }, VAR[k].n); });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Variation: Die Melodie bleibt ", s.h("b", null, "erkennbar"), ", aber etwas ändert sich. Mozart schrieb 12 Variationen über diese Melodie (KV 265).");
          const life = lifeBox(s, "Ein Remix eines Songs, ein Lied in neuer Version (Cover), ein Klingelton in einer anderen Fassung.");
          const mz = s.h("div", { class: "card later", style: { display: "grid", gridTemplateColumns: "120px 1fr", gap: "12px", alignItems: "center", padding: "10px 12px" } },
            s.photo("mozart", { w: 120, h: 190, pos: "50% 25%" }),
            s.h("div", { class: "stack", style: { gap: "6px" } }, s.h("p", { class: "small", style: { fontWeight: "700" } }, "Mozart, echt gespielt:"),
              s.soundBtn("mozart-thema", "Thema"), s.soundBtn("mozart-var1", "Variation 1"), s.soundBtn("mozart-var5", "Variation 5")));
          s.add(s.h("div", { class: "stack", style: { gap: "10px" } },
            s.h("p", { class: "small" }, "Das Thema ist ein altes französisches Volkslied. Bei uns heißt es „Morgen kommt der Weihnachtsmann“, in England „Twinkle, Twinkle, Little Star“."),
            s.h("div", { class: "row", style: { gap: "10px" } }, keys.map(k => btns[k])), desc, holder,
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1.2fr 0.8fr", gap: "16px" } }, merk, mz, life)));
          pick("thema");
          ["moll", "rhythmus", "verziert", "tief"].forEach(k => s.step(async () => { pick(k); s.say(VAR[k].n + ". " + VAR[k].t); }));
          s.step(async () => { s.show(merk, "up"); s.show(mz, "up", 200); s.sound("mozart-var1", { dur: 6 }); await s.wait(300); s.show(life, "up"); });
        },
      },
      /* ---------- 5 ---------- */
      {
        title: "Kontrast: ganz anders!",
        say: "Kontrast heißt: Es kommt etwas ganz anderes. Schnell gegen langsam, laut gegen leise, hoch gegen tief.",
        build(s) {
          const KA = [[72, 0.5], [76, 0.5], [79, 0.5], [76, 0.5], [72, 0.5], [76, 0.5], [79, 1], [81, 0.5], [79, 0.5], [77, 0.5], [76, 0.5], [74, 0.5], [72, 1.5]];
          const KB = [[57, 2], [60, 1], [59, 1], [57, 2], [52, 2], [53, 2], [55, 1], [53, 1], [52, 4]];
          const meters = [["Tempo", "schnell", "langsam", 0.9, 0.25], ["Lautstärke", "laut", "leise", 0.95, 0.3], ["Tonhöhe", "hoch", "tief", 0.85, 0.25], ["Tongeschlecht", "Dur: fröhlich", "Moll: ernst", 0.8, 0.8]];
          const panel = (side, title, col, play) => {
            const fills = [], vals = [];
            const rows = meters.map(([n, a, b, va, vb]) => {
              const f = s.h("div", { style: { height: "100%", width: "0%", background: col, borderRadius: "9px" } });
              fills.push([f, side === "A" ? va : vb]);
              return s.h("div", { style: { display: "grid", gridTemplateColumns: "130px 1fr 150px", gap: "10px", alignItems: "center" } },
                s.h("p", { class: "small pencil" }, n), s.h("div", { style: { height: "20px", background: "#eef2f6", borderRadius: "10px" } }, f), s.h("p", { class: "small", style: { fontWeight: "700" } }, side === "A" ? a : b));
            });
            const btn = s.h("button", { class: "btn" + (side === "A" ? " solid" : ""), style: { borderColor: col, background: side === "A" ? col : "", color: side === "A" ? "#fff" : col }, onclick: () => go() }, "Anhören");
            const card = s.h("div", { class: "card later", style: { borderColor: col, borderWidth: "3px" } },
              s.h("div", { class: "row", style: { justifyContent: "space-between", marginBottom: "10px" } }, s.h("p", { class: "h2", style: { color: col } }, title), btn), s.h("div", { class: "stack", style: { gap: "10px" } }, rows));
            const go = () => { play(); fills.forEach(([f, v], i) => s.tween({ from: 0, to: v, dur: 700, delay: i * 120, ease: "out", update: x => { f.style.width = Math.round(x * 100) + "%"; } })); };
            card.go = go; return card;
          };
          const pA = panel("A", "Teil A: fröhlich", COL.C, () => { seq(s, "trompete", KA, 168); [0, 1, 2, 3, 4, 5].forEach(i => play(s, "snare", 0, 0, i * 60 / 168 * 2 + 60 / 168, 0.6)); });
          const pB = panel("B", "Teil B: ruhig", COL.B, () => { seq(s, "streicher", KB, 70, 0, 0.6); play(s, "streicher", 45, 60 / 70 * 15, 0, 0.4); });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, s.h("b", null, "Kontrast"), " = etwas ganz anderes kommt. Er macht Musik spannend. Danach freut man sich, wenn A zurückkommt.");
          const life = lifeBox(s, "Im Film: erst eine ruhige Szene, dann die Verfolgungsjagd. Im Sport: Sprint, dann Pause. Im Alltag: laute Pause auf dem Hof, dann die leise Stillarbeit.");
          const kst = strip(s, [{ L: "A", color: COL.C }, { L: "B", color: COL.B }, { L: "A", color: COL.C }], 820, 90);
          const kwrap = s.h("div", { class: "row later", style: { gap: "16px", flexWrap: "nowrap" } }, kst.svg,
            s.h("button", { class: "btn solid", onclick: () => kgo() }, "A – B – A"));
          const kgo = () => playParts(s, kst, 3, i => (i === 1 ? (seq(s, "streicher", KB, 70, 0, 0.6), 16 * 60 / 70) : (seq(s, "trompete", KA, 168), 8 * 60 / 168)));
          s.add(s.h("div", { class: "stack", style: { gap: "14px" } }, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" } }, pA, pB),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" } }, merk, life), kwrap));
          s.step(async () => { s.show(pA, "left"); pA.go(); });
          s.step(async () => { s.show(pB, "right"); pB.go(); });
          s.step(async () => { s.show(merk, "up"); s.sfx.ding(); await s.wait(300); s.show(life, "up"); });
          s.step(async () => { s.show(kwrap, "up"); await kgo(); });
        },
      },
      /* ---------- 6 ---------- */
      {
        title: "Zweiteilige Liedform: A B",
        say: "Eine Form beschreiben wir mit Buchstaben. Gleiche Teile bekommen gleiche Buchstaben. A B heißt: zwei verschiedene Teile.",
        build(s) {
          const st = strip(s, [{ L: "A", sub: "Teil A" }, { L: "B", sub: "Teil B: neu" }], 1100, 150, { sub: true, later: true });
          const go = () => playParts(s, st, 2, i => section(s, "AB"[i]));
          const how = s.h("div", { class: "card later" }, s.h("span", { class: "exlabel" }, "So geht die Buchstaben-Sprache"),
            s.h("p", { class: "t" }, "Gleiche Musik = gleicher Buchstabe. Neue Musik = neuer Buchstabe. Der erste Teil heißt immer A."));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, s.h("b", null, "Zweiteilige Liedform A B:"), " Erst Teil A, dann ein anderer Teil B – dann ist das Stück zu Ende.");
          const life = lifeBox(s, "Viele Tänze und Märsche sind zweiteilig gebaut – zum Beispiel bei der Blaskapelle. Wie Frage und Antwort: Ein Teil fängt an, der andere schließt ab.");
          s.add(s.h("div", { class: "stack", style: { gap: "16px" } }, st.svg, s.h("div", { class: "row" }, s.h("button", { class: "btn solid", onclick: go }, "Abspielen"), s.h("p", { class: "small pencil" }, "Selbst ausgedachte Melodie, am Computer gespielt.")),
            how, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" } }, merk, life)));
          s.step(async () => { s.show(st.blocks[0].g, "left"); section(s, "A"); await s.wait(400); s.show(how, "up"); });
          s.step(async () => { s.show(st.blocks[1].g, "left"); section(s, "B"); });
          s.step(async () => { await go(); });
          s.step(async () => { s.show(merk, "up"); s.sfx.ding(); await s.wait(300); s.show(life, "up"); });
        },
      },
      /* ---------- 7 ---------- */
      {
        title: "Dreiteilige Liedform: A B A",
        say: "Bei A B A kommt der Anfang am Ende zurück. Hör dir das Lied Morgen kommt der Weihnachtsmann an.",
        build(s) {
          const st = strip(s, [{ L: "A", sub: "Anfang" }, { L: "B", sub: "Mitte: neu" }, { L: "A", sub: "Anfang kommt zurück" }], 1100, 150, { sub: true, later: true });
          const P = [WEIHN.A, WEIHN.B, WEIHN.A];
          const partSnd = i => { const sec = seq(s, "klavier", P[i], 150); (i === 1 ? [48, 43, 48, 43, 48, 43, 48, 43] : [48, 48, 53, 48, 53, 48, 43, 48]).forEach((m, k) => play(s, "pizz", m, 0.5, k * 0.8)); return sec; };
          const go = () => playParts(s, st, 3, partSnd);
          const ex = s.h("div", { class: "ex later", style: { display: "grid", gridTemplateColumns: "120px 1fr", gap: "16px", alignItems: "center" } },
            s.photo("fallersleben", { w: 120, h: 150, pos: "50% 25%" }),
            s.h("div", null, s.h("span", { class: "exlabel" }, "Beispiele: Volkslieder in A B A"),
              s.h("p", { class: "small" }, "„Morgen kommt der Weihnachtsmann“, „Alle Vögel sind schon da“, „Weißt du, wie viel Sternlein stehen“. Die Texte von Hoffmann von Fallersleben (Foto) sind fast 200 Jahre alt.")));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, s.h("b", null, "A B A:"), " Anfang – etwas Neues – der Anfang kommt zurück. Das klingt rund und fertig.");
          const life = lifeBox(s, "Wie ein Sandwich: Brot – Belag – Brot. Wie ein Ausflug: zu Hause – Zoo – wieder zu Hause.");
          s.add(s.h("div", { class: "stack", style: { gap: "14px" } }, st.svg,
            s.h("div", { class: "row" }, s.h("button", { class: "btn solid", onclick: go }, "Ganzes Lied abspielen"), s.h("p", { class: "small pencil" }, "„Morgen kommt der Weihnachtsmann“ – traditionelle Melodie")),
            ex, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" } }, merk, life)));
          [0, 1, 2].forEach(i => s.step(async () => { s.show(st.blocks[i].g, "left"); await playParts(s, { at: (j, p) => st.at(i, p), done: () => st.done() }, 1, () => partSnd(i)); }));
          s.step(async () => { s.show(ex, "up"); s.show(merk, "up", 200); s.sfx.ding(); });
          s.step(async () => { s.show(life, "up"); await go(); });
        },
      },
      /* ---------- 8 ---------- */
      {
        title: "Rondo: A B A C A",
        say: "Im Rondo kommt Teil A immer wieder zurück. Dazwischen gibt es jedes Mal etwas Neues: B, dann C.",
        build(s) {
          const L = "ABACA";
          const st = strip(s, L.split("").map(x => ({ L: x, sub: x === "A" ? "Refrain" : "Neues" })), 1100, 150, { sub: true, later: true });
          const go = () => playParts(s, st, 5, i => section(s, L[i]));
          const ex = s.h("div", { class: "ex later", style: { display: "grid", gridTemplateColumns: "130px 1fr", gap: "16px", alignItems: "center" } },
            s.photo("beethoven", { w: 130, h: 150, pos: "50% 30%" }),
            s.h("div", { class: "stack", style: { gap: "8px" } }, s.h("span", { class: "exlabel" }, "Berühmtes Beispiel"),
              s.h("p", { class: "small" }, "Ludwig van Beethoven: „Für Elise“ – ein kleines Rondo mit der Form A B A C A. Teil A kennt fast jeder."),
              s.h("div", { class: "row" }, s.soundBtn("fuer-elise", "Teil A von „Für Elise“ hören"))));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, s.h("b", null, "Rondo:"), " A kehrt immer wieder (wie ein Refrain). Dazwischen kommen neue Teile: B, C, D …");
          const life = lifeBox(s, "Wie ein Rundgang: Nach jeder Station kommst du zum Treffpunkt zurück. Wie eine TV-Show: Zwischen den Beiträgen läuft immer dieselbe Erkennungsmelodie.");
          s.add(s.h("div", { class: "stack", style: { gap: "14px" } }, st.svg,
            s.h("div", { class: "row" }, s.h("button", { class: "btn solid", onclick: go }, "Rondo abspielen"), s.h("p", { class: "small pencil" }, "Selbst ausgedachte Melodien")),
            ex, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" } }, merk, life)));
          s.step(async () => { s.show(st.blocks.map(b => b.g), "left"); await go(); });
          s.step(async () => { s.show(ex, "up"); s.sound("fuer-elise", { dur: 8 }); });
          s.step(async () => { s.show(merk, "up"); s.sfx.ding(); await s.wait(300); s.show(life, "up"); });
        },
      },
      /* ---------- 9 ---------- */
      {
        title: "Formen-Baukasten",
        say: "Bau dir selbst eine Form. Tippe auf A, B oder C und spiel sie ab.",
        build(s) {
          let form = "ABA";
          const holder = s.h("div", { style: { height: "200px" } });
          const name = s.h("p", { class: "big", style: { color: "var(--unit)" } }, "");
          let st = null, state = { stop: false };
          const known = { AB: "Zweiteilige Liedform", ABA: "Dreiteilige Liedform", ABACA: "Rondo", ABACABA: "Großes Rondo", AABA: "Liedform A A B A" };
          function render() {
            st = strip(s, form.split("").map(x => ({ L: x })), 1100, 200);
            holder.replaceChildren(st.svg);
            name.textContent = (form.split("").join(" ") || "–") + (known[form] ? "  ·  " + known[form] : "");
          }
          const add = L => { if (form.length >= 8) { s.sfx.error(); return; } form += L; s.sfx.pop(); render(); s.show(st.blocks[st.blocks.length - 1].g, "pop"); play(s, SEC[L].v, SEC[L].mel[0][0], 0.3); };
          const playIt = async () => { state.stop = true; await s.wait(50); state = { stop: false }; render(); await playParts(s, st, form.length, i => section(s, form[i]), state); };
          const preset = f => { form = f; render(); s.sfx.snap(); };
          const pb = L => s.h("button", { class: "btn", style: { minWidth: "84px", background: COL[L], color: "#fff", borderColor: COL[L], fontSize: "28px" }, onclick: () => add(L) }, "+ " + L);
          const tools = s.h("div", { class: "row", style: { gap: "10px" } }, pb("A"), pb("B"), pb("C"),
            s.h("button", { class: "btn", onclick: () => { form = form.slice(0, -1); s.sfx.click(); render(); } }, "Zurück"),
            s.h("button", { class: "btn", onclick: () => { form = ""; s.sfx.swoosh(); render(); } }, "Alles weg"),
            s.h("button", { class: "btn solid", onclick: playIt }, "Abspielen"));
          const presets = s.h("div", { class: "card later" }, s.h("span", { class: "exlabel" }, "Fertige Formen zum Ausprobieren"),
            s.h("div", { class: "row", style: { gap: "10px" } }, ["AB", "ABA", "AABA", "ABACA", "ABACABA"].map(f => s.h("button", { class: "btn", onclick: () => { preset(f); playIt(); } }, f.split("").join(" ")))));
          const tip = s.h("p", { class: "small pencil later" }, "Probier aus: Wie klingt eine Form ohne A am Ende? Klingt sie fertig?");
          s.add(s.h("div", { class: "stack", style: { gap: "14px" } }, name, holder, tools, presets, tip));
          render();
          s.step(async () => { s.show(presets, "up"); preset("ABACA"); playIt(); });
          s.step(async () => { s.show(tip, "up"); s.sfx.pop(); });
        },
      },
      /* ---------- 10 ---------- */
      {
        title: "Kanon: „Bruder Jakob“",
        say: "Beim Kanon singen alle dieselbe Melodie, aber nacheinander. Jede Stimme setzt zwei Takte später ein, und trotzdem passt alles zusammen.",
        build(s) {
          const PC = ["#2f7d32", "#1d5bd0", "#ee7a1a", "#7b4fd6"];
          const VO = ["klavier", "floete", "streicher", "marimba"];
          const LW = 110, W = 1100 - LW, TOT = 56, bx = W / TOT, RH = 58;
          const svg = s.svg(1100, 4 * RH + 10);
          const rows = [0, 1, 2, 3].map(v => {
            const g = s.el("g", { class: v ? "later" : "" }), y = 4 + v * RH;
            g.append(s.el("text", { x: 0, y: y + 32, "font-size": 19, "font-weight": 700, fill: "#1b2740", text: "Stimme " + (v + 1) }));
            for (let p = 0; p < 4; p++) {
              const x = LW + (v * 8 + p * 8) * bx;
              g.append(s.el("rect", { x: x + 2, y: y + 4, width: 8 * bx - 4, height: RH - 14, rx: 10, fill: PC[p], opacity: 0.85 }),
                s.el("text", { x: x + 4 * bx, y: y + 32, "text-anchor": "middle", "font-size": 22, "font-weight": 800, fill: "#fff", text: String(p + 1) }));
            }
            svg.append(g); return g;
          });
          const head = s.el("rect", { x: LW, y: 0, width: 5, height: 4 * RH + 6, rx: 2, fill: "#dc3b2a", opacity: 0 });
          svg.append(head);
          let n = 1, stopFn = null;
          const vb = [1, 2, 3, 4].map(k => s.h("button", { class: "btn" + (k === 1 ? " solid" : ""), onclick: () => { setN(k); start(); } }, k + (k === 1 ? " Stimme" : " Stimmen")));
          function setN(k) { n = k; vb.forEach((b, i) => b.classList.toggle("solid", i === k - 1)); rows.forEach((r, i) => { if (i < k) { if (r.classList.contains("later")) s.show(r, "left"); r.setAttribute("opacity", 1); } else if (!r.classList.contains("later")) r.setAttribute("opacity", 0.25); }); }
          function start() {
            if (stopFn) stopFn();
            const bpm = 120, sb = 60 / bpm, ev = [];
            for (let v = 0; v < n; v++) { let t = v * 8; JAKOB.forEach(([m, b]) => { ev.push({ t: t * sb, v, m, d: b * sb * 0.9 }); t += b; }); }
            ev.sort((a, b) => a.t - b.t);
            const total = (32 + 8 * (n - 1)) * sb;
            let i = 0;
            head.setAttribute("opacity", 1);
            if (s.fast) { head.setAttribute("opacity", 0); return; }
            stopFn = s.loop(t => {
              while (i < ev.length && ev[i].t <= t + 0.05) { const e = ev[i++]; play(s, VO[e.v], e.m, e.d, Math.max(0, e.t - t), 0.8); }
              head.setAttribute("x", LW + Math.min(TOT, t / sb) * bx);
              if (t > total + 0.3) { head.setAttribute("opacity", 0); return false; }
            });
          }
          const lyr = ["Bruder Jakob, Bruder Jakob", "Schläfst du noch? Schläfst du noch?", "Hörst du nicht die Glocken? (2×)", "Ding, dang, dong. Ding, dang, dong."];
          const legend = s.h("div", { class: "row", style: { gap: "8px" } }, lyr.map((l, i) => s.h("span", { class: "chip", style: { background: PC[i], color: "#fff" } }, (i + 1) + "  " + l)));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, s.h("b", null, "Kanon:"), " Alle spielen dieselbe Melodie, aber versetzt. Die Melodie passt zu sich selbst!");
          const fact = s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, "Gut zu wissen"), s.h("p", { class: "small" }, "Die Melodie wurde um 1780 in Frankreich aufgeschrieben („Frère Jacques“). Gustav Mahler hat sie in seiner 1. Sinfonie in Moll verwandelt."));
          const life = lifeBox(s, "Die La-Ola-Welle im Stadion: Alle machen dasselbe, nur nacheinander. Ein Echo in den Bergen. Kanon-Singen am Lagerfeuer auf Klassenfahrt.");
          s.add(s.h("div", { class: "stack", style: { gap: "10px" } }, s.h("div", { class: "row", style: { gap: "10px" } }, vb), svg, legend,
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" } }, merk, fact, life)));
          s.step(async () => { setN(1); start(); s.say("Erst singt eine Stimme allein."); });
          s.step(async () => { setN(2); start(); s.say("Jetzt setzt die zweite Stimme zwei Takte später ein."); });
          s.step(async () => { setN(4); start(); s.say("Und jetzt alle vier Stimmen."); });
          s.step(async () => { s.show(merk, "up"); s.show(fact, "up", 200); s.show(life, "up", 400); s.sfx.ding(); });
        },
      },
      /* ---------- 11 ---------- */
      {
        title: "Ostinato: das Muster bleibt",
        say: "Ein Ostinato ist ein kurzes Muster, das sich immer wieder wiederholt. Darüber kann eine Melodie spielen. Tippe die Kästchen an.",
        build(s) {
          const BASSN = [45, 45, 57, 45, 48, 45, 50, 52];
          const ROWS = [
            { n: "Bass", c: "#2f7d32", snd: i => play(s, "bass", BASSN[i], 0.22), on: [1, 0, 1, 0, 1, 0, 1, 1] },
            { n: "Trommel", c: "#1d5bd0", snd: () => play(s, "kick", 0), on: [1, 0, 0, 0, 1, 0, 0, 0] },
            { n: "Klatschen", c: "#ee7a1a", snd: () => play(s, "klatsch", 0), on: [0, 0, 1, 0, 0, 0, 1, 0] },
            { n: "Becken", c: "#7b4fd6", snd: () => play(s, "hat", 0), on: [1, 1, 1, 1, 1, 1, 1, 1] },
          ];
          const state = ROWS.map(() => Array(8).fill(false));
          const cells = ROWS.map((r, ri) => Array.from({ length: 8 }, (_, ci) => {
            const c = s.h("button", { class: "nosw", style: { height: "56px", borderRadius: "12px", border: "2px solid " + r.c, background: "#fff", cursor: "pointer", padding: "0" }, onclick: () => { state[ri][ci] = !state[ri][ci]; paint(); if (state[ri][ci]) r.snd(ci); } });
            return c;
          }));
          const paint = () => cells.forEach((row, ri) => row.forEach((c, ci) => { c.style.background = state[ri][ci] ? ROWS[ri].c : "#fff"; }));
          const grid = s.h("div", { style: { display: "grid", gridTemplateColumns: "120px repeat(8, 1fr)", gap: "8px", alignItems: "center" } },
            ROWS.map((r, ri) => [s.h("p", { class: "small", style: { fontWeight: "700", color: r.c } }, r.n), cells[ri]]));
          const MEL = [[69, 2], [72, 1], [71, 1], [69, 2], [67, 2], [69, 4], [null, 4], [72, 2], [74, 1], [76, 1], [74, 2], [72, 2], [71, 4], [69, 4]];
          let melOn = false, playing = false, step = -1, stepT = 0, melIdx = 0, melT = 0;
          const bpm = 108, sd = 60 / bpm / 2;
          s.loop((t, dt) => {
            if (!playing) return;
            stepT += Math.min(dt, 0.1);
            if (step < 0 || stepT >= sd) {
              stepT = step < 0 ? 0 : stepT - sd; step = (step + 1) % 8;
              ROWS.forEach((r, ri) => { if (state[ri][step]) r.snd(step); });
              cells.forEach(row => row.forEach((c, ci) => { c.style.outline = ci === step ? "4px solid #ffd94a" : "none"; }));
              if (melOn) {
                if (melT <= 0) { const [m, b] = MEL[melIdx]; if (m != null) play(s, "floete", m, b * sd * 0.9, 0, 0.9); melT = b; melIdx = (melIdx + 1) % MEL.length; }
                melT -= 1;
              }
            }
          });
          const pbtn = s.h("button", { class: "btn solid", onclick: () => toggle() }, "Start");
          const mbtn = s.h("button", { class: "btn", onclick: () => { melOn = !melOn; mbtn.classList.toggle("solid", melOn); melIdx = 0; melT = 0; } }, "Melodie darüber");
          function toggle(v) { playing = v == null ? !playing : v; pbtn.textContent = playing ? "Stopp" : "Start"; if (!playing) cells.forEach(row => row.forEach(c => (c.style.outline = "none"))); }
          const preset = (name, rows) => s.h("button", { class: "btn", onclick: () => { rows.forEach((on, ri) => on.forEach((v, ci) => (state[ri][ci] = !!v))); paint(); toggle(true); s.sfx.snap(); } }, name);
          const presets = s.h("div", { class: "row", style: { gap: "10px" } }, pbtn, mbtn,
            preset("Rock", ROWS.map(r => r.on)),
            preset("Leer", ROWS.map(() => Array(8).fill(0))));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, s.h("b", null, "Ostinato"), " (heißt: hartnäckig) = ein kurzes Muster, das sich immer wiederholt. Darüber kann sich die Melodie verändern.");
          const life = s.h("div", { class: "life later", style: { display: "grid", gridTemplateColumns: "110px 1fr", gap: "14px", alignItems: "center" } },
            s.photo("ravel", { w: 110, h: 140, pos: "50% 25%" }),
            s.h("div", { class: "stack", style: { gap: "6px" } }, s.h("span", { class: "exlabel" }, "Im Alltag"),
              s.h("p", { class: "small" }, "Loops in Videospielen, Gitarren-Riffs im Rock. In Ravels „Boléro“ spielt die kleine Trommel die ganze Zeit denselben Rhythmus."),
              s.h("div", { class: "row" }, s.soundBtn("bolero", "Boléro (1930, Ravel dirigiert)"))));
          s.add(s.h("div", { class: "stack", style: { gap: "14px" } }, presets, s.h("div", { class: "card" }, grid),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" } }, merk, life)));
          s.step(async () => { ROWS[0].on.forEach((v, i) => (state[0][i] = !!v)); paint(); toggle(true); s.say("Erst das Bass-Muster. Es wiederholt sich immer wieder."); });
          s.step(async () => { [1, 2, 3].forEach(ri => ROWS[ri].on.forEach((v, i) => (state[ri][i] = !!v))); paint(); s.sfx.pop(); });
          s.step(async () => { melOn = true; mbtn.classList.add("solid"); melIdx = 0; melT = 0; s.say("Darüber spielt eine Melodie. Das Muster darunter bleibt gleich."); });
          s.step(async () => { s.show(merk, "up"); s.sfx.ding(); await s.wait(300); s.show(life, "up"); });
        },
      },
      /* ---------- 12 ---------- */
      {
        title: "Bordun: der Dauerton",
        say: "Ein Bordun ist ein tiefer Ton, der die ganze Zeit liegen bleibt. Der Dudelsack hat dafür eigene Pfeifen.",
        build(s) {
          const svg = s.svg(420, 470);
          const drones = [[150, 40, 230], [205, 70, 220], [260, 100, 210]].map(([x, top, len], i) => {
            const g = s.el("g");
            g.append(s.el("rect", { x: x - 7, y: top, width: 14, height: len - top + 40, rx: 5, fill: "#2b2b2b" }),
              s.el("rect", { x: x - 11, y: top, width: 22, height: 16, rx: 4, fill: "#e8dcc0" }),
              s.el("rect", { x: x - 10, y: top + 70, width: 20, height: 8, rx: 3, fill: "#e8dcc0" }));
            return g;
          });
          const waves = [150, 205, 260].map((x, i) => { const w = s.el("path", { d: `M${x - 18},${30 + i * 30} Q${x},${8 + i * 30} ${x + 18},${30 + i * 30}`, stroke: "#2f7d32", "stroke-width": 4, fill: "none", opacity: 0 }); return w; });
          const bag = s.el("path", { d: "M90,250 C70,180 200,170 300,215 C360,245 330,340 240,345 C150,350 105,320 90,250 Z", fill: "#b3261e" });
          const tartan = s.el("g", { opacity: 0.35 });
          for (let i = 0; i < 6; i++) tartan.append(s.el("line", { x1: 90 + i * 45, y1: 190, x2: 90 + i * 45, y2: 350, stroke: "#1b5e20", "stroke-width": 8 }), s.el("line", { x1: 80, y1: 205 + i * 26, x2: 340, y2: 205 + i * 26, stroke: "#1b2740", "stroke-width": 5 }));
          const clip = s.el("clipPath", { id: "bagclip" }); clip.append(s.el("path", { d: "M90,250 C70,180 200,170 300,215 C360,245 330,340 240,345 C150,350 105,320 90,250 Z" }));
          tartan.setAttribute("clip-path", "url(#bagclip)");
          const chanter = s.el("g");
          chanter.append(s.el("path", { d: "M150,320 L162,320 L170,440 L142,440 Z", fill: "#2b2b2b" }), s.el("path", { d: "M136,440 L176,440 L172,456 L140,456 Z", fill: "#e8dcc0" }));
          for (let i = 0; i < 7; i++) chanter.append(s.el("circle", { cx: 157 + i * 0.6, cy: 340 + i * 13, r: 3.2, fill: "#d9c9a0" }));
          const blow = s.el("path", { d: "M300,215 L380,150", stroke: "#2b2b2b", "stroke-width": 9, "stroke-linecap": "round" });
          svg.append(clip, ...drones, bag, tartan, chanter, blow, ...waves,
            txt(s, 330, 110, "Bordun-", { "font-size": 19, fill: "#2f7d32" }), txt(s, 330, 132, "pfeifen", { "font-size": 19, fill: "#2f7d32" }),
            txt(s, 230, 420, "Melodie-", { "font-size": 19, fill: "#b3261e" }), txt(s, 230, 442, "pfeife", { "font-size": 19, fill: "#b3261e" }));
          let nodes = null, droneOn = false;
          function droneStart() {
            const a = ac(s); if (!a || nodes) return;
            const t = a.currentTime + 0.02, g = a.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.16, t + 0.4); g.connect(OUT);
            const f = a.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 900; f.Q.value = 2; f.connect(g);
            const os = [45, 57, 57].map((m, i) => { const o = a.createOscillator(); o.type = "sawtooth"; o.frequency.value = mf(m); o.detune.value = i === 2 ? 6 : 0; o.connect(f); o.start(t); return o; });
            nodes = { g, os, a };
          }
          function droneStop() { if (!nodes) return; const { g, os, a } = nodes; const t = a.currentTime; g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(0, t + 0.3); os.forEach(o => o.stop(t + 0.35)); nodes = null; }
          s.onLeave(droneStop);
          s.loop(t => { waves.forEach((w, i) => { w.setAttribute("opacity", droneOn ? 0.4 + 0.4 * Math.sin(t * 6 + i) : 0); }); });
          const dbtn = s.h("button", { class: "btn solid", onclick: () => setDrone(!droneOn) }, "Bordun an");
          function setDrone(v) { droneOn = v; dbtn.textContent = v ? "Bordun aus" : "Bordun an"; if (v) droneStart(); else droneStop(); }
          const MEL = [[69, 1], [71, 0.5], [73, 0.5], [76, 1], [73, 1], [71, 1], [69, 0.5], [71, 0.5], [73, 2], [76, 1], [78, 1], [76, 1], [73, 1], [71, 1], [67, 1], [69, 2]];
          const melody = () => { if (!droneOn) setDrone(true); seq(s, "dudel", MEL, 120); };
          const mbtn = s.h("button", { class: "btn", onclick: melody }, "Melodie dazu");
          const c1 = s.h("div", { class: "card" }, s.h("span", { class: "exlabel" }, "So geht der Dudelsack"),
            s.h("p", { class: "small" }, "Du bläst Luft in den Sack. Der Arm drückt ihn zusammen. Die Bordunpfeifen spielen immer denselben tiefen Ton, auf der Melodiepfeife greifst du die Melodie."));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, s.h("b", null, "Bordun"), " = ein tiefer Dauerton (oft Grundton und Quinte). Darüber spielt die Melodie.");
          const ex = s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, "Noch mehr Bordun"),
            s.h("p", { class: "small" }, "Die Drehleier hat Bordunsaiten. In Indien spielt die Tanpura einen Dauerton. Auf der Orgel gibt es ein Register, das „Bordun“ heißt."));
          const life = lifeBox(s, "Summ einen tiefen Ton und lass deine Freundin darüber pfeifen – schon habt ihr einen Bordun!");
          svg.setAttribute("width", 280); svg.setAttribute("height", 313);
          const real = s.h("div", { class: "stack", style: { gap: "8px", alignItems: "center" } },
            s.photo("dudelsack", { w: 420, h: 220, pos: "50% 45%", caption: "Ein echter Dudelsack" }),
            s.h("div", { class: "row", style: { gap: "10px", flexWrap: "nowrap" } }, s.soundBtn("dudelsack-bordun", "Nur Bordun"), s.soundBtn("dudelsack-melodie", "Mit Melodie")), svg);
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "420px 1fr", gap: "24px", height: "100%" } }, real,
            s.h("div", { class: "stack", style: { gap: "12px" } }, s.h("div", { class: "row" }, dbtn, mbtn), c1, merk, ex, life)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          s.step(async () => { setDrone(true); s.say("Hör den Dauerton."); });
          s.step(async () => { melody(); s.say("Und jetzt die Melodie darüber."); });
          s.step(async () => { s.show(merk, "up"); s.sfx.ding(); s.show(ex, "up", 300); });
          s.step(async () => { setDrone(false); s.show(life, "up"); s.sound("dudelsack-melodie", { dur: 8, vol: .8 }); });
        },
      },
      /* ---------- 13 ---------- */
      {
        title: "Ruf und Antwort",
        say: "Einer ruft, alle antworten. Das heißt Ruf und Antwort, auf Englisch Call and Response.",
        build(s) {
          const svg = s.svg(1100, 230);
          const person = (x, y, c, sc = 1) => { const g = s.el("g"); g.append(s.el("circle", { cx: x, cy: y, r: 22 * sc, fill: c }), s.el("path", { d: `M${x - 30 * sc},${y + 90 * sc} Q${x},${y + 14 * sc} ${x + 30 * sc},${y + 90 * sc} Z`, fill: c })); return g; };
          const lead = person(150, 80, "#dc3b2a", 1.2);
          const group = s.el("g");
          [[760, 90], [840, 70], [920, 90], [1000, 70], [800, 130], [880, 120], [960, 130]].forEach(([x, y], i) => group.append(person(x, y, ["#1d5bd0", "#2f7d32", "#7b4fd6", "#ee7a1a"][i % 4], 0.85)));
          const arrowR = s.el("path", { d: "M260,110 L640,110", stroke: "#dc3b2a", "stroke-width": 6, "stroke-dasharray": "14 10", fill: "none", opacity: 0 });
          const arrowL = s.el("path", { d: "M640,160 L260,160", stroke: "#1d5bd0", "stroke-width": 6, "stroke-dasharray": "14 10", fill: "none", opacity: 0 });
          const lr = txt(s, 450, 96, "Ruf", { fill: "#dc3b2a", "font-size": 24, opacity: 0 }), la = txt(s, 450, 196, "Antwort", { fill: "#1d5bd0", "font-size": 24, opacity: 0 });
          svg.append(lead, group, arrowR, arrowL, lr, la, txt(s, 150, 222, "Vorsänger", { "font-size": 19 }), txt(s, 880, 222, "Gruppe", { "font-size": 19 }));
          const flash = async (ar, lb, who, sec) => {
            ar.setAttribute("opacity", 1); lb.setAttribute("opacity", 1);
            who.style.transformBox = "fill-box"; who.style.transformOrigin = "center bottom";
            await s.tween({ from: 0, to: 1, dur: sec * 1000, ease: "linear", update: p => { ar.setAttribute("stroke-dashoffset", -p * 200); who.style.transform = `scale(${1 + 0.05 * Math.sin(p * Math.PI * 6)})`; } });
            ar.setAttribute("opacity", 0.15); lb.setAttribute("opacity", 0.3); who.style.transform = "";
          };
          const PAIRS = {
            echo: { n: "Echo", t: "Die Gruppe wiederholt den Ruf genau.", call: () => seq(s, "trompete", [[67, 0.5], [67, 0.5], [72, 1], [67, 1], [64, 1]], 140), resp: () => seq(s, "stimme", [[67, 0.5], [67, 0.5], [72, 1], [67, 1], [64, 1]], 140) },
            neu: { n: "Neue Antwort", t: "Der Ruf endet offen, die Antwort schließt ab.", call: () => seq(s, "trompete", [[60, 1], [64, 1], [67, 1], [69, 1], [67, 2]], 140), resp: () => seq(s, "stimme", [[67, 1], [65, 1], [64, 1], [62, 1], [60, 2]], 140) },
            klatsch: { n: "Klatschen", t: "Einer klatscht vor, alle klatschen nach.", call: () => { [0, 0.5, 1, 1.25, 1.5].forEach(b => play(s, "klatsch", 0, 0, b * 60 / 140)); return 2 * 60 / 140 + 0.4; }, resp: () => { [0, 0.5, 1, 1.25, 1.5].forEach(b => { play(s, "klatsch", 0, 0, b * 60 / 140, 1.4); play(s, "klatsch", 0, 0, b * 60 / 140 + 0.02, 1.2); }); return 2 * 60 / 140 + 0.4; } },
          };
          const info = s.h("p", { class: "t" }, "");
          const run = async k => {
            const P = PAIRS[k]; info.replaceChildren(s.h("b", null, P.n + ": "), P.t);
            Object.keys(PAIRS).forEach(x => btn[x].classList.toggle("solid", x === k));
            const c = P.call(); await flash(arrowR, lr, lead, c || 2); if (!s.alive) return;
            const r = P.resp(); await flash(arrowL, la, group, r || 2);
          };
          const btn = {}; Object.keys(PAIRS).forEach(k => { btn[k] = s.h("button", { class: "btn", onclick: () => run(k) }, PAIRS[k].n); });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, s.h("b", null, "Ruf und Antwort:"), " Einer ruft, die Gruppe antwortet – mit einem Echo oder mit einer neuen Antwort.");
          const fact = s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, "Woher kommt das?"), s.h("p", { class: "small" }, "Aus Arbeitsliedern afrikanischer Menschen, die in Amerika versklavt waren. Später wurde es typisch für Gospel, Blues und Jazz."));
          const life = s.h("div", { class: "life later", style: { display: "grid", gridTemplateColumns: "1fr 170px", gap: "12px", alignItems: "center" } },
            s.h("div", null, s.h("span", { class: "exlabel" }, "Im Alltag"), s.h("p", { class: "small" }, "Im Stadion ruft der Stadionsprecher den Vornamen des Torschützen, die Fans brüllen den Nachnamen. In der Kirche singt einer vor, die Gemeinde antwortet.")),
            s.photo("fankurve", { w: 160, h: 150, pos: "50% 50%", caption: "Fankurve" }));
          s.add(s.h("div", { class: "stack", style: { gap: "10px" } }, svg, s.h("div", { class: "row", style: { gap: "10px" } }, Object.values(btn), info),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1.45fr", gap: "14px" } }, merk, fact, life)));
          info.textContent = "Tippe auf einen Knopf.";
          s.step(async () => { await run("echo"); });
          s.step(async () => { await run("neu"); });
          s.step(async () => { await run("klatsch"); });
          s.step(async () => { s.show(merk, "up"); s.show(fact, "up", 200); s.show(life, "up", 400); s.sound("crowd-cheer", { vol: .6, dur: 4 }); });
        },
      },
      /* ---------- 14 ---------- */
      {
        title: "Strophe, Refrain, Bridge",
        say: "Die meisten Popsongs sind so gebaut: Strophe, Refrain, Strophe, Refrain, dann eine Bridge und zum Schluss noch einmal der Refrain.",
        build(s) {
          const SONG = {
            intro: { n: "Intro", beats: 4, c: "#8a94a6", sub: "" },
            strophe: { n: "Strophe", beats: 8, c: "#1d5bd0" },
            refrain: { n: "Refrain", beats: 8, c: "#2f7d32", sub: "gleicher Text" },
            bridge: { n: "Bridge", beats: 8, c: "#ee7a1a", sub: "ganz neu" },
            outro: { n: "Outro", beats: 4, c: "#8a94a6", sub: "" },
          };
          const MEL = {
            strophe: [[60, 1], [60, 0.5], [62, 0.5], [64, 1], [64, 1], [62, 1], [60, 0.5], [62, 0.5], [64, 2]],
            refrain: [[67, 1], [69, 0.5], [67, 0.5], [72, 1.5], [71, 0.5], [69, 1], [67, 1], [69, 1], [72, 1]],
            bridge: [[69, 1.5], [67, 0.5], [65, 1], [64, 1], [62, 1], [64, 1], [65, 1], [67, 1]],
          };
          const ROOT = { intro: [48, 43], strophe: [48, 43, 45, 43], refrain: [41, 43, 48, 48], bridge: [45, 41, 38, 43], outro: [41, 48] };
          const bpm = 132, sb = 60 / bpm;
          const partSnd = k => {
            const r = ROOT[k];
            r.forEach((m, i) => { play(s, "pizz", m, 0.5, i * 2 * sb); play(s, "klavier", m + 24, 1.6 * sb, i * 2 * sb, 0.35); play(s, "klavier", m + 28 - (m === 45 || m === 38 ? 1 : 0), 1.6 * sb, i * 2 * sb, 0.3); });
            if (MEL[k]) seq(s, k === "refrain" ? "trompete" : k === "bridge" ? "streicher" : "floete", MEL[k], bpm, 0, 0.9);
            if (k === "refrain" || k === "bridge") for (let b = 0; b < 8; b++) { play(s, b % 2 ? "snare" : "kick", 0, 0, b * sb, 0.6); play(s, "hat", 0, 0, b * sb + sb / 2, 0.6); }
            return SONG[k].beats * sb;
          };
          const ORDER = ["intro", "strophe", "refrain", "strophe", "refrain", "bridge", "refrain", "outro"];
          let sn = 0;
          const parts = ORDER.map(k => ({ label: k === "strophe" ? "Strophe " + (++sn) : SONG[k].n, beats: SONG[k].beats, color: SONG[k].c, sub: k === "strophe" ? "Text " + sn : SONG[k].sub }));
          const st = strip(s, parts, 1100, 150, { sub: true, fs: 20, later: true });
          const go = () => playParts(s, st, ORDER.length, i => partSnd(ORDER[i]));
          const card = (k, title, text) => s.h("div", { class: "card later", style: { borderColor: SONG[k].c, borderWidth: "3px", padding: "12px 16px" } },
            s.h("div", { class: "row", style: { justifyContent: "space-between" } }, s.h("p", { class: "h2", style: { color: SONG[k].c, fontSize: "26px" } }, title), s.h("button", { class: "btn", style: { borderColor: SONG[k].c, color: SONG[k].c }, onclick: () => partSnd(k) }, "Hören")),
            s.h("p", { class: "small", style: { marginTop: "6px" } }, text));
          const cS = card("strophe", "Strophe", "Gleiche Melodie, aber jedes Mal ein neuer Text. Sie erzählt die Geschichte.");
          const cR = card("refrain", "Refrain", "Gleiche Melodie und gleicher Text. Den kann jeder mitsingen – er bleibt im Ohr.");
          const cB = card("bridge", "Bridge", "Ganz neue Musik, meist nur einmal – kurz vor dem letzten Refrain. Kontrast!");
          const life = lifeBox(s, "Fast jeder Song im Radio ist so gebaut. Auch alte Volkslieder haben Strophen: „Alle Vögel sind schon da“ hat drei Strophen.");
          s.add(s.h("div", { class: "stack", style: { gap: "12px" } }, st.svg,
            s.h("div", { class: "row" }, s.h("button", { class: "btn solid", onclick: go }, "Ganzen Song abspielen"), s.h("p", { class: "small pencil" }, "Ein selbst ausgedachter Mini-Song – ohne Gesang")),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" } }, cS, cR, cB), life));
          const showK = k => s.show(st.blocks.filter((_, i) => ORDER[i] === k).map(b => b.g), "pop");
          s.step(async () => { showK("intro"); showK("outro"); showK("strophe"); s.show(cS, "up"); partSnd("strophe"); });
          s.step(async () => { showK("refrain"); s.show(cR, "up"); partSnd("refrain"); });
          s.step(async () => { showK("bridge"); s.show(cB, "up"); partSnd("bridge"); });
          s.step(async () => { s.show(life, "up"); await go(); });
        },
      },
      /* ---------- 15 ---------- */
      {
        title: "Im Alltag: Formen überall",
        say: "Musikalische Formen hörst du jeden Tag: im Radio, im Stadion, beim Zocken und in der Schule.",
        build(s) {
          const PICS = { radio: ["radio", "50% 50%", "contain"], stadion: ["fankurve", "50% 50%"], spiel: ["gameboy", "50% 50%", "contain"], gong: ["big-ben", "50% 40%"] };
          const scene = k => s.photo(PICS[k][0], { w: 170, h: 200, pos: PICS[k][1], fit: PICS[k][2] || "cover" });
          const T = [
            { k: "radio", h: "Radio", f: "Strophe – Refrain", t: "Fast jeder Song wechselt zwischen Strophe und Refrain. Der Refrain bleibt im Ohr.",
              snd: () => { seq(s, "floete", [[60, 1], [60, 0.5], [62, 0.5], [64, 1], [64, 1], [62, 1], [60, 0.5], [62, 0.5], [64, 2]], 132); seq(s, "trompete", [[67, 1], [69, 0.5], [67, 0.5], [72, 1.5], [71, 0.5], [69, 1], [67, 1], [69, 1], [72, 1]], 132, 8 * 60 / 132); } },
            { k: "stadion", h: "Fußballstadion", f: "Ruf und Antwort", t: "Der Stadionsprecher ruft, Tausende Fans antworten. Fangesänge wechseln oft zwischen Vorsänger und Kurve.",
              snd: tap => { seq(s, "trompete", [[67, 0.5], [67, 0.5], [72, 1]], 140); s.sound("crowd-cheer", { when: 1.0, dur: 4, vol: .8, force: tap }); } },
            { k: "spiel", h: "Videospiel", f: "Ostinato (Loop)", t: "Die Hintergrundmusik ist eine kurze Schleife, die sich immer wiederholt – stundenlang.",
              snd: () => { for (let r = 0; r < 2; r++) seq(s, "chip", [[72, 0.5], [76, 0.5], [79, 0.5], [76, 0.5], [74, 0.5], [77, 0.5], [81, 0.5], [77, 0.5]], 180, r * 4 * 60 / 180); seq(s, "bass", [[48, 1], [48, 1], [50, 1], [50, 1], [48, 1], [48, 1], [50, 1], [50, 1]], 180, 0, 0.7); } },
            { k: "gong", h: "Schulgong", f: "Motiv", t: "Viele Gongs spielen ein kurzes Motiv aus vier Tönen – wie der Big Ben in London. Hier: die echten Glocken.",
              snd: tap => s.sound("westminster-gong", { dur: 9, force: tap }) },
          ];
          const tiles = T.map(d => {
            const v = scene(d.k);
            const tile = s.h("div", { class: "card later", style: { display: "grid", gridTemplateColumns: "170px 1fr", gap: "16px", alignItems: "center", padding: "14px 18px" } }, v,
              s.h("div", { class: "stack", style: { gap: "6px" } },
                s.h("div", { class: "row", style: { gap: "10px" } }, s.h("p", { class: "h2", style: { fontSize: "24px" } }, d.h), s.h("span", { class: "chip" }, d.f)),
                s.h("p", { class: "small" }, d.t),
                s.h("button", { class: "btn", style: { alignSelf: "flex-start" }, onclick: () => { d.snd(true); } }, "Anhören")));
            d.tile = tile; return tile;
          });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Hör beim nächsten Song genau hin: Wo ist die Strophe, wo der Refrain? Gibt es eine Bridge?");
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%" } },
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" } }, tiles), merk));
          T.forEach((d, i) => { if (i === 0) { s.show(d.tile, "up"); d.snd(); } else s.step(async () => { s.show(d.tile, "up"); d.snd(); s.say(d.h + ": " + d.f); }); });
          s.step(async () => { s.show(merk, "up"); s.sfx.ding(); });
        },
      },
    ],
  });
})();
