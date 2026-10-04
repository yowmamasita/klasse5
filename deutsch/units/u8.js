/* Kapitel 8 – Märchen, Fabeln, Gedichte (Grimm, Äsop/La Fontaine/Lessing, Vers/Reim/Metrum, Erlkönig, Buchvorstellung, Vorlesen) */
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
    blurb: "Märchen, Fabeln, Reime, Rhythmus, Balladen, Bücher vorstellen.",
    goals: ["Märchen und ihre Merkmale erkennen", "Fabeln verstehen und ihre Lehre finden", "Vers, Strophe, Reim und Rhythmus in Gedichten entdecken", "Eine Ballade mit verteilten Rollen erleben", "Ein Buch vorstellen und gut vorlesen"],
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
      /* 16 --------------------------------------------------------------- */
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
