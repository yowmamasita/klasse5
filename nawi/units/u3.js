/* Kapitel 3 – Stoffe und ihre Eigenschaften (RLP NaWi 5/6, Thema 3.2 „Stoffe im Alltag“) */
(() => {
  const UC = "#c2410c";

  /* ---------- small helpers ---------- */
  const T = (s, x, y, text, o = {}) => s.el("text", Object.assign({ x, y, "text-anchor": o.anchor || "middle", class: o.cls || "lbl", text }, o.attrs || {}, o.fill ? { fill: o.fill } : {}, o.size ? { style: { fontSize: o.size + "px", fontWeight: o.weight || 700 } } : {}));
  const P = (s, cls, ...kids) => s.h("p", { class: cls }, ...kids);
  const B = (s, txt) => s.h("b", null, txt);

  /** small property icon (48×48) */
  function icon(s, name, size = 44) {
    const v = s.svg(48, 48, { width: size, height: size, style: { flex: "none" } });
    const e = (t, a) => v.append(s.el(t, a));
    switch (name) {
      case "farbe": e("circle", { cx: 16, cy: 18, r: 11, fill: "#dc3b2a" }); e("circle", { cx: 32, cy: 18, r: 11, fill: "#ffd94a", opacity: .9 }); e("circle", { cx: 24, cy: 32, r: 11, fill: "#1d5bd0", opacity: .85 }); break;
      case "geruch": for (let i = 0; i < 3; i++) e("path", { d: `M${12 + i * 12},42 q-6,-7 0,-14 q6,-7 0,-14`, fill: "none", stroke: "#7b4fd6", "stroke-width": 3.5, "stroke-linecap": "round" }); break;
      case "glanz": e("path", { d: "M24,4 L28,20 L44,24 L28,28 L24,44 L20,28 L4,24 L20,20 Z", fill: "#ffd94a", stroke: "#c7862a", "stroke-width": 2 }); break;
      case "haerte": e("rect", { x: 4, y: 30, width: 40, height: 14, rx: 3, fill: "#f4efe1", stroke: "#9a8a6a", "stroke-width": 2 }); e("path", { d: "M10,33 l6,3 l6,-3 l6,3 l6,-3", fill: "none", stroke: "#8a5a2b", "stroke-width": 2 }); e("path", { d: "M36,4 L40,8 L22,30 L20,28 Z", fill: "#5d6678" }); break;
      case "verform": e("path", { d: "M6,36 Q24,4 42,36", fill: "none", stroke: "#ee7a1a", "stroke-width": 8, "stroke-linecap": "round" }); break;
      case "strom": e("path", { d: "M28,2 L10,27 L22,27 L18,46 L38,18 L26,18 Z", fill: "#ffd94a", stroke: "#c7862a", "stroke-width": 2 }); break;
      case "waerme": e("rect", { x: 19, y: 4, width: 10, height: 30, rx: 5, fill: "#fff", stroke: "#5d6678", "stroke-width": 2.5 }); e("circle", { cx: 24, cy: 37, r: 8, fill: "#dc3b2a" }); e("rect", { x: 22, y: 14, width: 4, height: 22, fill: "#dc3b2a" }); break;
      case "magnet": e("path", { d: "M12,6 V24 A12,12 0 0 0 36,24 V6", fill: "none", stroke: "#dc3b2a", "stroke-width": 9 }); e("rect", { x: 7.5, y: 2, width: 9, height: 8, fill: "#c8d3de" }); e("rect", { x: 31.5, y: 2, width: 9, height: 8, fill: "#c8d3de" }); break;
      case "loesen": e("path", { d: "M8,8 V40 a4,4 0 0 0 4,4 H36 a4,4 0 0 0 4,-4 V8", fill: "#dbeafe", stroke: "#1d5bd0", "stroke-width": 2.5 }); [[16, 34], [24, 28], [31, 36], [20, 20]].forEach(([x, y]) => e("circle", { cx: x, cy: y, r: 2.6, fill: "#fff", stroke: "#1d5bd0", "stroke-width": 1.2 })); break;
      case "brenn": e("path", { d: "M24,4 C34,16 40,24 36,34 C33,42 15,42 12,34 C9,26 16,22 18,14 C20,20 22,22 24,22 C26,16 24,10 24,4 Z", fill: "#ee7a1a" }); e("path", { d: "M24,24 C30,30 30,38 24,40 C18,38 19,31 24,24 Z", fill: "#ffd94a" }); break;
      case "dichte": e("rect", { x: 2, y: 18, width: 44, height: 28, fill: "#bfdbfe" }); e("rect", { x: 7, y: 12, width: 12, height: 12, fill: "#c98b4a" }); e("rect", { x: 29, y: 32, width: 12, height: 12, fill: "#5d6678" }); break;
    }
    return v;
  }

  /** beaker outline path (open top) */
  const beakerPath = (x, y, w, h) => `M${x},${y} V${y + h - 12} a12,12 0 0 0 12,12 H${x + w - 12} a12,12 0 0 0 12,-12 V${y}`;

  Deck.unit({
    id: "u3", num: 3, title: "Stoffe und ihre Eigenschaften", color: UC, soft: "#fde9dc",
    subtitle: "Jeder Stoff hat einen Steckbrief",
    blurb: "Körper und Stoffe, Steckbrief, Aggregatzustände, Teilchenmodell.",
    goals: [
      "Körper und Stoff unterscheiden",
      "Stoffe mit Versuchen untersuchen (Steckbrief)",
      "fest, flüssig, gasförmig und alle Übergänge",
      "Schmelz- und Siedetemperatur als Fingerabdruck",
      "das Teilchenmodell: Ausdehnung und Diffusion",
    ],
    icon(svg, el) {
      svg.append(el("rect", { x: 10, y: 14, width: 50, height: 46, rx: 6, fill: "#fde9dc", stroke: UC, "stroke-width": 3 }));
      [[22, 28], [35, 28], [48, 28], [22, 42], [35, 42], [48, 42]].forEach(([x, y]) => svg.append(el("circle", { cx: x, cy: y, r: 5.5, fill: UC })));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Körper oder Stoff?",
        say: "Drei Löffel – derselbe Körper, aber aus verschiedenen Stoffen.",
        build(s) {
          const svg = s.svg(500, 560);
          svg.append(T(s, 250, 40, "drei Löffel", { cls: "hlbl" }));
          const kinds = [["Metall", "#b8c0c9", "#5d6678"], ["Holz", "#d9a066", "#8a5a2b"], ["Kunststoff", "#e2463a", "#a8261c"]];
          const spoons = kinds.map(([name, fill, stroke], i) => {
            const cx = 90 + i * 160;
            const g = s.el("g", { class: "later" });
            g.append(
              s.el("rect", { x: cx - 11, y: 200, width: 22, height: 250, rx: 11, fill, stroke, "stroke-width": 4 }),
              s.el("ellipse", { cx, cy: 150, rx: 50, ry: 72, fill, stroke, "stroke-width": 4 }),
              s.el("ellipse", { cx: cx - 12, cy: 128, rx: 14, ry: 30, fill: "#fff", opacity: i === 1 ? .12 : .45 }));
            if (i === 1) [0, 1, 2].forEach(k => g.append(s.el("path", { d: `M${cx - 4 + k * 4},230 q4,100 0,200`, stroke: "#8a5a2b", "stroke-width": 1.5, fill: "none", opacity: .6 })));
            g.append(T(s, cx, 500, name, { size: 24 }));
            return g;
          });
          svg.append(...spoons);

          const defK = s.h("div", { class: "card later" }, s.h("span", { class: "exlabel" }, "Körper"), P(s, "t", "der ", B(s, "Gegenstand"), " mit seiner Form: Löffel, Becher, Ball"));
          const defS = s.h("div", { class: "card later" }, s.h("span", { class: "exlabel" }, "Stoff"), P(s, "t", "das ", B(s, "Material"), ", aus dem der Körper besteht: Metall, Holz, Kunststoff"));
          const ex = s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, "Noch mehr Beispiele"),
            P(s, "small", B(s, "Becher: "), "Glas · Porzellan · Papier"),
            P(s, "small", B(s, "Ball: "), "Leder · Gummi · Kunststoff"),
            P(s, "small", B(s, "Fahrradrahmen: "), "Stahl · Aluminium · Carbon"));
          const right = s.h("div", { class: "stack" }, P(s, "big a-up", "Gleicher Körper –", s.h("br"), s.h("span", { style: { color: UC } }, "verschiedene Stoffe")), defK, defS, ex);
          s.add(s.h("div", { class: "cols", style: { alignItems: "center", height: "100%", gridTemplateColumns: "500px 1fr" } }, svg, right));
          s.show(svg, "fade"); s.sfx.whoosh();
          s.step(async () => { for (let i = 0; i < 3; i++) { s.sfx.count(i * 2); await s.show(spoons[i], "bounce"); } s.say("Metall, Holz und Kunststoff."); });
          s.step(async () => { s.sfx.pop(); await s.show(defK, "left"); s.sfx.pop(); await s.show(defS, "left"); });
          s.step(async () => { s.sfx.ding(); await s.show(ex, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Der Steckbrief eines Stoffes",
        say: "Jeder Stoff hat typische Eigenschaften. Zusammen sind sie sein Steckbrief.",
        build(s) {
          const intro = P(s, "t a-up", "Jeder Stoff hat typische ", s.h("span", { class: "hl" }, "Eigenschaften"), ". Zusammen ergeben sie seinen ", B(s, "Steckbrief"), ".");
          const sense = [["farbe", "Farbe", "Kupfer ist rotbraun, Schwefel gelb, Zucker weiß."], ["geruch", "Geruch", "Essig riecht stechend. Nie direkt schnuppern – zufächeln!"], ["glanz", "Glanz", "Metalle glänzen. Holz und Papier sind matt."]];
          const senseCards = sense.map(([ic, n, t]) => s.h("div", { class: "card later", style: { padding: "16px 18px" } },
            s.h("div", { class: "row", style: { gap: "10px", flexWrap: "nowrap" } }, icon(s, ic, 52), s.h("b", { class: "h2", style: { fontSize: "26px" } }, n)),
            P(s, "small", t)));
          const tests = [["haerte", "Härte"], ["verform", "Verformbarkeit"], ["strom", "Strom leiten"], ["waerme", "Wärme leiten"], ["magnet", "Magnetismus"], ["loesen", "Löslichkeit"], ["brenn", "Brennbarkeit"], ["dichte", "Dichte"]];
          const testTiles = tests.map(([ic, n]) => s.h("div", { class: "card soft later", style: { padding: "16px 14px", display: "flex", alignItems: "center", gap: "12px" } }, icon(s, ic, 52), s.h("b", { style: { fontSize: "21px" } }, n)));
          const lab1 = s.h("span", { class: "exlabel later", style: { margin: 0 } }, "Mit den Sinnen prüfen");
          const lab2 = s.h("span", { class: "exlabel later", style: { margin: 0 } }, "Mit Versuchen prüfen");
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"),
            P(s, "small", "Zucker und Salz sehen fast gleich aus: weiße Körnchen. Probieren ist im Labor verboten! Erst der Steckbrief verrät, welcher Stoff es ist."));
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%", justifyContent: "center" } }, intro, lab1, s.h("div", { class: "cols3", style: { gap: "16px" } }, senseCards), lab2, s.h("div", { class: "cols4", style: { gap: "12px" } }, testTiles), life));
          s.sfx.whoosh();
          s.step(async () => { s.show(lab1, "fade"); for (let i = 0; i < 3; i++) { s.sfx.count(i); await s.show(senseCards[i], "pop"); } s.say("Farbe, Geruch und Glanz prüfst du mit Augen und Nase."); });
          s.step(async () => { s.show(lab2, "fade"); for (let i = 0; i < testTiles.length; i++) { s.sfx.count(i + 3); s.show(testTiles[i], "zoom"); await s.wait(140); } s.say("Alles andere findest du mit Versuchen heraus."); });
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Härte und Verformbarkeit",
        say: "Mit der Ritzprobe findest du heraus, welcher Stoff härter ist.",
        build(s) {
          // Ritzprobe
          const rz = s.svg(480, 190);
          rz.append(s.el("rect", { x: 40, y: 112, width: 400, height: 56, rx: 8, fill: "#f6f0df", stroke: "#b8a77f", "stroke-width": 3 }));
          const scratch = s.el("path", { d: "M70,124 l20,6 l20,-6 l20,6 l20,-6 l20,6 l20,-6 l20,6 l20,-6 l20,6 l20,-6 l20,6 l20,-6 l20,6 l20,-6 l20,6", fill: "none", stroke: "#8a5a2b", "stroke-width": 3, "stroke-linecap": "round", "stroke-dasharray": 400, "stroke-dashoffset": 400 });
          const nail = s.el("g", { transform: "translate(70,124) rotate(28)" },
            s.el("polygon", { points: "-5,-96 5,-96 1,0 -1,0", fill: "#6b7280" }),
            s.el("rect", { x: -14, y: -104, width: 28, height: 9, rx: 3, fill: "#4b5563" }));
          rz.append(scratch, nail, T(s, 240, 188, "Kerzenwachs", { attrs: { dy: -2 } }), T(s, 300, 40, "Eisennagel", { anchor: "start" }));
          const rzTxt = P(s, "small later", "Der Nagel ritzt das Wachs. ", B(s, "Wer ritzt, ist härter."));
          const c1 = s.h("div", { class: "card", style: { padding: "12px 16px" } }, s.h("span", { class: "exlabel" }, "Die Ritzprobe"), rz, rzTxt);

          // Mohs scale
          const mo = s.svg(500, 210);
          const X = v => 40 + (v - 1) * (420 / 9);
          const grad = s.el("linearGradient", { id: "mohsg" }, s.el("stop", { offset: 0, "stop-color": "#fde9dc" }), s.el("stop", { offset: 1, "stop-color": UC }));
          mo.append(s.el("defs", null, grad));
          const bar = s.el("rect", { x: 40, y: 118, width: 420, height: 16, rx: 8, fill: "url(#mohsg)", class: "later" });
          const ticks = s.el("g", { class: "later" });
          for (let v = 1; v <= 10; v++) ticks.append(T(s, X(v), 162, String(v), { size: 19, weight: 600 }));
          ticks.append(T(s, 40, 198, "← weich", { anchor: "start", fill: "#5d6678" }), T(s, 460, 198, "hart →", { anchor: "end", fill: "#5d6678" }));
          const marks = [[1, "Talk", 86, "start", 0], [2.5, "Fingernagel ≈ 2,5", 50, "start", 0], [5.5, "Glas ≈ 5,5", 86, "start", 0], [10, "Diamant", 86, "end", 0]].map(([v, n, y, a, dx]) => {
            const g = s.el("g", { class: "later" });
            const tx = a === "start" ? X(v) - 8 : a === "end" ? X(v) + 14 : X(v);
            g.append(s.el("line", { x1: X(v), y1: y + 6, x2: X(v), y2: 114, stroke: "#1b2740", "stroke-width": 2 }), s.el("circle", { cx: X(v), cy: 126, r: 7, fill: "#1b2740" }), T(s, tx, y, n, { anchor: a, size: 20 }));
            return g;
          });
          mo.append(bar, ticks, ...marks);
          const c2 = s.h("div", { class: "card later", style: { padding: "12px 16px" } }, s.h("span", { class: "exlabel" }, "Härteskala nach Mohs (1 bis 10)"), mo);

          // Verformbarkeit
          const mk = (title, sub, ex) => { const v = s.svg(280, 100, { width: "100%", height: 150 }); const card = s.h("div", { class: "card soft later", style: { padding: "10px 14px" } }, s.h("b", { style: { fontSize: "22px" } }, title), s.h("span", { style: { fontSize: "19px", color: "var(--pencil)" } }, " – " + sub), v, P(s, "small", ex)); return { v, card }; };
          const k1 = mk("verformbar", "bleibt so", "Knete, Alufolie, Kupferdraht");
          const knete = s.el("ellipse", { cx: 140, cy: 60, rx: 40, ry: 38, fill: "#3fae6a", stroke: "#1f7a45", "stroke-width": 3 });
          k1.v.append(s.el("line", { x1: 40, y1: 98, x2: 240, y2: 98, stroke: "#5d6678", "stroke-width": 3 }), knete);
          const k2 = mk("elastisch", "federt zurück", "Gummiband, Flummi, Trampolin");
          const band = s.el("rect", { x: 100, y: 40, width: 80, height: 22, rx: 11, fill: "#e2463a" });
          k2.v.append(band);
          const k3 = mk("spröde", "zerbricht", "Glas, Porzellan, Salzkristall");
          const shards = [["70,20 140,20 128,55 70,80", -1], ["140,20 210,20 210,50 128,55", 1], ["70,80 128,55 210,50 210,80", 0]].map(([pts, d]) => { const p = s.el("polygon", { points: pts, fill: "#cfe8f3", stroke: "#5aa0bf", "stroke-width": 2.5 }); p.dir = d; return p; });
          k3.v.append(...shards);
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "16px", justifyContent: "center" } },
            s.h("div", { class: "cols", style: { gap: "16px", gridTemplateColumns: "1fr 1fr" } }, c1, c2),
            s.h("div", { class: "cols3", style: { gap: "16px" } }, k1.card, k2.card, k3.card)));
          s.sfx.pop();
          s.step(async () => {
            s.sfx.scribble();
            await s.tween({ from: 0, to: 1, dur: 1600, ease: "inOut", update: t => { nail.setAttribute("transform", `translate(${70 + 320 * t},${124 + (Math.round(t * 16) % 2 ? 6 : 0)}) rotate(28)`); scratch.setAttribute("stroke-dashoffset", 400 * (1 - t)); } });
            s.sfx.ding(); await s.show(rzTxt, "up");
          });
          s.step(async () => {
            s.show(c2, "fade"); s.sfx.whoosh(); await s.show(bar, "fade"); await s.show(ticks, "fade");
            for (let i = 0; i < marks.length; i++) { s.sfx.count(i * 2); await s.show(marks[i], "pop"); }
            s.say("Talk ist am weichsten, Diamant am härtesten.");
          });
          s.step(async () => {
            s.show(k1.card, "up"); s.sfx.boing();
            await s.tween({ from: 0, to: 1, dur: 800, ease: "out", update: t => { knete.setAttribute("rx", 40 + 50 * t); knete.setAttribute("ry", 38 - 20 * t); knete.setAttribute("cy", 60 + 20 * t); } });
            s.show(k2.card, "up"); s.sfx.boing();
            await s.tween({ from: 0, to: 1, dur: 500, ease: "out", update: t => { band.setAttribute("x", 100 - 60 * t); band.setAttribute("width", 80 + 120 * t); band.setAttribute("height", 22 - 8 * t); band.setAttribute("y", 40 + 4 * t); } });
            await s.tween({ from: 1, to: 0, dur: 900, ease: "elastic", update: t => { band.setAttribute("x", 100 - 60 * t); band.setAttribute("width", Math.max(20, 80 + 120 * t)); band.setAttribute("height", 22 - 8 * t); band.setAttribute("y", 40 + 4 * t); } });
            s.show(k3.card, "up"); await s.wait(300); s.sound("glas-bricht", { vol: .6 });
            await s.tween({ from: 0, to: 1, dur: 600, ease: "out", update: t => shards.forEach((p, i) => p.setAttribute("transform", `translate(${p.dir * 14 * t},${(i === 2 ? 8 : -2) * t}) rotate(${p.dir * 8 * t} 140 50)`)) });
          });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Leitet der Stoff Strom?",
        say: "Wir bauen einen Stromkreis mit Lampe. Leuchtet sie, leitet der Stoff den Strom.",
        build(s) {
          const svg = s.svg(520, 590);
          const wire = "M80,230 V90 H440 V420 H340 M180,420 H80 V360";
          svg.append(s.el("path", { d: wire, fill: "none", stroke: "#1b2740", "stroke-width": 6, "stroke-linejoin": "round" }));
          // battery
          svg.append(s.el("rect", { x: 45, y: 230, width: 70, height: 130, rx: 8, fill: "#1d5bd0" }), s.el("rect", { x: 45, y: 230, width: 70, height: 46, rx: 8, fill: "#dc3b2a" }),
            s.el("rect", { x: 66, y: 220, width: 28, height: 12, rx: 3, fill: "#5d6678" }), T(s, 80, 263, "+", { fill: "#fff", size: 28 }), T(s, 80, 335, "−", { fill: "#fff", size: 30 }), T(s, 130, 300, "Batterie", { anchor: "start" }));
          // lamp
          const glow = s.el("circle", { cx: 260, cy: 90, r: 72, fill: "#ffd94a", opacity: 0 });
          const bulb = s.el("circle", { cx: 260, cy: 90, r: 34, fill: "#fffbe6", stroke: "#1b2740", "stroke-width": 4 });
          svg.append(glow, bulb, s.el("path", { d: "M246,100 l5,-18 l5,14 l5,-14 l5,18", fill: "none", stroke: "#8a5a2b", "stroke-width": 3 }), T(s, 260, 190, "Lampe"));
          // clips
          svg.append(s.el("rect", { x: 165, y: 405, width: 22, height: 30, rx: 4, fill: "#5d6678" }), s.el("rect", { x: 333, y: 405, width: 22, height: 30, rx: 4, fill: "#5d6678" }), T(s, 260, 475, "Prüfstrecke", { fill: "#5d6678" }));
          const objLayer = s.el("g"); svg.append(objLayer);
          const verdict = T(s, 260, 545, "", { size: 30 }); svg.append(verdict);
          // electrons
          const path = s.el("path", { d: "M80,360 V420 H180 L340,420 H440 V90 H80 V230", fill: "none", stroke: "none" }); svg.append(path);
          const dots = Array.from({ length: 16 }, () => { const c = s.el("circle", { r: 5, fill: "#ffd94a", stroke: "#c7862a", "stroke-width": 1.5, opacity: 0 }); svg.append(c); return c; });
          let on = false, len = 0;
          try { len = path.getTotalLength(); } catch (e) {}
          s.loop(t => {
            dots.forEach((d, i) => {
              d.setAttribute("opacity", on ? 1 : 0);
              if (on && len) { const p = path.getPointAtLength(((t * 90 + i * len / dots.length) % len)); d.setAttribute("cx", p.x); d.setAttribute("cy", p.y); }
            });
          });
          const mats = [["Eisennagel", "#6b7280", true], ["Kupferdraht", "#c26a3a", true], ["Bleistiftmine", "#3b3b3b", true], ["Holzstab", "#d9a066", false], ["Kunststoff", "#e2463a", false], ["Glasstab", "#bfe3f0", false]];
          let busy = false;
          const test = async ([name, col, cond], btn) => {
            if (busy) return; busy = true;
            buttons.forEach(b => b.classList.toggle("solid", b === btn));
            objLayer.innerHTML = ""; on = false; glow.setAttribute("opacity", 0); bulb.setAttribute("fill", "#fffbe6"); verdict.textContent = "";
            const g = s.el("g"); g.append(s.el("rect", { x: 182, y: 410, width: 156, height: 20, rx: 10, fill: col, stroke: "#1b2740", "stroke-width": 2 })); objLayer.append(g);
            s.sfx.whoosh();
            await s.tween({ from: 120, to: 0, dur: 500, ease: "back", update: v => g.setAttribute("transform", `translate(0,${v})`) });
            s.sfx.snap(); await s.wait(250);
            if (cond) { on = true; glow.setAttribute("opacity", .6); bulb.setAttribute("fill", "#fff4a8"); verdict.textContent = name + ": leitet!"; verdict.setAttribute("fill", "#138a5a"); s.sfx.success(); }
            else { verdict.textContent = name + ": leitet nicht"; verdict.setAttribute("fill", "#dc3b2a"); s.sfx.error(); }
            busy = false;
          };
          const buttons = mats.map(m => { const b = s.h("button", { class: "btn", onclick: () => test(m, b) }, m[0]); return b; });
          const grid = s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } }, buttons);
          const merk = s.h("div", { class: "merk later" }, B(s, "Metalle"), " und ", B(s, "Graphit"), " leiten Strom. Holz, Kunststoff und Glas nicht – sie ", B(s, "isolieren"), ".");
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"),
            P(s, "small", "Kabel: innen Kupfer, außen Kunststoff. Stecker: Metallstifte, Griff aus Kunststoff. Schraubenzieher für Elektriker: Kunststoffgriff."),
            P(s, "small", B(s, "Nur mit einer Batterie testen – nie an der Steckdose!")));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "520px 1fr", alignItems: "center", height: "100%" } }, svg,
            s.h("div", { class: "stack", style: { gap: "14px" } }, P(s, "t", "Tippe auf einen Stoff:"), grid, merk, life)));
          s.sfx.pop();
          s.step(async () => { await test(mats[1], buttons[1]); s.say("Der Kupferdraht leitet. Die Lampe leuchtet."); });
          s.step(async () => { await test(mats[3], buttons[3]); s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Wärme leiten",
        say: "Ein Metalllöffel im heißen Tee wird schnell heiß. Ein Holzlöffel bleibt kühl.",
        build(s) {
          const svg = s.svg(500, 560);
          const defs = s.el("defs");
          const mkGrad = (id, cold) => { const st = s.el("stop", { offset: 0.05, "stop-color": "#dc3b2a" }); const st2 = s.el("stop", { offset: 0.05, "stop-color": cold }); defs.append(s.el("linearGradient", { id, gradientUnits: "userSpaceOnUse", x1: 0, y1: 360, x2: 0, y2: 80 }, s.el("stop", { offset: 0, "stop-color": "#dc3b2a" }), st, st2, s.el("stop", { offset: 1, "stop-color": cold }))); return [st, st2]; };
          const gm = mkGrad("hotm", "#b8c0c9"), gw = mkGrad("hotw", "#d9a066");
          svg.append(defs);
          svg.append(s.el("rect", { x: 170, y: 80, width: 22, height: 300, rx: 11, fill: "url(#hotm)", stroke: "#5d6678", "stroke-width": 3, transform: "rotate(-10 181 380)" }));
          svg.append(s.el("rect", { x: 300, y: 80, width: 26, height: 300, rx: 13, fill: "url(#hotw)", stroke: "#8a5a2b", "stroke-width": 3, transform: "rotate(10 313 380)" }));
          // mug
          svg.append(s.el("path", { d: "M100,250 V450 a30,30 0 0 0 30,30 H370 a30,30 0 0 0 30,-30 V250 Z", fill: "#fff", stroke: "#1b2740", "stroke-width": 5 }),
            s.el("path", { d: "M400,300 a50,50 0 0 1 0,110", fill: "none", stroke: "#1b2740", "stroke-width": 12 }),
            s.el("ellipse", { cx: 250, cy: 262, rx: 146, ry: 16, fill: "#b45309", opacity: .85 }),
            T(s, 250, 380, "heißer Tee", { fill: "#b45309", size: 26 }));
          const steam = [180, 250, 320].map(x => { const p = s.el("path", { d: `M${x},235 q-12,-20 0,-40 q12,-20 0,-40`, fill: "none", stroke: "#94a3b8", "stroke-width": 4, "stroke-linecap": "round", opacity: .7 }); svg.append(p); return p; });
          s.loop(t => steam.forEach((p, i) => p.setAttribute("transform", `translate(${Math.sin(t * 2 + i) * 5},${-((t * 20 + i * 12) % 24)})`)));
          const lm = T(s, 150, 50, "Metall: heiß!", { fill: "#dc3b2a", size: 26, attrs: { class: "lbl later" } });
          const lw = T(s, 365, 50, "Holz: kühl", { fill: "#1d5bd0", size: 26, attrs: { class: "lbl later" } });
          svg.append(lm, lw, T(s, 250, 530, "Metalllöffel und Holzlöffel", { fill: "#5d6678" }));
          const heat = async () => {
            s.hide([lm, lw]); s.sfx.whoosh();
            await s.tween({ from: 0.05, to: 1, dur: 3000, ease: "inOut", update: v => { gm.forEach(x => x.setAttribute("offset", v)); gw.forEach(x => x.setAttribute("offset", 0.05 + v * 0.12)); } });
            s.sfx.ding(); s.show(lm, "pop"); await s.show(lw, "pop", 200);
          };
          const merk = s.h("div", { class: "merk later" }, B(s, "Metalle"), " leiten Wärme gut. Holz, Kunststoff und Luft leiten Wärme schlecht.");
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"),
            P(s, "small", "• Kochtopf aus Metall – Griffe aus Kunststoff oder Holz"),
            P(s, "small", "• Bratpfanne aus Metall: die Hitze kommt schnell zum Essen"),
            P(s, "small", "• Im Winter fühlt sich ein Metallgeländer kälter an als eine Holzbank – Metall leitet die Wärme deiner Hand schnell weg."));
          const again = s.h("button", { class: "btn", onclick: () => { gm.forEach(x => x.setAttribute("offset", .05)); gw.forEach(x => x.setAttribute("offset", .05)); heat(); } }, "Nochmal erhitzen");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "500px 1fr", alignItems: "center", height: "100%" } }, svg,
            s.h("div", { class: "stack" }, P(s, "t", "Beide Löffel stehen im gleichen heißen Tee. Wohin wandert die Wärme?"), s.h("div", { class: "row" }, again), merk, life)));
          s.sfx.pop();
          s.step(async () => { await heat(); s.say("Die Wärme wandert durch das Metall bis zum Griff."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Magnetisch oder nicht?",
        say: "Tippe auf einen Gegenstand. Wird er vom Magneten angezogen?",
        build(s) {
          const svg = s.svg(540, 600);
          svg.append(s.el("path", { d: "M190,170 V100 A80,80 0 0 1 350,100 V170", fill: "none", stroke: "#dc3b2a", "stroke-width": 46 }),
            s.el("rect", { x: 167, y: 160, width: 46, height: 30, fill: "#b8c0c9" }), s.el("rect", { x: 327, y: 160, width: 46, height: 30, fill: "#b8c0c9" }),
            T(s, 190, 110, "N", { fill: "#fff", size: 24 }), T(s, 350, 110, "S", { fill: "#fff", size: 24 }));
          const lines = s.el("g", { opacity: 0 });
          [-1, 0, 1].forEach(k => lines.append(s.el("path", { d: `M213,${190 + k * 4} Q270,${232 + k * 18} 327,${190 + k * 4}`, fill: "none", stroke: "#7b4fd6", "stroke-width": 2, "stroke-dasharray": "6 6" })));
          svg.append(lines);
          const verdict = T(s, 270, 300, "", { size: 26 }); svg.append(verdict);
          const draw = {
            "Büroklammer": g => g.append(s.el("path", { d: "M-10,22 V-18 a10,10 0 0 1 20,0 V18 a6,6 0 0 1 -12,0 V-10", fill: "none", stroke: "#6b7280", "stroke-width": 4, "stroke-linecap": "round" })),
            "Eisennagel": g => g.append(s.el("polygon", { points: "-4,-26 4,-26 1,30 -1,30", fill: "#6b7280" }), s.el("rect", { x: -12, y: -32, width: 24, height: 7, rx: 3, fill: "#4b5563" })),
            "1-Cent-Münze": g => g.append(s.el("circle", { r: 26, fill: "#c26a3a", stroke: "#8a4520", "stroke-width": 3 }), T(s, 0, 8, "1", { fill: "#fff", size: 24 })),
            "10-Cent-Münze": g => g.append(s.el("circle", { r: 30, fill: "#e0b53a", stroke: "#a07c16", "stroke-width": 3 }), T(s, 0, 8, "10", { fill: "#fff", size: 22 })),
            "Alufolie": g => g.append(s.el("polygon", { points: "-28,-14 -10,-26 12,-20 28,-6 22,16 4,26 -18,20 -30,4", fill: "#d1d5db", stroke: "#9ca3af", "stroke-width": 3 })),
            "Kupferdraht": g => g.append(s.el("path", { d: "M-30,0 c6,-24 14,-24 20,0 s14,24 20,0 s14,-24 20,0 s14,24 20,0", fill: "none", stroke: "#c26a3a", "stroke-width": 5 })),
          };
          const items = [["Büroklammer", true], ["Eisennagel", true], ["1-Cent-Münze", true], ["10-Cent-Münze", false], ["Alufolie", false], ["Kupferdraht", false]];
          let stuck = null, busy = false;
          const objs = items.map(([name, mag], i) => {
            const hx = 90 + (i % 3) * 180, hy = 380 + Math.floor(i / 3) * 140;
            const g = s.el("g", { transform: `translate(${hx},${hy})` }); draw[name](g);
            const hit = s.el("g", { style: { cursor: "pointer" } });
            hit.append(s.el("rect", { x: hx - 85, y: hy - 45, width: 170, height: 130, fill: "transparent" }), g, T(s, hx, hy + 66, name, { size: 20 }));
            svg.append(hit);
            const o = { name, mag, g, hx, hy, x: hx, y: hy };
            hit.addEventListener("click", () => go(o));
            return o;
          });
          const place = (o, x, y) => { o.x = x; o.y = y; o.g.setAttribute("transform", `translate(${x},${y})`); };
          const go = async o => {
            if (busy) return; busy = true;
            if (stuck && stuck !== o) { const st = stuck; stuck = null; lines.setAttribute("opacity", 0); const sx = st.x, sy = st.y; s.sfx.swoosh(); await s.tween({ from: 0, to: 1, dur: 350, update: t => place(st, sx + (st.hx - sx) * t, sy + (st.hy - sy) * t) }); }
            verdict.textContent = "";
            if (stuck === o) { busy = false; return; }
            const x0 = o.x, y0 = o.y;
            if (o.mag) {
              await s.tween({ from: 0, to: 1, dur: 450, ease: "in", update: t => place(o, x0 + (270 - x0) * t, y0 + (222 - y0) * t) });
              s.sound("magnet-klick"); stuck = o; lines.setAttribute("opacity", 1);
              verdict.textContent = "wird angezogen!"; verdict.setAttribute("fill", "#138a5a");
            } else {
              await s.tween({ from: 0, to: 1, dur: 300, ease: "out", update: t => place(o, x0 + (270 - x0) * t * .25, y0 - 40 * t) });
              s.sfx.boing();
              await s.tween({ from: 1, to: 0, dur: 450, ease: "bounce", update: t => place(o, x0 + (270 - x0) * t * .25, y0 - 40 * t) });
              verdict.textContent = "nichts passiert"; verdict.setAttribute("fill", "#dc3b2a");
            }
            busy = false;
          };
          const merk = s.h("div", { class: "merk later" }, "Magnete ziehen nur ", B(s, "Eisen"), ", ", B(s, "Nickel"), " und ", B(s, "Cobalt"), " an – und Stoffe, die diese Metalle enthalten (z. B. Stahl).");
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"),
            P(s, "small", "• Kühlschrankmagnete halten an der Stahltür."),
            P(s, "small", "• 1-, 2- und 5-Cent-Münzen: Stahl mit dünner Kupferschicht – darum magnetisch!"),
            P(s, "small", "• In der Müllsortierung holt ein großer Magnet Dosen aus Stahlblech heraus."));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "540px 1fr", alignItems: "center", height: "100%" } }, svg,
            s.h("div", { class: "stack" }, P(s, "t", "Tippe auf einen Gegenstand und schau, was der Magnet macht."), merk, life)));
          s.sfx.pop();
          s.step(async () => { await go(objs[1]); s.say("Der Eisennagel springt zum Magneten."); });
          s.step(async () => { await go(objs[4]); s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { await go(objs[2]); await s.show(life, "up"); s.say("Überraschung: Die Ein-Cent-Münze ist magnetisch, denn sie hat einen Kern aus Stahl."); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Löst es sich? Brennt es?",
        say: "Zucker löst sich in Wasser, Sand nicht. Und manche Stoffe brennen, andere nicht.",
        build(s) {
          const sv = s.svg(480, 270, { width: "100%", height: 330 });
          const bx = [70, 290];
          bx.forEach((x, i) => {
            sv.append(s.el("rect", { x: x + 3, y: 90, width: 114, height: 145, fill: "#dbeafe" }), s.el("path", { d: beakerPath(x, 40, 120, 200), fill: "none", stroke: "#1b2740", "stroke-width": 4 }));
            sv.append(T(s, x + 60, 265, i ? "Sand" : "Zucker"));
          });
          const sugar = [], sand = [];
          for (let i = 0; i < 18; i++) {
            const a = s.el("rect", { x: 85 + (i % 6) * 15 + (i % 2) * 3, y: -20, width: 8, height: 8, fill: "#fff", stroke: "#94a3b8", "stroke-width": 1.5 }); a.ty = 210 + Math.floor(i / 6) * 9; sugar.push(a);
            const b = s.el("circle", { cx: 310 + (i % 6) * 15 + (i % 3), cy: -20, r: 5, fill: "#d4a35a", stroke: "#8a5a2b", "stroke-width": 1 }); b.ty = 216 + Math.floor(i / 6) * 9; sand.push(b);
          }
          sv.append(...sugar, ...sand);
          const vL = T(s, 130, 26, "löst sich auf", { fill: "#138a5a", size: 22, attrs: { class: "lbl later" } });
          const vR = T(s, 350, 26, "bleibt am Boden", { fill: "#dc3b2a", size: 22, attrs: { class: "lbl later" } });
          sv.append(vL, vR);
          const dissolve = async () => {
            s.hide([vL, vR]); sugar.forEach(a => a.setAttribute("opacity", 1));
            s.sfx.whoosh();
            await s.tween({ from: 0, to: 1, dur: 800, ease: "bounce", update: t => { sugar.forEach(a => a.setAttribute("y", -20 + (a.ty + 20) * t)); sand.forEach(b => b.setAttribute("cy", -20 + (b.ty + 20) * t)); } });
            s.sound("umruehren", { vol: .6 });
            await s.tween({ from: 1, to: 0, dur: 1500, update: t => sugar.forEach((a, i) => { a.setAttribute("opacity", Math.max(0, Math.min(1, t * 1.6 - (i % 5) * .12))); a.setAttribute("x", 85 + (i % 6) * 15 + Math.sin((1 - t) * 12 + i) * 8); }) });
            s.sfx.ding(); s.show(vL, "pop"); await s.show(vR, "pop", 150);
          };
          const left = s.h("div", { class: "card", style: { padding: "12px 16px" } }, s.h("span", { class: "exlabel" }, "Löslichkeit in Wasser"), sv,
            P(s, "small later", B(s, "löslich: "), "Zucker im Tee, Salz im Nudelwasser, Honig in warmer Milch"),
            P(s, "small later", B(s, "nicht löslich: "), "Sand, Öl, Kerzenwachs"));
          const fl = (burns) => {
            const v = s.svg(110, 64, { width: 150, height: 88 });
            if (burns) { const f = s.el("path", { d: "M55,4 C70,20 76,32 70,46 C66,58 44,58 40,46 C35,34 44,28 47,16 C50,24 53,26 55,26 C58,18 55,10 55,4 Z", fill: "#ee7a1a" }); const f2 = s.el("path", { d: "M55,30 C63,38 63,50 55,54 C47,50 48,40 55,30 Z", fill: "#ffd94a" }); v.append(f, f2); v.flames = [f, f2]; }
            else v.append(s.el("path", { d: "M38,14 L72,48 M72,14 L38,48", stroke: "#dc3b2a", "stroke-width": 7, "stroke-linecap": "round" }));
            return v;
          };
          const burnItems = [["Papier", true], ["Holz", true], ["Kerzenwachs", true], ["Glas", false], ["Stein", false], ["Eisennagel", false]];
          const flames = [];
          const tiles = burnItems.map(([n, b]) => { const v = fl(b); if (v.flames) flames.push(...v.flames); return s.h("div", { class: "card soft later", style: { padding: "6px 8px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" } }, v, s.h("b", { style: { fontSize: "20px" } }, n), s.h("span", { style: { fontSize: "19px", color: b ? "var(--green)" : "var(--red)" } }, b ? "brennt" : "brennt nicht")); });
          s.loop(t => flames.forEach((f, i) => f.setAttribute("transform", `translate(55 58) scale(${1 + Math.sin(t * 9 + i) * .06},${1 + Math.sin(t * 7 + i * 2) * .1}) translate(-55 -58)`)));
          const right = s.h("div", { class: "card", style: { padding: "12px 16px" } }, s.h("span", { class: "exlabel" }, "Brennbarkeit"),
            s.h("div", { class: "cols3", style: { gap: "10px" } }, tiles),
            P(s, "small later", B(s, "Nur mit Erwachsenen testen!"), " Im Alltag: Kaminholz brennt, der Ofen aus Stein und Metall nicht."));
          s.add(s.h("div", { class: "cols", style: { gap: "20px", alignItems: "center", height: "100%" } }, left, right));
          s.sfx.pop();
          s.step(async () => { await dissolve(); s.say("Der Zucker verteilt sich unsichtbar im Wasser."); });
          s.step(async () => { s.sfx.pop(); const ps = left.querySelectorAll("p"); await s.show(ps[0], "up"); await s.show(ps[1], "up"); });
          s.step(async () => { s.sound("fire", { vol: .4, dur: 3 }); for (let i = 0; i < tiles.length; i++) { await s.show(tiles[i], "pop"); } await s.show(right.querySelector("p"), "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Dichte: schwimmt oder sinkt?",
        say: "Ein Stoff mit kleinerer Dichte als Wasser schwimmt. Ein Stoff mit größerer Dichte sinkt.",
        build(s) {
          const tank = s.svg(500, 340);
          tank.append(s.el("rect", { x: 30, y: 130, width: 440, height: 190, fill: "#bfdbfe" }), s.el("path", { d: "M30,40 V320 H470 V40", fill: "none", stroke: "#1b2740", "stroke-width": 5 }), s.el("line", { x1: 30, y1: 130, x2: 470, y2: 130, stroke: "#1d5bd0", "stroke-width": 3 }));
          // objects: [name, x, width, height, fill, density, label]
          const objs = [["Holz", 90, 70, 40, "#d9a066", .6], ["Wachs", 195, 60, 44, "#f6f0df", .9], ["Eis", 300, 50, 50, "#e0f2fe", .92], ["Eisen", 410, 70, 22, "#6b7280", 7.9]].map(([n, x, w, h, f, d]) => {
            const g = s.el("g", { class: "later" });
            g.append(s.el("rect", { x: x - w / 2, y: 0, width: w, height: h, rx: 6, fill: f, stroke: "#1b2740", "stroke-width": 2.5 }));
            tank.append(g, T(s, x, 30, n, { size: 22 }));
            const target = d < 1 ? 130 - h * (1 - d) : 320 - h - 3;
            return { g, target, h, d };
          });
          objs.forEach(o => o.g.setAttribute("transform", "translate(0,50)"));
          const ch = s.svg(540, 340);
          ch.append(T(s, 0, 24, "Dichte in g/cm³", { anchor: "start", fill: "#5d6678" }));
          const rows = [["Holz", .8, "0,5–0,8", "#138a5a"], ["Kerzenwachs", .9, "0,9", "#138a5a"], ["Eis", .92, "0,92", "#138a5a"], ["Wasser", 1, "1,0", "#1d5bd0"], ["Glas", 2.5, "2,5", "#dc3b2a"], ["Eisen", 7.9, "7,9", "#dc3b2a"]];
          const bars = rows.map(([n, v, lab, col], i) => {
            const y = 40 + i * 46;
            const r = s.el("rect", { x: 150, y, width: 0, height: 32, rx: 6, fill: col });
            const t = T(s, 160 + v * 42, y + 24, lab, { anchor: "start", size: 21, attrs: { class: "lbl later" } });
            ch.append(T(s, 140, y + 24, n, { anchor: "end" }), r, t);
            return { r, t, w: v * 42 };
          });
          ch.append(T(s, 0, 336, "grün: schwimmt   ·   rot: sinkt", { anchor: "start", fill: "#5d6678", size: 19, weight: 600 }));
          const merk = s.h("div", { class: "merk later" }, B(s, "Dichte"), " = Masse von 1 cm³ eines Stoffes. Kleiner als Wasser (1 g/cm³) → ", B(s, "schwimmt"), ". Größer → ", B(s, "sinkt"), ".");
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 250px", gap: "14px", alignItems: "center" } },
              P(s, "small", "Eisberge schwimmen – aber fast 9 von 10 Teilen sind unter Wasser. Schwimmkerzen treiben im Wasser. Baumstämme schwimmen auf dem Fluss."),
              s.photo("eisberg", { w: 250, h: 160, pos: "50% 60%" })));
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "24px", justifyContent: "center" } },
            s.h("div", { class: "cols", style: { gridTemplateColumns: "500px 1fr", gap: "24px" } }, tank, ch),
            s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 1.5fr", gap: "20px", alignItems: "center" } }, merk, life)));
          s.sfx.pop();
          s.step(async () => {
            for (const o of objs) {
              s.show(o.g, "fade"); s.sound("splash", { vol: .35, dur: 1.2 });
              await s.tween({ from: 50, to: o.target, dur: o.d > 1 ? 900 : 1100, ease: o.d > 1 ? "in" : "elastic", update: v => o.g.setAttribute("transform", `translate(0,${v})`) });
              if (o.d > 1) s.sfx.drum();
            }
            s.say("Holz, Wachs und Eis schwimmen. Eisen sinkt.");
          });
          s.step(async () => {
            for (let i = 0; i < bars.length; i++) { s.sfx.count(i); const b = bars[i]; await s.tween({ from: 0, to: b.w, dur: 380, ease: "out", update: v => b.r.setAttribute("width", v) }); s.show(b.t, "fade"); }
          });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Das Stoff-Labor",
        say: "Wähle einen Stoff. Dann laufen alle Tests und der Steckbrief füllt sich.",
        build(s) {
          const Y = "ja", N = "nein";
          const data = {
            "Eisen": { col: "#6b7280", r: [["Farbe", "grau"], ["Glanz", "glänzt metallisch"], ["Härte", "hart"], ["leitet Strom", Y], ["leitet Wärme", "gut"], ["magnetisch", Y], ["löst sich in Wasser", N], ["brennt (als Nagel)", N], ["im Wasser", "sinkt (7,9 g/cm³)"]] },
            "Kupfer": { col: "#c26a3a", r: [["Farbe", "rotbraun"], ["Glanz", "glänzt metallisch"], ["Härte", "weicher als Eisen, biegsam"], ["leitet Strom", "ja, sehr gut"], ["leitet Wärme", "sehr gut"], ["magnetisch", N], ["löst sich in Wasser", N], ["brennt (als Draht)", N], ["im Wasser", "sinkt (8,9 g/cm³)"]] },
            "Holz": { col: "#d9a066", r: [["Farbe", "hell- bis dunkelbraun"], ["Glanz", "matt"], ["Härte", "Nagel ritzt es"], ["leitet Strom", N], ["leitet Wärme", "schlecht"], ["magnetisch", N], ["löst sich in Wasser", N], ["brennt", Y], ["im Wasser", "schwimmt (0,5–0,8)"]] },
            "Glas": { col: "#bfe3f0", r: [["Farbe", "farblos, durchsichtig"], ["Glanz", "glänzt"], ["Härte", "hart, aber spröde"], ["leitet Strom", N], ["leitet Wärme", "schlecht"], ["magnetisch", N], ["löst sich in Wasser", N], ["brennt", N], ["im Wasser", "sinkt (2,5 g/cm³)"]] },
            "Kochsalz": { col: "#f8fafc", r: [["Farbe", "weiß"], ["Glanz", "Kristalle glitzern"], ["Härte", "spröde, zerbröselt"], ["leitet Strom", "nein (als Kristall)"], ["leitet Wärme", "schlecht"], ["magnetisch", N], ["löst sich in Wasser", Y], ["brennt", N], ["im Wasser", "sinkt und löst sich"]] },
            "Kerzenwachs": { col: "#fef3c7", r: [["Farbe", "weiß"], ["Glanz", "matt"], ["Härte", "weich, Fingernagel ritzt"], ["leitet Strom", N], ["leitet Wärme", "schlecht"], ["magnetisch", N], ["löst sich in Wasser", N], ["brennt", "ja (mit Docht)"], ["im Wasser", "schwimmt (0,9 g/cm³)"]] },
          };
          const names = Object.keys(data);
          const head = s.h("div", { class: "h2", style: { padding: "4px 0 8px" } }, "Steckbrief: –");
          const rowEls = data.Eisen.r.map(() => {
            const k = s.h("td", { style: { fontSize: "20px", fontWeight: 700, padding: "6px 12px", width: "210px" } });
            const v = s.h("td", { style: { fontSize: "20px", padding: "6px 12px" } });
            return { tr: s.h("tr", { style: { borderTop: "2px solid var(--line)" } }, k, v), k, v };
          });
          const table = s.h("table", { style: { borderCollapse: "collapse", width: "100%" } }, rowEls.map(r => r.tr));
          const photos = {
            "Eisen": s.photo("naegel", { w: 360, h: 190, pos: "50% 50%", caption: "Nägel aus Eisen (Stahl)" }),
            "Kupfer": s.photo("kupferdraht", { w: 360, h: 190, pos: "50% 55%", caption: "Kupferdraht" }),
            "Holz": s.photo("holzstapel", { w: 360, h: 190, pos: "50% 60%", caption: "Holz" }),
            "Glas": s.photo("glasstab", { w: 360, h: 190, pos: "50% 50%", caption: "Glasstäbe" }),
            "Kochsalz": s.photo("salzkristalle", { w: 360, h: 190, pos: "50% 50%", caption: "Salzkristalle" }),
            "Kerzenwachs": s.photo("kerze-wachs", { w: 360, h: 190, pos: "50% 12%", caption: "Kerze aus Wachs" }),
          };
          Object.values(photos).forEach(f => (f.style.display = "none"));
          const sample = s.h("div", { class: "later", style: { height: "190px" } }, ...Object.values(photos));
          let busy = false, runId = 0;
          const run = async (name, btn) => {
            const id = ++runId; busy = true;
            btns.forEach(b => b.classList.toggle("solid", b === btn));
            head.textContent = "Steckbrief: " + name; s.sfx.whoosh();
            Object.entries(photos).forEach(([k, f]) => (f.style.display = k === name ? "" : "none")); s.show(sample, "pop");
            rowEls.forEach(r => { r.k.textContent = ""; r.v.textContent = ""; });
            for (let i = 0; i < rowEls.length; i++) {
              if (id !== runId) return;
              const [k, v] = data[name].r[i];
              rowEls[i].k.textContent = k; rowEls[i].v.textContent = v;
              rowEls[i].v.style.color = v === Y || v.startsWith("ja") ? "var(--green)" : v === N || v.startsWith("nein") ? "var(--red)" : "var(--ink)";
              s.show(rowEls[i].tr, "left"); s.sfx.count(i);
              await s.wait(220);
            }
            if (id === runId) { s.sfx.success(); busy = false; }
          };
          const btns = names.map(n => { const b = s.h("button", { class: "btn", onclick: () => run(n, b) }, n); return b; });
          const left = s.h("div", { class: "stack", style: { gap: "12px" } }, P(s, "t", "Wähle einen Stoff:"), s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } }, btns), sample,
            P(s, "small", "Jeder Stoff hat einen anderen Steckbrief – so erkennt man ihn."));
          const right = s.h("div", { class: "card", style: { padding: "12px 18px" } }, head, table);
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "360px 1fr", gap: "28px", alignItems: "center", height: "100%" } }, left, right));
          s.sfx.pop();
          s.step(async () => { await run("Eisen", btns[0]); s.say("Eisen ist grau, glänzt, leitet Strom und ist magnetisch."); });
          s.step(async () => { await run("Kerzenwachs", btns[5]); s.say("Kerzenwachs ist weich, brennt und schwimmt."); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Fest, flüssig, gasförmig",
        say: "Wasser gibt es als Eis, als flüssiges Wasser und als Wasserdampf. Das sind die drei Aggregatzustände.",
        build(s) {
          const svg = s.svg(600, 600);
          const G = { x: 300, y: 92 }, F = { x: 92, y: 500 }, L = { x: 508, y: 500 };
          const corner = (c, kind, labels) => {
            const g = s.el("g", { class: "later" });
            g.append(s.el("circle", { cx: c.x, cy: c.y, r: 66, fill: "#fff", stroke: UC, "stroke-width": 4 }));
            if (kind === 0) for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) g.append(s.el("circle", { cx: c.x - 27 + i * 18, cy: c.y - 27 + j * 18, r: 8, fill: UC }));
            if (kind === 1) [[-30, 18], [-12, 22], [8, 20], [28, 16], [-22, 0], [-2, 4], [18, -2], [-10, -16], [10, -20], [30, 2], [-36, -4]].forEach(([dx, dy]) => g.append(s.el("circle", { cx: c.x + dx, cy: c.y + dy + 14, r: 8, fill: UC })));
            if (kind === 2) [[-36, -24], [20, -40], [34, 10], [-14, 30], [-40, 18], [6, -6]].forEach(([dx, dy]) => g.append(s.el("circle", { cx: c.x + dx, cy: c.y + dy, r: 8, fill: UC })));
            labels.forEach(([x, y, t, sz, a, col]) => g.append(T(s, x, y, t, { size: sz, anchor: a, fill: col })));
            return g;
          };
          const cG = corner(G, 2, [[G.x + 84, G.y - 4, "gasförmig", 26, "start"], [G.x + 84, G.y + 24, "Wasserdampf", 20, "start", "#5d6678"]]);
          const cF = corner(F, 0, [[F.x - 66, F.y + 94, "fest · Eis", 24, "start"]]);
          const cL = corner(L, 1, [[L.x + 66, L.y + 94, "flüssig · Wasser", 24, "end"]]);
          // arrows
          const arrow = (x1, y1, x2, y2, col) => {
            const g = s.el("g", { class: "later" });
            const a = Math.atan2(y2 - y1, x2 - x1), hx = x2 - 14 * Math.cos(a), hy = y2 - 14 * Math.sin(a);
            g.append(s.el("line", { x1, y1, x2: hx, y2: hy, stroke: col, "stroke-width": 5, "stroke-linecap": "round" }),
              s.el("polygon", { points: `${x2},${y2} ${hx + 9 * Math.sin(a)},${hy - 9 * Math.cos(a)} ${hx - 9 * Math.sin(a)},${hy + 9 * Math.cos(a)}`, fill: col }));
            return g;
          };
          const lab = (x, y, t, col, anchor = "middle") => { const e = T(s, x, y, t, { size: 22, fill: col, anchor }); e.classList.add("later"); return e; };
          const red = "#dc3b2a", blue = "#1d5bd0";
          // fest <-> flüssig (bottom)
          const p1 = [arrow(165, 486, 435, 486, red), lab(300, 474, "Schmelzen", red), arrow(435, 516, 165, 516, blue), lab(300, 548, "Erstarren", blue)];
          // flüssig <-> gas (right edge)
          const ux = (L.x - G.x), uy = (L.y - G.y), ln = Math.hypot(ux, uy), nx = uy / ln, ny = -ux / ln; // outward normal (to the right)
          const ptR = (t, off) => [G.x + ux * t + nx * off, G.y + uy * t + ny * off];
          const [a1x, a1y] = ptR(.8, 14), [a2x, a2y] = ptR(.22, 14), [b1x, b1y] = ptR(.22, -14), [b2x, b2y] = ptR(.8, -14);
          const p2 = [arrow(a1x, a1y, a2x, a2y, red), lab(ptR(.45, 40)[0], ptR(.45, 40)[1], "Verdampfen", red, "start"), arrow(b1x, b1y, b2x, b2y, blue), lab(395, 345, "Kondensieren", blue, "end")];
          // fest <-> gas (left edge)
          const vx = (F.x - G.x), vy = (F.y - G.y), lv = Math.hypot(vx, vy), mx = -vy / lv, my = vx / lv; // outward normal (to the left)
          const ptL = (t, off) => [G.x + vx * t + mx * off, G.y + vy * t + my * off];
          const [c1x, c1y] = ptL(.8, 14), [c2x, c2y] = ptL(.22, 14), [d1x, d1y] = ptL(.22, -14), [d2x, d2y] = ptL(.8, -14);
          const p3 = [arrow(c1x, c1y, c2x, c2y, red), lab(ptL(.45, 40)[0], ptL(.45, 40)[1], "Sublimieren", red, "end"), arrow(d1x, d1y, d2x, d2y, blue), lab(205, 430, "Resublimieren", blue, "start")];
          svg.append(...p1, ...p2, ...p3, cG, cF, cL);
          const card = (lbl, a, b) => s.h("div", { class: "ex later", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, lbl), P(s, "small", a), P(s, "small", b));
          const e1 = card("Schmelzen und Erstarren", "Eis am Stiel schmilzt in der Sonne.", "Wasser im Eiswürfelbehälter erstarrt.");
          const e2 = card("Verdampfen und Kondensieren", "Nudelwasser kocht und dampft.", "Der Badspiegel beschlägt nach dem Duschen.");
          const e3 = card("Sublimieren und Resublimieren", "Trockeneis wird direkt zu Gas.", "Raureif auf dem Auto im Winter.");
          const note = P(s, "small later", s.h("span", { class: "red" }, "Rot"), " = Wärme hinein, ", s.h("span", { class: "blue" }, "blau"), " = Wärme hinaus.");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "600px 1fr", gap: "24px", alignItems: "center", height: "100%" } }, svg, s.h("div", { class: "stack", style: { gap: "12px" } }, e1, e2, e3, note)));
          s.sfx.whoosh();
          s.step(async () => { s.sfx.count(0); await s.show(cF, "pop"); s.sfx.count(2); await s.show(cL, "pop"); s.sfx.count(4); await s.show(cG, "pop"); s.say("Fest, flüssig und gasförmig."); });
          const pair = async (arr, card, sayTxt) => { s.sfx.swoosh(); await s.show(arr[0], "left"); s.show(arr[1], "fade"); s.sfx.swoosh(); await s.show(arr[2], "right"); s.show(arr[3], "fade"); s.sfx.pop(); await s.show(card, "up"); s.say(sayTxt); };
          s.step(() => pair(p1, e1, "Schmelzen und Erstarren."));
          s.step(() => pair(p2, e2, "Verdampfen und Kondensieren."));
          s.step(() => pair(p3, e3, "Sublimieren: Ein fester Stoff wird direkt gasförmig. Resublimieren ist der Rückweg."));
          s.step(async () => { s.sfx.ding(); await s.show(note, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Übergänge im Alltag",
        say: "Aggregatzustände ändern sich überall: in der Küche, im Bad und draußen.",
        build(s) {
          const mk = (id, pos, title, chip, txt) => { const c = s.h("div", { class: "card later", style: { padding: "8px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", textAlign: "center" } }, s.photo(id, { w: "100%", h: 172, pos }), s.h("div", { class: "row", style: { gap: "8px", justifyContent: "center" } }, s.h("b", { style: { fontSize: "21px" } }, title), s.h("span", { class: "chip" }, chip)), P(s, "small", txt)); return { c }; };
          const a = mk("eis-saft", "50% 40%", "Eiswürfel", "Schmelzen", "Im Saft wird das Eis flüssig.");
          const b = mk("nudelwasser", "50% 50%", "Nudelwasser", "Sieden", "Bei 100 °C steigen Dampfblasen auf.");
          const c3 = mk("beschlagen", "50% 40%", "Beschlagene Scheibe", "Kondensieren", "Warmer Dampf trifft das kalte Glas.");
          const d = mk("raureif-auto", "50% 50%", "Raureif am Auto", "Resublimieren", "Wasserdampf wird direkt zu Eiskristallen.");
          const e = mk("kerze-flamme", "40% 60%", "Kerze", "Schmelzen · Erstarren", "Wachs schmilzt am Docht, am Rand erstarrt es.");
          const f = mk("pfuetzen", "50% 60%", "Pfütze", "Verdunsten", "Trocknet auch ohne 100 °C.");
          const cards = [a, b, c3, d, e, f];
          s.add(s.h("div", { class: "cols3", style: { gap: "16px", height: "100%", gridTemplateRows: "1fr 1fr", gridTemplateColumns: "repeat(3, minmax(0, 1fr))" } }, cards.map(x => x.c)));
          s.sfx.pop();
          s.step(async () => { s.sound("eiswuerfel", { vol: .7 }); for (const i of [0, 1, 2]) { await s.show(cards[i].c, "pop"); } s.say("Eis schmilzt, Wasser siedet, Dampf kondensiert an der kalten Scheibe."); });
          s.step(async () => { s.sound("wind", { vol: .35, dur: 3 }); for (const i of [3, 4, 5]) { await s.show(cards[i].c, "pop"); } s.say("Verdunsten geht langsam und schon unter hundert Grad."); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Wasser wird erhitzt",
        say: "Wir erhitzen Eis von minus zwanzig Grad, bis Wasserdampf entsteht. Achte auf die flachen Stücke.",
        build(s) {
          const W = 640, H = 470;
          const { canvas, g } = s.canvas(W, H);
          const X0 = 70, X1 = 620, Y0 = 420, Y1 = 30, tMin = -20, tMax = 120;
          const ty = v => Y0 - (v - tMin) / (tMax - tMin) * (Y0 - Y1);
          // segments: [duration, from, to, label]
          const segs = [[1, -20, 0, "Eis wird wärmer"], [2, 0, 0, "Eis schmilzt"], [3, 0, 100, "Wasser wird wärmer"], [3, 100, 100, "Wasser siedet"], [1, 100, 120, "Dampf"]];
          const total = segs.reduce((a, x) => a + x[0], 0);
          const tx = u => X0 + u / total * (X1 - X0);
          const tempAt = p => { let u = p * total; for (const [d, a, b] of segs) { if (u <= d) return a + (b - a) * (u / d); u -= d; } return 120; };
          const stateAt = p => { let u = p * total; for (const sg of segs) { if (u <= sg[0]) return sg[3]; u -= sg[0]; } return "Dampf"; };
          let prog = 0;
          const draw = () => {
            g.clearRect(0, 0, W, H);
            g.strokeStyle = "#1b2740"; g.lineWidth = 3; g.beginPath(); g.moveTo(X0, Y1 - 10); g.lineTo(X0, Y0); g.lineTo(X1 + 10, Y0); g.stroke();
            g.font = "600 19px 'Atkinson Hyperlegible', sans-serif"; g.fillStyle = "#5d6678"; g.textAlign = "right"; g.textBaseline = "middle";
            [-20, 0, 20, 40, 60, 80, 100, 120].forEach(v => { g.fillText(v + " °C", X0 - 8, ty(v)); g.strokeStyle = "#d5e4ee"; g.lineWidth = 1; g.beginPath(); g.moveTo(X0 + 2, ty(v)); g.lineTo(X1, ty(v)); g.stroke(); });
            g.textAlign = "right"; g.fillText("Zeit →", X1, Y0 + 30);
            // highlight plateaus
            [[1, 3, 0], [6, 9, 100]].forEach(([a, b, v]) => { if (prog * total > a) { g.fillStyle = "rgba(255,217,74,.35)"; g.fillRect(tx(a), ty(v) - 18, tx(Math.min(b, prog * total)) - tx(a), 36); } });
            g.strokeStyle = UC; g.lineWidth = 5; g.lineJoin = "round"; g.beginPath();
            const N = 200;
            for (let i = 0; i <= N * prog; i++) { const p = i / N; const x = X0 + p * (X1 - X0), y = ty(tempAt(p)); i ? g.lineTo(x, y) : g.moveTo(x, y); }
            g.stroke();
            const px = X0 + prog * (X1 - X0), py = ty(tempAt(prog));
            g.fillStyle = UC; g.beginPath(); g.arc(px, py, 8, 0, Math.PI * 2); g.fill();
            // labels of plateaus
            g.font = "700 20px 'Atkinson Hyperlegible', sans-serif"; g.textAlign = "center"; g.textBaseline = "alphabetic";
            if (prog * total > 1.6) { g.fillStyle = "#1d5bd0"; g.fillText("Eis schmilzt (0 °C)", tx(2) + 30, ty(0) + 46); }
            if (prog * total > 7) { g.fillStyle = "#dc3b2a"; g.fillText("Wasser siedet (100 °C)", tx(7.2), ty(100) - 30); }
          };
          draw();
          // thermometer
          const th = s.svg(110, 470);
          const tube = s.el("rect", { x: 40, y: 20, width: 30, height: 380, rx: 15, fill: "#fff", stroke: "#1b2740", "stroke-width": 4 });
          const liquid = s.el("rect", { x: 48, y: 390, width: 14, height: 30, fill: "#dc3b2a" });
          th.append(tube, liquid, s.el("circle", { cx: 55, cy: 425, r: 30, fill: "#dc3b2a", stroke: "#1b2740", "stroke-width": 4 }));
          const readout = s.h("p", { class: "huge mono", style: { color: UC, fontSize: "64px" } }, "−20 °C");
          const state = s.h("p", { class: "h2" }, "Eis wird wärmer");
          const setProg = p => {
            prog = p; draw();
            const v = tempAt(p); readout.textContent = (Math.round(v) < 0 ? "−" : "") + Math.abs(Math.round(v)) + " °C";
            state.textContent = stateAt(p);
            const top = 395 - (v - tMin) / (tMax - tMin) * 360; liquid.setAttribute("y", top); liquid.setAttribute("height", 420 - top);
          };
          setProg(0);
          let running = false;
          const heat = async () => {
            if (running) return; running = true; s.sfx.whoosh(); let last = -1, boiled = false;
            await s.tween({ from: 0, to: 1, dur: 9000, ease: "linear", update: p => { setProg(p); const k = Math.floor(p * 20); if (k !== last) { last = k; s.sfx.tick(); } if (!boiled && p * total >= 6) { boiled = true; s.sound("kochen", { vol: .45, dur: 3 }); } } });
            s.sfx.ding(); running = false;
          };
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Beim ", B(s, "Schmelzen"), " und beim ", B(s, "Sieden"), " bleibt die Temperatur gleich, obwohl du weiter heizt. Die Wärme wird für die Umwandlung gebraucht.");
          const btn = s.h("button", { class: "btn solid", onclick: () => { setProg(0); heat(); } }, "Erhitzen");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "640px 110px 1fr", gap: "16px", alignItems: "center", height: "100%" } }, canvas, th,
            s.h("div", { class: "stack", style: { gap: "14px" } }, readout, state, btn, merk)));
          s.show(canvas, "fade"); s.sfx.pop();
          s.step(async () => { await heat(); s.say("Zweimal bleibt die Temperatur stehen: bei null und bei hundert Grad."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.say("Darum wird Nudelwasser nicht heißer als hundert Grad, auch wenn der Herd auf voller Stufe steht."); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Der Fingerabdruck eines Stoffes",
        say: "Jeder reine Stoff schmilzt und siedet bei seiner eigenen Temperatur. Das ist wie ein Fingerabdruck.",
        build(s) {
          const rows = [["Wasser", 0, 100, "#1d5bd0"], ["Ethanol (Alkohol)", -114, 78, "#7b4fd6"], ["Zinn", 232, null, "#6b7280"], ["Eisen", 1538, 2862, "#dc3b2a"]];
          const f = v => (v < 0 ? "−" : "") + s.fmt(Math.abs(v)) + " °C";
          const trs = rows.map(([n, m, b, col]) => {
            const tm = s.h("td", { class: "mono", style: { textAlign: "right", padding: "8px 14px", fontSize: "28px", fontWeight: 800, color: col, whiteSpace: "nowrap" } }, "");
            const tb = s.h("td", { class: "mono", style: { textAlign: "right", padding: "8px 14px", fontSize: "28px", fontWeight: 800, color: col, whiteSpace: "nowrap" } }, "");
            const tr = s.h("tr", { class: "later", style: { borderTop: "2px solid var(--line)" } }, s.h("td", { style: { padding: "8px 14px", fontSize: "24px", fontWeight: 700, whiteSpace: "nowrap" } }, n), tm, tb);
            return { tr, tm, tb, m, b };
          });
          const table = s.h("table", { style: { borderCollapse: "collapse", width: "100%" } },
            s.h("tr", null, s.h("th", { style: { textAlign: "left", padding: "6px 14px", fontSize: "20px", color: "var(--pencil)", whiteSpace: "nowrap" } }, "Stoff"), s.h("th", { style: { textAlign: "right", padding: "6px 14px", fontSize: "20px", color: "var(--pencil)", whiteSpace: "nowrap" } }, "schmilzt bei"), s.h("th", { style: { textAlign: "right", padding: "6px 14px", fontSize: "20px", color: "var(--pencil)", whiteSpace: "nowrap" } }, "siedet bei")),
            trs.map(r => r.tr));
          const card = s.h("div", { class: "card" }, table);
          const wax = s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, "Kerzenwachs ist anders"), P(s, "small", "Kerzenwachs (Paraffin) ist ein ", B(s, "Gemisch"), ". Es schmilzt nicht bei einer Temperatur, sondern langsam in einem Bereich – je nach Sorte etwa 50 bis 60 °C."));
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"),
            P(s, "small", "• Löten: Zinn schmilzt am heißen Lötkolben und verbindet Drähte."),
            P(s, "small", "• Ethanol erstarrt erst bei −114 °C – darum steckt es in Thermometern für große Kälte."),
            P(s, "small", "• Im Stahlwerk wird Eisen bei über 1.500 °C flüssig und in Formen gegossen."));
          const foundry = s.photo("eisen-giessen", { w: "100%", h: 220, pos: "50% 45%", caption: "Gießerei: flüssiges Eisen fließt in eine Form", cls: "later" });
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "640px 1fr", gap: "24px", alignItems: "center", height: "100%" } },
            s.h("div", { class: "stack" }, card, wax), s.h("div", { class: "stack", style: { gap: "14px" } }, foundry, life)));
          s.sfx.pop();
          s.step(async () => {
            for (let i = 0; i < trs.length; i++) {
              const r = trs[i]; s.sfx.count(i * 2); s.show(r.tr, "left");
              await s.tween({ from: 0, to: 1, dur: 700, ease: "out", update: t => { r.tm.textContent = f(Math.round(r.m * t)); r.tb.textContent = r.b == null ? (t === 1 ? "ca. 2.600 °C" : "") : f(Math.round(r.b * t)); } });
            }
            s.say("Wasser schmilzt bei null Grad und siedet bei hundert Grad.");
          });
          s.step(async () => { s.sfx.pop(); await s.show(wax, "up"); });
          s.step(async () => { s.sound("fire", { vol: .4, dur: 2.5 }); s.show(foundry, "zoom"); await s.show(life, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Das Teilchenmodell",
        say: "Alle Stoffe bestehen aus winzigen Teilchen. Schiebe den Regler und mach es wärmer.",
        build(s) {
          const W = 560, H = 520, R = 13;
          const { canvas, g } = s.canvas(W, H);
          const N = 48, cols = 8;
          const sites = Array.from({ length: N }, (_, i) => ({ x: W / 2 - (cols - 1) * 14 + (i % cols) * 28, y: H - 30 - Math.floor(i / cols) * 28 }));
          const ps = sites.map(p => ({ x: p.x, y: p.y, vx: 0, vy: 0, ph: Math.random() * 6.28 }));
          let temp = 10;
          const mode = () => temp < 34 ? 0 : temp < 67 ? 1 : 2;
          s.loop((t, dt) => {
            dt = Math.min(dt || 0.016, 0.033);
            const m = mode();
            if (m === 0) {
              const amp = 1 + temp / 10;
              ps.forEach((p, i) => { const sx = sites[i].x + Math.sin(t * 25 + p.ph) * amp, sy = sites[i].y + Math.cos(t * 23 + p.ph * 1.3) * amp; p.x += (sx - p.x) * .2; p.y += (sy - p.y) * .2; p.vx = p.vy = 0; });
            } else {
              const speed = m === 1 ? 60 + temp * 1.5 : 150 + temp * 3;
              ps.forEach(p => {
                p.vx += (Math.random() - .5) * speed * .6; p.vy += (Math.random() - .5) * speed * .6;
                if (m === 1) p.vy += 600 * dt;
                const v = Math.hypot(p.vx, p.vy) || 1, cap = speed * (m === 1 ? 1.2 : 1.6);
                if (v > cap) { p.vx *= cap / v; p.vy *= cap / v; }
                if (m === 2 && v < speed) { p.vx *= speed / v; p.vy *= speed / v; }
                p.x += p.vx * dt; p.y += p.vy * dt;
                if (p.x < R) { p.x = R; p.vx = Math.abs(p.vx); } if (p.x > W - R) { p.x = W - R; p.vx = -Math.abs(p.vx); }
                if (p.y < R) { p.y = R; p.vy = Math.abs(p.vy); } if (p.y > H - R) { p.y = H - R; p.vy = -Math.abs(p.vy) * (m === 1 ? .3 : 1); }
              });
              for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
                const a = ps[i], b = ps[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || .01;
                if (d < 2 * R) { const o = (2 * R - d) / 2, ux = dx / d, uy = dy / d; a.x -= ux * o; a.y -= uy * o; b.x += ux * o; b.y += uy * o; if (m === 2) { const va = a.vx * ux + a.vy * uy, vb = b.vx * ux + b.vy * uy; a.vx += (vb - va) * ux; a.vy += (vb - va) * uy; b.vx += (va - vb) * ux; b.vy += (va - vb) * uy; } }
                else if (m === 1 && d < 3.2 * R) { const f = 30 * dt, ux = dx / d, uy = dy / d; a.vx += ux * f; a.vy += uy * f; b.vx -= ux * f; b.vy -= uy * f; }
              }
            }
            g.clearRect(0, 0, W, H);
            g.fillStyle = "#fff"; g.fillRect(0, 0, W, H); g.strokeStyle = "#1b2740"; g.lineWidth = 4; g.strokeRect(2, 2, W - 4, H - 4);
            const col = temp < 34 ? "#1d5bd0" : temp < 67 ? "#7b4fd6" : "#dc3b2a";
            ps.forEach(p => { g.fillStyle = col; g.beginPath(); g.arc(p.x, p.y, R - 1, 0, Math.PI * 2); g.fill(); g.fillStyle = "rgba(255,255,255,.45)"; g.beginPath(); g.arc(p.x - 4, p.y - 4, 4, 0, Math.PI * 2); g.fill(); });
          });
          const names = ["fest", "flüssig", "gasförmig"];
          const desc = ["Die Teilchen sitzen fest auf ihren Plätzen und schwingen nur hin und her.", "Die Teilchen sind nah beieinander, aber gleiten aneinander vorbei.", "Die Teilchen fliegen schnell und weit voneinander entfernt herum."];
          const big = s.h("p", { class: "big", style: { color: "#1d5bd0" } }, "fest");
          const dtxt = P(s, "t", desc[0]);
          let lastMode = 0;
          const upd = v => {
            temp = v; const m = mode();
            big.textContent = names[m]; big.style.color = ["#1d5bd0", "#7b4fd6", "#dc3b2a"][m]; dtxt.textContent = desc[m];
            if (m !== lastMode) { lastMode = m; s.sfx.pop(); if (m === 2) ps.forEach(p => { p.vx = (Math.random() - .5) * 400; p.vy = -Math.random() * 400; }); }
          };
          const sl = s.slider({ label: "Temperatur", min: 0, max: 100, value: 10, fmt: v => v < 34 ? "kalt" : v < 67 ? "warm" : "heiß", onInput: upd });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Alle Stoffe bestehen aus winzigen ", B(s, "Teilchen"), ". Je wärmer, desto schneller bewegen sie sich.");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "560px 1fr", gap: "28px", alignItems: "center", height: "100%" } }, canvas,
            s.h("div", { class: "stack" }, big, dtxt, sl, merk)));
          s.show(canvas, "zoom"); s.sfx.pop();
          const glide = async to => { const from = Number(sl.input.value); await s.tween({ from, to, dur: 900, update: v => sl.set(Math.round(v)) }); };
          s.step(async () => { await glide(50); s.say("Flüssig: Die Teilchen gleiten aneinander vorbei."); });
          s.step(async () => { await glide(90); s.sfx.whoosh(); s.say("Gasförmig: Die Teilchen fliegen frei herum."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Wärme macht Stoffe größer",
        say: "Wird ein Stoff warm, bewegen sich seine Teilchen stärker und brauchen mehr Platz. Der Stoff dehnt sich aus.",
        build(s) {
          // bridge
          const br = s.svg(340, 220, { width: 320, height: 260 });
          br.append(s.el("rect", { x: 0, y: 150, width: 60, height: 70, fill: "#a8a29e" }), s.el("rect", { x: 280, y: 150, width: 60, height: 70, fill: "#a8a29e" }), s.el("rect", { x: 120, y: 150, width: 24, height: 70, fill: "#a8a29e" }));
          const deckL = s.el("rect", { x: 0, y: 128, width: 150, height: 22, fill: "#6b7280" });
          const deckR = s.el("rect", { x: 190, y: 128, width: 150, height: 22, fill: "#6b7280" });
          const gapLbl = T(s, 170, 108, "Fuge", { size: 20 });
          br.append(deckL, deckR, gapLbl, s.el("path", { d: "M170,112 v10", stroke: "#1b2740", "stroke-width": 2 }));
          const sun = s.el("circle", { cx: 300, cy: 40, r: 26, fill: "#ffd94a", opacity: .2 });
          br.append(sun);
          // thermometer
          const th = s.svg(200, 220, { width: 236, height: 260 });
          th.append(s.el("rect", { x: 85, y: 10, width: 30, height: 170, rx: 15, fill: "#fff", stroke: "#1b2740", "stroke-width": 4 }));
          const liq = s.el("rect", { x: 93, y: 120, width: 14, height: 80, fill: "#dc3b2a" });
          th.append(liq, s.el("circle", { cx: 100, cy: 192, r: 22, fill: "#dc3b2a", stroke: "#1b2740", "stroke-width": 4 }));
          for (let i = 0; i < 6; i++) th.append(s.el("line", { x1: 118, y1: 30 + i * 26, x2: 130, y2: 30 + i * 26, stroke: "#1b2740", "stroke-width": 2 }));
          // jar lid
          const jar = s.svg(220, 220, { width: 260, height: 260 });
          jar.append(s.el("rect", { x: 50, y: 70, width: 120, height: 140, rx: 16, fill: "#fecaca", stroke: "#1b2740", "stroke-width": 4 }), s.el("rect", { x: 60, y: 56, width: 100, height: 18, fill: "#e5e7eb", stroke: "#1b2740", "stroke-width": 3 }));
          const lid = s.el("rect", { x: 54, y: 34, width: 112, height: 28, rx: 5, fill: "#9ca3af", stroke: "#1b2740", "stroke-width": 3 });
          jar.append(lid);
          const card = (v, title, txt) => s.h("div", { class: "card", style: { padding: "10px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" } }, v, s.h("b", { style: { fontSize: "21px" } }, title), P(s, "small", txt));
          const c1 = card(br, "Brücke mit Dehnungsfuge", "100 m Brücke: im Sommer einige Zentimeter länger als im Winter.");
          const c2 = card(th, "Thermometer", "Die Flüssigkeit dehnt sich aus und steigt im Röhrchen.");
          const c3 = card(jar, "Schraubdeckel klemmt?", "Unter warmes Wasser halten: Der Metalldeckel dehnt sich und geht leichter auf.");
          [c1, c2, c3].forEach(c => c.style.textAlign = "center");
          const setT = v => { // v: -10..35 °C
            const k = (v + 10) / 45;
            deckL.setAttribute("width", 150 + 14 * k); deckR.setAttribute("x", 190 - 14 * k); deckR.setAttribute("width", 150 + 14 * k);
            sun.setAttribute("opacity", .15 + .85 * k);
            const top = 150 - 110 * k; liq.setAttribute("y", top); liq.setAttribute("height", 200 - top);
            lid.setAttribute("x", 54 - 4 * k); lid.setAttribute("width", 112 + 8 * k);
          };
          setT(-10);
          const sl = s.slider({ label: "Temperatur", min: -10, max: 35, value: -10, fmt: v => (v < 0 ? "−" : "") + Math.abs(v) + " °C", onInput: setT });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Wärmer → Teilchen bewegen sich stärker → brauchen mehr Platz → der Stoff ", B(s, "dehnt sich aus"), ".");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "24px", justifyContent: "center" } },
            s.h("div", { class: "cols3", style: { gap: "16px" } }, c1, c2, c3),
            s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 1.3fr", gap: "24px", alignItems: "center" } }, sl, merk)));
          s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); await s.tween({ from: -10, to: 35, dur: 2200, update: v => sl.set(Math.round(v)) }); s.sfx.ding(); s.say("Im Sommer wird die Fuge der Brücke schmaler."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Diffusion: Teilchen mischen sich",
        say: "Teilchen bewegen sich ständig. Darum verteilt sich Tinte von allein im Wasser – im warmen Wasser schneller.",
        build(s) {
          const W = 620, H = 400;
          const { canvas, g } = s.canvas(W, H);
          const boxes = [{ x: 30, label: "kaltes Wasser", sp: 14, col: "#dbeafe" }, { x: 330, label: "heißes Wasser", sp: 46, col: "#fee2e2" }];
          let ink = [];
          const drop = () => { ink = []; boxes.forEach((b, bi) => { for (let i = 0; i < 160; i++) ink.push({ b: bi, x: b.x + 130 + (Math.random() - .5) * 20, y: 90 + (Math.random() - .5) * 20 }); }); };
          let started = false;
          s.loop((t, dt) => {
            dt = Math.min(dt || .016, .033);
            g.clearRect(0, 0, W, H);
            boxes.forEach(b => {
              g.fillStyle = b.col; g.fillRect(b.x + 4, 60, 252, 290);
              g.strokeStyle = "#1b2740"; g.lineWidth = 4; g.beginPath(); g.moveTo(b.x, 40); g.lineTo(b.x, 354); g.lineTo(b.x + 260, 354); g.lineTo(b.x + 260, 40); g.stroke();
              g.fillStyle = "#1b2740"; g.font = "700 22px 'Atkinson Hyperlegible', sans-serif"; g.textAlign = "center"; g.fillText(b.label, b.x + 130, 386);
            });
            if (started) ink.forEach(p => {
              const b = boxes[p.b], sp = b.sp * (s.fast ? 6 : 1);
              p.x += (Math.random() - .5) * sp * dt * 9; p.y += (Math.random() - .5) * sp * dt * 9 + (p.y < 120 ? 4 * dt : 0);
              p.x = Math.max(b.x + 8, Math.min(b.x + 252, p.x)); p.y = Math.max(64, Math.min(346, p.y));
              g.fillStyle = "rgba(76,29,149,.75)"; g.beginPath(); g.arc(p.x, p.y, 3.2, 0, Math.PI * 2); g.fill();
            });
          });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Teilchen bewegen sich ständig und vermischen sich von allein: ", B(s, "Diffusion"), ". Je wärmer, desto schneller.");
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"),
            P(s, "small", "• Ein Teebeutel färbt heißes Wasser schnell – kaltes viel langsamer."),
            P(s, "small", "• Pizzaduft aus der Küche riechst du bald im ganzen Flur."),
            P(s, "small", "• Ein Tropfen Sirup im Glas verteilt sich auch ohne Rühren."));
          const btn = s.h("button", { class: "btn solid", onclick: () => { drop(); started = true; s.sound("tropfen-einzeln"); } }, "Tinte hineintropfen");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "620px 1fr", gap: "24px", alignItems: "center", height: "100%" } },
            s.h("div", { class: "stack", style: { alignItems: "center" } }, canvas, btn),
            s.h("div", { class: "stack", style: { gap: "14px" } }, merk, life)));
          s.sfx.pop();
          s.step(async () => { drop(); started = true; s.sound("tropfen-einzeln"); await s.wait(1500); s.say("Im heißen Wasser verteilt sich die Tinte viel schneller."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
    ],
  });
})();
