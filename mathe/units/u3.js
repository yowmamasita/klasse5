/* Kapitel 3 – Geraden und Winkel (Berliner Rahmenlehrplan, Niveau C–D) */
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
    subtitle: "Linien, Geodreieck und Winkel",
    blurb: "Parallel, senkrecht, Winkelarten, messen und zeichnen.",
    goals: ["Strecke, Strahl und Gerade unterscheiden", "Parallele und senkrechte Geraden erkennen und zeichnen", "Abstand und Lot verstehen", "Winkel benennen, messen und zeichnen", "Mit Geodreieck und Zirkel umgehen"],
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
