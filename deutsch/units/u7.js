/* Kapitel 7 – Erzählen und Schreiben (Spannungsbogen, Erzählen, Bildergeschichte, Nacherzählen, Bericht, Beschreibung, Brief/E-Mail, Überarbeiten) */
(() => {
  const P = { blue: "#1d5bd0", red: "#dc3b2a", green: "#138a5a", violet: "#7b4fd6", orange: "#ee7a1a", ink: "#1b2740", pencil: "#5d6678", yellow: "#ffd94a", line: "#c8d3de", unit: "#a21caf", soft: "#f7e3f9", paper: "#fbfcf7" };
  const later = el => { el.classList.add("later"); return el; };
  const ex = (s, label, attrs, ...kids) => s.h("div", Object.assign({ class: "ex" }, attrs || {}), s.h("span", { class: "exlabel" }, label), ...kids);
  const life = (s, attrs, ...kids) => s.h("div", Object.assign({ class: "life" }, attrs || {}), s.h("span", { class: "exlabel" }, "Im Alltag"), ...kids);
  const merk = (s, attrs, ...kids) => s.h("div", Object.assign({ class: "merk" }, attrs || {}), ...kids);
  const sp = (s, text, color, extra) => s.h("span", { style: Object.assign({ color }, extra || {}) }, text);
  const B = (s, text, color) => s.h("b", { style: { color: color || "inherit" } }, text);
  const T = (s, x, y, text, a) => s.el("text", Object.assign({ x, y, "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: P.ink, text }, a || {}));
  const root = (s, cls, style, ...kids) => s.h("div", { class: cls, style: Object.assign({ height: "100%" }, style || {}) }, ...kids);
  /* smooth path through points (Catmull-Rom → Bézier) */
  function smooth(pts) {
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p2[0]} ${p2[1]}`;
    }
    return d;
  }
  /* highlight an inline span (marker effect) */
  const mark = (el, color) => { el.style.transition = "background-color .45s, box-shadow .45s"; el.style.backgroundColor = color + "2e"; el.style.boxShadow = `inset 0 -4px 0 ${color}`; el.style.borderRadius = "4px"; };
  /* flip a card: shrink, swap content, grow */
  async function flip(s, el, fill) {
    await s.tween({ from: 1, to: 0, dur: 170, ease: "in", update: v => (el.style.transform = `scaleX(${v})`) });
    fill(); s.sfx.snap();
    await s.tween({ from: 0, to: 1, dur: 200, ease: "out", update: v => (el.style.transform = `scaleX(${v})`) });
  }
  /* a stick figure kid */
  function kid(s, x, y, color, opts = {}) {
    const g = s.el("g", { transform: `translate(${x} ${y})` });
    const arm = opts.armUp ? "M0 -22 L-12 -6 M0 -22 L14 -44" : opts.armsUp ? "M0 -22 L-14 -44 M0 -22 L14 -44" : "M0 -22 L-12 -6 M0 -22 L12 -6";
    g.append(
      s.el("path", { d: "M-6 0 L-9 22 M6 0 L9 22", stroke: P.ink, "stroke-width": 4, "stroke-linecap": "round" }),
      s.el("rect", { x: -11, y: -30, width: 22, height: 32, rx: 8, fill: color }),
      s.el("path", { d: arm, stroke: P.ink, "stroke-width": 4, "stroke-linecap": "round", fill: "none" }),
      s.el("circle", { cx: 0, cy: -42, r: 11, fill: "#f3c9a0", stroke: P.ink, "stroke-width": 2 }));
    if (opts.hair) g.append(s.el("path", { d: "M-11 -45 Q0 -60 11 -45 L13 -36 Q8 -48 0 -50 Q-8 -48 -13 -36 Z", fill: opts.hair }));
    if (opts.smile) g.append(s.el("path", { d: "M-5 -39 Q0 -34 5 -39", stroke: P.ink, "stroke-width": 2, fill: "none", "stroke-linecap": "round" }));
    if (opts.sad) g.append(s.el("path", { d: "M-5 -36 Q0 -40 5 -36", stroke: P.ink, "stroke-width": 2, fill: "none", "stroke-linecap": "round" }));
    return g;
  }
  const kite = (s, x, y, sc = 1, rot = 0) => s.el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${sc})` },
    s.el("path", { d: "M0 -22 L16 0 L0 26 L-16 0 Z", fill: P.red, stroke: "#8f1d12", "stroke-width": 2 }),
    s.el("path", { d: "M0 -22 L0 26 M-16 0 L16 0", stroke: "#8f1d12", "stroke-width": 1.5 }),
    s.el("path", { d: "M0 26 q-8 10 0 18 q8 8 0 18", stroke: P.orange, "stroke-width": 3, fill: "none" }));
  const tree = (s, x, y) => s.el("g", null,
    s.el("rect", { x: x - 9, y: y, width: 18, height: 70, fill: "#8a5a2b", rx: 3 }),
    s.el("circle", { cx: x, cy: y - 10, r: 46, fill: "#4caf6a" }),
    s.el("circle", { cx: x - 30, cy: y + 6, r: 26, fill: "#3f9c5c" }),
    s.el("circle", { cx: x + 30, cy: y + 4, r: 28, fill: "#3f9c5c" }));

  Deck.unit({
    id: "u7", num: 7, title: "Erzählen und Schreiben", color: "#a21caf", soft: "#f7e3f9",
    subtitle: "Spannend erzählen, sachlich berichten",
    blurb: "Spannungsbogen, Bildergeschichte, Bericht, Beschreibung, E-Mail.",
    goals: ["Eine Geschichte mit Spannungsbogen erzählen", "Wörtliche Rede, Gefühle und treffende Wörter nutzen", "Bildergeschichten und Nacherzählungen schreiben", "Sachlich berichten und genau beschreiben", "Briefe und E-Mails richtig aufbauen und überarbeiten"],
    icon(svg, el) {
      svg.append(el("path", { d: "M6 58 C 20 56, 30 20, 44 14 S 60 40, 66 56", fill: "none", stroke: "#a21caf", "stroke-width": 5, "stroke-linecap": "round" }),
        el("circle", { cx: 44, cy: 14, r: 6, fill: "#dc3b2a" }),
        el("path", { d: "M12 46 l14 -14 l5 5 l-14 14 z", fill: "#a21caf", opacity: .35 }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Der Spannungsbogen",
        say: "Jede gute Geschichte hat einen Spannungsbogen. Wir erzählen von einer Nachtwanderung auf der Klassenfahrt.",
        build(s) {
          const W = 1100, H = 440;
          const svg = s.svg(W, H);
          const pts = [[60, 350], [170, 332], [330, 302], [420, 262], [530, 205], [640, 148], [760, 104], [880, 222], [990, 318], [1050, 345]];
          svg.append(s.el("text", { x: 0, y: 34, "text-anchor": "start", class: "hlbl", text: "Geschichte: Die Nachtwanderung" }));
          const bands = [[60, 330, "Einleitung", P.blue], [330, 820, "Hauptteil", P.orange], [820, 1050, "Schluss", P.green]].map(([a, b, t, c]) => {
            const g = later(s.el("g", null, s.el("rect", { x: a + 3, y: 392, width: b - a - 6, height: 44, rx: 10, fill: c, opacity: .14 }),
              s.el("rect", { x: a + 3, y: 392, width: b - a - 6, height: 6, rx: 3, fill: c }),
              T(s, (a + b) / 2, 426, t, { fill: c, "font-size": 22 })));
            svg.append(g); return g;
          });
          const curve = later(s.el("path", { d: smooth(pts), fill: "none", stroke: P.unit, "stroke-width": 7, "stroke-linecap": "round" }));
          svg.append(curve);
          const ev = (i, txt, c, lx, ly, anchor) => {
            const [x, y] = pts[i];
            const g = later(s.el("g", null, s.el("circle", { cx: x, cy: y, r: 10, fill: c, stroke: "#fff", "stroke-width": 3 }),
              s.el("text", { x: lx, y: ly, "text-anchor": anchor, "font-size": 20, "font-weight": 700, fill: c, text: txt })));
            svg.append(g); return g;
          };
          const e1 = ev(1, "Wir kommen an.", P.blue, 170, 302, "middle");
          const e2 = ev(3, "Nachtwanderung im Wald", P.orange, 405, 248, "end");
          const e3 = ev(4, "Die Lampe geht aus!", P.orange, 515, 190, "end");
          const e4 = ev(5, "Es knackt im Gebüsch …", P.orange, 625, 132, "end");
          const peakLbl = later(s.el("g", null,
            s.el("path", { d: "M760 80 l7 15 l16 2 l-12 11 l3 16 l-14 -8 l-14 8 l3 -16 l-12 -11 l16 -2 z", fill: P.red, transform: "translate(0 -2)" }),
            T(s, 760, 64, "Zwei Augen leuchten!", { fill: P.red }),
            T(s, 760, 36, "HÖHEPUNKT", { fill: P.red, "font-size": 22, "letter-spacing": "2" })));
          svg.append(peakLbl);
          const e5 = ev(7, "Nur ein Igel!", P.green, 895, 207, "start");
          const e6 = ev(8, "Alle lachen.", P.green, 990, 372, "middle");
          const igel = s.photo("igel", { w: 250, h: 165, pos: "50% 55%", caption: "Nur ein Igel!", cls: "later", style: { position: "absolute", left: "0", top: "52px" } });
          const m = later(merk(s, null, B(s, "Einleitung", P.blue), " führt hin (Wer? Wo? Wann?). Im ", B(s, "Hauptteil", P.orange), " steigt die Spannung bis zum ", B(s, "Höhepunkt", P.red), ". Der ", B(s, "Schluss", P.green), " löst alles auf."));
          s.add(root(s, "stack", { gap: "14px" }, s.h("div", { style: { position: "relative", width: "1100px", height: "440px" } }, svg, igel), m));
          s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); await s.show(curve, "draw"); s.say("Die Spannung steigt und fällt wie ein Bogen."); });
          s.step(async () => { s.sfx.pop(); s.show(bands[0], "up"); await s.wait(250); s.sfx.count(0); await s.show(e1, "pop"); s.say("Die Einleitung. Wir kommen an der Jugendherberge an."); });
          s.step(async () => {
            s.sfx.pop(); s.show(bands[1], "up"); s.say("Im Hauptteil wird es immer spannender."); s.sound("owl", { vol: .5 });
            for (const [i, e] of [e2, e3, e4].entries()) { await s.wait(300); if (i === 2) s.sound("twig-snap", { vol: .8 }); else s.sfx.count(i + 2); await s.show(e, "pop"); }
          });
          s.step(async () => { s.sfx.drum(); await s.wait(160); s.sfx.drum(); await s.show(peakLbl, "zoom"); s.sfx.zap(); s.say("Der Höhepunkt. Zwei Augen leuchten im Dunkeln!"); });
          s.step(async () => { s.sfx.pop(); s.show(bands[2], "up"); await s.wait(250); s.sfx.boing(); s.show(igel, "zoom"); await s.show(e5, "pop"); s.sound("kids-laugh", { vol: .5 }); await s.show(e6, "pop"); s.say("Der Schluss. Es war nur ein Igel, und alle lachen."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Drei Geschichten, ein Bogen",
        say: "Ob Fußball, Konzert oder Schlüssel vergessen: Jede spannende Geschichte folgt dem gleichen Bogen.",
        build(s) {
          const data = [
            ["Das Elfmeterschießen", "⚽", ["Finale beim Schulturnier, es steht unentschieden.", "Mein Schuss prallt an den Pfosten … und springt ins Tor!", "Wir jubeln und halten den Pokal hoch."]],
            ["Mein erstes Vorspiel", "🎻", ["Konzert der Instrumentalklasse in der Aula.", "Mitten im Stück weiß ich plötzlich nicht weiter!", "Ich spiele einfach weiter. Am Ende klatschen alle."]],
            ["Der verlorene Schlüssel", "🔑", ["Nach der Schule will ich nach Hause.", "Der Schlüssel ist weg, und die Tür bleibt zu!", "Die Nachbarin hat einen Ersatzschlüssel."]],
          ];
          const cols = [P.blue, P.red, P.green], names = ["Einleitung", "Höhepunkt", "Schluss"];
          const cards = data.map(([title, icon, lines]) => {
            const svg = s.svg(300, 104);
            const pts = [[10, 92], [80, 80], [180, 18], [292, 88]];
            svg.append(s.el("path", { d: smooth(pts), fill: "none", stroke: P.unit, "stroke-width": 5, "stroke-linecap": "round" }));
            [[80, 80], [180, 18], [270, 79]].forEach(([x, y], i) => svg.append(s.el("circle", { cx: x, cy: y, r: 9, fill: cols[i], stroke: "#fff", "stroke-width": 3 })));
            return later(s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", gap: "8px" } },
              s.h("p", { class: "h2", style: { fontSize: "25px" } }, icon + " " + title), svg,
              ...lines.map((l, i) => s.h("p", { class: "small", style: { fontSize: "21px" } }, B(s, names[i] + ": ", cols[i]), l))));
          });
          const lf = later(life(s, null, s.h("p", { class: "t", style: { fontSize: "22px" } }, "Auch Filme, Comics, Hörspiele und sogar ein Fußballspiel haben einen Spannungsbogen. Achte beim nächsten Film darauf: Wann ist der Höhepunkt?")));
          s.add(root(s, "stack", { gap: "16px" }, s.h("div", { class: "cols3" }, ...cards), lf));
          s.sfx.pop();
          const snd = [() => s.sound("crowd-cheer", { vol: .4, dur: 2.5 }), () => s.sound("applause", { vol: .4, dur: 2.5 }), () => s.sound("knock", { vol: .6 })];
          cards.forEach((c, i) => s.step(async () => { s.sfx.whoosh(); await s.show(c, "up"); snd[i](); s.say(data[i][0]); }));
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Die Einleitung: W-Fragen",
        say: "In der Einleitung beantwortest du die W-Fragen. Wer? Wo? Wann? Was?",
        build(s) {
          const W = { wer: ["Wer?", P.blue], wo: ["Wo?", P.green], wann: ["Wann?", P.orange], was: ["Was?", P.violet] };
          const chips = {};
          const chipRow = s.h("div", { class: "row", style: { justifyContent: "center", gap: "22px" } },
            ...Object.entries(W).map(([k, [t, c]]) => (chips[k] = s.h("span", { style: { font: "800 34px/1 var(--f-display)", color: c, border: `3px solid ${c}`, borderRadius: "16px", padding: "10px 26px", background: "#fff", opacity: .3, transition: "opacity .4s" } }, t))));
          const spans = { wer: [], wo: [], wann: [], was: [] };
          const sent = (parts, size) => s.h("p", { style: { fontSize: size + "px", lineHeight: 1.55, margin: 0 } }, ...parts.map(p => {
            if (typeof p === "string") return p;
            const el = s.h("span", null, p[1]); spans[p[0]].push(el); return el;
          }));
          const ex1 = ex(s, "Beispiel 1 · Klassenfahrt", null, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 250px", gap: "18px", alignItems: "center" } }, sent([["wann", "Am letzten Montag"], " fuhr ", ["wer", "unsere Klasse 5a"], " ", ["wo", "an die Ostsee"], ". ", ["was", "Fünf Tage mit Strand, Wald und einer Nachtwanderung lagen vor uns!"]], 27),
            s.photo("ostsee", { w: 250, h: 130, caption: "die Ostsee", pos: "50% 60%" })));
          const ex2 = later(ex(s, "Beispiel 2 · Bolzplatz", null, sent([["wann", "Gestern Nachmittag"], " spielten ", ["wer", "Jonas und ich"], " ", ["wo", "auf dem Bolzplatz"], " ", ["was", "Fußball, bis der Ball über den Zaun flog"], "."], 21)));
          const ex3 = later(ex(s, "Beispiel 3 · Zoo", null, sent([["wann", "In den Herbstferien"], " besuchte ", ["wer", "meine Familie"], " ", ["wo", "den Berliner Zoo"], ". ", ["was", "Dort erlebten wir etwas Lustiges mit einem Affen."]], 21)));
          const m = later(merk(s, null, "Die Einleitung ist ", B(s, "kurz"), " und beantwortet die ", B(s, "W-Fragen"), ". Das Spannende kommt erst im Hauptteil!"));
          s.add(root(s, "stack", { gap: "16px" }, chipRow, ex1, s.h("div", { class: "cols", style: { gap: "18px" } }, ex2, ex3), m));
          s.sfx.pop();
          const light = async (k, txt) => {
            chips[k].style.opacity = 1; s.show(chips[k], "pop"); s.sfx.pop();
            spans[k].slice(0, 1).forEach(el => mark(el, W[k][1])); s.say(txt);
          };
          s.step(() => light("wann", "Wann? Am letzten Montag."));
          s.step(() => light("wer", "Wer? Unsere Klasse fünf a."));
          s.step(() => { s.sound("waves", { vol: .4, dur: 4 }); return light("wo", "Wo? An der Ostsee."); });
          s.step(() => light("was", "Was? Eine Klassenfahrt mit Abenteuern."));
          s.step(async () => {
            s.sfx.whoosh(); s.show([ex2, ex3], "up");
            await s.wait(400);
            for (const k of Object.keys(spans)) { spans[k].slice(1).forEach(el => mark(el, W[k][1])); s.sfx.tick(); await s.wait(150); }
          });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Wörtliche Rede",
        say: "Wenn jemand in deiner Geschichte spricht, benutzt du wörtliche Rede mit Anführungszeichen.",
        build(s) {
          const Z = t => s.h("b", { style: { color: P.orange, fontSize: "1.15em" } }, t);
          const BG = t => s.h("span", { style: { color: P.blue, fontWeight: 700 } }, t);
          const RD = t => s.h("span", { style: { color: P.red } }, t);
          const pat = (label, ...kids) => later(ex(s, label, null, s.h("p", { style: { fontSize: "26px", margin: 0, lineHeight: 1.35 } }, ...kids)));
          const p1 = pat("Begleitsatz vorne", BG("Lisa rief"), Z(":"), " ", Z("„"), RD("Da ist ein Igel!"), Z("“"));
          const p2 = pat("Begleitsatz hinten", Z("„"), RD("Das ist nur ein Igel"), Z("“,"), " ", BG("lachte Herr Kaya"), Z("."));
          const p3 = pat("Begleitsatz in der Mitte", Z("„"), RD("Komm"), Z("“,"), " ", BG("flüsterte Tim"), Z(","), " ", Z("„"), RD("wir gehen näher heran."), Z("“"));
          const legend = s.h("p", { class: "small" }, sp(s, "■ ", P.red), "Rede  ", sp(s, "■ ", P.blue), "Begleitsatz  ", sp(s, "■ ", P.orange), "Satzzeichen");
          // Wortfeld sagen
          const verbs = [["flüsterte", 21, P.pencil], ["murmelte", 24, P.violet], ["jammerte", 28, P.orange], ["rief", 34, P.blue], ["brüllte", 44, P.red]];
          const vEl = s.h("b", null, "sagte");
          const sentence = s.h("p", { style: { margin: 0, fontSize: "26px", lineHeight: 1.2, textAlign: "center", transition: "font-size .3s" } }, "„Ich habe Hunger“, ", vEl, " Paul.");
          const box = s.h("div", { class: "center", style: { height: "128px", background: "#fff", borderRadius: "14px", border: `2px dashed ${P.line}`, padding: "6px 10px" } }, sentence);
          const btns = verbs.map(([v, size, c], i) => s.h("button", { class: "btn", style: { padding: "0 14px" }, onclick: () => {
            vEl.textContent = v; sentence.style.fontSize = size + "px"; vEl.style.color = c; sentence.style.color = c;
            if (i === 0) s.sfx.noise(0.5, 0.12, 2500, 4000); else if (i === 1) s.sfx.tone(180, 0.4, "triangle", 0.15); else if (i === 2) s.sfx.tone(520, 0.5, "sine", 0.18, 0, 300);
            else if (i === 3) s.sfx.tone(660, 0.25, "square", 0.08); else { s.sfx.tone(140, 0.5, "sawtooth", 0.14); sentence.classList.remove("a-shake"); void sentence.offsetWidth; sentence.classList.add("a-shake"); }
          } }, v));
          const word = later(ex(s, "Wortfeld „sagen“: Tippe!", { style: { display: "flex", flexDirection: "column", gap: "12px" } }, box, s.h("div", { class: "row", style: { gap: "10px", justifyContent: "center" } }, ...btns),
            s.h("p", { class: "small" }, "Nicht immer nur „sagte“: Zeig, ", B(s, "wie"), " jemand spricht!")));
          const m = later(merk(s, { style: { fontSize: "22px" } }, "Die Rede steht in Anführungszeichen. Am Anfang stehen sie ", B(s, "unten „", P.orange), ", am Ende ", B(s, "oben “", P.orange), "."));
          const lf4 = later(life(s, null, s.h("p", { class: "small" }, "Im Comic steht die Rede in Sprechblasen, im Buch in Anführungszeichen. Im Chat schreibst du sie einfach so.")));
          s.add(root(s, "cols", { gridTemplateColumns: "1.12fr .88fr", gap: "22px", alignItems: "start" },
            s.h("div", { class: "stack", style: { gap: "14px" } }, legend, p1, p2, p3, m), s.h("div", { class: "stack", style: { gap: "16px" } }, word, lf4)));
          s.sfx.pop();
          [p1, p2, p3].forEach((p, i) => s.step(async () => { s.sfx.snap(); await s.show(p, "left"); s.sfx.count(i); }));
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(word, "right"); s.say("Probiere aus. Flüstern, rufen, brüllen."); });
          s.step(async () => { s.sfx.pop(); await s.show(lf4, "up"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Gefühle und Gedanken",
        say: "Erzähle auch, was die Figur fühlt und denkt. Dann fühlt der Leser mit.",
        build(s) {
          const svg = s.svg(400, 330);
          svg.append(s.el("rect", { x: 20, y: 30, width: 200, height: 120, rx: 6, fill: "#2f5d4a", stroke: "#8a5a2b", "stroke-width": 6 }),
            s.el("path", { d: "M45 70 q20 -14 40 0 t40 0 M45 100 q25 -10 60 0", stroke: "#e8f2ec", "stroke-width": 3, fill: "none", opacity: .7 }));
          const legs = s.el("g", null, s.el("path", { d: "M262 250 L254 310 M282 250 L290 310", stroke: P.ink, "stroke-width": 8, "stroke-linecap": "round" }));
          const body = s.el("g", null,
            s.el("rect", { x: 244, y: 170, width: 56, height: 86, rx: 18, fill: P.unit }),
            s.el("path", { d: "M248 185 L222 238 M296 185 L322 238", stroke: P.ink, "stroke-width": 8, "stroke-linecap": "round" }),
            s.el("circle", { cx: 272, cy: 138, r: 30, fill: "#f3c9a0", stroke: P.ink, "stroke-width": 3 }),
            s.el("path", { d: "M244 128 Q272 92 300 128 Q290 112 272 110 Q254 112 244 128 Z", fill: "#4a3020" }),
            s.el("circle", { cx: 262, cy: 136, r: 3.5, fill: P.ink }), s.el("circle", { cx: 282, cy: 136, r: 3.5, fill: P.ink }),
            s.el("path", { d: "M262 154 Q272 149 282 154", stroke: P.ink, "stroke-width": 3, fill: "none", "stroke-linecap": "round" }));
          const heart = later(s.el("path", { d: "M272 222 c-14 -12 -22 -20 -22 -29 a10 10 0 0 1 22 -4 a10 10 0 0 1 22 4 c0 9 -8 17 -22 29 z", fill: P.red }));
          const bubble = later(s.el("g", null,
            s.el("circle", { cx: 312, cy: 102, r: 6, fill: "#fff", stroke: P.pencil, "stroke-width": 2 }),
            s.el("circle", { cx: 326, cy: 84, r: 9, fill: "#fff", stroke: P.pencil, "stroke-width": 2 }),
            s.el("rect", { x: 222, y: 6, width: 176, height: 66, rx: 26, fill: "#fff", stroke: P.pencil, "stroke-width": 2 }),
            s.el("text", { x: 310, y: 34, "text-anchor": "middle", "font-size": 19, fill: P.violet, "font-weight": 700, text: "Hoffentlich" }),
            s.el("text", { x: 310, y: 58, "text-anchor": "middle", "font-size": 19, fill: P.violet, "font-weight": 700, text: "lacht keiner …" })));
          const shakeLines = later(s.el("path", { d: "M236 282 l-10 4 M236 298 l-10 4 M308 282 l10 4 M308 298 l10 4", stroke: P.orange, "stroke-width": 3, "stroke-linecap": "round" }));
          svg.append(legs, body, heart, bubble, shakeLines);
          const line = (tag, color, text) => later(s.h("div", { style: { display: "grid", gridTemplateColumns: "128px 1fr", gap: "12px", alignItems: "baseline" } },
            s.h("span", { class: "chip", style: { background: color + "22", color } }, tag), s.h("p", { class: "t", style: { fontSize: "23px" } }, text)));
          const l0 = s.h("div", { style: { display: "grid", gridTemplateColumns: "128px 1fr", gap: "12px", alignItems: "baseline" } },
            s.h("span", { class: "chip" }, "Handlung"), s.h("p", { class: "t", style: { fontSize: "23px" } }, "Ich stand vorne an der Tafel und sollte mein Gedicht aufsagen."));
          const l1 = line("Körper", P.orange, "Meine Knie zitterten.");
          const l2 = line("Gefühl", P.red, "Mein Herz klopfte bis zum Hals.");
          const l3 = line("Gedanke", P.violet, "Hoffentlich lacht keiner, dachte ich.");
          const feel = [["Angst", "Mir lief ein kalter Schauer über den Rücken."], ["Freude", "Ich hätte die ganze Welt umarmen können."], ["Wut", "Ich wurde rot vor Wut und ballte die Fäuste."]];
          const cards = feel.map(([t, x], i) => later(ex(s, "Beispiel " + (i + 1) + " · " + t, null, s.h("p", { class: "small", style: { fontSize: "21px" } }, x))));
          const m5 = later(merk(s, { style: { fontSize: "22px" } }, "Zeig Gefühle mit dem Körper: Statt „Ich hatte Angst“ schreibst du lieber ", B(s, "„Meine Knie zitterten.“"), " Dann fühlt der Leser mit."));
          s.add(root(s, "stack", { gap: "16px" },
            s.h("div", { style: { display: "grid", gridTemplateColumns: "400px 1fr", gap: "24px", alignItems: "center" } }, svg, s.h("div", { class: "stack", style: { gap: "18px" } }, l0, l1, l2, l3)),
            s.h("div", { class: "cols3" }, ...cards), m5));
          s.sfx.pop();
          s.step(async () => { s.sfx.boing(); s.show(l1, "left"); s.show(shakeLines, "fade"); legs.classList.add("a-shake"); legs.style.transformBox = "fill-box"; legs.style.animationIterationCount = "4"; });
          s.step(async () => {
            s.show(l2, "left"); await s.show(heart, "pop"); heart.classList.add("a-pulse");
            s.sound("heartbeat", { vol: .7, dur: 3.5 });
          });
          s.step(async () => { s.sfx.pop(); s.show(l3, "left"); await s.show(bubble, "zoom"); s.say("Hoffentlich lacht keiner, dachte ich."); });
          s.step(async () => { for (const [i, c] of cards.entries()) { s.sfx.count(i); await s.show(c, "up"); } });
          s.step(async () => { s.sfx.ding(); await s.show(m5, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Aus langweilig mach lebendig",
        say: "Mit treffenden Verben, genauen Adjektiven und Einzelheiten wird aus einem langweiligen Satz ein lebendiges Bild.",
        build(s) {
          const N = t => s.h("b", { style: { color: P.red } }, t);
          const row = (tag, color, ...kids) => s.h("div", { style: { display: "grid", gridTemplateColumns: "170px 1fr", gap: "14px", alignItems: "center" } },
            s.h("span", { class: "chip", style: { background: color + "22", color, justifyContent: "center" } }, tag), s.h("p", { class: "t", style: { fontSize: "24px" } }, ...kids));
          const r0 = row("langweilig", P.pencil, "Der Hund ging über die Straße.");
          const r1 = later(row("+ Verb", P.blue, "Der Hund ", N("flitzte"), " über die Straße."));
          const r2 = later(row("+ Adjektive", P.green, "Der ", N("kleine, struppige"), " Hund flitzte über die Straße."));
          const r3 = later(row("+ Einzelheiten", P.violet, "Der kleine, struppige Hund flitzte ", N("mit wehenden Ohren"), " über die ", N("nasse"), " Straße."));
          const r4 = later(row("+ Geräusch", P.orange, N("Quietschend"), " bremste ein Auto. Der Hund bellte ", N("empört"), "."));
          const verbs = ["schlich", "stolperte", "hüpfte", "humpelte", "trödelte", "raste"];
          const vEl = s.h("b", { style: { color: P.red } }, "ging");
          const tryS = s.h("p", { class: "t", style: { fontSize: "26px" } }, "Der Hund ", vEl, " über die Straße.");
          const btns = verbs.map(v => s.h("button", { class: "btn", style: { padding: "0 16px" }, onclick: () => { vEl.textContent = v; s.sfx.pop(); vEl.classList.remove("a-pop"); void vEl.offsetWidth; vEl.style.display = "inline-block"; vEl.classList.add("a-pop"); } }, v));
          const play = later(ex(s, "Wortfeld „gehen“: Tippe ein Verb!", { style: { display: "flex", flexDirection: "column", gap: "12px" } }, tryS, s.h("div", { class: "row", style: { gap: "10px" } }, ...btns)));
          const m6 = later(merk(s, { style: { fontSize: "22px" } }, B(s, "Treffende Verben"), " und ", B(s, "genaue Adjektive"), " malen ein Bild im Kopf."));
          const lf6 = later(life(s, null, s.h("p", { class: "small" }, "Sportreporter im Radio machen das ständig: Sie sagen nie nur „Er läuft“, sondern „Er sprintet los!“")));
          s.add(root(s, "stack", { gap: "14px" }, s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", gap: "12px" } }, r0, r1, r2, r3, r4), play,
            s.h("div", { class: "cols", style: { gap: "18px" } }, m6, lf6)));
          s.sfx.pop();
          const go = (r, t) => async () => { s.sfx.scribble(); await s.show(r, "left"); s.sfx.ding(); s.say(t); };
          s.step(go(r1, "Flitzen statt gehen. Jetzt sehe ich, wie schnell er ist."));
          s.step(go(r2, "Adjektive zeigen, wie der Hund aussieht."));
          s.step(go(r3, "Einzelheiten machen das Bild genau."));
          s.step(async () => { s.sound("brakes", { vol: .5 }); await s.show(r4, "left"); await s.wait(700); s.sound("dog-bark", { vol: .5 }); s.say("Geräusche machen die Szene lebendig."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(play, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(m6, "up"); s.sfx.pop(); await s.show(lf6, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Erzählen im Präteritum",
        say: "Geschichten und Berichte schreibt man im Präteritum, der Erzählzeit. Tippe auf eine Karte, um sie umzudrehen.",
        build(s) {
          const pairs = [["ich sage", "ich sag", "te", 1], ["ich spiele", "ich spiel", "te", 1], ["ich lache", "ich lach", "te", 1], ["ich frage", "ich frag", "te", 1],
            ["ich gehe", "ich ", "ging", 0], ["ich laufe", "ich ", "lief", 0], ["ich sehe", "ich ", "sah", 0], ["ich rufe", "ich ", "rief", 0],
            ["ich bin", "ich ", "war", 0], ["ich habe", "ich ", "hatte", 0], ["ich komme", "ich ", "kam", 0], ["ich schreibe", "ich ", "schrieb", 0]];
          const cards = pairs.map(([pr, a, b, reg]) => {
            const lab = s.h("span", { class: "small pencil" }, "Präsens");
            const big = s.h("span", { style: { font: "700 32px/1.1 var(--f-display)" } }, pr);
            const el = s.h("div", { class: "card", style: { height: "104px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "6px", cursor: "pointer", borderColor: reg ? P.blue : P.violet } }, lab, big);
            el.state = 0;
            el.fill = st => {
              el.state = st;
              lab.textContent = st ? "Präteritum" : "Präsens";
              lab.style.color = st ? (reg ? P.blue : P.violet) : P.pencil;
              big.replaceChildren(...(st ? [a, s.h("span", { style: { color: P.red } }, b)] : [pr]));
              el.style.background = st ? (reg ? "#e8effc" : "#f0eafc") : "#fff";
            };
            el.addEventListener("click", () => flip(s, el, () => el.fill(1 - el.state)));
            return el;
          });
          const leg = s.h("div", { class: "cols" },
            s.h("p", { class: "t" }, B(s, "regelmäßig: ", P.blue), "Endung ", B(s, "-te", P.red), " anhängen"),
            s.h("p", { class: "t" }, B(s, "unregelmäßig: ", P.violet), "das Wort ", B(s, "verändert sich", P.red)));
          const m = later(merk(s, { style: { fontSize: "22px" } }, "Erzählung, Bericht und Nacherzählung stehen im ", B(s, "Präteritum"), ". Die unregelmäßigen Formen lernst du auswendig."));
          const lf = later(life(s, null, s.h("p", { class: "small" }, "Märchen beginnen mit „Es war einmal“. Auch Romane und Zeitungsberichte stehen meist im Präteritum.")));
          s.add(root(s, "stack", { gap: "16px" }, leg, s.h("div", { class: "cols4" }, ...cards), s.h("div", { class: "cols", style: { gridTemplateColumns: "1.3fr 1fr", gap: "18px" } }, m, lf)));
          cards.forEach((c, i) => { c.classList.add("a-up"); c.style.setProperty("--d", i * 60 + "ms"); });
          s.sfx.whoosh();
          s.step(async () => { for (const c of cards.slice(0, 4)) { flip(s, c, () => c.fill(1)); await s.wait(220); } s.say("Ich sagte, ich spielte. Einfach te anhängen."); });
          s.step(async () => { for (const c of cards.slice(4, 8)) { flip(s, c, () => c.fill(1)); await s.wait(220); } s.say("Ich ging, ich lief, ich sah, ich rief. Diese Wörter musst du lernen."); });
          s.step(async () => { for (const c of cards.slice(8)) { flip(s, c, () => c.fill(1)); await s.wait(220); } s.say("Ich war, ich hatte, ich kam, ich schrieb. Die brauchst du ständig."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Spannung erzeugen",
        say: "So wird es spannend: mit Andeutungen und mit Zeitlupe am Höhepunkt.",
        build(s) {
          const ands = [["Plötzlich", " hörte ich ein Geräusch hinter mir."], ["Ich ahnte noch nicht,", " was mich erwartete."], ["Da – was war das?", " Etwas bewegte sich im Schrank."]];
          const aEls = ands.map(([a, b]) => later(s.h("p", { class: "t", style: { fontSize: "23px" } }, s.h("span", { class: "hl" }, a), b)));
          const left = ex(s, "Andeutungen", { style: { display: "flex", flexDirection: "column", gap: "14px" } }, ...aEls,
            s.h("p", { class: "small pencil" }, "Der Leser merkt: Gleich passiert etwas!"));
          const texts = [
            "Ich schoss. Tor!",
            "Ich lief an und schoss. Der Ball flog. Tor!",
            "Ich lief an. Mein Herz pochte. Ich schoss, und der Ball flog auf das Tor zu. Der Torwart sprang. Tor!",
            "Ich lief an. Mein Herz pochte so laut, dass ich die Zuschauer nicht mehr hörte. Ich schoss. Der Ball flog langsam, ganz langsam auf die linke Ecke zu. Der Torwart streckte sich, seine Finger berührten fast den Ball … Tor!",
          ];
          const txt = s.h("p", { style: { fontSize: "21px", lineHeight: 1.4, margin: 0 } }, texts[0]);
          const wc = s.h("b", { class: "mono", style: { color: P.unit } }, "3");
          const clock = s.svg(96, 96);
          const hand = s.el("line", { x1: 48, y1: 48, x2: 48, y2: 14, stroke: P.red, "stroke-width": 4, "stroke-linecap": "round" });
          clock.append(s.el("circle", { cx: 48, cy: 48, r: 40, fill: "#fff", stroke: P.ink, "stroke-width": 4 }), s.el("rect", { x: 42, y: 0, width: 12, height: 8, rx: 2, fill: P.ink }), hand, s.el("circle", { cx: 48, cy: 48, r: 5, fill: P.ink }));
          const sl = s.slider({ label: "Zeitlupe", min: 1, max: 4, value: 1, fmt: v => "Stufe " + v, onInput: v => {
            txt.textContent = texts[v - 1]; wc.textContent = texts[v - 1].split(/\s+/).filter(w => /\w/.test(w)).length;
            s.tween({ from: 0, to: 360, dur: 1000, ease: "linear", update: a => hand.setAttribute("transform", `rotate(${a} 48 48)`) });
          } });
          const right = later(ex(s, "Zeitlupe am Höhepunkt", { style: { display: "flex", flexDirection: "column", gap: "10px" } },
            s.h("div", { style: { display: "grid", gridTemplateColumns: "96px 1fr", gap: "14px", alignItems: "center" } }, clock,
              s.h("p", { class: "small" }, "Echte Zeit: immer nur ", B(s, "1 Sekunde"), ".", s.h("br"), "Wörter in der Geschichte: ", wc)),
            s.h("div", { style: { height: "206px", background: "#fff", border: `2px dashed ${P.line}`, borderRadius: "12px", padding: "10px 14px" } }, txt), sl));
          const m = later(merk(s, { style: { fontSize: "22px" } }, "Am ", B(s, "Höhepunkt"), " erzählst du ganz langsam – wie in Zeitlupe. Das heißt ", B(s, "Zeitdehnung"), "."));
          s.add(root(s, "stack", { gap: "14px" }, s.h("div", { class: "cols", style: { gridTemplateColumns: ".85fr 1.15fr", gap: "20px" } }, left, right), m));
          s.sfx.pop();
          s.step(async () => { const fx = [() => s.sound("footsteps", { vol: .5, dur: 1.4 }), () => s.sfx.tone(190, 0.5, "triangle", 0.18), () => s.sound("door-creak", { vol: .6 })]; for (const [i, a] of aEls.entries()) { fx[i](); await s.show(a, "left"); await s.wait(500); } });
          s.step(async () => {
            s.sfx.whoosh(); await s.show(right, "right"); s.sound("clock-tick", { vol: .5 });
            for (let v = 2; v <= 4 && s.alive; v++) { await s.wait(900); sl.set(v); }
            s.say("Eine Sekunde, aber viele Wörter. So wird es spannend.");
          });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Die Bildergeschichte",
        say: "Bei einer Bildergeschichte schreibst du zu jedem Bild ein paar Sätze. So entsteht eine ganze Geschichte.",
        build(s) {
          const PW = 250, PH = 176;
          const panel = () => { const v = s.svg(PW, PH); v.append(s.el("rect", { x: 1, y: 1, width: PW - 2, height: PH - 2, rx: 12, fill: "#e3f1fb", stroke: P.ink, "stroke-width": 2 }), s.el("rect", { x: 2, y: 128, width: PW - 4, height: 46, rx: 0, fill: "#9ed49a" })); return v; };
          const p1 = panel(); p1.append(s.el("circle", { cx: 34, cy: 32, r: 16, fill: P.yellow }), s.el("path", { d: "M74 106 Q 140 70 192 44", stroke: P.pencil, "stroke-width": 1.5, fill: "none" }), kite(s, 196, 40, 1, 20), kid(s, 70, 132, P.blue, { armUp: true, smile: true }), kid(s, 110, 132, P.orange, { hair: "#6b3d1e", smile: true }));
          const p2 = panel(); p2.append(tree(s, 190, 62), kite(s, 188, 44, .8, -30), s.el("path", { d: "M20 44 q30 -10 60 0 M30 66 q30 -10 60 0 M14 88 q30 -10 60 0", stroke: "#8fa3b6", "stroke-width": 3, fill: "none", "stroke-linecap": "round" }),
            kid(s, 70, 132, P.blue, { armsUp: true, sad: true }), kid(s, 108, 132, P.orange, { hair: "#6b3d1e", sad: true }), T(s, 90, 70, "!", { "font-size": 30, fill: P.red }));
          const p3 = panel(); p3.append(tree(s, 190, 62), kite(s, 188, 44, .8, -30), s.el("rect", { x: 70, y: 118, width: 56, height: 8, fill: "#8a5a2b" }), s.el("path", { d: "M76 126 v14 M120 126 v14", stroke: "#8a5a2b", "stroke-width": 5 }),
            kid(s, 98, 96, P.blue, { armsUp: true }), kid(s, 48, 132, P.orange, { hair: "#6b3d1e" }));
          const man = s.el("g", null, s.el("path", { d: "M222 128 L216 160 M232 128 L238 160", stroke: P.ink, "stroke-width": 5, "stroke-linecap": "round" }), s.el("rect", { x: 212, y: 86, width: 30, height: 46, rx: 9, fill: P.green }), s.el("circle", { cx: 227, cy: 72, r: 13, fill: "#e0b08a", stroke: P.ink, "stroke-width": 2 }));
          const p4 = panel(); p4.append(s.el("circle", { cx: 34, cy: 32, r: 16, fill: P.yellow }), s.el("path", { d: "M74 106 Q 130 64 170 38", stroke: P.pencil, "stroke-width": 1.5, fill: "none" }), kite(s, 174, 34, 1, 15), kid(s, 70, 132, P.blue, { armUp: true, smile: true }), kid(s, 110, 132, P.orange, { hair: "#6b3d1e", armsUp: true, smile: true }),
            s.el("g", { transform: "translate(0 0)" }, s.el("path", { d: "M222 158 L218 132 M232 158 L236 132", stroke: P.ink, "stroke-width": 5, "stroke-linecap": "round" }), s.el("rect", { x: 212, y: 100, width: 30, height: 36, rx: 9, fill: P.green }), s.el("circle", { cx: 227, cy: 88, r: 12, fill: "#e0b08a", stroke: P.ink, "stroke-width": 2 }), s.el("path", { d: "M240 108 L252 92", stroke: P.ink, "stroke-width": 4, "stroke-linecap": "round" })));
          p3.append(man, s.el("line", { x1: 214, y1: 96, x2: 186, y2: 30, stroke: "#8a5a2b", "stroke-width": 4, "stroke-linecap": "round" }));
          const texts = [
            "Mia und Ben ließen auf dem Tempelhofer Feld ihren roten Drachen steigen.",
            "Plötzlich riss ein Windstoß die Schnur ab. Der Drachen landete hoch oben in einem Baum.",
            "Ben kletterte auf eine Bank, doch er kam nicht heran. Da kam ein Mann mit einem langen Stock.",
            "Vorsichtig angelte er den Drachen herunter. Glücklich ließen die beiden ihn wieder steigen.",
          ];
          const svgs = [p1, p2, p3, p4];
          const cols = svgs.map((v, i) => {
            const t = later(s.h("p", { class: "small", style: { padding: "0 4px", fontSize: "21px" } }, s.h("b", { style: { color: P.unit } }, (i + 1) + " "), texts[i]));
            v.style.width = "100%"; v.style.height = "auto";
            const wrap = s.h("div", { class: "stack", style: { gap: "8px" } }, later(v), t);
            wrap.svg = v; wrap.t = t; return wrap;
          });
          const titleEl = s.h("span", { class: "hand", style: { color: P.pencil, fontSize: "36px" } }, "???");
          const head = s.h("p", { class: "h2", style: { display: "flex", gap: "14px", alignItems: "baseline" } }, "Überschrift:", titleEl);
          const m = later(merk(s, { style: { fontSize: "21px" } }, "Zu jedem Bild 1–3 Sätze, Figuren mit ", B(s, "Namen"), ", im ", B(s, "Präteritum"), ", und eine ", B(s, "Überschrift"), ", die neugierig macht."));
          const lf = later(life(s, null, s.h("p", { class: "small" }, "Comics und Bauanleitungen sind auch Bildergeschichten. Wilhelm Busch zeichnete schon 1865 „Max und Moritz“.")));
          s.add(root(s, "stack", { gap: "12px" }, head, s.h("div", { class: "cols4" }, ...cols), s.h("div", { class: "cols", style: { gridTemplateColumns: "1.15fr 1fr", gap: "18px" } }, m, lf)));
          s.sfx.pop();
          cols.forEach((c, i) => s.step(async () => { if (i === 1) s.sound("wind", { vol: .5, dur: 3 }); else s.sfx.whoosh(); await s.show(c.svg, "zoom"); s.sound("pencil-write", { vol: .5 }); await s.show(c.t, "up"); s.say(texts[i]); }));
          s.step(async () => { titleEl.textContent = "Der Drachen im Baum"; titleEl.style.color = P.unit; s.sfx.fanfare(); await s.show(titleEl, "pop"); s.show(m, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 9b -------------------------------------------------------------- */
      {
        title: "Echte Bildergeschichten",
        say: "Bildergeschichten gibt es schon lange. Wilhelm Busch hat 1865 Max und Moritz gezeichnet und gedichtet. Und Drachen steigen lassen kann man in Berlin auf dem Tempelhofer Feld.",
        build(s) {
          const b1 = s.photo("max-moritz-1", { w: 520, h: 200, fit: "contain", style: { background: "#fff" }, cls: "later" });
          const b2 = s.photo("max-moritz-2", { w: 520, h: 200, fit: "contain", style: { background: "#fff" }, cls: "later" });
          const t1 = later(s.h("p", { class: "small", style: { fontSize: "21px" } }, B(s, "1", P.unit), " Die Hühner von Witwe Bolte finden Brot an Schnüren …"));
          const t2 = later(s.h("p", { class: "small", style: { fontSize: "21px" } }, B(s, "2", P.unit), " … fressen es und verheddern sich. Das war der erste Streich!"));
          const left = ex(s, "Wilhelm Busch: „Max und Moritz“ (1865)", { style: { display: "flex", flexDirection: "column", gap: "8px" } }, b1, t1, b2, t2);
          const kites = s.photo("tempelhof-drachen", { w: 520, h: 280, pos: "50% 40%", caption: "Drachenfest auf dem Tempelhofer Feld", cls: "later" });
          const lf = later(life(s, null, s.h("p", { class: "small" }, "Hier spielt unsere Bildergeschichte: Auf dem alten Flughafen-Feld lassen viele Berliner ihre Drachen steigen.")));
          const m = later(merk(s, { style: { fontSize: "20px" } }, "Busch erzählt in ", B(s, "sieben Streichen"), ": zu jedem Bild ein paar Reime. Genau so gehst du bei der Bildergeschichte vor – Bild für Bild."));
          s.add(root(s, "cols", { gridTemplateColumns: "560px 1fr", gap: "20px", alignItems: "start" }, left, s.h("div", { class: "stack", style: { gap: "12px" } }, kites, lf, m)));
          s.sfx.pop();
          s.step(async () => { s.sound("page-turn-1"); await s.show(b1, "zoom"); s.show(t1, "up"); });
          s.step(async () => { s.sound("page-turn-2"); await s.show(b2, "zoom"); s.show(t2, "up"); });
          s.step(async () => { s.sound("wind", { vol: .5, dur: 3 }); await s.show(kites, "zoom"); s.show(lf, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Nacherzählen",
        say: "Beim Nacherzählen gibst du eine Geschichte mit eigenen Worten wieder. Die Reihenfolge bleibt gleich.",
        build(s) {
          const K = t => s.h("span", null, t);
          const keys = [K("Eine kleine Maus lief aus Versehen über seine Nase."), K("Der Löwe wachte auf und packte sie mit seiner Pranke."), K("Der Löwe lachte, aber er ließ sie laufen."), K("Einige Tage später verfing er sich im Netz eines Jägers."), K("kam herbei und nagte das Netz durch.")];
          const story = ex(s, "Die Fabel · Der Löwe und die Maus (nach Äsop)", null, s.h("p", { style: { fontSize: "22px", lineHeight: 1.5, margin: 0 } },
            "Ein Löwe schlief im Schatten eines Baumes. ", keys[0], " ", keys[1], " „Bitte lass mich frei“, piepste die Maus, „vielleicht kann ich dir eines Tages helfen.“ ", keys[2], " ", keys[3], " Er brüllte laut. Die Maus hörte ihn, ", keys[4], " So rettete die Kleine den Großen."));
          const pts = ["Maus weckt den Löwen, er fängt sie.", "Maus bittet: „Lass mich frei!“", "Löwe lacht und lässt sie laufen.", "Löwe hängt im Netz fest.", "Maus nagt das Netz durch."];
          const items = pts.map((p, i) => later(s.h("div", { style: { display: "grid", gridTemplateColumns: "36px 1fr", gap: "10px", alignItems: "center" } },
            s.h("span", { style: { width: "34px", height: "34px", borderRadius: "50%", background: P.unit, color: "#fff", display: "grid", placeItems: "center", font: "700 19px var(--f-display)" } }, String(i + 1)),
            s.h("p", { class: "small", style: { fontSize: "21px" } }, p))));
          const own = later(ex(s, "Mit eigenen Worten", null, s.h("p", { class: "small", style: { fontSize: "21px" } }, "Eine Maus weckte aus Versehen einen schlafenden Löwen. Er fing sie, doch sie bat ihn, sie freizulassen …")));
          const m = later(merk(s, { style: { fontSize: "21px" } }, B(s, "Wichtiges"), " behalten, ", B(s, "Reihenfolge"), " einhalten, ", B(s, "eigene Worte"), " benutzen, im ", B(s, "Präteritum"), " erzählen. Nichts Neues dazuerfinden!"));
          s.add(root(s, "stack", { gap: "14px" },
            s.h("div", { class: "cols", style: { gridTemplateColumns: "1.15fr 1fr", gap: "20px" } }, story,
              s.h("div", { class: "stack", style: { gap: "10px" } }, s.h("p", { class: "h2", style: { fontSize: "24px" } }, "Stichpunkte in der richtigen Reihenfolge"), ...items, own)), m));
          s.sfx.pop();
          s.step(async () => { s.say("Zuerst markierst du das Wichtigste."); s.sound("pencil-write", { vol: .5 }); for (const k of keys) { mark(k, P.yellow); k.style.boxShadow = "none"; k.style.backgroundColor = "#ffe979"; await s.wait(320); } });
          s.step(async () => { s.say("Dann schreibst du Stichpunkte, in der richtigen Reihenfolge."); for (const [i, it] of items.entries()) { if (i === 3) s.sound("lion-roar", { vol: .5 }); else s.sfx.count(i); await s.show(it, "left"); } });
          s.step(async () => { s.sfx.scribble(); await s.show(own, "up"); s.say("Und dann erzählst du alles mit eigenen Worten."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Erzählung oder Bericht?",
        say: "Das gleiche Ereignis, zwei Texte: Eine Erzählung will unterhalten, ein Bericht will genau informieren.",
        build(s) {
          const F = (t, c) => { const e = s.h("span", null, t); e.c = c; return e; };
          const eParts = [F("Mein Herz raste.", P.red), " Ich sauste den Hügel hinunter, viel zu schnell! ", F("„Pass auf!“, schrie Emma.", P.blue), " Doch da war schon der Bordstein. ", F("Rums!", P.orange), " Ich flog vom Rad und landete im Gebüsch. ", F("Zum Glück tat nur mein Knie weh.", P.red)];
          const bParts = [F("Am Dienstag, dem 6. Oktober 2026,", P.orange), " fuhr ", F("Tom K. aus der Klasse 5a", P.blue), " ", F("gegen 7.45 Uhr", P.orange), " mit dem Fahrrad zur Schule. ", F("Vor dem Schultor", P.green), " fuhr er ", F("zu schnell", P.violet), " gegen den Bordstein und stürzte. ", F("Er schürfte sich das Knie auf. Frau Weber leistete Erste Hilfe.", P.red)];
          const eTxt = s.h("p", { style: { fontSize: "23px", lineHeight: 1.5, margin: 0 } }, ...eParts);
          const bTxt = s.h("p", { style: { fontSize: "23px", lineHeight: 1.5, margin: 0 } }, ...bParts);
          const eBox = s.h("div", { class: "card", style: { borderColor: P.unit } }, s.h("p", { class: "h2", style: { color: P.unit, marginBottom: "8px", fontSize: "27px" } }, "Erzählung: Der Sturz"), eTxt);
          const bBox = later(s.h("div", { class: "card", style: { borderColor: P.blue } }, s.h("p", { class: "h2", style: { color: P.blue, marginBottom: "8px", fontSize: "27px" } }, "Bericht: Fahrradunfall"), bTxt));
          const chipsE = later(s.h("div", { class: "row", style: { gap: "8px" } }, ...["spannend", "Gefühle", "wörtliche Rede", "Geräusche"].map(t => s.h("span", { class: "chip", style: { background: P.soft } }, t))));
          const chipsB = later(s.h("div", { class: "row", style: { gap: "8px" } }, ...["sachlich", "W-Fragen", "genaue Angaben", "keine Gefühle"].map(t => s.h("span", { class: "chip", style: { background: "#e4ecfb" } }, t))));
          const both = later(merk(s, null, "Beide stehen im ", B(s, "Präteritum"), ". Die Erzählung will ", B(s, "unterhalten", P.unit), ", der Bericht will ", B(s, "informieren", P.blue), "."));
          s.add(root(s, "stack", { gap: "14px" }, s.h("div", { class: "cols", style: { gap: "20px" } },
            s.h("div", { class: "stack", style: { gap: "10px" } }, eBox, chipsE), s.h("div", { class: "stack", style: { gap: "10px" } }, bBox, chipsB)), both));
          s.sfx.pop();
          s.step(async () => { s.say("In der Erzählung: Gefühle, wörtliche Rede, Geräusche."); for (const p of eParts.filter(x => typeof x !== "string")) { mark(p, p.c); if (p.textContent === "Rums!") s.sound("bike-crash", { vol: .6 }); else s.sfx.tick(); await s.wait(260); } s.show(chipsE, "up"); s.sfx.pop(); });
          s.step(async () => { s.sfx.whoosh(); await s.show(bBox, "right"); s.say("Der Bericht. Kurz, sachlich und genau."); });
          s.step(async () => { for (const p of bParts.filter(x => typeof x !== "string")) { mark(p, p.c); s.sfx.tick(); await s.wait(260); } s.show(chipsB, "up"); s.sfx.pop(); });
          s.step(async () => { s.sfx.ding(); await s.show(both, "up"); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Der Bericht: W-Fragen",
        say: "Ein Bericht beantwortet die W-Fragen. Julian hat seinen Turnbeutel verloren und schreibt einen Bericht für den Hausmeister.",
        build(s) {
          const Wq = [["Wer?", P.blue], ["Was?", P.violet], ["Wann?", P.orange], ["Wo?", P.green], ["Wie?", "#0e7490"], ["Warum?", P.red], ["Folgen?", "#8a5a2b"]];
          const svg = s.svg(360, 360);
          svg.append(s.el("circle", { cx: 180, cy: 180, r: 62, fill: P.soft, stroke: P.unit, "stroke-width": 4 }), T(s, 180, 188, "Bericht", { fill: P.unit, "font-size": 26 }));
          const nodes = Wq.map(([t, c], i) => {
            const a = -Math.PI / 2 + i * 2 * Math.PI / Wq.length, x = 180 + 128 * Math.cos(a), y = 180 + 128 * Math.sin(a);
            const g = s.el("g", { opacity: .3 }, s.el("line", { x1: 180 + 66 * Math.cos(a), y1: 180 + 66 * Math.sin(a), x2: 180 + 90 * Math.cos(a), y2: 180 + 90 * Math.sin(a), stroke: c, "stroke-width": 4 }),
              s.el("circle", { cx: x, cy: y, r: 41, fill: "#fff", stroke: c, "stroke-width": 4 }), T(s, x, y + 7, t, { fill: c, "font-size": t.length > 5 ? 17 : 21 }));
            g.style.transition = "opacity .4s"; svg.append(g); return g;
          });
          const S = (i, t) => { const e = s.h("span", null, t); e.i = i; return e; };
          const parts = [S(2, "Am Mittwoch, dem 30. September 2026,"), " ", S(2, "nach dem Sportunterricht"), " ", S(1, "vergaß"), " ", S(0, "ich, Julian S. aus der 5a,"), " ", S(1, "meinen blauen Turnbeutel"), " ", S(3, "in der Umkleide der Sporthalle"), ". ", S(4, "Ich hatte ihn an einen Haken gehängt."), " ", S(5, "Weil mein Bus gleich kam, ging ich schnell los."), " ", S(6, "Am nächsten Morgen war der Beutel weg."), " Darin sind meine Turnschuhe und ein grünes T-Shirt."];
          const txt = s.h("p", { style: { fontSize: "21px", lineHeight: 1.5, margin: 0 } }, ...parts);
          const lf = later(life(s, null, s.h("p", { class: "small" }, "Unfallbericht für die Versicherung, Polizeibericht, Spielbericht in der Zeitung, Artikel für die Schülerzeitung.")));
          const m = later(merk(s, null, "Ein Bericht ist ", B(s, "sachlich"), ": Präteritum, richtige Reihenfolge, genaue Angaben, ", B(s, "keine Gefühle"), " und keine wörtliche Rede."));
          s.add(root(s, "stack", { gap: "14px" }, s.h("div", { style: { display: "grid", gridTemplateColumns: "360px 1fr", gap: "24px", alignItems: "start" } }, svg,
            s.h("div", { class: "stack", style: { gap: "14px" } }, ex(s, "Bericht für den Hausmeister", null, txt), lf)), m));
          s.sfx.pop();
          const light = (ids, say) => async () => {
            for (const i of ids) { nodes[i].setAttribute("opacity", 1); s.sfx.count(i); parts.filter(p => p.i === i).forEach(p => mark(p, Wq[i][1])); await s.wait(300); }
            s.say(say);
          };
          s.step(light([0, 1], "Wer? Julian. Was? Er vergaß seinen Turnbeutel."));
          s.step(light([2, 3], "Wann? Am Mittwoch nach dem Sport. Wo? In der Umkleide."));
          s.step(light([4, 5], "Wie und warum? Er hatte es eilig, weil der Bus kam."));
          s.step(light([6], "Welche Folgen? Der Beutel war weg."));
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Einen Gegenstand beschreiben",
        say: "Julians Rucksack ist weg! Für die Suchanzeige beschreibt er ihn ganz genau, vom Großen zum Kleinen.",
        build(s) {
          const svg = s.svg(380, 400);
          svg.append(
            s.el("path", { d: "M130 70 Q190 10 250 70", stroke: "#1e2a4a", "stroke-width": 12, fill: "none", "stroke-linecap": "round" }),
            s.el("rect", { x: 80, y: 60, width: 220, height: 300, rx: 46, fill: "#22346b" }),
            s.el("rect", { x: 112, y: 210, width: 156, height: 118, rx: 24, fill: "#2c4489", stroke: "#18244a", "stroke-width": 3 }),
            s.el("path", { d: "M122 226 H258", stroke: "#c9ced8", "stroke-width": 5, "stroke-linecap": "round" }),
            s.el("rect", { x: 236, y: 220, width: 10, height: 20, rx: 3, fill: "#e6e8ee" }),
            s.el("rect", { x: 300, y: 170, width: 44, height: 150, rx: 10, fill: "none", stroke: "#3a4f8a", "stroke-width": 3, "stroke-dasharray": "6 5" }),
            s.el("rect", { x: 306, y: 150, width: 32, height: 150, rx: 8, fill: "#2fa36b" }), s.el("rect", { x: 310, y: 138, width: 24, height: 16, rx: 4, fill: "#1d7a4e" }),
            s.el("path", { d: "M92 100 Q60 210 96 340", stroke: "#111", "stroke-width": 10, fill: "none", "stroke-linecap": "round", opacity: .55 }));
          const charm = s.el("g", { transform: "translate(150 44) rotate(-20)" }, s.el("ellipse", { cx: 0, cy: 22, rx: 11, ry: 13, fill: P.orange }), s.el("ellipse", { cx: 0, cy: 6, rx: 8, ry: 9, fill: P.orange }), s.el("rect", { x: -2, y: -26, width: 4, height: 26, fill: "#8a5a2b" }), s.el("circle", { cx: 0, cy: 18, r: 4, fill: "#5a3a12" }));
          svg.append(s.el("path", { d: "M150 34 L144 20", stroke: P.pencil, "stroke-width": 2 }), charm);
          const marks = [[190, 190, 1], [190, 270, 2], [92, 230, 3], [322, 230, 4], [106, 40, 5]].map(([x, y, n]) => {
            const g = later(s.el("g", null, s.el("circle", { cx: x, cy: y, r: 17, fill: P.yellow, stroke: P.ink, "stroke-width": 2 }), T(s, x, y + 7, String(n), { "font-size": 19 })));
            svg.append(g); return g;
          });
          const lines = [
            ["Gesamteindruck", "Mein Rucksack ist dunkelblau und ungefähr 40 cm hoch."],
            ["Teil", "Vorne hat er ein großes Fach mit einem silbernen Reißverschluss."],
            ["Teil", "Die beiden Schultergurte sind schwarz und gepolstert."],
            ["Teil", "An der rechten Seite steckt eine grüne Trinkflasche in einem Netz."],
            ["Besonderheit", "Am Griff hängt ein kleiner Anhänger in Form einer Gitarre."],
          ];
          const items = lines.map(([tag, t], i) => later(s.h("div", { style: { display: "grid", gridTemplateColumns: "34px 1fr", gap: "10px", alignItems: "start" } },
            s.h("span", { style: { width: "32px", height: "32px", borderRadius: "50%", background: P.yellow, border: `2px solid ${P.ink}`, display: "grid", placeItems: "center", font: "700 18px var(--f-display)" } }, String(i + 1)),
            s.h("p", { class: "small", style: { fontSize: "20px" } }, B(s, tag + ": ", i === 0 ? P.blue : i === 4 ? P.red : P.green), t))));
          const arrow = s.h("div", { style: { width: "26px", alignSelf: "stretch", background: `linear-gradient(${P.unit}, ${P.unit}33)`, clipPath: "polygon(0 0, 100% 0, 65% 100%, 35% 100%)", borderRadius: "4px" } });
          const right = s.h("div", { class: "stack", style: { gap: "12px" } }, s.h("p", { class: "h2", style: { fontSize: "26px" } }, "Vom Großen zum Kleinen"),
            s.h("div", { style: { display: "flex", gap: "12px" } }, arrow, s.h("div", { class: "stack", style: { gap: "12px", flex: 1 } }, ...items)));
          const m = later(merk(s, { style: { fontSize: "21px" } }, "Beschreibung: ", B(s, "Präsens"), ", genaue Adjektive (", B(s, "dunkelblau"), " statt blau), sinnvolle Reihenfolge, keine Gefühle."));
          const lf = later(life(s, null, s.h("p", { class: "small" }, "Suchanzeige am schwarzen Brett, Meldung beim Fundbüro, Anzeige zum Verkaufen im Internet.")));
          right.append(m, lf);
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "380px 1fr", gap: "24px", alignItems: "center" }, svg, right));
          s.sfx.pop();
          items.forEach((it, i) => s.step(async () => { if (i === 1) s.sound("zipper", { vol: .6 }); else s.sfx.count(i); s.show(marks[i], "pop"); await s.show(it, "left"); s.say(lines[i][1]); }));
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Einen Weg beschreiben",
        say: "Wie kommt man von der Schule zur U-Bahn? Eine Wegbeschreibung führt Schritt für Schritt ans Ziel.",
        build(s) {
          const svg = s.svg(540, 470);
          svg.append(s.el("rect", { x: 0, y: 0, width: 540, height: 470, rx: 16, fill: "#eef0e6" }),
            s.el("rect", { x: 0, y: 176, width: 540, height: 54, fill: "#c9ccd3" }), s.el("rect", { x: 292, y: 176, width: 58, height: 294, fill: "#c9ccd3" }),
            s.el("path", { d: "M0 203 H540 M321 230 V470", stroke: "#fff", "stroke-width": 3, "stroke-dasharray": "14 12" }),
            s.el("rect", { x: 20, y: 40, width: 170, height: 126, rx: 8, fill: "#e8c7a0", stroke: "#8a5a2b", "stroke-width": 3 }), T(s, 105, 100, "Schule", { "font-size": 22 }),
            s.el("rect", { x: 92, y: 158, width: 30, height: 12, fill: "#8a5a2b" }),
            s.el("rect", { x: 360, y: 60, width: 150, height: 106, rx: 8, fill: "#f6d78f", stroke: "#b8862a", "stroke-width": 3 }), T(s, 435, 120, "Bäckerei", { "font-size": 21 }),
            s.el("rect", { x: 360, y: 244, width: 166, height: 150, rx: 18, fill: "#9ed49a" }), s.el("circle", { cx: 400, cy: 290, r: 20, fill: "#4caf6a" }), s.el("circle", { cx: 480, cy: 340, r: 24, fill: "#4caf6a" }), T(s, 443, 382, "Park", { "font-size": 21, fill: "#1d6b3a" }),
            s.el("rect", { x: 20, y: 252, width: 230, height: 120, rx: 8, fill: "#d9dde6", stroke: "#9aa3b4", "stroke-width": 2 }), T(s, 135, 318, "Wohnhäuser", { "font-size": 20, fill: P.pencil }),
            s.el("rect", { x: 274, y: 160, width: 12, height: 30, rx: 3, fill: "#333" }), s.el("circle", { cx: 280, cy: 167, r: 4, fill: "#e33" }), s.el("circle", { cx: 280, cy: 181, r: 4, fill: "#3c3" }));
          const uSign = later(s.el("g", null, s.el("rect", { x: 204, y: 400, width: 46, height: 46, rx: 6, fill: "#1d5bd0" }), T(s, 227, 434, "U", { fill: "#fff", "font-size": 32, "font-weight": 800 })));
          svg.append(uSign);
          const route = [[107, 172], [270, 172], [270, 240], [270, 420]];
          const trail = s.el("polyline", { points: route[0].join(","), fill: "none", stroke: P.unit, "stroke-width": 6, "stroke-dasharray": "2 12", "stroke-linecap": "round" });
          const dot = s.el("circle", { cx: route[0][0], cy: route[0][1], r: 12, fill: P.unit, stroke: "#fff", "stroke-width": 4 });
          svg.append(trail, dot);
          let done = [route[0]];
          const walk = async (to) => {
            const from = done[done.length - 1];
            s.sfx.whoosh();
            await s.tween({ from: 0, to: 1, dur: 900, update: t => {
              const x = from[0] + (to[0] - from[0]) * t, y = from[1] + (to[1] - from[1]) * t;
              dot.setAttribute("cx", x); dot.setAttribute("cy", y);
              trail.setAttribute("points", [...done, [x, y]].map(p => p.join(",")).join(" "));
            } });
            done.push(to);
          };
          const ins = [
            ["Zuerst", " gehst du durch das Schultor und dann nach links."],
            ["An der Ampel", " bei der Bäckerei überquerst du die Straße – aber nur bei Grün!"],
            ["Danach", " gehst du geradeaus. Auf der anderen Straßenseite siehst du den Park."],
            ["Zum Schluss", " kommst du zu einem blauen Schild mit einem weißen U. Hier ist der Eingang zur U-Bahn."],
          ];
          const items = ins.map(([a, b]) => later(s.h("p", { class: "small", style: { fontSize: "21px" } }, s.h("span", { class: "hl" }, a), b)));
          const m = later(merk(s, { style: { fontSize: "20px", lineHeight: 1.35 } }, "Reihenfolge: ", B(s, "zuerst, dann, danach, zum Schluss"), ". Richtung: ", B(s, "links, rechts, geradeaus"), ". Orientierungspunkte nennen! Zeitform: ", B(s, "Präsens"), "."));
          const uPhoto = s.photo("ubahn-schild", { w: "100%", h: 190, pos: "50% 30%", caption: "So sieht das U-Schild in Berlin aus.", cls: "later" });
          s.add(root(s, "cols", { gridTemplateColumns: "540px 1fr", gap: "24px", alignItems: "start" }, svg, s.h("div", { class: "stack", style: { gap: "12px" } }, ...items, uPhoto, m)));
          s.sfx.pop();
          s.step(async () => { s.show(items[0], "left"); await walk(route[1]); s.sfx.pop(); });
          s.step(async () => { s.show(items[1], "left"); s.sound("traffic", { vol: .4, dur: 2.5 }); await walk(route[2]); });
          s.step(async () => { s.show(items[2], "left"); await walk(route[3]); s.sfx.pop(); });
          s.step(async () => { s.show(items[3], "left"); s.sound("ubahn-train", { vol: .4, dur: 3 }); s.show(uPhoto, "zoom"); await s.show(uSign, "pop"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Brief und E-Mail",
        say: "Eine E-Mail an die Lehrerin klingt anders als eine an Oma. Der Aufbau ist aber gleich.",
        build(s) {
          const V = {
            f: { Betreff: "Frage zu den Mathe-Hausaufgaben", Anrede: "Sehr geehrte Frau Weber,", Text: "ich war gestern krank. Könnten Sie mir bitte sagen, welche Aufgaben wir bis Freitag machen sollen?", Gruß: "Mit freundlichen Grüßen", Name: "Julian Sarmiento, Klasse 5a" },
            i: { Betreff: "Danke für das Buch!", Anrede: "Liebe Oma,", Text: "vielen Dank für das tolle Buch! Ich habe schon drei Kapitel gelesen. Wann kommst du uns besuchen?", Gruß: "Viele liebe Grüße", Name: "dein Julian" },
          };
          const colors = { Betreff: P.pencil, Anrede: P.blue, Text: P.ink, Gruß: P.green, Name: P.violet };
          const rows = {};
          const mail = s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", gap: "12px", padding: "16px 20px" } },
            s.h("div", { style: { display: "flex", gap: "8px", alignItems: "center", borderBottom: `2px solid ${P.line}`, paddingBottom: "10px" } },
              ...["#ff5f57", "#febc2e", "#28c840"].map(c => s.h("span", { style: { width: "14px", height: "14px", borderRadius: "50%", background: c } })), s.h("b", { style: { marginLeft: "10px", fontSize: "20px" } }, "Neue E-Mail")),
            ...Object.keys(colors).map(k => {
              const val = s.h("p", { class: "t", style: { fontSize: k === "Text" ? "21px" : "23px", minHeight: k === "Text" ? "90px" : "auto", fontWeight: k === "Betreff" ? 700 : 400 } }, V.f[k]);
              const r = later(s.h("div", { style: { display: "grid", gridTemplateColumns: "112px 1fr", gap: "14px", alignItems: "start" } }, s.h("span", { class: "chip", style: { background: colors[k] + "22", color: colors[k], justifyContent: "center" } }, k), val));
              r.val = val; rows[k] = r; return r;
            }));
          let mode = "f";
          const setMode = async m => {
            if (m === mode) return; mode = m; s.sfx.whoosh();
            bF.classList.toggle("solid", m === "f"); bI.classList.toggle("solid", m === "i");
            for (const k of Object.keys(rows)) { await flip(s, rows[k].val, () => { rows[k].val.textContent = V[m][k]; }); }
          };
          const bF = s.h("button", { class: "btn solid", onclick: () => setMode("f") }, "an die Lehrerin");
          const bI = s.h("button", { class: "btn", onclick: () => setMode("i") }, "an Oma");
          const rules = later(merk(s, { style: { fontSize: "21px" } }, "Nach der Anrede kommt ein ", B(s, "Komma"), " und es geht ", B(s, "klein"), " weiter. Nach dem Gruß kommt ", B(s, "kein Komma"), ". ", B(s, "Sie, Ihnen"), " schreibt man groß."));
          const cmp = later(s.h("div", { class: "card soft", style: { display: "flex", flexDirection: "column", gap: "8px" } },
            s.h("p", { class: "small" }, B(s, "formell: ", P.blue), "Sehr geehrte …, Sie, Mit freundlichen Grüßen"),
            s.h("p", { class: "small" }, B(s, "informell: ", P.unit), "Liebe … / Hallo …, du, Viele Grüße")));
          const lf15 = later(life(s, null, s.h("p", { class: "small" }, "E-Mail an die Lehrerin über IServ, Nachricht an den Trainer, Postkarte aus dem Urlaub, Dankesbrief an die Patentante.")));
          s.add(root(s, "cols", { gridTemplateColumns: "1.25fr .75fr", gap: "22px", alignItems: "start" }, s.h("div", { class: "stack", style: { gap: "16px" } }, mail, lf15),
            s.h("div", { class: "stack", style: { gap: "14px" } }, s.h("p", { class: "h2", style: { fontSize: "25px" } }, "Schreibe …"), s.h("div", { class: "row", style: { gap: "10px" } }, bF, bI), cmp, rules)));
          s.sfx.pop();
          s.step(async () => { s.sound("keyboard", { vol: .5, dur: 2.5 }); for (const k of Object.keys(rows)) { await s.show(rows[k], "left"); } s.say("Betreff, Anrede, Text, Gruß und Name."); });
          s.step(async () => { await setMode("i"); s.say("An Oma schreibst du freundlich und locker, mit du."); });
          s.step(async () => { s.sfx.pop(); await s.show(cmp, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(rules, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(lf15, "up"); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Planen und Überarbeiten",
        say: "Gute Texte entstehen in Schritten: planen, schreiben, überarbeiten. In der Schreibkonferenz helft ihr euch gegenseitig.",
        build(s) {
          const svg = s.svg(440, 300);
          const st = [["Planen", 220, 40, P.blue], ["Schreiben", 366, 150, P.unit], ["Überarbeiten", 220, 260, P.orange], ["Reinschrift", 74, 150, P.green]];
          const nodes = st.map(([t, x, y, c]) => later(s.el("g", null, s.el("rect", { x: x - 68, y: y - 28, width: 136, height: 56, rx: 16, fill: "#fff", stroke: c, "stroke-width": 4 }), T(s, x, y + 7, t, { fill: c, "font-size": t.length > 9 ? 19 : 21 }))));
          const arcs = [["M290 46 Q360 64 368 112", P.blue], ["M360 188 Q350 248 292 262", P.unit], ["M148 262 Q90 248 80 188", P.orange]].map(([d, c]) => later(s.el("path", { d, fill: "none", stroke: c, "stroke-width": 4 })));
          const heads = [[368, 116, 90], [290, 262, 190], [80, 186, -90]].map(([x, y, r]) => later(s.el("path", { d: "M-8 -10 L8 0 L-8 10 Z", transform: `translate(${x} ${y}) rotate(${r})`, fill: P.ink })));
          svg.append(...arcs, ...heads, ...nodes, T(s, 220, 166, "✎", { "font-size": 48, fill: P.unit }));
          const plan = later(ex(s, "Schreibplan", null, s.h("p", { class: "small", style: { fontSize: "20px" } }, "Ideen sammeln (Cluster), ordnen, Spannungsbogen skizzieren: Was passiert am Anfang, am Höhepunkt, am Schluss?")));
          const checks = ["Macht die Überschrift neugierig?", "Beantwortet die Einleitung die W-Fragen?", "Gibt es einen Höhepunkt?", "Steht alles im Präteritum?", "Fangen die Sätze verschieden an?", "Stimmen Rechtschreibung und Satzzeichen?"];
          const boxes = [];
          const list = checks.map(c => { const b = s.h("span", { style: { width: "30px", height: "30px", border: `3px solid ${P.unit}`, borderRadius: "8px", display: "grid", placeItems: "center", color: P.green, font: "800 24px/1 var(--f-display)", flex: "none" } }, ""); boxes.push(b);
            return s.h("div", { style: { display: "flex", gap: "12px", alignItems: "center" } }, b, s.h("p", { class: "small", style: { fontSize: "21px" } }, c)); });
          const conf = later(ex(s, "Schreibkonferenz: Checkliste", { style: { display: "flex", flexDirection: "column", gap: "11px" } }, ...list,
            s.h("p", { class: "small pencil" }, "Zu zweit oder zu dritt lest ihr euch die Texte vor und gebt Tipps.")));
          const types = [["Ferienerlebnis", "Erzählung"], ["Unfall auf dem Schulhof", "Bericht"], ["Mütze verloren", "Beschreibung"], ["Frage an die Lehrerin", "formelle E-Mail"]];
          const lf = later(life(s, null, s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" } }, ...types.map(([a, b]) => s.h("div", { style: { background: "#fff", borderRadius: "12px", padding: "8px 12px" } }, s.h("p", { class: "small" }, a), s.h("p", { class: "small", style: { fontWeight: 700, color: P.unit } }, "→ " + b))))));
          s.add(root(s, "stack", { gap: "14px" }, s.h("div", { style: { display: "grid", gridTemplateColumns: "440px 1fr", gap: "22px", alignItems: "start" } }, s.h("div", { class: "stack", style: { gap: "10px" } }, svg, plan), conf), lf));
          s.sfx.pop();
          s.step(async () => { for (let i = 0; i < 4; i++) { s.sfx.count(i); await s.show(nodes[i], "pop"); if (arcs[i]) { s.show(heads[i], "fade", 600); await s.show(arcs[i], "draw"); } } s.say("Planen, schreiben, überarbeiten, Reinschrift."); });
          s.step(async () => { s.sound("pencil-write", { vol: .6 }); await s.show(plan, "up"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(conf, "right"); for (const b of boxes) { await s.wait(260); b.textContent = "✓"; s.sfx.tick(); } s.sfx.success(); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); s.say("Welche Textsorte passt? Das hängt davon ab, was du willst."); });
        },
      },
    ],
  });
})();
