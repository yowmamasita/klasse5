/* Kapitel 6 – Collage, Komposition und Bauen (Kunst 5/6, Berlin RLP; Albrecht-Dürer-Gymnasium) */
(() => {
  const UC = "#2f7d32";
  const RAD = Math.PI / 180;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const INK = "#1b2740";

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
  const lbl = (s, x, y, t, extra = {}) => s.el("text", Object.assign({ x, y, "text-anchor": "middle", class: "lbl", text: t }, extra));
  const setT = (g, x, y, sx = 1, sy = 1, rot = 0) => g.setAttribute("transform", `translate(${x},${y}) rotate(${rot}) scale(${sx},${sy})`);
  const arrowHead = (s, x, y, ang, col, L = 16) => s.el("polygon", {
    points: [[x, y], [x - L * Math.cos(ang - 0.45), y - L * Math.sin(ang - 0.45)], [x - L * Math.cos(ang + 0.45), y - L * Math.sin(ang + 0.45)]].map(p => p.join(",")).join(" "), fill: col });

  /* little pictures used in several slides (origin = bottom centre for house/tree, centre otherwise) */
  const sunG = s => { const g = s.el("g", {}); for (let i = 0; i < 8; i++) { const a = i * 45 * RAD; g.append(s.el("line", { x1: 42 * Math.cos(a), y1: 42 * Math.sin(a), x2: 56 * Math.cos(a), y2: 56 * Math.sin(a), stroke: "#e09a00", "stroke-width": 5, "stroke-linecap": "round" })); }
    g.append(s.el("circle", { r: 33, fill: "#ffc928", stroke: "#e09a00", "stroke-width": 4 })); return g; };
  const cloudG = s => s.el("g", { fill: "#fff", stroke: "#b7c6d6", "stroke-width": 3 }, s.el("ellipse", { cx: 0, cy: 8, rx: 56, ry: 22 }), s.el("circle", { cx: -18, cy: -6, r: 24 }), s.el("circle", { cx: 16, cy: -12, r: 28 }));
  const houseG = s => s.el("g", {}, s.el("rect", { x: -48, y: -70, width: 96, height: 70, fill: "#e8b87a", stroke: "#a8753a", "stroke-width": 4 }),
    s.el("polygon", { points: "-62,-68 0,-120 62,-68", fill: "#c0392b", stroke: "#8e2a20", "stroke-width": 4, "stroke-linejoin": "round" }),
    s.el("rect", { x: -12, y: -40, width: 24, height: 40, fill: "#7a4a22" }), s.el("rect", { x: 22, y: -56, width: 18, height: 18, fill: "#cfeaf7", stroke: "#a8753a", "stroke-width": 3 }));
  const treeG = s => s.el("g", {}, s.el("rect", { x: -9, y: -60, width: 18, height: 60, fill: "#7a4a22" }), s.el("circle", { cx: 0, cy: -92, r: 48, fill: "#4a9d4a", stroke: "#2f7d32", "stroke-width": 4 }));

  Deck.unit({
    id: "u6", num: 6, title: "Collage, Komposition und Bauen", color: UC, soft: "#e3f2e4",
    subtitle: "Dinge anordnen, kleben und bauen",
    blurb: "Drittelregel, Goldener Schnitt, Collage, Plastik und Relief",
    goals: [
      "Ein Bild gut aufbauen: Drittelregel, Gleichgewicht, Tiefe",
      "Collagen kennen – von Braque und Picasso bis Schwitters",
      "Additiv und subtraktiv bauen, mit Ton modellieren",
      "Ein Relief und ein Pappmodell planen",
    ],
    icon(svg, el) {
      svg.append(el("rect", { x: 10, y: 12, width: 50, height: 46, rx: 4, fill: UC, opacity: .15 }),
        el("line", { x1: 27, y1: 12, x2: 27, y2: 58, stroke: UC, "stroke-width": 2 }), el("line", { x1: 43, y1: 12, x2: 43, y2: 58, stroke: UC, "stroke-width": 2 }),
        el("line", { x1: 10, y1: 27, x2: 60, y2: 27, stroke: UC, "stroke-width": 2 }), el("line", { x1: 10, y1: 43, x2: 60, y2: 43, stroke: UC, "stroke-width": 2 }),
        el("circle", { cx: 43, cy: 27, r: 7, fill: UC }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Komposition: Dinge anordnen",
        say: "Komposition heißt: Du entscheidest, wo die Dinge in deinem Bild stehen. Gleiche Dinge, anderes Bild.",
        build(s) {
          const svg = s.svg(540, 440);
          svg.append(s.el("rect", { x: 5, y: 5, width: 530, height: 430, rx: 12, fill: "#dff1fb", stroke: "#8fb8cc", "stroke-width": 4 }),
            s.el("rect", { x: 7, y: 350, width: 526, height: 83, rx: 8, fill: "#9bd49b" }));
          const objs = { sun: sunG(s), cloud: cloudG(s), house: houseG(s), tree: treeG(s) };
          const names = Object.keys(objs);
          const scenes = {
            mess: { sun: [270, 215], cloud: [280, 230], house: [260, 260], tree: [300, 250] },
            good: { sun: [440, 85], cloud: [140, 90], house: [180, 390], tree: [395, 395] },
          };
          const cur = {}; names.forEach(n => { cur[n] = scenes.mess[n].slice(); svg.append(objs[n]); objs[n].classList.add("later"); setT(objs[n], cur[n][0], cur[n][1]); });
          let busy = false;
          const moveTo = async target => {
            if (busy) return; busy = true; s.sfx.whoosh();
            const from = {}; names.forEach(n => (from[n] = cur[n].slice()));
            await s.tween({ from: 0, to: 1, dur: 900, ease: "inOut", update: t => names.forEach(n => { cur[n] = [from[n][0] + (target[n][0] - from[n][0]) * t, from[n][1] + (target[n][1] - from[n][1]) * t]; setT(objs[n], cur[n][0], cur[n][1]); }) });
            s.sfx.pop(); busy = false;
          };
          const rnd = () => { const t = {}; t.sun = [60 + Math.random() * 420, 70 + Math.random() * 120]; t.cloud = [70 + Math.random() * 400, 70 + Math.random() * 120]; t.house = [70 + Math.random() * 400, 250 + Math.random() * 150]; t.tree = [70 + Math.random() * 400, 250 + Math.random() * 150]; return t; };
          const b1 = s.h("button", { class: "btn", onclick: () => moveTo(scenes.mess) }, "Durcheinander");
          const b2 = s.h("button", { class: "btn solid", onclick: () => moveTo(scenes.good) }, "Geordnet");
          const b3 = s.h("button", { class: "btn", onclick: () => moveTo(rnd()) }, "Mischen");
          const ctr = s.h("div", { class: "row later", style: { gap: "10px" } }, b1, b2, b3);
          const m = merk(s, "<b>Komposition</b> heißt: Du <b>ordnest</b> die Dinge im Bild an. Die Dinge bleiben gleich – aber das Bild ändert sich.");
          const life = box(s, "life", "Im Alltag", "Beim Aufräumen: Wo steht das Bett im Zimmer? Beim Foto: Wen stellst du wohin? Auch eine Pizza mit Belag ist eine Komposition.");
          s.add(cols(s, svg, stack(s, 14, P(s, "Vier Dinge: <b>Sonne, Wolke, Haus, Baum</b>. Wohin damit?"), ctr, m, life)));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { for (const n of names) { s.sfx.pop(); await s.show(objs[n], "pop"); } s.say("Hier steht alles durcheinander. Das wirkt unruhig."); });
          s.step(async () => { await moveTo(scenes.good); s.show(ctr, "pop"); s.say("Jetzt ist alles geordnet. Probiere es selbst aus."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.show(life, "up", 200); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Bildmitte oder Drittelregel?",
        say: "Ziehe den Ballon durchs Bild. Auf den Kreuzungspunkten der Drittelregel sieht ein Bild oft spannender aus.",
        build(s) {
          const W = 620, H = 440;
          const svg = s.svg(W, H);
          const gx = [W / 3, 2 * W / 3], gy = [H / 3, 2 * H / 3];
          svg.append(s.el("rect", { x: 0, y: 0, width: W, height: H, rx: 12, fill: "#cfe9f8" }), s.el("rect", { x: 0, y: gy[1], width: W, height: H - gy[1], fill: "#5ba3d9" }),
            s.el("path", { d: `M0,${gy[1]} H${W}`, stroke: "#fff", "stroke-width": 4 }),
            s.el("circle", { cx: 540, cy: 70, r: 0 }));
          const grid = s.el("g", { class: "later", stroke: UC, "stroke-width": 3, "stroke-dasharray": "10 8", opacity: .9 },
            ...gx.map(x => s.el("line", { x1: x, y1: 0, x2: x, y2: H })), ...gy.map(y => s.el("line", { x1: 0, y1: y, x2: W, y2: y })));
          const dots = [];
          gx.forEach(x => gy.forEach(y => dots.push(s.el("circle", { cx: x, cy: y, r: 11, fill: UC, class: "later" }))));
          const centre = s.el("circle", { cx: W / 2, cy: H / 2, r: 11, fill: "#ee7a1a", class: "later" });
          const balloon = s.el("g", {}, s.el("line", { x1: -14, y1: 48, x2: -10, y2: 62, stroke: "#5b3a1a", "stroke-width": 3 }), s.el("line", { x1: 14, y1: 48, x2: 10, y2: 62, stroke: "#5b3a1a", "stroke-width": 3 }),
            s.el("rect", { x: -13, y: 60, width: 26, height: 18, rx: 3, fill: "#a8753a" }),
            s.el("ellipse", { rx: 40, ry: 52, fill: "#dc3b2a", stroke: "#8e2a20", "stroke-width": 4 }), s.el("ellipse", { rx: 16, ry: 52, fill: "#ffd94a" }),
            s.el("circle", { r: 78, fill: "rgba(0,0,0,0.001)" }));
          let pos = { x: W / 2, y: H / 2 }; setT(balloon, pos.x, pos.y);
          svg.append(grid, ...dots, centre, balloon);
          const stT = s.h("p", { class: "h2" }, "Bildmitte");
          const stS = s.h("p", { class: "small" }, "Ruhig, aber oft etwas starr.");
          const status = s.h("div", { class: "card soft", style: { minHeight: "118px" } }, stT, stS);
          let state = "mitte";
          const upd = () => {
            const d = (a, b) => Math.hypot(pos.x - a, pos.y - b);
            let st = "sonst";
            if (d(W / 2, H / 2) < 42) st = "mitte";
            else if (gx.some(x => gy.some(y => d(x, y) < 42))) st = "drittel";
            if (st !== state) {
              state = st;
              if (st === "drittel") { s.sfx.ding(); stT.textContent = "Drittelpunkt!"; stS.textContent = "Spannend: Das Auge hat Platz zum Wandern."; }
              else if (st === "mitte") { s.sfx.click(); stT.textContent = "Bildmitte"; stS.textContent = "Ruhig, aber oft etwas starr."; }
              else { stT.textContent = "Irgendwo dazwischen"; stS.textContent = "Zieh den Ballon auf einen Kreuzungspunkt."; }
            }
          };
          let off = { x: 0, y: 0 };
          s.drag(balloon, { space: svg, onStart: p => { off = { x: p.x - pos.x, y: p.y - pos.y }; s.sfx.pop(); }, onMove: p => { pos = { x: clamp(p.x - off.x, 50, W - 50), y: clamp(p.y - off.y, 60, H - 90) }; setT(balloon, pos.x, pos.y); upd(); } });
          const m = merk(s, "<b>Drittelregel:</b> Teile das Bild in 3 × 3 gleiche Felder. Wichtiges kommt auf die <b>Linien</b> oder die <b>Kreuzungspunkte</b>.", true);
          const tip = P(s, "Ziehe den Ballon!", "small pencil", true);
          s.add(cols(s, svg, stack(s, 14, P(s, "Wo sieht der Ballon am besten aus?"), tip, status, m), W));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.show(centre, "pop"); s.show(tip, "pop"); s.say("Der Ballon steht in der Bildmitte. Ziehe ihn herum."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(grid, "fade"); s.show(dots, "pop"); s.say("Jetzt siehst du die Drittelregel: zwei senkrechte und zwei waagerechte Linien."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Drittelregel im Alltag",
        say: "Du findest die Drittelregel in Handykameras, in Fotos und auf Plakaten.",
        build(s) {
          const GL = { stroke: "#fff", "stroke-width": 2.5, "stroke-dasharray": "7 5", opacity: .95 };
          const mk = (title, text, drawFn) => {
            const svg = s.svg(300, 190); const api = drawFn(svg);
            const c = s.h("div", { class: "life later", style: { display: "flex", flexDirection: "column", gap: "10px", cursor: "pointer" }, onclick: async () => { api.reset(); s.sfx.click(); await api.play(); } },
              s.h("span", { class: "exlabel" }, "Im Alltag"), svg, s.h("p", { class: "h2", style: { fontSize: "27px" } }, title), s.h("p", { class: "small", html: text }));
            c.api = api; return c;
          };
          const gridLines = (x, y, w, h, o = GL) => s.el("g", Object.assign({ class: "later" }, {}), ...[1, 2].map(i => s.el("line", Object.assign({ x1: x + w * i / 3, y1: y, x2: x + w * i / 3, y2: y + h }, o))), ...[1, 2].map(i => s.el("line", Object.assign({ x1: x, y1: y + h * i / 3, x2: x + w, y2: y + h * i / 3 }, o))));
          const c1 = mk("Handykamera", "Viele Kameras und Handys können ein <b>Raster</b> einblenden. Tippe: Der Mensch wandert auf einen Kreuzungspunkt.", svg => {
            svg.append(s.el("rect", { x: 20, y: 8, width: 260, height: 174, rx: 18, fill: "#1f2937" }), s.el("rect", { x: 34, y: 20, width: 232, height: 150, rx: 6, fill: "#bfe3f5" }), s.el("rect", { x: 34, y: 119, width: 232, height: 51, fill: "#8fcf8f" }));
            const g = gridLines(34, 20, 232, 150); svg.append(g);
            const person = s.el("g", {}, s.el("circle", { cx: 0, cy: -54, r: 11, fill: "#f3c9a5", stroke: INK, "stroke-width": 3 }), s.el("path", { d: "M0,-43 V-14 M0,-14 L-10,0 M0,-14 L10,0 M-14,-36 H14", stroke: INK, "stroke-width": 5, "stroke-linecap": "round", fill: "none" }));
            setT(person, 150, 120); svg.append(person);
            return { reset() { g.classList.add("later"); setT(person, 150, 120); }, async play() { s.show(g, "fade"); await s.wait(300); s.sfx.whoosh(); await s.tween({ from: 150, to: 111, dur: 700, update: v => setT(person, v, 120) }); s.sfx.ding(); } };
          });
          const c2 = mk("Fotos", "Auf Landschaftsfotos liegt der <b>Horizont</b> oft auf einer Drittellinie und die <b>Sonne</b> auf einem Kreuzungspunkt.", svg => {
            svg.append(s.el("rect", { x: 10, y: 8, width: 280, height: 174, rx: 8, fill: "#fbd38d" }), s.el("rect", { x: 10, y: 123, width: 280, height: 59, rx: 0, fill: "#4a7fb5" }));
            const sun = s.el("circle", { cx: 197, cy: 66, r: 20, fill: "#fff3b0", stroke: "#e09a00", "stroke-width": 4, class: "later" });
            const g = gridLines(10, 8, 280, 174); svg.append(g, sun);
            return { reset() { g.classList.add("later"); sun.classList.add("later"); }, async play() { s.show(g, "fade"); await s.wait(300); s.sfx.pop(); await s.show(sun, "zoom"); s.sfx.ding(); } };
          });
          const c3 = mk("Plakate", "Der Titel liegt oft auf einer <b>Drittellinie</b>, das Bild auf einem Kreuzungspunkt.", svg => {
            svg.append(s.el("rect", { x: 80, y: 5, width: 140, height: 180, rx: 4, fill: "#fff", stroke: "#8b95a5", "stroke-width": 3 }));
            const title = s.el("rect", { x: 92, y: 58, width: 116, height: 14, rx: 4, fill: INK, class: "later" });
            const pic = s.el("circle", { cx: 173, cy: 125, r: 27, fill: "#ee7a1a", class: "later" });
            const small = s.el("rect", { x: 92, y: 164, width: 62, height: 8, rx: 3, fill: "#8b95a5", class: "later" });
            const g = gridLines(80, 5, 140, 180, { stroke: UC, "stroke-width": 2.5, "stroke-dasharray": "7 5" }); svg.append(g, title, pic, small);
            return { reset() { [g, title, pic, small].forEach(e => e.classList.add("later")); }, async play() { s.show(g, "fade"); await s.wait(250); s.sfx.pop(); s.show(title, "left"); await s.wait(250); s.sfx.pop(); s.show(pic, "pop"); await s.wait(250); s.show(small, "fade"); s.sfx.ding(); } };
          });
          s.add(s.h("div", { class: "cols3", style: { alignItems: "center", height: "100%" } }, c1, c2, c3));
          [c1, c2, c3].forEach(c => s.step(async () => { s.sfx.whoosh(); await s.show(c, "up"); await c.api.play(); }));
          s.step(async () => { s.sfx.success(); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Der Goldene Schnitt",
        say: "Der Goldene Schnitt teilt eine Strecke in zwei Teile. Das Verhältnis ist ungefähr eins zu eins Komma sechs eins acht.",
        build(s) {
          const svg = s.svg(540, 440);
          const X0 = 30, LEN = 480, Y = 70, GOLD = 1.618;
          const segA = s.el("rect", { x: X0, y: Y - 14, width: LEN / 2, height: 28, rx: 6, fill: "#2f7d32" });
          const segB = s.el("rect", { x: X0 + LEN / 2, y: Y - 14, width: LEN / 2, height: 28, rx: 6, fill: "#ee7a1a" });
          const tA = lbl(s, X0 + LEN / 4, Y + 54, "Teil a"), tB = lbl(s, X0 + LEN * 3 / 4, Y + 54, "Teil b");
          const wr = s.el("g", { class: "later" });
          const R = { x: 110, y: 200, w: 307.4, h: 190 };
          wr.append(s.el("rect", { x: R.x, y: R.y, width: R.w, height: R.h, fill: "#e3f2e4", stroke: UC, "stroke-width": 4 }),
            s.el("line", { x1: R.x + R.h, y1: R.y, x2: R.x + R.h, y2: R.y + R.h, stroke: UC, "stroke-width": 4 }),
            s.el("path", { d: `M${R.x + R.h},${R.y} A${R.h},${R.h} 0 0 0 ${R.x},${R.y + R.h}`, fill: "none", stroke: "#ee7a1a", "stroke-width": 5 }));
          svg.append(segA, segB, tA, tB, wr);
          const ratioT = s.h("p", { class: "huge mono", style: { color: UC } }, "1,00");
          const chip = s.h("div", { class: "chip", style: { visibility: "hidden", background: "#ffd94a" } }, "Goldener Schnitt!");
          let was = false;
          const upd = v => {
            const p = v / 100, a = LEN * p, b = LEN - a, r = Math.max(a, b) / Math.min(a, b);
            segA.setAttribute("width", a); segB.setAttribute("x", X0 + a); segB.setAttribute("width", b);
            tA.setAttribute("x", X0 + a / 2); tB.setAttribute("x", X0 + a + b / 2);
            ratioT.textContent = s.fmt(r, 2);
            const g = Math.abs(r - GOLD) < 0.03;
            chip.style.visibility = g ? "visible" : "hidden";
            if (g && !was) { s.sfx.ding(); } was = g;
          };
          const sl = s.slider({ label: "Wo schneidest du?", min: 30, max: 70, step: 1, value: 50, fmt: v => v + " % : " + (100 - v) + " %", onInput: upd });
          const jump = s.h("button", { class: "btn solid", onclick: () => { s.sfx.pop(); sl.set(62); } }, "Zum Goldenen Schnitt");
          const m = merk(s, "Beim <b>Goldenen Schnitt</b> verhält sich das längere Stück zum kürzeren wie ca. <b>1,618 : 1</b>. Schon der Grieche Euklid beschrieb ihn.");
          const note = box(s, "life", "Gut zu wissen", "Die <b>Drittelregel</b> ist eine einfache Näherung (etwa 2 : 3). Regeln darf man auch bewusst brechen!");
          s.add(cols(s, svg, stack(s, 12, P(s, "Verschiebe den Schnitt. <b>Längeres ÷ kürzeres Stück</b> ="), s.h("div", { class: "row" }, ratioT, chip), sl, jump, m, note)));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.pop(); s.say("Schiebe den Regler, bis ein Gong ertönt."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(wr, "fade"); s.say("So sieht ein goldenes Rechteck aus. Es ist ein Quadrat plus ein kleineres Rechteck mit demselben Verhältnis."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.show(note, "up", 200); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Vorder-, Mittel-, Hintergrund",
        say: "Ein Bild bekommt Tiefe, wenn du es in drei Ebenen baust: vorne, in der Mitte und hinten.",
        build(s) {
          const W = 560, H = 440;
          const svg = s.svg(W, H);
          const defs = s.el("defs", {}, s.el("clipPath", { id: "kk-clip5" }, s.el("rect", { x: 0, y: 0, width: W, height: H, rx: 12 })));
          const sky = s.el("g", {}, s.el("rect", { width: W, height: H, fill: "#d8ecf8" }), s.el("circle", { cx: 430, cy: 90, r: 34, fill: "#fff3b0" }));
          const back = s.el("g", { class: "later" }, s.el("path", { d: "M-100,300 L20,170 L110,250 L220,140 L330,260 L420,190 L520,270 L660,200 L660,330 L-100,330 Z", fill: "#b4c4de" }));
          const mid = s.el("g", { class: "later" }, s.el("path", { d: "M-100,330 C0,260 100,260 200,320 C300,370 400,280 500,300 C560,310 620,300 660,320 L660,440 L-100,440 Z", fill: "#7fbf78" }),
            ...[60, 230, 420].map(x => s.el("g", {}, s.el("rect", { x: x - 4, y: 300, width: 8, height: 24, fill: "#7a4a22" }), s.el("circle", { cx: x, cy: 292, r: 20, fill: "#3f8f45" }))));
          const front = s.el("g", { class: "later" }, s.el("path", { d: "M-100,400 C50,370 200,390 320,395 C440,400 560,380 660,390 L660,440 L-100,440 Z", fill: "#2f6f35" }),
            s.el("rect", { x: 20, y: 130, width: 40, height: 300, fill: "#6b4423" }), s.el("circle", { cx: 40, cy: 120, r: 70, fill: "#2f7d32" }),
            ...[300, 380, 460].map((x, i) => s.el("g", {}, s.el("line", { x1: x, y1: 428, x2: x, y2: 380 - i * 12, stroke: "#1f5a28", "stroke-width": 5 }), s.el("circle", { cx: x, cy: 372 - i * 12, r: 15, fill: ["#dc3b2a", "#ffd94a", "#ee7a1a"][i] }))));
          const scene = s.el("g", { "clip-path": "url(#kk-clip5)" }, sky, back, mid, front);
          svg.append(defs, scene);
          const place = v => { setT(back, v * 0.15, 0); setT(mid, v * 0.5, 0); setT(front, v * 1.4, 0); };
          const sl = s.slider({ label: "Zugfenster: Kamera bewegen", min: -60, max: 60, step: 1, value: 0, fmt: v => (v > 0 ? "→ " : v < 0 ? "← " : "") + Math.abs(v), onInput: place });
          const slWrap = s.h("div", { class: "later" }, sl);
          const e1 = s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel", style: { color: "#6b7fa8" } }, "Hintergrund"), s.h("p", { class: "small", html: "Klein, hell und blass. Je weiter weg, desto <b>blasser</b>." }));
          const e2 = s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel", style: { color: "#3f8f45" } }, "Mittelgrund"), s.h("p", { class: "small", html: "Mittlere Größe, mittlere Farben." }));
          const e3 = s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel", style: { color: "#2f6f35" } }, "Vordergrund"), s.h("p", { class: "small", html: "<b>Groß</b>, dunkel, kräftige Farben, viele Einzelheiten." }));
          const life = box(s, "life", "Im Alltag", "Im Zugfenster ziehen nahe Bäume schnell vorbei, ferne Berge langsam. Auch Computerspiele nutzen das.");
          s.add(cols(s, svg, stack(s, 10, e1, e2, e3, slWrap, life), W));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.pop(); s.show(e1, "up"); await s.show(back, "fade"); s.say("Ganz hinten: ferne Berge, hell und blass."); });
          s.step(async () => { s.sfx.pop(); s.show(e2, "up"); await s.show(mid, "up"); s.say("Dahinter und davor: der Mittelgrund."); });
          s.step(async () => { s.sfx.pop(); s.show(e3, "up"); await s.show(front, "up"); s.say("Ganz vorne: groß, dunkel und mit vielen Einzelheiten."); });
          s.step(async () => { s.sfx.ding(); s.show(slWrap, "pop"); await s.show(life, "up"); s.say("Schiebe den Regler und sieh, wie sich die Ebenen unterschiedlich schnell bewegen."); });
        },
      },
      /* 5b --------------------------------------------------------------- */
      {
        title: "Tiefe im Gemälde: Bruegel",
        say: "Pieter Bruegel malte 1565 die Jäger im Schnee. Das Bild hat einen Vordergrund, einen Mittelgrund und einen Hintergrund.",
        build(s) {
          const pic = s.photo("bruegel-jaeger", { w: 600, h: 427, pos: "50% 50%" });
          const e1 = box(s, "ex", "Vordergrund", "Links vorn: die <b>Jäger</b> mit ihren Hunden. Groß, dunkel, mit vielen Einzelheiten.", false);
          const e2 = box(s, "ex", "Mittelgrund", "Das <b>Dorf</b> und die zugefrorenen Teiche. Darauf laufen winzige Menschen Schlittschuh.");
          const e3 = box(s, "ex", "Hintergrund", "Die <b>Berge</b> ganz hinten: klein, hell und blass, fast im Himmel verschwunden.");
          const info = P(s, "<b>Pieter Bruegel der Ältere</b>, 1565. Heute im Kunsthistorischen Museum in Wien.", "small", true);
          s.add(cols(s, pic, stack(s, 10, e1, e2, e3, info), 600));
          s.show(pic, "zoom"); s.sound("wind", { vol: .35, dur: 5 });
          s.step(async () => { s.sfx.pop(); await s.show(e2, "up"); s.say("In der Mitte das Dorf und das Eis mit den Schlittschuhläufern."); });
          s.step(async () => { s.sfx.pop(); await s.show(e3, "up"); s.say("Ganz hinten die Berge, blass wie im Nebel."); });
          s.step(async () => { s.sfx.ding(); await s.show(info, "fade"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Symmetrie",
        say: "Bei einem symmetrischen Bild sind beide Hälften Spiegelbilder. Klappe den Schmetterling auf.",
        build(s) {
          const svg = s.svg(540, 440);
          const mkHalf = () => s.el("g", {},
            s.el("path", { d: "M262,190 C220,90 120,90 110,150 C105,200 180,220 262,215 Z", fill: "#ee7a1a", stroke: INK, "stroke-width": 4, "stroke-linejoin": "round" }),
            s.el("path", { d: "M262,225 C200,230 140,260 150,320 C165,370 240,330 262,270 Z", fill: "#ffd94a", stroke: INK, "stroke-width": 4, "stroke-linejoin": "round" }),
            s.el("circle", { cx: 160, cy: 152, r: 17, fill: "#fff", stroke: INK, "stroke-width": 3 }), s.el("circle", { cx: 192, cy: 298, r: 15, fill: "#dc3b2a", stroke: INK, "stroke-width": 3 }));
          const half = mkHalf(), mir = mkHalf(); half.classList.add("later");
          const body = s.el("g", { class: "later" }, s.el("ellipse", { cx: 270, cy: 228, rx: 11, ry: 76, fill: INK }), s.el("circle", { cx: 270, cy: 142, r: 14, fill: INK }),
            s.el("path", { d: "M264,130 C250,100 240,95 232,98 M276,130 C290,100 300,95 308,98", stroke: INK, "stroke-width": 4, fill: "none", "stroke-linecap": "round" }));
          const axis = s.el("line", { x1: 270, y1: 60, x2: 270, y2: 400, stroke: "#dc3b2a", "stroke-width": 4, "stroke-dasharray": "12 9", class: "later" });
          const setK = k => mir.setAttribute("transform", `translate(270,0) scale(${-k},1) translate(-270,0)`); setK(0);
          svg.append(mir, half, body, axis, lbl(s, 270, 428, "Spiegelachse"));
          const sl = s.slider({ label: "Flügel aufklappen", min: 0, max: 100, step: 1, value: 0, fmt: v => v + " %", onInput: v => setK(v / 100) });
          const slW = s.h("div", { class: "later" }, sl);
          const e1 = box(s, "ex", "Symmetrisch", "Beide Hälften sind <b>Spiegelbilder</b>. Das Bild wirkt ruhig, stabil und festlich.", false);
          const m = merk(s, "<b>Symmetrie:</b> Links und rechts von der Spiegelachse sieht es <b>gleich</b> aus.");
          const life = s.photo("brandenburger-tor", { w: 280, h: 250, pos: "50% 45%", caption: "Brandenburger Tor", cls: "later" });
          s.add(cols(s, svg, stack(s, 12, P(s, "Falte ein Blatt in der Mitte: Beide Seiten passen genau aufeinander."), slW, e1, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "14px", alignItems: "center" } }, m, life))));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.pop(); await s.show([half, body], "pop"); s.say("Hier ist die linke Hälfte eines Schmetterlings."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(axis, "draw"); s.show(slW, "pop"); await s.tween({ from: 0, to: 100, dur: 1400, ease: "inOut", update: v => sl.set(Math.round(v)) }); s.sfx.ding(); s.say("Die rechte Hälfte ist das Spiegelbild. Das ist Symmetrie."); });
          s.step(async () => { s.sfx.pop(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(life, "zoom"); s.say("Auch Gebäude sind oft symmetrisch, zum Beispiel das Brandenburger Tor in Berlin."); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Asymmetrie und Gleichgewicht",
        say: "Ein Bild muss nicht symmetrisch sein. Auch wenn links und rechts verschieden sind, kann es im Gleichgewicht sein.",
        build(s) {
          const svg = s.svg(560, 440);
          const PX = 280, PY = 320;
          svg.append(s.el("line", { x1: 30, y1: 372, x2: 530, y2: 372, stroke: "#8b95a5", "stroke-width": 5, "stroke-linecap": "round" }), s.el("polygon", { points: `${PX},${PY} ${PX - 40},372 ${PX + 40},372`, fill: "#8b95a5" }));
          const beam = s.el("g", {});
          const big = s.el("g", {}, s.el("circle", { r: 46, fill: "#2f7d32", stroke: INK, "stroke-width": 4 }), s.el("text", { y: 9, "text-anchor": "middle", "font-size": 28, "font-weight": 800, fill: "#fff", text: "groß" }));
          const small = s.el("g", {}, s.el("circle", { r: 33, fill: "#ee7a1a", stroke: INK, "stroke-width": 4 }));
          beam.append(s.el("rect", { x: -250, y: -8, width: 500, height: 16, rx: 6, fill: "#a8753a", stroke: "#7a4a22", "stroke-width": 3 }), big, small);
          svg.append(beam);
          let d = 120;
          const upd = v => {
            d = v; setT(big, -100, -54); setT(small, d, -41);
            const diff = 2 * d - 400, ang = clamp(diff / 12, -16, 16);
            setT(beam, PX, PY - 8 + 0, 1, 1, ang);
            const ok = Math.abs(diff) < 26;
            chip.style.visibility = ok ? "visible" : "hidden";
            if (ok && !was) s.sfx.ding(); was = ok;
          };
          let was = false;
          const chip = s.h("div", { class: "chip", style: { visibility: "hidden", background: "#ffd94a" } }, "Im Gleichgewicht!");
          const sl = s.slider({ label: "Kleine Kugel: Abstand zur Mitte", min: 60, max: 250, step: 2, value: 120, fmt: v => v + "", onInput: upd });
          const slW = s.h("div", { class: "stack later" }, sl, chip);
          upd(120);
          const m = merk(s, "<b>Asymmetrie:</b> links und rechts sind <b>verschieden</b>. Trotzdem passt es, wenn Großes nah an der Mitte und Kleines weit außen steht.");
          const life = box(s, "life", "Im Alltag", "Auf Plakaten und Zeitschriften-Covern steht oft ein großer Titel links und ein kleines Bild rechts. Auf der Wippe sitzt ein schwerer Mensch näher am Drehpunkt.");
          s.add(cols(s, svg, stack(s, 12, P(s, "Auch <b>große</b> und <b>kleine</b> Dinge können sich im Bild ausbalancieren."), slW, m, life), 560));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.boing(); s.show(slW, "up"); s.say("Schiebe die kleine Kugel, bis die Wippe im Gleichgewicht ist."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.show(life, "up", 200); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Ruhe und Bewegung",
        say: "Waagerechte Linien wirken ruhig. Schräge Linien bringen Bewegung ins Bild. Kippe die Linie und schau, was passiert.",
        build(s) {
          const svg = s.svg(560, 440);
          const bg = s.el("rect", { x: 0, y: 0, width: 560, height: 440, rx: 12, fill: "#dff1fb" });
          const line = s.el("g", {}), ball = s.el("g", {});
          line.append(s.el("rect", { x: -250, y: 0, width: 500, height: 14, rx: 7, fill: "#7a4a22" }));
          ball.append(s.el("circle", { r: 24, fill: "#dc3b2a", stroke: INK, "stroke-width": 4 }), s.el("path", { d: "M-24,0 H24", stroke: "#fff", "stroke-width": 4 }));
          line.append(ball);
          svg.append(bg, line);
          let ang = 0, bx = 0, spin = 0;
          const place = () => { setT(line, 280, 250, 1, 1, ang); setT(ball, bx, -24, 1, 1, spin); };
          const mix = (a, b, t) => { const pa = a.map(h => parseInt(h, 16)), pb = b.map(h => parseInt(h, 16)); return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, "0")).join(""); };
          const colA = ["df", "f1", "fb"], colB = ["fd", "d8", "b0"];
          const stT = s.h("p", { class: "big", style: { color: UC } }, "Ruhe");
          const stS = s.h("p", { class: "small" }, "Alles liegt still.");
          let was = "ruhe";
          const sl = s.slider({ label: "Linie kippen", min: 0, max: 35, step: 1, value: 0, fmt: v => v + "°", onInput: v => {
            ang = v; bg.setAttribute("fill", mix(colA, colB, v / 35));
            const st = v < 5 ? "ruhe" : "bewegung";
            if (st !== was) { was = st; stT.textContent = st === "ruhe" ? "Ruhe" : "Bewegung!"; stS.textContent = st === "ruhe" ? "Alles liegt still." : "Die Kugel rollt los!"; stT.style.color = st === "ruhe" ? UC : "#dc3b2a"; st === "ruhe" ? s.sfx.click() : s.sfx.whoosh(); }
            if (st === "ruhe") bx = 0;
            place();
          } });
          s.loop((t, dt) => { if (ang >= 5) { const v = 60 + ang * 11; bx += v * dt; spin += v * dt / 24 * 57.3; if (bx > 220) bx = -220; place(); } });
          place();
          const slW = s.h("div", { class: "later" }, sl);
          const e1 = box(s, "ex", "Waagerecht = Ruhe", "Horizont am Meer, ein See, ein schlafender Mensch.", false);
          const e2 = box(s, "ex", "Schräg = Bewegung", "Eine Rutsche, eine Skipiste, ein Berg. In Comics zeigen schräge Linien Tempo.");
          const m = merk(s, "<b>Waagerechte</b> Linien wirken <b>ruhig</b>. <b>Schräge</b> (diagonale) Linien wirken <b>bewegt</b>.");
          const life = box(s, "life", "Im Alltag", "In Comics zeigen schräge Linien Tempo. Auf Sportfotos ist die Diagonale beliebt.");
          s.add(cols(s, svg, stack(s, 10, s.h("div", { class: "stack", style: { gap: "2px", minHeight: "80px" } }, stT, stS), slW, e1, e2, m), 560));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.pop(); s.show(slW, "pop"); s.say("Die Linie liegt waagerecht. Alles ist ruhig. Kippe sie jetzt!"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(e2, "up"); await s.tween({ from: 0, to: 25, dur: 1200, update: v => sl.set(Math.round(v)) }); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Leserichtung",
        say: "Wir lesen von links nach rechts und von oben nach unten. Darauf achtet man auch beim Gestalten.",
        build(s) {
          const svg = s.svg(560, 440);
          svg.append(s.el("rect", { x: 10, y: 10, width: 540, height: 290, rx: 8, fill: "#fff", stroke: "#8b95a5", "stroke-width": 3 }),
            s.el("rect", { x: 30, y: 28, width: 230, height: 26, rx: 5, fill: INK }),
            s.el("circle", { cx: 505, cy: 42, r: 15, fill: "#ee7a1a" }),
            s.el("rect", { x: 60, y: 80, width: 330, height: 150, rx: 6, fill: "#bfe3f5" }), s.el("path", { d: "M60,230 C130,170 200,200 260,175 S350,170 390,200 V230 Z", fill: "#7fbf78" }), s.el("circle", { cx: 340, cy: 120, r: 22, fill: "#ffc928" }),
            s.el("rect", { x: 340, y: 262, width: 190, height: 14, rx: 4, fill: "#8b95a5" }),
            s.el("rect", { x: 400, y: 100, width: 130, height: 12, rx: 4, fill: "#cbd5e1" }), s.el("rect", { x: 400, y: 124, width: 110, height: 12, rx: 4, fill: "#cbd5e1" }));
          const zp = s.el("path", { d: "M42,41 L488,41 L72,248 L330,269", fill: "none", stroke: "#dc3b2a", "stroke-width": 5, "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-dasharray": "14 9", class: "later" });
          const eyeDot = s.el("circle", { r: 11, fill: "#dc3b2a", stroke: "#fff", "stroke-width": 3, class: "later" });
          svg.append(zp, eyeDot);
          // runner strip
          const strip = s.el("g", { class: "later" }, s.el("line", { x1: 20, y1: 420, x2: 540, y2: 420, stroke: "#8b95a5", "stroke-width": 5, "stroke-linecap": "round" }));
          const runner = s.el("g", {}), parts = {};
          parts.head = s.el("circle", { cx: 0, cy: -78, r: 12, fill: "#f3c9a5", stroke: INK, "stroke-width": 3 });
          ["body", "armA", "armB", "legA", "legB"].forEach(n => (parts[n] = s.el("line", { stroke: INK, "stroke-width": 6, "stroke-linecap": "round" })));
          runner.append(...Object.values(parts)); strip.append(runner);
          svg.append(strip);
          let dir = 1, rx = 120, len = 0;
          const pose = t => {
            const sw = Math.sin(t * 9) * 28 * RAD, L = 34;
            parts.body.setAttribute("x1", 0); parts.body.setAttribute("y1", -66); parts.body.setAttribute("x2", 0); parts.body.setAttribute("y2", -30);
            [["armA", 1], ["armB", -1]].forEach(([n, sg]) => { parts[n].setAttribute("x1", 0); parts[n].setAttribute("y1", -60); parts[n].setAttribute("x2", Math.sin(sw * sg) * 26); parts[n].setAttribute("y2", -60 + Math.cos(sw * sg) * 26); });
            [["legA", 1], ["legB", -1]].forEach(([n, sg]) => { parts[n].setAttribute("x1", 0); parts[n].setAttribute("y1", -30); parts[n].setAttribute("x2", Math.sin(sw * sg) * L); parts[n].setAttribute("y2", -30 + Math.cos(sw * sg) * L); });
          };
          let running = false;
          s.loop((t, dt) => {
            if (len && !eyeDot.classList.contains("later")) { const p = zp.getPointAtLength(((t * 0.18) % 1) * len); eyeDot.setAttribute("cx", p.x); eyeDot.setAttribute("cy", p.y); }
            if (running) { rx += dir * 90 * dt; if (rx > 500) rx = 60; if (rx < 60) rx = 500; setT(runner, rx, 416, dir, 1); pose(t); }
          });
          pose(0); setT(runner, rx, 416, 1, 1);
          const stT = s.h("p", { class: "h2" }, "Nach rechts"), stS = s.h("p", { class: "small", html: "Das wirkt oft wie <b>vorwärts</b>: Es geht voran!" });
          const dirBtn = s.h("button", { class: "btn later", onclick: () => { dir = -dir; s.sfx.swoosh(); stT.textContent = dir > 0 ? "Nach rechts" : "Nach links"; stS.innerHTML = dir > 0 ? "Das wirkt oft wie <b>vorwärts</b>: Es geht voran!" : "Das wirkt oft wie <b>zurück</b>: Er kommt uns entgegen."; } }, "Richtung wechseln");
          const status = s.h("div", { class: "card soft later", style: { minHeight: "118px" } }, stT, stS);
          const e1 = box(s, "ex", "Z-Weg", "Das Auge startet <b>oben links</b>, wandert nach rechts, dann schräg nach links unten und wieder nach rechts.", false);
          const m = merk(s, "Wichtiges steht oft <b>oben links</b>, weil wir dort zu lesen beginnen. Bewegung nach <b>rechts</b> wirkt oft wie Vorwärts.");
          s.add(cols(s, svg, stack(s, 10, e1, status, dirBtn, m), 560));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); await s.show(zp, "draw"); s.show(eyeDot, "pop"); len = zp.getTotalLength(); s.say("So wandert das Auge über ein Plakat: oben links beginnt der Titel."); });
          s.step(async () => { s.sfx.pop(); s.show(strip, "up"); running = true; await s.show(status, "up"); s.show(dirBtn, "pop"); s.say("Auch Figuren, die nach rechts laufen, wirken oft, als gingen sie voran."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Papier collé: Braque und Picasso",
        say: "Um neunzehnhundertzwölf klebten Braque und Picasso echtes Papier in ihre Bilder. Das nennt man Papier collé.",
        build(s) {
          const svg = s.svg(540, 440);
          svg.append(s.el("rect", { x: 6, y: 6, width: 528, height: 428, rx: 10, fill: "#f6efe0", stroke: "#c8b78f", "stroke-width": 4 }));
          const piece = (children) => { const g = s.el("g", { class: "later" }); g.append(...children); return g; };
          const stripes = []; for (let i = 0; i < 8; i++) stripes.push(s.el("rect", { x: -80 + i * 20, y: -140, width: 20, height: 280, fill: i % 2 ? "#e9c46a" : "#f4e3b0" }));
          const wall = piece([...stripes, ...[-50, 10, 60].map((x, i) => s.el("circle", { cx: x, cy: -70 + i * 80, r: 9, fill: "#c0392b", opacity: .75 })), s.el("rect", { x: -80, y: -140, width: 160, height: 280, fill: "none", stroke: "#b08a2a", "stroke-width": 2 })]);
          const news = piece([s.el("rect", { x: -120, y: -55, width: 240, height: 110, fill: "#ece6d8", stroke: "#a39b88", "stroke-width": 2 }), s.el("rect", { x: -108, y: -44, width: 100, height: 16, fill: "#3b3b3b" }),
            s.el("path", { d: "M-108,-14 H108 M-108,0 H108 M-108,14 H108 M-108,28 H60 M10,-40 H108 M10,-28 H108", stroke: "#8c8574", "stroke-width": 4 })]);
          const bottle = piece([s.el("path", { d: "M-18,-110 H18 V-60 C18,-40 40,-30 40,0 V90 H-40 V0 C-40,-30 -18,-40 -18,-60 Z", fill: "#7a4a22", stroke: "#4a2c12", "stroke-width": 3 }), s.el("rect", { x: -40, y: 20, width: 80, height: 40, fill: "#f4e3b0" })]);
          const glass = piece([s.el("path", { d: "M-45,-60 H45 L30,60 H-30 Z", fill: "#bfe3f5", stroke: INK, "stroke-width": 4, opacity: .9 })]);
          const apple = piece([s.el("circle", { r: 36, fill: "#dc3b2a", stroke: "#8e2a20", "stroke-width": 4 }), s.el("path", { d: "M0,-34 L4,-52", stroke: "#4a2c12", "stroke-width": 5 })]);
          const coal = s.el("path", { d: "M70,70 C160,40 240,60 300,40 M80,400 C200,380 330,410 470,385 M390,60 L470,90 M200,100 C210,160 205,240 190,300", fill: "none", stroke: "#2b2b2b", "stroke-width": 6, "stroke-linecap": "round", class: "later" });
          const FIN = [[wall, 170, 220, -4], [news, 330, 340, -8], [bottle, 345, 190, 6], [glass, 150, 330, -3], [apple, 245, 365, 0]];
          FIN.forEach(([g, x, y, r]) => setT(g, x, y, 1, 1, r));
          svg.append(wall, news, glass, bottle, apple, coal);
          const f1 = box(s, "ex", "Wer und wann?", "Um <b>1912</b>: <b>Georges Braque</b> und <b>Pablo Picasso</b>.", false);
          const f2 = box(s, "ex", "Was ist neu?", "Statt alles zu malen, klebten sie <b>echtes</b> Papier ins Bild: Tapete, Zeitung. Braque zum Beispiel in „Obstschale und Glas“.");
          const f3 = box(s, "ex", "Das Wort", "<i>Papier collé</i> ist Französisch: <i>coller</i> heißt <b>kleben</b>. Daraus wurde <b>Collage</b>.");
          const note = P(s, "Unser Bild ist nur ein eigenes Beispiel mit Papierschnipseln – keine Kopie.", "small pencil", true);
          s.add(cols(s, svg, stack(s, 10, f1, f2, f3, note)));
          s.show(svg, "zoom"); s.sfx.pop();
          const fly = async (g, i) => {
            const [, x, y, r] = FIN[i]; g.classList.remove("later"); s.sfx.swoosh();
            await s.tween({ from: 1, to: 0, dur: 650, ease: "out", update: t => setT(g, x + 420 * t, y - 120 * t, 1, 1, r + 60 * t) }); s.sfx.snap();
          };
          s.step(async () => { s.say("Zuerst klebt man die Tapete als Hintergrund."); s.sound("scissors"); await s.wait(500); await fly(wall, 0); await fly(glass, 3); });
          s.step(async () => { await fly(news, 1); await fly(bottle, 2); await fly(apple, 4); s.show(f2, "up"); });
          s.step(async () => { s.sfx.scribble(); await s.show(coal, "fade"); s.sfx.ding(); s.show(f3, "up"); s.show(note, "fade", 200); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Kurt Schwitters und Merz",
        say: "Kurt Schwitters klebte Fundstücke und Papierschnipsel zu Bildern. Er nannte das Merz.",
        build(s) {
          const pic = s.photo("schwitters-billet", { w: 400, h: 532, fit: "contain", style: { background: "#fff" } });
          const f1 = box(s, "ex", "Wer?", "<b>Kurt Schwitters</b>: geboren 1887 in Hannover, gestorben 1948 in Kendal (England).", false);
          const f2 = box(s, "ex", "Merz", "Das Wort stammt aus einem Schnipsel mit „Kommerz- und Privatbank“. Er klebte <b>Fundstücke</b> zu Kunst.");
          const f3 = box(s, "ex", "Schau genau!", "In dieser echten Collage klebt ein <b>Straßenbahn-Fahrschein</b>. Daneben: Zeitungspapier und bunte Papierreste.");
          const f4 = box(s, "ex", "Merzbau", "Ein ganzer Raum in seinem Elternhaus in Hannover wurde zur Collage. 1943 zerstörte ihn ein Bombenangriff.");
          s.add(cols(s, pic, stack(s, 10, f1, f2, f3, f4), 420));
          s.show(pic, "zoom"); s.sfx.pop();
          s.step(async () => { s.sound("paper-crumple", { dur: 1.5 }); await s.show(f2, "up"); s.say("Pappe, Fahrkarten, Zeitungspapier: alles Fundstücke."); });
          s.step(async () => { s.sound("tram-bell", { vol: .5, dur: 2.5 }); await s.show(f3, "up"); s.say("Findest du den Fahrschein der Straßenbahn?"); });
          s.step(async () => { s.sfx.ding(); await s.show(f4, "up"); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Dein Collage-Board",
        say: "Tippe auf ein Papier, ziehe es aufs Bild, drehe es und mache es größer oder kleiner.",
        build(s) {
          const W = 640, H = 470;
          const svg = s.svg(W, H);
          svg.append(s.el("rect", { x: 4, y: 4, width: W - 8, height: H - 8, rx: 12, fill: "#f6efe0", stroke: "#c8b78f", "stroke-width": 4 }));
          const hint = s.el("text", { x: W / 2, y: H / 2, "text-anchor": "middle", class: "hlbl", text: "Tippe rechts auf ein Papier!" });
          const layer = s.el("g", {});
          const mark = s.el("g", { class: "later", style: { pointerEvents: "none" } }, s.el("rect", { fill: "none", stroke: "#1d5bd0", "stroke-width": 3, "stroke-dasharray": "8 6" }));
          svg.append(hint, layer, mark);
          const defs = [
            ["Zeitung", () => [s.el("rect", { x: -45, y: -55, width: 90, height: 110, fill: "#ece6d8", stroke: "#a39b88", "stroke-width": 2 }), s.el("rect", { x: -36, y: -46, width: 72, height: 14, fill: "#3b3b3b" }), s.el("path", { d: "M-36,-18 H36 M-36,-4 H36 M-36,10 H36 M-36,24 H10 M-36,38 H36", stroke: "#8c8574", "stroke-width": 4 })]],
            ["Dreieck", () => [s.el("polygon", { points: "0,-58 60,46 -60,46", fill: "#1d5bd0" })]],
            ["Kreis", () => [s.el("circle", { r: 50, fill: "#dc3b2a" })]],
            ["Tapete", () => [...[0, 1, 2, 3, 4, 5].map(i => s.el("rect", { x: -45 + i * 15, y: -50, width: 15, height: 100, fill: i % 2 ? "#e9c46a" : "#3f8f45" }))]],
            ["Fahrkarte", () => [s.el("rect", { x: -62, y: -30, width: 124, height: 60, fill: "#ffd94a", stroke: "#b08a2a", "stroke-width": 2 }), s.el("circle", { cx: -62, cy: 0, r: 9, fill: "#f6efe0" }), s.el("circle", { cx: 62, cy: 0, r: 9, fill: "#f6efe0" }), s.el("path", { d: "M-42,-12 H42 M-42,2 H42 M-42,16 H12", stroke: "#8c6d1a", "stroke-width": 4 })]],
            ["Stern", () => [s.el("polygon", { points: star(0, 0, 58, 25), fill: "#ee7a1a", stroke: "#b25a0c", "stroke-width": 3 })]],
          ];
          const items = []; let sel = null;
          const place = it => { setT(it.g, it.x, it.y, it.k, it.k, it.rot); if (sel === it) updMark(); };
          const updMark = () => {
            if (!sel) { mark.classList.add("later"); return; }
            const bb = sel.g.firstChild ? sel.g.getBBox() : null; if (!bb) return;
            const r = mark.firstChild; r.setAttribute("x", bb.x - 6); r.setAttribute("y", bb.y - 6); r.setAttribute("width", bb.width + 12); r.setAttribute("height", bb.height + 12);
            mark.setAttribute("transform", `translate(${sel.x},${sel.y}) rotate(${sel.rot}) scale(${sel.k},${sel.k})`); mark.classList.remove("later");
          };
          const select = it => { sel = it; updMark(); };
          const add = (di, x = W / 2 + (Math.random() - .5) * 120, y = H / 2 + (Math.random() - .5) * 100, rot = (Math.random() - .5) * 40) => {
            const g = s.el("g", {}); g.append(...defs[di][1]());
            const it = { g, x, y, rot, k: 1 }; items.push(it); layer.append(g); hint.setAttribute("opacity", 0); place(it); select(it);
            let off = { x: 0, y: 0 };
            s.drag(g, { space: svg, onStart: p => { off = { x: p.x - it.x, y: p.y - it.y }; layer.append(g); select(it); s.sfx.click(); }, onMove: p => { it.x = clamp(p.x - off.x, 20, W - 20); it.y = clamp(p.y - off.y, 20, H - 20); place(it); } });
            s.tween({ from: 0.2, to: 1, dur: 350, ease: "back", update: v => { it.k = v; place(it); } });
            s.sfx.pop(); return it;
          };
          const tools = [
            ["Links drehen", () => { if (sel) { sel.rot -= 15; place(sel); s.sfx.tick(); } }],
            ["Rechts drehen", () => { if (sel) { sel.rot += 15; place(sel); s.sfx.tick(); } }],
            ["Größer", () => { if (sel) { sel.k = clamp(sel.k * 1.2, .4, 3); place(sel); s.sfx.tick(); } }],
            ["Kleiner", () => { if (sel) { sel.k = clamp(sel.k / 1.2, .4, 3); place(sel); s.sfx.tick(); } }],
            ["Löschen", () => { if (sel) { sel.g.remove(); items.splice(items.indexOf(sel), 1); sel = null; updMark(); s.sfx.swoosh(); } }],
            ["Alles weg", () => { items.splice(0).forEach(i => i.g.remove()); sel = null; updMark(); hint.setAttribute("opacity", 1); s.sfx.swoosh(); }],
          ];
          const pal = s.h("div", { class: "later", style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px" } },
            defs.map(([name, mk], i) => { const ic = s.svg(60, 60, { viewBox: "-70 -70 140 140" }); ic.append(...mk()); return s.h("button", { class: "btn", "aria-label": name, style: { height: "76px", padding: 0 }, onclick: () => add(i) }, ic); }));
          const tb = s.h("div", { class: "later", style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" } }, tools.map(([t, f]) => s.h("button", { class: "btn", onclick: f }, t)));
          const m = merk(s, "<b>Collage</b> (von <i>coller</i> = kleben): Du <b>ordnest</b> Papierstücke neu zu einem Bild.");
          s.add(cols(s, svg, stack(s, 10, P(s, "Tippe ein Papier an, dann <b>ziehe</b> es aufs Bild."), pal, tb, m), W));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); await s.show(pal, "up"); add(2, 200, 250, 0); await s.wait(250); add(1, 330, 210, 15); await s.wait(250); add(0, 400, 330, -10); s.say("Tippe auf ein Papier. Es landet auf deinem Bild."); });
          s.step(async () => { s.sfx.pop(); await s.show(tb, "up"); s.say("Mit den Knöpfen drehst du das Papier und machst es größer oder kleiner."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Bauen: additiv und subtraktiv",
        say: "Additiv heißt: Du fügst Material dazu. Subtraktiv heißt: Du nimmst Material weg.",
        build(s) {
          const svg = s.svg(1100, 300);
          const GY = 272;
          const fig = (cx, extra) => [["ellipse", { cx, cy: 215, rx: 70, ry: 52 }], ["circle", { cx, cy: 128, r: 40 }], ["circle", { cx: cx - 88, cy: 196, r: 21 }], ["circle", { cx: cx + 88, cy: 196, r: 21 }]].map(([t, a]) => s.el(t, Object.assign({}, a, extra)));
          svg.append(lbl(s, 270, 26, "Additiv: Material dazugeben"), lbl(s, 830, 26, "Subtraktiv: Material wegnehmen"),
            s.el("line", { x1: 20, y1: GY, x2: 1080, y2: GY, stroke: "#8b95a5", "stroke-width": 5, "stroke-linecap": "round" }));
          // clay
          const blobs = fig(270, { fill: "#c47a4a", stroke: "#8d5538", "stroke-width": 4 }).map(b => { const g = s.el("g", { class: "later" }); g.append(b); setT(g, 0, -300); return g; });
          svg.append(...blobs);
          // stone
          const stone = s.el("rect", { x: 640, y: 56, width: 380, height: 212, fill: "#9aa3b2", stroke: "#6b7280", "stroke-width": 4, class: "later" });
          const defs = s.el("defs", {}, s.el("mask", { id: "kk-m13", maskUnits: "userSpaceOnUse", x: 600, y: 40, width: 460, height: 240 }, s.el("rect", { x: 600, y: 40, width: 460, height: 240, fill: "#fff" }), ...fig(830, { fill: "#000" })));
          const cover = s.el("rect", { x: 640, y: 56, width: 380, height: 212, fill: "#f4f6ee", mask: "url(#kk-m13)", opacity: 0 });
          const frameDash = s.el("rect", { x: 640, y: 56, width: 380, height: 212, fill: "none", stroke: "#6b7280", "stroke-width": 3, "stroke-dasharray": "10 8", class: "later" });
          const chips = []; for (let i = 0; i < 16; i++) { const c = s.el("polygon", { points: "0,-9 10,6 -9,7", fill: "#9aa3b2", stroke: "#6b7280", "stroke-width": 2, class: "later" }); chips.push(c); }
          svg.append(defs, stone, cover, frameDash, ...chips);
          const e1 = box(s, "ex", "Additiv", "Du <b>baust auf</b>: Ton, Gips, Pappmaché, Knete – und Lego! Stein für Stein kommt etwas dazu.", false);
          const e2 = box(s, "ex", "Subtraktiv", "Du <b>nimmst weg</b>: Aus Stein oder Holz schlägst, meißelst oder schnitzt du die Figur heraus.");
          const m = merk(s, "<b>Additiv</b> = aufbauen. <b>Subtraktiv</b> = abtragen. Oft heißt das erste <b>Plastik</b>, das zweite <b>Skulptur</b>.");
          s.add(s.h("div", { class: "stack", style: { gap: "12px" } }, svg, s.h("div", { class: "cols" }, e1, e2), m));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.say("Beim Modellieren kommt Ton dazu: erst der Körper, dann der Kopf, dann die Arme."); for (let i = 0; i < 4; i++) { blobs[i].classList.remove("later"); s.sfx.note(i * 3, .15); await s.tween({ from: -300, to: 0, dur: 500, ease: "bounce", update: v => setT(blobs[i], 0, v) }); } });
          s.step(async () => { s.sfx.pop(); await s.show([stone, frameDash], "pop"); s.say("Der Steinblock ist erst einmal ein Klotz."); });
          s.step(async () => {
            s.say("Jetzt wird weggemeißelt, bis die Figur übrig bleibt."); s.sound("meissel", { vol: .7 });
            const N = chips.length; let launched = 0;
            const fall = async (c, i) => { const x0 = i % 2 ? 650 + Math.random() * 70 : 940 + Math.random() * 70, y0 = 80 + Math.random() * 150; c.classList.remove("later"); const xe = x0 + (i % 2 ? -16 : 16); await s.tween({ from: 0, to: 1, dur: 500, ease: "in", update: t => setT(c, x0 + (xe - x0) * t, y0 + (GY - 10 - y0) * t, 1, 1, t * 200) }); };
            const run = []; for (let i = 0; i < N; i++) { run.push(fall(chips[i], i)); await s.wait(110); }
            s.tween({ from: 0, to: 1, dur: N * 110, ease: "linear", update: v => (cover.setAttribute("opacity", v)) });
            await Promise.all(run); cover.setAttribute("opacity", 1); s.sfx.ding();
          });
          s.step(async () => { s.sfx.pop(); await s.show(e2, "up"); await s.show(m, "up"); });
        },
      },
      /* 13b -------------------------------------------------------------- */
      {
        title: "Aufbauen oder abtragen?",
        say: "Rodin hat seinen Denker modelliert, also aufgebaut. Michelangelo hat seine Figur aus dem Marmor herausgeschlagen.",
        build(s) {
          const a = s.photo("rodin-denker", { w: 300, h: 400, pos: "50% 40%", caption: "Rodin: Der Denker" });
          const b = s.photo("michelangelo-sklave", { w: 300, h: 400, pos: "50% 0%", caption: "Michelangelo", cls: "later" });
          const e1 = box(s, "ex", "Additiv: Auguste Rodin", "Rodin <b>modellierte</b> das erste Modell vom <b>Denker</b> um 1881. Danach wurde er in <b>Bronze</b> gegossen.", false);
          const e2 = box(s, "ex", "Subtraktiv: Michelangelo", "Der <b>„Erwachende Sklave“</b> ist unfertig. Man sieht, wie die Figur aus dem <b>Marmorblock</b> herauswächst.");
          const m = merk(s, "Modellieren: <b>dazugeben</b>. Meißeln und Schnitzen: <b>wegnehmen</b>.");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "300px 300px 1fr", gap: "22px", alignItems: "center", height: "100%" } }, a, b, stack(s, 12, e1, e2, m)));
          s.show(a, "zoom"); s.sfx.pop();
          s.step(async () => { s.sound("meissel", { vol: .7 }); s.show(e2, "up"); await s.show(b, "zoom"); s.say("Bei Michelangelo steckt die Figur noch halb im Stein."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 13c -------------------------------------------------------------- */
      {
        title: "Ton: Kugel, Wulst und Platte",
        say: "Ton ist weiche Erde. Du knetest ihn und formst daraus Kugeln, Würste und Platten. Daraus baust du Gefäße und Figuren.",
        build(s) {
          const CL = "#c47a4a", CS = "#8d5538";
          const svg = s.svg(1100, 190);
          const lump = s.el("g", {}, s.el("path", { d: "M-70,30 C-80,-10 -50,-45 -5,-42 C40,-48 80,-15 72,22 C66,46 -60,52 -70,30 Z", fill: CL, stroke: CS, "stroke-width": 4 }));
          setT(lump, 130, 100);
          const arrow = s.el("g", { class: "later" }, s.el("line", { x1: 225, y1: 100, x2: 285, y2: 100, stroke: INK, "stroke-width": 5, "stroke-linecap": "round" }), arrowHead(s, 300, 100, 0, INK, 18));
          const ball = s.el("g", { class: "later" }, s.el("circle", { cx: 400, cy: 98, r: 52, fill: CL, stroke: CS, "stroke-width": 4 }), s.el("ellipse", { cx: 384, cy: 80, rx: 16, ry: 10, fill: "#fff", opacity: .35 }), lbl(s, 400, 182, "Kugel"));
          const coil = s.el("g", { class: "later" }, s.el("rect", { x: 510, y: 78, width: 250, height: 42, rx: 21, fill: CL, stroke: CS, "stroke-width": 4 }), s.el("line", { x1: 530, y1: 90, x2: 740, y2: 90, stroke: "#fff", "stroke-width": 5, opacity: .3, "stroke-linecap": "round" }), lbl(s, 635, 182, "Wulst (Wurst)"));
          const slab = s.el("g", { class: "later" }, s.el("polygon", { points: "860,120 1060,120 1030,70 890,70", fill: CL, stroke: CS, "stroke-width": 4, "stroke-linejoin": "round" }), s.el("polygon", { points: "860,120 1060,120 1060,138 860,138", fill: CS, stroke: CS, "stroke-width": 4, "stroke-linejoin": "round" }), lbl(s, 960, 182, "Platte"));
          svg.append(lump, lbl(s, 130, 182, "Ton kneten"), arrow, ball, coil, slab);
          /* three building techniques, each with a little animation */
          const card = (title, text, draw) => {
            const v = s.svg(220, 120); const api = draw(v);
            const c = s.h("div", { class: "card later", style: { padding: "10px 12px", display: "flex", flexDirection: "column", gap: "4px" } }, v, P(s, "<b>" + title + "</b>", "t"), P(s, text, "small"));
            c.api = api; return c;
          };
          const c1 = card("Daumenschale", "Kugel formen, Daumen hineindrücken und die Wand rundherum dünn drücken.", v => {
            const b = s.el("circle", { cx: 110, cy: 70, r: 42, fill: CL, stroke: CS, "stroke-width": 4 });
            const bowl = s.el("g", { opacity: 0 }, s.el("path", { d: "M50,60 Q50,112 110,112 Q170,112 170,60 Z", fill: CL, stroke: CS, "stroke-width": 4, "stroke-linejoin": "round" }), s.el("ellipse", { cx: 110, cy: 60, rx: 60, ry: 14, fill: "#8d5538", stroke: CS, "stroke-width": 4 }));
            const th = s.el("g", {}, s.el("rect", { x: 96, y: -30, width: 28, height: 46, rx: 14, fill: "#f2c9a0", stroke: "#b88a5e", "stroke-width": 3 }));
            v.append(b, bowl, th);
            return async () => { b.setAttribute("opacity", 1); bowl.setAttribute("opacity", 0);
              await s.tween({ from: 0, to: 1, dur: 700, ease: "inOut", update: t => th.setAttribute("transform", `translate(0,${t * 52})`) });
              s.sound("ton-patsch", { vol: .6 });
              await s.tween({ from: 0, to: 1, dur: 600, update: t => { b.setAttribute("opacity", 1 - t); bowl.setAttribute("opacity", t); th.setAttribute("transform", `translate(0,${52 - t * 70})`); } }); };
          });
          const c2 = card("Wulsttechnik", "Würste rollen, als Ringe aufeinanderlegen und innen glatt verstreichen.", v => {
            v.append(s.el("ellipse", { cx: 110, cy: 106, rx: 66, ry: 10, fill: CS }));
            const rings = [0, 1, 2, 3, 4].map(i => s.el("rect", { x: 46, y: 88 - i * 18, width: 128, height: 18, rx: 9, fill: CL, stroke: CS, "stroke-width": 3, opacity: 0 }));
            v.append(...rings);
            return async () => { rings.forEach(r => r.setAttribute("opacity", 0));
              for (let i = 0; i < rings.length; i++) { s.sfx.note(i * 2, .12); await s.tween({ from: -30, to: 0, dur: 280, ease: "out", update: y => { rings[i].setAttribute("opacity", 1); rings[i].setAttribute("transform", `translate(0,${y})`); } }); } };
          });
          const c3 = card("Plattentechnik", "Platte ausrollen wie Plätzchenteig, Teile ausschneiden und zu einem Kasten bauen.", v => {
            const base = s.el("polygon", { points: "50,100 150,100 180,78 80,78", fill: CL, stroke: CS, "stroke-width": 3, "stroke-linejoin": "round" });
            const walls = [s.el("polygon", { points: "80,78 180,78 180,28 80,28", fill: "#b06a3e", stroke: CS, "stroke-width": 3 }), s.el("polygon", { points: "50,100 80,78 80,28 50,50", fill: "#a8653f", stroke: CS, "stroke-width": 3 }),
              s.el("polygon", { points: "150,100 180,78 180,28 150,50", fill: "#a8653f", stroke: CS, "stroke-width": 3 }), s.el("polygon", { points: "50,100 150,100 150,50 50,50", fill: CL, stroke: CS, "stroke-width": 3, opacity: .92 })];
            walls.forEach(w => w.setAttribute("opacity", 0)); v.append(base, ...walls);
            return async () => { walls.forEach(w => w.setAttribute("opacity", 0)); for (const w of walls) { s.sfx.snap(); await s.tween({ from: 0, to: 1, dur: 260, update: t => w.setAttribute("opacity", t) }); } };
          });
          const ph = s.photo("daumenschale", { w: 280, h: 296, pos: "62% 50%", caption: "Eine Daumenschale entsteht", cls: "later" });
          const m = merk(s, "Erst gut <b>kneten</b>: Das drückt <b>Luftblasen</b> heraus. Sonst kann die Figur im Ofen platzen.");
          s.add(stack(s, 12, svg, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 280px", gap: "14px", alignItems: "start" } }, c1, c2, c3, ph), m));
          s.step(async () => {
            s.say("Erst wird geknetet. Der Ton wird weich und gleichmäßig.");
            for (let k = 0; k < 3; k++) { s.sound("ton-patsch", { vol: .6 }); await s.tween({ from: 0, to: Math.PI, dur: 420, update: a => setT(lump, 130, 100, 1 + .18 * Math.sin(a), 1 - .18 * Math.sin(a)) }); }
            setT(lump, 130, 100);
          });
          s.step(async () => { s.sfx.whoosh(); await s.show(arrow, "left"); for (const g of [ball, coil, slab]) { s.sfx.pop(); await s.show(g, "pop"); await s.wait(150); } s.say("Kugel, Wulst und Platte sind die drei Grundformen."); });
          [c1, c2, c3].forEach((c, i) => s.step(async () => { s.sfx.swoosh(); await s.show(c, "up"); if (i === 0) s.show(ph, "zoom"); await c.api(); }));
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 13d -------------------------------------------------------------- */
      {
        title: "Verbinden, trocknen, brennen",
        say: "Teile aus Ton klebst du mit Schlicker zusammen. Dann muss der Ton trocknen. Zum Schluss wird er im Brennofen steinhart.",
        build(s) {
          const svg = s.svg(1100, 248);
          const CL = "#c47a4a", CS = "#8d5538";
          svg.append(lbl(s, 180, 26, "1. Verbinden"), lbl(s, 550, 26, "2. Trocknen"), lbl(s, 900, 26, "3. Brennen"),
            s.el("line", { x1: 365, y1: 50, x2: 365, y2: 240, stroke: "#c9d2dc", "stroke-width": 3, "stroke-dasharray": "8 8" }), s.el("line", { x1: 730, y1: 50, x2: 730, y2: 240, stroke: "#c9d2dc", "stroke-width": 3, "stroke-dasharray": "8 8" }));
          /* 1: cup + handle */
          const cup = (x, y, fill) => s.el("path", { d: `M${x},${y} L${x + 120},${y} L${x + 110},${y + 120} Q${x + 60},${y + 134} ${x + 10},${y + 120} Z`, fill, stroke: CS, "stroke-width": 4, "stroke-linejoin": "round" });
          const handle = s.el("path", { d: "M0,0 C46,0 46,70 0,70", fill: "none", stroke: CL, "stroke-width": 16, "stroke-linecap": "round" });
          const hG = s.el("g", {}, handle); setT(hG, 300, 92);
          const scratch = s.el("path", { d: "M218,88 l12,12 M230,88 l-12,12 M212,150 l12,12 M224,150 l-12,12", stroke: "#5a3420", "stroke-width": 3, fill: "none", class: "later" });
          const slip = s.el("g", { class: "later" }, ...[[222, 94], [218, 156]].map(([x, y]) => s.el("ellipse", { cx: x, cy: y, rx: 12, ry: 9, fill: "#e3b38c", stroke: "#a8653f", "stroke-width": 2 })));
          svg.append(cup(90, 70, CL), hG, scratch, slip);
          /* 2: drying cup */
          const dryCup = cup(-60, -66, CL); const dG = s.el("g", {}, dryCup); setT(dG, 550, 136);
          const drops = [0, 1, 2].map(i => s.el("path", { d: "M0,-10 Q7,0 0,6 Q-7,0 0,-10 Z", fill: "#5aa9e6", opacity: 0 }));
          const days = s.el("text", { x: 550, y: 238, "text-anchor": "middle", class: "lbl", text: "einige Tage", opacity: 0 });
          svg.append(dG, ...drops, days);
          /* 3: kiln */
          const glow = s.el("rect", { x: 830, y: 90, width: 110, height: 90, rx: 8, fill: "#3a2a22" });
          svg.append(s.el("rect", { x: 805, y: 52, width: 160, height: 160, rx: 10, fill: "#9aa3b2", stroke: "#5b6474", "stroke-width": 4 }), glow,
            s.el("path", { d: "M860,170 L920,170 L915,120 L865,120 Z", fill: "#5a3420", opacity: .55 }), s.el("rect", { x: 820, y: 212, width: 130, height: 12, fill: "#5b6474" }));
          const th = s.el("rect", { x: 1003, y: 208, width: 18, height: 0, rx: 4, fill: "#dc3b2a" });
          svg.append(s.el("rect", { x: 1000, y: 52, width: 24, height: 160, rx: 12, fill: "#fff", stroke: "#5b6474", "stroke-width": 3 }), th, s.el("circle", { cx: 1012, cy: 218, r: 15, fill: "#dc3b2a" }));
          const temp = s.el("text", { x: 885, y: 240, "text-anchor": "middle", "font-size": 26, "font-weight": 800, fill: "#dc3b2a", text: "20 °C" });
          svg.append(temp);
          const e1 = box(s, "ex", "Verbinden", "Beide Stellen <b>aufrauen</b> (mit einer Gabel ritzen), <b>Schlicker</b> darauf und fest andrücken. Schlicker ist Ton mit Wasser – dein Kleber.");
          const e2 = box(s, "ex", "Trocknen", "Langsam trocknen lassen. Das Wasser verdunstet. Der Ton wird <b>heller</b>, hart – und ein bisschen <b>kleiner</b>.");
          const e3 = box(s, "ex", "Brennen", "Im <b>Brennofen</b> wird es etwa <b>900 °C</b> heiß. Ein Küchenbackofen schafft nur ungefähr 250 °C.");
          const ph = s.photo("toepferofen", { w: 200, h: 214, pos: "50% 55%", caption: "Töpferofen (Modell)", cls: "later" });
          const m = merk(s, "Gebrannter Ton heißt <b>Keramik</b>. Er löst sich in Wasser nicht mehr auf.");
          s.add(stack(s, 12, svg, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 200px", gap: "14px", alignItems: "start" } }, e1, e2, e3, ph), m));
          s.step(async () => {
            s.say("Erst ritzt du beide Stellen auf und streichst Schlicker darauf.");
            s.sound("papier-reiben", { vol: .5, dur: 1 }); await s.show(scratch, "draw"); s.sfx.pop(); await s.show(slip, "pop");
            await s.tween({ from: 300, to: 214, dur: 800, ease: "inOut", update: x => setT(hG, x, 92) }); s.sound("ton-patsch", { vol: .6 }); await s.show(e1, "up");
          });
          s.step(async () => {
            s.say("Beim Trocknen verdunstet das Wasser. Der Ton wird heller und etwas kleiner.");
            const c0 = [196, 122, 74], c1 = [222, 190, 158];
            s.tween({ from: 0, to: 1, dur: 1600, update: t => { drops.forEach((d, i) => { const k = (t * 1.5 + i / 3) % 1; d.setAttribute("opacity", (1 - k).toFixed(2)); d.setAttribute("transform", `translate(${520 + i * 30},${70 - k * 30})`); }); } }).then(() => drops.forEach(d => d.setAttribute("opacity", 0)));
            await s.tween({ from: 0, to: 1, dur: 1600, ease: "inOut", update: t => { dryCup.setAttribute("fill", `rgb(${c0.map((c, i) => Math.round(c + (c1[i] - c) * t)).join(",")})`); setT(dG, 550, 136, 1 - .08 * t, 1 - .08 * t); days.setAttribute("opacity", t); } });
            s.sfx.pop(); await s.show(e2, "up");
          });
          s.step(async () => {
            s.say("Im Brennofen wird es etwa neunhundert Grad heiß. Danach ist der Ton steinhart.");
            s.sound("fire", { vol: .45, dur: 3.5 });
            await s.tween({ from: 20, to: 900, dur: 2200, ease: "inOut", update: v => { const k = (v - 20) / 880; temp.textContent = Math.round(v / 10) * 10 + " °C"; th.setAttribute("y", 208 - 150 * k); th.setAttribute("height", 150 * k); glow.setAttribute("fill", `rgb(${Math.round(58 + 197 * k)},${Math.round(42 + 110 * k)},${Math.round(34 + 10 * k)})`); } });
            temp.textContent = "900 °C"; s.sfx.ding(); s.show(e3, "up"); await s.show(ph, "zoom");
          });
          s.step(async () => { s.sfx.success(); await s.show(m, "up"); });
        },
      },
      /* 13e -------------------------------------------------------------- */
      {
        title: "Terrakotta: gebrannte Erde",
        say: "Terrakotta ist Italienisch und heißt gebrannte Erde. Menschen formen seit Tausenden von Jahren Kunst aus Ton.",
        build(s) {
          const mk = (id, pos, cap, text) => s.h("div", { class: "card later", style: { padding: "10px", display: "flex", flexDirection: "column", gap: "8px" } }, s.photo(id, { w: 324, h: 220, pos, caption: cap }), P(s, text, "small"));
          const k1 = mk("terrakotta-armee", "50% 45%", "Terrakotta-Armee, China", "Rund <b>8000</b> lebensgroße Figuren aus Ton bewachen das Grab des ersten Kaisers von China. Gefunden wurden sie <b>1974</b> beim Brunnengraben.");
          const k2 = mk("amphore", "50% 42%", "Griechische Amphore", "Aus Athen, um <b>550 v. Chr.</b>: Der Maler hat schwarze Figuren auf den roten Ton gemalt.");
          const k3 = mk("rotes-rathaus-fries", "50% 40%", "Rotes Rathaus, Berlin", "<b>36 Tafeln</b> aus Terrakotta (1877–1879) erzählen die Geschichte Berlins: die „Steinerne Chronik“.");
          const top = merk(s, "<b>Terrakotta</b> ist Italienisch und heißt <b>„gebrannte Erde“</b>: Ton, der ohne Glasur gebrannt wurde.", false);
          const life = box(s, "life", "Im Alltag", "Blumentöpfe, Dachziegel und Backsteine sind gebrannter Ton. Tassen und Teller sind Keramik mit Glasur.");
          s.add(stack(s, 14, top, s.h("div", { class: "cols3" }, k1, k2, k3), life));
          s.step(async () => { s.sfx.whoosh(); await s.show(k1, "zoom"); s.say("In China stehen Tausende Soldaten aus Ton."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(k2, "zoom"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(k3, "zoom"); s.say("Und in Berlin: Am Roten Rathaus erzählen Bilder aus Terrakotta die Stadtgeschichte."); });
          s.step(async () => { s.sfx.success(); await s.show(life, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Relief",
        say: "Ein Relief steht aus einer Fläche heraus. Du siehst es nur von vorn. Mit seitlichem Licht wirft es Schatten.",
        build(s) {
          const svg = s.svg(560, 440);
          const BASE = 330;
          svg.append(s.el("rect", { x: 20, y: BASE, width: 520, height: 70, rx: 6, fill: "#c9b79a", stroke: "#8d7b5a", "stroke-width": 4 }), lbl(s, 280, 430, "Relief von der Seite gesehen"));
          const shG = s.el("g", {}), buG = s.el("g", {});
          svg.append(shG, buG);
          const bumps = [{ t: "rect", x: 60, w: 90, H: 110 }, { t: "dome", x: 210, w: 110, H: 150 }, { t: "tri", x: 380, w: 100, H: 130 }];
          const sh = bumps.map(() => s.el("polygon", { fill: "rgba(30,40,60,.3)" })), bu = bumps.map(b => s.el("path", { fill: "#d9c3a0", stroke: "#8d7b5a", "stroke-width": 4, "stroke-linejoin": "round" }));
          shG.append(...sh); buG.append(...bu);
          const upd = v => {
            const k = v / 100;
            bumps.forEach((b, i) => {
              const h = Math.max(0.01, b.H * k), L = h * 0.9;
              let d, P;
              if (b.t === "rect") { d = `M${b.x},${BASE} V${BASE - h} H${b.x + b.w} V${BASE} Z`; P = [b.x + b.w, BASE - h]; }
              else if (b.t === "dome") { d = `M${b.x},${BASE} A${b.w / 2},${h} 0 0 1 ${b.x + b.w},${BASE} Z`; P = [b.x + b.w * 0.8, BASE - h * 0.8]; }
              else { d = `M${b.x},${BASE} L${b.x + b.w / 2},${BASE - h} L${b.x + b.w},${BASE} Z`; P = [b.x + b.w / 2, BASE - h]; }
              bu[i].setAttribute("d", d);
              sh[i].setAttribute("points", `${P[0]},${P[1]} ${b.x + b.w + L},${BASE} ${b.x + b.w},${BASE}`);
            });
          };
          // light
          const light = s.el("g", { class: "later" }, s.el("circle", { cx: 70, cy: 70, r: 24, fill: "#ffc928", stroke: "#e09a00", "stroke-width": 4 }),
            ...[0, 1, 2].map(i => s.el("line", { x1: 110, y1: 62 + i * 18, x2: 190, y2: 130 + i * 40, stroke: "#e09a00", "stroke-width": 4, "stroke-dasharray": "9 7", "stroke-linecap": "round" })));
          svg.append(light);
          upd(100);
          const sl = s.slider({ label: "Wie hoch ist das Relief?", min: 0, max: 100, step: 1, value: 100, fmt: v => (v === 0 ? "flach" : v + " %"), onInput: upd });
          const slW = s.h("div", { class: "later" }, sl);
          const e1 = box(s, "ex", "Nur von vorn", "Ein Relief ist <b>nicht von allen Seiten</b> zu sehen. Es wächst aus einem Hintergrund heraus.", false);
          const e2 = box(s, "ex", "Selber machen", "Klebe Pappe in <b>Schichten</b> übereinander: Je mehr Schichten, desto höher das Relief. Das ist additiv.");
          const life = s.photo("pergamon-relief", { w: 500, h: 260, pos: "50% 45%", caption: "Pergamonaltar, Berlin: Relief aus Marmor", cls: "later" });
          s.add(cols(s, svg, stack(s, 10, e1, slW, e2, life), 560));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); await s.show(light, "fade"); s.say("Das Licht kommt von der Seite. So wirft das Relief Schatten."); });
          s.step(async () => { s.sfx.pop(); s.show(slW, "pop"); await s.tween({ from: 100, to: 40, dur: 800, update: v => sl.set(Math.round(v)) }); await s.tween({ from: 40, to: 100, dur: 800, update: v => sl.set(Math.round(v)) }); });
          s.step(async () => { s.sfx.pop(); await s.show(e2, "up"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(life, "zoom"); s.say("Ein berühmtes Relief steht in Berlin: der Pergamonaltar. Die Figuren wachsen aus der Wand heraus."); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Pappmodell: falten, schneiden, kleben",
        say: "Aus einem flachen Netz aus Pappe wird ein Körper. Du schneidest, faltest und klebst.",
        build(s) {
          const svg = s.svg(500, 480);
          const faces = [["Deckel", 205, 10, "#e3f2e4"], ["Hinten", 205, 100, "#f4e3b0"], ["Links", 115, 190, "#d8ecf8"], ["Boden", 205, 190, "#cfe8cf"], ["Rechts", 295, 190, "#d8ecf8"], ["Vorn", 205, 280, "#f4e3b0"]];
          const tabs = ["205,106 185,120 185,170 205,184", "295,106 315,120 315,170 295,184", "205,286 185,300 185,350 205,364", "295,286 315,300 315,350 295,364"]
            .map(p => s.el("polygon", { points: p, fill: "#ffd94a", stroke: "#b08a2a", "stroke-width": 2, class: "later" }));
          const faceEls = faces.map(([n, x, y, c]) => s.el("g", { class: "later" }, s.el("rect", { x, y, width: 90, height: 90, fill: c }), s.el("text", { x: x + 45, y: y + 52, "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: INK, text: n })));
          const cut = s.el("path", { d: "M205,10 H295 V106 L315,120 V170 L295,184 V190 H385 V280 H295 V286 L315,300 V350 L295,364 V370 H205 V364 L185,350 V300 L205,286 V280 H115 V190 H205 V184 L185,170 V120 L205,106 V10 Z", fill: "none", stroke: "#dc3b2a", "stroke-width": 5, "stroke-linejoin": "round", class: "later" });
          const fold = s.el("path", { d: "M205,100 H295 M205,190 H295 M205,280 H295 M205,190 V280 M295,190 V280 M205,106 V184 M295,106 V184 M205,286 V364 M295,286 V364", fill: "none", stroke: "#1d5bd0", "stroke-width": 4, "stroke-dasharray": "10 8", class: "later" });
          const leg = s.el("g", { class: "later" },
            s.el("line", { x1: 40, y1: 404, x2: 92, y2: 404, stroke: "#dc3b2a", "stroke-width": 5 }), lbl(s, 104, 411, "Schneiden", { "text-anchor": "start" }),
            s.el("line", { x1: 40, y1: 436, x2: 92, y2: 436, stroke: "#1d5bd0", "stroke-width": 4, "stroke-dasharray": "10 8" }), lbl(s, 104, 443, "Falten", { "text-anchor": "start" }),
            s.el("rect", { x: 40, y: 458, width: 52, height: 16, fill: "#ffd94a", stroke: "#b08a2a", "stroke-width": 2 }), lbl(s, 104, 472, "Laschen: hier kleben", { "text-anchor": "start" }));
          svg.append(...tabs, ...faceEls, fold, cut, leg);
          // 3D cube
          const A = 90, FC = "3px solid #2f7d32";
          const face = (bg, extra) => s.h("div", { style: Object.assign({ position: "absolute", width: A + "px", height: A + "px", background: bg, border: FC, boxSizing: "border-box", transformStyle: "preserve-3d" }, extra) });
          const B = face("#cfe8cf", { left: -A / 2 + "px", top: -A / 2 + "px" });
          const K = face("#f4e3b0", { left: "0px", top: -A + "px", transformOrigin: "50% 100%" });
          const T = face("#e3f2e4", { left: "0px", top: -A + "px", transformOrigin: "50% 100%" });
          const F = face("#f4e3b0", { left: "0px", top: A + "px", transformOrigin: "50% 0%" });
          const Lw = face("#d8ecf8", { left: -A + "px", top: "0px", transformOrigin: "100% 50%" });
          const Rw = face("#d8ecf8", { left: A + "px", top: "0px", transformOrigin: "0% 50%" });
          K.append(T); B.append(K, F, Lw, Rw);
          const cube = s.h("div", { style: { position: "absolute", left: "50%", top: "58%", width: "0px", height: "0px", transformStyle: "preserve-3d", transform: "rotateX(58deg) rotateZ(-32deg) scale(1.35)" } }, B);
          const stage = s.h("div", { class: "later", style: { position: "relative", height: "270px", perspective: "900px" } }, cube);
          const setFold = p => {
            const w = 90 * clamp(p / 0.6, 0, 1), t = 90 * clamp((p - 0.6) / 0.4, 0, 1);
            K.style.transform = `rotateX(${-w}deg)`; T.style.transform = `rotateX(${-t}deg)`; F.style.transform = `rotateX(${w}deg)`; Lw.style.transform = `rotateY(${w}deg)`; Rw.style.transform = `rotateY(${-w}deg)`;
          };
          setFold(0);
          const sl = s.slider({ label: "Falten", min: 0, max: 100, step: 1, value: 0, fmt: v => v + " %", onInput: v => setFold(v / 100) });
          const slW = s.h("div", { class: "later" }, sl);
          const life = box(s, "life", "Im Alltag", "Pizzakarton, Müslipackung und Schuhkarton sind gefaltete Pappe mit Laschen.");
          const tip = P(s, "Ziehe den Regler und sieh zu, wie sich das Netz faltet.", "small pencil", true);
          s.add(cols(s, svg, stack(s, 10, stage, slW, tip, life), 500));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { for (const f of faceEls) { s.sfx.pop(); await s.show(f, "pop"); } s.say("Das ist das Netz eines Würfels: sechs Flächen."); });
          s.step(async () => { s.sound("scissors"); await s.show(cut, "draw"); s.say("Die rote Linie schneidest du aus."); });
          s.step(async () => { s.sfx.snap(); await s.show(fold, "fade"); s.show(leg, "up"); s.say("An den gestrichelten blauen Linien faltest du."); });
          s.step(async () => { s.sfx.pop(); await s.show(tabs, "pop"); s.say("Die gelben Laschen bekommen Kleber."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(stage, "up"); s.show([slW, tip], "pop"); await s.tween({ from: 0, to: 100, dur: 2600, ease: "inOut", update: v => sl.set(Math.round(v)) }); s.sfx.success(); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Im Alltag: Anordnen und Bauen",
        say: "Komposition, Collage und Bauen steckt in vielen Dingen: Plakaten, Moodboards, Lego und Kürbissen.",
        build(s) {
          const GR = "#8b95a5";
          const mk = (title, text, drawFn) => {
            const svg = s.svg(170, 130); const api = drawFn(svg);
            const c = s.h("div", { class: "life later", style: { display: "flex", gap: "16px", alignItems: "center", cursor: "pointer" }, onclick: async () => { api.reset(); s.sfx.click(); await api.play(); } },
              svg, s.h("div", null, s.h("span", { class: "exlabel" }, "Im Alltag"), s.h("p", { class: "h2", style: { fontSize: "27px" } }, title), s.h("p", { class: "small", style: { marginTop: "6px" }, html: text })));
            c.api = api; return c;
          };
          const seq = (els, kind, snd) => ({ reset() { els.forEach(e => e.classList.add("later")); }, async play() { for (const e of els) { snd(); await s.show(e, kind); await s.wait(120); } } });
          const c1 = mk("Plakat und Cover", "Titel, Bild und Text sind <b>angeordnet</b>, damit dein Auge gut durchläuft.", svg => {
            svg.append(s.el("rect", { x: 40, y: 4, width: 90, height: 122, rx: 4, fill: "#fff", stroke: GR, "stroke-width": 3 }));
            const els = [s.el("rect", { x: 50, y: 14, width: 60, height: 12, rx: 3, fill: INK }), s.el("circle", { cx: 95, cy: 68, r: 24, fill: "#ee7a1a" }), s.el("rect", { x: 50, y: 106, width: 50, height: 8, rx: 3, fill: GR })];
            els.forEach(e => e.classList.add("later")); svg.append(...els); return seq(els, "pop", () => s.sfx.pop());
          });
          const c2 = mk("Moodboard", "Bilder, Farben und Stoffreste werden zu einer <b>Collage</b> für Ideen geklebt.", svg => {
            svg.append(s.el("rect", { x: 10, y: 6, width: 150, height: 118, rx: 6, fill: "#f6efe0", stroke: "#c8b78f", "stroke-width": 3 }));
            const tiles = [[20, 16, 60, 44, "#bfe3f5", -4], [92, 14, 56, 62, "#f4d35e", 5], [26, 70, 50, 44, "#dc3b2a", 3], [90, 84, 54, 30, "#7fbf78", -6]].map(([x, y, w, h, c, r]) => s.el("g", { class: "later" }, s.el("rect", { x, y, width: w, height: h, fill: c, stroke: "#fff", "stroke-width": 3, transform: `rotate(${r} ${x + w / 2} ${y + h / 2})` })));
            svg.append(...tiles); return seq(tiles, "pop", () => s.sfx.snap());
          });
          const c3 = mk("Lego: additiv", "Stein für Stein kommt etwas <b>dazu</b>. So baust du additiv.", svg => {
            const brick = (x, y, c) => s.el("g", { class: "later" }, s.el("g", { transform: `translate(${x},${y})` }, s.el("rect", { width: 70, height: 32, rx: 4, fill: c, stroke: "#0003", "stroke-width": 2 }), s.el("circle", { cx: 18, cy: -4, r: 7, fill: c }), s.el("circle", { cx: 52, cy: -4, r: 7, fill: c })));
            const bricks = [brick(20, 90, "#dc3b2a"), brick(90, 90, "#1d5bd0"), brick(55, 58, "#ffd94a"), brick(20, 26, "#138a5a")];
            svg.append(...bricks);
            return { reset() { bricks.forEach(b => b.classList.add("later")); }, async play() { for (const b of bricks) { s.sfx.snap(); await s.show(b, "down"); await s.wait(100); } } };
          });
          const c4 = mk("Kürbis schnitzen", "Du nimmst Stücke <b>weg</b>, bis das Gesicht erscheint: subtraktiv.", svg => {
            svg.append(s.el("ellipse", { cx: 85, cy: 74, rx: 62, ry: 50, fill: "#ee7a1a", stroke: "#b25a0c", "stroke-width": 4 }), s.el("rect", { x: 80, y: 12, width: 12, height: 18, rx: 4, fill: "#4a7d2a" }));
            const holes = [s.el("polygon", { points: "55,60 72,60 63,46", fill: "#ffe066", class: "later" }), s.el("polygon", { points: "98,60 115,60 106,46", fill: "#ffe066", class: "later" }), s.el("path", { d: "M58,86 L70,98 L85,90 L100,98 L112,86 L112,92 L100,106 L85,98 L70,106 L58,92 Z", fill: "#ffe066", class: "later" })];
            svg.append(...holes); return seq(holes, "pop", () => s.sfx.snap());
          });
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", height: "100%", alignContent: "center" } }, c1, c2, c3, c4));
          [c1, c2, c3, c4].forEach(c => s.step(async () => { s.sfx.whoosh(); await s.show(c, "up"); await c.api.play(); }));
          s.step(async () => { s.sfx.success(); s.confetti(550, 320, 60); });
        },
      },

    ],
  });
})();
