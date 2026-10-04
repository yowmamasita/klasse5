/* Kapitel 7 – Kunst im alten Ägypten (Kunst 5/6, Berlin RLP) */
(() => {
  const UC = "#a21caf", INK = "#1b2740", SKIN = "#c98a5b", BLUE = "#2f6db5", RED = "#dc3b2a", GREEN = "#138a5a", OCK = "#d9a21b";
  const cols2 = (s, l, r, lw = 560, gap = 28) => s.h("div", { class: "cols", style: { gridTemplateColumns: lw + "px 1fr", alignItems: "center", height: "100%", gap: gap + "px" } }, l, r);
  const P = (s, html, cls = "t", later = false) => s.h("p", { class: cls + (later ? " later" : ""), html });
  const box = (s, cls, label, html, later = true) => s.h("div", { class: cls + (later ? " later" : "") }, label ? s.h("span", { class: "exlabel" }, label) : null, s.h("p", { class: "small", html }));
  const merk = (s, html, later = true) => s.h("div", { class: "merk" + (later ? " later" : ""), html });
  const stack = (s, gap, ...k) => s.h("div", { class: "stack", style: { gap: gap + "px" } }, ...k);
  const fx = (s, n = "pop") => { try { s.sfx[n](); } catch (e) {} };
  const reveal = (s, els, kind = "pop", snd = "pop", delay = 0) => { fx(s, snd); return s.show(els, kind, delay); };

  /* ---- the standing figure in Egyptian pose (own drawing). Box 300x560, soles y=550, hairline ~y=60 ---- */
  function figure(s, o = {}) {
    const c = 150; let skin = o.skin || SKIN; const sk = [];
    const E = (t, a) => s.el(t, a);
    const skinEl = (t, a) => { const e = E(t, Object.assign({ fill: skin, stroke: INK, "stroke-width": 3, "stroke-linejoin": "round" }, a)); sk.push(e); return e; };
    const grp = (...k) => { const g = E("g", { class: o.all ? "" : "later" }); g.append(...k); return g; };
    const back = `M${c - 36},340 L${c + 4},340 L${c - 8},440 L${c - 12},522 L${c + 26},532 L${c + 26},550 L${c - 50},550 L${c - 52},522 L${c - 54},440 Z`;
    const front = `M${c - 6},340 L${c + 34},340 L${c + 42},440 L${c + 40},520 L${c + 86},532 L${c + 86},550 L${c + 20},550 L${c + 14},440 Z`;
    const legs = grp(skinEl("path", { d: back }), skinEl("path", { d: front }));
    const hip = grp(E("path", { d: `M${c - 34},262 L${c + 36},262 L${c + 52},350 L${c - 40},350 Z`, fill: "#f3efe4", stroke: INK, "stroke-width": 3, "stroke-linejoin": "round" }),
      E("rect", { x: c - 34, y: 262, width: 70, height: 12, fill: OCK, stroke: INK, "stroke-width": 2 }));
    const torsoP = skinEl("path", { d: "" });
    const torso = grp(torsoP);
    const armsL = E("line", { stroke: INK, "stroke-width": 24, "stroke-linecap": "round" }), armsR = E("line", { stroke: INK, "stroke-width": 24, "stroke-linecap": "round" });
    const armsL2 = E("line", { stroke: skin, "stroke-width": 18, "stroke-linecap": "round" }), armsR2 = E("line", { stroke: skin, "stroke-width": 18, "stroke-linecap": "round" });
    sk.push({ setAttribute: (k, v) => { armsL2.setAttribute("stroke", v); armsR2.setAttribute("stroke", v); } });
    const arms = grp(armsL, armsR, armsL2, armsR2);
    const neck = grp(skinEl("rect", { x: c - 12, y: 126, width: 24, height: 38 }));
    const headD = `M${c - 32},88 C${c - 36},56 ${c - 14},44 ${c + 10},46 C${c + 26},48 ${c + 30},62 ${c + 30},72 L${c + 42},92 L${c + 30},97 C${c + 34},104 ${c + 30},110 ${c + 28},112 L${c + 26},122 C${c + 20},138 ${c + 4},140 ${c - 8},134 C${c - 24},128 ${c - 32},110 ${c - 32},88 Z`;
    const head = grp(skinEl("path", { d: headD }),
      E("path", { d: `M${c - 33},100 C${c - 42},50 ${c - 10},38 ${c + 12},42 C${c + 22},44 ${c + 28},54 ${c + 30},66 L${c + 6},64 C${c - 4},70 ${c - 10},86 ${c - 14},124 Z`, fill: "#1b1b2a", stroke: INK, "stroke-width": 3, "stroke-linejoin": "round" }));
    const eyeF = E("g", {}); eyeF.append(E("path", { d: `M${c - 10},80 Q${c + 6},66 ${c + 22},80 Q${c + 6},92 ${c - 10},80 Z`, fill: "#fff", stroke: INK, "stroke-width": 3 }), E("circle", { cx: c + 6, cy: 80, r: 6, fill: INK }), E("path", { d: `M${c - 12},68 Q${c + 6},58 ${c + 24},68`, fill: "none", stroke: INK, "stroke-width": 4, "stroke-linecap": "round" }));
    const eyeS = E("g", { display: "none" }); eyeS.append(E("path", { d: `M${c + 8},78 L${c + 26},76 L${c + 16},86 Z`, fill: "#fff", stroke: INK, "stroke-width": 2.5, "stroke-linejoin": "round" }), E("circle", { cx: c + 19, cy: 79, r: 3.2, fill: INK }), E("path", { d: `M${c + 6},68 L${c + 26},66`, stroke: INK, "stroke-width": 4, "stroke-linecap": "round" }));
    const eye = grp(eyeF, eyeS);
    const navel = grp(E("circle", { cx: c, cy: 250.8, r: 6, fill: RED, stroke: INK, "stroke-width": 2 })); navel.classList.add("later");
    const g = E("g", {}); g.append(legs, hip, torso, arms, neck, head, eye, navel);
    let w = o.w || 150;
    const setW = v => {
      w = v; torsoP.setAttribute("d", `M${c - w / 2},158 L${c + w / 2},158 L${c + 30},262 L${c - 30},262 Z`);
      const lx = c - w / 2 + 8, rx = c + w / 2 - 8;
      [[armsL, armsL2, lx, lx - 6], [armsR, armsR2, rx, rx + 6]].forEach(([a, b, x1, x2]) => [a, b].forEach(l => { l.setAttribute("x1", x1); l.setAttribute("y1", 172); l.setAttribute("x2", x2); l.setAttribute("y2", 300); }));
    };
    setW(w);
    return {
      g, p: { legs, hip, torso, arms, neck, head, eye, navel }, setW,
      setEye(front) { eyeF.setAttribute("display", front ? "" : "none"); eyeS.setAttribute("display", front ? "none" : ""); },
      setSkin(col) { skin = col; sk.forEach(e => e.setAttribute("fill", col)); },
    };
  }
  const place = (fg, x, ground, sc) => fg.g.setAttribute("transform", `translate(${x - 150 * sc} ${ground - 550 * sc}) scale(${sc})`);

  /* ---- Nofretete bust (own simplified homage). Box 420x560 ---- */
  function bust(s) {
    const E = (t, a) => s.el(t, a), C = 210;
    const st = { stroke: INK, "stroke-width": 3.5, "stroke-linejoin": "round" };
    const part = (kind, a) => E(kind, Object.assign({}, st, a));
    const neck = part("path", { d: `M${C - 36},330 L${C - 30},420 L${C + 30},420 L${C + 36},330 Z`, fill: "#d9a070" });
    const collar = [
      part("path", { d: `M${C - 150},470 C${C - 150},400 ${C - 80},372 ${C},372 C${C + 80},372 ${C + 150},400 ${C + 150},470 Z`, fill: BLUE }),
      part("path", { d: `M${C - 120},470 C${C - 118},416 ${C - 70},392 ${C},392 C${C + 70},392 ${C + 118},416 ${C + 120},470 Z`, fill: GREEN }),
      part("path", { d: `M${C - 88},470 C${C - 86},432 ${C - 52},414 ${C},414 C${C + 52},414 ${C + 86},432 ${C + 88},470 Z`, fill: OCK }),
    ];
    const base = part("rect", { x: C - 160, y: 470, width: 320, height: 50, rx: 10, fill: "#b9a07a" });
    const face = part("path", { d: `M${C - 62},210 C${C - 66},300 ${C - 40},350 ${C},360 C${C + 40},350 ${C + 66},300 ${C + 62},210 Z`, fill: "#d9a070" });
    const crown = part("path", { d: `M${C - 64},218 L${C - 86},62 L${C + 86},62 L${C + 64},218 Z`, fill: BLUE });
    const band = part("path", { d: `M${C - 64},218 L${C - 66},192 L${C + 66},192 L${C + 64},218 Z`, fill: OCK });
    const eyeA = E("g", {}), eyeB = E("g", {});
    eyeA.append(E("path", { d: `M${C - 48},250 Q${C - 30},236 ${C - 12},250 Q${C - 30},262 ${C - 48},250 Z`, fill: "#fff", stroke: INK, "stroke-width": 3 }), E("circle", { cx: C - 30, cy: 250, r: 6, fill: INK }), E("path", { d: `M${C - 52},232 Q${C - 30},220 ${C - 8},232`, fill: "none", stroke: INK, "stroke-width": 4, "stroke-linecap": "round" }));
    eyeB.append(E("path", { d: `M${C + 12},250 Q${C + 30},236 ${C + 48},250 Q${C + 30},262 ${C + 12},250 Z`, fill: "#b8794d", stroke: INK, "stroke-width": 3 }), E("path", { d: `M${C + 8},232 Q${C + 30},220 ${C + 52},232`, fill: "none", stroke: INK, "stroke-width": 4, "stroke-linecap": "round" }));
    const nose = E("path", { d: `M${C},262 L${C - 9},306 L${C + 9},306`, fill: "none", stroke: INK, "stroke-width": 3, "stroke-linejoin": "round", "stroke-linecap": "round" });
    const mouth = part("path", { d: `M${C - 26},326 Q${C},316 ${C + 26},326 Q${C},342 ${C - 26},326 Z`, fill: RED });
    const parts = { neck, c1: collar[0], c2: collar[1], c3: collar[2], face, crown, band };
    const g = E("g", {}); g.append(base, neck, ...collar, face, crown, band, eyeA, eyeB, nose, mouth);
    return { g, parts, order: { neck: [neck, base], collar, face: [face], crown: [crown], band: [band], eyes: [eyeA, eyeB, nose, mouth] } };
  }

  Deck.unit({
    id: "u7", num: 7, title: "Kunst im alten Ägypten", color: UC, soft: "#f7e3f9",
    subtitle: "Seitenblick, Raster, Farben und Hieroglyphen",
    blurb: "Aspektive, Raster, Mineralfarben, Relief, Nofretete, Hieroglyphen",
    goals: ["Ägyptische Figuren Teil für Teil zeichnen", "Raster, Bildstreifen und Bedeutungsgröße verstehen", "Mineralfarben und Relief kennenlernen", "Einen Papyrus-Brief und ein Skarabäus-Amulett gestalten"],
    icon(svg, el) {
      svg.append(el("path", { d: "M8,56 L35,12 L62,56 Z", fill: UC, opacity: .18, stroke: UC, "stroke-width": 3, "stroke-linejoin": "round" }),
        el("circle", { cx: 35, cy: 38, r: 7, fill: "#fff", stroke: UC, "stroke-width": 3 }), el("circle", { cx: 37, cy: 38, r: 3, fill: UC }));
    },
    slides: [
      /* 1 ---- Einstieg */
      {
        title: "Kunst am Nil",
        say: "Die Künstler im alten Ägypten hielten sich über dreitausend Jahre an fast dieselben Regeln. Wir entdecken sie.",
        build(s) {
          const pic = s.photo("pyramiden-gizeh", { w: 480, h: 420, pos: "40% 60%", caption: "Die Pyramiden von Gizeh", kb: true });
          const cards = [["Figuren", "Kopf von der Seite, Brust von vorn"], ["Farben", "aus Steinen und Pulver"], ["Relief", "Bilder in Stein"], ["Hieroglyphen", "Schrift aus Bildern"]].map(([a, b], i) =>
            s.h("div", { class: "card later", style: { padding: "12px 16px", borderLeft: `8px solid ${UC}` } }, s.h("p", { class: "t", html: `<b>${a}</b>` }), s.h("p", { class: "small", html: b })));
          const head = P(s, "Ägypten: Kunst mit <span class='hl'>festen Regeln</span>", "big");
          const sub = P(s, "Über 3000 Jahre malten und bauten die Künstler Figuren nach fast demselben Schema.", "t", true);
          const grid = s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" } }, ...cards);
          const note = box(s, "life", "Im Alltag", "In GeWi lernst du das Land am Nil kennen. Hier lernst du, wie seine Bilder gemacht wurden.");
          s.add(cols2(s, pic, stack(s, 16, head, sub, grid, note), 480));
          s.show(pic, "zoom"); s.sound("wind", { vol: .3, dur: 4 });
          s.step(async () => { await reveal(s, sub, "up", "ding"); s.say("Dreitausend Jahre, fast dieselben Regeln."); });
          s.step(async () => { for (const c of cards) { await reveal(s, c, "pop", "pop", 0); } });
          s.step(async () => { await reveal(s, note, "up", "ding"); });
        },
      },
      /* 2 ---- Aspektive */
      {
        title: "Aspektive: Figur Stück für Stück",
        say: "Wir bauen eine ägyptische Figur. Jeder Körperteil wird so gezeigt, wie man ihn am besten erkennt.",
        build(s) {
          const fg = figure(s); const svg = s.svg(300, 560);
          svg.append(s.el("line", { x1: 10, y1: 551, x2: 290, y2: 551, stroke: "#9a8a6a", "stroke-width": 4, "stroke-linecap": "round" }), fg.g);
          const rows = [["Beine und Füße", "von der Seite", BLUE], ["Hüfte und Schurz", "von der Seite", BLUE], ["Schultern und Brust", "von vorn", RED], ["Kopf", "im Profil, von der Seite", BLUE], ["Auge", "von vorn", RED]];
          const list = rows.map(([a, b, col], i) => s.h("div", { class: "card later", style: { borderLeft: `10px solid ${col}`, padding: "8px 16px", display: "flex", gap: "14px", alignItems: "baseline" } }, s.h("b", { class: "h2", style: { color: col } }, String(i + 1)), s.h("span", { class: "t", html: `<b>${a}</b>: ${b}` })));
          const m = merk(s, "Das nennt man <b>Aspektive</b>: Jeder Teil wird von der Seite gezeigt, von der man ihn am besten erkennt.");
          s.add(cols2(s, svg, stack(s, 10, ...list, m), 330));
          s.show(svg, "fade");
          const P_ = fg.p;
          s.step(async () => { s.say("Erst die Beine, von der Seite."); await Promise.all([reveal(s, list[0], "left", "pop"), s.show(P_.legs, "up")]); });
          s.step(async () => { await Promise.all([reveal(s, list[1], "left", "pop"), s.show(P_.hip, "up")]); });
          s.step(async () => { s.say("Schultern und Brust zeigen sie von vorn."); await Promise.all([reveal(s, list[2], "left", "boing"), s.show([P_.torso, P_.arms, P_.neck], "zoom")]); });
          s.step(async () => { await Promise.all([reveal(s, list[3], "left", "pop"), s.show(P_.head, "pop")]); });
          s.step(async () => { s.say("Und das Auge sieht dich direkt an."); await Promise.all([reveal(s, list[4], "left", "ding"), s.show(P_.eye, "zoom")]); });
          s.step(async () => { await reveal(s, m, "up", "success"); });
        },
      },
      /* 3 ---- natürlich vs ägyptisch */
      {
        title: "Natürlich oder ägyptisch?",
        say: "Links siehst du, wie man einen Menschen von der Seite sieht. Rechts drehst du die Schultern nach vorn.",
        build(s) {
          const f1 = figure(s, { all: true, w: 48 }); f1.setEye(false);
          const f2 = figure(s, { all: true, w: 48 }); f2.setEye(false);
          const mk = f => { const v = s.svg(300, 560, { style: "width:250px;height:467px" }); v.append(s.el("line", { x1: 10, y1: 551, x2: 290, y2: 551, stroke: "#9a8a6a", "stroke-width": 4 }), f.g); return v; };
          const v1 = mk(f1), v2 = mk(f2);
          const c1 = s.h("div", { class: "stack", style: { alignItems: "center", gap: "6px" } }, v1, P(s, "<b>Natürlich</b> von der Seite", "small"));
          const c2 = s.h("div", { class: "stack later", style: { alignItems: "center", gap: "6px" } }, v2, P(s, "<b>Ägyptisch</b>", "small"));
          let front = false;
          const sl = s.slider({ label: "Schultern drehen", min: 0, max: 100, step: 1, value: 0, fmt: v => v < 5 ? "Seite" : v > 95 ? "vorn" : v + " %", onInput: v => { f2.setW(48 + (150 - 48) * v / 100); const nf = v > 55; if (nf !== front) { front = nf; f2.setEye(front); fx(s, "pop"); } } });
          const sw = s.h("div", { class: "later" }, sl);
          const t1 = P(s, "Von der Seite sehen wir nur <b>einen</b> Arm, <b>ein</b> Bein und ein schmales Auge.", "t");
          const m = merk(s, "Die Ägypter wollten <b>alles</b> zeigen: Die breiten Schultern und das ganze Auge sieht man nur von vorn.");
          m.classList.add("later");
          const right = stack(s, 14, t1, sw, m);
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "250px 250px 1fr", alignItems: "center", height: "100%", gap: "24px" } }, c1, c2, right));
          s.step(async () => { await reveal(s, c2, "right", "whoosh"); });
          s.step(async () => { await reveal(s, sw, "up", "ding"); s.say("Schiebe den Regler. Die Schultern drehen sich nach vorn, und das Auge auch."); await s.tween({ from: 0, to: 100, dur: 1400, update: v => sl.set(Math.round(v)) }); });
          s.step(async () => { await reveal(s, m, "up", "success"); });
        },
      },
      /* 4 ---- Bedeutungsgröße */
      {
        title: "Bedeutungsgröße",
        say: "Wer wichtig ist, wird groß gemalt. Das ist die Bedeutungsgröße.",
        build(s) {
          const svg = s.svg(560, 540);
          const GR = 470;
          svg.append(s.el("rect", { x: 0, y: 0, width: 560, height: 540, rx: 16, fill: "#fdf6e3" }), s.el("line", { x1: 20, y1: GR + 1, x2: 540, y2: GR + 1, stroke: "#9a8a6a", "stroke-width": 4 }));
          const hold = f => { const h = s.el("g", { class: "later" }); h.append(f.g); f.h = h; return f; };
          const servants = [330, 400, 470].map(x => { const f = figure(s, { all: true, w: 120, skin: "#b9764a" }); place(f, x, GR, .3); return hold(f); });
          const wife = hold(figure(s, { all: true, w: 140 })); place(wife, 200, GR, .5);
          const boss = hold(figure(s, { all: true, w: 150 })); place(boss, 95, GR, .3);
          const L = (x, t) => s.el("text", { x, y: 510, "text-anchor": "middle", class: "lbl later", text: t });
          const l1 = L(95, "Grabherr"), l2 = L(200, "Frau"), l3 = L(400, "Diener");
          svg.append(...servants.map(f => f.h), wife.h, boss.h, l1, l2, l3);
          const ex = box(s, "life", "Im Alltag", "<b>Videospiel:</b> Der Endgegner ist riesig, die Helden sind klein.<br><b>Filmplakat:</b> Der Hauptdarsteller ist am größten.<br><b>Touristenkarte:</b> Der Fernsehturm wird extra groß gezeichnet.");
          const text = stack(s, 16, P(s, "Groß = <span class='hl'>wichtig</span>", "big"), P(s, "In Gräbern ist der Grabherr riesig. Seine Familie ist kleiner, die Diener sind winzig.", "t"), ex);
          s.add(cols2(s, svg, text, 560));
          s.step(async () => { await reveal(s, servants.map(f => f.h), "pop", "pop"); await reveal(s, l3, "fade", "tick"); });
          s.step(async () => { await reveal(s, wife.h, "pop", "pop"); await reveal(s, l2, "fade", "tick"); });
          s.step(async () => {
            s.say("Und jetzt der Grabherr. Er wird richtig groß.");
            s.show(boss.h, "fade"); s.sfx.whoosh(); s.show(l1, "fade");
            await s.tween({ from: .3, to: .85, dur: 900, ease: "elastic", update: v => place(boss, 95 + 40 * (v - .3), GR, v) });
          });
          s.step(async () => { await reveal(s, ex, "up", "ding"); });
        },
      },
      /* 4b ---- Nebamun */
      {
        title: "Echte Grabmalerei: Nebamun",
        say: "Dieses Bild ist über dreitausend Jahre alt. Es zeigt Nebamun bei der Vogeljagd. Findest du die Regeln wieder?",
        build(s) {
          const pic = s.photo("nebamun-jagd", { w: 520, h: 443, fit: "contain", kb: true, style: { background: "#e9eef7" } });
          const e1 = box(s, "ex", "Aspektive", "Nebamuns <b>Kopf</b> ist im Profil, das <b>Auge</b> und die <b>Schultern</b> sind von vorn gemalt.", false);
          const e2 = box(s, "ex", "Bedeutungsgröße", "Nebamun ist <b>groß</b>. Seine Frau steht kleiner hinter ihm, die Tochter sitzt ganz klein zu seinen Füßen.");
          const e3 = box(s, "ex", "Woher?", "Aus seinem Grab bei Theben, <b>um 1350 v. Chr.</b> Heute im British Museum in London.");
          s.add(cols2(s, pic, stack(s, 12, e1, e2, e3), 520));
          s.show(pic, "zoom"); s.sound("birds", { vol: .35, dur: 6 });
          s.step(async () => { await reveal(s, e2, "up", "pop"); s.say("Wer ist am wichtigsten? Der Größte."); });
          s.step(async () => { await reveal(s, e3, "up", "ding"); });
        },
      },
      /* 5 ---- Raster */
      {
        title: "Das Raster aus 18 Quadraten",
        say: "Damit alle Figuren gleich gut aussehen, nutzten die Künstler ein Raster aus Quadraten.",
        build(s) {
          const C = 150, cell = 490 / 18, gy = k => 550 - cell * k;
          const fg = figure(s, { all: true }); fg.setEye(true);
          const svg = s.svg(300, 560);
          const vlines = [], hlines = [];
          for (let k = 0; k <= 10; k++) vlines.push(s.el("line", { x1: 14 + cell * k, y1: gy(0), x2: 14 + cell * k, y2: gy(18), stroke: "#a21caf", "stroke-width": 1.5, opacity: .55, class: "later" }));
          for (let k = 0; k <= 18; k++) hlines.push(s.el("line", { x1: 14, y1: gy(k), x2: 14 + cell * 10, y2: gy(k), stroke: "#a21caf", "stroke-width": 1.5, opacity: .55, class: "later" }));
          const bands = []; for (let k = 0; k < 18; k++) bands.push(s.el("rect", { x: 14, y: gy(k + 1), width: cell * 10, height: cell, fill: UC, opacity: 0 }));
          svg.append(...bands, fg.g, ...vlines, ...hlines);
          const marks = [[0, "Fußsohlen", "#7b4fd6"], [11, "Nabel", RED], [18, "Haaransatz", GREEN]];
          const mk = marks.map(([k, t, col]) => s.el("line", { x1: 14, y1: gy(k), x2: 14 + cell * 10, y2: gy(k), stroke: col, "stroke-width": 5, "stroke-linecap": "round", class: "later" }));
          svg.append(...mk, fg.p.navel);
          fg.p.navel.classList.remove("later");
          const num = s.h("p", { class: "huge mono", style: { color: UC, minWidth: "120px" } }, "0");
          const chips = marks.map(([k, t, col]) => s.h("div", { class: "later row", style: { gap: "10px" } }, s.h("span", { style: { width: "18px", height: "18px", borderRadius: "50%", background: col, display: "inline-block" } }), s.h("span", { class: "t", html: `Linie <b>${k}</b>: ${t}` })));
          const m = merk(s, "Ein Quadrat ist so breit wie die <b>Faust</b> der Person. Über 3000 Jahre blieb das Schema fast gleich.");
          const life = box(s, "life", "Im Alltag", "Karopapier, Minecraft-Blöcke und Pixel im Handy: Auch dort hilft ein Raster beim Zeichnen. Zeichner nutzen ein Gitter, um Bilder genau zu vergrößern.");
          const right = stack(s, 12, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "20px" } }, num, P(s, "Quadrate von den Füßen bis zum Haaransatz", "t")), s.h("div", { class: "stack", style: { gap: "6px" } }, ...chips), m, life);
          s.add(cols2(s, svg, right, 300));
          s.step(async () => { s.sfx.whoosh(); s.show([...vlines, ...hlines], "fade"); await s.wait(500); });
          s.step(async () => {
            s.say("Zähl mit: achtzehn Quadrate.");
            let last = -1;
            await s.tween({ from: 0, to: 18, dur: 2600, ease: "linear", update: v => { const i = Math.floor(v + .001); if (i !== last) { last = i; if (i > 0) s.sfx.count(i - 1); } num.textContent = String(Math.min(18, i)); bands.forEach((b, k) => b.setAttribute("opacity", k === i - 1 ? .35 : 0)); } });
            bands.forEach(b => b.setAttribute("opacity", 0));
          });
          s.step(async () => { for (let i = 0; i < 3; i++) { s.sfx.snap(); s.show(mk[i], "draw"); await reveal(s, chips[i], "left", "pop"); } });
          s.step(async () => { await reveal(s, m, "up", "success"); });
          s.step(async () => { await reveal(s, life, "up", "ding"); });
        },
      },
      /* 6 ---- Bildstreifen */
      {
        title: "Bildstreifen in Gräbern",
        say: "Auf Grabwänden sind die Bilder in Streifen übereinander geordnet. Man liest sie von oben nach unten.",
        build(s) {
          const svg = s.svg(580, 520);
          svg.append(s.el("rect", { x: 4, y: 4, width: 572, height: 512, rx: 10, fill: "#f3dfae", stroke: "#9a6a2a", "stroke-width": 6 }));
          const d1 = s.el("line", { x1: 4, y1: 175, x2: 576, y2: 175, stroke: INK, "stroke-width": 5, class: "later" });
          const d2 = s.el("line", { x1: 4, y1: 345, x2: 576, y2: 345, stroke: INK, "stroke-width": 5, class: "later" });
          svg.append(d1, d2);
          const r1 = s.el("g", { class: "later" }), r2 = s.el("g", { class: "later" }), r3 = s.el("g", { class: "later" });
          [70, 190, 310, 430].forEach((x, i) => { const f = figure(s, { all: true, w: 130, skin: i ? "#b9764a" : SKIN }); place(f, x, 165, .26); r1.append(f.g); r1.append(s.el("path", { d: `M${x + 40},150 L${x + 66},150 L${x + 70},130 L${x + 36},130 Z`, fill: "#c0734a", stroke: INK, "stroke-width": 3 })); });
          for (let i = 0; i < 17; i++) { const x = 20 + i * 33; r2.append(s.el("line", { x1: x, y1: 335, x2: x, y2: 270, stroke: OCK, "stroke-width": 4, "stroke-linecap": "round" }), s.el("ellipse", { cx: x, cy: 266, rx: 6, ry: 12, fill: OCK, stroke: "#9a6a2a", "stroke-width": 2 })); }
          [150, 410].forEach(x => { const f = figure(s, { all: true, w: 130 }); place(f, x, 340, .2); r2.append(f.g); });
          r3.append(s.el("path", { d: "M10,440 Q40,420 70,440 T130,440 T190,440 T250,440 T310,440 T370,440 T430,440 T490,440 T550,440", fill: "none", stroke: BLUE, "stroke-width": 8, "stroke-linecap": "round" }),
            s.el("path", { d: "M10,498 Q40,478 70,498 T130,498 T190,498 T250,498 T310,498 T370,498 T430,498 T490,498 T550,498", fill: "none", stroke: "#6fa3dc", "stroke-width": 7, "stroke-linecap": "round" }),
            s.el("path", { d: "M170,425 Q290,470 410,425 L395,415 L185,415 Z", fill: "#8a5a2b", stroke: INK, "stroke-width": 3, "stroke-linejoin": "round" }),
            s.el("path", { d: "M290,412 L290,372 L340,412 Z", fill: "#fff", stroke: INK, "stroke-width": 3, "stroke-linejoin": "round" }));
          [[70, 470], [130, 490], [510, 470]].forEach(([x, y]) => r3.append(s.el("ellipse", { cx: x, cy: y, rx: 22, ry: 11, fill: "#e08a3a", stroke: INK, "stroke-width": 2.5 }), s.el("path", { d: `M${x + 20},${y} L${x + 36},${y - 10} L${x + 36},${y + 10} Z`, fill: "#e08a3a", stroke: INK, "stroke-width": 2.5, "stroke-linejoin": "round" })));
          const ptr = s.el("circle", { cx: 556, cy: 90, r: 14, fill: UC, stroke: "#fff", "stroke-width": 3, class: "later" });
          svg.append(r1, r2, r3, ptr);
          const items = [["1", "oben: Menschen bringen Gaben"], ["2", "Mitte: Ernte auf dem Feld"], ["3", "unten: Boot auf dem Fluss"]].map(([n, t]) => s.h("div", { class: "card later", style: { padding: "8px 16px", display: "flex", gap: "14px", alignItems: "baseline", borderLeft: `10px solid ${UC}` } }, s.h("b", { class: "h2", style: { color: UC } }, n), s.h("span", { class: "t" }, t)));
          const m = merk(s, "Ein Bildstreifen heißt auch <b>Register</b>. Man liest ihn Streifen für Streifen von oben nach unten.");
          const life = s.photo("menna-ernte", { w: 490, h: 205, pos: "50% 50%", caption: "Grab des Menna: Ernte in zwei Streifen", cls: "later" });
          s.add(cols2(s, svg, stack(s, 8, P(s, "Eine Wand, <span class='hl'>drei Streifen</span>", "big"), ...items, m, life), 580));
          s.step(async () => { await reveal(s, [d1, d2], "draw", "swoosh"); });
          const rr = [[r1, 90], [r2, 260], [r3, 430]];
          rr.forEach(([r, y], i) => s.step(async () => {
            s.show(ptr, "pop"); s.show(items[i], "left"); s.sfx.whoosh(); s.show(r, "left");
            await s.tween({ from: parseFloat(ptr.getAttribute("cy")), to: y, dur: 600, update: v => ptr.setAttribute("cy", v) });
            await s.wait(300);
          }));
          s.step(async () => { await reveal(s, m, "up", "ding"); });
          s.step(async () => { await reveal(s, life, "zoom", "whoosh"); s.say("So sieht das in einem echten Grab aus: Oben wird Getreide geerntet, unten gedroschen und gemessen."); });
        },
      },
      /* 7 ---- Mineralfarben */
      {
        title: "Farben aus Stein",
        say: "Früher gab es keine Tuben. Maler zermahlten Steine zu Pulver. Und eine Farbe wurde sogar künstlich gemischt.",
        build(s) {
          const blob = (x, y, r) => { const j = [1, .8, 1.1, .85, 1.05, .9, 1.1]; return "M" + j.map((k, i) => { const a = i / 7 * Math.PI * 2; return (x + Math.cos(a) * r * k).toFixed(1) + "," + (y + Math.sin(a) * r * k * .8).toFixed(1); }).join(" L") + " Z"; };
          const mk = ({ name, txt, col, src }) => {
            const svg = s.svg(300, 170);
            svg.append(s.el("rect", { x: 0, y: 0, width: 300, height: 170, rx: 12, fill: "#f6f1e4" }));
            const srcG = src.map(o => { const g = s.el("g", {}); g.append(s.el("path", { d: blob(o.x, o.y, o.r), fill: o.color, stroke: INK, "stroke-width": 3, "stroke-linejoin": "round" })); if (o.band) g.append(s.el("path", { d: `M${o.x - o.r * .7},${o.y - 8} Q${o.x},${o.y - 22} ${o.x + o.r * .7},${o.y - 6}`, fill: "none", stroke: o.band, "stroke-width": 4, "stroke-linecap": "round" })); return g; });
            const heap = s.el("path", { d: "M165,152 Q215,70 265,152 Z", fill: col, stroke: INK, "stroke-width": 3, "stroke-linejoin": "round" });
            const heapG = s.el("g", {}); heapG.append(heap); heapG.setAttribute("transform", "translate(215 152) scale(1 0.02) translate(-215 -152)");
            const parts = Array.from({ length: 12 }, () => s.el("circle", { r: 4.5, fill: col, opacity: 0 }));
            svg.append(...srcG, heapG, ...parts);
            const bar = s.h("div", { style: { width: "100%", height: "26px", borderRadius: "8px", background: "#eee6d0", overflow: "hidden" } });
            const fill = s.h("div", { style: { width: "100%", height: "100%", background: col, transform: "scaleX(0)", transformOrigin: "0 50%" } }); bar.append(fill);
            const card = s.h("div", { class: "card later", style: { padding: "12px", display: "flex", flexDirection: "column", gap: "8px" } }, svg, bar, P(s, `<b>${name}</b>`, "h2"), P(s, txt, "small"));
            const run = async () => {
              s.sound("moerser", { vol: .8 });
              await s.tween({ from: 0, to: 1, dur: 1700, ease: "linear", update: t => {
                srcG.forEach((g, i) => { const o = src[i]; const sc = 1 - .75 * t; g.setAttribute("transform", `translate(${o.x} ${o.y}) rotate(${Math.sin(t * 40) * 6 * (1 - t)}) scale(${sc}) translate(${-o.x} ${-o.y})`); });
                heapG.setAttribute("transform", `translate(215 152) scale(1 ${Math.max(.02, t)}) translate(-215 -152)`);
                parts.forEach((p, j) => { const ph = j / 12 * .6, u = Math.max(0, Math.min(1, (t - ph) / .4)), o = src[j % src.length]; const x = o.x + (215 - o.x) * u, y = o.y + (140 - o.y) * u - 50 * Math.sin(Math.PI * u); p.setAttribute("cx", x); p.setAttribute("cy", y); p.setAttribute("opacity", u > 0 && u < 1 ? 1 : 0); });
                fill.style.transform = `scaleX(${t})`;
              } });
              s.sfx.ding();
            };
            return { card, run };
          };
          const cards = [
            mk({ name: "Ocker", txt: "Erdfarbe: gelb, rot oder braun. Eine der ältesten Farben der Menschheit.", col: OCK, src: [{ x: 80, y: 90, r: 52, color: "#b88a3a" }] }),
            mk({ name: "Malachit", txt: "Grünes Kupfermineral. Fein gemahlen wurde es zu Lidschatten!", col: "#1f8f5b", src: [{ x: 80, y: 90, r: 52, color: "#2a7a55", band: "#8fd3b0" }] }),
            mk({ name: "Ägyptisch Blau", txt: "Künstlich gemischt aus Kupfer, Calcium und Silizium.", col: BLUE, src: [{ x: 50, y: 70, r: 26, color: "#c76b3b" }, { x: 105, y: 115, r: 26, color: "#f1f1ec" }, { x: 55, y: 125, r: 24, color: "#d8c48a" }] }),
          ];
          const m = merk(s, "<b>Mineralfarbe</b> = Stein zu Pulver gemahlen. Ägyptisch Blau ist eines der <b>ältesten künstlich</b> hergestellten Farbpigmente, seit über 4500 Jahren belegt.");
          const life = s.photo("blaue-pigmente", { w: 340, h: 200, pos: "50% 55%", caption: "Echte blaue Farbbrocken", cls: "later" });
          s.add(stack(s, 14, s.h("div", { class: "cols3", style: { gap: "20px" } }, ...cards.map(c => c.card)), s.h("div", { class: "row", style: { flexWrap: "nowrap", alignItems: "stretch", gap: "16px" } }, m, life)));
          m.style.flex = "1";
          cards.forEach(c => s.step(async () => { await reveal(s, c.card, "up", "pop"); await c.run(); }));
          s.step(async () => { await reveal(s, m, "up", "success"); await reveal(s, life, "zoom", "pop"); s.say("Solche blauen Farbbrocken aus dem alten Ägypten liegen heute im Museum in Turin."); });
        },
      },
      /* 8 ---- Farbsymbolik */
      {
        title: "Farben mit Bedeutung",
        say: "Auch die Farben hatten eine Bedeutung. Tippe auf Grün oder Schwarz.",
        build(s) {
          const fg = figure(s, { all: true }); fg.setEye(true);
          const svg = s.svg(300, 560, { style: "width:250px;height:467px" });
          svg.append(s.el("line", { x1: 10, y1: 551, x2: 290, y2: 551, stroke: "#9a8a6a", "stroke-width": 4 }), fg.g);
          const info = s.h("div", { class: "card soft", style: { minHeight: "150px" } }, P(s, "Wähle eine Farbe für die Haut des Gottes <b>Osiris</b> und lies, was sie bedeutet.", "t"));
          const say = (html, col) => { info.innerHTML = ""; info.append(P(s, html, "t")); info.style.borderLeft = `10px solid ${col}`; s.show(info, "pop"); };
          const b = (t, col, fn) => s.h("button", { class: "btn", onclick: () => { fx(s, "pop"); fn(); } }, s.h("span", { style: { width: "26px", height: "26px", borderRadius: "50%", background: col, display: "inline-block", border: "2px solid " + INK } }), t);
          const btns = s.h("div", { class: "row later" },
            b("Grün", "#3a9a5a", () => { fg.setSkin("#3a9a5a"); say("<b>Grün</b> bedeutet: Erneuerung, Pflanzen und Fruchtbarkeit. Osiris wurde oft mit grüner Haut gemalt.", "#3a9a5a"); }),
            b("Schwarz", "#25252e", () => { fg.setSkin("#25252e"); say("<b>Schwarz</b> steht für die Unterwelt und den fruchtbaren Boden am Nil. Auch Osiris wurde so gemalt.", "#25252e"); }),
            b("Hautton", SKIN, () => { fg.setSkin(SKIN); say("So malen wir einen Menschen. Götter durften ihre <b>Bedeutungs-Farbe</b> tragen.", SKIN); }));
          const life = s.photo("osiris-gruen", { w: 520, h: 250, pos: "78% 45%", caption: "Echt: Osiris mit grüner Haut, Totenbuch des Hunefer", cls: "later" });
          s.add(cols2(s, s.h("div", { class: "stack", style: { alignItems: "center", gap: "6px" } }, svg, P(s, "Eigene Zeichnung", "small")), stack(s, 16, P(s, "Farben sagen <span class='hl'>etwas</span>", "big"), btns, info, life), 270));
          s.step(async () => { await reveal(s, btns, "up", "ding"); });
          s.step(async () => { fg.setSkin("#3a9a5a"); s.sfx.boing(); say("<b>Grün</b> bedeutet: Erneuerung, Pflanzen und Fruchtbarkeit. Osiris wurde oft mit grüner Haut gemalt.", "#3a9a5a"); await s.wait(600); });
          s.step(async () => { fg.setSkin("#25252e"); s.sfx.boing(); say("<b>Schwarz</b> steht für die Unterwelt und den fruchtbaren Boden am Nil. Auch Osiris wurde so gemalt.", "#25252e"); await s.wait(600); });
          s.step(async () => { await reveal(s, life, "zoom", "whoosh"); s.say("Hier siehst du Osiris in einem echten Totenbuch. Er sitzt rechts auf dem Thron, mit grüner Haut."); });
        },
      },
      /* 9 ---- Relief */
      {
        title: "Relief: erhaben und versenkt",
        say: "Ein Relief ist ein Bild aus Stein. Beim Verschieben des Lichts siehst du den Unterschied.",
        build(s) {
          const W = 330, H = 190, sc = .8;
          const ankh = (cx, cy) => {
            const loop = new Path2D(); loop.ellipse(cx, cy - 60 * sc, 34 * sc, 46 * sc, 0, 0, Math.PI * 2); loop.ellipse(cx, cy - 60 * sc, 16 * sc, 28 * sc, 0, 0, Math.PI * 2);
            const cr = new Path2D(); const k = v => v * sc;
            cr.moveTo(cx - k(11), cy - k(14)); cr.lineTo(cx + k(11), cy - k(14)); cr.lineTo(cx + k(11), cy + k(4)); cr.lineTo(cx + k(52), cy + k(4)); cr.lineTo(cx + k(52), cy + k(28)); cr.lineTo(cx + k(11), cy + k(28)); cr.lineTo(cx + k(11), cy + k(102)); cr.lineTo(cx - k(11), cy + k(102)); cr.lineTo(cx - k(11), cy + k(28)); cr.lineTo(cx - k(52), cy + k(28)); cr.lineTo(cx - k(52), cy + k(4)); cr.lineTo(cx - k(11), cy + k(4)); cr.closePath();
            return [loop, cr];
          };
          const shapes = ankh(W / 2, 100);
          const sunAt = (g, a) => { const x = W / 2 + Math.cos(a) * (W / 2 - 26), y = H / 2 - Math.sin(a) * (H / 2 - 24); g.fillStyle = "#ffd94a"; g.strokeStyle = "#ee7a1a"; g.lineWidth = 3; for (let i = 0; i < 8; i++) { g.beginPath(); g.moveTo(x + Math.cos(i * .785) * 16, y + Math.sin(i * .785) * 16); g.lineTo(x + Math.cos(i * .785) * 23, y + Math.sin(i * .785) * 23); g.stroke(); } g.beginPath(); g.arc(x, y, 12, 0, 7); g.fill(); g.stroke(); };
          const draw = (g, mode, deg) => {
            const a = deg * Math.PI / 180, dx = -Math.cos(a) * 7, dy = Math.sin(a) * 7;
            g.clearRect(0, 0, W, H); g.fillStyle = "#dcc79f"; g.fillRect(0, 0, W, H);
            g.strokeStyle = "rgba(120,90,50,.18)"; g.lineWidth = 1.5; for (let y = 30; y < H; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
            shapes.forEach(p => {
              if (mode === "up") {
                g.save(); g.translate(dx, dy); g.fillStyle = "rgba(70,45,20,.5)"; g.fill(p, "evenodd"); g.restore();
                g.fillStyle = "#efdcb8"; g.fill(p, "evenodd"); g.strokeStyle = "#b39a6c"; g.lineWidth = 2; g.stroke(p);
              } else {
                g.save(); g.clip(p, "evenodd"); g.fillStyle = "#8d7448"; g.fillRect(0, 0, W, H); g.translate(-dx, -dy); g.fillStyle = "#cdb88e"; g.fill(p, "evenodd"); g.restore();
                g.strokeStyle = "#8a7048"; g.lineWidth = 2; g.stroke(p);
              }
            });
            sunAt(g, a);
          };
          const mkc = () => s.canvas(W, H);
          const c1 = mkc(), c2 = mkc();
          let ang = 135; const redraw = () => { draw(c1.g, "up", ang); draw(c2.g, "down", ang); }; redraw();
          const prof = (up) => { const v = s.svg(W, 64); const line = up ? `M0,40 L100,40 L100,14 L230,14 L230,40 L${W},40` : `M0,14 L100,14 L100,40 L230,40 L230,14 L${W},14`; v.append(s.el("path", { d: line + ` L${W},62 L0,62 Z`, fill: "#c9ad7c", stroke: INK, "stroke-width": 3, "stroke-linejoin": "round" })); return v; };
          const mkCard = (title, c, up, txt) => s.h("div", { class: "card later", style: { padding: "10px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" } }, P(s, `<b>${title}</b>`, "h2"), c.canvas, prof(up), P(s, txt, "small"));
          const k1 = mkCard("Erhaben", c1, true, "Der Hintergrund wird weggenommen. Die Figur steht heraus."), k2 = mkCard("Versenkt", c2, false, "Die Figur wird in die Wand hineingearbeitet.");
          const sl = s.slider({ label: "Licht dreht sich", min: 0, max: 360, step: 5, value: 135, fmt: v => v + "°", onInput: v => { ang = v; redraw(); } });
          const slw = s.h("div", { class: "later" }, sl);
          const life = s.photo("relief-amarna", { w: 330, h: 264, pos: "50% 45%", caption: "Versenktes Relief, Amarna", cls: "later" });
          const m = merk(s, "Die alten Ägypter arbeiteten Figuren und Linien auch als <b>Hohlform</b> in die Fläche hinein. Das ist ein <b>versenktes</b> Relief.");
          s.add(stack(s, 12, s.h("div", { class: "cols", style: { gap: "20px" } }, k1, k2), s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 330px", gap: "20px", alignItems: "center" } }, stack(s, 10, slw, m), life)));
          s.step(async () => { await reveal(s, k1, "up", "pop"); });
          s.step(async () => { await reveal(s, k2, "up", "pop"); });
          s.step(async () => { await reveal(s, slw, "up", "ding"); s.say("Drehe das Licht und schau, wo die Schatten wandern."); s.sfx.whoosh(); await s.tween({ from: 135, to: 315, dur: 2200, ease: "inOut", update: v => { ang = v; sl.set(Math.round(v / 5) * 5); } }); });
          s.step(async () => { await reveal(s, m, "up", "success"); });
          s.step(async () => { s.sound("meissel", { vol: .6, dur: 2 }); await s.show(life, "zoom"); s.say("Ein echtes versenktes Relief aus Amarna: König Echnaton, Nofretete und ihre Tochter."); });
        },
      },
      /* 10 ---- Nofretete */
      {
        title: "Nofretete in Berlin",
        say: "Die berühmte Büste der Nofretete steht in Berlin, im Neuen Museum. So sieht sie in echt aus.",
        build(s) {
          const pic = s.photo("nofretete", { w: 420, h: 600, fit: "contain", kb: true, style: { background: "#000" } });
          const fact = (big, t, later = true) => s.h("div", { class: "card" + (later ? " later" : ""), style: { padding: "8px 16px", display: "flex", gap: "14px", alignItems: "baseline", borderLeft: `10px solid ${UC}` } }, s.h("b", { class: "h2", style: { color: UC, minWidth: "118px" }, html: big }), s.h("span", { class: "t", html: t }));
          const num = s.h("span", { class: "mono" }, "0");
          const f1 = fact("", "", true); f1.querySelector("b").innerHTML = ""; f1.querySelector("b").append(num, " cm"); f1.lastChild.innerHTML = "hoch";
          const f2 = fact("1912", "am 6. Dezember in Amarna gefunden, in der Werkstatt des Bildhauers Thutmosis");
          const f3 = fact("um 1340", "v. Chr. entstanden");
          const f4 = fact("Kalkstein", "mit einer bemalten Stuck-Schicht");
          const f5 = fact("1 Auge", "ist leer. Warum, wissen die Forscher nicht genau.");
          const f6 = fact("Neues Museum", "auf der Museumsinsel Berlin (dort seit 2009)");
          s.add(cols2(s, pic, stack(s, 9, f1, f2, f3, f4, f5, f6), 440));
          s.show(pic, "zoom"); fx(s, "whoosh");
          s.step(async () => { await reveal(s, f1, "left", "pop"); await s.tween({ from: 0, to: 49, dur: 900, update: v => { num.textContent = String(Math.round(v)); } }); await reveal(s, [f2, f3], "left", "pop"); });
          s.step(async () => { await reveal(s, [f4, f5, f6], "left", "pop"); });
        },
      },
      /* 11 ---- Meine Nofretete (ausmalen) */
      {
        title: "Meine Nofretete",
        say: "Jetzt bist du dran. Wähle eine Farbe und tippe auf einen Teil der Büste.",
        build(s) {
          const b = bust(s); const svg = s.svg(420, 540); svg.setAttribute("viewBox", "0 20 420 520"); svg.setAttribute("style", "height:540px;width:420px"); svg.append(b.g);
          const defaults = {}; Object.entries(b.parts).forEach(([k, e]) => { defaults[k] = e.getAttribute("fill"); });
          const cols = [["Ägyptisch Blau", BLUE], ["Malachit", "#1f8f5b"], ["Ocker", OCK], ["Rot", RED], ["Schwarz", "#25252e"], ["Weiß", "#f6f3ea"]];
          let cur = cols[0][1], curBtn = null;
          const btns = cols.map(([n, c], i) => { const bt = s.h("button", { class: "btn", style: { width: "100%", justifyContent: "flex-start", padding: "0 12px" }, onclick: () => { cur = c; fx(s, "click"); sel(bt); } }, s.h("span", { style: { width: "28px", height: "28px", borderRadius: "50%", background: c, border: "2px solid " + INK, flex: "none" } }), s.h("span", { style: { fontSize: "19px" } }, n)); return bt; });
          const sel = bt => { if (curBtn) curBtn.classList.remove("solid"); curBtn = bt; bt.classList.add("solid"); };
          sel(btns[0]);
          Object.values(b.parts).forEach(e => { e.style.cursor = "pointer"; e.addEventListener("click", () => { e.setAttribute("fill", cur); s.sfx.note(Math.floor(Math.random() * 8), .15); }); });
          const reset = s.h("button", { class: "btn", onclick: () => { Object.entries(b.parts).forEach(([k, e]) => e.setAttribute("fill", defaults[k])); fx(s, "swoosh"); } }, "Zurück zu den Originalfarben");
          const side = stack(s, 14, P(s, "Male <span class='hl'>deine</span> Nofretete", "big"), P(s, "1. Farbe wählen. 2. Auf Krone, Band, Kragen, Gesicht oder Hals tippen.", "t"),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" } }, ...btns), reset,
            box(s, "life", "Im Alltag", "So wählst du auch bei einem Poster für dein Zimmer: erst Farben aussuchen, dann malen.", false));
          s.add(cols2(s, s.h("div", { class: "stack", style: { alignItems: "center" } }, svg), side, 430));
          s.step(async () => { s.sfx.ding(); s.say("Probiere auch eine ganz andere Farbe für die Krone aus."); await s.wait(300); });
        },
      },
      /* 12 ---- Hieroglyphen */
      {
        title: "Hieroglyphen: Schrift als Kunst",
        say: "Hieroglyphen sind Schrift und Bild zugleich. Tippe auf die Zeichen.",
        build(s) {
          const glyph = (kind, w = 100) => {
            const v = s.svg(100, 100, { style: `width:${w}px;height:${w}px` });
            const st = { fill: "none", stroke: INK, "stroke-width": 5, "stroke-linecap": "round", "stroke-linejoin": "round" };
            if (kind === "bird") v.append(s.el("ellipse", Object.assign({}, st, { cx: 46, cy: 58, rx: 28, ry: 18, fill: "#fff" })), s.el("circle", Object.assign({}, st, { cx: 74, cy: 38, r: 10, fill: "#fff" })), s.el("path", Object.assign({}, st, { d: "M82,36 L94,41 L83,45", fill: INK })), s.el("path", Object.assign({}, st, { d: "M20,52 L6,40 M20,60 L4,60" })), s.el("path", Object.assign({}, st, { d: "M42,76 L42,92 M56,76 L58,92" })), s.el("circle", { cx: 76, cy: 36, r: 2.5, fill: INK }));
            if (kind === "water") [34, 50, 66].forEach(y => v.append(s.el("path", Object.assign({}, st, { d: `M12,${y} L28,${y - 12} L44,${y} L60,${y - 12} L76,${y} L90,${y - 10}`, stroke: BLUE }))));
            if (kind === "sun") v.append(s.el("circle", Object.assign({}, st, { cx: 50, cy: 50, r: 34, fill: "#fff3c4", stroke: "#e08a00" })), s.el("circle", { cx: 50, cy: 50, r: 7, fill: "#e08a00" }));
            if (kind === "eye") v.append(s.el("path", Object.assign({}, st, { d: "M10,50 Q50,14 90,50 Q50,78 10,50 Z", fill: "#fff" })), s.el("circle", { cx: 50, cy: 50, r: 11, fill: INK }), s.el("path", Object.assign({}, st, { d: "M50,76 Q46,92 36,90" })));
            if (kind === "house") v.append(s.el("path", Object.assign({}, st, { d: "M42,72 L22,72 L22,30 L78,30 L78,72 L58,72", fill: "none" })), s.el("path", Object.assign({}, st, { d: "M36,52 L64,52", "stroke-width": 4 })));
            return v;
          };
          const items = [["bird", "Vogel"], ["water", "Wasser"], ["sun", "Sonne"], ["eye", "Auge"], ["house", "Haus"]];
          const cards = items.map(([k, n]) => { const lab = s.h("p", { class: "small later", style: { textAlign: "center", fontWeight: 700 } }, n); const c = s.h("div", { class: "card later", style: { padding: "8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer" }, onclick: () => { s.sfx.coin(); s.show(lab, "pop"); } }, glyph(k, 96), lab); c.lab = lab; return c; });
          const row1 = s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "14px" } }, ...cards);
          // reading direction
          const line = s.svg(430, 80); const xs = [380, 300, 220, 140, 60];
          const order = ["bird", "sun", "water", "eye", "house"];
          const dirG = s.el("g", {}); xs.forEach((x, i) => { const gv = glyph(order[i], 64); gv.setAttribute("x", x - 32); gv.setAttribute("y", 8); gv.setAttribute("width", 64); gv.setAttribute("height", 64); dirG.append(gv); });
          const arrow = s.el("path", { d: "M415,76 L20,76", stroke: UC, "stroke-width": 5, fill: "none", "stroke-linecap": "round", class: "later" });
          const ah = s.el("path", { d: "M32,66 L16,76 L32,86", stroke: UC, "stroke-width": 5, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round", class: "later" });
          line.setAttribute("viewBox", "0 0 430 92"); line.setAttribute("height", 92); line.append(dirG, arrow, ah);
          const dir = s.h("div", { class: "card later", style: { padding: "10px 14px" } }, line, P(s, "Meist von <b>rechts nach links</b>. Die Tiere schauen zum Anfang des Textes.", "small"));
          const cart = s.svg(250, 92); cart.append(s.el("rect", { x: 6, y: 8, width: 238, height: 62, rx: 31, fill: "#fff", stroke: UC, "stroke-width": 5 }));
          [["sun", 22], ["bird", 92], ["water", 162]].forEach(([k, x]) => { const gv = glyph(k, 52); gv.setAttribute("x", x); gv.setAttribute("y", 13); gv.setAttribute("width", 52); gv.setAttribute("height", 52); cart.append(gv); });
          const car = s.h("div", { class: "card later", style: { padding: "10px 14px", display: "flex", flexDirection: "column", alignItems: "center" } }, cart, P(s, "<b>Kartusche:</b> Ein Oval um einen Königsnamen.", "small"));
          const m = merk(s, "Manche Zeichen stehen für ein ganzes Wort, andere für einen Laut. Jean-François Champollion entzifferte die Schrift bis 1822, mit Hilfe des <b>Steins von Rosette</b>.");
          s.add(stack(s, 12, P(s, "Jedes Zeichen ist ein kleines <span class='hl'>Kunstwerk</span>", "big"), row1, s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 330px", gap: "16px", alignItems: "stretch" } }, dir, car), m));
          s.step(async () => { await reveal(s, cards, "pop", "pop"); s.say("Tippe auf die Karten. Dann siehst du, was das Bild bedeutet."); });
          s.step(async () => { cards.forEach(c => s.show(c.lab, "fade")); await reveal(s, dir, "up", "whoosh"); await reveal(s, [arrow], "draw", "swoosh"); s.show(ah, "fade"); });
          s.step(async () => { await reveal(s, car, "up", "ding"); });
          s.step(async () => { await reveal(s, m, "up", "success"); });
        },
      },
      /* 13 ---- Papyrus-Brief */
      {
        title: "Dein Papyrus-Brief",
        say: "So wurde Papyrus gemacht. Und so kannst du selbst einen Brief gestalten.",
        build(s) {
          const svg = s.svg(420, 420);
          svg.append(s.el("defs", {}, s.el("clipPath", { id: "papclip" }, s.el("rect", { x: 56, y: 56, width: 308, height: 308 }))));
          const sheet = s.el("g", {});
          const vs = [], hs = [];
          for (let i = 0; i < 8; i++) vs.push(s.el("rect", { x: 56 + i * 38, y: 56, width: 42, height: 308, fill: i % 2 ? "#c3cb7c" : "#cdd58a", stroke: "#8a9440", "stroke-width": 1.5, class: "later" }));
          for (let i = 0; i < 8; i++) hs.push(s.el("rect", { x: 56, y: 56 + i * 38, width: 308, height: 42, fill: i % 2 ? "#d2c97f" : "#dbd392", opacity: .93, stroke: "#9a9040", "stroke-width": 1.5, class: "later" }));
          sheet.append(...vs, ...hs);
          const shine = s.el("path", { d: "M-40,364 L10,364 L110,56 L60,56 Z", fill: "#fff", opacity: 0, "clip-path": "url(#papclip)" });
          const ink = s.el("g", { class: "later" });
          const st = { fill: "none", stroke: "#2a1f10", "stroke-width": 5, "stroke-linecap": "round", "stroke-linejoin": "round" };
          const marks = [s.el("circle", Object.assign({}, st, { cx: 120, cy: 110, r: 24 })), s.el("path", Object.assign({}, st, { d: "M86,190 L106,168 L126,190 L146,168 L166,190" })), s.el("path", Object.assign({}, st, { d: "M90,250 Q130,224 170,250 Q130,276 90,250 Z" })), s.el("rect", Object.assign({}, st, { x: 100, y: 304, width: 60, height: 36, stroke: RED })), s.el("path", Object.assign({}, st, { d: "M230,100 L330,100 M230,130 L310,130 M230,160 L336,160 M230,190 L300,190" }))];
          ink.append(...marks);
          svg.append(sheet, shine, ink);
          const steps = ["Mark der Pflanze in Streifen schneiden (bis 4 cm breit), leicht überlappend legen", "Zweite Schicht quer darüber legen", "Pressen und klopfen: Der Pflanzensaft klebt", "Trocknen und polieren", "Beschreiben: deine Bildzeichen!"];
          const rows = steps.map((t, i) => s.h("div", { class: "card later", style: { padding: "8px 14px", display: "flex", gap: "12px", alignItems: "baseline", borderLeft: `10px solid ${UC}` } }, s.h("b", { class: "h2", style: { color: UC } }, String(i + 1)), s.h("span", { class: "t", style: { fontSize: "21px" } }, t)));
          const m = merk(s, "<b>Basteltipp:</b> Streifen aus braunem Papier kreuzweise aufkleben, trocknen lassen und mit Tusche oder Filzstift eigene Bildzeichen malen. Für eine Einladung, einen Wunschzettel oder einen Brief an Oma.");
          s.add(cols2(s, svg, stack(s, 8, ...rows, m), 420, 24));
          s.step(async () => { s.show(rows[0], "left"); s.sfx.whoosh(); await s.show(vs, "down", 0); });
          s.step(async () => { s.show(rows[1], "left"); s.sfx.whoosh(); await s.show(hs, "left", 0); });
          s.step(async () => { s.show(rows[2], "left"); s.sound("knock", { vol: .7 }); for (let i = 0; i < 3; i++) { await s.tween({ from: 0, to: 1, dur: 260, update: t => sheet.setAttribute("transform", `translate(210 210) scale(1 ${1 - .06 * Math.sin(t * Math.PI)}) translate(-210 -210)`) }); } });
          s.step(async () => {
            s.show(rows[3], "left"); s.sfx.swoosh();
            const col = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
            await s.tween({ from: 0, to: 1, dur: 900, update: t => { vs.forEach((r, i) => r.setAttribute("fill", `rgb(${col(i % 2 ? [195, 203, 124] : [205, 213, 138], [232, 214, 160], t)})`)); hs.forEach((r, i) => r.setAttribute("fill", `rgb(${col(i % 2 ? [210, 201, 127] : [219, 211, 146], [238, 222, 170], t)})`)); } });
            await s.tween({ from: 0, to: 1, dur: 700, update: t => { shine.setAttribute("opacity", .6 * Math.sin(t * Math.PI)); shine.setAttribute("transform", `translate(${t * 420} 0)`); } });
          });
          s.step(async () => { s.show(rows[4], "left"); s.show(ink, "fade"); s.sfx.scribble(); await s.show(marks, "draw", 0); });
          s.step(async () => { await reveal(s, m, "up", "success"); });
        },
      },
      /* 13b ---- Totenbuch und Rosette */
      {
        title: "Echte Schrift: Papyrus und Stein",
        say: "Hier siehst du echte Hieroglyphen: auf einem Totenbuch aus Papyrus und auf dem Stein von Rosette.",
        build(s) {
          const a = s.photo("totenbuch-hunefer", { w: 640, h: 291, fit: "cover", pos: "50% 50%", caption: "Totenbuch des Hunefer" });
          const b = s.photo("stein-rosette", { w: 400, h: 400, pos: "50% 40%", caption: "Stein von Rosette", cls: "later" });
          const e1 = box(s, "ex", "Das Totenbuch", "Eine Papyrus-Rolle mit Sprüchen und Bildern für die Reise ins Jenseits. Diese ist <b>über 3000 Jahre</b> alt. Oben: Hieroglyphen. Rechts: Osiris auf dem Thron.", false);
          const e2 = box(s, "ex", "Der Stein von Rosette", "Derselbe Text <b>dreimal</b>: in Hieroglyphen, in einer ägyptischen Schreibschrift und auf Griechisch. Gefunden 1799.");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "640px 400px", gap: "24px", alignItems: "center", height: "100%" } },
            stack(s, 12, a, e1), stack(s, 12, b, e2)));
          s.show(a, "zoom"); fx(s, "whoosh");
          s.step(async () => { s.sound("meissel", { vol: .6, dur: 2 }); s.show(e2, "up"); await s.show(b, "zoom"); s.say("Weil man Griechisch lesen konnte, konnte Champollion die Hieroglyphen entziffern."); });
        },
      },
      /* 14 ---- Skarabäus */
      {
        title: "Dein Skarabäus-Amulett",
        say: "Der Skarabäus war ein Glücksbringer. Male auf eine Hälfte, die andere Hälfte malt sich von selbst.",
        build(s) {
          const W = 440, H = 420, CX = 220;
          const base = s.svg(W, H), top = s.svg(W, H);
          const body = "M100,250 a120,140 0 1,0 240,0 a120,140 0 1,0 -240,0";
          base.append(s.el("g", { stroke: INK, "stroke-width": 8, "stroke-linecap": "round" }, ...[[-1, 190], [-1, 250], [-1, 310], [1, 190], [1, 250], [1, 310]].map(([d, y]) => s.el("path", { d: `M${CX + d * 112},${y} L${CX + d * 170},${y + (y > 250 ? 28 : y < 250 ? -28 : 0)}`, fill: "none" }))),
            s.el("ellipse", { cx: CX, cy: 250, rx: 120, ry: 140, fill: "#e6edf0", stroke: INK, "stroke-width": 6 }), s.el("ellipse", { cx: CX, cy: 105, rx: 70, ry: 38, fill: "#e6edf0", stroke: INK, "stroke-width": 6 }),
            s.el("ellipse", { cx: CX, cy: 250, rx: 120, ry: 140, fill: "#e6edf0" }));
          top.append(s.el("line", { x1: CX, y1: 145, x2: CX, y2: 390, stroke: INK, "stroke-width": 4, "stroke-dasharray": "2 10", "stroke-linecap": "round" }),
            s.el("ellipse", { cx: CX, cy: 250, rx: 120, ry: 140, fill: "none", stroke: INK, "stroke-width": 6 }), s.el("path", { d: "M150,105 a70,38 0 0 1 140,0", fill: "none", stroke: INK, "stroke-width": 6 }));
          const cv = s.canvas(W, H); const g = cv.g;
          const clip = new Path2D(); clip.ellipse(CX, 250, 118, 138, 0, 0, 7); clip.ellipse(CX, 105, 68, 36, 0, 0, 7);
          g.save(); g.clip(clip);
          let col = BLUE;
          const seg = (x1, y1, x2, y2, w = 9) => { g.strokeStyle = col; g.lineWidth = w; g.lineCap = "round"; [[x1, x2], [W - x1, W - x2]].forEach(([a, b]) => { g.beginPath(); g.moveTo(a, y1); g.lineTo(b, y2); g.stroke(); }); };
          const dot = (x, y, r) => { g.fillStyle = col; [x, W - x].forEach(a => { g.beginPath(); g.arc(a, y, r, 0, 7); g.fill(); }); };
          let last = null;
          const cvEl = cv.canvas; cvEl.style.cssText += ";position:absolute;left:0;top:0;touch-action:none";
          s.drag(cvEl, { space: cvEl, onStart: p => { last = p; seg(p.x, p.y, p.x + .1, p.y + .1); s.sfx.tick(); }, onMove: p => { if (last) { seg(last.x, last.y, p.x, p.y); last = p; } }, onEnd: () => { last = null; } });
          const wrap = s.h("div", { style: { position: "relative", width: W + "px", height: H + "px" } }, base, cvEl, top);
          [base, top].forEach(v => { v.style.position = "absolute"; v.style.left = "0"; v.style.top = "0"; }); base.style.position = "absolute"; top.style.pointerEvents = "none"; wrap.append(top);
          const clear = () => { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.restore(); g.clearRect(0, 0, W, H); };
          const stripes = () => { const o = []; for (let i = 0; i < 8; i++) for (let k = 0; k < 8; k++) o.push(() => seg(CX - 130 + k * 16.3, 150 + i * 32, CX - 130 + (k + 1) * 16.3 + 1, 150 + i * 32, 12)); return o; };
          const dots = () => { const o = []; for (let i = 0; i < 7; i++) for (let k = 0; k < 6; k++) o.push(() => { dot(CX - 100 + k * 18 + (i % 2) * 9, 165 + i * 34, 6); s.sfx.tick(); }); return o; };
          const zig = () => { const o = []; for (let i = 0; i < 6; i++) for (let k = 0; k < 8; k++) o.push(() => seg(CX - 130 + k * 17, 170 + i * 36 + (k % 2 ? 0 : 22), CX - 130 + (k + 1) * 17, 170 + i * 36 + (k % 2 ? 22 : 0), 8)); return o; };
          let busy = false;
          const play = async ops => { if (busy) return; busy = true; s.sfx.scribble(); let n = 0; await s.tween({ from: 0, to: 1, dur: 1300, ease: "linear", update: t => { const k = Math.floor(t * ops.length + .999); while (n < k) ops[n++](); } }); while (n < ops.length) ops[n++](); busy = false; };
          const colors = [["Blau", BLUE], ["Grün", "#1f8f5b"], ["Ocker", OCK], ["Rot", RED], ["Schwarz", "#25252e"], ["Weiß", "#fff"]];
          let curBtn = null; const sel = (b) => { if (curBtn) curBtn.style.outline = "none"; curBtn = b; b.style.outline = `4px solid ${UC}`; b.style.outlineOffset = "2px"; };
          const cb = colors.map(([n, c]) => { const b = s.h("button", { class: "btn", "aria-label": n, style: { width: "60px", padding: "0" }, onclick: () => { col = c; s.sfx.click(); sel(b); } }, s.h("span", { style: { width: "34px", height: "34px", borderRadius: "50%", background: c, border: "2px solid " + INK } })); return b; });
          sel(cb[0]);
          const pb = [["Streifen", stripes], ["Punkte", dots], ["Zickzack", zig]].map(([n, f]) => s.h("button", { class: "btn", onclick: () => play(f()) }, n));
          const clr = s.h("button", { class: "btn", onclick: () => { clear(); s.sfx.swoosh(); } }, "Löschen");
          const controls = s.h("div", { class: "stack later", style: { gap: "10px" } }, s.h("div", { class: "row", style: { gap: "8px" } }, ...cb), s.h("div", { class: "row", style: { gap: "10px" } }, ...pb, clr));
          const txt = P(s, "Für die Ägypter war der Käfer ein Zeichen für <b>Auferstehung</b> und den Lauf der Sonne.", "t");
          const txt2 = P(s, "Als Amulett kam er mit ins Grab, aber auch Lebende trugen ihn als Schmuck.", "t", true);
          const hint = P(s, "Male mit dem Finger auf den Käfer. Die andere Hälfte malt sich von selbst.", "small", true);
          s.add(cols2(s, wrap, stack(s, 14, P(s, "Skarabäus: <span class='hl'>Glücksbringer</span>", "big"), txt, txt2, controls, hint), W, 28));
          s.step(async () => { await reveal(s, txt2, "up", "pop"); });
          s.step(async () => { await reveal(s, controls, "up", "ding"); s.show(hint, "fade"); s.say("Wähle eine Farbe und male, oder tippe auf ein Muster."); await play(zig()); });
        },
      },
      /* 15 ---- Im Alltag */
      {
        title: "Im Alltag: Bildzeichen heute",
        say: "Bildzeichen gibt es überall. Emoji, Schilder und Comic-Figuren arbeiten ähnlich wie die alten Ägypter.",
        build(s) {
          const emo = ["🚻", "🚲", "⚠️", "🅿️"].map(e => s.h("span", { class: "later", style: { fontSize: "60px", lineHeight: "1.1" } }, e));
          const c1 = s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "10px" } }, P(s, "<b>Emoji und Piktogramme</b>", "h2"), s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", justifyItems: "center" } }, ...emo), P(s, "Ein kleines Bild sagt mehr als viele Worte. So wie ein Bildzeichen vor über 4000 Jahren.", "small"));
          const sg = s.svg(300, 120); const stk = { stroke: "#fff", "stroke-width": 6, "stroke-linecap": "round", fill: "none" };
          sg.append(s.el("rect", { x: 6, y: 10, width: 110, height: 100, rx: 10, fill: "#138a5a" }), s.el("circle", Object.assign({}, stk, { cx: 40, cy: 36, r: 8, fill: "#fff" })), s.el("path", Object.assign({}, stk, { d: "M40,46 L52,70 L36,96 M52,70 L74,64 M40,50 L26,66" })), s.el("path", Object.assign({}, stk, { d: "M84,34 L100,34 L100,90 M84,90 L100,90" })),
            s.el("circle", { cx: 176, cy: 60, r: 48, fill: RED }), s.el("rect", { x: 148, y: 52, width: 56, height: 16, rx: 3, fill: "#fff" }),
            s.el("rect", { x: 238, y: 10, width: 56, height: 100, rx: 10, fill: BLUE }), s.el("text", { x: 266, y: 85, "text-anchor": "middle", "font-size": 64, "font-weight": 800, fill: "#fff", text: "P" }));
          const c2 = s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "10px" } }, P(s, "<b>Info-Schilder</b>", "h2"), sg, P(s, "Notausgang, Einfahrt verboten, Parkplatz: Jeder versteht sie sofort, auch ohne Worte.", "small"));
          const fg = figure(s, { all: true, w: 48 }); fg.setEye(false); const fs = s.svg(300, 560, { style: "width:132px;height:246px" }); fs.append(fg.g);
          let egy = false;
          const tg = s.h("button", { class: "btn solid", onclick: () => { egy = !egy; s.sfx.boing(); s.tween({ from: egy ? 48 : 150, to: egy ? 150 : 48, dur: 500, ease: "back", update: v => fg.setW(v) }); fg.setEye(egy); } }, "Umdrehen");
          const c3 = s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "10px" } }, P(s, "<b>Comic-Pose</b>", "h2"), s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "14px" } }, fs, s.h("div", { class: "stack" }, tg)), P(s, "Zeichner nutzen manchmal denselben Trick: Kopf im Profil, Brust von vorn. So sieht man alles gut.", "small"));
          const mm = merk(s, "Bildzeichen helfen, weil man sie <b>ohne Lesen</b> versteht. Genau deshalb malten die Ägypter ihre Schrift als Bilder.");
          s.add(stack(s, 20, s.h("div", { class: "cols3", style: { alignItems: "start" } }, c1, c2, c3), mm));
          s.step(async () => { await reveal(s, c1, "up", "pop"); for (const e of emo) { s.sfx.coin(); await s.show(e, "bounce"); } });
          s.step(async () => { await reveal(s, c2, "up", "pop"); });
          s.step(async () => { await reveal(s, c3, "up", "pop"); s.say("Tippe auf Umdrehen und sieh, wie die Pose wechselt."); });
          s.step(async () => { await reveal(s, mm, "up", "success"); });
        },
      },
      /* 16 ---- Museum */
      {
        title: "Dein Museumsbesuch",
        say: "Wenn du Ägypten im Museum besuchst, kannst du auf Entdeckungstour gehen.",
        build(s) {
          const tasks = ["Ein Kopf im Profil, aber das Auge von vorn", "Wer ist am größten gemacht?", "Bildstreifen mit mehreren Reihen", "Ein Relief: erhaben oder versenkt?", "Welche Farben siehst du: Blau, Grün, Ocker?", "Eine Kartusche mit einem Königsnamen"];
          const rows = tasks.map(t => { const box_ = s.h("span", { style: { width: "30px", height: "30px", border: "3px solid " + UC, borderRadius: "8px", flex: "none", display: "grid", placeItems: "center", fontWeight: 800, color: UC, fontSize: "22px" } });
            const r = s.h("div", { class: "card later", style: { padding: "14px 18px", display: "flex", gap: "14px", alignItems: "center", cursor: "pointer" }, onclick: () => { const on = !r.dataset.on; r.dataset.on = on ? "1" : ""; box_.textContent = on ? "✓" : ""; s.sfx[on ? "ding" : "click"](); } }, box_, s.h("span", { class: "t", style: { fontSize: "24px" } }, t)); return r; });
          const tips = [["Skizzenbuch und Bleistift", "mitnehmen und ein Stück in Ruhe zeichnen"], ["Erst schauen, dann lesen", "Was fällt dir auf, bevor du das Schild liest?"], ["Fotos", "Frag vorher, ob fotografieren erlaubt ist"], ["Nofretete", "steht im Neuen Museum auf der Museumsinsel"]].map(([a, b]) => s.h("div", { class: "life later", style: { padding: "16px 20px" } }, s.h("p", { class: "t", style: { fontSize: "26px" }, html: `<b>${a}</b>` }), s.h("p", { class: "t", style: { fontSize: "21px" }, html: b })));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "1.15fr 1fr", alignItems: "start", gap: "26px" } },
            stack(s, 10, P(s, "Such-Auftrag: <span class='hl'>Tippe, was du findest</span>", "h2"), ...rows),
            stack(s, 10, P(s, "Tipps für den Besuch", "h2"), ...tips)));
          s.step(async () => { for (const r of rows) { s.sfx.pop(); await s.show(r, "left"); } });
          s.step(async () => { for (const t of tips) { s.sfx.pop(); await s.show(t, "up"); } s.say("Viel Spaß beim Entdecken!"); });
        },
      },
    ],
  });
})();
