/* Kapitel 8 – Sehr groß und sehr klein (RLP NaWi 5/6, Themenfeld 3.3/3.4 „Sehr groß – sehr klein“).
   Alle Zahlen geprüft (Quellen im Bericht): Wikipedia, NASA, BZgA, Schulmaterial (schule-bw.de) u. a. */
(() => {
  const TAU = Math.PI * 2;

  /* ---------- helpers ---------- */
  const life = (s, label, ...kids) => s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, label), ...kids);
  const exb = (s, label, ...kids) => s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, label), ...kids);
  const de = (n, d = 0) => Number(n).toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: d });
  function fmtLen(m) {
    if (m >= 1e15) return de(m / 1e15, 1) + " Billionen km";
    if (m >= 1e12) return de(m / 1e12, 1) + " Milliarden km";
    if (m >= 1e9) return de(m / 1e9, 1) + " Mio. km";
    if (m >= 1000) return de(m / 1000, 1) + " km";
    if (m >= 1) return de(m, 1) + " m";
    if (m >= 0.01) return de(m * 100, 1) + " cm";
    if (m >= 0.001) return de(m * 1000, 1) + " mm";
    return de(m * 1e6, 1) + " µm";
  }
  /** continuous powers-of-ten zoom with a camera that glides from one object to the next (nested positions).
      stages = [{size (m), at: [x, y] view centre (m), name, info, draw(g, X, Y, sc, vw)}] – biggest first or last */
  function zoomer(s, W, H, stages, dark, extra = []) {
    const { canvas, g } = s.canvas(W, H);
    const lv = stages.map(st => Math.log10(st.size * 1.6));
    let lw = lv[0], cur = stages[0];
    const camera = () => {
      // find segment i with lw between lv[i] and lv[i+1]
      let i = 0;
      while (i < stages.length - 2 && (lv[i + 1] - lw) * (lv[i + 1] - lv[i]) < 0) i++;
      const a = stages[i], b = stages[i + 1];
      const V = Math.pow(10, lw), V0 = Math.pow(10, lv[i]), V1 = Math.pow(10, lv[i + 1]);
      const tl = (lw - lv[i]) / (lv[i + 1] - lv[i]);
      cur = tl < 0.5 ? a : b;
      // keep the smaller object near the centre: offset grows with the view
      const [S, B, Vs, Vb] = V1 < V0 ? [b, a, V1, V0] : [a, b, V0, V1];
      const f = Math.max(0, Math.min(1, (V - Vs) / (Vb - Vs)));
      return [S.at[0] + (B.at[0] - S.at[0]) * f, S.at[1] + (B.at[1] - S.at[1]) * f];
    };
    const draw = () => {
      const vw = Math.pow(10, lw), sc = W / vw;
      const [cx, cy] = camera();
      const night = dark || lw > 7.3;
      g.fillStyle = night ? "#0e1633" : "#f6f8fb"; g.fillRect(0, 0, W, H);
      if (night) { let r = 5; for (let i = 0; i < 90; i++) { r = (r * 9301 + 49297) % 233280; const x = r / 233280 * W; r = (r * 9301 + 49297) % 233280; const y = r / 233280 * H; g.fillStyle = `rgba(255,255,255,${0.2 + (i % 5) * 0.12})`; g.fillRect(x, y, 1.6, 1.6); } }
      const X = m => W / 2 + (m - cx) * sc, Y = m => H / 2 + (m - cy) * sc;
      for (const st of [...extra, ...stages]) { const px = st.size * sc; if (px < 1.5 || (st.maxPx && px > st.maxPx)) continue; g.save(); st.draw(g, X, Y, sc, vw); g.restore(); }
      // scale bar
      const target = vw * 0.22, p10 = Math.pow(10, Math.floor(Math.log10(target)));
      const L = [1, 2, 5].map(k => k * p10).filter(x => x <= target).pop() || p10;
      const px = L * sc, yb = H - 26;
      g.fillStyle = night ? "rgba(14,22,51,.8)" : "rgba(255,255,255,.88)"; g.fillRect(10, yb - 30, Math.max(px, 130) + 20, 44);
      g.strokeStyle = night ? "#fff" : "#1b2740"; g.lineWidth = 4; g.beginPath(); g.moveTo(20, yb); g.lineTo(20 + px, yb); g.stroke();
      g.fillStyle = g.strokeStyle; g.font = "700 19px 'Atkinson Hyperlegible'"; g.textAlign = "left"; g.fillText(fmtLen(L), 20, yb - 10);
    };
    draw();
    return { canvas, lo: lv[0], hi: lv[lv.length - 1], set(v) { lw = v; draw(); }, get lw() { return lw; }, get cur() { return cur; } };
  }
  function tag(g, text, x, y, col = "#1b2740") { g.font = "700 19px 'Atkinson Hyperlegible'"; g.textAlign = "center"; g.lineWidth = 5; g.strokeStyle = col === "#1b2740" ? "rgba(255,255,255,.85)" : "rgba(14,22,51,.85)"; g.strokeText(text, x, y); g.fillStyle = col; g.fillText(text, x, y); }
  const showTag = (sc, size, W = 620) => size * sc > 0.12 * W && size * sc < 2.5 * W;

  /* ---- zoom in: Berlin → Fernsehturm → Kind → Ameise → Haar + Zelle → Bakterie (all on the ground next to the tower) ---- */
  const BERLIN = [[-.5, .05], [-.42, -.2], [-.3, -.28], [-.12, -.5], [.05, -.42], [.2, -.47], [.3, -.3], [.47, -.18], [.5, .1], [.38, .3], [.25, .48], [.05, .4], [-.15, .5], [-.3, .35], [-.45, .3]];
  const HAIR_X = 40.3045, CELL_X = HAIR_X + 0.00045;
  const stBerlin = {
    size: 45000, at: [0, 0], name: "Berlin", info: "Berlin: etwa 45 km breit, 891 km² groß",
    draw(g, X, Y, sc, vw) {
      if (vw < 3000) return;
      g.fillStyle = "#cfe3c0"; g.strokeStyle = "#6c8f5a"; g.lineWidth = 3; g.beginPath();
      BERLIN.forEach(([x, y], i) => { const px = X(x * 45000), py = Y(y * 38800); i ? g.lineTo(px, py) : g.moveTo(px, py); }); g.closePath(); g.fill(); g.stroke();
      g.strokeStyle = "#4b8fd8"; g.lineWidth = 5; g.beginPath(); g.moveTo(X(-20000), Y(-2000)); g.bezierCurveTo(X(-8000), Y(3000), X(-3000), Y(-3000), X(0), Y(500)); g.bezierCurveTo(X(6000), Y(5000), X(12000), Y(4000), X(21000), Y(9000)); g.stroke();
      g.fillStyle = "#dc3b2a"; g.beginPath(); g.arc(X(0), Y(0), 6, 0, TAU); g.fill();
      if (vw > 20000) tag(g, "Fernsehturm", X(0), Y(0) - 14);
    },
  };
  const ground = {
    size: 4000, at: [0, 0], draw(g, X, Y, sc, vw) {
      if (vw > 3000) return;
      const y0 = Math.max(0, Math.min(1e4, Y(0)));
      g.fillStyle = "#8cbf6f"; g.fillRect(0, y0, 2000, 2000);
      if (vw < 0.01) { g.fillStyle = "#a07a4a"; g.fillRect(0, y0, 2000, 2000); }
    },
  };
  const stTower = {
    size: 368, at: [0, -184], name: "Fernsehturm", info: "Fernsehturm: 368 m hoch",
    draw(g, X, Y, sc) {
      g.fillStyle = "#5d6678";
      g.fillRect(X(-9), Y(-244), 18 * sc, 244 * sc);
      g.beginPath(); g.moveTo(X(-16), Y(0)); g.lineTo(X(-9), Y(-64)); g.lineTo(X(9), Y(-64)); g.lineTo(X(16), Y(0)); g.fill();
      g.fillStyle = "#8a93a6"; g.beginPath(); g.arc(X(0), Y(-207), 16 * sc, 0, TAU); g.fill();
      g.fillStyle = "#5d6678"; g.fillRect(X(-2.5), Y(-368), 5 * sc, 130 * sc);
      g.fillStyle = "#dc3b2a"; g.fillRect(X(-2.5), Y(-368), 5 * sc, 10 * sc);
    },
  };
  const stChild = {
    size: 1.4, at: [40, -0.75], name: "Kind", info: "Kind: etwa 1,4 m groß – neben dem Fernsehturm",
    draw(g, X, Y, sc) {
      const x0 = 40;
      g.strokeStyle = "#1d5bd0"; g.lineCap = "round"; g.lineWidth = Math.max(1, 0.12 * sc);
      g.beginPath(); g.moveTo(X(x0), Y(-1.12)); g.lineTo(X(x0), Y(-0.5)); g.lineTo(X(x0 - 0.16), Y(0)); g.moveTo(X(x0), Y(-0.5)); g.lineTo(X(x0 + 0.16), Y(0));
      g.moveTo(X(x0), Y(-1.0)); g.lineTo(X(x0 - 0.3), Y(-0.62)); g.moveTo(X(x0), Y(-1.0)); g.lineTo(X(x0 + 0.3), Y(-0.62)); g.stroke();
      g.fillStyle = "#f2c9a0"; g.beginPath(); g.arc(X(x0), Y(-1.27), 0.13 * sc, 0, TAU); g.fill();
    },
  };
  const stAnt = {
    size: 0.006, at: [40.3, -0.0015], name: "Ameise", info: "Waldameise: etwa 4–9 mm lang",
    draw(g, X, Y, sc) {
      const m = 0.001, x0 = 40.3, y0 = -0.0013;
      g.strokeStyle = "#5a1f0a"; g.lineWidth = Math.max(1, 0.12 * m * sc); g.lineCap = "round";
      [-0.7, -0.4, -0.1].forEach((x, i) => { [-1, 1].forEach(d => { g.beginPath(); g.moveTo(X(x0 + x * m), Y(y0)); g.lineTo(X(x0 + (x + (i - 1) * 0.5 + d * 0.35) * m), Y(y0 - 0.15 * m)); g.lineTo(X(x0 + (x + (i - 1) * 1.1 + d * 0.6) * m), Y(0)); g.stroke(); }); });
      g.fillStyle = "#7a2e12";
      [[-1.7, 0, .8, .6], [-0.4, 0, .7, .4], [1.3, -0.1, 1.2, .75]].forEach(([x, y, rx, ry]) => { g.beginPath(); g.ellipse(X(x0 + x * m), Y(y0 + y * m), rx * m * sc, ry * m * sc, 0, 0, TAU); g.fill(); });
      [-1, 1].forEach(d => { g.beginPath(); g.moveTo(X(x0 - 2.2 * m), Y(y0 - 0.2 * m)); g.lineTo(X(x0 - 2.7 * m), Y(y0 - (0.9 + d * 0.3) * m)); g.stroke(); });
    },
  };
  const stHair = {
    size: 0.00015, at: [HAIR_X + 0.00038, -0.00005], name: "Haar und Zelle", info: "Haar: etwa 0,07 mm = 70 µm dick. Die Zelle daneben: etwa 20 µm",
    draw(g, X, Y, sc) {
      const u = 1e-6;
      g.fillStyle = "#b07a45"; g.fillRect(X(HAIR_X - 400 * u), Y(-70 * u), 800 * u * sc, 70 * u * sc);
      g.strokeStyle = "rgba(90,50,20,.5)"; g.lineWidth = Math.max(1, Math.min(4, 2 * u * sc));
      for (let x = -390; x < 400; x += 18) { g.beginPath(); g.moveTo(X(HAIR_X + x * u), Y(-70 * u)); g.lineTo(X(HAIR_X + (x + 9) * u), Y(0)); g.stroke(); }
      g.fillStyle = "#f6d6e0"; g.strokeStyle = "#b5476d"; g.lineWidth = Math.max(1, Math.min(5, 0.6 * u * sc));
      g.beginPath(); g.arc(X(CELL_X), Y(-10 * u), 10 * u * sc, 0, TAU); g.fill(); g.stroke();
      g.fillStyle = "#7b4fd6"; g.beginPath(); g.arc(X(CELL_X + 2 * u), Y(-11 * u), 3 * u * sc, 0, TAU); g.fill();
    },
  };
  const stBact = {
    size: 0.000004, at: [CELL_X - 0.000003, -0.0000205], name: "Bakterie", info: "Bakterie (z. B. E. coli): etwa 2 µm lang",
    draw(g, X, Y, sc) {
      const u = 1e-6, x0 = CELL_X - 3 * u, y0 = -20.45 * u;
      g.strokeStyle = "#138a5a"; g.lineWidth = Math.max(1, 0.06 * u * sc);
      g.beginPath(); g.moveTo(X(x0 + 1 * u), Y(y0)); for (let i = 0; i <= 30; i++) g.lineTo(X(x0 + (1 + i * 0.05) * u), Y(y0 + Math.sin(i / 3) * 0.12 * u)); g.stroke();
      g.fillStyle = "#57c08d"; g.lineWidth = Math.max(1, 0.05 * u * sc);
      const r = 0.25 * u * sc;
      g.beginPath(); g.moveTo(X(x0 - 0.75 * u), Y(y0 - 0.25 * u)); g.lineTo(X(x0 + 0.75 * u), Y(y0 - 0.25 * u)); g.arc(X(x0 + 0.75 * u), Y(y0), r, -Math.PI / 2, Math.PI / 2); g.lineTo(X(x0 - 0.75 * u), Y(y0 + 0.25 * u)); g.arc(X(x0 - 0.75 * u), Y(y0), r, Math.PI / 2, Math.PI * 1.5); g.fill(); g.stroke();
    },
  };
  const ZOOM_IN = [stBerlin, ground, stTower, stChild, stAnt, stHair, stBact];

  /* ---- zoom out: Berlin → Erde → Mond → Sonne → nächster Stern ---- */
  const RE = 6.371e6, EC = [0, RE], MOON = [3.844e8, RE], SUN = [-1.496e11, RE], STAR = [-1.496e11 + 4.01e16, RE];
  const stBerlinOut = Object.assign({}, stBerlin, { draw(g, X, Y, sc, vw) { if (vw > 3e6) return; stBerlin.draw(g, X, Y, sc, 45000); } });
  const stEarth = {
    size: 12742e3, at: EC, name: "Erde", info: "Erde: 12.742 km Durchmesser",
    draw(g, X, Y, sc) {
      const R = Math.max(3, RE * sc), cx = X(EC[0]), cy = Y(EC[1]);
      if (R > 1e5) return;
      g.fillStyle = "#3f8ad8"; g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.fill();
      if (R > 30) {
        g.fillStyle = "#5fae6a";
        g.save(); g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.clip();
        g.beginPath(); g.ellipse(cx, cy - R * 0.9, R * 0.38, R * 0.3, 0, 0, TAU); g.fill();
        g.beginPath(); g.ellipse(cx + R * 0.15, cy + R * 0.12, R * 0.24, R * 0.4, 0.2, 0, TAU); g.fill();
        g.restore();
      }
      g.fillStyle = "#dc3b2a"; g.beginPath(); g.arc(X(0), Y(0), Math.max(3, Math.min(8, 0.06 * R)), 0, TAU); g.fill();
      if (showTag(sc, 12742e3)) tag(g, "Berlin", X(0), Y(0) - 16, "#e8ecff");
    },
  };
  const stMoon = {
    size: 9e8, at: [(EC[0] + MOON[0]) / 2, RE], name: "Erde und Mond", info: "Mond: 384.400 km entfernt – etwa 30 Erden",
    draw(g, X, Y, sc) {
      g.strokeStyle = "rgba(255,255,255,.35)"; g.setLineDash([5, 7]); g.lineWidth = 2;
      if (3.844e8 * sc < 5e4) { g.beginPath(); g.arc(X(EC[0]), Y(EC[1]), 3.844e8 * sc, 0, TAU); g.stroke(); }
      g.setLineDash([]);
      g.fillStyle = "#e9e5d3"; g.beginPath(); g.arc(X(MOON[0]), Y(MOON[1]), Math.max(2.5, 1737e3 * sc), 0, TAU); g.fill();
      if (showTag(sc, 9e8)) { tag(g, "Erde", X(EC[0]), Y(EC[1]) + 30, "#e8ecff"); tag(g, "Mond", X(MOON[0]), Y(MOON[1]) - 14, "#e8ecff"); }
    },
  };
  const stSun = {
    size: 3.2e11, at: [SUN[0] / 2, RE], name: "Erde und Sonne", info: "Sonne: 149,6 Mio. km entfernt. Ihr Licht braucht etwa 8 Min. 20 s zu uns",
    draw(g, X, Y, sc) {
      if (1.496e11 * sc < 5e4) { g.strokeStyle = "rgba(255,255,255,.35)"; g.setLineDash([5, 7]); g.lineWidth = 2; g.beginPath(); g.arc(X(SUN[0]), Y(SUN[1]), 1.496e11 * sc, 0, TAU); g.stroke(); g.setLineDash([]); }
      g.fillStyle = "#ffcf3f"; g.beginPath(); g.arc(X(SUN[0]), Y(SUN[1]), Math.max(5, 6.96e8 * sc), 0, TAU); g.fill();
      if (12742e3 * sc < 1.5) { g.fillStyle = "#3f8ad8"; g.beginPath(); g.arc(X(EC[0]), Y(EC[1]), 3, 0, TAU); g.fill(); }
      if (showTag(sc, 3.2e11)) { tag(g, "Sonne", X(SUN[0]), Y(SUN[1]) + 34, "#e8ecff"); tag(g, "Erde", X(EC[0]), Y(EC[1]) + 26, "#e8ecff"); }
    },
  };
  const stStar = {
    size: 6e16, at: [(SUN[0] + STAR[0]) / 2, RE], name: "Nächster Stern", info: "Proxima Centauri: 4,24 Lichtjahre ≈ 40 Billionen km",
    draw(g, X, Y, sc) {
      g.fillStyle = "#ff8a6a"; g.beginPath(); g.arc(X(STAR[0]), Y(STAR[1]), 5, 0, TAU); g.fill();
      if (3.2e11 * sc < 4) { g.fillStyle = "#ffcf3f"; g.beginPath(); g.arc(X(SUN[0]), Y(SUN[1]), 5, 0, TAU); g.fill(); }
      if (!showTag(sc, 6e16) && !showTag(sc, 3.2e11)) tag(g, "Sonne mit allen Planeten", X(SUN[0]), Y(SUN[1]) + 30, "#e8ecff");
      if (showTag(sc, 6e16)) {
        g.strokeStyle = "rgba(255,217,74,.6)"; g.setLineDash([6, 8]); g.lineWidth = 2; g.beginPath(); g.moveTo(X(SUN[0]) + 9, Y(0)); g.lineTo(X(STAR[0]) - 9, Y(0)); g.stroke(); g.setLineDash([]);
        tag(g, "Sonne", X(SUN[0]), Y(SUN[1]) + 30, "#e8ecff"); tag(g, "Proxima Centauri", X(STAR[0]), Y(STAR[1]) + 30, "#e8ecff");
      }
    },
  };
  const ZOOM_OUT = [stBerlinOut, stEarth, stMoon, stSun, stStar];
  // cell drawing (SVG) used by several slides
  function plantCell(s, x, y, w, h, parts = {}) {
    const g = s.el("g");
    const el = {};
    el.wall = s.el("rect", { x, y, width: w, height: h, rx: 14, fill: "#d6efc4", stroke: "#3f8a2a", "stroke-width": 10 });
    el.membrane = s.el("rect", { x: x + 11, y: y + 11, width: w - 22, height: h - 22, rx: 8, fill: "#eaf7e0", stroke: "#7b4fd6", "stroke-width": 3 });
    el.plasma = s.el("rect", { x: x + 14, y: y + 14, width: w - 28, height: h - 28, rx: 6, fill: "#f3f9d2" });
    el.vacuole = s.el("rect", { x: x + w * 0.3, y: y + h * 0.22, width: w * 0.55, height: h * 0.56, rx: 30, fill: "#cfe8fb", stroke: "#4b8fd8", "stroke-width": 2 });
    el.nucleus = s.el("g", null, s.el("circle", { cx: x + w * 0.16, cy: y + h * 0.5, r: Math.min(w, h) * 0.11, fill: "#c9a7f0", stroke: "#7b4fd6", "stroke-width": 3 }), s.el("circle", { cx: x + w * 0.16 + 4, cy: y + h * 0.5 - 3, r: Math.min(w, h) * 0.035, fill: "#7b4fd6" }));
    el.chloro = s.el("g");
    [[0.12, 0.18], [0.24, 0.12], [0.92, 0.2], [0.9, 0.62], [0.88, 0.86], [0.55, 0.88], [0.3, 0.86], [0.12, 0.82], [0.62, 0.12]].forEach(([fx, fy], i) =>
      el.chloro.append(s.el("ellipse", { cx: x + w * fx, cy: y + h * fy, rx: 13, ry: 7, fill: "#2f9e44", transform: `rotate(${i * 37} ${x + w * fx} ${y + h * fy})` })));
    g.append(el.wall, el.plasma, el.membrane, el.vacuole, el.nucleus, el.chloro);
    return { g, el };
  }

  Deck.unit({
    id: "u8", num: 8, title: "Sehr groß und sehr klein", color: "#a21caf", soft: "#f7e3f9",
    subtitle: "Vom Weltall bis zur Zelle – mit Lupe und Mikroskop",
    blurb: "Zoomen von Berlin bis zur Bakterie – und durchs Mikroskop.",
    goals: ["Größen von km bis µm ordnen und zoomen", "Lupe und Mikroskop: Teile und Vergrößerung", "Ein Präparat herstellen und richtig zeichnen", "Pflanzenzelle, Tierzelle, Einzeller und Vielzeller"],
    icon(svg, el) {
      svg.append(el("circle", { cx: 30, cy: 30, r: 18, fill: "#f7e3f9", stroke: "#a21caf", "stroke-width": 6 }),
        el("line", { x1: 43, y1: 43, x2: 60, y2: 60, stroke: "#a21caf", "stroke-width": 8, "stroke-linecap": "round" }),
        el("circle", { cx: 30, cy: 30, r: 6, fill: "#a21caf" }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Von Kilometer bis Mikrometer",
        say: "Für sehr große und sehr kleine Dinge brauchen wir passende Einheiten. Ganz neu ist der Mikrometer: ein Tausendstel Millimeter.",
        build(s) {
          const U = [
            ["km", "Kilometer", "Berlin: 45 km breit"], ["m", "Meter", "Fernsehturm: 368 m"], ["cm", "Zentimeter", "Kind: 140 cm"],
            ["mm", "Millimeter", "Ameise: 5 mm"], ["µm", "Mikrometer", "Haar: 70 µm dick"],
          ];
          const F = ["× 1.000", "× 100", "× 10", "× 1.000"];
          const sv = s.svg(1100, 372);
          const stepW = 210, stepH = 52;
          const boxes = U.map(([u, n, e], i) => {
            const x = 10 + i * stepW, y = 10 + i * stepH;
            const gg = s.el("g", { class: i ? "later" : "" },
              s.el("rect", { x, y, width: 180, height: 110, rx: 16, fill: i === 4 ? "#a21caf" : "#fff", stroke: "#a21caf", "stroke-width": 3 }),
              s.el("text", { x: x + 90, y: y + 52, "text-anchor": "middle", "font-size": 40, "font-weight": 800, fill: i === 4 ? "#fff" : "#a21caf", text: u }),
              s.el("text", { x: x + 90, y: y + 90, "text-anchor": "middle", class: "lbl", style: { fill: i === 4 ? "#fff" : "#1b2740" }, text: n }));
            const ex = s.el("text", { x: x + 90, y: y + 140, "text-anchor": "middle", class: "lbl later", style: { fill: "#5d6678" }, text: e });
            sv.append(gg, ex);
            return { gg, ex };
          });
          const arrows = F.map((f, i) => {
            const x = 10 + i * stepW + 180, y = 10 + i * stepH + 40;
            const gg = s.el("g", { class: "later" }, s.el("path", { d: `M${x + 4} ${y} q 14 0 22 ${stepH * 0.6}`, fill: "none", stroke: "#dc3b2a", "stroke-width": 3 }),
              s.el("text", { x: x - 6, y: y - 18, "text-anchor": "start", class: "lbl", style: { fill: "#dc3b2a", fontWeight: 700 }, text: f }));
            sv.append(gg); return gg;
          });
          const merk = s.h("div", { class: "merk later" }, s.h("b", null, "1 mm = 1.000 µm"), " (Mikrometer). Das Zeichen µ heißt „my“. Ein Mikrometer ist ein Tausendstel Millimeter – viel zu klein für unsere Augen.");
          const lf = life(s, "Im Alltag", s.h("p", { class: "small" }, "Ein Lineal zeigt nur mm. Für µm brauchst du ein Mikroskop."));
          s.add(s.h("div", { class: "stack", style: { gap: "14px" } }, sv, s.h("div", { class: "cols", style: { gridTemplateColumns: "1.7fr 1fr", gap: "18px" } }, merk, lf)));
          s.sfx.pop(); s.show(boxes[0].gg, "pop");
          s.step(async () => { s.sfx.pop(); await s.show(boxes[0].ex, "fade"); for (let i = 1; i < 5; i++) { s.sfx.note(-i * 2, .2); s.show(arrows[i - 1], "fade"); await s.show(boxes[i].gg, "pop"); s.show(boxes[i].ex, "fade"); } });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Zoom hinein: Berlin bis Bakterie",
        say: "Wir zoomen in Zehnerschritten hinein: von ganz Berlin bis zu einer winzigen Bakterie.",
        build(s) {
          const stages = ZOOM_IN.filter(x => x !== ground);
          const Z = zoomer(s, 620, 520, stages, false, [ground]);
          const lo = Z.lo, hi = Z.hi;
          const name = s.h("p", { class: "h2", style: { color: "var(--unit)" } }, stages[0].name);
          const info = s.h("p", { class: "t" }, stages[0].info);
          const width = s.h("p", { class: "small pencil mono" }, "");
          const upd = v => { Z.set(lo + (hi - lo) * v / 100); name.textContent = Z.cur.name; info.textContent = Z.cur.info; width.textContent = "Bildbreite: " + fmtLen(Math.pow(10, Z.lw)); };
          upd(0);
          const sl = s.slider({ label: "Zoom", min: 0, max: 100, step: 0.5, value: 0, fmt: v => v < 2 ? "ganz weit" : v > 98 ? "ganz nah" : "", onInput: upd });
          const play = async () => { s.sfx.whoosh(); let last = ""; await s.tween({ from: 0, to: 100, dur: 9000, ease: "linear", update: v => { upd(v); sl.input.value = v; if (Z.cur.name !== last) { last = Z.cur.name; s.sfx.pop(); } } }); sl.set(100); s.sfx.ding(); };
          const btn = s.h("button", { class: "btn solid", onclick: play }, "Zoom abspielen");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Jeder Schritt macht alles ", s.h("b", null, "10-, 100- oder 1.000-mal"), " größer. So kommen wir von km bis µm.");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "620px 1fr", gap: "24px", alignItems: "center", height: "100%" } }, Z.canvas,
            s.h("div", { class: "stack", style: { gap: "12px" } }, name, info, width, sl, s.h("div", { class: "row" }, btn), merk)));
          s.show(Z.canvas, "zoom"); s.sfx.pop();
          s.step(async () => { await play(); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Zoom hinaus: bis zu den Sternen",
        say: "Jetzt zoomen wir hinaus: von Berlin zur Erde, zum Mond, zur Sonne und zum nächsten Stern.",
        build(s) {
          const stages = ZOOM_OUT;
          const Z = zoomer(s, 620, 520, stages, true);
          const lo = Z.lo, hi = Z.hi;
          const name = s.h("p", { class: "h2", style: { color: "var(--unit)" } }, stages[0].name);
          const info = s.h("p", { class: "t" }, stages[0].info);
          const width = s.h("p", { class: "small pencil mono" }, "");
          const upd = v => { Z.set(lo + (hi - lo) * v / 100); name.textContent = Z.cur.name; info.textContent = Z.cur.info; width.textContent = "Bildbreite: " + fmtLen(Math.pow(10, Z.lw)); };
          upd(0);
          const sl = s.slider({ label: "Zoom hinaus", min: 0, max: 100, step: 0.5, value: 0, fmt: v => v < 2 ? "Berlin" : v > 98 ? "Sterne" : "", onInput: upd });
          const play = async () => { s.sfx.whoosh(); let last = ""; await s.tween({ from: 0, to: 100, dur: 9000, ease: "linear", update: v => { upd(v); sl.input.value = v; if (Z.cur.name !== last) { last = Z.cur.name; s.sfx.pop(); } } }); sl.set(100); s.sfx.ding(); };
          const btn = s.h("button", { class: "btn solid", onclick: play }, "Zoom abspielen");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, s.h("b", null, "1 Lichtjahr"), " ist die Strecke, die Licht in einem Jahr fliegt: etwa 9,46 Billionen km.");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "620px 1fr", gap: "24px", alignItems: "center", height: "100%" } }, Z.canvas,
            s.h("div", { class: "stack", style: { gap: "12px" } }, name, info, width, sl, s.h("div", { class: "row" }, btn), merk)));
          s.show(Z.canvas, "zoom"); s.sfx.pop();
          s.step(async () => { await play(); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Im Alltag: Zoomen",
        say: "Zoomen kennst du von der Karten-App und der Handy-Kamera. Tippe auf Plus und zoome in Berlin hinein.",
        build(s) {
          const sv = s.svg(560, 460, { style: "border-radius:18px;background:#eef2e6" });
          const world = s.el("g");
          // city level (0..1000)
          world.append(s.el("rect", { x: 0, y: 0, width: 1000, height: 820, fill: "#eef2e6" }));
          world.append(s.el("path", { d: "M0 420 C 200 360 300 520 500 440 S 800 380 1000 470", fill: "none", stroke: "#8cc0ef", "stroke-width": 26 }));
          for (let i = 0; i < 9; i++) world.append(s.el("line", { x1: i * 125, y1: 0, x2: i * 125 + 60, y2: 820, stroke: "#fff", "stroke-width": 10 }));
          for (let i = 0; i < 7; i++) world.append(s.el("line", { x1: 0, y1: i * 130, x2: 1000, y2: i * 130 + 40, stroke: "#fff", "stroke-width": 10 }));
          world.append(s.el("rect", { x: 120, y: 120, width: 180, height: 150, rx: 20, fill: "#b8dca0" }), s.el("rect", { x: 700, y: 560, width: 200, height: 140, rx: 20, fill: "#b8dca0" }));
          // Fernsehturm icon
          world.append(s.el("line", { x1: 520, y1: 250, x2: 520, y2: 330, stroke: "#5d6678", "stroke-width": 6 }), s.el("circle", { cx: 520, cy: 280, r: 10, fill: "#5d6678" }));
          // district level around (600, 300) size 100
          const d = s.el("g");
          for (let i = 0; i < 6; i++) d.append(s.el("line", { x1: 590 + i * 4, y1: 285, x2: 590 + i * 4, y2: 320, stroke: "#fff", "stroke-width": 1.2 }));
          d.append(s.el("rect", { x: 601, y: 300, width: 14, height: 9, fill: "#f2d38c", stroke: "#c79a3a", "stroke-width": .5 }));
          // house level around (608, 304) size 10
          d.append(s.el("rect", { x: 606, y: 302.5, width: 4, height: 3, fill: "#dc3b2a" }), s.el("rect", { x: 607.5, y: 304, width: 1, height: 1.5, fill: "#fff" }));
          world.append(d);
          sv.append(world);
          const levels = [[0, 0, 1000, 820, "ganz Berlin"], [540, 255, 140, 115, "ein Kiez"], [596, 293, 28, 23, "eine Straße"], [604.5, 301, 7, 5.75, "ein Haus"]];
          let lv = 0, vb = levels[0].slice(0, 4);
          sv.setAttribute("viewBox", vb.join(" "));
          const lbl = s.h("p", { class: "h2", style: { color: "var(--unit)" } }, "Du siehst: ganz Berlin");
          const go = async n => {
            n = Math.max(0, Math.min(3, n)); if (n === lv) { s.sfx.boing(); return; }
            const from = vb.slice(), to = levels[n].slice(0, 4); lv = n; n > 0 ? s.sfx.zap() : s.sfx.whoosh();
            await s.tween({ from: 0, to: 1, dur: 900, update: t => { const k = Math.pow(to[2] / from[2], t); const w = from[2] * k; const f = from[2] === to[2] ? t : (w - from[2]) / (to[2] - from[2]); vb = from.map((a, i) => a + (to[i] - a) * f); sv.setAttribute("viewBox", vb.join(" ")); } });
            vb = to; sv.setAttribute("viewBox", vb.join(" ")); lbl.textContent = "Du siehst: " + levels[n][4];
          };
          const plus = s.h("button", { class: "btn solid", onclick: () => go(lv + 1) }, "＋ hinein");
          const minus = s.h("button", { class: "btn", onclick: () => go(lv - 1) }, "– hinaus");
          const cards = [
            exb(s, "Karten-App", s.h("p", { class: "small" }, "Zwei Finger auseinander: Aus der Stadt wird eine Straße, dann ein Haus.")),
            exb(s, "Handy-Kamera", s.h("p", { class: "small" }, "Mit Zoom holst du die Kugel vom Fernsehturm nah heran.")),
            life(s, "Fernglas", s.h("p", { class: "small" }, "Ein Fernglas lässt Vögel im Park viel größer erscheinen.")),
          ];
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "560px 1fr", gap: "24px", alignItems: "center", height: "100%" } },
            s.h("div", { class: "stack", style: { gap: "10px" } }, sv, s.h("div", { class: "row" }, plus, minus)),
            s.h("div", { class: "stack", style: { gap: "12px" } }, lbl, ...cards)));
          s.show(sv, "zoom"); s.sfx.pop();
          s.step(async () => { await go(1); s.sfx.pop(); await s.show(cards[0], "up"); });
          s.step(async () => { await go(2); await go(3); s.sfx.pop(); await s.show(cards[1], "up"); });
          s.step(async () => { await go(0); s.sfx.pop(); await s.show(cards[2], "up"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Die Lupe",
        say: "Eine Lupe ist eine gewölbte Glaslinse. Schiebe die Lupe über die Dinge und sieh, wie groß sie werden.",
        build(s) {
          const W = 560, H = 470;
          const sv = s.svg(W, H);
          const id = "u8lupe" + Math.random().toString(36).slice(2, 7);
          const content = s.el("g", { id });
          content.append(s.el("rect", { x: 0, y: 0, width: W, height: H, fill: "#fbfaf4" }));
          // ant (5 mm drawn ~ 30 px)
          const ant = s.el("g", { transform: "translate(110 120)" });
          [[-10, 0, 5, 3.5], [-2, 0, 4, 2.5], [9, 0, 7, 4.5]].forEach(([x, y, rx, ry]) => ant.append(s.el("ellipse", { cx: x, cy: y, rx, ry, fill: "#7a2e12" })));
          [-4, -1, 2].forEach((x, i) => [-1, 1].forEach(dd => ant.append(s.el("polyline", { points: `${x},0 ${x - 3 + i * 3},${dd * 6} ${x - 5 + i * 5},${dd * 10}`, fill: "none", stroke: "#5a1f0a", "stroke-width": 0.8 }))));
          content.append(ant);
          // salt crystals = tiny cubes
          [[380, 100, 0], [398, 112, 20], [372, 125, -15], [392, 132, 40], [410, 96, 10]].forEach(([x, y, r]) => content.append(s.el("g", { transform: `rotate(${r} ${x} ${y})` },
            s.el("rect", { x: x - 3, y: y - 3, width: 6, height: 6, fill: "#fff", stroke: "#8a93a6", "stroke-width": 0.7 }), s.el("line", { x1: x - 3, y1: y - 3, x2: x + 3, y2: y + 3, stroke: "#d5dbe6", "stroke-width": 0.4 }))));
          // fingerprint
          for (let i = 1; i <= 9; i++) content.append(s.el("ellipse", { cx: 160, cy: 330, rx: i * 3.4, ry: i * 4.4, fill: "none", stroke: "#a26a4a", "stroke-width": 0.9, "stroke-dasharray": i % 3 ? "" : "9 3" }));
          // leaf with veins
          content.append(s.el("path", { d: "M360 330 q40 -40 80 0 q-40 40 -80 0z", fill: "#7cc36a" }));
          content.append(s.el("line", { x1: 360, y1: 330, x2: 440, y2: 330, stroke: "#3f8a2a", "stroke-width": 0.8 }));
          for (let i = 0; i < 6; i++) content.append(s.el("line", { x1: 370 + i * 11, y1: 330, x2: 376 + i * 11, y2: 316 + (i % 2) * 0, stroke: "#3f8a2a", "stroke-width": 0.5 }), s.el("line", { x1: 370 + i * 11, y1: 330, x2: 376 + i * 11, y2: 344, stroke: "#3f8a2a", "stroke-width": 0.5 }));
          sv.append(content);
          const labels = [["Ameise", 110, 175], ["Salzkörner", 392, 175], ["Fingerabdruck", 160, 400], ["Blatt", 400, 400]];
          labels.forEach(([t, x, y]) => sv.append(s.el("text", { x, y, "text-anchor": "middle", class: "lbl", style: { fill: "#5d6678" }, text: t })));
          let lx = 110, ly = 120, k = 4;
          const clipId = id + "c";
          const clip = s.el("clipPath", { id: clipId }, s.el("circle", { cx: lx, cy: ly, r: 78 }));
          const defs = s.el("defs", null, clip);
          const use = s.el("use", { href: "#" + id });
          const useWrap = s.el("g", { "clip-path": `url(#${clipId})` }, use);
          const ring = s.el("circle", { cx: lx, cy: ly, r: 80, fill: "rgba(200,230,255,.12)", stroke: "#5d6678", "stroke-width": 10 });
          const handle = s.el("line", { x1: lx + 56, y1: ly + 56, x2: lx + 120, y2: ly + 120, stroke: "#a21caf", "stroke-width": 18, "stroke-linecap": "round" });
          const lens = s.el("g", { class: "later" }, useWrap, ring, handle);
          sv.append(defs, lens);
          const place = () => {
            clip.firstChild.setAttribute("cx", lx); clip.firstChild.setAttribute("cy", ly);
            use.setAttribute("transform", `translate(${lx} ${ly}) scale(${k}) translate(${-lx} ${-ly})`);
            ring.setAttribute("cx", lx); ring.setAttribute("cy", ly);
            handle.setAttribute("x1", lx + 56); handle.setAttribute("y1", ly + 56); handle.setAttribute("x2", lx + 120); handle.setAttribute("y2", ly + 120);
          };
          place();
          s.drag(lens, { space: sv, onMove: p => { lx = Math.max(80, Math.min(W - 80, p.x)); ly = Math.max(80, Math.min(H - 80, p.y)); place(); } });
          const sl = s.slider({ label: "Vergrößerung", min: 2, max: 10, value: 4, fmt: v => v + "-fach", onInput: v => { k = v; place(); } });
          const tour = async () => { for (const [x, y] of [[392, 115], [160, 330], [400, 330], [110, 120]]) { s.sfx.swoosh(); const fx = lx, fy = ly; await s.tween({ from: 0, to: 1, dur: 800, update: t => { lx = fx + (x - fx) * t; ly = fy + (y - fy) * t; place(); } }); await s.wait(500); } };
          const info = s.h("p", { class: "t" }, "Die Lupe ist eine ", s.h("b", null, "gewölbte Glaslinse"), ". Ziehe sie mit dem Finger!");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Leselupen vergrößern meist ", s.h("b", null, "2- bis 6-fach"), ", gute Lupen bis etwa ", s.h("b", null, "15-fach"), ".");
          const lf = life(s, "Im Alltag", s.h("p", { class: "small" }, "Unter der Lupe sind Salzkörner kleine Würfel. Die Polizei sucht mit der Lupe Fingerabdrücke. Uhrmacher arbeiten mit einer Lupe im Auge."));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "560px 1fr", gap: "24px", alignItems: "center", height: "100%" } }, sv,
            s.h("div", { class: "stack", style: { gap: "14px" } }, info, sl, merk, lf)));
          s.show(sv, "fade"); s.sfx.pop();
          s.step(async () => { s.sfx.pop(); await s.show(lens, "pop"); await tour(); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Das Mikroskop",
        say: "Das Mikroskop hat viele Teile. Tippe auf einen Namen, dann leuchtet das Teil auf.",
        build(s) {
          const sv = s.svg(720, 620);
          const ink = "#1b2740", body = "#c9cfdb";
          const P = {};
          P.stativ = s.el("g", null, s.el("rect", { x: 190, y: 560, width: 340, height: 42, rx: 12, fill: body, stroke: ink, "stroke-width": 3 }),
            s.el("path", { d: "M470 560 L470 260 Q470 150 380 150 L350 150", fill: "none", stroke: body, "stroke-width": 34, "stroke-linecap": "round" }),
            s.el("path", { d: "M470 560 L470 260 Q470 150 380 150 L350 150", fill: "none", stroke: ink, "stroke-width": 3, opacity: .25 }));
          P.licht = s.el("g", null, s.el("rect", { x: 300, y: 520, width: 60, height: 40, rx: 8, fill: "#5d6678" }), s.el("ellipse", { cx: 330, cy: 520, rx: 26, ry: 8, fill: "#ffd94a", stroke: ink, "stroke-width": 2 }));
          P.blende = s.el("g", null, s.el("rect", { x: 296, y: 452, width: 68, height: 16, rx: 6, fill: "#5d6678" }), s.el("line", { x1: 364, y1: 460, x2: 392, y2: 470, stroke: ink, "stroke-width": 4, "stroke-linecap": "round" }));
          P.tisch = s.el("g", null, s.el("rect", { x: 220, y: 418, width: 240, height: 18, rx: 4, fill: "#8a93a6", stroke: ink, "stroke-width": 3 }), s.el("rect", { x: 280, y: 410, width: 100, height: 8, fill: "#cfe8fb", stroke: "#4b8fd8", "stroke-width": 1.5 }));
          P.objektiv = s.el("g", null, s.el("rect", { x: 318, y: 316, width: 24, height: 72, rx: 4, fill: "#e1e5ec", stroke: ink, "stroke-width": 3 }),
            s.el("rect", { x: 280, y: 312, width: 20, height: 50, rx: 4, fill: "#e1e5ec", stroke: ink, "stroke-width": 2, transform: "rotate(25 290 312)" }),
            s.el("rect", { x: 360, y: 312, width: 20, height: 56, rx: 4, fill: "#e1e5ec", stroke: ink, "stroke-width": 2, transform: "rotate(-25 370 312)" }));
          P.revolver = s.el("ellipse", { cx: 330, cy: 302, rx: 56, ry: 16, fill: "#8a93a6", stroke: ink, "stroke-width": 3 });
          P.tubus = s.el("rect", { x: 312, y: 126, width: 36, height: 166, fill: "#e1e5ec", stroke: ink, "stroke-width": 3 });
          P.okular = s.el("g", null, s.el("rect", { x: 316, y: 64, width: 28, height: 62, rx: 4, fill: "#5d6678", stroke: ink, "stroke-width": 3 }), s.el("rect", { x: 310, y: 56, width: 40, height: 12, rx: 4, fill: ink }));
          P.grob = s.el("circle", { cx: 470, cy: 380, r: 28, fill: "#8a93a6", stroke: ink, "stroke-width": 3 });
          P.fein = s.el("circle", { cx: 470, cy: 450, r: 16, fill: "#8a93a6", stroke: ink, "stroke-width": 3 });
          sv.append(P.stativ, P.licht, P.blende, P.tisch, P.objektiv, P.revolver, P.tubus, P.okular, P.grob, P.fein);
          const ray = s.el("line", { x1: 330, y1: 515, x2: 330, y2: 40, stroke: "#ffd94a", "stroke-width": 8, opacity: .75, "stroke-linecap": "round", class: "later" });
          sv.append(ray);
          const D = {
            okular: ["Okular", "Hier schaust du hinein. Es vergrößert noch einmal, oft 10-fach.", 20, 92, 312, 92],
            tubus: ["Tubus", "Das Rohr zwischen Okular und Objektiven.", 20, 200, 312, 200],
            revolver: ["Objektivrevolver", "Drehscheibe: Damit wechselst du das Objektiv.", 20, 282, 276, 300],
            objektiv: ["Objektiv", "Linse dicht über dem Präparat, z. B. 4-, 10- oder 40-fach.", 20, 362, 318, 362],
            tisch: ["Objekttisch", "Hier liegt der Objektträger mit dem Präparat.", 20, 432, 220, 428],
            blende: ["Blende", "Sie regelt, wie viel Licht durchkommt.", 20, 490, 296, 460],
            licht: ["Lichtquelle", "Die Lampe: Licht scheint von unten durch das Präparat.", 20, 548, 300, 540],
            stativ: ["Stativ", "Fuß und Arm. Am Arm trägst du das Mikroskop.", 700, 220, 486, 220],
            grob: ["Grobtrieb", "Großes Rad: grob scharf stellen.", 700, 380, 498, 380],
            fein: ["Feintrieb", "Kleines Rad: ganz fein scharf stellen.", 700, 450, 486, 450],
          };
          const infoT = s.h("p", { class: "h2", style: { color: "var(--unit)" } }, "Tippe auf einen Namen");
          const infoD = s.h("p", { class: "t" }, "Dann leuchtet das Teil auf.");
          const lab = {};
          const pick = key => {
            Object.entries(P).forEach(([k2, el]) => el.setAttribute("opacity", k2 === key ? 1 : 0.35));
            Object.entries(lab).forEach(([k2, l]) => l.t.style.fill = k2 === key ? "#a21caf" : "#1b2740");
            infoT.textContent = D[key][0]; infoD.textContent = D[key][1]; s.sfx.click();
          };
          Object.entries(D).forEach(([key, [name, , tx, ty, px, py]]) => {
            const right = tx > 360;
            const t = s.el("text", { x: tx, y: ty + 7, "text-anchor": right ? "end" : "start", class: "lbl", style: { cursor: "pointer", fontWeight: 700 }, text: name });
            const tw = name.length * 10.5 + 8;
            const line = s.el("line", { x1: right ? tx - tw : tx + tw, y1: ty, x2: px, y2: py, stroke: "#a21caf", "stroke-width": 2 });
            const hit = s.el("rect", { x: right ? tx - tw : tx - 6, y: ty - 22, width: tw + 6, height: 44, fill: "transparent" });
            const gg = s.el("g", { class: "later", style: { cursor: "pointer" }, onclick: () => pick(key) }, line, hit, t);
            sv.append(gg); lab[key] = { gg, t, line };
          });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Das Licht geht von unten durch das Präparat, dann durch ", s.h("b", null, "Objektiv"), " und ", s.h("b", null, "Okular"), " in dein Auge.");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "720px 1fr", gap: "20px", alignItems: "center", height: "100%" } }, sv,
            s.h("div", { class: "stack", style: { gap: "14px" } }, s.h("div", { class: "card soft stack", style: { gap: "8px", minHeight: "190px" } }, infoT, infoD), merk)));
          s.show(sv, "fade"); s.sfx.pop();
          const group = keys => async () => { for (const k of keys) { s.sfx.pop(); s.show(lab[k].line, "draw"); await s.show(lab[k].gg, "fade"); } pick(keys[keys.length - 1]); };
          s.step(group(["okular", "tubus", "revolver", "objektiv"]));
          s.step(group(["tisch", "blende", "licht"]));
          s.step(group(["stativ", "grob", "fein"]));
          s.step(async () => { Object.values(P).forEach(el => el.setAttribute("opacity", 1)); s.sfx.zap(); await s.show(ray, "draw"); s.sfx.ding(); await s.show(merk, "up"); infoT.textContent = "Der Weg des Lichts"; infoD.textContent = "Lampe → Blende → Präparat → Objektiv → Tubus → Okular → Auge."; });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Vergrößerung ausrechnen",
        say: "Die Gesamtvergrößerung ist Okular mal Objektiv. Zum Beispiel 10 mal 40 gleich 400-fach.",
        build(s) {
          const V = 400;
          const { canvas, g } = s.canvas(V, V);
          let mag = 40, shown = 40;
          const draw = () => {
            g.clearRect(0, 0, V, V);
            g.save(); g.beginPath(); g.arc(V / 2, V / 2, V / 2 - 4, 0, TAU); g.clip();
            g.fillStyle = "#fbf6dc"; g.fillRect(0, 0, V, V);
            // onion-like cells: 200 × 50 "units", scaled by magnification
            const k = shown / 100; // px per unit
            const cw = 200 * k * 0.35, ch = 50 * k * 0.35;
            g.strokeStyle = "#7d6b3a"; g.lineWidth = Math.max(1, ch * 0.06);
            for (let row = -40; row < 40; row++) {
              const y = V / 2 + row * ch, off = (row % 2) * cw * 0.5;
              if (y < -ch || y > V + ch) continue;
              for (let c = -40; c < 40; c++) {
                const x = V / 2 + c * cw + off;
                if (x < -cw || x > V + cw) continue;
                g.strokeRect(x, y, cw, ch);
                if (ch > 14) { g.fillStyle = "#b9a35e"; g.beginPath(); g.ellipse(x + cw * 0.3, y + ch * 0.5, ch * 0.16, ch * 0.13, 0, 0, TAU); g.fill(); }
              }
            }
            g.restore();
            g.strokeStyle = "#1b2740"; g.lineWidth = 8; g.beginPath(); g.arc(V / 2, V / 2, V / 2 - 4, 0, TAU); g.stroke();
          };
          draw();
          const res = s.h("p", { class: "big mono" }, "10 × 4 = 40-fach");
          const set = async o => { mag = 10 * o; res.textContent = `10 × ${o} = ${10 * o}-fach`; s.sfx.snap(); await s.tween({ from: shown, to: mag, dur: 700, update: v => { shown = v; draw(); } }); };
          const btns = [4, 10, 40].map(o => s.h("button", { class: "btn", onclick: () => set(o) }, `Objektiv ${o}×`));
          const ex = s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, "Beispiele"),
            s.h("p", { class: "small" }, "Haar (0,07 mm) bei 400-fach: im Bild 28 mm dick."),
            s.h("p", { class: "small" }, "Ameise (5 mm) bei 40-fach: im Bild 20 cm lang."),
            s.h("p", { class: "small" }, "Eine Zelle (0,02 mm) bei 100-fach: im Bild 2 mm."));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, s.h("b", null, "Okular × Objektiv"), " = Gesamtvergrößerung. Beginne immer mit dem ", s.h("b", null, "kleinsten"), " Objektiv.");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "400px 1fr", gap: "28px", alignItems: "center", height: "100%" } }, canvas,
            s.h("div", { class: "stack", style: { gap: "14px" } }, s.h("p", { class: "t" }, "Okular: 10× (fest). Wähle ein Objektiv:"), s.h("div", { class: "row" }, ...btns), res, merk, ex)));
          s.show(canvas, "zoom"); s.sfx.pop();
          s.step(async () => { await set(10); await s.wait(500); await set(40); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(ex, "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Ein Präparat herstellen",
        say: "So machst du ein Präparat von der Zwiebelhaut. Wichtig: Das Deckgläschen schräg ansetzen und langsam absenken.",
        build(s) {
          const sv = s.svg(600, 380, { viewBox: "40 105 520 330" });
          sv.append(s.el("rect", { x: 0, y: 300, width: 600, height: 140, fill: "#e8edf3" }));
          const slide = s.el("rect", { x: 70, y: 280, width: 460, height: 20, rx: 3, fill: "#d9efff", stroke: "#4b8fd8", "stroke-width": 3, class: "later" });
          const pip = s.el("g", { class: "later" }, s.el("g", { transform: "translate(0 64)" }, s.el("rect", { x: 284, y: 60, width: 32, height: 110, rx: 6, fill: "#e1e5ec", stroke: "#5d6678", "stroke-width": 3 }), s.el("ellipse", { cx: 300, cy: 58, rx: 22, ry: 18, fill: "#dc3b2a" }), s.el("path", { d: "M292 170 L300 200 L308 170Z", fill: "#e1e5ec", stroke: "#5d6678", "stroke-width": 3 })));
          const drop = s.el("path", { d: "M215 280 Q300 250 385 280 Z", fill: "#8cc0ef", opacity: .85, class: "later" });
          const skin = s.el("path", { d: "M245 272 q18 -6 36 0 t36 0 t36 0", fill: "none", stroke: "#c79a3a", "stroke-width": 6, "stroke-linecap": "round", class: "later" });
          const tweez = s.el("g", { class: "later" }, s.el("line", { x1: 330, y1: 120, x2: 300, y2: 262, stroke: "#5d6678", "stroke-width": 6 }), s.el("line", { x1: 350, y1: 120, x2: 306, y2: 262, stroke: "#5d6678", "stroke-width": 6 }));
          const cover = s.el("rect", { x: 200, y: 268, width: 210, height: 8, rx: 2, fill: "rgba(200,230,255,.8)", stroke: "#4b8fd8", "stroke-width": 2, class: "later" });
          sv.append(slide, drop, skin, pip, tweez, cover);
          const labels = [];
          const L = (t, x, y) => { const e = s.el("text", { x, y, "text-anchor": "middle", class: "lbl later", text: t }); sv.append(e); labels.push(e); return e; };
          const l1 = L("Objektträger", 300, 340), l2 = L("Wassertropfen", 120, 200), l3 = L("Zwiebelhäutchen", 465, 200), l4 = L("Deckgläschen", 120, 360);
          const lines = [[120, 208, 240, 258], [465, 208, 320, 266], [120, 340, 210, 280]].map(([x1, y1, x2, y2]) => { const e = s.el("line", { x1, y1, x2, y2, stroke: "#a21caf", "stroke-width": 2, class: "later" }); sv.append(e); return e; });
          const steps = ["Objektträger sauber hinlegen", "Einen Wassertropfen daraufgeben (Pipette)", "Ein Stück Zwiebelhäutchen mit der Pinzette in den Tropfen legen", "Deckgläschen schräg ansetzen und langsam absenken – so gibt es keine Luftblasen", "Unter das Mikroskop legen, mit dem kleinsten Objektiv anfangen"];
          const items = steps.map((t, i) => s.h("li", { class: "later", style: { display: "flex", gap: "10px", alignItems: "baseline" } }, s.h("b", { style: { color: "var(--unit)", fontFamily: "var(--f-display)", fontSize: "26px", minWidth: "26px" } }, String(i + 1)), s.h("span", { class: "t", style: { fontSize: "22px" } }, t)));
          const list = s.h("ol", { style: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" } }, ...items);
          const dropCover = async () => {
            cover.setAttribute("transform", "rotate(-40 200 276)");
            s.show(cover, "fade"); s.sfx.swoosh();
            await s.tween({ from: -40, to: 0, dur: 1400, ease: "out", update: a => cover.setAttribute("transform", `rotate(${a} 200 276)`) });
            s.sfx.snap();
          };
          const again = s.h("button", { class: "btn later", onclick: async () => { await dropCover(); } }, "Deckglas nochmal");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "600px 1fr", gap: "24px", alignItems: "center", height: "100%" } },
            s.h("div", { class: "stack", style: { gap: "10px" } }, sv, s.h("div", { class: "row" }, again)), list));
          s.sfx.pop();
          s.step(async () => { s.sfx.pop(); s.show(items[0], "left"); await s.show(slide, "down"); s.show(l1, "fade"); });
          s.step(async () => { s.show(items[1], "left"); await s.show(pip, "down"); s.sfx.boing(); await s.show(drop, "pop"); s.hide(pip); s.show([l2, lines[0]], "fade"); });
          s.step(async () => { s.show(items[2], "left"); await s.show(tweez, "down"); s.sfx.pop(); await s.show(skin, "fade"); s.hide(tweez); s.show([l3, lines[1]], "fade"); });
          s.step(async () => { s.show(items[3], "left"); await dropCover(); s.show([l4, lines[2]], "fade"); s.show(again, "pop"); });
          s.step(async () => { s.sfx.ding(); await s.show(items[4], "left"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Die mikroskopische Zeichnung",
        say: "Beim Mikroskopieren zeichnest du, was du siehst. Mit Bleistift, groß, nur mit Umrissen und mit Beschriftung.",
        build(s) {
          const sv = s.svg(520, 440);
          sv.append(s.el("rect", { x: 0, y: 0, width: 520, height: 440, rx: 14, fill: "#fff", stroke: "#c8d3de", "stroke-width": 2 }));
          const title = s.el("text", { x: 24, y: 44, class: "lbl later", style: { fontWeight: 700, fontSize: "22px" }, text: "Zwiebelhaut, 100-fach" });
          sv.append(title);
          const cells = [];
          const cellPath = (x, y, w, h) => `M${x} ${y} L${x + w} ${y + 3} L${x + w - 2} ${y + h} L${x + 2} ${y + h - 2} Z`;
          [[30, 90, 220, 70], [250, 93, 200, 68], [20, 162, 180, 72], [200, 163, 240, 70], [40, 236, 230, 66], [270, 235, 170, 68]].forEach(([x, y, w, h]) => {
            const p = s.el("path", { d: cellPath(x, y, w, h), fill: "none", stroke: "#3a3f4a", "stroke-width": 2.5, class: "later" });
            const n = s.el("ellipse", { cx: x + w * 0.3, cy: y + h * 0.5, rx: 13, ry: 10, fill: "none", stroke: "#3a3f4a", "stroke-width": 2.5, class: "later" });
            sv.append(p, n); cells.push(p, n);
          });
          const lbls = [["Zellkern", 109, 279, 109, 405], ["Zellwand", 270, 290, 270, 405], ["Zellplasma", 410, 280, 410, 405]].map(([t, x1, y1, x2, y2]) => {
            const l = s.el("line", { x1, y1, x2, y2: y2 - 22, stroke: "#3a3f4a", "stroke-width": 2, class: "later" });
            const tx = s.el("text", { x: x2, y: y2, "text-anchor": "middle", class: "lbl later", text: t });
            sv.append(l, tx); return [l, tx];
          });
          const rules = [
            ["1", "Spitzer Bleistift, großes Bild"],
            ["2", "Nur Umrisse – nicht ausmalen oder schraffieren"],
            ["3", "Nur zeichnen, was du wirklich siehst"],
            ["4", "Beschriftungslinien mit Lineal, ohne Kreuzungen"],
            ["5", "Überschrift mit Präparat und Vergrößerung"],
          ].map(([i, t]) => s.h("div", { class: "card later row", style: { flexWrap: "nowrap", padding: "10px 16px", gap: "14px" } }, s.h("span", { style: { fontSize: "26px", width: "30px", textAlign: "center", fontWeight: 800, color: "var(--unit)", fontFamily: "var(--f-display)" } }, i), s.h("span", { class: "t", style: { fontSize: "22px" } }, t)));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "520px 1fr", gap: "24px", alignItems: "center", height: "100%" } }, sv,
            s.h("div", { class: "stack", style: { gap: "10px" } }, s.h("p", { class: "h2" }, "Regeln für die Zeichnung"), ...rules)));
          s.show(sv, "fade"); s.sfx.pop();
          s.step(async () => { s.show(rules[0], "left"); s.sfx.scribble(); await s.show(cells.filter((_, i) => i % 2 === 0), "draw"); });
          s.step(async () => { s.show(rules[1], "left"); s.show(rules[2], "left"); s.sfx.scribble(); await s.show(cells.filter((_, i) => i % 2 === 1), "draw"); });
          s.step(async () => { s.show(rules[3], "left"); for (const [l, t] of lbls) { s.sfx.tick(); await s.show(l, "draw"); s.show(t, "fade"); } });
          s.step(async () => { s.show(rules[4], "left"); s.sfx.ding(); await s.show(title, "fade"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Robert Hooke findet Zellen",
        say: "Im Jahr 1665 schaute Robert Hooke mit einem Mikroskop auf Kork. Er sah lauter kleine Kammern und nannte sie Zellen.",
        build(s) {
          const sv = s.svg(520, 460);
          sv.append(s.el("rect", { x: 0, y: 0, width: 520, height: 460, rx: 230, fill: "#f3e3c8", stroke: "#1b2740", "stroke-width": 10 }));
          const hexes = [];
          const r = 34, hw = Math.sqrt(3) * r;
          for (let row = 0; row < 9; row++) for (let c = 0; c < 7; c++) {
            const cx = 30 + c * hw + (row % 2) * hw / 2, cy = 30 + row * r * 1.5;
            const d = Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 6 + i * Math.PI / 3; return `${i ? "L" : "M"}${(cx + Math.cos(a) * r * 0.94).toFixed(1)} ${(cy + Math.sin(a) * r * 0.94).toFixed(1)}`; }).join(" ") + "Z";
            const p = s.el("path", { d, fill: "#fbf3e2", stroke: "#a0703a", "stroke-width": 5, class: "later" });
            hexes.push(p);
          }
          const hg = s.el("g", { "clip-path": "url(#u8cork)" }, ...hexes);
          sv.append(s.el("defs", null, s.el("clipPath", { id: "u8cork" }, s.el("rect", { x: 8, y: 8, width: 504, height: 444, rx: 222 }))), hg);
          const t1 = s.h("p", { class: "t later" }, s.h("b", null, "1665"), ": Robert Hooke betrachtet dünne Scheiben ", s.h("b", null, "Kork"), " mit seinem Mikroskop.");
          const t2 = s.h("p", { class: "t later" }, "Er sieht kleine Kammern wie Bienenwaben und nennt sie ", s.h("span", { class: "hl" }, "„cells“"), " – nach dem lateinischen ", s.h("i", null, "cellula"), " = kleine Kammer.");
          const merk = s.h("div", { class: "merk later" }, "Alle Lebewesen bestehen aus ", s.h("b", null, "Zellen"), ". Die Zelle ist der ", s.h("b", null, "Baustein des Lebens"), ".");
          const lf = life(s, "Im Alltag", s.h("p", { class: "small" }, "Kork kennst du vom Flaschenkorken und von der Pinnwand. Hooke sah nur leere Zellwände: Korkzellen sind tot."));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "520px 1fr", gap: "28px", alignItems: "center", height: "100%" } }, sv,
            s.h("div", { class: "stack", style: { gap: "14px" } }, t1, t2, merk, lf)));
          s.show(sv, "zoom"); s.sfx.pop(); s.show(t1, "up");
          s.step(async () => { s.sfx.scribble(); for (let i = 0; i < hexes.length; i += 7) { s.show(hexes.slice(i, i + 7), "pop"); s.sfx.count(i / 7); await s.wait(120); } await s.wait(400); s.show(t2, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Die Pflanzenzelle",
        say: "Eine Pflanzenzelle hat eine feste Zellwand, eine Zellmembran, Zellplasma, einen Zellkern, eine große Vakuole und grüne Chloroplasten.",
        build(s) {
          const sv = s.svg(1100, 600);
          const { g, el } = plantCell(s, 40, 70, 560, 400);
          sv.append(g);
          const order = ["wall", "membrane", "plasma", "nucleus", "vacuole", "chloro"];
          order.forEach(k => el[k].classList.add("later"));
          const info = {
            wall: ["Zellwand", "feste Hülle, gibt Form", [597, 100]],
            membrane: ["Zellmembran", "dünne Haut, lässt Stoffe hinein und hinaus", [589, 170]],
            plasma: ["Zellplasma", "flüssiges Inneres", [555, 260]],
            nucleus: ["Zellkern", "Steuerzentrale der Zelle", [150, 262]],
            vacuole: ["Vakuole", "großer Speicher für Zellsaft", [480, 368]],
            chloro: ["Chloroplasten", "grün, machen mit Licht Nährstoffe", [533, 414]],
          };
          const ys = [80, 170, 260, 350, 440, 530];
          const labs = order.map((k, i) => {
            const [n, d, [px, py]] = info[k];
            const y = ys[i];
            const line = s.el("line", { x1: 680, y1: y, x2: px, y2: py, stroke: "#a21caf", "stroke-width": 2.5, class: "later" });
            const dot = s.el("circle", { cx: px, cy: py, r: 6, fill: "#a21caf", class: "later" });
            const t = s.el("text", { x: 692, y: y + 2, class: "lbl later", style: { fontWeight: 700, fontSize: "24px" }, text: n });
            const t2 = s.el("text", { x: 692, y: y + 30, class: "lbl later", style: { fontSize: "19px", fill: "#5d6678", fontWeight: 400 }, text: d });
            sv.append(line, dot, t, t2);
            return { line, dot, t, t2 };
          });
          const cap = s.el("text", { x: 320, y: 530, "text-anchor": "middle", class: "hlbl later", text: "z. B. aus einem Blatt der Wasserpest" });
          sv.append(cap);
          s.add(s.h("div", { class: "center", style: { height: "100%" } }, sv));
          s.sfx.pop();
          order.forEach((k, i) => s.step(async () => {
            s.sfx.note(i * 2, .2); await s.show(el[k], k === "wall" || k === "membrane" ? "fade" : "pop");
            await s.show(labs[i].line, "draw"); s.show(labs[i].dot, "pop"); s.show([labs[i].t, labs[i].t2], "fade");
            if (i === order.length - 1) s.show(cap, "fade");
          }));
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Die Tierzelle",
        say: "Auch Menschen und Tiere bestehen aus Zellen. Eine Zelle aus der Mundschleimhaut hat Zellmembran, Zellplasma und Zellkern, aber keine Zellwand.",
        build(s) {
          const sv = s.svg(560, 460);
          const shape = "M120 120 C 200 40, 380 60, 450 140 C 520 220, 470 360, 360 400 C 250 440, 110 400, 80 300 C 55 220, 70 160, 120 120 Z";
          const mem = s.el("path", { d: shape, fill: "#fde7ef", stroke: "#7b4fd6", "stroke-width": 4, class: "later" });
          const plasma = s.el("path", { d: shape, fill: "#fbe0ea", transform: "translate(28 23) scale(0.9)", class: "later" });
          const nuc = s.el("g", { class: "later" }, s.el("circle", { cx: 270, cy: 240, r: 42, fill: "#9a7fe0", stroke: "#5b3fb0", "stroke-width": 3 }), s.el("circle", { cx: 282, cy: 232, r: 12, fill: "#5b3fb0" }));
          sv.append(mem, plasma, nuc);
          const L = [["Zellmembran", 455, 140, 470, 70], ["Zellplasma", 160, 330, 120, 440], ["Zellkern", 300, 270, 380, 440]].map(([t, x1, y1, x2, y2]) => {
            const l = s.el("line", { x1, y1, x2, y2: y2 > 200 ? y2 - 24 : y2 + 8, stroke: "#a21caf", "stroke-width": 2.5, class: "later" });
            const tx = s.el("text", { x: x2, y: y2, "text-anchor": "middle", class: "lbl later", style: { fontWeight: 700 }, text: t });
            sv.append(l, tx); return [l, tx];
          });
          const miss = ["Zellwand", "Chloroplasten", "große Vakuole"].map(t => s.h("div", { class: "row later", style: { gap: "12px", flexWrap: "nowrap" } }, s.h("span", { class: "big red", style: { width: "36px" } }, "✗"), s.h("span", { class: "t" }, t)));
          const how = exb(s, "So siehst du sie", s.h("p", { class: "small" }, "Mit einem sauberen Wattestäbchen sanft innen an der Wange schaben, in einen Wassertropfen tupfen und mit Methylenblau färben."));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "560px 1fr", gap: "24px", alignItems: "center", height: "100%" } }, sv,
            s.h("div", { class: "stack", style: { gap: "10px" } }, s.h("p", { class: "h2" }, "Das fehlt der Tierzelle:"), ...miss, how)));
          s.sfx.pop(); s.show(mem, "pop"); s.show(L[0], "fade");
          s.step(async () => { s.sfx.pop(); await s.show(plasma, "fade"); s.show(L[1], "fade"); s.sfx.pop(); await s.show(nuc, "pop"); s.show(L[2], "fade"); });
          s.step(async () => { for (const m of miss) { s.sfx.error(); await s.show(m, "left"); } });
          s.step(async () => { s.sfx.ding(); await s.show(how, "up"); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Pflanzenzelle oder Tierzelle?",
        say: "Beide Zellen haben Zellmembran, Zellplasma und Zellkern. Nur Pflanzenzellen haben Zellwand, große Vakuole und oft Chloroplasten.",
        build(s) {
          const rows = [["Zellmembran", true, true], ["Zellplasma", true, true], ["Zellkern", true, true], ["Zellwand", true, false], ["große Vakuole", true, false], ["Chloroplasten", "oft", false]];
          const mk = v => s.h("td", { class: "later", style: { textAlign: "center", fontSize: "30px", fontWeight: 800, color: v ? "var(--green)" : "var(--red)", padding: "6px 12px" } }, v === "oft" ? "✓ (oft)" : v ? "✓" : "✗");
          const trs = rows.map(([n, p, t]) => { const c1 = mk(p), c2 = mk(t); return { tr: s.h("tr", null, s.h("td", { class: "t", style: { padding: "6px 14px", fontWeight: 700 } }, n), c1, c2), c: [c1, c2] }; });
          const table = s.h("table", { style: { borderCollapse: "collapse", background: "#fff", borderRadius: "16px", border: "2px solid var(--line)" } },
            s.h("tr", null, s.h("th", { class: "t", style: { padding: "10px 14px", textAlign: "left" } }, ""), s.h("th", { class: "t", style: { padding: "10px 14px", color: "var(--green)" } }, "Pflanzenzelle"), s.h("th", { class: "t", style: { padding: "10px 14px", color: "#b5476d" } }, "Tierzelle")),
            ...trs.map(r => r.tr));
          const exs = [
            exb(s, "Zwiebelhaut", s.h("p", { class: "small" }, "Pflanzenzellen mit Zellwand – aber ohne Chloroplasten. Die Haut ist darum nicht grün.")),
            exb(s, "Wasserpest-Blatt", s.h("p", { class: "small" }, "Viele grüne Chloroplasten. Damit macht die Pflanze aus Licht Nährstoffe.")),
            life(s, "Deine Wange", s.h("p", { class: "small" }, "Mundschleimhautzellen: weich und rundlich, ohne feste Zellwand.")),
          ];
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "560px 1fr", gap: "24px", alignItems: "center", height: "100%" } }, table,
            s.h("div", { class: "stack", style: { gap: "12px" } }, ...exs)));
          s.sfx.pop();
          s.step(async () => { for (const r of trs.slice(0, 3)) { s.sfx.ding(); await s.show(r.c, "pop"); } });
          s.step(async () => { for (const r of trs.slice(3)) { s.sfx.pop(); await s.show(r.c[0], "pop"); s.sfx.error(); await s.show(r.c[1], "pop"); } });
          s.step(async () => { for (const e of exs) { s.sfx.pop(); await s.show(e, "up"); } });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Einzeller und Vielzeller",
        say: "Ein Pantoffeltierchen besteht aus einer einzigen Zelle. Es schwimmt mit winzigen Wimpern durch den Teich. Du dagegen bist ein Vielzeller.",
        build(s) {
          const W = 520, H = 440;
          const { canvas, g } = s.canvas(W, H);
          let px = 260, py = 220, ang = 0;
          const draw = t => {
            g.fillStyle = "#dff1f7"; g.fillRect(0, 0, W, H);
            g.fillStyle = "rgba(75,143,216,.12)"; for (let i = 0; i < 18; i++) { g.beginPath(); g.arc((i * 97 + t * 12) % W, (i * 53) % H, 6 + (i % 4) * 3, 0, TAU); g.fill(); }
            // bacteria as food
            g.fillStyle = "#57c08d"; for (let i = 0; i < 12; i++) { const bx = (i * 131 + 40) % W, by = (i * 77 + 30) % H; g.save(); g.translate(bx, by); g.rotate(i); g.fillRect(-5, -2, 10, 4); g.restore(); }
            px = 260 + Math.cos(t * 0.4) * 120; py = 220 + Math.sin(t * 0.8) * 70;
            ang = Math.atan2(Math.cos(t * 0.8) * 0.8 * 70, -Math.sin(t * 0.4) * 0.4 * 120);
            g.save(); g.translate(px, py); g.rotate(ang);
            g.strokeStyle = "#5b6f2a"; g.lineWidth = 1.5;
            for (let i = 0; i < 46; i++) { const a = i / 46 * TAU; const ex = Math.cos(a) * 110, ey = Math.sin(a) * 42; const w = Math.sin(t * 12 + i) * 5; g.beginPath(); g.moveTo(ex, ey); g.lineTo(ex * 1.1 + w, ey * 1.25); g.stroke(); }
            g.fillStyle = "#d9e8a6"; g.strokeStyle = "#5b6f2a"; g.lineWidth = 3;
            g.beginPath(); g.ellipse(0, 0, 110, 42, 0, 0, TAU); g.fill(); g.stroke();
            g.fillStyle = "#b9d07a"; g.beginPath(); g.ellipse(10, 6, 30, 16, 0, 0, TAU); g.fill();
            g.fillStyle = "#7b4fd6"; g.beginPath(); g.ellipse(-8, -6, 22, 14, 0, 0, TAU); g.fill();
            g.fillStyle = "#c9e3f5"; g.beginPath(); g.arc(-70, 0, 12 + Math.sin(t * 3) * 4, 0, TAU); g.fill(); g.beginPath(); g.arc(70, 0, 12 + Math.cos(t * 3) * 4, 0, TAU); g.fill();
            g.restore();
          };
          s.loop(t => draw(t)); draw(0);
          const facts = s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, "Pantoffeltierchen – ein Einzeller"),
            s.h("p", { class: "small" }, "Nur eine Zelle, 0,1 bis 0,3 mm lang. Lebt im Süßwasser, zum Beispiel im Teich oder in einer Pfütze. Es schwimmt mit Wimpern und frisst Bakterien."));
          const bac = s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, "Bakterien – auch Einzeller"), s.h("p", { class: "small" }, "Viel kleiner: meist nur 0,5 bis 5 µm. Die grünen Stäbchen im Bild sind stark vergrößert."));
          const viel = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, s.h("b", null, "Vielzeller"), " bestehen aus sehr vielen Zellen, die zusammenarbeiten: du, ein Baum, eine Ameise, ein Hund.");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "520px 1fr", gap: "24px", alignItems: "center", height: "100%" } }, canvas,
            s.h("div", { class: "stack", style: { gap: "14px" } }, facts, bac, viel)));
          s.show(canvas, "fade"); s.sfx.pop();
          s.step(async () => { s.sfx.boing(); await s.show(facts, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(bac, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(viel, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Im Alltag: winzige Dinge",
        say: "Bakterien sind so klein, dass du sie nicht siehst. Darum Hände waschen: mit Seife, 20 bis 30 Sekunden lang.",
        build(s) {
          const ring = s.svg(220, 220);
          ring.append(s.el("circle", { cx: 110, cy: 110, r: 92, fill: "#fff", stroke: "#e4ecfb", "stroke-width": 18 }));
          const arc = s.el("circle", { cx: 110, cy: 110, r: 92, fill: "none", stroke: "#a21caf", "stroke-width": 18, "stroke-dasharray": `0 ${TAU * 92}`, transform: "rotate(-90 110 110)", "stroke-linecap": "round" });
          const num = s.el("text", { x: 110, y: 126, "text-anchor": "middle", "font-size": 52, "font-weight": 800, fill: "#a21caf", text: "0" });
          const sec = s.el("text", { x: 110, y: 160, "text-anchor": "middle", class: "lbl", style: { fontSize: "19px" }, text: "Sekunden" });
          ring.append(arc, num, sec);
          const wash = async () => {
            s.sfx.whoosh(); let last = -1;
            await s.tween({ from: 0, to: 20, dur: 20000, ease: "linear", update: v => { arc.setAttribute("stroke-dasharray", `${TAU * 92 * v / 20} ${TAU * 92}`); const n = Math.floor(v); if (n !== last) { last = n; num.textContent = String(n); s.sfx.tick(); } } });
            num.textContent = "20"; s.sfx.success(); s.confetti(300, 300, 60);
          };
          const btn = s.h("button", { class: "btn solid", style: { alignSelf: "flex-start" }, onclick: wash }, "Händewasch-Uhr starten");
          const handCard = s.h("div", { class: "life row", style: { flexWrap: "nowrap", gap: "18px", alignItems: "center" } }, ring,
            s.h("div", { class: "stack", style: { gap: "10px" } }, s.h("span", { class: "exlabel" }, "Hände waschen"),
              s.h("p", { class: "small" }, "Bakterien (etwa 1–2 µm) siehst du nicht. Mit Seife 20 bis 30 Sekunden einseifen – so lange wie zweimal „Happy Birthday“."), btn));
          const cards = [
            exb(s, "Salz unter der Lupe", s.h("p", { class: "small" }, "Jedes Salzkorn ist ein kleiner Würfel – ein Kristall.")),
            exb(s, "Zwiebel und Blatt", s.h("p", { class: "small" }, "Unter dem Mikroskop siehst du die Zellen wie Pflastersteine.")),
            exb(s, "Handy-Kamera", s.h("p", { class: "small" }, "Mit Zoom wird die Kugel vom Fernsehturm groß – das ist Vergrößern.")),
          ];
          s.add(s.h("div", { class: "stack", style: { gap: "16px", height: "100%", justifyContent: "center" } }, handCard, s.h("div", { class: "cols3", style: { gap: "16px" } }, ...cards)));
          s.show(handCard, "up"); s.sfx.pop();
          s.step(async () => { s.sfx.pop(); await s.show(cards[0], "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(cards[1], "up"); });
          s.step(async () => { s.sfx.success(); await s.show(cards[2], "up"); });
        },
      },
    ],
  });
})();
