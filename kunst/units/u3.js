/* Kapitel 3 – Zeichnen: Punkt, Linie, Fläche (Kunst 5/6, Berlin RLP Kunst) */
(() => {
  const UC = "#7b4fd6", INK = "#1b2740", PEN = "#4a4458";
  const RAD = Math.PI / 180;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rng = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  let uid = 0;

  /* ---------- layout helpers ---------- */
  const cols = (s, left, right, lw = 560) =>
    s.h("div", { class: "cols", style: { gridTemplateColumns: lw + "px minmax(0,1fr)", alignItems: "center", height: "100%" } }, left, right);
  const merk = (s, html, hidden = true) => s.h("div", { class: "merk" + (hidden ? " later" : ""), html });
  const box = (s, cls, label, html, hidden = true) =>
    s.h("div", { class: cls + (hidden ? " later" : "") }, label ? s.h("span", { class: "exlabel" }, label) : null, s.h("p", { class: "small", html }));
  const stack = (s, gap, ...kids) => s.h("div", { class: "stack", style: { gap: gap + "px" } }, ...kids);

  /* zig-zag hatch path inside a w×h box. dir 1 = "/" lines, -1 = "\" lines */
  function hatchD(w, h, sp, dir = 1) {
    let d = "", i = 0;
    for (let c = -h; c <= w + 4; c += sp, i++) {
      let a = [c - 8, h + 8], b = [c + h + 8, -8];
      if (dir < 0) { a = [w - a[0], a[1]]; b = [w - b[0], b[1]]; }
      const p = i % 2 ? [b, a] : [a, b];
      d += (i ? "L" : "M") + p[0][0].toFixed(1) + "," + p[0][1].toFixed(1) + "L" + p[1][0].toFixed(1) + "," + p[1][1].toFixed(1);
    }
    return d;
  }
  /* clipped group inside svg */
  function clipG(s, svg, x, y, w, h) {
    const id = "clip" + (++uid);
    const cp = s.el("clipPath", { id }, s.el("rect", { x: 0, y: 0, width: w, height: h }));
    svg.append(cp);
    const g = s.el("g", { transform: `translate(${x} ${y})`, "clip-path": `url(#${id})` });
    svg.append(g);
    return g;
  }
  const dotsD = (pts) => pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join("");

  Deck.unit({
    id: "u3", num: 3, title: "Zeichnen: Punkt, Linie, Fläche", color: UC, soft: "#ece5fb",
    subtitle: "Aus drei Zutaten wird ein Bild",
    blurb: "Punkt, Linie, Fläche, Schraffur, Schatten, Frottage und Dürer",
    goals: [
      "Punkt, Linie und Fläche unterscheiden",
      "Mit Linien Strukturen und Hell-Dunkel zeichnen",
      "Licht und Schatten an Kugel und Würfel verstehen",
      "Zeichenwerkzeuge kennen und Albrecht Dürer treffen",
    ],
    icon(svg, el) {
      svg.append(el("circle", { cx: 16, cy: 18, r: 6, fill: UC }),
        el("path", { d: "M10,50 C24,30 34,60 46,36 S60,34 62,22", fill: "none", stroke: UC, "stroke-width": 4, "stroke-linecap": "round" }),
        el("rect", { x: 38, y: 46, width: 24, height: 18, rx: 4, fill: UC, opacity: .35 }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Punkt, Linie, Fläche",
        say: "Jede Zeichnung besteht aus drei Dingen: Punkt, Linie und Fläche. Der Maler Kandinsky hat sogar ein Buch darüber geschrieben.",
        build(s) {
          const svg = s.svg(520, 540);
          [6, 184, 362].forEach((y, i) => svg.append(s.el("rect", { x: 6, y, width: 508, height: 168, rx: 20, fill: ["#f4effd", "#ece5fb", "#e4dafa"][i] })));
          const dots = [[90, 90, 36], [200, 90, 24], [290, 90, 15], [356, 90, 9], [406, 90, 5]].map(([x, y, r], i) =>
            s.el("circle", { cx: x, cy: y, r, fill: INK, class: "later" }));
          const dots2 = [[455, 90, 3]].map(([x, y, r]) => s.el("circle", { cx: x, cy: y, r, fill: INK, class: "later" }));
          const line = s.el("path", { d: "M36,300 C110,200 170,350 260,268 S420,230 484,290", fill: "none", stroke: INK, "stroke-width": 7, "stroke-linecap": "round", class: "later" });
          const blob = s.el("path", { d: "M70,444 C58,404 150,394 230,408 C330,392 458,412 448,460 C452,510 300,522 200,514 C110,520 80,490 70,444Z", fill: UC, opacity: .85, class: "later" });
          svg.append(...dots, ...dots2, line, blob);
          const r1 = box(s, "ex", "Der Punkt", "Der kleinste Strich, ein Tupfer mit dem Stift. Zum Beispiel: ein Stern am Himmel, ein Pixel, der i-Punkt.");
          const r2 = box(s, "ex", "Die Linie", "Ein Punkt, der wandert, wird zur Linie. Zum Beispiel: ein Kabel, eine Straße auf der Karte, der Horizont.");
          const r3 = box(s, "ex", "Die Fläche", "Eine Linie, die sich schließt, umschließt eine Fläche. Zum Beispiel: ein Teich, die Tafel, ein Fußballfeld.");
          const m = merk(s, "Wassily Kandinsky (1866–1944) lehrte am Bauhaus. 1926 erschien sein Buch <b>„Punkt und Linie zu Fläche“</b>.");
          s.add(cols(s, svg, stack(s, 12, r1, r2, r3, m), 520));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.say("Der Punkt ist der kleinste Strich."); for (let i = 0; i < 5; i++) { s.sfx.count(i); s.show(dots[i], "pop"); await s.wait(160); } s.show(dots2[0], "pop"); s.show(r1, "up"); await s.wait(400); });
          s.step(async () => { s.say("Wandert der Punkt, entsteht eine Linie."); s.sfx.scribble(); s.show(r2, "up"); await s.show(line, "draw"); });
          s.step(async () => { s.say("Schließt sich die Linie, entsteht eine Fläche."); s.sfx.whoosh(); s.show(r3, "up"); await s.show(blob, "zoom"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Linien-Sorten",
        say: "Linien können gerade, gebogen, spitz, wellig, gedreht oder gestrichelt sein. Jede Linie wirkt anders.",
        build(s) {
          const wave = []; for (let x = 20; x <= 280; x += 4) wave.push([x, 45 + 24 * Math.sin((x - 20) / 24)]);
          const spiral = []; for (let a = 0; a < 5.2 * Math.PI; a += 0.15) { const r = 3 + a * 2.6; spiral.push([150 + r * Math.cos(a) * 1.6, 45 + r * Math.sin(a) * 0.95]); }
          const defs = [
            ["gerade", "ruhig, klar", { d: "M20,45 L280,45" }],
            ["gebogen", "weich, rund", { d: "M20,72 Q150,-22 280,72" }],
            ["zackig", "scharf, aufgeregt", { d: "M20,70 L55,20 L90,70 L125,20 L160,70 L195,20 L230,70 L265,20 L285,45" }],
            ["wellig", "fließend wie Wasser", { d: dotsD(wave) }],
            ["Spirale", "dreht sich ein", { d: dotsD(spiral) }],
            ["gestrichelt", "unterbrochen", null],
          ];
          const grid = s.h("div", { class: "cols3", style: { gap: "18px" } });
          const strokes = [];
          defs.forEach(([name, mood, o]) => {
            const svg = s.svg(300, 90);
            let el;
            if (o) { el = s.el("path", Object.assign({ fill: "none", stroke: INK, "stroke-width": 5, "stroke-linecap": "round", "stroke-linejoin": "round", class: "later" }, o)); svg.append(el); }
            else { el = s.el("g", { class: "later" }); for (let i = 0; i < 8; i++) el.append(s.el("line", { x1: 20 + i * 34, y1: 45, x2: 38 + i * 34, y2: 45, stroke: INK, "stroke-width": 5, "stroke-linecap": "round" })); svg.append(el); }
            strokes.push(el);
            grid.append(s.h("div", { class: "card", style: { padding: "22px 16px 22px", textAlign: "center" } }, svg, s.h("p", { class: "h2" }, name), s.h("p", { class: "small pencil" }, mood)));
          });
          const m = merk(s, "Jede Linie hat eine <b>Stimmung</b>. Waagerecht wirkt ruhig, zackig wirkt wild, wellig wirkt weich.");
          s.add(stack(s, 16, grid, m));
          s.step(async () => { s.sfx.scribble(); s.show(strokes[0], "draw"); await s.wait(300); s.sfx.scribble(); s.show(strokes[1], "draw", 100); await s.wait(300); s.sfx.scribble(); await s.show(strokes[2], "draw", 100); });
          s.step(async () => { s.sfx.scribble(); s.show(strokes[3], "draw"); await s.wait(300); s.sfx.scribble(); s.show(strokes[4], "draw", 100); await s.wait(300); s.sfx.tick(); await s.show(strokes[5], "fade"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Dick, dünn, ruhig, wild",
        say: "Wie fest du aufdrückst und wie schnell du zeichnest, verändert die Linie. Probiere die Regler aus.",
        build(s) {
          const { canvas, g } = s.canvas(540, 330);
          let w = 6, wild = 1, prog = 1;
          const draw = () => {
            g.clearRect(0, 0, 540, 330);
            g.fillStyle = "#fff"; g.fillRect(0, 0, 540, 330);
            g.strokeStyle = INK; g.lineWidth = w; g.lineCap = "round"; g.lineJoin = "round";
            g.beginPath();
            const om = 0.02 + wild * 0.012, amp = 10 + wild * 11;
            for (let x = 20; x <= 20 + 500 * prog; x += 3) {
              const y = 165 + amp * Math.sin((x - 20) * om) + wild * wild * 0.5 * Math.sin(x * 0.83) + wild * wild * 0.3 * Math.sin(x * 1.9 + 1);
              x === 20 ? g.moveTo(x, y) : g.lineTo(x, y);
            }
            g.stroke();
          };
          draw();
          const word = s.h("p", { class: "big violet", style: { minHeight: "92px" } });
          const upd = () => { word.textContent = (w <= 5 ? "zart" : w >= 14 ? "kräftig" : "mittel") + (wild <= 2 ? " und ruhig" : wild >= 7 ? " und wild" : " und lebendig"); };
          upd();
          const sl1 = s.slider({ label: "Druck (Strichdicke)", min: 1, max: 24, value: 6, onInput: v => { w = v; upd(); draw(); } });
          const sl2 = s.slider({ label: "Tempo (Wildheit)", min: 0, max: 10, value: 1, onInput: v => { wild = v; upd(); draw(); } });
          sl1.classList.add("later"); sl2.classList.add("later");
          const ex = box(s, "life", "Im Alltag", "Comics: Tempo-Striche für schnelle Action. Zarte Haarlinien in Zeichnungen. Dicke Konturen im Malbuch.");
          s.add(cols(s, s.h("div", { class: "card", style: { padding: "10px" } }, canvas), stack(s, 14, s.h("p", { class: "t" }, "Die Linie wirkt:"), word, sl1, sl2, ex), 560));
          s.tween({ from: 0, to: 1, dur: 1400, ease: "inOut", update: v => { prog = v; draw(); } });
          s.sfx.scribble();
          s.step(async () => { s.sfx.pop(); await s.show(sl1, "up"); s.say("Drücke mehr oder weniger fest auf."); });
          s.step(async () => { s.sfx.pop(); await s.show(sl2, "up"); s.say("Zeichne ruhig oder wild."); });
          s.step(async () => { s.sfx.ding(); await s.show(ex, "up"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Strukturen und Texturen",
        say: "Mit Linien kann man zeigen, wie sich etwas anfühlt: Holz, Fell, Ziegel oder Gras.",
        build(s) {
          const R = rng(7);
          const W = 250, H = 150;
          const mk = (bg) => { const svg = s.svg(W, H); svg.append(s.el("rect", { width: W, height: H, rx: 12, fill: bg })); return svg; };
          // wood
          const wood = mk("#e3b87c");
          let d = ""; for (let k = 0; k < 7; k++) { const y0 = 14 + k * 20; d += `M8,${y0} C70,${y0 - 10 + R() * 16} 130,${y0 + 10 - R() * 16} 242,${y0 + R() * 8 - 4}`; }
          const woodP = s.el("path", { d, fill: "none", stroke: "#8a5a2b", "stroke-width": 2.5, "stroke-linecap": "round", class: "later" });
          const knot = s.el("g", { class: "later" }, s.el("ellipse", { cx: 150, cy: 76, rx: 18, ry: 10, fill: "none", stroke: "#8a5a2b", "stroke-width": 2.5 }), s.el("ellipse", { cx: 150, cy: 76, rx: 8, ry: 4, fill: "#8a5a2b" }));
          wood.append(woodP, knot);
          // fur
          const fur = mk("#d8a56b");
          let fd = "", fl = "";
          for (let i = 0; i < 95; i++) { const x = 10 + R() * 230, y = 10 + R() * 120; fd += `M${x.toFixed(0)},${y.toFixed(0)} q4,12 ${(R() * 6 - 1).toFixed(0)},${(14 + R() * 6).toFixed(0)}`; }
          for (let i = 0; i < 50; i++) { const x = 10 + R() * 230, y = 10 + R() * 120; fl += `M${x.toFixed(0)},${y.toFixed(0)} q4,10 2,16`; }
          const furP = s.el("path", { d: fd, fill: "none", stroke: "#6e4318", "stroke-width": 2.2, "stroke-linecap": "round", class: "later" });
          const furL = s.el("path", { d: fl, fill: "none", stroke: "#fbe3bd", "stroke-width": 2, "stroke-linecap": "round", class: "later" });
          fur.append(furP, furL);
          // bricks
          const brick = mk("#c7694b");
          let bd = ""; for (let r = 0; r < 6; r++) { const y = r * 25; bd += `M0,${y}L${W},${y}`; for (let x = (r % 2 ? 0 : 25); x <= W; x += 50) bd += `M${x},${y}L${x},${y + 25}`; }
          const brickP = s.el("path", { d: bd, fill: "none", stroke: "#f1e2d3", "stroke-width": 3.5, "stroke-linecap": "round", class: "later" });
          brick.append(brickP);
          // grass
          const grass = mk("#dff1c4");
          let gd = "", gl = "";
          for (let i = 0; i < 70; i++) { const x = 6 + i * 3.5, h = 40 + R() * 70, lean = (R() - .5) * 26; gd += `M${x.toFixed(0)},${H}Q${(x + lean / 2).toFixed(0)},${(H - h / 2).toFixed(0)} ${(x + lean).toFixed(0)},${(H - h).toFixed(0)}`; }
          for (let i = 0; i < 40; i++) { const x = 8 + R() * 235, h = 25 + R() * 45, lean = (R() - .5) * 20; gl += `M${x.toFixed(0)},${H}Q${(x + lean / 2).toFixed(0)},${(H - h / 2).toFixed(0)} ${(x + lean).toFixed(0)},${(H - h).toFixed(0)}`; }
          const grassP = s.el("path", { d: gd, fill: "none", stroke: "#2f8a3a", "stroke-width": 2.4, "stroke-linecap": "round", class: "later" });
          const grassL = s.el("path", { d: gl, fill: "none", stroke: "#74c05a", "stroke-width": 2.4, "stroke-linecap": "round", class: "later" });
          grass.append(grassL, grassP);
          const cardOf = (svg, t) => s.h("div", { class: "card", style: { padding: "8px 8px 10px", textAlign: "center" } }, svg, s.h("p", { class: "t", style: { marginTop: "6px", fontWeight: 700 } }, t));
          const grid = s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" } }, cardOf(wood, "Holz"), cardOf(fur, "Fell"), cardOf(brick, "Ziegel"), cardOf(grass, "Gras"));
          const rows = [
            box(s, "ex", "Holz", "Lange, wellige Linien, die um einen Ast kreisen."),
            box(s, "ex", "Fell", "Viele kurze Striche, immer in Wuchsrichtung."),
            box(s, "ex", "Ziegel", "Rechtecke, Reihe für Reihe versetzt."),
            box(s, "ex", "Gras", "Striche von unten nach oben, mal hell, mal dunkel."),
          ];
          const m = merk(s, "<b>Struktur</b> heißt: So sieht eine Oberfläche aus und so fühlt sie sich an.");
          s.add(cols(s, grid, stack(s, 10, ...rows, m), 540));
          s.step(async () => { s.sfx.scribble(); s.show(rows[0], "left"); s.show(woodP, "draw"); s.show(knot, "pop", 700); await s.wait(1100); });
          s.step(async () => { s.sfx.scribble(); s.show(rows[1], "left"); s.show(furP, "draw"); await s.wait(900); s.sfx.scribble(); await s.show(furL, "draw"); });
          s.step(async () => { s.sfx.snap(); s.show(rows[2], "left"); await s.show(brickP, "draw"); });
          s.step(async () => { s.sfx.scribble(); s.show(rows[3], "left"); s.show(grassL, "draw"); await s.wait(800); await s.show(grassP, "draw"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Schraffur",
        say: "Mit vielen Strichen nebeneinander kannst du Flächen dunkler machen. Das nennt man Schraffur.",
        build(s) {
          const W = 470, H = 230, aw = W - 40, ah = H - 30;
          const mk = () => { const svg = s.svg(W, H); svg.append(s.el("rect", { x: 20, y: 15, width: aw, height: ah, rx: 10, fill: "#f6f1fd" })); return svg; };
          const A = mk(), gA = clipG(s, A, 20, 15, aw, ah);
          const pA = s.el("path", { d: hatchD(aw, ah, 14, 1), fill: "none", stroke: PEN, "stroke-width": 2.2, "stroke-linejoin": "round", class: "later" });
          gA.append(pA);
          const B = mk(), gB = clipG(s, B, 20, 15, aw, ah);
          const pB1 = s.el("path", { d: hatchD(aw, ah, 14, 1), fill: "none", stroke: PEN, "stroke-width": 2.2, "stroke-linejoin": "round", class: "later" });
          const pB2 = s.el("path", { d: hatchD(aw, ah, 14, -1), fill: "none", stroke: PEN, "stroke-width": 2.2, "stroke-linejoin": "round", class: "later" });
          gB.append(pB1, pB2);
          const card = (svg, t, sub) => s.h("div", { class: "card", style: { padding: "10px 10px 14px", textAlign: "center" } }, svg, s.h("p", { class: "h2" }, t), s.h("p", { class: "small pencil", style: { marginTop: "4px" } }, sub));
          const grid = s.h("div", { class: "cols", style: { gap: "20px" } }, card(A, "Parallele Schraffur", "Viele gleiche Striche in eine Richtung."), card(B, "Kreuzschraffur", "Eine zweite Schicht quer darüber."));
          const m = merk(s, "Je <b>enger</b> die Striche und je <b>mehr Schichten</b>, desto dunkler wirkt die Fläche.");
          const life = box(s, "life", "Im Alltag", "Comics, Kupferstiche wie die von Albrecht Dürer und Schatten im Schulheft: alles aus feinen Strichen.");
          s.add(stack(s, 14, grid, m, life));
          s.step(async () => { s.sfx.scribble(); s.say("Erst die parallele Schraffur."); await s.show(pA, "draw"); });
          s.step(async () => { s.sfx.scribble(); s.say("Dann eine zweite Schicht quer darüber."); await s.show(pB1, "draw"); s.sfx.scribble(); await s.show(pB2, "draw"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Hell und Dunkel mit Strichen",
        say: "Stelle den Strichabstand ein. Enge Striche und viele Schichten machen die Fläche dunkel.",
        build(s) {
          const SW = 540, SH = 340, PH = 220;
          const svg = s.svg(SW, SH);
          svg.append(s.el("rect", { x: 0, y: 0, width: SW, height: PH, rx: 12, fill: "#f6f1fd" }));
          const g = clipG(s, svg, 0, 0, SW, PH);
          const lw = 2.2;
          const paths = [1, -1, 0].map(dir => { const p = s.el("path", { fill: "none", stroke: PEN, "stroke-width": lw, "stroke-linejoin": "round" }); g.append(p); return p; });
          let sp = 14, layers = 1;
          const cov = (sp, layers) => 1 - Math.pow(1 - clamp(lw / (sp / 1.414), 0, 1), layers);
          const tone = c => { const v = Math.round(250 - c * 190); return `rgb(${v},${v - 4},${v + 6})`; };
          // tone strip
          const strip = []; for (let i = 0; i < 6; i++) strip.push(s.el("rect", { x: i * 90, y: 258, width: 90, height: 50, fill: tone(i / 5 * 0.98), stroke: "#fff", "stroke-width": 1 }));
          svg.append(...strip);
          const marker = s.el("polygon", { points: "0,0 -11,-16 11,-16", fill: UC, transform: "translate(45 254)" });
          svg.append(marker,
            s.el("text", { x: 4, y: 334, class: "lbl", text: "hell" }),
            s.el("text", { x: SW - 4, y: 334, class: "lbl", "text-anchor": "end", text: "dunkel" }));
          const word = s.h("p", { class: "big violet" });
          const draw = () => {
            paths[0].setAttribute("d", hatchD(SW, PH, sp, 1));
            paths[1].setAttribute("d", hatchD(SW, PH, sp, -1));
            let d3 = ""; for (let y = 0; y <= PH + 10; y += sp / 1.414) d3 += `M-10,${y.toFixed(1)}L${SW + 10},${y.toFixed(1)}`;
            paths[2].setAttribute("d", d3);
            paths.forEach((p, i) => p.setAttribute("display", i < layers ? "" : "none"));
            const c = cov(sp, layers);
            marker.setAttribute("transform", `translate(${(15 + c * (SW - 30)).toFixed(1)} 254)`);
            word.textContent = c < 0.35 ? "Hell" : c < 0.6 ? "Mittelgrau" : c < 0.85 ? "Dunkel" : "Fast schwarz";
          };
          draw();
          const sl1 = s.slider({ label: "Strichabstand", min: 4, max: 26, step: 2, value: 14, fmt: v => v + " px", onInput: v => { sp = v; draw(); } });
          const sl2 = s.slider({ label: "Schichten", min: 1, max: 3, step: 1, value: 1, onInput: v => { layers = v; draw(); } });
          sl1.classList.add("later"); sl2.classList.add("later");
          const m = merk(s, "<b>Hell-Dunkel</b> entsteht nur durch Strichabstand und Schichten. Weniger Papier bleibt weiß, die Fläche wird dunkler.");
          s.add(cols(s, svg, stack(s, 12, s.h("p", { class: "t" }, "So wirkt die Fläche:"), word, sl1, sl2, m), 540));
          s.show(paths[0], "draw").then(() => { paths[0].classList.remove("a-draw"); paths[0].style.strokeDasharray = ""; });
          s.sfx.scribble();
          s.step(async () => { s.sfx.pop(); s.say("Verändere den Abstand der Striche."); await s.show(sl1, "up"); });
          s.step(async () => { s.sfx.pop(); s.say("Und die Anzahl der Schichten."); await s.show(sl2, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Licht und Schatten",
        say: "Zieh die Sonne hin und her. Der Schatten wandert immer auf die andere Seite.",
        build(s) {
          const svg = s.svg(540, 540);
          const grad = s.el("radialGradient", { id: "ballg", cx: 0.5, cy: 0.5, r: 0.62, fx: 0.35, fy: 0.3 },
            s.el("stop", { offset: 0, "stop-color": "#f5f0ff" }), s.el("stop", { offset: 0.5, "stop-color": "#a99ad6" }), s.el("stop", { offset: 1, "stop-color": "#352a63" }));
          svg.append(s.el("defs", {}, grad),
            s.el("rect", { x: 0, y: 420, width: 540, height: 120, fill: "#efe9fa" }),
            s.el("line", { x1: 0, y1: 420, x2: 540, y2: 420, stroke: "#cdbfee", "stroke-width": 2 }));
          const shadow = s.el("ellipse", { cx: 330, cy: 432, rx: 120, ry: 20, fill: "rgba(40,30,70,.38)", class: "later" });
          const contact = s.el("ellipse", { cx: 270, cy: 421, rx: 58, ry: 8, fill: "rgba(30,20,60,.5)", class: "later" });
          const ball = s.el("circle", { cx: 270, cy: 315, r: 105, fill: "#d9d0f0", stroke: PEN, "stroke-width": 3 });
          const shine = s.el("ellipse", { cx: 230, cy: 250, rx: 18, ry: 11, fill: "#fff", class: "later" });
          const beam = s.el("line", { stroke: "#e0a800", "stroke-width": 3, "stroke-dasharray": "8 8", "stroke-linecap": "round" });
          const sun = s.el("g", { class: "later" }, beam);
          const sunBody = s.el("g", {});
          for (let i = 0; i < 8; i++) sunBody.append(s.el("line", { x1: 36 * Math.cos(i * 45 * RAD), y1: 36 * Math.sin(i * 45 * RAD), x2: 48 * Math.cos(i * 45 * RAD), y2: 48 * Math.sin(i * 45 * RAD), stroke: "#e0a800", "stroke-width": 5, "stroke-linecap": "round" }));
          sunBody.append(s.el("circle", { r: 28, fill: "#ffd94a", stroke: "#e0a800", "stroke-width": 4 }));
          const hit = s.el("circle", { r: 62, fill: "transparent" });
          sunBody.append(hit);
          sun.append(sunBody);
          svg.append(shadow, contact, ball, shine, sun);
          let lx = 130, ly = 120, lit = false;
          const upd = () => {
            sunBody.setAttribute("transform", `translate(${lx} ${ly})`);
            const dx = lx - 270, dy = ly - 315, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
            grad.setAttribute("fx", (0.5 + ux * 0.3).toFixed(3)); grad.setAttribute("fy", (0.5 + uy * 0.3).toFixed(3));
            shine.setAttribute("cx", (270 + ux * 62).toFixed(1)); shine.setAttribute("cy", (315 + uy * 62).toFixed(1));
            beam.setAttribute("x1", lx); beam.setAttribute("y1", ly);
            beam.setAttribute("x2", (270 + ux * 140).toFixed(1)); beam.setAttribute("y2", (315 + uy * 140).toFixed(1));
            const h = 420 - ly, ox = -dx * 140 / h;
            shadow.setAttribute("cx", (270 + ox).toFixed(1)); shadow.setAttribute("rx", (100 + Math.abs(ox) * 0.5).toFixed(1));
          };
          upd();
          s.drag(sunBody, { space: svg, onMove: p => { lx = clamp(p.x, 50, 490); ly = clamp(p.y, 50, 240); upd(); s.sfx.tick(); } });
          const mkRow = (label, col, html) => {
            const e = box(s, "ex", "", html);
            e.insertBefore(s.h("span", { class: "exlabel", style: { color: col } }, label), e.firstChild);
            return e;
          };
          const r1 = mkRow("Das Licht", "#c99700", "Die Sonne, eine Lampe oder die Taschenlampe. Ziehe sie mit dem Finger!");
          const r2 = mkRow("Eigenschatten", UC, "Die dunkle Seite am Ball selbst. Beispiel: ein Fußball, auf der Seite weg von der Sonne.");
          const r3 = mkRow("Schlagschatten", "#5d6678", "Der Schatten, den der Ball auf den Boden wirft. Beispiel: dein Schatten auf dem Schulhof.");
          const r4 = mkRow("Glanzlicht", "#8a7fb0", "Der hellste Punkt, wo das Licht spiegelt. Beispiel: eine Murmel oder ein glatter Apfel.");
          s.add(cols(s, svg, stack(s, 10, r1, r2, r3, r4), 540));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); s.say("Wir schalten das Licht an."); s.show(r1, "left"); await s.show(sun, "down"); });
          s.step(async () => { s.sfx.pop(); s.say("Die Seite weg vom Licht wird dunkel. Das ist der Eigenschatten."); ball.setAttribute("fill", "url(#ballg)"); s.show(r2, "left"); await s.wait(500); });
          s.step(async () => { s.sfx.drum(); s.say("Der Ball wirft einen Schatten auf den Boden."); s.show(contact, "fade"); s.show(r3, "left"); await s.show(shadow, "fade"); });
          s.step(async () => { s.sfx.ding(); s.say("Und dort, wo das Licht spiegelt, glänzt es."); s.show(r4, "left"); await s.show(shine, "pop"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Auch ein Würfel hat Schatten",
        say: "Beim Würfel hat jede Seite einen eigenen Grauwert. Wähle, woher das Licht kommt.",
        build(s) {
          const svg = s.svg(540, 430);
          svg.append(s.el("rect", { x: 0, y: 330, width: 540, height: 100, fill: "#efe9fa" }));
          const P = {
            top: "270,70 390,130 270,190 150,130",
            left: "150,130 270,190 270,330 150,270",
            right: "270,190 390,130 390,270 270,330",
          };
          const shadow = s.el("polygon", { points: "270,330 390,270 500,315 380,375", fill: "rgba(40,30,70,.35)", class: "later" });
          const faces = {};
          for (const k of ["top", "left", "right"]) { faces[k] = s.el("polygon", { points: P[k], fill: "#fff", stroke: PEN, "stroke-width": 4, "stroke-linejoin": "round", class: "later" }); }
          const sun = s.el("g", { class: "later" });
          for (let i = 0; i < 8; i++) sun.append(s.el("line", { x1: 26 * Math.cos(i * 45 * RAD), y1: 26 * Math.sin(i * 45 * RAD), x2: 36 * Math.cos(i * 45 * RAD), y2: 36 * Math.sin(i * 45 * RAD), stroke: "#e0a800", "stroke-width": 4, "stroke-linecap": "round" }));
          sun.append(s.el("circle", { r: 20, fill: "#ffd94a", stroke: "#e0a800", "stroke-width": 3 }));
          sun.setAttribute("transform", "translate(70 60)");
          svg.append(shadow, faces.left, faces.right, faces.top, sun);
          const modes = {
            links: { L: { top: 84, left: 93, right: 50 }, sun: [70, 60], sh: "270,330 390,270 500,315 380,375" },
            oben: { L: { top: 96, left: 70, right: 70 }, sun: [270, 34], sh: "150,270 270,330 390,270 270,350 " },
            rechts: { L: { top: 84, left: 50, right: 93 }, sun: [470, 60], sh: "270,330 150,270 40,315 160,375" },
          };
          const cur = { top: 84, left: 93, right: 50 }, pos = { x: 70, y: 60 };
          const paint = () => { for (const k of ["top", "left", "right"]) faces[k].setAttribute("fill", `hsl(265 28% ${cur[k].toFixed(1)}%)`); sun.setAttribute("transform", `translate(${pos.x.toFixed(1)} ${pos.y.toFixed(1)})`); };
          const btns = {};
          const set = name => {
            const m = modes[name]; shadow.setAttribute("points", m.sh);
            Object.entries(btns).forEach(([k, b]) => b.classList.toggle("solid", k === name));
            const f = { ...cur }, p0 = { ...pos };
            s.tween({ from: 0, to: 1, dur: 450, update: v => { for (const k in f) cur[k] = f[k] + (m.L[k] - f[k]) * v; pos.x = p0.x + (m.sun[0] - p0.x) * v; pos.y = p0.y + (m.sun[1] - p0.y) * v; paint(); } });
          };
          for (const name of ["links", "oben", "rechts"]) btns[name] = s.h("button", { class: "btn later", onclick: () => { s.sfx.swoosh(); set(name); } }, (name === "oben" ? "von oben" : name === "links" ? "von links" : "von rechts"));
          paint();
          const row = s.h("div", { class: "row", style: { gap: "10px", flexWrap: "nowrap" } }, ...Object.values(btns));
          const r1 = box(s, "ex", "Drei Seiten, drei Grauwerte", "Die Seite zum Licht ist hell, die abgewandte dunkel, die dritte liegt dazwischen.");
          const r2 = box(s, "ex", "Schlagschatten", "Er fällt auf den Boden, immer weg vom Licht.");
          const r3 = box(s, "life", "Im Alltag", "Ein Karton im Zimmer, ein Haus in der Sonne, Bauklötze: überall dieselben drei Grautöne.");
          s.add(cols(s, stack(s, 12, svg, row), stack(s, 12, r1, r2, r3), 540));
          s.show(svg, "zoom");
          s.step(async () => { s.sfx.snap(); await s.show([faces.left, faces.right, faces.top], "pop"); });
          s.step(async () => { s.sfx.whoosh(); s.say("Das Licht kommt von links."); s.show(sun, "down"); shadow.classList.remove("later"); set("links"); s.show(r1, "left"); s.show(r2, "left", 150); s.show(btns.links, "up"); s.show(btns.oben, "up", 100); await s.show(btns.rechts, "up", 200); });
          s.step(async () => { s.sfx.ding(); s.say("Probiere jede Lichtrichtung aus."); await s.show(r3, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Frottage: Muster rubbeln",
        say: "Lege ein Blatt unter das Papier und rubble mit dem Stift darüber. Das Muster erscheint wie von selbst.",
        build(s) {
          const CW = 540, CH = 420, K = 2;
          const { canvas, g } = s.canvas(CW, CH);
          const mk = () => { const c = document.createElement("canvas"); c.width = CW * K; c.height = CH * K; const x = c.getContext("2d"); x.scale(K, K); return [c, x]; };
          const [tex, tg] = mk(), [mark, mg] = mk(), [tmp, tp] = mk();
          const leaf = new Path2D("M270,360 C130,300 120,130 270,40 C420,130 410,300 270,360 Z");
          tg.fillStyle = "rgba(0,0,0,.07)"; tg.fillRect(0, 0, CW, CH);
          tg.fillStyle = "rgba(0,0,0,.45)"; tg.fill(leaf);
          tg.strokeStyle = "rgba(0,0,0,.95)"; tg.lineCap = "round"; tg.lineWidth = 2.5; tg.stroke(leaf);
          tg.lineWidth = 5; tg.beginPath(); tg.moveTo(270, 415); tg.lineTo(270, 70); tg.stroke();
          tg.lineWidth = 3.5;
          for (let i = 0; i < 6; i++) { const y = 320 - i * 45, run = 95 - i * 11; for (const sg of [-1, 1]) { tg.beginPath(); tg.moveTo(270, y); tg.lineTo(270 + sg * run, y - 42); tg.stroke(); } }
          let hint = 0, pen = null;
          const draw = () => {
            g.clearRect(0, 0, CW, CH); g.fillStyle = "#fff"; g.fillRect(0, 0, CW, CH);
            if (hint > 0) { g.save(); g.globalAlpha = hint; g.setLineDash([9, 9]); g.strokeStyle = "#b3a5de"; g.lineWidth = 3; g.stroke(leaf); g.restore(); }
            g.drawImage(mark, 0, 0, CW, CH);
            if (pen) { g.save(); g.translate(pen.x, pen.y); g.rotate(-0.9); g.fillStyle = "#f2b630"; g.fillRect(0, -7, 70, 14); g.fillStyle = "#e9c9a0"; g.beginPath(); g.moveTo(0, -7); g.lineTo(-20, 0); g.lineTo(0, 7); g.fill(); g.fillStyle = "#444"; g.beginPath(); g.moveTo(-14, -2); g.lineTo(-20, 0); g.lineTo(-14, 2); g.fill(); g.restore(); }
          };
          const rub = (x0, y0, x1, y1) => {
            tp.clearRect(0, 0, CW, CH); tp.globalCompositeOperation = "source-over";
            tp.strokeStyle = "rgba(60,48,90,.5)"; tp.lineWidth = 5; tp.lineCap = "round";
            for (const o of [-9, -3, 3, 9]) { tp.beginPath(); tp.moveTo(x0 + o * .7, y0 + o * .7); tp.lineTo(x1 + o * .7, y1 + o * .7); tp.stroke(); }
            tp.globalCompositeOperation = "destination-in"; tp.drawImage(tex, 0, 0, CW, CH);
            mg.drawImage(tmp, 0, 0, CW, CH);
          };
          draw();
          let last = null;
          s.drag(canvas, { space: canvas, onStart: p => { last = p; }, onMove: p => { if (!last) return; rub(last.x, last.y, p.x, p.y); last = p; pen = null; draw(); if (Math.random() < .25) s.sfx.tick(); }, onEnd: () => { last = null; } });
          const btnNew = s.h("button", { class: "btn", onclick: () => { s.sfx.swoosh(); mg.clearRect(0, 0, CW, CH); draw(); } }, "Neu starten");
          const r1 = box(s, "ex", "1 · Vorbereiten", "Lege ein Blatt unter das Papier.");
          const r2 = box(s, "ex", "2 · Rubbeln", "Reibe mit der flachen Mine darüber.");
          const r3 = box(s, "ex", "3 · Staunen", "Das Muster erscheint wie von Zauberhand!");
          const m = merk(s, "<b>Frottage</b> kommt vom französischen „frotter“ = reiben. Der Künstler Max Ernst nutzte die Technik ab 1925.");
          const life = box(s, "life", "Jetzt du!", "Rubble mit dem Finger. Im Alltag klappt das mit Münzen, Baumrinde oder Steinwänden.");
          s.add(cols(s, stack(s, 12, s.h("div", { class: "card", style: { padding: "8px" } }, canvas), s.h("div", { class: "row" }, btnNew)), stack(s, 10, r1, r2, r3, m, life), 556));
          s.step(async () => { s.sfx.pop(); s.show(r1, "left"); await s.tween({ from: 0, to: 1, dur: 700, update: v => { hint = v; draw(); } }); });
          s.step(async () => {
            s.show(r2, "left"); s.say("Jetzt rubbelt der Stift hin und her.");
            const pts = []; let flip = false;
            for (let y = 40; y <= 400; y += 26) { pts.push(flip ? [450, y] : [90, y]); pts.push(flip ? [90, y] : [450, y]); flip = !flip; }
            const segs = []; let tot = 0;
            for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push([tot, l, pts[i - 1], pts[i]]); tot += l; }
            const at = d => { for (const [st, l, a, b] of segs) if (d <= st + l) { const t = (d - st) / l; return { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t }; } return { x: pts[pts.length - 1][0], y: pts[pts.length - 1][1] }; };
            let prev = at(0), k = 0;
            s.sfx.scribble();
            await s.tween({ from: 0, to: tot, dur: 3200, ease: "linear", update: d => { const p = at(d); rub(prev.x, prev.y, p.x, p.y); prev = p; pen = p; if (++k % 10 === 0) s.sfx.tick(); draw(); } });
            pen = null; draw();
          });
          s.step(async () => { s.sfx.success(); s.show(r3, "left"); await s.show(m, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Zeichenwerkzeuge",
        say: "Jedes Werkzeug macht eine andere Linie: Bleistift, Fineliner, Kohle und Tusche.",
        build(s) {
          const R = rng(11);
          const W = 230, H = 110, wav = "M14,70 C60,10 90,110 130,56 S190,20 216,52";
          const mkSvg = () => s.svg(W, H);
          // pencil
          const sp = mkSvg();
          const pen = [0, 1, 2].map(i => s.el("path", { d: wav, transform: `translate(${i * 1.5 - 1.5} ${i * 1.2 - 1})`, fill: "none", stroke: "#5d5d6c", "stroke-width": 2.2, "stroke-linecap": "round", opacity: .6, class: "later" }));
          sp.append(...pen);
          // fineliner
          const sf = mkSvg(), fine = s.el("path", { d: wav, fill: "none", stroke: "#0f0f18", "stroke-width": 2.6, "stroke-linecap": "round", class: "later" });
          sf.append(fine);
          // charcoal
          const sk = mkSvg(), kg = s.el("g", { class: "later" });
          [[16, .3], [11, .35], [6, .45]].forEach(([w, o]) => kg.append(s.el("path", { d: wav, fill: "none", stroke: "#1c1c22", "stroke-width": w, "stroke-linecap": "round", opacity: o })));
          for (let i = 0; i < 40; i++) kg.append(s.el("circle", { cx: 14 + R() * 205, cy: 25 + R() * 70, r: .8 + R() * 1.6, fill: "#2a2a30", opacity: .35 }));
          sk.append(kg);
          // ink brush
          const st = mkSvg(); const up = [], lo = [];
          for (let i = 0; i <= 40; i++) { const t = i / 40, x = 14 + t * 202, y = 70 - 46 * Math.sin(t * 3.1) + 10 * Math.sin(t * 9), wd = 1.5 + 8 * Math.sin(Math.PI * Math.pow(t, .8)); up.push([x, y - wd]); lo.push([x, y + wd]); }
          const tus = s.el("path", { d: dotsD(up) + dotsD(lo.reverse()).replace("M", "L") + "Z", fill: "#0a0a16", class: "later" });
          st.append(tus);
          const defs = [
            [sp, "Bleistift", "Gibt es hart und weich (H und B). Man kann ihn radieren.", () => s.show(pen, "draw")],
            [sf, "Fineliner", "Feine, gleichmäßige Linie. Super für Comic-Konturen.", () => s.show(fine, "draw")],
            [sk, "Kohle", "Tiefschwarz und weich. Mit dem Finger kann man sie verwischen.", () => s.show(kg, "fade")],
            [st, "Tusche", "Flüssige Farbe, mit Feder oder Pinsel. Mal dünn, mal dick.", () => s.show(tus, "left")],
          ];
          const cards = defs.map(([svg, t, txt]) => s.h("div", { class: "card", style: { padding: "12px 12px 16px" } }, svg, s.h("p", { class: "h2", style: { margin: "6px 0 6px" } }, t), s.h("p", { class: "small", html: txt })));
          const life = box(s, "life", "Im Alltag", "Bleistift in der Schule, Fineliner für Hefte und Comics, Kohle im Kunststudio, Tusche für Kalligrafie.");
          s.add(stack(s, 16, s.h("div", { class: "cols4" }, ...cards), life));
          defs.forEach(([, , , run], i) => s.step(async () => { s.sfx.scribble(); s.say(["Der Bleistift.", "Der Fineliner.", "Kohle.", "Und Tusche."][i]); await run(); if (i === 3) { s.sfx.ding(); await s.show(life, "up"); } }));
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Bleistift: H und B",
        say: "H heißt hart, B heißt weich. Probiere den Regler und sieh, wie dunkel jeder Bleistift zeichnet.",
        build(s) {
          const GR = ["4H", "2H", "H", "F", "HB", "B", "2B", "4B", "6B"];
          const DK = [.2, .28, .38, .5, .6, .72, .83, .93, 1], WD = [1.2, 1.5, 1.8, 2.2, 2.6, 3.2, 3.8, 4.6, 5.4];
          const svg = s.svg(1100, 236);
          const frames = [], strokes = [];
          GR.forEach((gr, i) => {
            const cx = 60 + i * 122.5;
            const fr = s.el("rect", { x: cx - 56, y: 8, width: 112, height: 150, rx: 14, fill: "#fff", stroke: "#c8d3de", "stroke-width": 3 });
            let d = ""; for (let k = 0; k < 7; k++) { const y = 28 + k * 18; d += k % 2 ? `L${cx - 38},${y}` : `${k ? "L" : "M"}${cx - 38},${y}L${cx + 38},${y - 4}`; }
            d = ""; for (let k = 0; k < 6; k++) { const y = 28 + k * 17; d += (k ? "L" : "M") + (k % 2 ? `${cx + 38},${y}L${cx - 38},${y + 3}` : `${cx - 38},${y}L${cx + 38},${y - 2}`); }
            const p = s.el("path", { d, fill: "none", stroke: "#26263a", "stroke-width": WD[i], "stroke-linecap": "round", "stroke-linejoin": "round", opacity: DK[i], class: "later" });
            frames.push(fr); strokes.push(p);
            svg.append(fr, p, s.el("text", { x: cx, y: 148, "text-anchor": "middle", "font-size": 28, "font-weight": 800, fill: INK, text: gr }));
          });
          const sel = s.el("rect", { x: 4, y: 4, width: 120, height: 158, rx: 16, fill: "none", stroke: UC, "stroke-width": 5, class: "later" });
          svg.append(sel);
          const axis = s.el("g", { class: "later" },
            s.el("line", { x1: 60, y1: 190, x2: 1040, y2: 190, stroke: INK, "stroke-width": 3 }),
            s.el("polygon", { points: "1052,190 1034,181 1034,199", fill: INK }),
            s.el("polygon", { points: "48,190 66,181 66,199", fill: INK }),
            s.el("text", { x: 48, y: 228, "font-size": 22, "font-weight": 700, fill: INK, text: "H = hart (engl. hard): hell und fein" }),
            s.el("text", { x: 1052, y: 228, "text-anchor": "end", "font-size": 22, "font-weight": 700, fill: INK, text: "B = schwarz (engl. black): dunkel und weich" }));
          svg.append(axis);
          const big = s.h("p", { class: "huge violet" }), desc = s.h("p", { class: "t", style: { minHeight: "68px" } });
          const upd = v => {
            big.textContent = GR[v];
            desc.textContent = v <= 2 ? "Hart: feine, helle Linien. Gut für genaue Zeichnungen." : v === 3 ? "F steht für „firm“ (fest): zwischen hart und mittel." : v === 4 ? "HB: die goldene Mitte. Zum Schreiben und zum Zeichnen." : "Weich: dunkle, satte Striche. Gut zum Schattieren.";
            sel.setAttribute("x", 60 + v * 122.5 - 60);
          };
          const sl = s.slider({ label: "Bleistift wählen", min: 0, max: 8, step: 1, value: 4, fmt: v => GR[v], onInput: v => { upd(v); } });
          sl.classList.add("later"); big.classList.add("later"); desc.classList.add("later");
          upd(4);
          const m = merk(s, "Je größer die Zahl vor dem <b>H</b>, desto härter. Je größer die Zahl vor dem <b>B</b>, desto weicher und dunkler. Zum Schattieren nimmst du B.");
          const life = box(s, "life", "Im Alltag", "Schule: HB. Technische Zeichnungen: H. Schattieren und Skizzen: 2B bis 6B.");
          const left = stack(s, 10, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "24px" } }, big, desc), sl, life);
          s.add(stack(s, 14, svg, s.h("div", { class: "cols", style: { alignItems: "center" } }, left, m)));
          s.step(async () => { s.sfx.scribble(); s.say("Neun Bleistifte, von hart bis weich."); await s.show(strokes, "draw"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(axis, "fade"); });
          s.step(async () => { s.sfx.pop(); s.show(sel, "pop"); s.show([big, desc], "up"); await s.show(sl, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Dürers Feldhase",
        say: "Albrecht Dürer hat 1502 einen Feldhasen gemalt. Wir zeichnen ihn vereinfacht nach, Schicht für Schicht.",
        build(s) {
          const R = rng(21);
          const svg = s.svg(560, 540);
          const inside = (x, y) => ((x - 270) / 170) ** 2 + ((y - 330) / 120) ** 2 < 1 || ((x - 340) / 120) ** 2 + ((y - 365) / 110) ** 2 < 1 || ((x - 150) / 78) ** 2 + ((y - 270) / 62) ** 2 < 1 || ((x - 150) / 45) ** 2 + ((y - 400) / 75) ** 2 < 1;
          let dark = "", light = "";
          for (let n = 0; n < 260;) { const x = 70 + R() * 400, y = 210 + R() * 270; if (!inside(x, y)) continue; const a = 0.3 + (R() - .5) * 0.9, l = 11 + R() * 9; dark += `M${x.toFixed(0)},${y.toFixed(0)}l${(l * Math.cos(a)).toFixed(0)},${(l * Math.sin(a)).toFixed(0)}`; n++; }
          for (let n = 0; n < 170;) { const x = 70 + R() * 400, y = 210 + R() * 270; if (!inside(x, y)) continue; const a = 0.3 + (R() - .5) * 0.9, l = 9 + R() * 8; light += `M${x.toFixed(0)},${y.toFixed(0)}l${(l * Math.cos(a)).toFixed(0)},${(l * Math.sin(a)).toFixed(0)}`; n++; }
          const ol = { stroke: "#6b4a2a", "stroke-width": 3 };
          const shapes = [
            s.el("ellipse", Object.assign({ cx: 210, cy: 155, rx: 26, ry: 84, fill: "#b98a56", transform: "rotate(18 210 155)", class: "later" }, ol)),
            s.el("ellipse", Object.assign({ cx: 168, cy: 160, rx: 24, ry: 82, fill: "#c29363", transform: "rotate(4 168 160)", class: "later" }, ol)),
            s.el("ellipse", Object.assign({ cx: 270, cy: 330, rx: 170, ry: 120, fill: "#c79a63", class: "later" }, ol)),
            s.el("ellipse", Object.assign({ cx: 340, cy: 365, rx: 120, ry: 110, fill: "#b98a56", class: "later" }, ol)),
            s.el("ellipse", Object.assign({ cx: 150, cy: 400, rx: 45, ry: 75, fill: "#d2a874", class: "later" }, ol)),
            s.el("ellipse", Object.assign({ cx: 150, cy: 270, rx: 78, ry: 62, fill: "#c79a63", class: "later" }, ol)),
            s.el("ellipse", Object.assign({ cx: 100, cy: 287, rx: 30, ry: 22, fill: "#d9b37f", class: "later" }, ol)),
          ];
          const shade = s.el("ellipse", { cx: 290, cy: 482, rx: 210, ry: 20, fill: "rgba(60,40,20,.25)" });
          const furD = s.el("path", { d: dark, fill: "none", stroke: "#5a3a1c", "stroke-width": 2.2, "stroke-linecap": "round", class: "later" });
          const furL = s.el("path", { d: light, fill: "none", stroke: "#f3dcae", "stroke-width": 2.2, "stroke-linecap": "round", class: "later" });
          const eye = s.el("g", { class: "later" }, s.el("circle", { cx: 128, cy: 252, r: 15, fill: "#2b1a10" }),
            s.el("rect", { x: 121, y: 245, width: 8, height: 8, fill: "#fff" }), s.el("path", { d: "M125,245V253M121,249H129", stroke: "#2b1a10", "stroke-width": 1.2 }),
            s.el("circle", { cx: 100, cy: 282, r: 5, fill: "#6b3a22" }));
          const wh = s.el("path", { d: "M80,290 L10,274 M80,296 L8,300 M82,302 L16,326", fill: "none", stroke: "#5a3a1c", "stroke-width": 2, "stroke-linecap": "round", class: "later" });
          svg.append(shade, ...shapes, furD, furL, eye, wh);
          const mkRow = (label, html) => box(s, "ex", label, html);
          const r1 = mkRow("Albrecht Dürer", "1471 in Nürnberg geboren, 1528 gestorben. Nach ihm heißt dein Gymnasium.");
          const r2 = mkRow("Der Feldhase, 1502", "Aquarell- und Deckfarben, heute in der Albertina in Wien. Das Bild ist etwa 25 mal 23 Zentimeter klein.");
          const r3 = mkRow("Haar für Haar", "Dürer malte viele Schichten übereinander: erst braune Töne, dann lauter feine Haare.");
          const r4 = mkRow("Der Fensterblitz", "Im Auge des Hasen spiegelt sich ein Fenster.");
          const note = s.h("p", { class: "small pencil later", html: "Unser Hase ist selbst gezeichnet, vereinfacht und im Stil von Dürer." });
          s.add(cols(s, svg, stack(s, 10, r1, r2, r3, r4, note), 560));
          s.step(async () => { s.sfx.pop(); s.show(r1, "left"); s.show(shapes, "pop"); await s.wait(1000); });
          s.step(async () => { s.sfx.scribble(); s.show(r2, "left"); await s.show(furD, "draw"); });
          s.step(async () => { s.sfx.scribble(); s.show(r3, "left"); await s.show(furL, "draw"); });
          s.step(async () => { s.sfx.ding(); s.show(r4, "left"); s.show(wh, "draw"); await s.show(eye, "bounce"); s.show(note, "fade"); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Dürer mit 13 Jahren",
        say: "Schon als Kind konnte Dürer toll zeichnen. Mit dreizehn zeichnete er sich selbst, mit einem Silberstift.",
        build(s) {
          const svg = s.svg(360, 540);
          const st = { fill: "none", stroke: "#7c8296", "stroke-width": 2.4, "stroke-linecap": "round", "stroke-linejoin": "round", class: "later" };
          const ds = [
            "M100,200 C100,110 260,110 260,200 C264,280 230,340 180,345 C130,340 96,280 100,200Z",
            "M96,205 C90,120 150,80 200,88 C250,90 275,140 262,205 C250,160 230,140 190,138 C150,140 118,160 96,205",
            "M120,150 C140,120 170,112 190,116 M150,98 C170,110 190,106 215,104 M232,120 C248,140 252,160 256,185 M110,176 C116,150 124,140 134,130",
            "M128,215 q18,-14 36,0 q-18,10 -36,0 M198,215 q18,-14 36,0 q-18,10 -36,0",
            "M124,196 q22,-12 42,-2 M196,194 q22,-10 42,2",
            "M181,224 q-12,40 -6,56 q8,6 20,0",
            "M152,302 q28,14 56,0 M160,297 q20,-8 40,0",
            "M100,225 q-24,10 -8,42 q6,8 14,0 M260,225 q24,10 8,42 q-6,8 -14,0",
            "M150,338 L146,395 M214,338 L218,395 M146,395 C90,410 50,430 30,486 M218,395 C270,410 310,430 330,486 M146,395 q34,40 72,0",
          ].map(d => s.el("path", Object.assign({ d }, st)));
          const pup = s.el("g", { class: "later" }, s.el("circle", { cx: 146, cy: 214, r: 4.5, fill: "#7c8296" }), s.el("circle", { cx: 216, cy: 214, r: 4.5, fill: "#7c8296" }));
          svg.append(s.el("rect", { x: 10, y: 10, width: 340, height: 488, rx: 14, fill: "#f0f1f5", stroke: "#c8d3de", "stroke-width": 3 }), ...ds, pup,
            s.el("text", { x: 180, y: 522, "text-anchor": "middle", "font-size": 20, fill: "#5d6678", text: "Silberstift-Stil, selbst gezeichnet" }));
          const rows = [
            ["1471", "Dürer wird in Nürnberg geboren."],
            ["1484", "Mit 13 zeichnet er sich selbst, mit einem Silberstift. Das Bild ist heute in der Albertina in Wien."],
            ["1502", "Er malt den Feldhasen."],
            ["1525", "Sein Buch „Underweysung der Messung“ erscheint."],
            ["1528", "Dürer stirbt in Nürnberg."],
          ].map(([y, t]) => s.h("div", { class: "later", style: { display: "grid", gridTemplateColumns: "96px 1fr", gap: "14px", alignItems: "baseline" } }, s.h("p", { class: "h2 violet" }, y), s.h("p", { class: "t", html: t })));
          const m = merk(s, "Das Selbstbildnis von 1484 ist eine der frühesten erhaltenen Kinderzeichnungen überhaupt. Später schrieb Dürer dazu: Da war ich noch ein Kind.");
          s.add(cols(s, svg, stack(s, 12, ...rows, m), 360));
          s.step(async () => { s.sfx.scribble(); s.show(rows[0], "left"); s.show(ds.slice(0, 3), "draw"); await s.wait(1700); s.show(ds.slice(3, 9), "draw"); s.show(pup, "pop", 500); await s.wait(1400); });
          s.step(async () => { s.sfx.pop(); s.say("Mit dreizehn Jahren hat Dürer sich selbst gezeichnet."); await s.show(rows[1], "left"); });
          s.step(async () => { s.sfx.pop(); s.show(rows[2], "left"); await s.show(rows[3], "left", 250); await s.show(rows[4], "left", 100); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Im Alltag: Zeichnen überall",
        say: "Punkt, Linie und Fläche begegnen dir jeden Tag: im Comic, im Emoji, auf der Karte, auf Schildern.",
        build(s) {
          const S = (d, extra) => s.el("path", Object.assign({ d, fill: "none", stroke: INK, "stroke-width": 4, "stroke-linecap": "round", "stroke-linejoin": "round", class: "later" }, extra));
          const items = [];
          const card = (title, sub, svg) => s.h("div", { class: "card later", style: { padding: "12px 14px 14px" } }, svg, s.h("p", { class: "h2", style: { fontSize: "26px", margin: "4px 0" } }, title), s.h("p", { class: "small", html: sub }));
          // 1 comic
          { const svg = s.svg(300, 130); svg.append(s.el("rect", { x: 8, y: 6, width: 284, height: 118, rx: 6, fill: "#fff9d6", stroke: INK, "stroke-width": 4 }));
            const draws = [S("M24,56 L52,56 M20,76 L48,76 M26,96 L54,96", { "stroke-width": 3 }), S("M143,52 C143,22 270,22 270,52 C270,78 215,80 190,78 L172,100 L176,76 C152,70 143,64 143,52Z", { fill: "#fff" })];
            const face = s.el("g", { class: "later" }, s.el("circle", { cx: 88, cy: 76, r: 28, fill: "#ffd9a8", stroke: INK, "stroke-width": 4 }), s.el("circle", { cx: 78, cy: 70, r: 3.5, fill: INK }), s.el("circle", { cx: 98, cy: 70, r: 3.5, fill: INK }), s.el("path", { d: "M76,84 Q88,98 100,84Z", fill: "#e8644b", stroke: INK, "stroke-width": 3 }));
            const tx = s.el("text", { x: 207, y: 58, "text-anchor": "middle", "font-size": 24, "font-weight": 800, fill: INK, class: "later", text: "Boing!" });
            svg.append(face, ...draws, tx); const c = card("Comics", "Linien zeigen Tempo und Gefühle.", svg); items.push([c, async () => { s.show(face, "pop"); s.show(draws[0], "draw"); await s.wait(400); s.show(draws[1], "draw"); await s.wait(500); s.show(tx, "pop"); }]); }
          // 2 emoji
          { const svg = s.svg(300, 130); svg.append(s.el("circle", { cx: 150, cy: 66, r: 54, fill: "#ffe066", stroke: INK, "stroke-width": 4 }));
            const ps = [s.el("circle", { cx: 128, cy: 52, r: 6, fill: INK, class: "later" }), s.el("circle", { cx: 172, cy: 52, r: 6, fill: INK, class: "later" })];
            const sm = S("M118,78 Q150,108 182,78"); svg.append(...ps, sm);
            const c = card("Emojis", "Zwei Punkte und eine Linie: schon lacht es.", svg); items.push([c, async () => { s.show(ps, "pop"); await s.wait(400); s.sfx.boing(); await s.show(sm, "draw"); }]); }
          // 3 map
          { const svg = s.svg(300, 130); svg.append(s.el("rect", { x: 8, y: 6, width: 284, height: 118, rx: 10, fill: "#f1efe6", stroke: "#c8d3de", "stroke-width": 3 }));
            const park = s.el("path", { d: "M26,22 L110,18 L122,60 L40,70Z", fill: "#a9d98a", class: "later" });
            const line = S("M24,104 L100,104 L150,62 L276,62", { stroke: UC, "stroke-width": 7 });
            const stops = [[24, 104], [100, 104], [150, 62], [276, 62]].map(([x, y]) => s.el("circle", { cx: x, cy: y, r: 8, fill: "#fff", stroke: INK, "stroke-width": 3, class: "later" }));
            svg.append(park, line, ...stops); const c = card("Karten", "Punkt = Haltestelle, Linie = U-Bahn, Fläche = Park.", svg);
            items.push([c, async () => { s.show(park, "fade"); await s.wait(300); s.show(line, "draw"); await s.wait(700); s.show(stops, "pop"); }]); }
          // 4 doodles
          { const svg = s.svg(300, 130); const sp = []; for (let a = 0; a < 4.5 * Math.PI; a += .2) sp.push([70 + (3 + a * 2.6) * Math.cos(a), 66 + (3 + a * 2.6) * Math.sin(a)]);
            const d1 = S(dotsD(sp), { "stroke-width": 3 }), d2 = S("M130,116 L150,98 L170,116 L190,98 L210,116 L230,98 L250,116 L270,98", { "stroke-width": 3 }), d3 = S("M150,24 l10,26 l28,0 l-22,16 l8,26 l-24,-16 l-24,16 l8,-26 l-22,-16 l28,0z", { "stroke-width": 3, transform: "translate(80 8) scale(.8)" });
            svg.append(d1, d2, d3); const c = card("Kritzeleien", "Dein Stift übt, auch beim Warten.", svg); items.push([c, async () => { s.show(d1, "draw"); await s.wait(500); s.show(d2, "draw"); await s.wait(500); s.show(d3, "draw"); }]); }
          // 5 sketchbook
          { const svg = s.svg(300, 130); svg.append(s.el("rect", { x: 8, y: 8, width: 140, height: 114, rx: 6, fill: "#fff", stroke: INK, "stroke-width": 3 }), s.el("rect", { x: 152, y: 8, width: 140, height: 114, rx: 6, fill: "#fff", stroke: INK, "stroke-width": 3 }));
            const ap = S("M222,40 C190,32 176,66 192,94 C202,112 214,104 222,100 C230,104 242,112 252,94 C268,66 254,32 222,40Z", { "stroke-width": 3 }), st2 = S("M222,40 L226,22", { "stroke-width": 3 }), hs = S(hatchD(40, 40, 8, 1), { "stroke-width": 1.8, transform: "translate(212 60)", "clip-path": "none" });
            const lines = S("M24,34 L130,34 M24,56 L110,56 M24,78 L124,78 M24,100 L96,100", { "stroke-width": 2.5, stroke: "#7c8296" });
            svg.append(lines, ap, st2); const c = card("Skizzenbuch", "Jeden Tag eine kleine Zeichnung.", svg); items.push([c, async () => { s.show(lines, "draw"); await s.wait(500); s.show(ap, "draw"); await s.wait(500); s.show(st2, "draw"); }]); }
          // 6 sign
          { const svg = s.svg(300, 130); svg.append(s.el("rect", { x: 70, y: 8, width: 160, height: 114, rx: 12, fill: "#1f9d55" }));
            const fg = S("M118,78 L132,58 L146,70 L162,50 M132,58 L128,100 M146,70 L150,100 M118,78 L104,92 M162,50 L176,62", { stroke: "#fff", "stroke-width": 5 });
            const hd = s.el("circle", { cx: 134, cy: 40, r: 9, fill: "#fff", class: "later" });
            const ar = S("M186,60 L214,60 M204,50 L214,60 L204,70", { stroke: "#fff", "stroke-width": 5 });
            svg.append(hd, fg, ar); const c = card("Schilder", "Wenige Linien, sofort verständlich.", svg); items.push([c, async () => { s.show(hd, "pop"); s.show(fg, "draw"); await s.wait(700); s.show(ar, "draw"); }]); }
          s.add(s.h("div", { class: "cols3", style: { gap: "16px", gridAutoRows: "min-content" } }, ...items.map(i => i[0])));
          s.step(async () => { s.sfx.pop(); items.slice(0, 3).forEach(i => s.show(i[0], "up")); s.sfx.scribble(); await Promise.all(items.slice(0, 3).map(i => i[1]())); });
          s.step(async () => { s.sfx.pop(); items.slice(3).forEach(i => s.show(i[0], "up")); s.sfx.scribble(); await Promise.all(items.slice(3).map(i => i[1]())); s.sfx.ding(); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Zeichne selbst",
        say: "Jetzt bist du dran. Zeichne mit dem Finger. Probiere Strich, Schraffur und Kreuzschraffur aus.",
        build(s) {
          const CW = 760, CH = 560;
          const { canvas, g } = s.canvas(CW, CH);
          g.fillStyle = "#fff"; g.fillRect(0, 0, CW, CH);
          g.save(); g.setLineDash([10, 10]); g.strokeStyle = "#cdbfee"; g.lineWidth = 3; g.beginPath(); g.arc(380, 270, 150, 0, 7); g.stroke(); g.restore();
          let tool = "pen", w = 4, col = INK, last = null, pat = null;
          const mkPat = (cross) => {
            const c = document.createElement("canvas"); c.width = c.height = 16; const x = c.getContext("2d");
            x.strokeStyle = col; x.lineWidth = 2; x.lineCap = "round";
            const L = (a, b, c2, d) => { x.beginPath(); x.moveTo(a, b); x.lineTo(c2, d); x.stroke(); };
            L(0, 16, 16, 0); L(-2, 2, 2, -2); L(14, 18, 18, 14);
            if (cross) { L(0, 0, 16, 16); L(-2, 14, 2, 18); L(14, -2, 18, 2); }
            const p = g.createPattern(c, "repeat"); try { p.setTransform(new DOMMatrix().scale(0.5)); } catch (e) {} return p;
          };
          const seg = (a, b) => {
            g.lineCap = "round"; g.lineJoin = "round";
            if (tool === "pen") { g.strokeStyle = col; g.lineWidth = w; }
            else if (tool === "erase") { g.strokeStyle = "#fff"; g.lineWidth = w * 3 + 6; }
            else { g.strokeStyle = mkPat(tool === "cross"); g.lineWidth = Math.max(16, w * 3); }
            g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x + 0.01, b.y); g.stroke();
          };
          s.drag(canvas, { space: canvas, onStart: p => { last = p; seg(p, p); }, onMove: p => { if (!last) return; seg(last, p); last = p; }, onEnd: () => { last = null; } });
          const sl = s.slider({ label: "Strichstärke", min: 1, max: 20, value: 4, onInput: v => { w = v; } });
          const tb = {};
          const tools = [["pen", "Stift"], ["hatch", "Schraffur"], ["cross", "Kreuz"], ["erase", "Radierer"]];
          const setTool = t => { tool = t; s.sfx.click(); Object.entries(tb).forEach(([k, b]) => b.classList.toggle("solid", k === t)); };
          tools.forEach(([k, n]) => { tb[k] = s.h("button", { class: "btn" + (k === "pen" ? " solid" : ""), onclick: () => setTool(k) }, n); });
          const cb = [["#1b2740", "schwarz"], ["#1d5bd0", "blau"], ["#dc3b2a", "rot"], ["#138a5a", "grün"]].map(([c, n]) => {
            const b = s.h("button", { "aria-label": n, style: { width: "56px", height: "56px", borderRadius: "50%", border: "4px solid " + (c === col ? "#ffd94a" : "#fff"), background: c, boxShadow: "0 0 0 2px #c8d3de", cursor: "pointer" }, onclick: () => { col = c; s.sfx.pop(); cb.forEach(x => x.style.border = "4px solid #fff"); b.style.border = "4px solid #ffd94a"; } });
            return b;
          });
          const clear = s.h("button", { class: "btn", onclick: () => { s.sfx.swoosh(); g.fillStyle = "#fff"; g.fillRect(0, 0, CW, CH); } }, "Alles löschen");
          const hint = s.h("p", { class: "small pencil", html: "Aufgabe: Schraffiere die Kugel auf einer Seite dunkel. Dort, wo das Licht herkommt, bleibt sie weiß." });
          s.add(cols(s, s.h("div", { class: "card", style: { padding: "8px" } }, canvas), stack(s, 12, sl, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" } }, ...Object.values(tb)), s.h("div", { class: "row", style: { gap: "8px", flexWrap: "nowrap" } }, ...cb), clear, hint), 776));
          s.sfx.pop();
        },
      },
    ],
  });
})();
