/* Kapitel 7 – Musik erzählt Geschichten (Programmmusik, Peter und der Wolf, Karneval der Tiere,
   Die Moldau, Bergkönig, Leitmotiv & Filmmusik, eigene Klanggeschichte).
   Alle Klänge werden live synthetisiert. Melodie-Zitate nur wenige Töne aus gemeinfreien Werken;
   die Figuren-Motive sind eigene Motive "im Stil von", keine Original-Melodien. */
(() => {
  /* ---------- kleiner Instrumenten-Synth (respektiert Ton aus + Prüfmodus) ---------- */
  const P = {
    strings: { w: "sawtooth", w2: "sawtooth", lp: 2300, a: 0.07, rel: 0.12, vib: 0.006 },
    cello: { w: "sawtooth", w2: "sawtooth", lp: 1300, a: 0.09, rel: 0.15, vib: 0.007 },
    flute: { w: "sine", w2: "triangle", lp: 4000, a: 0.04, rel: 0.08, vib: 0.008 },
    oboe: { w: "sawtooth", bp: 1500, q: 1.3, a: 0.02, rel: 0.06, vib: 0.005 },
    clarinet: { w: "square", lp: 1500, a: 0.03, rel: 0.06, vib: 0.002 },
    bassoon: { w: "sawtooth", lp: 650, q: 2, a: 0.03, rel: 0.06, vib: 0.003 },
    horn: { w: "sawtooth", lp: 700, a: 0.1, rel: 0.15, vib: 0.003 },
    brass: { w: "sawtooth", lp: 1800, a: 0.04, rel: 0.08, vib: 0.003 },
    piano: { w: "triangle", lp: 3000, perc: true },
    pluck: { w: "triangle", lp: 700, perc: true },
    celesta: { w: "sine", w2: "sine", mul: 4, lp: 8000, perc: true },
    xylo: { w: "sine", w2: "sine", mul: 3, lp: 8000, perc: true, short: true },
    bass: { w: "sawtooth", lp: 420, a: 0.06, rel: 0.1, vib: 0.004 },
  };
  function synth(s) {
    const ac = () => (s.sfx.on && !s.fast && s.alive ? s.sfx.unlock() : null);
    let busNode = null;
    const bus = a => {
      if (!busNode) {
        busNode = a.createGain(); busNode.gain.value = 0.5; busNode.connect(a.destination);
        const nd = busNode; s.onLeave(() => { try { nd.gain.setTargetAtTime(0, a.currentTime, 0.04); setTimeout(() => nd.disconnect(), 400); } catch (e) {} });
      }
      return busNode;
    };
    const hz = n => 523.25 * Math.pow(2, n / 12);
    function play(inst, n, when = 0, dur = 0.3, vol = 0.22, glide = null) {
      const a = ac(); if (!a) return;
      const p = P[inst] || P.piano, f = hz(n), t = a.currentTime + when;
      const g = a.createGain(), fl = a.createBiquadFilter();
      fl.type = p.bp ? "bandpass" : "lowpass"; fl.frequency.value = p.bp || p.lp || 4000; fl.Q.value = p.q || 0.7;
      fl.connect(g); g.connect(bus(a));
      const ws = p.w2 ? [p.w, p.w2] : [p.w];
      const os = ws.map((w, i) => {
        const o = a.createOscillator(); o.type = w;
        const ff = f * (i && p.mul ? p.mul : 1) * (i && !p.mul ? 1.005 : 1);
        o.frequency.setValueAtTime(ff, t);
        if (glide != null) o.frequency.exponentialRampToValueAtTime(hz(glide) * (i && p.mul ? p.mul : 1), t + dur);
        const og = a.createGain(); og.gain.value = i && p.mul ? 0.25 : i ? 0.6 : 1;
        o.connect(og); og.connect(fl); return o;
      });
      if (p.vib) {
        const l = a.createOscillator(), lg = a.createGain(); l.frequency.value = 5.5; lg.gain.value = f * p.vib;
        l.connect(lg); os.forEach(o => lg.connect(o.frequency)); l.start(t); l.stop(t + dur + 0.1);
      }
      g.gain.setValueAtTime(0.0001, t);
      if (p.perc) {
        g.gain.exponentialRampToValueAtTime(vol, t + 0.006);
        g.gain.exponentialRampToValueAtTime(0.0001, t + (p.short ? Math.min(dur, 0.18) : dur + 0.25));
      } else {
        g.gain.exponentialRampToValueAtTime(vol, t + p.a);
        g.gain.setValueAtTime(vol * 0.85, t + Math.max(p.a, dur - p.rel));
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur + p.rel);
      }
      os.forEach(o => { o.start(t); o.stop(t + dur + 0.4); });
    }
    function timp(n = -24, when = 0, vol = 0.5) {
      if (!ac()) return;
      s.sfx.tone(hz(n), 0.7, "sine", vol, when, hz(n) * 0.92);
      s.sfx.noise(0.12, 0.18, 400, 150, when, 1);
    }
    /** notes: [[semitone|null, beats], ...]; returns total seconds */
    function seq(inst, notes, beat = 0.25, vol = 0.22, start = 0) {
      let t = start;
      for (const [n, b] of notes) { if (n != null) play(inst, n, t, b * beat * 0.95, vol); t += b * beat; }
      return t;
    }
    return { play, timp, seq, hz, ac };
  }
  const NS = "http://www.w3.org/2000/svg";
  const bump = el => { el.classList.remove("a-pop"); void el.getBoundingClientRect(); el.classList.add("a-pop"); };

  Deck.unit({
    id: "u7", num: 7, title: "Musik erzählt Geschichten", color: "#a21caf", soft: "#f7e3f9",
    subtitle: "Ohne Worte – nur mit Tönen",
    blurb: "Peter und der Wolf, Karneval der Tiere, Moldau, Filmmusik.",
    goals: [
      "Programmmusik und absolute Musik unterscheiden",
      "Hören, wie Instrumente Figuren und Tiere spielen",
      "Die Moldau und den Bergkönig erleben",
      "Verstehen, wie Filmmusik Gefühle macht",
      "Deine eigene Klanggeschichte bauen",
    ],
    icon(svg, el) {
      svg.append(
        el("rect", { x: 12, y: 14, width: 46, height: 42, rx: 6, fill: "#a21caf", opacity: 0.15 }),
        el("path", { d: "M35 18 v34 M35 18 q-12 -4 -20 0 v34 q8 -4 20 0 M35 18 q12 -4 20 0 v34 q-8 -4 -20 0", fill: "none", stroke: "#a21caf", "stroke-width": 3, "stroke-linejoin": "round" }),
        el("circle", { cx: 52, cy: 52, r: 6, fill: "#a21caf" }), el("path", { d: "M58 52 V30 l6 3", fill: "none", stroke: "#a21caf", "stroke-width": 3 }));
    },
    slides: [
      /* 1 ------------------------------------------------------------------ */
      {
        title: "Programmmusik – absolute Musik",
        say: "Manche Musik erzählt eine Geschichte. Das nennt man Programmmusik. Andere Musik ist einfach nur Musik: absolute Musik.",
        build(s) {
          const sy = synth(s);
          // real recordings: Vivaldi's summer storm vs. Mozart's variations (no story)
          let cur = null;
          const storm = () => { if (cur) cur.stop(); cur = s.sound("vivaldi-gewitter", { force: true }); bump(cloud); };
          const pure = () => { if (cur) cur.stop(); cur = s.sound("mozart-thema", { force: true, dur: 8 }); bump(notes); };
          const cloud = s.photo("vivaldi", { w: 110, h: 130, pos: "50% 20%", style: { display: "inline-block" } });
          const notes = s.photo("mozart", { w: 110, h: 130, pos: "50% 25%", style: { display: "inline-block" } });
          const card = (head, cls, emo, lines, btn) => s.h("div", { class: "card " + cls, style: { display: "flex", flexDirection: "column", gap: "12px" } },
            s.h("div", { class: "row", style: { justifyContent: "space-between", flexWrap: "nowrap" } }, s.h("p", { class: "h2" }, head), emo),
            ...lines, btn);
          const left = card("Programmmusik", "soft later", cloud, [
            s.h("p", { class: "t" }, "Die Musik erzählt eine ", s.h("b", null, "Geschichte"), " oder malt ein ", s.h("b", null, "Bild"), ". Ein Titel oder Text verrät das „Programm“."),
            s.h("p", { class: "small" }, "Vivaldi: „Die vier Jahreszeiten“ · Smetana: „Die Moldau“ · Prokofjew: „Peter und der Wolf“"),
          ], s.h("button", { class: "btn solid", onclick: storm }, "▶ Vivaldi: Sommer-Gewitter"));
          const right = card("Absolute Musik", "later", notes, [
            s.h("p", { class: "t" }, "Nur Töne, Rhythmus und Klang – ", s.h("b", null, "ohne"), " Geschichte. Die Musik ist ihr eigenes Thema."),
            s.h("p", { class: "small" }, "Mozart: Sinfonie Nr. 40 · Bach: Fugen · Haydn: Sinfonie Nr. 82 – „Der Bär“ ist nur ein Spitzname vom Publikum!"),
          ], s.h("button", { class: "btn", onclick: pure }, "▶ Mozart: reine Musik"));
          const merk = s.h("div", { class: "merk later" }, "Dieselben Instrumente – aber bei Programmmusik hast du beim Hören eine ", s.h("b", null, "Geschichte im Kopf"), ".");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "22px" } },
            s.h("div", { class: "cols", style: { alignItems: "stretch" } }, left, right), merk));
          s.step(async () => { cur = s.sound("vivaldi-gewitter"); await s.show(left, "left"); s.say("Programmmusik: ein Gewitter, ein Fluss, ein Wolf."); });
          s.step(async () => { if (cur) cur.stop(); cur = s.sound("mozart-thema", { dur: 6 }); await s.show(right, "right"); s.say("Absolute Musik hat keine Geschichte."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 2 ------------------------------------------------------------------ */
      {
        title: "Wie malt Musik ein Bild?",
        say: "Musik hat vier Werkzeuge, um Bilder zu malen: Tonhöhe, Tempo, Lautstärke und Klangfarbe. Tippe auf die Knöpfe!",
        build(s) {
          const sy = synth(s);
          const tool = (head, info, a, b) => {
            const emo = s.h("div", { style: { fontSize: "64px", lineHeight: "1", width: "84px", textAlign: "center", display: "inline-block" } }, a.e);
            const mk = o => s.h("button", { class: "btn", style: { flex: "1" }, onclick: () => { s.sfx.unlock(); emo.textContent = o.e; bump(emo); o.f(); } }, o.l);
            return s.h("div", { class: "card later", style: { display: "grid", gridTemplateColumns: "1fr 84px", gap: "6px 14px", alignItems: "center" } },
              s.h("div", null, s.h("p", { class: "h2" }, head), s.h("p", { class: "small pencil" }, info)), emo,
              s.h("div", { class: "row", style: { gridColumn: "1 / 3", flexWrap: "nowrap", gap: "10px" } }, mk(a), mk(b)));
          };
          const mel = [0, 4, 7, 4];
          const cards = [
            tool("Tonhöhe", "hoch = klein und leicht, tief = groß und schwer",
              { e: "🐦", l: "hoch: Vogel", f: () => mel.forEach((n, i) => sy.play("flute", n + 24, i * 0.12, 0.11, 0.2)) },
              { e: "🐻", l: "tief: Bär", f: () => mel.forEach((n, i) => sy.play("bassoon", n - 24, i * 0.3, 0.28, 0.3)) }),
            tool("Tempo", "schnell = flink, langsam = gemütlich",
              { e: "🐭", l: "schnell: Maus", f: () => [0, 2, 4, 2, 0, 2, 4, 7].forEach((n, i) => sy.play("clarinet", n + 7, i * 0.08, 0.07, 0.2)) },
              { e: "🐢", l: "langsam: Kröte", f: () => [0, 2, 4, 2].forEach((n, i) => sy.play("clarinet", n, i * 0.55, 0.5, 0.2)) }),
            tool("Lautstärke", "laut = stark oder nah, leise = heimlich",
              { e: "🦖", l: "laut: Riese", f: () => [-12, -12, -9, -12].forEach((n, i) => sy.play("brass", n, i * 0.3, 0.27, 0.42)) },
              { e: "🐈", l: "leise: Schleichen", f: () => [-5, -3, -1, 0].forEach((n, i) => sy.play("pluck", n, i * 0.35, 0.2, 0.06)) }),
            tool("Klangfarbe", "jedes Instrument hat seinen eigenen Klang",
              { e: "✨", l: "Flöte: hell", f: () => sy.seq("flute", [[12, 1], [14, 1], [16, 2]], 0.25, 0.22) },
              { e: "🌑", l: "Fagott: dunkel", f: () => sy.seq("bassoon", [[-12, 1], [-10, 1], [-8, 2]], 0.25, 0.3) }),
          ];
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "18px" } },
            s.h("p", { class: "t" }, "Vier Werkzeuge, mit denen Musik ", s.h("span", { class: "hl" }, "Bilder malt"), ":"),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", flex: "1" } }, cards)));
          cards.forEach((c, i) => s.step(async () => { s.sfx.pop(); await s.show(c, "pop"); }));
        },
      },
      /* 3 ------------------------------------------------------------------ */
      {
        title: "Peter und der Wolf",
        say: "Peter und der Wolf ist ein musikalisches Märchen von Sergej Prokofjew aus dem Jahr 1936. Ein Erzähler liest, das Orchester spielt die Figuren.",
        build(s) {
          const sy = synth(s);
          const svg = s.svg(470, 440);
          const add = (t, a) => { const e = s.el(t, a); svg.append(e); return e; };
          add("rect", { x: 10, y: 10, width: 450, height: 420, rx: 18, fill: "#2d1238" });
          add("rect", { x: 30, y: 330, width: 410, height: 80, rx: 8, fill: "#7a4a22" });
          const seats = [];
          for (let r = 0; r < 3; r++) for (let c = 0; c < 9 - r * 2; c++) {
            const x = 235 + (c - (8 - r * 2) / 2) * 40, y = 300 - r * 45;
            seats.push(add("circle", { cx: x, cy: y, r: 13, fill: ["#f0abfc", "#fde68a", "#93c5fd"][r], class: "later" }));
          }
          add("rect", { x: 205, y: 120, width: 60, height: 10, rx: 3, fill: "#fbbf24", class: "later", id: "u7pult" });
          const curL = add("rect", { x: 10, y: 10, width: 225, height: 420, fill: "#b91c1c" });
          const curR = add("rect", { x: 235, y: 10, width: 225, height: 420, fill: "#b91c1c" });
          const book = add("text", { x: 235, y: 110, "text-anchor": "middle", "font-size": 48, text: "📖", class: "later" });
          const facts = [
            ["Komponist", "Sergej Prokofjew (1891–1953), Russland"],
            ["Jahr", "1936 – Uraufführung in Moskau"],
            ["Auftrag", "für ein Kindertheater in Moskau"],
            ["Idee", "Kinder lernen die Instrumente des Orchesters kennen"],
          ].map(([k, v], i) => i ? s.h("div", { class: "card later", style: { padding: "12px 18px" } }, s.h("span", { class: "exlabel" }, k), s.h("p", { class: "t" }, v))
            : s.h("div", { class: "card later", style: { padding: "10px 18px", display: "grid", gridTemplateColumns: "100px 1fr", gap: "14px", alignItems: "center" } },
              s.photo("prokofjew", { w: 100, h: 120, pos: "50% 25%" }), s.h("div", null, s.h("span", { class: "exlabel" }, k), s.h("p", { class: "t" }, v))));
          const merk = s.h("div", { class: "merk later" }, "Ein ", s.h("b", null, "Erzähler"), " liest die Geschichte. Jede Figur hat ihr ", s.h("b", null, "eigenes Instrument"), ".");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "470px 1fr", height: "100%", alignItems: "center" } }, svg,
            s.h("div", { class: "stack", style: { gap: "12px" } }, ...facts, merk)));
          s.sfx.whoosh();
          s.step(async () => {
            s.sfx.unlock(); sy.seq("strings", [[0, 1], [4, 1], [7, 2]], 0.25, 0.18);
            s.tween({ from: 0, to: 1, dur: 900, update: v => { curL.setAttribute("width", 225 * (1 - v) + 18 * v); curR.setAttribute("x", 235 + 207 * v); curR.setAttribute("width", 225 * (1 - v) + 18 * v); } });
            await s.show(seats, "pop"); s.show(svg.querySelector("#u7pult"), "fade"); s.show(book, "bounce");
            await s.show(facts.slice(0, 2), "left");
          });
          s.step(async () => { s.sfx.pop(); await s.show(facts.slice(2), "left"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 4 ------------------------------------------------------------------ */
      {
        title: "Jede Figur – ein Instrument",
        say: "Tippe auf eine Figur und hör ihren Klang. Der Vogel ist eine Flöte, der Wolf sind drei Hörner.",
        build(s) {
          const sy = synth(s);
          const cast = [
            ["👦", "Peter", "Streicher", "violin", () => sy.seq("strings", [[0, 1], [2, 1], [4, 1], [7, 2], [4, 1], [0, 2]], 0.17, 0.18)],
            ["🐦", "Vogel", "Querflöte", "querfloete", () => sy.seq("flute", [[24, 1], [28, 1], [26, 1], [31, 1], [28, 1], [33, 1], [31, 2]], 0.08, 0.2)],
            ["🦆", "Ente", "Oboe", "oboe", () => sy.seq("oboe", [[7, 2], [5, 1], [4, 2], [2, 1], [0, 3]], 0.2, 0.24)],
            ["🐈", "Katze", "Klarinette", "klarinette", () => sy.seq("clarinet", [[-5, 1], [null, 1], [-2, 1], [null, 1], [0, 1], [3, 1], [-2, 2]], 0.13, 0.2)],
            ["👴", "Großvater", "Fagott", "fagott", () => sy.seq("bassoon", [[-17, 2], [-15, 1], [-13, 1], [-17, 2], [-20, 3]], 0.2, 0.32)],
            ["🐺", "Wolf", "3 Hörner", "horn", () => { [-12, -9, -5].forEach(n => sy.play("horn", n, 0, 1.2, 0.17)); [-11, -8, -4].forEach(n => sy.play("horn", n, 1.2, 1.0, 0.15)); }],
            ["🤠", "Jäger", "Holzbläser, Trompete, Pauken", "pauken", () => { sy.seq("brass", [[0, 1], [0, 1], [7, 2]], 0.15, 0.14); sy.timp(-24, 0.7, 0.55); sy.timp(-24, 1.0, 0.55); s.sfx.noise(0.3, 0.3, 300, 80, 1.0, 0.8); }],
          ];
          const tiles = cast.map(([e, n, inst, pic, f]) => {
            const emo = s.h("div", { style: { fontSize: "52px", lineHeight: "1.05" } }, e);
            const t = s.h("div", {
              class: "card later", style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", cursor: "pointer", font: "inherit", color: "inherit", minHeight: "56px", padding: "12px 10px" },
              onclick: () => { s.sfx.unlock(); f(); bump(emo); t.style.borderColor = "var(--unit)"; },
            }, emo, s.h("span", { class: "h2", style: { fontSize: "26px" } }, n), s.photo(pic, { w: "100%", h: 110, fit: "contain" }), s.h("span", { class: "small pencil", style: { textAlign: "center" } }, inst));
            return t;
          });
          const note = s.h("p", { class: "small pencil" }, "Fotos: die echten Instrumente. Die Klänge sind nachgebaut – kleine Motive im Stil der Figuren, nicht die Original-Melodien.");
          const merk = s.h("div", { class: "merk later", style: { gridColumn: "4 / 5", fontSize: "24px", padding: "14px 18px" } }, "Klein und flink → ", s.h("b", null, "hoch"), ". Gefährlich → ", s.h("b", null, "tief und laut"), ".");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "14px" } },
            s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "1fr 1fr", gap: "16px", flex: "1" } }, ...tiles, merk), note));
          s.step(async () => { s.sfx.pop(); await s.show(tiles.slice(0, 4), "pop"); s.say("Peter, Vogel, Ente und Katze."); });
          s.step(async () => { s.sfx.pop(); await s.show(tiles.slice(4), "pop"); s.say("Großvater, Wolf und die Jäger."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 5 ------------------------------------------------------------------ */
      {
        title: "Die Geschichte in sechs Bildern",
        say: "So geht die Geschichte. Bei jedem Weiter kommt ein neues Bild – mit dem passenden Instrument.",
        build(s) {
          const sy = synth(s);
          const scenes = [
            ["👦🌳", "Peter geht durch das Gartentor auf die Wiese.", () => sy.seq("strings", [[0, 1], [2, 1], [4, 1], [7, 2]], 0.18, 0.18)],
            ["🐦🦆", "Vogel und Ente streiten. Die Katze schleicht heran.", () => { sy.seq("flute", [[24, 1], [28, 1], [26, 1], [31, 1]], 0.09, 0.2); sy.seq("oboe", [[7, 2], [5, 1], [4, 2]], 0.18, 0.22, 0.45); }],
            ["👴🚪", "Der Großvater schimpft und holt Peter nach Hause.", () => sy.seq("bassoon", [[-17, 2], [-15, 1], [-13, 1], [-20, 3]], 0.2, 0.32)],
            ["🐺🦆", "Der Wolf kommt – und verschluckt die Ente!", () => [-12, -9, -5].forEach(n => sy.play("horn", n, 0, 1.3, 0.17))],
            ["🪢🐺", "Peter fängt den Wolf mit einem Seil. Der Vogel lenkt ihn ab.", () => { sy.seq("strings", [[0, 1], [4, 1], [7, 1], [12, 2]], 0.14, 0.18); sy.seq("flute", [[31, 1], [28, 1], [31, 1]], 0.08, 0.18, 0.6); }],
            ["🤠🦁", "Die Jäger kommen. Alle bringen den Wolf in den Zoo.", () => { sy.timp(-24, 0, 0.5); sy.timp(-24, 0.3, 0.5); sy.seq("brass", [[0, 1], [4, 1], [7, 1], [12, 2]], 0.18, 0.14, 0.6); }],
          ];
          const cards = scenes.map(([e, txt, f], i) => {
            const em = s.h("div", { style: { fontSize: "52px", lineHeight: "1.1", textAlign: "center" } }, e);
            const c = s.h("div", { class: "card" + (i ? " later" : ""), style: { display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center", padding: "14px 18px" } },
              s.h("span", { class: "exlabel" }, "Bild " + (i + 1)), em, s.h("p", { class: "small" }, txt),
              s.h("button", { class: "btn", style: { minHeight: "56px" }, onclick: () => { s.sfx.unlock(); f(); bump(em); } }, "▶ anhören"));
            c.play = () => { f(); bump(em); };
            return c;
          });
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "1fr 1fr", gap: "16px", height: "100%" } }, cards));
          cards.slice(1).forEach((c, i) => s.step(async () => { s.sfx.whoosh(); await s.show(c, "up"); c.play(); }));
        },
      },
      /* 6 ------------------------------------------------------------------ */
      {
        title: "Der Karneval der Tiere",
        say: "Camille Saint-Saëns schrieb 1886 den Karneval der Tiere: vierzehn kurze Stücke, in denen Tiere musizieren.",
        build(s) {
          const sy = synth(s);
          const animals = ["🦁", "🐔", "🫏", "🐢", "🐘", "🦘", "🐠", "🐦", "🎹", "🦴", "🦢"];
          const { canvas: lane, g } = s.canvas(900, 150);
          lane.style.borderRadius = "18px"; lane.style.background = "var(--unit-soft)";
          const span = 900 + 100;
          s.loop(t => {
            g.clearRect(0, 0, 900, 150); g.font = "74px serif"; g.textBaseline = "middle";
            animals.forEach((a, i) => { const x = ((i * span) / animals.length + t * 70) % span - 90; g.fillText(a, x, 82 - Math.abs(Math.sin(t * 6 + i)) * 10); });
          });
          const facts = [
            ["Komponist", "Camille Saint-Saëns (1835–1921), Paris"],
            ["Jahr", "1886 – als Spaß für Freunde"],
            ["Aufbau", "14 kurze Sätze: Löwe, Hühner, Schildkröten, Elefant, Aquarium, Kuckuck, Schwan …"],
            ["Witz", "Sogar „Pianisten“ und „Fossilien“ sind als Tiere dabei!"],
          ].map(([k, v], i) => i ? s.h("div", { class: "card later", style: { padding: "12px 18px" } }, s.h("span", { class: "exlabel" }, k), s.h("p", { class: "t" }, v))
            : s.h("div", { class: "card later", style: { padding: "10px 18px", display: "grid", gridTemplateColumns: "90px 1fr", gap: "14px", alignItems: "center" } },
              s.photo("saint-saens", { w: 90, h: 110, pos: "50% 15%" }), s.h("div", null, s.h("span", { class: "exlabel" }, k), s.h("p", { class: "t" }, v))));
          const merk = s.h("div", { class: "merk later" }, "Saint-Saëns wollte das Werk ", s.h("b", null, "nicht veröffentlichen"), " – es war ihm zu albern. Gedruckt wurde es erst ", s.h("b", null, "nach seinem Tod"), " (1921).");
          let cur = null;
          const march = (tap = false) => { if (cur) cur.stop(); cur = s.sound("karneval-loewe", { force: tap }); };
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "20px", justifyContent: "center" } },
            s.h("div", { class: "row", style: { flexWrap: "nowrap" } }, lane, s.h("button", { class: "btn solid", style: { flex: "1" }, onclick: () => march(true) }, "▶ Löwen-Marsch")),
            s.h("div", { class: "cols", style: { gap: "16px" } }, ...facts), merk));
          march();
          s.step(async () => { s.sfx.pop(); await s.show(facts.slice(0, 2), "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(facts.slice(2), "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 7 ------------------------------------------------------------------ */
      {
        title: "So klingen die Tiere",
        say: "Tippe auf ein Tier, dann hörst du die echte Musik von Saint-Saëns. Der Elefant ist ein Kontrabass, der Schwan ein Cello, und die Fossilien klappern auf dem Xylophon.",
        build(s) {
          const sy = synth(s);
          const REC = { Elefant: "karneval-elefant", Schwan: "karneval-schwan", Aquarium: "karneval-aquarium", Schildkröten: "karneval-schildkroeten", Fossilien: "karneval-fossilien" };
          const PIC = { Elefant: "elefant", Schwan: "schwan", Aquarium: "aquarium", Kuckuck: "kuckuck-vogel", Schildkröten: "schildkroete", Fossilien: "fossil" };
          let cur = null;
          const tiles = [
            ["🐘", "Elefant", "Kontrabass, tief und schwer. Er tanzt einen Tanz, der eigentlich für Elfen gedacht war!", () => sy.seq("bass", [[-24, 2], [-17, 1], [-17, 1], [-22, 2], [-17, 1], [-17, 1], [-24, 3]], 0.2, 0.38)],
            ["🦢", "Schwan", "Cello singt ruhig. Das Klavier plätschert wie Wasser.", () => { sy.seq("cello", [[-5, 3], [-3, 1], [-1, 2], [0, 4]], 0.28, 0.2); for (let i = 0; i < 16; i++) sy.play("piano", [7, 12, 16, 12][i % 4], i * 0.14, 0.13, 0.06); }],
            ["🐠", "Aquarium", "Glitzernde Läufe wie Licht im Wasser.", () => { for (let i = 0; i < 10; i++) sy.play("celesta", 31 - i * 2, i * 0.09, 0.4, 0.12); sy.seq("strings", [[0, 4]], 0.4, 0.08); }],
            ["🐦", "Kuckuck", "Die Klarinette ruft immer nur zwei Töne: c und as. Danach: ein echter Kuckuck!", () => { sy.seq("clarinet", [[0, 1], [-4, 2], [null, 2], [0, 1], [-4, 2]], 0.25, 0.22); cur = s.sound("kuckuck", { when: 2.4, dur: 4, force: true }); }],
            ["🐢", "Schildkröten", "Ein superschneller Tanz (Cancan) – ganz langsam gespielt. Hör: erst schnell, dann langsam!", () => { const f = [[0, 1], [4, 1], [7, 1], [4, 1], [9, 1], [7, 1], [5, 1], [2, 1], [0, 2]]; const t = sy.seq("piano", f, 0.09, 0.2); sy.seq("strings", f, 0.42, 0.16, t + 0.4); }],
            ["🦴", "Fossilien", "Das Xylophon klappert wie Knochen. Dazu „Morgen kommt der Weihnachtsmann“.", () => sy.seq("xylo", [[0, 1], [0, 1], [7, 1], [7, 1], [9, 1], [9, 1], [7, 2]], 0.16, 0.35)],
          ].map(([e, n, txt, f]) => {
            const em = s.photo(PIC[n], { w: 130, h: 96, pos: "50% 50%" });
            const go = () => { if (cur) cur.stop(); cur = null; if (REC[n]) cur = s.sound(REC[n], { force: true }); else f(); };
            const b = s.h("div", { class: "card later", style: { display: "grid", gridTemplateColumns: "130px 1fr", gap: "4px 14px", alignItems: "center", textAlign: "left", cursor: "pointer", padding: "10px 14px" },
              onclick: () => { s.sfx.unlock(); go(); bump(em); b.style.borderColor = "var(--unit)"; } },
              em, s.h("div", null, s.h("p", { class: "h2", style: { fontSize: "26px" } }, n), s.h("p", { class: "small" }, txt)));
            return b;
          });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Groß und schwer → ", s.h("b", null, "tief und langsam"), ". Flink und leicht → ", s.h("b", null, "hoch und schnell"), ".");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "14px" } },
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gridAutoRows: "1fr", gap: "14px", flex: "1" } }, tiles), merk));
          s.step(async () => { s.sfx.pop(); await s.show(tiles.slice(0, 2), "pop"); });
          s.step(async () => { s.sfx.pop(); await s.show(tiles.slice(2, 4), "pop"); });
          s.step(async () => { s.sfx.pop(); await s.show(tiles.slice(4), "pop"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 8 ------------------------------------------------------------------ */
      {
        title: "Tier-Mixer: Höhe und Tempo",
        say: "Schiebe die Regler. Tief und langsam klingt wie ein Elefant. Hoch und schnell klingt wie ein Vogel.",
        build(s) {
          const sy = synth(s);
          let pitch = 2, tempo = 2, playing = false;
          const pick = () => {
            const tab = [["🐘", "Elefant"], ["🐻", "Bär"], ["🐈", "Katze"], ["🐿️", "Eichhörnchen"], ["🐦", "Vogel"]];
            const k = Math.round((pitch + tempo) / 2);
            return tab[Math.max(0, Math.min(4, k))];
          };
          const animal = s.h("div", { style: { fontSize: "130px", lineHeight: "1", height: "210px", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform .2s" } }, "🐈");
          const name = s.h("p", { class: "big", style: { color: "var(--unit)" } }, "Katze");
          const stage = s.h("div", { class: "card soft center", style: { height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "10px" } },
            s.h("p", { class: "small pencil" }, "Klingt wie:"), animal, name);
          const update = () => {
            const [e, n] = pick(); animal.textContent = e; name.textContent = n;
            animal.style.transform = `scale(${1.1 - pitch * 0.1})`;
          };
          const lbl = ["sehr tief", "tief", "mittel", "hoch", "sehr hoch"], tl = ["sehr langsam", "langsam", "mittel", "schnell", "sehr schnell"];
          const sp = s.slider({ label: "Tonhöhe", min: 0, max: 4, value: 2, fmt: v => lbl[v], onInput: v => { pitch = v; update(); } });
          const st = s.slider({ label: "Tempo", min: 0, max: 4, value: 2, fmt: v => tl[v], onInput: v => { tempo = v; update(); } });
          const btn = s.h("button", { class: "btn solid" }, "▶ Spielen");
          let k = 0;
          const run = async () => {
            while (playing && s.alive && !s.fast) {
              const n = [0, 4, 7, 4, 5, 2, 7, 0][k++ % 8] + (pitch - 2) * 12;
              const inst = pitch <= 0 ? "bass" : pitch === 1 ? "bassoon" : pitch === 2 ? "clarinet" : "flute";
              const dur = [0.6, 0.42, 0.28, 0.17, 0.1][tempo];
              sy.play(inst, n, 0, dur * 0.9, 0.24);
              animal.animate([{ translate: "0 0" }, { translate: "0 -18px" }, { translate: "0 0" }], { duration: dur * 1000 });
              await s.wait(dur * 1000);
            }
          };
          btn.onclick = () => { s.sfx.unlock(); playing = !playing; btn.textContent = playing ? "■ Stopp" : "▶ Spielen"; if (playing) run(); };
          const tip = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"),
            s.h("p", { class: "small" }, "Im Zeichentrickfilm tapst der große Bär mit tiefen Tönen. Die kleine Maus huscht mit hohen, schnellen Tönen davon."));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 1fr", height: "100%" } }, stage,
            s.h("div", { class: "stack", style: { justifyContent: "center", gap: "22px" } }, sp, st, btn, tip)));
          update();
          s.step(async () => { s.sfx.ding(); await s.show(tip, "up"); });
        },
      },
      /* 9 ------------------------------------------------------------------ */
      {
        title: "Die Moldau: ein Fluss wird Musik",
        say: "Die Moldau erzählt den Weg eines Flusses: von zwei kleinen Quellen bis nach Prag. Drücke Weiter und folge dem Fluss.",
        build(s) {
          const sy = synth(s);
          const svg = s.svg(660, 600);
          const add = (t, a) => { const e = s.el(t, a); svg.append(e); return e; };
          add("rect", { x: 0, y: 0, width: 660, height: 600, rx: 20, fill: "#eef7e8" });
          // hills / forest decoration
          [[120, 560, 140], [520, 120, 110], [330, 590, 90]].forEach(([x, y, r]) => add("circle", { cx: x, cy: y, r, fill: "#d9efcc" }));
          const segs = [
            "M50 60 C 90 80, 110 110, 150 130",
            "M40 200 C 80 190, 110 160, 150 130",
            "M150 130 C 220 110, 250 170, 270 210",
            "M270 210 C 290 260, 230 300, 260 340",
            "M260 340 C 290 380, 380 360, 420 330",
            "M420 330 C 460 300, 500 330, 500 380",
            "M500 380 C 500 430, 540 460, 570 480",
            "M570 480 C 600 500, 620 540, 640 580",
          ];
          const widths = [5, 5, 9, 11, 13, 15, 18, 22];
          const paths = segs.map((d, i) => add("path", { d, fill: "none", stroke: "#2b7bd6", "stroke-width": widths[i], "stroke-linecap": "round", class: "later" }));
          const st = (x, y, emo, label, lx, ly, anchor = "start") => {
            const g = s.el("g", { class: "later" });
            g.append(s.el("circle", { cx: x, cy: y, r: 9, fill: "#fff", stroke: "#a21caf", "stroke-width": 4 }),
              s.el("text", { x: lx, y: ly, "text-anchor": anchor, "font-size": 30, text: emo }),
              s.el("text", { x: lx + (anchor === "end" ? -40 : anchor === "middle" ? 0 : 40), y: ly - 2, "text-anchor": anchor, class: "lbl", text: label }));
            svg.append(g); return g;
          };
          const stations = [
            st(50, 60, "💧", "Warme Moldau", 70, 40),
            st(40, 200, "💧", "Kalte Moldau", 30, 245),
            st(150, 130, "〰️", "Zusammen!", 170, 108),
            st(270, 210, "📯", "Waldjagd", 300, 215),
            st(250, 330, "💃", "Bauernhochzeit", 80, 395),
            st(420, 330, "🌙", "Mondschein", 375, 296),
            st(500, 380, "🌊", "Stromschnellen", 300, 425),
            st(570, 480, "🏰", "Prag", 560, 505, "end"),
            st(640, 580, "➡️", "Elbe", 610, 570, "end"),
          ];
          const info = [
            ["Erste Quelle", "Zwei helle Flöten plätschern: die Warme Moldau."],
            ["Zweite Quelle", "Die dunkleren Klarinetten: die Kalte Moldau."],
            ["Der Fluss", "Beide Quellen fließen zusammen – das Moldau-Thema erklingt."],
            ["Waldjagd", "Hörner und Trompeten schmettern Jagdsignale."],
            ["Bauernhochzeit", "Am Ufer wird gefeiert: eine fröhliche Polka."],
            ["Mondschein", "Nachts tanzen Nymphen. Leise Streicher, Harfe, Flöten."],
            ["Stromschnellen", "Das Wasser tobt: laute Blechbläser, Becken, wirbelnde Streicher."],
            ["Prag", "Breit und stolz fließt die Moldau an der Burg Vyšehrad vorbei."],
            ["Ende", "Die Moldau fließt weiter – in die Elbe."],
          ];
          const ttl = s.h("p", { class: "h2", style: { color: "var(--unit)" } }, "Folge dem Fluss!");
          const big = s.h("div", { style: { fontSize: "90px", lineHeight: "1.1", textAlign: "center" } }, "🏞️");
          const txt = s.h("p", { class: "t" }, "Drücke „Weiter“: Die Musik wächst wie der Fluss – von zwei kleinen Quellen bis zum breiten Strom.");
          const pics = { quelle: s.photo("moldau-quelle", { w: "100%", h: 220, caption: "Die Warme Moldau bei Kvilda", style: { display: "none" } }),
            vys: s.photo("vysehrad", { w: "100%", h: 220, caption: "Vyšehrad in Prag", style: { display: "none" } }),
            prag: s.photo("moldau-prag", { w: "100%", h: 220, caption: "Die Moldau in Prag", style: { display: "none" } }) };
          const showPic = k => { Object.entries(pics).forEach(([j, f]) => { f.style.display = j === k ? "" : "none"; }); big.style.display = k ? "none" : ""; };
          const side = s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", gap: "16px", height: "100%", justifyContent: "center" } }, big, ...Object.values(pics), ttl, txt);
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "660px 1fr", height: "100%", gap: "24px", alignItems: "stretch" } }, svg, side));
          let cur = null;
          const sounds = [
            () => { cur = s.sound("moldau-quellen", { dur: 8 }); },
            () => { for (let i = 0; i < 12; i++) sy.play("clarinet", [16, 19, 14, 17][i % 4], i * 0.1, 0.1, 0.12); },
            () => { cur = s.sound("moldau-teil1", { dur: 10 }); },
            () => { sy.seq("horn", [[0, 1], [7, 1], [12, 2], [7, 1], [12, 3]], 0.15, 0.2); sy.seq("brass", [[12, 1], [19, 1], [24, 3]], 0.15, 0.1, 0.3); },
            () => { for (let i = 0; i < 8; i++) { sy.play("pluck", i % 2 ? -5 : -12, i * 0.22, 0.15, 0.25); sy.play("strings", [12, 14, 16, 14, 12, 11, 12, 7][i], i * 0.22, 0.18, 0.12); } },
            () => { sy.seq("strings", [[7, 4], [9, 4]], 0.3, 0.06); for (let i = 0; i < 8; i++) sy.play("celesta", [7, 11, 14, 19][i % 4], i * 0.15, 0.4, 0.08); },
            () => { for (let i = 0; i < 20; i++) sy.play("strings", (i % 4) * 2 - 8, i * 0.06, 0.06, 0.12); sy.seq("brass", [[-5, 2], [-4, 2], [0, 4]], 0.15, 0.2, 0.2); s.sfx.noise(1.2, 0.2, 5000, 3000, 0.2, 0.8); },
            () => { sy.seq("brass", [[0, 2], [4, 1], [7, 1], [12, 4]], 0.25, 0.16); sy.timp(-24, 0, 0.4); sy.timp(-24, 1.0, 0.4); },
            () => sy.seq("strings", [[11, 1], [9, 1], [7, 1], [6, 1], [4, 4]], 0.3, 0.14),
          ];
          stations.forEach((g, i) => s.step(async () => {
            ttl.textContent = info[i][0]; txt.textContent = info[i][1]; big.textContent = ["💧", "💧", "〰️", "📯", "💃", "🌙", "🌊", "🏰", "➡️"][i]; bump(big);
            s.sfx.unlock(); if (cur) { cur.stop(); cur = null; } sounds[i]();
            showPic(i < 3 ? "quelle" : i === 7 ? "vys" : i === 8 ? "prag" : null);
            if (i < paths.length) s.show(paths[i], "draw");
            await s.show(g, "pop");
          }));
        },
      },
      /* 10 ----------------------------------------------------------------- */
      {
        title: "Das Moldau-Thema",
        say: "Bedřich Smetana schrieb die Moldau 1874. Da war er schon taub. Die Melodie steigt Schritt für Schritt – wie eine Welle.",
        build(s) {
          const sy = synth(s);
          const notes = [4, 6, 7, 9, 11, 11];
          const names = ["e", "fis", "g", "a", "h", "h"];
          const svg = s.svg(560, 330);
          const wave = s.el("path", { d: "", fill: "none", stroke: "#2b7bd6", "stroke-width": 6, "stroke-linecap": "round", opacity: 0.5 });
          svg.append(wave);
          let ph = 0;
          s.loop(t => { let d = ""; for (let x = 0; x <= 560; x += 10) d += (x ? " L" : "M") + x + " " + (300 + Math.sin(x / 40 + t * 2) * 10); wave.setAttribute("d", d); });
          const dots = notes.map((n, i) => {
            const x = 60 + i * 88, y = 250 - (n - 4) * 24;
            const g = s.el("g", { class: "later" });
            g.append(s.el("circle", { cx: x, cy: y, r: 22, fill: "#a21caf" }), s.el("text", { x, y: y + 54, "text-anchor": "middle", class: "lbl", text: names[i] }));
            svg.append(g); return { g, x, y };
          });
          const line = s.el("polyline", { points: dots.map(d => d.x + "," + d.y).join(" "), fill: "none", stroke: "#a21caf", "stroke-width": 4, "stroke-dasharray": "8 8", class: "later" });
          svg.insertBefore(line, svg.children[1]);
          const play = async () => {
            s.sfx.unlock();
            for (let i = 0; i < notes.length; i++) { if (!s.alive) return; sy.play("strings", notes[i], 0, i === 5 ? 0.9 : 0.42, 0.22); s.show(dots[i].g, "pop"); await s.wait(i === 4 ? 600 : 450); }
          };
          const facts = [
            ["Komponist", "Bedřich Smetana (1824–1884), Böhmen (heute Tschechien)"],
            ["Werk", "„Die Moldau“ ist Teil 2 von „Mein Vaterland“ (Má vlast), 6 Teile"],
            ["1874", "Beim Komponieren war Smetana schon völlig taub – er hörte die Musik nur im Kopf."],
          ].map(([k, v], i) => i ? s.h("div", { class: "card later", style: { padding: "12px 18px" } }, s.h("span", { class: "exlabel" }, k), s.h("p", { class: "small" }, v))
            : s.h("div", { class: "card later", style: { padding: "10px 18px", display: "grid", gridTemplateColumns: "110px 1fr", gap: "14px", alignItems: "center" } },
              s.photo("smetana", { w: 110, h: 140, pos: "50% 30%" }), s.h("div", { class: "stack", style: { gap: "8px" } }, s.h("span", { class: "exlabel" }, k), s.h("p", { class: "small" }, v),
                s.h("div", { class: "row" }, s.soundBtn("moldau-teil1", "Echte Aufnahme")))));
          const left = s.h("div", { class: "stack", style: { gap: "12px", alignItems: "stretch" } },
            s.h("div", { class: "card soft", style: { padding: "12px" } }, svg),
            s.h("div", { class: "row" }, s.h("button", { class: "btn solid", onclick: play }, "▶ Die ersten 6 Töne"),
              s.h("p", { class: "small pencil", style: { flex: "1" } }, "Schritt für Schritt nach oben – wie eine Welle.")));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "590px 1fr", height: "100%", alignItems: "center" } }, left,
            s.h("div", { class: "stack", style: { gap: "14px" } }, ...facts)));
          s.step(async () => { s.show(line, "draw"); await play(); });
          s.step(async () => { s.sound("moldau-teil1", { dur: 8 }); await s.show(facts, "left"); });
        },
      },
      /* 11 ----------------------------------------------------------------- */
      {
        title: "In der Halle des Bergkönigs",
        say: "Edvard Grieg aus Norwegen: In der Halle des Bergkönigs. Die Musik wird immer schneller und immer lauter. Drück auf Start!",
        build(s) {
          const sy = synth(s);
          const theme = [-3, -1, 0, 2, 4, 0, 4];
          const svg = s.svg(520, 270);
          svg.append(s.el("rect", { x: 0, y: 0, width: 520, height: 270, rx: 18, fill: "#2a2238" }));
          svg.append(s.el("path", { d: "M0 270 L80 120 L150 200 L240 70 L330 190 L410 100 L520 230 L520 270 Z", fill: "#3f3552" }));
          const trolls = [70, 170, 260, 350, 450].map((x, i) => {
            const t = s.el("text", { x, y: 245, "text-anchor": "middle", "font-size": 48, text: i === 2 ? "👑" : "👹" });
            svg.append(t); return t;
          });
          const peer = s.el("text", { x: 30, y: 60, "font-size": 36, text: "🧍" });
          svg.append(peer);
          const tBar = s.h("i", { style: { display: "block", height: "100%", width: "10%", background: "var(--orange)", borderRadius: "8px" } });
          const vBar = s.h("i", { style: { display: "block", height: "100%", width: "10%", background: "var(--red)", borderRadius: "8px" } });
          const meter = (l, bar) => s.h("div", null, s.h("p", { class: "small", style: { fontWeight: "700" } }, l),
            s.h("div", { style: { height: "26px", background: "var(--unit-soft)", borderRadius: "8px", border: "2px solid var(--line)" } }, bar));
          const tVal = s.h("span", { class: "mono" }, "langsam"), vVal = s.h("span", { class: "mono" }, "pp – sehr leise");
          let running = false;
          const btn = s.h("button", { class: "btn solid" }, "▶ Start");
          const run = async () => {
            let beat = 0.42, vol = 0.05, round = 0;
            while (running && s.alive && !s.fast && round < 10) {
              const inst = round < 3 ? "pluck" : round < 6 ? "bassoon" : "strings";
              const shift = round >= 4 ? 12 : 0;
              for (let i = 0; i < theme.length && running && s.alive; i++) {
                sy.play(inst, theme[i] - 12 + shift, 0, beat * 0.85, vol);
                if (round >= 6) sy.play("brass", theme[i] - 24, 0, beat * 0.8, vol * 0.7);
                if (round >= 7 && i % 2 === 0) sy.timp(-28, 0, vol * 1.4);
                trolls.forEach((t, k) => t.animate([{ translate: "0 0" }, { translate: `0 ${-(6 + round * 3)}px` }, { translate: "0 0" }], { duration: beat * 900, delay: k * 20 }));
                await s.wait(beat * 1000);
              }
              round++; beat = Math.max(0.09, beat * 0.8); vol = Math.min(0.42, vol * 1.38);
              const p = Math.min(100, round * 10);
              tBar.style.width = p + "%"; vBar.style.width = p + "%";
              tVal.textContent = round < 4 ? "langsam" : round < 7 ? "schneller" : "rasend schnell!";
              vVal.textContent = round < 3 ? "pp – sehr leise" : round < 6 ? "mf – mittel" : "ff – sehr laut!";
              peer.setAttribute("x", 30 + round * 46);
            }
            if (s.alive && running) { [-12, -5, 0].forEach(n => sy.play("brass", n, 0, 1.2, 0.3)); sy.timp(-28, 0, 0.6); }
            running = false; btn.textContent = "▶ Nochmal";
          };
          btn.onclick = () => {
            s.sfx.unlock(); running = !running;
            if (running) { tBar.style.width = "10%"; vBar.style.width = "10%"; peer.setAttribute("x", 30); tVal.textContent = "langsam"; vVal.textContent = "pp – sehr leise"; btn.textContent = "■ Stopp"; run(); }
            else btn.textContent = "▶ Start";
          };
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } },
            s.h("b", null, "accelerando"), " = immer schneller.  ", s.h("b", null, "crescendo"), " = immer lauter.");
          const facts = s.h("div", { class: "card later", style: { padding: "10px 18px", display: "grid", gridTemplateColumns: "100px 1fr", gap: "14px", alignItems: "center" } },
            s.photo("grieg", { w: 100, h: 130, pos: "50% 25%" }),
            s.h("div", null, s.h("span", { class: "exlabel" }, "Das Stück"),
              s.h("p", { class: "small" }, "Edvard Grieg (1843–1907), Norwegen. Musik zum Theaterstück „Peer Gynt“ von Henrik Ibsen, uraufgeführt 1876 in Christiania (heute Oslo). Peer schleicht in die Halle der Trolle …")));
          const realRow = s.h("div", { class: "row later", style: { gap: "10px" } }, s.h("span", { class: "small", style: { fontWeight: "700" } }, "Echt:"), s.soundBtn("bergkoenig-anfang", "Anfang – leise"), s.soundBtn("bergkoenig-schluss", "Schluss – laut"));
          const life = s.h("div", { class: "life later", style: { padding: "12px 18px" } }, s.h("span", { class: "exlabel" }, "Im Alltag"),
            s.h("p", { class: "small" }, "Im Film „M“ (1931) pfeift der Täter diese Melodie. Ein englischer Freizeitpark nutzt sie seit 1992 als Erkennungsmusik."));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "520px 1fr", height: "100%", alignItems: "center", gap: "26px" } },
            s.h("div", { class: "stack", style: { gap: "14px" } }, svg,
              s.h("div", { class: "row", style: { flexWrap: "nowrap", alignItems: "stretch" } }, btn,
                s.h("div", { class: "stack", style: { flex: "1", gap: "6px" } },
                  s.h("div", { class: "row", style: { justifyContent: "space-between", flexWrap: "nowrap" } }, s.h("span", { class: "small" }, "Tempo:"), tVal), s.h("div", { style: { height: "14px", background: "var(--unit-soft)", borderRadius: "7px" } }, tBar))),
              s.h("div", { class: "row", style: { flexWrap: "nowrap" } }, s.h("div", { style: { flex: "1" } },
                s.h("div", { class: "row", style: { justifyContent: "space-between", flexWrap: "nowrap" } }, s.h("span", { class: "small" }, "Lautstärke:"), vVal), s.h("div", { style: { height: "14px", background: "var(--unit-soft)", borderRadius: "7px" } }, vBar)))),
            s.h("div", { class: "stack", style: { gap: "14px" } }, facts, realRow, merk, life)));
          s.step(async () => { s.sfx.pop(); await s.show(facts, "left"); });
          s.step(async () => { s.show(realRow, "up"); s.sound("bergkoenig-anfang", { dur: 5 }); await s.show(merk, "up"); });
          s.step(async () => { s.sound("bergkoenig-schluss", { dur: 5 }); await s.show(life, "up"); });
        },
      },
      /* 12 ----------------------------------------------------------------- */
      {
        title: "Das Leitmotiv",
        say: "Ein Leitmotiv ist eine kurze Melodie, die immer erklingt, wenn eine bestimmte Figur auftaucht. So weißt du sofort: Achtung, der Bösewicht kommt!",
        build(s) {
          const sy = synth(s);
          const mot = [
            ["🦸", "Held", "hell, Dur, springt nach oben", () => sy.seq("brass", [[-5, 1], [0, 1], [4, 1], [7, 3]], 0.2, 0.2)],
            ["🦹", "Bösewicht", "tief, Moll, schwer", () => { sy.seq("horn", [[-12, 2], [-12, 1], [-15, 1], [-11, 4]], 0.28, 0.24); sy.timp(-30, 0, 0.4); }],
            ["🦈", "Gefahr", "zwei tiefe Töne, immer schneller", () => { let t = 0, d = 0.5; for (let i = 0; i < 14; i++) { sy.play("bass", i % 2 ? -23 : -24, t, d * 0.8, 0.2 + i * 0.015); t += d; d = Math.max(0.12, d * 0.85); } }],
            ["🧚", "Zauber", "glitzernd, hoch", () => { for (let i = 0; i < 8; i++) sy.play("celesta", [12, 16, 19, 23, 24, 28, 31, 36][i], i * 0.09, 0.5, 0.12); }],
          ].map(([e, n, d, f]) => {
            const em = s.h("div", { style: { fontSize: "54px", lineHeight: "1" } }, e);
            return s.h("button", { class: "card later", style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", font: "inherit", color: "inherit", cursor: "pointer", padding: "14px 10px" },
              onclick: () => { s.sfx.unlock(); f(); bump(em); } }, em, s.h("span", { class: "h2", style: { fontSize: "26px" } }, n), s.h("span", { class: "small pencil", style: { textAlign: "center" } }, d));
          });
          const merk = s.h("div", { class: "merk later" }, s.h("b", null, "Leitmotiv"), " = eine kurze Melodie, die zu einer ", s.h("b", null, "Figur"), ", einem Ort oder einer Idee gehört. Sie kommt immer wieder.");
          const ex = [
            ["Oper", "Richard Wagner benutzte in „Der Ring des Nibelungen“ Hunderte Leitmotive."],
            ["Märchen", "„Peter und der Wolf“: Jede Figur hat ihr Motiv – das hast du schon gehört!"],
            ["Kino", "„Star Wars“ (1977): Komponist John Williams gab vielen Figuren ein eigenes Thema."],
          ].map(([k, v]) => s.h("div", { class: "ex later", style: { padding: "12px 16px" } }, s.h("span", { class: "exlabel" }, k), s.h("p", { class: "small" }, v)));
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "16px", justifyContent: "center" } },
            s.h("div", { class: "cols4" }, mot), merk, s.h("div", { class: "cols3", style: { gap: "14px" } }, ex)));
          s.step(async () => { s.sfx.pop(); await s.show(mot, "pop"); s.say("Tippe auf die Figuren und hör ihre Motive."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(ex, "up"); });
        },
      },
      /* 13 ----------------------------------------------------------------- */
      {
        title: "Filmmusik macht Gefühle",
        say: "Das Bild bleibt gleich. Nur die Musik ändert sich. Tippe auf die Knöpfe und spüre, wie die Szene sich anders anfühlt.",
        build(s) {
          const sy = synth(s);
          const svg = s.svg(560, 400);
          const sky = s.el("rect", { x: 0, y: 0, width: 560, height: 400, rx: 18, fill: "#9cc9f0" });
          svg.append(sky);
          svg.append(s.el("rect", { x: 0, y: 300, width: 560, height: 100, fill: "#6aa84f" }));
          [[90, 300], [180, 300], [420, 300], [500, 300]].forEach(([x, y]) => svg.append(s.el("path", { d: `M${x - 34} ${y} L${x} ${y - 140} L${x + 34} ${y} Z`, fill: "#2f6b3a" })));
          svg.append(s.el("path", { d: "M250 300 L270 230 L330 230 L350 300 Z", fill: "#8b5a2b" }));
          const kid = s.el("text", { x: 280, y: 330, "text-anchor": "middle", "font-size": 54, text: "🚶" });
          svg.append(kid);
          const shade = s.el("rect", { x: 0, y: 0, width: 560, height: 400, rx: 18, fill: "#000", opacity: 0 });
          svg.append(shade);
          const cap = s.h("p", { class: "big", style: { color: "var(--unit)" } }, "Welche Musik?");
          const desc = s.h("p", { class: "t" }, "Tippe auf eine Stimmung.");
          let walk = 0;
          s.loop((t, dt) => { walk += dt; kid.setAttribute("x", 140 + ((walk * 40) % 280)); });
          const moods = [
            ["Gefahr", "#3b0a0a", 0.55, "Tiefe Töne, Moll, unheimliches Zittern. Gleich passiert etwas!", () => { for (let i = 0; i < 16; i++) sy.play("strings", i % 2 ? -23 : -24, i * 0.09, 0.09, 0.14); [-12, -6].forEach(n => sy.play("horn", n, 0.6, 1.4, 0.18)); }],
            ["Freude", "#ffe066", 0.15, "Dur, hoch, hüpfend und schnell. Ein schöner Tag!", () => sy.seq("flute", [[12, 1], [16, 1], [19, 1], [24, 2], [19, 1], [24, 3]], 0.14, 0.2)],
            ["Traurig", "#1e3a5f", 0.4, "Langsam, leise, Moll. Etwas ist verloren gegangen.", () => sy.seq("cello", [[3, 3], [2, 1], [0, 2], [-2, 2], [-5, 4]], 0.32, 0.2)],
            ["Spannung", "#4c1d95", 0.35, "Ein Ton steigt und steigt, immer lauter …", () => { sy.play("strings", -12, 0, 2.4, 0.18, 0); s.sfx.tone(130, 2.4, "sawtooth", 0.06, 0, 520); }],
          ];
          const btns = moods.map(([n, col, op, d, f]) => s.h("button", { class: "btn", onclick: () => { s.sfx.unlock(); f(); shade.setAttribute("fill", col); shade.style.transition = "opacity .6s"; shade.setAttribute("opacity", op); cap.textContent = n; desc.textContent = d; } }, n));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Das Bild bleibt gleich – die ", s.h("b", null, "Musik"), " entscheidet, was du fühlst.");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "560px 1fr", height: "100%", alignItems: "center" } }, svg,
            s.h("div", { class: "stack", style: { gap: "16px" } }, cap, s.h("div", { style: { minHeight: "100px" } }, desc),
              s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } }, btns), merk)));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 14 ----------------------------------------------------------------- */
      {
        title: "Mickey-Mousing",
        say: "Beim Mickey-Mousing passt jeder Ton genau zu einer Bewegung im Zeichentrickfilm. Jede Treppenstufe ein Ton!",
        build(s) {
          const sy = synth(s);
          const svg = s.svg(560, 420);
          svg.append(s.el("rect", { x: 0, y: 0, width: 560, height: 420, rx: 18, fill: "#fff7e0" }));
          const stairs = [];
          for (let i = 0; i < 7; i++) stairs.push([40 + i * 62, 90 + i * 40]);
          stairs.forEach(([x, y]) => svg.append(s.el("rect", { x, y, width: 62, height: 420 - y, fill: "#e8c58a", stroke: "#b88a4a", "stroke-width": 2 })));
          const ball = s.el("text", { x: 70, y: 86, "text-anchor": "middle", "font-size": 44, text: "🐭" });
          svg.append(ball);
          const star = s.el("text", { x: 500, y: 360, "text-anchor": "middle", "font-size": 40, text: "💥", opacity: 0 });
          svg.append(star);
          let busy = false;
          const run = async () => {
            if (busy) return; busy = true; s.sfx.unlock(); star.setAttribute("opacity", 0);
            const scale = [19, 17, 16, 14, 12, 11, 9];
            for (let i = 0; i < stairs.length; i++) {
              if (!s.alive) return;
              const [x, y] = stairs[i];
              sy.play("xylo", scale[i], 0, 0.15, 0.3);
              await s.tween({ from: 0, to: 1, dur: 260, ease: "linear", update: v => { ball.setAttribute("x", x + 30 + v * 62 * (i < 6 ? 1 : 0.5)); ball.setAttribute("y", y - 4 - Math.sin(v * Math.PI) * 30 + v * 40 * (i < 6 ? 1 : 0)); } });
            }
            s.sfx.tone(700, 0.6, "sine", 0.25, 0, 120);
            await s.tween({ from: 0, to: 1, dur: 500, ease: "in", update: v => ball.setAttribute("y", 326 + v * 60) });
            s.sfx.boing(); s.sfx.noise(0.2, 0.3, 800, 200); star.setAttribute("opacity", 1);
            await s.wait(700); ball.setAttribute("x", 70); ball.setAttribute("y", 86); busy = false;
          };
          const facts = [
            ["Wort", "Benannt nach den frühen Micky-Maus-Filmen von Walt Disney."],
            ["1928", "„Steamboat Willie“: einer der ersten Zeichentrickfilme mit Ton – Musik und Bewegung passen genau zusammen."],
            ["Heute", "„Tom und Jerry“: Jeder Schritt, jeder Sturz, jedes „Bong!“ hat seinen Ton."],
          ].map(([k, v]) => s.h("div", { class: "ex later", style: { padding: "12px 16px" } }, s.h("span", { class: "exlabel" }, k), s.h("p", { class: "small" }, v)));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "560px 1fr", height: "100%", alignItems: "center" } },
            s.h("div", { class: "stack", style: { gap: "14px" } }, svg, s.h("button", { class: "btn solid", onclick: run }, "▶ Die Maus läuft los")),
            s.h("div", { class: "stack", style: { gap: "14px" } }, ...facts)));
          s.step(async () => { run(); await s.show(facts[0], "left"); });
          s.step(async () => { s.sfx.pop(); await s.show(facts[1], "left"); });
          s.step(async () => { s.sfx.pop(); await s.show(facts[2], "left"); });
        },
      },
      /* 15 ----------------------------------------------------------------- */
      {
        title: "Im Alltag: Musik erzählt mit",
        say: "Musik erzählt überall mit: im Zeichentrick, in Videospielen, in Kino-Trailern und in Hörspielen.",
        build(s) {
          const sy = synth(s);
          const cards = [
            ["📺", "Zeichentrick", "Jede Bewegung hat einen Ton: Hüpfen, Rutschen, Plumps.", () => { s.sfx.boing(); sy.play("xylo", 12, 0.4, 0.1, 0.3); sy.play("flute", 24, 0.6, 0.5, 0.15, 12); }],
            ["🎮", "Videospiele", "Jede Welt hat ihre Musik. Wird die Zeit knapp, wird sie oft schneller.", () => { let t = 0; for (let i = 0; i < 16; i++) { sy.play("clarinet", [0, 4, 7, 12][i % 4] + 12, t, 0.08, 0.12); t += i < 8 ? 0.16 : 0.09; } }],
            ["🎬", "Kino-Trailer", "Die Musik wird lauter und schneller bis zum großen Knall – dann Stille.", () => { s.sound("timpani-roll", { dur: 2.6, force: true }); s.sound("cymbal", { when: 2.6, dur: 2, force: true }); [-24, -12].forEach(n => sy.play("brass", n, 2.6, 1.4, 0.35)); }],
            ["🎧", "Hörspiel", "Kein Bild – nur Stimmen, Geräusche und Musik erzählen die Geschichte.", () => { s.sound("footsteps", { dur: 2, force: true }); s.sound("knock", { when: 2.1, dur: 1.4, force: true }); s.sound("door-creak", { when: 3.6, force: true }); }],
          ].map(([e, n, d, f]) => {
            const PIC = { Videospiele: "gameboy", "Kino-Trailer": "kino", Hörspiel: "kopfhoerer" };
            const em = PIC[n] ? s.photo(PIC[n], { w: 150, h: 100, fit: n === "Videospiele" ? "contain" : "cover" }) : s.h("div", { style: { fontSize: "64px", lineHeight: "1", textAlign: "center" } }, e);
            return s.h("div", { class: "life later", style: { display: "grid", gridTemplateColumns: "150px 1fr", gap: "8px 14px", alignItems: "center" } },
              em, s.h("div", null, s.h("span", { class: "exlabel", style: { color: "var(--green)" } }, "Im Alltag"), s.h("p", { class: "h2", style: { fontSize: "28px" } }, n)),
              s.h("p", { class: "t", style: { gridColumn: "1 / 3", fontSize: "21px" } }, d),
              s.h("button", { class: "btn", style: { gridColumn: "1 / 3" }, onclick: () => { s.sfx.unlock(); f(); bump(em); } }, "▶ So klingt das"));
          });
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "18px", height: "100%" } }, cards));
          cards.forEach(c => s.step(async () => { s.sfx.pop(); await s.show(c, "pop"); }));
        },
      },
      /* 16 ----------------------------------------------------------------- */
      {
        title: "Deine Klanggeschichte",
        say: "Jetzt bist du dran! Tippe auf Geräusche, sie kommen in deine Geschichte. Dann drück auf Abspielen.",
        build(s) {
          const sy = synth(s);
          // real recorded sounds (shared library + owl)
          const R = (id, dur, o = {}) => () => s.sound(id, Object.assign({ dur, force: true }, o));
          const fx = {
            Wind: ["🌬️", 1.8, R("wind", 1.8, { vol: .8 })],
            Regen: ["🌧️", 1.8, R("rain", 1.8)],
            Donner: ["⚡", 2.4, R("thunder", 2.4)],
            Schritte: ["👣", 1.8, R("footsteps", 1.8)],
            Tür: ["🚪", 2.0, R("door-creak", 2.0)],
            Klopfen: ["✊", 1.4, R("knock", 1.4)],
            Eule: ["🦉", 2.0, R("eule", 2.0)],
            Herzschlag: ["❤️", 2.0, R("heartbeat", 2.0)],
          };
          const MAX = 8;
          const story = [];
          const slots = Array.from({ length: MAX }, (_, i) => s.h("div", { class: "card center", style: { height: "120px", padding: "4px", fontSize: "60px", borderStyle: "dashed" } }, s.h("span", { class: "small pencil" }, String(i + 1))));
          const render = () => slots.forEach((sl, i) => {
            sl.innerHTML = ""; sl.style.borderStyle = story[i] ? "solid" : "dashed";
            sl.append(story[i] ? s.h("span", null, fx[story[i]][0]) : s.h("span", { class: "small pencil" }, String(i + 1)));
          });
          const pads = Object.entries(fx).map(([n, [e, , f]]) => s.h("button", { class: "btn", style: { flexDirection: "column", height: "124px", gap: "6px", padding: "0 6px" },
            onclick: () => { s.sfx.unlock(); f(); if (story.length < MAX) { story.push(n); render(); bump(slots[story.length - 1]); } } },
            s.h("span", { style: { fontSize: "50px" } }, e), s.h("span", { style: { fontSize: "19px" } }, n)));
          let playing = false;
          const play = async () => {
            if (playing || !story.length) return; playing = true; s.sfx.unlock();
            for (let i = 0; i < story.length && s.alive; i++) {
              slots[i].style.borderColor = "var(--unit)"; slots[i].style.background = "var(--unit-soft)";
              fx[story[i]][2](); await s.wait(fx[story[i]][1] * 1000);
              slots[i].style.borderColor = ""; slots[i].style.background = "";
            }
            playing = false;
          };
          const example = () => { story.splice(0, story.length, "Wind", "Regen", "Donner", "Schritte", "Klopfen", "Tür", "Herzschlag"); render(); s.sfx.pop(); };
          const clear = () => { story.length = 0; render(); s.sfx.swoosh(); };
          const tip = s.h("div", { class: "life later", style: { padding: "12px 18px" } }, s.h("span", { class: "exlabel" }, "Wie im Hörspiel"),
            s.h("p", { class: "small" }, "Alle Geräusche hier sind echte Aufnahmen. Geräusche-Macher im Studio nennt man „Foley“-Künstler: Sie machen Schritte, Türen und Regen von Hand nach."));
          const ideas = s.h("div", { class: "cols3 later", style: { gap: "14px" } },
            ...[["Gewitternacht", "Wind → Regen → Donner → Schritte → Klopfen → Tür"], ["Gespenster-Haus", "Eule → Schritte → Tür → Herzschlag → Donner"], ["Ein Spaziergang", "Schritte → Wind → Eule → Regen → Schritte → Tür"]]
              .map(([k, v]) => s.h("div", { class: "ex", style: { padding: "10px 14px" } }, s.h("span", { class: "exlabel" }, "Idee: " + k), s.h("p", { class: "small" }, v))));
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "16px" } },
            s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: "10px" } }, pads),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: "10px" } }, slots),
            s.h("div", { class: "row", style: { flexWrap: "nowrap" } },
              s.h("button", { class: "btn solid", onclick: play }, "▶ Abspielen"),
              s.h("button", { class: "btn", onclick: example }, "Beispiel: Gewitternacht"),
              s.h("button", { class: "btn", onclick: clear }, "Löschen")),
            ideas, tip));
          s.step(async () => { s.sfx.pop(); await s.show(ideas, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(tip, "up"); });
        },
      },
    ],
  });
})();
