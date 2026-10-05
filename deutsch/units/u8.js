/* Kapitel 8 – Märchen, Fabeln, Gedichte (Grimm, Äsop/La Fontaine/Lessing, Sagen: Herakles/Odysseus/Ikarus nach Schwab, Kahlbutz, Schlangenkönig, Vers/Reim/Metrum, eigene Gedichte (Elfchen, Rondell, Haiku), Erlkönig, Buchvorstellung, Vorlesen) */
(() => {
  const P = { blue: "#1d5bd0", red: "#dc3b2a", green: "#138a5a", violet: "#7b4fd6", orange: "#ee7a1a", ink: "#1b2740", pencil: "#5d6678", yellow: "#ffd94a", line: "#c8d3de", unit: "#0e7490", soft: "#dff3f7", gold: "#e0a800" };
  const later = el => { el.classList.add("later"); return el; };
  const ex = (s, label, attrs, ...kids) => s.h("div", Object.assign({ class: "ex" }, attrs || {}), s.h("span", { class: "exlabel" }, label), ...kids);
  const life = (s, attrs, ...kids) => s.h("div", Object.assign({ class: "life" }, attrs || {}), s.h("span", { class: "exlabel" }, "Im Alltag"), ...kids);
  const merk = (s, attrs, ...kids) => s.h("div", Object.assign({ class: "merk" }, attrs || {}), ...kids);
  const B = (s, text, color) => s.h("b", { style: { color: color || "inherit" } }, text);
  const T = (s, x, y, text, a) => s.el("text", Object.assign({ x, y, "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: P.ink, text }, a || {}));
  const root = (s, cls, style, ...kids) => s.h("div", { class: cls, style: Object.assign({ height: "100%" }, style || {}) }, ...kids);
  const speaker = s => { const v = s.svg(24, 24); v.innerHTML = '<path d="M3 9h4l5-4v14l-5-4H3z" fill="currentColor"/><path d="M15 9a4 4 0 010 6M17.5 6.5a8 8 0 010 11" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/>'; return v; };
  /* read a text aloud on demand (works even when Vorlesen is switched off) */
  const read = (s, text) => { if (s.fast) return; Deck.Voice.say(text.replace(/:/g, ",").replace(/[„“]/g, ""), true); };
  const readBtn = (s, label, text, solid) => s.h("button", { class: "btn" + (solid ? " solid" : ""), onclick: () => { s.sfx.click(); read(s, typeof text === "function" ? text() : text); } }, speaker(s), label);
  const fb = el => { el.style.transformBox = "fill-box"; el.style.transformOrigin = "center"; return el; };
  const pulseOnce = el => { el.classList.remove("a-pop"); void el.getBoundingClientRect(); el.classList.add("a-pop"); };

  Deck.unit({
    id: "u8", num: 8, title: "Märchen, Fabeln, Gedichte", color: "#0e7490", soft: "#dff3f7",
    subtitle: "Es war einmal … und reimt sich das?",
    blurb: "Märchen, Fabeln, Sagen, eigene Gedichte, Balladen.",
    goals: ["Märchen und ihre Merkmale erkennen", "Fabeln und Sagen verstehen – Lehre und wahrer Kern", "Vers, Reim und Rhythmus entdecken – und selbst dichten: Elfchen, Rondell, Haiku", "Eine Ballade mit verteilten Rollen erleben", "Ein Buch vorstellen und gut vorlesen"],
    icon(svg, el) {
      svg.append(el("path", { d: "M8 18 Q22 12 35 18 V60 Q22 54 8 60 Z", fill: "#0e7490", opacity: .25 }), el("path", { d: "M35 18 Q48 12 62 18 V60 Q48 54 35 60 Z", fill: "#0e7490", opacity: .45 }),
        el("path", { d: "M50 4 l3 7 l7 1 l-5 5 l1 7 l-6 -3 l-6 3 l1 -7 l-5 -5 l7 -1 z", fill: "#e0a800" }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Woran erkennt man Märchen?",
        say: "Märchen haben typische Merkmale. Wenn du sie kennst, erkennst du jedes Märchen sofort.",
        build(s) {
          const ic = (draw) => { const v = s.svg(56, 56); draw(v); return v; };
          const icons = [
            v => v.append(s.el("path", { d: "M4 12 Q16 6 28 12 V48 Q16 42 4 48 Z", fill: P.soft, stroke: P.unit, "stroke-width": 3 }), s.el("path", { d: "M28 12 Q40 6 52 12 V48 Q40 42 28 48 Z", fill: P.soft, stroke: P.unit, "stroke-width": 3 })),
            v => v.append(s.el("circle", { cx: 28, cy: 28, r: 22, fill: "#fff", stroke: P.pencil, "stroke-width": 3 }), T(s, 28, 38, "?", { "font-size": 28, fill: P.pencil })),
            v => v.append(s.el("path", { d: "M6 40 L10 18 L19 28 L28 12 L37 28 L46 18 L50 40 Z", fill: P.gold }), s.el("path", { d: "M30 52 L42 20 L54 52 Z", fill: "#3b2a4a" })),
            v => v.append(s.el("path", { d: "M10 50 L38 22", stroke: "#3b2a4a", "stroke-width": 5, "stroke-linecap": "round" }), s.el("path", { d: "M42 6 l3 8 l8 1 l-6 5 l2 8 l-7 -4 l-7 4 l2 -8 l-6 -5 l8 -1 z", fill: P.gold })),
            v => v.append(s.el("path", { d: "M6 52 L10 22 L20 32 L30 32 L40 22 L44 52 Q25 60 6 52 Z", fill: "#8a96a8" }), s.el("circle", { cx: 18, cy: 40, r: 3, fill: P.ink }), s.el("circle", { cx: 32, cy: 40, r: 3, fill: P.ink }), s.el("path", { d: "M21 49 h8", stroke: P.ink, "stroke-width": 2.5 }),
              s.el("rect", { x: 30, y: 2, width: 24, height: 16, rx: 6, fill: "#fff", stroke: P.pencil, "stroke-width": 2 }), s.el("path", { d: "M35 8 h14 M35 13 h9", stroke: P.pencil, "stroke-width": 2 })),
            v => v.append(T(s, 12, 36, "3", { fill: P.red, "font-size": 24 }), T(s, 28, 36, "7", { fill: P.blue, "font-size": 24 }), T(s, 45, 36, "12", { fill: P.green, "font-size": 20 })),
            v => v.append(s.el("path", { d: "M28 50 C8 36 4 26 4 18 A12 12 0 0 1 28 14 A12 12 0 0 1 52 18 C52 26 48 36 28 50 Z", fill: P.red })),
          ];
          const data = [
            ["„Es war einmal …“", "So fangen viele Märchen an, zum Beispiel Rotkäppchen und Rumpelstilzchen."],
            ["Kein genauer Ort, keine genaue Zeit", "„In einem großen Wald“, „vor langer Zeit“ – aber nie: Berlin, 2026."],
            ["Gut gegen Böse", "Hänsel und Gretel gegen die Hexe. Das Gute gewinnt am Ende."],
            ["Zauber und Wunder", "Rumpelstilzchen spinnt Stroh zu Gold."],
            ["Tiere sprechen", "Der Wolf redet mit Rotkäppchen."],
            ["Zauberzahlen", "Drei Nächte, sieben Zwerge, zwölf goldene Teller."],
            ["Glückliches Ende", "„Und wenn sie nicht gestorben sind, dann leben sie noch heute.“"],
          ];
          const cards = data.map(([t, e], i) => later(s.h("div", { class: "card", style: { display: "grid", gridTemplateColumns: "56px 1fr", gap: "14px", alignItems: "center", padding: "16px 18px", minHeight: "118px" } },
            ic(icons[i]), s.h("div", null, s.h("p", { class: "h2", style: { fontSize: "25px", color: P.unit } }, t), s.h("p", { class: "small", style: { fontSize: "20px" } }, e)))));
          const m = later(merk(s, { style: { fontSize: "21px", padding: "12px 20px 14px" } }, "Märchen wurden früher ", B(s, "mündlich erzählt"), ". Darum kommen dieselben Muster immer wieder."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 18px", alignContent: "start" }, ...cards, m));
          s.sfx.pop();
          const gSnd = [() => s.sound("page-turn-1"), () => s.sound("magic-chime", { vol: .6 }), () => s.sound("wolf-howl", { vol: .4, dur: 2.5 }), () => s.sound("harp-gliss", { vol: .5 })];
          [[0, 1], [2, 3], [4, 5], [6]].forEach((grp, k) => s.step(async () => {
            gSnd[k]();
            for (const i of grp) { s.show(cards[i], "up"); await s.wait(260); }
            s.say(grp.map(i => data[i][0].replace(/[„“…]/g, "")).join(". "));
          }));
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Drei Märchen unter der Lupe",
        say: "Wir schauen uns drei Märchen der Brüder Grimm an und suchen die Merkmale.",
        build(s) {
          const PS = { w: 420, h: 420, cls: "later", style: { position: "absolute", left: "0", top: "0" } };
          const pics = {
            hg: s.photo("haensel-gretel", Object.assign({ pos: "50% 45%", caption: "„Knusper, knusper, Knäuschen …“" }, PS)),
            rk: s.photo("rotkaeppchen", Object.assign({ pos: "50% 40%", caption: "Rotkäppchen trifft den Wolf." }, PS)),
            rs: s.photo("rumpelstilzchen", Object.assign({ pos: "50% 45%", caption: "Das Männlein am Spinnrad" }, PS)),
          };
          const svg = s.h("div", { style: { position: "relative", width: "420px", height: "420px" } }, ...Object.values(pics));
          const snd = { hg: () => s.sound("birds", { vol: .4, dur: 3 }), rk: () => s.sound("wolf-howl", { vol: .4, dur: 3 }), rs: () => s.sound("magic-chime", { vol: .6 }) };
          const tales = {
            hg: ["Hänsel und Gretel", "KHM 15", [["Ort", "Ein armer Holzhacker wohnt vor einem großen Wald."], ["Gut gegen Böse", "Die Geschwister gegen die Hexe."], ["Wunder", "Ein Haus aus Brot, mit Kuchen gedeckt, die Fenster aus Zucker."], ["Tiere helfen", "Eine weiße Ente trägt die Kinder übers Wasser."], ["Ende", "Die Kinder kommen glücklich nach Hause."]]],
            rk: ["Rotkäppchen", "KHM 26", [["Anfang", "„Es war einmal …“"], ["Tiere sprechen", "Der Wolf redet mit Rotkäppchen und lockt es vom Weg."], ["Gut gegen Böse", "Rotkäppchen und die Großmutter gegen den Wolf."], ["Wunder", "Beide kommen lebendig aus dem Bauch des Wolfes."], ["Ende", "Der Jäger rettet sie. Der Wolf ist besiegt."]]],
            rs: ["Rumpelstilzchen", "KHM 55", [["Anfang", "„Es war einmal ein Müller …“"], ["Zauber", "Ein Männlein spinnt Stroh zu Gold."], ["Zahl 3", "Dreimal spinnt es, drei Tage hat die Königin Zeit."], ["Gut gegen Böse", "Die Königin will ihr Kind behalten."], ["Ende", "Sie errät den Namen und behält ihr Kind."]]],
          };
          const titleEl = s.h("p", { class: "h2", style: { color: P.unit } }, "");
          const list = s.h("div", { class: "stack", style: { gap: "14px" } });
          let curT = null;
          const show = async k => {
            if (curT === k) return; curT = k; s.sfx.whoosh();
            Object.entries(btns).forEach(([kk, b]) => b.classList.toggle("solid", kk === k));
            Object.entries(pics).forEach(([kk, ph]) => { if (kk !== k) s.hide(ph); }); s.show(pics[k], "zoom"); snd[k]();
            const [t, khm, rows] = tales[k];
            titleEl.replaceChildren(t + " ", s.h("span", { class: "small pencil" }, "(" + khm + ")"));
            list.replaceChildren(...rows.map(([a, b]) => s.h("div", { class: "a-left", style: { display: "grid", gridTemplateColumns: "170px 1fr", gap: "12px", alignItems: "baseline" } },
              s.h("span", { class: "chip", style: { justifyContent: "center" } }, a), s.h("p", { class: "small", style: { fontSize: "22px" } }, b))));
            [...list.children].forEach((c, i) => c.style.setProperty("--d", i * 110 + "ms"));
            s.say(t);
          };
          const btns = {};
          Object.keys(tales).forEach(k => (btns[k] = s.h("button", { class: "btn", onclick: () => show(k) }, tales[k][0])));
          const extra = later(s.h("div", { class: "card soft" }, s.h("p", { class: "small" }, "Das Männchen singt: ", s.h("i", null, "„ach, wie gut ist, dass niemand weiß, dass ich Rumpelstilzchen heiß!“"))));
          s.add(root(s, "stack", { gap: "14px" }, s.h("div", { class: "row", style: { gap: "12px" } }, ...Object.values(btns)),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "420px 1fr", gap: "24px", alignItems: "start" } }, svg, s.h("div", { class: "stack", style: { gap: "12px" } }, titleEl, list, extra))));
          show("hg");
          s.step(() => show("rk"));
          s.step(async () => { await show("rs"); });
          s.step(async () => { s.sfx.ding(); await s.show(extra, "up"); read(s, "Ach, wie gut ist, dass niemand weiß, dass ich Rumpelstilzchen heiß!"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Zauberzahlen: 3, 7, 12",
        say: "In Märchen kommen bestimmte Zahlen immer wieder vor: drei, sieben und zwölf.",
        build(s) {
          const col = (num, color, n, mk, caption) => {
            const big = s.h("p", { class: "huge mono", style: { color, textAlign: "center" } }, "0");
            const box = s.svg(320, 150); box.style.width = "100%"; box.style.height = "auto";
            const objs = Array.from({ length: n }, (_, i) => later(mk(i)));
            box.append(...objs);
            const cap = later(s.h("p", { class: "small", style: { fontSize: "20px", textAlign: "center" } }, ...caption));
            const c = s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" } }, big, box, cap);
            c.run = async () => {
              for (let i = 0; i < n; i++) { if (!s.alive) return; s.show(objs[i], "pop"); s.sfx.count(i); big.textContent = String(i + 1); pulseOnce(big); await s.wait(n > 8 ? 130 : 230); }
              big.textContent = String(n); await s.show(cap, "up");
            };
            return c;
          };
          const moon = i => { const x = 60 + i * 100; return s.el("g", null, s.el("circle", { cx: x, cy: 70, r: 34, fill: P.gold }), s.el("circle", { cx: x + 16, cy: 60, r: 30, fill: "#fff" })); };
          const hat = i => { const x = 30 + (i % 4) * 86, y = i < 4 ? 60 : 130; return s.el("g", null, s.el("path", { d: `M${x - 22} ${y} L${x} ${y - 52} L${x + 22} ${y} Z`, fill: [P.red, P.blue, P.green, P.orange, P.violet, P.gold, "#c2185b"][i] }), s.el("rect", { x: x - 26, y: y - 2, width: 52, height: 9, rx: 4, fill: "#8a5a2b" })); };
          const plate = i => { const x = 34 + (i % 6) * 51, y = i < 6 ? 40 : 108; return s.el("g", null, s.el("ellipse", { cx: x, cy: y, rx: 23, ry: 23, fill: P.gold, stroke: "#a87a00", "stroke-width": 3 }), s.el("ellipse", { cx: x, cy: y, rx: 13, ry: 13, fill: "none", stroke: "#fff3b0", "stroke-width": 3 })); };
          const c3 = col(3, P.red, 3, moon, ["Rumpelstilzchen spinnt ", B(s, "dreimal"), " Gold. Die Königin hat ", B(s, "drei Tage"), " Zeit."]);
          const c7 = col(7, P.blue, 7, hat, [B(s, "Sieben"), " Zwerge bei Schneewittchen, ", B(s, "sieben"), " Geißlein beim Wolf."]);
          const c12 = col(12, P.green, 12, plate, ["Dornröschen: Der König hat nur ", B(s, "zwölf"), " goldene Teller. Die ", B(s, "dreizehnte"), " weise Frau wird wütend!"]);
          const lf = later(life(s, null, s.h("p", { class: "small", style: { fontSize: "20px" } }, "„Aller guten Dinge sind drei!“ Die Woche hat 7 Tage, das Jahr hat 12 Monate. Diese Zahlen kennt jeder – darum merkt man sie sich so gut.")));
          s.add(root(s, "stack", { gap: "16px" }, s.h("div", { class: "cols3" }, c3, c7, c12), lf));
          s.sfx.pop();
          s.step(async () => { await c3.run(); s.say("Drei. Rumpelstilzchen."); });
          s.step(async () => { await c7.run(); s.say("Sieben. Die sieben Zwerge."); });
          s.step(async () => { await c12.run(); s.sfx.error(); s.say("Zwölf. Und die dreizehnte weise Frau wird wütend."); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Die Brüder Grimm",
        say: "Jacob und Wilhelm Grimm haben Märchen gesammelt und aufgeschrieben. Später lebten sie in Berlin.",
        build(s) {
          const ev = [
            ["1785/86", "Jacob und Wilhelm werden in Hanau geboren.", P.pencil],
            ["Kassel", "Sie leben in Kassel und sammeln Märchen. Viele Märchen erzählten ihnen Frauen aus Kassel.", P.orange],
            ["1812", "Am 20. Dezember erscheint Band 1 der „Kinder- und Hausmärchen“.", P.red],
            ["1815", "Band 2 erscheint.", P.red],
            ["1840", "Der preußische König holt die Brüder nach Berlin.", P.blue],
            ["1857", "Letzte Ausgabe zu ihren Lebzeiten: 210 Texte.", P.green],
            ["1859/63", "Wilhelm und Jacob sterben in Berlin.", P.pencil],
          ];
          const rows = ev.map(([y, t, c]) => later(s.h("div", { style: { display: "grid", gridTemplateColumns: "120px 26px 1fr", gap: "12px", alignItems: "center" } },
            s.h("b", { style: { font: "800 26px/1 var(--f-display)", color: c, textAlign: "right" } }, y),
            s.h("span", { style: { width: "22px", height: "22px", borderRadius: "50%", background: c, border: "4px solid #fff", boxShadow: `0 0 0 2px ${c}`, zIndex: 1 } }),
            s.h("p", { class: "t", style: { fontSize: "23px" } }, t))));
          const line = s.h("div", { style: { position: "absolute", left: "143px", top: "10px", bottom: "10px", width: "4px", background: P.line, borderRadius: "2px", transformOrigin: "top", transform: "scaleY(0)" } });
          const tl = s.h("div", { class: "stack", style: { gap: "26px", position: "relative", paddingTop: "8px" } }, line, ...rows);
          const portrait = s.photo("brueder-grimm", { w: 190, h: 250, pos: "50% 30%", caption: "Wilhelm und Jacob" });
          const book = s.photo("khm-1812", { w: 190, h: 250, fit: "contain", style: { background: "#fff" }, caption: "Band 1, 1812" });
          const bookC = later(s.h("div", { style: { display: "grid", gridTemplateColumns: "190px 190px", gap: "12px", justifyContent: "center" } }, portrait, book));
          const lf = later(life(s, null, s.h("p", { class: "small", style: { fontSize: "20px" } }, "Die Gräber der Brüder Grimm liegen in Berlin-Schöneberg, auf dem Alten St.-Matthäus-Kirchhof. Ihre Märchen gibt es heute als Film, Hörspiel und Theater.")));
          const extra = later(s.h("div", { class: "card soft" }, s.h("p", { class: "small", style: { fontSize: "20px" } }, "Ab 1838 arbeiteten sie auch am ", B(s, "Deutschen Wörterbuch"), " – einem riesigen Wörterbuch der deutschen Sprache.")));
          s.add(root(s, "cols", { gridTemplateColumns: "1.25fr .75fr", gap: "24px", alignItems: "start" }, tl, s.h("div", { class: "stack", style: { gap: "14px" } }, bookC, extra, lf)));
          s.sfx.whoosh();
          s.tween({ from: 0, to: 1, dur: 900, update: v => (line.style.transform = `scaleY(${v})`) });
          s.step(async () => { for (const i of [0, 1]) { s.sfx.count(i); await s.show(rows[i], "left"); } s.say("Geboren in Hanau, Märchen gesammelt in Kassel."); });
          s.step(async () => { for (const i of [2, 3]) { s.sfx.count(i); await s.show(rows[i], "left"); } s.sound("page-turn-3"); s.sfx.fanfare(); await s.show(bookC, "zoom"); s.say("Achtzehnhundertzwölf erscheinen die Kinder- und Hausmärchen."); });
          s.step(async () => { for (const i of [4, 5, 6]) { s.sfx.count(i); await s.show(rows[i], "left"); } s.show(extra, "up"); s.say("Ab achtzehnhundertvierzig lebten die Brüder in Berlin."); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Was ist eine Fabel?",
        say: "In Fabeln handeln und sprechen Tiere wie Menschen. Am Ende steht eine Lehre.",
        build(s) {
          const animals = [["🦊", "Fuchs", "schlau und listig"], ["🦁", "Löwe", "stark und stolz"], ["🐺", "Wolf", "gierig und gefährlich"], ["🐑", "Lamm", "schwach und unschuldig"], ["🐜", "Ameise", "fleißig"], ["🐦", "Rabe", "eitel"]];
          const SND = { Fuchs: () => s.sound("fox-bark", { vol: .6 }), Löwe: () => s.sound("lion-roar", { vol: .5 }), Wolf: () => s.sound("wolf-howl", { vol: .5, dur: 3 }), Lamm: () => s.sound("sheep", { vol: .6 }), Rabe: () => s.sound("raven", { vol: .6, dur: 2 }) };
          const cards = animals.map(([e, n, t]) => {
            const front = s.h("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" } }, s.h("span", { style: { fontSize: "44px", lineHeight: 1 } }, e), s.h("b", { style: { fontSize: "21px" } }, n));
            const back = s.h("div", { style: { display: "none", flexDirection: "column", alignItems: "center", gap: "4px", textAlign: "center" } }, s.h("b", { style: { fontSize: "21px", color: P.unit } }, n), s.h("span", { class: "small" }, t));
            const c = s.h("div", { class: "card", style: { height: "120px", display: "grid", placeItems: "center", cursor: "pointer", padding: "8px" } }, front, back);
            c.st = 0;
            c.flip = async () => {
              await s.tween({ from: 1, to: 0, dur: 160, update: v => (c.style.transform = `scaleX(${v})`) });
              c.st = 1 - c.st; front.style.display = c.st ? "none" : "flex"; back.style.display = c.st ? "flex" : "none"; c.style.background = c.st ? P.soft : "#fff"; s.sfx.snap();
              await s.tween({ from: 0, to: 1, dur: 180, update: v => (c.style.transform = `scaleX(${v})`) });
            };
            c.addEventListener("click", () => { if (!c.st && SND[n]) SND[n](); c.flip(); });
            return c;
          });
          const parts = [["Ausgangslage", "Wer trifft wen, wo?"], ["Konflikt", "Rede und Gegenrede"], ["Lösung", "Einer ist schlauer"], ["Lehre", "Was lernen wir?"]];
          const chain = parts.map(([a, b], i) => later(s.h("div", { style: { display: "grid", gridTemplateColumns: "46px 1fr", gap: "12px", alignItems: "center" } },
            s.h("span", { style: { width: "44px", height: "44px", borderRadius: "12px", background: i === 3 ? P.yellow : P.unit, color: i === 3 ? P.ink : "#fff", display: "grid", placeItems: "center", font: "800 22px var(--f-display)" } }, String(i + 1)),
            s.h("p", { class: "t", style: { fontSize: "22px" } }, B(s, a + ": "), b))));
          const m = later(merk(s, { style: { fontSize: "22px" } }, "Eine Fabel ist ", B(s, "kurz"), ". ", B(s, "Tiere"), " zeigen menschliche Eigenschaften. Am Ende steht eine ", B(s, "Lehre"), " (Moral)."));
          const lf5 = later(life(s, null, s.h("p", { class: "small", style: { fontSize: "20px" } }, "Wir sagen heute noch „schlau wie ein Fuchs“, „stark wie ein Löwe“ oder „fleißig wie eine Ameise“ – genau so zeigen die Tiere in Fabeln ihren Charakter.")));
          s.add(root(s, "stack", { gap: "16px" }, s.h("div", { class: "cols", style: { gridTemplateColumns: "1.05fr .95fr", gap: "24px" } },
            s.h("div", { class: "stack", style: { gap: "10px" } }, s.h("p", { class: "h2", style: { fontSize: "24px" } }, "Tiere wie Menschen – tippe und hör!"), s.h("div", { class: "cols3", style: { gap: "12px" } }, ...cards)),
            s.h("div", { class: "stack", style: { gap: "14px" } }, s.h("p", { class: "h2", style: { fontSize: "24px" } }, "So ist eine Fabel gebaut"), ...chain)), m, lf5));
          cards.forEach((c, i) => { c.classList.add("a-pop"); c.style.setProperty("--d", i * 80 + "ms"); });
          s.sfx.pop();
          s.step(async () => { for (const c of cards.slice(0, 3)) { c.flip(); await s.wait(250); } s.say("Der Fuchs ist listig, der Löwe stark, der Wolf gierig."); });
          s.step(async () => { for (const c of cards.slice(3)) { c.flip(); await s.wait(250); } s.say("Das Lamm ist schwach, die Ameise fleißig, der Rabe eitel."); });
          s.step(async () => { for (const [i, c] of chain.entries()) { s.sfx.count(i); await s.show(c, "left"); } });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(lf5, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Der Fuchs und der Rabe",
        say: "Eine der bekanntesten Fabeln: Der Fuchs und der Rabe. Schau, was passiert!",
        build(s) {
          const svg = s.svg(600, 470);
          svg.append(s.el("rect", { x: 0, y: 0, width: 600, height: 470, rx: 18, fill: "#e6f3fa" }), s.el("rect", { x: 0, y: 400, width: 600, height: 70, fill: "#9ed49a" }),
            s.el("rect", { x: 430, y: 120, width: 44, height: 285, fill: "#8a5a2b" }),
            s.el("path", { d: "M440 236 Q350 220 250 222", stroke: "#8a5a2b", "stroke-width": 16, fill: "none", "stroke-linecap": "round" }),
            s.el("circle", { cx: 452, cy: 96, r: 90, fill: "#4caf6a" }), s.el("circle", { cx: 520, cy: 150, r: 60, fill: "#3f9c5c" }), s.el("circle", { cx: 380, cy: 140, r: 54, fill: "#3f9c5c" }));
          // raven sitting on the branch at (300, 214)
          const lowerBeak = s.el("path", { d: "M40 -14 L60 -12 L41 -8 Z", fill: "#3a3a3a" });
          const raven = s.el("g", { transform: "translate(300 196)" },
            s.el("path", { d: "M-28 4 L-64 20 L-30 16 Z", fill: "#1d1d24" }),
            s.el("ellipse", { cx: 0, cy: 0, rx: 36, ry: 22, fill: "#1d1d24", transform: "rotate(-12)" }),
            s.el("circle", { cx: 28, cy: -18, r: 16, fill: "#1d1d24" }),
            s.el("circle", { cx: 33, cy: -22, r: 4.5, fill: "#fff" }), s.el("circle", { cx: 34, cy: -22, r: 2, fill: "#000" }),
            s.el("path", { d: "M40 -24 L64 -18 L40 -14 Z", fill: "#3a3a3a" }), lowerBeak,
            s.el("path", { d: "M-6 20 v12 M8 20 v12", stroke: "#e0a800", "stroke-width": 3 }));
          const cheese = s.el("g", { transform: "translate(0 0)" }, s.el("path", { d: "M356 178 L384 190 L356 200 Z", fill: P.yellow, stroke: "#c99a00", "stroke-width": 2 }), s.el("circle", { cx: 364, cy: 189, r: 3, fill: "#e8b800" }));
          const fox = s.el("g", { transform: "translate(-160 0)" },
            s.el("ellipse", { cx: 120, cy: 360, rx: 34, ry: 16, fill: "#e8732a", transform: "rotate(-25 120 360)" }), s.el("ellipse", { cx: 92, cy: 374, rx: 10, ry: 8, fill: "#fff" }),
            s.el("ellipse", { cx: 190, cy: 360, rx: 58, ry: 26, fill: "#e8732a" }),
            s.el("path", { d: "M160 380 v26 M178 382 v24 M214 382 v24 M232 380 v26", stroke: "#b5541a", "stroke-width": 8, "stroke-linecap": "round" }),
            s.el("circle", { cx: 244, cy: 320, r: 26, fill: "#e8732a" }),
            s.el("path", { d: "M228 302 L226 270 L246 296 Z M252 298 L266 270 L268 304 Z", fill: "#e8732a" }),
            s.el("path", { d: "M262 318 L292 300 L268 334 Z", fill: "#e8732a" }), s.el("circle", { cx: 292, cy: 300, r: 4, fill: P.ink }),
            s.el("path", { d: "M244 330 Q256 346 270 334 L262 318 Z", fill: "#fff" }),
            s.el("circle", { cx: 250, cy: 312, r: 3.5, fill: P.ink }));
          const bubble = later(s.el("g", null, s.el("rect", { x: 14, y: 16, width: 270, height: 100, rx: 22, fill: "#fff", stroke: P.pencil, "stroke-width": 2 }), s.el("path", { d: "M150 116 L120 150 L180 116 Z", fill: "#fff", stroke: P.pencil, "stroke-width": 2 }), s.el("rect", { x: 140, y: 110, width: 44, height: 8, fill: "#fff" }),
            T(s, 149, 50, "Was für ein prächtiger", { "font-size": 20, fill: "#b5541a" }), T(s, 149, 76, "Vogel! Sing doch etwas", { "font-size": 20, fill: "#b5541a" }), T(s, 149, 102, "für mich!", { "font-size": 20, fill: "#b5541a" })));
          const kraah = later(fb(T(s, 190, 150, "Kraaah!", { "font-size": 34, fill: P.ink, "font-weight": 800 })));
          svg.append(raven, cheese, fox, bubble, kraah);
          const lines = [
            "Ein Rabe hatte ein Stück Käse gefunden. Stolz setzte er sich damit auf einen Ast.",
            "Ein hungriger Fuchs sah ihn und wollte den Käse haben. Er hatte eine Idee.",
            "„Was für ein prächtiger Vogel!“, rief er. „Sicher singst du auch wunderschön.“",
            "Geschmeichelt öffnete der Rabe den Schnabel und krächzte. Der Käse fiel hinunter, und der Fuchs schnappte ihn sich.",
          ];
          const ls = lines.map((l, i) => (i === 0 ? s.h("p", { class: "small", style: { fontSize: "21px" } }, l) : later(s.h("p", { class: "small", style: { fontSize: "21px" } }, l))));
          const lehre = later(merk(s, { style: { fontSize: "22px" } }, "Lehre: Wer gern ", B(s, "Schmeicheleien"), " glaubt, wird leicht hereingelegt."));
          const btn = later(readBtn(s, "Fabel vorlesen", () => lines.join(" ") + " Die Lehre: Wer gern Schmeicheleien glaubt, wird leicht hereingelegt."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "600px 1fr", gap: "22px", alignItems: "start" }, svg, s.h("div", { class: "stack", style: { gap: "12px" } }, ...ls, lehre, btn)));
          s.sfx.pop();
          s.step(async () => {
            s.show(ls[1], "left"); s.sfx.whoosh();
            await s.tween({ from: -160, to: 0, dur: 1100, ease: "out", update: v => fox.setAttribute("transform", `translate(${v} 0)`) });
          });
          s.step(async () => { s.sfx.pop(); s.show(ls[2], "left"); await s.show(bubble, "zoom"); s.say("Was für ein prächtiger Vogel! Sing doch etwas für mich!"); });
          s.step(async () => {
            s.show(ls[3], "left"); s.hide(bubble);
            await s.tween({ from: 0, to: 32, dur: 200, update: v => lowerBeak.setAttribute("transform", `rotate(${v} 40 -14)`) });
            s.sound("raven", { vol: .7, dur: 2 }); s.show(kraah, "pop");
            await s.tween({ from: 0, to: 1, dur: 900, ease: "in", update: t => cheese.setAttribute("transform", `translate(${-92 * t} ${118 * t}) rotate(${200 * t} 370 190)`) });
            s.sfx.snap(); s.sfx.coin();
          });
          s.step(async () => { s.sfx.ding(); await s.show(lehre, "up"); s.show(btn, "pop"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Die Grille und die Ameise",
        say: "Im Sommer arbeitet die Ameise, die Grille macht Musik. Und dann kommt der Winter.",
        build(s) {
          const svg = s.svg(600, 430);
          const sky = s.el("rect", { x: 0, y: 0, width: 600, height: 430, rx: 18, fill: "#cfe9ff" });
          const ground = s.el("rect", { x: 0, y: 330, width: 600, height: 100, fill: "#8fd18a" });
          const sun = s.el("circle", { cx: 520, cy: 70, r: 40, fill: P.yellow });
          const hill = s.el("path", { d: "M430 334 Q500 220 580 334 Z", fill: "#a0703c" });
          const door = s.el("path", { d: "M490 334 v-36 a14 14 0 0 1 28 0 v36 Z", fill: "#5a3a18" });
          const counter = T(s, 505, 380, "Vorrat: 0 Körner", { "font-size": 19, fill: P.ink });
          const ant = s.el("g", { transform: "translate(250 322)" }, s.el("circle", { cx: -10, cy: 0, r: 6, fill: "#1b1b1b" }), s.el("circle", { cx: 2, cy: -1, r: 5, fill: "#1b1b1b" }), s.el("circle", { cx: 12, cy: -3, r: 5, fill: "#1b1b1b" }),
            s.el("path", { d: "M-4 2 l-6 8 M2 3 l0 9 M8 2 l6 8", stroke: "#1b1b1b", "stroke-width": 2 }), s.el("ellipse", { cx: 2, cy: -12, rx: 7, ry: 5, fill: "#e8c26a" }));
          const grains = s.el("g", null, ...[[220, 326], [232, 322], [210, 320], [244, 327], [226, 316]].map(([x, y]) => s.el("ellipse", { cx: x, cy: y, rx: 6, ry: 4, fill: "#e8c26a" })));
          const cricket = s.el("g", { transform: "translate(110 300)" },
            s.el("ellipse", { cx: 0, cy: 0, rx: 40, ry: 16, fill: "#5aa02c" }), s.el("circle", { cx: 40, cy: -8, r: 13, fill: "#5aa02c" }),
            s.el("path", { d: "M46 -18 Q70 -60 90 -50 M42 -20 Q56 -66 76 -70", stroke: "#3c7a1c", "stroke-width": 2.5, fill: "none" }),
            s.el("path", { d: "M-10 10 L-30 34 M10 12 L18 34 M-28 -6 L-56 -40 L-40 30", stroke: "#3c7a1c", "stroke-width": 4, fill: "none", "stroke-linejoin": "round" }),
            s.el("circle", { cx: 45, cy: -11, r: 3, fill: "#000" }),
            s.el("g", { transform: "translate(8 -28) rotate(-30)" }, s.el("ellipse", { cx: 0, cy: 0, rx: 16, ry: 8, fill: "#a2561c" }), s.el("rect", { x: 14, y: -2, width: 22, height: 4, fill: "#5a2e0c" })),
            s.el("line", { x1: -14, y1: -50, x2: 34, y2: -8, stroke: "#7a4a1c", "stroke-width": 2.5 }));
          const notes = ["♪", "♫", "♪"].map((n, i) => s.el("text", { x: 150 + i * 40, y: 220 - i * 26, "font-size": 34, fill: P.violet, text: n }));
          const flakes = s.el("g", { opacity: 0 }, ...Array.from({ length: 46 }, (_, i) => s.el("circle", { cx: (i * 137) % 600, cy: (i * 89) % 330, r: 3 + (i % 3), fill: "#fff" })));
          svg.append(sky, sun, ground, hill, door, grains, ant, cricket, ...notes, flakes, counter);
          const mix = (a, b, t) => { const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16)); return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, "0")).join(""); };
          let season = 0, stored = 0;
          const apply = v => {
            season = v; const t = v / 2;
            sky.setAttribute("fill", mix("#cfe9ff", "#c7ced8", t)); ground.setAttribute("fill", t < .5 ? mix("#8fd18a", "#c8a85c", t * 2) : mix("#c8a85c", "#f4f7fb", (t - .5) * 2));
            sun.setAttribute("opacity", 1 - t * .8); flakes.setAttribute("opacity", t > .75 ? 1 : 0);
            notes.forEach(n => n.setAttribute("opacity", v === 0 ? 1 : 0)); grains.setAttribute("opacity", v === 2 ? 0 : 1);
            cricket.setAttribute("transform", v === 2 ? "translate(400 316)" : "translate(110 300)");
            cricket.classList.toggle("a-shake", v === 2); cricket.style.animationIterationCount = "infinite";
            ant.setAttribute("opacity", v === 2 ? 0 : 1);
            if (v === 2) { stored = Math.max(stored, 12); counter.textContent = "Vorrat: " + stored + " Körner"; }
          };
          const names = ["Sommer", "Herbst", "Winter"];
          const sl = s.slider({ label: "Jahreszeit", min: 0, max: 2, value: 0, fmt: v => names[v], onInput: v => { apply(v); s.sfx.whoosh(); } });
          // animation: ant carries grains in summer/autumn, snow falls in winter, notes float
          let ax = 250, dir = 1;
          s.loop((t, dt) => {
            if (season < 2) {
              ax += dir * 70 * dt; if (ax > 476) { dir = -1; stored++; counter.textContent = "Vorrat: " + stored + " Körner"; s.sfx.tick(); } if (ax < 240) dir = 1;
              ant.setAttribute("transform", `translate(${ax} 322) scale(${dir} 1)`);
            }
            if (season === 0) notes.forEach((n, i) => n.setAttribute("transform", `translate(0 ${-((t * 30 + i * 30) % 60)})`));
            if (season === 2) [...flakes.children].forEach((f, i) => f.setAttribute("cy", (((i * 89) + t * (40 + i % 5 * 12)) % 340)));
          });
          const L = (t) => later(s.h("p", { class: "small", style: { fontSize: "21px" } }, t));
          const l1 = s.h("p", { class: "small", style: { fontSize: "21px" } }, "Den ganzen Sommer schleppte die Ameise Körner in ihren Bau. Die Grille saß in der Sonne und spielte Geige.");
          const l2 = L("Dann kam der Winter. Die Grille fror und hatte Hunger. Sie klopfte bei der Ameise an.");
          const l3 = later(s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", gap: "6px", padding: "12px 16px" } },
            s.h("p", { class: "small", style: { fontSize: "20px" } }, "„Gibst du mir etwas ab?“, bat die Grille."),
            s.h("p", { class: "small", style: { fontSize: "20px" } }, "„Was hast du im Sommer gemacht?“, fragte die Ameise."),
            s.h("p", { class: "small", style: { fontSize: "20px" } }, "„Ich habe Musik gemacht.“ – „Dann tanz doch jetzt!“")));
          const lehre = later(merk(s, { style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Lehre: Sorge ", B(s, "rechtzeitig"), " vor!"));
          const lf = later(life(s, { style: { padding: "12px 16px" } }, s.h("p", { class: "small" }, "Für die Klassenarbeit lernst du besser früh – nicht erst am Abend vorher.")));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "600px 1fr", gap: "22px", alignItems: "start" },
            s.h("div", { class: "stack", style: { gap: "8px" } }, svg, sl), s.h("div", { class: "stack", style: { gap: "12px" } }, l1, l2, l3, lehre, lf)));
          apply(0);
          s.sfx.pop();
          s.sound("cricket", { vol: .5 });
          s.step(async () => { s.say("Im Sommer: Die Ameise arbeitet, die Grille spielt Geige."); s.sound("geige", { vol: .5 }); });
          s.step(async () => { sl.set(1); await s.wait(700); sl.set(2); s.sound("wind", { vol: .45, dur: 3 }); await s.show(l2, "left"); s.say("Dann kam der Winter."); await s.wait(900); s.sound("knock", { vol: .6 }); });
          s.step(async () => { s.sfx.pop(); await s.show(l3, "up"); s.say("Was hast du im Sommer gemacht? Dann tanz doch jetzt!"); });
          s.step(async () => { s.sfx.ding(); await s.show(lehre, "up"); s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Eine Fabel, drei Dichter",
        say: "Die Fabel vom Fuchs und vom Raben ist uralt. Drei berühmte Dichter haben sie erzählt, und einer hat das Ende verändert.",
        build(s) {
          const poets = [
            ["Äsop", "Griechenland", "lebte wahrscheinlich im 6. Jahrhundert vor Christus", "Seine Fabeln wurden lange nur weitererzählt. Der Fuchs bekommt die Beute.", P.orange],
            ["Jean de La Fontaine", "Frankreich · 1621–1695", "Fabeln in Versen, ab 1668", "Der Rabe hat einen Käse. Der Fuchs bekommt ihn mit einem Trick.", P.blue],
            ["Gotthold Ephraim Lessing", "Deutschland · 1729–1781", "Fabeln, 1759", "Hier ist das Fleisch vergiftet! Der Fuchs frisst es – und stirbt.", P.red],
          ];
          const arrow = s.svg(1100, 60);
          const arrowLine = s.el("path", { d: "M20 30 H1060", stroke: P.unit, "stroke-width": 6, "stroke-linecap": "round" });
          arrow.append(arrowLine, s.el("path", { d: "M1050 16 L1080 30 L1050 44 Z", fill: P.unit }));
          const dots = [183, 550, 917].map((x, i) => later(s.el("g", null, s.el("circle", { cx: x, cy: 30, r: 13, fill: poets[i][4], stroke: "#fff", "stroke-width": 4 }))));
          arrow.append(...dots);
          const faces = [s.photo("aesop", { w: "100%", h: 170, pos: "50% 12%", caption: "gemalt von Velázquez" }), s.photo("la-fontaine", { w: "100%", h: 170, pos: "50% 20%" }), s.photo("lessing", { w: "100%", h: 170, pos: "50% 25%" })];
          const cards = poets.map(([n, land, when, what, c], i) => later(s.h("div", { class: "card", style: { borderTop: `8px solid ${c}`, display: "flex", flexDirection: "column", gap: "8px" } },
            faces[i], s.h("p", { class: "h2", style: { fontSize: "27px", color: c } }, n), s.h("p", { class: "small", style: { fontWeight: 700, fontSize: "21px" } }, land), s.h("p", { class: "small pencil", style: { fontSize: "20px" } }, when),
            s.h("p", { class: "small", style: { fontSize: "22px" } }, what))));
          const lf = later(life(s, null, s.h("div", { class: "cols3", style: { gap: "14px" } },
            s.h("p", { class: "small", style: { fontSize: "21px" } }, B(s, "Grille und Ameise: "), "Erst die Arbeit, dann das Vergnügen."),
            s.h("p", { class: "small", style: { fontSize: "21px" } }, B(s, "Fuchs und Rabe: "), "Wer dir schmeichelt, will oft etwas von dir – wie manche Werbung."),
            s.h("p", { class: "small", style: { fontSize: "21px" } }, B(s, "Löwe und Maus: "), "Auch Kleine können Großen helfen."))));
          s.add(root(s, "stack", { gap: "16px" }, arrow, s.h("div", { class: "cols3" }, ...cards), lf));
          s.sfx.pop();
          poets.forEach((p, i) => s.step(async () => { s.sound("page-turn-2", { vol: .8 }); s.show(dots[i], "pop"); await s.show(cards[i], "up"); s.say(p[0] + ". " + p[3]); if (i === 2) s.sfx.error(); }));
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 8a – Sagen --------------------------------------------------------- */
      {
        title: "Was ist eine Sage?",
        say: "Eine Sage klingt manchmal wie ein Märchen. Aber sie spielt an einem echten Ort und hat einen wahren Kern.",
        build(s) {
          const ic = draw => { const v = s.svg(56, 56); v.style.width = "56px"; v.style.height = "56px"; draw(v); return v; };
          const M = [
            ["Wahrer Kern", "Ein Ort, eine Person oder ein Ereignis hat es wirklich gegeben.", v => v.append(s.el("circle", { cx: 24, cy: 24, r: 16, fill: "#fff", stroke: P.unit, "stroke-width": 4 }), s.el("path", { d: "M36 36 L50 50", stroke: P.unit, "stroke-width": 6, "stroke-linecap": "round" }), s.el("circle", { cx: 24, cy: 24, r: 6, fill: P.gold }))],
            ["Ort und Zeit genannt", "„Auf der Insel Kreta …“, „In Kampehl, vor über 300 Jahren …“", v => v.append(s.el("path", { d: "M28 52 C14 34 10 28 10 20 A18 18 0 0 1 46 20 C46 28 42 34 28 52 Z", fill: P.red }), s.el("circle", { cx: 28, cy: 20, r: 7, fill: "#fff" }))],
            ["Übernatürliches", "Götter, Riesen, Ungeheuer, Geister oder ein Fluch.", v => v.append(s.el("path", { d: "M30 4 L18 30 H28 L22 52 L42 22 H31 L38 4 Z", fill: P.gold, stroke: "#a87a00", "stroke-width": 2, "stroke-linejoin": "round" }))],
            ["Lange weitererzählt", "Erst mündlich, später aufgeschrieben. Man sollte sie glauben.", v => v.append(s.el("path", { d: "M6 10 h32 a4 4 0 0 1 4 4 v16 a4 4 0 0 1 -4 4 h-18 l-8 8 v-8 h-6 a4 4 0 0 1 -4 -4 v-16 a4 4 0 0 1 4 -4 z", fill: P.unit }), s.el("path", { d: "M50 24 h-4 a3 3 0 0 0 -3 3 v12 a3 3 0 0 0 3 3 h2 v6 l6 -6", fill: "none", stroke: P.unit, "stroke-width": 3 }))],
          ];
          const cards = M.map(([t, d, draw]) => later(s.h("div", { class: "card", style: { display: "grid", gridTemplateColumns: "56px 1fr", gap: "14px", alignItems: "center", padding: "12px 16px" } }, ic(draw),
            s.h("div", null, s.h("p", { class: "h2", style: { fontSize: "24px", color: P.unit } }, t), s.h("p", { class: "small", style: { fontSize: "20px" } }, d)))));
          const ROWS = [["Anfang", "„Es war einmal …“", "„Vor langer Zeit in Lübbenau …“"], ["Ort", "irgendwo, im Wald", "genannt: Kreta, Spreewald"], ["Wahr?", "ausgedacht", "mit wahrem Kern"], ["Ende", "meist glücklich", "oft ernst oder traurig"]];
          const head = s.h("div", { style: { display: "grid", gridTemplateColumns: "92px 1fr 1fr", gap: "8px", paddingBottom: "6px", borderBottom: "3px solid " + P.unit } }, s.h("span"), B(s, "Märchen", P.violet), B(s, "Sage", P.unit));
          const trs = ROWS.map(([a, b, c]) => later(s.h("div", { style: { display: "grid", gridTemplateColumns: "92px 1fr 1fr", gap: "8px", alignItems: "center", padding: "7px 0", borderBottom: "2px solid " + P.line } },
            s.h("b", { style: { fontSize: "19px", color: P.pencil } }, a), s.h("span", { style: { fontSize: "20px", color: P.violet } }, b), s.h("span", { style: { fontSize: "20px", color: P.unit, fontWeight: 700 } }, c))));
          const tab = later(s.h("div", { class: "card", style: { padding: "12px 16px", display: "flex", flexDirection: "column" } }, head, ...trs));
          const lf = later(life(s, { style: { padding: "10px 16px" } }, s.h("p", { class: "small", style: { fontSize: "20px" } }, "Im Spreewald gibt es Sagen-Kahnfahrten: Beim Fahren durch die Kanäle hörst du die Sagen der Gegend.")));
          const m = later(merk(s, { style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Eine ", B(s, "Sage"), " erzählt von ", B(s, "echten Orten"), " oder Menschen – und mischt Wahres mit ", B(s, "Übernatürlichem"), "."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "1fr 470px", gap: "14px 18px", alignContent: "start" },
            s.h("div", { class: "stack", style: { gap: "12px" } }, ...cards), s.h("div", { class: "stack", style: { gap: "12px" } }, tab, lf), s.h("div", { style: { gridColumn: "1 / 3" } }, m)));
          s.sfx.pop();
          s.step(async () => { s.sound("page-turn-1"); for (const c of cards.slice(0, 2)) { await s.show(c, "left"); await s.wait(200); } s.say("Wahrer Kern. Ort und Zeit werden genannt."); });
          s.step(async () => { s.sound("thunder", { vol: .35, dur: 2, fade: .6 }); for (const c of cards.slice(2)) { await s.show(c, "left"); await s.wait(200); } s.say("Übernatürliches. Und lange weitererzählt."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(tab, "zoom"); for (const [i, r] of trs.entries()) { s.sfx.count(i); await s.show(r, "up"); } });
          s.step(async () => { s.sound("waves", { vol: .35, dur: 2.5, fade: .6 }); await s.show(lf, "up"); s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 8b ---------------------------------------------------------------- */
      {
        title: "Herakles und seine Aufgaben",
        say: "Herakles ist der stärkste Held der griechischen Sagen. Er muss zwölf schwere Aufgaben lösen. Drei davon schauen wir uns an.",
        build(s) {
          const pic = s.photo("herakles-mosaik", { w: 400, h: 300, pos: "50% 50%", caption: "Herakles und der Löwe (römisches Mosaik)" });
          const intro = s.h("div", { class: "card soft", style: { padding: "12px 16px" } }, s.h("p", { class: "small", style: { fontSize: "21px" } }, B(s, "Herakles", P.unit), " – bei den Römern ", B(s, "Herkules"), " – muss König Eurystheus dienen. Der gibt ihm ", B(s, "zwölf"), " Aufgaben, die eigentlich niemand schaffen kann."));
          const T3 = [
            ["1", "Der Löwe von Nemea", "Kein Pfeil dringt durch sein Fell. Herakles ringt ihn mit bloßen Händen nieder. Danach trägt er das Fell wie eine Rüstung.", "Kraft", P.red, () => s.sound("lion-roar", { vol: .45 })],
            ["2", "Die Hydra", "Eine Wasserschlange mit vielen Köpfen. Schlägt er einen ab, wachsen neue nach! Sein Helfer brennt die Hälse aus – nun wächst nichts mehr.", "Teamarbeit", P.green, () => s.sound("snake-hiss", { vol: .5 })],
            ["5", "Der Stall des Augias", "Ein riesiger Stall, seit Jahren nicht ausgemistet. Herakles leitet zwei Flüsse hindurch – an einem einzigen Tag ist alles sauber.", "List", P.blue, () => s.sound("water-pour", { vol: .45, dur: 2 })],
          ];
          const cards = T3.map(([n, t, d, tag, c]) => later(s.h("div", { class: "card", style: { borderLeft: "8px solid " + c, padding: "10px 16px", display: "flex", flexDirection: "column", gap: "4px" } },
            s.h("div", { class: "row", style: { gap: "10px", justifyContent: "space-between", flexWrap: "nowrap" } }, s.h("p", { style: { margin: 0, font: "700 23px/1.2 var(--f-display)", color: c } }, "Aufgabe " + n + ": " + t), s.h("span", { class: "chip", style: { flex: "none" } }, tag)),
            s.h("p", { class: "small", style: { fontSize: "20px" } }, d))));
          const lf = later(life(s, { style: { padding: "10px 16px" } }, s.h("p", { class: "small", style: { fontSize: "20px" } }, "Eine riesige, fast unlösbare Arbeit nennen wir heute noch eine ", B(s, "„Herkulesaufgabe“"), " – zum Beispiel das Kinderzimmer nach einer Geburtstagsparty aufräumen.")));
          const src = s.h("p", { class: "small pencil" }, "Nacherzählt nach Gustav Schwab, „Sagen des klassischen Altertums“ (1838–1840)");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "400px 1fr", gap: "18px", alignItems: "start" },
            s.h("div", { class: "stack", style: { gap: "12px" } }, pic, intro, src), s.h("div", { class: "stack", style: { gap: "12px" } }, ...cards, lf)));
          s.show(pic, "zoom"); s.sfx.whoosh();
          T3.forEach((x, i) => s.step(async () => { x[5](); await s.show(cards[i], "left"); s.say(x[1] + ". " + x[2]); }));
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 8c ---------------------------------------------------------------- */
      {
        title: "Odysseus und der Zyklop",
        say: "Odysseus ist nicht der Stärkste, aber der Schlaueste. Das zeigt sein Abenteuer beim einäugigen Riesen Polyphem.",
        build(s) {
          const pic = s.photo("polyphem-boecklin", { w: "100%", h: 200, pos: "50% 18%", caption: "Arnold Böcklin, 1896: Polyphem schleudert Felsen nach dem Schiff." });
          const PAN = [
            ["Gefangen", "Odysseus und seine Männer sitzen in der Höhle des Riesen Polyphem fest. Der hat nur ein Auge.", () => s.sound("sheep", { vol: .5 })],
            ["„Niemand“", "Odysseus schenkt ihm starken Wein. „Wie heißt du?“, fragt der Riese. „Ich heiße Niemand.“", () => s.sound("glass-clink", { vol: .5 })],
            ["Das Auge", "Als Polyphem schläft, stoßen die Männer einen glühenden Pfahl in sein einziges Auge.", () => s.sound("fire", { vol: .4, dur: 1.6 })],
            ["Die Flucht", "Am Morgen lässt der blinde Riese seine Schafe hinaus. Die Männer klammern sich unter ihre Bäuche.", () => s.sound("footsteps", { vol: .4, dur: 1.6 })],
          ];
          const pans = PAN.map(([t, d], i) => later(s.h("div", { class: "card", style: { padding: "10px 14px", display: "flex", flexDirection: "column", gap: "6px" } },
            s.h("div", { class: "row", style: { gap: "8px", flexWrap: "nowrap" } }, s.h("span", { style: { width: "34px", height: "34px", borderRadius: "50%", background: P.unit, color: "#fff", display: "grid", placeItems: "center", font: "800 19px var(--f-display)", flex: "none" } }, String(i + 1)), s.h("b", { style: { fontSize: "22px", color: P.unit } }, t)),
            s.h("p", { class: "small", style: { fontSize: "20px" } }, d))));
          const cry = "Polyphem schreit: Hilfe! Niemand will mich töten! Die anderen Zyklopen rufen: Wenn dich niemand angreift, dann brauchst du ja keine Hilfe! Und sie gehen wieder schlafen.";
          const btn = later(readBtn(s, "Polyphem ruft um Hilfe", cry, true));
          const joke = later(s.h("div", { class: "card soft", style: { padding: "10px 16px", display: "grid", gridTemplateColumns: "1fr auto", gap: "14px", alignItems: "center" } }, s.h("p", { class: "small", style: { fontSize: "21px" } }, "„Hilfe! ", B(s, "Niemand"), " will mich töten!“ – „Wenn ", B(s, "niemand"), " dich angreift, brauchst du keine Hilfe!“ Der Trick mit dem Namen rettet alle."), btn));
          const m = later(merk(s, { style: { fontSize: "22px", padding: "10px 16px 12px" } }, "Odysseus siegt mit ", B(s, "List"), ", nicht mit Kraft."));
          s.add(root(s, "stack", { gap: "12px" }, pic, s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" } }, ...pans),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 290px", gap: "12px", alignItems: "stretch" } }, joke, m)));
          s.show(pic, "zoom"); s.sound("waves", { vol: .3, dur: 2.5, fade: .7 });
          PAN.forEach((p, i) => s.step(async () => { p[2](); await s.show(pans[i], "up"); s.say(p[1]); }));
          s.step(async () => { s.sfx.boing(); await s.show(joke, "up"); s.show(btn, "pop"); read(s, cry); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 8d ---------------------------------------------------------------- */
      {
        title: "Dädalus und Ikarus",
        say: "Dädalus baut Flügel aus Federn und Wachs. Er warnt seinen Sohn: Flieg nicht zu hoch und nicht zu tief! Probier es mit dem Schieber aus.",
        build(s) {
          const W = 560, H = 360, SEA = 300;
          const v = s.svg(W, H); v.style.width = W + "px"; v.style.height = H + "px";
          v.append(s.el("rect", { x: 0, y: 0, width: W, height: H, rx: 16, fill: "#cfe9ff" }),
            s.el("circle", { cx: 500, cy: 56, r: 64, fill: "#ffe680", opacity: .5 }), s.el("circle", { cx: 500, cy: 56, r: 40, fill: P.yellow }),
            s.el("rect", { x: 0, y: SEA, width: W, height: H - SEA, fill: "#2f7fc0" }),
            s.el("path", { d: `M0 ${SEA} q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0`, fill: "none", stroke: "#fff", "stroke-width": 3, opacity: .7 }),
            s.el("path", { d: `M0 ${SEA} L0 250 Q40 236 70 250 Q100 230 130 262 L150 ${SEA} Z`, fill: "#b9925a" }));
          /* wings made of feathers */
          const mkWing = (dir) => {
            const g = s.el("g", null);
            const fs = [];
            for (let i = 0; i < 6; i++) { const f = s.el("path", { d: `M0 0 Q${dir * (16 + i * 7)} ${-18 - i * 3} ${dir * (30 + i * 9)} ${-6 + i * 4}`, fill: "none", stroke: "#fff", "stroke-width": 7, "stroke-linecap": "round" }); fs.push(f); g.append(f); }
            g.append(s.el("circle", { cx: 0, cy: 0, r: 5, fill: "#e8c26a" }));
            return { g, fs };
          };
          const flyer = (skin, hair, scale) => {
            const L = mkWing(-1), R = mkWing(1);
            const body = s.el("g", null, s.el("ellipse", { cx: 0, cy: 8, rx: 9, ry: 18, fill: skin }), s.el("circle", { cx: 0, cy: -16, r: 9, fill: skin }), s.el("path", { d: "M-9 -20 Q0 -32 9 -20", fill: hair }), s.el("path", { d: "M-5 24 L-8 40 M5 24 L8 40", stroke: skin, "stroke-width": 5, "stroke-linecap": "round" }));
            const g = s.el("g", null, L.g, R.g, body);
            return { g, L, R, scale };
          };
          const dad = flyer("#e8b48a", "#8a96a8", .8), son = flyer("#f6d2b4", "#6b3d17", 1);
          v.append(dad.g, son.g);
          const xs = 270, xd = 160;
          let h = 5, fallen = false, flap = 0, lost = 0, melting = false;
          const yOf = hh => 280 - hh * 24;
          let ySon = yOf(5);
          const place = () => {
            const k = Math.sin(flap) * .35;
            [dad, son].forEach(f => { f.L.g.setAttribute("transform", `rotate(${k * 40})`); f.R.g.setAttribute("transform", `rotate(${-k * 40})`); });
            dad.g.setAttribute("transform", `translate(${xd} ${yOf(5)}) scale(.8)`);
            son.g.setAttribute("transform", `translate(${xs} ${ySon})${fallen ? " rotate(160)" : ""}`);
          };
          const feathers = [...son.L.fs, ...son.R.fs];
          const status = s.h("p", { class: "t", style: { fontSize: "22px", minHeight: "60px", textAlign: "center", margin: 0 } }, "Mittlere Höhe – genau richtig!");
          const setStatus = () => {
            if (fallen) status.textContent = "Ikarus stürzt ins Meer.";
            else if (h >= 8) status.textContent = "Zu nah an der Sonne: Das Wachs schmilzt!";
            else if (h <= 2) status.textContent = "Zu tief: Die Gischt macht die Federn nass und schwer.";
            else status.textContent = "Mittlere Höhe – so hat es Dädalus geraten.";
            feathers.forEach(f => f.setAttribute("stroke", h <= 2 && !fallen ? "#9fb3c8" : "#fff"));
          };
          const dropOne = async () => {
            const f = feathers[lost++]; if (!f) return;
            s.sfx.tick();
            await s.tween({ from: 0, to: 1, dur: s.fast ? 1 : 500, update: t => { f.setAttribute("transform", `translate(${12 * t} ${120 * t})`); f.setAttribute("opacity", 1 - t); } });
          };
          const fall = async () => {
            fallen = true; setStatus(); s.sfx.whoosh();
            const y0 = ySon;
            await s.tween({ from: 0, to: 1, dur: s.fast ? 1 : 1100, ease: "in", update: t => { ySon = y0 + (SEA + 8 - y0) * t; place(); } });
            s.sound("splash", { vol: .6 });
          };
          const melt = async () => {
            if (melting || fallen) return; melting = true;
            while (lost < feathers.length && h >= 8 && s.alive) await dropOne();
            melting = false;
            if (lost >= feathers.length && !fallen) await fall();
          };
          const sl = s.slider({ label: "Flughöhe von Ikarus", min: 1, max: 10, step: 1, value: 5, fmt: x => x >= 8 ? "sehr hoch" : x <= 2 ? "sehr tief" : "mittel", onInput: x => { if (fallen) return; h = x; setStatus(); if (h >= 8) melt(); } });
          const reset = () => { fallen = false; lost = 0; h = 5; sl.set(5); feathers.forEach(f => { f.removeAttribute("transform"); f.setAttribute("opacity", 1); }); setStatus(); s.sfx.pop(); };
          const again = later(s.h("button", { class: "btn", onclick: () => { s.sfx.click(); reset(); } }, "Nochmal fliegen"));
          s.loop((t, dt) => { flap += dt * 9; if (!fallen) { const target = yOf(h); ySon += (target - ySon) * Math.min(1, dt * 4); } place(); });
          place();
          sl.style.width = "100%"; sl.style.boxSizing = "border-box"; sl.style.padding = "0 12px";
          v.append(T(s, xd, yOf(5) - 40, "Dädalus", { "font-size": 19, fill: P.pencil }));
          const left = s.h("div", { class: "card", style: { padding: "10px 12px", display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" } }, v, sl, status, again);
          const story = [
            "Dädalus ist ein berühmter Erfinder. König Minos hält ihn mit seinem Sohn Ikarus auf der Insel Kreta fest.",
            "Dädalus baut Flügel: Er befestigt Federn mit Wachs. „Flieg nicht zu hoch, sonst schmilzt das Wachs. Und nicht zu tief, sonst werden die Federn nass!“",
            "Doch Ikarus fliegt übermütig immer höher – der Sonne entgegen.",
          ];
          const ps = story.map((t, i) => { const p = s.h("p", { class: "small", style: { fontSize: "20px" } }, t); return i ? later(p) : p; });
          const pic = later(s.photo("ikarus-bruegel", { w: "100%", h: 200, pos: "60% 60%", caption: "Gemälde: Wo ist Ikarus? Rechts unten im Wasser!" }));
          const m = later(merk(s, { style: { fontSize: "20px", padding: "10px 16px 12px" } }, "Das Meer dort heißt bis heute ", B(s, "Ikarisches Meer"), ". Die Sage warnt vor ", B(s, "Übermut"), "."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "584px 1fr", gap: "16px", alignItems: "start" }, left, s.h("div", { class: "stack", style: { gap: "10px" } }, ...ps, pic, m)));
          s.sound("wind", { vol: .3, dur: 3, fade: .8 });
          s.step(async () => { s.sfx.pop(); await s.show(ps[1], "left"); s.say("Flieg nicht zu hoch und nicht zu tief!"); });
          s.step(async () => { await s.show(ps[2], "left"); sl.set(10); s.say("Ikarus fliegt immer höher. Das Wachs schmilzt."); await melt(); s.show(again, "pop"); });
          s.step(async () => { s.sound("waves", { vol: .35, dur: 2.5, fade: .6 }); await s.show(pic, "zoom"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 8e ---------------------------------------------------------------- */
      {
        title: "Sagen aus Brandenburg",
        say: "Auch bei uns in Brandenburg gibt es Sagen. Tippe auf den Knopf: Was ist wahr, und was ist sagenhaft?",
        build(s) {
          const OK = "#d4f2e1", SG = "#ece5fb";
          const segs = [];
          const txt = parts => s.h("p", { class: "small", style: { fontSize: "20px", lineHeight: 1.5 } }, ...parts.map(([k, t]) => { if (!k) return t; const e = s.h("span", { style: { borderRadius: "4px", padding: "0 2px", transition: "background .4s" } }, t); e.k = k; segs.push(e); return e; }));
          const kahl = txt([["w", "Ritter Christian Friedrich von Kahlbutz lebte von 1651 bis 1702 in Kampehl bei Neustadt (Dosse)."], [0, " "], ["s", "Er soll einen Schäfer getötet haben. Vor Gericht schwor er: Wenn er der Mörder sei, solle sein Körper nach dem Tod nie verwesen."], [0, " "], ["w", "1794 fand man seinen Sarg – der Körper war nicht verwest. Die Mumie liegt bis heute in der Gruft der Dorfkirche."]]);
          const schl = txt([["s", "Der Schlangenkönig trägt eine goldene Krone. Ein gieriger Kaufmann stahl sie – er wurde reich, aber Lübbenau wurde arm."], [0, " "], ["w", "Im Spreewald leben harmlose Nattern. Viele alte Häuser dort tragen am Giebel gekreuzte Schlangen mit Kronen."]]);
          const pic = s.photo("kampehl-kirche", { w: "100%", h: 190, pos: "50% 60%", caption: "Kampehl: Dorfkirche mit Gruft" });
          /* gable with crowned snakes */
          const g = s.svg(300, 226); g.style.width = "100%"; g.style.height = "226px";
          const house = s.el("g", { transform: "translate(0 30)" });
          g.append(s.el("rect", { x: 0, y: 0, width: 300, height: 226, rx: 14, fill: "#e6f3fa" }), house);
          house.append(
            s.el("path", { d: "M60 196 L60 110 L150 46 L240 110 L240 196 Z", fill: "#c8a074", stroke: "#7a4a1f", "stroke-width": 4 }),
            s.el("path", { d: "M40 124 L150 44 L260 124", fill: "none", stroke: "#7a4a1f", "stroke-width": 10, "stroke-linecap": "round" }),
            s.el("rect", { x: 132, y: 136, width: 36, height: 60, fill: "#7a4a1f" }), s.el("rect", { x: 84, y: 124, width: 30, height: 26, fill: "#fff", stroke: "#7a4a1f", "stroke-width": 3 }), s.el("rect", { x: 186, y: 124, width: 30, height: 26, fill: "#fff", stroke: "#7a4a1f", "stroke-width": 3 }));
          const head = (x, y, dir) => s.el("g", { transform: `translate(${x} ${y}) rotate(${dir * 25})` },
            s.el("ellipse", { cx: 0, cy: 0, rx: 15, ry: 10, fill: "#3c7a1c", stroke: "#24520f", "stroke-width": 2 }),
            s.el("circle", { cx: dir * 6, cy: -2, r: 2.6, fill: "#fff" }),
            s.el("path", { d: `M${dir * 14} 2 l${dir * 9} 2 l${-dir * 3} 2 l${dir * 3} 2`, fill: "none", stroke: P.red, "stroke-width": 2 }),
            s.el("path", { d: "M-11 -8 l2 -14 l5 7 l4 -10 l4 10 l5 -7 l2 14 z", fill: P.gold, stroke: "#a87a00", "stroke-width": 1.5 }));
          const snakes = later(s.el("g", null,
            s.el("path", { d: "M150 46 L196 14", stroke: "#3c7a1c", "stroke-width": 9, "stroke-linecap": "round" }), s.el("path", { d: "M150 46 L104 14", stroke: "#3c7a1c", "stroke-width": 9, "stroke-linecap": "round" }),
            head(204, 12, 1), head(96, 12, -1)));
          house.append(snakes);
          const card = (title, media, body) => s.h("div", { class: "card", style: { padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px" } }, s.h("p", { class: "h2", style: { fontSize: "25px", color: P.unit } }, title), media, body);
          const c1 = card("Ritter Kahlbutz", pic, kahl), c2 = card("Der Schlangenkönig im Spreewald", g, schl);
          let on = false;
          const toggle = async () => { on = !on; s.sfx.click(); for (const e of segs) { e.style.background = on ? (e.k === "w" ? OK : SG) : ""; } if (on) s.sfx.ding(); };
          const key = later(s.h("div", { class: "row", style: { gap: "10px", flexWrap: "nowrap" } }, s.h("span", { class: "chip", style: { background: OK } }, "wahr"), s.h("span", { class: "chip", style: { background: SG } }, "sagenhaft")));
          const btn = s.h("button", { class: "btn solid", onclick: () => toggle() }, "Wahrer Kern?");
          s.add(root(s, "stack", { gap: "12px" }, s.h("div", { class: "cols", style: { gap: "16px", alignItems: "start" } }, c1, c2), s.h("div", { class: "row", style: { gap: "16px", justifyContent: "center" } }, btn, key)));
          s.show([c1, c2], "up"); s.sfx.pop();
          s.step(async () => { s.sound("church-bells", { vol: .3, dur: 2.5, fade: .7 }); pulseOnce(pic); s.say("Ritter Kahlbutz aus Kampehl."); });
          s.step(async () => { s.sound("snake-hiss", { vol: .45 }); await s.show(snakes, "zoom"); s.say("Der Schlangenkönig mit der goldenen Krone."); });
          s.step(async () => { await toggle(); await s.show(key, "pop"); s.say("Grün ist wahr. Lila ist sagenhaft."); });
        },
      },
      /* 8f ---------------------------------------------------------------- */
      {
        title: "Märchen, Sage, Fabel",
        say: "Märchen, Sage und Fabel sind alte Erzählungen. Aber jede hat ihre eigenen Merkmale.",
        build(s) {
          const C3 = [["Märchen", P.violet, "„Es war einmal ein Müller …“"], ["Sage", P.unit, "„In Kampehl lebte einst ein Ritter …“"], ["Fabel", P.orange, "„Ein Rabe saß mit einem Käse auf einem Ast …“"]];
          const heads = C3.map(([n, c, q]) => { const quote = later(s.h("p", { class: "small", style: { fontSize: "20px", fontStyle: "italic", minHeight: "56px" } }, q)); const el = s.h("div", { style: { borderTop: "8px solid " + c, background: "#fff", borderRadius: "12px", padding: "10px 14px", display: "flex", flexDirection: "column", gap: "4px", boxShadow: "0 2px 0 rgba(0,0,0,.06)" } }, s.h("p", { style: { margin: 0, font: "800 27px/1.1 var(--f-display)", color: c } }, n), quote); el.quote = quote; return el; });
          const ROWS = [
            ["Figuren", "Prinzessin, Hexe, Zwerge", "Helden, Riesen, Götter, echte Menschen", "Tiere, die wie Menschen handeln"],
            ["Ort, Zeit", "unbestimmt", "genannt", "unwichtig"],
            ["Wahr?", "nein", "wahrer Kern", "nein"],
            ["Will …", "unterhalten: Das Gute siegt", "erklären, warnen, erinnern", "eine Lehre geben"],
            ["Beispiel", "Rotkäppchen", "Dädalus und Ikarus", "Der Fuchs und der Rabe"],
          ];
          const rows = ROWS.map(([a, ...cells]) => later(s.h("div", { style: { display: "grid", gridTemplateColumns: "130px 1fr 1fr 1fr", gap: "12px", alignItems: "center", padding: "12px 0", borderBottom: "2px solid " + P.line } },
            s.h("b", { style: { fontSize: "20px", color: P.pencil } }, a), ...cells.map((t, i) => s.h("span", { style: { fontSize: "21px", color: C3[i][1], fontWeight: a === "Wahr?" ? 700 : 400 } }, t)))));
          const top = s.h("div", { style: { display: "grid", gridTemplateColumns: "130px 1fr 1fr 1fr", gap: "12px" } }, s.h("span"), ...heads);
          const m = later(merk(s, { style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Erkennst du den ", B(s, "Anfang"), ", erkennst du oft schon die Textsorte: ", B(s, "„Es war einmal“", P.violet), " – ", B(s, "echter Ort", P.unit), " – ", B(s, "sprechende Tiere", P.orange), "."));
          s.add(root(s, "stack", { gap: "14px" }, top, s.h("div", { class: "card", style: { padding: "4px 16px 8px" } }, ...rows), m));
          s.show(heads, "up"); s.sfx.pop();
          s.step(async () => { const snd = [() => s.sound("magic-chime", { vol: .5 }), () => s.sound("church-bells", { vol: .3, dur: 2, fade: .6 }), () => s.sound("raven", { vol: .5, dur: 1.5 })]; for (const [i, h] of heads.entries()) { snd[i](); await s.show(h.quote, "left"); await s.wait(350); } });
          s.step(async () => { for (const i of [0, 1, 2]) { s.sfx.count(i); await s.show(rows[i], "up"); } });
          s.step(async () => { for (const i of [3, 4]) { s.sfx.count(i + 3); await s.show(rows[i], "up"); } });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Vers, Strophe, Reim",
        say: "Ein Gedicht von Joachim Ringelnatz: Die Ameisen. Wir entdecken Verse, Strophen und Reime.",
        build(s) {
          const st1 = ["In Hamburg lebten zwei ", "Ameisen", ",", "Die wollten nach Australien ", "reisen", ".", "Bei Altona auf der ", "Chaussee", "", "Da taten ihnen die Beine ", "weh", ",", "Und da verzichteten sie ", "weise", "", "Denn auf den letzten Teil der ", "Reise", "."];
          const st2 = ["So will man oft und kann doch ", "nicht", "", "Und leistet dann recht gern ", "Verzicht", "."];
          const RC = [P.red, P.red, P.blue, P.blue, P.green, P.green, P.violet, P.violet];
          const RL = ["a", "a", "b", "b", "c", "c", "d", "d"];
          const ends = [], nums = [], lets = [];
          let n = 0;
          const mkLines = arr => { const out = []; for (let i = 0; i < arr.length; i += 3) {
            const k = n++;
            const e = s.h("span", null, arr[i + 1]); ends.push(e);
            const num = later(s.h("span", { class: "small pencil", style: { textAlign: "right" } }, String(k + 1)));
            const let_ = later(s.h("b", { style: { color: RC[k], fontSize: "24px", textAlign: "center" } }, RL[k]));
            nums.push(num); lets.push(let_);
            out.push(s.h("div", { style: { display: "grid", gridTemplateColumns: "28px 1fr 30px", gap: "10px", alignItems: "baseline" } }, num, s.h("p", { style: { margin: 0, fontSize: "23px", lineHeight: 1.35 } }, arr[i], e, arr[i + 2]), let_));
          } return out; };
          const brk = (label, lines) => {
            const lab = later(s.h("span", { style: { font: "700 19px var(--f-display)", color: P.unit, writingMode: "vertical-rl", transform: "rotate(180deg)", textAlign: "center" } }, label));
            const bar = s.h("div", { style: { borderRight: `4px solid transparent`, borderRadius: "0 10px 10px 0", display: "grid", placeItems: "center", paddingRight: "6px", transition: "border-color .4s" } }, lab);
            const g = s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 44px", gap: "8px" } }, s.h("div", { class: "stack", style: { gap: "4px" } }, ...lines), bar);
            g.bar = bar; g.lab = lab; return g;
          };
          const g1 = brk("Strophe 1", mkLines(st1)), g2 = brk("Strophe 2", mkLines(st2));
          const poem = s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", gap: "14px", padding: "14px 18px" } },
            s.h("p", { class: "h2", style: { fontSize: "24px" } }, "Die Ameisen ", s.h("span", { class: "small pencil", style: { fontWeight: 400 } }, "Joachim Ringelnatz, 1912")), g1, g2);
          const def = (t, d) => later(s.h("div", { class: "card soft", style: { padding: "12px 16px" } }, s.h("p", { class: "t", style: { fontSize: "22px" } }, B(s, t, P.unit), " ", d)));
          const d1 = def("Vers:", "eine Zeile im Gedicht.");
          const d2 = def("Strophe:", "mehrere Verse, die zusammengehören – wie ein Absatz.");
          const d3 = def("Reim:", "Wörter klingen am Ende gleich: Ameisen – reisen.");
          const d4 = later(merk(s, { style: { fontSize: "21px" } }, "Hier reimen sich immer zwei Verse hintereinander: ", B(s, "aabb"), ". Das heißt ", B(s, "Paarreim"), "."));
          const btn = readBtn(s, "Gedicht vorlesen", "Die Ameisen. Von Joachim Ringelnatz. In Hamburg lebten zwei Ameisen, die wollten nach Australien reisen. Bei Altona auf der Chaussee, da taten ihnen die Beine weh, und da verzichteten sie weise denn auf den letzten Teil der Reise. So will man oft und kann doch nicht und leistet dann recht gern Verzicht.");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "1.2fr .8fr", gap: "22px", alignItems: "start" }, poem, s.h("div", { class: "stack", style: { gap: "12px" } }, btn, d1, d2, d3, d4)));
          s.sfx.pop();
          s.step(async () => { for (const [i, x] of nums.entries()) { x.classList.remove("later"); s.show(x, "pop"); s.sfx.count(i); await s.wait(140); } s.show(d1, "left"); s.say("Acht Zeilen, also acht Verse."); });
          s.step(async () => { for (const g of [g1, g2]) { g.bar.style.borderColor = P.unit; s.show(g.lab, "fade"); s.sfx.whoosh(); await s.wait(400); } s.show(d2, "left"); s.say("Zwei Strophen."); });
          s.step(async () => {
            for (let i = 0; i < ends.length; i++) { ends[i].style.color = RC[i]; ends[i].style.fontWeight = 700; s.show(lets[i], "pop"); s.sfx.note([0, 0, 4, 4, 7, 7, 12, 12][i], .18); await s.wait(260); }
            s.show(d3, "left"); s.say("Ameisen, reisen. Chaussee, weh. Weise, Reise.");
          });
          s.step(async () => { s.sfx.ding(); await s.show(d4, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Reimschemas",
        say: "Es gibt drei wichtige Reimschemas: Paarreim, Kreuzreim und umarmender Reim.",
        build(s) {
          const C = [P.red, P.blue];
          const data = {
            paar: ["Paarreim", "aabb", "Wilhelm Busch, „Max und Moritz“, 1865", [["Ach, was muss man oft von ", "bösen", 0], ["Kindern hören oder ", "lesen", 0], ["Wie zum Beispiel hier von ", "diesen", 1], ["welche Max und Moritz ", "hießen", 1]], [[0, 1], [2, 3]]],
            kreuz: ["Kreuzreim", "abab", "Joseph von Eichendorff, „Weihnachten“", [["Markt und Straßen stehn ", "verlassen", 0], ["Still erleuchtet jedes ", "Haus", 1], ["Sinnend geh’ ich durch die ", "Gassen", 0], ["Alles sieht so festlich ", "aus", 1]], [[0, 2], [1, 3]]],
            arm: ["Umarmender Reim", "abba", "Beispiel aus dem Alltag (selbst gedichtet)", [["Die U-Bahn rumpelt, voll und ", "schwer", 0], ["ich stehe eng an Tür und ", "Wand", 1], ["den Turnbeutel in meiner ", "Hand", 1], ["da wird ein Platz am Fenster ", "leer", 0]], [[0, 3], [1, 2]]],
          };
          const punct = { paar: ["", "!", "", ";"], kreuz: [",", ",", ",", "."], arm: [",", ",", " –", "!"] };
          const lineBox = s.h("div", { class: "stack", style: { gap: "0px" } });
          const arcs = s.svg(150, 316);
          const nameEl = s.h("p", { class: "big", style: { color: P.unit } }, "");
          const patEl = s.h("p", { class: "huge mono", style: { letterSpacing: ".1em" } }, "");
          const srcEl = s.h("p", { class: "small pencil" }, "");
          const PR = { w: 250, h: 170, cls: "later", style: { position: "absolute", left: "0", top: "0" } };
          const rpics = { paar: s.photo("max-moritz-1", Object.assign({ fit: "contain", style: Object.assign({ background: "#fff" }, PR.style) }, { w: 250, h: 170, cls: "later" })), kreuz: s.photo("eichendorff", Object.assign({ pos: "50% 25%" }, PR)), arm: s.photo("alexanderplatz-u2", Object.assign({ pos: "50% 50%" }, PR)) };
          const rbox = s.h("div", { style: { position: "relative", width: "250px", height: "170px", marginTop: "6px" } }, ...Object.values(rpics));
          const rsnd = { paar: () => {}, kreuz: () => s.sound("church-bells", { vol: .35, dur: 3 }), arm: () => s.sound("ubahn-train", { vol: .35, dur: 3 }) };
          let cur = null;
          const show = async k => {
            if (cur === k) return; cur = k; s.sfx.whoosh();
            Object.entries(btns).forEach(([kk, b]) => b.classList.toggle("solid", kk === k));
            const [name, pat, src, lines, pairs] = data[k];
            nameEl.textContent = name; srcEl.textContent = src;
            Object.entries(rpics).forEach(([kk, ph]) => { if (kk !== k) s.hide(ph); }); s.show(rpics[k], "zoom"); rsnd[k]();
            patEl.replaceChildren(...pat.split("").map(ch => s.h("span", { style: { color: ch === "a" ? C[0] : C[1] } }, ch)));
            lineBox.replaceChildren(...lines.map(([a, e, r], i) => s.h("div", { class: "a-left", style: { "--d": i * 90 + "ms", height: "76px", display: "grid", gridTemplateColumns: "1fr 34px", alignItems: "center", gap: "10px" } },
              s.h("p", { style: { margin: 0, fontSize: "27px" } }, a, s.h("b", { style: { color: C[r], background: C[r] + "18", borderRadius: "6px", padding: "0 4px" } }, e), punct[k][i]),
              s.h("b", { style: { fontSize: "28px", color: C[r], textAlign: "center" } }, pat[i]))));
            arcs.replaceChildren();
            const yc = i => 44 + i * 76;
            const paths = pairs.map(([a, b], j) => {
              const r = (yc(b) - yc(a)) / 2, x = 10;
              const p = s.el("path", { d: `M${x} ${yc(a)} C ${x + 40 + r * .7} ${yc(a)}, ${x + 40 + r * .7} ${yc(b)}, ${x} ${yc(b)}`, fill: "none", stroke: C[lines[a][2]], "stroke-width": 5, "stroke-linecap": "round" });
              arcs.append(p); return p;
            });
            for (const [j, p] of paths.entries()) { await s.show(p, "draw", j * 250); s.sfx.note(lines[pairs[j][0]][2] ? 7 : 0, .2); s.sfx.note(lines[pairs[j][0]][2] ? 7 : 0, .2); }
            s.say(name + ". " + pat.split("").join(" "));
          };
          const btns = {};
          Object.keys(data).forEach(k => (btns[k] = s.h("button", { class: "btn", onclick: () => show(k) }, data[k][0])));
          const m = later(merk(s, { style: { fontSize: "22px" } }, B(s, "Paarreim aabb", P.unit), " · ", B(s, "Kreuzreim abab", P.unit), " · ", B(s, "umarmender Reim abba", P.unit), ". Gleiche Buchstaben = gleicher Klang."));
          const lf = later(life(s, { style: { padding: "10px 16px" } }, s.h("p", { class: "small" }, "Abzählreime („Ene, mene, muh – und raus bist du!“), Kinderlieder, Rap-Songs und Geburtstagskarten reimen sich.")));
          s.add(root(s, "stack", { gap: "12px" }, s.h("div", { class: "row", style: { gap: "12px" } }, ...Object.values(btns)),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 150px 250px", gap: "14px", alignItems: "start" } },
              s.h("div", { class: "card", style: { padding: "6px 18px" } }, lineBox), arcs, s.h("div", { class: "stack", style: { gap: "6px" } }, nameEl, patEl, srcEl, rbox)),
            s.h("div", { class: "cols", style: { gridTemplateColumns: "1.1fr 1fr", gap: "16px" } }, m, lf)));
          show("paar");
          s.step(() => show("kreuz"));
          s.step(() => show("arm"));
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Rhythmus: Klatsch mit!",
        say: "Gedichte haben einen Rhythmus. Betonte und unbetonte Silben wechseln sich ab, wie ein Takt in der Musik.",
        build(s) {
          const mkLine = (syl, src) => {
            const boxes = syl.map(([t, st]) => s.h("span", { style: { display: "grid", placeItems: "center", minWidth: st ? "86px" : "64px", height: st ? "70px" : "52px", padding: "0 10px", borderRadius: "14px", background: st ? P.unit : "#fff", color: st ? "#fff" : P.ink, border: `3px solid ${P.unit}`, font: st ? "800 30px var(--f-display)" : "500 24px var(--f-body)", transition: "transform .12s" } }, t));
            const marks = syl.map(([, st]) => s.h("span", { style: { minWidth: st ? "86px" : "64px", textAlign: "center", font: "800 26px var(--f-display)", color: st ? P.red : P.pencil } }, st ? "X" : "x"));
            const row = s.h("div", { style: { display: "flex", gap: "8px", alignItems: "flex-end", justifyContent: "center" } }, ...boxes);
            const mrow = s.h("div", { style: { display: "flex", gap: "8px", justifyContent: "center" } }, ...marks);
            const play = async () => {
              for (let r = 0; r < 2 && s.alive; r++) for (const [i, b] of boxes.entries()) {
                if (!s.alive) return;
                if (syl[i][1]) s.sound("clap", { vol: .8 }); else s.sfx.tick();
                b.style.transform = "scale(1.15)"; await s.wait(300); b.style.transform = "none";
                if (s.fast) break;
              }
            };
            const btn = s.h("button", { class: "btn", style: { minHeight: "52px" }, onclick: () => play() }, "▶ Klatschen");
            const card = s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", gap: "6px", padding: "10px 18px" } },
              s.h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, s.h("p", { class: "small pencil" }, src), btn), row, mrow);
            card.play = play; card.mrow = mrow; return card;
          };
          const l1 = mkLine([["Al", 1], ["le", 0], ["Vö", 1], ["gel", 0], ["sind", 1], ["schon", 0], ["da", 1]], "Hoffmann von Fallersleben, 1835");
          const l2 = later(mkLine([["In", 0], ["Ham", 1], ["burg", 0], ["leb", 1], ["ten", 0], ["zwei", 1], ["A", 0], ["mei", 1], ["sen", 0]], "Joachim Ringelnatz, 1912"));
          l1.mrow.classList.add("later"); l2.mrow.classList.add("later");
          const n1 = later(s.h("p", { class: "t", style: { fontSize: "22px" } }, B(s, "Trochäus", P.unit), ": betont – unbetont (", B(s, "X x", P.red), "), wie BUM-ta."));
          const n2 = later(s.h("p", { class: "t", style: { fontSize: "22px" } }, B(s, "Jambus", P.unit), ": unbetont – betont (", B(s, "x X", P.red), "), wie ta-BUM. Lustig: Ringelnatz bringt dich dazu, A-", B(s, "MEI"), "-sen zu sagen!"));
          const lf = later(life(s, { style: { padding: "12px 18px" } }, s.h("p", { class: "small" }, "Wie in der Instrumentalklasse: Im Takt gibt es schwere und leichte Schläge. Auch Rap-Songs und Fangesänge im Stadion haben einen festen Rhythmus.")));
          s.add(root(s, "stack", { gap: "10px" }, l1, n1, l2, n2, lf));
          s.sfx.pop();
          s.step(async () => { s.say("Alle Vögel sind schon da."); await l1.play(); s.show(l1.mrow, "up"); s.show(n1, "up"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(l2, "up"); s.say("In Hamburg lebten zwei Ameisen."); await l2.play(); s.show(l2.mrow, "up"); s.show(n2, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Sprachliche Bilder",
        say: "Dichter malen mit Wörtern. Zwei wichtige sprachliche Bilder sind der Vergleich und die Personifikation.",
        build(s) {
          const svg = s.svg(200, 200);
          const rays = s.el("g", null, ...Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return s.el("line", { x1: 100 + 62 * Math.cos(a), y1: 100 + 62 * Math.sin(a), x2: 100 + 90 * Math.cos(a), y2: 100 + 90 * Math.sin(a), stroke: P.gold, "stroke-width": 7, "stroke-linecap": "round" }); }));
          const face = later(s.el("g", null, s.el("circle", { cx: 82, cy: 90, r: 7, fill: P.ink }), s.el("circle", { cx: 118, cy: 90, r: 7, fill: P.ink }), s.el("path", { d: "M76 112 Q100 136 124 112", stroke: P.ink, "stroke-width": 6, fill: "none", "stroke-linecap": "round" }), s.el("circle", { cx: 68, cy: 112, r: 8, fill: "#ff9f80", opacity: .7 }), s.el("circle", { cx: 132, cy: 112, r: 8, fill: "#ff9f80", opacity: .7 })));
          svg.append(rays, s.el("circle", { cx: 100, cy: 100, r: 54, fill: P.yellow }), face);
          s.loop(t => { rays.setAttribute("transform", `rotate(${t * 12} 100 100)`); });
          const row = (a, b) => later(s.h("p", { class: "small", style: { fontSize: "21px" } }, s.h("span", { class: "hl" }, a), b));
          const v1 = row("stark wie ein Bär", " · schnell wie der Blitz");
          const v2 = row("Ich schlafe wie ein Murmeltier.", "");
          const v3 = row("Es war, als hätt’ der Himmel / Die Erde still geküsst", " – Eichendorff, „Mondnacht“, 1837");
          const p1 = row("Die Sonne lacht.", " · Der Wind heult.");
          const p2 = row("Mein Wecker schreit mich an.", "");
          const p3 = row("Frühling will nun einmarschiern", " – Hoffmann von Fallersleben, „Alle Vögel sind schon da“");
          const colV = s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", gap: "10px" } }, s.h("p", { class: "h2", style: { color: P.blue, fontSize: "27px" } }, "Vergleich"),
            s.h("p", { class: "small pencil" }, "Zwei Dinge werden mit „wie“ oder „als ob“ verbunden."), v1, v2, v3);
          const colP = later(s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", gap: "10px" } }, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 110px", gap: "10px", alignItems: "center" } },
            s.h("div", { class: "stack", style: { gap: "6px" } }, s.h("p", { class: "h2", style: { color: P.violet, fontSize: "27px" } }, "Personifikation"), s.h("p", { class: "small pencil" }, "Dinge oder die Natur handeln wie Menschen.")), svg),
            p1, p2, p3));
          svg.style.width = "110px"; svg.style.height = "110px";
          const m = later(merk(s, { style: { fontSize: "22px" } }, "Sprachliche Bilder lassen ", B(s, "Bilder im Kopf"), " entstehen. Du findest sie in Gedichten – und jeden Tag in der Werbung."));
          const lf12 = later(life(s, null, s.h("p", { class: "small", style: { fontSize: "21px" } }, "„Die Zeit rennt.“ – „Der Bus kriecht.“ – „Mein Handy ist tot.“ – „Ich bin so hungrig wie ein Wolf.“ So reden wir jeden Tag in Bildern.")));
          s.add(root(s, "stack", { gap: "14px" }, s.h("div", { class: "cols", style: { gap: "20px", alignItems: "start" } }, colV, colP), m, lf12));
          s.sfx.pop();
          s.step(async () => { for (const [i, x] of [v1, v2].entries()) { s.sfx.count(i); await s.show(x, "left"); } s.say("Stark wie ein Bär. Ich schlafe wie ein Murmeltier."); });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(v3, "left"); s.say("Es war, als hätt der Himmel die Erde still geküsst."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(colP, "right"); s.sfx.boing(); await s.show(face, "pop"); for (const [i, x] of [p1, p2].entries()) { if (i === 0) s.sound("wind", { vol: .4, dur: 2.5 }); else s.sound("alarm-clock", { vol: .35, dur: 1.6 }); await s.show(x, "left"); await s.wait(600); } s.say("Die Sonne lacht. Aber eine Sonne hat doch gar keinen Mund!"); });
          s.step(async () => { s.sfx.fanfare(); await s.show(p3, "left"); s.say("Frühling will nun einmarschiern."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(lf12, "up"); });
        },
      },
      /* 12a – eigene Gedichte: Elfchen ------------------------------------- */
      {
        title: "Ein Elfchen schreiben",
        say: "Jetzt dichtest du selbst! Ein Elfchen hat elf Wörter in fünf Zeilen: ein Wort, zwei Wörter, drei, vier und am Ende wieder eins.",
        build(s) {
          const EX = {
            herbst: ["Herbst", [["Bunt"], ["Die", "Blätter"], ["tanzen", "im", "Wind."], ["Ich", "sammle", "die", "schönsten."], ["Herbst!"]], () => s.sound("wind", { vol: .35, dur: 2.5 })],
            ubahn: ["U-Bahn", [["Gelb"], ["Die", "U-Bahn"], ["rumpelt", "unter", "Berlin."], ["Ich", "fahre", "zur", "Schule."], ["Pünktlich!"]], () => s.sound("ubahn-train", { vol: .35, dur: 2.5 })],
            fussball: ["Fußball", [["Schnell"], ["Der", "Ball"], ["fliegt", "ins", "Tor."], ["Ich", "jubele", "ganz", "laut."], ["Tooor!"]], () => s.sound("crowd-cheer", { vol: .35, dur: 2.5 })],
          };
          const RULE = ["eine Farbe oder Eigenschaft", "ein Ding, das so ist", "Wo ist es? Was tut es?", "etwas über dich: Ich …", "ein Schlusswort"];
          const N = [1, 2, 3, 4, 1];
          const holders = N.map(() => s.h("div", { style: { display: "flex", gap: "6px", justifyContent: "center", alignItems: "center", minHeight: "58px", flexWrap: "nowrap" } }));
          const ph = () => s.h("span", { style: { display: "inline-block", width: "64px", height: "44px", borderRadius: "10px", border: "2px dashed " + P.line } });
          const rows = N.map((n, i) => s.h("div", { style: { display: "grid", gridTemplateColumns: "40px minmax(0, 1fr) 210px", gap: "10px", alignItems: "center", padding: "7px 0", borderBottom: i < 4 ? "2px solid " + P.line : "none" } },
            s.h("span", { style: { width: "38px", height: "38px", borderRadius: "50%", display: "grid", placeItems: "center", background: P.unit, color: "#fff", font: "700 21px/1 var(--f-display)" } }, String(n)), holders[i],
            s.h("p", { class: "small pencil", style: { fontSize: "19px", lineHeight: 1.25 } }, RULE[i])));
          const box = t => s.h("span", { class: "a-pop", style: { display: "inline-grid", placeItems: "center", height: "50px", padding: "0 9px", borderRadius: "10px", background: "#fff", border: "2px solid " + P.unit, font: "700 24px/1 var(--f-display)", color: P.ink, whiteSpace: "nowrap" } }, t);
          const cnt = s.h("span", { class: "huge mono", style: { color: P.unit } }, "0");
          let words = 0, run = 0, cur = null;
          const setCnt = n => { words = n; cnt.textContent = String(n); };
          const reset = () => { holders.forEach((h, i) => h.replaceChildren(...Array.from({ length: N[i] }, ph))); setCnt(0); };
          const fillLines = async (k, lines, id) => {
            for (const i of lines) {
              const ws = EX[k][1][i]; holders[i].replaceChildren();
              for (const w of ws) { if (id !== run || !s.alive) return; holders[i].append(box(w)); setCnt(words + 1); s.sfx.note([0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17][words - 1] || 0, .14); if (!s.fast) await s.wait(170); }
              if (!s.fast) await s.wait(200);
            }
          };
          const tabs = Object.entries(EX).map(([k, e]) => { const b = s.h("button", { class: "btn", onclick: () => show(k, [0, 1, 2, 3, 4]) }, e[0]); b.dataset.k = k; return b; });
          const show = async (k, lines) => {
            const id = ++run;
            if (cur !== k) { cur = k; reset(); tabs.forEach(b => b.classList.toggle("solid", b.dataset.k === k)); EX[k][2](); }
            else if (lines[0] === 0) reset();
            await fillLines(k, lines, id);
            if (id === run && words === 11) s.say(EX[k][1].map(l => l.join(" ")).join(" "));
          };
          const card = s.h("div", { class: "card", style: { padding: "10px 16px", display: "flex", flexDirection: "column", gap: "6px" } }, s.h("div", { class: "row", style: { gap: "10px" } }, s.h("b", { style: { fontSize: "21px", color: P.pencil } }, "Thema:"), ...tabs), ...rows);
          const count = s.h("div", { class: "card soft", style: { padding: "10px 16px", display: "flex", alignItems: "center", gap: "14px" } }, cnt, s.h("p", { class: "t", style: { fontSize: "22px" } }, "Wörter", s.h("br"), s.h("span", { class: "pencil" }, "von 11")));
          const m = later(merk(s, { style: { fontSize: "21px" } }, "Ein ", B(s, "Elfchen"), " hat ", B(s, "11 Wörter"), " in 5 Zeilen: ", B(s, "1 – 2 – 3 – 4 – 1"), ". Reimen muss sich nichts!"));
          const lf = later(life(s, { style: { padding: "10px 16px" } }, s.h("p", { class: "small" }, "Ein Elfchen passt auf jede Geburtstagskarte, auf ein Lesezeichen oder unter ein Foto im Fotoalbum.")));
          const tip = later(s.h("div", { class: "card soft", style: { padding: "8px 16px" } }, s.h("p", { class: "small" }, B(s, "So gehst du vor: ", P.unit), "Thema wählen → Wörter dazu sammeln → in die fünf Zeilen verteilen → laut vorlesen und verbessern.")));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "1fr 330px", gap: "18px", alignItems: "start" }, s.h("div", { class: "stack", style: { gap: "12px" } }, card, tip), s.h("div", { class: "stack", style: { gap: "12px" } }, count, m, lf)));
          reset(); cur = "herbst"; tabs[0].classList.add("solid"); s.sfx.pop();
          s.step(async () => { EX.herbst[2](); s.sound("pencil-write", { vol: .4, dur: 1 }); await show("herbst", [0, 1]); s.say("Bunt. Die Blätter."); });
          s.step(async () => { s.sound("pencil-write", { vol: .4, dur: 1.2 }); await show("herbst", [2, 3, 4]); s.sfx.success(); await s.show(tip, "up"); });
          s.step(async () => { await show("ubahn", [0, 1, 2, 3, 4]); });
          s.step(async () => { await show("fussball", [0, 1, 2, 3, 4]); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 12b – eigene Gedichte: Rondell ------------------------------------- */
      {
        title: "Ein Rondell schreiben",
        say: "Ein Rondell hat acht Zeilen. Die erste Zeile kommt dreimal vor: in Zeile eins, vier und sieben. Zeile zwei und Zeile acht sind gleich.",
        build(s) {
          const EX = {
            herbst: ["Herbst", ["Der Herbst ist da.", "Die Blätter fallen leise.", "Der Wind pfeift durch die Straßen.", "Ich trinke heißen Kakao.", "Die Kastanien glänzen braun."], () => s.sound("wind", { vol: .3, dur: 2 })],
            ubahn: ["U-Bahn", ["Die U-Bahn kommt.", "Die Türen gehen auf.", "Alle drängeln sich hinein.", "Ich finde keinen Sitzplatz.", "„Zurückbleiben, bitte!“"], () => s.sound("ubahn-tueren", { vol: .35, dur: 2.5 })],
            fussball: ["Fußball", ["Heute ist Spieltag.", "Ich ziehe mein Trikot an.", "Das Stadion ist voll.", "Wir singen und wir hoffen.", "Tor in der letzten Minute!"], () => s.sound("crowd-cheer", { vol: .3, dur: 2.5 })],
          };
          // which source line goes into each of the 8 lines: A = own line 1, B = own line 2, x = free lines 3–5
          const MAP = [0, 1, 2, 0, 3, 4, 0, 1];
          const TAG = ["A", "B", "", "A", "", "", "A", "B"];
          const TC = { A: P.red, B: P.blue, "": P.pencil };
          const texts = MAP.map(() => s.h("p", { style: { margin: 0, fontSize: "23px", lineHeight: 1.2 } }, ""));
          const rows = MAP.map((_, i) => s.h("div", { style: { display: "grid", gridTemplateColumns: "34px 44px 1fr", gap: "8px", alignItems: "center", minHeight: "44px", borderBottom: "2px solid " + P.line } },
            s.h("span", { class: "small pencil", style: { textAlign: "right" } }, String(i + 1)),
            s.h("b", { style: { display: "grid", placeItems: "center", height: "34px", borderRadius: "8px", background: TAG[i] ? TC[TAG[i]] : "transparent", color: "#fff", font: "700 20px/1 var(--f-display)" } }, TAG[i]), texts[i]));
          let run = 0, cur = null;
          const setLine = async (k, i, id) => {
            if (id !== run || !s.alive) return;
            const src = MAP[i], copy = (TAG[i] && i !== src) ;
            texts[i].textContent = EX[k][1][src]; texts[i].style.color = TAG[i] ? TC[TAG[i]] : P.ink; texts[i].style.fontWeight = TAG[i] ? 700 : 400;
            texts[i].classList.remove("a-left", "a-pop"); void texts[i].offsetWidth; texts[i].classList.add(copy ? "a-pop" : "a-left");
            if (copy) { s.sfx.snap(); const o = texts[src]; o.classList.remove("a-pop"); void o.offsetWidth; o.classList.add("a-pop"); } else s.sfx.note(i, .15);
            if (!s.fast) await s.wait(copy ? 520 : 420);
          };
          const tabs = Object.entries(EX).map(([k, e]) => { const b = s.h("button", { class: "btn", onclick: () => show(k, [0, 1, 2, 3, 4, 5, 6, 7]) }, e[0]); b.dataset.k = k; return b; });
          const show = async (k, lines) => {
            const id = ++run;
            if (cur !== k) { cur = k; texts.forEach(t => (t.textContent = "")); tabs.forEach(b => b.classList.toggle("solid", b.dataset.k === k)); EX[k][2](); }
            for (const i of lines) await setLine(k, i, id);
          };
          const card = s.h("div", { class: "card", style: { padding: "10px 16px", display: "flex", flexDirection: "column", gap: "2px" } }, s.h("div", { class: "row", style: { gap: "10px", marginBottom: "6px" } }, s.h("b", { style: { fontSize: "21px", color: P.pencil } }, "Thema:"), ...tabs), ...rows);
          const PLAN = [["Zeile 1 = 4 = 7", P.red, "der wichtigste Satz, dreimal"], ["Zeile 2 = 8", P.blue, "kommt am Ende wieder"], ["Zeilen 3, 5, 6", P.pencil, "frei erfinden"]];
          const plan = PLAN.map(([a, c, b]) => later(s.h("div", { class: "card", style: { padding: "8px 14px", borderColor: c } }, s.h("p", { style: { margin: 0, font: "700 22px/1.2 var(--f-display)", color: c } }, a), s.h("p", { class: "small" }, b))));
          const m = later(merk(s, { style: { fontSize: "21px" } }, "Ein ", B(s, "Rondell"), " hat 8 Zeilen. Es dreht sich im Kreis – wie ein Karussell: Der erste Satz kommt immer wieder."));
          const lf = later(life(s, { style: { padding: "10px 16px" } }, s.h("p", { class: "small" }, "Wie der Refrain in einem Lied oder ein Fangesang im Stadion: Was sich wiederholt, bleibt im Kopf.")));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "1fr 340px", gap: "18px", alignItems: "start" }, card, s.h("div", { class: "stack", style: { gap: "10px" } }, ...plan, m, lf)));
          cur = "herbst"; tabs[0].classList.add("solid"); s.sfx.pop();
          s.step(async () => { EX.herbst[2](); s.sound("pencil-write", { vol: .4, dur: 1.2 }); await show("herbst", [0, 1, 2]); s.say("Der Herbst ist da. Die Blätter fallen leise. Der Wind pfeift durch die Straßen."); });
          s.step(async () => { await show("herbst", [3]); await s.show(plan[0], "left"); s.say("Zeile vier ist wieder die erste Zeile."); });
          s.step(async () => { s.sound("pencil-write", { vol: .4, dur: 1 }); await show("herbst", [4, 5, 6, 7]); await s.show(plan[1], "left"); await s.show(plan[2], "left"); s.sfx.success(); });
          s.step(async () => { await show("ubahn", [0, 1, 2, 3, 4, 5, 6, 7]); });
          s.step(async () => { await show("fussball", [0, 1, 2, 3, 4, 5, 6, 7]); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 12c – eigene Gedichte: Haiku --------------------------------------- */
      {
        title: "Ein Haiku schreiben",
        say: "Das Haiku kommt aus Japan. Es hat drei Zeilen mit fünf, sieben und fünf Silben. Zusammen sind das siebzehn Silben.",
        build(s) {
          const EX = {
            herbst: ["Herbst", ["Bun·tes·Laub·fällt·sacht", "der·Wind·trägt·es·weit·da·von", "ein·I·gel·schläft·ein"], () => s.sound("wind", { vol: .3, dur: 2 })],
            ubahn: ["U-Bahn", ["U-·Bahn·im·Tun·nel", "Lich·ter·flie·gen·schnell·vor·bei", "A·le·xan·der·platz"], () => s.sound("ubahn-train", { vol: .3, dur: 2.5 })],
            fussball: ["Fußball", ["Re·gen·auf·dem·Platz", "der·Ball·rollt·durch·nas·ses·Gras", "Tor·in·der·Pfüt·ze"], () => s.sound("rain", { vol: .3, dur: 2.5 })],
          };
          const NEED = [5, 7, 5];
          // join syllables back into words: a syllable that ends a word is followed by a space in the source text
          const WORDS = {
            herbst: ["Buntes Laub fällt sacht,", "der Wind trägt es weit davon –", "ein Igel schläft ein."],
            ubahn: ["U-Bahn im Tunnel,", "Lichter fliegen schnell vorbei –", "Alexanderplatz."],
            fussball: ["Regen auf dem Platz,", "der Ball rollt durch nasses Gras –", "Tor in der Pfütze!"],
          };
          const chipRows = NEED.map(() => s.h("div", { style: { display: "flex", gap: "5px", flexWrap: "nowrap", minHeight: "54px", alignItems: "center" } }));
          const counters = NEED.map(n => s.h("span", { style: { minWidth: "70px", height: "46px", borderRadius: "23px", display: "grid", placeItems: "center", font: "800 26px/1 var(--f-display)", background: P.soft, color: P.unit } }, "0"));
          const plain = NEED.map(() => s.h("p", { class: "hand", style: { margin: 0, fontSize: "30px", minHeight: "33px" } }, ""));
          const lines = NEED.map((n, i) => s.h("div", { style: { display: "flex", flexDirection: "column", gap: "6px", padding: "10px 0", borderBottom: i < 2 ? "2px solid " + P.line : "none" } },
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 70px", gap: "10px", alignItems: "center" } }, chipRows[i], counters[i]), plain[i]));
          const total = s.h("span", { class: "big mono", style: { color: P.unit } }, "0");
          let run = 0, cur = null, sum = 0;
          const reset = () => { chipRows.forEach(r => r.replaceChildren()); counters.forEach(c => { c.textContent = "0"; c.style.background = P.soft; c.style.color = P.unit; }); plain.forEach(p => (p.textContent = "")); sum = 0; total.textContent = "0"; };
          const doLine = async (k, i, id) => {
            const syl = EX[k][1][i].split("·");
            for (const [j, sy] of syl.entries()) {
              if (id !== run || !s.alive) return;
              chipRows[i].append(s.h("span", { class: "a-pop", style: { display: "inline-grid", placeItems: "center", height: "52px", padding: "0 10px", borderRadius: "10px", background: "#fff", border: "2px solid " + P.unit, font: "700 25px/1 var(--f-display)", whiteSpace: "nowrap" } }, sy));
              counters[i].textContent = String(j + 1); sum++; total.textContent = String(sum);
              s.sound("clap", { vol: .5 }); if (!s.fast) await s.wait(230);
            }
            if (syl.length === NEED[i]) { counters[i].style.background = P.green; counters[i].style.color = "#fff"; s.sfx.ding(); }
            plain[i].textContent = WORDS[k][i]; plain[i].classList.remove("a-fade"); void plain[i].offsetWidth; plain[i].classList.add("a-fade");
            if (!s.fast) await s.wait(250);
          };
          const tabs = Object.entries(EX).map(([k, e]) => { const b = s.h("button", { class: "btn", onclick: () => show(k, [0, 1, 2]) }, e[0]); b.dataset.k = k; return b; });
          const show = async (k, idx) => {
            const id = ++run;
            if (cur !== k || idx[0] === 0) { cur = k; reset(); tabs.forEach(b => b.classList.toggle("solid", b.dataset.k === k)); EX[k][2](); }
            for (const i of idx) await doLine(k, i, id);
            if (id === run && sum === 17) s.say(WORDS[k].join(" "));
          };
          const card = s.h("div", { class: "card", style: { padding: "10px 16px", display: "flex", flexDirection: "column", gap: "4px" } }, s.h("div", { class: "row", style: { gap: "10px", marginBottom: "4px" } }, s.h("b", { style: { fontSize: "21px", color: P.pencil } }, "Thema:"), ...tabs), ...lines);
          const clapAll = async () => { const id = ++run; for (const r of chipRows) for (const c of r.children) { if (id !== run || !s.alive) return; s.sound("clap", { vol: .6, force: true }); pulseOnce(c); await s.wait(300); } };
          const sumCard = s.h("div", { class: "card soft", style: { padding: "8px 16px", display: "flex", alignItems: "center", gap: "12px" } }, total, s.h("p", { class: "t", style: { fontSize: "21px", flex: "1" } }, "Silben – ein Haiku hat ", B(s, "5 + 7 + 5 = 17"), "."), s.h("button", { class: "btn", onclick: () => clapAll() }, "Mitklatschen"));
          const info = later(s.h("div", { class: "card", style: { padding: "10px 16px" } }, s.h("p", { class: "small" }, "Das ", B(s, "Haiku"), " kommt aus ", B(s, "Japan"), ". Meist geht es um die Natur und eine Jahreszeit. Der berühmteste Haiku-Dichter ist ", B(s, "Matsuo Bashō"), " ", s.h("span", { style: { whiteSpace: "nowrap" } }, "(1644–1694)"), ".")));
          const m = later(merk(s, { style: { fontSize: "21px" } }, "Haiku: ", B(s, "3 Zeilen"), " mit ", B(s, "5 – 7 – 5 Silben"), ". Klatsch die Silben mit, dann stimmt die Zahl!"));
          const lf = later(life(s, { style: { padding: "10px 16px" } }, s.h("p", { class: "small" }, "Ein Haiku ist so kurz, dass es auf einen Klebezettel passt: ein kleines Gedicht für den Kühlschrank oder die Federmappe.")));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "1fr 360px", gap: "18px", alignItems: "start" }, s.h("div", { class: "stack", style: { gap: "10px" } }, card, sumCard), s.h("div", { class: "stack", style: { gap: "10px" } }, info, m, lf)));
          reset(); cur = "herbst"; tabs[0].classList.add("solid"); s.sfx.pop();
          s.step(async () => { EX.herbst[2](); await show("herbst", [0]); s.say("Bun-tes Laub fällt sacht. Fünf Silben."); });
          s.step(async () => { await show("herbst", [1]); s.say("Sieben Silben."); });
          s.step(async () => { await show("herbst", [2]); s.sfx.success(); await s.show(info, "up"); });
          s.step(async () => { await show("ubahn", [0, 1, 2]); });
          s.step(async () => { await show("fussball", [0, 1, 2]); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Die Ballade: Erlkönig",
        say: "Eine Ballade ist ein Gedicht, das eine spannende Geschichte erzählt. Im Erlkönig von Goethe sprechen drei Figuren.",
        build(s) {
          const V = { e: ["Erzähler", P.pencil], v: ["Vater", P.blue], s: ["Sohn", P.green], k: ["Erlkönig", P.violet] };
          const text = [
            ["e", "Wer reitet so spät durch Nacht und Wind?"], ["e", "Es ist der Vater mit seinem Kind;"], ["e", "Er hat den Knaben wohl in dem Arm,"], ["e", "Er fasst ihn sicher, er hält ihn warm."],
            ["v", "Mein Sohn, was birgst du so bang dein Gesicht? –"], ["s", "Siehst, Vater, du den Erlkönig nicht?"], ["s", "Den Erlenkönig mit Kron’ und Schweif? –"], ["v", "Mein Sohn, es ist ein Nebelstreif. –"],
            ["k", "„Du liebes Kind, komm, geh mit mir!"], ["k", "Gar schöne Spiele spiel’ ich mit dir;"], ["k", "Manch’ bunte Blumen sind an dem Strand,"], ["k", "Meine Mutter hat manch gülden Gewand.“ –"],
          ];
          const rows = text.map(([w, t]) => { const r = s.h("p", { style: { margin: 0, fontSize: "21px", lineHeight: 1.3, padding: "2px 10px", borderLeft: "6px solid transparent", borderRadius: "4px", transition: "all .4s" } }, t); r.w = w; return r; });
          const strophes = [0, 4, 8].map(i => s.h("div", { class: "stack", style: { gap: "2px" } }, ...rows.slice(i, i + 4)));
          const paint = w => rows.filter(r => r.w === w).forEach(r => { r.style.borderLeftColor = V[w][1]; r.style.color = V[w][1]; r.style.background = V[w][1] + "14"; r.style.fontWeight = 700; });
          const poem = s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", gap: "12px", padding: "12px 14px" } },
            s.h("p", { class: "h2", style: { fontSize: "24px" } }, "Erlkönig ", s.h("span", { class: "small pencil", style: { fontWeight: 400 } }, "Johann Wolfgang von Goethe, 1782 · Strophe 1–3")), ...strophes.slice(0, 1), later(strophes[1]), later(strophes[2]));
          const vb = Object.entries(V).map(([k, [n, c]]) => later(s.h("button", { class: "btn", style: { borderColor: c, color: c, justifyContent: "flex-start" }, onclick: () => { s.sfx.click(); paint(k); read(s, rows.filter(r => r.w === k).map(r => r.textContent).join(" ")); } }, speaker(s), n)));
          const all = later(readBtn(s, "Strophe 1–3 vorlesen", () => text.map(([, t]) => t).join(" "), true));
          const gl = later(s.h("div", { class: "card soft", style: { padding: "12px 16px" } }, s.h("p", { class: "small" }, B(s, "Alte Wörter: "), "birgst = versteckst · bang = ängstlich · Schweif = lange Schleppe · gülden = golden")));
          const schwind = later(s.photo("erlkoenig-schwind", { w: "100%", h: 150, pos: "35% 62%", caption: "So malte Moritz von Schwind den Erlkönig." }));
          const m = later(merk(s, { style: { fontSize: "21px" } }, "Ballade = ", B(s, "Gedicht"), " + spannende ", B(s, "Geschichte"), " + ", B(s, "Figuren"), ", die sprechen – wie ein kleines Theaterstück."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "1.2fr .8fr", gap: "20px", alignItems: "start" }, poem,
            s.h("div", { class: "stack", style: { gap: "10px" } }, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" } }, ...vb), all, schwind, gl, m)));
          s.sfx.pop();
          s.step(async () => { paint("e"); s.show(vb[0], "pop"); s.sound("horse-gallop", { vol: .5, dur: 3.5 }); s.show(schwind, "zoom"); s.say("Der Erzähler beginnt."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(strophes[1], "up"); paint("v"); s.show(vb[1], "pop"); s.sfx.note(-5, .3); await s.wait(500); paint("s"); s.show(vb[2], "pop"); s.sfx.note(7, .3); s.say("Vater und Sohn sprechen abwechselnd."); });
          s.step(async () => { s.sfx.zap(); await s.show(strophes[2], "up"); paint("k"); s.show(vb[3], "pop"); s.sfx.chord([0, 3, 6]); s.say("Und dann spricht der Erlkönig, ganz sanft und lockend."); });
          s.step(async () => { s.sfx.pop(); await s.show(gl, "up"); s.show(all, "pop"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Erlkönig: Die Spannung steigt",
        say: "Von Strophe zu Strophe wird es unheimlicher. Tippe auf einen Balken, um die Strophe zu sehen.",
        build(s) {
          const st = [
            [2, "Wer reitet so spät durch Nacht und Wind?", "Der Erzähler stellt die Szene vor."],
            [4, "Siehst, Vater, du den Erlkönig nicht?", "Der Sohn hat Angst."],
            [4, "„Du liebes Kind, komm, geh mit mir!“", "Der Erlkönig lockt freundlich."],
            [5, "Mein Vater, mein Vater, und hörest du nicht,", "Die Angst wächst."],
            [6, "„Willst, feiner Knabe, du mit mir gehn?“", "Er lockt mit seinen Töchtern."],
            [7, "Mein Sohn, mein Sohn, ich seh’ es genau:", "Der Vater erklärt alles weg."],
            [9, "„Und bist du nicht willig, so brauch’ ich Gewalt.“", "Jetzt droht der Erlkönig!"],
            [10, "In seinen Armen das Kind war tot.", "Das traurige Ende."],
          ];
          const W = 1100, H = 290, bw = 92, gap = (W - 60 - 8 * bw) / 7;
          const svg = s.svg(W, H);
          svg.append(s.el("line", { x1: 20, y1: 250, x2: W - 10, y2: 250, stroke: P.ink, "stroke-width": 3 }));
          const col = v => (v < 5 ? P.unit : v < 8 ? P.orange : P.red);
          const bars = st.map(([v], i) => {
            const x = 40 + i * (bw + gap);
            const r = s.el("rect", { x, y: 250, width: bw, height: 0, rx: 10, fill: col(v), style: { cursor: "pointer" } });
            const lab = T(s, x + bw / 2, 278, "Str. " + (i + 1), { "font-size": 19, fill: P.pencil });
            r.addEventListener("click", () => sel(i));
            svg.append(r, lab); r.v = v; r.x0 = x; return r;
          });
          const grow = async (i) => { const hgt = st[i][0] * 23; await s.tween({ from: 0, to: hgt, dur: 450, ease: "back", update: v => { bars[i].setAttribute("y", 250 - v); bars[i].setAttribute("height", Math.max(0, v)); } }); };
          const qEl = s.h("p", { style: { margin: 0, font: "700 27px/1.25 var(--f-display)", color: P.unit } }, "");
          const eEl = s.h("p", { class: "t", style: { fontSize: "22px" } }, "");
          const cap = s.h("div", { class: "card", style: { height: "128px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "6px" } }, qEl, eEl);
          const sel = i => { qEl.textContent = st[i][1]; qEl.style.color = col(st[i][0]); eEl.textContent = "Strophe " + (i + 1) + ": " + st[i][2]; bars.forEach((b, j) => b.setAttribute("opacity", j === i ? 1 : .55)); s.sfx.pop(); };
          const gallop = async (n, speed) => { for (let k = 0; k < n && s.alive; k++) { s.sfx.drum(); await s.wait(speed); s.sfx.tick(); await s.wait(speed * .6); s.sfx.tick(); await s.wait(speed * 1.4); } };
          const gBtn = later(s.h("button", { class: "btn solid", style: { whiteSpace: "nowrap" }, onclick: async () => { for (const sp of [220, 170, 130, 100]) await gallop(2, sp); } }, "▶ Galopp hören"));
          const sBtn = later(s.soundBtn("schubert-erlkoenig", "Schubert anhören"));
          const lf = later(life(s, null, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr auto", gap: "16px", alignItems: "center" } }, s.h("p", { class: "small", style: { fontSize: "21px" } }, "Franz Schubert hat den Erlkönig 1815 vertont – sein Opus 1. Im Klavier hört man schnelle, wiederholte Töne, wie Hufschläge in der Nacht."), s.h("div", { class: "stack", style: { gap: "8px" } }, gBtn, sBtn))));
          s.add(root(s, "stack", { gap: "14px" }, svg, cap, lf));
          sel(0); bars[0].setAttribute("y", 250 - 46); bars[0].setAttribute("height", 46);
          s.sfx.pop();
          s.step(async () => { for (const i of [1, 2, 3]) { await grow(i); sel(i); s.sfx.count(i); gallop(1, 220); await s.wait(350); } });
          s.step(async () => { for (const i of [4, 5, 6]) { await grow(i); sel(i); s.sfx.count(i + 2); gallop(1, 150); await s.wait(300); } s.say("Und bist du nicht willig, so brauch ich Gewalt."); });
          s.step(async () => { await gallop(3, 100); await grow(7); sel(7); s.sfx.chord([-12, -9, -5]); s.say("In seinen Armen das Kind war tot."); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); s.show(gBtn, "pop"); s.show(sBtn, "pop"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Der Zauberlehrling",
        say: "Noch eine Ballade von Goethe: Der Zauberlehrling. Der Lehrling will zaubern wie sein Meister – und das geht gründlich schief.",
        build(s) {
          const L = P.blue, M = P.violet;
          const verse = (lines, color, it) => s.h("div", { class: "stack", style: { gap: "0", borderLeft: "6px solid " + color, paddingLeft: "10px" } },
            ...lines.map(t => s.h("p", { style: { margin: 0, fontSize: "21px", lineHeight: 1.3, color, fontStyle: it ? "italic" : "normal", fontWeight: color === P.ink ? 400 : 700 } }, t)));
          const who = (t, c) => s.h("p", { class: "small", style: { fontWeight: 700, color: c } }, t);
          const a = s.h("div", { class: "stack", style: { gap: "6px" } }, who("Der Lehrling freut sich:", L), verse(["Hat der alte Hexenmeister", "Sich doch einmal wegbegeben!", "Und nun sollen seine Geister", "Auch nach meinem Willen leben."], L));
          const b = later(s.h("div", { class: "stack", style: { gap: "6px" } }, who("Er zaubert den Besen:", L), verse(["Walle! walle", "Manche Strecke,", "Dass, zum Zwecke,", "Wasser fließe …"], L, true)));
          const c = later(s.h("div", { class: "stack", style: { gap: "6px" } }, who("Er hat das Wort vergessen:", P.red), verse(["Herr, die Not ist groß!", "Die ich rief, die Geister,", "Werd’ ich nun nicht los."], P.red)));
          const d = later(s.h("div", { class: "stack", style: { gap: "6px" } }, who("Der Meister rettet alles:", M), verse(["„In die Ecke,", "Besen! Besen!", "Seid’s gewesen.“"], M)));
          const poem = s.h("div", { class: "card", style: { padding: "12px 16px", display: "flex", flexDirection: "column", gap: "10px" } },
            s.h("p", { class: "h2", style: { fontSize: "24px" } }, "Der Zauberlehrling ", s.h("span", { class: "small pencil", style: { fontWeight: 400 } }, "Johann Wolfgang von Goethe, 1797 · Auszüge")),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" } }, a, c, b, d));
          const pic = s.photo("zauberlehrling-barth", { w: 330, h: 450, pos: "50% 20%", caption: "Zeichnung von Ferdinand Barth" });
          const rb = later(readBtn(s, "Auszüge vorlesen", "Hat der alte Hexenmeister sich doch einmal wegbegeben! Und nun sollen seine Geister auch nach meinem Willen leben. Walle! walle manche Strecke, dass, zum Zwecke, Wasser fließe. Herr, die Not ist groß! Die ich rief, die Geister, werd ich nun nicht los. In die Ecke, Besen! Besen! Seid's gewesen."));
          const gl = later(s.h("div", { class: "card soft", style: { padding: "10px 16px" } }, s.h("p", { class: "small" }, B(s, "Alte Wörter: "), "Hexenmeister = Zauberer · sich wegbegeben = weggehen · walle = fließe, ströme · Seid’s gewesen = Hört auf!")));
          const lf = later(life(s, { style: { padding: "10px 16px" } }, s.h("p", { class: "small" }, "Bis heute sagt man „Die Geister, die ich rief …“, wenn einem etwas über den Kopf wächst. Paul Dukas machte 1897 daraus ein Orchesterstück.")));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "330px 1fr", gap: "20px", alignItems: "start" },
            s.h("div", { class: "stack", style: { gap: "12px" } }, pic, rb),
            s.h("div", { class: "stack", style: { gap: "12px" } }, poem, gl, lf)));
          s.show(pic, "zoom"); s.sound("magic-chime", { vol: .5 });
          s.step(async () => { s.sound("water-pour", { vol: .5, dur: 2.5, fade: .6 }); await s.show(b, "up"); s.say("Walle, walle, manche Strecke. Der Besen holt Wasser."); });
          s.step(async () => { s.sound("splash", { vol: .5, dur: 2 }); await s.show(c, "up"); s.sfx.chord([-12, -9, -6]); s.say("Herr, die Not ist groß! Die ich rief, die Geister, werd ich nun nicht los."); });
          s.step(async () => { s.sound("gong", { vol: .45, dur: 2.5 }); await s.show(d, "up"); s.say("In die Ecke, Besen! Besen! Seid's gewesen."); });
          s.step(async () => { s.sfx.pop(); await s.show(gl, "up"); s.show(rb, "pop"); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Zauberlehrling: Spannungskurve",
        say: "Die Spannung steigt Schritt für Schritt, bis zum Höhepunkt. Dann kommt der Meister, und alles ist gut.",
        build(s) {
          const pts = [
            [2, "Der Meister ist weg.", "Der Lehrling ist frech und froh."],
            [4, "Der Besen holt Wasser.", "Erst klappt alles prima."],
            [7, "Das Zauberwort ist weg!", "Der Besen hört nicht mehr auf."],
            [6, "Er spaltet den Besen.", "Kurz Hoffnung: „Und nun kann ich hoffen.“"],
            [10, "Zwei Besen! Alles wird nass.", "Der Höhepunkt: „Wehe! wehe!“"],
            [1, "Der Meister kommt.", "Ein Zauberwort – und alles ist still."],
          ];
          const W = 640, H = 360, x0 = 50, y0 = 300, dx = (W - 110) / 5, ky = 25;
          const svg = s.svg(W, H);
          svg.append(s.el("line", { x1: x0 - 20, y1: y0, x2: W - 10, y2: y0, stroke: P.ink, "stroke-width": 3 }), s.el("line", { x1: x0 - 20, y1: y0, x2: x0 - 20, y2: 20, stroke: P.ink, "stroke-width": 3 }),
            T(s, 16, 160, "Spannung", { "font-size": 19, fill: P.pencil, transform: "rotate(-90 16 160)" }));
          const XY = pts.map(([v], i) => [x0 + 20 + i * dx, y0 - v * ky]);
          const segs = XY.slice(1).map((p, i) => { const q = XY[i]; return s.el("line", { x1: q[0], y1: q[1], x2: p[0], y2: p[1], stroke: i === 4 ? P.green : P.unit, "stroke-width": 6, "stroke-linecap": "round", class: "later" }); });
          const dots = XY.map(([x, y], i) => fb(s.el("circle", { cx: x, cy: y, r: 13, fill: i === 4 ? P.red : P.unit, stroke: "#fff", "stroke-width": 3, class: i ? "later" : "" })));
          const nums = XY.map(([x], i) => T(s, x, y0 + 30, String(i + 1), { "font-size": 21, fill: P.pencil, class: i ? "later" : "" }));
          const peak = later(T(s, XY[4][0], XY[4][1] - 24, "Höhepunkt", { "font-size": 21, fill: P.red }));
          svg.append(...segs, ...dots, ...nums, peak);
          /* Raum mit Wasser */
          const R = s.svg(330, 300);
          R.append(s.el("rect", { x: 10, y: 10, width: 310, height: 280, rx: 14, fill: "#fff", stroke: P.line, "stroke-width": 3 }), T(s, 165, 42, "Im Saal des Meisters", { "font-size": 20, fill: P.pencil }));
          const water = s.el("rect", { x: 13, y: 287, width: 304, height: 0, fill: "#5aa9e6", opacity: .7 });
          const broom = x => { const g = s.el("g", null, s.el("line", { x1: 0, y1: -110, x2: 0, y2: 0, stroke: "#8a5a2b", "stroke-width": 7, "stroke-linecap": "round" }), s.el("path", { d: "M-22 40 L-8 0 L8 0 L22 40 Z", fill: "#e0a800", stroke: "#8a5a2b", "stroke-width": 3 }),
            s.el("circle", { cx: 0, cy: -118, r: 12, fill: "#c7ab83", stroke: "#8a5a2b", "stroke-width": 3 }), s.el("rect", { x: 14, y: -60, width: 30, height: 32, rx: 4, fill: "#8a96a8", stroke: P.ink, "stroke-width": 2 })); g.setAttribute("transform", `translate(${x} 220)`); return g; };
          const b1 = broom(110), b2 = later(broom(230));
          R.append(b1, b2, water);
          const lvl = { v: 0 };
          const setW = async to => { const from = lvl.v; lvl.v = to; await s.tween({ from, to, dur: 800, ease: "inOut", update: v => { water.setAttribute("y", 287 - v * 2.74); water.setAttribute("height", v * 2.74); } }); };
          const qEl = s.h("p", { style: { margin: 0, font: "700 26px/1.2 var(--f-display)", color: P.unit } }, pts[0][1]);
          const eEl = s.h("p", { class: "small", style: { fontSize: "21px" } }, pts[0][2]);
          const cap = s.h("div", { class: "card", style: { minHeight: "100px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "4px", padding: "10px 16px" } }, qEl, eEl);
          const lf7 = later(life(s, { style: { padding: "10px 16px" } }, s.h("p", { class: "small" }, "Genauso baust du den Spannungsbogen in deinen eigenen Geschichten (Kapitel 7).")));
          const m = later(merk(s, { style: { fontSize: "21px", padding: "10px 16px 12px" } }, "Wie in einer Erzählung steigt die Spannung bis zum ", B(s, "Höhepunkt", P.red), ". Dann kommt die ", B(s, "Auflösung", P.green), "."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "640px 1fr", gap: "20px", alignItems: "start" },
            s.h("div", { class: "stack", style: { gap: "12px" } }, svg, m), s.h("div", { class: "stack", style: { gap: "12px" } }, R, cap, lf7)));
          s.sfx.pop();
          const go = async (i, snd) => {
            await s.show(segs[i - 1], "draw"); await s.show(dots[i], "pop"); s.show(nums[i], "fade");
            qEl.textContent = pts[i][1]; qEl.style.color = i === 4 ? P.red : P.unit; eEl.textContent = pts[i][2]; snd();
          };
          s.step(async () => { await go(1, () => s.sound("water-pour", { vol: .5, dur: 2, fade: .5 })); await setW(18); });
          s.step(async () => { await go(2, () => s.sound("splash", { vol: .45, dur: 1.5 })); s.sfx.error(); await setW(45); });
          s.step(async () => { await go(3, () => s.sound("twig-snap", { vol: .7 })); await setW(48); });
          s.step(async () => { s.show(b2, "pop"); await go(4, () => s.sound("waves", { vol: .5, dur: 3, fade: .8 })); s.show(peak, "pop"); s.sfx.chord([0, 3, 6]); await setW(88); });
          s.step(async () => { await go(5, () => s.sound("magic-chime", { vol: .6 })); s.hide(b2); await setW(0); s.sfx.success(); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.show(lf7, "up"); });
        },
      },
      /* 17 --------------------------------------------------------------- */
      {
        title: "John Maynard",
        say: "Theodor Fontane erzählt von einem Schiff, das brennt. Der Steuermann John Maynard bleibt am Steuer, bis alle gerettet sind.",
        build(s) {
          const st = [
            ["30", 2, "Noch 30 Minuten … Halbe Stund’.", "Alle sind froh, das Ufer ist nah."],
            ["20", 6, "„Feuer“ war es, was da klang,", "Qualm, dann Flammen!"],
            ["15", 7, "„Wo sind wir? wo?“", "Die Passagiere drängen sich vorn."],
            ["10", 9, "„Noch da, John Maynard?“ – „Ja, Herr. Ich bin.“", "Er steuert durch den Qualm."],
            ["0", 10, "Rettung: der Strand von Buffalo.", "Höhepunkt: Er jagt das Schiff an den Strand."],
            ["", 3, "Gerettet alle. Nur Einer fehlt!", "John Maynard ist tot. Die Stadt trauert."],
          ];
          const W = 560, H = 270, bw = 64, gap = (W - 40 - 6 * bw) / 5;
          const svg = s.svg(W, H);
          svg.append(s.el("line", { x1: 10, y1: 230, x2: W - 10, y2: 230, stroke: P.ink, "stroke-width": 3 }));
          const col = v => (v < 5 ? P.unit : v < 9 ? P.orange : P.red);
          const bars = st.map(([mn, v], i) => {
            const x = 20 + i * (bw + gap);
            const r = s.el("rect", { x, y: 230, width: bw, height: 0, rx: 8, fill: i === 5 ? P.pencil : col(v) });
            const lab = T(s, x + bw / 2, 258, mn === "" ? "Ende" : mn === "0" ? "Ufer" : mn + " Min.", { "font-size": 19, fill: P.pencil });
            svg.append(r, lab); return r;
          });
          const grow = async i => { const hh = st[i][1] * 20; await s.tween({ from: 0, to: hh, dur: 450, ease: "back", update: v => { bars[i].setAttribute("y", 230 - v); bars[i].setAttribute("height", Math.max(0, v)); } }); };
          const qEl = s.h("p", { style: { margin: 0, font: "700 24px/1.25 var(--f-display)", color: P.unit } }, "");
          const eEl = s.h("p", { class: "small", style: { fontSize: "21px" } }, "");
          const cap = s.h("div", { class: "card", style: { minHeight: "112px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "4px", padding: "10px 16px" } }, qEl, eEl);
          const sel = i => { qEl.textContent = st[i][2]; qEl.style.color = i === 5 ? P.pencil : col(st[i][1]); eEl.textContent = st[i][3]; };
          const pic = s.photo("dampfer-erie", { w: "100%", h: 220, pos: "50% 40%", caption: "Das echte Vorbild: Brand der „Erie“, 1841" });
          const intro = s.h("div", { class: "card soft", style: { padding: "10px 16px" } }, s.h("p", { class: "small", style: { fontSize: "21px" } }, "Theodor Fontane, 1886: Das Schiff „Schwalbe“ fährt über den Erie-See von Detroit nach Buffalo. Da bricht Feuer aus."));
          const dl = (who, c, t) => s.h("p", { style: { margin: 0, fontSize: "21px", lineHeight: 1.35 } }, s.h("b", { style: { color: c } }, who + ": "), s.h("span", { style: { color: c, fontWeight: 700 } }, t));
          const dia = later(s.h("div", { class: "card", style: { padding: "10px 16px", borderLeft: "6px solid " + P.unit } },
            s.h("p", { class: "small pencil", style: { marginBottom: "4px" } }, "Dramatischer Dialog durchs Sprachrohr:"),
            dl("Kapitän", P.blue, "„Noch da, John Maynard?“"), dl("John Maynard", P.green, "„Ja, Herr. Ich bin.“"),
            dl("Kapitän", P.blue, "„Auf den Strand. In die Brandung.“"), dl("John Maynard", P.green, "„Ich halte drauf hin.“")));
          const lf = later(life(s, { style: { padding: "10px 16px" } }, s.h("p", { class: "small" }, "1841 brannte auf dem Erie-See in Nordamerika der Dampfer „Erie“. Der Steuermann Luther Fuller soll bis zuletzt am Steuer geblieben sein.")));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "1fr 560px", gap: "20px", alignItems: "start" },
            s.h("div", { class: "stack", style: { gap: "12px" } }, pic, intro, lf),
            s.h("div", { class: "stack", style: { gap: "12px" } }, svg, cap, dia)));
          sel(0); bars[0].setAttribute("y", 230 - 40); bars[0].setAttribute("height", 40);
          s.show(pic, "zoom"); s.sound("waves", { vol: .4, dur: 3, fade: .8 });
          s.step(async () => { s.sound("fire", { vol: .5, dur: 3, fade: .8 }); await grow(1); sel(1); s.say("Feuer! Noch zwanzig Minuten bis Buffalo."); });
          s.step(async () => { s.sfx.count(2); await grow(2); sel(2); s.say("Wo sind wir? Wo? Noch fünfzehn Minuten."); });
          s.step(async () => { s.sound("ship-horn", { vol: .4, dur: 2 }); await grow(3); sel(3); s.show(dia, "up"); read(s, "Noch da, John Maynard? Ja, Herr. Ich bin. Auf den Strand. In die Brandung. Ich halte drauf hin."); });
          s.step(async () => { s.sound("splash", { vol: .5, dur: 2 }); await grow(4); sel(4); s.sfx.chord([0, 4, 7]); s.say("Rettung: der Strand von Buffalo."); });
          s.step(async () => { s.sound("church-bells", { vol: .4, dur: 4, fade: 1 }); await grow(5); sel(5); s.say("Gerettet alle. Nur einer fehlt."); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 18 --------------------------------------------------------------- */
      {
        title: "Was macht eine Ballade aus?",
        say: "Drei Balladen, ein Bauplan: eine spannende Handlung, in Versen und Strophen erzählt, mit Figuren, die selbst sprechen.",
        build(s) {
          const heads = ["", "Erlkönig", "Der Zauberlehrling", "John Maynard"];
          const rows = [
            ["Dichter", "Goethe, 1782", "Goethe, 1797", "Fontane, 1886"],
            ["Handlung", "Ritt durch die Nacht", "Besen außer Kontrolle", "Ein Schiff brennt"],
            ["Wer spricht?", "Vater, Sohn, Erlkönig", "Lehrling, Meister", "Kapitän, Steuermann"],
            ["Höhepunkt", "„… so brauch’ ich Gewalt.“", "Zwei Besen, alles nass", "In die Brandung!"],
            ["Ende", "Das Kind ist tot.", "Der Meister rettet.", "Alle gerettet – bis auf einen."],
          ];
          const cell = (t, i, j) => s.h(i < 0 ? "th" : "td", { style: { padding: "10px 10px", fontSize: j === 0 ? "19px" : "20px", fontWeight: j === 0 || i < 0 ? 700 : 400, color: j === 0 ? P.unit : P.ink, textAlign: "left", borderBottom: "2px solid " + P.line } }, t);
          const trs = rows.map((r, i) => later(s.h("tr", null, ...r.map((t, j) => cell(t, i, j)))));
          const table = s.h("table", { style: { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "14px" } },
            s.h("thead", null, s.h("tr", null, ...heads.map((t, j) => cell(t, -1, j)))), s.h("tbody", null, ...trs));
          const pieces = [["Handlung", "eine spannende Geschichte", P.blue], ["Gedicht", "Verse, Strophen, Reime", P.green], ["Spannung", "steigt bis zum Höhepunkt", P.red], ["Dialog", "Figuren sprechen selbst", P.violet]];
          const pz = pieces.map(([a, b, c]) => later(s.h("div", { class: "card", style: { borderColor: c, borderWidth: "3px", padding: "10px 14px", textAlign: "center" } }, s.h("p", { style: { margin: 0, font: "700 24px/1.1 var(--f-display)", color: c } }, a), s.h("p", { class: "small" }, b))));
          const plus = () => later(s.h("b", { style: { font: "700 32px/1 var(--f-display)", color: P.pencil, alignSelf: "center" } }, "+"));
          const pl = [plus(), plus(), plus()];
          const eq = s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr auto 1fr", gap: "8px" } }, pz[0], pl[0], pz[1], pl[1], pz[2], pl[2], pz[3]);
          const m = later(merk(s, { style: { fontSize: "21px", padding: "10px 16px 12px" } }, "Eine ", B(s, "Ballade"), " ist eine spannende Geschichte in Gedichtform – oft mit wörtlicher Rede, fast wie ein kleines Theaterstück."));
          s.add(root(s, "stack", { gap: "14px" }, s.h("div", { class: "card", style: { padding: "6px 10px" } }, table), eq, m));
          s.sfx.pop();
          s.step(async () => { for (const i of [0, 1]) { s.sfx.count(i); await s.show(trs[i], "left"); } });
          s.step(async () => { for (const i of [2, 3, 4]) { s.sfx.count(i); await s.show(trs[i], "left"); } s.sound("horse-gallop", { vol: .4, dur: 2 }); });
          s.step(async () => { for (let i = 0; i < 4; i++) { if (i) s.show(pl[i - 1], "pop"); s.sfx.snap(); await s.show(pz[i], "zoom"); } s.say("Handlung plus Gedicht plus Spannung plus Dialog."); });
          s.step(async () => { s.sfx.success(); await s.show(m, "up"); });
        },
      },
      /* 19 --------------------------------------------------------------- */
      {
        title: "Ein Buch vorstellen",
        say: "Bei einer Buchvorstellung erzählst du so viel, dass alle neugierig werden. Aber das Ende verrätst du nicht!",
        build(s) {
          const cover = s.svg(300, 420);
          cover.append(s.el("rect", { x: 10, y: 10, width: 280, height: 400, rx: 12, fill: "#f4e7c8", stroke: "#b8862a", "stroke-width": 4 }),
            s.el("rect", { x: 10, y: 10, width: 22, height: 400, fill: "#d6c08e" }),
            T(s, 160, 74, "Emil und die", { "font-size": 32, fill: "#8a2e1e", "font-weight": 800 }), T(s, 160, 112, "Detektive", { "font-size": 34, fill: "#8a2e1e", "font-weight": 800 }),
            T(s, 160, 146, "Erich Kästner", { "font-size": 21, fill: P.ink }),
            ...[[40, 240, 46, 120], [90, 200, 40, 160], [134, 220, 50, 140], [190, 180, 44, 180], [238, 230, 40, 130]].map(([x, y, w, h], i) => s.el("rect", { x, y, width: w, height: h, fill: ["#c0a37a", "#a8896a", "#c7ab83", "#9c7f60", "#b8996f"][i] })),
            ...Array.from({ length: 10 }, (_, i) => s.el("rect", { x: 50 + (i % 5) * 46, y: 254 + Math.floor(i / 5) * 40, width: 12, height: 14, fill: "#fff3c4" })),
            s.el("rect", { x: 10, y: 360, width: 280, height: 50, fill: "#8a96a8" }),
            s.el("rect", { x: 70, y: 330, width: 150, height: 44, rx: 10, fill: P.gold, stroke: "#8a5a00", "stroke-width": 3 }), s.el("circle", { cx: 100, cy: 376, r: 9, fill: "#333" }), s.el("circle", { cx: 190, cy: 376, r: 9, fill: "#333" }),
            s.el("line", { x1: 145, y1: 330, x2: 160, y2: 300, stroke: "#333", "stroke-width": 3 }));
          const rows = [
            ["Titel", "Emil und die Detektive"],
            ["Autor", "Erich Kästner (1899–1974), erschienen 1929"],
            ["Ort", "Berlin – die Kinder flitzen durch die ganze Stadt."],
            ["Hauptfiguren", "Emil Tischbein aus Neustadt, Gustav und seine Freunde, ein Dieb"],
            ["Inhalt", "Emil fährt allein mit dem Zug nach Berlin. Unterwegs wird ihm Geld gestohlen. Berliner Kinder helfen ihm, den Dieb zu verfolgen."],
            ["Ende", "🔒 Wird nicht verraten! Lest selbst!"],
            ["Meine Meinung", "Mir gefällt, dass die Kinder zusammenhalten."],
          ];
          const items = rows.map(([a, b], i) => later(s.h("div", { style: { display: "grid", gridTemplateColumns: "160px 1fr", gap: "12px", alignItems: "baseline" } },
            s.h("span", { class: "chip", style: { justifyContent: "center", background: i === 5 ? "#fde3df" : P.soft, color: i === 5 ? P.red : P.ink } }, a), s.h("p", { class: "small", style: { fontSize: "21px", fontWeight: i === 5 ? 700 : 400, color: i === 5 ? P.red : P.ink } }, b))));
          const lf = later(life(s, { style: { padding: "10px 16px" } }, s.h("p", { class: "small" }, "Auch in Berlin spielt „Rico, Oskar und die Tieferschatten“ von Andreas Steinhöfel (2008) – in Kreuzberg.")));
          const tip = later(s.h("div", { class: "card soft", style: { padding: "10px 16px" } }, s.h("p", { class: "small" }, B(s, "Tipp: "), "Bring das Buch mit und lies eine spannende Stelle vor – höchstens 3 Minuten.")));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "300px 1fr", gap: "24px", alignItems: "start" }, cover, s.h("div", { class: "stack", style: { gap: "13px" } }, ...items, tip, lf)));
          s.show(cover, "zoom"); s.sfx.whoosh();
          s.step(async () => { for (const i of [0, 1, 2]) { s.sfx.count(i); await s.show(items[i], "left"); } s.say("Titel, Autor, Ort."); });
          s.step(async () => { for (const i of [3, 4]) { s.sfx.count(i); await s.show(items[i], "left"); } s.say("Hauptfiguren und Inhalt, kurz erzählt."); });
          s.step(async () => { s.sfx.error(); await s.show(items[5], "bounce"); s.say("Das Ende wird nicht verraten!"); });
          s.step(async () => { s.sfx.pop(); await s.show(items[6], "left"); s.show(tip, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 20 --------------------------------------------------------------- */
      {
        title: "Vorlesen wie ein Profi",
        say: "Gut vorlesen heißt: richtig betonen, Pausen machen und das passende Tempo finden. Probiere es mit dem Regler aus!",
        build(s) {
          const lines = [[["In ", 0], ["Hamburg", 1], [" lebten zwei ", 0], ["Ameisen", 1], [",", 0]], [["Die wollten nach ", 0], ["Australien", 1], [" reisen.", 0]],
            [["Bei ", 0], ["Altona", 1], [" auf der Chaussee", 0]], [["Da taten ihnen die ", 0], ["Beine", 1], [" weh,", 0]]];
          const stress = [], pauses = [];
          const pText = s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", gap: "8px", padding: "16px 22px" } },
            ...lines.map((ln, li) => s.h("p", { style: { margin: 0, fontSize: "30px", lineHeight: 1.45 } }, ...ln.map(([t, st]) => { const e = s.h("span", null, t); if (st) stress.push(e); return e; }),
              (() => { const p = later(s.h("b", { style: { color: P.red, marginLeft: "10px" } }, li % 2 ? "||" : "|")); pauses.push(p); return p; })())));
          let rate = 1;
          const sayRate = () => {
            if (s.fast || !window.speechSynthesis) return;
            speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance("In Hamburg lebten zwei Ameisen, die wollten nach Australien reisen. Bei Altona auf der Chaussee, da taten ihnen die Beine weh.");
            u.lang = "de-DE"; u.rate = rate; const v = Deck.Voice.voice(); if (v) u.voice = v;
            speechSynthesis.speak(u);
          };
          const tempoLbl = r => (r < .8 ? "langsam" : r > 1.2 ? "schnell" : "genau richtig");
          const sl = s.slider({ label: "Tempo", min: 0.5, max: 1.6, step: 0.1, value: 1, fmt: v => s.fmt(v, 1) + "× · " + tempoLbl(v), onInput: v => { rate = v; } });
          const go = s.h("button", { class: "btn solid", onclick: () => { s.sfx.click(); sayRate(); } }, speaker(s), "Vorlesen");
          const tempo = later(ex(s, "Tempo ausprobieren", { style: { display: "flex", flexDirection: "column", gap: "8px" } }, sl, go));
          const tips = [["Betonung", "Wichtige Wörter sagst du etwas lauter."], ["Pausen", "| kurze Pause, || längere Pause – an Komma und Punkt."], ["Tempo", "Lieber langsam und deutlich als schnell."], ["Blickkontakt", "Schau ab und zu hoch zu deinen Zuhörern."]];
          const tipEls = tips.map(([a, b]) => later(s.h("div", { class: "card soft", style: { padding: "10px 16px" } }, s.h("p", { class: "small", style: { fontSize: "21px" } }, B(s, a + ": ", P.unit), b))));
          const lf = later(life(s, { style: { padding: "10px 16px" } }, s.h("p", { class: "small" }, "Gute-Nacht-Geschichte für die kleine Schwester, Referat in der Klasse – und in Klasse 6 der Vorlesewettbewerb (seit 1959): Jedes Kind liest 3 Minuten aus seinem Lieblingsbuch vor.")));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "1.15fr .85fr", gap: "20px", alignItems: "start" },
            s.h("div", { class: "stack", style: { gap: "14px" } }, pText, tempo), s.h("div", { class: "stack", style: { gap: "12px" } }, ...tipEls, lf)));
          s.sfx.pop();
          s.step(async () => { s.show(tipEls[0], "left"); for (const e of stress) { e.style.textDecoration = "underline"; e.style.textDecorationColor = P.unit; e.style.textDecorationThickness = "4px"; e.style.textUnderlineOffset = "6px"; e.style.fontWeight = 700; s.sfx.drum(); await s.wait(260); } });
          s.step(async () => { s.show(tipEls[1], "left"); for (const p of pauses) { s.sfx.tick(); await s.show(p, "pop"); } });
          s.step(async () => { s.show(tipEls[2], "left"); s.sfx.whoosh(); await s.show(tempo, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(tipEls[3], "left"); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
    ],
  });
})();
