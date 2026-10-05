/* Kapitel 11 – Die Stadt – damals und heute (Berliner Rahmenlehrplan GeWi 5/6, Themenfeld 3.3 „Stadt“):
   Warum Städte entstehen, Rom (Sage, Anfänge am Tiber, Größe, Forum, Insula und Domus, Aquädukte, Thermen,
   Kolosseum, Straßen, Alltag auf der Straße), Vergleich mit Athen, Berlin und Cölln, Berlins Wachstum,
   Stadt und Land heute, Probleme der Stadt und Lösungen (Verkehr, Wohnen, Grün – Tempelhofer Feld).
   Fakten geprüft 2026-10-05 (Wikipedia: Romulus und Remus, Kolosseum, Aquädukte in Rom, Insula (building),
   Roman roads, Caracalla-Thermen, Forum Romanum, Geschichte Berlins, Einwohnerentwicklung von Berlin,
   Tempelhofer Feld; Amt für Statistik Berlin-Brandenburg; BVG; Destatis/KBA). Quellen im Abschlussbericht. */
(() => {
  const C = "#4338ca", SOFT = "#e8e7fb", INK = "#1b2740", PEN = "#5d6678";
  const WATER = "#4a90d9", RED = "#dc3b2a", BLUE = "#1d5bd0", GREEN = "#2f9a6a", ORANGE = "#d9730d", VIOLET = "#7b4fd6", GOLD = "#c99a1a";
  const LAND = "#efe6cf", HILL = "#d4bf8e", STONE = "#cbbd9f";

  /* ---------- helpers ---------- */
  const later = el => { el.classList.add("later"); return el; };
  const fb = el => { el.style.transformBox = "fill-box"; el.style.transformOrigin = "center"; return el; };
  const p = (s, cls, ...kids) => s.h("p", { class: cls }, ...kids);
  const B = (s, t) => s.h("b", null, t);
  const grid = (s, tpl, ...kids) => s.h("div", { style: { display: "grid", gridTemplateColumns: tpl, gap: "22px", alignItems: "center", height: "100%" } }, ...kids);
  const stack = (s, gap, ...kids) => s.h("div", { class: "stack", style: { gap: gap + "px" } }, ...kids);
  const head = (s, t, col) => s.h("p", { class: "t", style: { fontWeight: 700, color: col || C } }, t);
  const card = (s, col, title, text, cls) => s.h("div", { class: "card" + (cls === false ? "" : " later"), style: { padding: "8px 14px", borderLeft: `8px solid ${col}` } }, head(s, title, col), p(s, "small", ...[].concat(text)));
  const lifeBox = (s, cls, ...kids) => s.h("div", { class: "life" + (cls ? " " + cls : "") }, s.h("span", { class: "exlabel" }, "Im Alltag"), ...kids);
  const exc = (s, label, cls, ...kids) => s.h("div", { class: "ex" + (cls ? " " + cls : "") }, s.h("span", { class: "exlabel" }, label), ...kids);
  const merk = (s, ...kids) => later(s.h("div", { class: "merk", style: { fontSize: "20px", padding: "8px 14px" } }, ...kids));
  const halo = { stroke: "#fff", "stroke-width": 4, "paint-order": "stroke" };
  const txt = (s, x, y, t, o = {}) => s.el("text", Object.assign({ x, y, "font-size": 20, "font-weight": 700, fill: INK, "text-anchor": "middle", text: t }, o));
  const svgBox = (s, w, h) => s.el("svg", { width: w, height: h, viewBox: `0 0 ${w} ${h}` });
  async function countUp(s, el, to, { dur = 900, post = "", from = 0 } = {}) {
    let last = -1;
    await s.tween({ from, to, dur, ease: "out", update: v => { el.textContent = s.fmt(Math.round(v)) + post; const k = Math.floor((v - from) / ((to - from) / 8 || 1)); if (k !== last) { last = k; s.sfx.tick(); } } });
    el.textContent = s.fmt(to) + post;
  }
  const person = (s, x, y, col, k = 1) => s.el("g", { transform: `translate(${x} ${y}) scale(${k})` },
    s.el("path", { d: "M-8 0 L-8 -18 C-8 -26 8 -26 8 -18 L8 0 Z", fill: col }), s.el("circle", { cx: 0, cy: -31, r: 7, fill: "#e0b088" }));

  Deck.unit({
    id: "u11", num: 11, title: "Die Stadt – damals und heute", color: C, soft: SOFT,
    subtitle: "Vom alten Rom bis nach Berlin",
    blurb: "Warum Städte entstehen: Rom, Berlin und Stadt und Land heute.",
    goals: ["Erklären, warum an einem Ort eine Stadt entsteht", "Das alte Rom kennen: Forum, Wohnen, Wasser, Thermen, Straßen", "Rom und Athen vergleichen", "Wissen, wie Berlin entstand und gewachsen ist", "Stadt und Land vergleichen und Probleme der Stadt verstehen"],
    icon(svg, el) {
      svg.append(el("rect", { x: 6, y: 58, width: 58, height: 6, rx: 2, fill: "#4338ca" }));
      [[10, 30, 12], [24, 18, 12], [38, 36, 10], [50, 24, 12]].forEach(([x, y, w]) => svg.append(el("rect", { x, y, width: w, height: 58 - y, fill: "#4338ca", opacity: 0.85 })));
      svg.append(el("path", { d: "M8 58 Q16 46 24 58 Q32 46 40 58 Q48 46 56 58 Q60 52 64 58", fill: "none", stroke: "#e8e7fb", "stroke-width": 3 }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Warum entstehen Städte?",
        say: "Städte entstehen nicht irgendwo. Meist gibt es gute Gründe: Wasser, einen Übergang über den Fluss, Handelswege und Schutz.",
        build(s) {
          const W = 560, H = 520, svg = svgBox(s, W, H);
          svg.append(s.el("rect", { x: 0, y: 0, width: W, height: H, rx: 18, fill: "#e4efd5" }));
          // hill
          svg.append(s.el("path", { d: "M300 236 C330 110 500 100 548 236 Z", fill: HILL }));
          // roads
          const road = d => s.el("path", { d, fill: "none", stroke: "#b08a5a", "stroke-width": 10, "stroke-dasharray": "18 10", "stroke-linecap": "round" });
          svg.append(road("M290 520 L290 236 L330 160"), road("M0 460 L560 446"));
          // river
          svg.append(s.el("path", { d: "M-10 330 C120 296 200 384 290 360 C380 336 430 420 570 400", fill: "none", stroke: WATER, "stroke-width": 46 }));
          const g1 = later(s.el("g"));
          g1.append(txt(s, 96, 296, "Fluss", Object.assign({ fill: BLUE }, halo)), s.el("circle", { cx: 60, cy: 320, r: 15, fill: "#fff", stroke: BLUE, "stroke-width": 3 }), txt(s, 60, 327, "1", { fill: BLUE, "font-size": 19 }));
          const g2 = later(s.el("g"));
          [[-14, 0], [0, -14], [14, 4], [-6, 16], [8, 20], [-18, 22]].forEach(([dx, dy]) => g2.append(s.el("ellipse", { cx: 290 + dx, cy: 362 + dy, rx: 9, ry: 6, fill: "#9aa3ad", stroke: "#fff", "stroke-width": 1.5 })));
          g2.append(s.el("circle", { cx: 340, cy: 316, r: 15, fill: "#fff", stroke: PEN, "stroke-width": 3 }), txt(s, 340, 323, "2", { fill: PEN, "font-size": 19 }), txt(s, 362, 323, "Furt", Object.assign({ "text-anchor": "start", fill: PEN }, halo)));
          const g3 = later(s.el("g"));
          [[230, 432, "#e05d44"], [262, 418, "#f2b705"], [318, 418, "#2f9a6a"], [350, 432, "#1d5bd0"]].forEach(([x, y, col]) => g3.append(s.el("path", { d: `M${x - 16} ${y + 20} L${x - 16} ${y} L${x} ${y - 14} L${x + 16} ${y} L${x + 16} ${y + 20} Z`, fill: col, stroke: "#fff", "stroke-width": 2 })));
          g3.append(s.el("circle", { cx: 200, cy: 494, r: 15, fill: "#fff", stroke: ORANGE, "stroke-width": 3 }), txt(s, 200, 501, "3", { fill: ORANGE, "font-size": 19 }), txt(s, 222, 501, "Markt an der Kreuzung", Object.assign({ "text-anchor": "start", fill: ORANGE }, halo)));
          const g4 = later(s.el("g"));
          g4.append(s.el("path", { d: "M352 200 L352 168 L380 150 L470 150 L498 168 L498 200 Z", fill: "none", stroke: "#7a5a3a", "stroke-width": 6, "stroke-linejoin": "round" }));
          [[372, 170], [400, 162], [430, 168], [460, 160]].forEach(([x, y]) => g4.append(s.el("rect", { x: x - 9, y, width: 18, height: 18, fill: "#c8603a" }), s.el("path", { d: `M${x - 12} ${y} L${x} ${y - 10} L${x + 12} ${y} Z`, fill: "#7a3a1a" })));
          g4.append(s.el("circle", { cx: 520, cy: 112, r: 15, fill: "#fff", stroke: C, "stroke-width": 3 }), txt(s, 520, 119, "4", { fill: C, "font-size": 19 }), txt(s, 425, 84, "Hügel mit Mauer", Object.assign({ fill: C }, halo)));
          svg.append(g1, g2, g3, g4);
          const cards = [
            card(s, BLUE, "1  Wasser", "Zum Trinken, Kochen und Waschen. Auf dem Fluss fahren Boote mit Waren."),
            card(s, PEN, "2  Furt oder Brücke", "Eine Furt ist eine flache Stelle im Fluss. Hier kommt man hinüber, darum treffen sich hier die Wege."),
            card(s, ORANGE, "3  Handelswege kreuzen sich", "Händler machen Halt, tauschen und verkaufen. So entsteht ein Markt."),
            card(s, C, "4  Schutz", "Auf einem Hügel oder hinter einer Mauer ist man sicherer vor Feinden und Hochwasser."),
          ];
          const m = merk(s, "Oft kommt vieles zusammen. ", B(s, "Rom"), ": Fluss Tiber, Furt, Hügel, Salzstraße. ", B(s, "Berlin"), ": Übergang über die Spree und ein Handelsweg.");
          s.add(grid(s, "560px 1fr", svg, stack(s, 10, ...cards, m)));
          s.show(svg, "fade"); s.sfx.whoosh();
          s.step(async () => { s.sound("fluss", { vol: .35, dur: 2.5 }); s.show(g1, "pop"); await s.show(cards[0], "left"); s.say("Zuerst braucht man Wasser."); });
          s.step(async () => { s.sound("footsteps", { vol: .4, dur: 2 }); s.show(g2, "pop"); await s.show(cards[1], "left"); s.say("An einer Furt kommt man über den Fluss."); });
          s.step(async () => { s.sound("coins", { vol: .45 }); s.show(g3, "up"); await s.show(cards[2], "left"); s.say("Wo sich Handelswege kreuzen, entsteht ein Markt."); });
          s.step(async () => { s.sfx.drum(); s.show(g4, "zoom"); await s.show(cards[3], "left"); s.say("Und ein Hügel oder eine Mauer gibt Schutz."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Die Sage von Romulus und Remus",
        say: "Die Römer erzählten sich eine spannende Geschichte, wie ihre Stadt entstanden ist: die Sage von Romulus und Remus.",
        build(s) {
          const ph = s.photo("rom-woelfin", { w: 440, h: 300, caption: "Die Kapitolinische Wölfin, Rom", pos: "50% 55%" });
          const twins = later(exc(s, "Gut hingeschaut", "", p(s, "small", "Die zwei Babys unter der Wölfin hat man erst im 15. Jahrhundert dazugebaut.")));
          const m = merk(s, "Merkspruch: ", B(s, "7 – 5 – 3, Rom schlüpft aus dem Ei."), " 753 v. Chr. ist das Gründungsjahr aus der Sage.");
          const STORY = [
            ["Die Zwillinge Romulus und Remus sind Söhne des Kriegsgottes Mars. Ihr Onkel Amulius hat Angst vor ihnen und lässt sie in einem Korb auf dem Fluss Tiber aussetzen.", "fluss"],
            ["Eine Wölfin hört die Babys schreien. Sie bringt sie in ihre Höhle und säugt sie. Später zieht der Hirte Faustulus die Jungen groß.", "wolf-heulen"],
            ["Als Erwachsene wollen sie eine Stadt gründen. Doch sie streiten: Wer soll König sein? Im Streit tötet Romulus seinen Bruder.", null],
            ["Romulus wird König, und die Stadt heißt nach ihm: Rom. Laut Sage am 21. April 753 v. Chr.", null],
          ];
          const rows = STORY.map(([t], i) => later(s.h("div", { style: { display: "grid", gridTemplateColumns: "46px 1fr", gap: "12px", alignItems: "start" } },
            s.h("div", { style: { width: "46px", height: "46px", borderRadius: "50%", background: C, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: 800 } }, String(i + 1)),
            p(s, "small", t))));
          const sage = later(exc(s, "Sage, nicht Geschichte", "", p(s, "small", "Eine Sage erzählt etwas Wunderbares, das so nicht passiert ist. Das Jahr 753 hat der römische Gelehrte Varro erst Jahrhunderte später ausgerechnet.")));
          s.add(grid(s, "440px 1fr", stack(s, 12, ph, twins, m), stack(s, 12, ...rows, sage)));
          s.show(ph, "zoom"); s.sfx.pop();
          s.step(async () => { s.sound("fluss", { vol: .35, dur: 2.5 }); await s.show(rows[0], "left"); });
          s.step(async () => { s.sound("wolf-heulen", { vol: .45 }); await s.show(rows[1], "left"); s.show(twins, "up"); });
          s.step(async () => { s.sfx.drum(); await s.show(rows[2], "left"); });
          s.step(async () => { s.sfx.fanfare(); await s.show(rows[3], "left"); await s.show(m, "up"); s.say("Sieben, fünf, drei – Rom schlüpft aus dem Ei."); });
          s.step(async () => { s.sfx.ding(); await s.show(sage, "up"); s.say("Das ist eine Sage. Was wirklich geschah, wissen wir von Archäologen."); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Wie Rom wirklich begann",
        say: "Archäologen haben herausgefunden: Am Anfang gab es kleine Dörfer auf den Hügeln am Tiber. Der Ort war günstig.",
        build(s) {
          const W = 560, H = 520, svg = svgBox(s, W, H);
          svg.append(s.el("rect", { x: 0, y: 0, width: W, height: H, rx: 18, fill: LAND }));
          svg.append(s.el("path", { d: "M250 -10 C230 80 300 140 262 210 C232 270 196 300 210 360 C226 420 300 450 280 530", fill: "none", stroke: WATER, "stroke-width": 30 }));
          svg.append(txt(s, 222, 100, "Tiber", Object.assign({ fill: BLUE, "font-style": "italic", "text-anchor": "end" }, halo)));
          const HILLS = [["Kapitol", 320, 240], ["Palatin", 372, 334], ["Aventin", 340, 448], ["Quirinal", 368, 160], ["Viminal", 462, 186], ["Esquilin", 474, 274], ["Caelius", 462, 392]];
          const hg = s.el("g");
          HILLS.forEach(([n, x, y]) => hg.append(s.el("ellipse", { cx: x, cy: y, rx: 46, ry: 32, fill: HILL, stroke: "#b89d64", "stroke-width": 2 })));
          svg.append(hg);
          // salt road (drawn under labels)
          const salt = later(s.el("path", { d: "M0 400 C80 384 150 352 212 336 C262 322 300 300 334 282 C400 246 420 120 556 40", fill: "none", stroke: "#fff", "stroke-width": 7, "stroke-dasharray": "14 9", "stroke-linecap": "round" }));
          svg.append(salt);
          const labels = s.el("g");
          HILLS.forEach(([n, x, y]) => labels.append(txt(s, x, n === "Palatin" ? y - 6 : y + 7, n, { "font-size": 19, fill: "#5a4520" })));
          svg.append(labels);
          const huts = later(s.el("g"));
          [[352, 350], [372, 346], [392, 350]].forEach(([x, y]) => huts.append(s.el("path", { d: `M${x - 8} ${y + 10} L${x - 8} ${y} L${x} ${y - 9} L${x + 8} ${y} L${x + 8} ${y + 10} Z`, fill: "#8a5a2a" })));
          const island = later(s.el("ellipse", { cx: 212, cy: 336, rx: 11, ry: 24, fill: LAND, stroke: "#8a6a3a", "stroke-width": 3 }));
          const islL = later(txt(s, 190, 392, "Tiberinsel", Object.assign({ "font-size": 19, "text-anchor": "end" }, halo)));
          const saltL = later(s.el("g", null, txt(s, 12, 436, "Salz von der Küste", Object.assign({ "font-size": 19, "text-anchor": "start", fill: "#8a5a2a" }, halo)), txt(s, 548, 74, "Via Salaria", Object.assign({ "font-size": 19, "text-anchor": "end", fill: "#8a5a2a" }, halo))));
          const forum = later(s.el("g", null, s.el("circle", { cx: 344, cy: 286, r: 7, fill: C }), txt(s, 356, 293, "Forum", Object.assign({ "font-size": 19, "text-anchor": "start", fill: C }, halo))));
          svg.append(huts, island, islL, saltL, forum);
          const cards = [
            card(s, "#8a5a2a", "Um 1000 v. Chr.: Dörfer", "Hirten und Bauern wohnen in Hütten auf den Hügeln, zum Beispiel auf dem Palatin."),
            card(s, BLUE, "Ein guter Übergang", "Bei der Tiberinsel ist der Fluss leicht zu überqueren."),
            card(s, ORANGE, "Die Salzstraße", "Salz von der Küste wird ins Land gebracht. Salz ist wertvoll: Damit macht man Fleisch und Fisch haltbar."),
            card(s, C, "Die Dörfer wachsen zusammen", "Das sumpfige Tal dazwischen wird mit einem großen Abwasserkanal trockengelegt. Dort entsteht das Forum."),
          ];
          const m = merk(s, "Rom liegt auf ", B(s, "sieben Hügeln"), " am Tiber.");
          s.add(grid(s, "560px 1fr", svg, stack(s, 10, ...cards, m)));
          s.show(svg, "fade"); s.sfx.whoosh();
          s.step(async () => { s.sound("schaf", { vol: .45 }); s.show(huts, "pop"); await s.show(cards[0], "left"); });
          s.step(async () => { s.sound("fluss", { vol: .3, dur: 2 }); s.show(island, "pop"); s.show(islL, "fade"); await s.show(cards[1], "left"); });
          s.step(async () => { s.sound("kutsche", { vol: .4, dur: 2.5 }); await s.show(salt, "draw"); s.show(saltL, "fade"); await s.show(cards[2], "left"); });
          s.step(async () => { s.sfx.chord([0, 4, 7]); s.show(forum, "pop"); await s.show(cards[3], "left"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.say("Rom liegt auf sieben Hügeln am Tiber."); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Eine Million Menschen",
        say: "Rom wurde riesig. Um Christi Geburt lebten dort wohl rund eine Million Menschen. Vergleiche mit Athen und mit Berlin heute.",
        build(s) {
          const W = 1060, H = 372, svg = svgBox(s, W, H), BASE = 318, SP = 15;
          svg.append(txt(s, 0, 26, "1 Punkt = 10.000 Menschen", { "text-anchor": "start", fill: PEN, "font-size": 20 }));
          const block = (x0, cols, n, col) => { const dots = []; for (let i = 0; i < n; i++) { const c = i % cols, r = Math.floor(i / cols); const d = s.el("circle", { cx: x0 + c * SP + 7, cy: BASE - r * SP - 7, r: 6, fill: col, opacity: 0 }); svg.append(d); dots.push(d); } return dots; };
          const A = block(80, 5, 25, "#0e7490"), R = block(280, 10, 100, C), Be = block(600, 20, 390, BLUE);
          const nA = txt(s, 117, BASE - 92, "", { fill: "#0e7490", "font-size": 22 }), nR = txt(s, 355, BASE - 168, "", { fill: C, "font-size": 24 }), nB = txt(s, 916, 130, "", { fill: BLUE, "font-size": 28, "text-anchor": "start" });
          svg.append(nA, nR, nB,
            txt(s, 117, 350, "Athen damals", { fill: "#0e7490" }), txt(s, 355, 350, "Rom um Chr. Geb.", { fill: C }), txt(s, 750, 350, "Berlin heute (2025)", { fill: BLUE }));
          const fill = async (dots, dur) => { const n = dots.length; await s.tween({ from: 0, to: n, dur, update: v => { for (let i = 0; i < Math.floor(v); i++) dots[i].setAttribute("opacity", 1); } }); dots.forEach(d => d.setAttribute("opacity", 1)); };
          const c1 = card(s, C, "Nur geschätzt", "Genaue Zählungen gibt es aus dieser Zeit nicht. Fachleute schätzen: rund eine Million zur Zeit von Kaiser Augustus.");
          const m = merk(s, "So viele Menschen brauchen jeden Tag ", B(s, "Wasser, Essen, Wohnungen und Wege"), ". Wie hat Rom das geschafft? Das schauen wir uns jetzt an.");
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%", justifyContent: "center" } }, svg, s.h("div", { class: "cols", style: { gap: "16px" } }, c1, m)));
          s.sfx.pop();
          s.step(async () => { s.sfx.pop(); await fill(A, 400); nA.textContent = "200.000–300.000"; s.say("Athen hatte etwa zweihundert- bis dreihunderttausend Einwohner."); });
          s.step(async () => { s.sound("stimmengewirr", { vol: .3, dur: 3 }); await fill(R, 1000); nR.textContent = "rund 1 Million"; s.sfx.chord([0, 4, 7]); s.say("Rom hatte wohl rund eine Million."); });
          s.step(async () => { s.sound("traffic", { vol: .3, dur: 3 }); await fill(Be, 1500); nB.textContent = "3,9 Mio."; s.sfx.success(); s.say("Und in Berlin sind heute fast vier Millionen Menschen gemeldet."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(c1, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Das Forum: Herz der Stadt",
        say: "Das Forum Romanum war der wichtigste Platz in Rom. Hier wurde gehandelt, regiert, gerichtet und gebetet.",
        build(s) {
          const ph = s.photo("forum-romanum", { w: "100%", h: 236, caption: "Das Forum Romanum heute", kb: true });
          const items = [
            card(s, ORANGE, "Markt", "Händler verkaufen Brot, Öl, Wein und Stoffe."),
            card(s, GREEN, "Tempel", "Hier opfern die Römer ihren Göttern, zum Beispiel dem Saturn."),
            card(s, C, "Senat", "In der Kurie beraten die Senatoren über Gesetze, Krieg und Geld."),
            card(s, BLUE, "Rednerbühne", "Von der Rostra halten Politiker Reden an das Volk."),
            card(s, VIOLET, "Gericht", "In großen Hallen, den Basiliken, wird Recht gesprochen."),
            card(s, GOLD, "Goldener Meilenstein", "Von hier aus zählte man die Wege ins ganze Reich."),
          ];
          const lf = later(lifeBox(s, "", p(s, "small", "In Berlin liegen Rathaus, Gericht, Markt und Kirchen an verschiedenen Orten. Auf dem Forum war alles an einem Platz.")));
          s.add(s.h("div", { class: "stack", style: { gap: "10px", height: "100%", justifyContent: "center" } }, ph, s.h("div", { class: "cols3", style: { gap: "10px" } }, ...items), lf));
          s.show(ph, "fade"); s.sound("stimmengewirr", { vol: .3, dur: 4 });
          s.step(async () => { s.sound("coins", { vol: .45 }); s.show(items[0], "up"); await s.show(items[1], "up", 150); s.say("Markt und Tempel."); });
          s.step(async () => { s.sfx.drum(); s.show(items[2], "up"); await s.show(items[3], "up", 150); s.say("Hier saß der Senat, und hier hielt man Reden."); });
          s.step(async () => { s.sfx.chord([0, 5, 9]); s.show(items[4], "up"); await s.show(items[5], "up", 150); s.say("Gerichte, und der goldene Meilenstein."); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Wohnen: Insula oder Domus?",
        say: "Die meisten Römer wohnten zur Miete in hohen Häusern, den Insulae. Nur Reiche hatten ein eigenes Stadthaus, eine Domus.",
        build(s) {
          const W = 470, H = 560, ins = svgBox(s, W, H);
          const X0 = 30, X1 = 390, FL = 92, G = 524;
          ins.append(s.el("path", { d: `M${X0 - 12} ${G - 5 * FL} L${(X0 + X1) / 2} ${G - 5 * FL - 40} L${X1 + 12} ${G - 5 * FL} Z`, fill: "#a0482a" }));
          const floors = [];
          for (let f = 0; f < 5; f++) {
            const y = G - (f + 1) * FL, g = s.el("g");
            g.append(s.el("rect", { x: X0, y, width: X1 - X0, height: FL, fill: f === 0 ? "#e9cfa6" : f < 2 ? "#f1dcb8" : f < 3 ? "#f3e2c4" : "#f5e8d2", stroke: "#a07a4a", "stroke-width": 2 }));
            floors.push({ g, y });
            ins.append(g);
          }
          // ground floor: shops
          const shops = later(s.el("g"));
          ["Bäcker", "Laden", "Imbiss"].forEach((n, i) => { const x = X0 + 10 + i * 118; shops.append(s.el("rect", { x, y: G - 72, width: 104, height: 72, fill: "#7a4a2a" }), s.el("path", { d: `M${x - 4} ${G - 72} L${x + 108} ${G - 72} L${x + 100} ${G - 86} L${x + 4} ${G - 86} Z`, fill: ["#e05d44", "#2f9a6a", "#f2b705"][i] }), txt(s, x + 52, G - 30, n, { fill: "#fff", "font-size": 19 })); });
          ins.append(shops);
          const win = (g, y, n) => { for (let i = 0; i < n; i++) g.append(s.el("rect", { x: X0 + 14 + i * ((X1 - X0 - 28) / n), y: y + 14, width: 18, height: 26, fill: "#5a7d9a" })); };
          const up = later(s.el("g"));
          [["große Wohnung", 1], ["kleinere Wohnungen", 2], ["enge Kammern", 3], ["winzige Kammern", 4]].forEach(([n, f]) => { const y = G - (f + 1) * FL; win(up, y, 7 + (f > 2 ? 2 : 0)); up.append(txt(s, (X0 + X1) / 2, y + 72, n, { "font-size": 19 })); });
          ins.append(up);
          const fire = later(s.el("g"));
          fire.append(s.el("path", { d: "M340 92 C326 70 344 58 340 40 C356 54 364 70 352 92 Z", fill: "#ff7a1a" }), s.el("path", { d: "M344 92 C338 80 346 72 344 62 C352 72 354 82 350 92 Z", fill: "#ffd23a" }));
          ins.append(fire);
          const arrow = later(s.el("g"));
          arrow.append(s.el("path", { d: `M430 ${G - 20} L430 70`, stroke: C, "stroke-width": 4, "marker-end": "" }), s.el("path", { d: "M420 84 L430 64 L440 84 Z", fill: C }), s.el("text", { x: 0, y: 0, transform: `translate(456 ${(G + 60) / 2}) rotate(-90)`, "text-anchor": "middle", "font-size": 19, "font-weight": 700, fill: C, text: "je höher, desto billiger" }));
          ins.append(arrow);
          // domus plan
          const dw = 600, dh = 236, dom = later(svgBox(s, dw, dh));
          dom.append(s.el("rect", { x: 6, y: 6, width: dw - 12, height: dh - 12, rx: 6, fill: "#e9d8b8", stroke: "#8a6a3a", "stroke-width": 4 }));
          dom.append(s.el("rect", { x: 2, y: 104, width: 10, height: 34, fill: "#fff" }));
          for (let i = 1; i < 5; i++) dom.append(s.el("path", { d: `M${6 + i * 56} 6 L${6 + i * 56} 46 M${6 + i * 56} 190 L${6 + i * 56} 230`, stroke: "#8a6a3a", "stroke-width": 3 }));
          dom.append(s.el("path", { d: "M6 46 L290 46 M6 190 L290 190", stroke: "#8a6a3a", "stroke-width": 3 }));
          dom.append(s.el("rect", { x: 22, y: 50, width: 266, height: 136, fill: "#f6ecd8" }), s.el("rect", { x: 128, y: 96, width: 66, height: 46, fill: WATER, stroke: "#2a6aa0", "stroke-width": 2 }));
          dom.append(s.el("rect", { x: 312, y: 26, width: 268, height: 184, rx: 4, fill: "#bfe0a4" }));
          for (let i = 0; i < 8; i++) { dom.append(s.el("circle", { cx: 326 + i * 34, cy: 40, r: 6, fill: "#fff", stroke: "#8a6a3a", "stroke-width": 2 }), s.el("circle", { cx: 326 + i * 34, cy: 196, r: 6, fill: "#fff", stroke: "#8a6a3a", "stroke-width": 2 })); }
          dom.append(s.el("circle", { cx: 446, cy: 118, r: 22, fill: "#7ec2e8" }));
          dom.append(txt(s, 160, 82, "Atrium", { "font-size": 20 }), txt(s, 160, 172, "Regenbecken", { "font-size": 19, fill: "#2a6aa0" }), txt(s, 76, 128, "Eingang", { "font-size": 19, fill: PEN }), txt(s, 446, 166, "Garten mit Säulen", { "font-size": 19, fill: "#2f6a2a" }));
          const c1 = card(s, "#a0482a", "Insula = Mietshaus", "Unter Kaiser Augustus höchstens etwa 20 m hoch. Unten Läden, oben Wohnungen. Ganz oben: eng, kein Wasser, keine Toilette und Brandgefahr!");
          const c2 = card(s, "#2f6a2a", "Domus = Stadthaus der Reichen", "Für eine reiche Familie und ihre Sklaven. Licht kommt durch eine Öffnung im Dach, Regen fällt ins Becken.");
          const nI = s.h("b", { style: { color: "#a0482a" } }, "0"), nD = s.h("b", { style: { color: "#2f6a2a" } }, "0");
          const c3 = later(s.h("div", { class: "merk", style: { fontSize: "20px", padding: "8px 14px" } }, "Zählung aus dem 4. Jh.: rund ", nI, " Insulae, aber nur rund ", nD, " Domus."));
          s.add(grid(s, "470px 1fr", ins, stack(s, 10, dom, c1, c2, c3)));
          s.show(ins, "fade"); s.sfx.pop();
          s.step(async () => { s.sound("stimmengewirr", { vol: .3, dur: 2.5 }); await s.show(shops, "up"); s.say("Unten im Haus waren Läden und Imbisse."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(up, "fade"); s.show(arrow, "up"); s.sound("fire", { vol: .35, dur: 2 }); s.show(fire, "pop"); await s.show(c1, "left"); s.say("Je höher die Wohnung, desto billiger und gefährlicher."); });
          s.step(async () => { s.sound("water-pour", { vol: .4 }); await s.show(dom, "zoom"); await s.show(c2, "left"); s.say("Reiche wohnten in einer Domus mit Innenhof und Garten."); });
          s.step(async () => { await s.show(c3, "up"); countUp(s, nI, 45000, { dur: 1100 }); await countUp(s, nD, 1800, { dur: 1100 }); s.sfx.ding(); s.say("Es gab etwa fünfundzwanzig Mal so viele Mietshäuser wie Stadthäuser."); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Insula und Domus in echt",
        say: "Von beiden Hausarten gibt es noch Reste. Eine Insula steht mitten in Rom, eine Domus kannst du in Pompeji besuchen.",
        build(s) {
          const f1 = s.photo("insula-rom", { w: "100%", h: 300, caption: "Reste einer Insula in Rom" });
          const f2 = s.photo("domus-atrium", { w: "100%", h: 300, caption: "Atrium mit Regenbecken, Pompeji", cls: "later" });
          const e1 = later(exc(s, "Insula am Kapitol", "", p(s, "small", "Man sieht noch mehrere Stockwerke übereinander. Heute liegt sie am Fuß des Kapitols, direkt an einer Treppe.")));
          const e2 = later(exc(s, "Haus des Menander", "", p(s, "small", "Pompeji wurde 79 n. Chr. vom Vulkan Vesuv verschüttet. Darum sind viele Häuser gut erhalten.")));
          const lf = later(lifeBox(s, "", p(s, "small", "Auch in Berlin gibt es Mietshäuser mit Läden unten und Wohnungen darüber, zum Beispiel viele Altbauten an der Karl-Marx-Straße. Die Idee ist 2.000 Jahre alt!")));
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%", justifyContent: "center" } }, s.h("div", { class: "cols", style: { gap: "18px", alignItems: "start" } }, stack(s, 10, f1, e1), stack(s, 10, f2, e2)), lf));
          s.show(f1, "fade"); s.sfx.pop();
          s.step(async () => { s.sound("footsteps", { vol: .35, dur: 2 }); await s.show(e1, "up"); });
          s.step(async () => { s.sound("water-pour", { vol: .4 }); await s.show(f2, "zoom"); await s.show(e2, "up"); s.say("Pompeji wurde vom Vesuv verschüttet und so erhalten."); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Wasser für eine Million",
        say: "Woher kam das Wasser für so viele Menschen? Aus Quellen in den Bergen, durch lange Leitungen: die Aquädukte.",
        build(s) {
          const W = 1060, H = 300, svg = svgBox(s, W, H);
          const GP = [[0, 110], [200, 135], [380, 150], [430, 265], [530, 275], [575, 175], [700, 190], [1060, 225]];
          const gy = x => { for (let i = 1; i < GP.length; i++) if (x <= GP[i][0]) { const [a, b] = GP[i - 1], [c, d] = GP[i]; return b + (d - b) * (x - a) / (c - a); } return GP[GP.length - 1][1]; };
          const cy = x => 140 + (x - 40) * 0.0872;
          svg.append(s.el("rect", { x: 0, y: 0, width: W, height: H, fill: "#e6f2fb" }));
          svg.append(s.el("path", { d: "M" + GP.map(q => q.join(" ")).join(" L") + ` L${W} ${H} L0 ${H} Z`, fill: "#c9b07a" }));
          // underground tunnels (dark band)
          const tun = later(s.el("g"));
          tun.append(s.el("path", { d: `M40 ${cy(40)} L389 ${cy(389)}`, stroke: "#8a6a3a", "stroke-width": 14, "stroke-linecap": "round" }), s.el("path", { d: `M570 ${cy(570)} L860 ${cy(860)}`, stroke: "#8a6a3a", "stroke-width": 14, "stroke-linecap": "round" }));
          tun.append(txt(s, 210, 212, "Kanal unter der Erde", Object.assign({ "font-size": 19 }, halo)));
          // bridge
          const bridge = later(s.el("g"));
          bridge.append(s.el("path", { d: `M384 ${cy(384) + 6} L576 ${cy(576) + 6}`, stroke: "#b8a07a", "stroke-width": 14 }));
          for (let x = 392; x <= 568; x += 22) { bridge.append(s.el("rect", { x: x - 4, y: cy(x) + 10, width: 8, height: Math.max(0, gy(x) - cy(x) - 8), fill: "#b8a07a" })); }
          for (let x = 392; x < 568; x += 22) { const y = cy(x) + 22; bridge.append(s.el("path", { d: `M${x + 4} ${y + 12} A 7 9 0 0 1 ${x + 18} ${y + 12}`, fill: "none", stroke: "#b8a07a", "stroke-width": 6 })); }
          bridge.append(txt(s, 480, 142, "Brücke über ein Tal", Object.assign({ "font-size": 19 }, halo)));
          // water line on top
          const water = later(s.el("path", { d: `M40 ${cy(40)} L860 ${cy(860)}`, stroke: WATER, "stroke-width": 6, "stroke-dasharray": "14 10", fill: "none" }));
          // spring
          const spring = later(s.el("g", null, s.el("circle", { cx: 40, cy: cy(40), r: 11, fill: WATER, stroke: "#fff", "stroke-width": 3 }), txt(s, 22, 92, "Quelle in den Bergen", Object.assign({ "text-anchor": "start", "font-size": 19, fill: BLUE }, halo))));
          // city
          const city = later(s.el("g"));
          city.append(s.el("rect", { x: 846, y: cy(860) - 18, width: 30, height: 30, fill: "#e9d8b8", stroke: INK, "stroke-width": 2 }), txt(s, 862, 262, "Wasserschloss", Object.assign({ "font-size": 19 }, halo)));
          [[910, "Brunnen", 150], [972, "Thermen", 120], [1028, "Häuser", 150]].forEach(([x, n, ly]) => {
            const gyx = gy(x);
            city.append(s.el("path", { d: `M876 ${cy(860)} L${x} ${cy(860)} L${x} ${gyx - 6}`, stroke: WATER, "stroke-width": 4, fill: "none" }));
            city.append(s.el("rect", { x: x - 18, y: gyx - 46, width: 36, height: 40, fill: n === "Thermen" ? "#e9b48a" : "#f1dcb8", stroke: INK, "stroke-width": 2 }));
            city.append(txt(s, x, ly, n, Object.assign({ "font-size": 19, fill: BLUE }, halo)));
          });
          svg.append(tun, bridge, water, spring, city);
          const cards = [
            card(s, C, "11 Aquädukte", "versorgten Rom in der Kaiserzeit. Das erste, die Aqua Appia, entstand 312 v. Chr."),
            card(s, BLUE, "Nur bergab", "Das Wasser fließt von selbst, ganz leicht bergab. Am Pont du Gard (Frankreich): nur 35 cm auf 1 km!"),
            card(s, "#8a6a3a", "Meist unter der Erde", "Rund 85 % der Leitungen lagen unterirdisch. So blieb das Wasser kühl und sauber."),
            card(s, GREEN, "Über 1.300 Brunnen", "Wer zu Hause kein Wasser hatte, holte es mit dem Eimer am Brunnen."),
          ];
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%", justifyContent: "center" } }, svg, s.h("div", { class: "cols4", style: { gap: "10px", alignItems: "stretch" } }, ...cards)));
          s.show(svg, "fade"); s.sfx.pop();
          let off = 0;
          s.step(async () => { s.sound("hoehle-tropfen", { vol: .4, dur: 2 }); await s.show(spring, "pop"); await s.show(cards[0], "up"); });
          s.step(async () => { s.sfx.scribble(); await s.show(tun, "fade"); await s.show(cards[2], "up"); s.say("Meist lief der Kanal unter der Erde."); });
          s.step(async () => { s.sound("meissel", { vol: .4, dur: 1.5 }); await s.show(bridge, "up"); await s.show(cards[1], "up"); s.say("Über Täler führten Brücken mit Bögen. Das Wasser floss ganz leicht bergab."); });
          s.step(async () => {
            s.sound("fluss", { vol: .35, dur: 3 }); await s.show(water, "fade"); s.show(city, "up");
            s.loop((t, dt) => { off -= dt * 0.05; water.setAttribute("stroke-dashoffset", off); });
            await s.show(cards[3], "up"); s.say("Im Wasserschloss wurde das Wasser verteilt: an Brunnen, Thermen und Häuser.");
          });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Aquädukte in echt",
        say: "Viele Bögen der Aquädukte stehen noch heute. Und eine Leitung bringt sogar heute noch Wasser in die Stadt.",
        build(s) {
          const f1 = s.photo("aquaedukt-claudia", { w: 580, h: 520, caption: "Aquädukt-Bögen bei Rom", kb: true });
          const f2 = s.photo("trevi-brunnen", { w: "100%", h: 230, caption: "Der Trevi-Brunnen in Rom", cls: "later" });
          const e = later(exc(s, "2.000 Jahre in Betrieb", "", p(s, "small", "Die Aqua Virgo wurde 19 v. Chr. gebaut. Sie läuft fast ganz unter der Erde und bringt bis heute Wasser zum Trevi-Brunnen.")));
          const lf = later(lifeBox(s, "", p(s, "small", "Berlins Trinkwasser kommt ganz aus dem Grundwasser. Wasserwerke wie in Tegel oder Friedrichshagen pumpen es herauf.")));
          s.add(grid(s, "580px 1fr", f1, stack(s, 12, f2, e, lf)));
          s.show(f1, "fade"); s.sound("wind", { vol: .25, dur: 3 });
          s.step(async () => { s.sound("water-pour", { vol: .4 }); await s.show(f2, "zoom"); await s.show(e, "up"); s.say("Der Trevi-Brunnen bekommt sein Wasser bis heute aus einem römischen Aquädukt."); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Die Thermen: Baden mit allen",
        say: "In den Thermen trafen sich die Römer zum Baden, zum Sport und zum Plaudern. Man ging von Raum zu Raum: lauwarm, heiß, kalt.",
        build(s) {
          const W = 560, H = 300, svg = svgBox(s, W, H);
          const ROOMS = [["Umkleide", "", "#d6d9de"], ["Tepidarium", "lauwarm", "#f6c48a"], ["Caldarium", "heiß", "#ef7a5a"], ["Frigidarium", "kalt", "#8cc4ec"]];
          const rg = ROOMS.map(([n, d, col], i) => { const x = i * 145, g = later(s.el("g")); g.append(s.el("rect", { x, y: 14, width: 125, height: 110, rx: 10, fill: col }), txt(s, x + 62, 62, n, { "font-size": 19 }), txt(s, x + 62, 94, d, { "font-size": 19, fill: PEN })); if (i < 3) g.append(s.el("path", { d: `M${x + 129} 69 L${x + 141} 69 M${x + 135} 63 L${x + 141} 69 L${x + 135} 75`, stroke: INK, "stroke-width": 3, fill: "none" })); svg.append(g); return g; });
          const walker = later(s.el("circle", { cx: 62, cy: 112, r: 8, fill: C, stroke: "#fff", "stroke-width": 2 }));
          svg.append(walker);
          // hypocaust
          const hy = later(s.el("g"));
          hy.append(s.el("rect", { x: 110, y: 168, width: 430, height: 16, fill: "#c9b07a", stroke: "#8a6a3a", "stroke-width": 2 }));
          for (let x = 130; x <= 520; x += 39) hy.append(s.el("rect", { x: x - 7, y: 184, width: 14, height: 52, fill: "#b5651d" }));
          hy.append(s.el("rect", { x: 110, y: 236, width: 430, height: 10, fill: "#8a6a3a" }));
          hy.append(s.el("path", { d: "M40 236 C28 212 46 200 42 180 C58 196 66 214 54 236 Z", fill: "#ff7a1a" }), s.el("path", { d: "M44 236 C38 222 48 214 46 202 C54 214 56 226 52 236 Z", fill: "#ffd23a" }));
          hy.append(txt(s, 48, 170, "Ofen", { "font-size": 19, fill: RED }));
          const air = s.el("path", { d: "M70 212 C120 196 160 226 210 210 C260 194 300 226 350 210 C400 194 440 226 500 210", stroke: RED, "stroke-width": 4, fill: "none", "stroke-dasharray": "10 8" });
          hy.append(air, txt(s, 325, 278, "Fußbodenheizung: heiße Luft unter dem Boden", { "font-size": 19, fill: RED }));
          svg.append(hy);
          const ph = s.photo("caracalla-thermen", { w: 560, h: 236, caption: "Ruinen der Caracalla-Thermen, Rom", cls: "later" });
          const c1 = card(s, C, "Caracalla-Thermen", "216 n. Chr. fertig. Ein Schwimmbecken 50 m lang, dazu Sporthallen, Bibliotheken und Friseure.");
          const c2 = card(s, RED, "Harte Arbeit im Keller", "Über 100 Sklaven heizten 49 Öfen. Dafür brauchte man rund 10 Tonnen Holz am Tag.");
          const lf = later(lifeBox(s, "", p(s, "small", "Heute: Schwimmhalle und Sauna. Wer erst warm badet und dann kalt duscht, macht es wie die Römer!")));
          s.add(grid(s, "560px 1fr", stack(s, 10, svg, ph), stack(s, 12, c1, c2, lf)));
          s.sfx.pop();
          let off = 0;
          s.step(async () => {
            for (let i = 0; i < 4; i++) { if (!s.alive) return; s.show(rg[i], "pop"); s.sfx.note([0, 4, 7, 12][i], 0.15); await s.wait(s.fast ? 0 : 250); }
            await s.show(walker, "pop");
            for (let i = 1; i < 4; i++) { if (!s.alive) return; const x0 = (i - 1) * 145 + 62, x1 = i * 145 + 62; await s.tween({ from: x0, to: x1, dur: 600, ease: "inOut", update: v => walker.setAttribute("cx", v) }); s.sfx.pop(); }
            s.sound("splash", { vol: .4 }); s.say("Erst lauwarm, dann heiß, zum Schluss kalt.");
          });
          s.step(async () => { s.sound("fire", { vol: .4, dur: 3 }); await s.show(hy, "up"); s.loop((t, dt) => { off -= dt * 0.04; air.setAttribute("stroke-dashoffset", off); }); await s.show(c2, "left"); s.say("Unter dem Boden strömte heiße Luft vom Ofen."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(ph, "zoom"); await s.show(c1, "left"); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Das Kolosseum",
        say: "Das Kolosseum war das größte Amphitheater der Römer. Rund fünfzigtausend Menschen sahen hier zu.",
        build(s) {
          const ph = s.photo("kolosseum", { w: "100%", h: 290, caption: "Das Kolosseum in Rom", kb: true });
          const W = 520, H = 200, svg = svgBox(s, W, H);
          const MAXV = 80000, L = 10, BW = W - 20;
          const bars = [["Kolosseum, Rom", 50000, C, 40], ["Olympiastadion Berlin", 74475, BLUE, 130]].map(([n, v, col, y]) => {
            const lab = txt(s, L, y - 8, n, { "text-anchor": "start", "font-size": 20, fill: col });
            const r = s.el("rect", { x: L, y, width: 0, height: 40, rx: 8, fill: col });
            const val = txt(s, L + 12, y + 28, "", { "text-anchor": "start", "font-size": 21, fill: "#fff" });
            svg.append(lab, r, val); return { r, val, v };
          });
          const grow = async b => { await s.tween({ from: 0, to: b.v, dur: 1000, ease: "out", update: v => { b.r.setAttribute("width", BW * v / MAXV); b.val.textContent = s.fmt(Math.round(v / 100) * 100); } }); b.val.textContent = (b.v === 50000 ? "rund " : "") + s.fmt(b.v) + " Plätze"; };
          const c1 = card(s, C, "Eröffnet 80 n. Chr.", "mit Spielen, die 100 Tage dauerten. Gebaut ab 72 n. Chr.: 188 m lang, 156 m breit, 48 m hoch.");
          const c2 = card(s, RED, "Was wurde gezeigt?", "Kämpfe von Gladiatoren und Jagden auf wilde Tiere. Für die Römer Unterhaltung, für uns heute grausam.");
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%", justifyContent: "center" } }, ph, s.h("div", { style: { display: "grid", gridTemplateColumns: "520px 1fr", gap: "20px", alignItems: "center" } }, svg, stack(s, 10, c1, c2))));
          s.show(ph, "fade"); s.sfx.whoosh();
          s.step(async () => { s.sound("crowd-cheer", { vol: .35, dur: 3 }); await grow(bars[0]); s.say("Fünfzigtausend Zuschauer."); });
          s.step(async () => { s.sound("whistle", { vol: .4 }); await grow(bars[1]); s.say("Das Berliner Olympiastadion hat heute etwa vierundsiebzigtausend Plätze."); });
          s.step(async () => { s.sfx.fanfare(); await s.show(c1, "left"); });
          s.step(async () => { s.sfx.drum(); await s.show(c2, "left"); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Alle Wege führen nach Rom",
        say: "Die Römer bauten Straßen durch ihr ganzes Reich. Sie waren so gut, dass manche noch heute zu sehen sind.",
        build(s) {
          const W = 520, H = 330, svg = svgBox(s, W, H);
          svg.append(s.el("rect", { x: 0, y: 110, width: W, height: H - 110, fill: "#c9b07a" }));
          const LAYERS = [
            ["große Steine", 226, 280, "#8d8577", "stones"],
            ["Schotter", 186, 226, "#b9ad95", "gravel"],
            ["Mörtel und Sand", 156, 186, "#e7dcc2", "plain"],
            ["Pflastersteine", 122, 156, "#7d7f86", "pave"],
          ];
          const X0 = 20, X1 = 336;
          const lg = LAYERS.map(([n, y0, y1, col, kind]) => {
            const g = later(s.el("g"));
            const top = kind === "pave" ? `M${X0} ${y1 - 18} Q${(X0 + X1) / 2} ${y0 - 14} ${X1} ${y1 - 18}` : `M${X0} ${y0} L${X1} ${y0}`;
            g.append(s.el("path", { d: `${top} L${X1} ${y1} L${X0} ${y1} Z`, fill: col, stroke: "#5a4a30", "stroke-width": 1.5 }));
            if (kind === "stones") for (let x = X0 + 22; x < X1; x += 40) g.append(s.el("ellipse", { cx: x, cy: (y0 + y1) / 2, rx: 17, ry: 20, fill: "#a39b8c", stroke: "#5a4a30", "stroke-width": 1.5 }));
            if (kind === "gravel") for (let i = 0; i < 60; i++) g.append(s.el("circle", { cx: X0 + 8 + (i * 53) % (X1 - X0 - 16), cy: y0 + 8 + (i * 7) % 26, r: 3, fill: "#7d735f" }));
            if (kind === "pave") for (let x = X0 + 40; x < X1; x += 48) g.append(s.el("path", { d: `M${x} ${y1} L${x + 6} ${y0 + 4}`, stroke: "#3a3c42", "stroke-width": 2 }));
            g.append(s.el("path", { d: `M${X1 + 4} ${(y0 + y1) / 2} L${X1 + 18} ${(y0 + y1) / 2}`, stroke: INK, "stroke-width": 2 }), txt(s, X1 + 22, (y0 + y1) / 2 + 7, n, { "text-anchor": "start", "font-size": 19 }));
            svg.append(g); return g;
          });
          const rain = later(s.el("g"));
          rain.append(s.el("path", { d: "M178 96 Q110 100 30 116", stroke: WATER, "stroke-width": 4, fill: "none", "stroke-dasharray": "8 6" }), s.el("path", { d: "M178 96 Q250 100 330 116", stroke: WATER, "stroke-width": 4, fill: "none", "stroke-dasharray": "8 6" }));
          rain.append(txt(s, 190, 60, "Gewölbt: Regen läuft zur Seite ab", Object.assign({ "font-size": 19, fill: BLUE }, halo)));
          svg.append(rain);
          const m = merk(s, "Heute ist es ein Sprichwort: ", B(s, "„Alle Wege führen nach Rom.“"), " Es bedeutet: Es gibt viele Wege zum Ziel.");
          const ph = s.photo("via-appia", { w: "100%", h: 236, caption: "Die Via Appia bei Rom", cls: "later" });
          const c1 = card(s, C, "Via Appia: 312 v. Chr.", "Eine der ältesten großen Römerstraßen. Insgesamt über 80.000 km gepflasterte Straßen: das reicht zweimal um die Erde!");
          const c2 = card(s, GOLD, "Meilensteine", "Steine am Straßenrand zeigten die Entfernung. Gezählt wurde ab dem Goldenen Meilenstein auf dem Forum in Rom.");
          s.add(grid(s, "520px 1fr", stack(s, 12, svg, m), stack(s, 10, ph, c1, c2)));
          s.sfx.pop();
          s.step(async () => { for (let i = 0; i < 4; i++) { if (!s.alive) return; s.sound("stein-schlag", { vol: .5 }); await s.show(lg[i], "down"); } s.say("Schicht für Schicht: große Steine, Schotter, Mörtel und oben Pflaster."); });
          s.step(async () => { s.sound("rain", { vol: .3, dur: 2 }); await s.show(rain, "fade"); });
          s.step(async () => { s.sound("kutsche", { vol: .4, dur: 3 }); await s.show(ph, "zoom"); await s.show(c1, "left"); s.say("Über achtzigtausend Kilometer gepflasterte Straßen."); });
          s.step(async () => { s.sfx.coin(); await s.show(c2, "left"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Leben auf Roms Straßen",
        say: "Auf Roms Straßen war viel los: Gedränge am Tag, und in der Nacht rumpelten die Wagen. Tippe auf Tag und Nacht.",
        build(s) {
          const W = 1060, H = 290, svg = svgBox(s, W, H), G = 236;
          svg.append(s.el("rect", { x: 0, y: 0, width: W, height: H, fill: "#cfe8f7" }), s.el("rect", { x: 0, y: G, width: W, height: H - G, fill: "#a99a80" }));
          for (let x = 0; x < W; x += 30) svg.append(s.el("path", { d: `M${x} ${G} L${x + 10} ${H}`, stroke: "#8a7d66", "stroke-width": 2 }));
          const lights = [];
          const HS = [[20, 150, "#e9c79a"], [230, 120, "#f0d3a8"], [440, 170, "#e3b98a"], [650, 130, "#efcfa0"], [860, 150, "#e9c79a"]];
          HS.forEach(([x, top, col], i) => {
            svg.append(s.el("rect", { x, y: G - (G - top) - 40, width: 200, height: G - top + 40, fill: col, stroke: "#a07a4a", "stroke-width": 2 }));
            for (let r = 0; top - 2 + r * 44 < G - 76; r++) for (let c = 0; c < 4; c++) { const w = s.el("rect", { x: x + 22 + c * 46, y: top - 26 + r * 44, width: 18, height: 24, fill: "#5a7d9a" }); svg.append(w); lights.push(w); }
            svg.append(s.el("rect", { x: x + 40, y: G - 56, width: 120, height: 56, fill: "#7a4a2a" }), s.el("path", { d: `M${x + 34} ${G - 56} L${x + 166} ${G - 56} L${x + 156} ${G - 70} L${x + 44} ${G - 70} Z`, fill: ["#e05d44", "#2f9a6a", "#f2b705", "#1d5bd0", "#7b4fd6"][i] }));
          });
          const people = s.el("g");
          [[80, "#1d5bd0"], [140, "#e05d44"], [300, "#2f9a6a"], [330, "#f2b705"], [380, "#7b4fd6"], [520, "#e05d44"], [560, "#0e7490"], [700, "#1d5bd0"], [760, "#c2410c"], [800, "#2f9a6a"], [930, "#7b4fd6"], [990, "#f2b705"]].forEach(([x, col], i) => people.append(person(s, x, G + 30 + (i % 3) * 8, col, 1.1)));
          svg.append(people);
          const night = s.el("rect", { x: 0, y: 0, width: W, height: H, fill: "#0b1a3a", opacity: 0 });
          const moon = s.el("circle", { cx: 990, cy: 40, r: 22, fill: "#fff6c8", opacity: 0 });
          svg.append(night, moon);
          const carts = [0, 1].map(i => { const g = s.el("g", { opacity: 0 }); g.append(s.el("rect", { x: -60, y: -40, width: 120, height: 36, rx: 4, fill: "#8a5a2a", stroke: "#3a2410", "stroke-width": 2 }), s.el("circle", { cx: -30, cy: 0, r: 15, fill: "#3a2410" }), s.el("circle", { cx: 30, cy: 0, r: 15, fill: "#3a2410" }), s.el("rect", { x: -54, y: -60, width: 50, height: 22, fill: "#c9b07a" }), s.el("rect", { x: 2, y: -58, width: 48, height: 20, fill: "#b9ad95" })); svg.append(g); return g; });
          let isNight = false, cx0 = 0;
          const setNight = n => {
            isNight = n; night.setAttribute("opacity", n ? 0.55 : 0); moon.setAttribute("opacity", n ? 1 : 0);
            people.setAttribute("opacity", n ? 0.15 : 1); lights.forEach((w, i) => w.setAttribute("fill", n && i % 3 === 0 ? "#ffd56a" : "#5a7d9a"));
            carts.forEach(c => c.setAttribute("opacity", n ? 1 : 0));
            btn.textContent = n ? "Tag zeigen" : "Nacht zeigen";
            if (n) s.sound("kutsche", { vol: .45, dur: 3 }); else s.sound("stimmengewirr", { vol: .3, dur: 3 });
          };
          s.loop((t, dt) => { cx0 = (cx0 + dt * 0.08) % (W + 300); carts[0].setAttribute("transform", `translate(${cx0 - 150} ${G + 40})`); carts[1].setAttribute("transform", `translate(${(cx0 + 560) % (W + 300) - 150} ${G + 40})`); });
          const btn = later(s.h("button", { class: "btn", onclick: () => { s.sfx.click(); setNight(!isNight); } }, "Nacht zeigen"));
          const cards = [
            card(s, ORANGE, "Gedränge", "Enge Gassen voller Menschen. Händler rufen, Träger schleppen Waren, Tiere laufen mit."),
            card(s, "#3a2410", "Wagen nur nachts", "44 v. Chr. verbot Caesar die meisten Wagen am Tag. Darum rumpelte es nachts, schlecht zum Schlafen!"),
            card(s, GREEN, "Imbiss an der Ecke", "Viele Mieter hatten keine eigene Küche. Sie kauften warmes Essen an Straßenständen."),
          ];
          const lf = later(lifeBox(s, "", p(s, "small", "Berlin heute: Lieferwagen, Lärm und Imbissbuden an der Ecke. Manches ist wie vor 2.000 Jahren.")));
          s.add(s.h("div", { class: "stack", style: { gap: "10px", height: "100%", justifyContent: "center" } }, svg, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" } }, ...cards), s.h("div", { style: { display: "grid", gridTemplateColumns: "auto 1fr", gap: "16px", alignItems: "center" } }, btn, lf)));
          s.show(svg, "fade"); s.sound("stimmengewirr", { vol: .3, dur: 3 });
          s.step(async () => { s.sfx.pop(); await s.show(cards[0], "up"); });
          s.step(async () => { await s.show(btn, "pop"); setNight(true); await s.show(cards[1], "up"); s.say("Tagsüber durften kaum Wagen fahren. Nachts war es laut."); });
          s.step(async () => { setNight(false); s.sound("sizzle", { vol: .4, dur: 2 }); await s.show(cards[2], "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Athen und Rom im Vergleich",
        say: "Athen kennst du schon aus dem Kapitel über Demokratie. Wie unterscheidet sich die Stadt Athen von Rom?",
        build(s) {
          const ph = s.photo("akropolis", { w: 400, h: 300, caption: "Die Akropolis in Athen" });
          const m = merk(s, "Beide Städte wurden Vorbilder: ", B(s, "Athen"), " für die Demokratie, ", B(s, "Rom"), " für Straßen, Wasserleitungen und große Bauten.");
          const ROWS = [
            ["Was?", "Ein Stadtstaat (Polis): die Stadt und ihr Umland", "Hauptstadt eines riesigen Reiches"],
            ["Zentrum", "Akropolis (Burgberg mit Tempeln) und Agora (Markt- und Versammlungsplatz)", "Kapitol (Burgberg mit Tempeln) und Forum"],
            ["Wie viele Menschen?", "etwa 200.000–300.000", "wohl rund 1 Million (um Christi Geburt)"],
            ["Wer bestimmt?", "die Volksversammlung der Bürger (Kapitel 8)", "ab Augustus: der Kaiser"],
          ];
          const cell = (t, st) => s.h("div", { style: Object.assign({ padding: "8px 12px", borderRadius: "12px", fontSize: "19px", lineHeight: 1.3 }, st) }, t);
          const tpl = "150px 1fr 1fr";
          const hd = s.h("div", { style: { display: "grid", gridTemplateColumns: tpl, gap: "8px" } }, cell("", {}), cell(B(s, "Athen"), { background: "#0e7490", color: "#fff", fontSize: "23px" }), cell(B(s, "Rom"), { background: C, color: "#fff", fontSize: "23px" }));
          const rs = ROWS.map(([q, a, b]) => { const ca = later(cell(a, { background: "#dff1f5" })), cb = later(cell(b, { background: SOFT })); const r = s.h("div", { style: { display: "grid", gridTemplateColumns: tpl, gap: "8px" } }, cell(B(s, q), { background: "#fff", border: "2px solid #d8dde4" }), ca, cb); r.ca = ca; r.cb = cb; return r; });
          s.add(grid(s, "400px 1fr", stack(s, 14, ph, m), stack(s, 8, hd, ...rs)));
          s.show(ph, "fade"); s.sound("wind", { vol: .25, dur: 3 });
          rs.forEach((r, i) => s.step(async () => { s.sfx.pop(); s.show(r.ca, "left"); await s.show(r.cb, "right", 150); }));
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Berlin und Cölln an der Spree",
        say: "Auch Berlin begann an einem Fluss: Zwei kleine Kaufmannsstädte entstanden an der Spree, Berlin und Cölln.",
        build(s) {
          const ph = s.photo("memhardt-plan", { w: 560, h: 420, caption: "Plan von 1652: Berlin (rot), Cölln (gelb)", kb: true });
          const lf = later(s.h("div", { class: "life", style: { display: "grid", gridTemplateColumns: "150px 1fr", gap: "12px", alignItems: "center" } }, s.photo("nikolaiviertel", { w: 150, h: 96 }), s.h("div", null, s.h("span", { class: "exlabel" }, "Im Alltag"), p(s, "small", "Am Petriplatz und im Nikolaiviertel lag die Altstadt. Archäologen haben dort alte Fundamente gefunden."))));
          const cards = [
            card(s, ORANGE, "Um 1200", "Kaufleute siedeln an beiden Ufern der Spree: Berlin im Norden, Cölln auf der Spreeinsel."),
            card(s, C, "1237 und 1244", "Cölln wird 1237 zum ersten Mal in einer Urkunde genannt, Berlin 1244."),
            card(s, BLUE, "Der Mühlendamm", "Aus einer Furt durch die Spree wird ein Damm mit Mühlen. Hier kreuzt der Handelsweg von Magdeburg nach Frankfurt (Oder)."),
            card(s, GREEN, "1307", "Die beiden Städte schließen sich zusammen."),
          ];
          s.add(grid(s, "560px 1fr", stack(s, 12, ph, lf), stack(s, 10, ...cards)));
          s.show(ph, "fade"); s.sound("papier-rascheln", { vol: .4 });
          s.step(async () => { s.sound("fluss", { vol: .3, dur: 2 }); await s.show(cards[0], "left"); });
          s.step(async () => { s.sfx.scribble(); await s.show(cards[1], "left"); s.say("Cölln wird zwölfhundertsiebenunddreißig erwähnt, Berlin zwölfhundertvierundvierzig."); });
          s.step(async () => { s.sound("kutsche", { vol: .4, dur: 2.5 }); await s.show(cards[2], "left"); s.say("Am Mühlendamm kreuzte ein wichtiger Handelsweg die Spree."); });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(cards[3], "left"); });
          s.step(async () => { s.sound("kelle-graben", { vol: .4 }); await s.show(lf, "up"); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Berlin wächst und wächst",
        say: "Aus der kleinen Doppelstadt wurde eine Millionenstadt. Schau, wie die Zahl der Einwohner wächst.",
        build(s) {
          const DATA = [[1400, 7000], [1709, 55196], [1800, 172132], [1877, 1008566], [1900, 1888848], [1920, 3879409], [1942, 4478102], [1945, 2807405], [1990, 3433695], [2025, 3913644]];
          const W = 1060, H = 352, svg = svgBox(s, W, H), BASE = 310, MAXH = 260, SL = 104;
          svg.append(s.el("path", { d: `M10 ${BASE} L${W - 10} ${BASE}`, stroke: INK, "stroke-width": 3 }));
          const lab = v => v < 1e6 ? s.fmt(v) : s.fmt(Math.round(v / 1e5) / 10, 1) + " Mio.";
          const bars = DATA.map(([y, v], i) => {
            const x = 20 + i * SL, g = later(s.el("g"));
            const r = s.el("rect", { x: x + 14, y: BASE, width: 72, height: 0, rx: 6, fill: y === 1945 ? PEN : y >= 2025 ? BLUE : C });
            const t = txt(s, x + 50, BASE - 8, "", { "font-size": 19 });
            g.append(r, t, txt(s, x + 50, BASE + 30, String(y), { "font-size": 20, fill: PEN }));
            svg.append(g); return { g, r, t, v };
          });
          const grow = async (idx) => { idx.forEach(i => s.show(bars[i].g, "fade")); await s.tween({ from: 0, to: 1, dur: 900, ease: "out", update: k => idx.forEach(i => { const b = bars[i], h = Math.max(3, MAXH * b.v / 4.5e6 * k); b.r.setAttribute("y", BASE - h); b.r.setAttribute("height", h); b.t.setAttribute("y", BASE - h - 8); b.t.textContent = lab(Math.round(b.v * k)); }) }); idx.forEach(i => { bars[i].t.textContent = lab(bars[i].v); }); };
          const cards = [
            card(s, C, "1877: Millionenstadt", "Fabriken und Eisenbahnen locken viele Menschen vom Land in die Stadt."),
            card(s, ORANGE, "1920: Groß-Berlin", "Städte wie Spandau, Köpenick, Charlottenburg und Neukölln und viele Dörfer werden ein Teil von Berlin."),
            card(s, PEN, "1945: Krieg", "Nach dem Zweiten Weltkrieg leben viel weniger Menschen in der zerstörten Stadt."),
          ];
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%", justifyContent: "center" } }, svg, s.h("div", { class: "cols3", style: { gap: "10px" } }, ...cards)));
          s.sfx.pop();
          s.step(async () => { s.sfx.pop(); await grow([0, 1, 2]); s.say("Lange war Berlin klein: um vierzehnhundert lebten hier etwa siebentausend Menschen."); });
          s.step(async () => { s.sound("zug-vorbei", { vol: .35, dur: 2.5 }); await grow([3, 4]); await s.show(cards[0], "up"); s.say("Achtzehnhundertsiebenundsiebzig wird Berlin Millionenstadt."); });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await grow([5]); await s.show(cards[1], "up"); });
          s.step(async () => { s.sfx.drum(); await grow([6, 7]); await s.show(cards[2], "up"); });
          s.step(async () => { s.sfx.success(); await grow([8, 9]); s.say("Heute sind fast vier Millionen Menschen in Berlin gemeldet."); });
        },
      },
      /* 17 --------------------------------------------------------------- */
      {
        title: "Stadt und Land heute",
        say: "Berlin ist eine Großstadt, rundherum liegt Brandenburg mit vielen Dörfern. Wie unterscheidet sich das Leben?",
        build(s) {
          const side = (photo, cap, col, dens, dots, cars, pro) => {
            const ph = s.photo(photo, { w: "100%", h: 180, caption: cap });
            const svg = later(svgBox(s, 500, 116));
            svg.append(s.el("rect", { x: 4, y: 4, width: 108, height: 108, fill: "#fff", stroke: col, "stroke-width": 3 }));
            const ds = [];
            for (let i = 0; i < dots; i++) { const d = s.el("circle", { cx: 14 + (i % 7) * 15, cy: 14 + Math.floor(i / 7) * 15, r: 5, fill: col, opacity: 0 }); svg.append(d); ds.push(d); }
            const n = txt(s, 128, 44, "0", { "text-anchor": "start", "font-size": 28, fill: col });
            svg.append(n, txt(s, 128, 72, "Menschen auf 1 km²", { "text-anchor": "start", "font-size": 19 }), txt(s, 128, 100, "(1 Punkt = 100 Menschen)", { "text-anchor": "start", "font-size": 19, fill: PEN }));
            const carBar = s.el("rect", { x: 4, y: 0, width: 0, height: 30, rx: 6, fill: col });
            const carT = txt(s, 14, 22, "", { "text-anchor": "start", "font-size": 19, fill: "#fff" });
            const cs = later(svgBox(s, 500, 30)); cs.append(s.el("rect", { x: 4, y: 0, width: 492, height: 30, rx: 6, fill: "#eef0f3" }), carBar, carT);
            const pc = card(s, col, pro[0], pro[1]);
            return { el: stack(s, 8, ph, svg, cs, pc), svg, ds, n, dens, carBar, carT, cars, pc, cs };
          };
          const A = side("berlin-luftbild", "Berlin", BLUE, 4100, 41, 334, ["In der Stadt", "Kurze Wege, U-Bahn und Bus, viele Schulen, Kinos und Museen. Aber: Lärm, wenig Platz, teure Wohnungen."]);
          const Bz = side("dorf-uckermark", "Ein Dorf in Brandenburg", GREEN, 86, 1, 584, ["Auf dem Land", "Ruhe, Natur, Platz für Garten und Tiere. Aber: weite Wege, der Bus fährt selten, ohne Auto ist es schwer."]);
          s.add(s.h("div", { class: "cols", style: { gap: "24px", height: "100%", alignItems: "center" } }, A.el, Bz.el));
          s.sfx.pop();
          const dens = async q => { await s.show(q.svg, "fade"); const n = q.ds.length; await s.tween({ from: 0, to: 1, dur: 900, update: k => { for (let i = 0; i < Math.ceil(n * k); i++) q.ds[i].setAttribute("opacity", 1); } }); q.ds.forEach(d => d.setAttribute("opacity", 1)); };
          const car = async q => { await s.show(q.cs, "fade"); await s.tween({ from: 0, to: q.cars, dur: 800, ease: "out", update: v => { q.carBar.setAttribute("width", 492 * v / 650); q.carT.textContent = Math.round(v) + " Autos pro 1.000 Menschen"; } }); };
          s.step(async () => { s.sound("traffic", { vol: .3, dur: 2 }); await dens(A); countUp(s, A.n, 4100, { dur: 700 }); await dens(Bz); await countUp(s, Bz.n, 86, { dur: 500 }); s.say("In Berlin wohnen auf einem Quadratkilometer über viertausend Menschen, in Brandenburg nur etwa sechsundachtzig."); });
          s.step(async () => { s.sound("tram-bell", { vol: .4 }); await car(A); await car(Bz); A.carT.textContent = "334 Autos pro 1.000"; Bz.carT.textContent = "584 Autos pro 1.000"; s.say("Auf dem Land haben viel mehr Menschen ein Auto."); });
          s.step(async () => { s.sfx.pop(); s.show(A.pc, "up"); s.sound("birds", { vol: .3, dur: 3 }); await s.show(Bz.pc, "up", 200); });
        },
      },
      /* 18 --------------------------------------------------------------- */
      {
        title: "Probleme der Stadt – und Lösungen",
        say: "Eine große Stadt hat auch Probleme: Verkehr, zu wenige Wohnungen und zu wenig Grün. Was kann man tun?",
        build(s) {
          const col = (photo, cap, colr, title, prob, sol) => {
            const ph = s.photo(photo, { w: "100%", h: 150, caption: cap });
            const pr = s.h("div", { class: "card", style: { padding: "8px 12px", borderTop: `6px solid ${colr}` } }, head(s, title, colr), p(s, "small", prob));
            const so = later(s.h("div", { class: "card", style: { padding: "8px 12px", background: "#e7f6ec", borderLeft: `8px solid ${GREEN}` } }, head(s, "Lösung", GREEN), p(s, "small", sol)));
            return { el: stack(s, 8, ph, pr, so), so };
          };
          const cs = [
            col("stau-a100", "Stau auf der Stadtautobahn", RED, "Verkehr", "Stau, Lärm und Abgase.", "Mehr Bus und Bahn: Die BVG zählte 2025 rund 1,1 Milliarden Fahrten. Dazu Radwege und Busspuren."),
            col("plattenbau-marzahn", "Wohnhäuser in Marzahn", ORANGE, "Wohnen", "Viele wollen in Berlin wohnen. Wohnungen sind knapp und teuer.", "Neue Wohnungen bauen. Seit 2014 darf man Wohnungen nur mit Erlaubnis an Feriengäste vermieten."),
            col("tempelhof-oben", "Das Tempelhofer Feld", GREEN, "Zu wenig Grün", "Häuser und Straßen bedecken den Boden. Im Sommer wird es heiß.", "Parks: Das Tempelhofer Feld war bis 2008 ein Flughafen. Seit 2010 ist es ein Park, über 350 Hektar groß."),
          ];
          const m = merk(s, "Oft muss man abwägen: ", B(s, "Wohnungen bauen oder Grün erhalten?"), " 2014 stimmten die Berliner ab: Das Tempelhofer Feld bleibt frei. Gestritten wird darüber bis heute.");
          s.add(s.h("div", { class: "stack", style: { gap: "10px", height: "100%", justifyContent: "center" } }, s.h("div", { class: "cols3", style: { gap: "14px", alignItems: "start" } }, ...cs.map(c => c.el)), m));
          s.sound("traffic", { vol: .25, dur: 3 });
          s.step(async () => { s.sound("ubahn-train", { vol: .35, dur: 2.5 }); await s.show(cs[0].so, "up"); s.say("Mehr Bus, Bahn und Fahrrad."); });
          s.step(async () => { s.sfx.pop(); await s.show(cs[1].so, "up"); s.say("Mehr Wohnungen bauen."); });
          s.step(async () => { s.sound("birds", { vol: .35, dur: 3 }); await s.show(cs[2].so, "up"); s.say("Und Parks erhalten, wie das Tempelhofer Feld."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
    ],
  });
})();
