/* Kapitel 11 – Medien: suchen, prüfen, hören, sehen (RLP Deutsch 5/6 „Mit Medien umgehen“)
   Teil 1: Was sind Medien? Medientagebuch
   Teil 2: Suchen (Suchbegriffe, Kindersuchmaschinen, Trefferliste mit Anzeige)
   Teil 3: Prüfen (Wer? Wann? Warum? – Lexikon, Werbung, Fanseite; Falschmeldung im Klassenchat; bearbeitetes Foto)
   Teil 4: Hören (Hörspiel: Stimmen, Geräusche, Musik; Geräuschemacher mit echten Aufnahmen; eigenes Hörspiel)
   Teil 5: Sehen (Einstellungsgrößen, Kameraperspektive, Storyboard, Schnitt/24 Bilder, Emil: Buch und Filme)
   Teil 6: Sicher und fair im Netz (Privatsphäre, Chat-Regeln, Recht am eigenen Bild, Urheberrecht)
   Alle Webseiten, Chats und Suchergebnisse sind selbst gezeichnete, ausgedachte Mock-ups (keine echten Marken). */
(() => {
  const P = { blue: "#1d5bd0", red: "#dc3b2a", green: "#138a5a", violet: "#7b4fd6", orange: "#ee7a1a", ink: "#1b2740", pencil: "#5d6678", yellow: "#ffd94a", line: "#c8d3de", unit: "#4338ca", soft: "#e7e7fb", teal: "#0e7490", skin: "#f3c9a0", hair: "#6b3f1f", sky: "#dff0ff" };
  const CSS = `
.u11num{width:38px;height:38px;border-radius:50%;display:inline-grid;place-items:center;font:700 20px/1 var(--f-display);color:#fff;background:#4338ca;flex:none}
.u11chip{display:inline-flex;align-items:center;padding:5px 12px;border-radius:999px;font:700 19px/1.2 var(--f-display);background:#e7e7fb;color:var(--ink);white-space:nowrap}
.u11kw{border-radius:6px;padding:0 3px;transition:background .4s,color .4s}
.u11kw.on{background:#ffe066;font-weight:700}
.u11flag{border-radius:6px;padding:0 2px;transition:background .4s,box-shadow .4s}
.u11flag.on{background:#ffd5cf;box-shadow:0 0 0 2px #dc3b2a}
.u11box{transition:box-shadow .4s,background .4s;border-radius:12px}
.u11box.on{box-shadow:0 0 0 4px #dc3b2a;background:#fff4f2}
.u11hi{transition:background .4s;border-radius:4px}
.u11hi.on{background:#ffe066}
.u11bub{max-width:290px;padding:8px 12px;border-radius:14px;font-size:19px;line-height:1.3;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.18)}
.u11tab{min-height:56px}
`;
  if (!document.getElementById("u11css")) { const st = document.createElement("style"); st.id = "u11css"; st.textContent = CSS; document.head.appendChild(st); }
  const later = el => { el.classList.add("later"); return el; };
  const life = (s, attrs, ...kids) => s.h("div", Object.assign({ class: "life" }, attrs || {}), s.h("span", { class: "exlabel" }, "Im Alltag"), ...kids);
  const merk = (s, attrs, ...kids) => s.h("div", Object.assign({ class: "merk" }, attrs || {}), ...kids);
  const B = (s, text, color) => s.h("b", { style: { color: color || "inherit" } }, text);
  const T = (s, x, y, text, a) => s.el("text", Object.assign({ x, y, "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: P.ink, text }, a || {}));
  const root = (s, cls, style, ...kids) => s.h("div", { class: cls, style: Object.assign({ height: "100%" }, style || {}) }, ...kids);
  const small = (s, text, st) => s.h("p", { class: "small", style: Object.assign({ fontSize: "20px" }, st || {}) }, ...[].concat(text));
  const read = (s, text, opts) => { if (s.fast) return; s.speak(text.replace(/[„“()]/g, ""), Object.assign({ lang: "de-DE" }, opts || {})); };
  const num = (s, n, bg, size) => s.h("span", { class: "u11num", style: Object.assign({ background: bg || P.unit }, size ? { width: size + "px", height: size + "px" } : {}) }, String(n));
  const mini = (s, w, h) => { const v = s.svg(w, h); v.style.width = w + "px"; v.style.height = h + "px"; v.style.flex = "none"; return v; };

  /* ---------- small media icons, centred on 0/0, about 70 × 56 ---------- */
  const ICON = {
    buch: (s, c) => [s.el("path", { d: "M0 -18 Q-16 -26 -34 -20 V22 Q-16 16 0 24 Z", fill: "#fff", stroke: c, "stroke-width": 3 }), s.el("path", { d: "M0 -18 Q16 -26 34 -20 V22 Q16 16 0 24 Z", fill: "#fff", stroke: c, "stroke-width": 3 }), s.el("path", { d: "M-26 -8 h18 M-26 0 h18 M-26 8 h14 M8 -8 h18 M8 0 h18 M8 8 h14", stroke: c, "stroke-width": 2.5 })],
    zeitung: (s, c) => [s.el("rect", { x: -30, y: -26, width: 60, height: 52, rx: 4, fill: "#fff", stroke: c, "stroke-width": 3 }), s.el("rect", { x: -23, y: -19, width: 46, height: 10, fill: c }), s.el("rect", { x: -23, y: -4, width: 20, height: 22, fill: c, opacity: .35 }), s.el("path", { d: "M2 -2 h21 M2 6 h21 M2 14 h21", stroke: c, "stroke-width": 2.5 })],
    radio: (s, c) => [s.el("line", { x1: 16, y1: -14, x2: 30, y2: -32, stroke: c, "stroke-width": 3, "stroke-linecap": "round" }), s.el("rect", { x: -34, y: -14, width: 68, height: 40, rx: 8, fill: c }), s.el("circle", { cx: -13, cy: 6, r: 12, fill: "#fff" }), s.el("circle", { cx: -13, cy: 6, r: 5, fill: c }), s.el("rect", { x: 6, y: -6, width: 20, height: 7, rx: 2, fill: "#fff" }), s.el("circle", { cx: 16, cy: 14, r: 5, fill: "#fff" })],
    kopfhoerer: (s, c) => [s.el("path", { d: "M-24 10 V2 a24 24 0 0 1 48 0 V10", stroke: c, "stroke-width": 6, fill: "none" }), s.el("rect", { x: -32, y: 2, width: 14, height: 24, rx: 5, fill: c }), s.el("rect", { x: 18, y: 2, width: 14, height: 24, rx: 5, fill: c })],
    tv: (s, c) => [s.el("rect", { x: -34, y: -24, width: 68, height: 44, rx: 6, fill: c }), s.el("rect", { x: -28, y: -18, width: 56, height: 32, rx: 3, fill: "#d9ecff" }), s.el("path", { d: "M-10 20 l-8 8 M10 20 l8 8", stroke: c, "stroke-width": 4, "stroke-linecap": "round" })],
    film: (s, c) => [s.el("rect", { x: -32, y: -8, width: 64, height: 34, rx: 4, fill: P.ink }), s.el("g", { transform: "rotate(-14 -32 -10)" }, s.el("rect", { x: -32, y: -22, width: 64, height: 12, fill: "#fff", stroke: P.ink, "stroke-width": 2 }), ...[-26, -10, 6, 22].map(x => s.el("path", { d: `M${x} -22 l8 0 l-6 12 l-8 0 Z`, fill: P.ink }))), s.el("path", { d: "M-24 4 h48 M-24 14 h30", stroke: "#fff", "stroke-width": 2.5 })],
    handy: (s, c) => [s.el("rect", { x: -16, y: -28, width: 32, height: 56, rx: 7, fill: P.ink }), s.el("rect", { x: -12, y: -22, width: 24, height: 40, rx: 2, fill: c, opacity: .6 }), s.el("circle", { cx: 0, cy: 23, r: 2.5, fill: "#fff" })],
    laptop: (s, c) => [s.el("rect", { x: -28, y: -24, width: 56, height: 36, rx: 4, fill: P.ink }), s.el("rect", { x: -23, y: -19, width: 46, height: 26, fill: c, opacity: .6 }), s.el("path", { d: "M-36 14 h72 l-6 8 h-60 Z", fill: "#8a94a6" })],
  };
  const icon = (s, kind, x, y, c, sc = 1) => s.el("g", { transform: `translate(${x} ${y}) scale(${sc})` }, ...ICON[kind](s, c));
  const svgIcon = (s, kind, c, size = 56) => { const v = s.svg(80, 70); v.style.width = size + "px"; v.style.height = size * 70 / 80 + "px"; v.style.flex = "none"; v.append(icon(s, kind, 40, 37, c)); return v; };

  /* ---------- a simple drawn child (used in the film slides) ---------- */
  const kid = (s, x, y, col, sc = 1, mood) => s.el("g", { transform: `translate(${x} ${y}) scale(${sc})` },
    s.el("path", { d: "M-8 60 L-12 118 M8 60 L12 118", stroke: P.ink, "stroke-width": 9, "stroke-linecap": "round" }),
    s.el("path", { d: "M-26 64 Q-28 22 0 20 Q28 22 26 64 Z", fill: col }),
    s.el("path", { d: "M-22 30 L-34 62 M22 30 L32 66", stroke: col, "stroke-width": 9, "stroke-linecap": "round" }),
    s.el("circle", { cx: 0, cy: 0, r: 22, fill: P.skin, stroke: P.ink, "stroke-width": 1.5 }),
    s.el("path", { d: "M-22 -2 Q-22 -26 0 -25 Q22 -26 22 -2 Q14 -16 0 -15 Q-12 -16 -22 -2 Z", fill: P.hair }),
    s.el("circle", { cx: -8, cy: -2, r: 2.6, fill: P.ink }), s.el("circle", { cx: 8, cy: -2, r: 2.6, fill: P.ink }),
    s.el("path", { d: mood === "oh" ? "M-4 11 a4 5 0 1 0 8 0 a4 5 0 1 0 -8 0" : "M-7 9 Q0 15 7 9", stroke: P.ink, "stroke-width": 2.2, fill: mood === "oh" ? P.ink : "none", "stroke-linecap": "round" }));

  Deck.unit({
    id: "u11", num: 11, title: "Medien: suchen, prüfen, hören, sehen", color: P.unit, soft: P.soft,
    subtitle: "Klug im Netz, kreativ mit Ton und Film",
    blurb: "Suchen, Quellen prüfen, Hörspiel und Film.",
    goals: ["Medien kennen und die eigene Mediennutzung beobachten", "Mit guten Suchbegriffen suchen und Werbung erkennen", "Quellen prüfen: Wer? Wann? Warum? – Falschmeldungen erkennen", "Wie Hörspiel und Film gemacht werden: Ton, Einstellung, Storyboard", "Sicher und fair im Netz: Privatsphäre und Rechte an Bildern"],
    icon(svg, el) {
      svg.append(el("rect", { x: 6, y: 12, width: 44, height: 32, rx: 5, fill: P.unit }), el("rect", { x: 11, y: 17, width: 34, height: 22, rx: 2, fill: "#d9ecff" }),
        el("circle", { cx: 50, cy: 46, r: 12, fill: "#fff", stroke: P.unit, "stroke-width": 4 }), el("path", { d: "M58 54 L66 62", stroke: P.unit, "stroke-width": 6, "stroke-linecap": "round" }),
        el("path", { d: "M20 52 v10 M36 52 v10 M14 62 h28", stroke: P.unit, "stroke-width": 4, "stroke-linecap": "round" }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Was sind Medien?",
        say: "Medien bringen Informationen und Geschichten zu dir: Bücher, Radio, Filme, das Internet. Das Wort Medium heißt: das, was in der Mitte steht.",
        build(s) {
          const W = 540, H = 560, v = s.svg(W, H), CX = 270, CY = 270, R = 205;
          const GROUPS = [
            ["Lesen", P.blue, [["buch", "Buch"], ["zeitung", "Zeitung"]], "Buch, Zeitung, Zeitschrift, Comic"],
            ["Hören", P.orange, [["radio", "Radio"], ["kopfhoerer", "Hörspiel"]], "Radio, Hörspiel, Hörbuch, Podcast"],
            ["Sehen und Hören", P.green, [["tv", "Fernsehen"], ["film", "Kinofilm"]], "Fernsehen, Kinofilm, Video"],
            ["Digital", P.violet, [["handy", "Handy"], ["laptop", "Computer"]], "Handy, Tablet, Computer, Internet"],
          ];
          v.append(s.el("circle", { cx: CX, cy: CY, r: R, fill: "none", stroke: P.line, "stroke-width": 2, "stroke-dasharray": "6 8" }));
          const centre = s.el("g", null, s.el("circle", { cx: CX, cy: CY, r: 66, fill: P.soft, stroke: P.unit, "stroke-width": 3 }), s.el("circle", { cx: CX, cy: CY - 12, r: 24, fill: P.skin, stroke: P.ink, "stroke-width": 1.5 }),
            s.el("path", { d: `M${CX - 24} ${CY - 14} Q${CX - 24} ${CY - 40} ${CX} ${CY - 39} Q${CX + 24} ${CY - 40} ${CX + 24} ${CY - 14} Q${CX + 12} ${CY - 28} ${CX} ${CY - 27} Q${CX - 12} ${CY - 28} ${CX - 24} ${CY - 14} Z`, fill: P.hair }),
            s.el("path", { d: `M${CX - 30} ${CY + 46} Q${CX - 30} ${CY + 16} ${CX} ${CY + 14} Q${CX + 30} ${CY + 16} ${CX + 30} ${CY + 46} Z`, fill: P.unit }), T(s, CX, CY + 92, "du", { "font-size": 24, fill: P.unit }));
          const grp = GROUPS.map(([name, col, items], gi) => items.map(([k, lbl], ii) => {
            const a = (-90 + (gi * 2 + ii) * 45 + 22.5) * Math.PI / 180, x = CX + R * Math.cos(a), y = CY + R * Math.sin(a);
            const ln = later(s.el("line", { x1: x - 52 * Math.cos(a), y1: y - 52 * Math.sin(a), x2: CX + 84 * Math.cos(a), y2: CY + 84 * Math.sin(a), stroke: col, "stroke-width": 4, "stroke-dasharray": "2 8", "stroke-linecap": "round" }));
            const g = later(s.el("g", null, s.el("circle", { cx: x, cy: y - 6, r: 46, fill: "#fff", stroke: col, "stroke-width": 3 }), icon(s, k, x, y - 10, col, .85), T(s, x, y + 64, lbl, { fill: col })));
            v.append(ln, g); return [ln, g];
          }));
          v.append(centre);
          const rows = GROUPS.map(([name, col, , list]) => later(s.h("div", { style: { display: "grid", gridTemplateColumns: "175px 1fr", gap: "8px", alignItems: "center", padding: "4px 12px", borderRadius: "12px", background: "#fff", border: "2px solid " + col } },
            s.h("b", { style: { font: "700 21px/1.15 var(--f-display)", color: col } }, name), small(s, list))));
          const def = s.h("div", { class: "card soft", style: { padding: "12px 18px", display: "flex", flexDirection: "column", gap: "6px" } },
            s.h("p", { class: "h2", style: { color: P.unit } }, "das Medium – die Medien"),
            small(s, ["Medien ", B(s, "vermitteln"), " Informationen, Geschichten und Musik. Lateinisch ", B(s, "medium"), " = die Mitte: Ein Medium steht zwischen dem, der erzählt, und dir."]));
          const m = later(merk(s, { style: { fontSize: "21px", padding: "10px 16px 12px" } }, "Medien kann man ", B(s, "lesen"), ", ", B(s, "hören"), ", ", B(s, "sehen"), " – oder alles zusammen, zum Beispiel im Handy."));
          const lf = later(life(s, { style: { padding: "10px 16px" } }, small(s, "Radio beim Frühstück, nachmittags ein Hörspiel, abends ein Buch: Du nutzt jeden Tag viele Medien.")));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "540px 1fr", gap: "18px", alignItems: "start" }, v, s.h("div", { class: "stack", style: { gap: "10px" } }, def, ...rows, m, lf)));
          s.show(centre, "pop"); s.sfx.pop();
          const SND = [() => s.sound("page-turn-2"), () => s.sfx.chord([0, 4, 7]), () => s.sound("camera-shutter", { vol: .5 }), () => s.sound("mouse-click", { vol: .6 })];
          GROUPS.forEach(([name], gi) => s.step(async () => {
            SND[gi]();
            for (const [ln, g] of grp[gi]) { s.show(ln, "draw"); await s.show(g, "pop"); }
            await s.show(rows[gi], "left"); s.say(name + ": " + GROUPS[gi][3] + ".");
          }));
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sound("ubahn-announce", { vol: .25, dur: 2 }); await s.show(lf, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Im Alltag: Medientagebuch",
        say: "Nora hat eine Woche lang aufgeschrieben, wie lange sie welche Medien nutzt. So ein Medientagebuch zeigt dir, wohin deine Zeit geht.",
        build(s) {
          const MED = [["Buch", P.blue], ["Hörspiel", P.orange], ["Film", P.green], ["Spiele", P.violet], ["Lernen", P.teal]];
          const DAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
          const DATA = [[20, 15, 30, 20, 15], [15, 30, 0, 30, 20], [25, 15, 45, 0, 10], [20, 0, 30, 30, 25], [10, 20, 60, 30, 0], [30, 30, 90, 45, 0], [40, 45, 60, 30, 15]];
          const W = 600, H = 390, v = s.svg(W, H), X0 = 70, Y0 = 340, K = 1.2, BW = 52, GAP = 22;
          for (const mn of [60, 120, 180, 240]) v.append(s.el("line", { x1: X0, y1: Y0 - mn * K, x2: W - 10, y2: Y0 - mn * K, stroke: P.line, "stroke-width": 2, "stroke-dasharray": "5 6" }), T(s, X0 - 10, Y0 - mn * K + 7, mn / 60 + " h", { "text-anchor": "end", "font-size": 19, fill: P.pencil }));
          v.append(s.el("line", { x1: X0, y1: Y0, x2: W - 10, y2: Y0, stroke: P.ink, "stroke-width": 3 }));
          const segs = [];
          DATA.forEach((row, d) => {
            const x = X0 + 16 + d * (BW + GAP); let y = Y0;
            v.append(T(s, x + BW / 2, Y0 + 30, DAYS[d], { "font-size": 21 }));
            row.forEach((mn, k) => { const r = s.el("rect", { x, y: y - mn * K, width: BW, height: mn * K, fill: MED[k][1], stroke: "#fff", "stroke-width": 1.5 }); r.dataset.k = k; r.dataset.y = y; r.dataset.h = mn * K; y -= mn * K; segs.push({ r, d, k }); v.append(r); });
          });
          const grow = async days => {
            for (const d of days) {
              const mine = segs.filter(x => x.d === d);
              s.sfx.count(d);
              if (!s.fast) await s.tween({ from: 0, to: 1, dur: 380, ease: "out", update: t => mine.forEach(({ r }) => { const hh = +r.dataset.h * t, y0 = +r.dataset.y; r.setAttribute("height", hh); r.setAttribute("y", Y0 - (Y0 - y0) * t - hh); }) });
              mine.forEach(({ r }) => { r.setAttribute("height", r.dataset.h); r.setAttribute("y", +r.dataset.y - +r.dataset.h); });
            }
          };
          segs.forEach(({ r }) => { r.setAttribute("height", 0); r.setAttribute("y", Y0); });
          const total = MED.map((_, k) => DATA.reduce((a, r) => a + r[k], 0));
          const hm = mn => (mn >= 60 ? Math.floor(mn / 60) + " h " : "") + (mn % 60 ? (mn % 60) + " min" : "").trim();
          let sel = -1;
          const focus = k => { sel = sel === k ? -1 : k; s.sfx.click(); segs.forEach(({ r }) => r.setAttribute("opacity", sel < 0 || +r.dataset.k === sel ? 1 : .18)); btns.forEach((b, i) => { b.style.background = i === sel ? MED[i][1] : "#fff"; b.style.color = i === sel ? "#fff" : MED[i][1]; }); };
          const btns = MED.map(([n, c], k) => s.h("button", { class: "btn", style: { borderColor: c, color: c, padding: "0 12px", flex: "1" }, onclick: () => focus(k) }, n));
          const sums = later(s.h("div", { class: "row", style: { gap: "6px" } }, ...MED.map(([n, c], k) => s.h("span", { class: "u11chip", style: { background: "#fff", border: "2px solid " + c } }, n + ": " + hm(total[k])))));
          const left = s.h("div", { class: "card", style: { padding: "8px 12px", display: "flex", flexDirection: "column", gap: "8px" } }, s.h("p", { class: "small", style: { color: P.pencil } }, "Noras Woche (ausgedacht) – tippe auf ein Medium:"), v, s.h("div", { style: { display: "flex", gap: "8px" } }, ...btns));
          const NOTES = [["Mittwoch:", "Kein Spiel, dafür Training – war super!"], ["Samstag:", "90 Minuten Film mit der ganzen Familie. Lustig!"], ["Sonntag:", "Hörspiel beim Aufräumen. Ging viel schneller."]];
          const notes = NOTES.map(([d, t]) => later(s.h("p", { class: "hand", style: { margin: 0, fontSize: "27px", lineHeight: 1.1 } }, s.h("b", { style: { color: P.red } }, d + " "), t)));
          const diary = s.h("div", { class: "card", style: { padding: "10px 16px", background: "#fffef6", borderLeft: "10px solid " + P.unit, display: "flex", flexDirection: "column", gap: "6px" } }, s.h("p", { style: { margin: 0, font: "800 23px/1.1 var(--f-display)", color: P.unit } }, "Mein Medientagebuch"), ...notes);
          const m = later(merk(s, { style: { fontSize: "21px", padding: "10px 16px 12px" } }, "Schreib eine Woche lang auf: ", B(s, "Was?"), " ", B(s, "Wie lange?"), " ", B(s, "Wie ging es mir dabei?"), " Dann siehst du, wofür du deine Zeit nutzt."));
          const lf = later(life(s, { style: { padding: "8px 14px" } }, small(s, "Viele Familien machen Medienregeln, zum Beispiel: kein Handy beim Essen und eine Stunde vor dem Schlafen.")));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "626px 1fr", gap: "16px", alignItems: "start" }, s.h("div", { class: "stack", style: { gap: "10px" } }, left, sums), s.h("div", { class: "stack", style: { gap: "10px" } }, diary, m, lf)));
          s.show(left, "up"); s.sound("pencil-write", { vol: .4, dur: 1 });
          s.step(async () => { await grow([0, 1, 2, 3, 4]); s.sound("pencil-write", { vol: .4, dur: 1 }); await s.show(notes[0], "fade"); s.say("Montag bis Freitag."); });
          s.step(async () => { await grow([5, 6]); s.sound("pencil-write", { vol: .4, dur: 1.2 }); await s.show(notes[1], "fade"); await s.show(notes[2], "fade"); s.say("Am Wochenende sind die Säulen höher."); });
          s.step(async () => { s.sfx.coin(); await s.show(sums, "up"); s.say("Zusammengezählt: Film liegt vorn – mit über fünf Stunden in der Woche."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Schlau suchen: Suchbegriffe",
        say: "Eine Suchmaschine versteht keine langen Fragen so gut wie ein Mensch. Zieh die wichtigsten Wörter heraus. Das sind deine Suchbegriffe.",
        build(s) {
          const EX = [
            { q: ["Wie ", ["hoch"], " ist eigentlich der ", ["Berliner"], " ", ["Fernsehturm"], "?"], k: "Fernsehturm Berlin Höhe", a: "368 Meter" },
            { q: ["Ich möchte wissen, was ein ", ["Igel"], " im ", ["Winter"], " macht."], k: "Igel Winter", a: "Er hält Winterschlaf." },
            { q: ["Wer hat eigentlich das Buch ", ["„Emil und die Detektive“"], " ", ["geschrieben"], "?"], k: "„Emil und die Detektive“ Autor", a: "Erich Kästner" },
          ];
          const qBox = s.h("p", { class: "t", style: { fontSize: "26px", margin: 0 } });
          const typed = s.h("span", { style: { font: "600 26px/1 var(--f-body)" } }, "");
          const caret = s.h("span", { class: "a-pulse", style: { display: "inline-block", width: "3px", height: "28px", background: P.ink, marginLeft: "2px", verticalAlign: "middle" } });
          const glass = mini(s, 34, 34); glass.append(s.el("circle", { cx: 14, cy: 14, r: 10, fill: "none", stroke: P.unit, "stroke-width": 4 }), s.el("path", { d: "M22 22 L31 31", stroke: P.unit, "stroke-width": 5, "stroke-linecap": "round" }));
          const search = s.h("div", { style: { display: "flex", alignItems: "center", gap: "12px", padding: "0 18px", height: "64px", borderRadius: "32px", background: "#fff", border: "3px solid " + P.unit, boxShadow: "0 3px 0 " + P.line } }, glass, s.h("div", { style: { flex: 1, whiteSpace: "nowrap", overflow: "hidden" } }, typed, caret));
          const ans = later(s.h("div", { class: "row", style: { gap: "10px" } }, s.h("span", { class: "u11chip", style: { background: P.green, color: "#fff" } }, "Treffer"), s.h("span", { class: "t", style: { fontWeight: 700 } }, "")));
          const arrow = later(s.h("p", { class: "small", style: { color: P.unit, fontWeight: 700 } }, "↓ wichtige Wörter heraussuchen und eintippen"));
          const tabs = EX.map((_, i) => s.h("button", { class: "btn u11tab", onclick: () => run(i, true) }, "Beispiel " + (i + 1)));
          let busy = 0, kws = [];
          const setQ = i => {
            kws = [];
            qBox.replaceChildren(...EX[i].q.map(p => { if (Array.isArray(p)) { const e = s.h("span", { class: "u11kw" }, p[0]); kws.push(e); return e; } return p; }));
            typed.textContent = ""; ans.lastChild.textContent = EX[i].a; tabs.forEach((b, j) => b.classList.toggle("solid", j === i));
          };
          const mark = async () => { for (const k of kws) { k.classList.add("on"); s.sfx.scribble(); await s.wait(260); } };
          const type = async i => {
            const txt = EX[i].k; s.sound("keyboard", { vol: .35, dur: Math.min(3, txt.length * .07 + .3) });
            if (s.fast) { typed.textContent = txt; return; }
            await s.tween({ from: 0, to: txt.length, dur: txt.length * 70, ease: "linear", update: n => (typed.textContent = txt.slice(0, Math.round(n))) });
            typed.textContent = txt;
          };
          const run = async (i, full) => {
            const id = ++busy; s.sfx.whoosh(); setQ(i); s.hide(ans);
            if (!full) return;
            await mark(); if (id !== busy) return; s.show(arrow, "fade");
            await type(i); if (id !== busy) return; s.sfx.success(); s.show(ans, "pop");
          };
          const TIPS = [["Wichtige Wörter heraussuchen", "meist Nomen: Fernsehturm, Igel, Winter"], ["Lieber wenige Wörter", "zwei oder drei Suchbegriffe reichen oft"], ["Richtig schreiben", "Tippfehler führen zu falschen Treffern"], ["Feste Wortgruppen in „…“", "dann sucht die Suchmaschine genau diese Wörter zusammen"]];
          const tips = TIPS.map(([a, b], i) => later(s.h("div", { class: "card", style: { padding: "8px 12px", display: "grid", gridTemplateColumns: "40px 1fr", gap: "10px", alignItems: "center" } }, num(s, i + 1), s.h("div", null, s.h("p", { style: { margin: 0, font: "700 21px/1.2 var(--f-display)", color: P.unit } }, a), small(s, b, { fontSize: "19px" })))));
          const m = later(merk(s, { style: { fontSize: "21px", padding: "10px 16px 12px" } }, "Nicht die ganze Frage eintippen, sondern die ", B(s, "Suchbegriffe"), ": die wichtigsten Wörter."));
          const lf3 = later(life(s, { style: { padding: "8px 14px" } }, small(s, "Auch im Katalog der Bibliothek suchst du mit Suchbegriffen: „Igel Sachbuch“ findet Bücher über Igel.", { fontSize: "19px" })));
          const left = s.h("div", { class: "stack", style: { gap: "14px" } }, s.h("div", { class: "row", style: { gap: "10px" } }, ...tabs),
            s.h("div", { class: "card soft", style: { padding: "14px 20px" } }, s.h("p", { class: "small", style: { color: P.pencil, marginBottom: "4px" } }, "Deine Frage:"), qBox), arrow, search, ans, m);
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "1fr 400px", gap: "20px", alignItems: "start" }, left, s.h("div", { class: "stack", style: { gap: "10px" } }, ...tips, lf3)));
          setQ(0); s.sfx.pop();
          s.step(async () => { await mark(); s.show(arrow, "fade"); s.say("Fernsehturm, Berlin, hoch. Das sind die wichtigen Wörter."); });
          s.step(async () => { await type(0); s.sfx.success(); await s.show(ans, "pop"); s.say("Treffer: 368 Meter."); });
          s.step(async () => { for (const i of [0, 1]) { s.sfx.count(i); await s.show(tips[i], "left"); } });
          s.step(async () => { for (const i of [2, 3]) { s.sfx.count(i + 2); await s.show(tips[i], "left"); } await run(2, true); s.say("Bei einem Buchtitel helfen Anführungszeichen."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sfx.pop(); await s.show(lf3, "up"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Suchmaschinen für Kinder",
        say: "Kindersuchmaschinen wie fragFINN zeigen nur Seiten, die Erwachsene vorher geprüft haben. Wie ein Sieb, das nur passende Seiten durchlässt.",
        build(s) {
          const W = 440, H = 470, v = s.svg(W, H);
          v.append(s.el("path", { d: "M40 40 Q20 0 90 14 Q140 -6 200 14 Q260 -6 330 14 Q420 0 400 40 Q440 70 400 100 Q380 130 300 116 Q220 136 140 116 Q60 136 40 100 Q0 70 40 40 Z", fill: "#eef1f6", stroke: P.line, "stroke-width": 2 }),
            T(s, 220, 70, "das ganze Internet", { "font-size": 22, fill: P.pencil }),
            s.el("path", { d: "M70 170 H370 L250 300 V330 H190 V300 Z", fill: P.soft, stroke: P.unit, "stroke-width": 4, "stroke-linejoin": "round" }),
            ...[110, 150, 190, 230, 270, 310, 350].map((x, i) => s.el("line", { x1: x, y1: 170, x2: x, y2: 182, stroke: P.unit, "stroke-width": 3 })),
            s.el("rect", { x: 110, y: 370, width: 220, height: 90, rx: 16, fill: "#e6f6ee", stroke: P.green, "stroke-width": 3 }),
            T(s, 220, 408, "geprüfte Seiten", { "font-size": 21, fill: P.green }), T(s, 220, 436, "für Kinder", { "font-size": 21, fill: P.green }));
          const dots = Array.from({ length: 22 }, (_, i) => { const ok = i % 3 !== 1; const c = s.el("circle", { r: 9, fill: ok ? P.green : P.red, opacity: 0 }); v.append(c); return { c, ok, x0: 70 + (i * 53) % 300, ph: i * .37 }; });
          v.append(s.el("rect", { x: 140, y: 202, width: 160, height: 56, rx: 12, fill: "#fff", stroke: P.unit, "stroke-width": 2 }), T(s, 220, 225, "Prüfung durch", { "font-size": 20, fill: P.unit }), T(s, 220, 249, "Fachleute", { "font-size": 20, fill: P.unit }));
          let on = false;
          s.loop(t => {
            if (!on) return;
            dots.forEach(d => {
              const k = ((t * .28 + d.ph) % 1);
              let x = d.x0, y = 90 + k * 330, o = 1;
              if (y > 170) { const f = Math.min(1, (y - 170) / 130); x = d.x0 + (220 - d.x0) * f; }
              if (!d.ok && y > 185) { y = 185; o = Math.max(0, 1 - (k * 330 - 95) / 60); x = d.x0 + (k * 330 - 95) * (d.x0 < 220 ? -1 : 1) * .6; }
              if (y > 362) o = Math.max(0, 1 - (y - 362) / 14);
              d.c.setAttribute("cx", x); d.c.setAttribute("cy", y); d.c.setAttribute("opacity", o);
            });
          });
          const card = (name, col, lines, extra) => later(s.h("div", { class: "card", style: Object.assign({ padding: "10px 16px", display: "flex", flexDirection: "column", gap: "4px", borderColor: col, borderWidth: "3px" }, extra || {}) },
            s.h("div", { class: "row", style: { gap: "10px", justifyContent: "space-between" } }, s.h("p", { style: { margin: 0, font: "800 26px/1.1 var(--f-display)", color: col } }, name), s.h("span", { style: { display: "flex", alignItems: "center", gap: "8px", padding: "4px 12px", borderRadius: "20px", border: "2px solid " + col, color: P.pencil, fontSize: "19px" } }, "Suchen …")),
            ...lines.map(l => small(s, l))));
          const c1 = card("fragFINN", P.green, [["Zeigt nur Seiten, die ", B(s, "Medienpädagogen vorher geprüft"), " haben."], "Gemacht für Kinder von 6 bis 12 Jahren."]);
          const c2 = card("Helles Köpfchen", P.orange, [["Suchmaschine und Wissensseite für Kinder und Jugendliche – ", B(s, "seit 2004"), "."]]);
          const c3 = card("Blinde Kuh", P.pencil, [["Die erste deutsche Kindersuchmaschine, ", B(s, "von 1997 bis 2023"), ". Dann fehlte das Geld – seit 2024 ist sie abgeschaltet."]], { background: "#f3f4f6" });
          const m = later(merk(s, { style: { fontSize: "21px", padding: "10px 16px 12px" } }, "Kindersuchmaschinen ", B(s, "filtern"), ": weniger Treffer, aber passende. Mitdenken musst du trotzdem!"));
          const lf = later(life(s, { style: { padding: "8px 14px" } }, small(s, "Referat über Igel? Erst bei einer Kindersuchmaschine suchen, dann in der Bibliothek ein Sachbuch dazu ausleihen.")));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "440px 1fr", gap: "20px", alignItems: "start" }, s.h("div", { class: "stack", style: { gap: "8px" } }, v, lf), s.h("div", { class: "stack", style: { gap: "10px" } }, c1, c2, c3, m)));
          s.sfx.pop();
          s.step(async () => { on = true; s.sound("bubbles", { vol: .35, dur: 2 }); s.say("Rote Seiten bleiben hängen, grüne kommen durch."); await s.wait(400); });
          s.step(async () => { s.sfx.ding(); await s.show(c1, "left"); s.sfx.pop(); await s.show(c2, "left"); s.say("fragFINN und Helles Köpfchen."); });
          s.step(async () => { s.sfx.error(); await s.show(c3, "left"); s.say("Die Blinde Kuh gibt es nicht mehr. Auch im Internet verschwinden Dinge."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Die Trefferliste lesen",
        say: "Bevor du klickst, lies die Trefferliste genau. Ganz oben steht oft Werbung. Sie ist mit Gesponsert oder Anzeige markiert.",
        build(s) {
          const hi = (t, cls) => s.h("span", { class: cls || "u11hi" }, t);
          const badge = n => later(s.h("span", { class: "u11num", style: { width: "30px", height: "30px", fontSize: "18px", marginRight: "8px", background: P.red, verticalAlign: "middle" } }, String(n)));
          const res = (title, addr, snip, ad) => {
            const tEl = hi(title), aEl = hi(addr), sEl = hi(snip);
            const box = s.h("div", { class: "u11box", style: { padding: "8px 12px", display: "flex", flexDirection: "column", gap: "2px" } },
              s.h("p", { style: { margin: 0, fontSize: "19px", color: P.green } }, ad ? s.h("b", { style: { color: P.ink, marginRight: "8px" } }, "Gesponsert") : "", aEl),
              s.h("p", { style: { margin: 0, font: "700 23px/1.25 var(--f-body)", color: P.blue } }, tEl),
              s.h("p", { style: { margin: 0, fontSize: "19px", lineHeight: 1.3, color: P.pencil } }, sEl));
            box.t = tEl; box.a = aEl; box.s = sEl; return box;
          };
          const ad = res("Stachelglück-Igelfutter – jetzt 20 % sparen!", "www.stachelglueck-shop.de", "Das Lieblingsfutter für jeden Igel. Heute bestellen, morgen geliefert!", true);
          const r1 = res("Igel richtig füttern – Tipps vom Naturschutzverein", "www.naturschutzverein-beispiel.de › igel", "Igel fressen vor allem Käfer, Raupen und Würmer. Milch ist für Igel gefährlich …");
          const r2 = res("Igel – Tierlexikon für Kinder", "www.tierlexikon-beispiel.de › saeugetiere › igel", "Der Igel ist ein Säugetier. Im Winter hält er Winterschlaf …");
          const r3 = res("Mein Igel trinkt jeden Tag Milch!!! – Tierforum", "www.tierforum-beispiel.de › thema › 4711", "Hallo Leute, ich hab einen Igel im Garten und gebe ihm immer Milch …");
          const b1 = badge(1), b2 = badge(2), b3 = badge(3), b4 = badge(4);
          const sbar = s.h("div", { style: { display: "flex", alignItems: "center", gap: "10px", height: "48px", padding: "0 16px", borderRadius: "24px", border: "2px solid " + P.line, background: "#fff" } }, s.h("span", { style: { fontSize: "21px", fontWeight: 700 } }, "Igel füttern"));
          const mock = s.h("div", { class: "card", style: { padding: "10px 14px", display: "flex", flexDirection: "column", gap: "4px" } },
            s.h("div", { class: "row", style: { gap: "10px" } }, sbar, s.h("span", { class: "small pencil" }, "Suchmaschine (ausgedacht)")),
            s.h("div", { class: "row", style: { gap: "0", flexWrap: "nowrap", alignItems: "flex-start" } }, b1, ad), r1, r2, r3);
          r1.firstChild.prepend(b3); r1.children[1].prepend(b2); r1.lastChild.prepend(b4);
          const NOTES = [
            [1, "Gesponsert = Anzeige", "Eine Firma hat bezahlt, damit sie ganz oben steht. Das ist Werbung."],
            [2, "Der Titel", "Worum geht es auf der Seite?"],
            [3, "Die Adresse", "Wer steckt dahinter? Ein Verein, ein Lexikon, ein Shop, ein Forum?"],
            [4, "Der Ausschnitt", "Passt er zu meiner Frage?"],
          ];
          const notes = NOTES.map(([n, a, b]) => later(s.h("div", { class: "card", style: { padding: "8px 12px", display: "grid", gridTemplateColumns: "40px 1fr", gap: "10px", alignItems: "center" } }, num(s, n, P.red), s.h("div", null, s.h("p", { style: { margin: 0, font: "700 21px/1.2 var(--f-display)", color: P.red } }, a), small(s, b, { fontSize: "19px" })))));
          const m = later(merk(s, { style: { fontSize: "21px", padding: "10px 16px 12px" } }, B(s, "Erst lesen, dann klicken."), " Anzeigen überspringen und den Treffer wählen, der zu deiner Frage passt."));
          const lf5 = later(life(s, { style: { padding: "8px 14px" } }, small(s, "Auch bei Videos und in Apps steht klein „Anzeige“ oder „Werbung“.", { fontSize: "19px" })));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "660px 1fr", gap: "18px", alignItems: "start" }, mock, s.h("div", { class: "stack", style: { gap: "10px" } }, ...notes, m, lf5)));
          s.show(mock, "up"); s.sound("keyboard", { vol: .3, dur: 1 });
          s.step(async () => { s.sound("cash-register", { vol: .4 }); ad.classList.add("on"); s.show(b1, "pop"); await s.show(notes[0], "left"); s.say(NOTES[0][2]); });
          s.step(async () => { s.sfx.pop(); [r1, r2, r3].forEach(r => r.t.classList.add("on")); s.show(b2, "pop"); await s.show(notes[1], "left"); });
          s.step(async () => { s.sfx.pop(); [r1, r2, r3].forEach(r => { r.t.classList.remove("on"); r.a.classList.add("on"); }); s.show(b3, "pop"); await s.show(notes[2], "left"); s.say("Ein Verein, ein Lexikon oder ein Forum?"); });
          s.step(async () => { s.sfx.pop(); [r1, r2, r3].forEach(r => { r.a.classList.remove("on"); r.s.classList.add("on"); }); s.show(b4, "pop"); await s.show(notes[3], "left"); s.say("Im Forum steht etwas über Milch. Das schauen wir uns gleich genauer an."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sfx.pop(); await s.show(lf5, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Wer hat das geschrieben?",
        say: "Drei Seiten über Igel. Prüfe jede mit drei Fragen: Wer hat das geschrieben? Wann? Und warum?",
        build(s) {
          const PAGES = {
            lex: { tab: "Lexikon", col: P.blue, head: "Tierlexikon für Kinder", title: "Der Igel", text: "Der Igel ist ein Säugetier. Er frisst vor allem Käfer, Raupen und Würmer. Im Winter hält er Winterschlaf.", foot: "Autorin: Dr. Lena Sommer · Stand: 2. Oktober 2026 · Quellen: 3 Fachbücher", who: "eine Autorin mit Namen", when: "Datum steht dabei", why: "informieren", score: 3, verdict: "gut geeignet" },
            ad: { tab: "Werbung", col: P.orange, head: "Stachelglück-Shop", title: "Igel LIEBEN unser Futter!", text: "Nur heute: 9,99 € statt 14,99 €. Jetzt kaufen und jedem Igel eine Freude machen!", foot: "Anzeige", who: "eine Firma, die Futter verkauft", when: "kein Datum", why: "verkaufen", score: 1, verdict: "Vorsicht: Werbung" },
            fan: { tab: "Fanseite", col: P.violet, head: "Pieks’ Igelwelt", title: "Igel sind die BESTEN Tiere!!!", text: "Mein Igel Pieks wohnt in unserem Garten. Er trinkt jeden Abend ein Schälchen Milch.", foot: "von: igelfan_12 · kein Datum", who: "unbekannt, nur ein Spitzname", when: "kein Datum", why: "Spaß, eigene Meinung", score: 1, verdict: "Vorsicht: Fehler!" },
          };
          const head = s.h("div", { style: { padding: "8px 14px", borderRadius: "12px 12px 0 0", color: "#fff", font: "700 21px/1.2 var(--f-display)" } }, "");
          const pic = s.photo("igel", { w: 170, h: 130, pos: "50% 50%" });
          const ttl = s.h("p", { class: "h2", style: { fontSize: "27px" } }, "");
          const txt = s.h("p", { class: "t", style: { fontSize: "21px" } }, "");
          const foot = s.h("p", { class: "small", style: { color: P.pencil, borderTop: "2px dashed " + P.line, paddingTop: "6px" } }, "");
          const buy = s.h("span", { class: "u11chip", style: { background: P.orange, color: "#fff", alignSelf: "flex-start" } }, "Jetzt kaufen!");
          const page = s.h("div", { class: "card", style: { padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" } }, head,
            s.h("div", { style: { padding: "10px 16px 12px", display: "flex", flexDirection: "column", gap: "8px" } }, s.h("div", { style: { display: "grid", gridTemplateColumns: "170px 1fr", gap: "14px", alignItems: "start" } }, pic, s.h("div", { class: "stack", style: { gap: "6px" } }, ttl, buy)), txt, foot));
          const W3 = [["Wer?", "who"], ["Wann?", "when"], ["Warum?", "why"]];
          const vals = W3.map(() => s.h("span", { class: "t", style: { fontSize: "21px" } }, ""));
          const rows = W3.map(([q], i) => s.h("div", { style: { display: "grid", gridTemplateColumns: "100px 1fr", gap: "10px", alignItems: "baseline", padding: "6px 0", borderBottom: "2px solid " + P.line } }, s.h("b", { style: { font: "700 23px/1 var(--f-display)", color: P.unit } }, q), vals[i]));
          const meter = s.svg(300, 40); meter.style.width = "300px"; meter.style.height = "40px";
          const stars = [0, 1, 2].map(i => { const st = s.el("path", { d: "M20 2 l5 11 l12 1 l-9 8 l3 12 l-11 -6 l-11 6 l3 -12 l-9 -8 l12 -1 Z", transform: `translate(${i * 46} 2)`, fill: P.line }); meter.append(st); return st; });
          const verdict = s.h("b", { style: { font: "700 23px/1.1 var(--f-display)" } }, "");
          const check = later(s.h("div", { class: "card", style: { padding: "8px 16px 12px", display: "flex", flexDirection: "column", gap: "6px" } }, ...rows, s.h("div", { class: "row", style: { gap: "12px", marginTop: "4px" } }, meter, verdict)));
          const warn = later(s.h("div", { class: "card", style: { padding: "8px 14px", borderColor: P.red, background: "#fff4f2" } }, small(s, [B(s, "Falsch! ", P.red), "Milch ist für Igel gefährlich. Sie vertragen den Milchzucker nicht und bekommen Bauchweh und Durchfall."])));
          const m = later(merk(s, { style: { fontSize: "21px", padding: "10px 16px 12px" } }, "Prüfe jede Quelle: ", B(s, "Wer"), " hat das geschrieben? ", B(s, "Wann"), "? ", B(s, "Warum"), " – informieren, verkaufen oder Spaß? Vergleiche mit einer zweiten Quelle."));
          const lf6 = later(life(s, { style: { padding: "8px 14px" } }, small(s, "Auch bei Videos fragst du: Wer hat das Video gemacht? Will mir jemand etwas verkaufen?", { fontSize: "19px" })));
          const tabs = Object.entries(PAGES).map(([k, p]) => { const b = s.h("button", { class: "btn u11tab", style: { borderColor: p.col, color: p.col }, onclick: () => setP(k, true) }, p.tab); b.dataset.k = k; return b; });
          const setP = (k, snd) => {
            const p = PAGES[k]; if (snd) s.sfx.whoosh();
            head.textContent = p.head; head.style.background = p.col; page.style.borderColor = p.col;
            ttl.textContent = p.title; txt.textContent = p.text; foot.textContent = p.foot; buy.style.display = k === "ad" ? "" : "none";
            W3.forEach(([, key], i) => (vals[i].textContent = p[key]));
            stars.forEach((st, i) => st.setAttribute("fill", i < p.score ? P.yellow : P.line));
            verdict.textContent = p.verdict; verdict.style.color = p.score > 2 ? P.green : P.red;
            tabs.forEach(b => { const on = b.dataset.k === k; b.style.background = on ? p.col : "#fff"; b.style.color = on ? "#fff" : PAGES[b.dataset.k].col; });
          };
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "560px 1fr", gap: "18px", alignItems: "start" },
            s.h("div", { class: "stack", style: { gap: "10px" } }, s.h("div", { class: "row", style: { gap: "10px" } }, ...tabs), page, lf6), s.h("div", { class: "stack", style: { gap: "10px" } }, check, warn, m)));
          setP("lex"); s.show(page, "up"); s.sound("page-turn-1");
          s.step(async () => { s.sfx.pop(); await s.show(check, "left"); s.sound("pencil-write", { vol: .4, dur: 1 }); s.say("Eine Autorin mit Namen, ein Datum, und sie will informieren. Gut!"); });
          s.step(async () => { setP("ad", true); s.sound("cash-register", { vol: .35 }); s.say("Eine Firma will Futter verkaufen. Das ist Werbung."); });
          s.step(async () => { setP("fan", true); s.sfx.error(); await s.show(warn, "up"); s.say("Auf der Fanseite steht sogar etwas Falsches. Milch macht Igel krank."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sfx.pop(); await s.show(lf6, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Falschmeldungen erkennen",
        say: "Im Klassenchat taucht eine aufregende Nachricht auf. Aber stimmt sie? Achte auf die Warnzeichen.",
        build(s) {
          const flag = t => s.h("span", { class: "u11flag" }, t);
          const f1 = flag("Weitergeleitet"), f2 = flag("!!!"), f3 = flag("Das hat mir der Cousin von meinem Nachbarn erzählt."), f4 = flag("Schick das sofort an 10 Leute weiter!"), f5 = flag("ab Montag");
          const bub = (who, col, kids, me) => s.h("div", { style: { display: "flex", flexDirection: "column", alignItems: me ? "flex-end" : "flex-start" } }, s.h("div", { class: "u11bub", style: me ? { background: "#dcf3d0" } : {} }, s.h("b", { style: { display: "block", fontSize: "19px", color: col } }, who), ...kids));
          const m1 = bub("Mila", P.violet, ["Hat jemand die Mathe-Hausaufgabe?"]);
          const m2 = bub("Emre", P.orange, ["Seite 42, Nummer 3"]);
          const fake = later(bub("Leon", P.blue, [s.h("i", { style: { display: "block", fontSize: "19px", color: P.pencil } }, f1), "Die Schule fällt ", f5, " in ganz Berlin drei Wochen lang aus", f2, " ", f3, " ", f4]));
          const phone = s.h("div", { style: { width: "350px", height: "560px", borderRadius: "40px", background: P.ink, padding: "14px", flex: "none" } },
            s.h("div", { style: { height: "100%", borderRadius: "28px", background: "#ece5dd", display: "flex", flexDirection: "column", overflow: "hidden" } },
              s.h("div", { style: { background: P.unit, color: "#fff", padding: "12px 16px", font: "700 21px/1.1 var(--f-display)" } }, "Klasse 5b ", s.h("span", { style: { font: "400 19px var(--f-body)", opacity: .85 } }, "· 27 Mitglieder")),
              s.h("div", { style: { padding: "12px", display: "flex", flexDirection: "column", gap: "10px" } }, m1, m2, fake)));
          const SIG = [
            [f1, "Weitergeleitet", "Niemand weiß, wer es zuerst geschrieben hat."],
            [f2, "Viele Ausrufezeichen", "Die Nachricht will dich aufregen."],
            [f3, "Keine echte Quelle", "„Der Cousin vom Nachbarn“ ist keine Quelle."],
            [f4, "Druck: Weiterschicken!", "Echte Infos brauchen keinen Kettenbrief."],
            [f5, "Kein Datum", "Welcher Montag? Seit wann gilt das?"],
          ];
          const sig = SIG.map(([, a, b], i) => later(s.h("div", { class: "card", style: { padding: "6px 12px", display: "grid", gridTemplateColumns: "40px 1fr", gap: "10px", alignItems: "center" } }, num(s, i + 1, P.red), s.h("div", null, s.h("b", { style: { font: "700 21px/1.2 var(--f-display)", color: P.red } }, a), small(s, b, { fontSize: "19px" })))));
          const CHECK = ["Schul-Website ansehen", "Eltern oder Lehrkraft fragen", "Kindernachrichten prüfen"];
          const check = later(s.h("div", { class: "card soft", style: { padding: "8px 14px", display: "flex", flexDirection: "column", gap: "6px" } }, s.h("b", { style: { font: "700 21px/1.2 var(--f-display)", color: P.unit } }, "So prüfst du nach:"), s.h("div", { class: "row", style: { gap: "6px" } }, ...CHECK.map(c => s.h("span", { class: "u11chip", style: { background: "#fff" } }, c)))));
          const m = later(merk(s, { style: { fontSize: "21px", padding: "8px 16px 10px" } }, B(s, "Erst prüfen, dann teilen."), " Im Zweifel: nicht weiterleiten."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "350px 1fr", gap: "22px", alignItems: "start" }, phone, s.h("div", { class: "stack", style: { gap: "8px" } }, ...sig, check, m)));
          s.show(phone, "up"); s.sfx.pop();
          s.step(async () => { s.sound("telefon-klingelt", { vol: .3, dur: 1 }); await s.show(fake, "up"); s.say("Die Schule fällt drei Wochen aus? Wirklich?"); });
          s.step(async () => { for (const i of [0, 1, 2]) { SIG[i][0].classList.add("on"); s.sfx.error(); await s.show(sig[i], "left"); } });
          s.step(async () => { for (const i of [3, 4]) { SIG[i][0].classList.add("on"); s.sfx.error(); await s.show(sig[i], "left"); } s.say("Fünf Warnzeichen in einer Nachricht."); });
          s.step(async () => { s.sfx.success(); await s.show(check, "up"); s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Ist das Foto echt?",
        say: "Fotos kann man bearbeiten. Hier schwimmt angeblich ein Hai in der Spree. Schieb den Regler und vergleiche mit dem Original.",
        build(s) {
          const W = 600, H = 360, v = s.svg(W, H);
          const scene = s.el("g", null,
            s.el("rect", { x: 0, y: 0, width: W, height: 230, fill: P.sky }),
            s.el("rect", { x: 412, y: 40, width: 8, height: 180, fill: "#9aa3b2" }), s.el("rect", { x: 414.5, y: 6, width: 3, height: 36, fill: "#c03030" }),
            s.el("circle", { cx: 416, cy: 82, r: 22, fill: "#c4ccd8", stroke: "#8a94a6", "stroke-width": 2 }),
            ...[[20, 150, 70, 80], [96, 128, 60, 102], [162, 160, 80, 70], [250, 140, 60, 90], [470, 150, 70, 80], [540, 130, 60, 100]].map(([x, y, w, h]) => s.el("rect", { x, y, width: w, height: h, fill: "#d8c7a8", stroke: "#a08a66", "stroke-width": 2 })),
            s.el("rect", { x: 0, y: 228, width: W, height: 14, fill: "#8a94a6" }),
            s.el("rect", { x: 0, y: 242, width: W, height: 118, fill: "#5b8fb9" }),
            ...[260, 290, 320].map((y, i) => s.el("path", { d: `M${10 + i * 30} ${y} q20 -6 40 0 t40 0 M${250 + i * 40} ${y + 8} q20 -6 40 0 t40 0`, stroke: "#9cc3e0", "stroke-width": 3, fill: "none" })),
            s.el("g", null, s.el("path", { d: "M90 262 h150 l-16 22 h-120 Z", fill: "#fff", stroke: P.ink, "stroke-width": 2 }), s.el("rect", { x: 112, y: 246, width: 100, height: 16, rx: 3, fill: "#fff", stroke: P.ink, "stroke-width": 2 }), ...[124, 148, 172, 196].map(x => s.el("rect", { x, y: 250, width: 12, height: 8, fill: "#9cc3e0" }))),
            s.el("path", { d: "M100 290 h130", stroke: "#3f6f96", "stroke-width": 6, opacity: .5 }));
          const fake = s.el("g", { "clip-path": "url(#u11clip)" },
            s.el("path", { d: "M330 300 Q350 200 420 168 Q412 240 470 300 Z", fill: "#59636f", stroke: "#fff", "stroke-width": 3 }),
            s.el("rect", { x: 0, y: 0, width: 600, height: 34, fill: P.red }), T(s, 300, 25, "SENSATION: Hai in der Spree!", { fill: "#fff", "font-size": 22 }));
          const clip = s.el("clipPath", { id: "u11clip" }, s.el("rect", { x: 0, y: 0, width: 0, height: H }));
          const edge = s.el("line", { x1: 0, y1: 0, x2: 0, y2: H, stroke: "#fff", "stroke-width": 4 });
          const defs = s.el("defs", null, clip);
          const ring = (x, y, r, n) => later(s.el("g", null, s.el("circle", { cx: x, cy: y, r, fill: "none", stroke: P.yellow, "stroke-width": 5, "stroke-dasharray": "10 6" }), s.el("circle", { cx: x + r * .72, cy: y - r * .72, r: 15, fill: P.red }), T(s, x + r * .72, y - r * .72 + 7, String(n), { fill: "#fff", "font-size": 19 })));
          const rg1 = ring(388, 206, 42, 1), rg2 = ring(392, 328, 26, 2), rg3 = ring(456, 270, 24, 3);
          v.append(defs, scene, fake, edge, rg1, rg2, rg3);
          const setX = x => { clip.firstChild.setAttribute("width", x); edge.setAttribute("x1", x); edge.setAttribute("x2", x); edge.style.opacity = x <= 1 || x >= W - 1 ? 0 : 1; };
          setX(0);
          const sl = s.slider({ label: "Original ⟷ bearbeitet", min: 0, max: 100, step: 1, value: 0, fmt: x => x < 50 ? "Original" : "bearbeitet", onInput: x => setX(x * W / 100) });
          const CLUES = [["Größe passt nicht", "Die Flosse ist fast so hoch wie die Häuser am Ufer. So ein Hai wäre größer als das Schiff!"], ["Keine Spiegelung, keine Wellen", "Im Wasser fehlt das Spiegelbild – das Schiff hat eins."], ["Harte Kanten", "Der weiße Rand zeigt: Hier wurde etwas hineinkopiert."]];
          const clues = CLUES.map(([a, b], i) => later(s.h("div", { class: "card", style: { padding: "6px 12px", display: "grid", gridTemplateColumns: "40px 1fr", gap: "10px", alignItems: "center" } }, num(s, i + 1, P.red), s.h("div", null, s.h("b", { style: { font: "700 21px/1.2 var(--f-display)", color: P.red } }, a), small(s, b, { fontSize: "19px" })))));
          const tip = later(s.h("div", { class: "card soft", style: { padding: "8px 14px" } }, small(s, [B(s, "Prüfen: "), "Wer hat das Foto gemacht? Wo kommt es her? Berichten Kindernachrichten darüber? Mit einer ", B(s, "Bildersuche"), " findest du oft das Original."])));
          const m = later(merk(s, { style: { fontSize: "21px", padding: "8px 16px 10px" } }, "Fotos können ", B(s, "bearbeitet"), " sein – mit Bildprogrammen und heute auch mit KI. Ein Foto allein ist noch kein Beweis."));
          const lf = later(life(s, { style: { padding: "8px 14px" } }, small(s, "Auch Werbefotos werden oft bearbeitet: Der Burger auf dem Plakat sieht viel saftiger aus als der echte.")));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "600px 1fr", gap: "18px", alignItems: "start" }, s.h("div", { class: "stack", style: { gap: "8px" } }, s.h("div", { class: "card", style: { padding: "6px" } }, v), sl, lf), s.h("div", { class: "stack", style: { gap: "8px" } }, ...clues, tip, m)));
          s.show(v, "fade"); s.sound("waves", { vol: .25, dur: 2.5 });
          const slide = async (to, dur) => { const inp = sl.querySelector("input"); const from = +inp.value; await s.tween({ from, to, dur: s.fast ? 1 : dur, ease: "inOut", update: x => { inp.value = x; setX(x * W / 100); } }); inp.value = to; setX(to * W / 100); inp.dispatchEvent(new Event("input")); };
          s.step(async () => { s.sfx.whoosh(); await slide(100, 1400); s.sfx.zap(); s.say("Sensation! Ein Hai in der Spree. Aber stimmt das?"); });
          s.step(async () => { s.sfx.pop(); s.show(rg1, "pop"); await s.show(clues[0], "left"); s.sfx.pop(); s.show(rg2, "pop"); await s.show(clues[1], "left"); });
          s.step(async () => { s.sfx.pop(); s.show(rg3, "pop"); await s.show(clues[2], "left"); s.say("Schieb den Regler zurück: So sah das Original aus."); });
          s.step(async () => { s.sfx.ding(); await s.show(tip, "up"); await s.show(m, "up"); s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Das Hörspiel",
        say: "Ein Hörspiel erzählt eine Geschichte nur mit Tönen: mit Stimmen, Geräuschen und Musik. Die Bilder entstehen in deinem Kopf.",
        build(s) {
          const LANES = [["Stimmen", P.blue], ["Geräusche", P.orange], ["Musik", P.violet]];
          const DUR = 11;
          const EV = [
            { t: 0, d: 9, lane: 2, lbl: "spannende Musik", play: () => s.sound("spannungsmusik", { vol: .35 }) },
            { t: .3, d: 3.4, lane: 0, lbl: "Erzählerin", play: () => read(s, "Es ist Nacht. Mila schleicht durch den dunklen Garten.") },
            { t: 3.4, d: 1.8, lane: 1, lbl: "Schritte", play: () => s.sound("footsteps", { vol: .7 }) },
            { t: 5.3, d: 1.9, lane: 1, lbl: "Eule", play: () => s.sound("owl", { vol: .6, dur: 2.6 }) },
            { t: 6.6, d: 2, lane: 0, lbl: "Mila", play: () => read(s, "Hallo? Ist da jemand?", { rate: 1.05 }) },
            { t: 8.4, d: 2.4, lane: 1, lbl: "Tür knarrt", play: () => s.sound("door-creak", { vol: .7 }) },
          ];
          const W = 680, H = 250, X0 = 130, PX = (W - X0 - 10) / DUR, v = s.svg(W, H);
          const laneG = LANES.map(([n, c], i) => { const y = 14 + i * 74; const g = later(s.el("g", null, s.el("rect", { x: 0, y, width: W, height: 62, rx: 12, fill: c + "14" }), T(s, 12, y + 39, n, { "text-anchor": "start", fill: c, "font-size": 21 }))); v.append(g); return g; });
          const blocks = EV.map(e => { const y = 14 + e.lane * 74 + 9, x = X0 + e.t * PX, w = e.d * PX - 4, c = LANES[e.lane][1]; const g = s.el("g", null, s.el("rect", { x, y, width: w, height: 44, rx: 9, fill: c }), T(s, x + w / 2, y + 29, e.lbl, { fill: "#fff", "font-size": 19 })); e.g = g; laneG[e.lane].append(g); return g; });
          const head = s.el("line", { x1: X0, y1: 4, x2: X0, y2: H - 8, stroke: P.red, "stroke-width": 4, opacity: 0 });
          v.append(head);
          let active = new Set(), run = 0;
          const play = async () => {
            const id = ++run; head.setAttribute("opacity", 1); const done = new Set();
            if (s.fast) return;
            await s.tween({ from: 0, to: DUR, dur: DUR * 1000, ease: "linear", update: t => {
              if (id !== run) return;
              head.setAttribute("x1", X0 + t * PX); head.setAttribute("x2", X0 + t * PX);
              EV.forEach((e, i) => { if (!done.has(i) && t >= e.t && active.has(e.lane)) { done.add(i); e.play(); e.g.classList.remove("a-pop"); void e.g.getBoundingClientRect(); e.g.classList.add("a-pop"); } });
            } });
            if (id === run) head.setAttribute("opacity", 0);
          };
          const btn = s.h("button", { class: "btn solid", onclick: () => play() }, "▶ Szene abspielen");
          const left = s.h("div", { class: "card", style: { padding: "10px 14px", display: "flex", flexDirection: "column", gap: "8px" } },
            s.h("div", { class: "row", style: { justifyContent: "space-between" } }, s.h("p", { class: "h2", style: { fontSize: "25px", color: P.unit } }, "Szene: Nachts im Garten"), btn), v);
          const DEF = [
            ["Stimmen", "Erzähler und Figuren sprechen. Die Stimme zeigt Gefühle: flüstern, rufen, zittern."],
            ["Geräusche", "Schritte, eine Eule, eine Tür: Du weißt sofort, wo du bist."],
            ["Musik", "Sie macht Stimmung: spannend, lustig, traurig."],
          ];
          const defs = DEF.map(([a, b], i) => later(s.h("div", { class: "card", style: { padding: "6px 12px", borderColor: LANES[i][1] } }, small(s, [B(s, a + ": ", LANES[i][1]), b], { fontSize: "19px" }))));
          const pic = s.photo("hoerspiel-1949", { w: 330, h: 230, pos: "50% 40%", caption: "Hörspiel-Aufnahme im Radio, 1949" });
          const info = later(s.h("div", { class: "card soft", style: { padding: "8px 14px" } }, small(s, ["Berühmt: ", B(s, "„Die drei ???“"), " – als Hörspiel seit 1979."], { fontSize: "19px" })));
          const lf9 = later(life(s, { style: { padding: "8px 14px" } }, small(s, "Hörspiele hörst du im Radio, als Podcast, auf CD oder in einer App – auf langen Autofahrten oder vor dem Einschlafen.", { fontSize: "19px" })));
          const m = later(merk(s, { style: { fontSize: "21px", padding: "8px 16px 10px" } }, "Ein ", B(s, "Hörspiel"), " erzählt nur mit Ton: ", B(s, "Stimmen, Geräusche, Musik"), ". Die Bilder macht dein Kopf."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "1fr 330px", gap: "18px", alignItems: "start" }, s.h("div", { class: "stack", style: { gap: "8px" } }, left, ...defs, lf9), s.h("div", { class: "stack", style: { gap: "10px" } }, pic, info, m)));
          s.show(left, "up"); s.sfx.pop();
          LANES.forEach((_, i) => s.step(async () => { active.add(i); s.sfx.count(i * 2); s.show(laneG[i], "left"); await s.show(defs[i], "up"); play(); }));
          s.step(async () => { s.sfx.ding(); await s.show(info, "up"); await s.show(m, "up"); s.sfx.pop(); await s.show(lf9, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Der Geräuschemacher",
        say: "Viele Geräusche in Filmen und Hörspielen sind nachgemacht. Ein Geräuschemacher benutzt dafür ganz alltägliche Dinge.",
        build(s) {
          const draw = {
            kokos: v => v.append(s.el("path", { d: "M8 40 a22 22 0 0 1 44 0 Z", fill: "#7a4a24" }), s.el("path", { d: "M48 46 a22 22 0 0 1 44 0 Z", fill: "#8a5a2b" }), s.el("path", { d: "M10 40 h40 M50 46 h40", stroke: "#f6ead8", "stroke-width": 4 })),
            pferd: v => v.append(s.el("ellipse", { cx: 46, cy: 36, rx: 26, ry: 13, fill: "#8a5a2b" }), s.el("path", { d: "M66 30 L84 12 L92 18 L76 36 Z", fill: "#8a5a2b" }), s.el("path", { d: "M28 46 l-4 16 M40 48 l2 16 M56 48 l-3 16 M66 44 l5 16", stroke: "#8a5a2b", "stroke-width": 5, "stroke-linecap": "round" }), s.el("path", { d: "M20 30 q-12 4 -14 16", stroke: P.ink, "stroke-width": 4, fill: "none" })),
            folie: v => v.append(s.el("path", { d: "M20 20 L50 8 L80 22 L72 54 L44 62 L16 48 Z", fill: "#d9ecff", stroke: "#8fb6dd", "stroke-width": 2 }), s.el("path", { d: "M30 22 L48 40 L70 26 M26 44 L48 40 L60 56", stroke: "#fff", "stroke-width": 3, fill: "none" })),
            feuer: v => v.append(s.el("path", { d: "M50 6 C64 24 76 34 70 50 C66 62 34 62 30 50 C26 38 40 32 38 20 C46 28 50 18 50 6 Z", fill: P.orange }), s.el("path", { d: "M50 30 C58 40 62 46 58 54 C54 60 44 60 42 54 C40 48 48 42 50 30 Z", fill: P.yellow }), s.el("path", { d: "M26 62 L74 54 M26 54 L74 62", stroke: "#7a4a24", "stroke-width": 6, "stroke-linecap": "round" })),
            reis: v => v.append(s.el("path", { d: "M14 50 h72 l-6 12 h-60 Z", fill: "#9aa3b2" }), ...Array.from({ length: 14 }, (_, i) => s.el("ellipse", { cx: 30 + (i * 17) % 42, cy: 8 + (i * 11) % 38, rx: 2.4, ry: 4.5, fill: "#f4ecd8", stroke: "#b8a77f", "stroke-width": 1 }))),
            regen: v => v.append(s.el("ellipse", { cx: 50, cy: 22, rx: 34, ry: 14, fill: "#9aa6b8" }), s.el("circle", { cx: 36, cy: 16, r: 13, fill: "#aab4c4" }), s.el("circle", { cx: 60, cy: 12, r: 15, fill: "#aab4c4" }), ...[24, 40, 56, 72].map((x, i) => s.el("path", { d: `M${x} ${42 + (i % 2) * 6} l-4 12`, stroke: P.blue, "stroke-width": 4, "stroke-linecap": "round" }))),
          };
          const pic = k => { const v = mini(s, 100, 70); draw[k](v); return v; };
          const ROWS = [
            ["kokos", "zwei Kokosnussschalen", "kokosnuss-hufe", "pferd", "Pferdehufe", "horse-gallop"],
            ["folie", "Zellophanfolie knüllen", "zellophan", "feuer", "knisterndes Feuer", "fire"],
            ["reis", "Reis rieselt in einen Topf", "reis-rieselt", "regen", "prasselnder Regen", "rain"],
          ];
          const rows = ROWS.map(([pa, la, sa, pb, lb, sb]) => {
            const fakeB = s.soundBtn(sa, "nachgemacht", { vol: .9, dur: 4 }), realB = s.soundBtn(sb, "echt", { vol: .8, dur: 4 });
            const el = later(s.h("div", { class: "card", style: { padding: "8px 14px", display: "grid", gridTemplateColumns: "100px 1fr 50px 100px 1fr", gap: "12px", alignItems: "center" } },
              pic(pa), s.h("div", { class: "stack", style: { gap: "6px" } }, s.h("b", { style: { font: "700 21px/1.2 var(--f-display)", color: P.orange } }, la), fakeB),
              s.h("span", { style: { font: "800 34px/1 var(--f-display)", color: P.unit, textAlign: "center" } }, "→"),
              pic(pb), s.h("div", { class: "stack", style: { gap: "6px" } }, s.h("b", { style: { font: "700 21px/1.2 var(--f-display)", color: P.green } }, "klingt wie: " + lb), realB)));
            el.sa = sa; return el;
          });
          const hdr = s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } }, s.h("p", { class: "h2", style: { fontSize: "25px", color: P.orange } }, "Das macht der Geräuschemacher …"), s.h("p", { class: "h2", style: { fontSize: "25px", color: P.green } }, "… und das hörst du im Film"));
          const m = later(merk(s, { style: { fontSize: "21px", padding: "8px 16px 10px" } }, B(s, "Geräuschemacher"), " machen Geräusche für Filme und Hörspiele mit Alltagsdingen nach. Auf Englisch heißt das ", B(s, "Foley"), " – nach Jack Foley, einem Tontechniker aus Hollywood."));
          const lf = later(life(s, { style: { padding: "8px 14px" } }, small(s, "Probier es aus: Lederhandschuhe schnell hin und her wedeln klingt wie Vogelflügel. Ein Säckchen Mehl drücken klingt wie Schritte im Schnee.")));
          s.add(root(s, "stack", { gap: "10px" }, hdr, ...rows, m, lf));
          s.show(hdr, "down"); s.sfx.pop();
          rows.forEach((r, i) => s.step(async () => { s.sound(r.sa, { vol: .9, dur: 3 }); await s.show(r, "left"); s.say(ROWS[i][1] + " klingen wie " + ROWS[i][4] + "."); }));
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Im Alltag: Hörspiel selbst machen",
        say: "Ein eigenes Hörspiel kannst du mit einem Handy oder Tablet aufnehmen. Du brauchst ein Skript, Sprecher und ein paar Dinge für Geräusche.",
        build(s) {
          const SCRIPT = [
            ["Erzählerin", "Es ist Montagmorgen. Emre steht vor Milas Tür."],
            ["Geräusch", "Klopfen", "knock"],
            ["Emre", "Mila, beeil dich! Der Bus kommt gleich!"],
            ["Geräusch", "Reißverschluss", "zipper"],
            ["Mila", "Ich komme ja schon! Wo ist nur mein Turnbeutel?"],
            ["Geräusch", "Tür knarrt, Schritte", "door-creak"],
          ];
          const lines = SCRIPT.map(([who, t, snd]) => later(snd
            ? s.h("button", { class: "btn", style: { minHeight: "48px", alignSelf: "flex-start", borderColor: P.orange, color: P.orange, fontSize: "19px" }, onclick: () => s.sound(snd, { vol: .8, force: true }) }, "[ Geräusch: " + t + " ]")
            : s.h("p", { style: { margin: 0, fontSize: "21px", lineHeight: 1.3 } }, s.h("b", { style: { color: who === "Erzählerin" ? P.pencil : who === "Mila" ? P.violet : P.blue } }, who + ": "), t)));
          let run = 0;
          const playAll = async () => {
            const id = ++run;
            for (const [who, t, snd] of SCRIPT) {
              if (!s.alive || id !== run) return;
              if (snd) { s.sound(snd, { vol: .8, force: true }); if (snd === "door-creak") s.sound("footsteps", { vol: .6, when: 1.4, force: true }); await s.wait(snd === "zipper" ? 1100 : 2000); }
              else { read(s, t, { rate: who === "Erzählerin" ? .95 : 1.05 }); await s.wait(t.length * 70 + 600); }
            }
          };
          const script = s.h("div", { class: "card", style: { padding: "10px 16px", background: "#fffef6", display: "flex", flexDirection: "column", gap: "6px" } },
            s.h("div", { class: "row", style: { justifyContent: "space-between" } }, s.h("p", { style: { margin: 0, font: "800 23px/1.1 var(--f-display)", color: P.unit } }, "Skript: Der Turnbeutel"), s.h("button", { class: "btn solid", onclick: () => playAll() }, "▶ Anhören")), ...lines);
          const STEPS = [["Geschichte wählen", "kurz, mit 2–3 Figuren"], ["Skript schreiben", "Wer spricht? Welches Geräusch?"], ["Geräusche sammeln", "Was klingt wie …?"], ["Aufnehmen", "leiser Raum, nah ans Mikrofon"], ["Anhören, verbessern", "noch mal, bis es passt"]];
          const steps = STEPS.map(([a, b], i) => later(s.h("div", { class: "card", style: { padding: "6px 12px", display: "grid", gridTemplateColumns: "40px 1fr", gap: "10px", alignItems: "center" } }, num(s, i + 1), s.h("div", null, s.h("b", { style: { font: "700 21px/1.2 var(--f-display)", color: P.unit } }, a), small(s, b, { fontSize: "19px" })))));
          const KIT = [["paper-crumple", "Papier knüllen"], ["water-pour", "Wasser gießen"], ["scissors", "Schere"], ["keyboard", "Tastatur"]];
          const kit = later(s.h("div", { class: "card soft", style: { padding: "8px 12px", display: "flex", flexDirection: "column", gap: "6px" } }, s.h("b", { style: { font: "700 21px/1.2 var(--f-display)", color: P.unit } }, "Geräusche aus dem Kinderzimmer:"),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" } }, ...KIT.map(([id, l]) => { const b = s.soundBtn(id, l, { vol: .8, dur: 2.5 }); b.style.fontSize = "19px"; b.style.padding = "0 10px"; return b; }))));
          const m11 = later(merk(s, { style: { fontSize: "21px", padding: "8px 16px 10px" } }, "Im ", B(s, "Skript"), " steht, wer was sagt. Geräusche und Hinweise stehen in ", B(s, "Klammern"), "."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "1fr 420px", gap: "18px", alignItems: "start" }, s.h("div", { class: "stack", style: { gap: "10px" } }, script, kit), s.h("div", { class: "stack", style: { gap: "8px" } }, ...steps, m11)));
          s.show(script, "up"); s.sound("page-turn-3");
          s.step(async () => { for (const i of [0, 1]) { s.sfx.count(i); await s.show(steps[i], "left"); } s.sound("pencil-write", { vol: .4, dur: 1.2 }); for (const l of lines) await s.show(l, "fade"); s.say("Im Skript stehen die Sätze und die Geräusche."); });
          s.step(async () => { s.sfx.count(2); await s.show(steps[2], "left"); s.sound("paper-crumple", { vol: .6 }); await s.show(kit, "up"); });
          s.step(async () => { for (const i of [3, 4]) { s.sfx.count(i + 1); await s.show(steps[i], "left"); } s.sfx.success(); s.say("Aufnehmen, anhören, verbessern. Fertig ist dein Hörspiel!"); await s.show(m11, "up"); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Film: Einstellungsgrößen",
        say: "Im Film entscheidet die Kamera, wie viel du siehst. Das nennt man Einstellungsgröße: von der Totale bis zum Detail.",
        build(s) {
          const VW = 800, VH = 450;
          const v = s.svg(VW, VH); v.style.width = "720px"; v.style.height = "405px"; v.style.display = "block"; v.setAttribute("preserveAspectRatio", "xMidYMid slice");
          v.append(s.el("rect", { x: 0, y: 0, width: VW, height: VH, fill: P.sky }),
            s.el("rect", { x: 616, y: 70, width: 10, height: 310, fill: "#9aa3b2" }), s.el("rect", { x: 619, y: 30, width: 4, height: 44, fill: "#c03030" }), s.el("circle", { cx: 621, cy: 120, r: 26, fill: "#c4ccd8", stroke: "#8a94a6", "stroke-width": 2 }),
            ...[[20, 250, 120, 130], [150, 220, 90, 160], [470, 240, 110, 140], [690, 230, 100, 150]].map(([x, y, w, h]) => s.el("rect", { x, y, width: w, height: h, fill: "#e3d6bd", stroke: "#a08a66", "stroke-width": 2 })),
            s.el("rect", { x: 0, y: 380, width: VW, height: 70, fill: "#b8bfca" }),
            s.el("rect", { x: 292, y: 230, width: 6, height: 150, fill: "#6b7280" }), s.el("circle", { cx: 295, cy: 226, r: 22, fill: "#f2c500", stroke: "#138a5a", "stroke-width": 5 }), s.el("path", { d: "M287 216 v20 M303 216 v20 M287 226 h16", stroke: "#138a5a", "stroke-width": 4 }),
            kid(s, 400, 215, P.unit),
            s.el("g", null, s.el("rect", { x: 428, y: 278, width: 18, height: 12, rx: 1.5, fill: "#fff", stroke: P.red, "stroke-width": 1 }), s.el("path", { d: "M431 282 h12 M431 285 h8", stroke: P.red, "stroke-width": .8 })),
            s.el("circle", { cx: 432, cy: 289, r: 4.5, fill: P.skin, stroke: P.ink, "stroke-width": .8 }));
          const frame = s.h("div", { style: { position: "relative", width: "720px", height: "405px", borderRadius: "14px", overflow: "hidden", border: "6px solid " + P.ink, boxSizing: "content-box" } }, v,
            s.h("span", { style: { position: "absolute", left: "14px", top: "10px", font: "700 19px/1 var(--f-display)", color: P.red, background: "rgba(255,255,255,.85)", padding: "4px 8px", borderRadius: "8px" } }, "● REC"));
          const SIZES = [
            ["Totale", [0, 0, 800, 450], "Der ganze Ort, die Figur ist klein darin.", "Wo sind wir? Überblick am Anfang einer Szene."],
            ["Halbtotale", [213, 178, 373, 210], "Die Figur von Kopf bis Fuß.", "Was tut die Figur? Gehen, rennen, warten."],
            ["Nah", [320, 183, 160, 90], "Kopf und Oberkörper.", "Gespräche – wie bei Nachrichtensprechern."],
            ["Groß", [352, 186, 96, 54], "Nur das Gesicht.", "Gefühle: Freude, Angst, Staunen."],
            ["Detail", [418, 272, 36, 20], "Ein kleiner Ausschnitt.", "Wichtige Dinge: die Fahrkarte in der Hand."],
          ];
          let cur = [0, 0, 800, 450], ci = 0;
          const nameEl = s.h("p", { class: "big", style: { color: P.unit } }, "");
          const seeEl = s.h("p", { class: "t", style: { fontSize: "22px" } }, "");
          const forEl = s.h("p", { class: "t", style: { fontSize: "22px" } }, "");
          const go = async (i, snd) => {
            ci = i; const to = SIZES[i][1], from = cur.slice();
            nameEl.textContent = SIZES[i][0]; seeEl.replaceChildren(B(s, "Du siehst: "), SIZES[i][2]); forEl.replaceChildren(B(s, "Wofür? ", P.unit), SIZES[i][3]);
            btns.forEach((b, j) => b.classList.toggle("solid", j === i)); if (snd !== false) s.sound("camera-shutter", { vol: .4 });
            if (!s.fast) await s.tween({ from: 0, to: 1, dur: 800, ease: "inOut", update: t => { cur = from.map((a, k) => a + (to[k] - a) * t); v.setAttribute("viewBox", cur.join(" ")); } });
            cur = to.slice(); v.setAttribute("viewBox", cur.join(" "));
          };
          const btns = SIZES.map(([n], i) => s.h("button", { class: "btn", style: { flex: 1, padding: "0 8px" }, onclick: () => go(i) }, n));
          const desc = s.h("div", { class: "card", style: { padding: "12px 18px", display: "flex", flexDirection: "column", gap: "10px", minHeight: "300px" } }, nameEl, seeEl, forEl);
          const m = later(merk(s, { style: { fontSize: "21px", padding: "8px 16px 10px" } }, "Je ", B(s, "näher"), " die Kamera, desto mehr Gefühl. Je ", B(s, "weiter"), ", desto mehr Überblick."));
          const lf = later(life(s, { style: { padding: "8px 14px" } }, small(s, "Fußball im Fernsehen: Totale fürs Spielfeld, Nah beim Interview, Groß beim Jubel, Detail auf den Ball am Elfmeterpunkt.")));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "732px 1fr", gap: "16px", alignItems: "start" },
            s.h("div", { class: "stack", style: { gap: "10px" } }, frame, s.h("div", { style: { display: "flex", gap: "8px" } }, ...btns), lf), s.h("div", { class: "stack", style: { gap: "10px" } }, desc, m)));
          go(0, false); s.sfx.pop();
          [1, 2, 3, 4].forEach(i => s.step(async () => { await go(i); s.say(SIZES[i][0] + ". " + SIZES[i][2]); }));
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sound("crowd-cheer", { vol: .3, dur: 2 }); await s.show(lf, "up"); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Kameraperspektive",
        say: "Auch die Höhe der Kamera verändert die Wirkung. Von unten wirkt jemand groß und mächtig, von oben klein.",
        build(s) {
          const W = 400, H = 400, d = s.svg(W, H);
          d.append(s.el("rect", { x: 0, y: 0, width: W, height: H, rx: 16, fill: "#f4f6fa" }), s.el("line", { x1: 10, y1: 360, x2: 390, y2: 360, stroke: P.ink, "stroke-width": 3 }), kid(s, 270, 230, P.green, 1.1));
          const CAMS = { frosch: [110, 340], normal: [110, 230], vogel: [130, 70] };
          const sight = s.el("path", { d: "", stroke: P.red, "stroke-width": 3, "stroke-dasharray": "8 6", fill: "none" });
          const cam = s.el("g", null, s.el("rect", { x: -26, y: -16, width: 44, height: 32, rx: 6, fill: P.ink }), s.el("path", { d: "M18 -8 L32 -14 V14 L18 8 Z", fill: P.ink }), s.el("circle", { cx: -4, cy: 0, r: 8, fill: "#9cc3e0" }));
          d.append(sight, cam);
          const pv = s.svg(420, 300); pv.style.borderRadius = "14px"; pv.style.border = "5px solid " + P.ink; pv.style.flex = "none"; pv.style.width = "390px"; pv.style.height = "279px";
          const views = {
            frosch: s.el("g", null, s.el("rect", { x: 0, y: 0, width: 420, height: 300, fill: P.sky }), s.el("path", { d: "M300 300 L318 0 L330 0 L336 300 Z", fill: "#9aa3b2", opacity: .6 }),
              s.el("path", { d: "M150 300 L170 160 L250 160 L270 300 Z", fill: P.ink }), s.el("path", { d: "M160 170 Q160 60 210 58 Q260 60 260 170 Z", fill: P.green }), s.el("circle", { cx: 210, cy: 52, r: 30, fill: P.skin, stroke: P.ink, "stroke-width": 2 }), s.el("path", { d: "M184 44 Q186 18 210 18 Q234 18 236 44 Q222 30 210 32 Q196 30 184 44 Z", fill: P.hair }), s.el("path", { d: "M198 66 Q210 72 222 66", stroke: P.ink, "stroke-width": 2.5, fill: "none" })),
            normal: s.el("g", null, s.el("rect", { x: 0, y: 0, width: 420, height: 300, fill: P.sky }), s.el("rect", { x: 0, y: 220, width: 420, height: 80, fill: "#b8bfca" }), kid(s, 210, 108, P.green, 1.2)),
            vogel: s.el("g", null, s.el("rect", { x: 0, y: 0, width: 420, height: 300, fill: "#c9ced8" }), ...Array.from({ length: 11 }, (_, i) => s.el("line", { x1: i * 42, y1: 0, x2: i * 42, y2: 300, stroke: "#b0b7c3", "stroke-width": 2 })), ...Array.from({ length: 8 }, (_, i) => s.el("line", { x1: 0, y1: i * 42, x2: 420, y2: i * 42, stroke: "#b0b7c3", "stroke-width": 2 })),
              s.el("ellipse", { cx: 222, cy: 168, rx: 34, ry: 14, fill: "rgba(0,0,0,.18)" }), s.el("ellipse", { cx: 210, cy: 158, rx: 30, ry: 17, fill: P.green }), s.el("circle", { cx: 210, cy: 152, r: 15, fill: P.hair }), s.el("path", { d: "M188 168 l-4 12 M232 168 l4 12", stroke: P.green, "stroke-width": 6, "stroke-linecap": "round" })),
          };
          Object.values(views).forEach(g => pv.append(g));
          const INFO = {
            frosch: ["Froschperspektive", "Kamera unten, schaut nach oben.", "Die Figur wirkt groß, stark, mächtig – oder bedrohlich."],
            normal: ["Normalsicht", "Kamera in Augenhöhe.", "Wie im echten Leben: Wir sind auf Augenhöhe."],
            vogel: ["Vogelperspektive", "Kamera oben, schaut nach unten.", "Die Figur wirkt klein, allein, verloren. Man hat Überblick."],
          };
          const nameEl = s.h("p", { class: "h2", style: { color: P.unit, fontSize: "24px" } }, ""), a1 = small(s, ""), a2 = small(s, "");
          const desc = s.h("div", { class: "card", style: { padding: "10px 14px", display: "flex", flexDirection: "column", gap: "10px", flex: "1", minWidth: "0" } }, nameEl, a1, a2);
          let cp = CAMS.normal.slice();
          const place = ([x, y]) => { const ang = Math.atan2(200 - y, 270 - x) * 180 / Math.PI; cam.setAttribute("transform", `translate(${x} ${y}) rotate(${ang})`); sight.setAttribute("d", `M${x} ${y} L250 190 M${x} ${y} L250 300`); };
          const go = async k => {
            btns.forEach(b => b.classList.toggle("solid", b.dataset.k === k));
            Object.entries(views).forEach(([kk, g]) => (g.style.display = kk === k ? "" : "none"));
            const [n, x1, x2] = INFO[k]; nameEl.textContent = n; a1.replaceChildren(B(s, "Wo? "), x1); a2.replaceChildren(B(s, "Wirkung: ", P.unit), x2);
            s.sfx.whoosh(); const from = cp.slice(), to = CAMS[k];
            if (!s.fast) await s.tween({ from: 0, to: 1, dur: 700, ease: "inOut", update: t => { cp = [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t]; place(cp); } });
            cp = to.slice(); place(cp); s.sound("camera-shutter", { vol: .4 });
          };
          const btns = Object.keys(INFO).map(k => { const b = s.h("button", { class: "btn", style: { flex: 1, padding: "0 8px" }, onclick: () => go(k) }, INFO[k][0]); b.dataset.k = k; return b; });
          const lf = later(life(s, { style: { padding: "8px 14px" } }, small(s, "Superhelden und Torhüter werden oft von unten gefilmt – sie wirken riesig. Eine Drohne zeigt das Olympiastadion von oben, fast wie eine Karte.", { fontSize: "19px" })));
          const m = later(merk(s, { style: { fontSize: "21px", padding: "8px 16px 10px" } }, "Die ", B(s, "Kameraperspektive"), " zeigt, wie wir eine Figur sehen sollen: von unten, auf Augenhöhe oder von oben."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "400px 1fr", gap: "20px", alignItems: "start" }, s.h("div", { class: "stack", style: { gap: "10px" } }, d, m),
            s.h("div", { class: "stack", style: { gap: "10px" } }, s.h("div", { style: { display: "flex", gap: "8px" } }, ...btns), s.h("div", { class: "row", style: { gap: "12px", alignItems: "stretch", flexWrap: "nowrap" } }, pv, desc), lf)));
          views.frosch.style.display = "none"; views.vogel.style.display = "none"; place(cp); go("normal");
          s.step(async () => { await go("frosch"); s.say("Froschperspektive: Die Figur wirkt groß und mächtig."); });
          s.step(async () => { await go("vogel"); s.say("Vogelperspektive: Die Figur wirkt klein."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Das Storyboard",
        say: "Bevor gedreht wird, zeichnet man ein Storyboard. Das ist der Plan des Films, Bild für Bild, wie ein Comic.",
        build(s) {
          const PW = 250, PH = 150;
          const wagon = v => v.append(s.el("rect", { x: 0, y: 0, width: PW, height: PH, fill: "#f5f0e1" }), s.el("rect", { x: 10, y: 14, width: 230, height: 54, rx: 6, fill: "#cfe3ff", stroke: "#8a94a6", "stroke-width": 2 }), ...[60, 120, 180].map(x => s.el("line", { x1: x, y1: 14, x2: x, y2: 68, stroke: "#8a94a6", "stroke-width": 2 })), s.el("rect", { x: 0, y: 112, width: PW, height: 38, fill: "#d8c08e" }));
          const PANELS = [
            ["Totale", "In der U-Bahn. Mila sitzt mit ihrem Turnbeutel.", "U-Bahn rattert", v => { wagon(v); v.append(kid(s, 80, 70, P.violet, .45), kid(s, 190, 70, P.blue, .45), s.el("rect", { x: 92, y: 100, width: 26, height: 18, rx: 4, fill: P.orange })); }, () => s.sound("ubahn-train", { vol: .35, dur: 2.5 })],
            ["Halbtotale", "„Nächster Halt!“ Mila springt auf und rennt zur Tür.", "Türen piepen", v => { wagon(v); v.append(s.el("rect", { x: 196, y: 10, width: 46, height: 104, fill: "#e5e7eb", stroke: "#8a94a6", "stroke-width": 2 }), kid(s, 150, 46, P.violet, .62)); }, () => s.sound("ubahn-tueren", { vol: .4, dur: 2.5 })],
            ["Detail", "Der Turnbeutel liegt noch auf dem Sitz.", "spannende Musik", v => { v.append(s.el("rect", { x: 0, y: 0, width: PW, height: PH, fill: "#3b4a6b" }), s.el("rect", { x: 0, y: 92, width: PW, height: 58, fill: "#5b6b8f" }), s.el("path", { d: "M80 100 Q74 50 125 46 Q176 50 170 100 Z", fill: P.orange }), s.el("path", { d: "M100 50 Q125 16 150 50", stroke: P.ink, "stroke-width": 4, fill: "none" })); }, () => s.sound("heartbeat", { vol: .5, dur: 2 })],
            ["Groß", "Mila merkt es: „Oh nein, mein Turnbeutel!“", "Mila ruft", v => { v.append(s.el("rect", { x: 0, y: 0, width: PW, height: PH, fill: P.sky }), kid(s, 125, 76, P.violet, 2.2, "oh")); }, () => read(s, "Oh nein, mein Turnbeutel!", { rate: 1.1 })],
          ];
          const CAM = [["Normalsicht", "4 Sekunden"], ["Normalsicht", "3 Sekunden"], ["von oben", "2 Sekunden"], ["Normalsicht", "2 Sekunden"]];
          const panels = PANELS.map(([size, what, snd, draw], i) => {
            const v = s.svg(PW, PH); v.style.width = "100%"; v.style.height = "auto"; v.style.borderRadius = "8px"; v.style.border = "3px solid " + P.ink; v.style.display = "block";
            const clip = s.el("clipPath", { id: "u11sb" + i }, s.el("rect", { x: 0, y: 0, width: PW, height: PH }));
            const g = s.el("g", { "clip-path": `url(#u11sb${i})` }); draw(g); v.append(s.el("defs", null, clip), g);
            return later(s.h("div", { class: "card", style: { padding: "8px 10px", display: "flex", flexDirection: "column", gap: "6px" } },
              s.h("div", { class: "row", style: { justifyContent: "space-between", gap: "6px" } }, s.h("b", { style: { font: "700 21px/1 var(--f-display)", color: P.unit } }, "Bild " + (i + 1)), s.h("span", { class: "u11chip" }, size)),
              v, small(s, what, { fontSize: "19px", lineHeight: 1.3 }), small(s, [B(s, "Ton: ", P.orange), snd], { fontSize: "19px" }),
              small(s, [B(s, "Kamera: ", P.violet), CAM[i][0]], { fontSize: "19px" }), small(s, [B(s, "Dauer: ", P.green), CAM[i][1]], { fontSize: "19px" })));
          });
          const m = later(merk(s, { style: { fontSize: "21px", padding: "8px 16px 10px" } }, "Ein ", B(s, "Storyboard"), " ist der Bauplan eines Films. Zu jedem Bild gehören: ", B(s, "Einstellungsgröße, Handlung, Ton"), "."));
          const lf = later(life(s, { style: { padding: "8px 14px" } }, small(s, "Auch Werbespots, Musikvideos und Erklärvideos werden vorher mit einem Storyboard geplant. Für dein eigenes reichen Strichmännchen!")));
          s.add(root(s, "stack", { gap: "12px" }, s.h("div", { class: "cols4", style: { gap: "12px", alignItems: "start" } }, ...panels), m, lf));
          s.sound("page-turn-2");
          PANELS.forEach((p, i) => s.step(async () => { p[4](); s.sfx.scribble(); await s.show(panels[i], "up"); s.say(p[1]); }));
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Schnitt: Bild für Bild",
        say: "Ein Film besteht aus vielen einzelnen Bildern. Im Kino sind es 24 Bilder in jeder Sekunde. Beim Schnitt kommen die Aufnahmen in die richtige Reihenfolge.",
        build(s) {
          const CW = 500, CH = 290, { canvas, g } = s.canvas(CW, CH);
          canvas.style.borderRadius = "12px"; canvas.style.border = "4px solid " + P.ink; canvas.style.display = "block";
          let fps = 24;
          const ballAt = t => { const k = t % 1.6 / 1.6; return [60 + k * 360, 240 - Math.sin(k * Math.PI) * 170, k]; };
          const drawFrame = t => {
            g.clearRect(0, 0, CW, CH); g.fillStyle = "#e6f6ee"; g.fillRect(0, 0, CW, CH); g.fillStyle = "#9fd8bd"; g.fillRect(0, 254, CW, 36);
            g.strokeStyle = "#fff"; g.lineWidth = 5; g.strokeRect(440, 120, 50, 134); g.lineWidth = 1; for (let y = 130; y < 254; y += 12) { g.beginPath(); g.moveTo(440, y); g.lineTo(490, y); g.stroke(); }
            const [x, y] = ballAt(t); g.fillStyle = "#fff"; g.strokeStyle = P.ink; g.lineWidth = 3; g.beginPath(); g.arc(x, y, 15, 0, Math.PI * 2); g.fill(); g.stroke();
            g.fillStyle = P.ink; g.beginPath(); g.arc(x, y, 5, 0, Math.PI * 2); g.fill();
          };
          s.loop(t => { const q = Math.floor(t * fps) / fps; drawFrame(q); });
          drawFrame(.5);
          const sl = s.slider({ label: "Bilder pro Sekunde", min: 2, max: 24, step: 1, value: 24, fmt: x => x + " Bilder", onInput: x => (fps = x) });
          const strip = s.svg(500, 92); strip.style.width = "500px";
          strip.append(s.el("rect", { x: 0, y: 0, width: 500, height: 92, rx: 6, fill: P.ink }), ...Array.from({ length: 20 }, (_, i) => s.el("rect", { x: 6 + i * 25, y: 4, width: 13, height: 8, rx: 2, fill: "#fff" })), ...Array.from({ length: 20 }, (_, i) => s.el("rect", { x: 6 + i * 25, y: 80, width: 13, height: 8, rx: 2, fill: "#fff" })));
          for (let i = 0; i < 8; i++) { const [x, y] = ballAt(i * .2); strip.append(s.el("rect", { x: 6 + i * 61.5, y: 16, width: 56, height: 60, fill: "#e6f6ee" }), s.el("circle", { cx: 6 + i * 61.5 + (x - 60) / 360 * 44 + 6, cy: 16 + y / 290 * 60, r: 4, fill: "#fff", stroke: P.ink, "stroke-width": 1.5 })); }
          const CLIPS = [["Jubel", P.green, "kids-cheer"], ["Schuss", P.blue, "ball-kick"], ["Anlauf", P.orange, "footsteps"]];
          const order = [0, 1, 2], right = [2, 1, 0];
          const clipEls = CLIPS.map(([n, c], i) => s.h("div", { style: { position: "absolute", top: "0", left: (i * 176) + "px", width: "164px", height: "80px", borderRadius: "12px", background: c, color: "#fff", display: "grid", placeItems: "center", font: "700 23px/1 var(--f-display)" } }, n));
          const clipBox = s.h("div", { style: { position: "relative", width: "516px", height: "80px" } }, ...clipEls);
          const reorder = async () => {
            s.sfx.whoosh();
            const from = clipEls.map((_, i) => order.indexOf(i) * 176), to = clipEls.map((_, i) => right.indexOf(i) * 176);
            if (!s.fast) await s.tween({ from: 0, to: 1, dur: 900, ease: "inOut", update: t => clipEls.forEach((e, i) => { e.style.left = from[i] + (to[i] - from[i]) * t + "px"; }) });
            clipEls.forEach((e, i) => (e.style.left = to[i] + "px")); right.forEach((v, i) => (order[i] = v));
            for (const i of right) { if (!s.alive) return; s.sound(CLIPS[i][2], { vol: .6, dur: 1.4 }); clipEls[i].classList.remove("a-pop"); void clipEls[i].offsetWidth; clipEls[i].classList.add("a-pop"); await s.wait(s.fast ? 0 : 700); }
          };
          const cutCard = later(s.h("div", { class: "card", style: { padding: "10px 14px", display: "flex", flexDirection: "column", gap: "8px" } }, s.h("p", { style: { margin: 0, font: "700 22px/1.2 var(--f-display)", color: P.unit } }, "Schnitt: die richtige Reihenfolge"), clipBox));
          const klappe = later(s.h("div", { style: { display: "grid", gridTemplateColumns: "220px 1fr", gap: "12px", alignItems: "center" } }, s.photo("filmklappe", { w: 220, h: 150, pos: "50% 50%" }),
            small(s, ["Die ", B(s, "Filmklappe"), ": Ihr lauter Klack ist im Bild und im Ton. So passen beim Schnitt Bild und Ton genau zusammen."], { fontSize: "19px" })));
          const m = later(merk(s, { style: { fontSize: "21px", padding: "8px 16px 10px" } }, "Im Kino: ", B(s, "24 Bilder pro Sekunde"), ". Beim ", B(s, "Schnitt"), " werden die Aufnahmen ausgewählt, gekürzt und geordnet."));
          const lf15 = later(life(s, { style: { padding: "8px 14px" } }, small(s, "Ein Daumenkino funktioniert genauso: Viele Bilder schnell hintereinander ergeben eine Bewegung.", { fontSize: "19px" })));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "508px 1fr", gap: "20px", alignItems: "start" }, s.h("div", { class: "stack", style: { gap: "10px" } }, canvas, sl, strip), s.h("div", { class: "stack", style: { gap: "12px" } }, cutCard, klappe, m, lf15)));
          s.sfx.pop();
          const setFps = async (to) => { const inp = sl.querySelector("input"); inp.value = to; inp.dispatchEvent(new Event("input")); fps = to; };
          s.step(async () => { await setFps(3); s.sfx.click(); s.say("Nur drei Bilder pro Sekunde: Der Ball springt ruckelig."); await s.wait(1200); });
          s.step(async () => { await setFps(24); s.sfx.success(); s.say("Vierundzwanzig Bilder pro Sekunde: Die Bewegung ist flüssig."); });
          s.step(async () => { s.sfx.pop(); await s.show(cutCard, "up"); s.sfx.error(); s.say("Jubel, Schuss, Anlauf? Diese Reihenfolge ergibt keinen Sinn."); });
          s.step(async () => { await reorder(); s.say("Anlauf, Schuss, Jubel. Jetzt stimmt es."); });
          s.step(async () => { s.sound("clap", { vol: .8 }); await s.show(klappe, "zoom"); s.sfx.ding(); await s.show(m, "up"); s.sfx.pop(); await s.show(lf15, "up"); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Vom Buch zum Film",
        say: "Emil und die Detektive erschien 1929 als Buch. Seitdem wurde es mehrmals verfilmt. Jeder Film erzählt die Geschichte ein bisschen anders.",
        build(s) {
          const W = 1100, H = 170, v = s.svg(W, H);
          v.append(s.el("line", { x1: 20, y1: 60, x2: 1070, y2: 60, stroke: P.ink, "stroke-width": 4 }), s.el("path", { d: "M1084 60 l-18 -10 v20 Z", fill: P.ink }));
          const PTS = [
            [110, "1929", "Buch", "von Erich Kästner", "", P.blue, "buch"],
            [370, "1931", "Film in Schwarz-Weiß", "Regie: Gerhard Lamprecht", "Drehbuch: Billy Wilder", P.ink, "film"],
            [640, "1954", "Film in Farbe", "Regie: Robert A. Stemmle", "", P.orange, "film"],
            [920, "2001", "neuer Film, modern erzählt", "Regie: Franziska Buch", "", P.green, "film"],
          ];
          const pts = PTS.map(([x, yr, a, b, c, col, ic]) => { const g = later(s.el("g", null, s.el("circle", { cx: x, cy: 60, r: 14, fill: col, stroke: "#fff", "stroke-width": 3 }), T(s, x, 32, yr, { "font-size": 28, fill: col }), T(s, x, 104, a, { "font-size": 21, fill: col }), T(s, x, 130, b, { "font-size": 19, "font-weight": 400 }), c ? T(s, x, 154, c, { "font-size": 19, "font-weight": 400 }) : s.el("g"))); v.append(g); return g; });
          const ROWS = [
            ["Woher kommt Emil?", "aus Neustadt", "aus Streiglitz an der Ostsee"],
            ["Bei wem wohnt er?", "bei seiner Mutter", "bei seinem Vater"],
            ["Wie viel Geld wird gestohlen?", "140 Mark", "1.500 D-Mark"],
            ["Pony Hütchen …", "ist Emils Cousine", "führt eine große Kinderbande an"],
            ["Technik", "Telefon, Straßenbahn", "Handy"],
          ];
          const cell = (t, st) => s.h("div", { style: Object.assign({ padding: "6px 12px", fontSize: "21px", lineHeight: 1.25, background: "#fff", borderBottom: "2px solid " + P.line }, st || {}) }, t);
          const hdr = s.h("div", { style: { display: "grid", gridTemplateColumns: "300px 1fr 1fr", gap: "0" } }, cell("", { background: "transparent" }), cell(B(s, "Buch 1929", P.blue), { borderBottom: "3px solid " + P.blue }), cell(B(s, "Film 2001", P.green), { borderBottom: "3px solid " + P.green }));
          const rows = ROWS.map(([a, b, c]) => later(s.h("div", { style: { display: "grid", gridTemplateColumns: "300px 1fr 1fr" } }, cell(B(s, a), { background: P.soft }), cell(b), cell(c))));
          const table = later(s.h("div", { class: "card", style: { padding: "6px 10px" } }, hdr, ...rows));
          const m = later(merk(s, { style: { fontSize: "21px", padding: "8px 16px 10px" } }, "Ein Film ist eine ", B(s, "Bearbeitung"), ": Er kürzt, ändert und macht die Geschichte modern. Vergleiche: Was ist gleich? Was ist anders – und warum?"));
          const lf = later(life(s, { style: { padding: "8px 14px" } }, small(s, "Erst das Buch lesen, dann den Film schauen – und eine Tabelle wie diese machen.", { fontSize: "19px" })));
          s.add(root(s, "stack", { gap: "10px" }, v, table, s.h("div", { style: { display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "12px" } }, m, lf)));
          s.sound("page-turn-1"); s.show(pts[0], "pop");
          s.step(async () => { s.sound("camera-shutter", { vol: .4 }); await s.show(pts[1], "pop"); s.say("1931: der erste Film, in Schwarz-Weiß."); });
          s.step(async () => { s.sfx.pop(); await s.show(pts[2], "pop"); s.sfx.pop(); await s.show(pts[3], "pop"); s.say("1954 in Farbe, 2001 ganz modern."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(table, "up"); for (const i of [0, 1, 2]) { s.sfx.count(i); await s.show(rows[i], "left"); } });
          s.step(async () => { for (const i of [3, 4]) { s.sfx.count(i); await s.show(rows[i], "left"); } s.sound("telefon-klingelt", { vol: .3, dur: 1 }); s.say("Im Film von 2001 hat der Dieb ein Handy."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 17 --------------------------------------------------------------- */
      {
        title: "Sicher und fair im Netz",
        say: "Manche Dinge bleiben privat. Und im Chat gilt: freundlich bleiben. Hinter jedem Namen steckt ein echter Mensch.",
        build(s) {
          const lock = mini(s, 60, 64); lock.append(s.el("path", { d: "M16 30 V20 a14 14 0 0 1 28 0 V30", stroke: P.red, "stroke-width": 6, fill: "none" }), s.el("rect", { x: 8, y: 28, width: 44, height: 34, rx: 6, fill: P.red }), s.el("circle", { cx: 30, cy: 43, r: 5, fill: "#fff" }));
          const PRIV = ["Adresse", "Telefonnummer", "Passwort", "Name der Schule", "wo du gerade bist", "Fotos von dir"];
          const OK = ["Lieblingsbuch", "Lieblingstier", "ein Spitzname", "Hobbys"];
          const privChips = PRIV.map(t => later(s.h("span", { class: "u11chip", style: { background: "#fff4f2", border: "2px solid " + P.red } }, t)));
          const okChips = OK.map(t => later(s.h("span", { class: "u11chip", style: { background: "#e6f6ee", border: "2px solid " + P.green } }, t)));
          const priv = s.h("div", { class: "card", style: { padding: "10px 14px", borderColor: P.red, display: "flex", flexDirection: "column", gap: "8px" } }, s.h("div", { class: "row", style: { gap: "12px", flexWrap: "nowrap" } }, lock, s.h("p", { class: "h2", style: { fontSize: "26px", color: P.red } }, "Bleibt privat")), s.h("div", { class: "row", style: { gap: "8px" } }, ...privChips));
          const ok = later(s.h("div", { class: "card", style: { padding: "10px 14px", borderColor: P.green, display: "flex", flexDirection: "column", gap: "8px" } }, s.h("p", { class: "h2", style: { fontSize: "26px", color: P.green } }, "Kannst du teilen"), s.h("div", { class: "row", style: { gap: "8px" } }, ...okChips)));
          const RULES = [
            ["Freundlich bleiben", "Hinter jedem Namen steckt ein Mensch."],
            ["Nur schreiben, was du auch ins Gesicht sagen würdest", ""],
            ["Keine Fotos von anderen ohne Fragen", ""],
            ["Etwas ist komisch?", "Nicht antworten – einem Erwachsenen zeigen."],
            ["Nie allein treffen", "mit jemandem, den du nur aus dem Netz kennst."],
          ];
          const rules = RULES.map(([a, b], i) => later(s.h("div", { class: "card", style: { padding: "6px 12px", display: "grid", gridTemplateColumns: "40px 1fr", gap: "10px", alignItems: "center" } }, num(s, i + 1), s.h("div", null, s.h("b", { style: { font: "700 21px/1.2 var(--f-display)", color: P.unit } }, a), b ? small(s, b, { fontSize: "19px" }) : ""))));
          const lf = later(life(s, { style: { padding: "8px 14px" } }, small(s, ["Sorgen? Die ", B(s, "Nummer gegen Kummer 116 111"), " hilft – kostenlos und anonym, montags bis samstags von 14 bis 20 Uhr."], { fontSize: "19px" })));
          const m = later(merk(s, { style: { fontSize: "21px", padding: "8px 16px 10px" } }, "Im Netz: ", B(s, "Privates schützen"), ", ", B(s, "fair chatten"), " und bei Problemen ", B(s, "Hilfe holen"), "."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "500px 1fr", gap: "20px", alignItems: "start" }, s.h("div", { class: "stack", style: { gap: "12px" } }, priv, ok, m), s.h("div", { class: "stack", style: { gap: "8px" } }, s.h("p", { class: "h2", style: { fontSize: "26px", color: P.unit } }, "Chat-Regeln"), ...rules, lf)));
          s.show(priv, "up"); s.sfx.pop();
          s.step(async () => { for (const [i, c] of privChips.entries()) { s.sfx.count(i); await s.show(c, "pop"); } s.sound("zipper", { vol: .6 }); s.say("Adresse, Telefonnummer und Passwort bleiben privat."); });
          s.step(async () => { s.sfx.success(); await s.show(ok, "up"); for (const c of okChips) { s.sfx.pop(); await s.show(c, "pop"); } });
          s.step(async () => { for (const i of [0, 1, 2]) { s.sfx.count(i + 2); await s.show(rules[i], "left"); } s.say("Freundlich bleiben. Hinter jedem Namen steckt ein Mensch."); });
          s.step(async () => { for (const i of [3, 4]) { s.sfx.count(i + 2); await s.show(rules[i], "left"); } });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 18 --------------------------------------------------------------- */
      {
        title: "Recht am Bild, Recht am Werk",
        say: "Fotos von anderen darfst du nur mit Erlaubnis zeigen. Und Bilder aus dem Netz gehören dem, der sie gemacht hat.",
        build(s) {
          const ph = s.svg(300, 200); ph.style.flex = "none"; ph.style.borderRadius = "12px"; ph.style.border = "4px solid " + P.ink;
          ph.append(s.el("rect", { x: 0, y: 0, width: 300, height: 200, fill: "#e6f6ee" }), s.el("rect", { x: 0, y: 150, width: 300, height: 50, fill: "#9fd8bd" }), kid(s, 80, 70, P.violet, .8), kid(s, 150, 64, P.blue, .85), kid(s, 222, 70, P.orange, .8, "oh"));
          const askBub = later(s.h("div", { class: "u11bub", style: { maxWidth: "none", background: "#dcf3d0", fontSize: "21px" } }, "„Darf ich das Foto in den Klassenchat stellen?“"));
          const yes = later(s.h("div", { class: "row", style: { gap: "8px" } }, s.h("span", { class: "u11chip", style: { background: P.green, color: "#fff" } }, "Nora: Ja!"), s.h("span", { class: "u11chip", style: { background: P.green, color: "#fff" } }, "Emre: Klar!"), s.h("span", { class: "u11chip", style: { background: P.red, color: "#fff" } }, "Mila: Lieber nicht.")));
          const law1 = later(s.h("div", { class: "card soft", style: { padding: "8px 14px" } }, small(s, ["Das ist das ", B(s, "Recht am eigenen Bild"), ": Fotos von Menschen darf man nur mit ihrer ", B(s, "Erlaubnis"), " verbreiten (§\u00a022 Kunsturhebergesetz). Sagt einer Nein, bleibt das Foto privat."], { fontSize: "19px" })));
          const colL = s.h("div", { class: "card", style: { padding: "10px 14px", display: "flex", flexDirection: "column", gap: "8px" } }, s.h("p", { class: "h2", style: { fontSize: "26px", color: P.unit } }, "Recht am eigenen Bild"), s.h("div", { class: "row", style: { gap: "12px", flexWrap: "nowrap", alignItems: "center" } }, ph, askBub), yes, law1);
          const art = s.svg(170, 130); art.style.border = "8px solid #b08a4a"; art.style.borderRadius = "4px";
          art.append(s.el("rect", { x: 0, y: 0, width: 170, height: 130, fill: "#fffbe9" }), s.el("circle", { cx: 130, cy: 30, r: 16, fill: P.yellow }), s.el("path", { d: "M0 110 L50 60 L90 100 L120 72 L170 116 V130 H0 Z", fill: P.green }), s.el("path", { d: "M20 92 h22 v18 h-22 Z M31 80 l14 12 h-28 Z", fill: P.red }));
          const copy = later(s.h("span", { style: { font: "800 54px/1 var(--f-display)", color: P.unit } }, "©"));
          const U = [
            ["Wer ein Bild malt, ein Foto macht oder ein Lied schreibt, ist der ", B(s, "Urheber"), ". Er bestimmt, wer es benutzen darf."],
            ["Das ", B(s, "Urheberrecht"), " gilt bis ", B(s, "70 Jahre nach dem Tod"), " des Urhebers."],
            ["Es gibt auch ", B(s, "freie Bilder"), " mit einer Lizenz. Dann schreibst du die ", B(s, "Quelle"), " dazu – wie in diesem Heft: Tipp auf das © am Foto!"],
          ];
          const us = U.map(t => later(small(s, t, { fontSize: "19px" })));
          const igel = later(s.photo("igel", { w: 170, h: 130, pos: "50% 50%" }));
          const colR = s.h("div", { class: "card", style: { padding: "10px 14px", display: "flex", flexDirection: "column", gap: "8px" } }, s.h("p", { class: "h2", style: { fontSize: "26px", color: P.unit } }, "Recht am Werk"),
            s.h("div", { class: "row", style: { gap: "14px", flexWrap: "nowrap", alignItems: "center" } }, art, copy, igel), ...us);
          const m = later(merk(s, { style: { fontSize: "21px", padding: "8px 16px 10px" } }, B(s, "Erst fragen, dann posten."), " Und bei Bildern aus dem Netz: Darf ich es benutzen? Dann ", B(s, "Quelle angeben"), "."));
          const lf = later(life(s, { style: { padding: "8px 14px" } }, small(s, "Plakat fürs Referat: Unter jedes Bild aus dem Netz schreibst du, woher es kommt.", { fontSize: "19px" })));
          s.add(root(s, "stack", { gap: "10px" }, s.h("div", { class: "cols", style: { gap: "16px", alignItems: "start" } }, colL, colR), s.h("div", { style: { display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "12px" } }, m, lf)));
          s.show(colL, "left"); s.show(colR, "right"); s.sound("camera-shutter", { vol: .5 });
          s.step(async () => { s.sfx.pop(); await s.show(askBub, "left"); s.sound("telefon-klingelt", { vol: .25, dur: .8 }); await s.show(yes, "up"); s.say("Mila möchte nicht. Dann bleibt das Foto privat."); });
          s.step(async () => { s.sfx.ding(); await s.show(law1, "up"); });
          s.step(async () => { s.sfx.scribble(); await s.show(copy, "pop"); await s.show(us[0], "up"); await s.show(us[1], "up"); s.say("Das Urheberrecht gilt bis siebzig Jahre nach dem Tod."); });
          s.step(async () => { s.sfx.pop(); await s.show(igel, "zoom"); await s.show(us[2], "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
    ],
  });
})();
