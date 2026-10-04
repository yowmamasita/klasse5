/* Kapitel 7 – Ägypten: Pharaonen und Pyramiden */
(() => {
  const INK = "#1b2740", GOLD = "#e0a526", SAND = "#f1dca7", NILE = "#3a8fd0", RED = "#c8321f";

  /* ---------- simplified hieroglyph signs, each drawn into a 60×60 box ---------- */
  const SIGN = {
    vulture: g => [["path", { d: "M12 54 L18 34 C20 22 28 16 38 17 L44 10 L54 12 L47 19 C51 26 49 36 40 41 L30 45 L27 54 Z", fill: INK }], ["path", { d: "M26 45 L22 56 M32 44 L32 56", stroke: INK, "stroke-width": 3 }]],
    foot: g => [["path", { d: "M20 6 L30 6 L30 42 L54 46 C57 47 57 54 54 54 L20 54 Z", fill: INK }]],
    basket: g => [["path", { d: "M5 28 L50 28 C50 45 41 54 27 54 C14 54 5 45 5 28 Z", fill: INK }], ["path", { d: "M46 46 C58 46 58 32 50 32", stroke: INK, "stroke-width": 4, fill: "none" }]],
    hand: g => [["path", { d: "M4 40 L44 40 C53 40 57 44 57 47 C57 51 53 54 44 54 L4 54 Z", fill: INK }], ["path", { d: "M28 40 L36 28 L41 31 L36 40 Z", fill: INK }]],
    reed: g => [["path", { d: "M30 57 L30 20", stroke: INK, "stroke-width": 4 }], ["path", { d: "M30 24 C19 20 17 7 23 3 C30 7 33 14 30 24 Z", fill: INK }]],
    viper: g => [["path", { d: "M4 52 C12 42 20 54 30 47 C40 40 46 46 50 40", stroke: INK, "stroke-width": 6, fill: "none", "stroke-linecap": "round" }], ["circle", { cx: 52, cy: 37, r: 6, fill: INK }], ["path", { d: "M50 32 L48 24 M55 32 L57 24", stroke: INK, "stroke-width": 3 }]],
    jar: g => [["path", { d: "M16 18 L44 18 L35 37 L44 56 L16 56 L25 37 Z", fill: INK }]],
    flax: g => [["path", { d: "M30 4 C44 10 44 18 30 22 C16 26 16 34 30 38 C44 42 44 50 30 56 M30 4 C16 10 16 18 30 22 C44 26 44 34 30 38 C16 42 16 50 30 56", stroke: INK, "stroke-width": 4, fill: "none" }]],
    cobra: g => [["path", { d: "M8 54 L46 54 C55 54 55 45 46 45 L32 45 C25 45 25 37 31 33 L31 16", stroke: INK, "stroke-width": 5, fill: "none", "stroke-linecap": "round" }], ["ellipse", { cx: 31, cy: 18, rx: 8, ry: 13, fill: INK }]],
    lion: g => [["path", { d: "M4 54 L6 40 C7 31 13 27 20 28 L44 30 C51 30 55 35 55 42 L55 54 Z", fill: INK }], ["circle", { cx: 15, cy: 27, r: 11, fill: INK }], ["path", { d: "M55 38 C60 30 58 22 52 22", stroke: INK, "stroke-width": 3, fill: "none" }]],
    owl: g => [["path", { d: "M18 57 L18 28 C18 14 26 8 34 9 C44 11 47 21 47 30 L47 57 Z", fill: INK }], ["path", { d: "M20 12 L18 4 L26 9 M44 12 L47 4 L39 9", fill: INK, stroke: INK, "stroke-width": 2 }], ["circle", { cx: 27, cy: 20, r: 5, fill: "#fff" }], ["circle", { cx: 39, cy: 20, r: 5, fill: "#fff" }]],
    water: g => [["path", { d: "M3 36 l6 -7 l6 7 l6 -7 l6 7 l6 -7 l6 7 l6 -7 l6 7 l6 -7", stroke: INK, "stroke-width": 4, fill: "none", "stroke-linejoin": "round" }]],
    lasso: g => [["path", { d: "M30 8 C47 8 51 29 37 35 C24 40 13 29 21 18 M36 35 L41 57 M30 36 L25 57", stroke: INK, "stroke-width": 4, fill: "none" }]],
    stool: g => [["rect", { x: 8, y: 30, width: 44, height: 14, rx: 2, fill: INK }], ["path", { d: "M8 44 L8 54 M52 44 L52 54", stroke: INK, "stroke-width": 4 }]],
    hill: g => [["path", { d: "M5 55 L5 46 C5 24 55 24 55 46 L55 55 Z", fill: INK }]],
    mouth: g => [["path", { d: "M3 32 C17 17 43 17 57 32 C43 47 17 47 3 32 Z", fill: INK }]],
    cloth: g => [["path", { d: "M22 57 L22 12 C22 3 38 3 38 12 L38 22 L30 22 L30 57 Z", fill: INK }]],
    bread: g => [["path", { d: "M7 52 C7 28 53 28 53 52 Z", fill: INK }]],
    chick: g => [["ellipse", { cx: 34, cy: 38, rx: 15, ry: 11, fill: INK }], ["circle", { cx: 19, cy: 26, r: 8, fill: INK }], ["path", { d: "M11 25 L5 27 L11 29 Z M30 48 L28 57 M38 48 L40 57", fill: INK, stroke: INK, "stroke-width": 3 }]],
    reeds2: g => [["path", { d: "M21 57 L21 20 M39 57 L39 20", stroke: INK, "stroke-width": 4 }], ["path", { d: "M21 24 C11 20 10 7 15 3 C21 7 24 14 21 24 Z M39 24 C29 20 28 7 33 3 C39 7 42 14 39 24 Z", fill: INK }]],
    bolt: g => [["path", { d: "M5 36 L55 36", stroke: INK, "stroke-width": 7 }], ["path", { d: "M10 28 L10 44 M50 28 L50 44", stroke: INK, "stroke-width": 4 }]],
    sun: g => [["circle", { cx: 30, cy: 30, r: 22, fill: "none", stroke: INK, "stroke-width": 5 }], ["circle", { cx: 30, cy: 30, r: 5, fill: INK }]],
  };
  const ALPHA = { A: ["vulture"], B: ["foot"], C: ["basket"], D: ["hand"], E: ["reed"], F: ["viper"], G: ["jar"], H: ["flax"], I: ["reed"], J: ["cobra"], K: ["basket"], L: ["lion"], M: ["owl"], N: ["water"], O: ["lasso"], P: ["stool"], Q: ["hill"], R: ["mouth"], S: ["cloth"], T: ["bread"], U: ["chick"], V: ["viper"], W: ["chick"], X: ["basket", "cloth"], Y: ["reeds2"], Z: ["bolt"] };
  const sign = (s, key, x, y, size = 60, color) => {
    const g = s.el("g", { transform: `translate(${x} ${y}) scale(${size / 60})` });
    SIGN[key]().forEach(([tag, a]) => {
      const at = Object.assign({}, a);
      if (color) { if (at.fill && at.fill !== "none" && at.fill !== "#fff") at.fill = color; if (at.stroke) at.stroke = color; }
      g.append(s.el(tag, at));
    });
    return g;
  };
  const T = (s, x, y, txt, o = {}) => s.el("text", { x, y, "font-size": o.fs || 20, "text-anchor": o.a || "middle", fill: o.fill || INK, "font-weight": o.fw || 700, class: o.cls, text: txt, stroke: o.halo ? "#fff" : null, "stroke-width": o.halo ? 5 : null, "paint-order": o.halo ? "stroke" : null });
  const later = el => { el.classList.add("later"); return el; };
  const box = (cls, label, ...kids) => s => s.h("div", { class: cls }, label ? s.h("span", { class: "exlabel" }, label) : null, ...kids);

  /* little pharaoh crowns (local coords: base centre = 0,0) */
  const whiteCrown = s => s.el("path", { d: "M-34 0 C-42 -55 -30 -105 -13 -150 Q0 -172 13 -150 C30 -105 42 -55 34 0 Z", fill: "#fbfaf2", stroke: INK, "stroke-width": 4 });
  const redCrown = s => s.el("path", { d: "M-58 0 L-58 -62 L30 -62 L30 -140 L56 -140 L56 0 Z M-20 -62 C-34 -78 -46 -96 -36 -108 C-28 -116 -18 -108 -24 -100", fill: RED, stroke: INK, "stroke-width": 4, "stroke-linejoin": "round" });

  Deck.unit({
    id: "u7", num: 7, title: "Ägypten: Pharaonen und Pyramiden", color: "#a21caf", soft: "#f7e3f9",
    subtitle: "Ein Reich am Nil – vor über 4.500 Jahren",
    blurb: "Pharaonen, Pyramiden, Götter, Mumien und Hieroglyphen.",
    goals: ["Ich weiß, wer der Pharao war und was er trug.", "Ich kann erklären, wie eine Pyramide entstand – und wer sie baute.", "Ich kenne Götter, Mumien und das Totengericht.", "Ich kann meinen Namen in Hieroglyphen schreiben."],
    icon(svg, el) {
      svg.append(el("path", { d: "M8 60 L35 12 L62 60 Z", fill: "#a21caf", opacity: .2 }), el("path", { d: "M8 60 L35 12 L62 60 Z M20 40 L50 40 M14 50 L56 50 M27 28 L43 28", fill: "none", stroke: "#a21caf", "stroke-width": 3, "stroke-linejoin": "round" }), el("circle", { cx: 56, cy: 16, r: 7, fill: "#e0a526" }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Ein Land am Nil",
        say: "Ägypten liegt in der Wüste. Nur am Nil kann man leben – der Fluss ist die Lebensader.",
        build(s) {
          const svg = s.svg(440, 600);
          svg.append(s.el("rect", { x: 0, y: 0, width: 440, height: 600, rx: 22, fill: SAND }),
            s.el("rect", { x: 0, y: 0, width: 440, height: 72, rx: 22, fill: "#9fd3f0" }), s.el("rect", { x: 0, y: 40, width: 440, height: 32, fill: "#9fd3f0" }),
            T(s, 160, 46, "Mittelmeer", { fs: 22, fill: "#1b4f80" }));
          const north = s.el("g", null, s.el("path", { d: "M390 150 L400 110 L410 150 L400 142 Z", fill: INK }), T(s, 400, 104, "N", { fs: 22 }));
          svg.append(north);
          const delta = later(s.el("path", { d: "M236 258 L130 72 L340 72 Z", fill: "#7cc56f", opacity: .75 }));
          const strip = later(s.el("path", { d: "M332 600 C326 560 318 520 300 462 C284 410 262 370 252 330 C244 300 238 280 236 258", stroke: "#7cc56f", "stroke-width": 40, fill: "none", opacity: .75, "stroke-linecap": "round" }));
          const nile = s.el("path", { d: "M332 600 C326 560 318 520 300 462 C284 410 262 370 252 330 C244 300 238 280 236 258", stroke: NILE, "stroke-width": 9, fill: "none", "stroke-linecap": "round", class: "later" });
          const arms = s.el("path", { d: "M236 258 L170 72 M236 258 L236 72 M236 258 L300 72", stroke: NILE, "stroke-width": 6, fill: "none", class: "later" });
          svg.append(delta, strip, nile, arms);
          const boats = s.el("g"); svg.append(boats);
          const cities = [[236, 258, "Gizeh", 252, 290], [262, 368, "Amarna", 280, 374], [300, 462, "Theben", 318, 468]];
          const cityEls = cities.map(([x, y, n, tx, ty]) => later(s.el("g", null, s.el("circle", { cx: x, cy: y, r: 8, fill: "#fff", stroke: INK, "stroke-width": 3 }), T(s, tx, ty, n, { a: "start", fs: 21, halo: true }))));
          svg.append(...cityEls);
          const lower = later(s.el("g", null, T(s, 236, 160, "Unterägypten", { fs: 23, halo: true }), T(s, 236, 188, "im Norden", { fs: 19, fw: 600, halo: true })));
          const upper = later(s.el("g", null, T(s, 120, 470, "Oberägypten", { fs: 23, halo: true }), T(s, 120, 498, "im Süden", { fs: 19, fw: 600, halo: true })));
          const nileLbl = later(T(s, 350, 580, "Nil", { a: "start", fs: 22, fill: "#1b4f80" }));
          svg.append(lower, upper, nileLbl);
          const merk = later(s.h("div", { class: "merk" }, "Der Nil fließt von ", s.h("b", null, "Süden nach Norden"), ". Darum liegt ", s.h("b", null, "Oberägypten"), " im Süden und ", s.h("b", null, "Unterägypten"), " im Norden am Delta."));
          const flood = later(s.h("div", { class: "card soft" }, s.h("p", { class: "t" }, "Jedes Jahr kam die ", s.h("b", null, "Nilflut"), ". Danach säten die Bauern Getreide auf den nassen Feldern.")));
          const life = later(s.h("div", { class: "life" }, s.h("span", { class: "exlabel" }, "Im Alltag"), s.h("p", { class: "small" }, "Städte entstehen gern am Fluss: Berlin an der Spree, Hamburg an der Elbe, Köln am Rhein.")));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "440px 1fr", gap: "36px", height: "100%", alignItems: "center" } }, svg,
            s.h("div", { class: "stack" }, s.h("p", { class: "big a-up" }, "Ein Land am Nil"), s.h("p", { class: "t a-up", style: { "--d": "150ms" } }, "Rundherum ist Wüste. Nur am Fluss wächst etwas – ein grünes Band."), flood, merk, life)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          let boatsOn = false;
          s.step(async () => {
            s.sound("fluss", { vol: .4, dur: 5 }); s.show(strip, "fade"); await s.show(nile, "draw"); s.show(arms, "draw"); s.show(delta, "fade"); s.show(nileLbl, "pop"); s.sfx.ding();
            if (!boatsOn) {
              boatsOn = true;
              const b = [0, .33, .66].map(() => s.el("path", { d: "M-9 0 L9 0 L5 6 L-5 6 Z M0 0 L0 -12 L7 -3 Z", fill: "#8a4b12" }));
              boats.append(...b);
              s.loop(t => { b.forEach((el, i) => { const L = nile.getTotalLength(); const p = nile.getPointAtLength(L * (1 - ((t * .06 + i / 3) % 1))); el.setAttribute("transform", `translate(${p.x + 14} ${p.y})`); }); });
            }
            s.say("Der Nil fließt nach Norden ins Mittelmeer.");
          });
          s.step(async () => { s.sfx.pop(); await s.show([lower, upper], "pop"); s.sfx.snap(); await s.show(cityEls, "pop"); s.show(flood, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.sfx.pop(); s.show(life, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Der Pharao – ein Gottkönig",
        say: "Der König Ägyptens hieß Pharao. Die Menschen glaubten: Er ist ein Sohn des Sonnengottes Re.",
        build(s) {
          const svg = s.svg(440, 600);
          const fig = s.el("g");
          fig.append(
            s.el("path", { d: "M60 600 C60 520 110 470 220 470 C330 470 380 520 380 600 Z", fill: "#c98d55" }),
            s.el("path", { d: "M100 520 C140 470 300 470 340 520", stroke: "#2f7fd0", "stroke-width": 14, fill: "none" }),
            s.el("path", { d: "M84 548 C130 490 310 490 356 548", stroke: GOLD, "stroke-width": 12, fill: "none" }),
            s.el("rect", { x: 195, y: 380, width: 50, height: 95, fill: "#c98d55" }),
            s.el("ellipse", { cx: 220, cy: 330, rx: 58, ry: 70, fill: "#d9a066" }),
            s.el("path", { d: "M185 318 L205 318 M235 318 L255 318", stroke: INK, "stroke-width": 5, "stroke-linecap": "round" }),
            s.el("path", { d: "M205 318 L214 312 M255 318 L262 312", stroke: INK, "stroke-width": 3 }),
            s.el("path", { d: "M206 366 Q220 374 234 366", stroke: "#8a3b1a", "stroke-width": 4, fill: "none" }));
          const beard = later(s.el("path", { d: "M210 392 L230 392 L234 452 L206 452 Z M208 410 L232 410 M207 428 L233 428", fill: "#3b2a1a", stroke: "#6b4a2a", "stroke-width": 2 }));
          const staffs = later(s.el("g", null,
            s.el("path", { d: "M150 600 L262 470 C272 456 290 458 290 474 C290 486 278 488 274 480", stroke: "#2a4a8a", "stroke-width": 10, fill: "none", "stroke-linecap": "round" }),
            s.el("path", { d: "M300 600 L184 476", stroke: GOLD, "stroke-width": 10, "stroke-linecap": "round" }),
            s.el("path", { d: "M184 476 L150 500 M184 476 L156 512 M184 476 L166 520", stroke: "#2a4a8a", "stroke-width": 6, "stroke-linecap": "round" })));
          svg.append(fig, beard, staffs);
          const W0 = { x: 90, y: 160, k: .62 }, R0 = { x: 345, y: 160, k: .62 }, F = { x: 220, y: 284 };
          const gW = s.el("g", { class: "later" }, whiteCrown(s));
          const gR = s.el("g", { class: "later" }, redCrown(s));
          const uraeus = later(s.el("path", { d: "M214 284 C206 270 210 256 220 256 C230 256 234 270 226 284 Z", fill: GOLD, stroke: INK, "stroke-width": 2 }));
          const set = (g, p) => g.setAttribute("transform", `translate(${p.x} ${p.y}) scale(${p.k})`);
          set(gW, W0); set(gR, R0);
          const lW = later(T(s, 90, 194, "Oberägypten", { fs: 20 })), lR = later(T(s, 345, 194, "Unterägypten", { fs: 20 }));
          const lD = later(T(s, 220, 60, "Doppelkrone", { fs: 26, fill: "#a21caf" }));
          svg.append(gW, gR, uraeus, lW, lR, lD);
          const items = [["Doppelkrone", "Herr über Ober- und Unterägypten"], ["Kobra (Uräus)", "Zeichen der Göttin Wadjet"], ["Zeremonialbart", "künstlich und geflochten"], ["Krummstab & Geißel", "Zeichen seiner Macht"]]
            .map(([a, b]) => later(s.h("p", { class: "t", style: { fontSize: "22px" } }, s.h("b", { style: { color: "var(--unit)" } }, a + ": "), b)));
          const merk = later(s.h("div", { class: "merk", style: { fontSize: "22px" } }, "Der Pharao galt als ", s.h("b", null, "„Sohn des Re“"), " und als Gott Horus auf Erden – ein ", s.h("b", null, "Gottkönig"), "."));
          const life = later(s.h("div", { class: "life" }, s.h("span", { class: "exlabel" }, "Im Alltag"), s.h("p", { class: "small" }, "Kronen zeigen bis heute Macht: die Königsfigur im Schach, der König auf Spielkarten, Kronen in Wappen.")));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "440px 1fr", gap: "36px", height: "100%", alignItems: "center" } }, svg,
            s.h("div", { class: "stack", style: { gap: "12px" } },
              s.h("p", { class: "t a-up" }, "„Pharao“ heißt eigentlich ", s.h("b", null, "„großes Haus“"), ". So nannte man zuerst den Palast."),
              ...items, merk, life)));
          s.show(svg, "fade"); s.sfx.pop();
          s.step(async () => { s.sfx.pop(); s.show([gW, lW], "bounce"); await s.wait(300); s.sfx.pop(); await s.show([gR, lR], "bounce"); s.say("Die weiße Krone stand für Oberägypten, die rote für Unterägypten."); });
          s.step(async () => {
            s.sfx.whoosh(); s.hide([lW, lR]);
            await s.tween({ dur: 900, ease: "back", update: v => { set(gW, { x: s.lerp(W0.x, F.x, v), y: s.lerp(W0.y, F.y - 6, v), k: s.lerp(W0.k, .88, v) }); set(gR, { x: s.lerp(R0.x, F.x, v), y: s.lerp(R0.y, F.y, v), k: s.lerp(R0.k, 1, v) }); } });
            s.sfx.ding(); s.show(lD, "pop"); s.show(uraeus, "pop"); s.show(items[0], "left"); await s.show(items[1], "left", 150);
            s.say("Zusammen ergeben sie die Doppelkrone: ein Land, ein Herrscher.");
          });
          s.step(async () => { s.sfx.snap(); s.show(beard, "pop"); await s.show(items[2], "left"); s.sfx.snap(); s.show(staffs, "pop"); await s.show(items[3], "left"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.sfx.pop(); s.show(life, "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Berühmte Pharaonen",
        say: "Ägypten hatte viele Pharaonen. Fünf berühmte lernst du jetzt kennen – auf dem Zeitstrahl.",
        build(s) {
          const svg = s.svg(1100, 140);
          const X = yr => 40 + (2700 - yr) / 1500 * 1020;
          svg.append(s.el("path", { d: "M30 64 L1074 64", stroke: INK, "stroke-width": 4 }), s.el("path", { d: "M1074 64 L1060 56 L1060 72 Z", fill: INK }));
          [2500, 2000, 1500].forEach(y => svg.append(s.el("path", { d: `M${X(y)} 56 L${X(y)} 72`, stroke: INK, "stroke-width": 3 }), T(s, X(y), 36, y + " v. Chr.", { fs: 19, fw: 600, fill: "#5d6678" })));
          const people = [
            { n: "Cheops", yr: 2600, d: "um 2600 v. Chr.", t: "Ließ die größte Pyramide in Gizeh bauen.", ic: "pyr" },
            { n: "Hatschepsut", yr: 1470, d: "1479–1458 v. Chr.", t: "Eine Frau als Pharao – auf Bildern mit Bart! Schickte Schiffe ins Land Punt.", ic: "ship" },
            { n: "Echnaton", yr: 1343, d: "1351–1334 v. Chr.", t: "Verehrte vor allem die Sonnenscheibe Aton. Seine Frau: Nofretete.", ic: "aton" },
            { n: "Tutanchamun", yr: 1328, d: "1332–1323 v. Chr.", t: "Wurde schon mit 8 bis 10 Jahren König. Sein Grab fand man 1922.", ic: "mask" },
            { n: "Ramses II.", yr: 1246, d: "1279–1213 v. Chr.", t: "Regierte 66 Jahre. Schloss den ältesten bekannten Friedensvertrag.", ic: "abu" },
          ];
          const colW = (1100 - 4 * 16) / 5;
          const icon = k => {
            const v = s.svg(170, 96);
            if (k === "pyr") v.append(s.el("path", { d: "M25 90 L85 14 L145 90 Z", fill: GOLD, stroke: INK, "stroke-width": 3 }), s.el("path", { d: "M85 14 L100 90", stroke: "#b07a10", "stroke-width": 3 }));
            if (k === "ship") v.append(s.el("path", { d: "M20 66 Q85 96 150 66 L140 60 L30 60 Z", fill: "#8a4b12" }), s.el("path", { d: "M85 60 L85 10", stroke: INK, "stroke-width": 4 }), s.el("path", { d: "M55 16 L115 16 L110 52 L60 52 Z", fill: "#f4ead2", stroke: INK, "stroke-width": 2 }), s.el("path", { d: "M10 84 q12 -8 24 0 t24 0 t24 0 t24 0 t24 0 t24 0", stroke: NILE, "stroke-width": 3, fill: "none" }));
            if (k === "aton") { v.append(s.el("circle", { cx: 85, cy: 26, r: 20, fill: "#f2a516" })); for (let i = -3; i <= 3; i++) { const a = Math.PI / 2 + i * .32; v.append(s.el("path", { d: `M${85 + 22 * Math.cos(a)} ${26 + 22 * Math.sin(a)} L${85 + 64 * Math.cos(a)} ${26 + 64 * Math.sin(a)}`, stroke: "#f2a516", "stroke-width": 3 }), s.el("circle", { cx: 85 + 66 * Math.cos(a), cy: 26 + 66 * Math.sin(a), r: 4, fill: "#f2a516" })); } }
            if (k === "mask") v.append(s.el("path", { d: "M45 92 L52 30 C55 6 115 6 118 30 L125 92 Z", fill: GOLD, stroke: INK, "stroke-width": 2 }), s.el("path", { d: "M52 44 L62 44 M52 58 L62 58 M52 72 L62 72 M108 44 L118 44 M108 58 L118 58 M108 72 L118 72", stroke: "#2f5fb0", "stroke-width": 6 }), s.el("ellipse", { cx: 85, cy: 50, rx: 20, ry: 25, fill: "#f2c14e" }), s.el("path", { d: "M78 76 L92 76 L90 94 L80 94 Z", fill: "#2f5fb0" }));
            if (k === "abu") { v.append(s.el("rect", { x: 10, y: 20, width: 150, height: 74, fill: "#e8c98f", stroke: INK, "stroke-width": 2 })); [30, 62, 98, 130].forEach(x => v.append(s.el("rect", { x: x - 10, y: 46, width: 22, height: 44, fill: "#c99a55" }), s.el("circle", { cx: x + 1, cy: 38, r: 10, fill: "#c99a55" }))); }
            return v;
          };
          const PH = { pyr: "pyramiden-gizeh", ship: "hatschepsut", aton: "echnaton-altar", mask: "tut-maske", abu: "abu-simbel" };
          const PP = { ship: "50% 20%", mask: "50% 25%", aton: "50% 30%" };
          const lines = [], dots = [], cards = [];
          people.forEach((p, i) => {
            const cx = colW / 2 + i * (colW + 16);
            const x = X(p.yr);
            dots.push(later(s.el("circle", { cx: x, cy: 64, r: 10, fill: "#a21caf", stroke: "#fff", "stroke-width": 3 })));
            lines.push(later(s.el("path", { d: `M${x} 74 C${x} 110 ${cx} 100 ${cx} 140`, stroke: "#a21caf", "stroke-width": 3, fill: "none", "stroke-dasharray": "6 5" })));
            cards.push(later(s.h("div", { class: "card", style: { padding: "12px 14px", display: "flex", flexDirection: "column", gap: "8px", alignItems: "center", textAlign: "center" } },
              s.photo(PH[p.ic], { w: "100%", h: 130, pos: PP[p.ic] || "50% 40%" }), s.h("p", { class: "h2", style: { fontSize: "25px" } }, p.n), s.h("span", { class: "chip", style: { fontSize: "19px", whiteSpace: "nowrap" } }, p.d), s.h("p", { class: "small" }, p.t))));
          });
          svg.append(...lines, ...dots);
          s.add(s.h("div", { class: "stack", style: { gap: "0" } }, svg, s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", alignItems: "start" } }, ...cards)));
          s.sfx.whoosh();
          people.forEach((p, i) => s.step(async () => { s.sfx.count(i * 2); s.show(dots[i], "pop"); s.show(lines[i], "draw"); await s.show(cards[i], "up"); s.say(p.n + ". " + p.t); }));
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Nofretete und Tutanchamun",
        say: "Zwei Schätze aus Ägypten sind weltberühmt: die Büste der Nofretete und das Grab von Tutanchamun.",
        build(s) {
          const nef = s.photo("nofretete", { w: 250, h: 330, pos: "50% 35%" });
          const tomb = s.photo("tut-maske", { w: 250, h: 330, pos: "50% 30%", cls: "later" });
          const left = s.h("div", { class: "card", style: { display: "grid", gridTemplateColumns: "250px 1fr", gap: "18px", alignItems: "center", height: "100%" } }, nef,
            s.h("div", { class: "stack", style: { gap: "10px" } }, s.h("p", { class: "h2" }, "Nofretete"), s.h("p", { class: "small" }, "Frau von Echnaton. Ihre bemalte Büste ist über 3.300 Jahre alt."), s.h("p", { class: "small" }, s.h("b", null, "Gefunden:"), " 6. Dezember 1912 in Amarna")));
          const right = later(s.h("div", { class: "card", style: { display: "grid", gridTemplateColumns: "250px 1fr", gap: "18px", alignItems: "center", height: "100%" } }, tomb,
            s.h("div", { class: "stack", style: { gap: "10px" } }, s.h("p", { class: "h2" }, "Tutanchamun"), s.h("p", { class: "small" }, s.h("b", null, "4. November 1922:"), " Howard Carter findet sein Grab im Tal der Könige."), s.h("p", { class: "small" }, "Darin: die goldene Totenmaske."))));
          const life = later(s.h("div", { class: "life", style: { gridColumn: "1 / 3" } }, s.h("span", { class: "exlabel" }, "Im Alltag"), s.h("p", { class: "t" }, "Nofretete „wohnt“ in Berlin! Seit 2009 steht sie im ", s.h("b", null, "Neuen Museum auf der Museumsinsel"), ". Du kannst sie besuchen.")));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "28px", height: "100%", alignContent: "center", alignItems: "stretch" } },
            s.h("div", { class: "a-left" }, left), right, life));
          s.sfx.whoosh();
          s.step(async () => {
            s.sound("door-creak", { vol: .5 }); await s.show(right, "up");
            s.sound("magic-chime", { vol: .5 }); await s.show(tomb, "zoom"); s.say("Gold! Hinter der Tür lag ein unglaublicher Schatz.");
          });
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); s.say("Nofretete steht im Neuen Museum in Berlin."); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Eine Pyramide entsteht",
        say: "Schau zu, wie die Pyramide des Cheops Schicht für Schicht wächst.",
        build(s) {
          const CW = 520, CH = 470, L = 11, BW = 22, BH = 34, X0 = 18, GY = 446;
          const { canvas, g } = s.canvas(CW, CH);
          const blocks = [];
          for (let i = 0; i < L; i++) for (let j = 0; j < 22 - 2 * i; j++) blocks.push({ x: X0 + (i + j) * BW, y: GY - (i + 1) * BH, i, shade: (i * 7 + j * 13) % 5 });
          let built = 0, casing = 0;
          const draw = () => {
            g.clearRect(0, 0, CW, CH);
            const sky = g.createLinearGradient(0, 0, 0, GY); sky.addColorStop(0, "#cfe9fb"); sky.addColorStop(1, "#fbecc8");
            g.fillStyle = sky; g.fillRect(0, 0, CW, GY);
            g.fillStyle = "#f2a516"; g.beginPath(); g.arc(450, 70, 30, 0, Math.PI * 2); g.fill();
            g.fillStyle = "#e3c27f"; g.fillRect(0, GY, CW, CH - GY);
            for (let k = 0; k < Math.floor(built); k++) {
              const b = blocks[k];
              g.fillStyle = ["#d8b36f", "#d1aa64", "#dcb978", "#ceaa6a", "#d6b170"][b.shade];
              g.fillRect(b.x, b.y, BW, BH); g.strokeStyle = "#9c7a3c"; g.lineWidth = 1.5; g.strokeRect(b.x + .5, b.y + .5, BW - 1, BH - 1);
            }
            if (casing > 0) {
              g.globalAlpha = casing; g.fillStyle = "#f7f1e1"; g.beginPath(); g.moveTo(X0, GY); g.lineTo(X0 + 22 * BW, GY); g.lineTo(X0 + 11 * BW, GY - L * BH - 20); g.closePath(); g.fill();
              g.fillStyle = "rgba(170,140,90,.35)"; g.beginPath(); g.moveTo(X0 + 11 * BW, GY - L * BH - 20); g.lineTo(X0 + 22 * BW, GY); g.lineTo(X0 + 15 * BW, GY); g.closePath(); g.fill();
              g.globalAlpha = 1;
            }
          };
          draw();
          let lastLayer = -1;
          const build = async () => {
            casing = 0; built = 0; lastLayer = -1; draw();
            await s.tween({ from: 0, to: blocks.length, dur: 3200, ease: "linear", update: v => { built = v; const k = Math.min(blocks.length - 1, Math.floor(v)); const lay = blocks[k].i; if (lay !== lastLayer) { lastLayer = lay; s.sfx.count(lay); } draw(); } });
            built = blocks.length; draw();
          };
          const smooth = async () => { s.sfx.whoosh(); await s.tween({ dur: 1200, update: v => { casing = v; draw(); } }); s.sfx.ding(); };
          const again = later(s.h("button", { class: "btn", onclick: async () => { s.sfx.click(); await build(); await smooth(); } }, "Nochmal bauen"));
          const stat = (val, lbl) => { const n = s.h("p", { class: "big mono", style: { color: "var(--unit)" } }, val); return { n, el: later(s.h("div", { class: "card", style: { padding: "12px 16px" } }, n, s.h("p", { class: "small" }, lbl))) }; };
          const st = [stat("0 m", "hoch – ursprünglich (heute 139 m)"), stat("0 m", "lang ist jede Seite"), stat("0", "Steinblöcke, ungefähr"), stat("0,5–15 t", "wiegt ein einzelner Block")];
          const bars = s.svg(470, 104);
          const bP = s.el("rect", { x: 130, y: 12, width: 0, height: 32, rx: 6, fill: GOLD }), bF = s.el("rect", { x: 130, y: 60, width: 0, height: 32, rx: 6, fill: "#5d6678" });
          bars.append(T(s, 0, 36, "Pyramide", { a: "start", fs: 20 }), T(s, 0, 84, "Fernsehturm", { a: "start", fs: 20 }), bP, bF);
          const vP = T(s, 136, 36, "", { a: "start", fs: 19, fill: INK }), vF = T(s, 136, 84, "", { a: "start", fs: 19, fill: "#fff" });
          bars.append(vP, vF);
          const life = later(s.h("div", { class: "life", style: { padding: "12px 18px" } }, s.h("span", { class: "exlabel" }, "Im Alltag: Berlin zum Vergleich"), bars, s.h("p", { class: "small" }, "Über 3.700 Jahre lang war sie das höchste Bauwerk der Welt.")));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "520px 1fr", gap: "28px", height: "100%", alignItems: "center" } },
            s.h("div", { class: "stack", style: { alignItems: "center", gap: "10px" } }, canvas, again),
            s.h("div", { class: "stack", style: { gap: "14px" } }, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" } }, ...st.map(x => x.el)), life)));
          s.show(canvas, "fade");
          s.step(async () => { s.say("Erst kommen die unteren Schichten, dann wird jede Schicht kleiner."); await build(); });
          s.step(async () => { s.say("Zum Schluss bekam die Pyramide eine glatte weiße Hülle aus feinem Kalkstein."); await smooth(); s.show(again, "pop"); });
          s.step(async () => {
            s.sfx.pop(); await s.show(st.map(x => x.el), "up");
            const cnt = (el, to, unit, dec = 0) => s.tween({ dur: 1300, ease: "out", update: v => { el.textContent = s.fmt(v * to, dec) + unit; } });
            await Promise.all([cnt(st[0].n, 146, " m"), cnt(st[1].n, 230, " m"), cnt(st[2].n, 2.3, " Mio.", 1)]); s.sfx.coin();
          });
          s.step(async () => {
            s.sfx.pop(); await s.show(life, "up");
            await s.tween({ dur: 1200, ease: "out", update: v => { bP.setAttribute("width", 146 / 368 * 320 * v); bF.setAttribute("width", 320 * v); vP.setAttribute("x", 136 + 146 / 368 * 320 * v); vP.textContent = Math.round(146 * v) + " m"; vF.textContent = Math.round(368 * v) + " m"; } });
            s.sfx.ding(); s.say("Der Berliner Fernsehturm ist mit 368 Metern höher – aber 4.500 Jahre jünger.");
          });
        },
      },
      /* 5b --------------------------------------------------------------- */
      {
        title: "Gizeh in echt",
        say: "So sehen die Pyramiden von Gizeh heute aus. Ganz nah merkst du, wie riesig jeder Steinblock ist.",
        build(s) {
          const f1 = s.photo("pyramiden-gizeh", { w: 640, h: 390, caption: "Die Pyramiden von Gizeh", kb: true });
          const f2 = s.photo("cheops-bloecke", { w: 440, h: 390, caption: "Cheops-Pyramide: Block auf Block", cls: "later", pos: "40% 60%" });
          const f3 = s.photo("sphinx-pyramiden", { w: 1100, h: 210, caption: "Vorne die Sphinx: ein Löwe mit Menschenkopf", cls: "later", pos: "50% 60%" });
          s.add(s.h("div", { class: "stack", style: { gap: "18px", height: "100%", justifyContent: "center" } }, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "20px" } }, f1, f2), f3));
          s.show(f1, "fade"); s.sound("wind", { vol: .35, dur: 6 });
          s.step(async () => { s.sound("stein-schieben", { vol: .5 }); await s.show(f2, "zoom"); s.say("Jeder Steinblock ist riesig und tonnenschwer."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(f3, "up"); s.say("Vor den Pyramiden liegt die große Sphinx."); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Wie kamen die Steine nach oben?",
        say: "Ohne Kran und ohne Motor: Wie kamen die schweren Steine nach oben? Forscher haben mehrere Ideen.",
        build(s) {
          const scene = (kind) => {
            const v = s.svg(320, 190);
            v.append(s.el("rect", { x: 0, y: 0, width: 320, height: 190, rx: 14, fill: "#fbecc8" }), s.el("rect", { x: 0, y: 170, width: 320, height: 20, fill: "#e3c27f" }));
            let track;
            if (kind === "gerade") {
              v.append(s.el("path", { d: "M180 170 L215 82 L265 82 L300 170 Z", fill: "#d8b36f", stroke: "#9c7a3c", "stroke-width": 2 }));
              v.append(s.el("path", { d: "M10 170 L215 82 L215 96 L44 170 Z", fill: "#b98b4e" }));
              track = s.el("path", { d: "M18 164 L212 78", fill: "none", stroke: "none" });
            } else if (kind === "spirale") {
              v.append(s.el("path", { d: "M60 170 L160 20 L260 170 Z", fill: "#d8b36f", stroke: "#9c7a3c", "stroke-width": 2 }));
              track = s.el("path", { d: "M70 162 L244 150 L95 118 L222 104 L120 80 L196 68 L150 40", fill: "none", stroke: "#8a5a22", "stroke-width": 7, "stroke-linejoin": "round", opacity: .8 });
            } else {
              v.append(s.el("path", { d: "M60 170 L160 20 L260 170 Z", fill: "#d8b36f", stroke: "#9c7a3c", "stroke-width": 2 }));
              v.append(s.el("path", { d: "M8 170 L104 128 L112 140 L30 170 Z", fill: "#b98b4e" }));
              track = s.el("path", { d: "M14 166 L106 128 L210 112 L118 84 L186 66 L150 44", fill: "none", stroke: "#5d6678", "stroke-width": 4, "stroke-dasharray": "7 6" });
            }
            v.append(track);
            const blk = s.el("rect", { x: -11, y: -18, width: 22, height: 16, fill: "#f7f1e1", stroke: INK, "stroke-width": 2 });
            v.append(blk);
            return { v, track, blk };
          };
          const kinds = [["gerade", "Gerade Rampe", "Eine lange Rampe führt vor der Pyramide nach oben."], ["spirale", "Rampe außen herum", "Ein Weg windet sich wie eine Spirale um die Pyramide."], ["innen", "Innenrampe", "Unten eine Rampe außen, weiter oben ein Gang innen drin."]];
          const sc = kinds.map(([k, n, t]) => { const o = scene(k); o.card = later(s.h("div", { class: "card", style: { padding: "12px 14px", display: "flex", flexDirection: "column", gap: "6px" } }, o.v, s.h("p", { class: "h2", style: { fontSize: "24px" } }, n), s.h("p", { class: "small" }, t))); return o; });
          const runOn = o => s.loop(t => { const L = o.track.getTotalLength(); const p = o.track.getPointAtLength(L * ((t * .22) % 1)); o.blk.setAttribute("transform", `translate(${p.x} ${p.y})`); });
          sc.forEach(o => { const p = o.track.getPointAtLength(0); o.blk.setAttribute("transform", `translate(${p.x} ${p.y})`); });
          const boat = s.svg(500, 150);
          boat.append(s.el("rect", { x: 0, y: 0, width: 500, height: 150, rx: 14, fill: "#e4f2fb" }), s.el("rect", { x: 0, y: 100, width: 500, height: 50, fill: "#6db3e3" }));
          const ship = s.el("g", null, s.el("path", { d: "M-80 96 Q0 130 80 96 L70 88 L-70 88 Z", fill: "#8a4b12" }), s.el("rect", { x: -50, y: 58, width: 40, height: 30, fill: "#f7f1e1", stroke: INK, "stroke-width": 2 }), s.el("rect", { x: 0, y: 64, width: 46, height: 24, fill: "#c98a8a", stroke: INK, "stroke-width": 2 }), s.el("path", { d: "M-6 88 L-6 20", stroke: INK, "stroke-width": 3 }));
          boat.append(ship); ship.setAttribute("transform", "translate(100 0)");
          const boatCard = later(s.h("div", { class: "card soft", style: { display: "grid", gridTemplateColumns: "500px 1fr", gap: "18px", alignItems: "center", padding: "12px 16px" } }, boat,
            s.h("p", { class: "small" }, "Kalkstein aus Tura und Granit aus Assuan kamen mit ", s.h("b", null, "Booten über den Nil"), ". An Land zog man die Blöcke auf ", s.h("b", null, "Schlitten"), ". Wasser machte den Boden glatt.")));
          const merk = later(s.h("div", { class: "merk", style: { fontSize: "22px" } }, "Wie genau es war, weiß niemand sicher. Forscher streiten bis heute!"));
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%", justifyContent: "center" } },
            s.h("div", { class: "cols3", style: { gap: "18px" } }, ...sc.map(o => o.card)), boatCard, merk));
          sc.forEach((o, i) => s.step(async () => { s.sound("stein-schieben", { vol: .45, dur: 2.5 }); await s.show(o.card, "up"); runOn(o); s.sfx.pop(); s.say(kinds[i][1] + ". " + kinds[i][2]); }));
          s.step(async () => { s.sound("ruder", { vol: .5 }); await s.show(boatCard, "up"); s.loop(t => { ship.setAttribute("transform", `translate(${100 + ((t * 60) % 400)} ${Math.sin(t * 3) * 2})`); }); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "pop"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Wer baute die Pyramiden?",
        say: "Früher dachte man: Sklaven bauten die Pyramiden. Heute weiß man es besser.",
        build(s) {
          const svg = s.svg(500, 470);
          svg.append(s.el("rect", { x: 0, y: 0, width: 500, height: 470, rx: 20, fill: "#fbecc8" }), s.el("rect", { x: 0, y: 360, width: 500, height: 110, fill: "#e3c27f" }),
            s.el("path", { d: "M300 360 L400 210 L500 360 Z", fill: "#d8b36f", stroke: "#9c7a3c", "stroke-width": 2 }));
          const oven = s.el("g", null, s.el("path", { d: "M30 360 L30 290 C30 250 110 250 110 290 L110 360 Z", fill: "#b5653a", stroke: INK, "stroke-width": 3 }), s.el("path", { d: "M52 360 L52 318 C52 300 88 300 88 318 L88 360 Z", fill: "#3a1e10" }), s.el("ellipse", { cx: 70, cy: 345, rx: 12, ry: 7, fill: "#e8b25f" }));
          const smoke = [0, 1, 2].map(i => s.el("circle", { cx: 70, cy: 240, r: 8, fill: "#bbb", opacity: .5 }));
          svg.append(oven, ...smoke);
          const team = s.el("g");
          const person = (x) => s.el("g", { transform: `translate(${x} 0)` }, s.el("circle", { cx: 0, cy: 300, r: 11, fill: "#8a5a32" }), s.el("path", { d: "M0 311 L-6 340 M-6 340 L-16 362 M-6 340 L4 362 M0 318 L18 312", stroke: "#8a5a32", "stroke-width": 6, "stroke-linecap": "round", fill: "none" }), s.el("path", { d: "M-6 326 L-14 342 L4 342 Z", fill: "#fbfaf2" }));
          const sled = s.el("g", null, s.el("rect", { x: 300, y: 300, width: 80, height: 52, fill: "#d8b36f", stroke: "#9c7a3c", "stroke-width": 3 }), s.el("path", { d: "M292 360 L388 360 C396 360 396 352 390 352 L292 352", stroke: "#6b4a2a", "stroke-width": 6, fill: "none" }));
          team.append(s.el("path", { d: "M150 316 L296 330", stroke: "#6b4a2a", "stroke-width": 3 }), ...[150, 186, 222, 258].map(person), sled);
          svg.append(team);
          const water = s.el("g", { class: "later" }, s.el("g", { transform: "translate(410 0)" }, s.el("circle", { cx: 0, cy: 300, r: 11, fill: "#8a5a32" }), s.el("path", { d: "M0 311 L0 340 L-8 362 M0 340 L8 362 M0 318 L-16 326", stroke: "#8a5a32", "stroke-width": 6, "stroke-linecap": "round", fill: "none" }), s.el("rect", { x: -34, y: 318, width: 18, height: 16, fill: "#b5653a" })), s.el("path", { d: "M378 336 q-4 10 -2 22", stroke: NILE, "stroke-width": 4, fill: "none" }));
          svg.append(water);
          const lblVillage = later(T(s, 70, 410, "Bäckerei", { fs: 21 })), lblTeam = later(T(s, 205, 410, "Zugteam", { fs: 21 }));
          svg.append(lblVillage, lblTeam);
          const pts = [
            ["Keine Sklaven!", "Die Arbeiter wohnten in einer eigenen Stadt neben den Pyramiden."],
            ["Gutes Essen", "Es gab Bäckereien: Brot, Bier – und sogar Fleisch."],
            ["Teams mit Namen", "z. B. „Freunde des Cheops“. Viele Bauern halfen abwechselnd mit."],
            ["Eigene Gräber", "Die Arbeiter wurden auf einem Friedhof nahe der Pyramiden begraben."],
          ].map(([a, b], i) => later(s.h("div", { class: "card", style: { padding: "10px 16px" } }, s.h("p", { class: "t" }, s.h("b", { style: { color: "var(--unit)" } }, a), " – ", b))));
          const life = later(s.h("div", { class: "life", style: { padding: "12px 18px" } }, s.h("span", { class: "exlabel" }, "Im Alltag"), s.h("p", { class: "small" }, "Wie heute: Auf einer Großbaustelle gibt es Teams und Schichten. Im Fußballteam und im Orchester hat jeder seine Aufgabe.")));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "500px 1fr", gap: "28px", height: "100%", alignItems: "center" } }, svg, s.h("div", { class: "stack", style: { gap: "12px" } }, ...pts, life)));
          s.show(svg, "fade"); s.sfx.pop();
          s.loop(t => { team.setAttribute("transform", `translate(${Math.sin(t * 2.4) * 6} 0)`); smoke.forEach((c, i) => { const k = (t * .4 + i / 3) % 1; c.setAttribute("cy", 250 - k * 90); c.setAttribute("cx", 70 + Math.sin(k * 6) * 8); c.setAttribute("opacity", .5 * (1 - k)); }); });
          s.step(async () => { s.sfx.error(); await s.show(pts[0], "left"); s.sfx.snap(); s.show(lblTeam, "pop"); s.say("Keine Sklaven: Die Arbeiter hatten eine eigene Stadt."); });
          s.step(async () => { s.sound("fire", { vol: .45, dur: 3 }); s.show(lblVillage, "pop"); await s.show(pts[1], "left"); });
          s.step(async () => { s.sound("meissel", { vol: .45, dur: 2.5 }); s.show(water, "pop"); await s.show(pts[2], "left"); });
          s.step(async () => { s.sfx.pop(); await s.show(pts[3], "left"); s.sfx.ding(); s.show(life, "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Die Götter Ägyptens",
        say: "Die Ägypter glaubten an viele Götter. Viele sehen aus wie Menschen mit einem Tierkopf.",
        build(s) {
          const sym = k => {
            const v = s.svg(110, 110);
            v.append(s.el("circle", { cx: 55, cy: 55, r: 53, fill: "#f7e3f9" }));
            if (k === "re") { const rays = s.el("g"); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; rays.append(s.el("path", { d: `M${55 + 30 * Math.cos(a)} ${55 + 30 * Math.sin(a)} L${55 + 44 * Math.cos(a)} ${55 + 44 * Math.sin(a)}`, stroke: "#f2a516", "stroke-width": 5, "stroke-linecap": "round" })); } v.append(rays, s.el("circle", { cx: 55, cy: 55, r: 24, fill: RED })); v.rays = rays; }
            if (k === "osiris") v.append(s.el("path", { d: "M30 92 L68 24 C74 14 88 18 84 30 C82 36 76 34 76 30", stroke: "#2a4a8a", "stroke-width": 8, fill: "none", "stroke-linecap": "round" }), s.el("path", { d: "M82 92 L40 30", stroke: GOLD, "stroke-width": 8, "stroke-linecap": "round" }), s.el("path", { d: "M40 30 L20 40 M40 30 L22 50 M40 30 L28 58", stroke: "#2a4a8a", "stroke-width": 5, "stroke-linecap": "round" }));
            if (k === "isis") v.append(s.el("path", { d: "M34 88 L34 30 L54 30 L54 62 L80 62 L80 88 Z", fill: "#2f5fb0" }), s.el("path", { d: "M40 70 L74 70", stroke: "#fff", "stroke-width": 4 }));
            if (k === "horus") v.append(s.el("path", { d: "M18 50 C34 30 74 30 90 50 C74 66 34 66 18 50 Z", fill: "#fff", stroke: INK, "stroke-width": 5 }), s.el("circle", { cx: 54, cy: 50, r: 11, fill: INK }), s.el("path", { d: "M18 34 C40 22 70 22 92 30 M50 62 L46 90 M60 62 C72 76 82 76 80 66", stroke: INK, "stroke-width": 5, fill: "none", "stroke-linecap": "round" }));
            if (k === "anubis") v.append(s.el("path", { d: "M14 84 L20 66 C24 58 36 58 44 60 L76 60 C88 60 92 70 92 84 Z", fill: "#1b1b1b" }), s.el("path", { d: "M30 64 L22 40 L18 22 L28 36 L34 22 L38 44 L14 52 L8 56 L30 64 Z", fill: "#1b1b1b" }), s.el("path", { d: "M92 74 C102 74 104 86 98 88", stroke: "#1b1b1b", "stroke-width": 5, fill: "none" }), s.el("circle", { cx: 28, cy: 46, r: 3, fill: GOLD }));
            if (k === "thot") v.append(s.el("path", { d: "M84 14 A18 18 0 1 0 96 40 A14 14 0 1 1 84 14 Z", fill: "#b9b9c8" }), s.el("path", { d: "M30 100 C26 80 30 62 38 50", stroke: INK, "stroke-width": 12, fill: "none", "stroke-linecap": "round" }), s.el("ellipse", { cx: 42, cy: 40, rx: 15, ry: 12, fill: INK }), s.el("path", { d: "M52 40 C70 44 82 58 88 80", stroke: INK, "stroke-width": 5, fill: "none", "stroke-linecap": "round" }), s.el("circle", { cx: 44, cy: 37, r: 3, fill: "#fff" }));
            return v;
          };
          const gods = [["re", "Re", "Sonnengott. Der Pharao hieß „Sohn des Re“."], ["osiris", "Osiris", "Gott der Toten, König im Jenseits."], ["isis", "Isis", "Frau des Osiris, Mutter des Horus. Ihr Zeichen: ein Thron."], ["horus", "Horus", "Himmelsgott mit Falkenkopf. Sein Zeichen: das Horusauge."], ["anubis", "Anubis", "Gott mit Schakalkopf. Er wacht über Mumien und Gräber."], ["thot", "Thot", "Gott mit Ibiskopf. Gott der Schrift und Weisheit."]];
          let reSvg = null;
          const GP = { re: ["gott-re", "60% 30%"], osiris: ["gott-osiris", "50% 30%"], isis: ["gott-isis", "60% 25%"], horus: ["gott-horus", "50% 30%"], anubis: ["gott-anubis", "40% 50%"], thot: ["gott-thot", "35% 50%"] };
          const cards = gods.map(([k, n, t]) => { const v = s.photo(GP[k][0], { w: 130, h: 180, pos: GP[k][1] }); return later(s.h("div", { class: "card", style: { display: "grid", gridTemplateColumns: "130px 1fr", gap: "14px", alignItems: "center", padding: "12px 14px" } }, v, s.h("div", { class: "stack", style: { gap: "4px" } }, s.h("p", { class: "h2", style: { fontSize: "27px", color: "var(--unit)" } }, n), s.h("p", { class: "small" }, t)))); });
          const merk = later(s.h("div", { class: "merk" }, "Viele Götter statt einem. Jeder Gott hat eine ", s.h("b", null, "Aufgabe"), " und ein ", s.h("b", null, "Erkennungszeichen"), " – wie ein Tierkopf oder ein Zeichen auf dem Kopf."));
          s.add(s.h("div", { class: "stack", style: { gap: "18px", height: "100%", justifyContent: "center" } }, s.h("div", { class: "cols3", style: { gap: "16px" } }, ...cards), merk));
          s.sfx.chord([0, 4, 7]);
          for (let p = 0; p < 3; p++) s.step(async () => { s.sfx.pop(); s.show(cards[p * 2], "pop"); await s.wait(200); s.sfx.pop(); await s.show(cards[p * 2 + 1], "pop"); s.say(gods[p * 2][1] + " und " + gods[p * 2 + 1][1] + "."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Die Mumie – in 5 Schritten",
        say: "Die Ägypter wollten den Körper für das Leben nach dem Tod erhalten. Darum machten sie Mumien.",
        build(s) {
          const svg0 = s.svg(600, 370);
          svg0.append(s.el("rect", { x: 0, y: 0, width: 600, height: 370, rx: 20, fill: "#f7efe0" }));
          const svg = s.el("g", { transform: "translate(0 -76)" }); svg0.append(svg);
          svg.append(
            s.el("rect", { x: 80, y: 298, width: 440, height: 18, rx: 4, fill: "#8a6a44" }), s.el("path", { d: "M100 316 L100 370 M500 316 L500 370", stroke: "#8a6a44", "stroke-width": 10 }));
          const body = s.el("g", null, s.el("circle", { cx: 130, cy: 268, r: 30, fill: "#d9a066" }), s.el("rect", { x: 160, y: 244, width: 330, height: 52, rx: 26, fill: "#d9a066" }));
          const heart = later(s.el("path", { d: "M250 262 C250 252 238 248 233 256 C228 248 216 252 216 262 C216 272 233 282 233 282 C233 282 250 272 250 262 Z", fill: RED }));
          const heartL = later(T(s, 233, 230, "Herz bleibt!", { fs: 20, fill: RED }));
          svg.append(body, heart, heartL);
          const drops = [0, 1, 2, 3, 4, 5].map(i => s.el("path", { d: "M0 0 C-6 10 -6 16 0 16 C6 16 6 10 0 0 Z", fill: NILE, class: "later", transform: `translate(${170 + i * 55} 150)` }));
          svg.append(...drops);
          const jarNames = ["Leber", "Lunge", "Magen", "Darm"];
          const jars = jarNames.map((n, i) => { const x = 160 + i * 95; return later(s.el("g", null, s.el("path", { d: `M${x - 18} 352 C${x - 26} 380 ${x - 18} 404 ${x} 404 C${x + 18} 404 ${x + 26} 380 ${x + 18} 352 Z`, fill: "#e8d6b0", stroke: INK, "stroke-width": 2 }), s.el("circle", { cx: x, cy: 344, r: 12, fill: "#c99a55", stroke: INK, "stroke-width": 2 }), T(s, x, 430, n, { fs: 19 }))); });
          svg.append(...jars);
          const salt = s.el("g", { class: "later" });
          for (let i = 0; i < 90; i++) salt.append(s.el("circle", { cx: 110 + (i * 37) % 390, cy: 236 + (i * 23) % 64, r: 6, fill: "#fff", stroke: "#bbb", "stroke-width": 1.5 }));
          svg.append(salt);
          const wrap = s.el("g");
          const wrapBase = later(s.el("g", null, s.el("circle", { cx: 130, cy: 268, r: 31, fill: "#efe6cf" }), s.el("rect", { x: 159, y: 243, width: 332, height: 54, rx: 27, fill: "#efe6cf" })));
          wrap.append(wrapBase);
          const bands = [];
          for (let x = 110; x <= 480; x += 24) bands.push(later(s.el("path", { d: `M${x} 244 L${x + 18} 296`, stroke: "#c9b98f", "stroke-width": 4 })));
          wrap.append(...bands);
          const amulet = later(s.el("path", { d: "M330 262 C330 252 342 252 342 262 C342 270 336 276 336 276 C336 276 330 270 330 262 Z M322 266 L350 266", fill: "#2f9a6a", stroke: "#2f9a6a", "stroke-width": 3 }));
          wrap.append(amulet);
          svg.append(wrap);
          const coffin = later(s.el("path", { d: "M84 268 C84 222 126 214 170 222 L500 226 C530 228 540 250 540 268 C540 286 530 308 500 310 L170 314 C126 322 84 314 84 268 Z", fill: GOLD, stroke: INK, "stroke-width": 4, opacity: .96 }));
          const coffinFace = later(s.el("g", null, s.el("ellipse", { cx: 140, cy: 268, rx: 34, ry: 38, fill: "#f2c14e", stroke: INK, "stroke-width": 2 }), s.el("path", { d: "M122 260 L134 260 M146 260 L158 260", stroke: INK, "stroke-width": 4 }), s.el("path", { d: "M200 230 L200 306 M260 230 L260 306 M320 230 L320 306 M380 230 L380 306 M440 230 L440 306", stroke: "#2f5fb0", "stroke-width": 8 })));
          svg.append(coffin, coffinFace);
          const day = s.h("span", { class: "mono" }, "0");
          const counter = s.h("p", { class: "big" }, "Tag ", day);
          const steps = ["Den Körper waschen.", "Die Organe kommen in 4 Krüge. Das Herz bleibt im Körper!", "Mit Natron-Salz trocknen – etwa 40 Tage.", "In Leinenbinden wickeln. Amulette sollen schützen.", "In den Sarg – nach etwa 70 Tagen ist alles fertig."];
          const li = steps.map((t, i) => later(s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "12px", alignItems: "flex-start" } }, s.h("span", { class: "chip", style: { background: "var(--unit)", color: "#fff", minWidth: "36px", justifyContent: "center", fontSize: "19px" } }, String(i + 1)), s.h("p", { class: "small", style: { fontSize: "20px" } }, t))));
          const life = later(s.h("div", { class: "life", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, "Im Alltag"), s.h("p", { class: "small" }, "Trocknen und Salz machen haltbar – wie bei Rosinen, Salzhering und Trockenobst.")));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "600px 1fr", gap: "26px", height: "100%", alignItems: "center" } }, svg0, s.h("div", { class: "stack", style: { gap: "10px" } }, counter, ...li, life)));
          s.show(svg0, "fade"); s.sfx.pop();
          const countTo = (a, b, dur) => s.tween({ from: a, to: b, dur, ease: "linear", update: v => { const n = Math.round(v); if (day.textContent !== String(n)) { day.textContent = n; if (n % 5 === 0) s.sfx.tick(); } } });
          s.step(async () => { s.sfx.whoosh(); s.show(li[0], "left"); await s.show(drops, "down"); await s.wait(200); s.hide(drops); countTo(0, 1, 300); });
          s.step(async () => { s.sfx.pop(); s.show(li[1], "left"); await s.show(jars, "bounce"); s.sfx.ding(); s.show(heart, "pop"); s.show(heartL, "fade"); s.say("Das Herz blieb im Körper. Es war für das Totengericht wichtig."); });
          s.step(async () => { s.sound("korn-schuetten", { vol: .45 }); s.hide([heart, heartL]); s.show(li[2], "left"); await s.show(salt, "fade"); await countTo(1, 40, 1800); });
          s.step(async () => { s.hide(salt); s.show(li[3], "left"); s.show(wrapBase, "fade"); s.sfx.swoosh(); await s.show(bands, "draw"); s.sfx.pop(); s.show(amulet, "pop"); await countTo(40, 60, 700); });
          s.step(async () => { s.sfx.drum(); s.show(li[4], "left"); s.show(coffin, "down"); await s.show(coffinFace, "fade", 300); await countTo(60, 70, 600); s.sfx.ding(); s.show(life, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Das Totengericht",
        say: "Nach dem Tod kam das Herz auf eine Waage. Auf der anderen Seite lag die Feder der Göttin Maat.",
        build(s) {
          const svg = s.svg(600, 520);
          const P = { x: 300, y: 150 }, HL = 190, DROP = 120;
          svg.append(s.el("rect", { x: 0, y: 0, width: 600, height: 520, rx: 20, fill: "#f7efe0" }),
            s.el("path", { d: `M300 150 L300 450 M240 450 L360 450`, stroke: "#6b4a2a", "stroke-width": 12, "stroke-linecap": "round" }),
            s.el("circle", { cx: 300, cy: 140, r: 14, fill: GOLD }));
          const beam = s.el("path", { d: `M${300 - HL} 150 L${300 + HL} 150`, stroke: "#6b4a2a", "stroke-width": 10, "stroke-linecap": "round" });
          const mkPan = () => s.el("g", null, s.el("path", { d: `M0 0 L-40 ${DROP} M0 0 L40 ${DROP}`, stroke: "#6b4a2a", "stroke-width": 3 }), s.el("path", { d: `M-56 ${DROP} L56 ${DROP} C46 ${DROP + 26} -46 ${DROP + 26} -56 ${DROP} Z`, fill: GOLD, stroke: "#8a6a20", "stroke-width": 3 }));
          const panL = mkPan(), panR = mkPan();
          const heart = later(s.el("path", { d: `M0 ${DROP - 4} C-24 ${DROP - 18} -24 ${DROP - 44} -10 ${DROP - 44} C-4 ${DROP - 44} 0 ${DROP - 38} 0 ${DROP - 34} C0 ${DROP - 38} 4 ${DROP - 44} 10 ${DROP - 44} C24 ${DROP - 44} 24 ${DROP - 18} 0 ${DROP - 4} Z`, fill: RED }));
          const feather = later(s.el("path", { d: `M-4 ${DROP - 4} C-14 ${DROP - 40} -6 ${DROP - 80} 8 ${DROP - 96} C12 ${DROP - 70} 10 ${DROP - 36} -4 ${DROP - 4} Z M-4 ${DROP - 4} L6 ${DROP - 80}`, fill: "#fbfaf2", stroke: INK, "stroke-width": 2 }));
          panL.append(heart); panR.append(feather);
          const lH = later(T(s, 0, DROP + 54, "Herz", { fs: 21 })), lF = later(T(s, 0, DROP + 54, "Feder der Maat", { fs: 21 }));
          panL.append(lH); panR.append(lF);
          svg.append(beam, panL, panR);
          const anubis = later(s.el("g", null, s.el("path", { d: "M80 470 L80 420 C80 404 92 398 104 400 L120 400 L126 376 L118 360 L132 368 L136 352 L142 372 L160 388 L140 392 L136 410 C150 420 150 440 146 470 Z", fill: "#1b1b1b" }), T(s, 112, 504, "Anubis wiegt", { fs: 20 })));
          const thot = later(s.el("g", null, s.el("path", { d: "M470 470 L470 414 C470 398 486 396 496 400 L500 380 C500 364 520 360 524 372 C540 386 552 396 566 410 L520 384 L512 404 C524 416 526 444 524 470 Z", fill: "#fbfaf2", stroke: INK, "stroke-width": 3 }), T(s, 504, 504, "Thot schreibt", { fs: 20 })));
          svg.append(anubis, thot);
          const setA = a => {
            const r = a * Math.PI / 180, dx = HL * Math.cos(r), dy = HL * Math.sin(r);
            beam.setAttribute("transform", `rotate(${a} 300 150)`);
            panL.setAttribute("transform", `translate(${300 - dx} ${150 - dy})`);
            panR.setAttribute("transform", `translate(${300 + dx} ${150 + dy})`);
          };
          let ang = 0; setA(0);
          const swing = async (target) => { const a0 = ang; s.sfx.boing(); await s.tween({ from: 0, to: 1, dur: 1400, ease: "elastic", update: v => { ang = a0 + (target - a0) * v; setA(ang); } }); };
          const verdict = s.h("p", { class: "t", style: { minHeight: "68px" } }, " ");
          const good = later(s.h("button", { class: "btn solid", onclick: async () => { s.sfx.click(); await swing(-14); await swing(0); verdict.textContent = "Leicht wie die Feder: Der Tote darf ins Jenseits zu Osiris!"; s.sfx.success(); } }, "Ehrliches Herz"));
          const bad = later(s.h("button", { class: "btn", onclick: async () => { s.sfx.click(); await swing(-16); verdict.textContent = "Zu schwer von bösen Taten: Das Monster Ammit frisst das Herz."; s.sfx.error(); } }, "Schweres Herz"));
          const merk = later(s.h("div", { class: "merk", style: { fontSize: "22px" } }, s.h("b", null, "Maat"), " bedeutet Wahrheit, Gerechtigkeit und Ordnung. Wer gerecht lebt, hat ein leichtes Herz."));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "600px 1fr", gap: "26px", height: "100%", alignItems: "center" } }, svg,
            s.h("div", { class: "stack", style: { gap: "14px" } }, s.h("p", { class: "t a-up" }, "Gott ", s.h("b", null, "Osiris"), " ist der Richter. ", s.h("b", null, "Anubis"), " bedient die Waage, ", s.h("b", null, "Thot"), " schreibt das Ergebnis auf."), s.photo("totengericht-ani", { w: 460, h: 160, caption: "Echtes Totenbuch des Ani: Anubis wiegt das Herz", pos: "48% 70%" }), s.h("div", { class: "row" }, good, bad), verdict, merk)));
          s.show(svg, "fade"); s.sfx.pop();
          s.step(async () => { s.sfx.pop(); s.show(lH, "fade"); await s.show(heart, "bounce"); s.sfx.pop(); s.show(lF, "fade"); await s.show(feather, "down"); s.show([anubis, thot], "up"); });
          s.step(async () => { s.show([good, bad], "pop"); await swing(0); verdict.textContent = "Gleich schwer! Tippe auf die Knöpfe."; s.sfx.ding(); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Grabbeigaben",
        say: "Ins Grab packten die Ägypter alles, was man im Jenseits brauchen könnte.",
        build(s) {
          const svg = s.svg(560, 470);
          svg.append(s.el("rect", { x: 0, y: 0, width: 560, height: 470, rx: 20, fill: "#d9c08e" }));
          for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) svg.append(s.el("rect", { x: c * 70 + (r % 2) * 35 - 35, y: r * 46, width: 70, height: 46, fill: "none", stroke: "#bfa06a", "stroke-width": 2 }));
          svg.append(s.el("rect", { x: 0, y: 380, width: 560, height: 90, fill: "#b3935c" }));
          svg.append(s.el("rect", { x: 170, y: 300, width: 220, height: 90, rx: 8, fill: "#8f7a5a", stroke: INK, "stroke-width": 3 }), T(s, 280, 356, "Sarg", { fs: 22, fill: "#fff" }));
          const item = (g, lbl, lx, ly) => later(s.el("g", null, g, T(s, lx, ly, lbl, { fs: 20, halo: true })));
          const its = [
            item(s.el("g", null, s.el("path", { d: "M40 360 C40 330 100 330 100 360 Z", fill: "#c98a3a" }), s.el("path", { d: "M110 370 C100 340 104 300 120 296 L136 296 C152 300 156 340 146 370 Z", fill: "#b5653a", stroke: INK, "stroke-width": 2 })), "Brot & Bier", 95, 410),
            item(s.el("g", null, s.el("path", { d: "M420 300 L420 380 M500 300 L500 380 M420 330 L500 330 M420 250 L420 330", stroke: "#6b4a2a", "stroke-width": 8 }), s.el("rect", { x: 414, y: 324, width: 92, height: 12, fill: "#8a5a32" })), "Stuhl", 460, 410),
            item(s.el("g", null, s.el("rect", { x: 60, y: 150, width: 150, height: 54, rx: 4, fill: "#3a6ab0", stroke: INK, "stroke-width": 2 }), ...[0, 1, 2].flatMap(r => [0, 1, 2, 3, 4, 5].map(c => s.el("rect", { x: 66 + c * 24, y: 154 + r * 16, width: 20, height: 13, fill: "#e8d6b0" })))), "Senet-Spiel", 135, 236),
            item(s.el("g", null, s.el("path", { d: "M330 110 C330 170 450 170 450 110", stroke: GOLD, "stroke-width": 14, fill: "none" }), s.el("path", { d: "M342 140 C350 180 430 180 438 140", stroke: "#2f9a6a", "stroke-width": 10, fill: "none" }), s.el("circle", { cx: 390, cy: 176, r: 11, fill: RED })), "Schmuck", 390, 220),
            item(s.el("g", null, s.el("path", { d: "M220 40 L340 40 L360 70 L330 70 L330 130 L230 130 L230 70 L200 70 Z", fill: "#fbfaf2", stroke: INK, "stroke-width": 2 })), "Kleidung", 280, 162),
          ];
          svg.append(...its);
          const merk = later(s.h("div", { class: "merk", style: { fontSize: "22px" } }, "Die Ägypter glaubten an ein ", s.h("b", null, "Leben nach dem Tod"), ". Dafür brauchte man Essen, Möbel, Kleidung – und Spiele."));
          const num = s.h("span", { class: "mono" }, "0");
          const tut = later(s.h("div", { class: "card soft" }, s.h("p", { class: "t" }, "Im Grab von Tutanchamun fand man ", s.h("b", null, num, " Gegenstände"), " – sogar mehrere Senet-Spiele.")));
          const life = later(s.h("div", { class: "life" }, s.h("span", { class: "exlabel" }, "Im Alltag"), s.h("p", { class: "small" }, "Auch du packst für eine Reise: Koffer für die Klassenfahrt, Proviant für den Ausflug, dein Lieblingsspiel für den Urlaub.")));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "560px 1fr", gap: "28px", height: "100%", alignItems: "center" } }, svg, s.h("div", { class: "stack" }, merk, tut, life)));
          s.show(svg, "fade"); s.sfx.whoosh();
          s.step(async () => { for (let i = 0; i < its.length; i++) { s.sfx.count(i * 2); await s.show(its[i], "bounce"); } });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(tut, "up"); await s.tween({ dur: 1500, ease: "out", update: v => { num.textContent = s.fmt(Math.round(v * 5398)); } }); s.sfx.coin(); s.show(life, "up"); });
        },
      },
      /* 11b -------------------------------------------------------------- */
      {
        title: "Grabschätze in echt",
        say: "Solche Dinge fand man wirklich in ägyptischen Gräbern. Heute stehen sie in Museen.",
        build(s) {
          const items = [["kanopen", "Kanopenkrüge", "Darin lagen Leber, Lunge, Magen und Darm.", "50% 55%", "door-creak"], ["sarg-khonsu", "Särge in Menschengestalt", "Die Mumie lag in einem bemalten Sarg aus Holz.", "50% 30%", "knock"], ["senet-brett", "Senet-Spiel", "Ein Spielbrett mit Feldern und Figuren – für die Zeit im Jenseits.", "45% 50%", "stoeckchen"]];
          const cards = items.map(([id, h, t, pos]) => later(s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", gap: "10px", padding: "12px" } }, s.photo(id, { w: "100%", h: 360, pos }), s.h("p", { class: "h2", style: { fontSize: "25px", color: "var(--unit)" } }, h), s.h("p", { class: "small" }, t))));
          s.add(s.h("div", { class: "cols3", style: { gap: "18px", height: "100%", alignItems: "center" } }, ...cards));
          s.preload("door-creak", "knock", "stoeckchen");
          items.forEach((it, i) => s.step(async () => { s.sound(it[4], { vol: .5 }); await s.show(cards[i], "up"); }));
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Hieroglyphen: Bild oder Laut?",
        say: "Hieroglyphen sind Bildzeichen. Manche bedeuten, was sie zeigen. Andere stehen nur für einen Laut.",
        build(s) {
          const cardSvg = (pairs) => {
            const v = s.svg(480, 170);
            const parts = pairs.map(([k, word], i) => {
              const x = 20 + i * 160;
              const g = s.el("g", { class: "later" }, s.el("rect", { x, y: 6, width: 120, height: 120, rx: 14, fill: "#fff", stroke: "#c8d3de", "stroke-width": 2 }), sign(s, k, x + 20, 20, 80));
              const w = later(T(s, x + 60, 160, word, { fs: 24, fill: "#a21caf" }));
              v.append(g, w); return [g, w];
            });
            return { v, parts };
          };
          const pic = cardSvg([["sun", "Sonne"], ["mouth", "Mund"], ["water", "Wasser"]]);
          const snd = cardSvg([["owl", "M"], ["mouth", "R"], ["water", "N"]]);
          const c1 = s.h("div", { class: "card" }, s.h("p", { class: "h2" }, "Bildzeichen"), s.h("p", { class: "small" }, "Das Zeichen bedeutet, was es zeigt."), pic.v);
          const c2 = later(s.h("div", { class: "card" }, s.h("p", { class: "h2" }, "Lautzeichen"), s.h("p", { class: "small" }, "Das Zeichen steht nur für einen Laut."), snd.v));
          const facts = ["über 1.000 Zeichen", "24 Zeichen für einzelne Laute", "Vokale schrieb man nicht", "Lies den Gesichtern entgegen"].map(t => later(s.h("span", { class: "chip", style: { fontSize: "20px" } }, t)));
          const life = later(s.h("div", { class: "life" }, s.h("span", { class: "exlabel" }, "Im Alltag: Bilderschrift heute"), s.h("p", { class: "t" }, "Emoji 😀 🍕 ⚽, Verkehrsschilder und die Zeichen für WC oder Aufzug am Bahnhof verstehst du ohne Buchstaben.")));
          s.add(s.h("div", { class: "stack", style: { gap: "16px", height: "100%", justifyContent: "center" } }, s.h("div", { class: "cols", style: { gap: "22px" } }, c1, c2), s.h("div", { class: "row", style: { justifyContent: "center" } }, ...facts), life));
          s.sfx.pop();
          s.step(async () => { s.sound("meissel", { vol: .4, dur: 2 }); for (const [g, w] of pic.parts) { s.show(g, "pop"); await s.show(w, "up"); } });
          s.step(async () => { s.sfx.whoosh(); await s.show(c2, "left"); for (const [g, w] of snd.parts) { s.sfx.pop(); s.show(g, "pop"); await s.show(w, "zoom"); } s.say("Der Mund kann also Mund heißen – oder einfach R."); });
          s.step(async () => { s.sfx.snap(); await s.show(facts, "pop"); });
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Der Stein von Rosette",
        say: "Lange konnte niemand Hieroglyphen lesen. Ein Stein mit drei Schriften half, das Rätsel zu lösen.",
        build(s) {
          const ov = s.svg(420, 492);
          const band = (y, h, col, name) => {
            const g = s.el("g", { class: "later" });
            g.append(s.el("rect", { x: 30, y, width: 330, height: h, rx: 10, fill: col, opacity: .22, stroke: col, "stroke-width": 4 }));
            g.append(T(s, 44, y + 30, name, { a: "start", fs: 21, fill: "#fff", halo: false }));
            return g;
          };
          const b1 = band(10, 136, "#f2a516", "Hieroglyphen"), b2 = band(150, 170, "#9fd3f0", "Demotisch"), b3 = band(324, 140, "#ffffff", "Griechisch");
          const cart = later(s.el("rect", { x: 30, y: 10, width: 330, height: 136, rx: 10, fill: "none", stroke: GOLD, "stroke-width": 7 }));
          ov.append(b1, b2, b3, cart);
          ov.style.position = "absolute"; ov.style.left = "0"; ov.style.top = "0";
          const svg = s.h("div", { style: { position: "relative", width: "420px", height: "492px" } }, s.photo("stein-rosette", { w: 420, h: 492 }), ov);
          const tl = [["1799", "Der Stein wird in Ägypten gefunden – bei der Stadt Rosette."], ["196 v. Chr.", "Derselbe Text steht dreimal darauf – in drei Schriften."], ["Vergleichen", "Griechisch konnte man lesen! Die Namen in den Kartuschen – Ptolemaios, Kleopatra – zeigten die Laute."], ["14.9.1822", "Jean-François Champollion ruft: „Ich hab’s!“ Er kann Hieroglyphen lesen."]]
            .map(([a, b]) => later(s.h("div", { class: "row", style: { flexWrap: "nowrap", alignItems: "flex-start", gap: "14px" } }, s.h("span", { class: "chip", style: { minWidth: "150px", justifyContent: "center", background: "var(--unit)", color: "#fff", fontSize: "19px" } }, a), s.h("p", { class: "small", style: { fontSize: "20px" } }, b))));
          const life = later(s.h("div", { class: "life", style: { padding: "12px 18px" } }, s.h("span", { class: "exlabel" }, "Heute"), s.h("p", { class: "small" }, "Der Stein steht seit 1802 im British Museum in London. Dort kannst du ihn ansehen.")));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "420px 1fr", gap: "30px", height: "100%", alignItems: "center" } }, svg, s.h("div", { class: "stack", style: { gap: "14px" } }, ...tl, life)));
          s.show(svg, "zoom"); s.sound("stein-schieben", { vol: .4, dur: 2.5 });
          s.step(async () => { s.sound("kelle-graben", { vol: .5 }); await s.show(tl[0], "left"); });
          s.step(async () => { s.show(tl[1], "left"); for (const b of [b1, b2, b3]) { s.sfx.pop(); await s.show(b, "fade"); } });
          s.step(async () => { s.show(tl[2], "left"); s.sfx.ding(); await s.show(cart, "draw"); s.say("In den Kartuschen standen Königsnamen. So fand man die Laute."); });
          s.step(async () => { s.sfx.fanfare(); await s.show(tl[3], "left"); s.show(life, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Dein Name in Hieroglyphen",
        say: "Tippe auf die Buchstaben. So schreibst du deinen Namen in einer Kartusche – wie ein Pharao.",
        build(s) {
          let name = "";
          const svg = s.svg(1100, 240);
          const holder = s.el("g"); svg.append(holder);
          const MAX = 10;
          const render = (popLast) => {
            holder.innerHTML = "";
            const glyphs = [];
            [...name].forEach(ch => ALPHA[ch].forEach((k, j) => glyphs.push({ k, ch: j === 0 ? ch : "" })));
            const n = Math.max(glyphs.length, 1), GW = 84, w = n * GW + 70, x0 = 550 - w / 2;
            holder.append(s.el("rect", { x: x0, y: 20, width: w, height: 140, rx: 70, fill: "#fff8e6", stroke: INK, "stroke-width": 6 }),
              s.el("path", { d: `M${x0 + w + 14} 30 L${x0 + w + 14} 150`, stroke: INK, "stroke-width": 8, "stroke-linecap": "round" }));
            if (!glyphs.length) holder.append(T(s, 550, 100, "Tippe auf Buchstaben", { fs: 24, fill: "#5d6678" }));
            glyphs.forEach((g, i) => {
              const gx = x0 + 35 + i * GW;
              const sg = sign(s, g.k, gx + 6, 46, 72);
              holder.append(sg);
              if (g.ch) holder.append(T(s, gx + 42, 206, g.ch, { fs: 26, fill: "#a21caf" }));
              if (popLast && i === glyphs.length - 1) { sg.classList.add("a-pop"); }
            });
          };
          render();
          const add = ch => { const len = [...name].reduce((a, c) => a + ALPHA[c].length, 0) + ALPHA[ch].length; if (len > MAX) { s.sfx.error(); return; } name += ch; s.sfx.pop(); render(true); };
          const keys = Object.keys(ALPHA).map(ch => {
            const mini = s.svg(30, 30); mini.append(sign(s, ALPHA[ch][0], 0, 0, 30));
            return s.h("button", { class: "btn", style: { padding: "0 4px", gap: "4px", minHeight: "60px" }, onclick: () => add(ch) }, mini, s.h("span", null, ch));
          });
          const setName = n => async () => { s.sfx.click(); name = ""; render(); for (const ch of n) { if (!s.alive) return; add(ch); await s.wait(220); } s.sfx.ding(); };
          const ctrl = s.h("div", { class: "row", style: { justifyContent: "center" } },
            s.h("button", { class: "btn solid", onclick: setName("JULIAN") }, "Julian"),
            s.h("button", { class: "btn", onclick: setName("LOUISA") }, "Louisa"),
            s.h("button", { class: "btn", onclick: () => { if (!name) return; name = name.slice(0, -1); s.sfx.swoosh(); render(); } }, "⌫ Zurück"),
            s.h("button", { class: "btn", onclick: () => { name = ""; s.sfx.whoosh(); render(); } }, "Alles löschen"));
          const note = s.h("p", { class: "small pencil", style: { textAlign: "center" } }, "Vereinfachtes Schul-Alphabet: Echte Hieroglyphen haben keine Vokale und über 1.000 Zeichen.");
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%", justifyContent: "center" } }, svg,
            s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(13, 1fr)", gap: "7px" } }, ...keys), ctrl, note));
          s.show(svg, "zoom"); s.sfx.whoosh();
          s.step(async () => { await setName("JULIAN")(); s.say("Julian: Kobra, Küken, Löwe, Schilfblatt, Geier, Wasser."); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Alltag am Nil",
        say: "Wie lebten Kinder im alten Ägypten? Sie spielten, halfen mit – und aßen jeden Tag Brot.",
        build(s) {
          const board = s.svg(520, 210);
          board.append(s.el("rect", { x: 0, y: 0, width: 520, height: 210, rx: 14, fill: "#8a5a32" }));
          const cell = i => { const r = Math.floor(i / 10), c = r === 1 ? 9 - (i % 10) : i % 10; return { x: 20 + c * 48, y: 20 + r * 58 }; };
          for (let i = 0; i < 30; i++) { const p = cell(i); board.append(s.el("rect", { x: p.x, y: p.y, width: 44, height: 54, rx: 4, fill: "#e8d6b0" })); }
          [25, 26, 27, 28, 29].forEach(i => { const p = cell(i); board.append(sign(s, i === 25 ? "reed" : i === 26 ? "water" : "chick", p.x + 8, p.y + 13, 28, "#8a5a32")); });
          const pieceA = s.el("path", { d: "M-12 16 L0 -16 L12 16 Z", fill: "#fbfaf2", stroke: INK, "stroke-width": 2 });
          const pieceB = s.el("rect", { x: -12, y: -14, width: 24, height: 30, rx: 6, fill: "#1b2740" });
          board.append(pieceA, pieceB);
          let posA = 0, posB = 1;
          const place = (el, i) => { const p = cell(i); el.setAttribute("transform", `translate(${p.x + 22} ${p.y + 27})`); };
          place(pieceA, posA); place(pieceB, posB);
          const sticks = s.svg(150, 60);
          const st = [0, 1, 2, 3].map(i => s.el("rect", { x: 8 + i * 36, y: 6, width: 22, height: 48, rx: 10, fill: "#e8d6b0", stroke: INK, "stroke-width": 2 }));
          sticks.append(...st);
          const hop = async () => {
            let up = 0;
            for (let k = 0; k < 6; k++) { st.forEach(e => e.setAttribute("fill", Math.random() < .5 ? "#e8d6b0" : "#5a3a1a")); s.sfx.tick(); await s.wait(70); }
            st.forEach(e => { const d = Math.random() < .5; e.setAttribute("fill", d ? "#e8d6b0" : "#5a3a1a"); if (d) up++; });
            const steps = up === 0 ? 5 : up;
            for (let k = 0; k < steps; k++) { posA = (posA + 1) % 30; s.sfx.count(k + 2); await s.tween({ dur: 220, update: v => { const a = cell((posA + 29) % 30), b = cell(posA); pieceA.setAttribute("transform", `translate(${s.lerp(a.x, b.x, v) + 22} ${s.lerp(a.y, b.y, v) + 27 - Math.sin(v * Math.PI) * 18})`); } }); }
          };
          const throwBtn = s.h("button", { class: "btn solid", onclick: () => { s.sound("stoeckchen", { force: true }); hop(); } }, "Stäbchen werfen");
          const left = s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", padding: "14px" } },
            s.h("p", { class: "h2" }, "Senet – ein Brettspiel"), board, s.h("p", { class: "small" }, "30 Felder in 3 Reihen. Statt Würfeln: Wurfhölzer."), s.h("div", { class: "row" }, sticks, throwBtn));
          const cards = [
            ["Kleidung", "Kleider aus Leinen – leicht und kühl. Kleine Kinder trugen bis etwa 6 Jahre gar nichts, nur Schmuck."],
            ["Spielzeug", "Puppen mit beweglichen Armen und Beinen, Kreisel, Bälle und Holztiere mit beweglichen Teilen."],
            ["Brot und Bier", "Jeden Tag, für alle. Das Bier war dick wie Brei. Dazu Zwiebeln, Linsen, Fisch, Datteln und Feigen."],
          ].map(([a, b]) => later(s.h("div", { class: "ex", style: { padding: "12px 16px" } }, s.h("span", { class: "exlabel" }, a), s.h("p", { class: "small", style: { fontSize: "20px" } }, b))));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "560px 1fr", gap: "26px", height: "100%", alignItems: "center" } }, left, s.h("div", { class: "stack", style: { gap: "12px" } }, s.photo("senet-nefertari", { w: "100%", h: 190, caption: "Königin Nefertari spielt Senet (Grabbild)", pos: "60% 55%" }), ...cards)));
          s.show(left, "left"); s.sfx.pop();
          s.step(async () => { s.sound("stoeckchen"); await hop(); s.say("Senet spielten Kinder und Erwachsene – sogar Tutanchamun hatte Senet-Spiele im Grab."); });
          cards.forEach((c, i) => s.step(async () => { s.sfx.count(i * 3); await s.show(c, "left"); }));
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Ägypten in deinem Alltag",
        say: "Ägypten ist lange her – und trotzdem begegnet es dir jeden Tag.",
        build(s) {
          const cal = s.svg(300, 180);
          const blocks = [];
          for (let m = 0; m < 12; m++) { const r = Math.floor(m / 6), c = m % 6; const b = later(s.el("rect", { x: 6 + c * 46, y: 10 + r * 52, width: 40, height: 44, rx: 6, fill: "#a21caf", opacity: .85 })); blocks.push(b); cal.append(b, later(T(s, 26 + c * 46, 40 + r * 52, "30", { fs: 19, fill: "#fff" }))); }
          const extra = [0, 1, 2, 3, 4].map(i => later(s.el("circle", { cx: 30 + i * 30, cy: 132, r: 11, fill: GOLD })));
          cal.append(...extra);
          const total = later(T(s, 260, 140, "= 365", { fs: 24, fill: INK }));
          cal.append(total);
          const calLbls = [...cal.querySelectorAll("text")].filter(t => t.textContent === "30");
          const museum = s.photo("neues-museum", { w: 300, h: 180 });
          const emo = s.h("div", { class: "row", style: { justifyContent: "center", fontSize: "52px", gap: "10px", minHeight: "180px" } }, ...["😀", "🍕", "🚇", "⚽"].map(e => later(s.h("span", null, e))));
          const mk = (label, pic, text) => later(s.h("div", { class: "life", style: { display: "flex", flexDirection: "column", gap: "8px", alignItems: "center", textAlign: "center" } }, s.h("span", { class: "exlabel" }, label), pic, s.h("p", { class: "small" }, ...text)));
          const c1 = mk("Museum", museum, ["Im ", s.h("b", null, "Neuen Museum"), " auf der Museumsinsel siehst du Nofretete und viele Schätze aus Ägypten."]);
          const c2 = mk("Kalender", cal, ["12 Monate × 30 Tage + 5 Extratage = ", s.h("b", null, "365 Tage"), ". Das half Julius Caesar beim neuen Kalender."]);
          const c3 = mk("Bilderschrift", emo, ["Emoji sind Bildzeichen – wie Hieroglyphen. Ein Bild sagt, was gemeint ist."]);
          const merk = later(s.h("div", { class: "merk" }, "Ägypten: Pharaonen, Pyramiden, Götter, Mumien und Hieroglyphen – eine Hochkultur am Nil."));
          s.add(s.h("div", { class: "stack", style: { gap: "18px", height: "100%", justifyContent: "center" } }, s.h("div", { class: "cols3" }, c1, c2, c3), merk));
          s.sfx.whoosh();
          s.step(async () => { s.sound("footsteps", { vol: .5, dur: 2.5 }); await s.show(c1, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(c2, "up"); for (let i = 0; i < 12; i++) { s.sfx.count(i); s.show(blocks[i], "pop"); s.show(calLbls[i], "fade"); await s.wait(90); } for (const e of extra) { s.sfx.tick(); await s.show(e, "pop"); } s.sfx.ding(); s.show(total, "zoom"); });
          s.step(async () => { s.sfx.pop(); await s.show(c3, "up"); for (const e of emo.children) { s.sfx.boing(); await s.show(e, "bounce"); } });
          s.step(async () => { s.sfx.fanfare(); await s.show(merk, "up"); });
        },
      },
    ],
  });
})();
