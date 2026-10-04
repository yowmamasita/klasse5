/* Kapitel 6 – Ägypten: Geschenk des Nils (RLP GeWi 5/6, Thema 3.2 Wasser)
   Quellen: siehe Abschlussbericht (Herodot II,5; Wikipedia: Nil, Nilschwemme, Egyptian calendar, Nilometer,
   Schaduf, Papyrus, Papier, Assuan-Staudamm, Spree, Altes Ägypten, Lehre des Cheti, Slavery in ancient Egypt …). */
(() => {
  const C = "#2f7d32";
  const DES = "#f0c987", DES2 = "#e3a95c", NILE = "#2f86c9", FIELD = "#7cbf5a", MUD = "#3a2e25", SEA = "#9fd0ee";

  const grid = (s, tpl, ...kids) => s.h("div", { style: { display: "grid", gridTemplateColumns: tpl, gap: "26px", alignItems: "center", height: "100%" } }, ...kids);
  const exc = (s, label, cls, ...kids) => s.h("div", { class: "ex" + (cls ? " " + cls : "") }, s.h("span", { class: "exlabel" }, label), ...kids);
  const lifeBox = (s, cls, ...kids) => s.h("div", { class: "life" + (cls ? " " + cls : "") }, s.h("span", { class: "exlabel" }, "Im Alltag"), ...kids);
  const p = (s, cls, ...kids) => s.h("p", { class: cls }, ...kids);
  const B = (s, t) => s.h("b", null, t);
  const svgBox = (s, w, h, vw, vh) => s.el("svg", { width: w, height: h, viewBox: `0 0 ${vw || w} ${vh || h}` });
  const txt = (s, x, y, t, o = {}) => s.el("text", Object.assign({ x, y, "font-size": 21, "font-weight": 700, fill: "#1b2740", "text-anchor": "middle", text: t }, o));
  async function countUp(s, el, to, { dur = 900, dec = 0, post = "", from = 0, raw = false } = {}) {
    const F = v => (raw ? String(Math.round(v)) : s.fmt(v, dec));
    let last = -1;
    await s.tween({ from, to, dur, ease: "out", update: v => { el.textContent = F(v) + post; const k = Math.floor((v - from) / ((to - from) / 8 || 1)); if (k !== last) { last = k; s.sfx.tick(); } } });
    el.textContent = F(to) + post;
  }
  // stick figure
  function person(s, x, y, col = "#1b2740", k = 1) {
    const g = s.el("g", { transform: `translate(${x},${y}) scale(${k})` });
    g.append(s.el("circle", { cx: 0, cy: -44, r: 9, fill: col }), s.el("path", { d: "M0,-35 L0,-10 M0,-10 L-9,10 M0,-10 L9,10 M-12,-26 L12,-26", stroke: col, "stroke-width": 4.5, "stroke-linecap": "round", fill: "none" }));
    return g;
  }

  /* ---------- Egypt map: x=(lon-24.5)*40, y=(32.2-lat)*52 ---------- */
  const E = (lon, lat) => [(lon - 24.5) * 40, (32.2 - lat) * 52];
  const NILE_PTS = [[31.4, 22.0], [31.6, 22.34], [32.4, 23.4], [32.9, 24.09], [32.93, 24.45], [32.87, 24.98], [32.64, 25.69], [32.72, 26.16], [32.24, 26.05], [31.7, 26.56], [31.18, 27.18], [30.75, 28.1], [31.1, 29.07], [31.24, 30.04]];
  const toD = pts => "M" + pts.map(q => E(q[0], q[1]).map(v => v.toFixed(1)).join(",")).join(" L");
  function egyptMap(s, w = 500, h = 540) {
    const svg = svgBox(s, w, h, 500, 540);
    svg.append(s.el("rect", { x: 0, y: 0, width: 500, height: 540, fill: DES, rx: 16 }));
    svg.append(s.el("path", { d: "M0,0 L500,0 L500,40 L390,47 L312,49 L292,36 L236,39 L216,52 L178,71 L108,44 L26,34 L0,34 Z", fill: SEA }));
    svg.append(s.el("path", { d: "M322,116 L372,257 L440,432 L500,520 L500,330 L430,215 L392,224 Z", fill: SEA }), s.el("path", { d: "M392,224 L416,140", stroke: SEA, "stroke-width": 8, "stroke-linecap": "round" }));
    svg.append(s.el("path", { d: "M0,530 L500,530", stroke: "#9b6b2f", "stroke-width": 2.5, "stroke-dasharray": "7 6" }));
    const green = s.el("path", { d: toD(NILE_PTS), fill: "none", stroke: FIELD, "stroke-width": 20, "stroke-linejoin": "round", "stroke-linecap": "round", class: "later" });
    const delta = s.el("path", { d: "M270,112 L216,52 L236,39 L292,36 L312,49 Z", fill: FIELD, class: "later" });
    const nile = s.el("path", { d: toD(NILE_PTS), fill: "none", stroke: NILE, "stroke-width": 6, "stroke-linejoin": "round", "stroke-linecap": "round", class: "later" });
    const arms = [s.el("path", { d: "M270,112 L250,80 L236,39", fill: "none", stroke: NILE, "stroke-width": 4, class: "later" }), s.el("path", { d: "M270,112 L285,75 L292,36", fill: "none", stroke: NILE, "stroke-width": 4, class: "later" })];
    svg.append(green, delta, nile, ...arms);
    const lbl = {
      med: txt(s, 420, 28, "Mittelmeer", { fill: "#1d5bd0" }),
      red: txt(s, 438, 305, "Rotes Meer", { fill: "#1d5bd0", transform: "rotate(62 438 305)" }),
      wueste: txt(s, 120, 330, "Wüste", { "font-size": 30, fill: "#9b6b2f", class: "later" }),
      wueste2: txt(s, 120, 362, "(Deschret)", { "font-size": 21, fill: "#9b6b2f", class: "later" }),
      delta: txt(s, 330, 92, "Nildelta", { "text-anchor": "start", fill: "#1f5e22", class: "later" }),
    };
    svg.append(...Object.values(lbl));
    const city = (lon, lat, name, dx, dy, anchor) => { const [x, y] = E(lon, lat); const g = s.el("g", { class: "later" }); g.append(s.el("circle", { cx: x, cy: y, r: 7, fill: "#c0392b", stroke: "#fff", "stroke-width": 2.5 }), txt(s, x + dx, y + dy, name, { "text-anchor": anchor })); svg.append(g); return g; };
    const cities = [city(31.24, 30.04, "Kairo", -14, 7, "end"), city(32.64, 25.69, "Luxor", -14, 7, "end"), city(32.9, 24.09, "Assuan", 14, 7, "start")];
    const north = s.el("g", { class: "later" });
    north.append(s.el("path", { d: "M60,500 L60,430 M48,446 L60,428 L72,446", stroke: "#1b2740", "stroke-width": 4, fill: "none", "stroke-linecap": "round" }), txt(s, 60, 420, "N"));
    svg.append(north);
    return { svg, nile, arms, green, delta, lbl, cities, north };
  }

  Deck.unit({
    id: "u6", num: 6, title: "Ägypten: Geschenk des Nils", color: C, soft: "#e3f2e4",
    subtitle: "Wie ein Fluss eine Hochkultur möglich machte",
    blurb: "Nilschwemme, Schaduf, Kalender, Schreiber und Papyrus.",
    goals: ["Ägypten und den Nil auf der Karte zeigen", "Die Nilschwemme und die drei Jahreszeiten erklären", "Bewässerung mit Kanälen und Schaduf verstehen", "Merkmale einer Hochkultur nennen", "Die Gesellschaft als Pyramide beschreiben"],
    icon(svg, el) {
      svg.append(el("path", { d: "M8,60 L35,14 L62,60 Z", fill: "#f0c987", stroke: "#9b6b2f", "stroke-width": 3 }),
        el("path", { d: "M4,66 Q20,58 35,66 T66,66", fill: "none", stroke: "#2f86c9", "stroke-width": 5, "stroke-linecap": "round" }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Ägypten und der Nil",
        say: "Ägypten liegt im Nordosten Afrikas. Fast das ganze Land ist Wüste. Mitten hindurch fließt der Nil.",
        build(s) {
          const m = egyptMap(s);
          const big = s.h("span", { class: "huge", style: { color: C } }, "0");
          const c1 = exc(s, "Der Nil", "later", s.h("div", { class: "row", style: { gap: "12px", flexWrap: "nowrap" } }, big, p(s, "t", "Kilometer lang")), p(s, "small", "Einer der längsten Flüsse der Erde. Er kommt aus dem Süden und mündet im Norden ins Mittelmeer."));
          const c2 = exc(s, "Achtung, Karte!", "later", p(s, "small", "Der Nil fließt ", B(s, "von Süden nach Norden"), " – auf der Karte also von unten nach oben."));
          const c3 = exc(s, "Grün und Gelb", "later", p(s, "small", "Nur am Fluss und im ", B(s, "Delta"), " ist das Land grün. Rechts und links: Wüste."));
          s.add(grid(s, "500px 1fr", m.svg, s.h("div", { class: "stack" }, c1, c2, c3)));
          s.show(m.svg, "zoom"); s.sfx.whoosh();
          s.step(async () => { s.sfx.whoosh(); await s.show(m.nile, "draw"); s.sfx.pop(); await s.show(m.arms, "draw"); s.show(c1, "left"); await countUp(s, big, 6650, { dur: 1100 }); });
          s.step(async () => { s.sfx.pop(); s.show(m.north, "down"); await s.show(c2, "left"); for (let i = 2; i >= 0; i--) { s.sfx.count(2 - i); await s.show(m.cities[i], "pop"); } });
          s.step(async () => { s.sfx.whoosh(); s.show(m.green, "draw"); s.show(m.delta, "fade"); s.show([m.lbl.delta, m.lbl.wueste, m.lbl.wueste2], "pop"); await s.show(c3, "left"); s.say("Grün ist nur das Land am Fluss. Alles andere ist Wüste."); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "„Ein Geschenk des Flusses“",
        say: "Der Grieche Herodot reiste vor fast zweitausendfünfhundert Jahren nach Ägypten. Er schrieb: Ägypten ist ein Geschenk des Flusses.",
        build(s) {
          const svg = svgBox(s, 1060, 270);
          svg.append(s.el("rect", { x: 0, y: 0, width: 1060, height: 270, fill: "#fdf3df", rx: 14 }));
          svg.append(s.el("path", { d: "M0,120 L300,140 L330,200 L0,200 Z", fill: DES2 }), s.el("path", { d: "M1060,120 L760,140 L730,200 L1060,200 Z", fill: DES2 }));
          const black = s.el("path", { d: "M330,190 L500,196 L500,200 L330,200 Z M730,190 L560,196 L560,200 L730,200 Z", fill: MUD, class: "later" });
          const fields = s.el("path", { d: "M300,140 L330,186 L500,192 L560,192 L730,186 L760,140 L740,172 L560,180 L500,180 L320,172 Z", fill: FIELD, class: "later" });
          svg.append(s.el("rect", { x: 0, y: 200, width: 1060, height: 70, fill: "#c79a5a" }), s.el("path", { d: "M490,196 Q530,236 570,196 Z", fill: NILE }), black, fields);
          const palms = s.el("g", { class: "later" });
          [360, 420, 640, 700].forEach(x => palms.append(s.el("path", { d: `M${x},180 L${x + 3},130`, stroke: "#7a5a2e", "stroke-width": 5 }), s.el("path", { d: `M${x + 3},130 q-24,-4 -32,12 M${x + 3},130 q24,-4 32,12 M${x + 3},130 q-14,-16 -30,-14 M${x + 3},130 q14,-16 30,-14`, stroke: "#3f8f3a", "stroke-width": 6, fill: "none", "stroke-linecap": "round" })));
          svg.append(palms);
          const L1 = txt(s, 150, 70, "Deschret = rotes Land", { fill: "#9b4a1c", class: "later" }), L1b = txt(s, 150, 100, "(Wüste)", { fill: "#9b4a1c", class: "later" });
          const L2 = txt(s, 530, 70, "Kemet = schwarzes Land", { fill: "#1f5e22", class: "later" }), L2b = txt(s, 530, 100, "(fruchtbar am Nil)", { fill: "#1f5e22", class: "later" });
          const L3 = txt(s, 910, 70, "Deschret = rotes Land", { fill: "#9b4a1c", class: "later" }), L3b = txt(s, 910, 100, "(Wüste)", { fill: "#9b4a1c", class: "later" });
          const L4 = txt(s, 530, 256, "Nil", { fill: "#fff", "font-size": 22 });
          svg.append(L1, L1b, L2, L2b, L3, L3b, L4);
          const quote = s.h("div", { class: "card later", style: { borderLeft: "8px solid " + C } }, p(s, "hand", "„Ägypten … ist ein Geschenk des Flusses.“"), p(s, "small", "Herodot, griechischer Geschichtsschreiber, um 450 v. Chr. (Historien, Buch 2)"));
          const merk = s.h("div", { class: "merk later" }, "Ohne den Nil wäre Ägypten nur Wüste. Die alten Ägypter nannten ihr Land ", B(s, "Kemet"), " – „schwarzes Land“ – nach dem dunklen, fruchtbaren Boden.");
          s.add(s.h("div", { class: "stack", style: { gap: "18px" } }, svg, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "22px", alignItems: "center" } }, quote, merk)));
          s.show(svg, "fade"); s.sfx.whoosh();
          s.step(async () => { s.sfx.pop(); await s.show([L1, L1b, L3, L3b], "pop"); });
          s.step(async () => { s.sfx.whoosh(); s.show(black, "fade"); s.show(fields, "up"); s.show(palms, "bounce"); s.sfx.pop(); await s.show([L2, L2b], "pop"); });
          s.step(async () => { s.sfx.scribble(); await s.show(quote, "left"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Die Nilschwemme",
        say: "Jeden Sommer trat der Nil über die Ufer. Wenn das Wasser zurückging, blieb schwarzer, fruchtbarer Schlamm liegen.",
        build(s) {
          const W = 1060, Hh = 290;
          const { canvas, g } = s.canvas(W, Hh);
          const MON = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
          let m = 4, mud = 0;
          const lvl = mm => { // 0 = low water, 1 = full flood (June rise, Aug–Sep peak, Oct falls)
            if (mm < 5) return 0; if (mm < 7) return (mm - 5) / 2; if (mm < 9) return 1; if (mm < 10) return 1 - (mm - 9); return 0;
          };
          const draw = () => {
            g.clearRect(0, 0, W, Hh);
            g.fillStyle = "#fdf3df"; g.fillRect(0, 0, W, Hh);
            g.fillStyle = DES2; g.beginPath(); g.moveTo(0, 80); g.lineTo(240, 100); g.lineTo(280, 190); g.lineTo(0, 190); g.fill();
            g.beginPath(); g.moveTo(W, 80); g.lineTo(820, 100); g.lineTo(780, 190); g.lineTo(W, 190); g.fill();
            g.fillStyle = "#c79a5a"; g.fillRect(0, 190, W, 100);
            // fields
            g.fillStyle = mud > 0.05 ? `rgba(58,46,37,${0.35 + mud * 0.65})` : "#b8915a"; g.fillRect(280, 176, 500, 14);
            const L = lvl(m);
            if (L < 0.4) { g.fillStyle = FIELD; for (let x = 290; x < 770; x += 22) if (x < 490 || x > 570) { g.fillRect(x, 160, 6, 16); } }
            // river
            const top = 196 - L * 70;
            g.fillStyle = NILE; g.beginPath(); g.moveTo(490, 190); g.quadraticCurveTo(530, 240, 570, 190); g.closePath(); g.fill();
            if (L > 0) { g.fillStyle = "rgba(47,134,201,.8)"; g.fillRect(280 - L * 10, top, 500 + L * 20, 196 - top); }
            g.font = "700 22px Atkinson Hyperlegible, sans-serif"; g.fillStyle = "#1b2740"; g.textAlign = "center";
            g.fillText(MON[Math.floor(m) % 12], 530, 40);
            g.font = "700 19px Atkinson Hyperlegible, sans-serif"; g.fillStyle = "#9b4a1c"; g.fillText("Wüste", 110, 70); g.fillText("Wüste", 950, 70);
            g.fillStyle = "#fff"; g.fillText("Nil", 530, 272);
          };
          draw();
          let busy = false;
          const play = async () => {
            if (busy) return; busy = true; s.sfx.whoosh(); mud = 0;
            let last = -1;
            await s.tween({ from: 4, to: 11.99, dur: 6000, ease: "linear", update: v => { m = v; if (v > 9) mud = Math.min(1, (v - 9) / 1.5); if (Math.floor(v) !== last) { last = Math.floor(v); s.sfx.count(last - 4); } draw(); } });
            s.sfx.ding(); busy = false;
          };
          const btn = s.h("button", { class: "btn solid later", onclick: play }, "▶ Ein Jahr abspielen");
          const cards = [["1. Regen in Äthiopien", "Im Sommer regnet es im Hochland von Äthiopien sehr stark. Der Blaue Nil schwillt an."], ["2. Der Nil tritt über", "Von etwa Juni bis Oktober stand das Wasser auf den Feldern – knapp 100 Tage lang."], ["3. Schwarzer Schlamm", "Das Wasser brachte Schlamm mit. Er blieb liegen und düngte die Felder."]].map(([a, b]) => exc(s, a, "later", p(s, "small", b)));
          s.add(s.h("div", { class: "stack", style: { gap: "16px", alignItems: "center" } }, canvas, s.h("div", { class: "cols3", style: { width: "100%" } }, ...cards), btn));
          s.show(canvas, "fade"); s.sfx.whoosh();
          s.step(async () => { s.sfx.pop(); await s.show(cards[0], "up"); });
          s.step(async () => { s.sfx.pop(); s.show(cards[1], "up"); s.show(btn, "pop"); await play(); });
          s.step(async () => { s.sfx.ding(); await s.show(cards[2], "up"); s.say("Der Schlamm war das Geschenk: Er machte die Felder fruchtbar."); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Drei Jahreszeiten am Nil",
        say: "Die Ägypter hatten nicht vier, sondern drei Jahreszeiten: Achet, Peret und Schemu. Alle richteten sich nach dem Nil.",
        build(s) {
          const svg = svgBox(s, 470, 470);
          const cx = 235, cy = 235, R = 205;
          const arc = (a0, a1, col) => { const r = a => (a - 90) * Math.PI / 180; const x0 = cx + R * Math.cos(r(a0)), y0 = cy + R * Math.sin(r(a0)), x1 = cx + R * Math.cos(r(a1)), y1 = cy + R * Math.sin(r(a1)); return s.el("path", { d: `M${cx},${cy} L${x0},${y0} A${R},${R} 0 0 1 ${x1},${y1} Z`, fill: col, stroke: "#fff", "stroke-width": 5, class: "later" }); };
          const segs = [arc(0, 120, "#5aa7e0"), arc(120, 240, FIELD), arc(240, 360, "#e8b64a")];
          const lab = (a, t1, t2) => { const r = (a - 90) * Math.PI / 180, x = cx + 120 * Math.cos(r), y = cy + 120 * Math.sin(r); const g = s.el("g", { class: "later" }); g.append(txt(s, x, y - 4, t1, { "font-size": 26, fill: "#fff" }), txt(s, x, y + 24, t2, { "font-size": 19, fill: "#fff" })); return g; };
          const labs = [lab(60, "Achet", "Überschwemmung"), lab(180, "Peret", "Säen, wachsen"), lab(300, "Schemu", "Ernte")];
          svg.append(...segs, ...labs);
          const hand = s.el("line", { x1: cx, y1: cy, x2: cx, y2: cy - 52, stroke: "#1b2740", "stroke-width": 8, "stroke-linecap": "round", class: "later" });
          const rim = s.el("circle", { cx, cy: cy - R, r: 15, fill: "#1b2740", stroke: "#fff", "stroke-width": 4, class: "later" });
          svg.append(hand, rim, s.el("circle", { cx, cy, r: 12, fill: "#1b2740" }));
          const items = [["Achet", "Das Wasser steht auf den Feldern. Die Bauern können nicht ackern. Viele arbeiten dann auf den Baustellen des Pharaos.", "#2a78b8"],
            ["Peret", "Das Wasser geht zurück, das Land „kommt hervor“. Jetzt wird gepflügt und gesät.", "#2f7d32"],
            ["Schemu", "Der Nil führt wenig Wasser. Die Ernte wird eingebracht.", "#a8741a"]].map(([n, t, col]) => s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel", style: { color: col } }, n), p(s, "small", t)));
          const note = p(s, "small pencil later", "Jede Jahreszeit dauerte vier Monate.");
          s.add(grid(s, "470px 1fr", svg, s.h("div", { class: "stack" }, ...items, note)));
          s.sfx.pop();
          const turn = (a0, a1) => s.tween({ from: a0, to: a1, dur: 900, update: a => { const r = (a - 90) * Math.PI / 180; hand.setAttribute("x2", cx + 52 * Math.cos(r)); hand.setAttribute("y2", cy + 52 * Math.sin(r)); rim.setAttribute("cx", cx + (R - 4) * Math.cos(r)); rim.setAttribute("cy", cy + (R - 4) * Math.sin(r)); } });
          [0, 1, 2].forEach(i => s.step(async () => {
            if (i === 0) s.show([hand, rim], "fade");
            s.sfx.whoosh(); s.show(segs[i], "zoom"); s.show(labs[i], "pop");
            await turn(i * 120 - (i ? 60 : 0), i * 120 + 60); s.sfx.chord([0, 4, 7].map(n => n + i * 2)); await s.show(items[i], "left");
            if (i === 2) { s.sfx.pop(); await s.show(note, "fade"); }
          }));
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Ein Kalender mit 365 Tagen",
        say: "Die Ägypter zählten die Tage genau. Ihr Jahr hatte zwölf Monate mit je dreißig Tagen und fünf Extratage.",
        build(s) {
          const svg = svgBox(s, 600, 440);
          const cells = [];
          for (let r = 0; r < 12; r++) for (let c = 0; c < 30; c++) { const el = s.el("rect", { x: 70 + c * 17, y: 10 + r * 30, width: 14, height: 24, rx: 3, fill: r < 4 ? "#5aa7e0" : r < 8 ? FIELD : "#e8b64a", opacity: 0.12 }); cells.push(el); svg.append(el); }
          for (let r = 0; r < 12; r++) svg.append(txt(s, 58, 30 + r * 30, String(r + 1), { "text-anchor": "end", "font-size": 19 }));
          const extra = [0, 1, 2, 3, 4].map(i => s.el("rect", { x: 70 + i * 34, y: 380, width: 28, height: 40, rx: 5, fill: "#c0392b", class: "later" }));
          svg.append(...extra, txt(s, 410, 408, "+ 5 Festtage", { fill: "#c0392b", class: "later" }));
          const plusT = svg.lastChild;
          const big = s.h("span", { class: "huge", style: { color: C } }, "0");
          const eq = p(s, "t", "12 Monate × 30 Tage");
          const merk = s.h("div", { class: "merk later" }, "12 × 30 = 360. Dazu 5 Extratage: Das Jahr hatte ", B(s, "365 Tage"), " – fast wie unser Kalender!");
          const star = exc(s, "Neujahr", "later", p(s, "small", "Das neue Jahr begann, wenn der helle Stern ", B(s, "Sirius"), " im Morgengrauen wieder auftauchte. Das war etwa zur Zeit, wenn die Nilschwemme kam."));
          const lf = lifeBox(s, "later", p(s, "small", "Unser Jahr hat auch 365 Tage – im Schaltjahr 366. Die alten Ägypter kamen ohne Schaltjahr aus."));
          s.add(grid(s, "600px 1fr", svg, s.h("div", { class: "stack" }, eq, big, merk, star, lf)));
          s.show(svg, "fade"); s.sfx.pop();
          s.step(async () => {
            s.sfx.whoosh();
            if (s.fast) { cells.forEach(c => c.setAttribute("opacity", 1)); big.textContent = "360"; return; }
            let n = 0;
            await s.tween({ from: 0, to: 360, dur: 2400, ease: "linear", update: v => { while (n < Math.floor(v)) { cells[n].setAttribute("opacity", 1); n++; if (n % 30 === 0) s.sfx.count(n / 30 - 1); } big.textContent = String(n); } });
          });
          s.step(async () => { for (let i = 0; i < 5; i++) { s.sfx.coin(); await s.show(extra[i], "bounce"); } s.show(plusT, "pop"); await countUp(s, big, 365, { from: 360, dur: 600, raw: true }); s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.zap(); await s.show(star, "left"); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Wasser auf die Felder: Schaduf",
        say: "Mit dem Schaduf hoben die Bauern Wasser aus dem Fluss in einen Kanal. Er funktioniert wie eine Wippe.",
        build(s) {
          const svg = svgBox(s, 540, 460);
          svg.append(s.el("rect", { x: 0, y: 0, width: 540, height: 460, fill: "#fdf3df", rx: 14 }));
          svg.append(s.el("path", { d: "M0,330 L180,330 L180,460 L0,460 Z", fill: NILE }), s.el("path", { d: "M180,250 L540,250 L540,460 L180,460 Z", fill: "#c79a5a" }), s.el("path", { d: "M180,250 L180,460", stroke: "#8a6a3a", "stroke-width": 4 }));
          svg.append(s.el("rect", { x: 380, y: 236, width: 160, height: 14, fill: NILE }));
          const canalW = s.el("rect", { x: 380, y: 236, width: 0, height: 14, fill: "#5ab0f0" });
          svg.append(canalW, txt(s, 90, 420, "Nil", { fill: "#fff" }), txt(s, 460, 228, "Kanal", { fill: "#1d5bd0" }));
          svg.append(s.el("path", { d: "M270,250 L292,120 L314,250", fill: "none", stroke: "#7a5a2e", "stroke-width": 10, "stroke-linejoin": "round" }));
          const PX = 292, PY = 120, LONG = 210, SHORT = 90;
          const pole = s.el("g");
          const rope = s.el("line", { stroke: "#5d4a2a", "stroke-width": 3 });
          const bucket = s.el("path", { d: "M-16,0 L16,0 L11,28 L-11,28 Z", fill: "#a35b2a", stroke: "#5d3a1a", "stroke-width": 2 });
          const bucketG = s.el("g"); bucketG.append(bucket);
          const beam = s.el("line", { stroke: "#7a5a2e", "stroke-width": 9, "stroke-linecap": "round" });
          const stone = s.el("circle", { r: 24, fill: "#8e8a80", stroke: "#5d5a52", "stroke-width": 3 });
          pole.append(beam, stone, rope, bucketG);
          const farmer = person(s, 240, 330, C, 1.3);
          svg.append(pole, farmer);
          let ang = 25, swing = 0; // ang: degrees, positive = long end down (towards river, left)
          const place = () => {
            const dirX = -Math.cos(swing * Math.PI / 180);
            const a = ang * Math.PI / 180;
            const lx = PX + dirX * LONG * Math.cos(a), ly = PY + LONG * Math.sin(a);
            const sx = PX - dirX * SHORT * Math.cos(a), sy = PY - SHORT * Math.sin(a);
            beam.setAttribute("x1", lx); beam.setAttribute("y1", ly); beam.setAttribute("x2", sx); beam.setAttribute("y2", sy);
            stone.setAttribute("cx", sx); stone.setAttribute("cy", sy);
            rope.setAttribute("x1", lx); rope.setAttribute("y1", ly); rope.setAttribute("x2", lx); rope.setAttribute("y2", ly + 70);
            bucketG.setAttribute("transform", `translate(${lx},${ly + 70})`);
          };
          place();
          const tags = [["1", "Der lange Arm mit dem Eimer geht hinunter in den Fluss."], ["2", "Das schwere Gegengewicht zieht den vollen Eimer nach oben."], ["3", "Drehen und ausgießen: Das Wasser fließt in den Kanal und zu den Feldern."]].map(([n, t]) => s.h("div", { class: "later", style: { display: "grid", gridTemplateColumns: "44px 1fr", gap: "12px", alignItems: "center" } }, s.h("span", { class: "chip", style: { background: C, color: "#fff", justifyContent: "center" } }, n), p(s, "small", t)));
          const merk = s.h("div", { class: "merk later" }, "Kanäle und kleine Dämme teilten das Land in ", B(s, "Becken"), ". Bei der Flut blieb das Wasser dort etwa sechs Wochen stehen.");
          let busy = false;
          const scoop = async () => {
            if (busy) return; busy = true;
            s.sfx.whoosh(); await s.tween({ from: 25, to: 48, dur: 700, update: v => { ang = v; place(); } }); s.sfx.boing();
            await s.tween({ from: 48, to: -18, dur: 1000, update: v => { ang = v; place(); } }); s.sfx.click();
            await s.tween({ from: 0, to: 180, dur: 900, update: v => { swing = v; place(); } });
            s.sfx.whoosh(); await s.tween({ from: 0, to: 160, dur: 700, update: v => canalW.setAttribute("width", v) }); s.sfx.ding();
            await s.tween({ from: 180, to: 0, dur: 700, update: v => { swing = v; place(); } }); ang = 25; place(); busy = false;
          };
          const btn = s.h("button", { class: "btn solid later", onclick: scoop }, "▶ Wasser schöpfen");
          s.add(grid(s, "540px 1fr", svg, s.h("div", { class: "stack" }, ...tags, btn, merk)));
          s.show(svg, "fade"); s.sfx.pop();
          s.step(async () => { s.sfx.count(0); await s.show(tags[0], "left"); s.sfx.whoosh(); await s.tween({ from: 25, to: 48, dur: 800, update: v => { ang = v; place(); } }); s.sfx.boing(); });
          s.step(async () => { s.sfx.count(2); await s.show(tags[1], "left"); await s.tween({ from: 48, to: -18, dur: 1000, update: v => { ang = v; place(); } }); s.sfx.click(); });
          s.step(async () => { s.sfx.count(4); await s.show(tags[2], "left"); await s.tween({ from: 0, to: 180, dur: 900, update: v => { swing = v; place(); } }); s.sfx.whoosh(); await s.tween({ from: 0, to: 160, dur: 700, update: v => canalW.setAttribute("width", v) }); s.sfx.ding(); await s.tween({ from: 180, to: 0, dur: 600, update: v => { swing = v; place(); } }); ang = 25; place(); s.show(btn, "pop"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Der Nilometer",
        say: "Mit dem Nilometer maßen die Ägypter, wie hoch der Nil stieg. Daran sahen sie, wie gut die Ernte wird.",
        build(s) {
          const svg = svgBox(s, 440, 480);
          svg.append(s.el("rect", { x: 0, y: 0, width: 440, height: 480, fill: "#fdf3df", rx: 14 }));
          svg.append(s.el("path", { d: "M60,60 L60,470 L380,470 L380,60", fill: "#e8d9b8", stroke: "#9b7a48", "stroke-width": 6 }));
          for (let i = 0; i < 9; i++) svg.append(s.el("rect", { x: 60 + i * 22, y: 80 + i * 44, width: 320 - i * 22, height: 44, fill: "#d8c49c", stroke: "#b49a6a", "stroke-width": 2 }));
          const water = s.el("rect", { x: 63, y: 400, width: 314, height: 67, fill: NILE, opacity: .82 });
          svg.append(water);
          for (let i = 0; i <= 8; i++) { const y = 460 - i * 45; svg.append(s.el("line", { x1: 330, y1: y, x2: 375, y2: y, stroke: "#1b2740", "stroke-width": 3 }), s.el("line", { x1: 385, y1: y, x2: i % 2 ? 405 : 425, y2: y, stroke: "#9b7a48", "stroke-width": 4 })); }
          svg.append(txt(s, 220, 40, "Messtreppe mit Strichen", { "font-size": 20 }));
          const status = p(s, "big", "Niedrig");
          const harvest = p(s, "t", "Ernte: wenig");
          const levels = ["Sehr niedrig", "Niedrig", "Mittel", "Gut", "Sehr hoch"];
          const sl = s.slider({ label: "Wie hoch steigt der Nil?", min: 0, max: 4, value: 1, fmt: v => levels[v], onInput: v => {
            s.tween({ from: +water.getAttribute("y"), to: 420 - v * 80, dur: 500, update: y => { water.setAttribute("y", y); water.setAttribute("height", 467 - y); } });
            status.textContent = levels[v];
            harvest.textContent = v <= 1 ? "Wenig Land wird nass – wenig Ernte." : v === 2 ? "Viele Felder bekommen Wasser." : "Viel Land wird nass und fruchtbar – große Ernte!";
            if (v >= 3) s.sfx.coin();
          } });
          sl.classList.add("later");
          const c1 = exc(s, "Wozu?", "later", p(s, "small", "Aus der Höhe der Flut schätzten Priester und Beamte die Ernte. Danach richteten sich auch die ", B(s, "Steuern"), " für die Felder."));
          const c2 = exc(s, "Wo?", "later", p(s, "small", "Einer der ältesten liegt auf der Insel Elephantine bei Assuan. Ein berühmter steht in Kairo auf der Insel Roda."));
          s.add(grid(s, "440px 1fr", svg, s.h("div", { class: "stack" }, status, harvest, sl, c1, c2)));
          s.show(svg, "fade"); s.sfx.pop();
          s.step(async () => { await s.show(sl, "up"); s.sfx.whoosh(); for (let v = 2; v <= 4; v++) { sl.set(v); await s.wait(450); } });
          s.step(async () => { s.sfx.pop(); await s.show(c1, "left"); });
          s.step(async () => { s.sfx.pop(); await s.show(c2, "left"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Säen, ernten, speichern",
        say: "Die Bauern bauten vor allem Emmer und Gerste an. Ein Teil der Ernte ging als Steuer in die Kornspeicher.",
        build(s) {
          const svg = svgBox(s, 1060, 250);
          svg.append(s.el("rect", { x: 0, y: 0, width: 1060, height: 250, fill: "#fdf3df", rx: 14 }), s.el("rect", { x: 0, y: 200, width: 1060, height: 50, fill: "#c79a5a" }));
          // field
          const stalks = s.el("g");
          for (let x = 30; x < 240; x += 18) stalks.append(s.el("path", { d: `M${x},200 L${x},150 M${x},160 l-8,-10 M${x},160 l8,-10 M${x},150 l0,-10`, stroke: "#c9a227", "stroke-width": 3, fill: "none" }));
          svg.append(stalks, txt(s, 135, 232, "Feld", { fill: "#fff" }));
          // granary
          const silo = s.el("g", { class: "later" });
          silo.append(s.el("path", { d: "M800,200 L800,90 Q850,40 900,90 L900,200 Z", fill: "#e8d9b8", stroke: "#9b7a48", "stroke-width": 4 }), s.el("path", { d: "M930,200 L930,90 Q980,40 1030,90 L1030,200 Z", fill: "#e8d9b8", stroke: "#9b7a48", "stroke-width": 4 }));
          const fillR = [s.el("rect", { x: 804, y: 196, width: 92, height: 0, fill: "#d9b44a" }), s.el("rect", { x: 934, y: 196, width: 92, height: 0, fill: "#d9b44a" })];
          silo.append(...fillR, txt(s, 915, 232, "Kornspeicher", { fill: "#fff" }));
          svg.append(silo);
          // scribe
          const scribe = person(s, 640, 200, C, 1.2); scribe.classList.add("later");
          const tab = s.el("rect", { x: 655, y: 150, width: 30, height: 22, fill: "#f5ecd0", stroke: "#9b7a48", "stroke-width": 2 }); scribe.append();
          svg.append(scribe, tab); tab.classList.add("later");
          const sackG = s.el("g", { class: "later" });
          const sack = (x) => s.el("path", { d: `M${x - 18},200 Q${x - 22},170 ${x - 8},162 L${x - 10},154 L${x + 10},154 L${x + 8},162 Q${x + 22},170 ${x + 18},200 Z`, fill: "#d9c08a", stroke: "#8a6a3a", "stroke-width": 2 });
          const sacks = [sack(0), sack(0), sack(0)]; sacks.forEach(sk => sackG.append(sk));
          svg.append(sackG);
          const placeSacks = v => sacks.forEach((sk, i) => sk.setAttribute("transform", `translate(${300 + i * 50 + v * (480 - i * 20)},0)`));
          placeSacks(0);
          const steps = [["Säen", "In der Zeit Peret: pflügen und säen, vor allem Emmer (alter Weizen) und Gerste."], ["Ernten", "In der Zeit Schemu wird das Getreide geerntet und in Säcke gefüllt."], ["Abgeben", "Ein Teil der Ernte ist Steuer. Ein Schreiber zählt die Säcke und schreibt alles auf."], ["Speichern", "Das Korn kommt in große Speicher. Daraus macht man Brot und Bier."]];
          const cards = steps.map(([a, b], i) => exc(s, (i + 1) + ". " + a, "later", p(s, "t", b)));
          s.add(s.h("div", { class: "stack", style: { gap: "18px" } }, svg, s.h("div", { class: "cols4" }, ...cards)));
          s.show(svg, "fade"); s.sfx.pop();
          s.step(async () => { s.sfx.pop(); await s.show(cards[0], "up"); s.sfx.scribble(); await s.tween({ from: 0.3, to: 1, dur: 700, ease: "back", update: v => stalks.setAttribute("transform", `translate(0,${200 * (1 - v)}) scale(1,${v})`) }); });
          s.step(async () => { s.sfx.pop(); await s.show(cards[1], "up"); s.sfx.snap(); await s.show(sackG, "bounce"); });
          s.step(async () => { s.sfx.pop(); await s.show(cards[2], "up"); s.show([scribe, tab], "pop"); for (let i = 0; i < 3; i++) { s.sfx.count(i); await s.wait(250); } });
          s.step(async () => { s.sfx.pop(); s.show(silo, "zoom"); await s.show(cards[3], "up"); s.sfx.whoosh(); await s.tween({ from: 0, to: 1, dur: 1300, update: v => { placeSacks(v); sackG.setAttribute("opacity", 1 - v * 0.9); fillR.forEach(r => { r.setAttribute("y", 196 - v * 80); r.setAttribute("height", v * 80); }); } }); s.sfx.success(); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Was ist eine Hochkultur?",
        say: "Ägypten war eine der ersten Hochkulturen. Dazu gehören ein Staat, eine Schrift, eine Verwaltung, Arbeitsteilung, Religion und Städte.",
        build(s) {
          const ic = (draw) => { const v = svgBox(s, 76, 76); draw(v); return v; };
          const tiles = [
            ["Staat", "Ein Herrscher, der Pharao, regiert das ganze Land. Um 3100 v. Chr. wurden Ober- und Unterägypten vereint.", ic(v => v.append(s.el("path", { d: "M14,58 L14,26 L26,40 L38,18 L50,40 L62,26 L62,58 Z", fill: "#e8b64a", stroke: "#9b6b2f", "stroke-width": 3 })))],
            ["Schrift", "Hieroglyphen: Bilderzeichen, etwa 700 bis 1000 verschiedene.", ic(v => v.append(s.el("circle", { cx: 26, cy: 26, r: 10, fill: "none", stroke: "#1b2740", "stroke-width": 4 }), s.el("path", { d: "M10,52 l8,-8 l8,8 l8,-8 l8,8 l8,-8 l8,8", fill: "none", stroke: NILE, "stroke-width": 4 }), s.el("path", { d: "M44,16 L60,16 L60,40 L44,40 Z", fill: "#e8b64a" })))],
            ["Verwaltung", "Beamte und Schreiber zählen Ernte, Vieh und Steuern. Der Wesir ist der höchste Beamte.", ic(v => v.append(s.el("rect", { x: 14, y: 10, width: 48, height: 58, rx: 4, fill: "#f5ecd0", stroke: "#9b7a48", "stroke-width": 3 }), s.el("path", { d: "M22,26 H54 M22,38 H54 M22,50 H44", stroke: "#1b2740", "stroke-width": 3 })))],
            ["Arbeitsteilung", "Nicht jeder macht alles: Bauern, Handwerker, Händler, Schreiber, Priester.", ic(v => v.append(s.el("path", { d: "M14,60 L30,20 M30,20 l-8,4 M38,60 L38,18 M30,18 H46 M50,60 L62,24", stroke: "#1b2740", "stroke-width": 4, "stroke-linecap": "round", fill: "none" })))],
            ["Religion", "Viele Götter, große Tempel und Priester. Der Pharao galt als Gottkönig.", ic(v => v.append(s.el("circle", { cx: 38, cy: 30, r: 16, fill: "#ffd94a" }), s.el("path", { d: "M12,64 H64 M18,64 V44 H58 V64", stroke: "#9b6b2f", "stroke-width": 4, fill: "none" })))],
            ["Städte und Bauten", "Städte, Paläste, Tempel und Pyramiden aus Stein.", ic(v => v.append(s.el("path", { d: "M8,64 L32,20 L56,64 Z", fill: DES, stroke: "#9b6b2f", "stroke-width": 3 }), s.el("path", { d: "M44,64 L58,38 L72,64 Z", fill: DES2, stroke: "#9b6b2f", "stroke-width": 3 })))],
          ].map(([h, t, svg]) => s.h("div", { class: "card later", style: { display: "grid", gridTemplateColumns: "76px 1fr", gap: "14px", alignItems: "center", padding: "14px 16px" } }, svg, s.h("div", null, s.h("b", { class: "t", style: { color: C } }, h), p(s, "small", t))));
          const merk = s.h("div", { class: "merk later" }, "Ohne den Nil keine Ernte – ohne Ernte keine Hochkultur. Der Fluss machte alles möglich.");
          s.add(s.h("div", { class: "stack", style: { gap: "16px" } }, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" } }, ...tiles), merk));
          s.sfx.pop();
          s.step(async () => { for (let i = 0; i < 2; i++) { s.sfx.count(i * 2); await s.show(tiles[i], "pop"); } });
          s.step(async () => { for (let i = 2; i < 4; i++) { s.sfx.count(i * 2); await s.show(tiles[i], "pop"); } });
          s.step(async () => { for (let i = 4; i < 6; i++) { s.sfx.count(i * 2); await s.show(tiles[i], "pop"); } });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Die Gesellschaft als Pyramide",
        say: "Man kann sich die ägyptische Gesellschaft wie eine Pyramide vorstellen. Oben wenige Mächtige, unten sehr viele Bauern.",
        build(s) {
          const svg = svgBox(s, 560, 480);
          const AX = 280, HB = 272, HT = 470;
          const hw = y => 34 + (HB - 34) * y / HT;
          const bands = [[0, 100, "Pharao", "#e8b64a", "Der König. Er galt als Sohn der Götter und besaß das ganze Land."], [100, 175, "Wesir & Priester", "#d79b45", "Der Wesir leitet die Verwaltung. Priester dienen den Göttern im Tempel. Dazu hohe Beamte."], [175, 250, "Schreiber", "#c98a3c", "Sie können lesen und schreiben, zählen Steuern und schreiben Listen und Briefe."], [250, 325, "Handwerker & Händler", "#b97a35", "Steinmetze, Töpfer, Bäcker, Bootsbauer – und Händler, die Waren tauschen."], [325, 400, "Bauern", "#9b6b2f", "Die allermeisten Menschen. Sie ernähren das ganze Land und zahlen Steuern."], [400, 470, "Diener & Sklaven", "#7a5428", "Meist Kriegsgefangene. Sie mussten für andere arbeiten. Fachleute sagen: Sie waren keine eigene große Schicht."]];
          const info = exc(s, "Tippe auf eine Schicht", "", p(s, "t", "Steige die Pyramide von unten nach oben hinauf."));
          const infoLbl = info.querySelector(".exlabel"), infoTxt = info.querySelector("p");
          const polys = bands.map(([y0, y1, name, col, desc]) => {
            const g = s.el("g", { class: "later", style: { cursor: "pointer" } });
            const poly = s.el("path", { d: `M${AX - hw(y0)},${y0} L${AX + hw(y0)},${y0} L${AX + hw(y1)},${y1} L${AX - hw(y1)},${y1} Z`, fill: col, stroke: "#fff", "stroke-width": 4 });
            const ty = y0 === 0 ? 78 : (y0 + y1) / 2 + 8;
            g.append(poly, txt(s, AX, ty, name, { fill: "#fff", "font-size": y0 === 0 ? 20 : 22 }));
            g.addEventListener("click", () => { s.sfx.pop(); infoLbl.textContent = name; infoTxt.textContent = desc; s.show(info, "pop"); polys.forEach(q => q.firstChild.setAttribute("stroke", "#fff")); poly.setAttribute("stroke", "#1b2740"); });
            svg.append(g); return g;
          });
          const arrow = s.el("g", { class: "later" });
          arrow.append(s.el("path", { d: "M20,460 L20,30 M8,46 L20,28 L32,46", stroke: C, "stroke-width": 4, fill: "none", "stroke-linecap": "round" }), txt(s, 46, 250, "Macht", { fill: C, transform: "rotate(-90 46 250)", "font-size": 20 }));
          svg.append(arrow);
          const note = exc(s, "Gut zu wissen", "later", p(s, "small", "Die Pyramiden bauten nicht Sklaven, sondern bezahlte Arbeiter – und Bauern, wenn ihre Felder unter Wasser standen."));
          s.add(grid(s, "560px 1fr", svg, s.h("div", { class: "stack" }, info, note)));
          s.sfx.pop();
          s.step(async () => { for (let i = bands.length - 1; i >= 3; i--) { s.sfx.drum(); await s.show(polys[i], "left"); } });
          s.step(async () => { for (let i = 2; i >= 0; i--) { s.sfx.count(6 - i * 2); await s.show(polys[i], "left"); } s.sfx.fanfare(); s.show(arrow, "fade"); infoLbl.textContent = "Pharao"; infoTxt.textContent = bands[0][4]; s.say("Ganz oben steht der Pharao."); });
          s.step(async () => { s.sfx.ding(); await s.show(note, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Traumberuf: Schreiber",
        say: "Schreiber war ein angesehener Beruf. Ein alter Text erzählt, wie ein Vater seinem Sohn rät: Werde Schreiber!",
        build(s) {
          const svg = svgBox(s, 500, 420);
          svg.append(s.el("rect", { x: 0, y: 0, width: 500, height: 420, fill: "#fdf3df", rx: 14 }));
          const sheet = s.el("rect", { x: 40, y: 60, width: 0, height: 300, fill: "#efe0b6", stroke: "#b49a6a", "stroke-width": 3 });
          svg.append(sheet, s.el("rect", { x: 22, y: 50, width: 24, height: 320, rx: 12, fill: "#d9c08a", stroke: "#9b7a48", "stroke-width": 3 }));
          const glyphs = s.el("g", { class: "later" });
          const G = (x, y, k) => {
            const gg = s.el("g", { transform: `translate(${x},${y})` });
            if (k === 0) gg.append(s.el("path", { d: "M0,30 Q2,0 18,4 Q30,8 26,30 Z M14,8 l0,-8", fill: "none", stroke: "#1b2740", "stroke-width": 3 }));
            if (k === 1) gg.append(s.el("path", { d: "M-4,18 l7,-7 l7,7 l7,-7 l7,7 l7,-7", fill: "none", stroke: "#1b2740", "stroke-width": 3 }));
            if (k === 2) gg.append(s.el("ellipse", { cx: 12, cy: 16, rx: 14, ry: 8, fill: "none", stroke: "#1b2740", "stroke-width": 3 }), s.el("circle", { cx: 12, cy: 16, r: 4, fill: "#1b2740" }));
            if (k === 3) gg.append(s.el("path", { d: "M0,28 L0,4 Q12,-4 24,4 L24,28 Z", fill: "none", stroke: "#c0392b", "stroke-width": 3 }));
            return gg;
          };
          for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) glyphs.append(G(80 + c * 55, 90 + r * 55, (r * 3 + c) % 4));
          svg.append(glyphs);
                    const t1 = exc(s, "Ein alter Text: „Die Lehre des Cheti“", "later", p(s, "small", "Ein Vater namens Cheti bringt seinen Sohn zur Schule. Er rät ihm: Lerne fleißig und werde Schreiber! Die anderen Berufe beschreibt er als hart und gefährlich."));
          const t2 = exc(s, "Was macht ein Schreiber?", "later", p(s, "small", "Er zählt Ernte und Vieh, schreibt Steuern, Listen und Briefe auf. Schreiber waren das Rückgrat der Verwaltung."));
          const lf = lifeBox(s, "later", p(s, "small", "Heute lernt bei uns jedes Kind lesen und schreiben. Im alten Ägypten konnten das nur wenige – darum waren Schreiber so wichtig."));
          s.add(grid(s, "500px 1fr", svg, s.h("div", { class: "stack" }, t1, t2, lf)));
          s.show(svg, "fade"); s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); await s.tween({ from: 0, to: 420, dur: 900, update: v => sheet.setAttribute("width", v) }); s.sfx.scribble(); await s.show(glyphs, "fade"); s.show(t1, "left"); });
          s.step(async () => { s.sfx.coin(); await s.show(t2, "left"); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Handel auf dem Nil",
        say: "Der Nil war die wichtigste Straße Ägyptens. Nach Norden trieb die Strömung die Boote, nach Süden half der Wind.",
        build(s) {
          const svg = svgBox(s, 440, 500);
          svg.append(s.el("rect", { x: 0, y: 0, width: 440, height: 500, fill: DES, rx: 14 }));
          svg.append(s.el("path", { d: "M200,500 C240,400 170,320 220,240 C260,170 200,90 220,0 L260,0 C240,90 300,170 260,240 C210,320 280,400 240,500 Z", fill: NILE }));
          svg.append(txt(s, 60, 34, "Norden", { "text-anchor": "start" }), txt(s, 60, 486, "Süden", { "text-anchor": "start" }));
          const boat = (sail) => { const g = s.el("g"); g.append(s.el("path", { d: "M-30,0 Q0,16 30,0 L24,-6 L-24,-6 Z", fill: "#8a5a2a", stroke: "#5d3a1a", "stroke-width": 2 })); if (sail) g.append(s.el("path", { d: "M0,-6 L0,-60 M-18,-56 L18,-56 L16,-14 L-16,-14 Z", stroke: "#5d3a1a", "stroke-width": 2.5, fill: "#fff" })); return g; };
          const bN = boat(false), bS = boat(true);
          svg.append(bN, bS);
          const arrN = s.el("g", { class: "later" }); arrN.append(s.el("path", { d: "M110,400 L110,300 M98,316 L110,298 L122,316", stroke: "#1d5bd0", "stroke-width": 5, fill: "none", "stroke-linecap": "round" }), txt(s, 110, 430, "Strömung", { fill: "#1d5bd0" }));
          const arrS = s.el("g", { class: "later" }); arrS.append(s.el("path", { d: "M350,110 L350,210 M338,194 L350,212 L362,194", stroke: "#c0392b", "stroke-width": 5, fill: "none", "stroke-linecap": "round" }), txt(s, 350, 92, "Wind", { fill: "#c0392b" }));
          svg.append(arrN, arrS);
          const posN = v => bN.setAttribute("transform", `translate(${222 + Math.sin(v * 6) * 12},${470 - v * 380})`);
          const posS = v => bS.setAttribute("transform", `translate(${238 + Math.sin(v * 6) * 10},${90 + v * 340})`);
          posN(0); posS(0);
          const goods = [["Gold und Elfenbein", "aus Nubien im Süden"], ["Zedernholz", "aus dem Libanon, über das Mittelmeer"], ["Myrrhe (Duftharz)", "aus dem fernen Land Punt"], ["Wein", "aus Griechenland und Phönizien – in Ägypten wuchs wenig Wein"]].map(([a, b]) => s.h("div", { class: "card later", style: { padding: "12px 18px" } }, s.h("b", { class: "t", style: { color: C } }, a), p(s, "small", b)));
          const head = p(s, "h2 a-up", "Was kam nach Ägypten?");
          s.add(grid(s, "440px 1fr", svg, s.h("div", { class: "stack", style: { gap: "12px" } }, head, ...goods)));
          s.show(svg, "fade"); s.sfx.whoosh();
          s.step(async () => { s.show(arrN, "up"); s.sfx.whoosh(); await s.tween({ from: 0, to: 1, dur: 2000, update: posN }); s.say("Nach Norden ohne Segel: Die Strömung trägt das Boot."); });
          s.step(async () => { s.show(arrS, "down"); s.sfx.whoosh(); await s.tween({ from: 0, to: 1, dur: 2000, update: posS }); s.say("Nach Süden mit Segel: Der Wind weht meist von Norden."); });
          s.step(async () => { for (let i = 0; i < 4; i++) { s.sfx.coin(); await s.show(goods[i], "left"); } });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "So wird Papyrus gemacht",
        say: "Aus der Papyruspflanze machten die Ägypter Blätter zum Schreiben. Schau dir die Schritte an.",
        build(s) {
          const PW = 200, PH = 230;
          const panel = (i) => { const v = svgBox(s, PW, PH); v.append(s.el("rect", { x: 0, y: 0, width: PW, height: PH, fill: "#fdf3df", rx: 12 })); return v; };
          const p1 = panel(), p2 = panel(), p3 = panel(), p4 = panel(), p5 = panel();
          // 1 plant
          const plant = s.el("g");
          for (let i = -2; i <= 2; i++) plant.append(s.el("path", { d: `M100,${PH - 10} L${100 + i * 14},60`, stroke: "#3f8f3a", "stroke-width": 4 }), s.el("path", { d: `M${100 + i * 14},60 l-14,-26 M${100 + i * 14},60 l14,-26 M${100 + i * 14},60 l0,-30 M${100 + i * 14},60 l-22,-14 M${100 + i * 14},60 l22,-14`, stroke: "#5fae3c", "stroke-width": 2.5 }));
          p1.append(s.el("rect", { x: 0, y: PH - 30, width: PW, height: 30, fill: NILE }), plant);
          // 2 strips
          const strips2 = s.el("g");
          for (let i = 0; i < 6; i++) strips2.append(s.el("rect", { x: 30 + i * 24, y: 40, width: 18, height: 150, rx: 3, fill: "#efe0b6", stroke: "#b49a6a", "stroke-width": 2 }));
          p2.append(strips2);
          // 3 one layer
          const lay1 = s.el("g");
          for (let i = 0; i < 8; i++) lay1.append(s.el("rect", { x: 30 + i * 18, y: 40, width: 20, height: 150, fill: "#efe0b6", stroke: "#b49a6a", "stroke-width": 1.5 }));
          p3.append(lay1);
          // 4 crossing layer
          const l4a = lay1.cloneNode(true), l4b = s.el("g");
          for (let i = 0; i < 8; i++) l4b.append(s.el("rect", { x: 30, y: 40 + i * 18, width: 150, height: 20, fill: "#f3e6c2", stroke: "#b49a6a", "stroke-width": 1.5, opacity: .95 }));
          p4.append(l4a, l4b);
          // 5 press & dry
          const sheet5 = s.el("rect", { x: 30, y: 60, width: 140, height: 130, fill: "#ead8a6", stroke: "#b49a6a", "stroke-width": 2 });
          const press = s.el("rect", { x: 20, y: 0, width: 160, height: 40, rx: 6, fill: "#8e8a80", stroke: "#5d5a52", "stroke-width": 3 });
          p5.append(sheet5, press);
          const caps = [["1. Ernten", "Papyrus wächst am Nil, bis zu 5 m hoch."], ["2. Schneiden", "Das weiße Mark in Streifen schneiden, bis 4 cm breit."], ["3. Legen", "Streifen dicht nebeneinander legen."], ["4. Quer darüber", "Eine zweite Lage quer darauf."], ["5. Pressen", "Pressen, trocknen, glatt reiben – fertig!"]];
          const cols = [p1, p2, p3, p4, p5].map((v, i) => s.h("div", { class: "stack later", style: { gap: "8px", alignItems: "center" } }, v, s.h("b", { class: "t", style: { color: C } }, caps[i][0]), p(s, "small", caps[i][1])));
          cols.forEach((c, i) => { c.querySelector("p").style.textAlign = "center"; });
          const word = s.h("div", { class: "row later", style: { gap: "14px", flexWrap: "nowrap", justifyContent: "center" } }, s.h("span", { class: "chip", style: { fontSize: "22px" } }, "Papyrus"), s.h("span", { class: "t" }, "→ lateinisch papyrus →"), s.h("span", { class: "chip", style: { fontSize: "22px", background: C, color: "#fff" } }, "Papier"));
          const merk = s.h("div", { class: "merk later" }, "Unser Wort ", B(s, "Papier"), " kommt von Papyrus. Echtes Papier aus Pflanzenfasern und Wasser erfand man aber erst später in China, um 105 n. Chr.");
          s.add(s.h("div", { class: "stack", style: { gap: "14px" } }, s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "14px" } }, ...cols), word, merk));
          s.sfx.pop();
          s.step(async () => { s.sfx.pop(); await s.show(cols[0], "up"); await s.tween({ from: 0.2, to: 1, dur: 700, ease: "back", update: v => plant.setAttribute("transform", `translate(0,${PH * (1 - v)}) scale(1,${v})`) }); });
          s.step(async () => { s.sfx.snap(); await s.show(cols[1], "up"); for (let i = 0; i < 6; i++) { s.sfx.snap(); await s.wait(90); } });
          s.step(async () => { s.sfx.pop(); await s.show(cols[2], "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(cols[3], "up"); await s.tween({ from: -160, to: 0, dur: 700, update: v => l4b.setAttribute("transform", `translate(${v},0)`) }); });
          s.step(async () => { s.sfx.pop(); await s.show(cols[4], "up"); s.sfx.drum(); await s.tween({ from: 0, to: 20, dur: 500, ease: "bounce", update: v => press.setAttribute("y", v) }); });
          s.step(async () => { s.sfx.ding(); await s.show(word, "zoom"); await s.show(merk, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Der Nil heute: Assuan-Staudamm",
        say: "Seit 1970 staut ein riesiger Damm bei Assuan den Nil. Seitdem gibt es keine Nilschwemme mehr.",
        build(s) {
          const svg = svgBox(s, 1060, 250);
          svg.append(s.el("rect", { x: 0, y: 0, width: 1060, height: 250, fill: "#eef7fd", rx: 14 }), s.el("path", { d: "M0,200 L1060,200 L1060,250 L0,250 Z", fill: "#c79a5a" }));
          const lake = s.el("path", { d: "M0,200 L0,140 L560,140 L560,200 Z", fill: NILE, class: "later" });
          const dam = s.el("path", { d: "M540,200 L560,90 L600,90 L640,200 Z", fill: "#9aa3b2", stroke: "#5d6678", "stroke-width": 3, class: "later" });
          const river = s.el("rect", { x: 0, y: 176, width: 1060, height: 24, fill: NILE });
          const flood = s.el("rect", { x: 640, y: 130, width: 420, height: 70, fill: NILE, opacity: .7 });
          svg.append(river, flood, lake, dam);
          const Lt = [txt(s, 280, 120, "Nassersee: etwa 500 km lang", { fill: "#1d5bd0", class: "later" }), txt(s, 600, 70, "Damm", { class: "later" }), txt(s, 850, 110, "Nilschwemme", { fill: "#1d5bd0" })];
          svg.append(...Lt);
          const big = s.h("span", { class: "huge", style: { color: C } }, "1960");
          const when = exc(s, "Bauzeit", "later", s.h("div", { class: "row", style: { gap: "14px", flexWrap: "nowrap" } }, big, p(s, "small", "1960 Baubeginn, im Juli 1970 fertig. Eingeweiht wurde der Damm im Januar 1971.")));
          const plus = exc(s, "Gut", "later", p(s, "small", "Wasser das ganze Jahr. Schutz vor Dürre und zu starker Flut."));
          const minus = exc(s, "Schlecht", "later", p(s, "small", "Der Schlamm bleibt im See. Die Bauern brauchen Kunstdünger. Weniger Fische, das Delta bröckelt. Viele Nubier mussten umziehen."));
          s.add(s.h("div", { class: "stack", style: { gap: "16px" } }, svg, s.h("div", { style: { display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr", gap: "18px" } }, when, plus, minus)));
          s.show(svg, "fade"); s.sfx.whoosh();
          s.step(async () => { s.sfx.drum(); await s.show(dam, "bounce"); s.show(Lt[1], "pop"); s.show(when, "up"); await countUp(s, big, 1970, { from: 1960, dur: 900, raw: true }); });
          s.step(async () => { s.sfx.whoosh(); await s.show(lake, "left"); s.show(Lt[0], "pop"); await s.tween({ from: 1, to: 0, dur: 1200, update: v => { flood.setAttribute("opacity", 0.7 * v); Lt[2].setAttribute("opacity", v); } }); s.sfx.boing(); s.say("Die Nilschwemme ist vorbei. Der Schlamm bleibt im Stausee."); });
          s.step(async () => { s.sfx.success(); await s.show(plus, "up"); });
          s.step(async () => { s.sfx.error(); await s.show(minus, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Im Alltag: Nil, Spree und Papier",
        say: "Was hat Ägypten mit dir in Berlin zu tun? Mehr, als du denkst!",
        build(s) {
          const svg = svgBox(s, 1060, 180);
          const barN = s.el("rect", { x: 130, y: 30, width: 0, height: 44, rx: 8, fill: NILE });
          const barS = s.el("rect", { x: 130, y: 110, width: 0, height: 44, rx: 8, fill: "#7b4fd6" });
          const tN = txt(s, 140, 60, "", { "text-anchor": "start", fill: "#fff" }), tS = txt(s, 140, 140, "", { "text-anchor": "start" });
          svg.append(txt(s, 116, 60, "Nil", { "text-anchor": "end" }), txt(s, 116, 140, "Spree", { "text-anchor": "end" }), barN, barS, tN, tS);
          const card = (lbl, text) => s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, lbl), p(s, "t", text));
          const cs = [card("Spree und Nil", "Die Spree fließt durch Berlin und ist knapp 400 km lang. Der Nil ist etwa 16-mal so lang!"),
            card("Papier", "Jedes Heft in deiner Schultasche erinnert an den Nil: Das Wort Papier kommt von Papyrus."),
            card("Kalender", "Dein Jahr hat 365 Tage – wie das Jahr der alten Ägypter. Ein Schaltjahr kannten sie aber nicht."),
            card("Ägypten heute", "Über 100 Millionen Menschen leben heute in Ägypten. Die meisten wohnen am Nil.")];
          s.add(s.h("div", { class: "stack", style: { gap: "16px" } }, p(s, "h2 a-up", "Länge im Vergleich"), svg, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" } }, ...cs)));
          s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); await s.tween({ from: 0, to: 1, dur: 1600, update: v => { barN.setAttribute("width", 900 * v); tN.textContent = s.fmt(Math.round(6650 * v)) + " km"; barS.setAttribute("width", Math.max(0, 900 * 400 / 6650 * v)); } }); tS.setAttribute("x", 130 + 900 * 400 / 6650 + 12); tS.textContent = "knapp 400 km"; s.sfx.coin(); await s.show(cs[0], "up"); });
          cs.slice(1).forEach((c, i) => s.step(async () => { s.sfx.count(i * 2); await s.show(c, i % 2 ? "left" : "right"); if (i === 2) { s.sfx.success(); s.confetti(590, 420, 70); } }));
        },
      },
    ],
  });
})();
