/* Kapitel 5 – Drucken (Kunst 5/6, Berlin RLP; Albrecht-Dürer-Gymnasium) */
(() => {
  const UC = "#dc2626";
  const RAD = Math.PI / 180;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------- layout helpers ---------- */
  const cols = (s, left, right, lw = 540) =>
    s.h("div", { class: "cols", style: { gridTemplateColumns: lw + "px 1fr", alignItems: "center", height: "100%" } }, left, right);
  const P = (s, html, cls = "t", hidden = false) => s.h("p", { class: cls + (hidden ? " later" : ""), html });
  const box = (s, cls, label, html, hidden = true) =>
    s.h("div", { class: cls + (hidden ? " later" : "") }, label ? s.h("span", { class: "exlabel" }, label) : null, s.h("p", { class: "small", html }));
  const merk = (s, html, hidden = true) => s.h("div", { class: "merk" + (hidden ? " later" : ""), html });
  const stack = (s, gap, ...kids) => s.h("div", { class: "stack", style: { gap: gap + "px" } }, ...kids);
  const star = (cx, cy, R, r, n = 5, rot = -90) => {
    const pts = [];
    for (let i = 0; i < n * 2; i++) { const a = (rot + i * 180 / n) * RAD, rr = i % 2 ? r : R; pts.push((cx + rr * Math.cos(a)).toFixed(1) + "," + (cy + rr * Math.sin(a)).toFixed(1)); }
    return pts.join(" ");
  };
  const starPath = (cx, cy, R, r) => "M" + star(cx, cy, R, r).split(" ").join(" L") + " Z";
  const arrowHead = (s, x, y, ang, col, L = 16) => s.el("polygon", {
    points: [[x, y], [x - L * Math.cos(ang - 0.45), y - L * Math.sin(ang - 0.45)], [x - L * Math.cos(ang + 0.45), y - L * Math.sin(ang + 0.45)]].map(p => p.join(",")).join(" "), fill: col });
  const lbl = (s, x, y, t, extra = {}) => s.el("text", Object.assign({ x, y, "text-anchor": "middle", class: "lbl", text: t }, extra));
  const setT = (g, x, y, sx = 1, sy = 1, rot = 0) => g.setAttribute("transform", `translate(${x},${y}) rotate(${rot}) scale(${sx},${sy})`);
  /* a rolling pin (Walze) seen from the side, centre = (0,0) */
  const walze = s => s.el("g", {},
    s.el("path", { d: "M0,0 L0,-52 L70,-52", fill: "none", stroke: "#3a3f4b", "stroke-width": 7, "stroke-linecap": "round", "stroke-linejoin": "round" }),
    s.el("circle", { r: 26, fill: "#4b5563", stroke: "#1f2937", "stroke-width": 4 }),
    s.el("circle", { r: 8, fill: "#e5e7eb" }),
    s.el("rect", { x: 62, y: -60, width: 24, height: 16, rx: 6, fill: "#b45309" }));

  Deck.unit({
    id: "u5", num: 5, title: "Drucken", color: UC, soft: "#fde6e3",
    subtitle: "Ein Druckstock – viele Kopien",
    blurb: "Stempeln, Linolschnitt, Hochdruck – und warum alles spiegelverkehrt ist",
    goals: [
      "Verstehen: Ein Druckstock macht viele gleiche Abdrücke",
      "Hochdruck erklären: Was hoch steht, druckt",
      "Einen Linolschnitt Schritt für Schritt planen – sicher!",
      "Wissen, warum der Abdruck spiegelverkehrt ist",
    ],
    icon(svg, el) {
      svg.append(
        el("rect", { x: 12, y: 40, width: 46, height: 18, rx: 4, fill: UC, opacity: .2 }),
        el("rect", { x: 22, y: 12, width: 26, height: 14, rx: 6, fill: UC }),
        el("rect", { x: 14, y: 26, width: 42, height: 12, rx: 3, fill: UC }),
        el("polygon", { points: star(35, 49, 8, 3.4), fill: UC }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Ein Stock – viele Kopien",
        say: "Ein Stempel ist ein Druckstock. Du stempelst einmal, zweimal, dreimal – und jedes Bild ist gleich.",
        build(s) {
          const svg = s.svg(540, 520);
          svg.append(s.el("rect", { x: 20, y: 250, width: 500, height: 240, rx: 10, fill: "#fff", stroke: "#c8d3de", "stroke-width": 3 }));
          const XS = [110, 270, 430], PY = 385, HY = 130;
          const prints = XS.map(x => s.el("polygon", { points: star(x, PY, 52, 22), fill: UC, class: "later" }));
          svg.append(...prints);
          const stamp = s.el("g", {},
            s.el("rect", { x: -28, y: -130, width: 56, height: 52, rx: 18, fill: "#8a5a3a" }),
            s.el("rect", { x: -62, y: -80, width: 124, height: 34, rx: 6, fill: "#c58b5a" }),
            s.el("polygon", { points: star(0, 0, 46, 19), fill: UC, stroke: "#9b1c1c", "stroke-width": 3 }));
          setT(stamp, XS[0], HY);
          svg.append(stamp);
          const count = s.h("p", { class: "huge mono", style: { color: UC } }, "0");
          let cx = XS[0], n = 0;
          const stampTo = async i => {
            await s.tween({ from: cx, to: XS[i], dur: 380, update: v => setT(stamp, v, HY) }); cx = XS[i];
            await s.tween({ from: HY, to: PY, dur: 240, ease: "in", update: v => setT(stamp, cx, v) });
            s.sfx.drum(); s.show(prints[i], "pop"); count.textContent = String(++n);
            await s.tween({ from: PY, to: HY, dur: 300, update: v => setT(stamp, cx, v) });
          };
          const m = merk(s, "Der <b>Druckstock</b> trägt das Bild. Einmal gemacht, druckst du damit <b>so oft du willst</b>.");
          const life = box(s, "life", "Im Alltag", "Briefmarken, Zeitungen, Bücher: Alles wird mit Druckstöcken oder Druckplatten tausendfach gedruckt – und jedes Stück sieht gleich aus.");
          s.add(cols(s, svg, stack(s, 14,
            P(s, "Ein <b>Stempel</b> ist der einfachste <b>Druckstock</b>."),
            s.h("div", { class: "row" }, count, s.h("span", { class: "t" }, "gleiche Abdrücke")),
            m, life)));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); await stampTo(0); s.say("Der erste Abdruck."); });
          s.step(async () => { await stampTo(1); s.say("Der zweite Abdruck – genau gleich."); });
          s.step(async () => { await stampTo(2); s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Hochdruck: Was hoch steht, druckt",
        say: "Beim Hochdruck druckt nur, was hoch steht. Die Walze färbt nur die hohen Stellen ein.",
        build(s) {
          const svg = s.svg(540, 520);
          const R = [80, 230, 380], RW = 80;
          const wood = "#b98a5e";
          svg.append(s.el("rect", { x: 40, y: 350, width: 460, height: 70, rx: 6, fill: wood, stroke: "#7a5634", "stroke-width": 3 }),
            ...R.map(x => s.el("rect", { x, y: 300, width: RW, height: 50, fill: wood, stroke: "#7a5634", "stroke-width": 3 })),
            lbl(s, 270, 460, "Druckstock von der Seite"));
          const inks = R.map(x => s.el("rect", { x: x + 2, y: 293, width: RW - 4, height: 9, rx: 3, fill: UC, class: "later" }));
          const roller = walze(s); roller.setAttribute("class", "later"); setT(roller, 40, 272);
          const paper = s.el("g", { class: "later" },
            s.el("rect", { x: 30, y: 0, width: 480, height: 14, rx: 3, fill: "#fff", stroke: "#8b95a5", "stroke-width": 2 }),
            ...R.map(x => s.el("rect", { x: x + 2, y: 11, width: RW - 4, height: 5, fill: UC })));
          setT(paper, 0, 90);
          svg.append(...inks, roller, paper);
          const r1 = box(s, "ex", "1 · Hoch und tief", "Der Druckstock hat <b>hohe</b> und <b>tiefe</b> Stellen.", false);
          const r2 = box(s, "ex", "2 · Einfärben", "Die Walze färbt nur die <b>hohen</b> Stellen ein.");
          const r3 = box(s, "ex", "3 · Andrücken", "Papier drauflegen und andrücken: Die Farbe geht aufs Papier.");
          const m = merk(s, "<b>Hochdruck:</b> Was <b>hoch</b> steht, druckt. Was <b>tief</b> liegt, bleibt weiß. Dazu gehören Stempel, Linolschnitt, Holzschnitt und der Buchdruck.");
          s.add(cols(s, svg, stack(s, 12, r1, r2, r3, m)));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => {
            s.sfx.whoosh(); s.show(r2, "up"); s.show(roller, "pop");
            await s.tween({ from: 40, to: 480, dur: 1500, ease: "linear", update: v => {
              setT(roller, v, 272);
              inks.forEach((el, i) => { if (v > R[i] + 20 && el.classList.contains("later")) { s.sfx.tick(); s.show(el, "fade"); } });
            } });
            s.hide(roller);
            s.say("Nur die hohen Stellen haben Farbe.");
          });
          s.step(async () => {
            s.show(r3, "up"); s.show(paper, "fade");
            await s.tween({ from: 90, to: 286, dur: 700, ease: "in", update: v => setT(paper, 0, v) });
            s.sfx.drum(); await s.wait(500);
            s.sfx.swoosh();
            await s.tween({ from: 286, to: 100, dur: 800, update: v => setT(paper, 0, v) });
          });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.say("Was hoch steht, druckt."); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Stempel schnitzen",
        say: "Wir schnitzen einen Stempel. Alles, was nicht drucken soll, wird weggeschnitten.",
        build(s) {
          const svg = s.svg(540, 520);
          const CX = 270, CY = 150;
          svg.append(s.el("rect", { x: 110, y: 30, width: 320, height: 250, rx: 20, fill: "#f4b6c2", stroke: "#c9788c", "stroke-width": 4 }));
          const cut = s.el("path", { d: "M125,45 H415 V265 H125 Z " + starPath(CX, CY, 95, 40), "fill-rule": "evenodd", fill: "#e48fa3", class: "later" });
          const outline = s.el("polygon", { points: star(CX, CY, 95, 40), fill: "none", stroke: "#8a1c2c", "stroke-width": 5, "stroke-dasharray": "10 8", "stroke-linejoin": "round", class: "later" });
          const inked = s.el("polygon", { points: star(CX, CY, 95, 40), fill: UC, class: "later" });
          const knife = s.el("g", { class: "later" },
            s.el("polygon", { points: "0,0 -10,-34 10,-34", fill: "#cbd5e1", stroke: "#475569", "stroke-width": 3 }),
            s.el("rect", { x: -11, y: -78, width: 22, height: 46, rx: 8, fill: "#1f2937" }));
          setT(knife, CX, CY - 95);
          const paperRect = s.el("rect", { x: 110, y: 340, width: 320, height: 160, rx: 10, fill: "#fff", stroke: "#c8d3de", "stroke-width": 3 });
          const printed = s.el("polygon", { points: star(CX, 420, 62, 26), fill: UC, class: "later" });
          const arrow = s.el("g", { class: "later" }, s.el("path", { d: "M270,292 L270,326", stroke: "#475569", "stroke-width": 6, "stroke-linecap": "round", fill: "none" }), arrowHead(s, 270, 336, Math.PI / 2, "#475569", 20));
          svg.append(cut, outline, inked, knife, paperRect, printed, arrow);
          const e1 = box(s, "ex", "Material", "Ein <b>Radiergummi</b>, eine <b>Kartoffel</b> oder <b>Moosgummi</b> – alles, was sich gut schneiden lässt.", false);
          const safe = s.h("div", { class: "ex later", style: { borderColor: UC, borderWidth: "3px" } }, s.h("span", { class: "exlabel", style: { color: UC } }, "Sicherheit"),
            s.h("p", { class: "small", html: "Schneide <b>immer von deiner Hand weg</b>. Die Hand, die den Stempel hält, bleibt nie vor dem Messer." }));
          const m = merk(s, "Alles, was <b>nicht</b> drucken soll, schneidest du <b>weg</b>. Der Stern bleibt <b>hoch</b> stehen.");
          s.add(cols(s, svg, stack(s, 12, P(s, "Zeichne dein Motiv, dann schnitze rundherum alles weg."), e1, safe, m)));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.scribble(); await s.show(outline, "draw"); s.say("Zuerst zeichnest du den Stern auf den Gummi."); });
          s.step(async () => {
            s.show(safe, "up"); s.show(knife, "pop"); s.say("Dann schnitzt du alles um den Stern herum weg. Immer weg von der Hand.");
            const pts = star(CX, CY, 95, 40).split(" ").map(p => p.split(",").map(Number));
            const total = pts.length;
            cut.classList.remove("later"); cut.style.opacity = 0;
            await s.tween({ from: 0, to: total, dur: 2200, ease: "linear", update: v => {
              const i = Math.min(total - 1, Math.floor(v)), f = v - i, a = pts[i], b = pts[(i + 1) % total];
              setT(knife, a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f + 6);
              cut.style.opacity = Math.min(1, v / total);
              if (Math.floor(v * 4) % 2 === 0) s.sfx.tick();
            } });
            s.hide(knife); outline.classList.add("later");
          });
          s.step(async () => { s.sfx.pop(); await s.show(inked, "pop"); s.say("Jetzt färbst du den Stern mit dem Stempelkissen ein."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(arrow, "down"); s.sfx.drum(); await s.show(printed, "pop"); s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Muster stempeln: Rapport",
        say: "Tippe aufs Papier und stempele. Drehe den Stempel, und du bekommst ein Muster.",
        build(s) {
          const CW = 600, CH = 470;
          const svg = s.svg(CW, CH);
          svg.append(s.el("rect", { x: 3, y: 3, width: CW - 6, height: CH - 6, rx: 14, fill: "#fff", stroke: "#c8d3de", "stroke-width": 4 }));
          const layer = s.el("g", {});
          const hint = s.el("text", { x: CW / 2, y: CH / 2, "text-anchor": "middle", class: "hlbl", text: "Tippe aufs Papier!" });
          svg.append(layer, hint);
          const shapes = {
            Stern: () => s.el("polygon", { points: star(0, 0, 34, 14) }),
            Herz: () => s.el("path", { d: "M0,32 C-44,2 -28,-34 0,-12 C28,-34 44,2 0,32 Z" }),
            Ring: () => s.el("circle", { r: 26, "stroke-width": 10, fill: "none" }),
            Pfeil: () => s.el("polygon", { points: "0,-34 24,0 8,0 8,34 -8,34 -8,0 -24,0" }),
          };
          const colors = ["#dc2626", "#1d5bd0", "#138a5a", "#ee7a1a", "#7b4fd6"];
          let shape = "Stern", col = colors[0], rot = 0, ang = 0, count = 0;
          const stampAt = (x, y, r = rot, c = col, sh = shape) => {
            const g = s.el("g", {}); const el = shapes[sh]();
            if (sh === "Ring") el.setAttribute("stroke", c); else el.setAttribute("fill", c);
            g.append(el); layer.append(g); hint.setAttribute("opacity", 0); count++;
            s.tween({ from: 1.5, to: 1, dur: 200, ease: "out", update: k => setT(g, x, y, k, k, r) });
            s.sfx.pop();
          };
          s.drag(svg, { space: svg, onStart: p => stampAt(clamp(p.x, 30, CW - 30), clamp(p.y, 30, CH - 30)) });
          const shapeBtns = Object.keys(shapes).map(name => {
            const icon = s.svg(44, 44, { viewBox: "-40 -40 80 80" });
            const el = shapes[name](); if (name === "Ring") { el.setAttribute("stroke", "currentColor"); } else el.setAttribute("fill", "currentColor"); icon.append(el);
            const b = s.h("button", { class: "btn" + (name === shape ? " solid" : ""), "aria-label": name, style: { width: "70px", padding: 0 }, onclick: () => { shape = name; shapeBtns.forEach(x => x.classList.toggle("solid", x === b)); s.sfx.click(); } }, icon);
            return b;
          });
          const colBtns = colors.map(c => {
            const b = s.h("button", { class: "btn", "aria-label": "Farbe", style: { width: "56px", padding: 0, background: c, borderColor: c, boxShadow: c === col ? "0 0 0 4px #fff, 0 0 0 7px #1b2740" : "none" }, onclick: () => { col = c; colBtns.forEach((x, i) => { x.style.boxShadow = colors[i] === c ? "0 0 0 4px #fff, 0 0 0 7px #1b2740" : "none"; }); s.sfx.click(); } });
            return b;
          });
          const rotBtn = s.h("button", { class: "btn", onclick: () => { rot = (rot + 45) % 360; rotBtn.textContent = "Drehen " + rot + "°"; s.sfx.tick(); } }, "Drehen 0°");
          let busy = false;
          const tag = s.h("div", { class: "chip later" }, "Das Muster wiederholt sich: Rapport");
          const fillBtn = s.h("button", { class: "btn solid", onclick: async () => {
            if (busy) return; busy = true;
            layer.textContent = ""; count = 0; hint.setAttribute("opacity", 0);
            const sh = shape, c = col, r0 = rot;
            for (let r = 0; r < 5; r++) for (let q = 0; q < 7; q++) {
              if (!s.alive) return;
              stampAt(50 + q * 83, 50 + r * 92, r0 + ((r + q) % 2) * 90, c, sh);
              await s.wait(45);
            }
            busy = false; s.show(tag, "pop"); s.sfx.ding();
          } }, "Rapport füllen");
          const clearBtn = s.h("button", { class: "btn", onclick: () => { layer.textContent = ""; hint.setAttribute("opacity", 1); s.sfx.swoosh(); tag.classList.add("later"); } }, "Neu");
          const ctr = s.h("div", { class: "stack later", style: { gap: "12px" } },
            s.h("div", { class: "row", style: { gap: "10px", flexWrap: "nowrap" } }, shapeBtns),
            s.h("div", { class: "row", style: { gap: "12px", flexWrap: "nowrap" } }, colBtns),
            s.h("div", { class: "row", style: { gap: "10px", flexWrap: "nowrap" } }, rotBtn, fillBtn, clearBtn), tag);
          const m = merk(s, "Ein Muster, das sich <b>immer wieder</b> wiederholt, heißt <b>Rapport</b>.");
          const life = box(s, "life", "Im Alltag", "Tapete, Stoff, Geschenkpapier: Ein Stempel oder eine Walze druckt das Muster endlos weiter.");
          s.add(cols(s, svg, stack(s, 12, P(s, "Wähle Form, Farbe und Drehung. Dann tippe!"), ctr, m, life), CW));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); await s.show(ctr, "up"); s.say("Wähle einen Stempel und tippe aufs Papier."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Materialdruck",
        say: "Beim Materialdruck druckst du mit Dingen aus dem Alltag: Blätter, Pappe oder Schnur.",
        build(s) {
          const svg = s.svg(540, 520);
          const INK = UC, GREY = "#8b95a5";
          svg.append(
            s.el("rect", { x: 40, y: 20, width: 460, height: 210, rx: 14, fill: "#e8edf3", stroke: "#c8d3de", "stroke-width": 3 }),
            s.el("rect", { x: 40, y: 290, width: 460, height: 210, rx: 14, fill: "#fff", stroke: "#c8d3de", "stroke-width": 3 }),
            lbl(s, 270, 258, "Druckplatte mit Material"), lbl(s, 270, 285, ""));
          const mats = {
            Blatt: (c, g) => [s.el("path", { d: "M-150,0 C-90,-80 50,-80 150,0 C50,80 -90,80 -150,0 Z", fill: c }),
              s.el("path", { d: "M-150,0 L150,0 M-70,0 L-30,-38 M-10,0 L40,-44 M50,0 L90,-26 M-70,0 L-30,38 M-10,0 L40,44 M50,0 L90,26", stroke: g, "stroke-width": 5, fill: "none", "stroke-linecap": "round" })],
            Pappe: (c, g) => [s.el("rect", { x: -150, y: -60, width: 130, height: 120, rx: 6, fill: c }),
              s.el("circle", { cx: 70, cy: 0, r: 56, fill: c }), s.el("polygon", { points: "-5,-70 25,-70 10,-100", fill: c }),
              s.el("path", { d: "M-130,-30 H-40 M-130,0 H-40 M-130,30 H-40", stroke: g, "stroke-width": 5, fill: "none" })],
            Schnur: (c) => {
              let d = ""; for (let i = 0; i <= 120; i++) { const a = i * 0.22, r = 6 + i * 0.78; d += (i ? " L" : "M") + (r * Math.cos(a) * 1.5).toFixed(1) + "," + (r * Math.sin(a) * 0.75).toFixed(1); }
              return [s.el("path", { d, stroke: c, "stroke-width": 9, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" })];
            },
          };
          let kind = "Blatt", busy = false;
          const plate = s.el("g", {}); setT(plate, 270, 125);
          const printG = s.el("g", { class: "later" }); setT(printG, 270, 395, -1, 1);
          const sheet = s.el("rect", { x: 70, y: 40, width: 400, height: 170, rx: 6, fill: "#fff", stroke: "#8b95a5", "stroke-width": 2, class: "later", opacity: 0.93 });
          const roller = walze(s); roller.setAttribute("class", "later"); setT(roller, 60, 125);
          svg.append(plate, sheet, roller, printG);
          const draw = (g, c, gap) => { g.textContent = ""; g.append(...mats[kind](c, gap)); };
          const demo = async () => {
            if (busy) return; busy = true;
            s.hide(printG); s.hide(sheet); sheet.setAttribute("opacity", .93); draw(plate, GREY, "#e8edf3");
            await s.show(plate, "pop"); s.sfx.pop(); await s.wait(300);
            s.show(roller, "pop"); s.sfx.whoosh();
            await s.tween({ from: 60, to: 480, dur: 1100, ease: "linear", update: v => setT(roller, v, 125) });
            draw(plate, INK, "#e8edf3"); s.sfx.snap();
            await s.tween({ from: 480, to: 60, dur: 700, ease: "linear", update: v => setT(roller, v, 125) });
            s.hide(roller);
            await s.show(sheet, "fade"); s.sfx.scribble(); await s.wait(500); s.sfx.scribble();
            await s.tween({ from: .93, to: 0, dur: 500, update: v => sheet.setAttribute("opacity", v) });
            s.hide(sheet); draw(printG, INK, "#fff"); s.sfx.swoosh();
            await s.show(printG, "fade"); s.sfx.ding(); busy = false;
          };
          const btns = Object.keys(mats).map(k => s.h("button", { class: "btn" + (k === kind ? " solid" : ""), onclick: () => { if (busy) return; kind = k; btns.forEach(b => b.classList.toggle("solid", b.textContent === k)); s.sfx.click(); demo(); } }, k));
          const ctr = s.h("div", { class: "row later", style: { gap: "10px" } }, btns);
          const e1 = box(s, "ex", "Was du nehmen kannst", "<b>Blätter</b> mit Rippen, ausgeschnittene <b>Pappe</b>, aufgeklebte <b>Schnur</b> – auch Kordel, Draht oder Netze.", false);
          const e2 = box(s, "ex", "Und so geht's", "Material auf eine Platte kleben, mit der <b>Walze</b> einfärben, Papier drauf und mit der Hand <b>andrücken</b>.");
          const m = merk(s, "Beim <b>Materialdruck</b> druckt die <b>Struktur</b> des Materials mit: Rippen, Rillen, Kanten.");
          s.add(cols(s, svg, stack(s, 12, e1, e2, ctr, m)));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { await s.show(e2, "up"); s.say("Wir drucken ein Blatt. Erst einfärben, dann andrücken."); await demo(); });
          s.step(async () => { s.sfx.pop(); await s.show(ctr, "pop"); s.say("Probiere die anderen Materialien aus."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Monotypie: nur ein Abzug",
        say: "Bei der Monotypie malst du auf eine glatte Platte und drückst das Papier darauf. Es gibt nur einen einzigen Abzug.",
        build(s) {
          const svg = s.svg(540, 520);
          svg.append(
            s.el("rect", { x: 40, y: 20, width: 460, height: 200, rx: 12, fill: "#d6ecf7", stroke: "#8fb8cc", "stroke-width": 4 }),
            s.el("rect", { x: 40, y: 290, width: 460, height: 200, rx: 12, fill: "#fff", stroke: "#c8d3de", "stroke-width": 3 }),
            lbl(s, 270, 262, "Glasplatte"), lbl(s, 270, 512, "Abzug"));
          const D = [
            ["M70,160 C130,50 190,60 250,120 S370,185 430,70", "#1d5bd0"],
            ["M80,95 C150,170 210,170 260,100 S350,40 440,150", UC],
            ["M120,190 C200,120 280,205 330,150 S420,200 470,110", "#ee7a1a"],
          ];
          const mk = (d, c) => s.el("path", { d, stroke: c, "stroke-width": 14, fill: "none", "stroke-linecap": "round", class: "later" });
          const strokes = D.map(([d, c]) => mk(d, c));
          const plateG = s.el("g", {}, ...strokes);
          const paper = s.el("rect", { x: 40, y: 20, width: 460, height: 200, rx: 12, fill: "#fff", opacity: .9, class: "later" });
          const spoon = s.el("g", { class: "later" }, s.el("ellipse", { rx: 28, ry: 18, fill: "#cbd5e1", stroke: "#64748b", "stroke-width": 3 }), s.el("rect", { x: 24, y: -6, width: 70, height: 12, rx: 6, fill: "#94a3b8" }));
          setT(spoon, 120, 120);
          const printG = s.el("g", { class: "later" }); setT(printG, 540, 270, -1, 1);
          D.forEach(([d, c]) => printG.append(s.el("path", { d, stroke: c, "stroke-width": 14, fill: "none", "stroke-linecap": "round" })));
          svg.append(plateG, paper, spoon, printG);
          const a = box(s, "ex", "1 · Malen", "Male mit nasser Farbe auf <b>Glas</b> oder eine glatte Platte.", false);
          const b = box(s, "ex", "2 · Reiben", "Papier drauflegen und mit dem Löffel <b>reiben</b>.");
          const c = box(s, "ex", "3 · Abziehen", "Papier abziehen: Das Bild ist da – und die Platte ist fast leer.");
          const m = merk(s, "<b>Monotypie</b> heißt: nur <b>ein</b> Abzug. Jeder Abdruck ist ein <b>Unikat</b>.");
          const life = box(s, "life", "Im Alltag", "Ähnlich: ein Klecksbild, bei dem du Farbe im Papier faltest, oder ein Handabdruck mit Fingerfarbe.");
          s.add(cols(s, svg, stack(s, 10, a, b, c, m, life)));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { for (const st of strokes) { s.sfx.scribble(); await s.show(st, "draw"); } s.say("Zuerst malst du mit nasser Farbe auf das Glas."); });
          s.step(async () => {
            s.show(b, "up"); s.show(paper, "fade"); await s.wait(300); s.show(spoon, "pop");
            await s.tween({ from: 0, to: 1, dur: 1400, ease: "linear", update: v => { setT(spoon, 120 + 280 * (0.5 - 0.5 * Math.cos(v * Math.PI * 4)), 120 + 30 * Math.sin(v * Math.PI * 8)); if (Math.floor(v * 12) % 2 === 0) s.sfx.tick(); } });
            s.hide(spoon);
          });
          s.step(async () => {
            s.show(c, "up"); s.sfx.swoosh(); s.hide(paper);
            await s.tween({ from: 1, to: .15, dur: 600, update: v => (plateG.style.opacity = v) });
            await s.show(printG, "fade"); s.sfx.ding(); s.say("Der Abzug ist ein Unikat. Ein zweites gleiches Bild gibt es nicht.");
          });
          s.step(async () => { s.sfx.pop(); await s.show(m, "up"); s.show(life, "up", 200); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Linolschnitt in 6 Schritten",
        say: "Der Linolschnitt hat sechs Schritte: Entwurf, übertragen, schneiden, einfärben, abreiben und abziehen.",
        build(s) {
          const ST = "#1b2740", LI = "#c97b5a";
          const fish = (x, y, k = 1, c = ST, w = 3) => s.el("path", { d: `M${x},${y} C${x + 20 * k},${y - 30 * k} ${x + 60 * k},${y - 30 * k} ${x + 80 * k},${y} C${x + 60 * k},${y + 30 * k} ${x + 20 * k},${y + 30 * k} ${x},${y} Z M${x + 80 * k},${y} L${x + 104 * k},${y - 20 * k} L${x + 104 * k},${y + 20 * k} Z`, stroke: c, "stroke-width": w, fill: "none", "stroke-linejoin": "round" });
          const icons = [
            svg => { svg.append(s.el("rect", { x: 22, y: 8, width: 106, height: 74, rx: 6, fill: "#fff", stroke: "#8b95a5", "stroke-width": 3 }), fish(34, 45, .85)); },
            svg => { svg.append(s.el("rect", { x: 6, y: 18, width: 48, height: 54, rx: 4, fill: "#fff", stroke: "#8b95a5", "stroke-width": 3 }), fish(12, 45, .35, ST, 2.5),
              s.el("path", { d: "M62,45 H88", stroke: ST, "stroke-width": 5, "stroke-linecap": "round" }), arrowHead(s, 96, 45, 0, ST, 14),
              s.el("rect", { x: 100, y: 18, width: 44, height: 54, rx: 4, fill: LI }), fish(137, 45, -.33, "#fff", 2.5)); },
            svg => { svg.append(s.el("rect", { x: 14, y: 12, width: 122, height: 66, rx: 6, fill: LI }), s.el("path", { d: "M26,60 C50,28 70,66 94,36 S120,36 126,28", stroke: "#f0e6d8", "stroke-width": 8, "stroke-linecap": "round", fill: "none" }),
              s.el("polygon", { points: "128,26 112,40 118,46", fill: "#cbd5e1", stroke: "#475569", "stroke-width": 2 }), s.el("rect", { x: 122, y: 4, width: 18, height: 28, rx: 7, fill: "#1f2937", transform: "rotate(40 131 18)" })); },
            svg => { svg.append(s.el("rect", { x: 14, y: 36, width: 122, height: 44, rx: 6, fill: LI }), s.el("rect", { x: 14, y: 36, width: 122, height: 14, fill: UC, opacity: .85 }),
              s.el("circle", { cx: 52, cy: 28, r: 16, fill: "#4b5563", stroke: "#1f2937", "stroke-width": 3 }), s.el("path", { d: "M52,28 L52,8 L100,8", stroke: "#3a3f4b", "stroke-width": 5, fill: "none", "stroke-linecap": "round" })); },
            svg => { svg.append(s.el("rect", { x: 14, y: 46, width: 122, height: 34, rx: 6, fill: LI }), s.el("rect", { x: 22, y: 38, width: 106, height: 10, rx: 3, fill: "#fff", stroke: "#8b95a5", "stroke-width": 2 }),
              s.el("ellipse", { cx: 90, cy: 24, rx: 20, ry: 13, fill: "#cbd5e1", stroke: "#64748b", "stroke-width": 3 }), s.el("rect", { x: 100, y: 18, width: 36, height: 9, rx: 4, fill: "#94a3b8", transform: "rotate(-25 100 22)" })); },
            svg => { svg.append(s.el("rect", { x: 14, y: 40, width: 122, height: 40, rx: 6, fill: LI }), s.el("polygon", { points: "20,44 132,44 140,6 30,10", fill: "#fff", stroke: "#8b95a5", "stroke-width": 3 }), s.el("path", { d: "M44,34 C60,14 76,38 96,20", stroke: UC, "stroke-width": 7, fill: "none", "stroke-linecap": "round" })); },
          ];
          const T = [
            ["1", "Entwurf", "Zeichne dein Bild auf Papier. Wenige Details, klare Flächen."],
            ["2", "Übertragen", "Papier umdrehen und aufs Linol pausen: Das Bild ist jetzt spiegelverkehrt."],
            ["3", "Schneiden", "Mit dem U- und V-Messer wegschneiden, was weiß bleiben soll."],
            ["4", "Einfärben", "Mit der Walze dünn Farbe auf die hohen Stellen rollen."],
            ["5", "Abreiben", "Papier drauflegen und mit dem Löffel gleichmäßig reiben."],
            ["6", "Abziehen", "Vorsichtig abziehen: Fertig ist dein Druck!"],
          ];
          const cards = T.map((t, i) => {
            const svg = s.svg(150, 90, {}); icons[i](svg);
            return s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "8px", padding: "14px 18px" } },
              s.h("div", { class: "row", style: { flexWrap: "nowrap", justifyContent: "space-between" } }, s.h("span", { class: "huge", style: { color: UC, fontSize: "56px" } }, t[0]), svg),
              s.h("p", { class: "h2" }, t[1]), s.h("p", { class: "small" }, t[2]));
          });
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "18px", height: "100%", alignContent: "center" } }, ...cards));
          [[0, 1], [2, 3], [4, 5]].forEach((pair, k) => s.step(async () => {
            s.sfx.whoosh(); await s.show(pair.map(i => cards[i]), "up"); s.sfx.ding();
            s.say(pair.map(i => T[i][1]).join(" und ") + ".");
          }));
          s.step(async () => { s.sfx.success(); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Schneiden – aber sicher!",
        say: "Beim Schneiden gilt: immer von der Hand weg. Deine Hand darf nie vor dem Messer sein.",
        build(s) {
          const svg = s.svg(540, 520);
          const LI = "#c97b5a", SK = "#f3c9a5";
          const panel = (y, ok) => {
            svg.append(s.el("rect", { x: 130, y, width: 390, height: 190, rx: 10, fill: LI, stroke: "#8d5538", "stroke-width": 3 }));
            const hand = s.el("g", {}, s.el("rect", { x: 10, y: y + 50, width: 140, height: 90, rx: 40, fill: SK, stroke: "#c08a62", "stroke-width": 3 }),
              ...[0, 1, 2, 3].map(i => s.el("rect", { x: 110, y: y + 52 + i * 21, width: 56, height: 16, rx: 8, fill: SK, stroke: "#c08a62", "stroke-width": 3 })));
            svg.append(hand);
            const badge = s.el("g", { class: "later" }, s.el("circle", { cx: 70, cy: y + 24, r: 24, fill: ok ? "#138a5a" : UC }),
              s.el("path", { d: ok ? "M58,%Y L67,%Z L84,%W".replace("%Y", y + 24).replace("%Z", y + 33).replace("%W", y + 14) : `M60,${y + 14} L82,${y + 34} M82,${y + 14} L60,${y + 34}`, stroke: "#fff", "stroke-width": 6, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }));
            const groove = s.el("path", { d: `M180,${y + 95} C230,${y + 40} 290,${y + 150} 340,${y + 95} S430,${y + 60} 490,${y + 95}`, stroke: "#f0e6d8", "stroke-width": 9, fill: "none", "stroke-linecap": "round", class: "later" });
            const knife = s.el("g", { class: "later" }, s.el("rect", { x: -120, y: -13, width: 90, height: 26, rx: 13, fill: "#1f2937" }), s.el("rect", { x: -34, y: -4, width: 20, height: 8, fill: "#94a3b8" }), s.el("polygon", { points: "-18,-9 12,0 -18,9", fill: "#cbd5e1", stroke: "#475569", "stroke-width": 2 }));
            const dir = s.el("g", { class: "later" }, s.el("path", { d: `M200,${y + 170} H400`, stroke: ok ? "#138a5a" : UC, "stroke-width": 5, "stroke-dasharray": "10 8", fill: "none" }), arrowHead(s, ok ? 412 : 188, y + 170, ok ? 0 : Math.PI, ok ? "#138a5a" : UC, 18));
            if (!ok) dir.firstChild.setAttribute("d", `M400,${y + 170} H200`);
            svg.append(groove, knife, dir, badge);
            return { hand, badge, groove, knife, dir };
          };
          const A = panel(20, true), B = panel(290, false);
          [A, B].forEach(p => { const len = p.groove.getTotalLength ? 600 : 600; p.groove.style.strokeDasharray = len; });
          const cutAnim = async (p, y, ok) => {
            s.show(p.knife, "fade"); s.show(p.groove, "fade"); s.show(p.dir, "fade");
            const L = 600; p.groove.style.strokeDashoffset = L; p.groove.style.animation = "none";
            await s.tween({ from: 0, to: 1, dur: 2000, ease: "linear", update: v => {
              const x = ok ? 180 + 310 * v : 490 - 310 * v;
              setT(p.knife, x + (ok ? 0 : 0), y + 95 + (ok ? 0 : 0), ok ? 1 : -1);
              p.groove.style.strokeDashoffset = L * (1 - v) * (ok ? 1 : -1) + (ok ? 0 : 0);
              if (Math.floor(v * 16) % 2 === 0) s.sfx.tick();
            } });
          };
          // U / V profiles
          const prof = (type) => { const sv = s.svg(120, 64); sv.append(s.el("rect", { x: 4, y: 8, width: 112, height: 50, rx: 5, fill: LI }),
            type === "U" ? s.el("path", { d: "M44,8 V28 A16,16 0 0 0 76,28 V8 Z", fill: "#f0e6d8" }) : s.el("path", { d: "M52,8 L60,40 L68,8 Z", fill: "#f0e6d8" })); return sv; };
          const u = s.h("div", { class: "ex later row", style: { flexWrap: "nowrap" } }, prof("U"), s.h("p", { class: "small", html: "<b>U-Messer</b>: breite Rille, für größere Flächen." }));
          const v = s.h("div", { class: "ex later row", style: { flexWrap: "nowrap" } }, prof("V"), s.h("p", { class: "small", html: "<b>V-Messer</b>: schmale Rille, für feine Linien." }));
          const m = s.h("div", { class: "merk later", style: { borderColor: UC } }, s.h("b", null, "Immer von der Hand weg!"), " Die haltende Hand bleibt hinter dem Messer, nie davor.");
          s.add(cols(s, svg, stack(s, 12, P(s, "Zwei Messer, zwei Spuren:"), u, v, m)));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); s.show(A.badge, "pop"); s.say("Richtig: Das Messer wandert von der Hand weg."); await cutAnim(A, 20, true); });
          s.step(async () => {
            s.say("Falsch: Das Messer zeigt zur Hand. Das kann wehtun.");
            await cutAnim(B, 290, false); s.sfx.error(); s.show(B.badge, "pop"); s.show(m, "up");
          });
          s.step(async () => { s.sfx.pop(); await s.show(u, "up"); await s.show(v, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Spiegelverkehrt!",
        say: "Der Druck ist immer das Spiegelbild der Platte. Willst du KUNST lesen, musst du es spiegelverkehrt schneiden.",
        build(s) {
          const svg = s.svg(540, 520);
          const mkRect = fill => s.el("rect", { x: -220, y: -65, width: 440, height: 130, rx: 10, fill, stroke: "#8d5538", "stroke-width": 3 });
          const mkText = () => s.el("text", { x: 0, y: 32, "text-anchor": "middle", "font-size": 92, "font-weight": 800, fill: UC, text: "KUNST", style: { fontFamily: '"Bricolage Grotesque", "Avenir Next", system-ui, sans-serif' } });
          const plate = s.el("g", {}, mkRect("#d9c3a8")); const pt = mkText(); plate.append(pt); setT(plate, 270, 85);
          let sx = 1; const setSx = v => { sx = v; pt.setAttribute("transform", `scale(${v},1)`); }; setSx(1);
          const ghost = s.el("g", { class: "later" }); const gr = mkRect("#d9c3a8"); const gt = mkText(); ghost.append(gr, gt);
          svg.append(
            lbl(s, 270, 190, "Linolplatte"), lbl(s, 270, 496, "Abdruck auf dem Papier"), plate, ghost);
          const arrow = s.el("g", {}, s.el("path", { d: "M270,212 V268", stroke: "#8b95a5", "stroke-width": 6, "stroke-dasharray": "10 8", "stroke-linecap": "round" }), arrowHead(s, 270, 284, Math.PI / 2, "#8b95a5", 18));
          svg.append(arrow);
          const wrongBox = box(s, "ex", "Normal geschnitten", "Der Abdruck zeigt <b>das Spiegelbild</b>: verkehrt herum.");
          const rightBox = box(s, "ex", "Spiegelverkehrt geschnitten", "Der Abdruck ist <b>richtig herum</b>: Du kannst KUNST lesen.");
          let busy = false;
          const flip = async () => {
            ghost.classList.remove("later"); gr.setAttribute("fill", "#d9c3a8"); gt.setAttribute("transform", `scale(${sx},1)`);
            setT(ghost, 270, 85, 1, 1); s.sfx.whoosh();
            await s.tween({ from: 0, to: 1, dur: 1300, ease: "inOut", update: v => { setT(ghost, 270, 85 + 310 * v, Math.cos(v * Math.PI), 1); } });
            gr.setAttribute("fill", "#fff"); setT(ghost, 270, 395, -1, 1); s.sfx.drum();
          };
          const run = async mirrored => {
            if (busy) return; busy = true; ghost.classList.add("later");
            const target = mirrored ? -1 : 1;
            if (sx !== target) await s.tween({ from: sx, to: target, dur: 700, update: v => setSx(v) });
            await flip(); busy = false;
          };
          const b1 = s.h("button", { class: "btn", onclick: () => run(false) }, "Normal schneiden");
          const b2 = s.h("button", { class: "btn solid", onclick: () => run(true) }, "Spiegelverkehrt schneiden");
          const m = merk(s, "Beim Drucken wird alles <b>umgedreht</b>. Darum schneidest du Schrift immer <b>spiegelverkehrt</b>.");
          const life = box(s, "life", "Im Alltag", "Auf Stempeln steht Schrift verkehrt herum. Vorn auf Krankenwagen auch: Im Rückspiegel liest man sie richtig.");
          s.add(cols(s, svg, stack(s, 6, wrongBox, rightBox, s.h("div", { class: "row later", style: { gap: "10px" } }), m, life)));
          const btnRow = svg.parentNode.parentNode.querySelector(".row.later");
          btnRow.append(b1, b2);
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.say("Wir schneiden KUNST ganz normal. Dann drucken wir."); await flip(); s.show(wrongBox, "up"); s.sfx.error(); });
          s.step(async () => { s.say("Jetzt schneiden wir das Wort spiegelverkehrt."); ghost.classList.add("later"); await s.tween({ from: 1, to: -1, dur: 800, update: v => setSx(v) }); await flip(); s.show(rightBox, "up"); s.sfx.success(); });
          s.step(async () => { s.sfx.ding(); s.show(btnRow, "pop"); await s.show(m, "up"); s.show(life, "up", 200); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Positiv und Negativ",
        say: "Du kannst die Figur drucken lassen, oder den Hintergrund. Das ist Positiv und Negativ.",
        build(s) {
          const svg = s.svg(540, 520);
          const LI = "#c97b5a", CUT = "#ead9c2";
          const X = [40, 290], W = 210, H = 170;
          const parts = [];
          [["Positiv", "Figur druckt", true], ["Negativ", "Hintergrund druckt", false]].forEach(([name, sub, pos], i) => {
            const x = X[i], cx = x + W / 2;
            const g = s.el("g", { class: "later" },
              lbl(s, cx, 34, name),
              s.el("rect", { x, y: 50, width: W, height: H, rx: 8, fill: pos ? CUT : LI, stroke: "#8d5538", "stroke-width": 3 }),
              s.el("polygon", { points: star(cx, 50 + H / 2, 70, 30), fill: pos ? LI : CUT, stroke: "#8d5538", "stroke-width": 2 }),
              s.el("path", { d: `M${cx},232 V262`, stroke: "#8b95a5", "stroke-width": 5, "stroke-linecap": "round" }), arrowHead(s, cx, 274, Math.PI / 2, "#8b95a5", 16),
              s.el("rect", { x, y: 286, width: W, height: H, rx: 8, fill: pos ? "#fff" : UC, stroke: "#c8d3de", "stroke-width": 3 }),
              s.el("polygon", { points: star(cx, 286 + H / 2, 70, 30), fill: pos ? UC : "#fff" }),
              lbl(s, cx, 494, sub));
            svg.append(g); parts.push(g);
          });
          const e1 = box(s, "ex", "Positiv", "Der <b>Hintergrund</b> wird weggeschnitten. Die <b>Figur</b> steht hoch und druckt.");
          const e2 = box(s, "ex", "Negativ", "Die <b>Figur</b> wird weggeschnitten. Der <b>Hintergrund</b> druckt – die Figur bleibt weiß.");
          const m = merk(s, "Positiv und Negativ <b>tauschen Hell und Dunkel</b>. Du entscheidest, was du wegschneidest.");
          const life = box(s, "life", "Im Alltag", "Zeitung: schwarze Schrift auf weißem Papier. Dunkles Schild: weiße Schrift. Alte Fotofilme zeigen Negative: Hell ist dunkel.");
          s.add(cols(s, svg, stack(s, 12, P(s, "Was <b>druckt</b>, die Figur oder der Hintergrund?"), e1, e2, m, life)));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); s.show(parts[0], "up"); await s.show(e1, "up"); s.say("Positiv: Die Figur druckt."); });
          s.step(async () => { s.sfx.whoosh(); s.show(parts[1], "up"); await s.show(e2, "up"); s.say("Negativ: Der Hintergrund druckt."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.show(life, "up", 200); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Dein Linolschnitt-Studio",
        say: "Schneide mit dem Finger in die Platte. Rechts siehst du sofort den Abdruck. Er ist spiegelverkehrt.",
        build(s) {
          const CW = 420, CH = 370, LI = "#c97b5a", CUT = "#f0e6d8";
          const A = s.canvas(CW, CH), B = s.canvas(CW, CH);
          const ga = A.g, gb = B.g;
          const init = () => { ga.fillStyle = LI; ga.fillRect(0, 0, CW, CH); gb.fillStyle = UC; gb.fillRect(0, 0, CW, CH); };
          init();
          let r = 14, last = null, tk = 0;
          const carve = (p, q) => {
            ga.strokeStyle = CUT; ga.lineWidth = r * 2; ga.lineCap = "round"; ga.beginPath(); ga.moveTo(p.x, p.y); ga.lineTo(q.x, q.y); ga.stroke();
            gb.strokeStyle = "#fff"; gb.lineWidth = r * 2; gb.lineCap = "round"; gb.beginPath(); gb.moveTo(CW - p.x, p.y); gb.lineTo(CW - q.x, q.y); gb.stroke();
            if (++tk % 4 === 0) s.sfx.tick();
          };
          s.drag(A.canvas, { space: A.canvas, onStart: p => { last = p; carve(p, p); }, onMove: p => { carve(last, p); last = p; } });
          const frame = c => s.h("div", { style: { border: "4px solid var(--line)", borderRadius: "12px", overflow: "hidden", lineHeight: 0 } }, c);
          const colA = s.h("div", { class: "stack", style: { gap: "8px" } }, s.h("p", { class: "h2" }, "Platte: Du schneidest"), frame(A.canvas));
          const colB = s.h("div", { class: "stack", style: { gap: "8px" } }, s.h("p", { class: "h2" }, "Abdruck: spiegelverkehrt"), frame(B.canvas));
          const bU = s.h("button", { class: "btn solid", onclick: () => { r = 14; bU.classList.add("solid"); bV.classList.remove("solid"); s.sfx.click(); } }, "U-Messer (breit)");
          const bV = s.h("button", { class: "btn", onclick: () => { r = 6; bV.classList.add("solid"); bU.classList.remove("solid"); s.sfx.click(); } }, "V-Messer (fein)");
          const bN = s.h("button", { class: "btn", onclick: () => { init(); s.sfx.swoosh(); } }, "Neue Platte");
          const tip = s.h("p", { class: "small later", style: { flex: 1, minWidth: "200px" }, html: "Was du <b>links</b> wegschneidest, bleibt <b>rechts</b> weiß – aber auf der anderen Seite!" });
          const bar = s.h("div", { class: "row later", style: { gridColumn: "1 / 3", gap: "12px", flexWrap: "nowrap" } }, bU, bV, bN, tip);
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px", height: "100%", alignContent: "center", justifyItems: "center" } }, colA, colB, bar));
          s.show([colA, colB], "zoom"); s.sfx.pop();
          s.step(async () => {
            s.say("Schau zu: Eine Linie, die nach rechts steigt, steigt im Abdruck nach links.");
            const V = 7; const old = r; r = V; let p0 = { x: 40, y: 300 };
            await s.tween({ from: 0, to: 1, dur: 2200, ease: "linear", update: t => { const p = { x: 40 + 340 * t, y: 300 - 200 * t + 35 * Math.sin(t * 14) }; carve(p0, p); p0 = p; } });
            r = old; s.sfx.ding();
          });
          s.step(async () => { s.sfx.pop(); s.show([bar, tip], "up"); s.say("Jetzt bist du dran. Schneide mit dem Finger."); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Gutenbergs Buchstaben",
        say: "Um vierzehnhundertfünfzig druckte Johannes Gutenberg mit beweglichen Buchstaben aus Metall.",
        build(s) {
          const svg = s.svg(560, 520);
          const words = ["DRUCK", "KUNST", "PAPIER"]; let wi = 0, busy = false;
          const FF = '"Bricolage Grotesque", "Avenir Next", system-ui, sans-serif';
          const layer = s.el("g", {}), printT = s.el("text", { x: 280, y: 415, "text-anchor": "middle", "font-size": 96, "font-weight": 800, fill: UC, class: "later", style: { fontFamily: FF } });
          const paper = s.el("rect", { x: 40, y: 290, width: 480, height: 180, rx: 10, fill: "#fff", stroke: "#c8d3de", "stroke-width": 3 });
          svg.append(paper, lbl(s, 280, 36, "Metall-Lettern (spiegelverkehrt)"), lbl(s, 280, 504, "Abdruck"), layer, printT);
          const blocks = [];
          const setWord = async () => {
            const w = words[wi], n = w.length; layer.textContent = ""; blocks.length = 0; printT.classList.add("later");
            for (let i = 0; i < n; i++) {
              const g = s.el("g", {}, s.el("rect", { x: -34, y: -52, width: 68, height: 104, rx: 6, fill: "#cbd5e1", stroke: "#64748b", "stroke-width": 3 }),
                s.el("text", { x: 0, y: 28, "text-anchor": "middle", "font-size": 76, "font-weight": 800, fill: "#1b2740", transform: "scale(-1,1)", text: w[i], style: { fontFamily: FF } }));
              layer.append(g); blocks.push({ g, x: 280 + (i - (n - 1) / 2) * 80 }); setT(g, blocks[i].x, -80);
            }
            for (let i = 0; i < n; i++) {
              s.sfx.note(i * 2, .15); await s.tween({ from: -80, to: 120, dur: 280, ease: "bounce", update: v => setT(blocks[i].g, blocks[i].x, v) });
            }
          };
          const printIt = async () => {
            blocks.forEach(b => b.g.lastChild.setAttribute("fill", UC)); s.sfx.snap(); await s.wait(300);
            printT.textContent = words[wi]; await s.show(printT, "pop"); s.sfx.drum();
          };
          const btn = s.h("button", { class: "btn later", onclick: async () => { if (busy) return; busy = true; wi = (wi + 1) % words.length; await setWord(); await printIt(); busy = false; } }, "Anderes Wort");
          const f1 = box(s, "ex", "Das Neue", "Jeder Buchstabe ist ein <b>einzelnes Stück Metall</b>. Man setzt Wörter zusammen und nimmt sie danach wieder auseinander. Die Gutenberg-Bibel entstand <b>1452 bis 1454</b>.", false);
          const m = merk(s, "<b>Bewegliche Lettern:</b> einzelne Buchstaben, immer neu kombinierbar – und spiegelverkehrt.");
          const life = box(s, "life", "Im Alltag", "Wie die Tasten deiner Tastatur: einzelne Buchstaben, die du zu immer neuen Wörtern zusammensetzt.");
          s.add(cols(s, svg, stack(s, 10, P(s, "Um <b>1450</b> druckte <b>Johannes Gutenberg</b> aus Mainz mit beweglichen Lettern."), f1, s.h("div", { class: "row" }, btn), m, life), 560));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { busy = true; await setWord(); busy = false; s.say("Die Buchstaben werden zu einem Wort zusammengesetzt."); });
          s.step(async () => { busy = true; await printIt(); busy = false; s.sfx.ding();  });
          s.step(async () => { s.sfx.pop(); s.show(btn, "pop"); await s.show(m, "up"); s.show(life, "up", 200); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Dürers Nashorn (1515)",
        say: "Albrecht Dürer machte 1515 einen Holzschnitt von einem Nashorn. Er hat das Tier nie selbst gesehen.",
        build(s) {
          const svg = s.svg(540, 440);
          const INK = "#1b2740";
          const body = s.el("path", { d: "M72,225 C60,200 80,172 118,168 C140,128 205,102 275,106 C365,102 455,125 482,195 C496,245 484,290 474,332 L440,332 L432,292 C410,302 380,306 350,304 L342,332 L308,332 L300,300 C270,308 250,304 235,296 L228,336 L192,336 L184,298 C165,300 150,292 140,272 C122,280 95,272 80,252 C72,246 72,236 72,225 Z", fill: "#f6efe3", stroke: INK, "stroke-width": 5, "stroke-linejoin": "round", class: "later" });
          const horn = s.el("path", { d: "M80,208 C62,198 52,172 40,150 C64,166 92,182 104,194 Z", fill: INK, class: "later" });
          const ear = s.el("path", { d: "M138,152 C134,128 150,120 162,134 C160,142 152,148 138,152 Z", fill: "#f6efe3", stroke: INK, "stroke-width": 4, class: "later" });
          const eye = s.el("circle", { cx: 112, cy: 200, r: 5, fill: INK, class: "later" });
          const plates = ["M150,160 C172,190 176,226 160,264", "M215,118 C252,150 260,240 232,292", "M360,108 C396,150 400,232 372,302", "M440,128 C466,170 472,240 456,306", "M92,226 C104,232 120,236 134,232"]
            .map(d => s.el("path", { d, fill: "none", stroke: INK, "stroke-width": 5, "stroke-linecap": "round", class: "later" }));
          const hatch = [];
          for (let i = 0; i < 9; i++) hatch.push(`M${188 + i * 14},${262 + (i % 2) * 6} l-10,28`);
          for (let i = 0; i < 7; i++) hatch.push(`M${316 + i * 14},${262 + (i % 2) * 6} l-10,28`);
          for (let i = 0; i < 4; i++) hatch.push(`M${196 + i * 9},${306} l-4,24`, `M${444 + i * 8},${306} l-4,22`);
          const hatchEl = s.el("path", { d: hatch.join(" "), stroke: INK, "stroke-width": 3, "stroke-linecap": "round", fill: "none", class: "later" });
          const ground = s.el("path", { d: "M30,344 H510 M60,360 H200 M300,360 H470", stroke: INK, "stroke-width": 4, "stroke-linecap": "round", fill: "none", class: "later" });
          svg.append(s.el("rect", { x: 10, y: 20, width: 520, height: 410, rx: 10, fill: "#fff", stroke: "#c8d3de", "stroke-width": 3 }), body, horn, ear, eye, ...plates, hatchEl, ground, lbl(s, 270, 408, "Eigene Zeichnung im Holzschnitt-Stil"));
          const f1 = box(s, "ex", "Wer?", "<b>Albrecht Dürer</b> (1471–1528) aus Nürnberg. Er verkaufte seine Drucke über Händler auf Märkten.", false);
          const f2 = box(s, "ex", "Das Nashorn", "Ein indisches Nashorn kam im Mai 1515 nach Lissabon. Dürer kannte nur eine Beschreibung und machte daraus den Holzschnitt <b>Rhinocerus</b>.");
          const f3 = box(s, "ex", "Panzer?", "Die „Rüstungsplatten“ sind Dürers Idee von den Hautfalten. Jahrhunderte lang galt sein Bild als so ein Nashorn aussieht.");
          const life = box(s, "life", "Im Alltag", "Dein <b>Albrecht-Dürer-Gymnasium</b> trägt seinen Namen.");
          f3.querySelector("p").innerHTML = "Die „Rüstung“ ist Dürers Idee von den Hautfalten. Sein Bild prägte lange, wie man sich Nashörner vorstellte.";
          s.add(cols(s, svg, stack(s, 10, f1, f2, f3, life), 540));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.scribble(); await s.show([body], "fade"); await s.show([horn, ear, eye], "pop"); s.say("Zuerst die Umrisse."); });
          s.step(async () => { for (const p of plates) { s.sfx.snap(); await s.show(p, "draw"); } s.show(f2, "up"); });
          s.step(async () => { s.sfx.scribble(); s.show(ground, "fade"); await s.show(hatchEl, "draw"); s.sfx.ding(); s.show(f3, "up"); s.say("Beim Holzschnitt bleiben die schwarzen Linien stehen. Alles andere wird weggeschnitten."); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Drucken im Alltag",
        say: "Überall um dich herum ist etwas gedruckt: Briefmarken, Stempel im Pass, T-Shirts und Zeitungen.",
        build(s) {
          const GR = "#8b95a5";
          const cards = [];
          const mk = (title, text, drawFn) => {
            const svg = s.svg(170, 130); const api = drawFn(svg);
            const c = s.h("div", { class: "life later", style: { display: "flex", gap: "16px", alignItems: "center", cursor: "pointer" }, onclick: async () => { api.reset(); s.sfx.click(); await api.play(); } },
              svg, s.h("div", null, s.h("span", { class: "exlabel" }, "Im Alltag"), s.h("p", { class: "h2", style: { fontSize: "27px" } }, title), s.h("p", { class: "small", style: { marginTop: "6px" } }, text)));
            c.api = api; cards.push(c); return c;
          };
          // a) Briefmarke
          mk("Briefmarke und Poststempel", "Die Marke wird in großer Zahl gedruckt. Den Poststempel macht ein Stempel.", svg => {
            const mark = s.el("g", {}, s.el("rect", { x: 14, y: 18, width: 96, height: 100, fill: "#fff", stroke: GR, "stroke-width": 5, "stroke-dasharray": "6 5" }), s.el("polygon", { points: star(62, 66, 28, 12), fill: UC }));
            const pm = s.el("g", { class: "later" }, s.el("g", {}, s.el("circle", { cx: 100, cy: 80, r: 30, fill: "none", stroke: "#1d5bd0", "stroke-width": 4 }), s.el("path", { d: "M118,50 L168,44 M122,66 L168,60 M126,82 L168,76", stroke: "#1d5bd0", "stroke-width": 4, "stroke-linecap": "round" })));
            svg.append(mark, pm);
            return { reset() { pm.classList.add("later"); }, async play() { s.sfx.drum(); await s.show(pm, "zoom"); } };
          });
          // b) Reisepass
          mk("Stempel im Reisepass", "An der Grenze drückt ein Stempel ein Zeichen in deinen Pass.", svg => {
            const page = s.el("rect", { x: 10, y: 14, width: 150, height: 104, rx: 8, fill: "#e8eefc", stroke: GR, "stroke-width": 4 });
            const st = s.el("g", { class: "later" }, s.el("g", { transform: "translate(85 66) rotate(-12)" }, s.el("rect", { x: -66, y: -24, width: 132, height: 48, rx: 8, fill: "none", stroke: UC, "stroke-width": 5 }), s.el("text", { x: 0, y: 7, "text-anchor": "middle", "font-size": 21, "font-weight": 800, fill: UC, text: "EINREISE" })));
            svg.append(page, st);
            return { reset() { st.classList.add("later"); }, async play() { s.sfx.drum(); await s.show(st, "zoom"); } };
          });
          // c) T-Shirt
          mk("Bedrucktes T-Shirt", "Siebdruck: Farbe wird mit einer Rakel durch ein feines Sieb gedrückt.", svg => {
            const shirt = s.el("path", { d: "M45,14 L14,34 L28,60 L45,52 L45,120 L125,120 L125,52 L142,60 L156,34 L125,14 C115,30 55,30 45,14 Z", fill: "#fff", stroke: GR, "stroke-width": 4, "stroke-linejoin": "round" });
            const logo = s.el("polygon", { points: star(85, 78, 28, 12), fill: UC, class: "later" });
            const rakel = s.el("g", { class: "later" }, s.el("rect", { x: -6, y: -30, width: 12, height: 50, rx: 4, fill: "#475569" }), s.el("rect", { x: -12, y: -46, width: 24, height: 20, rx: 6, fill: "#1f2937" }));
            setT(rakel, 52, 80);
            svg.append(shirt, logo, rakel);
            return { reset() { logo.classList.add("later"); rakel.classList.add("later"); }, async play() {
              s.show(rakel, "fade"); s.sfx.whoosh(); await s.tween({ from: 52, to: 118, dur: 900, ease: "linear", update: v => setT(rakel, v, 80) });
              s.show(logo, "pop"); s.sfx.pop(); s.hide(rakel); } };
          });
          // d) Zeitung
          mk("Zeitung", "Jede Ausgabe wird viele Male gedruckt. Alle Exemplare sehen gleich aus.", svg => {
            const paper = (dx, dy) => s.el("g", { class: "later" }, s.el("g", { transform: `translate(${dx} ${dy})` }, s.el("rect", { x: 20, y: 10, width: 100, height: 106, rx: 4, fill: "#fff", stroke: GR, "stroke-width": 3 }),
              s.el("rect", { x: 30, y: 20, width: 80, height: 14, fill: "#1b2740" }), s.el("rect", { x: 30, y: 42, width: 36, height: 30, fill: "#cbd5e1" }),
              s.el("path", { d: "M74,46 H110 M74,58 H110 M74,70 H110 M30,82 H110 M30,94 H110 M30,106 H100", stroke: GR, "stroke-width": 4 })));
            const ps = [paper(0, 0), paper(18, 6), paper(34, 12)];
            svg.append(...ps);
            return { reset() { ps.forEach(p => p.classList.add("later")); }, async play() { for (const p of ps) { s.sfx.pop(); await s.show(p, "pop"); } } };
          });
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", height: "100%", alignContent: "center" } }, ...cards));
          cards.forEach((c, i) => s.step(async () => { s.sfx.whoosh(); await s.show(c, "up"); await c.api.play(); }));
          s.step(async () => { s.sfx.success(); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Drucken auf einen Blick",
        say: "Noch einmal alles auf einen Blick: Hochdruck, Monotypie und Siebdruck – und drei Regeln zum Merken.",
        build(s) {
          const card = (t, sub, items, later = true) => s.h("div", { class: "card" + (later ? " later" : ""), style: { display: "flex", flexDirection: "column", gap: "10px" } },
            s.h("p", { class: "h2", style: { color: UC } }, t), s.h("p", { class: "small", html: sub }), s.h("ul", { style: { margin: 0, paddingLeft: "22px", fontSize: "21px", lineHeight: 1.45 } }, items.map(i => s.h("li", { html: i }))));
          const c1 = card("Hochdruck", "Was <b>hoch</b> steht, druckt.", ["Stempel", "Materialdruck", "Linolschnitt und Holzschnitt", "Buchdruck (Gutenberg, um 1450)"]);
          const c2 = card("Monotypie", "Nur <b>ein</b> Abzug – ein Unikat.", ["Auf Glas malen", "Papier abreiben", "Abziehen"]);
          const c3 = card("Siebdruck", "Farbe wird <b>durch ein Sieb</b> gedrückt.", ["T-Shirts", "Plakate"]);
          const rules = [["Spiegelverkehrt", "Der Abdruck dreht alles um."], ["Von der Hand weg", "Immer so schneiden."], ["Positiv / Negativ", "Figur oder Hintergrund druckt."]]
            .map(([a, b]) => s.h("div", { class: "merk later", style: { padding: "12px 16px", fontSize: "21px" } }, s.h("b", null, a), s.h("br"), b));
          s.add(s.h("div", { style: { display: "flex", flexDirection: "column", gap: "18px", height: "100%", justifyContent: "center" } },
            s.h("div", { class: "cols3" }, c1, c2, c3), s.h("div", { class: "cols3" }, ...rules)));
          s.step(async () => { s.sfx.pop(); await s.show(c1, "up"); s.say("Beim Hochdruck druckt, was hoch steht."); });
          s.step(async () => { s.sfx.pop(); await s.show([c2, c3], "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(rules, "pop"); s.sfx.success(); s.confetti(550, 300, 60); s.say("Spiegelverkehrt, von der Hand weg, Positiv und Negativ."); });
        },
      },
    ],
  });
})();
