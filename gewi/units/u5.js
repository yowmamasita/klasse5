/* Kapitel 5 – Leben an Nordsee und Ostsee (RLP GeWi 5/6, Thema 3.2 Wasser)
   Quellen: siehe Abschlussbericht (Wikipedia-Artikel Gezeiten, Wattenmeer, Sturmflut 1962, Hallig, Deich,
   Hamburger Hafen, Containerschiff, Bodden, Strandkorb, Alpha ventus, Wattwurm, Seehund …). */
(() => {
  const C = "#dc2626";
  const SEA = "#bfe3f5", SEA2 = "#8ccbea", DEEP = "#3b8fc9", LAND = "#efe3c2", GREEN = "#9fcf7a", SAND = "#f1d79a", WATT = "#b9a27a";

  /* ---------- helpers ---------- */
  const grid = (s, tpl, ...kids) => s.h("div", { style: { display: "grid", gridTemplateColumns: tpl, gap: "26px", alignItems: "center", height: "100%" } }, ...kids);
  const exc = (s, label, cls, ...kids) => s.h("div", { class: "ex" + (cls ? " " + cls : "") }, s.h("span", { class: "exlabel" }, label), ...kids);
  const lifeBox = (s, cls, ...kids) => s.h("div", { class: "life" + (cls ? " " + cls : "") }, s.h("span", { class: "exlabel" }, "Im Alltag"), ...kids);
  const p = (s, cls, ...kids) => s.h("p", { class: cls }, ...kids);
  const B = (s, t) => s.h("b", null, t);
  async function countUp(s, el, to, { dur = 900, dec = 0, pre = "", post = "", from = 0, raw = false } = {}) {
    const F = v => raw ? String(Math.round(v)) : s.fmt(v, dec);
    let last = -1;
    await s.tween({ from, to, dur, ease: "out", update: v => { el.textContent = pre + F(v) + post; const k = Math.floor(v / (to / 8 || 1)); if (k !== last) { last = k; s.sfx.tick(); } } });
    el.textContent = pre + F(to) + post;
  }
  function svgBox(s, w, h, vw, vh) { return s.el("svg", { width: w, height: h, viewBox: `0 0 ${vw || w} ${vh || h}` }); }
  function txt(s, x, y, t, o = {}) {
    return s.el("text", Object.assign({ x, y, "font-size": 21, "font-weight": 700, fill: "#1b2740", "text-anchor": "middle", text: t }, o));
  }
  function tag(s, x, y, t, o = {}) { // label with white pill behind it
    const g = s.el("g", { class: o.later === false ? "" : "later" });
    const w = t.length * (o.fs || 20) * 0.55 + 18, h = (o.fs || 20) + 12;
    const ax = o.anchor === "start" ? x : o.anchor === "end" ? x - w : x - w / 2;
    g.append(s.el("rect", { x: ax, y: y - h + 7, width: w, height: h, rx: 9, fill: "#fff", opacity: 0.92, stroke: o.stroke || "#c8d3de", "stroke-width": 2 }),
      s.el("text", { x: ax + w / 2, y: y - 1, "font-size": o.fs || 20, "font-weight": 700, fill: o.fill || "#1b2740", "text-anchor": "middle", text: t }));
    return g;
  }

  /* simplified map of the German coasts: x=(lon-6)*62, y=(57.6-lat)*105 */
  const P = (lon, lat) => [(lon - 6) * 62, (57.6 - lat) * 105];
  const path = pts => "M" + pts.map(q => P(q[0], q[1]).map(v => v.toFixed(1)).join(",")).join(" L") + " Z";
  const MAINLAND = [[6.0, 52.2], [6.0, 53.42], [6.6, 53.45], [7.0, 53.3], [7.2, 53.55], [7.6, 53.68], [8.0, 53.7], [8.1, 53.52], [8.3, 53.45], [8.5, 53.6], [8.55, 53.85], [8.7, 53.88], [9.0, 53.85], [8.9, 54.05], [8.85, 54.25], [8.6, 54.32], [8.9, 54.45], [8.8, 54.7], [8.65, 54.92], [8.6, 55.1], [8.45, 55.45], [8.1, 55.55], [8.15, 56.0], [8.12, 56.6], [8.6, 57.1], [9.5, 57.15], [10.0, 57.55], [10.6, 57.8], [10.5, 57.4], [10.55, 57.0], [10.3, 56.6], [10.9, 56.4], [10.25, 56.15], [10.0, 55.75], [9.7, 55.5], [9.65, 55.2], [9.5, 54.85], [10.0, 54.7], [9.95, 54.5], [10.15, 54.42], [10.25, 54.36], [10.8, 54.3], [11.1, 54.38], [10.85, 54.1], [10.75, 53.92], [11.0, 53.95], [11.5, 54.0], [11.9, 54.15], [12.1, 54.18], [12.5, 54.42], [12.9, 54.45], [13.1, 54.3], [13.45, 54.1], [13.8, 54.1], [14.2, 53.95], [14.6, 53.9], [15.1, 54.0], [15.1, 52.2]];
  const ISLANDS = [
    [[13.15, 54.45], [13.3, 54.6], [13.4, 54.68], [13.6, 54.6], [13.65, 54.45], [13.55, 54.3], [13.35, 54.25], [13.2, 54.3]], // Rügen
    [[9.8, 55.5], [10.4, 55.6], [10.8, 55.3], [10.6, 55.05], [10.0, 55.1]], // Fünen
    [[11.1, 55.7], [11.8, 56.0], [12.5, 56.1], [12.6, 55.65], [12.2, 55.3], [11.8, 55.05], [11.2, 55.3]], // Seeland
    [[11.0, 54.8], [11.9, 54.95], [12.1, 54.6], [11.6, 54.65]], // Lolland/Falster
    [[12.0, 57.9], [12.3, 57.0], [12.85, 56.65], [12.6, 56.2], [12.95, 55.6], [13.2, 55.35], [14.2, 55.4], [14.4, 55.7], [14.2, 56.0], [15.1, 56.15], [15.1, 57.9]], // Schweden
    [[8.28, 54.75], [8.4, 54.75], [8.45, 55.05], [8.35, 55.05]], // Sylt
    [[8.45, 54.68], [8.6, 54.7], [8.58, 54.76], [8.45, 54.75]], // Föhr
  ];
  function coastMap(s, size = 540) {
    const svg = svgBox(s, size, size, 560, 560);
    svg.append(s.el("rect", { x: 0, y: 0, width: 560, height: 560, fill: SEA, rx: 18 }));
    const watt = s.el("path", { d: path([[6.6, 53.5], [7.2, 53.62], [8.0, 53.78], [8.5, 53.95], [8.7, 54.3], [8.4, 54.6], [8.3, 55.0], [8.5, 55.4], [8.7, 55.2], [8.85, 54.7], [8.95, 54.2], [9.0, 53.9], [8.5, 53.62], [8.0, 53.68], [7.2, 53.5]]), fill: WATT, opacity: 0.85, class: "later" });
    svg.append(watt);
    svg.append(s.el("path", { d: path(MAINLAND), fill: LAND, stroke: "#b49a6a", "stroke-width": 2, "stroke-linejoin": "round" }));
    ISLANDS.forEach(isl => svg.append(s.el("path", { d: path(isl), fill: LAND, stroke: "#b49a6a", "stroke-width": 2, "stroke-linejoin": "round" })));
    [[6.8, 53.72], [7.2, 53.74], [7.55, 53.77], [7.85, 53.78]].forEach(([lo, la]) => { const [x, y] = P(lo, la); svg.append(s.el("ellipse", { cx: x, cy: y, rx: 11, ry: 3.5, fill: LAND, stroke: "#b49a6a", "stroke-width": 1.5 })); });
    const [bx, by] = P(14.9, 55.12); svg.append(s.el("ellipse", { cx: bx, cy: by, rx: 10, ry: 7, fill: LAND, stroke: "#b49a6a", "stroke-width": 1.5 }));
    // border Germany / Denmark
    const b1 = P(8.65, 54.91), b2 = P(9.6, 54.82);
    svg.append(s.el("line", { x1: b1[0], y1: b1[1], x2: b2[0], y2: b2[1], stroke: "#8a7a5a", "stroke-width": 2.5, "stroke-dasharray": "6 5" }));
    const nord = txt(s, 75, 335, "Nordsee", { "font-size": 28, fill: "#1d5bd0", class: "later" });
    const ost = txt(s, 492, 272, "Ostsee", { "font-size": 28, fill: "#1d5bd0", class: "later" });
    svg.append(nord, ost);
    const city = (lon, lat, name, lx, ly, anchor) => {
      const [x, y] = P(lon, lat);
      const g = s.el("g", { class: "later" });
      g.append(s.el("circle", { cx: x, cy: y, r: 7, fill: C, stroke: "#fff", "stroke-width": 2.5 }), txt(s, lx, ly, name, { "text-anchor": anchor || "middle", "font-size": 21 }));
      svg.append(g); return g;
    };
    const cities = [city(10.0, 53.55, "Hamburg", 258, 438, "start"), city(10.13, 54.32, "Kiel", 246, 352, "end"), city(12.1, 54.09, "Rostock", 378, 398), city(13.4, 52.52, "Berlin", 459, 520)];
    const sylt = txt(s, 132, 284, "Sylt", { "text-anchor": "end", class: "later", fill: "#7a4a12" });
    const ruegen = txt(s, 484, 347, "Rügen", { "text-anchor": "start", class: "later", fill: "#7a4a12" });
    svg.append(sylt, ruegen);
    return { svg, nord, ost, cities, watt, isl: [sylt, ruegen] };
  }

  /* little drawings */
  function strandkorb(s, x, y, k = 1) {
    const g = s.el("g", { transform: `translate(${x},${y}) scale(${k})` });
    g.append(s.el("rect", { x: -26, y: -46, width: 52, height: 46, rx: 6, fill: "#f5e3b5", stroke: "#a77b3a", "stroke-width": 3 }),
      s.el("path", { d: "M-30,-44 Q0,-72 30,-44 Z", fill: "#2a6fd6", stroke: "#1d4f9c", "stroke-width": 3 }),
      s.el("path", { d: "M-22,-40 L-22,-6 M22,-40 L22,-6 M-22,-20 L22,-20", stroke: "#c79a52", "stroke-width": 2 }),
      s.el("rect", { x: -18, y: -18, width: 36, height: 10, rx: 3, fill: "#ffffff", stroke: "#a77b3a", "stroke-width": 2 }));
    return g;
  }
  function castle(s, x, y, k = 1) {
    const g = s.el("g", { transform: `translate(${x},${y}) scale(${k})` });
    g.append(s.el("path", { d: "M-30,0 L-30,-24 L-22,-24 L-22,-30 L-14,-30 L-14,-24 L-6,-24 L-6,-44 L2,-44 L2,-50 L10,-50 L10,-44 L18,-44 L18,-24 L30,-24 L30,0 Z", fill: SAND, stroke: "#b8893a", "stroke-width": 3, "stroke-linejoin": "round" }),
      s.el("path", { d: "M10,-50 L10,-64 L24,-59 L10,-55", fill: C, stroke: "#8a1a1a", "stroke-width": 1.5 }));
    return g;
  }
  function ship(s, x, y, k = 1, color = C) {
    const g = s.el("g", { transform: `translate(${x},${y}) scale(${k})` });
    g.append(s.el("path", { d: "M-60,-6 L60,-6 L48,14 L-52,14 Z", fill: "#27324d" }),
      s.el("rect", { x: -48, y: -24, width: 16, height: 18, fill: color }), s.el("rect", { x: -30, y: -24, width: 16, height: 18, fill: "#1d5bd0" }),
      s.el("rect", { x: -12, y: -24, width: 16, height: 18, fill: "#138a5a" }), s.el("rect", { x: 6, y: -24, width: 16, height: 18, fill: "#ee7a1a" }),
      s.el("rect", { x: -30, y: -42, width: 16, height: 18, fill: "#ee7a1a" }), s.el("rect", { x: -12, y: -42, width: 16, height: 18, fill: color }),
      s.el("rect", { x: 30, y: -40, width: 18, height: 34, fill: "#fff", stroke: "#27324d", "stroke-width": 2 }));
    return g;
  }
  function seal(s, x, y, k = 1) {
    const g = s.el("g", { transform: `translate(${x},${y}) scale(${k})` });
    g.append(s.el("path", { d: "M-40,0 Q-30,-22 0,-20 Q22,-20 30,-30 Q44,-36 46,-22 Q46,-10 34,-6 Q20,2 -40,0 Z", fill: "#7d8794", stroke: "#4f5866", "stroke-width": 2.5 }),
      s.el("circle", { cx: 40, cy: -24, r: 2.8, fill: "#111" }), s.el("path", { d: "M-40,0 L-52,-8 M-40,0 L-52,6", stroke: "#4f5866", "stroke-width": 4, "stroke-linecap": "round" }),
      s.el("path", { d: "M44,-15 l10,-3 M44,-13 l10,2", stroke: "#333", "stroke-width": 1.2 }));
    return g;
  }

  Deck.unit({
    id: "u5", num: 5, title: "Leben an Nordsee und Ostsee", color: C, soft: "#fde6e3",
    subtitle: "Ebbe, Flut, Deiche und Häfen",
    blurb: "Gezeiten, Wattenmeer, Sturmflut, Deiche, Ostseeküste und Hafen.",
    goals: ["Nordsee und Ostsee auf der Karte finden", "Ebbe und Flut erklären – mit dem Mond", "Das Wattenmeer und seine Tiere kennen", "Verstehen, wie Deiche vor Sturmfluten schützen", "Häfen, Fischerei und Windparks an der Küste entdecken"],
    icon(svg, el) {
      svg.append(el("circle", { cx: 50, cy: 18, r: 9, fill: "#ffd94a" }),
        el("path", { d: "M4,40 Q14,32 24,40 T44,40 T64,40", fill: "none", stroke: C, "stroke-width": 5, "stroke-linecap": "round" }),
        el("path", { d: "M4,54 Q14,46 24,54 T44,54 T64,54", fill: "none", stroke: "#1d5bd0", "stroke-width": 5, "stroke-linecap": "round" }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Deutschlands zwei Meere",
        say: "Deutschland hat zwei Meere: im Nordwesten die Nordsee und im Nordosten die Ostsee.",
        build(s) {
          const m = coastMap(s);
          const c1 = exc(s, "Nordsee", "later", p(s, "small", "Offen zum Atlantik. ", B(s, "Zweimal am Tag Ebbe und Flut."), " Vor der Küste liegt das Wattenmeer."));
          const c2 = exc(s, "Ostsee", "later", p(s, "small", "Fast ganz von Land umgeben. ", B(s, "Kaum Ebbe und Flut."), " Steilküsten, Sandstrände und Bodden."));
          const lf = lifeBox(s, "later", p(s, "small", "Sylt liegt in der Nordsee, Rügen in der Ostsee. Von Hamburg, Kiel und Rostock fahren Schiffe in die ganze Welt."));
          s.add(grid(s, "540px 1fr", m.svg, s.h("div", { class: "stack" }, p(s, "h2 a-up", "Zwei Küsten, zwei Meere"), p(s, "t a-up", "Berlin liegt im Binnenland. Im Norden aber hat Deutschland Küste!"), c1, c2, lf)));
          s.show(m.svg, "zoom"); s.sound("strand-moewen", { vol: .45 });
          s.step(async () => { s.sfx.swoosh(); s.show(m.nord, "pop"); s.show(m.watt, "fade"); await s.show(c1, "left"); s.say("Links die Nordsee, mit Ebbe und Flut und dem Wattenmeer."); });
          s.step(async () => { s.sfx.swoosh(); s.show(m.ost, "pop"); await s.show(c2, "left"); s.say("Rechts die Ostsee. Sie ist fast ganz von Land umgeben."); });
          s.step(async () => { for (let i = 0; i < m.cities.length; i++) { s.sfx.count(i); s.show(m.cities[i], "pop"); await s.wait(260); } s.sfx.pop(); await s.show(m.isl, "pop"); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Ebbe und Flut",
        say: "An der Nordsee steigt und fällt das Wasser zweimal am Tag. Das nennt man Gezeiten.",
        build(s) {
          const W = 560, Hh = 380, PER = 12.42;
          const { canvas, g } = s.canvas(W, Hh);
          let t = 0;
          const ground = x => 360 - 210 * (x / W);
          const level = t => 255 - 45 * Math.cos(2 * Math.PI * t / PER);
          let wave = 0;
          const draw = () => {
            g.clearRect(0, 0, W, Hh);
            const sky = g.createLinearGradient(0, 0, 0, Hh); sky.addColorStop(0, "#dff1fb"); sky.addColorStop(1, "#ffffff");
            g.fillStyle = sky; g.fillRect(0, 0, W, Hh);
            g.fillStyle = "#ffd94a"; g.beginPath(); g.arc(470, 60, 30, 0, 7); g.fill();
            const lv = level(t);
            const xw = (360 - lv) / 210 * W;
            // water
            g.fillStyle = "#6fb6e3"; g.beginPath(); g.moveTo(0, Hh);
            for (let x = 0; x <= xw; x += 6) g.lineTo(x, lv + Math.sin(x / 22 + wave) * 4);
            g.lineTo(xw, ground(xw)); g.lineTo(W, Hh); g.closePath(); g.fill();
            // sand
            g.fillStyle = SAND; g.beginPath(); g.moveTo(0, ground(0)); g.lineTo(W, ground(W)); g.lineTo(W, Hh); g.lineTo(0, Hh); g.closePath(); g.fill();
            g.fillStyle = "#93c56b"; g.beginPath(); g.moveTo(500, ground(500)); g.quadraticCurveTo(530, 110, W, 120); g.lineTo(W, ground(W)); g.closePath(); g.fill();
            // water over sand (in front)
            g.fillStyle = "rgba(80,160,220,.55)"; g.beginPath(); g.moveTo(0, ground(0));
            for (let x = 0; x <= xw; x += 6) g.lineTo(x, Math.min(ground(x), lv + Math.sin(x / 22 + wave) * 4));
            g.lineTo(xw, ground(xw)); g.closePath(); g.fill();
            // lines
            g.setLineDash([8, 6]); g.lineWidth = 2;
            g.strokeStyle = "#1d5bd0"; g.beginPath(); g.moveTo(0, 210); g.lineTo(420, 210); g.stroke();
            g.strokeStyle = C; g.beginPath(); g.moveTo(0, 300); g.lineTo(200, 300); g.stroke(); g.setLineDash([]);
            g.font = "700 19px Atkinson Hyperlegible, sans-serif"; g.fillStyle = "#1d5bd0"; g.fillText("Hochwasser", 10, 202);
            g.fillStyle = C; g.fillText("Niedrigwasser", 10, 292);
            // castle (x≈280) and strandkorb (x≈480)
            const cx = 280, cy = ground(280);
            g.fillStyle = SAND; g.strokeStyle = "#b8893a"; g.lineWidth = 3;
            const under = lv < cy - 5;
            g.globalAlpha = under ? 0.45 : 1;
            g.beginPath(); g.moveTo(cx - 24, cy); g.lineTo(cx - 24, cy - 22); g.lineTo(cx - 10, cy - 22); g.lineTo(cx - 10, cy - 38); g.lineTo(cx + 10, cy - 38); g.lineTo(cx + 10, cy - 22); g.lineTo(cx + 24, cy - 22); g.lineTo(cx + 24, cy); g.closePath(); g.fill(); g.stroke();
            g.globalAlpha = 1;
            const kx = 470, ky = ground(470);
            g.fillStyle = "#f5e3b5"; g.strokeStyle = "#a77b3a"; g.fillRect(kx - 22, ky - 42, 44, 42); g.strokeRect(kx - 22, ky - 42, 44, 42);
            g.fillStyle = "#2a6fd6"; g.beginPath(); g.moveTo(kx - 26, ky - 40); g.quadraticCurveTo(kx, ky - 66, kx + 26, ky - 40); g.closePath(); g.fill();
          };
          draw();
          const hand = s.el("line", { x1: 115, y1: 115, x2: 115, y2: 62, stroke: C, "stroke-width": 7, "stroke-linecap": "round" });
          const clock = svgBox(s, 230, 230);
          clock.append(s.el("circle", { cx: 115, cy: 115, r: 108, fill: "#fff", stroke: "#1b2740", "stroke-width": 4 }),
            s.el("path", { d: "M115,7 A108,108 0 0 1 115,223", fill: "none", stroke: "#f2b8b0", "stroke-width": 14 }),
            s.el("path", { d: "M115,223 A108,108 0 0 1 115,7", fill: "none", stroke: "#a9d4f2", "stroke-width": 14 }),
            txt(s, 115, 46, "Hoch", { "font-size": 20, fill: "#1d5bd0" }), txt(s, 115, 200, "Niedrig", { "font-size": 20, fill: C }),
            txt(s, 178, 122, "Ebbe", { "font-size": 20 }), txt(s, 52, 122, "Flut", { "font-size": 20 }),
            hand, s.el("circle", { cx: 115, cy: 115, r: 9, fill: "#1b2740" }));
          const status = p(s, "big", "Hochwasser");
          const time = p(s, "t mono", "Zeit: 0 h 00 min");
          const fmtT = v => { const h = Math.floor(v), m = Math.round((v - h) * 60); return `${h} h ${String(m).padStart(2, "0")} min`; };
          const update = v => {
            t = v; draw();
            const a = v / PER * 2 * Math.PI;
            hand.setAttribute("x2", 115 + 53 * Math.sin(a)); hand.setAttribute("y2", 115 - 53 * Math.cos(a));
            status.textContent = Math.abs(v) < 0.45 || v > PER - 0.45 ? "Hochwasser" : Math.abs(v - PER / 2) < 0.45 ? "Niedrigwasser" : v < PER / 2 ? "Ebbe: Wasser fällt" : "Flut: Wasser steigt";
            status.style.color = v < PER / 2 && Math.abs(v - PER / 2) >= 0.45 && v >= 0.45 ? C : "#1d5bd0";
            time.textContent = "Zeit: " + fmtT(v);
          };
          const sl = s.slider({ label: "Uhrzeit ab Hochwasser", min: 0, max: 12.4, step: 0.1, value: 0, fmt: fmtT, onInput: update });
          sl.classList.add("later");
          let playing = false;
          const play = () => {
            if (playing) return; playing = true; s.sound("waves", { vol: .4 });
            let last = -1;
            s.loop(tt => {
              const v = Math.min(PER - 0.02, tt * 1.15);
              wave = tt * 3; sl.set(+v.toFixed(2));
              const k = Math.floor(v); if (k !== last) { last = k; s.sfx.tick(); }
              if (v >= PER - 0.02) { playing = false; s.sfx.ding(); return false; }
            });
          };
          const btn = s.h("button", { class: "btn solid later", onclick: () => { sl.set(0); play(); } }, "▶ 12 Stunden abspielen");
          const merk = s.h("div", { class: "merk later" }, "Von einem Hochwasser zum nächsten dauert es etwa ", B(s, "12 Stunden 25 Minuten"), ". Ebbe dauert gut 6 Stunden, Flut auch.");
          s.add(grid(s, "560px 1fr",
            s.h("div", { class: "stack", style: { alignItems: "center" } }, canvas, btn),
            s.h("div", { class: "stack" }, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "20px" } }, clock, s.h("div", { class: "stack", style: { gap: "8px" } }, status, time)), sl, merk)));
          s.show(canvas, "fade"); s.show(clock, "pop"); s.sfx.pop();
          s.loop(tt => { if (!playing) { wave = tt * 3; draw(); } });
          s.step(async () => { s.show(sl, "up"); await s.show(btn, "pop"); s.say("Schau zu, wie das Wasser in zwölf Stunden fällt und wieder steigt."); play(); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 2b --------------------------------------------------------------- */
      {
        title: "Ebbe und Flut in echt",
        say: "So sieht das in echt aus: der Hafen von Husum an der Nordsee. Einmal bei Flut, einmal bei Ebbe.",
        build(s) {
          const f1 = s.photo("husum-flut", { w: 530, h: 410, caption: "Husum: Hafen bei Flut", pos: "50% 60%" });
          const f2 = s.photo("husum-ebbe", { w: 530, h: 410, caption: "Husum: Hafen bei Ebbe", cls: "later", pos: "50% 55%" });
          const merk = s.h("div", { class: "merk later" }, "Bei Ebbe fällt der Husumer Binnenhafen fast ", B(s, "trocken"), ". Dann fließt dort nur noch ein kleines Rinnsal, und die Boote sitzen auf dem Schlick.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "20px" } },
            s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "28px", justifyContent: "center" } }, f1, f2), merk));
          s.show(f1, "zoom"); s.sound("waves", { vol: .4, dur: 5 });
          s.step(async () => { s.sound("moewen", { vol: .5 }); await s.show(f2, "zoom"); s.say("Bei Ebbe ist das Wasser fast ganz weg!"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Warum? Der Mond zieht!",
        say: "Der Mond zieht am Wasser der Meere. So entstehen Flutberge, und die Erde dreht sich unter ihnen hindurch.",
        build(s) {
          const svg = svgBox(s, 520, 520);
          const cx = 260, cy = 260;
          svg.append(s.el("circle", { cx, cy, r: 222, fill: "none", stroke: "#c8d3de", "stroke-width": 2, "stroke-dasharray": "6 8" }));
          const water = s.el("ellipse", { cx, cy, rx: 112, ry: 112, fill: "#6fb6e3", opacity: 0.85 });
          const earth = s.el("g");
          earth.append(s.el("circle", { cx, cy, r: 100, fill: "#3b8fc9" }),
            s.el("path", { d: `M${cx - 50},${cy - 60} q30,-20 60,0 q20,30 -10,50 q-30,10 -50,-20 z M${cx + 20},${cy + 20} q30,-10 45,15 q-5,35 -35,35 q-25,-20 -10,-50 z`, fill: "#7dbb5a" }));
          const you = s.el("circle", { cx, cy: cy - 104, r: 11, fill: C, stroke: "#fff", "stroke-width": 3 });
          const youG = s.el("g"); youG.append(you);
          const moonG = s.el("g", { class: "later" });
          const moon = s.el("circle", { cx: 0, cy: 0, r: 34, fill: "#e8e6dc", stroke: "#9b978a", "stroke-width": 3 });
          moonG.append(moon, txt(s, 0, 7, "Mond", { "font-size": 19 }));
          svg.append(water, earth, youG, txt(s, cx, cy + 7, "Erde", { fill: "#fff", "font-size": 24 }), moonG);
          let ang = 90; // moon angle (deg, 0 = right, 90 = top)
          const placeMoon = () => { const a = ang * Math.PI / 180; moonG.setAttribute("transform", `translate(${cx + 222 * Math.cos(a)},${cy - 222 * Math.sin(a)})`); water.setAttribute("transform", `rotate(${-ang} ${cx} ${cy})`); };
          placeMoon();
          const t1 = p(s, "t later", "Der Mond zieht am Wasser. Es entstehen ", B(s, "zwei Flutberge"), ": einer zum Mond hin, einer auf der anderen Seite.");
          const t2 = p(s, "t later", "Die Erde dreht sich einmal am Tag. Der rote Punkt bist du am Strand. Kommst du unter einen Flutberg, ist ", B(s, "Hochwasser"), ".");
          const hwRow = s.h("div", { class: "row later", style: { gap: "10px" } });
          const merk = s.h("div", { class: "merk later" }, "Zweimal am Tag Hochwasser – alle 12 Stunden 25 Minuten. Darum kommt die Flut jeden Tag etwa ", B(s, "50 Minuten später"), ".");
          s.add(grid(s, "520px 1fr", svg, s.h("div", { class: "stack" }, t1, t2, hwRow, merk)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          s.step(async () => {
            s.sfx.pop(); await s.show(moonG, "pop"); s.sfx.whoosh();
            s.show(t1, "up");
            await s.tween({ from: 112, to: 160, dur: 1000, ease: "back", update: v => water.setAttribute("rx", v) });
          });
          s.step(async () => {
            s.show(t2, "up"); s.show(hwRow, "fade"); s.say("Zweimal am Tag kommst du unter einen Flutberg.");
            const REL = 24.84; let shown = 0;
            const times = ["0:00 Uhr", "12:25 Uhr", "0:50 Uhr", "13:15 Uhr"];
            const sim = hr => {
              const earthA = 90 + 360 * hr / 24; ang = 90 + 360 * hr * (1 / 24 - 1 / REL); placeMoon();
              youG.setAttribute("transform", `rotate(${-(earthA - 90)} ${cx} ${cy})`);
              earth.setAttribute("transform", `rotate(${-(earthA - 90)} ${cx} ${cy})`);
              const k = Math.floor((hr + 0.3) / (REL / 2));
              while (shown <= k && shown < 4) { const c = s.h("span", { class: "chip" }, (shown < 2 ? "1. Tag " : "2. Tag ") + times[shown]); hwRow.append(c); s.show(c, "pop"); s.sfx.coin(); shown++; }
            };
            if (s.fast) { sim(37.3); return; }
            await new Promise(res => s.loop(tt => { const hr = tt * 5; sim(Math.min(hr, 37.3)); if (hr >= 37.3) { res(); return false; } }));
          });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Im Alltag: Gezeiten am Strand",
        say: "Ebbe und Flut merkst du im Urlaub an vielen Stellen: beim Strandkorb, bei der Sandburg und bei der Fähre.",
        build(s) {
          const icon = (draw) => { const v = svgBox(s, 220, 180, 130, 110); draw(v); return v; };
          const mk = (svg, title, text) => { const c = s.h("div", { class: "life later", style: { display: "grid", gridTemplateColumns: "220px 1fr", gap: "16px", alignItems: "center" } }, svg, s.h("div", null, s.h("span", { class: "exlabel" }, title), p(s, "small", ...text))); return c; };
          const i1 = s.photo("strandkorb-spo", { w: 220, h: 190, pos: "35% 50%" });
          const i2 = s.photo("sandburg", { w: 220, h: 190 });
          const i3 = s.photo("faehre-dageboell", { w: 220, h: 190, pos: "60% 50%" });
          const i4 = icon(v => { v.append(s.el("circle", { cx: 65, cy: 55, r: 46, fill: "#fff", stroke: "#1b2740", "stroke-width": 4 }), s.el("line", { x1: 65, y1: 55, x2: 65, y2: 22, stroke: "#1b2740", "stroke-width": 5, "stroke-linecap": "round" })); const hnd = s.el("line", { x1: 65, y1: 55, x2: 92, y2: 55, stroke: C, "stroke-width": 5, "stroke-linecap": "round" }); v.append(hnd); v._h = hnd; });
          const chips = ["Mo 10:00", "Di 10:50", "Mi 11:40"].map(t => s.h("span", { class: "chip later" }, t));
          const c1 = mk(i1, "Strandkorb", ["An der Nordsee steht der Strandkorb weit oben am Strand. Sonst kommt die Flut bis an deine Füße!"]);
          const c2 = mk(i2, "Sandburg", ["Baust du bei Ebbe nah am Wasser, holt die Flut deine Burg nach ein paar Stunden."]);
          const c3 = mk(i3, "Fähre nach Föhr", ["Die Fähre von Dagebüll braucht rund 50 Minuten. Bei sehr niedrigem Wasser und starkem Ostwind kann sie ausfallen."]);
          const c4 = mk(i4, "Gezeiten-Kalender", ["Hochwasser kommt jeden Tag etwa 50 Minuten später:", s.h("span", { class: "row", style: { gap: "8px", marginTop: "6px" } }, chips)]);
          s.add(s.h("div", { class: "stack", style: { height: "100%" } }, p(s, "h2 a-up", "Wo merkst du Ebbe und Flut?"),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "20px", flex: 1 } }, c1, c2, c3, c4)));
          s.sfx.pop();
          s.step(async () => { s.sound("waves", { vol: .45, dur: 4 }); await s.show(c1, "left"); });
          s.step(async () => { s.sfx.pop(); await s.show(c2, "right"); s.sound("splash", { vol: .5 }); });
          s.step(async () => { s.sound("schiffshorn", { vol: .5 }); await s.show(c3, "left"); });
          s.step(async () => { s.sound("clock-tick", { vol: .5, dur: 2.5 }); await s.show(c4, "right"); for (let i = 0; i < 3; i++) { s.sfx.count(i * 2); s.show(chips[i], "pop"); await s.tween({ from: i * 100, to: i * 100 + 100, dur: 380, update: v => { const a = v / 600 * 2 * Math.PI + Math.PI / 2; i4._h.setAttribute("x2", 65 + 27 * Math.sin(a)); i4._h.setAttribute("y2", 55 - 27 * Math.cos(a)); } }); } });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Das Wattenmeer",
        say: "Bei Ebbe fällt vor der Nordseeküste der Meeresboden trocken. Das ist das Wattenmeer.",
        build(s) {
          const svg = svgBox(s, 600, 440);
          svg.append(s.el("rect", { x: 0, y: 0, width: 600, height: 440, fill: SEA2, rx: 16 }));
          svg.append(s.el("path", { d: "M0,110 Q150,80 300,105 T600,95 L600,440 L0,440 Z", fill: WATT }));
          svg.append(s.el("path", { d: "M0,395 Q300,370 600,392 L600,440 L0,440 Z", fill: GREEN }), s.el("path", { d: "M0,392 Q300,367 600,389", fill: "none", stroke: "#5e9a3f", "stroke-width": 5 }));
          const priele = [s.el("path", { d: "M120,105 C140,170 80,210 130,260 S220,330 190,385", fill: "none", stroke: "#6fb6e3", "stroke-width": 16, "stroke-linecap": "round", class: "later" }),
            s.el("path", { d: "M430,100 C400,160 470,200 430,250 S360,300 400,340", fill: "none", stroke: "#6fb6e3", "stroke-width": 12, "stroke-linecap": "round", class: "later" }),
            s.el("path", { d: "M130,260 C170,250 210,270 250,250", fill: "none", stroke: "#6fb6e3", "stroke-width": 8, "stroke-linecap": "round", class: "later" })];
          svg.append(...priele);
          const bank = s.el("ellipse", { cx: 470, cy: 150, rx: 80, ry: 18, fill: SAND, class: "later" });
          const seals = s.el("g", { class: "later" }); seals.append(seal(s, 440, 148, .6), seal(s, 500, 146, .5));
          svg.append(bank, seals);
          const heaps = s.el("g", { class: "later" });
          [[270, 170], [300, 200], [330, 175], [250, 215], [310, 240], [350, 215], [280, 285], [330, 300], [530, 270], [560, 300], [500, 320]].forEach(([x, y]) => heaps.append(s.el("path", { d: `M${x - 8},${y} q4,-8 8,-3 q4,-6 8,0 q-2,5 -8,4 q-4,2 -8,-1`, fill: "none", stroke: "#7a6440", "stroke-width": 3 })));
          svg.append(heaps);
          const birds = s.el("g", { class: "later" });
          [[80, 40], [110, 55], [200, 35], [330, 50]].forEach(([x, y]) => birds.append(s.el("path", { d: `M${x - 12},${y} q6,-8 12,0 q6,-8 12,0`, fill: "none", stroke: "#1b2740", "stroke-width": 3 })));
          svg.append(birds);
          const L = [tag(s, 300, 72, "Meer (bei Ebbe weit draußen)"), tag(s, 175, 330, "Priel", { fill: "#1d5bd0" }), tag(s, 455, 200, "Sandbank mit Seehunden"), tag(s, 300, 140, "Wattwurm-Häufchen"), tag(s, 300, 430, "Deich und Land")];
          svg.append(...L);
          const st = (n, label) => { const big = s.h("span", { class: "big", style: { color: C } }, n); return { el: s.h("div", { class: "later", style: { display: "grid", gridTemplateColumns: "150px 1fr", alignItems: "center", gap: "12px" } }, big, p(s, "small", label)), big }; };
          const s1 = st("1900", "seit 2009 UNESCO-Weltnaturerbe (Deutschland und Niederlande; Dänemark seit 2014)");
          const s2 = st("0", "Tier- und Pflanzenarten leben hier – über 10.000!");
          const s3 = st("0", "Kilometer lang: von den Niederlanden bis Dänemark");
          const merk = s.h("div", { class: "merk later" }, B(s, "Watt"), " = Meeresboden, der bei Ebbe trocken fällt. Bei Flut ist alles wieder Meer.");
          s.add(grid(s, "600px 1fr", svg, s.h("div", { class: "stack" }, s1.el, s2.el, s3.el, merk)));
          s.show(svg, "fade"); s.sfx.whoosh(); s.show(L[0], "pop");
          s.step(async () => { s.sfx.whoosh(); await s.show(priele, "draw"); s.sfx.pop(); s.show(L[1], "pop"); s.show(heaps, "fade"); await s.show(L[3], "pop"); });
          s.step(async () => { s.sound("moewen", { vol: .45 }); s.show(bank, "zoom"); s.show(seals, "up"); s.show(birds, "fade"); s.show(L[2], "pop"); await s.show(L[4], "pop"); });
          s.step(async () => { s.show(s1.el, "left"); await countUp(s, s1.big, 2009, { from: 1900, dur: 900, raw: true }); s.sfx.ding(); s.show(s2.el, "left"); await countUp(s, s2.big, 10000, { dur: 900, post: "+" }); s.show(s3.el, "left"); await countUp(s, s3.big, 500, { dur: 800 }); s.sfx.coin(); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 5b --------------------------------------------------------------- */
      {
        title: "Das Watt in echt",
        say: "So sieht das Wattenmeer in echt aus. Von oben siehst du die Priele wie Äste eines Baumes.",
        build(s) {
          const big = s.photo("watt-neuwerk", { w: 560, h: 470, caption: "Priele vor der Insel Neuwerk, von oben", pos: "40% 50%", kb: true });
          const f2 = s.photo("wattwurm-haeufchen", { w: 500, h: 215, caption: "Sand-Häufchen vom Wattwurm", cls: "later" });
          const f3 = s.photo("wattwanderung", { w: 500, h: 215, caption: "Wattwanderung bei Ebbe", cls: "later", pos: "50% 60%" });
          const btn = s.soundBtn("moewen", "Möwen am Watt");
          s.add(grid(s, "560px 1fr", s.h("div", { class: "stack", style: { gap: "14px" } }, big, p(s, "small", "Die Priele sehen von oben aus wie Äste eines Baumes.")),
            s.h("div", { class: "stack", style: { gap: "16px" } }, f2, f3, btn)));
          s.show(big, "fade"); s.sound("wind", { vol: .35, dur: 5 });
          s.step(async () => { s.sound("bubbles", { vol: .5 }); await s.show(f2, "zoom"); s.say("Jedes Häufchen hat ein Wattwurm nach oben gedrückt."); });
          s.step(async () => { s.sound("watt-schritte", { vol: .6 }); await s.show(f3, "zoom"); s.say("Bei einer Wattwanderung läufst du auf dem Meeresboden."); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Wer lebt im Watt?",
        say: "Im Watt leben viele Tiere. Drei Beispiele: der Wattwurm, der Seehund, und der Priel, in dem das Wasser fließt.",
        build(s) {
          // Wattwurm
          const v1 = svgBox(s, 300, 200);
          v1.append(s.el("rect", { x: 0, y: 0, width: 300, height: 60, fill: "#dff1fb" }), s.el("rect", { x: 0, y: 60, width: 300, height: 140, fill: WATT }));
          v1.append(s.el("path", { d: "M90,60 L90,160 Q90,185 150,185 Q210,185 210,160 L210,60", fill: "none", stroke: "#8e7752", "stroke-width": 22, "stroke-linecap": "round" }));
          const heap = s.el("path", { d: "M195,60 q8,-14 15,-6 q8,-10 15,0 q-4,9 -15,7 q-8,4 -15,-1", fill: "#7a6440", transform: "translate(0,0)" });
          const worm = s.el("path", { d: "M100,90 L100,160 Q100,175 130,175", fill: "none", stroke: "#c0504d", "stroke-width": 10, "stroke-linecap": "round" });
          v1.append(heap, worm, txt(s, 60, 46, "Trichter", { "font-size": 19 }), txt(s, 245, 40, "Häufchen", { "font-size": 19 }));
          // Seehund + Priel: echte Fotos
          const v2 = s.photo("seehunde-sandbank", { w: "100%", h: 190, pos: "50% 60%" });
          const v3 = s.photo("priel-hooge", { w: "100%", h: 190 });
          const card = (svg, name, text) => s.h("div", { class: "ex later stack", style: { gap: "14px", justifyContent: "center" } }, s.h("span", { class: "exlabel" }, name), svg, p(s, "t", ...text));
          const k1 = card(v1, "Wattwurm", ["20 bis 40 cm lang. Frisst Sand und verdaut das Kleine, das darin lebt. Alle 30 bis 40 Minuten drückt er ein ", B(s, "Sand-Häufchen"), " nach oben."]);
          const k2 = card(v2, "Seehund", ["Liegt bei Ebbe gern auf Sandbänken und ruht sich aus. Frisst Fische. Männchen werden etwa 1,70 m lang."]);
          const k3 = card(v3, "Priel", ["Ein ", B(s, "Bach im Watt"), ". Bei Flut füllt er sich mit Wasser – Wanderer können dann abgeschnitten werden."]);
          s.add(s.h("div", { class: "cols3", style: { alignItems: "stretch", height: "100%" } }, k1, k2, k3));
          s.sfx.pop();
          s.step(async () => { s.sfx.pop(); await s.show(k1, "up"); s.sfx.scribble(); await s.tween({ from: 0, to: 1, dur: 1400, update: v => { worm.setAttribute("transform", `translate(${v * 60},0)`); heap.setAttribute("transform", `translate(${210 * (1 - (0.6 + .4 * v))},${60 * (1 - (0.6 + .4 * v))}) scale(${0.6 + .4 * v})`); } }); });
          s.step(async () => { s.sound("splash", { vol: .45 }); await s.show(k2, "up"); });
          s.step(async () => { s.sound("water-pour", { vol: .5 }); await s.show(k3, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Wattwanderung – aber sicher!",
        say: "Eine Wattwanderung ist toll. Aber das Wasser kommt zurück. Darum gibt es Regeln.",
        build(s) {
          const W = 500, Hh = 400;
          const { canvas, g } = s.canvas(W, Hh);
          let fill = 0, wx = 360, wy = 120;
          const draw = () => {
            g.clearRect(0, 0, W, Hh);
            g.fillStyle = WATT; g.fillRect(0, 0, W, Hh);
            g.fillStyle = "#6fb6e3"; g.fillRect(0, 0, W, 40 + fill * 40);
            g.fillStyle = GREEN; g.fillRect(0, 340, W, 60);
            g.strokeStyle = "#6fb6e3"; g.lineCap = "round"; g.lineWidth = 12 + fill * 46;
            g.beginPath(); g.moveTo(0, 230); g.bezierCurveTo(140, 180, 260, 290, W, 220); g.stroke();
            const fig = (x, y, col) => { g.fillStyle = col; g.beginPath(); g.arc(x, y - 30, 8, 0, 7); g.fill(); g.strokeStyle = col; g.lineWidth = 4; g.beginPath(); g.moveTo(x, y - 22); g.lineTo(x, y); g.lineTo(x - 7, y + 14); g.moveTo(x, y); g.lineTo(x + 7, y + 14); g.moveTo(x - 10, y - 14); g.lineTo(x + 10, y - 14); g.stroke(); };
            fig(wx, wy, C); fig(wx + 26, wy + 4, "#1b2740");
            g.font = "700 20px Atkinson Hyperlegible, sans-serif"; g.fillStyle = "#1b2740";
            g.fillText("Deich und Land", 14, 378); g.fillText("Priel", 30, 205); g.fillText("Meer", 14, 28);
          };
          draw();
          const rules = [["Wattführer", "Weit hinaus nur mit einem Wattführer gehen."], ["Gezeiten", "Rechtzeitig zurück sein, bevor die Priele volllaufen."], ["Nebel", "Bei Nebel nicht losgehen – man verliert die Richtung."], ["Sonne", "Das nasse Watt spiegelt die Sonne: Sonnenschutz!"], ["Füße", "Muschelschalen sind scharf, das Wasser kann kalt sein."]];
          const items = rules.map(([k, t], i) => s.h("div", { class: "later", style: { display: "grid", gridTemplateColumns: "44px 1fr", gap: "12px", alignItems: "center" } }, s.h("span", { class: "chip", style: { justifyContent: "center", background: C, color: "#fff" } }, String(i + 1)), p(s, "small", B(s, k + ": "), t)));
          const btn = s.h("button", { class: "btn solid", onclick: () => run() }, "▶ Flut kommt – zurück!");
          let busy = false;
          const run = async () => { if (busy) return; busy = true; fill = 0; wx = 360; wy = 120; draw(); s.sound("waves", { vol: .4, dur: 3 }); s.sound("watt-schritte", { vol: .5, dur: 2.6 }); await s.tween({ from: 0, to: 1, dur: 2600, ease: "linear", update: v => { fill = v; wx = 360 - v * 200; wy = 120 + Math.min(1, v * 1.35) * 230; if (wy > 310) wy = 310; draw(); } }); s.sfx.success(); busy = false; };
          s.add(grid(s, "500px 1fr", s.h("div", { class: "stack", style: { alignItems: "center" } }, canvas, btn), s.h("div", { class: "stack", style: { gap: "14px" } }, p(s, "h2 a-up", "Fünf Watt-Regeln"), ...items)));
          s.show(canvas, "fade"); s.sfx.pop();
          rules.forEach((_, i) => s.step(async () => { s.sfx.count(i); await s.show(items[i], "left"); if (i === 1) run(); }));
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Sturmflut",
        say: "Wenn zur Flut ein starker Sturm vom Meer kommt, drückt er das Wasser gegen die Küste. Das ist eine Sturmflut.",
        build(s) {
          const W = 540, Hh = 340;
          const { canvas, g } = s.canvas(W, Hh);
          let storm = 0, ph = 0;
          const draw = () => {
            g.clearRect(0, 0, W, Hh);
            g.fillStyle = storm > 0.5 ? "#c9d3de" : "#dff1fb"; g.fillRect(0, 0, W, Hh);
            const lv = 220 - storm * 110;
            g.fillStyle = "#3b8fc9"; g.beginPath(); g.moveTo(0, Hh);
            for (let x = 0; x <= 400; x += 5) g.lineTo(x, lv + Math.sin(x / 18 + ph) * (4 + storm * 14));
            g.lineTo(400, Hh); g.closePath(); g.fill();
            g.fillStyle = "#7da35b"; g.beginPath(); g.moveTo(330, Hh); g.lineTo(430, 90); g.lineTo(460, 90); g.lineTo(500, Hh); g.closePath(); g.fill();
            g.fillStyle = "#93c56b"; g.fillRect(460, 300, 80, 40);
            g.setLineDash([8, 6]); g.strokeStyle = "#1d5bd0"; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 220); g.lineTo(390, 220); g.stroke(); g.setLineDash([]);
            g.font = "700 19px Atkinson Hyperlegible, sans-serif"; g.fillStyle = "#1d5bd0"; g.fillText("normales Hochwasser", 10, 250);
            g.strokeStyle = "#1b2740"; g.lineWidth = 4; g.lineCap = "round";
            const n = Math.round(storm * 5);
            for (let i = 0; i < n; i++) { const y = 30 + i * 22, x = 20 + ((ph * 40 + i * 70) % 260); g.beginPath(); g.moveTo(x, y); g.lineTo(x + 50, y); g.lineTo(x + 40, y - 8); g.moveTo(x + 50, y); g.lineTo(x + 40, y + 8); g.stroke(); }
          };
          draw();
          s.loop(tt => { ph = tt * (2 + storm * 4); draw(); });
          const sl = s.slider({ label: "Sturm vom Meer", min: 0, max: 10, value: 0, fmt: v => (v === 0 ? "kein Wind" : v < 5 ? "Wind" : v < 9 ? "Sturm" : "Orkan"), onInput: v => { storm = v / 10; if (v >= 9) s.sfx.whoosh(); } });
          const expl = p(s, "t", B(s, "Flut + Sturm vom Meer"), " = das Wasser steigt viel höher als sonst.");
          const big = s.h("span", { class: "big", style: { color: C } }, "0");
          const c62 = exc(s, "Hamburg, 16./17. Februar 1962", "later",
            s.photo("sturmflut-1962", { w: 480, h: 190, caption: "Wilhelmsburg unter Wasser, 1962" }),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "120px 1fr", gap: "12px", alignItems: "center" } }, big, p(s, "small", "Menschen starben. In der Nacht brachen viele Deiche. Fast ein Sechstel von Hamburg stand unter Wasser.")));
          const merk = s.h("div", { class: "merk later" }, "Nach 1962 wurden die Deiche ", B(s, "höher und stärker"), " gebaut.");
          s.add(grid(s, "540px 1fr", s.h("div", { class: "stack" }, canvas, sl), s.h("div", { class: "stack" }, expl, c62, merk)));
          s.show(canvas, "fade"); s.sfx.whoosh();
          s.step(async () => { s.say("Schieb den Regler: Je stärker der Sturm, desto höher das Wasser."); s.sound("wind", { vol: .5 }); await s.tween({ from: 0, to: 9, dur: 1600, update: v => sl.set(Math.round(v)) }); });
          s.step(async () => { s.sfx.drum(); await s.show(c62, "up"); await countUp(s, big, 315, { dur: 1100 }); s.say("Bei der Sturmflut 1962 starben in Hamburg 315 Menschen."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Der Deich schützt das Land",
        say: "Ein Deich ist ein langer Wall aus Erde. Er hält das Meer vom Land fern.",
        build(s) {
          const svg = svgBox(s, 1060, 360);
          svg.append(s.el("rect", { x: 0, y: 0, width: 1060, height: 360, fill: "#eef7fd", rx: 14 }));
          const sea = s.el("path", { d: "M0,230 L330,230 L330,360 L0,360 Z", fill: "#6fb6e3", opacity: .9 });
          const ground = s.el("rect", { x: 0, y: 290, width: 1060, height: 70, fill: "#a58a5c" });
          const klei = s.el("path", { d: "M300,290 L600,90 L640,90 L760,290 Z", fill: "#8a6a45", class: "later" });
          const core = s.el("path", { d: "M380,290 L608,128 L632,128 L722,290 Z", fill: SAND, class: "later" });
          const grass = s.el("path", { d: "M300,290 L600,90 L640,90 L760,290", fill: "none", stroke: "#5fae3c", "stroke-width": 9, "stroke-linejoin": "round", class: "later" });
          const house = s.el("g", { class: "later" }); house.append(s.el("rect", { x: 880, y: 240, width: 70, height: 50, fill: "#fff", stroke: "#1b2740", "stroke-width": 3 }), s.el("path", { d: "M870,242 L915,205 L960,242 Z", fill: C }), s.el("rect", { x: 905, y: 262, width: 18, height: 28, fill: "#8a6a45" }));
          const arrow = s.el("g", { class: "later" });
          arrow.append(s.el("path", { d: "M800,290 L800,92 M790,104 L800,90 L810,104 M790,278 L800,292 L810,278", fill: "none", stroke: C, "stroke-width": 4 }), txt(s, 815, 197, "8–9 m", { "text-anchor": "start", fill: C, "font-size": 24 }));
          const hwLine = s.el("path", { d: "M0,230 L330,230", stroke: "#1d5bd0", "stroke-width": 2.5, "stroke-dasharray": "8 6" });
          const sfLine = s.el("path", { d: "M0,130 L460,130", stroke: C, "stroke-width": 2.5, "stroke-dasharray": "8 6", class: "later" });
          const lbls = [txt(s, 150, 40, "Meer", { fill: "#1d5bd0" }), txt(s, 410, 40, "Seeseite: flach", { class: "later" }), txt(s, 620, 40, "Krone", { class: "later" }), txt(s, 790, 40, "Landseite: steil", { class: "later" }), txt(s, 960, 40, "Land")];
          const hwT = txt(s, 14, 222, "normales Hochwasser", { "text-anchor": "start", "font-size": 19, fill: "#1d5bd0" });
          const sfT = txt(s, 14, 122, "Sturmflut", { "text-anchor": "start", "font-size": 19, fill: C, class: "later" });
          svg.append(sea, ground, klei, core, grass, house, arrow, hwLine, sfLine, hwT, sfT, ...lbls);
          const sw = (col, t) => s.h("span", { class: "row later", style: { gap: "8px", flexWrap: "nowrap" } }, s.h("span", { style: { width: "26px", height: "26px", borderRadius: "6px", background: col, display: "inline-block" } }), s.h("span", { class: "small" }, t));
          const legend = [sw(SAND, "Sandkern"), sw("#8a6a45", "Kleidecke (fester Lehm)"), sw("#5fae3c", "Gras hält die Erde fest")];
          let up = false;
          const btn = s.h("button", { class: "btn solid later", onclick: async () => { up = !up; s.sfx.whoosh(); btn.textContent = up ? "Wasser sinkt" : "Sturmflut!"; await s.tween({ from: up ? 230 : 130, to: up ? 130 : 230, dur: 1500, update: v => sea.setAttribute("d", `M0,${v} L${330 + (230 - v) * 1.5},${v} L${330 + (230 - v) * 1.5},360 L0,360 Z`) }); if (up) s.sfx.drum(); } }, "Sturmflut!");
          const merk = s.h("div", { class: "merk later" }, "Die ", B(s, "flache Seeseite"), " lässt die Wellen sanft auslaufen. So bricht der Deich nicht.");
          const sheep = s.photo("deich-schafe", { w: 400, h: 172, caption: "Schafe halten das Deichgras kurz", cls: "later", pos: "50% 70%" });
          s.add(s.h("div", { class: "stack", style: { gap: "12px" } }, svg, s.h("div", { class: "row", style: { justifyContent: "space-between" } }, ...legend, btn),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 400px", gap: "20px", alignItems: "center" } }, merk, sheep)));
          s.show(svg, "fade"); s.sfx.whoosh();
          s.step(async () => { s.sfx.pop(); s.show(core, "fade"); await s.show(legend[0], "pop"); s.sfx.pop(); s.show(klei, "fade"); await s.show(legend[1], "pop"); s.sfx.scribble(); s.show(grass, "draw"); await s.show(legend[2], "pop"); });
          s.step(async () => { s.sfx.pop(); await s.show([lbls[1], lbls[2], lbls[3]], "pop"); s.sfx.count(4); s.show(arrow, "zoom"); await s.show(house, "bounce"); });
          s.step(async () => { s.show(sfLine, "draw"); s.show(sfT, "fade"); await s.show(btn, "pop"); if (!s.fast) btn.click(); s.say("Bei einer Sturmflut steigt das Wasser hoch. Der Deich hält es auf."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sound("schaf", { vol: .6 }); await s.show(sheep, "zoom"); s.say("Schafe fressen das Gras auf dem Deich kurz und treten den Boden fest. So bleibt der Deich stark."); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Halligen und Warften",
        say: "Halligen sind kleine Inseln ohne hohen Deich. Die Häuser stehen auf künstlichen Hügeln, den Warften.",
        build(s) {
          const svg = svgBox(s, 580, 380);
          svg.append(s.el("rect", { x: 0, y: 0, width: 580, height: 380, fill: "#dff1fb", rx: 14 }));
          svg.append(s.el("path", { d: "M0,300 L60,300 L80,270 L500,270 L520,300 L580,300 L580,380 L0,380 Z", fill: GREEN }));
          svg.append(s.el("path", { d: "M200,270 Q215,195 290,192 Q365,195 380,270 Z", fill: "#7da35b" }));
          const houses = s.el("g", { class: "later" });
          [[240, 196], [300, 192]].forEach(([x, y]) => houses.append(s.el("rect", { x: x - 24, y: y - 30, width: 48, height: 30, fill: "#fff", stroke: "#1b2740", "stroke-width": 3 }), s.el("path", { d: `M${x - 30},${y - 28} L${x},${y - 54} L${x + 30},${y - 28} Z`, fill: "#a5452a" })));
          svg.append(houses);
          const water = s.el("path", { d: "M0,300 L580,300 L580,380 L0,380 Z", fill: "#3b8fc9", opacity: .75 });
          svg.append(water);
          const l1 = tag(s, 290, 110, "Warft (künstlicher Hügel)"), l2 = tag(s, 120, 250, "Hallig-Wiese"), l3 = tag(s, 100, 190, "Land unter!", { fill: C });
          svg.append(l1, l2, l3);
          const lv = v => water.setAttribute("d", `M0,${v} L580,${v} L580,380 L0,380 Z`);
          const items = [["10", "Halligen gibt es heute in Deutschland, im Wattenmeer von Nordfriesland."], ["1 m", "So hoch ragen sie nur über das normale Hochwasser."], ["mehrmals", "im Jahr werden die meisten Halligen überflutet: Land unter!"]].map(([n, t]) => s.h("div", { class: "later", style: { display: "grid", gridTemplateColumns: "150px 1fr", gap: "12px", alignItems: "center" } }, s.h("span", { class: "h2", style: { color: C } }, n), p(s, "small", t)));
          const lf = lifeBox(s, "later", s.photo("warft-hooge", { w: 440, h: 190, caption: "Backenswarft auf Hallig Hooge" }), p(s, "small", "Bei Land unter schauen nur die Warften aus dem Meer."));
          s.add(grid(s, "580px 1fr", svg, s.h("div", { class: "stack" }, ...items, lf)));
          s.show(svg, "fade"); s.sfx.whoosh();
          s.step(async () => { s.sfx.pop(); s.show(houses, "bounce"); s.show(l1, "pop"); await s.show(items[0], "left"); });
          s.step(async () => { s.sfx.pop(); s.show(l2, "pop"); await s.show(items[1], "left"); });
          s.step(async () => { s.sound("waves", { vol: .45, dur: 5 }); await s.tween({ from: 300, to: 238, dur: 1600, update: lv }); s.sfx.boing(); s.show(l3, "pop"); await s.show(items[2], "left"); s.say("Land unter! Nur die Warften bleiben trocken."); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Ostsee: Steilküste und Flachküste",
        say: "An der Ostsee gibt es zwei Arten von Küste: steile Kliffs und flache Sandstrände.",
        build(s) {
          const mkPanel = () => svgBox(s, 520, 230);
          const a = mkPanel(), b = mkPanel();
          a.append(s.el("rect", { x: 0, y: 0, width: 520, height: 230, fill: "#dff1fb", rx: 12 }));
          const cliff = s.el("path", { d: "M260,40 L520,40 L520,230 L240,230 L250,180 L240,120 Z", fill: "#e9e4d6", stroke: "#9b978a", "stroke-width": 3 });
          const chunk = s.el("path", { d: "M240,120 L262,112 L268,150 L246,156 Z", fill: "#e9e4d6", stroke: "#9b978a", "stroke-width": 3 });
          a.append(s.el("path", { d: "M260,40 L520,40 L520,24 L270,24 Z", fill: "#7da35b" }), cliff, chunk, s.el("rect", { x: 0, y: 180, width: 245, height: 50, fill: "#3b8fc9" }));
          const wa = s.el("path", { d: "M150,180 q20,-26 40,0", fill: "none", stroke: "#fff", "stroke-width": 5 }); a.append(wa);
          b.append(s.el("rect", { x: 0, y: 0, width: 520, height: 230, fill: "#dff1fb", rx: 12 }));
          b.append(s.el("path", { d: "M0,190 L520,120 L520,230 L0,230 Z", fill: SAND }), s.el("path", { d: "M400,136 Q440,90 480,128 L520,120 L520,140 Z", fill: "#93c56b" }), s.el("rect", { x: 0, y: 185, width: 200, height: 45, fill: "#3b8fc9" }));
          const sk = strandkorb(s, 330, 158, 0.9); sk.classList.add("later"); b.append(sk);
          const wb = s.el("path", { d: "M80,186 q20,-16 40,0", fill: "none", stroke: "#fff", "stroke-width": 5 }); b.append(wb);
          const capA = exc(s, "Steilküste (Kliff)", "", p(s, "small", "Die Brandung nagt am Ufer. Stücke brechen ab – das Kliff wandert ins Land."));
          const capB = exc(s, "Flachküste", "later", p(s, "small", "Das Land steigt langsam an. Hier liegt feiner Sand: ideal zum Baden."));
          const kre = svgBox(s, 500, 163, 520, 170);
          const barK = s.el("rect", { x: 170, y: 22, width: 0, height: 46, fill: "#e9e4d6", stroke: "#9b978a", "stroke-width": 2, rx: 6 });
          const barF = s.el("rect", { x: 170, y: 100, width: 0, height: 46, fill: "#c4c9d3", stroke: "#5d6678", "stroke-width": 2, rx: 6 });
          const tK = txt(s, 180, 54, "", { "text-anchor": "start", "font-size": 22 }), tF = txt(s, 492, 132, "", { "text-anchor": "end", "font-size": 22, fill: "#fff" });
          kre.append(txt(s, 160, 52, "Königsstuhl", { "text-anchor": "end", "font-size": 20 }), txt(s, 160, 130, "Fernsehturm", { "text-anchor": "end", "font-size": 20 }), barK, barF, tK, tF);
          const kBox = exc(s, "Kreidefelsen auf Rügen", "later", kre, p(s, "small", "Der weiße Königsstuhl im Nationalpark Jasmund ist 118 m hoch – ein Drittel vom Berliner Fernsehturm."));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "520px minmax(0,1fr)", gap: "26px", height: "100%", alignItems: "center" } },
            s.h("div", { class: "stack", style: { gap: "10px" } }, a, b),
            s.h("div", { class: "stack" }, capA, capB, kBox)));
          s.show(a, "fade"); s.sound("waves", { vol: .4, dur: 4 });
          const waves = s.loop(tt => { wa.setAttribute("transform", `translate(${(tt * 60) % 80},0)`); wb.setAttribute("transform", `translate(${(tt * 40) % 70},0)`); });
          s.step(async () => { s.sound("steine-fallen", { vol: .6 }); await s.tween({ from: 0, to: 1, dur: 900, ease: "in", update: v => chunk.setAttribute("transform", `translate(${-v * 18},${v * 70}) rotate(${v * 40} 255 135)`) }); s.sound("splash", { vol: .4 }); s.say("Plumps! Das Kliff wird jedes Jahr ein bisschen kleiner."); });
          s.step(async () => { s.sfx.pop(); s.show(b, "fade"); s.show(capB, "left"); await s.show(sk, "bounce"); });
          s.step(async () => { s.sfx.pop(); await s.show(kBox, "up"); s.sfx.whoosh(); await s.tween({ from: 0, to: 1, dur: 1200, update: v => { barK.setAttribute("width", 118 * 0.9 * v); barF.setAttribute("width", 368 * 0.9 * v); tK.setAttribute("x", 178 + 118 * 0.9 * v); tK.textContent = Math.round(118 * v) + " m"; tF.textContent = Math.round(368 * v) + " m"; } }); s.sfx.coin(); });
          void waves;
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Bodden und Badeorte",
        say: "An der Ostsee gibt es Bodden: flache Buchten hinter langen Halbinseln. Und viele Badeorte mit Strandkörben.",
        build(s) {
          const svg = svgBox(s, 520, 440);
          svg.append(s.el("rect", { x: 0, y: 0, width: 520, height: 440, fill: "#3b8fc9", rx: 14 }));
          svg.append(s.el("path", { d: "M0,300 L520,300 L520,440 L0,440 Z", fill: GREEN }));
          const bodden = s.el("path", { d: "M66,300 C66,250 90,215 145,205 C230,190 300,220 370,214 C410,212 440,206 470,212 L470,300 Z", fill: "#9fdbe0", class: "later" });
          const pen = s.el("path", { d: "M40,305 C40,250 70,200 140,185 C230,165 300,200 370,195 C420,190 460,180 500,200 L496,214 C450,200 420,212 370,214 C300,220 230,190 145,205 C90,215 66,250 66,305 Z", fill: SAND, stroke: "#b8893a", "stroke-width": 2, class: "later" });
          svg.append(bodden, pen);
          const l1 = tag(s, 260, 70, "Ostsee: offenes Meer", { later: false });
          const l2 = tag(s, 280, 160, "Halbinsel Fischland-Darß-Zingst");
          const l3 = tag(s, 270, 262, "Bodden: flach, weniger salzig", { fill: "#0f6f74" });
          const l4 = tag(s, 260, 380, "Festland");
          svg.append(l1, l2, l3, l4);
          const c1 = exc(s, "Bodden", "later", p(s, "small", "Flache Bucht hinter einer Halbinsel. Flüsse bringen Süßwasser, darum ist das Wasser weniger salzig. Hier leben Hecht, Barsch und Aal."));
          const c2 = exc(s, "Badeorte", "later", p(s, "small", "In Warnemünde bei Rostock baute der Korbmacher Wilhelm Bartelmann 1882 den ersten Strandkorb. Ab 1883 konnte man ihn mieten."));
          const c3 = lifeBox(s, "later", p(s, "small", "An der Ostsee steigt das Wasser nur etwa 30 cm. Dein Strandkorb darf hier nah am Wasser stehen."));
          s.add(grid(s, "520px 1fr", svg, s.h("div", { class: "stack" }, c1, c2, c3)));
          s.show(svg, "fade"); s.sfx.whoosh();
          s.step(async () => { s.sfx.pop(); s.show(pen, "zoom"); await s.show(l2, "pop"); });
          s.step(async () => { s.sound("birds", { vol: .4, dur: 5 }); s.show(bodden, "fade"); s.show(l3, "pop"); s.show(l4, "pop"); await s.show(c1, "left"); });
          s.step(async () => { s.sfx.coin(); await s.show(c2, "left"); });
          s.step(async () => { s.sfx.ding(); await s.show(c3, "up"); });
        },
      },
      /* 12b -------------------------------------------------------------- */
      {
        title: "Die Ostseeküste in echt",
        say: "So sieht die Ostseeküste in echt aus: weiße Kreidefelsen, Strandkörbe und stille Bodden.",
        build(s) {
          const f1 = s.photo("koenigsstuhl", { w: 600, h: 470, caption: "Kreidefelsen auf Rügen: rechts der Königsstuhl", pos: "70% 50%", kb: true });
          const f2 = s.photo("strandkoerbe-warnemuende", { w: 474, h: 222, caption: "Strandkörbe in Warnemünde", cls: "later", pos: "50% 65%" });
          const f3 = s.photo("bodden", { w: 474, h: 222, caption: "Bodden auf dem Darß: Schilf, flaches Wasser", cls: "later" });
          s.add(grid(s, "600px 1fr", s.h("div", { class: "stack", style: { gap: "12px" } }, f1, p(s, "small", "Steilküste: Die Brandung nagt an der weißen Kreide.")),
            s.h("div", { class: "stack", style: { gap: "18px" } }, f2, f3)));
          s.show(f1, "fade"); s.sound("waves", { vol: .4, dur: 6 });
          s.step(async () => { s.sound("strand-moewen", { vol: .45, dur: 5 }); await s.show(f2, "zoom"); s.say("Flachküste mit feinem Sand – und Strandkörben."); });
          s.step(async () => { s.sound("birds", { vol: .4, dur: 5 }); await s.show(f3, "zoom"); s.say("Im Bodden ist das Wasser flach und ruhig."); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Hamburg: Hafen zur Welt",
        say: "Hamburg hat den größten Seehafen Deutschlands. Die Schiffe fahren etwa 100 Kilometer die Elbe hinauf.",
        build(s) {
          const svg = svgBox(s, 1060, 200);
          svg.append(s.el("rect", { x: 0, y: 0, width: 1060, height: 200, fill: GREEN, rx: 14 }));
          svg.append(s.el("path", { d: "M0,40 L140,40 C300,60 420,90 600,96 C760,102 900,110 1000,118 L1000,138 C900,134 760,128 600,124 C420,120 300,120 140,160 L0,160 Z", fill: "#6fb6e3" }));
          svg.append(txt(s, 70, 110, "Nordsee", { fill: "#fff", "font-size": 22 }), s.el("circle", { cx: 1000, cy: 128, r: 12, fill: C, stroke: "#fff", "stroke-width": 3 }), txt(s, 1000, 178, "Hamburg"), s.el("circle", { cx: 160, cy: 100, r: 8, fill: "#1b2740" }), txt(s, 200, 30, "Cuxhaven", { "font-size": 19 }), txt(s, 580, 70, "Elbe – rund 100 km", { fill: "#1d5bd0" }));
          const sh = ship(s, 170, 112, 0.55); svg.append(sh);
          const cmp = svgBox(s, 500, 210);
          const sBar = s.el("rect", { x: 0, y: 40, width: 0, height: 40, rx: 6, fill: "#27324d" });
          const tBar = s.el("rect", { x: 0, y: 140, width: 0, height: 40, rx: 6, fill: "#9aa3b2" });
          const sT = txt(s, 10, 30, "Containerschiff: fast 400 m", { "text-anchor": "start", class: "later" }), tT = txt(s, 10, 130, "Fernsehturm (gelegt): 368 m", { "text-anchor": "start", class: "later" });
          cmp.append(sBar, tBar, sT, tT);
          const cmpBox = exc(s, "So groß sind die Riesen", "later", cmp, p(s, "small", "Die größten Containerschiffe, z. B. die „MSC Irina“, sind fast 400 m lang und rund 61 m breit."));
          const big = s.h("span", { class: "big", style: { color: C } }, "0");
          const facts = exc(s, "Hamburger Hafen", "later", s.h("div", { class: "row", style: { gap: "12px", flexWrap: "nowrap" } }, big, p(s, "small", "Millionen Standard-Container im Jahr 2024")),
            p(s, "small", "Größter Seehafen Deutschlands. In Europa liegen nur Rotterdam und Antwerpen vorn."));
          const lf = lifeBox(s, "later", s.h("div", { style: { display: "grid", gridTemplateColumns: "250px 1fr", gap: "14px", alignItems: "center" } },
            s.photo("containerschiff-hamburg", { w: 250, h: 170 }), p(s, "small", "Bananen, Turnschuhe, Spielkonsolen: Vieles in Berliner Läden kam im Container über einen Hafen.")));
          s.add(s.h("div", { class: "stack", style: { gap: "16px" } }, svg, s.h("div", { style: { display: "grid", gridTemplateColumns: "540px 1fr", gap: "22px" } }, cmpBox, s.h("div", { class: "stack" }, facts, lf))));
          s.show(svg, "fade"); s.sfx.whoosh();
          s.step(async () => { s.sfx.whoosh(); await s.tween({ from: 0, to: 1, dur: 2200, update: v => { const x = 170 + v * 790, y = 112 + v * 8; sh.setAttribute("transform", `translate(${x},${y}) scale(0.55)`); } }); s.sound("schiffshorn", { vol: .5 }); });
          s.step(async () => { s.sfx.pop(); await s.show(cmpBox, "up"); s.show([sT, tT], "fade"); s.sfx.whoosh(); await s.tween({ from: 0, to: 1, dur: 1200, update: v => { sBar.setAttribute("width", 480 * v); tBar.setAttribute("width", 480 * 368 / 400 * v); } }); s.sfx.coin(); s.say("Ein Containerschiff ist länger, als der Fernsehturm hoch ist!"); });
          s.step(async () => { s.sfx.pop(); await s.show(facts, "left"); await countUp(s, big, 7.8, { dec: 1, dur: 1000 }); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Fischbrötchen und Windräder",
        say: "Vom Meer kommen Fisch und Strom. Wir verfolgen ein Fischbrötchen und besuchen einen Windpark im Meer.",
        build(s) {
          const chain = [["Fischkutter", "fängt Hering im Meer"], ["Hafen", "Fisch wird an Land gebracht und verarbeitet"], ["Einlegen", "zum Beispiel als Bismarckhering oder Matjes"], ["Imbiss", "Fisch ins Brötchen, dazu Zwiebeln"]];
          const nodes = chain.map(([t, d], i) => s.h("div", { class: "card later", style: { display: "grid", gridTemplateColumns: "44px 1fr", gap: "12px", alignItems: "center", padding: "6px 14px" } }, s.h("span", { class: "chip", style: { justifyContent: "center", background: C, color: "#fff" } }, String(i + 1)), s.h("div", null, s.h("b", { class: "t" }, t + " "), s.h("span", { class: "small" }, d))));
          const ph1 = s.photo("fischkutter", { w: 290, h: 215, caption: "Fischkutter in Wismar", cls: "later" });
          const ph2 = s.photo("fischbroetchen", { w: 290, h: 215, caption: "Fischbrötchen", cls: "later" });
          const left = s.h("div", { class: "stack", style: { gap: "10px" } }, p(s, "h2 a-up", "Weg eines Fischbrötchens"), ...nodes, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "16px" } }, ph1, ph2));
          const park = s.photo("windpark-alpha-ventus", { w: 470, h: 300, caption: "Windpark alpha ventus", kb: true });
          const wind = exc(s, "Windpark im Meer", "later", p(s, "small", "„Alpha ventus“ war 2010 der erste deutsche Windpark auf hoher See: 12 Windräder, etwa 45 km vor Borkum. Draußen weht der Wind stark und oft."));
          const right = s.h("div", { class: "stack", style: { alignItems: "center" } }, park, wind);
          s.add(grid(s, "1fr 470px", left, right));
          s.show(park, "fade"); s.sfx.pop();
          s.step(async () => { s.sound("moewen", { vol: .45 }); for (let i = 0; i < nodes.length; i++) { s.sfx.count(i * 2); await s.show(nodes[i], "left"); if (i === 0) s.show(ph1, "zoom"); } await s.show(ph2, "zoom"); s.sfx.success(); });
          s.step(async () => { s.sound("wind", { vol: .45, dur: 5 }); await s.show(wind, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Im Alltag: Urlaub an der Küste",
        say: "Was du im Urlaub an der Küste erleben kannst. Vier Beispiele.",
        build(s) {
          const card = (lbl, id, text) => s.h("div", { class: "life later", style: { display: "grid", gridTemplateColumns: "200px 1fr", gap: "14px", alignItems: "center" } }, s.photo(id, { w: 200, h: 150 }), s.h("div", null, s.h("span", { class: "exlabel" }, lbl), p(s, "small", text)));
          const cs = [card("Fähre auf eine Insel", "faehre-dageboell", "Von Dagebüll nach Föhr: rund 50 Minuten. Eine Fähre nimmt etwa 75 Autos mit."),
            card("Wattwanderung", "wattwanderung", "Nur mit Wattführer und mit Blick auf die Gezeiten. Bei Ebbe los, vor der Flut zurück!"),
            card("Strandkorb", "strandkoerbe-warnemuende", "Nordsee: weit oben aufstellen. Ostsee: Das Wasser steigt kaum, du kannst nah ran."),
            card("Kreidefelsen", "skywalk-koenigsstuhl", "Seit 2023 führt ein Rundweg über dem Königsstuhl auf Rügen – 118 m über der Ostsee.")];
          const snd = ["schiffshorn", "watt-schritte", "strand-moewen", "wind"]; s.preload(...snd);
          const merk = s.h("div", { class: "merk later" }, "Nordsee: Ebbe und Flut, Watt, Deiche. Ostsee: kaum Gezeiten, Kliffs, Bodden. Beide: Häfen, Fischerei, Urlaub.");
          s.add(s.h("div", { class: "stack", style: { height: "100%" } }, p(s, "h2 a-up", "Ab an die Küste!"),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", flex: 1 } }, ...cs), merk));
          s.sfx.whoosh();
          cs.forEach((c, i) => s.step(async () => { s.sound(snd[i], { vol: .45, dur: 4 }); await s.show(c, i % 2 ? "right" : "left"); }));
          s.step(async () => { s.sfx.success(); await s.show(merk, "up"); s.confetti(590, 400, 80); });
        },
      },
    ],
  });
})();
