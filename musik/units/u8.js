/* Kapitel 8 – Stimme und Musik machen (Stimmlippen, Atmung, Einsingen, Stimmlagen, Stimmbruch, Chor,
   Sprechstück, Body Percussion, Zusammenspiel, Dirigieren, grafische Notation, Üben, Stimmen).
   Alle Klänge live synthetisiert. Lieder nur gemeinfrei (Bruder Jakob, Alle meine Entchen, Happy Birthday). */
(() => {
  const P = {
    voice: { w: "sawtooth", form: [[750, 5, 1], [1150, 6, 0.6], [2600, 8, 0.25]], a: 0.08, rel: 0.12, vib: 0.009 },
    ooh: { w: "sawtooth", form: [[350, 5, 1], [800, 6, 0.4]], a: 0.08, rel: 0.12, vib: 0.008 },
    hum: { w: "triangle", lp: 520, a: 0.12, rel: 0.15, vib: 0.006 },
    strings: { w: "sawtooth", w2: "sawtooth", lp: 2300, a: 0.07, rel: 0.12, vib: 0.006 },
    flute: { w: "sine", w2: "triangle", lp: 4000, a: 0.04, rel: 0.08, vib: 0.008 },
    clarinet: { w: "square", lp: 1500, a: 0.03, rel: 0.06, vib: 0.002 },
    brass: { w: "sawtooth", lp: 1800, a: 0.04, rel: 0.08, vib: 0.003 },
    piano: { w: "triangle", lp: 3000, perc: true },
    pluck: { w: "triangle", lp: 900, perc: true },
    synth: { w: "square", lp: 2400, a: 0.01, rel: 0.05 },
  };
  function synth(s) {
    let busNode = null;
    const ac = () => (s.sfx.on && !s.fast && s.alive ? s.sfx.unlock() : null);
    const bus = a => {
      if (!busNode) {
        busNode = a.createGain(); busNode.gain.value = 0.5; busNode.connect(a.destination);
        const nd = busNode; s.onLeave(() => { try { nd.gain.setTargetAtTime(0, a.currentTime, 0.04); setTimeout(() => nd.disconnect(), 400); } catch (e) {} });
      }
      return busNode;
    };
    const hz = n => 523.25 * Math.pow(2, n / 12);
    /** builds osc(s) → filter(s) → gain; returns {g, os, t, a} */
    function chain(a, p, f, t) {
      const g = a.createGain(), mix = a.createGain(); mix.gain.value = 1;
      if (p.form) p.form.forEach(([ff, q, gg]) => { const b = a.createBiquadFilter(); b.type = "bandpass"; b.frequency.value = ff; b.Q.value = q; const bg = a.createGain(); bg.gain.value = gg * 2.2; mix.connect(b); b.connect(bg); bg.connect(g); });
      else { const fl = a.createBiquadFilter(); fl.type = "lowpass"; fl.frequency.value = p.lp || 4000; fl.Q.value = 0.7; mix.connect(fl); fl.connect(g); }
      g.connect(bus(a));
      const os = (p.w2 ? [p.w, p.w2] : [p.w]).map((w, i) => {
        const o = a.createOscillator(); o.type = w; o.frequency.setValueAtTime(f * (i ? 1.005 : 1), t);
        const og = a.createGain(); og.gain.value = i ? 0.6 : 1; o.connect(og); og.connect(mix); return o;
      });
      let lfo = null;
      if (p.vib) { lfo = a.createOscillator(); const lg = a.createGain(); lfo.frequency.value = 5.5; lg.gain.value = f * p.vib; lfo.connect(lg); os.forEach(o => lg.connect(o.frequency)); lfo.start(t); }
      return { g, os, lfo };
    }
    function play(inst, n, when = 0, dur = 0.3, vol = 0.22, glide = null) {
      const a = ac(); if (!a) return;
      const p = P[inst] || P.piano, t = a.currentTime + when;
      const { g, os, lfo } = chain(a, p, hz(n), t);
      if (glide != null) os.forEach((o, i) => o.frequency.exponentialRampToValueAtTime(hz(glide) * (i ? 1.005 : 1), t + dur));
      g.gain.setValueAtTime(0.0001, t);
      if (p.perc) { g.gain.exponentialRampToValueAtTime(vol, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.25); }
      else { g.gain.exponentialRampToValueAtTime(vol, t + p.a); g.gain.setValueAtTime(vol * 0.85, t + Math.max(p.a, dur - p.rel)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + p.rel); }
      os.forEach(o => { o.start(t); o.stop(t + dur + 0.4); }); if (lfo) lfo.stop(t + dur + 0.4);
    }
    /** sustained tone in Hz: returns {set(hz), vol(v), stop()} (no-op object when muted) */
    function drone(inst, f, vol = 0.2) {
      const a = ac(); const nop = { set() {}, vol() {}, stop() {} };
      if (!a) return nop;
      const p = P[inst] || P.flute, t = a.currentTime;
      const { g, os, lfo } = chain(a, p, f, t);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + Math.max(0.03, p.a || 0.03));
      os.forEach(o => o.start(t));
      let dead = false;
      const stop = () => { if (dead) return; dead = true; const n = a.currentTime; g.gain.cancelScheduledValues(n); g.gain.setTargetAtTime(0.0001, n, 0.06); os.forEach(o => o.stop(n + 0.5)); if (lfo) lfo.stop(n + 0.5); };
      s.onLeave(stop);
      return {
        set(h) { if (!dead) os.forEach((o, i) => o.frequency.setTargetAtTime(h * (i ? 1.005 : 1), a.currentTime, 0.02)); },
        vol(v) { if (!dead) g.gain.setTargetAtTime(Math.max(0.0001, v), a.currentTime, 0.03); },
        stop,
      };
    }
    function seq(inst, notes, beat = 0.25, vol = 0.22, start = 0) {
      let t = start;
      for (const [n, b] of notes) { if (n != null) play(inst, n, t, b * beat * 0.95, vol); t += b * beat; }
      return t;
    }
    const body = {
      // real recordings of body sounds
      stamp(w = 0) { s.sound("stampfen", { when: w, dur: 0.7 }); },
      patsch(w = 0) { s.sound("patschen", { when: w, dur: 0.4, vol: 1 }); },
      clap(w = 0) { s.sound("clap", { when: w }); },
      snip(w = 0) { s.sound("snap", { when: w }); },
      kick(w = 0) { s.sfx.tone(140, 0.2, "sine", 0.5, w, 45); },
      snare(w = 0) { s.sfx.noise(0.13, 0.28, 2500, 1200, w, 0.8); s.sfx.tone(220, 0.06, "triangle", 0.12, w); },
      hat(w = 0) { s.sfx.noise(0.035, 0.1, 7000, 8000, w, 3); },
    };
    return { play, drone, seq, hz, ac, body };
  }
  const bump = el => { el.classList.remove("a-pop"); void el.getBoundingClientRect(); el.classList.add("a-pop"); };
  const card = (s, label, text, cls = "card", extra = {}) => s.h("div", Object.assign({ class: cls + " later", style: { padding: "12px 18px" } }, extra), s.h("span", { class: "exlabel" }, label), s.h("p", { class: "small" }, text));

  Deck.unit({
    id: "u8", num: 8, title: "Stimme und Musik machen", color: "#0e7490", soft: "#dff3f7",
    subtitle: "Singen, sprechen, dirigieren, üben",
    blurb: "Stimme, Chor, Dirigieren, eigene Noten zeichnen, richtig üben.",
    goals: [
      "Verstehen, wie deine Stimme Töne macht",
      "Stimmlagen und Chorsingen kennenlernen",
      "Mit Wörtern und dem Körper Rhythmus machen",
      "Dirigentenzeichen lesen und selbst zeigen",
      "Eigene Musik zeichnen und richtig üben",
    ],
    icon(svg, el) {
      svg.append(
        el("circle", { cx: 35, cy: 35, r: 28, fill: "#0e7490", opacity: 0.13 }),
        el("rect", { x: 27, y: 12, width: 16, height: 28, rx: 8, fill: "#0e7490" }),
        el("path", { d: "M20 34 a15 15 0 0 0 30 0 M35 49 v9 M27 58 h16", fill: "none", stroke: "#0e7490", "stroke-width": 3.5, "stroke-linecap": "round" }));
    },
    slides: [
      /* 1 ------------------------------------------------------------------ */
      {
        title: "Deine Stimme – ein Instrument",
        say: "Deine Stimme ist ein Instrument. Im Kehlkopf sitzen die Stimmlippen. Die Luft aus der Lunge bringt sie zum Schwingen.",
        build(s) {
          const sy = synth(s);
          const svg = s.svg(440, 440);
          const add = (t, a) => { const e = s.el(t, a); svg.append(e); return e; };
          add("rect", { x: 0, y: 0, width: 440, height: 440, rx: 22, fill: "#f3e0e3" });
          add("ellipse", { cx: 220, cy: 220, rx: 170, ry: 185, fill: "#e7a7b2" });
          add("ellipse", { cx: 220, cy: 220, rx: 120, ry: 150, fill: "#3b1820" });
          const L = add("path", { fill: "#f6d5da", stroke: "#c06a7b", "stroke-width": 3 });
          const R = add("path", { fill: "#f6d5da", stroke: "#c06a7b", "stroke-width": 3 });
          const lab1 = add("text", { x: 220, y: 36, "text-anchor": "middle", class: "lbl", text: "vorne" });
          const lab2 = add("text", { x: 220, y: 424, "text-anchor": "middle", class: "lbl", text: "hinten" });
          let w = 70, mode = "atmen", f = 220, d = null;
          const draw = gap => {
            const top = 85, bot = 360;
            L.setAttribute("d", `M220 ${top} L${220 - gap} ${bot} L105 ${bot} Q85 220 220 ${top} Z`);
            R.setAttribute("d", `M220 ${top} L${220 + gap} ${bot} L335 ${bot} Q355 220 220 ${top} Z`);
          };
          draw(w);
          s.loop(t => {
            if (mode === "atmen") w += (70 - w) * 0.12;
            else w = 3 + 9 * Math.abs(Math.sin(t * f / 30));
            draw(w);
          });
          const status = s.h("p", { class: "h2", style: { color: "var(--unit)" } }, "Atmen: Die Stimmlippen sind offen.");
          const rate = s.h("p", { class: "t" }, "Die Luft strömt leise hindurch – kein Ton.");
          const setRate = () => { rate.textContent = `Sie schwingen ${f}-mal pro Sekunde! (Hier in Zeitlupe.)`; };
          const bA = s.h("button", { class: "btn" }, "Atmen");
          const bS = s.h("button", { class: "btn solid" }, "▶ Singen");
          bA.onclick = () => { mode = "atmen"; if (d) { d.stop(); d = null; } s.sfx.noise(1.2, 0.08, 500, 1500, 0, 0.7); status.textContent = "Atmen: Die Stimmlippen sind offen."; rate.textContent = "Die Luft strömt leise hindurch – kein Ton."; };
          bS.onclick = () => { s.sfx.unlock(); mode = "singen"; if (!d) d = sy.drone("voice", f, 0.22); status.textContent = "Singen: Die Stimmlippen schließen sich und schwingen."; setRate(); };
          const sl = s.slider({ label: "Spannung der Stimmlippen", min: 110, max: 660, step: 10, value: 220, fmt: v => v < 200 ? "locker → tief" : v > 450 ? "gespannt → hoch" : "mittel", onInput: v => { f = v; if (d) d.set(v); if (mode === "singen") setRate(); } });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Die ", s.h("b", null, "Stimmlippen"), " im Kehlkopf schwingen wie eine Saite. ", s.h("b", null, "Gespannter"), " = schneller = ", s.h("b", null, "höher"), ".");
          const fact = s.h("div", { class: "life later", style: { padding: "12px 18px" } }, s.h("span", { class: "exlabel" }, "Rekord"),
            s.h("p", { class: "small" }, "Bei sehr hohen Tönen einer Opernsängerin gehen die Stimmlippen über 1000-mal pro Sekunde auf und zu."),
            s.h("div", { class: "row", style: { marginTop: "6px" } }, s.soundBtn("koenigin-der-nacht", "Echt: Sopran (Mozart, Königin der Nacht)")));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "440px 1fr", height: "100%", alignItems: "center" } }, svg,
            s.h("div", { class: "stack", style: { gap: "14px" } }, status, rate, s.h("div", { class: "row", style: { flexWrap: "nowrap" } }, bA, bS), sl, merk, fact)));
          s.step(async () => { bS.onclick(); s.say("So schwingen die Stimmlippen beim Singen."); await s.wait(1600); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { if (d) { d.stop(); d = null; } s.sound("koenigin-der-nacht", { dur: 6 }); await s.show(fact, "up"); });
        },
      },
      /* 2 ------------------------------------------------------------------ */
      {
        title: "Atmung: das Zwerchfell",
        say: "Das Zwerchfell ist dein wichtigster Atemmuskel. Beim Einatmen zieht es sich nach unten, und die Lunge bekommt Platz.",
        build(s) {
          const svg = s.svg(420, 470);
          const add = (t, a) => { const e = s.el(t, a); svg.append(e); return e; };
          add("rect", { x: 40, y: 10, width: 340, height: 450, rx: 90, fill: "#fde9d6", stroke: "#e2b48a", "stroke-width": 4 });
          add("rect", { x: 195, y: 10, width: 30, height: 90, fill: "#e8b4b8" });
          const lungL = add("ellipse", { cx: 145, cy: 200, rx: 75, ry: 100, fill: "#f4a4ae" });
          const lungR = add("ellipse", { cx: 275, cy: 200, rx: 75, ry: 100, fill: "#f4a4ae" });
          const dia = add("path", { fill: "none", stroke: "#0e7490", "stroke-width": 10, "stroke-linecap": "round" });
          const belly = add("path", { fill: "none", stroke: "#e2b48a", "stroke-width": 4, "stroke-dasharray": "8 8" });
          add("text", { x: 210, y: 205, "text-anchor": "middle", class: "lbl", text: "Lunge" });
          const dlab = add("text", { x: 210, y: 410, "text-anchor": "middle", class: "lbl", fill: "#0e7490", text: "Zwerchfell" });
          let v = 0;
          const draw = () => {
            const y = 330 + v * 35, curve = 80 - v * 55;
            dia.setAttribute("d", `M70 ${y} Q210 ${y - curve * 2} 350 ${y}`);
            lungL.setAttribute("ry", 100 + v * 22); lungR.setAttribute("ry", 100 + v * 22);
            lungL.setAttribute("cy", 200 + v * 18); lungR.setAttribute("cy", 200 + v * 18);
            belly.setAttribute("d", `M380 300 Q${392 + v * 22} 380 370 440`);
          };
          draw();
          const phase = s.h("p", { class: "big", style: { color: "var(--unit)" } }, "Bereit?");
          let running = false;
          const cycle = async () => {
            while (running && s.alive && !s.fast) {
              phase.textContent = "Einatmen …"; s.sfx.noise(2.4, 0.07, 400, 1400, 0, 0.6);
              await s.tween({ from: v, to: 1, dur: 2400, update: x => { v = x; draw(); } });
              if (!running) break;
              phase.textContent = "Ausatmen …"; s.sfx.noise(3.2, 0.06, 1400, 400, 0, 0.6);
              await s.tween({ from: v, to: 0, dur: 3200, update: x => { v = x; draw(); } });
            }
          };
          const btn = s.h("button", { class: "btn solid" }, "▶ Mitatmen");
          btn.onclick = () => { s.sfx.unlock(); running = !running; btn.textContent = running ? "■ Stopp" : "▶ Mitatmen"; if (running) cycle(); else phase.textContent = "Pause."; };
          const c1 = card(s, "Einatmen", "Das Zwerchfell spannt sich an, wird flacher und geht nach unten. Die Lunge bekommt Platz und füllt sich mit Luft. Der Bauch geht nach außen.");
          const c2 = card(s, "Ausatmen", "Das Zwerchfell entspannt sich und wölbt sich wieder nach oben. Die Luft strömt hinaus – und bringt die Stimmlippen zum Klingen.");
          const secs = s.h("span", { class: "mono" }, "0 s");
          let hiss = false;
          const ssBtn = s.h("button", { class: "btn" }, "„sss“-Übung starten");
          ssBtn.onclick = async () => {
            if (hiss) return; hiss = true; s.sfx.unlock();
            for (let i = 0; i <= 12 && s.alive; i++) { secs.textContent = i + " s"; s.sfx.noise(1.05, 0.06, 5000, 5200, 0, 2); await s.wait(1000); }
            hiss = false; s.sfx.ding();
          };
          const ex = s.h("div", { class: "life later", style: { padding: "12px 18px" } }, s.h("span", { class: "exlabel" }, "Probier mal"),
            s.h("p", { class: "small" }, "Hand auf den Bauch, tief einatmen. Dann ganz langsam auf „sss“ ausatmen. Wie lange schaffst du es?"),
            s.h("div", { class: "row", style: { marginTop: "8px", flexWrap: "nowrap" } }, ssBtn, s.h("span", { class: "h2" }, secs), s.soundBtn("atmen", "Echtes Atmen")));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "420px 1fr", height: "100%", alignItems: "center" } }, svg,
            s.h("div", { class: "stack", style: { gap: "14px" } }, s.h("div", { class: "row", style: { flexWrap: "nowrap", justifyContent: "space-between" } }, phase, btn), c1, c2, ex)));
          s.step(async () => { s.sfx.whoosh(); await s.tween({ from: 0, to: 1, dur: 1500, update: x => { v = x; draw(); } }); await s.show(c1, "left"); });
          s.step(async () => { s.sfx.swoosh(); await s.tween({ from: 1, to: 0, dur: 1500, update: x => { v = x; draw(); } }); await s.show(c2, "left"); });
          s.step(async () => { s.sfx.pop(); await s.show(ex, "up"); });
        },
      },
      /* 3 ------------------------------------------------------------------ */
      {
        title: "Einsingen: Aufwärmen",
        say: "Vor dem Singen wärmt man die Stimme auf – wie die Muskeln vor dem Sport. Probiere Lippenflattern, Sirene und Summen.",
        build(s) {
          const sy = synth(s);
          const mk = (title, how, draw, sound) => {
            const svg = s.svg(280, 150);
            svg.setAttribute("width", 300); svg.setAttribute("height", 200);
            const parts = draw(svg);
            const b = s.h("button", { class: "btn solid", onclick: () => { s.sfx.unlock(); sound(parts); } }, "▶ " + title);
            return s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" } },
              s.h("p", { class: "h2" }, title), s.h("div", { style: { background: "var(--unit-soft)", borderRadius: "14px" } }, svg),
              s.h("p", { class: "small", style: { flex: "1" } }, how), b);
          };
          const c1 = mk("Lippenflattern", "Lippen locker lassen und Luft durchblasen: „brrrr“ – wie ein Pferd. Dazu einen Ton summen.",
            svg => { const t = s.el("text", { x: 140, y: 100, "text-anchor": "middle", "font-size": 70, text: "👄" }); svg.append(t); return { t }; },
            ({ t }) => {
              sy.play("hum", -12, 0, 1.6, 0.18, -5);
              for (let i = 0; i < 40; i++) s.sfx.noise(0.03, 0.09, 260, 420, i * 0.04, 2);
              t.animate([{ translate: "0 0" }, { translate: "3px 0" }, { translate: "-3px 0" }, { translate: "0 0" }], { duration: 80, iterations: 20 });
            });
          const c2 = mk("Sirene", "Auf „u“ von ganz tief nach ganz hoch gleiten – und wieder zurück. Wie eine Feuerwehr-Sirene.",
            svg => {
              const path = s.el("path", { d: "M20 125 C 90 125, 110 20, 140 20 C 170 20, 190 125, 260 125", fill: "none", stroke: "#0e7490", "stroke-width": 5, "stroke-linecap": "round" });
              const dot = s.el("circle", { cx: 20, cy: 125, r: 12, fill: "#dc3b2a" }); svg.append(path, dot); return { path, dot };
            },
            ({ path, dot }) => {
              sy.play("ooh", -14, 0, 1.3, 0.22, 7); sy.play("ooh", 7, 1.3, 1.3, 0.22, -14);
              const L = path.getTotalLength();
              s.tween({ from: 0, to: 1, dur: 2600, ease: "linear", update: v => { const p = path.getPointAtLength(v * L); dot.setAttribute("cx", p.x); dot.setAttribute("cy", p.y); } });
            });
          const c3 = mk("Summen", "Mund zu, Zähne locker auseinander: „mmmm“. Spürst du das Kribbeln an den Lippen?",
            svg => {
              const rings = [0, 1, 2].map(i => s.el("circle", { cx: 140, cy: 75, r: 20 + i * 18, fill: "none", stroke: "#0e7490", "stroke-width": 4, opacity: 0.25 })); svg.append(...rings);
              svg.append(s.el("text", { x: 140, y: 87, "text-anchor": "middle", "font-size": 34, "font-weight": 700, fill: "#0e7490", text: "mm" })); return { rings };
            },
            ({ rings }) => {
              s.sound("summen", { dur: 4, force: true });
              rings.forEach((r, i) => r.animate([{ opacity: 0.15, transform: "scale(1)" }, { opacity: 0.9, transform: "scale(1.15)" }, { opacity: 0.15, transform: "scale(1)" }], { duration: 600, delay: i * 120, iterations: 6 }));
            });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, s.h("b", null, "Einsingen"), " ist wie Dehnen vor dem Fußball: Die Stimme wird warm und locker – und klingt danach besser.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "16px" } },
            s.h("div", { class: "cols3", style: { flex: "1", gap: "18px" } }, c1, c2, c3), merk));
          [c1, c2, c3].forEach(c => s.step(async () => { s.sfx.pop(); await s.show(c, "up"); c.querySelector("button").click(); }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 4 ------------------------------------------------------------------ */
      {
        title: "Stimmlagen: von hoch bis tief",
        say: "Im Chor gibt es vier Stimmlagen: Sopran, Alt, Tenor und Bass. Tippe auf einen Balken und hör, wie hoch oder tief er klingt.",
        build(s) {
          const sy = synth(s);
          const svg = s.svg(520, 560);
          svg.append(s.el("rect", { x: 0, y: 0, width: 520, height: 560, rx: 18, fill: "#f4fafb" }));
          svg.append(s.el("path", { d: "M40 520 V40", stroke: "#5d6678", "stroke-width": 4, "marker-end": "" }));
          svg.append(s.el("path", { d: "M28 58 L40 34 L52 58", fill: "none", stroke: "#5d6678", "stroke-width": 4 }));
          svg.append(s.el("text", { x: 58, y: 48, class: "lbl", text: "hoch" }), s.el("text", { x: 58, y: 536, class: "lbl", text: "tief" }));
          const voices = [
            ["Sopran", "#e0569b", 70, 250, [0, 4, 7, 12]],
            ["Alt", "#f59e0b", 170, 330, [-7, -3, 0, 5]],
            ["Tenor", "#0e7490", 250, 410, [-12, -8, -5, 0]],
            ["Bass", "#1d4ed8", 330, 500, [-24, -20, -17, -12]],
          ];
          const bars = voices.map(([n, col, y0, y1, arp], i) => {
            const g = s.el("g", { class: "later", style: { cursor: "pointer" } });
            const x = 120 + i * 95;
            g.append(s.el("rect", { x, y: y0, width: 80, height: y1 - y0, rx: 16, fill: col }),
              s.el("text", { x: x + 40, y: (y0 + y1) / 2 + 8, "text-anchor": "middle", "font-size": 22, "font-weight": 700, fill: "#fff", transform: `rotate(-90 ${x + 40} ${(y0 + y1) / 2})`, text: n }));
            g.addEventListener("click", () => { s.sfx.unlock(); sy.seq(i < 2 ? "voice" : "ooh", arp.map(a => [a, 1]).concat([[arp[0], 2]]), 0.28, 0.24); bump(g); });
            svg.append(g); return g;
          });
          const info = [
            ["Sopran", "die hohen Frauen- und Kinderstimmen"],
            ["Alt", "die tieferen Frauen- und Kinderstimmen"],
            ["Tenor", "die hohen Männerstimmen"],
            ["Bass", "die tiefen Männerstimmen"],
          ].map(([k, v]) => card(s, k, v));
          const realRow = s.h("div", { class: "row later", style: { gap: "10px" } }, s.soundBtn("koenigin-der-nacht", "Sopran"), s.soundBtn("maennerchor", "Tenor + Bass"), s.soundBtn("chor-tallis", "Alle vier"));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Ein gemischter Chor hat 4 Stimmen: ", s.h("b", null, "S A T B"), ". Dazwischen gibt es noch ", s.h("b", null, "Mezzosopran"), " und ", s.h("b", null, "Bariton"), ".");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "520px 1fr", height: "100%", alignItems: "center" } }, svg,
            s.h("div", { class: "stack", style: { gap: "10px" } }, ...info, merk, realRow)));
          voices.forEach((v, i) => s.step(async () => { s.show(bars[i], "pop"); s.sfx.unlock(); bars[i].dispatchEvent(new Event("click")); await s.show(info[i], "left"); }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.show(realRow, "up"); });
        },
      },
      /* 5 ------------------------------------------------------------------ */
      {
        title: "Kinderstimme und Stimmbruch",
        say: "In der Pubertät wächst der Kehlkopf. Die Stimmlippen werden länger und dicker, und die Stimme wird tiefer. Das nennt man Stimmbruch.",
        build(s) {
          const sy = synth(s);
          const tune = [[0, 1], [2, 1], [4, 1], [5, 1], [7, 2], [7, 2]];
          const svg = s.svg(480, 330);
          svg.append(s.el("rect", { x: 0, y: 0, width: 480, height: 330, rx: 18, fill: "#f4fafb" }));
          const row = (y, label, len, th, col) => {
            const ln = s.el("line", { x1: 150, y1: y, x2: 150 + len, y2: y, stroke: col, "stroke-width": th, "stroke-linecap": "round" });
            svg.append(s.el("text", { x: 20, y: y + 7, class: "lbl", text: label }), ln); return ln;
          };
          row(60, "Kind", 130, 8, "#e0569b");
          const adult = row(150, "Erwachsen", 270, 16, "#1d4ed8");
          adult.classList.add("later");
          svg.append(s.el("text", { x: 20, y: 225, class: "lbl", fill: "#5d6678", text: "Wie bei Geige und Cello:" }),
            s.el("text", { x: 20, y: 262, class: "lbl", text: "kurze, dünne Saiten → hoch" }),
            s.el("text", { x: 20, y: 299, class: "lbl", text: "lange, dicke Saiten → tief" }));
          const b1 = s.h("button", { class: "btn", style: { padding: "0 8px", whiteSpace: "nowrap" }, onclick: () => { s.sfx.unlock(); sy.seq("voice", tune, 0.3, 0.22); } }, "▶ Kind");
          const b2 = s.h("button", { class: "btn", style: { padding: "0 8px", whiteSpace: "nowrap" }, onclick: () => { s.sfx.unlock(); sy.seq("ooh", tune.map(([n, b]) => [n - 12, b]), 0.3, 0.26); } }, "▶ Junge");
          const b3 = s.h("button", { class: "btn", style: { padding: "0 8px", whiteSpace: "nowrap" }, onclick: () => { s.sfx.unlock(); sy.seq("voice", tune.map(([n, b]) => [n - 3, b]), 0.3, 0.22); } }, "▶ Mädchen");
          const facts = [
            card(s, "Wann?", "Bei Jungen meist zwischen 11 und 16 Jahren, bei Mädchen zwischen 10 und 15 – bei jedem anders."),
            card(s, "Wie viel tiefer?", "Jungen: meist etwa eine Oktave (8 Töne). Mädchen: nur ein kleines Stück, bis zu einer kleinen Terz."),
          ];
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Der Kehlkopf wächst. Die Stimmlippen werden ", s.h("b", null, "länger und dicker"), " → die Stimme wird ", s.h("b", null, "tiefer"), ".");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "480px 1fr", height: "100%", alignItems: "center" } },
            s.h("div", { class: "stack", style: { gap: "12px" } }, svg, s.h("p", { class: "small" }, "Hör „Alle meine Entchen“ – vor und nach dem Stimmbruch:"), s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" } }, b1, b2, b3)),
            s.h("div", { class: "stack", style: { gap: "14px" } }, ...facts, merk)));
          s.step(async () => { s.sfx.whoosh(); await s.show(adult, "draw"); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(facts, "left"); });
        },
      },
      /* 6 ------------------------------------------------------------------ */
      {
        title: "Im Chor: unisono und mehrstimmig",
        say: "Unisono heißt: Alle singen dieselbe Melodie. Mehrstimmig heißt: Verschiedene Töne klingen gleichzeitig, zum Beispiel im Kanon.",
        build(s) {
          const sy = synth(s);
          const B = 0.27;
          const bars = [
            [[0, 1], [2, 1], [4, 1], [0, 1]], [[0, 1], [2, 1], [4, 1], [0, 1]],
            [[4, 1], [5, 1], [7, 2]], [[4, 1], [5, 1], [7, 2]],
            [[7, 0.5], [9, 0.5], [7, 0.5], [5, 0.5], [4, 1], [0, 1]], [[7, 0.5], [9, 0.5], [7, 0.5], [5, 0.5], [4, 1], [0, 1]],
            [[0, 1], [-5, 1], [0, 2]], [[0, 1], [-5, 1], [0, 2]],
          ];
          const words = ["Bruder Jakob,", "Bruder Jakob,", "schläfst du noch?", "schläfst du noch?", "Hörst du nicht die Glocken?", "Hörst du nicht die Glocken?", "Ding, dang, dong!", "Ding, dang, dong!"];
          const cols = ["#e0569b", "#f59e0b", "#0e7490", "#1d4ed8"];
          const cells = [];
          const rows = [0, 1, 2, 3].map(r => {
            const rc = words.map((w, i) => s.h("div", { class: "card", style: { padding: "4px 8px", minHeight: "58px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontSize: "19px", lineHeight: "1.2", transition: "background .15s, transform .15s" } }, w));
            cells.push(rc);
            return s.h("div", { style: { display: "grid", gridTemplateColumns: "118px repeat(8, 1fr)", gap: "8px", alignItems: "stretch" } },
              s.h("div", { class: "center", style: { fontWeight: "700", color: cols[r], fontSize: "21px" } }, "Stimme " + (r + 1)), ...rc);
          });
          let token = 0;
          const run = async (offsetBars, label) => {
            s.sfx.unlock(); const my = ++token; mode.textContent = label;
            const insts = ["voice", "voice", "ooh", "ooh"], oct = [0, 0, -12, -12];
            for (let r = 0; r < 4; r++) {
              let t = r * offsetBars * 4 * B;
              for (const bar of bars) for (const [n, b] of bar) { sy.play(insts[r], n + oct[r], t, b * B * 0.92, offsetBars ? 0.13 : 0.1); t += b * B; }
            }
            const total = (8 + 3 * offsetBars) * 4;
            for (let beat = 0; beat < total && s.alive && my === token; beat++) {
              cells.forEach((rc, r) => rc.forEach((c, i) => { const on = Math.floor(beat / 4) - r * offsetBars === i; c.style.background = on ? cols[r] : ""; c.style.color = on ? "#fff" : ""; c.style.transform = on ? "scale(1.04)" : ""; }));
              await s.wait(B * 4 * 250);
            }
            if (my === token) cells.forEach(rc => rc.forEach(c => { c.style.background = ""; c.style.color = ""; c.style.transform = ""; }));
          };
          const mode = s.h("p", { class: "h2", style: { color: "var(--unit)", flex: "1" } }, "Bruder Jakob");
          const bU = s.h("button", { class: "btn solid", onclick: () => run(0, "Unisono: alle gleichzeitig") }, "▶ Unisono");
          const bK = s.h("button", { class: "btn solid", onclick: () => run(2, "Kanon: 4 Stimmen nacheinander") }, "▶ Kanon");
          const bA = s.h("button", { class: "btn", onclick: () => { s.sfx.unlock(); [[7, "voice"], [4, "voice"], [-5, "ooh"], [-24, "ooh"]].forEach(([n, i]) => sy.play(i, n, 0, 1.6, 0.14)); mode.textContent = "Akkord: S, A, T, B"; } }, "▶ Akkord");
          const choirPic = s.photo("thomanerchor", { w: 250, h: 150, pos: "50% 60%", caption: "Thomanerchor Leipzig", cls: "later" });
          const realC = s.h("div", { class: "row later", style: { gap: "10px" } }, s.soundBtn("chor-tallis", "Echter Chor: mehrstimmig"), s.soundBtn("maennerchor", "Männerchor"));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, s.h("b", null, "Unisono"), " = alle singen dieselbe Melodie. ", s.h("b", null, "Mehrstimmig"), " = verschiedene Töne gleichzeitig – im Kanon oder als Akkord.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "12px" } },
            s.h("div", { class: "row", style: { flexWrap: "nowrap" } }, mode, bU, bK, bA), ...rows,
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 250px", gap: "14px", alignItems: "center" } }, s.h("div", { class: "stack", style: { gap: "8px" } }, merk, realC), choirPic)));
          s.step(async () => { bU.click(); });
          s.step(async () => { bK.click(); s.say("Jetzt als Kanon: Jede Stimme beginnt zwei Takte später."); });
          s.step(async () => { s.show(merk, "up"); s.show(realC, "up"); s.sound("chor-tallis", { dur: 7 }); await s.show(choirPic, "zoom"); });
        },
      },
      /* 7 ------------------------------------------------------------------ */
      {
        title: "Sprechstück: Rhythmus aus Wörtern",
        say: "Ein Sprechstück ist Musik nur mit gesprochenen Wörtern. Tippe Wörter in die vier Kästchen und starte den Beat.",
        build(s) {
          const sy = synth(s);
          const words = ["Mathe", "Deutsch", "Musik", "Pause!", "Sport", "Englisch", "Tafel", "Schulhof"];
          const SYL = { Mathe: "Ma-the", Deutsch: "Deutsch", Musik: "Mu-sik", "Pause!": "Pau-se!", Sport: "Sport", Englisch: "Eng-lisch", Tafel: "Ta-fel", Schulhof: "Schul-hof" };
          const dots = w => "● ".repeat(SYL[w].split("-").length).trim();
          const fill = (el, w) => { el.innerHTML = ""; el.append(s.h("span", null, SYL[w]), s.h("span", { style: { font: "700 22px var(--f-body)", color: "var(--unit)", letterSpacing: "4px" } }, dots(w))); };
          const slot = ["Mathe", "Mathe", "Deutsch", "Pause!"];
          let pick = 0;
          const slots = slot.map((w, i) => {
            const el = s.h("button", { class: "card", style: { height: "150px", font: "700 36px/1.1 var(--f-display)", color: "var(--ink)", cursor: "pointer", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", justifyContent: "center", transition: "background .1s, transform .1s" },
              onclick: () => { pick = i; mark(); s.sfx.click(); } });
            fill(el, w); return el;
          });
          const nums = [1, 2, 3, 4].map(n => s.h("div", { class: "center", style: { font: "700 24px var(--f-display)", color: "var(--pencil)" } }, String(n)));
          const mark = () => slots.forEach((el, i) => { el.style.borderColor = i === pick ? "var(--unit)" : ""; el.style.borderWidth = i === pick ? "4px" : ""; });
          mark();
          const chips = words.map(w => s.h("button", { class: "btn", onclick: () => { slot[pick] = w; fill(slots[pick], w); bump(slots[pick]); s.speak(w, { rate: 1.1 }); pick = (pick + 1) % 4; mark(); } }, w));
          let playing = false;
          const btn = s.h("button", { class: "btn solid", style: { flex: "none", whiteSpace: "nowrap" } }, "▶ Beat an");
          const run = async () => {
            const beat = 0.6;
            for (let k = 0; playing && s.alive && !s.fast; k++) {
              const i = k % 4;
              sy.body.kick(); if (i % 2) sy.body.snare(); sy.body.hat(); sy.body.hat(beat / 2);
              slots.forEach((el, j) => { el.style.background = j === i ? "var(--unit-soft)" : ""; el.style.transform = j === i ? "scale(1.06)" : ""; });
              if (k >= 4) s.speak(slot[i], { rate: 1.3 });
              await s.wait(beat * 1000);
            }
            slots.forEach(el => { el.style.background = ""; el.style.transform = ""; });
          };
          btn.onclick = () => { s.sfx.unlock(); playing = !playing; btn.textContent = playing ? "■ Stopp" : "▶ Beat an"; if (playing) run(); };
          const hint = s.h("p", { class: "small pencil" }, "Erst 4 Schläge nur Beat zum Einhören – dann sprechen die Wörter mit. Punkte = Silben. Tippe ein Kästchen an, dann ein Wort.");
          const ex = [
            card(s, "Rap", "Sprechen im Rhythmus über einen Beat – die Silben sitzen genau auf den Schlägen.", "ex"),
            card(s, "Abzählreim", "„Ene, mene, muh – und raus bist du!“ Jede Silbe ein Schlag.", "ex"),
            card(s, "Stadion", "Tausende Fans rufen gemeinsam im Takt – ein riesiges Sprechstück.", "ex"),
          ];
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "12px" } },
            s.h("div", { class: "row", style: { gap: "10px" } }, ...chips),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" } }, ...nums, ...slots),
            s.h("div", { class: "row", style: { flexWrap: "nowrap" } }, btn, hint),
            s.h("div", { class: "cols3", style: { gap: "14px" } }, ...ex)));
          s.step(async () => { s.sfx.pop(); await s.show(ex[0], "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(ex.slice(1), "up"); });
        },
      },
      /* 8 ------------------------------------------------------------------ */
      {
        title: "Body Percussion",
        say: "Dein Körper ist ein Schlagzeug: stampfen, patschen, klatschen, schnipsen. Tippe Kästchen an und baue deinen Rhythmus.",
        build(s) {
          const sy = synth(s);
          const kinds = [["Schnipsen", "🫰", "snip"], ["Klatschen", "👏", "clap"], ["Patschen", "🦵", "patsch"], ["Stampfen", "🦶", "stamp"]];
          const grid = [
            [0, 0, 1, 0, 0, 0, 1, 0],
            [0, 0, 1, 0, 0, 0, 1, 1],
            [0, 1, 0, 0, 0, 1, 0, 0],
            [1, 0, 0, 0, 1, 0, 0, 0],
          ];
          const cellEls = grid.map((row, r) => row.map((v, c) => {
            const b = s.h("button", { class: "card", style: { minHeight: "72px", padding: "0", cursor: "pointer", fontSize: "34px", lineHeight: "1", transition: "background .1s" } });
            const paint = () => { b.style.background = grid[r][c] ? "var(--unit)" : ""; b.textContent = grid[r][c] ? kinds[r][1] : ""; };
            b.onclick = () => { grid[r][c] = grid[r][c] ? 0 : 1; paint(); if (grid[r][c]) sy.body[kinds[r][2]](); };
            paint(); b.paint = paint; return b;
          }));
          const heads = [1, 2, 3, 4, 5, 6, 7, 8].map(n => s.h("div", { class: "center", style: { font: "700 22px var(--f-display)", color: "var(--pencil)" } }, n % 2 ? String((n + 1) / 2) : "+"));
          const rowsEl = s.h("div", { style: { display: "grid", gridTemplateColumns: "190px repeat(8, 1fr)", gap: "8px", alignItems: "center" } },
            s.h("div"), ...heads,
            ...grid.flatMap((row, r) => [s.h("button", { class: "btn", style: { justifyContent: "flex-start" }, onclick: () => sy.body[kinds[r][2]]() }, kinds[r][1] + " " + kinds[r][0]), ...cellEls[r]]));
          let playing = false;
          const btn = s.h("button", { class: "btn solid" }, "▶ Abspielen");
          const tempo = s.slider({ label: "Tempo", min: 60, max: 140, step: 5, value: 90, fmt: v => v + " Schläge/min" });
          const run = async () => {
            for (let k = 0; playing && s.alive && !s.fast; k++) {
              const c = k % 8;
              grid.forEach((row, r) => { if (row[c]) sy.body[kinds[r][2]](); });
              cellEls.forEach(row => row.forEach((b, j) => { b.style.outline = j === c ? "4px solid var(--yellow)" : ""; }));
              await s.wait(30000 / Number(tempo.input.value));
            }
            cellEls.forEach(row => row.forEach(b => (b.style.outline = "")));
          };
          btn.onclick = () => { s.sfx.unlock(); playing = !playing; btn.textContent = playing ? "■ Stopp" : "▶ Abspielen"; if (playing) run(); };
          const clr = s.h("button", { class: "btn", onclick: () => { grid.forEach(r => r.fill(0)); cellEls.flat().forEach(b => b.paint()); s.sfx.swoosh(); } }, "Leeren");
          const life = s.h("div", { class: "life later", style: { padding: "12px 18px" } }, s.h("span", { class: "exlabel" }, "Im Alltag"),
            s.h("p", { class: "small" }, "In der Instrumentalklasse: Einen schweren Rhythmus erst klatschen und stampfen – dann auf dem Instrument spielen. Tiefe Klänge (Stampfen) unten, hohe (Schnipsen) oben – wie in einer Partitur."));
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "14px" } }, rowsEl,
            s.h("div", { style: { display: "grid", gridTemplateColumns: "auto auto 1fr", gap: "16px", alignItems: "center" } }, btn, clr, tempo), life));
          s.step(async () => { btn.click(); await s.wait(2000); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* 9 ------------------------------------------------------------------ */
      {
        title: "Zusammen musizieren",
        say: "Zusammen musizieren heißt: zuhören, gemeinsam anfangen, im Tempo bleiben und zusammen aufhören. Hör den Unterschied!",
        build(s) {
          const sy = synth(s);
          const players = [["🎻", "strings", 7], ["🎺", "brass", 0], ["🎷", "clarinet", 12], ["🥁", "drum", 0]];
          const icons = players.map(([e]) => s.h("div", { style: { fontSize: "60px", lineHeight: "1", textAlign: "center", transition: "transform .08s" } }, e));
          const chords = [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]];
          let token = 0;
          const run = async together => {
            s.sfx.unlock(); const my = ++token;
            const plan = [];
            players.forEach(([, inst, oct], p) => {
              const off = together ? 0 : Math.random() * 0.25, sp = together ? 1 : 0.85 + Math.random() * 0.3;
              chords.forEach((ch, i) => { const t = off + i * 0.55 * sp; plan.push([t, p]); if (inst === "drum") s.sfx.drum ? setTimeout(() => s.alive && my === token && s.sfx.drum(), t * 1000) : 0; else sy.play(inst, ch[p % 3] + oct - 12, t, 0.5, 0.14); });
            });
            const t0 = performance.now();
            s.loop(() => {
              const el = (performance.now() - t0) / 1000;
              icons.forEach((ic, p) => { const hit = plan.some(([t, q]) => q === p && el >= t && el < t + 0.12); ic.style.transform = hit ? "scale(1.25)" : ""; });
              return el < 3.2 && my === token;
            });
            verdict.textContent = together ? "Zusammen: Alle Töne kommen genau gleichzeitig. Klingt wie EIN großes Instrument!" : "Durcheinander: Jeder fängt anders an und spielt sein eigenes Tempo. Das klingt wackelig.";
            bump(verdict);
          };
          const verdict = s.h("p", { class: "t", style: { minHeight: "110px" } }, "Hör dir beides an: Erst spielen alle durcheinander, dann zusammen.");
          const demo = s.h("div", { class: "card soft", style: { display: "flex", flexDirection: "column", gap: "14px", padding: "18px 22px" } },
            s.photo("jugendorchester", { w: "100%", h: 190, pos: "50% 55%", caption: "Ein Jugendorchester probt" }),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)" } }, ...icons), verdict,
            s.h("div", { class: "row", style: { flexWrap: "nowrap" } },
              s.h("button", { class: "btn", style: { flex: "1" }, onclick: () => run(false) }, "▶ Durcheinander"),
              s.h("button", { class: "btn solid", style: { flex: "1" }, onclick: () => run(true) }, "▶ Zusammen")));
          const rules = [
            ["1  Zuhören", "Höre die anderen. Bin ich zu laut? Passe ich ins Tempo?"],
            ["2  Gemeinsam anfangen", "Blickkontakt, zusammen einatmen, auf den Einsatz achten."],
            ["3  Im Tempo bleiben", "Nicht davonrennen und nicht schleppen – der Puls zählt."],
            ["4  Zusammen aufhören", "Der Abschlag zeigt das Ende. Danach: Stille."],
          ].map(([k, v]) => card(s, k, v));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 1fr", height: "100%", alignItems: "center" } }, demo,
            s.h("div", { class: "stack", style: { gap: "12px" } }, ...rules)));
          s.step(async () => { s.sfx.pop(); await s.show(rules.slice(0, 2), "left"); });
          s.step(async () => { s.sound("beethoven5-anfang", { dur: 4 }); await s.show(rules.slice(2), "left"); });
        },
      },
      /* 10 ----------------------------------------------------------------- */
      {
        title: "Dirigieren: Einsatz und Abschlag",
        say: "Der Dirigent zeigt mit dem Einsatz, wann alle anfangen, und mit dem Abschlag, wann alle aufhören.",
        build(s) {
          const sy = synth(s);
          const svg = s.svg(460, 470);
          const add = (t, a) => { const e = s.el(t, a); svg.append(e); return e; };
          add("rect", { x: 0, y: 0, width: 460, height: 470, rx: 18, fill: "#f4fafb" });
          const trail = add("path", { d: "", fill: "none", stroke: "#0e7490", "stroke-width": 4, "stroke-dasharray": "6 8", opacity: 0.6 });
          const hand = add("circle", { cx: 230, cy: 260, r: 30, fill: "#f2c9a0", stroke: "#c08a5a", "stroke-width": 3 });
          const baton = add("line", { x1: 230, y1: 260, x2: 230, y2: 180, stroke: "#1b2740", "stroke-width": 6, "stroke-linecap": "round" });
          const tip = add("circle", { cx: 230, cy: 180, r: 9, fill: "#dc3b2a" });
          const lbl = add("text", { x: 230, y: 450, "text-anchor": "middle", class: "lbl", text: "bereit" });
          const band = ["🎻", "🎺", "🥁"].map((e, i) => add("text", { x: 415, y: 150 + i * 85, "text-anchor": "middle", "font-size": 46, text: e }));
          const waves = [0, 1, 2].map(i => add("path", { d: `M${320 + i * 20} 270 q12 -30 0 -60`, fill: "none", stroke: "#0e7490", "stroke-width": 5, "stroke-linecap": "round", opacity: 0 }));
          let pts = [];
          const place = (x, y) => { hand.setAttribute("cx", x); hand.setAttribute("cy", y + 130); baton.setAttribute("x1", x); baton.setAttribute("y1", y + 130); baton.setAttribute("x2", x); baton.setAttribute("y2", y); tip.setAttribute("cx", x); tip.setAttribute("cy", y); pts.push([x, y]); if (pts.length > 60) pts.shift(); trail.setAttribute("d", pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(0) + " " + p[1].toFixed(0)).join(" ")); };
          const move = (x0, y0, x1, y1, dur, e = "inOut") => s.tween({ from: 0, to: 1, dur, ease: e, update: v => place(x0 + (x1 - x0) * v, y0 + (y1 - y0) * v) });
          let pos = [200, 150], chord = [], busy = false, bandAnim = [];
          const startChord = () => { chord = [[0, "voice"], [4, "voice"], [-5, "ooh"], [-17, "strings"]].map(([n, i]) => sy.drone(i, sy.hz(n), 0.1)); waves.forEach(w => w.setAttribute("opacity", 0.8)); bandAnim = band.map((b, i) => b.animate([{ translate: "0 0" }, { translate: "0 -8px" }, { translate: "0 0" }], { duration: 500, delay: i * 90, iterations: Infinity })); };
          const stopChord = () => { chord.forEach(c => c.stop()); chord = []; waves.forEach(w => w.setAttribute("opacity", 0)); bandAnim.forEach(a => a.cancel()); bandAnim = []; };
          const einsatz = async () => {
            if (busy) return; busy = true; s.sfx.unlock(); stopChord(); pts = [];
            lbl.textContent = "Auftakt: ausholen – alle atmen ein!"; s.sfx.noise(0.6, 0.06, 500, 1400, 0, 0.6);
            await move(pos[0], pos[1], 200, 45, 600, "out");
            lbl.textContent = "Schlag nach unten: Einsatz!";
            await move(200, 45, 200, 230, 280, "in");
            startChord(); pos = [200, 230];
            await move(200, 230, 225, 185, 250, "out"); pos = [225, 185];
            lbl.textContent = "Alle spielen …"; busy = false;
          };
          const abschlag = async () => {
            if (busy) return; busy = true; s.sfx.unlock(); pts = [];
            lbl.textContent = "Kleiner Bogen …";
            await s.tween({ from: 0, to: 1, dur: 700, ease: "inOut", update: v => { const a = v * Math.PI * 1.6; place(pos[0] - 60 + Math.cos(a) * 60, pos[1] - Math.sin(a) * 60); } });
            lbl.textContent = "Abschlag: Hand schließen – Stille!";
            stopChord(); s.sfx.snap();
            pos = [Number(tip.getAttribute("cx")), Number(tip.getAttribute("cy"))];
            await move(pos[0], pos[1], 200, 150, 500, "out"); pos = [200, 150]; busy = false;
          };
          place(200, 150);
          const bE = s.h("button", { class: "btn solid", onclick: einsatz }, "▶ Einsatz geben");
          const bA = s.h("button", { class: "btn", onclick: abschlag }, "■ Abschlag");
          const cards = [
            card(s, "Einsatz", "Erst ausholen (Auftakt) – dabei atmen alle ein. Beim Schlag nach unten geht es los. Nicht nach unten = noch nicht spielen!"),
            card(s, "Abschlag", "Ein kleiner Bogen, dann schließt sich die Hand. Alle hören genau gleichzeitig auf."),
            card(s, "Laut und leise", "Große Bewegungen heißen meist: laut. Kleine Bewegungen: leise."),
          ];
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "460px 1fr", height: "100%", alignItems: "center" } },
            s.h("div", { class: "stack", style: { gap: "10px" } }, svg, s.photo("dirigent-taktstock", { w: 460, h: 150, pos: "50% 25%", caption: "Echt: Taktstock in der Hand" })),
            s.h("div", { class: "stack", style: { gap: "14px" } }, s.h("div", { class: "row", style: { flexWrap: "nowrap" } }, bE, bA), ...cards)));
          s.step(async () => { await einsatz(); await s.show(cards[0], "left"); });
          s.step(async () => { await abschlag(); await s.show(cards[1], "left"); });
          s.step(async () => { s.sfx.pop(); await s.show(cards[2], "left"); });
        },
      },
      /* 11 ----------------------------------------------------------------- */
      {
        title: "Schlagfiguren: 2er, 3er, 4er",
        say: "Jede Taktart hat ihre eigene Figur. Die Eins ist immer unten. Der letzte Schlag geht nach oben. Wähle einen Takt und dirigiere mit!",
        build(s) {
          const svg = s.svg(560, 500);
          const add = (t, a) => { const e = s.el(t, a); svg.append(e); return e; };
          add("rect", { x: 0, y: 0, width: 560, height: 500, rx: 18, fill: "#f4fafb" });
          const path = add("path", { d: "", fill: "none", stroke: "#0e7490", "stroke-width": 6, "stroke-linecap": "round", opacity: 0.35 });
          const numG = s.el("g"); svg.append(numG);
          const ball = add("circle", { cx: 280, cy: 380, r: 18, fill: "#dc3b2a" });
          const F = {
            2: { pts: [[280, 400], [330, 300]], ctrl: [[380, 360], [220, 40]], lab: [[250, 440], [365, 300]] },
            3: { pts: [[280, 400], [440, 340], [360, 190]], ctrl: [[360, 400], [460, 250], [250, 40]], lab: [[250, 440], [478, 345], [390, 175]] },
            4: { pts: [[280, 400], [130, 320], [440, 320], [330, 180]], ctrl: [[200, 360], [280, 420], [430, 230], [250, 30]], lab: [[250, 440], [90, 325], [475, 325], [360, 165]] },
          };
          let n = 4, beat = 0, phase = 0, playing = false, bpm = 80;
          const label = s.h("p", { class: "huge", style: { color: "var(--unit)" } }, "4/4");
          const draw = () => {
            const f = F[n]; let d = `M${f.pts[n - 1][0]} ${f.pts[n - 1][1]}`;
            for (let i = 0; i < n; i++) { const [cx, cy] = f.ctrl[(i + n - 1) % n]; const [x, y] = f.pts[i]; d += ` Q${cx} ${cy} ${x} ${y}`; }
            path.setAttribute("d", d);
            numG.innerHTML = "";
            f.lab.forEach(([x, y], i) => numG.append(s.el("text", { x, y: y + 12, "text-anchor": "middle", "font-size": 36, "font-weight": 800, fill: i === 0 ? "#dc3b2a" : "#1b2740", text: String(i + 1) })));
            label.textContent = n + "/4";
            const [x, y] = f.pts[0]; ball.setAttribute("cx", x); ball.setAttribute("cy", y);
          };
          draw();
          s.loop((t, dt) => {
            if (!playing) return;
            phase += dt * bpm / 60;
            if (phase >= 1) { phase -= 1; beat = (beat + 1) % n; if (beat === 0) s.sfx.tone(1568, 0.06, "square", 0.12); else s.sfx.tone(1046, 0.05, "square", 0.07); }
            const f = F[n], a = f.pts[beat], b = f.pts[(beat + 1) % n], c = f.ctrl[beat];
            const u = Math.pow(phase, 1.7), x = (1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0], y = (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1];
            ball.setAttribute("cx", x); ball.setAttribute("cy", y);
          });
          const setN = k => { n = k; beat = 0; phase = 0; draw(); btns.forEach((b, i) => b.classList.toggle("solid", [2, 3, 4][i] === k)); s.sfx.pop(); };
          const btns = [2, 3, 4].map(k => s.h("button", { class: "btn" + (k === 4 ? " solid" : ""), style: { flex: "1" }, onclick: () => setN(k) }, k + "/4"));
          const play = s.h("button", { class: "btn solid" }, "▶ Mitdirigieren");
          play.onclick = () => { s.sfx.unlock(); playing = !playing; play.textContent = playing ? "■ Stopp" : "▶ Mitdirigieren"; beat = 0; phase = 0; if (playing) s.sfx.tone(1568, 0.06, "square", 0.12); };
          const sl = s.slider({ label: "Tempo", min: 50, max: 120, step: 5, value: 80, fmt: v => v + " Schläge/min", onInput: v => (bpm = v) });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Die ", s.h("b", null, "1"), " geht immer nach ", s.h("b", null, "unten"), " (betont). Der ", s.h("b", null, "letzte"), " Schlag geht nach ", s.h("b", null, "oben"), " – er holt aus zur nächsten 1.");
          const ex = card(s, "Beispiele", "2/4: Marsch · 3/4: Walzer, „Happy Birthday“ · 4/4: die meisten Popsongs", "life");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "560px 1fr", height: "100%", alignItems: "center" } }, svg,
            s.h("div", { class: "stack", style: { gap: "14px" } }, s.h("div", { class: "row", style: { flexWrap: "nowrap", justifyContent: "space-between" } }, label, play),
              s.h("div", { class: "row", style: { flexWrap: "nowrap" } }, ...btns), sl, merk, ex)));
          s.step(async () => { setN(2); await s.wait(800); });
          s.step(async () => { setN(3); await s.wait(800); });
          s.step(async () => { setN(4); s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(ex, "up"); });
        },
      },
      /* 12 ----------------------------------------------------------------- */
      {
        title: "Grafische Notation",
        say: "Bei der grafischen Notation malst du Klänge als Formen. Ein Punkt ist ein kurzer Ton, eine Linie nach oben ein Ton, der steigt.",
        build(s) {
          const sy = synth(s);
          const sym = [
            ["Punkt", "kurzer Ton", g => g.append(s.el("circle", { cx: 60, cy: 35, r: 10, fill: "#1b2740" })), () => sy.play("pluck", 7, 0, 0.12, 0.3)],
            ["Linie", "langer Ton", g => g.append(s.el("line", { x1: 15, y1: 35, x2: 105, y2: 35, stroke: "#1b2740", "stroke-width": 6, "stroke-linecap": "round" })), () => sy.play("flute", 7, 0, 1.2, 0.2)],
            ["Linie nach oben", "Ton steigt", g => g.append(s.el("line", { x1: 15, y1: 58, x2: 105, y2: 12, stroke: "#1b2740", "stroke-width": 6, "stroke-linecap": "round" })), () => sy.play("flute", -5, 0, 1.2, 0.2, 12)],
            ["Welle", "Ton zittert", g => g.append(s.el("path", { d: "M10 35 q10 -20 20 0 t20 0 t20 0 t20 0 t20 0", fill: "none", stroke: "#1b2740", "stroke-width": 5 })), () => { for (let i = 0; i < 14; i++) sy.play("flute", i % 2 ? 9 : 7, i * 0.08, 0.08, 0.18); }],
            ["Dick – dünn", "laut → leise", g => g.append(s.el("path", { d: "M12 18 L108 33 L108 37 L12 52 Z", fill: "#1b2740" })), () => { const d = sy.drone("strings", sy.hz(0), 0.35); s.tween({ from: 0.35, to: 0.01, dur: 1400, update: v => d.vol(v) }).then(() => d.stop()); }],
            ["Zickzack", "Geräusch, Kratzen", g => g.append(s.el("path", { d: "M10 50 L25 18 L40 50 L55 18 L70 50 L85 18 L100 50", fill: "none", stroke: "#1b2740", "stroke-width": 5, "stroke-linejoin": "round" })), () => { for (let i = 0; i < 6; i++) s.sfx.noise(0.1, 0.25, 1500, 3500, i * 0.12, 2); }],
          ];
          const tiles = sym.map(([n, d, drawFn, f]) => {
            const svg = s.svg(120, 70); drawFn(svg);
            const b = s.h("button", { class: "card later", style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", font: "inherit", color: "inherit", cursor: "pointer", padding: "10px 8px" }, onclick: () => { s.sfx.unlock(); f(); bump(b); } },
              svg, s.h("span", { class: "h2", style: { fontSize: "23px" } }, n), s.h("span", { class: "small pencil" }, d));
            b.play = f; return b;
          });
          const score = s.svg(1100, 150);
          score.append(s.el("rect", { x: 0, y: 0, width: 1100, height: 150, rx: 16, fill: "#fff", stroke: "#c8d3de", "stroke-width": 2 }));
          const items = [
            [60, 0, g => g.append(s.el("circle", { cx: 60, cy: 75, r: 10 }), s.el("circle", { cx: 100, cy: 75, r: 10 }), s.el("circle", { cx: 140, cy: 75, r: 10 }))],
            [210, 2, g => g.append(s.el("line", { x1: 200, y1: 120, x2: 360, y2: 30, stroke: "#1b2740", "stroke-width": 6, "stroke-linecap": "round" }))],
            [420, 3, g => g.append(s.el("path", { d: "M400 40 q12 -20 24 0 t24 0 t24 0 t24 0 t24 0", fill: "none", stroke: "#1b2740", "stroke-width": 5 }))],
            [590, 1, g => g.append(s.el("line", { x1: 580, y1: 40, x2: 760, y2: 40, stroke: "#1b2740", "stroke-width": 6, "stroke-linecap": "round" }))],
            [820, 5, g => g.append(s.el("path", { d: "M810 110 L825 80 L840 110 L855 80 L870 110 L885 80 L900 110", fill: "none", stroke: "#1b2740", "stroke-width": 5 }))],
            [950, 4, g => g.append(s.el("path", { d: "M940 55 L1070 72 L1070 78 L940 95 Z" }))],
          ];
          const ink = s.el("g", { fill: "#1b2740", class: "later" }); score.append(ink);
          items.forEach(([, , d]) => d(ink));
          const head = s.el("line", { x1: 30, y1: 10, x2: 30, y2: 140, stroke: "#dc3b2a", "stroke-width": 4, opacity: 0 }); score.append(head);
          const read = async () => {
            s.sfx.unlock(); head.setAttribute("opacity", 1);
            const plays = [[0, () => { sy.play("pluck", 7, 0, 0.12, 0.3); sy.play("pluck", 7, 0.25, 0.12, 0.3); sy.play("pluck", 7, 0.5, 0.12, 0.3); }]].concat(items.slice(1).map(([x, k]) => [x, sym[k][3]]));
            let next = 0;
            await s.tween({ from: 30, to: 1080, dur: 7000, ease: "linear", update: x => { head.setAttribute("x1", x); head.setAttribute("x2", x); while (next < plays.length && x >= (next === 0 ? 50 : items[next][0] - 20)) { plays[next][1](); next++; } } });
            head.setAttribute("opacity", 0);
          };
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Lies von ", s.h("b", null, "links nach rechts"), ": links = früher, rechts = später. ", s.h("b", null, "Oben"), " = hoch, ", s.h("b", null, "unten"), " = tief. Grafische Notation gibt es seit dem 20. Jahrhundert – z. B. bei John Cage und Karlheinz Stockhausen.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "12px" } },
            s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "12px" } }, tiles),
            score, s.h("div", { class: "row", style: { flexWrap: "nowrap" } }, s.h("button", { class: "btn solid", onclick: read }, "▶ Partitur lesen"), s.h("p", { class: "small pencil" }, "Eine kleine grafische Partitur – der rote Strich liest mit.")), merk));
          s.step(async () => { s.sfx.pop(); await s.show(tiles.slice(0, 3), "pop"); });
          s.step(async () => { s.sfx.pop(); await s.show(tiles.slice(3), "pop"); });
          s.step(async () => { s.sfx.scribble(); await s.show(ink, "fade"); read(); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 13 ----------------------------------------------------------------- */
      {
        title: "Zeichne deine Musik!",
        say: "Male mit dem Finger eine Linie. Oben ist hoch, unten ist tief, und von links nach rechts läuft die Zeit. Dann drück auf Abspielen!",
        build(s) {
          const sy = synth(s);
          const W = 1100, H = 520, N = 220;
          const { canvas, g } = s.canvas(W, H);
          canvas.style.borderRadius = "18px"; canvas.style.background = "#fff"; canvas.style.border = "2px solid var(--line)"; canvas.style.touchAction = "none";
          const ys = new Array(N).fill(null);
          let head = -1, scale = false, inst = "flute";
          const fOf = y => 130.8 * Math.pow(2, (1 - y / H) * 3);
          const PENTA = [0, 2, 4, 7, 9];
          const quant = f => { const n = Math.round(12 * Math.log2(f / 130.8)); const o = Math.floor(n / 12), r = ((n % 12) + 12) % 12; const best = PENTA.reduce((a, b) => Math.abs(b - r) < Math.abs(a - r) ? b : a); return 130.8 * Math.pow(2, (o * 12 + best) / 12); };
          const paint = () => {
            g.clearRect(0, 0, W, H);
            g.strokeStyle = "#e3edf2"; g.lineWidth = 1;
            for (let y = 0; y <= H; y += 65) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
            g.fillStyle = "#5d6678"; g.font = "600 20px 'Atkinson Hyperlegible', sans-serif"; g.fillText("hoch", 12, 28); g.fillText("tief", 12, H - 14); g.fillText("Zeit →", W - 80, H - 14);
            g.strokeStyle = "#0e7490"; g.lineWidth = 9; g.lineCap = "round"; g.lineJoin = "round";
            g.beginPath(); let pen = false;
            for (let i = 0; i < N; i++) { const y = ys[i]; if (y == null) { pen = false; continue; } const x = i * (W / N) + 2; if (!pen) { g.moveTo(x, y); pen = true; } else g.lineTo(x, y); }
            g.stroke();
            if (head >= 0) { g.strokeStyle = "#dc3b2a"; g.lineWidth = 4; g.beginPath(); g.moveTo(head, 0); g.lineTo(head, H); g.stroke(); }
          };
          let last = null;
          const put = p => {
            const i = Math.max(0, Math.min(N - 1, Math.floor(p.x / (W / N)))), y = Math.max(8, Math.min(H - 8, p.y));
            if (last && Math.abs(last.i - i) > 1) { const a = Math.min(last.i, i), b = Math.max(last.i, i); for (let k = a; k <= b; k++) ys[k] = last.y + (y - last.y) * ((k - last.i) / (i - last.i)); }
            ys[i] = y; last = { i, y }; paint();
          };
          s.drag(canvas, { space: canvas, onStart: p => { last = null; put(p); s.sfx.scribble(); }, onMove: put, onEnd: () => (last = null) });
          const example = () => { for (let i = 0; i < N; i++) ys[i] = i < 20 || (i > 95 && i < 110) ? null : H / 2 - Math.sin(i / 14) * 130 - (i > 110 ? (i - 110) * 0.9 : 0) + 40; paint(); };
          example();
          let playing = false;
          const play = async () => {
            if (playing) return; playing = true; s.sfx.unlock();
            const d = sy.drone(inst, 300, 0.0001);
            await s.tween({ from: 0, to: W, dur: 5000, ease: "linear", update: x => {
              head = x; paint();
              const y = ys[Math.min(N - 1, Math.floor(x / (W / N)))];
              if (y == null) d.vol(0.0001); else { let f = fOf(y); if (scale) f = quant(f); d.set(f); d.vol(0.22); }
            } });
            d.stop(); head = -1; paint(); playing = false;
          };
          const bScale = s.h("button", { class: "btn" }, "Modus: Gleiten");
          bScale.onclick = () => { scale = !scale; bScale.textContent = scale ? "Modus: Tonstufen" : "Modus: Gleiten"; s.sfx.click(); };
          const bInst = s.h("button", { class: "btn" }, "Klang: Flöte");
          const names = { flute: "Flöte", strings: "Geige", synth: "Synthesizer" };
          bInst.onclick = () => { inst = inst === "flute" ? "strings" : inst === "strings" ? "synth" : "flute"; bInst.textContent = "Klang: " + names[inst]; s.sfx.click(); };
          const tip = s.h("p", { class: "small pencil later", style: { flex: "1" } }, "„Tonstufen“ rastet auf schöne Töne ein (Pentatonik). Lücken = Pause.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "14px" } }, canvas,
            s.h("div", { class: "row", style: { flexWrap: "nowrap" } },
              s.h("button", { class: "btn solid", onclick: play }, "▶ Abspielen"), bScale, bInst,
              s.h("button", { class: "btn", onclick: () => { ys.fill(null); paint(); s.sfx.swoosh(); } }, "Löschen"), tip)));
          s.step(async () => { await play(); });
          s.step(async () => { s.sfx.pop(); await s.show(tip, "fade"); });
        },
      },
      /* 14 ----------------------------------------------------------------- */
      {
        title: "Richtig üben",
        say: "Üben klappt am besten kurz und jeden Tag, mit guter Haltung und mit einem Plan: schwere Stellen erst langsam, dann schneller.",
        build(s) {
          const sy = synth(s);
          const days = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
          const chart = (title, vals, col) => {
            const svg = s.svg(420, 190);
            svg.append(s.el("text", { x: 0, y: 24, class: "lbl", text: title }));
            const bars = vals.map((v, i) => {
              const x = 20 + i * 56;
              svg.append(s.el("text", { x: x + 18, y: 184, "text-anchor": "middle", class: "lbl", style: { fontSize: "19px" }, text: days[i] }));
              const r = s.el("rect", { x, y: 160, width: 36, height: 0, rx: 5, fill: col }); svg.append(r); return [r, v];
            });
            return { svg, bars };
          };
          const A = chart("A: jeden Tag 15 Minuten", [15, 15, 15, 15, 15, 15, 15], "#0e7490");
          const Bc = chart("B: nur am Sonntag 105 Minuten", [0, 0, 0, 0, 0, 0, 105], "#f59e0b");
          const grow = async c => { s.sfx.unlock(); c.bars.forEach(([r, v], i) => { if (v) s.sfx.count(i); s.tween({ from: 0, to: v, dur: 700, delay: i * 90, update: h => { r.setAttribute("height", h * 1.15); r.setAttribute("y", 160 - h * 1.15); } }); }); await s.wait(1300); };
          const box = s.h("div", { class: "card" , style: { display: "flex", flexDirection: "column", gap: "6px" } }, A.svg, Bc.svg,
            s.h("p", { class: "small" }, "Beide Male 105 Minuten – aber ", s.h("b", null, "A"), " gewinnt: Wer oft und kurz übt, behält mehr."));
          const met = s.h("button", { class: "btn solid" }, "▶ Langsam → schneller");
          met.onclick = async () => {
            s.sfx.unlock();
            for (const [bpm, reps] of [[60, 4], [80, 4], [100, 4]]) for (let i = 0; i < reps && s.alive; i++) { s.sound("metronome", { force: true, vol: i ? .6 : 1 }); sy.play("clarinet", [0, 2, 4, 5][i], 0, 60 / bpm * 0.8, 0.15); await s.wait(60000 / bpm); }
          };
          const tips = [
            card(s, "1 Kurz und jeden Tag", "Lieber 15 Minuten täglich als einmal 2 Stunden. Fester Zeitpunkt, z. B. nach den Hausaufgaben."),
            card(s, "2 Gute Haltung", "Gerade sitzen oder stehen, Füße auf dem Boden, Schultern locker. Das Instrument so halten, wie es dir gezeigt wurde."),
            card(s, "3 Mit Plan", "Einspielen → schwere Stelle erst langsam, dann schneller (Metronom!) → zum Schluss etwas, das Spaß macht."),
          ];
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "460px 1fr", height: "100%", alignItems: "center" } }, box,
            s.h("div", { class: "stack", style: { gap: "12px" } }, ...tips,
              s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "14px" } }, s.photo("metronome-photo", { w: 110, h: 120, fit: "contain" }), met))));
          s.step(async () => { await grow(A); await grow(Bc); await s.show(tips[0], "left"); });
          s.step(async () => { s.sfx.pop(); await s.show(tips[1], "left"); });
          s.step(async () => { s.sfx.pop(); await s.show(tips[2], "left"); });
        },
      },
      /* 15 ----------------------------------------------------------------- */
      {
        title: "Stimmen: der Kammerton a",
        say: "Bevor ein Orchester spielt, stimmen alle ihre Instrumente auf denselben Ton: den Kammerton a mit 440 Hertz.",
        build(s) {
          const sy = synth(s);
          let f = 434, ref = null, mine = null;
          const svg = s.svg(440, 300);
          svg.append(s.el("rect", { x: 0, y: 0, width: 440, height: 300, rx: 18, fill: "#1b2740" }));
          for (let k = -10; k <= 10; k += 2) {
            const a = (k * 6 - 90) * Math.PI / 180;
            svg.append(s.el("line", { x1: 220 + Math.cos(a) * 160, y1: 240 + Math.sin(a) * 160, x2: 220 + Math.cos(a) * (k ? 145 : 135), y2: 240 + Math.sin(a) * (k ? 145 : 135), stroke: k ? "#9fb3c8" : "#22c55e", "stroke-width": k ? 3 : 6 }));
          }
          svg.append(s.el("text", { x: 60, y: 230, class: "lbl", fill: "#9fb3c8", text: "zu tief" }), s.el("text", { x: 380, y: 230, "text-anchor": "end", class: "lbl", fill: "#9fb3c8", text: "zu hoch" }));
          const needle = s.el("line", { x1: 220, y1: 240, x2: 220, y2: 95, stroke: "#dc3b2a", "stroke-width": 6, "stroke-linecap": "round" });
          svg.append(needle, s.el("circle", { cx: 220, cy: 240, r: 12, fill: "#dc3b2a" }));
          const read = s.el("text", { x: 220, y: 285, "text-anchor": "middle", "font-size": 26, "font-weight": 700, fill: "#fff", text: "" });
          svg.append(read);
          const beat = s.h("p", { class: "t", style: { minHeight: "68px" } }, "");
          const upd = () => {
            const ang = Math.max(-60, Math.min(60, (f - 440) * 6));
            needle.setAttribute("transform", `rotate(${ang} 220 240)`);
            read.textContent = s.fmt(f, 1) + " Hz – " + (Math.abs(f - 440) < 0.6 ? "stimmt!" : f < 440 ? "zu tief" : "zu hoch");
            const d = Math.abs(f - 440);
            beat.textContent = d < 0.6 ? "Kein Wabern mehr – beide Töne sind gleich. Gestimmt!" : `Hörst du das Wabern? Es „schwebt“ ${s.fmt(d, 1)}-mal pro Sekunde. Je näher, desto langsamer.`;
            if (mine) mine.set(f);
          };
          upd();
          const sl = s.slider({ label: "Dein Ton (Wirbel drehen)", min: 430, max: 450, step: 0.5, value: 434, fmt: v => s.fmt(v, 1) + " Hz", onInput: v => { f = v; upd(); } });
          const bR = s.h("button", { class: "btn" }, "▶ Kammerton a");
          const bM = s.h("button", { class: "btn" }, "▶ Dein Ton");
          bR.onclick = () => { s.sfx.unlock(); if (ref) { ref.stop(); ref = null; bR.textContent = "▶ Kammerton a"; } else { ref = sy.drone("flute", 440, 0.16); bR.textContent = "■ Kammerton a"; } };
          bM.onclick = () => { s.sfx.unlock(); if (mine) { mine.stop(); mine = null; bM.textContent = "▶ Dein Ton"; } else { mine = sy.drone("strings", f, 0.1); bM.textContent = "■ Dein Ton"; } };
          const facts = [
            card(s, "Kammerton", "a¹ = 440 Hz: Das wurde 1939 bei einer Konferenz in London international festgelegt. Viele deutsche Orchester stimmen etwas höher, oft auf 443 Hz."),
            s.h("div", { class: "life later", style: { padding: "12px 18px", display: "grid", gridTemplateColumns: "1fr 120px", gap: "12px", alignItems: "center" } },
              s.h("div", null, s.h("span", { class: "exlabel" }, "Wie stimmt man?"),
                s.h("p", { class: "small" }, "Mit Stimmgerät, Stimmgabel oder nach der Oboe im Orchester. Geige: an den Wirbeln drehen. Blasinstrumente: Mundstück oder Zug etwas verschieben."),
                s.h("div", { class: "row", style: { gap: "8px", marginTop: "6px" } }, s.soundBtn("tuning-fork", "Stimmgabel"), s.soundBtn("oboe-a", "Oboe"))),
              s.photo("tuning-fork-resonator", { w: 120, h: 150, fit: "contain" })),
          ];
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "440px 1fr", height: "100%", alignItems: "center" } },
            s.h("div", { class: "stack", style: { gap: "12px" } }, svg, s.h("div", { class: "row", style: { flexWrap: "nowrap" } }, bR, bM), sl),
            s.h("div", { class: "stack", style: { gap: "14px" } }, beat, ...facts)));
          s.step(async () => { bR.click(); bM.click(); await s.tween({ from: 434, to: 440, dur: 3000, update: v => { f = Math.round(v * 2) / 2; sl.input.value = f; upd(); } }); sl.set(440); await s.show(facts[0], "left"); });
          s.step(async () => { if (ref) bR.click(); if (mine) bM.click(); s.sound("tuning-fork", { dur: 2.5 }); await s.show(facts[1], "left"); });
        },
      },
      /* 16 ----------------------------------------------------------------- */
      {
        title: "Im Alltag: Wir machen Musik",
        say: "Gemeinsam singen und spielen machst du ganz oft: beim Geburtstag, im Stadion, im Schulchor, beim Karaoke und in der Instrumentalklasse.",
        build(s) {
          const sy = synth(s);
          const mel = [[-5, 0.75], [-5, 0.25], [-3, 1], [-5, 1], [0, 1], [-1, 2], [-5, 0.75], [-5, 0.25], [-3, 1], [-5, 1], [2, 1], [0, 2], [-5, 0.75], [-5, 0.25], [7, 1], [4, 1], [0, 1], [-1, 1], [-3, 2], [5, 0.75], [5, 0.25], [4, 1], [0, 1], [2, 1], [0, 2]];
          const syl = "Hap-|py |birth-|day |to |you, |Hap-|py |birth-|day |to |you, |Hap-|py |birth-|day |dear |Ju-|lian, |Hap-|py |birth-|day |to |you!".split("|");
          const lines = [[0, 6], [6, 12], [12, 19], [19, 25]];
          const spans = syl.map(t => s.h("span", { style: { display: "inline-block", padding: "2px 1px", marginRight: t.endsWith(" ") ? "10px" : "0", borderRadius: "8px", transition: "background .1s, transform .1s" } }, t.trim()));
          const lyr = s.h("div", { class: "stack", style: { gap: "4px", font: "700 28px/1.3 var(--f-display)" } }, lines.map(([a, b]) => s.h("div", null, spans.slice(a, b))));
          let tok = 0;
          const sing = async () => {
            s.sfx.unlock(); const my = ++tok; const beat = 0.42;
            let t = 0; mel.forEach(([n, b]) => { sy.play("piano", n, t, b * beat, 0.2); sy.play("voice", n, t, b * beat * 0.95, 0.12); t += b * beat; });
            for (let i = 0; i < mel.length && s.alive && my === tok; i++) {
              spans.forEach((sp, j) => { sp.style.background = j === i ? "var(--yellow)" : ""; sp.style.transform = j === i ? "translateY(-4px)" : ""; });
              await s.wait(mel[i][1] * beat * 1000);
            }
            spans.forEach(sp => { sp.style.background = ""; sp.style.transform = ""; });
            if (s.alive && my === tok) s.confetti(300, 300, 60);
          };
          const karaoke = s.h("div", { class: "card soft", style: { display: "flex", flexDirection: "column", gap: "12px" } },
            s.h("span", { class: "exlabel" }, "Geburtstag · Karaoke"), lyr,
            s.h("button", { class: "btn solid", onclick: sing }, "▶ Mitsingen"),
            s.h("p", { class: "small pencil" }, "Das Lied ist so alt, dass es heute allen gehört: In der EU ist es seit 2017 gemeinfrei. Es steht im 3/4-Takt."));
          const items = [
            ["🏟️", "Stadion", "Zehntausende singen und rufen zusammen – unisono!", () => s.sound("crowd-cheer", { force: true }), "fankurve"],
            ["🎤", "Schulchor", "Sopran, Alt und Männerstimmen singen mehrstimmig – mit Dirigent.", () => s.sound("chor-tallis", { force: true, dur: 7 }), "thomanerchor"],
            ["🎶", "Karaoke", "Text und Melodie laufen mit – wie hier links. Einfach mitsingen!", () => sy.seq("synth", [[0, 1], [4, 1], [7, 1], [12, 2]], 0.18, 0.1)],
            ["🎻", "Instrumentalklasse", "Stimmen → Einspielen → Einsatz vom Dirigenten → zusammen spielen.", () => { s.sound("oboe-a", { force: true, dur: 2 }); s.sound("orchester-stimmt", { force: true, when: 2, dur: 4 }); }, "jugendorchester"],
          ].map(([e, k, v, f, pic]) => {
            const em = pic ? s.photo(pic, { w: 110, h: 80 }) : s.h("span", { style: { fontSize: "40px", lineHeight: "1", textAlign: "center" } }, e);
            return s.h("div", { class: "life later", style: { display: "grid", gridTemplateColumns: "110px 1fr", gap: "12px", alignItems: "center", textAlign: "left", font: "inherit", color: "inherit", cursor: "pointer", padding: "10px 14px" }, onclick: () => { s.sfx.unlock(); f(); bump(em); } },
              em, s.h("div", null, s.h("p", { class: "h2", style: { fontSize: "23px" } }, k), s.h("p", { class: "small" }, v)));
          });
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 1fr", height: "100%", alignItems: "center", gap: "22px" } }, karaoke,
            s.h("div", { class: "stack", style: { gap: "10px" } }, ...items)));
          s.step(async () => { sing(); s.sfx.pop(); await s.show(items.slice(0, 2), "left"); });
          s.step(async () => { s.sfx.pop(); await s.show(items.slice(2), "left"); });
        },
      },
    ],
  });
})();
