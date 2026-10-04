/* Kapitel 1 – Wie Forscher arbeiten (Erkenntnisweg, fairer Versuch, Protokoll, Laborregeln, Gefahrenpiktogramme, Gasbrenner) */
(() => {
  const P = { unit: "#0e7490", soft: "#dff3f7", blue: "#1d5bd0", red: "#dc3b2a", green: "#138a5a", violet: "#7b4fd6", orange: "#ee7a1a", ink: "#1b2740", pencil: "#5d6678", yellow: "#ffd94a", line: "#c8d3de", ghs: "#e2001a", leaf: "#3aa152", pale: "#d8c656" };
  const later = el => { el.classList.add("later"); return el; };
  const fb = el => { el.style.transformBox = "fill-box"; el.style.transformOrigin = "center"; return el; };
  const T = (s, x, y, text, a) => s.el("text", Object.assign({ x, y, "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: P.ink, text }, a || {}));
  const root = (s, cls, style, ...kids) => s.h("div", { class: cls, style: Object.assign({ height: "100%" }, style || {}) }, ...kids);
  const life = (s, attrs, ...kids) => s.h("div", Object.assign({ class: "life" }, attrs || {}), s.h("span", { class: "exlabel" }, "Im Alltag"), ...kids);
  const ex = (s, label, attrs, ...kids) => s.h("div", Object.assign({ class: "ex" }, attrs || {}), s.h("span", { class: "exlabel" }, label), ...kids);
  const b = (s, t) => s.h("b", null, t);

  /* ---------- GHS pictograms (100×100 local coords) ---------- */
  const GHS = {
    GHS01: { name: "Explodierende Bombe", mean: "explosiv – kann explodieren", ex: "Feuerwerkskörper" },
    GHS02: { name: "Flamme", mean: "entzündbar – fängt leicht Feuer", ex: "Brennspiritus, Grillanzünder, Nagellackentferner" },
    GHS03: { name: "Flamme über Kreis", mean: "brandfördernd – macht Feuer stärker", ex: "manches Poolchlor" },
    GHS04: { name: "Gasflasche", mean: "Gas unter Druck", ex: "Campinggas-Kartusche, Druckluftspray" },
    GHS05: { name: "Ätzwirkung", mean: "ätzend – zerstört Haut und Augen", ex: "Abflussreiniger, Backofenreiniger" },
    GHS06: { name: "Totenkopf", mean: "giftig – schon wenig kann töten", ex: "im Haushalt sehr selten" },
    GHS07: { name: "Ausrufezeichen", mean: "reizend, gesundheitsschädlich", ex: "Brennspiritus (reizt die Augen), manche Reiniger" },
    GHS08: { name: "Gesundheitsgefahr", mean: "schadet dem Körper, z. B. der Lunge", ex: "Lampenöl" },
    GHS09: { name: "Umwelt", mean: "giftig für Fische und Wasser", ex: "manches Insektenspray" },
  };
  function ghsSymbol(s, id) {
    const g = s.el("g");
    const k = (tag, a) => g.append(s.el(tag, Object.assign({ fill: "#111" }, a)));
    const flame = (sx, sy, sc) => k("path", { d: "M0 -26 C10 -14 16 -6 12 6 C10 12 5 14 0 14 C-7 14 -11 9 -11 3 C-11 -4 -6 -7 -4 -13 C-3 -6 0 -4 2 -4 C4 -11 2 -18 0 -26 Z", transform: `translate(${sx} ${sy}) scale(${sc})` });
    switch (id) {
      case "GHS01":
        k("circle", { cx: 44, cy: 58, r: 13 });
        k("path", { d: "M52 46 L60 36", stroke: "#111", "stroke-width": 3, fill: "none" });
        [[66, 30, 72, 24], [70, 38, 78, 38], [62, 26, 62, 18], [30, 40, 24, 34], [28, 58, 20, 58], [46, 38, 46, 30]].forEach(([a, b2, c, d]) => k("path", { d: `M${a} ${b2} L${c} ${d}`, stroke: "#111", "stroke-width": 3, fill: "none" }));
        k("circle", { cx: 66, cy: 60, r: 3 }); k("circle", { cx: 32, cy: 74, r: 3 }); k("circle", { cx: 58, cy: 74, r: 2.5 });
        break;
      case "GHS02":
        flame(50, 52, 1.15); k("rect", { x: 34, y: 70, width: 32, height: 4 });
        break;
      case "GHS03":
        flame(50, 42, 0.85); k("circle", { cx: 50, cy: 64, r: 9, fill: "none", stroke: "#111", "stroke-width": 5 }); k("rect", { x: 34, y: 76, width: 32, height: 4 });
        break;
      case "GHS04":
        g.append(s.el("g", { transform: "rotate(-30 50 54)" }, s.el("rect", { x: 28, y: 46, width: 40, height: 18, rx: 9, fill: "#111" }), s.el("rect", { x: 66, y: 50, width: 8, height: 10, fill: "#111" })));
        break;
      case "GHS05":
        g.append(s.el("g", { transform: "rotate(25 36 32)" }, s.el("rect", { x: 31, y: 22, width: 10, height: 18, rx: 2, fill: "#111" })));
        g.append(s.el("g", { transform: "rotate(-25 64 32)" }, s.el("rect", { x: 59, y: 22, width: 10, height: 18, rx: 2, fill: "#111" })));
        k("circle", { cx: 38, cy: 50, r: 2.6 }); k("circle", { cx: 62, cy: 50, r: 2.6 });
        k("path", { d: "M26 64 L42 64 L42 72 L36 68 L32 72 L26 72 Z" });
        k("path", { d: "M56 72 L56 62 C56 58 64 58 64 62 L64 60 C64 57 70 57 70 60 L70 72 Z" });
        k("rect", { x: 24, y: 74, width: 52, height: 4 });
        break;
      case "GHS06":
        k("path", { d: "M50 28 C62 28 66 36 66 44 C66 50 62 53 60 54 L60 60 L40 60 L40 54 C38 53 34 50 34 44 C34 36 38 28 50 28 Z" });
        k("circle", { cx: 44, cy: 44, r: 4, fill: "#fff" }); k("circle", { cx: 56, cy: 44, r: 4, fill: "#fff" });
        k("path", { d: "M30 64 L70 76 M70 64 L30 76", stroke: "#111", "stroke-width": 5, fill: "none", "stroke-linecap": "round" });
        break;
      case "GHS07":
        k("rect", { x: 45, y: 28, width: 10, height: 30, rx: 4 }); k("circle", { cx: 50, cy: 67, r: 5.5 });
        break;
      case "GHS08":
        k("circle", { cx: 50, cy: 34, r: 7 });
        k("path", { d: "M32 76 C32 54 38 44 50 44 C62 44 68 54 68 76 Z" });
        k("path", { d: "M50 52 L53 59 L60 59 L54.5 63.5 L57 71 L50 66.5 L43 71 L45.5 63.5 L40 59 L47 59 Z", fill: "#fff" });
        break;
      case "GHS09":
        k("path", { d: "M34 74 L34 44 M34 52 L26 42 M34 56 L42 46 M34 46 L30 36", stroke: "#111", "stroke-width": 3, fill: "none", "stroke-linecap": "round" });
        k("ellipse", { cx: 58, cy: 70, rx: 11, ry: 5 }); k("path", { d: "M68 70 L76 64 L76 76 Z" });
        k("rect", { x: 24, y: 76, width: 54, height: 3 });
        break;
    }
    return g;
  }
  function ghsIcon(s, id, size) {
    const svg = s.svg(size, size); svg.setAttribute("viewBox", "0 0 100 100");
    svg.append(s.el("polygon", { points: "50,4 96,50 50,96 4,50", fill: "#fff", stroke: P.ghs, "stroke-width": 7, "stroke-linejoin": "round" }), ghsSymbol(s, id));
    return svg;
  }

  /* ---------- cress dish (used several times) ---------- */
  function dish(s, cx, by, mode, scale = 1) {
    const g = s.el("g", { transform: `translate(${cx} ${by}) scale(${scale})` });
    g.append(s.el("ellipse", { cx: 0, cy: 6, rx: 78, ry: 14, fill: "#cfd8e2" }));
    g.append(s.el("path", { d: "M-80 -6 L-70 14 L70 14 L80 -6 Z", fill: "#e8eef4", stroke: "#9fb0c2", "stroke-width": 2 }));
    g.append(s.el("ellipse", { cx: 0, cy: -6, rx: 72, ry: 9, fill: "#fbfbf6", stroke: "#d6d6cc", "stroke-width": 2 }));
    const sprouts = [];
    const xs = [-56, -40, -24, -8, 8, 24, 40, 56];
    xs.forEach((x, i) => {
      const stem = s.el("path", { fill: "none", "stroke-linecap": "round" });
      const l1 = s.el("ellipse", {}), l2 = s.el("ellipse", {});
      g.append(stem, l1, l2); sprouts.push({ x, stem, l1, l2, j: (i % 3) - 1 });
    });
    const set = d => {
      for (const p of sprouts) {
        let h = 0, col = P.leaf, w = 3, lw = 9;
        const t = Math.max(0, Math.min(1, (d - 1.5) / 5.5));
        if (mode === "licht") { h = t * 95; col = P.leaf; w = 3.4; lw = 4 + t * 6; }
        else if (mode === "dunkel") { h = t * 150; col = P.pale; w = 2; lw = 2 + t * 2.5; }
        else if (mode === "trocken") { h = Math.min(t, 0.12) * 60; col = "#a07a4a"; w = 2; lw = 2; }
        const top = -8 - h, bend = p.j * h * 0.12;
        p.stem.setAttribute("d", `M${p.x} -8 Q${p.x + bend} ${-8 - h / 2} ${p.x + bend * 0.6} ${top}`);
        p.stem.setAttribute("stroke", col); p.stem.setAttribute("stroke-width", w);
        const vis = h > 2 ? 1 : 0;
        [[p.l1, -1], [p.l2, 1]].forEach(([l, sg]) => {
          l.setAttribute("cx", p.x + bend * 0.6 + sg * lw * 0.8); l.setAttribute("cy", top);
          l.setAttribute("rx", lw); l.setAttribute("ry", lw * 0.55);
          l.setAttribute("fill", mode === "licht" ? "#2f9a48" : mode === "dunkel" ? "#e6d873" : "#a07a4a");
          l.setAttribute("opacity", vis);
        });
      }
    };
    g.set = set; set(0);
    return g;
  }

  const sun = (s, x, y, r = 22) => {
    const g = s.el("g", { transform: `translate(${x} ${y})` });
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; g.append(s.el("line", { x1: Math.cos(a) * (r + 6), y1: Math.sin(a) * (r + 6), x2: Math.cos(a) * (r + 16), y2: Math.sin(a) * (r + 16), stroke: "#f2b705", "stroke-width": 5, "stroke-linecap": "round" })); }
    g.append(s.el("circle", { r, fill: "#ffd94a", stroke: "#f2b705", "stroke-width": 3 }));
    return g;
  };

  Deck.unit({
    id: "u1", num: 1, title: "Wie Forscher arbeiten", color: P.unit, soft: P.soft,
    subtitle: "Beobachten, fragen, experimentieren – aber sicher!",
    blurb: "Erkenntnisweg, fairer Versuch, Protokoll, Laborregeln, Brenner.",
    goals: ["Den Forscher-Kreislauf Schritt für Schritt gehen", "Fair testen: nur eine Sache verändern", "Ein Versuchsprotokoll schreiben", "Laborregeln und Gefahrenzeichen kennen", "Den Gasbrenner sicher benutzen"],
    icon(svg, el) {
      svg.append(el("path", { d: "M27 10 L43 10 M30 10 L30 30 L14 58 C12 62 14 64 18 64 L52 64 C56 64 58 62 56 58 L40 30 L40 10", fill: "none", stroke: P.unit, "stroke-width": 4, "stroke-linejoin": "round" }),
        el("path", { d: "M20 50 L50 50 L55 59 C56 61 55 62 53 62 L17 62 C15 62 14 61 15 59 Z", fill: P.unit, opacity: .35 }),
        el("circle", { cx: 32, cy: 42, r: 3, fill: P.unit }), el("circle", { cx: 40, cy: 36, r: 2, fill: P.unit }));
    },
    slides: [
      /* 1 ------------------------------------------------------------ */
      {
        title: "Forschen beginnt mit Staunen",
        say: "Forscher sind neugierig. Sie schauen genau hin und fragen: Warum ist das so?",
        build(s) {
          const chips = s.h("div", { class: "row a-up", style: { justifyContent: "center" } },
            s.h("span", { class: "t" }, "NaWi ="),
            s.h("span", { class: "chip", style: { fontSize: "21px" } }, "Biologie"), s.h("span", { class: "t" }, "+"),
            s.h("span", { class: "chip", style: { fontSize: "21px" } }, "Chemie"), s.h("span", { class: "t" }, "+"),
            s.h("span", { class: "chip", style: { fontSize: "21px" } }, "Physik"));
          const sv1 = s.photo("waesche-leine", { w: 300, h: 210, pos: "50% 45%" });
          const sv2 = s.photo("eis-schmilzt", { w: 300, h: 210, pos: "60% 50%" });
          const sv3 = s.photo("pflanze-fenster", { w: 300, h: 210, pos: "45% 40%" });
          const card = (svg, q, kind) => s.h("div", { class: "card later stack", style: { gap: "8px", alignItems: "center", padding: "14px 18px" } },
            s.h("span", { class: "exlabel", style: { alignSelf: "flex-start", marginBottom: 0 } }, kind), svg, s.h("p", { class: "t", style: { fontSize: "22px", textAlign: "center" } }, q));
          const c1 = card(sv1, "Warum wird nasse Wäsche trocken?", "Beobachtung 1");
          const c2 = card(sv2, "Warum schmilzt Eis in der Sonne so schnell?", "Beobachtung 2");
          const c3 = card(sv3, "Warum wächst die Pflanze zum Fenster?", "Beobachtung 3");
          const merk = s.h("div", { class: "merk later" }, "Forscher ", b(s, "beobachten"), " genau, stellen ", b(s, "Fragen"), " und prüfen ihre Ideen mit ", b(s, "Experimenten"), ".");
          s.add(root(s, "stack", { justifyContent: "center", gap: "34px" }, chips, s.h("div", { class: "cols3" }, c1, c2, c3), merk));
          s.sfx.whoosh();
          s.step(async () => { s.sound("wind", { vol: .45, dur: 3 }); await s.show(c1, "up"); s.say("Nasse Wäsche wird trocken. Wohin verschwindet das Wasser?"); });
          s.step(async () => { s.sound("tropfen", { vol: .7 }); await s.show(c2, "up"); s.say("Eis in der Sonne schmilzt schneller als im Schatten."); });
          s.step(async () => { s.sfx.swoosh(); await s.show(c3, "up"); s.say("Die Pflanze wächst zum Licht."); });
          s.step(async () => { s.sound("magic-chime", { vol: .6 }); await s.show(merk, "zoom"); });
        },
      },
      /* 2 ------------------------------------------------------------ */
      {
        title: "Der Forscher-Kreislauf",
        say: "So arbeiten Forscher: Schritt für Schritt, im Kreis. Am Ende steht oft eine neue Frage.",
        build(s) {
          const W = 620, H = 600, cx = 310, cy = 300, R = 235, NW = 150, NH = 62;
          const names = [["Beobachten"], ["Frage"], ["Vermutung"], ["Experiment", "planen"], ["Durch-", "führen"], ["Auswerten"], ["Ergebnis"]];
          const cols = ["#0e7490", "#1d5bd0", "#7b4fd6", "#ee7a1a", "#d9480f", "#138a5a", "#0b6e4f"];
          const svg = s.svg(W, H);
          const ang = k => (-90 + k * 360 / 7) * Math.PI / 180;
          const pos = k => ({ x: cx + R * Math.cos(ang(k)), y: cy + R * Math.sin(ang(k)) });
          const inside = (p, k, m) => { const q = pos(k); return Math.abs(p.x - q.x) < NW / 2 + m && Math.abs(p.y - q.y) < NH / 2 + m; };
          svg.append(s.el("defs", null, s.el("marker", { id: "u1arr", viewBox: "0 0 10 10", refX: 7, refY: 5, markerWidth: 6, markerHeight: 6, orient: "auto-start-reverse" }, s.el("path", { d: "M0 0 L10 5 L0 10 Z", fill: P.pencil }))));
          const arcs = [];
          for (let k = 0; k < 7; k++) {
            const a0 = ang(k), a1 = ang(k + 1) + (k === 6 ? 0 : 0);
            const pts = [];
            for (let i = 0; i <= 80; i++) { const a = a0 + (a1 - a0 + (k === 6 ? 0 : 0)) * i / 80; const p = { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) }; if (!inside(p, k, 8) && !inside(p, (k + 1) % 7, 10)) pts.push(p); }
            const d = pts.map((p, i) => (i ? "L" : "M") + p.x.toFixed(1) + " " + p.y.toFixed(1)).join(" ");
            const path = later(s.el("path", { d, fill: "none", stroke: P.pencil, "stroke-width": 4, "marker-end": "url(#u1arr)", "stroke-linecap": "round" }));
            arcs.push(path); svg.append(path);
          }
          const nodes = names.map((lines, k) => {
            const p = pos(k);
            const g = later(fb(s.el("g")));
            g.append(s.el("rect", { x: p.x - NW / 2, y: p.y - NH / 2, width: NW, height: NH, rx: 16, fill: cols[k] }));
            g.append(s.el("circle", { cx: p.x - NW / 2 + 4, cy: p.y - NH / 2 + 4, r: 14, fill: "#fff", stroke: cols[k], "stroke-width": 3 }));
            g.append(T(s, p.x - NW / 2 + 4, p.y - NH / 2 + 11, String(k + 1), { "font-size": 19, fill: cols[k] }));
            if (lines.length === 1) g.append(T(s, p.x + 6, p.y + 7, lines[0], { fill: "#fff", "font-size": 21 }));
            else { g.append(T(s, p.x + 6, p.y - 4, lines[0], { fill: "#fff", "font-size": 20 })); g.append(T(s, p.x + 6, p.y + 20, lines[1], { fill: "#fff", "font-size": 20 })); }
            svg.append(g); return g;
          });
          const center = s.el("g");
          center.append(T(s, cx, cy - 30, "Natur-", { "font-size": 24, fill: P.unit }), T(s, cx, cy, "wissenschaftlicher", { "font-size": 24, fill: P.unit }), T(s, cx, cy + 30, "Erkenntnisweg", { "font-size": 24, fill: P.unit }));
          svg.append(center);
          const token = later(s.el("circle", { r: 13, fill: P.yellow, stroke: P.orange, "stroke-width": 4 }));
          svg.append(token);
          const desc = [
            ["Beobachten", "genau hinsehen: Was passiert?"], ["Frage", "Was will ich herausfinden?"], ["Vermutung", "Was glaube ich – und warum?"],
            ["Experiment planen", "Was ändere ich? Was messe ich?"], ["Durchführen", "sorgfältig arbeiten, alles notieren"], ["Auswerten", "Tabelle, Diagramm, vergleichen"], ["Ergebnis", "Stimmt meine Vermutung?"],
          ];
          const items = desc.map(([n, d], k) => later(s.h("div", { style: { display: "grid", gridTemplateColumns: "34px 1fr", gap: "10px", alignItems: "center" } },
            s.h("span", { style: { width: "34px", height: "34px", borderRadius: "50%", background: cols[k], color: "#fff", font: "700 19px/34px var(--f-display)", textAlign: "center" } }, String(k + 1)),
            s.h("div", null, s.h("div", { style: { font: "700 21px/1.15 var(--f-display)", color: cols[k] } }, n), s.h("div", { class: "small" }, d)))));
          const merk = later(s.h("div", { class: "merk", style: { fontSize: "21px", padding: "12px 18px 14px" } }, "Ein Ergebnis bringt oft eine ", b(s, "neue Frage"), " – dann beginnt der Kreislauf von vorn."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "620px 1fr", gap: "24px", alignItems: "center" }, svg, s.h("div", { class: "stack", style: { gap: "8px" } }, ...items, merk)));
          s.sfx.whoosh();
          const reveal = async ks => { for (const k of ks) { s.sfx.count(k); s.show(nodes[k], "pop"); s.show(items[k], "left"); if (k > 0) s.show(arcs[k - 1], "draw"); await s.wait(450); } };
          s.step(async () => { await reveal([0, 1]); s.say("Erst beobachten, dann eine Frage stellen."); });
          s.step(async () => { await reveal([2]); s.say("Dann eine Vermutung: Was glaube ich, und warum?"); });
          s.step(async () => { await reveal([3, 4]); s.say("Das Experiment wird geplant und durchgeführt."); });
          s.step(async () => { await reveal([5, 6]); s.say("Zum Schluss wird ausgewertet. Das Ergebnis sagt: Stimmt die Vermutung?"); });
          s.step(async () => {
            s.sfx.snap(); s.show(arcs[6], "draw"); s.show(token, "pop");
            s.say("Und dann geht es oft mit einer neuen Frage weiter.");
            let last = -1;
            await s.tween({ from: 0, to: 1, dur: s.fast ? 0 : 4200, ease: "inOut", update: v => {
              const a = ang(0) + v * Math.PI * 2; token.setAttribute("cx", cx + R * Math.cos(a)); token.setAttribute("cy", cy + R * Math.sin(a));
              const k = Math.floor(v * 7 + 0.5) % 7; if (k !== last) { last = k; s.sfx.note([0, 2, 4, 5, 7, 9, 11][k], 0.18); }
            } });
            s.hide(token); s.sfx.success(); await s.show(merk, "up");
          });
          token.setAttribute("cx", pos(0).x); token.setAttribute("cy", pos(0).y);
        },
      },
      /* 3 ------------------------------------------------------------ */
      {
        title: "Beispiel: Wäsche trocknen",
        say: "Wir gehen den Forscher-Kreislauf mit einem echten Beispiel: Wo trocknet nasse Wäsche am schnellsten?",
        build(s) {
          const stepChip = (n, t, c) => s.h("span", { class: "chip", style: { background: c, color: "#fff", fontSize: "20px" } }, n + " " + t);
          const sv = s.svg(320, 230);
          sv.append(s.el("line", { x1: 10, y1: 40, x2: 310, y2: 40, stroke: P.pencil, "stroke-width": 3 }));
          sv.append(s.el("path", { d: "M110 40 L80 64 L98 76 L98 180 L222 180 L222 76 L240 64 L210 40 L190 50 C180 62 140 62 130 50 Z", fill: "#7fb7e6", stroke: P.blue, "stroke-width": 3 }));
          [[120, 52], [210, 52]].forEach(([x, y]) => sv.append(s.el("rect", { x: x - 6, y: y - 22, width: 12, height: 26, rx: 3, fill: P.orange })));
          const drops = [115, 150, 185, 205].map((x, i) => { const d = s.el("path", { d: "M0 0 C3 5 5 8 5 11 C5 14 3 16 0 16 C-3 16 -5 14 -5 11 C-5 8 -3 5 0 0 Z", fill: P.blue }); d.x0 = x; d.ph = i * 0.29; sv.append(d); return d; });
          s.loop(t => drops.forEach(d => { const p = (t * 0.7 + d.ph) % 1; d.setAttribute("transform", `translate(${d.x0} ${182 + p * 34})`); d.setAttribute("opacity", 1 - p); }));
          const col1 = s.h("div", { class: "card stack a-up", style: { gap: "10px", alignItems: "center" } }, stepChip(1, "Beobachten", "#0e7490"), sv,
            s.h("p", { class: "t", style: { fontSize: "22px", textAlign: "center" } }, "Nasse Wäsche tropft – und ist später trocken. Manchmal schnell, manchmal langsam."));
          const bubble = s.h("div", { style: { background: "#fff", border: "3px solid " + P.blue, borderRadius: "26px", padding: "18px 20px", position: "relative", font: "700 28px/1.25 var(--f-display)", color: P.blue, textAlign: "center" } }, "Wo trocknet nasse Wäsche am schnellsten?");
          const col2 = later(s.h("div", { class: "card stack", style: { gap: "14px", alignItems: "center" } }, stepChip(2, "Frage", "#1d5bd0"), bubble,
            s.h("p", { class: "t", style: { fontSize: "22px" } }, "Eine gute Forscherfrage kann man mit einem ", b(s, "Experiment"), " beantworten.")));
          const opts = [["im Zimmer", "#5d6678"], ["an der Heizung", P.red], ["draußen im Wind", P.blue]];
          const chips = opts.map(([t, c]) => later(s.h("span", { class: "chip", style: { background: "#fff", border: "2px solid " + c, color: c, fontSize: "21px" } }, t)));
          const hyp = later(s.h("p", { class: "hand", style: { fontSize: "30px", margin: 0, textAlign: "center" } }, "„Ich vermute: an der Heizung, weil Wärme das Wasser schneller verdunsten lässt.“"));
          const col3 = later(s.h("div", { class: "card stack", style: { gap: "12px", alignItems: "center" } }, stepChip(3, "Vermutung", "#7b4fd6"),
            s.h("p", { class: "small pencil" }, "Drei Orte zum Vergleichen:"), s.h("div", { class: "row", style: { justifyContent: "center", gap: "8px" } }, ...chips), hyp));
          const merk = later(s.h("div", { class: "merk", style: { fontSize: "22px" } }, "Eine ", b(s, "Vermutung"), " (Hypothese) sagt, was du erwartest – ", b(s, "und warum"), ". Ob sie stimmt, zeigt erst das Experiment."));
          s.add(root(s, "stack", { justifyContent: "center", gap: "30px" }, s.h("div", { class: "cols3", style: { alignItems: "stretch" } }, col1, col2, col3), merk));
          s.sfx.whoosh();
          s.step(async () => { s.sfx.pop(); await s.show(col2, "up"); s.say("Die Frage: Wo trocknet nasse Wäsche am schnellsten?"); });
          s.step(async () => { s.sfx.pop(); await s.show(col3, "up"); for (let i = 0; i < 3; i++) { s.sfx.count(i); s.show(chips[i], "pop"); await s.wait(200); } });
          s.step(async () => { s.sound("pencil-write", { vol: .8 }); await s.show(hyp, "fade"); s.say("Ich vermute: an der Heizung, weil Wärme das Wasser schneller verdunsten lässt."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 4 ------------------------------------------------------------ */
      {
        title: "Das Experiment: Wäsche-Test",
        say: "Drei gleiche Tücher, gleich nass. Nur der Ort ist verschieden. Starte das Experiment!",
        build(s) {
          const plan = s.h("div", { class: "cols a-up", style: { gap: "16px" } },
            s.h("div", { class: "card soft", style: { padding: "12px 18px" } }, s.h("p", { class: "t", style: { fontSize: "22px" } }, s.h("b", { class: "green" }, "Gleich: "), "gleiches Tuch, gleich viel Wasser, gleiche Startzeit")),
            s.h("div", { class: "card soft", style: { padding: "12px 18px" } }, s.h("p", { class: "t", style: { fontSize: "22px" } }, s.h("b", { class: "red" }, "Anders: "), "nur der Ort, an dem das Tuch hängt")));
          const names = ["A: im Zimmer", "B: an der Heizung", "C: draußen im Wind"];
          const heads = s.h("div", { class: "cols3", style: { gap: "0" } }, ...names.map((n, i) => s.h("p", { class: "h2", style: { fontSize: "24px", textAlign: "center", color: [P.pencil, P.red, P.blue][i] } }, n)));
          const CW = 1100, CH = 330;
          const { canvas, g } = s.canvas(CW, CH);
          canvas.style.borderRadius = "16px"; canvas.style.background = "#fff"; canvas.style.border = "2px solid var(--line)";
          const rate = [0.055, 0.15, 0.125];
          const wet = [1, 1, 1];
          let running = false, parts = [];
          const draw = (t, dt) => {
            g.clearRect(0, 0, CW, CH);
            for (let i = 0; i < 3; i++) {
              const ox = i * (CW / 3), mx = ox + CW / 6;
              if (i) { g.strokeStyle = "#e3e9ef"; g.lineWidth = 2; g.beginPath(); g.moveTo(ox, 10); g.lineTo(ox, CH - 10); g.stroke(); }
              g.strokeStyle = "#5d6678"; g.lineWidth = 3; g.beginPath(); g.moveTo(ox + 40, 62); g.lineTo(ox + CW / 3 - 40, 62); g.stroke();
              // cloth
              const sway = i === 2 ? Math.sin(t * 3) * 10 : 0;
              const w = wet[i];
              const r = Math.round(lerp(236, 70, w)), gg = Math.round(lerp(244, 130, w)), bb = Math.round(lerp(250, 200, w));
              g.fillStyle = `rgb(${r},${gg},${bb})`; g.strokeStyle = "#3b6ea8"; g.lineWidth = 3;
              g.beginPath(); g.moveTo(mx - 70, 62); g.lineTo(mx + 70, 62); g.lineTo(mx + 70 + sway, 182); g.lineTo(mx - 70 + sway, 182); g.closePath(); g.fill(); g.stroke();
              g.fillStyle = P.orange; g.fillRect(mx - 64, 48, 10, 24); g.fillRect(mx + 54, 48, 10, 24);
              // water gauge
              const gx = ox + CW / 3 - 62, gy = 70, gh = 150;
              g.strokeStyle = "#5d6678"; g.lineWidth = 2; g.strokeRect(gx, gy, 22, gh);
              g.fillStyle = "#4b8fe0"; g.fillRect(gx + 2, gy + gh - (gh - 4) * w - 2, 18, (gh - 4) * w);
              // place decorations
              if (i === 1) { g.fillStyle = "#e9eef3"; g.strokeStyle = "#9aa7b5"; g.lineWidth = 2; for (let k = 0; k < 7; k++) { g.fillRect(mx - 84 + k * 24, 200, 18, 56); g.strokeRect(mx - 84 + k * 24, 200, 18, 56); }
                g.strokeStyle = "rgba(220,59,42,.55)"; g.lineWidth = 3; for (let k = 0; k < 3; k++) { g.beginPath(); for (let y = 0; y < 14; y++) { const xx = mx - 40 + k * 40 + Math.sin(y * 0.9 + t * 4 + k) * 5; const yy = 196 - y * 1.0; y ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); } }
              if (i === 2) { g.strokeStyle = "rgba(29,91,208,.45)"; g.lineWidth = 3; g.lineCap = "round"; for (let k = 0; k < 4; k++) { const yy = 196 + k * 16, x0 = ox + 30 + ((t * 120 + k * 60) % 120); g.beginPath(); g.moveTo(x0, yy); g.quadraticCurveTo(x0 + 40, yy - 8, x0 + 80, yy); g.stroke(); } }
              if (i === 0) { g.fillStyle = "#c8743c"; g.fillRect(mx - 90, 228, 180, 10); g.fillRect(mx - 80, 238, 10, 26); g.fillRect(mx + 70, 238, 10, 26); }
              // spawn particles
              if (running && w > 0 && Math.random() < rate[i] * w * 9) parts.push({ x: mx - 60 + Math.random() * 120, y: 60 + Math.random() * 110, vx: i === 2 ? 60 + Math.random() * 30 : (Math.random() - .5) * 12, vy: -(25 + Math.random() * 25) * (i === 1 ? 1.6 : 1), life: 0, x0: ox, x1: ox + CW / 3 });
            }
            parts = parts.filter(p => p.life < 1.6 && p.y > 0 && p.x > p.x0 && p.x < p.x1);
            g.fillStyle = "rgba(75,143,224,.75)";
            for (const p of parts) { p.life += dt; p.x += p.vx * dt; p.y += p.vy * dt; g.globalAlpha = Math.max(0, 1 - p.life / 1.6); g.beginPath(); g.arc(p.x, p.y, 4, 0, 7); g.fill(); }
            g.globalAlpha = 1;
          };
          const lerp = (a, c, t) => a + (c - a) * t;
          s.loop((t, dt) => {
            if (running) { for (let i = 0; i < 3; i++) wet[i] = Math.max(0, wet[i] - rate[i] * dt); if (wet.every(w => w <= 0)) running = false; }
            draw(t, Math.min(dt, 0.05));
          });
          const badgeTxt = [["3.", "am langsamsten"], ["1.", "am schnellsten"], ["2.", "auch schnell"]];
          const badges = badgeTxt.map(([n, t], i) => later(s.h("div", { style: { justifySelf: "center", display: "flex", alignItems: "center", gap: "10px", background: i === 1 ? "#fff6c9" : "#fff", border: "2px solid " + (i === 1 ? P.yellow : P.line), borderRadius: "14px", padding: "6px 16px" } },
            s.h("span", { style: { font: "800 30px/1 var(--f-display)", color: [P.pencil, P.red, P.blue][i] } }, n), s.h("span", { class: "t", style: { fontSize: "21px" } }, t))));
          const badgeRow = s.h("div", { class: "cols3", style: { gap: "0" } }, ...badges);
          let finished = false;
          const run = async () => {
            if (running) return;
            wet.fill(1); parts = []; badges.forEach(x => s.hide(x)); running = true; s.sound("wind", { vol: .4, dur: 6 });
            const done = [false, false, false];
            await new Promise(res => { const stop = s.loop(() => { for (let i = 0; i < 3; i++) if (!done[i] && wet[i] <= 0) { done[i] = true; s.sfx.count([2, 0, 1][i] * 2 + 2); } if (!running) { res(); return false; } }); s.onLeave(res); });
            if (!s.alive) return;
            for (const i of [1, 2, 0]) { s.show(badges[i], "pop"); s.sfx.pop(); await s.wait(250); }
            s.sfx.success(); finished = true;
          };
          const btn = s.h("button", { class: "btn solid", onclick: () => run() }, "▶ Experiment starten");
          const note = s.h("p", { class: "small pencil" }, "Simulation – die Wasser-Säule rechts zeigt, wie viel Wasser noch im Tuch ist.");
          s.add(root(s, "stack", { gap: "10px" }, plan, heads, canvas, badgeRow, s.h("div", { class: "row", style: { justifyContent: "space-between", flexWrap: "nowrap" } }, note, btn)));
          s.sfx.pop();
          s.step(async () => {
            s.say("Das Experiment läuft. Achte auf die blauen Wasser-Teilchen.");
            if (s.fast) { wet.fill(0); [1, 2, 0].forEach(i => s.show(badges[i], "pop")); return; }
            await run();
          });
        },
      },
      /* 5 ------------------------------------------------------------ */
      {
        title: "Auswerten – und neue Fragen",
        say: "Die Vermutung stimmt: An der Heizung ging es schnell. Aber im Wind auch! Daraus entsteht eine neue Frage.",
        build(s) {
          const vcard = s.h("div", { class: "card stack a-up", style: { gap: "8px", position: "relative" } },
            s.h("span", { class: "exlabel" }, "Meine Vermutung"),
            s.h("p", { class: "hand", style: { fontSize: "29px", margin: 0 } }, "„An der Heizung trocknet die Wäsche am schnellsten.“"));
          const stamp = later(s.h("div", { style: { position: "absolute", right: "16px", top: "10px", transform: "rotate(-8deg)", border: "4px solid " + P.green, color: P.green, borderRadius: "10px", padding: "4px 10px", font: "800 22px/1 var(--f-display)" } }, "bestätigt ✓"));
          vcard.append(stamp);
          const res = later(s.h("div", { class: "ex" }, s.h("span", { class: "exlabel" }, "Ergebnis"),
            s.h("p", { class: "t", style: { fontSize: "22px" } }, "Im Zimmer ohne Wind trocknet Wäsche am langsamsten. ", b(s, "Wärme"), " und ", b(s, "Wind"), " machen das Trocknen schneller.")));
          const qsv = s.svg(120, 120);
          const ring = s.el("path", { d: "M60 14 A46 46 0 1 1 18 40", fill: "none", stroke: P.unit, "stroke-width": 8, "stroke-linecap": "round" });
          const head = s.el("path", { d: "M6 30 L22 46 L30 26 Z", fill: P.unit });
          const qm = T(s, 60, 76, "?", { "font-size": 46, fill: P.violet });
          const spin = fb(s.el("g", null, ring, head)); qsv.append(spin, qm);
          const newq = later(s.h("div", { class: "card", style: { display: "flex", gap: "16px", alignItems: "center", borderColor: P.violet } }, qsv,
            s.h("div", null, s.h("p", { class: "small pencil" }, "Neue Frage – der Kreislauf beginnt von vorn:"), s.h("p", { class: "h2", style: { color: P.violet, fontSize: "27px" } }, "Was hilft mehr: Wärme oder Wind?"))));
          const lifeBox = later(life(s, { class: "life stack", style: { gap: "10px" } },
            ...[["💨", "Föhn", "warme Luft und Wind trocknen nasse Haare schnell."], ["👕", "Wäschetrockner", "bläst warme Luft durch die Wäsche."], ["☀️", "Pfütze", "verschwindet bei Sonne und Wind schneller als an einem kühlen, windstillen Tag."]].map(([e, t, d]) =>
              s.h("div", { style: { display: "grid", gridTemplateColumns: "40px 1fr", gap: "10px", alignItems: "start" } }, s.h("span", { style: { fontSize: "30px", lineHeight: "1.1" } }, e), s.h("p", { class: "t", style: { fontSize: "21px" } }, b(s, t + ": "), d)))));
          const merk = later(s.h("div", { class: "merk", style: { fontSize: "21px" } }, "Wasser ", b(s, "verdunstet"), " schneller, wenn es warm ist und Wind die feuchte Luft wegbläst."));
          s.add(root(s, "cols", { alignItems: "center" }, s.h("div", { class: "stack", style: { gap: "22px" } }, vcard, res, newq), s.h("div", { class: "stack", style: { gap: "22px" } }, lifeBox, merk)));
          s.sfx.pop();
          s.step(async () => { s.sound("stempel"); await s.show(stamp, "zoom"); });
          s.step(async () => { s.sfx.pop(); await s.show(res, "up"); s.say("Wärme und Wind machen das Trocknen schneller."); });
          s.step(async () => { s.sfx.whoosh(); s.show(newq, "left"); s.tween({ from: 0, to: 360, dur: 1400, ease: "out", update: v => spin.setAttribute("transform", `rotate(${v} 60 60)`) }); s.say("Neue Frage: Was hilft mehr, Wärme oder Wind?"); });
          s.step(async () => { s.sound("foehn", { vol: .5 }); await s.show(lifeBox, "right"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 6 ------------------------------------------------------------ */
      {
        title: "Fair testen: nur EINE Sache",
        say: "Bei einem fairen Versuch veränderst du nur eine einzige Sache. Hier ist es das Licht.",
        build(s) {
          const svg = s.svg(620, 420);
          svg.append(s.el("rect", { x: 0, y: 360, width: 620, height: 14, fill: "#d8c3a5" }));
          const dl = dish(s, 160, 350, "licht"), dd = dish(s, 460, 350, "dunkel");
          svg.append(sun(s, 160, 60, 24), dl, dd);
          const box = s.el("g", null, s.el("path", { d: "M360 336 L360 120 L560 120 L560 336", fill: "rgba(120,86,50,.18)", stroke: "#8a6a44", "stroke-width": 4 }), s.el("path", { d: "M360 120 L380 96 L580 96 L560 120 Z", fill: "rgba(120,86,50,.35)", stroke: "#8a6a44", "stroke-width": 4 }));
          svg.append(box);
          svg.append(T(s, 160, 404, "im Hellen", { fill: P.green }), T(s, 460, 404, "unter dem Karton (dunkel)", { fill: "#8a6a44" }));
          const dayT = T(s, 460, 60, "Tag 0", { "font-size": 34, fill: P.unit });
          svg.append(dayT);
          let day = 0;
          const setDay = d => { day = d; dl.set(d); dd.set(d); dayT.textContent = "Tag " + Math.round(d); };
          const sl = s.slider({ label: "Tage vergehen lassen", min: 0, max: 7, step: 1, value: 0, fmt: v => "Tag " + v, onInput: v => s.tween({ from: day, to: v, dur: 400, update: setDay }) });
          const card = (lab, col, txt) => later(s.h("div", { class: "card", style: { padding: "12px 18px", borderColor: col } }, s.h("span", { class: "exlabel", style: { color: col } }, lab), s.h("p", { class: "t", style: { fontSize: "22px" } }, ...txt)));
          const c1 = card("Das verändere ich", P.red, [b(s, "nur das Licht"), " (hell oder dunkel)"]);
          const c2 = card("Das bleibt gleich", P.green, ["Samen, Watte, Wasser, Wärme, Schale"]);
          const c3 = card("Das beobachte ich", P.blue, ["Wie hoch? Welche Farbe?"]);
          const obs = later(s.h("p", { class: "t", style: { fontSize: "22px" } }, "Im Dunkeln wird Kresse ", b(s, "lang, dünn und gelb"), ". Im Hellen bleibt sie kurz, kräftig und ", b(s, "grün"), "."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "620px 1fr", gap: "26px", alignItems: "center" },
            s.h("div", { class: "stack", style: { gap: "6px" } }, svg, sl), s.h("div", { class: "stack", style: { gap: "12px" } }, c1, c2, c3, obs)));
          s.sfx.whoosh();
          s.step(async () => { s.sfx.pop(); await s.show(c1, "left"); s.sfx.pop(); await s.show(c2, "left"); s.sfx.pop(); await s.show(c3, "left"); });
          s.step(async () => {
            s.say("Wir lassen sieben Tage vergehen.");
            for (let d = 1; d <= 7; d++) { s.sfx.count(d); await s.tween({ from: d - 1, to: d, dur: 450, update: setDay }); }
            sl.input.value = 7; sl.querySelector(".mono").textContent = "Tag 7";
          });
          s.step(async () => { s.sfx.ding(); await s.show(obs, "up"); s.say("Im Dunkeln wird die Kresse lang, dünn und gelb."); });
        },
      },
      /* 6b ----------------------------------------------------------- */
      {
        title: "Hell oder dunkel – in echt",
        say: "So sieht das in echt aus. Im Hellen wird Kresse grün und kräftig. Keimlinge im Dunkeln werden lang, dünn und blass.",
        build(s) {
          const p1 = s.photo("kresse", { w: 520, h: 380, pos: "50% 60%", caption: "Kresse im Hellen: kräftig und grün" });
          const p2 = s.photo("keimlinge-dunkel", { w: 520, h: 380, pos: "50% 55%", caption: "Samen im Dunkeln gekeimt: lang, dünn, gelb", cls: "later" });
          const merk = later(s.h("div", { class: "merk", style: { fontSize: "22px" } }, "Im Dunkeln wachsen Keimlinge schnell in die Höhe – sie ", b(s, "suchen das Licht"), ". Grün werden sie erst, wenn Licht auf sie fällt."));
          s.add(root(s, "stack", { justifyContent: "center", gap: "26px" }, s.h("div", { class: "row", style: { justifyContent: "center", gap: "30px", flexWrap: "nowrap" } }, p1, p2), merk));
          s.step(async () => { s.sound("camera-shutter", { vol: .7 }); await s.show(p2, "zoom"); s.say("Diese Samen sind im Dunkeln gekeimt: lang, dünn und gelb."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 7 ------------------------------------------------------------ */
      {
        title: "Kontrollversuch und unfaire Tests",
        say: "Der Kontrollversuch läuft ganz normal. Nur so kannst du vergleichen. Ändert man zwei Dinge, weiß man nicht, woran es lag.",
        build(s) {
          const scene = (modes, labels) => {
            const sv = s.svg(470, 200);
            modes.forEach((m, i) => { const d = dish(s, 120 + i * 230, 150, m, 0.85); d.set(7); sv.append(d); });
            labels.forEach((l, i) => sv.append(T(s, 120 + i * 230, 192, l[0], { fill: l[1], "font-size": 20 })));
            return sv;
          };
          const fair = s.h("div", { class: "card stack a-up", style: { gap: "4px", borderColor: P.green } },
            s.h("span", { class: "exlabel", style: { color: P.green } }, "Fair ✓"),
            scene(["licht", "dunkel"], [["hell + Wasser", P.green], ["dunkel + Wasser", "#8a6a44"]]),
            s.h("p", { class: "t", style: { fontSize: "21px" } }, "Links: der ", b(s, "Kontrollversuch"), " – alles normal. Rechts ist nur das Licht anders."));
          const unfairScene = scene(["licht", "trocken"], [["hell + Wasser", P.green], ["dunkel + KEIN Wasser", P.red]]);
          const qms = [0, 1, 2].map(i => later(fb(T(s, 300 + i * 34, 60 + (i % 2) * 22, "?", { "font-size": 40, fill: P.red }))));
          unfairScene.append(...qms);
          const unfair = later(s.h("div", { class: "card stack", style: { gap: "4px", borderColor: P.red } },
            s.h("span", { class: "exlabel", style: { color: P.red } }, "Unfair ✗"), unfairScene,
            s.h("p", { class: "t", style: { fontSize: "21px" } }, "Lag es am Licht oder am Wasser? ", b(s, "Man weiß es nicht!"))));
          const exs = [
            ["Papierflieger", "Welche Flügel fliegen am weitesten? Gleiches Papier, gleicher Werfer – nur die Flügelform ändern."],
            ["Bälle", "Welcher Ball springt am höchsten? Alle aus derselben Höhe fallen lassen."],
            ["Kuchen backen", "Mit und ohne Backpulver backen – alles andere bleibt gleich."],
          ].map(([t, d], i) => later(ex(s, "Beispiel " + (i + 1), { style: { padding: "12px 16px" } }, s.h("p", { class: "t", style: { fontSize: "21px" } }, b(s, t + ": "), d))));
          s.add(root(s, "stack", { justifyContent: "center", gap: "30px" }, s.h("div", { class: "cols", style: { gap: "20px" } }, fair, unfair), s.h("div", { class: "cols3", style: { gap: "16px" } }, ...exs)));
          s.sfx.pop();
          s.step(async () => { s.sfx.error(); await s.show(unfair, "up"); for (const q of qms) { s.show(q, "bounce"); s.sfx.boing(); await s.wait(180); } s.say("Lag es am Licht oder am Wasser? Man weiß es nicht."); });
          s.step(async () => { for (let i = 0; i < 3; i++) { s.sfx.count(i * 2); s.show(exs[i], "up"); await s.wait(220); } s.say("Fair testen geht überall: beim Papierflieger, bei Bällen und beim Backen."); });
        },
      },
      /* 8 ------------------------------------------------------------ */
      {
        title: "Das Versuchsprotokoll",
        say: "Forscher schreiben alles auf. Wir füllen ein Versuchsprotokoll Schritt für Schritt aus.",
        build(s) {
          const field = (lab, ...kids) => { const content = later(s.h("div", { class: "stack", style: { gap: "6px" } }, ...kids));
            const el = s.h("div", { style: { background: "#fff", border: "2px solid var(--line)", borderRadius: "14px", padding: "10px 14px", display: "flex", flexDirection: "column", gap: "6px" } },
              s.h("span", { style: { font: "700 22px/1 var(--f-display)", color: P.red } }, lab), content); el.content = content; return el; };
          const hand = (t, fs = 33) => s.h("p", { class: "hand", style: { fontSize: fs + "px", margin: 0, lineHeight: 1.12 } }, t);
          const sk = s.svg(300, 128);
          const d1 = dish(s, 60, 114, "licht", 0.62), d2 = dish(s, 228, 114, "dunkel", 0.62); d1.set(7); d2.set(7);
          sk.append(d1, d2, s.el("path", { d: "M172 108 L172 14 L286 14 L286 108", fill: "rgba(120,86,50,.15)", stroke: "#8a6a44", "stroke-width": 3 }), sun(s, 136, 30, 11));
          const f = [
            field("Frage", hand("Brauchen Kressesamen Licht, um gut zu wachsen?")),
            field("Vermutung", hand("Ich vermute: Im Dunkeln wächst Kresse schlechter, weil Pflanzen Licht brauchen.", 31)),
            field("Material", hand("2 Schalen, Watte, Kressesamen, Wasser, 1 Karton")),
            field("Durchführung + Skizze", hand("Beide gleich gießen. Eine Schale unter den Karton.", 28), sk),
            field("Beobachtung", hand("Nach 7 Tagen: hell → grün und kräftig. Dunkel → lang, dünn, gelb.", 31)),
            field("Ergebnis", hand("Für gesundes, grünes Wachstum braucht Kresse Licht. Vermutung bestätigt!", 31)),
          ];
          const head = s.h("div", { class: "row a-down", style: { justifyContent: "space-between", flexWrap: "nowrap" } },
            s.h("span", { class: "h2", style: { color: P.unit } }, "Versuchsprotokoll: Kresse und Licht"),
            s.h("span", { class: "t pencil", style: { fontSize: "21px" } }, "Name: Julian · Datum: ____"));
          const sheet = s.h("div", { class: "card stack a-zoom", style: { height: "100%", gap: "12px", background: "#fdfdf8", padding: "14px 18px" } }, head,
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "12px", flex: 1 } }, ...f));
          s.add(sheet);
          s.sfx.whoosh();
          const says = ["Die Frage steht ganz oben.", "Dann die Vermutung, mit Begründung.", "Was brauchst du? Das Material.", "Die Durchführung, mit einer Skizze.", "Was hast du gesehen? Das ist die Beobachtung.", "Und zum Schluss das Ergebnis."];
          f.forEach((x, i) => s.step(async () => { s.sound("pencil-write", { vol: .7 }); x.style.borderColor = P.unit; f.forEach(y => y !== x && (y.style.borderColor = "var(--line)")); s.say(says[i]); await s.show(x.content, "fade"); }));
        },
      },
      /* 9 ------------------------------------------------------------ */
      {
        title: "Laborregeln",
        say: "Im Fachraum gelten Regeln. Sie schützen dich und die anderen.",
        build(s) {
          const ic = (draw) => { const sv = s.svg(160, 144); sv.setAttribute("viewBox", "0 0 100 90"); draw(sv); return sv; };
          const st = { fill: "none", stroke: P.ink, "stroke-width": 4, "stroke-linecap": "round", "stroke-linejoin": "round" };
          const slash = sv => sv.append(s.el("line", { x1: 16, y1: 78, x2: 84, y2: 10, stroke: P.red, "stroke-width": 7, "stroke-linecap": "round" }));
          const fanHand = s.el("g", null, s.el("path", Object.assign({ d: "M60 24 C70 20 82 22 88 28 L88 38 L64 38 Z" }, st, { fill: "#f6d2b0" })));
          const rules = [
            ["Schutzbrille tragen", sv => { sv.append(s.el("path", Object.assign({ d: "M10 40 C10 28 46 28 46 40 C46 54 10 54 10 40 Z M54 40 C54 28 90 28 90 40 C90 54 54 54 54 40 Z" }, st, { fill: "#cfe8f6" })), s.el("path", Object.assign({ d: "M46 40 L54 40 M10 40 L2 36 M90 40 L98 36" }, st))); }],
            ["Lange Haare zusammenbinden", sv => { sv.append(s.el("circle", Object.assign({ cx: 42, cy: 46, r: 22 }, st, { fill: "#f6d2b0" })), s.el("path", { d: "M20 42 C20 20 64 18 64 40 L64 34 C76 40 80 60 72 78 C66 66 64 56 62 44 Z", fill: "#7a4a24" }), s.el("rect", { x: 61, y: 38, width: 10, height: 8, rx: 2, fill: P.red })); }],
            ["Nicht essen, nicht trinken", sv => { sv.append(s.el("path", Object.assign({ d: "M24 30 L30 76 L54 76 L60 30 Z" }, st, { fill: "#d9eefc" })), s.el("circle", Object.assign({ cx: 74, cy: 58, r: 14 }, st, { fill: "#f08a7a" }))); slash(sv); }],
            ["Nie etwas probieren", sv => { sv.append(s.el("path", Object.assign({ d: "M22 46 C34 64 66 64 78 46 C66 52 34 52 22 46 Z" }, st, { fill: "#f08a7a" })), s.el("path", Object.assign({ d: "M44 54 C44 66 56 66 56 54" }, st, { fill: "#e5546a" }))); slash(sv); }],
            ["Gerüche nur zufächeln", sv => { sv.append(s.el("path", Object.assign({ d: "M14 82 L34 82 L30 56 L30 40 L18 40 L18 56 Z" }, st, { fill: "#d9eefc" })), s.el("path", { d: "M24 34 C18 26 30 20 24 12 M32 32 C26 24 38 18 32 10", fill: "none", stroke: P.violet, "stroke-width": 3, "stroke-linecap": "round" }), fanHand); }],
            ["Anleitung genau lesen", sv => { sv.append(s.el("rect", Object.assign({ x: 22, y: 8, width: 52, height: 72, rx: 6 }, st, { fill: "#fff" })), ...[24, 36, 48, 60].map(y => s.el("line", { x1: 32, y1: y, x2: 64, y2: y, stroke: P.pencil, "stroke-width": 3 })), s.el("circle", Object.assign({ cx: 72, cy: 58, r: 12 }, st)), s.el("line", Object.assign({ x1: 80, y1: 67, x2: 92, y2: 80 }, st))); }],
            ["Platz ordentlich halten", sv => { sv.append(s.el("rect", Object.assign({ x: 8, y: 60, width: 84, height: 8, rx: 3 }, st, { fill: "#c8743c" })), s.el("rect", Object.assign({ x: 22, y: 36, width: 12, height: 24, rx: 3 }, st, { fill: "#d9eefc" })), s.el("rect", Object.assign({ x: 42, y: 30, width: 12, height: 30, rx: 3 }, st, { fill: "#d9eefc" })), s.el("path", { d: "M64 40 L72 50 L88 26", fill: "none", stroke: P.green, "stroke-width": 6, "stroke-linecap": "round" })); }],
            ["Unfälle sofort melden", sv => { sv.append(s.el("path", Object.assign({ d: "M14 14 L86 14 C90 14 92 16 92 20 L92 56 C92 60 90 62 86 62 L40 62 L24 78 L26 62 L14 62 C10 62 8 60 8 56 L8 20 C8 16 10 14 14 14 Z" }, st, { fill: "#fff6c9" })), s.el("rect", { x: 46, y: 22, width: 8, height: 24, rx: 3, fill: P.red }), s.el("circle", { cx: 50, cy: 53, r: 4.5, fill: P.red })); }],
          ];
          const cards = rules.map(([t, draw], i) => later(s.h("div", { class: "card stack", style: { alignItems: "center", gap: "8px", padding: "14px 12px", textAlign: "center" } },
            s.h("span", { style: { font: "800 22px/1 var(--f-display)", color: P.unit, alignSelf: "flex-start" } }, String(i + 1)), ic(draw), s.h("p", { class: "t", style: { fontSize: "24px", lineHeight: 1.25 } }, t))));
          const grid = s.h("div", { class: "cols4", style: { gridTemplateRows: "1fr 1fr", gap: "16px", height: "100%" } }, ...cards);
          s.add(grid);
          s.sfx.whoosh();
          const sayT = ["Schutzbrille, Haare zusammenbinden, nicht essen und nicht trinken, nie etwas probieren.", "Gerüche nur zufächeln. Anleitung lesen. Ordnung halten. Unfälle sofort melden."];
          [[0, 1, 2, 3], [4, 5, 6, 7]].forEach((grp, gi) => s.step(async () => { s.say(sayT[gi]); for (const i of grp) { s.sfx.count(i); s.show(cards[i], "pop"); await s.wait(260); } if (gi === 1) {
            s.tween({ from: 0, to: 6 * Math.PI, dur: 2400, ease: "linear", update: v => fanHand.setAttribute("transform", `translate(${-Math.abs(Math.sin(v)) * 14} ${Math.sin(v) * 6})`) }); } }));
        },
      },
      /* 9b ----------------------------------------------------------- */
      {
        title: "Sicherheit im Fachraum",
        say: "So sehen die Sicherheits-Sachen im Fachraum in echt aus. Schau nach, wo sie in deinem NaWi-Raum hängen!",
        build(s) {
          const card = (fig, txt) => later(s.h("div", { class: "stack", style: { gap: "10px", alignItems: "center" } }, fig, s.h("p", { class: "t", style: { fontSize: "21px", textAlign: "center" } }, txt)));
          const cards = [
            card(s.photo("schutzbrille", { w: 255, h: 330, caption: "Schutzbrille" }), "schützt die Augen vor Spritzern"),
            card(s.photo("augendusche", { w: 255, h: 330, caption: "Augendusche" }), "spült Spritzer sofort aus dem Auge"),
            card(s.photo("loeschdecke", { w: 255, h: 330, pos: "50% 45%", caption: "Feuerlöscher und Löschdecke" }), "löschen kleine Brände"),
            card(s.photo("rg-halter", { w: 255, h: 330, pos: "50% 40%", caption: "Reagenzglashalter" }), "hält das heiße Glas – nicht deine Finger"),
          ];
          const merk = later(s.h("div", { class: "merk", style: { fontSize: "22px" } }, "Wo hängen in deinem NaWi-Raum ", b(s, "Augendusche"), ", ", b(s, "Feuerlöscher"), " und ", b(s, "Löschdecke"), "? Schau beim nächsten Mal nach!"));
          s.add(root(s, "stack", { justifyContent: "center", gap: "26px" }, s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 255px)", gap: "26px", justifyContent: "center", alignItems: "start" } }, ...cards), merk));
          s.step(async () => { s.sound("splash", { vol: .5 }); s.show(cards[0], "up"); await s.wait(250); await s.show(cards[1], "up"); s.say("Schutzbrille und Augendusche schützen deine Augen."); });
          s.step(async () => { s.sound("fire", { vol: .4, dur: 2.5 }); s.show(cards[2], "up"); await s.wait(250); await s.show(cards[3], "up"); s.say("Feuerlöscher und Löschdecke helfen bei Feuer. Der Halter schützt deine Finger."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 10 ----------------------------------------------------------- */
      {
        title: "Gefahrenpiktogramme",
        say: "Rote Rauten warnen vor Gefahren. Es gibt neun solcher Zeichen. Tippe auf eines!",
        build(s) {
          const ids = Object.keys(GHS);
          const big = s.h("div", { style: { width: "150px", height: "150px", flex: "none" } });
          const nm = s.h("p", { class: "h2", style: { color: P.ghs } }, "");
          const mean = s.h("p", { class: "t" }, "");
          const exl = s.h("p", { class: "t", style: { fontSize: "22px" } }, "");
          const info = s.h("div", { class: "card stack", style: { gap: "12px" } }, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "18px" } }, big, s.h("div", { class: "stack", style: { gap: "6px" } }, s.h("span", { class: "exlabel", style: { marginBottom: 0 } }, ""), nm, mean)),
            s.h("div", { class: "life", style: { padding: "12px 16px" } }, s.h("span", { class: "exlabel" }, "Im Alltag zum Beispiel"), exl));
          const codeLbl = info.querySelector(".exlabel");
          const tiles = [];
          const select = (id, quiet) => {
            const d = GHS[id]; big.innerHTML = ""; const ic = ghsIcon(s, id, 150); big.append(ic);
            codeLbl.textContent = id; nm.textContent = d.name; mean.textContent = d.mean; exl.textContent = d.ex;
            tiles.forEach(t => (t.style.background = t.dataset.id === id ? "#fff1f1" : "transparent"));
            if (!quiet) { s.sfx.pop(); ic.classList.add("a-pop"); }
          };
          ids.forEach(id => { const t = later(s.h("button", { class: "nosw", "data-id": id, style: { width: "150px", height: "150px", border: 0, borderRadius: "16px", background: "transparent", padding: "6px", cursor: "pointer" }, onclick: () => select(id) }, ghsIcon(s, id, 138))); tiles.push(t); });
          const grid = s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 150px)", gap: "26px 22px", justifyContent: "center", alignContent: "center" } }, ...tiles);
          const merk = later(s.h("div", { class: "merk", style: { fontSize: "21px" } }, "Rote Raute = ", b(s, "Vorsicht!"), " Das Signalwort sagt, wie schlimm: ", b(s, "„Gefahr“"), " ist schlimmer als ", b(s, "„Achtung“"), "."));
          const hint = s.h("p", { class: "small pencil" }, "Tippe links auf ein Zeichen.");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "520px 1fr", gap: "28px", alignItems: "center" }, grid, s.h("div", { class: "stack", style: { gap: "14px" } }, hint, info, merk)));
          select("GHS02", true);
          s.sfx.whoosh();
          s.step(async () => { for (let i = 0; i < 9; i++) { s.sfx.count(i); s.show(tiles[i], "zoom"); await s.wait(140); } s.say("Neun Zeichen, alle als rote Raute."); });
          s.step(async () => { select("GHS05"); await s.wait(900); select("GHS08"); s.say("Ätzend, entzündbar, gesundheitsschädlich. Tippe selbst auf die anderen."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 11 ----------------------------------------------------------- */
      {
        title: "Gefahr im Putzschrank",
        say: "Auch zu Hause gibt es diese Zeichen. Tippe auf eine Flasche.",
        build(s) {
          const items = [
            { n: "Brennspiritus", c: "#5aa9e6", p: ["GHS02", "GHS07"], t: "Brennt sehr leicht und reizt die Augen." },
            { n: "Abflussreiniger", c: "#f0b429", p: ["GHS05"], t: "Stark ätzend – zerstört Haut und Augen." },
            { n: "Lampenöl", c: "#e8d9a8", p: ["GHS08"], t: "Schon ein Schluck kann die Lunge schwer schädigen." },
            { n: "Campinggas", c: "#d64545", p: ["GHS02", "GHS04"], t: "Gas unter Druck, extrem entzündbar." },
          ];
          const svg = s.svg(560, 470);
          svg.append(s.el("rect", { x: 10, y: 10, width: 540, height: 450, rx: 12, fill: "#f3ece2", stroke: "#b9a68c", "stroke-width": 4 }));
          svg.append(s.el("rect", { x: 10, y: 420, width: 540, height: 14, fill: "#b9a68c" }));
          const groups = [];
          items.forEach((it, i) => {
            const x = 80 + i * 132, g = fb(s.el("g", { style: { cursor: "pointer" } }));
            if (it.n === "Campinggas") {
              g.append(s.el("rect", { x: x - 42, y: 300, width: 84, height: 120, rx: 18, fill: it.c, stroke: "#7a1f1f", "stroke-width": 3 }), s.el("rect", { x: x - 12, y: 284, width: 24, height: 18, rx: 4, fill: "#9aa7b5" }));
            } else {
              const top = i === 2 ? 210 : 180;
              g.append(s.el("path", { d: `M${x - 40} 420 L${x - 40} ${top + 70} C${x - 40} ${top + 40} ${x - 16} ${top + 34} ${x - 14} ${top + 10} L${x + 14} ${top + 10} C${x + 16} ${top + 34} ${x + 40} ${top + 40} ${x + 40} ${top + 70} L${x + 40} 420 Z`, fill: it.c, stroke: "#556", "stroke-width": 3 }),
                s.el("rect", { x: x - 16, y: top - 10, width: 32, height: 22, rx: 4, fill: i === 1 ? P.blue : "#333" }));
            }
            const icons = it.p.map((id, k) => { const ic = s.el("g", { transform: `translate(${x - 46 + (it.p.length === 1 ? 23 : k * 46)} ${it.n === "Campinggas" ? 334 : 320}) scale(.46)` }); ic.append(s.el("polygon", { points: "50,4 96,50 50,96 4,50", fill: "#fff", stroke: P.ghs, "stroke-width": 8 }), ghsSymbol(s, id)); return ic; });
            g.append(...icons);
            g.addEventListener("click", () => select(i));
            groups.push(g); svg.append(g);
          });
          const lbls = items.map((it, i) => T(s, 80 + i * 132, 456, it.n.replace("Brennspiritus", "Spiritus"), { "font-size": 19 }));
          svg.append(...lbls);
          const shelfTop = s.el("text", { x: 280, y: 60, "text-anchor": "middle", "font-size": 26, "font-weight": 700, fill: "#8a6a44", text: "Putzschrank" });
          svg.append(shelfTop);
          const iname = s.h("p", { class: "h2" }, "");
          const itext = s.h("p", { class: "t", style: { fontSize: "22px" } }, "");
          const icRow = s.h("div", { class: "row", style: { gap: "10px", flexWrap: "nowrap" } });
          const info = s.h("div", { class: "card stack", style: { gap: "8px" } }, s.h("div", { class: "row", style: { flexWrap: "nowrap", justifyContent: "space-between" } }, iname, icRow), itext);
          const select = (i, quiet) => {
            const it = items[i]; iname.textContent = it.n; itext.textContent = it.t; icRow.innerHTML = ""; it.p.forEach(id => icRow.append(ghsIcon(s, id, 70)));
            groups.forEach((g, k) => (g.style.opacity = k === i ? 1 : 0.55));
            if (!quiet) { s.sfx.pop(); groups[i].classList.remove("a-pop"); void groups[i].getBoundingClientRect(); groups[i].classList.add("a-pop"); }
          };
          select(0, true);
          const rules = later(s.h("div", { class: "merk", style: { fontSize: "21px", padding: "12px 18px 14px" } },
            s.h("div", null, "• nur in der ", b(s, "Originalflasche"), " lassen"), s.h("div", null, "• ", b(s, "nie"), " in Trinkflaschen umfüllen"), s.h("div", null, "• hoch und sicher aufbewahren")));
          const notruf = later(s.h("div", { class: "card", style: { borderColor: P.red, padding: "10px 16px" } }, s.h("p", { class: "t", style: { fontSize: "22px" } }, "Giftnotruf Berlin: ", s.h("b", { class: "red mono" }, "030 19240"))));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "560px 1fr", gap: "26px", alignItems: "center" }, svg, s.h("div", { class: "stack", style: { gap: "14px" } }, s.h("p", { class: "small pencil" }, "Tippe auf eine Flasche."), info, rules, notruf)));
          s.sfx.whoosh();
          s.step(async () => { for (let i = 1; i < 4; i++) { select(i); await s.wait(700); } s.say("Spiritus, Abflussreiniger, Lampenöl, Campinggas: Alle tragen Warnzeichen."); });
          s.step(async () => { s.sfx.ding(); await s.show(rules, "up"); s.say("Gefährliche Mittel bleiben in der Originalflasche und gehören nie in eine Trinkflasche."); });
          s.step(async () => { s.sound("telefon", { vol: .5, dur: 2.5 }); await s.show(notruf, "pop"); s.say("Im Notfall hilft der Giftnotruf Berlin."); });
        },
      },
      /* 12 ----------------------------------------------------------- */
      {
        title: "Der Gasbrenner",
        say: "Mit dem Gasbrenner wird im Labor erhitzt. Die Luftzufuhr verändert die Flamme.",
        build(s) {
          const W = 460, H = 600, CX = 190;
          const wrap = s.h("div", { style: { position: "relative", width: W + "px", height: H + "px" } });
          const svg = s.svg(W, H);
          const st = { stroke: "#4a5568", "stroke-width": 3 };
          svg.append(s.el("path", Object.assign({ d: "M0 552 C40 552 50 548 80 548 L110 548", fill: "none", stroke: "#e07b39", "stroke-width": 12, "stroke-linecap": "round" })));
          svg.append(s.el("rect", Object.assign({ x: 90, y: 560, width: 200, height: 26, rx: 8, fill: "#3d4a5c" }, st)));
          svg.append(s.el("rect", Object.assign({ x: 150, y: 520, width: 80, height: 42, rx: 6, fill: "#7d8a99" }, st)));
          svg.append(s.el("rect", Object.assign({ x: 108, y: 538, width: 44, height: 16, rx: 4, fill: "#7d8a99" }, st)));
          const knob = s.el("rect", Object.assign({ x: 176, y: 578, width: 28, height: 18, rx: 4, fill: "#2b6cb0" }, st));
          svg.append(knob);
          const ring = s.el("rect", Object.assign({ x: 160, y: 462, width: 60, height: 58, rx: 8, fill: "#a0aec0" }, st));
          svg.append(ring);
          const holes = [0, 1].map(i => s.el("rect", { x: 170 + i * 26, y: 480, width: 14, height: 22, rx: 3, fill: "#1b2740" }));
          svg.append(...holes);
          svg.append(s.el("rect", Object.assign({ x: CX - 18, y: 262, width: 36, height: 202, fill: "#cbd5e0" }, st)));
          const lab = (y, t, ty) => { svg.append(s.el("line", { x1: 238, y1: y, x2: 262, y2: ty || y, stroke: P.pencil, "stroke-width": 2 })); svg.append(s.el("text", { x: 268, y: (ty || y) + 7, "font-size": 20, "font-weight": 700, fill: P.ink, text: t })); };
          lab(360, "Brennerrohr");
          lab(491, "Luftregulierung");
          svg.append(s.el("line", { x1: 206, y1: 583, x2: 300, y2: 583, stroke: P.pencil, "stroke-width": 2 }), s.el("text", { x: 306, y: 590, "font-size": 20, "font-weight": 700, fill: P.ink, text: "Gasregulierung" }));
          svg.append(s.el("text", { x: 4, y: 534, "font-size": 20, "font-weight": 700, fill: "#c25a1c", text: "Gas" }));
          const { canvas, g } = s.canvas(380, 264);
          canvas.style.position = "absolute"; canvas.style.left = "0"; canvas.style.top = "0";
          wrap.append(svg, canvas);
          let air = 0, lit = 0;
          s.loop(t => {
            g.clearRect(0, 0, 380, 264);
            if (lit <= 0) return;
            const by = 262;
            g.save(); g.globalAlpha = lit;
            // luminous flame
            const ya = (1 - air) * lit;
            if (ya > 0.01) {
              g.globalAlpha = ya * lit;
              const hh = 230, ww = 40;
              const fl = Math.sin(t * 9) * 6 + Math.sin(t * 13.7) * 4;
              const grd = g.createLinearGradient(0, by, 0, by - hh); grd.addColorStop(0, "#5aa0ff"); grd.addColorStop(0.12, "#ffd25a"); grd.addColorStop(0.6, "#ff9f1c"); grd.addColorStop(1, "rgba(255,90,20,0)");
              g.fillStyle = grd; g.beginPath(); g.moveTo(CX - 18, by);
              g.bezierCurveTo(CX - ww - 6, by - 80, CX - 22 + fl, by - 170, CX + fl * 1.5, by - hh);
              g.bezierCurveTo(CX + 22 + fl, by - 170, CX + ww + 6, by - 80, CX + 18, by); g.closePath(); g.fill();
            }
            if (air > 0.01) {
              g.globalAlpha = air * lit;
              const hh = 170 + Math.sin(t * 30) * 2, ww = 30;
              const grd = g.createLinearGradient(0, by, 0, by - hh); grd.addColorStop(0, "rgba(40,90,230,.85)"); grd.addColorStop(1, "rgba(90,140,255,.15)");
              g.fillStyle = grd; g.beginPath(); g.moveTo(CX - 18, by); g.bezierCurveTo(CX - ww, by - 60, CX - 14, by - 140, CX, by - hh); g.bezierCurveTo(CX + 14, by - 140, CX + ww, by - 60, CX + 18, by); g.closePath(); g.fill();
              g.fillStyle = "rgba(120,220,255,.95)"; g.beginPath(); g.moveTo(CX - 16, by); g.quadraticCurveTo(CX - 12, by - 50, CX, by - 72); g.quadraticCurveTo(CX + 12, by - 50, CX + 16, by); g.closePath(); g.fill();
            }
            g.restore();
          });
          let rumble = 0;
          const setAir = v => {
            air = v; holes.forEach(h => h.setAttribute("height", 4 + v * 18));
            typeOut.textContent = v < 0.35 ? "leuchtende Flamme" : v > 0.65 ? "rauschende Flamme" : "Übergang …";
            typeOut.style.color = v < 0.35 ? P.orange : v > 0.65 ? P.blue : P.pencil;
            descOut.textContent = v < 0.35 ? "gelb, flackert, rußt – bis etwa 900 °C" : v > 0.65 ? "blau, rauscht laut – bis etwa 1500 °C" : "mehr Luft → bläulicher, heißer";
            const now = performance.now(); if (v > 0.5 && lit > 0 && now - rumble > 350) { rumble = now; s.sfx.noise(0.4, 0.05 + v * 0.08, 180, 600, 0, 0.6); }
          };
          const typeOut = s.h("p", { class: "h2" }, "");
          const descOut = s.h("p", { class: "t", style: { fontSize: "22px" } }, "");
          const sl = later(s.slider({ label: "Luftzufuhr", min: 0, max: 100, step: 5, value: 0, fmt: v => v + " %", onInput: v => setAir(v / 100) }));
          const readout = later(s.h("div", { class: "card stack", style: { gap: "4px", padding: "12px 18px" } }, typeOut, descOut));
          const how = [
            "Schutzbrille auf, Haare zusammenbinden.",
            "Luftzufuhr schließen. Gas öffnen und sofort anzünden.",
            "Luftzufuhr langsam öffnen: Die Flamme wird blau und rauscht.",
            "Ausmachen: erst die Luft zu, dann das Gas.",
          ].map((t, i) => later(s.h("div", { style: { display: "grid", gridTemplateColumns: "36px 1fr", gap: "10px", alignItems: "start" } },
            s.h("span", { style: { width: "34px", height: "34px", borderRadius: "50%", background: P.unit, color: "#fff", font: "700 19px/34px var(--f-display)", textAlign: "center" } }, String(i + 1)), s.h("p", { class: "t", style: { fontSize: "22px" } }, t))));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: W + "px 1fr", gap: "30px", alignItems: "center" }, wrap,
            s.h("div", { class: "stack", style: { gap: "12px" } }, s.h("p", { class: "h2", style: { color: P.unit } }, "So zündest du den Brenner an"), ...how, readout, sl)));
          setAir(0);
          s.sfx.pop();
          s.step(async () => { s.sfx.pop(); await s.show(how[0], "left"); });
          s.step(async () => { s.sfx.pop(); s.show(how[1], "left"); await s.wait(500); s.sound("match-strike"); s.show(readout, "pop"); await s.tween({ from: 0, to: 1, dur: 600, update: v => (lit = v) }); s.say("Die leuchtende Flamme ist gelb und flackert."); });
          s.step(async () => { s.sound("gasflamme", { vol: .5 }); s.show(how[2], "left"); s.show(sl, "up"); await s.tween({ from: 0, to: 1, dur: 2200, update: v => { setAir(v); sl.input.value = Math.round(v * 20) * 5; sl.querySelector(".mono").textContent = Math.round(v * 20) * 5 + " %"; } }); s.say("Mit Luft wird die Flamme blau und rauscht. Probier den Regler aus!"); });
          s.step(async () => { s.sfx.ding(); await s.show(how[3], "left"); });
        },
      },
      /* 13 ----------------------------------------------------------- */
      {
        title: "Wo ist die Flamme am heißesten?",
        say: "Die rauschende Flamme ist viel heißer als die leuchtende. Am heißesten ist sie knapp über dem hellblauen Innenkegel.",
        build(s) {
          const svg = s.svg(640, 600);
          const BY = 540;
          svg.append(s.el("rect", { x: 112, y: BY, width: 36, height: 60, fill: "#cbd5e0", stroke: "#4a5568", "stroke-width": 3 }), s.el("rect", { x: 342, y: BY, width: 36, height: 60, fill: "#cbd5e0", stroke: "#4a5568", "stroke-width": 3 }));
          const defs = s.el("defs", null,
            s.el("linearGradient", { id: "u1lum", x1: 0, y1: 1, x2: 0, y2: 0 }, s.el("stop", { offset: 0, "stop-color": "#5aa0ff" }), s.el("stop", { offset: .15, "stop-color": "#ffd25a" }), s.el("stop", { offset: .65, "stop-color": "#ff9f1c" }), s.el("stop", { offset: 1, "stop-color": "#ff7a1a", "stop-opacity": .25 })),
            s.el("linearGradient", { id: "u1blu", x1: 0, y1: 1, x2: 0, y2: 0 }, s.el("stop", { offset: 0, "stop-color": "#2a5ae6" }), s.el("stop", { offset: 1, "stop-color": "#7aa2ff", "stop-opacity": .35 })));
          svg.append(defs);
          const lum = fb(s.el("path", { d: `M112 ${BY} C70 440 104 300 130 ${BY - 330} C156 300 190 440 148 ${BY} Z`, fill: "url(#u1lum)" }));
          const lumIn = s.el("path", { d: `M120 ${BY} C104 470 118 400 130 ${BY - 200} C142 400 156 470 140 ${BY} Z`, fill: "#ffe9a8", opacity: .7 });
          const outer = s.el("path", { d: `M342 ${BY} C304 460 334 330 360 ${BY - 300} C386 330 416 460 378 ${BY} Z`, fill: "url(#u1blu)" });
          const inner = s.el("path", { d: `M344 ${BY} C338 500 350 450 360 ${BY - 120} C370 450 382 500 376 ${BY} Z`, fill: "#8fe3ff" });
          svg.append(lum, lumIn, outer, inner);
          const hot = later(fb(s.el("g", null, s.el("circle", { cx: 360, cy: BY - 128, r: 18, fill: "#fff36b", opacity: .55 }), s.el("circle", { cx: 360, cy: BY - 128, r: 8, fill: "#fff" }))));
          svg.append(hot);
          svg.append(T(s, 130, 590, "leuchtend", { fill: P.orange, "font-size": 21 }), T(s, 360, 590, "rauschend", { fill: P.blue, "font-size": 21 }));
          const tag = (x1, y1, x2, y2, l1, l2, col, anchor = "start") => {
            const g = later(s.el("g"));
            g.append(s.el("line", { x1, y1, x2, y2, stroke: col, "stroke-width": 2.5 }), s.el("circle", { cx: x1, cy: y1, r: 4, fill: col }));
            const tx = x2 + (anchor === "start" ? 6 : -6);
            g.append(s.el("text", { x: tx, y: y2 - 4, "text-anchor": anchor, "font-size": 20, "font-weight": 700, fill: P.ink, text: l1 }), s.el("text", { x: tx, y: y2 + 20, "text-anchor": anchor, "font-size": 21, "font-weight": 800, fill: col, text: l2 }));
            svg.append(g); return g;
          };
          const tL = [tag(150, 250, 196, 196, "außen", "≈ 900 °C", P.orange), tag(132, 400, 196, 290, "innen", "≈ 600 °C", P.orange)];
          const tR = [tag(388, 330, 430, 270, "Außenkegel", "≈ 1300 °C", P.blue), tag(368, 505, 430, 505, "Innenkegel", "≈ 300–500 °C", "#0e7490"), tag(372, BY - 128, 430, 395, "heißeste Stelle", "≈ 1500 °C", P.red)];
          // magnesia rod
          const rod = s.el("g", { style: { cursor: "grab" } });
          const rodLine = s.el("rect", { x: 250, y: -4, width: 146, height: 8, rx: 4, fill: "#f4f1ea", stroke: "#8a8a80", "stroke-width": 2 });
          const glowA = s.el("circle", { cx: 0, cy: 0, r: 9, fill: "#ff8a3d", opacity: 0 }), glowB = s.el("circle", { cx: 0, cy: 0, r: 9, fill: "#ff8a3d", opacity: 0 });
          const grip = s.el("circle", { cx: 250, cy: 0, r: 20, fill: P.unit, opacity: .9 });
          rod.append(s.el("rect", { x: 226, y: -24, width: 176, height: 48, fill: "transparent" }), rodLine, glowA, glowB, grip);
          const rodG = later(rod); svg.append(rodG);
          const innerHalf = y => { const top = BY - 120; if (y < top || y > BY) return null; const f = (BY - y) / 120; return 16 * (1 - f) + 2; };
          let rodY = 470;
          const setRod = y => {
            rodY = Math.max(350, Math.min(BY - 10, y)); rod.setAttribute("transform", `translate(0 ${rodY})`);
            const h = innerHalf(rodY);
            if (h != null) { glowA.setAttribute("cx", 360 - h - 3); glowB.setAttribute("cx", 360 + h + 3); glowA.setAttribute("opacity", 1); glowB.setAttribute("opacity", 1); glowA.setAttribute("r", 7 + (1 - h / 18) * 5); glowB.setAttribute("r", 7 + (1 - h / 18) * 5); }
            else if (rodY < BY - 120 && rodY > BY - 170) { glowA.setAttribute("cx", 360); glowA.setAttribute("opacity", 1); glowA.setAttribute("r", 13); glowB.setAttribute("opacity", 0); }
            else { glowA.setAttribute("cx", 360); glowA.setAttribute("opacity", Math.max(0, 0.5 - Math.abs(rodY - (BY - 145)) / 300)); glowB.setAttribute("opacity", 0); glowA.setAttribute("r", 10); }
          };
          setRod(470);
          let lastTick = 0;
          s.drag(rod, { space: svg, onMove: p => { setRod(p.y); const n = Math.round(rodY / 20); if (n !== lastTick) { lastTick = n; s.sfx.tick(); } } });
          const card = later(s.h("div", { class: "card stack", style: { gap: "6px" } }, s.h("span", { class: "exlabel" }, "Ausprobieren"),
            s.h("p", { class: "t", style: { fontSize: "22px" } }, "Zieh das ", b(s, "Magnesiastäbchen"), " am Griff hoch und runter. Wo es glüht, ist es besonders heiß.")));
          const lifeBox = later(life(s, { style: { padding: "12px 18px" } },
            s.h("p", { class: "t", style: { fontSize: "21px" } }, "🕯️ ", b(s, "Kerze:"), " leuchtet gelb – wie die leuchtende Flamme. Das Gelb ist ", b(s, "glühender Ruß"), "."),
            s.h("p", { class: "t", style: { fontSize: "21px", marginTop: "6px" } }, "🔥 ", b(s, "Gasherd:"), " brennt mit blauer Flamme – das Gas bekommt genug Luft.")));
          const merk = later(s.h("div", { class: "merk", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Zum Erhitzen nimmt man die ", b(s, "rauschende Flamme"), "."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "640px 1fr", gap: "22px", alignItems: "center" }, svg, s.h("div", { class: "stack", style: { gap: "12px" } }, card, lifeBox, merk)));
          s.sfx.whoosh();
          s.step(async () => { s.sfx.pop(); await s.show(tL, "fade"); s.say("Die leuchtende Flamme: innen etwa 600, außen etwa 900 Grad."); });
          s.step(async () => { s.sfx.pop(); await s.show(tR.slice(0, 2), "fade"); s.sfx.zap(); s.show(hot, "zoom"); await s.show(tR[2], "fade"); hot.classList.add("a-pulse"); s.say("Die rauschende Flamme wird bis etwa 1500 Grad heiß."); });
          s.step(async () => { s.sfx.pop(); s.show(rodG, "left"); await s.show(card, "up"); await s.tween({ from: 470, to: 405, dur: 1400, update: setRod }); });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(lifeBox, "up"); s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 13b ---------------------------------------------------------- */
      {
        title: "Flammen in echt",
        say: "So sehen die Flammen in echt aus. Mit mehr Luft wird aus der gelben, leuchtenden Flamme eine blaue, rauschende.",
        build(s) {
          const burner = s.h("div", { class: "stack", style: { gap: "10px", alignItems: "center" } },
            s.photo("gasbrenner", { w: 240, h: 400, pos: "62% 50%" }), s.h("p", { class: "t", style: { fontSize: "21px", textAlign: "center" } }, "ein echter Gasbrenner"));
          const types = later(s.h("div", { class: "stack", style: { gap: "10px", alignItems: "center" } },
            s.photo("flammen-typen", { w: 420, h: 400 }),
            s.h("p", { class: "t", style: { fontSize: "21px", textAlign: "center" } }, b(s, "1"), " Luft zu: gelb, leuchtend · ", b(s, "4"), " Luft offen: blau, rauschend")));
          const kerze = later(s.photo("kerze-flamme", { w: 340, h: 215, pos: "40% 45%", caption: "Kerze: gelb wie die leuchtende Flamme" }));
          const herd = later(s.photo("gasherd-flamme", { w: 340, h: 215, pos: "50% 50%", caption: "Gasherd: blau wie die rauschende Flamme" }));
          const btn = s.soundBtn("gasflamme", "Rauschende Flamme anhören");
          s.add(root(s, "stack", { justifyContent: "center", gap: "18px" },
            s.h("div", { class: "row", style: { justifyContent: "center", gap: "24px", flexWrap: "nowrap", alignItems: "start" } }, burner, types, s.h("div", { class: "stack", style: { gap: "20px" } }, kerze, herd)),
            s.h("div", { class: "row", style: { justifyContent: "center" } }, btn)));
          s.step(async () => { s.sound("match-strike"); await s.show(types, "zoom"); s.say("Von eins bis vier wird die Luftzufuhr geöffnet."); });
          s.step(async () => { s.sfx.swoosh(); s.show(kerze, "left"); await s.wait(250); await s.show(herd, "left"); s.say("Die Kerze leuchtet gelb. Der Gasherd brennt blau."); });
        },
      },
      /* 14 ----------------------------------------------------------- */
      {
        title: "Sicher erhitzen",
        say: "Beim Erhitzen im Reagenzglas: schräg halten, Öffnung weg von allen Menschen, leicht schwenken.",
        build(s) {
          const svg = s.svg(600, 560);
          svg.append(s.el("rect", { x: 0, y: 520, width: 600, height: 16, fill: "#d8c3a5" }));
          svg.append(s.el("rect", { x: 222, y: 400, width: 36, height: 120, fill: "#cbd5e0", stroke: "#4a5568", "stroke-width": 3 }), s.el("rect", { x: 190, y: 510, width: 100, height: 14, rx: 4, fill: "#3d4a5c" }));
          svg.append(s.el("path", { d: "M222 400 C200 340 226 290 240 250 C254 290 280 340 258 400 Z", fill: "#3f7ae8", opacity: .75 }), s.el("path", { d: "M226 400 C222 370 232 350 240 336 C248 350 258 370 254 400 Z", fill: "#8fe3ff" }));
          // person at left
          const person = (x, col) => s.el("g", null, s.el("circle", { cx: x, cy: 300, r: 26, fill: "#f6d2b0", stroke: P.ink, "stroke-width": 3 }), s.el("path", { d: `M${x - 34} 420 C${x - 34} 350 ${x + 34} 350 ${x + 34} 420 Z`, fill: col, stroke: P.ink, "stroke-width": 3 }));
          svg.append(person(60, "#7fb7e6"));
          const tube = s.el("g");
          tube.append(s.el("path", { d: "M-14 -150 L-14 20 C-14 38 14 38 14 20 L14 -150", fill: "#eef6fb", stroke: "#5d6678", "stroke-width": 3 }));
          tube.append(s.el("path", { d: "M-12 -10 L-12 20 C-12 35 12 35 12 20 L12 -10 Z", fill: "#4b8fe0", opacity: .85 }));
          const bubbles = [0, 1, 2].map(i => s.el("circle", { cx: -5 + i * 5, cy: 20, r: 3, fill: "#fff", opacity: 0 }));
          tube.append(...bubbles);
          tube.append(s.el("rect", { x: -20, y: -128, width: 40, height: 14, rx: 3, fill: "#a87b4f", stroke: "#6b4a2b", "stroke-width": 2 }), s.el("path", { d: "M18 -122 L150 -150", stroke: "#a87b4f", "stroke-width": 12, "stroke-linecap": "round" }));
          const tubeG = s.el("g", { transform: "translate(240 220) rotate(0)" }); tubeG.append(tube); svg.append(tubeG);
          const spray = later(s.el("g", null, s.el("path", { d: "M0 0 L0 0", id: "u1sp", stroke: P.red, "stroke-width": 4, "stroke-dasharray": "10 8", fill: "none" })));
          svg.append(spray);
          const sprayLine = spray.firstChild;
          const ok = later(fb(s.el("g", null, s.el("circle", { cx: 520, cy: 70, r: 30, fill: P.green }), s.el("path", { d: "M505 70 L516 82 L536 58", stroke: "#fff", "stroke-width": 7, fill: "none", "stroke-linecap": "round" }))));
          const wall = s.el("g", null, s.el("rect", { x: 560, y: 120, width: 34, height: 400, fill: "#e9e4da", stroke: "#b9a68c", "stroke-width": 3 }));
          svg.append(wall, ok);
          let ang = 0;
          const place = (a, wob = 0) => {
            ang = a; tubeG.setAttribute("transform", `translate(240 ${300}) rotate(${a + wob})`);
            const r = (a + wob - 90) * Math.PI / 180; const ox = 240 + Math.cos(r) * 150, oy = 300 + Math.sin(r) * 150;
            sprayLine.setAttribute("d", `M${ox.toFixed(1)} ${oy.toFixed(1)} L${(ox + Math.cos(r) * 180).toFixed(1)} ${(oy + Math.sin(r) * 180).toFixed(1)}`);
          };
          place(0);
          const steps = [
            ["Schutzbrille tragen", P.unit],
            ["Nur wenig Flüssigkeit einfüllen (etwa ein Viertel)", P.unit],
            ["Mit dem Reagenzglashalter halten", P.unit],
            ["Schräg halten – Öffnung weg von allen Personen", P.red],
            ["Leicht schwenken – sonst kann es plötzlich herausspritzen (Siedeverzug)", P.unit],
          ].map(([t, c], i) => later(s.h("div", { style: { display: "grid", gridTemplateColumns: "36px 1fr", gap: "10px", alignItems: "start" } },
            s.h("span", { style: { width: "34px", height: "34px", borderRadius: "50%", background: c, color: "#fff", font: "700 19px/34px var(--f-display)", textAlign: "center" } }, String(i + 1)), s.h("p", { class: "t", style: { fontSize: "22px" } }, t))));
          const lifeBox = later(life(s, { style: { padding: "12px 18px" } }, s.h("p", { class: "t", style: { fontSize: "21px" } }, "Zu Hause genauso: den ", b(s, "Topfdeckel"), " so anheben, dass der heiße Dampf von dir weg zieht.")));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "600px 1fr", gap: "24px", alignItems: "center" }, svg, s.h("div", { class: "stack", style: { gap: "12px" } }, ...steps, lifeBox)));
          s.sfx.pop();
          s.step(async () => { s.sfx.pop(); s.show(steps[0], "left"); await s.wait(250); s.sfx.pop(); await s.show(steps[1], "left"); });
          s.step(async () => { s.sfx.pop(); await s.show(steps[2], "left"); });
          s.step(async () => {
            s.sfx.whoosh(); s.show(steps[3], "left");
            await s.tween({ from: 0, to: 40, dur: 1200, ease: "back", update: v => place(v) });
            s.show(spray, "fade"); s.sfx.ding(); await s.show(ok, "pop");
            s.say("Die Öffnung zeigt zur Wand, nicht auf Menschen.");
          });
          s.step(async () => {
            s.show(steps[4], "left"); s.say("Leicht schwenken, dann kocht es gleichmäßig.");
            bubbles.forEach(c => c.setAttribute("opacity", .9)); s.sound("bubbles", { vol: .6 });
            await s.tween({ from: 0, to: 8 * Math.PI, dur: s.fast ? 0 : 2600, ease: "linear", update: v => { place(40, Math.sin(v) * 6); bubbles.forEach((c, i) => c.setAttribute("cy", 22 - ((v * 3 + i * 9) % 28))); } });
            place(40);
          });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(lifeBox, "up"); });
        },
      },
      /* 15 ----------------------------------------------------------- */
      {
        title: "Im Alltag: Die Küche als Labor",
        say: "Deine Küche ist ein kleines Labor. Vieles dort kennst du bald aus dem NaWi-Raum.",
        build(s) {
          const rows = [
            ["🔥", "Herdplatte, Gasherd", "Gasbrenner", "Hier wird erhitzt."],
            ["🧤", "Topflappen", "Reagenzglashalter", "Schutz vor Hitze."],
            ["🥛", "Messbecher", "Messzylinder", "Flüssigkeit abmessen."],
            ["⚖️", "Küchenwaage", "Laborwaage", "Masse in Gramm."],
            ["🍲", "Deckel vom Körper weg anheben", "Öffnung weg von Personen", "Dampf und Spritzer weg."],
            ["🧴", "Putzmittel mit roter Raute", "Gefahrstoffe", "Piktogramme lesen!"],
          ];
          const headRow = s.h("div", { class: "a-down", style: { display: "grid", gridTemplateColumns: "60px 1fr 60px 1fr 1fr", gap: "12px", alignItems: "center" } },
            s.h("span"), s.h("span", { class: "h2", style: { color: P.orange, fontSize: "26px" } }, "Küche"), s.h("span"), s.h("span", { class: "h2", style: { color: P.unit, fontSize: "26px" } }, "Labor"), s.h("span", { class: "h2", style: { color: P.pencil, fontSize: "26px" } }, "Wozu?"));
          const els = rows.map(([e, k, l, w]) => {
            const arrow = s.svg(60, 30); const ln = s.el("path", { d: "M6 15 L50 15 M40 6 L52 15 L40 24", stroke: P.unit, "stroke-width": 4, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round", class: "later" }); arrow.append(ln);
            const left = s.h("p", { class: "t", style: { fontSize: "22px" } }, b(s, k));
            const right = later(s.h("p", { class: "t", style: { fontSize: "22px", color: P.unit } }, b(s, l)));
            const why = later(s.h("p", { class: "t pencil", style: { fontSize: "21px" } }, w));
            const row = later(s.h("div", { class: "card", style: { display: "grid", gridTemplateColumns: "60px 1fr 60px 1fr 1fr", gap: "12px", alignItems: "center", padding: "8px 14px" } },
              s.h("span", { style: { fontSize: "34px", textAlign: "center" } }, e), left, arrow, right, why));
            return { row, ln, right, why };
          });
          s.add(root(s, "stack", { gap: "10px", justifyContent: "center" }, headRow, ...els.map(x => x.row)));
          s.sfx.whoosh();
          const grpSnd = [["sizzle", .5], ["water-pour", .6], null];
          s.preload("sizzle", "water-pour");
          [[0, 1], [2, 3], [4, 5]].forEach((grp, gi) => s.step(async () => {
            if (grpSnd[gi]) s.sound(grpSnd[gi][0], { vol: grpSnd[gi][1], dur: 2.5 });
            for (const i of grp) { const r = els[i]; await s.show(r.row, "left"); s.sfx.snap(); await s.show(r.ln, "draw"); s.show([r.right, r.why], "pop"); await s.wait(200); }
            if (gi === 2) s.sfx.chord([0, 4, 7]);
          }));
        },
      },
      /* 16 ----------------------------------------------------------- */
      {
        title: "Forscher-Auftrag für zu Hause",
        say: "Jetzt bist du dran! Mach das Kresse-Experiment zu Hause und schreibe ein Protokoll.",
        build(s) {
          const svg = s.svg(1100, 250);
          svg.append(s.el("line", { x1: 60, y1: 200, x2: 1040, y2: 200, stroke: P.pencil, "stroke-width": 4 }));
          const days = [[0, "Tag 0", "aussäen"], [1.5, "Tag 1–2", "Samen keimen"], [4, "Tag 4", "es wächst"], [7, "Tag 7", "vergleichen"]];
          const xs = [150, 420, 690, 960];
          const marks = days.map(([d, t, sub], i) => {
            const g = later(s.el("g"));
            const d1 = dish(s, xs[i] - 62, 160, "licht", 0.5), d2 = dish(s, xs[i] + 62, 160, "dunkel", 0.5); d1.set(d); d2.set(d);
            g.append(d1, d2, s.el("circle", { cx: xs[i], cy: 200, r: 9, fill: P.unit }), T(s, xs[i], 232, t + ": " + sub, { "font-size": 21, fill: P.unit }));
            svg.append(g); return g;
          });
          const steps = [
            ["Material", "2 Schalen, Watte, Kressesamen, Wasser, ein Karton"],
            ["So geht's", "Watte nass machen, Samen streuen. Eine Schale ans Fenster, eine unter den Karton. Beide gleich gießen."],
            ["Notieren", "Jeden Tag kurz aufschreiben und zeichnen: Wie hoch? Welche Farbe?"],
          ].map(([h, t]) => later(ex(s, h, { style: { padding: "12px 16px" } }, s.h("p", { class: "t", style: { fontSize: "21px" } }, t))));
          const bonus = later(s.h("div", { class: "merk", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Bonus: Mach auch den ", b(s, "Wäsche-Test"), " mit drei gleich nassen Waschlappen. Und am Ende darfst du die grüne Kresse aufs Brot legen!"));
          s.add(root(s, "stack", { justifyContent: "space-between" }, svg, s.h("div", { class: "cols3", style: { gap: "16px" } }, ...steps), bonus));
          s.sfx.whoosh();
          s.step(async () => { for (let i = 0; i < 4; i++) { s.sfx.count(i * 2); s.show(marks[i], "up"); await s.wait(300); } s.say("Nach ein bis zwei Tagen keimen die Samen. Nach etwa einer Woche kannst du vergleichen."); });
          s.step(async () => { for (let i = 0; i < 3; i++) { s.sfx.pop(); s.show(steps[i], "up"); await s.wait(220); } });
          s.step(async () => { s.sound("kids-cheer", { vol: .5 }); await s.show(bonus, "zoom"); s.confetti(590, 500, 80); });
        },
      },
    ],
  });
})();
