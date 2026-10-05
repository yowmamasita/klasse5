/* Kapitel 12 – Strom und Stromkreis (RLP NaWi 5/6, Themenfeld 3.9 „Technik – Bewegung, Kraft und Energie“ / Elektrizität).
   Strom im Alltag, geschlossener Stromkreis, Fehler (Lücke, Kurzschluss), Taschenlampe, Schaltzeichen, Schaltplan,
   Leiter und Isolatoren (→ Kap. 3), Reihen- und Parallelschaltung, Wohnung, UND-/ODER-Schaltung, Elektromagnet,
   Sicherheit (230 V, Schuko, Bahn 15.000 V / S-Bahn 750 V, Gewitter), Stromquellen, Spannungen, Strom sparen.
   Fakten geprüft (Quellen im Bericht): DB, Wikipedia, UBA, Destatis, DGUV u. a. */
(() => {
  const UC = "#4338ca";
  const WIRE = "#1b2740";
  const YEL = "#ffd94a";

  /* ---------- helpers (as in u9) ---------- */
  const P = (s, html, cls = "t", hidden = false) => s.h("p", { class: cls + (hidden ? " later" : ""), html });
  const life = (s, label, ...kids) => s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, label), ...kids);
  const exb = (s, label, ...kids) => s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, label), ...kids);
  const merk = (s, html, hidden = true, size = 22) => s.h("div", { class: "merk" + (hidden ? " later" : ""), style: { fontSize: size + "px" }, html });
  const stack = (s, gap, ...kids) => s.h("div", { class: "stack", style: { gap: gap + "px" } }, ...kids);
  const cols = (s, lw, left, right, gap = 24) =>
    s.h("div", { class: "cols", style: { gridTemplateColumns: lw + "px 1fr", gap: gap + "px", alignItems: "center", height: "100%" } }, left, right);
  const T = (s, x, y, text, o = {}) => s.el("text", Object.assign({ x, y, "text-anchor": o.anchor || "middle", class: o.cls || "lbl", text },
    o.fill ? { fill: o.fill } : {}, o.size ? { style: { fontSize: o.size + "px", fontWeight: o.weight || 700 } } : { style: { fontWeight: 700 } }));
  const later = el => { el.classList.add("later"); return el; };
  const wire = (s, d, extra = {}) => s.el("path", Object.assign({ d, fill: "none", stroke: WIRE, "stroke-width": 5, "stroke-linejoin": "round", "stroke-linecap": "round" }, extra));

  /* ---------- circuit parts ---------- */
  /** Schaltzeichen Lampe (circle with X). glow k = brightness 0..1 */
  function symLamp(s, cx, cy, r = 24) {
    const glow = s.el("circle", { cx, cy, r: r * 2.2, fill: YEL, opacity: 0 });
    const c = s.el("circle", { cx, cy, r, fill: "#fff", stroke: WIRE, "stroke-width": 4 });
    const d = r * 0.707;
    const x = s.el("path", { d: `M${cx - d},${cy - d} L${cx + d},${cy + d} M${cx + d},${cy - d} L${cx - d},${cy + d}`, stroke: WIRE, "stroke-width": 3.5 });
    const g = s.el("g", null, glow, c, x);
    return { g, glow, set(k) { glow.setAttribute("opacity", k ? 0.6 * k : 0); c.setAttribute("fill", k ? (k > 0.7 ? "#fff07a" : "#fff7c2") : "#fff"); }, fade(o) { g.setAttribute("opacity", o); } };
  }
  /** Schaltzeichen Batterie on a vertical wire: long thin plate (+) above, short thick plate (−) below */
  function symBat(s, x, y, labels = true) {
    const g = s.el("g", null,
      s.el("line", { x1: x - 26, y1: y - 8, x2: x + 26, y2: y - 8, stroke: WIRE, "stroke-width": 4 }),
      s.el("line", { x1: x - 13, y1: y + 8, x2: x + 13, y2: y + 8, stroke: WIRE, "stroke-width": 10 }));
    if (labels) g.append(T(s, x + 38, y - 10, "+", { size: 26, fill: "#dc3b2a" }), T(s, x + 38, y + 30, "−", { size: 26, fill: "#1d5bd0" }));
    return g;
  }
  /** Schaltzeichen Schalter from pivot (x1,y1) to contact (x2,y2); open = rotated by openAng degrees */
  function symSwitch(s, x1, y1, x2, y2, openAng = -30, closed = false) {
    const lever = s.el("line", { x1, y1, x2, y2, stroke: WIRE, "stroke-width": 5, "stroke-linecap": "round" });
    const g = s.el("g", null, lever, s.el("circle", { cx: x1, cy: y1, r: 6, fill: WIRE }), s.el("circle", { cx: x2, cy: y2, r: 6, fill: "#fff", stroke: WIRE, "stroke-width": 3 }));
    let ang = closed ? 0 : openAng;
    const apply = a => lever.setAttribute("transform", `rotate(${a} ${x1} ${y1})`);
    apply(ang);
    return {
      g, get closed() { return ang === 0; },
      set(c) { const from = ang, to = c ? 0 : openAng; ang = to; return s.tween({ from, to, dur: 260, ease: "out", update: apply }); },
    };
  }
  /** realistic light bulb sitting on a holder; wires attach at (cx-30, cy+35) and (cx+30, cy+35) */
  function bulb(s, cx, cy, r = 32, broken = false) {
    const glow = s.el("circle", { cx, cy, r: r * 2.2, fill: YEL, opacity: 0 });
    const glass = s.el("circle", { cx, cy, r, fill: "#fffbe6", stroke: WIRE, "stroke-width": 4 });
    const fil = broken
      ? s.el("path", { d: `M${cx - 12},${cy + 14} l3,-14 l4,8 M${cx + 1},${cy - 4} l4,8 l3,-12 l3,18`, fill: "none", stroke: "#8a5a2b", "stroke-width": 3 })
      : s.el("path", { d: `M${cx - 12},${cy + 14} l3,-18 l5,12 l5,-12 l5,12 l3,6`, fill: "none", stroke: "#8a5a2b", "stroke-width": 3 });
    const base = s.el("rect", { x: cx - 18, y: cy + r - 4, width: 36, height: 16, rx: 3, fill: "#9ca3af", stroke: WIRE, "stroke-width": 2 });
    const holder = s.el("rect", { x: cx - 32, y: cy + r + 10, width: 64, height: 16, rx: 4, fill: "#e5e7eb", stroke: WIRE, "stroke-width": 2.5 });
    const g = s.el("g", null, glow, glass, fil, base, holder);
    return { g, set(k) { glow.setAttribute("opacity", k ? 0.6 * k : 0); glass.setAttribute("fill", k ? "#fff4a8" : "#fffbe6"); } };
  }
  /** round cell standing upright, + on top. top pole at (x, y-6), bottom pole at (x, y+h) */
  function cell(s, x, y, w = 70, h = 130, label = "") {
    const g = s.el("g", null,
      s.el("rect", { x: x - w / 2, y, width: w, height: h, rx: 10, fill: "#1d5bd0" }),
      s.el("rect", { x: x - w / 2, y, width: w, height: h * 0.36, rx: 10, fill: "#dc3b2a" }),
      s.el("rect", { x: x - 13, y: y - 9, width: 26, height: 11, rx: 3, fill: "#5d6678" }),
      T(s, x, y + h * 0.27, "+", { fill: "#fff", size: 28 }), T(s, x, y + h * 0.8, "−", { fill: "#fff", size: 30 }));
    if (label) g.append(T(s, x, y + h * 0.58, label, { fill: "#fff", size: 19 }));
    return g;
  }
  /** moving electrons along paths. list: [{d, on: () => 0 (off) | 1 (flow) | 2 (stuck), speed, n, ac}] */
  function flows(s, svg, list) {
    list.forEach(f => {
      f.p = s.el("path", { d: f.d, fill: "none", stroke: "none" }); svg.append(f.p); f.len = 0;
      f.dots = [];
    });
    const mk = f => {
      try { f.len = f.p.getTotalLength(); } catch (e) { f.len = 0; }
      if (!f.len) return;
      const n = f.n || Math.max(6, Math.round(f.len / 46));
      for (let i = 0; i < n; i++) { const c = s.el("circle", { r: 5.5, fill: YEL, stroke: "#b7791f", "stroke-width": 1.5, opacity: 0 }); svg.append(c); f.dots.push(c); }
    };
    s.loop(t => {
      list.forEach(f => {
        if (!f.len) mk(f);
        if (!f.len) return;
        const st = f.on();
        f.dots.forEach((d, i) => {
          d.setAttribute("opacity", st ? 1 : 0);
          if (!st) return;
          const base = (i * f.len) / f.dots.length;
          let pos = base;
          if (st === 1) pos = f.ac ? base + Math.sin(t * Math.PI * 2 * 0.9) * 14 : base + t * (f.speed || 70);
          const q = f.p.getPointAtLength(((pos % f.len) + f.len) % f.len);
          d.setAttribute("cx", q.x); d.setAttribute("cy", q.y);
        });
      });
    });
  }
  /** the realistic circuit of slide 2 (viewBox 600×560). returns {svg, set(closed), sw} */
  function realCircuit(s, { w = 600, labels = true, onToggle } = {}) {
    const svg = s.svg(600, 560, { width: w, height: Math.round(w * 560 / 600) });
    svg.append(wire(s, "M95,226 V130 H268"), wire(s, "M332,130 H520 V470 H370"), wire(s, "M250,470 H95 V392"));
    svg.append(cell(s, 95, 240, 76, 150, "4,5 V"));
    const lamp = bulb(s, 300, 74, 32);
    svg.append(lamp.g);
    // switch: base plate, contacts at 250 and 370
    svg.append(s.el("rect", { x: 226, y: 480, width: 168, height: 22, rx: 6, fill: "#d6c7a1", stroke: "#8a6a3a", "stroke-width": 2.5 }));
    const lever = s.el("rect", { x: 244, y: 463, width: 132, height: 13, rx: 6, fill: "#9ca3af", stroke: WIRE, "stroke-width": 2.5 });
    const knob = s.el("rect", { x: 352, y: 446, width: 22, height: 26, rx: 6, fill: "#dc3b2a", stroke: WIRE, "stroke-width": 2 });
    const lev = s.el("g", null, lever, knob);
    svg.append(lev, s.el("circle", { cx: 250, cy: 470, r: 8, fill: WIRE }), s.el("circle", { cx: 370, cy: 470, r: 8, fill: "#fff", stroke: WIRE, "stroke-width": 3 }));
    let closed = false, ang = -28;
    const apply = a => lev.setAttribute("transform", `rotate(${a} 250 470)`);
    apply(ang);
    if (labels) svg.append(T(s, 150, 320, "Batterie", { anchor: "start" }), T(s, 372, 60, "Lampe", { anchor: "start" }), T(s, 310, 540, "Schalter"), T(s, 532, 300, "Kabel", { anchor: "start" }));
    flows(s, svg, [{ d: "M95,392 V470 H520 V130 H95 V226", on: () => (closed ? 1 : 0) }]);
    const hit = s.el("rect", { x: 210, y: 410, width: 200, height: 100, fill: "transparent", style: { cursor: "pointer" } });
    svg.append(hit);
    const api = {
      svg, get closed() { return closed; },
      async set(c) {
        const from = ang; ang = c ? 0 : -28; closed = false; lamp.set(0);
        s.sound("lichtschalter", { vol: 0.7 });
        await s.tween({ from, to: ang, dur: 260, ease: "out", update: apply });
        closed = c; lamp.set(c ? 1 : 0);
        if (onToggle) onToggle(c);
      },
    };
    hit.addEventListener("click", () => api.set(!closed));
    return api;
  }
  /** simple toggle button whose label follows a state */
  const tbtn = (s, label, onclick, solid = false) => s.h("button", { class: "btn" + (solid ? " solid" : ""), onclick }, label);

  /** yellow warning triangle with lightning bolt */
  function warnSign(s, size = 96) {
    const v = s.svg(100, 90, { width: size, height: size * 0.9, style: { flex: "none" } });
    v.append(s.el("path", { d: "M50,6 L95,84 H5 Z", fill: "#ffd94a", stroke: "#1b2740", "stroke-width": 6, "stroke-linejoin": "round" }),
      s.el("path", { d: "M56,26 L38,56 H50 L42,76 L64,46 H52 Z", fill: "#1b2740" }));
    return v;
  }

  Deck.unit({
    id: "u12", num: 12, title: "Strom und Stromkreis", color: UC, soft: "#e8e7fb",
    subtitle: "Wie Strom fließt – und warum du vorsichtig sein musst",
    blurb: "Stromkreis, Schaltplan, Reihe und parallel, Magnet, Sicherheit",
    goals: [
      "Den geschlossenen Stromkreis verstehen",
      "Schaltzeichen kennen und Schaltpläne zeichnen",
      "Reihen-, Parallel-, UND- und ODER-Schaltung erklären",
      "Wissen, wie ein Elektromagnet funktioniert",
      "Gefahren kennen: Steckdose, Bahn und Gewitter",
    ],
    icon(svg, el) {
      svg.append(
        el("circle", { cx: 35, cy: 28, r: 20, fill: "#fff3a0", stroke: UC, "stroke-width": 3 }),
        el("rect", { x: 27, y: 46, width: 16, height: 12, rx: 2, fill: "#9ca3af", stroke: UC, "stroke-width": 2 }),
        el("path", { d: "M38,12 L28,30 H36 L31,44 L44,24 H36 Z", fill: UC }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Wo steckt Strom drin?",
        say: "Strom ist überall. Elektrogeräte machen aus Strom Licht, Wärme, Bewegung oder Ton und Bild. Tippe auf ein Gerät.",
        build(s) {
          const C = [
            ["Licht", "#b07800", [["💡", "Deckenlampe"], ["🔦", "Taschenlampe"], ["🚦", "Ampel"]]],
            ["Wärme", "#dc3b2a", [["🫖", "Wasserkocher"], ["🍳", "Elektroherd"], ["🍞", "Toaster"]]],
            ["Bewegung", "#138a5a", [["🚇", "U-Bahn"], ["🚋", "Straßenbahn"], ["🌀", "Ventilator"]]],
            ["Ton und Bild", "#7b4fd6", [["📺", "Fernseher"], ["📱", "Handy"], ["🔊", "Lautsprecher"]]],
          ];
          const snd = [() => s.sfx.ding(), () => s.sfx.whoosh(), () => s.sfx.zap(), () => s.sfx.chord([0, 4, 7])];
          const colsEl = C.map(([cat, col, items], ci) => s.h("div", { class: "card later stack", style: { gap: "10px", padding: "14px 16px" } },
            s.h("p", { class: "h2", style: { color: col, fontSize: "26px" } }, "→ " + cat),
            ...items.map(([e, n]) => {
              const em = s.h("span", { style: { fontSize: "40px", lineHeight: "1", display: "inline-block" } }, e);
              const b = s.h("button", { class: "btn", style: { justifyContent: "flex-start", gap: "10px", padding: "0 12px", borderColor: "var(--line)", color: "var(--ink)", width: "100%", minHeight: "64px", fontSize: "20px" },
                onclick: () => { snd[ci](); em.classList.remove("a-bounce"); void em.offsetWidth; em.classList.add("a-bounce"); b.style.background = "var(--unit-soft)"; } }, em, s.h("span", null, n));
              return b;
            })));
          const intro = P(s, "Ein Elektrogerät macht aus Strom etwas anderes:");
          const m = merk(s, "Strom ist eine Form von <b>Energie</b>. Elektrogeräte wandeln sie um: in <b>Licht</b>, <b>Wärme</b>, <b>Bewegung</b>, <b>Ton</b> und <b>Bild</b>.", true, 21);
          const lf = life(s, "Im Alltag in Berlin", P(s, "U-Bahn, S-Bahn und Straßenbahn fahren mit Strom. Und zu Hause: Zähl mal, wie viele Geräte einen Stecker oder einen Akku haben!", "small"));
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%", justifyContent: "center" } }, intro,
            s.h("div", { class: "cols4", style: { gap: "14px", gridTemplateColumns: "repeat(4, minmax(0, 1fr))" } }, ...colsEl),
            s.h("div", { class: "cols", style: { gridTemplateColumns: "1.1fr 1fr", gap: "16px" } }, m, lf)));
          s.sfx.pop();
          s.step(async () => { for (let i = 0; i < 2; i++) { snd[i](); await s.show(colsEl[i], "up"); } s.say("Lampen machen Licht. Wasserkocher und Herd machen Wärme."); });
          s.step(async () => { for (let i = 2; i < 4; i++) { snd[i](); await s.show(colsEl[i], "up"); } s.say("Motoren machen Bewegung. Fernseher und Handy machen Ton und Bild."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sound("ubahn-train", { vol: 0.4, dur: 3 }); await s.show(lf, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Der geschlossene Stromkreis",
        say: "Batterie, Kabel, Lampe und Schalter bilden einen Stromkreis. Tippe auf den Schalter. Nur wenn der Kreis geschlossen ist, leuchtet die Lampe.",
        build(s) {
          const status = s.h("p", { class: "h2", style: { color: "var(--red)", minHeight: "72px" } }, "Schalter offen: Die Lampe ist aus.");
          const rc = realCircuit(s, {
            w: 560,
            onToggle: c => { status.textContent = c ? "Schalter zu: Der Kreis ist geschlossen. Die Lampe leuchtet!" : "Schalter offen: Die Lampe ist aus."; status.style.color = c ? "var(--green)" : "var(--red)"; if (c) s.sfx.success(); },
          });
          const btn = tbtn(s, "Schalter drücken", () => rc.set(!rc.closed), true);
          const parts = P(s, "<b>Batterie</b> + <b>Kabel</b> + <b>Lampe</b> + <b>Schalter</b> = ein Stromkreis.");
          const e = exb(s, "Was fließt da?", P(s, "Im Metall der Kabel wandern winzige Teilchen: die <b>Elektronen</b> (gelb). Sie kommen aus dem <b>Minuspol</b> und fließen durch die Lampe zum <b>Pluspol</b>.", "small"));
          const m = merk(s, "Strom fließt nur in einem <b>geschlossenen Stromkreis</b>. Der Schalter öffnet und schließt den Kreis.", true, 21);
          s.add(cols(s, 560, rc.svg, stack(s, 14, parts, status, s.h("div", { class: "row" }, btn), m, e)));
          s.show(rc.svg, "fade"); s.sfx.pop();
          s.step(async () => { await rc.set(true); s.say("Der Kreis ist geschlossen. Die Elektronen fließen und die Lampe leuchtet."); });
          s.step(async () => { await rc.set(false); s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(e, "up"); await rc.set(true); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Warum leuchtet sie nicht?",
        say: "Drei Stromkreise, in denen die Lampe nicht leuchtet. Schau genau hin, was jeweils passiert.",
        build(s) {
          const mini = (kind) => {
            const v = s.svg(320, 240);
            const lamp = bulb(s, 160, 34, 20, kind === "kaputt");
            // lamp holder: wires attach at y=60
            if (kind === "luecke") v.append(wire(s, "M50,82 V60 H140"), wire(s, "M180,60 H280 V210 H190"), wire(s, "M130,210 H50 V178"));
            else v.append(wire(s, "M50,82 V60 H140"), wire(s, "M180,60 H280 V210 H50 V178"));
            const short = wire(s, "M50,70 H12 V200 H50", { stroke: "#dc3b2a", class: "later" });
            if (kind === "kurz") v.append(short);
            v.append(cell(s, 50, 90, 44, 82), lamp.g);
            if (kind === "luecke") v.append(s.el("circle", { cx: 160, cy: 210, r: 26, fill: "none", stroke: "#dc3b2a", "stroke-width": 4, "stroke-dasharray": "6 5" }));
            if (kind === "kaputt") v.append(s.el("circle", { cx: 160, cy: 30, r: 30, fill: "none", stroke: "#dc3b2a", "stroke-width": 4, "stroke-dasharray": "6 5" }));
            let st = 0;
            const fl = kind === "kurz" ? [{ d: "M50,178 V200 H12 V70 H50 V82", on: () => st, speed: 230, n: 8 }]
              : kind === "luecke" ? [{ d: "M50,178 V210 H126", on: () => st, n: 3 }, { d: "M194,210 H280 V60 H50 V82", on: () => st, n: 11 }]
              : [{ d: "M50,178 V210 H280 V60 H50 V82", on: () => st, n: 14 }];
            flows(s, v, fl);
            return { v, short, go(x) { st = x; } };
          };
          const K = [
            ["luecke", "1 · Lücke im Kabel", "Ein Kabel ist ab. Der Kreis ist <b>offen</b>: Die Elektronen kommen nicht weiter."],
            ["kurz", "2 · Kurzschluss", "Ein Draht verbindet Plus und Minus direkt. Der Strom nimmt den kurzen Weg <b>an der Lampe vorbei</b>. Draht und Batterie werden heiß – gefährlich!"],
            ["kaputt", "3 · Glühdraht durchgebrannt", "Der dünne Draht in der Lampe ist gerissen. Auch das ist eine <b>Lücke</b> im Kreis."],
          ];
          const minis = K.map(([k]) => mini(k));
          const cards = K.map(([, t, txt], i) => s.h("div", { class: "card later stack", style: { gap: "6px", padding: "12px 14px", alignItems: "center" } },
            s.h("p", { class: "t", style: { fontWeight: 700, color: "var(--unit)" } }, t), minis[i].v, P(s, txt, "small")));
          const m = merk(s, "Die Lampe leuchtet nur, wenn der Kreis <b>überall geschlossen</b> ist: vom Minuspol durch die Lampe zum Pluspol.", true, 21);
          s.add(s.h("div", { class: "stack", style: { gap: "16px", height: "100%", justifyContent: "center" } }, s.h("div", { class: "cols3", style: { gap: "16px" } }, ...cards), m));
          s.sfx.pop();
          s.step(async () => { s.sfx.error(); minis[0].go(2); await s.show(cards[0], "up"); s.say("Durch eine Lücke kommt kein Strom."); });
          s.step(async () => {
            s.show(cards[1], "up"); await s.wait(400); s.sfx.zap(); await s.show(minis[1].short, "draw"); minis[1].go(1); s.sound("strom-summen", { vol: 0.5 });
            s.say("Kurzschluss! Der Strom nimmt den kürzesten Weg. Das kann sogar einen Brand auslösen.");
          });
          s.step(async () => { s.sfx.snap(); await s.show(cards[2], "up"); minis[2].go(2); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Die Taschenlampe von innen",
        say: "Eine Taschenlampe ist ein Stromkreis in einem Rohr. Drei Batterien liegen hintereinander. Schalte sie ein.",
        build(s) {
          const v = s.svg(1060, 300);
          // light beam
          const beam = s.el("path", { d: "M940,60 L1060,10 V250 L940,200 Z", fill: YEL, opacity: 0 });
          v.append(beam);
          // tube + head
          v.append(s.el("rect", { x: 30, y: 60, width: 770, height: 140, rx: 20, fill: "#e5e7eb", stroke: WIRE, "stroke-width": 4 }),
            s.el("path", { d: "M800,60 L940,30 V230 L800,200 Z", fill: "#d1d5db", stroke: WIRE, "stroke-width": 4 }),
            s.el("path", { d: "M820,100 L930,48 M820,160 L930,212", stroke: "#9ca3af", "stroke-width": 4 }));
          // spring
          v.append(s.el("path", { d: "M46,130 l8,-28 l8,56 l8,-56 l8,56 l8,-56 l8,56 l8,-28 H122", fill: "none", stroke: "#6b7280", "stroke-width": 4 }));
          // batteries (+ to the right)
          [130, 335, 540].forEach(x => {
            v.append(s.el("rect", { x, y: 95, width: 190, height: 70, rx: 10, fill: "#1d5bd0" }), s.el("rect", { x: x + 120, y: 95, width: 70, height: 70, rx: 10, fill: "#dc3b2a" }),
              s.el("rect", { x: x + 190, y: 117, width: 12, height: 26, rx: 3, fill: "#5d6678" }),
              T(s, x + 154, 140, "+", { fill: "#fff", size: 28 }), T(s, x + 22, 141, "−", { fill: "#fff", size: 30 }), T(s, x + 75, 138, "1,5 V", { fill: "#fff", size: 21 }));
          });
          // lamp
          const lampGlow = s.el("circle", { cx: 860, cy: 130, r: 60, fill: YEL, opacity: 0 });
          const glass = s.el("circle", { cx: 860, cy: 130, r: 24, fill: "#fffbe6", stroke: WIRE, "stroke-width": 3 });
          v.append(lampGlow, s.el("rect", { x: 752, y: 116, width: 86, height: 28, rx: 4, fill: "#9ca3af", stroke: WIRE, "stroke-width": 2 }), glass,
            s.el("path", { d: "M850,138 l3,-14 l4,10 l4,-10 l3,14", fill: "none", stroke: "#8a5a2b", "stroke-width": 2.5 }));
          // contact strip with switch gap 700..740
          v.append(wire(s, "M50,130 V78 H700", { stroke: "#b45309", "stroke-width": 6 }), wire(s, "M740,78 H800 V116", { stroke: "#b45309", "stroke-width": 6 }));
          const bridge = s.el("rect", { x: 676, y: 72, width: 44, height: 12, rx: 3, fill: "#b45309" });
          const knob = s.el("rect", { x: 680, y: 40, width: 36, height: 22, rx: 6, fill: "#dc3b2a", stroke: WIRE, "stroke-width": 2 });
          const sw = s.el("g", null, bridge, knob); v.append(sw);
          let on = false;
          flows(s, v, [{ d: "M128,130 H50 V78 H800 V116 L800,130 H754", on: () => (on ? 1 : 0), n: 18 }]);
          // labels
          const labs = [[84, 240, "Feder"], [435, 240, "3 Batterien hintereinander: 4,5 V"], [720, 26, "Schalter"], [870, 262, "Lampe und Spiegel"]].map(([x, y, t]) => later(T(s, x, y, t)));
          v.append(...labs);
          const set = async c => {
            s.sound("lichtschalter", { vol: 0.7 });
            await s.tween({ from: c ? 0 : 20, to: c ? 20 : 0, dur: 250, ease: "out", update: d => sw.setAttribute("transform", `translate(${d},0)`) });
            on = c; beam.setAttribute("opacity", c ? 0.45 : 0); lampGlow.setAttribute("opacity", c ? 0.6 : 0); glass.setAttribute("fill", c ? "#fff4a8" : "#fffbe6");
            btn.textContent = c ? "Ausschalten" : "Einschalten";
          };
          const btn = tbtn(s, "Einschalten", () => set(!on), true);
          const m = merk(s, "Eine Taschenlampe ist ein <b>Stromkreis im Rohr</b>. Statt Kabeln leiten Metallstreifen und eine Feder.", true, 21);
          const e = exb(s, "Rechnen mit Volt", P(s, "Drei Batterien hintereinander: <b>1,5&nbsp;V + 1,5&nbsp;V + 1,5&nbsp;V = 4,5&nbsp;V</b>. Die Spannungen zählen zusammen.", "small"));
          const lf = life(s, "Im Alltag", P(s, "Fahrradlicht, Fernbedienung, Spielzeugauto: Überall steckt ein kleiner Stromkreis.", "small"));
          s.add(s.h("div", { class: "stack", style: { gap: "16px", height: "100%", justifyContent: "center" } }, v,
            s.h("div", { style: { display: "grid", gridTemplateColumns: "auto 1.25fr 1fr 1fr", gap: "16px", alignItems: "start" } }, btn, m, e, lf)));
          s.show(v, "fade"); s.sfx.pop();
          s.step(async () => { for (const l of labs) { s.sfx.pop(); await s.show(l, "pop"); } });
          s.step(async () => { await set(true); s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.count(3); await s.show(e, "up"); s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Schaltzeichen",
        say: "Fachleute zeichnen Stromkreise mit einfachen Zeichen: den Schaltzeichen. Tippe auf eine Karte, dann wechselt das Bild.",
        build(s) {
          const mk = (name, txt, real, sym) => {
            const v = s.svg(300, 130);
            const gr = s.el("g"), gs = s.el("g", { opacity: 0 });
            real(v, gr); sym(v, gs); v.append(gr, gs);
            let isSym = false;
            const flip = async () => {
              isSym = !isSym; s.sfx.swoosh();
              await s.tween({ from: 0, to: 1, dur: 450, update: t => { const k = isSym ? t : 1 - t; gr.setAttribute("opacity", 1 - k); gs.setAttribute("opacity", k); } });
            };
            const card = s.h("div", { class: "card later stack", style: { gap: "4px", padding: "10px 14px", alignItems: "center", cursor: "pointer", textAlign: "center" }, onclick: () => flip() },
              v, s.h("b", { style: { fontSize: "23px" } }, name), P(s, txt, "small"));
            return { card, flip, get isSym() { return isSym; } };
          };
          const ln = (x1, y1, x2, y2, w = 5) => s.el("line", { x1, y1, x2, y2, stroke: WIRE, "stroke-width": w, "stroke-linecap": "round" });
          const C = [
            mk("Leitung", "ein Kabel", (v, g) => g.append(s.el("path", { d: "M40,65 C90,20 130,110 180,60 S240,40 260,65", fill: "none", stroke: "#dc3b2a", "stroke-width": 9, "stroke-linecap": "round" }), ln(30, 65, 42, 65, 4), ln(258, 65, 270, 65, 4)),
              (v, g) => g.append(ln(40, 65, 260, 65))),
            mk("Batterie", "langer Strich = Pluspol", (v, g) => g.append(s.el("rect", { x: 90, y: 40, width: 110, height: 50, rx: 8, fill: "#1d5bd0" }), s.el("rect", { x: 160, y: 40, width: 40, height: 50, rx: 8, fill: "#dc3b2a" }), s.el("rect", { x: 200, y: 55, width: 10, height: 20, rx: 2, fill: "#5d6678" }), T(s, 180, 73, "+", { fill: "#fff", size: 24 }), T(s, 110, 73, "−", { fill: "#fff", size: 24 })),
              (v, g) => g.append(ln(40, 65, 140, 65), ln(140, 30, 140, 100, 4), ln(158, 47, 158, 83, 10), ln(158, 65, 260, 65), T(s, 126, 30, "+", { size: 24, fill: "#dc3b2a" }), T(s, 176, 40, "−", { size: 24, fill: "#1d5bd0" }))),
            mk("Lampe", "Kreis mit Kreuz", (v, g) => { const b = bulb(s, 150, 46, 26); g.append(b.g); },
              (v, g) => { const l = symLamp(s, 150, 65, 28); g.append(ln(40, 65, 122, 65), ln(178, 65, 260, 65), l.g); }),
            mk("Schalter offen", "der Kreis ist unterbrochen", (v, g) => g.append(s.el("rect", { x: 80, y: 80, width: 140, height: 22, rx: 6, fill: "#d6c7a1", stroke: "#8a6a3a", "stroke-width": 2 }), s.el("rect", { x: 96, y: 40, width: 112, height: 12, rx: 6, fill: "#9ca3af", stroke: WIRE, "stroke-width": 2, transform: "rotate(-24 100 74)" }), s.el("circle", { cx: 100, cy: 74, r: 7, fill: WIRE }), s.el("circle", { cx: 204, cy: 74, r: 7, fill: "#fff", stroke: WIRE, "stroke-width": 3 })),
              (v, g) => { const sw = symSwitch(s, 110, 65, 190, 65, -30); g.append(ln(40, 65, 110, 65), ln(190, 65, 260, 65), sw.g); }),
            mk("Schalter geschlossen", "der Strom kann fließen", (v, g) => g.append(s.el("rect", { x: 80, y: 80, width: 140, height: 22, rx: 6, fill: "#d6c7a1", stroke: "#8a6a3a", "stroke-width": 2 }), s.el("rect", { x: 96, y: 68, width: 112, height: 12, rx: 6, fill: "#9ca3af", stroke: WIRE, "stroke-width": 2 }), s.el("circle", { cx: 100, cy: 74, r: 7, fill: WIRE }), s.el("circle", { cx: 204, cy: 74, r: 7, fill: "#fff", stroke: WIRE, "stroke-width": 3 })),
              (v, g) => { const sw = symSwitch(s, 110, 65, 190, 65, -30, true); g.append(ln(40, 65, 110, 65), ln(190, 65, 260, 65), sw.g); }),
            mk("Motor", "Kreis mit M", (v, g) => g.append(s.el("rect", { x: 100, y: 30, width: 90, height: 70, rx: 14, fill: "#9ca3af", stroke: WIRE, "stroke-width": 3 }), s.el("rect", { x: 190, y: 58, width: 40, height: 12, rx: 3, fill: "#5d6678" }), s.el("rect", { x: 112, y: 44, width: 66, height: 10, rx: 4, fill: "#c26a3a" })),
              (v, g) => g.append(ln(40, 65, 122, 65), ln(178, 65, 260, 65), s.el("circle", { cx: 150, cy: 65, r: 28, fill: "#fff", stroke: WIRE, "stroke-width": 4 }), T(s, 150, 74, "M", { size: 26 }))),
          ];
          const m = merk(s, "<b>Schaltzeichen</b> sind genormt. So verstehen Fachleute in vielen Ländern denselben Plan – wie bei Verkehrszeichen.", true, 21);
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%", justifyContent: "center" } },
            s.h("div", { class: "cols3", style: { gap: "14px" } }, ...C.map(c => c.card)), m));
          s.sfx.pop();
          s.step(async () => { for (const c of C) { s.sfx.pop(); await s.show(c.card, "pop"); } s.say("So sehen die Teile in echt aus."); });
          s.step(async () => { for (const c of C) { if (!c.isSym) await c.flip(); } s.sfx.ding(); s.say("Und das sind ihre Schaltzeichen."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Vom Aufbau zum Schaltplan",
        say: "Links der echte Stromkreis, rechts sein Schaltplan. Beide zeigen dasselbe. Tippe auf den Schalter.",
        build(s) {
          let closed = false;
          const lampS = symLamp(s, 240, 60, 26);
          const sv = s.svg(480, 360);
          const segs = [wire(s, "M70,167 V60 H214", { class: "later" }), wire(s, "M266,60 H410 V290 H280", { class: "later" }), wire(s, "M200,290 H70 V183", { class: "later" })];
          const bat = symBat(s, 70, 175); bat.classList.add("later");
          const sw = symSwitch(s, 200, 290, 280, 290, -30); sw.g.classList.add("later");
          lampS.g.classList.add("later");
          sv.append(...segs, bat, lampS.g, sw.g);
          flows(s, sv, [{ d: "M70,183 V290 H410 V60 H70 V167", on: () => (closed ? 1 : 0) }]);
          const hit = s.el("rect", { x: 180, y: 240, width: 120, height: 80, fill: "transparent", style: { cursor: "pointer" } }); sv.append(hit);
          const rc = realCircuit(s, { w: 400, labels: false, onToggle: async c => { await sw.set(c); closed = c; lampS.set(c ? 1 : 0); if (c) s.sfx.success(); } });
          const toggle = () => rc.set(!rc.closed);
          hit.addEventListener("click", toggle);
          const cardL = s.h("div", { class: "card stack", style: { gap: "4px", padding: "10px 14px", alignItems: "center" } }, s.h("span", { class: "exlabel" }, "Aufbau (in echt)"), rc.svg);
          const cardR = s.h("div", { class: "card stack", style: { gap: "4px", padding: "10px 14px", alignItems: "center" } }, s.h("span", { class: "exlabel" }, "Schaltplan"), sv);
          const rules = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "12px 20px" } },
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 24px" } },
              ...["1. Mit Bleistift und Lineal zeichnen.", "2. Leitungen nur waagerecht und senkrecht.", "3. Ecken sind rechte Winkel.", "4. Keine Schaltzeichen in die Ecken."].map(t => s.h("span", null, t))));
          const btn = tbtn(s, "Schalter drücken", toggle, true);
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%", justifyContent: "center" } },
            s.h("div", { style: { display: "grid", gridTemplateColumns: "auto auto", gap: "18px", alignItems: "center", justifyContent: "center" } }, cardL, cardR),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "auto 1fr", gap: "18px", alignItems: "center" } }, btn, rules)));
          s.sfx.pop();
          s.step(async () => {
            for (const x of [segs[0], bat, segs[1], lampS.g, segs[2], sw.g]) { s.sfx.scribble(); await s.show(x, x.tagName === "path" ? "draw" : "pop"); }
            s.say("Batterie, Lampe und Schalter werden zu Schaltzeichen. Die Kabel werden gerade Linien.");
          });
          s.step(async () => { await rc.set(true); s.say("Im Schaltplan fließt der Strom genauso."); });
          s.step(async () => { s.sfx.ding(); await s.show(rules, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Leiter und Isolatoren",
        say: "Metalle leiten den Strom. Kunststoff, Gummi und Glas leiten ihn nicht. Sie isolieren. Ein Kabel braucht beides.",
        build(s) {
          const v = s.svg(540, 300);
          // outer jacket
          const jacket = s.el("rect", { x: 20, y: 90, width: 300, height: 120, rx: 30, fill: "#e5e7eb", stroke: "#6b7280", "stroke-width": 3 });
          const cores = [["#8a5a2b", 112], ["#1d5bd0", 150], ["#3fae6a", 188]];
          const ins = cores.map(([c, y]) => s.el("rect", { x: 200, y: y - 13, width: 250, height: 26, rx: 13, fill: c, stroke: WIRE, "stroke-width": 2 }));
          const gy = s.el("rect", { x: 200, y: 175, width: 250, height: 26, rx: 13, fill: "url(#u12gy)", stroke: WIRE, "stroke-width": 2 });
          const defs = s.el("defs", null, s.el("pattern", { id: "u12gy", width: 24, height: 26, patternUnits: "userSpaceOnUse", patternTransform: "rotate(30)" }, s.el("rect", { width: 12, height: 26, fill: "#3fae6a" }), s.el("rect", { x: 12, width: 12, height: 26, fill: "#ffd94a" })));
          const copper = cores.map(([, y]) => s.el("g", null, ...[-6, 0, 6].map(d => s.el("line", { x1: 440, y1: y + d, x2: 520, y2: y + d, stroke: "#c26a3a", "stroke-width": 5, "stroke-linecap": "round" }))));
          v.append(defs, ...copper, ins[0], ins[1], gy, jacket);
          const l1 = later(T(s, 534, 70, "Kupfer: Leiter", { anchor: "end", fill: "#c26a3a" }));
          const l2 = later(T(s, 130, 250, "Kunststoff: Isolator", { fill: "#5d6678" }));
          const l3 = later(T(s, 536, 250, "grün-gelb: Schutzleiter", { anchor: "end", size: 19, fill: "#138a5a" }));
          const ln1 = later(s.el("line", { x1: 500, y1: 78, x2: 500, y2: 100, stroke: WIRE, "stroke-width": 2 }));
          v.append(l1, ln1, l2, l3);
          const chips = (arr, col) => s.h("div", { class: "row", style: { gap: "8px" } }, ...arr.map(t => s.h("span", { class: "chip", style: { background: col, fontSize: "19px" } }, t)));
          const cL = s.h("div", { class: "card later stack", style: { gap: "8px" } }, s.h("p", { class: "h2", style: { color: "var(--green)" } }, "Leiter"), chips(["Kupfer", "Eisen", "Aluminium", "Gold", "Graphit (Bleistiftmine)"], "#dcf3e6"));
          const cI = s.h("div", { class: "card later stack", style: { gap: "8px" } }, s.h("p", { class: "h2", style: { color: "var(--red)" } }, "Isolatoren"), chips(["Kunststoff", "Gummi", "Glas", "Porzellan", "trockenes Holz", "Luft"], "#fde2e0"));
          const warn = exb(s, "Achtung", P(s, "Auch <b>Wasser</b> aus der Leitung und dein <b>Körper</b> leiten Strom. Darum: Elektrogeräte nie mit nassen Händen anfassen!", "small"));
          const link = s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, "Weißt du noch?"), P(s, "In <b>Kapitel 3</b> hast du Stoffe mit Batterie und Lampe getestet: „Leitet der Stoff Strom?“", "small"));
          s.add(cols(s, 540, stack(s, 14, v, link), stack(s, 14, cL, cI, warn)));
          s.show(v, "fade"); s.sfx.pop();
          s.step(async () => {
            s.sfx.scribble();
            await s.tween({ from: 0, to: 1, dur: 900, ease: "inOut", update: t => jacket.setAttribute("width", 300 - 70 * t) });
            s.show(l1, "pop"); s.show(ln1, "fade"); s.show(l2, "pop"); await s.show(l3, "pop"); s.say("Innen leitet das Kupfer. Außen schützt der Kunststoff.");
          });
          s.step(async () => { s.sfx.success(); await s.show(cL, "left"); s.sfx.error(); await s.show(cI, "left"); });
          s.step(async () => { s.sound("tropfen-einzeln", { vol: 0.6 }); await s.show(warn, "up"); s.sfx.pop(); await s.show(link, "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Reihenschaltung",
        say: "Zwei Lampen hintereinander in einem Kreis: Das ist eine Reihenschaltung. Dreh eine Lampe heraus – dann gehen beide aus.",
        build(s) {
          const v = s.svg(560, 420);
          const L = [symLamp(s, 210, 70, 26), symLamp(s, 350, 70, 26)];
          const has = [true, true];
          v.append(wire(s, "M70,192 V70 H184"), wire(s, "M236,70 H324"), wire(s, "M376,70 H490 V350 H70 V208"), symBat(s, 70, 200), L[0].g, L[1].g,
            T(s, 210, 140, "Lampe 1"), T(s, 350, 140, "Lampe 2"), T(s, 130, 210, "Batterie", { anchor: "start" }));
          const on = () => has[0] && has[1];
          flows(s, v, [{ d: "M70,208 V350 H490 V70 H70 V192", on: () => (on() ? 1 : 0) }]);
          const upd = () => { L.forEach((l, i) => { l.set(on() ? 0.55 : 0); l.fade(has[i] ? 1 : 0.18); }); btns.forEach((b, i) => (b.textContent = (has[i] ? "Lampe " + (i + 1) + " herausdrehen" : "Lampe " + (i + 1) + " hineindrehen"))); };
          const toggle = i => { has[i] = !has[i]; has[i] ? s.sfx.snap() : s.sfx.click(); upd(); if (!on()) s.sfx.error(); else s.sfx.ding(); };
          const btns = [0, 1].map(i => tbtn(s, "", () => toggle(i)));
          upd();
          const m = merk(s, "<b>Reihenschaltung</b>: Alle Geräte liegen hintereinander in <b>einem</b> Kreis. Fällt eins aus, ist der Kreis unterbrochen – alle sind aus.", true, 21);
          const note = P(s, "Zwei Lampen in Reihe leuchten <b>schwächer</b> als eine allein.", "small", true);
          const lf = life(s, "Im Alltag: alte Lichterketten", s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "14px", alignItems: "center" } },
            s.photo("christbaumkerzen", { w: 170, h: 120, style: { flex: "none" } }),
            P(s, "16 Kerzen in Reihe an 230&nbsp;V: Jede bekommt etwa 230&nbsp;V : 16 ≈ 14&nbsp;V. Ist eine kaputt, bleibt der Baum dunkel.", "small")));
          s.add(cols(s, 560, v, stack(s, 12, s.h("div", { class: "row", style: { gap: "10px" } }, ...btns), note, m, lf)));
          s.show(v, "fade"); s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); await s.show(note, "up"); s.say("Beide Lampen leuchten, aber etwas schwächer."); });
          s.step(async () => { toggle(0); await s.wait(600); s.sfx.ding(); await s.show(m, "up"); s.say("Lampe eins ist heraus. Jetzt ist auch Lampe zwei aus."); });
          s.step(async () => { toggle(0); await s.wait(300); s.sfx.chord([0, 4, 7]); await s.show(lf, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Parallelschaltung",
        say: "Jetzt hat jede Lampe ihren eigenen Weg. Das ist eine Parallelschaltung. Dreh eine Lampe heraus – die andere leuchtet weiter.",
        build(s) {
          const v = s.svg(560, 420);
          const L = [symLamp(s, 270, 210, 26), symLamp(s, 450, 210, 26)];
          const has = [true, true];
          v.append(wire(s, "M70,192 V60 H450 V184"), wire(s, "M270,60 V184"), wire(s, "M270,236 V360"), wire(s, "M450,236 V360 H70 V208"), symBat(s, 70, 200), L[0].g, L[1].g,
            s.el("circle", { cx: 270, cy: 60, r: 7, fill: WIRE }), s.el("circle", { cx: 270, cy: 360, r: 7, fill: WIRE }),
            T(s, 308, 216, "Lampe 1", { anchor: "start" }), T(s, 440, 290, "Lampe 2", { anchor: "end" }), T(s, 130, 210, "Batterie", { anchor: "start" }));
          flows(s, v, [
            { d: "M70,208 V360 H270 V60 H70 V192", on: () => (has[0] ? 1 : 0) },
            { d: "M70,208 V360 H450 V60 H70 V192", on: () => (has[1] ? 1 : 0) },
          ]);
          const upd = () => { L.forEach((l, i) => { l.set(has[i] ? 1 : 0); l.fade(has[i] ? 1 : 0.18); }); btns.forEach((b, i) => (b.textContent = (has[i] ? "Lampe " + (i + 1) + " herausdrehen" : "Lampe " + (i + 1) + " hineindrehen"))); };
          const toggle = i => { has[i] = !has[i]; has[i] ? s.sfx.snap() : s.sfx.click(); upd(); s.sfx.ding(); };
          const btns = [0, 1].map(i => tbtn(s, "", () => toggle(i)));
          upd();
          const note = P(s, "Jede Lampe leuchtet <b>hell</b> – so hell wie allein an der Batterie.", "small", true);
          const m = merk(s, "<b>Parallelschaltung</b>: Jedes Gerät hat seinen <b>eigenen Weg</b> zur Batterie. Fällt eins aus, arbeiten die anderen weiter.", true, 21);
          const lf = life(s, "Im Alltag", P(s, "Die Scheinwerfer am Auto: Geht einer kaputt, leuchtet der andere weiter. Auch alle Lampen und Steckdosen in deiner Wohnung sind parallel geschaltet.", "small"));
          s.add(cols(s, 560, v, stack(s, 12, s.h("div", { class: "row", style: { gap: "10px" } }, ...btns), note, m, lf)));
          s.show(v, "fade"); s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); await s.show(note, "up"); });
          s.step(async () => { toggle(0); await s.wait(600); s.sfx.ding(); await s.show(m, "up"); s.say("Lampe eins ist heraus. Lampe zwei leuchtet weiter."); });
          s.step(async () => { toggle(0); s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Die Stromkreise der Wohnung",
        say: "In der Wohnung hat jeder Raum seinen eigenen Zweig. Tippe auf einen Raum und schalte das Licht an oder aus.",
        build(s) {
          const v = s.svg(640, 560);
          const R = [["Küche", 172, "#fff1e0"], ["Wohnzimmer", 307, "#e7f0ff"], ["Dein Zimmer", 442, "#eef6dc"], ["Bad", 577, "#e3f6f6"]];
          const st = [false, false, false, false];
          const sws = [], lamps = [];
          R.forEach(([n, x, bg], i) => {
            const panel = s.el("rect", { x: x - 62, y: 72, width: 124, height: 420, rx: 14, fill: bg, stroke: "#c8d3de", "stroke-width": 2 });
            v.append(panel);
          });
          v.append(wire(s, "M60,220 V50 H577"), wire(s, "M60,340 V510 H577"),
            s.el("rect", { x: 14, y: 220, width: 92, height: 120, rx: 10, fill: "#fff", stroke: WIRE, "stroke-width": 3 }),
            T(s, 60, 262, "230 V", { size: 22 }), T(s, 60, 290, "Siche-", { size: 19, weight: 600 }), T(s, 60, 314, "rungen", { size: 19, weight: 600 }));
          R.forEach(([n, x], i) => {
            const sw = symSwitch(s, x, 140, x, 200, 32);
            const l = symLamp(s, x, 320, 24);
            v.append(wire(s, `M${x},50 V140`), wire(s, `M${x},200 V296`), wire(s, `M${x},344 V510`), s.el("circle", { cx: x, cy: 50, r: 6, fill: WIRE }), s.el("circle", { cx: x, cy: 510, r: 6, fill: WIRE }), sw.g, l.g,
              s.el("rect", { x: x - 62, y: 420, width: 124, height: 30, rx: 8, fill: "#fff" }), T(s, x, 442, n, { size: 19, weight: 600 }));
            sws.push(sw); lamps.push(l);
            const hit = s.el("rect", { x: x - 62, y: 72, width: 124, height: 420, fill: "transparent", style: { cursor: "pointer" } });
            hit.addEventListener("click", () => toggle(i)); v.append(hit);
          });
          flows(s, v, R.map(([, x], i) => ({ d: `M60,340 V510 H${x} V50 H60 V220`, on: () => (st[i] ? 1 : 0), ac: true, n: 16 })));
          const toggle = async i => { st[i] = !st[i]; s.sound("lichtschalter", { vol: 0.7 }); await sws[i].set(st[i]); lamps[i].set(st[i] ? 1 : 0); };
          const m = merk(s, "Alle Lampen und Steckdosen sind <b>parallel</b> geschaltet. Jedes Gerät bekommt die vollen <b>230&nbsp;V</b> und lässt sich allein schalten.", true, 21);
          const e = exb(s, "Sicherungskasten", P(s, "Fließt zu viel Strom, zum Beispiel bei einem Kurzschluss, schaltet die <b>Sicherung</b> den Stromkreis ab.", "small"));
          const ac = exb(s, "Wechselstrom", P(s, "Aus der Steckdose kommt <b>Wechselstrom</b>: Die Elektronen schwingen 50-mal in jeder Sekunde hin und her. Hier siehst du es in Zeitlupe.", "small"));
          s.add(cols(s, 640, v, stack(s, 12, m, e, ac), 20));
          s.show(v, "fade"); s.sfx.pop();
          s.step(async () => { await toggle(0); s.say("Licht in der Küche. Die anderen Räume bleiben dunkel."); });
          s.step(async () => { await toggle(1); await s.wait(250); await toggle(2); s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.zap(); await s.show(e, "up"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(ac, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "UND-Schaltung",
        say: "Zwei Schalter hintereinander: Die Lampe leuchtet nur, wenn Schalter A und Schalter B geschlossen sind.",
        build(s) {
          const v = s.svg(540, 400);
          const A = symSwitch(s, 160, 70, 240, 70), B = symSwitch(s, 320, 70, 400, 70);
          const lamp = symLamp(s, 280, 330, 26);
          v.append(wire(s, "M70,192 V70 H160"), wire(s, "M240,70 H320"), wire(s, "M400,70 H480 V330 H306"), wire(s, "M254,330 H70 V208"), symBat(s, 70, 200), A.g, B.g, lamp.g,
            T(s, 200, 130, "Schalter A"), T(s, 360, 130, "Schalter B"), T(s, 280, 392, "Maschine", { size: 19 }));
          const on = () => A.closed && B.closed;
          flows(s, v, [{ d: "M70,208 V330 H480 V70 H70 V192", on: () => (on() ? 1 : 0) }]);
          const rows = [[0, 0], [1, 0], [0, 1], [1, 1]].map(([a, b]) => {
            const r = s.h("tr", { style: { borderTop: "2px solid var(--line)" } }, ...[a ? "zu" : "offen", b ? "zu" : "offen", a && b ? "AN" : "aus"].map((t, k) => s.h("td", { style: { padding: "5px 12px", fontSize: "21px", textAlign: "center", fontWeight: k === 2 ? 800 : 400, color: k === 2 ? (a && b ? "var(--green)" : "var(--red)") : "var(--ink)" } }, t)));
            r.key = a + "" + b; return r;
          });
          const table = s.h("table", { style: { borderCollapse: "collapse", background: "#fff", border: "2px solid var(--line)" } },
            s.h("tr", null, ...["A", "B", "Maschine"].map(t => s.h("th", { style: { padding: "5px 12px", fontSize: "21px", color: "var(--unit)" } }, t))), ...rows);
          const upd = () => { lamp.set(on() ? 1 : 0); const k = (A.closed ? 1 : 0) + "" + (B.closed ? 1 : 0); rows.forEach(r => (r.style.background = r.key === k ? "#fff6c9" : "")); bA.classList.toggle("solid", A.closed); bB.classList.toggle("solid", B.closed); };
          const flip = async (sw) => { s.sound("lichtschalter", { vol: 0.7 }); await sw.set(!sw.closed); upd(); if (on()) s.sfx.success(); };
          const bA = tbtn(s, "Schalter A", () => flip(A)), bB = tbtn(s, "Schalter B", () => flip(B));
          upd();
          const m = merk(s, "<b>UND-Schaltung</b>: Schalter <b>in Reihe</b>. Nur wenn A <b>und</b> B geschlossen sind, fließt Strom.", true, 21);
          const lf = life(s, "Im Alltag", P(s, "<b>Zweihandschaltung</b> an einer Presse in der Fabrik: Sie startet nur, wenn beide Hände je einen Knopf drücken. So sind die Hände sicher weg. Und die Mikrowelle läuft nur bei geschlossener Tür <b>und</b> gedrückter Starttaste.", "small"));
          s.add(cols(s, 540, v, stack(s, 12, s.h("div", { class: "row", style: { gap: "16px", flexWrap: "nowrap", alignItems: "center" } }, s.h("div", { class: "stack", style: { gap: "10px" } }, bA, bB), table), m, lf)));
          s.show(v, "fade"); s.sfx.pop();
          s.step(async () => { await flip(A); s.sfx.error(); s.say("Nur Schalter A ist zu. Die Maschine bleibt aus."); });
          s.step(async () => { await flip(B); s.say("Jetzt sind beide zu. Die Maschine läuft."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.drum(); await s.show(lf, "up"); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "ODER-Schaltung",
        say: "Zwei Klingelknöpfe, an der Haustür und an der Gartentür. Die Klingel läutet, wenn du den einen oder den anderen drückst.",
        build(s) {
          const v = s.svg(540, 420);
          const A = symSwitch(s, 230, 60, 310, 60, -30), B = symSwitch(s, 230, 180, 310, 180, 30);
          // bell symbol
          const bellG = s.el("g", null, s.el("circle", { cx: 275, cy: 340, r: 32, fill: "#fff", stroke: WIRE, "stroke-width": 4 }),
            s.el("path", { d: "M257,350 Q257,322 275,318 Q293,322 293,350 Z", fill: "#ffd94a", stroke: WIRE, "stroke-width": 2.5 }), s.el("circle", { cx: 275, cy: 354, r: 4, fill: WIRE }));
          v.append(wire(s, "M70,192 V120 H160"), wire(s, "M160,60 V180"), wire(s, "M160,60 H230"), wire(s, "M160,180 H230"), wire(s, "M310,60 H390 V180 H310"), wire(s, "M390,120 H480 V340 H307"), wire(s, "M243,340 H70 V208"),
            s.el("circle", { cx: 160, cy: 120, r: 7, fill: WIRE }), s.el("circle", { cx: 390, cy: 120, r: 7, fill: WIRE }), symBat(s, 70, 200), A.g, B.g, bellG,
            T(s, 275, 108, "Haustür (A)", { size: 19 }), T(s, 275, 152, "Gartentür (B)", { size: 19 }), T(s, 350, 400, "Klingel"));
          const on = () => A.closed || B.closed;
          flows(s, v, [
            { d: "M70,208 V340 H480 V120 H390 V60 H160 V120 H70 V192", on: () => (A.closed ? 1 : 0) },
            { d: "M70,208 V340 H480 V120 H390 V180 H160 V120 H70 V192", on: () => (B.closed ? 1 : 0) },
          ]);
          const rows = [[0, 0], [1, 0], [0, 1], [1, 1]].map(([a, b]) => {
            const r = s.h("tr", { style: { borderTop: "2px solid var(--line)" } }, ...[a ? "zu" : "offen", b ? "zu" : "offen", a || b ? "klingelt" : "still"].map((t, k) => s.h("td", { style: { padding: "5px 12px", fontSize: "21px", textAlign: "center", fontWeight: k === 2 ? 800 : 400, color: k === 2 ? (a || b ? "var(--green)" : "var(--red)") : "var(--ink)" } }, t)));
            r.key = a + "" + b; return r;
          });
          const table = s.h("table", { style: { borderCollapse: "collapse", background: "#fff", border: "2px solid var(--line)" } },
            s.h("tr", null, ...["A", "B", "Klingel"].map(t => s.h("th", { style: { padding: "5px 12px", fontSize: "21px", color: "var(--unit)" } }, t))), ...rows);
          let ring = 0;
          s.loop(t => { const r = on() ? Math.sin(t * 40) * 10 : 0; bellG.setAttribute("transform", `rotate(${r} 275 318)`); });
          const upd = () => { const k = (A.closed ? 1 : 0) + "" + (B.closed ? 1 : 0); rows.forEach(r => (r.style.background = r.key === k ? "#fff6c9" : "")); };
          const press = async sw => {
            const id = ++ring; await sw.set(true); upd(); s.sound("tuerklingel", { vol: 0.7 });
            await s.wait(1400); if (id !== ring && sw.closed) { /* pressed again meanwhile */ }
            await sw.set(false); upd();
          };
          const bA = tbtn(s, "Haustür drücken", () => press(A)), bB = tbtn(s, "Gartentür drücken", () => press(B));
          upd();
          const m = merk(s, "<b>ODER-Schaltung</b>: Schalter <b>parallel</b>. Es reicht, wenn A <b>oder</b> B geschlossen ist.", true, 21);
          const lf = life(s, "Im Alltag", P(s, "Das Licht im Auto geht an, wenn die Fahrertür <b>oder</b> die Beifahrertür offen ist. Jede Tür hat ihren eigenen kleinen Schalter.", "small"));
          s.add(cols(s, 540, v, stack(s, 12, s.h("div", { class: "row", style: { gap: "12px", flexWrap: "nowrap", alignItems: "center" } }, s.h("div", { class: "stack", style: { gap: "10px" } }, bA, bB), table), m, lf)));
          s.show(v, "fade"); s.sfx.pop();
          s.step(async () => { await press(A); s.say("Haustür: Es klingelt."); });
          s.step(async () => { await press(B); s.say("Gartentür: Es klingelt auch."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Der Elektromagnet",
        say: "Wickle einen Draht um einen Eisennagel und schicke Strom hindurch. Dann wird der Nagel zum Magneten. Mehr Windungen machen ihn stärker.",
        build(s) {
          const v = s.svg(540, 540);
          v.append(s.el("rect", { x: 0, y: 486, width: 540, height: 54, rx: 10, fill: "#d6c7a1" }));
          // nail
          v.append(s.el("rect", { x: 262, y: 70, width: 16, height: 250, fill: "#9ca3af", stroke: WIRE, "stroke-width": 2 }), s.el("rect", { x: 244, y: 60, width: 52, height: 14, rx: 4, fill: "#6b7280" }),
            s.el("polygon", { points: "262,320 278,320 270,344", fill: "#9ca3af", stroke: WIRE, "stroke-width": 2 }));
          const coil = s.el("g"); v.append(coil);
          let N = 10;
          const drawCoil = () => { coil.innerHTML = ""; const top = 110, bot = 290; for (let i = 0; i < N; i++) { const y = top + (i + 0.5) * (bot - top) / N; coil.append(s.el("ellipse", { cx: 270, cy: y, rx: 26, ry: 6, fill: "none", stroke: "#c26a3a", "stroke-width": Math.max(2.5, 8 - N / 5) })); } };
          drawCoil();
          // wires
          v.append(wire(s, "M244,110 H200 V40 H460 V132", { stroke: "#c26a3a" }), wire(s, "M296,290 H350"), wire(s, "M420,290 H460 V268"));
          v.append(cell(s, 460, 140, 64, 120));
          const sw = symSwitch(s, 350, 290, 420, 290, -30);
          v.append(sw.g);
          const field = s.el("g", { opacity: 0 });
          [70, 110, 150].forEach(rx => field.append(s.el("ellipse", { cx: 270, cy: 205, rx, ry: 150 + rx * 0.3, fill: "none", stroke: "#7b4fd6", "stroke-width": 2, "stroke-dasharray": "7 7" })));
          v.insertBefore(field, v.firstChild.nextSibling);
          // clips
          const home = [[150, 470], [200, 474], [250, 470], [300, 474], [350, 470], [400, 474]];
          const stuck = [[262, 356], [282, 360], [250, 384], [274, 388], [296, 384], [272, 414]];
          const clips = home.map(([x, y]) => { const g = s.el("g", { transform: `translate(${x},${y})` }); g.append(s.el("path", { d: "M-16,6 H12 a6,6 0 0 0 0,-12 H-12 a4,4 0 0 0 0,8 H8", fill: "none", stroke: "#6b7280", "stroke-width": 3, "stroke-linecap": "round" })); g.pos = [x, y]; v.append(g); return g; });
          let on = false;
          flows(s, v, [{ d: "M460,268 V290 H296 L244,110 H200 V40 H460 V132", on: () => (on ? 1 : 0), n: 16 }]);
          v.append(T(s, 130, 180, "Eisennagel", { anchor: "start", size: 20 }), T(s, 316, 200, "Spule", { anchor: "start", size: 20 }), T(s, 270, 530, "Büroklammern", { size: 20 }));
          const lifted = () => (on ? Math.min(6, Math.round(N / 4)) : 0);
          const moveClips = async () => {
            const k = lifted();
            await Promise.all(clips.map((c, i) => {
              const target = i < k ? stuck[i] : home[i];
              const [x0, y0] = c.pos; if (x0 === target[0] && y0 === target[1]) return null;
              c.pos = target;
              return s.tween({ from: 0, to: 1, dur: i < k ? 380 : 520, ease: i < k ? "in" : "bounce", delay: i * 40, update: t => c.setAttribute("transform", `translate(${x0 + (target[0] - x0) * t},${y0 + (target[1] - y0) * t})`) });
            }));
          };
          const setOn = async c => { s.sound("lichtschalter", { vol: 0.7 }); await sw.set(c); on = c; field.setAttribute("opacity", c ? 1 : 0); btn.textContent = c ? "Strom aus" : "Strom an"; await moveClips(); c ? s.sound("magnet-klick") : s.sfx.drum(); };
          const btn = tbtn(s, "Strom an", () => setOn(!on), true);
          const sl = s.slider({ label: "Windungen", min: 4, max: 24, step: 4, value: 8, fmt: v2 => v2 + " Windungen", onInput: v2 => { N = v2; drawCoil(); moveClips(); } });
          N = 8; drawCoil();
          const m = merk(s, "Fließt Strom durch eine <b>Spule</b> mit Eisenkern, wird sie zum <b>Elektromagneten</b>. Strom aus – Magnet aus. Mehr Windungen: stärker.", true, 21);
          const ph = s.h("div", { class: "later" }, s.photo("magnetkran", { w: 250, h: 150, pos: "50% 40%", caption: "Magnetkran auf dem Schrottplatz" }));
          const lf = life(s, "Im Alltag", P(s, "Kran auf dem Schrottplatz, Türöffner an der Haustür, Klingel und Lautsprecher: Überall arbeitet ein Elektromagnet.", "small"));
          s.add(cols(s, 540, v, stack(s, 12, s.h("div", { class: "row", style: { gap: "14px", flexWrap: "nowrap" } }, btn, s.h("div", { style: { flex: "1" } }, sl)), m, s.h("div", { style: { display: "grid", gridTemplateColumns: "250px 1fr", gap: "12px", alignItems: "center" } }, ph, lf))));
          s.show(v, "fade"); s.sfx.pop();
          s.step(async () => { await setOn(true); s.say("Der Nagel zieht die Büroklammern an."); });
          s.step(async () => { s.sfx.whoosh(); await s.tween({ from: 8, to: 24, dur: 1600, update: x => { const q = Math.round(x / 4) * 4; if (q !== N) sl.set(q); } }); s.say("Mehr Windungen, stärkerer Magnet."); });
          s.step(async () => { await setOn(false); s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sound("magnet-klick"); await s.show(ph, "zoom"); await s.show(lf, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Vorsicht an der Steckdose",
        say: "In der Steckdose sind 230 Volt. Das ist rund fünfzigmal so viel wie bei einer Flachbatterie und kann tödlich sein.",
        build(s) {
          const v = s.svg(500, 520);
          // socket
          v.append(s.el("rect", { x: 80, y: 30, width: 240, height: 240, rx: 28, fill: "#fff", stroke: "#9ca3af", "stroke-width": 4 }),
            s.el("circle", { cx: 200, cy: 150, r: 92, fill: "#f1f1f1", stroke: "#9ca3af", "stroke-width": 3 }),
            s.el("circle", { cx: 165, cy: 150, r: 10, fill: WIRE }), s.el("circle", { cx: 235, cy: 150, r: 10, fill: WIRE }),
            s.el("rect", { x: 186, y: 58, width: 28, height: 14, rx: 3, fill: "#b8c0c9", stroke: "#5d6678", "stroke-width": 2 }), s.el("rect", { x: 186, y: 228, width: 28, height: 14, rx: 3, fill: "#b8c0c9", stroke: "#5d6678", "stroke-width": 2 }));
          // plug (front view)
          const plug = s.el("g", null, s.el("circle", { cx: 200, cy: 400, r: 84, fill: "#f8fafc", stroke: WIRE, "stroke-width": 3 }),
            s.el("rect", { x: 186, y: 314, width: 28, height: 16, rx: 3, fill: "#b8c0c9", stroke: "#5d6678", "stroke-width": 2 }), s.el("rect", { x: 186, y: 470, width: 28, height: 16, rx: 3, fill: "#b8c0c9", stroke: "#5d6678", "stroke-width": 2 }),
            s.el("circle", { cx: 165, cy: 400, r: 9, fill: "#b8c0c9", stroke: "#5d6678", "stroke-width": 2 }), s.el("circle", { cx: 235, cy: 400, r: 9, fill: "#b8c0c9", stroke: "#5d6678", "stroke-width": 2 }));
          v.append(plug);
          const labA = later(T(s, 340, 66, "Schutzkontakt", { anchor: "start", size: 19 }));
          const lnA = later(s.el("line", { x1: 336, y1: 60, x2: 218, y2: 64, stroke: UC, "stroke-width": 2.5 }));
          const labB = later(T(s, 340, 196, "2 Stifte: 230 V", { anchor: "start", size: 19 }));
          const lnB = later(s.el("line", { x1: 336, y1: 190, x2: 244, y2: 156, stroke: UC, "stroke-width": 2.5 }));
          v.append(lnA, labA, lnB, labB);
          const big = s.h("p", { class: "huge mono", style: { color: "var(--red)", whiteSpace: "nowrap", fontSize: "64px", flex: "none" } }, "0 V");
          const cmp = P(s, "Eine Flachbatterie hat <b>4,5&nbsp;V</b>. Die Steckdose hat rund <b>50-mal</b> so viel – das kann <b>tödlich</b> sein.", "t", true);
          const schuko = exb(s, "Der Schuko-Stecker", P(s, "<b>Schu</b>tz<b>ko</b>ntakt: Die Metallbügel sind über den grün-gelben Draht mit dem Metallgehäuse des Geräts verbunden. Bei einem Defekt fließt der Strom dort ab – nicht durch dich.", "small"));
          const R = ["Nie etwas in die Steckdose stecken.", "Stecker am Stecker ziehen, nicht am Kabel.", "Kaputte Kabel nicht anfassen, Erwachsenen Bescheid sagen.", "Keine Elektrogeräte an der Badewanne. Nie mit nassen Händen."];
          const rules = s.h("div", { class: "card later stack", style: { gap: "4px", padding: "12px 18px" } }, s.h("span", { class: "exlabel", style: { color: "var(--red)" } }, "Regeln"), ...R.map(t => P(s, "✗ " + t, "small")));
          const m = merk(s, "Versuche nur mit <b>Batterien</b> – nie mit der Steckdose!", true, 21);
          s.add(cols(s, 500, v, stack(s, 10, s.h("div", { class: "row", style: { gap: "16px", flexWrap: "nowrap", alignItems: "center" } }, big, cmp), schuko, rules, m), 20));
          s.show(v, "fade"); s.sfx.pop();
          s.step(async () => { s.sound("strom-summen", { vol: 0.4 }); let last = -1; await s.tween({ from: 0, to: 230, dur: 1400, ease: "out", update: x => { big.textContent = Math.round(x) + " V"; const k = Math.floor(x / 25); if (k !== last) { last = k; s.sfx.tick(); } } }); s.sfx.error(); await s.show(cmp, "up"); });
          s.step(async () => {
            s.sfx.whoosh(); await s.tween({ from: 0, to: 1, dur: 800, ease: "inOut", update: t => plug.setAttribute("transform", `translate(0,${-250 * t})`) }); s.sfx.snap();
            s.show(lnA, "draw"); s.show(labA, "fade"); s.show(lnB, "draw"); await s.show(labB, "fade"); await s.show(schuko, "up");
          });
          s.step(async () => { s.sfx.pop(); await s.show(rules, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Gefahr an Gleisen und bei Gewitter",
        say: "Die Oberleitung der Bahn hat fünfzehntausend Volt, die Stromschiene der Berliner S-Bahn siebenhundertfünfzig Volt. Halte Abstand! Und bei Gewitter gilt: ab ins Haus oder ins Auto.",
        build(s) {
          const flash = s.h("div", { style: { position: "absolute", inset: "0", background: "#fff", opacity: "0", pointerEvents: "none", borderRadius: "16px" } });
          const card = (id, cap, pos, html, extra) => s.h("div", { class: "card later stack", style: { gap: "8px", padding: "10px 12px", position: "relative" } },
            s.h("div", { style: { position: "relative" } }, s.photo(id, { w: "100%", h: 190, pos, caption: cap }), extra || null), P(s, html, "small"));
          const c1 = card("ice-stromabnehmer", "Oberleitung: 15.000\u00a0V", "50% 40%", "Der Strom kann bis zu <b>1,5&nbsp;m</b> weit überspringen! Nie auf Waggons, Masten oder Brückengeländer klettern – auch nicht bei stehenden Zügen.");
          const c2 = card("stromschiene-sbahn", "S-Bahn Berlin: Stromschiene 750\u00a0V", "40% 50%", "Seitlich neben dem Gleis. Auch die Berliner U-Bahn fährt mit <b>750&nbsp;V</b> aus einer Stromschiene. Gleise nie betreten!");
          const c3 = card("blitz", "Gewitter: Blitze sind riesige Funken", "50% 50%", "Ab ins <b>Haus</b> oder ins <b>Auto</b>. Raus aus dem Wasser. Nicht unter einzelne Bäume stellen.", flash);
          const sign = warnSign(s, 90);
          const m = s.h("div", { class: "row later", style: { gap: "18px", flexWrap: "nowrap", alignItems: "center" } }, sign,
            merk(s, "Das gelbe Dreieck mit Blitz heißt: <b>Hochspannung – Lebensgefahr!</b> Abstand halten.", false, 21));
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%", justifyContent: "center" } }, s.h("div", { class: "cols3", style: { gap: "14px" } }, c1, c2, c3), m));
          s.sfx.pop();
          s.step(async () => { s.sfx.zap(); await s.show(c1, "up"); s.say("Fünfzehntausend Volt. Der Strom springt sogar durch die Luft."); });
          s.step(async () => { s.sound("ubahn-train", { vol: 0.4, dur: 3 }); await s.show(c2, "up"); });
          s.step(async () => {
            await s.show(c3, "up"); s.sound("thunder", { vol: 0.6, dur: 4 });
            for (const o of [0.9, 0, 0.7, 0]) { flash.style.opacity = String(o); await s.wait(90); }
            flash.style.opacity = "0";
          });
          s.step(async () => { s.sfx.error(); await s.show(m, "up"); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Woher kommt der Strom?",
        say: "Strom wird immer aus einer anderen Energie gemacht: in der Batterie, in der Solarzelle, im Fahrraddynamo und im Kraftwerk.",
        build(s) {
          const card = (title, top, html) => s.h("div", { class: "card later stack", style: { gap: "8px", padding: "12px 14px", alignItems: "center", textAlign: "center" } },
            s.h("p", { class: "h2", style: { color: "var(--unit)", fontSize: "26px" } }, title), top, P(s, html, "small"));
          // battery
          const bv = s.svg(220, 170);
          bv.append(s.el("rect", { x: 40, y: 50, width: 140, height: 70, rx: 12, fill: "#1d5bd0" }), s.el("rect", { x: 130, y: 50, width: 50, height: 70, rx: 12, fill: "#dc3b2a" }), s.el("rect", { x: 180, y: 72, width: 12, height: 26, rx: 3, fill: "#5d6678" }),
            T(s, 155, 94, "+", { fill: "#fff", size: 26 }), T(s, 82, 93, "1,5 V", { fill: "#fff", size: 21 }));
          // dynamo with wheel
          const dv = s.svg(220, 170);
          const wheel = s.el("g", null, s.el("circle", { cx: 80, cy: 90, r: 66, fill: "none", stroke: WIRE, "stroke-width": 8 }), ...[0, 45, 90, 135].map(a => s.el("line", { x1: 80 - 62 * Math.cos(a * Math.PI / 180), y1: 90 - 62 * Math.sin(a * Math.PI / 180), x2: 80 + 62 * Math.cos(a * Math.PI / 180), y2: 90 + 62 * Math.sin(a * Math.PI / 180), stroke: "#9ca3af", "stroke-width": 2 })), s.el("circle", { cx: 80, cy: 90, r: 7, fill: WIRE }));
          const dlamp = s.el("circle", { cx: 186, cy: 40, r: 16, fill: "#fffbe6", stroke: WIRE, "stroke-width": 3 });
          const dglow = s.el("circle", { cx: 186, cy: 40, r: 32, fill: YEL, opacity: 0 });
          dv.append(dglow, wheel, s.el("rect", { x: 150, y: 76, width: 34, height: 56, rx: 10, fill: "#6b7280", stroke: WIRE, "stroke-width": 2 }), dlamp, s.el("path", { d: "M167,76 V60 Q167,48 178,48", fill: "none", stroke: "#dc3b2a", "stroke-width": 3 }));
          let spin = 0, ang = 0;
          s.loop((t, dt) => { if (spin > 0) { spin = Math.max(0, spin - (dt || 0.016)); ang += 400 * (dt || 0.016); wheel.setAttribute("transform", `rotate(${ang} 80 90)`); } dglow.setAttribute("opacity", spin > 0 ? 0.6 : 0); dlamp.setAttribute("fill", spin > 0 ? "#fff4a8" : "#fffbe6"); });
          const crank = () => { spin = 2.5; s.sfx.whoosh(); };
          const dyn = s.h("div", { class: "stack", style: { gap: "6px", alignItems: "center" } }, dv, s.h("button", { class: "btn", onclick: crank }, "Rad drehen"));
          // power plant
          const kv = s.svg(220, 170);
          kv.append(s.el("rect", { x: 10, y: 140, width: 200, height: 10, fill: "#8cbf6f" }),
            s.el("line", { x1: 60, y1: 140, x2: 60, y2: 50, stroke: "#9ca3af", "stroke-width": 6 }));
          const rotor = s.el("g", null, ...[0, 120, 240].map(a => s.el("path", { d: "M60,50 L56,8 L64,8 Z", fill: "#e5e7eb", stroke: "#6b7280", "stroke-width": 1.5, transform: `rotate(${a} 60 50)` })));
          kv.append(rotor, s.el("rect", { x: 110, y: 96, width: 46, height: 44, fill: "#e5e7eb", stroke: WIRE, "stroke-width": 2 }), s.el("path", { d: "M160,140 V60 L176,40 L192,60 V140", fill: "#9ca3af", stroke: WIRE, "stroke-width": 2 }),
            s.el("path", { d: "M184,30 L196,10 M192,30 L206,14", stroke: "#1d5bd0", "stroke-width": 3 }));
          s.loop(t => rotor.setAttribute("transform", `rotate(${t * 60} 60 50)`));
          const c1 = card("Batterie", bv, "Speichert <b>chemische Energie</b>. Eine AA-Batterie hat 1,5&nbsp;V.");
          const c2 = card("Solarzelle", s.photo("solarzellen-dach", { w: 220, h: 170, pos: "50% 50%" }), "Macht aus <b>Licht</b> Strom. Eine Zelle hat nur etwa 0,5&nbsp;V – darum viele zusammen.");
          const c3 = card("Dynamo", dyn, "Macht aus <b>Bewegung</b> Strom. Am Fahrrad etwa 6&nbsp;V.");
          const c4 = card("Kraftwerk", kv, "Strom aus der Steckdose. 2024 kamen fast <b>60 %</b> davon aus Wind, Sonne, Wasser und Biomasse.");
          const m = merk(s, "Strom wird aus einer <b>anderen Energie</b> gewonnen: aus chemischer Energie, Licht oder Bewegung.", true, 21);
          s.add(s.h("div", { class: "stack", style: { gap: "16px", height: "100%", justifyContent: "center" } }, s.h("div", { class: "cols4", style: { gap: "14px" } }, c1, c2, c3, c4), m));
          s.sfx.pop();
          s.step(async () => { s.sfx.pop(); await s.show(c1, "up"); s.sfx.chord([0, 4, 7]); await s.show(c2, "up"); });
          s.step(async () => { await s.show(c3, "up"); crank(); s.say("Dreht sich das Rad, leuchtet das Licht."); });
          s.step(async () => { s.sound("wind", { vol: 0.4, dur: 3 }); await s.show(c4, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 17 --------------------------------------------------------------- */
      {
        title: "Wie viel Volt?",
        say: "Die Spannung misst man in Volt. Von der Solarzelle bis zur Oberleitung der Bahn ist der Unterschied riesig.",
        build(s) {
          const W = 1060, H = 470;
          const v = s.svg(W, H);
          const X0 = 250, X1 = 960;
          const xOf = val => X0 + (Math.log10(val) + 1) / 5.3 * (X1 - X0);
          [0.1, 1, 10, 100, 1000, 10000].forEach(t => { const x = xOf(t); v.append(s.el("line", { x1: x, y1: 20, x2: x, y2: 410, stroke: "#c8d3de", "stroke-width": 2, "stroke-dasharray": "5 5" }), T(s, x, 440, s.fmt(t, t < 1 ? 1 : 0) + " V", { size: 19, weight: 600, fill: "#5d6678" })); });
          const rows = [["Solarzelle", 0.5, "0,5 V"], ["AA-Batterie", 1.5, "1,5 V"], ["Flachbatterie", 4.5, "4,5 V"], ["9-V-Block", 9, "9 V"], ["Autobatterie", 12, "12 V"], ["Steckdose", 230, "230 V"], ["S-Bahn, U-Bahn", 750, "750 V"], ["Oberleitung", 15000, "15.000 V"]];
          const bars = rows.map(([n, val, lab], i) => {
            const y = 26 + i * 48, danger = val >= 230, col = danger ? "#dc3b2a" : "#138a5a";
            const r = s.el("rect", { x: X0, y, width: 0, height: 34, rx: 6, fill: col });
            const tl = later(T(s, xOf(val) + 10, y + 25, lab, { anchor: "start", size: 21, fill: col }));
            v.append(T(s, X0 - 12, y + 25, n, { anchor: "end", size: 21 }), r, tl);
            return { r, tl, w: xOf(val) - X0, danger };
          });
          const note = P(s, "Achtung: Jeder Strich nach rechts ist <b>10-mal</b> so viel.", "small", true);
          const m = merk(s, "<span class='green'><b>Grün</b></span>: kleine Spannung, gut für Versuche. <span class='red'><b>Rot</b></span>: <b>Lebensgefahr!</b>", true, 21);
          s.add(s.h("div", { class: "stack", style: { gap: "10px", height: "100%", justifyContent: "center" } }, v, s.h("div", { class: "row", style: { gap: "20px", flexWrap: "nowrap", alignItems: "center" } }, note, m)));
          s.show(v, "fade"); s.sfx.pop();
          const grow = async (b, i) => { s.sfx.count(i); await s.tween({ from: 0, to: b.w, dur: b.danger ? 700 : 380, ease: "out", update: x => b.r.setAttribute("width", x) }); s.show(b.tl, "fade"); if (b.danger) s.sfx.zap(); };
          s.step(async () => { for (let i = 0; i < 5; i++) await grow(bars[i], i); s.say("Batterien haben nur wenige Volt."); });
          s.step(async () => { for (let i = 5; i < 8; i++) await grow(bars[i], i); s.sfx.error(); s.say("Steckdose, S-Bahn und Oberleitung: viel, viel mehr."); });
          s.step(async () => { s.sfx.pop(); await s.show(note, "up"); s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 18 --------------------------------------------------------------- */
      {
        title: "Im Alltag: Strom sparen",
        say: "Der Stromzähler dreht sich, solange Strom gebraucht wird. Tippe auf die Geräte und spare Strom.",
        build(s) {
          const D = [
            ["💡", "Licht im leeren Zimmer", "Licht aus!", 3],
            ["📺", "Fernseher im Standby", "Steckerleiste aus", 1],
            ["🔌", "Ladegerät ohne Handy", "Stecker raus", 0.6],
            ["🔆", "alte Glühlampe", "LED-Lampe rein", 4],
          ];
          const st = D.map(() => false);
          const load = () => D.reduce((a, d, i) => a + (st[i] ? (i === 3 ? d[3] * 0.2 : 0) : d[3]), 0) + 1;
          // meter
          const mv = s.svg(300, 300);
          mv.append(s.el("rect", { x: 20, y: 10, width: 260, height: 280, rx: 18, fill: "#f8fafc", stroke: WIRE, "stroke-width": 4 }),
            s.el("rect", { x: 50, y: 40, width: 200, height: 50, rx: 6, fill: "#1b2740" }),
            s.el("rect", { x: 50, y: 150, width: 200, height: 60, rx: 6, fill: "#fff", stroke: "#9ca3af", "stroke-width": 2 }),
            T(s, 150, 260, "Stromzähler", { size: 21 }));
          const digits = s.el("text", { x: 150, y: 76, "text-anchor": "middle", fill: "#ffd94a", style: { font: "700 30px monospace", letterSpacing: "4px" }, text: "00000" });
          const disc = s.el("rect", { x: 56, y: 172, width: 188, height: 16, rx: 8, fill: "#9ca3af" });
          const mark = s.el("rect", { x: 140, y: 172, width: 20, height: 16, fill: "#dc3b2a" });
          mv.append(digits, disc, mark);
          let kwh = 0;
          s.loop((t, dt) => { const sp = load(); kwh += sp * (dt || 0.016) * 0.8; const ph = (kwh * 1.3) % 1; mark.setAttribute("x", 56 + ph * 168); digits.textContent = String(Math.floor(kwh)).padStart(5, "0"); });
          const tiles = D.map(([e, n, fix], i) => {
            const em = s.h("span", { style: { fontSize: "40px", lineHeight: "1", flex: "none" } }, e);
            const tx = s.h("div", { class: "stack", style: { gap: "2px", textAlign: "left" } }, s.h("b", { style: { fontSize: "21px" } }, n), s.h("span", { class: "small", style: { color: "var(--red)" } }, "verbraucht Strom"));
            const b = s.h("button", { class: "card", style: { display: "flex", gap: "14px", alignItems: "center", cursor: "pointer", padding: "10px 16px", font: "inherit", color: "var(--ink)", minHeight: "76px" }, onclick: () => fixIt(i) }, em, tx);
            b.tx = tx; return b;
          });
          const fixIt = i => {
            if (st[i]) return; st[i] = true; s.sfx.coin();
            const b = tiles[i]; b.style.background = "#e6f6ee"; b.style.borderColor = "#9fd8bd";
            b.tx.lastChild.textContent = "✓ " + D[i][2]; b.tx.lastChild.style.color = "var(--green)";
            b.classList.remove("a-pop"); void b.offsetWidth; b.classList.add("a-pop");
          };
          const fact = exb(s, "Glühlampe oder LED?", P(s, "Eine alte Glühlampe macht aus etwa <b>95 %</b> des Stroms Wärme statt Licht. Eine LED braucht für gleich viel Licht <b>bis zu 80 %</b> weniger Strom.", "small"));
          const m = merk(s, "Strom sparen schont die <b>Umwelt</b> und den Geldbeutel: Licht aus, Geräte ganz ausschalten, LED benutzen.", true, 21);
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "300px 1fr", gap: "24px", alignItems: "center", height: "100%" } },
            mv, stack(s, 12, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } }, ...tiles), fact, m)));
          s.show(mv, "fade"); s.sfx.pop();
          s.step(async () => { fixIt(0); await s.wait(500); fixIt(1); s.say("Der Zähler dreht sich schon langsamer."); });
          s.step(async () => { fixIt(2); await s.wait(400); fixIt(3); s.sfx.pop(); await s.show(fact, "up"); });
          s.step(async () => { s.sfx.success(); await s.show(m, "up"); });
        },
      },
    ],
  });
})();
