/* Kapitel 1 – Farben mischen (Kunst 5/6, Berlin RLP Kunst: Malen / Farbe) */
(() => {
  const UC = "#1d5bd0";
  const RAD = Math.PI / 180;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------- layout helpers ---------- */
  const cols = (s, left, right, lw = 560) =>
    s.h("div", { class: "cols", style: { gridTemplateColumns: lw + "px 1fr", alignItems: "center", height: "100%" } }, left, right);
  const P = (s, html, cls = "t", hidden = false) => s.h("p", { class: cls + (hidden ? " later" : ""), html });
  const box = (s, cls, label, html, hidden = true) =>
    s.h("div", { class: cls + (hidden ? " later" : "") }, label ? s.h("span", { class: "exlabel" }, label) : null, s.h("p", { class: "small", html }));
  const merk = (s, html, hidden = true) => s.h("div", { class: "merk" + (hidden ? " later" : ""), html });
  const stack = (s, gap, ...kids) => s.h("div", { class: "stack", style: { gap: gap + "px" } }, ...kids);
  const dot = (s, c, d = 52) => s.h("span", { style: { display: "inline-block", width: d + "px", height: d + "px", borderRadius: "50%", background: c, border: "3px solid rgba(27,39,64,.25)", flex: "none" } });

  /* ---------- colour data ---------- */
  const Y = "#ffd21a", R = "#e0262f", B = "#1f5fd1";
  /* Itten-Farbkreis, 12 Teile, Gelb oben, im Uhrzeigersinn */
  const WHEEL = [
    { n: "Gelb", c: "#ffd51a", o: 1 }, { n: "Gelborange", c: "#ffb21a", o: 3, p: [0, 2] },
    { n: "Orange", c: "#ff8a1a", o: 2, p: [0, 4] }, { n: "Rotorange", c: "#f0502a", o: 3, p: [2, 4] },
    { n: "Rot", c: "#e0262f", o: 1 }, { n: "Rotviolett", c: "#b02a74", o: 3, p: [4, 6] },
    { n: "Violett", c: "#7a3a9a", o: 2, p: [4, 8] }, { n: "Blauviolett", c: "#4a45b0", o: 3, p: [6, 8] },
    { n: "Blau", c: "#1f5fd1", o: 1 }, { n: "Blaugrün", c: "#1a9aa0", o: 3, p: [8, 10] },
    { n: "Grün", c: "#2fa84a", o: 2, p: [8, 0] }, { n: "Gelbgrün", c: "#9dcc2a", o: 3, p: [10, 0] },
  ];
  const wedgePath = (cx, cy, r0, r1, a0, a1) => {
    const p = (r, a) => [cx + r * Math.sin(a * RAD), cy - r * Math.cos(a * RAD)];
    const [x0, y0] = p(r1, a0), [x1, y1] = p(r1, a1), [x2, y2] = p(r0, a1), [x3, y3] = p(r0, a0);
    return `M${x0},${y0} A${r1},${r1} 0 0 1 ${x1},${y1} L${x2},${y2} A${r0},${r0} 0 0 0 ${x3},${y3} Z`;
  };
  /* builds the Farbkreis svg. returns {svg, wedges, labels} */
  function makeWheel(s, W, H, cx, cy, r0, r1, rl, onTap) {
    const svg = s.svg(W, H);
    const wedges = [], labels = [];
    WHEEL.forEach((w, i) => {
      const a = i * 30;
      const path = s.el("path", { d: wedgePath(cx, cy, r0, r1, a - 15, a + 15), fill: w.c, stroke: "#fff", "stroke-width": 4, "stroke-linejoin": "round", class: "later" + (onTap ? " draggable" : ""), style: "cursor:pointer" });
      if (onTap) path.addEventListener("pointerdown", e => { e.stopPropagation(); onTap(i); });
      const sx = Math.sin(a * RAD), cyv = -Math.cos(a * RAD);
      const anchor = sx > 0.3 ? "start" : sx < -0.3 ? "end" : "middle";
      const lab = s.el("text", { x: cx + rl * sx, y: cy + rl * cyv + (Math.abs(sx) <= 0.3 ? (cyv < 0 ? -2 : 22) : 7), "text-anchor": anchor, class: "lbl later", text: w.n, "font-size": 21 });
      wedges.push(path); labels.push(lab); svg.append(path, lab);
    });
    return { svg, wedges, labels };
  }

  /* ---------- Farbmischung (subtraktives Modell) ---------- */
  const PIG = { y: [255, 214, 20], r: [214, 28, 60], b: [24, 84, 200] };
  function mixModel(n) {
    const chroma = n.y + n.r + n.b;
    let col;
    if (chroma > 0) {
      col = [0, 1, 2].map(k => Math.exp((n.y * Math.log(PIG.y[k] + 1) + n.r * Math.log(PIG.r[k] + 1) + n.b * Math.log(PIG.b[k] + 1)) / chroma) - 1);
      if (n.w) { const f = n.w / (n.w + chroma) * 0.92; col = col.map(c => c + (255 - c) * f); }
      if (n.k) { const f = n.k / (n.k + chroma) * 0.88; col = col.map(c => c * (1 - f)); }
    } else if (n.w || n.k) { const v = 250 * n.w / (n.w + n.k) + 18 * n.k / (n.w + n.k); col = [v, v, v]; }
    else col = [240, 236, 226];
    return col.map(c => Math.round(clamp(c, 0, 255)));
  }
  const RECIPES = [["Gelb", 1, 0, 0], ["Gelborange", 2, 1, 0], ["Orange", 1, 1, 0], ["Rotorange", 1, 2, 0], ["Rot", 0, 1, 0], ["Rotviolett", 0, 2, 1],
    ["Violett", 0, 1, 1], ["Blauviolett", 0, 1, 2], ["Blau", 0, 0, 1], ["Blaugrün", 1, 0, 2], ["Grün", 1, 0, 1], ["Gelbgrün", 2, 0, 1]];
  function mixName(n) {
    const c = n.y + n.r + n.b;
    if (!c) return n.w + n.k === 0 ? "Noch leer" : n.k === 0 ? "Weiß" : n.w === 0 ? "Schwarz" : "Grau";
    const v = [n.y / c, n.r / c, n.b / c];
    if (v[0] > 0.2 && v[1] > 0.2 && v[2] > 0.2) return n.k > n.w ? "Dunkelbraun" : "Braun";
    let best = "", bs = -1;
    RECIPES.forEach(([nm, y, r, b]) => { const l = Math.hypot(y, r, b); const sc = (v[0] * y + v[1] * r + v[2] * b) / l; if (sc > bs) { bs = sc; best = nm; } });
    if (n.w && !n.k) return best === "Rot" ? "Rosa" : "Hell" + best.toLowerCase();
    if (n.k && !n.w) return "Dunkel" + best.toLowerCase();
    if (n.k && n.w) return best + ", abgetönt";
    return best;
  }
  const rgb = a => `rgb(${a[0]},${a[1]},${a[2]})`;
  const mixHex = (c1, c2, t) => { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const a = p(c1), b = p(c2); return a.map((v, i) => Math.round(v + (b[i] - v) * t)); };

  Deck.unit({
    id: "u1", num: 1, title: "Farben mischen", color: UC, soft: "#e4ecfb",
    subtitle: "Aus drei Farben wird die ganze Welt",
    blurb: "Grundfarben, Farbkreis, Mischlabor, Abtönen und Deckfarben",
    goals: [
      "Die drei Grundfarben und ihre Mischfarben kennen",
      "Den Farbkreis nach Itten verstehen",
      "Selbst Farben mischen, aufhellen und abdunkeln",
      "Deckfarben und Wasserfarben unterscheiden",
    ],
    icon(svg, el) {
      svg.append(el("circle", { cx: 26, cy: 28, r: 16, fill: "#ffd21a", opacity: .9 }), el("circle", { cx: 44, cy: 28, r: 16, fill: "#e0262f", opacity: .75 }),
        el("circle", { cx: 35, cy: 44, r: 16, fill: "#1f5fd1", opacity: .7 }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Dein Malkasten",
        say: "Im Malkasten liegen viele Farben nebeneinander. Drei davon sind besonders wichtig.",
        build(s) {
          const svg = s.svg(580, 266);
          svg.append(s.el("rect", { x: 10, y: 8, width: 560, height: 250, rx: 20, fill: "#cfd4de", stroke: "#6b7385", "stroke-width": 4 }));
          const pc = [["#fafafa", "Weiß"], ["#222222", "Schwarz"], [Y, "Gelb"], ["#ff8a1a", "Orange"], [R, "Rot"], ["#f08ab0", "Rosa"],
            ["#7a3a9a", "Violett"], [B, "Blau"], ["#7fc4f0", "Hellblau"], ["#2fa84a", "Grün"], ["#9dd45a", "Hellgrün"], ["#8a5a34", "Braun"]];
          const pans = pc.map(([c], i) => {
            const x = 38 + (i % 6) * 88, y = 36 + Math.floor(i / 6) * 108;
            const g = s.el("g", { class: "later" }, s.el("rect", { x, y, width: 72, height: 84, rx: 12, fill: "#aab1c0" }), s.el("rect", { x: x + 6, y: y + 6, width: 60, height: 72, rx: 9, fill: c, stroke: "rgba(27,39,64,.35)", "stroke-width": 2 }));
            svg.append(g); return g;
          });
          const px = i => 38 + (i % 6) * 88, py = i => 36 + Math.floor(i / 6) * 108;
          const rings = [[2, "#ffffff"], [4, "#ffffff"], [7, "#ffffff"]].map(([i]) => s.el("rect", { x: px(i) - 5, y: py(i) - 5, width: 82, height: 94, rx: 16, fill: "none", stroke: "#1b2740", "stroke-width": 5, "stroke-dasharray": "9 7", class: "later" }));
          const rings2 = [0, 1].map(i => s.el("rect", { x: px(i) - 5, y: py(i) - 5, width: 82, height: 94, rx: 16, fill: "none", stroke: "#dc3b2a", "stroke-width": 5, "stroke-dasharray": "9 7", class: "later" }));
          svg.append(...rings, ...rings2);
          const foto = s.photo("malkasten", { w: 580, h: 330, pos: "50% 60%", caption: "Ein echter Deckfarbkasten: Farbnäpfchen in Reihen", cls: "later" });
          const intro = P(s, "In deinem Malkasten liegen viele <b>Deckfarben</b> in Näpfchen.");
          const ex1 = box(s, "ex", "Wichtig 1: die Grundfarben", "<b>Gelb, Rot, Blau</b> – aus ihnen mischst du fast alles andere.");
          const ex2 = box(s, "ex", "Wichtig 2: Hell und dunkel", "Damit machst du Farben <b>heller</b> oder <b>dunkler</b>.");
          const ex3 = box(s, "life", "Werkzeug", "<b>Pinsel</b>, <b>Wasserglas</b> und <b>Mischpalette</b>. Gemischt wird auf der Palette, nicht im Näpfchen.");
          s.add(cols(s, stack(s, 12, svg, foto), stack(s, 16, intro, ex1, ex2, ex3), 580));
          s.show(svg, "zoom"); s.sfx.whoosh();
          s.step(async () => { for (let i = 0; i < pans.length; i++) { s.sfx.note(i * 2, .12); s.show(pans[i], "pop"); await s.wait(90); } s.show(foto, "up"); s.say("Zwölf Farben im Kasten. Welche sind die wichtigsten?"); });
          s.step(async () => { s.sfx.ding(); s.show(rings, "pop"); await s.show(ex1, "up"); s.sfx.pop(); s.show(rings2, "pop"); await s.show(ex2, "up"); s.say("Gelb, Rot und Blau sind die Grundfarben. Weiß und Schwarz brauchst du zum Abtönen."); });
          s.step(async () => { s.sound("pinsel-wasser", { vol: .7 }); await s.show(ex3, "up"); s.say("Dazu kommen Pinsel, Wasserglas und Mischpalette."); });
        },
      },
      /* 1b --------------------------------------------------------------- */
      {
        title: "Was steckt in der Farbe?",
        say: "In jedem Farbnäpfchen stecken Pigmente. Das sind winzige, farbige Körnchen.",
        build(s) {
          const pf = s.photo("pigmente", { w: 540, h: 405, caption: "Pigmente als Pulver auf einem Markt in Indien", kb: true });
          const e1 = box(s, "ex", "Pigmente", "Jede Malfarbe enthält <b>Pigmente</b>: ganz feines, farbiges Pulver. Ein <b>Bindemittel</b> hält das Pulver zusammen und klebt es aufs Papier.");
          const wave = s.photo("hokusai-welle", { w: 500, h: 250, pos: "50% 50%", caption: "Hokusai: Die große Welle (um 1831)", cls: "later" });
          const e2 = box(s, "life", "Eine Farbe aus Berlin", "<b>Berliner Blau</b> wurde um 1706 in Berlin erfunden – eine der ersten künstlichen Farben. Der Japaner Hokusai druckte damit seine berühmte Welle.");
          s.add(cols(s, pf, stack(s, 14, e1, wave, e2), 540));
          s.show(pf, "zoom");
          s.step(async () => { s.sfx.pop(); await s.show(e1, "up"); s.say("Pigmente und Bindemittel ergeben zusammen die Farbe."); });
          s.step(async () => { s.sound("waves", { vol: .4, dur: 4 }); await s.show(wave, "zoom"); s.say("Das Blau in dieser Welle wurde in Berlin erfunden."); });
          s.step(async () => { s.sfx.ding(); await s.show(e2, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Die Grundfarben",
        say: "Gelb, Rot und Blau sind die Grundfarben. Man kann sie nicht aus anderen Farben mischen.",
        build(s) {
          const svg = s.svg(540, 540);
          const cs = [[270, 130, Y, "Gelb"], [150, 330, R, "Rot"], [390, 330, B, "Blau"]];
          const gs = cs.map(([x, y, c, t]) => {
            const g = s.el("g", { class: "later" }, s.el("circle", { cx: x, cy: y, r: 110, fill: c, stroke: "rgba(27,39,64,.3)", "stroke-width": 4 }),
              s.el("text", { x, y: y + 11, "text-anchor": "middle", "font-size": 34, "font-weight": 800, fill: t === "Gelb" ? "#1b2740" : "#fff", text: t }));
            svg.append(g); return g;
          });
          const tag = s.el("text", { x: 270, y: 495, "text-anchor": "middle", class: "hlbl later", text: "Primärfarben" });
          svg.append(tag);
          const l1 = s.photo("zitronen", { w: 204, h: 190, caption: "Gelb: Zitrone", cls: "later" }), l2 = s.photo("feuerwehr", { w: 204, h: 190, pos: "60% 55%", caption: "Rot: Feuerwehr", cls: "later" }), l3 = s.photo("ostsee", { w: 204, h: 190, caption: "Blau: Meer", cls: "later" });
          svg.style.width = "420px"; svg.style.height = "420px";
          const m = merk(s, "<b>Grundfarben</b> (Primärfarben) kann man nicht mischen. Aus ihnen mischt man fast alle anderen Farben.");
          const pro = box(s, "ex", "Profi-Wissen", "Beim Drucken heißen sie genauer <b>Gelb, Magenta</b> (pinkes Rot) und <b>Cyan</b> (Türkisblau).");
          s.add(cols(s, svg, stack(s, 16, s.h("div", { class: "row", style: { gap: "14px", flexWrap: "nowrap" } }, l1, l2, l3), m, pro), 420));
          s.show(svg, "fade");
          s.step(async () => { for (let i = 0; i < 3; i++) { s.sfx.note([0, 4, 7][i], .25); s.show(gs[i], "bounce"); await s.wait(250); } s.show(tag, "fade"); s.say("Gelb, Rot und Blau."); });
          s.step(async () => { s.sfx.pop(); s.show(l1, "zoom"); await s.wait(300); s.sound("tatuetata", { vol: .45, dur: 2.5 }); s.show(l2, "zoom"); await s.wait(300); s.sound("waves", { vol: .4, dur: 4 }); await s.show(l3, "zoom"); s.say("Gelb sehen wir an der Zitrone, Rot am Feuerwehrauto und Blau im Meer."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(pro, "up"); s.say("Im Drucker heißen sie Gelb, Magenta und Cyan."); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Mischfarben 2. Ordnung",
        say: "Wenn du zwei Grundfarben mischst, entsteht eine Mischfarbe zweiter Ordnung.",
        build(s) {
          const svg = s.svg(540, 540);
          const C = { y: [270, 150], r: [170, 320], b: [370, 320] }, r = 115;
          svg.append(s.el("defs", {},
            s.el("clipPath", { id: "u1cy" }, s.el("circle", { cx: C.y[0], cy: C.y[1], r })),
            s.el("clipPath", { id: "u1cr" }, s.el("circle", { cx: C.r[0], cy: C.r[1], r })),
            s.el("clipPath", { id: "u1cb" }, s.el("circle", { cx: C.b[0], cy: C.b[1], r }))));
          const circ = (k, c) => s.el("circle", { cx: C[k][0], cy: C[k][1], r, fill: c, class: "later" });
          const cy = circ("y", Y), cr = circ("r", R), cb = circ("b", B);
          const lens = (clipId, k, col) => s.el("g", { "clip-path": `url(#${clipId})`, class: "later" }, s.el("circle", { cx: C[k][0], cy: C[k][1], r, fill: col }));
          const lo = lens("u1cy", "r", "#ff8a1a"), lg = lens("u1cy", "b", "#2fa84a"), lv = lens("u1cr", "b", "#7a3a9a");
          const center = s.el("g", { "clip-path": "url(#u1cy)", class: "later" }, s.el("g", { "clip-path": "url(#u1cr)" }, s.el("circle", { cx: C.b[0], cy: C.b[1], r, fill: "#6b4a34" })));
          const tl = [[270, 110, "Gelb", "#1b2740"], [130, 360, "Rot", "#fff"], [410, 360, "Blau", "#fff"]].map(([x, y, t, c]) => s.el("text", { x, y, "text-anchor": "middle", class: "lbl later", "font-weight": 800, "font-size": 26, fill: c, text: t }));
          svg.append(cy, cr, cb, lo, lg, lv, center, ...tl);
          const row = (a, b, c, name) => s.h("div", { class: "ex later", style: { display: "flex", gap: "12px", alignItems: "center" } }, dot(s, a, 40), s.h("b", { style: { fontSize: "28px" } }, "+"), dot(s, b, 40), s.h("b", { style: { fontSize: "28px" } }, "="), dot(s, c, 52), s.h("b", { class: "t" }, name));
          const r1 = row(Y, R, "#ff8a1a", "Orange"), r2 = row(Y, B, "#2fa84a", "Grün"), r3 = row(R, B, "#7a3a9a", "Violett");
          const m = merk(s, "Zwei Grundfarben ergeben eine <b>Mischfarbe 2. Ordnung</b>: Orange, Grün oder Violett.");
          const x = box(s, "life", "Im Alltag", "Im Herbst wird Laub gelb und rot: dazwischen siehst du <b>Orange</b>. Frösche, Gras und Blätter sind <b>grün</b>. Aubergine und Brombeere <b>violett</b>.");
          s.add(cols(s, svg, stack(s, 12, r1, r2, r3, m, x), 540));
          s.show(svg, "fade");
          s.step(async () => { s.sfx.pop(); s.show([cy, tl[0]], "pop"); await s.wait(200); s.show([cr, tl[1]], "pop"); await s.wait(500); s.sfx.snap(); s.show(lo, "pop"); await s.show(r1, "left"); s.say("Gelb und Rot ergeben Orange."); });
          s.step(async () => { s.sfx.pop(); s.show([cb, tl[2]], "pop"); await s.wait(500); s.sfx.snap(); s.show(lg, "pop"); await s.show(r2, "left"); s.say("Gelb und Blau ergeben Grün."); });
          s.step(async () => { s.sfx.snap(); s.show(lv, "pop"); await s.show(r3, "left"); s.say("Rot und Blau ergeben Violett."); });
          s.step(async () => { s.sfx.ding(); s.show(center, "fade"); await s.show(m, "up"); await s.wait(200); s.show(x, "up"); s.say("Mischt du alle drei, wird es ein schmutziges Braun."); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Mischfarben 3. Ordnung",
        say: "Mischst du eine Grundfarbe mit einer Mischfarbe, entstehen noch mehr Farben.",
        build(s) {
          const items = [[0, 2, 1], [2, 4, 3], [4, 6, 5], [6, 8, 7], [8, 10, 9], [10, 0, 11]];
          const cards = items.map(([a, b, c]) => s.h("div", { class: "ex later", style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "18px 12px" } },
            s.h("div", { style: { display: "flex", alignItems: "center", gap: "10px" } }, dot(s, WHEEL[a].c, 54), s.h("b", { style: { fontSize: "30px" } }, "+"), dot(s, WHEEL[b].c, 54), s.h("b", { style: { fontSize: "30px" } }, "="), dot(s, WHEEL[c].c, 66)),
            s.h("p", { class: "t", html: `${WHEEL[a].n} + ${WHEEL[b].n}` }), s.h("p", { class: "h2", style: { color: "var(--ink)" } }, WHEEL[c].n)));
          const m = merk(s, "<b>3. Ordnung</b> = eine Grundfarbe + eine Mischfarbe daneben. So entsteht der Farbkreis mit 12 Farben.");
          s.add(stack(s, 16, P(s, "Eine <b>Grundfarbe</b> und eine <b>Mischfarbe</b> – zum Beispiel Gelb und Orange:", "t"),
            s.h("div", { class: "cols3", style: { gridTemplateColumns: "repeat(3,1fr)", gap: "16px" } }, ...cards), m));
          s.step(async () => { for (const i of [0, 1, 2]) { s.sfx.note(i * 3, .2); s.show(cards[i], "up"); await s.wait(180); } s.say("Gelb und Orange ergeben Gelborange. Orange und Rot ergeben Rotorange."); });
          s.step(async () => { for (const i of [3, 4, 5]) { s.sfx.note(i * 3, .2); s.show(cards[i], "up"); await s.wait(180); } s.say("Und auf der anderen Seite: Blauviolett, Blaugrün und Gelbgrün."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Der Farbkreis nach Itten",
        say: "Der Farbkreis ordnet alle Farben im Kreis. Er baut sich jetzt Stück für Stück auf.",
        build(s) {
          const { svg, wedges, labels } = makeWheel(s, 640, 600, 320, 300, 80, 190, 206);
          const hub = s.el("g", { class: "later" }, s.el("circle", { cx: 320, cy: 300, r: 66, fill: "#fff", stroke: "#c8d3de", "stroke-width": 3 }), s.el("text", { x: 320, y: 307, "text-anchor": "middle", "font-size": 21, "font-weight": 700, fill: "#1b2740", text: "Farbkreis" }));
          svg.append(hub);
          const grp = [[0, 4, 8], [2, 6, 10], [1, 3, 5, 7, 9, 11]];
          const chip = (c, html) => s.h("div", { class: "ex later", style: { display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px" } }, s.h("span", { class: "chip", style: { background: c } }, ""), s.h("p", { class: "small", html }));
          const k1 = chip("#ffd21a", "<b>1. Ordnung:</b> Gelb, Rot, Blau"), k2 = chip("#ff8a1a", "<b>2. Ordnung:</b> Orange, Grün, Violett"), k3 = chip("#9dcc2a", "<b>3. Ordnung:</b> sechs Farben dazwischen");
          const itten = box(s, "ex", "Johannes Itten", "Schweizer Maler und Kunstlehrer (1888–1967). Er lehrte ab 1919 am <b>Bauhaus</b>. Seinen 12-teiligen Farbkreis findest du in seinem Buch <b>„Kunst der Farbe“</b> (1961).");
          const again = s.h("button", { class: "btn later", onclick: async () => { again.disabled = true; s.sfx.whoosh(); [...wedges, ...labels].forEach(e => s.hide(e)); await s.wait(250); for (const g of grp) { for (const i of g) { s.sfx.note(i, .12); s.show([wedges[i], labels[i]], "pop"); await s.wait(110); } await s.wait(200); } again.disabled = false; } }, "Nochmal aufbauen");
          s.add(cols(s, svg, stack(s, 12, P(s, "Im Farbkreis liegen die Farben in <b>12 Teilen</b>. Gelb steht oben."), k1, k2, k3, itten, again), 640));
          s.show(svg, "fade"); s.sfx.whoosh();
          const build = async (i, g) => { for (const j of g) { s.sfx.note(j, .15); s.show([wedges[j], labels[j]], "pop"); await s.wait(170); } };
          s.step(async () => { s.show(hub, "pop"); await build(0, grp[0]); await s.show(k1, "left"); s.say("Zuerst die drei Grundfarben."); });
          s.step(async () => { await build(0, grp[1]); await s.show(k2, "left"); s.say("Dazwischen die drei Mischfarben zweiter Ordnung."); });
          s.step(async () => { await build(0, grp[2]); await s.show(k3, "left"); s.sfx.ding(); s.say("Und zum Schluss die sechs Farben dritter Ordnung."); });
          s.step(async () => { s.sfx.pop(); await s.show(itten, "up"); s.show(again, "pop"); s.say("Dieser Farbkreis stammt von Johannes Itten."); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Farbkreis zum Antippen",
        say: "Tippe ein Stück im Farbkreis an. Dann siehst du, woraus die Farbe gemischt ist.",
        build(s) {
          let sel = -1;
          const parentsRing = [];
          const { svg, wedges, labels } = makeWheel(s, 640, 600, 320, 300, 80, 190, 206, i => pick(i));
          const hub = s.el("circle", { cx: 320, cy: 300, r: 62, fill: "#fff", stroke: "#c8d3de", "stroke-width": 3 });
          const hubc = s.el("circle", { cx: 320, cy: 300, r: 40, fill: "#eee" });
          svg.append(hub, hubc);
          const name = s.h("p", { class: "big" }, "Tippe ein Stück!");
          const ord = s.h("p", { class: "t pencil" }, " ");
          const rec = s.h("div", { class: "row", style: { minHeight: "70px" } });
          const info = s.h("div", { class: "card", style: { minHeight: "230px" } }, name, ord, rec);
          const life = s.photo("buntstifte-kreis", { w: 430, h: 220, pos: "50% 45%", caption: "Im Alltag: Buntstifte im Farbkreis sortiert", cls: "later" });
          function pick(i) {
            sel = i; const w = WHEEL[i]; s.sfx.note(i, .2);
            wedges.forEach((e, j) => { e.setAttribute("stroke", j === i ? "#1b2740" : "#fff"); e.setAttribute("stroke-width", j === i ? 7 : 4); });
            wedges[i].parentNode.append(wedges[i]);
            hubc.setAttribute("fill", w.c);
            name.textContent = w.n; name.className = "big a-pop"; void name.offsetWidth;
            ord.textContent = w.o === 1 ? "Grundfarbe (1. Ordnung)" : w.o === 2 ? "Mischfarbe 2. Ordnung" : "Mischfarbe 3. Ordnung";
            rec.innerHTML = "";
            if (w.p) { rec.append(dot(s, WHEEL[w.p[0]].c, 48), s.h("b", { class: "t" }, WHEEL[w.p[0]].n), s.h("b", { style: { fontSize: "32px" } }, "+"), dot(s, WHEEL[w.p[1]].c, 48), s.h("b", { class: "t" }, WHEEL[w.p[1]].n)); }
            else rec.append(s.h("p", { class: "t" }, "Kann man nicht mischen – sie ist ein Anfang."));
          }
          s.add(cols(s, svg, stack(s, 16, P(s, "Probiere alle 12 Farben aus!"), info, life), 640));
          s.show(svg, "fade");
          s.step(async () => { s.sfx.whoosh(); for (let i = 0; i < 12; i++) { s.show([wedges[i], labels[i]], "pop"); await s.wait(60); } s.say("Tippe auf ein Stück vom Farbkreis."); });
          s.step(async () => { pick(9); s.sfx.pop(); await s.show(life, "zoom"); s.say("Blaugrün ist eine Mischung aus Blau und Grün."); });
        },
      },
      /* 6b --------------------------------------------------------------- */
      {
        title: "Farbkreise aus der Geschichte",
        say: "Schon vor über zweihundert Jahren haben Dichter und Maler Farbkreise gemalt.",
        build(s) {
          const goe = s.photo("goethe-farbkreis", { w: 300, h: 456, pos: "50% 50%", caption: "Goethe, 1809" });
          const mac = s.photo("macke-farbkreis", { w: 520, h: 346, caption: "August Macke: Farbkreis", cls: "later" });
          const e1 = box(s, "ex", "Johann Wolfgang von Goethe", "Der Dichter malte 1809 diesen Farbkreis mit <b>sechs Farben</b>. An jede schrieb er ein Wort, zum Beispiel „schön“ an Rot.");
          const e2 = box(s, "ex", "August Macke (1887–1914)", "Auch der Maler Macke malte sich einen Farbkreis: die Farben laufen als <b>Ringe</b> um die Mitte.");
          s.add(cols(s, goe, stack(s, 14, e1, mac, e2), 300));
          s.show(goe, "zoom"); s.sfx.whoosh();
          s.step(async () => { s.sfx.pop(); await s.show(e1, "up"); s.say("Goethe ordnete sechs Farben im Kreis an."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(mac, "zoom"); s.sfx.pop(); await s.show(e2, "up"); s.say("Und Macke malte die Farben in Ringen."); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Das Mischlabor",
        say: "Tippe auf die Farbtöpfe. Jeder Tipp gibt einen Tropfen in die Schale. Die Farbe mischt sich live.",
        build(s) {
          const W = 620, H = 590;
          const { canvas, g } = s.canvas(W, H);
          const pots = [["y", "Gelb", "#ffd21a"], ["r", "Rot", "#e0262f"], ["b", "Blau", "#1f5fd1"], ["w", "Weiß", "#fafafa"], ["k", "Schwarz", "#222222"]];
          const px = i => 62 + i * 124;
          const n = { y: 0, r: 0, b: 0, w: 0, k: 0 };
          let shown = [240, 236, 226], from = shown, to = shown, tmix = 1, drops = [], blobs = [], bounce = [0, 0, 0, 0, 0];
          const cx = 310, cy = 390;
          const nameEl = s.h("p", { class: "big", style: { minHeight: "46px" } }, "Noch leer");
          const cnt = s.h("p", { class: "small pencil", style: { minHeight: "27px" } }, "0 Tropfen in der Schale");
          const total = () => n.y + n.r + n.b + n.w + n.k;
          let lastName = "";
          function addDrop(i) {
            if (total() >= 16) { s.sfx.error(); s.say("Die Schale ist voll. Leere sie mit dem Knopf."); return; }
            const k = pots[i][0]; s.sfx.pop(); bounce[i] = 1;
            drops.push({ i, t0: performance.now(), col: pots[i][2], k, x0: px(i) });
          }
          function land(d) {
            n[d.k]++; s.sound("wassertropfen", { vol: .5 });
            from = shown.slice(); to = mixModel(n); tmix = 0;
            blobs.push({ t0: performance.now(), col: d.col, a: Math.random() * 6.28 });
            const nm = mixName(n);
            nameEl.textContent = nm; nameEl.className = "big a-pop"; void nameEl.offsetWidth;
            cnt.textContent = total() + (total() === 1 ? " Tropfen" : " Tropfen") + " in der Schale";
            if (nm !== lastName && ["Orange", "Grün", "Violett", "Rosa", "Braun"].includes(nm)) { s.sfx.ding(); s.say(nm + "!"); }
            lastName = nm;
          }
          s.loop((t, dt) => {
            const now = performance.now();
            g.clearRect(0, 0, W, H);
            /* pots */
            pots.forEach(([k, nm, c], i) => {
              bounce[i] = Math.max(0, bounce[i] - dt * 4);
              const sc = 1 + 0.12 * Math.sin(bounce[i] * Math.PI), x = px(i), y = 82;
              g.save(); g.translate(x, y); g.scale(sc, sc);
              g.fillStyle = "#cfd4de"; g.strokeStyle = "#6b7385"; g.lineWidth = 4; g.beginPath(); g.arc(0, 0, 46, 0, 7); g.fill(); g.stroke();
              g.fillStyle = c; g.strokeStyle = "rgba(27,39,64,.4)"; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, 34, 0, 7); g.fill(); g.stroke();
              g.fillStyle = "rgba(255,255,255,.55)"; g.beginPath(); g.ellipse(-12, -14, 9, 5, -0.6, 0, 7); g.fill();
              g.restore();
              g.font = "700 21px 'Atkinson Hyperlegible', system-ui, sans-serif"; g.fillStyle = "#1b2740"; g.textAlign = "center"; g.textBaseline = "alphabetic"; g.fillText(nm, x, 156);
            });
            /* dish */
            g.fillStyle = "rgba(27,39,64,.12)"; g.beginPath(); g.ellipse(cx, cy + 14, 262, 156, 0, 0, 7); g.fill();
            g.fillStyle = "#eceef2"; g.strokeStyle = "#8a93a6"; g.lineWidth = 5; g.beginPath(); g.ellipse(cx, cy, 262, 156, 0, 0, 7); g.fill(); g.stroke();
            if (tmix < 1) { tmix = Math.min(1, tmix + dt / 0.9); shown = from.map((v, k) => v + (to[k] - v) * (1 - Math.pow(1 - tmix, 3))); }
            g.fillStyle = rgb(shown.map(Math.round)); g.beginPath(); g.ellipse(cx, cy, 222, 124, 0, 0, 7); g.fill();
            /* swirls */
            g.save(); g.beginPath(); g.ellipse(cx, cy, 222, 124, 0, 0, 7); g.clip();
            blobs = blobs.filter(b => now - b.t0 < 1100);
            blobs.forEach(b => {
              const u = (now - b.t0) / 1100; g.globalAlpha = (1 - u) * 0.85; g.strokeStyle = b.col; g.lineWidth = 26 * (1 - u) + 4; g.lineCap = "round";
              g.beginPath(); for (let a = 0; a < 3.2; a += 0.2) { const r = 20 + a * 26 * (0.6 + u); const an = b.a + a + u * 5; const X = cx + r * Math.cos(an) * 1.7 * (0.5 + 0.5 * u), Y2 = cy + r * Math.sin(an) * (0.9); a === 0 ? g.moveTo(X, Y2) : g.lineTo(X, Y2); } g.stroke();
            });
            g.restore(); g.globalAlpha = 1;
            g.fillStyle = "rgba(255,255,255,.35)"; g.beginPath(); g.ellipse(cx - 90, cy - 70, 70, 16, -0.25, 0, 7); g.fill();
            /* drops */
            drops = drops.filter(d => {
              const u = Math.min(1, (now - d.t0) / 480); const e = u * u;
              const x = d.x0 + (cx - d.x0) * e, y = 130 + (cy - 130) * e;
              g.fillStyle = d.col; g.strokeStyle = "rgba(27,39,64,.5)"; g.lineWidth = 2; g.beginPath(); g.ellipse(x, y, 11, 15, 0, 0, 7); g.fill(); g.stroke();
              if (u >= 1) { land(d); return false; } return true;
            });
          });
          s.drag(canvas, { space: canvas, onStart: p => { pots.forEach((_, i) => { if (Math.hypot(p.x - px(i), p.y - 82) < 52) addDrop(i); }); } });
          const reset = s.h("button", { class: "btn later", onclick: () => { for (const k in n) n[k] = 0; from = shown.slice(); to = [240, 236, 226]; tmix = 0; nameEl.textContent = "Noch leer"; cnt.textContent = "0 Tropfen in der Schale"; lastName = ""; s.sfx.swoosh(); } }, "Schale leeren");
          const tip = P(s, "Probiere: <b>Gelb + Blau</b>, <b>Rot + Gelb</b>, <b>Blau + Rot</b>. Dann mit Weiß oder Schwarz!", "small", true);
          const lifeBox = s.photo("palette-mischung", { w: 450, h: 220, caption: "So sieht Mischen in echt aus: eine Palette", cls: "later" });
          s.add(cols(s, canvas, stack(s, 14, P(s, "Das sagt die Schale:", "t pencil"), nameEl, cnt, s.h("div", { class: "row" }, reset), tip, lifeBox), 620));
          s.show(canvas, "zoom"); s.sfx.pop();
          s.step(async () => { s.show(reset, "pop"); s.sfx.whoosh(); await s.show(tip, "up"); s.say("Tippe auf die Farbtöpfe und schau, was passiert."); });
          s.step(async () => { s.sfx.pop(); await s.show(lifeBox, "zoom"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Abtönen: hell und dunkel",
        say: "Mit Weiß machst du eine Farbe heller. Mit Schwarz machst du sie dunkler. Das nennt man Abtönen.",
        build(s) {
          const rows = [
            { base: "#1f5fd1", mix: "#ffffff", lab: "Blau + Weiß", dl: "Weiß dazu", names: v => v < 12 ? "Blau" : v < 55 ? "Hellblau" : "Sehr hellblau" },
            { base: "#e0262f", mix: "#ffffff", lab: "Rot + Weiß", dl: "Weiß dazu", names: v => v < 12 ? "Rot" : v < 40 ? "Hellrot" : "Rosa" },
            { base: "#2fa84a", mix: "#111111", lab: "Grün + Schwarz", dl: "Schwarz dazu", names: v => v < 12 ? "Grün" : v < 60 ? "Dunkelgrün" : "Fast Schwarz" },
          ];
          const els = rows.map((r, idx) => {
            const sw = s.h("div", { style: { width: "104px", height: "76px", borderRadius: "16px", border: "3px solid rgba(27,39,64,.3)", background: r.base, flex: "none" } });
            const nm = s.h("p", { class: "h2", style: { width: "230px" } }, r.names(0));
            const strip = s.h("div", { style: { height: "18px", borderRadius: "9px", background: `linear-gradient(90deg, ${r.base}, ${r.mix})`, border: "2px solid rgba(27,39,64,.25)" } });
            const sl = s.slider({ label: r.dl, min: 0, max: 100, step: 1, value: 0, fmt: v => v + " %", onInput: v => { const c = mixHex(r.base, r.mix, v / 100 * (r.mix === "#111111" ? 0.92 : 0.95)); sw.style.background = rgb(c); nm.textContent = r.names(v); } });
            const row = s.h("div", { class: "ex later", style: { display: "flex", alignItems: "center", gap: "20px", padding: "8px 20px" } }, sw, s.h("div", { style: { flex: "1" } }, s.h("p", { class: "small pencil" }, r.lab), strip, sl), nm);
            return { row, sl };
          });
          const m = merk(s, "<b>Weiß</b> macht heller, <b>Schwarz</b> macht dunkler. Nimm Schwarz nur in kleinen Tupfern – es ist sehr kräftig!");
          const life = s.photo("farbfaecher", { w: 420, h: 140, pos: "50% 80%", caption: "Farbfächer: jede Farbe von hell bis dunkel", cls: "later" });
          s.add(stack(s, 10, P(s, "Schiebe die Regler und schau, wie sich die Farbe verändert:", "small"), ...els.map(e => e.row), s.h("div", { class: "cols", style: { gap: "16px", gridTemplateColumns: "1fr 420px", alignItems: "center" } }, m, life)));
          s.step(async () => { s.sfx.pop(); await s.show(els[0].row, "up"); els[0].sl.set(0); s.say("Schiebe den Regler: Blau wird heller."); await s.tween({ from: 0, to: 70, dur: 1400, update: v => els[0].sl.set(Math.round(v)) }); await s.tween({ from: 70, to: 0, dur: 600, update: v => els[0].sl.set(Math.round(v)) }); });
          s.step(async () => { s.sfx.pop(); await s.show(els[1].row, "up"); s.say("Rot mit Weiß ergibt Rosa."); await s.tween({ from: 0, to: 60, dur: 1200, update: v => els[1].sl.set(Math.round(v)) }); });
          s.step(async () => { s.sfx.pop(); await s.show(els[2].row, "up"); s.say("Und Grün mit Schwarz wird ein dunkles Tannengrün."); await s.tween({ from: 0, to: 45, dur: 1200, update: v => els[2].sl.set(Math.round(v)) }); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); await s.wait(150); s.sfx.whoosh(); await s.show(life, "zoom"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Deckfarben und Wasserfarben",
        say: "Deckfarben decken zu. Wasserfarben sind durchsichtig. Das siehst du, wenn Farben übereinander liegen.",
        build(s) {
          const W = 580, H = 540;
          const { canvas, g } = s.canvas(W, H);
          let p1 = 0, p2 = 0, water = 0, showSlider = false;
          function panel(y0, title, kind, prog) {
            g.save();
            g.fillStyle = "#fff"; g.strokeStyle = "#c8d3de"; g.lineWidth = 3; g.beginPath(); g.roundRect(8, y0, W - 16, 244, 18); g.fill(); g.stroke();
            g.font = "700 22px 'Atkinson Hyperlegible', system-ui, sans-serif"; g.fillStyle = "#1b2740"; g.textAlign = "left"; g.textBaseline = "alphabetic"; g.fillText(title, 28, y0 + 34);
            g.fillStyle = "#1f5fd1"; g.fillRect(250, y0 + 48, 90, 180);
            /* strichdicke Linie als Unterlage */
            g.fillStyle = "#1b2740"; g.fillRect(288, y0 + 48, 14, 180);
            const x1 = 40 + (W - 80) * prog;
            g.save(); g.beginPath(); g.rect(0, y0, x1, 260); g.clip();
            if (kind === "deck") { g.globalAlpha = 1 - 0.7 * water; g.fillStyle = "#ffd21a"; }
            else { g.globalCompositeOperation = "multiply"; g.globalAlpha = 1 - 0.65 * water; g.fillStyle = "#ffe033"; }
            g.beginPath(); g.roundRect(40, y0 + 100, W - 80, 76, 30); g.fill();
            g.restore();
            if (prog > 0 && prog < 1) { g.fillStyle = "#c98a3e"; g.save(); g.translate(x1, y0 + 138); g.rotate(-0.6); g.fillRect(0, -6, 70, 12); g.fillStyle = "#e0262f"; g.fillRect(-26, -9, 26, 18); g.restore(); }
            g.restore();
          }
          s.loop(() => { g.clearRect(0, 0, W, H); panel(14, "Deckfarbe (Malkasten)", "deck", p1); panel(274, "Wasserfarbe (Lasur)", "lasur", p2); });
          const sl = s.slider({ label: "Wasser im Pinsel", min: 0, max: 100, step: 1, value: 0, fmt: v => v + " %", onInput: v => (water = v / 100) });
          sl.classList.add("later");
          const e1 = box(s, "ex", "Deckfarbe", "Sie <b>deckt</b> zu, was darunter liegt – auch Dunkles. Malkasten- und Plakatfarbe sind Deckfarben.");
          const e2 = box(s, "ex", "Wasserfarbe / Lasur", "Sie ist <b>durchsichtig</b>: Gelb über Blau wird <b>Grün</b>.");
          const m = merk(s, "<b>Lasur</b> = durchsichtige Farbschicht. Mit mehr Wasser wird jede Farbe durchsichtiger.");
          const life = box(s, "life", "Im Alltag", "Gelbe und blaue Folie übereinander ergeben Grün – wie Lasur.");
          s.add(cols(s, canvas, stack(s, 10, e1, e2, sl, m, life), 580));
          s.show(canvas, "zoom");
          s.step(async () => { s.sfx.swoosh(); await s.tween({ from: 0, to: 1, dur: 1100, update: v => (p1 = v) }); s.sfx.pop(); await s.show(e1, "up"); s.say("Die Deckfarbe deckt den blauen Streifen komplett zu."); });
          s.step(async () => { s.sfx.swoosh(); await s.tween({ from: 0, to: 1, dur: 1100, update: v => (p2 = v) }); s.sfx.pop(); await s.show(e2, "up"); s.say("Die Wasserfarbe ist durchsichtig. Du siehst den Streifen noch."); });
          s.step(async () => { s.show(sl, "pop"); s.sfx.ding(); await s.show(m, "up"); await s.wait(150); s.show(life, "up"); });
        },
      },
      /* 9b --------------------------------------------------------------- */
      {
        title: "Dürer malt mit Wasserfarben",
        say: "Albrecht Dürer, nach dem deine Schule heißt, hat schon vor über fünfhundert Jahren mit Wasserfarben gemalt.",
        build(s) {
          const ras = s.photo("duerer-rasenstueck", { w: 400, h: 514, pos: "50% 60%", caption: "Das große Rasenstück, 1503" });
          const inn = s.photo("duerer-innsbruck", { w: 560, h: 380, caption: "Innsbruck von Norden, um 1495", cls: "later" });
          const e1 = box(s, "ex", "Albrecht Dürer (1471–1528)", "Er malte Gräser und Städte mit <b>Wasserfarben</b> und setzte helle Stellen mit <b>Deckfarbe</b> darauf.");
          const e2 = box(s, "life", "Beide Bilder", "hängen heute in der Albertina in Wien.");
          s.add(cols(s, ras, stack(s, 14, inn, e1, e2), 400));
          s.show(ras, "zoom"); s.sound("pinsel-strich", { vol: .5 });
          s.step(async () => { s.sfx.whoosh(); await s.show(inn, "zoom"); s.say("Auf seiner Reise nach Venedig malte er die Stadt Innsbruck."); });
          s.step(async () => { s.sfx.pop(); await s.show(e1, "up"); await s.wait(150); s.show(e2, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "So malst du mit dem Malkasten",
        say: "Hier siehst du Schritt für Schritt, wie du mit Pinsel, Wasser und Palette arbeitest.",
        build(s) {
          const svg = s.svg(600, 560);
          svg.append(s.el("rect", { x: 20, y: 250, width: 560, height: 290, rx: 14, fill: "#fff", stroke: "#c8d3de", "stroke-width": 3 }));
          /* glass */
          const water = s.el("path", { d: "M56,120 L144,120 L140,190 Q138,200 128,200 L72,200 Q62,200 60,190 Z", fill: "#a9d6f5", opacity: .95 });
          svg.append(s.el("path", { d: "M50,60 L150,60 L140,190 Q138,200 128,200 L72,200 Q62,200 60,190 Z", fill: "#eaf6ff", stroke: "#4b6a8a", "stroke-width": 4 }), water);
          /* tin */
          svg.append(s.el("rect", { x: 180, y: 50, width: 240, height: 125, rx: 14, fill: "#cfd4de", stroke: "#6b7385", "stroke-width": 4 }));
          [[Y, 0, 0], [R, 1, 0], [B, 2, 0], ["#fafafa", 3, 0], ["#2fa84a", 0, 1], ["#ff8a1a", 1, 1], ["#7a3a9a", 2, 1], ["#222", 3, 1]].forEach(([c, i, j]) =>
            svg.append(s.el("circle", { cx: 215 + i * 50, cy: 88 + j * 50, r: 21, fill: c, stroke: "rgba(27,39,64,.4)", "stroke-width": 2 })));
          /* palette */
          svg.append(s.el("path", { d: "M440,100 C440,60 540,55 570,90 C595,120 570,175 520,178 C495,180 500,155 478,153 C445,150 440,130 440,100 Z", fill: "#f1e3c6", stroke: "#a58a5a", "stroke-width": 4 }));
          const mixDot = s.el("circle", { cx: 500, cy: 118, r: 20, fill: Y, class: "later" });
          svg.append(mixDot);
          [[100, "Wasserglas"], [300, "Malkasten"], [508, "Mischpalette"]].forEach(([x, t]) => svg.append(s.el("text", { x, y: 230, "text-anchor": "middle", class: "lbl", text: t })));
          svg.append(s.el("text", { x: 44, y: 284, class: "lbl", fill: "#5d6678", text: "Papier" }));
          const stroke = s.el("path", { d: "M90,410 C200,370 300,450 410,400 C450,382 480,395 500,405", fill: "none", stroke: "#2fa84a", "stroke-width": 34, "stroke-linecap": "round", class: "later" });
          svg.append(stroke);
          const brush = s.el("g", {}, s.el("g", { transform: "rotate(-40)" },
            s.el("path", { d: "M0,0 Q18,-9 42,-9 L42,9 Q18,9 0,0 Z", fill: "#ffd21a", id: "u1tip" }),
            s.el("rect", { x: 42, y: -10, width: 26, height: 20, fill: "#9aa3b2" }), s.el("rect", { x: 68, y: -7, width: 110, height: 14, rx: 7, fill: "#c98a3e" })));
          svg.append(brush);
          const tip = brush.firstChild.firstChild;
          let bx = 300, by = 330;
          const place = () => brush.setAttribute("transform", `translate(${bx} ${by})`);
          place();
          const go = (x, y, dur = 700) => { const x0 = bx, y0 = by; return s.tween({ from: 0, to: 1, dur, ease: "inOut", update: v => { bx = x0 + (x - x0) * v; by = y0 + (y - y0) * v - Math.sin(v * Math.PI) * 30; place(); } }); };
          const steps = [
            ["Pinsel nass machen", "Tauche den Pinsel kurz ins <b>Wasserglas</b>."],
            ["Farbe holen", "Streiche über das Farbnäpfchen: so nimmst du <b>Farbe</b> auf."],
            ["Mischen", "Mische auf der <b>Mischpalette</b>: erst Gelb, dann etwas Blau."],
            ["Malen", "Jetzt malst du auf dein Papier."],
            ["Auswaschen", "Pinsel im Glas <b>auswaschen</b>, abtupfen. Ist das Wasser trüb, hol neues."],
          ];
          const rows = steps.map(([t, d], i) => s.h("div", { class: "ex later", style: { display: "flex", gap: "14px", alignItems: "center", padding: "10px 16px" } },
            s.h("span", { class: "chip", style: { background: UC, color: "#fff", fontSize: "22px", minWidth: "40px", justifyContent: "center" } }, String(i + 1)), s.h("p", { class: "small", html: d })));
          s.add(cols(s, svg, stack(s, 10, ...rows), 600));
          s.show(svg, "fade");
          s.step(async () => { s.show(rows[0], "left"); s.say("Erst den Pinsel ins Wasser."); await go(92, 130); s.sound("pinsel-wasser", { vol: .7 }); await s.wait(300); });
          s.step(async () => { s.show(rows[1], "left"); s.say("Dann Farbe aus dem Näpfchen holen."); await go(215, 88); s.sfx.click(); tip.setAttribute("fill", Y); await s.wait(300); });
          s.step(async () => { s.show(rows[2], "left"); s.say("Auf der Palette mischst du die Farben."); await go(500, 118); s.sfx.pop(); s.show(mixDot, "pop"); await go(315, 88, 600); await go(500, 118, 600); s.sfx.pop(); tip.setAttribute("fill", "#2fa84a"); mixDot.setAttribute("fill", "#2fa84a"); });
          s.step(async () => { s.show(rows[3], "left"); s.say("Und jetzt wird gemalt."); await go(92, 405); s.sound("pinsel-strich", { vol: .7 }); s.show(stroke, "draw"); await go(500, 405, 1000); });
          s.step(async () => { s.show(rows[4], "left"); s.say("Zum Schluss den Pinsel auswaschen."); await go(92, 150); s.sound("splash", { vol: .4 }); water.setAttribute("fill", "#a8c98a"); tip.setAttribute("fill", "#ddd"); await s.wait(300); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Lichtfarben am Bildschirm",
        say: "Auf Bildschirmen mischt sich Licht. Das geht ganz anders als mit Farbe: Es wird heller statt dunkler.",
        build(s) {
          const W = 560, H = 540;
          const { canvas, g } = s.canvas(W, H);
          const cs = [{ x: 205, y: 190, c: "#ff0000", n: "Rot", a: 0 }, { x: 355, y: 190, c: "#00ff00", n: "Grün", a: 0 }, { x: 280, y: 320, c: "#0000ff", n: "Blau", a: 0 }];
          s.loop(() => {
            g.clearRect(0, 0, W, H);
            g.fillStyle = "#0b0d14"; g.beginPath(); g.roundRect(0, 0, W, H, 20); g.fill();
            g.globalCompositeOperation = "lighter";
            cs.forEach(c => { g.globalAlpha = c.a; g.fillStyle = c.c; g.beginPath(); g.arc(c.x, c.y, 105, 0, 7); g.fill(); });
            g.globalCompositeOperation = "source-over"; g.globalAlpha = 1;
            g.font = "700 22px 'Atkinson Hyperlegible', system-ui, sans-serif"; g.fillStyle = "#fff"; g.textAlign = "center";
            cs.forEach(c => { if (c.a > 0.5) g.fillText(c.n, c.x + (c.x - 280) * 0.0, c.y + (c.y < 250 ? -118 : 135)); });
          });
          let grab = -1;
          s.drag(canvas, { space: canvas, onStart: p => { let bd = 110; grab = -1; cs.forEach((c, i) => { const d = Math.hypot(p.x - c.x, p.y - c.y); if (c.a > 0.5 && d < bd) { bd = d; grab = i; } }); if (grab >= 0) s.sfx.click(); },
            onMove: p => { const c = cs[grab]; if (c) { c.x = clamp(p.x, 110, W - 110); c.y = clamp(p.y, 130, H - 135); } } });
          const row = (cols_, txt) => s.h("div", { class: "ex later", style: { display: "flex", gap: "10px", alignItems: "center", padding: "10px 16px" } }, ...cols_.map(c => dot(s, c, 34)), s.h("p", { class: "small", html: txt }));
          const r1 = row(["#ff0000", "#00ff00", "#ffff00"], "Rot + Grün = <b>Gelb</b>");
          const r2 = row(["#00ff00", "#0000ff", "#00ffff"], "Grün + Blau = <b>Cyan</b>");
          const r3 = row(["#0000ff", "#ff0000", "#ff00ff"], "Blau + Rot = <b>Magenta</b>");
          const r4 = row(["#ff0000", "#00ff00", "#0000ff", "#ffffff"], "Alle drei = <b>Weiß</b>");
          const m = merk(s, "<b>Licht</b> mischt sich zu <b>heller</b>. <b>Farbe</b> mischt sich zu <b>dunkler</b>.");
          const life = s.photo("pixel-lcd", { w: 470, h: 140, caption: "Ein Bildschirm unterm Mikroskop", cls: "later" });
                    s.add(cols(s, canvas, stack(s, 10, P(s, "Am Bildschirm mischt sich <b>Licht</b>. Zieh die Kreise!"), r1, r2, r3, r4, m, life), 560));
          s.show(canvas, "zoom");
          s.step(async () => { s.sfx.pop(); await s.tween({ from: 0, to: 1, dur: 500, update: v => (cs[0].a = v) }); s.sfx.pop(); await s.tween({ from: 0, to: 1, dur: 500, update: v => (cs[1].a = v) }); s.sfx.ding(); await s.show(r1, "left"); s.say("Rotes und grünes Licht ergeben Gelb."); });
          s.step(async () => { s.sfx.pop(); await s.tween({ from: 0, to: 1, dur: 500, update: v => (cs[2].a = v) }); s.show(r2, "left"); await s.wait(200); s.show(r3, "left"); await s.wait(200); s.sfx.ding(); await s.show(r4, "left"); s.say("Mit Blau kommen Cyan, Magenta und in der Mitte Weiß dazu."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); await s.wait(150); s.sfx.zap(); s.show(life, "zoom"); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Im Alltag: Der Drucker",
        say: "Dein Drucker mischt nur mit vier Farben. Aus winzigen Punkten entstehen alle Bilder.",
        build(s) {
          const W = 600, H = 500;
          const { canvas, g } = s.canvas(W, H);
          const CMY = [["#00aeef", "Cyan"], ["#ec008c", "Magenta"], ["#ffed00", "Gelb"], ["#1a1a1a", "Schwarz"]];
          let aCart = [0, 0, 0, 0], aV = [0, 0, 0], aLoupe = 0;
          const font = "700 21px 'Atkinson Hyperlegible', system-ui, sans-serif";
          s.loop(() => {
            g.clearRect(0, 0, W, H);
            CMY.forEach(([c, t], i) => {
              g.globalAlpha = aCart[i]; const x = 14 + i * 148, y = 10 + (1 - aCart[i]) * -20;
              g.fillStyle = "#e6e9f0"; g.strokeStyle = "#6b7385"; g.lineWidth = 3; g.beginPath(); g.roundRect(x, y, 124, 96, 12); g.fill(); g.stroke();
              g.fillStyle = c; g.beginPath(); g.roundRect(x + 14, y + 14, 96, 50, 8); g.fill();
              g.fillStyle = "#1b2740"; g.font = font; g.textAlign = "center"; g.fillText(t, x + 62, y + 88 + 28 - 12 * 0 );
            });
            g.globalAlpha = 1;
            /* venn multiply */
            const vc = [[120, 300], [210, 300], [165, 225]];
            g.save(); g.globalCompositeOperation = "multiply";
            vc.forEach(([x, y], i) => { g.globalAlpha = aV[i]; g.fillStyle = CMY[i][0]; g.beginPath(); g.arc(x, y, 84, 0, 7); g.fill(); });
            g.restore(); g.globalAlpha = 1;
            g.font = font; g.fillStyle = "#1b2740"; g.textAlign = "center"; g.globalAlpha = aV[2]; g.fillText("Übereinander gedruckt", 165, 450); g.globalAlpha = 1;
            /* loupe */
            if (aLoupe > 0) {
              g.save(); g.translate(450, 320); g.scale(aLoupe, aLoupe);
              g.fillStyle = "#fff"; g.beginPath(); g.arc(0, 0, 112, 0, 7); g.fill();
              g.save(); g.beginPath(); g.arc(0, 0, 112, 0, 7); g.clip(); g.globalCompositeOperation = "multiply";
              const lay = [[0, "#00aeef", 0.0], [1, "#ec008c", 0.5], [2, "#ffed00", 1.0]];
              lay.forEach(([i, c, ph]) => {
                g.fillStyle = c; const pitch = 26, ang = [15, 75, 0][i] * RAD;
                for (let a = -9; a <= 9; a++) for (let b = -9; b <= 9; b++) {
                  const x = (a + ph * 0.3) * pitch, y = (b + ph * 0.2) * pitch; const X = x * Math.cos(ang) - y * Math.sin(ang), Y2 = x * Math.sin(ang) + y * Math.cos(ang);
                  const d = Math.hypot(X, Y2); const r = 11 - d * 0.045 + (i === 2 ? 1 : 0); if (r < 2) continue;
                  g.beginPath(); g.arc(X, Y2, r, 0, 7); g.fill();
                }
              });
              g.restore();
              g.strokeStyle = "#1b2740"; g.lineWidth = 5; g.beginPath(); g.arc(0, 0, 112, 0, 7); g.stroke();
              g.restore();
              g.font = font; g.fillStyle = "#1b2740"; g.textAlign = "center"; g.globalAlpha = aLoupe; g.fillText("Punkte, stark vergrößert", 450, 462); g.globalAlpha = 1;
            }
          });
          const m = merk(s, "Drucker mischen mit <b>Cyan, Magenta, Gelb</b> und Schwarz (<b>CMYK</b>). Das Bild besteht aus winzigen Punkten.");
          const e1 = box(s, "ex", "Beispiel: Zeitung", "Schau mit der Lupe auf ein Zeitungsfoto: lauter kleine bunte Punkte.");
          const e2 = s.photo("druckerpatronen", { w: 470, h: 210, caption: "Im Drucker: Schwarz, Cyan, Magenta, Gelb", cls: "later" });
          s.add(cols(s, canvas, stack(s, 14, P(s, "Im Drucker ist die Mischung <b>wie beim Malen</b>: Farben liegen übereinander und werden dunkler."), e1, m, e2), 600));
          s.show(canvas, "fade");
          s.step(async () => { for (let i = 0; i < 4; i++) { s.sfx.pop(); await s.tween({ from: 0, to: 1, dur: 260, update: v => (aCart[i] = v) }); } s.say("Vier Farbpatronen: Cyan, Magenta, Gelb und Schwarz."); });
          s.step(async () => { s.sound("tintendrucker", { vol: .6 }); for (let i = 0; i < 3; i++) { await s.tween({ from: 0, to: 1, dur: 400, update: v => (aV[i] = v) }); } s.sfx.ding(); await s.show(m, "up"); s.say("Übereinander gedruckt entstehen Blau, Grün, Rot und in der Mitte ein dunkler Ton."); });
          s.step(async () => { s.sfx.whoosh(); await s.tween({ from: 0, to: 1, dur: 700, ease: "back", update: v => (aLoupe = v) }); await s.show(e1, "up"); await s.wait(150); s.show(e2, "zoom"); s.say("Unter der Lupe siehst du die Punkte."); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Im Alltag: Bildschirm und Baumarkt",
        say: "Auch auf dem iPad und im Baumarkt wird gemischt. Probiere beide Maschinen aus!",
        build(s) {
          /* --- left: pixels --- */
          const L = s.svg(500, 250);
          const stripes = [];
          for (let p = 0; p < 4; p++) for (let k = 0; k < 3; k++) {
            const r = s.el("rect", { x: 20 + p * 118 + k * 36, y: 20, width: 32, height: 150, rx: 6, fill: ["#ff0000", "#00ff00", "#0000ff"][k], opacity: .15 });
            stripes.push(r); L.append(r);
          }
          L.append(s.el("rect", { x: 8, y: 8, width: 484, height: 174, rx: 14, fill: "none", stroke: "#1b2740", "stroke-width": 5 }));
          const lt = s.el("text", { x: 250, y: 215, "text-anchor": "middle", class: "lbl", text: "Vier Pixel, stark vergrößert" });
          const seen = s.el("rect", { x: 390, y: 218, width: 100, height: 28, rx: 8, fill: "#ffff00", stroke: "#1b2740", "stroke-width": 3 });
          L.append(lt);
          const sets = { Gelb: [1, 1, 0], Weiß: [1, 1, 1], Rot: [1, 0, 0], Türkis: [0, 1, 1] };
          const cols_ = { Gelb: "#ffe600", Weiß: "#ffffff", Rot: "#ff2a1a", Türkis: "#00e5e5" };
          const result = s.h("div", { style: { width: "64px", height: "56px", borderRadius: "12px", border: "3px solid #1b2740", background: "#ffe600", flex: "none" } });
          const setPix = n => { stripes.forEach((r, i) => r.setAttribute("opacity", sets[n][i % 3] ? 1 : 0.12)); result.style.background = cols_[n]; };
          const bts = Object.keys(sets).map(n => s.h("button", { class: "btn", style: { minWidth: "88px", padding: "0 14px" }, onclick: () => { setPix(n); s.sfx.zap(); s.say(n === "Weiß" ? "Alle drei leuchten: Weiß." : n + ": " + (n === "Gelb" ? "Rot und Grün leuchten." : n === "Rot" ? "Nur Rot leuchtet." : "Grün und Blau leuchten.")); } }, n));
          setPix("Gelb");
          const left = s.h("div", { class: "ex later", style: { display: "flex", flexDirection: "column", gap: "12px" } }, s.h("p", { class: "h2" }, "iPad-Bildschirm"), L,
            s.h("div", { class: "row", style: { gap: "10px" } }, ...bts, result),
            s.h("p", { class: "small", html: "Jeder Pixel hat drei Lichtpunkte: <b>Rot, Grün, Blau</b>. Rot + Grün leuchten = <b>Gelb</b>." }));
          /* --- right: bucket --- */
          const Rr = s.svg(500, 250);
          const paint = s.el("path", { d: "M170,120 L330,120 L322,200 Q320,214 306,214 L194,214 Q180,214 178,200 Z", fill: "#fafafa" });
          Rr.append(s.el("path", { d: "M160,80 L340,80 L330,205 Q328,226 308,226 L192,226 Q172,226 170,205 Z", fill: "#cfd4de", stroke: "#6b7385", "stroke-width": 5 }), s.el("ellipse", { cx: 250, cy: 80, rx: 90, ry: 16, fill: "#fafafa", stroke: "#6b7385", "stroke-width": 4 }));
          const surf = s.el("ellipse", { cx: 250, cy: 80, rx: 82, ry: 12, fill: "#fafafa" });
          Rr.append(surf);
          const tubes = [[90, "#ffd21a"], [250, "#1f5fd1"], [410, "#e0262f"]].map(([x, c]) => { const g = s.el("g", {}, s.el("rect", { x: x - 22, y: 6, width: 44, height: 40, rx: 8, fill: "#6b7385" }), s.el("rect", { x: x - 12, y: 40, width: 24, height: 12, fill: c })); Rr.append(g); return { x, c }; });
          const drop = s.el("ellipse", { cx: 250, cy: 60, rx: 9, ry: 13, fill: "#fff", opacity: 0 });
          Rr.append(drop);
          const wall = [["Sonnengelb", "#ffe27a", 0], ["Himmelblau", "#a7cdf2", 1], ["Rosa", "#f4b1c0", 2]];
          let wi = 0, cur = [250, 250, 250], busy = false;
          const wname = s.h("p", { class: "h2" }, "Weißer Eimer");
          const mixBtn = s.h("button", { class: "btn solid", onclick: async () => {
            if (busy) return; busy = true; const [nm, col, ti] = wall[wi % 3]; wi++;
            const tb = tubes[ti]; drop.setAttribute("fill", tb.c); drop.setAttribute("opacity", 1);
            for (let k = 0; k < 2; k++) { s.sfx.pop(); await s.tween({ from: 0, to: 1, dur: 350, ease: "in", update: v => { drop.setAttribute("cx", tb.x + (250 - tb.x) * v); drop.setAttribute("cy", 60 + 20 * v + (1 - Math.abs(2 * v - 1)) * -20); } }); }
            drop.setAttribute("opacity", 0); s.sound("farbschuettler", { vol: .5, dur: 1.2 });
            const p0 = cur, p1 = [parseInt(col.slice(1, 3), 16), parseInt(col.slice(3, 5), 16), parseInt(col.slice(5, 7), 16)];
            await s.tween({ from: 0, to: 1, dur: 900, update: v => { cur = p0.map((x, i) => x + (p1[i] - x) * v); const c = rgb(cur.map(Math.round)); paint.setAttribute("fill", c); surf.setAttribute("fill", c); Rr.style.transform = `rotate(${Math.sin(v * 30) * 2}deg)`; } });
            Rr.style.transform = ""; wname.textContent = nm; wname.className = "h2 a-pop"; s.sfx.ding(); busy = false;
          } }, "Farbe mischen");
          Rr.insertBefore(paint, Rr.children[1]);
          const right = s.h("div", { class: "ex later", style: { display: "flex", flexDirection: "column", gap: "12px" } }, s.h("p", { class: "h2" }, "Baumarkt-Mischmaschine"), Rr,
            s.h("div", { class: "row", style: { gap: "14px" } }, mixBtn, wname),
            s.h("p", { class: "small", html: "Im Baumarkt kommen wenige Tropfen <b>Farbpaste</b> in weiße Wandfarbe." }));
          L.style.width = "100%"; Rr.style.width = "100%";
          s.add(s.h("div", { class: "cols", style: { height: "100%", alignItems: "center", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)" } }, left, right));
          s.step(async () => { s.sfx.whoosh(); await s.show(left, "left"); s.say("Auf dem iPad leuchten winzige Punkte in Rot, Grün und Blau. Tippe auf die Knöpfe."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(right, "right"); s.say("Und im Baumarkt kommen ein paar Tropfen Farbe in weiße Wandfarbe. Drücke auf Farbe mischen."); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Das hast du gelernt",
        say: "Das war viel Farbe! Hier ist alles auf einen Blick.",
        build(s) {
          const card = (title, html, vis) => s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", textAlign: "center", padding: "30px 20px", minHeight: "230px" } }, vis, s.h("p", { class: "h2" }, title), s.h("p", { class: "t", html }));
          const dots = (cs, d = 40) => s.h("div", { class: "row", style: { gap: "6px", flexWrap: "nowrap", height: "56px", justifyContent: "center" } }, ...cs.map(c => dot(s, c, d)));
          const wheelMini = (() => { const sv = s.svg(80, 80); WHEEL.forEach((w, i) => sv.append(s.el("path", { d: wedgePath(40, 40, 16, 38, i * 30 - 15, i * 30 + 15), fill: w.c, stroke: "#fff", "stroke-width": 1.5 }))); sv.style.width = "56px"; sv.style.height = "56px"; return sv; })();
          const layer = s.h("div", { style: { position: "relative", width: "90px", height: "56px" } },
            s.h("div", { style: { position: "absolute", left: "12px", top: "0", width: "26px", height: "56px", background: B } }),
            s.h("div", { style: { position: "absolute", left: "0", top: "14px", width: "90px", height: "28px", background: Y, opacity: .6, borderRadius: "14px" } }));
          const cards = [
            card("Grundfarben", "Gelb, Rot, Blau lassen sich nicht mischen.", dots([Y, R, B])),
            card("Mischfarben", "2. Ordnung: Orange, Grün, Violett. Dann die 3. Ordnung.", dots(["#ff8a1a", "#2fa84a", "#7a3a9a"])),
            card("Farbkreis", "12 Teile nach Johannes Itten.", wheelMini),
            card("Abtönen", "Weiß macht hell, Schwarz macht dunkel.", dots(["#1f5fd1", "#7fa6e6", "#d3e1f7", "#14346f"], 34)),
            card("Deck und Lasur", "Deckfarben decken zu. Lasur ist durchsichtig.", layer),
            card("Lichtfarben", "Auf Bildschirmen mischt sich Licht: Rot + Grün = Gelb.", dots(["#ff0000", "#00ff00", "#0000ff"])),
          ];
          s.add(s.h("div", { class: "stack", style: { gap: "16px" } }, P(s, "Deine Farben-Zusammenfassung:", "big"), s.h("div", { class: "cols3", style: { gap: "16px" } }, ...cards)));
          s.step(async () => { for (let i = 0; i < 6; i++) { s.sfx.note([0, 2, 4, 5, 7, 9][i], .2); s.show(cards[i], "pop"); await s.wait(260); } s.sfx.fanfare(); s.say("Du kennst jetzt die Grundfarben, den Farbkreis und weißt, wie man mischt. Weiter geht es mit den Farbkontrasten!"); });
        },
      },
    ],
  });
})();
