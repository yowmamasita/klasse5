/* Kapitel 6 – Sonne, Wärme und Wetter (NaWi 5/6, Berlin RLP 3.3 „Sonne – Wetter – Jahreszeiten“) */
(() => {
  const UC = "#2f7d32";
  const FONT = '"Atkinson Hyperlegible", system-ui, sans-serif';
  const HAND = '"Caveat", cursive';
  const RAD = Math.PI / 180;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const mix = (c1, c2, t) => { const a = c1.match(/\w\w/g).map(x => parseInt(x, 16)), b = c2.match(/\w\w/g).map(x => parseInt(x, 16)); return "rgb(" + a.map((v, i) => Math.round(v + (b[i] - v) * clamp(t, 0, 1))).join(",") + ")"; };
  const heat = t => (t < 0.5 ? mix("#5b9be6", "#f2c94c", t * 2) : mix("#f2c94c", "#e0322b", (t - 0.5) * 2));

  /* ---------- layout helpers ---------- */
  const cols = (s, left, right, lw = 560) =>
    s.h("div", { class: "cols", style: { gridTemplateColumns: lw + "px 1fr", alignItems: "center", height: "100%" } }, left, right);
  const P = (s, html, cls = "t", hidden = false) => s.h("p", { class: cls + (hidden ? " later" : ""), html });
  const box = (s, cls, label, html, hidden = true) =>
    s.h("div", { class: cls + (hidden ? " later" : "") }, label ? s.h("span", { class: "exlabel" }, label) : null, s.h("p", { class: "small", html }));
  const merk = (s, html, hidden = true) => s.h("div", { class: "merk" + (hidden ? " later" : ""), html });
  const stack = (s, gap, ...kids) => s.h("div", { class: "stack", style: { gap: gap + "px" } }, ...kids);
  const noShrink = el => { el.style.flex = "none"; return el; };

  /* ---------- canvas helpers ---------- */
  function label(g, txt, x, y, col = "#5d6678", size = 20, align = "center", weight = 600, font = FONT) {
    g.font = `${weight} ${size}px ${font}`; g.fillStyle = col; g.textAlign = align; g.textBaseline = "middle"; g.fillText(txt, x, y);
  }
  function arrow(g, x1, y1, x2, y2, col, w = 3) {
    g.strokeStyle = col; g.lineWidth = w; g.lineCap = "round"; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
    const a = Math.atan2(y2 - y1, x2 - x1), L = 10 + w * 2;
    g.fillStyle = col; g.beginPath(); g.moveTo(x2, y2); g.lineTo(x2 - L * Math.cos(a - 0.45), y2 - L * Math.sin(a - 0.45)); g.lineTo(x2 - L * Math.cos(a + 0.45), y2 - L * Math.sin(a + 0.45)); g.closePath(); g.fill();
  }
  function wave(g, x1, y1, x2, y2, col, ph = 0, amp = 6, w = 3) {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
    g.strokeStyle = col; g.lineWidth = w; g.lineCap = "round"; g.beginPath();
    for (let d = 0; d <= L; d += 3) { const o = amp * Math.sin(d / 9 - ph); const x = x1 + ux * d - uy * o, y = y1 + uy * d + ux * o; d ? g.lineTo(x, y) : g.moveTo(x, y); }
    g.stroke();
  }
  function sunC(g, x, y, r, t = 0) {
    const gr = g.createRadialGradient(x, y, 0, x, y, r * 2.2); gr.addColorStop(0, "rgba(255,214,80,.7)"); gr.addColorStop(1, "rgba(255,214,80,0)");
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r * 2.2, 0, 7); g.fill();
    g.strokeStyle = "#e09a00"; g.lineWidth = 4; g.lineCap = "round";
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6 + t * 0.3; g.beginPath(); g.moveTo(x + (r + 8) * Math.cos(a), y + (r + 8) * Math.sin(a)); g.lineTo(x + (r + 20) * Math.cos(a), y + (r + 20) * Math.sin(a)); g.stroke(); }
    g.fillStyle = "#ffc928"; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.stroke();
  }
  function ring(g, x, y, r) { g.save(); g.setLineDash([6, 6]); g.strokeStyle = "rgba(47,125,50,.7)"; g.lineWidth = 2; g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke(); g.restore(); }

  /* ---------- svg helpers ---------- */
  const sunS = (s, x, y, r) => s.el("g", {}, s.el("circle", { cx: x, cy: y, r: r * 1.7, fill: "#ffe680", opacity: 0.5 }),
    ...Array.from({ length: 12 }, (_, i) => { const a = i * 30 * RAD; return s.el("line", { x1: x + (r + 7) * Math.cos(a), y1: y + (r + 7) * Math.sin(a), x2: x + (r + 18) * Math.cos(a), y2: y + (r + 18) * Math.sin(a), stroke: "#e09a00", "stroke-width": 4, "stroke-linecap": "round" }); }),
    s.el("circle", { cx: x, cy: y, r, fill: "#ffc928", stroke: "#e09a00", "stroke-width": 3 }));
  const cloudS = (s, x, y, k = 1, fill = "#ffffff") => s.el("path", { d: `M${x - 60 * k},${y + 20 * k} q-${20 * k},-${30 * k} ${10 * k},-${40 * k} q${10 * k},-${30 * k} ${45 * k},-${20 * k} q${25 * k},-${25 * k} ${55 * k},${5 * k} q${30 * k},-${5 * k} ${30 * k},${25 * k} q${10 * k},${30 * k} -${20 * k},${30 * k} z`, fill, stroke: "#8a94a6", "stroke-width": 3 });
  const lbl = (s, x, y, t, anchor = "middle", extra = {}) => s.el("text", Object.assign({ x, y, "text-anchor": anchor, class: "lbl", text: t }, extra));

  Deck.unit({
    id: "u6", num: 6, title: "Sonne, Wärme und Wetter", color: UC, soft: "#e3f2e4",
    subtitle: "Wie die Sonne unser Wetter macht",
    blurb: "Energie der Sonne, Wärme, Luft, Wetter, Wasserkreislauf, Klima",
    goals: [
      "Verstehen, warum die Sonne Energie für alles Leben liefert",
      "Wärmeleitung, Wärmeströmung und Wärmestrahlung erkennen",
      "Wetter messen und den Wasserkreislauf erklären",
      "Den Treibhauseffekt verstehen – und was du tun kannst",
    ],
    icon(svg, el) {
      svg.append(el("circle", { cx: 24, cy: 24, r: 12, fill: "#ffc928", stroke: "#e09a00", "stroke-width": 3 }),
        el("rect", { x: 44, y: 14, width: 10, height: 36, rx: 5, fill: "#fff", stroke: UC, "stroke-width": 3 }),
        el("circle", { cx: 49, cy: 54, r: 8, fill: "#e0322b", stroke: UC, "stroke-width": 3 }),
        el("path", { d: "M10,56 q8,-10 16,0 q8,-10 16,0", fill: "none", stroke: "#2f6dd6", "stroke-width": 3 }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Die Sonne – unser Kraftwerk",
        say: "Fast alles Leben auf der Erde bekommt seine Energie von der Sonne.",
        build(s) {
          const svg = s.svg(540, 500);
          svg.append(s.el("rect", { x: 0, y: 0, width: 540, height: 500, rx: 20, fill: "#eef7ff" }), s.el("rect", { x: 0, y: 430, width: 540, height: 70, fill: "#9ed07f" }));
          svg.append(sunS(s, 100, 90, 42));
          // grass + flower
          const grass = s.el("g", {});
          for (let i = 0; i < 9; i++) { const x = 60 + i * 10; grass.append(s.el("path", { d: `M${x},432 Q${x + (i % 2 ? 8 : -8)},${400 - (i % 3) * 12} ${x + (i % 2 ? 4 : -4)},${370 - (i % 3) * 14}`, fill: "none", stroke: "#2e8b3a", "stroke-width": 5, "stroke-linecap": "round" })); }
          grass.append(s.el("line", { x1: 132, y1: 432, x2: 132, y2: 372, stroke: "#2e8b3a", "stroke-width": 4 }), s.el("circle", { cx: 132, cy: 366, r: 11, fill: "#ffd23a", stroke: "#f07a1a", "stroke-width": 4 }));
          // hare
          const hare = s.el("g", {}, s.el("ellipse", { cx: 290, cy: 408, rx: 38, ry: 24, fill: "#b39b7d" }), s.el("circle", { cx: 322, cy: 386, r: 16, fill: "#b39b7d" }),
            s.el("ellipse", { cx: 316, cy: 356, rx: 5, ry: 19, fill: "#b39b7d" }), s.el("ellipse", { cx: 328, cy: 354, rx: 5, ry: 19, fill: "#a08767" }),
            s.el("circle", { cx: 328, cy: 384, r: 3, fill: "#111" }), s.el("circle", { cx: 252, cy: 402, r: 8, fill: "#fff" }),
            s.el("line", { x1: 270, y1: 428, x2: 266, y2: 434, stroke: "#8a7458", "stroke-width": 5 }), s.el("line", { x1: 308, y1: 428, x2: 312, y2: 434, stroke: "#8a7458", "stroke-width": 5 }));
          // fox
          const fox = s.el("g", {}, s.el("ellipse", { cx: 420, cy: 396, rx: 30, ry: 11, fill: "#e07b2a", transform: "rotate(-20 420 396)" }), s.el("circle", { cx: 395, cy: 404, r: 7, fill: "#fff" }),
            s.el("ellipse", { cx: 470, cy: 408, rx: 40, ry: 21, fill: "#e07b2a" }), s.el("path", { d: "M500,398 L540,392 L512,420 Z", fill: "#e07b2a" }),
            s.el("path", { d: "M502,396 L506,372 L516,392 Z M514,394 L524,374 L528,396 Z", fill: "#c4621a" }), s.el("circle", { cx: 518, cy: 400, r: 3, fill: "#111" }),
            s.el("line", { x1: 446, y1: 426, x2: 444, y2: 434, stroke: "#8a3e10", "stroke-width": 5 }), s.el("line", { x1: 494, y1: 426, x2: 496, y2: 434, stroke: "#8a3e10", "stroke-width": 5 }));
          svg.append(grass, hare, fox, lbl(s, 100, 470, "Gras"), lbl(s, 290, 470, "Hase"), lbl(s, 470, 470, "Fuchs"));
          // energy paths
          const paths = [[100, 160, 100, 340], [150, 400, 238, 400], [345, 400, 384, 400]];
          const ar = paths.map(([a, b, c, d]) => s.el("line", { x1: a, y1: b, x2: c, y2: d, stroke: "#e8a400", "stroke-width": 6, "stroke-dasharray": "2 12", "stroke-linecap": "round", class: "later" }));
          const ph = s.el("text", { x: 118, y: 260, class: "hlbl later", text: "Fotosynthese" });
          const dots = paths.map(() => [0, 1, 2].map(() => s.el("circle", { r: 8, fill: "#ffd23a", stroke: "#e09a00", "stroke-width": 2, opacity: 0 })));
          svg.append(...ar, ph, ...dots.flat());
          const on = [0, 0, 0];
          s.loop(t => {
            paths.forEach(([a, b, c, d], i) => dots[i].forEach((dt, k) => {
              const u = (t * 0.6 + k / 3) % 1; dt.setAttribute("cx", a + (c - a) * u); dt.setAttribute("cy", b + (d - b) * u); dt.setAttribute("opacity", on[i] * Math.sin(Math.PI * u));
            }));
          });
          const ex1 = box(s, "ex", "Pflanzen", "Grüne Pflanzen machen aus Sonnenlicht, Wasser und Kohlenstoffdioxid <b>Traubenzucker</b> und <b>Sauerstoff</b>. Das heißt <b>Fotosynthese</b>.");
          const ex2 = box(s, "ex", "Nahrungskette", "Der Hase frisst das Gras, der Fuchs frisst den Hasen. So wandert die Energie der Sonne weiter.");
          const life = box(s, "life", "Im Alltag", "Brot aus Weizen · Kartoffeln vom Feld · Milch von Kühen, die Gras fressen: alles gespeicherte Sonnenenergie!");
          s.add(cols(s, svg, stack(s, 16, P(s, "Fast alles Leben auf der Erde bekommt seine Energie von der <b>Sonne</b>."), ex1, ex2, life), 540));
          s.show(svg, "zoom"); s.sfx.whoosh();
          s.step(async () => { on[0] = 1; s.sfx.zap(); s.show(ar[0], "fade"); s.show(ph, "left"); await s.show(ex1, "up"); s.say("Pflanzen fangen das Sonnenlicht ein."); });
          s.step(async () => { on[1] = 1; s.sfx.pop(); await s.show(ar[1], "fade"); on[2] = 1; s.sfx.pop(); await s.show(ar[2], "fade"); await s.show(ex2, "up"); s.say("Die Energie wandert vom Gras zum Hasen und zum Fuchs."); });
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Temperatur und Wärme",
        say: "Die Temperatur sagt, wie warm etwas ist. Wärme fließt immer von warm nach kalt.",
        build(s) {
          const W = 560, H = 480;
          const { canvas, g } = s.canvas(W, H);
          let T = 20;
          const parts = Array.from({ length: 46 }, () => ({ x: 80 + Math.random() * 260, y: 150 + Math.random() * 270, a: Math.random() * 6.28 }));
          s.loop((t, dt) => {
            dt = Math.min(dt || 0, 0.05);
            g.clearRect(0, 0, W, H);
            g.fillStyle = "#fffdf2"; g.fillRect(0, 0, W, H);
            // beaker
            g.fillStyle = mix("cfe6ff", "ffd0c4", T / 100); g.fillRect(62, 130, 296, 308);
            g.strokeStyle = "#5d6678"; g.lineWidth = 5; g.beginPath(); g.moveTo(60, 70); g.lineTo(60, 440); g.lineTo(360, 440); g.lineTo(360, 70); g.stroke();
            const sp = 20 + T * 3.2;
            for (const p of parts) {
              p.a += (Math.random() - 0.5) * 2; p.x += Math.cos(p.a) * sp * dt; p.y += Math.sin(p.a) * sp * dt;
              if (p.x < 72 || p.x > 348) { p.a = Math.PI - p.a; p.x = clamp(p.x, 72, 348); }
              if (p.y < 142 || p.y > 428) { p.a = -p.a; p.y = clamp(p.y, 142, 428); }
              g.fillStyle = heat(T / 100); g.beginPath(); g.arc(p.x, p.y, 7, 0, 7); g.fill();
            }
            // thermometer
            const ty = v => 400 - v * 3;
            g.fillStyle = "#fff"; g.strokeStyle = "#1b2740"; g.lineWidth = 3;
            g.beginPath(); g.roundRect(440, 50, 26, 370, 13); g.fill(); g.stroke();
            g.beginPath(); g.arc(453, 430, 22, 0, 7); g.fillStyle = "#e0322b"; g.fill(); g.stroke();
            g.fillStyle = "#e0322b"; g.fillRect(447, ty(T), 12, 420 - ty(T));
            [0, 50, 100].forEach(v => { g.strokeStyle = "#1b2740"; g.lineWidth = 2; g.beginPath(); g.moveTo(466, ty(v)); g.lineTo(478, ty(v)); g.stroke(); label(g, v + " °C", 484, ty(v), "#1b2740", 19, "left"); });
          });
          const sl = s.slider({ label: "Temperatur", min: 0, max: 100, step: 5, value: 20, fmt: v => v + " °C", onInput: v => (T = v) });
          const ex = box(s, "ex", "Wärme", "<b>Wärme</b> ist Energie. Sie fließt immer von <b>warm nach kalt</b>: Der heiße Tee wärmt deine kalten Hände – nie umgekehrt.");
          const m = merk(s, "Eine Badewanne mit 40 °C hat viel <b>mehr Wärme</b> als eine Tasse mit 40 °C: viel mehr Wasser!");
          const life = box(s, "life", "Im Alltag", "Eiswürfel im Saft schmelzen · Pommes kühlen auf dem Teller ab · Wasser gefriert bei 0 °C und kocht bei 100 °C");
          s.add(cols(s, canvas, stack(s, 12, P(s, "Die <b>Temperatur</b> sagt, wie warm etwas ist (in <b>°C</b>). Je wärmer, desto schneller zappeln die Teilchen."), sl, ex, m, life)));
          s.show(canvas, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); await s.tween({ from: 20, to: 90, dur: 1400, update: v => { T = Math.round(v); sl.input.value = T; } }); sl.set(90); s.say("Heißes Wasser: Die Teilchen flitzen schnell herum."); });
          s.step(async () => { s.sfx.pop(); await s.show(ex, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.say("Gleiche Temperatur, aber die Badewanne hat viel mehr Wärme."); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Wärmeleitung",
        say: "Bei der Wärmeleitung wandert die Wärme durch einen Stoff hindurch.",
        build(s) {
          const svg = s.svg(540, 460);
          const N = 26, A = { x: 255, y: 400 }, B = { x: 470, y: 90 }, TEA = 250;
          svg.append(s.el("path", { d: "M120,220 L140,430 L330,430 L350,220 Z", fill: "#fff", stroke: "#1b2740", "stroke-width": 5 }),
            s.el("path", { d: `M127,${TEA} L140,428 L330,428 L343,${TEA} Z`, fill: "#b8622d", opacity: 0.85 }),
            s.el("path", { d: "M350,260 q50,10 40,60 q-8,40 -48,40", fill: "none", stroke: "#1b2740", "stroke-width": 6 }));
          const steam = [170, 220, 280].map(x => s.el("path", { d: `M${x},210 q-12,-20 0,-40 q12,-20 0,-40`, fill: "none", stroke: "#9aa3b2", "stroke-width": 4, "stroke-linecap": "round" }));
          svg.append(...steam);
          const segs = [];
          for (let i = 0; i < N; i++) {
            const u0 = i / N, u1 = (i + 1) / N;
            const l = s.el("line", { x1: A.x + (B.x - A.x) * u0, y1: A.y + (B.y - A.y) * u0, x2: A.x + (B.x - A.x) * u1, y2: A.y + (B.y - A.y) * u1, "stroke-width": i > N - 9 ? 20 : 12, "stroke-linecap": "round" });
            segs.push(l);
          }
          svg.append(...segs, s.el("text", { x: 235, y: 330, "text-anchor": "middle", class: "lbl", style: { fill: "#fff" }, text: "heißer Tee" }));
          const inTea = i => A.y + (B.y - A.y) * ((i + 0.5) / N) > TEA;
          let T = Array(N).fill(0), kappa = 1, name = "Metall";
          const handle = s.h("b", null, "kalt");
          const reset = (k, n) => { kappa = k; name = n; T = T.map((_, i) => (inTea(i) ? 1 : 0)); s.sfx.pop(); };
          reset(1, "Metall");
          s.loop((t, dt) => {
            dt = Math.min(dt || 0, 0.05);
            const sub = 8, r = kappa * 6 * dt / sub;
            for (let k = 0; k < sub; k++) {
              const n = T.slice();
              for (let i = 0; i < N; i++) { if (inTea(i)) { n[i] = 1; continue; } const l = T[i - 1] ?? T[i], rr = T[i + 1] ?? T[i]; n[i] = T[i] + r * (l + rr - 2 * T[i]) - 0.002 * T[i] * dt * 60 / sub; }
              T = n;
            }
            segs.forEach((l, i) => l.setAttribute("stroke", heat(T[i])));
            const h = T[N - 3];
            handle.textContent = h > 0.5 ? "heiß!" : h > 0.2 ? "warm" : "kalt";
            steam.forEach((p, i) => p.setAttribute("transform", `translate(0 ${-((t * 20 + i * 13) % 20)})`));
          });
          const mk = (n, k) => s.h("button", { class: "btn", onclick: () => { reset(k, n); s.say(n); } }, n);
          const card = s.h("div", { class: "card soft" }, s.h("p", { class: "h2" }, "Griff: ", handle));
          const ex1 = box(s, "ex", "Gute Wärmeleiter", "Alle <b>Metalle</b>, z. B. Kupfer, Aluminium und Silber.");
          const ex2 = box(s, "ex", "Schlechte Wärmeleiter", "<b>Holz</b>, <b>Kunststoff</b>, Glas – und vor allem <b>Luft</b>.");
          const life = box(s, "life", "Im Alltag", "Topfgriffe aus Kunststoff · Kochlöffel aus Holz · Eine Metallbank fühlt sich im Winter kälter an als eine Holzbank: Das Metall leitet die Wärme schnell aus deiner Hand.");
          s.add(cols(s, svg, stack(s, 14, P(s, "Bei der <b>Wärmeleitung</b> wandert die Wärme <b>durch</b> einen Stoff – vom heißen zum kalten Ende."),
            s.h("div", { class: "row", style: { gap: "10px" } }, mk("Metall", 1), mk("Holz", 0.05), mk("Kunststoff", 0.03)), card, ex1, ex2, life), 540));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.ding(); await s.show(ex1, "up"); s.say("Ein Metalllöffel wird schnell heiß."); });
          s.step(async () => { reset(0.05, "Holz"); await s.show(ex2, "up"); s.say("Ein Holzlöffel bleibt am Griff kalt."); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Wärmeströmung",
        say: "Bei der Wärmeströmung nimmt strömende Luft die Wärme mit. So heizt die Heizung das ganze Zimmer.",
        build(s) {
          const W = 560, H = 480, C = { x: 290, y: 250 }, RX = 215, RY = 180;
          const { canvas, g } = s.canvas(W, H);
          let heatOn = 0, arrows = 0;
          const ps = Array.from({ length: 150 }, () => ({ a: Math.random() * 6.28, r: 0.3 + Math.random() * 0.68, j: Math.random() * 6.28 }));
          s.loop((t, dt) => {
            dt = Math.min(dt || 0, 0.05);
            g.clearRect(0, 0, W, H);
            g.fillStyle = "#fffdf2"; g.fillRect(0, 0, W, H);
            g.strokeStyle = "#1b2740"; g.lineWidth = 8; g.strokeRect(14, 14, W - 28, H - 28);
            g.fillStyle = "#bfe3ff"; g.fillRect(10, 90, 10, 150);
            // heater
            g.fillStyle = mix("c8ccd4", "ef6b4a", heatOn); g.fillRect(30, 340, 64, 110);
            g.strokeStyle = "#8a94a6"; g.lineWidth = 2; for (let x = 38; x < 94; x += 10) { g.beginPath(); g.moveTo(x, 344); g.lineTo(x, 446); g.stroke(); }
            label(g, "Heizung", 62, 326, "#1b2740", 19); label(g, "Fenster", 70, 76, "#5d6678", 19);
            for (const p of ps) {
              p.a += dt * 0.5 * (heatOn ? 1 : 0.25);
              const d = ((p.a - 0.62 * Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
              const tmp = heatOn * clamp(1 - d / (1.5 * Math.PI), 0, 1);
              const x = C.x + RX * p.r * Math.cos(p.a) + 4 * Math.sin(t * 2 + p.j), y = C.y + RY * p.r * Math.sin(p.a);
              g.fillStyle = heatOn ? heat(0.15 + tmp * 0.85) : "#9aa3b2"; g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill();
            }
            if (arrows > 0) {
              g.globalAlpha = arrows;
              arrow(g, 120, 300, 120, 160, "#e0322b", 6); arrow(g, 190, 70, 380, 70, "#e88a3a", 6); arrow(g, 480, 160, 480, 330, "#5b9be6", 6); arrow(g, 400, 430, 190, 430, "#5b9be6", 6);
              label(g, "warm", 160, 230, "#e0322b", 30, "left", 700, HAND); label(g, "kalt", 440, 245, "#2f6dd6", 30, "right", 700, HAND);
              g.globalAlpha = 1;
            }
          });
          const ex = box(s, "ex", "So heizt die Heizung", "Die Luft über der Heizung wird warm und <b>steigt auf</b>. Oben kühlt sie ab und <b>sinkt</b> wieder. So kreist die Luft durch das Zimmer.");
          const m = merk(s, "Warme Luft steigt auf, kalte Luft sinkt ab.");
          const life = box(s, "life", "Im Alltag", "Heizkörper im Zimmer · Wasser im Kochtopf wirbelt beim Erhitzen · Rauch steigt über dem Lagerfeuer nach oben");
          s.add(cols(s, canvas, stack(s, 16, P(s, "Bei der <b>Wärmeströmung</b> nimmt strömende Luft oder strömendes Wasser die Wärme mit."), ex, m, life)));
          s.show(canvas, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); await s.tween({ from: 0, to: 1, dur: 900, update: v => (heatOn = v) }); s.sfx.pop(); await s.show(ex, "up"); s.say("Die Heizung ist an. Die Luft fängt an zu kreisen."); });
          s.step(async () => { s.sfx.swoosh(); await s.tween({ from: 0, to: 1, dur: 600, update: v => (arrows = v) }); s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Wärmestrahlung",
        say: "Wärme kann auch als Strahlung reisen. So wärmt uns die Sonne und das Lagerfeuer.",
        build(s) {
          const W = 560, H = 460, F = { x: 100, y: 330 };
          const { canvas, g } = s.canvas(W, H);
          let kx = 330;
          const bar = s.h("i", { style: { display: "block", height: "100%", width: "50%", background: "linear-gradient(90deg,#f2c94c,#e0322b)", borderRadius: "10px" } });
          s.loop(t => {
            g.clearRect(0, 0, W, H);
            g.fillStyle = "#1e2438"; g.fillRect(0, 0, W, H);
            for (let i = 0; i < 30; i++) { g.fillStyle = "rgba(255,255,255,.5)"; g.fillRect((i * 97) % W, (i * 53) % 220, 2, 2); }
            g.fillStyle = "#33402c"; g.fillRect(0, 380, W, 80);
            // waves
            const I = clamp(Math.pow(130 / (kx - F.x), 2), 0, 1);
            for (let k = -2; k <= 2; k++) {
              const a = k * 0.16, len = kx - F.x - 40;
              g.globalAlpha = 0.85;
              wave(g, F.x + 30 * Math.cos(a), F.y - 30 + 30 * Math.sin(a), F.x + (len + 10) * Math.cos(a), F.y - 30 + (len + 10) * Math.sin(a), "#ff6b4a", t * 8, 6, 3);
            }
            g.globalAlpha = 1;
            // fire
            const fl = 1 + 0.1 * Math.sin(t * 9);
            g.fillStyle = "#8d5a2b"; g.save(); g.translate(F.x, F.y + 40); g.rotate(0.2); g.fillRect(-50, -8, 100, 16); g.rotate(-0.4); g.fillRect(-50, -8, 100, 16); g.restore();
            g.fillStyle = "#f07a1a"; g.beginPath(); g.moveTo(F.x - 34, F.y + 34); g.quadraticCurveTo(F.x - 40, F.y - 20 * fl, F.x, F.y - 70 * fl); g.quadraticCurveTo(F.x + 40, F.y - 20 * fl, F.x + 34, F.y + 34); g.fill();
            g.fillStyle = "#ffd23a"; g.beginPath(); g.moveTo(F.x - 16, F.y + 32); g.quadraticCurveTo(F.x - 18, F.y - 4, F.x, F.y - 34 * fl); g.quadraticCurveTo(F.x + 18, F.y - 4, F.x + 16, F.y + 32); g.fill();
            // kid (front faces the fire)
            const grd = g.createLinearGradient(kx - 22, 0, kx + 22, 0); grd.addColorStop(0, mix("8fb8e8", "ff6b4a", I)); grd.addColorStop(1, "#6f9fd8");
            g.fillStyle = grd; g.beginPath(); g.roundRect(kx - 22, 270, 44, 110, 18); g.fill();
            g.fillStyle = mix("f2c9a0", "ff8a6a", I); g.beginPath(); g.arc(kx, 248, 22, 0, 7); g.fill();
            g.fillStyle = "#111"; g.beginPath(); g.arc(kx - 10, 244, 3, 0, 7); g.fill();
            ring(g, kx, 300, 70);
            label(g, "vorne warm", kx - 30, 420, "#ffd0c4", 19, "center"); label(g, "hinten kalt", kx + 60, 444, "#bcd6f5", 19, "center");
            bar.style.width = Math.round(I * 100) + "%";
          });
          s.drag(canvas, { space: canvas, onStart: () => s.sfx.click(), onMove: p => { kx = clamp(p.x, 230, 470); } });
          const meter = s.h("div", { class: "card soft" }, s.h("p", { class: "small" }, s.h("b", null, "Wärme im Gesicht"), " – ziehe das Kind!"),
            s.h("div", { style: { height: "22px", background: "#fff", borderRadius: "10px", border: "2px solid #c8d3de", marginTop: "8px" } }, bar));
          const ex = box(s, "ex", "Die Sonne", "Zwischen Sonne und Erde ist fast leerer Raum – keine Luft. Trotzdem wärmt uns die Sonne: durch <b>Wärmestrahlung</b>.");
          const life = box(s, "life", "Im Alltag", "Lagerfeuer: vorne warm, hinten kalt · Sonne auf der Haut · Im Winter wärmt dich die Sonne, obwohl die Luft kalt ist");
          s.add(cols(s, canvas, stack(s, 16, P(s, "Wärme kann auch als <b>Wärmestrahlung</b> reisen – ganz ohne Stoff dazwischen."), meter, ex, life)));
          s.show(canvas, "zoom"); s.sfx.whoosh();
          s.step(async () => { s.sfx.swoosh(); await s.tween({ from: kx, to: 250, dur: 900, update: v => (kx = v) }); s.sfx.pop(); s.say("Nah am Feuer wird dir richtig warm."); await s.wait(300); await s.tween({ from: 250, to: 440, dur: 900, update: v => (kx = v) }); });
          s.step(async () => { s.sfx.ding(); await s.show(ex, "up"); s.say("Auch die Sonne wärmt uns durch Strahlung."); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Hell oder dunkel?",
        say: "Dunkle Flächen schlucken viel Licht und werden warm. Helle Flächen werfen viel Licht zurück.",
        build(s) {
          const svg = s.svg(540, 460);
          svg.append(s.el("rect", { x: 0, y: 0, width: 540, height: 460, rx: 18, fill: "#eef7ff" }), s.el("rect", { x: 0, y: 410, width: 540, height: 50, fill: "#d8c7a4" }), sunS(s, 270, 62, 34));
          const can = (x, fill, stroke) => s.el("g", {}, s.el("rect", { x, y: 260, width: 110, height: 150, rx: 10, fill, stroke, "stroke-width": 4 }), s.el("ellipse", { cx: x + 55, cy: 260, rx: 55, ry: 10, fill: "#7fb2e6", stroke, "stroke-width": 3 }));
          svg.append(can(70, "#1b1e27", "#1b1e27"), can(330, "#ffffff", "#9aa3b2"));
          const therm = (x) => { const col = s.el("rect", { x: x + 3, width: 10, rx: 4, fill: "#e0322b" }); s.el; return [s.el("rect", { x, y: 190, width: 16, height: 210, rx: 8, fill: "#fff", stroke: "#1b2740", "stroke-width": 3 }), col, s.el("circle", { cx: x + 8, cy: 404, r: 13, fill: "#e0322b", stroke: "#1b2740", "stroke-width": 3 })]; };
          const t1 = therm(195), t2 = therm(455);
          svg.append(...t1, ...t2, lbl(s, 125, 442, "schwarz"), lbl(s, 385, 442, "weiß"));
          const rays = [110, 150, 370, 410].map(x => s.el("line", { x1: 270 + (x - 270) * 0.25, y1: 110, x2: x, y2: 250, stroke: "#e8a400", "stroke-width": 4, "stroke-dasharray": "10 8" }));
          const refl = [370, 410].map(x => s.el("line", { x1: x, y1: 250, x2: x + 60, y2: 140, stroke: "#e8a400", "stroke-width": 4, "stroke-dasharray": "10 8", opacity: 0 }));
          const hot = s.el("rect", { x: 70, y: 260, width: 110, height: 150, rx: 10, fill: "#ff4a2a", opacity: 0 });
          svg.append(...rays, ...refl, hot);
          const res = s.el("text", { x: 125, y: 236, "text-anchor": "middle", class: "hlbl later", style: { fill: "#e0322b" }, text: "viel wärmer!" });
          svg.append(res);
          let tb = 0, tw = 0, run = false;
          s.loop((t, dt) => {
            dt = Math.min(dt || 0, 0.05);
            if (run) { tb = Math.min(1, tb + dt * 0.14); tw = Math.min(0.38, tw + dt * 0.05); }
            const set = ([, col], v) => { const h = 30 + v * 160; col.setAttribute("y", 396 - h); col.setAttribute("height", h); };
            set(t1, tb); set(t2, tw);
            rays.forEach(r => { r.setAttribute("stroke-dashoffset", run ? -t * 40 : 0); r.setAttribute("opacity", run ? 1 : 0.25); });
            refl.forEach(r => { r.setAttribute("stroke-dashoffset", -t * 40); r.setAttribute("opacity", run ? 0.9 : 0); });
            hot.setAttribute("opacity", tb * 0.35);
          });
          const btn = s.h("button", { class: "btn solid", onclick: () => { run = !run; btn.textContent = run ? "Sonne aus" : "Sonne an"; s.sfx.pop(); } }, "Sonne an");
          const again = s.h("button", { class: "btn", onclick: () => { tb = tw = 0; s.hide(res); s.sfx.click(); } }, "Neu starten");
          const ex = box(s, "ex", "Versuch", "Zwei gleiche Dosen mit Wasser in die Sonne stellen – eine schwarz, eine weiß. Nach einiger Zeit ist das Wasser in der <b>schwarzen</b> Dose wärmer.");
          const life = box(s, "life", "Im Alltag", "Schwarzes T-Shirt im Sommer: heiß! · Weiße Kleidung hält kühler · Eis auf schwarzem Papier schmilzt schneller");
          s.add(cols(s, svg, stack(s, 16, P(s, "Dunkle Flächen <b>absorbieren</b> (schlucken) viel Licht und werden warm. Helle Flächen <b>reflektieren</b> viel Licht."),
            s.h("div", { class: "row" }, btn, again), ex, life), 540));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { run = true; btn.textContent = "Sonne aus"; s.sfx.whoosh(); s.say("Die Sonne scheint auf beide Dosen."); await s.tween({ from: tb, to: 1, dur: 2500, update: v => { tb = v; tw = Math.min(0.38, v * 0.38); } }); s.sfx.ding(); await s.show(res, "pop"); });
          s.step(async () => { s.sfx.pop(); await s.show(ex, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Wärmedämmung",
        say: "Wärmedämmung bremst den Wärmetransport. Eingeschlossene Luft leitet Wärme schlecht.",
        build(s) {
          const W = 560, H = 460, X0 = 130, X1 = 430, Y0 = 200, Y1 = 410;
          const { canvas, g } = s.canvas(W, H);
          let ins = 0;
          const ps = Array.from({ length: 70 }, () => ({ x: X0 + 40 + Math.random() * 220, y: Y0 + 20 + Math.random() * 170, a: Math.random() * 6.28, out: false, life: 0 }));
          const lossEl = s.h("b", null, "groß");
          s.loop((t, dt) => {
            dt = Math.min(dt || 0, 0.05);
            g.clearRect(0, 0, W, H);
            const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, "#cfe3f7"); sky.addColorStop(1, "#f4f8fc"); g.fillStyle = sky; g.fillRect(0, 0, W, H);
            g.fillStyle = "#fff"; for (let i = 0; i < 40; i++) { const x = (i * 61 + t * 20) % W, y = (i * 37 + t * 40) % H; g.beginPath(); g.arc(x, y, 2.5, 0, 7); g.fill(); }
            g.fillStyle = "#e8edf2"; g.fillRect(0, Y1, W, H - Y1);
            const th = 6 + ins * 22;
            // insulation
            if (ins > 0) {
              g.fillStyle = "#ffd94a"; g.fillRect(X0 - th, Y0 - 4, th, Y1 - Y0 + 4); g.fillRect(X1, Y0 - 4, th, Y1 - Y0 + 4);
              g.beginPath(); g.moveTo(X0 - th - 20, Y0 - 4); g.lineTo((X0 + X1) / 2, 70 - th); g.lineTo(X1 + th + 20, Y0 - 4); g.lineTo(X1 + 20, Y0 - 4); g.lineTo((X0 + X1) / 2, 76); g.lineTo(X0 - 20, Y0 - 4); g.closePath(); g.fill();
            }
            // house
            g.fillStyle = "#fff6e8"; g.fillRect(X0, Y0, X1 - X0, Y1 - Y0);
            g.strokeStyle = "#9b4a2c"; g.lineWidth = 8; g.strokeRect(X0, Y0, X1 - X0, Y1 - Y0);
            g.fillStyle = "#b5563a"; g.beginPath(); g.moveTo(X0 - 20, Y0); g.lineTo((X0 + X1) / 2, 80); g.lineTo(X1 + 20, Y0); g.closePath(); g.fill();
            g.fillStyle = "#ef6b4a"; g.fillRect(X0 + 20, Y1 - 70, 50, 60);
            for (const p of ps) {
              p.a += (Math.random() - 0.5) * 1.5; const sp = 70;
              p.x += Math.cos(p.a) * sp * dt; p.y += Math.sin(p.a) * sp * dt;
              if (!p.out) {
                const hit = p.x < X0 + 8 || p.x > X1 - 8 || p.y < Y0 + 8 || p.y > Y1 - 8;
                if (hit) {
                  if (p.y < Y1 - 8 && Math.random() < 0.35 * (1 - ins) + 0.01) { p.out = true; p.life = 0; p.a = p.x < (X0 + X1) / 2 ? Math.PI : 0; if (p.y < Y0 + 8) p.a = -Math.PI / 2; }
                  else { p.x = clamp(p.x, X0 + 9, X1 - 9); p.y = clamp(p.y, Y0 + 9, Y1 - 9); p.a += Math.PI; }
                }
              } else { p.life += dt; if (p.life > 1.6 || p.x < 0 || p.x > W || p.y < 0) { p.out = false; p.x = X0 + 45; p.y = Y1 - 40; } }
              g.fillStyle = p.out ? `rgba(240,122,26,${1 - p.life / 1.6})` : "#e0322b"; g.beginPath(); g.arc(p.x, p.y, 5, 0, 7); g.fill();
            }
            lossEl.textContent = ins < 0.3 ? "groß" : ins < 0.7 ? "mittel" : "klein";
          });
          const sl = s.slider({ label: "Dämmung", min: 0, max: 10, value: 0, fmt: v => (v === 0 ? "keine" : v <= 5 ? "dünn" : "dick"), onInput: v => (ins = v / 10) });
          const card = s.h("div", { class: "card soft" }, s.h("p", { class: "h2" }, "Wärmeverlust: ", lossEl));
          const ex = box(s, "ex", "Haus", "Dämmplatten an Wänden und Dach halten im Winter die Wärme im Haus – und im Sommer die Hitze draußen.");
          const life = box(s, "life", "Im Alltag", "Winterjacke und Wollmütze: Luft zwischen den Fasern · Styroporbox hält Eis kalt · Zwei Paar Socken an kalten Tagen");
          s.add(cols(s, canvas, stack(s, 14, P(s, "<b>Wärmedämmung</b> bremst den Wärmetransport. Der Trick: eingeschlossene <b>Luft</b> leitet Wärme schlecht."), sl, card, ex, life)));
          s.show(canvas, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.swoosh(); await s.tween({ from: 0, to: 10, dur: 1400, update: v => { ins = v / 10; sl.input.value = v; } }); sl.set(10); s.sfx.ding(); await s.show(ex, "up"); s.say("Mit dicker Dämmung bleibt die Wärme im Haus."); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Thermoskanne und Eisbär",
        say: "Die Thermoskanne und der Eisbär sind Meister im Wärme-Festhalten.",
        build(s) {
          const svg = s.svg(380, 540);
          svg.append(s.el("rect", { x: 30, y: 80, width: 180, height: 430, rx: 30, fill: "#3e8e5a" }),
            s.el("rect", { x: 44, y: 94, width: 152, height: 402, rx: 22, fill: "#f7fbff", stroke: "#9aa3b2", "stroke-width": 2, "stroke-dasharray": "4 6" }),
            s.el("rect", { x: 58, y: 108, width: 124, height: 374, rx: 16, fill: "#c2793c", stroke: "#b0b8c4", "stroke-width": 7 }),
            s.el("rect", { x: 70, y: 40, width: 100, height: 60, rx: 10, fill: "#2b6b42" }));
          const heatW = [0, 1, 2].map(i => s.el("path", { fill: "none", stroke: "#ffd94a", "stroke-width": 4, "stroke-linecap": "round" }));
          svg.append(...heatW);
          const L = (y, ly, t1, t2, px) => s.el("g", { class: "later" }, s.el("line", { x1: px, y1: ly, x2: 222, y2: y - 6, stroke: "#5d6678", "stroke-width": 2 }),
            lbl(s, 228, y, t1, "start"), t2 ? lbl(s, 228, y + 24, t2, "start") : null);
          const l1 = L(70, 70, "Deckel", null, 170), l2 = L(200, 200, "Vakuum:", "fast luftleer", 50), l3 = L(330, 330, "Spiegel-", "schicht", 60);
          svg.append(l1, l2, l3, s.el("text", { x: 120, y: 300, "text-anchor": "middle", class: "lbl", style: { fill: "#fff" }, text: "Tee" }));
          s.loop(t => {
            heatW.forEach((p, i) => {
              const ph = (t * 0.5 + i * 0.37) % 1, tri = ph < 0.5 ? ph * 2 : 2 - ph * 2, c = 92 + 56 * tri, y = [170, 380, 440][i];
              let d = ""; for (let k = 0; k <= 16; k++) { const x = c - 24 + k * 3; d += (k ? " L" : "M") + x + "," + (y + 7 * Math.sin(k * 1.1 - t * 10)); }
              p.setAttribute("d", d);
            });
          });
          const bear = s.svg(130, 90);
          bear.append(s.el("ellipse", { cx: 60, cy: 55, rx: 46, ry: 26, fill: "#f4f1e8", stroke: "#9aa3b2", "stroke-width": 2 }), s.el("circle", { cx: 104, cy: 42, r: 18, fill: "#f4f1e8", stroke: "#9aa3b2", "stroke-width": 2 }),
            s.el("circle", { cx: 98, cy: 26, r: 6, fill: "#f4f1e8", stroke: "#9aa3b2", "stroke-width": 2 }), s.el("circle", { cx: 120, cy: 46, r: 4, fill: "#111" }), s.el("circle", { cx: 106, cy: 38, r: 2.5, fill: "#111" }),
            ...[30, 50, 74, 92].map(x => s.el("rect", { x: x - 6, y: 70, width: 12, height: 18, rx: 5, fill: "#f4f1e8", stroke: "#9aa3b2", "stroke-width": 2 })));
          const seal = s.svg(130, 90);
          seal.append(s.el("path", { d: "M10,70 Q30,30 80,36 Q110,38 118,58 Q100,74 60,74 Z", fill: "#7d8794" }), s.el("circle", { cx: 108, cy: 50, r: 3, fill: "#111" }),
            s.el("path", { d: "M10,70 L2,58 M10,70 L0,78", stroke: "#7d8794", "stroke-width": 6, "stroke-linecap": "round" }), s.el("rect", { x: 0, y: 76, width: 130, height: 14, fill: "#7fb2e6" }));
          const card = (title, html, pic, hidden) => s.h("div", { class: "card" + (hidden ? " later" : ""), style: { display: "flex", gap: "14px", alignItems: "center" } }, pic ? noShrink(pic) : null,
            s.h("div", null, s.h("p", { class: "h2", style: { fontSize: "25px", marginBottom: "4px" } }, title), s.h("p", { class: "small", html })));
          const c1 = card("Thermoskanne", "Zwischen den zwei Wänden ist fast keine Luft: kaum Wärmeleitung. Die Spiegelschicht wirft die Wärmestrahlung zurück. Tee bleibt heiß – Limo bleibt kalt.", null, false);
          const c2 = card("Eisbär", "Dichtes Fell mit Luft zwischen den Haaren und darunter eine bis zu <b>10 cm</b> dicke Fettschicht.", bear, true);
          const c3 = card("Robbe und Wal", "Eine dicke <b>Speckschicht</b> unter der Haut hält sie warm – sogar im eiskalten Wasser.", seal, true);
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "380px 1fr", alignItems: "center", height: "100%" } }, svg, stack(s, 16, c1, c2, c3)));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.pop(); await s.show(l2, "left"); s.sfx.pop(); await s.show(l3, "left"); s.show(l1, "left"); s.say("Das Vakuum und die Spiegelschicht halten die Wärme fest."); });
          s.step(async () => { s.sfx.boing(); await s.show(c2, "up"); s.say("Der Eisbär hat dichtes Fell und eine dicke Fettschicht."); });
          s.step(async () => { s.sfx.boing(); await s.show(c3, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Luft ist ein Stoff",
        say: "Luft kann man nicht sehen. Trotzdem braucht sie Platz und hat eine Masse.",
        build(s) {
          // glass experiment
          const a = s.svg(520, 260);
          const waterOut = s.el("rect", { x: 92, y: 150, width: 336, height: 100, fill: "#9fd3ff" });
          a.append(waterOut, s.el("path", { d: "M90,90 L90,252 L430,252 L430,90", fill: "none", stroke: "#5d6678", "stroke-width": 5 }));
          const glass = s.el("g", {}, s.el("rect", { x: 205, y: 0, width: 110, height: 120, fill: "rgba(255,255,255,.35)" }),
            s.el("path", { d: "M205,120 L205,0 L315,0 L315,120", fill: "none", stroke: "#4a87c5", "stroke-width": 5 }),
            s.el("path", { d: "M230,10 q15,-6 30,2 q20,-6 32,6 q4,16 -10,22 q-20,8 -36,0 q-20,-8 -16,-30 z", fill: "#fff", stroke: "#9aa3b2", "stroke-width": 2 }));
          const waterIn = s.el("rect", { x: 208, y: 0, width: 104, height: 0, fill: "#7fbfef" });
          const dry = s.el("text", { x: 400, y: 50, "text-anchor": "middle", class: "hlbl later", text: "Papier bleibt trocken!" });
          a.append(waterIn, glass, dry);
          let gy = 0;
          const updA = () => { glass.setAttribute("transform", `translate(0 ${gy})`); const sub = clamp(gy + 120 - 150, 0, 200); waterIn.setAttribute("y", gy + 120 - Math.min(sub, 14)); waterIn.setAttribute("height", Math.min(sub, 14)); waterOut.setAttribute("y", 150 - sub * 0.1); waterOut.setAttribute("height", 100 + sub * 0.1); };
          updA();
          // balance
          const b = s.svg(520, 260), PV = { x: 260, y: 80 };
          b.append(s.el("path", { d: "M230,250 L290,250 L260,90 Z", fill: "#8a94a6" }));
          const beam = s.el("line", { stroke: "#1b2740", "stroke-width": 8, "stroke-linecap": "round" });
          const panL = s.el("g", {}), panR = s.el("g", {});
          const ball = s.el("circle", { cx: 0, cy: -26, r: 24, fill: "#e07b2a", stroke: "#1b2740", "stroke-width": 3 });
          panL.append(s.el("line", { x1: 0, y1: -90, x2: 0, y2: -50, stroke: "#5d6678", "stroke-width": 2 }), s.el("path", { d: "M-50,0 Q0,16 50,0 Z", fill: "#c8d3de", stroke: "#5d6678", "stroke-width": 3 }), ball);
          panR.append(s.el("line", { x1: 0, y1: -90, x2: 0, y2: -22, stroke: "#5d6678", "stroke-width": 2 }), s.el("path", { d: "M-50,0 Q0,16 50,0 Z", fill: "#c8d3de", stroke: "#5d6678", "stroke-width": 3 }), s.el("rect", { x: -18, y: -22, width: 36, height: 22, rx: 3, fill: "#5d6678" }));
          b.append(beam, panL, panR, s.el("circle", { cx: PV.x, cy: PV.y, r: 7, fill: "#1b2740" }));
          let tilt = 0, br = 24;
          const updB = () => {
            const c = Math.cos(tilt * RAD), sn = Math.sin(tilt * RAD), L = 170;
            const l = { x: PV.x - L * c, y: PV.y - L * sn }, r = { x: PV.x + L * c, y: PV.y + L * sn };
            beam.setAttribute("x1", l.x); beam.setAttribute("y1", l.y); beam.setAttribute("x2", r.x); beam.setAttribute("y2", r.y);
            panL.setAttribute("transform", `translate(${l.x} ${l.y + 90})`); panR.setAttribute("transform", `translate(${r.x} ${r.y + 90})`);
            ball.setAttribute("r", br); ball.setAttribute("cy", -br - 2);
          };
          updB();
          const pump = s.h("button", { class: "btn later", style: { flex: "none", whiteSpace: "nowrap" }, onclick: async () => { s.sfx.whoosh(); await s.tween({ from: 0, to: 1, dur: 900, update: v => { br = 24 + 6 * v; tilt = -6 * v; updB(); } }); s.sfx.drum(); } }, "Ball aufpumpen");
          const tA = P(s, "<b>Luft braucht Platz.</b> Das Wasser kann nicht ins Glas, weil dort schon Luft ist.", "small");
          const tB = P(s, "<b>Luft hat Masse.</b> Der aufgepumpte Ball ist schwerer. 1 Liter Luft wiegt etwa <b>1,2 g</b>.", "small", true);
          const m = merk(s, "<b>Luftdruck</b>: Die Luft drückt von allen Seiten auf uns – auf Meereshöhe im Mittel mit <b>1013 hPa</b>.");
          const life = box(s, "life", "Im Alltag", "Fahrradreifen aufpumpen · Luftballon · Luftmatratze: Überall steckt Luft drin!");
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%" } },
            s.h("div", { class: "cols", style: { gap: "20px" } }, stack(s, 8, a, tA), stack(s, 8, b, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "12px", alignItems: "center" } }, pump, tB))),
            s.h("div", { class: "cols", style: { gap: "20px" } }, m, life)));
          s.show(a, "zoom"); s.show(b, "zoom", 150); s.sfx.pop();
          s.step(async () => { s.sfx.swoosh(); await s.tween({ from: 0, to: 120, dur: 1300, update: v => { gy = v; updA(); } }); s.sfx.ding(); await s.show(dry, "pop"); s.say("Das Papier im Glas bleibt trocken. Die Luft braucht Platz."); });
          s.step(async () => { s.show(pump, "pop"); await s.show(tB, "up"); s.sfx.whoosh(); await s.tween({ from: 0, to: 1, dur: 900, update: v => { br = 24 + 6 * v; tilt = -6 * v; updB(); } }); s.sfx.drum(); s.say("Der aufgepumpte Ball ist schwerer. Luft hat Masse."); });
          s.step(async () => { s.sfx.pop(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Warme Luft steigt auf",
        say: "Warme Luft dehnt sich aus und ist leichter als kalte Luft. Darum steigt ein Heißluftballon.",
        build(s) {
          const W = 560, H = 480;
          const { canvas, g } = s.canvas(W, H);
          let hb = 0, by = 300;
          const out = Array.from({ length: 110 }, () => ({ x: Math.random() * W, y: Math.random() * H, j: Math.random() * 6.28 }));
          const inn = Array.from({ length: 44 }, () => ({ u: Math.random() * 6.28, r: Math.sqrt(Math.random()), j: Math.random() * 6.28 }));
          s.loop((t, dt) => {
            dt = Math.min(dt || 0, 0.05);
            const target = 330 - hb * 200; by += (target - by) * Math.min(1, dt * 1.5);
            g.clearRect(0, 0, W, H);
            const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, "#9cc9ef"); sky.addColorStop(1, "#e9f4ff"); g.fillStyle = sky; g.fillRect(0, 0, W, H);
            g.fillStyle = "#7cbf5a"; g.fillRect(0, 440, W, 40);
            const cx = 280, cy = by - 70, rx = 100, ry = 110;
            for (const p of out) {
              const x = p.x + 3 * Math.sin(t * 2 + p.j), y = p.y + 3 * Math.cos(t * 2 + p.j);
              if (((x - cx) / (rx + 6)) ** 2 + ((y - cy) / (ry + 6)) ** 2 < 1) continue;
              g.fillStyle = "#3d6fae"; g.beginPath(); g.arc(x, y, 4.5, 0, 7); g.fill();
            }
            // envelope
            g.fillStyle = "rgba(224,123,42,.25)"; g.strokeStyle = "#c4621a"; g.lineWidth = 5;
            g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, 7); g.fill(); g.stroke();
            g.beginPath(); g.moveTo(cx - 40, cy + ry - 8); g.lineTo(cx - 24, by + 70); g.moveTo(cx + 40, cy + ry - 8); g.lineTo(cx + 24, by + 70); g.stroke();
            const n = Math.round(44 - hb * 22);
            for (let i = 0; i < n; i++) {
              const p = inn[i], j = 3 + hb * 9;
              const x = cx + (rx - 10) * p.r * Math.cos(p.u) + j * Math.sin(t * (4 + hb * 8) + p.j), y = cy + (ry - 10) * p.r * Math.sin(p.u) + j * Math.cos(t * (4 + hb * 8) + p.j * 1.3);
              g.fillStyle = heat(0.1 + hb * 0.9); g.beginPath(); g.arc(x, y, 4.5, 0, 7); g.fill();
            }
            // burner + basket
            if (hb > 0) { g.fillStyle = "#ffb020"; g.beginPath(); g.moveTo(cx - 9, by + 58); g.quadraticCurveTo(cx, by + 58 - 30 * hb - 6 * Math.sin(t * 20), cx + 9, by + 58); g.fill(); }
            g.fillStyle = "#8d5a2b"; g.fillRect(cx - 28, by + 70, 56, 36);
          });
          const sl = s.slider({ label: "Brenner", min: 0, max: 10, value: 0, fmt: v => (v === 0 ? "aus" : v <= 5 ? "klein" : "volle Flamme"), onInput: v => (hb = v / 10) });
          const ex = box(s, "ex", "Heißluftballon", "Der Brenner heizt die Luft in der Hülle. Die Luft dehnt sich aus, ein Teil entweicht. Die Hülle wird leichter – der Ballon steigt.");
          const life = box(s, "life", "Im Alltag", "Rauch über dem Lagerfeuer steigt auf · Unter der Zimmerdecke ist es wärmer als am Boden · Über der Heizung steigt warme Luft nach oben");
          s.add(cols(s, canvas, stack(s, 16, P(s, "Warme Luft <b>dehnt sich aus</b>. Sie ist leichter als gleich viel kalte Luft – darum steigt sie nach oben."), sl, ex, life)));
          s.show(canvas, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); await s.tween({ from: 0, to: 10, dur: 1500, update: v => { hb = v / 10; sl.input.value = v; } }); sl.set(10); s.sfx.pop(); await s.show(ex, "up"); s.say("Volle Flamme: Der Ballon steigt!"); });
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Wetter messen",
        say: "Das Wetter beschreiben wir mit sechs Wetterelementen. Für jedes gibt es ein Messgerät.",
        build(s) {
          const mk = (draw) => { const v = s.svg(120, 84); draw(v); return noShrink(v); };
          const anim = [];
          const items = [
            ["Temperatur", "Thermometer", "in Grad Celsius (°C)", v => {
              const col = s.el("rect", { x: 55, width: 10, rx: 4, fill: "#e0322b" });
              v.append(s.el("rect", { x: 52, y: 6, width: 16, height: 64, rx: 8, fill: "#fff", stroke: "#1b2740", "stroke-width": 3 }), col, s.el("circle", { cx: 60, cy: 72, r: 10, fill: "#e0322b", stroke: "#1b2740", "stroke-width": 3 }));
              anim.push(t => { const h = 30 + 14 * Math.sin(t * 1.5); col.setAttribute("y", 68 - h); col.setAttribute("height", h); });
            }],
            ["Luftdruck", "Barometer", "in Hektopascal (hPa)", v => {
              const nd = s.el("line", { x1: 60, y1: 46, x2: 60, y2: 14, stroke: "#e0322b", "stroke-width": 4, "stroke-linecap": "round" });
              v.append(s.el("circle", { cx: 60, cy: 46, r: 36, fill: "#fff", stroke: "#1b2740", "stroke-width": 4 }), ...[-60, -30, 0, 30, 60].map(a => s.el("line", { x1: 60 + 28 * Math.sin(a * RAD), y1: 46 - 28 * Math.cos(a * RAD), x2: 60 + 33 * Math.sin(a * RAD), y2: 46 - 33 * Math.cos(a * RAD), stroke: "#1b2740", "stroke-width": 3 })), nd, s.el("circle", { cx: 60, cy: 46, r: 4, fill: "#1b2740" }));
              anim.push(t => nd.setAttribute("transform", `rotate(${30 * Math.sin(t * 0.8)} 60 46)`));
            }],
            ["Wind", "Windmesser und Windfahne", "Stärke in km/h und Richtung", v => {
              const rot = s.el("g", {});
              for (let k = 0; k < 3; k++) { const a = k * 120 * RAD; rot.append(s.el("line", { x1: 40, y1: 30, x2: 40 + 26 * Math.cos(a), y2: 30 + 26 * Math.sin(a) * 0.5, stroke: "#1b2740", "stroke-width": 3 }), s.el("circle", { cx: 40 + 26 * Math.cos(a), cy: 30 + 26 * Math.sin(a) * 0.5, r: 7, fill: UC })); }
              v.append(s.el("line", { x1: 40, y1: 30, x2: 40, y2: 82, stroke: "#1b2740", "stroke-width": 4 }), rot, s.el("line", { x1: 92, y1: 34, x2: 92, y2: 82, stroke: "#1b2740", "stroke-width": 4 }), s.el("path", { d: "M78,34 L112,34 L118,26 L118,42 L112,34", fill: "#e0322b", stroke: "#1b2740", "stroke-width": 2 }));
              anim.push(t => rot.setAttribute("transform", `translate(40 30) scale(${Math.cos(t * 6)} 1) translate(-40 -30)`));
            }],
            ["Niederschlag", "Regenmesser", "in mm: 1 mm = 1 Liter pro m²", v => {
              const w = s.el("rect", { x: 46, width: 28, fill: "#7fbfef" });
              const drops = [0, 1, 2].map(k => s.el("line", { x1: 50 + k * 10, x2: 48 + k * 10, stroke: "#2f6dd6", "stroke-width": 3, "stroke-linecap": "round" }));
              v.append(w, s.el("path", { d: "M34,22 L86,22 L74,34 L74,82 L46,82 L46,34 Z", fill: "none", stroke: "#1b2740", "stroke-width": 3 }), ...drops);
              anim.push(t => { const h = 8 + ((t * 6) % 40); w.setAttribute("y", 82 - h); w.setAttribute("height", h); drops.forEach((d, k) => { const y = ((t * 40 + k * 7) % 20); d.setAttribute("y1", y); d.setAttribute("y2", y + 6); }); });
            }],
            ["Bewölkung", "Beobachten mit den Augen", "in Achteln: 0/8 wolkenlos bis 8/8 bedeckt", v => {
              const pie = s.el("path", { fill: "#8a94a6" });
              v.append(s.el("circle", { cx: 60, cy: 44, r: 34, fill: "#bfe3ff", stroke: "#1b2740", "stroke-width": 3 }), pie);
              anim.push(t => { const k = Math.floor((t * 1.2) % 9), a = k / 8 * 2 * Math.PI; pie.setAttribute("d", k === 0 ? "" : k === 8 ? "M60,10 A34,34 0 1 1 59.9,10 Z" : `M60,44 L60,10 A34,34 0 ${a > Math.PI ? 1 : 0} 1 ${60 + 34 * Math.sin(a)},${44 - 34 * Math.cos(a)} Z`); });
            }],
            ["Luftfeuchte", "Hygrometer", "in Prozent (%)", v => {
              const nd = s.el("line", { x1: 60, y1: 70, x2: 60, y2: 24, stroke: "#2f6dd6", "stroke-width": 4, "stroke-linecap": "round" });
              v.append(s.el("path", { d: "M14,70 A46,46 0 0 1 106,70 Z", fill: "#fff", stroke: "#1b2740", "stroke-width": 3 }), s.el("path", { d: "M60,30 q-8,12 0,18 q8,-6 0,-18 z", fill: "#7fbfef" }), nd, s.el("circle", { cx: 60, cy: 70, r: 4, fill: "#1b2740" }));
              anim.push(t => nd.setAttribute("transform", `rotate(${40 * Math.sin(t * 0.7)} 60 70)`));
            }],
          ];
          const cards = items.map(([t, dev, unit, d]) => s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "4px" } },
            s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "12px" } }, mk(d), s.h("p", { class: "h2", style: { fontSize: "26px" } }, t)),
            s.h("p", { class: "small", html: `<b>Messgerät:</b> ${dev}` }), s.h("p", { class: "small pencil" }, unit)));
          s.loop(t => anim.forEach(f => f(t)));
          s.add(s.h("div", { class: "cols3", style: { gridTemplateRows: "1fr 1fr", height: "100%", gap: "18px 20px" } }, ...cards));
          s.sfx.whoosh(); s.show(cards[0], "pop"); s.show(cards[1], "pop", 150);
          s.step(async () => { s.sfx.pop(); s.show(cards[2], "pop"); await s.show(cards[3], "pop", 150); s.say("Wind und Niederschlag."); });
          s.step(async () => { s.sfx.pop(); s.show(cards[4], "pop"); await s.show(cards[5], "pop", 150); s.sfx.success(); s.say("Bewölkung und Luftfeuchte."); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Der Wasserkreislauf",
        say: "Das Wasser auf der Erde ist immer unterwegs – im Kreis.",
        build(s) {
          const svg = s.svg(600, 540);
          svg.append(s.el("rect", { x: 0, y: 0, width: 600, height: 540, rx: 18, fill: "#e6f3ff" }), sunS(s, 70, 70, 34),
            s.el("path", { d: "M0,380 L260,380 L260,540 L0,540 Z", fill: "#3f86c7" }),
            s.el("path", { d: "M250,380 L330,330 L480,170 L560,220 L600,250 L600,540 L250,540 Z", fill: "#8fbf6a" }),
            s.el("path", { d: "M250,445 L600,445 L600,540 L250,540 Z", fill: "#a77d55" }),
            s.el("path", { d: "M450,200 L480,170 L515,192 Z", fill: "#fff" }));
          for (let x = 10; x < 250; x += 40) svg.append(s.el("path", { d: `M${x},392 q10,-8 20,0`, fill: "none", stroke: "#bfe3ff", "stroke-width": 3 }));
          const gw = s.el("path", { d: "M250,490 L600,490 L600,540 L250,540 Z", fill: "#5b9be6", class: "later" });
          svg.append(gw, s.el("text", { x: 70, y: 470, "text-anchor": "middle", class: "lbl", style: { fill: "#fff" }, text: "Meer" }));
          const vap = Array.from({ length: 12 }, (_, i) => s.el("circle", { r: 5, fill: "#ffffff", stroke: "#7fbfef", "stroke-width": 2, opacity: 0 }));
          const cloud = s.el("g", { class: "later" }, cloudS(s, 390, 120, 1.3, "#ffffff"));
          const rain = Array.from({ length: 12 }, () => s.el("line", { stroke: "#2f6dd6", "stroke-width": 3, "stroke-linecap": "round", opacity: 0 }));
          const seep = Array.from({ length: 10 }, () => s.el("circle", { r: 5, fill: "#2f6dd6", opacity: 0 }));
          const river = s.el("path", { d: "M470,200 C440,260 420,250 380,300 C350,340 300,350 262,384", fill: "none", stroke: "#2f6dd6", "stroke-width": 9, "stroke-linecap": "round", class: "later" });
          const riverFlow = s.el("path", { d: "M470,200 C440,260 420,250 380,300 C350,340 300,350 262,384", fill: "none", stroke: "#bfe3ff", "stroke-width": 3, "stroke-dasharray": "8 14", opacity: 0 });
          svg.append(...vap, cloud, ...rain, ...seep, river, riverFlow);
          const L = (x, y, t, col = "#1d5bd0") => s.el("text", { x, y, "text-anchor": "middle", class: "hlbl later", style: { fill: col }, text: t });
          const labs = [L(130, 250, "Verdunstung"), L(390, 44, "Kondensation"), L(250, 300, "Niederschlag"), L(430, 425, "Versickern", "#fff"), L(355, 260, "Abfluss")];
          labs[4].setAttribute("x", 300); labs[4].setAttribute("y", 300);
          labs[2].setAttribute("x", 480); labs[2].setAttribute("y", 318);
          svg.append(...labs, s.el("text", { x: 425, y: 525, "text-anchor": "middle", class: "lbl later", style: { fill: "#fff" }, text: "Grundwasser" }));
          const gwLbl = svg.lastChild;
          const on = [0, 0, 0, 0, 0];
          s.loop(t => {
            vap.forEach((c, i) => { const u = (t * 0.25 + i / 12) % 1, x = 30 + (i * 37) % 210 + 120 * u * u; c.setAttribute("cx", x); c.setAttribute("cy", 375 - u * 230); c.setAttribute("opacity", on[0] * Math.sin(Math.PI * u)); });
            rain.forEach((r, i) => { const u = (t * 0.9 + i / 12) % 1, x = 345 + (i * 23) % 120, y = 150 + u * 120; r.setAttribute("x1", x); r.setAttribute("y1", y); r.setAttribute("x2", x - 4); r.setAttribute("y2", y + 14); r.setAttribute("opacity", on[2] * 0.9); });
            seep.forEach((c, i) => { const u = (t * 0.3 + i / 10) % 1, x = 330 + (i * 29) % 240 - (u > 0.6 ? (u - 0.6) * 150 : 0), y = 300 + Math.min(u, 0.6) / 0.6 * 205; c.setAttribute("cx", x); c.setAttribute("cy", y); c.setAttribute("opacity", on[3] * Math.sin(Math.PI * u)); });
            riverFlow.setAttribute("stroke-dashoffset", -t * 40); riverFlow.setAttribute("opacity", on[4]);
          });
          const rows = [["1", "Verdunstung", "Die Sonne erwärmt das Wasser. Es wird zu unsichtbarem <b>Wasserdampf</b> und steigt auf."],
            ["2", "Kondensation", "Oben ist es kalt. Der Dampf wird zu winzigen Tröpfchen: Eine <b>Wolke</b> entsteht."],
            ["3", "Niederschlag", "Die Tropfen werden schwer und fallen als <b>Regen</b>, Schnee oder Hagel."],
            ["4", "Versickern", "Ein Teil sickert in den Boden und wird zu <b>Grundwasser</b>."],
            ["5", "Abfluss", "Der Rest fließt in Bäche und Flüsse – und zurück ins <b>Meer</b>."]].map(([n, t, d], i) =>
            s.h("div", { class: "row" + (i ? " later" : ""), style: { flexWrap: "nowrap", gap: "12px", alignItems: "flex-start" } },
              s.h("span", { style: { flex: "none", width: "38px", height: "38px", borderRadius: "50%", background: UC, color: "#fff", display: "grid", placeItems: "center", font: "700 21px var(--f-display)" } }, n),
              s.h("p", { class: "small", html: `<b>${t}</b>: ${d}` })));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "600px 1fr", gap: "24px", alignItems: "center", height: "100%" } }, svg, stack(s, 14, ...rows)));
          s.show(svg, "zoom"); s.sfx.pop();
          on[0] = 1; s.show(labs[0], "fade");
          s.step(async () => { s.sfx.whoosh(); await s.show(cloud, "zoom"); on[1] = 1; s.show(labs[1], "fade"); await s.show(rows[1], "left"); s.say("Kondensation: Eine Wolke entsteht."); });
          s.step(async () => { on[2] = 1; s.sfx.scribble(); s.show(labs[2], "fade"); await s.show(rows[2], "left"); s.say("Niederschlag: Es regnet."); });
          s.step(async () => { on[3] = 1; s.sfx.pop(); s.show(gw, "fade"); s.show([labs[3], gwLbl], "fade"); await s.show(rows[3], "left"); s.say("Das Wasser versickert und wird zu Grundwasser."); });
          s.step(async () => { s.sfx.swoosh(); await s.show(river, "draw"); on[4] = 1; s.show(labs[4], "fade"); await s.show(rows[4], "left"); s.sfx.success(); s.say("Über die Flüsse fließt das Wasser zurück ins Meer. Der Kreis ist geschlossen."); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Von Berlin bis zur Nordsee",
        say: "Regen, der in Berlin fällt, fließt über Spree, Havel und Elbe bis in die Nordsee.",
        build(s) {
          const svg = s.svg(540, 520);
          svg.append(s.el("rect", { x: 0, y: 0, width: 540, height: 520, rx: 18, fill: "#f1f6e9" }),
            s.el("path", { d: "M0,0 L190,0 C170,60 150,110 120,150 C80,170 40,180 0,190 Z", fill: "#3f86c7" }),
            s.el("text", { x: 70, y: 70, "text-anchor": "middle", class: "lbl", style: { fill: "#fff" }, text: "Nordsee" }));
          const route = "M500,440 C480,410 470,395 440,385 C420,380 400,380 380,378 C370,410 360,440 330,450 C290,460 260,440 250,400 C245,360 260,330 270,300 C240,260 220,220 190,190 C170,170 150,155 130,145";
          const elbeUp = s.el("path", { d: "M270,300 C300,330 330,360 350,420 C360,460 380,490 400,520", fill: "none", stroke: "#7fb2e6", "stroke-width": 7, "stroke-linecap": "round" });
          const path = s.el("path", { d: route, fill: "none", stroke: "#2f6dd6", "stroke-width": 8, "stroke-linecap": "round", "stroke-linejoin": "round" });
          svg.append(path);
          const city = (x, y, t, dx, dy, anchor = "start", big = false) => s.el("g", {}, s.el("circle", { cx: x, cy: y, r: big ? 12 : 8, fill: big ? "#e0322b" : "#1b2740", stroke: "#fff", "stroke-width": 3 }),
            s.el("text", { x: x + dx, y: y + dy, "text-anchor": anchor, class: "lbl", text: t }));
          svg.append(city(440, 385, "Berlin", 0, -24, "middle", true), city(380, 378, "Spandau", -6, -18, "end"), city(270, 300, "Havelberg", 16, 6), city(130, 145, "Cuxhaven", 16, 18));
          const river = (x, y, t) => s.el("text", { x, y, "text-anchor": "middle", class: "hlbl", text: t });
          svg.append(river(505, 480, "Spree"), river(410, 455, "Havel"), river(185, 245, "Elbe"));
          const drop = s.el("path", { d: "M0,-14 C-9,0 -9,10 0,10 C9,10 9,0 0,-14 Z", fill: "#5bb2ff", stroke: "#1d5bd0", "stroke-width": 2, class: "later" });
          svg.append(drop);
          const len = path.getTotalLength ? path.getTotalLength() : 800;
          let moving = false;
          s.loop(t => {
            const u = moving ? (t * 0.12) % 1 : 0;
            try { const p = path.getPointAtLength(u * len); drop.setAttribute("transform", `translate(${p.x} ${p.y})`); } catch (e) { }
          });
          const chain = [["Spree", "fließt durch Berlin"], ["Havel", "nimmt die Spree in <b>Spandau</b> auf"], ["Elbe", "nimmt die Havel bei <b>Havelberg</b> auf"], ["Nordsee", "Die Elbe mündet bei <b>Cuxhaven</b>"]]
            .map(([a, b], i) => s.h("div", { class: "row" + (i ? " later" : ""), style: { flexWrap: "nowrap", gap: "12px" } }, s.h("span", { class: "chip", style: { flex: "none", minWidth: "104px", justifyContent: "center" } }, a), s.h("p", { class: "small", html: b })));
          const life = box(s, "life", "Wasserkreislauf zu Hause", "Der Badspiegel beschlägt nach dem Duschen: Dampf <b>kondensiert</b> am kalten Glas · Pfützen trocknen in der Sonne: Wasser <b>verdunstet</b> · Nasse Wäsche trocknet auf der Leine");
          s.add(cols(s, svg, stack(s, 14, P(s, "Ein Regentropfen in Berlin kann bis ins Meer reisen:"), ...chain, life), 540));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { moving = true; s.show(drop, "pop"); s.sfx.whoosh(); for (let i = 1; i < 4; i++) { s.sfx.count(i); await s.show(chain[i], "left"); } s.say("Spree, Havel, Elbe, Nordsee."); });
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Der Treibhauseffekt",
        say: "Die Lufthülle wirkt wie eine Decke. Treibhausgase halten Wärme auf der Erde zurück.",
        build(s) {
          const W = 560, H = 500, AT = 150, GR = 430;
          const { canvas, g } = s.canvas(W, H);
          let lvl = 1;
          const pRet = [0, 0.5, 0.78];
          const mols = Array.from({ length: 26 }, (_, i) => ({ x: 20 + ((i * 83) % 520), y: AT - 24 + ((i * 5) % 7) * 8, j: i }));
          const ph = [];
          let spawn = 0, glowV = 0.5;
          for (let k = 0; k < 7; k++) { const x = 140 + k * 55, u = (k * 0.37) % 1; ph.push({ x: 75 + (x - 75) * u, y: 60 + (GR - 60) * u, vx: (x - 75) / 2.2, vy: (GR - 60) / 2.2, ir: false, tested: false, age: 0 }); }
          for (let k = 0; k < 6; k++) { const a = (-90 + (k - 2.5) * 12) * RAD; ph.push({ x: 160 + k * 60, y: GR - 40 - k * 40, vx: Math.cos(a) * 150, vy: Math.sin(a) * 150, ir: true, tested: false, age: 0 }); }
          const readout = s.h("p", { class: "t", html: "" });
          const texts = ["Ohne Treibhausgase: im Mittel etwa <b>−18 °C</b>. Alles wäre vereist.", "Mit natürlichem Treibhauseffekt: im Mittel etwa <b>+15 °C</b>.", "Mehr CO₂: Mehr Wärme bleibt da. Es wird wärmer – <b>Klimawandel</b>."];
          const setL = v => { lvl = v; readout.innerHTML = texts[v]; };
          setL(1);
          s.loop((t, dt) => {
            dt = Math.min(dt || 0, 0.05);
            spawn += dt; if (spawn > 0.32) { spawn = 0; const x = 140 + Math.random() * 380; ph.push({ x: 60 + Math.random() * 30, y: 60, tx: x, vx: (x - 75) / 2.2, vy: (GR - 60) / 2.2, ir: false, tested: false, age: 0 }); }
            glowV += ((lvl === 0 ? 0.15 : lvl === 1 ? 0.5 : 0.95) - glowV) * Math.min(1, dt * 1.5);
            g.clearRect(0, 0, W, H);
            const sky = g.createLinearGradient(0, 0, 0, GR); sky.addColorStop(0, "#141a33"); sky.addColorStop(AT / GR, "#33416b"); sky.addColorStop(1, "#9cc9ef"); g.fillStyle = sky; g.fillRect(0, 0, W, GR);
            g.fillStyle = "rgba(180,220,255,.18)"; g.fillRect(0, AT - 32, W, 64);
            label(g, "Lufthülle mit Treibhausgasen", W - 12, AT - 46, "#dbe7ff", 19, "right");
            label(g, "Weltall", W - 12, 24, "#dbe7ff", 19, "right");
            const nm = lvl === 0 ? 0 : lvl === 1 ? 10 : 26;
            for (let i = 0; i < nm; i++) { const m = mols[i], x = m.x + 4 * Math.sin(t + m.j), y = m.y + 3 * Math.cos(t * 1.3 + m.j); g.fillStyle = "#c9d1e0"; g.beginPath(); g.arc(x - 9, y, 5, 0, 7); g.arc(x + 9, y, 5, 0, 7); g.fill(); g.fillStyle = "#3a3f4b"; g.beginPath(); g.arc(x, y, 6, 0, 7); g.fill(); }
            const gg = g.createLinearGradient(0, GR, 0, H); gg.addColorStop(0, mix("7cbf5a", "e8763a", glowV)); gg.addColorStop(1, mix("5d9a3f", "b5412a", glowV)); g.fillStyle = gg; g.fillRect(0, GR, W, H - GR);
            sunC(g, 75, 60, 30, t);
            for (let i = ph.length - 1; i >= 0; i--) {
              const p = ph[i]; p.age += dt; p.x += p.vx * dt; p.y += p.vy * dt;
              if (!p.ir && p.y >= GR) { p.ir = true; p.tested = false; p.y = GR - 1; const a = (-90 + (Math.random() - 0.5) * 70) * RAD; p.vx = Math.cos(a) * 150; p.vy = Math.sin(a) * 150; }
              else if (p.ir && p.vy < 0 && !p.tested && p.y <= AT) { p.tested = true; if (Math.random() < pRet[lvl]) { p.vy = -p.vy; } }
              else if (p.ir && p.vy > 0 && p.y >= GR) { p.vy = -p.vy; p.y = GR - 1; p.tested = false; }
              if (p.y < -10 || p.x < -10 || p.x > W + 10 || p.age > 14) { ph.splice(i, 1); continue; }
              if (!p.ir) { g.fillStyle = "#ffe14a"; g.beginPath(); g.arc(p.x, p.y, 5, 0, 7); g.fill(); }
              else { const l = Math.hypot(p.vx, p.vy); wave(g, p.x - p.vx / l * 26, p.y - p.vy / l * 26, p.x, p.y, "#ff5a3a", t * 10, 4, 3); }
            }
          });
          const sl = s.slider({ label: "Treibhausgase", min: 0, max: 2, value: 1, fmt: v => ["keine", "natürlich", "zu viele"][v], onInput: v => setL(v) });
          const card = s.h("div", { class: "card soft" }, readout);
          const leg = P(s, "<b style='color:#c9a400'>gelb</b> = Sonnenlicht · <b style='color:#e0322b'>rot</b> = Wärmestrahlung der Erde", "small");
          const m = merk(s, "Von einer Million Luftteilchen waren früher etwa <b>280</b> CO₂, heute sind es über <b>420</b>. Das CO₂ kommt vor allem aus Auto, Kraftwerk und Heizung.");
          s.add(cols(s, canvas, stack(s, 14, P(s, "Die Lufthülle wirkt wie eine <b>Decke</b>: <b>Treibhausgase</b> wie Wasserdampf und Kohlenstoffdioxid (CO₂) halten Wärme zurück."), leg, sl, card, m)));
          s.show(canvas, "zoom"); s.sfx.whoosh();
          s.step(async () => { sl.set(0); s.sfx.boing(); s.say("Ohne Treibhausgase wäre es auf der Erde eisig kalt, etwa minus achtzehn Grad."); });
          s.step(async () => { sl.set(1); s.sfx.chord([0, 4, 7]); s.say("Mit dem natürlichen Treibhauseffekt sind es etwa plus fünfzehn Grad."); });
          s.step(async () => { sl.set(2); s.sfx.zap(); s.say("Zu viel CO₂ hält zu viel Wärme fest. Das Klima wird wärmer."); await s.show(m, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Was kannst du tun?",
        say: "Jeder kann etwas für das Klima tun. Hier sind sechs Ideen.",
        build(s) {
          const ic = (draw) => { const v = s.svg(110, 70); v.style.width = "130px"; v.style.height = "83px"; draw(v); return v; };
          const items = [
            ["Rad, Füße, BVG", "Autos verbrennen Benzin oder Diesel, dabei entsteht CO₂. Fahrrad, zu Fuß oder U-Bahn sind besser.", v => v.append(
              s.el("circle", { cx: 28, cy: 46, r: 18, fill: "none", stroke: "#1b2740", "stroke-width": 4 }), s.el("circle", { cx: 82, cy: 46, r: 18, fill: "none", stroke: "#1b2740", "stroke-width": 4 }),
              s.el("path", { d: "M28,46 L48,22 L74,22 L82,46 M48,22 L56,46 L74,22", fill: "none", stroke: UC, "stroke-width": 4 }))],
            ["Licht aus", "Strom wird oft noch in Kraftwerken mit Kohle oder Gas gemacht. Licht und Geräte aus, wenn du gehst!", v => v.append(
              s.el("circle", { cx: 55, cy: 30, r: 20, fill: "#eee", stroke: "#1b2740", "stroke-width": 3 }), s.el("rect", { x: 46, y: 48, width: 18, height: 12, fill: "#8d8d8d" }), s.el("path", { d: "M20,66 L90,4", stroke: "#e0322b", "stroke-width": 5 }))],
            ["Stoßlüften", "Im Winter das Fenster kurz ganz öffnen statt lange kippen. So geht weniger Heizwärme verloren.", v => v.append(
              s.el("rect", { x: 25, y: 6, width: 60, height: 60, fill: "#bfe3ff", stroke: "#1b2740", "stroke-width": 4 }), s.el("line", { x1: 55, y1: 6, x2: 55, y2: 66, stroke: "#1b2740", "stroke-width": 4 }), s.el("path", { d: "M90,36 q8,-6 16,0", fill: "none", stroke: "#2f6dd6", "stroke-width": 3 }))],
            ["Pulli statt Heizung", "Ist dir kalt, zieh erst einen Pulli an. Weniger heizen spart Energie.", v => v.append(
              s.el("path", { d: "M30,10 L45,4 Q55,14 65,4 L80,10 L100,30 L88,40 L80,32 L80,66 L30,66 L30,32 L22,40 L10,30 Z", fill: UC }))],
            ["Bäume und Grün", "Pflanzen nehmen bei der Fotosynthese CO₂ aus der Luft auf. Bäume in der Stadt kühlen auch.", v => v.append(
              s.el("rect", { x: 50, y: 40, width: 12, height: 30, fill: "#7a4a22" }), s.el("circle", { cx: 56, cy: 30, r: 26, fill: "#3a9a3a" }))],
            ["Reparieren", "Jedes neue Ding braucht Energie, bis es fertig ist. Reparieren, tauschen und weitergeben hilft.", v => v.append(
              s.el("path", { d: "M20,60 L60,20 M60,20 q10,-14 24,-6 l-12,12 l4,8 l8,4 l12,-12 q8,14 -6,24 q-12,4 -20,-4", fill: "none", stroke: "#1b2740", "stroke-width": 5, "stroke-linecap": "round" }))],
          ];
          const cards = items.map(([t, txt, d]) => s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "6px" } }, ic(d), s.h("p", { class: "h2", style: { fontSize: "25px" } }, t), s.h("p", { class: "small", html: txt })));
          s.add(s.h("div", { class: "cols3", style: { gridTemplateRows: "1fr 1fr", height: "100%", gap: "18px 20px" } }, ...cards));
          s.sfx.whoosh(); s.show(cards[0], "pop"); s.show(cards[1], "pop", 150);
          s.step(async () => { s.sfx.pop(); s.show(cards[2], "pop"); await s.show(cards[3], "pop", 150); s.say("Richtig lüften und lieber einen Pulli anziehen."); });
          s.step(async () => { s.sfx.pop(); s.show(cards[4], "pop"); await s.show(cards[5], "pop", 150); s.sfx.success(); s.say("Grün in der Stadt und Dinge reparieren."); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Im Alltag: Wärme und Wetter",
        say: "Wärme und Wetter erlebst du jeden Tag – in der Stadt, im Bad und auf dem Handy.",
        build(s) {
          const ic = (draw) => { const v = s.svg(110, 70); v.style.width = "130px"; v.style.height = "83px"; draw(v); return v; };
          const items = [
            ["Stadt und Umland", "In Berlin kann es im Sommer in der Innenstadt über 11 °C wärmer sein als im Umland – vor allem nachts. Parks kühlen.", v => v.append(
              s.el("rect", { x: 6, y: 20, width: 22, height: 48, fill: "#8a94a6" }), s.el("rect", { x: 30, y: 8, width: 20, height: 60, fill: "#5d6678" }), s.el("rect", { x: 52, y: 28, width: 16, height: 40, fill: "#8a94a6" }),
              s.el("circle", { cx: 92, cy: 40, r: 16, fill: "#3a9a3a" }), s.el("rect", { x: 89, y: 52, width: 6, height: 16, fill: "#7a4a22" }))],
            ["Schwitzen kühlt", "Schweiß verdunstet auf der Haut und nimmt dabei Wärme mit: <b>Verdunstungskälte</b>. Wind hilft noch mehr.", v => v.append(
              s.el("circle", { cx: 55, cy: 38, r: 28, fill: "#f2c9a0", stroke: "#1b2740", "stroke-width": 3 }), s.el("path", { d: "M80,20 q-6,10 0,14 q6,-4 0,-14 z M88,40 q-5,8 0,11 q5,-3 0,-11 z", fill: "#7fbfef" }),
              s.el("circle", { cx: 46, cy: 34, r: 3, fill: "#111" }), s.el("circle", { cx: 64, cy: 34, r: 3, fill: "#111" }), s.el("path", { d: "M46,48 q9,6 18,0", fill: "none", stroke: "#111", "stroke-width": 3 }))],
            ["Beschlagener Spiegel", "Nach dem Duschen kondensiert der warme Wasserdampf am kalten Spiegel zu winzigen Tröpfchen.", v => v.append(
              s.el("rect", { x: 25, y: 4, width: 60, height: 62, rx: 8, fill: "#dfe8ef", stroke: "#1b2740", "stroke-width": 3 }), ...[[40, 20], [60, 30], [48, 46], [70, 52], [36, 56], [72, 14]].map(([x, y]) => s.el("circle", { cx: x, cy: y, r: 3, fill: "#9fb6c9" })))],
            ["Wetter-App", "Sonne, Wolke, Regentropfen, Blitz – dazu die Temperatur in °C. Die App zeigt die Wetterelemente als Bilder.", v => v.append(
              s.el("circle", { cx: 18, cy: 22, r: 11, fill: "#ffc928" }), cloudS(s, 70, 22, 0.42, "#e6ebf1"),
              s.el("path", { d: "M14,50 q-5,8 0,11 q5,-3 0,-11 z M26,50 q-5,8 0,11 q5,-3 0,-11 z", fill: "#2f6dd6" }), s.el("path", { d: "M70,42 L60,58 L70,58 L62,70 L82,52 L72,52 L78,42 Z", fill: "#f2c400", stroke: "#1b2740", "stroke-width": 1.5 }))],
            ["Pfützen verschwinden", "Nach dem Regen scheint die Sonne – das Wasser der Pfütze verdunstet und steigt als Dampf in die Luft.", v => v.append(
              s.el("ellipse", { cx: 55, cy: 56, rx: 46, ry: 10, fill: "#7fbfef" }), s.el("path", { d: "M40,40 q-6,-8 0,-16 q6,-8 0,-16 M60,40 q-6,-8 0,-16 q6,-8 0,-16", fill: "none", stroke: "#9aa3b2", "stroke-width": 3 }))],
            ["Kalte Hände", "Im Winter wärmt eine Tasse Tee die Hände: Wärme fließt vom heißen Tee in die kalten Finger.", v => v.append(
              s.el("path", { d: "M30,20 L36,66 L74,66 L80,20 Z", fill: "#fff", stroke: "#1b2740", "stroke-width": 3 }), s.el("path", { d: "M80,30 q16,4 10,20 q-4,8 -14,8", fill: "none", stroke: "#1b2740", "stroke-width": 3 }),
              s.el("path", { d: "M44,14 q-5,-6 0,-12 M58,14 q-5,-6 0,-12", fill: "none", stroke: "#e0322b", "stroke-width": 3 }))],
          ];
          const cards = items.map(([t, txt, d]) => s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "6px" } }, ic(d), s.h("p", { class: "h2", style: { fontSize: "25px" } }, t), s.h("p", { class: "small", html: txt })));
          s.add(s.h("div", { class: "cols3", style: { gridTemplateRows: "1fr 1fr", height: "100%", gap: "18px 20px" } }, ...cards));
          s.sfx.whoosh(); s.show(cards[0], "pop"); s.show(cards[1], "pop", 150);
          s.step(async () => { s.sfx.pop(); s.show(cards[2], "pop"); await s.show(cards[3], "pop", 150); s.say("Der Spiegel beschlägt, und die Wetter-App zeigt Bilder."); });
          s.step(async () => { s.sfx.pop(); s.show(cards[4], "pop"); await s.show(cards[5], "pop", 150); s.sfx.fanfare(); s.say("Super! Jetzt kennst du Sonne, Wärme und Wetter."); });
        },
      },
    ],
  });
})();
