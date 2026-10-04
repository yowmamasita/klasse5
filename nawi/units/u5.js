/* Kapitel 5 – Licht und Sehen (NaWi 5/6, Berlin RLP 3.3 „Sonne – Wetter – Jahreszeiten“, Teil Licht) */
(() => {
  const UC = "#b45309";
  const FONT = '"Atkinson Hyperlegible", system-ui, sans-serif';
  const RAD = Math.PI / 180;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------- small layout helpers ---------- */
  const cols = (s, left, right, lw = 560) =>
    s.h("div", { class: "cols", style: { gridTemplateColumns: lw + "px 1fr", alignItems: "center", height: "100%" } }, left, right);
  const P = (s, html, cls = "t", hidden = false) => s.h("p", { class: cls + (hidden ? " later" : ""), html });
  const box = (s, cls, label, html, hidden = true) =>
    s.h("div", { class: cls + (hidden ? " later" : "") }, label ? s.h("span", { class: "exlabel" }, label) : null, s.h("p", { class: "small", html }));
  const merk = (s, html, hidden = true) => s.h("div", { class: "merk" + (hidden ? " later" : ""), html });
  const stack = (s, gap, ...kids) => s.h("div", { class: "stack", style: { gap: gap + "px" } }, ...kids);

  /* ---------- canvas helpers ---------- */
  function glow(g, x, y, r, a = 0.7) {
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, `rgba(255,214,80,${a})`); gr.addColorStop(1, "rgba(255,214,80,0)");
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
  }
  function bulb(g, x, y, on = true) {
    if (on) glow(g, x, y, 80, 0.75);
    g.fillStyle = on ? "#ffe066" : "#d9d9d9"; g.strokeStyle = "#8a6d1d"; g.lineWidth = 3;
    g.beginPath(); g.arc(x, y, 20, 0, 7); g.fill(); g.stroke();
    g.fillStyle = "#7d7d7d"; g.fillRect(x - 9, y + 18, 18, 14);
  }
  function arrow(g, x1, y1, x2, y2, col, w = 3, at = 0.55, dash = null, off = 0) {
    g.save(); g.strokeStyle = col; g.lineWidth = w; g.lineCap = "round";
    if (dash) { g.setLineDash(dash); g.lineDashOffset = off; }
    g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); g.restore();
    if (at == null) return;
    const a = Math.atan2(y2 - y1, x2 - x1), L = 10 + w * 2;
    const tx = x1 + (x2 - x1) * at + Math.cos(a) * L / 2, ty = y1 + (y2 - y1) * at + Math.sin(a) * L / 2;
    g.fillStyle = col; g.beginPath(); g.moveTo(tx, ty);
    g.lineTo(tx - L * Math.cos(a - 0.45), ty - L * Math.sin(a - 0.45));
    g.lineTo(tx - L * Math.cos(a + 0.45), ty - L * Math.sin(a + 0.45)); g.closePath(); g.fill();
  }
  function label(g, txt, x, y, col = "#5d6678", size = 20, align = "center", weight = 600) {
    g.font = `${weight} ${size}px ${FONT}`; g.fillStyle = col; g.textAlign = align; g.textBaseline = "middle"; g.fillText(txt, x, y);
  }
  function ring(g, x, y, r) { g.save(); g.setLineDash([6, 6]); g.strokeStyle = "rgba(180,83,9,.6)"; g.lineWidth = 2; g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke(); g.restore(); }
  function eye(g, x, y, open = 1) {
    g.save(); g.translate(x, y);
    g.fillStyle = "#fff"; g.strokeStyle = "#1b2740"; g.lineWidth = 3;
    g.beginPath(); g.moveTo(-38, 0); g.quadraticCurveTo(0, -30 * open, 38, 0); g.quadraticCurveTo(0, 30 * open, -38, 0); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = "#2f6db5"; g.beginPath(); g.arc(-10, 0, 13 * open, 0, 7); g.fill();
    g.fillStyle = "#111"; g.beginPath(); g.arc(-10, 0, 6 * open, 0, 7); g.fill();
    g.restore();
  }
  function apple(g, x, y, lit = 1) {
    const c = lit ? "#d6332a" : "#3b2a2a";
    g.fillStyle = c; g.beginPath(); g.arc(x - 9, y, 26, 0, 7); g.arc(x + 9, y, 26, 0, 7); g.fill();
    g.strokeStyle = "#5b3a1a"; g.lineWidth = 4; g.beginPath(); g.moveTo(x, y - 22); g.lineTo(x + 4, y - 38); g.stroke();
    g.fillStyle = lit ? "#3a9a3a" : "#22321f"; g.beginPath(); g.ellipse(x + 15, y - 34, 11, 5, -0.5, 0, 7); g.fill();
    if (lit) { g.fillStyle = "rgba(255,255,255,.55)"; g.beginPath(); g.ellipse(x - 18, y - 10, 6, 10, 0.4, 0, 7); g.fill(); }
  }
  function nearest(p, pts, max = 70) {
    let best = -1, bd = max;
    pts.forEach((q, i) => { const d = Math.hypot(p.x - q.x, p.y - q.y); if (d < bd) { bd = d; best = i; } });
    return best;
  }
  /* svg arrow head polygon */
  const head = (s, x, y, ang, col, L = 16) => s.el("polygon", {
    points: [[x, y], [x - L * Math.cos(ang - 0.45), y - L * Math.sin(ang - 0.45)], [x - L * Math.cos(ang + 0.45), y - L * Math.sin(ang + 0.45)]].map(p => p.join(",")).join(" "), fill: col });

  Deck.unit({
    id: "u5", num: 5, title: "Licht und Sehen", color: UC, soft: "#fbecd9",
    subtitle: "Wie Licht reist – und wie wir sehen",
    blurb: "Lichtquellen, Schatten, Spiegel, Linsen, Farben und das Auge",
    goals: [
      "Lichtquellen und beleuchtete Körper unterscheiden",
      "Verstehen, wie wir sehen und wie Schatten entstehen",
      "Spiegel, Brechung und Linsen ausprobieren",
      "Wissen, wie ein Regenbogen entsteht",
    ],
    icon(svg, el) {
      svg.append(
        el("circle", { cx: 26, cy: 30, r: 13, fill: "#ffc928", stroke: UC, "stroke-width": 3 }),
        ...[0, 45, 90, 135, 180, 225, 270, 315].map(a => el("line", { x1: 26 + 17 * Math.cos(a * RAD), y1: 30 + 17 * Math.sin(a * RAD), x2: 26 + 23 * Math.cos(a * RAD), y2: 30 + 23 * Math.sin(a * RAD), stroke: UC, "stroke-width": 3, "stroke-linecap": "round" })),
        el("line", { x1: 40, y1: 40, x2: 62, y2: 58, stroke: UC, "stroke-width": 3, "stroke-dasharray": "4 4" }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Selbstleuchtend oder beleuchtet?",
        say: "Manche Dinge erzeugen selbst Licht. Andere werden nur angestrahlt.",
        build(s) {
          const svg = s.svg(540, 540);
          svg.append(s.el("rect", { x: 6, y: 20, width: 528, height: 235, rx: 22, fill: "#fff3c4" }),
            s.el("rect", { x: 6, y: 290, width: 528, height: 235, rx: 22, fill: "#eceff3" }));
          const X = [95, 270, 445], Y1 = 120, Y2 = 390;
          // sun
          const sunG = s.el("g", {});
          const rays = s.el("g", {});
          for (let i = 0; i < 12; i++) { const a = i * 30 * RAD; rays.append(s.el("line", { x1: X[0] + 50 * Math.cos(a), y1: Y1 + 50 * Math.sin(a), x2: X[0] + 66 * Math.cos(a), y2: Y1 + 66 * Math.sin(a), stroke: "#e09a00", "stroke-width": 5, "stroke-linecap": "round" })); }
          sunG.append(rays, s.el("circle", { cx: X[0], cy: Y1, r: 40, fill: "#ffc928", stroke: "#e09a00", "stroke-width": 4 }));
          // bulb
          const bulbG = s.el("g", {},
            s.el("circle", { cx: X[1], cy: Y1 - 8, r: 64, fill: "#ffe680", opacity: 0.55 }),
            s.el("circle", { cx: X[1], cy: Y1 - 10, r: 34, fill: "#fff3a6", stroke: "#b58b00", "stroke-width": 4 }),
            s.el("path", { d: `M${X[1] - 12},${Y1 + 4} L${X[1] - 6},${Y1 - 14} L${X[1]},${Y1 - 4} L${X[1] + 6},${Y1 - 14} L${X[1] + 12},${Y1 + 4}`, fill: "none", stroke: "#e07b00", "stroke-width": 3 }),
            s.el("rect", { x: X[1] - 17, y: Y1 + 22, width: 34, height: 26, rx: 4, fill: "#8d8d8d" }));
          // fire
          const flame = s.el("g", {},
            s.el("path", { d: `M${X[2]},${Y1 + 30} C${X[2] - 46},${Y1 + 10} ${X[2] - 22},${Y1 - 34} ${X[2]},${Y1 - 66} C${X[2] + 6},${Y1 - 30} ${X[2] + 46},${Y1 - 10} ${X[2]},${Y1 + 30} Z`, fill: "#f07a1a" }),
            s.el("path", { d: `M${X[2]},${Y1 + 28} C${X[2] - 24},${Y1 + 14} ${X[2] - 10},${Y1 - 14} ${X[2]},${Y1 - 32} C${X[2] + 4},${Y1 - 12} ${X[2] + 24},${Y1 + 6} ${X[2]},${Y1 + 28} Z`, fill: "#ffd23a" }));
          const fireG = s.el("g", {},
            s.el("rect", { x: X[2] - 50, y: Y1 + 28, width: 100, height: 16, rx: 8, fill: "#7a4a22", transform: `rotate(12 ${X[2]} ${Y1 + 36})` }),
            s.el("rect", { x: X[2] - 50, y: Y1 + 28, width: 100, height: 16, rx: 8, fill: "#8d5a2b", transform: `rotate(-12 ${X[2]} ${Y1 + 36})` }), flame);
          // moon, book, bike
          const moonG = s.el("g", {}, s.el("circle", { cx: X[0], cy: Y2, r: 42, fill: "#d9d9d9", stroke: "#9a9a9a", "stroke-width": 3 }),
            s.el("circle", { cx: X[0] - 12, cy: Y2 - 10, r: 8, fill: "#bdbdbd" }), s.el("circle", { cx: X[0] + 14, cy: Y2 + 12, r: 6, fill: "#bdbdbd" }), s.el("circle", { cx: X[0] + 10, cy: Y2 - 18, r: 4, fill: "#bdbdbd" }));
          const bookG = s.el("g", {}, s.el("rect", { x: X[1] - 48, y: Y2 - 38, width: 96, height: 76, rx: 6, fill: "#fbecd9", stroke: UC, "stroke-width": 4 }),
            s.el("line", { x1: X[1] - 34, y1: Y2 - 38, x2: X[1] - 34, y2: Y2 + 38, stroke: UC, "stroke-width": 4 }),
            s.el("text", { x: X[1] + 8, y: Y2 + 8, "text-anchor": "middle", "font-size": 22, "font-weight": 700, fill: UC, text: "NaWi" }));
          const bx = X[2], by = Y2 + 12;
          const bikeG = s.el("g", { fill: "none", stroke: "#1b2740", "stroke-width": 4, "stroke-linecap": "round" },
            s.el("circle", { cx: bx - 38, cy: by, r: 24 }), s.el("circle", { cx: bx + 38, cy: by, r: 24 }),
            s.el("path", { d: `M${bx - 38},${by} L${bx - 8},${by - 34} L${bx + 24},${by - 34} L${bx + 38},${by} M${bx - 8},${by - 34} L${bx},${by} L${bx + 24},${by - 34} M${bx - 14},${by - 42} L${bx - 2},${by - 42} M${bx + 24},${by - 34} L${bx + 20},${by - 48} L${bx + 32},${by - 50}` }),
            s.el("circle", { cx: bx + 38, cy: by - 2, r: 5, fill: "#e0322b", stroke: "none" }));
          const lab = (x, y, t) => s.el("text", { x, y, "text-anchor": "middle", class: "lbl", text: t });
          const row1 = [lab(X[0], 228, "Sonne"), lab(X[1], 228, "Glühlampe"), lab(X[2], 228, "Feuer")];
          const row2 = [moonG, bookG, bikeG, lab(X[0], 500, "Mond"), lab(X[1], 500, "Buch"), lab(X[2], 500, "Fahrrad")];
          row2.forEach(e => e.classList.add("later"));
          const arrows = X.map(x => s.el("g", { class: "later" },
            s.el("line", { x1: x + 60, y1: 196, x2: x + 52, y2: 330, stroke: "#e09a00", "stroke-width": 5, "stroke-dasharray": "10 8" }),
            head(s, x + 52, 340, Math.atan2(140, -8), "#e09a00", 18)));
          svg.append(sunG, bulbG, fireG, ...row1, ...row2, ...arrows);
          s.loop(t => {
            rays.setAttribute("transform", `rotate(${t * 12} ${X[0]} ${Y1})`);
            flame.setAttribute("transform", `translate(${X[2]} ${Y1 + 30}) scale(${1 + 0.06 * Math.sin(t * 9)}, ${1 + 0.1 * Math.sin(t * 7 + 1)}) translate(${-X[2]} ${-(Y1 + 30)})`);
          });
          const ex1 = box(s, "ex", "Lichtquellen", "Sonne, Glühlampe, Feuer – auch Kerze, Blitz und Handy-Bildschirm. Sie <b>erzeugen</b> selbst Licht.", false);
          const ex2 = box(s, "ex", "Beleuchtete Körper", "Mond, Buch, Fahrrad – und du! Sie leuchten nicht selbst. Sie werfen nur das Licht <b>zurück</b>, das auf sie fällt.");
          const m = merk(s, "Der Mond ist <b>keine</b> Lichtquelle. Er wird von der Sonne beleuchtet.");
          s.add(cols(s, svg, stack(s, 16, P(s, "Es gibt <b>selbstleuchtende</b> Körper und <b>beleuchtete</b> Körper."), ex1, ex2, m), 540));
          s.show(svg, "zoom"); s.sfx.whoosh();
          s.step(async () => { s.sfx.pop(); s.show(row2, "pop"); await s.show(ex2, "up"); s.say("Mond, Buch und Fahrrad leuchten nicht selbst. Sie werden beleuchtet."); });
          s.step(async () => { s.sfx.zap(); await s.show(arrows, "fade"); s.sfx.ding(); await s.show(m, "up"); s.say("Der Mond wird von der Sonne beleuchtet."); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Wie sehen wir etwas?",
        say: "Damit du etwas siehst, muss Licht von dem Gegenstand in dein Auge fallen.",
        build(s) {
          const W = 560, H = 500;
          const { canvas, g } = s.canvas(W, H);
          const L = { x: 90, y: 110 }, B = { x: 270, y: 330 }, E = { x: 480, y: 210 };
          let phase = 0, on = true, a1 = 0, a2 = 0;
          s.loop(t => {
            g.clearRect(0, 0, W, H);
            g.fillStyle = on ? "#fffdf2" : "#20242e"; g.fillRect(0, 0, W, H);
            if (on) bulb(g, L.x, L.y, true); else bulb(g, L.x, L.y, false);
            if (on && phase >= 1) {
              g.globalAlpha = a1;
              arrow(g, L.x, L.y, B.x, B.y, "#e8a400", 5, 0.5, [14, 10], -t * 60);
              g.globalAlpha = 1;
            }
            if (on && phase >= 2) {
              const de = Math.atan2(E.y - B.y, E.x - B.x);
              g.globalAlpha = a2 * 0.45;
              for (let k = 0; k < 7; k++) {
                const a = de + (k + 1) * (Math.PI * 2 / 8);
                arrow(g, B.x + 40 * Math.cos(a), B.y + 40 * Math.sin(a), B.x + 95 * Math.cos(a), B.y + 95 * Math.sin(a), "#e06a3a", 3, 0.9);
              }
              g.globalAlpha = a2;
              arrow(g, B.x + 40 * Math.cos(de), B.y + 40 * Math.sin(de), E.x - 40 * Math.cos(de), E.y - 40 * Math.sin(de), "#e0322b", 5, 0.55, [14, 10], -t * 60);
              g.globalAlpha = 1;
            }
            apple(g, B.x, B.y, on ? 1 : 0);
            eye(g, E.x, E.y, 1);
            ring(g, L.x, L.y, 34); ring(g, B.x, B.y, 46);
            const c = on ? "#5d6678" : "#c8d3de";
            label(g, "Lampe", L.x, L.y + 52, c); label(g, "Apfel", B.x, B.y + 62, c); label(g, "Auge", E.x, E.y + 42, c);
          });
          let grab = -1;
          s.drag(canvas, {
            space: canvas,
            onStart: p => { grab = nearest(p, [L, B]); if (grab >= 0) s.sfx.click(); },
            onMove: p => { const o = [L, B][grab]; if (!o) return; o.x = clamp(p.x, 40, 400); o.y = clamp(p.y, 40, 450); },
          });
          const btn = s.h("button", { class: "btn later", onclick: () => { on = !on; btn.textContent = on ? "Licht aus" : "Licht an"; on ? s.sfx.pop() : s.sfx.click(); s.say(on ? "Licht an: Du siehst den Apfel." : "Licht aus: Du siehst gar nichts."); } }, "Licht aus");
          const m = merk(s, "Du siehst etwas nur, wenn Licht <b>von ihm</b> in dein Auge fällt. Augen senden kein Licht aus!");
          const tip = P(s, "Ziehe Lampe und Apfel herum!", "small pencil", true);
          const life = box(s, "life", "Im Alltag", "Im dunklen Keller siehst du nichts. Knipst du das Licht an, fällt Licht auf die Dinge – und von dort in dein Auge.");
          s.add(cols(s, canvas, stack(s, 16,
            P(s, "Du brauchst drei Dinge: eine <b>Lichtquelle</b>, einen <b>Gegenstand</b> und dein <b>Auge</b>."),
            m, s.h("div", { class: "row" }, btn, tip), life)));
          s.show(canvas, "zoom"); s.sfx.pop();
          s.step(async () => { phase = 1; s.sfx.zap(); s.say("Das Licht fliegt von der Lampe zum Apfel."); await s.tween({ from: 0, to: 1, dur: 700, update: v => (a1 = v) }); });
          s.step(async () => { phase = 2; s.sfx.whoosh(); s.say("Der Apfel wirft das Licht in alle Richtungen zurück. Ein Teil fällt in dein Auge."); await s.tween({ from: 0, to: 1, dur: 700, update: v => (a2 = v) }); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.show([btn, tip], "pop"); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Licht läuft geradeaus",
        say: "Licht breitet sich geradlinig aus. Es läuft immer geradeaus, bis es auf etwas trifft.",
        build(s) {
          const W = 560, H = 440, cy = 220;
          const { canvas, g } = s.canvas(W, H);
          let w = 110, model = 0;
          const dust = Array.from({ length: 90 }, () => ({ x: 215 + Math.random() * 310, y: 30 + Math.random() * 380, v: 4 + Math.random() * 8, p: Math.random() * 6 }));
          s.loop((t, dt) => {
            g.clearRect(0, 0, W, H);
            g.fillStyle = "#2a3040"; g.fillRect(0, 0, W, H);
            // flashlight
            g.fillStyle = "#596273"; g.fillRect(16, cy - 26, 80, 52); g.fillStyle = "#7c8799"; g.beginPath(); g.moveTo(96, cy - 26); g.lineTo(120, cy - 40); g.lineTo(120, cy + 40); g.lineTo(96, cy + 26); g.fill();
            g.fillStyle = "#e33"; g.fillRect(40, cy - 32, 18, 8);
            // cone to the slit
            g.fillStyle = "rgba(255,230,140,.35)"; g.beginPath(); g.moveTo(120, cy - 38); g.lineTo(205, cy - 90); g.lineTo(205, cy + 90); g.lineTo(120, cy + 38); g.fill();
            // bundle behind slit
            const hw = w / 2;
            const gr = g.createLinearGradient(210, 0, 540, 0); gr.addColorStop(0, "rgba(255,236,150,.75)"); gr.addColorStop(1, "rgba(255,236,150,.45)");
            g.fillStyle = gr; g.fillRect(210, cy - hw, 320, w);
            // dust
            for (const d of dust) {
              d.x += d.v * (dt || 0); if (d.x > 528) d.x = 215;
              const inB = Math.abs(d.y - cy) < hw;
              g.fillStyle = inB ? `rgba(255,255,255,${0.6 + 0.4 * Math.sin(t * 3 + d.p)})` : "rgba(255,255,255,.08)";
              g.beginPath(); g.arc(d.x, d.y, inB ? 2.2 : 1.5, 0, 7); g.fill();
            }
            // blende
            g.fillStyle = "#11141b"; g.fillRect(200, 10, 14, cy - hw - 10); g.fillRect(200, cy + hw, 14, H - 10 - cy - hw);
            // screen + spot
            g.fillStyle = "#d8dbe2"; g.fillRect(530, 20, 16, H - 40);
            g.fillStyle = "#fff6b0"; g.fillRect(530, cy - hw, 16, w);
            // model rays
            if (model > 0) {
              g.globalAlpha = model;
              const n = w < 60 ? 1 : 3;
              for (let i = 0; i < n; i++) { const y = n === 1 ? cy : cy - hw * 0.6 + i * hw * 0.6; arrow(g, 214, y, 528, y, UC, 4, 0.6); }
              g.globalAlpha = 1;
            }
            label(g, "Blende", 207, H - 2 - 12, "#c8d3de", 19); label(g, "Schirm", 470, 34, "#c8d3de", 19);
          });
          const sl = s.slider({ label: "Öffnung der Blende", min: 6, max: 170, value: 110, fmt: v => (v < 30 ? "ganz eng" : v < 90 ? "mittel" : "weit"), onInput: v => (w = v) });
          const ex1 = box(s, "ex", "Lichtbündel", "Hinter der Blende siehst du ein <b>Lichtbündel</b>. Je enger die Öffnung, desto schmaler ist es.");
          const ex2 = box(s, "ex", "Lichtstrahl", "Ganz dünn wird es nie. Der <b>Lichtstrahl</b> ist ein Modell: eine gerade Linie mit Pfeil.");
          const life = box(s, "life", "Im Alltag", "Sonnenstrahlen durch Wolkenlücken · Taschenlampe im Nebel · Scheinwerfer im Konzert");
          s.add(cols(s, canvas, stack(s, 14, P(s, "Licht breitet sich <b>geradlinig</b> aus – immer geradeaus, bis es auf etwas trifft."), sl, ex1, ex2, life)));
          s.show(canvas, "zoom"); s.sfx.whoosh();
          s.step(async () => { s.sfx.swoosh(); await s.tween({ from: w, to: 40, dur: 900, update: v => { w = v; sl.input.value = v; } }); sl.set(40); s.sfx.pop(); await s.show(ex1, "up"); });
          s.step(async () => { s.sfx.zap(); s.tween({ from: 0, to: 1, dur: 600, update: v => (model = v) }); await s.show(ex2, "up"); s.say("Den Lichtstrahl zeichnen wir als Linie mit Pfeil."); });
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Licht ist superschnell",
        say: "Licht schafft fast dreihunderttausend Kilometer in einer Sekunde.",
        build(s) {
          const svg = s.svg(540, 400);
          svg.append(
            s.el("circle", { cx: 72, cy: 150, r: 72, fill: "#ffe680", opacity: 0.5 }),
            s.el("circle", { cx: 70, cy: 150, r: 60, fill: "#ffc928", stroke: "#e09a00", "stroke-width": 4 }),
            s.el("text", { x: 70, y: 278, "text-anchor": "middle", class: "lbl", text: "Sonne" }),
            s.el("line", { x1: 140, y1: 150, x2: 470, y2: 150, stroke: "#9aa3b2", "stroke-width": 3, "stroke-dasharray": "8 8" }),
            s.el("text", { x: 305, y: 120, "text-anchor": "middle", class: "lbl", text: "150 Millionen km" }),
            s.el("circle", { cx: 495, cy: 150, r: 22, fill: "#3d7fd6" }),
            s.el("path", { d: "M482,140 q8,-8 16,0 q4,10 -6,14 z M500,158 q6,-4 10,2 q-4,8 -10,4 z", fill: "#3a9a3a" }),
            s.el("text", { x: 495, y: 200, "text-anchor": "middle", class: "lbl", text: "Erde" }));
          const dot = s.el("circle", { cx: 140, cy: 150, r: 10, fill: "#fff6b0", stroke: "#e09a00", "stroke-width": 3 });
          const clock = s.el("text", { x: 300, y: 250, "text-anchor": "middle", class: "hlbl", style: { fontSize: "44px" }, text: "0 min 00 s" });
          const bar = s.el("rect", { x: 140, y: 300, width: 0, height: 22, rx: 11, fill: UC });
          svg.append(s.el("rect", { x: 140, y: 300, width: 330, height: 22, rx: 11, fill: "#fbecd9", stroke: "#c8d3de", "stroke-width": 2 }), bar, dot, clock,
            s.el("text", { x: 305, y: 360, "text-anchor": "middle", class: "lbl", text: "Zeit, die das Licht braucht" }));
          let run = 0;
          const fly = async () => {
            const id = ++run; s.sfx.whoosh();
            await s.tween({ from: 0, to: 500, dur: 4500, ease: "linear", update: v => {
              if (id !== run) return;
              dot.setAttribute("cx", 140 + 330 * v / 500); bar.setAttribute("width", 330 * v / 500);
              clock.textContent = `${Math.floor(v / 60)} min ${String(Math.floor(v % 60)).padStart(2, "0")} s`;
            } });
            if (id === run) s.sfx.ding();
          };
          const again = s.h("button", { class: "btn later", onclick: () => fly() }, "Nochmal fliegen");
          const big = s.h("p", { class: "huge mono" }, "0 km");
          const ex1 = box(s, "ex", "In einer Sekunde", "Licht saust etwa <b>7,5-mal</b> um die ganze Erde. Vom Mond zu uns braucht es nur gut <b>1 Sekunde</b>.");
          const ex2 = box(s, "ex", "Von der Sonne", "Sonnenlicht braucht <b>8 Minuten und 20 Sekunden</b> bis zu uns. Du siehst die Sonne immer so, wie sie vor gut 8 Minuten war!");
          const m = merk(s, "Nichts ist schneller als Licht: rund <b>300.000 km pro Sekunde</b>.");
          s.add(cols(s, stack(s, 10, svg, s.h("div", { class: "center" }, again)), stack(s, 14, P(s, "So weit kommt Licht in <b>einer Sekunde</b>:"), big, ex1, ex2, m), 540));
          s.show(svg, "zoom"); s.sfx.pop();
          s.tween({ from: 0, to: 300000, dur: 1600, ease: "out", update: v => (big.textContent = s.fmt(Math.round(v / 1000) * 1000) + " km") });
          s.step(async () => { s.sfx.coin(); await s.show(ex1, "up"); s.say("In einer Sekunde etwa siebeneinhalb Mal um die Erde."); });
          s.step(async () => { await s.show(ex2, "up"); s.show(again, "pop"); s.say("Von der Sonne braucht das Licht acht Minuten und zwanzig Sekunden."); await fly(); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Schatten an der Wand",
        say: "Hinter einem undurchsichtigen Gegenstand kommt kein Licht hin. Dort ist Schatten.",
        build(s) {
          const W = 560, H = 480, WX = 505;
          const { canvas, g } = s.canvas(W, H);
          const L = { x: 70, y: 240 }, F = { x: 230, y: 240 };
          const top = 180, bot = 300;
          const ratioEl = s.h("b", { class: "mono" }, "2,0");
          const wallY = (y) => L.y + (y - L.y) * (WX - L.x) / (F.x - L.x);
          s.loop(() => {
            g.clearRect(0, 0, W, H);
            g.fillStyle = "#2a3040"; g.fillRect(0, 0, W, H);
            g.fillStyle = "rgba(255,230,140,.28)"; g.beginPath(); g.moveTo(L.x, L.y); g.lineTo(WX, 0); g.lineTo(WX, H); g.closePath(); g.fill();
            glow(g, L.x, L.y, 140, 0.45);
            // wall
            g.fillStyle = "#f3e7c4"; g.fillRect(WX, 0, W - WX, H);
            const yt = wallY(top), yb = wallY(bot);
            // shadow space
            g.fillStyle = "rgba(10,12,20,.75)"; g.beginPath(); g.moveTo(F.x, top); g.lineTo(WX, yt); g.lineTo(WX, yb); g.lineTo(F.x, bot); g.closePath(); g.fill();
            g.fillStyle = "#1b1e27"; g.fillRect(WX, clamp(yt, 0, H), W - WX, clamp(yb, 0, H) - clamp(yt, 0, H));
            // edge rays
            arrow(g, L.x, L.y, WX, yt, "#ffd23a", 2, null, [8, 6]); arrow(g, L.x, L.y, WX, yb, "#ffd23a", 2, null, [8, 6]);
            // figure (a little person)
            g.fillStyle = "#e0dcd2"; g.strokeStyle = "#e0dcd2"; g.lineWidth = 10; g.lineCap = "round";
            g.beginPath(); g.arc(F.x, top + 16, 16, 0, 7); g.fill();
            g.beginPath(); g.moveTo(F.x, top + 34); g.lineTo(F.x, bot - 44); g.moveTo(F.x, bot - 44); g.lineTo(F.x - 4, bot - 4); g.moveTo(F.x, bot - 44); g.lineTo(F.x + 4, bot - 4); g.stroke();
            g.lineWidth = 8; g.beginPath(); g.moveTo(F.x, top + 46); g.lineTo(F.x - 4, top + 84); g.moveTo(F.x, top + 46); g.lineTo(F.x + 4, top + 84); g.stroke();
            bulb(g, L.x, L.y, true);
            ring(g, L.x, L.y, 34); ring(g, F.x, (top + bot) / 2, 70);
            label(g, "Wand", WX + 27, 24, "#5d6678", 19);
            ratioEl.textContent = s.fmt((WX - L.x) / (F.x - L.x), 1);
          });
          let grab = -1;
          s.drag(canvas, {
            space: canvas,
            onStart: p => { grab = nearest(p, [L, { x: F.x, y: 240 }], 90); if (grab >= 0) s.sfx.click(); },
            onMove: p => {
              if (grab === 0) { L.x = clamp(p.x, 30, F.x - 60); L.y = clamp(p.y, 60, 420); }
              else if (grab === 1) { F.x = clamp(p.x, L.x + 60, 450); }
            },
          });
          const card = s.h("div", { class: "card soft" }, s.h("p", { class: "h2" }, "Schatten: ", ratioEl, "-mal so groß wie die Figur"));
          const ex = box(s, "ex", "Probier es aus", "Ziehe die Figur zur Lampe hin: Der Schatten wird <b>größer</b>. Ziehe sie zur Wand: Er wird <b>kleiner</b>.");
          const life = box(s, "life", "Im Alltag", "Handschattenspiel an der Wand · Schatten unter dem Baum im Park · Sonnenschirm im Freibad");
          s.add(cols(s, canvas, stack(s, 16,
            P(s, "Hinter einem <b>undurchsichtigen</b> Körper kommt kein Licht hin. Dort ist <b>Schatten</b>."), card, ex, life)));
          s.show(canvas, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.swoosh(); await s.tween({ from: F.x, to: 150, dur: 900, update: v => (F.x = v) }); s.sfx.boing(); await s.show(ex, "up"); s.say("Nah an der Lampe wird der Schatten riesig."); });
          s.step(async () => { s.sfx.swoosh(); await s.tween({ from: F.x, to: 380, dur: 900, update: v => (F.x = v) }); s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Kernschatten und Halbschatten",
        say: "Zwei Lampen machen zwei Schatten. Wo beide sich überdecken, ist es am dunkelsten.",
        build(s) {
          const W = 560, H = 480, WX = 500, C = { x: 300, y: 240 }, R = 34;
          const { canvas, g } = s.canvas(W, H);
          const L1 = { x: 70, y: 140 }, L2 = { x: 70, y: 340 };
          let l2 = 0;
          const cone = (L) => {
            const d = Math.hypot(C.x - L.x, C.y - L.y), a0 = Math.atan2(C.y - L.y, C.x - L.x), da = Math.asin(R / d);
            const t1 = a0 - da, t2 = a0 + da, tl = Math.sqrt(d * d - R * R);
            const p1 = { x: L.x + tl * Math.cos(t1), y: L.y + tl * Math.sin(t1) }, p2 = { x: L.x + tl * Math.cos(t2), y: L.y + tl * Math.sin(t2) };
            const w1 = L.y + Math.tan(t1) * (WX - L.x), w2 = L.y + Math.tan(t2) * (WX - L.x);
            return { p1, p2, w1, w2 };
          };
          s.loop(() => {
            g.clearRect(0, 0, W, H);
            g.fillStyle = "#2a3040"; g.fillRect(0, 0, W, H);
            const lamps = l2 > 0 ? [L1, L2] : [L1];
            lamps.forEach((L, i) => { g.globalAlpha = i ? l2 : 1; g.fillStyle = "rgba(255,230,140,.22)"; g.beginPath(); g.moveTo(L.x, L.y); g.lineTo(WX, 0); g.lineTo(WX, H); g.closePath(); g.fill(); glow(g, L.x, L.y, 110, 0.4); g.globalAlpha = 1; });
            // wall
            g.fillStyle = "#f3e7c4"; g.fillRect(WX, 0, W - WX, H);
            const cs = lamps.map(cone);
            cs.forEach((c, i) => {
              g.globalAlpha = i ? l2 : 1;
              g.fillStyle = "rgba(10,12,20,.55)"; g.beginPath(); g.moveTo(c.p1.x, c.p1.y); g.lineTo(WX, c.w1); g.lineTo(WX, c.w2); g.lineTo(c.p2.x, c.p2.y); g.closePath(); g.fill();
              g.fillStyle = "#8b8f9c"; g.fillRect(WX, c.w1, W - WX, c.w2 - c.w1);
              g.globalAlpha = 1;
            });
            if (cs.length === 2 && l2 > 0.5) {
              const a = Math.max(cs[0].w1, cs[1].w1), b = Math.min(cs[0].w2, cs[1].w2);
              if (b > a) { g.fillStyle = "#1b1e27"; g.fillRect(WX, a, W - WX, b - a); }
            } else { g.fillStyle = "#1b1e27"; g.fillRect(WX, cs[0].w1, W - WX, cs[0].w2 - cs[0].w1); }
            // ball
            const gr = g.createRadialGradient(C.x - 10, C.y - 12, 4, C.x, C.y, R); gr.addColorStop(0, "#7fb2ff"); gr.addColorStop(1, "#1d5bd0");
            g.fillStyle = gr; g.beginPath(); g.arc(C.x, C.y, R, 0, 7); g.fill();
            bulb(g, L1.x, L1.y, true); ring(g, L1.x, L1.y, 34);
            if (l2 > 0) { g.globalAlpha = l2; bulb(g, L2.x, L2.y, true); ring(g, L2.x, L2.y, 34); g.globalAlpha = 1; }
            label(g, "Wand", WX + 30, 24, "#5d6678", 19);
          });
          let grab = -1;
          s.drag(canvas, {
            space: canvas,
            onStart: p => { grab = nearest(p, l2 > 0 ? [L1, L2] : [L1]); if (grab >= 0) s.sfx.click(); },
            onMove: p => { const o = [L1, L2][grab]; if (!o) return; o.x = clamp(p.x, 30, 220); o.y = clamp(p.y, 40, 440); },
          });
          const sw = (c) => s.h("span", { style: { width: "44px", height: "34px", borderRadius: "8px", background: c, flex: "none", border: "2px solid #c8d3de" } });
          const leg1 = s.h("div", { class: "row later", style: { flexWrap: "nowrap" } }, sw("#1b1e27"), s.h("p", { class: "small", html: "<b>Kernschatten</b>: Hierhin kommt von <b>keiner</b> Lampe Licht." }));
          const leg2 = s.h("div", { class: "row later", style: { flexWrap: "nowrap" } }, sw("#8b8f9c"), s.h("p", { class: "small", html: "<b>Halbschatten</b>: Hier kommt Licht von nur <b>einer</b> Lampe an." }));
          const tip = P(s, "Ziehe die Lampen herum!", "small pencil", true);
          const life = box(s, "life", "Im Alltag", "Flutlicht auf dem Bolzplatz: Jeder Spieler hat mehrere Schatten · zwei Lampen am Schreibtisch · viele Deckenlampen im Klassenzimmer");
          s.add(cols(s, canvas, stack(s, 16,
            P(s, "Eine Lampe macht einen Schatten. Was passiert mit <b>zwei</b> Lampen?"), leg1, leg2, tip, life)));
          s.show(canvas, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.zap(); s.say("Die zweite Lampe geht an."); await s.tween({ from: 0, to: 1, dur: 700, update: v => (l2 = v) }); });
          s.step(async () => { s.sfx.pop(); await s.show(leg1, "left"); s.sfx.pop(); await s.show(leg2, "left"); s.show(tip, "fade"); s.say("Kernschatten: kein Licht. Halbschatten: Licht von nur einer Lampe."); });
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Schattenlänge und Sonnenstand",
        say: "Steht die Sonne tief, ist der Schatten lang. Steht sie hoch, ist er kurz.",
        build(s) {
          const W = 560, H = 420, GY = 350, PX = 280, KH = 110; // kid 1,50 m = 110 px
          const { canvas, g } = s.canvas(W, H);
          let th = 40, maxEl = 61;
          const elev = () => Math.max(2, maxEl * Math.sin(th * RAD));
          const readout = s.h("p", { class: "t mono" }, "");
          // sundial
          const dial = s.svg(190, 112);
          dial.append(s.el("path", { d: "M10,100 A85,85 0 0 1 180,100 Z", fill: "#fbecd9", stroke: UC, "stroke-width": 3 }));
          [6, 9, 12, 15, 18].forEach(hh => {
            const az = (270 + (hh - 6) / 12 * 180) * RAD, x = 95 + 72 * Math.sin(az), y = 100 - 72 * Math.cos(az);
            dial.append(s.el("text", { x: x + (hh === 6 ? 2 : hh === 18 ? -2 : 0), y: y + 7 - (hh === 6 || hh === 18 ? 6 : 0), "text-anchor": hh === 6 ? "start" : hh === 18 ? "end" : "middle", "font-size": 19, "font-weight": 700, fill: UC, text: String(hh) }));
          });
          const dShadow = s.el("line", { x1: 95, y1: 100, x2: 95, y2: 60, stroke: "#1b2740", "stroke-width": 6, "stroke-linecap": "round" });
          dial.append(dShadow, s.el("circle", { cx: 95, cy: 100, r: 6, fill: UC }));
          const draw = () => {
            const el = elev(), HY = 190, FX = PX, FY = 320, KP = 100, PPM = KP / 1.5;
            g.clearRect(0, 0, W, H);
            const sky = g.createLinearGradient(0, 0, 0, HY); sky.addColorStop(0, el > 25 ? "#8ec5ff" : "#ffb36b"); sky.addColorStop(1, "#e8f4ff");
            g.fillStyle = sky; g.fillRect(0, 0, W, HY);
            const gr = g.createLinearGradient(0, HY, 0, H); gr.addColorStop(0, "#a7d68a"); gr.addColorStop(1, "#6fb24e");
            g.fillStyle = gr; g.fillRect(0, HY, W, H - HY);
            const sx = PX - 240 * Math.cos(th * RAD), sy = HY - 22 - el * 2.4;
            // shadow on the ground (seen in perspective): points away from the sun
            const phi = (th - 90) * RAD, L = 1.5 / Math.tan(el * RAD);
            let dx = -Math.sin(phi) * L * PPM, dy = Math.cos(phi) * L * PPM * 0.4, k = 1;
            const tx = FX + dx, ty = FY + dy;
            if (tx < 8) k = Math.min(k, (FX - 8) / -dx); if (tx > W - 8) k = Math.min(k, (W - 8 - FX) / dx); if (ty > H - 8) k = Math.min(k, (H - 8 - FY) / dy);
            dx *= k; dy *= k;
            g.strokeStyle = "rgba(20,40,20,.6)"; g.lineCap = "round"; g.lineWidth = 16;
            g.beginPath(); g.moveTo(FX, FY); g.lineTo(FX + dx, FY + dy); g.stroke();
            if (k === 1) { g.fillStyle = "rgba(20,40,20,.6)"; g.beginPath(); g.ellipse(FX + dx, FY + dy, 13, 9, 0, 0, 7); g.fill(); }
            // ray from the sun to the head
            arrow(g, sx, sy, FX, FY - KP, "rgba(224,154,0,.9)", 3, null, [8, 6]);
            // kid
            g.strokeStyle = "#1b2740"; g.lineWidth = 7; g.lineCap = "round"; g.fillStyle = "#1b2740";
            g.beginPath(); g.arc(FX, FY - KP + 13, 13, 0, 7); g.fill();
            g.beginPath(); g.moveTo(FX, FY - KP + 26); g.lineTo(FX, FY - 38); g.lineTo(FX - 11, FY); g.moveTo(FX, FY - 38); g.lineTo(FX + 11, FY); g.moveTo(FX - 20, FY - 60); g.lineTo(FX, FY - 72); g.lineTo(FX + 20, FY - 60); g.stroke();
            // sun
            glow(g, sx, sy, 60, 0.6); g.fillStyle = "#ffc928"; g.strokeStyle = "#e09a00"; g.lineWidth = 3; g.beginPath(); g.arc(sx, sy, 22, 0, 7); g.fill(); g.stroke(); ring(g, sx, sy, 32);
            label(g, "Osten", 40, HY + 16, "#1b2740", 19); label(g, "Süden", PX, HY + 14, "#1b2740", 19); label(g, "Westen", W - 46, HY + 16, "#1b2740", 19);
            readout.innerHTML = `Sonne <b>${Math.round(el)}°</b> hoch · Schatten <b>${s.fmt(1.5 / Math.tan(el * RAD), 1)} m</b>`;
            // dial
            const az = (270 + th) * RAD, dl = clamp(16 + 12 / Math.tan(el * RAD), 20, 50);
            dShadow.setAttribute("x2", 95 + dl * Math.sin(az)); dShadow.setAttribute("y2", 100 - dl * Math.cos(az));
          };
          s.loop(draw);
          s.drag(canvas, { space: canvas, onStart: () => s.sfx.click(), onMove: p => { th = clamp((p.x - 20) / 520 * 180, 2, 178); } });
          const go = (to) => { s.sfx.whoosh(); return s.tween({ from: th, to, dur: 900, update: v => (th = v) }); };
          const b1 = s.h("button", { class: "btn", onclick: () => go(28) }, "Morgens"), b2 = s.h("button", { class: "btn", onclick: () => go(90) }, "Mittags"), b3 = s.h("button", { class: "btn", onclick: () => go(152) }, "Abends");
          const seasonBtn = s.h("button", { class: "btn solid later", onclick: () => { maxEl = maxEl > 30 ? 14 : 61; seasonBtn.textContent = maxEl > 30 ? "Jetzt: Sommer" : "Jetzt: Winter"; s.sfx.pop(); } }, "Jetzt: Sommer");
          dial.style.flex = "none";
          const dialRow = s.h("div", { class: "row later", style: { flexWrap: "nowrap", gap: "14px" } }, dial, P(s, "<b>Sonnenuhr</b>: Der Schatten wandert mit der Sonne und zeigt die Uhrzeit.", "small"));
          const life = box(s, "life", "Im Alltag: Berlin", "Mittags steht die Sonne im Sommer etwa <b>61°</b> hoch, im Winter nur etwa <b>14°</b>. Darum sind die Schatten auf dem Schulhof im Winter viel länger.");
          s.add(cols(s, canvas, stack(s, 12,
            P(s, "Steht die Sonne <b>tief</b>, ist der Schatten <b>lang</b>. Steht sie <b>hoch</b>, ist er <b>kurz</b>."),
            s.h("div", { class: "row", style: { gap: "10px" } }, b1, b2, b3), readout, s.h("div", { class: "row" }, seasonBtn), dialRow, life)));
          s.show(canvas, "zoom"); s.sfx.pop();
          s.step(async () => { await go(28); s.say("Morgens: Die Sonne steht tief im Osten, der Schatten ist lang."); await s.wait(500); await go(90); s.say("Mittags: Die Sonne steht am höchsten, der Schatten ist kurz."); });
          s.step(async () => { await go(152); s.sfx.pop(); await s.show(dialRow, "up"); s.say("Eine Sonnenuhr nutzt den wandernden Schatten."); });
          s.step(async () => { s.show(seasonBtn, "pop"); await go(90); maxEl = 14; seasonBtn.textContent = "Jetzt: Winter"; s.sfx.boing(); await s.show(life, "up"); s.say("Im Winter steht die Sonne in Berlin sehr tief. Die Schatten sind lang."); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Die Lochkamera",
        say: "Eine Schachtel mit einem winzigen Loch. Auf der Rückwand erscheint ein Bild – auf dem Kopf!",
        build(s) {
          const svg = s.svg(540, 440);
          const HX = 260, HY = 220, SX = 430;
          const candle = (id) => s.el("g", { id },
            s.el("rect", { x: -13, y: 220, width: 26, height: 70, rx: 4, fill: "#fff8e0", stroke: "#c7a96a", "stroke-width": 2 }),
            s.el("line", { x1: 0, y1: 220, x2: 0, y2: 212, stroke: "#333", "stroke-width": 2 }),
            s.el("path", { d: "M0,172 C-12,192 -9,208 0,214 C9,208 12,192 0,172 Z", fill: "#f39a1e" }),
            s.el("path", { d: "M0,186 C-5,198 -4,206 0,210 C4,206 5,198 0,186 Z", fill: "#ffe14a" }));
          const obj = candle("lkObj"), img = candle("lkImg");
          img.setAttribute("opacity", 0.85);
          const boxG = s.el("g", {},
            s.el("rect", { x: HX, y: 40, width: SX - HX + 20, height: 360, fill: "#3a3f4b" }),
            s.el("rect", { x: SX, y: 50, width: 8, height: 340, fill: "#f6f1e3" }));
          const wallTop = s.el("rect", { x: HX - 6, y: 40, width: 12, height: HY - 6 - 40, fill: "#1b1e27" });
          const wallBot = s.el("rect", { x: HX - 6, y: HY + 6, width: 12, height: 400 - HY - 6, fill: "#1b1e27" });
          const ray1 = s.el("line", { stroke: "#f39a1e", "stroke-width": 3, class: "later" }), ray2 = s.el("line", { stroke: "#ffd23a", "stroke-width": 3, class: "later" });
          const ray1b = s.el("line", { stroke: "#f39a1e", "stroke-width": 3, "stroke-dasharray": "6 5", class: "later" }), ray2b = s.el("line", { stroke: "#ffd23a", "stroke-width": 3, "stroke-dasharray": "6 5", class: "later" });
          img.classList.add("later");
          svg.append(s.el("line", { x1: 0, y1: 290, x2: 240, y2: 290, stroke: "#9aa3b2", "stroke-width": 3 }), boxG, img, obj, ray1, ray2, ray1b, ray2b, wallTop, wallBot,
            s.el("text", { x: HX, y: 428, "text-anchor": "middle", class: "lbl", text: "Loch" }),
            s.el("text", { x: SX + 4, y: 428, "text-anchor": "middle", class: "lbl", text: "Schirm" }));
          let cx = 120;
          const upd = () => {
            const k = (SX - HX) / (HX - cx);
            obj.setAttribute("transform", `translate(${cx} 0)`);
            img.setAttribute("transform", `matrix(${-0.5 * k} 0 0 ${-k} ${SX - 2} ${HY + HY * k})`);
            const yT = HY + (HY - 172) * k, yB = HY - (290 - HY) * k;
            [[ray1, cx, 172, HX, HY], [ray2, cx, 290, HX, HY], [ray1b, HX, HY, SX, yT], [ray2b, HX, HY, SX, yB]].forEach(([l, a, b, c, d]) => { l.setAttribute("x1", a); l.setAttribute("y1", b); l.setAttribute("x2", c); l.setAttribute("y2", d); });
          };
          upd();
          const sl = s.slider({ label: "Abstand Kerze – Loch", min: 80, max: 220, value: 140, fmt: v => s.fmt(v / 10, 0) + " cm", onInput: v => { cx = HX - v; upd(); } });
          const m = merk(s, "Das Bild steht auf dem <b>Kopf</b> und ist <b>seitenverkehrt</b>. Denn die Lichtstrahlen kreuzen sich im Loch.");
          const life = box(s, "life", "Im Alltag", "<b>Sonnentaler</b>: Lücken im Laub wirken wie Löcher – runde Sonnenbilder auf dem Weg · Lochkamera zum sicheren Beobachten einer Sonnenfinsternis · Dein <b>Auge</b> arbeitet ähnlich.");
          s.add(cols(s, svg, stack(s, 16, P(s, "Eine dunkle Schachtel mit einem kleinen <b>Loch</b> – und auf der Rückwand erscheint ein Bild!"), sl, m, life), 540));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.zap(); await s.show([ray1, ray2], "draw"); s.sfx.zap(); await s.show([ray1b, ray2b], "draw"); s.sfx.ding(); await s.show(img, "fade"); s.say("Das Licht von oben landet unten. Das Licht von unten landet oben."); });
          s.step(async () => { s.sfx.pop(); await s.show(m, "up"); s.sfx.swoosh(); await s.tween({ from: 140, to: 90, dur: 900, update: v => { cx = HX - v; sl.input.value = v; upd(); } }); sl.set(90); s.say("Kommt die Kerze näher, wird das Bild größer."); });
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Reflexion am Spiegel",
        say: "Ein Spiegel wirft das Licht zurück. Einfallswinkel und Reflexionswinkel sind immer gleich groß.",
        build(s) {
          const svg = s.svg(560, 500);
          const P0 = { x: 280, y: 420 }, R = 250;
          svg.append(s.el("rect", { x: 30, y: P0.y, width: 500, height: 10, fill: "#9fd3ff", stroke: "#4a87c5", "stroke-width": 2 }));
          for (let x = 40; x < 530; x += 18) svg.append(s.el("line", { x1: x, y1: P0.y + 12, x2: x - 12, y2: P0.y + 28, stroke: "#8a94a6", "stroke-width": 2 }));
          svg.append(s.el("line", { x1: P0.x, y1: P0.y, x2: P0.x, y2: 70, stroke: "#5d6678", "stroke-width": 3, "stroke-dasharray": "10 8" }),
            s.el("text", { x: P0.x + 12, y: 84, class: "lbl", text: "Lot" }),
            s.el("text", { x: 120, y: 480, "text-anchor": "middle", class: "lbl", text: "Spiegel" }));
          const glowIn = s.el("line", { stroke: "#ff6b5a", "stroke-width": 14, opacity: 0.25, "stroke-linecap": "round" }), rayIn = s.el("line", { stroke: "#e0322b", "stroke-width": 5 });
          const glowOut = s.el("line", { stroke: "#ff6b5a", "stroke-width": 14, opacity: 0.25, "stroke-linecap": "round" }), rayOut = s.el("line", { stroke: "#e0322b", "stroke-width": 5 });
          const hIn = s.el("polygon", { fill: "#e0322b" }), hOut = s.el("polygon", { fill: "#e0322b" });
          const arcA = s.el("path", { fill: "rgba(29,91,208,.15)", stroke: "#1d5bd0", "stroke-width": 3, class: "later" }), arcB = s.el("path", { fill: "rgba(19,138,90,.15)", stroke: "#138a5a", "stroke-width": 3, class: "later" });
          const tA = s.el("text", { "text-anchor": "middle", "font-size": 26, "font-weight": 700, fill: "#1d5bd0", text: "α", class: "later" }), tB = s.el("text", { "text-anchor": "middle", "font-size": 26, "font-weight": 700, fill: "#138a5a", text: "β", class: "later" });
          const laser = s.el("g", {}, s.el("circle", { r: 34, fill: "rgba(180,83,9,.12)", stroke: "rgba(180,83,9,.6)", "stroke-width": 2, "stroke-dasharray": "6 6" }), s.el("rect", { x: -30, y: -11, width: 60, height: 22, rx: 6, fill: "#c0392b" }), s.el("rect", { x: 22, y: -6, width: 10, height: 12, fill: "#333" }));
          svg.append(arcA, arcB, glowIn, glowOut, rayIn, rayOut, hIn, hOut, tA, tB, laser);
          const vA = s.h("span", { class: "mono" }, "40°"), vB = s.h("span", { class: "mono" }, "40°");
          let a = 40;
          const setL = (l, x1, y1, x2, y2) => { l.setAttribute("x1", x1); l.setAttribute("y1", y1); l.setAttribute("x2", x2); l.setAttribute("y2", y2); };
          const triP = (x, y, ang) => { const L = 22; return [[x, y], [x - L * Math.cos(ang - 0.4), y - L * Math.sin(ang - 0.4)], [x - L * Math.cos(ang + 0.4), y - L * Math.sin(ang + 0.4)]].map(p => p.join(",")).join(" "); };
          const upd = () => {
            const sa = Math.sin(a * RAD), ca = Math.cos(a * RAD);
            const S = { x: P0.x - R * sa, y: P0.y - R * ca }, E = { x: P0.x + R * sa, y: P0.y - R * ca };
            setL(rayIn, S.x, S.y, P0.x, P0.y); setL(glowIn, S.x, S.y, P0.x, P0.y); setL(rayOut, P0.x, P0.y, E.x, E.y); setL(glowOut, P0.x, P0.y, E.x, E.y);
            const ain = Math.atan2(P0.y - S.y, P0.x - S.x), aout = Math.atan2(E.y - P0.y, E.x - P0.x);
            hIn.setAttribute("points", triP((S.x + P0.x) / 2 + 10 * Math.cos(ain), (S.y + P0.y) / 2 + 10 * Math.sin(ain), ain));
            hOut.setAttribute("points", triP((E.x + P0.x) / 2 + 10 * Math.cos(aout), (E.y + P0.y) / 2 + 10 * Math.sin(aout), aout));
            laser.setAttribute("transform", `translate(${S.x} ${S.y}) rotate(${ain / RAD})`);
            const r = 70;
            arcA.setAttribute("d", `M${P0.x},${P0.y} L${P0.x - r * sa},${P0.y - r * ca} A${r},${r} 0 0 1 ${P0.x},${P0.y - r} Z`);
            arcB.setAttribute("d", `M${P0.x},${P0.y} L${P0.x},${P0.y - r} A${r},${r} 0 0 1 ${P0.x + r * sa},${P0.y - r * ca} Z`);
            const off = Math.max(20, 100 * Math.sin(a / 2 * RAD)), yy = P0.y - 100 * Math.cos(a / 2 * RAD) + 9;
            tA.setAttribute("x", P0.x - off); tA.setAttribute("y", yy); tB.setAttribute("x", P0.x + off); tB.setAttribute("y", yy);
            vA.textContent = vB.textContent = Math.round(a) + "°";
          };
          upd();
          s.drag(laser, { space: svg, onStart: () => s.sfx.click(), onMove: p => { const na = Math.atan2(P0.x - p.x, P0.y - p.y) / RAD; a = clamp(na, 12, 78); upd(); } });
          const cardA = s.h("div", { class: "card later", style: { flex: "1" } }, s.h("p", { class: "small", style: { color: "#1d5bd0" } }, "Einfallswinkel α"), s.h("p", { class: "big", style: { color: "#1d5bd0" } }, vA));
          const cardB = s.h("div", { class: "card later", style: { flex: "1" } }, s.h("p", { class: "small", style: { color: "#138a5a" } }, "Reflexionswinkel β"), s.h("p", { class: "big", style: { color: "#138a5a" } }, vB));
          const m = merk(s, "<b>Einfallswinkel = Reflexionswinkel</b>. Beide misst man zum <b>Lot</b>, der Linie senkrecht zum Spiegel.");
          const life = box(s, "life", "Im Alltag", "Ein Ball prallt von der Bande genauso ab · Spiegel im Bad · Rückspiegel im Auto");
          s.add(cols(s, svg, stack(s, 16, P(s, "Ein Spiegel wirft Licht zurück. Das heißt <b>Reflexion</b>. Ziehe den roten Laser!"),
            s.h("div", { class: "row", style: { flexWrap: "nowrap" } }, cardA, cardB), m, life)));
          s.show(svg, "zoom"); s.sfx.zap();
          s.step(async () => { s.sfx.pop(); s.show([arcA, arcB], "pop"); s.show([tA, tB], "pop"); await s.show([cardA, cardB], "up"); await s.tween({ from: a, to: 25, dur: 900, update: v => { a = v; upd(); } }); s.sfx.tick(); await s.tween({ from: 25, to: 60, dur: 1100, update: v => { a = v; upd(); } }); s.say("Egal wie du den Laser drehst: Beide Winkel sind gleich."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.boing(); await s.show(life, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Spiegelbild und Periskop",
        say: "Dein Spiegelbild steht genauso weit hinter dem Spiegel wie du davor. Mit zwei Spiegeln baust du ein Periskop.",
        build(s) {
          // Spiegelbild
          const a = s.svg(520, 330), MX = 260, FY = 300;
          a.append(s.el("line", { x1: 0, y1: FY, x2: 520, y2: FY, stroke: "#9aa3b2", "stroke-width": 3 }),
            s.el("rect", { x: MX - 5, y: 30, width: 10, height: FY - 30, fill: "#9fd3ff", stroke: "#4a87c5", "stroke-width": 2 }));
          const kid = (op) => {
            const k = s.el("g", { opacity: op });
            k.append(s.el("circle", { cx: 0, cy: 130, r: 22, fill: "#f2c9a0", stroke: "#1b2740", "stroke-width": 3 }),
              s.el("path", { d: "M0,152 L0,230 M0,230 L-16,298 M0,230 L16,298 M0,172 L-26,214 M0,172 L30,150 L36,96", stroke: "#1b2740", "stroke-width": 6, fill: "none", "stroke-linecap": "round" }),
              s.el("path", { d: "M36,96 L70,108 L36,122 Z", fill: "#e0322b" }));
            return k;
          };
          const me = kid(1), im = kid(0.45);
          const dist1 = s.el("text", { y: 324, "text-anchor": "middle", class: "lbl" }), dist2 = s.el("text", { y: 324, "text-anchor": "middle", class: "lbl" });
          const ar1 = s.el("line", { y1: 308, y2: 308, stroke: UC, "stroke-width": 3 }), ar2 = s.el("line", { y1: 308, y2: 308, stroke: UC, "stroke-width": 3 });
          a.append(im, me, ar1, ar2, dist1, dist2);
          let kx = 120;
          const upd = () => {
            me.setAttribute("transform", `translate(${kx} 0)`); im.setAttribute("transform", `translate(${2 * MX - kx} 0) scale(-1 1)`);
            ar1.setAttribute("x1", kx); ar1.setAttribute("x2", MX - 6); ar2.setAttribute("x1", MX + 6); ar2.setAttribute("x2", 2 * MX - kx);
            const t = s.fmt((MX - kx) / 100, 1) + " m";
            dist1.textContent = dist2.textContent = t; dist1.setAttribute("x", (kx + MX) / 2); dist2.setAttribute("x", (3 * MX - kx) / 2);
          };
          upd();
          s.drag(me, { space: a, onStart: () => s.sfx.click(), onMove: p => { kx = clamp(p.x, 40, 185); upd(); } });
          // Periskop
          const b = s.svg(520, 330);
          b.append(s.el("rect", { x: 230, y: 40, width: 60, height: 270, fill: "#e6e9ef" }),
            s.el("path", { d: "M230,100 L230,310 L290,310 M230,40 L290,40 L290,250", fill: "none", stroke: "#1b2740", "stroke-width": 6 }),
            s.el("line", { x1: 232, y1: 42, x2: 288, y2: 98, stroke: "#4a87c5", "stroke-width": 7 }),
            s.el("line", { x1: 232, y1: 252, x2: 288, y2: 308, stroke: "#4a87c5", "stroke-width": 7 }),
            s.el("rect", { x: 100, y: 140, width: 100, height: 170, fill: "#c9693c" }));
          for (let y = 160; y < 310; y += 25) b.append(s.el("line", { x1: 100, y1: y, x2: 200, y2: y, stroke: "#f2d1bd", "stroke-width": 2 }));
          b.append(s.el("text", { x: 150, y: 232, "text-anchor": "middle", class: "lbl", fill: "#fff", style: { fill: "#fff" }, text: "Mauer" }),
            s.el("text", { x: 300, y: 76, class: "lbl", text: "Spiegel" }), s.el("text", { x: 300, y: 330 - 4, class: "lbl", text: "Spiegel" }));
          // bird
          b.append(s.el("path", { d: "M30,78 q14,-16 28,0 q14,-16 28,0", fill: "none", stroke: "#1b2740", "stroke-width": 4 }));
          const eyeG = s.el("g", { transform: "translate(440 280)" },
            s.el("path", { d: "M-34,0 Q0,-26 34,0 Q0,26 -34,0 Z", fill: "#fff", stroke: "#1b2740", "stroke-width": 3 }),
            s.el("circle", { cx: -10, cy: 0, r: 11, fill: "#2f6db5" }), s.el("circle", { cx: -10, cy: 0, r: 5, fill: "#111" }));
          const path = s.el("path", { d: "M60,70 L260,70 L260,280 L398,280", fill: "none", stroke: "#e8a400", "stroke-width": 4, "stroke-dasharray": "10 7", class: "later" });
          const dot = s.el("circle", { r: 9, fill: "#ffd23a", stroke: "#e09a00", "stroke-width": 3, class: "later" });
          b.append(path, eyeG, dot);
          let moving = false;
          s.loop(t => {
            if (!moving) return;
            const L = 200 + 210 + 138, d = (t * 220) % L;
            let x, y;
            if (d < 200) { x = 60 + d; y = 70; } else if (d < 410) { x = 260; y = 70 + (d - 200); } else { x = 260 + (d - 410); y = 280; }
            dot.setAttribute("cx", x); dot.setAttribute("cy", y);
            path.setAttribute("stroke-dashoffset", -t * 40);
          });
          const ex1 = box(s, "ex", "Spiegelbild", "Dein Spiegelbild ist <b>gleich groß</b> und steht <b>genauso weit</b> hinter dem Spiegel wie du davor. Ziehe die Figur!", false);
          const ex2 = box(s, "ex", "Periskop", "Zwei Spiegel, schräg im <b>45°-Winkel</b>: So schaust du über eine Mauer. Auch U-Boote haben ein Periskop.");
          const life = box(s, "life", "Im Alltag", "Spiegel im Bad · Rück- und Außenspiegel am Auto · Verkehrsspiegel an unübersichtlichen Ausfahrten");
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%" } },
            s.h("div", { class: "cols", style: { gap: "20px", alignItems: "start" } }, stack(s, 10, a, ex1), stack(s, 10, b, ex2)), life));
          s.show(a, "zoom"); s.show(b, "zoom", 150); s.sfx.pop();
          s.step(async () => { s.sfx.swoosh(); await s.tween({ from: kx, to: 60, dur: 900, update: v => { kx = v; upd(); } }); s.sfx.tick(); s.say("Gehst du zurück, geht auch dein Spiegelbild zurück."); });
          s.step(async () => { s.sfx.zap(); await s.show(path, "draw"); moving = true; s.show(dot, "pop"); await s.show(ex2, "up"); s.say("Das Licht wird zweimal umgelenkt."); });
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Glatt oder rau?",
        say: "Glatte Flächen werfen das Licht geordnet zurück. Raue Flächen streuen es in alle Richtungen.",
        build(s) {
          const W = 560, H = 460, SY = 360, DX = 12;
          const { canvas, g } = s.canvas(W, H);
          const hs = Array.from({ length: Math.ceil(480 / DX) + 2 }, () => Math.random() * 2 - 1);
          let rough = 0;
          const surfY = x => { const i = Math.floor((x - 40) / DX), f = (x - 40) / DX - i; const h0 = hs[clamp(i, 0, hs.length - 1)], h1 = hs[clamp(i + 1, 0, hs.length - 1)]; return SY + (h0 + (h1 - h0) * f) * 14 * rough; };
          const slope = x => { const i = Math.floor((x - 40) / DX); return (hs[clamp(i + 1, 0, hs.length - 1)] - hs[clamp(i, 0, hs.length - 1)]) * 14 * rough / DX; };
          const hits = [130, 190, 250, 310, 370, 430];
          s.loop(t => {
            g.clearRect(0, 0, W, H);
            g.fillStyle = "#fffdf2"; g.fillRect(0, 0, W, H);
            // surface
            g.fillStyle = rough < 0.15 ? "#bfe3ff" : "#d9c2a0"; g.strokeStyle = "#5d6678"; g.lineWidth = 3;
            g.beginPath(); g.moveTo(40, H); for (let x = 40; x <= 520; x += 2) g.lineTo(x, surfY(x)); g.lineTo(520, H); g.closePath(); g.fill(); g.stroke();
            for (const hx of hits) {
              const hy = surfY(hx), d = { x: Math.SQRT1_2, y: Math.SQRT1_2 };
              const m = slope(hx), nl = Math.hypot(m, 1), n = { x: m / nl, y: -1 / nl };
              const dn = d.x * n.x + d.y * n.y; let r = { x: d.x - 2 * dn * n.x, y: d.y - 2 * dn * n.y };
              if (r.y > -0.08) { r.y = -0.08; const rl = Math.hypot(r.x, r.y); r = { x: r.x / rl, y: r.y / rl }; }
              arrow(g, hx - 300, hy - 300, hx, hy, "#e8a400", 3, 0.75, [12, 8], -t * 50);
              arrow(g, hx, hy, hx + r.x * 220, hy + r.y * 220, "#e0322b", 3, 0.5, [12, 8], -t * 50);
            }
            label(g, rough < 0.15 ? "glatt" : "rau", 470, SY + 60, "#1b2740", 22, "center", 700);
          });
          const sl = s.slider({ label: "Oberfläche", min: 0, max: 10, value: 0, fmt: v => (v === 0 ? "spiegelglatt" : v <= 3 ? "fast glatt" : v <= 7 ? "rau" : "sehr rau"), onInput: v => (rough = v / 10) });
          const ex1 = box(s, "ex", "Glatt", "Spiegel, ruhiges Wasser, Fensterscheibe: Alle Strahlen fliegen <b>geordnet</b> weiter. Du siehst ein Spiegelbild.");
          const ex2 = box(s, "ex", "Rau", "Papier, Wand, T-Shirt: Das Licht wird in <b>alle</b> Richtungen gestreut. Das heißt <b>diffuse Reflexion</b>. Darum siehst du dein Heft von überall.");
          s.add(cols(s, canvas, stack(s, 16, P(s, "Ob du ein Spiegelbild siehst, hängt von der <b>Oberfläche</b> ab."), sl, ex1, ex2)));
          s.show(canvas, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.ding(); await s.show(ex1, "up"); s.say("Auf glatten Flächen bleiben alle Strahlen geordnet."); });
          s.step(async () => { s.sfx.scribble(); await s.tween({ from: 0, to: 10, dur: 1200, update: v => { rough = v / 10; sl.input.value = v; } }); sl.set(10); s.sfx.pop(); await s.show(ex2, "up"); s.say("Auf rauen Flächen wird das Licht in alle Richtungen gestreut."); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Brechung: Licht macht einen Knick",
        say: "Trifft Licht schräg auf Wasser, ändert es an der Grenze seine Richtung. Das heißt Brechung.",
        build(s) {
          const W = 560, H = 480, P0 = { x: 280, y: 230 }, R = 210, N = 1.33;
          const { canvas, g } = s.canvas(W, H);
          let a = 50, arcs = 0;
          const vA = s.h("span", { class: "mono" }, ""), vB = s.h("span", { class: "mono" }, "");
          s.loop(t => {
            const b = Math.asin(Math.sin(a * RAD) / N) / RAD;
            vA.textContent = Math.round(a) + "°"; vB.textContent = Math.round(b) + "°";
            g.clearRect(0, 0, W, H);
            g.fillStyle = "#fffdf2"; g.fillRect(0, 0, W, P0.y);
            const wg = g.createLinearGradient(0, P0.y, 0, H); wg.addColorStop(0, "#8fc8f2"); wg.addColorStop(1, "#3f86c7");
            g.fillStyle = wg; g.fillRect(0, P0.y, W, H - P0.y);
            g.strokeStyle = "#2a6aa8"; g.lineWidth = 3; g.beginPath(); g.moveTo(0, P0.y); g.lineTo(W, P0.y); g.stroke();
            arrow(g, P0.x, 20, P0.x, H - 20, "rgba(27,39,64,.6)", 2, null, [10, 8]);
            label(g, "Luft", 24, 30, "#1b2740", 22, "left", 700); label(g, "Wasser", 24, H - 30, "#fff", 22, "left", 700); label(g, "Lot", P0.x + 12, 30, "#5d6678", 20, "left");
            const S = { x: P0.x - R * Math.sin(a * RAD), y: P0.y - R * Math.cos(a * RAD) };
            const E = { x: P0.x + R * Math.sin(b * RAD), y: P0.y + R * Math.cos(b * RAD) };
            const Rf = { x: P0.x + R * 0.7 * Math.sin(a * RAD), y: P0.y - R * 0.7 * Math.cos(a * RAD) };
            if (arcs > 0) {
              g.globalAlpha = arcs;
              g.fillStyle = "rgba(29,91,208,.18)"; g.strokeStyle = "#1d5bd0"; g.lineWidth = 3;
              g.beginPath(); g.moveTo(P0.x, P0.y); g.arc(P0.x, P0.y, 64, -Math.PI / 2 - a * RAD, -Math.PI / 2); g.closePath(); g.fill(); g.stroke();
              g.fillStyle = "rgba(19,138,90,.25)"; g.strokeStyle = "#0d6b45";
              g.beginPath(); g.moveTo(P0.x, P0.y); g.arc(P0.x, P0.y, 64, Math.PI / 2 - b * RAD, Math.PI / 2); g.closePath(); g.fill(); g.stroke();
              g.globalAlpha = 1;
            }
            g.globalAlpha = 0.3; arrow(g, P0.x, P0.y, Rf.x, Rf.y, "#e0322b", 3, 0.6); g.globalAlpha = 1;
            arrow(g, S.x, S.y, P0.x, P0.y, "#e0322b", 5, 0.55, [14, 8], -t * 50);
            arrow(g, P0.x, P0.y, E.x, E.y, "#e0322b", 5, 0.55, [14, 8], -t * 50);
            // laser
            g.save(); g.translate(S.x, S.y); g.rotate(Math.atan2(P0.y - S.y, P0.x - S.x)); g.fillStyle = "#c0392b"; g.fillRect(-30, -11, 60, 22); g.restore();
            ring(g, S.x, S.y, 36);
          });
          s.drag(canvas, { space: canvas, onStart: () => s.sfx.click(), onMove: p => { if (p.y > P0.y - 10) return; a = clamp(Math.atan2(P0.x - p.x, P0.y - p.y) / RAD, 5, 80); } });
          const cA = s.h("div", { class: "card later", style: { flex: "1" } }, s.h("p", { class: "small", style: { color: "#1d5bd0" } }, "Winkel in Luft"), s.h("p", { class: "big", style: { color: "#1d5bd0" } }, vA));
          const cB = s.h("div", { class: "card later", style: { flex: "1" } }, s.h("p", { class: "small", style: { color: "#0d6b45" } }, "Winkel in Wasser"), s.h("p", { class: "big", style: { color: "#0d6b45" } }, vB));
          const m = merk(s, "Von Luft in Wasser oder Glas wird das Licht <b>zum Lot hin</b> gebrochen.");
          const straw = s.svg(130, 170);
          straw.append(s.el("rect", { x: 15, y: 20, width: 100, height: 145, rx: 8, fill: "#eef6ff", stroke: "#4a87c5", "stroke-width": 3 }),
            s.el("rect", { x: 17, y: 80, width: 96, height: 83, fill: "#9fd3ff" }),
            s.el("line", { x1: 110, y1: 2, x2: 72, y2: 80, stroke: "#e0322b", "stroke-width": 8, "stroke-linecap": "round" }),
            s.el("line", { x1: 82, y1: 80, x2: 58, y2: 150, stroke: "#e0322b", "stroke-width": 8, "stroke-linecap": "round", opacity: 0.85 }));
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"),
            s.h("div", { class: "row", style: { flexWrap: "nowrap", alignItems: "center" } }, Object.assign(straw.style, { flex: "none" }) && straw,
              s.h("p", { class: "small", html: "Der <b>Strohhalm</b> im Glas sieht geknickt aus · Der <b>Löffel</b> im Teeglas auch · Das <b>Schwimmbecken</b> wirkt flacher, als es ist." })));
          s.add(cols(s, canvas, stack(s, 14, P(s, "Licht ändert an der Grenze zum Wasser seine Richtung: <b>Brechung</b>. Ziehe den Laser!"),
            s.h("div", { class: "row", style: { flexWrap: "nowrap" } }, cA, cB), m, life)));
          s.show(canvas, "zoom"); s.sfx.zap();
          s.step(async () => { s.sfx.pop(); s.tween({ from: 0, to: 1, dur: 500, update: v => (arcs = v) }); await s.show([cA, cB], "up"); await s.tween({ from: a, to: 70, dur: 1200, update: v => (a = v) }); s.say("Im Wasser ist der Winkel zum Lot kleiner."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.boing(); await s.show(life, "up"); s.say("Darum sieht der Strohhalm im Glas geknickt aus."); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Sammellinse und Lupe",
        say: "Eine Sammellinse bündelt das Licht. Alle Strahlen treffen sich im Brennpunkt.",
        build(s) {
          const svg = s.svg(560, 440), LX = 190, CY = 210;
          const lens = s.el("path", { fill: "rgba(159,211,255,.7)", stroke: "#4a87c5", "stroke-width": 3 });
          svg.append(s.el("line", { x1: 10, y1: CY, x2: 550, y2: CY, stroke: "#9aa3b2", "stroke-width": 2, "stroke-dasharray": "6 6" }));
          const ys = [100, 155, 210, 265, 320];
          const rin = ys.map(y => s.el("line", { x1: 10, y1: y, x2: LX, y2: y, stroke: "#e8a400", "stroke-width": 4 }));
          const rout = ys.map(() => s.el("line", { stroke: "#e8a400", "stroke-width": 4, class: "later" }));
          const fGlow = s.el("circle", { r: 20, fill: "#ffd23a", opacity: 0.5, class: "later" });
          const fDot = s.el("circle", { r: 7, fill: "#e0322b", class: "later" });
          const fBr = s.el("path", { fill: "none", stroke: UC, "stroke-width": 3, class: "later" });
          const fTxt = s.el("text", { y: 392, "text-anchor": "middle", class: "lbl", fill: UC, style: { fill: UC }, text: "Brennweite", class: "lbl later" });
          const pTxt = s.el("text", { y: 432, "text-anchor": "middle", class: "lbl later", text: "Brennpunkt" });
          const pLine = s.el("line", { y1: CY + 12, y2: 412, stroke: "#5d6678", "stroke-width": 2, "stroke-dasharray": "4 4", class: "later" });
          svg.append(...rin, ...rout, lens, pLine, fGlow, fDot, fBr, fTxt, pTxt);
          let th = 40;
          const upd = () => {
            const f = 7200 / th, FX = LX + f;
            lens.setAttribute("d", `M${LX},${CY - 140} Q${LX + th},${CY} ${LX},${CY + 140} Q${LX - th},${CY} ${LX},${CY - 140} Z`);
            ys.forEach((y, i) => { const k = (540 - LX) / f; rout[i].setAttribute("x1", LX); rout[i].setAttribute("y1", y); rout[i].setAttribute("x2", LX + (540 - LX)); rout[i].setAttribute("y2", y + (CY - y) * k); });
            fGlow.setAttribute("cx", FX); fGlow.setAttribute("cy", CY); fDot.setAttribute("cx", FX); fDot.setAttribute("cy", CY);
            fBr.setAttribute("d", `M${LX},${360} L${LX},${370} L${FX},${370} L${FX},${360}`);
            fTxt.setAttribute("x", (LX + FX) / 2); pTxt.setAttribute("x", clamp(FX, 70, 490)); pLine.setAttribute("x1", FX); pLine.setAttribute("x2", FX);
          };
          upd();
          s.loop(t => { fGlow.setAttribute("r", 18 + 5 * Math.sin(t * 5)); });
          const sl = s.slider({ label: "Linse", min: 24, max: 64, value: 40, fmt: v => (v < 34 ? "dünn" : v < 52 ? "mittel" : "dick"), onInput: v => { th = v; upd(); } });
          const m = merk(s, "<b>Dicke</b> Linse: kurze <b>Brennweite</b>. <b>Dünne</b> Linse: lange Brennweite.");
          const lupe = s.svg(150, 120);
          lupe.append(s.el("circle", { cx: 28, cy: 92, r: 9, fill: "#e0322b" }), s.el("circle", { cx: 28, cy: 92, r: 2, fill: "#111" }),
            s.el("line", { x1: 120, y1: 98, x2: 142, y2: 116, stroke: "#7a4a22", "stroke-width": 10, "stroke-linecap": "round" }),
            s.el("circle", { cx: 88, cy: 58, r: 44, fill: "#eef6ff", stroke: "#4a87c5", "stroke-width": 6 }),
            s.el("circle", { cx: 88, cy: 58, r: 26, fill: "#e0322b" }), s.el("line", { x1: 88, y1: 32, x2: 88, y2: 84, stroke: "#111", "stroke-width": 3 }),
            s.el("circle", { cx: 78, cy: 48, r: 5, fill: "#111" }), s.el("circle", { cx: 98, cy: 66, r: 5, fill: "#111" }), s.el("circle", { cx: 97, cy: 46, r: 4, fill: "#111" }));
          lupe.style.flex = "none";
          const lupeRow = s.h("div", { class: "row later", style: { flexWrap: "nowrap" } }, lupe, P(s, "Eine <b>Lupe</b> ist eine Sammellinse. Hältst du sie nah über einen Marienkäfer, siehst du ihn groß.", "small"));
          const life = box(s, "life", "Im Alltag", "Brille für Weitsichtige · Kamera im Handy · die Linse in deinem Auge");
          s.add(cols(s, svg, stack(s, 14, P(s, "Eine <b>Sammellinse</b> ist in der Mitte dicker. Sie bündelt das Licht im <b>Brennpunkt</b>."), sl, m, lupeRow, life)));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.zap(); await s.show(rout, "draw"); s.sfx.ding(); s.show([fGlow, fDot], "pop"); s.show([pLine, pTxt], "fade"); await s.show([fBr, fTxt], "fade"); s.say("Alle Strahlen treffen sich im Brennpunkt."); });
          s.step(async () => { s.sfx.swoosh(); await s.tween({ from: th, to: 62, dur: 1000, update: v => { th = v; sl.input.value = v; upd(); } }); sl.set(62); await s.show(m, "up"); s.say("Je dicker die Linse, desto kürzer die Brennweite."); });
          s.step(async () => { s.sfx.boing(); await s.show(lupeRow, "up"); s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Weißes Licht ist bunt",
        say: "Ein Prisma zerlegt weißes Licht in viele Farben. Genau so entsteht auch der Regenbogen.",
        build(s) {
          const COL = [["#e0322b", "Rot"], ["#f07a1a", "Orange"], ["#f2c400", "Gelb"], ["#2e9e44", "Grün"], ["#2f6dd6", "Blau"], ["#7b3fc4", "Violett"]];
          // prism
          const a = s.svg(520, 300);
          a.append(s.el("rect", { x: 0, y: 0, width: 520, height: 300, rx: 16, fill: "#22273a" }),
            s.el("line", { x1: 0, y1: 170, x2: 196, y2: 152, stroke: "#fff", "stroke-width": 8 }),
            s.el("polygon", { points: "250,40 150,250 350,250", fill: "rgba(200,230,255,.35)", stroke: "#bfe3ff", "stroke-width": 3 }));
          const inner = s.el("line", { x1: 196, y1: 152, x2: 302, y2: 158, stroke: "#fff", "stroke-width": 6, opacity: 0.8, class: "later" });
          const fan = COL.map(([c], i) => s.el("line", { x1: 302, y1: 158, x2: 430, y2: 160 + i * 25, stroke: c, "stroke-width": 6, class: "later" }));
          const names = COL.map(([c, n], i) => s.el("text", { x: 444, y: 167 + i * 25, "font-size": 19, "font-weight": 700, fill: c, text: n, class: "later" }));
          a.append(inner, ...fan, ...names, s.el("text", { x: 250, y: 284, "text-anchor": "middle", class: "lbl", style: { fill: "#fff" }, text: "Prisma" }));
          // rainbow
          const b = s.svg(520, 300);
          const sky = s.el("rect", { x: 0, y: 0, width: 520, height: 250, fill: "#9cc9ef" });
          const clip = s.el("clipPath", { id: "u5rbclip" }, s.el("rect", { x: 0, y: 0, width: 520, height: 250 }));
          const arcs = s.el("g", { "clip-path": "url(#u5rbclip)" });
          const bands = COL.map(([c]) => s.el("path", { fill: "none", stroke: c, "stroke-width": 8, opacity: 0.9 }));
          arcs.append(...bands);
          const rain = s.el("g", { stroke: "#5f7f9c", "stroke-width": 2 });
          for (let i = 0; i < 26; i++) { const x = 40 + i * 18; rain.append(s.el("line", { x1: x, y1: 60 + (i % 3) * 12, x2: x - 6, y2: 80 + (i % 3) * 12 })); }
          const cloud = s.el("path", { d: "M30,70 q10,-40 60,-30 q30,-30 80,-5 q40,-25 90,0 q50,-20 90,5 q50,-10 60,30 z", fill: "#6f7c8c", opacity: 0.85 });
          b.append(s.el("defs", {}, clip), sky, cloud, rain, arcs, s.el("rect", { x: 0, y: 250, width: 520, height: 50, fill: "#7cbf5a" }),
            s.el("circle", { cx: 260, cy: 252, r: 14, fill: "#1b2740" }), s.el("path", { d: "M244,300 Q244,266 260,266 Q276,266 276,300 Z", fill: "#1b2740" }));
          b.classList.add("later");
          let el = 15;
          const status = P(s, "", "small", true);
          const updR = () => {
            const px = 5, cy = 250 + el * px;
            bands.forEach((p, i) => { const r = 42 * px - i * 7; p.setAttribute("d", `M${260 - r},${cy} A${r},${r} 0 0 1 ${260 + r},${cy}`); });
            status.innerHTML = el >= 42 ? "Sonne höher als 42°: <b>kein</b> Regenbogen!" : `Sonne ${Math.round(el)}° hoch: Regenbogen sichtbar.`;
          };
          updR();
          const sl = s.slider({ label: "Sonnenhöhe (hinter dir)", min: 0, max: 50, value: 15, fmt: v => v + "°", onInput: v => { el = v; updR(); } });
          sl.classList.add("later");
          const t1 = P(s, "<b>Prisma</b>: Weißes Licht wird in <b>Rot, Orange, Gelb, Grün, Blau</b> und <b>Violett</b> zerlegt. Violett wird am stärksten gebrochen.", "small");
          const t2 = P(s, "<b>Regenbogen</b>: Sonne im <b>Rücken</b>, Regen <b>vor</b> dir. Jeder Tropfen wirkt wie ein kleines Prisma. Rot ist außen.", "small", true);
          const life14 = box(s, "life", "Im Alltag", "Regenbogen nach einem Regenschauer · im Sprühnebel vom Gartenschlauch – immer mit der Sonne im Rücken und nur, wenn sie tief steht.");
          s.add(s.h("div", { class: "cols", style: { gap: "28px", alignItems: "start", height: "100%" } }, stack(s, 12, a, t1, life14), stack(s, 12, b, t2, sl, status)));
          s.show(a, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.zap(); await s.show(inner, "draw"); s.sfx.chord([0, 4, 7, 12]); s.show(fan, "draw"); await s.show(names, "left"); s.say("Rot, Orange, Gelb, Grün, Blau und Violett."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(b, "zoom"); s.sfx.chord([0, 5, 9]); await s.show(t2, "up"); s.say("Für einen Regenbogen brauchst du die Sonne im Rücken und Regen vor dir."); });
          s.step(async () => { s.show([sl, status], "up"); s.sfx.swoosh(); await s.tween({ from: 15, to: 45, dur: 1600, update: v => { el = v; sl.input.value = v; updR(); } }); s.sfx.boing(); await s.wait(500); await s.tween({ from: 45, to: 10, dur: 1400, update: v => { el = v; sl.input.value = v; updR(); } }); sl.set(10); s.say("Steht die Sonne höher als zweiundvierzig Grad, gibt es keinen Regenbogen."); });
          s.step(async () => { s.sfx.ding(); await s.show(life14, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Unser Auge",
        say: "Licht fällt durch die Pupille, die Linse bündelt es, und auf der Netzhaut entsteht ein Bild.",
        build(s) {
          const svg = s.svg(560, 440), O = { x: 340, y: 220 }, R = 150;
          svg.append(s.el("circle", { cx: O.x, cy: O.y, r: R, fill: "#fff", stroke: "#1b2740", "stroke-width": 4 }),
            s.el("path", { d: `M${O.x + 148},${O.y - 18} L${O.x + 215},${O.y - 10} L${O.x + 215},${O.y + 26} L${O.x + 148},${O.y + 18} Z`, fill: "#f3c6a0", stroke: "#1b2740", "stroke-width": 3 }),
            s.el("path", { d: `M${O.x - 138},${O.y - 60} Q${O.x - 185},${O.y} ${O.x - 138},${O.y + 60}`, fill: "rgba(159,211,255,.4)", stroke: "#4a87c5", "stroke-width": 3 }));
          const ret = s.el("path", { d: `M${O.x + R * Math.cos(-60 * RAD)},${O.y + R * Math.sin(-60 * RAD)} A${R},${R} 0 0 1 ${O.x + R * Math.cos(60 * RAD)},${O.y + R * Math.sin(60 * RAD)}`, fill: "none", stroke: "#d9534f", "stroke-width": 9 });
          const LX = O.x - 120;
          const irisT = s.el("line", { x1: O.x - 140, x2: O.x - 140, stroke: "#2f6db5", "stroke-width": 10 }), irisB = s.el("line", { x1: O.x - 140, x2: O.x - 140, stroke: "#2f6db5", "stroke-width": 10 });
          const lens = s.el("ellipse", { cx: LX, cy: O.y, rx: 17, ry: 52, fill: "rgba(159,211,255,.8)", stroke: "#4a87c5", "stroke-width": 3 });
          // tree outside
          const tree = s.el("g", {}, s.el("rect", { x: 34, y: 230, width: 14, height: 60, fill: "#7a4a22" }), s.el("circle", { cx: 41, cy: 200, r: 36, fill: "#3a9a3a" }));
          svg.append(ret, irisT, irisB, lens, tree);
          // rays through lens centre to retina
          const hitR = (A) => { const C = { x: LX, y: O.y }; const dx = C.x - A.x, dy = C.y - A.y, l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l; const fx = C.x - O.x, fy = C.y - O.y; const bq = fx * ux + fy * uy, cq = fx * fx + fy * fy - R * R; const t = -bq + Math.sqrt(bq * bq - cq); return { x: C.x + ux * t, y: C.y + uy * t }; };
          const T = { x: 41, y: 166 }, Bm = { x: 41, y: 290 }, hT = hitR(T), hB = hitR(Bm);
          const rays = [[T, hT, "#2e9e44"], [Bm, hB, "#7a4a22"]].map(([A, Bp, c]) => s.el("path", { d: `M${A.x},${A.y} L${LX},${O.y} L${Bp.x},${Bp.y}`, fill: "none", stroke: c, "stroke-width": 3, "stroke-dasharray": "8 5", class: "later" }));
          const k = (hB.y - hT.y) / (Bm.y - T.y);
          const imgTree = s.el("g", { class: "later" }, s.el("g", { transform: `translate(${hT.x - 14} ${hT.y}) scale(0.5 ${k}) translate(-41 -166)` }, s.el("rect", { x: 34, y: 230, width: 14, height: 60, fill: "#7a4a22" }), s.el("circle", { cx: 41, cy: 200, r: 36, fill: "#3a9a3a" })));
          svg.append(...rays, imgTree);
          const lab = (x, y, t, lx, ly) => s.el("g", { class: "later" }, s.el("line", { x1: x, y1: y + (ly > y ? 8 : -20), x2: lx, y2: ly, stroke: "#5d6678", "stroke-width": 2 }), s.el("text", { x, y, "text-anchor": "middle", class: "lbl", text: t }));
          const lP = lab(O.x - 140, 40, "Pupille", O.x - 140, O.y - 40), lL = lab(LX + 10, 425, "Linse", LX, O.y + 54), lN = lab(O.x + 120, 40, "Netzhaut", O.x + 106, O.y - 106), lS = lab(O.x + 160, 425, "Sehnerv", O.x + 185, O.y + 26);
          svg.append(lP, lL, lN, lS);
          let pr = 30;
          const updP = () => { irisT.setAttribute("y1", O.y - 70); irisT.setAttribute("y2", O.y - pr); irisB.setAttribute("y1", O.y + pr); irisB.setAttribute("y2", O.y + 70); };
          updP();
          const sl = s.slider({ label: "Helligkeit", min: 0, max: 10, value: 4, fmt: v => (v <= 3 ? "dunkel" : v <= 6 ? "mittel" : "hell"), onInput: v => { pr = 46 - v * 3.8; updP(); } });
          sl.set(4);
          const ex1 = box(s, "ex", "Pupille", "Das schwarze Loch vorne im Auge. Bei Helligkeit wird sie <b>klein</b>, im Dunkeln <b>groß</b>.");
          const ex2 = box(s, "ex", "Linse", "Sie bündelt das Licht – wie eine Lupe.");
          const ex3 = box(s, "ex", "Netzhaut", "Hier entsteht das Bild – <b>auf dem Kopf</b>! Dein Gehirn dreht es wieder richtig herum.");
          const life = box(s, "life", "Im Alltag", "Aus dem U-Bahnhof ins Sonnenlicht: Erst blendet es, dann werden deine Pupillen klein.");
          s.add(cols(s, svg, stack(s, 12, sl, ex1, ex2, ex3, life)));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.pop(); s.show(lP, "fade"); await s.show(ex1, "up"); s.sfx.swoosh(); await s.tween({ from: 4, to: 10, dur: 900, update: v => { pr = 46 - v * 3.8; updP(); sl.input.value = v; } }); sl.set(10); s.say("Bei Helligkeit wird die Pupille klein."); });
          s.step(async () => { s.sfx.pop(); s.show(lL, "fade"); await s.show(ex2, "up"); });
          s.step(async () => { s.sfx.zap(); s.show([lN, lS], "fade"); await s.show(rays, "draw"); s.sfx.ding(); await s.show(imgTree, "fade"); await s.show(ex3, "up"); s.say("Das Bild auf der Netzhaut steht auf dem Kopf. Das Gehirn dreht es um."); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Im Alltag: Licht überall",
        say: "Licht begegnet dir überall: am Fahrrad, im Auto, in der U-Bahn und beim Sonnenuntergang.",
        build(s) {
          const ic = (draw) => { const v = s.svg(110, 70); v.style.width = "150px"; v.style.height = "95px"; draw(v); return v; };
          const items = [
            ["Katzenaugen", "Rückstrahler am Fahrrad werfen das Scheinwerferlicht zum Auto zurück. So sieht man dich im Dunkeln.", v => {
              v.append(s.el("circle", { cx: 30, cy: 46, r: 20, fill: "none", stroke: "#1b2740", "stroke-width": 4 }), s.el("circle", { cx: 84, cy: 46, r: 20, fill: "none", stroke: "#1b2740", "stroke-width": 4 }),
                s.el("rect", { x: 22, y: 38, width: 16, height: 16, rx: 3, fill: "#f2a600" }), s.el("rect", { x: 92, y: 10, width: 16, height: 12, rx: 3, fill: "#e0322b" }), s.el("path", { d: "M30,46 L56,20 L84,46 M56,20 L98,16", fill: "none", stroke: "#1b2740", "stroke-width": 4 })); }],
            ["Spiegel im Auto", "Rück- und Außenspiegel reflektieren das Licht von hinten. So sieht der Fahrer, was hinter dem Auto ist.", v => {
              v.append(s.el("rect", { x: 10, y: 14, width: 90, height: 40, rx: 14, fill: "#9fd3ff", stroke: "#1b2740", "stroke-width": 4 }), s.el("line", { x1: 55, y1: 54, x2: 55, y2: 68, stroke: "#1b2740", "stroke-width": 5 }), s.el("line", { x1: 26, y1: 24, x2: 42, y2: 44, stroke: "#fff", "stroke-width": 4 })); }],
            ["Sonnenbrille", "Die dunklen Gläser lassen weniger Licht durch. Deine Augen werden nicht so stark geblendet.", v => {
              v.append(s.el("path", { d: "M8,24 L102,24", stroke: "#1b2740", "stroke-width": 4 }), s.el("rect", { x: 12, y: 24, width: 38, height: 28, rx: 12, fill: "#1b2740" }), s.el("rect", { x: 60, y: 24, width: 38, height: 28, rx: 12, fill: "#1b2740" })); }],
            ["Brille", "Brillengläser sind Linsen. Sie brechen das Licht so, dass das Bild scharf auf der Netzhaut landet.", v => {
              v.append(s.el("circle", { cx: 32, cy: 38, r: 20, fill: "#eef6ff", stroke: "#1b2740", "stroke-width": 4 }), s.el("circle", { cx: 78, cy: 38, r: 20, fill: "#eef6ff", stroke: "#1b2740", "stroke-width": 4 }), s.el("path", { d: "M52,36 Q55,30 58,36 M12,34 L2,26 M98,34 L108,26", fill: "none", stroke: "#1b2740", "stroke-width": 4 })); }],
            ["U-Bahn-Tunnel", "Im Tunnel ist es dunkel. Die Scheinwerfer der U-Bahn sind Lichtquellen – die Tunnelwände werden nur beleuchtet.", v => {
              v.append(s.el("path", { d: "M8,68 L8,30 Q55,-6 102,30 L102,68 Z", fill: "#2a3040" }), s.el("rect", { x: 30, y: 26, width: 50, height: 42, rx: 8, fill: "#f6c800" }), s.el("rect", { x: 38, y: 32, width: 34, height: 14, rx: 3, fill: "#9fd3ff" }),
                s.el("circle", { cx: 40, cy: 58, r: 5, fill: "#fff6b0" }), s.el("circle", { cx: 70, cy: 58, r: 5, fill: "#fff6b0" })); }],
            ["Sonnenuntergang", "Abends ist der Weg des Lichts durch die Luft lang. Blau wird weggestreut – übrig bleiben Rot und Orange.", v => {
              v.append(s.el("rect", { x: 0, y: 0, width: 110, height: 50, rx: 8, fill: "#ffb36b" }), s.el("circle", { cx: 55, cy: 50, r: 22, fill: "#e0322b" }), s.el("rect", { x: 0, y: 50, width: 110, height: 20, fill: "#2f6db5" })); }],
          ];
          const cards = items.map(([t, txt, d]) => s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "8px" } }, ic(d), s.h("p", { class: "h2", style: { fontSize: "25px" } }, t), s.h("p", { class: "small", html: txt })));
          s.add(s.h("div", { class: "cols3", style: { gridTemplateRows: "1fr 1fr", height: "100%", gap: "18px 20px" } }, ...cards));
          s.sfx.whoosh(); s.show(cards[0], "pop"); s.show(cards[1], "pop", 150);
          s.step(async () => { s.sfx.pop(); s.show(cards[2], "pop"); await s.show(cards[3], "pop", 150); s.say("Sonnenbrille und Brille."); });
          s.step(async () => { s.sfx.pop(); s.show(cards[4], "pop"); await s.show(cards[5], "pop", 150); s.sfx.success(); s.say("Und beim Sonnenuntergang wird der Himmel rot."); });
        },
      },
    ],
  });
})();
