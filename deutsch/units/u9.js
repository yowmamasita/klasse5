/* Kapitel 9 – Sachtexte, Sprechen und Zuhören (Sachtext/Geschichte, 5-Schritt-Lesemethode am Fernsehturm-Text,
   Diagramme und Tabellen, Medien (Kindernachrichten, Werbung erkennen), Gesprächsregeln, Meinung begründen, fair diskutieren, Kurzvortrag, Feedback) */
(() => {
  const P = { blue: "#1d5bd0", red: "#dc3b2a", green: "#138a5a", violet: "#7b4fd6", orange: "#ee7a1a", ink: "#1b2740", pencil: "#5d6678", yellow: "#ffd94a", line: "#c8d3de", unit: "#a16207", soft: "#fdf3d7", teal: "#0e7490" };
  const CSS = `
.u9kw{background:linear-gradient(#ffe066,#ffe066) no-repeat 0 70%/0% 75%;transition:background-size .45s ease;border-radius:3px}
.u9kw.on{background-size:100% 75%}
.u9all .u9p{background:#ffe066}
.u9p{transition:opacity .4s, filter .4s}
.u9skim .u9p{opacity:.22;filter:blur(1.2px)}
.u9h{font:700 22px/1.2 var(--f-display);color:${"#a16207"};margin:0}
.u9num{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;font:700 24px/1 var(--f-display);color:#fff;background:${"#a16207"};flex:none}
.u9chip{display:inline-flex;align-items:center;padding:5px 12px;border-radius:999px;font:700 19px/1.2 var(--f-display);background:#fdf3d7;color:var(--ink);white-space:nowrap}
`;
  if (!document.getElementById("u9css")) { const st = document.createElement("style"); st.id = "u9css"; st.textContent = CSS; document.head.appendChild(st); }
  const later = el => { el.classList.add("later"); return el; };
  const ex = (s, label, attrs, ...kids) => s.h("div", Object.assign({ class: "ex" }, attrs || {}), s.h("span", { class: "exlabel" }, label), ...kids);
  const life = (s, attrs, ...kids) => s.h("div", Object.assign({ class: "life" }, attrs || {}), s.h("span", { class: "exlabel" }, "Im Alltag"), ...kids);
  const merk = (s, attrs, ...kids) => s.h("div", Object.assign({ class: "merk" }, attrs || {}), ...kids);
  const B = (s, text, color) => s.h("b", { style: { color: color || "inherit" } }, text);
  const T = (s, x, y, text, a) => s.el("text", Object.assign({ x, y, "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: P.ink, text }, a || {}));
  const root = (s, cls, style, ...kids) => s.h("div", { class: cls, style: Object.assign({ height: "100%" }, style || {}) }, ...kids);
  const speaker = s => { const v = s.svg(24, 24); v.innerHTML = '<path d="M3 9h4l5-4v14l-5-4H3z" fill="currentColor"/><path d="M15 9a4 4 0 010 6M17.5 6.5a8 8 0 010 11" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/>'; return v; };
  const read = (s, text) => { if (s.fast) return; s.speak(text.replace(/[„“]/g, ""), { lang: "de-DE" }); };
  const readBtn = (s, label, text, solid) => s.h("button", { class: "btn" + (solid ? " solid" : ""), onclick: () => { s.sfx.click(); read(s, typeof text === "function" ? text() : text); } }, speaker(s), label);
  const fb = el => { el.style.transformBox = "fill-box"; el.style.transformOrigin = "center"; return el; };

  /* ---------- der Sachtext über den Fernsehturm (selbst geschrieben, Fakten geprüft) ---------- */
  const TEXT = {
    title: "Der Berliner Fernsehturm",
    parts: [
      ["Ein Turm für Fernsehen und Radio", "Der Berliner Fernsehturm steht am [[Alexanderplatz]]. Er ist [[368 Meter]] hoch und damit das [[höchste Bauwerk Deutschlands]]. Von seiner Spitze aus werden [[Fernseh- und Radioprogramme]] gesendet."],
      ["Gebaut in vier Jahren", "Der Turm wurde von [[1965 bis 1969]] gebaut. Im Oktober [[1969]] wurde er [[eröffnet]]. Damals gehörte Ost-Berlin zur [[DDR]]."],
      ["Oben in der Kugel", "Die silberne [[Kugel]] ist [[32 Meter]] breit. Ein [[Aufzug]] fährt in nur [[40 Sekunden]] zur Aussichtsetage in etwa [[203 Metern]] Höhe. Darüber [[dreht sich]] ein Restaurant. Jedes Jahr kommen über [[eine Million Besucher]]."],
    ],
  };
  function sachtext(s, { width = "100%", size = 20 } = {}) {
    const kws = [[], [], []], ps = [];
    const secs = TEXT.parts.map(([hd, txt], i) => {
      const p = s.h("p", { class: "u9p", style: { margin: 0, fontSize: size + "px", lineHeight: 1.4 } });
      txt.split(/(\[\[[^\]]+\]\])/).forEach(part => {
        if (!part) return;
        const m = part.match(/^\[\[(.+)\]\]$/);
        if (m) { const k = s.h("span", { class: "u9kw" }, m[1]); kws[i].push(k); p.append(k); } else p.append(part);
      });
      ps.push(p);
      return s.h("div", { class: "stack", style: { gap: "2px" } }, s.h("p", { class: "u9h" }, hd), p);
    });
    const el = s.h("div", { class: "card", style: { width, padding: "14px 20px", display: "flex", flexDirection: "column", gap: "10px", position: "relative", overflow: "hidden" } },
      s.h("p", { class: "h2", style: { fontSize: "28px" } }, TEXT.title), ...secs);
    return { el, kws, ps, secs };
  }

  Deck.unit({
    id: "u9", num: 9, title: "Sachtexte, Sprechen und Zuhören", color: P.unit, soft: P.soft,
    subtitle: "Lesen wie ein Profi, reden wie ein Profi",
    blurb: "Lesemethode, Diagramme, Gespräche, Referat.",
    goals: ["Sachtexte von Geschichten unterscheiden", "Mit der 5-Schritt-Lesemethode einen Sachtext verstehen", "Diagramme, Tabellen und Medien verstehen", "Fair diskutieren und die eigene Meinung begründen", "Einen Kurzvortrag halten und Feedback geben"],
    icon(svg, el) {
      svg.append(el("rect", { x: 6, y: 10, width: 34, height: 46, rx: 4, fill: "#fff", stroke: P.unit, "stroke-width": 3 }),
        el("path", { d: "M12 22 h22 M12 30 h22 M12 38 h14", stroke: P.unit, "stroke-width": 3 }),
        el("path", { d: "M36 30 h28 a4 4 0 0 1 4 4 v16 a4 4 0 0 1 -4 4 h-16 l-8 8 v-8 h-4 a4 4 0 0 1 -4 -4 v-16 a4 4 0 0 1 4 -4 z", fill: P.unit, opacity: .85 }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Sachtext oder Geschichte?",
        say: "Ein Sachtext will dich informieren. Eine Geschichte will dich unterhalten. Hier geht es beide Male um den Fernsehturm.",
        build(s) {
          const pic = s.photo("fernsehturm-rathaus", { w: 250, h: 250, pos: "50% 30%", caption: "Fernsehturm, Berlin" });
          const sach = s.h("div", { class: "card", style: { padding: "12px 16px", borderTop: "6px solid " + P.blue } }, s.h("p", { class: "small", style: { fontWeight: 700, color: P.blue } }, "Sachtext"),
            s.h("p", { class: "t", style: { fontSize: "21px" } }, "Der Berliner Fernsehturm ist 368 Meter hoch. Er wurde 1969 eröffnet."));
          const lit = later(s.h("div", { class: "card", style: { padding: "12px 16px", borderTop: "6px solid " + P.violet } }, s.h("p", { class: "small", style: { fontWeight: 700, color: P.violet } }, "Geschichte"),
            s.h("p", { class: "t", style: { fontSize: "21px" } }, "Mia drückte die Nase an die Scheibe. Tief unten krabbelten die Autos wie Ameisen. „Ich sehe unser Haus!“, rief sie.")));
          const rows = [
            ["Ziel", "informieren", "unterhalten"],
            ["Inhalt", "Fakten, Zahlen, Daten", "Figuren, Gefühle, Spannung"],
            ["Wahr?", "ja, man kann es prüfen", "oft ausgedacht"],
            ["Aussehen", "Überschriften, Bilder, Tabellen", "wörtliche Rede, Spannungsbogen"],
          ];
          const trs = rows.map(([a, b, c]) => later(s.h("div", { style: { display: "grid", gridTemplateColumns: "150px 1fr 1fr", gap: "12px", alignItems: "center", padding: "6px 0", borderBottom: "2px solid " + P.line } },
            s.h("b", { style: { color: P.unit, fontSize: "20px" } }, a), s.h("span", { style: { fontSize: "21px", color: P.blue } }, b), s.h("span", { style: { fontSize: "21px", color: P.violet } }, c))));
          const tab = s.h("div", { class: "card", style: { padding: "8px 18px" } }, ...trs);
          const lf = later(life(s, { style: { padding: "10px 16px" } }, s.h("p", { class: "small" }, B(s, "Sachtexte: "), "Lexikon, Zeitung, Schulbuch, Anleitung, Fahrplan.  ", B(s, "Literarische Texte: "), "Märchen, Fabel, Gedicht, Roman.")));
          const m1 = later(merk(s, { style: { fontSize: "21px", padding: "10px 16px 12px" } }, "Ein ", B(s, "Sachtext", P.blue), " informiert über die Wirklichkeit. Ein ", B(s, "literarischer Text", P.violet), " erzählt, dichtet und unterhält."));
          s.add(root(s, "stack", { gap: "12px" }, s.h("div", { style: { display: "grid", gridTemplateColumns: "250px 1fr 1fr", gap: "16px", alignItems: "start" } }, pic, sach, lit), tab, lf, m1));
          s.show(pic, "zoom"); s.sfx.pop();
          s.step(async () => { s.sound("page-turn-2"); await s.show(lit, "left"); s.say("Ich sehe unser Haus, rief sie."); });
          s.step(async () => { for (const i of [0, 1]) { s.sfx.count(i); await s.show(trs[i], "up"); } });
          s.step(async () => { for (const i of [2, 3]) { s.sfx.count(i + 2); await s.show(trs[i], "up"); } });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); s.sfx.ding(); await s.show(m1, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Sachtexte im Alltag",
        say: "Sachtexte begegnen dir jeden Tag. Sie beantworten eine Frage, die du gerade hast.",
        build(s) {
          const T6 = [
            ["ubahn-schild", "U-Bahn-Schild", "Wo ist der Eingang zur U-Bahn?", () => s.sound("ubahn-announce", { vol: .4, dur: 3 })],
            ["apfelkuchen", "Rezept", "Wie backe ich einen Apfelkuchen?", () => s.sound("ofen-ping", { vol: .5 })],
            ["notausgang", "Hinweisschild", "Wo geht es im Notfall raus?", () => s.sfx.zap()],
            ["duden-1880-seite", "Wörterbuch", "Wie schreibt man das Wort?", () => s.sound("page-turn-1")],
            ["fernsehturm-bau", "Sachbuch", "Wie wurde der Fernsehturm gebaut?", () => s.sfx.whoosh()],
            ["fahrkartenautomat", "Automat", "Welche Fahrkarte brauche ich?", () => s.sound("coins", { vol: .5, dur: 1.5 })],
          ];
          const tiles = T6.map(([id, t, q]) => later(s.h("div", { class: "card", style: { padding: "0", overflow: "hidden", display: "flex", flexDirection: "column" } },
            s.photo(id, { w: "100%", h: 150, style: { borderRadius: "0" } }),
            s.h("div", { style: { padding: "8px 14px 10px" } }, s.h("p", { style: { margin: 0, font: "700 22px/1.2 var(--f-display)", color: P.unit } }, t), s.h("p", { class: "small", style: { fontSize: "20px" } }, q)))));
          const m = later(merk(s, { style: { fontSize: "21px", padding: "10px 16px 12px" } }, "Sachtexte geben ", B(s, "Antworten"), ". Wer gut liest, findet sie schneller."));
          s.add(root(s, "stack", { gap: "12px" }, s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" } }, ...tiles), m));
          s.sfx.pop();
          [[0, 1, 2], [3, 4, 5]].forEach(g => s.step(async () => { for (const i of g) { T6[i][3](); await s.show(tiles[i], "zoom"); await s.wait(250); } }));
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Die 5-Schritt-Lesemethode",
        say: "Mit fünf Schritten verstehst du jeden Sachtext. Wie auf einer Treppe geht es Stufe für Stufe nach oben.",
        build(s) {
          const ST = [
            ["Überfliegen", "Überschriften, Bilder, fett Gedrucktes ansehen", "eye"],
            ["Fragen stellen", "Was will ich wissen?", "q"],
            ["Gründlich lesen", "Abschnitt für Abschnitt, Schlüsselwörter markieren", "pen"],
            ["Zusammenfassen", "Jeden Abschnitt in einem Satz", "list"],
            ["Wiedergeben", "Mit eigenen Worten erzählen, Fragen beantworten", "talk"],
          ];
          const icon = k => { const v = s.svg(56, 56); v.style.width = "56px"; v.style.height = "56px";
            if (k === "eye") v.append(s.el("path", { d: "M4 28 Q28 4 52 28 Q28 52 4 28 Z", fill: "#fff", stroke: P.unit, "stroke-width": 3 }), s.el("circle", { cx: 28, cy: 28, r: 9, fill: P.unit }));
            if (k === "q") v.append(s.el("circle", { cx: 28, cy: 28, r: 24, fill: "#fff", stroke: P.unit, "stroke-width": 3 }), T(s, 28, 38, "?", { "font-size": 30, fill: P.unit }));
            if (k === "pen") v.append(s.el("rect", { x: 6, y: 34, width: 44, height: 12, rx: 3, fill: P.yellow }), s.el("path", { d: "M14 30 L38 6 L48 16 L24 40 L12 42 Z", fill: "#fff", stroke: P.unit, "stroke-width": 3 }));
            if (k === "list") v.append(...[12, 26, 40].map(y => s.el("rect", { x: 6, y, width: y === 40 ? 30 : 44, height: 7, rx: 3, fill: P.unit })));
            if (k === "talk") v.append(s.el("path", { d: "M6 10 h44 a4 4 0 0 1 4 4 v22 a4 4 0 0 1 -4 4 h-26 l-10 10 v-10 h-8 a4 4 0 0 1 -4 -4 v-22 a4 4 0 0 1 4 -4 z", fill: P.unit }));
            return v; };
          const steps = ST.map(([t, d, k], i) => later(s.h("div", { class: "card", style: { marginTop: (4 - i) * 34 + "px", padding: "12px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", textAlign: "center", borderColor: P.unit, borderWidth: "3px" } },
            s.h("div", { class: "row", style: { gap: "8px", justifyContent: "center" } }, s.h("span", { class: "u9num" }, String(i + 1)), icon(k)),
            s.h("p", { style: { margin: 0, font: "700 22px/1.15 var(--f-display)", color: P.unit } }, t), s.h("p", { class: "small" }, d))));
          const stairs = s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px", alignItems: "start" } }, ...steps);
          const lf = later(life(s, { style: { padding: "10px 16px" } }, s.h("p", { class: "small", style: { fontSize: "21px" } }, "Klappt in jedem Fach: im Schulbuch in GeWi und NaWi, beim Lexikonartikel für ein Referat, sogar bei einer Spielanleitung.")));
          const m = later(merk(s, { style: { fontSize: "21px", padding: "10px 16px 12px" } }, B(s, "Vor"), " dem Lesen: Überblick und Fragen. ", B(s, "Beim"), " Lesen: markieren. ", B(s, "Nach"), " dem Lesen: zusammenfassen und wiedergeben."));
          s.add(root(s, "stack", { gap: "14px" }, stairs, lf, m));
          s.sfx.pop();
          s.step(async () => { for (const i of [0, 1]) { s.sfx.note(i * 2, .25); await s.show(steps[i], "up"); } s.say("Überfliegen und Fragen stellen."); });
          s.step(async () => { s.sound("pencil-write", { vol: .5, dur: 1.5 }); await s.show(steps[2], "up"); s.say("Gründlich lesen und markieren."); });
          s.step(async () => { for (const i of [3, 4]) { s.sfx.note(i * 2 + 1, .25); await s.show(steps[i], "up"); } s.sfx.chord([0, 4, 7, 12]); s.say("Zusammenfassen und wiedergeben."); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Schritt 1 und 2: Überblick",
        say: "Zuerst überfliegst du den Text: Überschrift, Zwischenüberschriften, Bilder. Dann stellst du Fragen an den Text.",
        build(s) {
          const st = sachtext(s, { size: 22 });
          st.el.classList.add("u9skim");
          const scan = s.h("div", { style: { position: "absolute", left: 0, right: 0, top: "0", height: "34px", background: "linear-gradient(transparent, rgba(161,98,7,.25), transparent)", pointerEvents: "none", opacity: 0 } });
          st.el.append(scan);
          const pic = s.photo("fernsehturm-kugel", { w: "100%", h: 200, pos: "50% 40%", caption: "Bild zum Text" });
          const qs = ["Wie hoch ist der Turm?", "Wann wurde er gebaut?", "Was kann man oben machen?"].map(q => later(s.h("div", { class: "card", style: { padding: "8px 14px", display: "flex", gap: "10px", alignItems: "center", borderColor: P.unit } },
            s.h("span", { class: "u9num", style: { width: "36px", height: "36px", fontSize: "22px" } }, "?"), s.h("p", { class: "t", style: { fontSize: "21px" } }, q))));
          const s1 = s.h("p", { class: "small", style: { fontWeight: 700, color: P.unit } }, "1 · Überfliegen: Worum geht es?");
          const s2 = later(s.h("p", { class: "small", style: { fontWeight: 700, color: P.unit } }, "2 · Fragen stellen: Was will ich wissen?"));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "620px 1fr", gap: "20px", alignItems: "start" }, st.el,
            s.h("div", { class: "stack", style: { gap: "10px" } }, s1, pic, s2, ...qs)));
          s.sfx.pop();
          const sweep = async () => { if (s.fast) return; scan.style.opacity = 1; s.sfx.whoosh(); const H = st.el.offsetHeight; await s.tween({ from: 0, to: H - 34, dur: 1600, ease: "inOut", update: v => { scan.style.top = v + "px"; } }); scan.style.opacity = 0; };
          s.step(async () => { await sweep(); s.say("Der Berliner Fernsehturm. Ein Turm für Fernsehen und Radio. Gebaut in vier Jahren. Oben in der Kugel."); });
          s.step(async () => { s.sfx.pop(); await s.show(s2, "fade"); for (const q of qs) { s.sfx.boing(); await s.show(q, "left"); } });
          s.step(async () => { st.el.classList.remove("u9skim"); s.sound("page-turn-3"); s.say("Jetzt bist du neugierig und liest mit Fragen im Kopf."); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Schritt 3: Lesen und markieren",
        say: "Jetzt liest du gründlich, Abschnitt für Abschnitt. Markiere nur die Schlüsselwörter, also die wichtigsten Wörter.",
        build(s) {
          const st = sachtext(s, { size: 22 });
          const allBtn = later(s.h("button", { class: "btn", onclick: () => { s.sfx.click(); st.el.classList.toggle("u9all"); s.sfx[st.el.classList.contains("u9all") ? "error" : "pop"](); } }, "Alles markiert?"));
          const tips = [["Schlüsselwörter", "Namen, Zahlen, Fachwörter – was du später noch brauchst."], ["Sparsam sein", "Wer alles gelb macht, findet nichts wieder."], ["Unbekannte Wörter", "nachschlagen oder aus dem Satz erschließen."]];
          const tipEls = tips.map(([a, b]) => later(s.h("div", { class: "card soft", style: { padding: "10px 14px" } }, s.h("p", { class: "small", style: { fontSize: "20px" } }, B(s, a + ": ", P.unit), b))));
          const note = later(s.h("p", { class: "small pencil" }, "Im Heft oder auf einer Kopie – nie im Schulbuch!"));
          const kpic = s.photo("fernsehturm-kugel", { w: "100%", h: 150, pos: "50% 45%", caption: "Die Kugel: 32 m breit" });
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "620px 1fr", gap: "20px", alignItems: "start" }, st.el,
            s.h("div", { class: "stack", style: { gap: "10px" } }, ...tipEls, allBtn, note, kpic)));
          s.sfx.pop();
          const mark = async i => { s.sound("pencil-write", { vol: .45, dur: 1.4 }); for (const k of st.kws[i]) { k.classList.add("on"); if (!s.fast) await s.wait(260); } };
          s.step(async () => { await mark(0); s.show(tipEls[0], "left"); s.say("Alexanderplatz, 368 Meter, höchstes Bauwerk Deutschlands."); });
          s.step(async () => { await mark(1); s.say("1965 bis 1969, eröffnet, DDR."); });
          s.step(async () => { await mark(2); s.show(tipEls[1], "left"); s.say("Kugel, 32 Meter, Aufzug, 40 Sekunden."); });
          s.step(async () => { s.sfx.pop(); s.show(tipEls[2], "left"); await s.show(allBtn, "pop"); s.show(note, "fade"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Schritt 4 und 5: Zusammenfassen",
        say: "Aus den Schlüsselwörtern machst du für jeden Abschnitt einen Satz. Am Ende beantwortest du deine Fragen.",
        build(s) {
          const R = [
            ["Fernsehen und Radio", ["Alexanderplatz", "368 Meter", "Sender"], "Der Fernsehturm am Alexanderplatz ist 368 m hoch und sendet Fernsehen und Radio."],
            ["Gebaut in vier Jahren", ["1965–1969", "DDR"], "Die DDR hat ihn von 1965 bis 1969 gebaut."],
            ["Oben in der Kugel", ["Aufzug 40 s", "203 m", "Restaurant"], "In 40 Sekunden fährt man hoch zur Aussicht; ein Restaurant dreht sich."],
          ];
          const rows = R.map(([h, kw, sum]) => {
            const chips = kw.map(k => s.h("span", { class: "u9kw on", style: { fontSize: "20px", fontWeight: 700, padding: "0 4px" } }, k));
            const arrow = later(s.h("b", { style: { fontSize: "28px", color: P.unit } }, "→"));
            const sent = later(s.h("p", { class: "t", style: { fontSize: "20px" } }, sum));
            const el = later(s.h("div", { class: "card", style: { padding: "8px 14px", display: "grid", gridTemplateColumns: "200px 30px 1fr", gap: "10px", alignItems: "center" } },
              s.h("div", { class: "stack", style: { gap: "4px" } }, s.h("p", { class: "u9h", style: { fontSize: "19px" } }, h), s.h("div", { class: "row", style: { gap: "6px" } }, chips)), arrow, sent));
            return { el, arrow, sent };
          });
          const ans = [["Wie hoch?", "368 Meter"], ["Wann gebaut?", "1965 bis 1969"], ["Was gibt es oben?", "Aussicht und Restaurant"]];
          const ansEls = ans.map(([q, a]) => later(s.h("p", { class: "small", style: { fontSize: "21px" } }, s.h("b", { style: { color: P.green } }, "✓ "), B(s, q + " "), a)));
          const card5 = s.h("div", { class: "card", style: { padding: "10px 16px", display: "flex", flexDirection: "column", gap: "4px" } }, s.h("p", { class: "small", style: { fontWeight: 700, color: P.unit } }, "5 · Wiedergeben: Meine Fragen – beantwortet!"), ...ansEls);
          const pic = s.photo("fernsehturm-blick", { w: "100%", h: 210, pos: "50% 60%", caption: "Blick aus der Aussichtsetage" });
          const lf6 = later(life(s, { style: { padding: "10px 16px" } }, s.h("p", { class: "small", style: { fontSize: "21px" } }, "Erzähl es beim Abendessen: Wer etwas mit eigenen Worten erklären kann, hat es wirklich verstanden.")));
          const m = later(merk(s, { style: { fontSize: "21px", padding: "10px 16px 12px" } }, B(s, "Zusammenfassen"), " heißt: kurz, mit ", B(s, "eigenen Worten"), ", nur das Wichtigste."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "1fr 330px", gap: "18px", alignItems: "start" },
            s.h("div", { class: "stack", style: { gap: "10px" } }, s.h("p", { class: "small", style: { fontWeight: 700, color: P.unit } }, "4 · Zusammenfassen: ein Satz pro Abschnitt"), ...rows.map(r => r.el), m, lf6),
            s.h("div", { class: "stack", style: { gap: "12px" } }, pic, card5)));
          s.sfx.pop();
          rows.forEach((r, i) => s.step(async () => { s.sfx.pop(); await s.show(r.el, "left"); s.sound("pencil-write", { vol: .4, dur: 1.2 }); await s.show(r.arrow, "left"); await s.show(r.sent, "fade"); s.say(R[i][2]); }));
          s.step(async () => { s.sound("kids-wow", { vol: .4, dur: 1.5 }); for (const a of ansEls) { s.sfx.ding(); await s.show(a, "left"); } });
          s.step(async () => { s.sfx.success(); await s.show(m, "up"); s.show(lf6, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Diagramme lesen",
        say: "Ein Säulendiagramm zeigt Zahlen als Säulen. So siehst du auf einen Blick, was am größten ist.",
        build(s) {
          const D = [["Fernsehturm", 368, P.unit, "Fernseh-|turm"], ["Berliner Dom", 98, P.blue, "Berliner|Dom"], ["Rotes Rathaus", 94, P.red, "Rotes|Rathaus"], ["Siegessäule", 67, P.green, "Sieges-|säule"], ["Brandenburger Tor", 26, P.violet, "Branden-|burger Tor"]];
          const W = 660, H = 530, x0 = 70, y0 = 450, top = 50, k = (y0 - top) / 400, bw = 86, gap = (W - x0 - 20 - 5 * bw) / 5;
          const svg = s.svg(W, H);
          const title = later(T(s, W / 2 + 20, 26, "Wie hoch sind Berliner Bauwerke?", { "font-size": 22 }));
          const axes = later(s.el("path", { d: `M${x0} ${top - 10} V${y0} H${W - 10}`, fill: "none", stroke: P.ink, "stroke-width": 3 }));
          const grid = [0, 100, 200, 300, 400].map(v => later(s.el("g", null, s.el("line", { x1: x0, y1: y0 - v * k, x2: W - 10, y2: y0 - v * k, stroke: P.line, "stroke-width": v ? 1.5 : 0 }), T(s, x0 - 10, y0 - v * k + 7, String(v), { "text-anchor": "end", "font-size": 19, fill: P.pencil }))));
          const unit = later(T(s, x0 + 6, top - 18, "Meter", { "text-anchor": "start", "font-size": 19, fill: P.pencil }));
          svg.append(...grid, axes, title, unit);
          const bars = D.map(([n, v, c, l2], i) => {
            const x = x0 + gap / 2 + 10 + i * (bw + gap);
            const r = s.el("rect", { x, y: y0, width: bw, height: 0, rx: 6, fill: c, style: { cursor: "pointer" } });
            const lab = s.el("g", null, ...l2.split("|").map((t, j) => T(s, x + bw / 2, y0 + 26 + j * 23, t, { "font-size": 19 })));
            const val = later(T(s, x + bw / 2, y0 - v * k - 10, v + " m", { "font-size": 21, fill: c }));
            r.addEventListener("click", () => { s.sfx.pop(); s.show(val, "pop"); info.textContent = n + ": " + v + " Meter hoch."; });
            svg.append(r, lab, val); return { r, val, v };
          });
          const info = s.h("p", { class: "t", style: { fontSize: "21px", minHeight: "30px", color: P.unit, fontWeight: 700 } }, "");
          const sPic = later(s.photo("siegessaeule", { w: "100%", h: 190, pos: "50% 30%", caption: "Siegessäule: 67 m" }));
          const tips = [["Überschrift", "Worum geht es?"], ["Achsen", "Was wird gezählt? In welcher Einheit?"], ["Säulen", "Welche ist am höchsten, welche am niedrigsten?"], ["Vergleichen", "Der Fernsehturm ist fast viermal so hoch wie der Dom."]];
          const tipEls = tips.map(([a, b], i) => later(s.h("div", { class: "card soft", style: { padding: "8px 14px", display: "grid", gridTemplateColumns: "40px 1fr", gap: "10px", alignItems: "center" } }, s.h("span", { class: "u9num", style: { width: "36px", height: "36px", fontSize: "20px" } }, String(i + 1)), s.h("p", { class: "small", style: { fontSize: "20px" } }, B(s, a + ": "), b))));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "660px 1fr", gap: "18px", alignItems: "start" }, s.h("div", { class: "stack", style: { gap: "6px" } }, svg, info), s.h("div", { class: "stack", style: { gap: "10px" } }, ...tipEls, sPic)));
          s.sfx.pop();
          const grow = async b => { await s.tween({ from: 0, to: b.v * k, dur: 700, ease: "out", update: v => { b.r.setAttribute("y", y0 - v); b.r.setAttribute("height", v); } }); s.show(b.val, "pop"); };
          s.step(async () => { s.sfx.scribble(); await s.show(title, "fade"); s.show(tipEls[0], "left"); });
          s.step(async () => { await s.show(axes, "draw"); s.show(grid, "fade"); s.show(unit, "fade"); s.show(tipEls[1], "left"); s.sfx.snap(); });
          s.step(async () => { for (let i = 4; i >= 1; i--) { s.sfx.count(4 - i); await grow(bars[i]); } s.show(tipEls[2], "left"); });
          s.step(async () => { s.sfx.drum(); await grow(bars[0]); s.sound("kids-wow", { vol: .5, dur: 1.5 }); info.textContent = "Der Fernsehturm ist das höchste Bauwerk!"; });
          s.step(async () => { s.sfx.ding(); await s.show(tipEls[3], "left"); s.show(sPic, "zoom"); info.textContent = "Tippe auf eine Säule!"; });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Tabellen lesen: der Fahrplan",
        say: "In einer Tabelle findest du etwas, wenn du Zeile und Spalte kreuzt. Probieren wir es mit einem Busfahrplan.",
        build(s) {
          const stops = ["Am Park", "Marktplatz", "Schwimmbad", "Schule"];
          const times = [["7:02", "7:17", "7:32", "7:47"], ["7:06", "7:21", "7:36", "7:51"], ["7:11", "7:26", "7:41", "7:56"], ["7:15", "7:30", "7:45", "8:00"]];
          const cells = [];
          const td = (t, st) => s.h("td", { style: Object.assign({ padding: "10px 16px", fontSize: "24px", textAlign: "center", border: "2px solid " + P.line, fontVariantNumeric: "tabular-nums", transition: "background .3s" }, st || {}) }, t);
          const table = s.h("table", { style: { borderCollapse: "collapse", background: "#fff" } },
            s.h("thead", null, s.h("tr", null, s.h("th", { style: { padding: "10px 14px", fontSize: "20px", textAlign: "left", color: "#fff", background: P.unit } }, "Haltestelle"), ...["1", "2", "3", "4"].map(n => s.h("th", { style: { padding: "10px", fontSize: "20px", color: "#fff", background: P.unit } }, n + ". Bus")))),
            s.h("tbody", null, ...stops.map((st, i) => { cells[i] = []; return s.h("tr", null, td(st, { textAlign: "left", fontWeight: 700, fontSize: "21px" }), ...times[i].map((t, j) => { const c = td(t); cells[i][j] = c; return c; })); })));
          const hd = s.h("p", { class: "small", style: { fontWeight: 700, color: P.unit } }, "Bus 123 · Richtung Schule (Beispiel)");
          const card = s.h("div", { class: "card", style: { padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-start" } }, hd, table);
          const task = s.h("div", { class: "ex", style: { padding: "12px 18px" } }, s.h("span", { class: "exlabel" }, "Aufgabe"), s.h("p", { class: "t", style: { fontSize: "22px" } }, "Du musst um ", B(s, "7:50"), " an der Schule sein. Du steigst am ", B(s, "Marktplatz"), " ein. Welchen Bus nimmst du?"));
          const steps = ["① Zeile „Schule“ suchen", "② Spalte finden: 7:45 Uhr passt, 8:00 Uhr ist zu spät.", "③ In dieser Spalte nach oben zum „Marktplatz“: 7:36 Uhr!"].map(t => later(s.h("div", { class: "card soft", style: { padding: "8px 14px" } }, s.h("p", { class: "t", style: { fontSize: "22px" } }, t))));
          const bus = s.photo("bushaltestelle", { w: "100%", h: 190, caption: "An jeder Haltestelle hängt ein Fahrplan." });
          const lf = later(life(s, { style: { padding: "10px 16px" } }, s.h("p", { class: "small" }, "Tabellen gibt es überall: Stundenplan, Bundesliga-Tabelle, Nährwerte auf der Müslipackung, Ergebnisse beim Sportfest.")));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "560px 1fr", gap: "20px", alignItems: "start" }, s.h("div", { class: "stack", style: { gap: "12px" } }, card, lf), s.h("div", { class: "stack", style: { gap: "10px" } }, task, ...steps, bus)));
          s.show(card, "up"); s.sfx.pop();
          const hi = (list, col) => list.forEach(c => { c.style.background = col; });
          s.step(async () => { s.sound("tram-bell", { vol: .4 }); hi(cells[3], "#fdf3d7"); await s.show(steps[0], "left"); });
          s.step(async () => { s.sfx.tick(); hi([cells[3][3]], "#fde4e1"); await s.wait(300); s.sfx.ding(); hi(cells.map(r => r[2]), "#fdf3d7"); cells[3][2].style.background = P.yellow; await s.show(steps[1], "left"); });
          s.step(async () => { s.sfx.success(); cells[1][2].style.background = P.yellow; cells[1][2].style.fontWeight = 700; await s.show(steps[2], "left"); s.say("Ich nehme den dritten Bus um 7 Uhr 36."); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 8a – Medien -------------------------------------------------------- */
      {
        title: "Kindernachrichten",
        say: "Nachrichten gibt es auch für Kinder. Sie erklären schwierige Wörter und zeigen, warum etwas wichtig ist.",
        build(s) {
          const ADULT = "Der Bundestag hat den Haushalt für das kommende Jahr verabschiedet.";
          const KID = "Der Bundestag – das ist das Parlament in Berlin – hat beschlossen, wofür Deutschland nächstes Jahr Geld ausgibt: zum Beispiel für Schulen, Straßen und Bahnen.";
          const pic = s.photo("plenarsaal", { w: "100%", h: 180, pos: "50% 60%" });
          const label = s.h("span", { class: "u9chip", style: { background: P.ink, color: "#fff" } }, "Nachrichten für Erwachsene");
          const news = s.h("p", { class: "t", style: { fontSize: "22px", minHeight: "120px", margin: 0 } }, ADULT);
          let kid = false;
          const flip = async () => {
            kid = !kid; s.sfx.whoosh();
            if (!s.fast) await s.tween({ from: 1, to: 0, dur: 180, update: x => (news.style.opacity = x) });
            news.textContent = kid ? KID : ADULT; label.textContent = kid ? "Kindernachrichten" : "Nachrichten für Erwachsene"; label.style.background = kid ? P.unit : P.ink;
            if (!s.fast) await s.tween({ from: 0, to: 1, dur: 260, update: x => (news.style.opacity = x) });
            news.style.opacity = ""; s.sfx.pop();
          };
          const btn = s.h("button", { class: "btn solid", onclick: () => flip() }, "Umschalten");
          const tv = s.h("div", { style: { background: "#1b2740", borderRadius: "22px", padding: "12px", display: "flex", flexDirection: "column", gap: "10px" } }, pic,
            s.h("div", { style: { background: "#fff", borderRadius: "12px", padding: "10px 14px", display: "flex", flexDirection: "column", gap: "6px" } }, s.h("div", { class: "row", style: { justifyContent: "space-between" } }, label, btn), news));
          const TIPS = [["Fachwörter erklärt", "„Bundestag – das ist …“"], ["Kurze Sätze", "eine Info pro Satz"], ["Bedeutung erklärt", "Was hat das mit mir zu tun?"], ["Bilder und Grafiken", "Karten, Erklärfilme"]];
          const tips = TIPS.map(([a, b], i) => later(s.h("div", { class: "card", style: { padding: "8px 14px", display: "grid", gridTemplateColumns: "44px 1fr", gap: "12px", alignItems: "center" } }, s.h("span", { class: "u9num" }, String(i + 1)), s.h("p", { class: "small", style: { fontSize: "20px" } }, B(s, a + ": ", P.unit), b))));
          const W5 = later(s.h("div", { class: "card soft", style: { padding: "10px 14px", display: "flex", flexDirection: "column", gap: "8px" } }, s.h("p", { class: "small", style: { fontSize: "20px" } }, "Eine gute Nachricht beantwortet die ", B(s, "W-Fragen", P.unit), ":"),
            s.h("div", { class: "row", style: { gap: "8px" } }, ...["Wer?", "Was?", "Wann?", "Wo?", "Warum?"].map(w => s.h("span", { class: "u9chip", style: { background: "#fff", border: "2px solid " + P.unit } }, w)))));
          const lf = later(life(s, { style: { padding: "10px 16px" } }, s.h("p", { class: "small", style: { fontSize: "20px" } }, B(s, "„logo!“"), " vom ZDF gibt es seit 1989. Sie läuft montags bis freitags am Abend auf KiKA und erklärt die Nachrichten des Tages für Kinder.")));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "520px 1fr", gap: "18px", alignItems: "start" }, s.h("div", { class: "stack", style: { gap: "12px" } }, tv, lf), s.h("div", { class: "stack", style: { gap: "10px" } }, ...tips, W5)));
          s.show(tv, "zoom"); s.sound("crowd-cheer", { vol: .15, dur: 1.5, fade: .6 });
          s.step(async () => { await flip(); s.say(KID); });
          s.step(async () => { for (const i of [0, 1]) { s.sfx.count(i); await s.show(tips[i], "left"); } });
          s.step(async () => { for (const i of [2, 3]) { s.sfx.count(i + 2); await s.show(tips[i], "left"); } });
          s.step(async () => { s.sfx.pop(); await s.show(W5, "up"); s.say("Wer, was, wann, wo, warum?"); });
          s.step(async () => { s.sound("ubahn-announce", { vol: .3, dur: 2, fade: .5 }); await s.show(lf, "up"); });
        },
      },
      /* 8b ---------------------------------------------------------------- */
      {
        title: "Information, Meinung, Werbung",
        say: "Nicht jeder Text will dich nur informieren. Manche Texte sagen eine Meinung. Und Werbung will, dass du etwas kaufst.",
        build(s) {
          const BINS = [
            ["Information", P.blue, "will dich informieren", [["Der Fernsehturm ist ", "368 Meter", " hoch."], ["Am Samstag regnet es in Berlin, ", "sagt der Wetterdienst", "."]]],
            ["Meinung", P.violet, "sagt, was jemand denkt", [["", "Ich finde", ", der Fernsehturm ist das ", "schönste", " Gebäude Berlins."], ["Hausaufgaben am Wochenende sind ", "unfair", "!"]]],
            ["Werbung", P.red, "will, dass du kaufst", [["", "NEU!", " Knusper-Müsli macht dich ", "stark wie ein Löwe", "!"], ["", "Nur heute:", " Turnschuhe ", "50 % billiger", "!"]]],
          ];
          const marks = [];
          const bins = BINS.map(([n, c, sub, items]) => {
            const snips = items.map(parts => later(s.h("div", { style: { background: "#fff", border: "2px solid " + P.line, borderRadius: "10px", padding: "8px 12px", fontSize: "20px", lineHeight: 1.35 } },
              ...parts.map((p, i) => { if (i % 2 === 0) return p; const m = s.h("span", { style: { borderRadius: "4px", padding: "0 2px", transition: "background .4s" } }, p); m.c = c; marks.push(m); return m; }))));
            const el = s.h("div", { class: "card", style: { borderTop: "8px solid " + c, padding: "10px 14px", display: "flex", flexDirection: "column", gap: "8px" } },
              s.h("p", { style: { margin: 0, font: "800 25px/1.1 var(--f-display)", color: c } }, n), s.h("p", { class: "small pencil" }, sub), ...snips);
            el.snips = snips; return el;
          });
          let lit = false;
          const light = () => { lit = !lit; s.sfx.click(); marks.forEach(m => { m.style.background = lit ? (m.c === P.blue ? "#dde8fb" : m.c === P.violet ? "#ece5fb" : "#fde4e1") : ""; m.style.fontWeight = lit ? 700 : ""; }); if (lit) s.sfx.ding(); };
          const sig = s.h("button", { class: "btn", onclick: () => light() }, "Signalwörter zeigen");
          const SIGNS = ["will, dass du etwas kaufst", "übertreibt: „der beste“, „stark wie ein Löwe“", "macht Druck: „Nur heute!“", "muss gekennzeichnet sein: „Anzeige“ oder „Werbung“ – auch bei Influencern"];
          const signEls = SIGNS.map(t => later(s.h("p", { class: "small", style: { fontSize: "20px" } }, s.h("b", { style: { color: P.red } }, "• "), t)));
          const wcard = s.h("div", { class: "card", style: { padding: "10px 16px", display: "flex", flexDirection: "column", gap: "4px" } }, s.h("p", { style: { margin: 0, font: "700 23px/1.2 var(--f-display)", color: P.red } }, "Werbung erkennen: Sie …"), ...signEls);
          const pic = later(s.photo("litfasssaeule", { w: 230, h: 250, pos: "50% 40%", caption: "Litfaßsäule" }));
          const fact = later(s.h("p", { class: "small", style: { fontSize: "19px" } }, "Erfunden in Berlin: Die erste Litfaßsäule stellte Ernst Litfaß 1855 auf."));
          s.add(root(s, "stack", { gap: "12px" }, s.h("div", { class: "cols3", style: { gap: "12px", alignItems: "start" } }, ...bins),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 230px 200px", gap: "14px", alignItems: "start" } }, s.h("div", { class: "stack", style: { gap: "10px" } }, wcard, sig), pic, fact)));
          s.sfx.pop();
          bins.forEach((b, i) => s.step(async () => { [() => s.sfx.coin(), () => s.sfx.boing(), () => s.sound("cash-register", { vol: .45 })][i](); for (const sn of b.snips) { await s.show(sn, "left"); await s.wait(150); } s.say(BINS[i][0] + ": " + BINS[i][2] + "."); }));
          s.step(async () => { light(); s.say("Signalwörter verraten die Textsorte: ich finde, nur heute, neu."); });
          s.step(async () => { for (const e of signEls) { s.sfx.pop(); await s.show(e, "left"); } });
          s.step(async () => { s.sound("paper-crumple", { vol: .4, dur: 1 }); await s.show(pic, "zoom"); await s.show(fact, "fade"); s.say("Schon vor über 170 Jahren hingen in Berlin Plakate an Litfaßsäulen."); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Gesprächsregeln",
        say: "Damit ein Gespräch in der Klasse klappt, gibt es Regeln. Sie sorgen dafür, dass jeder zu Wort kommt.",
        build(s) {
          const ic = draw => { const v = s.svg(56, 56); v.style.width = "56px"; v.style.height = "56px"; draw(v); return v; };
          const R = [
            ["Melden", "Wer reden will, zeigt auf und wartet, bis er drankommt.", v => v.append(s.el("path", { d: "M22 52 V18 a4 4 0 0 1 8 0 V30 M30 22 a4 4 0 0 1 8 0 V32 M38 26 a4 4 0 0 1 8 0 V40 Q46 52 34 52 Z M22 30 a4 4 0 0 0 -8 0 V40", fill: "#fff", stroke: P.unit, "stroke-width": 3, "stroke-linejoin": "round" }))],
            ["Ausreden lassen", "Niemand fällt dem anderen ins Wort.", v => v.append(s.el("path", { d: "M6 8 h34 a4 4 0 0 1 4 4 v16 a4 4 0 0 1 -4 4 h-20 l-8 8 v-8 h-6 a4 4 0 0 1 -4 -4 v-16 a4 4 0 0 1 4 -4 z", fill: P.unit }), s.el("circle", { cx: 46, cy: 44, r: 8, fill: "#fff", stroke: P.pencil, "stroke-width": 3 }))],
            ["Zuhören", "Schau die Person an, die gerade spricht.", v => v.append(s.el("path", { d: "M18 46 Q8 40 10 24 Q12 8 28 8 Q44 8 44 24 Q44 34 34 38 Q30 52 18 46 Z", fill: "#fff", stroke: P.unit, "stroke-width": 3 }), s.el("path", { d: "M20 24 Q22 16 30 18 Q34 22 30 28", fill: "none", stroke: P.unit, "stroke-width": 3 }))],
            ["Beim Thema bleiben", "Sag etwas zu dem, worüber gerade gesprochen wird.", v => v.append(s.el("circle", { cx: 28, cy: 28, r: 22, fill: "#fff", stroke: P.unit, "stroke-width": 3 }), s.el("circle", { cx: 28, cy: 28, r: 12, fill: "#fff", stroke: P.unit, "stroke-width": 3 }), s.el("circle", { cx: 28, cy: 28, r: 4, fill: P.red }))],
            ["Freundlich bleiben", "Kein Auslachen, keine Beleidigungen.", v => v.append(s.el("circle", { cx: 28, cy: 28, r: 22, fill: P.yellow, stroke: P.unit, "stroke-width": 3 }), s.el("circle", { cx: 20, cy: 24, r: 3, fill: P.ink }), s.el("circle", { cx: 36, cy: 24, r: 3, fill: P.ink }), s.el("path", { d: "M18 34 Q28 42 38 34", fill: "none", stroke: P.ink, "stroke-width": 3, "stroke-linecap": "round" }))],
            ["Auf andere eingehen", "„Ich möchte an Lea anknüpfen …“", v => v.append(s.el("path", { d: "M8 20 h26 l-8 -8 M48 36 h-26 l8 8", fill: "none", stroke: P.unit, "stroke-width": 4, "stroke-linecap": "round", "stroke-linejoin": "round" }))],
          ];
          const cards = R.map(([t, d, draw]) => later(s.h("div", { class: "card", style: { display: "grid", gridTemplateColumns: "56px 1fr", gap: "14px", alignItems: "center", padding: "12px 16px", minHeight: "118px" } }, ic(draw),
            s.h("div", null, s.h("p", { style: { margin: 0, font: "700 23px/1.2 var(--f-display)", color: P.unit } }, t), s.h("p", { class: "small", style: { fontSize: "20px" } }, d)))));
          const lf = later(life(s, { style: { padding: "10px 16px" } }, s.h("p", { class: "small", style: { fontSize: "21px" } }, B(s, "Klassenrat: "), "Eine Gesprächsleitung ruft auf, jemand schreibt eine Redeliste, jemand achtet auf die Zeit. So kommen alle dran.")));
          s.add(root(s, "stack", { gap: "12px" }, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px" } }, ...cards), lf));
          s.sound("classroom", { vol: .35, dur: 3, fade: 1 });
          [[0, 1], [2, 3], [4, 5]].forEach((g, k) => s.step(async () => { if (k === 0) s.sound("knock", { vol: .5, dur: 1 }); else s.sfx.pop(); for (const i of g) { await s.show(cards[i], "up"); await s.wait(200); } s.say(g.map(i => R[i][0]).join(". ")); }));
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Meinung begründen",
        say: "Eine Meinung allein wackelt. Mit einer Begründung und einem Beispiel steht sie fest wie ein Turm.",
        build(s) {
          const TOP = {
            pause: ["Fußball in der Pause", "Wir sollten in der Pause Fußball spielen dürfen,", "weil Bewegung den Kopf frei macht.", "Zum Beispiel kann ich mich nach dem Toben besser konzentrieren."],
            fahrt: ["Klassenfahrt", "Ich finde, wir sollten an die Ostsee fahren,", "denn dort kann man baden und am Strand spielen.", "Zum Beispiel könnten wir Beachvolleyball spielen."],
            lesen: ["Vorlesen", "Ich finde, wir sollten öfter vorlesen,", "weil man dabei neue Wörter lernt.", "Zum Beispiel kannte ich „Gischt“ erst aus „John Maynard“."],
          };
          const C3 = [["Behauptung", P.blue], ["Begründung", P.orange], ["Beispiel", P.green]];
          const blocks = C3.map(([n, c]) => {
            const txt = s.h("p", { class: "t", style: { fontSize: "25px" } }, "");
            const el = s.h("div", { style: { border: "3px solid " + c, background: "#fff", borderRadius: "14px", padding: "12px 18px", display: "flex", flexDirection: "column", gap: "4px" } },
              s.h("p", { style: { margin: 0, font: "700 20px/1.1 var(--f-display)", color: c } }, n), txt);
            el.txt = txt; return el;
          });
          blocks[1].classList.add("later"); blocks[2].classList.add("later");
          const tower = s.h("div", { class: "stack", style: { gap: "8px" } }, ...blocks);
          let cur = "pause";
          const setT = k => { cur = k; const t = TOP[k]; blocks.forEach((b, i) => { b.txt.textContent = t[i + 1]; }); btns.forEach(b => b.classList.toggle("solid", b.dataset.k === k)); };
          const btns = Object.entries(TOP).map(([k, t]) => { const b = s.h("button", { class: "btn", onclick: () => { s.sfx.whoosh(); setT(k); read(s, TOP[k].slice(1).join(" ")); } }, t[0]); b.dataset.k = k; return b; });
          const wobble = async () => { if (s.fast) return; const b = blocks[0]; await s.tween({ dur: 1100, update: (v, t) => { b.style.transform = `rotate(${Math.sin(t * Math.PI * 6) * 3 * (1 - t)}deg)`; } }); b.style.transform = ""; };
          const conn = later(s.h("div", { class: "card soft", style: { padding: "10px 16px" } }, s.h("p", { class: "small", style: { fontSize: "21px" } }, B(s, "weil", P.orange), " → Verb ans Ende: „…, weil Bewegung den Kopf frei ", B(s, "macht"), ".“"), s.h("p", { class: "small", style: { fontSize: "21px" } }, B(s, "denn", P.orange), " → Verb an Platz 2: „…, denn dort ", B(s, "kann"), " man baden.“")));
          const m = later(merk(s, { style: { fontSize: "21px", padding: "10px 16px 12px" } }, "Ein gutes Argument: ", B(s, "Behauptung", P.blue), " + ", B(s, "Begründung", P.orange), " + ", B(s, "Beispiel", P.green), "."));
          s.add(root(s, "stack", { gap: "12px" }, s.h("div", { class: "row", style: { gap: "10px" } }, ...btns), tower, conn, m));
          setT("pause"); s.sfx.pop();
          s.step(async () => { s.sfx.boing(); await wobble(); s.say("Nur eine Behauptung? Das wackelt. Warum denn?"); });
          s.step(async () => { s.sfx.snap(); await s.show(blocks[1], "up"); s.say(TOP[cur][2]); });
          s.step(async () => { s.sfx.snap(); await s.show(blocks[2], "up"); s.sfx.ding(); s.say(TOP[cur][3]); });
          s.step(async () => { s.sfx.pop(); await s.show(conn, "up"); });
          s.step(async () => { setT("fahrt"); s.sound("waves", { vol: .4, dur: 2.5, fade: .6 }); await s.show(m, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Fair diskutieren",
        say: "Bei einer Diskussion sammelt man Argumente dafür und dagegen. Wichtig ist: fair bleiben, auch wenn man anderer Meinung ist.",
        build(s) {
          const W = 520, H = 250;
          const v = s.svg(W, H);
          v.append(s.el("path", { d: `M${W / 2 - 40} ${H - 6} L${W / 2} 70 L${W / 2 + 40} ${H - 6} Z`, fill: "#e9edf2", stroke: P.pencil, "stroke-width": 3 }));
          const beam = s.el("g", null, s.el("rect", { x: 40, y: 64, width: W - 80, height: 12, rx: 6, fill: P.unit }),
            s.el("line", { x1: 70, y1: 70, x2: 70, y2: 130, stroke: P.pencil, "stroke-width": 2 }), s.el("line", { x1: W - 70, y1: 70, x2: W - 70, y2: 130, stroke: P.pencil, "stroke-width": 2 }),
            s.el("path", { d: "M20 130 h100 q-50 40 -100 0", fill: "#e3f2e4", stroke: P.green, "stroke-width": 3 }), s.el("path", { d: `M${W - 120} 130 h100 q-50 40 -100 0`, fill: "#fde4e1", stroke: P.red, "stroke-width": 3 }),
            T(s, 70, 122, "dafür", { fill: P.green }), T(s, W - 70, 122, "dagegen", { fill: P.red }));
          v.append(beam);
          const tilt = async to => { const from = beam._a || 0; beam._a = to; await s.tween({ from, to, dur: 600, ease: "back", update: a => beam.setAttribute("transform", `rotate(${a} ${W / 2} 70)`) }); };
          const q = s.h("p", { style: { margin: 0, font: "700 24px/1.2 var(--f-display)", color: P.unit, textAlign: "center" } }, "Sollen Handys in der Pause erlaubt sein?");
          const arg = (t, c) => later(s.h("p", { class: "small", style: { fontSize: "20px", borderLeft: "5px solid " + c, paddingLeft: "10px" } }, t));
          const pro = [arg("Man kann die Eltern erreichen.", P.green), arg("Man kann Musik hören und abschalten.", P.green)];
          const con = [arg("Dann spielt niemand mehr zusammen.", P.red), arg("Man könnte heimlich fotografiert werden.", P.red)];
          const args = s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" } }, pro[0], con[0], pro[1], con[1]);
          const left = s.h("div", { class: "card", style: { padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" } }, q, v, args);
          const good = ["Ich sehe das anders, weil …", "Da hast du recht, aber …", "Ich stimme Lea zu, denn …", "Kannst du das genauer erklären?"];
          const goodEls = good.map(t => later(s.h("p", { class: "small", style: { fontSize: "21px" } }, s.h("b", { style: { color: P.green } }, "✓ "), t)));
          const bad = later(s.h("p", { class: "small", style: { fontSize: "21px", color: P.red } }, s.h("b", null, "✗ "), s.h("s", null, "„So ein Quatsch!“")));
          const phr = s.h("div", { class: "card soft", style: { padding: "10px 16px", display: "flex", flexDirection: "column", gap: "4px" } }, s.h("p", { class: "small", style: { fontWeight: 700, color: P.unit } }, "So klingt es fair:"), ...goodEls, bad);
          const pic = later(s.photo("plenarsaal", { w: "100%", h: 190, pos: "50% 60%", caption: "Im Bundestag wird auch diskutiert." }));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "560px 1fr", gap: "18px", alignItems: "start" }, left, s.h("div", { class: "stack", style: { gap: "12px" } }, phr, pic)));
          s.sfx.pop();
          s.step(async () => { for (const a of pro) { s.sfx.coin(); await s.show(a, "left"); } await tilt(-8); });
          s.step(async () => { for (const a of con) { s.sfx.coin(); await s.show(a, "right"); } await tilt(0); s.say("Gleich viele Argumente auf beiden Seiten. Jetzt wird diskutiert."); });
          s.step(async () => { for (const g of goodEls) { s.sfx.pop(); await s.show(g, "left"); } });
          s.step(async () => { s.sfx.error(); await s.show(bad, "bounce"); s.say("Beleidigen ist kein Argument."); });
          s.step(async () => { s.sound("crowd-cheer", { vol: .3, dur: 2, fade: .6 }); await s.show(pic, "zoom"); s.say("Auch im Bundestag wird diskutiert, nach festen Regeln."); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Kurzvortrag: der Aufbau",
        say: "Ein Kurzvortrag hat drei Teile: Einleitung, Hauptteil und Schluss. Der Hauptteil ist der längste.",
        build(s) {
          const PARTS = [
            ["Einleitung", 1, P.blue, ["Begrüßen", "Thema nennen", "Neugierig machen: „Wisst ihr, wie schnell der Aufzug ist?“", "Gliederung zeigen"]],
            ["Hauptteil", 3, P.unit, ["1. Bau: 1965 bis 1969", "2. Zahlen: 368 m hoch, Kugel 32 m breit", "3. Besuch: Aufzug 40 s, Aussicht in 203 m", "Bilder zeigen, Fachwörter erklären"]],
            ["Schluss", 1, P.green, ["Das Wichtigste zusammenfassen", "Deine Meinung: „Mir gefällt …“", "„Habt ihr Fragen?“ – Danke fürs Zuhören!"]],
          ];
          const bar = s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 3fr 1fr", gap: "6px" } }, ...PARTS.map(([n, mn, c]) => later(s.h("div", { style: { background: c, color: "#fff", borderRadius: "12px", padding: "8px 12px", textAlign: "center" } }, s.h("p", { style: { margin: 0, font: "700 22px/1.1 var(--f-display)" } }, n), s.h("p", { style: { margin: 0, font: "400 19px/1.2 var(--f-body)" } }, "ca. " + mn + " Min.")))));
          const cols = PARTS.map(([n, , c, items]) => later(s.h("div", { class: "card", style: { borderTop: "6px solid " + c, padding: "10px 14px", display: "flex", flexDirection: "column", gap: "6px" } },
            s.h("p", { style: { margin: 0, font: "700 23px/1.2 var(--f-display)", color: c } }, n), ...items.map(t => s.h("p", { class: "small", style: { fontSize: "20px" } }, "• " + t)))));
          const grid = s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1.25fr 1fr", gap: "12px", alignItems: "start" } }, ...cols);
          const pic = later(s.photo("fernsehturm-bau", { w: 400, h: 230, pos: "50% 40%", caption: "Bild für den Hauptteil" }));
          const lf = later(life(s, { style: { padding: "10px 16px", flex: "1" } }, s.h("p", { class: "small", style: { fontSize: "21px" } }, "Thema: der Fernsehturm. Erst sammeln (Bücher, Lexikon, Kinder-Suchmaschine), dann ordnen, dann üben – laut und mit Stoppuhr. Passt alles in die Zeit?"), s.h("p", { class: "small", style: { fontSize: "21px", marginTop: "8px" } }, B(s, "Quellen nennen: "), "Sag am Ende, woher deine Infos und Bilder stammen.")));
          s.add(root(s, "stack", { gap: "12px" }, bar, grid, s.h("div", { style: { display: "flex", gap: "16px", alignItems: "stretch" } }, pic, lf)));
          s.sfx.pop();
          const bars = [...bar.children];
          [0, 1, 2].forEach(i => s.step(async () => { s.sfx.note([0, 4, 7][i], .3); await s.show(bars[i], "left"); await s.show(cols[i], "up"); if (i === 1) s.show(pic, "zoom"); s.say(PARTS[i][0]); }));
          s.step(async () => { s.sound("stopwatch", { vol: .5, dur: 1.5 }); await s.show(lf, "up"); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Stichwortkarten und Plakat",
        say: "Auf Stichwortkarten stehen nur Stichwörter, keine ganzen Sätze. Ein Plakat zeigt große Bilder und wenig Text.",
        build(s) {
          const kcard = (n, lines, good) => later(s.h("div", { style: { background: good ? "#fffdf2" : "#fff", border: "2px solid " + (good ? P.unit : P.red), borderRadius: "8px", padding: "12px 14px", boxShadow: "0 3px 0 rgba(0,0,0,.08)", display: "flex", flexDirection: "column", gap: "2px", position: "relative" } },
            s.h("p", { style: { margin: 0, font: "700 19px/1 var(--f-display)", color: good ? P.unit : P.red } }, n), ...lines.map(t => s.h("p", { style: { margin: 0, fontSize: good ? "25px" : "20px", fontWeight: good ? 700 : 400, lineHeight: 1.35 } }, t))));
          const goodCards = [kcard("1 · Einleitung", ["Hallo!", "Thema: Fernsehturm", "Frage: Aufzug?"], true), kcard("2 · Bau", ["1965–1969", "DDR", "Bild zeigen!"], true), kcard("3 · Zahlen", ["368 m", "Kugel 32 m", "40 s Aufzug"], true)];
          const badCard = kcard("So nicht:", ["Der Berliner Fernsehturm wurde von 1965 bis 1969 gebaut, und er ist …"], false);
          const tipsL = later(s.h("p", { class: "small", style: { fontSize: "20px" } }, "Groß schreiben · nummerieren · nur eine Seite beschreiben"));
          const lf13 = later(life(s, { style: { padding: "10px 16px" } }, s.h("p", { class: "small", style: { fontSize: "21px" } }, "Ein Einkaufszettel ist auch eine Stichwortliste: „Eis, Käse, Toast“ – und du weißt sofort Bescheid.")));
          const left = s.h("div", { class: "stack", style: { gap: "10px" } }, s.h("p", { class: "h2", style: { fontSize: "25px", color: P.unit } }, "Stichwortkarten"), s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" } }, ...goodCards, badCard), tipsL, lf13);
          const big = (t, c) => s.h("div", { style: { textAlign: "center" } }, s.h("p", { style: { margin: 0, font: "800 34px/1 var(--f-display)", color: c } }, t));
          const poster = later(s.h("div", { style: { background: "#fff", border: "3px solid " + P.ink, borderRadius: "6px", padding: "12px", display: "flex", flexDirection: "column", gap: "10px" } },
            s.h("p", { style: { margin: 0, font: "800 30px/1.1 var(--f-display)", color: P.unit, textAlign: "center" } }, "Der Berliner Fernsehturm"),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" } }, s.photo("fernsehturm-kugel", { w: "100%", h: 230, pos: "50% 35%" }), s.photo("fernsehturm-blick", { w: "100%", h: 230, pos: "40% 60%" })),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" } }, big("368 m", P.red), big("1969", P.blue), big("40 s", P.green))));
          const tipsR = later(s.h("div", { class: "card soft", style: { padding: "10px 14px" } }, s.h("p", { class: "small", style: { fontSize: "20px" } }, B(s, "Plakat: "), "Überschrift oben, große Bilder, wenig Text – von der letzten Reihe aus lesbar!")));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "1fr 470px", gap: "20px", alignItems: "start" }, left, s.h("div", { class: "stack", style: { gap: "10px" } }, poster, tipsR)));
          s.sfx.pop();
          s.step(async () => { for (const c of goodCards) { s.sound("pencil-write", { vol: .35, dur: .8 }); await s.show(c, "pop"); } s.say("Nur Stichwörter, groß und nummeriert."); });
          s.step(async () => { s.sfx.error(); await s.show(badCard, "bounce"); s.show(tipsL, "fade"); s.say("Ganze Sätze? Dann liest du nur ab."); });
          s.step(async () => { s.sound("scissors", { vol: .45, dur: 1.2 }); await s.show(poster, "zoom"); });
          s.step(async () => { s.sfx.ding(); await s.show(tipsR, "up"); s.show(lf13, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Vortragen und Lampenfieber",
        say: "Schau dein Publikum an, sprich laut und langsam. Und wenn das Herz klopft: tief durchatmen!",
        build(s) {
          const tips = [["Blickkontakt", "Schau in die Klasse, nicht nur auf die Karten."], ["Laut und langsam", "Auch die letzte Reihe soll dich verstehen."], ["Pausen", "Nach einer wichtigen Zahl kurz stoppen."], ["Haltung", "Gerade stehen, beide Füße auf dem Boden, Karten in der Hand."]];
          const tipEls = tips.map(([a, b], i) => later(s.h("div", { class: "card", style: { padding: "10px 14px", display: "grid", gridTemplateColumns: "44px 1fr", gap: "12px", alignItems: "center" } }, s.h("span", { class: "u9num" }, String(i + 1)), s.h("p", { class: "small", style: { fontSize: "20px" } }, B(s, a + ": ", P.unit), b))));
          const cv = s.svg(300, 300); cv.style.width = "300px"; cv.style.height = "300px";
          const ring = fb(s.el("circle", { cx: 150, cy: 150, r: 60, fill: P.soft, stroke: P.unit, "stroke-width": 5 }));
          const lab = T(s, 150, 158, "Bereit?", { "font-size": 26, fill: P.unit });
          cv.append(ring, lab);
          let busy = false;
          const breathe = async () => {
            if (busy) return; busy = true;
            for (let r = 0; r < 2 && s.alive; r++) {
              lab.textContent = "Einatmen …"; s.sfx.swoosh();
              await s.tween({ from: 60, to: 130, dur: s.fast ? 1 : 4000, ease: "inOut", update: v => ring.setAttribute("r", v) });
              lab.textContent = "Ausatmen …"; s.sfx.whoosh();
              await s.tween({ from: 130, to: 60, dur: s.fast ? 1 : 4000, ease: "inOut", update: v => ring.setAttribute("r", v) });
            }
            lab.textContent = "Ruhiger!"; busy = false;
          };
          const bBtn = later(s.h("button", { class: "btn solid", onclick: () => { s.sfx.click(); breathe(); } }, "Atemübung starten"));
          const hb = later(s.soundBtn("heartbeat", "Herzklopfen"));
          const right = s.h("div", { class: "card soft", style: { padding: "12px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" } }, s.h("p", { class: "h2", style: { fontSize: "25px", color: P.unit } }, "Lampenfieber?"), cv, s.h("div", { class: "row", style: { gap: "10px", justifyContent: "center" } }, bBtn, hb));
          const lf = later(life(s, { style: { padding: "10px 16px" } }, s.h("p", { class: "small", style: { fontSize: "20px" } }, "Lampenfieber kennen auch Musiker vor dem Konzert und Sportler vor dem Spiel. Üben hilft: vor dem Spiegel, vor der Familie, mit Stoppuhr.")));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "1fr 420px", gap: "20px", alignItems: "start" }, s.h("div", { class: "stack", style: { gap: "10px" } }, ...tipEls, lf), right));
          s.sfx.pop();
          s.step(async () => { for (const i of [0, 1]) { s.sfx.count(i); await s.show(tipEls[i], "left"); } });
          s.step(async () => { for (const i of [2, 3]) { s.sfx.count(i); await s.show(tipEls[i], "left"); } });
          s.step(async () => { s.sound("heartbeat", { vol: .6, dur: 3 }); s.show(hb, "pop"); await s.show(bBtn, "pop"); s.say("Herzklopfen ist normal. Atme vier Sekunden ein und vier Sekunden aus."); breathe(); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Zuhören und Feedback geben",
        say: "Nach einem Vortrag gibst du Feedback. Sag zuerst, was gut war. Kritik formulierst du als Ich-Botschaft.",
        build(s) {
          const PAIRS = [
            ["Du redest viel zu leise!", "Ich konnte dich hinten schlecht verstehen."],
            ["Dein Plakat ist langweilig.", "Ich hätte mir mehr Bilder gewünscht."],
            ["Du guckst nur auf deine Karten.", "Ich fände es schön, wenn du uns öfter anschaust."],
          ];
          const rows = PAIRS.map(([du, ich]) => {
            const t1 = s.h("p", { class: "t", style: { fontSize: "21px", color: P.red } }, "„" + du + "“");
            const t2 = later(s.h("p", { class: "t", style: { fontSize: "21px", color: P.green, fontWeight: 700 } }, "„" + ich + "“"));
            const tag1 = s.h("span", { class: "u9chip", style: { background: "#fde4e1", color: P.red } }, "Du-Botschaft");
            const tag2 = later(s.h("span", { class: "u9chip", style: { background: "#dcf2e7", color: P.green } }, "Ich-Botschaft"));
            const el = s.h("div", { class: "card", style: { padding: "10px 16px", display: "grid", gridTemplateColumns: "150px 1fr", gap: "6px 12px", alignItems: "center" } }, tag1, t1, tag2, t2);
            const flip = async () => { t1.style.textDecoration = "line-through"; t1.style.opacity = ".7"; await s.show(tag2, "pop"); await s.show(t2, "down"); };
            return { el, flip, ich };
          });
          const fbk = [["Erst loben", "„Mir hat gefallen, dass du ein Bild vom Bau gezeigt hast.“"], ["Dann ein Tipp", "„Ich wünsche mir beim nächsten Mal …“"], ["Konkret sein", "Nicht „war gut“, sondern sagen, was genau."]];
          const fEls = fbk.map(([a, b]) => later(s.h("p", { class: "small", style: { fontSize: "20px" } }, B(s, a + ": ", P.unit), b)));
          const fCard = s.h("div", { class: "card soft", style: { padding: "10px 16px", display: "flex", flexDirection: "column", gap: "6px" } }, s.h("p", { class: "h2", style: { fontSize: "23px", color: P.unit } }, "Feedback-Regeln"), ...fEls);
          const zh = later(s.h("div", { class: "card", style: { padding: "10px 16px" } }, s.h("p", { class: "small", style: { fontSize: "20px" } }, B(s, "Gut zuhören: ", P.unit), "hinschauen, leise sein, Fragen notieren und erst am Ende stellen.")));
          const m = later(merk(s, { style: { fontSize: "21px", padding: "10px 16px 12px" } }, B(s, "Ich-Botschaften"), " sagen, wie etwas bei dir ankommt – sie verletzen nicht und helfen weiter."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "1fr 400px", gap: "18px", alignItems: "start" },
            s.h("div", { class: "stack", style: { gap: "10px" } }, ...rows.map(r => r.el), m), s.h("div", { class: "stack", style: { gap: "12px" } }, fCard, zh)));
          s.sound("applause", { vol: .35, dur: 2.5, fade: .8 });
          rows.forEach((r, i) => s.step(async () => { s.sfx.zap(); await r.flip(); s.sfx.ding(); s.say(r.ich); }));
          s.step(async () => { for (const f of fEls) { s.sfx.pop(); await s.show(f, "left"); } });
          s.step(async () => { s.sfx.pop(); await s.show(zh, "up"); s.sfx.success(); await s.show(m, "up"); });
        },
      },
    ],
  });
})();
