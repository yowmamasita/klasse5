/* Kapitel 5 – Drucken und Schrift gestalten (Kunst 5/6, Berlin RLP; Albrecht-Dürer-Gymnasium)
   Stempel, Materialdruck, Monotypie, Linolschnitt, Gutenberg, Typografie (Serifen, Wirkung, Kalligramm, Plakat), Dürer, Hokusai */
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
      "Schrift gestalten: Serifen, Wirkung und ein gutes Plakat",
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
            s.sound("stempel"); s.show(prints[i], "pop"); count.textContent = String(++n);
            await s.tween({ from: PY, to: HY, dur: 300, update: v => setT(stamp, cx, v) });
          };
          const m = merk(s, "Der <b>Druckstock</b> trägt das Bild. Einmal gemacht, druckst du damit <b>so oft du willst</b>.");
          const life = s.photo("kartoffeldruck", { w: 520, h: 270, pos: "50% 50%", caption: "Kartoffeldruck: ein Stempel, viele gleiche Katzen", cls: "later" });
          s.add(cols(s, svg, stack(s, 14,
            P(s, "Ein <b>Stempel</b> ist der einfachste <b>Druckstock</b>."),
            s.h("div", { class: "row" }, count, s.h("span", { class: "t" }, "gleiche Abdrücke")),
            m, life)));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); await stampTo(0); s.say("Der erste Abdruck."); });
          s.step(async () => { await stampTo(1); s.say("Der zweite Abdruck – genau gleich."); });
          s.step(async () => { await stampTo(2); s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.swoosh(); await s.show(life, "zoom"); s.say("So sieht ein echter Kartoffeldruck aus."); });
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
            s.sound("papier-reiben", { dur: 1.2, vol: .7 }); await s.wait(1000);
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
          const e1 = s.photo("kartoffelstempel", { w: 520, h: 260, pos: "50% 45%", caption: "Kartoffelstempel – Radiergummi geht auch" });
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
            const snd = s.sound("schnitzen", { vol: .7 });
            await s.tween({ from: 0, to: total, dur: 2200, ease: "linear", update: v => {
              const i = Math.min(total - 1, Math.floor(v)), f = v - i, a = pts[i], b = pts[(i + 1) % total];
              setT(knife, a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f + 6);
              cut.style.opacity = Math.min(1, v / total);
            } });
            snd.stop();
            s.hide(knife); outline.classList.add("later");
          });
          s.step(async () => { s.sfx.pop(); await s.show(inked, "pop"); s.say("Jetzt färbst du den Stern mit dem Stempelkissen ein."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(arrow, "down"); s.sound("stempel"); await s.show(printed, "pop"); s.sfx.ding(); await s.show(m, "up"); });
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
          const life = s.photo("stoffdruck-rapport", { w: 260, h: 260, pos: "50% 60%", caption: "Stoffdruck, Indien", cls: "later" });
          s.add(cols(s, svg, stack(s, 12, P(s, "Wähle Form, Farbe und Drehung. Dann tippe!"), ctr, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "14px", alignItems: "center" } }, m, life)), CW));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); await s.show(ctr, "up"); s.say("Wähle einen Stempel und tippe aufs Papier."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sound("stempel"); await s.show(life, "zoom"); s.say("In Indien werden Stoffe bis heute so bedruckt: Stempel für Stempel."); });
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
            await s.show(sheet, "fade"); s.sound("papier-reiben", { dur: 1.2, vol: .7 }); await s.wait(1000);
            await s.tween({ from: .93, to: 0, dur: 500, update: v => sheet.setAttribute("opacity", v) });
            s.hide(sheet); draw(printG, INK, "#fff"); s.sfx.swoosh();
            await s.show(printG, "fade"); s.sfx.ding(); busy = false;
          };
          const btns = Object.keys(mats).map(k => s.h("button", { class: "btn" + (k === kind ? " solid" : ""), onclick: () => { if (busy) return; kind = k; btns.forEach(b => b.classList.toggle("solid", b.textContent === k)); s.sfx.click(); demo(); } }, k));
          const ctr = s.h("div", { class: "row later", style: { gap: "10px" } }, btns);
          const e1 = box(s, "ex", "Was du nehmen kannst", "<b>Blätter</b> mit Rippen, <b>Pappe</b>, <b>Schnur</b>, Kordel oder Netze.", false);
          const gyo = s.photo("gyotaku", { w: 320, h: 260, pos: "40% 55%", caption: "Gyotaku: Fischdruck", cls: "later" });
          const e2 = box(s, "ex", "Und so geht's", "Material auf eine Platte kleben, mit der <b>Walze</b> einfärben, Papier drauf und mit der Hand <b>andrücken</b>.");
          const m = merk(s, "Beim <b>Materialdruck</b> druckt die <b>Struktur</b> des Materials mit: Rippen, Rillen, Kanten.");
          s.add(cols(s, svg, stack(s, 10, e1, e2, ctr, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "14px", alignItems: "center" } }, m, gyo)), 470));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { await s.show(e2, "up"); s.say("Wir drucken ein Blatt. Erst einfärben, dann andrücken."); await demo(); });
          s.step(async () => { s.sfx.pop(); await s.show(ctr, "pop"); s.say("Probiere die anderen Materialien aus."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(gyo, "zoom"); s.say("In Japan druckt man sogar Fische ab. Das heißt Gyotaku."); });
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
            s.sound("papier-reiben", { dur: 1.5, vol: .7 });
            await s.tween({ from: 0, to: 1, dur: 1400, ease: "linear", update: v => { setT(spoon, 120 + 280 * (0.5 - 0.5 * Math.cos(v * Math.PI * 4)), 120 + 30 * Math.sin(v * Math.PI * 8)); } });
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
      /* 7b --------------------------------------------------------------- */
      {
        title: "Linolschnitt in echt",
        say: "So sieht ein Linolschnitt in echt aus: schneiden, einfärben, abziehen – und fertig ist das Bild.",
        build(s) {
          const ph = [
            s.photo("linol-schneiden", { w: 540, h: 300, pos: "50% 50%", caption: "Schneiden mit dem Hohleisen" }),
            s.photo("walze-farbe", { w: 540, h: 300, pos: "50% 55%", caption: "Farbe mit der Walze ausrollen", cls: "later" }),
            s.photo("linol-abziehen", { w: 540, h: 300, pos: "50% 40%", caption: "Das Papier abziehen", cls: "later" }),
            s.photo("linol-biber", { w: 540, h: 300, fit: "contain", caption: "Fertig: ein Linolschnitt in Farbe", cls: "later", style: { background: "#fff" } }),
          ];
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "540px 540px", gap: "16px 20px", justifyContent: "center", alignContent: "center", height: "100%" } }, ...ph));
          s.sound("schnitzen", { vol: .6 });
          s.step(async () => { s.sfx.swoosh(); await s.show(ph[1], "zoom"); s.say("Die Walze verteilt die Farbe ganz dünn."); });
          s.step(async () => { s.sound("papier-reiben", { dur: 1.5, vol: .7 }); await s.show(ph[2], "zoom"); s.say("Papier drauf, reiben, abziehen."); });
          s.step(async () => { s.sfx.success(); await s.show(ph[3], "zoom"); s.say("Für jede Farbe braucht man einen eigenen Druckgang."); });
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
            const snd = s.sound("schnitzen", { vol: .6 });
            await s.tween({ from: 0, to: 1, dur: 2000, ease: "linear", update: v => {
              const x = ok ? 180 + 310 * v : 490 - 310 * v;
              setT(p.knife, x + (ok ? 0 : 0), y + 95 + (ok ? 0 : 0), ok ? 1 : -1);
              p.groove.style.strokeDashoffset = L * (1 - v) * (ok ? 1 : -1) + (ok ? 0 : 0);
            } });
            snd.stop();
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
          const life = s.photo("krankenwagen-spiegel", { w: 600, h: 244, pos: "50% 62%", caption: "Krankenwagen: vorn in Spiegelschrift", cls: "later" });
          s.add(cols(s, svg, stack(s, 6, wrongBox, rightBox, s.h("div", { class: "row later", style: { gap: "10px", flexWrap: "nowrap" } }), m, life), 460));
          const btnRow = svg.parentNode.parentNode.querySelector(".row.later");
          btnRow.append(b1, b2);
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.say("Wir schneiden KUNST ganz normal. Dann drucken wir."); await flip(); s.show(wrongBox, "up"); s.sfx.error(); });
          s.step(async () => { s.say("Jetzt schneiden wir das Wort spiegelverkehrt."); ghost.classList.add("later"); await s.tween({ from: 1, to: -1, dur: 800, update: v => setSx(v) }); await flip(); s.show(rightBox, "up"); s.sfx.success(); });
          s.step(async () => { s.sfx.ding(); s.show(btnRow, "pop"); await s.show(m, "up"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(life, "zoom"); s.say("Vorn auf Krankenwagen steht die Schrift spiegelverkehrt. Im Rückspiegel des Autos davor liest man sie richtig."); });
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
            printT.textContent = words[wi]; s.sound("stempel"); await s.show(printT, "pop");
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
      /* 12b -------------------------------------------------------------- */
      {
        title: "Gutenbergs Werkstatt",
        say: "So sah Gutenbergs Werkstatt aus: Bleilettern, eine schwere Holzpresse – und am Ende die berühmte Bibel.",
        build(s) {
          const a = s.photo("bleilettern", { w: 360, h: 300, pos: "40% 50%", caption: "Bleilettern" });
          const b = s.photo("gutenberg-presse", { w: 340, h: 300, fit: "contain", caption: "Die Presse (Nachbau)", cls: "later", style: { background: "#fff" } });
          const c = s.photo("gutenberg-bibel", { w: 360, h: 300, pos: "50% 50%", caption: "Die Gutenberg-Bibel", cls: "later" });
          const t1 = box(s, "ex", "1 · Setzen", "Die Lettern werden Buchstabe für Buchstabe in eine Zeile gesetzt – <b>spiegelverkehrt</b>.", false);
          const t2 = box(s, "ex", "2 · Pressen", "Einfärben, Papier drauf, und die <b>Presse</b> drückt alles fest zusammen.");
          const t3 = box(s, "ex", "3 · Die Bibel", "Etwa <b>180 Stück</b> wurden gedruckt. <b>49</b> gibt es heute noch, einige nur in Teilen.");
          const row = (...k) => s.h("div", { style: { display: "grid", gridTemplateColumns: "360px 340px 360px", gap: "20px", justifyContent: "center" } }, ...k);
          s.add(s.h("div", { style: { display: "flex", flexDirection: "column", gap: "18px", height: "100%", justifyContent: "center" } }, row(a, b, c), row(t1, t2, t3)));
          s.step(async () => { s.sound("druckpresse", { vol: .5, dur: 3 }); s.show(t2, "up"); await s.show(b, "zoom"); s.say("Die Presse drückt das Papier auf die Lettern."); });
          s.step(async () => { s.sfx.success(); s.show(t3, "up"); await s.show(c, "zoom"); s.say("Die Gutenberg-Bibel entstand in Mainz, zwischen 1452 und 1454."); });
        },
      },
      /* 12c – Schrift gestalten (Typografie) ------------------------------ */
      {
        title: "Mit oder ohne Serifen?",
        say: "Schau dir die Enden der Buchstaben an. Manche Schriften haben kleine Füßchen. Die heißen Serifen.",
        build(s) {
          const SERIF = 'Georgia, "Times New Roman", serif', SANS = '"Atkinson Hyperlegible", "Avenir Next", system-ui, sans-serif';
          const svg = s.svg(520, 360);
          const INKC = "#1b2740";
          /* a big H drawn from rectangles: stems + crossbar (+ serifs) */
          const H = (x0, col) => [s.el("rect", { x: x0, y: 40, width: 34, height: 180, fill: col }), s.el("rect", { x: x0 + 116, y: 40, width: 34, height: 180, fill: col }), s.el("rect", { x: x0 + 30, y: 116, width: 90, height: 26, fill: col })];
          const hL = s.el("g", {}, ...H(55, INKC));
          const letters = s.el("g", { transform: "translate(0,8)" });
          const serifs = s.el("g", { class: "later" }, ...[[37, 32], [153, 32], [37, 216], [153, 216]].map(([x, y]) => s.el("rect", { x, y, width: 70, height: 12, rx: 2, fill: UC })));
          const rings = s.el("g", { class: "later" }, ...[[72, 38], [188, 38], [72, 222], [188, 222]].map(([cx, cy]) => s.el("circle", { cx, cy, r: 34, fill: "none", stroke: UC, "stroke-width": 3, "stroke-dasharray": "7 6" })));
          const hR = s.el("g", { class: "later" }, ...H(315, INKC));
          const l1 = lbl(s, 130, 296, "mit Serifen"), l2 = lbl(s, 390, 296, "serifenlos", { class: "lbl later" });
          const w1 = s.el("text", { x: 130, y: 348, "text-anchor": "middle", "font-size": 40, fill: INKC, text: "Buch", style: { fontFamily: SERIF } });
          const w2 = s.el("text", { x: 390, y: 348, "text-anchor": "middle", "font-size": 40, fill: INKC, text: "Buch", class: "later", style: { fontFamily: SANS } });
          letters.append(rings, hL, serifs, hR);
          svg.append(s.el("line", { x1: 260, y1: 30, x2: 260, y2: 330, stroke: "#c8d3de", "stroke-width": 3, "stroke-dasharray": "8 8" }), letters, l1, l2, w1, w2);
          const ph = s.photo("trajan-inschrift", { w: 550, h: 168, pos: "50% 40%", caption: "Trajanssäule, Rom (113 n. Chr.)", cls: "later" });
          const e1 = box(s, "ex", "Uralt", "Die Römer meißelten Buchstaben mit Serifen in Stein. Die Inschrift der <b>Trajanssäule</b> ist bis heute ein Vorbild für Druckschriften.");
          const m = merk(s, "<b>Serifen</b> sind kleine Querstriche an den Enden der Buchstaben. Schrift <b>ohne</b> sie heißt <b>serifenlos</b>.");
          const life = box(s, "life", "Im Alltag", "Bücher haben oft Serifen. Verkehrsschilder nutzen die serifenlose Schrift <b>DIN 1451</b>. Und diese App? Serifenlos!");
          s.add(cols(s, svg, stack(s, 10, ph, e1, m, life), 520));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.pop(); await s.show(serifs, "pop"); s.sfx.ding(); await s.show(rings, "fade"); s.say("Die roten Füßchen sind die Serifen."); });
          s.step(async () => { s.sfx.swoosh(); await s.show(hR, "left"); s.show([l2, w2], "up"); s.say("Ohne Füßchen heißt die Schrift serifenlos."); });
          s.step(async () => { s.sound("meissel", { vol: .6, dur: 2 }); s.show(e1, "up"); await s.show(ph, "zoom"); s.say("Die Römer haben Buchstaben mit Serifen in Stein gemeißelt."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.show(life, "up", 200); });
        },
      },
      /* 12d -------------------------------------------------------------- */
      {
        title: "Schrift hat Wirkung",
        say: "Dasselbe Wort, drei Schriften – und jedes Mal fühlt es sich anders an. Probiere andere Wörter aus.",
        build(s) {
          const STY = [
            { name: "lustig", fit: "Geburtstag, Comic, Kinderfest", ff: '"Caveat", "Chalkboard SE", cursive', fs: 76, w: 700 },
            { name: "ernst", fit: "Zeugnis, Urkunde, Brief vom Amt", ff: 'Georgia, "Times New Roman", serif', fs: 54, w: 400 },
            { name: "gruselig", fit: "Halloween, Geisterbahn, Gruselbuch", ff: 'Georgia, "Times New Roman", serif', fs: 60, w: 700 },
          ];
          const COLS = ["#e11d48", "#f59e0b", "#16a34a", "#2563eb", "#9333ea"];
          const jit = i => [((i * 37) % 11 - 5) * 2.2, ((i * 53) % 7 - 3) * 2.4];
          let word = "Ferien";
          const cards = STY.map((st, k) => {
            const v = s.svg(320, 150); v.setAttribute("data-overlap-ok", "");
            v.append(s.el("rect", { x: 2, y: 2, width: 316, height: 146, rx: 10, fill: k === 2 ? "#e9e6ef" : "#fff", stroke: "#c8d3de", "stroke-width": 3 }));
            const g = s.el("g", {}); v.append(g);
            const card = s.h("div", { class: "card later", style: { padding: "10px", display: "flex", flexDirection: "column", gap: "6px" } }, v, P(s, "<b>" + st.name + "</b>", "h2"), P(s, "Passt zu: " + st.fit, "small"));
            card.st = st; card.g = g; card.letters = []; card.drips = [];
            return card;
          });
          const render = c => {
            const st = c.st, n = word.length; c.g.textContent = ""; c.letters = []; c.drips = [];
            const a = Math.min(st.fs * (c === cards[0] ? 0.5 : 0.62), 280 / n), x0 = 160 - a * (n - 1) / 2;
            if (c === cards[1]) { c.g.append(s.el("text", { x: 160, y: 95, "text-anchor": "middle", "font-size": st.fs, fill: "#1b2740", "letter-spacing": 3, text: word, style: { fontFamily: st.ff } })); }
            else for (let i = 0; i < n; i++) {
              const x = x0 + i * a; let y = 95, rot = 0, fill = "#1b2740";
              if (c === cards[0]) fill = COLS[i % COLS.length];
              if (c === cards[2]) { const [r, dy] = jit(i); rot = r; y += dy; fill = "#2b0a3d"; }
              const t = s.el("text", { x: 0, y: 0, "text-anchor": "middle", "font-size": st.fs, "font-weight": st.w, fill, text: word[i], style: { fontFamily: st.ff } });
              t.setAttribute("transform", `translate(${x},${y}) rotate(${rot})`);
              c.g.append(t); c.letters.push({ t, x, y, rot });
              if (c === cards[2] && i % 2 === 0) { const d = s.el("path", { d: `M${x - 4},${y + 4} L${x - 4},${y + 4} Q${x},${y + 4} ${x + 4},${y + 4} Z`, fill: "#9b111e" }); c.g.append(d); c.drips.push({ d, x, y }); }
            }
            if (c === cards[1]) c.g.append(s.el("line", { x1: 60, y1: 122, x2: 260, y2: 122, stroke: "#1b2740", "stroke-width": 2 }));
          };
          const drip = c => s.tween({ from: 0, to: 1, dur: 900, ease: "out", update: k => c.drips.forEach(({ d, x, y }, j) => { const L = (18 + (j % 3) * 9) * k; d.setAttribute("d", `M${x - 4},${y + 4} L${x - 3},${y + 4 + L} Q${x},${y + 12 + L} ${x + 3},${y + 4 + L} L${x + 4},${y + 4} Z`); }) });
          cards.forEach(render);
          /* the playful letters bob gently */
          s.loop(t => { if (!cards[0].classList.contains("later")) cards[0].letters.forEach((l, i) => l.t.setAttribute("transform", `translate(${l.x},${l.y + Math.sin(t / 260 + i) * 5}) rotate(${Math.sin(t / 330 + i * 1.7) * 7})`)); });
          const words = ["Ferien", "Gespenst", "Zeugnis"];
          let busy = false;
          const setWord = async w => {
            if (busy) return; busy = true; word = w; s.sfx.click();
            btns.forEach(b => b.classList.toggle("solid", b.textContent === w));
            for (const c of cards) { render(c); s.sfx.pop(); if (c === cards[2]) await drip(c); else await s.wait(120); }
            busy = false;
          };
          const btns = words.map(w => s.h("button", { class: "btn" + (w === word ? " solid" : ""), onclick: () => setWord(w) }, w));
          const ctr = s.h("div", { class: "row later", style: { gap: "10px", alignItems: "center" } }, P(s, "Anderes Wort:", "t"), ...btns);
          const m = merk(s, "Schrift hat eine <b>Wirkung</b>, wie eine Stimme. Wähle eine Schrift, die zu deinem <b>Inhalt</b> passt.");
          const life = box(s, "life", "Probier’s aus", "„Gespenst“ in lustiger Schrift? Gar nicht gruselig! „Zeugnis“ in Gruselschrift? Lieber nicht.");
          s.add(stack(s, 12, P(s, "Dasselbe Wort – drei Schriften. Wie <b>fühlt</b> es sich an?"), s.h("div", { class: "cols3" }, ...cards), ctr, s.h("div", { class: "cols", style: { alignItems: "start" } }, m, life)));
          s.step(async () => { s.sfx.boing(); await s.show(cards[0], "bounce"); s.say("Lustig: Die Buchstaben hüpfen."); });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(cards[1], "fade"); s.say("Ernst: ruhig, gerade, ordentlich."); });
          s.step(async () => { s.sound("door-creak", { vol: .5, dur: 2.5 }); await s.show(cards[2], "zoom"); await drip(cards[2]); s.say("Gruselig: Die Buchstaben wackeln und tropfen."); });
          s.step(async () => { s.sfx.pop(); await s.show(ctr, "up"); s.show(m, "up", 150); s.show(life, "up", 300); });
        },
      },
      /* 12e -------------------------------------------------------------- */
      {
        title: "Buchstaben als Bild",
        say: "Buchstaben können selbst ein Bild sein. Im Mittelalter malten Mönche riesige, bunte Anfangsbuchstaben. Und manche Dichter machen aus Wörtern Bilder.",
        build(s) {
          const pic = s.photo("kells-chi-rho", { w: 300, h: 430, fit: "contain", caption: "Book of Kells, um 800", style: { background: "#efe4c8" } });
          const svg = s.svg(330, 430);
          const HAND = '"Caveat", "Bradley Hand", cursive';
          svg.append(s.el("rect", { x: 2, y: 2, width: 326, height: 426, rx: 10, fill: "#fff", stroke: "#c8d3de", "stroke-width": 3 }));
          /* calligram 1: a sun whose rays are the word "warm" */
          const sun = s.el("g", { class: "later" });
          sun.append(s.el("circle", { cx: 165, cy: 112, r: 44, fill: "#ffe27a" }), s.el("text", { x: 165, y: 121, "text-anchor": "middle", "font-size": 26, "font-weight": 800, fill: "#b45309", text: "SONNE" }));
          const rays = [];
          for (let i = 0; i < 8; i++) {
            const a = i * 45, r = s.el("text", { x: 0, y: 0, "text-anchor": "start", "dominant-baseline": "middle", "font-size": 22, "font-weight": 700, fill: "#e09a00", text: "warm", style: { fontFamily: HAND } });
            r.setAttribute("transform", `translate(165,112) rotate(${a}) translate(52,0)`); rays.push(r); sun.append(r);
          }
          /* calligram 2: falling rain made of letters (like Apollinaire's "Il pleut") */
          const rainTxt = ["es regnet", "Tropfen", "nass und", "kalt"];
          const rain = [];
          rainTxt.forEach((line, li) => [...line].forEach((ch, ci) => {
            const x = 50 + li * 64 + ci * 7, y = 240 + ci * 20;
            const t = s.el("text", { x, y, "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: "#1d5bd0", text: ch, opacity: 0, style: { fontFamily: HAND } });
            rain.push({ t, y }); svg.append(t);
          }));
          svg.append(sun);
          const e1 = box(s, "ex", "Initiale", "Im Mittelalter schrieben Mönche Bücher mit der Hand. Große Anfangsbuchstaben malten sie bunt und verziert. Hier füllen <b>X</b> und <b>P</b> (für „Christus“) fast die ganze Seite.", false);
          const e2 = box(s, "ex", "Kalligramm", "Die Wörter bilden selbst ein Bild. <b>Guillaume Apollinaire</b> veröffentlichte 1918 solche Bild-Gedichte: <b>„Calligrammes“</b>. In einem regnet es Buchstaben.");
          const m = merk(s, "Buchstaben als Bild: verziert als <b>Initiale</b> oder angeordnet als <b>Kalligramm</b>.");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "300px 330px 1fr", gap: "22px", alignItems: "center", height: "100%" } }, pic, svg, stack(s, 12, e1, e2, m)));
          s.show(pic, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); await s.show(sun, "zoom"); for (let k = 0; k < 2; k++) await s.tween({ from: 0, to: 1, dur: 500, update: v => rays.forEach((r, i) => r.setAttribute("transform", `translate(165,112) rotate(${i * 45}) translate(${52 + Math.sin(v * Math.PI) * 6},0)`)) }); s.say("Ein Kalligramm: Die Strahlen der Sonne sind Wörter."); });
          s.step(async () => {
            s.show(e2, "up"); s.sound("rain", { vol: .4, dur: 3 });
            s.say("Und hier regnet es Buchstaben.");
            await Promise.all(rain.map(({ t, y }, i) => s.wait(i * 25).then(() => s.tween({ from: -40, to: 0, dur: 420, ease: "in", update: d => { t.setAttribute("opacity", 1); t.setAttribute("transform", `translate(0,${d})`); } }))));
          });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 12f -------------------------------------------------------------- */
      {
        title: "Ein Plakat gestalten",
        say: "Ein Plakat muss man schnell lesen können. Wir reparieren dieses Plakat Schritt für Schritt.",
        build(s) {
          const DISP = '"Bricolage Grotesque", "Avenir Next", system-ui, sans-serif', SANS = '"Atkinson Hyperlegible", "Avenir Next", system-ui, sans-serif';
          const svg = s.svg(360, 500);
          const zoomG = s.el("g", {});
          const band = s.el("rect", { x: 12, y: 12, width: 336, height: 170, fill: "#ffffff" });
          zoomG.append(s.el("rect", { x: 10, y: 10, width: 340, height: 480, rx: 6, fill: "#fff", stroke: "#94a3b8", "stroke-width": 3 }), band);
          /* 5 text lines; states: 0 = messy, 1 = size+order, 2 = +contrast, 3 = +two fonts */
          const L = [
            { t: "Schulfest", s0: { x: 196, y: 52, fs: 24, c: "#f3e37c", ff: '"Caveat", cursive' }, s1: { x: 34, y: 120, fs: 58, c: "#f3e37c" }, s2: { c: "#ffffff" }, s3: { ff: DISP } },
            { t: "12. Juni", s0: { x: 30, y: 250, fs: 24, c: "#a5b4c3", ff: '"Courier New", monospace' }, s1: { x: 34, y: 262, fs: 48, c: "#a5b4c3" }, s2: { c: "#1b2740" }, s3: { ff: DISP } },
            { t: "15 bis 18 Uhr", s0: { x: 150, y: 420, fs: 24, c: "#f0a8c0", ff: 'Georgia, serif' }, s1: { x: 34, y: 316, fs: 30, c: "#f0a8c0" }, s2: { c: "#1b2740" }, s3: { ff: SANS } },
            { t: "Schulhof", s0: { x: 40, y: 140, fs: 24, c: "#c7d7a0", ff: DISP }, s1: { x: 34, y: 358, fs: 30, c: "#c7d7a0" }, s2: { c: "#1b2740" }, s3: { ff: SANS } },
            { t: "Musik · Kuchen · Spiele", s0: { x: 60, y: 330, fs: 24, c: "#b4b4d8", ff: '"Caveat", cursive' }, s1: { x: 34, y: 448, fs: 22, c: "#b4b4d8" }, s2: { c: "#475569" }, s3: { ff: SANS } },
          ];
          const stateOf = (l, k) => Object.assign({}, l.s0, k >= 1 ? l.s1 : {}, k >= 2 ? l.s2 : {}, k >= 3 ? l.s3 : {});
          L.forEach(l => { l.el = s.el("text", { x: 0, y: 0, "font-weight": 700, text: l.t }); zoomG.append(l.el); });
          svg.append(zoomG);
          const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
          const mix = (a, b, t) => "rgb(" + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t)).join(",") + ")";
          const apply = (l, p) => { l.el.setAttribute("transform", `translate(${p.x},${p.y})`); l.el.setAttribute("font-size", p.fs); l.el.setAttribute("fill", p.c); l.el.style.fontFamily = p.ff; };
          let level = 0;
          L.forEach(l => apply(l, stateOf(l, 0)));
          const bandCol = k => (k >= 2 ? "#dc2626" : "#ffffff");
          const goTo = async k => {
            const from = level; level = k;
            const A = L.map(l => stateOf(l, from)), B = L.map(l => stateOf(l, k)); const b0 = bandCol(from), b1 = bandCol(k);
            await s.tween({ from: 0, to: 1, dur: 900, ease: "inOut", update: t => {
              L.forEach((l, i) => apply(l, { x: A[i].x + (B[i].x - A[i].x) * t, y: A[i].y + (B[i].y - A[i].y) * t, fs: A[i].fs + (B[i].fs - A[i].fs) * t, c: mix(A[i].c, B[i].c, t), ff: t < .5 ? A[i].ff : B[i].ff }));
              band.setAttribute("fill", mix(b0, b1, t));
            } });
          };
          const rule = (n, title, text) => s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, n + " · " + title), s.h("p", { class: "small", html: text }));
          const r1 = rule(1, "Größe und Ordnung", "Das Wichtigste wird am <b>größten</b>: Was? Wann? Wo? Alles an einer Kante ausgerichtet.");
          const r2 = rule(2, "Kontrast", "<b>Dunkel auf hell</b> oder hell auf dunkel. Gelb auf Weiß sieht man kaum.");
          const r3 = rule(3, "Wenige Schriften", "Höchstens <b>zwei</b> Schriften. Sonst wirkt es unruhig.");
          const r4 = rule(4, "Fern-Test", "Kannst du es auch <b>von Weitem</b> lesen? Ein Plakat liest man im Vorbeigehen.");
          const vorher = s.h("button", { class: "btn", onclick: async () => { s.sfx.whoosh(); await goTo(0); } }, "Vorher");
          const nachher = s.h("button", { class: "btn solid", onclick: async () => { s.sfx.whoosh(); await goTo(3); s.sfx.ding(); } }, "Nachher");
          const ctr = s.h("div", { class: "row later", style: { gap: "10px" } }, vorher, nachher);
          const ph = s.photo("litfasssaeule", { w: 250, h: 176, pos: "40% 40%", caption: "Litfaßsäule, Berlin" });
          const life = s.h("div", { class: "life" }, s.h("span", { class: "exlabel" }, "Im Alltag"), s.h("p", { class: "small", html: "In Berlin erfunden: <b>Ernst Litfaß</b> stellte <b>1855</b> die ersten Säulen für Plakate auf. Die Regeln gelten auch für das Titelblatt deiner Mappe!" }));
          const lifeRow = s.h("div", { class: "later", style: { display: "grid", gridTemplateColumns: "250px 1fr", gap: "14px", alignItems: "center" } }, ph, life);
          s.add(cols(s, svg, stack(s, 12, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } }, r1, r2, r3, r4), lifeRow, ctr), 360));
          s.show(svg, "zoom"); s.sfx.pop();
          s.say("Ein Schulfest-Plakat. Kannst du schnell lesen, wann und wo das Fest ist?");
          s.step(async () => { s.sfx.swoosh(); s.show(r1, "up"); await goTo(1); s.say("Erstens: Das Wichtigste wird groß und alles steht ordentlich untereinander."); });
          s.step(async () => { s.sfx.zap(); s.show(r2, "up"); await goTo(2); s.say("Zweitens: Kontrast. Jetzt springt der Titel ins Auge."); });
          s.step(async () => { s.sfx.snap(); s.show(r3, "up"); await goTo(3); s.say("Drittens: nur zwei Schriften. Das wirkt ruhig."); });
          s.step(async () => {
            s.sfx.whoosh(); s.show(r4, "up"); s.say("Viertens: der Fern-Test. Das Plakat rückt weit weg – lesbar bleibt es trotzdem.");
            await s.tween({ from: 1, to: .4, dur: 900, ease: "inOut", update: k => zoomG.setAttribute("transform", `translate(${180 * (1 - k)},${250 * (1 - k)}) scale(${k})`) });
            await s.wait(700);
            await s.tween({ from: .4, to: 1, dur: 900, ease: "inOut", update: k => zoomG.setAttribute("transform", `translate(${180 * (1 - k)},${250 * (1 - k)}) scale(${k})`) });
            zoomG.removeAttribute("transform");
          });
          s.step(async () => { s.sfx.success(); await s.show(lifeRow, "up"); s.show(ctr, "pop", 200); s.say("Vergleiche selbst: vorher und nachher."); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Dürers Nashorn (1515)",
        say: "Albrecht Dürer machte 1515 einen Holzschnitt von einem Nashorn. Er hat das Tier nie selbst gesehen.",
        build(s) {
          const pic = s.photo("duerer-nashorn", { w: 540, h: 430, fit: "contain", kb: true, style: { background: "#fff" } });
          const f1 = box(s, "ex", "Wer?", "<b>Albrecht Dürer</b> (1471–1528) aus Nürnberg. Er verkaufte seine Drucke über Händler auf Märkten.", false);
          const f2 = box(s, "ex", "Das Nashorn", "Ein indisches Nashorn kam im Mai 1515 nach Lissabon. Dürer kannte nur eine Beschreibung und machte daraus den Holzschnitt <b>Rhinocerus</b>.");
          const f3 = box(s, "ex", "Panzer?", "Die „Rüstung“ ist Dürers Idee von den Hautfalten. Sein Bild prägte lange, wie man sich Nashörner vorstellte.");
          const life = box(s, "life", "Im Alltag", "Dein <b>Albrecht-Dürer-Gymnasium</b> trägt seinen Namen.");
          s.add(cols(s, pic, stack(s, 10, f1, f2, f3, life), 540));
          s.show(pic, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.swoosh(); await s.show(f2, "up"); s.say("Das ist der echte Holzschnitt. Oben steht, was Dürer über das Tier gehört hatte."); });
          s.step(async () => { s.sound("schnitzen", { vol: .6, dur: 2 }); await s.show(f3, "up"); s.say("Beim Holzschnitt bleiben die schwarzen Linien stehen. Alles andere wird weggeschnitten."); });
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 13b -------------------------------------------------------------- */
      {
        title: "Holzschnitt oder Kupferstich?",
        say: "Dürer konnte beides: Holzschnitt und Kupferstich. Beim Holzschnitt druckt, was hoch steht. Beim Kupferstich druckt, was tief eingeritzt ist.",
        build(s) {
          const a = s.photo("duerer-reiter", { w: 300, h: 420, fit: "contain", caption: "Holzschnitt, 1498", style: { background: "#fff" } });
          const b = s.photo("duerer-melencolia", { w: 300, h: 420, fit: "contain", caption: "Kupferstich, 1514", cls: "later", style: { background: "#fff" } });
          const e1 = box(s, "ex", "Holzschnitt = Hochdruck", "<b>Die vier apokalyptischen Reiter</b>: Dürer zeichnete aufs Holz, dann wurde alles Weiße weggeschnitten.", false);
          const e2 = box(s, "ex", "Kupferstich = Tiefdruck", "<b>Melencolia I</b>: Linien werden in Kupfer <b>eingeritzt</b>. Die Farbe sitzt in den Rillen – das ergibt feinste Linien.");
          const m = merk(s, "<b>Hochdruck:</b> Was hoch steht, druckt. <b>Tiefdruck:</b> Was tief liegt, druckt.");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "300px 300px 1fr", gap: "22px", alignItems: "center", height: "100%" } }, a, b, stack(s, 12, e1, e2, m)));
          s.show(a, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.scribble(); s.show(e2, "up"); await s.show(b, "zoom"); s.say("Beim Kupferstich ritzt man die Linien mit einem spitzen Stichel in die Platte."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 13c -------------------------------------------------------------- */
      {
        title: "Hokusai: Die große Welle",
        say: "Die große Welle von Katsushika Hokusai ist einer der berühmtesten Drucke der Welt. Es ist ein Farbholzschnitt aus Japan.",
        build(s) {
          const pic = s.photo("hokusai-welle", { w: 640, h: 430, pos: "50% 50%", kb: true });
          const e1 = box(s, "ex", "Wer und wann?", "<b>Katsushika Hokusai</b> (1760–1849), Japan. Das Blatt erschien <b>um 1831</b> in der Reihe „36 Ansichten des Berges Fuji“.", false);
          const e2 = box(s, "ex", "Wie gedruckt?", "Ein <b>Farbholzschnitt</b>: Für jede Farbe gibt es einen eigenen Holzstock. Alle werden genau übereinander gedruckt.");
          const e3 = box(s, "ex", "Schau genau!", "Hinten, ganz klein, steht der <b>Berg Fuji</b>. Vorn kämpfen drei Boote mit der Welle.");
          s.add(cols(s, pic, stack(s, 12, e1, e2, e3), 640));
          s.show(pic, "zoom"); s.sound("waves", { vol: .45, dur: 6 });
          s.step(async () => { s.sfx.swoosh(); await s.show(e2, "up"); s.say("Für jede Farbe schnitzt man einen eigenen Holzstock."); });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(e3, "up"); s.say("Findest du den Berg Fuji? Er sieht fast aus wie eine kleine Welle."); });
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
            return { reset() { pm.classList.add("later"); }, async play() { s.sound("stempel"); await s.show(pm, "zoom"); } };
          });
          // b) Reisepass
          mk("Stempel im Reisepass", "An der Grenze drückt ein Stempel ein Zeichen in deinen Pass.", svg => {
            const page = s.el("rect", { x: 10, y: 14, width: 150, height: 104, rx: 8, fill: "#e8eefc", stroke: GR, "stroke-width": 4 });
            const st = s.el("g", { class: "later" }, s.el("g", { transform: "translate(85 66) rotate(-12)" }, s.el("rect", { x: -66, y: -24, width: 132, height: 48, rx: 8, fill: "none", stroke: UC, "stroke-width": 5 }), s.el("text", { x: 0, y: 7, "text-anchor": "middle", "font-size": 21, "font-weight": 800, fill: UC, text: "EINREISE" })));
            svg.append(page, st);
            return { reset() { st.classList.add("later"); }, async play() { s.sound("stempel"); await s.show(st, "zoom"); } };
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
