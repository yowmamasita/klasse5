/* Kapitel 9 – Pflanzen und Tiere (RLP NaWi 5/6, Themenfeld 3.5 „Pflanzen, Tiere, Lebensräume“).
   Kennzeichen des Lebendigen, Blütenpflanze, Blüte, Bestäubung, Keimung, Fotosynthese, Samenverbreitung,
   Wirbeltiere/Wirbellose, Angepasstheit, Überwintern, Haustiere, Nahrungsketten, Bestimmen, Natur in Berlin.
   Fakten geprüft (Quellen im Bericht): NABU, Botanischer Garten Berlin, LMU, SRF, Wikipedia u. a. */
(() => {
  const UC = "#4d7c0f";
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------- helpers (as in u8) ---------- */
  const P = (s, html, cls = "t", hidden = false) => s.h("p", { class: cls + (hidden ? " later" : ""), html });
  const life = (s, label, ...kids) => s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, label), ...kids);
  const exb = (s, label, ...kids) => s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, label), ...kids);
  const merk = (s, html, hidden = true, size = 22) => s.h("div", { class: "merk" + (hidden ? " later" : ""), style: { fontSize: size + "px" }, html });
  const stack = (s, gap, ...kids) => s.h("div", { class: "stack", style: { gap: gap + "px" } }, ...kids);
  const cols = (s, lw, left, right, gap = 24) =>
    s.h("div", { class: "cols", style: { gridTemplateColumns: lw + "px 1fr", gap: gap + "px", alignItems: "center", height: "100%" } }, left, right);
  const lineTo = (s, x1, y1, x2, y2, col = UC, cls = "later") => s.el("line", { x1, y1, x2, y2, stroke: col, "stroke-width": 2.5, class: cls });
  const txt = (s, x, y, t, anchor = "start", extra = {}) => s.el("text", Object.assign({ x, y, "text-anchor": anchor, class: "lbl later", style: { fontWeight: 700 }, text: t }, extra));

  /* a flower seen from the side (Längsschnitt); returns parts */
  function flowerCut(s, cx, by, k = 1, pal = {}) {
    const P2 = {};
    const petal = pal.petal || "#fbd3e0", petalS = pal.petalS || "#d16b93";
    P2.stalk = s.el("path", { d: `M${cx} ${by + 150 * k} L${cx} ${by + 8 * k}`, stroke: "#3f8a2a", "stroke-width": 10 * k, fill: "none", "stroke-linecap": "round" });
    P2.base = s.el("path", { d: `M${cx - 46 * k} ${by} Q${cx} ${by + 34 * k} ${cx + 46 * k} ${by} Z`, fill: "#7cb35a" });
    P2.kelch = s.el("g", null,
      s.el("path", { d: `M${cx - 40 * k} ${by + 4 * k} Q${cx - 80 * k} ${by - 4 * k} ${cx - 104 * k} ${by + 26 * k} Q${cx - 70 * k} ${by + 26 * k} ${cx - 34 * k} ${by + 16 * k} Z`, fill: "#5f9e3a", stroke: "#3f7a2a", "stroke-width": 2 }),
      s.el("path", { d: `M${cx + 40 * k} ${by + 4 * k} Q${cx + 80 * k} ${by - 4 * k} ${cx + 104 * k} ${by + 26 * k} Q${cx + 70 * k} ${by + 26 * k} ${cx + 34 * k} ${by + 16 * k} Z`, fill: "#5f9e3a", stroke: "#3f7a2a", "stroke-width": 2 }));
    P2.krone = s.el("g", null,
      s.el("path", { d: `M${cx - 36 * k} ${by - 4 * k} C${cx - 120 * k} ${by - 40 * k} ${cx - 170 * k} ${by - 150 * k} ${cx - 120 * k} ${by - 190 * k} C${cx - 90 * k} ${by - 150 * k} ${cx - 60 * k} ${by - 90 * k} ${cx - 30 * k} ${by - 24 * k} Z`, fill: petal, stroke: petalS, "stroke-width": 2.5 }),
      s.el("path", { d: `M${cx + 36 * k} ${by - 4 * k} C${cx + 120 * k} ${by - 40 * k} ${cx + 170 * k} ${by - 150 * k} ${cx + 120 * k} ${by - 190 * k} C${cx + 90 * k} ${by - 150 * k} ${cx + 60 * k} ${by - 90 * k} ${cx + 30 * k} ${by - 24 * k} Z`, fill: petal, stroke: petalS, "stroke-width": 2.5 }));
    P2.staub = s.el("g");
    [-1, 1].forEach(d => [0.55, 0.85, 1.15].forEach((a, i) => {
      const x2 = cx + d * (34 + i * 20) * k, y2 = by - (120 + (i === 1 ? 14 : 0)) * k;
      P2.staub.append(s.el("line", { x1: cx + d * 24 * k, y1: by - 6 * k, x2, y2: y2 + 8 * k, stroke: "#c9b24a", "stroke-width": 3 * k }),
        s.el("ellipse", { cx: x2, cy: y2, rx: 7 * k, ry: 12 * k, fill: "#f2b705", stroke: "#a77a00", "stroke-width": 2 }));
    }));
    P2.frucht = s.el("ellipse", { cx, cy: by - 26 * k, rx: 26 * k, ry: 30 * k, fill: "#a7d36b", stroke: "#3f7a2a", "stroke-width": 3 });
    P2.anlage = s.el("ellipse", { cx, cy: by - 24 * k, rx: 9 * k, ry: 12 * k, fill: "#fff6c9", stroke: "#a77a00", "stroke-width": 2 });
    P2.griffel = s.el("rect", { x: cx - 5 * k, y: by - 150 * k, width: 10 * k, height: 96 * k, rx: 4, fill: "#a7d36b", stroke: "#3f7a2a", "stroke-width": 2 });
    P2.narbe = s.el("ellipse", { cx, cy: by - 154 * k, rx: 15 * k, ry: 8 * k, fill: "#7fb34a", stroke: "#3f7a2a", "stroke-width": 2.5 });
    const g = s.el("g", null, P2.stalk, P2.base, P2.kelch, P2.krone, P2.staub, P2.frucht, P2.anlage, P2.griffel, P2.narbe);
    return { g, P: P2 };
  }

  /* a small bee (SVG group, centred at 0,0) */
  const bee = s => s.el("g", null,
    s.el("ellipse", { cx: -4, cy: -14, rx: 12, ry: 8, fill: "rgba(200,230,255,.85)", stroke: "#8aa", "stroke-width": 1.5, transform: "rotate(-25 -4 -14)" }),
    s.el("ellipse", { cx: 0, cy: 0, rx: 18, ry: 11, fill: "#f2b705", stroke: "#1b2740", "stroke-width": 2 }),
    s.el("line", { x1: -5, y1: -10, x2: -5, y2: 10, stroke: "#1b2740", "stroke-width": 4 }),
    s.el("line", { x1: 4, y1: -10, x2: 4, y2: 10, stroke: "#1b2740", "stroke-width": 4 }),
    s.el("circle", { cx: 18, cy: -2, r: 7, fill: "#1b2740" }));

  Deck.unit({
    id: "u9", num: 9, title: "Pflanzen und Tiere", color: UC, soft: "#eef6dc",
    subtitle: "Was lebt – und wie es zu seinem Lebensraum passt",
    blurb: "Blüten, Samen, Wirbeltiere, Überwintern und Natur in Berlin",
    goals: [
      "Die Kennzeichen des Lebendigen kennen",
      "Blütenpflanzen verstehen: Blüte, Bestäubung, Samen, Keimung",
      "Die fünf Wirbeltierklassen vergleichen",
      "Angepasstheit und Überwintern an Beispielen erklären",
      "Tiere mit einem Bestimmungsschlüssel bestimmen",
    ],
    icon(svg, el) {
      svg.append(
        el("path", { d: "M35 64 L35 30", stroke: UC, "stroke-width": 5, "stroke-linecap": "round" }),
        el("path", { d: "M35 48 Q18 46 14 30 Q30 30 35 44 Z", fill: "#7cb35a", stroke: UC, "stroke-width": 2 }),
        ...[0, 72, 144, 216, 288].map(a => el("ellipse", { cx: 35 + 11 * Math.cos(a * Math.PI / 180), cy: 20 + 11 * Math.sin(a * Math.PI / 180), rx: 8, ry: 6, fill: "#fbd3e0", stroke: "#d16b93", "stroke-width": 2, transform: `rotate(${a} ${35 + 11 * Math.cos(a * Math.PI / 180)} ${20 + 11 * Math.sin(a * Math.PI / 180)})` })),
        el("circle", { cx: 35, cy: 20, r: 6, fill: "#f2b705" }),
        el("ellipse", { cx: 56, cy: 54, rx: 9, ry: 6, fill: "#f2b705", stroke: "#1b2740", "stroke-width": 2 }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Was ist ein Lebewesen?",
        say: "Lebewesen erkennst du an den Kennzeichen des Lebendigen. Tippe oben auf Hund, Blume, Auto oder Kristall und vergleiche.",
        build(s) {
          const KZ = [["Bewegung", "bewegt sich selbst"], ["Stoffwechsel", "nimmt Stoffe auf, gibt Stoffe ab"], ["Wachstum", "wird größer"], ["Fortpflanzung", "bekommt Nachkommen"],
            ["Reizbarkeit", "reagiert auf Licht, Wärme, Berührung"], ["Entwicklung", "verändert sich im Leben"], ["Zellen", "ist aus Zellen gebaut"]];
          const OBJ = [["🐕", "Hund"], ["🌻", "Blume"], ["🚗", "Auto"], ["💎", "Kristall"]];
          const V = [[1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1], ["~", "~", 0, 0, 0, 0, 0], [0, 0, "~", 0, 0, 0, 0]];
          const INFO = [
            ["Hund", "Alle sieben Kennzeichen passen. Der Hund ist ein <b>Lebewesen</b>."],
            ["Sonnenblume", "Auch Pflanzen bewegen sich: Junge Sonnenblumen drehen ihre Köpfe zur Sonne. Sie sind <b>Lebewesen</b>."],
            ["Auto", "Es fährt nur mit Fahrer, tankt und macht Abgase. Das sieht nur so aus wie Leben (~). Es wächst nie."],
            ["Kristall", "Ein Salzkristall wächst in Salzwasser (~). Sonst fehlt alles: <b>kein</b> Lebewesen."],
          ];
          const cells = OBJ.map(() => []);
          const mk = v => s.h("td", { class: "later", style: { textAlign: "center", fontSize: "30px", fontWeight: 800, padding: "2px 4px", color: v === 1 ? "var(--green)" : v === "~" ? "var(--orange)" : "var(--red)" } }, v === 1 ? "✓" : v === "~" ? "~" : "✗");
          const heads = OBJ.map(([e, n], i) => s.h("th", { style: { padding: "4px", width: "92px", cursor: "pointer" }, onclick: () => pick(i) },
            s.h("div", { style: { fontSize: "36px", lineHeight: "1.1" } }, e), s.h("div", { class: "small", style: { fontWeight: 700 } }, n)));
          const rows = KZ.map(([n, d], r) => s.h("tr", { style: { borderTop: "2px solid var(--line)" } },
            s.h("td", { style: { padding: "4px 12px", width: "300px" } }, s.h("div", { style: { fontWeight: 700, fontSize: "22px", lineHeight: "1.15" } }, n), s.h("div", { class: "small", style: { color: "var(--pencil)", lineHeight: "1.15" } }, d)),
            ...OBJ.map((_, i) => { const c = mk(V[i][r]); cells[i].push(c); return c; })));
          const table = s.h("table", { style: { borderCollapse: "collapse", background: "#fff", borderRadius: "16px", border: "2px solid var(--line)" } },
            s.h("tr", null, s.h("th", { class: "t", style: { textAlign: "left", padding: "6px 12px", color: "var(--unit)" } }, "Kennzeichen"), ...heads), ...rows);
          const infoT = s.h("p", { class: "h2", style: { color: "var(--unit)" } }, "Tippe oben auf ein Bild");
          const infoD = P(s, "Dann siehst du, welche Kennzeichen passen.");
          const card = s.h("div", { class: "card soft stack", style: { gap: "8px", minHeight: "200px" } }, infoT, infoD);
          const m = merk(s, "Ein <b>Lebewesen</b> zeigt <b>alle</b> Kennzeichen des Lebendigen. Eines allein reicht nicht.");
          const pick = async i => {
            heads.forEach((h, j) => h.style.background = j === i ? "var(--unit-soft)" : "");
            infoT.textContent = INFO[i][0]; infoD.innerHTML = INFO[i][1];
            for (const c of cells[i]) { if (!c.classList.contains("later")) continue; s.show(c, "pop"); s.sfx.tick(); await s.wait(90); }
            if (cells[i].every(c => !c.classList.contains("later"))) s.sfx.pop();
          };
          s.add(cols(s, 664, table, stack(s, 16, card, m)));
          s.show(table, "fade"); s.sfx.pop();
          s.step(async () => { s.sound("hund-bellen", { vol: 0.6 }); await pick(0); });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await pick(1); });
          s.step(async () => { s.sfx.boing(); await pick(2); });
          s.step(async () => { s.sfx.zap(); await pick(3); s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Aufbau einer Blütenpflanze",
        say: "Jede Blütenpflanze hat vier Grundorgane: Wurzel, Sprossachse, Blätter und Blüte. Tippe auf einen Namen.",
        build(s) {
          const sv = s.svg(560, 600);
          const ground = 400, cx = 340;
          sv.append(s.el("rect", { x: 0, y: ground, width: 560, height: 200, rx: 14, fill: "#c9a77a" }), s.el("rect", { x: 0, y: 0, width: 560, height: ground, rx: 14, fill: "#eef6fb" }));
          const PT = {};
          PT.wurzel = s.el("g", { fill: "none", stroke: "#a0703a", "stroke-width": 6, "stroke-linecap": "round" },
            s.el("path", { d: `M${cx} ${ground} L${cx} 560` }), s.el("path", { d: `M${cx} 440 Q${cx - 60} 460 ${cx - 90} 520` }), s.el("path", { d: `M${cx} 470 Q${cx + 60} 490 ${cx + 86} 556` }),
            s.el("path", { d: `M${cx} 510 Q${cx - 40} 530 ${cx - 50} 576`, "stroke-width": 4 }), s.el("path", { d: `M${cx} 420 Q${cx + 50} 426 ${cx + 100} 460`, "stroke-width": 4 }));
          PT.spross = s.el("path", { d: `M${cx} ${ground} L${cx} 130`, stroke: "#3f8a2a", "stroke-width": 12, "stroke-linecap": "round" });
          PT.blatt = s.el("g", null,
            s.el("path", { d: `M${cx} 300 Q${cx - 70} 250 ${cx - 150} 270 Q${cx - 80} 330 ${cx} 300 Z`, fill: "#6fbf4a", stroke: "#3f8a2a", "stroke-width": 3 }),
            s.el("path", { d: `M${cx} 300 L${cx - 140} 272`, stroke: "#3f8a2a", "stroke-width": 2 }),
            s.el("path", { d: `M${cx} 230 Q${cx + 70} 180 ${cx + 150} 200 Q${cx + 80} 260 ${cx} 230 Z`, fill: "#6fbf4a", stroke: "#3f8a2a", "stroke-width": 3 }),
            s.el("path", { d: `M${cx} 230 L${cx + 140} 202`, stroke: "#3f8a2a", "stroke-width": 2 }));
          PT.bluete = s.el("g", null, ...[0, 72, 144, 216, 288].map(a => { const r = a * Math.PI / 180, x = cx + 34 * Math.cos(r - Math.PI / 2), y = 100 + 34 * Math.sin(r - Math.PI / 2); return s.el("ellipse", { cx: x, cy: y, rx: 30, ry: 20, fill: "#fbd3e0", stroke: "#d16b93", "stroke-width": 2.5, transform: `rotate(${a + 90} ${x} ${y})` }); }),
            s.el("circle", { cx, cy: 100, r: 18, fill: "#f2b705", stroke: "#a77a00", "stroke-width": 2 }));
          const order = ["wurzel", "spross", "blatt", "bluete"];
          order.forEach(k => PT[k].classList.add("later"));
          sv.append(PT.wurzel, PT.spross, PT.blatt, PT.bluete);
          const D = {
            wurzel: ["Wurzel", "Hält die Pflanze im Boden fest. Sie nimmt Wasser und Mineralstoffe auf.", 500, cx, 500],
            spross: ["Sprossachse", "Der Stängel – beim Baum der Stamm. Er trägt Blätter und Blüten und leitet Wasser nach oben.", 360, cx - 6, 360],
            blatt: ["Blatt", "Hier macht die Pflanze mit Sonnenlicht ihre Nahrung: Zucker.", 285, cx - 100, 285],
            bluete: ["Blüte", "Hier entstehen die Samen – für neue Pflanzen.", 100, cx - 66, 100],
          };
          const lab = {};
          const infoT = s.h("p", { class: "h2", style: { color: "var(--unit)" } }, "Tippe auf einen Namen");
          const infoD = P(s, "Dann leuchtet das Organ auf.");
          const pick = key => { order.forEach(k => PT[k].setAttribute("opacity", k === key ? 1 : 0.35)); infoT.textContent = D[key][0]; infoD.textContent = D[key][1]; s.sfx.click(); };
          order.forEach(k => {
            const [n, , y, px, py] = D[k];
            const t = s.el("text", { x: 16, y: y + 7, class: "lbl", style: { fontWeight: 700, cursor: "pointer" }, text: n });
            const l = s.el("line", { x1: 16 + n.length * 11 + 8, y1: y, x2: px, y2: py, stroke: UC, "stroke-width": 2.5 });
            const hit = s.el("rect", { x: 6, y: y - 24, width: n.length * 11 + 30, height: 48, fill: "transparent" });
            lab[k] = s.el("g", { class: "later", style: { cursor: "pointer" }, onclick: () => pick(k) }, l, hit, t);
            sv.append(lab[k]);
          });
          const lf = life(s, "Im Alltag: Was essen wir?", s.h("div", { class: "stack", style: { gap: "4px" } },
            P(s, "🥕 Möhre – die <b>Wurzel</b>", "small"), P(s, "🥔 Kartoffel – eine Knolle der <b>Sprossachse</b>", "small"),
            P(s, "🥬 Salat, Spinat – die <b>Blätter</b>", "small"), P(s, "🥦 Brokkoli – viele <b>Blüten</b>knospen", "small")));
          s.add(cols(s, 560, sv, stack(s, 14, s.h("div", { class: "card soft stack", style: { gap: "8px", minHeight: "170px" } }, infoT, infoD), lf)));
          s.show(sv, "fade"); s.sfx.pop();
          order.forEach((k, i) => s.step(async () => { s.sfx.note(i * 3, .2); PT[k].setAttribute("opacity", 1); await s.show(PT[k], k === "spross" ? "draw" : "pop"); await s.show(lab[k], "fade"); pick(k); }));
          s.step(async () => { order.forEach(k => PT[k].setAttribute("opacity", 1)); infoT.textContent = "Vier Grundorgane"; infoD.textContent = "Wurzel, Sprossachse, Blatt und Blüte."; s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Die Blüte von innen",
        say: "Eine Kirschblüte, aufgeschnitten. Von außen nach innen: Kelchblätter, Kronblätter, Staubblätter und in der Mitte der Stempel.",
        build(s) {
          const sv = s.svg(700, 600);
          const cx = 350, by = 400;
          const { g, P: F } = flowerCut(s, cx, by, 1.15);
          const order = ["kelch", "krone", "staub", "stempel"];
          F.stempel = s.el("g", null, F.frucht, F.anlage, F.griffel, F.narbe);
          g.append(F.stempel);
          order.forEach(k => F[k].classList.add("later"));
          sv.append(g);
          const L = [
            // [key, text, x, y, anchor, px, py]
            ["kelch", "Kelchblatt", 20, 470, "start", 250, 428],
            ["krone", "Kronblatt", 20, 230, "start", 196, 236],
            ["staub", "Staubblatt", 200, 50, "start", 300, 252],
            ["stempel", "Narbe", 680, 140, "end", 366, 222],
            ["stempel", "Griffel", 680, 250, "end", 358, 300],
            ["stempel", "Fruchtknoten", 680, 470, "end", 378, 380],
            ["stempel", "Samenanlage", 680, 540, "end", 356, 380],
          ].map(([k, t, x, y, a, px, py]) => {
            const w = t.length * 11 + 10;
            const l = lineTo(s, a === "start" ? x + w : x - w, y - 7, px, py);
            const tx = txt(s, x, y, t, a);
            sv.append(l, tx); return { k, l, tx };
          });
          const D = {
            kelch: ["Kelchblätter", "Grün und klein. Sie schützen die Knospe."],
            krone: ["Kronblätter", "Groß und bunt. Sie locken Insekten an."],
            staub: ["Staubblätter", "Oben im Staubbeutel sitzt der gelbe Blütenstaub: der Pollen."],
            stempel: ["Stempel", "Narbe, Griffel und Fruchtknoten. Im Fruchtknoten liegt die Samenanlage."],
          };
          const infoT = s.h("p", { class: "h2", style: { color: "var(--unit)" } }, "Kirschblüte, aufgeschnitten");
          const infoD = P(s, "Von außen nach innen.");
          const m = merk(s, "Der <b>Stempel</b> = Narbe + Griffel + Fruchtknoten.");
          const photo = s.h("div", { class: "later" }, s.photo("biene-kirschbluete", { w: 356, h: 200, pos: "50% 55%", caption: "Biene an einer Kirschblüte" }));
          s.add(cols(s, 700, sv, stack(s, 14, s.h("div", { class: "card soft stack", style: { gap: "8px", minHeight: "150px" } }, infoT, infoD), m, photo), 20));
          s.sfx.pop();
          order.forEach((k, i) => s.step(async () => {
            s.sfx.note(i * 2, .2); await s.show(F[k], "pop");
            for (const x of L.filter(x => x.k === k)) { s.sfx.tick(); await s.show(x.l, "draw"); s.show(x.tx, "fade"); }
            infoT.textContent = D[k][0]; infoD.textContent = D[k][1];
            if (k === "stempel") { s.sfx.ding(); await s.show(m, "up"); }
          }));
          s.step(async () => { s.sound("bienen-summen", { vol: 0.5 }); await s.show(photo, "zoom"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Von der Blüte zur Kirsche",
        say: "Die Biene bringt Pollen von einer Blüte auf die Narbe einer anderen. Das ist die Bestäubung. Danach wächst aus dem Fruchtknoten die Frucht.",
        build(s) {
          const sv = s.svg(600, 560);
          sv.append(s.el("rect", { x: 0, y: 0, width: 600, height: 560, rx: 18, fill: "#eef6fb" }));
          // flower A (left, front view)
          const A = { x: 110, y: 170 };
          const fa = s.el("g", null, s.el("path", { d: `M${A.x} ${A.y + 20} L${A.x} 540`, stroke: "#3f8a2a", "stroke-width": 8 }),
            ...[0, 72, 144, 216, 288].map(a => { const r = a * Math.PI / 180, x = A.x + 32 * Math.cos(r), y = A.y + 32 * Math.sin(r); return s.el("ellipse", { cx: x, cy: y, rx: 30, ry: 19, fill: "#fbd3e0", stroke: "#d16b93", "stroke-width": 2, transform: `rotate(${a} ${x} ${y})` }); }),
            ...Array.from({ length: 10 }, (_, i) => s.el("circle", { cx: A.x + 13 * Math.cos(i / 10 * TAU), cy: A.y + 13 * Math.sin(i / 10 * TAU), r: 5, fill: "#f2b705" })));
          sv.append(fa, s.el("text", { x: A.x, y: 80, "text-anchor": "middle", class: "lbl", text: "Blüte 1" }));
          // flower B (right, cut)
          const { g, P: F } = flowerCut(s, 400, 380, 1);
          sv.append(g, s.el("text", { x: 400, y: 160, "text-anchor": "middle", class: "lbl", text: "Blüte 2 (aufgeschnitten)" }));
          const narbeY = 380 - 154, anlY = 380 - 24;
          const tube = s.el("path", { d: `M400 ${narbeY + 4} L400 ${anlY - 10}`, stroke: "#e07b00", "stroke-width": 4, fill: "none", "stroke-dasharray": "6 4", class: "later" });
          sv.append(tube);
          const pollen = Array.from({ length: 5 }, (_, i) => s.el("circle", { cx: 0, cy: 0, r: 4.5, fill: "#f2b705", stroke: "#a77a00", "stroke-width": 1, opacity: 0 }));
          const B = bee(s); B.setAttribute("transform", "translate(-60 60)");
          sv.append(...pollen, B);
          const put = (x, y, carry) => { B.setAttribute("transform", `translate(${x} ${y})`); pollen.forEach((p, i) => { if (carry) { p.setAttribute("cx", x - 10 + i * 5); p.setAttribute("cy", y + 10 + (i % 2) * 3); p.setAttribute("opacity", 1); } }); };
          const fly = async (x0, y0, x1, y1, carry, dur = 1300) => s.tween({ from: 0, to: 1, dur, ease: "inOut", update: t => put(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t - Math.sin(t * Math.PI) * 70, carry) });
          let flying = false;
          const beeRun = async () => {
            if (flying) return; flying = true;
            pollen.forEach(p => p.setAttribute("opacity", 0));
            s.sound("bienen-summen", { vol: 0.5 });
            await fly(-60, 60, A.x, A.y - 12, false, 1100); s.sfx.pop();
            await s.wait(300); put(A.x, A.y - 12, true);
            await fly(A.x, A.y - 12, 400, narbeY - 18, true, 1500);
            pollen.forEach((p, i) => { p.setAttribute("cx", 392 + i * 4); p.setAttribute("cy", narbeY - 6); });
            s.sfx.snap(); await s.wait(200);
            await fly(400, narbeY - 18, 640, 40, false, 1000); flying = false;
          };
          const cards = [
            exb(s, "1 · Bestäubung", P(s, "Die Biene sammelt Nektar. Dabei bleibt <b>Pollen</b> an ihr hängen. Sie trägt ihn auf die <b>Narbe</b> einer anderen Kirschblüte.", "small")),
            exb(s, "2 · Befruchtung", P(s, "Aus dem Pollenkorn wächst ein <b>Pollenschlauch</b> durch den Griffel bis zur Samenanlage.", "small")),
            exb(s, "3 · Frucht und Samen", P(s, "Kronblätter fallen ab. Der <b>Fruchtknoten</b> wird zur Kirsche, die <b>Samenanlage</b> zum Kern – dem Samen.", "small")),
            life(s, "Bestäubung durch Wind", P(s, "Gräser, Hasel und Birke brauchen keine Insekten: Der Wind trägt ihren Pollen. Darum gibt es Heuschnupfen.", "small")),
          ];
          const again = s.h("button", { class: "btn", onclick: beeRun }, "Biene nochmal");
          s.add(cols(s, 600, stack(s, 10, sv), stack(s, 12, ...cards, s.h("div", { class: "row" }, again))));
          s.show(sv, "fade"); s.sfx.pop();
          s.step(async () => { s.show(cards[0], "up"); await beeRun(); });
          s.step(async () => { s.show(cards[1], "up"); s.sfx.scribble(); await s.show(tube, "draw"); s.sfx.ding(); });
          s.step(async () => {
            s.show(cards[2], "up"); s.sfx.whoosh();
            await s.tween({ from: 0, to: 1, dur: 1600, update: t => { F.krone.setAttribute("opacity", 1 - t); F.staub.setAttribute("opacity", 1 - t); F.kelch.setAttribute("opacity", 1 - t * 0.7); F.griffel.setAttribute("opacity", 1 - t); F.narbe.setAttribute("opacity", 1 - t); tube.setAttribute("opacity", 1 - t); pollen.forEach(p => p.setAttribute("opacity", 1 - t)); } });
            s.sfx.pop();
            await s.tween({ from: 0, to: 1, dur: 1600, ease: "out", update: t => {
              F.frucht.setAttribute("rx", 26 + t * 44); F.frucht.setAttribute("ry", 30 + t * 40); F.frucht.setAttribute("cy", 354 - t * 40);
              const c1 = [167, 211, 107], c2 = [196, 30, 58]; F.frucht.setAttribute("fill", `rgb(${c1.map((c, i) => Math.round(c + (c2[i] - c) * t)).join(",")})`);
              F.anlage.setAttribute("cy", 356 - t * 40); F.anlage.setAttribute("rx", 9 + t * 11); F.anlage.setAttribute("ry", 12 + t * 13); F.anlage.setAttribute("fill", t > 0.6 ? "#e8d3a8" : "#fff6c9");
            } });
            s.sfx.success();
          });
          s.step(async () => { s.sound("wind", { vol: 0.4, dur: 3 }); await s.show(cards[3], "up"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Aus dem Samen wird eine Pflanze",
        say: "Eine Bohne keimt. Ziehe am Regler und sieh zu, wie aus dem Samen eine junge Pflanze wird.",
        build(s) {
          const W = 520, H = 500, G = 260;
          const { canvas, g } = s.canvas(W, H);
          let day = 0;
          const leaf = (x, y, ang, len, col) => { g.save(); g.translate(x, y); g.rotate(ang); g.fillStyle = col; g.strokeStyle = "#2f6d1f"; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(len * 0.5, -len * 0.45, len, 0); g.quadraticCurveTo(len * 0.5, len * 0.45, 0, 0); g.fill(); g.stroke(); g.restore(); };
          const draw = () => {
            const d = day;
            g.fillStyle = "#eef6fb"; g.fillRect(0, 0, W, G); g.fillStyle = "#b9946a"; g.fillRect(0, G, W, H - G);
            g.fillStyle = "rgba(90,60,30,.25)"; for (let i = 0; i < 40; i++) { g.beginPath(); g.arc((i * 97) % W, G + 10 + (i * 53) % (H - G - 20), 3, 0, TAU); g.fill(); }
            const cx = W / 2, seedY = G + 70;
            const swell = clamp(d / 2, 0, 1);
            const root = clamp((d - 2) / 6, 0, 1), shoot = clamp((d - 3.5) / 4.5, 0, 1), up = clamp((d - 6) / 3, 0, 1), open = clamp((d - 8) / 4, 0, 1);
            // roots
            if (root > 0) {
              g.strokeStyle = "#f4ead0"; g.lineCap = "round"; g.lineWidth = 6; g.beginPath(); g.moveTo(cx, seedY + 10); g.lineTo(cx, seedY + 10 + root * 150); g.stroke();
              g.lineWidth = 3; for (let i = 1; i <= 4; i++) { const y0 = seedY + 10 + i * 30 * root, l = 40 * clamp(root * 2 - i * 0.3, 0, 1); if (l > 0) { g.beginPath(); g.moveTo(cx, y0); g.lineTo(cx - l, y0 + l * 0.6); g.moveTo(cx, y0 + 6); g.lineTo(cx + l, y0 + 6 + l * 0.6); g.stroke(); } }
            }
            // shoot: hook comes up, carries the seed leaves (Keimblätter) above the ground
            const topY = seedY - shoot * (seedY - G + 20) - up * 120;
            if (shoot > 0) {
              g.strokeStyle = "#cfe39a"; g.lineWidth = 7; g.beginPath(); g.moveTo(cx, seedY); g.lineTo(cx, topY + 18 * (1 - up));
              if (up < 1) g.quadraticCurveTo(cx, topY - 6, cx + 22 * (1 - up), topY + 10 * (1 - up)); else g.lineTo(cx, topY);
              g.stroke(); if (up > 0.3) { g.strokeStyle = "#6fbf4a"; g.lineWidth = 7; g.beginPath(); g.moveTo(cx, topY + 60); g.lineTo(cx, topY); g.stroke(); }
            }
            // seed / Keimblätter
            const sx = shoot > 0 ? cx + 22 * (1 - up) : cx, sy = shoot > 0 ? topY + 10 * (1 - up) : seedY;
            const sz = 1 + swell * 0.35 - open * 0.35;
            const kb = open > 0 ? `rgb(${Math.round(232 - open * 120)},${Math.round(214 - open * 20)},${Math.round(160 - open * 90)})` : "#efe0b8";
            g.fillStyle = kb; g.strokeStyle = "#8a6a3a"; g.lineWidth = 2;
            if (open > 0) { [-1, 1].forEach(dd => { g.beginPath(); g.ellipse(sx + dd * (14 + open * 6), sy + 4, 16 * sz, 11 * sz, dd * 0.4, 0, TAU); g.fill(); g.stroke(); }); }
            else { g.fillStyle = d < 1.5 && shoot === 0 ? "#e8e1cf" : kb; g.beginPath(); g.ellipse(sx, sy, 28 * sz, 18 * sz, shoot > 0 ? 0.6 * (1 - up) : 0, 0, TAU); g.fill(); g.stroke(); }
            // first true leaves
            if (open > 0) { leaf(cx, topY - 4, -Math.PI / 2 - 0.7, 70 * open, "#6fbf4a"); leaf(cx, topY - 4, -Math.PI / 2 + 0.7, 70 * open, "#6fbf4a"); }
            g.fillStyle = "#1b2740"; g.font = "700 22px 'Atkinson Hyperlegible'"; g.textAlign = "left"; g.fillText("Tag " + Math.round(d), 16, 34);
          };
          const ST = [[0, "Trockener Samen", "Hart und klein. Innen: zwei dicke Keimblätter mit Vorrat und ein winziger Keimling."], [1, "Quellung", "Der Samen saugt Wasser auf und wird dicker. Die Samenschale platzt."],
            [3, "Keimwurzel", "Zuerst wächst die Wurzel nach unten – immer nach unten, egal wie der Samen liegt."], [5, "Sprossachse", "Der Stängel schiebt sich als Haken durch die Erde."],
            [8, "Über der Erde", "Die Keimblätter kommen mit nach oben. Ihr Vorrat ernährt die junge Pflanze."], [10, "Erste Laubblätter", "Grüne Blätter öffnen sich. Jetzt macht die Pflanze mit Licht ihre Nahrung selbst."]];
          const nm = s.h("p", { class: "h2", style: { color: "var(--unit)" } }, ST[0][1]);
          const ds = P(s, ST[0][2]);
          const upd = v => { day = v; draw(); const st = ST.filter(x => x[0] <= v + 0.01).pop(); nm.textContent = st[1]; ds.textContent = st[2]; };
          const sl = s.slider({ label: "Zeit", min: 0, max: 12, step: 0.1, value: 0, fmt: v => "Tag " + Math.round(v), onInput: upd });
          upd(0);
          const photo = s.h("div", { class: "later" }, s.photo("bohne-keimung", { w: 520, h: 190, pos: "50% 60%", caption: "Bohnen in echt: vom Samen zum Keimling" }));
          s.add(cols(s, 520, canvas, stack(s, 12, s.h("div", { class: "stack", style: { gap: "6px", minHeight: "150px" } }, nm, ds), sl, photo)));
          s.show(canvas, "fade"); s.sfx.pop();
          s.step(async () => { s.sound("water-pour", { vol: 0.4, dur: 2 }); let last = -1; await s.tween({ from: 0, to: 12, dur: 7000, ease: "linear", update: v => { upd(v); sl.input.value = v; const n = Math.floor(v); if (n !== last) { last = n; s.sfx.tick(); } } }); sl.set(12); s.sfx.success(); });
          s.step(async () => { s.sound("camera-shutter"); await s.show(photo, "zoom"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Was braucht ein Samen zum Keimen?",
        say: "Ein Versuch mit fünf Gläsern. Nur wo Wasser, Wärme und Luft da sind, keimen die Bohnen. Licht brauchen sie dafür nicht.",
        build(s) {
          const sv = s.svg(1100, 330);
          const J = [
            ["Wasser, Wärme, Luft", "#eef6fb", true, "feucht"],
            ["ohne Wasser", "#fbf3e0", false, "trocken"],
            ["kalt: Kühlschrank", "#e3f0ff", false, "feucht"],
            ["unter Wasser: keine Luft", "#eef6fb", false, "voll"],
            ["im Dunkeln", "#3a3f4a", true, "feucht"],
          ];
          const res = [], sprouts = [];
          J.forEach(([t, bg, ok, wet], i) => {
            const x = 20 + i * 216, w = 180;
            sv.append(s.el("rect", { x: x - 10, y: 0, width: w + 20, height: 330, rx: 16, fill: bg }));
            sv.append(s.el("text", { x: x + w / 2, y: 30, "text-anchor": "middle", class: "lbl", style: { fontWeight: 700, fill: i === 4 ? "#fff" : "#1b2740", fontSize: "19px" }, text: t }));
            // jar
            sv.append(s.el("path", { d: `M${x + 30} 80 L${x + 30} 250 Q${x + 30} 266 ${x + 46} 266 L${x + w - 46} 266 Q${x + w - 30} 266 ${x + w - 30} 250 L${x + w - 30} 80`, fill: "rgba(255,255,255,.45)", stroke: "#8aa0b8", "stroke-width": 4 }));
            if (wet === "feucht") sv.append(s.el("rect", { x: x + 34, y: 226, width: w - 68, height: 36, fill: "#cfe8fb" }), s.el("rect", { x: x + 34, y: 214, width: w - 68, height: 14, fill: "#f4f0e6" }));
            if (wet === "trocken") sv.append(s.el("rect", { x: x + 34, y: 240, width: w - 68, height: 22, fill: "#f4f0e6" }));
            if (wet === "voll") sv.append(s.el("rect", { x: x + 34, y: 96, width: w - 68, height: 166, fill: "#9cc9ee", opacity: .8 }));
            if (i === 2) sv.append(s.el("text", { x: x + w / 2, y: 64, "text-anchor": "middle", "font-size": 26, text: "❄️" }));
            const by = wet === "voll" ? 246 : wet === "trocken" ? 232 : 206;
            [-1, 1].forEach(dd => sv.append(s.el("ellipse", { cx: x + w / 2 + dd * 26, cy: by, rx: 16, ry: 10, fill: "#efe0b8", stroke: "#8a6a3a", "stroke-width": 2 })));
            const sp = s.el("g", { class: "later" });
            if (ok) [-1, 1].forEach(dd => {
              const bx = x + w / 2 + dd * 26;
              const pale = i === 4;
              sp.append(s.el("path", { d: `M${bx} ${by - 6} Q${bx + dd * 6} ${by - 60} ${bx + dd * 2} ${pale ? by - 120 : by - 90}`, stroke: pale ? "#e8e08a" : "#6fbf4a", "stroke-width": 5, fill: "none", "stroke-linecap": "round" }),
                s.el("path", { d: `M${bx} ${by + 6} L${bx - dd * 4} ${by + 22}`, stroke: "#f4ead0", "stroke-width": 4, "stroke-linecap": "round" }),
                s.el("ellipse", { cx: bx + dd * 2 - 8, cy: (pale ? by - 120 : by - 90) - 4, rx: 10, ry: 6, fill: pale ? "#efe7a0" : "#6fbf4a", transform: `rotate(-30 ${bx + dd * 2 - 8} ${(pale ? by - 120 : by - 90) - 4})` }),
                s.el("ellipse", { cx: bx + dd * 2 + 8, cy: (pale ? by - 120 : by - 90) - 4, rx: 10, ry: 6, fill: pale ? "#efe7a0" : "#6fbf4a", transform: `rotate(30 ${bx + dd * 2 + 8} ${(pale ? by - 120 : by - 90) - 4})` }));
            });
            sv.append(sp); sprouts.push(sp);
            const r = s.el("text", { x: x + w / 2, y: 308, "text-anchor": "middle", "font-size": 26, "font-weight": 800, fill: ok ? (i === 4 ? "#b7f07a" : "#138a5a") : "#dc3b2a", class: "later", text: ok ? "✓ keimt" : "✗ keimt nicht" });
            sv.append(r); res.push(r);
          });
          const m = merk(s, "Zum Keimen braucht ein Samen <b>Wasser</b>, <b>Wärme</b> und <b>Luft</b> (Sauerstoff). <b>Licht</b> braucht er dafür nicht – erst die junge Pflanze.");
          const lf = life(s, "Im Dunkeln gekeimt", s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "14px", alignItems: "center" } }, s.photo("keimlinge-dunkel", { w: 170, h: 112, style: { flex: "none" } }),
            P(s, "Lang, dünn und gelb: Ohne Licht wird die junge Pflanze nicht grün.", "small")));
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%", justifyContent: "center" } }, sv, s.h("div", { class: "cols", style: { gridTemplateColumns: "1.25fr 1fr", gap: "18px" } }, m, lf)));
          s.show(sv, "fade"); s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); for (let i = 0; i < 5; i++) { if (J[i][2]) { s.sfx.note(i * 2, .25); await s.show(sprouts[i], "up"); } else s.sfx.error(); await s.show(res[i], "pop"); } });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Pflanzen machen ihre Nahrung",
        say: "Grüne Blätter machen mit Sonnenlicht aus Wasser und Kohlenstoffdioxid Zucker. Dabei entsteht Sauerstoff. Das heißt Fotosynthese.",
        build(s) {
          const W = 560, H = 540;
          const { canvas, g } = s.canvas(W, H);
          let on = [0, 0, 0, 0, 0];
          const LEAF = { x: 300, y: 250 };
          const drawLeaf = () => {
            g.fillStyle = "#6fbf4a"; g.strokeStyle = "#2f6d1f"; g.lineWidth = 4;
            g.beginPath(); g.moveTo(170, 300); g.bezierCurveTo(220, 150, 380, 130, 460, 180); g.bezierCurveTo(420, 300, 280, 360, 170, 300); g.fill(); g.stroke();
            g.lineWidth = 3; g.beginPath(); g.moveTo(170, 300); g.lineTo(450, 186); g.stroke();
            g.strokeStyle = "#3f8a2a"; g.lineWidth = 9; g.beginPath(); g.moveTo(170, 300); g.quadraticCurveTo(140, 400, 150, 530); g.stroke();
          };
          const lbl = (t, x, y, col) => { g.font = "700 21px 'Atkinson Hyperlegible'"; g.textAlign = "center"; g.lineWidth = 5; g.strokeStyle = "rgba(255,255,255,.9)"; g.strokeText(t, x, y); g.fillStyle = col; g.fillText(t, x, y); };
          s.loop(t => {
            g.fillStyle = "#eef6fb"; g.fillRect(0, 0, W, H);
            // sun
            g.fillStyle = "#ffcf3f"; g.beginPath(); g.arc(70, 70, 42, 0, TAU); g.fill();
            if (on[0]) { g.strokeStyle = "rgba(240,170,0,.8)"; g.lineWidth = 5; g.setLineDash([16, 12]); g.lineDashOffset = -t * 60; for (const [x, y] of [[250, 210], [320, 200], [380, 190]]) { g.beginPath(); g.moveTo(100, 100); g.lineTo(x, y); g.stroke(); } g.setLineDash([]); }
            drawLeaf();
            // water from below (up the stem)
            if (on[1]) for (let i = 0; i < 5; i++) { const f = (t * 0.35 + i / 5) % 1; const y = 530 - f * 230, x = 150 - Math.sin(f * 2) * 12 + f * 20; g.fillStyle = "#4b8fd8"; g.beginPath(); g.arc(x, y, 7, 0, TAU); g.fill(); }
            // CO2 from the air (left)
            if (on[2]) for (let i = 0; i < 4; i++) { const f = (t * 0.25 + i / 4) % 1; const x = 20 + f * 200, y = 290 - f * 20; g.fillStyle = "#5d6678"; g.beginPath(); g.arc(x, y, 9, 0, TAU); g.fill(); }
            // O2 out (right)
            if (on[3]) for (let i = 0; i < 4; i++) { const f = (t * 0.3 + i / 4) % 1; const x = 380 + f * 160, y = 220 - f * 120; g.fillStyle = "rgba(75,143,216,.25)"; g.strokeStyle = "#4b8fd8"; g.lineWidth = 2; g.beginPath(); g.arc(x, y, 10, 0, TAU); g.fill(); g.stroke(); }
            // sugar down the stem
            if (on[4]) for (let i = 0; i < 3; i++) { const f = (t * 0.25 + i / 3) % 1; const y = 320 + f * 200, x = 160 - f * 6; g.fillStyle = "#fff"; g.strokeStyle = "#c79a3a"; g.lineWidth = 2; g.fillRect(x + 12, y - 7, 14, 14); g.strokeRect(x + 12, y - 7, 14, 14); }
            if (on[0]) lbl("Licht", 150, 70, "#b07800");
            if (on[1]) lbl("Wasser (aus der Wurzel)", 300, 500, "#1d5bd0");
            if (on[2]) lbl("Kohlenstoffdioxid", 112, 252, "#3a3f4a");
            if (on[3]) lbl("Sauerstoff", 470, 80, "#1d5bd0");
            if (on[4]) lbl("Zucker", 260, 410, "#a0703a");
          });
          const eq = s.h("div", { class: "card later", style: { textAlign: "center", padding: "14px 16px" } },
            s.h("p", { class: "t", style: { fontWeight: 700 } }, "Wasser + Kohlenstoffdioxid"), s.h("p", { class: "t", style: { color: "#b07800", fontWeight: 700 } }, "— Licht, grünes Blatt →"), s.h("p", { class: "t", style: { fontWeight: 700 } }, "Zucker + Sauerstoff"));
          const m = merk(s, "Das heißt <b>Fotosynthese</b>. Pflanzen machen ihre Nahrung selbst.");
          const lf = life(s, "Im Alltag", P(s, "Den Sauerstoff atmest du ein. Die Kartoffel speichert den Zucker als Stärke.", "small"));
          const info = P(s, "Ein grünes Blatt ist eine kleine Fabrik.");
          s.add(cols(s, 560, canvas, stack(s, 14, info, eq, m, lf)));
          s.show(canvas, "fade"); s.sfx.pop();
          s.step(async () => { on[0] = 1; s.sfx.chord([0, 4, 7]); info.textContent = "Zutat: Sonnenlicht gibt die Energie."; await s.wait(300); });
          s.step(async () => { on[1] = 1; s.sound("tropfen", { vol: 0.5, dur: 1.5 }); await s.wait(200); on[2] = 1; s.sfx.whoosh(); info.textContent = "Zutaten: Wasser aus dem Boden, Kohlenstoffdioxid aus der Luft."; });
          s.step(async () => { on[3] = 1; on[4] = 1; s.sound("bubbles", { vol: 0.5 }); info.textContent = "Heraus kommen Zucker und Sauerstoff."; await s.show(eq, "pop"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Samen auf Reisen",
        say: "Pflanzen können nicht laufen. Darum reisen ihre Samen: mit dem Wind oder mit Tieren. Stelle den Wind ein und lass die Samen los.",
        build(s) {
          const W = 560, H = 440, GR = 410;
          const { canvas, g } = s.canvas(W, H);
          let wind = 50, objs = [], running = false;
          const reset = () => { objs = [
            { k: "Löwenzahn", x: 90, y: 110, vy: 22, f: 1.3, col: "#fff", tr: [] },
            { k: "Ahorn", x: 96, y: 140, vy: 60, f: 0.55, col: "#a77a3a", tr: [], spin: 0 },
            { k: "Kirsche", x: 80, y: 170, vy: 0, f: 0.05, col: "#c41e3a", tr: [], fall: true },
          ]; };
          reset();
          const draw = () => {
            g.fillStyle = "#e7f2fb"; g.fillRect(0, 0, W, H); g.fillStyle = "#8cbf6f"; g.fillRect(0, GR, W, H - GR);
            g.fillStyle = "#7a5230"; g.fillRect(40, 150, 26, GR - 150); g.fillStyle = "#5f9e3a"; g.beginPath(); g.arc(60, 120, 70, 0, TAU); g.fill();
            for (let i = 0; i < 6; i++) { g.strokeStyle = "rgba(75,143,216,.35)"; g.lineWidth = 2; const y = 60 + i * 55, off = (performance.now() / 1000 * wind * 2 + i * 70) % W; g.beginPath(); g.moveTo(off, y); g.lineTo(off + 30 + wind * 0.3, y); g.stroke(); }
            for (const o of objs) {
              g.strokeStyle = o.col === "#fff" ? "rgba(90,100,120,.4)" : o.col; g.globalAlpha = 0.4; g.lineWidth = 2; g.setLineDash([4, 6]); g.beginPath(); o.tr.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); g.setLineDash([]); g.globalAlpha = 1;
              g.save(); g.translate(o.x, o.y);
              if (o.k === "Löwenzahn") { g.strokeStyle = "#8a93a6"; g.lineWidth = 1.5; for (let a = -1.2; a <= 1.21; a += 0.3) { g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.sin(a) * 16, -Math.cos(a) * 16); g.stroke(); } g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 14); g.stroke(); g.fillStyle = "#7a5230"; g.fillRect(-2, 14, 4, 8); }
              if (o.k === "Ahorn") { g.rotate(o.spin); g.fillStyle = "#c79a3a"; g.beginPath(); g.ellipse(14, 0, 16, 6, 0.2, 0, TAU); g.fill(); g.fillStyle = "#7a5230"; g.beginPath(); g.arc(0, 0, 5, 0, TAU); g.fill(); }
              if (o.k === "Kirsche") { g.fillStyle = o.col; g.beginPath(); g.arc(0, 0, 10, 0, TAU); g.fill(); g.strokeStyle = "#3f8a2a"; g.lineWidth = 2; g.beginPath(); g.moveTo(0, -9); g.lineTo(4, -20); g.stroke(); }
              g.restore();
            }
            g.font = "700 19px 'Atkinson Hyperlegible'"; g.textAlign = "left";
            objs.forEach((o, i) => { if (o.done) { g.fillStyle = "#1b2740"; g.fillText(o.k + ": " + (o.x > W - 10 ? "weit weg →" : Math.round((o.x - 70) / 10) + " m"), 330, 30 + i * 26); } });
          };
          s.loop((t, dt) => {
            if (running) {
              const d = Math.min(dt || 0.016, 0.05);
              let all = true;
              for (const o of objs) {
                if (o.done) continue; all = false;
                if (o.fall) o.vy += 600 * d;
                o.x += wind * o.f * d * 1.4 + (o.k === "Löwenzahn" ? Math.sin(performance.now() / 300) * 8 * d : 0);
                o.y += o.vy * d; if (o.spin != null) o.spin += 14 * d;
                o.tr.push([o.x, o.y]);
                if (o.y >= GR - 6 || o.x > W + 20) { o.y = Math.min(o.y, GR - 6); o.done = true; if (o.k === "Kirsche") s.sfx.drum(); else s.sfx.tick(); }
              }
              if (all) running = false;
            }
            draw();
          });
          const go = () => { reset(); running = true; s.sound("wind", { vol: 0.4, dur: 3 }); };
          const sl = s.slider({ label: "Wind", min: 0, max: 100, value: 50, fmt: v => v < 10 ? "still" : v < 60 ? "Brise" : "stürmisch", onInput: v => { wind = v; } });
          const btn = s.h("button", { class: "btn solid", onclick: go }, "Samen loslassen");
          const card = (id, cap, t, pos) => s.h("div", { class: "stack later", style: { gap: "6px", width: "228px" } }, s.photo(id, { w: 228, h: 128, pos, caption: cap }), P(s, t, "small"));
          const cards = [card("pusteblume", "Löwenzahn", "Schirmchen segeln mit dem Wind.", "50% 40%"), card("ahornfruechte", "Ahorn", "Propeller drehen sich und gleiten.", "50% 50%"),
            card("klette", "Klette", "Häkchen bleiben im Fell hängen.", "50% 40%"), card("star-kirsche", "Kirsche", "Vögel fressen sie und tragen den Kern fort.", "50% 45%")];
          s.add(cols(s, 560, stack(s, 10, canvas, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "14px", alignItems: "center" } }, s.h("div", { style: { flex: "1" } }, sl), btn)),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "228px 228px", gap: "14px 16px", justifyContent: "center" } }, ...cards)));
          s.show(canvas, "fade"); s.sfx.pop();
          s.step(async () => { go(); s.sfx.pop(); await s.show(cards[0], "up"); await s.show(cards[1], "up"); });
          s.step(async () => { s.sfx.snap(); await s.show(cards[2], "up"); s.say("Die Klette war das Vorbild für den Klettverschluss."); });
          s.step(async () => { s.sound("birds", { vol: 0.4, dur: 3 }); await s.show(cards[3], "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Wirbeltiere und Wirbellose",
        say: "Wirbeltiere haben innen eine Wirbelsäule aus Knochen. Wirbellose haben keine. Zu ihnen gehören die Insekten mit sechs Beinen.",
        build(s) {
          const sv = s.svg(600, 560);
          sv.append(s.el("rect", { x: 0, y: 0, width: 600, height: 250, rx: 16, fill: "#eef6fb" }), s.el("rect", { x: 0, y: 270, width: 600, height: 290, rx: 16, fill: "#f6f3ea" }));
          // fish with skeleton
          const fish = s.el("g", null, s.el("path", { d: "M90 125 Q200 40 360 110 L440 60 L420 125 L440 190 L360 140 Q200 210 90 125 Z", fill: "#cfe2f3", stroke: "#4b8fd8", "stroke-width": 3 }), s.el("circle", { cx: 130, cy: 112, r: 7, fill: "#1b2740" }));
          const spine = s.el("g", { class: "later" }, s.el("line", { x1: 150, y1: 125, x2: 410, y2: 125, stroke: "#dc3b2a", "stroke-width": 7, "stroke-linecap": "round" }),
            ...Array.from({ length: 12 }, (_, i) => s.el("rect", { x: 156 + i * 21, y: 118, width: 14, height: 14, rx: 3, fill: "#fff", stroke: "#dc3b2a", "stroke-width": 2.5 })),
            ...Array.from({ length: 7 }, (_, i) => s.el("path", { d: `M${170 + i * 22} 125 q -8 -30 0 -50 M${170 + i * 22} 125 q -8 30 0 50`, stroke: "#8a93a6", "stroke-width": 2.5, fill: "none" })));
          sv.append(fish, spine, txt(s, 300, 232, "Wirbelsäule: innen, aus Knochen", "middle", { style: { fill: "#dc3b2a", fontWeight: 700 } }));
          sv.lastChild.setAttribute("class", "lbl later");
          const spineLbl = sv.lastChild;
          sv.append(s.el("text", { x: 20, y: 34, class: "lbl", style: { fontWeight: 700 }, text: "Wirbeltier: Fisch" }));
          // insect
          const ins = s.el("g", null);
          const IY = 420;
          [[-1, 0], [0, 0], [1, 0]].forEach(([i]) => [-1, 1].forEach(d => ins.append(s.el("path", { d: `M${300 + i * 22} ${IY} L${300 + i * 40} ${IY + d * 55} L${300 + i * 62} ${IY + d * 80}`, stroke: "#5a1f0a", "stroke-width": 5, fill: "none", "stroke-linecap": "round" }))));
          const head = s.el("ellipse", { cx: 200, cy: IY, rx: 34, ry: 30, fill: "#8a3a1a" });
          const brust = s.el("ellipse", { cx: 300, cy: IY, rx: 52, ry: 32, fill: "#a24a20" });
          const bauch = s.el("ellipse", { cx: 440, cy: IY, rx: 84, ry: 46, fill: "#7a2e12" });
          ins.append(bauch, brust, head, s.el("path", { d: `M180 ${IY - 24} Q150 ${IY - 70} 120 ${IY - 76} M196 ${IY - 28} Q180 ${IY - 80} 156 ${IY - 96}`, stroke: "#5a1f0a", "stroke-width": 4, fill: "none" }));
          sv.append(ins, s.el("text", { x: 20, y: 304, class: "lbl", style: { fontWeight: 700 }, text: "Wirbellos: Insekt" }));
          const ilab = [["Kopf", 200, IY + 8], ["Brust", 300, IY + 8], ["Hinterleib", 440, IY + 8]].map(([t, x, y]) => { const e = s.el("text", { x, y, "text-anchor": "middle", class: "lbl later", style: { fill: "#fff", fontWeight: 700 }, text: t }); sv.append(e); return e; });
          const legs = txt(s, 300, 540, "6 Beine – alle an der Brust", "middle"); sv.append(legs);
          const m = merk(s, "<b>Wirbeltiere</b> haben eine Wirbelsäule. <b>Wirbellose</b> nicht: Insekten, Spinnen, Schnecken, Würmer …");
          const fact = exb(s, "Wusstest du?", P(s, "Über <b>95 %</b> aller Tierarten sind Wirbellose. Wirbeltiere sind nur ein kleiner Teil.", "small"));
          const spider = exb(s, "Insekt oder nicht?", s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "14px", alignItems: "center" } }, s.photo("marienkaefer", { w: 150, h: 104, style: { flex: "none" } }),
            P(s, "Marienkäfer: 6 Beine, 3 Teile – ein Insekt. Spinne: 8 Beine, 2 Teile – kein Insekt.", "small")));
          s.add(cols(s, 600, sv, stack(s, 14, m, fact, spider)));
          s.show(sv, "fade"); s.sfx.pop();
          s.step(async () => { s.sfx.zap(); await s.show(spine, "fade"); s.show(spineLbl, "fade"); s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { for (const l of ilab) { s.sfx.pop(); await s.show(l, "pop"); } s.sfx.scribble(); await s.show(legs, "fade"); });
          s.step(async () => { s.sfx.pop(); await s.show(fact, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(spider, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Die fünf Wirbeltierklassen",
        say: "Es gibt fünf Klassen von Wirbeltieren: Fische, Amphibien, Reptilien, Vögel und Säugetiere.",
        build(s) {
          const C = [
            ["bachforelle", "Fische", "Bachforelle", "Schuppen, Flossen, Kiemen", "22% 50%"],
            ["grasfrosch", "Amphibien", "Grasfrosch", "nackte, feuchte Haut", "50% 50%"],
            ["zauneidechse", "Reptilien", "Zauneidechse", "trockene Hornschuppen", "40% 50%"],
            ["spatz", "Vögel", "Haussperling", "Federn und Schnabel", "50% 40%"],
            ["igel", "Säugetiere", "Igel", "Haare, trinkt Muttermilch", "50% 50%"],
          ];
          const cards = C.map(([id, cls, sp, f, pos], i) => s.h("div", { class: "stack" + (i ? " later" : ""), style: { gap: "6px", width: "200px" } },
            s.photo(id, { w: 200, h: 220, pos, caption: cls }), s.h("p", { class: "t", style: { fontWeight: 700 } }, sp), P(s, f, "small")));
          const btns = s.h("div", { class: "row later", style: { gap: "14px", flexWrap: "nowrap", justifyContent: "center" } }, s.soundBtn("frosch-quaken", "Frösche"), s.soundBtn("spatzen", "Spatzen"));
          const m = merk(s, "Alle Wirbeltiere haben eine Wirbelsäule – aber sie sehen sehr verschieden aus.", true, 21);
          s.add(s.h("div", { class: "stack", style: { gap: "16px", height: "100%", justifyContent: "center" } },
            s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "20px", justifyContent: "center", alignItems: "flex-start" } }, ...cards),
            s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "18px", alignItems: "center" } }, m, btns)));
          s.show(cards[0], "zoom"); s.sound("splash", { vol: 0.5 });
          s.step(async () => { s.sound("frosch-quaken", { vol: 0.6, dur: 2.5 }); await s.show(cards[1], "zoom"); });
          s.step(async () => { s.sfx.swoosh(); await s.show(cards[2], "zoom"); s.say("Die Zauneidechse lebt auch in Berlin, zum Beispiel an sonnigen Bahndämmen."); });
          s.step(async () => { s.sound("spatzen", { vol: 0.5, dur: 2.5 }); await s.show(cards[3], "zoom"); });
          s.step(async () => { s.sfx.pop(); await s.show(cards[4], "zoom"); s.sfx.ding(); s.show(m, "up"); await s.show(btns, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Steckbriefe im Vergleich",
        say: "Die fünf Klassen unterscheiden sich in Körperbedeckung, Atmung, Fortpflanzung und Körpertemperatur.",
        build(s) {
          const H = ["Fische", "Amphibien", "Reptilien", "Vögel", "Säugetiere"];
          const R = [
            ["Körper­bedeckung", ["Schuppen mit Schleim", "nackte, feuchte Haut", "trockene Horn­schuppen", "Federn", "Haare, Fell"]],
            ["Atmung", ["Kiemen", "Larve: Kiemen, später Lunge und Haut", "Lunge", "Lunge", "Lunge"]],
            ["Fort­pflanzung", ["Laich im Wasser", "Laich im Wasser, daraus Kaulquappen", "Eier mit weicher Schale, an Land", "Eier mit Kalkschale, werden bebrütet", "lebende Junge, trinken Milch"]],
            ["Körper­temperatur", ["wechselwarm", "wechselwarm", "wechselwarm", "gleichwarm", "gleichwarm"]],
          ];
          const td = (t, i) => s.h("td", { class: "later", style: { padding: "8px 10px", fontSize: "19px", lineHeight: "1.25", textAlign: "center", borderLeft: "2px solid var(--line)", background: R && t === "gleichwarm" ? "#fde7d9" : t === "wechselwarm" ? "#e3f0ff" : "" } }, t);
          const rows = R.map(([n, v]) => { const cs = v.map(td); return { cs, tr: s.h("tr", { style: { borderTop: "2px solid var(--line)" } }, s.h("th", { style: { padding: "8px 12px", textAlign: "left", fontSize: "21px", width: "150px", color: "var(--unit)" } }, n), ...cs) }; });
          const table = s.h("table", { style: { borderCollapse: "collapse", background: "#fff", border: "2px solid var(--line)", width: "1060px", tableLayout: "fixed" } },
            s.h("tr", null, s.h("th", { style: { width: "150px" } }, ""), ...H.map(h => s.h("th", { class: "t", style: { padding: "10px 6px", fontWeight: 800, borderLeft: "2px solid var(--line)" } }, h))), ...rows.map(r => r.tr));
          const m = merk(s, "<b>Gleichwarm</b>: Der Körper ist immer etwa gleich warm. <b>Wechselwarm</b>: Der Körper ist so warm wie die Umgebung.", true, 21);
          s.add(s.h("div", { class: "stack", style: { gap: "16px", height: "100%", justifyContent: "center", alignItems: "center" } }, table, m));
          s.show(table, "fade"); s.sfx.pop();
          rows.forEach((r, i) => s.step(async () => { for (const c of r.cs) { s.sfx.note(i * 2, .12); await s.show(c, "pop"); await s.wait(60); } if (i === rows.length - 1) { s.sfx.ding(); await s.show(m, "up"); } }));
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Gleichwarm und wechselwarm",
        say: "Ziehe am Regler. Die Eidechse wird so warm oder kalt wie die Luft. Der Hund bleibt immer etwa gleich warm.",
        build(s) {
          let T = 20;
          const therm = () => {
            const sv = s.svg(96, 270);
            sv.append(s.el("rect", { x: 28, y: 12, width: 24, height: 210, rx: 12, fill: "#fff", stroke: "#1b2740", "stroke-width": 3 }), s.el("circle", { cx: 40, cy: 236, r: 22, fill: "#dc3b2a", stroke: "#1b2740", "stroke-width": 3 }));
            const col = s.el("rect", { x: 33, y: 100, width: 14, height: 130, fill: "#dc3b2a" });
            sv.append(col);
            [0, 10, 20, 30, 40].forEach(v => { const y = 214 - v * 4.8; sv.append(s.el("line", { x1: 52, y1: y, x2: 62, y2: y, stroke: "#1b2740", "stroke-width": 2 }), s.el("text", { x: 64, y: y + 6, class: "lbl", style: { fontSize: "19px" }, text: v })); });
            return { sv, set: v => { const y = 214 - clamp(v, -2, 42) * 4.8; col.setAttribute("y", y); col.setAttribute("height", 236 - y); } };
          };
          const tl = therm(), th = therm();
          const val = () => s.h("p", { class: "t", style: { color: "var(--unit)", fontWeight: 800, fontSize: "26px" } }, "");
          const vL = val(), vH = val();
          const sL = P(s, "", "small"), sH = P(s, "", "small");
          const bar = s.h("div", { style: { height: "20px", borderRadius: "10px", background: "var(--unit-soft)", overflow: "hidden" } }, s.h("div", { style: { height: "100%", width: "50%", background: "var(--unit)", borderRadius: "10px" } }));
          const barH = s.h("div", { style: { height: "20px", borderRadius: "10px", background: "var(--unit-soft)", overflow: "hidden" } }, s.h("div", { style: { height: "100%", width: "90%", background: "var(--unit)", borderRadius: "10px" } }));
          const panel = (id, name, kind, th2, v, st, b, pos) => s.h("div", { class: "card", style: { display: "grid", gridTemplateColumns: "260px 96px", gap: "12px", padding: "14px 16px" } },
            s.h("div", { class: "stack", style: { gap: "8px" } }, s.photo(id, { w: 260, h: 170, pos, caption: name }), s.h("p", { class: "small", style: { fontWeight: 700, color: "var(--pencil)" } }, kind), v, s.h("p", { class: "small" }, "Beweglichkeit:"), b, st), th2.sv);
          const upd = v => {
            T = v; const body = v; tl.set(body); th.set(38.5);
            vL.textContent = "Körper: " + Math.round(body) + " °C"; vH.textContent = "Körper: etwa 38 °C";
            const act = clamp((body - 5) / 25, 0, 1); bar.firstChild.style.width = Math.round(act * 100) + "%";
            sL.textContent = body < 6 ? "Kältestarre: Sie kann sich nicht bewegen." : body < 18 ? "Langsam. Sie wärmt sich in der Sonne auf." : "Flink und aktiv!";
            sH.textContent = v < 5 ? "Er frisst mehr, um warm zu bleiben." : v > 26 ? "Er hechelt, um sich zu kühlen." : "Er fühlt sich wohl.";
          };
          const sl = s.slider({ label: "Lufttemperatur", min: 0, max: 35, value: 20, fmt: v => v + " °C", onInput: upd });
          upd(20);
          const pL = panel("zauneidechse", "Zauneidechse", "Reptil · wechselwarm", tl, vL, sL, bar, "40% 50%");
          const pH = panel("hund-hechelt", "Hund", "Säugetier · gleichwarm", th, vH, sH, barH, "50% 40%");
          s.add(s.h("div", { class: "stack", style: { gap: "16px", height: "100%", justifyContent: "center" } }, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "20px", justifyContent: "center", alignItems: "stretch" } }, pL, pH), sl));
          s.show([pL, pH], "up"); s.sfx.pop();
          const run = async (a, b) => { let last = -1; await s.tween({ from: a, to: b, dur: 2400, ease: "inOut", update: v => { upd(v); sl.input.value = v; const n = Math.round(v / 5); if (n !== last) { last = n; s.sfx.tick(); } } }); sl.set(Math.round(b)); };
          s.step(async () => { s.sfx.whoosh(); await run(20, 2); s.say("Bei Kälte erstarrt die Eidechse. Der Hund bleibt warm."); });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await run(2, 32); s.say("Bei Hitze ist die Eidechse flink. Der Hund hechelt."); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Angepasst an den Lebensraum",
        say: "Der Körperbau jedes Tieres passt zu seinem Lebensraum. Das nennt man Angepasstheit.",
        build(s) {
          const C = [
            ["maulwurf-hand", "Maulwurf · unter der Erde", "Breite <b>Schaufelhände</b> zum Graben. Winzige Augen. Sein Fell hat keinen Strich – vorwärts und rückwärts geht es leicht durch den Gang.", "50% 60%", "scribble"],
            ["bachforelle", "Fisch · im Wasser", "<b>Stromlinienform</b> und Flossen zum Schwimmen. <b>Kiemen</b> holen Sauerstoff aus dem Wasser.", "25% 50%", "splash"],
            ["eule", "Vogel · in der Luft", "<b>Federn</b> und Flügel. Viele Knochen sind <b>hohl</b> und mit Luft gefüllt – das macht leicht.", "50% 35%", "swoosh"],
            ["eichhoernchen", "Eichhörnchen · im Baum", "Spitze <b>Krallen</b> zum Klettern. Der buschige <b>Schwanz</b> hilft beim Balancieren und Steuern im Sprung.", "50% 40%", "boing"],
          ];
          const cards = C.map(([id, head, t, pos]) => s.h("div", { class: "card later", style: { display: "grid", gridTemplateColumns: "190px 1fr", gap: "14px", padding: "12px 14px", alignItems: "center" } },
            s.photo(id, { w: 190, h: 190, pos }), s.h("div", { class: "stack", style: { gap: "6px" } }, s.h("p", { class: "t", style: { fontWeight: 700, color: "var(--unit)", fontSize: "22px" } }, head), P(s, t, "small"))));
          const m = merk(s, "<b>Angepasstheit</b>: Der Körperbau passt zum Lebensraum.", true, 21);
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%", justifyContent: "center" } }, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px" } }, ...cards), m));
          s.sfx.pop();
          C.forEach(([, , , , snd], i) => s.step(async () => {
            if (snd === "splash") s.sound("splash", { vol: 0.5 }); else if (snd === "scribble") s.sound("footsteps", { vol: 0.4, dur: 1.5 }); else s.sfx[snd]();
            await s.show(cards[i], "up"); if (i === 3) { s.sfx.ding(); await s.show(m, "up"); }
          }));
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Wie Tiere den Winter überstehen",
        say: "Im Winter gibt es wenig Futter. Tiere überstehen ihn auf drei Arten: Winterschlaf, Winterruhe und Winterstarre.",
        build(s) {
          const C = [
            ["igel", "Winterschlaf", "Igel, Fledermaus", "Schlafen tief und leben von ihrem Fett. Der Körper kühlt stark ab.", "50% 50%"],
            ["eichhoernchen", "Winterruhe", "Eichhörnchen, Dachs", "Schlafen viel, wachen oft auf und fressen Vorräte. Ihre Körpertemperatur bleibt.", "50% 35%"],
            ["grasfrosch", "Winterstarre", "Frosch, Eidechse", "Wechselwarm: Sie werden so kalt wie die Umgebung und erstarren, bis es wärmer wird.", "50% 50%"],
          ];
          const cards = C.map(([id, n, who, t, pos]) => s.h("div", { class: "card later stack", style: { gap: "6px", padding: "12px 14px", width: "340px" } },
            s.photo(id, { w: 312, h: 150, pos, caption: who }), s.h("p", { class: "h2", style: { color: "var(--unit)" } }, n), P(s, t, "small")));
          // hedgehog heart: summer vs hibernation
          const heart = (col) => { const sv = s.svg(70, 64); const p = s.el("path", { d: "M35 58 C 5 36, 2 14, 18 8 C 28 4, 35 14, 35 18 C 35 14, 42 4, 52 8 C 68 14, 65 36, 35 58 Z", fill: col }); sv.append(p); return { sv, p }; };
          const h1 = heart("#dc3b2a"), h2 = heart("#4b8fd8");
          const c1 = s.h("span", { class: "h2 mono" }, "0"), c2 = s.h("span", { class: "h2 mono" }, "0");
          let tStart = null, n1 = 0, n2 = 0, now = 0;
          s.loop(t => {
            now = t;
            if (tStart == null) return;
            const e = t - tStart;
            const b1 = Math.floor(e * 200 / 60), b2 = Math.floor(e * 5 / 60);
            if (b1 !== n1) { n1 = b1; c1.textContent = String(Math.min(n1, 200)); }
            if (b2 !== n2) { n2 = b2; c2.textContent = String(n2); s.sfx.drum(); }
            const ph1 = (e * 200 / 60) % 1, ph2 = (e * 5 / 60) % 1;
            h1.p.setAttribute("transform", `translate(35 33) scale(${1 + 0.15 * Math.max(0, 1 - ph1 * 4)}) translate(-35 -33)`);
            h2.p.setAttribute("transform", `translate(35 33) scale(${1 + 0.15 * Math.max(0, 1 - ph2 * 4)}) translate(-35 -33)`);
            if (e > 60) { tStart = null; }
          });
          const start = () => { tStart = null; n1 = n2 = 0; c1.textContent = c2.textContent = "0"; s.sound("heartbeat", { vol: 0.5, dur: 3 }); tStart = now; };
          const strip = s.h("div", { class: "ex later", style: { display: "grid", gridTemplateColumns: "1fr auto", gap: "16px", alignItems: "center", padding: "12px 18px" } },
            s.h("div", { class: "stack", style: { gap: "6px" } }, s.h("span", { class: "exlabel" }, "Igel-Herz (Herzschläge pro Minute)"),
              s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "14px", alignItems: "center" } }, h1.sv, s.h("span", { class: "small" }, "Sommer: etwa 200"), c1, s.h("span", { style: { width: "18px" } }), h2.sv, s.h("span", { class: "small" }, "Winterschlaf: etwa 5"), c2),
              P(s, "Im Winterschlaf sinkt die Körpertemperatur von 36 °C auf 1 bis 8 °C.", "small")),
            s.h("button", { class: "btn solid", onclick: start }, "Herzen starten"));
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%", justifyContent: "center" } }, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "16px", justifyContent: "center", alignItems: "stretch" } }, ...cards), strip));
          s.sfx.pop();
          s.step(async () => { s.sfx.note(-5, .4); await s.show(cards[0], "up"); });
          s.step(async () => { s.sfx.boing(); await s.show(cards[1], "up"); });
          s.step(async () => { s.sound("frosch-quaken", { vol: 0.4, dur: 1.5 }); await s.show(cards[2], "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(strip, "up"); start(); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Vom Wolf zum Hund",
        say: "Alle Hunde stammen vom Wolf ab. Menschen haben Wölfe schon vor mindestens fünfzehntausend Jahren gezähmt.",
        build(s) {
          const wolf = s.h("div", { class: "stack", style: { gap: "8px", width: "260px" } }, s.photo("wolf", { w: 260, h: 300, pos: "50% 35%", caption: "Wolf · Wildtier" }), s.soundBtn("wolf-heulen", "Wolf heult"));
          const dog = s.h("div", { class: "stack later", style: { gap: "8px", width: "260px" } }, s.photo("hund-hechelt", { w: 260, h: 300, pos: "50% 40%", caption: "Hund · Haustier" }), s.soundBtn("hund-bellen", "Hund bellt"));
          const arrow = s.h("div", { class: "stack later", style: { gap: "4px", alignItems: "center", width: "120px", textAlign: "center" } }, s.h("span", { class: "big", style: { color: "var(--unit)" } }, "→"), s.h("span", { class: "small", style: { fontWeight: 700 } }, "seit mind. 15.000 Jahren"));
          const t1 = exb(s, "Haustiere", P(s, "Leben bei uns im Haus: Hund, Katze, Meerschweinchen, Wellensittich.", "small"));
          const t2 = exb(s, "Nutztiere", s.h("div", { class: "stack", style: { gap: "8px" } }, P(s, "Geben uns Milch, Eier, Wolle oder Fleisch: Kuh, Huhn, Schaf, Schwein.", "small"),
            s.h("div", { class: "row", style: { gap: "10px" } }, s.soundBtn("kuh-muht", "Kuh"), s.soundBtn("huhn-gackert", "Huhn"))));
          const m = merk(s, "Haus- und Nutztiere stammen von <b>Wildtieren</b> ab: Hund vom Wolf, Hausschwein vom Wildschwein.", true, 21);
          s.add(cols(s, 680, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "10px", alignItems: "center", justifyContent: "center" } }, wolf, arrow, dog), stack(s, 12, t1, t2, m), 20));
          s.show(wolf, "zoom"); s.sound("wolf-heulen", { vol: 0.5 });
          s.step(async () => { s.sfx.whoosh(); await s.show(arrow, "left"); s.sound("hund-bellen", { vol: 0.6 }); await s.show(dog, "zoom"); });
          s.step(async () => { s.sfx.pop(); await s.show(t1, "up"); });
          s.step(async () => { s.sound("kuh-muht", { vol: 0.5 }); await s.show(t2, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Wer frisst wen?",
        say: "In einer Nahrungskette zeigt der Pfeil: wird gefressen von. Jede Nahrungskette beginnt mit einer Pflanze.",
        build(s) {
          const node = (inner, name, role, cls = "later") => s.h("div", { class: "stack " + cls, style: { gap: "4px", width: "190px", alignItems: "center", textAlign: "center" } }, inner, s.h("p", { class: "t", style: { fontWeight: 700 } }, name), s.h("span", { class: "chip", style: { fontSize: "19px" } }, role));
          const tile = (emo, bg) => s.h("div", { style: { width: "190px", height: "130px", borderRadius: "16px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "64px", boxShadow: "0 0 0 2px var(--line)" } }, emo);
          const ar = () => s.h("div", { class: "stack later", style: { alignItems: "center", gap: "0", width: "84px" } }, s.h("span", { class: "big", style: { color: "var(--unit)", lineHeight: "1" } }, "→"));
          const chain1 = [node(tile("🌿", "#e2f2d5"), "Gras, Kräuter", "Erzeuger"), node(s.photo("feldhase", { w: 190, h: 130, pos: "50% 50%" }), "Feldhase", "Verbraucher"), node(s.photo("rotfuchs", { w: 190, h: 130, pos: "50% 40%" }), "Fuchs", "Verbraucher")];
          const chain2 = [node(tile("🍃", "#e2f2d5"), "Blätter", "Erzeuger"), node(tile("🐛", "#f6f3ea"), "Raupe", "Verbraucher"), node(s.photo("spatz", { w: 190, h: 130, pos: "50% 45%" }), "Spatz", "Verbraucher")];
          const a1 = [ar(), ar()], a2 = [ar(), ar()];
          const rowOf = (lab, ch, ars) => s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "6px", alignItems: "center" } }, s.h("span", { class: "chip", style: { width: "120px", justifyContent: "center", fontSize: "19px" } }, lab), ch[0], ars[0], ch[1], ars[1], ch[2]);
          const key = s.h("p", { class: "small", style: { color: "var(--pencil)" } }, "→ bedeutet: „wird gefressen von“");
          const m = merk(s, "Jede Nahrungskette beginnt mit <b>Pflanzen</b>: Sie sind die <b>Erzeuger</b>. Tiere sind <b>Verbraucher</b>.", true, 21);
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%", justifyContent: "center" } }, rowOf("Wiese", chain1, a1), rowOf("Garten", chain2, a2), key, m));
          s.sfx.pop();
          const run = async (ch, ars) => { for (let i = 0; i < 3; i++) { s.sfx.note(i * 3, .2); await s.show(ch[i], "pop"); if (i < 2) { s.sfx.swoosh(); await s.show(ars[i], "left"); } } };
          s.step(async () => { await run(chain1, a1); });
          s.step(async () => { await run(chain2, a2); s.sound("spatzen", { vol: 0.4, dur: 2 }); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 17 --------------------------------------------------------------- */
      {
        title: "Bestimmen mit einem Schlüssel",
        say: "Mit einem Bestimmungsschlüssel findest du heraus, zu welcher Klasse ein Tier gehört. Tippe auf ein Tier und folge dem Weg.",
        build(s) {
          const sv = s.svg(640, 590);
          const Q = ["Hat es Federn?", "Hat es Haare oder Fell?", "Hat es Kiemen und Flossen?", "Hat es trockene Hornschuppen?"];
          const A = ["Vogel", "Säugetier", "Fisch", "Reptil"];
          const qY = i => 50 + i * 125;
          const qs = [], yes = [], ans = [], no = [];
          Q.forEach((q, i) => {
            const y = qY(i);
            const box = s.el("rect", { x: 10, y: y - 30, width: 330, height: 56, rx: 14, fill: "#fff", stroke: "#8a93a6", "stroke-width": 3 });
            const t = s.el("text", { x: 175, y: y + 7, "text-anchor": "middle", class: "lbl", style: { fontWeight: 700 }, text: q });
            const yl = s.el("line", { x1: 340, y1: y - 2, x2: 448, y2: y - 2, stroke: "#8a93a6", "stroke-width": 4 });
            const yt = s.el("text", { x: 394, y: y - 12, "text-anchor": "middle", class: "lbl", style: { fontSize: "19px" }, text: "ja" });
            const ab = s.el("rect", { x: 450, y: y - 28, width: 180, height: 52, rx: 26, fill: "#eef6dc", stroke: UC, "stroke-width": 3 });
            const at = s.el("text", { x: 540, y: y + 7, "text-anchor": "middle", class: "lbl", style: { fontWeight: 700 }, text: A[i] });
            const nl = s.el("line", { x1: 175, y1: y + 26, x2: 175, y2: y + 95, stroke: "#8a93a6", "stroke-width": 4 });
            const nt = s.el("text", { x: 190, y: y + 66, class: "lbl", style: { fontSize: "19px" }, text: "nein" });
            sv.append(yl, nl, box, t, yt, nt, ab, at);
            qs.push(box); yes.push(yl); ans.push([ab, at]); no.push(nl);
          });
          const ly = qY(4) - 10;
          const lastB = s.el("rect", { x: 30, y: ly - 26, width: 290, height: 52, rx: 26, fill: "#eef6dc", stroke: UC, "stroke-width": 3 });
          const lastT = s.el("text", { x: 175, y: ly + 7, "text-anchor": "middle", class: "lbl", style: { fontWeight: 700 }, text: "Amphibie (feuchte Haut)" });
          sv.append(lastB, lastT);
          const ANS = [...ans.map(a => a[0]), lastB];
          const reset = () => { qs.forEach(b => { b.setAttribute("stroke", "#8a93a6"); b.setAttribute("fill", "#fff"); }); [...yes, ...no].forEach(l => l.setAttribute("stroke", "#8a93a6")); ANS.forEach(b => { b.setAttribute("fill", "#eef6dc"); }); };
          let busy = false;
          const walk = async (target, name) => {
            if (busy) return; busy = true; reset(); res.textContent = name + " …"; s.sfx.click();
            for (let i = 0; i < 4; i++) {
              qs[i].setAttribute("stroke", UC); qs[i].setAttribute("fill", "#fffbe0"); s.sfx.tick(); await s.wait(450);
              if (i === target) { yes[i].setAttribute("stroke", UC); s.sfx.pop(); await s.wait(250); ANS[i].setAttribute("fill", "#ffd94a"); break; }
              no[i].setAttribute("stroke", "#dc3b2a"); await s.wait(250);
            }
            if (target === 4) { ANS[4].setAttribute("fill", "#ffd94a"); }
            s.sfx.ding(); res.textContent = name + " ist ein" + (target === 4 ? "e Amphibie" : target === 1 ? " Säugetier" : target === 3 ? " Reptil" : target === 2 ? " Fisch" : " Vogel") + "."; busy = false;
          };
          const T = [["spatz", "Spatz", 0, "50% 40%"], ["igel", "Igel", 1, "50% 50%"], ["bachforelle", "Forelle", 2, "50% 50%"], ["zauneidechse", "Eidechse", 3, "40% 50%"], ["grasfrosch", "Frosch", 4, "50% 50%"]];
          const tiles = T.map(([id, n, k, pos]) => s.h("button", { class: "btn", style: { flexDirection: "column", padding: "6px", height: "auto", gap: "4px" }, onclick: () => walk(k, n) }, s.photo(id, { w: 120, h: 84, pos, credit: false }), s.h("span", null, n)));
          const res = s.h("p", { class: "h2", style: { color: "var(--unit)", minHeight: "44px" } }, "Tippe auf ein Tier");
          const lf = life(s, "So arbeiten Forscher", P(s, "Für Bäume, Vögel oder Käfer gibt es eigene Schlüssel. Frage für Frage kommst du zum Namen.", "small"));
          s.add(cols(s, 640, sv, stack(s, 12, res, s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" } }, ...tiles), lf), 20));
          s.show(sv, "fade"); s.sfx.pop();
          s.step(async () => { await walk(0, "Spatz"); });
          s.step(async () => { await walk(4, "Frosch"); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 18 --------------------------------------------------------------- */
      {
        title: "Im Alltag: Natur in Berlin",
        say: "Berlin ist voller Natur: Füchse, Wildschweine, Spatzen, der Botanische Garten, der Tiergarten und viele Linden.",
        build(s) {
          const C = [
            ["rotfuchs", "Füchse", "Leben mitten in der Stadt: in Parks, Gärten, an Bahndämmen. Nicht füttern!", "50% 40%"],
            ["wildschweine-spandau", "Wildschweine", "Kommen aus dem Wald bis in Parks, wie hier in Spandau.", "50% 50%"],
            ["spatz", "Spatzen", "Berlin gilt als Hauptstadt der Spatzen. Zuletzt wurden es aber weniger.", "50% 40%"],
            ["botanischer-garten", "Botanischer Garten", "In Dahlem: 43 Hektar, rund 20.000 Pflanzenarten.", "50% 40%"],
            ["tiergarten-luft", "Großer Tiergarten", "210 Hektar Park mitten in Berlin.", "50% 50%"],
            ["strassenbaeume", "Straßenbäume", "Der häufigste Straßenbaum in Berlin ist die Linde.", "50% 50%"],
          ];
          const cards = C.map(([id, cap, t, pos]) => s.h("div", { class: "card later stack", style: { gap: "8px", padding: "10px 12px" } }, s.photo(id, { w: "100%", h: 170, pos, caption: cap }), P(s, t, "small")));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px 16px", height: "100%", alignContent: "center" } }, ...cards));
          s.sfx.pop();
          s.step(async () => { s.sfx.pop(); await s.show(cards[0], "up"); s.sound("wildschwein", { vol: 0.5, dur: 2.5 }); await s.show(cards[1], "up"); });
          s.step(async () => { s.sound("spatzen", { vol: 0.5, dur: 2.5 }); await s.show(cards[2], "up"); s.sfx.chord([0, 4, 7]); await s.show(cards[3], "up"); });
          s.step(async () => { s.sound("birds", { vol: 0.4, dur: 3 }); await s.show(cards[4], "up"); s.sfx.pop(); await s.show(cards[5], "up"); });
        },
      },
    ],
  });
})();
