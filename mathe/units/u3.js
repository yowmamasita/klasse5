/* Kapitel 3 – Geraden und Winkel (Berliner Rahmenlehrplan, Niveau C–D): Linien, Geodreieck, Winkel, Winkel an Geradenkreuzungen (Ausblick Kl. 6), Dreiecksarten, Winkelsumme, Zirkel */
(() => {
  "use strict";
  const U = "#7b4fd6", INK = "#1b2740", BLUE = "#1d5bd0", RED = "#dc3b2a", GREEN = "#138a5a", ORANGE = "#ee7a1a", PENCIL = "#5d6678", SOFT = "#ece5fb";
  const D2R = Math.PI / 180;
  const P = pts => pts.map(p => (+p[0]).toFixed(1) + "," + (+p[1]).toFixed(1)).join(" ");
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ln = (s, x1, y1, x2, y2, o) => s.el("line", Object.assign({ x1, y1, x2, y2, stroke: INK, "stroke-width": 4, "stroke-linecap": "round" }, o || {}));
  const tx = (s, x, y, t, o) => { const e = s.el("text", Object.assign({ x, y, "text-anchor": "middle", class: "lbl", text: t }, o || {})); if (o && o.fill) e.style.fill = o.fill; return e; };
  const pg = (s, pts, o) => s.el("polygon", Object.assign({ points: P(pts), fill: "none", stroke: INK, "stroke-width": 4, "stroke-linejoin": "round" }, o || {}));
  const pth = (s, d, o) => s.el("path", Object.assign({ d, fill: "none", stroke: INK, "stroke-width": 4, "stroke-linejoin": "round", "stroke-linecap": "round" }, o || {}));
  const setL = (l, x1, y1, x2, y2) => { l.setAttribute("x1", x1); l.setAttribute("y1", y1); l.setAttribute("x2", x2); l.setAttribute("y2", y2); };
  const undraw = el => { el.classList.remove("a-draw"); };
  /* show a chosen part of a photo (view = [x, y, w, h] in image pixels) with an SVG overlay in image pixel coordinates */
  function viewFig(s, fig, iw, ih, view, W) {
    const sc = W / view[2], img = fig.querySelector("img");
    img.style.visibility = "hidden";   // the visible picture is the figure background (keeps the box free of overflow)
    Object.assign(fig.style, { backgroundImage: `url("${img.getAttribute("src")}")`, backgroundRepeat: "no-repeat", backgroundSize: `${iw * sc}px ${ih * sc}px`, backgroundPosition: `${-view[0] * sc}px ${-view[1] * sc}px` });
    const ov = s.svg(view[2], view[3]);
    ov.setAttribute("viewBox", view.join(" "));
    Object.assign(ov.style, { position: "absolute", left: 0, top: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" });
    img.after(ov);
    return { ov, k: 1 / sc };
  }
  const box = (s, w, h) => { const svg = s.svg(w, h); svg.append(s.el("rect", { x: 0, y: 0, width: w, height: h, rx: 16, fill: "#fff", stroke: "#ddd5f0", "stroke-width": 2 })); return svg; };
  /** arc / sector path around (cx,cy), angles in degrees, counter-clockwise on screen */
  const arcD = (cx, cy, r, a0, a1, sector) => {
    const big = Math.abs(a1 - a0) > 180 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0 * D2R), y0 = cy - r * Math.sin(a0 * D2R), x1 = cx + r * Math.cos(a1 * D2R), y1 = cy - r * Math.sin(a1 * D2R);
    return (sector ? `M${cx},${cy} L${x0},${y0}` : `M${x0},${y0}`) + ` A${r},${r} 0 ${big} ${a1 > a0 ? 0 : 1} ${x1},${y1}` + (sector ? " Z" : "");
  };
  const kindOf = a => a <= 0.0001 ? "Nullwinkel" : a < 90 ? "spitz" : a === 90 ? "recht" : a < 180 ? "stumpf" : a === 180 ? "gestreckt" : a < 360 ? "überstumpf" : "Vollwinkel";
  const kindName = k => ({ spitz: "spitzer Winkel", recht: "rechter Winkel", stumpf: "stumpfer Winkel", gestreckt: "gestreckter Winkel", "überstumpf": "überstumpfer Winkel", Vollwinkel: "Vollwinkel", Nullwinkel: "Nullwinkel" })[k];

  const GRK = "'Times New Roman', Georgia, 'STIX Two Text', serif";
  const gk = str => str.replace(/[αβγδ]/g, m => `<span style="font-family:${GRK};font-style:italic;font-weight:700">${m}</span>`);
  const grk = el => { el.style.fontFamily = GRK; el.style.fontStyle = "italic"; return el; };
  const svgGk = (s, el, str) => { el.textContent = ""; str.split(/([αβγδ])/).forEach(part => { if (!part) return; if (/[αβγδ]/.test(part)) el.append(s.el("tspan", { style: { fontFamily: GRK, fontStyle: "italic" }, text: part })); else el.append(document.createTextNode(part)); }); };
  /** the parallel sign ∥ drawn with CSS (the glyph is missing in the deck fonts) */
  const parSign = s => s.h("span", { style: { display: "inline-block", width: "0.34em", height: "0.78em", borderLeft: "0.09em solid currentColor", borderRight: "0.09em solid currentColor", margin: "0 0.14em", verticalAlign: "-0.04em" } });

  /* ---------- animated pencil ---------- */
  function makePen(s) {
    const g = s.el("g", { class: "later", "pointer-events": "none" });
    const r = s.el("g", { transform: "rotate(30)" });
    r.append(
      s.el("rect", { x: -8, y: -118, width: 16, height: 13, rx: 4, fill: "#f08da0" }),
      s.el("rect", { x: -8, y: -106, width: 16, height: 10, fill: "#c3c9d4" }),
      s.el("rect", { x: -8, y: -96, width: 16, height: 76, fill: "#ffc93c", stroke: "#b07d12", "stroke-width": 1.5 }),
      s.el("polygon", { points: "0,0 -8,-20 8,-20", fill: "#f5d3a1", stroke: "#8a5a2b", "stroke-width": 1.5 }),
      s.el("polygon", { points: "0,0 -3,-7.5 3,-7.5", fill: INK }));
    g.append(r);
    let x = 0, y = 0, last = 0;
    const put = (nx, ny) => { x = nx; y = ny; g.setAttribute("transform", `translate(${nx.toFixed(1)},${ny.toFixed(1)})`); };
    const scrib = () => { const n = performance.now(); if (n - last > 240) { last = n; s.sfx.scribble(); } };
    put(0, 0);
    const pen = {
      g, put,
      show() { g.classList.remove("later"); },
      hide() { g.classList.add("later"); },
      async move(nx, ny, dur = 320) { pen.show(); const x0 = x, y0 = y; await s.tween({ dur, update: v => put(x0 + (nx - x0) * v, y0 + (ny - y0) * v) }); },
      async line(el, x1, y1, x2, y2, dur = 600) {
        await pen.move(x1, y1);
        setL(el, x1, y1, x1, y1); el.classList.remove("later");
        await s.tween({ dur, ease: "inOut", update: v => { const px = x1 + (x2 - x1) * v, py = y1 + (y2 - y1) * v; el.setAttribute("x2", px); el.setAttribute("y2", py); put(px, py); scrib(); } });
      },
    };
    return pen;
  }

  /* ---------- Geodreieck (origin = Nullpunkt, long edge on the x axis, body above) ---------- */
  function geodreieck(s, L, o = {}) {
    const g = s.el("g", { "pointer-events": "none" }), h = L / 2, cm = L / 16, parts = {};
    g.append(pg(s, [[-h, 0], [h, 0], [0, -h]], { fill: "rgba(214,234,248,.84)", stroke: "#4f7592", "stroke-width": 2.5 }));
    const hl = s.el("g");
    for (let k = 1; k * cm < h - cm * 0.8; k++) { const y = -k * cm, w = h - k * cm - 5; hl.append(ln(s, -w, y, w, y, { stroke: "#8fb2cc", "stroke-width": 1.2, "stroke-linecap": "butt" })); }
    g.append(hl); parts.hilfs = hl;
    parts.mitte = ln(s, 0, 0, 0, -h + 8, { stroke: "#2c4a63", "stroke-width": 2.2 }); g.append(parts.mitte);
    const sc = s.el("g");
    for (let i = -70; i <= 70; i += 5) { const x = i * cm / 10, big = i % 10 === 0; sc.append(ln(s, x, 0, x, big ? -14 : -8, { stroke: "#2c4a63", "stroke-width": big ? 1.8 : 1.1, "stroke-linecap": "butt" })); }
    if (o.cmNums) for (let k = 1; k <= 7; k++) for (const sg of [-1, 1]) sc.append(tx(s, sg * k * cm, -22, String(k), { fill: "#2c4a63", style: { fontSize: "19px" } }));
    g.append(sc); parts.scale = sc;
    if (o.angles) {
      const ring = s.el("g"), R1 = 0.30 * L;
      for (let a = 0; a <= 180; a += 5) { const t = a * D2R, r0 = a % 10 ? 0.285 * L : 0.27 * L; ring.append(ln(s, r0 * Math.cos(t), -r0 * Math.sin(t), R1 * Math.cos(t), -R1 * Math.sin(t), { stroke: "#2c4a63", "stroke-width": a % 10 ? 1 : 1.7, "stroke-linecap": "butt" })); }
      const nums = s.el("g");
      if (o.angleNums) for (let a = 0; a <= 180; a += o.step || 20) {
        if (o.skipEnds && (a === 0 || a === 180)) continue;
        const t = clamp(a, 7, 173) * D2R, ro = 0.235 * L, ri = 0.17 * L;
        nums.append(tx(s, ro * Math.cos(t), -ro * Math.sin(t) + 7, String(a), { fill: BLUE, "font-weight": 700, style: { fontSize: "19px" } }));
        nums.append(tx(s, ri * Math.cos(t), -ri * Math.sin(t) + 7, String(180 - a), { fill: ORANGE, "font-weight": 700, style: { fontSize: "19px" } }));
      }
      ring.append(nums); g.append(ring); parts.ring = ring; parts.nums = nums;
    }
    return { g, parts, L, h, cm };
  }
  /** wrapper that positions a Geodreieck: put(x, y, deg, opacity) */
  function placeable(s, inner) {
    const w = s.el("g"); w.append(inner);
    let st = { x: 0, y: 0, r: 0, o: 1 };
    const put = (x, y, r, o = 1) => { st = { x, y, r, o }; w.setAttribute("transform", `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${r.toFixed(2)})`); w.setAttribute("opacity", o); };
    const go = (x, y, r, o = 1, dur = 900) => { const a = Object.assign({}, st); return s.tween({ dur, update: v => put(a.x + (x - a.x) * v, a.y + (y - a.y) * v, a.r + (r - a.r) * v, a.o + (o - a.o) * v) }); };
    return { w, put, go, get st() { return st; } };
  }
  const stepList = (s, texts, cols) => texts.map((t, i) => s.h("div", { class: "row later", style: { flexWrap: "nowrap", alignItems: "flex-start", gap: "12px" } },
    s.h("span", { style: { flex: "none", width: "38px", height: "38px", borderRadius: "50%", background: (cols && cols[i]) || U, color: "#fff", display: "grid", placeItems: "center", font: "700 21px var(--f-display)" } }, String(i + 1)),
    s.h("p", { class: "small", style: { fontSize: "21px" } }, t)));

  Deck.unit({
    id: "u3", num: 3, title: "Geraden und Winkel", color: U, soft: SOFT,
    subtitle: "Linien, Geodreieck, Winkel und Dreiecke",
    blurb: "Parallel, senkrecht, Winkel messen und zeichnen, Dreiecke.",
    goals: ["Strecke, Strahl und Gerade unterscheiden", "Parallele und senkrechte Geraden erkennen und zeichnen", "Abstand und Lot verstehen", "Winkel benennen, messen und zeichnen", "Ausblick: Neben-, Scheitel-, Stufen- und Wechselwinkel", "Dreiecke nach Seiten und Winkeln ordnen – Winkelsumme 180°", "Mit Geodreieck und Zirkel umgehen"],
    icon(svg, el) {
      svg.append(el("path", { d: "M14,56 L40,56 A26,26 0 0 0 33.4,38.6 Z", fill: "#ece5fb" }),
        el("line", { x1: 14, y1: 56, x2: 62, y2: 56, stroke: U, "stroke-width": 4, "stroke-linecap": "round" }),
        el("line", { x1: 14, y1: 56, x2: 48, y2: 18, stroke: U, "stroke-width": 4, "stroke-linecap": "round" }),
        el("path", { d: "M40,56 A26,26 0 0 0 33.4,38.6", fill: "none", stroke: "#dc3b2a", "stroke-width": 3 }));
    },
    slides: [
      /* 1 ─────────────────────────────── */
      {
        title: "Strecke, Strahl, Gerade",
        say: "Eine Strecke hat Anfang und Ende. Ein Strahl hat nur einen Anfang. Eine Gerade hat weder Anfang noch Ende.",
        build(s) {
          const rows = [];
          const mkRow = (kind) => {
            const svg = box(s, 560, 140);
            const A = [80, 80], B = kind === "strahl" ? [300, 80] : [440, 80];
            const parts = [];
            const pt = (p, n, below) => { const c = s.el("circle", { cx: p[0], cy: p[1], r: 7, fill: U }); const t = tx(s, p[0], below ? p[1] + 36 : p[1] - 18, n, { "font-weight": 700, fill: U }); return [c, t]; };
            let line, arrows = [], extra = [];
            if (kind === "strecke") {
              line = ln(s, A[0], A[1], B[0], B[1], { stroke: BLUE, "stroke-width": 6, class: "later" });
              extra = [tx(s, 260, 124, "Länge messbar: z. B. 9 cm", { fill: PENCIL, style: { fontSize: "19px" }, class: "lbl later" })];
            }
            if (kind === "strahl") {
              line = ln(s, A[0], A[1], 530, 80, { stroke: RED, "stroke-width": 6, class: "later" });
              arrows = [pg(s, [[548, 80], [528, 69], [528, 91]], { fill: RED, stroke: RED, "stroke-width": 2, class: "later" })];
              extra = [tx(s, 420, 124, "… geht immer weiter", { fill: PENCIL, style: { fontSize: "19px" }, class: "lbl later" })];
            }
            if (kind === "gerade") {
              line = ln(s, 30, 80, 530, 80, { stroke: GREEN, "stroke-width": 6, class: "later" });
              arrows = [pg(s, [[548, 80], [528, 69], [528, 91]], { fill: GREEN, stroke: GREEN, "stroke-width": 2, class: "later" }), pg(s, [[12, 80], [32, 69], [32, 91]], { fill: GREEN, stroke: GREEN, "stroke-width": 2, class: "later" })];
              extra = [tx(s, 520, 46, "g", { class: "hlbl later", fill: GREEN })];
            }
            const glow = s.el("circle", { cx: A[0], cy: 80, r: 8, fill: kind === "strahl" ? "#ffd94a" : "none", opacity: 0 });
            parts.push(line, ...arrows, ...pt(A, "A"), ...pt(B, "B"), ...extra, glow);
            svg.append(...parts);
            const names = { strecke: ["Strecke ", s.h("span", { style: { textDecoration: "overline" } }, "AB")], strahl: ["Strahl AB"], gerade: ["Gerade g"] };
            const facts = { strecke: "Hat einen Anfang und ein Ende.", strahl: "Hat einen Anfang, aber kein Ende.", gerade: "Hat weder Anfang noch Ende." };
            const lives = { strecke: "Vom Elfmeterpunkt bis zur Torlinie: genau 11 m.", strahl: "Wie ein Laserstrahl in den Nachthimmel.", gerade: "Denk dir ein schnurgerades Gleis – ohne Ende." };
            const PO = { w: 150, h: 140 };
            const photos = { strecke: () => s.photo("elfmeterpunkt", Object.assign({ pos: "62% 60%" }, PO)), strahl: () => s.photo("laserstrahl", Object.assign({ pos: "55% 30%" }, PO)), gerade: () => s.photo("gleis-gerade", Object.assign({ pos: "50% 70%" }, PO)) };
            const card = s.h("div", { class: "card later", style: { display: "grid", gridTemplateColumns: "560px 150px 1fr", gap: "16px", alignItems: "center", padding: "10px 16px" } }, svg, photos[kind](),
              s.h("div", { class: "stack", style: { gap: "4px" } }, s.h("p", { class: "h2", style: { color: kind === "strecke" ? BLUE : kind === "strahl" ? RED : GREEN } }, ...names[kind]), s.h("p", { class: "t", style: { fontWeight: 700 } }, facts[kind]), s.h("p", { class: "small" }, lives[kind])));
            return { card, line, arrows, extra, glow, kind };
          };
          ["strecke", "strahl", "gerade"].forEach(k => rows.push(mkRow(k)));
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "14px" } }, rows.map(r => r.card)));
          const SND = { strecke: () => s.sound("whistle", { vol: .5 }), strahl: () => s.sfx.zap(), gerade: () => s.sound("ubahn-train", { vol: .4, dur: 3.5 }) };
          const reveal = async r => {
            SND[r.kind](); await s.show(r.card, "left", 0);
            s.sfx.zap(); await s.show(r.line, "draw"); undraw(r.line);
            if (r.arrows.length) { s.sfx.pop(); s.show(r.arrows, "pop"); }
            s.show(r.extra, "fade");
            if (r.kind === "strahl") s.loop(t => { const k = (t % 1.6) / 1.6; r.glow.setAttribute("cx", 80 + k * 470); r.glow.setAttribute("opacity", Math.sin(k * Math.PI)); });
          };
          reveal(rows[0]);
          s.step(async () => { await reveal(rows[1]); s.say("Ein Strahl fängt bei A an und geht durch B immer weiter."); });
          s.step(async () => { await reveal(rows[2]); s.say("Eine Gerade ist in beide Richtungen unendlich lang."); s.sfx.ding(); });
        },
      },
      /* 2 ─────────────────────────────── */
      {
        title: "Parallel oder senkrecht?",
        say: "Dreh die Gerade h. Wenn sie g nie trifft, sind die Geraden parallel. Bilden sie einen rechten Winkel, sind sie senkrecht.",
        build(s) {
          const svg = box(s, 560, 500);
          const GY = 330, Q = [280, 190];
          let th = 35, lastKind = "";
          const g = ln(s, 20, GY, 540, GY, { stroke: BLUE, "stroke-width": 6 });
          const h = ln(s, 0, 0, 0, 0, { stroke: RED, "stroke-width": 6 });
          const gL = tx(s, 532, GY + 32, "g", { class: "hlbl", fill: BLUE });
          const hL = tx(s, 0, 0, "h", { class: "hlbl", fill: RED });
          const Sd = s.el("circle", { r: 9, fill: U });
          const SL = tx(s, 0, 0, "S", { "font-weight": 700, fill: U, "text-anchor": "end", style: { fontSize: "24px" } });
          const rmark = pth(s, "", { stroke: U, "stroke-width": 3 });
          const arrs = s.el("g");
          [110, 450].forEach(x => arrs.append(ln(s, x, Q[1] + 10, x, GY - 10, { stroke: GREEN, "stroke-width": 3 }), pg(s, [[x, Q[1] + 4], [x - 7, Q[1] + 16], [x + 7, Q[1] + 16]], { fill: GREEN, stroke: GREEN, "stroke-width": 1 }), pg(s, [[x, GY - 4], [x - 7, GY - 16], [x + 7, GY - 16]], { fill: GREEN, stroke: GREEN, "stroke-width": 1 })));
          arrs.append(tx(s, 280, 268, "überall gleicher Abstand", { fill: GREEN, "font-weight": 700, style: { fontSize: "20px" } }));
          svg.append(g, h, arrs, rmark, Sd, SL, gL, hL);
          const status = s.h("p", { class: "big", style: { minHeight: "96px" } });
          const sub = s.h("p", { class: "t pencil", style: { minHeight: "68px" } });
          function render() {
            const t = th * D2R, d = [Math.cos(t), -Math.sin(t)];
            setL(h, Q[0] - 700 * d[0], Q[1] - 700 * d[1], Q[0] + 700 * d[0], Q[1] + 700 * d[1]);
            hL.setAttribute("x", Q[0] + 150 * d[0] - 26 * Math.sin(t)); hL.setAttribute("y", Q[1] + 150 * d[1] - 26 * Math.cos(t) + 8);
            const par = th === 0 || th === 180, perp = th === 90;
            let sx = null;
            if (!par) sx = Q[0] - (GY - Q[1]) * Math.cos(t) / Math.sin(t);
            const vis = sx != null && sx > 30 && sx < 520;
            [Sd, SL].forEach(e => e.setAttribute("visibility", vis ? "visible" : "hidden"));
            if (vis) { Sd.setAttribute("cx", sx); Sd.setAttribute("cy", GY); SL.setAttribute("x", sx - 14); SL.setAttribute("y", GY - 14); }
            rmark.setAttribute("d", perp ? `M${sx + 22},${GY} L${sx + 22},${GY - 22} L${sx},${GY - 22}` : "");
            arrs.setAttribute("visibility", par ? "visible" : "hidden");
            const kind = par ? "par" : perp ? "perp" : "cut";
            status.innerHTML = "";
            if (par) status.append(s.h("span", { style: { color: GREEN } }, "g", parSign(s), "h"), s.h("br"), "parallel");
            else if (perp) status.append(s.h("span", { style: { color: U } }, "g ⊥ h"), s.h("br"), "senkrecht");
            else status.append("g und h", s.h("br"), "schneiden sich in S");
            sub.textContent = par ? "Kein Schnittpunkt – sie treffen sich nie." : perp ? "Sie bilden einen rechten Winkel (90°)." : `Winkel zwischen g und h: ${Math.min(th, 180 - th)}°`;
            if (kind !== lastKind) { if (lastKind) { kind === "cut" ? s.sfx.click() : s.sfx.ding(); } lastKind = kind; status.classList.remove("a-pop"); void status.offsetWidth; status.classList.add("a-pop"); }
          }
          const sl = s.slider({ label: "h drehen", min: 0, max: 180, value: th, fmt: v => v + "°", onInput: v => { th = v; render(); } });
          render();
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, s.h("b", null, "parallel (", parSign(s), "):"), " kein Schnittpunkt, überall gleicher Abstand.", s.h("br"), s.h("b", null, "senkrecht (⊥):"), " Die Geraden bilden einen rechten Winkel.");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "560px 1fr", alignItems: "center", height: "100%" } }, svg, s.h("div", { class: "stack" }, status, sub, sl, merk)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          const turn = async to => { const from = th; await s.tween({ from, to, dur: 1400, update: v => { th = Math.round(v); sl.set(th); } }); th = to; sl.set(to); };
          s.step(async () => { s.say("Senkrecht: ein rechter Winkel."); await turn(90); });
          s.step(async () => { s.say("Parallel: Die Geraden treffen sich nie."); await turn(0); });
          s.step(async () => { s.sfx.success(); await s.show(merk, "up"); });
        },
      },
      /* 3 ─────────────────────────────── */
      {
        title: "Im Alltag: Linien überall",
        say: "Parallele und senkrechte Linien siehst du überall: in Noten, an Gleisen, im U-Bahn-Plan und an Kreuzungen.",
        build(s) {
          const mk = (title, text, chip, draw, extra) => {
            const svg = draw === "photo" ? null : box(s, 230, 180); if (svg) draw(svg);
            const ov = extra(svg);
            const card = s.h("div", { class: "card later", style: { display: "grid", gridTemplateColumns: "230px 1fr", gap: "16px", alignItems: "center", padding: "12px 14px" } }, svg || notes,
              s.h("div", { class: "stack", style: { gap: "6px" } }, s.h("p", { class: "t", style: { fontWeight: 700 } }, title), s.h("span", { class: "chip", style: { alignSelf: "flex-start", background: SOFT, color: U } }, chip), s.h("p", { class: "small" }, text)));
            return { card, ov };
          };
          const notes = s.photo("notenblatt", { w: 230, h: 180 });
          const cards = [
            mk("Notenlinien", "5 Linien, alle parallel. Die Notenhälse stehen senkrecht darauf.", [parSign(s), " und ⊥"], "photo", () => {
              const { ov, k } = viewFig(s, notes, 600, 450, [80, 50, 494, 387], 230);
              const o = [ln(s, 80, 226.7, 574, 243, { stroke: RED, "stroke-width": 3.5 * k, class: "later" }), ln(s, 80, 261, 574, 275, { stroke: RED, "stroke-width": 3.5 * k, class: "later" }), ln(s, 274, 212, 274, 266, { stroke: U, "stroke-width": 6 * k, class: "later" })];
              ov.append(...o); return o;
            }),
            mk("Bahngleise", "Die Schienen sind parallel – 1435 mm Abstand. Die Schwellen liegen senkrecht dazu.", [parSign(s), " und ⊥"], svg => {
              for (let x = 22; x < 220; x += 26) svg.append(s.el("rect", { x, y: 52, width: 12, height: 76, fill: "#a0703f" }));
              svg.append(ln(s, 8, 70, 222, 70, { stroke: "#6b7686", "stroke-width": 7 }), ln(s, 8, 110, 222, 110, { stroke: "#6b7686", "stroke-width": 7 }));
            }, svg => { const o = [ln(s, 8, 70, 222, 70, { stroke: RED, "stroke-width": 4, class: "later" }), ln(s, 8, 110, 222, 110, { stroke: RED, "stroke-width": 4, class: "later" }), ln(s, 106, 46, 106, 134, { stroke: U, "stroke-width": 5, class: "later" })]; svg.append(...o); return o; }),
            mk("U-Bahn-Plan", "Linien laufen parallel oder kreuzen sich. Am Alexanderplatz treffen sich U2, U5 und U8.", "Schnittpunkt", svg => {
              svg.append(pth(s, "M10,58 L120,58 L190,128 L222,128", { stroke: "#da421e", "stroke-width": 7 }), pth(s, "M10,76 L114,76 L170,132", { stroke: "#7e5330", "stroke-width": 7 }), ln(s, 114, 12, 114, 170, { stroke: "#224f86", "stroke-width": 7, "stroke-linecap": "butt" }));
              svg.append(s.el("rect", { x: 100, y: 48, width: 28, height: 38, rx: 9, fill: "#fff", stroke: INK, "stroke-width": 3 }));
            }, svg => { const o = [s.el("circle", { cx: 114, cy: 67, r: 26, fill: "none", stroke: U, "stroke-width": 4, class: "later" }), tx(s, 172, 32, "Alex", { fill: U, "font-weight": 700, class: "lbl later", style: { fontSize: "20px" } })]; svg.append(...o); return o; }),
            mk("Kreuzung in Berlin", "Friedrichstraße und Unter den Linden kreuzen sich fast senkrecht.", "⊥", svg => {
              svg.append(s.el("rect", { x: 0, y: 66, width: 230, height: 50, fill: "#8d96a3" }), s.el("rect", { x: 92, y: 0, width: 48, height: 180, fill: "#8d96a3" }));
              for (let i = 0; i < 5; i++) svg.append(s.el("rect", { x: 94 + i * 9.5, y: 120, width: 5, height: 18, fill: "#fff" }));
              svg.append(ln(s, 6, 91, 84, 91, { stroke: "#fff", "stroke-width": 2, "stroke-dasharray": "10 8" }), ln(s, 148, 91, 226, 91, { stroke: "#fff", "stroke-width": 2, "stroke-dasharray": "10 8" }), ln(s, 116, 6, 116, 58, { stroke: "#fff", "stroke-width": 2, "stroke-dasharray": "10 8" }), ln(s, 116, 146, 116, 176, { stroke: "#fff", "stroke-width": 2, "stroke-dasharray": "10 8" }));
            }, svg => { const o = [pth(s, "M140,44 L162,44 L162,66", { stroke: U, "stroke-width": 4, class: "later" }), tx(s, 186, 160, "90°", { fill: U, "font-weight": 700, class: "lbl later" })]; svg.append(...o); return o; }),
          ];
          s.add(s.h("div", { class: "cols", style: { height: "100%", gap: "16px", alignContent: "center" } }, cards.map(c => c.card)));
          s.show(cards[0].card, "up"); [0, 4, 7, 12].forEach((n, i) => s.sfx.note(n, 0.25)); 
          s.show(cards[0].ov, "draw", 400);
          const snd3 = [() => s.sound("tram-bell", { vol: .45, dur: 2.5 }), () => s.sound("ubahn-announce", { vol: .5, dur: 5 }), () => s.sound("traffic", { vol: .4, dur: 3 })];
          cards.slice(1).forEach((c, i) => s.step(async () => { snd3[i](); await s.show(c.card, "up"); s.sfx.zap(); c.ov.forEach(o => { if (o.tagName === "text") s.show(o, "pop"); else s.show(o, "draw"); }); s.say(["Bahngleise", "Der U-Bahn-Plan", "Eine Kreuzung"][i]); }));
        },
      },
      /* 4 ─────────────────────────────── */
      {
        title: "Lot und Abstand",
        say: "Welcher Weg von P zur Geraden g ist am kürzesten? Der senkrechte! Diese Strecke heißt Lot.",
        build(s) {
          const svg = box(s, 600, 500), GY = 420, Pp = [300, 120], PX = 40;
          let qx = 80;
          const g = ln(s, 20, GY, 580, GY, { stroke: BLUE, "stroke-width": 6 });
          const gL = tx(s, 40, GY - 16, "g", { class: "hlbl", fill: BLUE });
          const QL = tx(s, qx, GY + 44, "Q", { "font-weight": 700, fill: ORANGE, style: { fontSize: "24px" } });
          const seg = ln(s, Pp[0], Pp[1], qx, GY, { stroke: ORANGE, "stroke-width": 4, "stroke-dasharray": "12 8" });
          const lot = ln(s, Pp[0], Pp[1], Pp[0], GY, { stroke: RED, "stroke-width": 6, class: "later" });
          const rm = pth(s, `M${Pp[0] + 24},${GY} L${Pp[0] + 24},${GY - 24} L${Pp[0]},${GY - 24}`, { stroke: RED, "stroke-width": 3, class: "later" });
          const lotL = tx(s, Pp[0] + 16, 270, "Lot", { class: "hlbl later", fill: RED, "text-anchor": "start" });
          const fL = tx(s, Pp[0] - 22, GY + 34, "F", { "font-weight": 700, fill: RED, class: "lbl later", "text-anchor": "end" });
          const Pd = s.el("circle", { cx: Pp[0], cy: Pp[1], r: 9, fill: U });
          const PL = tx(s, Pp[0] - 18, Pp[1] - 14, "P", { "font-weight": 700, fill: U, "text-anchor": "end", style: { fontSize: "26px" } });
          const Qd = s.el("circle", { cx: qx, cy: GY, r: 14, fill: ORANGE, stroke: "#fff", "stroke-width": 3 });
          const Qh = s.el("circle", { cx: qx, cy: GY, r: 32, fill: "transparent" });
          svg.append(g, gL, seg, lot, rm, lotL, fL, Pd, PL, QL, Qd, Qh);
          const big = s.h("p", { class: "h2 mono" });
          const status = s.h("p", { class: "t", style: { minHeight: "68px" } });
          let wasMin = false;
          function render() {
            seg.setAttribute("x2", qx); Qd.setAttribute("cx", qx); QL.setAttribute("x", qx); Qh.setAttribute("cx", qx);
            const d = Math.hypot(qx - Pp[0], GY - Pp[1]) / PX, isMin = Math.abs(qx - Pp[0]) < 1;
            big.textContent = "Weg von P nach Q: " + s.fmt(d, 1) + "\u00a0cm";
            status.innerHTML = "";
            if (isMin) status.append(s.h("b", { class: "green" }, "Kürzester Weg! "), "Er steht senkrecht auf g.");
            else status.append("Schräg ist der Weg länger.");
            if (isMin && !wasMin) s.sfx.ding();
            wasMin = isMin;
          }
          const sl = s.slider({ label: "Punkt Q verschieben", min: 40, max: 560, step: 4, value: qx, fmt: () => "", onInput: v => { qx = Math.abs(v - Pp[0]) <= 6 ? Pp[0] : v; render(); } });
          s.drag(Qh, { space: svg, onMove: p => { let x = clamp(Math.round(p.x), 40, 560); if (Math.abs(x - Pp[0]) <= 8) x = Pp[0]; if (x !== qx) { qx = x; sl.input.value = x; render(); s.sfx.tick(); } } });
          render();
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Der ", s.h("b", null, "Abstand"), " eines Punktes von einer Geraden ist die Länge des ", s.h("b", null, "Lots"), " – des senkrechten, kürzesten Weges.");
          const life = s.h("div", { class: "life later", style: { padding: "10px 16px", display: "flex", gap: "14px", alignItems: "center" } },
            s.photo("senklot", { w: 120, h: 170, pos: "50% 40%", style: { flex: "none" } }),
            s.h("div", { class: "stack", style: { gap: "8px" } }, s.h("p", { class: "small" }, "Ein Lot (Senkblei) an der Schnur hängt immer genau senkrecht nach unten. Damit prüfen Maurer, ob eine Wand gerade steht."), s.h("p", { class: "small" }, "Wer senkrecht über die Straße geht, ist am schnellsten drüben.")));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "600px 1fr", alignItems: "center", height: "100%", gap: "24px" } }, svg, s.h("div", { class: "stack", style: { gap: "12px" } }, big, sl, status, merk, life)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          const moveQ = (to, dur) => s.tween({ from: qx, to, dur, update: v => { qx = Math.round(v); sl.input.value = qx; render(); } });
          s.step(async () => { s.say("Schau auf die Zahl: Wann ist der Weg am kürzesten?"); await moveQ(540, 2200); await moveQ(300, 1300); qx = 300; render(); });
          s.step(async () => { s.sfx.zap(); await s.show(lot, "draw"); undraw(lot); s.sfx.pop(); s.show([rm, lotL, fL], "pop"); s.say("Das ist das Lot von P auf g. F heißt Lotfußpunkt."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.chord([0, 5, 9]); await s.show(life, "up"); });
        },
      },
      /* 5 ─────────────────────────────── */
      {
        title: "Das Geodreieck",
        say: "Das Geodreieck ist Lineal, Winkelmesser und Helfer für Parallelen und Senkrechte – alles in einem.",
        build(s) {
          const svg = s.svg(1100, 440);
          const GD = geodreieck(s, 640, { cmNums: true, angles: true, angleNums: true, step: 30, skipEnds: true });
          const pl = placeable(s, GD.g); pl.put(550, 420, 0);
          svg.append(pl.w);
          const hi = s.el("g");
          const parts = [
            { t: ["Nullpunkt"], tx: 20, ty: 412, col: RED, at: [548, 418], ov: s.el("circle", { cx: 550, cy: 420, r: 12, fill: "none", stroke: RED, "stroke-width": 4, class: "later" }), say: "In der Mitte der langen Kante liegt der Nullpunkt." },
            { t: ["cm-Skala", "(Lineal)"], tx: 900, ty: 386, col: BLUE, at: [800, 410], ov: ln(s, 270, 420, 830, 420, { stroke: BLUE, "stroke-width": 6, class: "later" }), say: "Die lange Kante ist ein Lineal mit Zentimetern – von der Mitte aus nach links und rechts." },
            { t: ["Mittellinie"], tx: 20, ty: 70, col: GREEN, at: [548, 150], ov: ln(s, 550, 420, 550, 108, { stroke: GREEN, "stroke-width": 5, class: "later" }), say: "Die Mittellinie steht senkrecht auf der langen Kante." },
            { t: ["Hilfslinien", "(parallel zur", "langen Kante)"], tx: 900, ty: 60, col: ORANGE, at: [622, 180], ov: ln(s, 480, 180, 620, 180, { stroke: ORANGE, "stroke-width": 5, class: "later" }), say: "Die Hilfslinien sind parallel zur langen Kante." },
            { t: ["Winkelskalen:", "zwei Richtungen!"], tx: 20, ty: 250, col: U, at: [400, 300], ov: pth(s, arcD(550, 420, 0.30 * 640 + 4, 0, 180), { stroke: U, "stroke-width": 5, class: "later" }), say: "Die Winkelskalen laufen in zwei Richtungen: einmal von rechts, einmal von links." },
          ];
          parts.forEach(p => {
            const tg = s.el("g", { class: "later" });
            p.t.forEach((line, i) => tg.append(tx(s, p.tx, p.ty + i * 26, line, { "text-anchor": "start", "font-weight": 700, fill: p.col, style: { fontSize: i ? "20px" : "23px" } })));
            const ex = p.tx < 500 ? p.tx + (p.t[0].length * 12 + 10) : p.tx - 12;
            const lead = ln(s, ex, p.ty - 7, p.at[0], p.at[1], { stroke: p.col, "stroke-width": 2.5, "stroke-dasharray": "6 5", class: "later" });
            hi.append(p.ov, lead, tg); p.tg = tg; p.lead = lead;
          });
          svg.append(hi);
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px", flex: 1 } }, "Mit dem Geodreieck kannst du ", s.h("b", null, "messen"), " (Längen und Winkel) und ", s.h("b", null, "zeichnen"), " (Parallelen und Senkrechte). Es ist 16 cm lang.");
          const real = s.photo("geodreieck-foto", { w: 290, h: 178, caption: "So sieht es in echt aus", cls: "later" });
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "14px" } }, svg, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "18px", alignItems: "center" } }, merk, real)));
          s.sfx.whoosh(); pl.put(550, 700, 0, 0); pl.go(550, 420, 0, 1, 900);
          parts.forEach(p => s.step(async () => { s.sfx.zap(); s.show(p.ov, p.ov.tagName === "circle" ? "pop" : "draw"); await s.show(p.lead, "fade"); s.sfx.pop(); await s.show(p.tg, "fade"); s.say(p.say); }));
          s.step(async () => { s.sound("pencil-write", { vol: .5 }); await s.show(merk, "up"); await s.show(real, "zoom"); });
        },
      },
      /* 6 ─────────────────────────────── */
      {
        title: "Senkrechte zeichnen",
        say: "So zeichnest du mit dem Geodreieck eine Senkrechte zu g durch den Punkt P.",
        build(s) {
          const svg = box(s, 620, 520);
          const phi = 12 * D2R, u = [Math.cos(phi), -Math.sin(phi)], n = [u[1], -u[0]];
          const G0 = [60, 380], at = (p, a, v, b, w) => [p[0] + a * v[0] + (b || 0) * (w ? w[0] : 0), p[1] + a * v[1] + (b || 0) * (w ? w[1] : 0)];
          const F = at(G0, 300, u), Pp = at(F, 170, n);
          const rho = Math.atan2(u[0], -u[1]) / D2R;
          const gA = at(G0, -40, u), gB = at(G0, 560, u);
          svg.append(ln(s, gA[0], gA[1], gB[0], gB[1], { stroke: BLUE, "stroke-width": 5 }), tx(s, gB[0] - 10, gB[1] + 34, "g", { class: "hlbl", fill: BLUE }));
          const hLine = ln(s, 0, 0, 0, 0, { stroke: RED, "stroke-width": 5, class: "later" });
          const GD = geodreieck(s, 380, {}), pl = placeable(s, GD.g);
          const rm = pth(s, `M${at(F, 22, u)[0]},${at(F, 22, u)[1]} L${at(F, 22, u, 22, n)[0]},${at(F, 22, u, 22, n)[1]} L${at(F, 22, n)[0]},${at(F, 22, n)[1]}`, { stroke: U, "stroke-width": 3.5, class: "later" });
          const hEnd = at(F, -150, n);
          const hL = tx(s, hEnd[0] - 20, hEnd[1] + 6, "h", { class: "hlbl later", fill: RED, "text-anchor": "end" });
          const fL = tx(s, F[0] - 16, F[1] + 34, "F", { "font-weight": 700, fill: U, class: "lbl later", "text-anchor": "end" });
          const Pd = s.el("circle", { cx: Pp[0], cy: Pp[1], r: 8, fill: U }), PL = tx(s, Pp[0] - 18, Pp[1] + 8, "P", { "font-weight": 700, fill: U, "text-anchor": "end", style: { fontSize: "26px" } });
          const done = tx(s, 470, 120, "g ⊥ h", { class: "lbl later", fill: U, "font-weight": 700, style: { fontSize: "34px" } });
          const pen = makePen(s);
          svg.append(hLine, pl.w, rm, Pd, PL, hL, fL, done, pen.g);
          pl.put(F[0] + 260, F[1] - 300, rho, 0); pen.put(660, 40);
          const items = stepList(s, ["Lege die Mittellinie des Geodreiecks genau auf g.", "Verschiebe es an g entlang, bis die lange Kante durch P geht.", "Zeichne an der langen Kante entlang.", "Fertig: h steht senkrecht auf g. Rechter Winkel!"]);
          let busy = false;
          const S1 = async () => { s.sfx.whoosh(); const A1 = at(F, 110, u); await pl.go(A1[0], A1[1], rho, 1, 1000); s.sfx.snap(); };
          const S2 = async () => { s.sfx.swoosh(); await pl.go(F[0], F[1], rho, 1, 900); s.sfx.ding(); };
          const S3 = async () => { const a = at(F, 185, n); s.sound("pencil-write", { vol: .5 }); await pen.line(hLine, a[0], a[1], hEnd[0], hEnd[1], 1100); };
          const S4 = async () => { s.sfx.whoosh(); pen.move(660, 40, 400); await pl.go(F[0] + 300, F[1] - 260, rho, 0, 700); s.sfx.pop(); s.show([rm, fL, hL], "pop"); s.sfx.success(); await s.show(done, "pop"); };
          const again = async () => {
            if (busy) return; busy = true; s.sfx.click();
            s.hide([hLine, rm, fL, hL, done]); pl.put(F[0] + 260, F[1] - 300, rho, 0);
            for (const f of [S1, S2, S3, S4]) await f();
            busy = false;
          };
          const btn = s.h("button", { class: "btn later", style: { alignSelf: "flex-start" }, onclick: again }, "Nochmal zeigen");
          const life = s.h("div", { class: "life later", style: { padding: "10px 16px" } }, s.h("p", { class: "small" }, s.h("b", null, "Im Alltag: "), "So stehen Torpfosten senkrecht auf der Torlinie und Regalbretter senkrecht zur Wand."));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "620px 1fr", alignItems: "center", height: "100%", gap: "22px" } }, svg, s.h("div", { class: "stack", style: { gap: "12px" } }, ...items, btn, life)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          [S1, S2, S3, S4].forEach((f, i) => s.step(async () => { busy = true; s.show(items[i], "left"); s.say(items[i].textContent.slice(1)); await f(); busy = false; if (i === 3) { s.show(btn, "pop"); s.show(life, "up"); } }));
        },
      },
      /* 7 ─────────────────────────────── */
      {
        title: "Parallele zeichnen",
        say: "So zeichnest du mit dem Geodreieck eine Parallele zu g durch den Punkt P.",
        build(s) {
          const svg = box(s, 620, 520);
          const phi = 8 * D2R, u = [Math.cos(phi), -Math.sin(phi)], n = [u[1], -u[0]];
          const at = (p, a, v, b, w) => [p[0] + a * v[0] + (b || 0) * (w ? w[0] : 0), p[1] + a * v[1] + (b || 0) * (w ? w[1] : 0)];
          const G0 = [40, 430], L = 400, cm = L / 16, dist = 4 * cm;
          const Pp = at(G0, 290, u, dist, n);
          const rho = Math.atan2(-n[0], n[1]) / D2R;
          const gA = at(G0, -40, u), gB = at(G0, 580, u);
          svg.append(ln(s, gA[0], gA[1], gB[0], gB[1], { stroke: BLUE, "stroke-width": 5 }), tx(s, gB[0] - 12, gB[1] + 34, "g", { class: "hlbl", fill: BLUE }));
          const hLine = ln(s, 0, 0, 0, 0, { stroke: RED, "stroke-width": 5, class: "later" });
          const GD = geodreieck(s, L, {}), pl = placeable(s, GD.g);
          const hlHi = ln(s, -GD.h + dist + 6, -dist, GD.h - dist - 6, -dist, { stroke: ORANGE, "stroke-width": 5, class: "later" });
          GD.g.append(hlHi);
          const hA = at(Pp, -170, u), hB = at(Pp, 240, u);
          const hL = tx(s, hB[0] - 8, hB[1] - 18, "h", { class: "hlbl later", fill: RED });
          const Pd = s.el("circle", { cx: Pp[0], cy: Pp[1], r: 8, fill: U }), PL = tx(s, Pp[0] - 6, Pp[1] - 20, "P", { "font-weight": 700, fill: U, style: { fontSize: "26px" } });
          const meas = s.el("g", { class: "later" });
          const m1 = at(G0, 90, u), m2 = at(m1, dist, n);
          meas.append(ln(s, m1[0], m1[1], m2[0], m2[1], { stroke: GREEN, "stroke-width": 3 }), tx(s, m1[0] + 14, (m1[1] + m2[1]) / 2 + 8, "4 cm", { fill: GREEN, "font-weight": 700, "text-anchor": "start" }));
          const done = s.el("g", { class: "later" });
          done.append(tx(s, 452, 120, "g", { fill: U, "font-weight": 700, "text-anchor": "end", style: { fontSize: "34px" } }), ln(s, 467, 122, 467, 96, { stroke: U, "stroke-width": 3.5 }), ln(s, 477, 122, 477, 96, { stroke: U, "stroke-width": 3.5 }), tx(s, 492, 120, "h", { fill: U, "font-weight": 700, "text-anchor": "start", style: { fontSize: "34px" } }));
          const pen = makePen(s);
          svg.append(hLine, pl.w, meas, Pd, PL, hL, done, pen.g);
          const start = at(Pp, 300, u, -140, n);
          pl.put(start[0], start[1], rho, 0); pen.put(660, 40);
          const items = stepList(s, ["Lege eine Hilfslinie des Geodreiecks genau auf g.", "Verschiebe es an g entlang, bis die lange Kante durch P geht.", "Zeichne an der langen Kante entlang.", "Fertig: h ist parallel zu g – überall 4 cm Abstand."]);
          let busy = false;
          const S1 = async () => { s.sfx.whoosh(); const a = at(Pp, 250, u); await pl.go(a[0], a[1], rho, 1, 1000); s.sfx.snap(); s.show(hlHi, "fade"); };
          const S2 = async () => { s.sfx.swoosh(); const a = at(Pp, 30, u); await pl.go(a[0], a[1], rho, 1, 1000); s.sfx.ding(); };
          const S3 = async () => { s.sound("pencil-write", { vol: .5 }); await pen.line(hLine, hA[0], hA[1], hB[0], hB[1], 1200); };
          const S4 = async () => { s.sfx.whoosh(); pen.move(660, 40, 400); await pl.go(start[0], start[1], rho, 0, 700); s.hide(hlHi); s.sfx.pop(); s.show([hL, meas], "pop"); s.sfx.success(); await s.show(done, "pop"); };
          const again = async () => {
            if (busy) return; busy = true; s.sfx.click();
            s.hide([hLine, hL, meas, done, hlHi]); pl.put(start[0], start[1], rho, 0);
            for (const f of [S1, S2, S3, S4]) await f();
            busy = false;
          };
          const btn = s.h("button", { class: "btn later", style: { alignSelf: "flex-start" }, onclick: again }, "Nochmal zeigen");
          const life = s.h("div", { class: "life later", style: { padding: "10px 16px" } }, s.h("p", { class: "small" }, s.h("b", null, "Im Alltag: "), "So zeichnest du Notenlinien, Tabellen oder die Bahnen auf dem Sportplatz."));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "620px 1fr", alignItems: "center", height: "100%", gap: "22px" } }, svg, s.h("div", { class: "stack", style: { gap: "12px" } }, ...items, btn, life)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          [S1, S2, S3, S4].forEach((f, i) => s.step(async () => { busy = true; s.show(items[i], "left"); s.say(items[i].textContent.slice(1)); await f(); busy = false; if (i === 3) { s.show(btn, "pop"); s.show(life, "up"); } }));
        },
      },
      /* 8 ─────────────────────────────── */
      {
        title: "Was ist ein Winkel?",
        say: "Ein Winkel entsteht, wenn zwei Strahlen vom selben Punkt ausgehen. Der Punkt heißt Scheitel, die Strahlen heißen Schenkel.",
        build(s) {
          const svg = box(s, 560, 500), S = [90, 400];
          let a = 0, len = 400;
          const sec = pth(s, "", { fill: "#ece5fb", stroke: "none" });
          const arc = pth(s, "", { stroke: U, "stroke-width": 4 });
          const s1 = ln(s, S[0], S[1], S[0] + 430, S[1], { stroke: BLUE, "stroke-width": 6, class: "later" });
          const s2 = ln(s, S[0], S[1], S[0] + len, S[1], { stroke: RED, "stroke-width": 6, class: "later" });
          const Sd = s.el("circle", { cx: S[0], cy: S[1], r: 9, fill: INK });
          const aL = grk(tx(s, 0, 0, "α", { fill: U, "font-weight": 700, style: { fontSize: "34px" }, class: "lbl later" }));
          const SL = tx(s, S[0] - 12, S[1] + 38, "Scheitel S", { "font-weight": 700, "text-anchor": "start", class: "lbl later" });
          const s1L = tx(s, 420, S[1] + 36, "1. Schenkel", { "font-weight": 700, fill: BLUE, class: "lbl later" });
          const s2L = tx(s, 0, 0, "2. Schenkel", { "font-weight": 700, fill: RED, class: "lbl later", "text-anchor": "end" });
          const hd = s.el("circle", { r: 14, fill: RED, stroke: "#fff", "stroke-width": 3, class: "later" }), hh = s.el("circle", { r: 32, fill: "transparent" });
          svg.append(sec, arc, s1, s2, Sd, aL, SL, s1L, s2L, hd, hh);
          const big = s.h("p", { class: "big mono", style: { color: U } }, "α = 0°");
          function render() {
            const t = a * D2R, e = [S[0] + len * Math.cos(t), S[1] - len * Math.sin(t)];
            setL(s2, S[0], S[1], e[0], e[1]);
            hd.setAttribute("cx", e[0]); hd.setAttribute("cy", e[1]); hh.setAttribute("cx", e[0]); hh.setAttribute("cy", e[1]);
            sec.setAttribute("d", a > 0.5 ? arcD(S[0], S[1], 90, 0, a, true) : "");
            arc.setAttribute("d", a > 0.5 ? arcD(S[0], S[1], 90, 0, a) : "");
            aL.setAttribute("x", S[0] + 58 * Math.cos(t / 2)); aL.setAttribute("y", S[1] - 58 * Math.sin(t / 2) + 10);
            const m = 230; const q = [S[0] + m * Math.cos(t), S[1] - m * Math.sin(t)];
            s2L.setAttribute("x", q[0] - 22 * Math.sin(t) - 6); s2L.setAttribute("y", q[1] - 22 * Math.cos(t) + 4);
            big.innerHTML = gk("α = " + Math.round(a) + "°");
          }
          render();
          s.drag(hh, { space: svg, onMove: p => { const na = clamp(Math.round(Math.atan2(S[1] - p.y, p.x - S[0]) / D2R), 15, 85); if (na !== a) { a = na; render(); s.sfx.tick(); } } });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Ein Winkel hat einen ", s.h("b", null, "Scheitel"), " und zwei ", s.h("b", null, "Schenkel"), ". Winkel benennt man mit griechischen Buchstaben: ", s.h("span", { html: gk("α (Alpha), β (Beta), γ (Gamma), δ (Delta).") }));
          const tri = s.svg(470, 170);
          const A = [40, 146], B = [430, 146], C = [290, 36];
          const ang = (p, q, r) => { const a1 = Math.atan2(p[1] - q[1], q[0] - p[0]) / D2R, a2 = Math.atan2(p[1] - r[1], r[0] - p[0]) / D2R; return [a1, a2]; };
          tri.append(pg(s, [A, B, C], { fill: "#fbf9ff", stroke: INK, "stroke-width": 3 }));
          [[A, B, C, "α", "A"], [B, C, A, "β", "B"], [C, A, B, "γ", "C"]].forEach(([p, q, r, gr, nm]) => {
            let [a1, a2] = ang(p, q, r); if (a2 < a1) a2 += 360; if (a2 - a1 > 180) { const t = a1; a1 = a2 - 360; a2 = t; }
            tri.append(pth(s, arcD(p[0], p[1], 30, a1, a2, true), { fill: "#ece5fb", stroke: U, "stroke-width": 2.5 }));
            const mid = (a1 + a2) / 2 * D2R;
            tri.append(grk(tx(s, p[0] + 48 * Math.cos(mid), p[1] - 48 * Math.sin(mid) + 8, gr, { fill: U, "font-weight": 700, style: { fontSize: "26px" } })));
            const cx = (A[0] + B[0] + C[0]) / 3, cy = (A[1] + B[1] + C[1]) / 3, dx = p[0] - cx, dy = p[1] - cy, l = Math.hypot(dx, dy);
            tri.append(tx(s, p[0] + dx / l * 22, p[1] + dy / l * 22 + 8, nm, { "font-weight": 700, style: { fontSize: "21px" } }));
          });
          const triBox = s.h("div", { class: "ex later", style: { padding: "8px 12px" } }, s.h("span", { class: "exlabel" }, "Winkel im Dreieck"), tri);
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "560px 1fr", alignItems: "center", height: "100%", gap: "24px" } }, svg, s.h("div", { class: "stack", style: { gap: "12px" } }, big, merk, triBox)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          s.show(s1, "draw", 300); s.sfx.zap();
          s.step(async () => {
            s2.classList.remove("later"); s.say("Der zweite Schenkel dreht sich auf.");
            let last = 0;
            await s.tween({ from: 0, to: 55, dur: 1600, update: v => { a = v; render(); const k = Math.floor(v / 5); if (k > last) { last = k; s.sfx.count(k % 12); } } });
            a = 55; render(); s.sfx.ding(); undraw(s1);
          });
          s.step(async () => { s.sfx.pop(); s.show([SL, s1L, s2L], "pop"); await s.show(aL, "pop"); s.show([hd], "pop"); s.say("Scheitel, erster Schenkel, zweiter Schenkel – und der Winkel Alpha."); });
          s.step(async () => {
            s.say("Die Länge der Schenkel ist egal. Nur die Öffnung zählt!");
            s.sfx.whoosh(); await s.tween({ from: 400, to: 250, dur: 900, update: v => { len = v; render(); } });
            s.sfx.whoosh(); await s.tween({ from: 250, to: 400, dur: 900, update: v => { len = v; render(); } }); s.sfx.ding();
          });
          s.step(async () => { s.sfx.success(); await s.show(merk, "up"); await s.show(triBox, "up"); });
        },
      },
      /* 9 ─────────────────────────────── */
      {
        title: "Winkelarten",
        say: "Je nachdem, wie weit ein Winkel geöffnet ist, hat er einen anderen Namen. Dreh den Schenkel und hör genau hin!",
        build(s) {
          const svg = box(s, 520, 520), S = [260, 270], R = 205;
          let a = 30, lastK = "";
          const sec = pth(s, "", { fill: "#ece5fb", stroke: "none" });
          const arc = pth(s, "", { stroke: U, "stroke-width": 4 });
          const full = s.el("circle", { cx: S[0], cy: S[1], r: 70, fill: "#ece5fb", stroke: U, "stroke-width": 4, visibility: "hidden" });
          const rm = pth(s, `M${S[0] + 40},${S[1]} L${S[0] + 40},${S[1] - 40} L${S[0]},${S[1] - 40}`, { stroke: U, "stroke-width": 3.5 });
          const rdot = s.el("circle", { cx: S[0] + 20, cy: S[1] - 20, r: 4.5, fill: U });
          const s1 = ln(s, S[0], S[1], S[0] + R, S[1], { stroke: BLUE, "stroke-width": 6 });
          const s2 = ln(s, S[0], S[1], S[0] + R, S[1], { stroke: RED, "stroke-width": 6 });
          const Sd = s.el("circle", { cx: S[0], cy: S[1], r: 9, fill: INK });
          const aL = grk(tx(s, 0, 0, "α", { fill: U, "font-weight": 700, style: { fontSize: "34px" } }));
          const hd = s.el("circle", { r: 16, fill: RED, stroke: "#fff", "stroke-width": 3 }), hh = s.el("circle", { r: 34, fill: "transparent" });
          svg.append(full, sec, arc, rm, rdot, s1, s2, Sd, aL, hd, hh);
          const TYPES = [
            ["spitz", "kleiner als 90°", "Pizzastück"], ["recht", "genau 90°", "Heftecke"], ["stumpf", "zwischen 90° und 180°", "offener Laptop"],
            ["gestreckt", "genau 180°", "Uhr um 6"], ["überstumpf", "zwischen 180° und 360°", "Pac-Man"], ["Vollwinkel", "genau 360°", "ganze Drehung"],
          ];
          const rows = TYPES.map(([k, r, ex]) => s.h("div", { class: "row", style: { gap: "10px", flexWrap: "nowrap", padding: "4px 12px", borderRadius: "12px", transition: "background .2s" } },
            s.h("span", { class: "t", style: { fontWeight: 700, minWidth: "140px" } }, k), s.h("span", { class: "small", style: { flex: "1" } }, r), s.h("span", { class: "small pencil" }, ex)));
          const name = s.h("p", { class: "big", style: { color: U } });
          const val = s.h("p", { class: "h2 mono" });
          function render() {
            const t = a * D2R, e = [S[0] + R * Math.cos(t), S[1] - R * Math.sin(t)];
            setL(s2, S[0], S[1], e[0], e[1]);
            hd.setAttribute("cx", e[0]); hd.setAttribute("cy", e[1]); hh.setAttribute("cx", e[0]); hh.setAttribute("cy", e[1]);
            const k = kindOf(a);
            full.setAttribute("visibility", k === "Vollwinkel" ? "visible" : "hidden");
            const showArc = a > 0.5 && a < 359.5 && k !== "recht";
            sec.setAttribute("d", showArc ? arcD(S[0], S[1], 70, 0, a, true) : "");
            arc.setAttribute("d", showArc ? arcD(S[0], S[1], 70, 0, a) : "");
            [rm, rdot].forEach(x => x.setAttribute("visibility", k === "recht" ? "visible" : "hidden"));
            const r = a < 30 ? 120 : 100;
            aL.setAttribute("x", S[0] + r * Math.cos(t / 2)); aL.setAttribute("y", S[1] - r * Math.sin(t / 2) + 10);
            aL.setAttribute("visibility", a > 8 ? "visible" : "hidden");
            name.textContent = kindName(k); val.innerHTML = gk("α = " + Math.round(a) + "°");
            rows.forEach((row, i) => { const on = TYPES[i][0] === k; row.style.background = on ? U : "transparent"; row.style.color = on ? "#fff" : ""; row.lastChild.style.color = on ? "#fff" : ""; });
            if (k !== lastK) {
              if (lastK) { if (["recht", "gestreckt", "Vollwinkel"].includes(k)) s.sfx.ding(); else s.sfx.chord({ spitz: [0, 4, 7], stumpf: [-3, 0, 4], "überstumpf": [-5, -1, 2], Nullwinkel: [-12] }[k]); }
              lastK = k; name.classList.remove("a-pop"); void name.offsetWidth; name.classList.add("a-pop");
            }
          }
          const sl = s.slider({ label: "Winkel öffnen", min: 0, max: 360, value: a, fmt: v => v + "°", onInput: v => { a = v; render(); } });
          let prev = a;
          s.drag(hh, { space: svg, onMove: p => {
            let na = Math.atan2(S[1] - p.y, p.x - S[0]) / D2R; if (na < 0) na += 360;
            if (prev > 300 && na < 60) na = 360; if (prev < 60 && na > 300) na = 0;
            na = Math.round(na); for (const snap of [90, 180, 270, 360]) if (Math.abs(na - snap) <= 3) na = snap;
            if (na !== a) { a = na; prev = na; sl.input.value = na; sl.querySelector(".sl-top .mono").textContent = na + "°"; render(); s.sfx.tick(); }
          } });
          render();
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "520px 1fr", alignItems: "center", height: "100%", gap: "26px" } }, svg, s.h("div", { class: "stack", style: { gap: "8px" } }, name, val, sl, s.h("div", { class: "stack", style: { gap: "4px" } }, rows))));
          s.show(svg, "zoom"); s.sfx.whoosh();
          const goA = async (to, txt) => { s.say(txt); const from = a; await s.tween({ from, to, dur: 300 + 9 * Math.abs(to - from), update: v => { a = Math.round(v); prev = a; sl.input.value = a; sl.querySelector(".sl-top .mono").textContent = a + "°"; render(); } }); a = to; prev = to; render(); };
          s.step(() => goA(45, "Spitz: kleiner als ein rechter Winkel."));
          s.step(() => goA(90, "Recht: genau neunzig Grad. Man malt ein Viereck mit Punkt hinein."));
          s.step(() => goA(135, "Stumpf: zwischen neunzig und hundertachtzig Grad."));
          s.step(() => goA(180, "Gestreckt: die Schenkel bilden eine gerade Linie."));
          s.step(() => goA(270, "Überstumpf: mehr als hundertachtzig Grad."));
          s.step(async () => { await goA(360, "Vollwinkel: einmal ganz herum!"); s.sfx.fanfare(); });
        },
      },
      /* 10 ─────────────────────────────── */
      {
        title: "Winkel auf der Uhr",
        say: "Auf der Uhr sind von einer Zahl zur nächsten genau dreißig Grad. Die Zeiger bilden zu jeder Uhrzeit einen Winkel.",
        build(s) {
          const svg = s.svg(500, 500), C = [250, 250];
          svg.append(s.el("circle", { cx: C[0], cy: C[1], r: 215, fill: "#fff", stroke: INK, "stroke-width": 8 }));
          const wedges = s.el("g");
          for (let i = 0; i < 12; i++) wedges.append(pth(s, arcD(C[0], C[1], 200, 90 - i * 30, 90 - (i + 1) * 30, true), { fill: i % 2 ? "#ece5fb" : "#ddd0f7", stroke: "#fff", "stroke-width": 2, class: "later" }));
          svg.append(wedges);
          for (let i = 0; i < 60; i++) { const t = i * 6 * D2R; svg.append(ln(s, C[0] + 196 * Math.sin(t), C[1] - 196 * Math.cos(t), C[0] + (i % 5 ? 188 : 178) * Math.sin(t), C[1] - (i % 5 ? 188 : 178) * Math.cos(t), { "stroke-width": i % 5 ? 2 : 4 })); }
          for (let i = 1; i <= 12; i++) { const t = i * 30 * D2R; svg.append(tx(s, C[0] + 152 * Math.sin(t), C[1] - 152 * Math.cos(t) + 10, String(i), { "font-weight": 800, style: { fontSize: "28px" } })); }
          const thirty = tx(s, C[0] + 98 * Math.sin(15 * D2R), C[1] - 98 * Math.cos(15 * D2R) + 8, "30°", { fill: U, "font-weight": 800, class: "lbl later", style: { fontSize: "22px" } });
          const sec = pth(s, "", { fill: "rgba(123,79,214,.28)", stroke: U, "stroke-width": 3 });
          const hourH = ln(s, C[0], C[1], C[0], C[1] - 105, { stroke: INK, "stroke-width": 12 });
          const minH = ln(s, C[0], C[1], C[0], C[1] - 165, { stroke: RED, "stroke-width": 7 });
          svg.append(thirty, sec, hourH, minH, s.el("circle", { cx: C[0], cy: C[1], r: 10, fill: INK }));
          let hour = 3;
          const timeP = s.h("p", { class: "big mono" }), angP = s.h("p", { class: "h2" }), kindP = s.h("span", { class: "chip", style: { background: U, color: "#fff", fontSize: "21px", alignSelf: "flex-start" } });
          function render(hf) {
            const deg = hf * 30; hourH.setAttribute("x2", C[0] + 105 * Math.sin(deg * D2R)); hourH.setAttribute("y2", C[1] - 105 * Math.cos(deg * D2R));
            let ang = ((deg % 360) + 360) % 360; const small = ang > 180 ? 360 - ang : ang;
            const a0 = 90, a1 = 90 - ang;
            sec.setAttribute("d", small > 0.5 ? (ang <= 180 ? arcD(C[0], C[1], 62, a0, a1, true) : arcD(C[0], C[1], 62, a1 + 360, a0, true)) : "");
            const hh = Math.round(hf) % 12 || 12;
            timeP.textContent = hh + ":00 Uhr";
            angP.textContent = "Winkel zwischen den Zeigern: " + Math.round(small) + "°";
            kindP.textContent = kindName(kindOf(Math.round(small)));
          }
          render(hour);
          const sl = s.slider({ label: "Uhrzeit (volle Stunde)", min: 1, max: 12, value: hour, fmt: v => v + " Uhr", onInput: v => { const f = hour; hour = v; s.tween({ from: f, to: v, dur: 350, update: x => render(x) }); } });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Ein Kreis hat 360°. Die Uhr hat 12 Abschnitte: ", s.h("b", null, "360° : 12 = 30°"), " von Zahl zu Zahl.");
          const life = s.h("div", { class: "life later", style: { padding: "10px 16px" } }, s.h("p", { class: "small" }, s.h("b", null, "Schulbeginn um 8:00 Uhr: "), "4 Abschnitte bis zur 12 – also 4 · 30° = 120°. Ein stumpfer Winkel!"));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "500px 1fr", alignItems: "center", height: "100%", gap: "26px" } }, svg, s.h("div", { class: "stack", style: { gap: "12px" } }, timeP, angP, kindP, sl, merk, life)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          const setH = async (to, txt) => { s.say(txt); s.sound("clock-tick", { vol: .45, dur: 1.2 }); const f = hour; await s.tween({ from: f, to, dur: 1100, update: x => render(x) }); hour = to; sl.input.value = to; sl.querySelector(".sl-top .mono").textContent = to + " Uhr"; render(to); s.sfx.ding(); };
          s.step(async () => { s.say("Zwölf gleiche Stücke. Jedes ist dreißig Grad groß."); for (let i = 0; i < 12; i++) { s.show(wedges.children[i], "fade"); s.sfx.count(i); await s.wait(140); } s.sfx.pop(); s.show(thirty, "pop"); await s.show(merk, "up"); });
          s.step(() => setH(4, "Vier Uhr: vier mal dreißig Grad, also hundertzwanzig Grad. Stumpf!"));
          s.step(() => setH(6, "Sechs Uhr: hundertachtzig Grad. Ein gestreckter Winkel."));
          s.step(async () => { await setH(8, "Acht Uhr, Schulbeginn: wieder hundertzwanzig Grad."); s.sound("school-bell", { vol: .45, dur: 3 }); await s.show(life, "up"); });
        },
      },
      /* 11 ─────────────────────────────── */
      {
        title: "Im Alltag: Winkel überall",
        say: "Winkel findest du beim Laptop, an der Tür, bei der Pizza, auf der Rampe, an der Skischanze und beim Torschuss.",
        build(s) {
          const card = (title, chip, text, mkSvg) => {
            const svg = s.svg(300, 150); const play = mkSvg(svg);
            const c = s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "6px", padding: "10px 14px", cursor: "pointer" }, onclick: () => { s.sfx.click(); play(); } },
              svg, s.h("div", { class: "row", style: { justifyContent: "space-between", flexWrap: "nowrap" } }, s.h("span", { class: "t", style: { fontWeight: 700 } }, title), s.h("span", { class: "chip", style: { background: SOFT, color: U } }, chip)), s.h("p", { class: "small" }, text));
            return { c, play };
          };
          const cards = [
            card("Laptop", "stumpf", "Aufgeklappt: etwa 110°.", svg => {
              const Hc = [100, 126];
              const lid = ln(s, Hc[0], Hc[1], Hc[0] + 150, Hc[1], { stroke: "#4c5566", "stroke-width": 9 }), ar = pth(s, "", { stroke: U, "stroke-width": 3, fill: "rgba(123,79,214,.18)" });
              const lb = tx(s, 152, 66, "110°", { fill: U, "font-weight": 700, class: "lbl later" });
              svg.append(s.el("rect", { x: 96, y: 126, width: 170, height: 12, rx: 5, fill: "#8d96a3" }), ar, lid, lb);
              const set = v => { lid.setAttribute("x2", Hc[0] + 110 * Math.cos(v * D2R)); lid.setAttribute("y2", Hc[1] - 110 * Math.sin(v * D2R)); ar.setAttribute("d", v > 2 ? arcD(Hc[0], Hc[1], 40, 0, v, true) : ""); };
              set(110);
              return async () => { s.hide(lb); s.sfx.swoosh(); await s.tween({ from: 0, to: 110, dur: 1100, update: set }); s.sound("keyboard", { vol: .4, dur: 1.2 }); s.show(lb, "pop"); };
            }),
            card("Tür (von oben)", "recht", "Weit offen: 90°.", svg => {
              const Hc = [190, 116];
              svg.append(s.el("rect", { x: 10, y: 116, width: 100, height: 14, fill: "#c9b79c" }), s.el("rect", { x: 190, y: 116, width: 100, height: 14, fill: "#c9b79c" }));
              const ar = pth(s, "", { stroke: U, "stroke-width": 3, fill: "rgba(123,79,214,.18)" }), door = ln(s, Hc[0], Hc[1], 110, 116, { stroke: "#a0703f", "stroke-width": 9 });
              const rmk = pth(s, `M${Hc[0] - 26},${Hc[1]} L${Hc[0] - 26},${Hc[1] - 26} L${Hc[0]},${Hc[1] - 26}`, { stroke: U, "stroke-width": 3, class: "later" });
              const lb = tx(s, 130, 70, "90°", { fill: U, "font-weight": 700, class: "lbl later" });
              svg.append(ar, door, rmk, lb);
              const set = v => { door.setAttribute("x2", Hc[0] - 80 * Math.cos(v * D2R)); door.setAttribute("y2", Hc[1] - 80 * Math.sin(v * D2R)); ar.setAttribute("d", v > 2 && v < 89.5 ? arcD(Hc[0], Hc[1], 40, 180 - v, 180, true) : ""); };
              set(90); s.show(rmk, "fade");
              return async () => { s.hide([rmk, lb]); s.sound("door-creak", { vol: .5, dur: 1.4 }); await s.tween({ from: 0, to: 90, dur: 1100, update: set }); s.sfx.drum(); s.show([rmk, lb], "pop"); };
            }),
            card("Pizza", "spitz", "8 Stücke: 360° : 8 = 45°.", svg => {
              const C = [130, 75], r = 62;
              svg.append(s.el("circle", { cx: C[0], cy: C[1], r, fill: "#f6c35b", stroke: "#c7862a", "stroke-width": 6 }));
              for (let i = 0; i < 8; i++) { const t = i * 45 * D2R; svg.append(ln(s, C[0], C[1], C[0] + r * Math.cos(t), C[1] - r * Math.sin(t), { stroke: "#8a4b12", "stroke-width": 3 })); }
              [[105, 60], [150, 98], [118, 100], [96, 82]].forEach(([x, y]) => svg.append(s.el("circle", { cx: x, cy: y, r: 7, fill: "#c0392b" })));
              const sl = s.el("g"); sl.append(pth(s, arcD(C[0], C[1], r, 0, 45, true), { fill: "#ffd77a", stroke: U, "stroke-width": 3.5 }), s.el("circle", { cx: C[0] + 38, cy: C[1] - 14, r: 7, fill: "#c0392b" }));
              const lb = tx(s, 252, 40, "45°", { fill: U, "font-weight": 700, class: "lbl later" });
              svg.append(sl, lb);
              const set = v => sl.setAttribute("transform", `translate(${v * Math.cos(22.5 * D2R)},${-v * Math.sin(22.5 * D2R)})`);
              set(26); s.show(lb, "fade");
              return async () => { s.hide(lb); s.sound("pizza-schneiden", { vol: .6 }); await s.tween({ from: 0, to: 26, dur: 700, ease: "back", update: set }); s.show(lb, "pop"); };
            }),
            card("Skate-Rampe", "spitz", "Die Rampe ist etwa 30° steil.", svg => {
              svg.append(ln(s, 10, 132, 290, 132, { stroke: "#8d96a3", "stroke-width": 4 }), pg(s, [[50, 132], [250, 132], [250, 16.5]], { fill: "#d9c9a5", stroke: "#8a6d3b", "stroke-width": 3 }));
              svg.append(pth(s, arcD(50, 132, 54, 0, 30, true), { fill: "rgba(123,79,214,.25)", stroke: U, "stroke-width": 3 }));
              const lb = tx(s, 126, 122, "30°", { fill: U, "font-weight": 700, class: "lbl" });
              const sk = s.el("g"); sk.append(s.el("rect", { x: -18, y: -8, width: 36, height: 6, rx: 3, fill: "#e86a5a" }), s.el("circle", { cx: -11, cy: 0, r: 4, fill: INK }), s.el("circle", { cx: 11, cy: 0, r: 4, fill: INK }));
              svg.append(lb, sk);
              const set = v => { const x = 50 + v * 180, y = 132 - v * 104 - 6; sk.setAttribute("transform", `translate(${x},${y}) rotate(-30)`); };
              set(0.55);
              return async () => { s.sfx.whoosh(); await s.tween({ from: 0, to: 0.95, dur: 1200, ease: "out", update: set }); s.sfx.boing(); await s.tween({ from: 0.95, to: 0.55, dur: 800, update: set }); };
            }),
            card("Skisprungschanze", "spitz", "Der Anlauf ist etwa 35° steil.", svg => {
              const top = [40, 22], t35 = Math.tan(35 * D2R), bot = [40 + 140, 22 + 140 * t35];
              svg.append(pth(s, `M${top[0]},${top[1]} L${bot[0]},${bot[1]} L${bot[0] + 30},${bot[1] + 2}`, { stroke: "#5b7f99", "stroke-width": 6 }), pth(s, `M${bot[0] + 30},${bot[1] + 18} Q240,140 296,146`, { stroke: "#9fb6c8", "stroke-width": 5 }));
              svg.append(ln(s, top[0], top[1], top[0] + 90, top[1], { stroke: PENCIL, "stroke-width": 2, "stroke-dasharray": "5 5" }), pth(s, arcD(top[0], top[1], 50, -35, 0, true), { fill: "rgba(123,79,214,.25)", stroke: U, "stroke-width": 3 }));
              svg.append(tx(s, top[0] + 82, top[1] + 30, "35°", { fill: U, "font-weight": 700, "text-anchor": "start" }));
              const sk = s.el("circle", { r: 8, fill: RED });
              svg.append(sk);
              const set = v => { let x, y; if (v < 1) { x = top[0] + v * 170; y = top[1] + v * 170 * t35 - 8; } else { const w = v - 1; x = top[0] + 170 + w * 100; y = top[1] + 170 * t35 - 8 - 20 * Math.sin(w * Math.PI) + w * 18; } sk.setAttribute("cx", x); sk.setAttribute("cy", y); };
              set(0.3);
              return async () => { s.sound("wind", { vol: .4, dur: 2 }); await s.tween({ from: 0, to: 1, dur: 1000, ease: "in", update: set }); s.sfx.zap(); await s.tween({ from: 1, to: 2, dur: 900, ease: "out", update: set }); s.sound("crowd-cheer", { vol: .35, dur: 2 }); };
            }),
            card("Torschuss", "Schusswinkel", "Aus der Mitte siehst du das Tor unter einem größeren Winkel.", svg => {
              svg.append(s.el("rect", { x: 0, y: 0, width: 300, height: 150, rx: 12, fill: "#5fb05a" }), ln(s, 10, 14, 290, 14, { stroke: "#fff", "stroke-width": 3 }), s.el("rect", { x: 110, y: 6, width: 80, height: 8, fill: "#fff" }));
              const l1 = ln(s, 0, 0, 110, 14, { stroke: "#ffd94a", "stroke-width": 2.5 }), l2 = ln(s, 0, 0, 190, 14, { stroke: "#ffd94a", "stroke-width": 2.5 }), sec = pg(s, [[0, 0], [110, 14], [190, 14]], { fill: "rgba(255,217,74,.35)", stroke: "none" });
              const ball = s.el("circle", { r: 8, fill: "#fff", stroke: INK, "stroke-width": 2 });
              svg.append(sec, l1, l2, ball);
              const set = v => { const x = 150 + v * 120, y = 128 - v * 30; [l1, l2].forEach(l => { l.setAttribute("x1", x); l.setAttribute("y1", y); }); sec.setAttribute("points", P([[x, y], [110, 14], [190, 14]])); ball.setAttribute("cx", x); ball.setAttribute("cy", y); };
              set(0);
              return async () => { s.sfx.whoosh(); await s.tween({ from: 0, to: 1, dur: 1200, update: set }); s.sound("ball-kick", { vol: .6 }); await s.tween({ from: 1, to: 0, dur: 1200, update: set }); s.sfx.ding(); };
            }),
          ];
          s.add(s.h("div", { class: "cols3", style: { height: "100%", gap: "16px", alignContent: "center" } }, cards.map(c => c.c)));
          const reveal = async (i) => { s.sfx.pop(); await s.show(cards[i].c, "up"); cards[i].play(); };
          reveal(0); s.wait(250).then(() => s.alive && reveal(1));
          s.step(async () => { reveal(2); await s.wait(300); await reveal(3); s.say("Pizza und Rampe: spitze Winkel."); });
          s.step(async () => { reveal(4); await s.wait(300); await reveal(5); s.say("Tippe eine Karte an, dann läuft sie nochmal."); });
        },
      },
      /* 12 ─────────────────────────────── */
      {
        title: "Winkel messen",
        say: "Zum Messen legst du den Nullpunkt auf den Scheitel und die lange Kante auf einen Schenkel. Dann liest du die Skala ab, die bei diesem Schenkel mit Null beginnt.",
        build(s) {
          const svg = box(s, 640, 470), S = [320, 430], L = 600;
          let a = 50, left = false;
          const GD = geodreieck(s, L, { angles: true, angleNums: true, step: 20 }), pl = placeable(s, GD.g);
          const hiArc = pth(s, "", { stroke: BLUE, "stroke-width": 8, "stroke-linecap": "round", opacity: .75, class: "later" });
          const sec = pth(s, "", { fill: "rgba(123,79,214,.18)", stroke: U, "stroke-width": 3 });
          const s1 = ln(s, 0, 0, 0, 0, { stroke: INK, "stroke-width": 5 }), s2 = ln(s, 0, 0, 0, 0, { stroke: INK, "stroke-width": 5 });
          const Sd = s.el("circle", { cx: S[0], cy: S[1], r: 7, fill: INK });
          const nul = s.el("circle", { cx: S[0], cy: S[1], r: 16, fill: "none", stroke: RED, "stroke-width": 4, class: "later" });
          const SL = tx(s, S[0], S[1] + 34, "S", { "font-weight": 700 });
          const aL = grk(tx(s, 0, 0, "α", { fill: U, "font-weight": 700, style: { fontSize: "30px" } }));
          const ptr = s.el("circle", { r: 9, fill: RED, stroke: "#fff", "stroke-width": 2.5, class: "later" });
          svg.append(sec, pl.w, hiArc, s1, s2, Sd, nul, SL, aL, ptr);
          pl.put(S[0], -320, 0, 0);
          const read = s.h("p", { class: "big mono later", style: { color: U } });
          const warn = s.h("p", { class: "small pencil later" });
          let shownTo = -1;
          function render() {
            const base = left ? 180 : 0, dir = left ? 180 - a : a;
            const e1 = [S[0] + 300 * Math.cos(base * D2R), S[1]], e2 = [S[0] + 300 * Math.cos(dir * D2R), S[1] - 300 * Math.sin(dir * D2R)];
            setL(s1, S[0], S[1], e1[0], e1[1]); setL(s2, S[0], S[1], e2[0], e2[1]);
            sec.setAttribute("d", a > 0.5 ? arcD(S[0], S[1], 52, Math.min(base, dir), Math.max(base, dir), true) : "");
            const mid = (base + dir) / 2 * D2R;
            aL.setAttribute("x", S[0] + 68 * Math.cos(mid)); aL.setAttribute("y", S[1] - 68 * Math.sin(mid) + 9);
            aL.setAttribute("visibility", a > 12 ? "visible" : "hidden");
            const rr = 0.30 * L + 6, to = shownTo < 0 ? a : Math.min(a, shownTo);
            hiArc.setAttribute("stroke", left ? ORANGE : BLUE);
            hiArc.setAttribute("d", to > 0.5 ? arcD(S[0], S[1], rr, left ? 180 - to : 0, left ? 180 : to) : "");
            const pd = left ? 180 - to : to;
            ptr.setAttribute("cx", S[0] + rr * Math.cos(pd * D2R)); ptr.setAttribute("cy", S[1] - rr * Math.sin(pd * D2R));
            read.innerHTML = gk("α = " + Math.round(to) + "°");
            warn.innerHTML = "";
            warn.append("Achtung: Die ", s.h("b", { style: { color: left ? BLUE : ORANGE } }, left ? "blaue" : "orange"), ` Skala zeigt hier ${180 - Math.round(a)}° – sie beginnt am anderen Schenkel. Die passt nicht!`);
          }
          render();
          const sl = s.slider({ label: "Winkel", min: 5, max: 175, value: a, fmt: v => v + "°", onInput: v => { a = v; shownTo = -1; render(); } });
          const tb = [s.h("button", { class: "btn solid", onclick: () => setSide(false) }, "1. Schenkel rechts"), s.h("button", { class: "btn", onclick: () => setSide(true) }, "1. Schenkel links")];
          function setSide(l) { s.sfx.click(); left = l; tb.forEach((b, i) => b.classList.toggle("solid", (i === 1) === l)); shownTo = -1; render(); }
          const items = stepList(s, ["Nullpunkt auf den Scheitel S legen.", "Lange Kante genau auf den 1. Schenkel legen.", "Auf der Skala ablesen, die am 1. Schenkel bei 0 beginnt."], [RED, INK, BLUE]);
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "640px 1fr", alignItems: "center", height: "100%", gap: "22px" } }, svg,
            s.h("div", { class: "stack", style: { gap: "10px" } }, ...items, read, warn, sl, s.h("div", { class: "row", style: { gap: "10px" } }, tb))));
          s.show(svg, "zoom"); s.sfx.whoosh();
          s.step(async () => { s.show(items[0], "left"); s.sfx.whoosh(); await pl.go(S[0], S[1], 0, 1, 1000); s.sfx.snap(); await s.show(nul, "pop"); s.say("Der Nullpunkt liegt genau auf dem Scheitel."); });
          s.step(async () => { s.show(items[1], "left"); s.sfx.zap(); s1.setAttribute("stroke", RED); await s.wait(500); s1.setAttribute("stroke", INK); await s.wait(250); s1.setAttribute("stroke", RED); await s.wait(500); s1.setAttribute("stroke", INK); s.sfx.ding(); s.say("Die lange Kante liegt auf dem ersten Schenkel."); });
          s.step(async () => {
            s.show(items[2], "left"); s.say("Wir zählen von null bis zum zweiten Schenkel.");
            hiArc.classList.remove("later"); ptr.classList.remove("later"); read.classList.remove("later");
            let last = -1;
            await s.tween({ from: 0, to: a, dur: 1500, ease: "out", update: v => { shownTo = v; render(); const k = Math.floor(v / 10); if (k > last) { last = k; s.sfx.count(k); } } });
            shownTo = -1; render(); s.sfx.success(); s.show(read, "pop"); await s.show(warn, "up");
          });
        },
      },
      /* 13 ─────────────────────────────── */
      {
        title: "Winkel zeichnen",
        say: "Wir zeichnen einen Winkel von siebzig Grad mit dem Geodreieck. Schritt für Schritt.",
        build(s) {
          const svg = box(s, 640, 470), S = [320, 430], L = 600;
          let a = 70, busy = false;
          const GD = geodreieck(s, L, { angles: true, angleNums: true, step: 20 }), pl = placeable(s, GD.g);
          const s1 = ln(s, 0, 0, 0, 0, { stroke: BLUE, "stroke-width": 5, class: "later" }), s2 = ln(s, 0, 0, 0, 0, { stroke: RED, "stroke-width": 5, class: "later" });
          const sec = pth(s, "", { fill: "rgba(123,79,214,.18)", stroke: U, "stroke-width": 3, class: "later" });
          const Sd = s.el("circle", { cx: S[0], cy: S[1], r: 7, fill: INK, class: "later" }), SL = tx(s, S[0], S[1] + 34, "S", { "font-weight": 700, class: "lbl later" });
          const mark = s.el("circle", { r: 8, fill: RED, class: "later" });
          const aL = tx(s, 0, 0, "", { fill: U, "font-weight": 700, class: "lbl later", "text-anchor": "start", style: { fontSize: "26px" } });
          const pen = makePen(s);
          svg.append(sec, s2, pl.w, s1, Sd, SL, mark, aL, pen.g);
          pl.put(S[0], -320, 0, 0); pen.put(680, 40);
          const geom = () => { const rr = 0.30 * L + 10, t = a * D2R; return { m: [S[0] + rr * Math.cos(t), S[1] - rr * Math.sin(t)], e: [S[0] + 300 * Math.cos(t), S[1] - 300 * Math.sin(t)], t }; };
          const items = stepList(s, ["1. Schenkel zeichnen, Scheitel S markieren.", "Geodreieck anlegen: Nullpunkt auf S, Kante auf den Schenkel.", "Auf der Skala ab 0 bis zur Zahl gehen und einen Punkt setzen.", "Geodreieck weg – S mit dem Punkt verbinden. Fertig!"], [BLUE, INK, RED, U]);
          const D = [
            async () => { s.sfx.pop(); s.show([Sd, SL], "pop"); s.sound("pencil-write", { vol: .45 }); await pen.line(s1, S[0], S[1], S[0] + 300, S[1], 800); await pen.move(680, 40, 300); },
            async () => { s.sfx.whoosh(); await pl.go(S[0], S[1], 0, 1, 1000); s.sfx.snap(); },
            async () => {
              const { m } = geom();
              s.say("Auf der blauen Skala bis " + a + " zählen.");
              let last = -1;
              mark.classList.remove("later");
              await s.tween({ from: 0, to: a, dur: 1300, ease: "out", update: v => { const rr = 0.30 * L + 10; mark.setAttribute("cx", S[0] + rr * Math.cos(v * D2R)); mark.setAttribute("cy", S[1] - rr * Math.sin(v * D2R)); const k = Math.floor(v / 10); if (k > last) { last = k; s.sfx.count(k); } } });
              mark.setAttribute("cx", m[0]); mark.setAttribute("cy", m[1]); s.sfx.ding();
            },
            async () => {
              const { e, t } = geom();
              s.sfx.whoosh(); await pl.go(S[0], -320, 0, 0, 800);
              s.sound("pencil-write", { vol: .45 }); await pen.line(s2, S[0], S[1], e[0], e[1], 900); await pen.move(680, 40, 300);
              sec.setAttribute("d", arcD(S[0], S[1], 56, 0, a, true));
              svgGk(s, aL, "α = " + a + "°"); aL.setAttribute("x", S[0] + 80 * Math.cos(t / 2)); aL.setAttribute("y", S[1] - 80 * Math.sin(t / 2) + 8);
              s.sfx.success(); s.show(sec, "fade"); await s.show(aL, "pop");
            },
          ];
          let doneN = 0;
          async function redraw() {
            if (busy) return; busy = true; s.sfx.click();
            s.hide([s1, s2, sec, Sd, SL, mark, aL]); pl.put(S[0], -320, 0, 0);
            for (let i = 0; i < Math.max(doneN, 4); i++) await D[i]();
            doneN = 4; busy = false;
          }
          const sl = s.slider({ label: "Welcher Winkel?", min: 10, max: 170, step: 5, value: a, fmt: v => v + "°", onInput: v => { a = v; } });
          const btn = s.h("button", { class: "btn solid", onclick: redraw }, "Zeichnen");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "640px 1fr", alignItems: "center", height: "100%", gap: "22px" } }, svg,
            s.h("div", { class: "stack", style: { gap: "12px" } }, ...items, sl, s.h("div", { class: "row" }, btn))));
          s.show(svg, "zoom"); s.sfx.whoosh();
          D.forEach((f, i) => s.step(async () => { busy = true; s.show(items[i], "left"); s.say(items[i].textContent.slice(1)); await f(); doneN = i + 1; busy = false; }));
        },
      },
      /* 13e ─────────────────────────────── Nebenwinkel (Ausblick Klasse 6) */
      {
        title: "Nebenwinkel: zusammen 180°",
        say: "Zwei Geraden kreuzen sich. Die beiden Winkel, die nebeneinander an einer Geraden liegen, heißen Nebenwinkel.",
        build(s) {
          const svg = box(s, 560, 480), S = [280, 290], RH = 205;
          let th = 55;
          const secA = pth(s, "", { fill: "rgba(220,59,42,.22)", stroke: RED, "stroke-width": 3.5, class: "later" });
          const secB = pth(s, "", { fill: "rgba(29,91,208,.18)", stroke: BLUE, "stroke-width": 3.5, class: "later" });
          const g = ln(s, 20, S[1], 540, S[1], { stroke: INK, "stroke-width": 5 });
          const h = ln(s, 0, 0, 0, 0, { stroke: U, "stroke-width": 5 });
          const aL = grk(tx(s, 0, 0, "α", { fill: RED, "font-weight": 700, class: "lbl later", style: { fontSize: "30px" } }));
          const bL = grk(tx(s, 0, 0, "β", { fill: BLUE, "font-weight": 700, class: "lbl later", style: { fontSize: "30px" } }));
          const gL = tx(s, 525, S[1] + 34, "g", { class: "hlbl", fill: INK });
          const hd = s.el("circle", { r: 15, fill: U, stroke: "#fff", "stroke-width": 3 }), hh = s.el("circle", { r: 36, fill: "transparent" });
          svg.append(secA, secB, g, h, s.el("circle", { cx: S[0], cy: S[1], r: 7, fill: INK }), aL, bL, gL, hd, hh);
          const vA = s.h("span", { style: { color: RED, marginRight: "28px" } }), vB = s.h("span", { style: { color: BLUE } });
          const valRow = s.h("p", { class: "h2 mono later" }, vA, "   ", vB);
          const sum = s.h("p", { class: "big later", style: { color: U }, html: gk("α + β = 180°") });
          function render() {
            const t = th * D2R, d = [Math.cos(t), -Math.sin(t)];
            setL(h, S[0] - 330 * d[0], S[1] - 330 * d[1], S[0] + 330 * d[0], S[1] + 330 * d[1]);
            hd.setAttribute("cx", S[0] + RH * d[0]); hd.setAttribute("cy", S[1] + RH * d[1]); hh.setAttribute("cx", S[0] + RH * d[0]); hh.setAttribute("cy", S[1] + RH * d[1]);
            secA.setAttribute("d", arcD(S[0], S[1], 64, 0, th, true)); secB.setAttribute("d", arcD(S[0], S[1], 56, th, 180, true));
            const ra = th < 35 ? 120 : 98, rb = th > 145 ? 120 : 98;
            aL.setAttribute("x", S[0] + ra * Math.cos(t / 2)); aL.setAttribute("y", S[1] - ra * Math.sin(t / 2) + 10);
            const mb = (th + 180) / 2 * D2R; bL.setAttribute("x", S[0] + rb * Math.cos(mb)); bL.setAttribute("y", S[1] - rb * Math.sin(mb) + 10);
            vA.innerHTML = gk(`α = ${th}°`); vB.innerHTML = gk(`β = ${180 - th}°`);
          }
          let prev = th;
          s.drag(hh, { space: svg, onMove: p => {
            let na = Math.atan2(S[1] - p.y, p.x - S[0]) / D2R; if (na < 0) na += 180;
            na = clamp(Math.round(na), 15, 165);
            if (na !== th) { th = na; render(); if (Math.abs(na - prev) >= 5) { prev = na; s.sfx.tick(); } }
          } });
          render();
          const chip = s.h("span", { class: "chip", style: { background: SOFT, color: U, fontSize: "19px", alignSelf: "flex-start" } }, "Ausblick Klasse 6");
          const hint = s.h("p", { class: "small pencil" }, "Zieh am lila Punkt: Die Gerade h dreht sich.");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px" } }, s.h("b", null, "Nebenwinkel"), " liegen nebeneinander an einer Geraden. Zusammen bilden sie einen gestreckten Winkel: ", s.h("b", null, "180°"), ".");
          const exb = s.h("div", { class: "ex later", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, "So rechnest du"), s.h("p", { class: "small", html: gk("α = 40°  →  β = 180° − 40° = <b>140°</b>") }));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "560px 1fr", alignItems: "center", height: "100%", gap: "24px" } }, svg,
            s.h("div", { class: "stack", style: { gap: "12px" } }, chip, hint, valRow, sum, merk, exb)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          const turn = async to => { const from = th; await s.tween({ from, to, dur: 1300, update: v => { th = Math.round(v); render(); } }); th = to; render(); };
          s.step(async () => { s.sfx.pop(); s.show(secA, "pop"); await s.show(aL, "pop"); s.show(valRow, "up"); s.say("Hier ist der Winkel Alpha."); });
          s.step(async () => { s.sfx.pop(); s.show(secB, "pop"); await s.show(bL, "pop"); s.sfx.chord([0, 4, 7]); await s.show(sum, "zoom"); s.say("Daneben liegt Beta. Zusammen ergeben sie eine gerade Linie: hundertachtzig Grad."); });
          s.step(async () => { s.say("Wir drehen die Gerade. Alpha wird größer, Beta kleiner – zusammen bleiben es hundertachtzig Grad."); await turn(120); s.sfx.ding(); await turn(40); s.sfx.ding(); });
          s.step(async () => { s.sfx.success(); await s.show(merk, "up"); await s.show(exb, "up"); });
        },
      },
      /* 13f ─────────────────────────────── Scheitelwinkel (Ausblick Klasse 6) */
      {
        title: "Scheitelwinkel: gleich groß",
        say: "An einer Kreuzung entstehen vier Winkel. Die Winkel, die sich am Scheitel gegenüberliegen, heißen Scheitelwinkel. Sie sind gleich groß.",
        build(s) {
          const svg = box(s, 560, 480), S = [280, 245], RH = 205;
          let th = 50;
          const C1 = ["rgba(220,59,42,.24)", RED], C2 = ["rgba(29,91,208,.18)", BLUE];
          const sec = [C1, C2, C1, C2].map(([f, c], i) => pth(s, "", { fill: f, stroke: c, "stroke-width": 3.5 }));
          const ghost = pth(s, "", { fill: "rgba(220,59,42,.45)", stroke: RED, "stroke-width": 3, "stroke-dasharray": "6 5", class: "later" });
          const g = ln(s, 20, S[1], 540, S[1], { stroke: INK, "stroke-width": 5 });
          const h = ln(s, 0, 0, 0, 0, { stroke: U, "stroke-width": 5 });
          const labs = ["α", "β", "γ", "δ"].map((n, i) => grk(tx(s, 0, 0, n, { fill: i % 2 ? BLUE : RED, "font-weight": 700, style: { fontSize: "30px" } })));
          const hd = s.el("circle", { r: 15, fill: U, stroke: "#fff", "stroke-width": 3 }), hh = s.el("circle", { r: 36, fill: "transparent" });
          svg.append(...sec, g, h, ghost, s.el("circle", { cx: S[0], cy: S[1], r: 7, fill: INK }), ...labs, hd, hh);
          const vals = [0, 1, 2, 3].map(i => s.h("span", { class: "h2 mono", style: { color: i % 2 ? BLUE : RED } }));
          const grid = s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 20px" } }, vals[0], vals[2], vals[1], vals[3]);
          function render() {
            const t = th * D2R, d = [Math.cos(t), -Math.sin(t)];
            setL(h, S[0] - 330 * d[0], S[1] - 330 * d[1], S[0] + 330 * d[0], S[1] + 330 * d[1]);
            hd.setAttribute("cx", S[0] + RH * d[0]); hd.setAttribute("cy", S[1] + RH * d[1]); hh.setAttribute("cx", S[0] + RH * d[0]); hh.setAttribute("cy", S[1] + RH * d[1]);
            const b = [0, th, 180, 180 + th, 360];
            sec.forEach((p, i) => p.setAttribute("d", arcD(S[0], S[1], i % 2 ? 54 : 62, b[i], b[i + 1], true)));
            labs.forEach((l, i) => { const w = b[i + 1] - b[i], m = (b[i] + w / 2) * D2R, r = w < 35 ? 122 : 96; l.setAttribute("x", S[0] + r * Math.cos(m)); l.setAttribute("y", S[1] - r * Math.sin(m) + 10); });
            ["α", "β", "γ", "δ"].forEach((n, i) => (vals[i].innerHTML = gk(`${n} = ${i % 2 ? 180 - th : th}°`)));
          }
          s.drag(hh, { space: svg, onMove: p => {
            let na = Math.atan2(S[1] - p.y, p.x - S[0]) / D2R; if (na < 0) na += 180;
            na = clamp(Math.round(na), 15, 165);
            if (na !== th) { th = na; render(); if (na % 5 === 0) s.sfx.tick(); }
          } });
          render();
          const chip = s.h("span", { class: "chip", style: { background: SOFT, color: U, fontSize: "19px", alignSelf: "flex-start" } }, "Ausblick Klasse 6");
          const res = s.h("p", { class: "big later", style: { color: U }, html: gk("α = γ&nbsp;&nbsp;&nbsp;&nbsp;β = δ") });
          const why = s.h("div", { class: "ex later", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, "Warum?"),
            s.h("p", { class: "small", html: gk("α + β = 180° und γ + β = 180° (Nebenwinkel).") }), s.h("p", { class: "small", html: gk("Also müssen α und γ gleich groß sein.") }));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px" } }, s.h("b", null, "Scheitelwinkel"), " liegen sich am Scheitel gegenüber. Sie sind immer ", s.h("b", null, "gleich groß"), ".");
          const life = s.h("div", { class: "life later", style: { padding: "8px 16px" } }, s.h("p", { class: "small" }, s.h("b", null, "Schere: "), "So weit die Klingen offen sind, so weit sind auch die Griffe offen."));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "560px 1fr", alignItems: "center", height: "100%", gap: "24px" } }, svg,
            s.h("div", { class: "stack", style: { gap: "12px" } }, chip, grid, res, why, merk, life)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          s.step(async () => {
            s.say("Gegenüber von Alpha liegt Gamma. Wir drehen eine Kopie von Alpha einmal halb herum.");
            ghost.setAttribute("d", arcD(S[0], S[1], 62, 0, th, true));             ghost.classList.remove("later"); ghost.setAttribute("transform", ""); s.sfx.whoosh();
            await s.tween({ from: 0, to: 180, dur: 1500, ease: "inOut", update: v => ghost.setAttribute("transform", `rotate(${-v} ${S[0]} ${S[1]})`) });
            s.sfx.snap(); s.sfx.chord([0, 4, 7]); await s.show(res, "zoom"); s.say("Sie passt genau auf Gamma! Alpha und Gamma sind gleich groß.");
          });
          s.step(async () => { s.hide(ghost); s.sfx.pop(); await s.show(why, "up"); s.say("Alpha und Beta sind zusammen hundertachtzig Grad. Gamma und Beta auch. Also sind Alpha und Gamma gleich."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.sound("scissors", { vol: .5, dur: 1.5 }); await s.show(life, "up"); s.say("Zieh am lila Punkt und probier es aus!"); });
        },
      },
      /* 13g ─────────────────────────────── Stufen- und Wechselwinkel (Ausblick Klasse 6) */
      {
        title: "Stufen- und Wechselwinkel",
        say: "Jetzt schneidet eine Gerade zwei Parallelen. An beiden Kreuzungen entstehen die gleichen Winkel.",
        build(s) {
          const svg = box(s, 560, 500), M = [280, 255], Y1 = 150, Q = [280, 360], RH = 225;
          let th = 60, phi = 0, mode = "stufen";
          const g1 = ln(s, 20, Y1, 540, Y1, { stroke: BLUE, "stroke-width": 5 }), g2 = ln(s, 0, 0, 0, 0, { stroke: BLUE, "stroke-width": 5 });
          const h = ln(s, 0, 0, 0, 0, { stroke: U, "stroke-width": 5 });
          const hl = pth(s, "", { stroke: "#ffd94a", "stroke-width": 16, opacity: .75, class: "later" });
          const sa = pth(s, "", { fill: "rgba(220,59,42,.28)", stroke: RED, "stroke-width": 3.5, class: "later" });
          const sb = pth(s, "", { fill: "rgba(19,138,90,.26)", stroke: GREEN, "stroke-width": 3.5, class: "later" });
          const ghost = pth(s, "", { fill: "rgba(19,138,90,.45)", stroke: GREEN, "stroke-width": 3, "stroke-dasharray": "6 5", class: "later" });
          const aL = grk(tx(s, 0, 0, "α", { fill: RED, "font-weight": 700, class: "lbl later", style: { fontSize: "28px" } }));
          const bL = grk(tx(s, 0, 0, "β", { fill: GREEN, "font-weight": 700, class: "lbl later", style: { fontSize: "28px" } }));
          const g1L = tx(s, 528, Y1 - 14, "g", { class: "hlbl", fill: BLUE }), g2L = tx(s, 528, Q[1] + 36, "k", { class: "hlbl", fill: BLUE });
          const d1 = s.el("circle", { r: 6, fill: INK }), d2 = s.el("circle", { r: 6, fill: INK });
          const hd = s.el("circle", { r: 15, fill: U, stroke: "#fff", "stroke-width": 3 }), hh = s.el("circle", { r: 36, fill: "transparent" });
          svg.append(hl, sa, sb, g1, g2, h, ghost, d1, d2, aL, bL, g1L, g2L, hd, hh);
          const vA = s.h("span", { style: { color: RED, marginRight: "28px" } }), vB = s.h("span", { style: { color: GREEN } });
          const valRow = s.h("p", { class: "h2 mono" }, vA, "   ", vB);
          const verdict = s.h("p", { class: "t", style: { fontWeight: 700, minHeight: "32px" } });
          let S1, S2;
          function geo() {
            const d = [Math.cos(th * D2R), -Math.sin(th * D2R)], e = [Math.cos(phi * D2R), -Math.sin(phi * D2R)];
            S1 = [M[0] + d[0] * (M[1] - Y1) / Math.sin(th * D2R), Y1];
            const det = -d[0] * e[1] + e[0] * d[1], qx = Q[0] - M[0], qy = Q[1] - M[1];
            const t = (-qx * e[1] + e[0] * qy) / det;
            S2 = [M[0] + t * d[0], M[1] + t * d[1]];
            return { d, e };
          }
          function render() {
            const { d, e } = geo();
            setL(h, M[0] - 360 * d[0], M[1] - 360 * d[1], M[0] + 360 * d[0], M[1] + 360 * d[1]);
            setL(g2, Q[0] - 280 * e[0], Q[1] - 280 * e[1], Q[0] + 280 * e[0], Q[1] + 280 * e[1]);
            g2L.setAttribute("y", Q[1] + 36 - 248 * Math.sin(phi * D2R));
            d1.setAttribute("cx", S1[0]); d1.setAttribute("cy", S1[1]); d2.setAttribute("cx", S2[0]); d2.setAttribute("cy", S2[1]);
            const H = [M[0] + RH * d[0], M[1] + RH * d[1]];
            hd.setAttribute("cx", H[0]); hd.setAttribute("cy", H[1]); hh.setAttribute("cx", H[0]); hh.setAttribute("cy", H[1]);
            const R = 54;
            const a0 = mode === "stufen" ? 0 : 180, a1 = mode === "stufen" ? th : 180 + th;
            sa.setAttribute("d", arcD(S1[0], S1[1], R, a0, a1, true));
            sb.setAttribute("d", arcD(S2[0], S2[1], R, phi, th, true));
            const ma = (a0 + a1) / 2 * D2R, mb = (phi + th) / 2 * D2R, rl = th < 50 ? 112 : 84;
            aL.setAttribute("x", S1[0] + rl * Math.cos(ma)); aL.setAttribute("y", S1[1] - rl * Math.sin(ma) + 9);
            bL.setAttribute("x", S2[0] + rl * Math.cos(mb)); bL.setAttribute("y", S2[1] - rl * Math.sin(mb) + 9);
            const L = 120, ub = [S1[0] + 70 * d[0], S1[1] + 70 * d[1]];
            hl.setAttribute("d", mode === "stufen"
              ? `M${ub[0]},${ub[1]} L${S2[0]},${S2[1]} M${S1[0]},${S1[1]} L${S1[0] + L},${S1[1]} M${S2[0]},${S2[1]} L${S2[0] + L * e[0]},${S2[1] + L * e[1]}`
              : `M${S1[0] - L},${S1[1]} L${S1[0]},${S1[1]} L${S2[0]},${S2[1]} L${S2[0] + L * e[0]},${S2[1] + L * e[1]}`);
            const b = th - phi;
            vA.innerHTML = gk(`α = ${th}°`); vB.innerHTML = gk(`β = ${Math.round(b)}°`);
            verdict.innerHTML = "";
            if (phi === 0) verdict.append(s.h("span", { style: { color: GREEN } }, mode === "stufen" ? "Stufenwinkel (F): gleich groß" : "Wechselwinkel (Z): gleich groß"));
            else verdict.append(s.h("span", { style: { color: RED } }, "g und k nicht parallel: nicht gleich!"));
          }
          s.drag(hh, { space: svg, onMove: p => {
            let na = Math.atan2(M[1] - p.y, p.x - M[0]) / D2R; if (na < 0) na += 180;
            na = clamp(Math.round(na), 40, 140);
            if (na !== th) { th = na; render(); if (na % 5 === 0) s.sfx.tick(); }
          } });
          render();
          const setMode = m => { mode = m; bS.classList.toggle("solid", m === "stufen"); bW.classList.toggle("solid", m === "wechsel"); render(); };
          let busy = false;
          const tilt = async to => { const f = phi; await s.tween({ from: f, to, dur: 900, update: v => { phi = Math.round(v); render(); } }); phi = to; render(); bT.textContent = phi ? "k wieder parallel" : "k schief stellen"; };
          const bS = s.h("button", { class: "btn solid", onclick: () => { s.sfx.click(); setMode("stufen"); } }, "Stufenwinkel");
          const bW = s.h("button", { class: "btn", onclick: () => { s.sfx.click(); setMode("wechsel"); } }, "Wechselwinkel");
          const bT = s.h("button", { class: "btn", onclick: async () => { if (busy) return; busy = true; s.sfx.whoosh(); await tilt(phi ? 0 : 14); s.sfx.snap(); busy = false; } }, "k schief stellen");
          const btns = s.h("div", { class: "row later", style: { gap: "10px" } }, bS, bW, bT);
          const chip = s.h("span", { class: "chip", style: { background: SOFT, color: U, fontSize: "19px", alignSelf: "flex-start" } }, "Ausblick Klasse 6");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "20px", padding: "8px 16px 10px" } }, "Werden zwei ", s.h("b", null, "Parallelen"), " geschnitten, sind ", s.h("b", null, "Stufenwinkel"), " (F-Form) und ", s.h("b", null, "Wechselwinkel"), " (Z-Form) gleich groß.");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "560px 1fr", alignItems: "center", height: "100%", gap: "24px" } }, svg,
            s.h("div", { class: "stack", style: { gap: "12px" } }, chip, valRow, verdict, merk, btns)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          const fly = async kind => {
            geo(); ghost.setAttribute("d", arcD(S2[0], S2[1], 54, phi, th, true)); ghost.setAttribute("transform", ""); ghost.classList.remove("later"); s.sfx.whoosh();
            if (kind === "stufen") await s.tween({ dur: 1300, ease: "inOut", update: v => ghost.setAttribute("transform", `translate(${(S1[0] - S2[0]) * v},${(S1[1] - S2[1]) * v})`) });
            else { const C = [(S1[0] + S2[0]) / 2, (S1[1] + S2[1]) / 2]; await s.tween({ dur: 1500, ease: "inOut", update: v => ghost.setAttribute("transform", `rotate(${180 * v} ${C[0]} ${C[1]})`) }); }
            s.sfx.snap(); s.sfx.chord([0, 4, 7]); await s.wait(500); s.hide(ghost);
          };
          s.step(async () => {
            busy = true; s.show(hl, "fade"); s.show(sa, "pop"); s.show(aL, "pop"); s.show(sb, "pop"); await s.show(bL, "pop");
            s.say("Stufenwinkel liegen an beiden Kreuzungen an der gleichen Stelle, wie bei einem F. Wir schieben Beta nach oben."); await fly("stufen"); busy = false;
          });
          s.step(async () => { busy = true; setMode("wechsel"); s.sfx.zap(); s.say("Wechselwinkel liegen über Kreuz, wie bei einem Z. Wir drehen Beta halb herum."); await fly("wechsel"); busy = false; });
          s.step(async () => { busy = true; s.say("Ist die Gerade k nicht parallel zu g, stimmt es nicht mehr!"); s.sfx.boing(); await tilt(14); await s.wait(700); s.sfx.whoosh(); await tilt(0); s.sfx.ding(); busy = false; });
          s.step(async () => { s.sfx.success(); await s.show(merk, "up"); await s.show(btns, "up"); s.say("Zieh am lila Punkt und probier beide Winkel aus."); });
        },
      },
      /* 13h ─────────────────────────────── Geradenkreuzungen im Alltag */
      {
        title: "Im Alltag: Kreuzungen",
        say: "Neben-, Scheitel- und Stufenwinkel findest du an der Schere, an der Leiter, an Straßenbahngleisen und im Straßennetz.",
        build(s) {
          const card = (title, chip, text, mk) => {
            const svg = s.svg(480, 180); const play = mk(svg);
            const c = s.h("div", { class: "life later", style: { display: "flex", flexDirection: "column", gap: "6px", padding: "10px 16px", cursor: "pointer" }, onclick: () => { s.sfx.click(); play(); } },
              svg, s.h("div", { class: "row", style: { justifyContent: "space-between", flexWrap: "nowrap" } }, s.h("span", { class: "t", style: { fontWeight: 700 } }, title), s.h("span", { class: "chip", style: { background: SOFT, color: U, fontSize: "19px" } }, chip)), s.h("p", { class: "small" }, text));
            return { c, play };
          };
          const cards = [
            card("Schere", "Scheitelwinkel", "Klingen und Griffe öffnen sich immer gleich weit.", svg => {
              const P0 = [240, 85], g = s.el("g"); svg.append(g);
              const set = o => {
                g.innerHTML = "";
                const u = (a, r) => [P0[0] + r * Math.cos(a * D2R), P0[1] - r * Math.sin(a * D2R)];
                const b1 = u(o / 2, 190), b2 = u(-o / 2, 190), h1 = u(180 + o / 2, 120), h2 = u(180 - o / 2, 120);
                g.append(pth(s, arcD(P0[0], P0[1], 64, -o / 2, o / 2, true), { fill: "rgba(220,59,42,.25)", stroke: RED, "stroke-width": 3 }), pth(s, arcD(P0[0], P0[1], 64, 180 - o / 2, 180 + o / 2, true), { fill: "rgba(220,59,42,.25)", stroke: RED, "stroke-width": 3 }));
                g.append(ln(s, P0[0], P0[1], b1[0], b1[1], { stroke: "#8d96a3", "stroke-width": 9 }), ln(s, P0[0], P0[1], b2[0], b2[1], { stroke: "#a7b0bc", "stroke-width": 9 }));
                g.append(ln(s, P0[0], P0[1], h1[0], h1[1], { stroke: U, "stroke-width": 10 }), ln(s, P0[0], P0[1], h2[0], h2[1], { stroke: U, "stroke-width": 10 }));
                [h1, h2].forEach(p => g.append(s.el("circle", { cx: p[0], cy: p[1], r: 16, fill: "#fff", stroke: U, "stroke-width": 7 })));
                g.append(s.el("circle", { cx: P0[0], cy: P0[1], r: 6, fill: INK }), tx(s, P0[0] + 96, P0[1] + 8, Math.round(o) + "°", { fill: RED, "font-weight": 700, "text-anchor": "start" }), tx(s, P0[0] - 96, P0[1] + 8, Math.round(o) + "°", { fill: RED, "font-weight": 700, "text-anchor": "end" }));
              };
              set(30);
              return async () => { s.sound("scissors", { vol: .5, dur: 1.2 }); await s.tween({ from: 30, to: 6, dur: 500, update: set }); await s.tween({ from: 6, to: 40, dur: 900, update: set }); await s.tween({ from: 40, to: 30, dur: 500, update: set }); };
            }),
            card("Leiter", "Nebenwinkel", "Sicher steht sie mit 65° bis 75° zum Boden. Auf der anderen Seite: 180° − 70° = 110°.", svg => {
              const F = [300, 140], L = 130, g = s.el("g");
              svg.append(s.el("rect", { x: 20, y: 142, width: 440, height: 38, fill: "#eadfc6" }), s.el("rect", { x: 352, y: 0, width: 20, height: 140, fill: "#c9b79c" }), ln(s, 20, 141, 460, 141, { stroke: "#8a6d3b", "stroke-width": 5 }), g,
                tx(s, F[0] + 34, 170, "70°", { fill: RED, "font-weight": 700 }), tx(s, F[0] - 50, 170, "110°", { fill: BLUE, "font-weight": 700 }));
              const set = a => {
                g.innerHTML = ""; const t = a * D2R, T2 = [F[0] + L * Math.cos(t), F[1] - L * Math.sin(t)];
                g.append(pth(s, arcD(F[0], F[1], 46, 0, a, true), { fill: "rgba(220,59,42,.25)", stroke: RED, "stroke-width": 3 }), pth(s, arcD(F[0], F[1], 38, a, 180, true), { fill: "rgba(29,91,208,.18)", stroke: BLUE, "stroke-width": 3 }));
                const n = [Math.sin(t) * 9, Math.cos(t) * 9];
                g.append(ln(s, F[0] - n[0], F[1] - n[1], T2[0] - n[0], T2[1] - n[1], { stroke: ORANGE, "stroke-width": 5 }), ln(s, F[0] + n[0], F[1] + n[1], T2[0] + n[0], T2[1] + n[1], { stroke: ORANGE, "stroke-width": 5 }));
                for (let k = 1; k < 6; k++) { const q = [F[0] + L * k / 6 * Math.cos(t), F[1] - L * k / 6 * Math.sin(t)]; g.append(ln(s, q[0] - n[0], q[1] - n[1], q[0] + n[0], q[1] + n[1], { stroke: ORANGE, "stroke-width": 4 })); }
              };
              set(70);
              return async () => { s.sfx.whoosh(); await s.tween({ from: 88, to: 70, dur: 1100, ease: "out", update: set }); s.sound("holzblock", { vol: .5 }); };
            }),
            card("Straßenbahngleise", "Stufenwinkel", "Eine Straße kreuzt beide Schienen unter dem gleichen Winkel.", svg => {
              const ys = [62, 112], a = 55, t = a * D2R, cx = 240;
              const xAt = y => cx - 40 + (87 - y) / Math.tan(t);
              svg.append(s.el("polygon", { points: P([[xAt(185) - 50, 185], [xAt(185) + 50, 185], [xAt(-5) + 50, -5], [xAt(-5) - 50, -5]]), fill: "#c9ced6" }));
              const ax = [xAt(ys[0]), xAt(ys[1])];
              svg.append(ln(s, xAt(185), 185, xAt(-5), -5, { stroke: "#fff", "stroke-width": 3, "stroke-dasharray": "14 12" }));
              ys.forEach((y, i) => svg.append(ln(s, 0, y, 480, y, { stroke: "#5d6678", "stroke-width": 6 }), pth(s, arcD(ax[i], y, 34, 0, a, true), { fill: "rgba(220,59,42,.3)", stroke: RED, "stroke-width": 3 }), tx(s, ax[i] + 64, y - 8, a + "°", { fill: RED, "font-weight": 700, "text-anchor": "start" })));
              const tram = s.el("g");
              tram.append(s.el("rect", { x: 0, y: 66, width: 130, height: 42, rx: 10, fill: "#f0d722", stroke: INK, "stroke-width": 2 }));
              for (let k = 0; k < 4; k++) tram.append(s.el("rect", { x: 10 + k * 30, y: 72, width: 22, height: 16, rx: 3, fill: "#cfe8f5" }));
              svg.append(tram);
              const set = v => tram.setAttribute("transform", `translate(${-140 + v * 760},0)`);
              set(0);
              return async () => { s.sound("tram-bell", { vol: .45, dur: 2 }); await s.tween({ from: 0, to: 1, dur: 2400, ease: "linear", update: set }); set(0); };
            }),
            card("Stadtplan von Mannheim", "überall 90°", "Die Innenstadt ist wie ein Schachbrett: Parallele Straßen kreuzen sich rechtwinklig.", svg => {
              svg.append(s.el("rect", { x: 40, y: 4, width: 400, height: 162, rx: 8, fill: "#e9e2cf" }));
              const xs = [100, 180, 260, 340, 420].map(x => x - 20), ys2 = [30, 85, 140];
              xs.forEach(x => svg.append(ln(s, x, 4, x, 166, { stroke: "#fff", "stroke-width": 12, "stroke-linecap": "butt" })));
              ys2.forEach(y => svg.append(ln(s, 40, y, 440, y, { stroke: "#fff", "stroke-width": 12, "stroke-linecap": "butt" })));
              const marks = s.el("g", { class: "later" });
              xs.forEach(x => marks.append(pth(s, `M${x + 8},${85 - 6} L${x + 8 + 18},${85 - 6} L${x + 8 + 18},${85 - 24}`, { stroke: RED, "stroke-width": 3 })));
              svg.append(marks);
              const car = s.el("circle", { r: 8, fill: RED, stroke: "#fff", "stroke-width": 2 }); svg.append(car);
              const path = [[40, 85], [240, 85], [240, 140], [440, 140]];
              const set = v => { const segs = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1])); let d = v * segs.reduce((a, b) => a + b, 0), i = 0; while (i < segs.length - 1 && d > segs[i]) { d -= segs[i]; i++; } const k = Math.min(1, d / segs[i]); car.setAttribute("cx", path[i][0] + (path[i + 1][0] - path[i][0]) * k); car.setAttribute("cy", path[i][1] + (path[i + 1][1] - path[i][1]) * k); };
              set(0); s.show(marks, "fade");
              return async () => { s.hide(marks); s.sound("traffic", { vol: .35, dur: 2 }); await s.tween({ from: 0, to: 1, dur: 2000, ease: "linear", update: set }); s.sfx.ding(); s.show(marks, "fade"); };
            }),
          ];
          s.add(s.h("div", { class: "cols", style: { height: "100%", gap: "16px 20px", gridTemplateRows: "1fr 1fr" } }, cards.map(c => c.c)));
          const reveal = async i => { s.sfx.pop(); await s.show(cards[i].c, "up"); await cards[i].play(); };
          reveal(0);
          s.step(async () => { await reveal(1); s.say("Leiter und Boden: Nebenwinkel, zusammen hundertachtzig Grad."); });
          s.step(async () => { await reveal(2); s.say("Die Schienen sind parallel. Darum kreuzt die Straße beide unter dem gleichen Winkel."); });
          s.step(async () => { await reveal(3); s.say("In Mannheim sind die Straßen wie ein Schachbrett angelegt. Tippe eine Karte an, dann läuft sie nochmal."); });
        },
      },
      /* 13a ─────────────────────────────── Dreiecke nach Seiten */
      {
        title: "Dreiecke nach Seiten",
        say: "Dreiecke kann man nach ihren Seiten ordnen: gleichseitig, gleichschenklig oder unregelmäßig.",
        build(s) {
          /* tick marks on a side: n small strokes across the midpoint */
          const ticks = (p, q, n, col) => {
            const g = s.el("g"), mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, l = Math.hypot(q[0] - p[0], q[1] - p[1]);
            const u = [(q[0] - p[0]) / l, (q[1] - p[1]) / l], nn = [-u[1], u[0]];
            for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * 8; const c = [mx + u[0] * o, my + u[1] * o]; g.append(ln(s, c[0] - nn[0] * 11, c[1] - nn[1] * 11, c[0] + nn[0] * 11, c[1] + nn[1] * 11, { stroke: col, "stroke-width": 3.5 })); }
            return g;
          };
          const TYPES = [
            { name: "gleichseitig", col: RED, pts: [[50, 190], [250, 190], [150, 16.8]], same: [1, 1, 1], cols: [RED, RED, RED],
              text: "Alle drei Seiten sind gleich lang.", life: "Das Schild „Vorfahrt gewähren“ ist ein gleichseitiges Dreieck.", snd: () => s.sound("tram-bell", { vol: .4, dur: 2 }) },
            { name: "gleichschenklig", col: BLUE, pts: [[75, 190], [225, 190], [150, 22]], same: [0, 1, 1], cols: [ORANGE, BLUE, BLUE],
              text: "Zwei Seiten (die Schenkel) sind gleich lang. Die dritte heißt Basis.", life: "Ein Hausgiebel und das Geodreieck sind gleichschenklig.", snd: () => s.sound("hammer", { vol: .45 }) },
            { name: "unregelmäßig", col: GREEN, pts: [[22, 190], [278, 190], [205, 40]], same: [0, 0, 0], cols: [GREEN, ORANGE, U],
              text: "Alle drei Seiten sind verschieden lang.", life: "Ein schräg abgeschnittenes Stück Brot – jede Seite anders.", snd: () => s.sound("scissors", { vol: .5 }) },
          ];
          const cards = TYPES.map(T => {
            const svg = s.svg(300, 210), [A, B, C] = T.pts;
            const fillT = pg(s, T.pts, { fill: T.col, "fill-opacity": .1, stroke: "none" });
            const sides = [[A, B], [B, C], [C, A]].map(([p, q], i) => ln(s, p[0], p[1], q[0], q[1], { stroke: T.cols[i], "stroke-width": 5, class: "later" }));
            const tk = [[A, B], [B, C], [C, A]].map(([p, q], i) => { const n = T.name === "gleichseitig" ? 1 : T.same[i] ? 1 : 0; return n ? ticks(p, q, n, INK) : null; }).filter(Boolean);
            const tkG = s.el("g", { class: "later" }); tkG.append(...tk);
            svg.append(fillT, ...sides, tkG);
            if (T.name === "gleichschenklig") { const bl = tx(s, 150, 186, "Basis", { fill: ORANGE, "font-weight": 700, class: "lbl later" }); svg.append(bl); tkG.append(bl); }
            const card = s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "8px", padding: "12px 16px" } }, svg,
              s.h("p", { class: "h2", style: { color: T.col } }, T.name), s.h("p", { class: "t", style: { fontSize: "21px", minHeight: "60px" } }, T.text),
              s.h("p", { class: "small pencil", style: { minHeight: "54px" } }, T.life));
            return { card, sides, tkG, T };
          });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Gleich lange Seiten markiert man mit kleinen ", s.h("b", null, "Strichen"), ". Jedes gleichseitige Dreieck ist auch gleichschenklig!");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "16px" } }, s.h("div", { class: "cols3", style: { gap: "18px" } }, cards.map(c => c.card)), merk));
          const reveal = async c => {
            c.T.snd(); await s.show(c.card, "up");
            for (const l of c.sides) { s.sfx.zap(); await s.show(l, "draw"); undraw(l); }
            s.sfx.pop(); await s.show(c.tkG, "pop");
            s.say(c.T.text);
          };
          reveal(cards[0]);
          s.step(async () => { await reveal(cards[1]); });
          s.step(async () => { await reveal(cards[2]); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 13b ─────────────────────────────── Dreiecke nach Winkeln */
      {
        title: "Dreiecke nach Winkeln",
        say: "Man kann Dreiecke auch nach ihren Winkeln ordnen. Schieb die Ecke C und schau, wie sich die Winkel ändern.",
        build(s) {
          const svg = box(s, 560, 470), A = [100, 400], B = [460, 400], CY = 220;
          let cx = 230, lastK = "";
          const dir = (p, q) => Math.atan2(p[1] - q[1], q[0] - p[0]) / D2R;
          const tri = pg(s, [A, B, [cx, CY]], { fill: "#f6f2ff", stroke: INK, "stroke-width": 4 });
          const guide = ln(s, 16, CY, 544, CY, { stroke: PENCIL, "stroke-width": 2, "stroke-dasharray": "6 8" });
          const mk = col => ({ sec: pth(s, "", { fill: col, "fill-opacity": .22, stroke: col, "stroke-width": 3 }), rm: pth(s, "", { stroke: col, "stroke-width": 3 }), lab: grk(tx(s, 0, 0, "", { fill: col, "font-weight": 700, style: { fontSize: "26px" } })) });
          const parts = [mk(RED), mk(BLUE), mk(GREEN)];
          const names = [tx(s, A[0] - 8, A[1] + 34, "A", { "font-weight": 700 }), tx(s, B[0] + 8, B[1] + 34, "B", { "font-weight": 700 }), tx(s, 0, 0, "C", { "font-weight": 700 })];
          const hd = s.el("circle", { r: 15, fill: U, stroke: "#fff", "stroke-width": 3 }), hh = s.el("circle", { r: 34, fill: "transparent" });
          svg.append(guide, tri, ...parts.flatMap(p => [p.sec, p.rm]), ...parts.map(p => p.lab), ...names, hd, hh);
          const name = s.h("p", { class: "big", style: { color: U } });
          const vals = s.h("p", { class: "h2 mono" });
          const ROWS = [["spitzwinklig", "alle drei Winkel kleiner als 90°"], ["rechtwinklig", "ein Winkel genau 90°"], ["stumpfwinklig", "ein Winkel größer als 90°"]];
          const rows = ROWS.map(([k, r]) => s.h("div", { class: "row", style: { gap: "12px", flexWrap: "nowrap", padding: "6px 12px", borderRadius: "12px", transition: "background .2s" } },
            s.h("span", { class: "t", style: { fontWeight: 700, minWidth: "180px" } }, k), s.h("span", { class: "small" }, r)));
          function render() {
            const C = [cx, CY];
            tri.setAttribute("points", P([A, B, C]));
            const V = [[A, B, C], [B, C, A], [C, A, B]];
            const ang = V.map(([p, q, r]) => {
              let a1 = dir(p, q), a2 = dir(p, r); let d = ((a2 - a1) % 360 + 360) % 360; if (d > 180) { const t = a1; a1 = a2; a2 = t; d = 360 - d; }
              return { p, a1, a2: a1 + d, d };
            });
            const deg = ang.map(a => Math.round(a.d)); deg[2] = 180 - deg[0] - deg[1];
            ang.forEach((a, i) => {
              const pt = parts[i], right = deg[i] === 90, r = 44;
              pt.sec.setAttribute("d", right ? "" : arcD(a.p[0], a.p[1], r, a.a1, a.a2, true));
              if (right) { const u = [Math.cos(a.a1 * D2R), -Math.sin(a.a1 * D2R)], w = [Math.cos(a.a2 * D2R), -Math.sin(a.a2 * D2R)], k = 26; pt.rm.setAttribute("d", `M${a.p[0] + u[0] * k},${a.p[1] + u[1] * k} L${a.p[0] + (u[0] + w[0]) * k},${a.p[1] + (u[1] + w[1]) * k} L${a.p[0] + w[0] * k},${a.p[1] + w[1] * k}`); }
              else pt.rm.setAttribute("d", "");
              const m = (a.a1 + a.a2) / 2 * D2R, rr = deg[i] < 40 ? 80 : 66;
              pt.lab.setAttribute("x", a.p[0] + rr * Math.cos(m)); pt.lab.setAttribute("y", a.p[1] - rr * Math.sin(m) + 9);
              pt.lab.textContent = "αβγ"[i];
            });
            names[2].setAttribute("x", cx); names[2].setAttribute("y", CY - 22);
            hd.setAttribute("cx", cx); hd.setAttribute("cy", CY); hh.setAttribute("cx", cx); hh.setAttribute("cy", CY);
            const mx = Math.max(...deg), k = mx < 90 ? 0 : mx === 90 ? 1 : 2;
            name.textContent = ROWS[k][0];
            vals.innerHTML = gk(`α = ${deg[0]}°   β = ${deg[1]}°   γ = ${deg[2]}°`);
            rows.forEach((row, i) => { row.style.background = i === k ? U : "transparent"; row.style.color = i === k ? "#fff" : ""; });
            if (ROWS[k][0] !== lastK) { if (lastK) { k === 1 ? s.sfx.ding() : s.sfx.chord(k ? [-3, 0, 4] : [0, 4, 7]); } lastK = ROWS[k][0]; name.classList.remove("a-pop"); void name.offsetWidth; name.classList.add("a-pop"); }
          }
          const snapX = x => { for (const t of [A[0], 280, B[0]]) if (Math.abs(x - t) <= 7) return t; return x; };
          const sl = s.slider({ label: "Ecke C verschieben", min: 20, max: 540, step: 2, value: cx, fmt: () => "", onInput: v => { cx = snapX(v); render(); } });
          s.drag(hh, { space: svg, onMove: p => { const x = snapX(clamp(Math.round(p.x), 20, 540)); if (x !== cx) { cx = x; sl.input.value = x; render(); s.sfx.tick(); } } });
          render();
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Ein Dreieck hat ", s.h("b", null, "höchstens einen"), " rechten oder stumpfen Winkel. Die anderen beiden sind immer spitz.");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "560px 1fr", alignItems: "center", height: "100%", gap: "24px" } }, svg,
            s.h("div", { class: "stack", style: { gap: "10px" } }, name, vals, sl, s.h("div", { class: "stack", style: { gap: "4px" } }, rows), merk)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          const goC = async (to, txt) => { s.say(txt); const from = cx; await s.tween({ from, to, dur: 1200, ease: "inOut", update: v => { cx = Math.round(v); sl.input.value = cx; render(); } }); cx = to; sl.input.value = to; render(); };
          s.step(() => goC(380, "Spitzwinklig: Alle drei Winkel sind kleiner als neunzig Grad."));
          s.step(() => goC(280, "Rechtwinklig: Bei C ist jetzt genau ein rechter Winkel."));
          s.step(() => goC(520, "Stumpfwinklig: Bei B ist der Winkel größer als neunzig Grad."));
          s.step(async () => { s.sfx.success(); await s.show(merk, "up"); });
        },
      },
      /* 13c ─────────────────────────────── Winkelsumme */
      {
        title: "Winkelsumme: immer 180°",
        say: "Reiß die drei Ecken eines Dreiecks ab und leg sie nebeneinander. Sie bilden zusammen einen gestreckten Winkel: hundertachtzig Grad!",
        build(s) {
          const svg = box(s, 600, 520), A = [70, 300], B = [530, 300], C = [380, 50], R = 84, Pt = [300, 480];
          const dir = (p, q) => Math.atan2(p[1] - q[1], q[0] - p[0]) / D2R;
          const cols = [RED, BLUE, GREEN], greek = ["α", "β", "γ"];
          svg.append(pg(s, [A, B, C], { fill: "#f6f2ff", stroke: INK, "stroke-width": 4 }));
          const baseLine = ln(s, 60, Pt[1], 540, Pt[1], { stroke: INK, "stroke-width": 4, class: "later" });
          const dot = s.el("circle", { cx: Pt[0], cy: Pt[1], r: 6, fill: INK, class: "later" });
          svg.append(baseLine, dot);
          const V = [[A, B, C], [B, C, A], [C, A, B]].map(([p, q, r], i) => {
            let a1 = dir(p, q), a2 = dir(p, r); let d = ((a2 - a1) % 360 + 360) % 360; if (d > 180) { const t = a1; a1 = a2; a2 = t; d = 360 - d; }
            const g = s.el("g"), m = (a1 + d / 2) * D2R;
            g.append(pth(s, arcD(0, 0, R, a1, a1 + d, true), { fill: cols[i], "fill-opacity": .55, stroke: cols[i], "stroke-width": 3, "stroke-dasharray": "5 4" }));
            const lab = grk(tx(s, 0, 0, greek[i], { fill: INK, "font-weight": 700, style: { fontSize: "28px" } }));
            svg.append(g, lab);
            return { g, lab, p, a1, d, st: { x: p[0], y: p[1], r: 0 } };
          });
          const put = (v, x, y, r) => {
            v.st = { x, y, r }; v.g.setAttribute("transform", `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${r.toFixed(2)})`);
            const m = (v.a1 + v.d / 2 - r) * D2R, rr = v.d < 45 ? 62 : 50;
            v.lab.setAttribute("x", x + rr * Math.cos(m)); v.lab.setAttribute("y", y - rr * Math.sin(m) + 9);
          };
          V.forEach(v => put(v, v.p[0], v.p[1], 0));
          const go = (v, x, y, r, dur) => { const a = v.st; return s.tween({ dur, ease: "inOut", update: k => put(v, a.x + (x - a.x) * k, a.y + (y - a.y) * k - Math.sin(Math.PI * k) * 40, a.r + (r - a.r) * k) }); };
          // target start angles on the line: β from 0°, γ next, α last
          const deg = V.map(v => v.d), tgt = [deg[1] + deg[2], 0, deg[1]];
          const arc180 = pth(s, arcD(Pt[0], Pt[1], R + 14, 0, 180), { stroke: U, "stroke-width": 4, class: "later" });
          const l180 = tx(s, Pt[0] + R + 60, Pt[1] - 14, "180°", { fill: U, "font-weight": 800, class: "lbl later", style: { fontSize: "28px" } });
          svg.append(arc180, l180);
          const sum = s.h("p", { class: "big later", style: { color: U }, html: gk("α + β + γ = 180°") });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "In ", s.h("b", null, "jedem"), " Dreieck sind die drei Winkel zusammen ", s.h("b", null, "180°"), " groß – egal wie das Dreieck aussieht.");
          const exs = s.h("div", { class: "ex later", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, "So rechnest du damit"),
            s.h("p", { class: "small", html: gk("α = 50°, β = 70°  →  γ = 180° − 50° − 70° = <b>60°</b>") }),
            s.h("p", { class: "small" }, "Gleichseitig: 60° + 60° + 60° = 180°"),
            s.h("p", { class: "small" }, "Geodreieck: 90° + 45° + 45° = 180°"));
          let busy = false;
          const tear = async () => {
            s.sfx.zap(); s.sound("paper-crumple", { vol: .45, dur: 1 });
            await Promise.all(V.map((v, i) => { const c = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3], dx = v.p[0] - c[0], dy = v.p[1] - c[1], l = Math.hypot(dx, dy); return go(v, v.p[0] + dx / l * 30, v.p[1] + dy / l * 30, 0, 500); }));
          };
          const place = async () => {
            for (const i of [1, 2, 0]) { s.sfx.whoosh(); let r = -(tgt[i] - V[i].a1); r = ((r + 180) % 360 + 360) % 360 - 180; await go(V[i], Pt[0], Pt[1], r, 900); s.sfx.snap(); }
          };
          const again = async () => {
            if (busy) return; busy = true; s.sfx.click();
            V.forEach(v => put(v, v.p[0], v.p[1], 0)); s.hide([arc180, l180]);
            await s.wait(300); await tear(); await place(); s.sfx.ding(); s.show([arc180, l180], "pop"); busy = false;
          };
          const btn = s.h("button", { class: "btn later", style: { alignSelf: "flex-start" }, onclick: again }, "Nochmal abreißen");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "600px 1fr", alignItems: "center", height: "100%", gap: "24px" } }, svg,
            s.h("div", { class: "stack", style: { gap: "14px" } }, sum, merk, exs, btn)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          s.step(async () => { busy = true; s.say("Wir reißen die drei Ecken ab."); await tear(); busy = false; });
          s.step(async () => { busy = true; s.show(baseLine, "draw"); s.show(dot, "pop"); s.say("Jetzt legen wir sie an einem Punkt nebeneinander."); await place(); busy = false; });
          s.step(async () => { s.sfx.ding(); s.show([arc180, l180], "pop"); await s.show(sum, "zoom"); s.sfx.fanfare(); s.say("Eine gerade Linie: ein gestreckter Winkel, hundertachtzig Grad."); });
          s.step(async () => { s.sfx.pop(); await s.show(merk, "up"); await s.show(exs, "up"); s.show(btn, "pop"); });
        },
      },
      /* 13d ─────────────────────────────── Dreiecke im Alltag */
      {
        title: "Im Alltag: Dreiecke überall",
        say: "Dreiecke sind besonders stabil. Darum findest du sie in Brücken, Dächern, Fahrradrahmen – und dein Geodreieck ist selbst eins.",
        build(s) {
          /* stability demo: a square frame folds over, a triangle frame keeps its shape */
          const demo = s.svg(300, 400);
          const sqL = [0, 1, 2, 3].map(() => ln(s, 0, 0, 0, 0, { stroke: ORANGE, "stroke-width": 7 }));
          const trL = [0, 1, 2].map(() => ln(s, 0, 0, 0, 0, { stroke: GREEN, "stroke-width": 7 }));
          const joints = Array.from({ length: 7 }, () => s.el("circle", { r: 7, fill: INK }));
          const arrows = [0, 1].map(() => s.el("g", { class: "later" }));
          const capS = tx(s, 150, 186, "", { fill: ORANGE, "font-weight": 700, style: { fontSize: "21px" } }), capT = tx(s, 150, 388, "", { fill: GREEN, "font-weight": 700, style: { fontSize: "21px" } });
          demo.append(ln(s, 20, 160, 280, 160, { stroke: PENCIL, "stroke-width": 3 }), ln(s, 20, 360, 280, 360, { stroke: PENCIL, "stroke-width": 3 }), ...sqL, ...trL, ...joints, ...arrows, capS, capT);
          arrows.forEach((g, i) => { const y = i ? 250 : 50; g.append(ln(s, 10, y, 56, y, { stroke: RED, "stroke-width": 5 }), pg(s, [[68, y], [52, y - 9], [52, y + 9]], { fill: RED, stroke: RED, "stroke-width": 2 })); });
          const drawSq = v => { const th = (90 - 50 * v) * D2R, o = [120 * Math.cos(th), -120 * Math.sin(th)], a = [60, 160], b = [180, 160], c = [180 + o[0], 160 + o[1]], d = [60 + o[0], 160 + o[1]]; [[a, b], [b, c], [c, d], [d, a]].forEach(([p, q], i) => setL(sqL[i], p[0], p[1], q[0], q[1])); [a, b, c, d].forEach((p, i) => { joints[i].setAttribute("cx", p[0]); joints[i].setAttribute("cy", p[1]); }); };
          const drawTr = w => { const a = [80, 360], b = [220, 360], c = [150 + w, 236]; [[a, b], [b, c], [c, a]].forEach(([p, q], i) => setL(trL[i], p[0], p[1], q[0], q[1])); [a, b, c].forEach((p, i) => { joints[4 + i].setAttribute("cx", p[0]); joints[4 + i].setAttribute("cy", p[1]); }); };
          drawSq(0); drawTr(0); capS.textContent = "Viereck"; capT.textContent = "Dreieck";
          let busy = false;
          const push = async () => {
            if (busy) return; busy = true; s.sfx.click(); drawSq(0); drawTr(0); capS.textContent = "Viereck"; capT.textContent = "Dreieck";
            s.show(arrows, "left"); s.sfx.whoosh();
            await s.tween({ dur: 900, ease: "out", update: v => { drawSq(v); drawTr(Math.sin(v * Math.PI * 3) * 3 * (1 - v)); } });
            s.sfx.boing(); capS.textContent = "kippt um!"; capT.textContent = "bleibt stabil!"; s.sfx.ding(); s.hide(arrows); busy = false;
          };
          const left = s.h("div", { class: "ex", style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "10px 12px" } }, s.h("span", { class: "exlabel" }, "Warum Dreiecke?"), demo,
            s.h("button", { class: "btn", onclick: push }, "Drücken!"));
          const card = (id, pos, title, text) => s.h("div", { class: "life later", style: { display: "grid", gridTemplateColumns: "150px 1fr", gap: "12px", alignItems: "center", padding: "10px 12px" } },
            s.photo(id, { w: 150, h: 170, pos }), s.h("div", { class: "stack", style: { gap: "4px" } }, s.h("p", { class: "t", style: { fontWeight: 700, fontSize: "22px" } }, title), s.h("p", { class: "small" }, text)));
          const cards = [
            card("fachwerkbruecke", "50% 45%", "Brücke", "Eine Fachwerkbrücke besteht aus vielen Dreiecken. So trägt sie schwere Lasten."),
            card("giebel-dach", "50% 25%", "Dach", "Der Giebel eines Satteldachs ist ein Dreieck – meist gleichschenklig."),
            card("fahrrad-rahmen", "50% 50%", "Fahrrad", "Der Rahmen besteht aus zwei Dreiecken: vorne und hinten."),
            card("geodreieck-foto", "50% 50%", "Geodreieck", "Rechtwinklig und gleichschenklig: 90°\u00a0+\u00a045°\u00a0+\u00a045°\u00a0=\u00a0180°."),
          ];
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "330px 1fr", gap: "20px", alignItems: "center", height: "100%" } }, left,
            s.h("div", { class: "cols", style: { gap: "14px" } }, cards)));
          s.sfx.pop();
          s.step(async () => { s.say("Wir drücken von der Seite. Das Viereck kippt um, das Dreieck bleibt stabil."); await push(); });
          const snd = [() => s.sound("ubahn-train", { vol: .35, dur: 2.5 }), () => s.sound("hammer", { vol: .45 }), () => s.sound("bike-bell", { vol: .5 }), () => s.sound("pencil-write", { vol: .45, dur: 1.2 })];
          s.step(async () => { snd[0](); await s.show(cards[0], "up"); snd[1](); await s.show(cards[1], "up"); s.say("Brücken und Dächer."); });
          s.step(async () => { snd[2](); await s.show(cards[2], "up"); snd[3](); await s.show(cards[3], "up"); s.say("Der Fahrradrahmen und dein Geodreieck."); s.sfx.success(); });
        },
      },
      /* 14 ─────────────────────────────── */
      {
        title: "Kreise mit dem Zirkel",
        say: "Mit dem Zirkel zeichnest du Kreise. Die Spitze kommt in den Mittelpunkt, die Öffnung ist der Radius.",
        build(s) {
          const svg = box(s, 560, 520), M = [280, 290], PX = 40, LEG = 230;
          let r = 4, th = 0;
          const circ = s.el("circle", { cx: M[0], cy: M[1], r: r * PX, fill: "rgba(123,79,214,.10)", stroke: U, "stroke-width": 5, class: "later" });
          const trace = pth(s, "", { stroke: U, "stroke-width": 5 });
          const ruler = s.el("g", { class: "later" });
          ruler.append(s.el("rect", { x: M[0] - 16, y: M[1] + 14, width: 5.6 * PX + 32, height: 46, rx: 5, fill: "rgba(255,236,170,.92)", stroke: "#b08a2a", "stroke-width": 2 }));
          for (let i = 0; i <= 55; i++) { const x = M[0] + i * PX / 10; ruler.append(ln(s, x, M[1] + 14, x, M[1] + 14 + (i % 10 ? (i % 5 ? 7 : 11) : 16), { stroke: INK, "stroke-width": i % 10 ? 1 : 2, "stroke-linecap": "butt" })); }
          for (let i = 0; i <= 5; i++) ruler.append(tx(s, M[0] + i * PX, M[1] + 52, String(i), { style: { fontSize: "19px" }, "font-weight": 700 }));
          const rad = ln(s, M[0], M[1], M[0] + r * PX, M[1], { stroke: BLUE, "stroke-width": 4, "stroke-dasharray": "8 6", class: "later" });
          const rL = tx(s, 0, 0, "", { fill: BLUE, "font-weight": 700, class: "lbl later" });
          const Md = s.el("circle", { cx: M[0], cy: M[1], r: 7, fill: INK, class: "later" }), ML = tx(s, M[0] - 14, M[1] - 14, "M", { "font-weight": 700, "text-anchor": "end", class: "lbl later", style: { fontSize: "24px" } });
          const comp = s.el("g");
          const legN = ln(s, 0, 0, 0, 0, { stroke: "#6b7686", "stroke-width": 9 }), legP = ln(s, 0, 0, 0, 0, { stroke: "#6b7686", "stroke-width": 9 });
          const needle = ln(s, 0, 0, 0, 0, { stroke: INK, "stroke-width": 3 }), lead = ln(s, 0, 0, 0, 0, { stroke: "#ffc93c", "stroke-width": 7 });
          const head = s.el("circle", { r: 13, fill: "#4c5566" }), grip = s.el("rect", { width: 12, height: 30, rx: 5, fill: "#2c3442" });
          comp.append(legN, legP, needle, lead, grip, head);
          svg.append(circ, trace, ruler, rad, rL, Md, ML, comp);
          function placeComp(R, ang) {
            const tip = [M[0] + R * Math.cos(ang), M[1] - R * Math.sin(ang)];
            const mid = [(M[0] + tip[0]) / 2, (M[1] + tip[1]) / 2], hgt = Math.sqrt(Math.max(LEG * LEG - (R / 2) * (R / 2), 400));
            const hd = [mid[0], mid[1] - hgt * 0.9];
            const nk = [M[0] + (hd[0] - M[0]) * 0.1, M[1] + (hd[1] - M[1]) * 0.1], pk = [tip[0] + (hd[0] - tip[0]) * 0.12, tip[1] + (hd[1] - tip[1]) * 0.12];
            setL(legN, hd[0], hd[1], nk[0], nk[1]); setL(needle, nk[0], nk[1], M[0], M[1]);
            setL(legP, hd[0], hd[1], pk[0], pk[1]); setL(lead, pk[0], pk[1], tip[0], tip[1]);
            head.setAttribute("cx", hd[0]); head.setAttribute("cy", hd[1]); grip.setAttribute("x", hd[0] - 6); grip.setAttribute("y", hd[1] - 40);
          }
          const setR = () => { rad.setAttribute("x2", M[0] + r * PX); rL.textContent = "r = " + r + " cm"; rL.setAttribute("x", M[0] + r * PX / 2); rL.setAttribute("y", M[1] - 12); circ.setAttribute("r", r * PX); };
          placeComp(0.6 * PX, 0); setR();
          const sl = s.slider({ label: "Radius (Zirkel öffnen)", min: 1, max: 5, value: r, fmt: v => v + " cm", onInput: v => { r = v; setR(); placeComp(r * PX, 0); trace.setAttribute("d", ""); } });
          const zirkel = s.photo("zirkel", { w: 130, h: 190, caption: "Zirkel", pos: "50% 45%", cls: "later", style: { flex: "none" } });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px", flex: 1 } }, "Die ", s.h("b", null, "Zirkelspitze"), " kommt in den Mittelpunkt M. Die ", s.h("b", null, "Öffnung"), " des Zirkels ist der Radius r.");
          const life = s.h("div", { class: "life later", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, "Im Alltag"),
            s.h("p", { class: "small" }, "Der Mittelkreis im Fußball hat r\u00a0=\u00a09,15\u00a0m."), s.h("p", { class: "small" }, "Ein Rasensprenger macht einen nassen Kreis."), s.h("p", { class: "small" }, "Eine Ziege an der Leine grast im Kreis."));
          const draw = async () => {
            const R = r * PX, scr = s.sound("pencil-write", { vol: .5, loop: true });
            await s.tween({ from: 0, to: 359.9, dur: 2400, ease: "inOut", update: v => { th = v; placeComp(R, v * D2R); trace.setAttribute("d", arcD(M[0], M[1], R, 0, v)); } });
            scr.stop(); placeComp(R, 0); trace.setAttribute("d", ""); circ.classList.remove("later"); s.sfx.ding();
          };
          const btn = s.h("button", { class: "btn solid later", style: { alignSelf: "flex-start" }, onclick: async () => { s.sfx.click(); circ.classList.add("later"); await draw(); } }, "Kreis zeichnen");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "560px 1fr", alignItems: "center", height: "100%", gap: "24px" } }, svg, s.h("div", { class: "stack", style: { gap: "12px" } }, sl, btn, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "14px", alignItems: "center" } }, merk, zirkel), life)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          s.step(async () => { s.say("Zuerst öffnen wir den Zirkel am Lineal auf vier Zentimeter."); s.show(ruler, "fade"); s.sfx.whoosh(); await s.tween({ from: 0.6 * PX, to: r * PX, dur: 1100, update: v => placeComp(v, 0) }); s.sfx.snap(); s.show(rad, "fade"); await s.show(rL, "pop"); });
          s.step(async () => { s.say("Die Spitze kommt in den Mittelpunkt M."); s.hide(ruler); s.sfx.pop(); s.show(Md, "pop"); await s.show(ML, "pop"); });
          s.step(async () => { s.say("Jetzt drehen – und der Kreis ist fertig."); await draw(); s.show(btn, "pop"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); await s.show(zirkel, "zoom"); });
          s.step(async () => { s.sound("whistle", { vol: .5 }); await s.show(life, "up"); });
        },
      },
    ],
  });
})();
