/* Kapitel 3 – Rhythmus und Takt (Berliner Rahmenlehrplan Musik, Klasse 5–6)
   Ergänzt 2026-10-05: „Musik und Bewegung“ (Puls gehen, Tänze und Taktarten, Choreografie in Achtern, Tänze der Welt) */
(() => {
  "use strict";
  const C = "#7b4fd6", SOFT = "#ece5fb", RED = "#dc3b2a", ORANGE = "#ee7a1a", INK = "#1b2740", PENCIL = "#5d6678", GREEN = "#138a5a", BLUE = "#1d5bd0";
  const semiHz = n => 523.25 * Math.pow(2, n / 12);

  /* ---------- recorded instruments (drum kit, body percussion, metronome, piano) – s.sound respects mute + check mode ---------- */
  const PS = [[36, "piano-c2"], [40, "piano-e2"], [45, "piano-a2"], [48, "piano-c3"], [52, "piano-e3"], [57, "piano-a3"], [60, "piano-c4"], [64, "piano-e4"], [69, "piano-a4"], [72, "piano-c5"], [76, "piano-e5"], [81, "piano-a5"], [84, "piano-c6"]];
  const KIT_IDS = ["kick", "snare", "hihat", "clap", "snap", "stomp", "thigh", "metronome", "heartbeat", "footsteps"].concat(PS.map(p => p[1]));
  function kit(s) {
    const f = s.sfx, snd = (id, w, o = {}) => { if (s.alive) s.sound(id, Object.assign({ when: w }, o)); };
    s.preload(KIT_IDS);
    return {
      kick: (w = 0, v = 0.7) => snd("kick", w, { vol: Math.min(1, v * 1.25) }),
      snare: (w = 0) => snd("snare", w, { vol: .75 }),
      hat: (w = 0) => snd("hihat", w, { vol: .5 }),
      click: (w = 0, acc = false) => snd("metronome", w, acc ? { vol: 1, rate: 1.3 } : { vol: .6 }),
      clap: (w = 0, v = 0.28) => snd("clap", w, { vol: Math.min(1, v * 2.6) }),
      stomp: (w = 0) => snd("stomp", w, { dur: .45 }),
      pat: (w = 0) => snd("thigh", w),
      snap: (w = 0) => snd("snap", w),
      heart: (w = 0) => snd("heartbeat", w, { dur: .6 }),
      step: (w = 0) => snd("footsteps", w, { dur: .26 }),
      clock: (w = 0, hi = true) => { f.tone(hi ? 2300 : 1700, 0.035, "square", 0.08, w); },
      /** piano note, n = semitones relative to c″ (C5) */
      note: (n, dur = 0.3, w = 0, v = 0.22) => {
        const m = 72 + n; let best = PS[0];
        for (const p of PS) if (Math.abs(p[0] - m) < Math.abs(best[0] - m)) best = p;
        snd(best[1], w, { rate: Math.pow(2, (m - best[0]) / 12), vol: Math.min(1, v * 3.2), dur: Math.max(.25, dur + .35) });
      },
    };
  }

  /* ---------- look-ahead scheduler on the AudioContext clock (sample-exact rhythms + synced visuals) ---------- */
  function Player(s) {
    let ac = null, queue = [], evs = [], idx = 0, t0 = 0, spb = 0.6, len = 4, looping = false, on = false, cancel = null, onEnd = null;
    const p = {
      get playing() { return on; },
      play(events, { bpm = 100, length = null, loop = false, end = null } = {}) {
        p.stop();
        if (s.fast) { end && end(); return; }
        ac = s.sfx.unlock(); if (!ac) return;
        evs = events.slice().sort((a, b) => a.b - b.b); spb = 60 / bpm;
        len = length != null ? length : (evs.length ? evs[evs.length - 1].b + (evs[evs.length - 1].d || 1) : 4);
        looping = loop; onEnd = end; idx = 0; t0 = ac.currentTime + 0.08; on = true; queue = [];
        cancel = s.loop(() => {
          if (!on) return false;
          const now = ac.currentTime;
          for (let guard = 0; guard < 64; guard++) {
            if (idx >= evs.length) { if (looping && evs.length) { idx = 0; t0 += len * spb; } else break; }
            const e = evs[idx], at = t0 + e.b * spb;
            if (at > now + 0.12) break;
            if (e.snd) e.snd(Math.max(0, at - now), e.d * spb);
            queue.push({ at, e }); idx++;
          }
          while (queue.length && queue[0].at <= now) { const q = queue.shift(); q.e.vis && q.e.vis(); }
          if (!looping && idx >= evs.length && !queue.length && now > t0 + len * spb) { on = false; onEnd && onEnd(); return false; }
        });
      },
      setBpm(b) {
        if (on && ac) { const now = ac.currentTime, pos = (now - t0) / spb; spb = 60 / b; t0 = now - pos * spb; } else spb = 60 / b;
      },
      stop() { const was = on; on = false; if (cancel) cancel(); cancel = null; queue = []; if (was && onEnd) { const f = onEnd; onEnd = null; f(true); } },
    };
    s.onLeave(() => { on = false; });
    return p;
  }

  /* ---------- notation drawn by hand in SVG ---------- */
  // v = 1 Ganze, 2 Halbe, 4 Viertel, 8 Achtel, 16 Sechzehntel; k = size factor; down = stem down
  function note(s, x, y, v, { k = 1, color = INK, dot = false, down = false, flags = true } = {}) {
    const g = s.el("g");
    const hollow = v <= 2, sw = 2.6 * k;
    g.append(s.el("ellipse", { cx: x, cy: y, rx: 9.5 * k, ry: 7 * k, transform: `rotate(-22 ${x} ${y})`, fill: hollow ? "#fff" : color, stroke: color, "stroke-width": hollow ? sw : 1 }));
    if (v >= 2) {
      const sx = down ? x - 8.6 * k : x + 8.6 * k, sy1 = down ? y + 2 * k : y - 2 * k, sy2 = down ? y + 42 * k : y - 42 * k;
      g.append(s.el("line", { x1: sx, y1: sy1, x2: sx, y2: sy2, stroke: color, "stroke-width": sw, "stroke-linecap": "round" }));
      if (flags && v >= 8) for (let i = 0; i < (v >= 16 ? 2 : 1); i++) {
        const fy = sy2 + (down ? -1 : 1) * i * 10 * k, dir = down ? -1 : 1;
        g.append(s.el("path", { d: `M${sx} ${fy} C${sx + 2 * k} ${fy + dir * 12 * k} ${sx + 14 * k} ${fy + dir * 15 * k} ${sx + 11 * k} ${fy + dir * 30 * k}`, fill: "none", stroke: color, "stroke-width": sw, "stroke-linecap": "round" }));
      }
    }
    if (dot) g.append(s.el("circle", { cx: x + 17 * k, cy: y - 2 * k, r: 3.4 * k, fill: color }));
    return g;
  }
  // beamed group of notes, stems up: xs = head positions, levels = 1 (Achtel) or 2 (Sechzehntel)
  function beamed(s, xs, y, levels, { k = 1, color = INK } = {}) {
    const g = s.el("g");
    xs.forEach(x => g.append(note(s, x, y, 4, { k, color })));
    const top = y - 42 * k, x1 = xs[0] + 8.6 * k, x2 = xs[xs.length - 1] + 8.6 * k;
    for (let i = 0; i < levels; i++) g.append(s.el("rect", { x: x1 - 1.3 * k, y: top - 1 * k + i * 9 * k, width: x2 - x1 + 2.6 * k, height: 6 * k, fill: color }));
    return g;
  }
  // rests on a 5-line staff whose middle line is at ym with line distance gap
  function rest(s, x, ym, v, { gap = 12, color = INK } = {}) {
    const g = s.el("g"), q = gap / 12;
    if (v === 1) g.append(s.el("rect", { x: x - 11 * q, y: ym - gap, width: 22 * q, height: 7 * q, fill: color }));
    else if (v === 2) g.append(s.el("rect", { x: x - 11 * q, y: ym - 7 * q, width: 22 * q, height: 7 * q, fill: color }));
    else if (v === 4) g.append(s.el("path", { d: `M${x - 4 * q} ${ym - 22 * q} L${x + 6 * q} ${ym - 10 * q} L${x - 3 * q} ${ym} L${x + 6 * q} ${ym + 10 * q} C${x - 6 * q} ${ym + 5 * q} ${x - 8 * q} ${ym + 15 * q} ${x + 1 * q} ${ym + 21 * q}`, fill: "none", stroke: color, "stroke-width": 4 * q, "stroke-linejoin": "round", "stroke-linecap": "round" }));
    else {
      const n = v === 8 ? 1 : 2;
      g.append(s.el("path", { d: `M${x + 7 * q} ${ym - 10 * q} L${x - 3 * q} ${ym + (n === 1 ? 16 : 22) * q}`, stroke: color, "stroke-width": 2.6 * q, "stroke-linecap": "round" }));
      for (let i = 0; i < n; i++) {
        const yy = ym - 10 * q + i * 11 * q, xx = x + 7 * q - i * 4 * q;
        g.append(s.el("path", { d: `M${xx - 11 * q} ${yy + 1 * q} Q${xx - 4 * q} ${yy + 5 * q} ${xx} ${yy}`, fill: "none", stroke: color, "stroke-width": 2.6 * q }));
        g.append(s.el("circle", { cx: xx - 11 * q, cy: yy - 1 * q, r: 4 * q, fill: color }));
      }
    }
    return g;
  }
  function staff(s, svg, x1, x2, yTop, gap) {
    const g = s.el("g");
    for (let i = 0; i < 5; i++) g.append(s.el("line", { x1, x2, y1: yTop + i * gap, y2: yTop + i * gap, stroke: INK, "stroke-width": 1.6 }));
    svg.append(g);
    return { g, y: st => yTop + 4 * gap - st * gap / 2, mid: yTop + 2 * gap };
  }
  function timesig(s, x, yTop, gap, top, bot) {
    const g = s.el("g", { "data-overlap-ok": "" });
    const fs = gap * 2.1;
    g.append(s.el("text", { x, y: yTop + gap * 1.72, "text-anchor": "middle", "font-size": fs, "font-weight": 800, fill: INK, "font-family": "Bricolage Grotesque, sans-serif", text: String(top) }));
    g.append(s.el("text", { x, y: yTop + gap * 3.72, "text-anchor": "middle", "font-size": fs, "font-weight": 800, fill: INK, "font-family": "Bricolage Grotesque, sans-serif", text: String(bot) }));
    return g;
  }
  // simple hand-drawn treble clef (G line = staff line 2 from bottom)
  function clef(s, x, yG, gap) {
    const q = gap / 12;
    const P = (dx, dy) => `${x + dx * q} ${yG + dy * q}`;
    return s.el("path", {
      d: `M${P(4, 40)} C${P(-6, 44)} ${P(-10, 32)} ${P(-1, 30)} C${P(6, 30)} ${P(7, 38)} ${P(3, 40)} M${P(2, 40)} L${P(6, -40)} C${P(8, -58)} ${P(22, -52)} ${P(14, -34)} C${P(8, -20)} ${P(-14, -10)} ${P(-14, 6)} C${P(-14, 22)} ${P(14, 24)} ${P(16, 8)} C${P(17, -6)} ${P(0, -10)} ${P(-2, 2)} C${P(-3, 10)} ${P(6, 13)} ${P(8, 8)}`,
      fill: "none", stroke: INK, "stroke-width": 3 * q, "stroke-linecap": "round", "stroke-linejoin": "round",
    });
  }
  const btn = (s, label, onclick, solid = false) => s.h("button", { class: "btn" + (solid ? " solid" : ""), onclick }, label);
  const flash = (s, el, attr, from, to, dur = 260) => s.tween({ from, to, dur, ease: "out", update: v => el.setAttribute(attr, v) });

  /* ---------- stick-figure dancer (front view). Hip at local 0/0, feet on y = 70. Pose = hand/foot points + dx/dy/sc/flip ---------- */
  const STAND = { dx: 0, dy: 0, sc: 1, flip: 1, hL: [-30, -6], hR: [30, -6], fL: [-14, 70], fR: [14, 70] };
  const pose = o => Object.assign({}, STAND, { hL: STAND.hL.slice(), hR: STAND.hR.slice(), fL: STAND.fL.slice(), fR: STAND.fR.slice() }, o);
  const ARMS = { up: { hL: [-42, -112], hR: [42, -112] }, high: { hL: [-14, -134], hR: [14, -134] }, clap: { hL: [-3, -62], hR: [3, -62] }, out: { hL: [-62, -58], hR: [62, -58] }, hip: { hL: [-24, -18], hR: [24, -18] } };
  function dancer(s, color, { x = 0, y = 0, k = 1 } = {}) {
    const g = s.el("g"), body = s.el("g");
    const limb = w => s.el("path", { fill: "none", stroke: INK, "stroke-width": w, "stroke-linecap": "round", "stroke-linejoin": "round" });
    const legL = limb(8), legR = limb(8), armL = limb(7), armR = limb(7);
    const torso = s.el("line", { x1: 0, y1: 0, x2: 0, y2: -58, stroke: color, "stroke-width": 20, "stroke-linecap": "round" });
    const head = s.el("circle", { cx: 0, cy: -84, r: 17, fill: "#f6d2b0", stroke: INK, "stroke-width": 3.5 });
    const hair = s.el("path", { d: "M-17,-86 Q-16,-104 0,-103 Q16,-104 17,-86 Q8,-96 0,-95 Q-8,-96 -17,-86 Z", fill: "#4a3222" });
    body.append(legL, legR, torso, armL, armR, head, hair);
    g.append(body);
    let cur = pose({}), tgt = pose({}), speed = 14;
    const draw = p => {
      const sh = -54;
      armL.setAttribute("d", `M-8,${sh} Q${(p.hL[0] - 8) / 2 - 16},${(sh + p.hL[1]) / 2 + 4} ${p.hL[0]},${p.hL[1]}`);
      armR.setAttribute("d", `M8,${sh} Q${(p.hR[0] + 8) / 2 + 16},${(sh + p.hR[1]) / 2 + 4} ${p.hR[0]},${p.hR[1]}`);
      legL.setAttribute("d", `M-7,2 Q${(p.fL[0] - 7) / 2 - 8},${(p.fL[1] + 2) / 2} ${p.fL[0]},${p.fL[1]} l-9,0`);
      legR.setAttribute("d", `M7,2 Q${(p.fR[0] + 7) / 2 + 8},${(p.fR[1] + 2) / 2} ${p.fR[0]},${p.fR[1]} l9,0`);
      const f = Math.abs(p.flip) < 0.08 ? 0.08 * Math.sign(p.flip || 1) : p.flip;
      g.setAttribute("transform", `translate(${x + p.dx * k},${y + p.dy * k}) scale(${f * k * p.sc},${k * p.sc})`);
      hair.setAttribute("opacity", p.flip < 0 ? 1 : 0.95);
      head.setAttribute("fill", p.flip < 0 ? "#4a3222" : "#f6d2b0");
    };
    const mix = (a, b, t) => ({ dx: s.lerp(a.dx, b.dx, t), dy: s.lerp(a.dy, b.dy, t), sc: s.lerp(a.sc, b.sc, t), flip: s.lerp(a.flip, b.flip, t),
      hL: [s.lerp(a.hL[0], b.hL[0], t), s.lerp(a.hL[1], b.hL[1], t)], hR: [s.lerp(a.hR[0], b.hR[0], t), s.lerp(a.hR[1], b.hR[1], t)],
      fL: [s.lerp(a.fL[0], b.fL[0], t), s.lerp(a.fL[1], b.fL[1], t)], fR: [s.lerp(a.fR[0], b.fR[0], t), s.lerp(a.fR[1], b.fR[1], t)] });
    draw(cur);
    return {
      g,
      /** move smoothly to a pose (the slide's loop calls tick) */
      go(p, sp = 14) { tgt = p; speed = sp; if (s.fast) { cur = p; draw(cur); } },
      set(p) { cur = tgt = p; draw(cur); },
      tick(dt) { cur = mix(cur, tgt, Math.min(1, dt * speed)); draw(cur); },
    };
  }

  Deck.unit({
    id: "u3", num: 3, title: "Rhythmus und Takt", color: C, soft: SOFT,
    subtitle: "Musik hat einen Herzschlag",
    blurb: "Puls, Notenwerte, Takt, Tanz – und dein eigener Beat.",
    goals: ["Den Puls fühlen und das Tempo erkennen", "Notenwerte und Pausen lesen", "2/4-, 3/4- und 4/4-Takt unterscheiden", "Punktierte Noten, Auftakt und Synkope verstehen", "Eigene Rhythmen bauen – mit Drums und Körper", "Sich zur Musik bewegen: Walzer, Marsch, Polka und eine Choreografie"],
    icon(svg, el) {
      svg.append(el("circle", { cx: 35, cy: 35, r: 30, fill: C, opacity: .14 }));
      [16, 30, 44, 58].forEach((x, i) => svg.append(el("rect", { x: x - 5, y: i === 0 ? 14 : 26, width: 10, height: i === 0 ? 42 : 30, rx: 4, fill: i === 0 ? RED : C })));
    },
    slides: [
      /* 1 ------------------------------------------------------------------ */
      {
        title: "Der Puls – unser Grundschlag",
        say: "Musik hat einen Puls, wie dein Herz. Ein gleichmäßiger Schlag, der immer weiterläuft.",
        build(s) {
          const K = kit(s), P = Player(s);
          const svg = s.svg(420, 430);
          const ring = s.el("circle", { cx: 210, cy: 200, r: 150, fill: "none", stroke: C, "stroke-width": 5, opacity: .25 });
          const dot = s.el("circle", { cx: 210, cy: 200, r: 95, fill: C });
          const num = s.el("text", { x: 210, y: 224, "text-anchor": "middle", "font-size": 70, "font-weight": 800, fill: "#fff", text: "1" });
          const cap = s.el("text", { x: 210, y: 405, "text-anchor": "middle", class: "lbl", text: "Klick: 60 Schläge pro Minute" });
          svg.append(ring, dot, num, cap);
          let count = 0, mode = { snd: w => K.click(w, count % 4 === 3), bpm: 60, name: "Klick" };
          const beat = () => {
            count = count % 4 + 1; num.textContent = count;
            flash(s, dot, "r", 120, 95, 300); flash(s, ring, "r", 150, 185, 450);
          };
          const start = m => {
            mode = m; count = 0; cap.textContent = `${m.name}: ${m.bpm} Schläge pro Minute`;
            P.play([{ b: 0, d: 1, snd: w => mode.snd(w), vis: beat }], { bpm: m.bpm, length: 1, loop: true });
          };
          const stop = btn(s, "■ Stopp", () => { P.stop(); s.sfx.click(); });
          const go = btn(s, "▶ Puls", () => start({ snd: w => K.click(w, count % 4 === 3), bpm: 60, name: "Klick" }), true);
          const left = s.h("div", { class: "stack", style: { alignItems: "center", gap: "8px" } }, svg, s.h("div", { class: "row", style: { justifyContent: "center" } }, go, stop));
          const card = (lab, emo, txt, m) => s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, lab),
            s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "14px" } },
              s.h("span", { style: { fontSize: "40px" } }, emo),
              s.h("p", { class: "small", style: { flex: 1 } }, txt),
              btn(s, "▶", () => start(m))));
          const c1 = card("Beispiel 1 · Herz", "❤️", "Dein Herz schlägt in Ruhe gleichmäßig. Erwachsene: etwa 60 bis 100 Schläge pro Minute, Kinder etwas schneller.", { snd: w => K.heart(w), bpm: 80, name: "Herz" });
          const c2 = card("Beispiel 2 · Gehen", "🚶", "Beim Gehen machst du ungefähr 100 Schritte pro Minute – links, rechts, links, rechts.", { snd: w => K.step(w), bpm: 100, name: "Schritte" });
          const c3 = card("Beispiel 3 · Uhr", "⏱️", "Der Sekundenzeiger tickt genau 60-mal pro Minute. Tick, tack, tick, tack.", { snd: w => K.clock(w, count % 2 === 1), bpm: 60, name: "Uhr" });
          const merk = s.h("div", { class: "merk later" }, "Der ", s.h("b", null, "Puls"), " (Grundschlag) ist gleichmäßig wie ein Herzschlag. Alle Musiker spielen auf denselben Puls.");
          const right = s.h("div", { class: "stack", style: { gap: "12px" } }, s.h("p", { class: "big a-up" }, "Puls = gleichmäßiger Schlag"), c1, c2, c3, merk);
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "420px 1fr", alignItems: "center", height: "100%" } }, left, right));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { await s.show(c1, "left"); start({ snd: w => K.heart(w), bpm: 80, name: "Herz" }); s.say("Dein Herz ist ein Puls."); });
          s.step(async () => { await s.show(c2, "left"); start({ snd: w => K.step(w), bpm: 100, name: "Schritte" }); s.say("Deine Schritte sind ein Puls."); });
          s.step(async () => { await s.show(c3, "left"); start({ snd: w => K.clock(w, count % 2 === 1), bpm: 60, name: "Uhr" }); s.say("Auch eine Uhr tickt im Puls."); });
          s.step(async () => { P.stop(); s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 2 ------------------------------------------------------------------ */
      {
        title: "Tempo: langsam oder schnell?",
        say: "Das Tempo sagt, wie schnell der Puls ist. Man misst es in Schlägen pro Minute.",
        build(s) {
          const K = kit(s), P = Player(s);
          let bpm = 100;
          const svg = s.svg(330, 470);
          svg.append(s.el("polygon", { points: "95,450 235,450 200,40 130,40", fill: "#8a5a2b", stroke: "#5b3a1a", "stroke-width": 4, "stroke-linejoin": "round" }));
          svg.append(s.el("polygon", { points: "130,90 200,90 214,330 116,330", fill: "#f4ead8" }));
          for (let i = 0; i < 9; i++) svg.append(s.el("line", { x1: 150, x2: 180, y1: 110 + i * 24, y2: 110 + i * 24, stroke: "#b49470", "stroke-width": 2 }));
          const arm = s.el("g");
          arm.append(s.el("line", { x1: 165, y1: 380, x2: 165, y2: 70, stroke: "#333", "stroke-width": 5, "stroke-linecap": "round" }));
          const weight = s.el("polygon", { points: "147,0 183,0 177,26 153,26", fill: C, stroke: "#4a2f8a", "stroke-width": 2 });
          arm.append(weight);
          svg.append(arm, s.el("circle", { cx: 165, cy: 380, r: 9, fill: "#333" }), s.el("rect", { x: 110, y: 392, width: 110, height: 44, rx: 8, fill: "#5b3a1a" }));
          const placeW = () => { const y = 100 + (200 - bpm) / 160 * 200; weight.setAttribute("transform", `translate(0 ${y})`); };
          placeW();
          let tBeat = null, dir = 1;
          s.loop(() => {
            let a = 0;
            if (P.playing && tBeat != null) { const e = Math.min(1, (performance.now() - tBeat) / (60000 / bpm)); a = dir * 26 * Math.sin(Math.PI * e); }
            arm.setAttribute("transform", `rotate(${a} 165 380)`);
          });
          const terms = [[63, "Largo", "„breit“ – sehr langsam"], [76, "Adagio", "„gemächlich“ – langsam"], [108, "Andante", "„gehend“ – ruhig"], [120, "Moderato", "„gemäßigt“ – mittel"], [168, "Allegro", "„munter“ – schnell"], [999, "Presto", "„flink“ – sehr schnell"]];
          const bigN = s.h("span", { class: "huge mono", style: { color: C } }, "100");
          const termT = s.h("p", { class: "big" }, "Andante");
          const meanT = s.h("p", { class: "t pencil" }, "„gehend“ – ruhig");
          const upd = () => { const t = terms.find(x => bpm < x[0]); termT.textContent = t[1]; meanT.textContent = t[2]; bigN.textContent = bpm; placeW(); mark.setAttribute("transform", `translate(${(bpm - 40) * 500 / 160} 0)`); };
          const sl = s.slider({ label: "Tempo (BPM)", min: 40, max: 200, step: 2, value: 100, onInput: v => { bpm = v; upd(); P.setBpm(v); } });
          // tempo ruler
          const zs = s.svg(540, 112);
          const X = b => 20 + (b - 40) * 500 / 160;
          zs.append(s.el("rect", { x: 20, y: 40, width: 500, height: 24, rx: 6, fill: "#e4e7ec" }));
          const zones = [[40, 60, "Largo", "#9ec5ff"], [76, 108, "Andante", "#a8e2c4"], [120, 168, "Allegro", "#ffd27a"], [168, 200, "Presto", "#ff9f8a"]];
          const zoneEls = zones.map(([a, b, n, col]) => {
            const g = s.el("g", { class: "later" });
            g.append(s.el("rect", { x: X(a), y: 40, width: X(b) - X(a), height: 24, fill: col }));
            g.append(s.el("text", { x: (X(a) + X(b)) / 2, y: 92, "text-anchor": "middle", class: "lbl", text: n }));
            zs.append(g); return g;
          });
          [[40, "start"], [60], [76], [108], [120], [168], [200, "end"]].forEach(([b, a]) => zs.append(s.el("text", { x: X(b), y: 30, "text-anchor": a || "middle", "font-size": 19, fill: PENCIL, text: b })));
          const mark = s.el("g");
          mark.append(s.el("line", { x1: 20, x2: 20, y1: 34, y2: 70, stroke: INK, "stroke-width": 4 }), s.el("circle", { cx: 20, cy: 52, r: 7, fill: INK }));
          zs.append(mark);
          const play = btn(s, "▶ Metronom", () => {
            if (P.playing) { P.stop(); play.textContent = "▶ Metronom"; return; }
            play.textContent = "■ Stopp"; let i = 0;
            P.play([{ b: 0, d: 1, snd: w => K.click(w, i % 4 === 0), vis: () => { i++; tBeat = performance.now(); dir = -dir; } }], { bpm, length: 1, loop: true });
          }, true);
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"),
            s.h("p", { class: "small" }, "BPM heißt „beats per minute“ – Schläge pro Minute. Ruhige Schlaflieder sind langsam, Tanz- und Sportmusik oft schnell. Die Wörter oben sind Italienisch und stehen über vielen Musikstücken."));
          const note2 = s.h("p", { class: "small pencil later" }, "Richtwerte: Je nach Metronom und Zeit schwanken die Zahlen.");
          upd();
          const right = s.h("div", { class: "stack", style: { gap: "10px" } },
            s.h("div", { class: "row", style: { alignItems: "baseline", flexWrap: "nowrap" } }, bigN, s.h("span", { class: "t" }, "Schläge pro Minute")),
            s.h("div", { class: "row", style: { alignItems: "baseline", flexWrap: "nowrap" } }, termT, meanT),
            sl, s.h("div", { class: "row" }, play), zs, note2, life);
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "330px 1fr", alignItems: "center", height: "100%" } }, svg, right));
          s.show(svg, "up"); s.sfx.whoosh();
          s.step(async () => { for (const [i, z] of zoneEls.entries()) { s.show(z, "fade"); s.sfx.count(i); await s.wait(260); } s.show(note2, "fade"); s.say("Largo ist sehr langsam, Presto sehr schnell."); });
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 2b ----------------------------------------------------------------- */
      {
        title: "Das Metronom",
        say: "Ein Metronom tickt genau im Tempo, das du einstellst. Musiker üben damit, im Takt zu bleiben.",
        build(s) {
          const K = kit(s), P = Player(s);
          const ph = s.photo("metronome-photo", { w: 330, h: 540, pos: "50% 40%", caption: "Metronom zum Aufziehen" });
          const big = s.h("p", { class: "huge mono", style: { color: C } }, "–");
          let on = 0;
          const run = bpm => { on = bpm; big.textContent = "♩ = " + bpm; let i = 0; P.play([{ b: 0, d: 1, snd: w => K.click(w, i % 4 === 0), vis: () => { i++; wig(big); } }], { bpm, length: 1, loop: true }); };
          const wig = el => { el.classList.remove("a-pop"); void el.offsetWidth; el.classList.add("a-pop"); };
          const bs = [60, 100, 160].map(b => btn(s, "▶ " + b, () => run(b)));
          const stop = btn(s, "■ Stopp", () => { P.stop(); big.textContent = "–"; });
          const c1 = s.h("div", { class: "card later" }, s.h("span", { class: "exlabel" }, "Erfunden"), s.h("p", { class: "t" }, s.h("b", null, "Johann Nepomuk Mälzel"), " ließ das Metronom ", s.h("b", null, "1815"), " patentieren. Ein Pendel mit Gewicht schwingt hin und her."));
          const c2 = s.h("div", { class: "card later" }, s.h("span", { class: "exlabel" }, "In den Noten"), s.h("p", { class: "t" }, "Über vielen Stücken steht zum Beispiel ", s.h("b", null, "♩ = 100"), ": 100 Viertel pro Minute. ", s.h("b", null, "Beethoven"), " hat solche Zahlen als einer der Ersten benutzt."));
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Für die Instrumentalklasse"), s.h("p", { class: "small" }, "Heute gibt es Metronome auch als App. Langsam mit Metronom üben – dann Schritt für Schritt schneller."));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "330px 1fr", alignItems: "center", gap: "26px", height: "100%" } }, ph,
            s.h("div", { class: "stack", style: { gap: "12px" } }, s.h("div", { class: "row", style: { flexWrap: "nowrap", alignItems: "center" } }, big), s.h("div", { class: "row" }, ...bs, stop), c1, c2, life)));
          s.step(async () => { run(100); await s.show(c1, "left"); });
          s.step(async () => { await s.show(c2, "left"); });
          s.step(async () => { P.stop(); big.textContent = "–"; s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 3 ------------------------------------------------------------------ */
      {
        title: "Der Notenbaum",
        say: "Eine ganze Note lässt sich immer weiter teilen: in zwei Halbe, vier Viertel, acht Achtel und sechzehn Sechzehntel.",
        build(s) {
          const K = kit(s), P = Player(s);
          const svg = s.svg(1100, 552);
          const rows = [["1 Ganze", "4 Schläge"], ["2 Halbe", "je 2 Schläge"], ["4 Viertel", "je 1 Schlag"], ["8 Achtel", "je ½ Schlag"], ["16 Sechzehntel", "je ¼ Schlag"]];
          const pitch = [-12, -8, -5, 0, 4];
          const RH = 110, X0 = 220, WW = 870;
          const groups = [], branchSets = [];
          rows.forEach(([nm, sub], k) => {
            const n = 2 ** k, top = k * RH, seg = WW / n;
            const g = s.el("g", { class: k ? "later" : "", style: { cursor: "pointer" } });
            g.append(s.el("rect", { x: 0, y: top + 4, width: 1100, height: RH - 8, rx: 14, fill: k % 2 ? "#fff" : SOFT, opacity: .9 }));
            g.append(s.el("text", { x: 14, y: top + 48, "font-size": 22, "font-weight": 700, fill: INK, text: nm }));
            g.append(s.el("text", { x: 14, y: top + 78, "font-size": 19, fill: PENCIL, text: sub }));
            const bars = [], heads = [];
            for (let i = 0; i < n; i++) {
              const b = s.el("rect", { x: X0 + seg * i + 3, y: top + 86, width: seg - 6, height: 12, rx: 4, fill: "#d9cdf6" });
              const nt = note(s, X0 + seg * (i + 0.5) - 4, top + 66, [1, 2, 4, 8, 16][k], { color: INK, k: 0.95 });
              g.append(b, nt); bars.push(b); heads.push(nt);
            }
            g.addEventListener("click", () => playRow(k));
            svg.append(g); groups.push({ g, bars, heads, n });
            if (k) {
              const br = [];
              const pseg = WW / (n / 2);
              for (let i = 0; i < n; i++) {
                const px = X0 + pseg * (Math.floor(i / 2) + 0.5), cx = X0 + seg * (i + 0.5);
                const l = s.el("line", { x1: px, y1: top - 10, x2: cx, y2: top + 6, stroke: C, "stroke-width": 2, opacity: .5, class: "later" });
                svg.insertBefore(l, svg.firstChild); br.push(l);
              }
              branchSets[k] = br;
            }
          });
          const playRow = k => {
            const { bars, n } = groups[k], d = 4 / n;
            bars.forEach(b => b.setAttribute("fill", "#d9cdf6"));
            P.play(bars.map((b, i) => ({ b: i * d, d, snd: (w, sec) => K.note(pitch[k], Math.max(0.12, sec * 0.92), w, 0.2), vis: () => { b.setAttribute("fill", C); } })).concat([{ b: 0, d: 1, snd: w => K.click(w, true) }, { b: 1, d: 1, snd: w => K.click(w) }, { b: 2, d: 1, snd: w => K.click(w) }, { b: 3, d: 1, snd: w => K.click(w) }]),
              { bpm: 84, length: 4, end: () => bars.forEach(b => b.setAttribute("fill", "#d9cdf6")) });
          };
          const hint = s.h("p", { class: "small pencil", style: { textAlign: "center" } }, "Tippe auf eine Reihe: Jede Reihe dauert gleich lang – 4 Schläge. Nur die Teile werden kleiner.");
          s.add(s.h("div", { class: "stack", style: { gap: "6px" } }, svg, hint));
          s.sfx.pop();
          for (let k = 1; k < 5; k++) s.step(async () => {
            s.show(branchSets[k], "draw"); s.sfx.whoosh(); await s.wait(350);
            await s.show(groups[k].g, "fade"); playRow(k);
            s.say(["Zwei Halbe sind so lang wie eine Ganze.", "Vier Viertel.", "Acht Achtel.", "Sechzehn Sechzehntel!"][k - 1]);
          });
        },
      },
      /* 4 ------------------------------------------------------------------ */
      {
        title: "Pausen: Stille zählt mit",
        say: "Zu jedem Notenwert gibt es eine Pause. In der Pause ist es still, aber du zählst weiter.",
        build(s) {
          const K = kit(s), P = Player(s);
          const data = [[1, "Ganze Pause", "4 Schläge"], [2, "Halbe Pause", "2 Schläge"], [4, "Viertelpause", "1 Schlag"], [8, "Achtelpause", "½ Schlag"], [16, "Sechzehntelpause", "¼ Schlag"]];
          const cards = data.map(([v, nm, len], i) => {
            const svg = s.svg(180, 130);
            const st = staff(s, svg, 8, 172, 33, 16);
            const r = rest(s, 90, st.mid, v, { gap: 16 });
            svg.append(r);
            const play = () => {
              const beats = 4 / v, col = c => r.querySelectorAll("*").forEach(e => { if (e.getAttribute("fill") && e.getAttribute("fill") !== "none") e.setAttribute("fill", c); if (e.getAttribute("stroke")) e.setAttribute("stroke", c); });
              const ev = [{ b: 0, d: 1, snd: (w, sec) => K.note(0, sec * 0.9, w), vis: () => col(INK) }, { b: 1, d: beats, vis: () => col(RED) }, { b: 1 + beats, d: 1, snd: (w, sec) => K.note(4, sec * 0.9, w), vis: () => col(INK) }];
              for (let b = 0; b < Math.ceil(2 + beats); b++) ev.push({ b, d: 1, snd: w => K.click(w, b === 0) });
              P.play(ev, { bpm: 80, length: Math.ceil(2 + beats), end: () => col(INK) });
            };
            return s.h("div", { class: "card a-up", style: { "--d": i * 110 + "ms", padding: "12px 8px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" } },
              svg, s.h("p", { class: "small", style: { fontWeight: 700 } }, nm), s.h("p", { class: "small pencil" }, len), btn(s, "▶ hören", play));
          });
          const merk = s.h("div", { class: "merk later" }, "Die ganze Pause ", s.h("b", null, "hängt"), " unter der Linie, die halbe Pause ", s.h("b", null, "sitzt"), " auf der Linie. In jeder Pause: ", s.h("span", { class: "hl" }, "still sein, weiterzählen!"));
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"),
            s.h("p", { class: "small" }, "Beim Singen holst du in der Pause Luft. Im Orchester zählen Bläser oft viele Takte Pause, bis sie wieder dran sind. Und im Stadion ist es kurz still – dann rufen alle zusammen."));
          s.add(s.h("div", { class: "stack", style: { gap: "18px", height: "100%", justifyContent: "center" } },
            s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "14px" } }, cards),
            s.h("p", { class: "small pencil a-fade", style: { textAlign: "center", "--d": "600ms" } }, "Beim Abspielen hörst du: Ton – Pause (die Pause leuchtet rot) – Ton. Der Klick zählt weiter."),
            s.h("div", { class: "cols", style: { alignItems: "start" } }, merk, life)));
          s.sfx.whoosh();
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* 5 ------------------------------------------------------------------ */
      {
        title: "Taktarten: 2/4, 3/4, 4/4",
        say: "Der Takt bündelt die Schläge zu Gruppen. Die Eins ist immer betont.",
        build(s) {
          const K = kit(s), P = Player(s);
          const mk = (n, name, txt, bpm, pattern, label) => {
            const dots = s.svg(250, 70);
            const ds = [];
            for (let i = 0; i < n; i++) {
              const x = 125 + (i - (n - 1) / 2) * 56;
              const c = s.el("circle", { cx: x, cy: 35, r: i === 0 ? 26 : 17, fill: i === 0 ? RED : C, opacity: .35 });
              const t = s.el("text", { x, y: i === 0 ? 43 : 41, "text-anchor": "middle", "font-size": i === 0 ? 24 : 19, "font-weight": 800, fill: "#fff", text: i + 1 });
              dots.append(c, t); ds.push(c);
            }
            const sig = s.h("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", font: "800 46px/1 var(--f-display)", color: C } }, s.h("span", null, String(n)), s.h("span", { style: { borderTop: "4px solid " + C, paddingTop: "4px" } }, "4"));
            const b = btn(s, "▶ " + label, () => {
              const bars = n === 3 ? 4 : n === 2 ? 4 : 2, ev = [];
              for (let bar = 0; bar < bars; bar++) for (let i = 0; i < n; i++) {
                const beat = bar * n + i;
                pattern(ev, beat, i, bar);
                ev.push({ b: beat, d: 1, vis: () => { ds.forEach((d, j) => d.setAttribute("opacity", j === i ? 1 : .35)); flash(s, ds[i], "r", (i === 0 ? 26 : 17) * 1.25, i === 0 ? 26 : 17, 250); } });
              }
              P.play(ev, { bpm, length: bars * n, end: () => ds.forEach(d => d.setAttribute("opacity", .35)) });
            }, true);
            return s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", textAlign: "center" } },
              sig, dots, s.h("p", { class: "h2" }, name), s.h("p", { class: "small", style: { minHeight: "54px" } }, txt), b);
          };
          const march = (ev, beat, i) => { ev.push({ b: beat, d: 1, snd: w => { if (i === 0) { K.kick(w, 0.8); K.note(-24, 0.3, w, 0.25); } else { K.snare(w); K.note(-8, 0.15, w, 0.12); K.note(-5, 0.15, w, 0.12); } } }); };
          const waltz = (ev, beat, i) => { ev.push({ b: beat, d: 1, snd: w => { if (i === 0) K.note(-24, 0.45, w, 0.28); else { K.note(-8, 0.14, w, 0.1); K.note(-5, 0.14, w, 0.1); K.note(0, 0.14, w, 0.08); } } }); };
          const pop = (ev, beat, i) => { ev.push({ b: beat, d: 1, snd: w => { if (i % 2 === 0) K.kick(w, i === 0 ? 0.8 : 0.55); else K.snare(w); K.hat(w); if (i === 0) K.note(-24, 0.4, w, 0.22); } }, { b: beat + 0.5, d: 0.5, snd: w => K.hat(w) }); };
          const c2 = mk(2, "Marsch", "Links – rechts, links – rechts. Gut zum Marschieren.", 112, march, "Marsch");
          const c3 = mk(3, "Walzer", "Um – pa – pa. Der Walzer ist ein Paartanz im 3/4-Takt.", 160, waltz, "Walzer");
          const c4 = mk(4, "Pop, Rock, Rap", "Die meisten Lieder aus dem Radio laufen im 4/4-Takt.", 100, pop, "Pop-Beat");
          c3.classList.add("later"); c4.classList.add("later");
          const merk = s.h("div", { class: "merk later" }, "Obere Zahl: ", s.h("b", null, "wie viele Schläge"), " pro Takt. Untere Zahl: ", s.h("b", null, "welcher Notenwert"), " (4 = Viertel). Die ", s.h("b", { class: "red" }, "1"), " ist am stärksten betont.");
          s.add(s.h("div", { class: "stack", style: { gap: "20px", height: "100%", justifyContent: "center" } }, s.h("div", { class: "cols3" }, c2, c3, c4), merk));
          s.show(c2, "up"); s.sfx.pop();
          s.step(async () => { s.sfx.pop(); await s.show(c3, "up"); s.say("Der Walzer hat drei Schläge: Um pa pa."); });
          s.step(async () => { s.sfx.pop(); await s.show(c4, "up"); s.say("Pop und Rock haben meistens vier Schläge."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 6 ------------------------------------------------------------------ */
      {
        title: "Takt und Taktstrich",
        say: "Taktstriche teilen die Musik in gleich lange Stücke. Jedes Stück heißt Takt.",
        build(s) {
          const K = kit(s), P = Player(s);
          const svg = s.svg(1100, 300);
          const gap = 16, yTop = 84, st = staff(s, svg, 20, 1080, yTop, gap);
          svg.append(timesig(s, 60, yTop, gap, 4, 4));
          const bars = [[0, 4], [0, 2], [0, 4], [2, 4], [3, 4], [0, 4], [1, 8], [1.5, 8], [2, 2]]; // [beat, value]
          const barOf = [0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2];
          const seq = [[0, 0, 4], [0, 1, 4], [0, 2, 4], [0, 3, 4], [1, 0, 2], [1, 2, 4], [1, 3, 4], [2, 0, 4], [2, 1, 8], [2, 1.5, 8], [2, 2, 2]];
          const BX = [100, 420, 740], BW = 320, bx = (bar, beat) => BX[bar] + 40 + beat * 70;
          const notes = seq.map(([bar, beat, v]) => { const n = v === 8 ? s.el("g") : note(s, bx(bar, beat), st.mid, v, { k: 1.15 }); svg.append(n); return n; });
          svg.append(beamed(s, [bx(2, 1), bx(2, 1.5)], st.mid, 1, { k: 1.15 }));
          const lines = [420, 740].map(x => s.el("line", { x1: x, x2: x, y1: yTop, y2: yTop + 4 * gap, stroke: RED, "stroke-width": 3.5, class: "later" }));
          const fin = s.el("g", { class: "later" });
          fin.append(s.el("line", { x1: 1062, x2: 1062, y1: yTop, y2: yTop + 4 * gap, stroke: RED, "stroke-width": 2.5 }), s.el("rect", { x: 1068, y: yTop, width: 8, height: 4 * gap, fill: RED }));
          svg.append(...lines, fin);
          const lab1 = s.el("g", { class: "later" });
          lab1.append(s.el("text", { x: 580, y: 30, "text-anchor": "middle", "font-size": 22, "font-weight": 700, fill: RED, text: "Taktstriche" }),
            s.el("line", { x1: 520, y1: 40, x2: 428, y2: 74, stroke: RED, "stroke-width": 2.5 }), s.el("line", { x1: 640, y1: 40, x2: 732, y2: 74, stroke: RED, "stroke-width": 2.5 }));
          const lab2 = s.el("g", { class: "later" });
          lab2.append(s.el("text", { x: 1080, y: 30, "text-anchor": "end", "font-size": 22, "font-weight": 700, fill: RED, text: "Schlussstrich" }), s.el("line", { x1: 1040, y1: 40, x2: 1066, y2: 74, stroke: RED, "stroke-width": 2.5 }));
          svg.append(lab1, lab2);
          const counts = s.el("g", { class: "later" });
          for (let b = 0; b < 3; b++) for (let i = 0; i < 4; i++) counts.append(s.el("text", { x: bx(b, i), y: 196, "text-anchor": "middle", "font-size": 22, "font-weight": 700, fill: i === 0 ? RED : C, text: i + 1 }));
          counts.append(s.el("text", { x: bx(2, 1.5), y: 196, "text-anchor": "middle", "font-size": 20, fill: PENCIL, text: "+" }));
          const brk = s.el("g", { class: "later" });
          BX.forEach((x, i) => { brk.append(s.el("path", { d: `M${x + 12} 216 v10 H${x + BW - 12} v-10`, fill: "none", stroke: PENCIL, "stroke-width": 2 }), s.el("text", { x: x + BW / 2, y: 254, "text-anchor": "middle", class: "lbl", text: `${i + 1}. Takt = 4 Viertel` })); });
          svg.append(counts, brk);
          const cursor = s.el("rect", { x: 0, y: yTop - 18, width: 36, height: 4 * gap + 36, rx: 10, fill: C, opacity: 0 });
          svg.insertBefore(cursor, svg.firstChild);
          const play = btn(s, "▶ Abspielen", () => {
            const ev = seq.map(([bar, beat, v], i) => ({ b: bar * 4 + beat, d: 4 / v, snd: (w, sec) => K.note(0, sec * 0.85, w), vis: () => { cursor.setAttribute("x", bx(bar, beat) - 16); cursor.setAttribute("opacity", .25); } }));
            for (let b = 0; b < 12; b++) ev.push({ b, d: 1, snd: w => K.click(w, b % 4 === 0) });
            P.play(ev, { bpm: 90, length: 12, end: () => cursor.setAttribute("opacity", 0) });
          }, true);
          const card = (lab, txt) => s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, lab), s.h("p", { class: "small" }, txt));
          const e1 = card("Wie ein Zug", "Jeder Waggon ist gleich groß – jeder Takt hat gleich viele Schläge.");
          const e2 = card("Wie beim Fußball", "Beide Halbzeiten dauern gleich lang: 45 Minuten. Takte auch!");
          const e3 = card("Wie im Heft", "Kästchen für Kästchen – der Taktstrich ist der Strich dazwischen.");
          s.add(s.h("div", { class: "stack", style: { gap: "16px", height: "100%", justifyContent: "center" } }, svg, s.h("div", { class: "row" }, play, s.h("p", { class: "small pencil" }, "Jeder Takt im 4/4-Takt hat genau 4 Viertel – egal, wie sie aufgeteilt sind.")), s.h("div", { class: "cols3" }, e1, e2, e3)));
          s.show(svg, "fade"); s.sfx.pop();
          s.step(async () => { s.sfx.snap(); await s.show(lines[0], "draw"); s.sfx.snap(); await s.show(lines[1], "draw"); s.show(lab1, "fade"); s.say("Taktstriche trennen die Takte."); });
          s.step(async () => { s.sfx.whoosh(); s.show(counts, "fade"); await s.show(brk, "up"); play.click(); });
          s.step(async () => { s.sfx.snap(); await s.show(fin, "draw"); s.show(lab2, "fade"); s.say("Am Ende steht der Schlussstrich."); });
          s.step(async () => { for (const [i, e] of [e1, e2, e3].entries()) { s.sfx.count(i); s.show(e, "up"); await s.wait(200); } });
        },
      },
      /* 7 ------------------------------------------------------------------ */
      {
        title: "Punktierte Noten",
        say: "Ein Punkt hinter der Note macht sie um die Hälfte länger.",
        build(s) {
          const K = kit(s), P = Player(s);
          const svg = s.svg(1100, 330);
          const W = 110;
          const row = (y, v, blocks, txt, later) => {
            const g = s.el("g", { class: later ? "later" : "", style: { cursor: "pointer" } });
            g.append(s.el("rect", { x: 0, y: y - 70, width: 1100, height: 140, rx: 18, fill: SOFT, opacity: .7 }));
            g.append(note(s, 90, y + 18, v, { k: 1.6, color: INK, dot: true }));
            g.append(s.el("text", { x: 210, y: y + 16, "text-anchor": "middle", "font-size": 48, "font-weight": 800, fill: INK, text: "=" }));
            const bl = [];
            let x = 270;
            blocks.forEach(([w, lab, col]) => {
              const r = s.el("rect", { x: x + 3, y: y - 34, width: w * W - 6, height: 52, rx: 8, fill: col });
              const t = s.el("text", { x: x + w * W / 2, y: y + 1, "text-anchor": "middle", "font-size": 22, "font-weight": 800, fill: "#fff", text: lab });
              g.append(r, t); bl.push([r, x, w]); x += w * W;
            });
            g.append(s.el("text", { x: x + 24, y: y + 1, "font-size": 30, "font-weight": 800, fill: C, text: txt }));
            g.append(s.el("text", { x: 270, y: y + 50, "font-size": 19, fill: PENCIL, text: v === 2 ? "Halbe = 2 Schläge, Punkt = die Hälfte davon = 1 Schlag" : "Viertel = 1 Schlag, Punkt = die Hälfte davon = ½ Schlag" }));
            g.addEventListener("click", () => playRow(bl, blocks.reduce((a, b) => a + b[0], 0)));
            svg.append(g); return { g, bl, total: blocks.reduce((a, b) => a + b[0], 0) };
          };
          const playRow = (bl, total) => {
            bl.forEach(([r]) => r.setAttribute("opacity", .45));
            const ev = [{ b: 0, d: total, snd: (w, sec) => K.note(0, sec * 0.95, w, 0.24) }];
            let acc = 0; bl.forEach(([r, , w]) => { ev.push({ b: acc, d: w, vis: () => r.setAttribute("opacity", 1) }); acc += w; });
            for (let b = 0; b < Math.ceil(total) + 1; b++) ev.push({ b, d: 1, snd: w => K.click(w, b === 0) });
            P.play(ev, { bpm: 76, length: Math.ceil(total) + 1, end: () => bl.forEach(([r]) => r.setAttribute("opacity", 1)) });
          };
          const A = row(80, 2, [[1, "1", C], [1, "2", C], [1, "+1", ORANGE]], "= 3 Schläge", false);
          const B = row(250, 4, [[1, "1", C], [0.5, "+½", ORANGE]], "= 1½ Schläge", true);
          const straight = () => { const ev = []; for (let i = 0; i < 8; i++) ev.push({ b: i * 0.5, d: 0.5, snd: w => K.note(i % 2 ? 4 : 0, 0.18, w) }); P.play(ev, { bpm: 92, length: 4 }); };
          const dotted = () => { const ev = []; for (let i = 0; i < 4; i++) { ev.push({ b: i, d: 0.75, snd: w => K.note(0, 0.3, w) }, { b: i + 0.75, d: 0.25, snd: w => K.note(4, 0.1, w) }); } P.play(ev, { bpm: 92, length: 4 }); };
          const cmp = s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "10px" } },
            s.h("p", { class: "small", style: { fontWeight: 700 } }, "Punktiert klingt es hüpfend: lang – kurz, lang – kurz."),
            s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "10px" } }, [btn(s, "▶ gerade", straight), btn(s, "▶ punktiert", dotted, true)].map(b => { b.style.whiteSpace = "nowrap"; b.style.padding = "0 14px"; return b; })));
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"),
            s.h("p", { class: "small" }, "Lang – kurz kennst du vom Hopserlauf im Sport, vom Galopp eines Pferdes und vom „Ba-dumm“ deines Herzens."));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Der ", s.h("b", null, "Punkt"), " verlängert eine Note um die ", s.h("b", null, "Hälfte"), " ihres Wertes.");
          s.add(s.h("div", { class: "stack", style: { gap: "16px", height: "100%", justifyContent: "center" } }, svg, s.h("div", { class: "cols3", style: { alignItems: "start" } }, merk, cmp, life)));
          s.show(A.g, "left"); s.sfx.whoosh();
          s.step(async () => { s.sfx.pop(); await s.show(B.g, "left"); playRow(B.bl, B.total); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(cmp, "up"); dotted(); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* 8 ------------------------------------------------------------------ */
      {
        title: "Der Auftakt",
        say: "Manche Lieder fangen vor der Eins an. Dieser kleine Anlauf heißt Auftakt.",
        build(s) {
          const K = kit(s), P = Player(s);
          const svg = s.svg(1100, 290);
          const gap = 14, yTop = 60, st = staff(s, svg, 20, 1080, yTop, gap);
          svg.append(clef(s, 44, st.y(2), gap), timesig(s, 100, yTop, gap, 4, 4));
          // [beat (global, pickup = 0), diatonic step from E4, value, dotted, semitone from C5]
          const mel = [[0, 2, 4, 0, -5], [1, 5, 4, 0, 0], [2, 7, 4, 0, 4], [3, 9, 4, 0, 7], [4, 7, 4, 0, 4], [5, 8, 4, 0, 5], [6, 6, 4, 0, 2], [7, 4, 4, 0, -1], [8, 6, 4, 0, 2], [9, 5, 2, 1, 0]];
          const bxs = [170, 250, 320, 390, 460, 560, 630, 700, 770, 870];
          const heads = mel.map(([b, stp, v, d], i) => { const n = note(s, bxs[i], st.y(stp), v, { k: 1.05, dot: !!d, down: stp >= 4 }); svg.append(n); return n; });
          [215, 515, 815].forEach(x => svg.append(s.el("line", { x1: x, x2: x, y1: yTop, y2: yTop + 4 * gap, stroke: INK, "stroke-width": 2.5 })));
          svg.append(s.el("line", { x1: 1060, x2: 1060, y1: yTop, y2: yTop + 4 * gap, stroke: INK, "stroke-width": 2 }), s.el("rect", { x: 1066, y: yTop, width: 7, height: 4 * gap, fill: INK }));
          const cnt = s.el("g", { class: "later" });
          ["4", "1", "2", "3", "4", "1", "2", "3", "4", "1"].forEach((t, i) => cnt.append(s.el("text", { x: bxs[i], y: 178, "text-anchor": "middle", "font-size": 22, "font-weight": 700, fill: i === 0 ? RED : t === "1" ? C : PENCIL, text: t })));
          [["2", 935], ["3", 1000]].forEach(([t, x]) => cnt.append(s.el("text", { x, y: 178, "text-anchor": "middle", "font-size": 22, "font-weight": 700, fill: PENCIL, text: t })));
          svg.append(cnt);
          const bA = s.el("g", { class: "later" });
          bA.append(s.el("rect", { x: 140, y: 40, width: 66, height: 120, rx: 12, fill: RED, opacity: .12 }), s.el("path", { d: "M145 196 v10 H205 v-10", fill: "none", stroke: RED, "stroke-width": 2.5 }), s.el("text", { x: 175, y: 236, "text-anchor": "middle", "font-size": 22, "font-weight": 700, fill: RED, text: "Auftakt" }), s.el("text", { x: 175, y: 262, "text-anchor": "middle", "font-size": 19, fill: RED, text: "1 Schlag" }));
          const bS = s.el("g", { class: "later" });
          bS.append(s.el("rect", { x: 822, y: 40, width: 230, height: 120, rx: 12, fill: ORANGE, opacity: .12 }), s.el("path", { d: "M830 196 v10 H1050 v-10", fill: "none", stroke: ORANGE, "stroke-width": 2.5 }), s.el("text", { x: 940, y: 236, "text-anchor": "middle", "font-size": 22, "font-weight": 700, fill: ORANGE, text: "Schlusstakt" }), s.el("text", { x: 940, y: 262, "text-anchor": "middle", "font-size": 19, fill: ORANGE, text: "nur 3 Schläge" }));
          svg.insertBefore(bS, svg.firstChild); svg.insertBefore(bA, svg.firstChild);
          const colorN = (n, c) => n.querySelectorAll("ellipse,line,circle").forEach(e => { e.setAttribute("stroke", c); if (e.getAttribute("fill") !== "#fff") e.setAttribute("fill", c); });
          const play = btn(s, "▶ Melodie mit Auftakt", () => {
            const ev = mel.map(([b, , v, d, semi], i) => ({ b, d: (4 / v) * (d ? 1.5 : 1), snd: (w, sec) => K.note(semi, sec * 0.9, w, 0.22), vis: () => { heads.forEach(h => colorN(h, INK)); colorN(heads[i], C); } }));
            for (let b = 1; b < 12; b++) ev.push({ b, d: 1, snd: w => K.click(w, (b - 1) % 4 === 0) });
            ev.push({ b: 0, d: 1, snd: w => K.click(w) });
            P.play(ev, { bpm: 96, length: 12, end: () => heads.forEach(h => colorN(h, INK)) });
          }, true);
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, s.h("b", null, "Auftakt"), " + ", s.h("b", null, "Schlusstakt"), " = zusammen ein voller Takt: 1 + 3 = 4 Schläge.");
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"),
            s.h("p", { class: "small" }, "Wie Anlauf nehmen vor dem Weitsprung! Viele Lieder beginnen mit einem Auftakt – oft auf einem kleinen Wort wie „Der“, „Im“ oder „Am“, bevor die betonte Eins kommt."));
          s.add(s.h("div", { class: "stack", style: { gap: "16px", height: "100%", justifyContent: "center" } }, svg, s.h("div", { class: "row" }, play, s.h("p", { class: "small pencil" }, "Eigene Melodie – zähl mit: „vier – eins, zwei, drei, vier …“")), s.h("div", { class: "cols", style: { alignItems: "start" } }, merk, life)));
          s.show(svg, "fade"); s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); await s.show(cnt, "fade"); s.show(bA, "pop"); s.sfx.pop(); play.click(); s.say("Das Lied beginnt auf der Vier. Das ist der Auftakt."); });
          s.step(async () => { s.sfx.pop(); await s.show(bS, "pop"); s.say("Dafür ist der letzte Takt kürzer."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* 9 ------------------------------------------------------------------ */
      {
        title: "Rhythmussprache: Ta und Ti-Ti",
        say: "Mit Silben kannst du Rhythmen sprechen. Ta ist eine Viertel, Ti Ti sind zwei Achtel.",
        build(s) {
          const K = kit(s), P = Player(s);
          // [syllables, onsets(beats), durs, drawFn, name]
          const defs = [
            [["Ta"], [0], [1], sv => sv.append(note(s, 90, 74, 4)), "Viertel"],
            [["Ti", "Ti"], [0, 0.5], [0.5, 0.5], sv => sv.append(beamed(s, [68, 112], 74, 1)), "2 Achtel"],
            [["Ta", "a"], [0, 1], [2, 0], sv => sv.append(note(s, 90, 74, 2)), "Halbe"],
            [["Ta", "a", "a", "a"], [0, 1, 2, 3], [4, 0, 0, 0], sv => sv.append(note(s, 90, 66, 1)), "Ganze"],
            [["Ti", "ri", "ti", "ri"], [0, 0.25, 0.5, 0.75], [0.25, 0.25, 0.25, 0.25], sv => sv.append(beamed(s, [48, 76, 104, 132], 74, 2)), "4 Sechzehntel"],
          ];
          const run = (onsets, durs, spans, bpm = 80) => {
            const len = Math.max(1, Math.ceil(onsets[onsets.length - 1] + 0.01));
            const ev = onsets.map((b, i) => ({ b, d: durs[i] || 0.25, snd: durs[i] ? w => K.clap(w) : null, vis: () => { spans.forEach(x => x.style.color = INK); spans[i].style.color = RED; } }));
            for (let b = 0; b < Math.max(len, 1); b++) ev.push({ b, d: 1, snd: w => K.click(w, b === 0) });
            P.play(ev, { bpm, length: Math.max(len, 1) + (durs[0] === 4 ? 3 : durs[0] === 2 ? 1 : 0), end: () => spans.forEach(x => x.style.color = INK) });
          };
          const cards = defs.map(([syl, on, du, draw, nm], i) => {
            const sv = s.svg(180, 92); draw(sv);
            const spans = syl.map((t, j) => s.h("span", null, (j ? "-" : "") + t));
            const c = s.h("button", { class: "card a-up", style: { "--d": i * 100 + "ms", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer", font: "inherit", color: INK, padding: "12px 6px" }, onclick: () => run(on, du, spans) },
              sv, s.h("span", { style: { font: "800 30px/1.1 var(--f-display)" } }, spans), s.h("span", { class: "small pencil" }, nm));
            return c;
          });
          const word = (w, syl, on, du) => {
            const spans = syl.map((t, j) => s.h("span", null, (j ? "-" : "") + t));
            return s.h("button", { class: "card later", style: { display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", font: "inherit", color: INK, padding: "10px 16px", justifyContent: "center" }, onclick: () => { run(on, du, spans, 72); } },
              s.h("span", { style: { font: "700 28px/1.1 var(--f-display)" } }, spans), s.h("span", { class: "small pencil" }, "= " + w));
          };
          const w1 = word("Ta", ["Brot"], [0], [1]), w2 = word("Ti-Ti", ["Piz", "za"], [0, 0.5], [0.5, 0.5]), w3 = word("Ti-ri-ti-ri", ["Ma", "ra", "cu", "ja"], [0, 0.25, 0.5, 0.75], [0.25, 0.25, 0.25, 0.25]);
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Diese Silben stammen aus der Rhythmussprache nach ", s.h("b", null, "Kodály"), " – eine von mehreren. Viele zählen auch einfach: „1 und 2 und“.");
          s.add(s.h("div", { class: "stack", style: { gap: "20px", height: "100%", justifyContent: "center" } },
            s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "14px" } }, cards),
            s.h("p", { class: "small pencil a-fade", style: { textAlign: "center", "--d": "500ms" } }, "Tippe auf eine Karte: Die Silbe leuchtet, wenn geklatscht wird."),
            s.h("div", { class: "cols3" }, w1, w2, w3), merk));
          s.sfx.whoosh();
          s.step(async () => { s.say("Auch Wörter haben einen Rhythmus."); for (const [i, w] of [w1, w2, w3].entries()) { s.sfx.count(i); s.show(w, "pop"); await s.wait(220); } });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 10 ----------------------------------------------------------------- */
      {
        title: "Dein Rhythmus-Baukasten",
        say: "Tippe auf die Kästchen und baue deinen eigenen Beat. Dann drück auf Abspielen.",
        build(s) {
          const K = kit(s), P = Player(s);
          const rows = [["Hi-Hat", w => K.hat(w), "#2a9d8f"], ["Snare", w => K.snare(w), ORANGE], ["Bassdrum", w => K.kick(w), C]];
          const presets = {
            "Pop-Beat": ["x.x.x.x.x.x.x.x.", "....x.......x...", "x.......x.x....."],
            "Disco": ["..x...x...x...x.", "....x.......x...", "x...x...x...x..."],
            "Marsch": ["x...x...x...x...", "....x.xx....x.xx", "x.......x......."],
            "Leer": ["................", "................", "................"],
          };
          const grid = rows.map(() => Array(16).fill(false));
          const cells = [];
          const paint = (r, i) => { const c = cells[r][i]; c.style.background = grid[r][i] ? rows[r][2] : (Math.floor(i / 4) % 2 ? "#fff" : SOFT); };
          const head = s.h("div", { style: { display: "grid", gridTemplateColumns: "130px repeat(4, 1fr)", gap: "10px", alignItems: "end" } }, s.h("span"),
            ...[1, 2, 3, 4].map(n => s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "4px", textAlign: "center" } },
              s.h("b", { style: { fontSize: "22px", color: RED } }, String(n)), s.h("span", { class: "small pencil" }, "e"), s.h("span", { class: "small pencil" }, "+"), s.h("span", { class: "small pencil" }, "e"))));
          const heads = [];
          const lanes = rows.map(([nm], r) => {
            cells[r] = [];
            const groups = [0, 1, 2, 3].map(gi => s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "4px" } },
              [0, 1, 2, 3].map(j => {
                const i = gi * 4 + j;
                const c = s.h("div", { class: "nosw", style: { height: "62px", borderRadius: "10px", border: "2px solid #c8d3de", cursor: "pointer", transition: "transform .08s" } });
                c.addEventListener("pointerdown", e => { e.preventDefault(); grid[r][i] = !grid[r][i]; paint(r, i); if (grid[r][i]) rows[r][1](0); else s.sfx.tick(); });
                cells[r][i] = c; return c;
              })));
            return s.h("div", { style: { display: "grid", gridTemplateColumns: "130px repeat(4, 1fr)", gap: "10px", alignItems: "center" } }, s.h("b", { style: { fontSize: "21px", color: rows[r][2] } }, nm), ...groups);
          });
          const load = name => { presets[name].forEach((str, r) => [...str].forEach((ch, i) => { grid[r][i] = ch === "x"; paint(r, i); })); };
          load("Pop-Beat");
          let bpm = 100, lastCol = -1;
          const mark = i => { if (lastCol >= 0) cells.forEach(row => row[lastCol].style.transform = ""); cells.forEach(row => row[i].style.transform = "scale(1.12)"); lastCol = i; };
          const play = btn(s, "▶ Abspielen", () => {
            if (P.playing) { P.stop(); return; }
            play.textContent = "■ Stopp";
            P.play(Array.from({ length: 16 }, (_, i) => ({ b: i * 0.25, d: 0.25, snd: w => rows.forEach((rw, r) => grid[r][i] && rw[1](w)), vis: () => mark(i) })),
              { bpm, length: 4, loop: true, end: () => { play.textContent = "▶ Abspielen"; if (lastCol >= 0) cells.forEach(row => row[lastCol].style.transform = ""); } });
          }, true);
          const pre = Object.keys(presets).map(n => btn(s, n, () => { load(n); s.sfx.pop(); }));
          const sl = s.slider({ label: "Tempo", min: 60, max: 160, step: 4, value: 100, fmt: v => v + " BPM", onInput: v => { bpm = v; P.setBpm(v); } });
          sl.style.width = "300px";
          const life = s.h("div", { class: "life later", style: { display: "flex", gap: "16px", alignItems: "center" } }, s.photo("tr-808", { w: 220, h: 118, pos: "50% 60%" }),
            s.h("div", null, s.h("span", { class: "exlabel" }, "Im Alltag"), s.h("p", { class: "small" }, "So bauen Produzenten Beats: Der berühmte Drumcomputer Roland TR-808 (1980) hat 16 Tasten für die 16 Kästchen eines Taktes. Sein Bassdrum-Klang prägt Hip-Hop bis heute.")));
          s.add(s.h("div", { class: "stack", style: { gap: "10px", height: "100%", justifyContent: "center" } }, head, ...lanes,
            s.h("div", { class: "row", style: { marginTop: "8px", flexWrap: "nowrap" } }, play, ...pre, sl), life));
          s.show(lanes, "left"); s.sfx.whoosh();
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* 11 ----------------------------------------------------------------- */
      {
        title: "Bodypercussion",
        say: "Dein Körper ist ein Schlagzeug: stampfen, patschen, klatschen und schnipsen.",
        build(s) {
          const K = kit(s), P = Player(s);
          const svg = s.svg(360, 470);
          const body = s.el("g");
          svg.append(body);
          const idle = { lh: [120, 250], rh: [240, 250], lf: 0, rf: 0, spark: 0 };
          let pose = Object.assign({}, idle);
          const els = {
            head: s.el("circle", { cx: 180, cy: 70, r: 38, fill: "#f6d2b0", stroke: INK, "stroke-width": 4 }),
            torso: s.el("rect", { x: 140, y: 112, width: 80, height: 150, rx: 26, fill: C }),
            la: s.el("path", { fill: "none", stroke: INK, "stroke-width": 12, "stroke-linecap": "round" }),
            ra: s.el("path", { fill: "none", stroke: INK, "stroke-width": 12, "stroke-linecap": "round" }),
            ll: s.el("path", { fill: "none", stroke: "#2b3a67", "stroke-width": 16, "stroke-linecap": "round" }),
            rl: s.el("path", { fill: "none", stroke: "#2b3a67", "stroke-width": 16, "stroke-linecap": "round" }),
            spark: s.el("g", { opacity: 0 }),
            boom: s.el("g", { opacity: 0 }),
          };
          [[0, -26], [18, -18], [26, 0]].forEach(([dx, dy]) => els.spark.append(s.el("line", { x1: 250 + dx * .5, y1: 92 + dy * .5, x2: 250 + dx * 1.3, y2: 92 + dy * 1.3, stroke: ORANGE, "stroke-width": 4, "stroke-linecap": "round" })));
          [[-40, 0], [40, 0], [-28, -18], [28, -18]].forEach(([dx, dy]) => els.boom.append(s.el("line", { x1: 220 + dx * .6, y1: 452 + dy * .6, x2: 220 + dx, y2: 452 + dy, stroke: ORANGE, "stroke-width": 4, "stroke-linecap": "round" })));
          svg.append(els.boom, els.spark);
          body.append(els.ll, els.rl, els.torso, els.la, els.ra, els.head);
          const draw = () => {
            const [lx, ly] = pose.lh, [rx, ry] = pose.rh;
            els.la.setAttribute("d", `M150 128 Q${(150 + lx) / 2 - 40} ${(128 + ly) / 2} ${lx} ${ly}`);
            els.ra.setAttribute("d", `M210 128 Q${(210 + rx) / 2 + 40} ${(128 + ry) / 2} ${rx} ${ry}`);
            els.ll.setAttribute("d", `M160 250 L150 350 L140 ${445 - pose.lf}`);
            els.rl.setAttribute("d", `M200 250 L${210 + pose.rf * .3} ${350 - pose.rf * .6} L220 ${445 - pose.rf}`);
            els.spark.setAttribute("opacity", pose.spark);
          };
          draw();
          const poses = {
            stampfen: { lh: [120, 250], rh: [240, 250], lf: 0, rf: 46, spark: 0 },
            patschen: { lh: [150, 300], rh: [210, 300], lf: 0, rf: 0, spark: 0 },
            klatschen: { lh: [174, 170], rh: [186, 170], lf: 0, rf: 0, spark: 0 },
            schnipsen: { lh: [120, 250], rh: [252, 96], lf: 0, rf: 0, spark: 1 },
          };
          const act = name => {
            const target = poses[name], from = JSON.parse(JSON.stringify(pose));
            const mix = (a, b, t) => ({ lh: [s.lerp(a.lh[0], b.lh[0], t), s.lerp(a.lh[1], b.lh[1], t)], rh: [s.lerp(a.rh[0], b.rh[0], t), s.lerp(a.rh[1], b.rh[1], t)], lf: s.lerp(a.lf, b.lf, t), rf: s.lerp(a.rf, b.rf, t), spark: s.lerp(a.spark, b.spark, t) });
            if (name === "stampfen") { pose = mix(from, target, 1); draw(); s.tween({ from: 0, to: 1, dur: 160, ease: "in", update: t => { pose = mix(target, Object.assign({}, target, { rf: 0 }), t); draw(); } }).then(() => { els.boom.setAttribute("opacity", 1); s.tween({ from: 1, to: 0, dur: 300, update: v => els.boom.setAttribute("opacity", v) }); }); }
            else { pose = mix(from, target, 1); draw(); }
            s.tween({ from: 0, to: 1, dur: 260, delay: 160, ease: "out", update: t => { pose = mix(name === "stampfen" ? Object.assign({}, target, { rf: 0 }) : target, idle, t); draw(); } });
          };
          const snd = { stampfen: w => K.stomp(w), patschen: w => K.pat(w), klatschen: w => K.clap(w), schnipsen: w => K.snap(w) };
          const icon = { stampfen: "🦶", patschen: "🦵", klatschen: "👏", schnipsen: "🫰", "": "·" };
          const colr = { stampfen: "#2b3a67", patschen: C, klatschen: ORANGE, schnipsen: GREEN, "": "#c8d3de" };
          const order = ["stampfen", "patschen", "klatschen", "schnipsen", ""];
          const hit = n => { snd[n](0); act(n); };
          const sbtn = [["schnipsen", "Schnipsen · hoch"], ["klatschen", "Klatschen"], ["patschen", "Patschen · Oberschenkel"], ["stampfen", "Stampfen · tief"]].map(([n, lab]) =>
            s.h("button", { class: "btn", style: { borderColor: colr[n], color: colr[n], justifyContent: "flex-start", fontSize: "20px" }, onclick: () => hit(n) }, icon[n] + "  " + lab));
          const pat = ["stampfen", "patschen", "klatschen", "patschen", "stampfen", "stampfen", "klatschen", "schnipsen"];
          const slots = pat.map((n, i) => {
            const b = s.h("button", { class: "nosw", style: { height: "64px", borderRadius: "12px", border: "3px solid " + colr[n], background: "#fff", fontSize: "28px", cursor: "pointer", padding: 0 }, onclick: () => { pat[i] = order[(order.indexOf(pat[i]) + 1) % order.length]; b.textContent = icon[pat[i]]; b.style.borderColor = colr[pat[i]]; if (pat[i]) snd[pat[i]](0); else s.sfx.tick(); } }, icon[n]);
            return b;
          });
          const counts = ["1", "+", "2", "+", "3", "+", "4", "+"].map((t, i) => s.h("span", { style: { textAlign: "center", fontWeight: 700, fontSize: "20px", color: i % 2 ? PENCIL : RED } }, t));
          const play = btn(s, "▶ Muster spielen", () => {
            if (P.playing) { P.stop(); return; }
            play.textContent = "■ Stopp";
            P.play(pat.map((_, i) => ({ b: i * 0.5, d: 0.5, snd: w => pat[i] && snd[pat[i]](w), vis: () => { slots.forEach((x, j) => x.style.background = j === i ? SOFT : "#fff"); if (pat[i]) act(pat[i]); } })), { bpm: 92, length: 4, loop: true, end: () => { play.textContent = "▶ Muster spielen"; slots.forEach(x => x.style.background = "#fff"); } });
          }, true);
          const lane = s.h("div", { class: "later", style: { display: "flex", flexDirection: "column", gap: "6px" } },
            s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: "6px" } }, counts),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: "6px" } }, slots),
            s.h("div", { class: "row" }, play, s.h("span", { class: "small pencil" }, "Tippe ein Feld an, um es zu ändern.")));
          const life = s.h("div", { class: "life later", style: { display: "flex", gap: "14px", alignItems: "center" } }, s.photo("schuhplattler", { w: 200, h: 150, pos: "50% 45%" }),
            s.h("div", null, s.h("span", { class: "exlabel" }, "Im Alltag"), s.h("p", { class: "small" }, "Beim Schuhplattler in den Alpen klopfen Tänzer auf Schenkel und Schuhe. Im Flamenco wird geklatscht und gestampft. Und im Stadion stampfen und klatschen Tausende Fans zusammen.")));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "360px 1fr", alignItems: "center", height: "100%" } }, svg,
            s.h("div", { class: "stack", style: { gap: "12px" } }, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" } }, sbtn), lane, life)));
          s.show(svg, "up"); s.sfx.pop();
          s.step(async () => { for (const n of ["stampfen", "patschen", "klatschen", "schnipsen"]) { hit(n); await s.wait(380); } s.say("Je höher am Körper, desto heller der Klang."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(lane, "up"); play.click(); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* 11b ---------------------------------------------------------------- */
      {
        title: "Im Puls gehen, auf 1 klatschen",
        say: "Bewegung hilft dir, den Puls zu fühlen. Geh bei jedem Schlag einen Schritt. Und klatsch nur auf die Eins.",
        build(s) {
          const K = kit(s), P = Player(s);
          const svg = s.svg(480, 400);
          const dots = [];
          for (let i = 0; i < 4; i++) {
            const x = 240 + (i - 1.5) * 84, c = s.el("circle", { cx: x, cy: 34, r: i === 0 ? 28 : 20, fill: i === 0 ? RED : C, opacity: .3 });
            svg.append(c, s.el("text", { x, y: i === 0 ? 43 : 41, "text-anchor": "middle", "font-size": i === 0 ? 26 : 21, "font-weight": 800, fill: "#fff", text: i + 1 }));
            dots.push(c);
          }
          svg.append(s.el("rect", { x: 0, y: 352, width: 480, height: 44, rx: 10, fill: SOFT }));
          const stripes = s.el("g");
          for (let k = 0; k < 14; k++) stripes.append(s.el("rect", { x: k * 40, y: 366, width: 18, height: 16, rx: 4, fill: "#cdbcf3" }));
          svg.append(stripes);
          const D = dancer(s, C, { x: 240, y: 262, k: 1.45 });
          const burst = s.el("g", { opacity: 0 });
          [[-1, -1], [1, -1], [-1.3, 0], [1.3, 0], [0, -1.4]].forEach(([dx, dy]) => burst.append(s.el("line", { x1: 240 + dx * 30, y1: 172 + dy * 26, x2: 240 + dx * 52, y2: 172 + dy * 44, stroke: ORANGE, "stroke-width": 5, "stroke-linecap": "round" })));
          svg.append(D.g, burst);
          const cap = s.el("text", { x: 240, y: 90, "text-anchor": "middle", "font-size": 22, "font-weight": 700, fill: PENCIL, text: "Drück auf ▶" });
          svg.append(cap);
          let mode = "listen", foot = 0, bpm = 96, off = 0;
          s.loop((t, dt) => { D.tick(dt); if (P.playing && mode !== "listen") { off = (off + dt * 46 * bpm / 60) % 40; stripes.setAttribute("transform", `translate(${-off} 0)`); } });
          const beat = i => {
            dots.forEach((d, j) => d.setAttribute("opacity", j === i ? 1 : .3)); flash(s, dots[i], "r", (i === 0 ? 28 : 20) * 1.3, i === 0 ? 28 : 20, 260);
            if (mode === "listen") { D.go(pose({ dy: 5 }), 22); s.wait(120).then(() => s.alive && D.go(pose({}), 8)); return; }
            foot = 1 - foot;
            const step = foot ? { fL: [-12, 50], hL: [-24, -24], hR: [34, 4] } : { fR: [12, 50], hR: [24, -24], hL: [-34, 4] };
            if (mode === "clap" && i === 0) { D.go(pose(Object.assign({}, step, ARMS.clap)), 26); burst.setAttribute("opacity", 1); s.tween({ from: 1, to: 0, dur: 380, update: v => burst.setAttribute("opacity", v) }); }
            else D.go(pose(step), 12);
          };
          const start = m => {
            mode = m; foot = 0;
            cap.textContent = { listen: "Hör den Puls", walk: "Ein Schritt pro Schlag", clap: "Klatschen auf die 1" }[m];
            P.play([0, 1, 2, 3].map(i => ({ b: i, d: 1, snd: w => {
              K.kick(w, i === 0 ? .8 : .55); if (i === 0) K.note(-24, .35, w, .22); if (i === 2) K.note(-17, .35, w, .2);
              if (mode !== "listen") K.step(w); if (mode === "clap" && i === 0) K.clap(w, .45);
            }, vis: () => beat(i) })).concat([0, 1, 2, 3].map(i => ({ b: i + .5, d: .5, snd: w => K.hat(w) }))), { bpm, length: 4, loop: true, end: () => { dots.forEach(d => d.setAttribute("opacity", .3)); D.go(pose({}), 8); } });
          };
          const bW = btn(s, "▶ Gehen", () => start("walk"), true), bC = btn(s, "▶ + Klatschen", () => start("clap")), bS = btn(s, "■", () => { P.stop(); s.sfx.click(); });
          const sl = s.slider({ label: "Tempo", min: 70, max: 130, step: 2, value: 96, fmt: v => v + " BPM", onInput: v => { bpm = v; P.setBpm(v); } });
          const left = s.h("div", { class: "stack", style: { gap: "8px" } }, svg, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "10px" } }, bW, bC, bS), sl);
          const card = (lab, txt) => s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, lab), s.h("p", { class: "small" }, txt));
          const c1 = card("1 · Hören", "Hör auf die Bassdrum: Sie spielt den Puls. Nick mit dem Kopf mit.");
          const c2 = card("2 · Gehen", "Bei jedem Schlag ein Schritt: links, rechts, links, rechts. Schneller Puls = schnelle Schritte.");
          const c3 = card("3 · Klatschen", "Jetzt klatschst du nur auf die 1. So spürst du, wo jeder Takt anfängt.");
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"),
            s.h("p", { class: "small" }, "Beim Umzug läuft die Blaskapelle im Gleichschritt. Beim Seilspringen gibt das Seil den Puls vor. Und beim Joggen mit Musik kannst du deine Schritte dem Beat anpassen."));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "480px 1fr", alignItems: "center", gap: "30px", height: "100%" } }, left,
            s.h("div", { class: "stack", style: { gap: "12px" } }, s.h("p", { class: "big a-up" }, "Der Körper fühlt den Puls"), c1, c2, c3, life)));
          s.show(svg, "up"); s.sfx.pop();
          s.step(async () => { s.sfx.pop(); await s.show(c1, "left"); start("listen"); s.say("Hör erst nur zu."); });
          s.step(async () => { s.sfx.pop(); await s.show(c2, "left"); start("walk"); s.say("Jetzt gehst du im Puls."); });
          s.step(async () => { s.sfx.pop(); await s.show(c3, "left"); start("clap"); s.say("Und auf die Eins wird geklatscht."); });
          s.step(async () => { P.stop(); s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 11c ---------------------------------------------------------------- */
      {
        title: "Tänze und ihre Takte",
        say: "Jeder Tanz hat seinen Takt. Der Walzer hat drei Schläge, Marsch und Polka haben zwei.",
        build(s) {
          const K = kit(s), P = Player(s);
          const ticks = [];
          s.loop((t, dt) => ticks.forEach(f => f(dt)));
          const mk = (n, name, html, bpm, events, len, moves, label, lead = 0) => {
            const sig = s.h("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", font: "800 36px/1 var(--f-display)", color: C } }, s.h("span", null, String(n)), s.h("span", { style: { borderTop: "4px solid " + C, paddingTop: "3px" } }, "4"));
            const svg = s.svg(300, 170);
            svg.append(s.el("ellipse", { cx: 150, cy: 160, rx: 120, ry: 10, fill: SOFT }));
            const D = dancer(s, n === 3 ? C : n === 2 && name === "Marsch" ? BLUE : ORANGE, { x: 150, y: 100, k: .9 });
            ticks.push(dt => D.tick(dt));
            const ds = [];
            for (let i = 0; i < n; i++) { const c = s.el("circle", { cx: 260 - (n - 1 - i) * 30, cy: 20, r: i === 0 ? 12 : 9, fill: i === 0 ? RED : C, opacity: .3 }); svg.append(c); ds.push(c); }
            svg.append(D.g);
            const b = btn(s, "▶ " + label, () => {
              const ev = events(K).slice();
              let bar = 0;
              for (let q = 0; q < len; q++) ev.push({ b: q, d: 1, vis: () => { const i = (q + lead) % n; if (i === 0) bar++; ds.forEach((d, j) => d.setAttribute("opacity", j === i ? 1 : .3)); D.go(moves(i, bar, q), n === 3 ? 9 : 14); } });
              P.play(ev, { bpm, length: len, end: () => { ds.forEach(d => d.setAttribute("opacity", .3)); D.go(pose({}), 8); } });
            }, true);
            b.style.alignSelf = "center";
            return s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", alignItems: "stretch", gap: "6px", padding: "12px 16px" } },
              s.h("div", { class: "row", style: { flexWrap: "nowrap", justifyContent: "center", gap: "18px" } }, sig, s.h("p", { class: "h2" }, name)), svg,
              s.h("p", { class: "small", style: { flex: 1 }, html }), b);
          };
          // Walzer: Anfang des Donauwalzers (Johann Strauss Sohn, 1867 – gemeinfrei), vereinfacht, D-Dur. Takt 1 beginnt auf Schlag 3 (Auftakt auf 2).
          const D4 = -10, FIS4 = -6, A4 = -3, A5 = 9, FIS5 = 6;
          const walzer = K => {
            const ev = [[2, D4, 1], [3, D4, 1], [4, FIS4, 1], [5, A4, 1], [6, A4, 3], [10, A5, 1], [11, A5, 1], [13, FIS5, 1], [14, FIS5, 1]]
              .map(([b, n, d]) => ({ b, d, snd: (w, sec) => K.note(n, sec * .9, w, .24) }));
            for (let bar = 0; bar < 5; bar++) { const b0 = 3 + bar * 3; ev.push({ b: b0, d: 1, snd: w => K.note(-22, .4, w, .22) }, { b: b0 + 1, d: 1, snd: w => { K.note(-6, .14, w, .08); K.note(-3, .14, w, .08); } }, { b: b0 + 2, d: 1, snd: w => { K.note(-6, .14, w, .08); K.note(-3, .14, w, .08); } }); }
            return ev.map(e => Object.assign({}, e, { b: e.b - 2 }));
          };
          const walzerMove = (i, bar) => i === 0 ? pose(Object.assign({ dy: 6, flip: bar % 2 ? -1 : 1, fL: [-20, 66], fR: [20, 66] }, ARMS.out)) : pose(Object.assign({ dy: -5, flip: bar % 2 ? -1 : 1 }, ARMS.out));
          const marsch = K => {
            const mel = [[0, -5, .5], [.5, 0, .5], [1, 4, .5], [1.5, 0, .5], [2, 7, 1], [3, 4, 1], [4, 5, .5], [4.5, 4, .5], [5, 2, .5], [5.5, -1, .5], [6, 0, 1]];
            const ev = mel.map(([b, n, d]) => ({ b, d, snd: (w, sec) => K.note(n, sec * .8, w, .2) }));
            for (let b = 0; b < 8; b++) ev.push({ b, d: 1, snd: w => { if (b % 2 === 0) { K.kick(w, .8); K.note(b % 4 === 0 ? -24 : -29, .3, w, .2); } else K.snare(w); } });
            return ev;
          };
          const marschMove = i => i === 0 ? pose({ fL: [-12, 40], hL: [-20, -40], hR: [34, 0] }) : pose({ fR: [12, 40], hR: [20, -40], hL: [-34, 0] });
          const polka = K => {
            const mel = [[0, 4, .5], [.5, 5, .5], [1, 7, .5], [1.5, 7, .5], [2, 9, .5], [2.5, 7, .5], [3, 4, 1], [4, 2, .5], [4.5, 4, .5], [5, 5, .5], [5.5, 5, .5], [6, 7, .5], [6.5, 5, .5], [7, 2, 1]];
            const ev = mel.map(([b, n, d]) => ({ b, d, snd: (w, sec) => K.note(n, sec * .8, w, .2) }));
            for (let b = 0; b < 8; b++) ev.push({ b, d: 1, snd: w => { if (b % 2 === 0) K.note(b < 4 ? -24 : -29, .25, w, .22); else { K.note(-8, .12, w, .09); K.note(-5, .12, w, .09); } } });
            return ev;
          };
          const polkaMove = (i, bar, q) => pose(Object.assign({ dy: -14, dx: q % 4 < 2 ? -10 : 10 }, i === 0 ? { fL: [-18, 58], fR: [14, 70] } : { fR: [18, 58], fL: [-14, 70] }, ARMS.hip));
          const cW = mk(3, "Walzer", "<b>Um – pa – pa.</b> Paare drehen sich im Kreis. Johann Strauss (Sohn) schrieb 1867 in Wien den Walzer „An der schönen blauen Donau“. Hier: der Anfang, vereinfacht.", 168, walzer, 16, walzerMove, "Donauwalzer", 2);
          const cM = mk(2, "Marsch", "<b>Links – rechts.</b> Zwei Schläge, wie zwei Füße. Beim „Radetzky-Marsch“ (1848) von Johann Strauss (Vater) klatscht das Publikum im Wiener Neujahrskonzert mit.", 112, marsch, 8, marschMove, "Marsch");
          const cP = mk(2, "Polka", "<b>Hopsen im 2/4-Takt.</b> Die Polka kommt aus Böhmen (um 1830). Johann Strauss (Sohn) schrieb zum Beispiel die „Tritsch-Tratsch-Polka“ (1858).", 120, polka, 8, polkaMove, "Polka");
          cM.classList.add("later"); cP.classList.add("later");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Der Takt verrät den Tanz: ", s.h("b", null, "3 Schläge"), " → Walzer. ", s.h("b", null, "2 Schläge"), " → Marsch oder Polka. Die Musik zeigt den Füßen, was sie tun sollen.");
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%", justifyContent: "center" } }, s.h("div", { class: "cols3" }, cW, cM, cP), merk));
          s.show(cW, "up"); s.sfx.pop();
          s.step(async () => { cW.querySelector("button").click(); s.say("Der Donauwalzer: Um pa pa."); });
          s.step(async () => { s.sfx.pop(); await s.show(cM, "up"); cM.querySelector("button").click(); s.say("Der Marsch: links, rechts."); });
          s.step(async () => { s.sfx.pop(); await s.show(cP, "up"); cP.querySelector("button").click(); s.say("Die Polka hüpft im Zweivierteltakt."); });
          s.step(async () => { P.stop(); s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 11d ---------------------------------------------------------------- */
      {
        title: "Eine Choreografie in Achtern",
        say: "Tänzer zählen in Achtern: acht Schläge sind ein Block. Aus vier Blöcken baut ihr eine Klassen-Choreografie.",
        build(s) {
          const K = kit(s), P = Player(s);
          const cells = Array.from({ length: 8 }, (_, i) => s.h("div", { style: { height: "50px", borderRadius: "12px", border: "3px solid " + (i % 2 ? "#c8d3de" : C), display: "grid", placeItems: "center", font: "800 28px/1 var(--f-display)", color: i % 2 ? PENCIL : C, background: "#fff", transition: "transform .08s" } }, String(i + 1)));
          const cntLab = s.h("span", { class: "t", style: { fontWeight: 700, width: "190px", color: RED } }, "Ein Achter:");
          const counter = s.h("div", { style: { display: "grid", gridTemplateColumns: "190px repeat(8, 1fr)", gap: "8px", alignItems: "center" } }, cntLab, ...cells);
          const svg = s.svg(1100, 236);
          svg.append(s.el("rect", { x: 0, y: 180, width: 1100, height: 56, rx: 14, fill: SOFT }));
          const cols = [C, ORANGE, GREEN, BLUE];
          const ds = [170, 423, 676, 930].map((x, i) => dancer(s, cols[i], { x, y: 112, k: 1.05 }));
          ds.forEach(d => svg.append(d.g));
          s.loop((t, dt) => ds.forEach(d => d.tick(dt)));
          const A = c => { const f = c % 2 ? { fR: [12, 52] } : { fL: [-12, 52] }; const k = c < 4 ? c + 1 : 7 - c; return pose(Object.assign({ dy: k * 7, sc: 1 + k * .045 }, f)); };
          const B = c => { const xs = [34, 34, 68, 68, 34, 34, 0, 0], wide = c % 2 === 0; const dir = c < 4 ? 1 : -1; return pose(Object.assign({ dx: xs[c] }, ARMS.out, wide ? (dir > 0 ? { fR: [44, 70], fL: [-14, 70] } : { fL: [-44, 70], fR: [14, 70] }) : { fL: [-8, 70], fR: [8, 70] })); };
          const C_ = c => pose(c % 2 === 0 ? ARMS.clap : c === 1 || c === 5 ? ARMS.up : c === 3 ? ARMS.out : ARMS.high);
          const D_ = c => c < 4 ? pose({ flip: c % 2 ? 1 : -1, fL: [-8, 70], fR: [8, 70], hL: [-18, -30], hR: [18, -30] }) : c === 4 ? pose({ dy: 14, fL: [-24, 58], fR: [24, 58], hL: [-30, -30], hR: [30, -30] }) : c === 5 ? pose({}) : c === 6 ? pose(ARMS.up) : pose({ hR: [30, -130], hL: [-24, -18], fL: [6, 70], fR: [22, 70] });
          const blocks = [
            ["A", "Vor und zurück", "4 Schritte nach vorn, 4 zurück", A],
            ["B", "Seit-ran", "2× nach rechts, 2× nach links", B],
            ["C", "Klatschen und Arme", "Klatschen auf 1, 3, 5, 7", C_],
            ["D", "Drehen und Pose", "Drehung, Knie wippen, Pose!", D_],
          ];
          const hasClap = (bi, c) => bi === 2 && c % 2 === 0;
          const mark = (c, red) => cells.forEach((e, j) => { e.style.background = j === c ? (red ? RED : C) : "#fff"; e.style.color = j === c ? "#fff" : (j % 2 ? PENCIL : C); e.style.transform = j === c ? "scale(1.08)" : ""; });
          const cards = blocks.map(([L, nm, txt], bi) => {
            const b = s.h("button", { class: "card later", style: { font: "inherit", color: INK, textAlign: "left", cursor: "pointer", padding: "10px 14px", display: "flex", flexDirection: "column", gap: "2px", borderLeft: "8px solid " + cols[bi] }, onclick: () => run([bi]) },
              s.h("span", { class: "t", style: { fontWeight: 800, color: cols[bi] } }, "▶ " + L + " · " + nm), s.h("span", { class: "small" }, txt));
            return b;
          });
          const run = (list, intro = false) => {
            const ev = []; let off = 0;
            if (intro) {
              for (let c = 4; c < 8; c++) ev.push({ b: c - 4, d: 1, snd: w => K.click(w, c === 4), vis: () => { cntLab.textContent = "Einzählen …"; mark(c, true); } });
              off = 4;
            }
            list.forEach((bi, n) => {
              for (let c = 0; c < 8; c++) {
                const b = off + n * 8 + c;
                ev.push({ b, d: 1, snd: w => {
                  if (c % 2 === 0) K.kick(w, c % 4 === 0 ? .8 : .6); else K.snare(w);
                  if (c % 4 === 0) K.note([-24, -19, -17, -24][(n * 2 + c / 4) % 4], .5, w, .2);
                  if (hasClap(bi, c)) K.clap(w, .45);
                }, vis: () => { cntLab.textContent = "Block " + blocks[bi][0] + ":"; cards.forEach((k, j) => k.style.background = j === bi ? SOFT : "#fff"); mark(c); ds.forEach(d => d.go(blocks[bi][3](c), 12)); } });
                ev.push({ b: b + .5, d: .5, snd: w => K.hat(w) });
              }
            });
            P.play(ev, { bpm: 108, length: off + list.length * 8, end: () => { mark(-1); cntLab.textContent = "Ein Achter:"; cards.forEach(k => k.style.background = "#fff"); ds.forEach(d => d.go(pose({}), 8)); } });
          };
          const all = btn(s, "▶ Ganze Choreo", () => run([0, 1, 2, 3], true), true);
          all.classList.add("later");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px", flex: 1 } }, s.h("b", null, "1 Achter = 8 Schläge = 2 Takte"), " im 4/4-Takt. Vor dem Start zählt einer laut ein: „5, 6, 7, 8!“");
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%", justifyContent: "center" } }, counter, svg, s.h("div", { class: "cols4", style: { gap: "12px" } }, cards), s.h("div", { class: "row", style: { flexWrap: "nowrap", alignItems: "stretch" } }, all, merk)));
          s.show(svg, "fade"); s.sfx.whoosh();
          blocks.forEach((_, bi) => s.step(async () => { s.sfx.pop(); await s.show(cards[bi], "up"); run([bi]); s.say(["Block A: vor und zurück.", "Block B: seit ran.", "Block C: klatschen.", "Block D: drehen und Pose."][bi]); }));
          s.step(async () => { s.sfx.ding(); s.show(all, "pop"); await s.show(merk, "up"); s.say("Jetzt alles hintereinander. Fünf, sechs, sieben, acht!"); run([0, 1, 2, 3], true); });
        },
      },
      /* 11e ---------------------------------------------------------------- */
      {
        title: "Tänze aus aller Welt",
        say: "Überall auf der Welt tanzen Menschen. Jeder Tanz hat seinen eigenen Rhythmus.",
        build(s) {
          const K = kit(s), P = Player(s);
          const card = (ph, pos, name, where, html, label, play) => s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "8px", padding: "12px" } },
            s.photo(ph, { w: 322, h: 186, pos }),
            s.h("div", { class: "row", style: { flexWrap: "nowrap", justifyContent: "space-between", gap: "8px" } }, s.h("p", { class: "h2" }, name), s.h("span", { class: "chip" }, where)),
            s.h("p", { class: "small", style: { minHeight: "160px" }, html }), (() => { const b = btn(s, "▶ " + label, play, true); b.style.alignSelf = "flex-start"; return b; })());
          // eigene Rhythmus-Beispiele (keine Originalmusik)
          const sirtaki = () => {
            const ev = []; let b = 0, d = 1;
            for (let i = 0; i < 28; i++) { const bb = b; ev.push({ b: bb, d, snd: w => { K.note(i % 2 ? -17 : -24, .2, w, .2); K.note([0, 2, 4, 2][i % 4], .16, w, .14); if (i % 2 === 0) K.stomp(w); } }); b += d; d = Math.max(.32, d * .94); }
            P.play(ev, { bpm: 92, length: b + .5 });
          };
          const samba = () => {
            const ev = [];
            for (let bar = 0; bar < 4; bar++) {
              const o = bar * 2;
              ev.push({ b: o, d: 1, snd: w => K.note(-29, .2, w, .14) }, { b: o + 1, d: 1, snd: w => { K.kick(w, .9); K.note(-24, .35, w, .24); } });
              for (let k = 0; k < 8; k++) ev.push({ b: o + k * .25, d: .25, snd: w => K.hat(w) });
              [0, .5, .75, 1.25, 1.5].forEach(x => ev.push({ b: o + x, d: .25, snd: w => K.clap(w, .22) }));
            }
            P.play(ev, { bpm: 100, length: 8 });
          };
          const hiphop = () => {
            const ev = [];
            for (let bar = 0; bar < 2; bar++) {
              const o = bar * 4;
              [0, 1.75, 2.5].forEach(x => ev.push({ b: o + x, d: .5, snd: w => K.kick(w, .9) }));
              [1, 3].forEach(x => ev.push({ b: o + x, d: 1, snd: w => { K.snare(w); K.clap(w, .25); } }));
              for (let k = 0; k < 8; k++) ev.push({ b: o + k * .5, d: .5, snd: w => K.hat(w) });
              ev.push({ b: o, d: 2, snd: w => K.note(-27, .8, w, .22) }, { b: o + 2.5, d: 1.5, snd: w => K.note(-24, .6, w, .2) });
            }
            P.play(ev, { bpm: 90, length: 8 });
          };
          const c1 = card("sirtaki-reihe", "50% 60%", "Sirtaki", "Griechenland", "Erfunden <b>1964</b> für den Film „Alexis Sorbas“ (Musik: Mikis Theodorakis). Alle tanzen in einer Reihe, die Arme auf den Schultern der Nachbarn. Die Musik wird <b>immer schneller</b>.", "immer schneller", sirtaki);
          const c2 = card("samba-rio", "50% 50%", "Samba", "Brasilien", "Im <b>2/4-Takt</b>, mit vielen Trommeln. Die Wurzeln liegen in afrikanischen Rhythmen. Seit etwa 1920 ist Samba der wichtigste Tanz beim <b>Karneval in Rio</b>.", "Samba-Rhythmus", samba);
          const c3 = card("breakdance", "50% 40%", "Hip-Hop", "USA", "Entstand in den <b>1970er-Jahren</b> in der Bronx in New York. Dazu gehören Rap, DJing, Breakdance und Graffiti. Meist <b>4/4-Takt</b> mit hartem Beat.", "Hip-Hop-Beat", hiphop);
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "In Berlin"),
            s.h("p", { class: "small" }, "Beim Karneval der Kulturen (seit 1996, jedes Jahr zu Pfingsten) ziehen Sambagruppen, Blaskapellen und viele andere Tanzgruppen durch die Stadt. Die Beispiele hier sind selbst gebaute Rhythmen, keine Originalmusik."));
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%", justifyContent: "center" } }, s.h("div", { class: "cols3", style: { gap: "16px" } }, c1, c2, c3), life));
          s.sfx.whoosh();
          s.step(async () => { s.sfx.pop(); await s.show(c1, "up"); sirtaki(); s.say("Sirtaki aus Griechenland. Hör, wie es immer schneller wird."); });
          s.step(async () => { s.sfx.pop(); await s.show(c2, "up"); samba(); s.say("Samba aus Brasilien."); });
          s.step(async () => { s.sfx.pop(); await s.show(c3, "up"); hiphop(); s.say("Hip-Hop aus New York."); });
          s.step(async () => { P.stop(); s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 12 ----------------------------------------------------------------- */
      {
        title: "Die Synkope",
        say: "Bei einer Synkope rutscht die Betonung zwischen die Schläge. Das klingt frech und tanzbar.",
        build(s) {
          const K = kit(s), P = Player(s);
          const CW = 116;
          const lane = (lab, blocks) => {
            const svg = s.svg(1100, 128);
            svg.append(s.el("text", { x: 0, y: 30, "font-size": 22, "font-weight": 700, fill: INK, text: lab }));
            ["1", "+", "2", "+", "3", "+", "4", "+"].forEach((t, i) => svg.append(s.el("text", { x: 150 + i * CW + CW / 2, y: 30, "text-anchor": "middle", "font-size": 21, "font-weight": 700, fill: i % 2 ? PENCIL : RED, text: t })));
            const rs = blocks.map(([start, len, acc]) => {
              const r = s.el("rect", { x: 150 + start * 2 * CW + 4, y: 44, width: len * 2 * CW - 8, height: 70, rx: 12, fill: acc ? RED : C, opacity: .55 });
              svg.append(r);
              if (acc) svg.append(s.el("text", { x: 150 + start * 2 * CW + len * CW, y: 89, "text-anchor": "middle", "font-size": 24, "font-weight": 800, fill: "#fff", text: ">" }));
              return r;
            });
            const playIt = () => {
              const ev = blocks.map(([start, len, acc], i) => ({ b: start, d: len, snd: w => { K.clap(w, acc ? 0.4 : 0.2); K.note(acc ? 7 : 0, Math.min(0.5, len * 0.6), w, acc ? 0.24 : 0.14); }, vis: () => { rs.forEach(r => r.setAttribute("opacity", .55)); rs[i].setAttribute("opacity", 1); } }));
              for (let r = 0; r < 2; r++) for (let b = 0; b < 4; b++) ev.push({ b: r * 4 + b, d: 1, snd: w => K.kick(w, 0.45) });
              const ev2 = ev.concat(blocks.map(([start, len, acc], i) => ({ b: start + 4, d: len, snd: w => { K.clap(w, acc ? 0.4 : 0.2); K.note(acc ? 7 : 0, Math.min(0.5, len * 0.6), w, acc ? 0.24 : 0.14); }, vis: () => { rs.forEach(r => r.setAttribute("opacity", .55)); rs[i].setAttribute("opacity", 1); } })));
              P.play(ev2, { bpm: 96, length: 8, end: () => rs.forEach(r => r.setAttribute("opacity", .55)) });
            };
            svg.style.cursor = "pointer"; svg.addEventListener("click", playIt);
            return { svg, playIt };
          };
          const A = lane("Normal", [[0, 1, 1], [1, 1, 0], [2, 1, 0], [3, 1, 0]]);
          const B = lane("Synkope", [[0, 0.5, 0], [0.5, 1, 1], [1.5, 0.5, 0], [2, 1, 0], [3, 1, 0]]);
          B.svg.classList.add("later");
          const pA = btn(s, "▶ normal", A.playIt), pB = btn(s, "▶ mit Synkope", B.playIt, true);
          pB.classList.add("later");
          const sy = s.h("div", { class: "card soft later", style: { display: "flex", alignItems: "center", gap: "18px" } },
            s.h("p", { class: "t" }, "Kodály-Silben: ", s.h("b", null, "Syn – co – pa"), " = Achtel – Viertel – Achtel. Die lange Note in der Mitte beginnt auf dem „+“ – zwischen den Schlägen."));
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"),
            s.h("p", { class: "small" }, "Synkopen gibt es in fast allen Musikstilen – besonders oft in Jazz, Blues, Funk und Reggae. Sie machen Lust zu tanzen."));
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%", justifyContent: "center" } }, A.svg, B.svg, s.h("div", { class: "row" }, pA, pB, s.h("span", { class: "small pencil" }, "Die Bassdrum spielt den Puls. Rot = betont.")), sy, life));
          s.show(A.svg, "left"); s.sfx.whoosh();
          s.step(async () => { s.sfx.pop(); s.show(pB, "pop"); await s.show(B.svg, "left"); B.playIt(); s.say("Hörst du? Die Betonung kommt zu früh, zwischen den Schlägen."); });
          s.step(async () => { s.sfx.ding(); await s.show(sy, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* 13 ----------------------------------------------------------------- */
      {
        title: "Im Alltag: Rhythmus überall",
        say: "Rhythmus ist überall. Tippe auf die Karten und hör genau hin.",
        build(s) {
          const K = kit(s), P = Player(s);
          const card = (ph, ttl, txt, bpm, events, len, n) => {
            const dots = s.svg(220, 40), ds = [];
            for (let i = 0; i < n; i++) { const c = s.el("circle", { cx: 110 + (i - (n - 1) / 2) * 40, cy: 20, r: i === 0 ? 14 : 10, fill: i === 0 ? RED : C, opacity: .3 }); dots.append(c); ds.push(c); }
            const b = btn(s, "▶ anhören", () => {
              const ev = events(K).concat(Array.from({ length: len }, (_, i) => ({ b: i, d: 1, vis: () => ds.forEach((d, j) => d.setAttribute("opacity", j === i % n ? 1 : .3)) })));
              P.play(ev, { bpm, length: len, loop: false, end: () => ds.forEach(d => d.setAttribute("opacity", .3)) });
            }, true);
            return s.h("div", { class: "life later", style: { display: "flex", flexDirection: "column", gap: "8px" } },
              s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "14px", alignItems: "flex-start" } }, s.photo(ph, { w: 230, h: 165, pos: "50% 50%" }),
                s.h("div", { style: { flex: 1 } }, s.h("p", { class: "h2" }, ttl), s.h("p", { class: "small" }, txt))), s.h("div", { class: "row", style: { justifyContent: "space-between", flexWrap: "nowrap" } }, dots, b));
          };
          const rep = (k, f) => Array.from({ length: k }, (_, i) => f(i)).flat();
          const c1 = card("stethoscope", "Herzschlag", "„Ba-dumm, ba-dumm“: dein eigener Puls. Nach dem Sport wird er schneller.", 75, K => rep(8, i => ({ b: i, d: 1, snd: w => K.heart(w) })), 8, 4);
          const c2 = card("stadium-fans", "Fans im Stadion", "Tausende klatschen genau zusammen – weil alle denselben Puls fühlen.", 120, K => rep(4, i => [{ b: i * 4, d: 1, snd: w => K.clap(w) }, { b: i * 4 + 1, d: 1, snd: w => K.clap(w) }, { b: i * 4 + 2, d: 0.5, snd: w => K.clap(w) }, { b: i * 4 + 2.5, d: 0.5, snd: w => K.clap(w) }, { b: i * 4 + 3, d: 1, snd: w => K.clap(w) }, { b: i * 4, d: 1, snd: w => K.stomp(w) }, { b: i * 4 + 2, d: 1, snd: w => K.stomp(w) }]), 16, 4);
          const c3 = card("opera-ball", "Walzer auf dem Ball", "Paare drehen sich im 3/4-Takt: Um – pa – pa, Um – pa – pa.", 168, K => rep(6, i => [{ b: i * 3, d: 1, snd: w => K.note(-24, 0.45, w, 0.28) }, { b: i * 3 + 1, d: 1, snd: w => { K.note(-5, 0.14, w, 0.1); K.note(0, 0.14, w, 0.1); } }, { b: i * 3 + 2, d: 1, snd: w => { K.note(-5, 0.14, w, 0.1); K.note(0, 0.14, w, 0.1); } }]), 18, 3);
          const c4 = card("headphones", "Deine Lieblingslieder", "Pop, Rap und Rock: fast immer 4/4-Takt. Nick mit dem Kopf – das ist der Puls!", 96, K => rep(4, i => [{ b: i * 4, d: 1, snd: w => K.kick(w) }, { b: i * 4 + 1, d: 1, snd: w => K.snare(w) }, { b: i * 4 + 2, d: 1, snd: w => K.kick(w) }, { b: i * 4 + 2.5, d: 1, snd: w => K.kick(w, 0.5) }, { b: i * 4 + 3, d: 1, snd: w => K.snare(w) }, ...[0, 1, 2, 3, 4, 5, 6, 7].map(h => ({ b: i * 4 + h / 2, d: 0.5, snd: w => K.hat(w) }))]), 16, 4);
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", height: "100%", alignContent: "center" } }, c1, c2, c3, c4));
          [c1, c2, c3, c4].forEach((c, i) => s.step(async () => { s.sfx.count(i); await s.show(c, "pop"); }));
        },
      },
      /* 14 ----------------------------------------------------------------- */
      {
        title: "Das hast du gelernt",
        say: "Super! Du kennst jetzt Puls, Tempo, Notenwerte, Takt, Auftakt und Synkope.",
        build(s) {
          const K = kit(s), P = Player(s);
          const tile = (ttl, txt, fn, i) => s.h("button", { class: "card a-pop", style: { "--d": i * 90 + "ms", textAlign: "left", font: "inherit", color: INK, cursor: "pointer", display: "flex", flexDirection: "column", gap: "6px" }, onclick: fn },
            s.h("span", { class: "h2", style: { color: C } }, "▶ " + ttl), s.h("span", { class: "small" }, txt));
          const pulse = () => P.play(Array.from({ length: 8 }, (_, i) => ({ b: i, d: 1, snd: w => K.click(w, i % 4 === 0) })), { bpm: 100, length: 8 });
          const tempo = () => P.play(Array.from({ length: 12 }, (_, i) => ({ b: i < 4 ? i : 4 + (i - 4) * 0.4, d: 1, snd: w => K.click(w) })), { bpm: 60, length: 8 });
          const vals = () => P.play([[0, 2], [2, 1], [3, 0.5], [3.5, 0.25], [3.75, 0.25]].map(([b, d]) => ({ b, d, snd: (w, sec) => K.note(0, sec * 0.9, w) })), { bpm: 80, length: 4 });
          const takt = () => P.play(Array.from({ length: 12 }, (_, i) => ({ b: i, d: 1, snd: w => i % 3 === 0 ? K.note(-24, 0.4, w, 0.28) : K.note(-5, 0.12, w, 0.1) })), { bpm: 160, length: 12 });
          const auft = () => P.play([[0, -5], [1, 0], [2, 4], [3, 7], [4, 4]].map(([b, n]) => ({ b, d: 1, snd: w => K.note(n, 0.3, w) })).concat([1, 2, 3, 4].map(b => ({ b, d: 1, snd: w => K.click(w, b === 1) }))), { bpm: 96, length: 5 });
          const syn = () => P.play([[0, 0.5], [0.5, 1], [1.5, 0.5], [2, 1], [3, 1]].map(([b, d]) => ({ b, d, snd: w => K.clap(w) })).concat([0, 1, 2, 3].map(b => ({ b, d: 1, snd: w => K.kick(w, 0.4) }))), { bpm: 96, length: 4 });
          const tiles = [
            ["Puls", "Gleichmäßiger Grundschlag – wie dein Herz.", pulse],
            ["Tempo", "Schläge pro Minute: von Largo bis Presto.", tempo],
            ["Notenwerte", "Ganze, Halbe, Viertel, Achtel, Sechzehntel.", vals],
            ["Takt", "2/4, 3/4, 4/4 – die 1 ist betont.", takt],
            ["Auftakt", "Das Lied beginnt vor der ersten Eins.", auft],
            ["Synkope", "Betonung zwischen den Schlägen.", syn],
          ].map(([a, b, f], i) => tile(a, b, f, i));
          const merk = s.h("div", { class: "merk later" }, "In der Instrumentalklasse brauchst du das jeden Tag: ", s.h("b", null, "Puls fühlen, Takt zählen, Pausen mitzählen"), " – dann spielt das ganze Orchester zusammen.");
          s.add(s.h("div", { class: "stack", style: { gap: "18px", height: "100%", justifyContent: "center" } }, s.h("div", { class: "cols3" }, tiles), merk));
          s.sfx.success();
          s.step(async () => { s.sfx.fanfare(); await s.show(merk, "up"); s.confetti(590, 400, 80); });
        },
      },
    ],
  });
})();
