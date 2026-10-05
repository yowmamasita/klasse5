/* Kapitel 10 – Bewegung: Knochen, Muskeln, Kräfte (RLP NaWi 5/6, Themenfeld 3.6 „Bewegung“).
   Skelett, Knochen in Zahlen, Gelenk-Aufbau, Gelenkarten, Wirbelsäule (Doppel-S), Beuger/Strecker,
   Sehnen, Fortbewegung der Tiere, Sohlen-/Zehen-/Zehenspitzengänger, Innen-/Außenskelett,
   Wirkungen einer Kraft, Kraftpfeile, Gewichtskraft + Federkraftmesser, Reibung, Ranzen, Aufwärmen.
   Fakten geprüft (Quellen im Bericht): wissen.de, Barmer, kenhub, DocCheck, Uni Saarland, wissenschaft.de u. a. */
(() => {
  const UC = "#0f766e";
  const TAU = Math.PI * 2;
  const D2R = Math.PI / 180;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const BONE = "#f4ecd8", BONES = "#8c7a55";
  const MUS = "#d9463b", MUSP = "#f2b8b0", SKIN = "#f6d2b0";

  /* ---------- helpers (as in u9) ---------- */
  const P = (s, html, cls = "t", hidden = false) => s.h("p", { class: cls + (hidden ? " later" : ""), html });
  const life = (s, label, ...kids) => s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, label), ...kids);
  const exb = (s, label, ...kids) => s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, label), ...kids);
  const merk = (s, html, hidden = true, size = 22) => s.h("div", { class: "merk" + (hidden ? " later" : ""), style: { fontSize: size + "px" }, html });
  const stack = (s, gap, ...kids) => s.h("div", { class: "stack", style: { gap: gap + "px" } }, ...kids);
  const cols = (s, lw, left, right, gap = 24) =>
    s.h("div", { class: "cols", style: { gridTemplateColumns: lw + "px 1fr", gap: gap + "px", alignItems: "center", height: "100%" } }, left, right);
  const lineTo = (s, x1, y1, x2, y2, col = UC, cls = "later") => s.el("line", { x1, y1, x2, y2, stroke: col, "stroke-width": 2.5, class: cls });
  const txt = (s, x, y, t, anchor = "start", extra = {}) => s.el("text", Object.assign({ x, y, "text-anchor": anchor, class: "lbl later", style: { fontWeight: 700 }, text: t }, extra));
  const countUp = (s, el, to, dur = 1200, pre = "", post = "") => s.tween({ from: 0, to, dur, ease: "out", update: v => { el.textContent = pre + s.fmt(Math.round(v)) + post; } });

  /* a bone: shaft + knobs at both ends */
  function bone(s, x1, y1, x2, y2, w) {
    const r = w * 0.8;
    return s.el("g", null,
      s.el("line", { x1, y1, x2, y2, stroke: BONES, "stroke-width": w + 4, "stroke-linecap": "round" }),
      s.el("circle", { cx: x1, cy: y1, r: r + 2, fill: BONES }), s.el("circle", { cx: x2, cy: y2, r: r + 2, fill: BONES }),
      s.el("line", { x1, y1, x2, y2, stroke: BONE, "stroke-width": w, "stroke-linecap": "round" }),
      s.el("circle", { cx: x1, cy: y1, r, fill: BONE }), s.el("circle", { cx: x2, cy: y2, r, fill: BONE }));
  }
  const mirror = (s, fn) => s.el("g", null, fn(1), fn(-1));

  /* front view skeleton, centre line x = cx, top y = 0 (height ≈ 600) */
  function skeleton(s, cx) {
    const X = x => cx + x;
    const G = {};
    G.skull = s.el("g", null,
      s.el("ellipse", { cx: X(0), cy: 54, rx: 40, ry: 46, fill: BONE, stroke: BONES, "stroke-width": 3 }),
      s.el("path", { d: `M${X(-26)} 84 Q${X(0)} 122 ${X(26)} 84`, fill: BONE, stroke: BONES, "stroke-width": 3 }),
      s.el("ellipse", { cx: X(-15), cy: 52, rx: 10, ry: 12, fill: "#5b4c33" }), s.el("ellipse", { cx: X(15), cy: 52, rx: 10, ry: 12, fill: "#5b4c33" }),
      s.el("path", { d: `M${X(0)} 66 L${X(-6)} 80 L${X(6)} 80 Z`, fill: "#5b4c33" }),
      s.el("line", { x1: X(-14), y1: 98, x2: X(14), y2: 98, stroke: BONES, "stroke-width": 2, "stroke-dasharray": "3 3" }));
    G.spine = s.el("g", null, ...Array.from({ length: 25 }, (_, i) => s.el("rect", { x: X(-7), y: 108 + i * 10, width: 14, height: 8, rx: 2, fill: BONE, stroke: BONES, "stroke-width": 1.5 })));
    G.ribs = s.el("g", { fill: "none", stroke: BONES, "stroke-width": 5, "stroke-linecap": "round" },
      ...Array.from({ length: 7 }, (_, i) => { const y = 176 + i * 16, w = 54 + i * 3; return s.el("path", { d: `M${X(-8)} ${y} Q${X(-w - 14)} ${y - 4} ${X(-w)} ${y + 24} Q${X(-30)} ${y + 34} ${X(-8)} ${y + 22} M${X(8)} ${y} Q${X(w + 14)} ${y - 4} ${X(w)} ${y + 24} Q${X(30)} ${y + 34} ${X(8)} ${y + 22}` }); }),
      s.el("rect", { x: X(-6), y: 170, width: 12, height: 100, rx: 5, fill: BONE, stroke: BONES, "stroke-width": 2 }));
    G.pelvis = s.el("g", null,
      mirror(s, d => s.el("path", { d: `M${X(d * 10)} 348 C${X(d * 62)} 336 ${X(d * 74)} 362 ${X(d * 62)} 396 C${X(d * 50)} 410 ${X(d * 26)} 404 ${X(d * 12)} 394 Z`, fill: BONE, stroke: BONES, "stroke-width": 3 })),
      s.el("path", { d: `M${X(-11)} 348 L${X(11)} 348 L${X(0)} 392 Z`, fill: BONE, stroke: BONES, "stroke-width": 2.5 }));
    G.clav = mirror(s, d => bone(s, X(d * 10), 158, X(d * 60), 150, 6));
    G.arm = mirror(s, d => s.el("g", null, bone(s, X(d * 66), 160, X(d * 80), 266, 11)));
    G.fore = mirror(s, d => s.el("g", null, bone(s, X(d * 80), 270, X(d * 88), 352, 6), bone(s, X(d * 70), 270, X(d * 76), 352, 5)));
    G.hand = mirror(s, d => s.el("g", null, s.el("ellipse", { cx: X(d * 83), cy: 366, rx: 14, ry: 10, fill: BONE, stroke: BONES, "stroke-width": 2 }),
      ...[-9, -3, 3, 9].map((o, i) => bone(s, X(d * (83 + o)), 378, X(d * (83 + o * 1.4)), 402 + (i === 0 || i === 3 ? -4 : 0), 3)),
      bone(s, X(d * 72), 370, X(d * 64), 388, 3)));
    G.femur = mirror(s, d => bone(s, X(d * 38), 400, X(d * 34), 496, 12));
    G.patella = mirror(s, d => s.el("circle", { cx: X(d * 34), cy: 506, r: 9, fill: BONE, stroke: BONES, "stroke-width": 2.5 }));
    G.shin = mirror(s, d => s.el("g", null, bone(s, X(d * 33), 516, X(d * 32), 582, 10), bone(s, X(d * 22), 518, X(d * 22), 580, 4)));
    G.foot = mirror(s, d => s.el("path", { d: `M${X(d * 24)} 586 L${X(d * 42)} 586 L${X(d * 58)} 598 L${X(d * 18)} 598 Z`, fill: BONE, stroke: BONES, "stroke-width": 2.5 }));
    const g = s.el("g", null, G.spine, G.ribs, G.pelvis, G.skull, G.clav, G.arm, G.fore, G.hand, G.femur, G.patella, G.shin, G.foot);
    return { g, G };
  }

  /* simple stick kid (side view) for ranzen / tug of war */
  const stick = (s, col = "#1b2740") => s.el("g", { stroke: col, "stroke-width": 7, "stroke-linecap": "round", fill: "none" });

  Deck.unit({
    id: "u10", num: 10, title: "Bewegung: Knochen, Muskeln, Kräfte", color: UC, soft: "#dcf2ef",
    subtitle: "Wie Skelett und Muskeln dich bewegen – und was Kräfte tun",
    blurb: "Skelett, Gelenke, Muskeln, Tiere in Bewegung, Kraft und Reibung",
    goals: [
      "Die wichtigsten Knochen und Gelenke kennen",
      "Verstehen, wie Beuger und Strecker zusammenarbeiten",
      "Vergleichen, wie sich Fisch, Schlange, Vogel und Pferd bewegen",
      "Wirkungen einer Kraft erkennen und Kräfte in Newton messen",
      "Reibung, Haltung und Aufwärmen im Alltag erklären",
    ],
    icon(svg, el) {
      svg.append(
        el("line", { x1: 20, y1: 14, x2: 20, y2: 40, stroke: BONES, "stroke-width": 12, "stroke-linecap": "round" }),
        el("line", { x1: 20, y1: 14, x2: 20, y2: 40, stroke: BONE, "stroke-width": 7, "stroke-linecap": "round" }),
        el("line", { x1: 20, y1: 42, x2: 52, y2: 30, stroke: BONES, "stroke-width": 12, "stroke-linecap": "round" }),
        el("line", { x1: 20, y1: 42, x2: 52, y2: 30, stroke: BONE, "stroke-width": 7, "stroke-linecap": "round" }),
        el("path", { d: "M24 18 Q46 22 46 34", stroke: MUS, "stroke-width": 7, fill: "none", "stroke-linecap": "round" }),
        el("path", { d: "M14 58 L56 58", stroke: UC, "stroke-width": 5, "stroke-linecap": "round" }),
        el("path", { d: "M48 51 L58 58 L48 65", stroke: UC, "stroke-width": 5, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Dein Skelett: das Gerüst",
        say: "Dein Skelett ist das Gerüst deines Körpers. Es stützt dich, schützt deine Organe und macht Bewegung möglich.",
        build(s) {
          const sv = s.svg(600, 606);
          const { g, G } = skeleton(s, 300);
          sv.append(g);
          const L = [
            // [group, text, side, y, targetX, targetY]
            ["rumpf", "Schädel", "L", 46, 262, 46], ["rumpf", "Rippen", "R", 214, 352, 214], ["rumpf", "Wirbelsäule", "R", 330, 307, 330], ["rumpf", "Becken", "R", 384, 358, 380],
            ["arm", "Schlüsselbein", "L", 140, 252, 154], ["arm", "Oberarmknochen", "L", 214, 228, 214], ["arm", "Elle und Speiche", "L", 306, 216, 310], ["arm", "Handknochen", "L", 396, 208, 390],
            ["bein", "Oberschenkelknochen", "L", 456, 263, 450], ["bein", "Kniescheibe", "R", 506, 345, 506], ["bein", "Schienbein", "L", 552, 266, 552], ["bein", "Fußknochen", "R", 596, 344, 592],
          ].map(([k, t, side, y, px, py]) => {
            const w = t.length * 10.6 + 8;
            const x = side === "L" ? 8 : 592;
            const l = lineTo(s, side === "L" ? x + w : x - w, y - 7, px, py);
            const tx = txt(s, x, y, t, side === "L" ? "start" : "end");
            sv.append(l, tx); return { k, l, tx };
          });
          const D = {
            rumpf: ["Kopf und Rumpf: schützen", "Der Schädel schützt dein Gehirn. Die Rippen bilden einen Korb um Herz und Lunge. Die Wirbelsäule trägt dich und schützt das Rückenmark."],
            arm: ["Arme und Hände: greifen", "Allein in einer Hand stecken 27 Knochen. Darum kannst du so fein greifen, schreiben und Gitarre spielen."],
            bein: ["Beine und Füße: tragen", "Der Oberschenkelknochen ist der längste und stärkste Knochen. Er trägt dich beim Rennen und Springen."],
          };
          const flash = groups => s.tween({ from: 0.25, to: 1, dur: 700, update: v => groups.forEach(x => x.setAttribute("opacity", v)) });
          const GR = { rumpf: [G.skull, G.ribs, G.spine, G.pelvis], arm: [G.clav, G.arm, G.fore, G.hand], bein: [G.femur, G.patella, G.shin, G.foot] };
          const infoT = s.h("p", { class: "h2", style: { color: "var(--unit)" } }, "Rund 200 Knochen");
          const infoD = P(s, "Sie halten dich aufrecht – wie die Stangen eines Zeltes.");
          const m = merk(s, "Das Skelett hat drei Aufgaben: <b>stützen</b>, <b>schützen</b> und <b>bewegen</b> (zusammen mit den Muskeln).");
          s.add(cols(s, 600, sv, stack(s, 16, s.h("div", { class: "card soft stack", style: { gap: "8px", minHeight: "230px" } }, infoT, infoD), m)));
          s.show(sv, "fade"); s.sfx.pop();
          ["rumpf", "arm", "bein"].forEach((k, i) => s.step(async () => {
            s.sfx.note(i * 3, .25); flash(GR[k]);
            infoT.textContent = D[k][0]; infoD.textContent = D[k][1];
            for (const x of L.filter(x => x.k === k)) { s.sfx.tick(); await s.show(x.l, "draw"); s.show(x.tx, "fade"); }
          }));
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Knochen in Zahlen",
        say: "Ein Erwachsener hat 206 Knochen, ein Baby sogar über 300 Knochen und Knorpel. Viele davon wachsen später zusammen.",
        build(s) {
          const photo = s.h("div", { class: "stack", style: { gap: "8px", width: "300px" } }, s.photo("roentgen-hand-1895", { w: 300, h: 428, fit: "cover", pos: "50% 55%", caption: "Röntgenbild einer Hand, 1895" }),
            P(s, "Mit Röntgenstrahlen kann man seit 1895 in den Körper sehen.", "small"));
          const card = (big, t, extra) => {
            const n = s.h("span", { class: "huge mono", style: { color: "var(--unit)", fontSize: "60px" } }, "0");
            const c = s.h("div", { class: "card later stack", style: { gap: "6px", padding: "14px 18px" } }, n, P(s, t, "small"), ...(extra ? [extra] : []));
            c.num = n; c.big = big; return c;
          };
          const cmp = s.svg(300, 54);
          const fem = s.el("rect", { x: 0, y: 8, width: 0, height: 16, rx: 8, fill: UC });
          const stp = s.el("rect", { x: 0, y: 34, width: 2, height: 12, fill: "#dc3b2a" });
          cmp.append(fem, stp);
          const C = [
            card(206, "Knochen hat ein <b>Erwachsener</b>."),
            card(300, "Knochen und Knorpel hat ein <b>Baby</b> – sogar etwas mehr. Viele wachsen später zusammen."),
            card(106, "davon stecken in <b>Händen und Füßen</b>: 27 in jeder Hand, 26 in jedem Fuß."),
            card(50, "Der <b>Oberschenkelknochen</b> ist am längsten. Der <b>Steigbügel</b> im Ohr ist nur etwa 3 mm klein (rot).", cmp),
          ];
          C[1].pre = "über "; C[3].post = " cm";
          s.add(cols(s, 300, photo, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", alignItems: "stretch" } }, ...C), 28));
          s.show(photo, "zoom"); s.sound("camera-shutter");
          C.forEach((c, i) => s.step(async () => {
            s.sfx.pop(); await s.show(c, "up");
            let last = -1;
            await s.tween({ from: 0, to: c.big, dur: 1300, ease: "out", update: v => { const r = Math.round(v); c.num.textContent = (c.pre || "") + r + (c.post || ""); if (Math.floor(r / 20) !== last) { last = Math.floor(r / 20); s.sfx.tick(); } } });
            if (i === 3) { await s.tween({ from: 0, to: 1, dur: 900, ease: "out", update: v => fem.setAttribute("width", 296 * v) }); s.sfx.ding(); }
            else s.sfx.ding();
          }));
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "So ist ein Gelenk gebaut",
        say: "Ein Gelenk verbindet zwei Knochen beweglich. Der Gelenkkopf passt in die Gelenkpfanne. Knorpel und Gelenkschmiere machen alles glatt.",
        build(s) {
          const sv = s.svg(560, 580);
          const C = { x: 280, y: 300 };
          const kapsel = s.el("ellipse", { cx: 280, cy: 318, rx: 118, ry: 100, fill: "rgba(255,217,74,.22)", stroke: "#a77a00", "stroke-width": 3, "stroke-dasharray": "10 7", class: "later" });
          const lower = s.el("path", { d: "M196 318 L223 333 A66 66 0 0 0 337 333 L364 318 L338 392 L330 576 L230 576 L222 392 Z", fill: BONE, stroke: BONES, "stroke-width": 4 });
          const cupK = s.el("path", { d: `M${280 + 61 * Math.cos(150 * D2R)} ${300 + 61 * Math.sin(150 * D2R)} A61 61 0 0 0 ${280 + 61 * Math.cos(30 * D2R)} ${300 + 61 * Math.sin(30 * D2R)}`, fill: "none", stroke: "#7cc4ea", "stroke-width": 7, class: "later" });
          const upper = s.el("g", null,
            s.el("rect", { x: 246, y: 30, width: 68, height: 260, rx: 24, fill: BONE, stroke: BONES, "stroke-width": 4 }),
            s.el("circle", { cx: 280, cy: 300, r: 56, fill: BONE, stroke: BONES, "stroke-width": 4 }));
          const headK = s.el("path", { d: `M${280 + 51 * Math.cos(200 * D2R)} ${300 + 51 * Math.sin(200 * D2R)} A51 51 0 1 0 ${280 + 51 * Math.cos(-20 * D2R)} ${300 + 51 * Math.sin(-20 * D2R)}`, fill: "none", stroke: "#7cc4ea", "stroke-width": 7, class: "later" });
          upper.append(headK);
          sv.append(kapsel, lower, cupK, upper);
          const setAng = a => upper.setAttribute("transform", `rotate(${a} ${C.x} ${C.y})`);
          const lab = [
            ["Gelenkkopf", "L", 232, 238, 268, "kopf"], ["Gelenkpfanne", "L", 440, 236, 372, "pfanne"],
            ["Knorpel", "R", 380, 330, 352, "knorpel"], ["Gelenkschmiere", "R", 246, 358, 284, "schmiere"], ["Gelenkkapsel", "R", 470, 380, 392, "kapsel"],
          ].map(([t, side, y, px, py, k]) => {
            const w = t.length * 10.6 + 8, x = side === "L" ? 8 : 552;
            const l = lineTo(s, side === "L" ? x + w : x - w, y - 7, px, py);
            const tx = txt(s, x, y, t, side === "L" ? "start" : "end");
            sv.append(l, tx); return { k, l, tx };
          });
          const showL = async k => { for (const x of lab.filter(x => x.k === k)) { s.sfx.tick(); await s.show(x.l, "draw"); s.show(x.tx, "fade"); } };
          let ang = 0;
          const sl = s.slider({ label: "Knochen bewegen", min: -50, max: 50, value: 0, fmt: v => v + "°", onInput: v => { ang = v; setAng(v); } });
          const swing = async () => { s.sfx.whoosh(); await s.tween({ from: 0, to: 1, dur: 2400, ease: "linear", update: t => { const a = 45 * Math.sin(t * TAU); setAng(a); sl.input.value = a; } }); setAng(ang); sl.set(Math.round(ang)); };
          const btn = s.h("button", { class: "btn solid", onclick: swing }, "Hin und her");
          const info = P(s, "Zwei Knochen treffen sich. Der runde <b>Gelenkkopf</b> sitzt in der hohlen <b>Gelenkpfanne</b>.");
          const m = merk(s, "<b>Knorpel</b> ist glatt und federt. Die <b>Gelenkschmiere</b> wirkt wie Öl. Die <b>Gelenkkapsel</b> hält alles zusammen.", true, 21);
          const lf = life(s, "Im Alltag", P(s, "Auch eine Fahrradkette läuft nur gut geölt leicht. Dein Gelenk ölt sich selbst.", "small"));
          s.add(cols(s, 560, sv, stack(s, 14, info, sl, s.h("div", { class: "row" }, btn), m, lf)));
          s.show(sv, "fade"); s.sfx.pop();
          s.step(async () => { await showL("kopf"); await showL("pfanne"); await swing(); });
          s.step(async () => { s.sfx.chord([0, 4, 7]); s.show(cupK, "draw"); await s.show(headK, "draw"); await showL("knorpel"); s.show(kapsel, "fade"); await showL("schmiere"); await showL("kapsel"); s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Vier Gelenkarten",
        say: "Es gibt verschiedene Gelenkarten. Sie bewegen sich unterschiedlich: in alle Richtungen, wie eine Tür, in zwei Richtungen oder im Kreis.",
        build(s) {
          const mk = (title, ex, alltag) => {
            const sv = s.svg(190, 170);
            sv.append(s.el("rect", { x: 0, y: 0, width: 190, height: 170, rx: 14, fill: "#f2f1fd" }));
            const c = s.h("div", { class: "card later", style: { display: "grid", gridTemplateColumns: "190px 1fr", gap: "14px", padding: "12px 14px", alignItems: "center" } },
              sv, s.h("div", { class: "stack", style: { gap: "4px" } }, s.h("p", { class: "t", style: { fontWeight: 800, color: "var(--unit)" } }, title), P(s, ex, "small"), P(s, alltag, "small pencil")));
            c.sv = sv; return c;
          };
          // 1 Kugelgelenk
          const c1 = mk("Kugelgelenk", "<b>Schulter, Hüfte</b>: in alle Richtungen, auch kreisen.", "wie ein Joystick");
          const k1 = s.el("ellipse", { cx: 95, cy: 120, rx: 78, ry: 22, fill: "none", stroke: UC, "stroke-width": 2, "stroke-dasharray": "5 5" });
          const st1 = s.el("line", { x1: 95, y1: 120, x2: 95, y2: 30, stroke: BONES, "stroke-width": 16, "stroke-linecap": "round" });
          const st1b = s.el("line", { x1: 95, y1: 120, x2: 95, y2: 30, stroke: BONE, "stroke-width": 11, "stroke-linecap": "round" });
          c1.sv.append(st1, st1b, s.el("path", { d: "M60 128 A36 36 0 0 0 130 128 L130 160 L60 160 Z", fill: BONE, stroke: BONES, "stroke-width": 3 }), s.el("circle", { cx: 95, cy: 122, r: 24, fill: BONE, stroke: BONES, "stroke-width": 3 }), k1);
          // 2 Scharniergelenk
          const c2 = mk("Scharniergelenk", "<b>Ellenbogen, Knie, Finger</b>: nur beugen und strecken.", "wie eine Tür");
          const arm2 = s.el("g", null, s.el("line", { x1: 95, y1: 110, x2: 170, y2: 110, stroke: BONES, "stroke-width": 16, "stroke-linecap": "round" }), s.el("line", { x1: 95, y1: 110, x2: 170, y2: 110, stroke: BONE, "stroke-width": 11, "stroke-linecap": "round" }));
          c2.sv.append(s.el("path", { d: "M100 110 A60 60 0 0 0 52 50", fill: "none", stroke: UC, "stroke-width": 2, "stroke-dasharray": "5 5" }),
            bone(s, 20, 110, 95, 110, 11), arm2, s.el("circle", { cx: 95, cy: 110, r: 13, fill: BONE, stroke: BONES, "stroke-width": 3 }), s.el("circle", { cx: 95, cy: 110, r: 4, fill: BONES }));
          // 3 Sattelgelenk
          const c3 = mk("Sattelgelenk", "<b>Daumen</b> (an der Handwurzel): in zwei Richtungen.", "wie ein Reiter im Sattel");
          const st3 = s.el("g", null, s.el("line", { x1: 95, y1: 104, x2: 95, y2: 30, stroke: BONES, "stroke-width": 16, "stroke-linecap": "round" }), s.el("line", { x1: 95, y1: 104, x2: 95, y2: 30, stroke: BONE, "stroke-width": 11, "stroke-linecap": "round" }));
          c3.sv.append(s.el("path", { d: "M40 112 Q95 86 150 112 L150 150 Q95 124 40 150 Z", fill: BONE, stroke: BONES, "stroke-width": 3 }), st3,
            s.el("path", { d: "M55 40 L135 40 M95 14 L95 66", stroke: UC, "stroke-width": 2, "stroke-dasharray": "5 5" }));
          // 4 Drehgelenk (top view of a head)
          const c4 = mk("Drehgelenk", "zwischen <b>1. und 2. Halswirbel</b>: Kopf drehen, „nein“ schütteln.", "wie ein Drehstuhl");
          const head4 = s.el("g", null, s.el("circle", { cx: 95, cy: 92, r: 46, fill: SKIN, stroke: "#c98d60", "stroke-width": 3 }), s.el("path", { d: "M85 48 L95 30 L105 48 Z", fill: SKIN, stroke: "#c98d60", "stroke-width": 3 }),
            s.el("ellipse", { cx: 49, cy: 92, rx: 6, ry: 12, fill: SKIN, stroke: "#c98d60", "stroke-width": 2.5 }), s.el("ellipse", { cx: 141, cy: 92, rx: 6, ry: 12, fill: SKIN, stroke: "#c98d60", "stroke-width": 2.5 }));
          c4.sv.append(head4, s.el("text", { x: 95, y: 160, "text-anchor": "middle", class: "lbl", style: { fontSize: "19px" }, text: "von oben" }));
          const on = [0, 0, 0, 0];
          s.loop(t => {
            if (on[0]) { const a = t * 2; const x = 95 + 70 * Math.cos(a), y = 30 + 18 * Math.sin(a) + 70; [st1, st1b].forEach(l => { l.setAttribute("x2", x); l.setAttribute("y2", y - 76); }); }
            if (on[1]) { const a = -(Math.sin(t * 2) * 0.5 + 0.5) * 110; arm2.setAttribute("transform", `rotate(${a} 95 110)`); }
            if (on[2]) { const ph = (t * 0.5) % 1, a = Math.sin(ph * 2 * TAU) * 30; st3.setAttribute("transform", ph < 0.5 ? `rotate(${a} 95 104)` : `translate(0 ${Math.sin(ph * 2 * TAU) * 10}) scale(1 ${1 - Math.abs(Math.sin(ph * 2 * TAU)) * 0.25})`); if (ph >= 0.5) st3.setAttribute("transform", `translate(0 ${26 * Math.abs(Math.sin(ph * 2 * TAU)) * 0.9}) scale(1 ${1 - Math.abs(Math.sin(ph * 2 * TAU)) * 0.25})`); }
            if (on[3]) head4.setAttribute("transform", `rotate(${Math.sin(t * 3) * 40} 95 92)`);
          });
          const m = life(s, "Mitmachen", P(s, "Kreise deinen Arm in der Schulter – und versuche das Gleiche mit dem Ellenbogen. Das geht nicht!", "small"));
          const cards = [c1, c2, c3, c4];
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%", justifyContent: "center" } }, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 16px" } }, ...cards), m));
          s.sfx.pop();
          const snd = ["whoosh", "snap", "boing", "swoosh"];
          cards.forEach((c, i) => s.step(async () => { s.sfx[snd[i]](); on[i] = 1; await s.show(c, "up"); if (i === 3) { s.sfx.ding(); await s.show(m, "up"); } }));
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Die Wirbelsäule: ein Doppel-S",
        say: "Von der Seite sieht die Wirbelsäule aus wie ein doppeltes S. So federt sie Stöße ab – wie eine Sprungfeder.",
        build(s) {
          const sv = s.svg(640, 600);
          sv.append(s.el("rect", { x: 0, y: 0, width: 640, height: 600, rx: 16, fill: "#f2f1fd" }));
          const SEC = [[0, 0.17, 14, 7, 18, 11, "#7cc4ea"], [0.17, 0.58, -22, 12, 24, 15, UC], [0.58, 0.8, 16, 5, 32, 20, "#ee7a1a"]];
          const bend = (t, c) => {
            const k = 1 + c * 1.3;
            if (t < 0.17) return 14 * k * Math.sin(Math.PI * t / 0.17);
            if (t < 0.58) return -22 * k * Math.sin(Math.PI * (t - 0.17) / 0.41);
            if (t < 0.8) return 16 * k * Math.sin(Math.PI * (t - 0.58) / 0.22);
            return -18 * k * Math.sin(Math.PI * (t - 0.8) / 0.2);
          };
          const X0 = 140, Y0 = 40, LEN = 520;
          const pos = (t, c) => ({ x: X0 + bend(t, c), y: Y0 + t * LEN * (1 - c * 0.12) });
          const verts = [];
          SEC.forEach(([a, b, , n, w, h, col]) => { for (let i = 0; i < n; i++) { const t = a + (b - a) * (i + 0.5) / n; const r = s.el("rect", { x: -w / 2, y: -h / 2, width: w, height: h, rx: 4, fill: BONE, stroke: col, "stroke-width": 3 }); verts.push({ t, r, h }); } });
          const discs = [];
          for (let i = 0; i < verts.length - 1; i++) { const d = s.el("ellipse", { rx: 10, ry: 3, fill: "#7cc4ea" }); discs.push({ t: (verts[i].t + verts[i + 1].t) / 2, r: d }); }
          const sacrum = s.el("path", { fill: BONE, stroke: "#a77a00", "stroke-width": 3 });
          const skull = s.el("ellipse", { rx: 42, ry: 30, fill: "rgba(244,236,216,.6)", stroke: BONES, "stroke-width": 2, "stroke-dasharray": "5 4" });
          sv.append(skull, ...discs.map(d => d.r), ...verts.map(v => v.r), sacrum);
          const draw = c => {
            const tan = t => { const p1 = pos(t - 0.005, c), p2 = pos(t + 0.005, c); return Math.atan2(p2.x - p1.x, p2.y - p1.y) / D2R; };
            verts.forEach(v => { const p = pos(v.t, c); v.r.setAttribute("transform", `translate(${p.x} ${p.y}) rotate(${-tan(v.t)}) scale(1 ${1 - c * 0.15})`); });
            discs.forEach(d => { const p = pos(d.t, c); d.r.setAttribute("transform", `translate(${p.x} ${p.y}) rotate(${-tan(d.t)})`); });
            const a = pos(0.81, c), b = pos(0.94, c), e = pos(1, c);
            sacrum.setAttribute("d", `M${a.x - 22} ${a.y} L${a.x + 22} ${a.y} L${b.x + 8} ${b.y} L${e.x} ${e.y} L${b.x - 12} ${b.y} Z`);
            const top = pos(0, c); skull.setAttribute("cx", top.x + 24); skull.setAttribute("cy", top.y - 10);
          };
          draw(0);
          const bracket = (t1, t2, label, col) => { const y1 = Y0 + t1 * LEN + 4, y2 = Y0 + t2 * LEN - 4;
            return s.el("g", { class: "later" }, s.el("path", { d: `M200 ${y1} L212 ${y1} L212 ${y2} L200 ${y2}`, fill: "none", stroke: col, "stroke-width": 3 }),
              s.el("text", { x: 224, y: (y1 + y2) / 2 + 7, class: "lbl", style: { fontWeight: 700, fill: col === "#7cc4ea" ? "#1d6a99" : col }, text: label })); };
          const B = [bracket(0, 0.17, "7 Halswirbel", "#7cc4ea"), bracket(0.17, 0.58, "12 Brustwirbel", UC), bracket(0.58, 0.8, "5 Lendenwirbel", "#ee7a1a"), bracket(0.8, 0.94, "Kreuzbein", "#a77a00"), bracket(0.94, 1.0, "Steißbein", "#a77a00")];
          sv.append(...B, s.el("text", { x: 20, y: 30, class: "lbl", style: { fill: "#5d6678" }, text: "hinten" }), s.el("text", { x: 400, y: 30, "text-anchor": "end", class: "lbl", style: { fill: "#5d6678" }, text: "vorne →" }));
          // straight rod for comparison
          const rod = s.el("g", { class: "later" }, s.el("rect", { x: 520, y: 70, width: 26, height: 470, rx: 8, fill: "#cfd5de", stroke: "#5d6678", "stroke-width": 3 }),
            s.el("text", { x: 533, y: 580, "text-anchor": "middle", class: "lbl", style: { fontWeight: 700 }, text: "gerader Stab" }));
          const bang = s.el("text", { x: 533, y: 56, "text-anchor": "middle", "font-size": 30, "font-weight": 800, fill: "#dc3b2a", opacity: 0, text: "Rums!" });
          sv.append(rod, bang);
          const hop = async () => {
            s.sfx.boing(); bang.setAttribute("opacity", 1); rod.classList.add("a-shake"); s.sfx.drum();
            await s.tween({ from: 0, to: 1, dur: 1400, update: t => draw(t < 0.3 ? Math.sin(t / 0.3 * Math.PI / 2) : Math.exp(-(t - 0.3) * 5) * Math.cos((t - 0.3) * 14)) });
            draw(0); bang.setAttribute("opacity", 0); rod.classList.remove("a-shake");
          };
          const btn = s.h("button", { class: "btn solid later", onclick: hop }, "Landen nach dem Sprung");
          const info = P(s, "Von der Seite gesehen: zweimal nach vorn, zweimal nach hinten gebogen.");
          const discCard = exb(s, "Bandscheiben", P(s, "Zwischen den Wirbeln liegen 23 <b>Bandscheiben</b> (blau). Sie sind weich und wirken wie <b>Stoßdämpfer</b>.", "small"));
          const m = merk(s, "Die <b>doppelte S-Form</b> federt Stöße ab – viel besser als ein gerader Stab.", true, 21);
          s.add(cols(s, 640, sv, stack(s, 14, info, discCard, s.h("div", { class: "row" }, btn), m), 22));
          s.show(sv, "fade"); s.sfx.pop();
          s.step(async () => { for (const b of B) { s.sfx.tick(); await s.show(b, "left"); } });
          s.step(async () => { s.sfx.pop(); await s.show(discCard, "up"); await s.tween({ from: 0, to: 1, dur: 700, update: v => discs.forEach(d => d.r.setAttribute("rx", 10 + Math.sin(v * Math.PI) * 6)) }); });
          s.step(async () => { s.sfx.swoosh(); await s.show(rod, "left"); s.show(btn, "up"); await hop(); s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Beuger und Strecker",
        say: "Muskeln können nur ziehen, nie schieben. Darum arbeiten sie als Gegenspieler: Der Bizeps beugt den Arm, der Trizeps streckt ihn.",
        build(s) {
          const sv = s.svg(520, 600);
          sv.append(s.el("rect", { x: 0, y: 0, width: 520, height: 600, rx: 16, fill: "#f2f1fd" }));
          const S = { x: 200, y: 110 }, E = { x: 200, y: 340 }, FL = 200;
          const scap = s.el("path", { d: "M150 70 L230 80 L200 170 Z", fill: BONE, stroke: BONES, "stroke-width": 3 });
          const hum = bone(s, S.x, S.y, E.x, E.y, 18);
          const fore = s.el("g");
          const tri = s.el("path", { stroke: "#9b2c22", "stroke-width": 2.5 }), bic = s.el("path", { stroke: "#9b2c22", "stroke-width": 2.5 });
          const tenB = s.el("path", { stroke: "#ddd3b8", "stroke-width": 6, fill: "none", "stroke-linecap": "round" }), tenT = s.el("path", { stroke: "#ddd3b8", "stroke-width": 6, fill: "none", "stroke-linecap": "round" });
          const lB = s.el("line", { stroke: MUS, "stroke-width": 2.5 }), lT = s.el("line", { stroke: MUS, "stroke-width": 2.5 }), lS = s.el("line", { stroke: "#8c7a55", "stroke-width": 2.5 });
          sv.append(scap, hum, fore, tri, bic, tenB, tenT, lB, lT, lS,
            s.el("text", { x: 300, y: 44, class: "lbl", style: { fontWeight: 700 }, text: "Bizeps – Beuger" }),
            s.el("text", { x: 14, y: 44, class: "lbl", style: { fontWeight: 700 }, text: "Trizeps – Strecker" }),
            s.el("text", { x: 340, y: 470, class: "lbl", style: { fontWeight: 700 }, text: "Sehne" }));
          const muscle = (A, B, b) => {
            const dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
            const a = { x: A.x + dx * 0.14, y: A.y + dy * 0.14 }, z = { x: B.x - dx * 0.2, y: B.y - dy * 0.2 };
            const q1 = { x: A.x + dx * 0.38, y: A.y + dy * 0.38 }, q2 = { x: A.x + dx * 0.62, y: A.y + dy * 0.62 };
            return { d: `M${a.x} ${a.y} C${q1.x + nx * b} ${q1.y + ny * b} ${q2.x + nx * b} ${q2.y + ny * b} ${z.x} ${z.y} C${q2.x - nx * b} ${q2.y - ny * b} ${q1.x - nx * b} ${q1.y - ny * b} ${a.x} ${a.y} Z`, a, z, mid: { x: (A.x + B.x) / 2 + nx * b * 0.5, y: (A.y + B.y) / 2 + ny * b * 0.5 } };
          };
          const geo = th => {
            const r = th * D2R, dir = { x: Math.sin(r), y: Math.cos(r) }, front = { x: Math.cos(r), y: -Math.sin(r) };
            const bi = { x: E.x + dir.x * 46 + front.x * 10, y: E.y + dir.y * 46 + front.y * 10 };
            const ol = { x: E.x - front.x * 20 - dir.x * 12, y: E.y - front.y * 20 - dir.y * 12 };
            return { dir, front, bi, ol };
          };
          const BO = { x: 222, y: 128 }, TO = { x: 180, y: 132 };
          let lb = [1e9, 0], lt = [1e9, 0];
          for (let th = 10; th <= 145; th += 5) { const g = geo(th); const b = Math.hypot(g.bi.x - BO.x, g.bi.y - BO.y), t = Math.hypot(g.ol.x - TO.x, g.ol.y - TO.y); lb = [Math.min(lb[0], b), Math.max(lb[1], b)]; lt = [Math.min(lt[0], t), Math.max(lt[1], t)]; }
          let prev = 20, active = "";
          const stateT = s.h("p", { class: "h2", style: { color: "var(--unit)", minHeight: "40px" } }, "Ziehe am Regler");
          const set = th => {
            const g = geo(th), H = { x: E.x + g.dir.x * FL, y: E.y + g.dir.y * FL };
            fore.replaceChildren(bone(s, E.x, E.y, H.x, H.y, 13), s.el("ellipse", { cx: E.x + g.dir.x * (FL + 26), cy: E.y + g.dir.y * (FL + 26), rx: 18, ry: 30, transform: `rotate(${-th} ${E.x + g.dir.x * (FL + 26)} ${E.y + g.dir.y * (FL + 26)})`, fill: SKIN, stroke: "#c98d60", "stroke-width": 3 }));
            const Lb = Math.hypot(g.bi.x - BO.x, g.bi.y - BO.y), Lt = Math.hypot(g.ol.x - TO.x, g.ol.y - TO.y);
            const bb = 12 + 34 * (1 - (Lb - lb[0]) / (lb[1] - lb[0])), bt = 12 + 24 * (1 - (Lt - lt[0]) / (lt[1] - lt[0]));
            const mB = muscle(BO, g.bi, bb), mT = muscle(TO, g.ol, -bt);
            bic.setAttribute("d", mB.d); tri.setAttribute("d", mT.d);
            tenB.setAttribute("d", `M${BO.x} ${BO.y} L${mB.a.x} ${mB.a.y} M${mB.z.x} ${mB.z.y} L${g.bi.x} ${g.bi.y}`);
            tenT.setAttribute("d", `M${TO.x} ${TO.y} L${mT.a.x} ${mT.a.y} M${mT.z.x} ${mT.z.y} L${g.ol.x} ${g.ol.y}`);
            const up = th > prev + 0.01, down = th < prev - 0.01;
            if (up) active = "b"; else if (down) active = "t";
            bic.setAttribute("fill", active === "b" ? MUS : MUSP); tri.setAttribute("fill", active === "t" ? MUS : MUSP);
            stateT.textContent = active === "b" ? "Beugen: Bizeps zieht" : active === "t" ? "Strecken: Trizeps zieht" : "Ziehe am Regler";
            const lbx = 360, lby = 50; lB.setAttribute("x1", lbx); lB.setAttribute("y1", lby); lB.setAttribute("x2", mB.mid.x); lB.setAttribute("y2", mB.mid.y);
            lT.setAttribute("x1", 100); lT.setAttribute("y1", 50); lT.setAttribute("x2", mT.mid.x); lT.setAttribute("y2", mT.mid.y);
            const tz = { x: (mB.z.x + g.bi.x) / 2, y: (mB.z.y + g.bi.y) / 2 };
            lS.setAttribute("x1", 360); lS.setAttribute("y1", 450); lS.setAttribute("x2", tz.x); lS.setAttribute("y2", tz.y);
            prev = th;
          };
          set(20); active = ""; set(20);
          const sl = s.slider({ label: "Arm beugen", min: 10, max: 145, value: 20, fmt: v => v + "°", onInput: v => set(v) });
          const run = async (a, b) => { await s.tween({ from: a, to: b, dur: 1600, ease: "inOut", update: v => { set(v); sl.input.value = v; } }); sl.set(Math.round(b)); };
          const bB = s.h("button", { class: "btn solid", onclick: async () => { s.sfx.whoosh(); await run(Number(sl.input.value), 140); } }, "Beugen");
          const bS = s.h("button", { class: "btn", onclick: async () => { s.sfx.swoosh(); await run(Number(sl.input.value), 12); } }, "Strecken");
          const m = merk(s, "Muskeln können nur <b>ziehen</b>. Darum arbeiten sie paarweise als <b>Gegenspieler</b>: Beuger und Strecker.", true, 21);
          const lf = life(s, "Mitmachen", P(s, "Lege eine Hand auf deinen Oberarm und beuge den anderen Arm: Der Bizeps wird dick und hart.", "small"));
          s.add(cols(s, 520, sv, stack(s, 14, stateT, sl, s.h("div", { class: "row" }, bB, bS), m, lf)));
          s.show(sv, "fade"); s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); await run(20, 140); s.say("Der Bizeps zieht sich zusammen und wird dick. Der Trizeps wird lang gezogen."); });
          s.step(async () => { s.sfx.swoosh(); await run(140, 12); s.say("Jetzt zieht der Trizeps. Der Bizeps wird wieder lang."); s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Sehnen: Seile zum Knochen",
        say: "Muskeln hängen mit Sehnen an den Knochen. Die Muskeln für deine Finger sitzen sogar im Unterarm und ziehen an langen Sehnen.",
        build(s) {
          const sv = s.svg(560, 420);
          sv.append(s.el("rect", { x: 0, y: 0, width: 560, height: 420, rx: 16, fill: "#f2f1fd" }));
          sv.append(s.el("path", { d: "M20 170 L330 180 L330 290 L20 300 Z", fill: SKIN, stroke: "#c98d60", "stroke-width": 3 }),
            bone(s, 30, 225, 320, 230, 10));
          const mus = s.el("ellipse", { cx: 150, cy: 262, rx: 90, ry: 16, fill: MUS, stroke: "#9b2c22", "stroke-width": 2.5 });
          const finger = s.el("path", { fill: SKIN, stroke: "#c98d60", "stroke-width": 3, "stroke-linejoin": "round" });
          const fb = s.el("g");
          const tendon = s.el("polyline", { fill: "none", stroke: "#ddd3b8", "stroke-width": 6, "stroke-linecap": "round", "stroke-linejoin": "round" });
          const tOut = s.el("polyline", { fill: "none", stroke: "#a8987a", "stroke-width": 9, "stroke-linecap": "round", "stroke-linejoin": "round" });
          sv.append(finger, fb, mus, tOut, tendon,
            s.el("text", { x: 60, y: 340, class: "lbl", style: { fontWeight: 700, fill: "#9b2c22" }, text: "Muskel im Unterarm" }),
            s.el("text", { x: 214, y: 120, class: "lbl", style: { fontWeight: 700, fill: "#7a6a4a" }, text: "Sehne" }), s.el("line", { x1: 244, y1: 128, x2: 296, y2: 256, stroke: "#7a6a4a", "stroke-width": 2.5 }),
            s.el("text", { x: 30, y: 150, class: "lbl", style: { fill: "#5d6678" }, text: "Unterarm" }), s.el("text", { x: 400, y: 150, class: "lbl", style: { fill: "#5d6678" }, text: "Finger" }));
          const SEG = [100, 64, 48];
          const set = v => {
            let x = 330, y = 235, a = 0; const pts = [[x, y]], und = [];
            SEG.forEach((L, i) => { const aa = a + v * 58 * D2R; und.push([x - Math.sin(aa) * 24, y + Math.cos(aa) * 24]); x += Math.cos(aa) * L; y += Math.sin(aa) * L; pts.push([x, y]); a = aa; });
            const up = pts.map(([px, py], i) => { const aa = Math.min(i + 1, SEG.length) * v * 58 * D2R; return [px + Math.sin(aa) * 22, py - Math.cos(aa) * 22]; });
            const dn = pts.map(([px, py], i) => { const aa = Math.min(i + 1, SEG.length) * v * 58 * D2R; return [px - Math.sin(aa) * 26, py + Math.cos(aa) * 26]; });
            finger.setAttribute("d", "M" + [...up, ...dn.reverse()].map(p => p.join(" ")).join(" L") + " Z");
            fb.replaceChildren(...SEG.map((L, i) => bone(s, pts[i][0] + 6 * Math.cos(i * v * 58 * D2R), pts[i][1] + 6 * Math.sin(i * v * 58 * D2R), pts[i + 1][0] - 6 * Math.cos((i + 1) * v * 58 * D2R), pts[i + 1][1] - 6 * Math.sin((i + 1) * v * 58 * D2R), 9)));
            const rx = 90 - v * 26, cx = 150 - v * 26;
            mus.setAttribute("rx", rx); mus.setAttribute("cx", cx); mus.setAttribute("ry", 16 + v * 12);
            const tp = [[cx + rx - 4, 262], [330, 262], ...und.slice(1).map(([px, py]) => [px, py]), [pts[3][0] - Math.cos(SEG.length * v * 58 * D2R) * 8 - Math.sin(SEG.length * v * 58 * D2R) * 14, pts[3][1] + Math.cos(SEG.length * v * 58 * D2R) * 14]];
            const ps = tp.map(p => p.join(",")).join(" ");
            tendon.setAttribute("points", ps); tOut.setAttribute("points", ps);
          };
          set(0);
          const sl = s.slider({ label: "Muskel zieht", min: 0, max: 100, value: 0, fmt: v => v + " %", onInput: v => set(v / 100) });
          const k = [
            exb(s, "Rund 650 Muskeln", P(s, "So viele Muskeln hat jeder Mensch. Sie hängen mit <b>Sehnen</b> an den Knochen – zäh wie Seile.", "small")),
            exb(s, "Die Achillessehne", P(s, "Sie verbindet die Wade mit der Ferse. Sie ist die <b>dickste und stärkste Sehne</b> des Körpers – sie fängt jeden Schritt ab.", "small")),
            life(s, "Mitmachen", P(s, "Mach langsam eine Faust und fühle dabei deinen Unterarm: Dort arbeiten die Fingermuskeln!", "small")),
          ];
          s.add(cols(s, 560, stack(s, 12, sv, sl), stack(s, 14, ...k)));
          s.show(sv, "fade"); s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); await s.tween({ from: 0, to: 1, dur: 1500, ease: "inOut", update: v => { set(v); sl.input.value = v * 100; } }); sl.set(100); s.sfx.snap(); await s.show(k[0], "up"); });
          s.step(async () => { s.sound("footsteps", { vol: 0.5, dur: 2 }); await s.show(k[1], "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(k[2], "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Schwimmen, kriechen, fliegen",
        say: "Tiere bewegen sich ganz verschieden. Der Fisch schlängelt im Wasser, die Schlange auf dem Boden und der Vogel schlägt mit den Flügeln.",
        build(s) {
          const W = 580, H = 560;
          const { canvas, g } = s.canvas(W, H);
          const on = [0, 0, 0];
          const lbl = (t, x, y) => { g.font = "700 20px 'Atkinson Hyperlegible'"; g.textAlign = "left"; g.fillStyle = "#1b2740"; g.fillText(t, x, y); };
          const body = (pts, wid, col, edge) => { // thick body along points (array of [x,y]) with tapering width
            for (let pass = 0; pass < 2; pass++) for (let i = 0; i < pts.length - 1; i++) { const w = wid(i / (pts.length - 1)); g.strokeStyle = pass ? col : edge; g.lineWidth = pass ? w : w + 4; g.lineCap = "round"; g.beginPath(); g.moveTo(pts[i][0], pts[i][1]); g.lineTo(pts[i + 1][0], pts[i + 1][1]); g.stroke(); }
          };
          s.loop(t => {
            g.fillStyle = "#e7f2fb"; g.fillRect(0, 0, W, 180);
            g.fillStyle = "#9cc9ee"; g.fillRect(0, 190, W, 180);
            g.fillStyle = "#c9b48a"; g.fillRect(0, 380, W, 180);
            g.fillStyle = "rgba(90,70,40,.25)"; for (let i = 0; i < 24; i++) { g.beginPath(); g.arc((i * 83) % W, 400 + (i * 37) % 150, 5 + (i % 3) * 3, 0, TAU); g.fill(); }
            lbl("Luft", 12, 28); lbl("Wasser (von oben)", 12, 214); lbl("Boden (von oben)", 12, 404);
            // bird (side view)
            if (on[2]) {
              const bx = ((t * 120 + 380) % (W + 160)) - 80, by = 100 + Math.sin(t * 2) * 10, fl = Math.sin(t * 9);
              g.fillStyle = "#5d6678"; g.beginPath(); g.ellipse(bx, by, 34, 15, 0, 0, TAU); g.fill();
              g.beginPath(); g.arc(bx + 34, by - 6, 11, 0, TAU); g.fill();
              g.fillStyle = "#ee7a1a"; g.beginPath(); g.moveTo(bx + 44, by - 8); g.lineTo(bx + 58, by - 4); g.lineTo(bx + 44, by - 1); g.fill();
              g.fillStyle = "#5d6678"; g.beginPath(); g.moveTo(bx - 30, by); g.lineTo(bx - 54, by - 8); g.lineTo(bx - 52, by + 8); g.fill();
              g.fillStyle = "#8a93a6"; g.beginPath(); g.moveTo(bx - 10, by - 4); g.quadraticCurveTo(bx - 4, by - 4 - 60 * fl, bx - 34, by - 70 * fl); g.lineTo(bx + 14, by - 4); g.fill();
            }
            // fish (top view), lateral wave
            if (on[0]) {
              const fx = ((t * 90 + 320) % (W + 200)) - 60, fy = 285, pts = [];
              for (let i = 0; i <= 14; i++) { const u = i / 14; pts.push([fx - i * 10, fy + Math.sin(t * 7 - i * 0.55) * 22 * Math.pow(u, 1.4)]); }
              body(pts, u => 28 * Math.sin(Math.PI * (0.15 + 0.8 * (1 - u))) + 4, "#7fb0d8", "#2f6a9a");
              const e = pts[14], e2 = pts[13]; const ang = Math.atan2(e[1] - e2[1], e[0] - e2[0]);
              g.fillStyle = "#7fb0d8"; g.strokeStyle = "#2f6a9a"; g.lineWidth = 2; g.beginPath(); g.moveTo(e[0], e[1]); g.lineTo(e[0] + Math.cos(ang + 0.6) * 26, e[1] + Math.sin(ang + 0.6) * 26); g.lineTo(e[0] + Math.cos(ang - 0.6) * 26, e[1] + Math.sin(ang - 0.6) * 26); g.closePath(); g.fill(); g.stroke();
              g.fillStyle = "#1b2740"; g.beginPath(); g.arc(pts[0][0] + 2, pts[0][1] - 8, 3, 0, TAU); g.arc(pts[0][0] + 2, pts[0][1] + 8, 3, 0, TAU); g.fill();
            }
            // snake (top view)
            if (on[1]) {
              const sx = ((t * 45 + 400) % (W + 320)) - 40, sy = 470, pts = [];
              for (let i = 0; i <= 30; i++) pts.push([sx - i * 10, sy + Math.sin(t * 2.2 - i * 0.32) * 34]);
              body(pts, u => 18 - u * 12, "#4a5a3a", "#24301c");
              g.fillStyle = "#f2d14a"; g.beginPath(); g.arc(pts[2][0], pts[2][1] - 9, 5, 0, TAU); g.arc(pts[2][0], pts[2][1] + 9, 5, 0, TAU); g.fill();
              g.fillStyle = "#24301c"; g.beginPath(); g.ellipse(pts[0][0] + 8, pts[0][1], 14, 11, 0, 0, TAU); g.fill();
            }
          });
          const C = [
            exb(s, "Fisch", P(s, "Muskeln links und rechts der Wirbelsäule ziehen abwechselnd. Der Körper schlängelt, die <b>Schwanzflosse</b> schiebt. Die anderen Flossen steuern.", "small")),
            exb(s, "Schlange", s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "12px", alignItems: "center" } }, s.photo("ringelnatter", { w: 150, h: 100, pos: "70% 50%", style: { flex: "none" } }),
              P(s, "200 bis 400 Wirbel, je mit einem Paar Rippen. Sie drückt sich an Steinen und Pflanzen ab.", "small"))),
            exb(s, "Vogel", P(s, "Kräftige Brustmuskeln ziehen die Flügel nach unten. Hohle, leichte Knochen helfen beim Fliegen.", "small")),
          ];
          const m = merk(s, "Der Körperbau passt zur Art der Fortbewegung.", true, 21);
          s.add(cols(s, 580, canvas, stack(s, 12, ...C, m), 20));
          s.show(canvas, "fade"); s.sfx.pop();
          s.step(async () => { on[0] = 1; s.sound("splash", { vol: 0.4 }); await s.show(C[0], "up"); });
          s.step(async () => { on[1] = 1; s.sfx.scribble(); await s.show(C[1], "up"); s.say("Eine Ringelnatter. Sie lebt auch in Berlin und Brandenburg und kann gut schwimmen."); });
          s.step(async () => { on[2] = 1; s.sound("birds", { vol: 0.4, dur: 2.5 }); await s.show(C[2], "up"); s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Das Pferd läuft auf einer Zehe",
        say: "Menschen laufen auf der ganzen Sohle, Katzen auf den Zehen. Das Pferd läuft nur auf der Spitze einer einzigen Zehe: dem Huf.",
        build(s) {
          const leg = (title, sub, pts, contact, hoof) => {
            const sv = s.svg(330, 250);
            sv.append(s.el("rect", { x: 0, y: 0, width: 330, height: 250, rx: 14, fill: "#f2f1fd" }), s.el("rect", { x: 0, y: 206, width: 330, height: 44, fill: "#c9b48a" }));
            const ct = s.el("ellipse", { cx: contact[0], cy: 206, rx: contact[1], ry: 8, fill: "#ffd94a", stroke: "#a77a00", "stroke-width": 2, class: "later" });
            sv.append(ct);
            for (let i = 0; i < pts.length - 1; i++) sv.append(bone(s, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], i === 0 ? 12 : 8));
            if (hoof) sv.append(s.el("path", { d: `M${hoof[0] - 16} 206 L${hoof[0] + 18} 206 L${hoof[0] + 8} ${hoof[1]} L${hoof[0] - 10} ${hoof[1]} Z`, fill: "#5d4a32", stroke: "#2c2218", "stroke-width": 2 }));
            sv.append(s.el("text", { x: 14, y: 30, class: "lbl", style: { fontWeight: 800, fill: UC }, text: title }));
            const c = s.h("div", { class: "stack later", style: { gap: "4px", width: "330px" } }, sv, P(s, sub, "small"));
            c.ct = ct; return c;
          };
          const L = [
            leg("Mensch, Bär", "<b>Sohlengänger</b>: ganzer Fuß am Boden", [[120, 40], [130, 150], [128, 196], [210, 200]], [168, 52]),
            leg("Katze, Hund", "<b>Zehengänger</b>: auf den Zehen", [[110, 40], [140, 120], [130, 160], [190, 196], [222, 200]], [206, 26]),
            leg("Pferd", "<b>Zehenspitzengänger</b>: auf dem Huf", [[130, 40], [150, 100], [140, 170], [168, 186]], [172, 22], [172, 186]),
          ];
          L[2].querySelector("svg").append(s.el("text", { x: 204, y: 186, class: "lbl", style: { fontWeight: 700, fill: "#5d4a32" }, text: "← Huf" }));
          const ph = s.h("div", { class: "later", style: { flex: "none" } }, s.photo("muybridge-pferd", { w: 470, h: 290, fit: "cover", pos: "50% 40%", caption: "Pferd im Galopp, 1878" }));
          const t1 = exb(s, "Foto-Experiment von 1878", P(s, "Eadweard Muybridge stellte 12 Kameras an eine Rennbahn. Das Pferd löste sie im Galopp selbst aus. Ergebnis: Kurz sind <b>alle vier Hufe in der Luft</b>!", "small"));
          const m = merk(s, "Die Pferde-Zehe ist die <b>Mittelzehe</b>. Der Huf ist aus Horn – wie ein dicker Zehennagel.", true, 21);
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%", justifyContent: "center" } },
            s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "20px", justifyContent: "center", alignItems: "flex-start" } }, ...L),
            s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "20px", alignItems: "center" } }, ph, stack(s, 12, t1, m))));
          s.sfx.pop();
          L.forEach((c, i) => s.step(async () => { i === 2 ? s.sound("pferd-galopp", { vol: 0.5, dur: 2 }) : s.sound("footsteps", { vol: 0.4, dur: 1.2 }); await s.show(c, "up"); s.sfx.pop(); await s.show(c.ct, "pop"); if (i === 2) { s.sfx.ding(); await s.show(m, "up"); } }));
          s.step(async () => { s.sound("pferd-galopp", { vol: 0.5 }); await s.show(ph, "zoom"); s.sfx.pop(); await s.show(t1, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Innen- oder Außenskelett?",
        say: "Wirbeltiere haben ein Innenskelett aus Knochen. Insekten tragen ihr Skelett außen, wie eine Ritterrüstung. Darum müssen sie sich häuten, wenn sie wachsen.",
        build(s) {
          const sv = s.svg(560, 330);
          sv.append(s.el("rect", { x: 0, y: 0, width: 560, height: 330, rx: 16, fill: "#f2f1fd" }), s.el("rect", { x: 0, y: 270, width: 560, height: 60, fill: "#c9b48a" }));
          const bug = (col, edge) => {
            const gg = s.el("g");
            [[-1, 0], [0, 0], [1, 0]].forEach(([i]) => gg.append(s.el("path", { d: `M${i * 18} 10 L${i * 26 - 10} 34 L${i * 34 - 14} 56`, stroke: edge, "stroke-width": 5, fill: "none", "stroke-linecap": "round" })));
            gg.append(s.el("ellipse", { cx: -70, cy: 0, rx: 56, ry: 26, fill: col, stroke: edge, "stroke-width": 3 }), s.el("ellipse", { cx: 0, cy: -2, rx: 30, ry: 22, fill: col, stroke: edge, "stroke-width": 3 }),
              s.el("ellipse", { cx: 46, cy: -6, rx: 20, ry: 18, fill: col, stroke: edge, "stroke-width": 3 }), s.el("circle", { cx: 54, cy: -12, r: 4, fill: "#1b2740" }),
              s.el("path", { d: "M58 -20 Q80 -60 104 -64", stroke: edge, "stroke-width": 3, fill: "none" }),
              ...[-100, -80, -60, -40].map(x => s.el("line", { x1: x, y1: -22, x2: x, y2: 22, stroke: edge, "stroke-width": 1.5, opacity: .6 })));
            return gg;
          };
          const old = bug("#b98a4a", "#6b4a20"), neu = bug("#e9f0b8", "#8a9a50");
          old.setAttribute("transform", "translate(190 214)"); neu.setAttribute("transform", "translate(190 214)"); neu.setAttribute("opacity", 0);
          const crack = s.el("path", { d: "M110 186 L140 194 L170 186 L200 194 L230 186", stroke: "#1b2740", "stroke-width": 3, fill: "none", class: "later" });
          const cap = s.el("text", { x: 280, y: 306, "text-anchor": "middle", class: "lbl", style: { fontWeight: 700, fill: "#5d3a10" }, text: "Panzer aus Chitin" });
          sv.append(old, crack, neu, cap);
          let busy = false;
          const molt = async () => {
            if (busy) return; busy = true;
            neu.setAttribute("opacity", 0); neu.setAttribute("transform", "translate(190 214)"); old.setAttribute("opacity", 1); cap.textContent = "Der Panzer wird zu eng …";
            s.sfx.zap(); await s.tween({ from: 0, to: 1, dur: 500, update: v => old.setAttribute("transform", `translate(190 214) scale(${1 + Math.sin(v * Math.PI * 6) * 0.015})`) });
            s.sfx.snap(); await s.show(crack, "draw"); cap.textContent = "Er platzt am Rücken auf.";
            s.sfx.whoosh();
            await s.tween({ from: 0, to: 1, dur: 1800, ease: "out", update: v => { neu.setAttribute("opacity", Math.min(1, v * 3)); neu.setAttribute("transform", `translate(${190 + v * 240} ${214 - Math.sin(v * Math.PI) * 30}) scale(${1 + v * 0.15})`); old.setAttribute("opacity", 1 - v * 0.45); } });
            cap.textContent = "Neue, weiche Haut – sie wird erst hart.";
            await s.tween({ from: 0, to: 1, dur: 1400, update: v => { const c1 = [233, 240, 184], c2 = [185, 138, 74]; neu.querySelectorAll("ellipse").forEach(e => e.setAttribute("fill", `rgb(${c1.map((c, i) => Math.round(c + (c2[i] - c) * v)).join(",")})`)); } });
            s.sfx.success(); cap.textContent = "Größer – mit neuem Panzer."; busy = false;
          };
          const reset = () => { if (busy) return; neu.querySelectorAll("ellipse").forEach(e => e.setAttribute("fill", "#e9f0b8")); s.hide(crack); molt(); };
          const btn = s.h("button", { class: "btn solid", onclick: reset }, "Häutung zeigen");
          const ci = exb(s, "Innenskelett", P(s, "<b>Wirbeltiere</b>: Knochen innen, Muskeln außen herum. Das Skelett wächst mit.", "small"));
          const ca = exb(s, "Außenskelett", P(s, "<b>Insekten, Spinnen, Krebse</b>: ein harter Panzer aus <b>Chitin</b>. Er schützt und hält Wasser im Körper. Die Muskeln sitzen innen.", "small"));
          const photo = s.h("div", { class: "later" }, s.photo("zikade-haeutung", { w: 250, h: 300, pos: "50% 45%", caption: "Zikade nach der Häutung" }));
          const m = merk(s, "Ein Außenskelett wächst nicht mit. Darum <b>häuten</b> sich Insekten, wenn sie wachsen.", true, 21);
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "560px 1fr", gap: "22px", alignItems: "center", height: "100%" } },
            stack(s, 12, sv, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "14px", alignItems: "center" } }, btn), m),
            s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "14px", alignItems: "flex-start" } }, stack(s, 12, ci, ca), photo)));
          s.show(sv, "fade"); s.sfx.pop();
          s.step(async () => { s.sfx.pop(); await s.show(ci, "up"); s.sfx.zap(); await s.show(ca, "up"); });
          s.step(async () => { await molt(); s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sound("camera-shutter"); await s.show(photo, "zoom"); s.say("Rechts hängt die alte, leere Hülle. Daneben sitzt die frisch gehäutete Zikade."); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Was eine Kraft bewirkt",
        say: "Eine Kraft kann einen Körper in Bewegung setzen, ihn bremsen, seine Richtung ändern oder ihn verformen. Die Kraft selbst sieht man nicht, nur ihre Wirkung.",
        build(s) {
          const W = 600, H = 380, GY = 320;
          const { canvas, g } = s.canvas(W, H);
          const st = { bx: 150, by: GY - 26, sx: 1, sy: 1, boot: -200, bootY: GY - 20, glove: -1, head: 0, arrow: null };
          s.loop(() => {
            g.fillStyle = "#e7f2fb"; g.fillRect(0, 0, W, GY); g.fillStyle = "#7cbf5a"; g.fillRect(0, GY, W, H - GY);
            g.strokeStyle = "rgba(255,255,255,.6)"; g.lineWidth = 3; for (let x = 60; x < W; x += 120) { g.beginPath(); g.moveTo(x, GY + 10); g.lineTo(x - 20, H); g.stroke(); }
            if (st.head) { g.fillStyle = SKIN; g.strokeStyle = "#c98d60"; g.lineWidth = 3; g.beginPath(); g.arc(380, 120, 34, 0, TAU); g.fill(); g.stroke(); g.fillStyle = "#5a3a1a"; g.beginPath(); g.arc(380, 108, 34, Math.PI, TAU); g.fill(); g.fillStyle = "#0f766e"; g.fillRect(352, 156, 56, 90); }
            if (st.glove >= 0) { g.fillStyle = "#ffd94a"; g.strokeStyle = "#a77a00"; g.lineWidth = 3; g.beginPath(); g.roundRect(st.glove, GY - 90, 40, 70, 14); g.fill(); g.stroke(); }
            // ball
            g.save(); g.translate(st.bx, st.by); g.scale(st.sx, st.sy);
            g.fillStyle = "#fff"; g.strokeStyle = "#1b2740"; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 26, 0, TAU); g.fill(); g.stroke();
            g.fillStyle = "#1b2740"; g.beginPath(); for (let i = 0; i < 5; i++) { const a = i / 5 * TAU - Math.PI / 2; g.lineTo(Math.cos(a) * 9, Math.sin(a) * 9); } g.fill();
            g.restore();
            // boot
            g.save(); g.translate(st.boot, st.bootY); g.fillStyle = "#1b2740"; g.beginPath(); g.ellipse(0, 0, 34, 16, 0, 0, TAU); g.fill(); g.fillRect(-32, -60, 26, 56); g.restore();
            if (st.arrow) { const [x, y, dx, dy] = st.arrow; g.strokeStyle = "#dc3b2a"; g.fillStyle = "#dc3b2a"; g.lineWidth = 7; g.beginPath(); g.moveTo(x, y); g.lineTo(x + dx, y + dy); g.stroke(); const a = Math.atan2(dy, dx); g.beginPath(); g.moveTo(x + dx + Math.cos(a) * 14, y + dy + Math.sin(a) * 14); g.lineTo(x + dx + Math.cos(a + 2.4) * 18, y + dy + Math.sin(a + 2.4) * 18); g.lineTo(x + dx + Math.cos(a - 2.4) * 18, y + dy + Math.sin(a - 2.4) * 18); g.fill(); }
          });
          const reset = () => Object.assign(st, { bx: 150, by: GY - 26, sx: 1, sy: 1, boot: -200, glove: -1, head: 0, arrow: null });
          const lab = s.h("p", { class: "h2", style: { color: "var(--unit)", minHeight: "40px" } }, "Tippe auf eine Wirkung");
          let busy = false;
          const S = {
            start: async () => { reset(); lab.textContent = "In Bewegung setzen"; await s.tween({ from: -200, to: 100, dur: 500, ease: "in", update: v => st.boot = v }); s.sound("ball-kick", { vol: 0.6 }); st.arrow = [130, GY - 26, 60, 0]; await s.tween({ from: 150, to: 560, dur: 1300, ease: "out", update: v => { st.bx = v; if (v > 230) st.arrow = null; st.boot = Math.max(-200, 100 - (v - 150)); } }); },
            stop: async () => { reset(); st.glove = 110; lab.textContent = "Abbremsen"; await s.tween({ from: 640, to: 176, dur: 1000, ease: "linear", update: v => st.bx = v }); s.sfx.snap(); st.arrow = [210, GY - 70, 50, 0]; await s.wait(700); st.arrow = null; },
            turn: async () => { reset(); st.head = 1; lab.textContent = "Richtung ändern"; await s.tween({ from: 0, to: 1, dur: 900, ease: "linear", update: v => { st.bx = 40 + v * 316; st.by = GY - 26 - v * 200; } }); s.sfx.boing(); st.arrow = [340, 96, -40, -50]; await s.tween({ from: 0, to: 1, dur: 800, ease: "out", update: v => { st.bx = 356 - v * 300; st.by = 94 - v * 60; if (v > 0.4) st.arrow = null; } }); },
            form: async () => { reset(); st.bx = 300; lab.textContent = "Verformen (Zeitlupe)"; await s.tween({ from: -200, to: 240, dur: 600, ease: "in", update: v => st.boot = v }); s.sound("ball-kick", { vol: 0.5 }); st.arrow = [250, GY - 26, 50, 0];
              await s.tween({ from: 0, to: 1, dur: 900, ease: "inOut", update: v => { const q = Math.sin(v * Math.PI); st.sx = 1 - q * 0.35; st.sy = 1 + q * 0.2; st.bx = 300 + q * 0; st.boot = 240 + q * 30; } });
              st.arrow = null; await s.tween({ from: 300, to: 580, dur: 700, ease: "out", update: v => st.bx = v }); },
          };
          const N = [["start", "In Bewegung setzen"], ["stop", "Abbremsen"], ["turn", "Richtung ändern"], ["form", "Verformen"]];
          const btns = N.map(([k, t]) => s.h("button", { class: "btn later", onclick: async () => { if (busy) return; busy = true; s.sfx.click(); await S[k](); busy = false; } }, t));
          const m = merk(s, "Eine Kraft kann die <b>Bewegung</b> oder die <b>Form</b> eines Körpers ändern. Kräfte sieht man nicht – nur ihre Wirkung.", true, 21);
          const lf = life(s, "Noch mehr Beispiele", P(s, "Knete drücken, Fahrrad bremsen, Trampolin springen, ein Gummiband dehnen.", "small"));
          s.add(cols(s, 600, canvas, stack(s, 12, lab, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" } }, ...btns), m, lf), 20));
          s.show(canvas, "fade"); s.sfx.pop();
          N.forEach(([k], i) => s.step(async () => { busy = true; s.show(btns[i], "pop"); await S[k](); busy = false; if (i === 3) { s.sfx.ding(); await s.show(m, "up"); } }));
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Kräfte als Pfeile: Tauziehen",
        say: "Eine Kraft zeichnet man als Pfeil. Die Länge zeigt, wie stark sie ist, die Spitze zeigt die Richtung. Probiere das Tauziehen aus.",
        build(s) {
          const sv = s.svg(620, 330);
          sv.append(s.el("rect", { x: 0, y: 0, width: 620, height: 330, rx: 16, fill: "#f2f1fd" }), s.el("rect", { x: 0, y: 270, width: 620, height: 60, fill: "#7cbf5a" }),
            s.el("line", { x1: 310, y1: 200, x2: 310, y2: 290, stroke: "#fff", "stroke-width": 4, "stroke-dasharray": "8 6" }));
          const world = s.el("g");
          const kid = (x, dir, col) => { const k = stick(s, col); k.append(s.el("circle", { cx: x - dir * 18, cy: 150, r: 16, fill: col, stroke: "none" }), s.el("path", { d: `M${x - dir * 14} 168 L${x} 220 L${x + dir * 22} 268 M${x} 220 L${x - dir * 16} 268 M${x - dir * 8} 186 L${x + dir * 40} 204` })); return k; };
          const rope = s.el("line", { x1: 60, y1: 204, x2: 560, y2: 204, stroke: "#a0703a", "stroke-width": 7 });
          const flag = s.el("path", { d: "M310 204 L300 236 L320 236 Z", fill: "#dc3b2a" });
          world.append(rope, kid(110, -1, "#1d5bd0"), kid(70, -1, "#1d5bd0"), kid(510, 1, "#ee7a1a"), kid(550, 1, "#ee7a1a"), flag);
          const aL = s.el("g"), aR = s.el("g");
          sv.append(world, aL, aR);
          const arrow = (gg, x, y, dx, col, label) => { gg.replaceChildren(); if (Math.abs(dx) < 2) return; const d = Math.sign(dx);
            gg.append(s.el("line", { x1: x, y1: y, x2: x + dx - d * 14, y2: y, stroke: col, "stroke-width": 8 }), s.el("path", { d: `M${x + dx} ${y} L${x + dx - d * 22} ${y - 13} L${x + dx - d * 22} ${y + 13} Z`, fill: col }), s.el("circle", { cx: x, cy: y, r: 7, fill: col }),
              s.el("text", { x: x + dx / 2, y: y - 18, "text-anchor": "middle", class: "lbl", style: { fontWeight: 700, fill: col }, text: label })); };
          let FL = 5, FR = 5, off = 0, won = false;
          const res = s.h("p", { class: "h2", style: { color: "var(--unit)", minHeight: "40px" } }, "Gleich stark: nichts bewegt sich");
          s.loop((t, dt) => {
            const d = Math.min(dt || 0.016, 0.05);
            if (!won) off = clamp(off + (FR - FL) * d * 9, -130, 130);
            if (Math.abs(off) >= 130 && !won) { won = true; s.sfx.fanfare(); res.textContent = (off < 0 ? "Blau" : "Orange") + " gewinnt!"; }
            world.setAttribute("transform", `translate(${off} 0)`);
            const cx = 310 + off;
            arrow(aL, cx, 90, -FL * 22, "#1d5bd0", FL + " N"); arrow(aR, cx, 90, FR * 22, "#ee7a1a", FR + " N");
            if (!won) res.textContent = FL === FR ? "Gleich stark: nichts bewegt sich" : (FL > FR ? "Blau" : "Orange") + " zieht stärker";
          });
          const sL = s.slider({ label: "Blau zieht", min: 0, max: 10, value: 5, fmt: v => v + " N", onInput: v => { FL = v; } });
          const sR = s.slider({ label: "Orange zieht", min: 0, max: 10, value: 5, fmt: v => v + " N", onInput: v => { FR = v; } });
          const again = s.h("button", { class: "btn", onclick: () => { off = 0; won = false; s.sfx.whoosh(); } }, "Neu starten");
          const ex = s.svg(420, 130);
          ex.append(s.el("line", { x1: 40, y1: 70, x2: 330, y2: 70, stroke: UC, "stroke-width": 8 }), s.el("path", { d: "M360 70 L330 54 L330 86 Z", fill: UC }), s.el("circle", { cx: 40, cy: 70, r: 9, fill: UC }),
            s.el("text", { x: 20, y: 110, class: "lbl", style: { fontSize: "19px" }, text: "Angriffspunkt" }), s.el("text", { x: 405, y: 110, "text-anchor": "end", class: "lbl", style: { fontSize: "19px" }, text: "Spitze: Richtung" }),
            s.el("text", { x: 195, y: 40, "text-anchor": "middle", class: "lbl", style: { fontSize: "19px", fontWeight: 700 }, text: "Länge: wie stark" }));
          const exW = s.h("div", { class: "card later", style: { padding: "8px 12px" } }, ex);
          const lf = life(s, "Ziehen und drücken", P(s, "<b>Ziehen</b>: Schublade öffnen, Hund an der Leine. <b>Drücken</b>: Einkaufswagen schieben, Klingelknopf, Tür aufstoßen.", "small"));
          const m = merk(s, "Zwei gleich starke Kräfte in <b>entgegengesetzte</b> Richtungen heben sich auf.", true, 21);
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "620px 1fr", gap: "20px", alignItems: "center", height: "100%" } },
            stack(s, 10, sv, res, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" } }, sL, sR), s.h("div", { class: "row" }, again)), stack(s, 12, exW, lf, m)));
          s.show(sv, "fade"); s.sfx.pop();
          s.step(async () => { s.sfx.scribble(); await s.show(exW, "up"); });
          s.step(async () => { FL = 3; sL.set(3); FR = 7; sR.set(7); s.sfx.whoosh(); await s.wait(1600); s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Gewichtskraft messen",
        say: "Die Erde zieht alles zu sich hin. Das ist die Gewichtskraft. Wir messen sie mit dem Federkraftmesser in Newton. Eine Tafel Schokolade wiegt hundert Gramm und zieht mit etwa einem Newton.",
        build(s) {
          const sv = s.svg(330, 600);
          sv.append(s.el("rect", { x: 0, y: 0, width: 330, height: 600, rx: 16, fill: "#f2f1fd" }), s.el("rect", { x: 40, y: 12, width: 250, height: 14, rx: 7, fill: "#8a93a6" }));
          const Z = 80, PX = 36; // y of 0 N, px per N
          sv.append(s.el("rect", { x: 112, y: 40, width: 106, height: Z + PX * 10 - 30, rx: 14, fill: "#fff", stroke: "#5d6678", "stroke-width": 3 }), s.el("path", { d: "M165 26 L165 44", stroke: "#5d6678", "stroke-width": 5 }));
          for (let n = 0; n <= 10; n++) { const y = Z + n * PX; sv.append(s.el("line", { x1: 112, y1: y, x2: 132, y2: y, stroke: "#1b2740", "stroke-width": 2 }), s.el("text", { x: 104, y: y + 7, "text-anchor": "end", class: "lbl", style: { fontSize: "19px" }, text: n })); }
          sv.append(s.el("text", { x: 60, y: 76, "text-anchor": "middle", class: "lbl", style: { fontWeight: 700 }, text: "N" }));
          const spring = s.el("polyline", { fill: "none", stroke: "#1d5bd0", "stroke-width": 4, "stroke-linejoin": "round" });
          const pointer = s.el("g", null, s.el("rect", { x: 128, y: -6, width: 76, height: 12, rx: 4, fill: "#dc3b2a" }));
          const rod = s.el("line", { x1: 165, x2: 165, stroke: "#5d6678", "stroke-width": 5 });
          const hook = s.el("path", { fill: "none", stroke: "#5d6678", "stroke-width": 5 });
          const load = s.el("g");
          sv.append(spring, rod, pointer, hook, load);
          let F = 0;
          const set = f => {
            F = f; const y = Z + f * PX;
            const pts = []; const top = 44, n = 16; for (let i = 0; i <= n; i++) { const yy = top + (y - top) * i / n; pts.push(`${i === 0 || i === n ? 165 : 165 + (i % 2 ? -24 : 24)},${yy}`); }
            spring.setAttribute("points", pts.join(" ")); pointer.setAttribute("transform", `translate(0 ${y})`);
            const hy = y + 70; rod.setAttribute("y1", y + 6); rod.setAttribute("y2", hy); hook.setAttribute("d", `M165 ${hy} L165 ${hy + 10} Q165 ${hy + 26} 180 ${hy + 22}`);
            load.setAttribute("transform", `translate(0 ${y})`);
          };
          const OBJ = { schoko: ["🍫", "Tafel Schokolade", 100], apfel: ["🍎", "Apfel", 200], milch: ["🥛", "1 l Milch", 1000] };
          let cur = null, moon = false;
          const read = s.h("p", { class: "huge mono", style: { color: "var(--unit)", fontSize: "64px" } }, "0 N");
          const what = s.h("p", { class: "t", style: { minHeight: "34px" } }, "Hänge etwas an den Haken.");
          const hang = async k => {
            cur = k; const [e, n, gram] = OBJ[k]; const to = gram / 1000 * 9.81 / (moon ? 6 : 1);
            load.replaceChildren(s.el("text", { x: 165, y: 150, "text-anchor": "middle", "font-size": 54, text: e }));
            s.sfx.pop(); const from = F;
            await s.tween({ from: 0, to: 1, dur: 1200, ease: "elastic", update: v => set(from + (to - from) * v) });
            read.textContent = "≈ " + s.fmt(to, to < 1.5 ? 1 : 0) + " N"; what.textContent = n + " (" + s.fmt(gram) + " g)" + (moon ? " auf dem Mond" : ""); s.sfx.ding();
          };
          set(0);
          const B = Object.keys(OBJ).map(k => s.h("button", { class: "btn later", onclick: () => hang(k) }, OBJ[k][0] + " " + OBJ[k][1]));
          const mb = s.h("button", { class: "btn later", onclick: () => { moon = !moon; mb.textContent = moon ? "🌍 Zurück zur Erde" : "🌕 Auf dem Mond"; s.sfx.zap(); if (cur) hang(cur); } }, "🌕 Auf dem Mond");
          const m = merk(s, "Kräfte misst man in <b>Newton (N)</b>. Eine Tafel Schokolade (100&nbsp;g) zieht mit etwa <b>1 N</b> nach unten.", true, 21);
          const moonT = exb(s, "Auf dem Mond", P(s, "Der Mond zieht nur etwa <b>ein Sechstel</b> so stark wie die Erde. Die Feder dehnt sich weniger.", "small"));
          const ph = s.h("div", { class: "later", style: { flex: "none" } }, s.photo("federwaage", { w: 110, h: 390, fit: "contain", caption: "" }));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "330px 1fr 120px", gap: "20px", alignItems: "center", height: "100%" } },
            sv, stack(s, 12, read, what, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" } }, ...B, mb), m, moonT), ph));
          s.show(sv, "fade"); s.sfx.pop();
          s.step(async () => { s.show(B[0], "pop"); await hang("schoko"); s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.show(B[1], "pop"); s.show(B[2], "pop"); await hang("milch"); s.say("Ein Liter Milch wiegt etwa ein Kilogramm. Er zieht mit fast zehn Newton."); });
          s.step(async () => { s.show(mb, "pop"); moon = true; mb.textContent = "🌍 Zurück zur Erde"; s.sfx.zap(); await hang("milch"); await s.show(moonT, "up"); });
          s.step(async () => { s.sound("camera-shutter"); await s.show(ph, "zoom"); s.say("So sieht ein Federkraftmesser in echt aus. Man nennt ihn auch Federwaage."); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Reibung: Eis gegen Teppich",
        say: "Reibung bremst Bewegungen. Auf glattem Eis rutscht ein Klotz weit, auf rauem Teppich bleibt er schnell stehen.",
        build(s) {
          const W = 600, H = 400;
          const { canvas, g } = s.canvas(W, H);
          const LN = [["Eis", "#dff1fb", 160], ["Holzboden", "#e3c08d", 600], ["Teppich", "#c7a3d6", 1500]];
          const blk = LN.map(() => ({ x: 40, v: 0, done: true }));
          s.loop((t, dt) => {
            const d = Math.min(dt || 0.016, 0.05);
            LN.forEach(([n, col, a], i) => {
              const y = 20 + i * 128;
              g.fillStyle = col; g.fillRect(0, y, W, 110);
              if (i === 2) { g.fillStyle = "rgba(90,40,110,.25)"; for (let k = 0; k < 120; k++) g.fillRect((k * 53) % W, y + (k * 29) % 106, 3, 4); }
              if (i === 1) { g.strokeStyle = "rgba(120,70,20,.35)"; g.lineWidth = 2; for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(0, y + 10 + k * 18); g.lineTo(W, y + 14 + k * 18); g.stroke(); } }
              if (i === 0) { g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 2; for (let k = 0; k < 8; k++) { g.beginPath(); g.moveTo(40 + k * 70, y + 20 + (k % 3) * 25); g.lineTo(80 + k * 70, y + 30 + (k % 3) * 25); g.stroke(); } }
              g.font = "700 20px 'Atkinson Hyperlegible'"; g.fillStyle = "#1b2740"; g.textAlign = "left"; g.fillText(n, 12, y + 28);
              const b = blk[i];
              if (!b.done) { b.v = Math.max(0, b.v - a * d); b.x += b.v * d; if (b.x > W - 70) { b.x = W - 70; b.v = 0; } if (b.v === 0) { b.done = true; s.sfx.tick(); } }
              g.fillStyle = "#0f766e"; g.strokeStyle = "#1b2740"; g.lineWidth = 3; g.beginPath(); g.roundRect(b.x, y + 46, 56, 52, 8); g.fill(); g.stroke();
              if (b.v > 0 && i > 0) { g.fillStyle = "rgba(220,59,42,.8)"; for (let k = 0; k < 3; k++) { g.beginPath(); g.arc(b.x - 6 - k * 10, y + 98 - (k % 2) * 6, 3, 0, TAU); g.fill(); } }
            });
          });
          const push = () => { blk.forEach(b => { b.x = 40; b.v = 420; b.done = false; }); s.sfx.whoosh(); };
          const btn = s.h("button", { class: "btn solid", onclick: push }, "Gleich stark anstoßen");
          const m = merk(s, "<b>Reibung</b> bremst. Glatte Flächen: wenig Reibung. Raue Flächen: viel Reibung.", true, 21);
          const lf = life(s, "Im Alltag: Reibung hilft!", s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "12px", alignItems: "center" } }, s.photo("eisbahn", { w: 150, h: 110, style: { flex: "none" } }),
            P(s, "Profil an Schuhen und Reifen, Sand auf Glatteis, Fahrradbremsen. Ohne Reibung könntest du nicht einmal laufen.", "small")));
          const warm = exb(s, "Mitmachen", P(s, "Reibe deine Hände schnell aneinander: Sie werden warm. Reibung macht Wärme.", "small"));
          s.add(cols(s, 600, stack(s, 12, canvas, s.h("div", { class: "row" }, btn)), stack(s, 14, m, lf, warm)));
          s.show(canvas, "fade"); s.sfx.pop();
          s.step(async () => { push(); await s.wait(2200); s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
          s.step(async () => { s.sfx.scribble(); await s.show(warm, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Den Ranzen richtig tragen",
        say: "Wie du den Ranzen trägst, ist wichtiger als jedes Gramm. Beide Gurte, eng am Rücken und nicht zu tief.",
        build(s) {
          const sv = s.svg(480, 560);
          sv.append(s.el("rect", { x: 0, y: 0, width: 480, height: 560, rx: 16, fill: "#f2f1fd" }), s.el("rect", { x: 0, y: 520, width: 480, height: 40, fill: "#c9b48a" }));
          const body = s.el("g");
          const bag = s.el("g");
          const strap = s.el("path", { fill: "none", stroke: "#1b2740", "stroke-width": 6 });
          sv.append(bag, body, strap);
          const marks = s.el("g", { opacity: 0 }, s.el("text", { x: 300, y: 120, class: "lbl", style: { fontWeight: 800, fill: "#dc3b2a", fontSize: "26px" }, text: "✗ krumm" }));
          const good = s.el("g", { opacity: 0 }, s.el("text", { x: 300, y: 120, class: "lbl", style: { fontWeight: 800, fill: "#138a5a", fontSize: "26px" }, text: "✓ aufrecht" }));
          sv.append(marks, good);
          const draw = q => { // q 0 = falsch, 1 = richtig
            const lean = (1 - q) * 14, hx = 250 + lean * 2.2;
            const hip = { x: 240, y: 330 }, sh = { x: 240 + lean * 1.4, y: 170 };
            body.replaceChildren(
              s.el("path", { d: `M${hip.x} ${hip.y} L${hip.x + 10} 430 L${hip.x + 4} 520 M${hip.x} ${hip.y} L${hip.x - 14} 430 L${hip.x - 22} 520`, stroke: "#1d5bd0", "stroke-width": 26, fill: "none", "stroke-linecap": "round" }),
              s.el("path", { d: `M${hip.x} ${hip.y} Q${hip.x + lean * 0.5} 250 ${sh.x} ${sh.y}`, stroke: "#ee7a1a", "stroke-width": 50, fill: "none", "stroke-linecap": "round" }),
              s.el("circle", { cx: hx, cy: 110 + lean * 0.6, r: 38, fill: SKIN, stroke: "#c98d60", "stroke-width": 3 }),
              s.el("path", { d: `M${sh.x + 6} ${sh.y + 14} L${sh.x + 30} 260 L${sh.x + 60} 300`, stroke: SKIN, "stroke-width": 16, fill: "none", "stroke-linecap": "round" }));
            const bx = 150 - (1 - q) * 20, by = 180 + (1 - q) * 120, bh = 150;
            bag.replaceChildren(s.el("rect", { x: bx - 40 + q * 18, y: by, width: 80, height: bh, rx: 16, fill: "#dc3b2a", stroke: "#8a1f14", "stroke-width": 3, transform: `rotate(${(1 - q) * -12} ${bx} ${by})` }),
              s.el("rect", { x: bx - 26 + q * 18, y: by + 40, width: 52, height: 40, rx: 8, fill: "#f2b8b0", transform: `rotate(${(1 - q) * -12} ${bx} ${by})` }));
            strap.setAttribute("d", q > 0.5 ? `M${bx + 30} ${by + 4} Q${sh.x - 10} ${sh.y - 30} ${sh.x + 20} ${sh.y + 10} L${sh.x + 10} ${by + 120} L${bx + 34} ${by + bh - 10}` : `M${bx + 30} ${by + 4} Q${sh.x - 30} ${sh.y - 40} ${sh.x + 16} ${sh.y + 6}`);
            marks.setAttribute("opacity", q < 0.3 ? 1 : 0); good.setAttribute("opacity", q > 0.7 ? 1 : 0);
          };
          draw(0);
          let q = 0;
          const to = async v => { const a = q; await s.tween({ from: a, to: v, dur: 1000, ease: "inOut", update: x => { q = x; draw(x); } }); };
          const bW = s.h("button", { class: "btn", onclick: async () => { s.sfx.error(); await to(0); } }, "Falsch getragen");
          const bR = s.h("button", { class: "btn solid", onclick: async () => { s.sfx.success(); await to(1); } }, "Richtig getragen");
          const tips = exb(s, "So geht's", s.h("div", { class: "stack", style: { gap: "4px" } },
            P(s, "1. Immer <b>beide Gurte</b> benutzen.", "small"), P(s, "2. Ranzen <b>eng</b> am Rücken, nicht unter dem Po.", "small"),
            P(s, "3. Schwere Bücher <b>nah an den Rücken</b>.", "small"), P(s, "4. Nur einpacken, was du heute brauchst.", "small")));
          const fact = exb(s, "Wie schwer darf er sein?", P(s, "Lange galt: höchstens ein Zehntel deines Gewichts. Forscher der Uni Saarbrücken fanden: Etwas mehr schadet gesunden Kindern nicht. Über 10 kg wird es aber zu viel.", "small"));
          s.add(cols(s, 480, sv, stack(s, 12, s.h("div", { class: "row", style: { gap: "12px" } }, bW, bR), tips, fact)));
          s.show(sv, "fade"); s.sfx.error();
          s.step(async () => { s.sfx.success(); await to(1); await s.show(tips, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(fact, "up"); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Im Alltag: Aufwärmen und Sport",
        say: "Vor dem Sport wärmst du dich auf. Dann werden die Muskeln warm und gut durchblutet, und die Gelenke machen mehr Gelenkschmiere.",
        build(s) {
          const W = 520, H = 420;
          const { canvas, g } = s.canvas(W, H);
          let warm = 0;
          const dots = Array.from({ length: 26 }, (_, i) => ({ p: i / 26, y: (i * 37) % 60 - 30 }));
          s.loop((t, dt) => {
            const d = Math.min(dt || 0.016, 0.05);
            g.fillStyle = "#f2f1fd"; g.fillRect(0, 0, W, H);
            // muscle
            const r = Math.round(232 - warm * 15), gg = Math.round(170 - warm * 100), b = Math.round(160 - warm * 100);
            g.fillStyle = `rgb(${r},${gg},${b})`; g.strokeStyle = "#9b2c22"; g.lineWidth = 3;
            g.beginPath(); g.ellipse(230, 130, 190, 62, 0, 0, TAU); g.fill(); g.stroke();
            g.strokeStyle = "rgba(155,44,34,.35)"; g.lineWidth = 2; for (let k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(60, 130 + k * 18); g.quadraticCurveTo(230, 130 + k * 26, 400, 130 + k * 18); g.stroke(); }
            // blood dots
            const n = Math.round(8 + warm * 18);
            dots.forEach((o, i) => { if (i >= n) return; o.p = (o.p + d * (0.08 + warm * 0.3)) % 1; const x = 60 + o.p * 340, y = 130 + o.y * Math.sin(o.p * Math.PI); g.fillStyle = "#b3121f"; g.beginPath(); g.arc(x, y, 6, 0, TAU); g.fill(); });
            g.font = "700 20px 'Atkinson Hyperlegible'"; g.fillStyle = "#1b2740"; g.textAlign = "left"; g.fillText("Muskel: Blut fließt", 40, 228);
            // joint
            g.fillStyle = BONE; g.strokeStyle = BONES; g.lineWidth = 3;
            g.beginPath(); g.arc(150, 330, 46, 0, TAU); g.fill(); g.stroke();
            g.beginPath(); g.moveTo(80, 390); g.lineTo(98, 384); g.arc(150, 330, 56, 2.4, 0.74, true); g.lineTo(220, 390); g.lineTo(200, H); g.lineTo(100, H); g.closePath(); g.fill(); g.stroke();
            g.strokeStyle = `rgba(230,170,0,${0.25 + warm * 0.7})`; g.lineWidth = 4 + warm * 8; g.beginPath(); g.arc(150, 330, 51, 0.74, 2.4); g.stroke();
            g.fillStyle = "#1b2740"; g.fillText("Gelenk: mehr Schmiere", 220, 340);
            // thermometer
            g.fillStyle = "#fff"; g.strokeStyle = "#1b2740"; g.lineWidth = 3; g.beginPath(); g.roundRect(462, 20, 26, 230, 13); g.fill(); g.stroke();
            g.beginPath(); g.arc(475, 262, 22, 0, TAU); g.fillStyle = "#dc3b2a"; g.fill(); g.stroke();
            const hh = 60 + warm * 150; g.fillStyle = "#dc3b2a"; g.fillRect(467, 250 - hh, 16, hh + 4);
            g.textAlign = "right"; g.fillStyle = "#1b2740"; g.fillText(warm < 0.5 ? "kühl" : "warm", 450, 40);
          });
          const btn = s.h("button", { class: "btn solid", onclick: async () => { s.sound("whistle", { vol: 0.5 }); const a = warm; await s.tween({ from: a, to: a > 0.5 ? 0 : 1, dur: 3000, update: v => { warm = v; } }); s.sfx.ding(); } }, "Aufwärmen");
          const A = exb(s, "Was beim Aufwärmen passiert", s.h("div", { class: "stack", style: { gap: "4px" } },
            P(s, "• Muskeln werden <b>wärmer</b> und dehnbarer.", "small"), P(s, "• Mehr <b>Blut</b> bringt mehr Sauerstoff.", "small"), P(s, "• Gelenke bilden mehr <b>Gelenkschmiere</b>, der Knorpel federt besser.", "small"),
            P(s, "So verletzt du dich seltener.", "small")));
          const B = life(s, "Beispiele", P(s, "Fußballtraining: erst einlaufen, Hampelmann, Arme kreisen. Schwimmen: Arme und Schultern lockern. Schulsport: Fangspiele zum Start.", "small"));
          const m = merk(s, "Bewegung stärkt auch die <b>Knochen</b>: Springen, Rennen und Ballspiele machen sie fester.", true, 21);
          s.add(cols(s, 520, stack(s, 12, canvas, s.h("div", { class: "row" }, btn)), stack(s, 12, A, B, m)));
          s.show(canvas, "fade"); s.sfx.pop();
          s.step(async () => { s.sound("whistle", { vol: 0.5 }); s.show(A, "up"); await s.tween({ from: 0, to: 1, dur: 3000, update: v => { warm = v; } }); s.sfx.ding(); });
          s.step(async () => { s.sound("kids-cheer", { vol: 0.4, dur: 2 }); await s.show(B, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
    ],
  });
})();
