/* Kapitel 1 – Klang und Schall (Musik Klasse 5) */
(() => {
  const COL = "#1d5bd0";
  const TAU = Math.PI * 2;

  /* ---------- audio helpers (respect mute + check mode) ---------- */
  function play(s, freq, dur = 0.8, o = {}) {
    if (!s.sfx.on || s.fast || !s.alive) return;
    const ac = s.sfx.unlock(); if (!ac) return;
    const t = ac.currentTime + (o.when || 0);
    const osc = ac.createOscillator();
    if (o.harm) {
      const re = new Float32Array(o.harm.length + 1), im = new Float32Array(o.harm.length + 1);
      o.harm.forEach((a, i) => { im[i + 1] = a; });
      osc.setPeriodicWave(ac.createPeriodicWave(re, im));
    } else osc.type = o.type || "sine";
    osc.frequency.setValueAtTime(freq, t);
    if (o.slideTo) osc.frequency.exponentialRampToValueAtTime(o.slideTo, t + dur);
    const g = ac.createGain();
    const v = Math.max(0.0002, (o.vol == null ? 0.25 : o.vol) * 0.55);
    const env = o.env || "hold";
    g.gain.setValueAtTime(0.0001, t);
    if (env === "pluck") {
      g.gain.exponentialRampToValueAtTime(v, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    } else if (env === "swell") {
      const v0 = Math.max(0.0002, (o.v0 == null ? 0.01 : o.v0) * 0.55), v1 = Math.max(0.0002, (o.v1 == null ? 0.4 : o.v1) * 0.55);
      g.gain.exponentialRampToValueAtTime(v0, t + 0.03);
      g.gain.linearRampToValueAtTime(v1, t + dur - 0.06);
      g.gain.linearRampToValueAtTime(0.0001, t + dur);
    } else {
      g.gain.exponentialRampToValueAtTime(v, t + (o.attack || 0.02));
      g.gain.setValueAtTime(v, t + Math.max(0.03, dur - 0.08));
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    }
    osc.connect(g); g.connect(ac.destination);
    osc.start(t); osc.stop(t + dur + 0.05);
    s.onLeave(() => { try { osc.stop(); } catch (e) {} });
  }
  const noise = (s, dur, vol, f0, f1, when = 0, q = 1.2) => { if (s.alive) s.sfx.noise(dur, vol, f0, f1, when, q); };
  const HARM = { geige: [1, .6, .45, .35, .28, .22, .18, .14], floete: [1, .25, .08, .03], klar: [1, 0, .45, 0, .25, 0, .12], pluck: [1, .55, .35, .22, .14, .09], glocke: [1, .2, .55, .1, .35, .05, .2] };
  function pluck(s, f, dur = 1.4, vol = .3, when = 0) { play(s, f, dur, { harm: HARM.pluck, env: "pluck", vol, when }); }
  function drum(s, when = 0, vol = .5) { play(s, 140, .35, { env: "pluck", vol, slideTo: 55, when }); noise(s, .08, .15, 1800, 900, when); }
  function snare(s, when = 0) { noise(s, .18, .3, 2500, 1500, when, .8); play(s, 220, .1, { env: "pluck", vol: .2, when }); }
  function hihat(s, when = 0) { noise(s, .05, .12, 8000, 9000, when, 2); }
  function knall(s, when = 0) { noise(s, .12, .6, 3000, 400, when, .5); play(s, 90, .2, { env: "pluck", vol: .5, slideTo: 40, when }); }

  /* ---------- drawing helpers ---------- */
  const shapes = {
    sine: u => Math.sin(TAU * u),
    tri: u => { const p = ((u % 1) + 1) % 1; return p < .25 ? p * 4 : p < .75 ? 2 - p * 4 : p * 4 - 4; },
    square: u => Math.tanh(Math.sin(TAU * u) * 9),
    saw: u => { const p = ((u + .5) % 1 + 1) % 1; return 2 * p - 1; },
  };
  function drawWave(g, w, h, fn, { color = COL, lw = 4, mid = h / 2, clear = true, axis = true } = {}) {
    if (clear) g.clearRect(0, 0, w, h);
    if (axis) { g.strokeStyle = "#c8d3de"; g.lineWidth = 2; g.beginPath(); g.moveTo(0, mid); g.lineTo(w, mid); g.stroke(); }
    g.strokeStyle = color; g.lineWidth = lw; g.lineJoin = "round"; g.beginPath();
    for (let x = 0; x <= w; x += 2) { const y = mid - fn(x / w); if (x === 0) g.moveTo(x, y); else g.lineTo(x, y); }
    g.stroke();
  }
  const card = (s, cls, label, ...kids) => s.h("div", { class: cls }, label ? s.h("span", { class: "exlabel" }, label) : null, ...kids);
  const wig = (s, el) => { el.classList.remove("a-pop"); void el.getBoundingClientRect(); el.classList.add("a-pop"); };

  const slides = [];

  /* 1 ---------------------------------------------------------------- */
  slides.push({
    title: "Was ist Schall?",
    say: "Schall ist Schwingung. Eine Saite schwingt, schubst die Luft an, und die Welle wandert bis zu deinem Ohr.",
    build(s) {
      const W = 1100, H = 320;
      const { canvas, g } = s.canvas(W, H);
      canvas.style.borderRadius = "18px"; canvas.style.background = "#fff"; canvas.style.border = "2px solid #c8d3de";
      const parts = [];
      for (let cx = 0; cx < 30; cx++) for (let r = 0; r < 10; r++) parts.push({ x: 190 + cx * 24 + ((r * 7 + cx * 3) % 9 - 4), y: 46 + r * 25 + ((cx * 5 + r) % 7 - 3) });
      let tp = -10, airOn = false, earOn = false, now = 0;
      const pl = () => { tp = now; s.sound("guitar-pluck"); };
      const draw = () => {
        const dt = now - tp, amp = dt >= 0 ? Math.exp(-dt * 1.1) : 0;
        g.clearRect(0, 0, W, H);
        // string
        g.fillStyle = "#8a5a2b"; g.fillRect(60, 18, 60, 10); g.fillRect(60, H - 28, 60, 10);
        g.strokeStyle = "#b8860b"; g.lineWidth = 5; g.beginPath();
        for (let y = 28; y <= H - 28; y += 4) { const u = (y - 28) / (H - 56); const x = 90 + 26 * amp * Math.sin(Math.PI * u) * Math.sin(TAU * 7 * dt); if (y === 28) g.moveTo(x, y); else g.lineTo(x, y); }
        g.stroke();
        // air
        const speed = 260, front = dt * speed;
        for (const p of parts) {
          let dx = 0;
          const d = p.x - 150;
          if (airOn && d < front) dx = 9 * Math.exp(-Math.max(0, dt - d / speed) * .9) * Math.sin(TAU * (d / 120) - TAU * 2.2 * dt);
          g.fillStyle = airOn && d < front && dt < 4 ? "#1d5bd0" : "#9fb3d6";
          g.beginPath(); g.arc(p.x + dx, p.y, 4, 0, TAU); g.fill();
        }
        // ear
        g.strokeStyle = "#c46a4a"; g.lineWidth = 9; g.lineCap = "round";
        g.beginPath(); g.arc(1010, 160, 70, Math.PI * .62, Math.PI * 1.42); g.stroke();
        g.lineWidth = 6; g.beginPath(); g.arc(1018, 160, 36, Math.PI * .7, Math.PI * 1.35); g.stroke();
        const reach = earOn && front > 830 ? Math.exp(-(dt - 830 / speed) * .9) : 0;
        g.strokeStyle = "#dc3b2a"; g.lineWidth = 6; g.beginPath();
        const ex = 1046 + 7 * reach * Math.sin(TAU * 7 * dt);
        g.moveTo(ex, 132); g.lineTo(ex, 188); g.stroke();
      };
      s.loop(t => { now = t; draw(); });
      draw();
      const steps = [
        ["1", "Die Saite schwingt", "Sie zittert ganz schnell hin und her."],
        ["2", "Die Luft wird geschubst", "Die Luftteilchen stoßen sich an – eine Welle wandert los."],
        ["3", "Das Ohr hört", "Dein Trommelfell schwingt mit. Dein Gehirn macht daraus einen Ton."],
      ].map(([n, a, b]) => s.h("div", { class: "card later", style: { padding: "12px 18px" } },
        s.h("p", { class: "t", style: { fontWeight: 700 } }, s.h("span", { class: "blue" }, n + " "), a), s.h("p", { class: "small" }, b)));
      const btn = s.h("button", { class: "btn solid", onclick: () => { s.sfx.unlock(); pl(); } }, "Saite zupfen");
      const merk = s.h("div", { class: "merk later", style: { flex: 1 } }, s.h("b", null, "Schall"), " ist eine Schwingung, die durch die Luft bis zu deinem Ohr wandert.");
      s.add(s.h("div", { class: "stack", style: { gap: "14px" } }, canvas, s.h("div", { class: "cols3" }, steps), s.h("div", { class: "row", style: { flexWrap: "nowrap" } }, btn, merk)));
      s.step(async () => { await s.show(steps[0], "up"); pl(); s.say("Die Saite schwingt hin und her."); });
      s.step(async () => { airOn = true; await s.show(steps[1], "up"); pl(); s.say("Sie schubst die Luftteilchen an."); });
      s.step(async () => { earOn = true; await s.show(steps[2], "up"); pl(); s.say("Die Welle erreicht dein Ohr."); });
      s.step(async () => { s.sfx.ding(); await s.show(merk, "pop"); });
    },
  });

  /* 2 ---------------------------------------------------------------- */
  slides.push({
    title: "Schwingungen sehen",
    say: "Schwingungen kann man manchmal sehen. Tippe auf die Beispiele.",
    build(s) {
      // speaker with rice
      const a = s.svg(300, 170);
      const cone = s.el("g", null, s.el("ellipse", { cx: 150, cy: 120, rx: 120, ry: 34, fill: "#2a3550" }), s.el("ellipse", { cx: 150, cy: 120, rx: 86, ry: 24, fill: "#46557a" }), s.el("ellipse", { cx: 150, cy: 120, rx: 36, ry: 10, fill: "#1b2740" }));
      const rice = []; for (let i = 0; i < 14; i++) { const r = s.el("ellipse", { cx: 70 + (i * 37) % 160, cy: 104 + (i * 13) % 26, rx: 5, ry: 3, fill: "#fff8e1", stroke: "#b9a46a", "stroke-width": 1 }); rice.push(r); }
      a.append(cone, ...rice);
      const b = s.svg(300, 170);
      b.append(s.el("rect", { x: 0, y: 100, width: 150, height: 24, fill: "#b07a45" }), s.el("rect", { x: 20, y: 124, width: 16, height: 46, fill: "#8a5a2b" }));
      const ruler = s.el("g", null, s.el("rect", { x: 70, y: 90, width: 220, height: 12, fill: "#ffd94a", stroke: "#c7a000", "stroke-width": 2 }));
      for (let i = 0; i < 11; i++) ruler.append(s.el("line", { x1: 80 + i * 20, y1: 90, x2: 80 + i * 20, y2: 97, stroke: "#5d6678", "stroke-width": 2 }));
      const hand = s.el("rect", { x: 96, y: 72, width: 40, height: 18, rx: 8, fill: "#e8b58f" });
      b.append(ruler, hand);
      const c = s.svg(300, 170);
      c.append(s.el("rect", { x: 40, y: 120, width: 220, height: 50, rx: 6, fill: "#bfe3f5" }));
      const fork = s.el("g", null, s.el("path", { d: "M135 20 V95 Q150 110 165 95 V20", fill: "none", stroke: "#8f9aab", "stroke-width": 9, "stroke-linecap": "round" }), s.el("line", { x1: 150, y1: 105, x2: 150, y2: 150, stroke: "#8f9aab", "stroke-width": 9 }));
      fork.setAttribute("transform", "translate(0,-40)");
      const drops = []; for (let i = 0; i < 8; i++) { const d = s.el("circle", { cx: 150, cy: 118, r: 5, fill: "#4aa3d8", opacity: 0 }); drops.push(d); }
      c.append(fork, ...drops);
      let runs = { a: false, b: false, c: false };
      const actA = async () => {
        if (runs.a) return; runs.a = true;
        for (let k = 0; k < 4; k++) drum(s, k * .25, .55);
        await s.tween({ dur: 1100, ease: "linear", update: (v, t) => {
          cone.setAttribute("transform", `translate(0,${Math.sin(t * TAU * 8) * 3})`);
          rice.forEach((r, i) => r.setAttribute("transform", `translate(0,${-Math.abs(Math.sin(t * TAU * 4 + i)) * 26 * (1 - t * .3)})`));
        } });
        rice.forEach(r => r.removeAttribute("transform")); cone.removeAttribute("transform"); runs.a = false;
      };
      const actB = async () => {
        if (runs.b) return; runs.b = true;
        s.sound("ruler-twang");
        await s.tween({ dur: 1400, ease: "linear", update: (v, t) => ruler.setAttribute("transform", `rotate(${Math.sin(t * TAU * 12) * 14 * (1 - t)} 136 96)`) });
        ruler.removeAttribute("transform"); runs.b = false;
      };
      const actC = async () => {
        if (runs.c) return; runs.c = true;
        s.sound("tuning-fork", { dur: 2 });
        await s.tween({ dur: 500, ease: "out", update: v => fork.setAttribute("transform", `translate(${Math.sin(v * 80) * 2},${-40 + v * 40})`) });
        s.sound("splash", { vol: .45, dur: 1.2 });
        drops.forEach((d, i) => d.setAttribute("opacity", 1));
        await s.tween({ dur: 800, ease: "linear", update: (v, t) => drops.forEach((d, i) => { const ang = -Math.PI * (.15 + .7 * i / 7); d.setAttribute("cx", 150 + Math.cos(ang) * 120 * t); d.setAttribute("cy", 118 + Math.sin(ang) * 110 * t + 160 * t * t); d.setAttribute("opacity", 1 - t); }) });
        fork.setAttribute("transform", "translate(0,-40)"); runs.c = false;
      };
      const ex = [
        [a, "Lautsprecher", "Leg Reiskörner auf die Membran: Sie hüpfen!", actA],
        [b, "Lineal", "Drück es an die Tischkante und schnipp: Es brummt.", actB],
        [c, "Stimmgabel", "Halt die klingende Gabel ins Wasser: Es spritzt!", actC],
      ].map(([svg, name, txt, fn], i) => card(s, "ex" + (i ? " later" : ""), "Beispiel " + (i + 1),
        s.h("p", { class: "h2" }, name), svg, s.h("p", { class: "small", style: { minHeight: "54px" } }, txt),
        s.h("button", { class: "btn", style: { width: "100%" }, onclick: fn }, "Antippen")));
      ex.forEach(e => { e.style.display = "flex"; e.style.flexDirection = "column"; e.style.gap = "6px"; });
      const merk = s.h("div", { class: "merk later" }, "Summ mit der Hand am Hals: Es kribbelt. Deine ", s.h("b", null, "Stimmbänder"), " schwingen. Ohne Schwingung gibt es keinen Schall.");
      s.add(s.h("div", { class: "stack", style: { gap: "14px" } }, s.h("div", { class: "cols3" }, ex), merk));
      s.show(ex[0], "up");
      s.step(async () => { s.sfx.swoosh(); await s.show(ex[1], "up"); });
      s.step(async () => { s.sfx.swoosh(); await s.show(ex[2], "up"); });
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.say("Ohne Schwingung gibt es keinen Schall."); });
    },
  });

  /* 2b --------------------------------------------------------------- */
  slides.push({
    title: "Schwingungen in echt",
    say: "So sieht man Schwingungen in echt: Sand auf einer Metallplatte, eine Stimmgabel und die Spur, die sie zeichnet.",
    build(s) {
      const items = [
        ["chladni-plate", "Chladni-Platte", "Ein Geigenbogen streicht über die Platte. Der Sand hüpft weg und bleibt dort liegen, wo die Platte still hält.", "50% 45%"],
        ["tuning-fork-resonator", "Stimmgabel", "Angeschlagen schwingen die beiden Zinken. Der Holzkasten darunter macht den Ton lauter.", "50% 40%"],
        ["tuning-fork-trace", "Schwingung als Spur", "Eine Nadel an der Stimmgabel kratzt ihre Schwingung in Ruß auf eine Glasplatte: lauter Wellen!", "50% 50%"],
      ];
      const cards = items.map(([id, n, d, pos], i) => s.h("div", { class: "card" + (i ? " later" : ""), style: { display: "flex", flexDirection: "column", gap: "8px", padding: "12px" } },
        s.photo(id, { w: "100%", h: 320, pos, caption: n }), s.h("p", { class: "small" }, d)));
      const fork = s.soundBtn("tuning-fork", "Stimmgabel hören");
      const merk = s.h("div", { class: "merk later", style: { flex: 1 } }, "Diese Klangfiguren hat ", s.h("b", null, "Ernst Chladni"), " aus Wittenberg 1787 beschrieben. Seitdem kann man Schwingungen ", s.h("b", null, "sehen"), ".");
      s.add(s.h("div", { class: "stack", style: { gap: "14px" } }, s.h("div", { class: "cols3" }, cards), s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "18px" } }, fork, merk)));
      s.sound("ruler-twang", { vol: .5 });
      s.step(async () => { s.sound("tuning-fork", { dur: 2.5 }); await s.show(cards[1], "zoom"); });
      s.step(async () => { s.sfx.scribble(); await s.show(cards[2], "zoom"); });
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
    },
  });

  /* 3 ---------------------------------------------------------------- */
  slides.push({
    title: "Ton, Klang, Geräusch, Knall",
    say: "Es gibt vier Schallarten: Ton, Klang, Geräusch und Knall. Tippe auf jede Karte und hör genau hin.",
    build(s) {
      const kinds = [
        { n: "Ton", f: u => 34 * Math.sin(TAU * 3 * u), d: "eine ganz reine Schwingung", ex: "Stimmgabel, Hörtest beim Ohrenarzt, Piepton", snd: () => s.sound("tuning-fork", { dur: 1.8 }) },
        { n: "Klang", f: u => 22 * (Math.sin(TAU * 3 * u) + .5 * Math.sin(TAU * 6 * u) + .3 * Math.sin(TAU * 9 * u)), d: "viele Töne zusammen, regelmäßig", ex: "Geige, Gitarre, deine Singstimme", snd: () => s.sound("violin-a4", { dur: 2 }) },
        { n: "Geräusch", f: u => 30 * Math.sin(u * 517) * Math.sin(u * 211 + 1) * Math.cos(u * 97), d: "ganz unregelmäßig, ohne Muster", ex: "Rauschen in der U-Bahn, Wind, Regen", snd: () => s.sound("rain", { vol: .6, dur: 2.2 }) },
        { n: "Knall", f: u => u < .3 ? 0 : 42 * Math.exp(-(u - .3) * 22) * Math.sin(u * 300), d: "kurz, sehr stark, schnell vorbei", ex: "Luftballon platzt, Tür knallt, Feuerwerk", snd: () => s.sound("balloon-pop") },
      ];
      const cards = kinds.map((k, i) => {
        const { canvas, g } = s.canvas(220, 100);
        drawWave(g, 220, 100, k.f, { color: i < 2 ? COL : "#dc3b2a", lw: 3 });
        const el = s.h("button", { class: "card later", style: { textAlign: "left", font: "inherit", color: "inherit", cursor: "pointer", display: "flex", flexDirection: "column", gap: "8px", padding: "14px 14px" },
          onclick: () => { k.snd(); wig(s, canvas); } },
          s.h("p", { class: "h2", style: { color: i < 2 ? COL : "#dc3b2a" } }, k.n), canvas,
          s.h("p", { class: "small", style: { fontWeight: 700 } }, k.d),
          s.h("p", { class: "small pencil" }, k.ex));
        return el;
      });
      const merk = s.h("div", { class: "merk later" }, s.h("b", { class: "blue" }, "Ton und Klang"), " schwingen regelmäßig – das ist Musik. ", s.h("b", { class: "red" }, "Geräusch und Knall"), " schwingen unregelmäßig.");
      s.add(s.h("div", { class: "stack" }, s.h("p", { class: "t" }, "Tippe auf eine Karte: Du hörst den Schall und siehst seine Schwingung."), s.h("div", { class: "cols4" }, cards), merk));
      cards.forEach((c, i) => s.step(async () => { kinds[i].snd(); await s.show(c, "up"); s.say(kinds[i].n + ": " + kinds[i].d); }));
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
    },
  });

  /* 4 ---------------------------------------------------------------- */
  slides.push({
    title: "Vier Eigenschaften",
    say: "Jeder Ton hat vier Eigenschaften: Tonhöhe, Tondauer, Lautstärke und Klangfarbe.",
    build(s) {
      const ico = (draw) => { const v = s.svg(200, 110); v.setAttribute("width", 200); v.setAttribute("height", 130); draw(v); return v; };
      const props = [
        { n: "Tonhöhe", d: "hoch oder tief", ex: "Pfiff hoch, Brummbär tief", svg: ico(v => { v.append(s.el("circle", { cx: 60, cy: 86, r: 14, fill: COL }), s.el("circle", { cx: 140, cy: 24, r: 14, fill: COL }), s.el("path", { d: "M78 78 L124 34", stroke: "#5d6678", "stroke-width": 4, "marker-end": "" })); }),
          demo: () => { play(s, 196, .5, { harm: HARM.floete }); play(s, 784, .5, { harm: HARM.floete, when: .55 }); } },
        { n: "Tondauer", d: "lang oder kurz", ex: "Gong lang, Klopfen kurz", svg: ico(v => { v.append(s.el("rect", { x: 14, y: 40, width: 40, height: 30, rx: 8, fill: COL }), s.el("rect", { x: 70, y: 40, width: 116, height: 30, rx: 8, fill: COL })); }),
          demo: () => { s.sound("knock", { dur: .7 }); s.sound("gong", { when: .9, dur: 3, vol: .7 }); } },
        { n: "Lautstärke", d: "laut oder leise", ex: "Flüstern leise, Jubel laut", svg: ico(v => { v.append(s.el("path", { d: "M20 55 L180 20 L180 90 Z", fill: COL, opacity: .85 })); }),
          demo: () => { play(s, 440, 1.4, { env: "swell", v0: .02, v1: .5, harm: HARM.floete }); } },
        { n: "Klangfarbe", d: "weich, hell, rau …", ex: "Geige klingt anders als Flöte", svg: ico(v => { [["#1d5bd0", 30], ["#dc3b2a", 80], ["#138a5a", 130], ["#ee7a1a", 175]].forEach(([c, x]) => v.append(s.el("circle", { cx: x, cy: 55, r: 22, fill: c, opacity: .85 }))); }),
          demo: () => { play(s, 440, .45, { type: "sine" }); play(s, 440, .45, { type: "square", vol: .12, when: .5 }); play(s, 440, .45, { type: "sawtooth", vol: .14, when: 1 }); } },
      ];
      const tiles = props.map(p => s.h("button", { class: "card later", style: { font: "inherit", color: "inherit", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }, onclick: e => { p.demo(); wig(s, p.svg); } },
        p.svg, s.h("p", { class: "h2" }, p.n), s.h("p", { class: "t pencil" }, p.d), s.h("p", { class: "small", style: { textAlign: "center", minHeight: "54px" } }, p.ex), s.h("span", { class: "chip" }, "▶ anhören")));
      const life = card(s, "life later", "Im Alltag", s.h("p", { class: "t" }, "Dein Handy-Klingelton hat alle vier: Er hat hohe und tiefe Töne, lange und kurze, er wird lauter – und er klingt anders als der deiner Freundin."));
      s.add(s.h("div", { class: "stack", style: { gap: "22px" } }, s.h("div", { class: "cols4" }, tiles), life));
      tiles.forEach((t, i) => s.step(async () => { props[i].demo(); await s.show(t, "pop"); s.say(props[i].n + ": " + props[i].d); }));
      s.step(async () => { s.sound("ringtone", { dur: 2.6, vol: .6 }); await s.show(life, "up"); });
    },
  });

  /* 5 ---------------------------------------------------------------- */
  slides.push({
    title: "Tonhöhe: die Frequenz",
    say: "Schiebe den Regler. Je mehr Schwingungen pro Sekunde, desto höher klingt der Ton.",
    build(s) {
      const W = 600, H = 330;
      const { canvas, g } = s.canvas(W, H);
      canvas.style.background = "#fff"; canvas.style.border = "2px solid #c8d3de"; canvas.style.borderRadius = "18px";
      let f = 440, ph = 0, last = 0, hold = 0;
      const toF = v => Math.round(55 * Math.pow(2, v / 20));
      const big = s.h("p", { class: "huge mono", style: { color: COL } }, "440 Hz");
      const what = s.h("p", { class: "t" }, "mittel");
      const label = ff => ff < 150 ? "sehr tief – wie ein Bass" : ff < 330 ? "tief" : ff < 700 ? "mittel" : ff < 1300 ? "hoch" : "sehr hoch – wie ein Pfiff";
      const set = v => { f = toF(v); big.textContent = s.fmt(f) + " Hz"; what.textContent = label(f); const n = performance.now(); if (n - last > 140) { last = n; play(s, f, .18, { vol: .22 }); } };
      const sl = s.slider({ label: "Tonhöhe", min: 0, max: 100, value: 60, fmt: v => s.fmt(toF(v)) + " Hz", onInput: set });
      s.loop((t, dt) => {
        ph += dt * Math.min(f, 1800) / 400;
        const cyc = Math.max(.6, f / 110);
        drawWave(g, W, H, u => 120 * Math.sin(TAU * (u * cyc - ph)), { lw: 5 });
      });
      const hear = s.h("button", { class: "btn solid", onclick: () => play(s, f, 1.2, { vol: .3 }) }, "▶ Ton hören");
      const presets = [[110, "tief"], [440, "a′ = 440 Hz"], [1760, "hoch"]].map(([hz, l]) => s.h("button", { class: "btn", onclick: () => { sl.set(Math.round(20 * Math.log2(hz / 55))); play(s, hz, .8, { vol: .3 }); } }, l));
      const merk = s.h("div", { class: "merk later" }, "Viele Schwingungen pro Sekunde = ", s.h("b", null, "hoher Ton"), ". Wenige = ", s.h("b", null, "tiefer Ton"), ". Man misst sie in ", s.h("b", null, "Hertz (Hz)"), ".");
      const life = card(s, "life later", "Im Alltag", s.h("p", { class: "small" }, "Vor dem Konzert stimmt das Orchester auf den Ton a′. Er hat meist 440 Hz – 440 Schwingungen in einer Sekunde!"));
      s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "600px 1fr", alignItems: "start" } }, s.h("div", { class: "stack" }, canvas, s.h("div", { class: "row" }, presets)),
        s.h("div", { class: "stack", style: { gap: "12px" } }, big, what, sl, s.h("div", { class: "row", style: { flexWrap: "nowrap" } }, hear, s.soundBtn("tuning-fork", "Stimmgabel")), merk, life)));
      sl.set(60);
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
      s.step(async () => { sl.set(Math.round(20 * Math.log2(440 / 55))); s.sound("orchestra-tuning", { vol: .7 }); await s.show(life, "up"); });
    },
  });

  /* 6 ---------------------------------------------------------------- */
  slides.push({
    title: "Was dein Ohr hören kann",
    say: "Menschen hören ungefähr von 20 bis 20.000 Hertz. Tippe auf die Punkte.",
    build(s) {
      const W = 1100, H = 300, x0 = 60, x1 = 1040;
      const X = hz => x0 + (x1 - x0) * Math.log10(hz / 20) / 3;
      const v = s.svg(W, H);
      const grad = s.el("linearGradient", { id: "hg1", x1: 0, x2: 1 }, s.el("stop", { offset: 0, "stop-color": "#7b4fd6" }), s.el("stop", { offset: 1, "stop-color": "#ee7a1a" }));
      v.append(s.el("defs", null, grad));
      const bar = s.el("rect", { x: x0, y: 132, width: x1 - x0, height: 34, rx: 17, fill: "url(#hg1)", class: "later" });
      v.append(bar);
      const ticks = [[20, "20 Hz"], [100, "100 Hz"], [1000, "1.000 Hz"], [20000, "20.000 Hz"]].map(([hz, l]) =>
        s.el("text", { x: X(hz), y: 196, "text-anchor": hz === 20 ? "start" : hz === 20000 ? "end" : "middle", class: "lbl", text: l }));
      const tickG = s.el("g", { class: "later" }, ...ticks); v.append(tickG);
      const pts = [[55, "Bass-Brummen", 0], [262, "c′", 1], [440, "a′", 0], [2000, "Pfeifen", 1], [8000, "Zischen", 0], [15000, "sehr hoch", 1]];
      const marks = pts.map(([hz, l, up]) => {
        const x = X(hz), y = up ? 70 : 250;
        const gEl = s.el("g", { class: "later", style: { cursor: "pointer" }, onclick: () => { play(s, hz, 1, { vol: hz > 5000 ? .2 : .3 }); s.sfx.pop(); wig(s, dot); } });
        const dot = s.el("circle", { cx: x, cy: 149, r: 15, fill: "#fff", stroke: "#1b2740", "stroke-width": 4 });
        gEl.append(s.el("line", { x1: x, y1: up ? 86 : 166, x2: x, y2: up ? 134 : 222, stroke: "#5d6678", "stroke-width": 2, "stroke-dasharray": "4 4" }),
          s.el("rect", { x: x - 62, y: y - 24, width: 124, height: 40, rx: 12, fill: "#e4ecfb" }),
          s.el("text", { x, y: y + 4, "text-anchor": "middle", class: "lbl", text: l }), dot);
        return gEl;
      });
      v.append(...marks);
      const merk = s.h("div", { class: "merk later" }, "Menschen hören etwa von ", s.h("b", null, "20 Hz bis 20.000 Hz"), ". Kinder hören hohe Töne oft besser – im Alter wird der Bereich kleiner.");
      const life = card(s, "life later", "Darüber und darunter", s.h("p", { class: "small" }, "Tiefer als 20 Hz heißt ", s.h("b", null, "Infraschall"), ", höher als 20.000 Hz ", s.h("b", null, "Ultraschall"), ". Den hörst du nicht – aber Hunde und Fledermäuse hören Ultraschall."));
      const bat = s.photo("bat", { w: 300, h: 220, pos: "50% 55%", caption: "Wasserfledermaus", cls: "later" });
      s.add(s.h("div", { class: "stack", style: { gap: "12px" } }, v, s.h("div", { class: "cols", style: { gridTemplateColumns: "1.1fr 1fr 300px", alignItems: "start" } }, merk, life, bat)));
      s.show(bar, "fade"); s.show(tickG, "fade", 200);
      s.step(async () => { for (let i = 0; i < marks.length; i++) { s.show(marks[i], "pop"); s.sfx.count(i); await s.wait(160); } });
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
      s.step(async () => { s.sfx.whoosh(); s.show(bat, "zoom"); await s.show(life, "up"); });
    },
  });

  /* 7 ---------------------------------------------------------------- */
  slides.push({
    title: "Tondauer: lang oder kurz",
    say: "Töne können lang oder kurz sein. Tippe auf ein Beispiel und sieh, wie lange jeder Ton klingt.",
    build(s) {
      const W = 1100, H = 170, x0 = 20, PX = 300; // px per second
      const v = s.svg(W, H);
      v.append(s.el("rect", { x: 0, y: 0, width: W, height: H, rx: 18, fill: "#fff", stroke: "#c8d3de", "stroke-width": 2 }));
      for (let k = 0; k <= 3; k++) v.append(s.el("line", { x1: x0 + k * PX, y1: 20, x2: x0 + k * PX, y2: 140, stroke: "#c8d3de", "stroke-width": 2 }), s.el("text", { x: x0 + k * PX + 6, y: 160, class: "lbl", style: { fill: "#5d6678", fontSize: "19px" }, text: k + " s" }));
      const barsG = s.el("g"); v.append(barsG);
      const head = s.el("line", { x1: x0, y1: 14, x2: x0, y2: 146, stroke: "#dc3b2a", "stroke-width": 5, opacity: 0 }); v.append(head);
      const pats = {
        klingel: { n: "Fahrradklingel", ev: [[0, .12, 2093], [.2, .12, 2093]], snd: (t, d, f) => play(s, f, .35, { harm: HARM.glocke, env: "pluck", vol: .25, when: t }) },
        gong: { n: "Schulgong", ev: [[0, 1.2, 659], [1.3, 1.6, 523]], snd: (t, d, f) => play(s, f, d + .3, { harm: HARM.glocke, env: "pluck", vol: .3, when: t }) },
        hupe: { n: "Autohupe", ev: [[0, .2, 415], [.35, .2, 415], [.7, 1.4, 415]], snd: (t, d, f) => { play(s, f, d, { type: "sawtooth", vol: .12, when: t }); play(s, f * 1.26, d, { type: "sawtooth", vol: .08, when: t }); } },
      };
      let busy = false;
      const run = async key => {
        if (busy) return; busy = true;
        const p = pats[key];
        barsG.innerHTML = "";
        p.ev.forEach(([t, d]) => barsG.append(s.el("rect", { x: x0 + t * PX, y: 52, width: Math.max(14, d * PX), height: 56, rx: 12, fill: d >= .8 ? "#1d5bd0" : "#ee7a1a" })));
        p.ev.forEach(([t, d, f]) => p.snd(t, d, f));
        const end = Math.max(...p.ev.map(([t, d]) => t + d));
        head.setAttribute("opacity", 1);
        await s.tween({ dur: end * 1000, ease: "linear", update: x => { head.setAttribute("x1", x0 + x * PX); head.setAttribute("x2", x0 + x * PX); } , from: 0, to: end });
        head.setAttribute("opacity", 0); busy = false;
      };
      const btns = Object.keys(pats).map((k, i) => s.h("button", { class: "btn" + (i ? " later" : ""), style: { flex: 1 }, onclick: () => run(k) }, "▶ " + pats[k].n));
      const keyRow = s.h("div", { class: "row", style: { gap: "28px" } }, s.h("span", { class: "chip", style: { background: "#fde5cf" } }, "orange = kurzer Ton"), s.h("span", { class: "chip" }, "blau = langer Ton"));
      const merk = s.h("div", { class: "merk later" }, "Die ", s.h("b", null, "Tondauer"), " sagt, wie lange ein Ton klingt. In den Noten zeigt die ", s.h("b", null, "Form der Note"), ", wie lang er ist – das lernst du später genau.");
      const life = s.h("div", { class: "life later" },
        s.h("span", { class: "exlabel" }, "Im Alltag"), s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "16px" } }, s.h("p", { class: "small", style: { flex: 1 } }, "Der Wecker piept kurz-kurz-kurz, ein Schiffshorn tutet lang. Auch Silben sind kurz oder lang: „Ba-na-ne“ – das „na“ ist am längsten."),
        s.soundBtn("alarm-clock", "Wecker"), s.soundBtn("ship-horn", "Schiffshorn")));
      s.add(s.h("div", { class: "stack" }, v, keyRow, s.h("div", { class: "row", style: { flexWrap: "nowrap" } }, btns), merk, life));
      run("klingel");
      s.step(async () => { s.show(btns[1], "pop"); await run("gong"); });
      s.step(async () => { s.show(btns[2], "pop"); await run("hupe"); });
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
      s.step(async () => { s.sound("alarm-clock", { dur: 1.5, vol: .5 }); await s.show(life, "up"); });
    },
  });

  /* 8 ---------------------------------------------------------------- */
  const DYN = [["pp", "pianissimo", "sehr leise", .03], ["p", "piano", "leise", .07], ["mp", "mezzopiano", "halb leise", .13], ["mf", "mezzoforte", "halb laut", .22], ["f", "forte", "laut", .34], ["ff", "fortissimo", "sehr laut", .5]];
  slides.push({
    title: "Lautstärke und Dynamik",
    say: "Je größer die Schwingung, desto lauter der Ton. In den Noten zeigen italienische Zeichen, wie laut man spielt.",
    build(s) {
      const W = 520, H = 260;
      const { canvas, g } = s.canvas(W, H);
      canvas.style.background = "#fff"; canvas.style.border = "2px solid #c8d3de"; canvas.style.borderRadius = "18px";
      let lvl = 3, amp = 0, ph = 0;
      s.loop((t, dt) => { ph += dt * 1.2; const target = 15 + lvl * 21; amp = s.fast ? target : amp + (target - amp) * Math.min(1, dt * 6); drawWave(g, W, H, u => amp * Math.sin(TAU * (u * 4 - ph)), { lw: 5 }); });
      const rows = DYN.map(([sym, it, de]) => s.h("tr", null, s.h("td", { style: { font: "italic 800 30px/1 Georgia, serif", width: "70px", height: "52px", color: "#1b2740" } }, sym), s.h("td", { style: { font: "600 20px/1.2 var(--f-body)", width: "150px", height: "52px", textAlign: "left", paddingLeft: "10px" } }, it), s.h("td", { style: { font: "600 20px/1.2 var(--f-body)", width: "130px", height: "52px", textAlign: "left", paddingLeft: "10px" } }, de)));
      const table = s.h("table", { class: "tafel" }, rows);
      const mark = i => rows.forEach((r, k) => [...r.children].forEach(td => { td.style.background = k === i ? "#ffd94a" : "#fff"; }));
      const hear = () => play(s, 440, .9, { harm: HARM.floete, vol: DYN[lvl][3] });
      const sl = s.slider({ label: "Lautstärke", min: 0, max: 5, value: 3, fmt: v => DYN[v][0] + " – " + DYN[v][2], onInput: v => { lvl = v; mark(v); hear(); } });
      mark(3);
      const btn = s.h("button", { class: "btn solid", onclick: hear }, "▶ hören");
      const merk = s.h("div", { class: "merk later" }, "Großer Ausschlag = ", s.h("b", null, "laut"), ". Kleiner Ausschlag = ", s.h("b", null, "leise"), ". Die Zeichen dafür heißen ", s.h("b", null, "Dynamik"), ".");
      s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "520px 1fr", alignItems: "start" } },
        s.h("div", { class: "stack", style: { gap: "10px" } }, canvas, sl, btn),
        s.h("div", { class: "stack", style: { gap: "14px" } }, table, merk)));
      s.step(async () => { for (let i = 0; i < 6; i++) { if (!s.alive) return; sl.set(i); await s.wait(500); } });
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
    },
  });

  /* 9 ---------------------------------------------------------------- */
  slides.push({
    title: "Crescendo und Decrescendo",
    say: "Crescendo heißt: immer lauter werden. Decrescendo heißt: immer leiser werden.",
    build(s) {
      const mk = (cresc) => {
        const v = s.svg(460, 130); v.setAttribute("height", 150);
        const p = s.el("path", { d: cresc ? "M30 65 L430 18 M30 65 L430 112" : "M30 18 L430 65 M30 112 L430 65", stroke: "#1b2740", "stroke-width": 7, "stroke-linecap": "round", fill: "none" });
        const fillP = s.el("path", { d: cresc ? "M30 65 L430 18 L430 112 Z" : "M30 18 L430 65 L30 112 Z", fill: COL, opacity: .18 });
        const clip = s.el("rect", { x: 0, y: 0, width: 0, height: 130, fill: "#ffd94a", opacity: .45 });
        v.append(clip, fillP, p);
        return { v, p, clip };
      };
      const A = mk(true), B = mk(false);
      const run = async (o, cresc) => {
        play(s, 392, 2.4, { env: "swell", v0: cresc ? .02 : .5, v1: cresc ? .5 : .02, harm: HARM.geige });
        await s.tween({ dur: 2400, ease: "linear", update: x => o.clip.setAttribute("width", x * 460) });
        o.clip.setAttribute("width", 0);
      };
      const box = (o, name, de, cresc, later) => s.h("div", { class: "card" + (later ? " later" : ""), style: { display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" } },
        s.h("p", { class: "h2", style: { fontStyle: "italic" } }, name), o.v, s.h("p", { class: "t" }, de),
        s.h("button", { class: "btn solid", onclick: () => run(o, cresc) }, "▶ anhören"));
      const c1 = box(A, "crescendo", "immer lauter werden", true, false), c2 = box(B, "decrescendo", "immer leiser werden", false, true);
      const lifes = [["U-Bahn fährt ein", "Erst leise, dann immer lauter – crescendo.", () => s.sound("subway-arrive", { vol: .7 })],
        ["Krankenwagen fährt weg", "Das Martinshorn wird leiser – decrescendo.", () => s.sound("siren-pass", { from: 1, dur: 7, vol: .6 })],
        ["Applaus im Konzert", "Erst klatschen wenige, dann alle.", () => s.sound("applause", { vol: .6, dur: 4.5 })]]
        .map(([t, d, f]) => s.h("button", { class: "life later", style: { textAlign: "left", font: "inherit", color: "inherit", cursor: "pointer" }, onclick: f }, s.h("span", { class: "exlabel" }, "Im Alltag ▶"), s.h("p", { class: "small", style: { fontWeight: 700 } }, t), s.h("p", { class: "small" }, d)));
      const merk9 = s.h("div", { class: "merk later" }, "Die ", s.h("b", null, "Gabel"), " in den Noten: Geht sie auf, wird es lauter. Geht sie zu, wird es leiser.");
      s.add(s.h("div", { class: "stack", style: { gap: "16px" } }, s.h("div", { class: "cols" }, c1, c2), merk9, s.h("div", { class: "cols3" }, lifes)));
      s.step(async () => { await run(A, true); });
      s.step(async () => { s.show(c2, "up"); await run(B, false); });
      s.step(async () => { s.sfx.ding(); await s.show(merk9, "up"); });
      s.step(async () => { s.sfx.whoosh(); await s.show(lifes, "up"); });
    },
  });

  /* 10 --------------------------------------------------------------- */
  slides.push({
    title: "Klangfarbe",
    say: "Viermal derselbe Ton a, aber jedes Mal eine andere Klangfarbe. Tippe und vergleiche.",
    build(s) {
      const kinds = [
        { n: "weich", t: "sine", f: shapes.sine, d: "rund – wie eine Stimmgabel", vol: .3 },
        { n: "sanft", t: "triangle", f: shapes.tri, d: "ein bisschen wie eine Flöte", vol: .3 },
        { n: "hohl", t: "square", f: shapes.square, d: "wie ein altes Videospiel", vol: .12 },
        { n: "scharf", t: "sawtooth", f: shapes.saw, d: "kratzig – ein bisschen wie Streicher", vol: .14 },
      ];
      const cols = ["#1d5bd0", "#138a5a", "#7b4fd6", "#dc3b2a"];
      const cards = kinds.map((k, i) => {
        const { canvas, g } = s.canvas(220, 110);
        drawWave(g, 220, 110, u => 40 * k.f(u * 3), { color: cols[i], lw: 4 });
        return s.h("button", { class: "card" + (i ? " later" : ""), style: { font: "inherit", color: "inherit", cursor: "pointer", display: "flex", flexDirection: "column", gap: "8px", padding: "14px", textAlign: "left" }, onclick: () => { play(s, 440, 1, { type: k.t, vol: k.vol }); wig(s, canvas); } },
          s.h("p", { class: "h2", style: { color: cols[i] } }, k.n), canvas, s.h("p", { class: "small" }, k.d), s.h("span", { class: "chip" }, "▶ a′ = 440 Hz"));
      });
      const merk = s.h("div", { class: "merk later" }, "Gleiche Tonhöhe, gleiche Lautstärke – und trotzdem klingt es anders. Das ist die ", s.h("b", null, "Klangfarbe"), ". Die Form der Schwingung macht den Unterschied.");
      const life = card(s, "life later", "Im Alltag", s.h("p", { class: "small" }, "Am Telefon erkennst du Mama, Papa oder deinen besten Freund sofort – jede Stimme hat ihre eigene Klangfarbe. Genauso klingen Geige und Flöte verschieden."),
        s.h("div", { class: "row", style: { marginTop: "8px" } }, s.soundBtn("violin-a4", "Geige"), s.soundBtn("flute-a-scale", "Querflöte", { dur: 3.2 })));
      s.add(s.h("div", { class: "stack" }, s.h("div", { class: "cols4" }, cards), s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 1fr" } }, merk, life)));
      play(s, 440, .8, { vol: .3 });
      cards.slice(1).forEach((c, i) => s.step(async () => { const k = kinds[i + 1]; play(s, 440, .9, { type: k.t, vol: k.vol }); await s.show(c, "up"); }));
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
      s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
    },
  });

  /* 11 --------------------------------------------------------------- */
  slides.push({
    title: "Obertöne",
    say: "Eine Saite schwingt nicht nur als Ganzes, sondern auch in Hälften, Dritteln und Vierteln. Das sind die Obertöne.",
    build(s) {
      const base = 220;
      const on = [true, false, false, false];
      const amps = [1, .5, .33, .25];
      const vs = s.svg(440, 330);
      const strs = [0, 1, 2, 3].map(k => {
        const y = 50 + k * 78;
        const gEl = s.el("g", { class: k ? "later" : "" });
        const path = s.el("path", { fill: "none", stroke: ["#1d5bd0", "#138a5a", "#7b4fd6", "#ee7a1a"][k], "stroke-width": 5 });
        gEl.append(s.el("circle", { cx: 30, cy: y, r: 6, fill: "#1b2740" }), s.el("circle", { cx: 410, cy: y, r: 6, fill: "#1b2740" }), path);
        vs.append(gEl);
        return { y, path, gEl };
      });
      const W = 560, H = 210;
      const { canvas, g } = s.canvas(W, H);
      canvas.style.background = "#fff"; canvas.style.border = "2px solid #c8d3de"; canvas.style.borderRadius = "18px";
      const sum = u => on.reduce((a, o, k) => a + (o ? amps[k] * Math.sin(TAU * (k + 1) * 2 * u) : 0), 0);
      s.loop(t => {
        strs.forEach((st, k) => { let d = ""; for (let x = 0; x <= 380; x += 5) { const y = st.y + 26 * Math.sin(Math.PI * (k + 1) * x / 380) * Math.sin(t * TAU * .8 * (k + 1)) * (on[k] ? 1 : .15); d += (x ? "L" : "M") + (30 + x) + " " + y.toFixed(1); } st.path.setAttribute("d", d); });
        drawWave(g, W, H, u => 44 * sum(u), { lw: 4 });
      });
      const hear = () => { const h = amps.map((a, k) => on[k] ? a : 0); if (h.some(x => x)) play(s, base, 1.4, { harm: h, vol: .3 }); };
      const names = ["Grundton 220 Hz", "1. Oberton 440 Hz", "2. Oberton 660 Hz", "3. Oberton 880 Hz"];
      const btns = names.map((n, k) => { const b = s.h("button", { class: "btn" + (k ? " later" : " solid"), onclick: () => { on[k] = !on[k]; b.classList.toggle("solid", on[k]); hear(); } }, n); return b; });
      const merk = s.h("div", { class: "merk later" }, "Ein ", s.h("b", null, "Klang"), " = Grundton + Obertöne. Wie stark die Obertöne sind, bestimmt die ", s.h("b", null, "Klangfarbe"), ".");
      s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "440px 1fr", alignItems: "start" } }, s.h("div", { class: "stack" }, vs, s.h("p", { class: "small pencil" }, "Die Saite schwingt in 1, 2, 3 und 4 Teilen.")),
        s.h("div", { class: "stack", style: { gap: "12px" } }, canvas, s.h("div", { class: "cols", style: { gap: "10px" } }, btns), merk)));
      hear();
      [1, 2, 3].forEach(k => s.step(async () => { on[k] = true; btns[k].classList.add("solid"); s.show(strs[k].gEl, "fade"); await s.show(btns[k], "pop"); hear(); }));
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
    },
  });

  /* 12 --------------------------------------------------------------- */
  slides.push({
    title: "So klingen Instrumente",
    say: "Bei jedem Instrument schwingt etwas anderes: eine Saite, die Luft in einem Rohr, ein Fell oder das Instrument selbst.",
    build(s) {
      const groups = [
        { n: "Saite", ex: "Geige, Cello, Gitarre, Harfe", ph: ["violin", "Geige", "50% 50%"], go: () => s.sound("violin-a4", { dur: 2.2 }) },
        { n: "Luftsäule", ex: "Flöte, Klarinette, Trompete", ph: ["flute-playing", "Querflöte", "60% 50%"], go: () => s.sound("flute-a-scale", { dur: 2.4 }) },
        { n: "Fell", ex: "Trommel, Pauke, Bongo", ph: ["timpani", "Pauken", "50% 55%"], go: () => s.sound("timpani-roll", { dur: 3, vol: .8 }) },
        { n: "Platte und Stab", ex: "Xylophon, Marimba, Glocke", ph: ["marimba", "Marimba", "50% 50%"], go: () => s.sound("xylophone-sweep") },
      ];
      const cards = groups.map((gr, i) => {
        const fig = s.photo(gr.ph[0], { w: "100%", h: 170, pos: gr.ph[2], caption: gr.ph[1] });
        return s.h("button", { class: "card later", style: { font: "inherit", color: "inherit", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "12px" }, onclick: () => { gr.go(); wig(s, fig); } },
          s.h("p", { class: "h2", style: { color: COL } }, gr.n), fig, s.h("p", { class: "small", style: { textAlign: "center", minHeight: "54px" } }, gr.ex), s.h("span", { class: "chip" }, "▶ anhören"));
      });
      const life = card(s, "life later", "Deine Instrumentalklasse", s.h("p", { class: "t" }, "Am Ende von Klasse 5 wählst du ein ", s.h("b", null, "Streichinstrument"), " (da schwingt eine Saite) oder ein ", s.h("b", null, "Blasinstrument"), " (da schwingt eine Luftsäule)."));
      const merk12 = s.h("div", { class: "merk later" }, "Bei jedem Instrument schwingt etwas: eine ", s.h("b", null, "Saite"), ", die ", s.h("b", null, "Luft"), " in einem Rohr, ein ", s.h("b", null, "Fell"), " oder das ", s.h("b", null, "Material selbst"), ".");
      s.add(s.h("div", { class: "stack", style: { gap: "16px" } }, s.h("div", { class: "cols4" }, cards), merk12, life));
      cards.forEach((cd, i) => s.step(async () => { groups[i].go(); await s.show(cd, "up"); }));
      s.step(async () => { s.sfx.ding(); await s.show(merk12, "up"); });
      s.step(async () => { s.sfx.fanfare(); await s.show(life, "up"); });
    },
  });

  /* 13 --------------------------------------------------------------- */
  slides.push({
    title: "Echo: Schall braucht Zeit",
    say: "Schall ist schnell, aber nicht unendlich schnell. In der Luft schafft er etwa 343 Meter pro Sekunde.",
    build(s) {
      const W = 1100, H = 250, xk = 90;
      let dist = 170;
      const v = s.svg(W, H);
      v.append(s.el("rect", { x: 0, y: 200, width: W, height: 50, fill: "#cfe8c4" }));
      const kid = s.el("g", null, s.el("circle", { cx: xk, cy: 120, r: 22, fill: "#e8b58f" }), s.el("rect", { x: xk - 20, y: 145, width: 40, height: 55, rx: 12, fill: COL }));
      v.append(kid);
      const wallX = d => xk + 40 + d * 2.6;
      const wall = s.el("path", { fill: "#9a8f80", stroke: "#6b6255", "stroke-width": 3 }); v.append(wall);
      const setWall = () => { const x = wallX(dist); wall.setAttribute("d", `M${x} 200 L${x + 14} 40 L${x + 60} 20 L${x + 90} 200 Z`); };
      const arcOut = s.el("path", { fill: "none", stroke: "#1d5bd0", "stroke-width": 6, "stroke-linecap": "round", opacity: 0 });
      const arcBack = s.el("path", { fill: "none", stroke: "#dc3b2a", "stroke-width": 6, "stroke-linecap": "round", opacity: 0 });
      v.append(arcOut, arcBack);
      const arc = (x, dir) => `M${x} 80 Q${x + 26 * dir} 125 ${x} 170`;
      const read = s.h("p", { class: "t", style: { minHeight: "34px" } });
      const upd = () => { const tt = 2 * dist / 343; read.innerHTML = `Hin und zurück: 2 · ${dist} m = <b>${2 * dist} m</b> → Echo nach <b>${s.fmt(tt, 1)} s</b>`; setWall(); };
      const sl = s.slider({ label: "Abstand zur Felswand", min: 20, max: 340, step: 10, value: 170, fmt: x => x + " m", onInput: x => { dist = x; upd(); } });
      let busy = false;
      const shout = async () => {
        if (busy) return; busy = true;
        const tt = 2 * dist / 343;
        s.sound("hello-shout"); s.sound("hello-shout", { vol: .3, when: tt });
        const xw = wallX(dist);
        arcOut.setAttribute("opacity", 1);
        await s.tween({ from: xk + 30, to: xw, dur: tt * 500, ease: "linear", update: x => arcOut.setAttribute("d", arc(x, 1)) });
        arcOut.setAttribute("opacity", 0); arcBack.setAttribute("opacity", 1);
        await s.tween({ from: xw, to: xk + 30, dur: tt * 500, ease: "linear", update: x => arcBack.setAttribute("d", arc(x, -1)) });
        arcBack.setAttribute("opacity", 0); busy = false;
      };
      const btn = s.h("button", { class: "btn solid", style: { minWidth: "200px" }, onclick: shout }, "„Hallo!“ rufen");
      const merk = s.h("div", { class: "merk later" }, "Schall läuft in der Luft etwa ", s.h("b", null, "343 m pro Sekunde"), " (bei 20 °C). Prallt er an einer Wand ab, hörst du ein ", s.h("b", null, "Echo"), ".");
      const life = card(s, "life later", "Im Alltag: Gewitter", s.h("p", { class: "small" }, "Zähl die Sekunden zwischen Blitz und Donner. ", s.h("b", null, "3 Sekunden ≈ 1 km"), ". Im Wasser ist Schall übrigens über 4-mal so schnell: etwa 1.484 m/s."));
      upd();
      s.add(s.h("div", { class: "stack", style: { gap: "10px" } }, v, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "24px" } }, s.h("div", { style: { flex: 1 } }, sl), btn), read,
        s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 1fr" } }, merk, life)));
      s.step(async () => { await shout(); });
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
      s.step(async () => { s.sound("thunder", { dur: 4, vol: .7 }); await s.show(life, "up"); });
    },
  });

  /* 14 --------------------------------------------------------------- */
  slides.push({
    title: "Wie laut ist das?",
    say: "Lautstärke misst man in Dezibel. Ab etwa 85 Dezibel kann lauter Schall auf Dauer die Ohren schädigen.",
    build(s) {
      const items = [
        [50, "normales Gespräch", "40–60 dB", () => s.sound("conversation", { vol: .4, force: true })],
        [85, "Straßenverkehr", "80–90 dB", () => s.sound("traffic", { vol: .4, dur: 3, force: true })],
        [100, "Disco, Presslufthammer", "etwa 100 dB", () => s.sound("jackhammer", { vol: .4, dur: 2.5, force: true })],
        [130, "Schmerzschwelle", "120–140 dB", () => noise(s, .5, .3, 3000, 3000, 0, 3)],
        [150, "Düsenflugzeug (30 m)", "etwa 150 dB", () => s.sound("jet-flyby", { from: 1.5, dur: 3, vol: .4, force: true })],
      ];
      const W = 640, H = 470, Y = i => 420 - i * 90;
      const v = s.svg(W, H);
      v.append(s.el("rect", { x: 33, y: 20, width: 24, height: 362, rx: 12, fill: "#dc3b2a", opacity: .22 }), s.el("rect", { x: 33, y: 382, width: 24, height: 70, rx: 12, fill: "#138a5a", opacity: .25 }));
      const line85 = s.el("g", { class: "later" }, s.el("line", { x1: 20, y1: 382, x2: 630, y2: 382, stroke: "#dc3b2a", "stroke-width": 3, "stroke-dasharray": "10 6" }), s.el("text", { x: 630, y: 374, "text-anchor": "end", class: "lbl", style: { fill: "#dc3b2a", fontWeight: 700 }, text: "ab 85 dB: auf Dauer gefährlich" }));
      const rungs = items.map(([db, n, val, fn], i) => {
        const yy = Y(i);
        const gEl = s.el("g", { class: "later", style: { cursor: "pointer" }, onclick: () => { fn(); wig(s, gEl); } });
        gEl.append(s.el("circle", { cx: 45, cy: yy, r: 13, fill: db >= 85 ? "#dc3b2a" : "#138a5a" }), s.el("rect", { x: 80, y: yy - 25, width: 520, height: 48, rx: 12, fill: "#fff", stroke: "#c8d3de", "stroke-width": 2 }),
          s.el("text", { x: 96, y: yy + 7, class: "lbl", text: n }), s.el("text", { x: 584, y: yy + 7, "text-anchor": "end", class: "lbl", style: { fontWeight: 700 }, text: val }));
        return gEl;
      });
      v.append(line85, ...rungs);
      const merk = s.h("div", { class: "merk later" }, "Lautstärke misst man in ", s.h("b", null, "Dezibel (dB)"), ". Sehr lauter Schall kann dein Gehör ", s.h("b", null, "für immer"), " schädigen.");
      const hint = s.h("p", { class: "small pencil" }, "Tippe auf eine Stufe. Keine Sorge: Hier klingt alles leise – nur zum Vergleichen.");
      const meter = s.photo("sound-level-meter", { w: 170, h: 380, pos: "50% 50%", cls: "later" });
      const mnote = s.h("div", { class: "card later", style: { padding: "10px 14px" } }, s.h("p", { class: "small" }, "Gemessen wird mit einem ", s.h("b", null, "Schallpegelmesser"), ". Dieser zeigt gerade 75,6 dB."));
      s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "640px 1fr", alignItems: "center" } }, v,
        s.h("div", { class: "row", style: { flexWrap: "nowrap", alignItems: "center", gap: "16px" } }, meter, s.h("div", { class: "stack", style: { flex: 1 } }, hint, mnote, merk))));
      s.show(meter, "zoom"); s.show(mnote, "up", 200);
      s.step(async () => { for (let i = 0; i < rungs.length; i++) { s.show(rungs[i], "left"); s.sfx.count(i); await s.wait(300); } });
      s.step(async () => { s.sfx.zap(); await s.show(line85, "fade"); });
      s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
    },
  });

  /* 15 --------------------------------------------------------------- */
  slides.push({
    title: "Schütze deine Ohren",
    say: "Deine Ohren brauchen Schutz. Ein kaputtes Gehör heilt nicht wieder.",
    build(s) {
      const v = s.svg(380, 54);
      v.append(s.el("rect", { x: 4, y: 10, width: 372, height: 34, rx: 10, fill: "#eef2f6", stroke: "#c8d3de", "stroke-width": 2 }));
      const meter = s.el("rect", { x: 6, y: 12, width: 0, height: 30, rx: 9, fill: "#138a5a" }); v.append(meter);
      const plugs = s.photo("earplugs", { w: 380, h: 300, pos: "50% 50%", caption: "Ohrstöpsel aus Schaumstoff" });
      const face = s.h("p", { class: "h2", style: { textAlign: "center", minHeight: "36px" } }, "alles gut");
      const sl = s.slider({ label: "Kopfhörer-Lautstärke", min: 0, max: 10, value: 4, onInput: x => {
        meter.setAttribute("width", x * 36.8);
        const c = x <= 5 ? "#138a5a" : x <= 7 ? "#ee7a1a" : "#dc3b2a"; meter.setAttribute("fill", c);
        face.textContent = x <= 5 ? "alles gut" : x <= 7 ? "Vorsicht – nicht zu lange" : "zu laut für deine Ohren!"; face.style.color = c;
        play(s, 330, .25, { harm: HARM.floete, vol: .02 + x * .03 });
      } });
      sl.set(4);
      const tips = [
        ["Kopfhörer nicht voll aufdrehen", "Wenn andere deine Musik mithören können, ist sie zu laut."],
        ["Abstand halten", "Bei Konzerten nicht direkt vor die Lautsprecherboxen stellen."],
        ["Ohrstöpsel benutzen", "Bei sehr lauten Konzerten, beim Feuerwerk oder beim Schlagzeugüben."],
        ["Pausen machen", "Nach lautem Lärm brauchen die Ohren Ruhe. Pfeift es im Ohr: Achtung!"],
      ].map(([a, b], i) => s.h("div", { class: "card later", style: { padding: "10px 16px" } }, s.h("p", { class: "t", style: { fontWeight: 700 } }, (i + 1) + ". " + a), s.h("p", { class: "small" }, b)));
      s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "380px 1fr", alignItems: "start" } }, s.h("div", { class: "stack", style: { gap: "8px" } }, plugs, v, face, sl), s.h("div", { class: "stack", style: { gap: "12px" } }, tips)));
      tips.forEach((t, i) => s.step(async () => { if (i === 2) s.sound("drum-groove", { dur: 2, vol: .5 }); else s.sfx.swoosh(); await s.show(t, "left"); }));
    },
  });

  /* 16 --------------------------------------------------------------- */
  slides.push({
    title: "Im Alltag: Schall überall",
    say: "Schall ist überall um dich herum. Tippe auf die Bilder und überlege: Ist es ein Klang oder ein Geräusch?",
    build(s) {
      const N = (n) => 523.25 * Math.pow(2, n / 12);
      const tiles = [
        ["smartphone", "50% 45%", "Handy-Klingelton", "Klang · Melodie aus hohen Tönen", () => s.sound("ringtone", { dur: 3, force: true })],
        ["school-bell-photo", "50% 50%", "Schulklingel", "Klang · lang und laut", () => s.sound("school-bell", { dur: 3, force: true })],
        ["guitar", "50% 55%", "Gitarre", "Klang · die Saiten schwingen", () => s.sound("guitar-chord", { force: true })],
        ["drum-kit", "50% 45%", "Schlagzeug", "Fell und Becken · Rhythmus", () => s.sound("drum-groove", { force: true })],
        ["ubahn-berlin", "50% 50%", "U-Bahn", "Geräusch · Rauschen und Quietschen", () => s.sound("ubahn-train", { dur: 4, force: true })],
        ["bass-guitar", "50% 40%", "E-Bass im Lied", "tiefe Töne · du spürst sie im Bauch", () => s.sound("bass-riff", { force: true })],
      ];
      const els = tiles.map(([id, pos, n, d, fn]) => {
        const fig = s.photo(id, { w: "100%", h: 156, pos, caption: n });
        return s.h("button", { class: "card later", style: { font: "inherit", color: "inherit", cursor: "pointer", display: "flex", flexDirection: "column", gap: "6px", textAlign: "left", padding: "10px" }, onclick: () => { fn(); wig(s, fig); } },
          fig, s.h("p", { class: "small pencil" }, "▶ " + d));
      });
      const merk = s.h("div", { class: "merk later" }, "Jeder Schall hat ", s.h("b", null, "Tonhöhe, Tondauer, Lautstärke"), " und ", s.h("b", null, "Klangfarbe"), " – auch der Klingelton deines Handys.");
      s.add(s.h("div", { class: "stack", style: { gap: "18px" } }, s.h("div", { class: "cols3", style: { gap: "18px" } }, els), merk));
      s.step(async () => { for (let i = 0; i < 3; i++) { s.show(els[i], "pop"); s.sfx.count(i); await s.wait(150); } });
      s.step(async () => { for (let i = 3; i < 6; i++) { s.show(els[i], "pop"); s.sfx.count(i); await s.wait(150); } });
      s.step(async () => { s.sfx.success(); await s.show(merk, "up"); });
    },
  });

  Deck.unit({
    id: "u1", num: 1, title: "Klang und Schall", color: COL, soft: "#e4ecfb",
    subtitle: "Was du hörst – und warum",
    blurb: "Schwingung, Tonhöhe, Lautstärke, Klangfarbe und Echo.",
    goals: ["verstehen, wie Schall entsteht und zum Ohr kommt", "Ton, Klang, Geräusch und Knall unterscheiden", "Tonhöhe, Tondauer, Lautstärke und Klangfarbe hören", "wissen, wie Instrumente klingen – und die Ohren schützen"],
    icon(svg, el) {
      svg.append(el("circle", { cx: 35, cy: 35, r: 30, fill: COL, opacity: .12 }));
      [10, 18, 26].forEach((r, i) => svg.append(el("path", { d: `M${30 + r * .5} ${35 - r} A${r} ${r} 0 0 1 ${30 + r * .5} ${35 + r}`, fill: "none", stroke: COL, "stroke-width": 4, "stroke-linecap": "round", opacity: 1 - i * .25 })));
      svg.append(el("circle", { cx: 22, cy: 35, r: 7, fill: COL }));
    },
    slides,
  });
})();
