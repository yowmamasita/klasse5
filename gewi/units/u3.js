/* Kapitel 3 – Jäger und Sammlerinnen (Altsteinzeit). Fakten geprüft 2026-10-04, Quellen im Bericht. */
(() => {
  const C = "#7b4fd6", INK = "#1b2740", PEN = "#5d6678";

  /* ---------- kleine Helfer ---------- */
  const tx = (s, x, y, t, o = {}) => s.el("text", Object.assign({ x, y, "text-anchor": o.a || "middle", "font-size": o.fs || 20, "font-weight": o.fw || 600, fill: o.fill || INK }, o.cls ? { class: o.cls } : {}), t);
  function tl(s, x, y, lines, o = {}) {
    const fs = o.fs || 20;
    const t = s.el("text", Object.assign({ x, y, "text-anchor": o.a || "middle", "font-size": fs, "font-weight": o.fw || 600, fill: o.fill || INK }, o.cls ? { class: o.cls } : {}));
    lines.forEach((L, i) => {
      const sp = s.el("tspan", { x, dy: i ? fs * 1.2 : 0 }, L);
      if (i === 0 && o.bold) sp.setAttribute("font-weight", 800);
      t.append(sp);
    });
    return t;
  }
  const box = (s, cls, label, ...kids) => s.h("div", { class: cls }, label ? s.h("span", { class: "exlabel" }, label) : null, ...kids);
  const P = (s, txt, cls = "small") => s.h("p", { class: cls }, txt);
  const g = (s, attrs, ...k) => s.el("g", attrs || {}, ...k);

  /* ---------- Zeichnungen ---------- */
  function person(s, x, y, o = {}) {
    const h = o.h || 150, col = o.col || "#8a5a3c", w = o.w || 1;
    const r = h * 0.085;
    const gg = g(s, {});
    const neck = y - h + 2 * r, hip = y - h * 0.45;
    gg.append(
      s.el("line", { x1: x - 12 * w, y1: hip, x2: x - 20 * w, y2: y, stroke: col, "stroke-width": 13 * w, "stroke-linecap": "round" }),
      s.el("line", { x1: x + 12 * w, y1: hip, x2: x + 20 * w, y2: y, stroke: col, "stroke-width": 13 * w, "stroke-linecap": "round" }),
      s.el("rect", { x: x - 22 * w, y: neck, width: 44 * w, height: hip - neck + 6, rx: 16 * w, fill: o.cloth || "#a0743f" }),
      s.el("line", { x1: x - 20 * w, y1: neck + 10, x2: x - 36 * w, y2: hip + 4, stroke: col, "stroke-width": 11 * w, "stroke-linecap": "round" }),
      s.el("line", { x1: x + 20 * w, y1: neck + 10, x2: x + 36 * w, y2: hip + 4, stroke: col, "stroke-width": 11 * w, "stroke-linecap": "round" }),
      s.el("circle", { cx: x, cy: y - h + r, r, fill: col }),
    );
    if (o.brow) gg.append(s.el("path", { d: `M${x - r} ${y - h + r * 0.7} q${r} -${r * 0.5} ${2 * r} 0`, stroke: "#3b2416", "stroke-width": 5, fill: "none", "stroke-linecap": "round" }));
    if (o.hair) gg.append(s.el("path", { d: `M${x - r} ${y - h + r} a${r} ${r} 0 0 1 ${2 * r} 0 l0 -${r * 0.2} a${r} ${r * 1.1} 0 0 0 -${2 * r} 0z`, fill: o.hair }));
    if (o.spear) gg.append(s.el("line", { x1: x + 40 * w, y1: y + 2, x2: x + 52 * w, y2: y - h - 20, stroke: "#6b4a2a", "stroke-width": 5, "stroke-linecap": "round" }),
      s.el("path", { d: `M${x + 52 * w} ${y - h - 20} l-7 14 l12 1z`, fill: "#555b66" }));
    if (o.stone) gg.append(s.el("path", { d: `M${x - 44 * w} ${hip - 6} l10 -16 l10 16 l-10 8z`, fill: "#7d8291" }));
    return gg;
  }
  Deck.unit({
    id: "u3", num: 3, title: "Jäger und Sammlerinnen", color: C, soft: "#ece5fb",
    subtitle: "Leben in der Altsteinzeit",
    blurb: "Mammutjagd, Faustkeil, Feuer, Höhlenbilder und die ältesten Flöten.",
    goals: ["Wann die Altsteinzeit war und wer damals lebte", "Wie Jäger und Sammlerinnen ihr Essen fanden", "Wie man einen Faustkeil baut und Feuer macht", "Höhlenbilder, Figuren und die ältesten Flöten"],
    icon(svg, el) {
      svg.append(el("path", { d: "M35 6 L52 34 Q56 54 35 64 Q14 54 18 34 Z", fill: "#7b4fd6", opacity: .85 }),
        el("path", { d: "M35 6 L30 30 L40 44 L35 64 M18 34 L30 30 M52 34 L40 44", stroke: "#fff", "stroke-width": 2.5, fill: "none", opacity: .7 }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Eine riesige Zeitreise",
        say: "Die Altsteinzeit ist die längste Zeit der Menschheit. Sie begann vor etwa 2,6 Millionen Jahren und endete um 10.000 vor Christus.",
        build(s) {
          const intro = s.h("p", { class: "t a-up" }, "Die ", s.h("b", null, "Altsteinzeit"), " (Fachwort: ", s.h("i", null, "Paläolithikum"), ") ist die ", s.h("span", { class: "hl" }, "längste Zeit"), " der Menschheit.");
          const svg = s.svg(1100, 380);
          const L1 = 120, L2 = 292;
          const X1 = y => 60 + 980 * (1 - y / 2600000);
          const X2 = k => 60 + 980 * (320000 - k) / 308000;
          const mark = (x, y, up, lines, o = {}) => {
            const col = o.col || C;
            const gg = g(s, { class: "later" });
            const ly = up ? y - 26 - (lines.length - 1) * 24 : y + 44;
            gg.append(s.el("line", { x1: x, y1: y, x2: x, y2: up ? y - 20 : y + 20, stroke: col, "stroke-width": 3 }),
              s.el("circle", { cx: x, cy: y, r: 10, fill: "#fff", stroke: col, "stroke-width": 5 }),
              tl(s, x, ly, lines, { a: o.a || "middle", bold: true }));
            svg.append(gg); return gg;
          };
          const line1 = s.el("line", { x1: 60, y1: L1, x2: 1040, y2: L1, stroke: C, "stroke-width": 10, "stroke-linecap": "round" });
          svg.append(line1);
          const mStart = mark(60, L1, true, ["Beginn", "vor 2,6 Mio. Jahren"], { a: "start" });
          mStart.classList.remove("later");
          const mFk = mark(X1(1750000), L1, false, ["Faustkeil", "vor 1,75 Mio. J."]);
          const mFe = mark(X1(1000000), L1, true, ["Feuer sicher genutzt", "vor ca. 1 Mio. J."], { col: "#dc3b2a" });
          // Lupe
          const zx = X1(320000);
          const zoom = g(s, { class: "later" },
            s.el("polygon", { points: `${zx},${L1 + 22} 1040,${L1 + 22} 1040,${L2 - 26} 60,${L2 - 26}`, fill: C, opacity: .08 }),
            s.el("rect", { x: zx - 4, y: L1 - 22, width: 1044 - zx, height: 44, rx: 10, fill: "none", stroke: C, "stroke-width": 3, "stroke-dasharray": "8 6" }),
            tl(s, 1040, L1 - 72, ["Lupe: die letzten", "320.000 Jahre"], { a: "end", fill: C }));
          svg.append(zoom);
          const line2 = s.el("line", { x1: 60, y1: L2, x2: 1040, y2: L2, stroke: C, "stroke-width": 10, "stroke-linecap": "round", class: "later" });
          svg.append(line2);
          const mSap = mark(X2(315000), L2, true, ["Homo sapiens", "ab 315.000 J."], { a: "start", col: "#1d5bd0" });
          const mNea = mark(X2(230000), L2, false, ["Neandertaler", "ab 230.000 J."], { col: "#138a5a" });
          const mAfr = mark(X2(70000), L2, true, ["Aufbruch aus Afrika", "ab 70.000 J."], { a: "end", col: "#1d5bd0" });
          const mArt = mark(X2(40000), L2, false, ["Kunst & Flöten", "40.000 J."], { col: "#ee7a1a" });
          const mEnd = mark(1040, L2, true, ["Ende", "ca. 10.000 v. Chr."], { a: "end" });
          const merk = s.h("div", { class: "merk later" }, "Die Altsteinzeit dauerte von vor ca. ", s.h("b", null, "2,6 Mio. Jahren"), " bis ca. ", s.h("b", null, "10.000 v. Chr."), " Das ist über 99 % der Zeit, seit es Steinwerkzeuge gibt!");
          s.add(s.h("div", { class: "stack", style: { gap: "10px" } }, intro, svg, merk));
          s.show(line1, "draw"); s.sfx.whoosh();
          s.step(async () => { s.sfx.pop(); s.show(mFk, "pop"); await s.wait(300); s.sfx.zap(); await s.show(mFe, "pop"); s.say("Vor 1,75 Millionen Jahren gab es schon Faustkeile. Feuer nutzten Menschen sicher seit etwa einer Million Jahren."); });
          s.step(async () => { s.sfx.swoosh(); await s.show(zoom, "fade"); s.show(line2, "draw"); await s.wait(500); s.sfx.pop(); s.show(mSap, "pop"); await s.wait(250); s.sfx.pop(); await s.show(mNea, "pop"); s.say("Mit der Lupe sehen wir die letzten 320.000 Jahre: Homo sapiens und Neandertaler."); });
          s.step(async () => { s.sfx.count(2); s.show(mAfr, "pop"); await s.wait(250); s.sfx.count(4); s.show(mArt, "pop"); await s.wait(250); s.sfx.count(6); await s.show(mEnd, "pop"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.say("Über 99 Prozent der Zeit seit den ersten Steinwerkzeugen war Altsteinzeit."); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Drei Menschenarten",
        say: "In der Altsteinzeit lebten verschiedene Menschenarten: Homo erectus, der Neandertaler und Homo sapiens. Homo sapiens, das sind wir.",
        build(s) {
          const data = [
            { n: "Homo erectus", c: "#ee7a1a", ph: () => s.photo("schaedel-erectus", { w: "100%", h: 190, pos: "50% 45%", caption: "Schädel (Abguss)" }), lines: ["vor ca. 2 Mio. bis gut 100.000 Jahren", "Gilt als erste Menschenart außerhalb Afrikas: Funde in Dmanisi (Georgien), 1,85 Mio. Jahre alt."] },
            { n: "Neandertaler", c: "#138a5a", ph: () => s.photo("schaedel-neandertaler", { w: "100%", h: 190, fit: "contain", caption: "Schädel" }), lines: ["vor ca. 230.000 bis 40.000 Jahren", "Lebte in Europa und Westasien. Benannt nach dem Neandertal bei Düsseldorf."] },
            { n: "Homo sapiens", c: "#1d5bd0", ph: () => s.photo("schaedel-sapiens", { w: "100%", h: 190, fit: "contain", caption: "Schädel aus Marokko" }), lines: ["seit über 300.000 Jahren", "Älteste Funde: Marokko, 315.000 Jahre. Das sind wir – auch du!"] },
          ];
          const cards = data.map(d => {
            return s.h("div", { class: "card later", style: { borderColor: d.c, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "14px 18px" } },
              d.ph(), s.h("p", { class: "h2", style: { color: d.c } }, d.n),
              s.h("p", { class: "small", style: { fontWeight: 700 } }, d.lines[0]),
              s.h("p", { class: "small", style: { textAlign: "center" } }, d.lines[1]));
          });
          const life = box(s, "life later", "Bis heute in dir", P(s, "Neandertaler und Homo sapiens haben sich getroffen und gemeinsame Kinder bekommen. Spuren davon stecken noch heute in unseren Genen!", "t"));
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center" } }, s.h("div", { class: "cols3" }, cards), life));
          s.show(cards[0], "up"); s.sfx.pop();
          s.step(async () => { s.sfx.pop(); await s.show(cards[1], "up"); s.say("Der Neandertaler lebte in Europa. Er ist nach dem Neandertal bei Düsseldorf benannt."); });
          s.step(async () => { s.sfx.pop(); await s.show(cards[2], "up"); s.say("Homo sapiens gibt es seit über 300.000 Jahren. Das sind wir."); });
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Raus aus Afrika",
        say: "Die Menschen kommen ursprünglich aus Afrika. Von dort aus haben sie sich langsam über die ganze Welt verbreitet.",
        build(s) {
          const W = 660, H = 520;
          const p = (lon, lat) => [(lon + 20) * 3.667, (72 - lat) * 4.56];
          const poly = pts => pts.map(([a, b]) => p(a, b).map(v => v.toFixed(1)).join(",")).join(" ");
          const svg = s.svg(W, H);
          const land = "#efe2c4", edge = "#c9b48a";
          svg.append(s.el("rect", { x: 0, y: 0, width: W, height: H, rx: 18, fill: "#dcecf6" }));
          const africa = [[-17, 15], [-16, 24], [-10, 30], [-5, 36], [10, 37], [20, 32], [32, 31], [34, 28], [43, 12], [51, 12], [40, -2], [40, -15], [35, -25], [20, -35], [18, -30], [12, -15], [9, 0], [-8, 5], [-17, 15]];
          const europe = [[-10, 36], [-9, 43], [-2, 44], [-5, 48], [0, 50], [5, 53], [8, 57], [5, 62], [15, 69], [30, 70], [40, 66], [45, 55], [40, 45], [28, 41], [26, 38], [20, 40], [15, 38], [12, 44], [8, 44], [3, 42], [-10, 36]];
          const asia = [[28, 41], [36, 36], [35, 32], [34, 28], [43, 13], [52, 17], [56, 22], [60, 25], [67, 24], [73, 20], [77, 8], [80, 15], [88, 22], [92, 22], [98, 16], [100, 5], [104, 1], [108, 10], [110, 20], [122, 30], [122, 40], [130, 43], [140, 50], [142, 60], [155, 62], [158, 70], [70, 70], [60, 68], [45, 55], [40, 45], [28, 41]];
          const austr = [[114, -22], [122, -17], [131, -12], [137, -12], [142, -11], [146, -19], [153, -27], [150, -37], [141, -38], [135, -35], [129, -32], [115, -34], [114, -22]];
          [africa, europe, asia, austr].forEach(a => svg.append(s.el("polygon", { points: poly(a), fill: land, stroke: edge, "stroke-width": 2, "stroke-linejoin": "round" })));
          [["Afrika", 18, 2], ["Europa", 15, 54], ["Asien", 95, 52], ["Australien", 134, -27]].forEach(([n, a, b]) => { const [x, y] = p(a, b); svg.append(tx(s, x, y, n, { fs: 24, fw: 800, fill: "#8a7550" })); });
          const path = pts => "M" + pts.map(([a, b]) => p(a, b).map(v => v.toFixed(1)).join(" ")).join(" L");
          const er = s.el("path", { d: path([[36, 0], [40, 20], [44.3, 41.3]]), stroke: "#ee7a1a", "stroke-width": 6, fill: "none", "stroke-dasharray": "2 12", "stroke-linecap": "round", class: "later" });
          const [dx, dy] = p(44.3, 41.3);
          const erDot = g(s, { class: "later" }, s.el("circle", { cx: dx, cy: dy, r: 9, fill: "#ee7a1a" }), tl(s, dx + 16, dy - 6, ["Dmanisi", "1,85 Mio. J."], { a: "start", fill: "#b85a0c" }));
          const routes = [
            [[37, 3], [44, 12], [55, 22], [75, 22], [100, 12], [115, -5], [130, -20]],
            [[37, 3], [34, 28], [35, 36], [28, 42], [15, 48], [2, 47]],
            [[75, 22], [85, 45], [110, 45], [132, 40]],
          ].map(r => s.el("path", { d: path(r), stroke: C, "stroke-width": 7, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round", class: "later" }));
          routes.forEach(r => svg.append(r));
          svg.append(er, erDot);
          const [mx, my] = p(-8.9, 31.9);
          const sapDot = g(s, { class: "later" }, s.el("circle", { cx: mx, cy: my, r: 9, fill: "#1d5bd0" }), tl(s, mx - 2, my + 34, ["Marokko", "315.000 J."], { a: "start", fill: "#1d5bd0" }));
          svg.append(sapDot);
          const walker = s.el("circle", { r: 11, fill: "#fff", stroke: C, "stroke-width": 5, class: "later" });
          svg.append(walker);
          const b1 = box(s, "ex later", "Homo erectus", P(s, "Schon vor ca. 1,85 Mio. Jahren kam er bis nach Georgien (Dmanisi) – als erste Menschenart außerhalb Afrikas."));
          const b2 = box(s, "ex later", "Homo sapiens", P(s, "Die ältesten Funde sind 315.000 Jahre alt (Marokko). Ab ca. 70.000 Jahren breitete er sich über die ganze Welt aus."));
          const b3 = box(s, "life later", "Im Alltag", P(s, "Im Schnitt ging es nur 400 m pro Jahr voran. Das ist eine Runde auf der Laufbahn im Stadion – aber in einem ganzen Jahr!"));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "660px 1fr", height: "100%", alignItems: "center", gap: "24px" } }, svg, s.h("div", { class: "stack" }, b1, b2, b3)));
          s.show(svg, "fade"); s.sfx.whoosh();
          s.step(async () => { s.sfx.swoosh(); s.show(b1, "left"); await s.show(er, "draw"); s.sfx.pop(); await s.show(erDot, "pop"); });
          s.step(async () => {
            s.sfx.pop(); s.show(b2, "left"); await s.show(sapDot, "pop");
            s.sfx.whoosh(); s.show(routes[0], "draw"); s.show(routes[1], "draw", 200); await s.show(routes[2], "draw", 400);
            s.show(walker, "pop");
            const r0 = routes[0]; let L = 1000; try { L = r0.getTotalLength(); } catch (e) {}
            s.loop(t => { try { const q = r0.getPointAtLength(((t * 60) % L)); walker.setAttribute("cx", q.x); walker.setAttribute("cy", q.y); } catch (e) { return false; } });
            s.say("Homo sapiens breitete sich ab etwa 70.000 Jahren über die ganze Welt aus.");
          });
          s.step(async () => { s.sfx.ding(); await s.show(b3, "up"); });
          if (s.fast) { try { const q = routes[0].getPointAtLength(0); walker.setAttribute("cx", q.x); walker.setAttribute("cy", q.y); } catch (e) {} }
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Immer unterwegs",
        say: "Jäger und Sammler waren Nomaden. Sie hatten kein festes Zuhause und zogen dorthin, wo es gerade Essen gab.",
        build(s) {
          const svg = s.svg(500, 500);
          const cx = 250, cy = 250, R = 190;
          const seasons = [
            { n: "Frühling", l: ["Tiere ziehen", "zu neuem Gras"], c: "#9ad47a", a0: -90 },
            { n: "Sommer", l: ["Beeren, Fische", "lange Tage"], c: "#ffd94a", a0: 0 },
            { n: "Herbst", l: ["Nüsse sammeln", "viel jagen"], c: "#f0a35e", a0: 90 },
            { n: "Winter", l: ["Lager an", "sicherem Ort"], c: "#a9c8ee", a0: 180 },
          ];
          const rad = a => a * Math.PI / 180;
          const sec = seasons.map(se => {
            const a1 = rad(se.a0), a2 = rad(se.a0 + 90);
            const d = `M${cx} ${cy} L${cx + R * Math.cos(a1)} ${cy + R * Math.sin(a1)} A${R} ${R} 0 0 1 ${cx + R * Math.cos(a2)} ${cy + R * Math.sin(a2)} Z`;
            const am = rad(se.a0 + 45), tx0 = cx + 122 * Math.cos(am), ty0 = cy + 122 * Math.sin(am);
            const gg = g(s, { opacity: .35 },
              s.el("path", { d, fill: se.c, stroke: "#fff", "stroke-width": 6 }),
              tx(s, tx0, ty0 - 22, se.n, { fs: 26, fw: 800 }),
              tl(s, tx0, ty0 + 6, se.l, { fs: 19, fw: 500 }));
            svg.append(gg); return gg;
          });
          const tent = g(s, {}, s.el("path", { d: "M-22 16 L0 -22 L22 16 Z", fill: "#8a5a3c", stroke: "#fff", "stroke-width": 4 }), s.el("path", { d: "M-6 16 L0 2 L6 16 Z", fill: "#3b2416" }));
          svg.append(s.el("circle", { cx, cy, r: R + 24, fill: "none", stroke: C, "stroke-width": 3, "stroke-dasharray": "6 10" }), tent);
          const place = a => tent.setAttribute("transform", `translate(${cx + (R + 24) * Math.cos(rad(a))} ${cy + (R + 24) * Math.sin(rad(a))})`);
          let ang = -45; place(ang);
          const moveTo = async target => { s.sfx.whoosh(); const from = ang; await s.tween({ from, to: target, dur: 900, update: v => { ang = v; place(v); } }); };
          const light = i => { sec.forEach((x, j) => x.setAttribute("opacity", j === i ? 1 : .35)); s.sfx.count(i * 2); };
          light(0);
          const right = s.h("div", { class: "stack" },
            s.h("p", { class: "big a-up" }, "Nomaden"),
            P(s, "… sind Menschen ohne festen Wohnort. Sie ziehen dem Essen hinterher – mit den Jahreszeiten.", "t"),
            box(s, "ex later", "Die Gruppe", P(s, "Meist lebten kleine Gruppen von etwa 30 bis 50 Menschen zusammen.")),
            box(s, "ex later", "Das Gepäck", P(s, "Alles musste tragbar sein: Werkzeuge, Felle, Speere. Ein Schrank? Keine Chance!")),
            box(s, "life later", "Im Alltag", P(s, "Wie beim Camping: Zelt auf, Zelt ab, weiterziehen – nur eben das ganze Jahr.")));
          const [, , e1, e2, e3] = right.children;
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "500px 1fr", height: "100%", alignItems: "center" } }, svg, right));
          s.show(svg, "zoom"); s.sfx.whoosh();
          s.step(async () => { light(1); s.show(e1, "left"); await moveTo(45); });
          s.step(async () => { light(2); s.show(e2, "left"); await moveTo(135); });
          s.step(async () => { light(3); await moveTo(225); s.say("Im Winter suchte die Gruppe einen geschützten Lagerplatz."); });
          s.step(async () => { sec.forEach(x => x.setAttribute("opacity", 1)); s.sfx.ding(); await s.show(e3, "up"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Jagd auf große Tiere",
        say: "Die Jäger jagten große Tiere wie Mammuts, Rentiere und Wildpferde. Von den Tieren wurde fast alles genutzt.",
        build(s) {
          const data = [
            { n: "Mammut", ph: () => s.photo("mammut-skelett", { w: "100%", h: 180, pos: "40% 50%", caption: "Mammut-Skelett im Museum" }), t: "2,8 bis 3,75 m hoch – höher als ein Basketballkorb (3,05 m)! Gewicht: 5 bis 6 Tonnen." },
            { n: "Rentier", ph: () => s.photo("rentier", { w: "100%", h: 180, pos: "40% 50%", caption: "Rentier in der Tundra" }), t: "In Stellmoor bei Hamburg fand man Reste von 650 Rentieren – aus der Zeit um 10.000 v. Chr." },
            { n: "Wildpferd", ph: () => s.photo("wildpferd", { w: "100%", h: 180, pos: "50% 45%", caption: "Przewalski-Pferde bei Berlin" }), t: "Oft an Höhlenwände gemalt, zum Beispiel in den Höhlen Chauvet und Lascaux in Frankreich." },
          ];
          const cards = data.map(d => {
            return s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "12px 18px" } }, d.ph(), s.h("p", { class: "h2", style: { color: C } }, d.n), s.h("p", { class: "small", style: { textAlign: "center" } }, d.t));
          });
          const uses = [["Fleisch", "Essen"], ["Fell", "Kleidung, Zelte"], ["Knochen", "Nadeln, Flöten"], ["Elfenbein", "Figuren"], ["Geweih", "Harpunen"]];
          const chips = uses.map(([a, b]) => s.h("span", { class: "chip later", style: { fontSize: "19px" } }, s.h("b", null, a), " → ", b));
          const merk = s.h("div", { class: "merk later", style: { padding: "12px 18px" } }, s.h("p", { class: "small", style: { fontSize: "22px", marginBottom: "8px" } }, "Nichts wurde verschwendet:"), s.h("div", { class: "row", style: { gap: "10px" } }, chips));
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center" } }, s.h("div", { class: "cols3" }, cards), merk));
          s.show(cards[0], "left"); s.sound("elefant", { vol: .5 });
          s.say("Hörst du das? Ein Elefant – ein Verwandter des Mammuts.");
          s.step(async () => { s.sfx.drum(); await s.show(cards[1], "left"); s.say("Bei Stellmoor in der Nähe von Hamburg fand man Reste von 650 Rentieren."); });
          s.step(async () => { s.sound("pferd-wiehern", { vol: .6 }); await s.show(cards[2], "left"); s.say("Przewalski-Pferde leben heute wieder in der Döberitzer Heide bei Berlin."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); for (let i = 0; i < chips.length; i++) { s.sfx.count(i); s.show(chips[i], "pop"); await s.wait(160); } });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Sammeln: Beeren, Nüsse, Wurzeln",
        say: "Sammeln war genauso wichtig wie Jagen. Beeren, Nüsse, Pilze, Wurzeln und Eier lieferten Essen, das nicht weglaufen konnte.",
        build(s) {
          const po = cap => ({ w: 284, h: 244, caption: cap, cls: "later" });
          const pB = s.photo("brombeeren", Object.assign(po("Brombeeren"), { pos: "50% 40%" })), pN = s.photo("haselnuesse", po("Haselnüsse"));
          const pP = s.photo("steinpilz", po("Pilze (Steinpilz)")), pE = s.photo("vogelnest", po("Vogeleier"));
          const svg = s.h("div", { style: { display: "grid", gridTemplateColumns: "284px 284px", gap: "12px" } }, pB, pN, pP, pE);
          const right = s.h("div", { class: "stack" },
            P(s, "Sammeln war genauso wichtig wie Jagen. Und Pflanzen laufen nicht weg!", "t"),
            box(s, "ex later", "Warm oder kalt?", P(s, "In warmen Gegenden aßen Sammler etwa halb Pflanzen, halb Fleisch. In kalten Gegenden viel mehr Fleisch – dort wachsen weniger Pflanzen.")),
            box(s, "life later", "Im Alltag", P(s, "Brombeeren im Park, Haselnüsse im Herbst – das ist Sammeln wie früher. Aber: Nur essen, was du sicher kennst! Manche Beeren und Pilze sind giftig.")));
          const [, ex1, life] = right.children;
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "580px 1fr", height: "100%", alignItems: "center", gap: "26px" } }, svg, right));
          s.sound("birds", { vol: .35, dur: 4 });
          s.step(async () => { s.sfx.pop(); await s.show(pB, "zoom"); s.sfx.pop(); await s.show(pN, "zoom"); });
          s.step(async () => { s.sfx.pop(); await s.show(pP, "zoom"); s.sound("birds", { vol: .4, dur: 3 }); await s.show(pE, "zoom"); s.say("Auch Pilze, Wurzeln, Knollen und Vogeleier wurden gesammelt."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(ex1, "left"); });
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Wer jagte, wer sammelte?",
        say: "Früher dachte man: Männer jagen, Frauen sammeln. Heute weiß man: So einfach war es nicht.",
        build(s) {
          const stamp = s.h("span", { class: "later", style: { display: "inline-block", border: "4px solid var(--red)", color: "var(--red)", borderRadius: "10px", padding: "4px 14px", font: "800 26px/1.1 var(--f-display)", transform: "rotate(-6deg)" } }, "Zu einfach!");
          const top = s.h("div", { class: "card soft", style: { display: "flex", alignItems: "center", gap: "24px", padding: "14px 22px" } },
            s.h("p", { class: "t" }, s.h("b", null, "Das alte Bild: "), "„Männer jagen – Frauen sammeln.“"), stamp);
          const ev = [
            ["Ein Grab in Peru", "In den Anden fand man das Grab einer jungen Frau (17–19 Jahre) – mit Speerspitzen und Werkzeugen zum Zerlegen von Tieren. Eine Jägerin? (Studie 2020)"],
            ["Viele Gruppen verglichen", "Eine Studie von 2023 fand: In 79 % der untersuchten Gruppen jagten auch Frauen. Andere Forscher kritisieren aber, wie gezählt wurde."],
            ["Je nach Lage", "Witwen konnten Jägerinnen werden. Und wo es fast nur Pflanzen gab, sammelten auch die Männer."],
          ].map(([a, b], i) => box(s, "ex later", "Hinweis " + (i + 1) + ": " + a, P(s, b)));
          const merk = s.h("div", { class: "merk later" }, "Die Aufgaben waren ", s.h("b", null, "nicht streng"), " nach Mann und Frau verteilt. Forscher streiten noch darüber – so funktioniert Wissenschaft: Beweise sammeln und prüfen.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center" } }, top, s.h("div", { class: "cols3" }, ev), merk));
          s.step(async () => { s.sfx.drum(); await s.show(stamp, "zoom"); s.say("Das ist zu einfach gedacht."); });
          s.step(async () => { s.sfx.pop(); await s.show(ev[0], "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(ev[1], "up"); s.say("Über diese Studie streiten die Forscher noch."); });
          s.step(async () => { s.sfx.pop(); await s.show(ev[2], "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Ein Faustkeil entsteht",
        say: "Mit einem Schlagstein schlägt man Stück für Stück vom Stein ab. So entsteht ein Faustkeil.",
        build(s) {
          const svg = s.svg(520, 450);
          const N = 16, cx = 250, cy = 238;
          const knolle = [], axe = [];
          for (let i = 0; i < N; i++) {
            const t = 2 * Math.PI * i / N, b = 1 + 0.07 * Math.sin(3 * t + 1) + 0.05 * Math.cos(5 * t);
            knolle.push([cx + 150 * Math.sin(t) * b, cy - 160 * Math.cos(t) * b]);
            axe.push([cx + 122 * Math.sin(t) * Math.pow((1 - Math.cos(t)) / 2, 0.35), cy - (Math.cos(t) > 0 ? 190 : 165) * Math.cos(t)]);
          }
          let pts = knolle.map(q => q.slice());
          svg.append(s.el("ellipse", { cx, cy: 425, rx: 170, ry: 14, fill: "#000", opacity: .08 }));
          const stone = s.el("path", { fill: "#8d93a3", stroke: "#4e5566", "stroke-width": 4, "stroke-linejoin": "round" });
          const facets = g(s, { opacity: 0 });
          const scars = g(s, {});
          svg.append(stone, scars, facets);
          const draw = () => stone.setAttribute("d", "M" + pts.map(q => q[0].toFixed(1) + " " + q[1].toFixed(1)).join(" L") + " Z");
          draw();
          facets.append(s.el("path", { d: `M${axe[0][0]} ${axe[0][1] + 6} Q${cx - 14} ${cy} ${axe[8][0]} ${axe[8][1] - 8}`, stroke: "#e4e7ee", "stroke-width": 3, fill: "none" }), s.el("path", { d: `M${axe[3][0] - 6} ${axe[3][1]} Q${cx} ${cy - 20} ${axe[13][0] + 6} ${axe[13][1]}`, stroke: "#e4e7ee", "stroke-width": 2, fill: "none" }));
          const hammer = s.el("ellipse", { rx: 34, ry: 24, fill: "#b7a58a", stroke: "#6e5f48", "stroke-width": 4, opacity: 0 });
          svg.append(hammer);
          const lbl = tx(s, 260, 30, "Feuersteinknolle", { fs: 26, fw: 800, fill: C });
          svg.append(lbl);
          const order = [[0, 1], [8, 9], [4, 5], [12, 13], [2, 3], [10, 11], [6, 7], [14, 15]];
          let hits = 0, busy = false;
          async function hit() {
            if (hits >= order.length) return;
            const idx = order[hits++];
            const [i0, i1] = idx; const mx = (pts[i0][0] + pts[i1][0]) / 2, my = (pts[i0][1] + pts[i1][1]) / 2;
            let nx = mx - cx, ny = my - cy; const nl = Math.hypot(nx, ny) || 1; nx /= nl; ny /= nl;
            hammer.setAttribute("opacity", 1);
            await s.tween({ from: 1, to: 0, dur: 260, ease: "in", update: v => { hammer.setAttribute("cx", mx + nx * (40 + 110 * v)); hammer.setAttribute("cy", my + ny * (40 + 110 * v)); } });
            s.sound("stein-schlag", { vol: .9 }); s.sfx.snap();
            const flake = s.el("polygon", { points: `${mx - 14},${my - 8} ${mx + 16},${my - 4} ${mx + 6},${my + 12}`, fill: "#a7adbb", stroke: "#4e5566", "stroke-width": 2 });
            svg.append(flake);
            const start = idx.map(i => pts[i].slice());
            s.tween({ from: 0, to: 1, dur: 520, ease: "out", update: v => { flake.setAttribute("transform", `translate(${nx * 150 * v} ${ny * 150 * v + 60 * v * v}) rotate(${300 * v} ${mx} ${my})`); flake.setAttribute("opacity", 1 - v); } }).then(() => flake.remove());
            scars.append(s.el("path", { d: `M${(axe[i0][0] * 0.8 + cx * 0.2).toFixed(1)} ${(axe[i0][1] * 0.8 + cy * 0.2).toFixed(1)} Q${(mx * 0.7 + cx * 0.3).toFixed(1)} ${(my * 0.7 + cy * 0.3).toFixed(1)} ${(axe[i1][0] * 0.8 + cx * 0.2).toFixed(1)} ${(axe[i1][1] * 0.8 + cy * 0.2).toFixed(1)}`, stroke: "#c9cdd8", "stroke-width": 3, fill: "none" }));
            await s.tween({ from: 0, to: 1, dur: 220, update: v => { idx.forEach((i, k) => { pts[i][0] = s.lerp(start[k][0], axe[i][0], v); pts[i][1] = s.lerp(start[k][1], axe[i][1], v); }); draw(); } });
            await s.tween({ from: 0, to: 1, dur: 200, update: v => { hammer.setAttribute("cx", mx + nx * (40 + 60 * v)); hammer.setAttribute("cy", my + ny * (40 + 60 * v)); } });
            hammer.setAttribute("opacity", 0);
          }
          async function finish() { lbl.textContent = "Faustkeil!"; s.sfx.success(); await s.tween({ from: 0, to: .8, dur: 500, update: v => facets.setAttribute("opacity", v) }); }
          const again = s.h("button", { class: "btn later", onclick: async () => {
            if (busy) return; busy = true; s.sfx.click();
            hits = 0; pts = knolle.map(q => q.slice()); draw(); scars.innerHTML = ""; facets.setAttribute("opacity", 0); lbl.textContent = "Feuersteinknolle";
            for (let i = 0; i < order.length; i++) { if (!s.alive) return; await hit(); }
            await finish(); busy = false;
          } }, "Nochmal schlagen");
          const left = s.h("div", { class: "stack", style: { alignItems: "center", gap: "8px" } }, svg, again);
          const right = s.h("div", { class: "stack" },
            box(s, "ex later", "So geht's", P(s, "Mit einem harten Schlagstein schlägt man Stücke vom Stein ab. Feuerstein bricht muschelig wie Glas – die Kanten werden sehr scharf.")),
            box(s, "ex later", "Uralt", P(s, "Die ältesten Faustkeile sind ca. 1,75 Mio. Jahre alt (Afrika). Rund 1,5 Mio. Jahre lang baute man sie fast gleich!")),
            box(s, "life later", "Im Alltag", P(s, "Ein Faustkeil war Messer und Schaber in einem – ein Allzweck-Werkzeug wie dein Taschenmesser.")));
          const [r1, r2, r3] = right.children;
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "520px 1fr", height: "100%", alignItems: "center", gap: "30px" } }, left, right));
          s.show(svg, "zoom"); s.sfx.pop();
          s.step(async () => { s.show(r1, "left"); busy = true; for (let i = 0; i < 4; i++) await hit(); busy = false; s.say("Schlag für Schlag fliegen Abschläge weg."); });
          s.step(async () => { busy = true; for (let i = 0; i < 4; i++) await hit(); await finish(); busy = false; s.show(again, "pop"); });
          s.step(async () => { s.sfx.pop(); await s.show(r2, "left"); });
          s.step(async () => { s.sfx.ding(); await s.show(r3, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Schlaue Werkzeuge",
        say: "Die Menschen erfanden immer bessere Werkzeuge: Speere, Speerschleudern, Harpunen und Nähnadeln aus Knochen.",
        build(s) {
          const svg = s.svg(600, 450);
          svg.append(s.el("rect", { x: 0, y: 0, width: 600, height: 450, rx: 18, fill: "#f3effc" }));
          const groups = [g(s, {}), g(s, {}), g(s, {}), g(s, {})];
          groups.forEach(x => { x.style.display = "none"; svg.append(x); });
          const spear = (len = 130) => g(s, {}, s.el("line", { x1: -len / 2, y1: 0, x2: len / 2, y2: 0, stroke: "#7a5230", "stroke-width": 6, "stroke-linecap": "round" }), s.el("path", { d: `M${len / 2 + 14} 0 L${len / 2 - 4} -7 L${len / 2 - 4} 7 Z`, fill: "#555b66" }));
          // 0 Speer
          const g0 = groups[0];
          g0.append(s.el("line", { x1: 20, y1: 380, x2: 580, y2: 380, stroke: "#7cb35a", "stroke-width": 8 }), person(s, 80, 378, { h: 140, col: "#8a5a3c" }), tx(s, 300, 50, "Speer: 1,8 bis 2,5 m lang", { fs: 24, fw: 800, fill: C }));
          const sp0 = spear(150); g0.append(sp0);
          // 1 Speerschleuder
          const g1 = groups[1];
          g1.append(tx(s, 30, 60, "nur mit der Hand", { a: "start", fs: 22, fw: 800 }), tx(s, 30, 250, "mit Speerschleuder", { a: "start", fs: 22, fw: 800, fill: C }),
            s.el("line", { x1: 20, y1: 190, x2: 580, y2: 190, stroke: "#c8d3de", "stroke-width": 4 }), s.el("line", { x1: 20, y1: 400, x2: 580, y2: 400, stroke: "#c8d3de", "stroke-width": 4 }),
            s.el("line", { x1: 40, y1: 150, x2: 70, y2: 120, stroke: "#8a5a3c", "stroke-width": 10, "stroke-linecap": "round" }),
            s.el("line", { x1: 40, y1: 360, x2: 70, y2: 330, stroke: "#8a5a3c", "stroke-width": 10, "stroke-linecap": "round" }),
            s.el("line", { x1: 70, y1: 330, x2: 110, y2: 300, stroke: C, "stroke-width": 8, "stroke-linecap": "round" }));
          const spA = spear(110), spB = spear(110); g1.append(spA, spB);
          const flagA = g(s, {}, s.el("line", { x1: 260, y1: 190, x2: 260, y2: 160, stroke: PEN, "stroke-width": 3 }), tx(s, 260, 150, "1 ×", { fs: 22, fw: 800 }));
          const flagB = g(s, {}, s.el("line", { x1: 540, y1: 400, x2: 540, y2: 370, stroke: C, "stroke-width": 3 }), tx(s, 520, 360, "über 2 ×", { fs: 22, fw: 800, fill: C }));
          g1.append(flagA, flagB);
          // 2 Harpune
          const g2 = groups[2];
          g2.append(s.el("rect", { x: 0, y: 230, width: 600, height: 220, rx: 18, fill: "#7fb6dc" }), s.el("path", { d: "M0 230 Q75 215 150 230 T300 230 T450 230 T600 230", stroke: "#fff", "stroke-width": 4, fill: "none" }));
          const fish = g(s, {}, s.el("ellipse", { cx: 0, cy: 0, rx: 46, ry: 20, fill: "#e0913f" }), s.el("path", { d: "M40 0 L72 -18 L72 18 Z", fill: "#e0913f" }), s.el("circle", { cx: -28, cy: -4, r: 4, fill: "#1b1b1b" }));
          g2.append(fish);
          const harp = g(s, {}, s.el("line", { x1: 0, y1: -200, x2: 0, y2: 0, stroke: "#7a5230", "stroke-width": 7, "stroke-linecap": "round" }),
            s.el("path", { d: "M0 0 L0 50 M0 50 L-9 38 M0 50 L9 38 M0 32 L-12 20 M0 32 L12 20 M0 14 L-12 4 M0 14 L12 4", stroke: "#efe3c8", "stroke-width": 6, fill: "none", "stroke-linecap": "round" }));
          g2.append(harp, tx(s, 300, 50, "Harpune mit Widerhaken", { fs: 24, fw: 800, fill: C }));
          // 3 Nähnadel
          const g3 = groups[3];
          g3.append(s.el("rect", { x: 60, y: 150, width: 230, height: 200, rx: 30, fill: "#9a6a42" }), s.el("rect", { x: 310, y: 150, width: 230, height: 200, rx: 30, fill: "#8a5a36" }), tx(s, 300, 60, "Nadel aus Knochen, mit Öhr", { fs: 24, fw: 800, fill: C }));
          const thread = s.el("path", { d: "M300 120 L270 170 L330 200 L270 230 L330 260 L270 290 L330 320 L300 360", stroke: "#f6e7b0", "stroke-width": 5, fill: "none", "stroke-linecap": "round", class: "later" });
          const needle = g(s, {}, s.el("path", { d: "M0 -60 L5 40 L0 60 L-5 40 Z", fill: "#efe3c8", stroke: "#b9a77f", "stroke-width": 2 }), s.el("ellipse", { cx: 0, cy: -46, rx: 2.5, ry: 6, fill: "#9a6a42" }));
          g3.append(thread, needle);
          const facts = [
            ["Speer", "Die Schöninger Speere (Niedersachsen) sind ca. 300.000 Jahre alt, meist aus Fichtenholz – die ältesten vollständig erhaltenen Jagdwaffen der Welt!"],
            ["Speerschleuder", "Ein Hebel: Er macht den Wurfarm etwa doppelt so lang. Der Speer fliegt über 150 km/h schnell und mehr als doppelt so weit. Ältester Fund: Frankreich, ca. 18.000–16.000 v. Chr."],
            ["Harpune", "Die Widerhaken halten den Fisch fest. Gebaut aus Knochen oder Rentiergeweih. Die ältesten (Kongo) sind vielleicht 90.000 Jahre alt – das ist noch umstritten."],
            ["Nähnadel", "Knochennadeln mit Öhr: Die älteste ist mindestens 43.000 Jahre alt (Altai, Russland). Auch in Deutschland fand man welche, z. B. im Petersfels (Hegau)."],
          ];
          const fT = s.h("p", { class: "h2", style: { color: C } }), fB = s.h("p", { class: "small" });
          const card = s.h("div", { class: "card", style: { height: "250px", display: "flex", flexDirection: "column", gap: "10px" } }, fT, fB);
          const btns = facts.map((f, i) => s.h("button", { class: "btn", style: { width: "100%" }, onclick: () => { s.sfx.click(); play(i); } }, f[0]));
          let token = 0;
          async function play(i) {
            const my = ++token;
            groups.forEach((x, j) => (x.style.display = j === i ? "" : "none"));
            btns.forEach((b, j) => b.classList.toggle("solid", j === i));
            fT.textContent = facts[i][0]; fB.textContent = facts[i][1];
            s.show(card, "fade");
            if (i === 0) {
              s.sfx.whoosh();
              await s.tween({ from: 0, to: 1, dur: 1100, ease: "linear", update: t => { if (my !== token) return; const x = 140 + 380 * t, y = s.lerp(250, 360, t) - 240 * t * (1 - t); const a = Math.atan2(110 - 480 * t, 380) * 180 / Math.PI; sp0.setAttribute("transform", `translate(${x} ${y}) rotate(${a})`); } });
              if (my === token) s.sfx.snap();
            } else if (i === 1) {
              s.sfx.whoosh();
              const fly = (el, x0, y0, x1, y1, h, t) => { const x = s.lerp(x0, x1, t), y = s.lerp(y0, y1, t) - h * 4 * t * (1 - t); const a = Math.atan2((y1 - y0) - h * 4 * (1 - 2 * t), x1 - x0) * 180 / Math.PI; el.setAttribute("transform", `translate(${x} ${y}) rotate(${a})`); };
              flagA.setAttribute("opacity", 0); flagB.setAttribute("opacity", 0);
              await s.tween({ from: 0, to: 1, dur: 1300, ease: "linear", update: t => { if (my !== token) return; fly(spA, 90, 120, 240, 180, 50, Math.min(1, t * 1.9)); fly(spB, 130, 300, 520, 390, 90, t); } });
              if (my === token) { flagA.setAttribute("opacity", 1); flagB.setAttribute("opacity", 1); s.sfx.ding(); }
            } else if (i === 2) {
              s.loop(t => { if (my !== token) return false; fish.setAttribute("transform", `translate(${300 + 60 * Math.sin(t * 1.5)} 330)`); });
              s.sfx.swoosh();
              await s.tween({ from: 0, to: 1, dur: 900, ease: "in", update: t => { if (my !== token) return; harp.setAttribute("transform", `translate(300 ${s.lerp(60, 280, t)})`); } });
              if (my === token) s.sfx.snap();
            } else {
              s.hide(thread); s.sfx.scribble();
              s.show(thread, "draw");
              let L = 400; try { L = thread.getTotalLength(); } catch (e) {}
              await s.tween({ from: 0, to: 1, dur: 1000, ease: "linear", update: t => { if (my !== token) return; try { const q = thread.getPointAtLength(L * t); needle.setAttribute("transform", `translate(${q.x} ${q.y - 50})`); } catch (e) {} } });
            }
          }
          fish.setAttribute("transform", "translate(300 330)"); harp.setAttribute("transform", "translate(300 280)");
          sp0.setAttribute("transform", "translate(520 360)"); needle.setAttribute("transform", "translate(300 310)");
          spA.setAttribute("transform", "translate(240 180)"); spB.setAttribute("transform", "translate(520 390)");
          const life = box(s, "life later", "Im Alltag", P(s, "Speerwurf ist heute eine Sportart. Und deine Nähnadel aus Metall hat fast dieselbe Form wie die aus Knochen!"));
          const right = s.h("div", { class: "stack" }, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } }, btns), card, life);
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "600px 1fr", height: "100%", alignItems: "center", gap: "26px" } }, svg, right));
          play(0);
          s.step(async () => { await play(1); s.say("Die Speerschleuder wirkt wie ein Hebel. Der Speer fliegt viel weiter."); });
          s.step(async () => { await play(2); });
          s.step(async () => { await play(3); });
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 9b --------------------------------------------------------------- */
      {
        title: "Echte Werkzeuge im Museum",
        say: "Diese Werkzeuge sind echt. Archäologen haben sie gefunden, heute liegen sie im Museum.",
        build(s) {
          const row1 = [
            s.photo("faustkeil", { w: 354, h: 250, fit: "contain", caption: "Faustkeil, ca. 250.000 Jahre alt" }),
            s.photo("schoeninger-speer", { w: 354, h: 250, fit: "contain", caption: "Schöninger Speer bei der Grabung", cls: "later" }),
            s.photo("knochennadeln", { w: 354, h: 250, caption: "Nähnadeln aus Knochen", cls: "later" }),
          ];
          const row2 = [
            s.photo("speerschleuder", { w: 541, h: 250, caption: "Speerschleudern, 17.000 bis 12.000 Jahre alt", cls: "later" }),
            s.photo("harpunen", { w: 541, h: 250, caption: "Harpunen mit Widerhaken (Frankreich)", cls: "later" }),
          ];
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "18px" } },
            s.h("div", { class: "row", style: { gap: "19px", flexWrap: "nowrap" } }, row1), s.h("div", { class: "row", style: { gap: "18px", flexWrap: "nowrap" } }, row2)));
          s.sound("stein-schlag");
          s.step(async () => { s.sfx.whoosh(); s.show(row1[1], "up"); await s.wait(250); s.sfx.pop(); await s.show(row1[2], "up"); s.say("Der Speer aus Schöningen ist etwa 300.000 Jahre alt."); });
          s.step(async () => { s.sfx.swoosh(); s.show(row2[0], "left"); await s.wait(250); s.sound("splash", { vol: .5 }); await s.show(row2[1], "right"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Feuer!",
        say: "Feuer machte man mit Feuerstein und Pyrit. Die Funken fallen auf Zunderschwamm. Feuer gibt Wärme, Licht und Schutz, und man kann damit kochen.",
        build(s) {
          const W = 480, H = 450;
          const { canvas, g: cx } = s.canvas(W, H);
          let phase = 0, glow = 0, fire = 0, sparks = [], strike = 0;
          const fx = 240, fy = 340;
          function draw(t) {
            cx.clearRect(0, 0, W, H);
            const sky = cx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, fire > .5 ? "#2a2440" : "#3a3458"); sky.addColorStop(1, "#5a4a6a");
            cx.fillStyle = sky; cx.beginPath(); cx.roundRect ? cx.roundRect(0, 0, W, H, 18) : cx.rect(0, 0, W, H); cx.fill();
            if (fire > 0) { const rg = cx.createRadialGradient(fx, fy - 40, 10, fx, fy - 40, 260); rg.addColorStop(0, `rgba(255,170,60,${.45 * fire})`); rg.addColorStop(1, "rgba(255,170,60,0)"); cx.fillStyle = rg; cx.fillRect(0, 0, W, H); }
            cx.fillStyle = "#4a3a2c"; cx.beginPath(); cx.ellipse(fx, fy + 40, 200, 40, 0, 0, Math.PI * 2); cx.fill();
            for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2; cx.fillStyle = "#8d93a3"; cx.beginPath(); cx.ellipse(fx + 95 * Math.cos(a), fy + 26 + 22 * Math.sin(a), 20, 13, 0, 0, Math.PI * 2); cx.fill(); }
            if (phase >= 2) { cx.strokeStyle = "#6b4a2a"; cx.lineWidth = 14; cx.lineCap = "round"; [[-60, 40, 0, -40], [60, 40, 0, -40], [-20, 44, 10, -50], [30, 44, -8, -48]].forEach(([a, b, c, d]) => { cx.beginPath(); cx.moveTo(fx + a, fy + b); cx.lineTo(fx + c, fy + d); cx.stroke(); }); }
            cx.fillStyle = "#c9a76a"; cx.beginPath(); cx.ellipse(fx, fy + 22, 46, 18, 0, 0, Math.PI * 2); cx.fill();
            if (glow > 0) { cx.fillStyle = `rgba(255,${120 + 60 * Math.sin(t * 9)},30,${glow})`; cx.beginPath(); cx.ellipse(fx, fy + 18, 22, 9, 0, 0, Math.PI * 2); cx.fill(); }
            if (fire > 0) {
              [["#e2401f", 1], ["#f59a23", .72], ["#ffe08a", .42]].forEach(([col, k]) => {
                cx.fillStyle = col; cx.beginPath(); const hh = 150 * k * fire + 10 * Math.sin(t * 11 + k * 5), ww = 62 * k;
                cx.moveTo(fx - ww, fy + 20); cx.quadraticCurveTo(fx - ww * 1.1, fy - hh * .4, fx + 8 * Math.sin(t * 7 + k), fy - hh); cx.quadraticCurveTo(fx + ww * 1.1, fy - hh * .4, fx + ww, fy + 20); cx.closePath(); cx.fill();
              });
            }
            if (phase < 2) {
              const off = strike > 0 ? 30 * Math.sin(Math.min(1, strike) * Math.PI) : 0;
              cx.fillStyle = "#c9a640"; cx.beginPath(); cx.ellipse(300, 140, 40, 30, .3, 0, Math.PI * 2); cx.fill();
              cx.fillStyle = "#e6c766"; cx.beginPath(); cx.ellipse(292, 130, 12, 8, .3, 0, Math.PI * 2); cx.fill();
              cx.fillStyle = "#5e6372"; cx.beginPath(); cx.moveTo(150 + off, 120); cx.lineTo(230 + off, 135); cx.lineTo(215 + off, 165); cx.lineTo(160 + off, 160); cx.closePath(); cx.fill();
              cx.font = "700 20px Atkinson Hyperlegible, sans-serif"; cx.fillStyle = "#fff"; cx.textAlign = "center";
              cx.fillText("Feuerstein", 180, 205); cx.fillText("Pyrit", 305, 205);
              cx.fillText("Zunderschwamm", fx, fy + 85);
            }
            sparks = sparks.filter(p => p.life > 0);
            for (const p of sparks) { p.x += p.vx; p.y += p.vy; p.vy += .35; p.life -= 1; cx.fillStyle = `rgba(255,${200 + Math.random() * 55},80,${p.life / 40})`; cx.fillRect(p.x, p.y, 4, 4); }
          }
          s.loop((t, dt) => { if (strike > 0) { strike += dt * 4; if (strike > 1) strike = 0; } draw(t); });
          draw(0);
          const burst = () => { for (let i = 0; i < 26; i++) sparks.push({ x: 262, y: 145, vx: (Math.random() - .3) * 4, vy: Math.random() * 2 - 1, life: 30 + Math.random() * 20 }); strike = .01; s.sound("feuerstein-funke"); };
          const uses = ["Wärme", "Licht", "Kochen", "Schutz vor Tieren"].map(u => s.h("span", { class: "chip later", style: { fontSize: "21px", padding: "10px 16px" } }, u));
          const right = s.h("div", { class: "stack" },
            box(s, "ex", "1 · Funken schlagen", P(s, "Feuerstein gegen Pyrit (ein Mineral) schlagen – nicht zwei Feuersteine! Die Funken fallen auf Zunderschwamm, einen getrockneten Pilz.")),
            box(s, "ex later", "2 · Glut wird Flamme", P(s, "Die Glut kommt in trockenes Gras. Vorsichtig pusten, Holz dazu – Feuer!")),
            s.h("div", { class: "row", style: { gap: "10px" } }, uses),
            box(s, "life later", "Seit wann?", P(s, "Die ältesten sicheren Feuerstellen sind ca. 1 Mio. Jahre alt (Wonderwerk-Höhle, Südafrika). Im Alltag: Lagerfeuer, Grill, Kerze – Feuer begleitet uns bis heute.")));
          const [, e2, , life] = right.children;
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "480px 1fr", height: "100%", alignItems: "center", gap: "30px" } }, canvas, right));
          s.step(async () => { for (let i = 0; i < 3; i++) { burst(); await s.wait(500); } phase = 1; s.sfx.whoosh(); await s.tween({ from: 0, to: 1, dur: 700, update: v => (glow = v) }); s.say("Ein Funke trifft den Zunder. Es glüht!"); });
          s.step(async () => { phase = 2; s.show(e2, "left"); s.sound("fire", { vol: .5, dur: 6 }); await s.tween({ from: 0, to: 1, dur: 1200, ease: "out", update: v => (fire = v) }); for (let i = 0; i < uses.length; i++) { s.sfx.count(i + 2); s.show(uses[i], "pop"); await s.wait(180); } });
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); });
          if (s.fast) { phase = 2; glow = 1; fire = 1; }
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Wo wohnten sie?",
        say: "Die Menschen der Altsteinzeit wohnten in Zelten, in Hütten und manchmal in Höhlen.",
        build(s) {
          const mk = (fig, name, text) => s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "12px 18px" } }, fig, s.h("p", { class: "h2", style: { color: C } }, name), P(s, text));
          const c1 = mk(s.photo("steinzeit-zelt", { w: "100%", h: 190, pos: "50% 55%", caption: "Nachbau" }), "Zelt aus Fellen", "Holzstangen, darüber Tierfelle. Schnell auf- und abgebaut – perfekt für Nomaden.");
          const c2 = mk(s.photo("mammutknochen-huette", { w: "100%", h: 190, caption: "Nachbau im Museum" }), "Hütte aus Mammutknochen", "In Meschyritsch (Ukraine) baute man vor ca. 15.000 Jahren Hütten aus Mammutknochen.");
          const c3 = mk(s.photo("vogelherd-hoehle", { w: "100%", h: 190, caption: "Vogelherdhöhle, Schwäbische Alb" }), "Höhle", "Höhlen boten Schutz. Weil Funde dort gut erhalten bleiben, kennen wir viele Höhlen-Lagerplätze.");
          const merk = s.h("div", { class: "merk later" }, "Die Menschen waren keine reinen „Höhlenmenschen“: Sie wohnten auch draußen – in Zelten und Hütten.");
          const life = box(s, "life later", "Im Alltag", P(s, "Ein Zelt beim Camping oder ein Tipi auf dem Spielplatz – fast wie damals!"));
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center" } }, s.h("div", { class: "cols3" }, c1, c2, c3), s.h("div", { class: "cols", style: { gridTemplateColumns: "1.5fr 1fr", gap: "18px" } }, merk, life)));
          s.show(c1, "up"); s.sound("wind", { vol: .35, dur: 3 });
          s.step(async () => { s.sfx.drum(); await s.show(c2, "up"); s.say("In der Ukraine fand man Hütten aus Mammutknochen."); });
          s.step(async () => { s.sound("hoehle-tropfen", { vol: .45, dur: 5 }); await s.show(c3, "up"); });
          s.step(async () => { s.sfx.ding(); s.show(merk, "up"); await s.show(life, "up", 200); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Bilder an der Höhlenwand",
        say: "Zieh die Lampe über die dunkle Höhlenwand. Dort warten Bilder, die viele Tausend Jahre alt sind.",
        build(s) {
          const W = 600, H = 470;
          const { canvas, g: c } = s.canvas(W, H);
          const wall = s.canvas(W, H), w = wall.g;
          // Wand
          const gr = w.createLinearGradient(0, 0, W, H); gr.addColorStop(0, "#b99a78"); gr.addColorStop(1, "#9c7e5e");
          w.fillStyle = gr; w.fillRect(0, 0, W, H);
          let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
          for (let i = 0; i < 420; i++) { w.fillStyle = `rgba(${70 + rnd() * 60},${55 + rnd() * 40},40,${.05 + rnd() * .08})`; w.beginPath(); w.ellipse(rnd() * W, rnd() * H, 6 + rnd() * 30, 4 + rnd() * 16, rnd() * 3, 0, Math.PI * 2); w.fill(); }
          const ochre = "#b4421e", black = "#1f1a17";
          // Pferd (Ocker)
          w.fillStyle = ochre; w.beginPath(); w.ellipse(150, 140, 80, 34, -.08, 0, Math.PI * 2); w.fill();
          w.beginPath(); w.moveTo(205, 120); w.lineTo(245, 70); w.lineTo(268, 80); w.lineTo(232, 150); w.fill();
          w.beginPath(); w.ellipse(262, 78, 28, 13, .5, 0, Math.PI * 2); w.fill();
          w.strokeStyle = ochre; w.lineWidth = 9; w.lineCap = "round";
          [[100, 165, 92, 215], [125, 170, 128, 220], [180, 168, 178, 218], [200, 160, 210, 210]].forEach(([a, b, x, y]) => { w.beginPath(); w.moveTo(a, b); w.lineTo(x, y); w.stroke(); });
          w.strokeStyle = black; w.lineWidth = 7; w.beginPath(); w.moveTo(210, 112); w.lineTo(246, 66); w.stroke();
          // Auerochse (schwarze Umrisse)
          w.strokeStyle = black; w.lineWidth = 7;
          w.beginPath(); w.moveTo(330, 300); w.quadraticCurveTo(360, 230, 450, 245); w.quadraticCurveTo(520, 250, 545, 290); w.quadraticCurveTo(540, 330, 520, 340); w.lineTo(360, 345); w.quadraticCurveTo(320, 340, 330, 300); w.stroke();
          w.beginPath(); w.moveTo(338, 285); w.quadraticCurveTo(300, 250, 320, 220); w.moveTo(350, 270); w.quadraticCurveTo(350, 230, 380, 215); w.stroke();
          [[370, 345, 365, 395], [395, 345, 398, 398], [490, 342, 486, 395], [515, 340, 522, 392]].forEach(([a, b, x, y]) => { w.beginPath(); w.moveTo(a, b); w.lineTo(x, y); w.stroke(); });
          // Löwe
          w.lineWidth = 6; w.beginPath(); w.moveTo(60, 380); w.quadraticCurveTo(90, 320, 170, 330); w.quadraticCurveTo(230, 335, 250, 370); w.moveTo(60, 380); w.quadraticCurveTo(40, 340, 75, 330); w.quadraticCurveTo(95, 335, 100, 350); w.stroke();
          w.beginPath(); w.arc(72, 345, 3, 0, 7); w.fillStyle = black; w.fill();
          w.beginPath(); w.moveTo(85, 352); w.lineTo(90, 420); w.moveTo(120, 352); w.lineTo(118, 420); w.moveTo(200, 345); w.lineTo(205, 420); w.moveTo(235, 360); w.lineTo(240, 420); w.moveTo(60, 380); w.quadraticCurveTo(110, 395, 230, 380); w.moveTo(250, 370); w.quadraticCurveTo(285, 360, 280, 330); w.moveTo(70, 330); w.lineTo(78, 318); w.lineTo(86, 332); w.stroke();
          // Hand-Negativ + Punkte
          w.fillStyle = "rgba(180,66,30,.55)"; w.beginPath(); w.arc(470, 110, 52, 0, Math.PI * 2); w.fill();
          w.fillStyle = "#b99a78"; w.beginPath(); w.ellipse(470, 125, 20, 24, 0, 0, Math.PI * 2); w.fill();
          [[-16, -18, 36], [-6, -24, 44], [5, -24, 46], [15, -20, 40], [24, 0, 30]].forEach(([dx, dy, l], i) => { w.save(); w.translate(470 + dx, 120 + dy); w.rotate(i === 4 ? 1.1 : (dx / 70)); w.fillRect(-5, -l, 10, l); w.restore(); });
          for (let i = 0; i < 7; i++) { w.fillStyle = ochre; w.beginPath(); w.arc(330 + i * 26, 170 + (i % 2) * 14, 7, 0, Math.PI * 2); w.fill(); }
          let lx = 160, ly = 160, all = 0, auto = true;
          const dark = s.canvas(W, H), d = dark.g;
          function render() {
            c.clearRect(0, 0, W, H); c.drawImage(wall.canvas, 0, 0, W, H);
            d.globalCompositeOperation = "source-over"; d.clearRect(0, 0, W, H); d.fillStyle = `rgba(14,10,8,${.95 * (1 - all)})`; d.fillRect(0, 0, W, H);
            d.globalCompositeOperation = "destination-out";
            const rg = d.createRadialGradient(lx, ly, 20, lx, ly, 120); rg.addColorStop(0, "rgba(0,0,0,1)"); rg.addColorStop(1, "rgba(0,0,0,0)");
            d.fillStyle = rg; d.beginPath(); d.arc(lx, ly, 120, 0, Math.PI * 2); d.fill();
            c.drawImage(dark.canvas, 0, 0, W, H);
            if (all < 1) { c.fillStyle = "rgba(255,200,90,.9)"; c.beginPath(); c.arc(lx, ly, 8, 0, Math.PI * 2); c.fill(); }
          }
          render();
          canvas.style.borderRadius = "18px";
          s.drag(canvas, { space: canvas, onStart: p => { auto = false; lx = p.x; ly = p.y; render(); s.sfx.whoosh(); }, onMove: p => { lx = Math.max(0, Math.min(W, p.x)); ly = Math.max(0, Math.min(H, p.y)); render(); } });
          s.loop(t => { if (!auto) return; lx = 300 + 220 * Math.sin(t * .7); ly = 235 + 150 * Math.sin(t * 1.1); render(); });
          const hint = s.h("p", { class: "small", style: { fontWeight: 700, color: C } }, "Zieh mit dem Finger die Lampe über die Wand!");
          const b1 = box(s, "ex later", "Chauvet (Frankreich)", P(s, "Entdeckt 1994. Die Bilder sind ca. 36.000 Jahre alt: Höhlenlöwen, Wollnashörner, Mammuts, Wildpferde."));
          const b2 = box(s, "ex later", "Lascaux (Frankreich)", P(s, "Entdeckt 1940 von vier jungen Leuten. Gemalt um 17.000 v. Chr.: Auerochsen, Pferde, Hirsche. Seit 1963 geschlossen – Besucher sehen einen Nachbau."));
          const cols = box(s, "card later", "Die Farben", P(s, "Rot und Gelb: Eisenoxid (Ocker). Schwarz: Holzkohle und Manganoxid."));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "600px 1fr", height: "100%", alignItems: "center", gap: "24px" } },
            s.h("div", { class: "stack", style: { gap: "8px" } }, hint, canvas), s.h("div", { class: "stack" }, b1, b2, cols)));
          s.sound("hoehle-tropfen", { vol: .4 });
          s.step(async () => { s.sfx.pop(); await s.show(b1, "left"); s.say("Die Bilder in der Chauvet-Höhle sind etwa 36.000 Jahre alt."); });
          s.step(async () => { s.sfx.pop(); await s.show(b2, "left"); });
          s.step(async () => { s.sfx.scribble(); await s.show(cols, "up"); });
          s.step(async () => { auto = false; s.sfx.chord([0, 4, 7]); hint.textContent = "Licht an: die ganze Wand!"; await s.tween({ from: 0, to: 1, dur: 1200, update: v => { all = v; render(); } }); });
        },
      },
      /* 12b -------------------------------------------------------------- */
      {
        title: "Höhlenbilder in echt",
        say: "So sehen die echten Höhlenbilder aus. Sie sind viele Tausend Jahre alt.",
        build(s) {
          const col = (fig, t) => s.h("div", { class: "stack later", style: { gap: "10px" } }, fig, P(s, t));
          const cols = [
            col(s.photo("chauvet-loewen", { w: "100%", h: 340, pos: "50% 40%", caption: "Höhlenlöwen, Chauvet" }), "Ein Rudel Höhlenlöwen. Dieses Foto zeigt eine genaue Nachbildung im Museum."),
            col(s.photo("chauvet-nashorn", { w: "100%", h: 340, pos: "40% 50%", caption: "Wollnashorn, Chauvet" }), "Mit Holzkohle gezeichnet – das große Horn ist gut zu erkennen."),
            col(s.photo("lascaux", { w: "100%", h: 340, pos: "45% 50%", caption: "Auerochsen und Pferde, Lascaux" }), "Rot, Gelb und Schwarz: Farben aus Erde und Kohle, um 17.000 v. Chr."),
          ];
          const merk = s.h("div", { class: "merk later" }, "Die echten Höhlen sind ", s.h("b", null, "geschlossen"), ", damit die Bilder nicht kaputtgehen. Besucher sehen ", s.h("b", null, "Nachbauten"), ".");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "16px" } }, s.h("div", { class: "cols3" }, cols), merk));
          s.show(cols[0], "zoom"); s.sound("hoehle-tropfen", { vol: .35, dur: 6 });
          s.step(async () => { s.sfx.pop(); await s.show(cols[1], "zoom"); });
          s.step(async () => { s.sfx.pop(); await s.show(cols[2], "zoom"); s.say("Die Bilder in Lascaux wurden um 17.000 vor Christus gemalt."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Figuren aus Elfenbein",
        say: "Auf der Schwäbischen Alb wurden die ältesten Figuren der Welt gefunden: die Venus vom Hohle Fels und der Löwenmensch.",
        build(s) {
          const svg = s.svg(470, 530);
          const base = 480, k = 12;
          const ruler = g(s, {}, s.el("rect", { x: 30, y: base - 35 * k - 10, width: 56, height: 35 * k + 20, rx: 6, fill: "#fff6c9", stroke: "#d9b84a", "stroke-width": 3 }));
          for (let cm = 0; cm <= 35; cm++) { const y = base - cm * k; ruler.append(s.el("line", { x1: 86, y1: y, x2: 86 - (cm % 5 ? 10 : 22), y2: y, stroke: INK, "stroke-width": cm % 5 ? 1.5 : 3 })); if (cm % 10 === 0) ruler.append(tx(s, 54, y + 7, String(cm), { fs: 19, fw: 700 })); }
          svg.append(ruler, s.el("line", { x1: 20, y1: base, x2: 460, y2: base, stroke: PEN, "stroke-width": 3 }));
          const ivory = "#efe3c8", ivE = "#b9a77f";
          const venus = g(s, {}, s.el("circle", { cx: 0, cy: -66, r: 6, fill: "none", stroke: ivE, "stroke-width": 4 }),
            s.el("path", { d: "M-10 -60 Q-26 -40 -24 -24 Q-26 -6 -14 0 L14 0 Q26 -6 24 -24 Q26 -40 10 -60 Z", fill: ivory, stroke: ivE, "stroke-width": 3 }));
          const H = 31.1 * k;
          const lion = g(s, {}, s.el("path", { d: `M-28 0 L-22 ${-H * .42} Q-40 ${-H * .5} -36 ${-H * .72} L-26 ${-H * .74} Q-28 ${-H * .86} -18 ${-H * .92} L-22 ${-H} L-10 ${-H * .96} L10 ${-H * .96} L22 ${-H} L18 ${-H * .92} Q28 ${-H * .86} 26 ${-H * .74} L36 ${-H * .72} Q40 ${-H * .5} 22 ${-H * .42} L28 0 L6 0 L4 ${-H * .3} L-4 ${-H * .3} L-6 0 Z`, fill: ivory, stroke: ivE, "stroke-width": 3 }),
            s.el("circle", { cx: -8, cy: -H * .86, r: 3, fill: "#7a6a4a" }), s.el("circle", { cx: 8, cy: -H * .86, r: 3, fill: "#7a6a4a" }));
          const vX = 180, lX = 340;
          venus.setAttribute("transform", `translate(${vX} ${base}) scale(0.0001)`);
          lion.setAttribute("transform", `translate(${lX} ${base}) scale(1 0.0001)`);
          const vLine = s.el("line", { x1: 86, y1: base - 6 * k, x2: vX + 30, y2: base - 6 * k, stroke: "#dc3b2a", "stroke-width": 2, "stroke-dasharray": "6 5", class: "later" });
          const lLine = s.el("line", { x1: 86, y1: base - H, x2: lX + 45, y2: base - H, stroke: "#dc3b2a", "stroke-width": 2, "stroke-dasharray": "6 5", class: "later" });
          const vL = tx(s, vX, base - 6 * k - 22, "6 cm", { fs: 24, fw: 800, fill: "#dc3b2a", cls: "later" });
          const lL = tx(s, lX + 50, base - H - 12, "31,1 cm", { fs: 24, fw: 800, fill: "#dc3b2a", cls: "later" });
          const nV = tx(s, vX, base + 30, "Venus", { fs: 22, fw: 800, cls: "later" }), nL = tx(s, lX, base + 30, "Löwenmensch", { fs: 22, fw: 800, cls: "later" });
          svg.append(venus, lion, vLine, lLine, vL, lL, nV, nL);
          const b1 = box(s, "ex later", "Venus vom Hohle Fels", P(s, "Gefunden 2008. Aus Mammut-Elfenbein, nur 6 cm groß und ca. 40.000 Jahre alt – eine der ältesten Menschenfiguren der Welt."));
          const b2 = box(s, "ex later", "Löwenmensch", P(s, "Gefunden 1939 im Hohlenstein-Stadel, aus über 200 Bruchstücken zusammengesetzt. Halb Mensch, halb Höhlenlöwe. Heute im Museum Ulm."));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Seit 2017 sind diese Höhlen der Schwäbischen Alb UNESCO-Welterbe.");
          const life = box(s, "life later", "Im Alltag", P(s, "Leg dein 30-cm-Lineal daneben: Der Löwenmensch ist sogar noch etwas größer!"));
          svg.style.width = "390px"; svg.style.height = "430px";
          const pV = s.photo("venus-hohle-fels", { w: "100%", h: 240, fit: "contain", caption: "Venus, 6 cm", cls: "later" });
          const pL = s.photo("loewenmensch", { w: "100%", h: 240, fit: "contain", caption: "Löwenmensch, 31,1 cm", cls: "later" });
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "390px 1fr", height: "100%", alignItems: "center", gap: "22px" } }, s.h("div", { class: "stack", style: { gap: "8px" } }, svg, life),
            s.h("div", { class: "stack", style: { gap: "10px" } }, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", alignItems: "start" } }, s.h("div", { class: "stack", style: { gap: "8px" } }, pV, b1), s.h("div", { class: "stack", style: { gap: "8px" } }, pL, b2)), merk)));
          s.show(ruler, "up"); s.sfx.pop();
          s.step(async () => { s.sfx.boing(); s.show(pV, "zoom"); s.show(b1, "left"); await s.tween({ from: 0.0001, to: 1, dur: 700, ease: "back", update: v => venus.setAttribute("transform", `translate(${vX} ${base}) scale(${v})`) }); s.show(vLine, "draw"); s.show(nV, "fade"); await s.show(vL, "pop"); });
          s.step(async () => { s.sfx.whoosh(); s.show(pL, "zoom"); s.show(b2, "left"); await s.tween({ from: 0.0001, to: 1, dur: 1100, ease: "out", update: v => lion.setAttribute("transform", `translate(${lX} ${base}) scale(1 ${v})`) }); s.show(lLine, "draw"); s.show(nL, "fade"); s.sfx.ding(); await s.show(lL, "pop"); s.say("Der Löwenmensch ist 31,1 Zentimeter groß und etwa 40.000 Jahre alt."); });
          s.step(async () => { s.sfx.fanfare(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Die ältesten Flöten der Welt",
        say: "Die ältesten Musikinstrumente der Welt sind Flöten aus Knochen und Elfenbein. Sie wurden auf der Schwäbischen Alb gefunden.",
        build(s) {
          const svg = s.svg(1060, 170);
          svg.append(s.el("path", { d: "M70 62 Q60 85 70 108 L980 112 Q1000 85 980 58 Z", fill: "#efe3c8", stroke: "#b9a77f", "stroke-width": 4 }),
            s.el("ellipse", { cx: 70, cy: 85, rx: 12, ry: 24, fill: "#e2d3b0", stroke: "#b9a77f", "stroke-width": 3 }),
            s.el("path", { d: "M120 64 L120 106 M118 64 L128 85", stroke: "#b9a77f", "stroke-width": 3, fill: "none" }));
          const notes = [12, 9, 7, 4, 2];
          const waves = g(s, {}); svg.append(waves);
          const ring = (i) => { const w = s.el("path", { d: "M40 60 Q20 85 40 110", stroke: C, "stroke-width": 4, fill: "none" }); waves.append(w); s.tween({ from: 0, to: 1, dur: 700, update: v => { w.setAttribute("transform", `translate(${-30 * v} 0) scale(${1 + v * .4} 1)`); w.setAttribute("opacity", 1 - v); } }).then(() => w.remove()); };
          const holes = notes.map((n, i) => {
            const x = 470 + i * 100;
            const hole = s.el("circle", { cx: x, cy: 85, r: 17, fill: "#5a4632" });
            const hit = s.el("circle", { cx: x, cy: 85, r: 40, fill: "transparent", style: { cursor: "pointer" } });
            const gg = g(s, { class: "nosw" }, hole, hit);
            gg.addEventListener("pointerdown", e => { e.preventDefault(); s.sfx.note(n, .5, "sine"); ring(i); hole.setAttribute("fill", C); setTimeout(() => s.alive && hole.setAttribute("fill", "#5a4632"), 260); });
            svg.append(gg); return hole;
          });
          svg.append(tx(s, 260, 150, "Mundstück", { fs: 19, fill: PEN }), tx(s, 670, 150, "5 Grifflöcher – tippe drauf!", { fs: 20, fw: 700, fill: C }));
          const tune = [0, 1, 2, 1, 0, 0, 3, 2, 1, 0];
          const play = s.h("button", { class: "btn solid", onclick: async () => { for (const i of tune) { if (!s.alive) return; s.sfx.note(notes[i], .4, "sine"); ring(i); holes[i].setAttribute("fill", C); await s.wait(300); holes[i].setAttribute("fill", "#5a4632"); } } }, "▶ Kleine Melodie");
          const b1 = box(s, "ex later", "Geißenklösterle", P(s, "42.000 bis 43.000 Jahre alt! Flöten aus Schwanenknochen und aus Mammut-Elfenbein – die ältesten bekannten Musikinstrumente."));
          const b2 = box(s, "ex later", "Hohle Fels", P(s, "Eine Flöte aus dem Flügelknochen eines Gänsegeiers, mit 5 Grifflöchern – mindestens 35.000 Jahre alt."));
          const life = box(s, "life later", "Für die Instrumentalklasse", P(s, "Bald wählst du dein Instrument. Die Flöte hat die längste Geschichte von allen: über 40.000 Jahre!"));
          const note = s.h("p", { class: "small pencil" }, "Die Töne oben sind ausgedacht. Der Knopf spielt eine heutige Flöte aus Schafsknochen – so ähnlich könnte es geklungen haben.");
          const pF = s.photo("floete-schwan", { w: 200, h: 330, pos: "50% 50%", caption: "Flöte aus Schwanenknochen", cls: "later" });
          const real = s.soundBtn("knochenfloete", "Knochenflöte (Nachbau)");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "14px" } }, svg,
            s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 200px 1fr", gap: "20px", alignItems: "start" } }, s.h("div", { class: "stack" }, b1, b2), pF, s.h("div", { class: "stack" }, life, s.h("div", { class: "row", style: { gap: "10px" } }, play, real), note))));
          s.show(svg, "left"); s.sfx.note(0, .4, "sine");
          s.step(async () => { s.sfx.note(7, .4, "sine"); s.show(pF, "zoom"); await s.show(b1, "up"); s.say("Die Flöten aus dem Geißenklösterle sind 42.000 bis 43.000 Jahre alt."); });
          s.step(async () => { s.sfx.note(4, .4, "sine"); await s.show(b2, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Fundort Neandertal",
        say: "1856 fanden Arbeiter im Neandertal bei Düsseldorf alte Knochen. Sie gaben dem Neandertaler seinen Namen.",
        build(s) {
          const svg = s.svg(440, 540);
          const p = (lon, lat) => [(lon - 5.5) * 40, (55.3 - lat) * 64];
          const de = [[6.0, 51.8], [7.0, 52.2], [7.0, 53.3], [8.5, 53.6], [8.7, 54.9], [10.0, 54.8], [11.0, 54.0], [12.5, 54.4], [14.2, 53.9], [14.4, 53.3], [14.1, 52.6], [14.7, 51.6], [15.0, 51.1], [14.3, 51.0], [12.1, 50.3], [12.5, 49.8], [13.8, 48.8], [13.0, 47.5], [12.2, 47.7], [10.5, 47.5], [9.6, 47.6], [7.6, 47.6], [7.6, 48.6], [8.2, 49.0], [6.4, 49.5], [6.1, 50.2], [6.0, 50.8], [5.9, 51.0]];
          svg.append(s.el("polygon", { points: de.map(q => p(...q).map(v => v.toFixed(1)).join(",")).join(" "), fill: "#efe8fb", stroke: C, "stroke-width": 3, "stroke-linejoin": "round" }));
          const dot = (lon, lat, col, label, o = {}) => { const [x, y] = p(lon, lat); const gg = g(s, { class: o.later ? "later" : "" }, s.el("circle", { cx: x, cy: y, r: o.r || 9, fill: col, stroke: "#fff", "stroke-width": 3 }), tl(s, x + (o.dx || 0), y + (o.dy || 0), label, { a: o.a || "middle", fill: col, fs: 20 })); svg.append(gg); return gg; };
          const berlin = dot(13.40, 52.52, INK, ["Berlin"], { a: "start", dx: 14, dy: 7 });
          dot(10.97, 52.14, PEN, ["Schöningen", "(Speere)"], { a: "end", dx: -6, dy: -36 });
          dot(9.9, 48.45, "#ee7a1a", ["Schwäbische Alb", "(Flöten, Figuren)"], { dy: 30 });
          const nea = dot(6.95, 51.23, "#dc3b2a", ["Neandertal"], { a: "start", dx: -18, dy: 38, later: true, r: 12 });
          const [bx, by] = p(13.40, 52.52), [nx, ny] = p(6.95, 51.23);
          const link = s.el("line", { x1: bx, y1: by, x2: nx, y2: ny, stroke: "#dc3b2a", "stroke-width": 3, "stroke-dasharray": "8 6", class: "later" });
          const km = tx(s, 205, 252, "ca. 465 km", { fs: 20, fw: 800, fill: "#dc3b2a", cls: "later" });
          svg.insertBefore(link, berlin); svg.append(km);
          const b1 = box(s, "ex later", "August 1856", P(s, "Arbeiter in einem Steinbruch im Neandertal (bei Düsseldorf) finden Knochen in einer kleinen Höhle, der Feldhofer Grotte."));
          const b2 = box(s, "ex later", "Wer erkennt es?", P(s, "Der Lehrer Johann Carl Fuhlrott merkt: Das sind keine Bärenknochen, sondern Knochen eines Eiszeit-Menschen!"));
          const b3 = box(s, "ex later", "Berühmt", P(s, "Der Fundort gab dem Neandertaler seinen Namen – drei Jahre bevor Charles Darwin 1859 sein berühmtes Buch über die Entstehung der Arten veröffentlichte."));
          const life = box(s, "life later", "Im Alltag", P(s, "Von Berlin zum Neandertal sind es ca. 465 km Luftlinie. Dort steht heute das Neanderthal Museum (Mettmann)."));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "440px 1fr", height: "100%", alignItems: "center", gap: "30px" } }, svg, s.h("div", { class: "stack", style: { gap: "12px" } }, b1, b2, b3, life)));
          s.show(svg, "fade"); s.sfx.whoosh();
          s.step(async () => { s.sound("kelle-graben"); s.show(nea, "bounce"); await s.show(b1, "left"); });
          s.step(async () => { s.sfx.pop(); await s.show(b2, "left"); });
          s.step(async () => { s.sfx.fanfare(); await s.show(b3, "left"); });
          s.step(async () => { s.show(link, "draw"); s.sfx.whoosh(); await s.show(km, "pop"); s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Steinzeit im Alltag",
        say: "Die Steinzeit steckt auch in deinem Alltag: beim Lagerfeuer, beim Beerensammeln, im Museum und in deinem Taschenmesser.",
        build(s) {
          const items = [
            [() => s.photo("lagerfeuer", { w: 190, h: 190 }), "Lagerfeuer & Camping", "Holz, Funken, Glut – beim Camping machst du Feuer fast wie in der Steinzeit. Aber nur mit Erwachsenen und wo es erlaubt ist!"],
            [() => s.photo("brombeeren", { w: 190, h: 190, pos: "50% 40%" }), "Beeren sammeln", "Brombeeren am Wegrand, Haselnüsse im Herbst: Das ist Sammeln wie früher. Nur essen, was du sicher kennst!"],
            [() => s.photo("neues-museum", { w: 190, h: 190, pos: "60% 50%" }), "Neues Museum Berlin", "Auf der Museumsinsel zeigt das Museum für Vor- und Frühgeschichte Steinzeit-Funde, z. B. Neandertaler-Funde aus Le Moustier und den Eiszeit-Elch vom Hansaplatz."],
            [() => s.photo("taschenmesser", { w: 190, h: 190 }), "Faustkeil vs. Multitool", "Faustkeil: ein Stein für viele Aufgaben. Multitool: Messer, Säge, Schere aus Stahl. Die Idee ist dieselbe – ein Werkzeug für alles!"],
          ];
          const cards = items.map(([e, t, b]) => s.h("div", { class: "life later", style: { display: "grid", gridTemplateColumns: "190px 1fr", gap: "14px", alignItems: "center" } },
            e(), s.h("div", { class: "stack", style: { gap: "6px" } }, s.h("p", { class: "h2", style: { fontSize: "26px" } }, t), P(s, b))));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", height: "100%", alignContent: "center" } }, cards));
          s.show(cards[0], "pop"); s.sound("fire", { vol: .45, dur: 4 });
          s.step(async () => { s.sound("birds", { vol: .4, dur: 3 }); await s.show(cards[1], "pop"); });
          s.step(async () => { s.sound("footsteps", { vol: .6 }); await s.show(cards[2], "pop"); s.say("Im Neuen Museum auf der Museumsinsel kannst du echte Steinzeit-Funde sehen."); });
          s.step(async () => { s.sfx.success(); await s.show(cards[3], "pop"); s.confetti(590, 400, 80); });
        },
      },
    ],
  });
})();
