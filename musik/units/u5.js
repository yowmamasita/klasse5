/* Kapitel 5 – Instrumente des Orchesters.
   All instrument sounds are synthesised approximations (WebAudio), no recordings. */
(() => {
  "use strict";

  /* ---------------- synth voices ---------------- */
  const mf = m => 440 * Math.pow(2, (m - 69) / 12);
  let OUT = null, NB = null;
  function ac(s) {
    if (s.fast || !s.alive || !s.sfx.on) return null;
    const a = s.sfx.unlock(); if (!a) return null;
    if (!OUT || OUT.context !== a) {
      const c = a.createDynamicsCompressor();
      OUT = a.createGain(); OUT.gain.value = 0.7; OUT.connect(c); c.connect(a.destination);
    }
    return a;
  }
  function noiseBuf(a) {
    if (NB && NB.sampleRate === a.sampleRate) return NB;
    NB = a.createBuffer(1, a.sampleRate * 3, a.sampleRate);
    const d = NB.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return NB;
  }
  function nz(a, t, dur, type, freq, q, peak, attack = 0.003) {
    const src = a.createBufferSource(); src.buffer = noiseBuf(a);
    const f = a.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = a.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + attack); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(OUT); src.start(t); src.stop(t + dur + 0.05);
  }
  function ping(a, t, freq, dur, type, peak, slideTo) {
    const o = a.createOscillator(), g = a.createGain(); o.type = type;
    o.frequency.setValueAtTime(freq, t); if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur * 0.6);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(OUT); o.start(t); o.stop(t + dur + 0.05);
  }
  const VOICES = {
    geige: { w: "sawtooth", det: 7, ft: "lowpass", fc: f => Math.min(7000, f * 7), q: 1.2, a: 0.09, r: 0.22, vib: [5.6, 0.007], vol: 0.15 },
    bratsche: { w: "sawtooth", det: 6, ft: "lowpass", fc: f => Math.min(5000, f * 6), q: 1.2, a: 0.1, r: 0.22, vib: [5.2, 0.007], vol: 0.17 },
    cello: { w: "sawtooth", det: 5, ft: "lowpass", fc: f => Math.min(4000, f * 7), q: 1.1, a: 0.11, r: 0.25, vib: [5, 0.006], vol: 0.2 },
    kontrabass: { w: "sawtooth", det: 4, ft: "lowpass", fc: f => Math.max(500, f * 8), q: 1, a: 0.12, r: 0.25, vib: [4.5, 0.005], vol: 0.28 },
    floete: { w: "sine", h2: 0.18, a: 0.07, r: 0.15, vib: [5, 0.006], breath: 0.05, vol: 0.22 },
    oboe: { w: "sawtooth", ft: "bandpass", fc: () => 1300, q: 1.3, a: 0.04, r: 0.1, vib: [5.5, 0.004], vol: 0.38 },
    klarinette: { w: "square", ft: "lowpass", fc: f => f * 4.5, q: 0.8, a: 0.05, r: 0.12, vol: 0.15 },
    fagott: { w: "sawtooth", ft: "bandpass", fc: () => 480, q: 1.1, a: 0.05, r: 0.12, vol: 0.42 },
    saxophon: { w: "sawtooth", ft: "lowpass", fc: f => Math.min(4000, f * 8), q: 4, a: 0.04, r: 0.12, vib: [5, 0.009], breath: 0.03, vol: 0.14 },
    trompete: { w: "sawtooth", ft: "lowpass", fenv: [1.5, 9, 0.08], q: 1, a: 0.03, r: 0.1, vib: [5.5, 0.003], vol: 0.16 },
    horn: { w: "sawtooth", ft: "lowpass", fc: f => f * 2.6, q: 0.7, a: 0.09, r: 0.2, vol: 0.3 },
    posaune: { w: "sawtooth", ft: "lowpass", fenv: [1.5, 6, 0.1], q: 1, a: 0.05, r: 0.15, vol: 0.22 },
    euphonium: { w: "sawtooth", ft: "lowpass", fc: f => f * 3, q: 0.7, a: 0.07, r: 0.18, vol: 0.3 },
    tuba: { w: "sawtooth", ft: "lowpass", fc: f => Math.max(260, f * 3), q: 0.8, a: 0.08, r: 0.18, vol: 0.42 },
    lippen: { w: "sawtooth", ft: "highpass", fc: () => 200, q: 0.5, a: 0.02, r: 0.05, vib: [9, 0.02], vol: 0.12 },
  };
  const PERC = {
    pizz(a, m, dur, t) {
      const f = mf(m), fl = a.createBiquadFilter(), g = a.createGain();
      fl.type = "lowpass"; fl.frequency.setValueAtTime(f * 10, t); fl.frequency.exponentialRampToValueAtTime(f * 1.5, t + 0.3);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.4, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
      ["triangle", "sawtooth"].forEach((w, i) => { const o = a.createOscillator(); o.type = w; o.frequency.value = f; const og = a.createGain(); og.gain.value = i ? 0.35 : 1; o.connect(og); og.connect(fl); o.start(t); o.stop(t + 0.75); });
      fl.connect(g); g.connect(OUT);
    },
    pauke(a, m, dur, t) {
      const f = mf(m);
      ping(a, t, f * 1.03, 1.8, "sine", 0.55, f);
      ping(a, t, f * 1.5, 1.0, "sine", 0.18);
      ping(a, t, f * 2, 0.7, "sine", 0.1);
      nz(a, t, 0.12, "lowpass", 400, 0.7, 0.25);
    },
    trommel(a, m, dur, t) { nz(a, t, 0.22, "bandpass", 3200, 0.6, 0.55); ping(a, t, 190, 0.12, "triangle", 0.3, 160); },
    grosse(a, m, dur, t) { ping(a, t, 95, 0.7, "sine", 0.8, 48); nz(a, t, 0.15, "lowpass", 300, 0.7, 0.3); },
    becken(a, m, dur, t) { nz(a, t, 2.2, "highpass", 5000, 0.4, 0.32, 0.006); nz(a, t, 0.8, "bandpass", 3000, 0.8, 0.15); },
    triangel(a, m, dur, t) { [[1, 0.16], [2.76, 0.07], [5.4, 0.05], [8.9, 0.03]].forEach(([k, v]) => ping(a, t, 1650 * k, 2.4, "sine", v)); },
    xylofon(a, m, dur, t) { const f = mf(m); ping(a, t, f, 0.4, "sine", 0.4); ping(a, t, f * 3, 0.12, "sine", 0.12); nz(a, t, 0.03, "bandpass", f * 4, 2, 0.12); },
  };
  /** play one note of instrument `name` (MIDI note m) */
  function play(s, name, m, dur = 0.5, when = 0, opts = {}) {
    const a = ac(s); if (!a) return;
    const t = a.currentTime + 0.03 + when;
    if (PERC[name]) return PERC[name](a, m, dur, t);
    const v = VOICES[name]; if (!v) return;
    const f = mf(m), hold = Math.max(v.a, dur), end = t + hold + v.r + 0.06;
    const g = a.createGain(), peak = (v.vol || 0.2) * (opts.vol || 1);
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
    const mk = (type, mult, det, lvl) => {
      const o = a.createOscillator(); o.type = type; o.frequency.setValueAtTime(f * mult, t); o.detune.value = det;
      if (opts.glideTo != null) o.frequency.linearRampToValueAtTime(mf(opts.glideTo) * mult, t + hold);
      const og = a.createGain(); og.gain.value = lvl; o.connect(og); og.connect(dest); o.start(t); o.stop(end); oscs.push(o);
    };
    mk(v.w, 1, 0, 1);
    if (v.det) mk(v.w, 1, v.det, 0.7);
    if (v.h2) mk("sine", 2, 0, v.h2);
    if (v.vib) {
      const l = a.createOscillator(), lg = a.createGain(); l.frequency.value = v.vib[0];
      lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(f * v.vib[1], t + 0.35);
      l.connect(lg); oscs.forEach(o => lg.connect(o.frequency)); l.start(t); l.stop(end);
    }
    if (v.breath) {
      const src = a.createBufferSource(); src.buffer = noiseBuf(a);
      const bf = a.createBiquadFilter(); bf.type = "bandpass"; bf.frequency.value = Math.min(8000, f * 2); bf.Q.value = 1.5;
      const bg = a.createGain(); bg.gain.value = v.breath / (v.vol || 0.2);
      src.connect(bf); bf.connect(bg); bg.connect(g); src.start(t); src.stop(end);
    }
  }
  /** play a list of [midi|null, beats] at bpm; returns duration in seconds */
  function seq(s, name, notes, bpm = 120, when = 0, opts = {}) {
    const b = 60 / bpm; let t = when;
    for (const [m, beats] of notes) { if (m != null) play(s, name, m, beats * b * 0.9, t, opts); t += beats * b; }
    return t - when;
  }

  /* ---------------- ranges (MIDI, sounding, approximate) ---------------- */
  const FAM = { str: "#b5651d", holz: "#2f7d32", blech: "#c8961e", schlag: "#7b4fd6" };
  const INST = {
    geige: { n: "Geige", lo: 55, hi: 100, fam: "str" },
    bratsche: { n: "Bratsche", lo: 48, hi: 88, fam: "str" },
    cello: { n: "Cello", lo: 36, hi: 79, fam: "str" },
    kontrabass: { n: "Kontrabass", lo: 28, hi: 74, fam: "str" },
    floete: { n: "Querflöte", lo: 60, hi: 96, fam: "holz" },
    oboe: { n: "Oboe", lo: 58, hi: 91, fam: "holz" },
    klarinette: { n: "Klarinette", lo: 50, hi: 94, fam: "holz" },
    fagott: { n: "Fagott", lo: 34, hi: 76, fam: "holz" },
    altsax: { n: "Altsaxophon", lo: 49, hi: 80, fam: "holz", v: "saxophon" },
    tenorsax: { n: "Tenorsaxophon", lo: 44, hi: 75, fam: "holz", v: "saxophon" },
    trompete: { n: "Trompete", lo: 52, hi: 82, fam: "blech" },
    horn: { n: "Horn", lo: 35, hi: 77, fam: "blech" },
    posaune: { n: "Posaune", lo: 40, hi: 77, fam: "blech" },
    euphonium: { n: "Euphonium", lo: 34, hi: 74, fam: "blech" },
    tuba: { n: "Tuba", lo: 26, hi: 65, fam: "blech" },
    pauke: { n: "Pauken", lo: 38, hi: 57, fam: "schlag" },
    xylofon: { n: "Xylofon", lo: 65, hi: 108, fam: "schlag" },
  };
  const voiceOf = k => (INST[k] && INST[k].v) || k;
  /** short demo: lowest note, then a little tune in the lower-middle register */
  function demo(s, k) {
    const I = INST[k], v = voiceOf(k);
    if (v === "pauke") { [0, 7, 0, 7, 12].forEach((n, i) => play(s, "pauke", I.lo + n, 0.3, i * 0.32)); return; }
    if (v === "xylofon") { [0, 4, 7, 12, 7, 4, 0].forEach((n, i) => play(s, "xylofon", 72 + n, 0.2, i * 0.13)); return; }
    play(s, v, I.lo, 0.55);
    let b = I.lo + Math.round((I.hi - I.lo) * 0.25); b -= ((b % 12) + 12) % 12; if (b < I.lo) b += 12;
    seq(s, v, [[b, 1], [b + 2, 1], [b + 4, 1], [b + 7, 2], [b + 4, 1], [b + 7, 1], [b + 12, 3]], 210, 0.75);
  }

  /* ---------------- piano keyboard with a range bar ---------------- */
  function keyboard(s, w, opts = {}) {
    const LO = 24, HI = 108, H = 98, KT = 40;
    const black = m => [1, 3, 6, 8, 10].includes(m % 12);
    const whites = []; for (let m = LO; m <= HI; m++) if (!black(m)) whites.push(m);
    const kw = w / whites.length;
    const svg = s.svg(w, H);
    const xOf = m => { const i = whites.indexOf(m); if (i >= 0) return { x: i * kw, w: kw }; const j = whites.indexOf(m - 1); return { x: (j + 1) * kw - kw * 0.3, w: kw * 0.6 }; };
    const hiKeys = s.el("rect", { x: 0, y: KT, width: 0, height: 58, fill: "#dc2626", opacity: 0.28 });
    whites.forEach((m, i) => svg.append(s.el("rect", { x: i * kw, y: KT, width: kw, height: 58, fill: "#fff", stroke: "#9aa5b5", "stroke-width": 1 })));
    svg.append(hiKeys);
    for (let m = LO; m <= HI; m++) if (black(m)) { const k = xOf(m); svg.append(s.el("rect", { x: k.x, y: KT, width: k.w, height: 35, fill: "#1b2740", rx: 1.5 })); }
    const c4 = xOf(60); svg.append(s.el("circle", { cx: c4.x + kw / 2, cy: KT + 50, r: Math.min(4, kw / 3), fill: "#dc2626" }));
    const bar = s.el("rect", { x: 0, y: 4, width: 0, height: 30, rx: 9, fill: "#dc2626" });
    const lbl = s.el("text", { x: 0, y: 26, "text-anchor": "middle", "font-size": 19, "font-weight": 700, fill: "#fff", text: "" });
    const lo = s.el("text", { x: 4, y: 26, "font-size": 19, fill: "#5d6678", text: "tief" });
    const hi = s.el("text", { x: w - 4, y: 26, "text-anchor": "end", "font-size": 19, fill: "#5d6678", text: "hoch" });
    svg.append(lo, hi, bar, lbl);
    let cur = { a: 0, b: 0 };
    function set(k, color) {
      const I = INST[k]; if (!I) return;
      const col = color || FAM[I.fam];
      const A = xOf(I.lo).x, B = xOf(I.hi).x + xOf(I.hi).w;
      bar.setAttribute("fill", col); hiKeys.setAttribute("fill", col);
      lbl.textContent = I.n;
      const from = { ...cur };
      lo.style.visibility = hi.style.visibility = "hidden";
      s.tween({ from: 0, to: 1, dur: 500, ease: "out", update: p => {
        const a = from.a + (A - from.a) * p, b = from.b + (B - from.b) * p;
        bar.setAttribute("x", a); bar.setAttribute("width", Math.max(0, b - a));
        hiKeys.setAttribute("x", a); hiKeys.setAttribute("width", Math.max(0, b - a));
        lbl.setAttribute("x", (a + b) / 2);
      } });
      cur = { a: A, b: B };
    }
    return { svg, set, xOf, kw };
  }

  /* ---------------- instrument drawings (unit coordinates) ---------------- */
  const NSS = { "vector-effect": "non-scaling-stroke" };
  const BODY = "M0,35 C10,35 18,37 18,46 C18,52 12,55 12,60 C12,65 20,68 20,80 C20,95 10,100 0,100 C-10,100 -20,95 -20,80 C-20,68 -12,65 -12,60 C-12,55 -18,52 -18,46 C-18,37 -10,35 0,35 Z";
  function gStr(s, endpin, wood = "#b5651d") { // height 0..100 (+12 endpin), x -20..20
    const g = s.el("g");
    if (endpin) g.append(s.el("line", { x1: 0, y1: 96, x2: 0, y2: 112, stroke: "#555", "stroke-width": 2, ...NSS }));
    g.append(
      s.el("path", { d: BODY, fill: wood, stroke: "#6b3a10", "stroke-width": 1.5, ...NSS }),
      s.el("path", { d: "M0,39 C8,39 14,41 14,47 C14,52 8,56 8,60 C8,66 15,69 15,80 C15,92 8,95 0,95 Z", fill: "#fff", opacity: 0.13 }),
      s.el("rect", { x: -2.6, y: 6, width: 5.2, height: 32, fill: "#7a4a1e" }),
      s.el("path", { d: "M-3,12 L3,12 L3.8,68 L-3.8,68 Z", fill: "#222" }),
      s.el("circle", { cx: 0, cy: 5, r: 4.2, fill: "#7a4a1e", stroke: "#4a2a0e", "stroke-width": 1, ...NSS }),
      s.el("path", { d: "M-9,58 C-11,64 -6,70 -8.5,77", stroke: "#3a1f08", fill: "none", "stroke-width": 1.6, ...NSS }),
      s.el("path", { d: "M9,58 C11,64 6,70 8.5,77", stroke: "#3a1f08", fill: "none", "stroke-width": 1.6, ...NSS }),
      s.el("path", { d: "M-7,74 L7,74 L6,70.5 L-6,70.5 Z", fill: "#e8c99a" }),
      s.el("path", { d: "M-4,82 L4,82 L2.5,96 L-2.5,96 Z", fill: "#222" }));
    [-1.8, -0.6, 0.6, 1.8].forEach(x => g.append(s.el("line", { x1: x, y1: 8, x2: x * 1.6, y2: 84, stroke: "#f2f2f2", "stroke-width": 0.8, ...NSS })));
    return g;
  }
  function gBow(s) { // bow, horizontal 0..120
    const g = s.el("g");
    g.append(s.el("line", { x1: 0, y1: 0, x2: 120, y2: 0, stroke: "#5a2e0e", "stroke-width": 3, ...NSS }),
      s.el("line", { x1: 4, y1: 5, x2: 116, y2: 5, stroke: "#f3ead6", "stroke-width": 2, ...NSS }),
      s.el("rect", { x: 104, y: -2, width: 12, height: 9, fill: "#222" }));
    return g;
  }
  function gFloete(s) { // horizontal 0..200, y -5..5
    const g = s.el("g");
    g.append(s.el("rect", { x: 0, y: -4, width: 200, height: 8, rx: 3, fill: "#c9d1d9", stroke: "#7d8a97", "stroke-width": 1.2, ...NSS }),
      s.el("ellipse", { cx: 22, cy: -3, rx: 6, ry: 3, fill: "#9aa6b2" }),
      s.el("ellipse", { cx: 22, cy: -3, rx: 2.5, ry: 1.3, fill: "#333" }),
      s.el("rect", { x: 0, y: -5, width: 5, height: 10, rx: 2, fill: "#aab4bf" }));
    for (let i = 0; i < 9; i++) g.append(s.el("circle", { cx: 72 + i * 13, cy: -3, r: 3.6, fill: "#eef1f4", stroke: "#7d8a97", "stroke-width": 1, ...NSS }));
    return g;
  }
  function gOboe(s) { // vertical 0..100, x -7..7
    const g = s.el("g");
    g.append(s.el("path", { d: "M-1.4,0 L1.4,0 L1,9 L-1,9 Z", fill: "#d9b26a" }),
      s.el("path", { d: "M-2.4,9 L2.4,9 L3.4,88 L7.5,100 L-7.5,100 L-3.4,88 Z", fill: "#1f1f1f" }),
      s.el("line", { x1: 2.6, y1: 14, x2: 3.4, y2: 86, stroke: "#c9d1d9", "stroke-width": 1.4, ...NSS }));
    for (let i = 0; i < 8; i++) g.append(s.el("circle", { cx: i % 2 ? 1.2 : -1, cy: 18 + i * 9, r: 1.6, fill: "#c9d1d9" }));
    return g;
  }
  function gKlarinette(s) { // vertical 0..100, x -10..10
    const g = s.el("g");
    g.append(s.el("path", { d: "M-1.8,0 L1.8,0 L3,10 L-3,10 Z", fill: "#111" }),
      s.el("rect", { x: -3.2, y: 6, width: 6.4, height: 3, fill: "#c9d1d9" }),
      s.el("rect", { x: -3.8, y: 10, width: 7.6, height: 7, fill: "#222" }),
      s.el("rect", { x: -3, y: 17, width: 6, height: 66, fill: "#1b1b1b" }),
      s.el("path", { d: "M-3.2,82 L3.2,82 L10,100 L-10,100 Z", fill: "#222" }),
      s.el("rect", { x: -4, y: 48, width: 8, height: 2.4, fill: "#c9d1d9" }));
    for (let i = 0; i < 7; i++) g.append(s.el("circle", { cx: 0, cy: 22 + i * 8.5, r: 1.7, fill: "#c9d1d9" }));
    return g;
  }
  function gFagott(s) { // vertical 0..100, x -14..12
    const g = s.el("g");
    g.append(s.el("path", { d: "M-6,44 C-12,40 -14,34 -18,30", stroke: "#c0c0c0", fill: "none", "stroke-width": 2.2, ...NSS }),
      s.el("rect", { x: -19.5, y: 27, width: 3, height: 4, fill: "#d9b26a", transform: "rotate(-40 -18 29)" }),
      s.el("rect", { x: -1, y: 0, width: 10, height: 100, rx: 3, fill: "#8a4a20" }),
      s.el("rect", { x: -7, y: 22, width: 8, height: 78, rx: 3, fill: "#6e3916" }),
      s.el("rect", { x: -1, y: 0, width: 10, height: 6, fill: "#e8d3b5" }),
      s.el("rect", { x: -7, y: 92, width: 16, height: 8, rx: 3, fill: "#c0c0c0" }));
    for (let i = 0; i < 6; i++) g.append(s.el("circle", { cx: -3, cy: 40 + i * 8, r: 1.4, fill: "#e0e0e0" }));
    return g;
  }
  function gSax(s) { // ~ x -30..12, y -2..100
    const g = s.el("g");
    g.append(s.el("path", { d: "M-16,4 C-6,-2 3,1 6,12", stroke: "#d4a531", fill: "none", "stroke-width": 4.5, "stroke-linecap": "round" }),
      s.el("path", { d: "M-22,6 L-15,2 L-13,6 L-20,9 Z", fill: "#111" }),
      s.el("path", { d: "M6,12 L6,72 C6,94 -20,96 -20,76", stroke: "#d4a531", fill: "none", "stroke-width": 10, "stroke-linecap": "round" }),
      s.el("path", { d: "M-25,78 L-15,78 L-11,52 Q-20,47 -30,52 Z", fill: "#d4a531", stroke: "#a87f1a", "stroke-width": 1, ...NSS }),
      s.el("ellipse", { cx: -20.5, cy: 51.5, rx: 9.5, ry: 2.6, fill: "#7a5a10" }));
    for (let i = 0; i < 7; i++) g.append(s.el("circle", { cx: 6 + (i % 2 ? 2 : -2), cy: 20 + i * 7.5, r: 2.2, fill: "#fff6d6", stroke: "#a87f1a", "stroke-width": 0.8, ...NSS }));
    return g;
  }
  const GOLD = "#d4a531", GOLDD = "#a87f1a";
  function tube(s, d, w = 3) { return s.el("path", { d, stroke: GOLD, fill: "none", "stroke-width": w, "stroke-linecap": "round", "stroke-linejoin": "round" }); }
  function gTrompete(s) { // x 0..120, y 6..42
    const g = s.el("g");
    g.append(tube(s, "M4,18 L62,18 C72,18 72,32 62,32 L30,32 C21,32 21,24 30,24 L88,24"),
      s.el("path", { d: "M86,21.5 L100,20.5 Q112,18 120,8 L120,40 Q112,30 100,27.5 L86,26.5 Z", fill: GOLD, stroke: GOLDD, "stroke-width": 1, ...NSS }),
      s.el("rect", { x: 0, y: 15.5, width: 6, height: 5, rx: 1.5, fill: "#c9d1d9" }));
    [40, 48, 56].forEach(x => g.append(s.el("rect", { x: x - 3, y: 14, width: 6, height: 22, rx: 1.5, fill: GOLD, stroke: GOLDD, "stroke-width": 1, ...NSS }), s.el("circle", { cx: x, cy: 10, r: 3.2, fill: "#f4ead0", stroke: GOLDD, "stroke-width": 1, ...NSS })));
    return g;
  }
  function gHorn(s) { // x 0..78, y 0..66
    const g = s.el("g");
    g.append(s.el("circle", { cx: 32, cy: 32, r: 24, stroke: GOLD, fill: "none", "stroke-width": 4 }),
      s.el("circle", { cx: 32, cy: 32, r: 17, stroke: GOLD, fill: "none", "stroke-width": 3 }),
      tube(s, "M2,26 L18,30"),
      s.el("path", { d: "M44,46 L52,50 Q64,54 74,66 L50,66 Q50,58 42,52 Z", fill: GOLD, stroke: GOLDD, "stroke-width": 1, ...NSS }),
      s.el("ellipse", { cx: 62, cy: 66, rx: 12.5, ry: 3, fill: "#7a5a10" }));
    [24, 32, 40].forEach(x => g.append(s.el("circle", { cx: x, cy: 14, r: 3.3, fill: "#e9e2c8", stroke: GOLDD, "stroke-width": 1, ...NSS })));
    return g;
  }
  /** trombone; returns {g, setSlide(units)} ; x -? .. 160, y 0..32; slide moves left */
  function gPosaune(s) {
    const g = s.el("g"), slide = s.el("g");
    g.append(tube(s, "M104,22 L150,22 C158,22 158,8 150,8 L42,8", 3),
      s.el("path", { d: "M44,5 L30,4 Q18,2 10,-6 L10,22 Q18,14 30,12 L44,11 Z", fill: GOLD, stroke: GOLDD, "stroke-width": 1, ...NSS }),
      s.el("rect", { x: 104, y: 19, width: 8, height: 6, rx: 1.5, fill: "#c9d1d9" }),
      tube(s, "M104,22 L46,22 M104,30 L46,30", 2.4));
    slide.append(tube(s, "M78,22 L22,22 C14,22 14,30 22,30 L78,30", 3.6),
      s.el("line", { x1: 60, y1: 21, x2: 60, y2: 31, stroke: GOLDD, "stroke-width": 2.4 }));
    g.append(slide);
    return { g, setSlide: u => slide.setAttribute("transform", `translate(${-u},0)`) };
  }
  function gTuba(s, small) { // x -30..30, y 0..100
    const g = s.el("g");
    const bw = small ? 18 : 26;
    g.append(s.el("rect", { x: -16, y: 36, width: 32, height: 62, rx: 16, stroke: GOLD, fill: "none", "stroke-width": small ? 6 : 8 }),
      s.el("path", { d: `M-9,40 L-9,14 Q-10,4 -${bw},0 L${bw},0 Q10,4 9,14 L9,40 Z`, fill: GOLD, stroke: GOLDD, "stroke-width": 1, ...NSS }),
      s.el("ellipse", { cx: 0, cy: 0, rx: bw, ry: 3.5, fill: "#7a5a10" }),
      tube(s, "M-30,58 L-16,58", 2.4));
    for (let i = 0; i < 4; i++) g.append(s.el("rect", { x: -13 + i * 7, y: 52, width: 5.5, height: 22, rx: 1.5, fill: "#e9d48e", stroke: GOLDD, "stroke-width": 1, ...NSS }));
    return g;
  }
  function gPauke(s) { // x -40..40, y -8..62
    const g = s.el("g");
    g.append(s.el("line", { x1: -26, y1: 40, x2: -32, y2: 62, stroke: "#555", "stroke-width": 2.5, ...NSS }),
      s.el("line", { x1: 26, y1: 40, x2: 32, y2: 62, stroke: "#555", "stroke-width": 2.5, ...NSS }),
      s.el("path", { d: "M-40,0 Q-38,46 0,50 Q38,46 40,0 Z", fill: "#c46a32", stroke: "#8a4520", "stroke-width": 1.2, ...NSS }),
      s.el("path", { d: "M-30,8 Q-26,34 -8,42", stroke: "#e9a070", fill: "none", "stroke-width": 2, ...NSS }),
      s.el("ellipse", { cx: 0, cy: 0, rx: 40, ry: 8, fill: "#f3ead6", stroke: "#8a7a5a", "stroke-width": 1.2, ...NSS }),
      s.el("rect", { x: -8, y: 54, width: 16, height: 6, rx: 2, fill: "#555" }));
    return g;
  }
  function gTrommel(s) { // x -24..24, y -26..30
    const g = s.el("g");
    g.append(s.el("rect", { x: -24, y: 0, width: 48, height: 22, fill: "#d23b2a" }),
      s.el("ellipse", { cx: 0, cy: 22, rx: 24, ry: 6, fill: "#a32a1d" }),
      s.el("ellipse", { cx: 0, cy: 0, rx: 24, ry: 6, fill: "#f3ead6", stroke: "#999", "stroke-width": 1, ...NSS }),
      s.el("line", { x1: -10, y1: -24, x2: 8, y2: -4, stroke: "#8a5a2a", "stroke-width": 2.5, ...NSS }),
      s.el("line", { x1: 12, y1: -26, x2: -4, y2: -6, stroke: "#8a5a2a", "stroke-width": 2.5, ...NSS }));
    for (let i = 0; i < 5; i++) g.append(s.el("line", { x1: -20 + i * 10, y1: 3, x2: -20 + i * 10, y2: 21, stroke: "#eee", "stroke-width": 1, ...NSS }));
    return g;
  }
  function gGrosse(s) { // x -34..34, y -34..44
    const g = s.el("g");
    g.append(s.el("line", { x1: -26, y1: 20, x2: -34, y2: 44, stroke: "#555", "stroke-width": 2.5, ...NSS }),
      s.el("line", { x1: 26, y1: 20, x2: 34, y2: 44, stroke: "#555", "stroke-width": 2.5, ...NSS }),
      s.el("circle", { cx: 0, cy: 0, r: 34, fill: "#2a4a8a" }),
      s.el("circle", { cx: 0, cy: 0, r: 29, fill: "#f3ead6" }),
      s.el("circle", { cx: 0, cy: 0, r: 29, fill: "none", stroke: "#c9b98a", "stroke-width": 1, ...NSS }));
    return g;
  }
  function gBecken(s) { // x -34..34, y -14..14
    const g = s.el("g");
    g.append(s.el("ellipse", { cx: 0, cy: -6, rx: 34, ry: 7, fill: "#e0b43a", stroke: "#a87f1a", "stroke-width": 1, ...NSS }),
      s.el("ellipse", { cx: 0, cy: -9, rx: 7, ry: 3, fill: "#c79a22" }),
      s.el("ellipse", { cx: 0, cy: 8, rx: 34, ry: 7, fill: "#e8c050", stroke: "#a87f1a", "stroke-width": 1, ...NSS }),
      s.el("ellipse", { cx: 0, cy: 11, rx: 7, ry: 3, fill: "#c79a22" }));
    return g;
  }
  function gTriangel(s) { // x -24..30, y -36..20
    const g = s.el("g");
    g.append(s.el("line", { x1: 0, y1: -36, x2: 0, y2: -20, stroke: "#777", "stroke-width": 1.2, ...NSS }),
      s.el("path", { d: "M-16,18 L0,-20 L20,18 L-8,18", stroke: "#9aa6b2", fill: "none", "stroke-width": 3.5, "stroke-linejoin": "round", ...NSS }),
      s.el("line", { x1: 12, y1: -8, x2: 30, y2: -26, stroke: "#9aa6b2", "stroke-width": 2, ...NSS }));
    return g;
  }
  /** xylophone with 8 bars; returns {g, bars:[{el, m}]}; x 0..120, y 0..60 */
  function gXylofon(s) {
    const g = s.el("g"), bars = [];
    const ms = [72, 74, 76, 77, 79, 81, 83, 84];
    g.append(s.el("line", { x1: 0, y1: 14, x2: 120, y2: 22, stroke: "#555", "stroke-width": 2, ...NSS }), s.el("line", { x1: 0, y1: 54, x2: 120, y2: 44, stroke: "#555", "stroke-width": 2, ...NSS }));
    ms.forEach((m, i) => {
      const x = 2 + i * 15, y0 = 8 + i * 1.1, y1 = 60 - i * 2.2;
      const r = s.el("rect", { x, y: y0, width: 12, height: y1 - y0, rx: 2, fill: "#a0522d", stroke: "#6b3416", "stroke-width": 1, ...NSS });
      g.append(r); bars.push({ el: r, m });
    });
    return { g, bars };
  }
  function place(s, g, x, y, sc = 1) { const w = s.el("g", { transform: `translate(${x},${y}) scale(${sc})` }); w.append(g); return w; }
  function bounce(s, el) {
    el.style.transformBox = "fill-box"; el.style.transformOrigin = "center";
    s.tween({ from: 0, to: 1, dur: 420, ease: "linear", update: p => { el.style.transform = `scale(${1 + 0.08 * Math.sin(p * Math.PI)})`; } });
  }
  const txt = (s, x, y, t, o = {}) => s.el("text", Object.assign({ x, y, "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: "#1b2740", text: t }, o));

  /* ================================================================== */
  Deck.unit({
    id: "u5", num: 5, title: "Instrumente des Orchesters", color: "#dc2626", soft: "#fde6e3",
    subtitle: "Streichen, blasen, summen, schlagen",
    blurb: "Die vier Instrumenten-Familien, ihr Klang und das Orchester.",
    goals: ["Die vier Familien: Streicher, Holz, Blech, Schlagwerk", "Wie jedes Instrument seinen Ton macht", "Wo jeder im Orchester sitzt", "Die 10 Instrumente deiner Instrumentalklasse"],
    icon(svg, el) {
      svg.append(el("path", { d: "M35,20 C40,20 44,21 44,25 C44,28 41,29 41,32 C41,35 45,37 45,43 C45,51 40,54 35,54 C30,54 25,51 25,43 C25,37 29,35 29,32 C29,29 26,28 26,25 C26,21 30,20 35,20 Z", fill: "#dc2626" }),
        el("rect", { x: 33.5, y: 4, width: 3, height: 18, fill: "#7a1d1d" }), el("circle", { cx: 35, cy: 5, r: 3, fill: "#7a1d1d" }),
        el("line", { x1: 12, y1: 60, x2: 60, y2: 30, stroke: "#7a1d1d", "stroke-width": 2.5 }));
    },
    slides: [
      /* ---------- 1 ---------- */
      {
        title: "Vier Instrumenten-Familien",
        say: "Im Orchester gibt es vier große Familien. Wichtig ist, wie der Ton entsteht. Tippe auf eine Familie und hör hin.",
        build(s) {
          const fams = [
            { k: "str", n: "Streichinstrumente", how: "Saiten werden gestrichen oder gezupft.", ex: "Geige, Bratsche, Cello, Kontrabass",
              draw: () => place(s, gStr(s, false), 100, 14, 1.4),
              snd: () => { play(s, "cello", 48, 1.4); play(s, "bratsche", 55, 1.4, 0.15); play(s, "geige", 64, 1.3, 0.3); play(s, "geige", 72, 1.1, 0.45); } },
            { k: "holz", n: "Holzblasinstrumente", how: "Luft an einer Kante oder an einem Rohrblatt.", ex: "Flöte, Oboe, Klarinette, Fagott, Saxophon",
              draw: () => { const g = s.el("g"); g.append(place(s, gKlarinette(s), 78, 12, 1.42), place(s, gFloete(s), 112, 40, 0.55), place(s, gOboe(s), 130, 54, 0.9)); return g; },
              snd: () => { seq(s, "floete", [[79, 1], [81, 1], [83, 1], [84, 2]], 200); seq(s, "klarinette", [[60, 2], [64, 3]], 200, 0.2); } },
            { k: "blech", n: "Blechblasinstrumente", how: "Die Lippen summen in ein Mundstück.", ex: "Trompete, Horn, Posaune, Euphonium, Tuba",
              draw: () => { const g = s.el("g"); g.append(place(s, gTrompete(s), 30, 18, 1.15), place(s, gHorn(s), 52, 72, 1.05)); return g; },
              snd: () => { seq(s, "trompete", [[67, 0.5], [67, 0.5], [72, 1], [76, 1], [79, 2]], 180); seq(s, "posaune", [[48, 1], [55, 1], [52, 1], [48, 2]], 180); } },
            { k: "schlag", n: "Schlaginstrumente", how: "Man schlägt, schüttelt oder reibt sie.", ex: "Pauke, Trommeln, Becken, Xylofon, Triangel",
              draw: () => { const g = s.el("g"); g.append(place(s, gPauke(s), 70, 70, 1.05), place(s, gTrommel(s), 150, 96, 1.05), place(s, gTriangel(s), 158, 40, 0.9)); return g; },
              snd: () => { play(s, "pauke", 43, 1); play(s, "pauke", 38, 1, 0.45); [0.9, 1.0, 1.1, 1.2].forEach(w => play(s, "trommel", 0, 0, w)); play(s, "becken", 0, 0, 1.35); } },
          ];
          const cards = fams.map(f => {
            const svg = s.svg(200, 150); svg.append(f.draw());
            const card = s.h("div", { class: "card later nosw", style: { display: "flex", flexDirection: "column", gap: "8px", cursor: "pointer", borderColor: FAM[f.k], borderWidth: "3px", padding: "14px 16px" },
              onclick: () => { s.sfx.pop(); f.snd(); bounce(s, svg); } },
              s.h("div", { class: "center" }, svg),
              s.h("p", { class: "h2", style: { fontSize: "21px", color: FAM[f.k] } }, f.n),
              s.h("p", { class: "small" }, s.h("b", null, f.how)),
              s.h("p", { class: "small pencil" }, f.ex));
            card.f = f; return card;
          });
          const merk = s.h("div", { class: "merk later" }, "Die Familie hängt davon ab, ", s.h("b", null, "wie der Ton entsteht"), " – nicht davon, woraus das Instrument gebaut ist.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "14px" } },
            s.h("p", { class: "t a-up" }, "Tippe auf eine Familie, dann hörst du sie. ", s.h("span", { class: "pencil" }, "(Alle Klänge sind am Computer nachgebaut – echte Instrumente klingen viel voller.)")),
            s.h("div", { class: "cols4", style: { gridTemplateColumns: "repeat(4, minmax(0, 1fr))" } }, cards), merk));
          cards.forEach(c => s.step(async () => { s.show(c, "up"); c.f.snd(); s.say(c.f.n + ": " + c.f.how); }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* ---------- 2 ---------- */
      {
        title: "Streicher: groß klingt tief",
        say: "Vier Streichinstrumente, vom kleinsten bis zum größten. Je größer das Instrument, desto tiefer klingt es.",
        build(s) {
          const svg = s.svg(720, 380);
          const kb = keyboard(s, 1100);
          const D = [
            { k: "geige", size: "Korpus ca. 36 cm", hz: "196 Hz", note: "kleines g", held: "unter dem Kinn", strings: [55, 62, 69, 76], sc: 36 * 1.55 / 65, x: 95, ep: false },
            { k: "bratsche", size: "Korpus ca. 41 cm", hz: "131 Hz", note: "kleines c", held: "unter dem Kinn", strings: [48, 55, 62, 69], sc: 41 * 1.55 / 65, x: 270, ep: false },
            { k: "cello", size: "ca. 1,20 m hoch", hz: "65 Hz", note: "großes C", held: "im Sitzen, zwischen den Knien", strings: [36, 43, 50, 57], sc: 120 * 1.55 / 112, x: 445, ep: true },
            { k: "kontrabass", size: "ca. 1,80 m hoch", hz: "41 Hz", note: "Kontra-E", held: "im Stehen oder auf einem hohen Hocker", strings: [28, 33, 38, 43], sc: 180 * 1.55 / 112, x: 620, ep: true },
          ];
          const nameEl = s.h("p", { class: "h2", style: { color: FAM.str } }, "");
          const lowEl = s.h("p", { class: "t" }, "");
          const heldEl = s.h("p", { class: "small" }, "");
          const hzEl = s.h("p", { class: "small" }, "");
          const groups = D.map((d, i) => {
            const hgt = (d.ep ? 112 : 100) * d.sc;
            const g = s.el("g", { class: i ? "later" : "", style: { cursor: "pointer" } });
            g.append(s.el("rect", { x: d.x - 80, y: 0, width: 160, height: 380, fill: "transparent" }),
              place(s, gStr(s, d.ep), d.x, 300 - hgt, d.sc),
              txt(s, d.x, 330, INST[d.k].n, { "font-size": 22 }),
              txt(s, d.x, 360, d.size, { "font-size": 19, "font-weight": 400, fill: "#5d6678" }));
            g.onclick = () => pick(i);
            svg.append(g); return g;
          });
          function pick(i) {
            const d = D[i];
            nameEl.textContent = INST[d.k].n;
            lowEl.replaceChildren("Tiefste Saite: ", s.h("b", null, d.note)); hzEl.replaceChildren("Sie schwingt ", s.h("b", null, d.hz.replace(" Hz", "-mal")), " pro Sekunde (" + d.hz + ").");
            heldEl.textContent = "Gehalten: " + d.held;
            kb.set(d.k);
            d.strings.forEach((m, j) => play(s, d.k, m, 0.42, j * 0.45));
            play(s, d.k, d.strings[0], 0.5, 1.9);
            bounce(s, groups[i]);
          }
          const merk = s.h("div", { class: "merk later" }, "Je ", s.h("b", null, "größer"), " das Instrument und je ", s.h("b", null, "länger"), " die Saiten, desto ", s.h("b", null, "tiefer"), " der Ton.");
          s.add(s.h("div", { class: "stack", style: { gap: "12px" } },
            s.h("div", { style: { display: "grid", gridTemplateColumns: "720px 1fr", gap: "24px", alignItems: "center" } }, svg,
              s.h("div", { class: "stack" },
                s.h("div", { class: "card", style: { minHeight: "190px" } }, s.h("span", { class: "exlabel" }, "Angetippt"), nameEl, lowEl, hzEl, heldEl),
                s.h("p", { class: "small pencil" }, "Tippe auf ein Instrument: Du hörst seine vier leeren Saiten. Unten siehst du, wie tief und hoch es spielen kann."))),
            kb.svg, merk));
          s.wait(10).then(() => { if (s.alive) { pick(0); } });
          [1, 2, 3].forEach(i => s.step(async () => { s.show(groups[i], "up"); pick(i); s.say(INST[D[i].k].n + ", " + D[i].size + "."); }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* ---------- 3 ---------- */
      {
        title: "Streichen oder zupfen?",
        say: "Eine Saite kann man mit dem Bogen streichen oder mit dem Finger zupfen. Und wenn die Saite kürzer wird, klingt sie höher.",
        build(s) {
          const W = 600, H = 250, L0 = 520, X0 = 40, XB = 560;
          const { canvas, g } = s.canvas(W, H);
          let n = 0, amp = 0, mode = "", t0 = 0, until = 0, tNow = 0;
          const fx = () => XB - L0 * Math.pow(2, -n / 12);
          const draw = t => {
            tNow = t;
            g.clearRect(0, 0, W, H);
            g.fillStyle = "#3a2210"; g.fillRect(X0 - 10, 95, XB - X0 + 20, 70);
            g.fillStyle = "#e8c99a"; g.fillRect(XB - 4, 85, 10, 90); g.fillRect(X0 - 12, 85, 8, 90);
            const f = fx(), len = XB - f;
            if (mode === "arco" && t < until) amp += (14 - amp) * 0.2; else amp *= mode === "pizz" ? 0.965 : 0.9;
            g.strokeStyle = "#f4f4f4"; g.lineWidth = 3; g.beginPath(); g.moveTo(X0 - 6, 130); g.lineTo(f, 130);
            for (let x = f; x <= XB; x += 4) g.lineTo(x, 130 + amp * Math.sin(Math.PI * (x - f) / len) * Math.sin(t * (14 + n * 1.3)));
            g.stroke();
            g.fillStyle = "#f2c49b"; g.beginPath(); g.arc(f, 130, 15, 0, 7); g.fill(); g.strokeStyle = "#a8714a"; g.lineWidth = 2; g.stroke();
            g.fillStyle = "#1b2740"; g.font = "700 19px Atkinson Hyperlegible, sans-serif"; g.textAlign = "center";
            g.fillText("Finger", f, 72); g.fillText("Steg", XB, 210);
            if (mode === "arco" && t < until) {
              const y = 130 + 60 * Math.sin((t - t0) * 2.2);
              g.fillStyle = "#5a2e0e"; g.fillRect(455, y - 120, 7, 240); g.fillStyle = "#f3ead6"; g.fillRect(463, y - 116, 5, 232);
            }
            if (mode === "pizz" && t - t0 < 0.25) { g.fillStyle = "#f2c49b"; g.beginPath(); g.arc(470, 130 + 30 * (1 - (t - t0) / 0.25), 13, 0, 7); g.fill(); }
          };
          s.loop(t => draw(t));
          const arco = () => { mode = "arco"; t0 = tNow; until = tNow + 1.6; play(s, "cello", 50 + n, 1.4); };
          const pizz = () => { mode = "pizz"; t0 = tNow; amp = 26; play(s, "pizz", 50 + n, 0.6); };
          const sl = s.slider({ label: "Finger rutscht: Saite wird kürzer", min: 0, max: 12, value: 0, fmt: v => Math.round(100 * Math.pow(2, -v / 12)) + " % lang", onInput: v => { n = v; } });
          const b1 = s.h("button", { class: "btn solid", onclick: arco }, "Streichen (arco)");
          const b2 = s.h("button", { class: "btn", onclick: pizz }, "Zupfen (pizzicato)");
          const ex1 = s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, "Mit dem Bogen – arco"), s.h("p", { class: "small" }, "Die Bogenhaare sind Pferdehaare mit Kolophonium (Harz). Sie nehmen die Saite immer wieder ein Stück mit. Sie schwingt, solange du streichst."));
          const ex2 = s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, "Mit dem Finger – pizzicato"), s.h("p", { class: "small" }, "Du zupfst die Saite. Der Ton ist kurz und tupfig und klingt schnell aus."));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Kürzere Saite → höherer Ton. ", s.h("b", null, "Halbe Saite = eine Oktave höher."));
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"),
            s.h("p", { class: "small" }, "Jazz: Der Kontrabass wird fast immer gezupft. Gitarre: auch Saiten, nur gezupft. Klavier: kleine Hämmer schlagen Saiten an."));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "600px 1fr", gap: "26px", height: "100%" } },
            s.h("div", { class: "stack" }, canvas, s.h("div", { class: "row" }, b1, b2), sl,
              s.h("p", { class: "small pencil" }, "Probier beides aus. Schieb dann den Finger und streiche noch mal.")),
            s.h("div", { class: "stack", style: { gap: "12px" } }, ex1, ex2, merk, life)));
          s.step(async () => { s.show(ex1, "left"); arco(); s.say("Mit dem Bogen klingt die Saite, solange du streichst."); });
          s.step(async () => { s.show(ex2, "left"); pizz(); s.say("Gezupft klingt der Ton kurz."); });
          s.step(async () => {
            s.show(merk, "up"); s.sfx.ding();
            for (const v of [0, 4, 7, 12]) { if (!s.alive) return; sl.set(v); pizz(); await s.wait(500); }
          });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* ---------- 4 ---------- */
      {
        title: "Holzblasinstrumente",
        say: "Bei den Holzbläsern schwingt die Luft an einer Kante oder an einem Rohrblatt. Tippe auf ein Instrument.",
        build(s) {
          const svg = s.svg(1100, 300);
          const kb = keyboard(s, 1100);
          const D = {
            floete: { type: "Kante", t: "Du bläst über eine Kante – wie über eine Flaschenöffnung. Kein Rohrblatt! Meist aus Metall, und trotzdem ein Holzblasinstrument." },
            oboe: { type: "Doppelrohrblatt", t: "Zwei dünne Rohrblätter schwingen gegeneinander. Klingt hell und durchdringend. Das Orchester stimmt nach dem A der Oboe." },
            klarinette: { type: "Rohrblatt", t: "Ein Rohrblatt schwingt am Mundstück. Meist aus Grenadill-Holz, etwa 66 cm lang. Klingt weich und rund." },
            fagott: { type: "Doppelrohrblatt", t: "Doppelrohrblatt wie bei der Oboe. Sein Rohr ist etwa 2,5 m lang und gefaltet – so ist das Fagott nur etwa 1,34 m hoch." },
          };
          const pos = { floete: [40, 200, 175], oboe: [470, 20, 290], klarinette: [650, 20, 290], fagott: [860, 20, 290] };
          const gs = {};
          const mk = (k, draw, x, y, sc, lx, ly, hit) => {
            const g = s.el("g", { style: { cursor: "pointer" } });
            g.append(s.el("rect", Object.assign({ fill: "transparent" }, hit)), place(s, draw(s), x, y, sc), txt(s, lx, ly, INST[k].n, { "font-size": 22 }));
            g.onclick = () => pick(k); svg.append(g); gs[k] = g;
          };
          mk("floete", gFloete, 30, 130, 1.5, 180, 190, { x: 20, y: 80, width: 320, height: 130 });
          mk("oboe", gOboe, 470, 20, 2.3, 470, 292, { x: 410, y: 10, width: 120, height: 290 });
          mk("klarinette", gKlarinette, 650, 12, 2.45, 650, 292, { x: 590, y: 10, width: 120, height: 290 });
          mk("fagott", gFagott, 870, 4, 2.55, 860, 292, { x: 780, y: 0, width: 160, height: 300 });
          // sound-maker mini diagram
          const mini = s.svg(150, 150);
          const edge = s.el("g"), reed = s.el("g"), dbl = s.el("g");
          edge.append(s.el("path", { d: "M20,110 L120,110 L120,60 L96,60 L84,96 L20,96 Z", fill: "#c9d1d9", stroke: "#7d8a97" }),
            s.el("path", { d: "M10,40 C40,40 70,50 84,80", stroke: "#1d5bd0", "stroke-width": 3, fill: "none", "stroke-dasharray": "8 6", class: "airflow" }));
          const reedBlade = s.el("line", { x1: 30, y1: 92, x2: 126, y2: 84, stroke: "#d9a441", "stroke-width": 6, "stroke-linecap": "round" });
          reed.append(s.el("path", { d: "M30,70 L130,60 L130,80 L30,86 Z", fill: "#111" }), reedBlade);
          const b1 = s.el("line", { x1: 30, y1: 68, x2: 128, y2: 72, stroke: "#d9a441", "stroke-width": 6, "stroke-linecap": "round" });
          const b2 = s.el("line", { x1: 30, y1: 88, x2: 128, y2: 82, stroke: "#d9a441", "stroke-width": 6, "stroke-linecap": "round" });
          dbl.append(s.el("rect", { x: 112, y: 64, width: 30, height: 26, fill: "#c9d1d9" }), b1, b2);
          mini.append(edge, reed, dbl);
          const typeEl = s.h("span", { class: "chip" }, "");
          const nameEl = s.h("p", { class: "h2", style: { color: FAM.holz } }, "");
          const tEl = s.h("p", { class: "small" }, "");
          let cur = "floete", playT = 0;
          s.loop(t => {
            const on = t < playT, w = on ? Math.sin(t * 40) : 0;
            edge.style.display = D[cur].type === "Kante" ? "" : "none";
            reed.style.display = D[cur].type === "Rohrblatt" ? "" : "none";
            dbl.style.display = D[cur].type === "Doppelrohrblatt" ? "" : "none";
            reedBlade.setAttribute("y1", 92 + 5 * w);
            b1.setAttribute("y1", 68 + 4 * w); b2.setAttribute("y1", 88 - 4 * w);
            edge.lastChild.setAttribute("stroke-dashoffset", on ? -t * 60 : 0);
            mini.tNow = t;
          });
          function pick(k) {
            cur = k; nameEl.textContent = INST[k].n; typeEl.textContent = D[k].type; tEl.textContent = D[k].t;
            kb.set(k); demo(s, k); bounce(s, gs[k]); playT = (mini.tNow || 0) + 2.6;
          }
          const info = s.h("div", { class: "card", style: { display: "grid", gridTemplateColumns: "150px 1fr", gap: "16px", alignItems: "center", padding: "12px 18px" } }, mini,
            s.h("div", { class: "stack", style: { gap: "6px" } }, s.h("div", { class: "row", style: { gap: "12px" } }, nameEl, typeEl), tEl,
              s.h("p", { class: "small pencil" }, "Klappen öffnen Löcher: kürzere Luftsäule = höherer Ton.")));
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"),
            s.h("p", { class: "small" }, "Über eine Flasche pusten: Kante wie bei der Flöte. Grashalm zwischen den Daumen: schwingt wie ein Rohrblatt. Blockflöte in der Grundschule: auch ein Holzbläser."));
          s.add(s.h("div", { class: "stack", style: { gap: "10px" } }, svg,
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: "18px" } }, info, life), kb.svg));
          s.wait(10).then(() => s.alive && pick("floete"));
          s.step(async () => { pick("klarinette"); s.say("Bei der Klarinette schwingt ein Rohrblatt."); });
          s.step(async () => { pick("oboe"); s.say("Bei der Oboe schwingen zwei Rohrblätter gegeneinander."); });
          s.step(async () => { pick("fagott"); s.say("Das Fagott ist der Bass der Holzbläser."); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* ---------- 5 ---------- */
      {
        title: "Saxophon: Metall, aber Holz?",
        say: "Das Saxophon ist aus Metall. Trotzdem gehört es zu den Holzbläsern, denn sein Ton entsteht an einem Rohrblatt.",
        build(s) {
          const svg = s.svg(400, 400);
          const sax = s.el("g"); sax.append(place(s, gSax(s), 300, 24, 3.5));
          const zoom = s.el("g", { class: "later" });
          const reed = s.el("line", { x1: 36, y1: 162, x2: 160, y2: 150, stroke: "#d9a441", "stroke-width": 9, "stroke-linecap": "round" });
          zoom.append(s.el("line", { x1: 166, y1: 89, x2: 222, y2: 40, stroke: "#dc2626", "stroke-width": 2, "stroke-dasharray": "6 5" }),
            s.el("circle", { cx: 100, cy: 150, r: 90, fill: "#fff", stroke: "#dc2626", "stroke-width": 3 }),
            s.el("path", { d: "M26,124 L176,112 L176,140 L26,152 Z", fill: "#111" }), reed,
            txt(s, 100, 212, "Rohrblatt", { fill: "#a26a0a" }));
          svg.append(sax, zoom);
          let playT = 0, tNow = 0;
          s.loop(t => { tNow = t; const w = t < playT ? Math.sin(t * 45) * 6 : 0; reed.setAttribute("y1", 162 + w); });
          const kb = keyboard(s, 676);
          const go = (k, notes, bpm) => { playT = tNow + 2.4; kb.set(k); bounce(s, sax); return seq(s, "saxophon", notes, bpm); };
          const alt = () => go("altsax", [[49, 1], [56, 1], [61, 1], [65, 1], [68, 2]], 200);
          const ten = () => go("tenorsax", [[44, 1], [51, 1], [56, 1], [60, 1], [63, 2]], 200);
          const jazz = () => { go("altsax", [[65, 0.66], [68, 0.34], [69, 0.66], [72, 0.34], [75, 1], [72, 0.5], [70, 0.5], [68, 0.66], [65, 1.34]], 150); seq(s, "pizz", [[41, 1], [45, 1], [48, 1], [50, 1], [53, 1], [50, 1]], 150); };
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Der Ton entsteht an einem ", s.h("b", null, "Rohrblatt"), " – wie bei der Klarinette. Darum ist das Saxophon ein Holzbläser, obwohl es aus Messing ist. Die Querflöte ist auch aus Metall – und auch ein Holzbläser.");
          const who = s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, "Erfinder"), s.h("p", { class: "small" }, "Adolphe Sax aus Belgien erfand es um 1840. 1846 bekam er in Frankreich das Patent."));
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"), s.h("p", { class: "small" }, "Jazz-Clubs, Bigbands, Blasorchester – und viele Pop-Songs haben ein Saxophon-Solo."));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "400px 1fr", gap: "24px", height: "100%" } },
            s.h("div", { class: "stack", style: { gap: "10px" } }, svg, who),
            s.h("div", { class: "stack", style: { gap: "12px" } },
              s.h("p", { class: "big a-up", style: { fontSize: "36px" } }, "Aus Metall – und trotzdem ein Holzblasinstrument!"),
              s.h("div", { class: "row" }, s.h("button", { class: "btn solid", onclick: alt }, "Altsaxophon"), s.h("button", { class: "btn", onclick: ten }, "Tenorsaxophon"), s.h("button", { class: "btn", onclick: jazz }, "Jazz-Melodie")),
              kb.svg, merk, life)));
          s.show(sax, "zoom"); s.sfx.whoosh();
          s.step(async () => { s.show(zoom, "pop"); alt(); await s.wait(300); s.show(merk, "up"); s.say("Am Mundstück schwingt ein Rohrblatt."); });
          s.step(async () => { s.sfx.pop(); await s.show(who, "up"); });
          s.step(async () => { s.show(life, "up"); jazz(); });
        },
      },
      /* ---------- 6 ---------- */
      {
        title: "Blechblasinstrumente",
        say: "Bei den Blechbläsern summen die Lippen ins Mundstück. Je länger das Rohr, desto tiefer der Ton.",
        build(s) {
          const svg = s.svg(1100, 206);
          const kb = keyboard(s, 1100);
          const gs = {};
          const mk = (k, draw, x, y, sc, lx, hit) => {
            const g = s.el("g", { style: { cursor: "pointer" } });
            g.append(s.el("rect", Object.assign({ fill: "transparent" }, hit)), place(s, draw(), x, y, sc), txt(s, lx, 200, INST[k].n, { "font-size": 21 }));
            g.onclick = () => { kb.set(k); demo(s, k); bounce(s, g); }; svg.append(g); gs[k] = g;
          };
          mk("trompete", () => gTrompete(s), 20, 70, 1.5, 110, { x: 10, y: 30, width: 200, height: 176 });
          mk("horn", () => gHorn(s), 258, 38, 1.75, 326, { x: 240, y: 20, width: 170, height: 186 });
          mk("posaune", () => gPosaune(s).g, 425, 74, 1.35, 545, { x: 420, y: 30, width: 240, height: 176 });
          mk("euphonium", () => gTuba(s, true), 770, 40, 1.3, 770, { x: 700, y: 20, width: 140, height: 186 });
          mk("tuba", () => gTuba(s, false), 990, 8, 1.65, 990, { x: 900, y: 0, width: 190, height: 206 });
          // lips
          const lips = s.svg(170, 120);
          const up = s.el("path", { d: "M20,62 Q60,30 100,62 Z", fill: "#e07a7a" }), lo = s.el("path", { d: "M20,66 Q60,98 100,66 Z", fill: "#d96262" });
          lips.append(up, lo, s.el("path", { d: "M100,40 L112,40 Q140,46 168,58 L168,70 Q140,82 112,88 L100,88 Z", fill: "#c9d1d9", stroke: "#7d8a97" }));
          let buzzT = 0, tNow = 0;
          s.loop(t => { tNow = t; const w = t < buzzT ? Math.abs(Math.sin(t * 50)) * 6 : 0; up.setAttribute("transform", `translate(0,${-w})`); lo.setAttribute("transform", `translate(0,${w})`); });
          const buzz = () => { buzzT = tNow + 1.2; seq(s, "lippen", [[58, 1], [62, 1], [65, 2]], 160); };
          const trp = () => { buzzT = tNow + 1.2; seq(s, "trompete", [[58, 1], [62, 1], [65, 2]], 160); kb.set("trompete"); };
          const lipCard = s.h("div", { class: "card later", style: { padding: "12px 16px" } }, s.h("span", { class: "exlabel" }, "So entsteht der Ton"),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "170px 1fr", gap: "12px", alignItems: "center" } }, lips,
              s.h("div", { class: "stack", style: { gap: "8px" } },
                s.h("p", { class: "small" }, "Lippen fest aufeinander, Luft durchpressen: Sie ", s.h("b", null, "summen"), ". Mundstück und Rohr machen daraus einen vollen Ton."),
                s.h("div", { class: "row", style: { gap: "10px" } }, s.h("button", { class: "btn", onclick: buzz }, "Nur Lippen"), s.h("button", { class: "btn solid", onclick: trp }, "Mit Trompete")))));
          // tube lengths
          const TL = [["trompete", "Trompete", 1.3, "ca. 1,30 m", 58], ["euphonium", "Euphonium", 2.75, "ca. 2,75 m", 46], ["horn", "Horn (F)", 3.7, "ca. 3,70 m", 41], ["tuba", "Tuba (F)", 3.98, "ca. 4 m", 29]];
          const tsvg = s.svg(460, 134);
          const bars = TL.map((r, i) => {
            const y = 2 + i * 33;
            tsvg.append(s.el("text", { x: 120, y: y + 21, "text-anchor": "end", "font-size": 19, "font-weight": 700, fill: "#1b2740", text: r[1] }));
            const b = s.el("rect", { x: 130, y: y + 4, width: 0, height: 22, rx: 11, fill: GOLD });
            const v = s.el("text", { x: 140, y: y + 21, "font-size": 19, fill: "#5d6678", text: r[3], class: "later" });
            tsvg.append(b, v); return { b, v, w: r[2] * 58, r };
          });
          const tubeCard = s.h("div", { class: "card later", style: { padding: "12px 16px" } }, s.h("span", { class: "exlabel" }, "Das Rohr ausgerollt"), tsvg,
            s.h("p", { class: "small" }, s.h("b", null, "Längeres Rohr → tieferer Ton."), " Darum ist die Tuba so tief."));
          const life = s.h("div", { class: "life later", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, "Im Alltag"),
            s.h("p", { class: "small" }, "Fanfaren im Fußballstadion, Posaunenchor in der Kirche, Blaskapelle beim Straßenfest."));
          s.add(s.h("div", { class: "stack", style: { gap: "8px" } }, svg, kb.svg,
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: "16px" } }, s.h("div", { class: "stack", style: { gap: "8px" } }, lipCard, life), tubeCard)));
          s.step(async () => { s.show(lipCard, "up"); buzz(); await s.wait(1300); trp(); s.say("Erst nur die Lippen. Dann mit Trompete."); });
          s.step(async () => {
            s.show(tubeCard, "up");
            for (const B of bars) {
              if (!s.alive) return;
              play(s, B.r[0], B.r[4], 0.6);
              await s.tween({ from: 0, to: B.w, dur: 600, ease: "out", update: w => B.b.setAttribute("width", w) });
              B.v.setAttribute("x", 140 + B.w); s.show(B.v, "fade");
            }
          });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* ---------- 7 ---------- */
      {
        title: "Zug und Ventile",
        say: "Die Posaune macht ihr Rohr mit dem Zug länger. Trompete, Horn und Tuba haben dafür Ventile.",
        build(s) {
          const NAMES = ["B", "A", "As", "G", "Fis", "F", "E"];
          const psvg = s.svg(600, 200);
          const P = gPosaune(s);
          psvg.append(place(s, P.g, 110, 62, 2.9));
          const big = s.h("span", { class: "huge", style: { color: "var(--unit)", fontSize: "60px" } }, "B");
          let pos = 1;
          const setPos = (p, sound = true) => {
            const from = pos; pos = p; big.textContent = NAMES[p - 1];
            s.tween({ from: (from - 1) * 5, to: (p - 1) * 5, dur: 300, ease: "out", update: u => P.setSlide(u) });
            if (sound) play(s, "posaune", 47 - p, 0.7);
          };
          const sl = s.slider({ label: "Zugposition", min: 1, max: 7, value: 1, fmt: v => v + ". Position", onInput: v => setPos(v) });
          const gliss = async () => {
            play(s, "posaune", 46, 1.6, 0, { glideTo: 40 });
            await s.tween({ from: 0, to: 30, dur: 1600, ease: "linear", update: u => { P.setSlide(u); const p = Math.round(u / 5) + 1; big.textContent = NAMES[p - 1]; } });
            pos = 7; sl.input.value = 7; sl.querySelector(".mono").textContent = "7. Position";
          };
          const left = s.h("div", { class: "card", style: { padding: "12px 18px" } }, s.h("span", { class: "exlabel" }, "Posaune: der Zug"), psvg,
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 120px", gap: "16px", alignItems: "center" } }, sl, s.h("div", { class: "center" }, big)),
            s.h("div", { class: "row", style: { marginTop: "6px" } }, s.h("button", { class: "btn solid", onclick: gliss }, "Glissando"),
              s.h("p", { class: "small", style: { flex: "1" } }, "7 Positionen, jede einen Halbton tiefer. Der Zug kann auch gleiten.")));
          // valves
          const vsvg = s.svg(400, 230);
          const LOOP = { 1: 34, 2: 18, 3: 52 }, X = { 1: 140, 2: 200, 3: 260 }, DROP = { 1: 2, 2: 1, 3: 3 };
          vsvg.append(tube(s, "M20,60 L380,60", 6), s.el("rect", { x: 6, y: 52, width: 18, height: 16, rx: 3, fill: "#c9d1d9" }),
            s.el("path", { d: "M360,60 L380,40 L380,80 Z", fill: GOLD }));
          const loops = {}, caps = {};
          [1, 2, 3].forEach(k => {
            const x = X[k], d = LOOP[k];
            loops[k] = s.el("path", { d: `M${x - 12},66 L${x - 12},${66 + d * 2} Q${x - 12},${86 + d * 2} ${x},${86 + d * 2} Q${x + 12},${86 + d * 2} ${x + 12},${66 + d * 2} L${x + 12},66`, stroke: GOLD, "stroke-width": 6, fill: "none", opacity: 0.25 });
            caps[k] = s.el("rect", { x: x - 16, y: 30, width: 32, height: 44, rx: 6, fill: "#e9d48e", stroke: GOLDD, "stroke-width": 2 });
            vsvg.append(loops[k], caps[k], txt(s, x, 22, String(k), { "font-size": 20 }));
          });
          const down = { 1: false, 2: false, 3: false };
          const note = () => 58 - [1, 2, 3].reduce((a, k) => a + (down[k] ? DROP[k] : 0), 0);
          const btns = [1, 2, 3].map(k => s.h("button", { class: "btn", style: { minWidth: "70px" }, onclick: e => {
            down[k] = !down[k]; e.currentTarget.classList.toggle("solid", down[k]);
            loops[k].setAttribute("opacity", down[k] ? 1 : 0.25); caps[k].setAttribute("transform", down[k] ? "translate(0,8)" : "");
            play(s, "trompete", note(), 0.6);
          } }, "Ventil " + k));
          const right = s.h("div", { class: "card later", style: { padding: "12px 18px" } }, s.h("span", { class: "exlabel" }, "Trompete: die Ventile"), vsvg,
            s.h("div", { class: "row", style: { gap: "10px" } }, btns, s.h("button", { class: "btn solid", onclick: () => play(s, "trompete", note(), 0.6) }, "Blasen")),
            s.h("p", { class: "small", style: { marginTop: "8px" } }, "Ein gedrücktes Ventil schickt die Luft durch ein Extra-Rohr."));
          const merk = s.h("div", { class: "merk later" }, "Zug oder Ventil: Das Rohr wird ", s.h("b", null, "länger"), " → der Ton wird ", s.h("b", null, "tiefer"), ".");
          s.add(s.h("div", { class: "stack", style: { gap: "12px" } }, s.h("div", { style: { display: "grid", gridTemplateColumns: "600px 1fr", gap: "20px" } }, left, right), merk));
          s.step(async () => { for (let p = 1; p <= 7; p++) { if (!s.alive) return; sl.set(p); await s.wait(420); } s.say("Je weiter der Zug draußen ist, desto tiefer."); });
          s.step(async () => { s.show(right, "left"); play(s, "trompete", 58, 0.5); for (const k of [2, 1, 3]) { await s.wait(550); if (!s.alive) return; btns[k - 1].click(); await s.wait(550); btns[k - 1].click(); } });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* ---------- 8 ---------- */
      {
        title: "Schlaginstrumente",
        say: "Schlaginstrumente schlägt man an. Manche haben feste Töne, wie Pauke und Xylofon. Andere machen Rhythmus und Geräusche.",
        build(s) {
          const svg = s.svg(1100, 262);
          const NOTE = ["C", "Cis", "D", "Dis", "E", "F", "Fis", "G", "Gis", "A", "B", "H"];
          let pm = 43;
          const hit = (g, fn) => { g.style.cursor = "pointer"; g.onclick = e => { fn(e); bounce(s, g); }; return g; };
          const grp = (x, y, w, h) => s.el("rect", { x, y, width: w, height: h, fill: "transparent" });
          const pk = s.el("g"); pk.append(grp(10, 40, 180, 200), place(s, gPauke(s), 100, 82, 2.1), txt(s, 100, 254, "Pauke"));
          svg.append(hit(pk, () => play(s, "pauke", pm, 1)));
          const X = gXylofon(s), xg = s.el("g");
          xg.append(place(s, X.g, 214, 78, 2.2), txt(s, 346, 254, "Xylofon"));
          X.bars.forEach(b => { b.el.style.cursor = "pointer"; b.el.onclick = () => { play(s, "xylofon", b.m, 0.3); b.el.setAttribute("fill", "#d2783f"); s.wait(180).then(() => b.el.setAttribute("fill", "#a0522d")); }; });
          svg.append(xg, s.el("line", { x1: 505, y1: 20, x2: 505, y2: 250, stroke: "#c8d3de", "stroke-width": 3, "stroke-dasharray": "8 8" }),
            txt(s, 250, 24, "mit Tonhöhe", { fill: "#7b4fd6" }), txt(s, 810, 24, "ohne feste Tonhöhe", { fill: "#7b4fd6" }));
          const others = [["Kleine Trommel", gTrommel, 600, 126, "trommel"], ["Große Trommel", gGrosse, 760, 116, "grosse"], ["Becken", gBecken, 905, 128, "becken"], ["Triangel", gTriangel, 1035, 140, "triangel"]];
          others.forEach(([n, f, x, y, snd]) => { const g = s.el("g"); g.append(grp(x - 70, 40, 140, 200), place(s, f(s), x, y, 1.8), txt(s, x, 254, n, { "font-size": 19 })); svg.append(hit(g, () => play(s, snd, 0))); });
          const sl = s.slider({ label: "Pauken-Pedal", min: 38, max: 57, value: 43, fmt: v => "Ton " + NOTE[v % 12], onInput: v => { pm = v; play(s, "pauke", v, 0.8); } });
          const c1 = s.h("div", { class: "card later" }, s.h("span", { class: "exlabel" }, "Mit Tonhöhe"),
            s.h("p", { class: "small" }, "Die Pauke ist ein Kupferkessel mit Fell. Ein Pedal spannt das Fell: straffer = höher."), sl,
            s.h("p", { class: "small pencil" }, "Tippe auch auf die Holzplatten des Xylofons!"));
          const c2 = s.h("div", { class: "card later" }, s.h("span", { class: "exlabel" }, "Ohne feste Tonhöhe"),
            s.h("p", { class: "small" }, "Trommeln, Becken und Triangel spielen keine Melodie. Sie machen Rhythmus, Spannung und Glanz – ein Beckenschlag ist der große Knall am Schluss."));
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"),
            s.h("p", { class: "small" }, "Große Trommel im Fanfarenzug, Schlagzeug in der Band (Trommeln und Becken), Triangel und Xylofon im Kindergarten."));
          s.add(s.h("div", { class: "stack", style: { gap: "12px" } }, svg, s.h("div", { class: "cols3", style: { gridTemplateColumns: "1.15fr 1fr 1fr", gap: "16px" } }, c1, c2, life)));
          s.step(async () => { s.show(c1, "up"); for (const m of [38, 45, 50]) { if (!s.alive) return; sl.set(m); await s.wait(450); } X.bars.forEach((b, i) => play(s, "xylofon", b.m, 0.3, i * 0.12)); });
          s.step(async () => { s.show(c2, "up"); [0, 0.12, 0.24, 0.36, 0.48].forEach(w => play(s, "trommel", 0, 0, w)); play(s, "grosse", 0, 0, 0.62); play(s, "becken", 0, 0, 0.62); play(s, "triangel", 0, 0, 1.5); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* ---------- 9 ---------- */
      {
        title: "Wer spielt wie hoch?",
        say: "Hier siehst du alle Tonumfänge auf einer Klaviertastatur. Tippe auf eine Zeile, dann hörst du den tiefsten und den höchsten Ton.",
        build(s) {
          const LW = 170, KW = 930;
          const kb = keyboard(s, KW);
          const ORDER = [["str", ["geige", "bratsche", "cello", "kontrabass"]], ["holz", ["floete", "oboe", "klarinette", "fagott", "altsax", "tenorsax"]], ["blech", ["trompete", "horn", "posaune", "euphonium", "tuba"]], ["schlag", ["pauke", "xylofon"]]];
          const RH = 27;
          const rows = s.svg(1100, 17 * RH + 4);
          const fams = [];
          let r = 0;
          ORDER.forEach(([f, ks]) => {
            const g = s.el("g", { class: "later" });
            ks.forEach(k => {
              const I = INST[k], y = 2 + r * RH, a = LW + kb.xOf(I.lo).x, b = LW + kb.xOf(I.hi).x + kb.xOf(I.hi).w;
              const row = s.el("g", { style: { cursor: "pointer" } });
              row.append(s.el("rect", { x: 0, y, width: 1100, height: RH, fill: "transparent" }),
                s.el("text", { x: LW - 10, y: y + 20, "text-anchor": "end", "font-size": 19, "font-weight": 700, fill: FAM[f], text: I.n }),
                s.el("rect", { x: a, y: y + 4, width: b - a, height: RH - 8, rx: 9, fill: FAM[f], opacity: 0.85 }));
              row.onclick = () => { kb.set(k); const v = voiceOf(k); play(s, v, I.lo, 0.6); play(s, v, I.hi, 0.6, 0.7); };
              g.append(row); r++;
            });
            rows.append(g); fams.push([g, ks]);
          });
          s.add(s.h("div", { class: "stack", style: { gap: "4px" } },
            s.h("div", { style: { display: "grid", gridTemplateColumns: LW + "px 1fr" } }, s.h("p", { class: "small pencil", style: { paddingTop: "48px" } }, "Roter Punkt = mittleres C"), kb.svg),
            rows,
            s.h("p", { class: "small pencil" }, "Ungefähre Tonumfänge der klingenden Töne – Profis kommen oft noch etwas höher.")));
          fams.forEach(([g, ks]) => s.step(async () => {
            s.show(g, "left");
            ks.forEach((k, i) => play(s, voiceOf(k), INST[k].lo + 12, 0.3, i * 0.18));
          }));
          s.step(async () => { s.sfx.ding(); kb.set("geige"); s.say("Das Xylofon und die Flöte spielen sehr hoch, Tuba und Kontrabass sehr tief."); });
        },
      },
      /* ---------- 10 ---------- */
      {
        title: "Wer sitzt wo im Orchester?",
        say: "Im Orchester hat jeder seinen festen Platz. Vorne sitzen die Streicher, dahinter Holz, Blech und ganz hinten das Schlagwerk.",
        build(s) {
          const C = { x: 380, y: 488 };
          const svg = s.svg(760, 540);
          const pt = (r, a) => [C.x + r * Math.cos(a * Math.PI / 180), C.y - r * Math.sin(a * Math.PI / 180)];
          const wedge = (r1, r2, a1, a2) => { const [x1, y1] = pt(r1, a1), [x2, y2] = pt(r2, a1), [x3, y3] = pt(r2, a2), [x4, y4] = pt(r1, a2); return `M${x1},${y1} L${x2},${y2} A${r2},${r2} 0 0 1 ${x3},${y3} L${x4},${y4} A${r1},${r1} 0 0 0 ${x1},${y1} Z`; };
          svg.append(s.el("path", { d: wedge(60, 430, 180, 0), fill: "#f6efe6", stroke: "#d9c9b0", "stroke-width": 2 }));
          const AM = { v1: [70, 200, 180, 130], v2: [70, 200, 130, 90], br: [70, 200, 90, 50], vc: [70, 200, 50, 0], kb: [200, 275, 35, 0] };
          const DE = { v1: [70, 200, 180, 130], vc: [70, 200, 130, 90], br: [70, 200, 90, 50], v2: [70, 200, 50, 0], kb: [200, 275, 180, 145] };
          const SEC = [
            { k: "v1", n: "1. Violinen", fam: "str", c: "#c97a3a", N: 12, lr: 140 },
            { k: "v2", n: "2. Violinen", fam: "str", c: "#e0a060", N: 10, lr: 150 },
            { k: "br", n: "Bratschen", fam: "str", c: "#b5651d", N: 8, lr: 150 },
            { k: "vc", n: "Celli", fam: "str", c: "#8a4a20", N: 8, lr: 140 },
            { k: "kb", n: "Kontrabässe", fam: "str", c: "#6b3a10", N: 6, lr: 238 },
            { k: "holz", n: "Holzbläser", fam: "holz", c: FAM.holz, N: 10, p: [200, 275, 125, 55], lr: 238 },
            { k: "blech", n: "Blechbläser", fam: "blech", c: FAM.blech, N: 12, p: [275, 350, 140, 40], lr: 312 },
            { k: "schlag", n: "Schlagwerk und Pauken", fam: "schlag", c: FAM.schlag, N: 5, p: [350, 420, 125, 55], lr: 385 },
          ];
          const layers = { str: s.el("g", { class: "later" }), holz: s.el("g", { class: "later" }), blech: s.el("g", { class: "later" }), schlag: s.el("g", { class: "later" }) };
          const labels = s.el("g");
          SEC.forEach(S => {
            S.p = S.p || AM[S.k].slice();
            S.path = s.el("path", { fill: S.c, opacity: 0.22 });
            S.dots = Array.from({ length: S.N }, () => s.el("circle", { r: 7, fill: S.c, stroke: "#fff", "stroke-width": 1.5 }));
            S.lbl = s.el("text", { "text-anchor": "middle", "font-size": 19, "font-weight": 700, fill: "#1b2740", stroke: "#fff", "stroke-width": 5, "paint-order": "stroke", text: S.n, class: "later" });
            const cols = Math.ceil(S.N / 2);
            S.seat = S.dots.map((_, i) => [(i % cols + 0.5) / cols, i < cols ? 0.28 : 0.72]);
            layers[S.fam].append(S.path, ...S.dots); labels.append(S.lbl);
          });
          svg.append(layers.str, layers.holz, layers.blech, layers.schlag, labels,
            s.el("circle", { cx: C.x, cy: C.y, r: 13, fill: "#1b2740" }), txt(s, C.x, 530, "Dirigent", { "font-size": 19 }));
          function render(S, fly = 1) {
            const [r1, r2, a1, a2] = S.p;
            S.path.setAttribute("d", wedge(r1, r2, a1, a2));
            S.dots.forEach((d, i) => {
              const [u, v] = S.seat[i], [x, y] = pt(r1 + (r2 - r1) * v, a1 + (a2 - a1) * (0.06 + 0.88 * u));
              const sx = x < C.x ? 10 : 750, sy = 530;
              d.setAttribute("cx", sx + (x - sx) * fly); d.setAttribute("cy", sy + (y - sy) * fly);
            });
            const am = (a1 + a2) / 2, [lx, ly] = pt(S.lr, am);
            S.lbl.setAttribute("x", lx); S.lbl.setAttribute("y", ly + 7);
          }
          SEC.forEach(S => render(S, 0));
          async function seat(fam, snd) {
            s.show(layers[fam], "fade"); snd();
            const ss = SEC.filter(S => S.fam === fam);
            await s.tween({ from: 0, to: 1, dur: 900, ease: "out", update: p => ss.forEach(S => render(S, p)) });
            ss.forEach(S => s.show(S.lbl, "pop"));
          }
          let mode = "AM";
          const info = s.h("p", { class: "small" }, "");
          const INFO = {
            AM: "Heute am häufigsten: Beide Geigen-Gruppen sitzen links nebeneinander, Bratschen und Celli rechts. Der Dirigent Leopold Stokowski hat das als Erster so gemacht.",
            DE: "Die 2. Violinen sitzen rechts – gegenüber den 1. Violinen. Die Kontrabässe stehen links hinten. So war es bis Anfang des 20. Jahrhunderts üblich.",
          };
          const bAM = s.h("button", { class: "btn solid", onclick: () => setMode("AM") }, "Amerikanische Aufstellung");
          const bDE = s.h("button", { class: "btn", onclick: () => setMode("DE") }, "Deutsche Aufstellung");
          function setMode(m, sound = true) {
            mode = m; bAM.classList.toggle("solid", m === "AM"); bDE.classList.toggle("solid", m === "DE"); info.textContent = INFO[m];
            const T = m === "AM" ? AM : DE;
            const ss = SEC.filter(S => T[S.k]), from = ss.map(S => S.p.slice());
            if (sound) { s.sfx.whoosh(); play(s, "geige", 67, 0.6, 0.2); play(s, "cello", 43, 0.8, 0.2); }
            s.tween({ from: 0, to: 1, dur: 900, ease: "inOut", update: p => ss.forEach((S, i) => { S.p = from[i].map((v, j) => v + (T[S.k][j] - v) * p); render(S); }) });
          }
          info.textContent = INFO.AM;
          const switchCard = s.h("div", { class: "card later", style: { padding: "12px 16px" } }, s.h("span", { class: "exlabel" }, "Zwei Sitzpläne"),
            s.h("div", { class: "stack", style: { gap: "8px" } }, bAM, bDE), s.h("div", { style: { marginTop: "10px" } }, info));
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"), s.h("p", { class: "small" }, "Wie der Sitzplan in deiner Klasse: Im Schulorchester und im Blasorchester hat auch jeder seinen festen Platz."));
          const merk = s.h("p", { class: "t" }, "Leise Instrumente sitzen ", s.h("b", null, "vorne"), ", laute ", s.h("b", null, "hinten"), ".");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "760px 1fr", gap: "20px", height: "100%" } }, svg,
            s.h("div", { class: "stack", style: { gap: "12px" } }, merk, switchCard, life)));
          s.step(async () => { await seat("str", () => { play(s, "cello", 36, 1.2); play(s, "bratsche", 55, 1.2); play(s, "geige", 64, 1.1); play(s, "geige", 72, 1.1); }); });
          s.step(async () => { await seat("holz", () => seq(s, "floete", [[76, 1], [79, 1], [84, 2]], 200)); });
          s.step(async () => { await seat("blech", () => { seq(s, "trompete", [[67, 1], [72, 1], [76, 2]], 200); play(s, "tuba", 36, 1); }); });
          s.step(async () => { await seat("schlag", () => { play(s, "pauke", 43, 1); play(s, "pauke", 38, 1, 0.4); play(s, "becken", 0, 0, 0.8); }); });
          s.step(async () => { s.show(switchCard, "left"); await s.wait(400); setMode("DE"); s.say("In der deutschen Aufstellung sitzen sich die beiden Geigen-Gruppen gegenüber."); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* ---------- 11 ---------- */
      {
        title: "Der Dirigent",
        say: "Der Dirigent zeigt mit dem Taktstock das Tempo, gibt Einsätze und zeigt, wie laut oder leise gespielt wird.",
        build(s) {
          const svg = s.svg(500, 520);
          const P = [[250, 420], [130, 330], [380, 330], [260, 170]]; // beats 1..4
          const ctrl = (a, b) => [(a[0] + b[0]) / 2, Math.max(a[1], b[1]) + 50];
          const pathD = [3, 0, 1, 2].map((from, i) => { const a = P[from], b = P[(from + 1) % 4], c = ctrl(a, b); return (i ? "" : `M${a[0]},${a[1]} `) + `Q${c[0]},${c[1]} ${b[0]},${b[1]}`; }).join(" ");
          const fig = s.el("g");
          fig.append(s.el("circle", { cx: 250, cy: 80, r: 34, fill: "#8a94a6" }),
            s.el("path", { d: "M200,200 Q250,120 300,200 L310,500 L190,500 Z", fill: "#8a94a6", opacity: 0.35 }));
          const pat = s.el("path", { d: pathD, fill: "none", stroke: "#dc2626", "stroke-width": 3, "stroke-dasharray": "8 8", opacity: 0.6 });
          const nums = P.map((p, i) => txt(s, p[0] + (i === 1 ? -30 : i === 2 ? 30 : 0), p[1] + (i === 0 ? 40 : i === 3 ? -18 : 8), String(i + 1), { "font-size": 26, fill: "#dc2626" }));
          const arm = s.el("line", { x1: 290, y1: 190, x2: 250, y2: 420, stroke: "#1b2740", "stroke-width": 10, "stroke-linecap": "round" });
          const baton = s.el("line", { x1: 250, y1: 420, x2: 240, y2: 400, stroke: "#fff", "stroke-width": 4, "stroke-linecap": "round" });
          const tip = s.el("circle", { cx: 250, cy: 420, r: 10, fill: "#ffd94a", stroke: "#1b2740", "stroke-width": 2 });
          const patG = s.el("g", { class: "later" }); patG.append(pat, ...nums);
          svg.append(fig, patG, arm, baton, tip);
          let bpm = 90, size = 1, playing = false, phase = 0, lastBeat = -1;
          const MEL = [[67, 48], [64, 48], [65, 50], [62, 43], [64, 48], [60, 45], [62, 43], [67, 43]];
          const segs = [[3, 0], [0, 1], [1, 2], [2, 3]];
          const bez = (a, c, b, u) => [(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1]];
          const at = ph => {
            const k = Math.floor(ph) % 4, u = ph - Math.floor(ph), [f, t] = segs[(k + 1) % 4];
            const a = P[f], b = P[t], c = ctrl(a, b), e = 1 - Math.pow(1 - u, 2);
            const [x, y] = bez(a, c, b, e);
            return [250 + (x - 250) * size, 300 + (y - 300) * size];
          };
          s.loop((t, dt) => {
            if (playing) {
              phase += Math.min(dt, 0.1) * bpm / 60;
              const beat = Math.floor(phase);
              if (beat !== lastBeat) {
                lastBeat = beat; const b = beat % 4, [mel, bass] = MEL[beat % 8];
                s.sfx.tone(b === 0 ? 1320 : 880, 0.05, "sine", 0.12 * size);
                play(s, "geige", mel, 60 / bpm * 0.85, 0, { vol: 0.5 + 0.5 * size });
                if (b === 0 || b === 2) play(s, "cello", bass, 60 / bpm * 1.7, 0, { vol: 0.5 + 0.5 * size });
                nums.forEach((n, i) => n.setAttribute("font-size", i === b ? 34 : 26));
              }
            }
            const [x, y] = at(phase);
            tip.setAttribute("cx", x); tip.setAttribute("cy", y);
            arm.setAttribute("x2", x); arm.setAttribute("y2", y);
            baton.setAttribute("x1", x); baton.setAttribute("y1", y); baton.setAttribute("x2", x - 10); baton.setAttribute("y2", y - 22);
          });
          const btn = s.h("button", { class: "btn solid", onclick: () => toggle() }, "Orchester spielt");
          function toggle(v) { playing = v == null ? !playing : v; btn.textContent = playing ? "Stopp" : "Orchester spielt"; if (playing) phase = Math.floor(phase); }
          const tempo = s.slider({ label: "Tempo", min: 50, max: 160, value: 90, fmt: v => v + " pro Minute", onInput: v => { bpm = v; } });
          const vol = s.slider({ label: "Bewegung", min: 3, max: 10, value: 10, fmt: v => (v < 6 ? "klein: leise" : "groß: laut"), onInput: v => { size = v / 10; } });
          const mk = (h, t) => s.h("div", { class: "ex later", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, h), s.h("p", { class: "small" }, t));
          const e1 = mk("Tempo", "Mit dem Taktstock schlägt er den Takt – hier einen 4/4-Takt.");
          const e2 = mk("Einsätze und laut/leise", "Er zeigt, wer wann einsetzt. Große Bewegung heißt laut, kleine heißt leise.");
          const e3 = mk("Partitur", "Er liest die Partitur: Alle Stimmen des Orchesters stehen darin untereinander.");
          const life = s.h("div", { class: "life later", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, "Im Alltag"), s.h("p", { class: "small" }, "Chorleiterin, Musiklehrer vor dem Schulorchester, Kapellmeister der Blaskapelle."));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "500px 1fr", gap: "24px", height: "100%" } }, svg,
            s.h("div", { class: "stack", style: { gap: "10px" } }, s.h("div", { class: "row" }, btn), s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" } }, tempo, vol), e1, e2, e3, life)));
          s.step(async () => { s.show(patG, "fade"); s.show(e1, "left"); toggle(true); s.say("Eins, zwei, drei, vier. So sieht ein Vierertakt aus."); });
          s.step(async () => { s.show(e2, "left"); vol.set(4); await s.wait(2600); if (s.alive) vol.set(10); });
          s.step(async () => { s.show(e3, "left"); s.sfx.scribble(); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* ---------- 12 ---------- */
      {
        title: "Berliner Philharmoniker",
        say: "Die Berliner Philharmoniker sind eines der berühmtesten Orchester der Welt. Sie spielen in der Philharmonie am Kulturforum.",
        build(s) {
          const svg = s.svg(500, 560);
          const house = s.el("g");
          house.append(s.el("path", { d: "M20,215 L20,180 L90,112 L170,150 L262,44 L360,128 L430,96 L480,180 L480,215 Z", fill: "#f0c419", stroke: "#b8900a", "stroke-width": 3 }),
            s.el("path", { d: "M262,44 L262,215 M90,112 L110,215 M430,96 L410,215", stroke: "#d9ab0d", "stroke-width": 2, fill: "none" }),
            s.el("rect", { x: 10, y: 215, width: 480, height: 10, fill: "#b8b8b8" }));
          for (let i = 0; i < 10; i++) house.append(s.el("rect", { x: 40 + i * 44, y: 190, width: 20, height: 25, fill: "#fff8d6", opacity: 0.8 }));
          const plan = s.el("g", { class: "later" }), terr = [];
          const cx = 250, cy = 400;
          plan.append(s.el("ellipse", { cx, cy, rx: 200, ry: 140, fill: "#f6efe6", stroke: "#d9c9b0", "stroke-width": 2 }));
          for (let i = 0; i < 12; i++) {
            const a = (i / 12) * Math.PI * 2 + 0.2, r = i % 2 ? 150 : 115, w = i % 2 ? 46 : 54;
            const x = cx + Math.cos(a) * r * 1.2, y = cy + Math.sin(a) * r * 0.8;
            const g = s.el("g", { class: "later" });
            g.append(s.el("rect", { x: x - w / 2, y: y - 16, width: w, height: 32, rx: 6, fill: i % 3 ? "#e9a070" : "#c46a32", transform: `rotate(${a * 180 / Math.PI + 90} ${x} ${y})` }));
            terr.push(g); plan.append(g);
          }
          const pod = s.el("ellipse", { cx, cy, rx: 62, ry: 40, fill: "#dc2626" });
          plan.append(pod, txt(s, cx, cy + 7, "Orchester", { fill: "#fff", "font-size": 19 }));
          svg.append(house, txt(s, 250, 256, "Die Philharmonie (von außen)", { "font-size": 19, fill: "#5d6678" }), plan);
          const capPlan = txt(s, 250, 556, "von oben: Zuhörer ringsum – wie auf einem Weinberg", { "font-size": 19, fill: "#5d6678", class: "later" });
          svg.append(capPlan);
          const year = s.h("span", { class: "big mono", style: { color: "var(--unit)" } }, "1882");
          const seats = s.h("b", { class: "mono" }, "2.250");
          const f1 = s.h("div", { class: "card", style: { padding: "12px 18px" } }, s.h("span", { class: "exlabel" }, "Das Orchester"),
            s.h("div", { class: "row", style: { gap: "14px", flexWrap: "nowrap" } }, year, s.h("p", { class: "small" }, "gegründet. Heute gehört es zu den besten Orchestern der Welt.")));
          const f2 = s.h("div", { class: "card later", style: { padding: "12px 18px" } }, s.h("span", { class: "exlabel" }, "Der Konzertsaal"),
            s.h("p", { class: "small" }, "Architekt Hans Scharoun, eröffnet am 15. Oktober 1963. Der Große Saal hat ", seats, " Plätze. Das Orchester sitzt in der Mitte."));
          const f3 = s.h("div", { class: "card later", style: { padding: "12px 18px" } }, s.h("span", { class: "exlabel" }, "Der Chefdirigent"),
            s.h("p", { class: "small" }, "Kirill Petrenko, seit 2019. Die Musikerinnen und Musiker wählen ihren Chefdirigenten selbst."));
          const life = s.h("div", { class: "life later", style: { padding: "12px 18px" } }, s.h("span", { class: "exlabel" }, "Im Alltag"),
            s.h("p", { class: "small" }, "Am Kulturforum beim Potsdamer Platz. Weil das Orchester in der Mitte sitzt wie in einer Manege, sagten Berliner scherzhaft „Zirkus Karajani“ – nach dem Dirigenten Herbert von Karajan."));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "500px 1fr", gap: "24px", height: "100%" } }, svg,
            s.h("div", { class: "stack", style: { gap: "12px" } }, f1, f2, f3, life)));
          s.show(house, "up"); s.sfx.whoosh();
          play(s, "cello", 48, 1.6); play(s, "bratsche", 55, 1.6, 0.1); play(s, "geige", 64, 1.5, 0.2); play(s, "horn", 60, 1.4, 0.3);
          s.tween({ from: 1800, to: 1882, dur: 1200, ease: "out", update: v => { year.textContent = String(Math.round(v)); } });
          s.step(async () => {
            s.show(plan, "fade"); s.show(f2, "left"); await s.show(pod, "pop");
            for (let i = 0; i < terr.length; i++) { if (!s.alive) return; s.show(terr[i], "pop"); s.sfx.count(i); await s.wait(90); }
            s.show(capPlan, "fade");
            s.tween({ from: 0, to: 2250, dur: 1200, ease: "out", update: v => { seats.textContent = s.fmt(Math.round(v)); } });
          });
          s.step(async () => { s.show(f3, "left"); s.sfx.ding(); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* ---------- 13 ---------- */
      {
        title: "Welches Instrument passt zu mir?",
        say: "Am Ende der fünften Klasse wählst du ein Instrument. Hier sind alle zehn. Tippe sie an, hör sie dir an und vergleiche.",
        build(s) {
          const L = [
            { k: "geige", fam: "str", icon: () => place(s, gStr(s, false), 32, 2, 0.6), size: "klein: Korpus ca. 36 cm, liegt unter dem Kinn", how: "Bogen streichen oder zupfen, Finger greifen auf den Saiten", klang: "hell und singend", rolle: "spielt oft die Melodie" },
            { k: "bratsche", fam: "str", icon: () => place(s, gStr(s, false, "#9a5418"), 32, 1, 0.62), size: "etwas größer: Korpus ca. 41 cm, unter dem Kinn", how: "Bogen streichen oder zupfen, Finger greifen", klang: "warm, etwas dunkler als die Geige", rolle: "Mittelstimme – füllt die Harmonie" },
            { k: "cello", fam: "str", icon: () => place(s, gStr(s, true, "#8a4a20"), 32, 1, 0.55), size: "groß: ca. 1,20 m, du spielst im Sitzen", how: "Bogen streichen oder zupfen, Finger greifen", klang: "warm, tief und singend", rolle: "Bass und schöne Melodien" },
            { k: "klarinette", fam: "holz", icon: () => place(s, gKlarinette(s), 32, 2, 0.6), size: "etwa 66 cm lang, meist aus Holz", how: "Ein Rohrblatt schwingt, Finger auf Klappen und Löchern", klang: "weich und rund, sehr leise bis laut", rolle: "Melodie, auch schnelle Läufe" },
            { k: "altsax", fam: "holz", icon: () => place(s, gSax(s), 44, 2, 0.6), size: "aus Messing, hängt an einem Gurt", how: "Ein Rohrblatt schwingt, Finger auf Klappen", klang: "kräftig und wandelbar", rolle: "Melodie und Soli, auch im Jazz" },
            { k: "trompete", fam: "blech", icon: () => place(s, gTrompete(s), 2, 20, 0.5), size: "handlich, Rohr ca. 1,30 m lang", how: "Lippen summen, 3 Ventile", klang: "strahlend und hell", rolle: "Melodie und Fanfaren" },
            { k: "horn", fam: "blech", icon: () => place(s, gHorn(s), 4, 4, 0.8), size: "Rohr ca. 3,70 m, rund aufgewickelt", how: "Lippen summen, Ventile, rechte Hand im Schalltrichter", klang: "weich und rund", rolle: "Mittelstimme und Melodie" },
            { k: "posaune", fam: "blech", icon: () => place(s, gPosaune(s).g, -2, 26, 0.42), size: "lang, mit einem Zug zum Schieben", how: "Lippen summen, Zug mit 7 Positionen", klang: "kräftig, kann gleiten", rolle: "Mittel- und Bassstimme" },
            { k: "euphonium", fam: "blech", icon: () => place(s, gTuba(s, true), 32, 2, 0.6), size: "mittelgroß, Rohr ca. 2,75 m", how: "Lippen summen, meist 4 Ventile", klang: "warm und weich", rolle: "Tenor-Melodie, wie das Cello im Orchester" },
            { k: "tuba", fam: "blech", icon: () => place(s, gTuba(s, false), 32, 2, 0.6), size: "sehr groß, Rohr ca. 4 m (F-Tuba)", how: "Lippen summen, Ventile, viel Luft", klang: "tief und voll", rolle: "Bass – das Fundament" },
          ];
          const FN = { str: "Streichinstrument", holz: "Holzblasinstrument", blech: "Blechblasinstrument" };
          const btns = L.map(d => {
            const ic = s.svg(64, 64, { width: 88, height: 88 }); ic.append(d.icon());
            const b = s.h("button", { class: "btn later", style: { flexDirection: "column", height: "136px", gap: "4px", padding: "6px 4px", borderColor: FAM[d.fam], color: "var(--ink)" }, onclick: () => pick(d) },
              ic, s.h("span", { style: { fontSize: "19px" } }, d.k === "altsax" ? "Saxophon" : INST[d.k].n));
            d.b = b; return b;
          });
          const nameEl = s.h("p", { class: "h2" }, ""), famEl = s.h("span", { class: "chip" }, "");
          const rows = {};
          const tbl = s.h("div", { style: { display: "grid", gridTemplateColumns: "210px 1fr", rowGap: "8px", columnGap: "14px", alignItems: "baseline" } },
            [["size", "Größe"], ["how", "So machst du den Ton"], ["klang", "Klang"], ["rolle", "Typische Rolle"]].map(([k, h]) => { rows[k] = s.h("p", { class: "t", style: { fontSize: "22px" } }, ""); return [s.h("p", { class: "small pencil" }, h), rows[k]]; }));
          let cur = null;
          const again = s.h("button", { class: "btn solid", onclick: () => cur && demo(s, cur.k) }, "Nochmal hören");
          function pick(d) {
            cur = d; L.forEach(x => x.b.classList.toggle("solid", x === d)); L.forEach(x => { x.b.style.color = x === d ? "#fff" : "var(--ink)"; x.b.style.background = x === d ? FAM[x.fam] : ""; });
            nameEl.textContent = d.k === "altsax" ? "Saxophon" : INST[d.k].n; nameEl.style.color = FAM[d.fam]; famEl.textContent = FN[d.fam];
            rows.size.textContent = d.size; rows.how.textContent = d.how; rows.klang.textContent = d.klang; rows.rolle.textContent = d.rolle;
            demo(s, d.k);
          }
          const card = s.h("div", { class: "card", style: { padding: "14px 20px" } },
            s.h("div", { class: "row", style: { justifyContent: "space-between", marginBottom: "10px" } }, s.h("div", { class: "row", style: { gap: "14px" } }, nameEl, famEl), again), tbl);
          const note = s.h("p", { class: "small pencil later" }, "Kein Instrument ist besser als ein anderes. Hör genau hin, probier in der Schule aus – und nimm das, was dir Spaß macht.");
          s.add(s.h("div", { class: "stack", style: { gap: "12px" } }, s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: "10px" } }, btns), card, note));
          const groups = [["str", "Drei Streicher: Geige, Bratsche, Cello."], ["holz", "Zwei Holzbläser: Klarinette und Saxophon."], ["blech", "Fünf Blechbläser: Trompete, Horn, Posaune, Euphonium und Tuba."]];
          s.show(btns.slice(0, 3), "pop"); pick(L[0]);
          s.step(async () => { const ds = L.filter(d => d.fam === "holz"); s.show(ds.map(d => d.b), "pop"); pick(ds[0]); s.say(groups[1][1]); });
          s.step(async () => { const ds = L.filter(d => d.fam === "blech"); s.show(ds.map(d => d.b), "pop"); pick(ds[0]); s.say(groups[2][1]); });
          s.step(async () => { s.show(note, "up"); s.sfx.ding(); });
        },
      },
      /* ---------- 14 ---------- */
      {
        title: "Im Alltag: Orchester-Klänge",
        say: "Instrumente des Orchesters hörst du überall: im Stadion, im Jazz-Club, im Kino und auf der Straße.",
        build(s) {
          const scene = k => {
            const v = s.svg(170, 120);
            if (k === "stadion") {
              v.append(s.el("ellipse", { cx: 85, cy: 70, rx: 80, ry: 46, fill: "#9aa6b2" }), s.el("ellipse", { cx: 85, cy: 72, rx: 60, ry: 30, fill: "#3a9a4a" }),
                s.el("line", { x1: 85, y1: 42, x2: 85, y2: 102, stroke: "#fff", "stroke-width": 2 }), s.el("circle", { cx: 85, cy: 72, r: 10, fill: "none", stroke: "#fff", "stroke-width": 2 }),
                place(s, gTrompete(s), 20, -2, 0.55));
            } else if (k === "jazz") {
              v.append(s.el("rect", { x: 0, y: 0, width: 170, height: 120, rx: 10, fill: "#2a2440" }), s.el("circle", { cx: 130, cy: 24, r: 14, fill: "#ffd94a", opacity: 0.7 }),
                place(s, gSax(s), 70, 8, 1.0), place(s, gStr(s, true, "#8a4a20"), 130, 40, 0.68));
            } else if (k === "film") {
              v.append(s.el("rect", { x: 5, y: 8, width: 160, height: 90, rx: 6, fill: "#1b2740" }), s.el("rect", { x: 15, y: 18, width: 140, height: 70, fill: "#5aa0e0" }),
                s.el("path", { d: "M15,88 L60,50 L90,72 L120,40 L155,88 Z", fill: "#2f7d32" }), s.el("circle", { cx: 130, cy: 34, r: 8, fill: "#ffd94a" }));
              for (let i = 0; i < 9; i++) v.append(s.el("rect", { x: 10 + i * 18, y: 104, width: 10, height: 10, fill: "#1b2740" }));
            } else {
              v.append(s.el("line", { x1: 120, y1: 116, x2: 120, y2: 8, stroke: "#9aa6b2", "stroke-width": 6 }), s.el("circle", { cx: 120, cy: 40, r: 13, fill: "#9aa6b2" }),
                s.el("line", { x1: 120, y1: 26, x2: 120, y2: 2, stroke: "#dc2626", "stroke-width": 2 }),
                s.el("circle", { cx: 40, cy: 50, r: 9, fill: "#1b2740" }), s.el("path", { d: "M32,60 L48,60 L52,100 L28,100 Z", fill: "#1d5bd0" }),
                place(s, gStr(s, false), 60, 46, 0.32), s.el("rect", { x: 0, y: 108, width: 170, height: 12, fill: "#c8d3de" }));
            }
            return v;
          };
          const T = [
            { k: "stadion", h: "Fußballstadion", t: "Eine Blaskapelle mit Trompeten, Posaunen und großer Trommel heizt die Fans an. Blech ist laut genug für ein ganzes Stadion.",
              snd: () => { seq(s, "trompete", [[67, 0.5], [67, 0.5], [67, 0.5], [72, 1.5], [67, 0.5], [72, 0.5], [76, 2]], 150); seq(s, "posaune", [[48, 2], [55, 2], [48, 2]], 150); [0, 0.8, 1.6, 2.4].forEach(w => play(s, "grosse", 0, 0, w)); } },
            { k: "jazz", h: "Jazz", t: "Ein Saxophon spielt ein Solo, darunter zupft der Kontrabass. Becken geben den Swing.",
              snd: () => { seq(s, "saxophon", [[65, 0.66], [68, 0.34], [69, 0.66], [72, 0.34], [75, 1], [72, 0.5], [70, 0.5], [68, 0.66], [65, 1.34]], 150); seq(s, "pizz", [[41, 1], [45, 1], [48, 1], [50, 1], [53, 1], [50, 1]], 150); [0, 0.8, 1.6].forEach(w => play(s, "triangel", 0, 0, w + 9)); [0.4, 1.2, 2.0].forEach(w => play(s, "trommel", 0, 0, w)); } },
            { k: "film", h: "Filmmusik", t: "Zu vielen Kinofilmen spielt ein großes Orchester. Streicher für Gefühle, Hörner und Pauken für Heldenmomente.",
              snd: () => { play(s, "cello", 36, 2.2); play(s, "bratsche", 55, 2.2); play(s, "geige", 64, 2.2); seq(s, "horn", [[55, 1], [62, 1], [60, 0.5], [59, 0.5], [57, 0.5], [67, 2]], 110, 0.3); [0, 0.1, 0.2, 0.3, 0.4, 0.5].forEach(w => play(s, "pauke", 43, 0.3, 2 + w, {})); } },
            { k: "alex", h: "Straßenmusik am Alexanderplatz", t: "Zwischen U-Bahn und Fernsehturm spielen oft Straßenmusiker – mit Geige, Saxophon oder Trompete.",
              snd: () => { seq(s, "geige", [[69, 1], [71, 0.5], [72, 0.5], [74, 1], [72, 1], [71, 0.5], [69, 0.5], [68, 1], [69, 2]], 160); seq(s, "pizz", [[45, 2], [52, 2], [40, 2], [45, 2]], 160); } },
          ];
          const tiles = T.map(d => {
            const v = scene(d.k);
            const tile = s.h("div", { class: "card later", style: { display: "grid", gridTemplateColumns: "170px 1fr", gap: "16px", alignItems: "center", padding: "14px 18px" } }, v,
              s.h("div", { class: "stack", style: { gap: "8px" } }, s.h("p", { class: "h2", style: { fontSize: "24px" } }, d.h), s.h("p", { class: "small" }, d.t),
                s.h("button", { class: "btn", style: { alignSelf: "flex-start" }, onclick: () => { d.snd(); bounce(s, v); } }, "Anhören")));
            d.tile = tile; return tile;
          });
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%" } },
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", flex: "1" } }, tiles),
            s.h("p", { class: "small pencil" }, "Alle Melodien hier sind selbst ausgedacht und am Computer nachgebaut.")));
          T.forEach((d, i) => { if (i === 0) { s.show(d.tile, "up"); d.snd(); } else s.step(async () => { s.show(d.tile, "up"); d.snd(); s.say(d.h); }); });
        },
      },
    ],
  });
})();
