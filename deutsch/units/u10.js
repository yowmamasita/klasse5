/* Kapitel 10 – Bücher, Bühne und Sprachen
   Teil 1: Ein Jugendbuch lesen (Ganzschrift „Emil und die Detektive“: Lesetagebuch, Figurenkarte, Figurenkonstellation,
           Spannungskurve, Ort und Zeit, Lieblingsstelle) – Kästner nur beschrieben, nicht zitiert.
   Teil 2: Szenisches Spielen (Szene, Regieanweisungen, Fabel „Stadtmaus und Feldmaus“ nach Äsop als Spielszene,
           Stimme/Mimik/Gestik/Körperhaltung, Standbild, Rollenkarte)
   Teil 3: Sprache entdecken (Standardsprache/Umgangssprache/Berlinisch, Brötchen-Karte der Dialekte, Mehrsprachigkeit
           in Berlin, Lehnwörter, Sprache passend zur Situation inkl. Jugendsprache) */
(() => {
  const P = { blue: "#1d5bd0", red: "#dc3b2a", green: "#138a5a", violet: "#7b4fd6", orange: "#ee7a1a", ink: "#1b2740", pencil: "#5d6678", yellow: "#ffd94a", line: "#c8d3de", unit: "#4d7c0f", soft: "#ecf5dc", teal: "#0e7490", brown: "#8a5a2b" };
  const CSS = `
.u10num{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;font:700 21px/1 var(--f-display);color:#fff;background:${"#4d7c0f"};flex:none}
.u10chip{display:inline-flex;align-items:center;padding:5px 12px;border-radius:999px;font:700 19px/1.2 var(--f-display);background:#ecf5dc;color:var(--ink);white-space:nowrap}
.u10tab{min-height:56px}
.u10reg{color:var(--pencil);font-style:italic}
.u10line{border-bottom:2px dashed #c8d3de;padding:4px 0}
`;
  if (!document.getElementById("u10css")) { const st = document.createElement("style"); st.id = "u10css"; st.textContent = CSS; document.head.appendChild(st); }
  const later = el => { el.classList.add("later"); return el; };
  const life = (s, attrs, ...kids) => s.h("div", Object.assign({ class: "life" }, attrs || {}), s.h("span", { class: "exlabel" }, "Im Alltag"), ...kids);
  const merk = (s, attrs, ...kids) => s.h("div", Object.assign({ class: "merk" }, attrs || {}), ...kids);
  const B = (s, text, color) => s.h("b", { style: { color: color || "inherit" } }, text);
  const T = (s, x, y, text, a) => s.el("text", Object.assign({ x, y, "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: P.ink, text }, a || {}));
  const root = (s, cls, style, ...kids) => s.h("div", { class: cls, style: Object.assign({ height: "100%" }, style || {}) }, ...kids);
  const speaker = s => { const v = s.svg(24, 24); v.innerHTML = '<path d="M3 9h4l5-4v14l-5-4H3z" fill="currentColor"/><path d="M15 9a4 4 0 010 6M17.5 6.5a8 8 0 010 11" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/>'; return v; };
  const read = (s, text, opts) => { if (s.fast) return; s.speak(text.replace(/[„“()]/g, ""), Object.assign({ lang: "de-DE" }, opts || {})); };
  const small = (s, text, st) => s.h("p", { class: "small", style: Object.assign({ fontSize: "20px" }, st || {}) }, ...[].concat(text));
  const icon = (s, size, draw) => { const v = s.svg(56, 56); v.style.width = size + "px"; v.style.height = size + "px"; v.style.flex = "none"; draw(v); return v; };
  /* a man with a bowler hat ("steifer Hut") */
  const hatMan = (s, x, y, sc = 1) => s.el("g", { transform: `translate(${x} ${y}) scale(${sc})` },
    s.el("rect", { x: -14, y: -30, width: 28, height: 40, rx: 8, fill: "#3b3f4a" }),
    s.el("path", { d: "M-6 10 L-8 34 M6 10 L8 34", stroke: P.ink, "stroke-width": 5, "stroke-linecap": "round" }),
    s.el("circle", { cx: 0, cy: -42, r: 12, fill: "#f3c9a0", stroke: P.ink, "stroke-width": 2 }),
    s.el("ellipse", { cx: 0, cy: -51, rx: 17, ry: 4, fill: "#1b1b1b" }),
    s.el("path", { d: "M-11 -51 Q-11 -68 0 -68 Q11 -68 11 -51 Z", fill: "#1b1b1b" }));
  /* simple mouse figure for the fable scenes */
  const mouse = (s, x, y, col, sc = 1) => s.el("g", { transform: `translate(${x} ${y}) scale(${sc})` },
    s.el("path", { d: "M14 30 q30 4 26 -18", stroke: "#8f7a6a", "stroke-width": 3, fill: "none" }),
    s.el("ellipse", { cx: 0, cy: 20, rx: 20, ry: 24, fill: col }),
    s.el("circle", { cx: -14, cy: -22, r: 11, fill: col, stroke: "#8f7a6a", "stroke-width": 2 }),
    s.el("circle", { cx: 14, cy: -22, r: 11, fill: col, stroke: "#8f7a6a", "stroke-width": 2 }),
    s.el("circle", { cx: 0, cy: -8, r: 17, fill: col }),
    s.el("circle", { cx: -6, cy: -11, r: 2.6, fill: P.ink }), s.el("circle", { cx: 6, cy: -11, r: 2.6, fill: P.ink }),
    s.el("circle", { cx: 0, cy: -2, r: 3.4, fill: "#e58aa0" }));
  const cat = (s, x, y, sc = 1) => s.el("g", { transform: `translate(${x} ${y}) scale(${sc})` },
    s.el("path", { d: "M26 34 q34 -6 22 -40", stroke: "#e08a2c", "stroke-width": 6, fill: "none", "stroke-linecap": "round" }),
    s.el("ellipse", { cx: 0, cy: 18, rx: 28, ry: 30, fill: "#f0a040" }),
    s.el("path", { d: "M-22 -24 L-16 -50 L-4 -32 Z M22 -24 L16 -50 L4 -32 Z", fill: "#f0a040" }),
    s.el("circle", { cx: 0, cy: -18, r: 24, fill: "#f0a040" }),
    s.el("ellipse", { cx: -9, cy: -22, rx: 4, ry: 6, fill: "#2f6b2f" }), s.el("ellipse", { cx: 9, cy: -22, rx: 4, ry: 6, fill: "#2f6b2f" }),
    s.el("path", { d: "M-5 -10 L0 -6 L5 -10 M-26 -12 h14 M26 -12 h-14 M-25 -6 l13 -2 M25 -6 l-13 -2", stroke: P.ink, "stroke-width": 2, fill: "none" }));

  Deck.unit({
    id: "u10", num: 10, title: "Bücher, Bühne und Sprachen", color: P.unit, soft: P.soft,
    subtitle: "Ein ganzes Buch, ein Theaterstück, viele Sprachen",
    blurb: "Jugendbuch lesen, Theater spielen, Dialekte und Sprachen.",
    goals: ["Ein ganzes Jugendbuch mit Lesetagebuch und Figurenkarte lesen", "Figuren, Handlung, Ort und Zeit eines Romans darstellen", "Eine Fabel in eine Spielszene verwandeln und vorspielen", "Hochdeutsch, Umgangssprache und Dialekt unterscheiden", "Sprachen in Berlin entdecken und passend zur Situation sprechen"],
    icon(svg, el) {
      svg.append(el("path", { d: "M6 18 Q20 12 34 18 V58 Q20 52 6 58 Z", fill: "#fff", stroke: P.unit, "stroke-width": 3 }),
        el("path", { d: "M34 18 Q48 12 62 18 V58 Q48 52 34 58 Z", fill: P.soft, stroke: P.unit, "stroke-width": 3 }),
        el("path", { d: "M2 6 h66 v8 h-66 Z", fill: P.red }),
        el("path", { d: "M12 28 h16 M12 36 h16 M40 28 h16 M40 36 h12", stroke: P.unit, "stroke-width": 2.5 }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Ein ganzes Buch lesen",
        say: "In Klasse 5 lest ihr ein ganzes Jugendbuch zusammen. Das nennt man eine Ganzschrift. Mit ein paar Werkzeugen behältst du den Überblick.",
        build(s) {
          const PAGES = 160;
          const W = 500, H = 230, v = s.svg(W, H);
          v.append(s.el("path", { d: "M250 30 Q180 10 40 26 V176 Q180 160 250 180 Z", fill: "#fff", stroke: P.unit, "stroke-width": 3 }),
            s.el("path", { d: "M250 30 Q320 10 460 26 V176 Q320 160 250 180 Z", fill: "#fbfcf0", stroke: P.unit, "stroke-width": 3 }),
            ...[52, 72, 92, 112, 132].map(y => s.el("path", { d: `M70 ${y} Q160 ${y - 10} 228 ${y + 2} M272 ${y + 2} Q340 ${y - 10} 430 ${y}`, stroke: P.line, "stroke-width": 3, fill: "none" })),
            T(s, 250, 214, "Ein Jugendbuch mit " + PAGES + " Seiten", { "font-size": 21, fill: P.unit }));
          const mark = s.el("path", { d: "M380 10 h22 v60 l-11 -10 l-11 10 Z", fill: P.red });
          v.append(mark);
          const days = s.svg(500, 70);
          const boxes = Array.from({ length: 32 }, (_, i) => { const r = s.el("rect", { x: 4 + (i % 16) * 31, y: 4 + Math.floor(i / 16) * 32, width: 26, height: 26, rx: 5, fill: P.soft, stroke: P.unit, "stroke-width": 2 }); days.append(r); return r; });
          const res = s.h("p", { class: "t", style: { fontSize: "22px", fontWeight: 700, color: P.unit } }, "");
          const upd = n => { const d = Math.ceil(PAGES / n); boxes.forEach((b, i) => { b.style.opacity = i < d ? 1 : 0.12; b.setAttribute("fill", i < d ? P.soft : "#fff"); }); res.textContent = `${n} Seiten am Tag: In ${d} Tagen hast du das Buch durch.`; };
          const sl = s.slider({ label: "Seiten pro Tag", min: 5, max: 40, step: 5, value: 10, fmt: x => x + " Seiten", onInput: x => upd(x) });
          upd(10);
          const left = s.h("div", { class: "card", style: { padding: "10px 16px", display: "flex", flexDirection: "column", gap: "6px" } }, v, sl, days, res);
          const TOOLS = [
            ["Lesetagebuch", "Was ist passiert? Was denke ich?", v => v.append(s.el("rect", { x: 10, y: 6, width: 36, height: 44, rx: 4, fill: "#fff", stroke: P.unit, "stroke-width": 3 }), s.el("path", { d: "M18 18 h20 M18 26 h20 M18 34 h14", stroke: P.unit, "stroke-width": 3 }))],
            ["Figurenkarte", "Wer ist wer – und wie ist er?", v => v.append(s.el("circle", { cx: 28, cy: 18, r: 10, fill: P.unit }), s.el("path", { d: "M10 50 Q10 30 28 30 Q46 30 46 50 Z", fill: P.unit }))],
            ["Spannungskurve", "Wie verläuft die Handlung?", v => v.append(s.el("path", { d: "M4 46 Q20 40 28 26 T40 10 Q46 30 52 40", stroke: P.red, "stroke-width": 4, fill: "none" }))],
            ["Ort und Zeit", "Wo und wann spielt das Buch?", v => v.append(s.el("path", { d: "M18 50 Q4 30 4 20 a14 14 0 0 1 28 0 Q32 30 18 50 Z", fill: P.unit }), s.el("circle", { cx: 40, cy: 36, r: 13, fill: "#fff", stroke: P.unit, "stroke-width": 3 }), s.el("path", { d: "M40 28 v8 h6", stroke: P.unit, "stroke-width": 3, fill: "none" }))],
            ["Lieblingsstelle", "Welche Stelle mag ich am meisten?", v => v.append(s.el("path", { d: "M28 50 L8 30 a10 10 0 0 1 20 -14 a10 10 0 0 1 20 14 Z", fill: P.red }))],
          ];
          const tools = TOOLS.map(([t, d, dr]) => later(s.h("div", { class: "card", style: { padding: "8px 14px", display: "grid", gridTemplateColumns: "48px 1fr", gap: "12px", alignItems: "center" } }, icon(s, 48, dr),
            s.h("div", null, s.h("p", { style: { margin: 0, font: "700 22px/1.15 var(--f-display)", color: P.unit } }, t), small(s, d)))));
          const m = later(merk(s, { style: { fontSize: "21px", padding: "10px 16px 12px" } }, "Eine ", B(s, "Ganzschrift"), " ist ein ganzes Buch, das die Klasse über mehrere Wochen gemeinsam liest."));
          const lf = later(life(s, { style: { padding: "10px 16px" } }, small(s, "Bücher leihst du kostenlos in der Stadtteilbibliothek aus – mit dem Bibliotheksausweis.")));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "530px 1fr", gap: "18px", alignItems: "start" }, s.h("div", { class: "stack", style: { gap: "12px" } }, left, lf), s.h("div", { class: "stack", style: { gap: "9px" } }, ...tools, m)));
          s.show(left, "up"); s.sound("page-turn-3");
          s.step(async () => { s.sfx.whoosh(); await s.tween({ from: 380, to: 90, dur: 900, ease: "inOut", update: x => mark.setAttribute("transform", `translate(${x - 380} 0)`) }); for (const i of [0, 1]) { s.sfx.count(i); await s.show(tools[i], "left"); } s.say("Lesetagebuch und Figurenkarte."); });
          s.step(async () => { for (const i of [2, 3, 4]) { s.sfx.count(i); await s.show(tools[i], "left"); } s.say("Spannungskurve, Ort und Zeit, Lieblingsstelle."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Emil und die Detektive",
        say: "Ein berühmtes Berliner Kinderbuch: Emil und die Detektive von Erich Kästner, erschienen 1929. Emil fährt allein mit dem Zug nach Berlin.",
        build(s) {
          const W = 700, H = 210, v = s.svg(W, H);
          v.append(s.el("rect", { x: 0, y: 160, width: W, height: 50, fill: "#e9edf2" }),
            s.el("path", { d: `M0 166 H${W}`, stroke: P.pencil, "stroke-width": 4 }),
            ...Array.from({ length: 24 }, (_, i) => s.el("rect", { x: i * 30, y: 168, width: 16, height: 6, fill: P.pencil })),
            ...[[20, 110, 40, 50], [66, 96, 36, 64], [106, 116, 30, 44]].map(([x, y, w, h]) => s.el("rect", { x, y, width: w, height: h, fill: "#d6c08e", stroke: P.brown, "stroke-width": 2 })),
            s.el("path", { d: "M18 112 l22 -20 l22 20 M64 98 l20 -18 l20 18", fill: P.red }),
            T(s, 75, 200, "Neustadt", { "font-size": 20 }),
            ...[[530, 70, 40, 90], [576, 50, 34, 110], [616, 84, 44, 76], [664, 60, 30, 100]].map(([x, y, w, h]) => s.el("rect", { x, y, width: w, height: h, fill: "#a9b4c4", stroke: P.ink, "stroke-width": 2 })),
            T(s, 610, 200, "Berlin", { "font-size": 20 }));
          const train = s.el("g", { transform: "translate(0 0)" },
            s.el("rect", { x: 150, y: 112, width: 70, height: 46, rx: 6, fill: P.unit }), s.el("rect", { x: 210, y: 92, width: 16, height: 22, fill: P.ink }),
            s.el("rect", { x: 230, y: 116, width: 100, height: 42, rx: 6, fill: "#6b8f2a" }),
            ...[244, 276, 308].map(x => s.el("rect", { x: x - 6, y: 124, width: 22, height: 16, rx: 3, fill: "#fff8d0" })),
            ...[166, 204, 250, 310].map(x => s.el("circle", { cx: x, cy: 160, r: 8, fill: P.ink })));
          const zzz = later(T(s, 290, 100, "Z z z", { "font-size": 26, fill: P.blue }));
          const env = s.el("g", null, s.el("rect", { x: 262, y: 60, width: 60, height: 36, rx: 4, fill: "#fff", stroke: P.brown, "stroke-width": 2 }), T(s, 292, 85, "140 M", { "font-size": 19, fill: P.brown }));
          const man = later(hatMan(s, 490, 126, 0.9));
          v.append(train, zzz, env, man);
          const STORY = [
            ["Emils Mutter ist Friseurin in Neustadt. Sie gibt ihm 140 Mark für die Großmutter in Berlin mit."],
            ["Emil steckt das Geld mit einer Nadel im Futter seiner Jacke fest. Im Zug schläft er ein."],
            ["Als er aufwacht, ist das Geld weg! Verdächtig: ein Mann mit einem steifen Hut."],
            ["Der Mann steigt am Bahnhof Zoo aus – und Emil hinterher. Zur Polizei traut er sich nicht."],
          ];
          const items = STORY.map(([t], i) => later(s.h("div", { style: { display: "grid", gridTemplateColumns: "40px 1fr", gap: "10px", alignItems: "center" } }, s.h("span", { class: "u10num" }, String(i + 1)), small(s, t, { fontSize: "21px" }))));
          const pic = later(s.photo("bahnhof-zoo", { w: 360, h: 260, pos: "50% 50%", caption: "Bahnhof Zoo (Foto von 2007)" }));
          const info = s.h("div", { class: "card soft", style: { padding: "10px 14px", display: "flex", flexDirection: "column", gap: "4px" } },
            s.h("p", { style: { margin: 0, font: "800 24px/1.15 var(--f-display)", color: P.unit } }, "Erich Kästner"), small(s, "lebte von 1899 bis 1974. „Emil und die Detektive“ erschien 1929."),
            small(s, ["Kästner wohnte damals in der ", B(s, "Prager Straße"), " in Wilmersdorf – ganz nah an den Orten, an denen Emils Abenteuer spielt."]));
          const why = later(small(s, "Warum? In Neustadt hat er einem Denkmal eine rote Nase angemalt. Ein Polizist hat es gesehen.", { color: P.pencil }));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "1fr 360px", gap: "18px", alignItems: "start" },
            s.h("div", { class: "stack", style: { gap: "10px" } }, v, ...items, why), s.h("div", { class: "stack", style: { gap: "12px" } }, info, pic)));
          s.sfx.pop();
          s.step(async () => { s.sound("tram-bell", { vol: .4, dur: 1.5 }); s.show(items[0], "left"); await s.tween({ from: 0, to: 120, dur: 1600, ease: "inOut", update: x => { train.setAttribute("transform", `translate(${x} 0)`); env.setAttribute("transform", `translate(${x} 0)`); } }); s.say(STORY[0][0]); });
          s.step(async () => { s.sfx.pop(); await s.show(items[1], "left"); s.sfx.boing(); await s.show(zzz, "pop"); s.say(STORY[1][0]); });
          s.step(async () => { s.sfx.zap(); if (!s.fast) await s.tween({ from: 1, to: 0, dur: 600, update: x => env.setAttribute("opacity", x) }); env.setAttribute("opacity", 0); zzz.setAttribute("opacity", 0); await s.show(items[2], "left"); s.say(STORY[2][0]); });
          s.step(async () => { s.sfx.whoosh(); await s.show(man, "left"); await s.show(items[3], "left"); s.show(pic, "zoom"); s.say(STORY[3][0]); });
          s.step(async () => { s.sfx.error(); await s.show(why, "fade"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Das Lesetagebuch",
        say: "Im Lesetagebuch schreibst du nach dem Lesen auf, was passiert ist, was du denkst und welche Fragen du hast.",
        build(s) {
          const ROWS = [
            ["Das ist passiert:", "Emil soll allein nach Berlin fahren. Seine Mutter gibt ihm 140 Mark für die Großmutter mit.", P.blue],
            ["Das denke ich:", "Ich wäre an Emils Stelle ganz schön aufgeregt – so viel Geld!", P.violet],
            ["Meine Frage:", "Wer ist der Mann mit dem steifen Hut?", P.red],
            ["Neues Wort:", "Friseurin = Sie schneidet Haare.", P.green],
          ];
          const rows = ROWS.map(([a, b, c]) => later(s.h("div", { class: "u10line" }, s.h("p", { style: { margin: "0 0 4px", font: "700 20px/1.2 var(--f-display)", color: c } }, a), s.h("p", { class: "hand", style: { margin: 0, fontSize: "28px", lineHeight: 1.15, color: P.blue } }, b))));
          const sk = s.svg(130, 130); sk.style.width = "130px"; sk.style.height = "130px";
          sk.append(s.el("rect", { x: 3, y: 3, width: 124, height: 124, rx: 8, fill: "#fff", stroke: P.line, "stroke-width": 2, "stroke-dasharray": "6 5" }), hatMan(s, 65, 100, 1.3));
          const sketch = later(s.h("div", { class: "stack", style: { gap: "2px", alignItems: "center" } }, sk, s.h("p", { class: "small", style: { color: P.pencil } }, "Bild dazu")));
          const head = s.h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "3px solid " + P.unit, paddingBottom: "4px" } },
            s.h("p", { style: { margin: 0, font: "800 24px/1.1 var(--f-display)", color: P.unit } }, "Mein Lesetagebuch"), s.h("p", { class: "hand", style: { margin: 0, fontSize: "28px" } }, "Montag, 12.10."));
          const sub = s.h("p", { class: "small", style: { color: P.pencil } }, "„Emil und die Detektive“ · heute gelesen: die ersten zwei Kapitel");
          const book = s.h("div", { class: "card", style: { padding: "12px 18px", display: "flex", flexDirection: "column", gap: "6px", background: "#fffef6", borderLeft: "12px solid " + P.unit } }, head, sub,
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 130px", gap: "12px", alignItems: "start" } }, s.h("div", { class: "stack", style: { gap: "4px" } }, ...rows), sketch));
          const IN = ["Datum und Seiten", "Kurz zusammenfassen", "Eigene Gedanken", "Fragen an das Buch", "Neue Wörter", "Bilder, Karten, Zitate"];
          const chips = IN.map(t => later(s.h("span", { class: "u10chip" }, t)));
          const pic = s.photo("tagebuch", { w: "100%", h: 180, pos: "50% 50%" });
          const lf3 = later(life(s, { style: { padding: "10px 16px" } }, small(s, "Auch Trainerinnen im Fußball notieren nach jedem Spiel, was gut lief und was nicht. So vergisst man nichts.")));
          const right = s.h("div", { class: "stack", style: { gap: "10px" } }, pic, s.h("p", { class: "h2", style: { fontSize: "24px", color: P.unit } }, "Das gehört hinein:"), s.h("div", { class: "row", style: { gap: "8px" } }, ...chips), lf3);
          const m = later(merk(s, { style: { fontSize: "21px", padding: "10px 16px 12px" } }, "Schreib ", B(s, "nach jedem Leseabschnitt"), " ein paar Sätze – in eigenen Worten."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "640px 1fr", gap: "18px", alignItems: "start" }, s.h("div", { class: "stack", style: { gap: "12px" } }, book, m), right));
          s.show(book, "up"); s.sound("page-turn-1");
          const write = async i => { s.sound("pencil-write", { vol: .45, dur: 1.2 }); await s.show(rows[i], "fade"); s.show(chips[i + 1], "pop"); };
          s.step(async () => { s.show(chips[0], "pop"); await write(0); s.say(ROWS[0][1]); });
          s.step(async () => { await write(1); await write(2); s.say("Was denke ich? Welche Frage habe ich?"); });
          s.step(async () => { await write(3); s.sfx.scribble(); await s.show(sketch, "zoom"); s.show(chips[5], "pop"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sfx.pop(); await s.show(lf3, "up"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Die Figurenkarte",
        say: "Auf einer Figurenkarte sammelst du alles über eine Figur. Wichtig: Jede Eigenschaft belegst du mit einer Stelle aus dem Buch.",
        build(s) {
          const FIG = {
            Emil: { col: P.blue, who: "Emil Tischbein, ein Junge aus Neustadt", lives: "wohnt mit seiner Mutter in Neustadt", props: ["mutig", "hartnäckig", "liebt seine Mutter"], proof: "Er verfolgt den Dieb ganz allein durch die fremde Großstadt.", hat: false },
            Gustav: { col: P.green, who: "Gustav mit der Hupe, ein Berliner Junge", lives: "wohnt in Berlin", props: ["hilfsbereit", "laut", "schnell entschlossen"], proof: "Er spricht Emil an und trommelt sofort seine Freunde zusammen.", hat: false },
            Grundeis: { col: P.red, who: "der Mann mit dem steifen Hut", lives: "unterwegs, schläft im Hotel", props: ["unehrlich", "gierig", "schlau"], proof: "Er nennt sich mal Grundeis, mal anders – er lügt.", hat: true },
          };
          const port = s.svg(170, 190); port.style.width = "170px"; port.style.height = "190px";
          const bg = s.el("rect", { x: 4, y: 4, width: 162, height: 182, rx: 14, fill: P.soft });
          const body = s.el("path", { d: "M40 186 Q40 120 85 120 Q130 120 130 186 Z", fill: P.blue });
          const head = s.el("circle", { cx: 85, cy: 84, r: 34, fill: "#f3c9a0", stroke: P.ink, "stroke-width": 2 });
          const face = s.el("path", { d: "M72 80 v4 M98 80 v4 M74 98 Q85 106 96 98", stroke: P.ink, "stroke-width": 3, fill: "none", "stroke-linecap": "round" });
          const hair = s.el("path", { d: "M51 80 Q52 44 85 46 Q118 44 119 80 Q104 60 85 62 Q66 60 51 80 Z", fill: "#7a4a24" });
          const bowler = s.el("g", null, s.el("ellipse", { cx: 85, cy: 58, rx: 48, ry: 9, fill: "#1b1b1b" }), s.el("path", { d: "M55 58 Q55 14 85 14 Q115 14 115 58 Z", fill: "#1b1b1b" }));
          port.append(bg, body, head, face, hair, bowler);
          const nameEl = s.h("p", { style: { margin: 0, font: "800 30px/1.1 var(--f-display)" } }, "");
          const f = (lbl) => { const val = s.h("p", { class: "t", style: { fontSize: "21px" } }, ""); const row = later(s.h("div", { style: { display: "grid", gridTemplateColumns: "150px 1fr", gap: "10px", alignItems: "baseline", borderBottom: "2px solid " + P.line, padding: "6px 0" } }, s.h("b", { style: { fontSize: "20px", color: P.pencil } }, lbl), val)); row.val = val; return row; };
          const fWho = f("Wer?"), fLive = f("Wo?"), fProps = f("Eigenschaften"), fProof = f("Beleg");
          const card = s.h("div", { class: "card", style: { padding: "14px 20px", display: "grid", gridTemplateColumns: "170px 1fr", gap: "20px", alignItems: "start", borderWidth: "3px" } }, port,
            s.h("div", { class: "stack", style: { gap: "2px" } }, nameEl, fWho, fLive, fProps, fProof));
          let cur = "Emil";
          const setF = k => {
            cur = k; const d = FIG[k];
            nameEl.textContent = k; nameEl.style.color = d.col; card.style.borderColor = d.col; body.setAttribute("fill", d.col === P.red ? "#3b3f4a" : d.col);
            hair.style.display = d.hat ? "none" : ""; bowler.style.display = d.hat ? "" : "none";
            face.setAttribute("d", d.hat ? "M72 80 h6 M92 80 h6 M74 100 Q88 102 98 94" : "M72 80 v4 M98 80 v4 M74 98 Q85 106 96 98");
            fWho.val.textContent = d.who; fLive.val.textContent = d.lives; fProof.val.textContent = d.proof;
            fProps.val.replaceChildren(...d.props.map(p => s.h("span", { class: "u10chip", style: { marginRight: "6px", background: "#fff", border: "2px solid " + d.col } }, p)));
            tabs.forEach(b => b.classList.toggle("solid", b.dataset.k === k));
          };
          const tabs = Object.keys(FIG).map(k => { const b = s.h("button", { class: "btn u10tab", onclick: () => { s.sfx.whoosh(); setF(k); } }, k); b.dataset.k = k; return b; });
          const tabRow = s.h("div", { class: "row", style: { gap: "10px" } }, s.h("b", { style: { fontSize: "21px", color: P.pencil } }, "Figur wählen:"), ...tabs);
          const m = later(merk(s, { style: { fontSize: "21px", padding: "10px 16px 12px" } }, "Eigenschaft + ", B(s, "Beleg"), ": „Emil ist mutig, ", B(s, "denn"), " er verfolgt den Dieb allein.“ Notiere dir die Seitenzahl dazu!"));
          const tip = later(s.h("div", { class: "card soft", style: { padding: "10px 16px" } }, small(s, ["Gute Eigenschaftswörter: ", B(s, "mutig, ängstlich, ehrlich, frech, klug, hilfsbereit, neugierig, eitel …")])));
          const lf4 = later(life(s, { style: { padding: "10px 16px" } }, small(s, "Wie eine Sammelkarte oder die Infotafel einer Spielfigur: Name, Stärken, Schwächen – nur eben für eine Figur aus dem Buch.")));
          s.add(root(s, "stack", { gap: "12px" }, tabRow, card, tip, m, lf4));
          setF("Emil"); s.show(card, "up"); s.sfx.pop();
          s.step(async () => { for (const r of [fWho, fLive]) { s.sfx.pop(); await s.show(r, "left"); } s.say("Wer ist Emil, und wo wohnt er?"); });
          s.step(async () => { s.sfx.ding(); await s.show(fProps, "left"); s.sound("pencil-write", { vol: .4, dur: 1 }); await s.show(fProof, "left"); s.say("Emil ist mutig. Er verfolgt den Dieb ganz allein."); });
          s.step(async () => { s.sfx.whoosh(); setF("Gustav"); s.sound("autohupe", { vol: .4 }); s.say(FIG.Gustav.proof); });
          s.step(async () => { s.sfx.whoosh(); setF("Grundeis"); s.sfx.zap(); await s.show(tip, "up"); });
          s.step(async () => { s.sfx.success(); await s.show(m, "up"); s.sfx.pop(); await s.show(lf4, "up"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Wer gehört zu wem?",
        say: "Eine Figurenkonstellation zeigt, wie die Figuren zueinander stehen: Familie, Freunde und Gegner.",
        build(s) {
          const W = 1100, H = 470, v = s.svg(W, H);
          const node = (x, y, t, sub, c, w = 260, big) => {
            const g = s.el("g", null, s.el("rect", { x: x - w / 2, y: y - 36, width: w, height: 72, rx: 14, fill: big ? c : "#fff", stroke: c, "stroke-width": 3 }),
              T(s, x, y - 6, t, { "font-size": big ? 28 : 22, fill: big ? "#fff" : c }), T(s, x, y + 22, sub, { "font-size": 19, "font-weight": 400, fill: big ? "#fff" : P.ink }));
            return later(g);
          };
          const edge = (x1, y1, x2, y2, lbl, c, dash) => {
            const ln = later(s.el("line", { x1, y1, x2, y2, stroke: c, "stroke-width": 4, "stroke-dasharray": dash || null }));
            const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, w = lbl.length * 11 + 22;
            const lb = later(s.el("g", null, s.el("rect", { x: mx - w / 2, y: my - 16, width: w, height: 30, rx: 15, fill: "#fff", stroke: c, "stroke-width": 2 }), T(s, mx, my + 6, lbl, { "font-size": 19, fill: c })));
            return [ln, lb];
          };
          const EX = 550, EY = 235;
          const fam = [[150, 80, "Mutter", "Friseurin in Neustadt", "Mutter"], [150, 235, "Großmutter", "wohnt in Berlin", "Großmutter"], [150, 390, "Pony Hütchen", "Cousine aus Berlin", "Cousine"]];
          const fr = [[950, 80, "Gustav", "mit der Hupe", "Freund"], [950, 235, "der Professor", "plant die Verfolgung", "hilft"], [950, 390, "der kleine Dienstag", "sitzt am Telefon", "hilft"]];
          const famE = fam.map(([x, y, , , l]) => edge(EX, EY, x, y, l, P.blue));
          const frE = fr.map(([x, y, , , l]) => edge(EX, EY, x, y, l, P.green));
          const badE = edge(EX, EY, EX, 420, "bestiehlt", P.red, "10 7");
          [...famE, ...frE, badE].forEach(([ln]) => v.append(ln));
          const famN = fam.map(([x, y, t, sub]) => node(x, y, t, sub, P.blue));
          const frN = fr.map(([x, y, t, sub]) => node(x, y, t, sub, P.green));
          const badN = node(EX, 420, "Herr Grundeis", "der Dieb mit dem steifen Hut", P.red, 320);
          const emil = node(EX, EY, "Emil", "Hauptfigur", P.unit, 200, true);
          emil.classList.remove("later");
          const gl = (x, t, c) => later(T(s, x, 26, t, { "font-size": 22, fill: c }));
          const g1 = gl(150, "Familie", P.blue), g2 = gl(950, "Die Detektive", P.green);
          v.append(...famN, ...frN, badN, emil, ...[...famE, ...frE, badE].map(e => e[1]), g1, g2);
          const m = later(merk(s, { style: { fontSize: "21px", padding: "10px 16px 12px" } }, "Hauptfigur in die Mitte, die anderen drumherum. Linien zeigen, wie sie zueinander stehen: ", B(s, "Familie", P.blue), ", ", B(s, "Freunde", P.green), ", ", B(s, "Gegner", P.red), "."));
          s.add(root(s, "stack", { gap: "10px" }, v, m));
          s.show(emil, "pop"); s.sfx.pop();
          const group = async (E, N, extra) => { for (let i = 0; i < N.length; i++) { s.show(E[i][0], "draw"); s.sfx.note(i * 3, .25); await s.show(N[i], "pop"); s.show(E[i][1], "fade"); } if (extra) s.show(extra, "fade"); };
          s.step(async () => { await group(famE, famN, g1); s.say("Die Familie: Mutter, Großmutter und Cousine Pony Hütchen."); });
          s.step(async () => { s.sound("telefon-klingelt", { vol: .4, dur: 1.5 }); await group(frE, frN, g2); s.say("Die Detektive: Gustav, der Professor und der kleine Dienstag."); });
          s.step(async () => { s.sfx.drum(); s.show(badE[0], "draw"); await s.show(badN, "bounce"); s.show(badE[1], "fade"); s.say("Und der Gegner: der Dieb."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Die Spannungskurve",
        say: "Die Handlung eines Romans kannst du als Kurve zeichnen. Je spannender es wird, desto höher steigt die Kurve.",
        build(s) {
          const W = 1100, H = 290, v = s.svg(W, H);
          const PTS = [[80, 260], [235, 210], [390, 175], [545, 160], [700, 125], [855, 70], [1010, 215]];
          const bands = [[20, 160, "Einleitung", "#eef3fb"], [160, 780, "Hauptteil", "#f4f8ec"], [780, 935, "Höhepunkt", "#fdeceb"], [935, 1085, "Schluss", "#f1f1f4"]];
          bands.forEach(([a, b, t, c]) => v.append(s.el("rect", { x: a, y: 4, width: b - a, height: H - 8, rx: 10, fill: c }), T(s, (a + b) / 2, 30, t, { "font-size": 20, fill: P.pencil })));
          let d = `M${PTS[0][0]} ${PTS[0][1]}`;
          for (let i = 1; i < PTS.length; i++) { const [x0, y0] = PTS[i - 1], [x1, y1] = PTS[i], cx = (x0 + x1) / 2; d += ` C${cx} ${y0} ${cx} ${y1} ${x1} ${y1}`; }
          const curve = later(s.el("path", { d, stroke: P.red, "stroke-width": 5, fill: "none", "stroke-linecap": "round" }));
          v.append(curve);
          const dots = PTS.map(([x, y], i) => { const g = later(s.el("g", null, s.el("circle", { cx: x, cy: y, r: 18, fill: i === 5 ? P.red : P.unit, stroke: "#fff", "stroke-width": 3 }), T(s, x, y + 7, String(i + 1), { fill: "#fff", "font-size": 20 }))); v.append(g); return g; });
          const L = ["Abschied in Neustadt", "Das Geld ist weg!", "Verfolgung quer durch Berlin", "Gustav und die Detektive helfen", "Eine Nacht vor dem Hotel", "In der Bank: Wem gehört das Geld?", "Das Ende …"];
          const cards = L.map((t, i) => later(s.h("div", { class: "card", style: { padding: "8px 8px", textAlign: "center", borderColor: i === 5 ? P.red : P.line, display: "flex", flexDirection: "column", gap: "4px", alignItems: "center" } },
            s.h("span", { class: "u10num", style: { width: "34px", height: "34px", fontSize: "19px", background: i === 5 ? P.red : P.unit } }, String(i + 1)), s.h("p", { class: "small", style: { fontSize: "19px", lineHeight: 1.25 } }, t))));
          const grid = s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", alignItems: "stretch" } }, ...cards);
          const spoil = later(s.h("div", { class: "card soft", style: { padding: "8px 16px" } }, small(s, ["Die Löcher von der Nadel in den Geldscheinen beweisen: Das Geld gehört Emil! Der Dieb ist ein gesuchter Bankräuber. Emil bekommt ", B(s, "1000 Mark"), " Belohnung."])));
          let open = false;
          const sBtn = later(s.h("button", { class: "btn", onclick: () => { open = !open; if (open) { s.sfx.fanfare(); s.show(spoil, "up"); } else { s.sfx.click(); s.hide(spoil); } } }, "Spoiler: Ende zeigen"));
          const bottom = s.h("div", { style: { display: "grid", gridTemplateColumns: "300px 1fr", gap: "12px", alignItems: "center" } }, sBtn, spoil);
          const m6 = later(merk(s, { style: { fontSize: "20px", padding: "8px 16px 10px" } }, "Einleitung, Hauptteil, ", B(s, "Höhepunkt"), ", Schluss – wie beim Spannungsbogen deiner eigenen Geschichten. Ein Roman hat nur mehr Stationen."));
          s.add(root(s, "stack", { gap: "10px" }, v, grid, bottom, m6));
          s.sfx.pop();
          const show = async idx => { for (const i of idx) { s.sfx.note(i * 2, .25); s.show(dots[i], "pop"); await s.show(cards[i], "up"); } };
          s.step(async () => { s.sfx.scribble(); await s.show(curve, "draw"); await show([0, 1]); s.say("Abschied in Neustadt. Dann ist das Geld weg!"); });
          s.step(async () => { s.sound("tram-bell", { vol: .35, dur: 1.5 }); await show([2, 3, 4]); s.say("Verfolgung, Detektive, eine Nacht vor dem Hotel."); });
          s.step(async () => { s.sound("heartbeat", { vol: .5, dur: 2 }); await show([5]); s.say("Der Höhepunkt: In der Bank wird es richtig spannend."); });
          s.step(async () => { s.sfx.pop(); await show([6]); await s.show(sBtn, "pop"); s.say("Das Ende verraten wir nur, wenn du willst."); });
          s.step(async () => { s.sfx.ding(); await s.show(m6, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Ort und Zeit: Berlin 1929",
        say: "Emil und die Detektive spielt an echten Orten in Berlin. Folge der Verfolgungsjagd auf der Karte!",
        build(s) {
          const W = 520, H = 400, v = s.svg(W, H);
          v.append(s.el("rect", { x: 2, y: 2, width: W - 4, height: H - 4, rx: 14, fill: "#f3f6ee", stroke: P.line, "stroke-width": 2 }),
            s.el("path", { d: "M0 104 Q120 118 240 92 T520 50", stroke: P.pencil, "stroke-width": 5, fill: "none", "stroke-dasharray": "14 8" }),
            s.el("path", { d: "M128 112 L170 380", stroke: "#d8dde4", "stroke-width": 18, "stroke-linecap": "round" }),
            T(s, 186, 206, "Kaiserallee", { "font-size": 19, "text-anchor": "start", fill: P.pencil }), T(s, 186, 228, "(heute Bundesallee)", { "font-size": 19, "font-weight": 400, "text-anchor": "start", fill: P.pencil }),
            T(s, W - 14, H - 14, "Skizze, nicht maßstabsgetreu", { "font-size": 19, "font-weight": 400, "text-anchor": "end", fill: P.pencil }));
          const pin = (x, y, n, c, lbl, lx, ly, anchor) => later(s.el("g", null, s.el("circle", { cx: x, cy: y, r: 16, fill: c, stroke: "#fff", "stroke-width": 3 }), T(s, x, y + 7, n, { fill: "#fff", "font-size": 19 }), T(s, lx, ly, lbl, { "font-size": 20, "text-anchor": anchor || "middle" })));
          const ZOO = [128, 112], JOS = [160, 318], NIK = [80, 352], NOL = [430, 230], FRI = [460, 58];
          const p1 = pin(...ZOO, "1", P.unit, "Bahnhof Zoo", 128, 80);
          const p2 = later(s.el("g", null, s.el("circle", { cx: 150, cy: 236, r: 16, fill: P.unit, stroke: "#fff", "stroke-width": 3 }), T(s, 150, 243, "2", { fill: "#fff", "font-size": 19 })));
          const p3 = pin(...JOS, "3", P.unit, "Café Josty", 136, 312, "end");
          const p4 = pin(...NIK, "4", P.unit, "Nikolsburger Platz", 20, 392, "start");
          const p5 = pin(...NOL, "5", P.unit, "Nollendorfplatz", 440, 200);
          const pG = pin(...FRI, "G", P.blue, "Bahnhof Friedrichstraße", 436, 30, "end");
          const route = later(s.el("path", { d: `M${ZOO[0]} ${ZOO[1]} L${JOS[0]} ${JOS[1]} L${NIK[0]} ${NIK[1]} Q260 360 ${NOL[0]} ${NOL[1]}`, stroke: P.red, "stroke-width": 4, fill: "none", "stroke-dasharray": "2 9", "stroke-linecap": "round" }));
          const runner = s.el("circle", { cx: ZOO[0], cy: ZOO[1], r: 9, fill: P.red, opacity: 0 });
          v.append(route, pG, p1, p2, p3, p4, p5, runner);
          const LEG = [
            ["1", "Bahnhof Zoo: Der Dieb steigt aus – Emil hinterher.", P.unit],
            ["2", "Kaiserallee: Emil fährt mit der Straßenbahn hinterher.", P.unit],
            ["3", "Café Josty: Der Dieb sitzt im Café. Emil versteckt sich hinter einer Litfaßsäule.", P.unit],
            ["4", "Nikolsburger Platz: Die Detektive halten Kriegsrat.", P.unit],
            ["5", "Nollendorfplatz: Der Dieb übernachtet im Hotel.", P.unit],
            ["G", "Bahnhof Friedrichstraße: Hier warten Großmutter und Pony vergeblich.", P.blue],
          ];
          const leg = LEG.map(([n, t, c]) => later(s.h("div", { style: { display: "grid", gridTemplateColumns: "36px 1fr", gap: "10px", alignItems: "center" } }, s.h("span", { class: "u10num", style: { width: "34px", height: "34px", fontSize: "19px", background: c } }, n), small(s, t, { fontSize: "19px" }))));
          const pic = later(s.photo("nikolsburger-platz", { w: "100%", h: 220, pos: "50% 55%", caption: "Nikolsburger Platz heute" }));
          const ZEIT = ["bezahlt wird mit Mark", "Telefon nur in manchen Wohnungen", "kein Handy, kein Navi"];
          const zeit = later(s.h("div", { class: "card soft", style: { padding: "8px 14px", display: "flex", flexDirection: "column", gap: "6px" } }, s.h("p", { style: { margin: 0, font: "700 21px/1.2 var(--f-display)", color: P.unit } }, "Zeit: 1929 – so war es damals"),
            s.h("div", { class: "row", style: { gap: "6px" } }, ...ZEIT.map(t => s.h("span", { class: "u10chip", style: { background: "#fff" } }, t)))));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "520px 1fr", gap: "18px", alignItems: "start" }, s.h("div", { class: "stack", style: { gap: "10px" } }, v, zeit), s.h("div", { class: "stack", style: { gap: "8px" } }, ...leg, pic)));
          s.sfx.pop();
          const run = async (pts, dur) => { if (s.fast) return; runner.setAttribute("opacity", 1); for (let i = 1; i < pts.length; i++) { const [a, b] = [pts[i - 1], pts[i]]; await s.tween({ from: 0, to: 1, dur, ease: "inOut", update: t => { runner.setAttribute("cx", a[0] + (b[0] - a[0]) * t); runner.setAttribute("cy", a[1] + (b[1] - a[1]) * t); } }); } };
          s.step(async () => { s.sound("ubahn-train", { vol: .35, dur: 2 }); await s.show(p1, "pop"); await s.show(leg[0], "left"); s.say(LEG[0][1]); });
          s.step(async () => { s.sound("tram-bell", { vol: .4, dur: 1.5 }); s.show(route, "draw"); s.show(p2, "pop"); await s.show(leg[1], "left"); await run([ZOO, JOS], 1200); s.show(p3, "pop"); await s.show(leg[2], "left"); s.say("Straßenbahn über die Kaiserallee. Dann sitzt der Dieb im Café Josty."); });
          s.step(async () => { s.sfx.drum(); await run([JOS, NIK], 600); await s.show(p4, "pop"); await s.show(leg[3], "left"); s.show(pic, "zoom"); s.say(LEG[3][1]); });
          s.step(async () => { await run([NIK, [260, 340], NOL], 700); s.sfx.ding(); await s.show(p5, "pop"); await s.show(leg[4], "left"); s.say(LEG[4][1]); });
          s.step(async () => { s.sfx.pop(); await s.show(pG, "pop"); await s.show(leg[5], "left"); s.sound("clock-tick", { vol: .4, dur: 1.5 }); await s.show(zeit, "up"); s.say("Die Zeit: 1929. Kein Handy, kein Navi."); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Meine Lieblingsstelle",
        say: "Am Ende stellst du deine Lieblingsstelle vor. Du sagst, wo sie steht, was passiert und warum sie dir gefällt.",
        build(s) {
          const W = 440, H = 300, v = s.svg(W, H);
          v.append(s.el("path", { d: "M220 40 Q150 20 20 36 V270 Q150 254 220 274 Z", fill: "#fff", stroke: P.unit, "stroke-width": 3 }),
            s.el("path", { d: "M220 40 Q290 20 420 36 V270 Q290 254 220 274 Z", fill: "#fbfcf0", stroke: P.unit, "stroke-width": 3 }),
            ...[70, 96, 122, 148, 174, 200, 226].map(y => s.el("path", { d: `M44 ${y} Q130 ${y - 8} 200 ${y + 2} M240 ${y + 2} Q310 ${y - 8} 396 ${y}`, stroke: P.line, "stroke-width": 3, fill: "none" })));
          const hl = later(s.el("rect", { x: 244, y: 112, width: 150, height: 70, rx: 4, fill: P.yellow, opacity: .55 }));
          const notes = [[60, 4, "#ffe066", -6], [300, 0, "#a7e3b8", 5], [160, 10, "#f9b4c4", -2]].map(([x, y, c, r]) => later(s.el("g", { transform: `rotate(${r} ${x + 25} ${y + 30})` }, s.el("rect", { x, y, width: 50, height: 62, rx: 3, fill: c, stroke: "rgba(0,0,0,.15)" }))));
          v.append(hl, ...notes);
          const S3 = [
            ["1 · Finden", "Beim Lesen Klebezettel an spannende, lustige oder traurige Stellen kleben."],
            ["2 · Erzählen", "Sag kurz, wo die Stelle im Buch steht und was davor passiert ist."],
            ["3 · Begründen", "„Mir gefällt die Stelle, weil …“ – „Ich musste lachen, als …“"],
            ["4 · Vorlesen", "Üben, betonen, langsam lesen – höchstens drei Minuten."],
          ];
          const cards = S3.map(([a, b]) => later(s.h("div", { class: "card", style: { padding: "8px 14px" } }, s.h("p", { style: { margin: 0, font: "700 22px/1.2 var(--f-display)", color: P.unit } }, a), small(s, b))));
          const ex = later(s.h("div", { class: "ex", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, "So kann es klingen"),
            s.h("p", { class: "hand", style: { margin: 0, fontSize: "28px", lineHeight: 1.1 } }, "Meine Lieblingsstelle ist die Verfolgung: Viele Kinder schleichen hinter dem Mann mit dem steifen Hut her. Ich mag sie, weil die Kinder zusammenhalten.")));
          const lf = later(life(s, { style: { padding: "10px 16px" } }, small(s, "Genauso empfiehlst du Freunden ein Buch, einen Film oder ein Spiel: Was passiert? Was ist das Beste daran?")));
          const SA = ["Hier wurde es spannend, als …", "Ich war überrascht, dass …", "Am liebsten wäre ich dabei gewesen, als …"];
          const sa = later(s.h("div", { class: "card soft", style: { padding: "8px 14px", display: "flex", flexDirection: "column", gap: "2px" } }, s.h("p", { style: { margin: 0, font: "700 20px/1.2 var(--f-display)", color: P.unit } }, "Noch mehr Satzanfänge"), ...SA.map(x => small(s, "• " + x))));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "440px 1fr", gap: "20px", alignItems: "start" }, s.h("div", { class: "stack", style: { gap: "12px" } }, v, sa, lf), s.h("div", { class: "stack", style: { gap: "10px" } }, ...cards, ex)));
          s.sound("page-turn-2");
          s.step(async () => { for (const n of notes) { s.sfx.snap(); await s.show(n, "down"); } await s.show(cards[0], "left"); s.say(S3[0][1]); });
          s.step(async () => { s.sfx.pop(); s.show(hl, "fade"); await s.show(cards[1], "left"); s.sfx.pop(); await s.show(cards[2], "left"); s.show(sa, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(cards[3], "left"); s.sound("pencil-write", { vol: .4, dur: 1.2 }); await s.show(ex, "up"); s.say("Meine Lieblingsstelle ist die Verfolgung. Ich mag sie, weil die Kinder zusammenhalten."); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Was ist eine Szene?",
        say: "Ein Theaterstück besteht aus Szenen. Im Text stehen nur die Namen der Figuren und was sie sagen. In Klammern steht, was sie tun.",
        build(s) {
          const W = 500, H = 280, v = s.svg(W, H);
          v.append(s.el("rect", { x: 0, y: 0, width: W, height: H, rx: 14, fill: "#2a3550" }),
            s.el("rect", { x: 20, y: 30, width: W - 40, height: 200, fill: "#f6e9c9" }),
            s.el("path", { d: "M20 230 H480 L500 270 H0 Z", fill: P.brown }),
            s.el("path", { d: "M130 130 l40 -30 l40 30 v60 h-80 Z", fill: "#cfe3b0", stroke: P.unit, "stroke-width": 3 }),
            mouse(s, 300, 170, "#c9b8a8"), mouse(s, 380, 170, "#a8a8b8"));
          const cl = s.el("rect", { x: 20, y: 30, width: 230, height: 200, fill: "#b3261e" }), cr = s.el("rect", { x: 250, y: 30, width: 230, height: 200, fill: "#b3261e" });
          v.append(cl, cr, s.el("rect", { x: 10, y: 14, width: W - 20, height: 26, rx: 6, fill: "#8f1d12" }));
          const open = async () => { s.sound("drumroll", { vol: .35, dur: 1.5 }); await s.tween({ from: 230, to: 30, dur: s.fast ? 1 : 1300, ease: "inOut", update: w => { cl.setAttribute("width", w); cr.setAttribute("x", 480 - w); cr.setAttribute("width", w); } }); };
          const LINES = [
            [null, "1. Szene · Auf dem Feld vor dem Mauseloch"],
            ["FELDMAUS", "(öffnet die Tür, strahlt)", "Herzlich willkommen!"],
            ["STADTMAUS", "(rümpft die Nase)", "Hier wohnst du?"],
            ["FELDMAUS", "(stolz)", "Ja! Und es gibt Körner."],
          ];
          const regs = [];
          const lines = LINES.map(([who, reg, txt]) => {
            if (!who) return later(s.h("p", { style: { margin: 0, font: "700 20px/1.2 var(--f-display)", color: P.unit } }, reg));
            const r = s.h("span", { class: "u10reg" }, reg + " "); regs.push(r);
            return later(s.h("p", { style: { margin: 0, fontSize: "21px", lineHeight: 1.35 } }, s.h("b", { style: { color: P.violet } }, who + ": "), r, txt));
          });
          const script = s.h("div", { class: "card", style: { padding: "10px 16px", display: "flex", flexDirection: "column", gap: "6px", background: "#fffef6" } }, ...lines);
          const hearBtn = later(s.h("button", { class: "btn", onclick: () => { s.sfx.click(); read(s, "Herzlich willkommen! Hier wohnst du? Ja! Und es gibt Körner."); } }, speaker(s), "Nur das Gesprochene"));
          const R = [
            ["Szene", "ein Abschnitt des Stücks: ein Ort, eine Zeit. Kommt eine Figur dazu oder geht, beginnt oft eine neue Szene."],
            ["Dialog", "Name der Figur + Doppelpunkt + was sie sagt. Keine Anführungszeichen!"],
            ["Regieanweisung", "steht in Klammern. Sie sagt, wie oder was gespielt wird – laut gelesen wird sie nicht."],
          ];
          const rc = R.map(([a, b], i) => later(s.h("div", { class: "card", style: { padding: "8px 14px", borderLeft: "8px solid " + [P.unit, P.violet, P.pencil][i] } }, s.h("p", { style: { margin: 0, font: "700 22px/1.2 var(--f-display)", color: [P.unit, P.violet, P.pencil][i] } }, a), small(s, b))));
          const lf9 = later(life(s, { style: { padding: "8px 14px" } }, small(s, "Auch Filme und Hörspiele haben ein Drehbuch: Namen, Dialoge und Anweisungen, was passiert.")));
          const pic = later(s.photo("theater-vorhang", { w: "100%", h: 150, pos: "50% 40%", caption: "Gleich geht der Vorhang auf." }));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "500px 1fr", gap: "18px", alignItems: "start" }, s.h("div", { class: "stack", style: { gap: "10px" } }, v, script, lf9),
            s.h("div", { class: "stack", style: { gap: "10px" } }, ...rc, hearBtn, pic)));
          s.sfx.pop();
          s.step(async () => { await open(); s.sound("applause", { vol: .3, dur: 2 }); await s.show(lines[0], "fade"); await s.show(rc[0], "left"); s.say("Erste Szene: auf dem Feld vor dem Mauseloch."); });
          s.step(async () => { for (const i of [1, 2, 3]) { s.sfx.pop(); await s.show(lines[i], "left"); } await s.show(rc[1], "left"); });
          s.step(async () => { for (const r of regs) { r.style.background = "#e9edf2"; r.style.borderRadius = "4px"; s.sfx.tick(); await s.wait(250); } await s.show(rc[2], "left"); s.show(hearBtn, "pop"); s.say("Herzlich willkommen! Hier wohnst du?"); });
          s.step(async () => { s.sfx.ding(); await s.show(pic, "zoom"); s.sfx.pop(); await s.show(lf9, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Aus der Fabel wird ein Stück",
        say: "Die Fabel von der Stadtmaus und der Feldmaus erzählt Äsop. Wir machen daraus eine Spielszene.",
        build(s) {
          const spans = {};
          const sp = (k, t) => { const e = s.h("span", { style: { borderRadius: "4px", padding: "0 2px", transition: "background .4s" } }, t); (spans[k] = spans[k] || []).push(e); return e; };
          const story = s.h("div", { class: "card", style: { padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px" } },
            s.h("p", { style: { margin: 0, font: "700 21px/1.2 var(--f-display)", color: P.unit } }, "Die Fabel (nach Äsop, nacherzählt)"),
            s.h("p", { style: { margin: 0, fontSize: "21px", lineHeight: 1.4 } }, sp("fig", "Die Feldmaus"), " lud ", sp("fig", "die Stadtmaus"), " ", sp("ort", "aufs Feld"), " ein. Sie ", sp("act", "stellte Körner und Wurzeln auf den Tisch"), ". ", sp("talk", "„Ist das alles?“"), ", fragte die Stadtmaus. ", sp("talk", "„Komm mit mir in die Stadt! Da gibt es Käse und Kuchen.“")),
            s.h("p", { style: { margin: 0, fontSize: "21px", lineHeight: 1.4 } }, sp("ort", "In der Speisekammer"), " ", sp("act", "knabberten die beiden an einem großen Käse"), ". Da ", sp("act", "kam die Katze"), "! ", sp("talk", "„Hilfe!“"), ", rief die Feldmaus und ", sp("act", "rannte davon"), "."),
            s.h("p", { style: { margin: 0, fontSize: "20px", lineHeight: 1.35, color: P.pencil } }, "Lehre: Lieber einfach und in Ruhe als fein und in Angst."));
          const KEY = [["fig", "Figuren", "#dde8fb", P.blue], ["ort", "Ort", "#e3f2d0", P.unit], ["talk", "Wörtliche Rede", "#ece5fb", P.violet], ["act", "Handlung", "#eceff3", P.pencil]];
          const keyChips = KEY.map(([, n, bg, c]) => later(s.h("span", { class: "u10chip", style: { background: bg, color: c } }, n)));
          const paint = k => { const [, , bg] = KEY.find(x => x[0] === k); spans[k].forEach(e => { e.style.background = bg; }); };
          const SL = [
            ["fig", s.h("p", { style: { margin: 0, fontSize: "20px" } }, B(s, "Personen: ", P.blue), "Feldmaus, Stadtmaus, Katze")],
            ["ort", s.h("p", { style: { margin: 0, font: "700 20px/1.2 var(--f-display)", color: P.unit } }, "1. Szene · Auf dem Feld")],
            ["talk", s.h("p", { style: { margin: 0, fontSize: "20px", lineHeight: 1.35 } }, B(s, "FELDMAUS: ", P.violet), s.h("span", { class: "u10reg" }, "(stellt Körner und Wurzeln auf den Tisch) "), "Greif zu!")],
            ["talk", s.h("p", { style: { margin: 0, fontSize: "20px", lineHeight: 1.35 } }, B(s, "STADTMAUS: ", P.violet), s.h("span", { class: "u10reg" }, "(rümpft die Nase) "), "Ist das alles? Komm mit mir in die Stadt! Da gibt es Käse und Kuchen.")],
            ["ort", s.h("p", { style: { margin: 0, font: "700 20px/1.2 var(--f-display)", color: P.unit } }, "2. Szene · In der Speisekammer")],
            ["act", s.h("p", { style: { margin: 0, fontSize: "20px", lineHeight: 1.35 } }, s.h("span", { class: "u10reg" }, "(Beide knabbern an einem großen Käse. Die Katze schleicht herein.)"))],
            ["talk", s.h("p", { style: { margin: 0, fontSize: "20px", lineHeight: 1.35 } }, B(s, "FELDMAUS: ", P.violet), s.h("span", { class: "u10reg" }, "(zittert) "), "Hilfe! ", s.h("span", { class: "u10reg" }, "(rennt davon)"))],
          ].map(([k, el]) => { later(el); el.k = k; return el; });
          const script = s.h("div", { class: "card", style: { padding: "12px 16px", display: "flex", flexDirection: "column", gap: "6px", background: "#fffef6", borderColor: P.violet } },
            s.h("p", { style: { margin: 0, font: "700 21px/1.2 var(--f-display)", color: P.violet } }, "Das Spielskript"), ...SL);
          const m = later(merk(s, { style: { fontSize: "20px", padding: "8px 16px 10px" } }, B(s, "Figuren"), " → Personenliste · ", B(s, "Ort"), " → Szenen · ", B(s, "Rede"), " → Dialog · ", B(s, "Handlung"), " → Regieanweisung"));
          const tip10 = later(s.h("div", { class: "card soft", style: { padding: "8px 14px" } }, small(s, [B(s, "Tipp: "), "Ihr dürft Sätze dazuerfinden! Ein Stück braucht mehr Dialog als die Fabel, zum Beispiel: „Pst! Hörst du das?“"])));
          const lf10 = later(life(s, { style: { padding: "8px 14px" } }, small(s, "Ein Comic funktioniert ähnlich: Die Sprechblasen sind der Dialog, die Bilder zeigen, was passiert.")));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "490px 1fr", gap: "16px", alignItems: "start" },
            s.h("div", { class: "stack", style: { gap: "10px" } }, story, s.h("div", { class: "row", style: { gap: "8px" } }, ...keyChips), m), s.h("div", { class: "stack", style: { gap: "10px" } }, script, tip10, lf10)));
          s.sfx.pop();
          const step = async (k, i) => { paint(k); s.show(keyChips[i], "pop"); for (const el of SL.filter(e => e.k === k)) { s.sfx.pop(); await s.show(el, "left"); } };
          s.step(async () => { s.sfx.ding(); await step("fig", 0); s.say("Erst die Figuren: Feldmaus, Stadtmaus, Katze."); });
          s.step(async () => { s.sfx.whoosh(); await step("ort", 1); s.say("Jeder Ort wird eine Szene."); });
          s.step(async () => { s.sound("pencil-write", { vol: .4, dur: 1.2 }); await step("talk", 2); s.say("Die wörtliche Rede wird zum Dialog."); });
          s.step(async () => { s.sound("cat-meow", { vol: .6 }); await step("act", 3); s.say("Die Handlung kommt in Klammern: als Regieanweisung."); });
          s.step(async () => { s.sfx.success(); await s.show(m, "up"); s.sfx.pop(); await s.show(tip10, "up"); await s.show(lf10, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Stimme, Mimik, Gestik, Haltung",
        say: "Auf der Bühne spielst du mit dem ganzen Körper: mit der Stimme, dem Gesicht, den Händen und der Haltung.",
        build(s) {
          const W = 380, H = 380, v = s.svg(W, H);
          v.append(s.el("rect", { x: 4, y: 4, width: W - 8, height: H - 8, rx: 16, fill: P.soft }), s.el("path", { d: `M20 ${H - 30} H${W - 20}`, stroke: P.brown, "stroke-width": 6 }));
          const fig = s.el("g", { transform: `rotate(0 190 300)` });
          const legs = s.el("path", { d: "M175 300 L165 350 M205 300 L215 350", stroke: "#8f7a6a", "stroke-width": 9, "stroke-linecap": "round" });
          const bodyE = s.el("ellipse", { cx: 190, cy: 255, rx: 46, ry: 60, fill: "#c9b8a8" });
          const arms = s.el("path", { d: "M150 230 L120 280 M230 230 L260 280", stroke: "#8f7a6a", "stroke-width": 9, "stroke-linecap": "round", fill: "none" });
          const headG = s.el("g", null,
            s.el("circle", { cx: 150, cy: 112, r: 26, fill: "#c9b8a8", stroke: "#8f7a6a", "stroke-width": 3 }), s.el("circle", { cx: 230, cy: 112, r: 26, fill: "#c9b8a8", stroke: "#8f7a6a", "stroke-width": 3 }),
            s.el("circle", { cx: 190, cy: 150, r: 46, fill: "#c9b8a8" }), s.el("circle", { cx: 190, cy: 166, r: 6, fill: "#e58aa0" }));
          const eyes = s.el("g", null, s.el("circle", { cx: 172, cy: 142, r: 6, fill: P.ink }), s.el("circle", { cx: 208, cy: 142, r: 6, fill: P.ink }));
          const brows = s.el("path", { d: "M162 126 L180 126 M200 126 L218 126", stroke: P.ink, "stroke-width": 4, "stroke-linecap": "round" });
          const mouth = s.el("path", { d: "M176 180 Q190 186 204 180", stroke: P.ink, "stroke-width": 4, fill: "none", "stroke-linecap": "round" });
          fig.append(legs, bodyE, arms, headG, eyes, brows, mouth);
          v.append(fig);
          const MOODS = {
            enttäuscht: { brows: "M162 122 L180 128 M200 128 L218 122", mouth: "M176 186 Q190 176 204 186", arms: "M150 230 L140 300 M230 230 L240 300", rot: 0, ty: 12, rate: .8, pitch: .9, voice: "leise, langsam", mimik: "Mundwinkel nach unten", gestik: "Arme hängen", haltung: "zusammengesunken" },
            staunend: { brows: "M162 116 Q171 108 180 116 M200 116 Q209 108 218 116", mouth: "M184 178 a6 9 0 1 0 12 0 a6 9 0 1 0 -12 0", arms: "M150 230 L110 190 M230 230 L270 190", rot: 0, ty: -6, rate: 1, pitch: 1.3, voice: "hoch, mit „Oh!“", mimik: "große Augen, offener Mund", gestik: "Hände hoch", haltung: "aufgerichtet" },
            wütend: { brows: "M162 120 L180 132 M200 132 L218 120", mouth: "M176 184 L204 184", arms: "M150 230 L135 262 L160 270 M230 230 L245 262 L220 270", rot: 0, ty: 0, rate: 1.15, pitch: .8, voice: "laut, scharf", mimik: "Augenbrauen zusammen", gestik: "Hände in die Hüften", haltung: "breitbeinig, fest" },
            ängstlich: { brows: "M162 128 L180 120 M200 120 L218 128", mouth: "M176 182 q5 -5 9 0 q5 5 9 0 q5 -5 10 0", arms: "M150 230 L170 190 M230 230 L210 190", rot: -8, ty: 10, rate: 1.25, pitch: 1.2, voice: "leise, zittrig", mimik: "Augen weit, Mund zittert", gestik: "Hände vor dem Gesicht", haltung: "geduckt, weicht zurück" },
          };
          const KS = [["Stimme", "voice"], ["Mimik", "mimik"], ["Gestik", "gestik"], ["Körperhaltung", "haltung"]];
          const DEF = { Stimme: "laut – leise, schnell – langsam, hoch – tief", Mimik: "das Gesicht: Augen, Brauen, Mund", Gestik: "Bewegungen der Hände und Arme", Körperhaltung: "wie der ganze Körper steht oder sitzt" };
          const vals = {};
          const kc = KS.map(([n, k], i) => { const val = s.h("p", { class: "small", style: { fontSize: "20px", fontWeight: 700, color: P.unit } }, ""); vals[k] = val;
            return later(s.h("div", { class: "card", style: { padding: "8px 14px", display: "grid", gridTemplateColumns: "40px 1fr", gap: "10px", alignItems: "center" } }, s.h("span", { class: "u10num" }, String(i + 1)),
              s.h("div", null, s.h("p", { style: { margin: 0, font: "700 22px/1.15 var(--f-display)" } }, n), small(s, DEF[n], { color: P.pencil }), val))); });
          const line = s.h("p", { style: { margin: 0, font: "700 26px/1.2 var(--f-display)", color: P.violet, textAlign: "center" } }, "STADTMAUS: „Ist das alles?“");
          let mood = "enttäuscht";
          const setMood = async (k, speak) => {
            mood = k; const d = MOODS[k];
            brows.setAttribute("d", d.brows); mouth.setAttribute("d", d.mouth); arms.setAttribute("d", d.arms);
            fig.setAttribute("transform", `translate(0 ${d.ty}) rotate(${d.rot} 190 300)`);
            KS.forEach(([, kk]) => { vals[kk].textContent = "→ " + d[kk]; });
            btns.forEach(b => b.classList.toggle("solid", b.dataset.k === k));
            if (speak) read(s, "Ist das alles?", { rate: d.rate, pitch: d.pitch });
          };
          const btns = Object.keys(MOODS).map(k => { const b = s.h("button", { class: "btn", style: { minWidth: "0", padding: "0 14px" }, onclick: () => { s.sfx.click(); setMood(k, true); } }, k); b.dataset.k = k; return b; });
          const bRow = later(s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" } }, ...btns));
          const m = later(merk(s, { style: { fontSize: "20px", padding: "8px 14px 10px" } }, "Ein Satz – viele Gefühle! Spiel ", B(s, "deutlich"), " und etwas übertrieben, damit es auch die letzte Reihe sieht."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "380px 1fr", gap: "18px", alignItems: "start" }, s.h("div", { class: "stack", style: { gap: "10px" } }, v, bRow),
            s.h("div", { class: "stack", style: { gap: "8px" } }, line, ...kc, m)));
          setMood("enttäuscht"); s.sfx.pop();
          s.step(async () => { s.sfx.pop(); await s.show(kc[0], "left"); read(s, "Ist das alles?", { rate: .8, pitch: .9 }); });
          s.step(async () => { s.sfx.boing(); setMood("staunend"); await s.show(kc[1], "left"); s.sfx.pop(); await s.show(kc[2], "left"); });
          s.step(async () => { s.sfx.drum(); setMood("wütend"); await s.show(kc[3], "left"); });
          s.step(async () => { s.sound("cat-meow", { vol: .5 }); setMood("ängstlich"); await s.show(bRow, "up"); s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Das Standbild",
        say: "Bei einem Standbild friert ihr in einer Haltung ein, wie auf einem Foto. Die anderen schauen genau hin und beschreiben, was sie sehen.",
        build(s) {
          const W = 560, H = 330, v = s.svg(W, H);
          v.append(s.el("rect", { x: 0, y: 0, width: W, height: H, rx: 16, fill: "#f6e9c9" }), s.el("rect", { x: 0, y: H - 50, width: W, height: 50, fill: "#e0c79a" }),
            s.el("rect", { x: 30, y: 120, width: 190, height: 70, rx: 6, fill: "#f1d36b", stroke: P.brown, "stroke-width": 3 }), s.el("circle", { cx: 80, cy: 150, r: 8, fill: "#e0b84a" }), s.el("circle", { cx: 150, cy: 140, r: 6, fill: "#e0b84a" }),
            s.el("path", { d: "M50 190 v90 M200 190 v90", stroke: P.brown, "stroke-width": 8 }));
          const mF = mouse(s, 110, 230, "#c9b8a8", 1.1), mS = mouse(s, 190, 230, "#a8a8b8", 1.1), kat = cat(s, 440, 210, 1.5);
          const gF = s.el("g", null, mF), gS = s.el("g", null, mS), gK = s.el("g", null, kat);
          v.append(gF, gS, gK);
          const flash = s.el("rect", { x: 0, y: 0, width: W, height: H, rx: 16, fill: "#fff", opacity: 0 });
          const frame = later(s.el("rect", { x: 6, y: 6, width: W - 12, height: H - 12, rx: 12, fill: "none", stroke: P.unit, "stroke-width": 6, "stroke-dasharray": "22 12" }));
          const B1 = later(s.el("g", null, s.el("rect", { x: 30, y: 24, width: 200, height: 44, rx: 14, fill: "#fff", stroke: P.unit, "stroke-width": 2 }), T(s, 130, 53, "Ich will nach Hause!", { "font-size": 19 })));
          const B2 = later(s.el("g", null, s.el("rect", { x: 330, y: 24, width: 200, height: 44, rx: 14, fill: "#fff", stroke: P.red, "stroke-width": 2 }), T(s, 430, 53, "Wo sind die Mäuse?", { "font-size": 19, fill: P.red })));
          v.append(frame, B1, B2, flash);
          let wig = true;
          s.loop(t => { if (!wig) return; gF.setAttribute("transform", `translate(${Math.sin(t / 300) * 8} ${Math.abs(Math.sin(t / 200)) * -10})`); gS.setAttribute("transform", `translate(${Math.sin(t / 260 + 1) * 8} 0)`); gK.setAttribute("transform", `translate(${Math.sin(t / 500) * 30} 0)`); });
          const freeze = async () => { wig = false; s.sound("camera-shutter", { vol: .6 }); gF.setAttribute("transform", "translate(-40 6) rotate(-14 110 230)"); gS.setAttribute("transform", "translate(-10 -20)"); gK.setAttribute("transform", "translate(-70 -10) rotate(-6 440 210)"); if (!s.fast) { flash.setAttribute("opacity", 1); await s.tween({ from: 1, to: 0, dur: 500, update: x => flash.setAttribute("opacity", x) }); } };
          const again = later(s.h("button", { class: "btn", onclick: async () => { s.sfx.click(); wig = true; await s.wait(1500); if (s.alive) freeze(); } }, "Nochmal: bewegen und einfrieren"));
          const Q = [["Wer steht wo?", "Nah beieinander oder weit weg?"], ["Wie sehen sie aus?", "Gesicht, Hände, Haltung"], ["Was fühlen sie?", "Angst, Neugier, Stolz …"]];
          const qs = Q.map(([a, b]) => later(s.h("div", { class: "card", style: { padding: "8px 14px" } }, s.h("p", { style: { margin: 0, font: "700 22px/1.2 var(--f-display)", color: P.unit } }, a), small(s, b))));
          const gd = later(s.h("div", { class: "card soft", style: { padding: "8px 14px" } }, small(s, [B(s, "Gedankenstimme: "), "Tippt die Spielleitung eine Figur an, sagt sie in einem Satz, was sie gerade denkt."])));
          const lf = later(life(s, { style: { padding: "8px 14px" } }, small(s, "Ein Mannschaftsfoto nach dem Pokalsieg ist auch ein Standbild: Jubelnde Arme, alle eng zusammen.")));
          const head = s.h("p", { style: { margin: 0, font: "700 24px/1.2 var(--f-display)", color: P.unit } }, "Szene: Die Katze kommt!");
          const m12 = later(merk(s, { style: { fontSize: "20px", padding: "8px 14px 10px" } }, "Im ", B(s, "Standbild"), " bewegt sich niemand und keiner spricht. Nur Haltung, Gesicht und Abstand erzählen."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "560px 1fr", gap: "18px", alignItems: "start" }, s.h("div", { class: "stack", style: { gap: "10px" } }, head, v, again, lf), s.h("div", { class: "stack", style: { gap: "10px" } }, ...qs, gd, m12)));
          s.sfx.pop();
          s.step(async () => { await freeze(); s.show(frame, "fade"); s.say("Klick! Alle frieren ein."); });
          s.step(async () => { for (const q of qs) { s.sfx.pop(); await s.show(q, "left"); } s.say("Wer steht wo? Wie sehen sie aus? Was fühlen sie?"); });
          s.step(async () => { s.sfx.boing(); await s.show(B1, "pop"); s.sfx.boing(); await s.show(B2, "pop"); await s.show(gd, "up"); s.say("Ich will nach Hause! – Wo sind die Mäuse?"); });
          s.step(async () => { s.sound("crowd-cheer", { vol: .3, dur: 2 }); await s.show(lf, "up"); s.show(again, "pop"); s.sfx.ding(); await s.show(m12, "up"); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Die Rollenkarte",
        say: "Eine Rollenkarte hilft dir, in eine Rolle zu schlüpfen. Sie verrät, wer du bist, was du willst und wie du dich bewegst.",
        build(s) {
          const RK = [
            ["Wer bin ich?", "Ich bin die Stadtmaus. Ich wohne in einem großen Haus in der Stadt."],
            ["Was will ich?", "Ich will meiner Freundin zeigen, wie fein ich lebe."],
            ["Wie bin ich?", "stolz, ein bisschen eingebildet, mag feines Essen"],
            ["Wie spreche ich?", "schnell, etwas von oben herab: „Ist das alles?“"],
            ["Wie bewege ich mich?", "Nase hoch, kleine elegante Schritte"],
          ];
          const rows = RK.map(([a, b]) => later(s.h("div", { style: { display: "grid", gridTemplateColumns: "210px 1fr", gap: "12px", alignItems: "baseline", borderBottom: "2px solid " + P.line, padding: "6px 0" } }, s.h("b", { style: { fontSize: "21px", color: P.violet } }, a), s.h("p", { class: "t", style: { fontSize: "21px" } }, b))));
          const mv = s.svg(110, 120); mv.style.width = "110px"; mv.style.height = "120px"; mv.append(mouse(s, 55, 64, "#a8a8b8", 1.2));
          const card = s.h("div", { class: "card", style: { padding: "12px 18px", borderColor: P.violet, borderWidth: "3px", background: "#fbf9ff", display: "flex", flexDirection: "column", gap: "4px" } },
            s.h("div", { style: { display: "flex", alignItems: "center", gap: "14px" } }, mv, s.h("div", null, s.h("p", { class: "small", style: { color: P.pencil } }, "Rollenkarte"), s.h("p", { style: { margin: 0, font: "800 32px/1.1 var(--f-display)", color: P.violet } }, "Die Stadtmaus"))), ...rows);
          const ST = [["Lesen", "Rollenkarte in Ruhe lesen"], ["Reinschlüpfen", "Augen zu, tief atmen: Jetzt bin ich die Stadtmaus!"], ["Spielen", "in der Ich-Rolle bleiben, auch wenn jemand lacht"], ["Aussteigen", "Rolle abschütteln: Jetzt bin ich wieder ich."]];
          const sts = ST.map(([a, b], i) => later(s.h("div", { class: "card", style: { padding: "8px 14px", display: "grid", gridTemplateColumns: "40px 1fr", gap: "10px", alignItems: "center" } }, s.h("span", { class: "u10num" }, String(i + 1)), s.h("div", null, s.h("p", { style: { margin: 0, font: "700 21px/1.2 var(--f-display)", color: P.unit } }, a), small(s, b)))));
          const lf13 = later(life(s, { style: { padding: "8px 14px" } }, small(s, "In der Theater-AG oder beim Krippenspiel hilft sie dir.")));
          const m = later(merk(s, { style: { fontSize: "20px", padding: "8px 14px 10px" } }, "Die ", B(s, "Figurenkarte"), " beschreibt eine Figur von außen. Die ", B(s, "Rollenkarte"), " spricht dich an – damit du die Figur ", B(s, "spielen"), " kannst."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "600px 1fr", gap: "18px", alignItems: "start" }, s.h("div", { class: "stack", style: { gap: "10px" } }, card, lf13), s.h("div", { class: "stack", style: { gap: "10px" } }, ...sts, m)));
          s.show(card, "up"); s.sfx.pop();
          s.step(async () => { for (const i of [0, 1]) { s.sound("pencil-write", { vol: .35, dur: .8 }); await s.show(rows[i], "left"); } s.say(RK[0][1] + " " + RK[1][1]); });
          s.step(async () => { for (const i of [2, 3, 4]) { s.sfx.pop(); await s.show(rows[i], "left"); } read(s, "Ist das alles?", { rate: 1.1, pitch: 1.2 }); });
          s.step(async () => { for (const i of [0, 1]) { s.sfx.count(i); await s.show(sts[i], "left"); } });
          s.step(async () => { for (const i of [2, 3]) { s.sfx.count(i); await s.show(sts[i], "left"); } s.sound("applause", { vol: .3, dur: 2 }); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sfx.pop(); await s.show(lf13, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Hochdeutsch und Berlinisch",
        say: "Derselbe Satz klingt ganz verschieden: in der Standardsprache, in der Umgangssprache und auf Berlinisch.",
        build(s) {
          const LV = [
            ["Standardsprache", "Das habe ich nicht gewusst. Das ist gut!", P.blue, "in Büchern, Nachrichten, Briefen, im Unterricht – überall verstanden"],
            ["Umgangssprache", "Das hab ich nich gewusst. Das is gut!", P.orange, "locker, im Alltag, mit Familie und Freunden"],
            ["Berlinisch", "Det hab ick nich jewusst. Det is jut!", P.red, "die Sprache der Stadt Berlin – mit eigenen Wörtern"],
          ];
          const lv = LV.map(([n, t, c, d], i) => later(s.h("div", { class: "card", style: { padding: "8px 14px", borderLeft: "10px solid " + c, marginLeft: i * 28 + "px", display: "flex", flexDirection: "column", gap: "2px" } },
            s.h("div", { class: "row", style: { gap: "10px", justifyContent: "space-between", flexWrap: "nowrap" } }, s.h("p", { style: { margin: 0, font: "700 21px/1.2 var(--f-display)", color: c } }, n),
              s.h("button", { class: "btn", style: { minHeight: "48px", padding: "0 12px" }, onclick: () => { s.sfx.click(); read(s, t); } }, speaker(s))),
            s.h("p", { style: { margin: 0, font: "700 25px/1.25 var(--f-display)" } }, "„" + t + "“"), small(s, d, { color: P.pencil }))));
          const WD = [["ick", "ich"], ["wat", "was"], ["det", "das"], ["jut", "gut"], ["janz", "ganz"], ["Schrippe", "Brötchen"], ["Stulle", "belegte Brotscheibe"], ["Kiez", "Wohnviertel"]];
          const flips = WD.map(([b, h]) => {
            const back = s.h("p", { class: "small", style: { fontSize: "19px", color: P.blue, fontWeight: 700 } }, "= " + h);
            back.style.visibility = "hidden";
            const el = later(s.h("button", { class: "card", style: { padding: "6px 10px", textAlign: "center", cursor: "pointer", minHeight: "76px", font: "inherit", color: "inherit" }, onclick: () => { s.sfx.snap(); back.style.visibility = back.style.visibility === "hidden" ? "visible" : "hidden"; } },
              s.h("p", { style: { margin: 0, font: "800 24px/1.1 var(--f-display)", color: P.red } }, b), back));
            el.back = back; return el;
          });
          const grid = s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" } }, ...flips);
          const head = s.h("p", { style: { margin: 0, font: "700 22px/1.2 var(--f-display)", color: P.red } }, "Berlinisch – tipp drauf!");
          const lf14 = later(life(s, { style: { padding: "8px 14px" } }, small(s, "Beim Bäcker in Berlin: „Zwee Schrippen, bitte!“")));
          const pic = later(s.photo("broetchen-korb", { w: "100%", h: 130, pos: "50% 50%", caption: "Schrippen und andere Brötchen" }));
          const m = later(merk(s, { style: { fontSize: "20px", padding: "8px 14px 10px" } }, B(s, "Standardsprache"), " (Hochdeutsch) verstehen alle. ", B(s, "Dialekte"), " gehören zu einer Gegend. Fachleute nennen Berlinisch eine ", B(s, "Stadtsprache"), "."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "1fr 400px", gap: "18px", alignItems: "start" }, s.h("div", { class: "stack", style: { gap: "10px" } }, ...lv, m, lf14), s.h("div", { class: "stack", style: { gap: "8px" } }, head, grid, pic)));
          s.sfx.pop();
          s.step(async () => { s.sfx.note(0, .3); await s.show(lv[0], "left"); s.say(LV[0][1]); });
          s.step(async () => { s.sfx.note(4, .3); await s.show(lv[1], "left"); s.sfx.note(7, .3); await s.show(lv[2], "left"); s.say("Det hab ick nich jewusst. Det is jut!"); });
          s.step(async () => { for (let i = 0; i < 5; i++) { s.sfx.pop(); await s.show(flips[i], "pop"); flips[i].back.style.visibility = "visible"; } s.say("ick, wat, det, jut, janz."); });
          s.step(async () => { for (let i = 5; i < 8; i++) { s.sfx.pop(); await s.show(flips[i], "pop"); flips[i].back.style.visibility = "visible"; } s.show(pic, "zoom"); s.say("Schrippe, Stulle, Kiez."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sound("cash-register", { vol: .35 }); await s.show(lf14, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Schrippe, Semmel, Weckle",
        say: "Ein Brötchen hat in Deutschland viele Namen. In Berlin sagt man Schrippe, in München Semmel und in Stuttgart Weckle.",
        build(s) {
          const DE = [[8.7, 55.05], [9.6, 54.85], [10.9, 54.4], [11.1, 54.0], [12.3, 54.25], [13.4, 54.6], [14.2, 53.9], [14.4, 53.3], [14.7, 52.6], [14.6, 51.8], [15.0, 51.1], [14.3, 50.9], [12.9, 50.4], [12.1, 50.3], [12.5, 49.7], [13.8, 48.8], [13.0, 47.6], [12.2, 47.6], [10.5, 47.4], [9.6, 47.5], [8.6, 47.6], [7.6, 47.6], [7.5, 48.5], [8.2, 49.0], [6.4, 49.5], [6.1, 50.2], [6.0, 50.8], [6.1, 51.8], [6.8, 52.2], [7.0, 52.6], [7.2, 53.2], [7.0, 53.6], [8.5, 53.6], [8.9, 54.0], [8.6, 54.5]];
          const W = 420, H = 530, KX = 38, KY = 60, X0 = 5.6, Y0 = 55.4, OX = 26, OY = 14;
          const px = ([lo, la]) => [OX + (lo - X0) * KX, OY + (Y0 - la) * KY];
          const v = s.svg(W, H);
          v.append(s.el("path", { d: "M" + DE.map(p => px(p).map(n => n.toFixed(1)).join(" ")).join(" L") + " Z", fill: "#f4f8ec", stroke: P.unit, "stroke-width": 3, "stroke-linejoin": "round" }));
          const CITY = [
            ["Schrippe", "Berlin", [13.4, 52.52], 12, -18, "middle", P.red],
            ["Rundstück", "Hamburg", [10.0, 53.55], 0, -18, "middle", P.blue],
            ["Semmel", "München", [11.58, 48.14], 0, 34, "middle", P.violet],
            ["Weggla", "Franken", [11.08, 49.45], 0, -18, "middle", P.orange],
            ["Weckle", "Stuttgart", [9.18, 48.78], -4, 34, "middle", P.green],
          ];
          const pins = CITY.map(([w, c, ll, dx, dy, an, col]) => { const [x, y] = px(ll);
            const g = later(s.el("g", { style: { cursor: "pointer" } }, s.el("circle", { cx: x, cy: y, r: 8, fill: col, stroke: "#fff", "stroke-width": 2 }),
              T(s, x + dx, y + dy, w, { "font-size": 24, fill: col, "text-anchor": an }), T(s, x + dx, y + dy + (dy < 0 ? -28 : 24), c, { "font-size": 19, "font-weight": 400, fill: P.pencil, "text-anchor": an })));
            g.addEventListener("click", () => { s.sfx.pop(); read(s, w); }); return g; });
          v.append(...pins);
          const std = later(T(s, 150, 300, "Standard: Brötchen", { "font-size": 22, fill: P.ink }));
          v.append(std);
          const GR = [
            ["Plattdeutsch", "im Norden", "„Moin!“ – sagt man den ganzen Tag, nicht nur morgens. „Ik snack Platt.“ = Ich spreche Plattdeutsch.", P.blue],
            ["Bairisch", "in Bayern", "„Servus!“ und „Grüß Gott!“ – Brötchen heißen hier Semmeln.", P.violet],
            ["Schwäbisch", "in Baden-Württemberg", "Mit „-le“ wird alles klein: Weckle, Häusle, Mädle.", P.green],
          ];
          const gcards = GR.map(([n, wo, t, c]) => later(s.h("div", { class: "card", style: { padding: "8px 14px", borderTop: "6px solid " + c } },
            s.h("p", { style: { margin: 0, font: "700 22px/1.2 var(--f-display)", color: c } }, n, s.h("span", { style: { font: "400 19px var(--f-body)", color: P.pencil } }, "  " + wo)), small(s, t))));
          const tip = s.h("p", { class: "small", style: { color: P.pencil } }, "Tipp auf einen Ort auf der Karte!");
          const lf15 = later(life(s, { style: { padding: "8px 14px" } }, small(s, "Im Urlaub in München bestellst du beim Bäcker einfach „zwei Semmeln“. Aber auch „Brötchen“ versteht dort jeder.")));
          const m = later(merk(s, { style: { fontSize: "20px", padding: "8px 14px 10px" } }, "Dialekte sind keine Fehler – sie sind ", B(s, "Sprachschätze"), " einer Gegend. In der Schule schreibst du ", B(s, "Standardsprache"), "."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "420px 1fr", gap: "18px", alignItems: "start" }, s.h("div", { class: "stack", style: { gap: "4px" } }, v, tip), s.h("div", { class: "stack", style: { gap: "10px" } }, ...gcards, m, lf15)));
          s.sfx.pop();
          s.step(async () => { s.sound("tram-bell", { vol: .35, dur: 1 }); await s.show(pins[0], "pop"); await s.show(std, "fade"); s.say("Berlin: Schrippe. Überall verstanden: Brötchen."); });
          s.step(async () => { s.sound("ship-horn", { vol: .35, dur: 1.5 }); await s.show(pins[1], "pop"); await s.show(gcards[0], "left"); s.say("Hamburg: Rundstück. Moin!"); });
          s.step(async () => { s.sfx.pop(); await s.show(pins[2], "pop"); s.sfx.pop(); await s.show(pins[3], "pop"); await s.show(gcards[1], "left"); s.say("München: Semmel. Franken: Weggla. Servus!"); });
          s.step(async () => { s.sfx.pop(); await s.show(pins[4], "pop"); await s.show(gcards[2], "left"); s.say("Stuttgart: Weckle."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sfx.pop(); await s.show(lf15, "up"); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Viele Sprachen in Berlin",
        say: "In Berlin sprechen viele Kinder zu Hause noch eine andere Sprache als Deutsch. Das ist ein echter Schatz.",
        build(s) {
          const N = 42;
          const grid = s.svg(400, 400); grid.style.width = "330px"; grid.style.height = "330px";
          const cells = Array.from({ length: 100 }, (_, i) => { const r = s.el("rect", { x: (i % 10) * 40 + 4, y: Math.floor(i / 10) * 40 + 4, width: 32, height: 32, rx: 8, fill: "#e9edf2" }); grid.append(r); return r; });
          const big = s.h("p", { class: "huge", style: { color: P.unit, fontSize: "64px" } }, "0 %");
          const cap = s.h("p", { class: "small" }, "der Berliner Schulkinder haben eine andere Herkunftssprache als Deutsch (Schuljahr 2024/25). Viele sprechen zu Hause zwei Sprachen.");
          const left = s.h("div", { class: "card", style: { padding: "12px 16px", display: "grid", gridTemplateColumns: "330px 1fr", gap: "14px", alignItems: "center" } }, grid, s.h("div", { class: "stack", style: { gap: "6px" } }, big, cap));
          const HI = [["Merhaba", "Türkisch", "tr-TR"], ["Marhaban", "Arabisch", "ar-SA"], ["Cześć", "Polnisch", "pl-PL"], ["Privet", "Russisch", "ru-RU"], ["Xin chào", "Vietnamesisch", "vi-VN"], ["Hello", "Englisch", "en-GB"], ["Ciao", "Italienisch", "it-IT"], ["Bonjour", "Französisch", "fr-FR"]];
          const hi = HI.map(([w, l, lang]) => later(s.h("button", { class: "card", style: { padding: "6px 10px", textAlign: "center", cursor: "pointer", font: "inherit", color: "inherit" }, onclick: () => { s.sfx.click(); if (!s.fast) s.speak(w, { lang }); } },
            s.h("p", { style: { margin: 0, font: "800 23px/1.15 var(--f-display)", color: P.unit } }, w), s.h("p", { class: "small", style: { color: P.pencil } }, l))));
          const hiGrid = s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" } }, ...hi);
          const hiHead = s.h("p", { style: { margin: 0, font: "700 22px/1.2 var(--f-display)", color: P.unit } }, "„Hallo“ in Sprachen, die man in Berlin oft hört – tipp drauf:");
          const PL = [["Wörter vergleichen", "Wie heißt „Brot“ in deiner Sprache?"], ["Helfen", "Wer zwei Sprachen spricht, kann übersetzen."], ["Neugierig sein", "Frag nach – jede Sprache klingt anders."]];
          const pl = PL.map(([a, b]) => later(s.h("div", { class: "card soft", style: { padding: "8px 14px" } }, s.h("p", { style: { margin: 0, font: "700 21px/1.2 var(--f-display)", color: P.unit } }, a), small(s, b))));
          const m16 = later(merk(s, { style: { fontSize: "20px", padding: "8px 14px 10px" } }, "Mehrere Sprachen sprechen ist ein ", B(s, "Schatz"), ". Deutsch ist die Sprache, die alle in der Klasse verbindet."));
          const lf = later(life(s, { style: { padding: "8px 14px" } }, small(s, "Speisekarten, Beipackzettel, Schilder am Flughafen: Oft steht alles in mehreren Sprachen da.")));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "640px 1fr", gap: "16px", alignItems: "start" }, s.h("div", { class: "stack", style: { gap: "10px" } }, left, hiHead, hiGrid), s.h("div", { class: "stack", style: { gap: "10px" } }, ...pl, lf, m16)));
          s.sfx.pop();
          s.step(async () => { await s.tween({ from: 0, to: N, dur: s.fast ? 1 : 1800, ease: "out", update: x => { const n = Math.round(x); big.textContent = n + " %"; cells.forEach((c, i) => c.setAttribute("fill", i < n ? P.unit : "#e9edf2")); } }); big.textContent = N + " %"; cells.forEach((c, i) => c.setAttribute("fill", i < N ? P.unit : "#e9edf2")); s.sfx.ding(); s.say("42 Prozent. Das sind mehr als vier von zehn Kindern."); });
          s.step(async () => { for (let i = 0; i < 4; i++) { s.sfx.note(i * 2, .2); await s.show(hi[i], "pop"); } });
          s.step(async () => { for (let i = 4; i < 8; i++) { s.sfx.note(i * 2, .2); await s.show(hi[i], "pop"); } s.sound("kids-cheer", { vol: .3, dur: 1.5 }); });
          s.step(async () => { for (const p of pl) { s.sfx.pop(); await s.show(p, "left"); } });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); s.sfx.success(); await s.show(m16, "up"); });
        },
      },
      /* 17 --------------------------------------------------------------- */
      {
        title: "Wörter auf Reisen",
        say: "Viele deutsche Wörter kommen aus anderen Sprachen. Man nennt sie Lehnwörter. Manche sind weit gereist!",
        build(s) {
          const R = [
            ["Kiosk", ["Persisch", "Türkisch", "Italienisch", "Französisch"], "Ecke → Gartenhäuschen → Verkaufsbude"],
            ["Joghurt", ["Türkisch"], "„yoğurt“ – im 20. Jahrhundert übernommen"],
            ["Sofa", ["Arabisch", "Französisch"], "„suffa“ = steinerne Bank, Ende des 17. Jahrhunderts"],
            ["Tomate", ["Nahuatl (Azteken)", "Französisch"], "„tomatl“ – aus Mexiko"],
            ["Schokolade", ["Nahuatl (Azteken)", "Spanisch"], "ein Getränk aus Kakao"],
          ];
          const rows = R.map(([w, path, note]) => {
            const chips = path.map(l => later(s.h("span", { class: "u10chip", style: { background: "#fff", border: "2px solid " + P.line } }, l)));
            const arrows = path.map(() => later(s.h("b", { style: { color: P.unit, fontSize: "24px" } }, "→")));
            const kids = []; chips.forEach((c, i) => { kids.push(c, arrows[i]); });
            const word = later(s.h("span", { class: "u10chip", style: { background: P.unit, color: "#fff", fontSize: "22px" } }, w));
            const n = later(small(s, note, { color: P.pencil, fontSize: "19px" }));
            const el = s.h("div", { class: "card", style: { padding: "6px 14px", display: "flex", flexDirection: "column", gap: "2px" } }, s.h("div", { class: "row", style: { gap: "6px" } }, ...kids, word), n);
            return { el, chips, arrows, word, n };
          });
          const handy = later(s.h("div", { class: "card soft", style: { padding: "8px 14px" } }, s.h("p", { style: { margin: 0, font: "700 22px/1.2 var(--f-display)", color: P.violet } }, "Handy – klingt englisch, ist es aber nicht!"),
            small(s, "In England sagt man „mobile phone“. Solche Wörter heißen Schein-Anglizismen.")));
          const kg = later(s.h("div", { class: "card soft", style: { padding: "8px 14px" } }, s.h("p", { style: { margin: 0, font: "700 22px/1.2 var(--f-display)", color: P.blue } }, "Andersherum: Kindergarten"),
            small(s, "Das deutsche Wort benutzt man auch im Englischen – seit über 170 Jahren.")));
          const lf17 = later(life(s, { style: { padding: "8px 14px" } }, small(s, "Auf jeder Speisekarte reisen Wörter mit: Pizza aus dem Italienischen, Döner aus dem Türkischen, Sushi aus dem Japanischen.")));
          const m = later(merk(s, { style: { fontSize: "20px", padding: "8px 14px 10px" } }, B(s, "Lehnwörter"), " kommen aus anderen Sprachen. Oft passen sie sich an: Aus spanisch „chocolate“ wird ", B(s, "Schokolade"), "."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "1fr 380px", gap: "16px", alignItems: "start" }, s.h("div", { class: "stack", style: { gap: "8px" } }, ...rows.map(r => r.el), lf17), s.h("div", { class: "stack", style: { gap: "10px" } }, handy, kg, m)));
          s.sfx.pop();
          const travel = async r => { for (let i = 0; i < r.chips.length; i++) { s.sfx.note(i * 2, .18); await s.show(r.chips[i], "pop"); await s.show(r.arrows[i], "left"); } s.sfx.ding(); await s.show(r.word, "zoom"); s.show(r.n, "fade"); };
          s.step(async () => { s.sfx.whoosh(); await travel(rows[0]); s.say("Kiosk: von Persisch über Türkisch, Italienisch und Französisch ins Deutsche."); });
          s.step(async () => { await travel(rows[1]); await travel(rows[2]); s.say("Joghurt aus dem Türkischen, Sofa aus dem Arabischen."); });
          s.step(async () => { await travel(rows[3]); await travel(rows[4]); s.say("Tomate und Schokolade: aus der Sprache der Azteken."); });
          s.step(async () => { s.sfx.boing(); await s.show(handy, "left"); s.sfx.pop(); await s.show(kg, "left"); });
          s.step(async () => { s.sfx.success(); await s.show(m, "up"); s.sound("sizzle", { vol: .3, dur: 1.5 }); await s.show(lf17, "up"); });
        },
      },
      /* 18 --------------------------------------------------------------- */
      {
        title: "Wann spreche ich wie?",
        say: "Im Chat mit Freunden schreibst du locker. In einer Nachricht an die Schule schreibst du höflich und in Standardsprache.",
        build(s) {
          const bub = (t, me) => later(s.h("div", { style: { alignSelf: me ? "flex-end" : "flex-start", maxWidth: "85%", background: me ? "#dcf8c6" : "#fff", borderRadius: "14px", padding: "6px 12px", fontSize: "20px", lineHeight: 1.3, boxShadow: "0 1px 0 rgba(0,0,0,.15)" } }, t));
          const chatB = [bub("Kommst du morgen mit auf den Spielplatz im Kiez?", false), bub("Das crazy, klar bin ich dabei! 😄", true), bub("Cool, bis morgen!", false)];
          const phone = s.h("div", { style: { background: "#1b2740", borderRadius: "26px", padding: "12px" } },
            s.h("div", { style: { background: "#ece5dd", borderRadius: "16px", padding: "10px 12px", display: "flex", flexDirection: "column", gap: "8px", minHeight: "250px" } },
              s.h("p", { style: { margin: 0, font: "700 19px/1.2 var(--f-display)", color: P.pencil, textAlign: "center" } }, "Chat mit Ole"), ...chatB));
          const MAIL = [["An:", "Frau Berger (Klassenlehrerin)"], ["Betreff:", "Hausaufgabe Deutsch"]];
          const mailBody = ["Liebe Frau Berger,", "ich war gestern krank und habe die Hausaufgabe nicht. Darf ich sie am Freitag nachreichen?", "Viele Grüße", "Tim aus der 5b"];
          const mb = mailBody.map(t => later(s.h("p", { style: { margin: 0, fontSize: "20px", lineHeight: 1.35 } }, t)));
          const mail = s.h("div", { class: "card", style: { padding: "10px 16px", display: "flex", flexDirection: "column", gap: "6px" } },
            ...MAIL.map(([a, b]) => s.h("p", { class: "small", style: { borderBottom: "2px solid " + P.line, paddingBottom: "4px" } }, B(s, a + " ", P.pencil), b)), ...mb);
          const tagL = s.h("span", { class: "u10chip", style: { background: "#fde9d6", color: P.orange } }, "locker: Umgangs- und Jugendsprache");
          const tagR = s.h("span", { class: "u10chip", style: { background: "#dde8fb", color: P.blue } }, "höflich: Standardsprache");
          const JW = later(s.h("div", { class: "card soft", style: { padding: "8px 14px" } }, small(s, [B(s, "Jugendwörter des Jahres: "), "cringe (2021), goofy (2023), Aura (2024), das crazy (2025). Sie kommen und gehen – oft schon nach einem Jahr."])));
          const Q = later(merk(s, { style: { fontSize: "20px", padding: "8px 14px 10px" } }, "Frag dich: ", B(s, "Wem"), " schreibe ich? ", B(s, "Wo"), " bin ich? ", B(s, "Wozu"), "? Dann passt deine Sprache."));
          const L = s.h("div", { class: "stack", style: { gap: "8px" } }, tagL, phone, JW);
          const Rr = s.h("div", { class: "stack", style: { gap: "8px" } }, tagR, mail, Q);
          const SIT = [["Freunde, Chat, Pause", "locker, kurz, Emojis okay", P.orange], ["Oma am Telefon", "freundlich und deutlich", P.green], ["Referat, Brief, E-Mail an die Schule", "Standardsprache, höflich, vollständige Sätze", P.blue]];
          const sit = SIT.map(([a, b, c]) => later(s.h("div", { class: "card", style: { padding: "8px 14px", borderTop: "6px solid " + c } }, s.h("p", { style: { margin: 0, font: "700 20px/1.2 var(--f-display)", color: c } }, a), small(s, b))));
          s.add(root(s, "stack", { gap: "12px" }, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "start" } }, L, Rr), s.h("div", { class: "cols3", style: { gap: "12px" } }, ...sit)));
          s.sfx.pop();
          s.step(async () => { for (const b of chatB) { s.sound("mouse-click", { vol: .5 }); await s.show(b, b === chatB[1] ? "right" : "left"); await s.wait(200); } s.say("Locker, kurz, mit Emoji."); });
          s.step(async () => { s.sfx.pop(); await s.show(JW, "up"); });
          s.step(async () => { s.sound("keyboard", { vol: .4, dur: 1.5 }); for (const p of mb.slice(0, 2)) await s.show(p, "fade"); s.say("Liebe Frau Berger, ich war gestern krank."); });
          s.step(async () => { for (const p of mb.slice(2)) { s.sfx.pop(); await s.show(p, "fade"); } s.sfx.ding(); await s.show(Q, "up"); });
          s.step(async () => { for (const [i, c] of sit.entries()) { s.sfx.note(i * 4, .25); await s.show(c, "up"); } s.say("Locker mit Freunden, freundlich mit Oma, höflich mit der Schule."); });
        },
      },
    ],
  });
})();
