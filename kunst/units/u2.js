/* Kapitel 2 – Farbkontraste und Farbwirkung (Kunst 5/6, Berlin RLP Kunst: Malen / Bildbetrachtung) */
(() => {
  const UC = "#0f766e";
  const RAD = Math.PI / 180;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const F = "'Atkinson Hyperlegible', system-ui, sans-serif";

  /* ---------- layout helpers ---------- */
  const cols = (s, left, right, lw = 560) =>
    s.h("div", { class: "cols", style: { gridTemplateColumns: lw + "px minmax(0,1fr)", alignItems: "center", height: "100%" } }, left, right);
  const P = (s, html, cls = "t", hidden = false) => s.h("p", { class: cls + (hidden ? " later" : ""), html });
  const box = (s, cls, label, html, hidden = true) =>
    s.h("div", { class: cls + (hidden ? " later" : "") }, label ? s.h("span", { class: "exlabel" }, label) : null, s.h("p", { class: "small", html }));
  const merk = (s, html, hidden = true) => s.h("div", { class: "merk" + (hidden ? " later" : ""), html });
  const stack = (s, gap, ...kids) => s.h("div", { class: "stack", style: { gap: gap + "px" } }, ...kids);
  const dot = (s, c, d = 52) => s.h("span", { style: { display: "inline-block", width: d + "px", height: d + "px", borderRadius: "50%", background: c, border: "3px solid rgba(27,39,64,.25)", flex: "none" } });
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mixc = (c1, c2, t) => { const a = Array.isArray(c1) ? c1 : hex(c1), b = Array.isArray(c2) ? c2 : hex(c2); return a.map((v, i) => v + (b[i] - v) * t); };
  const rgb = a => `rgb(${a.map(v => Math.round(clamp(v, 0, 255))).join(",")})`;
  /* example line with emoji */
  const exline = (s, emoji, html) => s.h("div", { style: { display: "flex", gap: "12px", alignItems: "center" } }, s.h("span", { style: { fontSize: "30px", width: "40px", textAlign: "center", flex: "none" } }, emoji), s.h("p", { class: "small", html }));

  /* Itten-Farbkreis wie in Kapitel 1 */
  const WHEEL = [
    { n: "Gelb", c: "#ffd51a" }, { n: "Gelborange", c: "#ffb21a" }, { n: "Orange", c: "#ff8a1a" }, { n: "Rotorange", c: "#f0502a" },
    { n: "Rot", c: "#e0262f" }, { n: "Rotviolett", c: "#b02a74" }, { n: "Violett", c: "#7a3a9a" }, { n: "Blauviolett", c: "#4a45b0" },
    { n: "Blau", c: "#1f5fd1" }, { n: "Blaugrün", c: "#1a9aa0" }, { n: "Grün", c: "#2fa84a" }, { n: "Gelbgrün", c: "#9dcc2a" },
  ];
  const wedgePath = (cx, cy, r0, r1, a0, a1) => {
    const p = (r, a) => [cx + r * Math.sin(a * RAD), cy - r * Math.cos(a * RAD)];
    const [x0, y0] = p(r1, a0), [x1, y1] = p(r1, a1), [x2, y2] = p(r0, a1), [x3, y3] = p(r0, a0);
    return `M${x0},${y0} A${r1},${r1} 0 0 1 ${x1},${y1} L${x2},${y2} A${r0},${r0} 0 0 0 ${x3},${y3} Z`;
  };

  /* mini picture for the 7 contrast cards */
  const miniSvg = (s, kind) => {
    const sv = s.svg(150, 80);
    const r = (x, y, w, h, f, rx = 8) => s.el("rect", { x, y, width: w, height: h, rx, fill: f });
    const c = (x, y, rr, f) => s.el("circle", { cx: x, cy: y, r: rr, fill: f });
    if (kind === 0) sv.append(c(30, 40, 26, "#e0262f"), c(75, 40, 26, "#ffd21a"), c(120, 40, 26, "#1f5fd1"));
    if (kind === 1) sv.append(r(5, 8, 70, 64, "#f4f4f4"), r(75, 8, 70, 64, "#222"), c(40, 40, 18, "#bbb"), c(110, 40, 18, "#888"));
    if (kind === 2) sv.append(r(5, 8, 70, 64, "#ff8a1a"), r(75, 8, 70, 64, "#1f8fd1"));
    if (kind === 3) sv.append(r(5, 8, 70, 64, "#e0262f"), r(75, 8, 70, 64, "#2fa84a"));
    if (kind === 4) sv.append(r(5, 8, 70, 64, "#e0262f"), r(75, 8, 70, 64, "#2fa84a"), r(28, 28, 24, 24, "#8a8a8a", 3), r(98, 28, 24, 24, "#8a8a8a", 3));
    if (kind === 5) sv.append(r(5, 8, 140, 64, "#c9c4bd"), c(75, 40, 22, "#ff2a1a"), c(32, 40, 12, "#b9a89a"), c(118, 40, 12, "#a6b1b7"));
    if (kind === 6) sv.append(r(5, 8, 140, 64, "#1f5fd1"), c(112, 54, 11, "#ff8a1a"));
    sv.style.width = "130px"; sv.style.height = "70px";
    return sv;
  };

  Deck.unit({
    id: "u2", num: 2, title: "Farbkontraste und Farbwirkung", color: UC, soft: "#dcf3ef",
    subtitle: "Warum Farben leuchten, flüstern und warnen",
    blurb: "Itten-Kontraste, Wärme, Gefühle, Signal- und Tarnfarben, Marc und Macke",
    goals: [
      "Die sieben Farbkontraste nach Itten erkennen",
      "Verstehen, wie Farben wirken: warm, kalt, nah, fern",
      "Wissen, was Signal- und Tarnfarben sind",
      "Bilder von Franz Marc und August Macke deuten",
    ],
    icon(svg, el) {
      svg.append(el("rect", { x: 8, y: 14, width: 27, height: 42, rx: 6, fill: "#e0262f" }), el("rect", { x: 35, y: 14, width: 27, height: 42, rx: 6, fill: "#2fa84a" }),
        el("circle", { cx: 21, cy: 35, r: 7, fill: "#8a8a8a" }), el("circle", { cx: 49, cy: 35, r: 7, fill: "#8a8a8a" }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Die sieben Farbkontraste",
        say: "Farben wirken anders, wenn sie nebeneinander stehen. Johannes Itten hat dafür sieben Kontraste beschrieben.",
        build(s) {
          const items = [
            ["Farbe-an-sich", "reine, bunte Farben"], ["Hell-Dunkel", "hell gegen dunkel"], ["Kalt-Warm", "blau gegen orange"],
            ["Komplementär", "Gegenüber im Kreis"], ["Simultan", "Farben täuschen das Auge"], ["Qualität", "leuchtend gegen matt"], ["Quantität", "viel gegen wenig"],
          ];
          const cards = items.map(([t, d], i) => s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", padding: "16px 8px", textAlign: "center", minHeight: "205px" } },
            miniSvg(s, i), s.h("p", { class: "t", style: { fontWeight: 700, fontFamily: "var(--f-display)", fontSize: "21px" } }, t), s.h("p", { class: "small", style: { fontSize: "19px" } }, d)));
          const m = merk(s, "Ein <b>Kontrast</b> ist ein Gegensatz. Itten (Schweizer Maler und Lehrer am Bauhaus) hat <b>sieben</b> Farbkontraste beschrieben.");
          const grid = s.h("div", { class: "cols4", style: { gridTemplateColumns: "repeat(4,1fr)", gap: "16px" } }, ...cards, m);
          m.style.gridColumn = "4 / 5"; m.style.fontSize = "21px"; m.style.padding = "14px 16px";
          s.add(stack(s, 18, P(s, "Zwei Farben nebeneinander verändern sich gegenseitig. Das schauen wir uns an:"), grid));
          s.step(async () => { for (let i = 0; i < 4; i++) { s.sfx.note(i * 2, .18); s.show(cards[i], "pop"); await s.wait(230); } s.say("Farbe-an-sich, Hell-Dunkel, Kalt-Warm und Komplementär."); });
          s.step(async () => { for (let i = 4; i < 7; i++) { s.sfx.note(i * 2, .18); s.show(cards[i], "pop"); await s.wait(230); } s.say("Dazu Simultan, Qualität und Quantität."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Farbe-an-sich-Kontrast",
        say: "Je mehr verschiedene, reine Farben nebeneinander stehen, desto bunter und fröhlicher wird ein Bild.",
        build(s) {
          const svg = s.svg(560, 440);
          const hues = ["#ffd21a", "#e0262f", "#1f5fd1", "#2fa84a", "#ff8a1a", "#7a3a9a"];
          const balls = [];
          for (let i = 0; i < 6; i++) {
            const x = 90 + (i % 3) * 190, y = 100 + Math.floor(i / 3) * 215 + (i % 2 ? 18 : 0);
            const g = s.el("g", { class: "later" }, s.el("path", { d: `M${x},${y + 95} q-4,40 6,70`, fill: "none", stroke: "#8a93a6", "stroke-width": 3 }));
            const body = s.el("ellipse", { cx: x, cy: y, rx: 58, ry: 66, fill: "#1f5fd1", stroke: "rgba(27,39,64,.3)", "stroke-width": 3 });
            g.append(body, s.el("ellipse", { cx: x - 20, cy: y - 28, rx: 10, ry: 18, fill: "rgba(255,255,255,.5)", transform: `rotate(25 ${x - 20} ${y - 28})` }), s.el("path", { d: `M${x - 8},${y + 70} l8,12 l8,-12 z`, fill: "#1f5fd1" }));
            svg.append(g); balls.push({ g, body });
          }
          let n = 1;
          const paint = k => { n = k; balls.forEach((b, i) => b.body.setAttribute("fill", hues[i % k])); b_.textContent = k === 1 ? "1 Farbe" : k + " Farben"; };
          const b_ = s.h("span", { class: "chip" }, "1 Farbe");
          const sl = s.slider({ label: "Wie viele reine Farben?", min: 1, max: 6, step: 1, value: 1, onInput: v => { paint(v); } });
          sl.classList.add("later");
          const e = s.photo("mondrian-komposition", { w: 500, h: 270, fit: "contain", caption: "Mondrian, 1930", cls: "later" });
          const m = merk(s, "<b>Farbe-an-sich-Kontrast:</b> reine, leuchtende Farben, möglichst verschieden. Je mehr, desto bunter.");
          s.add(cols(s, svg, stack(s, 14, P(s, "Alle Ballons haben dieselbe Farbe. Das wirkt ruhig und ein bisschen langweilig."), sl, e, m), 560));
          s.show(svg, "fade");
          s.step(async () => { for (const b of balls) { s.sfx.pop(); s.show(b.g, "bounce"); await s.wait(130); } await s.show(sl, "pop"); s.say("Schiebe den Regler und gib den Ballons neue Farben."); });
          s.step(async () => { await s.tween({ from: 1, to: 6, dur: 1800, update: v => { const k = Math.round(v); if (k !== n) { s.sfx.note(k * 2, .12); sl.set(k); } } }); s.sfx.success(); });
          s.step(async () => { s.sfx.whoosh(); await s.show(e, "zoom"); s.say("Der Maler Piet Mondrian malte nur mit reinen Farben, Schwarz und Weiß."); await s.wait(200); s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Hell-Dunkel-Kontrast",
        say: "Hell und dunkel sind der stärkste Gegensatz. Nur damit erkennst du Dinge sofort, auch ohne Farbe.",
        build(s) {
          const svg = s.svg(560, 380);
          const bg = s.el("rect", { x: 0, y: 0, width: 560, height: 380, rx: 22, fill: "#fff" });
          const words = [["Gelb", 140, "#ffd21a"], ["Rot", 280, "#e0262f"], ["Blau", 420, "#1f5fd1"]];
          const ts = words.map(([t, x, c], i) => s.el("text", { x: 280, y: 130 + i * 100, "text-anchor": "middle", "font-size": 76, "font-weight": 800, fill: c, "font-family": "Bricolage Grotesque, sans-serif", text: t }));
          svg.append(bg, ...ts);
          svg.style.transition = "filter .4s";
          const set = v => { const c = 255 - v * 2.4; bg.setAttribute("fill", rgb([c, c, c])); };
          const sl = s.slider({ label: "Hintergrund: hell bis dunkel", min: 0, max: 100, step: 1, value: 0, fmt: v => v + " %", onInput: set });
          let gray = false;
          const btn = s.h("button", { class: "btn later", onclick: () => { gray = !gray; svg.style.filter = gray ? "grayscale(1)" : "none"; btn.textContent = gray ? "Wieder in Farbe" : "Schwarz-Weiß-Blick"; s.sfx.click(); s.say(gray ? "In Grau siehst du: Gelb verschwindet auf Weiß." : "Wieder in Farbe."); } }, "Schwarz-Weiß-Blick");
          const e = s.photo("zebra", { w: 500, h: 260, pos: "40% 50%", caption: "Zebra: Schwarz direkt neben Weiß", cls: "later" });
          const m = merk(s, "<b>Hell-Dunkel-Kontrast:</b> Zwei Farben mit sehr verschiedener Helligkeit. Gelb auf Weiß siehst du kaum!");
          s.add(cols(s, svg, stack(s, 12, sl, s.h("div", { class: "row" }, btn), e, m), 560));
          s.show(svg, "fade");
          s.step(async () => { s.show(sl, "pop"); s.show(btn, "pop"); s.sfx.pop(); s.say("Gelbe Schrift auf weißem Papier ist schwer zu lesen."); await s.tween({ from: 0, to: 100, dur: 2200, update: v => sl.set(Math.round(v)) }); });
          s.step(async () => { s.sfx.whoosh(); await s.show(e, "zoom"); s.say("Auch an der Schultafel und beim Schach: hell gegen dunkel."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
          /* sliders are visible from start */
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Kalt-Warm-Kontrast",
        say: "Rot, Orange und Gelb wirken warm. Blau, Blaugrün und Violett wirken kalt. Schieb den Regler und schau, wie sich die Stimmung ändert.",
        build(s) {
          const svg = s.svg(560, 400);
          const W = { sky: "#ffb872", sun: "#ffe27a", h1: "#d9622a", h2: "#8e3a2a", wall: "#f7dcab", roof: "#b8321f", win: "#ffe27a", gr: "#c8672a" };
          const K = { sky: "#9cc4ec", sun: "#f4f7ff", h1: "#3a7a96", h2: "#264e78", wall: "#d3e0f2", roof: "#3b4f9a", win: "#cfe8ff", gr: "#2f6d86" };
          const parts = {};
          const mk = (k, el) => { parts[k] = el; svg.append(el); return el; };
          mk("sky", s.el("rect", { x: 0, y: 0, width: 560, height: 400, rx: 22 }));
          mk("sun", s.el("circle", { cx: 420, cy: 100, r: 48 }));
          mk("h2", s.el("path", { d: "M0,250 Q120,160 250,230 T560,200 L560,400 L0,400 Z" }));
          mk("h1", s.el("path", { d: "M0,310 Q150,250 300,300 T560,285 L560,400 L0,400 Z" }));
          mk("wall", s.el("rect", { x: 150, y: 230, width: 130, height: 100, rx: 4 }));
          mk("roof", s.el("path", { d: "M135,235 L215,170 L295,235 Z" }));
          mk("win", s.el("rect", { x: 190, y: 270, width: 40, height: 44, rx: 4 }));
          const set = t => { for (const k in parts) parts[k].setAttribute("fill", rgb(mixc(K[k] || K.sky, W[k] || W.sky, t))); parts.sun.setAttribute("r", 40 + 14 * t); };
          set(0);
          const sl = s.slider({ label: "kalt ← → warm", min: 0, max: 100, step: 1, value: 0, fmt: v => v + " %", onInput: v => set(v / 100) });
          const row = s.h("div", { class: "row later", style: { gap: "10px" } }, ...["#e0262f", "#ff8a1a", "#ffd21a"].map(c => dot(s, c, 40)), s.h("b", { class: "t" }, "warm"), ...["#1f5fd1", "#1a9aa0", "#7a3a9a"].map(c => dot(s, c, 40)), s.h("b", { class: "t" }, "kalt"));
          const e = s.photo("vangogh-cafe", { w: 500, h: 290, pos: "50% 35%", caption: "Van Gogh (1888): warmes Café, kalte Nacht", cls: "later" });
          const m = merk(s, "<b>Kalt-Warm-Kontrast:</b> Warme Farben wirken <b>näher</b> und gemütlich, kalte wirken <b>weiter weg</b> und kühl.");
          s.add(cols(s, svg, stack(s, 12, sl, row, e, m), 560));
          s.show(svg, "fade");
          s.step(async () => { s.sfx.pop(); s.say("Es ist eine kalte Nacht."); await s.show(row, "up"); });
          s.step(async () => { s.sfx.whoosh(); s.say("Jetzt wird es warm: Sonnenuntergang."); await s.tween({ from: 0, to: 100, dur: 1800, update: v => sl.set(Math.round(v)) }); s.sfx.ding(); });
          s.step(async () => { s.sfx.whoosh(); await s.show(e, "zoom"); s.say("Vincent van Gogh malte ein Café in Arles: warmes gelbes Licht unter dem kalten blauen Nachthimmel."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Komplementär-Kontrast",
        say: "Komplementärfarben liegen im Farbkreis genau gegenüber. Nebeneinander leuchten sie besonders stark.",
        build(s) {
          const svg = s.svg(640, 600);
          const cx = 320, cy = 300, wedges = [], labels = [];
          WHEEL.forEach((w, i) => {
            const a = i * 30;
            const path = s.el("path", { d: wedgePath(cx, cy, 80, 190, a - 15, a + 15), fill: w.c, stroke: "#fff", "stroke-width": 4, "stroke-linejoin": "round", class: "later", style: "cursor:pointer" });
            path.addEventListener("pointerdown", e => { e.stopPropagation(); pick(i); });
            const sx = Math.sin(a * RAD), cyv = -Math.cos(a * RAD), anchor = sx > 0.3 ? "start" : sx < -0.3 ? "end" : "middle";
            const lab = s.el("text", { x: cx + 206 * sx, y: cy + 206 * cyv + (Math.abs(sx) <= 0.3 ? (cyv < 0 ? -2 : 22) : 7), "text-anchor": anchor, class: "lbl later", "font-size": 21, text: w.n });
            wedges.push(path); labels.push(lab); svg.append(path, lab);
          });
          const line = s.el("line", { x1: 0, y1: 0, x2: 0, y2: 0, stroke: "#1b2740", "stroke-width": 5, "stroke-dasharray": "3 9", "stroke-linecap": "round", class: "later" });
          const hubA = s.el("circle", { cx: 292, cy: 300, r: 26, fill: "#eee", stroke: "#fff", "stroke-width": 4 }), hubB = s.el("circle", { cx: 348, cy: 300, r: 26, fill: "#ddd", stroke: "#fff", "stroke-width": 4 });
          svg.append(line, hubA, hubB);
          const sw = (id) => s.h("div", { style: { flex: "1", height: "96px", background: "#eee", transition: "background .3s" }, id });
          const A = sw(), B = sw();
          const nA = s.h("p", { class: "h2" }, "Tippe ein Stück!"), nB = s.h("p", { class: "h2" }, " ");
          const pair = s.h("div", { class: "card", style: { padding: "0", overflow: "hidden" } }, s.h("div", { style: { display: "flex" } }, A, B),
            s.h("div", { style: { display: "flex", gap: "10px", padding: "10px 16px", justifyContent: "space-between" } }, nA, nB));
          function pick(i) {
            const j = (i + 6) % 12; s.sfx.note(i, .2); s.sfx.note(j, .2);
            wedges.forEach((e, k) => { e.setAttribute("stroke", k === i || k === j ? "#1b2740" : "#fff"); e.setAttribute("stroke-width", k === i || k === j ? 7 : 4); });
            wedges[i].parentNode.append(wedges[i], wedges[j]);
            hubA.setAttribute("fill", WHEEL[i].c); hubB.setAttribute("fill", WHEEL[j].c);
            A.style.background = WHEEL[i].c; B.style.background = WHEEL[j].c; nA.textContent = WHEEL[i].n; nB.textContent = WHEEL[j].n;
            pair.className = "card a-pop"; void pair.offsetWidth;
          }
          const m = merk(s, "<b>Komplementär</b> = gegenüber im Farbkreis, z. B. Gelb–Violett, Orange–Blau, Rot–Grün.");
          const ex = s.photo("marienkaefer", { w: 430, h: 210, caption: "Roter Marienkäfer auf grünem Blatt", cls: "later" });
          s.add(cols(s, svg, stack(s, 12, P(s, "Tippe ein Stück an. Sein <b>Gegenüber</b> leuchtet mit:", "t"), pair, ex, m), 640));
          s.show(svg, "fade");
          s.step(async () => { s.sfx.whoosh(); for (let i = 0; i < 12; i++) { s.show([wedges[i], labels[i]], "pop"); await s.wait(60); } pick(0); s.say("Gelb und Violett liegen sich gegenüber."); });
          s.step(async () => { pick(4); s.sfx.pop(); await s.show(ex, "zoom"); s.say("Rot und Grün. Probiere die anderen Farben aus!"); });
          s.step(async () => { pick(8); s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Simultankontrast",
        say: "Dasselbe Grau sieht auf Rot anders aus als auf Grün. Dein Auge mischt die Gegenfarbe dazu.",
        build(s) {
          const W = 560, H = 420;
          const { canvas, g } = s.canvas(W, H);
          const pairs = [["#e0262f", "#2fa84a"], ["#1f5fd1", "#ff8a1a"], ["#ffd21a", "#7a3a9a"]];
          let pi = 0, hide = 0, grey = 128;
          s.loop(() => {
            g.clearRect(0, 0, W, H);
            const [a, b] = pairs[pi];
            const pw = 250, ph = 330, y0 = 30;
            [[8, a], [W - 8 - pw, b]].forEach(([x, c], k) => {
              const cx = x + pw / 2, cy = y0 + ph / 2;
              const shrink = hide, w = pw - (pw - 80) * shrink, h = ph - (ph - 80) * shrink;
              g.fillStyle = "#fff"; g.strokeStyle = "#c8d3de"; g.lineWidth = 2; g.beginPath(); g.roundRect(x, y0, pw, ph, 14); g.fill(); g.stroke();
              g.fillStyle = c; g.beginPath(); g.roundRect(cx - w / 2, cy - h / 2, w, h, 14 * (1 - shrink) + 4); g.fill();
              g.fillStyle = rgb([grey, grey, grey]); g.fillRect(cx - 40, cy - 40, 80, 80);
            });
            g.font = `700 21px ${F}`; g.fillStyle = "#1b2740"; g.textAlign = "center";
            g.fillText(hide > 0.95 ? "Gleiches Grau – ohne Hintergrund!" : "Beide Quadrate: dasselbe Grau", W / 2, 400);
          });
          const sl = s.slider({ label: "Hintergrund wegnehmen", min: 0, max: 100, step: 1, value: 0, fmt: v => v + " %", onInput: v => { hide = v / 100; } });
          sl.classList.add("later");
          const btn = s.h("button", { class: "btn later", onclick: () => { pi = (pi + 1) % 3; s.sfx.swoosh(); } }, "Andere Farben");
          const m = merk(s, "<b>Simultankontrast:</b> Eine Farbe sieht neben einer anderen anders aus. Grau auf Rot wirkt <b>grünlich</b>, auf Grün <b>rötlich</b>.");
          const e = s.h("div", { class: "ex later", style: { display: "flex", gap: "14px", alignItems: "center", padding: "10px 14px" } }, s.photo("chevreul-farbkreis", { w: 140, h: 136, pos: "50% 45%" }), s.h("div", {}, s.h("span", { class: "exlabel" }, "Entdeckt von Chevreul"), s.h("p", { class: "small", html: "Der Franzose Michel Eugène Chevreul beschrieb das 1839. Hier sein Farbkreis." })));
          const life = box(s, "life", "Im Alltag", "Grauer Pulli neben roter Jacke: wirkt grünlich.");
          s.add(cols(s, canvas, stack(s, 10, P(s, "Beide Quadrate sind <b>genau gleich grau</b>.", "small"), s.h("div", { class: "row" }, btn), sl, m, e, life), 560));
          s.show(canvas, "zoom");
          s.step(async () => { s.show(btn, "pop"); s.show(sl, "pop"); s.sfx.pop(); s.say("Das linke Grau sieht grünlich aus, das rechte rötlich. Dabei sind sie gleich."); });
          s.step(async () => { s.sfx.whoosh(); await s.tween({ from: 0, to: 1, dur: 1800, update: v => { hide = v; sl.set(Math.round(v * 100)); } }); s.sfx.ding(); s.say("Ohne Hintergrund siehst du: Es ist wirklich dasselbe Grau."); await s.show(m, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(e, "up"); await s.wait(150); s.show(life, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Qualitätskontrast",
        say: "Qualität heißt hier: wie rein und leuchtend eine Farbe ist. Eine leuchtende Farbe zwischen matten springt ins Auge.",
        build(s) {
          const W = 560, H = 400;
          const { canvas, g } = s.canvas(W, H);
          let dull = 0;
          const base = ["#e0262f", "#ffb21a", "#2fa84a", "#1f5fd1", "#7a3a9a", "#ff8a1a", "#1a9aa0", "#b02a74"];
          s.loop(() => {
            g.clearRect(0, 0, W, H);
            g.fillStyle = "#e7e3dc"; g.beginPath(); g.roundRect(0, 0, W, H, 20); g.fill();
            for (let i = 0; i < 9; i++) {
              const x = 85 + (i % 3) * 195, y = 80 + Math.floor(i / 3) * 120;
              let c;
              if (i === 4) c = mixc("#ff2a1a", "#9a928a", dull);
              else c = mixc(base[i > 4 ? i - 1 : i], "#9a928a", 0.78);
              g.fillStyle = rgb(c); g.beginPath(); g.ellipse(x, y, 70, 44, 0, 0, 7); g.fill();
            }
          });
          const sl = s.slider({ label: "Mittlere Farbe: matt machen", min: 0, max: 100, step: 1, value: 0, fmt: v => v + " %", onInput: v => { dull = v / 100 * 0.78; } });
          sl.classList.add("later");
          const e = s.h("div", { class: "ex later", style: { display: "flex", flexDirection: "column", gap: "8px" } }, s.h("span", { class: "exlabel" }, "Beispiele"),
            exline(s, "🦺", "Leuchtweste im grauen Straßenverkehr"), exline(s, "🖍️", "Textmarker auf Zeitungspapier"), exline(s, "🌷", "Eine rote Tulpe im grauen Winter"));
          const m = merk(s, "<b>Qualitätskontrast:</b> reine, leuchtende Farbe gegen <b>gebrochene</b>, mit Grau vermischte Farben.");
          s.add(cols(s, canvas, stack(s, 12, P(s, "Eine Farbe leuchtet, die anderen sind <b>matt</b>. Welche fällt auf?"), sl, e, m), 560));
          s.show(canvas, "zoom");
          s.step(async () => { s.show(sl, "pop"); s.sfx.pop(); s.say("Das leuchtende Rot fällt sofort auf."); });
          s.step(async () => { s.sfx.whoosh(); await s.tween({ from: 0, to: 100, dur: 1800, update: v => sl.set(Math.round(v)) }); s.say("Wird es matt, geht es in der Gruppe unter."); });
          s.step(async () => { s.sfx.pop(); await s.show(e, "up"); await s.wait(150); s.sfx.ding(); s.show(m, "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Quantitätskontrast",
        say: "Wie viel Fläche eine Farbe bekommt, verändert die Stimmung. Ein kleiner Fleck zwischen viel Gegenfarbe leuchtet.",
        build(s) {
          const W = 560, H = 400;
          const { canvas, g } = s.canvas(W, H);
          let share = 4, shown = 4;
          s.loop((t, dt) => {
            shown += (share - shown) * Math.min(1, dt * 8);
            g.clearRect(0, 0, W, H);
            const fw = shown / 100;
            g.save(); g.beginPath(); g.roundRect(0, 0, W, H, 20); g.clip();
            g.fillStyle = "#1f5fd1"; g.fillRect(0, 0, W, H);
            g.fillStyle = "#ff8a1a"; const w = W * fw; g.fillRect(W - w, 0, w, H);
            g.restore();
            g.fillStyle = "rgba(255,255,255,.9)"; g.fillRect(W / 2 - 112, 168, 224, 64); g.fillStyle = "#1b2740"; g.font = `800 36px ${F}`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(`Orange: ${Math.round(shown)} %`, W / 2, 200);
          });
          const word = s.h("p", { class: "h2", style: { minHeight: "36px" } }, "Wenig Orange: ein Blickfang");
          const sl = s.slider({ label: "Orange-Anteil", min: 2, max: 50, step: 1, value: 4, fmt: v => v + " %", onInput: v => { share = v; word.textContent = v < 15 ? "Wenig Orange: ein Blickfang" : v < 40 ? "Mehr Orange: es wird laut" : "Gleich viel: ruhig, aber spannungsvoll"; } });
          sl.classList.add("later");
          const e = s.photo("monet-impression", { w: 500, h: 280, pos: "50% 50%", caption: "Monet (1872): kleine orange Sonne, viel Blau", cls: "later" });
          const m = merk(s, "<b>Quantitätskontrast:</b> viel gegen wenig Fläche. Die kleine Farbfläche wird zum <b>Blickfang</b>.");
          s.add(cols(s, canvas, stack(s, 12, word, sl, e, m), 560));
          s.show(canvas, "zoom");
          s.step(async () => { s.show(sl, "pop"); s.sfx.pop(); s.say("Ein kleiner orangefarbener Streifen leuchtet auf dem großen Blau."); });
          s.step(async () => { s.sfx.whoosh(); await s.tween({ from: 4, to: 50, dur: 2000, update: v => sl.set(Math.round(v)) }); s.say("Je mehr Orange, desto ausgeglichener wird das Bild."); });
          s.step(async () => { s.sound("moewen", { vol: .45 }); await s.show(e, "zoom"); s.say("Claude Monet malte den Hafen von Le Havre. Die kleine orange Sonne leuchtet im vielen Blau."); await s.wait(150); s.sfx.ding(); s.show(m, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Nähe und Ferne",
        say: "Was weit weg ist, wirkt heller, bläulicher und blasser. Das nennt man Luftperspektive.",
        build(s) {
          const svg = s.svg(580, 440);
          const sky = "#cfe3f6";
          svg.append(s.el("rect", { x: 0, y: 0, width: 580, height: 440, rx: 22, fill: sky }), s.el("circle", { cx: 470, cy: 80, r: 34, fill: "#fff3c4" }));
          const L1 = s.el("path", { d: "M0,230 L70,150 L130,200 L210,120 L290,210 L370,140 L450,205 L520,160 L580,215 L580,440 L0,440 Z", fill: "#bcd0e6", class: "later" });
          const L2 = s.el("path", { d: "M0,280 L90,210 L170,265 L260,190 L350,270 L440,215 L580,285 L580,440 L0,440 Z", fill: "#7f9fb0", class: "later" });
          const L3 = s.el("path", { d: "M0,340 Q140,270 290,330 T580,320 L580,440 L0,440 Z", fill: "#2f6d46", class: "later" });
          const tree = s.el("g", { class: "later" });
          const trunk = s.el("rect", { x: -6, y: 0, width: 12, height: 40, fill: "#6b4a2b" });
          const crown = s.el("path", { d: "M0,-90 L38,10 L-38,10 Z M0,-60 L48,38 L-48,38 Z", fill: "#1f5a35" });
          tree.append(trunk, crown); svg.append(L1, L2, L3, tree);
          const setTree = d => { const t = d / 100; const y = 415 - 125 * t, sc = 1.15 - 0.8 * t; tree.setAttribute("transform", `translate(300 ${y}) scale(${sc})`); crown.setAttribute("fill", rgb(mixc("#1f5a35", "#bcd0e6", t * 0.85))); trunk.setAttribute("fill", rgb(mixc("#6b4a2b", "#bcd0e6", t * 0.85))); };
          setTree(0);
          const sl = s.slider({ label: "Abstand des Baumes", min: 0, max: 100, step: 1, value: 0, fmt: v => v + " %", onInput: setTree });
          sl.classList.add("later");
          const chips = s.h("div", { class: "row later" }, ...["heller", "bläulicher", "blasser", "kleiner"].map(t => s.h("span", { class: "chip" }, t)));
          const m = merk(s, "<b>Luftperspektive:</b> Je weiter weg, desto <b>heller, bläulicher und blasser</b>. Auch kalte Farben wirken weiter weg als warme.");
          const e = s.photo("berge-dunst", { w: 490, h: 220, pos: "50% 55%", caption: "Echte Berge: hinten immer heller und blasser", cls: "later" });
          s.add(cols(s, svg, stack(s, 10, chips, sl, m, e), 580));
          s.show(svg, "fade");
          s.step(async () => { s.sfx.swoosh(); await s.show(L1, "up"); s.say("Ganz hinten die fernen Berge: hell und bläulich."); });
          s.step(async () => { s.sfx.swoosh(); await s.show(L2, "up"); s.say("Davor die mittleren Berge. Schon etwas dunkler."); });
          s.step(async () => { s.sfx.swoosh(); await s.show(L3, "up"); s.show(tree, "pop"); s.sfx.pop(); s.show(chips, "up"); s.say("Vorne der Hügel mit dem Baum: kräftig und dunkel."); });
          s.step(async () => { s.show(sl, "pop"); s.sfx.whoosh(); await s.tween({ from: 0, to: 100, dur: 2000, update: v => sl.set(Math.round(v)) }); s.say("Der Baum wird kleiner, heller und blauer, je weiter er geht."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); await s.wait(150); s.sound("wind", { vol: .35, dur: 4 }); s.show(e, "zoom"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Farben und Gefühle",
        say: "Farben wecken Gefühle. Tippe eine Farbe an und schau, was sie oft bedeutet.",
        build(s) {
          const items = [
            { n: "Rot", c: "#e0262f", t: "#fff", w: ["Energie", "Liebe", "Gefahr"], m: "M-34,22 Q0,62 34,22 Z", f: 1 },
            { n: "Gelb", c: "#ffd21a", t: "#1b2740", w: ["Sonne", "Freude", "Wärme"], m: "M-46,18 Q0,72 46,18", f: 0 },
            { n: "Blau", c: "#1f5fd1", t: "#fff", w: ["Ruhe", "Wasser", "Kühle"], m: "M-36,32 Q0,46 36,32", f: 0 },
            { n: "Grün", c: "#2fa84a", t: "#fff", w: ["Natur", "Frische", "Hoffnung"], m: "M-40,24 Q0,56 40,24", f: 0 },
            { n: "Schwarz", c: "#222222", t: "#fff", w: ["Nacht", "Trauer", "Geheimnis"], m: "M-40,50 Q0,14 40,50", f: 0 },
            { n: "Violett", c: "#7a3a9a", t: "#fff", w: ["Zauber", "Fantasie", "Geheimnis"], m: "M-40,36 Q10,36 40,20", f: 0 },
          ];
          const svg = s.svg(440, 420);
          const bgr = s.el("rect", { x: 0, y: 0, width: 440, height: 420, rx: 24, fill: "#ddd" });
          const face = s.el("g", { transform: "translate(220 200)" },
            s.el("circle", { r: 120, fill: "#fff6e6", stroke: "#1b2740", "stroke-width": 6 }),
            s.el("circle", { cx: -40, cy: -22, r: 12, fill: "#1b2740" }), s.el("circle", { cx: 40, cy: -22, r: 12, fill: "#1b2740" }));
          const mouth = s.el("path", { d: "M-40,30 Q0,30 40,30", fill: "none", stroke: "#1b2740", "stroke-width": 8, "stroke-linecap": "round" });
          const brows = s.el("g", { stroke: "#1b2740", "stroke-width": 7, "stroke-linecap": "round" }, s.el("line", { x1: -62, y1: -55, x2: -22, y2: -45 }), s.el("line", { x1: 62, y1: -55, x2: 22, y2: -45 }));
          face.append(brows, mouth); svg.append(bgr, face);
          const name = s.h("p", { class: "big", style: { minHeight: "46px" } }, "Tippe eine Farbe!");
          const words = s.h("div", { class: "row", style: { minHeight: "50px" } });
          function pick(i) {
            const it = items[i]; s.sfx.note(i * 2, .2);
            bgr.setAttribute("fill", it.c); mouth.setAttribute("d", it.m); mouth.setAttribute("fill", it.f ? "#7a1e1e" : "none");
            brows.setAttribute("transform", it.f ? "" : ""); const ls = brows.children; if (it.f) { ls[0].setAttribute("y1", -45); ls[0].setAttribute("y2", -58); ls[1].setAttribute("y1", -45); ls[1].setAttribute("y2", -58); ls[0].setAttribute("x1", -62); ls[0].setAttribute("x2", -22); ls[1].setAttribute("x1", 62); ls[1].setAttribute("x2", 22); } else { ls[0].setAttribute("y1", -55); ls[0].setAttribute("y2", -45); ls[1].setAttribute("y1", -55); ls[1].setAttribute("y2", -45); }
            name.textContent = it.n; name.className = "big a-pop"; void name.offsetWidth;
            words.innerHTML = ""; it.w.forEach(w => words.append(s.h("span", { class: "chip", style: { fontSize: "21px" } }, w)));
            face.setAttribute("transform", "translate(220 200)"); s.tween({ from: 0, to: 1, dur: 400, ease: "back", update: v => face.setAttribute("transform", `translate(220 200) scale(${0.85 + 0.15 * v})`) });
          }
          const btns = items.map((it, i) => s.h("button", { class: "btn", style: { background: it.c, color: it.t, borderColor: "rgba(27,39,64,.4)", minHeight: "76px", fontSize: "24px" }, onclick: () => pick(i) }, it.n));
          const grid = s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px" }, class: "later" }, ...btns);
          const m = merk(s, "Farben können <b>Gefühle</b> wecken. Bei uns in Deutschland heißt Rot oft „Achtung“, Blau „Ruhe“. In anderen Ländern kann das anders sein.");
          s.add(cols(s, svg, stack(s, 12, grid, name, words, m), 440));
          s.show(svg, "fade");
          s.step(async () => { s.sfx.pop(); await s.show(grid, "up"); pick(1); s.say("Gelb erinnert an Sonne und Freude."); });
          s.step(async () => { pick(2); s.sfx.pop(); s.say("Blau wirkt ruhig und kühl."); });
          s.step(async () => { pick(0); s.sfx.pop(); await s.wait(200); s.sfx.ding(); await s.show(m, "up"); s.say("Probiere alle Farben aus."); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Signalfarben",
        say: "Signalfarben fallen sofort auf. Sie warnen oder sagen dir, was du tun sollst.",
        build(s) {
          const svg = s.svg(580, 380);
          svg.append(s.el("rect", { x: 0, y: 0, width: 580, height: 380, rx: 22, fill: "#eef3f7" }),
            s.el("defs", {}, s.el("clipPath", { id: "u2wasp" }, s.el("ellipse", { cx: 105, cy: 180, rx: 62, ry: 30 }))));
          const wasp = s.el("g", { class: "later" },
            s.el("ellipse", { cx: 95, cy: 140, rx: 22, ry: 40, fill: "rgba(160,200,240,.7)", stroke: "#6b8aa8", "stroke-width": 2, transform: "rotate(-20 95 140)" }),
            s.el("ellipse", { cx: 125, cy: 138, rx: 20, ry: 38, fill: "rgba(160,200,240,.7)", stroke: "#6b8aa8", "stroke-width": 2, transform: "rotate(15 125 138)" }),
            s.el("ellipse", { cx: 105, cy: 180, rx: 62, ry: 30, fill: "#ffd21a" }),
            s.el("g", { "clip-path": "url(#u2wasp)" }, [70, 100, 130, 156].map(x => s.el("rect", { x, y: 140, width: 15, height: 80, fill: "#1b1b1b" }))),
            s.el("circle", { cx: 38, cy: 178, r: 24, fill: "#1b1b1b" }), s.el("path", { d: "M165,180 L195,184 L165,188 Z", fill: "#1b1b1b" }),
            s.el("circle", { cx: 30, cy: 172, r: 5, fill: "#ffd21a" }));
          const oct = [...Array(8)].map((_, i) => { const a = (22.5 + i * 45) * RAD; return `${290 + 76 * Math.cos(a)},${180 + 76 * Math.sin(a)}`; }).join(" ");
          const stop = s.el("g", { class: "later" }, s.el("rect", { x: 280, y: 250, width: 20, height: 100, fill: "#8a93a6" }), s.el("polygon", { points: oct, fill: "#d41f2a", stroke: "#fff", "stroke-width": 6 }),
            s.el("text", { x: 290, y: 192, "text-anchor": "middle", "font-size": 36, "font-weight": 800, fill: "#fff", text: "STOP" }));
          const lights = ["#d41f2a", "#ffc20a", "#1fa04a"].map((c, i) => s.el("circle", { cx: 485, cy: 118 + i * 62, r: 25, fill: c, opacity: 0.2 }));
          const amp = s.el("g", { class: "later" }, s.el("rect", { x: 480, y: 250, width: 10, height: 110, fill: "#8a93a6" }), s.el("rect", { x: 448, y: 70, width: 74, height: 200, rx: 16, fill: "#2a2f3a" }), ...lights);
          const lab = [[105, "Wespe"], [290, "Stoppschild"], [485, "Ampel"]].map(([x, t]) => s.el("text", { x, y: 372, "text-anchor": "middle", class: "lbl", text: t }));
          svg.append(wasp, stop, amp, ...lab);
          let li = 0;
          const setLight = k => { lights.forEach((l, i) => l.setAttribute("opacity", i === k ? 1 : 0.2)); };
          setLight(0);
          const btn = s.h("button", { class: "btn later", onclick: () => { li = (li + 1) % 3; setLight(li); s.sfx.click(); s.say(["Rot: Halt!", "Gelb: Achtung!", "Grün: Du darfst gehen."][li]); } }, "Ampel schalten");
          const m = merk(s, "<b>Signalfarben</b> (Rot, Gelb, Orange) fallen auf. Sie <b>warnen</b> oder geben Befehle.");
          const e = s.photo("wespe", { w: 490, h: 250, caption: "Echte Wespe: Gelb-Schwarz warnt Fressfeinde", cls: "later" });
          const buzz = s.soundBtn("wespe-summen", "Wespe hören"); buzz.classList.add("later");
          s.add(cols(s, svg, stack(s, 12, P(s, "Welche Farben <b>warnen</b> dich?"), s.h("div", { class: "row" }, btn, buzz), e, m), 580));
          s.show(svg, "fade");
          s.step(async () => { s.sfx.zap(); await s.show(wasp, "pop"); s.sfx.zap(); await s.show(stop, "pop"); s.sfx.zap(); await s.show(amp, "pop"); s.show(btn, "pop"); s.say("Wespe, Stoppschild und Ampel."); });
          s.step(async () => { for (let k = 0; k < 3; k++) { setLight(k); s.sfx.note(k * 4, .2); await s.wait(500); } li = 0; setLight(0); s.sound("wespe-summen", { vol: .5, dur: 2 }); s.show(buzz, "pop"); await s.show(e, "zoom"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Tarnfarben in der Natur",
        say: "Manche Tiere wollen nicht auffallen. Ihre Farbe passt zum Untergrund. Das nennt man Tarnung.",
        build(s) {
          /* frog panel */
          const F1 = s.svg(500, 250);
          const bgF = s.el("rect", { x: 0, y: 0, width: 500, height: 250, rx: 16, fill: "#4fa95a" });
          const leaves = [[80, 70, -20], [400, 60, 25], [60, 190, 30], [420, 190, -30], [250, 30, 0]].map(([x, y, r]) => s.el("ellipse", { cx: x, cy: y, rx: 70, ry: 26, fill: "#5fb76a", transform: `rotate(${r} ${x} ${y})` }));
          const frog = s.el("g", {}, s.el("ellipse", { cx: 250, cy: 150, rx: 78, ry: 50, fill: "#3f9d4b" }), s.el("circle", { cx: 250, cy: 100, r: 40, fill: "#3f9d4b" }),
            s.el("circle", { cx: 230, cy: 74, r: 14, fill: "#3f9d4b" }), s.el("circle", { cx: 270, cy: 74, r: 14, fill: "#3f9d4b" }),
            s.el("circle", { cx: 230, cy: 74, r: 6, fill: "#222" }), s.el("circle", { cx: 270, cy: 74, r: 6, fill: "#222" }),
            s.el("ellipse", { cx: 190, cy: 196, rx: 34, ry: 12, fill: "#3f9d4b" }), s.el("ellipse", { cx: 310, cy: 196, rx: 34, ry: 12, fill: "#3f9d4b" }));
          F1.append(bgF, ...leaves, frog);
          let frogOn = false;
          const b1 = s.h("button", { class: "btn", onclick: () => { frogOn = !frogOn; bgF.setAttribute("fill", frogOn ? "#e8d8c0" : "#4fa95a"); leaves.forEach(l => l.setAttribute("fill", frogOn ? "#f0e3cf" : "#5fb76a")); b1.textContent = frogOn ? "Zurück aufs Blatt" : "Frosch umsetzen"; s.sfx.swoosh(); s.say(frogOn ? "Auf hellem Grund fällt der grüne Frosch sofort auf." : "Auf dem Blatt ist der Frosch kaum zu sehen."); } }, "Frosch umsetzen");
          const p1 = s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "10px" } }, s.h("p", { class: "h2" }, "Der Laubfrosch"), F1, s.h("div", { class: "row" }, b1));
          /* hare panel */
          const F2 = s.svg(500, 250);
          const bgH = s.el("rect", { x: 0, y: 0, width: 500, height: 250, rx: 16, fill: "#9a8460" });
          const ground = s.el("rect", { x: 0, y: 160, width: 500, height: 90, rx: 16, fill: "#7a6a48" });
          const fur = "#8a6d4a";
          const hare = s.el("g", {}, s.el("ellipse", { cx: 260, cy: 170, rx: 85, ry: 48 }), s.el("circle", { cx: 175, cy: 135, r: 32 }), s.el("ellipse", { cx: 165, cy: 80, rx: 11, ry: 40, transform: "rotate(-10 165 80)" }), s.el("ellipse", { cx: 195, cy: 82, rx: 11, ry: 40, transform: "rotate(10 195 82)" }),
            s.el("circle", { cx: 345, cy: 170, r: 20 }), s.el("circle", { cx: 165, cy: 130, r: 5, fill: "#222" }));
          [...hare.children].forEach(c => { if (!c.getAttribute("fill")) c.setAttribute("fill", fur); });
          F2.append(bgH, ground, hare);
          let win = false;
          const setSeason = v => { const S = ["#9a8460", "#dfe9f2"], G = ["#7a6a48", "#f4f8fc"]; bgH.setAttribute("fill", S[v]); ground.setAttribute("fill", G[v]); [...hare.children].forEach(c => { if (c.getAttribute("r") !== "5") c.setAttribute("fill", v ? "#fdfdfd" : fur); }); };
          const b2 = s.h("button", { class: "btn", onclick: () => { win = !win; setSeason(win ? 1 : 0); b2.textContent = win ? "Zum Sommer" : "Zum Winter"; s.sfx.swoosh(); s.say(win ? "Im Winter ist das Fell weiß, passend zum Schnee." : "Im Sommer ist das Fell braun."); } }, "Zum Winter");
          const p2 = s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "10px" } }, s.h("p", { class: "h2" }, "Der Schneehase"), F2, s.h("div", { class: "row" }, b2));
          const m = merk(s, "<b>Tarnfarben</b> lassen Tiere mit dem Untergrund verschmelzen. Der Alpenschneehase ist im Winter weiß, Flundern und Chamäleons passen ihre Farbe sogar an.");
          F1.style.width = "100%"; F2.style.width = "100%";
          s.add(stack(s, 14, s.h("div", { class: "cols", style: { gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "20px" } }, p1, p2), m));
          s.step(async () => { s.sfx.pop(); await s.show(p1, "left"); s.say("Der grüne Laubfrosch sitzt auf einem grünen Blatt. Setze ihn um!"); });
          s.step(async () => { s.sfx.pop(); await s.show(p2, "right"); s.say("Der Schneehase ändert sein Fell mit den Jahreszeiten."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 12b --------------------------------------------------------------- */
      {
        title: "Tarnung in echt",
        say: "Findest du die Tiere? Der Laubfrosch versteckt sich zwischen grünen Blättern, der Schneehase im Schnee.",
        build(s) {
          const f = s.photo("laubfrosch", { w: 530, h: 430, caption: "Laubfrosch zwischen grünen Blättern", cls: "later" });
          const h = s.photo("schneehase", { w: 530, h: 430, pos: "50% 55%", caption: "Schneehase im weißen Winterfell", cls: "later" });
          const frog = s.soundBtn("laubfrosch-ruf", "Laubfrosch hören"); frog.classList.add("later");
          const m = merk(s, "Grün auf Grün, Weiß auf Weiß: Wenn Tier und Untergrund <b>dieselbe Farbe</b> haben, gibt es fast keinen Kontrast – das Tier verschwindet.");
          s.add(stack(s, 16, s.h("div", { class: "cols", style: { gridTemplateColumns: "530px 530px", gap: "20px" } }, f, h), s.h("div", { style: { display: "grid", gridTemplateColumns: "auto 1fr", gap: "20px", alignItems: "center" } }, frog, m)));
          s.step(async () => { s.sound("laubfrosch-ruf", { vol: .5, dur: 3 }); await s.show(f, "zoom"); s.show(frog, "pop"); s.say("Hörst du ihn? Sehen kann man ihn kaum."); });
          s.step(async () => { s.sound("wind", { vol: .35, dur: 3 }); await s.show(h, "zoom"); s.say("Im Winter ist der Schneehase weiß wie der Schnee."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 13a --------------------------------------------------------------- */
      {
        title: "Franz Marc: Das Blaue Pferd",
        say: "Franz Marc malte Tiere in Farben, die für Gefühle stehen. Das ist sein berühmtes Bild Blaues Pferd eins.",
        build(s) {
          const pic = s.photo("marc-blaues-pferd", { w: 410, h: 548, pos: "50% 50%", caption: "Blaues Pferd I, 1911" });
          const info = box(s, "ex", "Franz Marc (1880–1916)", "Maler in München. 1911 gründete er mit Wassily Kandinsky <b>Der Blaue Reiter</b>. Sein Gemälde <b>„Blaues Pferd I“</b> (1911) hängt im Lenbachhaus in München.");
          const look = box(s, "ex", "Schau genau", "Das Pferd ist <b>blau</b> – kein echtes Pferd hat diese Farbe. Dahinter leuchten Gelb, Rot und Grün.");
          const m = merk(s, "Marc malte Tiere nicht so, wie sie aussehen, sondern in Farben, die ihr <b>Wesen</b> zeigen.");
          s.add(cols(s, pic, stack(s, 14, info, look, m), 410));
          s.show(pic, "zoom"); s.sfx.whoosh();
          s.step(async () => { s.sfx.pop(); await s.show(info, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(look, "up"); s.say("Ein blaues Pferd! Für Marc war Blau eine Farbe für das Geistige."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Marcs Farben ausprobieren",
        say: "Hier siehst du meine eigene Zeichnung im Stil von Marc. Gib dem Pferd andere Farben.",
        build(s) {
          const svg = s.svg(560, 430);
          svg.append(s.el("rect", { x: 0, y: 0, width: 560, height: 430, rx: 22, fill: "#f3ead8" }));
          const poly = (pts, fill, extra = {}) => s.el("polygon", Object.assign({ points: pts, fill, class: "later" }, extra));
          const facets = [
            poly("0,300 180,240 260,430 0,430", "#ffd21a"), poly("180,240 400,290 330,430 260,430", "#2fa84a"), poly("400,290 560,230 560,430 330,430", "#d9392b"),
            poly("0,0 200,0 120,150 0,200", "#7a3a9a"), poly("200,0 380,0 320,110 150,160 120,150", "#ff8a1a"), poly("380,0 560,0 560,150 440,100 320,110", "#1f8f6b"),
          ];
          const horse = s.el("g", { class: "later" });
          const body = [];
          const hp = pts => { const p = s.el("polygon", { points: pts, fill: "#1f4fb5", stroke: "#162f78", "stroke-width": 4, "stroke-linejoin": "round" }); body.push(p); horse.append(p); return p; };
          hp("205,285 237,285 230,385 207,385"); hp("242,285 274,285 266,375 243,375"); hp("365,278 398,278 408,378 380,381"); hp("328,285 360,285 352,375 327,375");
          hp("412,215 448,262 432,335 404,300");
          hp("170,190 380,175 422,230 402,292 200,302 165,250");
          hp("150,95 187,100 218,190 165,196 134,130");
          hp("150,95 100,92 62,138 75,166 118,160 136,130");
          const shade = [["185,200 300,188 262,292 200,300", .28], ["300,188 380,176 420,230 400,290 262,292", .15], ["150,96 187,101 160,150 136,130", .3]].map(([p, o]) => s.el("polygon", { points: p, fill: "#0b1e5c", opacity: o }));
          const mane = s.el("polygon", { points: "187,100 210,92 205,120 226,126 218,190 195,160", fill: "#12306f" });
          const eye = s.el("ellipse", { cx: 100, cy: 128, rx: 7, ry: 5, fill: "#f3ead8" });
          horse.append(...shade, mane, eye); svg.append(...facets, horse);
          const col = { Blau: ["#1f4fb5", "#162f78", "#0b1e5c"], Gelb: ["#f2c61a", "#b58f0a", "#7a5a00"], Rot: ["#d9392b", "#9c1f16", "#5c0c08"] };
          const txt = { Blau: ["Blau: streng und geistig", "Für Marc war Blau das „männliche Prinzip“: herb und geistig."], Gelb: ["Gelb: sanft und heiter", "Gelb war für ihn das „weibliche Prinzip“: sanft, heiter, sinnlich."], Rot: ["Rot: schwer und wuchtig", "Rot bedeutete für ihn die Materie: brutal und schwer."] };
          const title = s.h("p", { class: "h2" }, txt.Blau[0]), desc = s.h("p", { class: "small", style: { minHeight: "54px" } }, txt.Blau[1]);
          const card = s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, "Marcs Farbsprache"), title, desc);
          const setCol = n => { const [a, b, c] = col[n]; body.forEach(p => { p.setAttribute("fill", a); p.setAttribute("stroke", b); }); shade.forEach(p => p.setAttribute("fill", c)); mane.setAttribute("fill", b); title.textContent = txt[n][0]; desc.textContent = txt[n][1]; card.className = "ex a-pop"; void card.offsetWidth; s.sfx.pop(); };
          const btns = s.h("div", { class: "row later" }, ...["Blau", "Gelb", "Rot"].map(n => s.h("button", { class: "btn", style: { minWidth: "110px" }, onclick: () => setCol(n) }, n)));
          const info = box(s, "ex", "Jetzt du", "Das Pferd ist nachgezeichnet, die Farbflächen sind wie bei Marc: Gegenfarben rund um das Blau. Welche Farbe passt zum Pferd?", false);
          const credit = P(s, "Meine Zeichnung im Stil von Franz Marc – kein Original!", "small pencil");
          const m = merk(s, "Für Marc hatte jede Farbe eine <b>Bedeutung</b>: Blau geistig, Gelb heiter, Rot schwer.");
          s.add(cols(s, stack(s, 6, svg, credit), stack(s, 12, info, btns, card, m), 560));
          s.show(svg, "fade"); s.sfx.whoosh();
          s.step(async () => { for (let i = 0; i < facets.length; i++) { s.sfx.note(i * 2, .15); s.show(facets[i], "pop"); await s.wait(170); } s.say("Erst die Farbflächen: Gelb, Grün, Rot, Violett und Orange. Das sind lauter Gegenfarben."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(horse, "zoom"); s.sfx.ding(); s.say("Und mitten drin das blaue Pferd."); });
          s.step(async () => { s.show(btns, "pop"); s.sfx.pop(); await s.show(card, "up"); s.say("Probiere die drei Farben aus. Jede hatte für Marc eine Bedeutung."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "August Macke: Licht in Tunesien",
        say: "August Macke reiste 1914 nach Tunesien. Dort wurde sein Malen noch heller und bunter. Male selbst eine Stadt wie Macke.",
        build(s) {
          const svg = s.svg(580, 420);
          const fills = {};
          let paint = "#ff8a1a";
          const shape = (key, el, base) => { el.setAttribute("fill", base); el.style.cursor = "pointer"; el.addEventListener("pointerdown", e => { e.stopPropagation(); el.setAttribute("fill", paint); s.sfx.snap(); }); fills[key] = el; return el; };
          const sky = shape("sky", s.el("rect", { x: 0, y: 0, width: 580, height: 420, rx: 22, class: "later" }), "#ffeaa8");
          const sun = shape("sun", s.el("circle", { cx: 490, cy: 80, r: 42, class: "later" }), "#ffb21a");
          const ground = shape("ground", s.el("path", { d: "M0,340 L580,330 L580,398 Q580,420 558,420 L22,420 Q0,420 0,398 Z", class: "later" }), "#e8b878");
          const h1 = shape("h1", s.el("rect", { x: 40, y: 190, width: 140, height: 150, class: "later" }), "#f4f1e8");
          const h2 = shape("h2", s.el("rect", { x: 200, y: 140, width: 120, height: 200, class: "later" }), "#ffb36b");
          const dome = shape("dome", s.el("path", { d: "M215,140 Q260,60 305,140 Z", class: "later" }), "#4fb3c8");
          const h3 = shape("h3", s.el("rect", { x: 340, y: 210, width: 170, height: 130, class: "later" }), "#e9a6c4");
          const palm = shape("palm", s.el("path", { d: "M530,200 Q470,150 440,170 Q490,160 530,200 Q500,130 470,130 Q520,140 535,195 Q560,130 600,140 Q555,150 540,200 Q580,170 615,190 Q570,180 540,205 Z", class: "later" }), "#2fa84a");
          const trunk = s.el("rect", { x: 527, y: 195, width: 10, height: 145, fill: "#8a5a34", class: "later" });
          const doors = [[75, 270], [235, 255], [405, 270], [455, 270]].map(([x, y], i) => shape("d" + i, s.el("path", { d: `M${x},340 L${x},${y + 18} Q${x + 17},${y - 10} ${x + 34},${y + 18} L${x + 34},340 Z`, class: "later" }), "#2d4aa8"));
          const wins = [[85, 215], [105, 215], [225, 170], [265, 170], [365, 235], [400, 235], [440, 235]].map(([x, y], i) => shape("w" + i, s.el("rect", { x, y, width: 18, height: 26, rx: 3, class: "later" }), "#d9392b"));
          const all = [sky, sun, ground, h1, h2, dome, h3, trunk, palm, ...doors, ...wins];
          svg.append(...all);
          const cs = ["#ffd21a", "#ff8a1a", "#e0262f", "#e45a9b", "#7a3a9a", "#1f8fd1", "#2fa84a", "#fafafa"];
          const sw = cs.map(c => s.h("button", { style: { width: "50px", height: "50px", borderRadius: "50%", background: c, border: "4px solid rgba(27,39,64,.3)", cursor: "pointer", padding: 0 }, "aria-label": "Farbe", onclick: () => { paint = c; sw.forEach(b => (b.style.borderColor = "rgba(27,39,64,.3)")); sw[cs.indexOf(c)].style.borderColor = "#1b2740"; s.sfx.pop(); } }));
          sw[1].style.borderColor = "#1b2740";
          const palette = s.h("div", { class: "row later", style: { gap: "8px", flexWrap: "nowrap" } }, ...sw);
          const info = s.photo("macke-kairouan", { w: 490, h: 290, caption: "Das Original: Macke, Kairouan III (1914)" });
          const m = merk(s, "Im April 1914 reiste Macke mit Paul Klee nach Tunesien und malte flache, <b>leuchtende Farbflächen</b>. Er starb im September 1914, mit nur 27 Jahren.");
          const credit = P(s, "Meine Zeichnung im Stil von August Macke – kein Original!", "small pencil");
          const tip = P(s, "Wähle eine Farbe, tippe ein Haus an – und male die Stadt neu!", "small", true);
          s.add(cols(s, stack(s, 6, svg, credit), stack(s, 12, info, tip, palette, m), 580));
          s.show(svg, "fade");
          s.step(async () => { s.sfx.whoosh(); for (const e of [sky, sun, ground, h1, h2, dome, h3, trunk, palm]) { s.show(e, "pop"); s.sfx.tick(); await s.wait(130); } s.show([...doors, ...wins], "pop"); s.sfx.ding(); s.say("Häuser, Kuppel und Palme aus ganz flachen Farbflächen."); });
          s.step(async () => { s.show(tip, "up"); s.sfx.pop(); await s.show(palette, "up"); s.say("Jetzt bist du dran: Tippe ein Haus an und gib ihm eine neue Farbe."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Im Alltag: Farben überall",
        say: "Farbwirkung begegnet dir jeden Tag: im Zimmer, auf dem Fußballplatz, an der Ampel und im Supermarkt.",
        build(s) {
          const svg = s.svg(500, 380);
          const W = { wall: "#f2b36b", floor: "#b9743e", sofa: "#b8441f", win: "#ffe9a0", lamp: "#ffd21a", rug: "#d9772b" };
          const K = { wall: "#9db8d9", floor: "#6c7c95", sofa: "#345a8f", win: "#d7ecff", lamp: "#cfe8ff", rug: "#4b6f9c" };
          const P2 = {};
          const mk = (k, el) => { P2[k] = el; svg.append(el); return el; };
          mk("wall", s.el("rect", { x: 0, y: 0, width: 500, height: 380, rx: 20 }));
          mk("floor", s.el("path", { d: "M0,270 L500,270 L500,360 Q500,380 480,380 L20,380 Q0,380 0,360 Z" }));
          mk("win", s.el("rect", { x: 50, y: 50, width: 130, height: 140, rx: 8, stroke: "#fff", "stroke-width": 8 }));
          svg.append(s.el("line", { x1: 115, y1: 50, x2: 115, y2: 190, stroke: "#fff", "stroke-width": 6 }), s.el("line", { x1: 50, y1: 120, x2: 180, y2: 120, stroke: "#fff", "stroke-width": 6 }));
          mk("rug", s.el("ellipse", { cx: 280, cy: 330, rx: 150, ry: 34 }));
          mk("sofa", s.el("path", { d: "M220,220 Q220,190 250,190 L420,190 Q450,190 450,220 L450,300 L220,300 Z" }));
          mk("lamp", s.el("circle", { cx: 440, cy: 100, r: 30 }));
          svg.append(s.el("rect", { x: 436, y: 130, width: 8, height: 60, fill: "#555" }));
          const setRoom = t => { for (const k in P2) P2[k].setAttribute("fill", rgb(mixc(K[k], W[k], t))); };
          setRoom(0);
          const sl = s.slider({ label: "Zimmer: kalt ← → warm", min: 0, max: 100, step: 1, value: 0, fmt: v => v + " %", onInput: v => setRoom(v / 100) });
          const roomCard = s.h("div", { class: "ex later", style: { display: "flex", flexDirection: "column", gap: "10px" } }, s.h("span", { class: "exlabel" }, "Ein Zimmer: warm oder kalt gestrichen"), svg, sl);
          svg.style.width = "100%";
          /* small cards */
          const mini = (sv, html) => s.h("div", { class: "life later", style: { display: "flex", gap: "16px", alignItems: "center", padding: "10px 16px" } }, sv, s.h("p", { class: "small", html }));
          const amp = s.svg(70, 110); const al = ["#d41f2a", "#ffc20a", "#1fa04a"].map((c, i) => s.el("circle", { cx: 35, cy: 24 + i * 31, r: 12, fill: c, opacity: 0.2 }));
          amp.append(s.el("rect", { x: 10, y: 2, width: 50, height: 106, rx: 12, fill: "#2a2f3a" }), ...al); amp.style.cssText = "width:70px;height:110px;flex:none";
          let ph = 0; s.loop(t => { const k = Math.floor(t / 1.1) % 3; al.forEach((l, i) => l.setAttribute("opacity", i === k ? 1 : 0.2)); });
          const shirt = (c, c2) => `<path d="M10,20 L30,8 Q45,22 60,8 L80,20 L70,40 L62,34 L62,84 L28,84 L28,34 L20,40 Z" fill="${c}" stroke="#1b2740" stroke-width="3" stroke-linejoin="round"/><rect x="28" y="56" width="34" height="8" fill="${c2}"/>`;
          const kit = s.svg(180, 100); const g1 = s.el("g", { transform: "translate(0 8)" }), g2 = s.el("g", { transform: "translate(90 8)" }); g1.innerHTML = shirt("#d41f2a", "#fff"); g2.innerHTML = shirt("#1f5fd1", "#fff"); kit.append(g1, g2); kit.style.cssText = "width:150px;height:84px;flex:none";
          const cup = (x, c) => `<path d="M${x},16 L${x + 44},16 L${x + 38},76 L${x + 6},76 Z" fill="#fff" stroke="#1b2740" stroke-width="3"/><rect x="${x + 2}" y="30" width="40" height="30" fill="${c}"/><rect x="${x - 2}" y="10" width="48" height="10" rx="3" fill="#cfd4de" stroke="#1b2740" stroke-width="3"/>`;
          const pk = s.svg(160, 90); const g3 = s.el("g", {}); g3.innerHTML = cup(8, "#d9392b") + cup(58, "#1f5fd1") + cup(108, "#ffd21a"); pk.append(g3); pk.style.cssText = "width:150px;height:84px;flex:none";
          const c1 = mini(amp, "<b>Ampel:</b> Rot, Gelb und Grün sind Signalfarben. Du erkennst sie auch aus großer Entfernung.");
          const c2 = mini(kit, "<b>Fußball:</b> Die Teams tragen Trikots mit starkem Kontrast, zum Beispiel Rot gegen Blau.");
          const c3 = mini(pk, "<b>Supermarkt:</b> Auf Joghurtbechern verrät die Farbe den Inhalt: Rot = Erdbeere, Blau = Blaubeere.");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "520px minmax(0,1fr)", alignItems: "center", height: "100%" } }, roomCard, stack(s, 14, c1, c2, c3)));
          s.step(async () => { s.sfx.whoosh(); await s.show(roomCard, "left"); await s.tween({ from: 0, to: 100, dur: 1800, update: v => sl.set(Math.round(v)) }); s.say("Ein warm gestrichenes Zimmer wirkt gemütlich, ein kalt gestrichenes kühl und weit."); });
          s.step(async () => { s.sfx.pop(); await s.show(c1, "right"); s.say("Die Ampel nutzt Signalfarben."); });
          s.step(async () => { s.sound("whistle", { vol: .5 }); await s.show(c2, "right"); s.say("Beim Fußball hilft der Kontrast der Trikots."); });
          s.step(async () => { s.sound("cash-register", { vol: .5 }); await s.show(c3, "right"); s.say("Und im Supermarkt zeigt die Farbe, was drin ist."); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Das hast du gelernt",
        say: "Das war ein Feuerwerk aus Farben! Hier ist alles auf einen Blick.",
        build(s) {
          const card = (title, html, vis) => s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", textAlign: "center", padding: "26px 18px", minHeight: "230px" } }, vis, s.h("p", { class: "h2" }, title), s.h("p", { class: "small", html }));
          const dots = cs => s.h("div", { class: "row", style: { gap: "6px", flexWrap: "nowrap", height: "56px", justifyContent: "center" } }, ...cs.map(c => dot(s, c, 40)));
          const cards = [
            card("Itten-Kontraste", "Sieben Gegensätze lassen Farben stark wirken.", dots(["#e0262f", "#ffd21a", "#1f5fd1", "#2fa84a"])),
            card("Komplementär", "Gegenüber im Farbkreis: Rot–Grün, Gelb–Violett, Orange–Blau.", dots(["#e0262f", "#2fa84a", "#ffd21a", "#7a3a9a"])),
            card("Warm und kalt", "Warm wirkt nah, kalt wirkt fern. Weit weg ist hell und bläulich.", dots(["#ff8a1a", "#e0262f", "#1f5fd1", "#9cc4ec"])),
            card("Wirkung", "Rot warnt, Blau beruhigt. Tarnfarben verstecken Tiere.", dots(["#ffd21a", "#222", "#2fa84a", "#4fa95a"])),
            card("Franz Marc", "„Blaues Pferd I“ (1911): Blau steht für das Geistige.", dots(["#1f4fb5", "#ffd21a", "#d9392b"])),
            card("August Macke", "Tunesien 1914: leuchtende, flache Farbflächen.", dots(["#4fb3c8", "#ffb36b", "#e9a6c4"])),
          ];
          s.add(stack(s, 16, P(s, "Deine Farbwirkungs-Zusammenfassung:", "big"), s.h("div", { class: "cols3", style: { gap: "16px" } }, ...cards)));
          s.step(async () => { for (let i = 0; i < 6; i++) { s.sfx.note([0, 2, 4, 5, 7, 9][i], .2); s.show(cards[i], "pop"); await s.wait(260); } s.sfx.fanfare(); s.say("Jetzt kannst du Farben nicht nur mischen, sondern auch gezielt wirken lassen!"); });
        },
      },
    ],
  });
})();
