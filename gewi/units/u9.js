/* Kapitel 9 – Metallzeit: Bronze und Eisen (nach der Jungsteinzeit, Kapitel 4).
   Fakten geprüft 2026-10-04 (Wikipedia: Bronzezeit, Bronze, Eisenzeit, Rennofen, Himmelsscheibe von Nebra,
   Eberswalder Goldschatz, Berliner Goldhut, Königsgrab von Seddin, Hügelgräberkultur, Oppidum von Manching,
   Heuneburg, Hochdorf Chieftain's Grave; Euro-Münzen: EZB/Bundesbank). Quellen im Bericht. */
(() => {
  const C = "#a16207", SOFT = "#fbf1d6", INK = "#1b2740", PEN = "#5d6678";
  const CU = "#c8743a", CU2 = "#9c4f22", SN = "#b9c0c8", BR = "#b8862f", BR2 = "#8a6220", GLOW = "#ff9a2e";

  const grid = (s, tpl, ...kids) => s.h("div", { style: { display: "grid", gridTemplateColumns: tpl, gap: "24px", alignItems: "center", height: "100%" } }, ...kids);
  const exc = (s, label, cls, ...kids) => s.h("div", { class: "ex" + (cls ? " " + cls : "") }, s.h("span", { class: "exlabel" }, label), ...kids);
  const lifeBox = (s, cls, ...kids) => s.h("div", { class: "life" + (cls ? " " + cls : "") }, s.h("span", { class: "exlabel" }, "Im Alltag"), ...kids);
  const p = (s, cls, ...kids) => s.h("p", { class: cls }, ...kids);
  const B = (s, t) => s.h("b", null, t);
  const svgBox = (s, w, h) => s.el("svg", { width: w, height: h, viewBox: `0 0 ${w} ${h}` });
  const txt = (s, x, y, t, o = {}) => s.el("text", Object.assign({ x, y, "font-size": 20, "font-weight": 700, fill: INK, "text-anchor": "middle", text: t }, o));
  const halo = { stroke: "#fff", "stroke-width": 4, "paint-order": "stroke" };
  const later = el => { el.classList.add("later"); return el; };
  const fb = el => { el.style.transformBox = "fill-box"; el.style.transformOrigin = "center"; return el; };
  const mix = (a, b, t) => { const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16); const c = [16, 8, 0].map(sh => Math.round(((pa >> sh) & 255) * (1 - t) + ((pb >> sh) & 255) * t)); return `rgb(${c.join(",")})`; };
  async function countUp(s, el, to, { dur = 900, post = "", from = 0 } = {}) {
    let last = -1;
    await s.tween({ from, to, dur, ease: "out", update: v => { el.textContent = s.fmt(Math.round(v)) + post; const k = Math.floor((v - from) / ((to - from) / 8 || 1)); if (k !== last) { last = k; s.sfx.tick(); } } });
    el.textContent = s.fmt(to) + post;
  }
  // simple axe blade shape (local coords, ~80×110)
  const axeD = "M28,0 L52,0 L72,92 Q40,114 8,92 Z";

  Deck.unit({
    id: "u9", num: 9, title: "Metallzeit: Bronze und Eisen", color: C, soft: SOFT,
    subtitle: "Nach der Jungsteinzeit: Menschen lernen, Metall zu machen",
    blurb: "Nach der Jungsteinzeit: Bronze, Himmelsscheibe, Eisen und Kelten.",
    goals: ["Kupfer, Bronze und Eisen unterscheiden", "Verstehen, wie Bronze gegossen und Eisen geschmiedet wird", "Die Himmelsscheibe von Nebra und Funde aus Berlin kennen", "Die Kelten und ihre Fürstengräber kennenlernen", "Erklären, warum es nun Arme und Reiche gab"],
    icon(svg, el) {
      svg.append(el("path", { d: "M26,8 L44,8 L43,34 Q56,44 58,62 L12,62 Q14,44 27,34 Z", fill: "#d8a542", stroke: "#8a6220", "stroke-width": 3.5, "stroke-linejoin": "round" }),
        el("path", { d: "M30,20 L40,20", stroke: "#8a6220", "stroke-width": 3, "stroke-linecap": "round" }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Nach der Steinzeit: Metall!",
        say: "Nach der Jungsteinzeit lernten die Menschen, Metall herzustellen: erst Kupfer, dann Bronze, später Eisen. Die Zeitalter heißen nach dem wichtigsten Material.",
        build(s) {
          const W = 1060, svg = svgBox(s, W, 250);
          const X = y => 30 + (6000 - y) / 6000 * 1000;
          svg.append(s.el("path", { d: `M20 150 L1040 150`, stroke: INK, "stroke-width": 3 }));
          [6000, 5000, 4000, 3000, 2000, 1000, 0].forEach(y => svg.append(s.el("path", { d: `M${X(y)} 144 L${X(y)} 156`, stroke: INK, "stroke-width": 3 }), txt(s, X(y), 182, y ? s.fmt(y) : "Chr. Geb.", { "font-size": 19, "font-weight": 600, fill: PEN, "text-anchor": y === 6000 ? "start" : y === 0 ? "end" : "middle" })));
          svg.append(txt(s, 30, 214, "Jahre v. Chr.", { "font-size": 19, "font-weight": 600, fill: PEN, "text-anchor": "start" }));
          const bar = (a, b, col, name, sub) => { const g = s.el("g", { class: "later" }); g.append(s.el("rect", { x: X(a), y: 92, width: X(b) - X(a), height: 46, rx: 8, fill: col }), txt(s, (X(a) + X(b)) / 2, 122, name, { fill: "#fff", "font-size": 21 })); if (sub) g.append(txt(s, a === 5500 ? X(a) + 4 : (X(a) + X(b)) / 2, 76, sub, { fill: col, "font-size": 19, "text-anchor": a === 5500 ? "start" : "middle" })); svg.append(g); return g; };
          const bars = [bar(5500, 2200, "#c2410c", "Jungsteinzeit", "bei uns ab ca. 5500 v. Chr."), bar(2200, 800, BR, "Bronzezeit", "ca. 2200–800 v. Chr."), bar(800, 0, "#5d6678", "Eisenzeit", "ab ca. 800 v. Chr.")];
          const oetzi = s.el("g", { class: "later" }); fb(oetzi);
          oetzi.append(s.el("path", { d: `M${X(3250)} 92 L${X(3250)} 40`, stroke: CU2, "stroke-width": 3, "stroke-dasharray": "5 4" }), s.el("circle", { cx: X(3250), cy: 36, r: 7, fill: CU }), txt(s, X(3250) + 14, 30, "Ötzi trägt schon ein Beil aus Kupfer", { fill: CU2, "font-size": 19, "text-anchor": "start" }));
          svg.append(oetzi);
          const card = (lbl, col, t) => s.h("div", { class: "card later", style: { borderTop: `8px solid ${col}`, padding: "10px 16px" } }, s.h("p", { class: "t", style: { fontWeight: 700, color: col } }, lbl), p(s, "small", t));
          const cards = [card("Stein", "#c2410c", "Steinbeil, Feuersteinklinge, Pfeilspitzen – dazu Werkzeuge aus Holz und Knochen."), card("Bronze", BR2, "Schwerter, Beile, Schmuck – und die berühmte Himmelsscheibe von Nebra."), card("Eisen", "#5d6678", "Pflugscharen, Äxte, Nägel, Schwerter – Eisen wird bald überall benutzt.")];
          const merk = s.h("div", { class: "merk later" }, "Die Zeitalter heißen nach dem wichtigsten Material: ", B(s, "Stein → Bronze → Eisen"), ". Die Metallzeit folgt bei uns auf die Jungsteinzeit (Kapitel 4).");
          s.add(s.h("div", { class: "stack", style: { gap: "14px", justifyContent: "center", height: "100%" } }, svg, s.h("div", { class: "cols3" }, ...cards), merk));
          s.show(svg, "fade"); s.sfx.whoosh();
          s.step(async () => { s.sfx.pop(); await s.show(bars[0], "left"); s.show(cards[0], "up"); s.sound("stein-schlag", { vol: .6 }); await s.wait(300); s.show(oetzi, "pop"); s.say("In der Jungsteinzeit benutzte man vor allem Stein. Aber Ötzi hatte schon ein Beil aus Kupfer."); });
          s.step(async () => { s.sound("amboss", { vol: .5, dur: 1.2 }); await s.show(bars[1], "left"); await s.show(cards[1], "up"); s.say("Ab etwa 2200 vor Christus beginnt bei uns die Bronzezeit."); });
          s.step(async () => { s.sound("amboss", { vol: .5, dur: 1.2 }); await s.show(bars[2], "left"); await s.show(cards[2], "up"); s.say("Ab etwa 800 vor Christus kommt das Eisen."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Kupfer: das erste Metall",
        say: "Kupfer war das erste Metall, das Menschen bearbeiteten. Es glänzt rötlich und ist ziemlich weich.",
        build(s) {
          const ph = s.photo("kupfer-nugget", { w: 420, h: 420, caption: "Ein Klumpen reines Kupfer" });
          const th = svgBox(s, 120, 300);
          th.append(s.el("rect", { x: 46, y: 20, width: 28, height: 230, rx: 14, fill: "#fff", stroke: INK, "stroke-width": 3 }), s.el("circle", { cx: 60, cy: 262, r: 26, fill: "#dc3b2a", stroke: INK, "stroke-width": 3 }));
          const lvl = s.el("rect", { x: 53, y: 240, width: 14, height: 10, fill: "#dc3b2a" });
          th.append(lvl);
          const deg = s.h("span", { class: "big", style: { color: "#dc3b2a" } }, "0");
          const thermo = s.h("div", { class: "row later", style: { gap: "10px", flexWrap: "nowrap", alignItems: "center" } }, th, s.h("div", null, deg, p(s, "t", "Hier schmilzt Kupfer."), p(s, "small", "Dafür braucht man einen Ofen mit Holzkohle und Blasebalg.")));
          const c1 = exc(s, "Woher?", "later", p(s, "small", "Manchmal findet man reines Kupfer. Meist steckt es aber im Gestein: im ", B(s, "Erz"), ". Bergleute holen das Erz aus dem Berg."));
          const c2 = exc(s, "Weich", "later", p(s, "small", "Kupfer lässt sich hämmern und biegen. Gut für Schmuck, Nadeln und Beile – aber Klingen werden schnell stumpf."));
          s.add(grid(s, "420px 1fr", ph, s.h("div", { class: "stack", style: { gap: "12px" } }, c1, c2, thermo)));
          s.show(ph, "zoom"); s.sfx.pop();
          s.step(async () => { s.sound("spitzhacke", { vol: .6 }); await s.show(c1, "left"); });
          s.step(async () => { s.sound("amboss", { vol: .45, dur: 1.5 }); await s.show(c2, "left"); });
          s.step(async () => { await s.show(thermo, "up"); s.sound("fire", { vol: .4, dur: 3 }); s.tween({ from: 0, to: 1, dur: 1100, ease: "out", update: v => { lvl.setAttribute("y", 240 - 210 * v); lvl.setAttribute("height", 10 + 210 * v); } }); await countUp(s, deg, 1083, { dur: 1100, post: " °C" }); s.say("Kupfer schmilzt erst bei über tausend Grad."); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Bronze = Kupfer + Zinn",
        say: "Mischt man Kupfer mit ein wenig Zinn, entsteht Bronze. Bronze ist härter als Kupfer und schmilzt leichter. So eine Mischung aus Metallen heißt Legierung.",
        build(s) {
          const svg = svgBox(s, 520, 300);
          const ingot = (x, col, col2, label, sub) => { const g = s.el("g"); g.append(s.el("path", { d: `M${x},170 L${x + 20},130 L${x + 130},130 L${x + 150},170 Z`, fill: col, stroke: col2, "stroke-width": 3 }), txt(s, x + 75, 158, label, { fill: "#fff", "font-size": 21 }), txt(s, x + 75, 202, sub, { fill: PEN, "font-size": 19 })); svg.append(g); return g; };
          const cu = ingot(10, CU, CU2, "Kupfer", "viel");
          const sn = later(ingot(200, "#9aa3ad", "#6f7983", "Zinn", "wenig"));
          const plus = later(txt(s, 182, 160, "+", { "font-size": 34 }));
          const eq = later(txt(s, 372, 160, "=", { "font-size": 34 }));
          svg.append(plus, eq);
          const bronze = later(s.el("g")); fb(bronze);
          const bz = s.el("path", { d: "M390,170 L405,130 L500,130 L515,170 Z", fill: BR, stroke: BR2, "stroke-width": 3 });
          bronze.append(bz, txt(s, 452, 158, "Bronze", { fill: "#fff", "font-size": 21 }), txt(s, 452, 202, "Legierung", { fill: BR2, "font-size": 19 }));
          svg.append(bronze);
          // meters
          const hard = s.el("rect", { x: 130, y: 236, width: 0, height: 22, rx: 6, fill: C });
          const hardV = txt(s, 0, 0, "");
          svg.append(txt(s, 10, 254, "Härte", { "text-anchor": "start", "font-size": 19 }), s.el("rect", { x: 130, y: 236, width: 380, height: 22, rx: 6, fill: "#eee6d4" }), hard, txt(s, 136, 288, "weich", { "text-anchor": "start", "font-size": 19, fill: PEN, "font-weight": 600 }), txt(s, 506, 288, "hart, aber spröde", { "text-anchor": "end", "font-size": 19, fill: PEN, "font-weight": 600 }));
          const read = s.h("p", { class: "t" });
          const melt = s.h("p", { class: "t" });
          const set = v => { hard.setAttribute("width", 60 + 320 * v / 25); bz.setAttribute("fill", mix(CU, "#d9c38a", v / 25)); read.innerHTML = `<b>${100 - v} %</b> Kupfer + <b>${v} %</b> Zinn`; melt.innerHTML = `schmilzt bei ca. <b>${s.fmt(Math.round((1083 - 9.15 * Math.min(v, 20)) / 10) * 10)} °C</b>`; };
          const sl = s.slider({ label: "Zinn", min: 0, max: 25, step: 1, value: 10, fmt: v => v + " %", onInput: set });
          const box = s.h("div", { class: "card later", style: { padding: "10px 16px" } }, read, melt, sl);
          set(10);
          const ex3 = exc(s, "Legierungen im Alltag", "later", p(s, "small", B(s, "Bronze"), " = Kupfer + Zinn: Glocken, Medaillen. ", B(s, "Messing"), " = Kupfer + Zink: Türklinken, Trompeten. ", B(s, "Stahl"), " = Eisen + etwas Kohlenstoff: Fahrrad, Schienen."));
          const merk = s.h("div", { class: "merk later" }, "Für Werkzeuge nahm man etwa ", B(s, "9 Teile Kupfer + 1 Teil Zinn"), ". Mehr Zinn macht Bronze härter – zu viel macht sie spröde.");
          s.add(grid(s, "520px 1fr", s.h("div", { class: "stack", style: { gap: "12px" } }, svg, merk), s.h("div", { class: "stack", style: { gap: "14px" } }, box, ex3)));
          s.show(svg, "fade"); s.sfx.pop();
          s.step(async () => { s.sfx.pop(); s.show(plus, "pop"); await s.show(sn, "left"); s.sound("fire", { vol: .4, dur: 2.5 }); s.show(eq, "pop"); await s.show(bronze, "zoom"); s.sfx.chord([0, 4, 7]); s.say("Kupfer und Zinn zusammen geschmolzen ergeben Bronze."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(box, "left"); await s.tween({ from: 0, to: 10, dur: 900, update: v => set(Math.round(v)) }); s.say("Schiebe den Regler: Wie viel Zinn kommt hinein?"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sound("church-bells", { vol: .35, dur: 3 }); await s.show(ex3, "up"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Bergbau und weiter Handel",
        say: "Kupfer gab es in den Bergen, zum Beispiel in den Alpen. Zinn war selten und kam von weit her. Darum entstanden lange Handelswege.",
        build(s) {
          const k = 27.6, X = lon => (lon + 10) * k * 0.62, Y = lat => (58 - lat) * k;
          const P = a => "M" + a.map(([lo, la]) => `${X(lo).toFixed(1)},${Y(la).toFixed(1)}`).join(" L") + " Z";
          const svg = svgBox(s, 600, 414);
          svg.append(s.el("rect", { x: 0, y: 0, width: 600, height: 414, rx: 14, fill: "#bfe0f5" }));
          const land = "#efe6cf", lands = [
            [[-9.3, 43], [-8, 43.7], [-5, 43.5], [-1.8, 43.4], [-1.4, 44.5], [-1.2, 46], [-2.2, 47.1], [-4.4, 47.8], [-4.7, 48.4], [-3, 48.8], [-1.6, 48.7], [-1.9, 49.7], [-1.2, 49.4], [0.2, 49.5], [1.5, 50.2], [1.6, 50.9], [2.5, 51.1], [3.6, 51.4], [4.2, 52], [4.7, 52.9], [5.6, 53.4], [7, 53.6], [8.3, 53.6], [8.9, 53.9], [8.6, 54.5], [8.6, 55.4], [8.1, 56.5], [8.6, 57.1], [10, 57.6], [10.5, 57], [10.3, 56.5], [10.9, 56.4], [10, 55.7], [10, 55], [9.9, 54.6], [10.9, 54], [12.5, 54.4], [14.2, 53.9], [16.5, 54.5], [18.6, 54.7], [19.6, 54.4], [21.1, 55.3], [21, 56.8], [21.6, 57.4], [23, 57], [24.3, 57.2], [24.4, 58], [25.5, 58], [25.5, 42], [-9.3, 42]],
            [[10.9, 55.7], [12.6, 56], [12.4, 55.3], [11.7, 55], [11, 55.4]],
            [[11.3, 58.2], [11.9, 57.4], [12.6, 56.3], [12.9, 55.4], [14.3, 55.5], [14.4, 56], [15.9, 56.1], [16.5, 56.8], [16.7, 57.8], [16.9, 58.2]],
            [[-5.7, 50.05], [-4, 50.4], [-1, 50.7], [1.4, 51.2], [1.7, 52.6], [0.3, 53.2], [-0.2, 54.2], [-1.5, 55], [-2, 56], [-3, 56], [-2, 57.5], [-2, 58.2], [-5, 58.2], [-5.6, 56.5], [-4.9, 55.6], [-3, 54.9], [-3.3, 54], [-3, 53.4], [-4.6, 53.3], [-4.2, 52.3], [-5.2, 51.7], [-3, 51.4], [-4.2, 51.2], [-5.7, 50.05]],
            [[-6, 52], [-6, 54], [-6.6, 55.2], [-8.5, 55], [-10, 54], [-10, 51.6], [-8.5, 51.6], [-6.4, 52.2]],
          ];
          lands.forEach(a => svg.append(s.el("path", { d: P(a), fill: land, stroke: "#c9b98f", "stroke-width": 1.5 })));
          svg.append(s.el("path", { d: P([[6, 46.2], [7.5, 45.8], [10, 46.2], [13, 46.4], [16, 47.2], [15.4, 47.8], [13, 47.75], [10, 47.5], [7.6, 47.5], [6.2, 46.7]]), fill: "#b88a55" }));
          svg.append(txt(s, X(3), Y(55.6), "Nordsee", { fill: "#1d5bd0", "font-size": 19, "font-style": "italic" }), txt(s, X(18.5), Y(56.3), "Ostsee", { fill: "#1d5bd0", "font-size": 19, "font-style": "italic" }));
          const dot = (lon, lat, col, label, dx, dy, anchor) => { const g = s.el("g", { class: "later" }); g.append(s.el("circle", { cx: X(lon), cy: Y(lat), r: 9, fill: col, stroke: "#fff", "stroke-width": 3 }), txt(s, X(lon) + dx, Y(lat) + dy, label, Object.assign({ fill: col, "font-size": 20, "text-anchor": anchor || "middle" }, halo))); svg.append(g); return g; };
          const corn = dot(-5, 50.3, "#5d6678", "Cornwall: Zinn, Gold", -6, 38, "start");
          const mitt = dot(13.1, 47.4, CU2, "Kupfer aus den Alpen", 0, 36);
          const nebra = dot(11.6, 51.3, C, "Nebra", -12, 6, "end");
          svg.append(s.el("circle", { cx: X(13.4), cy: Y(52.5), r: 5, fill: INK }), txt(s, X(13.4) + 9, Y(52.5) - 8, "Berlin", Object.assign({ "font-size": 19, "text-anchor": "start" }, halo)));
          const route = (d, col) => { const e = s.el("path", { d, fill: "none", stroke: col, "stroke-width": 5, "stroke-dasharray": "10 8", "stroke-linecap": "round", class: "later" }); svg.insertBefore(e, corn); return e; };
          const r1 = route(`M${X(-5)},${Y(50.3)} Q${X(3)},${Y(53.5)} ${X(11.6)},${Y(51.3)}`, "#5d6678");
          const r2 = route(`M${X(13.1)},${Y(47.4)} Q${X(14)},${Y(49.5)} ${X(11.6)},${Y(51.3)}`, CU2);
          const ph = s.photo("zinnstein", { w: "100%", h: 190, caption: "Zinnstein: daraus gewinnt man Zinn", cls: "later" });
          const c1 = exc(s, "Bergbau", "later", p(s, "small", "Bergleute schlugen das Kupfererz aus dem Berg, zum Beispiel am Mitterberg in den Alpen (Österreich)."));
          const c2 = exc(s, "Zinn ist selten", "later", p(s, "small", "Zinn kam oft von weit her, etwa aus Cornwall in England. Händler tauschten es gegen andere Waren."));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "20px" } }, "Die Himmelsscheibe von Nebra: Kupfer aus den ", B(s, "Alpen"), ", Zinn und Gold aus ", B(s, "Cornwall"), ".");
          s.add(grid(s, "600px 1fr", svg, s.h("div", { class: "stack", style: { gap: "10px" } }, ph, c1, c2, merk)));
          s.show(svg, "fade"); s.sfx.whoosh();
          s.step(async () => { s.sound("spitzhacke", { vol: .6 }); s.show(mitt, "pop"); await s.show(c1, "left"); });
          s.step(async () => { s.sfx.pop(); s.show(corn, "pop"); s.show(ph, "zoom"); await s.show(c2, "left"); });
          s.step(async () => { s.sfx.whoosh(); s.show(nebra, "pop"); s.show(r1, "draw"); await s.show(r2, "draw"); s.sfx.coin(); await s.show(merk, "up"); s.say("Die Rohstoffe für die Himmelsscheibe reisten hunderte Kilometer weit."); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Bronzeguss Schritt für Schritt",
        say: "So wurde ein Bronzebeil gegossen: schmelzen, gießen, abkühlen, schleifen.",
        build(s) {
          const svg = svgBox(s, 580, 380);
          svg.append(s.el("rect", { x: 0, y: 320, width: 580, height: 60, fill: "#d8c4a0" }));
          // hearth
          svg.append(s.el("path", { d: "M40,320 L60,250 L200,250 L220,320 Z", fill: "#a8794a", stroke: "#6b4a22", "stroke-width": 3 }));
          const coals = s.el("g");
          [70, 95, 120, 145, 170, 190].forEach((x, i) => coals.append(s.el("circle", { cx: x, cy: 254 + (i % 2) * 4, r: 12, fill: "#2b2b2b" })));
          svg.append(coals);
          const fire = s.el("g", { opacity: 0 });
          [[80, 250], [130, 246], [180, 250]].forEach(([x, y]) => fire.append(s.el("path", { d: `M${x - 16},${y} Q${x - 10},${y - 40} ${x},${y - 56} Q${x + 10},${y - 40} ${x + 16},${y} Z`, fill: GLOW, opacity: .85 })));
          svg.append(fire);
          // crucible (group, moves)
          const cru = s.el("g", { transform: "translate(130 210)" });
          const cruBody = s.el("path", { d: "M-34,-40 L34,-40 L26,10 L-26,10 Z", fill: "#8a6a4a", stroke: "#4a3420", "stroke-width": 3 });
          const melt = s.el("path", { d: "M-31,-34 L31,-34 L29,-24 L-29,-24 Z", fill: CU });
          cru.append(cruBody, melt);
          svg.append(cru);
          // mould (two halves) with axe-shaped cavity
          const MX = 430, MY = 150;
          const left = s.el("g"), right = s.el("g");
          left.append(s.el("rect", { x: MX - 70, y: MY, width: 70, height: 170, fill: "#9c9a92", stroke: "#5f5d57", "stroke-width": 3 }));
          right.append(s.el("rect", { x: MX, y: MY, width: 70, height: 170, fill: "#b4b2aa", stroke: "#5f5d57", "stroke-width": 3 }));
          const cav = s.el("path", { d: axeD, transform: `translate(${MX - 40} ${MY + 40})`, fill: "#3b3a36" });
          const clipId = "bg" + Math.random().toString(36).slice(2, 7);
          const clipRect = s.el("rect", { x: MX - 60, y: MY + 150, width: 120, height: 0 });
          svg.append(s.el("defs", null, s.el("clipPath", { id: clipId }, clipRect)));
          const fill = s.el("path", { d: axeD, transform: `translate(${MX - 40} ${MY + 40})`, fill: GLOW, "clip-path": `url(#${clipId})` });
          const funnel = s.el("path", { d: `M${MX - 18},${MY} L${MX + 18},${MY} L${MX + 6},${MY + 40} L${MX - 6},${MY + 40} Z`, fill: "#3b3a36" });
          svg.append(left, right, cav, fill, funnel);
          const stream = s.el("path", { d: `M${MX - 4},${MY - 70} L${MX + 4},${MY - 70} L${MX + 4},${MY + 2} L${MX - 4},${MY + 2} Z`, fill: GLOW, opacity: 0 });
          svg.append(stream);
          const axe = s.el("path", { d: axeD, transform: `translate(${MX - 40} ${MY + 40})`, fill: BR, stroke: BR2, "stroke-width": 3, opacity: 0 });
          svg.append(axe);
          const shine = s.el("path", { d: `M${MX - 34},${MY + 146} L${MX + 40},${MY + 146}`, stroke: "#fff6c8", "stroke-width": 5, "stroke-linecap": "round", opacity: 0 });
          svg.append(shine);
          const tempT = txt(s, 130, 128, "", { fill: "#dc3b2a", "font-size": 24 });
          svg.append(tempT);
          const lbls = ["1. Schmelzen", "2. Gießen", "3. Abkühlen und öffnen", "4. Schleifen"];
          const head = txt(s, 290, 34, "Bronze-Stücke kommen in den Tiegel", { "font-size": 22, fill: C });
          svg.append(head);
          const steps = [
            ["Schmelzen", "Im Holzkohlefeuer, angeblasen mit einem Blasebalg, wird die Bronze flüssig: rund 1.000 °C."],
            ["Gießen", "Die glühende Bronze fließt in eine Gussform aus Stein oder Ton."],
            ["Abkühlen", "Die Bronze wird fest. Dann öffnet man die Form – fertig ist das Beil!"],
            ["Schleifen", "Die Schneide wird geschliffen und gehämmert, bis sie scharf ist."],
          ].map(([a, b], i) => s.h("div", { class: "later", style: { display: "grid", gridTemplateColumns: "40px 1fr", gap: "10px", alignItems: "start" } }, s.h("span", { class: "chip", style: { background: C, color: "#fff", fontWeight: 700, justifyContent: "center" } }, String(i + 1)), p(s, "small", B(s, a + ": "), b)));
          const ph = s.photo("gussform-stein", { w: "100%", h: 170, caption: "Gussformen aus der Bronzezeit" });
          const lf = lifeBox(s, "later", p(s, "small", "Gießen in Formen gibt es heute noch: Schoko-Osterhasen, Eiswürfel, Kerzen – und große Kirchenglocken."));
          s.add(grid(s, "580px 1fr", svg, s.h("div", { class: "stack", style: { gap: "10px" } }, ph, ...steps, lf)));
          s.sfx.pop();
          s.step(async () => {
            head.textContent = lbls[0]; s.sound("fire", { vol: .45, dur: 3 }); s.show(steps[0], "left");
            await s.tween({ from: 0, to: 1, dur: 1200, update: v => { fire.setAttribute("opacity", v); melt.setAttribute("fill", mix(CU, GLOW, v)); tempT.textContent = s.fmt(Math.round(1000 * v / 50) * 50) + " °C"; } });
            s.say("Erst wird die Bronze im Feuer geschmolzen.");
          });
          s.step(async () => {
            head.textContent = lbls[1]; tempT.textContent = ""; s.show(steps[1], "left");
            await s.tween({ from: 0, to: 1, dur: 700, ease: "inOut", update: v => cru.setAttribute("transform", `translate(${130 + (MX - 130 - 30) * v} ${210 - 110 * v}) rotate(${70 * v})`) });
            stream.setAttribute("opacity", 1); s.sound("sizzle", { vol: .45, dur: 2.5 });
            await s.tween({ from: 0, to: 1, dur: 1200, update: v => { clipRect.setAttribute("y", MY + 150 - 112 * v); clipRect.setAttribute("height", 112 * v); } });
            stream.setAttribute("opacity", 0); fire.setAttribute("opacity", 0.4);
            await s.tween({ from: 1, to: 0, dur: 500, update: v => cru.setAttribute("transform", `translate(${130 + (MX - 130 - 30) * v} ${210 - 110 * v}) rotate(${70 * v})`) });
            s.say("Dann gießt man sie in die Form.");
          });
          s.step(async () => {
            head.textContent = lbls[2]; s.show(steps[2], "left");
            await s.tween({ from: 0, to: 1, dur: 900, update: v => fill.setAttribute("fill", mix(GLOW, BR, v)) });
            s.sfx.swoosh();
            await s.tween({ from: 0, to: 1, dur: 700, ease: "inOut", update: v => { left.setAttribute("transform", `translate(${-70 * v} 0)`); right.setAttribute("transform", `translate(${70 * v} 0)`); funnel.setAttribute("opacity", 1 - v); cav.setAttribute("opacity", 1 - v); } });
            fill.setAttribute("opacity", 0); axe.setAttribute("opacity", 1); s.sfx.ding();
            s.say("Nach dem Abkühlen öffnet man die Form.");
          });
          s.step(async () => {
            head.textContent = lbls[3]; s.show(steps[3], "left"); s.sound("amboss", { vol: .5, dur: 2 });
            await s.tween({ from: 0, to: 1, dur: 800, update: v => shine.setAttribute("opacity", Math.sin(v * Math.PI)) });
            shine.setAttribute("opacity", 1); s.sfx.success();
          });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Was man aus Bronze machte",
        say: "Aus Bronze machte man Werkzeuge, Waffen und Schmuck. Wer viel Bronze besaß, war reich.",
        build(s) {
          const ph = s.photo("bronze-waffen", { w: 500, h: 460, caption: "Schwerter, Lanzenspitzen und Beile aus Bronze", pos: "50% 55%" });
          const c = [
            exc(s, "Werkzeuge", "later", p(s, "small", "Beile zum Holzfällen, Sicheln für die Ernte, Meißel und Messer.")),
            exc(s, "Waffen", "later", p(s, "small", "Schwerter, Dolche und Lanzenspitzen. Das Schwert ist eine Erfindung der Bronzezeit.")),
            exc(s, "Schmuck", "later", p(s, "small", "Armringe, Halsringe, Nadeln und Spangen für die Kleidung.")),
          ];
          const lf = lifeBox(s, "later", p(s, "small", "Bronze war wertvoll – fast wie Geld. Wer viele Bronzesachen hatte, zeigte damit seinen Reichtum. Heute zeigt man das mit teurem Schmuck oder einem großen Auto."));
          s.add(grid(s, "500px 1fr", ph, s.h("div", { class: "stack", style: { gap: "12px" } }, ...c, lf)));
          s.show(ph, "zoom"); s.sfx.pop();
          s.step(async () => { s.sound("amboss", { vol: .45, dur: 1 }); await s.show(c[0], "left"); });
          s.step(async () => { s.sfx.zap(); await s.show(c[1], "left"); });
          s.step(async () => { s.sound("glass-clink", { vol: .5 }); await s.show(c[2], "left"); });
          s.step(async () => { s.sound("coins", { vol: .5 }); await s.show(lf, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Die Himmelsscheibe von Nebra",
        say: "Die Himmelsscheibe von Nebra ist eine Scheibe aus Bronze mit goldenen Zeichen. Sie gilt als älteste konkrete Darstellung des Himmels, die wir kennen.",
        build(s) {
          const wrap = s.h("div", { style: { position: "relative", width: "440px", height: "434px" } });
          const ph = s.photo("nebra-scheibe", { w: 440, h: 434, caption: "Landesmuseum für Vorgeschichte, Halle" });
          const ov = s.el("svg", { viewBox: "0 0 1000 987", width: 440, height: 434, style: "position:absolute;left:0;top:0;pointer-events:none" });
          wrap.append(ph, ov);
          const ring = (d, n, nx, ny) => { const g = s.el("g", { class: "later" }); g.append(s.el("path", { d, fill: "none", stroke: "#ffd94a", "stroke-width": 12, "stroke-dasharray": "26 14" }), s.el("circle", { cx: nx, cy: ny, r: 40, fill: "#dc3b2a", stroke: "#fff", "stroke-width": 6 }), s.el("text", { x: nx, y: ny + 17, "text-anchor": "middle", "font-size": 50, "font-weight": 800, fill: "#fff", text: String(n) })); ov.append(g); return g; };
          const rings = [
            ring("M380,340 a155,155 0 1,0 0.1,0", 1, 230, 330),
            ring("M745,290 Q900,470 640,660 Q820,470 745,290 Z", 2, 650, 540),
            ring("M580,205 a100,100 0 1,0 0.1,0", 3, 460, 200),
            ring("M800,190 L880,200 L950,520 L880,760 L800,740 L860,500 Z M60,250 L170,215 L120,760 L50,640 Z", 4, 920, 860),
            ring("M310,730 Q520,950 740,770 L720,800 Q520,960 320,760 Z", 5, 230, 820),
          ];
          const items = [
            ["Sonne oder Vollmond", "die große goldene Scheibe"],
            ["Mondsichel", "der zunehmende oder abnehmende Mond"],
            ["Sterne", "die Gruppe aus sieben Punkten sind wohl die Plejaden (Siebengestirn)"],
            ["Horizontbögen", "zeigen, wie weit der Sonnenaufgang im Jahr wandert – der linke ging verloren"],
            ["Barke", "vielleicht ein Schiff, das die Sonne über den Himmel fährt"],
          ].map(([a, b], i) => s.h("div", { class: "later", style: { display: "grid", gridTemplateColumns: "38px 1fr", gap: "10px", alignItems: "start" } }, s.h("span", { class: "chip", style: { background: "#dc3b2a", color: "#fff", fontWeight: 700, justifyContent: "center" } }, String(i + 1)), p(s, "small", B(s, a + ": "), b)));
          const facts = s.h("div", { class: "merk later", style: { fontSize: "20px", padding: "8px 14px" } }, "Bronze mit Gold, ", B(s, "32 cm"), ", etwa 2 kg. Vergraben um ", B(s, "1600 v. Chr."), " – vor etwa 3.600 Jahren – auf dem Mittelberg bei Nebra (Sachsen-Anhalt).");
          s.add(grid(s, "440px 1fr", wrap, s.h("div", { class: "stack", style: { gap: "10px" } }, ...items, facts)));
          s.show(wrap, "zoom"); s.sfx.whoosh();
          const sh = async (i, snd, say) => { snd(); s.show(rings[i], "fade"); await s.show(items[i], "left"); s.say(say); };
          s.step(() => sh(0, () => s.sfx.chord([0, 4, 7]), "Die große Scheibe ist die Sonne oder der Vollmond."));
          s.step(() => sh(1, () => s.sfx.note(7, .4), "Daneben: eine Mondsichel."));
          s.step(() => sh(2, () => s.sound("magic-chime", { vol: .5 }), "Die sieben Punkte sind wahrscheinlich das Siebengestirn, die Plejaden."));
          s.step(() => sh(3, () => s.sfx.swoosh(), "Am Rand: Horizontbögen. Einer ging verloren."));
          s.step(() => sh(4, () => s.sound("ruder", { vol: .45, dur: 2.5 }), "Unten fährt eine Barke, ein Schiff."));
          s.step(async () => { s.sfx.ding(); await s.show(facts, "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Ein Krimi: die Raubgräber",
        say: "Die Himmelsscheibe wurde nicht von Archäologen gefunden, sondern von Raubgräbern. Ihre Geschichte ist ein echter Krimi.",
        build(s) {
          const scene = draw => { const v = svgBox(s, 230, 130); v.append(s.el("rect", { x: 0, y: 0, width: 230, height: 130, rx: 12, fill: "#f4ede0" })); draw(v); return v; };
          const panels = [
            ["4. Juli 1999", "Zwei Männer suchen mit Metallsuchgeräten verbotenerweise auf dem Mittelberg. Sie graben die Scheibe aus und beschädigen sie dabei.", scene(v => v.append(s.el("path", { d: "M0,110 Q115,40 230,110 L230,130 L0,130 Z", fill: "#7cbf5a" }), s.el("path", { d: "M90,40 L120,100 M112,96 a16,7 0 1,0 20,0", stroke: INK, "stroke-width": 5, fill: "none", "stroke-linecap": "round" }), s.el("ellipse", { cx: 160, cy: 92, rx: 18, ry: 6, fill: BR })))],
            ["Verkauft!", "Sie verkaufen die Scheibe heimlich. Hehler verlangen später 700.000 Mark dafür.", scene(v => v.append(s.el("path", { d: "M90,50 Q80,30 100,28 L130,28 Q150,30 140,50 Q170,70 160,110 L70,110 Q60,70 90,50 Z", fill: "#d9b45a", stroke: "#8a6a2a", "stroke-width": 3 }), txt(s, 115, 92, "€?", { "font-size": 30, fill: "#8a6a2a" })))],
            ["23. Februar 2002", "In einem Hotel in Basel (Schweiz) gibt sich der Archäologe Harald Meller als Käufer aus. Die Polizei greift zu!", scene(v => { v.append(s.el("rect", { x: 70, y: 30, width: 90, height: 80, rx: 8, fill: "#c8d3de" })); v.append(s.el("circle", { cx: 95, cy: 22, r: 12, fill: "#dc3b2a" }), s.el("circle", { cx: 135, cy: 22, r: 12, fill: "#1d5bd0" })); v.append(txt(s, 115, 80, "POLIZEI", { "font-size": 20, fill: INK })); })],
            ["2003 und heute", "Die Raubgräber werden verurteilt. Die Scheibe liegt heute im Museum in Halle.", scene(v => v.append(s.el("path", { d: "M50,60 L115,25 L180,60 Z", fill: "#e8b64a" }), s.el("rect", { x: 55, y: 62, width: 130, height: 50, fill: "#f8f1df", stroke: "#8a6a2a", "stroke-width": 2 }), ...[75, 105, 135, 165].map(x => s.el("rect", { x, y: 66, width: 10, height: 42, fill: "#d9c9a2" }))))],
          ].map(([h, t, v]) => s.h("div", { class: "card later", style: { padding: "10px", display: "flex", flexDirection: "column", gap: "8px" } }, v, s.h("p", { class: "t", style: { fontWeight: 700, color: C } }, h), p(s, "small", t)));
          const merk = s.h("div", { class: "merk later" }, "Raubgräber zerstören Wissen: Wo und wie ein Fund lag, verrät Archäologen sehr viel. Wer etwas Altes findet, muss es ", B(s, "melden"), ".");
          s.add(s.h("div", { class: "stack", style: { gap: "16px", justifyContent: "center", height: "100%" } }, s.h("div", { class: "cols4", style: { gap: "14px" } }, ...panels), merk));
          s.sfx.pop();
          s.step(async () => { s.sound("spitzhacke", { vol: .6 }); await s.show(panels[0], "up"); });
          s.step(async () => { s.sound("coins", { vol: .5 }); await s.show(panels[1], "up"); });
          s.step(async () => { s.sfx.zap(); await s.show(panels[2], "up"); s.say("Die Polizei stellte die Scheibe in Basel sicher."); });
          s.step(async () => { s.sfx.success(); await s.show(panels[3], "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Hügelgräber",
        say: "In der Bronzezeit begrub man wichtige Tote oft unter einem großen Erdhügel. So ein Grab heißt Hügelgrab.",
        build(s) {
          const svg = svgBox(s, 540, 360);
          svg.append(s.el("rect", { x: 0, y: 0, width: 540, height: 360, rx: 14, fill: "#e6f2fb" }), s.el("rect", { x: 0, y: 240, width: 540, height: 120, fill: "#b89a6a" }), s.el("rect", { x: 0, y: 236, width: 540, height: 8, fill: "#7cbf5a" }));
          svg.append(s.el("rect", { x: 190, y: 244, width: 160, height: 56, fill: "#8a6a44" }));
          const body = s.el("g", { class: "later" });
          body.append(s.el("ellipse", { cx: 270, cy: 280, rx: 62, ry: 11, fill: "#f2e6c8" }), s.el("circle", { cx: 214, cy: 276, r: 10, fill: "#f2e6c8" }));
          const gifts = s.el("g", { class: "later" });
          gifts.append(s.el("path", { d: "M300,262 L350,262", stroke: BR, "stroke-width": 6, "stroke-linecap": "round" }), s.el("path", { d: "M318,262 L318,252", stroke: BR2, "stroke-width": 5 }), s.el("path", { d: "M196,262 q-6,18 6,26 l20,0 q12,-8 6,-26 Z", fill: "#a8794a" }), s.el("circle", { cx: 260, cy: 270, r: 6, fill: "none", stroke: "#e8b64a", "stroke-width": 4 }));
          svg.append(body, gifts);
          const mound = s.el("path", { d: "M70,240 Q270,240 470,240 Z", fill: "#a3844f", stroke: "#6b5a32", "stroke-width": 3 });
          const grass = s.el("path", { d: "M70,240 Q270,240 470,240", fill: "none", stroke: "#5f9e45", "stroke-width": 8, opacity: 0 });
          svg.append(mound, grass);
          const lblA = txt(s, 270, 40, "Grabkammer mit Beigaben", { fill: C, class: "later" });
          svg.append(lblA);
          const ph = s.photo("huegelgrab", { w: "100%", h: 200, caption: "Grabhügel aus der Bronzezeit", cls: "later", pos: "50% 85%" });
          const c1 = exc(s, "Mittlere Bronzezeit", "later", p(s, "small", "Etwa 1600 bis 1300 v. Chr.: Man legte die Toten mit Beigaben in die Erde und schüttete einen Hügel darüber. Später verbrannte man die Toten und setzte die Asche in Urnen bei."));
          const seddin = s.h("div", { class: "life later", style: { display: "grid", gridTemplateColumns: "170px 1fr", gap: "12px", alignItems: "center" } }, s.photo("seddin-zeichnung", { w: 170, h: 110 }), s.h("div", null, s.h("span", { class: "exlabel" }, "In Brandenburg"), p(s, "small", "Königsgrab von Seddin (um 800 v. Chr.): fast 64 m breit, 10 m hoch. Funde: Neues Museum Berlin.")));
          s.add(grid(s, "540px 1fr", svg, s.h("div", { class: "stack", style: { gap: "10px" } }, ph, c1, seddin)));
          s.show(svg, "fade"); s.sfx.pop();
          s.step(async () => { s.sfx.drum(); await s.show(body, "fade"); s.sound("glass-clink", { vol: .4 }); await s.show(gifts, "pop"); s.show(lblA, "pop"); s.say("In die Grabkammer legte man Beigaben: Schwert, Schmuck, ein Gefäß."); });
          s.step(async () => {
            s.hide(lblA); s.sound("kelle-graben", { vol: .55 });
            await s.tween({ from: 0, to: 1, dur: 1400, ease: "out", update: v => mound.setAttribute("d", `M70,240 Q270,${240 - 260 * v} 470,240 Z`) });
            grass.setAttribute("d", "M70,240 Q270,-20 470,240"); grass.setAttribute("opacity", 1); s.sfx.pop();
            await s.show(c1, "left"); s.show(ph, "zoom");
            s.say("Darüber schüttete man einen großen Hügel auf.");
          });
          s.step(async () => { s.sfx.ding(); await s.show(seddin, "up"); s.say("Das größte Hügelgrab in Brandenburg ist das Königsgrab von Seddin."); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Bronzezeit in Berlin",
        say: "Auch in Berlin kannst du Schätze aus der Bronzezeit sehen: im Neuen Museum auf der Museumsinsel.",
        build(s) {
          const hut = s.photo("berliner-goldhut", { w: 240, h: 520, caption: "Berliner Goldhut", fit: "contain", style: { background: "#1b1b1b" } });
          const gold = s.photo("eberswalder-gold", { w: "100%", h: 250, caption: "Eberswalder Goldschatz (Nachbildung)", cls: "later" });
          const t1 = exc(s, "Der Berliner Goldhut", "later", p(s, "small", B(s, "74,5 cm"), " hoch, aus 490 g dünnem Goldblech, um 1000–800 v. Chr. Die vielen Kreise sind vielleicht ein ", B(s, "Kalender"), " für Sonne und Mond."));
          const t2 = exc(s, "Der Eberswalder Goldschatz", "later", p(s, "small", "1913 fanden Arbeiter in Eberswalde (Brandenburg) einen Tontopf mit ", B(s, "81 Goldstücken"), " – 2,6 kg! Das Original ist seit 1945 in Moskau, in Berlin sieht man eine Nachbildung."));
          const lf = lifeBox(s, "later", p(s, "small", "Mit der U-Bahn zur Museumsinsel: Im Neuen Museum stehen Goldhut, Goldschatz und Funde aus dem Königsgrab von Seddin."));
          s.add(grid(s, "240px 1fr", hut, s.h("div", { class: "stack", style: { gap: "10px" } }, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", alignItems: "start" } }, t1, t2), gold, lf)));
          s.show(hut, "zoom"); s.sound("magic-chime", { vol: .4 });
          s.step(async () => { s.sfx.pop(); await s.show(t1, "left"); s.say("Der Goldhut ist 74,5 Zentimeter hoch, aus dünnem Goldblech."); });
          s.step(async () => { s.sound("coins", { vol: .5 }); s.show(gold, "zoom"); await s.show(t2, "left"); });
          s.step(async () => { s.sound("ubahn-train", { vol: .35, dur: 3 }); await s.show(lf, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Eisen aus dem Rennofen",
        say: "Eisen stellte man in einem Rennofen her. Darin werden Holzkohle und Eisenerz sehr heiß. Das Eisen wird aber nicht flüssig, sondern zu einem Klumpen: der Luppe.",
        build(s) {
          const svg = svgBox(s, 440, 420);
          svg.append(s.el("rect", { x: 0, y: 360, width: 440, height: 60, fill: "#d8c4a0" }));
          const shaft = "M140,360 L120,120 Q120,70 170,60 L250,60 Q300,70 300,120 L280,360 Z";
          svg.append(s.el("path", { d: shaft, fill: "#b7845a", stroke: "#6b4a22", "stroke-width": 4 }));
          const inner = [];
          const layers = s.el("g");
          for (let i = 0; i < 9; i++) { const y = 320 - i * 28; const r = s.el("rect", { x: 160 - (i > 6 ? (i - 6) * 3 : 0), y, width: 100 + (i > 6 ? (i - 6) * 6 : 0), height: 26, fill: i % 2 ? "#a24a2a" : "#2b2b2b", opacity: 0 }); layers.append(r); inner.push(r); }
          svg.append(layers);
          const glow = s.el("rect", { x: 160, y: 200, width: 100, height: 146, fill: GLOW, opacity: 0 });
          svg.append(glow);
          const bellows = s.el("g");
          bellows.append(s.el("path", { d: "M20,300 L90,288 L90,332 L20,320 Z", fill: "#8a5a3c", stroke: "#4a3420", "stroke-width": 3 }), s.el("path", { d: "M90,310 L150,310", stroke: "#4a3420", "stroke-width": 8 }));
          svg.append(bellows);
          const slag = s.el("path", { d: "M280,350 Q320,352 330,370 Q300,374 280,366 Z", fill: "#3a3a3a", opacity: 0 });
          svg.append(slag);
          const luppe = s.el("ellipse", { cx: 210, cy: 330, rx: 34, ry: 20, fill: "#6d6a66", stroke: "#3a3a3a", "stroke-width": 3, opacity: 0 });
          svg.append(luppe);
          const temp = txt(s, 210, 40, "", { fill: "#dc3b2a", "font-size": 26 });
          const lab = [later(txt(s, 360, 200, "Holzkohle", { "font-size": 19, fill: INK })), later(txt(s, 360, 226, "+ Eisenerz", { "font-size": 19, fill: "#a24a2a" })), later(txt(s, 360, 400, "Schlacke rinnt", { "font-size": 19 })), later(txt(s, 60, 360, "Blasebalg", { "font-size": 19 }))];
          svg.append(temp, ...lab);
          const ph = s.photo("rennofen", { w: 260, h: 420, caption: "Nachbau eines Rennofens", pos: "50% 60%" });
          const c1 = exc(s, "Füllen und anheizen", "later", p(s, "small", "Schichten aus Holzkohle und zerkleinertem Erz. Ein Blasebalg bläst Luft hinein: 1.100 bis 1.350 °C."));
          const c2 = exc(s, "Schlacke und Luppe", "later", p(s, "small", "Das Gestein wird flüssig und ", B(s, "rinnt"), " als Schlacke heraus – daher der Name Rennofen. Übrig bleibt ein Eisenklumpen, die ", B(s, "Luppe"), "."));
          const c3 = exc(s, "Schmieden", "later", p(s, "small", "Die glühende Luppe wird lange gehämmert. Für 1 kg Eisen brauchte man 15 bis 30 kg Holzkohle!"));
          s.add(grid(s, "440px 260px 1fr", svg, ph, s.h("div", { class: "stack", style: { gap: "10px" } }, c1, c2, c3)));
          s.sfx.pop();
          s.step(async () => {
            s.show(lab.slice(0, 2), "pop"); s.show(c1, "left");
            for (let i = 0; i < inner.length; i++) { inner[i].setAttribute("opacity", 1); s.sfx.count(i); await s.wait(s.fast ? 0 : 90); }
            s.show(lab[3], "pop"); s.sound("fire", { vol: .45, dur: 3 });
            await s.tween({ from: 0, to: 1, dur: 1200, update: v => { glow.setAttribute("opacity", .6 * v); bellows.setAttribute("transform", `translate(${6 * Math.sin(v * 20)} 0)`); temp.textContent = s.fmt(Math.round(1200 * v / 50) * 50) + " °C"; } });
            s.say("Der Blasebalg macht das Feuer sehr heiß: über tausend Grad.");
          });
          s.step(async () => { s.show(c2, "left"); s.sound("sizzle", { vol: .4, dur: 2 }); s.show(lab[2], "pop"); await s.tween({ from: 0, to: 1, dur: 900, update: v => slag.setAttribute("opacity", v) }); await s.tween({ from: 1, to: 0, dur: 700, update: v => { glow.setAttribute("opacity", .6 * v); inner.forEach(r => r.setAttribute("opacity", v)); } }); luppe.setAttribute("opacity", 1); s.sfx.boing(); s.say("Unten bleibt die Luppe liegen: ein schwammiger Klumpen Eisen."); });
          s.step(async () => { s.sound("amboss", { vol: .55, dur: 3 }); await s.show(c3, "left"); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Warum Eisen die Bronze ablöste",
        say: "Eisen hatte einen großen Vorteil: Eisenerz gibt es fast überall. Für Bronze brauchte man dagegen seltenes Zinn von weit her.",
        build(s) {
          const rows = [
            ["Rohstoff", "Kupfer + Zinn: selten, oft weit weg", "Eisenerz: fast überall, sogar in Brandenburgs feuchten Wiesen (Raseneisenstein)"],
            ["Herstellung", "schmelzen und in Formen gießen", "im Rennofen gewinnen, dann schmieden"],
            ["Härte", "hart genug für Beile und Schwerter", "geschmiedet und mit etwas Kohlenstoff gehärtet: noch härter (Stahl)"],
            ["Wer hatte es?", "eher die Reichen", "bald auch Bauern: Pflugschar, Sichel, Axt"],
          ];
          const tr = rows.map(([a, b, c]) => { const r = s.h("tr", { class: "later" }, s.h("td", { style: { fontWeight: 700, color: C } }, a), s.h("td", null, b), s.h("td", null, c)); return r; });
          const table = s.h("table", { class: "tafel", style: { width: "100%", fontSize: "20px" } }, s.h("thead", null, s.h("tr", null, s.h("th", null, ""), s.h("th", { style: { color: BR2 } }, "Bronze"), s.h("th", { style: { color: PEN } }, "Eisen"))), s.h("tbody", null, ...tr));
          const ph = s.photo("schmied", { w: 330, h: 330, caption: "Schmieden: glühendes Eisen formen", cls: "later", pos: "50% 60%" });
          const merk = s.h("div", { class: "merk later" }, "Ab etwa ", B(s, "800 v. Chr."), " setzte sich bei uns das Eisen durch: die ", B(s, "Eisenzeit"), " beginnt. Bronze nahm man weiter für Schmuck und Gefäße.");
          s.add(grid(s, "1fr 330px", s.h("div", { class: "stack", style: { gap: "14px" } }, table, merk), ph));
          s.sfx.pop();
          tr.forEach((r, i) => s.step(async () => { if (i === 2) { s.sound("amboss", { vol: .5, dur: 2 }); s.show(ph, "zoom"); } else s.sfx.count(i * 2); await s.show(r, "left"); }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Die Kelten",
        say: "In der Eisenzeit lebten in Mitteleuropa die Kelten. Sie bauten befestigte Burgen und sogar große Städte.",
        build(s) {
          const ph = s.photo("heuneburg", { w: "100%", h: 250, caption: "Heuneburg: nachgebaute Häuser und Lehmziegelmauer", pos: "50% 60%" });
          const c = [
            exc(s, "Wer waren die Kelten?", "later", p(s, "small", "Viele Stämme in Mitteleuropa, ab etwa 800 v. Chr. Sie schrieben kaum selbst. Wir kennen sie aus Funden und aus Berichten von Griechen und Römern.")),
            exc(s, "Fürstensitz Heuneburg", "later", p(s, "small", "An der Donau, um 600 v. Chr.: eine Mauer aus Lehmziegeln wie am Mittelmeer – nördlich der Alpen einmalig.")),
            exc(s, "Stadt Manching", "later", p(s, "small", "Ein Oppidum (befestigte Stadt) in Bayern: 7,2 km lange Mauer, 5.000 bis 10.000 Menschen, im 2. Jh. v. Chr.")),
          ];
          const lf = lifeBox(s, "later", p(s, "small", "Manching war 380 Hektar groß – größer als das ganze Tempelhofer Feld (rund 300 Hektar)!"));
          s.add(s.h("div", { class: "stack", style: { gap: "14px", justifyContent: "center", height: "100%" } }, ph, s.h("div", { class: "cols3" }, ...c), lf));
          s.show(ph, "zoom"); s.sound("stimmengewirr", { vol: .3, dur: 3 });
          s.step(async () => { s.sfx.pop(); await s.show(c[0], "up"); });
          s.step(async () => { s.sound("stein-schieben", { vol: .4, dur: 2 }); await s.show(c[1], "up"); s.say("Die Heuneburg hatte eine Mauer aus Lehmziegeln."); });
          s.step(async () => { s.sfx.count(4); await s.show(c[2], "up"); s.say("Manching war eine richtige Stadt."); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Ein Keltenfürst in Hochdorf",
        say: "Um 530 vor Christus wurde in Hochdorf bei Stuttgart ein keltischer Fürst begraben. Sein Grab wurde nie ausgeraubt.",
        build(s) {
          const ph = s.photo("hochdorf-grab", { w: 520, h: 400, caption: "Nachbau der Grabkammer (Keltenmuseum Hochdorf)", pos: "50% 50%" });
          const intro = p(s, "small", "Ein etwa 50 Jahre alter Mann, 1,80 m groß. Über dem Grab: ein Hügel mit 60 m Durchmesser. Ausgegraben 1978/79.");
          const gifts = [
            ["Liege aus Bronze", "2,75 m lang, auf Rädern"],
            ["Riesiger Kessel", "für etwa 400 Liter Met (Honigwein)"],
            ["Wagen", "mit vier Rädern, darauf Geschirr aus Bronze"],
            ["Trinkhörner", "für neun Personen"],
            ["Gold", "Halsring, Armring – sogar Goldbleche auf den Schuhen"],
          ].map(([a, b]) => s.h("div", { class: "chip later", style: { fontSize: "19px", padding: "8px 14px", display: "block", lineHeight: 1.3 } }, B(s, a + ": "), b));
          const merk = s.h("div", { class: "merk later" }, "So reiche Gräber heißen ", B(s, "Fürstengräber"), ". Sie zeigen: Einige wenige Menschen waren sehr mächtig und reich.");
          s.add(grid(s, "520px 1fr", ph, s.h("div", { class: "stack", style: { gap: "8px" } }, intro, ...gifts, merk)));
          s.show(ph, "zoom"); s.sfx.whoosh();
          s.step(async () => { for (let i = 0; i < 3; i++) { s.sfx.count(i * 2); await s.show(gifts[i], "left"); } s.say("Eine Liege, ein riesiger Kessel und ein Wagen."); });
          s.step(async () => { s.sound("glass-clink", { vol: .45 }); await s.show(gifts[3], "left"); s.sound("coins", { vol: .5 }); await s.show(gifts[4], "left"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Viele Berufe, Arm und Reich",
        say: "Mit dem Metall kamen neue Berufe. Nicht mehr jeder machte alles selbst. Und es gab jetzt große Unterschiede zwischen Arm und Reich.",
        build(s) {
          const svg = svgBox(s, 560, 440);
          const cx = 280, cy = 215;
          const roles = [
            ["Bergleute", "holen Erz", 280, 70, "#7a5a2e", 330, 64, "start"],
            ["Händler", "bringen Zinn", 470, 170, "#1d5bd0", 470, 232, "middle"],
            ["Gießer und Schmiede", "machen Werkzeug", 420, 330, BR2, 420, 392, "middle"],
            ["Bauern", "liefern Essen", 140, 330, "#2f7d32", 140, 392, "middle"],
            ["Fürst", "herrscht, ist reich", 90, 170, "#dc3b2a", 90, 232, "middle"],
          ];
          svg.append(s.el("circle", { cx, cy, r: 62, fill: SOFT, stroke: C, "stroke-width": 4 }), txt(s, cx, cy - 4, "Dorf", { fill: C, "font-size": 22 }), txt(s, cx, cy + 22, "und Markt", { fill: C, "font-size": 19 }));
          const nodes = roles.map(([a, b, x, y, col, lx, ly, anc]) => {
            const g = s.el("g", { class: "later" }); fb(g);
            const dx = x - cx, dy = y - cy, L = Math.hypot(dx, dy);
            g.append(s.el("path", { d: `M${cx + dx / L * 66},${cy + dy / L * 66} L${x - dx / L * 44},${y - dy / L * 44}`, stroke: col, "stroke-width": 4, "stroke-dasharray": "8 6" }));
            g.append(s.el("circle", { cx: x, cy: y, r: 38, fill: "#fff", stroke: col, "stroke-width": 4 }), txt(s, x, y + 10, a[0], { fill: col, "font-size": 30 }));
            g.append(txt(s, lx, ly, a, Object.assign({ fill: col, "font-size": 20, "text-anchor": anc }, halo)), txt(s, lx, ly + 22, b, Object.assign({ fill: PEN, "font-size": 19, "font-weight": 600, "text-anchor": anc }, halo)));
            svg.append(g); return g;
          });
          const c1 = exc(s, "Arbeitsteilung", "later", p(s, "small", "Jeder macht, was er am besten kann – und tauscht mit den anderen. Ein Schmied hat keine Zeit für das Feld, also bekommt er Getreide vom Bauern."));
          const c2 = exc(s, "Arm und Reich", "later", p(s, "small", "Wer Metall und Handel kontrollierte, wurde reich und mächtig. Das sieht man an den Gräbern: viele einfache Gräber – und wenige prächtige Fürstengräber."));
          const lf = lifeBox(s, "later", p(s, "small", "Heute ist es genauso: Bäcker, Elektrikerin, Busfahrer, Ärztin – niemand macht alles selbst."));
          s.add(grid(s, "560px 1fr", svg, s.h("div", { class: "stack", style: { gap: "12px" } }, c1, c2, lf)));
          s.sfx.pop();
          s.step(async () => { const snd = [() => s.sound("spitzhacke", { vol: .5 }), () => s.sound("coins", { vol: .45 }), () => s.sound("amboss", { vol: .45, dur: 1 }), () => s.sound("schaf", { vol: .5 })]; for (let i = 0; i < 4; i++) { snd[i](); await s.show(nodes[i], "pop"); await s.wait(s.fast ? 0 : 250); } await s.show(c1, "left"); });
          s.step(async () => { s.sfx.fanfare(); await s.show(nodes[4], "zoom"); await s.show(c2, "left"); s.say("Ein Fürst war reich und mächtig."); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Im Alltag: Metall heute",
        say: "Kupfer, Bronze und Eisen begegnen dir jeden Tag – von der Kirchenglocke bis zum Kleingeld.",
        build(s) {
          const card = (id, lbl, text, pos, extra) => s.h("div", { class: "life later", style: { display: "grid", gridTemplateColumns: "180px 1fr", gap: "14px", alignItems: "center" } }, s.photo(id, { w: 180, h: 180, pos }), s.h("div", { class: "stack", style: { gap: "6px" } }, s.h("span", { class: "exlabel" }, lbl), p(s, "small", text), extra || null));
          const cards = [
            card("glocke", "Bronze: Glocken", "Kirchenglocken sind aus Glockenbronze: etwa 4 Teile Kupfer und 1 Teil Zinn. Darum klingen sie so schön.", "50% 40%", s.soundBtn("church-bells", "Anhören", { dur: 5 })),
            card("kupferkabel", "Kupfer: Strom", "In jedem Stromkabel stecken Drähte aus Kupfer. Kupfer leitet Strom sehr gut.", "50% 50%"),
            card("euro-muenzen", "Kupfer: Kleingeld", "1-, 2- und 5-Cent-Münzen: Eisenkern mit Kupferhaut. 10-, 20- und 50-Cent-Münzen: fast 90 % Kupfer.", "50% 50%"),
            card("schmied", "Eisen und Stahl", "Stahl ist Eisen mit etwas Kohlenstoff: Fahrrad, U-Bahn-Schienen, Löffel und Gabeln.", "50% 60%"),
          ];
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", alignContent: "center", height: "100%" } }, ...cards));
          s.sfx.pop();
          s.step(async () => { s.sound("church-bells", { vol: .35, dur: 3 }); await s.show(cards[0], "up"); });
          s.step(async () => { s.sfx.zap(); await s.show(cards[1], "up"); });
          s.step(async () => { s.sound("coins", { vol: .5 }); await s.show(cards[2], "up"); });
          s.step(async () => { s.sound("ubahn-train", { vol: .35, dur: 3 }); await s.show(cards[3], "up"); s.sfx.success(); s.confetti(550, 330, 60); });
        },
      },
    ],
  });
})();
