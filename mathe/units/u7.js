/* Kapitel 7 – Umfang und Flächeninhalt */
(() => {
  const U = "#a21caf", USOFT = "#f7e3f9", TILE = "#e7a6f0", INK = "#1b2740";
  const BLUE = "#1d5bd0", RED = "#dc3b2a", GREEN = "#138a5a", ORANGE = "#ee7a1a", BROWN = "#8a4b12";

  /* make pop/zoom on SVG shapes scale around their own centre */
  const fb = el => { el.style.transformBox = "fill-box"; el.style.transformOrigin = "center"; return el; };
  /* reveal many elements one after another, with an optional callback (sound, counter) per element */
  function cascade(s, els, kind = "pop", gap = 40, onEach) {
    els.forEach((e, i) => s.show(e, kind, i * gap));
    return (async () => {
      for (let i = 0; i < els.length; i++) { if (onEach) onEach(i); await s.wait(gap); }
      await s.wait(450);
    })();
  }
  const tx = (s, x, y, text, o = {}) => s.el("text", Object.assign({ x, y, "text-anchor": "middle", "font-size": 22, "font-weight": 700, fill: INK, text }, o));
  function gridG(s, x0, y0, cols, rows, sz, stroke = "#d9c4de", sw = 1.5) {
    const g = s.el("g", { stroke, "stroke-width": sw });
    for (let i = 0; i <= cols; i++) g.append(s.el("line", { x1: x0 + i * sz, y1: y0, x2: x0 + i * sz, y2: y0 + rows * sz }));
    for (let j = 0; j <= rows; j++) g.append(s.el("line", { x1: x0, y1: y0 + j * sz, x2: x0 + cols * sz, y2: y0 + j * sz }));
    return g;
  }
  const clear = g => { while (g.firstChild) g.removeChild(g.firstChild); };
  const life = (s, label, ...kids) => s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, label), ...kids);
  const uid = p => p + Math.random().toString(36).slice(2, 8);

  /* foldable box net in CSS 3D. A = length, B = width, Cc = height (px). No text on the faces. */
  function makeNet(s, A, B, Cc, colors, W, Hh, tilt = [52, -32], zoom = 1.4) {
    const stage = s.h("div", { style: { position: "relative", width: W + "px", height: Hh + "px", perspective: "1600px", perspectiveOrigin: "50% 45%" } });
    const face = (w, h, extra, bg) => s.h("div", { style: Object.assign({ position: "absolute", width: w + "px", height: h + "px", background: bg, boxShadow: "inset 0 0 0 3px rgba(27,39,64,.45)", transformStyle: "preserve-3d", backfaceVisibility: "visible" }, extra) });
    const base = face(A, B, { left: (W - A) / 2 + "px", top: (Hh - B) / 2 + Cc / 2 + "px", transformOrigin: "50% 50%" }, colors[0]);
    const N = face(A, Cc, { left: "0px", top: -Cc + "px", transformOrigin: "50% 100%" }, colors[1]);
    const S = face(A, Cc, { left: "0px", top: B + "px", transformOrigin: "50% 0%" }, colors[2]);
    const E = face(Cc, B, { left: A + "px", top: "0px", transformOrigin: "0% 50%" }, colors[3]);
    const Wf = face(Cc, B, { left: -Cc + "px", top: "0px", transformOrigin: "100% 50%" }, colors[4]);
    const L = face(A, B, { left: "0px", top: -B + "px", transformOrigin: "50% 100%" }, colors[5]);
    N.append(L); base.append(N, S, E, Wf); stage.append(base);
    let cur = 1;
    const set = t => {
      cur = t; const d = 90 * t;
      N.style.transform = `rotateX(${-d}deg)`; S.style.transform = `rotateX(${d}deg)`;
      E.style.transform = `rotateY(${-d}deg)`; Wf.style.transform = `rotateY(${d}deg)`;
      L.style.transform = `rotateX(${-d}deg)`;
      const z = 1 + (zoom - 1) * t;
      base.style.transform = `translateY(${-Cc * 0.6 * t}px) scale3d(${z},${z},${z}) rotateX(${tilt[0] * t}deg) rotateZ(${tilt[1] * t}deg)`;
    };
    set(1);
    return { stage, set, get t() { return cur; } };
  }

  Deck.unit({
    id: "u7", num: 7, title: "Umfang und Flächeninhalt", color: U, soft: USOFT,
    subtitle: "Zaun rundherum – Rasen innen drin",
    blurb: "Rand messen, Flächen zählen, Kisten aufklappen.",
    goals: [
      "Umfang und Flächeninhalt unterscheiden",
      "Flächen auszählen, zerlegen und ergänzen",
      "Rechteck und Quadrat berechnen",
      "Flächeneinheiten mit der Zahl 100 umrechnen",
      "Die Oberfläche von Würfel und Quader finden",
    ],
    icon(svg, el) {
      svg.append(el("rect", { x: 12, y: 16, width: 46, height: 38, fill: USOFT }));
      for (let i = 1; i < 4; i++) svg.append(el("line", { x1: 12 + i * 11.5, y1: 16, x2: 12 + i * 11.5, y2: 54, stroke: TILE, "stroke-width": 2 }));
      for (let j = 1; j < 3; j++) svg.append(el("line", { x1: 12, y1: 16 + j * 12.7, x2: 58, y2: 16 + j * 12.7, stroke: TILE, "stroke-width": 2 }));
      svg.append(el("rect", { x: 12, y: 16, width: 46, height: 38, fill: "none", stroke: U, "stroke-width": 5, "stroke-linejoin": "round" }));
    },
    slides: [
      /* 1 ------------------------------------------------------------------ */
      {
        title: "Zaun oder Rasen?",
        say: "Ein Garten ist 8 Meter lang und 5 Meter breit. Wie viel Zaun brauchen wir – und wie viel Rasen?",
        build(s) {
          const S = 52, X = 30, Y = 24, a = 8, b = 5;
          const svg = s.svg(520, 340);
          svg.append(s.el("rect", { x: X, y: Y, width: a * S, height: b * S, fill: "#efe3c8", rx: 3 }));
          const tiles = [];
          for (let r = 0; r < b; r++) for (let c = 0; c < a; c++)
            tiles.push(fb(s.el("rect", { x: X + c * S + 3, y: Y + r * S + 3, width: S - 6, height: S - 6, rx: 5, fill: (r + c) % 2 ? "#5cb85c" : "#4caf50", class: "later" })));
          svg.append(...tiles, gridG(s, X, Y, a, b, S, "#d8c9a6", 1.5));
          const fence = s.el("path", { d: `M${X} ${Y}h${a * S}v${b * S}h${-a * S}Z`, fill: "none", stroke: BROWN, "stroke-width": 7, "stroke-linejoin": "round", class: "later" });
          const posts = [];
          for (let i = 0; i <= a; i++) posts.push(fb(s.el("rect", { x: X + i * S - 4, y: Y - 9, width: 8, height: 18, rx: 2, fill: BROWN, class: "later" })), fb(s.el("rect", { x: X + i * S - 4, y: Y + b * S - 9, width: 8, height: 18, rx: 2, fill: BROWN, class: "later" })));
          for (let j = 1; j < b; j++) posts.push(fb(s.el("rect", { x: X - 9, y: Y + j * S - 4, width: 18, height: 8, rx: 2, fill: BROWN, class: "later" })), fb(s.el("rect", { x: X + a * S - 9, y: Y + j * S - 4, width: 18, height: 8, rx: 2, fill: BROWN, class: "later" })));
          svg.append(fence, ...posts,
            tx(s, X + a * S / 2, Y + b * S + 38, "8 m"),
            tx(s, X + a * S + 16, Y + b * S / 2 + 8, "5 m", { "text-anchor": "start" }));
          const cu = s.h("div", { class: "card later" },
            s.h("p", { class: "h2", style: { color: BROWN } }, "Umfang = der Zaun"),
            s.h("p", { class: "t" }, "einmal rundherum gemessen:"),
            s.h("p", { class: "t mono" }, "8 m + 5 m + 8 m + 5 m = ", s.h("b", null, "26 m")));
          const ca = s.h("div", { class: "card later" },
            s.h("p", { class: "h2 green" }, "Flächeninhalt = der Rasen"),
            s.h("p", { class: "t" }, "innen drin: 40 Quadrate mit 1 m × 1 m"),
            s.h("p", { class: "t mono" }, "A = ", s.h("b", null, "40 m²"), " (Quadratmeter)"));
          const merk = s.h("div", { class: "merk later" }, "Der ", s.h("b", null, "Umfang"), " misst den Rand (m, cm). Der ", s.h("b", null, "Flächeninhalt"), " misst den Platz innen (m², cm²).");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "520px 1fr", alignItems: "center", height: "100%" } },
            s.h("div", { class: "stack" }, s.h("p", { class: "t a-up" }, "Ein Garten: ", s.h("b", null, "8 m"), " lang, ", s.h("b", null, "5 m"), " breit."), svg),
            s.h("div", { class: "stack" }, cu, ca, merk)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          s.step(async () => {
            s.say("Der Zaun läuft einmal rundherum: 26 Meter.");
            s.sound("hammer", { vol: .6 }); await s.show(fence, "draw");
            cascade(s, posts, "pop", 25);
            s.sfx.pop(); await s.show(cu, "up");
          });
          s.step(async () => {
            s.say("Der Rasen füllt die Fläche innen: 40 Quadratmeter.");
            s.sound("birds", { vol: .4, dur: 4 }); await cascade(s, tiles, "pop", 45);
            s.sfx.ding(); await s.show(ca, "up");
          });
          s.step(async () => { s.sfx.success(); await s.show(merk, "up"); });
        },
      },

      /* 2 ------------------------------------------------------------------ */
      {
        title: "Umfang: einmal rundherum",
        say: "Eine Ameise läuft einmal um das Rechteck herum. Ihr Weg ist der Umfang.",
        build(s) {
          const S = 60, X = 90, Y = 56, W = 6 * S, H = 4 * S, P = 2 * (W + H);
          const svg = s.svg(540, 350);
          svg.append(s.el("rect", { x: X, y: Y, width: W, height: H, fill: USOFT }), gridG(s, X, Y, 6, 4, S, "#e8c9ee", 1.5),
            s.el("rect", { x: X, y: Y, width: W, height: H, fill: "none", stroke: "#cfa6d6", "stroke-width": 4 }));
          const trail = s.el("path", { d: `M${X} ${Y}h${W}v${H}h${-W}Z`, fill: "none", stroke: U, "stroke-width": 9, "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-dasharray": P, "stroke-dashoffset": P });
          svg.append(trail,
            tx(s, X + W / 2, Y - 22, "6 cm"), tx(s, X + W / 2, Y + H + 40, "6 cm"),
            tx(s, X - 18, Y + H / 2 + 8, "4 cm", { "text-anchor": "end" }), tx(s, X + W + 18, Y + H / 2 + 8, "4 cm", { "text-anchor": "start" }));
          const antPos = s.el("g"), ant = s.el("g", { fill: "#3b2a20", stroke: "#3b2a20", "stroke-linecap": "round" });
          [-6, 0, 6].forEach(dx => ant.append(
            s.el("line", { x1: dx, y1: 0, x2: dx - 5, y2: -13, "stroke-width": 2.5 }),
            s.el("line", { x1: dx, y1: 0, x2: dx - 5, y2: 13, "stroke-width": 2.5 })));
          ant.append(s.el("ellipse", { cx: -14, cy: 0, rx: 10, ry: 7.5 }), s.el("ellipse", { cx: 0, cy: 0, rx: 6, ry: 5 }), s.el("circle", { cx: 11, cy: 0, r: 6 }),
            s.el("path", { d: "M14 -3q6 -8 12 -6M14 3q6 8 12 6", fill: "none", "stroke-width": 2 }));
          antPos.append(ant); svg.append(antPos);
          const read = s.h("span", { class: "big mono", style: { color: U } }, "0,0 cm");
          let cancel = null;
          const place = p => {
            const d = p * P; let x, y, ang;
            if (d <= W) { x = X + d; y = Y; ang = 0; }
            else if (d <= W + H) { x = X + W; y = Y + d - W; ang = 90; }
            else if (d <= 2 * W + H) { x = X + W - (d - W - H); y = Y + H; ang = 180; }
            else { x = X; y = Y + H - (d - 2 * W - H); ang = 270; }
            antPos.setAttribute("transform", `translate(${x},${y}) rotate(${ang})`);
            trail.setAttribute("stroke-dashoffset", P * (1 - p));
            read.textContent = s.fmt(p * 20, 1) + " cm";
          };
          place(0);
          const walk = () => {
            if (cancel) cancel();
            if (s.fast) { place(1); return Promise.resolve(); }
            return new Promise(res => {
              let last = 0;
              cancel = s.loop(t => {
                const p = Math.min(1, t / 7); place(p);
                const cm = Math.floor(p * 20 + 1e-6);
                if (cm > last) { last = cm; [6, 10, 16].includes(cm) ? s.sfx.pop() : s.sfx.tick(); }
                if (p >= 1) { s.sfx.success(); res(); return false; }
              });
            });
          };
          const again = s.h("button", { class: "btn later", onclick: () => { s.sfx.click(); walk(); } }, "Nochmal laufen");
          const fcard = s.h("div", { class: "card later" },
            s.h("p", { class: "h2" }, "Umfang u"),
            s.h("p", { class: "t mono" }, "u = 6 + 4 + 6 + 4 = ", s.h("b", null, "20 cm")),
            s.h("p", { class: "small" }, "Der Umfang ist die Länge des ganzen Randes. Einheiten: mm, cm, m, km."));
          const lifes = [
            life(s, "Im Alltag", s.h("p", { class: "small" }, "🏡 Schrebergarten 20 m × 15 m: Der Zaun ist 20 + 15 + 20 + 15 = 70 m lang.")),
            life(s, "Im Alltag", s.h("p", { class: "small" }, "⚽ Einmal um ein Fußballfeld (105 m × 68 m) laufen: 346 m.")),
            life(s, "Im Alltag", s.h("p", { class: "small" }, "🖼️ Bilderrahmen 30 cm × 20 cm: Du brauchst 100 cm Leiste.")),
          ];
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "540px 1fr", alignItems: "center", height: "100%" } },
            s.h("div", { class: "stack", style: { alignItems: "center" } }, svg,
              s.h("div", { class: "row" }, s.h("span", { class: "t" }, "Weg der Ameise:"), read, again)),
            s.h("div", { class: "stack" }, fcard, ...lifes)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          s.step(async () => { s.say("Los geht's! Zähl mit: Wie weit läuft die Ameise?"); await walk(); s.show(again, "pop"); });
          s.step(async () => { s.sfx.ding(); await s.show(fcard, "up"); s.say("Sechs plus vier plus sechs plus vier sind zwanzig Zentimeter."); });
          s.step(async () => { await cascade(s, lifes, "left", 250, i => s.sfx.count(i * 2)); });
        },
      },

      /* 3 ------------------------------------------------------------------ */
      {
        title: "Flächen auszählen",
        say: "Ein Teich hat keine geraden Kanten. Wir zählen die Kästchen auf dem Karopapier.",
        build(s) {
          const S = 38, X = 12, Y = 12, cols = 14, rows = 9;
          const svg = s.svg(cols * S + 24, rows * S + 24);
          const E = [[4.8, 4.6, 3.9, 3.3], [9.6, 4.2, 3.4, 2.8]];
          const ins = (x, y) => E.some(([cx, cy, rx, ry]) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1);
          const ell = (o) => E.map(([cx, cy, rx, ry]) => s.el("ellipse", Object.assign({ cx: X + cx * S, cy: Y + cy * S, rx: rx * S, ry: ry * S }, o)));
          svg.append(...ell({ fill: "#8ec5f2", stroke: BLUE, "stroke-width": 4 }), ...ell({ fill: "#8ec5f2" }));
          const full = [], part = []; let exact = 0;
          for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
            let k = 0; const n = 10;
            for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (ins(c + (i + .5) / n, r + (j + .5) / n)) k++;
            exact += k / (n * n);
            if (k === n * n) full.push(fb(s.el("rect", { x: X + c * S + 2, y: Y + r * S + 2, width: S - 4, height: S - 4, rx: 3, fill: "#2fa35a", "fill-opacity": .6, class: "later" })));
            else if (k > 0) part.push(fb(s.el("rect", { x: X + c * S + 2, y: Y + r * S + 2, width: S - 4, height: S - 4, rx: 3, fill: "#ffc400", "fill-opacity": .7, class: "later" })));
          }
          svg.append(gridG(s, X, Y, cols, rows, S, "#4d7fae", 1), ...full, ...part);
          svg.querySelector("g").setAttribute("opacity", .45);
          const est = Math.round(full.length + part.length / 2);
          const sw = c => s.h("span", { style: { display: "inline-block", width: "28px", height: "28px", borderRadius: "6px", background: c, flex: "none" } });
          const nF = s.h("b", { class: "big mono" }, "0"), nP = s.h("b", { class: "big mono" }, "0");
          const res = s.h("div", { class: "card later" },
            s.h("p", { class: "t" }, "A ≈ volle + angeschnittene : 2"),
            s.h("p", { class: "t mono" }, `≈ ${full.length} + ${part.length} : 2 ≈ `, s.h("b", null, `${est} m²`)),
            s.h("p", { class: "small pencil" }, `Ganz genau gemessen wären es etwa ${Math.round(exact)} m² – sehr nah dran!`));
          const lf = life(s, "Im Alltag", s.h("p", { class: "small" }, "🗺️ So schätzt man Seen auf Karten: Der Müggelsee in Berlin hat etwa 7,4 km²."),
            s.h("p", { class: "small" }, "🍃 Leg ein Blatt auf Karopapier, umfahre es und zähle!"));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "556px 1fr", alignItems: "center", height: "100%" } },
            svg,
            s.h("div", { class: "stack" },
              s.h("p", { class: "t" }, "Ein Teich im Park. 1 Kästchen = 1 m²."),
              s.h("div", { class: "row" }, sw("#2fa35a"), s.h("span", { class: "t" }, "volle Kästchen:"), nF),
              s.h("div", { class: "row" }, sw("#ffc400"), s.h("span", { class: "t" }, "angeschnittene:"), nP),
              res, lf)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          s.step(async () => { s.say("Zuerst die vollen Kästchen."); await cascade(s, full, "pop", 30, i => { nF.textContent = i + 1; if (i % 3 === 0) s.sfx.count(Math.floor(i / 3) % 15); }); nF.textContent = full.length; });
          s.step(async () => { s.say("Dann die angeschnittenen. Die sind ungefähr halb voll."); await cascade(s, part, "pop", 30, i => { nP.textContent = i + 1; if (i % 3 === 0) s.sfx.tick(); }); nP.textContent = part.length; });
          s.step(async () => { s.sfx.ding(); await s.show(res, "up"); s.say(`Ungefähr ${est} Quadratmeter.`); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },

      /* 4 ------------------------------------------------------------------ */
      {
        title: "Zerlegen und Ergänzen",
        say: "Eine L-Form. Wir können sie zerlegen – oder zu einem Rechteck ergänzen.",
        build(s) {
          const S = 40, X = 70, Y = 34;
          const Lpath = `M${X} ${Y}h${3 * S}v${2 * S}h${3 * S}v${3 * S}h${-6 * S}Z`;
          const dims = (svg, notch) => {
            svg.append(tx(s, X + 3 * S, Y + 5 * S + 32, "6 cm"), tx(s, X - 12, Y + 2.5 * S + 8, "5 cm", { "text-anchor": "end" }), tx(s, X + 1.5 * S, Y - 10, "3 cm"));
            if (notch) svg.append(tx(s, X + 3 * S + 12, Y + S + 8, "2 cm", { "text-anchor": "start" }));
          };
          // left: zerlegen
          const sv1 = s.svg(430, 280);
          const pA = s.el("rect", { x: X, y: Y, width: 3 * S, height: 5 * S, fill: "#efc4f5", stroke: U, "stroke-width": 4 });
          const gB = s.el("g");
          const pB = s.el("rect", { x: X + 3 * S, y: Y + 2 * S, width: 3 * S, height: 3 * S, fill: "#fbd9a8", stroke: ORANGE, "stroke-width": 4 });
          const lB = tx(s, X + 4.5 * S, Y + 3.5 * S + 9, "9 cm²", { class: "later", fill: "#9a4a00" });
          gB.append(pB, lB, tx(s, X + 6 * S + 12, Y + 3.5 * S + 8, "3 cm", { "text-anchor": "start" }));
          const lA = tx(s, X + 1.5 * S, Y + 2.5 * S + 9, "15 cm²", { class: "later", fill: U });
          const cut = s.el("line", { x1: X + 3 * S, y1: Y + 2 * S, x2: X + 3 * S, y2: Y + 5 * S, stroke: RED, "stroke-width": 5, "stroke-linecap": "round", class: "later" });
          sv1.append(gridG(s, X, Y, 6, 5, S, "#e3d5e6", 1), pA, gB, lA, cut);
          dims(sv1, true);
          const f1 = s.h("p", { class: "t mono later" }, "15 cm² + 9 cm² = ", s.h("b", null, "24 cm²"));
          // right: ergänzen
          const sv2 = s.svg(430, 280);
          const ghost = fb(s.el("rect", { x: X + 3 * S, y: Y, width: 3 * S, height: 2 * S, fill: "#fff6c9", stroke: ORANGE, "stroke-width": 4, "stroke-dasharray": "10 7", class: "later" }));
          const lG = tx(s, X + 4.5 * S, Y + S + 9, "6 cm²", { class: "later", fill: "#9a4a00" });
                    sv2.append(gridG(s, X, Y, 6, 5, S, "#e3d5e6", 1), s.el("path", { d: Lpath, fill: "#efc4f5", stroke: U, "stroke-width": 4 }), ghost, lG);
          dims(sv2, false);
          const f2 = s.h("p", { class: "t mono later" }, "6 · 5 − 3 · 2 = 30 − 6 = ", s.h("b", null, "24 cm²"));
          const merk = s.h("div", { class: "merk later" }, s.h("b", null, "Zerlegen:"), " in Rechtecke schneiden und addieren. ", s.h("b", null, "Ergänzen:"), " zum großen Rechteck auffüllen, das Extra abziehen.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center" } },
            s.h("div", { class: "cols" },
              s.h("div", { class: "ex stack", style: { gap: "4px", alignItems: "center" } }, s.h("span", { class: "exlabel" }, "Weg 1: Zerlegen"), sv1, f1),
              s.h("div", { class: "ex stack", style: { gap: "4px", alignItems: "center" } }, s.h("span", { class: "exlabel" }, "Weg 2: Ergänzen"), sv2, f2)),
            merk));
          s.show([sv1, sv2], "zoom"); s.sfx.whoosh();
          s.step(async () => {
            s.say("Wir schneiden die Form in zwei Rechtecke.");
            s.sound("scissors", { vol: .7 }); await s.show(cut, "draw");
            s.sfx.whoosh();
            await s.tween({ from: 0, to: 46, dur: 700, ease: "back", update: v => gB.setAttribute("transform", `translate(${v},0)`) });
            s.sfx.pop(); s.show(lA, "fade"); await s.show(lB, "fade");
            s.sfx.ding(); await s.show(f1, "up");
          });
          s.step(async () => {
            s.say("Oder wir ergänzen das fehlende Stück und ziehen es wieder ab.");
            s.sfx.boing(); await s.show(ghost, "pop");
            s.sfx.pop(); await s.show(lG, "fade");
            s.sfx.ding(); await s.show(f2, "up");
          });
          s.step(async () => { s.sfx.success(); await s.show(merk, "up"); s.say("Beide Wege ergeben 24 Quadratzentimeter."); });
        },
      },

      /* 5 ------------------------------------------------------------------ */
      {
        title: "Das Rechteck",
        say: "Für Rechtecke gibt es Formeln. a ist die Länge, b ist die Breite.",
        build(s) {
          const S = 42, X = 110, Y = 22;
          let a = 6, b = 4, edgesOn = false, tilesOn = false;
          const svg = s.svg(550, 362); const g = s.el("g"); svg.append(g);
          let tiles = [], edges = [];
          const uLine = s.h("p", { class: "t mono" }), aLine = s.h("p", { class: "t mono" }), rowsTxt = s.h("p", { class: "small pencil" });
          const sp = (c, v) => s.h("b", { style: { color: c } }, String(v));
          const formulas = () => {
            uLine.replaceChildren("u = 2·", sp(BLUE, a), " + 2·", sp(RED, b), " = ", s.h("b", null, `${2 * a + 2 * b} cm`));
            aLine.replaceChildren("A = ", sp(BLUE, a), " · ", sp(RED, b), " = ", s.h("b", null, `${a * b} cm²`));
            rowsTxt.textContent = `${b} Reihen mit je ${a} Kästchen`;
          };
          const render = () => {
            clear(g); tiles = []; edges = [];
            g.append(s.el("rect", { x: X, y: Y, width: a * S, height: b * S, fill: USOFT }));
            for (let r = 0; r < b; r++) for (let c = 0; c < a; c++)
              tiles.push(fb(s.el("rect", { x: X + c * S + 2, y: Y + r * S + 2, width: S - 4, height: S - 4, rx: 4, fill: TILE, class: tilesOn ? "" : "later" })));
            g.append(...tiles, gridG(s, X, Y, a, b, S, "#e3c3e9", 1));
            const ln = (x1, y1, x2, y2, c) => s.el("line", { x1, y1, x2, y2, stroke: c, "stroke-width": 7, "stroke-linecap": "round", class: edgesOn ? "" : "later" });
            edges = [ln(X, Y, X + a * S, Y, BLUE), ln(X + a * S, Y, X + a * S, Y + b * S, RED), ln(X + a * S, Y + b * S, X, Y + b * S, BLUE), ln(X, Y + b * S, X, Y, RED)];
            g.append(...edges,
              tx(s, X + a * S / 2, Y + b * S + 34, `a = ${a} cm`, { fill: BLUE }),
              tx(s, X - 14, Y + b * S / 2 + 8, `b = ${b} cm`, { fill: RED, "text-anchor": "end" }));
            formulas();
          };
          render();
          const sa = s.slider({ label: "Länge a", min: 1, max: 10, value: a, fmt: v => v + " cm", onInput: v => { a = v; render(); } });
          const sb = s.slider({ label: "Breite b", min: 1, max: 7, value: b, fmt: v => v + " cm", onInput: v => { b = v; render(); } });
          sa.classList.add("later"); sb.classList.add("later");
          const cu = s.h("div", { class: "card later" }, s.h("p", { class: "h2" }, "Umfang  u = 2·a + 2·b"), uLine);
          const ca = s.h("div", { class: "card later" }, s.h("p", { class: "h2" }, "Fläche  A = a · b"), aLine, rowsTxt);
          const lf = life(s, "Im Alltag",
            s.h("p", { class: "small" }, "📄 Heft (DIN A4) ≈ 30 cm × 21 cm → A ≈ 630 cm²"),
            s.h("p", { class: "small" }, "🪑 Tischplatte 2 m × 1 m → A = 2 m²"),
            s.h("p", { class: "small" }, "🏫 Klassenzimmer 9 m × 7 m → A = 63 m²"));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "550px 1fr", alignItems: "center", height: "100%" } },
            s.h("div", { class: "stack", style: { gap: "4px" } }, svg, sa, sb),
            s.h("div", { class: "stack" }, cu, ca, lf)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          s.step(async () => {
            s.say("Rundherum: zweimal a und zweimal b.");
            edgesOn = true;
            s.sound("pencil-write"); for (const e of edges) await s.show(e, "draw");
            s.sfx.pop(); await s.show(cu, "up");
          });
          s.step(async () => {
            s.say("Innen: b Reihen mit je a Kästchen. Also a mal b.");
            await cascade(s, tiles, "pop", 40, i => s.sfx.count(i % 15));
            tilesOn = true;
            s.sfx.ding(); await s.show(ca, "up");
          });
          s.step(async () => { s.say("Probier die Regler aus!"); s.sfx.pop(); s.show([sa, sb], "up"); await s.show(lf, "up"); });
        },
      },

      /* 6 ------------------------------------------------------------------ */
      {
        title: "Das Quadrat",
        say: "Beim Quadrat sind alle vier Seiten gleich lang.",
        build(s) {
          const S = 40, X = 70, Y = 20;
          let a = 5, edgesOn = false, tilesOn = false;
          const svg = s.svg(420, 390); const g = s.el("g"); svg.append(g);
          let tiles = [], edges = [];
          const uLine = s.h("p", { class: "t mono" }), aLine = s.h("p", { class: "t mono" });
          const render = () => {
            clear(g); tiles = [];
            g.append(s.el("rect", { x: X, y: Y, width: a * S, height: a * S, fill: USOFT }));
            for (let r = 0; r < a; r++) for (let c = 0; c < a; c++)
              tiles.push(fb(s.el("rect", { x: X + c * S + 2, y: Y + r * S + 2, width: S - 4, height: S - 4, rx: 4, fill: TILE, class: tilesOn ? "" : "later" })));
            g.append(...tiles, gridG(s, X, Y, a, a, S, "#e3c3e9", 1));
            const ln = (x1, y1, x2, y2) => s.el("line", { x1, y1, x2, y2, stroke: U, "stroke-width": 7, "stroke-linecap": "round", class: edgesOn ? "" : "later" });
            const e = a * S;
            edges = [ln(X, Y, X + e, Y), ln(X + e, Y, X + e, Y + e), ln(X + e, Y + e, X, Y + e), ln(X, Y + e, X, Y)];
            g.append(...edges, tx(s, X + e / 2, Y + e + 34, `a = ${a} cm`, { fill: U }), tx(s, X - 14, Y + e / 2 + 8, "a", { fill: U, "text-anchor": "end" }));
            uLine.replaceChildren(`u = 4 · ${a} = `, s.h("b", null, `${4 * a} cm`));
            aLine.replaceChildren(`A = ${a} · ${a} = `, s.h("b", null, `${a * a} cm²`));
          };
          render();
          const sl = s.slider({ label: "Seite a", min: 1, max: 8, value: a, fmt: v => v + " cm", onInput: v => { a = v; render(); } });
          sl.classList.add("later");
          const cu = s.h("div", { class: "card later" }, s.h("p", { class: "h2" }, "Umfang  u = 4 · a"), uLine);
          const ca = s.h("div", { class: "card later" }, s.h("p", { class: "h2" }, "Fläche  A = a · a"), aLine);
          const ex = [
            life(s, "Im Alltag", s.h("p", { class: "small" }, "♟️ Schachbrett: 8 × 8 Felder → 8 · 8 = 64 Felder")),
            life(s, "Im Alltag", s.h("p", { class: "small" }, "🟫 Fliese 20 cm: u = 80 cm, A = 400 cm²")),
            life(s, "Im Alltag", s.h("p", { class: "small" }, "🏖️ Sandkasten 3 m × 3 m: u = 12 m, A = 9 m²")),
          ];
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "420px 1fr", alignItems: "center", height: "100%" } },
            s.h("div", { class: "stack", style: { gap: "6px" } }, svg, sl),
            s.h("div", { class: "stack", style: { gap: "12px" } }, cu, ca, ...ex)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          s.step(async () => {
            s.say("Vier gleiche Seiten: u ist 4 mal a.");
            edgesOn = true;
            for (let i = 0; i < 4; i++) { s.sfx.note(i * 2, .15); await s.show(edges[i], "draw"); }
            s.sfx.pop(); await s.show(cu, "up");
          });
          s.step(async () => {
            s.say("Die Fläche ist a mal a.");
            await cascade(s, tiles, "pop", 40, i => s.sfx.count(i % 15));
            tilesOn = true;
            s.sfx.ding(); s.show(sl, "up"); await s.show(ca, "up");
          });
          s.step(async () => { await cascade(s, ex, "left", 250, i => s.sfx.count(i * 2)); });
        },
      },

      /* 7 ------------------------------------------------------------------ */
      {
        title: "Gleicher Umfang, andere Fläche",
        say: "Du hast 24 Meter Zaun für ein Beet. Wie groß kann das Beet werden?",
        build(s) {
          const S = 28, X = 104, Y = 14;
          let a = 4;
          const svg = s.svg(430, 364); const g = s.el("g"); svg.append(g);
          const read1 = s.h("p", { class: "t mono" }), read2 = s.h("p", { class: "h2 mono" });
          const bars = [], vals = [];
          const ch = s.svg(600, 236);
          const area = k => k * (12 - k);
          for (let k = 1; k <= 11; k++) {
            const x = 18 + (k - 1) * 52, h = area(k) * 4.6;
            const bar = s.el("rect", { x, y: 200, width: 40, height: 0, rx: 4, fill: "#e8c3ee" });
            bar.dataset.h = h;
            const v = tx(s, x + 20, 200 - h - 8, String(area(k)), { "font-size": 19, class: "later" });
            bars.push(bar); vals.push(v);
            ch.append(bar, v, tx(s, x + 20, 226, String(k), { "font-size": 19, fill: "#5d6678" }));
          }
          ch.append(s.el("line", { x1: 10, y1: 200, x2: 590, y2: 200, stroke: INK, "stroke-width": 2 }));
          const render = () => {
            const b = 12 - a; clear(g);
            g.append(s.el("rect", { x: X, y: Y, width: a * S, height: b * S, fill: "#a5d6a7" }), gridG(s, X, Y, a, b, S, "#7fbf83", 1),
              s.el("rect", { x: X, y: Y, width: a * S, height: b * S, fill: "none", stroke: BROWN, "stroke-width": 5 }));
            const posts = [];
            for (let i = 0; i <= a; i++) posts.push([X + i * S, Y], [X + i * S, Y + b * S]);
            for (let j = 1; j < b; j++) posts.push([X, Y + j * S], [X + a * S, Y + j * S]);
            posts.forEach(([x, y]) => g.append(s.el("circle", { cx: x, cy: y, r: 4.5, fill: BROWN })));
            g.append(tx(s, X + a * S / 2, Y + b * S + 32, `a = ${a} m`), tx(s, X - 14, Y + b * S / 2 + 8, `b = ${b} m`, { "text-anchor": "end" }));
            read1.textContent = `u = 2·${a} + 2·${b} = 24 m (immer!)`;
            read2.textContent = `A = ${a} · ${b} = ${a * b} m²`;
            bars.forEach((r, i) => r.setAttribute("fill", i + 1 === a ? U : "#e8c3ee"));
          };
          render();
          const sl = s.slider({ label: "Länge a", min: 1, max: 11, value: a, fmt: v => v + " m", onInput: v => { a = v; render(); if (a === 6) s.sfx.ding(); } });
          const chartBox = s.h("div", { class: "stack", style: { gap: "4px" } }, s.h("p", { class: "small pencil" }, "Fläche in m² für a = 1 m bis 11 m (immer u = 24 m):"), ch);
          const merk = s.h("div", { class: "merk later" }, "Gleicher Umfang heißt ", s.h("b", null, "nicht"), " gleiche Fläche! Das Quadrat 6 m × 6 m hat die größte Fläche: 36 m².");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "430px 1fr", alignItems: "center", height: "100%" } },
            s.h("div", { class: "stack", style: { gap: "4px" } }, svg, sl),
            s.h("div", { class: "stack" }, s.h("div", { class: "card soft" }, read1, read2), chartBox, merk)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          s.step(async () => {
            s.say("Alle Beete haben 24 Meter Zaun. Aber schau dir die Flächen an!");
            bars.forEach((r, i) => s.tween({ from: 0, to: 1, dur: 600, delay: i * 90, ease: "back", update: t => { const h = Math.max(0, r.dataset.h * t); r.setAttribute("height", h); r.setAttribute("y", 200 - h); } }));
            await cascade(s, vals, "fade", 90, i => s.sfx.count(i));
          });
          s.step(async () => { s.sfx.success(); await s.show(merk, "up"); s.say("Das Quadrat hat die größte Fläche."); });
        },
      },

      /* 8 ------------------------------------------------------------------ */
      {
        title: "Flächeneinheiten",
        say: "Für Flächen gibt es sieben Einheiten. Von einer zur nächsten ist die Umrechnungszahl immer 100.",
        build(s) {
          const D = [
            { u: "mm²", n: "Quadratmillimeter", side: "1 mm", d: "Quadrat mit 1 mm × 1 mm", l: "📌 So klein wie ein Stecknadelkopf.", c: "1 cm² = 100 mm²" },
            { u: "cm²", n: "Quadratzentimeter", side: "1 cm", d: "Quadrat mit 1 cm × 1 cm", l: "💅 Ungefähr so groß wie dein Fingernagel.", c: "1 dm² = 100 cm²" },
            { u: "dm²", n: "Quadratdezimeter", side: "10 cm", d: "Quadrat mit 10 cm × 10 cm", l: "🟫 Eine Fliese mit 10 cm × 10 cm.", c: "1 m² = 100 dm²" },
            { u: "m²", n: "Quadratmeter", side: "1 m", d: "Quadrat mit 1 m × 1 m", l: "🛏️ Dein Bett hat ungefähr 2 m².", c: "1 a = 100 m²" },
            { u: "a", n: "Ar", side: "10 m", d: "Quadrat mit 10 m × 10 m = 100 m²", l: "🏡 Ein Schrebergarten hat oft 3 bis 4 a.", c: "1 ha = 100 a" },
            { u: "ha", n: "Hektar", side: "100 m", d: "Quadrat mit 100 m × 100 m", l: "⚽ Ein Fußballfeld hat etwa 0,7 ha. 1 ha ≈ 1,4 Fußballfelder.", c: "1 km² = 100 ha" },
            { u: "km²", n: "Quadratkilometer", side: "1 km", d: "Quadrat mit 1 km × 1 km", l: "🛫 Tempelhofer Feld ≈ 3,55 km². Ganz Berlin ≈ 891 km².", c: "1 km² = 100 ha = 1.000.000 m²" },
          ];
          const BW = 134, GAP = 17, OFF = (1100 - (7 * BW + 6 * GAP)) / 2;
          const arcs = s.svg(1100, 64); const arcEls = [], arcLbl = [];
          arcs.append(s.el("defs", null, s.el("marker", { id: "u7arr", viewBox: "0 0 10 10", refX: 5, refY: 5, markerWidth: 6, markerHeight: 6, orient: "auto-start-reverse" }, s.el("path", { d: "M0 0L10 5L0 10z", fill: U }))));
          for (let i = 0; i < 6; i++) {
            const x1 = OFF + BW / 2 + i * (BW + GAP) + 18, x2 = x1 + BW + GAP - 36, m = (x1 + x2) / 2;
            arcEls.push(s.el("path", { d: `M${x2} 62Q${m} 22 ${x1} 62`, fill: "none", stroke: U, "stroke-width": 3, "marker-end": "url(#u7arr)", class: "later" }));
            arcLbl.push(tx(s, m, 30, "· 100", { "font-size": 20, fill: U, class: "later" }));
          }
          arcs.append(...arcEls, ...arcLbl);
          const pic = s.svg(170, 170), pT = s.h("p", { class: "h2" }), pD = s.h("p", { class: "t" }), pL = s.h("p", { class: "t" }), pC = s.h("p", { class: "t mono violet" });
          const panel = s.h("div", { class: "card soft later", style: { display: "grid", gridTemplateColumns: "170px 1fr", gap: "24px", alignItems: "center" } }, pic, s.h("div", { class: "stack", style: { gap: "6px" } }, pT, pD, pL, pC));
          const boxes = D.map((d, i) => s.h("button", { class: "btn a-pop", style: { width: BW + "px", minHeight: "76px", fontSize: "30px", "--d": i * 90 + "ms" }, onclick: () => { s.sfx.pop(); setUnit(i); } }, d.u));
          const setUnit = i => {
            const d = D[i];
            boxes.forEach((b, k) => b.classList.toggle("solid", k === i));
            pT.textContent = `1 ${d.u} – ${d.n}`; pD.textContent = d.d; pL.textContent = d.l; pC.textContent = d.c;
            clear(pic);
            pic.append(s.el("rect", { x: 22, y: 8, width: 126, height: 126, fill: "#fff", stroke: U, "stroke-width": 4 }), tx(s, 85, 160, d.side, { fill: U }), tx(s, 85, 80, "1 " + d.u, { "font-size": 26, fill: U }));
            if (panel.classList.contains("later")) s.show(panel, "up");
          };
          const merk = s.h("div", { class: "merk later" }, "Umrechnungszahl ", s.h("b", null, "100"), ". Zur kleineren Einheit (nach links): ", s.h("b", null, "· 100"), ". Zur größeren Einheit (nach rechts): ", s.h("b", null, ": 100"), ".");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "12px" } },
            s.h("p", { class: "t" }, "Tippe auf eine Einheit!"),
            arcs, s.h("div", { class: "row", style: { gap: GAP + "px", justifyContent: "center", flexWrap: "nowrap" } }, ...boxes),
            panel, merk));
          D.forEach((_, i) => setTimeout(() => s.alive && s.sfx.count(i * 2), i * 90));
          s.step(async () => {
            s.say("Jede Einheit ist hundertmal so groß wie die davor.");
            arcEls.forEach((e, i) => s.show(e, "draw", i * 250));
            await cascade(s, arcLbl, "pop", 250, i => s.sfx.count(i * 2));
          });
          s.step(async () => { setUnit(1); s.sfx.ding(); await s.wait(500); await s.show(merk, "up"); });
        },
      },

      /* 9 ------------------------------------------------------------------ */
      {
        title: "1 dm² = 100 cm²",
        say: "Ein Quadratdezimeter ist ein Quadrat mit 10 Zentimeter Seitenlänge. Wie viele Quadratzentimeter passen hinein?",
        build(s) {
          const S = 30, X = 76, Y = 14;
          const svg = s.svg(390, 362);
          svg.append(s.el("rect", { x: X, y: Y, width: 10 * S, height: 10 * S, fill: "#fff" }));
          const tiles = [];
          for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) tiles.push(fb(s.el("rect", { x: X + c * S + 2, y: Y + r * S + 2, width: S - 4, height: S - 4, rx: 3, fill: (r % 2) ? TILE : "#dc8de8", class: "later" })));
          const hi = fb(s.el("rect", { x: X + 9 * S, y: Y, width: S, height: S, fill: "none", stroke: ORANGE, "stroke-width": 5, class: "later" }));
          svg.append(...tiles, gridG(s, X, Y, 10, 10, S, "#cfa6d6", 1), s.el("rect", { x: X, y: Y, width: 10 * S, height: 10 * S, fill: "none", stroke: U, "stroke-width": 5 }), hi,
            tx(s, X + 5 * S, Y + 10 * S + 34, "10 cm"), tx(s, X - 12, Y + 5 * S + 8, "10 cm", { "text-anchor": "end" }));
          const cnt = s.h("span", { class: "big mono", style: { color: U } }, "0 cm²");
          // zoom
          const zm = s.svg(240, 320, { class: "later" });
          zm.append(tx(s, 120, 30, "1 cm² vergrößert", { "font-size": 20, fill: ORANGE }),
            s.el("rect", { x: 20, y: 50, width: 200, height: 200, fill: "#fbd9a8" }), gridG(s, 20, 50, 10, 10, 20, "#e29a4a", 1),
            s.el("rect", { x: 20, y: 50, width: 200, height: 200, fill: "none", stroke: ORANGE, "stroke-width": 5 }),
            tx(s, 120, 290, "= 100 mm²", { "font-size": 28, fill: ORANGE }));
          const conv = ["3 dm² = 300 cm²", "250 cm² = 2,5 dm²", "4 m² = 400 dm²", "2 a = 200 m²"].map(t => s.h("p", { class: "t mono later" }, t));
          const cc = s.h("div", { class: "ex" }, s.h("span", { class: "exlabel" }, "Umrechnen"), ...conv);
          const warn = s.h("div", { class: "ex later", style: { borderColor: RED } }, s.h("span", { class: "exlabel", style: { color: RED } }, "Achtung"),
            s.h("p", { class: "t" }, "Länge: 1 dm = ", s.h("b", null, "10"), " cm"),
            s.h("p", { class: "t" }, "Fläche: 1 dm² = ", s.h("b", { class: "red" }, "100"), " cm²"),
            s.h("p", { class: "small" }, "10 Reihen mit je 10 Kästchen!"));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "390px 240px 1fr", gap: "22px", alignItems: "center", height: "100%" } },
            s.h("div", { class: "stack", style: { alignItems: "center", gap: "4px" } }, svg, cnt),
            zm,
            s.h("div", { class: "stack" }, cc, warn)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          s.step(async () => {
            s.say("Reihe für Reihe: zehn, zwanzig, dreißig … hundert!");
            await cascade(s, tiles, "pop", 18, i => { cnt.textContent = (i + 1) + " cm²"; if (i % 10 === 9) s.sfx.count((i - 9) / 10); });
            cnt.textContent = "100 cm²"; s.sfx.ding();
          });
          s.step(async () => {
            s.say("Und ein Quadratzentimeter hat wieder 100 Quadratmillimeter.");
            s.sfx.pop(); await s.show(hi, "pop");
            s.sfx.whoosh(); await s.show(zm, "zoom");
          });
          s.step(async () => { await cascade(s, conv, "left", 300, i => s.sfx.count(i * 2)); });
          s.step(async () => { s.sfx.boing(); await s.show(warn, "pop"); s.say("Achtung: Bei Flächen ist die Zahl 100, nicht 10!"); });
        },
      },

      /* 10 ----------------------------------------------------------------- */
      {
        title: "Zusammengesetzte Flächen",
        say: "Ein Zimmer mit einem Erker. Wie viel Teppich brauchen wir?",
        build(s) {
          const S = 60, X = 80, Y = 34;
          const svg = s.svg(560, 340);
          const id = uid("u7room"), pid = uid("u7pat");
          const room = `M${X} ${Y}h${6 * S}v${S}h${S}v${2 * S}h${-S}v${S}h${-6 * S}Z`;
          svg.append(s.el("defs", null,
            s.el("clipPath", { id }, s.el("path", { d: room })),
            s.el("pattern", { id: pid, width: 24, height: 24, patternUnits: "userSpaceOnUse" },
              s.el("rect", { width: 24, height: 24, fill: "#c77fd4" }), s.el("path", { d: "M0 12h24", stroke: "#b066be", "stroke-width": 6 }))));
          svg.append(s.el("path", { d: room, fill: "#f3e6c8" }), gridG(s, X, Y, 7, 4, S, "#e3d2ad", 1));
          const p1 = s.el("rect", { x: X, y: Y, width: 6 * S, height: 4 * S, fill: U, "fill-opacity": .18, class: "later" });
          const p2 = s.el("rect", { x: X + 6 * S, y: Y + S, width: S, height: 2 * S, fill: ORANGE, "fill-opacity": .3, class: "later" });
          const carpet = s.el("rect", { x: X, y: Y, width: 0, height: 4 * S, fill: `url(#${pid})`, "clip-path": `url(#${id})` });
          const split = s.el("line", { x1: X + 6 * S, y1: Y + S, x2: X + 6 * S, y2: Y + 3 * S, stroke: RED, "stroke-width": 4, class: "later" });
          const wall = s.el("path", { d: room, fill: "none", stroke: INK, "stroke-width": 7, "stroke-linejoin": "round" });
          const skirt = s.el("path", { d: room, fill: "none", stroke: ORANGE, "stroke-width": 7, "stroke-linejoin": "round", class: "later" });
          const l1 = tx(s, X + 3 * S, Y + 2 * S + 9, "24 m²", { "font-size": 28, fill: U, class: "later" });
          const l2 = tx(s, X + 6.5 * S, Y + 2 * S + 8, "2 m²", { "font-size": 20, fill: "#9a4a00", class: "later" });
          svg.append(p1, p2, carpet, split, wall, skirt, l1, l2,
            tx(s, X + 3 * S, Y - 12, "6 m"), tx(s, X - 14, Y + 2 * S + 8, "4 m", { "text-anchor": "end" }),
            tx(s, X + 7 * S + 12, Y + 2 * S + 8, "2 m", { "text-anchor": "start" }), tx(s, X + 6.5 * S, Y + 3 * S + 26, "1 m"));
          const c1 = s.h("div", { class: "card later" }, s.h("p", { class: "t" }, s.h("b", null, "Zerlegen: "), "6 m · 4 m = 24 m²"), s.h("p", { class: "t" }, "und 2 m · 1 m = 2 m²"));
          const c2 = s.h("div", { class: "card later" }, s.h("p", { class: "h2" }, "A = 24 m² + 2 m² = 26 m²"), s.h("p", { class: "small" }, "So viel Teppich brauchst du."));
          const c3 = life(s, "Im Alltag", s.h("p", { class: "t" }, "Teppich kostet 20 € pro m²: 26 · 20 € = ", s.h("b", null, "520 €")));
          const c4 = s.h("div", { class: "card later" }, s.h("p", { class: "t" }, s.h("b", { class: "orange" }, "Fußleiste"), " = Umfang:"), s.h("p", { class: "t mono" }, "6+1+1+2+1+1+6+4 = ", s.h("b", null, "22 m")));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "560px 1fr", alignItems: "center", height: "100%" } },
            s.h("div", { class: "stack" }, s.h("p", { class: "t" }, "Ein Zimmer mit Erker (kleine Nische):"), svg),
            s.h("div", { class: "stack" }, c1, c2, c3, c4)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          s.step(async () => {
            s.say("Wir zerlegen in zwei Rechtecke.");
            s.sound("pencil-write"); await s.show(split, "draw");
            s.sfx.pop(); s.show([p1, p2], "fade"); s.show([l1, l2], "pop");
            await s.show(c1, "up");
          });
          s.step(async () => {
            s.say("Zusammen 26 Quadratmeter. Jetzt rollen wir den Teppich aus.");
            s.sfx.whoosh();
            await s.tween({ from: 0, to: 7 * S, dur: 1400, ease: "out", update: v => carpet.setAttribute("width", v) });
            s.sfx.ding(); await s.show(c2, "up");
          });
          s.step(async () => { s.sound("cash-register", { vol: .6 }); await s.show(c3, "up"); });
          s.step(async () => { s.say("Die Fußleiste läuft am Rand entlang. Das ist der Umfang: 22 Meter."); s.sfx.scribble(); await s.show(skirt, "draw"); s.sfx.pop(); await s.show(c4, "up"); });
        },
      },

      /* 11 ----------------------------------------------------------------- */
      {
        title: "Eine Wand streichen",
        say: "Leon will eine Wand streichen. Fenster und Tür werden nicht gestrichen.",
        build(s) {
          const S = 80, X = 70, Y = 20, W = 5 * S, H = 3 * S;
          const win = { x: X + .5 * S, y: Y + .6 * S, w: 2 * S, h: S }, door = { x: X + 3.4 * S, y: Y + S, w: S, h: 2 * S };
          const svg = s.svg(520, 300);
          const id = uid("u7wall");
          const hole = r => `M${r.x} ${r.y}h${r.w}v${r.h}h${-r.w}Z`;
          svg.append(s.el("defs", null, s.el("clipPath", { id }, s.el("path", { d: `M${X} ${Y}h${W}v${H}h${-W}Z` + hole(win) + hole(door), "clip-rule": "evenodd" }))));
          svg.append(s.el("rect", { x: X, y: Y, width: W, height: H, fill: "#efece4", stroke: INK, "stroke-width": 4 }));
          const paint = s.el("rect", { x: X, y: Y, width: 0, height: H, fill: "#d98ce6", "clip-path": `url(#${id})` });
          svg.append(paint,
            s.el("rect", { x: win.x, y: win.y, width: win.w, height: win.h, fill: "#bfe3ff", stroke: "#5d6678", "stroke-width": 5 }),
            s.el("path", { d: `M${win.x + win.w / 2} ${win.y}v${win.h}`, stroke: "#5d6678", "stroke-width": 4 }),
            s.el("rect", { x: door.x, y: door.y, width: door.w, height: door.h, fill: "#b07a4a", stroke: "#6d4520", "stroke-width": 5 }),
            s.el("circle", { cx: door.x + door.w - 16, cy: door.y + door.h / 2 + 10, r: 6, fill: "#ffd94a" }));
          const outl = [win, door].map(r => fb(s.el("rect", { x: r.x - 5, y: r.y - 5, width: r.w + 10, height: r.h + 10, fill: "none", stroke: RED, "stroke-width": 4, "stroke-dasharray": "9 6", class: "later" })));
          const lw = tx(s, win.x + win.w * .25, win.y + win.h / 2 + 8, "2 m²", { fill: RED, class: "later" });
          const ld = tx(s, door.x + door.w / 2, door.y + 50, "2 m²", { fill: "#fff", class: "later" });
          const rollPos = s.el("g", { transform: `translate(${X},0)` }), roller = s.el("g", { class: "later" });
          roller.append(s.el("path", { d: `M14 ${Y + H / 2}h22v${H / 2 + 6}`, fill: "none", stroke: "#5d6678", "stroke-width": 5, "stroke-linecap": "round" }),
            s.el("rect", { x: -12, y: Y - 4, width: 26, height: H + 8, rx: 12, fill: "#c26ad0", stroke: "#6d1f7a", "stroke-width": 3 }));
          rollPos.append(roller);
          svg.append(...outl, lw, ld, rollPos, tx(s, X + W / 2, Y + H + 34, "5 m"), tx(s, X - 14, Y + H / 2 + 8, "3 m", { "text-anchor": "end" }));
          const c1 = s.h("div", { class: "card later" }, s.h("p", { class: "t" }, "Ganze Wand: 5 m · 3 m = ", s.h("b", null, "15 m²")));
          const c2 = s.h("div", { class: "card later" }, s.h("p", { class: "t" }, "Fenster: 2 m · 1 m = 2 m²"), s.h("p", { class: "t" }, "Tür: 1 m · 2 m = 2 m²"));
          const c3 = s.h("div", { class: "card later" }, s.h("p", { class: "h2" }, "15 − 2 − 2 = 11 m²"), s.h("p", { class: "small" }, "Diese Fläche wird gestrichen."));
          const c4 = life(s, "Im Alltag", s.h("p", { class: "small" }, "🪣 Auf dem Farbeimer steht: „reicht für 10 m²“. Für 11 m² ist ein Eimer zu wenig!"),
            s.h("p", { class: "small" }, "Zweimal streichen? Dann 2 · 11 m² = 22 m² rechnen."));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "520px 1fr", alignItems: "center", height: "100%" } },
            svg, s.h("div", { class: "stack" }, c1, c2, c3, c4)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          s.step(async () => { s.sfx.pop(); await s.show(c1, "up"); s.say("Die ganze Wand hat 15 Quadratmeter."); });
          s.step(async () => {
            s.say("Fenster und Tür ziehen wir ab.");
            s.sfx.snap(); s.show(outl, "pop"); s.show([lw, ld], "fade", 200);
            await s.show(c2, "up");
          });
          s.step(async () => {
            s.say("Jetzt wird gerollt!");
            await s.show(roller, "fade");
            s.sound("farbroller", { vol: .7, dur: 2.2 });
            await s.tween({ from: 0, to: W, dur: 2000, ease: "inOut", update: v => { paint.setAttribute("width", v); rollPos.setAttribute("transform", `translate(${X + v},0)`); } });
            s.sfx.ding(); await s.show(c3, "up");
          });
          s.step(async () => { s.sfx.pop(); await s.show(c4, "up"); });
        },
      },

      /* 12 ----------------------------------------------------------------- */
      {
        title: "Oberfläche eines Quaders",
        say: "Ein Geschenk ist ein Quader. Wie viel Papier brauchst du zum Einpacken?",
        build(s) {
          const k = 7; // px per cm
          const cols = ["#e8b4f0", "#ffc98a", "#ffc98a", "#a8dcc0", "#a8dcc0", "#e8b4f0"];
          const RB = "#dc3b2a", vS = `linear-gradient(90deg, transparent 45%, ${RB} 45%, ${RB} 55%, transparent 55%)`, hS = `linear-gradient(0deg, transparent 43%, ${RB} 43%, ${RB} 57%, transparent 57%)`;
          const faces = [cols[0], `${vS}, ${cols[1]}`, `${vS}, ${cols[2]}`, `${hS}, ${cols[3]}`, `${hS}, ${cols[4]}`, `${vS}, ${hS}, ${cols[5]}`];
          const net = makeNet(s, 30 * k, 20 * k, 10 * k, faces, 470, 520, [52, -32], 1.35);
          const sw = c => s.h("span", { style: { display: "inline-block", width: "30px", height: "30px", borderRadius: "6px", background: c, border: "2px solid rgba(27,39,64,.4)", flex: "none" } });
          const rows = [
            [cols[0], "oben + unten: 2 · 30 · 20 = 1200 cm²"],
            [cols[1], "vorne + hinten: 2 · 30 · 10 = 600 cm²"],
            [cols[3], "links + rechts: 2 · 20 · 10 = 400 cm²"],
          ].map(([c, t]) => s.h("div", { class: "row later", style: { flexWrap: "nowrap" } }, sw(c), s.h("span", { class: "t mono" }, t)));
          const sum = s.h("div", { class: "card later" }, s.h("p", { class: "h2" }, "O = 1200 + 600 + 400 = 2200 cm²"));
          const merk = s.h("div", { class: "merk later" }, "Oberfläche = alle 6 Flächen zusammen.", s.h("br"), s.h("b", null, "Quader: O = 2·(a·b + a·c + b·c)"));
          let busy = false;
          const toggle = async (snd) => {
            if (busy) return; busy = true; if (snd) s.sound("geschenkpapier", { vol: .6 }); else s.sfx.whoosh();
            const from = net.t, to = net.t > .5 ? 0 : 1;
            await s.tween({ from, to, dur: 1300, ease: "inOut", update: net.set }); busy = false;
          };
          const btn = s.h("button", { class: "btn", onclick: () => { s.sfx.click(); toggle(); } }, "Auf- / Zuklappen");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "470px 1fr", alignItems: "center", height: "100%" } },
            s.h("div", { class: "stack", style: { alignItems: "center", gap: "0" } }, net.stage, btn),
            s.h("div", { class: "stack" },
              s.h("p", { class: "t" }, "Geschenk: ", s.h("b", null, "a = 30 cm"), " lang, ", s.h("b", null, "b = 20 cm"), " breit, ", s.h("b", null, "c = 10 cm"), " hoch."),
              ...rows, sum, merk)));
          s.show(net.stage, "zoom"); s.sfx.whoosh();
          s.step(async () => { s.say("Wir klappen das Geschenk auf. Das ist das Netz."); await toggle(true); });
          s.step(async () => { s.say("Immer zwei Flächen sind gleich groß."); await cascade(s, rows, "left", 400, i => s.sfx.count(i * 2)); });
          s.step(async () => { s.sfx.ding(); await s.show(sum, "up"); s.say("Zusammen 2200 Quadratzentimeter Papier – plus ein bisschen zum Überlappen."); });
          s.step(async () => { s.sfx.success(); await s.show(merk, "up"); });
        },
      },

      /* 13 ----------------------------------------------------------------- */
      {
        title: "Oberfläche eines Würfels",
        say: "Ein Würfel hat sechs gleich große Quadrate.",
        build(s) {
          const cols = ["#f4b5c4", "#ffd98a", "#a8dcc0", "#a9c8f5", "#d6b8f5", "#ffb38a"];
          const net = makeNet(s, 110, 110, 110, cols, 430, 500, [50, -35], 1.7);
          let sl;
          const go = async to => { s.sfx.whoosh(); await s.tween({ from: net.t, to, dur: 1200, ease: "inOut", update: v => { net.set(v); sl.set(Math.round(v * 100)); } }); };
          sl = s.slider({ label: "Klappen", min: 0, max: 100, value: 100, fmt: v => (v === 0 ? "offen" : v === 100 ? "zu" : v + " %"), onInput: v => net.set(v / 100) });
          const btn = s.h("button", { class: "btn", onclick: () => { s.sfx.click(); go(net.t > .5 ? 0 : 1); } }, "Auf- / Zuklappen");
          const f = s.h("div", { class: "card later" }, s.h("p", { class: "h2" }, "Würfel: O = 6 · a · a"), s.h("p", { class: "small" }, "6 Quadrate, jedes hat die Fläche a · a."));
          const ex = [
            life(s, "Im Alltag", s.h("p", { class: "small" }, "🎲 Spielwürfel, a = 2 cm: O = 6 · 2 · 2 = 24 cm²")),
            life(s, "Im Alltag", s.h("p", { class: "small" }, "🧩 Zauberwürfel, a ≈ 6 cm: O ≈ 6 · 6 · 6 = 216 cm²")),
            life(s, "Im Alltag", s.h("p", { class: "small" }, "⛏️ Minecraft-Block, a = 1 m: O = 6 · 1 · 1 = 6 m²")),
          ];
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "430px 1fr", alignItems: "center", height: "100%" } },
            net.stage,
            s.h("div", { class: "stack" }, s.h("div", { class: "row" }, sl, btn), f, ...ex)));
          sl.style.flex = "1";
          s.show(net.stage, "zoom"); s.sfx.whoosh();
          s.step(async () => { s.say("Aufklappen: sechs gleiche Quadrate."); await go(0); s.sfx.ding(); await s.show(f, "up"); });
          s.step(async () => { s.sound("wuerfeln", { vol: .7 }); await cascade(s, ex, "left", 300); });
        },
      },

      /* 13b ---------------------------------------------------------------- */
      {
        title: "Berliner Flächen von oben",
        say: "Von oben sieht man Flächen besonders gut: das Tempelhofer Feld, den Müggelsee und viele kleine Gärten.",
        build(s) {
          const f1 = s.photo("tempelhofer-feld", { w: 540, h: 400, caption: "Tempelhofer Feld: 355 ha – bis 2008 ein Flughafen", cls: "later" });
          const f2 = s.photo("mueggelsee", { w: 530, h: 188, caption: "Müggelsee: 7,4 km², Berlins größter See", cls: "later" });
          const f3 = s.photo("kleingaerten", { w: 530, h: 188, pos: "50% 60%", caption: "Kleingärten: Zaun = Umfang, Beet = Fläche", cls: "later" });
          const merk = s.h("div", { class: "merk later" }, "Große Flächen misst man in ", s.h("b", null, "ha"), " und ", s.h("b", null, "km²"), ": 1 km² = 100 ha.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "18px" } },
            s.h("div", { style: { display: "grid", gridTemplateColumns: "540px 530px", gap: "24px", alignItems: "center", justifyContent: "center" } },
              f1, s.h("div", { class: "stack", style: { gap: "24px" } }, f2, f3)), merk));
          s.step(async () => { s.sound("wind", { vol: .35, dur: 3 }); await s.show(f1, "zoom"); s.say("Auf dem Tempelhofer Feld landeten früher Flugzeuge. Heute ist es ein Park."); });
          s.step(async () => { s.sound("waves", { vol: .4, dur: 3 }); await s.show(f2, "zoom"); });
          s.step(async () => { s.sound("birds", { vol: .4, dur: 3 }); await s.show(f3, "zoom"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },

      /* 14 ----------------------------------------------------------------- */
      {
        title: "Fußballfeld und Tempelhof",
        say: "Ein Fußballfeld ist 105 Meter lang und 68 Meter breit.",
        build(s) {
          const k = 4, X = 76, Y = 16, W = 105 * k, H = 68 * k;
          const svg = s.svg(510, 336);
          for (let i = 0; i < 10; i++) svg.append(s.el("rect", { x: X + i * W / 10, y: Y, width: W / 10, height: H, fill: i % 2 ? "#3f9b4b" : "#47a854" }));
          const L = { fill: "none", stroke: "#fff", "stroke-width": 3 };
          const pa = 16.5 * k, pw = 40.3 * k, ga = 5.5 * k, gw = 18.3 * k, gl = 7.32 * k;
          svg.append(s.el("rect", Object.assign({ x: X, y: Y, width: W, height: H }, L)),
            s.el("line", Object.assign({ x1: X + W / 2, y1: Y, x2: X + W / 2, y2: Y + H }, L)),
            s.el("circle", Object.assign({ cx: X + W / 2, cy: Y + H / 2, r: 9.15 * k }, L)),
            s.el("rect", Object.assign({ x: X, y: Y + (H - pw) / 2, width: pa, height: pw }, L)),
            s.el("rect", Object.assign({ x: X + W - pa, y: Y + (H - pw) / 2, width: pa, height: pw }, L)),
            s.el("rect", Object.assign({ x: X, y: Y + (H - gw) / 2, width: ga, height: gw }, L)),
            s.el("rect", Object.assign({ x: X + W - ga, y: Y + (H - gw) / 2, width: ga, height: gw }, L)),
            s.el("rect", { x: X - 8, y: Y + (H - gl) / 2, width: 8, height: gl, fill: "#fff" }),
            s.el("rect", { x: X + W, y: Y + (H - gl) / 2, width: 8, height: gl, fill: "#fff" }));
          const per = s.el("path", { d: `M${X} ${Y}h${W}v${H}h${-W}Z`, fill: "none", stroke: "#ffd94a", "stroke-width": 8, class: "later" });
          const fillA = fb(s.el("rect", { x: X, y: Y, width: W, height: H, fill: "#ffd94a", "fill-opacity": .45, class: "later" }));
          svg.append(fillA, per, tx(s, X + W / 2, Y + H + 34, "105 m"), tx(s, X - 16, Y + H / 2 + 8, "68 m", { "text-anchor": "end" }));
          const fu = s.h("p", { class: "t mono later" }, "u = 2·105 m + 2·68 m = ", s.h("b", null, "346 m"));
          const fa = s.h("p", { class: "t mono later" }, "A = 105 m · 68 m = ", s.h("b", null, "7140 m²"), " ≈ 0,7 ha");
          // Tempelhof
          const { canvas, g } = s.canvas(550, 300);
          const drawN = n => {
            g.clearRect(0, 0, 550, 300);
            for (let i = 0; i < 500; i++) {
              const c = i % 25, r = Math.floor(i / 25), x = c * 22 + 1.5, y = r * 15 + 1.5;
              if (i < n) { g.fillStyle = "#47a854"; g.fillRect(x, y, 19, 12); g.fillStyle = "#fff"; g.fillRect(x + 9, y, 1.2, 12); }
              else { g.strokeStyle = "#cfe6d2"; g.lineWidth = 1; g.strokeRect(x + .5, y + .5, 18, 11); }
            }
          };
          drawN(0);
          const tCount = s.h("b", { class: "mono" }, "0");
          const right = s.h("div", { class: "stack later", style: { gap: "8px" } },
            s.h("p", { class: "h2" }, "Tempelhofer Feld ≈ 355 ha"), canvas,
            s.h("p", { class: "t" }, "Fußballfelder: ", tCount),
            s.h("p", { class: "small" }, "355 ha = 3.550.000 m² und 3.550.000 : 7140 ≈ 497 → fast 500 Fußballfelder!"));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "510px 1fr", alignItems: "center", height: "100%" } },
            s.h("div", { class: "stack", style: { gap: "8px" } }, svg, fu, fa), right));
          s.show(svg, "zoom"); s.sfx.whoosh();
          s.step(async () => { s.say("Einmal rundherum sind 346 Meter."); s.sound("whistle", { vol: .6 }); await s.show(per, "draw"); s.sfx.pop(); await s.show(fu, "up"); });
          s.step(async () => { s.say("Die Fläche: 7140 Quadratmeter."); s.sound("ball-kick", { vol: .7 }); await s.show(fillA, "zoom"); s.sfx.ding(); await s.show(fa, "up"); });
          s.step(async () => {
            s.say("Das Tempelhofer Feld in Berlin ist so groß wie fast 500 Fußballfelder!");
            await s.show(right, "up");
            if (s.fast) { drawN(500); tCount.textContent = "≈ 500"; return; }
            await new Promise(res => {
              let last = 0;
              s.loop(t => {
                const n = Math.min(500, Math.round(t / 2.5 * 500)); drawN(n); tCount.textContent = n;
                if (Math.floor(n / 50) > last) { last = Math.floor(n / 50); s.sfx.count(last); }
                if (n >= 500) { tCount.textContent = "≈ 500"; s.sound("kids-wow", { vol: .6 }); res(); return false; }
              });
            });
          });
        },
      },

      /* 15 ----------------------------------------------------------------- */
      {
        title: "Umfang, Fläche, Oberfläche?",
        say: "Im Alltag musst du entscheiden: Brauche ich den Umfang, die Fläche oder die Oberfläche?",
        build(s) {
          const TAG = { U: ["Umfang", "#fde3c8", "#9a4a00"], F: ["Fläche", "#d6f0df", GREEN], O: ["Oberfläche", USOFT, U] };
          const D = [
            ["🏡", "Zaun um den Garten", "U", "8 m × 5 m → 26 m Zaun"],
            ["🧶", "Teppich fürs Zimmer", "F", "4 m × 3 m → 12 m²"],
            ["🎁", "Geschenk einpacken", "O", "alle 6 Seiten zusammen"],
            ["📏", "Fußleiste im Zimmer", "U", "4 m × 3 m → 14 m"],
            ["🖌️", "Wand streichen", "F", "Fenster abziehen!"],
            ["🖼️", "Bilderrahmen", "U", "30 cm × 20 cm → 100 cm"],
            ["🌱", "Rasen säen", "F", "Saat pro m² auf der Packung"],
            ["📱", "iPad-Bildschirm", "F", "≈ 23 cm × 16 cm ≈ 368 cm²"],
            ["🏫", "Klassenzimmer", "F", "10 m × 6 m = 60 m²"],
          ];
          const cards = D.map(([e, t, k, c]) => s.h("div", { class: "card later", style: { display: "flex", gap: "14px", alignItems: "center", padding: "12px 16px" } },
            s.h("span", { style: { fontSize: "40px", lineHeight: "1" } }, e),
            s.h("div", { class: "stack", style: { gap: "4px" } },
              s.h("b", { class: "t" }, t),
              s.h("span", { class: "chip", style: { background: TAG[k][1], color: TAG[k][2], alignSelf: "flex-start", fontSize: "19px" } }, TAG[k][0]),
              s.h("span", { class: "small mono" }, c))));
          const merk = s.h("div", { class: "merk later" }, "Am Rand entlang → ", s.h("b", null, "Umfang"), " (m). Innen drin → ", s.h("b", null, "Fläche"), " (m²). Alle Seiten eines Körpers → ", s.h("b", null, "Oberfläche"), " (m²).");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "14px" } },
            s.h("div", { class: "cols3", style: { gap: "14px" } }, ...cards), merk));
          const row = i => cascade(s, cards.slice(i * 3, i * 3 + 3), "pop", 220, j => s.sfx.count(i * 3 + j));
          row(0);
          s.step(async () => { await row(1); });
          s.step(async () => { await row(2); });
          s.step(async () => { s.sfx.success(); await s.show(merk, "up"); });
        },
      },
    ],
  });
})();
