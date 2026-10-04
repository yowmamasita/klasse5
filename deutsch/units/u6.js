/* Kapitel 6 – Wörter bauen: Wortbildung, Wortfamilien, Wortfelder (Berliner Rahmenlehrplan Deutsch, Klasse 5) */
(() => {
  "use strict";
  const U = "#2f7d32", SOFT = "#e3f2e4", INK = "#1b2740", BLUE = "#1d5bd0", RED = "#dc3b2a", GREEN = "#138a5a",
    ORANGE = "#ee7a1a", PENCIL = "#5d6678", VIOLET = "#7b4fd6", MAG = "#c2185b";
  const BW = BLUE, GW = ORANGE, FUGE = RED, PRE = VIOLET, SUF = MAG, STEM = U;

  const CSS = `
.w6-b{position:relative;display:inline-flex;align-items:center;justify-content:center;height:62px;padding:0 18px;margin-top:11px;border-radius:8px;font:700 32px/1 var(--f-display);color:#fff;white-space:nowrap;box-shadow:inset 0 -6px 0 rgba(0,0,0,.18)}
.w6-b::before,.w6-b::after{content:"";position:absolute;top:-10px;width:22px;height:11px;border-radius:5px 5px 0 0;background:inherit}
.w6-b::before{left:12px}.w6-b::after{right:12px}
.w6-b.sm{height:46px;padding:0 12px;font-size:24px;margin-top:9px;box-shadow:inset 0 -4px 0 rgba(0,0,0,.18)}
.w6-b.sm::before,.w6-b.sm::after{top:-8px;width:14px;height:9px}
.w6-b.sm::before{left:8px}.w6-b.sm::after{right:8px}
.w6-b.glue{padding:0 8px;min-width:30px}
.w6-b.glue::before,.w6-b.glue::after{display:none}
.w6-j{display:inline-flex;align-items:flex-end;gap:0;white-space:nowrap}
.w6-art{display:inline-flex;align-items:center;justify-content:center;min-width:58px;height:40px;padding:0 10px;border-radius:999px;font:700 21px/1 var(--f-display);background:#fff;border:2px solid var(--line);color:var(--ink)}
.w6-fl{display:inline-block}
.w6-tap{cursor:pointer}
`;
  if (!document.getElementById("w6css")) { const st = document.createElement("style"); st.id = "w6css"; st.textContent = CSS; document.head.appendChild(st); }

  /* ---------- helpers ---------- */
  const blk = (s, t, c, cls = "") => s.h("span", { class: "w6-b" + (cls ? " " + cls : ""), style: { background: c } }, t);
  const join = (s, bs, cls = "") => s.h("span", { class: "w6-j" + (cls ? " " + cls : "") }, ...bs);
  /** blocks start pulled apart and snap together */
  async function snapIn(s, bs, dist = 50, dur = 520) {
    const n = bs.length, mid = (n - 1) / 2;
    const put = v => bs.forEach((b, i) => { b.style.transform = v ? `translateX(${((i - mid) * dist * v).toFixed(1)}px)` : ""; });
    put(1);
    await s.tween({ from: 1, to: 0, dur, ease: "back", update: put });
    put(0); s.sfx.snap();
  }
  /** pull blocks apart (word → building blocks) */
  async function splitOut(s, bs, gap = 8) {
    await s.tween({ from: 0, to: 1, dur: 450, ease: "back", update: v => bs.forEach((b, i) => { b.style.marginLeft = i ? (gap * v).toFixed(1) + "px" : ""; }) });
    s.sfx.pop();
  }
  async function flipLetter(s, el, txt, color) {
    await s.tween({ from: 1, to: 0, dur: 170, update: v => { el.style.transform = `scaleY(${v})`; } });
    el.textContent = txt; if (color) el.style.color = color;
    s.sfx.boing();
    await s.tween({ from: 0, to: 1, dur: 240, ease: "back", update: v => { el.style.transform = `scaleY(${v})`; } });
    el.style.transform = "";
  }
  const T = (s, x, y, text, o = {}) => { const e = s.el("text", Object.assign({ x, y, "text-anchor": "middle", "font-size": 22, "font-weight": 700, fill: INK, text }, o)); if (o.fill) e.style.fill = o.fill; e.style.fontSize = (o["font-size"] || 22) + "px"; return e; };
  const merk = (s, ...kids) => s.h("div", { class: "merk later" }, ...kids);
  const life = (s, ...kids) => { const d = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"), ...kids); return d; };
  const later = el => { el.classList.add("later"); return el; };

  Deck.unit({
    id: "u6", num: 6, title: "Wörter bauen", color: U, soft: SOFT,
    subtitle: "Wortbausteine wie LEGO zusammenstecken",
    blurb: "Zusammensetzungen, Präfixe, Suffixe, Wortfamilien, Wortfelder.",
    goals: ["Zusammengesetzte Wörter in Bausteine zerlegen", "Mit Präfixen und Suffixen neue Wörter bilden", "Wortfamilien finden – und damit richtig schreiben", "Mit Wortfeldern spannender erzählen", "Ober- und Unterbegriffe ordnen"],
    icon(svg, el) {
      const b = (x, y, w, c) => [el("rect", { x, y, width: w, height: 18, rx: 3, fill: c }), el("rect", { x: x + 4, y: y - 5, width: 8, height: 6, rx: 2, fill: c }), el("rect", { x: x + w - 12, y: y - 5, width: 8, height: 6, rx: 2, fill: c })];
      svg.append(...b(6, 44, 30, BW), ...b(36, 44, 28, GW), ...b(20, 18, 32, U));
    },
    slides: [
      /* 1 ─────────────── LEGO */
      {
        title: "Wörter wie LEGO",
        say: "Aus zwei Wörtern kannst du ein neues bauen. Haus und Tür ergeben Haustür. Das nennt man Zusammensetzung.",
        build(s) {
          const a = blk(s, "Haus", BW), b = blk(s, "Tür", GW);
          const j = join(s, [a, b]);
          const res = s.h("span", { class: "big later", style: { marginLeft: "18px" } }, "= die ", s.h("span", { style: { color: BW } }, "Haus"), s.h("span", { style: { color: GW } }, "tür"));
          const demo = s.h("div", { class: "row", style: { justifyContent: "center", flexWrap: "nowrap" } }, j, res);
          const leg = s.h("div", { class: "row later", style: { justifyContent: "center" } },
            s.h("span", { class: "chip", style: { fontSize: "21px" } }, s.h("b", { style: { color: BW } }, "Haus"), " = Bestimmungswort: sagt, welche Tür"),
            s.h("span", { class: "chip", style: { fontSize: "21px" } }, s.h("b", { style: { color: GW } }, "Tür"), " = Grundwort: sagt, was es ist"));
          const card = (w1, w2, txt, ic) => {
            const bs = [blk(s, w1, BW, "sm"), blk(s, w2, GW, "sm")];
            const c = s.h("div", { class: "ex later", style: { display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-start" } },
              s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "12px" } }, join(s, bs), s.h("span", { style: { fontSize: "34px", lineHeight: 1 } }, ic)),
              s.h("p", { class: "small", style: { fontSize: "21px" } }, txt));
            c.bs = bs; return c;
          };
          const cards = [card("Fuß", "ball", "Ein Ball, den man mit dem Fuß spielt.", "⚽"), card("Regen", "schirm", "Ein Schirm gegen den Regen.", "☂️"), card("Brot", "dose", "Eine Dose für das Pausenbrot.", "🥪")];
          const m = merk(s, s.h("b", null, "Zusammensetzung"), " (Kompositum) = ", s.h("b", { style: { color: BW } }, "Bestimmungswort"), " + ", s.h("b", { style: { color: GW } }, "Grundwort"), ". Das Grundwort steht ", s.h("span", { class: "hl" }, "hinten"), ".");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "22px" } }, demo, leg, s.h("div", { class: "cols3" }, cards), m));
          s.sfx.whoosh(); snapIn(s, [a, b], 260, 900).then(() => { if (s.alive) { s.sfx.pop(); s.show(res, "left"); } });
          s.step(async () => { s.sfx.ding(); await s.show(leg, "up"); });
          s.step(async () => { for (const c of cards) { s.show(c, "up"); await snapIn(s, c.bs, 90); } });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(m, "up"); });
        },
      },
      /* 2 ─────────────── Artikel vom Grundwort */
      {
        title: "Das letzte Wort bestimmt",
        say: "Der Artikel der Zusammensetzung kommt immer vom letzten Wort, dem Grundwort.",
        build(s) {
          const rows = [
            ["das", "Haus", "die", "Tür", "die", "Haustür"],
            ["das", "Spiel", "der", "Platz", "der", "Spielplatz"],
            ["die", "Tür", "das", "Schloss", "das", "Türschloss"],
            ["der", "Schnee", "", "weiß", "", "schneeweiß"],
          ].map(([a1, w1, a2, w2, a3, w3]) => {
            const art2 = a2 ? s.h("span", { class: "w6-art", style: { borderColor: GW, color: GW } }, a2) : null;
            const art3 = s.h("span", { class: "w6-art later", style: { borderColor: GW, color: GW, visibility: a3 ? null : "hidden" } }, a3 || "–");
            const res = s.h("span", { class: "h2 later" }, s.h("span", { style: { color: BW } }, w3.slice(0, w1.length)), s.h("span", { style: { color: GW } }, w3.slice(w1.length)));
            const r = s.h("div", { class: "later", style: { display: "grid", gridTemplateColumns: "250px 30px 250px 40px 70px 1fr", alignItems: "center", gap: "8px" } },
              s.h("span", { class: "row", style: { flexWrap: "nowrap", gap: "8px" } }, s.h("span", { class: "w6-art" }, a1), blk(s, w1, BW, "sm")),
              s.h("span", { class: "h2 pencil" }, "+"),
              s.h("span", { class: "row", style: { flexWrap: "nowrap", gap: "8px" } }, art2, blk(s, w2, GW, "sm")),
              s.h("span", { class: "h2 pencil" }, "→"), art3, res);
            r.art2 = art2; r.art3 = art3; r.res = res; r.has = !!a3; return r;
          });
          const note = s.h("p", { class: "small later", style: { textAlign: "right", marginTop: "-6px" } }, "Hier ist das Grundwort ein Adjektiv – also ist auch das neue Wort ein Adjektiv: klein geschrieben, ohne Artikel.");
          const m = merk(s, "Das ", s.h("b", { style: { color: GW } }, "Grundwort"), " (hinten) bestimmt den ", s.h("b", null, "Artikel"), " und die ", s.h("b", null, "Wortart"), " des ganzen Wortes.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "18px" } }, rows, note, m));
          s.sfx.pop();
          const run = async r => {
            r.classList.remove("later"); s.sfx.pop(); await s.show(r, "left");
            if (r.art2) { s.sfx.ding(); r.art2.classList.remove("a-pulse"); void r.art2.offsetWidth; r.art2.style.boxShadow = `0 0 0 4px ${GW}55`; }
            s.sfx.whoosh(); s.show(r.art3, "right"); await s.show(r.res, "zoom");
          };
          rows.forEach((r, i) => s.step(async () => { await run(r); if (i === 3) { await s.show(note, "fade"); } }));
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(m, "up"); });
        },
      },
      /* 3 ─────────────── Tausch-Trick */
      {
        title: "Der Tausch-Trick",
        say: "Wenn du die Bausteine tauschst, entsteht ein ganz anderes Ding. Ein Hausboot ist ein Boot. Ein Boothaus ist ein Haus.",
        build(s) {
          const pic = (draw) => { const v = s.svg(440, 210); v.append(s.el("rect", { x: 0, y: 0, width: 440, height: 210, rx: 16, fill: "#eef6fb" })); draw(v); return v; };
          const water = v => v.append(s.el("rect", { x: 0, y: 160, width: 440, height: 50, fill: "#7fb8e6" }), s.el("path", { d: "M0,160 q20,-8 40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0", fill: "none", stroke: "#4f8fc6", "stroke-width": 3 }));
          const house = (v, x, y, w, h, c) => v.append(s.el("rect", { x, y, width: w, height: h, fill: c, stroke: INK, "stroke-width": 3 }), s.el("polygon", { points: `${x - 10},${y} ${x + w / 2},${y - h * 0.6} ${x + w + 10},${y}`, fill: RED, stroke: INK, "stroke-width": 3 }));
          const boat = (v, x, y, w) => v.append(s.el("path", { d: `M${x},${y} L${x + w},${y} L${x + w - 26},${y + 32} L${x + 26},${y + 32} Z`, fill: "#9a5b1f", stroke: INK, "stroke-width": 3 }));
          // A: Hausboot / Boothaus
          const hb = pic(v => { water(v); boat(v, 90, 140, 260); house(v, 160, 92, 120, 48, "#ffe7a3"); v.append(s.el("rect", { x: 200, y: 108, width: 26, height: 22, fill: "#9fd3ff", stroke: INK, "stroke-width": 2 })); });
          const bh = pic(v => { water(v); house(v, 110, 70, 220, 92, "#d9c2a3"); v.append(s.el("rect", { x: 165, y: 102, width: 110, height: 60, fill: "#4a5568" })); boat(v, 170, 132, 100); });
          const fl = (v, x, y) => { v.append(s.el("line", { x1: x, y1: y, x2: x, y2: y - 70, stroke: GREEN, "stroke-width": 5 }), s.el("ellipse", { cx: x - 16, cy: y - 34, rx: 14, ry: 7, fill: GREEN })); [0, 72, 144, 216, 288].forEach(a => v.append(s.el("circle", { cx: x + 16 * Math.cos(a * Math.PI / 180), cy: y - 82 + 16 * Math.sin(a * Math.PI / 180), r: 11, fill: "#f06292" }))); v.append(s.el("circle", { cx: x, cy: y - 82, r: 9, fill: "#ffd94a" })); };
          const pot = (v, x, y, w, h) => v.append(s.el("path", { d: `M${x},${y} L${x + w},${y} L${x + w - 16},${y + h} L${x + 16},${y + h} Z`, fill: "#d9773b", stroke: INK, "stroke-width": 3 }), s.el("rect", { x: x - 6, y: y - 12, width: w + 12, height: 16, rx: 4, fill: "#c4632a", stroke: INK, "stroke-width": 3 }));
          const bt = pic(v => { pot(v, 160, 96, 120, 90); });
          const tb = pic(v => { fl(v, 220, 116); pot(v, 175, 124, 90, 66); });
          const panel = (labA, labB, picA, picB, capA, capB) => {
            const b1 = blk(s, labA[0], BW), b2 = blk(s, labA[1], GW);
            const j = join(s, [b1, b2]);
            const holder = s.h("div", { style: { position: "relative", width: "440px", height: "210px" } }, picA, picB);
            [picA, picB].forEach(p => Object.assign(p.style, { position: "absolute", left: "0", top: "0" })); picB.style.opacity = "0";
            const cap = s.h("p", { class: "t", style: { textAlign: "center", minHeight: "68px" } }, capA);
            let swapped = false;
            const swap = async () => {
              swapped = !swapped; s.sfx.whoosh();
              const k = (s.root.getBoundingClientRect().width / 1100) || 1;
              const first = j.firstChild, second = j.lastChild;
              const fw = first.getBoundingClientRect().width / k, sw = second.getBoundingClientRect().width / k;
              await s.tween({ dur: 520, update: v => { first.style.transform = `translate(${(sw * v).toFixed(1)}px, ${(-30 * Math.sin(v * Math.PI)).toFixed(1)}px)`; second.style.transform = `translate(${(-fw * v).toFixed(1)}px, ${(30 * Math.sin(v * Math.PI)).toFixed(1)}px)`; } });
              first.style.transform = second.style.transform = ""; j.append(first);
              const lab = swapped ? labB : labA;
              j.firstChild.textContent = lab[0]; j.lastChild.textContent = lab[1];
              j.firstChild.style.background = BW; j.lastChild.style.background = GW; // the last block is always the Grundwort
              const show = swapped ? picB : picA, hide = swapped ? picA : picB;
              s.tween({ dur: 400, update: v => { show.style.opacity = v; hide.style.opacity = 1 - v; } });
              cap.textContent = swapped ? capB : capA; s.sfx.snap(); s.show(cap, "fade");
            };
            const btn = s.h("button", { class: "btn", onclick: () => { s.sfx.click(); swap(); } }, "⇄ tauschen");
            const card = s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" } }, holder, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "18px" } }, j, btn), cap);
            return { card, swap };
          };
          const A = panel(["Haus", "boot"], ["Boot", "haus"], hb, bh, "Hausboot: ein Boot, auf dem man wohnt.", "Boothaus: ein Haus, in dem Boote stehen.");
          const Bp = panel(["Blumen", "topf"], ["Topf", "blume"], bt, tb, "Blumentopf: ein Topf für Blumen.", "Topfblume: eine Blume, die im Topf wächst.");
          const swapA = () => A.swap(), swapB2 = () => Bp.swap();
          const m = merk(s, "Lies eine Zusammensetzung von ", s.h("b", null, "hinten"), ": Das letzte Wort sagt dir, ", s.h("span", { class: "hl" }, "was"), " es ist.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "16px" } }, s.h("div", { class: "cols", style: { gap: "20px" } }, A.card, Bp.card), m));
          s.show([A.card, Bp.card], "up"); s.sfx.pop();
          s.step(async () => { await swapA(); s.say("Boothaus. Ein Haus, in dem Boote stehen."); });
          s.step(async () => { await swapB2(); s.say("Topfblume. Eine Blume, die im Topf wächst."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 4 ─────────────── Fugen */
      {
        title: "Fugenlaute: der Kleber",
        say: "Manchmal braucht eine Zusammensetzung einen kleinen Kleber in der Mitte. Zum Beispiel das s in Geburtstag.",
        build(s) {
          const data = [["Geburt", "s", "tag", "🎂"], ["Sonne", "n", "schein", "☀️"], ["Hund", "e", "leine", "🐕"], ["Arbeit", "s", "blatt", "📝"]];
          const rows = data.map(([a, f, b, ic]) => {
            const A = blk(s, a, BW), F = blk(s, f, FUGE, "glue later"), Bb = blk(s, b, GW);
            const j = join(s, [A, F, Bb]);
            const r = s.h("div", { class: "row later", style: { flexWrap: "nowrap", gap: "16px", justifyContent: "center" } }, j, s.h("span", { style: { fontSize: "40px", lineHeight: 1, marginTop: "10px" } }, ic));
            r.p = { A, F, Bb }; return r;
          });
          const lf = life(s, s.h("p", { class: "small" }, "Sprich das Wort langsam: Geburt", s.h("b", { class: "red" }, "s"), "tag, Sonne", s.h("b", { class: "red" }, "n"), "schein. Den Kleber hörst du mit – deshalb schreibst du ihn auch."));
          const m = merk(s, "Zwischen den Bausteinen steht manchmal ein ", s.h("b", { class: "red" }, "Fugenlaut"), ": ", s.h("b", { class: "red" }, "s, n, e, es, en"), " …");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "1.1fr 1fr", alignItems: "center", height: "100%" } }, s.h("div", { class: "stack", style: { gap: "14px" } }, rows), s.h("div", { class: "stack" }, m, lf)));
          s.sfx.pop();
          const go = async r => {
            r.classList.remove("later"); s.show(r, "fade");
            const { A, F, Bb } = r.p;
            F.style.minWidth = "0"; F.style.width = "0px"; F.style.padding = "0";
            await snapIn(s, [A, Bb], 60, 420);
            await s.wait(200);
            F.classList.remove("later"); s.sfx.boing();
            await s.tween({ from: 0, to: 1, dur: 420, ease: "back", update: v => { F.style.width = (34 * v) + "px"; } });
            F.style.width = ""; F.style.padding = ""; F.style.minWidth = "";
            s.sfx.snap();
          };
          s.step(async () => { await go(rows[0]); s.say("Geburt, s, Tag. Geburtstag."); });
          s.step(async () => { for (let i = 1; i < 4; i++) await go(rows[i]); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(lf, "up"); });
        },
      },
      /* 5 ─────────────── Berliner Wortmonster */
      {
        title: "Im Alltag: Berliner Wortmonster",
        say: "Berlin ist voller langer Wörter. Zerleg sie in Bausteine, dann sind sie gar nicht mehr schwer.",
        build(s) {
          // Fernsehturm drawing
          const tv = s.svg(250, 600);
          const tower = s.el("g");
          tower.append(
            s.el("polygon", { points: "112,590 138,590 132,190 118,190", fill: "#c9ced8", stroke: INK, "stroke-width": 2 }),
            s.el("circle", { cx: 125, cy: 168, r: 38, fill: "#c9ced8", stroke: INK, "stroke-width": 2 }),
            s.el("rect", { x: 87, y: 160, width: 76, height: 10, fill: "#7a8394" }),
            s.el("rect", { x: 121, y: 70, width: 8, height: 92, fill: "#c9ced8", stroke: INK, "stroke-width": 1.5 }),
            s.el("rect", { x: 123.5, y: 30, width: 3, height: 42, fill: RED }));
          const meas = s.el("g", { class: "later" });
          meas.append(s.el("line", { x1: 196, y1: 30, x2: 196, y2: 590, stroke: RED, "stroke-width": 3 }), s.el("line", { x1: 186, y1: 30, x2: 206, y2: 30, stroke: RED, "stroke-width": 3 }), s.el("line", { x1: 186, y1: 590, x2: 206, y2: 590, stroke: RED, "stroke-width": 3 }));
          const mtxt = T(s, 196, 330, "368 m", { fill: RED, "font-size": 26, class: "later" });
          const mbg = s.el("rect", { x: 152, y: 304, width: 88, height: 36, rx: 8, fill: "#fff", class: "later" });
          tv.append(s.el("line", { x1: 0, y1: 592, x2: 250, y2: 592, stroke: PENCIL, "stroke-width": 3 }), tower, meas, mbg, mtxt);
          const words = [
            [["Fern", BW], ["seh", VIOLET], ["turm", GW]], "368 m hoch – das höchste Bauwerk Deutschlands.",
            [["Haupt", BW], ["bahn", VIOLET], ["hof", GW]], "Berlins wichtigster Bahnhof: Hier halten ICE, S-Bahn und U-Bahn.",
            [["Bund", BW], ["es", FUGE], ["kanzler", VIOLET], ["amt", GW]], "Hier arbeitet die Bundeskanzlerin oder der Bundeskanzler.",
            [["Donau", BW], ["dampf", VIOLET], ["schiff", BLUE], ["fahrt", VIOLET], ["s", FUGE], ["gesellschaft", GW]], "Kein Berliner, aber berühmt: eine Schiffsfirma auf der Donau in Österreich, gegründet 1829. Seit 1996 schreibt man Schifffahrt mit drei f!",
          ];
          const rows = [];
          for (let i = 0; i < words.length; i += 2) {
            const parts = words[i];
            const bs = parts.map(([t, c], k) => { const b = blk(s, k === 0 ? t : t, c, "sm" + (c === FUGE ? " glue" : "")); b.dataset.c = c; b.style.background = "#8a93a6"; return b; });
            const j = join(s, bs);
            const fact = s.h("p", { class: "small", style: { fontSize: "19px" } }, words[i + 1]);
            const r = s.h("div", { class: "stack later", style: { gap: "4px" } }, j, fact);
            r.bs = bs; rows.push(r);
          }
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "250px 1fr", gap: "30px", alignItems: "center", height: "100%" } }, tv, s.h("div", { class: "stack", style: { gap: "18px" } }, rows)));
          s.show(tv, "up"); s.sfx.whoosh();
          const split = async r => {
            r.classList.remove("later"); s.sfx.pop(); await s.show(r, "left");
            await s.wait(250);
            r.bs.forEach(b => { b.style.background = b.dataset.c; });
            await splitOut(s, r.bs, 10);
          };
          s.step(async () => {
            await split(rows[0]);
            s.sfx.zap(); await s.show(meas, "fade"); s.show(mbg, "pop");
            mtxt.classList.remove("later");
            await s.tween({ from: 0, to: 368, dur: 1200, ease: "out", update: v => { mtxt.textContent = Math.round(v) + " m"; } });
            mtxt.textContent = "368 m"; s.sfx.ding();
          });
          s.step(async () => { await split(rows[1]); });
          s.step(async () => { await split(rows[2]); });
          s.step(async () => { await split(rows[3]); s.say("Donau, Dampf, Schiff, Fahrt, s, Gesellschaft."); });
        },
      },
      /* 6 ─────────────── Schilder */
      {
        title: "Im Alltag: Wörter auf Schildern",
        say: "Auf Schildern in der Stadt stehen ganz viele zusammengesetzte Wörter.",
        build(s) {
          const sign = (draw) => { const v = s.svg(480, 110); draw(v); return v; };
          const s1 = sign(v => { v.append(s.el("rect", { x: 40, y: 10, width: 400, height: 90, rx: 8, fill: "#0b8a45" }), s.el("rect", { x: 56, y: 24, width: 62, height: 62, rx: 6, fill: "#fff" }), s.el("text", { x: 87, y: 70, "text-anchor": "middle", "font-size": 40, text: "🏃" }), T(s, 270, 66, "Notausgang", { fill: "#fff", "font-size": 34 })); });
          const s2 = sign(v => { v.append(s.el("circle", { cx: 100, cy: 55, r: 44, fill: "#ffd700", stroke: "#0b8a45", "stroke-width": 9 }), T(s, 100, 70, "H", { fill: "#0b8a45", "font-size": 48 }), s.el("rect", { x: 170, y: 22, width: 270, height: 66, rx: 8, fill: "#fff", stroke: INK, "stroke-width": 3 }), T(s, 305, 66, "Bushaltestelle", { "font-size": 30 })); });
          const s3 = sign(v => { v.append(s.el("rect", { x: 40, y: 10, width: 400, height: 90, rx: 8, fill: "#1d5bd0" }), s.el("text", { x: 92, y: 72, "text-anchor": "middle", "font-size": 44, text: "🛝" }), T(s, 270, 66, "Spielplatz", { fill: "#fff", "font-size": 36 })); });
          const s4 = sign(v => { v.append(s.el("rect", { x: 40, y: 10, width: 400, height: 90, rx: 8, fill: "#ffd700", stroke: INK, "stroke-width": 3 }), s.el("text", { x: 92, y: 72, "text-anchor": "middle", "font-size": 42, text: "🎫" }), T(s, 275, 66, "Fahrkartenautomat", { "font-size": 32 })); });
          const data = [[s1, [["Not", BW], ["ausgang", GW]]], [s2, [["Bus", BW], ["haltestelle", GW]]], [s3, [["Spiel", BW], ["platz", GW]]], [s4, [["Fahrkarte", BW], ["n", FUGE], ["automat", GW]]]];
          const cards = data.map(([sv, parts]) => {
            const bs = parts.map(([t, c]) => blk(s, t, c, "sm" + (c === FUGE ? " glue" : "")));
            const j = join(s, bs); j.classList.add("later");
            const c = s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: "14px 16px" } }, sv, j);
            c.j = j; c.bs = bs; return c;
          });
          const m = merk(s, "Schilder müssen kurz sein – darum steckt man Wörter zusammen. ", s.h("i", null, "Ein Ausgang für den Notfall"), " = ", s.h("b", null, "Notausgang"), ".");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "16px" } }, s.h("div", { class: "cols", style: { gap: "18px" } }, cards), m));
          s.sfx.pop();
          const go = async c => { s.sfx.whoosh(); await s.show(c, "zoom"); s.show(c.j, "fade"); await splitOut(s, c.bs, 8); };
          s.step(async () => { await go(cards[0]); await go(cards[1]); });
          s.step(async () => { await go(cards[2]); await go(cards[3]); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 7 ─────────────── Sport + Schule */
      {
        title: "Im Alltag: Sport und Schule",
        say: "Auch beim Sport und in der Schule sind überall zusammengesetzte Wörter. Tippe ein Wort an, dann zerfällt es in Bausteine.",
        build(s) {
          const col = (title, ic, list) => {
            const items = list.map(parts => {
              const bs = parts.map(([t, c]) => blk(s, t, "#8a93a6", "sm" + (c === FUGE ? " glue" : "")));
              bs.forEach((b, i) => { b.dataset.c = parts[i][1]; });
              const j = join(s, bs, "w6-tap");
              let open = false;
              const toggle = async () => {
                open = !open;
                if (open) { bs.forEach(b => { b.style.background = b.dataset.c; }); await splitOut(s, bs, 10); }
                else { s.sfx.snap(); await s.tween({ from: 1, to: 0, dur: 300, update: v => bs.forEach((b, i) => { b.style.marginLeft = i ? (10 * v) + "px" : ""; }) }); bs.forEach(b => { b.style.background = "#8a93a6"; }); }
              };
              j.onclick = () => { s.sfx.click(); toggle(); };
              return { j, toggle, isOpen: () => open };
            });
            const card = s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", gap: "10px" } }, s.h("p", { class: "h2" }, ic + " " + title), ...items.map(x => x.j));
            return { card, items };
          };
          const sport = col("Sport", "⚽", [[["Fuß", BW], ["ball", VIOLET], ["platz", GW]], [["Tor", BW], ["wart", GW]], [["Elf", BW], ["meter", GW]], [["Turn", BW], ["halle", GW]]]);
          const schule = col("Schule", "🏫", [[["Haus", BW], ["aufgabe", GW]], [["Stunde", BW], ["n", FUGE], ["plan", GW]], [["Pause", BW], ["n", FUGE], ["brot", GW]], [["Feder", BW], ["mappe", GW]]]);
          const hint = s.h("p", { class: "hand", style: { margin: 0, textAlign: "center", color: RED } }, "👆 Tippe ein Wort an!");
          const lf = life(s, s.h("p", { class: "small" }, "Ein Elfmeter heißt so, weil der Ball 11 Meter vor der Torlinie liegt. Das Wort erklärt sich selbst!"));
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "14px" } }, hint, s.h("div", { class: "cols" }, sport.card, schule.card), lf));
          s.show([sport.card, schule.card], "up"); s.sfx.pop();
          s.step(async () => { for (const it of sport.items) if (!it.isOpen()) { await it.toggle(); await s.wait(120); } });
          s.step(async () => { for (const it of schule.items) if (!it.isOpen()) { await it.toggle(); await s.wait(120); } });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 8 ─────────────── Präfixe */
      {
        title: "Präfixe: Bausteine vorne",
        say: "Ein Präfix ist ein Baustein, der vorne an ein Wort gesteckt wird. Er verändert die Bedeutung.",
        build(s) {
          const data = [
            ["ver", [["kaufen", "ver", "kaufen"], ["stecken", "ver", "stecken"], ["laufen", "ver", "laufen"]]],
            ["be", [["malen", "be", "malen"], ["suchen", "be", "suchen"], ["kommen", "be", "kommen"]]],
            ["ent", [["decken", "ent", "decken"], ["packen", "ent", "packen"], ["kommen", "ent", "kommen"]]],
            ["un", [["glücklich", "un", "glücklich"], ["klar", "un", "klar"], ["Ordnung", "Un", "ordnung"]]],
            ["miss", [["verstehen", "miss", "verstehen"], ["Erfolg", "Miss", "erfolg"], ["trauen", "miss", "trauen"]]],
          ];
          const rows = data.map(([p, exs]) => {
            const pb = blk(s, p + "-", PRE, "sm");
            const cells = exs.map(([base, pp, rest]) => {
              const pre = s.h("b", { class: "w6-fl later", style: { color: PRE } }, pp);
              return { el: s.h("span", { class: "t", style: { fontSize: "23px", whiteSpace: "nowrap" } }, s.h("span", { class: "pencil" }, base), "  →  ", pre, rest), pre };
            });
            const r = s.h("div", { class: "later w6-tap", style: { display: "grid", gridTemplateColumns: "110px repeat(3, 1fr)", alignItems: "center", gap: "12px", background: "#fff", border: "2px solid var(--line)", borderRadius: "14px", padding: "4px 14px 10px" } }, s.h("span", null, pb), ...cells.map(c => c.el));
            r.pb = pb; r.cells = cells; return r;
          });
          const anim = async r => {
            r.classList.remove("later"); s.sfx.pop(); await s.show(r, "left");
            for (const c of r.cells) { s.sfx.snap(); await s.show(c.pre, "right"); }
          };
          rows.forEach(r => { r.onclick = () => { s.sfx.click(); r.cells.forEach(c => c.pre.classList.add("later")); anim(r); }; });
          const m = merk(s, "Ein ", s.h("b", { style: { color: PRE } }, "Präfix"), " (Vorsilbe) steht vorne und verändert die Bedeutung. ", s.h("b", { style: { color: PRE } }, "un-"), " und ", s.h("b", { style: { color: PRE } }, "miss-"), " machen oft das Gegenteil.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "10px" } }, rows, m));
          s.sfx.pop();
          s.step(async () => { await anim(rows[0]); s.say("kaufen, verkaufen. Fast das Gegenteil!"); });
          s.step(async () => { await anim(rows[1]); await anim(rows[2]); });
          s.step(async () => { await anim(rows[3]); await anim(rows[4]); s.say("glücklich, unglücklich. Erfolg, Misserfolg."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 9 ─────────────── Suffixe */
      {
        title: "Suffixe: Bausteine hinten",
        say: "Ein Suffix kommt hinten an das Wort. Es kann sogar die Wortart ändern. Dann ändert sich auch die Groß- und Kleinschreibung.",
        build(s) {
          // [base, firstBefore, firstAfter, restStem, suffix]
          const N = [["frei", "f", "F", "rei", "heit"], ["sauber", "s", "S", "auber", "keit"], ["wandern", "w", "W", "ander", "ung"], ["Freund", "F", "F", "reund", "schaft"]];
          const A = [["Freund", "F", "f", "reund", "lich"], ["Kind", "K", "k", "ind", "lich"], ["Sonne", "S", "s", "onn", "ig"], ["essen", "e", "e", "ss", "bar"]];
          const mkRows = list => list.map(([base, f0, f1, rest, suf]) => {
            const fl = s.h("span", { class: "w6-fl" }, f0);
            const sb = s.h("b", { class: "w6-fl later", style: { color: SUF } }, suf);
            const r = s.h("div", { class: "row later", style: { flexWrap: "nowrap", gap: "12px", fontSize: "25px" } },
              s.h("span", { class: "pencil", style: { width: "120px" } }, base), s.h("span", { class: "pencil" }, "→"),
              s.h("span", { style: { fontWeight: 700 } }, fl, rest, sb));
            r.go = async () => { r.classList.remove("later"); s.sfx.pop(); await s.show(r, "left"); s.sfx.snap(); await s.show(sb, "right"); if (f0 !== f1) await flipLetter(s, fl, f1, RED); };
            return r;
          });
          const nR = mkRows(N), aR = mkRows(A);
          const card = (title, sub, chips, rows) => s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", gap: "10px" } },
            s.h("p", { class: "h2" }, title), s.h("p", { class: "small pencil" }, sub),
            s.h("div", { class: "row", style: { gap: "6px" } }, chips.map(c => blk(s, c, SUF, "sm"))), ...rows);
          const c1 = card("Nomen-Macher", "Neues Wort ist ein Nomen → groß!", ["-heit", "-keit", "-ung", "-schaft"], nR);
          const c2 = card("Adjektiv-Macher", "Neues Wort ist ein Adjektiv → klein!", ["-lich", "-ig", "-bar"], aR);
          const m = merk(s, "Ein ", s.h("b", { style: { color: SUF } }, "Suffix"), " (Nachsilbe) steht hinten. Es bestimmt die ", s.h("b", null, "Wortart"), " – und damit, ob du groß oder klein schreibst.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "14px" } }, s.h("div", { class: "cols" }, c1, c2), m));
          s.show([c1, c2], "up"); s.sfx.pop();
          s.step(async () => { await nR[0].go(); s.say("frei, Freiheit. Jetzt groß!"); });
          s.step(async () => { for (let i = 1; i < 4; i++) await nR[i].go(); });
          s.step(async () => { await aR[0].go(); s.say("Freund, freundlich. Jetzt klein!"); for (let i = 1; i < 4; i++) await aR[i].go(); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 10 ─────────────── Nominalisierung */
      {
        title: "Aus Verben werden Nomen",
        say: "Auch ein Verb kann zum Nomen werden. Wenn das, beim oder zum davorsteht, schreibst du es groß.",
        build(s) {
          const data = [["lesen", "das", "l", "L", "esen", "Das Lesen macht Spaß. 📚"], ["schwimmen", "beim", "s", "S", "chwimmen", "Beim Schwimmen trage ich eine Brille. 🏊"], ["laufen", "zum", "l", "L", "aufen", "Zum Laufen brauche ich Turnschuhe. 👟"]];
          const rows = data.map(([v, sig, f0, f1, rest, sent]) => {
            const art = s.h("span", { class: "w6-art later", style: { borderColor: U, color: U } }, sig);
            const fl = s.h("span", { class: "w6-fl" }, f0);
            const line = s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "12px" } }, s.h("span", { class: "t pencil", style: { width: "130px" } }, v), s.h("span", { class: "t pencil" }, "→"), art, s.h("span", { class: "h2" }, fl, rest));
            const st = s.h("p", { class: "small later", style: { fontSize: "21px", marginLeft: "4px" } }, sent);
            const r = s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "6px", padding: "12px 18px" } }, line, st);
            r.go = async () => { s.sfx.pop(); await s.show(r, "left"); s.sfx.whoosh(); await s.show(art, "right"); await flipLetter(s, fl, f1, RED); s.show(st, "fade"); };
            return r;
          });
          const signs = s.svg(400, 300);
          const sg = (y, txt, ic) => { const g = s.el("g", { class: "later" }); g.append(s.el("rect", { x: 20, y, width: 360, height: 120, rx: 14, fill: "#fff", stroke: RED, "stroke-width": 8 }), s.el("text", { x: 76, y: y + 78, "text-anchor": "middle", "font-size": 46, text: ic }), T(s, 240, y + 60, txt[0], { fill: RED, "font-size": 30 }), T(s, 240, y + 96, txt[1], { fill: INK, "font-size": 26 })); signs.append(g); return g; };
          const g1 = sg(10, ["Baden", "verboten!"], "🏊"), g2 = sg(170, ["Betreten", "verboten!"], "🚧");
          const lf = life(s, s.h("p", { class: "small" }, "Auf Schildern: ", s.h("b", null, "Baden"), " und ", s.h("b", null, "Betreten"), " sind hier Nomen – darum groß."));
          const m = merk(s, "Steht ", s.h("b", null, "das, beim, zum"), " oder ", s.h("b", null, "vom"), " vor einem Verb, wird es zum ", s.h("b", null, "Nomen"), ": Du schreibst es ", s.h("span", { class: "hl" }, "groß"), ".");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "14px" } },
            s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 400px", alignItems: "center", gap: "24px" } }, s.h("div", { class: "stack", style: { gap: "12px" } }, rows), s.h("div", { class: "stack", style: { gap: "10px" } }, signs, lf)), m));
          s.sfx.pop();
          s.step(async () => { await rows[0].go(); s.say("lesen, das Lesen."); });
          s.step(async () => { await rows[1].go(); await rows[2].go(); });
          s.step(async () => { s.sfx.drum(); await s.show(g1, "zoom"); s.sfx.drum(); await s.show(g2, "zoom"); await s.show(lf, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 11 ─────────────── Wortfamilie */
      {
        title: "Die Wortfamilie fahr-",
        say: "Alle Wörter mit dem gleichen Wortstamm gehören zu einer Wortfamilie. Sie wachsen wie ein Baum aus einer Wurzel.",
        build(s) {
          const W = 1100, H = 430, TX = 550;
          const svg = s.svg(W, H);
          const trunk = s.el("path", { d: `M${TX - 26},${H - 50} C${TX - 18},300 ${TX - 14},200 ${TX - 6},110 L${TX + 6},110 C${TX + 14},200 ${TX + 18},300 ${TX + 26},${H - 50} Z`, fill: "#8a5a2b" });
          const root = s.el("g");
          root.append(s.el("rect", { x: TX - 70, y: H - 58, width: 140, height: 52, rx: 12, fill: RED }), T(s, TX, H - 22, "fahr", { fill: "#fff", "font-size": 32 }));
          svg.append(s.el("ellipse", { cx: TX, cy: H - 30, rx: 220, ry: 16, fill: "#c8e6c9" }), trunk, root);
          const NOUN = U, VERB = BLUE, ADJ = ORANGE;
          const leaves = [
            // [x, y, word, Wortart, group]
            [160, 345, "Fahrer", NOUN, 0], [360, 345, "abfahren", VERB, 1], [740, 345, "losfahren", VERB, 1], [940, 345, "Fahrrad", NOUN, 0],
            [140, 250, "Abfahrt", NOUN, 0], [345, 250, "Fahrschule", NOUN, 0], [755, 250, "Fähre", NOUN, 2], [960, 250, "Fahrkarte", NOUN, 0],
            [230, 155, "Vorfahrt", NOUN, 0], [445, 155, "Gefährt", NOUN, 2], [655, 155, "Fahrzeug", NOUN, 0], [870, 155, "Erfahrung", NOUN, 1],
            [445, 58, "befahrbar", ADJ, 1], [655, 58, "Fahrbahn", NOUN, 0],
          ];
          const branchG = s.el("g"), leafG = s.el("g");
          svg.insertBefore(branchG, trunk); svg.append(leafG);
          const L = leaves.map(([x, y, w, c, g]) => {
            const ty = Math.min(H - 70, y + 40);
            const br = s.el("path", { d: `M${TX},${ty} Q${(TX + x) / 2},${ty - 10} ${x},${y}`, fill: "none", stroke: "#8a5a2b", "stroke-width": 7, "stroke-linecap": "round", class: "later" });
            branchG.append(br);
            const lf = s.el("g", { class: "later" });
            const bw = Math.max(150, w.length * 15 + 34);
            lf.append(s.el("rect", { x: x - bw / 2, y: y - 25, width: bw, height: 50, rx: 25, fill: "#fff", stroke: c, "stroke-width": 4 }));
            const t = T(s, x, y + 9, "", { "font-size": 25, fill: INK });
            w.split(/(f[aä]hr)/i).forEach(part => { if (!part) return; const isStem = /^f[aä]hr$/i.test(part); const sp = s.el("tspan", { text: part }); if (isStem) { sp.style.fill = RED; } t.append(sp); });
            lf.append(t); leafG.append(lf);
            return { br, lf, g };
          });
          const legend = s.h("div", { class: "row", style: { justifyContent: "center", gap: "12px" } },
            s.h("span", { class: "chip", style: { border: `3px solid ${NOUN}` } }, "Nomen"), s.h("span", { class: "chip", style: { border: `3px solid ${VERB}` } }, "Verb"), s.h("span", { class: "chip", style: { border: `3px solid ${ADJ}` } }, "Adjektiv"),
            s.h("span", { class: "chip", style: { color: RED } }, "rot = Wortstamm"));
          const m = merk(s, "Wörter mit dem gleichen ", s.h("b", { class: "red" }, "Wortstamm"), " bilden eine ", s.h("b", null, "Wortfamilie"), ". Der Stamm kann sich etwas verändern: fahr → ", s.h("b", { class: "red" }, "fähr"), ".");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "8px" } }, legend, svg, m));
          s.sfx.whoosh(); s.show(trunk, "up"); s.show(root, "zoom", 200);
          const grow = async g => {
            for (const o of L.filter(o => o.g === g)) { s.sfx.count(L.indexOf(o) % 12); s.show(o.br, "draw"); await s.wait(260); s.show(o.lf, "pop"); }
            await s.wait(400);
          };
          s.step(async () => { await grow(0); s.say("Fahrer, Fahrrad, Abfahrt, Fahrkarte."); });
          s.step(async () => { await grow(1); });
          s.step(async () => { await grow(2); s.say("Fähre und Gefährt. Aus a wird ä."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 12 ─────────────── Rechtschreibung */
      {
        title: "Der Wortstamm hilft beim Schreiben",
        say: "Wenn du nicht weißt, wie man ein Wort schreibt, frag die Wortfamilie. Fahrrad schreibt man mit h, weil fahren ein h hat.",
        build(s) {
          const data = [["Fa", "h", "rrad", "fahren", "mit h"], ["K", "ä", "lte", "kalt", "mit ä"], ["Ra", "d", "", "die Räder", "mit d"], ["H", "äu", "ser", "das Haus", "mit äu"]];
          const cards = data.map(([a, gap, b, rel, res]) => {
            const g = s.h("span", { style: { display: "inline-block", minWidth: "44px", padding: "0 6px", borderBottom: `4px dashed ${RED}`, color: RED, textAlign: "center" } }, s.h("span", { class: "later w6-fl" }, gap));
            const word = s.h("p", { class: "big", style: { textAlign: "center" } }, a, g, b);
            const relP = s.h("p", { class: "t later", style: { textAlign: "center" } }, "🔍 ", s.h("b", { style: { color: U } }, rel));
            const resP = s.h("p", { class: "h2 later", style: { textAlign: "center", color: RED } }, "→ " + res);
            const c = s.h("div", { class: "card w6-tap", style: { display: "flex", flexDirection: "column", gap: "12px", justifyContent: "center", minHeight: "230px" } }, word, relP, resP);
            let done = false;
            c.go = async () => { if (done) return; done = true; s.sfx.whoosh(); await s.show(relP, "up"); await s.wait(250); s.sfx.boing(); g.style.minWidth = "0"; g.style.padding = "0"; await s.show(g.firstChild, "bounce"); s.sfx.ding(); await s.show(resP, "pop"); };
            c.onclick = () => { s.sfx.click(); c.go(); };
            return c;
          });
          const hint = s.h("p", { class: "hand", style: { margin: 0, textAlign: "center", color: RED } }, "👆 Tippe eine Karte an: Welcher Verwandte hilft?");
          const m = merk(s, "Unsicher? Suche ein ", s.h("b", null, "verwandtes Wort"), " aus der Wortfamilie oder ", s.h("b", null, "verlängere"), " das Wort (Rad → Räder).");
          const lf = life(s, s.h("p", { class: "small" }, "Fahrkarte, Fahrplan, Vorfahrt, Fahrradhelm: alle aus der Familie fahren – alle mit h!"));
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "16px" } }, hint, s.h("div", { class: "cols4" }, cards), m, lf));
          s.show(cards, "up"); s.sfx.pop();
          s.step(async () => { await cards[0].go(); });
          s.step(async () => { await cards[1].go(); await cards[2].go(); await cards[3].go(); });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(m, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 13 ─────────────── Wortfeld sagen */
      {
        title: "Wortfeld „sagen“",
        say: "Wörter mit ähnlicher Bedeutung bilden ein Wortfeld. Statt immer sagen kannst du flüstern, rufen oder schreien.",
        build(s) {
          const svg = s.svg(1100, 190);
          const wedge = s.el("polygon", { points: "20,150 1080,150 1080,30", fill: "#e3f2e4", class: "later" });
          svg.append(wedge, T(s, 70, 182, "leise", { fill: PENCIL, "font-size": 20 }), T(s, 1040, 182, "laut", { fill: PENCIL, "font-size": 20 }));
          const list = [["flüstern", 100, 21, 0.03], ["murmeln", 270, 24, 0.06], ["sagen", 440, 28, 0.1], ["rufen", 610, 32, 0.16], ["schreien", 800, 37, 0.22], ["brüllen", 990, 42, 0.3]];
          const ws = list.map(([w, x, fs, vol], i) => {
            const t = T(s, x, 135, w, { "font-size": fs, fill: i === 2 ? PENCIL : U, class: "later w6-tap" });
            t.addEventListener("click", () => { s.sfx.tone(330 + i * 60, 0.35, "triangle", vol); s.tween({ dur: 400, update: v => t.setAttribute("transform", `translate(0 ${-10 * Math.sin(v * Math.PI)})`) }); });
            svg.append(t); return { t, vol, i };
          });
          const other = s.h("div", { class: "row later", style: { justifyContent: "center", gap: "10px" } }, s.h("span", { class: "small pencil" }, "Und so geht's auch:"), ...["fragen", "antworten", "erklären", "erzählen", "behaupten", "jubeln"].map(w => s.h("span", { class: "chip", style: { fontSize: "21px" } }, w)));
          const lines = [["„Pst!“, ", "sagte", "flüsterte", " Mia."], ["„Hilfe!“, ", "sagte", "schrie", " Ole."], ["„Wo bist du?“, ", "sagte", "fragte", " Mama."]];
          const ls = lines.map(([a, w0, w1, b]) => { const fl = s.h("b", { class: "w6-fl", style: { color: PENCIL } }, w0); const p = s.h("p", { class: "t" }, a, fl, b); p.fl = fl; p.w1 = w1; return p; });
          const story = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Bessere Geschichten"), s.h("div", { class: "cols3", style: { gap: "12px" } }, ls));
          const hint = s.h("p", { class: "hand", style: { margin: 0, textAlign: "center", color: RED } }, "👆 Tippe die Wörter an – hör, wie laut sie sind!");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "16px" } }, hint, svg, other, story));
          s.sfx.pop();
          s.step(async () => {
            s.show(wedge, "left"); s.sfx.whoosh(); await s.wait(300);
            for (const o of ws) { s.sfx.tone(330 + o.i * 60, 0.25, "triangle", o.vol); await s.show(o.t, "pop"); }
          });
          s.step(async () => { s.sfx.pop(); await s.show(other, "up"); });
          s.step(async () => {
            await s.show(story, "up");
            for (const p of ls) { await s.wait(300); await flipLetter(s, p.fl, p.w1, U); }
            s.say("Pst, flüsterte Mia. Hilfe, schrie Ole. Wo bist du, fragte Mama.");
          });
        },
      },
      /* 14 ─────────────── Wortfeld gehen */
      {
        title: "Wortfeld „gehen“",
        say: "Auch für gehen gibt es viele genauere Wörter. Tippe ein Wort an und schau, wie sich das Männchen bewegt.",
        build(s) {
          const svg = s.svg(1100, 210);
          svg.append(s.el("rect", { x: 0, y: 170, width: 1100, height: 40, rx: 10, fill: "#c8e6c9" }), s.el("line", { x1: 0, y1: 170, x2: 1100, y2: 170, stroke: U, "stroke-width": 4 }));
          const fig = s.el("g");
          const head = s.el("circle", { cx: 0, cy: -92, r: 14, fill: "none", stroke: INK, "stroke-width": 5 });
          const body = s.el("line", { x1: 0, y1: -78, x2: 0, y2: -36, stroke: INK, "stroke-width": 6, "stroke-linecap": "round" });
          const legs = [0, 1].map(() => s.el("line", { x1: 0, y1: -36, x2: 0, y2: 0, stroke: INK, "stroke-width": 6, "stroke-linecap": "round" }));
          const arms = [0, 1].map(() => s.el("line", { x1: 0, y1: -70, x2: 0, y2: -46, stroke: INK, "stroke-width": 5, "stroke-linecap": "round" }));
          fig.append(...legs, body, ...arms, head);
          svg.append(fig);
          const big = s.h("p", { class: "huge", style: { textAlign: "center", color: U, minHeight: "76px" } }, "gehen");
          // speed (px/s), leg swing, crouch, hop
          const V = {
            schleichen: { sp: 70, sw: 0.35, cr: 22, hop: 0, f: 2 }, schlendern: { sp: 110, sw: 0.4, cr: 0, hop: 0, f: 2.4 }, gehen: { sp: 170, sw: 0.5, cr: 0, hop: 0, f: 3.4 },
            marschieren: { sp: 210, sw: 0.75, cr: 0, hop: 0, f: 4.2 }, eilen: { sp: 300, sw: 0.7, cr: 0, hop: 0, f: 5.5 }, rennen: { sp: 450, sw: 1.0, cr: 6, hop: 0, f: 7.5 },
            hüpfen: { sp: 200, sw: 0.2, cr: 0, hop: 40, f: 3 }, stolpern: { sp: 150, sw: 0.6, cr: 0, hop: 0, f: 3, trip: true },
          };
          let cur = V.gehen, x = 80, active = true, lastStep = 0;
          const pose = (t) => {
            const a = Math.sin(t * cur.f * Math.PI) * cur.sw;
            const hop = cur.hop ? Math.abs(Math.sin(t * cur.f * Math.PI)) * cur.hop : 0;
            const tilt = cur.trip ? 18 * Math.max(0, Math.sin(t * 2.2)) * Math.sin(t * 9) : (cur === V.rennen ? 12 : cur.cr ? 20 : 0);
            fig.setAttribute("transform", `translate(${x.toFixed(1)},${(170 - hop + cur.cr * 0.6).toFixed(1)}) rotate(${tilt.toFixed(1)})`);
            legs.forEach((l, i) => { const ang = (i ? a : -a); l.setAttribute("x2", (Math.sin(ang) * 38).toFixed(1)); l.setAttribute("y2", (-36 + Math.cos(ang) * 38 - cur.cr * 0.6).toFixed(1)); });
            arms.forEach((l, i) => { const ang = (i ? -a : a) * 1.2; l.setAttribute("x2", (Math.sin(ang) * 26).toFixed(1)); l.setAttribute("y2", (-70 + Math.cos(ang) * 26).toFixed(1)); });
          };
          pose(0);
          s.loop((t, dt) => {
            if (!active) return;
            x += cur.sp * Math.min(dt, 0.05);
            if (x > 1060) x = 40;
            const st = Math.floor(t * cur.f);
            if (st !== lastStep) { lastStep = st; s.sfx.tone(cur.hop ? 500 : 180, 0.05, "sine", 0.08); }
            pose(t);
          });
          const btns = Object.keys(V).map((w, i) => s.h("button", { class: "btn", style: { width: "100%" }, onclick: () => go(w) }, w));
          const go = w => { s.sfx.click(); cur = V[w]; big.textContent = w; s.show(big, "pop"); btns.forEach(b => b.classList.toggle("solid", b.textContent === w)); };
          const grid = s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" } }, btns);
          const lf = life(s, s.h("p", { class: "small" }, "Spannender erzählen: Statt „Ich ging zur Tür.“ lieber „Ich ", s.h("b", { style: { color: U } }, "schlich"), " zur Tür.“ – Sofort hast du ein Bild im Kopf."));
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "12px" } }, big, svg, grid, lf));
          s.sfx.pop(); go("gehen");
          s.step(async () => { go("schleichen"); s.say("schleichen. Ganz leise und langsam."); await s.wait(1500); });
          s.step(async () => { go("rennen"); s.say("rennen. So schnell du kannst!"); await s.wait(1500); });
          s.step(async () => { go("hüpfen"); s.say("hüpfen. Hopp, hopp, hopp!"); await s.wait(1500); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 15 ─────────────── Ober- und Unterbegriffe */
      {
        title: "Ober- und Unterbegriffe",
        say: "Ein Oberbegriff fasst viele Wörter zusammen. Unterbegriffe sind genauer. Instrumente ist der Oberbegriff, Geige ist ein Unterbegriff.",
        build(s) {
          const svg = s.svg(1100, 300);
          const node = (x, y, w, txt, c, fs = 24) => { const g = s.el("g", { class: "later" }); g.append(s.el("rect", { x: x - w / 2, y: y - 26, width: w, height: 52, rx: 14, fill: c, stroke: INK, "stroke-width": 2 }), T(s, x, y + 8, txt, { "font-size": fs, fill: c === "#fff" ? INK : "#fff" })); return g; };
          const edge = (x1, y1, x2, y2) => s.el("line", { x1, y1, x2, y2, stroke: PENCIL, "stroke-width": 4, "stroke-linecap": "round", class: "later" });
          const top = node(550, 36, 230, "Instrumente", U, 26);
          const mids = [[190, "Streichinstrumente"], [550, "Blasinstrumente"], [910, "Schlaginstrumente"]].map(([x, t]) => ({ x, n: node(x, 146, 250, t, BLUE, 22), e: edge(550, 62, x, 120) }));
          const leafs = [[100, "Geige 🎻", 0], [280, "Cello", 0], [460, "Flöte", 1], [640, "Trompete 🎺", 1], [820, "Trommel 🥁", 2], [1000, "Pauke", 2]].map(([x, t, p]) => ({ n: node(x, 258, 165, t, "#fff", 22), e: edge(mids[p].x, 172, x, 232) }));
          svg.append(...mids.map(m => m.e), ...leafs.map(l => l.e), top, ...mids.map(m => m.n), ...leafs.map(l => l.n));
          const mini = (top, kids, ic) => s.h("div", { class: "ex later", style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" } },
            s.h("span", { class: "chip", style: { background: U, color: "#fff", fontSize: "22px" } }, ic + " " + top),
            s.h("div", { class: "row", style: { justifyContent: "center", gap: "8px" } }, kids.map(k => s.h("span", { class: "chip", style: { background: "#fff", border: "2px solid var(--line)", fontSize: "21px" } }, k))));
          const ex2 = mini("Fahrzeuge", ["Bus", "U-Bahn", "Fahrrad", "Auto"], "🚇");
          const ex3 = mini("Obst", ["Apfel", "Banane", "Kirsche", "Birne"], "🍎");
          const m = merk(s, s.h("b", null, "Oberbegriff"), " = fasst zusammen. ", s.h("b", null, "Unterbegriff"), " = genauer. In Geschichten machen genaue Wörter Bilder im Kopf.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "12px" } }, svg, s.h("div", { class: "cols" }, ex2, ex3), m));
          s.sfx.pop(); s.show(top, "zoom");
          s.step(async () => { for (const md of mids) { s.sfx.note(4); s.show(md.e, "draw"); await s.wait(200); await s.show(md.n, "pop"); } });
          s.step(async () => { for (let i = 0; i < leafs.length; i++) { s.sfx.note(7 + (i % 3)); s.show(leafs[i].e, "draw"); await s.wait(160); await s.show(leafs[i].n, "pop"); } s.say("Geige ist ein Unterbegriff von Streichinstrumente. Und Streichinstrumente ist ein Unterbegriff von Instrumente."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(ex2, "left"); s.sfx.whoosh(); await s.show(ex3, "right"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 16 ─────────────── Wortbaustelle */
      {
        title: "Die große Wortbaustelle",
        say: "Jetzt bauen wir alles zusammen. Aus Freund wird freundlich, unfreundlich und am Ende Unfreundlichkeit.",
        build(s) {
          const lvls = [
            [[["Freund", STEM]], "Nomen", "groß"],
            [[["freund", STEM], ["lich", SUF]], "Adjektiv", "klein"],
            [[["un", PRE], ["freund", STEM], ["lich", SUF]], "Adjektiv", "klein"],
            [[["Un", PRE], ["freund", STEM], ["lich", SUF], ["keit", SUF]], "Nomen", "groß"],
          ];
          const rows = lvls.map(([parts, wa, gk], i) => {
            const bs = parts.map(([t, c]) => blk(s, t, c));
            const j = join(s, bs);
            const tag = s.h("span", { class: "chip", style: { fontSize: "21px", background: wa === "Nomen" ? U : ORANGE, color: "#fff" } }, wa + " · " + gk);
            const r = s.h("div", { class: "row" + (i ? " later" : ""), style: { flexWrap: "nowrap", gap: "18px", justifyContent: "center" } }, j, tag);
            r.bs = bs; return r;
          });
          const tools = s.h("div", { class: "row later", style: { justifyContent: "center", gap: "10px" } },
            ...[["Zusammensetzen", BW], ["Präfix", PRE], ["Suffix", SUF], ["Wortfamilie", RED], ["Wortfeld", U], ["Ober-/Unterbegriff", PENCIL]].map(([t, c]) => s.h("span", { class: "chip", style: { fontSize: "21px", border: `3px solid ${c}`, background: "#fff" } }, t)));
          const tl = s.h("p", { class: "hand later", style: { margin: 0, textAlign: "center", color: RED } }, "Dein Werkzeugkasten für Wörter 🧰");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "14px" } }, rows, tl, tools));
          s.show(rows[0], "zoom"); s.sfx.pop();
          for (let i = 1; i < 4; i++) s.step(async () => { const r = rows[i]; r.classList.remove("later"); await s.show(r, "up"); await snapIn(s, r.bs, 40); if (i === 3) { s.sfx.fanfare(); s.confetti(590, 400, 80); } });
          s.step(async () => { s.sfx.success(); await s.show(tl, "fade"); await s.show(tools, "up"); });
        },
      },
    ],
  });
})();
